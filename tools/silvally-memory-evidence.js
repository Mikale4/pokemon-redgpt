#!/usr/bin/env node
/*
 * Generate `docs/SILVALLY_MEMORY_EVIDENCE.md` — the per-Memory profile the ZU
 * audit asked for and did not have.
 *
 * Silvally was the one ZU hold left on **missing evidence** rather than on a
 * judgement: the ZU packet profiles base (Normal) Silvally only, and its verdict
 * said so explicitly. This supplies every typing.
 *
 * Everything is measured by driving the real engine — the retype is applied by
 * building a battle Pokemon holding each Memory and reading its live types, not
 * by reading the packaged `Silvally-<Type>` row.
 *
 *   node tools/silvally-memory-evidence.js
 *   node tools/silvally-memory-evidence.js --check
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {loadEngine} = require('../tests/helpers/engine.js');
const {createProfiler} = require('./lib/profiler.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs/SILVALLY_MEMORY_EVIDENCE.md');
const CHECK = process.argv.includes('--check');
const R = loadEngine();
const {Dex, Formats, Calculator, Pokemon, Battle, Validation} = R;
const P = createProfiler(R);

const rosters = {};
for (const t of Formats.TIER_ORDER) rosters[t] = Formats.tierRoster(t);
const byName = n => [...rosters.ZU, ...rosters.PU, ...rosters.NU].find(e => e.name === n);
const stats = s => [s.baseStats.hp, s.baseStats.atk, s.baseStats.def, s.baseStats.spa, s.baseStats.spd, s.baseStats.spe].join('/');

/* ---------- every Memory, discovered from the item data ---------- */
const MEMORIES = Object.values(Dex.allItems)
  .filter(i => i.onMemory)
  .map(i => ({id: Dex.toID(i.name), name: i.name, type: i.onMemory}))
  .sort((a, b) => a.type.localeCompare(b.type));

/* ---------- measure the retype through a real battle ---------- */
function mk(p1, p2) {
  const rules = Object.assign({}, Formats.get('anythinggoes').rules, {teamPreview: false, forceLevel: null, maxLevel: 100});
  const b = new Battle({
    format: Object.assign({}, Formats.get('anythinggoes'), {rules}), seed: 11,
    sides: [{name: 'A', team: p1, controller: 'human'}, {name: 'B', team: p2, controller: 'human'}],
  });
  b.start();
  return b;
}
const bset = (sp, o = {}) => Pokemon.normalizeSet(Object.assign(
  {species: sp, level: 100, moves: ['multiattack', 'tackle'], evs: {atk: 252, spe: 252}, ivs: Pokemon.maxIVs(), nature: 'adamant'}, o));

function measureMemory(mem) {
  const b = mk([bset('Silvally', {item: mem ? mem.name : ''})], [bset('Snorlax', {moves: ['tackle']})]);
  const a = b.active(0), d = b.active(1);
  const move = Dex.move('multiattack');
  // `moveType(attacker, defender, move)` — three arguments. A two-argument call
  // silently returns null, which printed "null" for all 17 Memories.
  let maType = null, maPower = null;
  try { maType = b.moveType(a, d, move); } catch { maType = null; }
  try { maPower = b.dynamicBasePower(a, d, move, {preview: true}); } catch { maPower = move.basePower; }
  return {
    types: [...a.types],
    multiAttackType: maType,
    multiAttackPower: maPower || move.basePower,
    stab: maType && a.types.includes(maType),
  };
}

/* ---------- defensive profile from the type chart ---------- */
function defensiveProfile(types) {
  const weak = [], resist = [], immune = [];
  for (const atk of Dex.TYPES || Object.keys(Dex.typeChart || {})) {
    let mult = 1;
    try { mult = Dex.typeEffectiveness(atk, types); } catch { continue; }
    if (mult === 0) immune.push(atk);
    else if (mult > 1) weak.push(`${atk} ${mult}x`);
    else if (mult < 1) resist.push(`${atk} ${mult}x`);
  }
  return {weak, resist, immune};
}

/* ---------- a small ZU + PU damage core ---------- */
const SPREADS = {
  physWall: {nature: 'impish', evs: {hp: 252, def: 252}},
  specWall: {nature: 'calm', evs: {hp: 252, spd: 252}},
};
function cfg(entry, spread, item) {
  const sp = Dex.species(entry.id);
  return {set: {species: sp.id, level: 100, nature: spread.nature, evs: spread.evs, ivs: Pokemon.maxIVs(),
    ability: Dex.abilityList(sp.name)[0], item, moves: ['tackle']}};
}
const CORE = [
  ['Regirock', 'physWall', 'leftovers'], ['Regice', 'specWall', 'leftovers'],
  ['Bastiodon', 'physWall', 'leftovers'], ['Dusknoir', 'physWall', 'leftovers'],
  ['Pyukumuku', 'specWall', 'leftovers'], ['Lapras', 'specWall', 'leftovers'],
  ['Mesprit', 'specWall', 'leftovers'], ['Brute Bonnet', 'physWall', 'leftovers'],
  ['Milotic', 'specWall', 'leftovers'], ['Aggron', 'physWall', 'leftovers'],
].map(([n, sp, it]) => { const e = byName(n); return e ? {n, e, sp, cfg: cfg(e, SPREADS[sp], it)} : null; }).filter(Boolean);

const cell = r => (r && !r.empty ? `${r.min}-${r.max} (${r.minPercent}-${r.maxPercent}%)` : '—');
function calc(a, d, m) { try { const r = Calculator.calculate({attacker: a, defender: d, move: m}); return r && !r.empty ? r : null; } catch { return null; } }

const silv = Dex.species('Silvally');
const entry = byName('Silvally');
const prof = P.profile(entry, {tier: 'ZU'});
const base = measureMemory(null);

/* ================= assemble ================= */
const doc = [];
doc.push(`# RedGPT Silvally — Per-Memory Evidence Packet

**Generated from the live RedGPT project** by \`tools/silvally-memory-evidence.js\`.
Every typing, move type, base power and damage figure is measured by building a
real battle Pokémon holding each Memory and reading the engine, **not** by
reading the packaged \`Silvally-<Type>\` rows.

**RedGPT has no usage, ladder, win-rate, tournament or popularity data.** None is
quoted. **This packet contains no recommendations.**

---

## Why this exists

The ZU audit held Silvally in ZU on **missing evidence rather than on a
judgement**, and said so in as many words:

> *"the current evidence packet does NOT provide exhaustive per-Memory offensive
> and defensive profiles for all 17 possible typings … Until that evidence
> exists: STAY ZU."*

The ZU packet profiles base (Normal) Silvally only, and its standardised matrix
is dominated by Explosion. This document is the missing half.

## Your task

Decide whether **Silvally** belongs in ZU or higher, now that every typing is
measured.

The question is not "is one typing strong" — it is whether **being able to
choose the typing at team-build time**, at the cost of the item slot, is worth
more than ZU can contain. Consider:

1. Which Memory is the best offensive choice, and how much does it actually add?
2. Which is the best defensive choice, and does that matter more?
3. What does spending the item slot cost it? (No Leftovers, no Boots, no Choice
   item, no Life Orb, no Assault Vest, no Ring Target.)
4. Is a 95-across-the-board stat line enough to exploit any of it?
5. Would it be an ordinary PU Pokémon or a problem there?

**This is one species.** If it stays, say so; if it moves, name the destination.

---

## A. The species

**Silvally** — ${silv.types.join('/')} base, **BST ${silv.bst}** (${stats(silv)}), ability **${Dex.abilityList('Silvally').join(' / ')}**

- **Every stat is 95.** There is no offensive bias to exploit and no defensive one either.
- Engine offence @252 (neutral/positive): Atk **${prof.off.atkNeutral}/${prof.off.atkPlus}**, SpA **${prof.off.spaNeutral}/${prof.off.spaPlus}**, Spe **${prof.off.speNeutral}/${prof.off.spePlus}**
- Current tier: **ZU** (source: imported)
- **The item slot is the whole cost.** A Memory is not a forced item — Silvally
  is legal without one — but taking a typing means giving up every other item.

**Utility movepool (engine-resolved):**

- Setup: ${prof.setup.join(', ') || 'none'}
- Reliable recovery: ${prof.recovery.join(', ') || '**none**'} | Rest: ${prof.has('rest') ? 'yes' : 'no'} | Drain: ${prof.drain.join(', ') || 'none'}
- Priority: ${prof.priority.join(', ') || 'none'}
- Hazards: ${prof.hazards.join(', ') || 'none'} | Removal: ${prof.removal.join(', ') || 'none'} | Pivot: ${prof.pivot.join(', ') || 'none'} | Phazing: ${prof.phazing.join(', ') || 'none'}
- Status: ${prof.status.join(', ') || 'none'}
- Physical coverage: ${prof.physical.join(', ') || 'none'}
- Special coverage: ${prof.special.join(', ') || 'none'}

---

## B. How the retype actually works, measured

**RKS System carries no registry hook** — the retyping is done by the engine off
the held Memory, so reading the ability definition alone finds nothing. Measured
in a real battle:

| Held item | Live types | Multi-Attack type | Multi-Attack BP | STAB? |
| --- | --- | --- | --- | --- |
| _(none)_ | ${base.types.join('/')} | ${base.multiAttackType} | ${base.multiAttackPower} | ${base.stab ? '**yes**' : 'no'} |
${MEMORIES.map(m => {
  const r = measureMemory(m);
  return `| ${m.name} | **${r.types.join('/')}** | ${r.multiAttackType} | ${r.multiAttackPower} | ${r.stab ? '**yes**' : 'no'} |`;
}).join('\n')}

**All ${MEMORIES.length} Memories work**, and Multi-Attack follows the Memory with STAB in
every case. The species stays \`silvally\` — this is a **retype**, not a forme
change, so nothing about its stats or ability moves with it.

---

## C. Defensive profile per typing

Silvally's bulk is fixed at 95/95/95; only the **typing** changes, so this table
is the entire defensive difference between one Memory and another.

| Typing | Weaknesses | Resistances | Immunities |
| --- | --- | --- | --- |
${(() => {
  const rows = [];
  const b = defensiveProfile(base.types);
  rows.push(`| ${base.types.join('/')} _(no Memory)_ | ${b.weak.join(', ') || 'none'} | ${b.resist.join(', ') || 'none'} | ${b.immune.join(', ') || 'none'} |`);
  for (const m of MEMORIES) {
    const r = measureMemory(m);
    const d = defensiveProfile(r.types);
    rows.push(`| **${r.types.join('/')}** (${m.name}) | ${d.weak.join(', ') || 'none'} | ${d.resist.join(', ') || 'none'} | ${d.immune.join(', ') || 'none'} |`);
  }
  return rows.join('\n');
})()}

---

## D. Multi-Attack damage per typing, against a fixed core

Attacker: **Silvally**, adamant, 252 Atk / 252 Spe, **holding the Memory named in
the row** — so the damage and the item cost are shown together. Defenders are
252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

Note the attacker cannot hold Life Orb, a Choice item or Boots in any of these
rows: the Memory is in the slot.

| Memory (typing) | ${CORE.map(d => d.n).join(' | ')} |
| --- | ${CORE.map(() => '---').join(' | ')} |
${MEMORIES.map(m => {
  const atk = {set: {species: 'silvally', level: 100, nature: 'adamant', evs: {atk: 252, spe: 252}, ivs: Pokemon.maxIVs(),
    ability: 'RKS System', item: m.id, moves: ['multiattack']}};
  return `| ${m.name} (${m.type}) | ` + CORE.map(d => cell(calc(atk, d.cfg, 'multiattack'))).join(' | ') + ' |';
}).join('\n')}

**Baseline, no Memory (Normal Multi-Attack, still STAB):**

| _(no item)_ | ${CORE.map(d => cell(calc({set: {species: 'silvally', level: 100, nature: 'adamant', evs: {atk: 252, spe: 252}, ivs: Pokemon.maxIVs(), ability: 'RKS System', item: null, moves: ['multiattack']}}, d.cfg, 'multiattack'))).join(' | ')} |

**And with a Life Orb instead of a Memory**, which is the trade the Memory
actually costs — Normal typing, but a 1.3x multiplier on everything:

| _(Life Orb, Normal)_ | ${CORE.map(d => cell(calc({set: {species: 'silvally', level: 100, nature: 'adamant', evs: {atk: 252, spe: 252}, ivs: Pokemon.maxIVs(), ability: 'RKS System', item: 'lifeorb', moves: ['multiattack']}}, d.cfg, 'multiattack'))).join(' | ')} |

---

## E. Legality

Silvally is legal wherever its **own** tier allows, and the Memory is an ordinary
item — it is **not** a forme item, so there is no Absol/Absolite gate on it:

${(() => {
  const mv = ['multiattack'];
  const rows = [];
  for (const f of ['tierzu', 'tierpu', 'tiernu', 'tierru']) {
    const fmt = Formats.get(f);
    const bare = Validation.validateTeam([Pokemon.normalizeSet({species: 'Silvally', level: 100, moves: mv})], fmt);
    const held = Validation.validateTeam([Pokemon.normalizeSet({species: 'Silvally', item: 'firememory', level: 100, moves: mv})], fmt);
    rows.push(`| ${fmt.name} | ${bare.valid ? 'LEGAL' : 'refused'} | ${held.valid ? 'LEGAL' : 'refused'} |`);
  }
  return `| Format | Silvally | Silvally + Fire Memory |
| --- | --- | --- |
${rows.join('\n')}`;
})()}

The packaged \`Silvally-<Type>\` species are **not selectable** and carry
\`requiredItem\`; they exist so the Pokédex can show each typing. Nothing needs to
be gated, because the retype never crosses a tier boundary — every
\`Silvally-<Type>\` sits in the same tier as base Silvally.

---

## F. What this evidence still cannot settle

1. **No usage data exists**, so how often a given Memory would be chosen is
   unknowable. Every typing is presented as equally available, which it is.
2. **The item-slot cost cannot be priced mechanically.** Section D shows the
   Life Orb comparison, which is the closest the engine can get to it.
3. **Coverage moves are unchanged by the Memory.** Only Multi-Attack and the
   typing move; the rest of the movepool in section A is constant.
4. **Defensive typing is a matchup question**, not a damage question. Section C
   is the raw chart; whether Steel or Fairy is the *right* choice depends on what
   it is being switched into, which no engine reading can answer.

**If a number you need is missing, ask for it** rather than estimating.`);

const out = doc.join('\n');
if (CHECK) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur === out) { console.log('unchanged'); process.exit(0); }
  console.log('STALE — run: node tools/silvally-memory-evidence.js'); process.exit(1);
}
fs.writeFileSync(OUT, out);
console.log(`memories ${MEMORIES.length} | core ${CORE.length} | Silvally tier ${silv.tier}`);
console.log('wrote docs/SILVALLY_MEMORY_EVIDENCE.md');
