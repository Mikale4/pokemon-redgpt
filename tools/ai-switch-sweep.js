/**
 * Does the AI switch into Pokemon that die before they act?
 *
 *   node tools/ai-switch-sweep.js [battles] [difficulty]
 *
 * Written for a specific rule — a switch-in has to still be standing when its
 * own turn arrives — but the shape is the point. §11's rule is that a sweep
 * whose subject is a *rare* decision must report its own denominator: an earlier
 * switch sweep produced **0 switch decisions in 2,400 calls** and dutifully
 * reported "no difference" for every variant tried, because `switchThreshold` is
 * a matchup margin that ordinary matchups never approach. It looked exactly like
 * a clean result.
 *
 * So this prints, every time:
 *
 *   decisions          how many times a side could have switched at all
 *   switches           how many of those were switches       <- the denominator
 *   fatal switches     switch-ins knocked out before acting  <- the finding
 *
 * "0 fatal switches out of 0 switches" and "0 out of 300" are different results
 * and must not print the same way.
 *
 * Survival is recomputed here from `bestDamage` and `effectiveHP` rather than by
 * calling the engine's own gate, so the sweep is not simply asking the rule
 * whether it followed itself.
 */
'use strict';

const path = require('path');
const {loadEngine} = require(path.resolve(__dirname, '..', 'tests', 'helpers', 'engine.js'));

const RedGPT = loadEngine();
const {Dex, Battle, Formats, RandomTeams, AI, RNG} = RedGPT;

const BATTLES = Number(process.argv[2] || 120);
const DIFFICULTY = process.argv[3] || 'expert';
const FORMAT = Formats.get('anythinggoes');

/** Would `candidate` still be alive on its own turn, coming in against `foe`? */
function survives(battle, candidate, foe) {
  const hit = AI.bestDamage(battle, foe, candidate);
  const hp = AI.effectiveHP(battle, candidate);
  const faster = battle.getStat(candidate, 'spe') > battle.getStat(foe, 'spe');
  const incoming = faster ? hit.damage : hit.damage * 2;
  return {lands: hit.damage < hp, survives: incoming < hp, damage: hit.damage, hp};
}

const stats = {
  decisions: 0, switches: 0, fatalOnEntry: 0, fatalBeforeActing: 0,
  replacements: 0, replacementRevenge: 0, replacementFatal: 0,
  revengeAvailable: 0, revengeTakenWhenAvailable: 0,
  survivorAvailable: 0, fatalDespiteSurvivor: 0,
  turns: 0, battles: 0,
};

for (let b = 0; b < BATTLES; b++) {
  const rngA = new RNG(`sw-a-${b}`);
  const rngB = new RNG(`sw-b-${b}`);
  const teamA = RandomTeams.randomTeam(rngA, {format: FORMAT, size: 6}).sets;
  const teamB = RandomTeams.randomTeam(rngB, {format: FORMAT, size: 6}).sets;
  const battle = new Battle({
    format: FORMAT,
    seed: 9000 + b,
    sides: [
      {name: 'A', team: teamA, controller: 'human', ai: {difficulty: DIFFICULTY}},
      {name: 'B', team: teamB, controller: 'human', ai: {difficulty: DIFFICULTY}},
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

    const self = battle.active(side);
    const foe = battle.active(1 - side);

    if (request.type === 'switch') {
      // A forced replacement after a faint: nothing hit it on the way in.
      stats.replacements++;
      if (choice.type === 'switch' && foe && !foe.fainted) {
        const incoming = battle.sides[side].team[choice.index];
        /*
         * The rate at which the AI revenge-kills is meaningless on its own: it
         * is bounded by how often a revenge killer is sitting on the bench at
         * all. Counting the *available* case is the denominator that turns
         * "39% revenge kills" into "39% of all replacements, but 88% of the
         * replacements where a revenge killer existed" — one is a score, the
         * other is a verdict on the chooser.
         */
        const bench = battle.sides[side].team.filter(p =>
          p && !p.fainted && p !== battle.active(side) && p.currentHP > 0);
        const isRevenge = mon => battle.getStat(mon, 'spe') > battle.getStat(foe, 'spe') &&
          AI.bestDamage(battle, mon, foe).damage >= AI.effectiveHP(battle, foe);
        /*
         * A replacement takes no free hit — it arrives after the faint, and both
         * sides act next turn. So "wasted" here means it never gets to do
         * anything: slower than the foe and knocked out by the foe's best move.
         * Something faster that kills first is never wasted, however frail.
         */
        const actsAtAll = mon => isRevenge(mon) ||
          AI.bestDamage(battle, foe, mon).damage < AI.effectiveHP(battle, mon);
        const revengeAvailable = bench.some(isRevenge);
        const survivorAvailable = bench.some(actsAtAll);
        if (revengeAvailable) stats.revengeAvailable++;
        if (survivorAvailable) stats.survivorAvailable++;
        if (incoming) {
          if (isRevenge(incoming)) {
            stats.replacementRevenge++;
            if (revengeAvailable) stats.revengeTakenWhenAvailable++;
          }
          if (!actsAtAll(incoming)) {
            stats.replacementFatal++;
            if (survivorAvailable) stats.fatalDespiteSurvivor++;
          }
        }
      }
    } else if (request.type === 'move') {
      if (request.canSwitch && self && foe && !foe.fainted) {
        stats.decisions++;
        if (choice.type === 'switch') {
          stats.switches++;
          const incoming = battle.sides[side].team[choice.index];
          if (incoming) {
            const verdict = survives(battle, incoming, foe);
            if (!verdict.lands) stats.fatalOnEntry++;
            else if (!verdict.survives) stats.fatalBeforeActing++;
          }
        }
      }
      stats.turns++;
    }
    battle.choose(side, choice);
  }
}

const pct = (n, d) => d ? `${(n / d * 100).toFixed(1)}%` : 'n/a';
console.log(`difficulty ${DIFFICULTY}, ${stats.battles} battles\n`);
console.log(`voluntary switch decisions reached : ${stats.decisions}`);
console.log(`  of those, switches taken         : ${stats.switches}  (${pct(stats.switches, stats.decisions)})`);
if (!stats.switches) {
  console.log('  !! NO SWITCHES PRODUCED — this sweep proves nothing. Build lopsided positions.');
} else {
  console.log(`  switch-ins KO'd on entry         : ${stats.fatalOnEntry}  (${pct(stats.fatalOnEntry, stats.switches)})`);
  console.log(`  switch-ins KO'd before acting    : ${stats.fatalBeforeActing}  (${pct(stats.fatalBeforeActing, stats.switches)})`);
  console.log(`  -> total doomed switches         : ${stats.fatalOnEntry + stats.fatalBeforeActing}  ` +
    `(${pct(stats.fatalOnEntry + stats.fatalBeforeActing, stats.switches)})`);
}
console.log(`\nforced replacements after a faint  : ${stats.replacements}`);
if (stats.replacements) {
  console.log(`  that revenge-kill (faster + KO)   : ${stats.replacementRevenge}  (${pct(stats.replacementRevenge, stats.replacements)})`);
  console.log(`    a revenge killer was on the bench: ${stats.revengeAvailable}  <- the ceiling`);
  console.log(`    and the AI took it              : ${stats.revengeTakenWhenAvailable}  (${pct(stats.revengeTakenWhenAvailable, stats.revengeAvailable)} of when it existed)`);
  console.log(`  wasted (slower AND KO'd, never acts): ${stats.replacementFatal}  (${pct(stats.replacementFatal, stats.replacements)})`);
  console.log(`    a non-wasted option existed     : ${stats.survivorAvailable}`);
  console.log(`    yet a wasted one was sent       : ${stats.fatalDespiteSurvivor}  (${pct(stats.fatalDespiteSurvivor, stats.survivorAvailable)} of when a better option existed)`);
}
