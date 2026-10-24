/**
 * Deep data/engine audits.
 *
 * These are the broad sweeps that found most of the real bugs in this project.
 * They are NOT part of `npm test` — they are slow, and some compare against the
 * live @pkmn packages, which is a moving target. Run them by hand after data
 * work or engine surgery:
 *
 *     node tools/audit.js              # everything
 *     node tools/audit.js species      # one section
 *
 * Sections:
 *   species       typings + base stats vs @pkmn, and bst == sum of the six stats
 *   moves         every move's declared effect actually changes battle state
 *   abilities     every implemented ability observably changes a battle
 *   abilityflags  static scan for ability hooks/flags nothing in the engine reads
 *   items         every implemented item observably changes a battle
 *
 * A finding is not automatically a bug — this project deliberately overrides
 * some values (see LEGACY_BASE_STATS and MOVE_OVERRIDES in generate-data.js).
 * Expect those to show up as differences and check them against the tables.
 *
 * ---------------------------------------------------------------------------
 * EVERY SWEEP CARRIES A CONTROL, AND THE CONTROL IS THE POINT.
 *
 * A sweep that reports "0 findings" has told you nothing until you have watched
 * it fail on purpose. Each section below injects a deliberately inert fixture —
 * an ability with no hooks, an item with no hooks, a move that declares a boost
 * of zero, a species with a deliberately wrong bst — and asserts the sweep
 * flags it. If a control slips through, the run prints VACUOUS and exits 1.
 *
 * This is not hypothetical. The item sweep previously reported a clean bill of
 * health for all 198 items while being *incapable* of failing, for two separate
 * reasons at once:
 *
 *   1. Its state snapshot included `p.item`, so the with-item and without-item
 *      runs differed on the held item itself, before any effect was considered.
 *   2. The snapshot ended in `JSON.stringify(b.field)`, and `field.weatherSource`
 *      is a `Date.now()`-derived uid, so any scenario that set weather differed
 *      no matter what.
 *
 * Both are fixed here: `snapshot()` rewrites every uid to a positional token,
 * and the cross-run diff excludes whatever is different by construction (the
 * item, the ability) while keeping the *observable consequence* of it changing
 * — `item !== baseItem` catches consumption, `ability !== baseAbility` catches
 * Trace and forme changes.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const {loadEngine} = require(path.join(ROOT, 'tests/helpers/engine.js'));

const RedGPT = loadEngine();
const {Dex, Pokemon, Formats, Battle, Abilities, Items} = RedGPT;
const STATS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

const norm = o => Pokemon.normalizeSet(Object.assign(
  {level: 100, moves: ['splash'], evs: {}, ivs: Pokemon.maxIVs(), nature: 'serious'}, o));
function makeBattle(teamA, teamB, seed = 4242) {
  const rules = Object.assign({}, Formats.get('anythinggoes').rules,
    {teamPreview: false, forceLevel: null, maxLevel: 100, itemClause: false, speciesClause: false});
  const battle = new Battle({
    format: Object.assign({}, Formats.get('anythinggoes'), {rules}), seed,
    sides: [{name: 'A', team: teamA.map(norm), controller: 'human'},
      {name: 'B', team: teamB.map(norm), controller: 'human'}],
  });
  battle.start();
  return battle;
}
const report = (title, lines, limit = 40) => {
  console.log(`\n--- ${title}: ${lines.length} ---`);
  for (const line of lines.slice(0, limit)) console.log('  ' + line);
  if (lines.length > limit) console.log(`  ... +${lines.length - limit} more`);
  if (!lines.length) console.log('  none');
};

/* ---------------------------- control plumbing --------------------------- */

const controls = [];
/** Record whether a sweep's deliberately-inert fixture was correctly flagged. */
function control(sweep, fixture, flagged, note = '') {
  controls.push({sweep, fixture, flagged, note});
  console.log(`  control: ${fixture} — ${flagged ? 'flagged (the sweep can fail)' : 'NOT FLAGGED'}${note ? ` ${note}` : ''}`);
}

/* ------------------------------- snapshots ------------------------------- */

/**
 * Party uids come from `Date.now()`, so they differ between any two runs and
 * leak into battle state through `field.weatherSource`, `lastDamageSourceUid`,
 * `conditions.futureSight.attackerUid` and the `attract` / `lockon` volatiles.
 * Rewriting them to their team position makes two runs comparable without
 * throwing away the information that a *different* Pokémon is referenced.
 */
function scrubUids(json, battle) {
  let out = json;
  battle.sides.forEach((side, s) => side.team.forEach((mon, i) => {
    if (mon.uid) out = out.split(mon.uid).join(`mon${s}.${i}`);
  }));
  return out;
}

/**
 * Everything about a battle that an ability or item could observably change.
 *
 * `exclude` drops per-Pokémon keys that differ by construction between the two
 * runs of a comparison — the held item in the item sweep, the ability in the
 * ability sweep. The `*Changed` booleans stay in either way, because an item
 * being consumed or an ability being replaced is a real effect.
 */
function snapshot(battle, exclude = [], dropVolatiles = []) {
  const skip = new Set(exclude);
  const ignoreVolatile = new Set(dropVolatiles);
  const mon = p => {
    const row = {
      hp: p.currentHP, maxHP: p.maxHP, fainted: p.fainted, status: p.status,
      toxic: p.statusData?.toxicCounter, sleep: p.statusData?.sleepTurns,
      boosts: p.boosts, volatiles: Object.keys(p.volatiles).filter(v => !ignoreVolatile.has(v)).sort(),
      types: p.types, species: p.species, terastallized: p.terastallized,
      pp: (p.moves || []).map(m => m.pp), timesHit: p.timesHit,
      item: p.item, itemChanged: p.item !== p.baseItem, consumed: p.consumedItem,
      ability: Dex.toID(p.ability), abilityChanged: Dex.toID(p.ability) !== Dex.toID(p.baseAbility),
    };
    for (const key of skip) delete row[key];
    return row;
  };
  const raw = JSON.stringify({
    sides: battle.sides.map(s => ({conditions: s.conditions, fainted: s.faintedCount, team: s.team.map(mon)})),
    field: battle.field,
    ended: battle.ended, winner: battle.winner ?? null,
  });
  return scrubUids(raw, battle);
}

/**
 * Drive a battle for `turns`, answering forced switches with the first healthy
 * mon, and record the state after every turn in `battle.trace`.
 *
 * The trace matters: comparing only the final state hides any effect the battle
 * later undoes. Shell Bell really does heal, but a scenario that then used Giga
 * Drain refilled both runs to full and the end states matched exactly — the
 * item read as "announced but inert" while working. A per-turn trace catches
 * anything transient.
 */
function play(battle, turns, pickA = () => 0, pickB = () => 0) {
  battle.trace = [];
  for (let turn = 0; turn < turns && !battle.ended; turn++) {
    for (const i of [0, 1]) {
      if (!battle.needsChoice(i)) continue;
      const request = battle.requests[i];
      if (request.type === 'switch') {
        const side = battle.sides[i];
        const index = side.team.findIndex((p, n) => !p.fainted && n !== side.activeIndex);
        if (index >= 0) battle.choose(i, {type: 'switch', index});
      } else {
        battle.choose(i, {type: 'move', index: (i === 0 ? pickA : pickB)(turn)});
      }
    }
    battle.trace.push(snapshot(battle, ['item', 'ability']));
  }
  return battle;
}

/**
 * Run one scenario with and without the thing under test and describe what
 * differed. Scenarios return `{state, log}`; anything that throws is treated as
 * "this scenario does not apply", because the others still cover the subject.
 */
function compare(scenario, subject, baseline) {
  try {
    const withIt = scenario(subject);
    const without = scenario(baseline);
    return {state: withIt.state !== without.state, log: withIt.log !== without.log};
  } catch {
    return {state: false, log: false};
  }
}

/** Does `subject` differ from `baseline` in any scenario? */
function sweepSubject(scenarios, subject, baseline) {
  let log = false;
  for (const scenario of scenarios) {
    const diff = compare(scenario, subject, baseline);
    if (diff.state) return {state: true, log: true};
    if (diff.log) log = true;
  }
  return {state: false, log};
}

/* ------------------------------- species ------------------------------- */

function auditSpecies() {
  console.log('\n=== SPECIES: typings, base stats, bst ===');
  let gen = null;
  try {
    gen = require(path.join(ROOT, 'node_modules/@pkmn/dex')).Dex.forGen(9);
  } catch {
    console.log('  (@pkmn not installed — comparing internal consistency only)');
  }

  const scan = list => {
    const bstWrong = [], typeWrong = [], statDiff = [];
    for (const species of list) {
      const sum = STATS.reduce((total, key) => total + (species.baseStats[key] ?? 0), 0);
      if (sum !== species.bst) bstWrong.push(`${species.name}: bst ${species.bst} but stats sum to ${sum}`);
      if (!gen) continue;
      const upstream = gen.species.get(species.id);
      if (!upstream) continue;
      if ([...species.types].sort().join('/') !== [...upstream.types].sort().join('/')) {
        typeWrong.push(`${species.name}: ${species.types.join('/')} vs upstream ${upstream.types.join('/')}`);
      }
      const diffs = STATS.filter(key => species.baseStats[key] !== upstream.baseStats[key]);
      if (diffs.length) {
        statDiff.push(`${species.name}: ` + diffs.map(k => `${k} ${species.baseStats[k]}/${upstream.baseStats[k]}`).join(', '));
      }
    }
    return {bstWrong, typeWrong, statDiff};
  };

  // Control: a copy of a real species with a bst that does not match its stats
  // and a typing upstream disagrees with. Both checks must flag it.
  const template = Dex.species('pikachu');
  const broken = Object.assign({}, template, {
    baseStats: Object.assign({}, template.baseStats),
    bst: template.bst + 7,
    types: ['Ghost'],
  });
  const probe = scan([broken]);
  control('species', 'a species with a wrong bst',
    probe.bstWrong.length === 1, gen ? `and wrong typing (${probe.typeWrong.length === 1 ? 'flagged' : 'NOT FLAGGED'})` : '(typing needs @pkmn)');

  const found = scan(Dex.allSpecies);
  console.log(`  audited ${Dex.allSpecies.length} species`);
  report('bst disagrees with the six stats (always a bug)', found.bstWrong);
  report('typing differs from @pkmn (always a bug)', found.typeWrong);
  report('base stats differ from @pkmn (expect the LEGACY_BASE_STATS list)', found.statDiff);
}

/* -------------------------------- moves -------------------------------- */

/** Declares an effect and produces none — the shape of a real dead mechanic. */
const CONTROL_MOVE = {
  id: 'auditcontrolmove', num: -1, name: 'Audit Control Move', type: 'Normal', category: 'Status',
  basePower: 0, accuracy: 100, pp: 10, priority: 0, target: 'normal',
  status: null, volatileStatus: null, boosts: {atk: 0}, self: null,
  secondary: null, secondaries: null, drain: null, recoil: null, heal: null, multihit: null,
  critRatio: 1, damage: null, ohko: null, selfdestruct: null, selfSwitch: null, forceSwitch: false,
  sideCondition: null, slotCondition: null, weather: null, terrain: null, pseudoWeather: null,
  stallingMove: false, flags: {}, isNonstandard: null, isZ: false, isMax: false,
  desc: 'Audit control: declares a boost of zero and does nothing.',
  shortDesc: 'Audit control.',
};

function auditMoves() {
  console.log('\n=== MOVES: does each declared effect actually happen? ===');
  const INERT = 'Run Away';
  const probe = makeBattle([{species: 'mew', ability: INERT}], [{species: 'stantler', ability: INERT}]);
  // Per-move counters the engine touches on *every* use. They are bookkeeping,
  // not effects, and leaving them in made this sweep unable to fail: the
  // volatile list changed for a control move that did nothing at all.
  const BOOKKEEPING = ['echoedVoice', 'furyCutter', 'stallCounter', 'rolloutStage'];

  /** @returns {'ok'|'silent'|'failed'} */
  const check = move => {
    // Ghost covers Normal/Fighting immunity; Normal covers Ghost's.
    const target = probe.effectiveness(move.type, probe.sides[1].team[0], move) > 0 ? 'stantler' : 'gengar';
    const battle = makeBattle([{species: 'mew', ability: INERT, moves: [move.id, 'splash']}],
      [{species: target, ability: INERT}], 31337);
    const user = battle.sides[0].team[0];
    const foe = battle.sides[1].team[0];
    user.currentHP = Math.floor(user.maxHP / 2);
    foe.item = 'leftovers';
    foe.lastMoveId = 'tackle';
    user.ateBerry = true;
    const before = snapshot(battle, [], BOOKKEEPING);
    battle.rng.next = () => 0;              // never miss
    battle.rng.chance = () => true;
    battle.executeMove(user, foe, Dex.move(move.id), {index: 0});
    if (snapshot(battle, [], BOOKKEEPING) !== before) return 'ok';
    return battle.log.some(l => /But it failed|doesn't affect|missed/.test(l)) ? 'failed' : 'silent';
  };

  const claimsOf = move => {
    const claims = [];
    if (move.status) claims.push('status');
    if (move.volatileStatus) claims.push('volatile');
    if (move.boosts) claims.push('boosts');
    if (move.sideCondition) claims.push('sideCondition');
    if (move.weather) claims.push('weather');
    if (move.terrain) claims.push('terrain');
    if (move.pseudoWeather) claims.push('pseudoWeather');
    if (move.heal) claims.push('heal');
    if (move.selfdestruct) claims.push('selfdestruct');
    return claims;
  };

  // Control: the inert move must be reported as declaring an effect it does not
  // deliver. Injected into the live move table so it travels the real path.
  Dex.allMoves[CONTROL_MOVE.id] = CONTROL_MOVE;
  let controlVerdict = 'threw';
  try { controlVerdict = check(CONTROL_MOVE); } catch { /* reported as threw */ }
  control('moves', 'a move declaring boosts of zero', controlVerdict !== 'ok', `(reported "${controlVerdict}")`);
  delete Dex.allMoves[CONTROL_MOVE.id];

  const notObserved = [], reportedFailure = [];
  let checked = 0;
  for (const move of Object.values(Dex.allMoves)) {
    const claims = claimsOf(move);
    if (!claims.length) continue;
    checked++;
    const line = `${move.name} [${claims.join('+')}]`;
    try {
      const verdict = check(move);
      if (verdict === 'silent') notObserved.push(line);
      else if (verdict === 'failed') reportedFailure.push(line);
    } catch (error) {
      notObserved.push(`${move.name}: THREW ${error.message}`);
    }
  }
  console.log(`  audited ${checked} moves that declare a verifiable effect`);
  report('declared an effect but nothing changed', notObserved);
  report('the move itself reported failure (check the preconditions)', reportedFailure);
}

/* ------------------------------ abilities ------------------------------ */

/**
 * Behavioural ability sweep.
 *
 * The old check only grepped whether a hook *name* appeared outside
 * abilities.js, which cannot tell a working ability from a declared one — the
 * four Ruin abilities passed it while doing nothing but printing a message.
 * This runs each ability against a genuinely inert packaged ability on the same
 * species and asks whether anything observable differs.
 *
 * Most abilities are pure modifiers that never change stored state in a short
 * battle (Huge Power, Chlorophyll, Levitate, Shadow Tag, Prankster, the Ruin
 * quartet), so `derived` probes the engine's computed values directly. It is
 * both the cheapest scenario and the one that catches the most, so it runs
 * first.
 */
function abilityOwners() {
  const owners = new Map();
  for (const species of Dex.allSpecies) {
    for (const name of Dex.abilityList(species)) {
      const id = Dex.toID(name);
      if (!owners.has(id)) owners.set(id, species.id);
    }
  }
  return owners;
}

function abilityScenarios() {
  const FIELDS = [null, 'sunnyday', 'raindance', 'sandstorm', 'electricterrain'];

  /**
   * Computed values an ability can move without ever writing to battle state.
   * Probed under several field conditions because most of these abilities only
   * apply in one of them.
   */
  const derived = (ability, species) => {
    const readings = [];
    for (const setup of FIELDS) {
      const battle = makeBattle(
        [{species, ability, moves: ['tackle', 'watergun', 'swordsdance', 'shadowball'], item: null}],
        [{species: 'blissey', ability: 'Natural Cure', moves: ['splash']}]);
      const me = battle.sides[0].team[0];
      const foe = battle.sides[1].team[0];
      if (setup) battle.executeMove(foe, me, Dex.move(setup), {index: 0});

      const read = () => {
        readings.push(STATS.map(stat => battle.getStat(me, stat)).join(','));
        readings.push(Dex.TYPES.map(type => battle.effectiveness(type, me, Dex.move('tackle'))).join(','));
        readings.push(String(battle.isGrounded(me)), String(battle.weightOf(me)));
        // `canSwitch` is only "is anyone left on the bench" — it knows nothing
        // about trapping, so reading it here reported Shadow Tag, Arena Trap and
        // Magnet Pull as inert. `isTrapped` is the one that asks the abilities.
        readings.push(String(battle.isTrapped(foe)), String(battle.isTrapped(me)));
        // Every type, both categories, in both directions: the -ate family,
        // Overgrow and friends, Transistor, Steelworker, Thick Fat, Filter.
        readings.push(typeReadings(battle, me, foe), typeReadings(battle, foe, me));
        // Every flag the engine reacts to: Iron Fist, Strong Jaw, Sharpness,
        // Punk Rock, Reckless, Skill Link.
        for (const [flag, move] of Object.entries(FLAG_MOVES)) {
          if (!move) continue;
          readings.push([
            flag,
            battle.modifyValue('onBasePower', me, move.basePower, foe, move),
            battle.modifyValue('onModifyDamage', me, 1000, foe, move),
            battle.modifyValue('onSourceModifyDamage', me, 1000, foe, move),
            battle.modifyValue('onModifyPriority', me, move.priority, move),
            battle.moveType(me, foe, move),
            battle.criticalChance(me, move),
            battle.moveAccuracy(me, foe, move),
            battle.moveAccuracy(foe, me, move),
            // Immunity abilities answer here, not through effectiveness:
            // Levitate, Sap Sipper, Storm Drain, Earth Eater, Wind Rider.
            String(battle.runAbility('onTryHit', me, foe, move)),
            String(battle.runAbility('onImmunity', me, move.type)),
          ].join('/'));
        }
      };
      read();
      // Weakened and statused: Guts, Marvel Scale, Quick Feet, Solar Power,
      // Overgrow, Blaze, Torrent, Swarm and Protosynthesis only read
      // differently once one of those holds.
      me.currentHP = Math.max(1, Math.floor(me.maxHP * 0.2));
      me.status = 'brn';
      read();
      readings.push(String(battle.runAbility('onWeatherDamage', me, battle.field.weather)));
    }
    return {state: readings.join('|'), log: ''};
  };

  /**
   * `forceChance` pins every percentage roll to "it happened".
   *
   * Static, Flame Body, Poison Point, Effect Spore and Cursed Body are 30%
   * abilities: on a fixed seed they usually just do not fire, in both runs, and
   * read as inert. Pinning is safe here *because both runs are pinned the same
   * way* — this is a comparison, not a simulation. (PROJECT_CONTEXT §8 warns
   * that a pinned RNG caused four false alarms; those were single-run harnesses
   * where the pin changed the answer. Here it only makes rare branches visible.)
   */
  const battleScenario = (build, turns, pickA, pickB, forceChance = false) => (ability, species) => {
    const battle = build(ability, species);
    if (forceChance) battle.rng.chance = () => true;
    play(battle, turns, pickA, pickB);
    return {
      state: snapshot(battle, ['ability']) + battle.trace.join('#'),
      log: JSON.stringify(battle.log),
    };
  };

  // onBasePower, onModifyMove, type changes, contact/sound/punch flags, KO hooks.
  const attack = battleScenario((ability, species) => makeBattle(
    [{species, ability, moves: ['tackle', 'watergun', 'swordsdance', 'hypervoice']}],
    [{species: 'blissey', ability: 'Natural Cure', moves: ['splash'], evs: {hp: 252}}]),
  4, turn => turn % 4, () => 0);

  // onTryHit immunities, onSourceModifyDamage, onDamagingHit, contact reactions.
  // Chance is pinned so Static, Flame Body and Poison Point actually fire.
  const defend = battleScenario((ability, species) => makeBattle(
    [{species, ability, moves: ['splash']}],
    [{species: 'mewtwo', ability: 'Pressure', moves: ['flamethrower', 'thunderbolt', 'earthquake', 'closecombat']}]),
  4, () => 0, turn => turn % 4, true);

  // A lethal hit from full HP (Sturdy) and a super-effective one (Filter,
  // Solid Rock, Prism Armor, Weak Armor, Justified, Berserk, Anger Shell).
  const bigHit = battleScenario((ability, species) => makeBattle(
    [{species: 'happiny', ability, moves: ['splash']}, {species: 'furret', moves: ['splash']}],
    [{species: 'mewtwo', ability: 'Pressure', moves: ['closecombat', 'psystrike']}]),
  3, () => 0, () => 0, true);

  /**
   * Each status-inflicting move in its own battle.
   *
   * Running them as four turns of one battle proves nothing past the first: once
   * Will-O-Wisp lands the holder is burned, so Toxic fails in *both* runs and
   * Immunity, Limber, Insomnia, Vital Spirit, Magma Armor, Water Veil and the
   * whole veil family read as inert while working correctly.
   */
  const status = (ability, species) => {
    const readings = [];
    const probes = ['willowisp', 'thunderwave', 'toxic', 'spore', 'confuseray', 'attract',
      'taunt', 'growl', 'leechseed', 'ironhead', 'yawn', 'encore'];
    for (const id of probes) {
      const battle = makeBattle([{species, ability, gender: 'M', moves: ['splash']}],
        [{species: 'smeargle', ability: 'Own Tempo', gender: 'F', moves: [id, 'splash']}]);
      battle.rng.chance = () => true;
      const me = battle.sides[0].team[0];
      const foe = battle.sides[1].team[0];
      try { battle.executeMove(foe, me, Dex.move(id), {index: 0}); } catch { /* next probe */ }
      readings.push([id, me.status, Object.keys(me.volatiles).sort().join('+'),
        Object.values(me.boosts).join(','), me.currentHP,
        foe.status, Object.keys(foe.volatiles).sort().join('+'), Object.values(foe.boosts).join(',')].join('/'));
    }
    return {state: readings.join('|'), log: ''};
  };

  /**
   * Hit by a move of every type: the absorb abilities (Volt Absorb, Water
   * Absorb, Sap Sipper, Flash Fire, Earth Eater, Storm Drain, Dry Skin, Motor
   * Drive, Lightning Rod, Well-Baked Body, Thermal Exchange).
   *
   * Split into batches of four because a Pokémon only carries four moves — an
   * earlier version stopped at twelve of the eighteen types, so the last six
   * were never thrown at anything and their absorb abilities read as inert.
   */
  const elementals = [];
  const attackMoves = Dex.TYPES.map(type => TYPE_MOVES[type][0]).filter(Boolean);
  for (let start = 0; start < attackMoves.length; start += 4) {
    const moves = attackMoves.slice(start, start + 4);
    elementals.push(battleScenario((ability, species) => makeBattle(
      [{species, ability, moves: ['splash']}],
      [{species: 'mew', ability: 'Synchronize', moves}]),
    moves.length, () => 0, turn => turn % moves.length, true));
  }

  // The holder attacking with every flag-bearing move, at low HP so the
  // pinch abilities are live too.
  const flagged = battleScenario((ability, species) => {
    const moves = ['punch', 'bite', 'pulse', 'slicing'].map(f => FLAG_MOVES[f]?.id).filter(Boolean);
    const battle = makeBattle([{species, ability, moves: moves.length ? moves : ['tackle']}],
      [{species: 'blissey', ability: 'Natural Cure', moves: ['splash'], evs: {hp: 252}}]);
    battle.sides[0].team[0].currentHP = Math.max(1, Math.floor(battle.sides[0].team[0].maxHP * 0.2));
    return battle;
  }, 4, turn => turn % 4, () => 0, true);

  // onResidual, onWeatherDamage, weather/terrain reactions over several turns.
  const residual = battleScenario((ability, species) => makeBattle(
    [{species, ability, moves: ['splash']}],
    [{species: 'smeargle', ability: 'Own Tempo', moves: ['sandstorm', 'sunnyday', 'grassyterrain', 'raindance']}]),
  6, () => 0, turn => turn % 4);

  // onStart / onSwitchOut: entry effects, Regenerator, Natural Cure, Trace.
  const entry = (ability, species) => {
    const battle = makeBattle(
      [{species, ability, moves: ['splash', 'uturn']}, {species: 'furret', ability: 'Frisk', moves: ['splash']}],
      [{species: 'gengar', ability: 'Levitate', moves: ['shadowball', 'willowisp']}]);
    const me = battle.sides[0].team[0];
    me.currentHP = Math.floor(me.maxHP / 2);
    me.status = 'brn';
    play(battle, 4, turn => (turn === 0 ? 1 : 0), () => 0);
    return {state: snapshot(battle, ['ability']) + (battle.trace || []).join('#'), log: JSON.stringify(battle.log)};
  };

  // onFaint / onFoeFaint: Moxie, Beast Boost, Aftermath, Battle Bond.
  const faint = (ability, species) => {
    const battle = makeBattle(
      [{species, ability, moves: ['tackle']}, {species: 'furret', ability: 'Frisk', moves: ['splash']}],
      [{species: 'shedinja', ability: 'Wonder Guard', moves: ['splash']},
        {species: 'machamp', ability: 'Guts', moves: ['closecombat']}]);
    const foe = battle.sides[1].team[0];
    foe.currentHP = 1;
    const me = battle.sides[0].team[0];
    me.currentHP = 1;
    play(battle, 4, () => 0, () => 0);
    return {state: snapshot(battle, ['ability']) + (battle.trace || []).join('#'), log: JSON.stringify(battle.log)};
  };

  /**
   * Leaving the field damaged and statused: Regenerator, Natural Cure,
   * Hydration, Shed Skin. Driven as an explicit switch command rather than
   * U-turn so nothing depends on the move connecting.
   */
  const switchOut = (ability, species) => {
    const battle = makeBattle(
      [{species, ability, moves: ['splash']}, {species: 'furret', ability: 'Frisk', moves: ['splash']}],
      [{species: 'blissey', ability: 'Natural Cure', moves: ['splash']}]);
    const me = battle.sides[0].team[0];
    me.currentHP = Math.max(1, Math.floor(me.maxHP * 0.4));
    me.status = 'psn';
    battle.rng.chance = () => true;
    battle.choose(0, {type: 'switch', index: 1});
    battle.choose(1, {type: 'move', index: 0});
    const after = snapshot(battle, ['ability']);
    // ...and back again, for the entry half of the pair.
    if (!battle.ended && battle.needsChoice(0)) {
      battle.choose(0, {type: 'switch', index: 1});
      if (battle.needsChoice(1)) battle.choose(1, {type: 'move', index: 0});
    }
    return {state: after + snapshot(battle, ['ability']), log: JSON.stringify(battle.log)};
  };

  /**
   * End-of-turn ticks while the holder carries a status.
   *
   * Poison Heal, Magic Guard, Shed Skin, Hydration, Early Bird and Leaf Guard
   * all act on the residual phase and need a status already in place — the
   * plain `residual` scenario never applies one, so they all read as inert.
   */
  const statusedResidual = (ability, species) => {
    const readings = [];
    for (const [status, weather] of [['psn', null], ['brn', 'sunnyday'], ['slp', 'raindance'], ['tox', 'sandstorm']]) {
      const battle = makeBattle([{species, ability, moves: ['splash']}],
        [{species: 'smeargle', ability: 'Own Tempo', moves: [weather || 'splash', 'splash']}]);
      const me = battle.sides[0].team[0];
      me.status = status;
      me.statusData.sleepTurns = 3;
      me.currentHP = Math.max(1, Math.floor(me.maxHP * 0.6));
      battle.rng.chance = () => true;
      play(battle, 5, () => 0, () => 0);
      readings.push([status, me.status, me.currentHP, me.statusData.sleepTurns,
        Object.keys(me.volatiles).sort().join('+')].join('/'));
      readings.push(battle.trace.join('#'));
    }
    return {state: readings.join('|'), log: ''};
  };

  // A multi-hit move, for Skill Link and the loaded-dice family.
  const multihit = battleScenario((ability, species) => makeBattle(
    [{species, ability, moves: [FLAG_MOVES.multihit?.id || 'tackle', 'tackle']}],
    [{species: 'blissey', ability: 'Natural Cure', moves: ['splash'], evs: {hp: 252}}]),
  3, () => 0, () => 0, true);

  /**
   * Switching in to a field that is already set.
   *
   * Air Lock and Cloud Nine delete the active weather on entry (PROJECT_CONTEXT
   * §5), and the hazard-immunity and terrain-entry abilities need the floor
   * covered before the holder arrives. The plain `residual` scenario has the foe
   * set weather *after* the holder is already out, so none of them ever fire.
   */
  const enterSetField = (ability, species) => {
    const readings = [];
    for (const setup of ['sunnyday', 'raindance', 'sandstorm', 'grassyterrain', 'stealthrock', 'spikes', 'toxicspikes', 'stickyweb']) {
      const battle = makeBattle(
        [{species: 'furret', ability: 'Frisk', moves: ['splash']}, {species, ability, moves: ['splash']}],
        [{species: 'smeargle', ability: 'Own Tempo', moves: [setup, 'splash']}]);
      battle.rng.chance = () => true;
      battle.choose(0, {type: 'move', index: 0});
      battle.choose(1, {type: 'move', index: 0});
      if (!battle.ended && battle.needsChoice(0)) {
        battle.choose(0, {type: 'switch', index: 1});
        if (battle.needsChoice(1)) battle.choose(1, {type: 'move', index: 1});
      }
      readings.push(setup + ':' + snapshot(battle, ['ability']));
    }
    return {state: readings.join('|'), log: ''};
  };

  return [derived, attack, defend, status, residual, entry, faint,
    bigHit, flagged, switchOut, statusedResidual, multihit, enterSetField, ...elementals];
}

function auditAbilities() {
  console.log('\n=== ABILITIES: does having it change anything? ===');
  const owners = abilityOwners();
  const scenarios = abilityScenarios();

  // Two packaged abilities that are inert by design and have no registry entry:
  // one is the baseline every ability is measured against, the other is injected
  // as a hookless registry entry to prove the sweep can fail.
  const inertPool = Object.keys(Dex.allAbilities)
    .filter(id => !Abilities.registry[id] && Abilities.COSMETIC.has(id));
  const baselineId = inertPool[0];
  const controlId = inertPool[1];
  if (!baselineId || !controlId) {
    console.log('  cannot run: need two packaged inert abilities for the baseline and the control');
    control('abilities', 'hookless ability', false, '(could not be set up)');
    return;
  }
  const baseline = Dex.ability(baselineId).name;
  console.log(`  baseline (inert by design): ${baseline}`);

  const run = (abilityId, species) => {
    const name = Dex.ability(abilityId).name;
    return sweepSubject(scenarios.map(s => subject => s(subject, species)), name, baseline);
  };

  Abilities.registry[controlId] = {id: controlId, name: Dex.ability(controlId).name};
  const controlResult = run(controlId, owners.get(controlId) || 'garchomp');
  control('abilities', `${Dex.ability(controlId).name} with no hooks`,
    !controlResult.state, controlResult.state ? '(the sweep saw an effect that cannot exist)' : '');
  delete Abilities.registry[controlId];

  const inert = [], announcedOnly = [];
  const ids = Object.keys(Abilities.registry);
  for (const id of ids) {
    const species = owners.get(id) || 'garchomp';
    const result = run(id, species);
    if (!result.state) (result.log ? announcedOnly : inert).push(`${Abilities.registry[id].name} (as ${Dex.species(species).name})`);
  }
  console.log(`  audited ${ids.length} implemented abilities`);
  report('no observable effect in any scenario', inert);
  report('changed only the log, never the state (announced but inert)', announcedOnly);
}

/* --------------------------- ability flags ----------------------------- */

function auditAbilityFlags() {
  console.log('\n=== ABILITY FLAGS: hooks and flags nothing reads (static scan) ===');
  console.log('  Weak by nature — hooks are dispatched dynamically by name, so this is');
  console.log('  text matching. `typeChange` is a known false positive: it is read by');
  console.log('  displayMoveType/displayBasePower inside abilities.js, the excluded file.');
  console.log('  The behavioural sweep above is the real check.');
  const consumers = [
    'src/core/battle.js', 'src/core/mechanics.js', 'src/core/ai.js', 'src/core/pokemon.js',
    'src/core/items.js', 'src/core/formats.js', 'src/core/validation.js',
    'src/campaign/run.js', 'src/arena/random-teams.js', 'src/ui/battle-ui.js', 'src/ui/dex-ui.js',
  ].map(f => path.join(ROOT, f)).filter(fs.existsSync)
    .flatMap(f => fs.readFileSync(f, 'utf8').split('\n'))
    .filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line));

  const used = new Map();
  for (const [id, def] of Object.entries(Abilities.registry)) {
    for (const key of Object.keys(def)) {
      if (['name', 'id', 'desc', 'shortDesc', 'num', 'rating'].includes(key)) continue;
      if (!used.has(key)) used.set(key, []);
      used.get(key).push(def.name || id);
    }
  }
  const isRead = key => consumers.some(line =>
    !new RegExp(`^\\s*${key}\\s*[:(]`).test(line) &&
    (new RegExp(`\\.${key}\\b`).test(line) || new RegExp(`['"]${key}['"]`).test(line)));

  // Control: a flag name nothing could possibly read.
  control('abilityflags', 'a flag no engine file mentions', !isRead('auditControlFlagXyz'));

  const dead = [];
  for (const [key, owners] of used) {
    if (!isRead(key)) dead.push(`${key} — declared by ${owners.slice(0, 6).join(', ')}`);
  }
  console.log(`  ${used.size} distinct hooks/flags across ${Object.keys(Abilities.registry).length} abilities`);
  report('never read outside their own definition (verify by hand before acting)', dead);
}

/* -------------------------------- items -------------------------------- */

/** A species the given type hits super-effectively — needed by the resist berries. */
function speciesWeakTo(type) {
  const found = Dex.allSpecies.find(s => Dex.typeEffectiveness(type, s.types) > 1);
  return found ? found.id : 'garchomp';
}

/**
 * One physical and one special move of every type.
 *
 * Type-boosting items and the -ate abilities only react to their own type, so a
 * probe that only ever throws Tackle and Water Gun reports Charcoal, Magnet and
 * all eighteen plates as doing nothing. Built once and reused.
 */
const TYPE_MOVES = (() => {
  const table = {};
  for (const type of Dex.TYPES) {
    const of = category => Object.values(Dex.allMoves).find(m =>
      m.type === type && m.category === category && m.basePower >= 60 &&
      !m.multihit && !m.isNonstandard && m.accuracy >= 90);
    table[type] = [of('Physical'), of('Special')].filter(Boolean).map(m => m.id);
  }
  return table;
})();

/**
 * One representative move per move flag the engine reacts to.
 *
 * Iron Fist, Strong Jaw, Mega Launcher, Sharpness, Punk Rock, Reckless and Skill
 * Link all key off a flag rather than a type, so a probe that only throws Tackle
 * reports every one of them as inert.
 */
const FLAG_MOVES = (() => {
  const all = Object.values(Dex.allMoves);
  const pick = test => all.find(m => m.category !== 'Status' && m.basePower > 0 && !m.isNonstandard && test(m));
  return {
    punch: pick(m => m.flags?.punch),
    bite: pick(m => m.flags?.bite),
    pulse: pick(m => m.flags?.pulse),
    slicing: pick(m => m.flags?.slicing),
    sound: pick(m => m.flags?.sound),
    bullet: pick(m => m.flags?.bullet),
    wind: pick(m => m.flags?.wind),
    contact: pick(m => m.flags?.contact),
    recoil: pick(m => m.recoil),
    multihit: pick(m => m.multihit),
    lowPower: pick(m => m.basePower > 0 && m.basePower <= 60),
    priority: all.find(m => m.category === 'Status' && m.priority === 0 && !m.isNonstandard),
  };
})();

/** Every type's base power and damage as the engine would modify it for `mon`. */
function typeReadings(battle, mon, foe) {
  const readings = [];
  for (const type of Dex.TYPES) {
    for (const id of TYPE_MOVES[type]) {
      const move = Dex.move(id);
      readings.push([
        type, id,
        battle.modifyValue('onBasePower', mon, move.basePower, foe, move),
        battle.modifyValue('onModifyDamage', mon, 1000, foe, move),
        battle.modifyValue('onSourceModifyDamage', foe, 1000, mon, move),
        battle.moveType(mon, foe, move),
        battle.effectiveness(battle.moveType(mon, foe, move), foe, move),
      ].join('/'));
    }
  }
  return readings.join('|');
}

function auditItems() {
  console.log('\n=== ITEMS: does holding it change anything? ===');

  /**
   * Situations an item only reacts to if you set them up first.
   *
   * Without these the sweep reports a hundred perfectly good items as inert:
   * a Cheri Berry does nothing until the holder is paralysed, an Occa Berry
   * until a super-effective Fire move lands, a Leppa Berry until a move is out
   * of PP. Each probe drives the real engine entry point (`checkItemTriggers`,
   * `moveAccuracy`, a full turn) rather than calling the hook by hand, so an
   * item whose hook is declared but never dispatched still shows up as inert.
   */
  const triggered = [
    // Status and confusion cures.
    (item, species) => {
      const readings = [];
      // Report whether the item was *spent*, never which item it is — putting
      // the id in here is what made the old sweep unable to fail.
      for (const status of ['par', 'slp', 'psn', 'tox', 'brn', 'frz']) {
        const b = makeBattle([{species, item, moves: ['splash']}], [{species: 'blissey', moves: ['splash']}]);
        const me = b.sides[0].team[0];
        me.status = status;
        b.checkItemTriggers(me);
        readings.push(`${status}:${me.status}:${me.item !== me.baseItem}`);
      }
      const b = makeBattle([{species, item, moves: ['splash']}], [{species: 'blissey', moves: ['splash']}]);
      const me = b.sides[0].team[0];
      b.addVolatile(me, 'confusion', me);
      b.checkItemTriggers(me);
      readings.push(`confusion:${!!me.volatiles.confusion}:${me.item !== me.baseItem}`);
      b.readings = readings.join('|');
      return b;
    },
    // A move at zero PP (Leppa Berry).
    (item, species) => {
      const b = makeBattle([{species, item, moves: ['tackle', 'splash']}], [{species: 'blissey', moves: ['splash']}]);
      const me = b.sides[0].team[0];
      me.moves[0].pp = 0;
      b.checkItemTriggers(me);
      return b;
    },
    // A super-effective hit of the berry's own type, on a species weak to it.
    (item, species) => {
      const def = Items.registry[item];
      const type = def?.resistType;
      const move = type ? Object.values(Dex.allMoves).find(m =>
        m.type === type && m.category !== 'Status' && m.basePower >= 60 && !m.multihit) : null;
      const holder = type ? speciesWeakTo(type) : species;
      return play(makeBattle([{species: holder, item, moves: ['splash']}],
        [{species: 'mewtwo', moves: [move ? move.id : 'psystrike', 'closecombat', 'shadowball', 'earthquake']}]),
      4, () => 0, turn => turn % 4);
    },
    // Accuracy, evasion and priority, read straight out of the engine.
    (item, species) => {
      const b = makeBattle([{species, item, moves: ['tackle', 'watergun', 'hypervoice', 'irontail']}],
        [{species: 'blissey', item: null, moves: ['tackle', 'irontail']}]);
      const me = b.sides[0].team[0];
      const foe = b.sides[1].team[0];
      const readings = [];
      for (const id of ['tackle', 'irontail', 'hypervoice']) {
        const move = Dex.move(id);
        readings.push([
          b.moveAccuracy(me, foe, move),      // holder attacking: Wide Lens, Zoom Lens
          b.moveAccuracy(foe, me, move),      // holder defending: Bright Powder, Lax Incense
          b.modifyValue('onModifyPriority', me, move.priority, move),
        ].join('/'));
      }
      readings.push(String(b.itemOf(me)?.onFractionalPriority?.(b, me, Dex.move('tackle')) ?? ''));
      b.readings = readings.join('|');
      return b;
    },
    // A miss (Blunder Policy) and a sound move (Throat Spray).
    (item, species) => {
      const b = makeBattle([{species, item, moves: ['hypervoice', 'irontail']}],
        [{species: 'blissey', moves: ['splash']}]);
      const me = b.sides[0].team[0];
      const foe = b.sides[1].team[0];
      b.executeMove(me, foe, Dex.move('hypervoice'), {index: 0});
      b.rng.next = () => 0.999;    // force the miss
      b.executeMove(me, foe, Dex.move('irontail'), {index: 1});
      return b;
    },
    // Trick Room (Room Service), a charge move (Power Herb), a foe boosting
    // (Mirror Herb) and a stat drop taken (the -berry/White Herb family).
    (item, species) => {
      const b = makeBattle([{species, item, moves: ['solarbeam', 'splash']}],
        [{species: 'smeargle', moves: ['trickroom', 'swordsdance', 'growl', 'splash']}]);
      play(b, 4, turn => (turn === 1 ? 0 : 1), turn => turn % 3);
      return b;
    },
    // Both sides have a spare, so Red Card and Eject Button can actually fire.
    (item, species) => play(makeBattle(
      [{species, item, moves: ['splash']}, {species: 'furret', moves: ['splash']}],
      [{species: 'machamp', moves: ['closecombat', 'bulletpunch']}, {species: 'snorlax', moves: ['splash']}]),
    4, () => 0, turn => turn % 2),
    // A lethal hit at full HP: Focus Sash and Focus Band. The holder must be
    // frail but ordinary — an earlier version used Shedinja, whose first ability
    // is Wonder Guard, so the hit never landed at all.
    (item, species) => play(makeBattle(
      [{species: 'happiny', item, ability: 'Natural Cure', moves: ['splash']}, {species: 'furret', moves: ['splash']}],
      [{species: 'mewtwo', moves: ['psystrike', 'closecombat']}]), 2, () => 0, () => 0),
    // Taking a hit of every type while damaged: Absorb Bulb, Cell Battery,
    // Snowball, Luminous Moss, the Kee/Maranga pair, Enigma Berry and Weakness
    // Policy all key off *what* hit them, not merely that something did.
    (item, species) => {
      const b = makeBattle([{species, item, moves: ['splash']}],
        [{species: 'mewtwo', moves: ['surf', 'thunderbolt', 'icebeam', 'closecombat']}]);
      b.sides[0].team[0].currentHP = Math.floor(b.sides[0].team[0].maxHP * 0.75);
      return play(b, 4, () => 0, turn => turn % 4);
    },
    // The holder's own drain, punch and damaging moves while below full HP:
    // Shell Bell, Big Root, Punching Glove. Tackle goes first and the holder
    // starts well down, because the drain moves refill it — with Giga Drain
    // leading, Shell Bell's heal capped out at full HP and the item looked
    // inert while working perfectly (PROJECT_CONTEXT §8, the HP-capping trap).
    (item, species) => {
      const b = makeBattle([{species, item, moves: ['tackle', 'gigadrain', 'drainpunch', 'machpunch']}],
        [{species: 'blissey', moves: ['splash'], evs: {hp: 252}}]);
      b.sides[0].team[0].currentHP = Math.floor(b.sides[0].team[0].maxHP * 0.4);
      return play(b, 4, turn => turn % 4, () => 0);
    },
    // Durations the holder itself sets: Light Clay and the four weather rocks
    // extend something the *holder* put up, so a foe-set field never shows them.
    (item, species) => play(makeBattle(
      [{species, item, moves: ['reflect', 'sunnyday', 'sandstorm', 'raindance']}],
      [{species: 'blissey', moves: ['splash']}]), 4, turn => turn % 4, () => 0),
    // Every terrain, for the four Seeds.
    (item, species) => play(makeBattle(
      [{species, item, moves: ['splash']}],
      [{species: 'smeargle', moves: ['mistyterrain', 'psychicterrain', 'grassyterrain', 'electricterrain']}]),
    4, () => 0, turn => turn % 4),
    // Taunt, attraction, Intimidate and a trapping ability: Mental Herb,
    // Destiny Knot, Adrenaline Orb, Shed Shell.
    (item, species) => play(makeBattle(
      [{species, item, gender: 'M', moves: ['splash']}, {species: 'furret', moves: ['splash']}],
      [{species: 'gothitelle', ability: 'Shadow Tag', gender: 'F', moves: ['taunt', 'attract', 'encore', 'splash']}]),
    4, () => 0, turn => turn % 4),
    // Switching in under every hazard: Heavy-Duty Boots and the Air Balloon
    // family only differ once there is something on the floor.
    (item, species) => {
      const b = makeBattle([{species: 'furret', moves: ['splash']}, {species, item, moves: ['splash']}],
        [{species: 'smeargle', moves: ['stealthrock', 'spikes', 'toxicspikes', 'stickyweb']}]);
      play(b, 4, () => 0, turn => turn % 4);
      // Now bring the holder in over the hazards it is meant to ignore.
      if (!b.ended && b.needsChoice(0)) b.choose(0, {type: 'switch', index: 1});
      else if (!b.ended) { b.choose(0, {type: 'switch', index: 1}); b.choose(1, {type: 'move', index: 0}); }
      return b;
    },
    // Powder moves (Safety Goggles), added secondaries (Covert Cloak), contact
    // abilities (Protective Pads) and an entry ability (Ability Shield).
    (item, species) => play(makeBattle(
      [{species, item, moves: ['tackle']}],
      [{species: 'amoonguss', ability: 'Effect Spore', moves: ['spore', 'sludgebomb', 'ironhead', 'growl']}]),
    4, () => 0, turn => turn % 4),
    // Terrain and binding duration: Terrain Extender and Grip Claw only show up
    // as a difference in how long something lasts.
    (item, species) => play(makeBattle(
      [{species, item, moves: ['grassyterrain', 'wrap']}],
      [{species: 'blissey', moves: ['splash']}]),
    8, turn => (turn === 0 ? 0 : 1), () => 0),
  ];

  const scenarios = [
    (item, species) => play(makeBattle(
      [{species, item, moves: ['tackle', 'watergun', 'swordsdance', 'toxic']}],
      [{species: 'blissey', moves: ['splash'], evs: {hp: 252}}]), 4, turn => turn % 4, () => 0),
    (item, species) => play(makeBattle(
      [{species, item, moves: ['splash']}],
      [{species: 'mewtwo', moves: ['psystrike', 'flamethrower', 'thunderbolt', 'icebeam']}]), 4, () => 0, turn => turn % 4),
    (item, species) => {
      const b = makeBattle([{species, item, moves: ['splash']}], [{species: 'blissey', moves: ['splash']}]);
      const me = b.sides[0].team[0];
      me.currentHP = Math.max(1, Math.floor(me.maxHP * 0.12));
      b.checkItemTriggers(me);
      return b;
    },
    (item, species) => play(makeBattle(
      [{species, item, moves: ['splash']}],
      [{species: 'smeargle', moves: ['willowisp', 'growl', 'sunnyday', 'electricterrain']}]), 4, () => 0, turn => turn % 4),
    (item, species) => play(makeBattle(
      [{species, item, moves: ['splash']}, {species: 'snorlax', moves: ['splash']}],
      [{species: 'machamp', moves: ['closecombat', 'bulletpunch']}]), 3, () => 0, turn => turn % 2),
    // Stat and damage modifiers that never write state: Choice items, Life Orb,
    // Assault Vest, Expert Belt and every type-boosting plate, gem and incense.
    // Run on a not-fully-evolved holder as well, because Eviolite is inert on
    // anything else.
    (item, species) => {
      const b = makeBattle([{species, item, moves: ['tackle', 'watergun', 'swordsdance', 'shadowball']}],
        [{species: 'blissey', moves: ['splash']}]);
      const me = b.sides[0].team[0];
      const foe = b.sides[1].team[0];
      b.readings = [
        STATS.map(s => b.getStat(me, s)).join(','),
        b.weightOf(me), b.isGrounded(me), b.criticalChance(me, Dex.move('tackle')),
        typeReadings(b, me, foe),
      ].join('|');
      return b;
    },
    (item) => {
      const b = makeBattle([{species: 'chansey', item, moves: ['tackle', 'watergun']}],
        [{species: 'blissey', moves: ['splash']}]);
      const me = b.sides[0].team[0];
      b.readings = STATS.map(s => b.getStat(me, s)).join(',');
      return b;
    },
  ].concat(triggered).map(build => (item, species) => {
    const battle = build(item, species);
    // `item` is excluded because it differs by construction; `itemChanged`
    // stays, so consumption still registers.
    return {
      state: snapshot(battle, ['item']) + (battle.trace || []).join('#') + (battle.readings || ''),
      log: JSON.stringify(battle.log),
    };
  });

  /**
   * Species-locked items must be tested on the species they belong to.
   *
   * The registry sometimes says so (`itemUsers`), but the six creation orbs and
   * Soul Dew gate on the species *inside* their hook and declare nothing, so the
   * packaged `itemUser` field is the fallback. Without it they all read as inert
   * because Garchomp is not Dialga.
   */
  const speciesFor = (id, def) => {
    const declared = def.itemUsers?.[0] || Dex.item(id)?.itemUser?.[0];
    return declared && Dex.hasSpecies(declared) ? Dex.species(declared).name : 'garchomp';
  };

  // Control: a packaged item with a registry entry that has no hooks at all.
  //
  // Two ways to get this wrong, both of which happened while writing it:
  // it must be *packaged*, or `normalizeSet` drops it and the control is never
  // equipped (and silently "passes"); and it must be an item the engine has no
  // out-of-registry knowledge of. The first candidate was Abomasite, and Mega
  // Stones are a real in-battle mechanic handled outside the item registry
  // entirely (PROJECT_CONTEXT §5), so it was correctly reported as doing
  // something. A Poké Ball is inert by construction — nothing in a battle can
  // read one.
  const controlId = Object.keys(Dex.allItems).find(id =>
    !Items.registry[id] && Dex.item(id).isPokeball) ||
    Object.keys(Dex.allItems).find(id => {
      const data = Dex.item(id);
      return !Items.registry[id] && !data.megaStone && !data.isBerry && !data.isGem &&
        !data.zMove && !data.onPlate && !data.onMemory && !data.onDrive && !data.boostType;
    });
  if (!controlId) {
    control('items', 'hookless item', false, '(no unimplemented packaged item to borrow)');
  } else {
    Items.registry[controlId] = {id: controlId, name: Dex.item(controlId).name};
    const held = norm({species: 'garchomp', item: controlId}).item === controlId;
    const result = sweepSubject(scenarios.map(s => subject => s(subject, 'garchomp')), controlId, null);
    control('items', `${Dex.item(controlId).name} with no hooks`,
      !result.state && held, held ? '' : '(the control was never equipped — check normalizeSet)');
    delete Items.registry[controlId];
  }

  const inert = [], announcedOnly = [];
  for (const [id, def] of Object.entries(Items.registry)) {
    const species = speciesFor(id, def);
    const result = sweepSubject(scenarios.map(s => subject => s(subject, species)), id, null);
    if (!result.state) (result.log ? announcedOnly : inert).push(def.name || id);
  }
  console.log(`  audited ${Object.keys(Items.registry).length} implemented items`);
  report('no observable effect in any scenario', inert);
  report('changed only the log, never the state (announced but inert)', announcedOnly);
}

/* --------------------------------- run --------------------------------- */

const sections = {
  species: auditSpecies,
  moves: auditMoves,
  abilities: auditAbilities,
  abilityflags: auditAbilityFlags,
  items: auditItems,
};
const requested = process.argv.slice(2).filter(a => sections[a]);
const toRun = requested.length ? requested : Object.keys(sections);
for (const name of toRun) sections[name]();

console.log('\n=== CONTROLS ===');
for (const {sweep, fixture, flagged} of controls) {
  console.log(`  ${flagged ? 'ok  ' : 'VACUOUS'}  ${sweep}: ${fixture}`);
}
const broken = controls.filter(c => !c.flagged);
if (broken.length) {
  console.log(`\n!! ${broken.length} sweep(s) failed their control fixture.`);
  console.log('!! Those sweeps CANNOT FAIL, so their findings — including "0 findings" — mean nothing.');
  process.exitCode = 1;
} else {
  console.log(`  all ${controls.length} controls were flagged, so every sweep above can fail.`);
}
console.log('\nAudit complete. Findings are candidates, not verdicts — confirm each in a real battle.');
