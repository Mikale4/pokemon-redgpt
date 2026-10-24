/**
 * AI difficulty ladder measurement, side-mirrored.
 *
 * Every pairing is played twice on the **same teams and the same battle seed**,
 * with the tiers swapped between side 0 and side 1. That is not a nicety: single-
 * sided sampling in this project carries an uncorrected side-0/side-1 bias worth
 * roughly 18 points, which once made a tuning change look like a 64% -> 73%
 * improvement when it was noise (PROJECT_CONTEXT §10). A mirrored pair cancels it,
 * because each tier plays each side of the identical battle.
 *
 * Written 2026-08-13, because the numbers in §10 had been measured by hand and so
 * could not be re-run — and a change to `random-teams.js` had just invalidated the
 * teams they were measured on. Now they are reproducible.
 *
 *   node tools/ai-ladder.js [gamesPerPairing] [format]
 *
 * `gamesPerPairing` is the number of *mirrored pairs*, so the real battle count is
 * twice that. Seeds are fixed, so the same arguments always reproduce the result.
 *
 * Not part of `npm test`: it is slow, and no test asserts a win rate — that would
 * be flaky and would freeze tuning.
 */
'use strict';

const path = require('path');
const {loadEngine} = require(path.resolve(__dirname, '..', 'tests', 'helpers', 'engine.js'));

const RedGPT = loadEngine();
const {RandomTeams, Formats, RNG, Battle} = RedGPT;

const TIERS = ['casual', 'trainer', 'ace', 'expert'];

/**
 * Play one battle between two tiers on a given team pair.
 *
 * Both sides are `controller: 'ai'`, which makes `autoResolve` play the whole battle
 * inside `start()` (§8) — exactly what a headless measurement wants.
 *
 * @returns {0|1|null} winning side index, or null for a draw.
 */
function play(format, seed, teamA, teamB, tierSide0, tierSide1) {
  const battle = new Battle({
    format,
    seed,
    sides: [
      {name: 'S0', team: teamA, controller: 'ai', ai: {difficulty: tierSide0}},
      {name: 'S1', team: teamB, controller: 'ai', ai: {difficulty: tierSide1}},
    ],
  });
  battle.start();
  let guard = 0;
  // autoResolve normally finishes inside start(); the guard is a backstop for a
  // format that leaves a request open rather than an expected path.
  while (!battle.ended && guard++ < 2000) {
    const pending = [0, 1].find(i => battle.needsChoice(i));
    if (pending == null) break;
    battle.choose(pending, battle.fallbackChoice(pending, battle.requests[pending]));
  }
  return battle.ended ? battle.winner : null;
}

const pairs = Number(process.argv[2] || 60);
const formatName = process.argv[3] || 'random';
const format = Formats.get(formatName);

console.log(`format ${formatName}, ${pairs} mirrored pairs per pairing (${pairs * 2} battles each)\n`);

const rows = [];
for (let a = 0; a < TIERS.length; a++) {
  for (let b = a + 1; b < TIERS.length; b++) {
    const strong = TIERS[b];
    const weak = TIERS[a];
    let strongWins = 0;
    let draws = 0;
    let played = 0;
    for (let i = 0; i < pairs; i++) {
      // One team pair and one battle seed, reused for both orientations.
      const teamRng = new RNG(31_000 + i * 17);
      const teamA = RandomTeams.randomTeam(teamRng, {format: formatName}).sets;
      const teamB = RandomTeams.randomTeam(teamRng, {format: formatName}).sets;
      const seed = 41_000 + i * 13;

      // Orientation 1: strong on side 0.
      let winner = play(format, seed, teamA, teamB, strong, weak);
      if (winner == null) draws++; else { played++; if (winner === 0) strongWins++; }

      // Orientation 2: strong on side 1, same teams and seed.
      winner = play(format, seed, teamA, teamB, weak, strong);
      if (winner == null) draws++; else { played++; if (winner === 1) strongWins++; }
    }
    const rate = played ? Math.round((100 * strongWins) / played) : 0;
    rows.push({strong, weak, rate, played, draws});
    console.log(`  ${strong.padEnd(8)} vs ${weak.padEnd(8)} ${String(rate).padStart(3)}%  (${strongWins}/${played}${draws ? `, ${draws} draws` : ''})`);
  }
}

console.log('\nordering check (each tier should beat every weaker tier):');
let monotonic = true;
for (const row of rows) {
  if (row.rate <= 50) {
    monotonic = false;
    console.log(`  ! ${row.strong} does not beat ${row.weak} (${row.rate}%)`);
  }
}
if (monotonic) console.log('  ok — every stronger tier beats every weaker tier');
