#!/usr/bin/env node
/*
 * Regenerate the damage rows in `docs/UU_TIERING_EVIDENCE_PROMPT.md` that were
 * proved wrong, from explicitly declared sets.
 *
 * WHY THIS EXISTS
 *
 * The packet's rows were generated ad hoc, and two of its attacker groups were
 * built by `Pokemon.normalizeSet` WITHOUT naming an ability — which silently
 * takes **slot 0**. Dracovish's slot 0 is Water Absorb, not Strong Jaw; Scizor's
 * is Swarm, not Technician. Both are 1.5x multipliers on the exact move being
 * measured, so every one of those rows was understated by a third.
 *
 * The tell is visible in the document itself: the Azumarill rows DO name
 * "Huge Power" in the attacker cell and are correct. Where the ability was
 * named it was set; where it was not, the default won.
 *
 * The Fishious Rend rows carried a second, independent defect. They were
 * generated before the calculator could express `hasActedThisTurn`, so the
 * "moving first (doubled)" and "moving second (not doubled)" rows were the same
 * calculation twice and printed identical numbers. `Calculator.applyState` now
 * takes `hasMoved`, so both states are real here.
 *
 *   node tools/evidence-calcs.js           rewrite the affected rows
 *   node tools/evidence-calcs.js --check   report drift, write nothing, exit 1
 *
 * SCOPE, STATED PLAINLY: this rewrites only the rows whose sets are declared
 * below. It does NOT re-verify the rest of the packet. The attacker cells there
 * are inconsistent — some state EVs and a nature, some state none — so their
 * sets cannot be recovered from the text, and inventing them would produce
 * numbers that look authoritative and could be wrong in a new way, which is the
 * failure being fixed. The block carries a warning saying so.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {loadEngine} = require('../tests/helpers/engine.js');

const ROOT = path.join(__dirname, '..');
const DOC = path.join(ROOT, 'docs/UU_TIERING_EVIDENCE_PROMPT.md');
const CHECK = process.argv.includes('--check');
const {Calculator} = loadEngine();

/** Defenders exactly as the document's own spread text describes them. */
const D = {
  'Mega Slowbro 252 HP / 252+ Def Bold, no item (stone)':
    {species: 'Slowbro-Mega', item: '', nature: 'Bold', evs: {hp: 252, def: 252}, moves: ['scald']},
  'Tapu Fini 252 HP / 252+ SpD Calm, Leftovers':
    {species: 'Tapu Fini', item: 'leftovers', nature: 'Calm', evs: {hp: 252, spd: 252}, moves: ['moonblast']},
  'Primarina 252 HP / 252+ SpD Calm, Leftovers':
    {species: 'Primarina', item: 'leftovers', nature: 'Calm', evs: {hp: 252, spd: 252}, moves: ['moonblast']},
  'Rotom-Wash 252 HP / 252+ Def Bold, Leftovers':
    {species: 'Rotom-Wash', item: 'leftovers', nature: 'Bold', evs: {hp: 252, def: 252}, moves: ['hydropump']},
  'Swampert 252 HP / 252+ Def Relaxed, Leftovers':
    {species: 'Swampert', item: 'leftovers', nature: 'Relaxed', evs: {hp: 252, def: 252}, moves: ['earthquake']},
  'Mega Venusaur 252 HP / 252+ Def Bold, no item (stone)':
    {species: 'Venusaur-Mega', item: '', nature: 'Bold', evs: {hp: 252, def: 252}, moves: ['gigadrain']},
  'Hydrapple 252 HP / 252+ SpD Calm, Leftovers':
    {species: 'Hydrapple', item: 'leftovers', nature: 'Calm', evs: {hp: 252, spd: 252}, moves: ['gigadrain']},
  'Goodra-Hisui 252 HP / 252+ SpD Calm, Leftovers':
    {species: 'Goodra-Hisui', item: 'leftovers', nature: 'Calm', evs: {hp: 252, spd: 252}, moves: ['dracometeor']},
  'Blissey 252 HP / 252+ Def Bold, Leftovers':
    {species: 'Blissey', item: 'leftovers', nature: 'Bold', evs: {hp: 252, def: 252}, moves: ['softboiled']},
  'Skarmory 252 HP / 252+ Def Impish, Leftovers':
    {species: 'Skarmory', item: 'leftovers', nature: 'Impish', evs: {hp: 252, def: 252}, moves: ['bravebird']},
  'Ogerpon-Hearthflame 4 HP / 252 Atk Jolly, Hearthflame Mask':
    {species: 'Ogerpon-Hearthflame', item: 'hearthflamemask', nature: 'Jolly', evs: {hp: 4, atk: 252, spe: 252}, moves: ['ivycudgel']},
  'Hawlucha 4 HP / 252 Atk Adamant, no item (Unburden consumed it)':
    {species: 'Hawlucha', item: '', ability: 'Unburden', nature: 'Adamant', evs: {hp: 4, atk: 252, spe: 252}, moves: ['acrobatics']},
  'Weavile 4 HP / 252 Atk Jolly, Life Orb':
    {species: 'Weavile', item: 'lifeorb', nature: 'Jolly', evs: {hp: 4, atk: 252, spe: 252}, moves: ['knockoff']},
  'Mega Latias 252 HP / 4 Def Bold, no item (stone)':
    {species: 'Latias-Mega', item: '', nature: 'Bold', evs: {hp: 252, def: 4}, moves: ['dracometeor']},
  'Mega Aerodactyl 4 HP / 252 Atk Jolly, no item (stone)':
    {species: 'Aerodactyl-Mega', item: '', nature: 'Jolly', evs: {hp: 4, atk: 252, spe: 252}, moves: ['stoneedge']},
};

/*
 * The two corrected attackers. **The ability is named in the label as well as
 * set on the sets**, so the defect cannot recur silently: a row that does not
 * say which ability it used is a row nobody can check.
 */
const DRACOVISH = {species: 'Dracovish', item: 'choiceband', ability: 'Strong Jaw',
  nature: 'Adamant', evs: {hp: 4, atk: 252}, moves: ['fishiousrend']};
/*
 * The packet also carried one Choice Scarf Jolly row. It is kept rather than
 * folded into the Band set: a Scarf Dracovish is the variant that reliably
 * moves first, which is the whole point of the item, and dropping it would
 * quietly lose a datum while the row count still looked plausible.
 */
const DRACOVISH_SCARF = {species: 'Dracovish', item: 'choicescarf', ability: 'Strong Jaw',
  nature: 'Jolly', evs: {hp: 4, atk: 252, spe: 252}, moves: ['fishiousrend']};
const SCIZOR = {species: 'Scizor', item: 'choiceband', ability: 'Technician',
  nature: 'Adamant', evs: {hp: 4, atk: 252}, moves: ['bulletpunch']};

const set = s => ({set: Object.assign({level: 100}, s)});

function row(attackerLabel, attackerSet, moveName, moveId, defenderLabel, hasMoved) {
  const dSpec = D[defenderLabel];
  if (!dSpec) throw new Error(`no declared defender for "${defenderLabel}"`);
  const defender = Object.assign(set(dSpec), {hasMoved: !!hasMoved});
  const r = Calculator.calculate({attacker: set(attackerSet), defender, move: moveId});
  if (!r || r.empty) throw new Error(`no result for ${moveId} into ${defenderLabel}`);
  return `| ${attackerLabel} | ${moveName} | ${defenderLabel} | ${r.min}-${r.max} | ${r.minPercent}-${r.maxPercent}% | ${r.ko.text} |`;
}

const FR_TARGETS = ['Mega Slowbro 252 HP / 252+ Def Bold, no item (stone)',
  'Tapu Fini 252 HP / 252+ SpD Calm, Leftovers', 'Primarina 252 HP / 252+ SpD Calm, Leftovers',
  'Rotom-Wash 252 HP / 252+ Def Bold, Leftovers', 'Swampert 252 HP / 252+ Def Relaxed, Leftovers',
  'Mega Venusaur 252 HP / 252+ Def Bold, no item (stone)', 'Hydrapple 252 HP / 252+ SpD Calm, Leftovers',
  'Goodra-Hisui 252 HP / 252+ SpD Calm, Leftovers', 'Blissey 252 HP / 252+ Def Bold, Leftovers',
  'Skarmory 252 HP / 252+ Def Impish, Leftovers'];

const FIRST = 'Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving FIRST (Fishious Rend doubled, 170 BP)';
const SECOND = 'Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving SECOND (not doubled, 85 BP)';

const SCARF = 'Dracovish 252 Atk / 252 Spe Jolly, Choice Scarf, **Strong Jaw**, moving FIRST (doubled, 170 BP)';

const frRows = [];
for (const target of FR_TARGETS) {
  frRows.push(row(FIRST, DRACOVISH, 'Fishious Rend', 'fishiousrend', target, false));
  frRows.push(row(SECOND, DRACOVISH, 'Fishious Rend', 'fishiousrend', target, true));
}
frRows.push(row(SCARF, DRACOVISH_SCARF, 'Fishious Rend', 'fishiousrend',
  'Mega Slowbro 252 HP / 252+ Def Bold, no item (stone)', false));

const SCIZOR_LABEL = 'Scizor 252 Atk Adamant, Choice Band, **Technician**';
const scizorRows = new Map();
for (const target of ['Ogerpon-Hearthflame 4 HP / 252 Atk Jolly, Hearthflame Mask',
  'Hawlucha 4 HP / 252 Atk Adamant, no item (Unburden consumed it)',
  'Weavile 4 HP / 252 Atk Jolly, Life Orb',
  'Mega Latias 252 HP / 4 Def Bold, no item (stone)',
  'Mega Aerodactyl 4 HP / 252 Atk Jolly, no item (stone)']) {
  scizorRows.set(target, row(SCIZOR_LABEL, SCIZOR, 'Bullet Punch', 'bulletpunch', target, false));
}

/* ------------------------------------------------------------------ */
let source = fs.readFileSync(DOC, 'utf8');
const original = source;
const lines = source.split(/\r?\n/);
const out = [];
let replacedFR = 0, replacedScizor = 0, frEmitted = false;

for (const line of lines) {
  if (/^\| .*\| Fishious Rend \|/.test(line)) {
    replacedFR++;
    if (!frEmitted) { out.push(...frRows); frEmitted = true; }
    continue;                                    // drop the stale row
  }
  const sc = /^\| Scizor[^|]*\| Bullet Punch \| ([^|]+?) \|/.exec(line);
  if (sc && scizorRows.has(sc[1].trim())) {
    out.push(scizorRows.get(sc[1].trim()));
    replacedScizor++;
    continue;
  }
  out.push(line);
}
source = out.join('\n');

if (replacedFR !== 21) throw new Error(`expected 21 Fishious Rend rows, matched ${replacedFR}`);
if (replacedScizor !== 5) throw new Error(`expected 5 Scizor rows, matched ${replacedScizor}`);

console.log(`Fishious Rend: ${replacedFR} stale rows -> ${frRows.length} regenerated (10 targets x 2 turn-order states)`);
console.log(`Bullet Punch : ${replacedScizor} rows regenerated with Technician`);

if (source === original) { console.log('\nunchanged — the document already matches the engine'); process.exit(0); }
if (CHECK) { console.log('\nSTALE — run: node tools/evidence-calcs.js'); process.exit(1); }
fs.writeFileSync(DOC, source);
console.log('\nrewritten docs/UU_TIERING_EVIDENCE_PROMPT.md');
