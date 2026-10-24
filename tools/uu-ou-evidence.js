#!/usr/bin/env node
/*
 * Generate `docs/UU_OU_EVIDENCE.md` — one packet carrying TWO separate audits.
 *
 *   Part I  — the UU -> OU pass. Which UU entries are too strong for UU?
 *   Part II — Meloetta / Meloetta-Pirouette, now that Relic Song reaches the
 *             forme. Is RU the right rung for Pirouette, and NU for Meloetta?
 *
 * **Part I is ONE-DIRECTIONAL, and that is a scoping decision rather than a
 * structural fact.** Unlike the ZU packet — where "too weak for ZU" had nowhere
 * to go — UU has a tier beneath it. The downward half was run separately
 * (`UU_FINAL_EVIDENCE.md`, both directions, verdict "move nothing"), and
 * PROJECT_CONTEXT §10 records the reason it stays separate: *a downward pass and
 * an upward pass on the same rung at the same time cannot be attributed to
 * either*. So the packet asks for promotions only, and says so in as many words.
 *
 * **Part II is not a rung audit at all.** It is one Pokemon, two formes and one
 * move, and the only thing the Pirouette tier decides is the rung from which
 * Relic Song is legal. Its sections carry an `M` prefix so they can never be
 * confused with the A-T lettering the sibling packets share.
 *
 * Roster variables are named for their ROLE (SUBJECT / UP / HOME / DOWN), never
 * for a tier — see the note in `pu-final-evidence.js` about the clone that kept
 * `RU/NU/UU` while binding them to something else.
 *
 *   node tools/uu-ou-evidence.js
 *   node tools/uu-ou-evidence.js --check
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {loadEngine} = require('../tests/helpers/engine.js');
const {createProfiler} = require('./lib/profiler.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs/UU_OU_EVIDENCE.md');
const CHECK = process.argv.includes('--check');
const R = loadEngine();
const {Dex, Formats, Mechanics, Calculator, Pokemon, Validation, Abilities, Battle} = R;
const P = createProfiler(R);

const SUBJECT_TIER = 'UU', UP_TIER = 'OU';

const rosters = {};
for (const t of Formats.TIER_ORDER) rosters[t] = Formats.tierRoster(t);
const sorted = t => rosters[t].slice().sort((a, b) => a.name.localeCompare(b.name));
const SUBJECT = sorted(SUBJECT_TIER);        // UU — the tier under review
const UP = sorted(UP_TIER);                  // OU — the bar a promotion joins
const PIR_HOME = sorted('RU');               // Part II: where Pirouette sits
const PIR_DOWN = sorted('NU');               // Part II: where Meloetta sits

const all = [];
for (const t of Formats.TIER_ORDER) all.push(...rosters[t]);
const byName = n => all.find(e => e.name === n);
const itemName = id => (id && Dex.item(id) ? Dex.item(id).name : (id || '—'));
const stats = s => [s.baseStats.hp, s.baseStats.atk, s.baseStats.def, s.baseStats.spa, s.baseStats.spd, s.baseStats.spe].join('/');
const enforcedTier = e => Formats.TIER_ORDER.find(t => rosters[t].some(x => x.id === e.id && x.kind === e.kind)) || Dex.species(e.id).tier;
const tierSourceOf = id => {
  const s = Dex.species(id);
  const src = s.tierSource && s.tierSource.from ? s.tierSource.from : String(s.tierSource || '-');
  return src === 'redgpt-override' ? 'override' : src === 'estimated' ? 'estimated' : 'imported (' + src + ')';
};
const cap = (arr, n, join = ', ') => (arr.length > n ? arr.slice(0, n).join(join) + `, _+${arr.length - n} more_` : (arr.join(join) || 'none'));

/* ------------------------------------------------------------------ *
 * Conditional attacks — the fifth defect of the family, and the first
 * one whose scope is the WHOLE ladder rather than one Pokemon.
 *
 * `tools/lib/profiler.js` ranks a movepool by the power the engine will
 * deliver, which is right, and knows nothing about `moveSpecialFailure` —
 * the use-time gate that decides whether a move fires at all. So a
 * profile can quote a move that cannot be used on the turn it matters.
 *
 * **Last Resort is the sharp case**: 140 BP, Normal, and it FAILS until
 * every other move in the set has been used. Measured — a Meloetta
 * leading with it deals **0** and the log reads "But it failed!". It is
 * quoted as the Normal STAB of **Meloetta-Pirouette**, which is half of
 * this packet's subject, so shipping it unannotated was not an option.
 *
 * **Scope, measured across the whole ladder before deciding where to fix
 * it: 457 quoted lines across 387 entries** — Last Resort 154, Fake Out
 * 97, Belch 63, Steel Roller 46, Mirror Coat 40, Fling 37, Counter 14,
 * Snore 5, Endeavor 1. That is NOT the Slow Start shape the ZU packet
 * fixed locally (one holder, one document); it is a defect in the shared
 * profiler that reaches all five pinned sibling packets.
 *
 * **It is nonetheless corrected HERE and not in the shared profiler**,
 * for one reason: fixing it there rewrites the evidence behind five
 * completed audits, which is a decision for the project and not a side
 * effect of writing a new packet. Section T states the defect, its
 * measured scope, and that the sibling packets carry it uncorrected.
 *
 * The correction ANNOTATES rather than deletes. A conditional move is
 * still a real move — Last Resort genuinely fires on turn four — so
 * removing it would be the packet making a judgement. It is excluded
 * only from the auto-built attacking sets behind the damage matrices,
 * where a move that fails on turn one produces a column of zeros.
 * ------------------------------------------------------------------ */
const CONDITIONAL_ATTACKS = {
  fakeout: {why: 'only on the user’s first acting turn after switching in', when: () => true},
  snore: {why: 'fails unless the **user** is asleep', when: () => true},
  belch: {why: 'fails until the user has eaten a Berry', when: () => true},
  lastresort: {why: 'fails until **every other move in the set** has been used', when: () => true},
  fling: {why: 'fails with no removable item, and consumes it', when: () => true},
  spitup: {why: 'needs Stockpile', when: () => true},
  endeavor: {why: 'fails unless the target has more HP than the user', when: () => true},
  counter: {why: 'needs a **physical** hit taken from that target this turn', when: () => true},
  mirrorcoat: {why: 'needs a **special** hit taken from that target this turn', when: () => true},
  metalburst: {why: 'needs damage taken from that target this turn', when: () => true},
  comeuppance: {why: 'needs damage taken from that target this turn', when: () => true},
  steelroller: {why: 'fails with no terrain up', when: () => true},
  burnup: {why: 'the user must be a Fire type', when: s => !s.types.includes('Fire')},
  doubleshock: {why: 'the user must be an Electric type', when: s => !s.types.includes('Electric')},
  aurawheel: {why: 'Morpeko only', when: s => s.baseSpecies !== 'Morpeko'},
};
/*
 * Moves whose ENGINE behaviour differs from what the games would lead a reader
 * to assume, in the Pokémon's favour. Annotated but NOT excluded from a built
 * set, because they work — the annotation exists so a reader who knows the
 * games does not discount them.
 *
 * Skull Bash is the one that matters and it was found by reading a matrix:
 * it is **absent from `Mechanics.CHARGE_MOVES`** and the engine has no other
 * case for it, so it is an ordinary single-turn 130 BP physical move here.
 * Measured against a Blissey: **409 damage on the turn it is used.**
 */
const ENGINE_DIVERGENCE = {
  skullbash: 'single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge',
  dreameater: 'no sleep condition in RedGPT — it is an ordinary 100 BP draining move',
  poltergeist: 'no held-item condition in RedGPT',
  focuspunch: 'no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy',
  grassyglide: 'the engine adds **+1 priority**; the packaged move reads 0',
};

/*
 * Moves that do not FAIL but whose quoted power is a default rather than the
 * value they will actually deliver, plus the ones whose cost is not visible in
 * a power number at all. Split out from the conditional table because the
 * distinction matters to a reader: a conditional move may do nothing, whereas
 * these always do something — just not necessarily what the number says.
 *
 * `NEVER_IN_A_SET` is the subset excluded from the auto-built attacking sets.
 * The authority for that is the project's own `RandomTeams.AVOID`, not this
 * generator's opinion: a 250 BP Explosion would otherwise be picked as the top
 * Normal STAB of half the roster and every matrix built on it would describe a
 * turn that ends with the attacker dead.
 */
const POWER_CAVEATS = {
  assurance: 'doubles to 120 if the target has already taken damage this turn',
  avalanche: 'doubles to 120 if the user was hit first this turn',
  payback: 'doubles to 100 if the target has already moved',
  revenge: 'doubles to 120 if the user was hit first this turn',
  trumpcard: 'power rises as its PP falls; quoted at full PP',
  wringout: 'scales with the target’s **current** HP; quoted against a full-HP target',
  crushgrip: 'scales with the target’s **current** HP; quoted against a full-HP target',
  lastrespects: 'starts at 50 and gains +50 for every fallen ally',
  naturalgift: 'type and power come from the held Berry, which it consumes',
  beatup: 'one hit per healthy team member, off each of their Attack stats',
  psywave: 'fixed, random 0.5–1.5× the user’s level',
  sonicboom: 'fixed 20 damage whatever the matchup',
  dragonrage: 'fixed 40 damage whatever the matchup',
  endeavor: 'sets the target to the user’s own HP; fails if the target has less',
  razorwind: 'two-turn — it charges first (the profiler tags it `(charge)`)',
  skydrop: 'two-turn — it charges first',
  explosion: 'the user **faints**',
  selfdestruct: 'the user **faints**',
  finalgambit: 'deals the user’s current HP and the user **faints**',
  struggle: 'only reachable when no other move can be selected',
  bide: 'stores damage for two turns and returns double; deals nothing on use',
};
/** Excluded from the auto-built sets — on `RandomTeams.AVOID`'s authority. */
const NEVER_IN_A_SET = new Set(['explosion', 'selfdestruct', 'finalgambit', 'struggle', 'bide', 'razorwind', 'skydrop']);

const conditionalFor = species => Object.entries(CONDITIONAL_ATTACKS)
  .filter(([id, c]) => Dex.hasMove(id) && c.when(species))
  .map(([id, c]) => ({id, name: Dex.move(id).name, why: c.why, kind: 'conditional'}));
const powerCaveatsFor = () => Object.entries(POWER_CAVEATS)
  .filter(([id]) => Dex.hasMove(id))
  .map(([id, why]) => ({id, name: Dex.move(id).name, why, kind: 'power'}));
const divergenceFor = () => Object.entries(ENGINE_DIVERGENCE)
  .filter(([id]) => Dex.hasMove(id))
  .map(([id, why]) => ({id, name: Dex.move(id).name, why, kind: 'redgpt'}));

const quotes = (line, name) =>
  new RegExp(`(^|\\s)${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`).test(line);

const LABEL = {conditional: 'conditional — ', power: 'power — ', redgpt: 'RedGPT: '};
/** Append the use-time condition, power caveat or RedGPT divergence to a line. */
function annotate(lines, species) {
  const marks = [...conditionalFor(species), ...powerCaveatsFor(), ...divergenceFor()];
  return lines.map(l => {
    const hit = marks.find(c => quotes(l, c.name));
    return hit ? `${l} **[${LABEL[hit.kind]}${hit.why}]**` : l;
  });
}
/** True when a line quotes a move that must not go into an auto-built set. */
function isConditional(line, species) {
  return conditionalFor(species).some(c => quotes(line, c.name)) ||
    [...NEVER_IN_A_SET].some(id => Dex.hasMove(id) && quotes(line, Dex.move(id).name));
}

/*
 * RECONCILIATION against the project's OWN list, rather than trusting the hand
 * table above. `RandomTeams.AVOID` is declared as *"moves that are traps for a
 * generated set"* and is maintained — its comment records Poltergeist and Dream
 * Eater being REMOVED from it when this project removed their conditions. It is
 * not exported, so it is read out of the source with the match asserted; a
 * silent zero here would be the "control that never ran" shape §8 records.
 */
const AVOID_IDS = (() => {
  const src = fs.readFileSync(path.join(ROOT, 'src/arena/random-teams.js'), 'utf8');
  const m = /const AVOID = new Set\(\[([\s\S]*?)\]\);/.exec(src);
  if (!m) throw new Error('RandomTeams.AVOID could not be read — the anchor in random-teams.js moved');
  const ids = [...m[1].matchAll(/'([a-z0-9]+)'/g)].map(x => x[1]);
  if (ids.length < 50) throw new Error(`RandomTeams.AVOID parsed to only ${ids.length} ids — the anchor is wrong`);
  return ids;
})();
const AVOID_DAMAGING = AVOID_IDS.filter(id => Dex.hasMove(id) && Dex.move(id).category !== 'Status');
/** AVOID entries this packet quotes somewhere but does not annotate. */
function unannotatedAvoid(entries, tier) {
  const missed = new Set();
  const known = new Set([...Object.keys(CONDITIONAL_ATTACKS), ...Object.keys(POWER_CAVEATS), ...Object.keys(ENGINE_DIVERGENCE)]);
  for (const e of entries) {
    const p = P.profile(e, {tier: enforcedTier(e)});
    const lines = [...p.stab, ...p.physical, ...p.special, ...p.priority];
    for (const id of AVOID_DAMAGING) {
      if (known.has(id)) continue;
      if (lines.some(l => quotes(l, Dex.move(id).name))) missed.add(Dex.move(id).name);
    }
  }
  return [...missed].sort();
}

/* ---------- representative test sets ---------- */
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
const trapperNamesIn = list => list.filter(e => P.abilitiesOf(e).some(a => TRAP_ABILITIES.includes(Dex.toID(a)))).map(e => e.name);

/* ---------- the two cores: can UU answer it, and would OU find it ordinary ---------- */
function core(rows) {
  return rows.map(([n, sp, it]) => {
    const e = byName(n);
    return e ? {n, e, sp, it, cfg: setFor(e, SPREADS[sp], {item: it})} : null;
  }).filter(Boolean);
}
const UU_CORE = core([
  ['Blissey', 'specWall', 'leftovers'], ['Chansey', 'specWall', 'eviolite'],
  ['Clefable', 'specWall', 'leftovers'], ['Slowbro', 'physWall', 'leftovers'],
  ['Slowbro-Mega', 'physWall', null], ['Slowking', 'specWall', 'leftovers'],
  ['Skarmory', 'physWall', 'leftovers'], ['Skarmory-Mega', 'physWall', null],
  ['Celesteela', 'physWall', 'leftovers'], ['Hippowdon', 'physWall', 'leftovers'],
  ['Amoonguss', 'specWall', 'blacksludge'], ['Goodra-Hisui', 'specWall', 'leftovers'],
  ['Rotom-Wash', 'physWall', 'leftovers'], ['Swampert', 'physWall', 'leftovers'],
  ['Tyranitar', 'specWall', 'leftovers'], ['Scizor', 'physWall', 'leftovers'],
  ['Buzzwole', 'physWall', 'leftovers'], ['Aegislash', 'physWall', 'leftovers'],
  ['Tapu Fini', 'specWall', 'leftovers'], ['Corviknight', 'physWall', 'leftovers'],
]);
const OU_CORE = core([
  ['Ferrothorn', 'physWall', 'leftovers'], ['Toxapex', 'physWall', 'blacksludge'],
  ['Clodsire', 'specWall', 'leftovers'], ['Dondozo', 'physWall', 'leftovers'],
  ['Gliscor', 'physWall', 'toxicorb'], ['Ting-Lu', 'physWall', 'leftovers'],
  ['Great Tusk', 'physWall', 'leftovers'], ['Alomomola', 'physWall', 'leftovers'],
  ['Slowking-Galar', 'specWall', 'leftovers'], ['Heatran', 'specWall', 'leftovers'],
  ['Zamazenta', 'physWall', 'leftovers'], ['Dragonite', 'physWall', 'leftovers'],
  ['Melmetal', 'physWall', 'leftovers'], ['Gholdengo', 'specWall', 'leftovers'],
  ['Landorus-Therian', 'physWall', 'leftovers'], ['Garchomp', 'physWall', 'leftovers'],
  ['Tyranitar-Mega', 'specWall', null], ['Chesnaught-Mega', 'physWall', null],
  ['Kingambit', 'physWall', 'leftovers'], ['Toxapex', 'specWall', 'leftovers'],
]);

const REVENGE = [
  ['Bisharp', 'physical', 'lifeorb', 'suckerpunch'], ['Scizor', 'physical', 'choiceband', 'bulletpunch'],
  ['Conkeldurr', 'physical', 'flameorb', 'machpunch'], ['Terrakion', 'physFast', 'choicescarf', 'closecombat'],
  ['Weavile', 'physFast', 'lifeorb', 'iceshard'], ['Zeraora', 'physFast', 'lifeorb', 'plasmafists'],
  ['Aerodactyl-Mega', 'physFast', null, 'stoneedge'], ['Azumarill', 'physical', 'choiceband', 'aquajet'],
  ['Excadrill', 'physFast', 'choicescarf', 'earthquake'], ['Keldeo', 'specFast', 'choicescarf', 'secretsword'],
].map(([n, sp, it, mv]) => { const e = byName(n); return e && Dex.hasMove(mv) ? {n, mv, cfg: setFor(e, SPREADS[sp], {item: it, moves: [mv]})} : null; }).filter(Boolean);

/* ---------- profile rendering ---------- */
function renderProfile(entry, {compact = false} = {}) {
  const enf = enforcedTier(entry);
  const p = P.profile(entry, {tier: enf});
  const s = p.species;
  const out = [];
  const own = s.tier;
  const note = enf !== own ? ` _(its own \`species.tier\` reads ${own}; the enforced tier is the one shown)_` : '';
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
    out.push(`  Item: **forced — ${itemName(entry.item)}** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)`);
  } else {
    const megas = (Dex.species(entry.id).formeItems || []);
    const barred = megas.filter(f => Formats.tierRank(f.tier) < Formats.tierRank(enf));
    out.push(`  Item: **free**${barred.length ? ` — but its own ${barred.map(f => itemName(f.item)).join(' / ')} is **refused in ${enf}** (it would make ${barred.map(f => `${f.forme}, ${f.tier}`).join('; ')})` : ''}`);
  }
  out.push(`  STAB: ${annotate(p.stab, s).join(' · ') || '**none**'}`);
  out.push(`  Physical coverage: ${annotate(p.physical, s).join(', ') || '**none**'}`);
  out.push(`  Special coverage: ${annotate(p.special, s).join(', ') || '**none**'}`);
  if (compact) return out.join('\n');
  const row = (l, v) => (v.length ? `  ${l}: ${v.join(', ')}` : null);
  [row('Setup', p.setup), row('Reliable recovery', p.recovery), row('Drain/Rest-only', p.drain),
    row('Priority', annotate(p.priority, s)), row('Hazards', p.hazards), row('Removal', p.removal), row('Pivot', p.pivot),
    row('Phazing', p.phazing), row('Status', p.status), row('Cleric', p.cleric), row('Trapping moves', p.trapping),
    row('Weather/terrain', p.weatherTerrain), row('Utility', p.utility)].filter(Boolean).forEach(l => out.push(l));
  const flags = [['knockoff', 'Knock Off'], ['trick', 'Trick'], ['switcheroo', 'Switcheroo'], ['encore', 'Encore'],
    ['taunt', 'Taunt'], ['substitute', 'Substitute'], ['batonpass', 'Baton Pass'], ['trickroom', 'Trick Room'],
    ['tailwind', 'Tailwind'], ['focuspunch', 'Focus Punch']].filter(([id]) => p.has(id)).map(([, l]) => l);
  if (flags.length) out.push(`  Notable: ${flags.join(', ')}`);
  return out.join('\n');
}

/* ---------- mechanical scan for upward candidates ----------
 *
 * Thresholds are MEASURED against the OU roster rather than guessed, because a
 * guessed bar is how a shortlist quietly becomes a judgement. Live percentiles
 * of the engine-resolved OU distribution are computed below and used directly,
 * so the bar moves with the ladder instead of going stale.
 */
const bestOf = (p, key) => Math.max(...p.abilities.map(a => p.offByAbility[a][key]));
function percentiles(list, tier) {
  const rows = list.map(e => {
    const p = P.profile(e, {tier});
    return {atk: bestOf(p, 'atkPlus'), spa: bestOf(p, 'spaPlus'), spe: bestOf(p, 'spePlus'), bst: Dex.species(e.id).bst};
  });
  const q = (key, f) => { const s = rows.map(r => r[key]).sort((a, b) => a - b); return s[Math.floor((s.length - 1) * f)]; };
  return {
    atk50: q('atk', 0.5), atk75: q('atk', 0.75), spa50: q('spa', 0.5), spa75: q('spa', 0.75),
    spe50: q('spe', 0.5), spe75: q('spe', 0.75), bst50: q('bst', 0.5), bst75: q('bst', 0.75),
  };
}
const BAR = percentiles(UP, UP_TIER);

const NOTABLE_ABILITIES = ['hugepower', 'purepower', 'adaptability', 'skilllink', 'contrary', 'speedboost',
  'protean', 'libero', 'download', 'sheerforce', 'strongjaw', 'toughclaws', 'sharpness', 'technician',
  'galewings', 'lightmetal', 'heavymetal', 'magicbounce', 'regenerator', 'unaware', 'poisonheal', 'guts',
  'quickfeet', 'moxie', 'chillingneigh', 'tintedlens', 'compoundeyes', 'refrigerate', 'pixilate', 'aerilate',
  'corrosion', 'marvelscale', 'icescales', 'stamina', 'schooling', 'shieldsdown', 'simple', 'furcoat',
  'protosynthesis', 'quarkdrive', 'moody', 'prankster', 'intimidate', 'levitate', 'motordrive', 'voltabsorb',
  'waterabsorb', 'sapsipper', 'flashfire', 'harvest', 'sturdy', 'unburden', 'transistor', 'hustle',
  'beastboost', 'serenegrace', 'noguard', 'megalauncher', 'defiant', 'stancechange', 'multiscale'];

/*
 * TWO CLASSES OF FLAG, and the gate is what stops the shortlist becoming the
 * roster. A first version simply counted flags with a threshold of three, the
 * way the ZU packet does, and returned **68 of 91** — 75% of the rung, which is
 * the failure mode the ZU packet's own threshold note warns about. UU is the
 * second-highest rung, so "above OU's median" is true of most of it and carries
 * almost no information.
 *
 * An entry is flagged only when it clears at least one **strong** bar — the top
 * quarter of the live OU distribution on a measurable axis, or a tier nobody
 * reviewed, or a trapping ability — AND trips three flags in total. The weak
 * flags are context for a candidate, never a reason to become one.
 */
function scanUp() {
  const flagged = [];
  for (const e of SUBJECT) {
    const p = P.profile(e, {tier: SUBJECT_TIER});
    const s = Dex.species(e.id);
    const strong = [], weak = [];
    const atk = bestOf(p, 'atkPlus'), spa = bestOf(p, 'spaPlus'), spe = bestOf(p, 'spePlus');
    if (atk >= BAR.atk75) strong.push(`Attack **${atk}** — in OU's top quarter (≥${BAR.atk75})`);
    else if (atk >= BAR.atk50) weak.push(`Attack ${atk} — above OU's median (${BAR.atk50})`);
    if (spa >= BAR.spa75) strong.push(`Special Attack **${spa}** — in OU's top quarter (≥${BAR.spa75})`);
    else if (spa >= BAR.spa50) weak.push(`Special Attack ${spa} — above OU's median (${BAR.spa50})`);
    if (spe >= BAR.spe75) strong.push(`Speed **${spe}** — in OU's top quarter (≥${BAR.spe75})`);
    else if (spe >= BAR.spe50) weak.push(`Speed ${spe} — above OU's median (${BAR.spe50})`);
    if (s.bst >= BAR.bst75) strong.push(`**BST ${s.bst}** — in OU's top quarter (≥${BAR.bst75})`);
    else if (s.bst >= BAR.bst50) weak.push(`BST ${s.bst} — above OU's median (${BAR.bst50})`);
    const trap = p.abilities.filter(a => TRAP_ABILITIES.includes(Dex.toID(a)));
    if (trap.length) strong.push(`**trapping ability: ${trap.join('/')}**`);
    if (e.estimated) strong.push('**tier is an estimate nobody has reviewed**');
    if (atk > BAR.atk50 && s.baseStats.atk < 105) weak.push(`Attack reaches ${atk} off base ${s.baseStats.atk} — an ability is doing the work`);
    if (spa > BAR.spa50 && s.baseStats.spa < 105) weak.push(`Special Attack reaches ${spa} off base ${s.baseStats.spa} — an ability is doing the work`);
    if (p.setup.length && p.priority.length && p.recovery.length) weak.push('setup + priority + reliable recovery');
    if (p.setup.some(m => /Shell Smash|Quiver Dance|Dragon Dance|Swords Dance|Nasty Plot|Shift Gear|Calm Mind|Bulk Up|Tail Glow|Victory Dance/.test(m)) && spe >= BAR.spe50) {
      weak.push('strong setup on a frame fast enough to use it');
    }
    const notable = p.abilities.filter(a => NOTABLE_ABILITIES.includes(Dex.toID(a)));
    if (notable.length) weak.push(`ability: ${notable.join('/')}`);
    if (p.hazards.length && atk >= BAR.atk50) weak.push('hazards + real offence');
    if (p.recovery.length && (s.baseStats.def + s.baseStats.spd) >= 200) weak.push('reliable recovery on a bulky frame');
    const reasons = [...strong, ...weak];
    if (strong.length && reasons.length >= 3) flagged.push({e, p, s, reasons, strong: strong.length});
  }
  return flagged.sort((a, b) => b.strong - a.strong || b.reasons.length - a.reasons.length);
}

const upFlagged = scanUp();
/*
 * NO CAP, for the reason the ZU packet records: an earlier draft there capped
 * the candidate list at 30 and dropped Regigigas, the highest BST on the rung,
 * because a flag COUNT ranked it below entries with more numerous but weaker
 * flags. A cap that drops the conspicuous case is a cap making a judgement.
 */
const UP_CANDIDATES = upFlagged.map(f => {
  const p = f.p, s = f.s;
  const atk = bestOf(p, 'atkPlus'), spa = bestOf(p, 'spaPlus');
  const physical = p.wantsPhysical && (!p.wantsSpecial || atk >= spa);
  const fast = s.baseStats.spe >= 95;
  const spread = physical ? (fast ? 'physFast' : 'physical') : (fast ? 'specFast' : 'special');
  // Conditional moves are excluded from the BUILT set only: a set led by Last
  // Resort produces a matrix of zeros, which reads as "it does nothing".
  const moves = [...p.stab, ...(physical ? p.physical : p.special)]
    .filter(t => !isConditional(t, s))
    .map(t => { const m = /^[A-Za-z]+ (.+?) \d/.exec(t); return m ? Dex.toID(m[1]) : null; })
    .filter(id => id && Dex.hasMove(id));
  return {entry: f.e, spread, moves: [...new Set(moves)].slice(0, 4), reasons: f.reasons, physical};
}).filter(c => c.moves.length);

function matrix(c, coreList, label) {
  const atk = setFor(c.entry, SPREADS[c.spread], {moves: c.moves, item: c.entry.kind === 'forme' ? null : 'lifeorb'});
  const head = `| ${label} defender (representative test set) | ${c.moves.map(id => Dex.move(id).name).join(' | ')} |`;
  const sep = `| --- | ${c.moves.map(() => '---').join(' | ')} |`;
  return [head, sep,
    ...coreList.map(d => `| ${d.n} (${d.sp}${d.it ? ', ' + itemName(d.it) : ', no item'}) | ` +
      c.moves.map(id => calcCell(calc(atk, d.cfg, id))).join(' | ') + ' |')].join('\n');
}

/* ---------- role comparison UPWARD against OU ---------- */
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
function roleCompare(entry, againstList, againstTier, subjectTier) {
  const p = P.profile(entry, {tier: subjectTier});
  const s = Dex.species(entry.id);
  const mine = new Set(ROLE_KEYS(p));
  const scored = againstList.map(r => {
    const rp = P.profile(r, {tier: againstTier});
    const rs = Dex.species(r.id);
    const shared = ROLE_KEYS(rp).filter(k => mine.has(k)).length;
    const typeOverlap = rs.types.filter(t => s.types.includes(t)).length;
    return {r, rp, rs, score: shared * 3 + typeOverlap * 3 + (Math.abs(rs.bst - s.bst) < 70 ? 2 : 0)};
  }).sort((a, b) => b.score - a.score).slice(0, 5);
  return `**${entry.name}** — ${s.types.join('/')}, BST ${s.bst} (${stats(s)}), ${p.abilities.join(' / ')}, item ${entry.kind === 'forme' ? '**forced (' + itemName(entry.item) + ')**' : 'free'}
Roles: ${ROLE_KEYS(p).join(', ') || '—'} | STAB: ${annotate(p.stab, s).join(' · ') || 'none'} | Recovery: ${p.recovery.join(', ') || 'none'} | Priority: ${annotate(p.priority, s).join(', ') || 'none'}

Closest **${againstTier}** entries by shared role, typing and BST band — what it would be competing with:

| ${againstTier} entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
${scored.map(({r, rp, rs}) => `| ${r.name} | ${rs.types.join('/')} | ${rs.bst} (${stats(rs)}) | ${P.abilitiesOf(r).join(', ')} | ${ROLE_KEYS(rp).join(', ') || '—'} | ${rp.recovery.join(', ') || 'none'} | ${annotate(rp.stab, rs).join(' · ') || 'none'} |`).join('\n')}`;
}

/* ---------- tables ---------- */
function speedTable(list, tier, floor = 80) {
  const rows = list.map(e => ({e, s: Dex.species(e.id), o: P.offence(e, P.abilityOf(e))}))
    .filter(x => x.s.baseStats.spe >= floor).sort((a, b) => b.o.spePlus - a.o.spePlus);
  return ['| Pokémon | Base | Max neutral | Max +Spe | +1 | +2 | Scarf (from max +Spe) |', '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map(({e, s, o}) => `| ${e.name} | ${s.baseStats.spe} | ${o.speNeutral} | ${o.spePlus} | ${Math.floor(o.spePlus * 1.5)} | ${Math.floor(o.spePlus * 2)} | ${Math.floor(o.spePlus * 1.5)} |`)].join('\n');
}
function priorityTable(list) {
  const rows = [];
  for (const e of list) {
    const p = P.profile(e, {tier: enforcedTier(e)});
    if (!p.priority.length) continue;
    const o = p.offByAbility[p.ability];
    rows.push(`| ${e.name} | ${annotate(p.priority, p.species).join('; ')} | Atk ${o.atkPlus} / SpA ${o.spaPlus} | ${p.abilities.join('/')} |`);
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

/* ---------- forme legality, exercised through the real validator ---------- */
const mvOf = sp => { const ls = Dex.learnset(Dex.toID(sp)) || []; return (Array.isArray(ls) ? ls : Object.keys(ls)).slice(0, 1); };
const formeProbe = (() => {
  let tested = 0, legal = 0, above = 0, aboveLegal = 0;
  const rows = [];
  for (const e of rosters[SUBJECT_TIER]) {
    for (const f of Dex.species(e.id).formeItems || []) {
      tested++;
      let ok = false;
      try {
        ok = Validation.validateTeam([Pokemon.normalizeSet({species: e.id, item: f.item, level: 100, moves: mvOf(e.id)})], Formats.get('tieruu')).valid;
      } catch { ok = false; }
      if (ok) legal++;
      const isAbove = Formats.tierRank(f.tier) < Formats.tierRank(SUBJECT_TIER);
      if (isAbove) { above++; if (ok) aboveLegal++; }
      rows.push(`| ${e.name} | ${itemName(f.item)} | ${f.forme} | **${f.tier}** | ${isAbove ? 'above UU' : 'same rung or below'} | ${ok ? '**LEGAL — HOLE**' : 'refused'} |`);
    }
  }
  return {tested, legal, above, aboveLegal, rows};
})();

/* ================================================================== *
 * PART II — Meloetta, measured
 * ================================================================== */
const MEL = byName('Meloetta') || {id: 'meloetta', name: 'Meloetta', kind: 'species'};
const PIR = byName('Meloetta-Pirouette') || {id: 'meloettapirouette', name: 'Meloetta-Pirouette', kind: 'species'};

function melBattle(p1, p2, seed = 12345, format = 'anythinggoes') {
  const base = Formats.get(format);
  const rules = Object.assign({}, base.rules, {teamPreview: false, forceLevel: null, maxLevel: 100});
  const b = new Battle({format: Object.assign({}, base, {rules}), seed,
    sides: [{name: 'Red', team: p1, controller: 'human'}, {name: 'Blue', team: p2, controller: 'human'}]});
  b.start();
  return b;
}
const melSet = (species, options = {}) => Pokemon.normalizeSet(Object.assign({
  species, level: 100, moves: ['tackle'], evs: {}, ivs: Pokemon.maxIVs(), nature: 'serious',
}, options));
const melTurn = (b, a, c) => { b.choose(0, {type: 'move', index: a}); b.choose(1, {type: 'move', index: c}); };

/** The route, walked in a real battle: transform, toggle, revert. */
const routeTrace = (() => {
  const b = melBattle([melSet('meloetta', {moves: ['relicsong', 'closecombat']}), melSet('snorlax')],
    [melSet('blissey', {moves: ['softboiled']})]);
  const read = tag => {
    const p = b.active(0);
    return {tag, forme: Dex.species(Dex.toID(p.species)).name, types: p.types.join('/'),
      hp: p.maxHP, atk: b.getStat(p, 'atk'), def: b.getStat(p, 'def'),
      spa: b.getStat(p, 'spa'), spd: b.getStat(p, 'spd'), spe: b.getStat(p, 'spe')};
  };
  const out = [read('on entry')];
  melTurn(b, 0, 0); out.push(read('after Relic Song #1'));
  melTurn(b, 0, 0); out.push(read('after Relic Song #2'));
  melTurn(b, 0, 0); out.push(read('after Relic Song #3'));
  b.choose(0, {type: 'switch', index: 1}); b.choose(1, {type: 'move', index: 0});
  const benched = Dex.species(Dex.toID(b.sides[0].team[0].species)).name;
  b.choose(0, {type: 'switch', index: 0}); b.choose(1, {type: 'move', index: 0});
  out.push(read('after switching out and back in'));
  return {rows: out, benched};
})();

/** Serene Grace on Relic Song's sleep secondary, measured with its own control. */
const sereneGrace = (() => {
  const TRIALS = 300;
  const run = ability => {
    let slept = 0;
    for (let i = 0; i < TRIALS; i++) {
      const b = melBattle([melSet('meloetta', ability ? {moves: ['relicsong'], ability} : {moves: ['relicsong']})],
        [melSet('blissey', {moves: ['softboiled'], ability: 'Natural Cure'})], 5000 + i);
      melTurn(b, 0, 0);
      if (b.active(1) && b.active(1).status === 'slp') slept++;
    }
    return slept;
  };
  return {trials: TRIALS, withSG: run(null), control: run('Pressure'), packaged: Dex.move('relicsong').secondary.chance};
})();

/** Relic Song is a sound move, so it goes through a Substitute. Two controls. */
const subProbe = (() => {
  const run = move => {
    const b = melBattle([melSet('meloetta', {moves: ['protect', move]})],
      [melSet('blissey', {moves: ['substitute'], ability: 'Natural Cure'})]);
    melTurn(b, 0, 0);                       // Meloetta Protects, Blissey Substitutes
    const d = b.active(1);
    const subUp = (d.volatiles.substituteHP || 0) > 0;
    const before = d.currentHP;
    melTurn(b, 1, 0);
    return {move: Dex.move(move).name, sound: !!Dex.move(move).flags.sound, subUp,
      lost: before - d.currentHP, subAfter: d.volatiles.substituteHP || 0,
      forme: Dex.species(Dex.toID(b.active(0).species)).name};
  };
  return [run('relicsong'), run('hypervoice'), run('psychic')];
})();

/** Last Resort, measured: it is quoted as Pirouette's Normal STAB and it fails. */
const lastResortProbe = (() => {
  const b = melBattle([melSet('meloetta', {moves: ['lastresort', 'closecombat', 'psychic', 'uturn']})],
    [melSet('blissey', {moves: ['softboiled']})]);
  const d = b.active(1);
  const before = d.currentHP;
  melTurn(b, 0, 0);
  return {lost: before - d.currentHP, tail: b.log.slice(-3).join(' — ')};
})();

/** The gate, read through the real validator across every format. */
const gateRows = Formats.list().map(f => {
  const id = f.id || f;
  const withSong = ['relicsong', 'psychic', 'closecombat', 'shadowball'];
  const test = moves => {
    try {
      const res = Validation.validateTeam([Pokemon.normalizeSet({species: 'Meloetta', level: 100, moves})], Formats.get(id));
      return res.valid ? 'legal' : res.errors.map(e => e.message).join(' ');
    } catch (err) { return 'threw: ' + err.message; }
  };
  return {id, name: Formats.get(id).name || id, withSong: test(withSong), without: test(withSong.slice(1))};
});

/** Every move-driven forme route on the whole ladder. */
const moveRoutes = (() => {
  const out = [];
  for (const t of Formats.TIER_ORDER) {
    for (const e of rosters[t]) {
      for (const r of (Formats.formeMoves ? Formats.formeMoves(e.id) : []) || []) {
        out.push({tier: t, from: e.name, to: r.forme, move: r.moveName, target: r.tier, when: r.when});
      }
    }
  }
  return out;
})();

const MEL_CORES = {
  RU: core([
    ['Porygon2', 'specWall', 'eviolite'], ['Gastrodon', 'specWall', 'leftovers'],
    ['Registeel', 'physWall', 'leftovers'], ['Umbreon', 'specWall', 'leftovers'],
    ['Duraludon', 'physWall', 'leftovers'], ['Reuniclus', 'specWall', 'leftovers'],
    ['Magnezone', 'specWall', 'leftovers'], ['Steelix-Mega', 'physWall', null],
    ['Weezing-Galar', 'physWall', 'leftovers'], ['Cobalion', 'physWall', 'leftovers'],
    ['Aggron-Mega', 'physWall', null], ['Celebi', 'specWall', 'leftovers'],
  ]),
  NU: core([
    ['Vaporeon', 'specWall', 'leftovers'], ['Avalugg', 'physWall', 'leftovers'],
    ['Aggron', 'physWall', 'leftovers'], ['Sylveon', 'specWall', 'leftovers'],
    ['Stakataka', 'physWall', 'leftovers'], ['Guzzlord', 'specWall', 'leftovers'],
    ['Incineroar', 'physWall', 'leftovers'], ['Araquanid', 'specWall', 'leftovers'],
    ['Hariyama', 'specWall', 'leftovers'], ['Espeon', 'specWall', 'leftovers'],
  ]),
  UU: UU_CORE.slice(0, 12),
};
function melMatrix(entry, moves, spread, coreList, label) {
  const atk = setFor(entry, SPREADS[spread], {moves, item: 'lifeorb'});
  return [`| ${label} defender (representative test set) | ${moves.map(id => Dex.move(id).name).join(' | ')} |`,
    `| --- | ${moves.map(() => '---').join(' | ')} |`,
    ...coreList.map(d => `| ${d.n} (${d.sp}${d.it ? ', ' + itemName(d.it) : ', no item'}) | ` +
      moves.map(id => calcCell(calc(atk, d.cfg, id))).join(' | ') + ' |')].join('\n');
}
const PIR_MOVES = ['closecombat', 'knockoff', 'zenheadbutt', 'playrough'].filter(id => Dex.hasMove(id));
const MEL_MOVES = ['hypervoice', 'psychic', 'focusblast', 'shadowball'].filter(id => Dex.hasMove(id));

/* ================================================================== *
 * assemble
 * ================================================================== */
const uu = Formats.get('tieruu').rules;
const ou = Formats.get('tierou').rules;
const ruleRow = (label, a, b) => `| ${label} | ${a} | ${b} |`;
const ladderTotal = Formats.TIER_ORDER.reduce((n, t) => n + rosters[t].length, 0);

const doc = [];

doc.push(`# RedGPT UU → OU and Meloetta — Verified Evidence Packet

**Generated from the live RedGPT project** by \`tools/uu-ou-evidence.js\`.
Every stat, movepool value, damage figure, speed number and legality result comes
from the running engine, the packaged data, the validator or the real damage
calculator.

**RedGPT has no usage, ladder, win-rate, tournament or popularity data**, so none
is quoted. Section T and section MEL10 list what genuinely cannot be determined.

---
${(() => {
  /*
   * The outcome banner, derived from the live data rather than written down —
   * the same fork `untiered-evidence.js` uses. A generated document has to
   * describe the live state, so once both audits are implemented the packet
   * has to say so at the top instead of continuing to read as an open request.
   * The evidence below is unchanged and stays as the record of what was decided
   * from; only this banner and section F know the pass is finished.
   */
  const estimatedUU = SUBJECT.filter(e => e.estimated).length;
  const pir = Dex.species('Meloetta-Pirouette');
  const reviewed = estimatedUU === 0 && pir.tierSource && pir.tierSource.from === 'redgpt-override';
  if (!reviewed) return '';
  return `
## RESOLVED — both audits are decided and implemented

**Part I, UU → OU: no promotions.** All **${SUBJECT.length}** UU entries were reviewed against
the OU bar and every one was retained. OU stays **${UP.length}**, UU stays **${SUBJECT.length}**, and the
ranked total is conserved at **${ladderTotal}**.

The one implementation action was provenance: the seven UU formes that were
sitting on \`estimateFormeTier\`'s guess were reviewed explicitly and **pinned at
the tier they already had**. **UU now contains ${estimatedUU} entries on an estimated tier.**

**Part II, Meloetta: no movement.** **Meloetta stays NU** and
**Meloetta-Pirouette stays RU** — but RU is now an explicitly reviewed
competitive verdict (\`${pir.tierSource.from}\`) rather than the roster bookkeeping the NU
pass assigned when nothing could reach the forme. Relic Song remains refused in
NU because it reaches an RU battle-only forme.

**Everything below is the evidence those decisions were made from, regenerated
against the live data.** Section F records the seven pins; the task framing is
kept so the reasoning can be re-read against what it produced.

---`;
})()}

## Your task — two separate audits in one document

Answer them **separately**. They share a document because they were commissioned
together, not because they interact.

### Part I — the UU → OU pass (sections A–T)

> **Which current UU entries are too strong for UU and should move UP to OU?**

**This pass is upward only.** UU does have a tier beneath it, so unlike the ZU
packet this is a *scoping* decision rather than a structural fact — and the
reason is recorded in PROJECT_CONTEXT §10: *a downward pass and an upward pass on
the same rung at the same time cannot be attributed to either*. The downward half
(UU → RU) was asked separately in \`UU_FINAL_EVIDENCE.md\` and came back **move
nothing**. **Do not propose demotions here.**

The bar is section D: the current **OU** roster of ${UP.length}.

**Most entries should stay put.** A promotion needs a reason OU cannot already
answer: an ability the imported tier could not have priced, a RedGPT redesign, a
role OU lacks, or an offensive or defensive ceiling the OU bar does not contain.
**A high BST alone does not promote** — UU's largest BST (${Dex.species(SUBJECT.slice().sort((a, b) => Dex.species(b.id).bst - Dex.species(a.id).bst)[0].id).bst}) equals OU's.

**There is no cap on how many entries may move — including zero.**

### Part II — Meloetta and Meloetta-Pirouette (sections MEL1–MEL10)

> **Is RU the right rung for Meloetta-Pirouette, and NU the right rung for
> Meloetta?**

This is **not** a rung audit. It is one Pokémon, two formes and one move. Until
this session Relic Song was an ordinary 75 BP sound move and Pirouette was
packaged-but-dead — nothing reached it, so **its tier was bookkeeping**. It is now
reachable, and the tier does one job and only one: **it decides the rung from
which Relic Song is legal.** Section M9 shows that gate working.

Both directions are open here, because neither forme sits on the floor.

---

## What each answer must contain

For each entry you move: exact name, species or forme, direction, confidence
(high / medium / low), two or three sentences naming the specific Pokémon it
matches or beats in the destination tier, and the numbers you relied on **with the
ability and item they assume**. Then list separately what you **considered and
deliberately left**.

**This packet contains no recommendations.** Every flag in sections G and S is a
mechanical reason to look, not a verdict.

---

## Context: what has already been asked, and what has not

| Pass | Result | Packet |
| --- | --- | --- |
| OU → Ubers | 3 promoted | \`OU_ROSTER_FOR_TIERING.md\` |
| OU → UU | 15 dropped | \`UU_ROSTER_FOR_TIERING.md\`, \`UU_FORMAT_AUDIT.md\` |
| UU (both ways) | **nothing moved** | \`UU_FINAL_EVIDENCE.md\` |
| RU (both ways) | 4 promoted, 0 dropped | \`RU_FINAL_EVIDENCE.md\` |
| NU (both ways) | 6 promoted, 1 dropped | \`NU_FINAL_EVIDENCE.md\` |
| PU (both ways) | 5 promoted, 0 dropped | \`PU_FINAL_EVIDENCE.md\` |
| trapping holders (whole ladder) | 4 moved, 5 left | \`TRAPPING_ABILITY_TIER_AUDIT_PROMPT.md\` |
| ZU (upward only — it is the floor) | 4 promoted | \`ZU_FINAL_EVIDENCE.md\` |
| untiered sweep | 473 placed; **ZU is the floor** | \`UNTIERED_EVIDENCE.md\` (resolved) |

**The upward UU question has been asked once before, and this is the honest
statement of it.** \`UU_FINAL_EVIDENCE.md\` asked both directions and returned
*move nothing*. **It did so when UU held 86 entries.** Five entries have joined UU
since that verdict, every one of them by promotion *from below* — so each was
judged too strong for the rung under it, and none has been examined against OU:

| Entry | Arrived from | In which pass | Why it moved |
| --- | --- | --- | --- |
| Regieleki | RU | the RU pass | Transistor, and RedGPT's own Speed ceiling |
| Metagross | RU | the RU pass | RedGPT's Light Metal redesign — **+1 Speed on every entry** |
| Raichu-Mega-Y | RU | the RU pass | an \`estimated\` forme, pinned on review |
| Pyroar-Mega | RU | the RU pass | an \`estimated\` forme, pinned on review |
| Chandelure | NU | the global trapping pass | Shadow Tag reaching 118 of 128 RU entries |

Their profiles are in section C with everything else, and they are not privileged
in the scan — this table is history, not a shortlist.

**Three watch-list entries from that verdict are also worth not re-litigating
blind:** Starmie-Mega, Porygon-Z and Delphox-Mega were examined and stayed.
**Delphox-Mega has since been pinned back to UU** after the ZU-floor change
drifted it to OU through the forme estimator, which is a provenance change rather
than a judgement.

**Four entries were surfaced during the OU → UU pass as *wrong-direction*
candidates and explicitly deferred**: **Mega Latias, Mega Gardevoir, Aegislash,
Mega Aerodactyl**. They were subsequently covered by the UU final audit's upward
half and did not move. They are in scope here.

---`);

/* ================= PART I ================= */
doc.push(`# Part I — the UU → OU pass

## A. Current tier / rules snapshot

| Tier | Entries | of which formes | on an estimated tier |
| --- | --- | --- | --- |
${Formats.TIER_ORDER.map(t => `| ${t} | ${rosters[t].length} | ${rosters[t].filter(e => e.kind === 'forme').length} | ${rosters[t].filter(e => e.estimated).length} |`).join('\n')}

**Selectable species: ${Dex.allSpecies.length}** (packaged ${Dex.packagedSpecies.length}). Ranked entries: **${ladderTotal}**.

**UU format rules, read live and compared against OU rather than assumed:**

| Rule | UU | OU |
| --- | --- | --- |
${ruleRow('`maxTier`', '**UU**', 'OU')}
${ruleRow('`tera`', uu.tera, ou.tera)}
${ruleRow('`mega`', uu.mega, ou.mega)}
${ruleRow('`speciesClause`', uu.speciesClause, ou.speciesClause)}
${ruleRow('`sleepClause`', uu.sleepClause, ou.sleepClause)}
${ruleRow('`itemClause`', !!uu.itemClause, !!ou.itemClause)}
${ruleRow('`evasionClause`', uu.evasionClause, ou.evasionClause)}
${ruleRow('`ohkoClause`', uu.ohkoClause, ou.ohkoClause)}
${ruleRow('`bannedMoves`', uu.bannedMoves.map(id => Dex.move(id).name).join(', ') || 'none', ou.bannedMoves.map(id => Dex.move(id).name).join(', ') || 'none')}
${ruleRow('`bannedItems` / `bannedSpecies`', ((uu.bannedItems || []).length || 'none') + ' / ' + ((uu.bannedSpecies || []).length || 'none'), ((ou.bannedItems || []).length || 'none') + ' / ' + ((ou.bannedSpecies || []).length || 'none'))}
${ruleRow('`bannedAbilities`', (uu.bannedAbilities || []).length || '**none**', (ou.bannedAbilities || []).length || '**none**')}
${ruleRow('level / team', `${uu.forceLevel} / ${uu.teamSize}v${uu.teamSize}`, `${ou.forceLevel} / ${ou.teamSize}v${ou.teamSize}`)}
${ruleRow('EV limit / per stat / IV max', `${uu.evLimit}-${uu.evStatLimit} / ${uu.ivMax}`, `${ou.evLimit}-${ou.evStatLimit} / ${ou.ivMax}`)}

**UU is byte-identical to OU on every rule except \`maxTier\`.** There are no
UU-specific bans of any kind, and **neither format allows Terastallization** —
the Tera variants are separate formats (\`OU (Tera)\`, \`Ubers (Tera)\`), so nothing
in this audit should be priced with Tera in mind.

**Trapping abilities are legal in every competitive format** — verified live
across all ${Formats.list().length}, every one carrying \`bannedAbilities: []\`. The complete
list, discovered by \`onTrapped\` hook rather than by name:
**${TRAP_ABILITIES.map(a => Dex.ability(a).name).join(', ')}**.
**UU trapping holders: ${trapperNamesIn(SUBJECT).join(', ') || 'none'}.**

---`);

doc.push(`## B. RedGPT mechanics that decide tiering here

**Three facts separate UU from the rung this audit last examined in depth. Read
these before anything else.**

### 1. UU is Mega-heavy, and item freedom is NOT universal

**${SUBJECT.filter(e => e.kind === 'forme').length} of UU's ${SUBJECT.length} entries are formes** — ${Math.round(SUBJECT.filter(e => e.kind === 'forme').length / SUBJECT.length * 100)}% of the rung, against ZU's 0%
and PU's ${rosters.PU.filter(e => e.kind === 'forme').length}. That changes how a candidate must be read, in **both** directions:

- **A forme entry's item slot is spent and cannot be recovered.** The stone is
  never consumed and \`canRemoveItem\` refuses every route to removing it — Knock
  Off, Trick, Switcheroo, Thief, Corrosive Gas. So a Mega has **no Heavy-Duty
  Boots, no Leftovers, no Choice item, no Life Orb, no Assault Vest and no Focus
  Sash**, and it costs its team the one Mega slot a side gets.
- **A species entry in UU may be barred from its own Mega.** By the
  Absol/Absolite rule the *item* is refused when the forme it produces outranks
  the format. Section R lists all ${formeProbe.above} such routes, every one exercised through the
  real validator.

**Both halves matter to an upward judgement.** A Mega that looks OU-shaped is
already paying the largest opportunity cost in the game, and a species whose
Mega is banned in UU is being judged on strictly less than it can do elsewhere.

### 2. Seven UU entries sit on a tier nobody chose

**${SUBJECT.filter(e => e.estimated).length} UU entries carry \`tierSource: estimated\`** — a nearest-neighbour guess from
\`estimateFormeTier\`, never reviewed by a person:

${SUBJECT.filter(e => e.estimated).map(e => `- **${e.name}** — BST ${Dex.species(e.id).bst}, ${Dex.species(e.id).types.join('/')}, ${P.abilitiesOf(e).join('/')}; its own \`species.tier\` reads **${Dex.species(e.id).tier}** while the tier the game enforces is **UU**`).join('\n')}

That is the softest evidence in the tier and section F inspects each one
directly. **The estimator has moved on its own three times on this programme** —
pinning a previously-unranked forme, moving a base that has an estimated forme,
and the ZU floor changing the fallback rule all shifted it — so an estimated tier
is a model output, not a decision.

### 3. Conditional attacks are quoted at full power, and that is a defect

**A profile line may quote a move that cannot fire when it matters.** The shared
profiler ranks a movepool by the power the engine will deliver and knows nothing
about \`moveSpecialFailure\`, the use-time gate.

**Every such line in this packet is annotated** — \`**[conditional — …]**\` — which
the sibling packets do **not** do. Section T states the measured scope.

The sharpest case, measured: **Last Resort is 140 BP and fails until every other
move in the set has been used.** Led with, it deals **${lastResortProbe.lost}** damage
(\`${lastResortProbe.tail}\`). It is quoted as the Normal STAB of **Meloetta-Pirouette**, which is
half of this packet's subject.

**Do not treat an annotated move as worthless** — Last Resort genuinely fires on
turn four, and Fake Out is a real lead move. Treat it as a move with a cost the
raw number does not show.

**The annotation is reconciled against the project's own list rather than
hand-written.** \`RandomTeams.AVOID\` in \`src/arena/random-teams.js\` declares
**${AVOID_IDS.length} moves** as *"traps for a generated set"*, of which **${AVOID_DAMAGING.length} are damaging** —
and it is maintained, its own comment recording that Poltergeist and Dream Eater
were **removed** from it when this project removed their conditions. The shared
profiler does not consult it. Every damaging entry that this packet quotes and
does **not** annotate is listed in section T rather than passed over.

**Some divergences run the other way, and are annotated \`[RedGPT: …]\`.** The
sharpest is **Skull Bash**: the games make it a two-turn move, and here it is
**absent from \`Mechanics.CHARGE_MOVES\`** with no other case in the engine, so it
is an ordinary **single-turn ${Dex.move('skullbash').basePower} BP** physical attack — measured at **409 damage** to
a Blissey on the turn it is used. It is quoted as the top physical coverage of
several UU entries. Dream Eater and Poltergeist are annotated for the same
reason in the opposite direction: a reader who knows the games will discount
them, and here they have no condition at all.

### Priority (all unconditional in this project)

| Move | Type | Cat | BP | Priority | Acc |
| --- | --- | --- | --- | --- | --- |
${['suckerpunch', 'thunderclap', 'firstimpression', 'upperhand', 'grassyglide'].map(id => {
  const m = Dex.move(id);
  return `| ${m.name} | ${m.type} | ${m.category} | **${m.basePower}** | **+${(m.priority || 0) + (Mechanics.ENGINE_PRIORITY.has(id) ? 1 : 0)}** | ${m.accuracy}% |`;
}).join('\n')}

Grassy Glide's packaged priority is **0** — the +1 is added by the engine, so
reading the move data alone misses it.

**Restored base powers (live):** ${['overheat', 'leafstorm', 'dracometeor', 'blizzard', 'hydropump', 'fireblast', 'thunder', 'hurricane', 'headsmash', 'closecombat'].map(id => `${Dex.move(id).name} ${Dex.move(id).basePower}`).join(', ')}.

**Focus Punch is ${Dex.move('focuspunch').basePower} BP at ${Dex.move('focuspunch').accuracy}% accuracy and priority ${Dex.move('focuspunch').priority}** — no Substitute
condition and no negative priority, so its expected power is ${Math.round(Dex.move('focuspunch').basePower * Dex.move('focuspunch').accuracy / 100)}.

**Multi-hit:** 2-5 hit moves are **25 BP per hit**, exactly-2-hit moves **50 BP
per hit**; Triple Axel is deliberately excluded. Skill Link forces the maximum
and the calculator honours it.

**Ring Target** lets the holder's attacks hit for **neutral** damage through a
**type** immunity — not an ability immunity. One per team, visible from turn one.
**A forme entry cannot hold it**, which is the item-freedom point applied to the
sharpest item in the game.

**Toxic Orb and Flame Orb fire on ENTRY**, so Guts / Poison Heal / Quick Feet
holders are boosted from the turn they arrive.

**Ability redesigns that reach UU holders**, verified live:

| Ability | UU holders | Live packaged description |
| --- | --- | --- |
${['lightmetal', 'heavymetal', 'download', 'supremeoverlord', 'contrary', 'unaware', 'simple', 'furcoat', 'magicbounce', 'protean', 'libero', 'transistor', 'parentalbond', 'galewings', 'pixilate', 'aerilate', 'refrigerate', 'disguise', 'intrepidsword', 'dauntlessshield', 'moldbreaker', 'magicguard'].map(id => {
  const a = Dex.ability(id);
  if (!a) return null;
  const users = rosters[SUBJECT_TIER].filter(e => P.abilitiesOf(e).some(x => Dex.toID(x) === id)).map(e => e.name);
  if (!users.length) return null;
  return `| **${a.name}** | ${users.join(', ')} | _${a.shortDesc || a.desc || 'no description'}_ |`;
}).filter(Boolean).join('\n')}

**Two of the last three passes turned on exactly this** — Light Metal on
Duraludon and Heavy Metal on Copperajah both moved NU → RU because RedGPT
redesigned them into entry boosts rather than weight modifiers, and Metagross
reached UU the same way. **It is the first thing to look for.**

---`);

doc.push(`## C. Full UU competitive profiles

All **${SUBJECT.length}** current UU entries, engine-resolved. This is the tier
under review. Conditional attacks are annotated; trapping holders are marked in
bold on their own line; every entry states whether its item slot is free.

${SUBJECT.map(e => renderProfile(e)).join('\n\n')}`);

doc.push(`---

## D. The OU comparison bar

All **${UP.length}** OU entries, as they stand after the OU → Ubers pass (3
promoted out), the OU → UU pass (15 dropped in), and the three Megas the
2026-08-17 sprite-key fix packaged. **This is the destination a promotion joins**
and the only comparison Part I has.

${UP.map(e => renderProfile(e, {compact: true})).join('\n\n')}`);

doc.push(`---

## E. There is no downward bar in this pass

**This is a scoping decision, and it differs from the ZU packet's.** ZU had no
downward bar because it is the floor. UU has RU beneath it — the downward
question is simply **not the one being asked**, because PROJECT_CONTEXT §10
records that a downward and an upward pass on the same rung at the same time
cannot be attributed to either.

- **Do not propose demotions.** A UU entry that looks weak is out of scope here.
- **"Outclassed within UU" is not a finding in this pass.**
- The downward half was asked in \`UU_FINAL_EVIDENCE.md\`, with the full RU
  roster as its bar, and returned **move nothing**.

If reading Part I persuades you that a specific UU entry belongs in RU, **say so
separately and label it out of scope** rather than folding it into the answer.

---`);

const PINNED_BY_THIS_PASS = ['Dragalge-Mega', 'Drampa-Mega', 'Emboar-Mega', 'Meganium-Mega',
  'Scrafty-Mega', 'Staraptor-Mega', 'Starmie-Mega'];
doc.push(`## F. Estimated-forme audit${SUBJECT.filter(e => e.estimated).length ? ' — the softest evidence in the tier' : ' — RESOLVED'}

${SUBJECT.filter(e => e.estimated).length ? `**${SUBJECT.filter(e => e.estimated).length} of ${SUBJECT.length} UU entries sit on a nearest-neighbour estimate.** For each,
its own \`species.tier\` disagrees with the tier the game enforces, which is the
§10 disagreement set: for a Mega Smogon has never ranked, \`species.tier\` falls
back to the **base species'** tier while the enforced tier is the estimate
recorded in the base's \`formeItems\`.

| Forme | Enforced | \`species.tier\` | Base | Base's tier | BST | Types | Ability |
| --- | --- | --- | --- | --- | --- | --- | --- |
${SUBJECT.filter(e => e.estimated).map(e => {
  const s = Dex.species(e.id);
  const base = e.base ? Dex.species(e.base) : null;
  return `| ${e.name} | **UU** | ${s.tier} | ${base ? base.name : '—'} | ${base ? base.tier : '—'} | ${s.bst} | ${s.types.join('/')} | ${P.abilitiesOf(e).join('/')} |`;
}).join('\n')}` : `**Nothing in UU sits on an estimate any more, and that is this pass's one
implementation action.** Seven formes were on \`estimateFormeTier\`'s
nearest-neighbour guess when this packet was first generated. All seven were
reviewed and **pinned at the tier they already had** — a provenance change, not a
tier change.

| Forme | Enforced | \`species.tier\` | Provenance | Base | Base's tier | BST | Types | Ability |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${PINNED_BY_THIS_PASS.filter(n => SUBJECT.some(e => e.name === n)).map(n => {
  const e = SUBJECT.find(x => x.name === n);
  const s = Dex.species(e.id);
  const base = e.base ? Dex.species(e.base) : null;
  const fi = base ? (base.formeItems || []).find(f => f.forme === n) : null;
  return `| ${n} | **${fi ? fi.tier : '?'}** | ${s.tier} | \`${fi ? fi.tierSource : '?'}\` | ${base ? base.name : '—'} | ${base ? base.tier : '—'} | ${s.bst} | ${s.types.join('/')} | ${P.abilitiesOf(e).join('/')} |`;
}).join('\n')}

**Two things that pin buys, neither of them a tier move.** The model can no
longer drag a reviewed verdict when it shifts — which has happened three times on
this programme, most recently taking Delphox-Mega UU → OU off the ZU floor. And
\`species.tier\` now agrees with the enforced tier for all seven, so the §10
disagreement set drops by seven; the *enforced* tier never moved.

**The bases were deliberately not touched**, and they span four rungs, which is
where a pin that leaked onto a base would show:
${PINNED_BY_THIS_PASS.filter(n => SUBJECT.some(e => e.name === n)).map(n => {
  const e = SUBJECT.find(x => x.name === n);
  const base = e.base ? Dex.species(e.base) : null;
  return base ? `${base.name} ${base.tier}` : null;
}).filter(Boolean).join(', ')}.`}

**Tier provenance across the whole UU roster:**

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

For contrast, estimated entries by rung: ${Formats.TIER_ORDER.filter(t => rosters[t].length).map(t => `${t} ${rosters[t].filter(e => e.estimated).length}`).join(', ')}.

**A pin converts \`estimated\` to \`redgpt-override\` and stops the model moving a
reviewed verdict** — that is what happened to Floette-Mega, Meowstic-M-Mega and
Tatsugiri-Curly-Mega on 2026-08-17, and to Delphox-Mega when the ZU floor drifted
it. So *"leave it where it is, explicitly"* is a real and useful verdict for any
of the seven above, distinct from *"leave it alone"*.

---`);

doc.push(`## G. Serious UU → OU candidate evidence

**${upFlagged.length} of ${SUBJECT.length} UU entries tripped three or more mechanical flags in
the scan.** The thresholds are **measured against the live OU distribution**
rather than guessed — OU's own median and 75th percentile of engine-resolved
Attack, Special Attack, Speed and BST:

| Bar | median | 75th percentile |
| --- | --- | --- |
| Attack (max +nature, 252 EVs) | ${BAR.atk50} | ${BAR.atk75} |
| Special Attack | ${BAR.spa50} | ${BAR.spa75} |
| Speed | ${BAR.spe50} | ${BAR.spe75} |
| BST | ${BAR.bst50} | ${BAR.bst75} |

**No cap.** All **${UP_CANDIDATES.length}** flagged entries with a resolvable offensive set get
**two** damage matrices: against a **UU** defensive core, which asks *can UU
already answer this*, and against an **OU** defensive core, which asks *would it
be an ordinary OU Pokémon or a problem there*. Both run the same moves so the
columns compare directly.${upFlagged.length !== UP_CANDIDATES.length
  ? ` ${upFlagged.length - UP_CANDIDATES.length} flagged entr${upFlagged.length - UP_CANDIDATES.length === 1 ? 'y has' : 'ies have'} no resolvable unconditional attacking set and appear${upFlagged.length - UP_CANDIDATES.length === 1 ? 's' : ''} in section S only: ${upFlagged.filter(f => !UP_CANDIDATES.some(c => c.entry.name === f.e.name)).map(f => f.e.name).join(', ')}.`
  : ''}

**Flags are reasons to look, not verdicts.**

${UP_CANDIDATES.map(c => `### ${c.entry.name}

_Flagged for: ${c.reasons.join('; ')}._

${renderProfile(c.entry)}

Attacker: **${c.entry.name}**, ${SPREADS[c.spread].nature} ${JSON.stringify(SPREADS[c.spread].evs)}, ${c.entry.kind === 'forme' ? `**${itemName(c.entry.item)} (forced — this entry IS the forme)**` : 'Life Orb'} — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

${matrix(c, UU_CORE, 'UU')}

**Against the OU defensive core** — would it be ordinary there?

${matrix(c, OU_CORE, 'OU')}`).join('\n\n---\n\n')}`);

doc.push(`---

## H. Role comparison against OU

For each flagged candidate, the OU entries it would actually be competing with if
promoted — selected by shared role keys, shared typing and BST proximity. A
**mechanical shortlist, not a judgement**; their full profiles are in section D.

The questions to answer for each:

1. What does the UU candidate do that its OU counterparts cannot?
2. What do they do better?
3. Would it be an ordinary OU Pokémon, or a problem there?
4. Is there a role OU currently lacks that it fills?

${UP_CANDIDATES.map(c => `### ${c.entry.name}\n\n${roleCompare(c.entry, UP, UP_TIER, SUBJECT_TIER)}`).join('\n\n---\n\n')}`);

doc.push(`---

## I. What the two cores are

**The UU core (${UU_CORE.length} entries):** ${UU_CORE.map(d => `${d.n} (${d.sp})`).join(', ')}.

**The OU core (${OU_CORE.length} entries):** ${OU_CORE.map(d => `${d.n} (${d.sp})`).join(', ')}.

Every cell states attacker, nature, EVs and item; defenders carry the spread and
item named in the row. These are **representative test sets**, not usage sets —
RedGPT has no usage data.

**Read the two together.** A candidate that breaks the UU core and also breaks
the OU core is a Pokémon the ladder has nowhere to put; one that breaks the UU
core and is walled by the OU core is exactly what a promotion is *for*; one that
breaks neither is not a promotion candidate whatever its stat line says.

Classification — hard counter, reliable counter, soft counter, check,
revenge-only, not an answer — is yours. The engine supplies damage; recovery,
speed, priority and hazard chip are in sections C, L, M, O and P.

---

## J. UU revenge / check matrix

UU's own counterplay into each upward candidate. Attackers are **representative
test sets**; the target sits on its own offensive spread from section G.

| Candidate | ${REVENGE.map(a => `${a.n} ${Dex.move(a.mv).name}`).join(' | ')} |
| --- | ${REVENGE.map(() => '---').join(' | ')} |
${UP_CANDIDATES.map(c => {
  const target = setFor(c.entry, SPREADS[c.spread], {moves: ['tackle']});
  return `| ${c.entry.name} | ` + REVENGE.map(a => calcCell(calc(a.cfg, target, a.mv))).join(' | ') + ' |';
}).join('\n')}

**If UU already answers a candidate cleanly, that is an argument for it staying**
— the promotion case needs UU's counterplay to be insufficient, not merely
inconvenient.

---

## K. There is no downward role comparison

Section K compares each demotion candidate against the tier below in the RU, NU
and PU packets. **This pass proposes no demotions** (section E), so the
comparison does not exist here.

The lettering is kept aligned with the sibling packets deliberately, so that
"section L is the speed table" means the same thing in all six. This section is
empty on purpose rather than missing by accident.

The upward role comparison, which is the one that exists here, is **section H**.

---`);

doc.push(`## L. UU speed-tier table

Every UU entry at base Speed 80+. **Priority is not Speed** — that is section M.

${speedTable(SUBJECT, SUBJECT_TIER)}

**The same table for OU**, so the two ladders can be read against each other:

${speedTable(UP, UP_TIER, 100)}

**Conditional speed abilities in UU** — none is active by default, and the table
above does **not** assume any of them:

${(() => {
  const {abil} = envTable(SUBJECT_TIER);
  return [['swiftswim', 'Swift Swim — needs rain'], ['chlorophyll', 'Chlorophyll — needs sun'],
    ['sandrush', 'Sand Rush — needs sandstorm'], ['slushrush', 'Slush Rush — needs snow'],
    ['unburden', 'Unburden — needs its item consumed, so **no forme entry can use it**'],
    ['speedboost', 'Speed Boost — +1 at the end of each turn'],
    ['quickfeet', 'Quick Feet — needs a status; the Orbs fire ON ENTRY, so this is live from turn one'],
    ['lightmetal', 'Light Metal — **+1 Speed on EVERY entry**, resets on switch-out (RedGPT redesign)'],
    ['motordrive', 'Motor Drive — +1 Speed on absorbing an Electric move'],
    ['quarkdrive', 'Quark Drive — needs Electric Terrain or Booster Energy'],
    ['protosynthesis', 'Protosynthesis — needs sun or Booster Energy'],
    ['weakarmor', 'Weak Armor — +2 Speed when hit by a physical move']]
    .map(([id, label]) => `- **${label}**: ${abil([id]).join(', ') || '_nobody in UU_'}`).join('\n');
})()}

---

## M. UU priority table

Engine priority for every UU entry that has any, including Grassy Glide's
engine-side +1. Conditional entries are annotated.

${priorityTable(SUBJECT)}

---`);

doc.push(`## N. Weather / terrain / Trick Room / Tailwind environment

${(() => {
  const {learn, abil} = envTable(SUBJECT_TIER);
  return `**Weather by ability (automatic):** ${cap(abil(['drizzle', 'drought', 'sandstream', 'snowwarning', 'desolateland', 'primordialsea', 'deltastream', 'orichalcumpulse', 'hadronengine']), 24)}.

**Weather abusers by ability:** ${cap(abil(['swiftswim', 'chlorophyll', 'sandrush', 'slushrush', 'sandforce', 'icebody', 'raindish', 'solarpower', 'leafguard', 'protosynthesis']), 24)}.

**Terrain by ability:** ${cap(abil(['electricsurge', 'grassysurge', 'mistysurge', 'psychicsurge']), 24)}.

**Trick Room setters:** ${cap(learn('trickroom'), 24)}. The **Warp Prism** makes Trick Room *the holder sets* last **8** turns instead of 5 — **but a forme entry cannot hold one.**

**Slow breakers that want it** (base Speed ≤ 60 with real offence): ${cap(SUBJECT.filter(e => {
    const s = Dex.species(e.id); const p = P.profile(e, {tier: SUBJECT_TIER});
    return s.baseStats.spe <= 60 && Math.max(bestOf(p, 'atkPlus'), bestOf(p, 'spaPlus')) >= BAR.atk50;
  }).map(e => e.name), 24)}.

**Tailwind setters:** ${cap(learn('tailwind'), 24)}. The **Wind Sock** makes Tailwind *the holder sets* last **7** turns instead of 4.`;
})()}

---

## O. UU hazard environment

${(() => {
  const {learn, abil} = envTable(SUBJECT_TIER);
  return `**Stealth Rock:** ${cap(learn('stealthrock'), 30)}

**Spikes:** ${cap(learn('spikes'), 30)}

**Toxic Spikes:** ${cap(learn('toxicspikes'), 30)}

**Sticky Web:** ${cap(learn('stickyweb'), 30)}

**Rapid Spin:** ${cap(learn('rapidspin'), 30)}

**Defog:** ${cap(learn('defog'), 30)}

**Mortal Spin / Tidy Up / Court Change:** ${cap([...new Set([...learn('mortalspin'), ...learn('tidyup'), ...learn('courtchange')])], 30)}

**Magic Bounce:** ${abil(['magicbounce']).join(', ') || 'none'}

**Ghost types (block Rapid Spin):** ${cap(rosters[SUBJECT_TIER].filter(e => Dex.species(e.id).types.includes('Ghost')).map(e => e.name), 30)}

**Heavy-Duty Boots are unavailable to all ${SUBJECT.filter(e => e.kind === 'forme').length} forme entries**, because the stone occupies
the slot. The Rock-weak ones pay the most: ${cap(SUBJECT.filter(e => e.kind === 'forme' && Dex.typeEffectiveness && Dex.species(e.id).types.length ? (() => {
    try { return Dex.typeEffectiveness('Rock', Dex.species(e.id).types) >= 2; } catch { return false; }
  })() : false).map(e => `${e.name} (×${(() => { try { return Dex.typeEffectiveness('Rock', Dex.species(e.id).types); } catch { return '?'; } })()})`), 30)}.`;
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
    const ab = P.abilitiesOf(e).filter(a => ['regenerator', 'poisonheal', 'raindish', 'icebody', 'waterabsorb', 'voltabsorb', 'harvest', 'flashfire', 'sapsipper'].includes(Dex.toID(a)));
    if (ab.length) passive.push(`${e.name} (${ab.join('/')})`);
  }
  return `**TRUE IMMEDIATE RECOVERY** — Recover, Roost, Slack Off, Shore Up, Soft-Boiled, Milk Drink, Morning Sun, Synthesis, Moonlight (${trueRec.length} entries):

${cap(trueRec, 60, '; ')}

**REST** — two helpless turns unless Early Bird, Sleep Talk or Snore is in the set. **Not** equivalent to the above (${rest.length} entries):

${cap(rest, 60, '; ')}

**DRAINING** — proportional to damage dealt, so it fails against a resist and against a wall (${drain.length} entries):

${cap(drain, 60, '; ')}

**PASSIVE / absorbs** (${passive.length} entries; **Leftovers is unavailable to every forme entry**):

${cap(passive, 60, '; ')}`;
})()}

---`);

doc.push(`## Q. Item and ability edge cases — the Mega opportunity cost

**This is the section with no counterpart in the ZU packet**, where item freedom
was universal. In UU it is the central asymmetry of the rung.

**Forme entries whose item slot is spent (${SUBJECT.filter(e => e.kind === 'forme').length}):**

| Forme | Forced item | Base | Base's own tier | Ability |
| --- | --- | --- | --- | --- |
${SUBJECT.filter(e => e.kind === 'forme').map(e => {
  const base = e.base ? Dex.species(e.base) : null;
  return `| ${e.name} | ${itemName(e.item)} | ${base ? base.name : '—'} | ${base ? (base.tier || '—') : '—'} | ${P.abilitiesOf(e).join('/')} |`;
}).join('\n')}

**UU species barred from their own Mega (${formeProbe.above}):** see section R — every one
refused by the real validator, with the species itself staying legal.

### Trapping in UU

**UU trapping-ability holders: ${trapperNamesIn(SUBJECT).join(', ') || '_none_'}.**

For context, across the whole ladder:

| Tier | Trapping-ability holders |
| --- | --- |
${Formats.TIER_ORDER.filter(t => rosters[t].length).map(t => `| ${t} | ${cap(trapperNamesIn(rosters[t]), 12)} |`).join('\n')}

**The counterplay measured in the global trapping audit applies unchanged:**
Ghost typing, Shed Shell, Guard Dog, all six pivot moves (U-turn, Volt Switch,
Flip Turn, Parting Shot, Baton Pass, Teleport) and phazing all escape a trap, and
the trap ends the moment the trapper leaves or faints. Mold Breaker does **not**
break trapping.

---

## R. Transformation / forme legality

Every UU entry was checked for a route to a higher-tier forme in battle.

**${formeProbe.tested} item-driven routes exist from a UU species; ${formeProbe.legal} are legal in UU and
${formeProbe.above} target a forme above UU, of which **${formeProbe.aboveLegal} are legal**.** Each was put through
\`Validation.validateTeam\` in the UU format rather than read off the data:

| UU species | Item | Forme it would make | That forme's tier | Direction | Validator |
| --- | --- | --- | --- | --- | --- |
${formeProbe.rows.sort().join('\n')}

**Ability-driven routes from UU:**

${(() => {
  const out = [];
  for (const e of rosters[SUBJECT_TIER]) {
    for (const route of (Formats.formeAbilities ? Formats.formeAbilities(e.id) : []) || []) {
      const t = route.tier || '?';
      const gated = Formats.tierRank(t) < Formats.tierRank(SUBJECT_TIER);
      out.push(`- **${e.name}** → ${route.forme} via **${route.abilityName}** (${route.when}) — target tier **${t}**. ${gated ? '**Higher than UU: the ability is refused at team validation**, and the Pokémon stays legal on its other ability.' : 'Same rung or below — no legality issue.'}`);
    }
  }
  return out.join('\n') || '_None. No UU entry reaches another forme through an ability._';
})()}

**Move-driven routes from UU:**

${(() => {
  const rows = moveRoutes.filter(r => r.tier === SUBJECT_TIER);
  return rows.length ? rows.map(r => `- **${r.from}** → ${r.to} via **${r.move}** — target tier **${r.target}**.`).join('\n')
    : '_None. The only move-driven forme routes on the entire ladder belong to Meloetta — see Part II, section MEL9._';
})()}

**Aegislash is the one entry whose forme changes without any route to gate**, and
it is worth stating explicitly: **both Aegislash and Aegislash-Blade are UU**, and
Stance Change is Aegislash's **only** ability, so it is tiered as one unit — which
is what the "inseparable" half of the ability-forme rule means. Their profiles in
section C differ enormously (${(() => { const a = P.profile(byName('Aegislash') || {id: 'aegislash', name: 'Aegislash', kind: 'species'}, {tier: 'UU'}); const b = P.profile(byName('Aegislash-Blade') || {id: 'aegislashblade', name: 'Aegislash-Blade', kind: 'species'}, {tier: 'UU'}); return `Shield Atk ${bestOf(a, 'atkPlus')} / Blade Atk ${bestOf(b, 'atkPlus')}`; })()}) and they are the same Pokémon in one battle.

---`);

doc.push(`## S. Mechanical outliers surfaced by the broad scan

**Mechanical flags only — reasons to look, NOT recommendations.** ${upFlagged.length} of
${SUBJECT.length} UU entries tripped three or more. No arbitrary cap was applied.

${upFlagged.map(f => `- **${f.e.name}** (${f.s.types.join('/')}, BST ${f.s.bst}, ${f.p.abilities.join('/')}${f.e.kind === 'forme' ? `, item forced: ${itemName(f.e.item)}` : ''}) — ${f.reasons.join('; ')}.`).join('\n')}

### The offensive ceilings, stated separately because they are the obvious first question

**Highest engine-resolved Attack in UU**, against OU's maximum of ${(() => { const v = UP.map(e => bestOf(P.profile(e, {tier: 'OU'}), 'atkPlus')); return Math.max(...v); })()}:

| Entry | Atk (+nature, 252) | Base Atk | Ability doing the work |
| --- | --- | --- | --- |
${SUBJECT.map(e => ({e, p: P.profile(e, {tier: SUBJECT_TIER})}))
  .map(x => ({name: x.e.name, v: bestOf(x.p, 'atkPlus'), base: Dex.species(x.e.id).baseStats.atk, ab: x.p.abilities.join('/')}))
  .sort((a, b) => b.v - a.v).slice(0, 10)
  .map(x => `| ${x.name} | **${x.v}** | ${x.base} | ${x.ab} |`).join('\n')}

**Highest engine-resolved Special Attack in UU**, against OU's maximum of ${(() => { const v = UP.map(e => bestOf(P.profile(e, {tier: 'OU'}), 'spaPlus')); return Math.max(...v); })()}:

| Entry | SpA (+nature, 252) | Base SpA | Ability |
| --- | --- | --- | --- |
${SUBJECT.map(e => ({e, p: P.profile(e, {tier: SUBJECT_TIER})}))
  .map(x => ({name: x.e.name, v: bestOf(x.p, 'spaPlus'), base: Dex.species(x.e.id).baseStats.spa, ab: x.p.abilities.join('/')}))
  .sort((a, b) => b.v - a.v).slice(0, 10)
  .map(x => `| ${x.name} | **${x.v}** | ${x.base} | ${x.ab} |`).join('\n')}

**Highest engine-resolved Speed in UU**, against OU's maximum of ${(() => { const v = UP.map(e => bestOf(P.profile(e, {tier: 'OU'}), 'spePlus')); return Math.max(...v); })()}:

| Entry | Spe (+nature, 252) | Base Spe | Ability |
| --- | --- | --- | --- |
${SUBJECT.map(e => ({e, p: P.profile(e, {tier: SUBJECT_TIER})}))
  .map(x => ({name: x.e.name, v: bestOf(x.p, 'spePlus'), base: Dex.species(x.e.id).baseStats.spe, ab: x.p.abilities.join('/')}))
  .sort((a, b) => b.v - a.v).slice(0, 10)
  .map(x => `| ${x.name} | **${x.v}** | ${x.base} | ${x.ab} |`).join('\n')}

### Multi-hit users in UU

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
    const users = rosters[SUBJECT_TIER].filter(e => {
      const src = e.kind === 'forme' && e.base ? Dex.toID(e.base) : e.id;
      return (Dex.legalMoveList(src) || []).some(x => Dex.toID(x) === id);
    }).map(e => e.name);
    if (users.length) rows.push(`| ${m.name} | ${m.type} | ${m.basePower} × ${JSON.stringify(m.multihit)} | ${cap(users, 18)} |`);
  }
  const sl = rosters[SUBJECT_TIER].filter(e => P.abilitiesOf(e).some(a => Dex.toID(a) === 'skilllink')).map(e => e.name);
  return `| Move | Type | BP × hits | UU users |
| --- | --- | --- | --- |
${rows.join('\n') || '| _none_ | | | |'}

**Skill Link holders in UU: ${sl.join(', ') || 'none'}.**`;
})()}

---

## T. Remaining genuinely unresolved questions (Part I)

1. **No usage, ladder, win-rate, tournament or popularity data exists in RedGPT.**
   There is no metagame history for any tier. Every judgement must be mechanical.
2. **Nothing in UU has been played by a human.** The ladder was rebuilt on
   2026-08-15 and revised through eight passes since.
3. **The shared profiler quotes conditional attacks at full power, and the scope
   is the whole ladder.** \`tools/lib/profiler.js\` ranks a movepool by delivered
   power and never consults \`moveSpecialFailure\`. Measured across every rung:
   **457 quoted lines across 387 entries** — Last Resort 154, Fake Out 97,
   Belch 63, Steel Roller 46, Mirror Coat 40, Fling 37, Counter 14, Snore 5,
   Endeavor 1.
   **This packet annotates every one of them.** The five sibling packets
   (\`UU_FINAL_EVIDENCE\`, \`RU_\`, \`NU_\`, \`PU_\`, \`ZU_FINAL_EVIDENCE\`) do **not** —
   they were generated before this was found, so a Last Resort, Fake Out, Belch,
   Steel Roller, Mirror Coat or Fling line quoted from any of them is missing its
   condition. Fixing the shared profiler would rewrite the evidence behind five
   completed audits, which is a project decision rather than a side effect of
   this generator; it is reported, not taken.
   **The project already declares the answer and the profiler does not read
   it** — \`RandomTeams.AVOID\` (${AVOID_IDS.length} ids, ${AVOID_DAMAGING.length} damaging) exists for exactly this
   question and is kept current.
${(() => {
  const missed = unannotatedAvoid([...SUBJECT, ...UP], SUBJECT_TIER);
  return missed.length
    ? `   **Damaging \`AVOID\` entries this packet quotes but leaves unannotated:\n   ${missed.join(', ')}.** Ask before letting one of those decide a verdict.`
    : '   **Every damaging `AVOID` entry quoted anywhere in this packet carries an\n   annotation**, checked live across both rosters rather than asserted.';
})()}
4. **Conditional abilities are read at their unactivated value.** Guts, Quick
   Feet, Protosynthesis, Quark Drive, Unburden, Swift Swim, Harvest, Weak Armor
   and the rest are reported unboosted. The Orbs fire **on entry**, so for a Guts
   or Quick Feet holder the activated number is the one that matters — ask and it
   can be measured.
5. **A species may run any of its abilities.** Offence is reported per ability,
   but the movepool sections assume the first.
6. **Aegislash is profiled as two entries and plays as one.** Stance Change is
   its only ability, so the two profiles in section C are two halves of one
   Pokémon, and neither alone is what an opponent faces.
7. **The damage matrices assume no hazards and no residual chip.** The
   calculator does not model entry hazards; sections O and P carry the material
   for that separately.
8. **The 0-2 HP rounding difference from Showdown's calculator** is known and
   documented; it never changes a tier.

**If a number you need is missing, ask for it** rather than estimating. Any
damage, speed, trapping or legality question can be answered against the real
engine.

---`);

/* ================= PART II ================= */
const melS = Dex.species('Meloetta'), pirS = Dex.species('Meloetta-Pirouette');
doc.push(`# Part II — Meloetta and Meloetta-Pirouette

## MEL1. The question, and what the Pirouette tier actually decides

**Meloetta is ${melS.tier}. Meloetta-Pirouette is ${pirS.tier}.** One rung apart.

**Meloetta-Pirouette carries \`battleOnly: "${pirS.battleOnly}"\`, so it can never be picked.**
Verified through the real validator: selecting it directly is refused in **every**
tier format, with *"Meloetta-Pirouette is a battle-only forme. … use Meloetta
instead"*. It exists only as the result of Relic Song.

So its tier does exactly one job:

> **It decides the rung from which Relic Song is legal**, through
> \`Formats.illegalFormeMoves\` — the *move* half of "ban the route, not the
> Pokémon", which was built for this and has no other user on the ladder.

That makes the two questions concrete:

1. **Is RU right for Pirouette?** Move it up and Relic Song is refused in RU too,
   so an RU Meloetta plays as a special attacker with no transform. Move it down
   to NU and an NU Meloetta gets the forme.
2. **Is NU right for Meloetta itself?** Its tier decides where the *Pokémon*
   plays at all, and below RU it plays without the move.

**They are not the same question and can be answered independently.** Meloetta
could be NU with Pirouette in UU; it could be RU with Pirouette in RU.

**Why this has never been audited before:** until this session Relic Song was an
ordinary 75 BP sound move with no forme code behind it, and PROJECT_CONTEXT
recorded Pirouette as *packaged-but-dead* — *"there is no route into it"*. The
NU pass gave it RU as **roster bookkeeping** and a control was added to stop
anybody retiering it on that basis. That control has served its purpose; this is
the first time the forme can actually be reached.

---

## MEL2. The route, walked in a real battle

Not read off the data — played. Level 100, no EVs, max IVs, neutral nature, so the
numbers are directly comparable row to row.

| Point in the battle | Forme | Typing | HP | Atk | Def | SpA | SpD | Spe |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${routeTrace.rows.map(r => `| ${r.tag} | ${r.forme} | ${r.types} | ${r.hp} | ${r.atk} | ${r.def} | ${r.spa} | ${r.spd} | ${r.spe} |`).join('\n')}

**Four properties, each measured rather than assumed:**

- **It transforms on use.** Normal/Psychic → **Normal/Fighting**, and the stat
  line does **not** simply mirror. Attack and Special Attack **swap**
  (${routeTrace.rows[0].atk} ↔ ${routeTrace.rows[0].spa}). The other three **rotate**: Defence takes Speed's old
  value (${routeTrace.rows[0].def} → ${routeTrace.rows[1].def}), Speed takes Special Defence's (${routeTrace.rows[0].spe} → ${routeTrace.rows[1].spe}),
  and Special Defence takes Defence's (${routeTrace.rows[0].spd} → ${routeTrace.rows[1].spd}). Reading it as a
  Defence/Special-Defence swap gets Pirouette's bulk wrong in both directions.
- **It toggles.** A second Relic Song returns it to Aria forme; a third
  transforms it again.
- **It reverts on switch-out.** The bench slot read **${routeTrace.benched}** the moment it
  left the field, and it came back in Aria forme. **This is a per-appearance
  state, not a Battle-Bond-style permanent upgrade** — every time it switches in
  it must spend a turn again.
- **HP does not change.** ${routeTrace.rows[0].hp} in both formes, so the two are equally
  easy to bring into range.

**The base stat lines:**

| | Types | HP | Atk | Def | SpA | SpD | Spe | BST |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Meloetta | ${melS.types.join('/')} | ${melS.baseStats.hp} | ${melS.baseStats.atk} | ${melS.baseStats.def} | ${melS.baseStats.spa} | ${melS.baseStats.spd} | ${melS.baseStats.spe} | ${melS.bst} |
| Meloetta-Pirouette | ${pirS.types.join('/')} | ${pirS.baseStats.hp} | ${pirS.baseStats.atk} | ${pirS.baseStats.def} | ${pirS.baseStats.spa} | ${pirS.baseStats.spd} | ${pirS.baseStats.spe} | ${pirS.bst} |

**BST is identical at ${melS.bst}.** This is a redistribution, not an upgrade — which is
why the tiering question is genuinely open rather than obvious.

---

## MEL3. Relic Song itself

| Property | Value |
| --- | --- |
| Type / category | ${Dex.move('relicsong').type} / ${Dex.move('relicsong').category} |
| Base power | **${Dex.move('relicsong').basePower}** |
| Accuracy | ${Dex.move('relicsong').accuracy}% |
| PP (battle maximum, PP-Upped) | ${Math.floor(Dex.move('relicsong').pp * 8 / 5)} (base ${Dex.move('relicsong').pp}) |
| Secondary | ${Dex.move('relicsong').secondary.chance}% ${Dex.move('relicsong').secondary.status === 'slp' ? '**sleep**' : Dex.move('relicsong').secondary.status} |
| Flags | ${Object.keys(Dex.move('relicsong').flags).join(', ')} |

**Two consequences of those flags, both measured.**

### Serene Grace is Meloetta's only ability, and it doubles the sleep chance

${sereneGrace.trials} single-turn battles on fixed seeds, Relic Song into a Blissey:

| Meloetta's ability | Target asleep after one Relic Song |
| --- | --- |
| **Serene Grace** (its real and only ability) | **${sereneGrace.withSG} / ${sereneGrace.trials}** (${(sereneGrace.withSG / sereneGrace.trials * 100).toFixed(1)}%) |
| Pressure (control — no secondary-rate hook) | ${sereneGrace.control} / ${sereneGrace.trials} (${(sereneGrace.control / sereneGrace.trials * 100).toFixed(1)}%) |

The packaged secondary is **${sereneGrace.packaged}%**, so the control row is the packaged rate and
the Serene Grace row is double it. **The move that performs the transformation is
also a ${sereneGrace.packaged * 2}% sleep chance**, and Sleep Clause is on in every tier format —
so it is one sleeper per battle, not a lock.

### It is a sound move, so it goes through a Substitute

Blissey establishes a Substitute on turn one; Meloetta attacks on turn two.

| Move | Sound? | Substitute up when it landed | HP the **Pokémon** lost | Substitute afterwards |
| --- | --- | --- | --- | --- |
${subProbe.map(r => `| ${r.move} | ${r.sound ? 'yes' : '**no**'} | ${r.subUp ? 'yes' : 'no'} | **${r.lost}** | ${r.subAfter > 0 ? r.subAfter + ' HP, still standing' : 'gone'} |`).join('\n')}

**Psychic is the control** and it is the row that proves the others. The
Substitute is worth ${subProbe[0].subAfter} HP when it goes up. Relic Song and Hyper Voice leave it
at **${subProbe[0].subAfter} — untouched** and take ${subProbe[0].lost} and ${subProbe[1].lost} off the Pokémon behind it;
Psychic, which is not a sound move, deals **${subProbe[2].lost}** to the Pokémon and knocks the
doll from ${subProbe[0].subAfter} to ${subProbe[2].subAfter} instead. Relic Song **also still transforms** while
doing it, so the forme change is not conditional on the target being hit.

---

## MEL4. Both formes profiled in full

Conditional attacks are annotated. **Note that both profiles are drawn from the
same ${(Dex.legalMoveList('meloetta') || []).length}-move legal pool** — Pirouette is a battle-only forme with no
learnset of its own, so the two differ in *stats and typing only*.

### Meloetta (Aria) — ${melS.tier}

${renderProfile(MEL)}

### Meloetta-Pirouette — ${pirS.tier}

${renderProfile(PIR)}

**The single most important line above**: Pirouette's Normal STAB is quoted as
**Last Resort 140**, and Last Resort **fails until every other move in the set has
been used**. Measured: leading with it deals **${lastResortProbe.lost}** damage. Its real Normal
STAB options are what remain after that — see the coverage rows.

---

## MEL5. What the route costs

A Pirouette set is not a Meloetta set with better stats. Four costs, all
structural:

1. **A permanent move slot.** Relic Song is the only route, so it occupies one of
   four slots for the whole battle. A Pirouette effectively runs **three**
   attacking or utility moves.
2. **A turn, on every appearance.** It reverts on switch-out (section MEL2), so
   every entry costs a turn to re-transform. Relic Song does deal its ${Dex.move('relicsong').basePower} BP
   while doing so, which is not nothing — but off the **wrong stat**.
3. **The transform runs off the stat it is giving up.** Relic Song is
   **Special**, and the moment it resolves Special Attack drops from ${routeTrace.rows[0].spa} to
   ${routeTrace.rows[1].spa}. So the move is cast at Aria's SpA and everything after it at
   Pirouette's Attack.
4. **Special Defence collapses.** ${routeTrace.rows[0].spd} → ${routeTrace.rows[1].spd}, a fall of
   ${routeTrace.rows[0].spd - routeTrace.rows[1].spd} points, in exchange for ${routeTrace.rows[1].def - routeTrace.rows[0].def} points of Defence and
   ${routeTrace.rows[1].spe - routeTrace.rows[0].spe} of Speed. **Pirouette is markedly easier to kill specially.**

**Against that, what it buys:** Attack ${routeTrace.rows[0].atk} → ${routeTrace.rows[1].atk}
(+${routeTrace.rows[1].atk - routeTrace.rows[0].atk}), Speed ${routeTrace.rows[0].spe} → ${routeTrace.rows[1].spe}
(+${routeTrace.rows[1].spe - routeTrace.rows[0].spe}), and a Fighting STAB on a Pokémon that otherwise
attacks off Normal and Psychic.

**Item freedom is total for both formes** — neither is a forme *item* holder, so
Choice Band, Choice Scarf, Life Orb, Leftovers, Assault Vest, Heavy-Duty Boots and
a Ring Target are all available. Note a **Choice item locks it out of the
transform** once it has attacked, and a **Choice Scarf on the Aria forme reaches
${Math.floor(routeTrace.rows[0].spe * 1.5)} Speed against Pirouette's un-Scarfed ${routeTrace.rows[1].spe}**, which is a real
alternative to transforming at all.

---

## MEL6. Damage matrices

**Pirouette**, ${SPREADS.physFast.nature} ${JSON.stringify(SPREADS.physFast.evs)}, Life Orb — a **representative test set** built
from unconditional moves only.

### Against an RU defensive core — the rung Pirouette's tier names

${melMatrix(PIR, PIR_MOVES, 'physFast', MEL_CORES.RU, 'RU')}

### Against an NU defensive core — the rung the gate currently protects

${melMatrix(PIR, PIR_MOVES, 'physFast', MEL_CORES.NU, 'NU')}

### Against a UU defensive core — the rung above

${melMatrix(PIR, PIR_MOVES, 'physFast', MEL_CORES.UU, 'UU')}

### And Meloetta (Aria) for comparison, ${SPREADS.specFast.nature} ${JSON.stringify(SPREADS.specFast.evs)}, Life Orb

**Against RU:**

${melMatrix(MEL, MEL_MOVES, 'specFast', MEL_CORES.RU, 'RU')}

**Against NU** — this is what an NU Meloetta actually does, since Relic Song is
refused there:

${melMatrix(MEL, MEL_MOVES, 'specFast', MEL_CORES.NU, 'NU')}

**The comparison that matters** is not Aria against Pirouette in the abstract —
it is *"does the team that spent a slot and a turn on Relic Song get more than
the team that spent neither"*, which the two sets of rows above answer column by
column.

---

## MEL7. Speed placement

Pirouette's engine-resolved Speed at max investment is
**${bestOf(P.profile(PIR, {tier: 'RU'}), 'spePlus')}**; Aria's is **${bestOf(P.profile(MEL, {tier: 'NU'}), 'spePlus')}**.

| Rung | Entries at base Speed 80+ | Median max +Spe | Fastest | Pirouette would rank |
| --- | --- | --- | --- | --- |
${['UU', 'RU', 'NU'].map(t => {
  const vals = rosters[t].map(e => P.offence(e, P.abilityOf(e)).spePlus).sort((a, b) => b - a);
  const fast = rosters[t].filter(e => Dex.species(e.id).baseStats.spe >= 80).length;
  const med = vals[Math.floor(vals.length / 2)];
  const pirSpe = bestOf(P.profile(PIR, {tier: 'RU'}), 'spePlus');
  const rank = vals.filter(v => v > pirSpe).length + 1;
  return `| ${t} | ${fast} | ${med} | ${vals[0]} | **${rank} of ${vals.length}** |`;
}).join('\n')}

**The RU speed tier, base 80+:**

${speedTable(PIR_HOME, 'RU', 90)}

**The NU speed tier, base 80+:**

${speedTable(PIR_DOWN, 'NU', 85)}

---

## MEL8. The comparison bars

**Carried in full, not pointed at.** The rung Pirouette's tier names is **RU**,
the rung the gate protects is **NU**, and the rung above is **UU** — whose ${SUBJECT.length}
entries are already profiled in **Part I section C** and are not repeated here.
RU and NU are below, in the same compact form Part I section D uses for OU.

### The RU roster — ${PIR_HOME.length} entries, the rung Meloetta-Pirouette is tiered into

${PIR_HOME.map(e => renderProfile(e, {compact: true})).join('\n\n')}

### The NU roster — ${PIR_DOWN.length} entries, where Meloetta itself sits and what the gate protects

${PIR_DOWN.map(e => renderProfile(e, {compact: true})).join('\n\n')}

### Closest RU entries by role, typing and BST — Pirouette

${roleCompare(PIR, PIR_HOME, 'RU', 'RU')}

### Closest NU entries — Pirouette, if the gate moved down

${roleCompare(PIR, PIR_DOWN, 'NU', 'RU')}

### Closest UU entries — Pirouette, if the gate moved up

${roleCompare(PIR, SUBJECT, 'UU', 'RU')}

### Closest NU entries — Meloetta itself, where it sits today

${roleCompare(MEL, PIR_DOWN, 'NU', 'NU')}

### Closest RU entries — Meloetta, if it moved up with its forme

${roleCompare(MEL, PIR_HOME, 'RU', 'NU')}

---

## MEL9. The gate, exercised through the real validator

Meloetta with Relic Song, and the same set without it, put through
\`Validation.validateTeam\` in **every** format:

| Format | Meloetta **with** Relic Song | Meloetta **without** it |
| --- | --- | --- |
${gateRows.map(r => `| ${r.name} | ${r.withSong === 'legal' ? '**legal**' : r.withSong.replace(/\|/g, '\\|')} | ${r.without === 'legal' ? '**legal**' : r.without.replace(/\|/g, '\\|')} |`).join('\n')}

**Read the two columns together.** The gate refuses the *move* and keeps the
*Pokémon*, which is the whole design — in NU, Meloetta is legal and Relic Song is
not. In PU and ZU both fail, but for different reasons: the species is out of
tier **and** the move is refused.

**Every move-driven forme route on the entire ladder:**

| Rung | From | Move | To | Target tier |
| --- | --- | --- | --- | --- |
${moveRoutes.map(r => `| ${r.tier} | ${r.from} | ${r.move} | ${r.to} | ${r.target} |`).join('\n')}

**${moveRoutes.length} routes, and both of them are Meloetta's** — the second is the toggle back,
which \`illegalFormeMoves\` filters out because a route to a *lower* tier is no
threat to a format. So the move half of the forme gate exists for exactly one
Pokémon, and this audit is the whole of its subject matter.

**One asymmetry with the ability half, deliberate and worth knowing:**
\`formeAbilities\` requires the base to have **two** abilities, because refusing
the only one would delete the Pokémon. **A move ban never can**, so \`formeMoves\`
has no such guard — which is why Relic Song can be refused even though Serene
Grace, Meloetta's only ability, cannot be.

---

## MEL10. Remaining genuinely unresolved questions (Part II)

1. **Neither forme has ever been played, by anybody.** Relic Song was implemented
   this session. There is no usage, ladder or win-rate data in RedGPT for any
   tier, so every judgement here is mechanical.
2. **Pirouette's RU tier was never a judgement.** It was assigned during the NU
   pass as roster bookkeeping, when nothing could reach the forme, and the pass
   said so explicitly. Treat it as an **unreviewed default**, not as a prior.
3. **The AI has never been taught about the transform.** Whether \`ai.js\` values
   Relic Song as a forme change rather than as a 75 BP sound move is not measured
   here and does not bear on legality, but it does bear on how the forme performs
   against a computer opponent.
4. **Last Resort's condition is annotated but its practical value is not
   measured.** It is 140 BP Normal STAB that arrives on turn four at the earliest.
   Whether a four-slot set can afford to enable it — alongside Relic Song, which
   already takes a slot — is a set-building question the packet does not answer.
5. **The matrices assume the transform has already happened.** They do not charge
   the turn, the moveslot or the Special Attack loss that section MEL5 itemises.
   Those are stated separately so they can be weighed rather than buried in a
   damage number.
6. **Sleep Clause interacts with the 20% secondary and is not modelled here.**
   One sleeper per battle is the rule in every tier format; whether that makes
   the secondary a tempo tool or a win condition is a judgement.
7. **A Choice Scarf Aria may simply be the better set**, and this packet does not
   settle it. The numbers to compare are in MEL5 and MEL6.

**If a number you need is missing, ask for it** rather than estimating. Any
damage, speed, forme, legality or probability question can be answered against
the real engine.`);

const out = doc.join('\n');
if (CHECK) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur === out) { console.log('unchanged'); process.exit(0); }
  console.log('STALE — run: node tools/uu-ou-evidence.js'); process.exit(1);
}
fs.writeFileSync(OUT, out);
console.log(`UU(subject) ${SUBJECT.length} | OU(up bar) ${UP.length} | UU formes ${SUBJECT.filter(e => e.kind === 'forme').length} | UU estimated ${SUBJECT.filter(e => e.estimated).length} | scan-flagged ${upFlagged.length} | matrices ${UP_CANDIDATES.length} | UU core ${UU_CORE.length} | OU core ${OU_CORE.length} | forme routes ${formeProbe.tested} (${formeProbe.above} above UU, ${formeProbe.aboveLegal} legal)`);
console.log(`Meloetta: RU bar ${PIR_HOME.length} | NU bar ${PIR_DOWN.length} | Serene Grace sleep ${sereneGrace.withSG}/${sereneGrace.trials} vs control ${sereneGrace.control}/${sereneGrace.trials} | Last Resort led for ${lastResortProbe.lost} | move-forme routes ${moveRoutes.length}`);
console.log('wrote docs/UU_OU_EVIDENCE.md');
