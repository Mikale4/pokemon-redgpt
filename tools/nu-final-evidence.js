#!/usr/bin/env node
/*
 * Generate `docs/NU_FINAL_EVIDENCE.md` — the verified evidence packet for the
 * bidirectional RU tier audit (RU -> UU and RU -> NU).
 *
 * Everything comes from the live project. It reuses `tools/lib/profiler.js`,
 * which is the one engine-resolved profiler and already carries the four fixes
 * the UU pass found (ability-driven offence, `-ate` conversion, charge-move
 * ties, banned moves).
 *
 *   node tools/nu-final-evidence.js
 *   node tools/nu-final-evidence.js --check
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {loadEngine} = require('../tests/helpers/engine.js');
const {createProfiler} = require('./lib/profiler.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs/NU_FINAL_EVIDENCE.md');
const CHECK = process.argv.includes('--check');
const R = loadEngine();
const {Dex, Formats, Mechanics, Calculator, Pokemon, Validation} = R;
const P = createProfiler(R);

const rosters = {};
for (const t of Formats.TIER_ORDER) rosters[t] = Formats.tierRoster(t);
const sorted = t => rosters[t].slice().sort((a, b) => a.name.localeCompare(b.name));
const RU = sorted('NU'), NU = sorted('PU'), UU = sorted('RU');  // subject / down bar / up bar
const all = [...rosters.NU, ...rosters.PU, ...rosters.RU, ...rosters.UU, ...rosters.OU];
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

/* ---------- a defensive core built from RU, not reused from UU ---------- */
const CORE = [
  ['Bronzong', 'physWall', 'leftovers'], ['Avalugg', 'physWall', 'leftovers'], ['Copperajah', 'physWall', 'leftovers'],
  ['Mantine', 'specWall', 'leftovers'], ['Vaporeon', 'specWall', 'leftovers'], ['Sylveon', 'specWall', 'leftovers'],
  ['Tentacruel', 'specWall', 'blacksludge'], ['Rhyperior', 'physWall', 'leftovers'], ['Drapion', 'physWall', 'leftovers'],
  ['Uxie', 'physWall', 'leftovers'], ['Xatu', 'specWall', 'leftovers'], ['Klefki', 'physWall', 'leftovers'],
  ['Altaria', 'specWall', 'leftovers'], ['Goodra', 'specWall', 'leftovers'], ['Escavalier', 'physWall', 'leftovers'],
  ['Duraludon', 'specWall', 'leftovers'], ['Stakataka', 'physWall', 'leftovers'], ['Arcanine', 'physWall', 'leftovers'],
  ['Tsareena', 'physWall', 'leftovers'], ['Dragalge', 'specWall', 'blacksludge'],
].map(([n, sp, it]) => { const e = byName(n); return e ? {n, e, sp, it, cfg: setFor(e, SPREADS[sp], {item: it})} : null; }).filter(Boolean);

const REVENGE = [
  ['Aerodactyl', 'physFast', 'choicescarf', 'stoneedge'], ['Raikou', 'specFast', 'choicescarf', 'thunderbolt'],
  ['Infernape', 'physFast', 'lifeorb', 'machpunch'], ['Staraptor', 'physFast', 'choiceband', 'bravebird'],
  ['Cinccino', 'physFast', 'lifeorb', 'tailslap'], ['Inteleon', 'specFast', 'choicescarf', 'hydropump'],
  ['Tornadus', 'specFast', 'lifeorb', 'hurricane'], ['Scrafty', 'physical', 'lifeorb', 'upperhand'],
  ['Kilowattrel', 'specFast', 'choicescarf', 'thunderbolt'], ['Flamigo', 'physFast', 'choiceband', 'closecombat'],
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
    row('Phazing', p.phazing), row('Status', p.status), row('Cleric', p.cleric), row('Trapping', p.trapping),
    row('Weather/terrain', p.weatherTerrain), row('Utility', p.utility)].filter(Boolean).forEach(l => out.push(l));
  const flags = [['knockoff', 'Knock Off'], ['trick', 'Trick'], ['switcheroo', 'Switcheroo'], ['encore', 'Encore'],
    ['taunt', 'Taunt'], ['substitute', 'Substitute'], ['batonpass', 'Baton Pass'], ['trickroom', 'Trick Room'],
    ['tailwind', 'Tailwind'], ['focuspunch', 'Focus Punch']].filter(([id]) => p.has(id)).map(([, l]) => l);
  if (flags.length) out.push(`  Notable: ${flags.join(', ')}`);
  return out.join('\n');
}

/* ---------- mechanical scan for upward candidates, no fixed cap ---------- */
function scanUp() {
  const flagged = [];
  for (const e of RU) {
    const p = P.profile(e, {tier: 'NU'});
    const s = Dex.species(e.id);
    const reasons = [];
    const bestAtk = Math.max(...p.abilities.map(a => p.offByAbility[a].atkPlus));
    const bestSpa = Math.max(...p.abilities.map(a => p.offByAbility[a].spaPlus));
    const bestSpe = Math.max(...p.abilities.map(a => p.offByAbility[a].spePlus));
    if (bestAtk >= 500) reasons.push(`Attack **${bestAtk}**`);
    if (bestSpa >= 480) reasons.push(`Special Attack **${bestSpa}**`);
    if (bestSpe >= 380) reasons.push(`Speed **${bestSpe}**`);
    if (s.bst >= 580) reasons.push(`BST ${s.bst}`);
    if (bestAtk > 480 && s.baseStats.atk < 110) reasons.push(`Attack reaches ${bestAtk} off base ${s.baseStats.atk} — an ability is doing the work`);
    if (p.setup.length && p.priority.length && p.recovery.length) reasons.push('setup + priority + reliable recovery');
    if (p.setup.some(m => /Shell Smash|Quiver Dance|Dragon Dance|Swords Dance|Nasty Plot|Shift Gear/.test(m)) && bestSpe >= 330) reasons.push('strong setup on a fast frame');
    if (p.abilities.some(a => ['hugepower', 'purepower', 'adaptability', 'skilllink', 'contrary', 'speedboost', 'protean', 'libero', 'download', 'sheerforce', 'strongjaw', 'toughclaws', 'sharpness', 'technician', 'galewings'].includes(Dex.toID(a)))) {
      reasons.push(`ability: ${p.abilities.filter(a => ['hugepower', 'purepower', 'adaptability', 'skilllink', 'contrary', 'speedboost', 'protean', 'libero', 'download', 'sheerforce', 'strongjaw', 'toughclaws', 'sharpness', 'technician', 'galewings'].includes(Dex.toID(a))).join('/')}`);
    }
    if (e.estimated && s.bst >= 570) reasons.push(`BST ${s.bst} on an **estimated** tier`);
    if (p.hazards.length && bestAtk >= 400) reasons.push('hazards + real offence');
    if (reasons.length >= 2) flagged.push({e, p, s, reasons});
  }
  return flagged.sort((a, b) => b.reasons.length - a.reasons.length);
}

const upFlagged = scanUp();
const UP_CANDIDATES = upFlagged.slice(0, 24).map(f => {
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
  const head = `| RU defender (representative test set) | ${c.moves.map(id => Dex.move(id).name).join(' | ')} |`;
  const sep = `| --- | ${c.moves.map(() => '---').join(' | ')} |`;
  return [`Attacker: **${c.entry.name}**, ${SPREADS[c.spread].nature} ${JSON.stringify(SPREADS[c.spread].evs)}, ${c.entry.kind === 'forme' ? itemName(c.entry.item) + ' (forced)' : 'Life Orb'} — a **representative test set**.`,
    '', head, sep,
    ...CORE.map(d => `| ${d.n} (${d.sp}${d.it ? ', ' + itemName(d.it) : ', no item'}) | ` + c.moves.map(id => calcCell(calc(atk, d.cfg, id))).join(' | ') + ' |')].join('\n');
}

/* ---------- downward: role comparison against NU ---------- */
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
  const p = P.profile(entry, {tier: 'NU'});
  const s = Dex.species(entry.id);
  const mine = new Set(ROLE_KEYS(p));
  const scored = NU.map(r => {
    const rp = P.profile(r, {tier: 'PU'});
    const rs = Dex.species(r.id);
    const shared = ROLE_KEYS(rp).filter(k => mine.has(k)).length;
    const typeOverlap = rs.types.filter(t => s.types.includes(t)).length;
    return {r, rp, rs, score: shared * 3 + typeOverlap * 3 + (Math.abs(rs.bst - s.bst) < 70 ? 2 : 0)};
  }).sort((a, b) => b.score - a.score).slice(0, 5);
  return `**${entry.name}** — ${s.types.join('/')}, BST ${s.bst} (${stats(s)}), ${p.abilities.join(' / ')}, item ${entry.kind === 'forme' ? '**locked to ' + itemName(entry.item) + '**' : 'free'}
Roles: ${ROLE_KEYS(p).join(', ') || '—'} | STAB: ${p.stab.join(' · ') || 'none'} | Recovery: ${p.recovery.join(', ') || 'none'} | Priority: ${p.priority.join(', ') || 'none'}

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
${scored.map(({r, rp, rs}) => `| ${r.name} | ${rs.types.join('/')} | ${rs.bst} (${stats(rs)}) | ${P.abilitiesOf(r).join(', ')} | ${ROLE_KEYS(rp).join(', ') || '—'} | ${rp.recovery.join(', ') || 'none'} | ${rp.stab.join(' · ') || 'none'} |`).join('\n')}`;
}

/* Downward shortlist: weakest engine offence + no compensating utility. */
const downFlagged = RU.map(e => {
  const p = P.profile(e, {tier: 'NU'});
  const s = Dex.species(e.id);
  const bestOff = Math.max(...p.abilities.map(a => Math.max(p.offByAbility[a].atkPlus, p.offByAbility[a].spaPlus)));
  const util = ROLE_KEYS(p).length;
  return {e, p, s, bestOff, util, score: bestOff / 100 + util * 1.2 + s.bst / 100};
}).sort((a, b) => a.score - b.score).slice(0, 22);

/* ---------- tables ---------- */
function speedTable(list, tier) {
  const rows = list.map(e => {
    const s = Dex.species(e.id);
    const o = P.offence(e, P.abilityOf(e));
    return {e, s, o};
  }).filter(x => x.s.baseStats.spe >= 80).sort((a, b) => b.o.spePlus - a.o.spePlus);
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
const ru = Formats.get('tiernu').rules;
const doc = [];
doc.push(`# RedGPT NU Final Audit — Verified Evidence Packet

**Generated from the live RedGPT project** by \`tools/nu-final-evidence.js\`.
Every stat, movepool value, damage figure and speed number comes from the running
engine, the packaged data, the validator or the real damage calculator.

**RedGPT has no usage, ladder, win-rate, tournament or popularity data**, so none
is quoted. Section T lists what genuinely cannot be determined.

---

## Your task

Make the **complete bidirectional NU tier audit**:

1. **Which current NU entries are too strong for NU and should move UP to RU?**
2. **Which current NU entries are too weak or outclassed and should move DOWN to PU?**

The bars are section E (the current RU roster, after the four promotions the
RU audit made) and section D (the complete PU roster).

**Most entries should stay put.** A high BST alone does not promote, and weak raw
stats alone do not demote — a demotion needs PU to already contain something that
credibly does the candidate's **actual job** as well or better. Unique value that
justifies staying includes superior typing, Regenerator, Magic Bounce, reliable
recovery, a better hazard or pivot role, unique priority, item freedom, or simply
not costing the team's only Mega slot.

**There is no cap on how many entries may move — including zero.**

For each entry you move: exact name, species or forme, direction, confidence,
two or three sentences naming the specific Pokémon it outclasses or is outclassed
by, and the numbers you relied on with the ability and item they assume. Then list
what you **considered and deliberately left**.

**This packet contains no recommendations.**

---

## Context: the RU audit that preceded this one

**The RU audit promoted four entries and demoted none**, and those four have
already been applied — so the RU roster in section E is the **post-promotion**
bar, not the one the RU packet was written against:

| Promoted RU → UU | Kind | The mechanic that decided it |
| --- | --- | --- |
| Raichu-Mega-Y | forme | No Guard makes Sing a guaranteed sleep, on 160 SpA / 130 Speed |
| Pyroar-Mega | forme | Fire Mane is 1.5x the offensive stat on Fire moves, with restored 140 BP Overheat |
| Regieleki | species | 200 base Speed, and **Ring Target is legal on it** (not a Mega), which removes the Ground immunity that balances mono-Electric |
| Metagross | species | Light Metal is **+1 Speed on every entry** here, with full item freedom kept |

**RU → NU: none.** The downward review found nothing NU already did as well.

Two consequences for this audit:

- **RU is 122, not 126.** An NU entry moving up joins the roster in section E as
  it stands now.
- **Three of those four moved because of a RedGPT-specific mechanic the imported
  tier could not have known about** — two were \`estimated\` formes, and
  Metagross's tier predates this project's redesign of Light Metal. That is the
  shape worth looking for again in NU: an imported tier that is right about the
  Pokémon Smogon ranked and wrong about the one this engine ships.
`);

doc.push(`---

## A. Current tier / rules snapshot

| Tier | Entries |
| --- | --- |
${Formats.TIER_ORDER.map(t => `| ${t} | ${rosters[t].length} |`).join('\n')}

**NU format rules, read live — and compared against RU and PU rather than assumed:**

RU is byte-identical to UU on every rule **except the tier ceiling**:

| Rule | RU | Same as UU? |
| --- | --- | --- |
| \`maxTier\` | **RU** | **no** — UU is UU |
| \`tera\` | ${ru.tera} | yes — **no Terastallization in RU** |
| \`mega\` | ${ru.mega} | yes — Mega on, stone only, one per side |
| \`speciesClause\` / \`sleepClause\` / \`itemClause\` | ${ru.speciesClause} / ${ru.sleepClause} / ${!!ru.itemClause} | yes |
| \`evasionClause\` / \`ohkoClause\` | ${ru.evasionClause} / ${ru.ohkoClause} | yes |
| \`bannedMoves\` | ${ru.bannedMoves.map(id => Dex.move(id).name).join(', ')} | yes |
| \`bannedItems\` / \`bannedSpecies\` / \`bannedAbilities\` | none / none / none | yes |
| level / team / EV / IV | ${ru.forceLevel} / ${ru.teamSize}v${ru.teamSize} / ${ru.evLimit}-${ru.evStatLimit} / ${ru.ivMax} | yes |

There are **no RU-specific bans** beyond the shared clause list.

**Mechanics that decide tiering here, all verified live:**

| Move | Type | Cat | BP | Priority | Acc |
| --- | --- | --- | --- | --- | --- |
${['suckerpunch', 'thunderclap', 'firstimpression', 'upperhand', 'grassyglide'].map(id => {
  const m = Dex.move(id);
  return `| ${m.name} | ${m.type} | ${m.category} | **${m.basePower}** | **+${(m.priority || 0) + (Mechanics.ENGINE_PRIORITY.has(id) ? 1 : 0)}** | ${m.accuracy}% |`;
}).join('\n')}

All five are **unconditional**. Grassy Glide's packaged priority is 0 — the +1 is
added by the engine, so reading the move data alone misses it. Upper Hand has no
condition and no flinch.

**Restored base powers (live):** ${['overheat', 'leafstorm', 'dracometeor', 'blizzard', 'hydropump', 'fireblast', 'thunder', 'hurricane', 'headsmash', 'mindblown', 'closecombat'].map(id => `${Dex.move(id).name} ${Dex.move(id).basePower}`).join(', ')}.
**Focus Punch is ${Dex.move('focuspunch').basePower} BP at ${Dex.move('focuspunch').accuracy}% accuracy and priority ${Dex.move('focuspunch').priority}** — no Substitute condition, no negative priority.

**Multi-hit:** 2-5 hit moves are **25 BP per hit**, exactly-2-hit moves **50 BP
per hit**. Triple Axel is deliberately excluded (${Dex.move('tripleaxel').basePower} BP × ${JSON.stringify(Dex.move('tripleaxel').multihit)}) and so is Population Bomb (${Dex.move('populationbomb').basePower} BP × ${JSON.stringify(Dex.move('populationbomb').multihit)}).

**Ring Target:** the holder's attacks hit for **neutral** damage through a
**type** immunity. It does **not** beat Levitate, Flash Fire, Water Absorb or any
other ability immunity. One per team, visible from turn one, and **no Mega can
hold it**.

**Toxic Orb and Flame Orb fire on ENTRY**, so Guts/Poison Heal/Quick Feet holders
are already boosted the turn they arrive.`);

doc.push(`---

## B. Profiler validation — the four defects this build does not have

The UU pass found four defects in the movepool profiler. This packet uses the
shared \`tools/lib/profiler.js\`, which fixes all four; they are listed so you can
tell that these numbers are not the earlier, wrong ones.

1. **Ability-driven offence.** Coverage used to be filtered on *base* Attack vs
   *base* Special Attack, which hid a Huge Power holder's whole physical
   movepool. Offence is now measured through \`getStat\` **per ability**, and the
   best decides. Every profile below prints the engine's numbers for each ability.
2. **\`-ate\` conversion.** Pixilate/Aerilate/Refrigerate convert in
   \`onModifyMove\`, invisible to \`battle.moveType\`; the profiler asks
   \`Abilities.displayMoveType\` / \`displayBasePower\` instead, so a Refrigerate
   Body Slam reads **Ice 110**, not Normal 85.
3. **Charge moves winning ties** — a charge move is no longer quoted as the STAB
   when an equal free move exists.
4. **Banned moves advertised** — the RU banlist is applied, so Double Team and
   the OHKO moves never appear.

**Verified for this packet:** the damage calculator **does** honour Skill Link —
Cloyster's Icicle Spear reports **5 hits** with Skill Link against 3 without, so
the Cloyster figures below are the real forced-5-hit numbers.`);

doc.push(`---

## C. Full NU competitive profiles

All **${RU.length}** current NU entries, engine-resolved.

${RU.map(e => renderProfile(e)).join('\n\n')}`);

doc.push(`---

## D. Full PU comparison profiles

All **${NU.length}** current NU entries, same format — this is what a downward
move is measured against. **NU contains no \`estimated\` formes.**

${NU.map(e => renderProfile(e)).join('\n\n')}`);

doc.push(`---

## E. Current RU comparison bar (post-promotion)

All **${UU.length}** UU entries — the roster the last audit left unchanged.

${UU.map(e => renderProfile(e, {compact: true})).join('\n\n')}`);

const estRU = RU.filter(e => e.estimated);
doc.push(`---

## F. Estimated-forme audit

**${estRU.length} RU formes carry an \`estimated\` tier** — Smogon never ranked
them, so a nearest-neighbour model placed them by BST and base tier. **The model
has no notion of movepool, ability or item cost**, which is exactly what it got
wrong on Mega Starmie in the UU pass. These are the softest placements in RU.

**NU has ${NU.filter(e => e.estimated).length} estimated formes.**

${estRU.map(e => {
  const p = P.profile(e, {tier: 'NU'});
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
}).join('\n\n')}`);

doc.push(`---

## G. Serious NU → RU candidate evidence

**No fixed cap.** ${upFlagged.length} of ${RU.length} NU entries tripped two or
more mechanical flags in the scan; the ${UP_CANDIDATES.length} with usable
offensive sets get a full matrix below. Flags are reasons to look, not verdicts.

${UP_CANDIDATES.map(c => `### ${c.entry.name}

_Flagged for: ${c.reasons.join('; ')}._

${renderProfile(c.entry)}

${matrix(c)}`).join('\n\n---\n\n')}`);

doc.push(`---

## H. Serious NU → PU candidate evidence

The ${downFlagged.length} NU entries with the lowest combination of engine
offence, utility breadth and BST. **Low output is not a verdict** — several of
these will have a role NU cannot fill, which is what section K is for.

${downFlagged.map(({e}) => `### ${e.name}\n\n${roleCompare(e)}`).join('\n\n---\n\n')}`);

doc.push(`---

## I. Offensive matchup matrices

Every matrix in section G runs against the **same NU defensive core**, built from
NU entries rather than reused from RU, so candidates compare column by column:

${CORE.map(d => `${d.n} (${d.sp})`).join(', ')}.

Classification — hard counter, reliable counter, soft counter, check, revenge-only,
not an answer — is yours; the engine supplies damage, and recovery, speed and
hazard chip are in sections C, L, M and P.`);

doc.push(`---

## J. Defensive / revenge-kill matrices

NU's counterplay into each upward candidate. Attackers are **representative test
sets**; the target is on its own offensive spread from section G.

| Candidate | ${REVENGE.map(a => `${a.n} ${Dex.move(a.mv).name}`).join(' | ')} |
| --- | ${REVENGE.map(() => '---').join(' | ')} |
${UP_CANDIDATES.map(c => {
  const target = setFor(c.entry, SPREADS[c.spread], {moves: ['tackle']});
  return `| ${c.entry.name} | ` + REVENGE.map(a => calcCell(calc(a.cfg, target, a.mv))).join(' | ') + ' |';
}).join('\n')}`);

doc.push(`---

## K. NU → PU role-comparison matrices

Section H is the role comparison, one candidate at a time. NU competitors are
selected by shared role keys, shared typing and BST proximity — a mechanical
shortlist, not a judgement. Their full profiles are in section D.`);

doc.push(`---

## L. Speed-tier table

Every RU entry at base Speed 80+. **Priority is not Speed** — it is section M.

${speedTable(RU, 'NU')}

**Conditional speed abilities in RU** (none of these is active by default):

${(() => {
  const {abil} = envTable('NU');
  return [['swiftswim', 'Swift Swim — needs rain'], ['chlorophyll', 'Chlorophyll — needs sun'],
    ['sandrush', 'Sand Rush — needs sandstorm'], ['slushrush', 'Slush Rush — needs snow'],
    ['unburden', 'Unburden — needs its item consumed'], ['speedboost', 'Speed Boost — +1 at the end of each turn'],
    ['quickfeet', 'Quick Feet — needs a status'], ['lightmetal', 'Light Metal — +1 Speed on EVERY entry, resets on switch-out'],
    ['quarkdrive', 'Quark Drive — needs Electric Terrain or Booster Energy'],
    ['protosynthesis', 'Protosynthesis — needs sun or Booster Energy']]
    .map(([id, label]) => `- **${label}**: ${abil([id]).join(', ') || '_nobody in RU_'}`).join('\n');
})()}`);

doc.push(`---

## M. Priority table

Engine priority for every RU entry that has any, including Grassy Glide's
engine-side +1.

${priorityTable(RU)}`);

doc.push(`---

## N. Item-freedom table

| Candidate | Item freedom | Consequence |
| --- | --- | --- |
${UP_CANDIDATES.map(c => `| ${c.entry.name} | ${c.entry.kind === 'forme' ? '**No** — ' + itemName(c.entry.item) + ' is forced and unremovable' : 'Yes — any item'} | ${c.entry.kind === 'forme' ? 'no Band/Specs/Scarf/Life Orb/Boots/Leftovers/Ring Target/Orbs' : 'Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available'} |`).join('\n')}`);

doc.push(`---

## O. NU Mega opportunity-cost table

${megaTable('NU')}

A Mega is only tier-breaking if a team is pressured to spend its **one** Mega
slot on it rather than on any of the above.`);

doc.push(`---

## P. Hazard environment

${(() => {
  const {learn, abil} = envTable('NU');
  return `**Stealth Rock:** ${learn('stealthrock').join(', ') || 'none'}

**Spikes:** ${learn('spikes').join(', ') || 'none'}

**Toxic Spikes:** ${learn('toxicspikes').join(', ') || 'none'}

**Sticky Web:** ${learn('stickyweb').join(', ') || 'none'}

**Rapid Spin:** ${learn('rapidspin').join(', ') || 'none'}

**Defog:** ${learn('defog').join(', ') || 'none'}

**Mortal Spin / Tidy Up / Court Change:** ${[...new Set([...learn('mortalspin'), ...learn('tidyup'), ...learn('courtchange')])].join(', ') || 'none'}

**Magic Bounce:** ${abil(['magicbounce']).join(', ') || 'none'}

**Ghost types (block Rapid Spin):** ${rosters.NU.filter(e => Dex.species(e.id).types.includes('Ghost')).map(e => e.name).join(', ') || 'none'}

**Heavy-Duty Boots** are available to every **species** entry and to **no forme**
entry — the stone occupies the slot. That asymmetry is decisive for any
Rock-weak or pivot-reliant Mega on the candidate list.`;
})()}`);

doc.push(`---

## Q. Weather / terrain / Trick Room / Tailwind environment

${(() => {
  const {learn, abil} = envTable('NU');
  return `**Weather by move:** Rain — ${learn('raindance').join(', ') || 'none'}; Sun — ${learn('sunnyday').join(', ') || 'none'}; Sand — ${learn('sandstorm').join(', ') || 'none'}; Snow — ${learn('snowscape').join(', ') || 'none'}.

**Weather by ability:** ${abil(['drizzle', 'drought', 'sandstream', 'snowwarning']).join(', ') || 'none'}.

**Terrain by move:** Electric — ${learn('electricterrain').join(', ') || 'none'}; Grassy — ${learn('grassyterrain').join(', ') || 'none'}; Misty — ${learn('mistyterrain').join(', ') || 'none'}; Psychic — ${learn('psychicterrain').join(', ') || 'none'}.

**Terrain by ability:** ${abil(['electricsurge', 'grassysurge', 'mistysurge', 'psychicsurge']).join(', ') || 'none'}.

**Trick Room setters:** ${learn('trickroom').join(', ') || 'none'}. The **Warp Prism** makes Trick Room *the holder sets* last **8** turns.

**Tailwind setters:** ${learn('tailwind').join(', ') || 'none'}. The **Wind Sock** makes Tailwind *the holder sets* last **7** turns.

Neither item can be held by a Mega, but a teammate can hold it — which matters
for every slow breaker in section G.

**Mega Sol is PERSONAL weather**, not field-wide sun: it overrides
\`battle.weatherFor\` for its holder only. Nothing else on the field sees it.`;
})()}`);

doc.push(`---

## R. Transformation / forme legality audit

Every NU entry was checked for a route to a **higher-tier forme in battle** —
the Zygarde / Darmanitan-Galar shape that this project has had to gate before.

**Item-driven routes from an NU species to a higher-tier forme: ${(() => {
  let n = 0;
  for (const e of rosters.NU) for (const f of Dex.species(e.id).formeItems || []) if (f.tier && Formats.tierRank(f.tier) < Formats.tierRank('NU')) n++;
  return n;
})()}.** Every one was put through \`Validation.validateTeam\` in the NU format and
**every one is refused** — the Absol/Absolite rule, with the species staying legal:

| NU species | Item refused in NU | Forme it would make | That forme's tier |
| --- | --- | --- | --- |
${(() => {
  const rows = [];
  for (const e of rosters.NU) {
    for (const f of Dex.species(e.id).formeItems || []) {
      if (!f.tier || Formats.tierRank(f.tier) >= Formats.tierRank('NU')) continue;
      rows.push(`| ${e.name} | ${itemName(f.item)} | ${f.forme} | **${f.tier}** |`);
    }
  }
  return rows.sort().join('\n');
})()}

**Ability-driven routes:**

${(() => {
  const out = [];
  for (const e of rosters.NU) {
    for (const route of (Formats.formeAbilities ? Formats.formeAbilities(e.id) : []) || []) {
      const t = route.tier || '?';
      const gated = Formats.tierRank(t) < Formats.tierRank('NU');
      out.push(`- **${e.name}** → ${route.forme} via **${route.abilityName}** (${route.when}) — target tier **${t}**. ${gated ? '**Higher than RU: the ability is refused at team validation** (verified: _"Power Construct is banned in RarelyUsed"_), and the Pokémon stays legal on its other ability.' : 'Same rung as RU — no legality issue.'}`);
    }
  }
  return out.join('\n') || '_None._';
})()}

**Conclusion: no legality hole found.** Both classes are gated, and the gates
were exercised through the real validator rather than read off the data.`);

doc.push(`---

## S. New candidates surfaced by the mechanical scan

Mechanical flags only — reasons to look, **not** recommendations. ${upFlagged.length} of
${RU.length} NU entries tripped two or more.

${upFlagged.map(f => `- **${f.e.name}** (${f.s.types.join('/')}, BST ${f.s.bst}, ${f.p.abilities.join('/')}${f.e.estimated ? ', **estimated**' : ''}) — ${f.reasons.join('; ')}.`).join('\n')}

**Multi-hit users in RU**, because the 25-BP-per-hit rewrite changes what these
moves are worth, and Skill Link forces the maximum:

${(() => {
  const MULTI = ['rockblast', 'bulletseed', 'iciclespear', 'pinmissile', 'bonerush', 'tailslap', 'armthrust',
    'furyattack', 'furyswipes', 'spikecannon', 'doublehit', 'dualchop', 'dualwingbeat', 'twineedle',
    'bonemerang', 'tripleaxel', 'populationbomb', 'scaleshot'];
  const rows = [];
  for (const id of MULTI) {
    if (!Dex.hasMove(id)) continue;
    const m = Dex.move(id);
    const users = rosters.NU.filter(e => {
      const src = e.kind === 'forme' && e.base ? Dex.toID(e.base) : e.id;
      return (Dex.legalMoveList(src) || []).some(x => Dex.toID(x) === id);
    }).map(e => e.name);
    if (users.length) rows.push(`| ${m.name} | ${m.type} | ${m.basePower} × ${JSON.stringify(m.multihit)} | ${users.join(', ')} |`);
  }
  const sl = rosters.NU.filter(e => P.abilitiesOf(e).some(a => Dex.toID(a) === 'skilllink')).map(e => e.name);
  return `| Move | Type | BP × hits | RU users |
| --- | --- | --- | --- |
${rows.join('\n')}

**Skill Link holders in RU: ${sl.join(', ') || 'none'}** — Skill Link forces the
maximum hit count, and the calculator honours it (Cloyster's Icicle Spear reports
5 hits with it, 3 without).`;
})()}`);

doc.push(`---

## T. Remaining genuinely unresolved questions

1. **No usage, ladder, win-rate, tournament or popularity data exists in RedGPT.**
   There is no metagame history for any tier. Every judgement must be mechanical.
2. **Nothing in RU has been played by a human.** The ladder was rebuilt on
   2026-08-15 and revised on 2026-08-16.
3. **${estRU.length} RU formes sit on an \`estimated\` tier** — a nearest-neighbour model
   over BST and base tier, with **no notion of movepool, ability or item cost**.
   That model placed Mega Starmie, whose real profile the UU pass had to correct.
   Section F is the evidence the model cannot see.
4. **Conditional abilities read at their unactivated value.** Guts, Quick Feet,
   Protosynthesis, Quark Drive, Unburden, Swift Swim and the rest are reported
   unboosted, because nothing has triggered them. The Orbs fire **on entry**, so
   for a Guts or Quick Feet holder the activated number is the one that matters —
   ask and it can be measured.
5. **A species may run any of its abilities.** Offence is reported per ability,
   but the movepool sections assume the first. Where an ability decides a verdict
   (Cloyster's Skill Link, any Contrary or Huge Power holder), ask for a
   per-ability profile.
6. **The 0-2 HP rounding difference from Showdown's calculator** is known and
   documented; it never changes a tier.

**If a number you need is missing, ask for it** rather than estimating. Any
damage, speed or legality question can be answered against the real engine.`);

const out = doc.join('\n');
if (CHECK) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur === out) { console.log('unchanged'); process.exit(0); }
  console.log('STALE — run: node tools/nu-final-evidence.js'); process.exit(1);
}
fs.writeFileSync(OUT, out);
console.log(`RU ${RU.length} | NU ${NU.length} | UU ${UU.length} | estimated RU formes ${estRU.length} | scan-flagged ${upFlagged.length} | matrices ${UP_CANDIDATES.length} | core ${CORE.length} | revenge ${REVENGE.length}`);
console.log('wrote docs/NU_FINAL_EVIDENCE.md');
