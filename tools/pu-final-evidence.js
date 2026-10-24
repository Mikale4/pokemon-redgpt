#!/usr/bin/env node
/*
 * Generate `docs/PU_FINAL_EVIDENCE.md` — the verified evidence packet for the
 * bidirectional PU tier audit (PU -> NU and PU -> ZU).
 *
 * Everything comes from the live project. It reuses `tools/lib/profiler.js`,
 * which is the one engine-resolved profiler and already carries the four fixes
 * the UU pass found (ability-driven offence, `-ate` conversion, charge-move
 * ties, banned moves).
 *
 * **The roster variables are named for their ROLE, not for a tier.**
 * `nu-final-evidence.js` was cloned from `ru-final-evidence.js` and kept the
 * names `RU`/`NU`/`UU` while rebinding them to NU/PU/RU, which makes its own
 * summary line print NU's count under the label "RU". The document is correct
 * and the names are not; this file uses SUBJECT / DOWN / UP so the next clone
 * does not inherit the confusion.
 *
 *   node tools/pu-final-evidence.js
 *   node tools/pu-final-evidence.js --check
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {loadEngine} = require('../tests/helpers/engine.js');
const {createProfiler} = require('./lib/profiler.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs/PU_FINAL_EVIDENCE.md');
const CHECK = process.argv.includes('--check');
const R = loadEngine();
const {Dex, Formats, Mechanics, Calculator, Pokemon, Validation, Abilities, Items} = R;
const P = createProfiler(R);

const SUBJECT_TIER = 'PU', DOWN_TIER = 'ZU', UP_TIER = 'NU';

const rosters = {};
for (const t of Formats.TIER_ORDER) rosters[t] = Formats.tierRoster(t);
const sorted = t => rosters[t].slice().sort((a, b) => a.name.localeCompare(b.name));
const SUBJECT = sorted(SUBJECT_TIER);   // PU — the tier under review
const DOWN = sorted(DOWN_TIER);         // ZU — the downward bar
const UP = sorted(UP_TIER);             // NU — the upward bar (post NU pass)

const all = [...rosters.ZU, ...rosters.PU, ...rosters.NU, ...rosters.RU, ...rosters.UU, ...rosters.OU];
const byName = n => all.find(e => e.name === n);
const itemName = id => (id && Dex.item(id) ? Dex.item(id).name : (id || '—'));
const stats = s => [s.baseStats.hp, s.baseStats.atk, s.baseStats.def, s.baseStats.spa, s.baseStats.spd, s.baseStats.spe].join('/');
const enforcedTier = e => Formats.TIER_ORDER.find(t => rosters[t].some(x => x.id === e.id && x.kind === e.kind)) || Dex.species(e.id).tier;
const tierSourceOf = id => {
  const s = Dex.species(id);
  const src = s.tierSource && s.tierSource.from ? s.tierSource.from : String(s.tierSource || '-');
  return src === 'redgpt-override' ? 'override' : src === 'estimated' ? 'estimated' : 'imported (' + src + ')';
};

const SPREADS = {
  physical: {nature: 'adamant', evs: {atk: 252, spe: 252, hp: 4}},
  physFast: {nature: 'jolly', evs: {atk: 252, spe: 252, hp: 4}},
  special: {nature: 'modest', evs: {spa: 252, spe: 252, hp: 4}},
  specFast: {nature: 'timid', evs: {spa: 252, spe: 252, hp: 4}},
  physWall: {nature: 'impish', evs: {hp: 252, def: 252}},
  specWall: {nature: 'calm', evs: {hp: 252, spd: 252}},
};
function setFor(entry, spread, {item = null, ability = null, moves = ['tackle']} = {}) {
  const sp = Dex.species(entry.id);
  const held = sp.requiredItem ? Dex.toID(sp.requiredItem) : (entry.kind === 'forme' ? entry.item : item);
  return {set: {species: sp.id, level: 100, nature: spread.nature, evs: spread.evs, ivs: Pokemon.maxIVs(),
    ability: ability || P.abilityOf(entry), item: held, moves}};
}
const calcCell = r => (r && !r.empty ? `${r.min}-${r.max} (${r.minPercent}-${r.maxPercent}%)` : '—');
function calc(a, d, m) { try { const r = Calculator.calculate({attacker: a, defender: d, move: m}); return r && !r.empty ? r : null; } catch { return null; } }

/* ---------- trapping, discovered by hook rather than by name ---------- */
const TRAP_ABILITIES = Object.entries(Abilities.registry)
  .filter(([, d]) => d && typeof d.onTrapped === 'function').map(([id]) => id);
const TRAP_IMMUNE_ABILITIES = Object.entries(Abilities.registry)
  .filter(([, d]) => d && d.trapImmune).map(([id]) => id);
const TRAP_ESCAPE_ITEMS = Object.entries(Items.registry)
  .filter(([, d]) => d && d.escapesTrapping).map(([id]) => id);
const trapperNamesIn = list => list.filter(e => P.abilitiesOf(e).some(a => TRAP_ABILITIES.includes(Dex.toID(a)))).map(e => e.name);

/* ---------- a defensive core built from PU, never reused from NU ----------
 * Hand-picked for type and role spread, then filtered against the live roster
 * so a name that leaves PU drops out instead of silently profiling an NU
 * Pokemon. The count is printed, so a core that quietly emptied is visible.  */
const CORE = [
  ['Aggron', 'physWall', 'leftovers'], ['Avalugg-Hisui', 'physWall', 'leftovers'],
  ['Milotic', 'specWall', 'leftovers'], ['Florges', 'specWall', 'leftovers'],
  ['Snorlax', 'specWall', 'leftovers'], ['Mudsdale', 'physWall', 'leftovers'],
  ['Jellicent', 'specWall', 'leftovers'], ['Claydol', 'specWall', 'leftovers'],
  ['Eldegoss', 'specWall', 'leftovers'], ['Wo-Chien', 'specWall', 'leftovers'],
  ['Gigalith', 'physWall', 'leftovers'], ['Coalossal', 'physWall', 'leftovers'],
  ['Turtonator', 'physWall', 'leftovers'], ['Alcremie', 'specWall', 'leftovers'],
  ['Audino-Mega', 'physWall', null], ['Slowbro-Galar', 'physWall', 'leftovers'],
  ['Vileplume', 'specWall', 'blacksludge'], ['Lanturn', 'specWall', 'leftovers'],
  ['Sandslash-Alola', 'physWall', 'leftovers'], ['Wishiwashi-School', 'physWall', 'leftovers'],
].map(([n, sp, it]) => { const e = byName(n); return e ? {n, e, sp, it, cfg: setFor(e, SPREADS[sp], {item: it})} : null; }).filter(Boolean);

const REVENGE = [
  ['Archeops', 'physFast', 'choiceband', 'stoneedge'], ['Electrode-Hisui', 'specFast', 'choicescarf', 'thunderbolt'],
  ['Floatzel', 'physFast', 'lifeorb', 'waterfall'], ['Ambipom', 'physFast', 'lifeorb', 'tailslap'],
  ['Salazzle', 'specFast', 'choicescarf', 'sludgewave'], ['Ninetales-Alola', 'specFast', 'choicescarf', 'icebeam'],
  ['Galvantula', 'specFast', 'choicescarf', 'thunder'], ['Mismagius', 'specFast', 'lifeorb', 'shadowball'],
  ['Zoroark', 'specFast', 'lifeorb', 'darkpulse'], ['Tauros-Paldea-Blaze', 'physFast', 'choiceband', 'closecombat'],
].map(([n, sp, it, mv]) => { const e = byName(n); return e && Dex.hasMove(mv) ? {n, mv, cfg: setFor(e, SPREADS[sp], {item: it, moves: [mv]})} : null; }).filter(Boolean);

/* ---------- profile rendering ---------- */
function renderProfile(entry, {compact = false} = {}) {
  const p = P.profile(entry, {tier: enforcedTier(entry)});
  const s = p.species;
  const out = [];
  const own = s.tier, enf = enforcedTier(entry);
  const note = enf !== own ? ` _(its own \`species.tier\` reads ${own} — the base's; the enforced tier is the one shown)_` : '';
  out.push(`**${entry.name}** — ${entry.kind}, **${enf}**, source: ${entry.estimated ? '**estimated**' : tierSourceOf(entry.id)}${note}`);
  out.push(`  ${s.types.join('/')} | BST ${s.bst} (${stats(s)}) | Abilities: ${p.abilities.join(' / ')}`);
  const offLines = p.abilities.map(a => {
    const o = p.offByAbility[a];
    return `${a}: Atk ${o.atkNeutral}/${o.atkPlus}, SpA ${o.spaNeutral}/${o.spaPlus}, Spe ${o.speNeutral}/${o.spePlus}`;
  });
  out.push(`  Engine stats @252 (neutral/positive): ${offLines.join(' — ')}`);
  const trapAb = p.abilities.filter(a => TRAP_ABILITIES.includes(Dex.toID(a)));
  if (trapAb.length) out.push(`  **TRAPPING ABILITY: ${trapAb.join(', ')}** (${p.abilities.length === 1 ? 'forced — its only ability' : 'optional — one of ' + p.abilities.length})`);
  if (entry.kind === 'forme') {
    const base = Dex.species(Dex.toID(entry.base));
    out.push(`  Item: **${itemName(entry.item)}** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)`);
    out.push(`  Base: ${entry.base} (${base.tier}), pre-Mega abilities ${Dex.abilityList(base.id).join(' / ')}, pre-Mega Spe ${P.offence({id: base.id, kind: 'species'}, Dex.abilityList(base.id)[0]).spePlus} (max +Spe)`);
  } else {
    out.push('  Item: **free**');
  }
  out.push(`  STAB: ${p.stab.join(' · ') || '**none**'}`);
  out.push(`  Physical coverage: ${p.physical.join(', ') || '**none**'}`);
  out.push(`  Special coverage: ${p.special.join(', ') || '**none**'}`);
  if (compact) return out.join('\n');
  const row = (l, v) => (v.length ? `  ${l}: ${v.join(', ')}` : null);
  [row('Setup', p.setup), row('Reliable recovery', p.recovery), row('Drain/Rest-only', p.drain),
    row('Priority', p.priority), row('Hazards', p.hazards), row('Removal', p.removal), row('Pivot', p.pivot),
    row('Phazing', p.phazing), row('Status', p.status), row('Cleric', p.cleric), row('Trapping moves', p.trapping),
    row('Weather/terrain', p.weatherTerrain), row('Utility', p.utility)].filter(Boolean).forEach(l => out.push(l));
  const flags = [['knockoff', 'Knock Off'], ['trick', 'Trick'], ['switcheroo', 'Switcheroo'], ['encore', 'Encore'],
    ['taunt', 'Taunt'], ['substitute', 'Substitute'], ['batonpass', 'Baton Pass'], ['trickroom', 'Trick Room'],
    ['tailwind', 'Tailwind'], ['focuspunch', 'Focus Punch']].filter(([id]) => p.has(id)).map(([, l]) => l);
  if (flags.length) out.push(`  Notable: ${flags.join(', ')}`);
  return out.join('\n');
}

/* ---------- mechanical scan for upward candidates, no fixed cap ---------- */
const NOTABLE_ABILITIES = ['hugepower', 'purepower', 'adaptability', 'skilllink', 'contrary', 'speedboost',
  'protean', 'libero', 'download', 'sheerforce', 'strongjaw', 'toughclaws', 'sharpness', 'technician',
  'galewings', 'lightmetal', 'heavymetal', 'magicbounce', 'regenerator', 'unaware', 'poisonheal', 'guts',
  'quickfeet', 'moxie', 'chillingneigh', 'tintedlens', 'compoundeyes', 'refrigerate', 'corrosion',
  'marvelscale', 'icescales', 'stamina', 'schooling', 'tabletsofruin'];

function scanUp() {
  const flagged = [];
  for (const e of SUBJECT) {
    const p = P.profile(e, {tier: SUBJECT_TIER});
    const s = Dex.species(e.id);
    const reasons = [];
    const bestAtk = Math.max(...p.abilities.map(a => p.offByAbility[a].atkPlus));
    const bestSpa = Math.max(...p.abilities.map(a => p.offByAbility[a].spaPlus));
    const bestSpe = Math.max(...p.abilities.map(a => p.offByAbility[a].spePlus));
    if (bestAtk >= 470) reasons.push(`Attack **${bestAtk}**`);
    if (bestSpa >= 450) reasons.push(`Special Attack **${bestSpa}**`);
    if (bestSpe >= 360) reasons.push(`Speed **${bestSpe}**`);
    if (s.bst >= 530) reasons.push(`BST ${s.bst}`);
    if (bestAtk > 440 && s.baseStats.atk < 110) reasons.push(`Attack reaches ${bestAtk} off base ${s.baseStats.atk} — an ability is doing the work`);
    if (p.setup.length && p.priority.length && p.recovery.length) reasons.push('setup + priority + reliable recovery');
    if (p.setup.some(m => /Shell Smash|Quiver Dance|Dragon Dance|Swords Dance|Nasty Plot|Shift Gear|Calm Mind|Bulk Up/.test(m)) && bestSpe >= 310) reasons.push('strong setup on a fast frame');
    const notable = p.abilities.filter(a => NOTABLE_ABILITIES.includes(Dex.toID(a)));
    if (notable.length) reasons.push(`ability: ${notable.join('/')}`);
    const trap = p.abilities.filter(a => TRAP_ABILITIES.includes(Dex.toID(a)));
    if (trap.length) reasons.push(`**trapping ability: ${trap.join('/')}**`);
    if (trap.length && p.setup.length) reasons.push('**trapping + setup**');
    if (trap.length && p.recovery.length) reasons.push('**trapping + reliable recovery**');
    if (e.estimated && s.bst >= 520) reasons.push(`BST ${s.bst} on an **estimated** tier`);
    if (p.hazards.length && bestAtk >= 380) reasons.push('hazards + real offence');
    if (reasons.length >= 2) flagged.push({e, p, s, reasons});
  }
  return flagged.sort((a, b) => b.reasons.length - a.reasons.length);
}

const upFlagged = scanUp();
const UP_CANDIDATES = upFlagged.map(f => {
  const p = f.p;
  const physical = p.wantsPhysical && (!p.wantsSpecial || Math.max(...p.abilities.map(a => p.offByAbility[a].atkPlus)) >= Math.max(...p.abilities.map(a => p.offByAbility[a].spaPlus)));
  const spread = physical ? (Dex.species(f.e.id).baseStats.spe >= 95 ? 'physFast' : 'physical') : (Dex.species(f.e.id).baseStats.spe >= 95 ? 'specFast' : 'special');
  const moves = [...p.stab, ...(physical ? p.physical : p.special)]
    .map(t => { const m = /^[A-Za-z]+ (.+?) \d/.exec(t); return m ? Dex.toID(m[1]) : null; })
    .filter(id => id && Dex.hasMove(id)).slice(0, 4);
  return {entry: f.e, spread, moves, reasons: f.reasons};
}).filter(c => c.moves.length);

function matrix(c) {
  const atk = setFor(c.entry, SPREADS[c.spread], {moves: c.moves, item: c.entry.kind === 'forme' ? null : 'lifeorb'});
  const head = `| PU defender (representative test set) | ${c.moves.map(id => Dex.move(id).name).join(' | ')} |`;
  const sep = `| --- | ${c.moves.map(() => '---').join(' | ')} |`;
  return [`Attacker: **${c.entry.name}**, ${SPREADS[c.spread].nature} ${JSON.stringify(SPREADS[c.spread].evs)}, ${c.entry.kind === 'forme' ? itemName(c.entry.item) + ' (forced)' : 'Life Orb'} — a **representative test set**.`,
    '', head, sep,
    ...CORE.map(d => `| ${d.n} (${d.sp}${d.it ? ', ' + itemName(d.it) : ', no item'}) | ` + c.moves.map(id => calcCell(calc(atk, d.cfg, id))).join(' | ') + ' |')].join('\n');
}

/* ---------- downward: role comparison against ZU ---------- */
const ROLE_KEYS = p => {
  const k = [];
  if (p.hazards.length) k.push('hazards');
  if (p.removal.length) k.push('removal');
  if (p.recovery.length) k.push('recovery');
  if (p.pivot.length) k.push('pivot');
  if (p.setup.length) k.push('setup');
  if (p.priority.length) k.push('priority');
  if (p.phazing.length) k.push('phazing');
  if (p.cleric.length) k.push('cleric');
  if (p.status.length) k.push('status');
  return k;
};
function roleCompare(entry) {
  const p = P.profile(entry, {tier: SUBJECT_TIER});
  const s = Dex.species(entry.id);
  const mine = new Set(ROLE_KEYS(p));
  const scored = DOWN.map(r => {
    const rp = P.profile(r, {tier: DOWN_TIER});
    const rs = Dex.species(r.id);
    const shared = ROLE_KEYS(rp).filter(k => mine.has(k)).length;
    const typeOverlap = rs.types.filter(t => s.types.includes(t)).length;
    return {r, rp, rs, score: shared * 3 + typeOverlap * 3 + (Math.abs(rs.bst - s.bst) < 70 ? 2 : 0)};
  }).sort((a, b) => b.score - a.score).slice(0, 5);
  return `**${entry.name}** — ${s.types.join('/')}, BST ${s.bst} (${stats(s)}), ${p.abilities.join(' / ')}, item ${entry.kind === 'forme' ? '**locked to ' + itemName(entry.item) + '**' : 'free'}
Roles: ${ROLE_KEYS(p).join(', ') || '—'} | STAB: ${p.stab.join(' · ') || 'none'} | Recovery: ${p.recovery.join(', ') || 'none'} | Priority: ${p.priority.join(', ') || 'none'}

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
${scored.map(({r, rp, rs}) => `| ${r.name} | ${rs.types.join('/')} | ${rs.bst} (${stats(rs)}) | ${P.abilitiesOf(r).join(', ')} | ${ROLE_KEYS(rp).join(', ') || '—'} | ${rp.recovery.join(', ') || 'none'} | ${rp.stab.join(' · ') || 'none'} |`).join('\n')}`;
}

/* Downward shortlist: weakest engine offence + no compensating utility. */
const downFlagged = SUBJECT.map(e => {
  const p = P.profile(e, {tier: SUBJECT_TIER});
  const s = Dex.species(e.id);
  const bestOff = Math.max(...p.abilities.map(a => Math.max(p.offByAbility[a].atkPlus, p.offByAbility[a].spaPlus)));
  const util = ROLE_KEYS(p).length;
  return {e, p, s, bestOff, util, score: bestOff / 100 + util * 1.2 + s.bst / 100};
}).sort((a, b) => a.score - b.score).slice(0, 22);

/* ---------- tables ---------- */
function speedTable(list) {
  const rows = list.map(e => ({e, s: Dex.species(e.id), o: P.offence(e, P.abilityOf(e))}))
    .filter(x => x.s.baseStats.spe >= 80).sort((a, b) => b.o.spePlus - a.o.spePlus);
  return ['| Pokémon | Base | Max neutral | Max +Spe | +1 | +2 | Scarf (from max +Spe) |', '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map(({e, s, o}) => `| ${e.name} | ${s.baseStats.spe} | ${o.speNeutral} | ${o.spePlus} | ${Math.floor(o.spePlus * 1.5)} | ${Math.floor(o.spePlus * 2)} | ${Math.floor(o.spePlus * 1.5)} |`)].join('\n');
}
function priorityTable(list) {
  const rows = [];
  for (const e of list) {
    const p = P.profile(e, {tier: enforcedTier(e)});
    if (!p.priority.length) continue;
    const o = p.offByAbility[p.ability];
    rows.push(`| ${e.name} | ${p.priority.join('; ')} | Atk ${o.atkPlus} / SpA ${o.spaPlus} | ${p.abilities.join('/')} |`);
  }
  return ['| Pokémon | Priority moves (engine BP / bracket) | Max offence | Abilities |', '| --- | --- | --- | --- |', ...rows].join('\n');
}
function megaTable(tier) {
  const megas = rosters[tier].filter(e => e.kind === 'forme').sort((a, b) => a.name.localeCompare(b.name));
  return [`${tier} has **${megas.length}** forme entries and a team gets **one** Mega.`, '',
    '| Forme | Types | BST (spread) | Ability | Source | STAB | Setup | Recovery | Priority |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...megas.map(e => {
      const p = P.profile(e, {tier});
      const s = Dex.species(e.id);
      return `| ${e.name} | ${s.types.join('/')} | ${s.bst} (${stats(s)}) | ${Dex.abilityList(e.id)[0]} | ${e.estimated ? '**estimated**' : 'imported'} | ${p.stab.join(' · ') || 'none'} | ${p.setup.join(', ') || '—'} | ${p.recovery.join(', ') || '—'} | ${p.priority.join(', ') || '—'} |`;
    })].join('\n');
}
function envTable(tier) {
  const list = rosters[tier];
  const learn = id => list.filter(e => {
    const src = e.kind === 'forme' && e.base ? Dex.toID(e.base) : e.id;
    return (Dex.legalMoveList(src) || []).some(m => Dex.toID(m) === id);
  }).map(e => e.name);
  const abil = ids => list.filter(e => P.abilitiesOf(e).some(a => ids.includes(Dex.toID(a)))).map(e => e.name);
  return {learn, abil};
}

/* ================= assemble ================= */
const pu = Formats.get('tierpu').rules;
const nu = Formats.get('tiernu').rules;
const zu = Formats.get('tierzu').rules;
const ruleRow = (label, a, b, c) => `| ${label} | ${a} | ${b} | ${c} |`;

const doc = [];
doc.push(`# RedGPT PU Final Audit — Verified Evidence Packet

**Generated from the live RedGPT project** by \`tools/pu-final-evidence.js\`.
Every stat, movepool value, damage figure and speed number comes from the running
engine, the packaged data, the validator or the real damage calculator.

**RedGPT has no usage, ladder, win-rate, tournament or popularity data**, so none
is quoted. Section T lists what genuinely cannot be determined.

---

## Your task

Make the **complete bidirectional PU tier audit**:

1. **Which current PU entries are too strong for PU and should move UP to NU?**
2. **Which current PU entries are too weak or outclassed and should move DOWN to ZU?**

The bars are section E (the current NU roster, **after** the NU pass moved seven
entries) and section D (the complete ZU roster).

**Most entries should stay put.** A high BST alone does not promote, and weak raw
stats alone do not demote — a demotion needs ZU to already contain something that
credibly does the candidate's **actual job** as well or better. Unique value that
justifies staying includes superior typing, Regenerator, Magic Bounce, reliable
recovery, a better hazard or pivot role, unique priority, item freedom, a
trapping ability, or simply not costing the team's only Mega slot.

**Dropping a Pokémon from PU to ZU does not make it unusable in PU** — it makes it
legal in ZU. So the real question for every demotion is **can ZU absorb it
healthily?** If it would immediately become one of ZU's dominant threats, it
should stay in PU even if it looks weak beside the rest of PU.

**There is no cap on how many entries may move — including zero.**

For each entry you move: exact name, species or forme, direction, confidence,
two or three sentences naming the specific Pokémon it outclasses or is outclassed
by, and the numbers you relied on with the ability and item they assume. Then list
what you **considered and deliberately left**.

**This packet contains no recommendations.** Every flag in sections G, H and S is
a mechanical reason to look, not a verdict.

---

## Context: the NU pass that preceded this one

**The NU audit promoted six entries and demoted one**, and all seven have already
been applied — so the NU roster in section E is the **post-pass** bar, and PU has
already **gained Mega Audino**:

| Moved | Kind | Direction | The mechanic that decided it |
| --- | --- | --- | --- |
| Duraludon | species | NU → RU | **Light Metal** is +1 Speed on every entry here — ~295 Spe becomes ~442 with no setup turn |
| Copperajah | species | NU → RU | **Heavy Metal** is +1 Atk / +1 Def / -2 Spe on entry here — ~394 Atk becomes ~591 before the item |
| Infernape | species | NU → RU | mixed attacker with restored 140 BP Overheat *and* redesigned 150 BP Focus Punch |
| Tornadus | species | NU → RU | restored 120 BP Hurricane, Nasty Plot, 111 Speed, Prankster/Defiant |
| Munkidori | species | NU → RU | 130 SpA / 106 Speed with Nasty Plot, Toxic Chain and Parting Shot |
| Meloetta-Pirouette | forme entry | NU → RU | 128 Atk / 128 Speed with 150 BP Focus Punch |
| **Audino-Mega** | forme | **NU → PU** | the Audinite costs the item slot *and* the team's only Mega slot; base Audino is already PU with Regenerator and item freedom |

**Two consequences for this audit:**

- **NU is ${UP.length}, not 65**, and **PU is ${SUBJECT.length}**, because Mega Audino joined it.
  A PU entry moving up joins the roster in section E as it stands now.
- **Two of the six moved on a RedGPT ability redesign the imported tier could not
  have known about.** That is the shape worth looking for again in PU: an
  imported tier that is right about the Pokémon Smogon ranked and wrong about the
  one this engine ships.

**Meloetta-Pirouette is a bookkeeping caveat worth knowing**: it carries
\`battleOnly\`, and **no route into it exists** — Relic Song is packaged as an
ordinary 75 BP sound move with no forme-change implementation. Its tier is a
roster classification; the validator refuses it in every tier format at every
tier. It is listed in NU→RU for completeness, not because anything changed on the
field.
`);

doc.push(`---

## A. Current tier / rules snapshot

| Tier | Entries |
| --- | --- |
${Formats.TIER_ORDER.map(t => `| ${t} | ${rosters[t].length} |`).join('\n')}

**Selectable species: ${Dex.allSpecies.length}** (packaged ${Dex.packagedSpecies.length}).

**PU format rules, read live — and compared against NU and ZU rather than assumed:**

| Rule | PU | NU | ZU |
| --- | --- | --- | --- |
${ruleRow('`maxTier`', '**PU**', 'NU', 'ZU')}
${ruleRow('`tera`', pu.tera, nu.tera, zu.tera)}
${ruleRow('`mega`', pu.mega, nu.mega, zu.mega)}
${ruleRow('`speciesClause`', pu.speciesClause, nu.speciesClause, zu.speciesClause)}
${ruleRow('`sleepClause`', pu.sleepClause, nu.sleepClause, zu.sleepClause)}
${ruleRow('`itemClause`', !!pu.itemClause, !!nu.itemClause, !!zu.itemClause)}
${ruleRow('`evasionClause`', pu.evasionClause, nu.evasionClause, zu.evasionClause)}
${ruleRow('`ohkoClause`', pu.ohkoClause, nu.ohkoClause, zu.ohkoClause)}
${ruleRow('`bannedMoves`', pu.bannedMoves.map(id => Dex.move(id).name).join(', ') || 'none', nu.bannedMoves.length, zu.bannedMoves.length)}
${ruleRow('`bannedItems`', (pu.bannedItems || []).length || 'none', (nu.bannedItems || []).length || 'none', (zu.bannedItems || []).length || 'none')}
${ruleRow('`bannedSpecies`', (pu.bannedSpecies || []).length || 'none', (nu.bannedSpecies || []).length || 'none', (zu.bannedSpecies || []).length || 'none')}
${ruleRow('`bannedAbilities`', (pu.bannedAbilities || []).length || '**none**', (nu.bannedAbilities || []).length || '**none**', (zu.bannedAbilities || []).length || '**none**')}
${ruleRow('level / team', `${pu.forceLevel} / ${pu.teamSize}v${pu.teamSize}`, `${nu.forceLevel} / ${nu.teamSize}v${nu.teamSize}`, `${zu.forceLevel} / ${zu.teamSize}v${zu.teamSize}`)}
${ruleRow('EV limit / per stat / IV max', `${pu.evLimit}-${pu.evStatLimit} / ${pu.ivMax}`, `${nu.evLimit}-${nu.evStatLimit} / ${nu.ivMax}`, `${zu.evLimit}-${zu.evStatLimit} / ${zu.ivMax}`)}

**PU is byte-identical to NU and ZU on every rule except \`maxTier\`.** There are
no PU-specific bans of any kind.

**Trapping abilities are LEGAL in PU, and in every other competitive format.**
Verified live across all ${Formats.list().length} formats: every one carries
\`bannedAbilities: []\`. The complete list of trapping abilities, discovered by
hook rather than by name, is **${TRAP_ABILITIES.map(a => Dex.ability(a).name).join(', ')}**.
Section Q covers what that is worth; sections C and S mark every holder.`);

doc.push(`---

## B. RedGPT mechanics that decide tiering here — reconfirmed from the live build

**Priority (all unconditional in this project):**

| Move | Type | Cat | BP | Priority | Acc |
| --- | --- | --- | --- | --- | --- |
${['suckerpunch', 'thunderclap', 'firstimpression', 'upperhand', 'grassyglide'].map(id => {
  const m = Dex.move(id);
  return `| ${m.name} | ${m.type} | ${m.category} | **${m.basePower}** | **+${(m.priority || 0) + (Mechanics.ENGINE_PRIORITY.has(id) ? 1 : 0)}** | ${m.accuracy}% |`;
}).join('\n')}

Grassy Glide's packaged priority is **0** — the +1 is added by the engine, so
reading the move data alone misses it. Upper Hand has no condition and no flinch.

**Restored base powers (live):** ${['overheat', 'leafstorm', 'dracometeor', 'blizzard', 'hydropump', 'fireblast', 'thunder', 'hurricane', 'headsmash', 'closecombat'].map(id => `${Dex.move(id).name} ${Dex.move(id).basePower}`).join(', ')}.

**Focus Punch is ${Dex.move('focuspunch').basePower} BP at ${Dex.move('focuspunch').accuracy}% accuracy and priority ${Dex.move('focuspunch').priority}** — no Substitute condition, no negative priority.

**Multi-hit:** 2-5 hit moves are **25 BP per hit**, exactly-2-hit moves **50 BP
per hit**. Triple Axel is deliberately excluded (${Dex.move('tripleaxel').basePower} BP × ${JSON.stringify(Dex.move('tripleaxel').multihit)}) and so is Population Bomb (${Dex.move('populationbomb').basePower} BP × ${JSON.stringify(Dex.move('populationbomb').multihit)}).
**Skill Link forces the maximum** and the calculator honours it.

**Ring Target:** the holder's attacks hit for **neutral** damage through a
**type** immunity. It does **not** beat Levitate, Flash Fire, Water Absorb or any
other ability immunity. One per team, visible from turn one, and **no Mega can
hold it**.

**Toxic Orb and Flame Orb fire on ENTRY**, so Guts / Poison Heal / Quick Feet
holders are already boosted the turn they arrive.

**Light Metal — verified live:** ${(Dex.ability('lightmetal') || {}).shortDesc || (Dex.ability('lightmetal') || {}).desc || 'no packaged description'}

**Heavy Metal — verified live:** ${(Dex.ability('heavymetal') || {}).shortDesc || (Dex.ability('heavymetal') || {}).desc || 'no packaged description'}

**Download — verified live:** ${(Dex.ability('download') || {}).shortDesc || (Dex.ability('download') || {}).desc || 'no packaged description'}

**Supreme Overlord — verified live:** ${(Dex.ability('supremeoverlord') || {}).shortDesc || (Dex.ability('supremeoverlord') || {}).desc || 'no packaged description'}

**Cloud Nine — verified live:** ${(Dex.ability('cloudnine') || {}).shortDesc || (Dex.ability('cloudnine') || {}).desc || 'no packaged description'}

**Air Lock — verified live:** ${(Dex.ability('airlock') || {}).shortDesc || (Dex.ability('airlock') || {}).desc || 'no packaged description'}

### Trapping abilities — the complete verified Part II result

Discovery was **behavioural**: every ability in the registry defining an
\`onTrapped\` hook, not a search for three familiar names.

| Ability | Live condition (from \`abilities.js\`) |
| --- | --- |
${TRAP_ABILITIES.map(a => {
  const cond = {shadowtag: 'traps the foe **unless the foe also has Shadow Tag**', arenatrap: 'traps the foe **only while the foe is grounded** (`battle.isGrounded`)', magnetpull: 'traps the foe **only if the foe is a Steel type**'}[a] || 'see source';
  return `| **${Dex.ability(a).name}** | ${cond} |`;
}).join('\n')}

\`battle.isTrapped\` is the single predicate and its **branch order** is
load-bearing. In order:

1. **${TRAP_ESCAPE_ITEMS.map(i => Dex.item(i).name).join(', ')}** — escapes everything, checked first.
2. **Fairy Lock** (pseudo-weather) — traps both sides, and is checked **above** the Ghost escape.
3. Volatile traps — partial trapping (Wrap/Bind), Mean Look/Block, Ingrain, Octolock.
4. **Ghost typing escapes** — all three abilities, read off **live** types.
5. **${TRAP_IMMUNE_ABILITIES.map(a => Dex.ability(a).name).join(', ')}** (\`trapImmune\`) on the victim.
6. The trapper's \`onTrapped\` hook.

Measured behaviour, every row driven through the real engine and cross-checked
against a real \`{type:'switch'}\` command (the predicate and the command agreed
in every case):

| Situation | Trapped? |
| --- | --- |
| ordinary grounded non-Ghost vs Shadow Tag | **yes** |
| Ghost vs Shadow Tag / Arena Trap / Magnet Pull | no |
| Flying or Levitate vs Shadow Tag | **yes** (Shadow Tag is not a grounding effect) |
| Flying, Levitate or Air Balloon vs Arena Trap | no |
| Flying holding an **Iron Ball** vs Arena Trap | **yes** — it is grounded again |
| Steel vs Magnet Pull | **yes** |
| Steel **/Ghost** (Aegislash) vs Magnet Pull | no — Ghost is checked first |
| victim holding **Shed Shell** | no |
| victim with **Guard Dog** | no |
| Shadow Tag vs Shadow Tag | no — mutual |
| victim with **Mold Breaker** | **yes** — Mold Breaker does not break trapping |
| trapper **Gastro Acid**'d, or victim has **Neutralizing Gas** | no |
| trapper switches out or faints | no — frees immediately |

**Two results that change what trapping is worth:**

- **Every pivot move bypasses trapping.** U-turn, Volt Switch, Flip Turn,
  Parting Shot, Baton Pass and Teleport all escape a trap — verified for all six.
  Trapping blocks **voluntary** switching only.
- **Phazing pulls a trapped Pokémon out.** An opposing Whirlwind replaced a
  trapped victim; forced switches never consult \`isTrapped\`.

**Ability Shield** (\`abilityProtected\`) exists and protects an ability from
suppression.`);

doc.push(`---

## C. Full PU competitive profiles

All **${SUBJECT.length}** current PU entries, engine-resolved. Trapping-ability
holders are marked in bold on their own line.

${SUBJECT.map(e => renderProfile(e)).join('\n\n')}`);

doc.push(`---

## D. Full ZU comparison bar

All **${DOWN.length}** current ZU entries — this is what a downward move is
measured against, and the roster that has to absorb anything that drops. Compact
format (the same fields, minus the utility rows) because ZU is large; **nothing
is omitted**.

${DOWN.map(e => renderProfile(e, {compact: true})).join('\n\n')}`);

doc.push(`---

## E. Post-change NU comparison bar

All **${UP.length}** NU entries **after** the NU pass. This is the destination a
promotion joins — do not compare against the stale 65-entry roster.

${UP.map(e => renderProfile(e, {compact: true})).join('\n\n')}`);

const estSubject = SUBJECT.filter(e => e.estimated);
doc.push(`---

## F. Estimated-forme audit

**${estSubject.length} PU forme${estSubject.length === 1 ? '' : 's'} carr${estSubject.length === 1 ? 'ies' : 'y'} an \`estimated\` tier** — Smogon never
ranked them, so a nearest-neighbour model placed them by BST and base tier. **The
model has no notion of movepool, ability, matchup structure or item opportunity
cost**, which is exactly what it got wrong on Mega Starmie in the UU pass. These
are the softest placements in PU and estimated placement is **soft evidence only**.

**ZU has ${DOWN.filter(e => e.estimated).length} estimated formes; NU has ${UP.filter(e => e.estimated).length}.**

${estSubject.length ? estSubject.map(e => {
  const p = P.profile(e, {tier: SUBJECT_TIER});
  const s = Dex.species(e.id);
  const base = Dex.species(Dex.toID(e.base));
  const ab = Dex.ability(Dex.toID(Dex.abilityList(e.id)[0]));
  return `### ${e.name}

- Base **${e.base}** (${base.tier}), ${stats(base)}; pre-Mega abilities ${Dex.abilityList(base.id).join(' / ')}
- Item **${itemName(e.item)}** — forced, not removable, and it is the entire cost of the forme
- ${s.types.join('/')} | BST ${s.bst} (${stats(s)})
- Ability **${Dex.abilityList(e.id)[0]}** — packaged: _${(ab && (ab.shortDesc || ab.desc)) || 'no packaged description'}_
- Speed: base ${P.offence({id: base.id, kind: 'species'}, Dex.abilityList(base.id)[0]).spePlus} → Mega **${p.off.spePlus}** (max +Spe)
- Engine offence @252+: Atk **${p.off.atkPlus}**, SpA **${p.off.spaPlus}**
- STAB ${p.stab.join(' · ') || '**none**'} | Setup ${p.setup.join(', ') || '**none**'} | Recovery ${p.recovery.join(', ') || '**none**'} | Priority ${p.priority.join(', ') || '**none**'}
- Physical coverage: ${p.physical.join(', ') || '**none**'}
- Special coverage: ${p.special.join(', ') || '**none**'}`;
}).join('\n\n') : '_No PU forme carries an estimated tier — every forme entry in PU is imported or an explicit override._'}`);

doc.push(`---

## G. Serious PU → NU candidate evidence

**No fixed cap.** ${upFlagged.length} of ${SUBJECT.length} PU entries tripped two
or more mechanical flags in the scan; the ${UP_CANDIDATES.length} with usable
offensive sets get a full matrix below, against the same PU defensive core.

**Flags are reasons to look, not verdicts.**

${UP_CANDIDATES.map(c => `### ${c.entry.name}

_Flagged for: ${c.reasons.join('; ')}._

${renderProfile(c.entry)}

${matrix(c)}`).join('\n\n---\n\n')}`);

doc.push(`---

## H. Serious PU → ZU candidate evidence

The ${downFlagged.length} PU entries with the lowest combination of engine
offence, utility breadth and BST. **Low output is not a verdict** — several of
these will have a role ZU cannot fill, which is what section K is for, and the
binding question is whether ZU can absorb them healthily.

${downFlagged.map(({e}) => `### ${e.name}\n\n${roleCompare(e)}`).join('\n\n---\n\n')}`);

doc.push(`---

## I. PU offensive matrices

Every matrix in section G runs against the **same PU defensive core**, built from
PU entries rather than reused from NU, so candidates compare column by column.

**The core (${CORE.length} entries):** ${CORE.map(d => `${d.n} (${d.sp})`).join(', ')}.

Type and role coverage of the core: physical walls, special walls, Steel, Water,
Ground, Fairy, Flying-resist, Grass, Poison, Ghost, Dark, Rock, Ice, Fire,
Regenerator (Eldegoss, Slowbro-Galar), immunity absorbers (Jellicent Water
Absorb, Lanturn Volt Absorb, Claydol Levitate) and the tier's one Mega.

Every cell states attacker, nature, EVs, item, ability and move; defenders carry
the spread and item named in the row. These are **representative test sets**, not
usage sets — RedGPT has no usage data.

Classification — hard counter, reliable counter, soft counter, check,
revenge-only, not an answer — is yours; the engine supplies damage, and recovery,
speed and hazard chip are in sections C, L, M and P.`);

doc.push(`---

## J. PU revenge / check matrix

PU's counterplay into each upward candidate. Attackers are **representative test
sets**; the target sits on its own offensive spread from section G, so these are
the numbers against a candidate that has *not* invested in bulk.

| Candidate | ${REVENGE.map(a => `${a.n} ${Dex.move(a.mv).name}`).join(' | ')} |
| --- | ${REVENGE.map(() => '---').join(' | ')} |
${UP_CANDIDATES.map(c => {
  const target = setFor(c.entry, SPREADS[c.spread], {moves: ['tackle']});
  return `| ${c.entry.name} | ` + REVENGE.map(a => calcCell(calc(a.cfg, target, a.mv))).join(' | ') + ' |';
}).join('\n')}

**Remember trapping cuts both ways here.** A revenge killer that cannot switch in
safely is not an answer, and a trapped revenge killer cannot leave — but every
pivot move still escapes (section B).`);

doc.push(`---

## K. PU → ZU role-comparison matrices

Section H is the role comparison, one candidate at a time. ZU competitors are
selected by shared role keys, shared typing and BST proximity — a **mechanical
shortlist, not a judgement**. Their full profiles are in section D.

For each candidate the questions to answer are:

1. What does the PU candidate do that its ZU alternatives cannot?
2. What do the ZU alternatives do better?
3. Is the candidate actually outclassed, or merely weaker in the abstract?
4. **Would it be oppressive in ZU?**
5. Does it retain a unique niche that justifies PU?`);

doc.push(`---

## L. PU speed-tier table

Every PU entry at base Speed 80+. **Priority is not Speed** — that is section M.

${speedTable(SUBJECT)}

**Conditional speed abilities in PU** — none of these is active by default, and
the table above does **not** assume any of them:

${(() => {
  const {abil} = envTable(SUBJECT_TIER);
  return [['swiftswim', 'Swift Swim — needs rain'], ['chlorophyll', 'Chlorophyll — needs sun'],
    ['sandrush', 'Sand Rush — needs sandstorm'], ['slushrush', 'Slush Rush — needs snow'],
    ['unburden', 'Unburden — needs its item consumed'], ['speedboost', 'Speed Boost — +1 at the end of each turn'],
    ['quickfeet', 'Quick Feet — needs a status; the Orbs fire ON ENTRY, so this one is live from turn one'],
    ['lightmetal', 'Light Metal — +1 Speed on EVERY entry, resets on switch-out'],
    ['quarkdrive', 'Quark Drive — needs Electric Terrain or Booster Energy'],
    ['protosynthesis', 'Protosynthesis — needs sun or Booster Energy']]
    .map(([id, label]) => `- **${label}**: ${abil([id]).join(', ') || '_nobody in PU_'}`).join('\n');
})()}`);

doc.push(`---

## M. PU priority table

Engine priority for every PU entry that has any, including Grassy Glide's
engine-side +1.

${priorityTable(SUBJECT)}`);

doc.push(`---

## N. Weather / terrain / Trick Room / Tailwind environment

${(() => {
  const {learn, abil} = envTable(SUBJECT_TIER);
  return `**Weather by move:** Rain — ${learn('raindance').join(', ') || 'none'}; Sun — ${learn('sunnyday').join(', ') || 'none'}; Sand — ${learn('sandstorm').join(', ') || 'none'}; Snow — ${learn('snowscape').join(', ') || 'none'}.

**Weather by ability (automatic):** ${abil(['drizzle', 'drought', 'sandstream', 'snowwarning']).join(', ') || 'none'}.

**Weather abusers by ability:** ${abil(['swiftswim', 'chlorophyll', 'sandrush', 'slushrush', 'sandforce', 'icebody', 'raindish', 'solarpower']).join(', ') || 'none'}.

**Terrain by move:** Electric — ${learn('electricterrain').join(', ') || 'none'}; Grassy — ${learn('grassyterrain').join(', ') || 'none'}; Misty — ${learn('mistyterrain').join(', ') || 'none'}; Psychic — ${learn('psychicterrain').join(', ') || 'none'}.

**Terrain by ability:** ${abil(['electricsurge', 'grassysurge', 'mistysurge', 'psychicsurge']).join(', ') || 'none'}.

**Trick Room setters:** ${learn('trickroom').join(', ') || 'none'}. The **Warp Prism** makes Trick Room *the holder sets* last **8** turns instead of 5.

**Slow breakers that want it** (base Speed ≤ 50 with real offence): ${SUBJECT.filter(e => {
    const s = Dex.species(e.id); const p = P.profile(e, {tier: SUBJECT_TIER});
    const best = Math.max(...p.abilities.map(a => Math.max(p.offByAbility[a].atkPlus, p.offByAbility[a].spaPlus)));
    return s.baseStats.spe <= 50 && best >= 330;
  }).map(e => e.name).join(', ') || 'none'}.

**Tailwind setters:** ${learn('tailwind').join(', ') || 'none'}. The **Wind Sock** makes Tailwind *the holder sets* last **7** turns instead of 4.

Neither item can be held by a Mega, but a teammate can hold it.

**Mega Sol is PERSONAL weather**, not field-wide sun: it overrides
\`battle.weatherFor\` for its holder only. Nothing else on the field sees it.
No PU entry has it.`;
})()}`);

doc.push(`---

## O. PU hazard environment

${(() => {
  const {learn, abil} = envTable(SUBJECT_TIER);
  return `**Stealth Rock:** ${learn('stealthrock').join(', ') || 'none'}

**Spikes:** ${learn('spikes').join(', ') || 'none'}

**Toxic Spikes:** ${learn('toxicspikes').join(', ') || 'none'}

**Sticky Web:** ${learn('stickyweb').join(', ') || 'none'}

**Rapid Spin:** ${learn('rapidspin').join(', ') || 'none'}

**Defog:** ${learn('defog').join(', ') || 'none'}

**Mortal Spin / Tidy Up / Court Change:** ${[...new Set([...learn('mortalspin'), ...learn('tidyup'), ...learn('courtchange')])].join(', ') || 'none'}

**Magic Bounce:** ${abil(['magicbounce']).join(', ') || 'none'}

**Taunt (hazard deterrence):** ${learn('taunt').join(', ') || 'none'}

**Ghost types (block Rapid Spin):** ${rosters[SUBJECT_TIER].filter(e => Dex.species(e.id).types.includes('Ghost')).map(e => e.name).join(', ') || 'none'}

**Heavy-Duty Boots** are available to every **species** entry and to **no forme**
entry — the stone occupies the slot. That asymmetry is decisive for any
Rock-weak or pivot-reliant Mega on the candidate list.`;
})()}`);

doc.push(`---

## P. Recovery / longevity

These four categories are **not** interchangeable and are deliberately kept apart.

${(() => {
  const trueRec = [], rest = [], drain = [], passive = [];
  for (const e of SUBJECT) {
    const p = P.profile(e, {tier: SUBJECT_TIER});
    if (p.recovery.length) trueRec.push(`${e.name} (${p.recovery.join(', ')})`);
    if (p.has('rest')) rest.push(e.name);
    if (p.drain.length) drain.push(`${e.name} (${p.drain.join(', ')})`);
    const ab = P.abilitiesOf(e).filter(a => ['regenerator', 'poisonheal', 'raindish', 'icebody', 'waterabsorb', 'voltabsorb'].includes(Dex.toID(a)));
    if (ab.length) passive.push(`${e.name} (${ab.join('/')})`);
  }
  return `**TRUE IMMEDIATE RECOVERY** — Recover, Roost, Slack Off, Shore Up, Soft-Boiled, Milk Drink, Morning Sun, Synthesis, Moonlight:

${trueRec.join('; ') || 'none'}

**REST** — two helpless turns unless Early Bird, Sleep Talk or Snore is in the set. **Not** equivalent to the above:

${rest.join(', ') || 'none'}

**DRAINING** — proportional to damage dealt, so it fails against a resist and against a wall:

${drain.join('; ') || 'none'}

**PASSIVE** — Regenerator, Poison Heal, absorbs, weather healing (Leftovers is available to every non-forme entry):

${passive.join('; ') || 'none'}`;
})()}`);

doc.push(`---

## Q. Item / ability edge cases, and what trapping changes

**Item freedom across the upward candidates:**

| Candidate | Item freedom | Consequence |
| --- | --- | --- |
${UP_CANDIDATES.map(c => `| ${c.entry.name} | ${c.entry.kind === 'forme' ? '**No** — ' + itemName(c.entry.item) + ' is forced and unremovable' : 'Yes — any item'} | ${c.entry.kind === 'forme' ? 'no Band/Specs/Scarf/Life Orb/Boots/Leftovers/Ring Target/Orbs' : 'Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available'} |`).join('\n')}

**PU Mega opportunity cost:**

${megaTable(SUBJECT_TIER)}

A Mega is only tier-breaking if a team is pressured to spend its **one** Mega
slot on it rather than on anything else.

### Trapping in PU

**PU trapping-ability holders: ${trapperNamesIn(SUBJECT).join(', ') || '_none_'}.**

For context, across the whole ladder:

| Tier | Trapping-ability holders |
| --- | --- |
${Formats.TIER_ORDER.filter(t => rosters[t].length).map(t => `| ${t} | ${trapperNamesIn(rosters[t]).join(', ') || '—'} |`).join('\n')}

**A trapped opponent changes the real value of** Choice attackers (the lock stops
mattering when the foe cannot leave either), setup sweepers (the trapped
Pokémon becomes setup fodder), hazard support, recovery stalling and
wallbreakers. **Do not judge a trapping user as though switching remains freely
available to its victim** — but do remember the two escapes measured in section
B: every pivot move still works, and phazing still drags the victim out.

**The full global trapping audit is deliberately NOT part of this packet.** It
spans the whole ladder and is a separate document,
\`docs/TRAPPING_ABILITY_TIER_AUDIT_PROMPT.md\`.`);

doc.push(`---

## R. Transformation / forme legality audit

Every PU entry was checked for a route to a **higher-tier forme in battle** — the
Zygarde / Darmanitan-Galar shape this project has had to gate before.

**Item-driven routes from a PU species to a higher-tier forme: ${(() => {
  let n = 0;
  for (const e of rosters[SUBJECT_TIER]) for (const f of Dex.species(e.id).formeItems || []) if (f.tier && Formats.tierRank(f.tier) < Formats.tierRank(SUBJECT_TIER)) n++;
  return n;
})()}.** Each was put through \`Validation.validateTeam\` in the PU format:

| PU species | Item | Forme it would make | That forme's tier | Validator |
| --- | --- | --- | --- | --- |
${(() => {
  const rows = [];
  const mv = sp => { const ls = Dex.learnset(Dex.toID(sp)) || []; return (Array.isArray(ls) ? ls : Object.keys(ls)).slice(0, 1); };
  for (const e of rosters[SUBJECT_TIER]) {
    for (const f of Dex.species(e.id).formeItems || []) {
      if (!f.tier || Formats.tierRank(f.tier) >= Formats.tierRank(SUBJECT_TIER)) continue;
      let verdict = 'refused';
      try {
        const res = Validation.validateTeam([Pokemon.normalizeSet({species: e.id, item: f.item, level: 100, moves: mv(e.id)})], Formats.get('tierpu'));
        verdict = res.valid ? '**LEGAL — HOLE**' : 'refused';
      } catch { verdict = 'threw'; }
      rows.push(`| ${e.name} | ${itemName(f.item)} | ${f.forme} | **${f.tier}** | ${verdict} |`);
    }
  }
  return rows.length ? rows.sort().join('\n') : '| _none_ | | | | |';
})()}

**Ability-driven routes:**

${(() => {
  const out = [];
  for (const e of rosters[SUBJECT_TIER]) {
    for (const route of (Formats.formeAbilities ? Formats.formeAbilities(e.id) : []) || []) {
      const t = route.tier || '?';
      const gated = Formats.tierRank(t) < Formats.tierRank(SUBJECT_TIER);
      out.push(`- **${e.name}** → ${route.forme} via **${route.abilityName}** (${route.when}) — target tier **${t}**. ${gated ? '**Higher than PU: the ability is refused at team validation**, and the Pokémon stays legal on its other ability.' : 'Same rung as PU or lower — no legality issue.'}`);
    }
  }
  return out.join('\n') || '_None._';
})()}

**One known gap, reported rather than hidden.** §5's *"ban the route, not the
Pokémon"* rule has an **item** half (\`illegalFormeItems\`) and an **ability**
half (\`illegalFormeAbilities\`). There is **no move half**. Nothing in PU
exploits that today — no PU entry reaches a higher-tier forme through a move —
but a move-driven forme change (Relic Song → Meloetta-Pirouette is the obvious
candidate) would be **ungated** if it were ever implemented. Recorded as a
blocker, not fixed.`);

doc.push(`---

## S. New mechanical outliers surfaced by the broad scan

**Mechanical flags only — reasons to look, NOT recommendations.** ${upFlagged.length} of
${SUBJECT.length} PU entries tripped two or more. No arbitrary cap was applied.

${upFlagged.map(f => `- **${f.e.name}** (${f.s.types.join('/')}, BST ${f.s.bst}, ${f.p.abilities.join('/')}${f.e.estimated ? ', **estimated**' : ''}) — ${f.reasons.join('; ')}.`).join('\n')}

**Multi-hit users in PU**, because the 25-BP-per-hit rewrite changes what these
moves are worth and Skill Link forces the maximum:

${(() => {
  const MULTI = ['rockblast', 'bulletseed', 'iciclespear', 'pinmissile', 'bonerush', 'tailslap', 'armthrust',
    'furyattack', 'furyswipes', 'spikecannon', 'doublehit', 'dualchop', 'dualwingbeat', 'twineedle',
    'bonemerang', 'tripleaxel', 'populationbomb', 'scaleshot'];
  const rows = [];
  for (const id of MULTI) {
    if (!Dex.hasMove(id)) continue;
    const m = Dex.move(id);
    const users = rosters[SUBJECT_TIER].filter(e => {
      const src = e.kind === 'forme' && e.base ? Dex.toID(e.base) : e.id;
      return (Dex.legalMoveList(src) || []).some(x => Dex.toID(x) === id);
    }).map(e => e.name);
    if (users.length) rows.push(`| ${m.name} | ${m.type} | ${m.basePower} × ${JSON.stringify(m.multihit)} | ${users.join(', ')} |`);
  }
  const sl = rosters[SUBJECT_TIER].filter(e => P.abilitiesOf(e).some(a => Dex.toID(a) === 'skilllink')).map(e => e.name);
  return `| Move | Type | BP × hits | PU users |
| --- | --- | --- | --- |
${rows.join('\n') || '| _none_ | | | |'}

**Skill Link holders in PU: ${sl.join(', ') || 'none'}** — Skill Link forces the
maximum hit count and the calculator honours it.`;
})()}`);

doc.push(`---

## T. Remaining genuinely unresolved questions

1. **No usage, ladder, win-rate, tournament or popularity data exists in RedGPT.**
   There is no metagame history for any tier. Every judgement must be mechanical.
2. **Nothing in PU has been played by a human.** The ladder was rebuilt on
   2026-08-15 and has been revised on 2026-08-16 by the Ubers, UU, RU and NU passes.
3. **${estSubject.length} PU forme${estSubject.length === 1 ? '' : 's'} sit${estSubject.length === 1 ? 's' : ''} on an \`estimated\` tier** — a nearest-neighbour
   model over BST and base tier, with **no notion of movepool, ability, matchup
   structure or item opportunity cost**. Section F is the evidence the model
   cannot see.
4. **Conditional abilities are read at their unactivated value.** Guts, Quick
   Feet, Protosynthesis, Quark Drive, Unburden, Swift Swim, Schooling and the
   rest are reported unboosted, because nothing has triggered them. The Orbs fire
   **on entry**, so for a Guts or Quick Feet holder the activated number is the
   one that matters — ask and it can be measured.
   **Wishiwashi is the sharpest case in PU**: base Wishiwashi is BST 175 and
   Wishiwashi-School is BST 620, and they are separate roster entries.
5. **A species may run any of its abilities.** Offence is reported per ability,
   but the movepool sections assume the first. Where an ability decides a verdict
   — any trapping holder, any Skill Link or Regenerator user — ask for a
   per-ability profile.
6. **Trapping is verified, but its *value* is not measurable here.** Section B
   establishes exactly who can be trapped and how they escape. What that is worth
   in a real game — how often a trapper gets in safely, how much a removed wall
   costs the victim's team — has no data behind it, and the global trapping audit
   is a separate document.
7. **There is no move-half to the forme-route gate** (section R). Inert today;
   a blocker for any future move-driven forme change.
8. **The 0-2 HP rounding difference from Showdown's calculator** is known and
   documented; it never changes a tier.

**If a number you need is missing, ask for it** rather than estimating. Any
damage, speed, trapping or legality question can be answered against the real
engine.`);

const out = doc.join('\n');
if (CHECK) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur === out) { console.log('unchanged'); process.exit(0); }
  console.log('STALE — run: node tools/pu-final-evidence.js'); process.exit(1);
}
fs.writeFileSync(OUT, out);
console.log(`PU(subject) ${SUBJECT.length} | ZU(down bar) ${DOWN.length} | NU(up bar) ${UP.length} | estimated PU formes ${estSubject.length} | scan-flagged ${upFlagged.length} | matrices ${UP_CANDIDATES.length} | core ${CORE.length} | revenge ${REVENGE.length} | trappers in PU ${trapperNamesIn(SUBJECT).length}`);
console.log('wrote docs/PU_FINAL_EVIDENCE.md');
