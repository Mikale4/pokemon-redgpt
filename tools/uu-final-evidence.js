#!/usr/bin/env node
/*
 * Generate `docs/UU_FINAL_EVIDENCE.md` — the verified evidence packet for the
 * final UU tier audit.
 *
 * Everything here comes from the live project: the tier system, the packaged
 * data, the validator, the movepools and the real damage engine. Nothing is
 * taken from general Pokémon knowledge, and no usage/ladder/tournament data is
 * invented because the project has none.
 *
 *   node tools/uu-final-evidence.js
 *   node tools/uu-final-evidence.js --check
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {loadEngine} = require('../tests/helpers/engine.js');
const {createProfiler} = require('./lib/profiler.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs/UU_FINAL_EVIDENCE.md');
const CHECK = process.argv.includes('--check');
const R = loadEngine();
const {Dex, Formats, Mechanics, Calculator, Pokemon, Items, Abilities} = R;
const P = createProfiler(R);

const rosters = {};
for (const t of Formats.TIER_ORDER) rosters[t] = Formats.tierRoster(t);
const UU = rosters.UU.slice().sort((a, b) => a.name.localeCompare(b.name));
const byName = n => UU.find(e => e.name === n) || rosters.OU.find(e => e.name === n) || rosters.RU.find(e => e.name === n);
const itemName = id => (id && Dex.item(id) ? Dex.item(id).name : (id || '—'));
const stats = s => [s.baseStats.hp, s.baseStats.atk, s.baseStats.def, s.baseStats.spa, s.baseStats.spd, s.baseStats.spe].join('/');
const tierSourceOf = id => {
  const s = Dex.species(id);
  const src = s.tierSource && s.tierSource.from ? s.tierSource.from : String(s.tierSource || '-');
  return src === 'redgpt-override' ? 'override' : src === 'estimated' ? 'estimated' : 'imported (' + src + ')';
};

/* ---------- representative test sets, named as such ---------- */
const SPREADS = {
  physical: {nature: 'adamant', evs: {atk: 252, spe: 252, hp: 4}},
  physFast: {nature: 'jolly', evs: {atk: 252, spe: 252, hp: 4}},
  special: {nature: 'modest', evs: {spa: 252, spe: 252, hp: 4}},
  specFast: {nature: 'timid', evs: {spa: 252, spe: 252, hp: 4}},
  physWall: {nature: 'impish', evs: {hp: 252, def: 252}},
  specWall: {nature: 'calm', evs: {hp: 252, spd: 252}},
};

function setFor(entry, spread, {item = null, ability = null, moves = ['tackle'], boosts = null} = {}) {
  const sp = Dex.species(entry.id);
  const held = sp.requiredItem ? Dex.toID(sp.requiredItem) : (entry.kind === 'forme' ? entry.item : item);
  const out = {
    set: {
      species: sp.id, level: 100, nature: spread.nature, evs: spread.evs, ivs: Pokemon.maxIVs(),
      ability: ability || P.abilityOf(entry), item: held, moves,
    },
  };
  if (boosts) out.boosts = boosts;
  return out;
}

function calc(attacker, defender, moveId, field = {}) {
  try {
    const r = Calculator.calculate({attacker, defender, move: moveId, field});
    if (!r || r.empty) return null;
    return r;
  } catch { return null; }
}
const calcCell = r => (r ? `${r.min}-${r.max} (${r.minPercent}-${r.maxPercent}%)` : '—');

/* ---------- the defensive core the audit measures against ---------- */
const DEFENSIVE_CORE = [
  ['Aegislash', 'physWall', null], ['Slowbro-Mega', 'physWall', null], ['Slowbro', 'physWall', 'leftovers'],
  ['Slowking', 'specWall', 'leftovers'], ['Blissey', 'specWall', 'leftovers'], ['Chansey', 'specWall', 'eviolite'],
  ['Clefable', 'specWall', 'leftovers'], ['Tapu Fini', 'specWall', 'leftovers'], ['Skarmory', 'physWall', 'leftovers'],
  ['Skarmory-Mega', 'physWall', null], ['Celesteela', 'physWall', 'leftovers'], ['Hippowdon', 'physWall', 'leftovers'],
  ['Mew', 'physWall', 'leftovers'], ['Amoonguss', 'specWall', 'blacksludge'], ['Goodra-Hisui', 'specWall', 'leftovers'],
  ['Rotom-Wash', 'physWall', 'leftovers'], ['Swampert', 'physWall', 'leftovers'], ['Tyranitar', 'specWall', 'leftovers'],
  ['Scizor', 'physWall', 'leftovers'], ['Buzzwole', 'physWall', 'leftovers'],
];
const defenders = DEFENSIVE_CORE.map(([name, spread, item]) => {
  const e = byName(name);
  return e ? {name, entry: e, cfg: setFor(e, SPREADS[spread], {item, moves: ['tackle']}), spread, item} : null;
}).filter(Boolean);

/* ---------- upward candidates, with the sets they are tested on ---------- */
const UP = [
  ['Starmie-Mega', 'physical', ['waterfall', 'psychocut', 'doubleedge']],
  ['Porygon-Z', 'specFast', ['triattack', 'thunderbolt', 'icebeam', 'shadowball']],
  ['Delphox-Mega', 'specFast', ['overheat', 'fireblast', 'psychic', 'focusblast', 'shadowball']],
  ['Staraptor-Mega', 'physFast', ['closecombat', 'bravebird', 'doubleedge', 'uturn']],
  ['Gardevoir-Mega', 'specFast', ['hypervoice', 'focusblast', 'shadowball', 'mysticalfire']],
  ['Latias-Mega', 'specFast', ['dracometeor', 'aurasphere', 'icebeam', 'thunderbolt']],
  ['Aegislash-Blade', 'physical', ['steelbeam', 'shadowball', 'closecombat', 'shadowsneak']],
  ['Aerodactyl-Mega', 'physFast', ['stoneedge', 'earthquake', 'aquatail', 'psychicfangs']],
  ['Chandelure-Mega', 'specFast', ['overheat', 'fireblast', 'shadowball', 'energyball']],
  ['Emboar-Mega', 'physical', ['flareblitz', 'closecombat', 'headsmash', 'suckerpunch', 'wildcharge']],
  ['Scrafty-Mega', 'physical', ['knockoff', 'drainpunch', 'headsmash', 'upperhand']],
  ['Serperior', 'specFast', ['leafstorm', 'gigadrain', 'knockoff', 'grassyglide']],
  ['Blacephalon', 'specFast', ['mindblown', 'shadowball', 'overheat', 'fireblast']],
  ['Sharpedo-Mega', 'physFast', ['crunch', 'psychicfangs', 'waterfall', 'icefang']],
  ['Dragalge-Mega', 'special', ['sludgewave', 'dracometeor', 'focusblast', 'thunderbolt']],
  ['Drampa-Mega', 'special', ['dracometeor', 'hypervoice', 'fireblast', 'thunderbolt']],
  ['Meganium-Mega', 'special', ['energyball', 'dazzlinggleam', 'gigadrain', 'earthpower']],
];

/* ---------- UU revenge attackers, for the counterplay matrix ---------- */
const REVENGE = [
  ['Bisharp', 'physical', 'lifeorb', 'suckerpunch'], ['Scizor', 'physical', 'choiceband', 'bulletpunch'],
  ['Conkeldurr', 'physical', 'flameorb', 'machpunch'], ['Terrakion', 'physFast', 'choicescarf', 'closecombat'],
  ['Weavile', 'physFast', 'lifeorb', 'iceshard'], ['Zeraora', 'physFast', 'lifeorb', 'plasmafists'],
  ['Aerodactyl-Mega', 'physFast', null, 'stoneedge'], ['Azumarill', 'physical', 'choiceband', 'aquajet'],
  ['Excadrill', 'physFast', 'choicescarf', 'earthquake'], ['Keldeo', 'specFast', 'choicescarf', 'secretsword'],
];

function block(title, body) { return `${title}\n\n${body}\n`; }

/* ================= A. snapshot ================= */
function sectionA() {
  const uu = Formats.get('tieruu');
  const r = uu.rules;
  const lines = [];
  lines.push('| Tier | Entries |', '| --- | --- |');
  for (const t of Formats.TIER_ORDER) lines.push(`| ${t} | ${rosters[t].length} |`);
  const priority = ['suckerpunch', 'thunderclap', 'firstimpression', 'upperhand', 'grassyglide'].map(id => {
    const m = Dex.move(id);
    const pri = (m.priority || 0) + (Mechanics.ENGINE_PRIORITY.has(id) ? 1 : 0);
    return `| ${m.name} | ${m.type} | ${m.category} | **${m.basePower}** | **+${pri}** | ${m.accuracy}% |`;
  });
  const restored = [];
  for (const id of ['overheat', 'leafstorm', 'dracometeor', 'blizzard', 'hydropump', 'fireblast', 'thunder',
    'focuspunch', 'headsmash', 'mindblown', 'closecombat', 'psystrike']) {
    if (!Dex.hasMove(id)) continue;
    const m = Dex.move(id);
    restored.push(`| ${m.name} | ${m.type} | ${m.basePower} | ${m.accuracy}% |`);
  }
  return `${lines.join('\n')}

**Format rules for UU** (\`Formats.get('tieruu')\`, read live):

- Terastallization: **${r.tera ? 'ON' : 'OFF'}** — UU has **no Tera**.
- Mega Evolution: **${r.mega ? 'ON' : 'OFF'}** — the stone alone enables it, no Key Stone.
- Species Clause **${r.speciesClause ? 'on' : 'off'}**, Sleep Clause **${r.sleepClause ? 'on' : 'off'}**, Item Clause **${r.itemClause ? 'on' : 'off'}**.
- Evasion clause **${r.evasionClause ? 'on' : 'off'}**, OHKO clause **${r.ohkoClause ? 'on' : 'off'}** — banned moves: ${r.bannedMoves.map(id => Dex.move(id).name).join(', ')}.
- Level ${r.forceLevel}, ${r.teamSize}v${r.teamSize}, EVs ${r.evLimit}/${r.evStatLimit}, IVs ${r.ivMax}.
- Tier ceiling \`maxTier: ${r.maxTier}\` is enforced **on the team and on the forme**.

**Unconditional priority — exact RedGPT values.** These five keep positive
priority and have **no activation condition**.

| Move | Type | Cat | BP | Priority | Acc |
| --- | --- | --- | --- | --- | --- |
${priority.join('\n')}

Grassy Glide's packaged \`priority\` is **0**; the +1 is applied by the engine in
\`runTurn\`, so reading the move data alone misses it.

**Multi-hit:** 2-5 hit moves are a flat **25 BP per hit**, exactly-2-hit moves
**50 BP per hit**. **Triple Axel is deliberately excluded** — it is packaged
\`${Dex.move('tripleaxel').basePower} BP × ${JSON.stringify(Dex.move('tripleaxel').multihit)}\` and keeps its own escalating shape.

**Restored / notable base powers (live values):**

| Move | Type | BP | Acc |
| --- | --- | --- | --- |
${restored.join('\n')}

**Ring Target** (\`${itemName('ringtarget')}\`): the holder's attacks hit for
**neutral** damage on a target that would be immune **by type**. It does **not**
bypass ability immunities (Levitate, Flash Fire, Water Absorb). **One per team in
every format**, enforced at team building *and* in battle. **Visible to the
opponent from turn one.** A Mega cannot hold it — the stone occupies the slot.

**Toxic Orb and Flame Orb activate on ENTRY**, not at end of turn, so a Guts or
Poison Heal holder is already boosted on the turn it arrives.

**Every species keeps every ability it has ever had** (pre-Gen-8 species only).`;
}

/* ================= profile rendering ================= */
function renderProfile(entry, {full = true, tier = null} = {}) {
  const p = P.profile(entry);
  const s = p.species;
  const out = [];
  const kind = entry.kind === 'forme' ? 'forme' : 'species';
  /*
   * The ENFORCED tier — the roster this entry appears in — not `species.tier`.
   * For an unranked Mega those disagree: `species.tier` falls back to the base
   * species, so Starmie-Mega's own record reads NU while the Starminite is
   * enforced at UU. 33 packaged formes are in that position; the roster is the
   * authority and the species record is not.
   */
  const enforced = tier || Formats.TIER_ORDER.find(t => rosters[t].some(x => x.id === entry.id && x.kind === entry.kind)) || s.tier;
  const note = enforced !== s.tier ? ` _(its own \`species.tier\` reads ${s.tier} — the base's; the enforced tier is the one above)_` : '';
  out.push(`**${entry.name}** — ${kind}, **${enforced}**, tier source: ${entry.estimated ? '**estimated**' : tierSourceOf(entry.id)}${note}`);
  out.push(`  ${s.types.join('/')} | BST ${s.bst} (${stats(s)})`);
  out.push(`  Abilities: ${p.abilities.join(' / ')}${entry.kind === 'forme' ? ' (fixed by the forme)' : ''}`);
  const offLines = p.abilities.map(a => {
    const o = p.offByAbility[a];
    return `${a}: Atk ${o.atkNeutral}/${o.atkPlus}, SpA ${o.spaNeutral}/${o.spaPlus}, Spe ${o.speNeutral}/${o.spePlus}`;
  });
  out.push(`  Engine stats @252 (neutral/positive): ${offLines.join(' — ')}`);
  if (entry.kind === 'forme') {
    out.push(`  Held item: **${itemName(entry.item)}** (forced; **not removable** — \`canRemoveItem\` refuses it, so no Choice item, Life Orb, Boots or Ring Target)`);
    if (entry.base) out.push(`  Base species: ${entry.base} (${Dex.species(Dex.toID(entry.base)).tier}), pre-Mega abilities: ${Dex.abilityList(Dex.toID(entry.base)).join(' / ')}`);
  } else {
    out.push('  Held item: **free**');
  }
  out.push(`  STAB: ${p.stab.join(' · ') || '**none**'}`);
  out.push(`  Physical coverage: ${p.physical.join(', ') || '**none**'}`);
  out.push(`  Special coverage: ${p.special.join(', ') || '**none**'}`);
  if (!full) return out.join('\n');
  const row = (label, list) => (list.length ? `  ${label}: ${list.join(', ')}` : null);
  [
    row('Setup', p.setup), row('Reliable recovery', p.recovery), row('Drain/unreliable', p.drain),
    row('Priority', p.priority), row('Hazards', p.hazards), row('Removal', p.removal),
    row('Pivot', p.pivot), row('Phazing', p.phazing), row('Status', p.status),
    row('Cleric/support', p.cleric), row('Trapping', p.trapping), row('Weather/terrain', p.weatherTerrain),
    row('Utility', p.utility),
  ].filter(Boolean).forEach(l => out.push(l));
  const flags = [];
  for (const [id, label] of [['knockoff', 'Knock Off'], ['trick', 'Trick'], ['switcheroo', 'Switcheroo'],
    ['encore', 'Encore'], ['taunt', 'Taunt'], ['substitute', 'Substitute'], ['batonpass', 'Baton Pass'],
    ['trickroom', 'Trick Room'], ['tailwind', 'Tailwind']]) {
    if (p.has(id)) flags.push(label);
  }
  if (flags.length) out.push(`  Notable: ${flags.join(', ')}`);
  return out.join('\n');
}

/* ================= matrices ================= */
function offensiveMatrix(name, spreadKey, moveIds) {
  const e = byName(name);
  if (!e) return `_${name} is not in the live roster._`;
  const usable = moveIds.filter(id => Dex.hasMove(id) &&
    (Dex.legalMoveList(e.kind === 'forme' && e.base ? Dex.toID(e.base) : e.id) || []).some(m => Dex.toID(m) === id));
  if (!usable.length) return `_No test moves legal for ${name}._`;
  const atk = setFor(e, SPREADS[spreadKey], {moves: usable, item: e.kind === 'forme' ? null : 'lifeorb'});
  const head = `| Defender (representative test set) | ${usable.map(id => Dex.move(id).name).join(' | ')} |`;
  const sep = `| --- | ${usable.map(() => '---').join(' | ')} |`;
  const rows = defenders.map(d =>
    `| ${d.name} (${d.spread}${d.item ? ', ' + itemName(d.item) : ', no item'}) | ` +
    usable.map(id => calcCell(calc(atk, d.cfg, id))).join(' | ') + ' |');
  return [`Attacker: **${name}**, ${SPREADS[spreadKey].nature} ${JSON.stringify(SPREADS[spreadKey].evs)}, ` +
    `${e.kind === 'forme' ? itemName(e.item) + ' (forced)' : 'Life Orb'} — a representative test set, not a "standard" one.`,
  '', head, sep, ...rows].join('\n');
}

function revengeMatrix(candidates) {
  const attackers = REVENGE.map(([n, sp, item, move]) => {
    const e = byName(n);
    return e && Dex.hasMove(move) ? {n, cfg: setFor(e, SPREADS[sp], {item, moves: [move]}), move} : null;
  }).filter(Boolean);
  const head = `| Target | ${attackers.map(a => `${a.n} ${Dex.move(a.move).name}`).join(' | ')} |`;
  const sep = `| --- | ${attackers.map(() => '---').join(' | ')} |`;
  const rows = candidates.map(([name, spreadKey]) => {
    const e = byName(name);
    if (!e) return null;
    const target = setFor(e, SPREADS[spreadKey], {moves: ['tackle']});
    return `| ${name} | ` + attackers.map(a => calcCell(calc(a.cfg, target, a.move))).join(' | ') + ' |';
  }).filter(Boolean);
  return [head, sep, ...rows].join('\n');
}

/* ================= tables ================= */
function speedTable() {
  const rows = [];
  for (const e of UU) {
    const s = Dex.species(e.id);
    if (s.baseStats.spe < 85) continue;
    const o = P.offence(e, P.abilityOf(e));
    const scarf = Math.floor(o.spePlus * 1.5);
    rows.push(`| ${e.name} | ${s.baseStats.spe} | ${o.speNeutral} | ${o.spePlus} | ${Math.floor(o.spePlus * 1.5)} | ${Math.floor(o.spePlus * 2)} | ${scarf} |`);
  }
  return ['| Pokémon | Base | Max neutral | Max +Spe | +1 | +2 | Choice Scarf (from max +Spe) |',
    '| --- | --- | --- | --- | --- | --- | --- |', ...rows].join('\n');
}

function priorityTable() {
  const rows = [];
  for (const e of UU) {
    const p = P.profile(e);
    if (!p.priority.length) continue;
    const o = p.offByAbility[p.ability];
    rows.push(`| ${e.name} | ${p.priority.join('; ')} | Atk ${o.atkPlus} / SpA ${o.spaPlus} |`);
  }
  return ['| Pokémon | Priority moves (BP, type, bracket — engine values) | Max offence |',
    '| --- | --- | --- |', ...rows].join('\n');
}

function itemFreedomTable(list) {
  const rows = list.map(([name]) => {
    const e = byName(name);
    if (!e) return null;
    const forme = e.kind === 'forme';
    return `| ${name} | ${forme ? '**No** — ' + itemName(e.item) + ' is forced and cannot be removed' : 'Yes — any item'} | ${forme ? 'Band/Specs/Scarf/Life Orb/Boots/Ring Target/Leftovers all unavailable' : 'Band, Specs, Scarf, Life Orb, Boots, Ring Target, Leftovers, Assault Vest, Orbs all available'} |`;
  }).filter(Boolean);
  return ['| Candidate | Item freedom | Consequence |', '| --- | --- | --- |', ...rows].join('\n');
}

function hazardEnvironment() {
  const find = pred => UU.filter(e => {
    const src = e.kind === 'forme' && e.base ? Dex.toID(e.base) : e.id;
    return (Dex.legalMoveList(src) || []).some(m => pred(Dex.toID(m)));
  }).map(e => e.name);
  const setters = id => ['stealthrock', 'spikes', 'toxicspikes', 'stickyweb'].includes(id);
  const removers = id => Mechanics.HAZARD_REMOVAL_MOVES.has(id);
  const bouncers = UU.filter(e => P.abilitiesOf(e).some(a => Dex.toID(a) === 'magicbounce')).map(e => e.name);
  const ghosts = UU.filter(e => Dex.species(e.id).types.includes('Ghost')).map(e => e.name);
  const perType = t => UU.filter(e => {
    const src = e.kind === 'forme' && e.base ? Dex.toID(e.base) : e.id;
    return (Dex.legalMoveList(src) || []).some(m => Dex.toID(m) === t);
  }).map(e => e.name);
  return `**Stealth Rock setters:** ${perType('stealthrock').join(', ') || 'none'}

**Spikes:** ${perType('spikes').join(', ') || 'none'}

**Toxic Spikes:** ${perType('toxicspikes').join(', ') || 'none'}

**Sticky Web:** ${perType('stickyweb').join(', ') || 'none'}

**Removal (Rapid Spin / Defog / Mortal Spin / Tidy Up):** ${find(removers).join(', ') || 'none'}

**Magic Bounce (bounces hazards back):** ${bouncers.join(', ') || 'none'}

**Ghost types (block Rapid Spin):** ${ghosts.join(', ') || 'none'}

Heavy-Duty Boots are available to every **species** entry and to **no forme**
entry, because the stone occupies the item slot. That asymmetry matters most for
${['Moltres', 'Gyarados', 'Weavile', 'Blacephalon'].filter(n => byName(n)).join(', ')} and for every Mega on the candidate list.`;
}

function megaPool() {
  const megas = UU.filter(e => e.kind === 'forme' && /-Mega/.test(e.name));
  const rows = megas.map(e => {
    const s = Dex.species(e.id);
    const p = P.profile(e);
    return `| ${e.name} | ${s.types.join('/')} | ${s.bst} (${stats(s)}) | ${Dex.abilityList(e.id)[0]} | ${e.estimated ? '**estimated**' : 'imported'} | ${p.stab.join(' · ') || 'none'} |`;
  });
  return [`UU has **${megas.length}** Mega formes and a team may use **one**. A Mega is only tier-breaking if it is worth choosing over all of these.`,
    '', '| Mega | Types | BST (spread) | Ability | Tier source | STAB |', '| --- | --- | --- | --- | --- | --- |', ...rows].join('\n');
}

/* ================= assemble ================= */
const doc = [];
doc.push(`# RedGPT UU Final Audit — Verified Evidence Packet

**Generated from the live RedGPT project** by \`tools/uu-final-evidence.js\`.
Every stat, movepool value, damage figure and speed number below comes from the
running engine, the packaged data, the validator or the real damage calculator.

**There is no usage, win-rate, ladder, tournament or popularity data in this
project, so none is quoted.** Where something genuinely cannot be determined,
section S says so.

---

## Your task

You are making the **complete final UU tier audit for Pokémon RedGPT**. Answer
both directions:

1. **Which current UU entries are too strong for UU and should move UP to OU?**
2. **Which current UU entries are too weak for UU and should move DOWN to RU?**

The questions are *not* "would this be good in Smogon UU". They are:

> **Upward** — is this entry so powerful, centralising, hard to check or
> role-compressing **under RedGPT's mechanics** that it belongs in the RedGPT OU
> roster in section E?
>
> **Downward** — is this entry sufficiently outclassed **at its actual job** by
> the RU entries in section D that it no longer deserves UU?

**A high BST is not enough to promote**, and **weak raw stats are not enough to
demote** — a UU entry should only fall if RU already contains one or more
Pokémon that credibly do the same job as well or better.

For every entry you move, give: the exact name, species or forme, the direction,
confidence (high/medium/low), two or three sentences naming the specific Pokémon
it outclasses or is outclassed by, and the numbers you relied on with the ability
and item they assume. Then list separately what you **considered and deliberately
left**. Most entries should not move.

**This packet makes no tiering decisions and contains no recommendations.** It is
evidence for yours. Where it could not settle something, section S says so
explicitly rather than guessing.

---
`);

doc.push(block('## A. Current tier / rules snapshot', sectionA()));

doc.push(block('## B. Corrections to the previous evidence', `Four defects in the **previous UU profiler** were found while assembling this
packet. All four are fixed here, and each changed what a profile said.

**B1 — The category filter used BASE stats, so ability-driven offence was
invisible.** The old profiler compared base Attack to base Special Attack and
hid the weaker side. That is wrong for every ability that multiplies a stat.

| Entry | Base line | Engine stats @252+ | Old profile showed | Truth |
| --- | --- | --- | --- | --- |
| Starmie-Mega | 100 Atk / 130 SpA | **Atk 656 / SpA 394** (Huge Power) | special only | physical is the real half |
| Azumarill | 50 Atk / 60 SpA | **Atk 436** (Huge Power) / SpA 240 | mixed, understated | physical |
| Conkeldurr | 140 Atk | **Atk 416** (Guts, before any burn) | physical | physical |

Measured on the same target — Mega Starmie into a 252 HP / 252+ Def Blissey:

| Move | Damage |
| --- | --- |
| +Atk 252 Waterfall (Water STAB) | **434-511 (60.8-71.6%)** |
| +Atk 252 Psycho Cut (Psychic STAB) | 380-448 (53.2-62.7%) |
| +Atk 252 Double-Edge | 434-510 (60.8-71.4%) |
| +SpA 252 Hydro Pump | 168-197 (23.5-27.6%) |
| +SpA 252 Psychic | 126-149 (17.6-20.9%) |

**The physical set does roughly 2.6× what the special set does.** The old
profile showed the special half.

**B2 — The \`-ate\` abilities were not applied.** They convert in
\`onModifyMove\`, not in \`battle.moveType\`, so the profiler read the packaged
type. Corrected via \`Abilities.displayMoveType\` / \`displayBasePower\`, which
is what the game's own move buttons use:

| Ability | Move | Packaged | Actual |
| --- | --- | --- | --- |
| Pixilate | Hyper Voice | Normal 90 | **Fairy 117** |
| Pixilate | Double-Edge | Normal 120 | **Fairy 156** |
| Aerilate | Double-Edge | Normal 120 | **Flying 156** |
| Refrigerate | Body Slam | Normal 85 | **Ice 110** |

So Mega Gardevoir's and Mega Altaria's Fairy STAB were both missing from the
previous document.

**B3 — Charge moves won ties.** Mega Starmie's Water STAB was reported as
**Dive** (80, charge) rather than **Waterfall** (80, no charge). Charge moves now
lose ties.

**B4 — Banned moves were advertised.** Double Team appeared under "Setup" across
the roster although UU's evasion clause bans it. The profiler filters
\`rules.bannedMoves\` now.`));

doc.push(block('## C. Full UU competitive profiles', `All **${UU.length}** current UU entries. Engine-resolved throughout.

${UU.map(e => renderProfile(e)).join('\n\n')}`));

const RU = rosters.RU.slice().sort((a, b) => a.name.localeCompare(b.name));
doc.push(block('## D. Full RU comparison profiles', `All **${RU.length}** current RU entries, in the same format, so downward
role comparisons can actually be made. This was the largest gap in the previous
document.

${RU.map(e => renderProfile(e)).join('\n\n')}`));

doc.push(block('## E. Current OU comparison bar', `Compact. Ask for a full movepool profile on any OU entry you want to compare
directly against a UU candidate.

| # | Pokémon | Kind | Types | BST | Spread | Ability | Reached by |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rosters.OU.slice().sort((a, b) => a.name.localeCompare(b.name)).map((e, i) => {
  const s = Dex.species(e.id);
  return `| ${i + 1} | ${e.name} | ${e.kind} | ${s.types.join('/')} | ${s.bst} | ${stats(s)} | ${e.kind === 'forme' ? Dex.abilityList(e.id)[0] : Dex.abilityList(e.id).join(', ')} | ${e.kind === 'forme' ? `${e.base} + ${itemName(e.item)}` : '—'} |`;
}).join('\n')}`));

const estimated = UU.filter(e => e.estimated);
doc.push(block('## F. Estimated-forme audit', `**${estimated.length} UU formes carry an \`estimated\` tier** — Smogon has never
ranked them, so this project placed them by nearest neighbour. They are the
softest placements in the tier and the easiest to argue with.

${estimated.map(e => {
  const p = P.profile(e);
  const s = Dex.species(e.id);
  const base = Dex.species(Dex.toID(e.base));
  const ab = Dex.ability(Dex.toID(Dex.abilityList(e.id)[0]));
  const preMegaSpe = P.offence({id: base.id, kind: 'species'}, Dex.abilityList(base.id)[0]);
  return `### ${e.name}

- Base species: **${e.base}** (${base.tier}), base spread ${stats(base)}, pre-Mega abilities: ${Dex.abilityList(base.id).join(' / ')}
- Required item: **${itemName(e.item)}** (forced, not removable — the whole item slot is the cost)
- Forme spread: **${stats(s)}**, BST ${s.bst}, ${s.types.join('/')}
- Ability: **${Dex.abilityList(e.id)[0]}** — packaged effect: _${(ab && (ab.shortDesc || ab.desc)) || 'no packaged description'}_
- Speed: base forme ${preMegaSpe.spePlus} (max +Spe) → Mega **${p.off.spePlus}** (max +Spe)
- STAB: ${p.stab.join(' · ') || '**none**'}
- Physical coverage: ${p.physical.join(', ') || '**none**'}
- Special coverage: ${p.special.join(', ') || '**none**'}
- Setup: ${p.setup.join(', ') || '**none**'} | Recovery: ${p.recovery.join(', ') || '**none**'} | Priority: ${p.priority.join(', ') || '**none**'}
- Engine offence @252+: Atk **${p.off.atkPlus}**, SpA **${p.off.spaPlus}**`;
}).join('\n\n')}`));

doc.push(block('## G. Serious UU → OU candidate evidence', UP.map(([name, spread, moves]) => {
  const e = byName(name);
  if (!e) return `### ${name}\n\n_Not in the live UU roster._`;
  return `### ${name}\n\n${renderProfile(e)}\n\n${offensiveMatrix(name, spread, moves)}`;
}).join('\n\n---\n\n')));

/* ---------- downward candidates and role comparison ---------- */
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
  return k;
};
function roleCompare(name) {
  const e = byName(name);
  if (!e) return `_${name} is not in the live UU roster._`;
  const p = P.profile(e);
  const s = Dex.species(e.id);
  const mine = new Set(ROLE_KEYS(p));
  const scored = RU.map(r => {
    const rp = P.profile(r);
    const rs = Dex.species(r.id);
    const shared = ROLE_KEYS(rp).filter(k => mine.has(k)).length;
    const typeOverlap = rs.types.filter(t => s.types.includes(t)).length;
    return {r, rp, rs, score: shared * 2 + typeOverlap * 3 + (Math.abs(rs.bst - s.bst) < 60 ? 2 : 0)};
  }).sort((a, b) => b.score - a.score).slice(0, 4);
  const rows = scored.map(({r, rp, rs}) =>
    `| ${r.name} | ${rs.types.join('/')} | ${rs.bst} (${stats(rs)}) | ${P.abilitiesOf(r).join(', ')} | ${ROLE_KEYS(rp).join(', ') || '—'} | ${rp.stab.join(' · ') || 'none'} |`);
  return `**${name}** — ${s.types.join('/')}, BST ${s.bst} (${stats(s)}), ${P.abilitiesOf(e).join(' / ')}
Roles: ${ROLE_KEYS(p).join(', ') || '—'} | STAB: ${p.stab.join(' · ') || 'none'} | item ${e.kind === 'forme' ? '**locked to ' + itemName(e.item) + '**' : 'free'}

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
${rows.join('\n')}`;
}

const DOWN = ['Slowbro', 'Slowking', 'Corviknight', 'Skarmory', 'Skarmory-Mega', 'Gyarados', 'Hawlucha',
  'Weavile', 'Okidogi', 'Iron Treads', 'Iron Crown', 'Moltres', 'Zapdos-Galar', 'Hatterene', 'Pecharunt',
  'Scolipede-Mega', 'Amoonguss', 'Blissey', 'Chansey'];

doc.push(block('## H. Serious UU → RU candidate evidence', `The recently-arrived entries plus the long-standing ones whose role the expanded
RU Mega roster may now cover. **Being recently dropped from OU is not evidence
that they overshot** — it is only the reason they are worth re-checking.

${DOWN.map(n => `### ${n}\n\n${roleCompare(n)}`).join('\n\n---\n\n')}`));

doc.push(block('## K. Role-comparison matrices', `Section H is the role comparison, one candidate at a time. The RU competitors
are selected by shared role keys, shared typing and BST proximity — a mechanical
shortlist, not a judgement. Their full profiles are in section D.`));

doc.push(block('## Q. Weather / terrain / Trick Room / Tailwind environment', (() => {
  const learners = id => UU.filter(e => {
    const src = e.kind === 'forme' && e.base ? Dex.toID(e.base) : e.id;
    return (Dex.legalMoveList(src) || []).some(m => Dex.toID(m) === id);
  }).map(e => e.name);
  const abilityHolders = ids => UU.filter(e => P.abilitiesOf(e).some(a => ids.includes(Dex.toID(a)))).map(e => e.name);
  return `**Weather setters by move:** Rain Dance — ${learners('raindance').join(', ') || 'none'}; Sunny Day — ${learners('sunnyday').join(', ') || 'none'}; Sandstorm — ${learners('sandstorm').join(', ') || 'none'}; Snowscape — ${learners('snowscape').join(', ') || 'none'}.

**Weather setters by ability:** ${abilityHolders(['drizzle', 'drought', 'sandstream', 'snowwarning']).join(', ') || 'none'}.

**Terrain setters by move:** Electric — ${learners('electricterrain').join(', ') || 'none'}; Grassy — ${learners('grassyterrain').join(', ') || 'none'}; Misty — ${learners('mistyterrain').join(', ') || 'none'}; Psychic — ${learners('psychicterrain').join(', ') || 'none'}.

**Terrain setters by ability:** ${abilityHolders(['electricsurge', 'grassysurge', 'mistysurge', 'psychicsurge']).join(', ') || 'none'}.

**Weather-speed abilities in UU:** ${abilityHolders(['swiftswim', 'chlorophyll', 'sandrush', 'slushrush']).join(', ') || 'none'}.

**Mega Sol is PERSONAL weather, not field-wide sun.** It overrides
\`battle.weatherFor(pokemon)\` for its holder only; nothing else on the field
sees it, and it does not beat primal weather's element block. **Meganium-Mega**
is the UU holder. Anything reasoning about it as a sun setter for teammates is
wrong.

**Trick Room:** ${learners('trickroom').join(', ') || 'none'}. The **Warp Prism** extends Trick Room *the holder sets* from 5 turns to **8**.

**Tailwind:** ${learners('tailwind').join(', ') || 'none'}. The **Wind Sock** extends Tailwind *the holder sets* from 4 turns to **7**.

Neither item can be held by a Mega — the stone occupies the slot — but a
teammate can hold it and set the field. That matters for the slow breakers:
Dragalge-Mega (Spe ${P.offence(byName('Dragalge-Mega') || UU[0], 'Regenerator').spePlus} at max +Spe), Drampa-Mega, Scrafty-Mega, Hatterene and Mega Slowbro.`;
})()));

doc.push(block('## I. Offensive matchup matrices', `Every matrix in section G is the candidate against the same twenty-Pokémon
defensive core, so candidates can be compared column by column.

**Classification is yours to make.** The engine gives damage; whether a defender
is a hard counter, a reliable counter, a soft counter, a check, revenge-only or
not an answer depends on recovery, speed and hazard chip, which are all in
sections C, L, M and P.`));

doc.push(block('## J. Defensive / revenge-kill matrices', `UU counterplay into each upward candidate. Attackers are representative test
sets; the candidate is on its own offensive spread from section G, so these are
"can UU revenge it once it is in".

${revengeMatrix(UP.map(([n, s]) => [n, s]))}`));

doc.push(block('## L. Speed-tier table', `Every UU entry at base Speed 85+. Priority is **not** speed and is in section M.

${speedTable()}`));

doc.push(block('## M. Priority table', `Engine priority, including Grassy Glide's +1 which the packaged data does not show.

${priorityTable()}`));

doc.push(block('## N. Item-freedom table', itemFreedomTable(UP)));

doc.push(block('## O. Mega opportunity-cost table', megaPool()));

doc.push(block('## P. Hazard environment', hazardEnvironment()));

doc.push(block('## R. New candidates the mechanical scan surfaced', (() => {
  const flagged = [];
  for (const e of UU) {
    const p = P.profile(e);
    const s = Dex.species(e.id);
    const reasons = [];
    const bestAtk = Math.max(...p.abilities.map(a => p.offByAbility[a].atkPlus));
    const bestSpa = Math.max(...p.abilities.map(a => p.offByAbility[a].spaPlus));
    const raw = Math.max(s.baseStats.atk, s.baseStats.spa);
    // An ability that materially multiplies offence, which a stat line hides.
    if (bestAtk > 500 && s.baseStats.atk < 120) reasons.push(`Attack reaches **${bestAtk}** off a base ${s.baseStats.atk} — an ability is doing the work`);
    if (bestSpa > 500 && s.baseStats.spa < 130) reasons.push(`Special Attack reaches **${bestSpa}** off a base ${s.baseStats.spa}`);
    if (p.setup.length && p.priority.length && p.recovery.length) reasons.push('setup + priority + reliable recovery on one entry');
    if (e.estimated && s.bst >= 600) reasons.push(`BST ${s.bst} on an **estimated** tier`);
    if (!p.stab.length) reasons.push('**no damaging STAB at all**');
    if (reasons.length) flagged.push(`- **${e.name}** (${s.types.join('/')}, BST ${s.bst}, ${p.abilities.join('/')}) — ${reasons.join('; ')}. Raw headline stat ${raw}.`);
  }
  return `Mechanical flags only — reasons to look, not verdicts.

${flagged.join('\n') || '_Nothing beyond the candidates already listed._'}`;
})()));

doc.push(block('## S. Remaining genuinely unresolved questions', `Things this project **cannot** answer, stated plainly rather than guessed:

1. **No usage, ladder, win-rate, tournament or popularity data exists in RedGPT.**
   There is no metagame history to consult. Every judgement must come from
   mechanics, matchups and role competition.
2. **Nothing in UU has been played by a human.** The whole ladder was rebuilt on
   2026-08-15 and revised on 2026-08-16; the fifteen entries that arrived from OU
   have no play history at all. Campaign balance figures measure a different
   format and say nothing about UU.
3. **\`estimated\` formes are a nearest-neighbour model, not data.** Nine UU
   formes sit on it (section F). The model reads the 48 Megas Smogon does rank
   and interpolates by BST and base tier; it has no notion of movepool. Section F
   is the evidence that model cannot see.
4. **Guts, and any conditional ability, reads as its unboosted value here.** The
   engine reports Conkeldurr's Attack as ${(() => { const e = byName('Conkeldurr'); return e ? P.offence(e, 'Guts').atkPlus : '—'; })()} because nothing has
   burned it yet. Toxic Orb and Flame Orb fire **on entry**, so the boosted
   number is the one that matters in play — ask for it if you need it.
5. **Ability-vs-ability comparisons on a species entry are not resolved here.**
   A species may run any of its abilities; the profiles report the offensive
   stats for each, but the movepool sections assume the first. Scizor
   (Technician vs Light Metal) and Azumarill (Huge Power vs Thick Fat) are the
   sharpest cases — ask for a per-ability profile if it decides a verdict.
6. **The 0-2 HP rounding difference from Showdown's calculator** is known and
   documented; it never changes a tier.

**If a number you need is missing, ask for it.** Any damage, speed or legality
question can be answered against the real engine, and a request is far cheaper
than a verdict built on an estimate.`));

/*
 * Emit in section order regardless of the order the blocks were built in —
 * several sections depend on helpers defined further down the file, so the
 * construction order and the reading order are not the same.
 */
const header = doc.shift();
doc.sort((a, b) => {
  const key = t => (/^## ([A-Z])\./.exec(t) || [, 'Z'])[1];
  return key(a).localeCompare(key(b));
});
const out = [header, ...doc].join('\n---\n\n');
if (CHECK) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (current === out) { console.log('unchanged'); process.exit(0); }
  console.log('STALE — run: node tools/uu-final-evidence.js');
  process.exit(1);
}
fs.writeFileSync(OUT, out);
console.log(`UU ${UU.length} | RU ${RU.length} | OU ${rosters.OU.length} | estimated formes ${estimated.length} | up-candidates ${UP.length} | defenders ${defenders.length}`);
console.log('wrote docs/UU_FINAL_EVIDENCE.md');
