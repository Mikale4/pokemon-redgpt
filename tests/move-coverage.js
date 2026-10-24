/**
 * Coverage audits.
 *
 * A move must never be able to enter the playable database while silently doing
 * nothing: every packaged move is both mapped to an execution path and actually
 * executed here. Abilities and items are audited too, and anything without an
 * implementation is reported so the UI can label it honestly.
 */
'use strict';

const {createSuite} = require('./helpers/assert');
const {loadEngine} = require('./helpers/engine');

const suite = createSuite('move-coverage');
const {test, assert, finish} = suite;

const RedGPT = loadEngine();
const {Dex, Pokemon, Formats, Battle} = RedGPT;
const C = RedGPT.BattleConstants;

/** A move is "mapped" when the executor has a branch that can act on it. */
function isMapped(move) {
  return move.basePower > 0 ||
    move.damage != null || move.ohko ||
    C.FIXED_DAMAGE_MOVES.has(move.id) ||
    C.DYNAMIC_POWER_MOVES.has(move.id) ||
    C.STATUS_SPECIAL_MOVES.has(move.id) ||
    C.CHARGE_MOVES.has(move.id) ||
    C.SELF_SWITCH_MOVES.has(move.id) ||
    C.FORCE_SWITCH_MOVES.has(move.id) ||
    C.HAZARD_REMOVAL_MOVES.has(move.id) ||
    !!move.heal || !!move.status || !!move.volatileStatus || !!move.boosts ||
    !!move.self || !!move.secondary || !!(move.secondaries && move.secondaries.length) ||
    !!move.sideCondition || !!move.slotCondition || !!move.weather || !!move.terrain ||
    !!move.pseudoWeather || !!move.selfSwitch || !!move.forceSwitch || !!move.stallingMove ||
    !!move.callsMove || move.id === 'rest' || move.id === 'transform';
}

test('every packaged move maps to a battle execution path', () => {
  const unmapped = Object.values(Dex.allMoves).filter(m => !isMapped(m)).map(m => m.name);
  assert.deepStrictEqual([...unmapped], [], `unmapped moves: ${unmapped.join(', ')}`);
});

test('every move id in every Mechanics table resolves to a packaged move', () => {
  // A typo here is invisible: the id simply never matches, so the mechanic is
  // silently absent while the table still claims to cover it. `fickelbeam` sat
  // in DYNAMIC_POWER_MOVES this way, leaving Fickle Beam a flat 80 BP, and
  // PROTECT_MOVES listed the unpackaged Dynamax move `maxguard`.
  //
  // `Dex.move()` returns a truthy UNKNOWN_MOVE stub for anything it does not
  // have, so the predicate must be `Dex.hasMove` — checking `Dex.move(id)`
  // would pass every typo. Two tables hold targets and stat keys rather than
  // move ids and are excluded by name.
  const NOT_MOVE_TABLES = new Set(['BOOST_KEYS', 'NON_FOE_TARGETS']);
  // Sets built inside the engine's VM sandbox have a different Set.prototype,
  // so `instanceof Set` is false here — duck-type on iterability instead.
  const isIdTable = value => value && typeof value === 'object' &&
    typeof value[Symbol.iterator] === 'function';

  // Read Mechanics, not BattleConstants: the latter re-exports only a subset
  // (it omits PROTECT_MOVES, which is where `maxguard` was hiding).
  const problems = [];
  let tables = 0, ids = 0;
  for (const [name, value] of Object.entries(RedGPT.Mechanics)) {
    if (NOT_MOVE_TABLES.has(name) || !isIdTable(value)) continue;
    tables++;
    for (const id of value) {
      ids++;
      if (!Dex.hasMove(id)) problems.push(`${name} contains "${id}", which is not a packaged move`);
    }
  }
  assert.ok(tables >= 14, `only ${tables} move tables found — did the export shape change?`);
  assert.ok(ids >= 250, `only ${ids} ids checked — the tables look empty`);
  assert.deepStrictEqual([...problems], [], problems.join('; '));
});

test('BattleConstants does not drift from the Mechanics tables it mirrors', () => {
  // BattleConstants re-exports a hand-written subset of Mechanics. Re-exporting
  // a *copy* rather than the same object would let the two disagree silently.
  const shared = Object.keys(C).filter(key => key in RedGPT.Mechanics);
  assert.ok(shared.length >= 15, `only ${shared.length} shared keys`);
  const drifted = shared.filter(key => C[key] !== RedGPT.Mechanics[key]);
  assert.deepStrictEqual([...drifted], [], `BattleConstants holds a separate copy of: ${drifted.join(', ')}`);
});

test('every forme table id resolves, and every forme-changer is listed', () => {
  // These two tables are what the Pokemon menu reads to offer a forme toggle.
  // An id that does not resolve, or an implemented forme-changing ability that
  // is missing from ABILITY_FORMES, means a forme the player can reach but
  // never see — which is exactly how Greninja-Ash went missing.
  const M = RedGPT.Mechanics;
  const problems = [];

  for (const [itemId, mapping] of Object.entries(M.FORME_CHANGE_ITEMS)) {
    if (!Dex.item(itemId)) problems.push(`FORME_CHANGE_ITEMS: "${itemId}" is not a packaged item`);
    for (const [base, target] of Object.entries(mapping)) {
      if (!Dex.hasSpecies(base)) problems.push(`FORME_CHANGE_ITEMS ${itemId}: base "${base}" is not a species`);
      if (!Dex.hasSpecies(target)) problems.push(`FORME_CHANGE_ITEMS ${itemId}: target "${target}" is not a species`);
    }
  }
  for (const [abilityId, entries] of Object.entries(M.ABILITY_FORMES)) {
    if (!RedGPT.Abilities.registry[abilityId]) {
      problems.push(`ABILITY_FORMES: "${abilityId}" is not an implemented ability`);
    }
    for (const entry of entries) {
      if (!Dex.hasSpecies(entry.from)) problems.push(`ABILITY_FORMES ${abilityId}: from "${entry.from}" is not a species`);
      if (!Dex.hasSpecies(entry.to)) problems.push(`ABILITY_FORMES ${abilityId}: to "${entry.to}" is not a species`);
      if (!entry.when) problems.push(`ABILITY_FORMES ${abilityId}: missing the "when" explanation`);
    }
  }

  // Every implemented ability that changes forme must be reachable from the
  // menu. Item-driven ones live in FORME_CHANGE_ITEMS instead.
  const ITEM_DRIVEN = new Set(['zerotohero', 'multitype', 'rkssystem']);
  const FORME_CHANGERS = ['stancechange', 'zenmode', 'schooling', 'powerconstruct', 'forecast',
    'flowergift', 'hungerswitch', 'terashift', 'disguise', 'iceface', 'battlebond',
    'zerotohero', 'multitype', 'rkssystem'];
  for (const id of FORME_CHANGERS) {
    if (!RedGPT.Abilities.registry[id]) { problems.push(`${id} should be implemented`); continue; }
    if (ITEM_DRIVEN.has(id)) continue;
    if (!M.ABILITY_FORMES[id]) problems.push(`${id} changes forme but is not in ABILITY_FORMES`);
  }
  assert.deepStrictEqual([...problems], [], problems.join('; '));
});

test('reachableFormes reports a forme only when it is actually reachable', () => {
  const formes = set => RedGPT.Mechanics.reachableFormes(Pokemon.normalizeSet(set)).map(f => f.id);
  // Held-item routes appear only while the item is held.
  assert.deepStrictEqual([...formes({species: 'blaziken', item: 'blazikenite', moves: ['tackle']})], ['blazikenmega']);
  assert.deepStrictEqual([...formes({species: 'blaziken', moves: ['tackle']})], []);
  assert.deepStrictEqual([...formes({species: 'groudon', item: 'redorb', moves: ['tackle']})], ['groudonprimal']);
  assert.deepStrictEqual([...formes({species: 'palafin', item: 'herocharm', moves: ['tackle']})], ['palafinhero']);
  // Rayquaza needs the move, not a stone.
  assert.deepStrictEqual([...formes({species: 'rayquaza', moves: ['dragonascent']})], ['rayquazamega']);
  assert.deepStrictEqual([...formes({species: 'rayquaza', moves: ['tackle']})], []);
  // Ability routes, including the one that was missing.
  assert.deepStrictEqual([...formes({species: 'greninja', ability: 'Battle Bond', moves: ['tackle']})], ['greninjaash']);
  assert.deepStrictEqual([...formes({species: 'aegislash', ability: 'Stance Change', moves: ['tackle']})], ['aegislashblade']);
  assert.strictEqual(formes({species: 'castform', ability: 'Forecast', moves: ['tackle']}).length, 3);
  // Nothing to offer.
  assert.deepStrictEqual([...formes({species: 'pikachu', moves: ['tackle']})], []);
});

test('the Mechanics table check can actually fail', () => {
  // Control for the test above: prove the predicate rejects a bad id rather
  // than waving everything through, which is how the typo survived.
  assert.strictEqual(Dex.hasMove('ficklebeam'), true);
  assert.strictEqual(Dex.hasMove('fickelbeam'), false, 'hasMove accepts a typo');
  assert.ok(Dex.move('fickelbeam').missing, 'Dex.move stubs unknown ids — never use it as the predicate');
});

test('Fickle Beam can double its power', () => {
  const rules = Object.assign({}, Formats.get('anythinggoes').rules, {teamPreview: false, forceLevel: null, maxLevel: 100});
  const format = Object.assign({}, Formats.get('anythinggoes'), {rules});
  const build = (species, moves) => Pokemon.normalizeSet({species, level: 100, moves, nature: 'serious'});
  const battle = new Battle({
    format, seed: 4242,
    sides: [{name: 'A', team: [build('mew', ['ficklebeam', 'tackle'])], controller: 'human'},
      {name: 'B', team: [build('blissey', ['splash'])], controller: 'human'}],
  });
  battle.start();
  const attacker = battle.sides[0].team[0];
  const defender = battle.sides[1].team[0];
  const move = Dex.move('ficklebeam');

  battle.rng.chance = () => false;
  assert.strictEqual(battle.dynamicBasePower(attacker, defender, move), 80, 'normal power');
  battle.rng.chance = () => true;
  assert.strictEqual(battle.dynamicBasePower(attacker, defender, move), 160, 'doubled power');
  // Preview must be deterministic and must not draw from the mechanics RNG.
  battle.rng.chance = () => { throw new Error('preview drew from battle.rng'); };
  assert.strictEqual(battle.dynamicBasePower(attacker, defender, move, {preview: true}), 104);
});

test('previewing a move never mutates the battle', () => {
  // AI scoring and the damage calculator ask what a move *would* do. Magnitude
  // and Present used to answer by rolling: that advanced the mechanics RNG
  // (which replays never do, so playback desynchronised), logged "Magnitude 8!"
  // before anything was chosen, and Present really healed the target.
  const rules = Object.assign({}, Formats.get('anythinggoes').rules, {teamPreview: false, forceLevel: null, maxLevel: 100});
  const format = Object.assign({}, Formats.get('anythinggoes'), {rules});
  const build = (species, moves) => Pokemon.normalizeSet({species, level: 100, moves, nature: 'serious'});

  for (const moveId of ['magnitude', 'present', 'ficklebeam']) {
    const battle = new Battle({
      format, seed: 909,
      sides: [{name: 'A', team: [build('garchomp', [moveId, 'tackle'])], controller: 'human'},
        {name: 'B', team: [build('blissey', ['splash'])], controller: 'human'}],
    });
    battle.start();
    const attacker = battle.sides[0].team[0];
    const defender = battle.sides[1].team[0];
    defender.currentHP = Math.floor(defender.maxHP / 2);

    const rngBefore = JSON.stringify(battle.rng.getState());
    const logBefore = battle.log.length;
    const hpBefore = defender.currentHP;

    RedGPT.AI.estimateDamage(battle, attacker, defender, Dex.move(moveId));

    assert.strictEqual(JSON.stringify(battle.rng.getState()), rngBefore, `${moveId} advanced battle.rng`);
    assert.strictEqual(battle.log.length, logBefore, `${moveId} wrote to the log`);
    assert.strictEqual(defender.currentHP, hpBefore, `${moveId} changed the target's HP`);
  }
});

test('every packaged move executes without throwing', () => {
  const failures = [];
  const rules = Object.assign({}, Formats.get('anythinggoes').rules, {teamPreview: false, forceLevel: null, maxLevel: 100});
  const format = Object.assign({}, Formats.get('anythinggoes'), {rules});

  const build = moveId => Pokemon.normalizeSet({
    species: 'mew', level: 100, moves: [moveId, 'tackle'], nature: 'serious',
  });
  const foeSet = Pokemon.normalizeSet({species: 'mewtwo', level: 100, moves: ['tackle', 'quickattack'], nature: 'serious'});
  const allySet = Pokemon.normalizeSet({species: 'eevee', level: 100, moves: ['tackle'], nature: 'serious'});
  const foeAllySet = Pokemon.normalizeSet({species: 'snorlax', level: 100, moves: ['tackle'], nature: 'serious'});

  for (const moveId of Object.keys(Dex.allMoves)) {
    try {
      const battle = new Battle({
        format, seed: 4242,
        sides: [
          {name: 'A', team: [build(moveId), allySet], controller: 'human'},
          {name: 'B', team: [foeSet, foeAllySet], controller: 'human'},
        ],
      });
      battle.start();
      const attacker = battle.sides[0].team[0];
      const defender = battle.sides[1].team[0];

      // Preconditions so conditional moves reach their real code path.
      if (['sleeptalk', 'snore'].includes(moveId)) { attacker.status = 'slp'; attacker.statusData.sleepTurns = 2; }
      if (moveId === 'belch') attacker.ateBerry = true;
      if (moveId === 'fling') attacker.item = 'lifeorb';
      // Berry-eating moves need a Berry in the right hand, or they fail before
      // reaching the force-eat path and this sweep never executes it.
      if (['stuffcheeks', 'teatime'].includes(moveId)) attacker.item = 'sitrusberry';
      if (['bugbite', 'pluck'].includes(moveId)) defender.item = 'sitrusberry';
      // No Poltergeist or Dream Eater preconditions: both are unconditional in
      // this project, so setting up a held item or a sleeping target would be
      // arranging a state the move no longer consults — and would hide it if the
      // condition were ever reintroduced.
      if (['spitup', 'swallow'].includes(moveId)) attacker.volatiles.stockpile = 3;
      if (moveId === 'counter') { attacker.damageTakenThisTurn = 20; attacker.lastDamageCategory = 'Physical'; attacker.lastDamageSourceUid = defender.uid; }
      if (moveId === 'mirrorcoat') { attacker.damageTakenThisTurn = 20; attacker.lastDamageCategory = 'Special'; attacker.lastDamageSourceUid = defender.uid; }
      if (['metalburst', 'comeuppance'].includes(moveId)) { attacker.damageTakenThisTurn = 20; attacker.lastDamageSourceUid = defender.uid; }
      if (moveId === 'recycle') attacker.consumedItem = 'sitrusberry';
      if (moveId === 'endeavor') attacker.currentHP = 10;

      battle.turnActions = {1: {kind: 'move', move: Dex.move('quickattack'), side: 1}};
      battle.executeMove(attacker, defender, Dex.move(moveId), {index: 0});

      for (const side of battle.sides) {
        for (const mon of side.team) {
          if (!Number.isFinite(mon.currentHP)) throw new Error(`${mon.name} has non-finite HP`);
        }
      }
    } catch (error) {
      failures.push(`${moveId}: ${error.message}`);
    }
  }
  assert.deepStrictEqual(failures.slice(0, 8), []);
});

test('ability coverage is accounted for and substantial', () => {
  const coverage = RedGPT.Abilities.coverage();
  assert.strictEqual(coverage.total, Object.keys(Dex.allAbilities).length);
  assert.ok(coverage.implemented.length >= 200,
    `only ${coverage.implemented.length} abilities implemented`);
  // Everything that is neither implemented nor deliberately inert must be
  // reportable, so the UI can flag it rather than pretending it works.
  const unaccounted = coverage.missing.filter(id => RedGPT.Abilities.isSimulated(id));
  assert.deepStrictEqual([...unaccounted], []);
});

test('the competitively important abilities are implemented', () => {
  const required = ['intimidate', 'levitate', 'multiscale', 'regenerator', 'drizzle', 'drought',
    'sandstream', 'snowwarning', 'protosynthesis', 'quarkdrive', 'adaptability', 'technician',
    'hugepower', 'purepower', 'guts', 'magicguard', 'sturdy', 'clearbody', 'prankster', 'speedboost',
    'moxie', 'unaware', 'thickfat', 'waterabsorb', 'voltabsorb', 'flashfire', 'sheerforce',
    'toughclaws', 'serenegrace', 'skilllink', 'naturalcure', 'poisonheal', 'static', 'roughskin'];
  const missing = required.filter(id => !RedGPT.Abilities.registry[id]);
  assert.deepStrictEqual([...missing], []);
});

test('item coverage is accounted for and includes every staple', () => {
  const coverage = RedGPT.Items.coverage();
  assert.ok(coverage.implemented.length >= 100, `only ${coverage.implemented.length} items implemented`);
  const required = ['leftovers', 'lifeorb', 'choiceband', 'choicespecs', 'choicescarf', 'focussash',
    'assaultvest', 'eviolite', 'rockyhelmet', 'heavydutyboots', 'blacksludge', 'sitrusberry',
    'lumberry', 'airballoon', 'weaknesspolicy', 'boosterenergy', 'lightclay', 'expertbelt',
    'toxicorb', 'flameorb', 'loadeddice', 'covertcloak', 'clearamulet'];
  const missing = required.filter(id => !RedGPT.Items.registry[id]);
  assert.deepStrictEqual([...missing], []);
  const unaccounted = coverage.missing.filter(id => RedGPT.Items.isSimulated(id));
  assert.deepStrictEqual([...unaccounted], []);
});

test('no implemented ability or item references a move or item that does not exist', () => {
  const problems = [];
  for (const [id] of Object.entries(RedGPT.Abilities.registry)) {
    if (!Dex.allAbilities[id]) problems.push(`ability ${id} is not in the dataset`);
  }
  for (const [id] of Object.entries(RedGPT.Items.registry)) {
    if (!Dex.item(id)) problems.push(`item ${id} is not in the dataset`);
  }
  assert.deepStrictEqual([...problems], []);
});

test('every move with an empty secondary is special-cased by the engine', () => {
  // Showdown implements some secondaries with an onHit function, which does not
  // survive data export — the packaged move keeps a 100% secondary with an empty
  // payload. Those moves look "mapped" but would silently do nothing, so each one
  // has to be handled by id in battle.js. A data rebuild that adds a new one must
  // fail here rather than ship a dead effect.
  const handledById = new Set([
    'alluringvoice', 'anchorshot', 'burningjealousy', 'ceaselessedge', 'diamondstorm',
    'direclaw', 'eeriespell', 'spiritshackle', 'stoneaxe', 'throatchop', 'triattack',
  ]);
  const empty = [];
  for (const move of Object.values(Dex.allMoves)) {
    const list = move.secondaries?.length ? move.secondaries : (move.secondary ? [move.secondary] : []);
    if (!list.length) continue;
    if (list.some(s => s && (s.status || s.volatileStatus || s.boosts || s.self))) continue;
    empty.push(move.id);
  }
  const unhandled = empty.filter(id => !handledById.has(id));
  assert.deepStrictEqual([...unhandled], [],
    `moves with an empty secondary and no engine implementation: ${unhandled.join(', ')}`);
  const stale = [...handledById].filter(id => !empty.includes(id));
  assert.deepStrictEqual([...stale], [], `no longer empty, drop from the list: ${stale.join(', ')}`);
});

test('the coverage report is what the UI shows', () => {
  const abilities = RedGPT.Abilities.coverage();
  const items = RedGPT.Items.coverage();
  console.log(`        abilities: ${abilities.implemented.length} implemented, ${abilities.cosmetic.length} inert, ${abilities.missing.length} not simulated`);
  console.log(`        items:     ${items.implemented.length} implemented, ${items.cosmetic.length} inert, ${items.missing.length} not simulated`);
  assert.ok(true);
});

finish();
