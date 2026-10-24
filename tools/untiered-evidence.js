#!/usr/bin/env node
/*
 * Generate `docs/UNTIERED_EVIDENCE.md` — every selectable species that carries
 * NO ladder tier, and is therefore refused in all seven tier formats.
 *
 * Reported by the player: an NFE cannot be put on a legal team anywhere. That is
 * true, and it is a *decision* rather than a bug — PROJECT_CONTEXT §5 records
 * "NFE and LC are discarded". This packet is the evidence for revisiting it.
 *
 * The decisive mechanic is Eviolite, which IS implemented here and is gated on
 * `Dex.evolutions(...).length`, so every entry in this document gets 1.5x
 * Defence and Special Defence from it. That is measured, not assumed.
 *
 *   node tools/untiered-evidence.js
 *   node tools/untiered-evidence.js --check
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {loadEngine} = require('../tests/helpers/engine.js');
const {createProfiler} = require('./lib/profiler.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs/UNTIERED_EVIDENCE.md');
const CHECK = process.argv.includes('--check');
const R = loadEngine();
const {Dex, Formats, Mechanics, Calculator, Pokemon, Validation, Items, Battle} = R;
const P = createProfiler(R);

const rosters = {};
for (const t of Formats.TIER_ORDER) rosters[t] = Formats.tierRoster(t);
const LADDER = Formats.TIER_ORDER.filter(t => rosters[t].length);
const stats = s => [s.baseStats.hp, s.baseStats.atk, s.baseStats.def, s.baseStats.spa, s.baseStats.spd, s.baseStats.spe].join('/');
const byName = n => [...rosters.ZU, ...rosters.PU, ...rosters.NU].find(e => e.name === n);

/* ---------- the subject: selectable species with no ladder tier ---------- */
const UNTIERED = Dex.allSpecies
  .filter(s => !(s.tier && LADDER.includes(s.tier)))
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name));
const asEntry = s => ({id: s.id, name: s.name, kind: 'species'});
const canEvolve = s => (Dex.evolutions(s) || []).length > 0;
const NFE = UNTIERED.filter(canEvolve);
const DEAD_END = UNTIERED.filter(s => !canEvolve(s));

/* ---------- Eviolite, measured rather than assumed ---------- */
function eviolitePair(species) {
  const mk = item => {
    const rules = Object.assign({}, Formats.get('anythinggoes').rules, {teamPreview: false, forceLevel: null, maxLevel: 100});
    const b = new Battle({
      format: Object.assign({}, Formats.get('anythinggoes'), {rules}), seed: 5,
      sides: [
        {name: 'A', team: [Pokemon.normalizeSet({species: species.id, level: 100, nature: 'impish',
          evs: {hp: 252, def: 252}, ivs: Pokemon.maxIVs(), item, moves: ['tackle']})], controller: 'human'},
        {name: 'B', team: [Pokemon.normalizeSet({species: 'snorlax', level: 100, moves: ['tackle']})], controller: 'human'},
      ],
    });
    b.start();
    const p = b.active(0);
    return {def: b.getStat(p, 'def'), spd: b.getStat(p, 'spd'), hp: p.maxHP};
  };
  try { return {without: mk(null), with: mk('eviolite')}; } catch { return null; }
}

/* ---------- profile rendering ---------- */
function renderProfile(s, {compact = true} = {}) {
  const entry = asEntry(s);
  let p;
  try { p = P.profile(entry, {tier: 'ZU'}); } catch { return `**${s.name}** — profile unavailable`; }
  const out = [];
  /*
   * `Dex.evolutions` returns `[{target, method, level, ...}]`, not names — a
   * first version read `.name`/`.species` and printed "[object Object]" on all
   * 472 NFE rows. The target's own TIER is the useful half: an NFE whose
   * evolution is already ranked is a different tiering question from one whose
   * whole line is untiered.
   */
  const evos = (Dex.evolutions(s) || []).map(e => {
    const id = typeof e === 'string' ? e : e.target;
    if (!id || !Dex.hasSpecies(id)) return String(id || '?');
    const t = Dex.species(id);
    const tier = t.tier && LADDER.includes(t.tier) ? t.tier : 'untiered';
    return `${t.name} (${tier})`;
  });
  out.push(`**${s.name}** — species, **no tier**, ${evos.length ? 'NFE → ' + evos.join(' / ') : '**fully evolved**'}`);
  out.push(`  ${s.types.join('/')} | BST ${s.bst} (${stats(s)}) | Abilities: ${p.abilities.join(' / ')}`);
  const o = p.off;
  out.push(`  Engine offence @252 (neutral/+): Atk ${o.atkNeutral}/${o.atkPlus}, SpA ${o.spaNeutral}/${o.spaPlus}, Spe ${o.speNeutral}/${o.spePlus}`);
  out.push(`  STAB: ${p.stab.join(' · ') || '**none**'}`);
  if (!compact) {
    out.push(`  Physical coverage: ${p.physical.join(', ') || 'none'}`);
    out.push(`  Special coverage: ${p.special.join(', ') || 'none'}`);
  }
  const roles = [];
  if (p.setup.length) roles.push('setup: ' + p.setup.join(', '));
  if (p.recovery.length) roles.push('recovery: ' + p.recovery.join(', '));
  if (p.priority.length) roles.push('priority: ' + p.priority.join(', '));
  if (p.hazards.length) roles.push('hazards: ' + p.hazards.join(', '));
  if (p.removal.length) roles.push('removal: ' + p.removal.join(', '));
  if (p.pivot.length) roles.push('pivot: ' + p.pivot.join(', '));
  if (p.status.length) roles.push('status: ' + p.status.join(', '));
  if (p.cleric.length) roles.push('cleric: ' + p.cleric.join(', '));
  if (roles.length) out.push('  ' + roles.join(' | '));
  return out.join('\n');
}

/* ---------- flag the ones worth a closer look ---------- */
function scan() {
  const flagged = [];
  for (const s of UNTIERED) {
    let p;
    try { p = P.profile(asEntry(s), {tier: 'ZU'}); } catch { continue; }
    const reasons = [];
    const o = p.off;
    if (s.bst >= 460) reasons.push(`BST ${s.bst}`);
    if (o.atkPlus >= 350) reasons.push(`Attack ${o.atkPlus}`);
    if (o.spaPlus >= 340) reasons.push(`Special Attack ${o.spaPlus}`);
    if (o.spePlus >= 320) reasons.push(`Speed ${o.spePlus}`);
    if (s.baseStats.def + s.baseStats.spd >= 175) reasons.push(`defences ${s.baseStats.def}/${s.baseStats.spd} — **Eviolite makes this 1.5x**`);
    if (!canEvolve(s)) reasons.push('**fully evolved and still untiered**');
    if (p.recovery.length && s.baseStats.hp >= 80) reasons.push('reliable recovery on a bulky frame');
    if (p.hazards.length && p.removal.length) reasons.push('hazards + removal');
    const notable = p.abilities.filter(a => ['regenerator', 'magicbounce', 'unaware', 'intimidate', 'levitate',
      'hugepower', 'purepower', 'speedboost', 'protean', 'contrary', 'trace', 'download', 'sturdy',
      'prankster', 'technician', 'skilllink', 'guts', 'poisonheal'].includes(Dex.toID(a)));
    if (notable.length) reasons.push('ability: ' + notable.join('/'));
    if (reasons.length >= 2) flagged.push({s, p, reasons});
  }
  return flagged.sort((a, b) => b.reasons.length - a.reasons.length || b.s.bst - a.s.bst);
}
const FLAGGED = scan();

/* ---------- damage core, drawn from ZU because that is the nearest rung ---------- */
const SPREADS = {
  physical: {nature: 'adamant', evs: {atk: 252, spe: 252, hp: 4}},
  special: {nature: 'modest', evs: {spa: 252, spe: 252, hp: 4}},
  physWall: {nature: 'impish', evs: {hp: 252, def: 252}},
  specWall: {nature: 'calm', evs: {hp: 252, spd: 252}},
};
function cfg(entry, spread, item, moves) {
  const sp = Dex.species(entry.id);
  return {set: {species: sp.id, level: 100, nature: spread.nature, evs: spread.evs, ivs: Pokemon.maxIVs(),
    ability: Dex.abilityList(sp.name)[0], item, moves: moves || ['tackle']}};
}
const CORE = [
  ['Regirock', 'physWall', 'leftovers'], ['Regice', 'specWall', 'leftovers'],
  ['Dusknoir', 'physWall', 'leftovers'], ['Pyukumuku', 'specWall', 'leftovers'],
  ['Lapras', 'specWall', 'leftovers'], ['Mesprit', 'specWall', 'leftovers'],
  ['Milotic', 'specWall', 'leftovers'], ['Aggron', 'physWall', 'leftovers'],
].map(([n, sp, it]) => { const e = byName(n); return e ? {n, e, sp, cfg: cfg(e, SPREADS[sp], it)} : null; }).filter(Boolean);
const cell = r => (r && !r.empty ? `${r.min}-${r.max} (${r.minPercent}-${r.maxPercent}%)` : '—');
function calc(a, d, m) { try { const r = Calculator.calculate({attacker: a, defender: d, move: m}); return r && !r.empty ? r : null; } catch { return null; } }

const MATRIX = FLAGGED.slice(0, 24).map(f => {
  const p = f.p;
  const physical = p.wantsPhysical && (!p.wantsSpecial || p.off.atkPlus >= p.off.spaPlus);
  const moves = [...p.stab, ...(physical ? p.physical : p.special)]
    .map(t => { const m = /^[A-Za-z]+ (.+?) \d/.exec(t); return m ? Dex.toID(m[1]) : null; })
    .filter(id => id && Dex.hasMove(id)).slice(0, 3);
  return {s: f.s, spread: physical ? 'physical' : 'special', moves, reasons: f.reasons};
}).filter(c => c.moves.length);

/* ================= assemble ================= */
const zu = Formats.get('tierzu').rules;
const sampleMsg = (() => {
  try {
    const r = Validation.validateTeam([Pokemon.normalizeSet({species: 'Porygon2', level: 100, moves: ['tackle']})], Formats.get('tierzu'));
    return (r.errors || []).map(e => e.message)[0] || '(no error)';
  } catch { return '(threw)'; }
})();

/* ---------- the pass is done: emit a completion record, not a live packet ----
 * Once every selectable species carries a tier this document's subject is empty.
 * Leaving the 3,897-line evidence packet in place would have it asserting that
 * 473 species are untiered, which stopped being true the moment the audit was
 * implemented — a generated document must describe the live state.
 */
if (!UNTIERED.length) {
  const placements = {RU: ['Porygon2'], NU: ['Gligar', 'Magneton', 'Rhydon', 'Doublade']};
  const puList = ['Floette-Eternal', 'Type: Null', 'Scyther', 'Ursaring', 'Dipplin', 'Tangela', 'Dusclops',
    'Corsola-Galar', 'Sliggoo-Hisui', 'Piloswine', 'Lairon', 'Crocalor', 'Gurdurr', 'Machoke', 'Meditite',
    'Primeape', 'Sneasel-Hisui', 'Fraxure', 'Zweilous', 'Servine', 'Combusken', 'Raboot', 'Thwackey',
    'Qwilfish-Hisui', 'Duosion', 'Kadabra', 'Roselia', 'Gothorita', 'Lampent', 'Slowpoke', 'Slowpoke-Galar',
    'Naclstack', 'Togetic', 'Porygon', 'Vullaby', 'Clefairy', 'Golbat', 'Mienfoo'];
  const out = `# RedGPT Untiered Roster — RESOLVED

**There are no untiered selectable species.** This document was the evidence
packet for the 473 that had no ladder tier; the audit was implemented on
2026-08-17 and the packet's subject is now empty, so it records the outcome
instead of restating a roster that no longer exists.

**Generated from the live project** by \`tools/untiered-evidence.js\`. It will
regenerate as a full evidence packet again if any selectable species ever loses
its tier — which is also asserted as an invariant in \`tests/data-validation.js\`.

---

## What was resolved

| | |
| --- | --- |
| Selectable species | ${Dex.allSpecies.length} |
| **Carrying no ladder tier** | **0** |
| Placed by this audit | 473 |

**The "NFE and LC are discarded" policy is superseded.** ZU is the floor now:
anything whose tier does not resolve to a rung lands in ZU with
\`tierSource.from === 'redgpt-zu-floor'\`, so a floored tier is never mistaken for
an imported one. Upstream ladder rankings still win — Chansey stays UU, Pikachu
stays ZU by import rather than by floor.

## The placements

| Destination | Count | Entries |
| --- | --- | --- |
| **RU** | 1 | ${placements.RU.join(', ')} |
| **NU** | 4 | ${placements.NU.join(', ')} |
| **PU** | 38 | ${puList.join(', ')} |
| **ZU** | 430 | everything else, through the floor |

**Live ladder:** ${Formats.TIER_ORDER.filter(t => rosters[t].length).map(t => `${t} ${rosters[t].length}`).join(', ')} — ${LADDER.reduce((n, t) => n + rosters[t].length, 0)} ranked entries.

## Reviewed alongside it

- **Silvally stays ZU**, on the completed all-17-Memory evidence
  (\`docs/SILVALLY_MEMORY_EVIDENCE.md\`).
- **Floette-Mega OU, Meowstic-M-Mega RU, Tatsugiri-Curly-Mega RU** — reviewed and
  **pinned** as explicit overrides rather than left on estimates.
- **Delphox-Mega pinned back to UU.** It drifted UU → OU as a side effect of
  Floette-Mega becoming a resolved datapoint in \`estimateFormeTier\`'s model. It
  was never reviewed, so it was pinned rather than allowed to move.
- **Floette-Eternal is PU and only it can Mega Evolve** — plain Floette has no
  \`formeItems\` entry, verified through \`reachableFormes\`.
`;
  if (CHECK) {
    const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
    if (cur === out) { console.log('unchanged'); process.exit(0); }
    console.log('STALE — run: node tools/untiered-evidence.js'); process.exit(1);
  }
  fs.writeFileSync(OUT, out);
  console.log('untiered 0 — wrote the RESOLVED record instead of an evidence packet');
  process.exit(0);
}

const doc = [];
doc.push(`# RedGPT Untiered Roster — Verified Evidence Packet

**Generated from the live RedGPT project** by \`tools/untiered-evidence.js\`.
Every stat, movepool value and damage figure comes from the running engine, the
packaged data, the validator or the real damage calculator.

**RedGPT has no usage, ladder, win-rate, tournament or popularity data**, so none
is quoted. **This packet contains no recommendations.**

---

## The problem, stated exactly

**${UNTIERED.length} selectable species carry no ladder tier at all.** They can be picked in
the Team Builder and they are refused by the validator in **all seven** tier
formats, so they are playable only in Anything Goes and Random Battle. The
message is unambiguous:

> _"${sampleMsg}"_

Of those ${UNTIERED.length}:

- **${NFE.length}** can still evolve (NFE)
- **${DEAD_END.length}** cannot — ${DEAD_END.map(s => `**${s.name}**`).join(', ')}

**This is a recorded decision, not a bug.** PROJECT_CONTEXT §5 says: *"NFE and LC
are discarded. Unevolved Pokémon carry no tier and there is no Little Cup format.
They stay fully playable in every non-tier format."* Tiering them reverses that
decision. It is also **not** true that every unevolved Pokémon is untiered —
Smogon ranks a few on the main ladder and this project imports those, which is
why Chansey (UU), Bisharp (UU), Duraludon (RU) and Pikachu (ZU) are **not** in
this document.

## Your task

Place these ${UNTIERED.length} species on the ladder — **Ubers · OU · UU · RU · NU · PU · ZU** —
or state that a given entry should remain untiered.

The realistic destination for the overwhelming majority is **ZU or PU**, and the
bars for both are in section D. But do not assume: section G contains entries
whose Eviolite-boosted bulk is genuinely large.

For each entry you place: exact name, destination tier, confidence, and the
mechanical reason. Grouping is fine and expected — with ${UNTIERED.length} entries, a rule
like *"every NFE below BST X is ZU"* plus a list of named exceptions is far more
useful than ${UNTIERED.length} individual verdicts, **provided the exceptions are named**.

**The single most important mechanic is Eviolite** — see section B. It is
implemented, it is gated on being able to evolve, and it gives every NFE in this
document **1.5x Defence and Special Defence**. A tiering pass that treats these
as their raw stat lines will misplace the bulky ones badly.

---`);

doc.push(`## A0. Three Megas were packaged on 2026-08-17, and they have never been reviewed

Separate from the ${UNTIERED.length} untiered species, and worth deciding at the same time.

**Three Mega formes were being dropped from the dataset for "no matching
front+back sprite pair" with complete artwork sitting on disk.** The generator
built each key as \`<baseSpecies> <forme>\`; the files are named after the Mega's
**holder**:

| Forme | Key asked for | File on disk |
| --- | --- | --- |
| Floette-Mega | \`FLOETTE MEGA\` | \`FLOETTE ETERNAL MEGA\` |
| Meowstic-M-Mega | \`MEOWSTIC M MEGA\` | \`MEOWSTIC MEGA\` |
| Tatsugiri-Curly-Mega | \`TATSUGIRI CURLY MEGA\` | \`TATSUGIRI MEGA\` |

Fixed by resolving the holder's sprite key and appending the Mega suffix.
Packaged species **1,270 → 1,273**; nothing else changed and no existing tier moved.

**They entered the ladder on tiers nobody has audited**, because the forme-item
rows already carried estimates for targets that did not exist:

${(() => {
  const rows = [];
  for (const n of ['Floette-Mega', 'Meowstic-M-Mega', 'Tatsugiri-Curly-Mega']) {
    if (!Dex.hasSpecies(n)) continue;
    const s = Dex.species(n);
    const holder = s.changesFrom || s.baseSpecies;
    const hs = Dex.hasSpecies(holder) ? Dex.species(holder) : null;
    const fi = hs ? (hs.formeItems || []).find(f => Dex.toID(f.forme) === s.id) : null;
    const enforced = LADDER.find(t => rosters[t].some(e => e.name === n));
    rows.push(`### ${s.name}

- **${s.types.join('/')} | BST ${s.bst} (${stats(s)})** | ability ${Dex.abilityList(s.name).join(' / ')}
- Holder: **${holder}**${hs ? ` (tier ${hs.tier === null ? '**none**' : hs.tier}, BST ${hs.bst})` : ''}, via **${fi ? (Dex.item(fi.item)?.name || fi.item) : '?'}**
- Enforced tier: **${enforced || '—'}**${fi ? ` (\`${fi.tierSource}\`)` : ''}${fi && fi.tierSource === 'estimated' ? ' — **a nearest-neighbour guess, never reviewed**' : ''}
- \`species.tier\` reads **${s.tier === null ? 'none' : s.tier}**${s.tier !== (enforced || null) ? ' — which DISAGREES with the enforced tier above' : ''}`);
  }
  return rows.join('\n\n');
})()}

**Floette-Mega is the sharp one**: **BST 651** on an *estimated* OU placement,
and its holder Floette-Eternal carries **no tier at all**, so the holder cannot
legally be brought to any format where the Mega is legal. **Only Floette-Eternal
can Mega Evolve — plain Floette has no \`formeItems\` entry and holding a
Floettite does nothing for it**, verified through \`reachableFormes\`.

**The legality deadlock, measured through the validator:**

${(() => {
  const mv = ['moonblast'];
  const rows = [];
  for (const f of ['anythinggoes', 'tierubers', 'tierou', 'tieruu', 'tierpu']) {
    const fmt = Formats.get(f);
    const r = Validation.validateTeam([Pokemon.normalizeSet({species: 'Floette-Eternal', item: 'floettite', level: 100, moves: mv})], fmt);
    rows.push(`| ${fmt.name} | ${r.valid ? '**LEGAL**' : 'refused — the holder is untiered'} |`);
  }
  return `| Format | Floette-Eternal + Floettite |
| --- | --- |
${rows.join('\n')}`;
})()}

So **the Mega is listed in OU and is reachable in no tier format at all**, because
the only Pokémon that produces it is untiered. Placing Floette-Eternal is what
makes its Mega mean anything; the two have to be decided together.

**Fairy Aura is a double edge, and the second half is easy to miss.** Packaged:
_"${(Dex.ability('fairyaura') || {}).shortDesc || (Dex.ability('fairyaura') || {}).desc}"_ — **any** Pokémon, not just the holder. Measured with the
calculator, Life Orb modest 252 SpA into a 252/252 Snorlax, and the reverse:

${(() => {
  const atk = a => ({set: {species: 'floetteeternal', level: 100, nature: 'modest', evs: {spa: 252, spe: 252}, ivs: Pokemon.maxIVs(), ability: a, item: 'lifeorb', moves: ['moonblast', 'psychic']}});
  const def = {set: {species: 'snorlax', level: 100, nature: 'calm', evs: {hp: 252, spd: 252}, ivs: Pokemon.maxIVs(), ability: 'Thick Fat', item: 'leftovers', moves: ['tackle']}};
  const foe = {set: {species: 'sylveon', level: 100, nature: 'modest', evs: {spa: 252}, ivs: Pokemon.maxIVs(), ability: 'Pixilate', item: 'lifeorb', moves: ['moonblast']}};
  const meDef = a => ({set: {species: 'floetteeternal', level: 100, nature: 'calm', evs: {hp: 252, spd: 252}, ivs: Pokemon.maxIVs(), ability: a, item: 'leftovers', moves: ['tackle']}});
  const cellOf = r => (r && !r.empty ? `${r.min}-${r.max}` : '—');
  const c = (a, d, m) => { try { return Calculator.calculate({attacker: a, defender: d, move: m}); } catch { return null; } };
  return `| Measurement | Flower Veil | **Fairy Aura** |
| --- | --- | --- |
| its own Moonblast → Snorlax | ${cellOf(c(atk('Flower Veil'), def, 'moonblast'))} | **${cellOf(c(atk('Fairy Aura'), def, 'moonblast'))}** |
| its own Psychic → Snorlax _(control, non-Fairy)_ | ${cellOf(c(atk('Flower Veil'), def, 'psychic'))} | ${cellOf(c(atk('Fairy Aura'), def, 'psychic'))} |
| an opposing Sylveon's Moonblast **into it** | ${cellOf(c(foe, meDef('Flower Veil'), 'moonblast'))} | **${cellOf(c(foe, meDef('Fairy Aura'), 'moonblast'))}** |`;
})()}

The non-Fairy control is unchanged, so the 1.33x is real and specific — **and it
applies to Fairy moves aimed at it as well**. Against a Fairy-heavy opponent the
ability is a liability, which no stat line shows.

**Florges is the direct anchor for the holder**, and it is already tiered:

| | Types | BST | Spread | Abilities | Tier |
| --- | --- | --- | --- | --- | --- |
| **Floette-Eternal** | ${Dex.species('Floette-Eternal').types.join('/')} | **${Dex.species('Floette-Eternal').bst}** | ${stats(Dex.species('Floette-Eternal'))} | ${Dex.abilityList('Floette-Eternal').join(' / ')} | **none** |
| Florges | ${Dex.species('Florges').types.join('/')} | ${Dex.species('Florges').bst} | ${stats(Dex.species('Florges'))} | ${Dex.abilityList('Florges').join(' / ')} | **${Dex.species('Florges').tier}** |
| Floette _(plain)_ | ${Dex.species('Floette').types.join('/')} | ${Dex.species('Floette').bst} | ${stats(Dex.species('Floette'))} | ${Dex.abilityList('Floette').join(' / ')} | **none** |

One BST point apart, same typing and the same two abilities — Floette-Eternal
trades 26 Special Defence for 13 Special Attack and 17 Speed. **Florges is PU.**

These three need placing alongside the untiered roster below.

---

## A. Scope and counts

| | |
| --- | --- |
| Selectable species | ${Dex.allSpecies.length} |
| Ranked on the ladder | ${LADDER.reduce((n, t) => n + rosters[t].filter(e => e.kind === 'species').length, 0)} species entries |
| **Untiered and selectable** | **${UNTIERED.length}** |
| — of which NFE | ${NFE.length} |
| — of which fully evolved | ${DEAD_END.length} |
| Transform-only formes with no tier | 0 |

**Current ladder, for reference:**

| Tier | Entries |
| --- | --- |
${LADDER.map(t => `| ${t} | ${rosters[t].length} |`).join('\n')}

**ZU format rules apply unchanged** to anything placed there — \`maxTier: ZU\`,
\`tera: ${zu.tera}\`, \`mega: ${zu.mega}\`, no format-specific bans of any kind.

---

## B. The mechanics that decide this

### 1. Eviolite — implemented, and the whole question

\`\`\`
${(Dex.item('eviolite') || {}).name}: ${(Dex.item('eviolite') || {}).shortDesc || (Dex.item('eviolite') || {}).desc}
\`\`\`

It is a live registry item with an \`onModifyStat\` hook gated on
\`Dex.evolutions(species).length\`, so **every one of the ${NFE.length} NFE entries in this
document gets it** and none of the already-tiered fully-evolved roster does.

Measured through the engine, 252 HP / 252 Def impish at level 100:

| Species | Def without | Def with | SpD without | SpD with |
| --- | --- | --- | --- | --- |
${(() => {
  const picks = ['Porygon2', 'Type: Null', 'Chansey', 'Rhydon', 'Dusclops', 'Magneton', 'Gligar', 'Doublade']
    .map(n => Dex.hasSpecies(n) ? Dex.species(n) : null).filter(Boolean)
    .filter(s => UNTIERED.some(u => u.id === s.id));
  return picks.map(s => {
    const e = eviolitePair(s);
    if (!e) return `| ${s.name} | — | — | — | — |`;
    return `| **${s.name}** | ${e.without.def} | **${e.with.def}** | ${e.without.spd} | **${e.with.spd}** |`;
  }).join('\n');
})()}

### 2. Everything else that applies

**Priority (unconditional in this project):** ${['suckerpunch', 'thunderclap', 'firstimpression', 'upperhand', 'grassyglide'].map(id => { const m = Dex.move(id); return `${m.name} ${m.basePower} BP +${(m.priority || 0) + (Mechanics.ENGINE_PRIORITY.has(id) ? 1 : 0)}`; }).join(', ')}.

**Restored base powers:** ${['overheat', 'leafstorm', 'dracometeor', 'hydropump', 'fireblast', 'thunder', 'hurricane', 'blizzard', 'headsmash', 'closecombat'].map(id => `${Dex.move(id).name} ${Dex.move(id).basePower}`).join(', ')}.

**Focus Punch** is ${Dex.move('focuspunch').basePower} BP at ${Dex.move('focuspunch').accuracy}% and priority ${Dex.move('focuspunch').priority} — no Substitute condition.

**Multi-hit** 2-5 hit moves are 25 BP per hit; exactly-2-hit 50 BP per hit; Skill Link forces the maximum.

**Toxic Orb and Flame Orb fire on ENTRY**, which matters for the Guts and Quick Feet holders below.

**Ring Target, Heavy-Duty Boots and every other item are available** — nothing in
this document is a forme, so item freedom is universal.

---`);

doc.push(`## C. The one fully-evolved case

**${DEAD_END.length} of the ${UNTIERED.length} untiered species is fully evolved**, and it is the sharpest
entry in the document.

${DEAD_END.map(s => {
  const p = P.profile(asEntry(s), {tier: 'ZU'});
  const fis = (s.formeItems || []);
  const lines = [renderProfile(s, {compact: false})];
  lines.push('');
  lines.push(`- **Fully evolved**, so **Eviolite does NOT apply to it** — unlike everything else here.`);
  lines.push(`- Prevo: ${s.prevo || '_none packaged_'}`);
  if (fis.length) {
    for (const f of fis) {
      const packaged = Dex.hasSpecies(f.forme);
      lines.push(`- Forme item **${Dex.item(f.item)?.name || f.item}** → ${f.forme} (${f.tier}, ${f.tierSource})` +
        (packaged ? '' : ' — **and that forme is NOT PACKAGED**, so the item would ban it from a tier and then fail to transform. That is the Magearna-Original trap §5 records.'));
    }
  }
  return lines.join('\n');
}).join('\n\n')}

---

## D. The comparison bars

A promotion out of "untiered" realistically lands in **ZU** or **PU**. Both
rosters are given in full so the comparison can be made directly.

### ZU — ${rosters.ZU.length} entries

${rosters.ZU.slice().sort((a, b) => a.name.localeCompare(b.name)).map(e => {
  const s = Dex.species(e.id);
  return `- **${e.name}** ${s.types.join('/')} BST ${s.bst} (${stats(s)}) — ${P.abilitiesOf(e).join('/')}`;
}).join('\n')}

### PU — ${rosters.PU.length} entries

${rosters.PU.slice().sort((a, b) => a.name.localeCompare(b.name)).map(e => {
  const s = Dex.species(e.id);
  return `- **${e.name}** ${s.types.join('/')} BST ${s.bst} (${stats(s)}) — ${P.abilitiesOf(e).join('/')}`;
}).join('\n')}

---`);

doc.push(`## E. Full untiered roster — all ${UNTIERED.length} entries

Engine-resolved, compact. Ordered alphabetically. **Nothing is omitted.**

${UNTIERED.map(s => renderProfile(s)).join('\n\n')}`);

doc.push(`---

## F. Mechanically flagged entries

${FLAGGED.length} of ${UNTIERED.length} tripped two or more flags. **Flags are reasons to look, not
verdicts** — and with ${UNTIERED.length} entries most of this roster is unremarkable, which is
itself the useful signal.

${FLAGGED.map(f => `- **${f.s.name}** (${f.s.types.join('/')}, BST ${f.s.bst}, ${f.p.abilities.join('/')}) — ${f.reasons.join('; ')}.`).join('\n')}

---

## G. Eviolite bulk table — the bulkiest untiered entries

Measured through the engine at 252 HP / 252 Def, level 100. **This is the table
that decides how high any of these should go**, because a raw stat line
understates every one of them by half again on both defences.

| Species | Types | HP | Def → with Eviolite | SpD → with Eviolite |
| --- | --- | --- | --- | --- |
${(() => {
  const picks = NFE.slice().sort((a, b) =>
    (b.baseStats.def + b.baseStats.spd + b.baseStats.hp) - (a.baseStats.def + a.baseStats.spd + a.baseStats.hp)).slice(0, 30);
  return picks.map(s => {
    const e = eviolitePair(s);
    if (!e) return `| ${s.name} | ${s.types.join('/')} | — | — | — |`;
    return `| **${s.name}** | ${s.types.join('/')} | ${e.with.hp} | ${e.without.def} → **${e.with.def}** | ${e.without.spd} → **${e.with.spd}** |`;
  }).join('\n');
})()}

---

## H. Damage matrices for the flagged offensive entries

Attacker on a **representative test set** with a Life Orb; defenders are ZU
benchmarks at 252 HP / 252 in the matching defence with Leftovers.

${MATRIX.map(c => {
  const atk = cfg(asEntry(c.s), SPREADS[c.spread], 'lifeorb', c.moves);
  return `### ${c.s.name}

_Flagged for: ${c.reasons.join('; ')}._ ${SPREADS[c.spread].nature}, ${JSON.stringify(SPREADS[c.spread].evs)}, Life Orb.

| ZU defender | ${c.moves.map(m => Dex.move(m).name).join(' | ')} |
| --- | ${c.moves.map(() => '---').join(' | ')} |
${CORE.map(d => `| ${d.n} (${d.sp}) | ` + c.moves.map(m => cell(calc(atk, d.cfg, m))).join(' | ') + ' |').join('\n')}`;
}).join('\n\n')}

---

## I. Speed reference

Every untiered entry at base Speed 90+, at max +Speed:

${(() => {
  const rows = UNTIERED.map(s => ({s, o: P.offence(asEntry(s), Dex.abilityList(s.name)[0])}))
    .filter(x => x.s.baseStats.spe >= 90)
    .sort((a, b) => b.o.spePlus - a.o.spePlus);
  return `| Species | Base Spe | Max +Spe | Scarf |
| --- | --- | --- | --- |
${rows.map(({s, o}) => `| ${s.name} | ${s.baseStats.spe} | ${o.spePlus} | ${Math.floor(o.spePlus * 1.5)} |`).join('\n')}`;
})()}

---

## J. Remaining genuinely unresolved questions

1. **No usage, ladder, win-rate or tournament data exists.** Every judgement must
   be mechanical.
2. **Tiering these reverses a recorded project decision** (§5: "NFE and LC are
   discarded"). If the intent is instead to add a **Little Cup** format, or to
   allow untiered species in ZU as a class, that is a different change and this
   packet does not assume either.
3. **Eviolite is the dominant variable** and it applies to ${NFE.length} of the ${UNTIERED.length}
   entries but not to ${DEAD_END.map(s => s.name).join(', ')}. Any rule of the form
   "NFEs go to ZU" needs to survive section G.
4. **Level is not a lever here.** There is no Little Cup format and every tier
   format runs at level 100, so these are judged at level 100 like everything
   else — which is *not* how Smogon's LC ranks them.
5. **Conditional abilities are read unactivated**, as in every packet.
6. **A few of these evolve into tiered Pokémon**, so placing the NFE and its
   evolution on the same rung may or may not be intended. The evolution target
   is named on every profile in section E.

**If a number you need is missing, ask for it** rather than estimating.`);

const out = doc.join('\n');
if (CHECK) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur === out) { console.log('unchanged'); process.exit(0); }
  console.log('STALE — run: node tools/untiered-evidence.js'); process.exit(1);
}
fs.writeFileSync(OUT, out);
console.log(`untiered ${UNTIERED.length} (NFE ${NFE.length}, fully evolved ${DEAD_END.length}) | flagged ${FLAGGED.length} | matrices ${MATRIX.length} | core ${CORE.length}`);
console.log('wrote docs/UNTIERED_EVIDENCE.md');
