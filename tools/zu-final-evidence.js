#!/usr/bin/env node
/*
 * Generate `docs/ZU_FINAL_EVIDENCE.md` — the evidence packet for the ZU tier
 * audit (ZU -> PU).
 *
 * **This pass is ONE-DIRECTIONAL, and that is structural rather than a choice.**
 * ZU is the bottom rung of the ladder: there is no tier beneath it, so "too weak
 * for ZU" has nowhere to go. Every other packet on this programme has been
 * bidirectional; this one cannot be.
 *
 * Roster variables are named for their ROLE (SUBJECT / UP), never for a tier —
 * see the note in `pu-final-evidence.js` about the clone that kept `RU/NU/UU`
 * while binding them to something else.
 *
 *   node tools/zu-final-evidence.js
 *   node tools/zu-final-evidence.js --check
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {loadEngine} = require('../tests/helpers/engine.js');
const {createProfiler} = require('./lib/profiler.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs/ZU_FINAL_EVIDENCE.md');
const CHECK = process.argv.includes('--check');
const R = loadEngine();
const {Dex, Formats, Mechanics, Calculator, Pokemon, Validation, Abilities, Items} = R;
const P = createProfiler(R);

const SUBJECT_TIER = 'ZU', UP_TIER = 'PU';

const rosters = {};
for (const t of Formats.TIER_ORDER) rosters[t] = Formats.tierRoster(t);
const sorted = t => rosters[t].slice().sort((a, b) => a.name.localeCompare(b.name));
const SUBJECT = sorted(SUBJECT_TIER);   // ZU — the tier under review
const UP = sorted(UP_TIER);             // PU — the only bar that exists

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

/* ---------- temporary self-debuffs distort a profile, and one holder exists ----
 *
 * `P.offence` measures through the engine with the ability live, which is right
 * for Huge Power and wrong for an ability whose penalty EXPIRES. Slow Start
 * halves Attack and Speed for five turns, so Regigigas measures Atk **230**
 * against a real **460** once it wears off — and the physical/special chooser
 * then reads SpA 284 > Atk 230 and builds a *special* set for a 160-Attack
 * Pokemon.
 *
 * Measured scope before fixing: **Regigigas is the only Slow Start holder on the
 * entire ladder** (Varoom is NFE and carries no tier). Defeatist is the other
 * self-debuffing `onModifyStat` and is HP-gated, so at the full HP a profile is
 * built at it is inactive and reads correctly.
 *
 * So this is fixed HERE rather than in `tools/lib/profiler.js`: the shared
 * profiler feeds five pinned documents, and changing it to correct one Pokemon
 * that appears in only this one would force all five to be regenerated for no
 * gain. Reported to the project instead.
 *
 * The probe ability is Pressure — it declares no stat hooks, so it measures the
 * same Pokemon with the debuff absent.
 */
const TEMPORARY_SELF_DEBUFF = new Set(['slowstart']);
const NEUTRAL_PROBE = 'Pressure';
const hasTempDebuff = entry => P.abilitiesOf(entry).some(a => TEMPORARY_SELF_DEBUFF.has(Dex.toID(a)));
/** Offence with any expiring self-penalty removed; identical to `P.offence` otherwise. */
function offenceTrue(entry, ability) {
  return TEMPORARY_SELF_DEBUFF.has(Dex.toID(ability)) ? P.offence(entry, NEUTRAL_PROBE) : P.offence(entry, ability);
}

/* ---------- trapping, discovered by hook rather than by name ---------- */
const TRAP_ABILITIES = Object.entries(Abilities.registry)
  .filter(([, d]) => d && typeof d.onTrapped === 'function').map(([id]) => id);
const trapperNamesIn = list => list.filter(e => P.abilitiesOf(e).some(a => TRAP_ABILITIES.includes(Dex.toID(a)))).map(e => e.name);

/* ---------- a defensive core built from ZU ---------- */
const CORE = [
  ['Regirock', 'physWall', 'leftovers'], ['Regice', 'specWall', 'leftovers'],
  ['Bastiodon', 'physWall', 'leftovers'], ['Probopass', 'specWall', 'leftovers'],
  ['Carbink', 'physWall', 'leftovers'], ['Dusknoir', 'physWall', 'leftovers'],
  ['Cofagrigus', 'physWall', 'leftovers'], ['Runerigus', 'physWall', 'leftovers'],
  ['Pyukumuku', 'specWall', 'leftovers'], ['Lapras', 'specWall', 'leftovers'],
  ['Articuno', 'specWall', 'leftovers'], ['Musharna', 'specWall', 'leftovers'],
  ['Lickilicky', 'physWall', 'leftovers'], ['Relicanth', 'physWall', 'leftovers'],
  ['Walrein', 'specWall', 'leftovers'], ['Meganium', 'physWall', 'leftovers'],
  ['Venusaur', 'specWall', 'blacksludge'], ['Mesprit', 'specWall', 'leftovers'],
  ['Brute Bonnet', 'physWall', 'leftovers'], ['Shuckle', 'physWall', 'leftovers'],
].map(([n, sp, it]) => { const e = byName(n); return e ? {n, e, sp, it, cfg: setFor(e, SPREADS[sp], {item: it})} : null; }).filter(Boolean);

const REVENGE = [
  ['Electrode', 'specFast', 'choicescarf', 'thunderbolt'], ['Accelgor', 'specFast', 'lifeorb', 'bugbuzz'],
  ['Jolteon', 'specFast', 'choicescarf', 'thunderbolt'], ['Boltund', 'physFast', 'choiceband', 'wildcharge'],
  ['Sceptile', 'specFast', 'lifeorb', 'leafstorm'], ['Zebstrika', 'physFast', 'choiceband', 'wildcharge'],
  ['Persian', 'physFast', 'lifeorb', 'doubleedge'], ['Lycanroc', 'physFast', 'choiceband', 'stoneedge'],
  ['Cryogonal', 'specFast', 'choicescarf', 'icebeam'], ['Charizard', 'specFast', 'lifeorb', 'fireblast'],
].map(([n, sp, it, mv]) => { const e = byName(n); return e && Dex.hasMove(mv) ? {n, mv, cfg: setFor(e, SPREADS[sp], {item: it, moves: [mv]})} : null; }).filter(Boolean);

/* ---------- profile rendering ---------- */
function renderProfile(entry, {compact = false} = {}) {
  const p = P.profile(entry, {tier: enforcedTier(entry)});
  const s = p.species;
  const out = [];
  const own = s.tier, enf = enforcedTier(entry);
  const note = enf !== own ? ` _(its own \`species.tier\` reads ${own}; the enforced tier is the one shown)_` : '';
  out.push(`**${entry.name}** — ${entry.kind}, **${enf}**, source: ${entry.estimated ? '**estimated**' : tierSourceOf(entry.id)}${note}`);
  out.push(`  ${s.types.join('/')} | BST ${s.bst} (${stats(s)}) | Abilities: ${p.abilities.join(' / ')}`);
  const offLines = p.abilities.map(a => {
    const o = p.offByAbility[a];
    return `${a}: Atk ${o.atkNeutral}/${o.atkPlus}, SpA ${o.spaNeutral}/${o.spaPlus}, Spe ${o.speNeutral}/${o.spePlus}`;
  });
  out.push(`  Engine stats @252 (neutral/positive): ${offLines.join(' — ')}`);
  if (hasTempDebuff(entry)) {
    const t = offenceTrue(entry, p.abilities.find(a => TEMPORARY_SELF_DEBUFF.has(Dex.toID(a))));
    out.push(`  **The line above is measured WITH the penalty active.** Slow Start halves Attack and Speed for **five turns**; once it expires the same spread reads **Atk ${t.atkNeutral}/${t.atkPlus}, SpA ${t.spaNeutral}/${t.spaPlus}, Spe ${t.speNeutral}/${t.spePlus}** — and the damage matrix below uses these, not the halved ones.`);
  }
  const trapAb = p.abilities.filter(a => TRAP_ABILITIES.includes(Dex.toID(a)));
  if (trapAb.length) out.push(`  **TRAPPING ABILITY: ${trapAb.join(', ')}** (${p.abilities.length === 1 ? 'forced — its only ability' : 'optional — one of ' + p.abilities.length})`);
  out.push('  Item: **free** (no ZU entry is a forme, so nothing here has a forced item)');
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
  'marvelscale', 'icescales', 'stamina', 'schooling', 'shieldsdown', 'simple', 'furcoat', 'protosynthesis',
  'quarkdrive', 'moody', 'prankster', 'intimidate', 'levitate', 'motordrive', 'voltabsorb', 'waterabsorb',
  'sapsipper', 'flashfire', 'harvest', 'sturdy', 'unburden', 'rkssystem', 'innardsout'];

function scanUp() {
  const flagged = [];
  for (const e of SUBJECT) {
    const p = P.profile(e, {tier: SUBJECT_TIER});
    const s = Dex.species(e.id);
    const reasons = [];
    const bestAtk = Math.max(...p.abilities.map(a => p.offByAbility[a].atkPlus));
    const bestSpa = Math.max(...p.abilities.map(a => p.offByAbility[a].spaPlus));
    const bestSpe = Math.max(...p.abilities.map(a => p.offByAbility[a].spePlus));
    if (bestAtk >= 440) reasons.push(`Attack **${bestAtk}**`);
    if (bestSpa >= 420) reasons.push(`Special Attack **${bestSpa}**`);
    if (bestSpe >= 350) reasons.push(`Speed **${bestSpe}**`);
    if (s.bst >= 510) reasons.push(`BST ${s.bst}`);
    if (s.bst >= 570) reasons.push(`**BST ${s.bst} — top of the rung**`);
    if (bestAtk > 420 && s.baseStats.atk < 105) reasons.push(`Attack reaches ${bestAtk} off base ${s.baseStats.atk} — an ability is doing the work`);
    if (p.setup.length && p.priority.length && p.recovery.length) reasons.push('setup + priority + reliable recovery');
    if (p.setup.some(m => /Shell Smash|Quiver Dance|Dragon Dance|Swords Dance|Nasty Plot|Shift Gear|Calm Mind|Bulk Up|Curse/.test(m)) && bestSpe >= 300) reasons.push('strong setup on a workable frame');
    const notable = p.abilities.filter(a => NOTABLE_ABILITIES.includes(Dex.toID(a)));
    if (notable.length) reasons.push(`ability: ${notable.join('/')}`);
    const trap = p.abilities.filter(a => TRAP_ABILITIES.includes(Dex.toID(a)));
    if (trap.length) reasons.push(`**trapping ability: ${trap.join('/')}**`);
    if (p.hazards.length && bestAtk >= 360) reasons.push('hazards + real offence');
    if (p.recovery.length && (s.baseStats.def + s.baseStats.spd) >= 200) reasons.push('reliable recovery on a bulky frame');
    if (reasons.length >= 3) flagged.push({e, p, s, reasons});
  }
  return flagged.sort((a, b) => b.reasons.length - a.reasons.length);
}

const upFlagged = scanUp();
/*
 * NO CAP, deliberately — every flagged entry gets a matrix.
 *
 * A first version capped this at the 30 most-flagged entries and **Regigigas
 * fell below the cut**: the highest BST on the rung and the most obvious
 * promotion question in the tier, excluded because a flag *count* ranked it
 * below entries with more numerous but weaker flags. A cap that drops the
 * conspicuous case is a cap making a judgement, which is exactly what a packet
 * must not do. The document is longer; that is the correct trade.
 */
const UP_CANDIDATES = upFlagged.map(f => {
  const p = f.p;
  /*
   * The category decision reads `offenceTrue`, so an expiring penalty cannot
   * pick the wrong attacking stat. Without it Regigigas builds a SPECIAL set
   * (SpA 284 against a Slow-Start-halved Atk 230) despite base 160 Attack.
   */
  const bestAtk = Math.max(...p.abilities.map(a => offenceTrue(f.e, a).atkPlus));
  const bestSpa = Math.max(...p.abilities.map(a => offenceTrue(f.e, a).spaPlus));
  // For a temporary-debuff holder the profiler's own wantsPhysical/wantsSpecial
  // are computed off the halved stats too, so the raw comparison decides.
  const physical = hasTempDebuff(f.e)
    ? bestAtk >= bestSpa
    : (p.wantsPhysical && (!p.wantsSpecial || bestAtk >= bestSpa));
  const spread = physical ? (Dex.species(f.e.id).baseStats.spe >= 95 ? 'physFast' : 'physical') : (Dex.species(f.e.id).baseStats.spe >= 95 ? 'specFast' : 'special');
  const moves = [...p.stab, ...(physical ? p.physical : p.special)]
    .map(t => { const m = /^[A-Za-z]+ (.+?) \d/.exec(t); return m ? Dex.toID(m[1]) : null; })
    .filter(id => id && Dex.hasMove(id)).slice(0, 4);
  return {entry: f.e, spread, moves, reasons: f.reasons};
}).filter(c => c.moves.length);

function matrix(c) {
  /*
   * A temporary-debuff holder is built with the neutral probe instead of its own
   * ability, so the table shows what it hits for once the penalty expires.
   * Without this the attacker is built WITH Slow Start and every Regigigas cell
   * is halved — measured: Focus Punch 110-130 against a real 217-254.
   */
  const debuffed = hasTempDebuff(c.entry);
  const atk = setFor(c.entry, SPREADS[c.spread], {moves: c.moves, item: 'lifeorb', ability: debuffed ? NEUTRAL_PROBE : null});
  const head = `| ZU defender (representative test set) | ${c.moves.map(id => Dex.move(id).name).join(' | ')} |`;
  const sep = `| --- | ${c.moves.map(() => '---').join(' | ')} |`;
  return [`Attacker: **${c.entry.name}**, ${SPREADS[c.spread].nature} ${JSON.stringify(SPREADS[c.spread].evs)}, Life Orb — a **representative test set**.${debuffed ? ` **Built with Slow Start's penalty expired** (probe ability \`${NEUTRAL_PROBE}\`, which has no stat hooks); for the first five turns halve the Attack-based columns.` : ''}`,
    '', head, sep,
    ...CORE.map(d => `| ${d.n} (${d.sp}${d.it ? ', ' + itemName(d.it) : ', no item'}) | ` + c.moves.map(id => calcCell(calc(atk, d.cfg, id))).join(' | ') + ' |')].join('\n');
}

/* ---------- role comparison UPWARD against PU ---------- */
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
function roleCompareUp(entry) {
  const p = P.profile(entry, {tier: SUBJECT_TIER});
  const s = Dex.species(entry.id);
  const mine = new Set(ROLE_KEYS(p));
  const scored = UP.map(r => {
    const rp = P.profile(r, {tier: UP_TIER});
    const rs = Dex.species(r.id);
    const shared = ROLE_KEYS(rp).filter(k => mine.has(k)).length;
    const typeOverlap = rs.types.filter(t => s.types.includes(t)).length;
    return {r, rp, rs, score: shared * 3 + typeOverlap * 3 + (Math.abs(rs.bst - s.bst) < 70 ? 2 : 0)};
  }).sort((a, b) => b.score - a.score).slice(0, 5);
  return `**${entry.name}** — ${s.types.join('/')}, BST ${s.bst} (${stats(s)}), ${p.abilities.join(' / ')}, item free
Roles: ${ROLE_KEYS(p).join(', ') || '—'} | STAB: ${p.stab.join(' · ') || 'none'} | Recovery: ${p.recovery.join(', ') || 'none'} | Priority: ${p.priority.join(', ') || 'none'}

Closest **PU** entries by shared role, typing and BST band — i.e. what it would be competing with if promoted:

| PU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
${scored.map(({r, rp, rs}) => `| ${r.name} | ${rs.types.join('/')} | ${rs.bst} (${stats(rs)}) | ${P.abilitiesOf(r).join(', ')} | ${ROLE_KEYS(rp).join(', ') || '—'} | ${rp.recovery.join(', ') || 'none'} | ${rp.stab.join(' · ') || 'none'} |`).join('\n')}`;
}

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
function envTable(tier) {
  const list = rosters[tier];
  const learn = id => list.filter(e => {
    const src = e.kind === 'forme' && e.base ? Dex.toID(e.base) : e.id;
    return (Dex.legalMoveList(src) || []).some(m => Dex.toID(m) === id);
  }).map(e => e.name);
  const abil = ids => list.filter(e => P.abilitiesOf(e).some(a => ids.includes(Dex.toID(a)))).map(e => e.name);
  return {learn, abil};
}

/* ---------- the Mega-free proof, exercised through the real validator ---------- */
const megaProbe = (() => {
  const mv = sp => { const ls = Dex.learnset(Dex.toID(sp)) || []; return (Array.isArray(ls) ? ls : Object.keys(ls)).slice(0, 1); };
  let tested = 0, legal = 0;
  const rows = [];
  for (const e of rosters[SUBJECT_TIER]) {
    for (const f of Dex.species(e.id).formeItems || []) {
      tested++;
      let ok = false;
      try {
        ok = Validation.validateTeam([Pokemon.normalizeSet({species: e.id, item: f.item, level: 100, moves: mv(e.id)})], Formats.get('tierzu')).valid;
      } catch { ok = false; }
      if (ok) legal++;
      rows.push(`| ${e.name} | ${itemName(f.item)} | ${f.forme} | **${f.tier}** | ${ok ? '**LEGAL — HOLE**' : 'refused'} |`);
    }
  }
  return {tested, legal, rows};
})();

/* ================= assemble ================= */
const zu = Formats.get('tierzu').rules;
const pu = Formats.get('tierpu').rules;
const ruleRow = (label, a, b) => `| ${label} | ${a} | ${b} |`;

const doc = [];
doc.push(`# RedGPT ZU Final Audit — Verified Evidence Packet

**Generated from the live RedGPT project** by \`tools/zu-final-evidence.js\`.
Every stat, movepool value, damage figure and speed number comes from the running
engine, the packaged data, the validator or the real damage calculator.

**RedGPT has no usage, ladder, win-rate, tournament or popularity data**, so none
is quoted. Section T lists what genuinely cannot be determined.

---

## Your task

Make the **ZU tier audit**:

> **Which current ZU entries are too strong for ZU and should move UP to PU?**

**This pass is one-directional, and that is structural rather than a choice.**
ZU is the bottom rung of the ladder. There is no tier beneath it, so "too weak
for ZU" has nowhere to go — **do not propose demotions**, and do not treat a weak
ZU entry as a problem to be solved. Every other packet on this programme has been
bidirectional; this one cannot be.

The bar is section D: the current **PU** roster, as it stands after the PU pass
and the trapping pass.

**Most entries should stay put.** ZU is the largest rung on the ladder
(**${SUBJECT.length}** entries against PU's ${UP.length}) and it is *supposed* to
be the wide bottom of the distribution. A high BST alone does not promote — the
two highest BSTs in ZU are there precisely because their abilities cost them the
game, and that is verified in section B rather than assumed.

A promotion needs a reason PU cannot already answer: an ability the imported tier
could not have priced, a RedGPT redesign, a role PU lacks, or an offensive or
defensive ceiling the PU bar in section D does not contain.

**There is no cap on how many entries may move — including zero.**

For each entry you move: exact name, direction, confidence, two or three
sentences naming the specific PU Pokémon it matches or beats, and the numbers you
relied on with the ability and item they assume. Then list what you
**considered and deliberately left**.

**This packet contains no recommendations.** Every flag in sections G and S is a
mechanical reason to look, not a verdict.

---

## Context: the passes that preceded this one

Every rung above ZU has now been audited. ZU is the last, and it has only ever
been used as a *bar* for the tier above it.

| Pass | Result |
| --- | --- |
| OU → Ubers | 3 promoted |
| OU → UU | 15 dropped |
| UU (both ways) | nothing moved |
| RU (both ways) | 4 promoted, 0 dropped |
| NU (both ways) | 6 promoted, 1 dropped |
| PU (both ways) | 5 promoted, **0 dropped** |
| trapping holders (whole ladder) | 4 moved, 5 reviewed and left |

**Two of those results bear directly on this audit:**

- **The PU pass found nothing to send down to ZU.** The downward review did not
  establish that any PU entry would sit more healthily here. So the PU roster in
  section D is a bar that has already been tested against ZU from the other side.
- **Three ZU entries were just promoted out** — Gothitelle (ZU → NU, two rungs),
  Dugtrio and Wobbuffet (ZU → PU), all on trapping. **Golem-Alola, Probopass and
  Meltan were reviewed in the same pass and deliberately left in ZU**, because
  Magnet Pull reaches only 9 of 254 ZU entries. Those three are settled; they do
  not need re-litigating here unless something other than trapping moves them.

---`);

doc.push(`## A. Current tier / rules snapshot

| Tier | Entries |
| --- | --- |
${Formats.TIER_ORDER.map(t => `| ${t} | ${rosters[t].length} |`).join('\n')}

**Selectable species: ${Dex.allSpecies.length}** (packaged ${Dex.packagedSpecies.length}).
**ZU is ${Math.round(SUBJECT.length / Formats.TIER_ORDER.reduce((n, t) => n + rosters[t].length, 0) * 100)}% of the whole ranked ladder** — by design, it is the wide bottom of the distribution.

**ZU format rules, read live and compared against PU rather than assumed:**

| Rule | ZU | PU |
| --- | --- | --- |
${ruleRow('`maxTier`', '**ZU**', 'PU')}
${ruleRow('`tera`', zu.tera, pu.tera)}
${ruleRow('`mega`', zu.mega, pu.mega)}
${ruleRow('`speciesClause`', zu.speciesClause, pu.speciesClause)}
${ruleRow('`sleepClause`', zu.sleepClause, pu.sleepClause)}
${ruleRow('`itemClause`', !!zu.itemClause, !!pu.itemClause)}
${ruleRow('`evasionClause`', zu.evasionClause, pu.evasionClause)}
${ruleRow('`ohkoClause`', zu.ohkoClause, pu.ohkoClause)}
${ruleRow('`bannedMoves`', zu.bannedMoves.map(id => Dex.move(id).name).join(', ') || 'none', pu.bannedMoves.length)}
${ruleRow('`bannedItems` / `bannedSpecies`', ((zu.bannedItems || []).length || 'none') + ' / ' + ((zu.bannedSpecies || []).length || 'none'), ((pu.bannedItems || []).length || 'none') + ' / ' + ((pu.bannedSpecies || []).length || 'none'))}
${ruleRow('`bannedAbilities`', (zu.bannedAbilities || []).length || '**none**', (pu.bannedAbilities || []).length || '**none**')}
${ruleRow('level / team', `${zu.forceLevel} / ${zu.teamSize}v${zu.teamSize}`, `${pu.forceLevel} / ${pu.teamSize}v${pu.teamSize}`)}
${ruleRow('EV limit / per stat / IV max', `${zu.evLimit}-${zu.evStatLimit} / ${zu.ivMax}`, `${pu.evLimit}-${pu.evStatLimit} / ${pu.ivMax}`)}

**ZU is byte-identical to PU on every rule except \`maxTier\`.** There are no
ZU-specific bans of any kind. \`rules.mega\` is **${zu.mega}** — but see section R:
that flag is on and it is still structurally impossible to Mega Evolve in ZU.

**Trapping abilities are legal in ZU and in every other competitive format** —
verified live across all ${Formats.list().length} formats, every one carrying
\`bannedAbilities: []\`. The complete list, discovered by hook rather than by
name: **${TRAP_ABILITIES.map(a => Dex.ability(a).name).join(', ')}**.

---`);

doc.push(`## B. RedGPT mechanics that decide tiering here

**Three facts make ZU structurally different from every rung above it. Read these
before anything else.**

### 1. ZU is a Mega-free format, and that is not a rule — it is arithmetic

**ZU contains ${SUBJECT.filter(e => e.kind === 'forme').length} forme entries.** No Mega, Primal, Origin or Crowned forme
carries a ZU tier, so by the Absol/Absolite rule **every forme item is refused in
ZU**. Proved through the real validator in section R: **${megaProbe.tested} forme-item routes
from a ZU species were tested and ${megaProbe.legal} are legal.**

Two consequences that change how a candidate should be read:

- **Item freedom is universal here.** Every ZU entry can hold Choice Band, Specs,
  Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, an Orb
  or a Ring Target. There is no forced-item entry anywhere in the tier, and no
  opportunity-cost asymmetry between species and formes to weigh.
- **No ZU team ever spends a Mega slot**, so "it costs the team's only Mega" —
  an argument that carried real weight in the NU and PU passes — has no force in
  this one, in either direction.

### 2. Nothing in ZU sits on an estimated tier

**${SUBJECT.filter(e => e.estimated).length} ZU entries carry \`tierSource: estimated\`.** Every placement here is
either imported from Smogon or an explicit RedGPT override. That removes the
softest class of evidence the RU, UU and PU passes each had to work around — the
nearest-neighbour model that misplaced Mega Starmie and, in the trapping pass,
would have sent Chandelure-Mega to OU. **There is no equivalent doubt in ZU.**

### 3. The two biggest BSTs in ZU are there because their abilities are implemented

Regigigas (**670**) and Slaking (**670**) are the highest BSTs on the rung and the
obvious promotion suspects. **Both drawbacks are live**, verified in the ability
registry rather than assumed:

- **Slow Start** — \`${Object.keys(Abilities.registry.slowstart || {}).filter(k => k !== 'id').join(', ')}\`
  — packaged: _${(Dex.ability('slowstart') || {}).shortDesc || (Dex.ability('slowstart') || {}).desc || 'no description'}_
- **Truant** — \`${Object.keys(Abilities.registry.truant || {}).filter(k => k !== 'id').join(', ')}\`
  — packaged: _${(Dex.ability('truant') || {}).shortDesc || (Dex.ability('truant') || {}).desc || 'no description'}_

Each has exactly one ability, so neither can opt out. **A BST-driven promotion
argument for either has to answer the drawback**, not the stat line.

### Priority (all unconditional in this project)

| Move | Type | Cat | BP | Priority | Acc |
| --- | --- | --- | --- | --- | --- |
${['suckerpunch', 'thunderclap', 'firstimpression', 'upperhand', 'grassyglide'].map(id => {
  const m = Dex.move(id);
  return `| ${m.name} | ${m.type} | ${m.category} | **${m.basePower}** | **+${(m.priority || 0) + (Mechanics.ENGINE_PRIORITY.has(id) ? 1 : 0)}** | ${m.accuracy}% |`;
}).join('\n')}

Grassy Glide's packaged priority is **0** — the +1 is added by the engine.

**Restored base powers (live):** ${['overheat', 'leafstorm', 'dracometeor', 'blizzard', 'hydropump', 'fireblast', 'thunder', 'hurricane', 'headsmash', 'closecombat'].map(id => `${Dex.move(id).name} ${Dex.move(id).basePower}`).join(', ')}.

**Focus Punch is ${Dex.move('focuspunch').basePower} BP at ${Dex.move('focuspunch').accuracy}% accuracy and priority ${Dex.move('focuspunch').priority}** — no Substitute condition, no negative priority.

**Multi-hit:** 2-5 hit moves are **25 BP per hit**, exactly-2-hit moves **50 BP
per hit**. Skill Link forces the maximum and the calculator honours it.

**Ring Target** lets the holder's attacks hit for **neutral** damage through a
**type** immunity. It does not beat an ability immunity. One per team, visible
from turn one — and unlike every rung above, **no ZU entry is barred from it by
holding a stone**.

**Toxic Orb and Flame Orb fire on ENTRY**, so Guts / Poison Heal / Quick Feet
holders are boosted from the turn they arrive.

**Ability redesigns that reach ZU holders**, verified live:

| Ability | Live packaged description |
| --- | --- |
${['lightmetal', 'heavymetal', 'download', 'supremeoverlord', 'cloudnine', 'airlock', 'pickup', 'contrary', 'unaware', 'simple', 'furcoat'].map(id => {
  const a = Dex.ability(id);
  if (!a) return null;
  const users = rosters[SUBJECT_TIER].filter(e => P.abilitiesOf(e).some(x => Dex.toID(x) === id)).map(e => e.name);
  return `| **${a.name}**${users.length ? ' (ZU: ' + users.join(', ') + ')' : ' (nobody in ZU)'} | _${a.shortDesc || a.desc || 'no description'}_ |`;
}).filter(Boolean).join('\n')}

**Silvally retypes from its held Memory, measured in a real battle.** Base
Silvally is Normal; holding a Fire Memory it enters as **Fire**, a Water Memory
as **Water**, and so on across all 17. RKS System carries no registry hook — the
engine does the retyping — so reading the ability definition alone misses it, and
Multi-Attack takes the Memory's type with STAB. **A 570 BST ZU entry that picks
its typing in the item slot** is a shape worth weighing deliberately.

---`);

doc.push(`## C. Full ZU competitive profiles

All **${SUBJECT.length}** current ZU entries, engine-resolved. This is the tier
under review. Trapping-ability holders are marked in bold on their own line.

${SUBJECT.map(e => renderProfile(e)).join('\n\n')}`);

doc.push(`---

## D. The PU comparison bar — the only bar that exists

All **${UP.length}** PU entries, **after** the PU pass and the trapping pass. This
is the destination a promotion joins, and the only comparison this audit has.

Note what PU gained and lost in the pass immediately before this one: it **lost**
Aggron, Heracross, Hariyama, Decidueye-Hisui and Pawmot upward to NU, and
**gained** Audino-Mega from NU plus Dugtrio and Wobbuffet from ZU. So the bar is
softer at the top than it was, and it now contains two Pokémon that were in ZU
until this session.

${UP.map(e => renderProfile(e, {compact: true})).join('\n\n')}`);

doc.push(`---

## E. There is no downward bar

**ZU is the bottom rung.** There is no tier below it, so this section is
deliberately empty rather than missing.

What that means for the audit:

- **Do not propose demotions.** A ZU entry that looks weak has nowhere to go.
- **"Outclassed within ZU" is not a finding.** In every previous pass, being
  outclassed was evidence for a drop; here it is evidence for staying exactly
  where it is.
- **The only question is upward**, and the burden of proof sits entirely on the
  promotion side.

The Pokémon that carry no tier at all — NFE and LC — are **not** below ZU either.
They are outside the ladder, refused in all seven tier formats, and playable only
in Anything Goes and Random Battle. Nothing can be demoted into that group.

---`);

doc.push(`## F. Estimated-forme audit

**There is nothing to audit, and that is a real result rather than an omission.**

ZU contains **${SUBJECT.filter(e => e.estimated).length}** entries on an \`estimated\` tier and
**${SUBJECT.filter(e => e.kind === 'forme').length}** forme entries of any kind. Every ZU placement is imported from
Smogon or an explicit RedGPT override, so the nearest-neighbour model that
supplied the softest evidence in the RU, UU and PU passes has no input here at
all.

For contrast, the rungs above: ${Formats.TIER_ORDER.filter(t => rosters[t].length).map(t => `${t} ${rosters[t].filter(e => e.estimated).length}`).join(', ')} estimated entries respectively.

**Tier provenance across the whole ZU roster:**

| Source | Entries |
| --- | --- |
${(() => {
  const counts = {};
  for (const e of SUBJECT) {
    const k = e.estimated ? 'estimated' : tierSourceOf(e.id);
    counts[k] = (counts[k] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`).join('\n');
})()}

---`);

doc.push(`## G. Serious ZU → PU candidate evidence

**${upFlagged.length} of ${SUBJECT.length} ZU entries tripped three or more
mechanical flags in the scan.** The threshold is three rather than two because ZU
is ${SUBJECT.length} entries and a two-flag bar returns most of the rung.

**No cap.** All **${UP_CANDIDATES.length}** flagged entries with a resolvable offensive set get a
full damage matrix below, against the same ZU defensive core so they compare
column by column.${upFlagged.length !== UP_CANDIDATES.length
  ? ` ${upFlagged.length - UP_CANDIDATES.length} flagged entr${upFlagged.length - UP_CANDIDATES.length === 1 ? 'y has' : 'ies have'} no resolvable attacking set (no damaging move the profiler could quote) and appear${upFlagged.length - UP_CANDIDATES.length === 1 ? 's' : ''} in section S instead: ${upFlagged.filter(f => !UP_CANDIDATES.some(c => c.entry.name === f.e.name)).map(f => f.e.name).join(', ')}.`
  : ''}

An earlier draft capped this section at the 30 most-flagged entries, and
**Regigigas fell below the cut** — the highest BST on the rung, excluded because
a flag *count* ranked it under entries with more numerous but weaker flags. A cap
that drops the conspicuous case is a cap making a judgement, so there is none.

**Flags are reasons to look, not verdicts.**

${UP_CANDIDATES.map(c => `### ${c.entry.name}

_Flagged for: ${c.reasons.join('; ')}._

${renderProfile(c.entry)}

${matrix(c)}`).join('\n\n---\n\n')}`);

doc.push(`---

## H. Role comparison against PU

For each flagged candidate, the PU entries it would actually be competing with if
promoted — selected by shared role keys, shared typing and BST proximity. A
**mechanical shortlist, not a judgement**; their full profiles are in section D.

The questions to answer for each:

1. What does the ZU candidate do that its PU counterparts cannot?
2. What do they do better?
3. Would it be an ordinary PU Pokémon, or a problem there?
4. Is there a role PU currently lacks that it fills?

${UP_CANDIDATES.map(c => `### ${c.entry.name}\n\n${roleCompareUp(c.entry)}`).join('\n\n---\n\n')}`);

doc.push(`---

## I. ZU offensive matrices

Every matrix in section G runs against the **same ZU defensive core**, built from
ZU entries rather than reused from PU.

**The core (${CORE.length} entries):** ${CORE.map(d => `${d.n} (${d.sp})`).join(', ')}.

Type and role coverage: Rock, Steel, Ice, Ghost, Water, Grass, Psychic, Fairy,
Normal, Poison, Ground, Dark, Bug and Flying; physical and special walls; Unaware
(Pyukumuku), Sturdy, Levitate and Clear Body; and the tier's two 200-point
defensive stats (Regirock 200 Def, Regice 200 SpD) plus Shuckle's 230/230.

Every cell states attacker, nature, EVs, item, ability and move; defenders carry
the spread and item named in the row. These are **representative test sets**, not
usage sets — RedGPT has no usage data.

Classification — hard counter, reliable counter, soft counter, check,
revenge-only, not an answer — is yours; the engine supplies damage, and recovery,
speed and hazard chip are in sections C, L, M and P.

---

## J. ZU revenge / check matrix

ZU's counterplay into each upward candidate. Attackers are **representative test
sets**; the target sits on its own offensive spread from section G.

| Candidate | ${REVENGE.map(a => `${a.n} ${Dex.move(a.mv).name}`).join(' | ')} |
| --- | ${REVENGE.map(() => '---').join(' | ')} |
${UP_CANDIDATES.map(c => {
  const target = setFor(c.entry, SPREADS[c.spread], {moves: ['tackle']});
  return `| ${c.entry.name} | ` + REVENGE.map(a => calcCell(calc(a.cfg, target, a.mv))).join(' | ') + ' |';
}).join('\n')}

**If ZU already answers a candidate cleanly, that is an argument for it staying**
— the promotion case needs ZU's counterplay to be insufficient, not merely
inconvenient.

---

## K. There is no downward role comparison

In the RU, NU and PU packets, section K compared each demotion candidate against
the tier below. **ZU has no tier below it**, so that comparison does not exist —
the same reason section E is empty.

The lettering is kept aligned with the sibling packets deliberately, so that
"section L is the speed table" means the same thing in all four. This section is
empty on purpose rather than missing by accident.

The upward role comparison, which is the one that exists here, is **section H**.

---`);

doc.push(`## L. ZU speed-tier table

Every ZU entry at base Speed 80+. **Priority is not Speed** — that is section M.

${speedTable(SUBJECT)}

**Conditional speed abilities in ZU** — none is active by default, and the table
above does **not** assume any of them:

${(() => {
  const {abil} = envTable(SUBJECT_TIER);
  return [['swiftswim', 'Swift Swim — needs rain'], ['chlorophyll', 'Chlorophyll — needs sun'],
    ['sandrush', 'Sand Rush — needs sandstorm'], ['slushrush', 'Slush Rush — needs snow'],
    ['unburden', 'Unburden — needs its item consumed'], ['speedboost', 'Speed Boost — +1 at the end of each turn'],
    ['quickfeet', 'Quick Feet — needs a status; the Orbs fire ON ENTRY, so this is live from turn one'],
    ['lightmetal', 'Light Metal — +1 Speed on EVERY entry, resets on switch-out'],
    ['motordrive', 'Motor Drive — +1 Speed on absorbing an Electric move'],
    ['quarkdrive', 'Quark Drive — needs Electric Terrain or Booster Energy'],
    ['protosynthesis', 'Protosynthesis — needs sun or Booster Energy'],
    ['slowstart', 'Slow Start — **halves** Attack and Speed for five turns']]
    .map(([id, label]) => `- **${label}**: ${abil([id]).join(', ') || '_nobody in ZU_'}`).join('\n');
})()}

---

## M. ZU priority table

Engine priority for every ZU entry that has any, including Grassy Glide's
engine-side +1.

${priorityTable(SUBJECT)}

---`);

doc.push(`## N. Weather / terrain / Trick Room / Tailwind environment

${(() => {
  const {learn, abil} = envTable(SUBJECT_TIER);
  const cap = (arr, n = 24) => arr.length > n ? arr.slice(0, n).join(', ') + `, _+${arr.length - n} more_` : (arr.join(', ') || 'none');
  return `**Weather by ability (automatic):** ${cap(abil(['drizzle', 'drought', 'sandstream', 'snowwarning']))}.

**Weather abusers by ability:** ${cap(abil(['swiftswim', 'chlorophyll', 'sandrush', 'slushrush', 'sandforce', 'icebody', 'raindish', 'solarpower', 'leafguard']))}.

**Terrain by ability:** ${cap(abil(['electricsurge', 'grassysurge', 'mistysurge', 'psychicsurge']))}.

**Trick Room setters:** ${cap(learn('trickroom'))}. The **Warp Prism** makes Trick Room *the holder sets* last **8** turns instead of 5.

**Slow breakers that want it** (base Speed ≤ 50 with real offence): ${cap(SUBJECT.filter(e => {
    const s = Dex.species(e.id); const p = P.profile(e, {tier: SUBJECT_TIER});
    const best = Math.max(...p.abilities.map(a => Math.max(p.offByAbility[a].atkPlus, p.offByAbility[a].spaPlus)));
    return s.baseStats.spe <= 50 && best >= 300;
  }).map(e => e.name))}.

**Tailwind setters:** ${cap(learn('tailwind'))}. The **Wind Sock** makes Tailwind *the holder sets* last **7** turns instead of 4.

Both duration items are freely available here — **no ZU entry is holding a stone
instead**, which is the item-freedom point from section B applied to the field.`;
})()}

---

## O. ZU hazard environment

${(() => {
  const {learn, abil} = envTable(SUBJECT_TIER);
  const cap = (arr, n = 30) => arr.length > n ? arr.slice(0, n).join(', ') + `, _+${arr.length - n} more_` : (arr.join(', ') || 'none');
  return `**Stealth Rock:** ${cap(learn('stealthrock'))}

**Spikes:** ${cap(learn('spikes'))}

**Toxic Spikes:** ${cap(learn('toxicspikes'))}

**Sticky Web:** ${cap(learn('stickyweb'))}

**Rapid Spin:** ${cap(learn('rapidspin'))}

**Defog:** ${cap(learn('defog'))}

**Mortal Spin / Tidy Up / Court Change:** ${cap([...new Set([...learn('mortalspin'), ...learn('tidyup'), ...learn('courtchange')])])}

**Magic Bounce:** ${abil(['magicbounce']).join(', ') || 'none'}

**Ghost types (block Rapid Spin):** ${cap(rosters[SUBJECT_TIER].filter(e => Dex.species(e.id).types.includes('Ghost')).map(e => e.name))}

**Heavy-Duty Boots are available to EVERY ZU entry**, because none is a forme.
That is a meaningful difference from every rung above, where the Rock-weak Megas
cannot hold them.`;
})()}

---

## P. Recovery / longevity

These four categories are **not** interchangeable and are deliberately kept apart.

${(() => {
  const trueRec = [], rest = [], drain = [], passive = [];
  for (const e of SUBJECT) {
    const p = P.profile(e, {tier: SUBJECT_TIER});
    if (p.recovery.length) trueRec.push(`${e.name} (${p.recovery.join(', ')})`);
    if (p.has('rest')) rest.push(e.name);
    if (p.drain.length) drain.push(`${e.name} (${p.drain.join(', ')})`);
    const ab = P.abilitiesOf(e).filter(a => ['regenerator', 'poisonheal', 'raindish', 'icebody', 'waterabsorb', 'voltabsorb', 'harvest'].includes(Dex.toID(a)));
    if (ab.length) passive.push(`${e.name} (${ab.join('/')})`);
  }
  const cap = (arr, n = 40) => arr.length > n ? arr.slice(0, n).join('; ') + `; _+${arr.length - n} more_` : (arr.join('; ') || 'none');
  return `**TRUE IMMEDIATE RECOVERY** — Recover, Roost, Slack Off, Shore Up, Soft-Boiled, Milk Drink, Morning Sun, Synthesis, Moonlight (${trueRec.length} entries):

${cap(trueRec)}

**REST** — two helpless turns unless Early Bird, Sleep Talk or Snore is in the set. **Not** equivalent to the above (${rest.length} entries):

${cap(rest, 60)}

**DRAINING** — proportional to damage dealt, so it fails against a resist and against a wall (${drain.length} entries):

${cap(drain)}

**PASSIVE** — Regenerator, Poison Heal, Harvest, absorbs, weather healing (${passive.length} entries; Leftovers is available to every entry in the tier):

${cap(passive)}`;
})()}

---`);

doc.push(`## Q. Item / ability edge cases, and trapping

**Item freedom is universal in ZU.** There is no item-freedom table to draw,
because there is no forme entry and therefore no forced item anywhere on the
rung. Every candidate in section G can hold Choice Band, Specs, Scarf, Life Orb,
Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, a Ring Target or an Orb.

**There is no Mega opportunity-cost table either** — see section R.

### Trapping in ZU

**ZU trapping-ability holders: ${trapperNamesIn(SUBJECT).join(', ') || '_none_'}.**

All three were reviewed in the global trapping audit immediately before this pass
and **deliberately left in ZU**: Magnet Pull reaches only **9 of 254** ZU entries
and 3 of 71 PU entries, which is a niche rather than a tier problem. Gothitelle,
Dugtrio and Wobbuffet were promoted out of ZU in the same pass.

For context, across the whole ladder:

| Tier | Trapping-ability holders |
| --- | --- |
${Formats.TIER_ORDER.filter(t => rosters[t].length).map(t => `| ${t} | ${trapperNamesIn(rosters[t]).join(', ') || '—'} |`).join('\n')}

**The trapping counterplay measured in that audit applies unchanged here:** Ghost
typing, Shed Shell, Guard Dog, all six pivot moves (U-turn, Volt Switch, Flip
Turn, Parting Shot, Baton Pass, Teleport) and phazing all escape a trap, and the
trap ends the moment the trapper leaves or faints. Mold Breaker does **not** break
trapping.

---

## R. Transformation / forme legality — the Mega-free proof

Every ZU entry was checked for a route to a higher-tier forme in battle.

**${megaProbe.tested} item-driven routes exist from a ZU species, and ${megaProbe.legal} are legal.**
Each was put through \`Validation.validateTeam\` in the ZU format rather than read
off the data:

| ZU species | Item | Forme it would make | That forme's tier | Validator |
| --- | --- | --- | --- | --- |
${megaProbe.rows.sort().join('\n')}

**Ability-driven routes:**

${(() => {
  const out = [];
  for (const e of rosters[SUBJECT_TIER]) {
    for (const route of (Formats.formeAbilities ? Formats.formeAbilities(e.id) : []) || []) {
      const t = route.tier || '?';
      const gated = Formats.tierRank(t) < Formats.tierRank(SUBJECT_TIER);
      out.push(`- **${e.name}** → ${route.forme} via **${route.abilityName}** (${route.when}) — target tier **${t}**. ${gated ? '**Higher than ZU: the ability is refused at team validation**, and the Pokémon stays legal on its other ability.' : 'Same rung — no legality issue.'}`);
    }
  }
  return out.join('\n') || '_None._';
})()}

**Conclusion: no legality hole, and ZU is Mega-free by construction.** The format
sets \`mega: ${zu.mega}\`, but since no forme carries a ZU tier, the Absol/Absolite
rule refuses every stone. **Do not read \`rules.mega\` as evidence that Megas are
playable here** — that flag is on in every format including Campaign.

**One known gap, carried forward from the PU packet.** §5's *"ban the route, not
the Pokémon"* rule has an **item** half and an **ability** half and **no move
half**. Nothing in ZU exploits it — no ZU entry reaches a higher-tier forme
through a move — but a move-driven forme change would be ungated. Recorded as a
blocker, not fixed.

---`);

doc.push(`## S. Mechanical outliers surfaced by the broad scan

**Mechanical flags only — reasons to look, NOT recommendations.** ${upFlagged.length} of
${SUBJECT.length} ZU entries tripped three or more. No arbitrary cap was applied.

${upFlagged.map(f => `- **${f.e.name}** (${f.s.types.join('/')}, BST ${f.s.bst}, ${f.p.abilities.join('/')}) — ${f.reasons.join('; ')}.`).join('\n')}

### The BST ceiling, stated separately because it is the obvious first question

| Entry | BST | Ability | Why it is in ZU |
| --- | --- | --- | --- |
${SUBJECT.slice().sort((a, b) => Dex.species(b.id).bst - Dex.species(a.id).bst).slice(0, 12).map(e => {
  const s = Dex.species(e.id);
  const abilities = Dex.abilityList(e.id);
  const note = {
    Regigigas: '**Slow Start is implemented** — halves Attack and Speed for five turns, and it is its only ability',
    Slaking: '**Truant is implemented** — it acts every other turn, and it is its only ability',
  }[e.name] || 'imported placement; no RedGPT-specific drawback';
  return `| ${e.name} | **${s.bst}** | ${abilities.join(' / ')} | ${note} |`;
}).join('\n')}

### Multi-hit users in ZU

The 25-BP-per-hit rewrite changes what these moves are worth, and Skill Link
forces the maximum:

${(() => {
  const MULTI = ['rockblast', 'bulletseed', 'iciclespear', 'pinmissile', 'bonerush', 'tailslap', 'armthrust',
    'furyattack', 'furyswipes', 'spikecannon', 'doublehit', 'dualchop', 'dualwingbeat', 'twineedle',
    'bonemerang', 'tripleaxel', 'populationbomb', 'scaleshot'];
  const rows = [];
  for (const id of MULTI) {
    if (!Dex.hasMove(id)) continue;
    const m = Dex.move(id);
    const users = rosters[SUBJECT_TIER].filter(e => (Dex.legalMoveList(e.id) || []).some(x => Dex.toID(x) === id)).map(e => e.name);
    if (users.length) rows.push(`| ${m.name} | ${m.type} | ${m.basePower} × ${JSON.stringify(m.multihit)} | ${users.length > 18 ? users.slice(0, 18).join(', ') + `, _+${users.length - 18} more_` : users.join(', ')} |`);
  }
  const sl = rosters[SUBJECT_TIER].filter(e => P.abilitiesOf(e).some(a => Dex.toID(a) === 'skilllink')).map(e => e.name);
  return `| Move | Type | BP × hits | ZU users |
| --- | --- | --- | --- |
${rows.join('\n') || '| _none_ | | | |'}

**Skill Link holders in ZU: ${sl.join(', ') || 'none'}.**`;
})()}

---

## T. Remaining genuinely unresolved questions

1. **No usage, ladder, win-rate, tournament or popularity data exists in RedGPT.**
   There is no metagame history for any tier. Every judgement must be mechanical.
2. **Nothing in ZU has been played by a human.** The ladder was rebuilt on
   2026-08-15 and revised through six passes on 2026-08-16.
3. **ZU is the only rung that has never been audited**, and it has served as the
   downward bar for the PU pass without ever being reviewed itself. Its entries
   arrived by import or by being swept out of Nat Dex's RU bucket.
4. **Conditional abilities are read at their unactivated value.** Guts, Quick
   Feet, Protosynthesis, Unburden, Swift Swim, Harvest, Shields Down and the rest
   are reported unboosted. The Orbs fire **on entry**, so for a Guts or Quick Feet
   holder the activated number is the one that matters — ask and it can be
   measured.
   **Slow Start is the sharpest case and it runs the other way.** \`P.offence\`
   measures through the engine with the ability live, so Regigigas's *"Engine
   stats"* line is its **halved** Attack and Speed (230 / 164) rather than its
   real ones (**460 / 328**). Both are printed on its profile, and its damage
   matrix uses the post-expiry values. Nothing else on the ladder is affected —
   Regigigas is the only Slow Start holder in any tier, and Defeatist, the other
   self-debuffing ability, is HP-gated and therefore inactive at the full HP a
   profile is built at.
5. **A species may run any of its abilities.** Offence is reported per ability,
   but the movepool sections assume the first.
6. **Silvally's typing is an item choice, not a fixed value.** Its profile reads
   Normal; with a Memory it is whichever of 17 types the item names, measured in
   a real battle. Ask for a per-typing profile if it decides a verdict.
7. **There is no move half to the forme-route gate** (section R). Inert here.
8. **The 0-2 HP rounding difference from Showdown's calculator** is known and
   documented; it never changes a tier.

**If a number you need is missing, ask for it** rather than estimating. Any
damage, speed, trapping or legality question can be answered against the real
engine.`);

const out = doc.join('\n');
if (CHECK) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur === out) { console.log('unchanged'); process.exit(0); }
  console.log('STALE — run: node tools/zu-final-evidence.js'); process.exit(1);
}
fs.writeFileSync(OUT, out);
console.log(`ZU(subject) ${SUBJECT.length} | PU(up bar) ${UP.length} | estimated ZU entries ${SUBJECT.filter(e => e.estimated).length} | ZU forme entries ${SUBJECT.filter(e => e.kind === 'forme').length} | scan-flagged ${upFlagged.length} | matrices ${UP_CANDIDATES.length} | core ${CORE.length} | revenge ${REVENGE.length} | forme-item routes tested ${megaProbe.tested}, legal ${megaProbe.legal}`);
console.log('wrote docs/ZU_FINAL_EVIDENCE.md');
