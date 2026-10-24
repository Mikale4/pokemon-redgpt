/**
 * How often does the AI pick a move that cannot affect the Pokémon in front of it?
 *
 *   node tools/ai-noeffect-sweep.js [battles] [casual|trainer|ace|expert|all]
 *
 * The failure this measures is the one reported from a real log and fixed in
 * `cannotAffect`: a Grimmsnarl scoring Thunder Wave 95 — its best move — against
 * a Ground-type Gliscor and throwing it every single turn, because nothing in
 * the loop could ever change. This asks how much of that is left, across every
 * difficulty tier, on random teams.
 *
 * §11 governs the shape. Two rules apply directly:
 *
 *  1. **Report the denominator.** "0 of 0" and "0 of 900" are different findings
 *     and must not print the same way. Every rate here prints over the count it
 *     was taken from, and a run that reaches no move decisions says so.
 *  2. **Report the precondition.** A no-effect pick is only possible when a
 *     no-effect move was *in hand*. `opportunities` is that ceiling: 0 picks out
 *     of 0 opportunities is a statement about the teams, not about the chooser.
 *     Only the rate over opportunities is a verdict on the AI.
 *
 * Picks are split further, because they are not the same mistake:
 *
 *   avoidable   some other legal move — including a self-buff — would have
 *               done something                                     <- the blunder
 *   forced      every legal move was a no-effect move; the pick changed nothing
 *
 * The verdict is the engine's own, not a re-implementation: `applyDamagingMove`
 * refuses at `effectiveness(...) === 0` and prints "It doesn't affect...", and
 * `executeMove` refuses aimed status moves by the same test. So the classifier
 * asks `battle.effectiveness(battle.moveType(...), defender, move)` and gates on
 * `battle.aimedAtFoePokemon(move)`, so a self-buff or a hazard is never judged
 * against a typing it was never aimed at.
 *
 * Measured at choice time against the Pokémon the AI was looking at, which is
 * the decision being judged. If the foe switches out afterwards that was luck,
 * not judgement.
 *
 * Nothing here mutates battle state: `moveForIndex` hands back the shared
 * `Dex.move` object, so the probe copies it before attaching `userRef` (which
 * `effectiveness` reads for Scrappy / Mind's Eye), exactly as `executeMove` does.
 *
 * Both sides are `controller: 'human'` and are driven by explicit `AI.chooseAction`
 * calls — two 'ai' controllers make `autoResolve` play the whole battle inside
 * `start()` and the sweep would observe nothing (§8).
 *
 * Ends with a `=== CONTROLS ===` block: fixtures where the answer is known by
 * construction, run through the same classifier and the same `AI.chooseAction`.
 * If a control does not come out as expected the sweep cannot fail, its "0
 * findings" mean nothing, and the run exits 1.
 */
'use strict';

const path = require('path');
const {loadEngine} = require(path.resolve(__dirname, '..', 'tests', 'helpers', 'engine.js'));

const RedGPT = loadEngine();
const {Pokemon, Battle, Formats, RandomTeams, AI, RNG} = RedGPT;

const BATTLES = Number(process.argv[2] || 60);
const TIER_ARG = (process.argv[3] || 'all').toLowerCase();
const ALL_TIERS = ['casual', 'trainer', 'ace', 'expert'];
const TIERS = TIER_ARG === 'all' ? ALL_TIERS : [TIER_ARG];
const FORMAT = Formats.get('anythinggoes');

const pct = (n, d) => (d ? `${(n / d * 100).toFixed(1)}%` : 'n/a');

/**
 * Would this move, used now against this target, be refused for zero effect?
 *
 * Read-only. Returns false for anything not aimed at the foe's Pokémon, so a
 * self-buff is never judged against the foe's typing.
 */
function cannotAffect(battle, attacker, defender, move) {
  if (!move || !attacker || !defender || defender.fainted) return false;
  if (!battle.aimedAtFoePokemon(move)) return false;
  const probe = Object.assign({}, move, {userRef: attacker});
  return battle.effectiveness(battle.moveType(attacker, defender, probe), defender, probe) === 0;
}

/**
 * What could this Pokémon have selected, and how much of it was dead?
 *
 * Read-only, and asked of the engine's own legality list, so PP, Taunt, Encore
 * and Choice locks are all accounted for. `nothingElse` is the strict test:
 * *every* legal move is a no-effect move. A self-buff is never a no-effect move,
 * so having one makes `nothingElse` false — Outrage into a Fairy with Dragon
 * Dance also in the moveset is a blunder, not a Pokémon out of options, and
 * scoring it as "forced" would quietly hide the finding.
 */
function scanOptions(battle, self, foe) {
  const options = battle.availableMoveIndices(self).map(i => battle.moveForIndex(self, i));
  const dead = options.filter(m => cannotAffect(battle, self, foe, m));
  return {options, dead, nothingElse: options.length > 0 && dead.length === options.length};
}

function newStats() {
  return {
    battles: 0,
    turns: 0,
    moveRequests: 0,      // the AI was asked to act at all
    decisions: 0,         // ...and answered with a move rather than a switch
    aimedAtFoe: 0,        // ...and that move was aimed at the foe's Pokémon
    opportunities: 0,     // decisions where at least one legal move was dead   <- the ceiling
    allImmune: 0,         // decisions where *every* legal move was dead
    picks: 0,             // no-effect picks                                    <- the finding
    avoidable: 0,         // ...with some usable move available
    forced: 0,            // ...with nothing usable at all
    byMoveName: new Map(),  // the move alone — which moves the AI throws into a wall
    byMove: new Map(),      // move -> target, so each entry can be checked by hand
    byCategory: new Map(),
  };
}

function bump(map, key) { map.set(key, (map.get(key) || 0) + 1); }

function runSweep(difficulty) {
  const stats = newStats();

  for (let b = 0; b < BATTLES; b++) {
    const rngA = new RNG(`ne-a-${b}`);
    const rngB = new RNG(`ne-b-${b}`);
    const teamA = RandomTeams.randomTeam(rngA, {format: FORMAT, size: 6}).sets;
    const teamB = RandomTeams.randomTeam(rngB, {format: FORMAT, size: 6}).sets;
    const battle = new Battle({
      format: FORMAT,
      seed: 7000 + b,
      sides: [
        {name: 'A', team: teamA, controller: 'human', ai: {difficulty}},
        {name: 'B', team: teamB, controller: 'human', ai: {difficulty}},
      ],
    });
    battle.start();
    stats.battles++;

    let guard = 0;
    while (!battle.ended && guard++ < 400) {
      const side = [0, 1].find(i => battle.needsChoice(i));
      if (side == null) break;
      const request = battle.requests[side];
      const choice = AI.chooseAction(battle, side, request);

      if (request.type === 'move') {
        stats.turns++;
        const self = battle.active(side);
        const foe = battle.active(1 - side);
        if (self && foe && !foe.fainted && !self.fainted) {
          stats.moveRequests++;
          if (choice.type === 'move') {
            stats.decisions++;
            // The ceiling, and whether anything else was on offer.
            const {dead, nothingElse} = scanOptions(battle, self, foe);
            if (dead.length) stats.opportunities++;
            if (nothingElse) stats.allImmune++;

            const chosen = battle.moveForIndex(self, choice.index);
            if (battle.aimedAtFoePokemon(chosen)) {
              stats.aimedAtFoe++;
              if (cannotAffect(battle, self, foe, chosen)) {
                stats.picks++;
                if (nothingElse) stats.forced++;
                else stats.avoidable++;
                bump(stats.byMoveName, chosen.name);
                bump(stats.byMove, `${chosen.name} -> ${foe.species}`);
                bump(stats.byCategory, chosen.category);
              }
            }
          }
        }
      }
      battle.choose(side, choice);
    }
  }
  return stats;
}

function report(difficulty, s) {
  console.log(`\n--- ${difficulty} (${s.battles} battles, ${s.turns} move phases) ---`);
  console.log(`move-phase requests, both sides live: ${s.moveRequests}`);
  console.log(`  answered with a switch instead    : ${s.moveRequests - s.decisions}  (${pct(s.moveRequests - s.decisions, s.moveRequests)})`);
  console.log(`move decisions reached              : ${s.decisions}`);
  if (!s.decisions) {
    console.log('  !! NO MOVE DECISIONS REACHED — this run measures nothing.');
    return;
  }
  console.log(`  of those, aimed at the foe        : ${s.aimedAtFoe}  (${pct(s.aimedAtFoe, s.decisions)})`);
  console.log(`  an immune move was in hand        : ${s.opportunities}  (${pct(s.opportunities, s.decisions)})   <- the ceiling`);
  console.log(`    ...and EVERY legal move was one : ${s.allImmune}  (${pct(s.allImmune, s.decisions)})`);
  if (!s.opportunities) {
    console.log('  !! the AI never held an immune move — 0 picks here says nothing about the chooser.');
  }
  console.log(`no-effect picks                     : ${s.picks}`);
  console.log(`  of all move decisions             : ${pct(s.picks, s.decisions)}   (${s.picks} of ${s.decisions})`);
  console.log(`  of foe-aimed picks                : ${pct(s.picks, s.aimedAtFoe)}   (${s.picks} of ${s.aimedAtFoe})`);
  console.log(`  of turns one was available        : ${pct(s.picks, s.opportunities)}   (${s.picks} of ${s.opportunities})   <- the verdict`);
  console.log(`  avoidable (a usable move existed) : ${s.avoidable}  (${pct(s.avoidable, s.picks)} of picks)   <- the blunder`);
  console.log(`  forced (every legal move was dead) : ${s.forced}  (${pct(s.forced, s.picks)} of picks)`);

  if (s.byCategory.size) {
    const cats = [...s.byCategory.entries()].sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ${v}`).join(', ');
    console.log(`  by category                       : ${cats}`);
  }
  if (s.byMoveName.size) {
    const rows = [...s.byMoveName.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    console.log(`  by move (${rows.length} distinct moves):`);
    for (const [name, n] of rows) console.log(`      ${String(n).padStart(4)}  ${name}`);
    const pairs = [...s.byMove.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    console.log(`  by move -> target (${pairs.length} pairs, top 15 — spot-check these by hand):`);
    for (const [name, n] of pairs.slice(0, 15)) console.log(`      ${String(n).padStart(4)}  ${name}`);
  } else {
    console.log('  by move                           : (none)');
  }
}

/* ------------------------------------------------------------------ *
 * Controls
 *
 * Fixtures whose answer is known by construction, driven through the same
 * `AI.chooseAction` -> `cannotAffect` path as the sweep above. Two of them must
 * be flagged and two must not: a classifier that flags everything is as useless
 * as one that flags nothing, and the exclusion control is the only thing that
 * proves the `aimedAtFoePokemon` gate is doing work rather than passing by luck.
 * ------------------------------------------------------------------ */

const controls = [];

function set(species, moves, options = {}) {
  return Pokemon.normalizeSet(Object.assign({
    species, level: 50, moves, evs: {}, ivs: Pokemon.maxIVs(), nature: 'serious',
  }, options));
}

/** One-Pokémon sides, so no switch is available and the AI must pick a move. */
function fixture(attacker, defender, {difficulty = 'expert', seed = 4242} = {}) {
  const rules = Object.assign({}, FORMAT.rules, {teamPreview: false, forceLevel: null, maxLevel: 100});
  const battle = new Battle({
    format: Object.assign({}, FORMAT, {rules}),
    seed,
    sides: [
      {name: 'Probe', team: [attacker], controller: 'human', ai: {difficulty}},
      {name: 'Wall', team: [defender], controller: 'human', ai: {difficulty}},
    ],
  });
  battle.start();
  const request = battle.requests[0];
  if (!request || request.type !== 'move') return {reached: false};
  const choice = AI.chooseAction(battle, 0, request);
  if (choice.type !== 'move') return {reached: false};
  const self = battle.active(0);
  const foe = battle.active(1);
  const move = battle.moveForIndex(self, choice.index);
  const scan = scanOptions(battle, self, foe);
  return {
    reached: true, move, flagged: cannotAffect(battle, self, foe, move),
    nothingElse: scan.nothingElse, dead: scan.dead.length, options: scan.options.length,
  };
}

function control(name, expected, result) {
  const ok = result.reached && result.flagged === expected;
  controls.push({
    name, ok,
    detail: result.reached
      ? `chose ${result.move.name}, ${result.flagged ? 'flagged' : 'not flagged'} (wanted ${expected ? 'flagged' : 'not flagged'})`
      : 'NO DECISION REACHED — the fixture never asked the AI anything',
  });
}

/** The other half of the finding: is a pick classified forced or avoidable? */
function splitControl(name, expectedForced, result) {
  const ok = result.reached && result.nothingElse === expectedForced;
  controls.push({
    name, ok,
    detail: result.reached
      ? `${result.dead}/${result.options} legal moves dead -> ${result.nothingElse ? 'forced' : 'avoidable'} ` +
        `(wanted ${expectedForced ? 'forced' : 'avoidable'})`
      : 'NO DECISION REACHED — the fixture never asked the AI anything',
  });
}

// 1. Every move immune: a Fighting-only Machamp facing a Ghost. Whatever it
//    picks has to be flagged.
control('damaging move into a type immunity', true,
  fixture(set('machamp', ['closecombat', 'brickbreak', 'machpunch', 'dynamicpunch']),
    set('gengar', ['shadowball'])));

// 2. The reported bug, reduced: an aimed status move into a Ground type.
control('status move into a type immunity', true,
  fixture(set('grimmsnarl', ['thunderwave']), set('gliscor', ['earthquake'])));

// 3. A move that connects must NOT be flagged — a detector that fires on
//    everything would pass control 1 and mean nothing.
control('effective move is not flagged', false,
  fixture(set('gengar', ['shadowball']), set('machamp', ['closecombat'])));

/*
 * 4. The `aimedAtFoePokemon` gate, which stops a move being judged against a
 *    typing it is not aimed at.
 *
 *    The obvious fixture — Swords Dance (a Normal move) against a Ghost — is
 *    **wrong**, and was in this file until a mutation test caught it. Deleting
 *    the gate did not break it, because Swords Dance also carries
 *    `ignoreImmunity: true`, and `effectiveness` honours that for the
 *    Normal/Fighting-vs-Ghost branch: it reads 1 with or without the gate. A
 *    control that passes for two independent reasons is not a control (§11).
 *
 *    Spikes is aimed at the foe's *side*, is Ground-typed, and `ignoreImmunity`
 *    does not rescue Ground against a Flying type — so against Talonflame it
 *    reads 0 and only the gate keeps it unflagged.
 */
control('side-targeting move is excluded', false,
  fixture(set('ferrothorn', ['spikes']), set('talonflame', ['bravebird'])));

// 5-6. The forced/avoidable split, which decides whether a pick is a blunder or
//      a Pokémon out of options. The only difference between these two fixtures
//      is that the second swaps one Fighting move for a self-buff, so an
//      avoidable pick must stop reading as forced the moment one exists.
splitControl('all-immune moveset reads as forced', true,
  fixture(set('machamp', ['closecombat', 'brickbreak', 'machpunch', 'dynamicpunch']),
    set('gengar', ['shadowball'])));

splitControl('a self-buff makes it avoidable', false,
  fixture(set('machamp', ['closecombat', 'brickbreak', 'machpunch', 'bulkup']),
    set('gengar', ['shadowball'])));

/* ------------------------------------------------------------------ *
 * Run
 * ------------------------------------------------------------------ */

console.log(`AI no-effect sweep — ${BATTLES} battles per tier, format ${FORMAT.name || 'anythinggoes'}, ` +
  `tiers: ${TIERS.join(', ')}`);

const totals = newStats();
for (const tier of TIERS) {
  const s = runSweep(tier);
  report(tier, s);
  for (const key of ['battles', 'turns', 'moveRequests', 'decisions', 'aimedAtFoe',
    'opportunities', 'allImmune', 'picks', 'avoidable', 'forced']) {
    totals[key] += s[key];
  }
  for (const [k, v] of s.byMoveName) totals.byMoveName.set(k, (totals.byMoveName.get(k) || 0) + v);
  for (const [k, v] of s.byMove) totals.byMove.set(k, (totals.byMove.get(k) || 0) + v);
  for (const [k, v] of s.byCategory) totals.byCategory.set(k, (totals.byCategory.get(k) || 0) + v);
}

if (TIERS.length > 1) report('ALL TIERS', totals);

console.log('\n=== CONTROLS ===');
for (const {name, ok, detail} of controls) {
  console.log(`  ${ok ? 'ok  ' : 'BROKEN '} ${name}: ${detail}`);
}
const broken = controls.filter(c => !c.ok);
if (broken.length) {
  console.log(`\n!! ${broken.length} control(s) came out wrong.`);
  console.log('!! This sweep cannot be trusted to fire — its numbers, including any 0, mean nothing.');
  process.exitCode = 1;
} else {
  console.log(`  all ${controls.length} controls behaved, so the classifier can both fire and stay quiet.`);
}
