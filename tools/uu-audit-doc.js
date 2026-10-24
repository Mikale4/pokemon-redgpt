#!/usr/bin/env node
/*
 * Generate the blocks in `docs/UU_FORMAT_AUDIT.md` from the live game.
 *
 * The audit asks a two-directional question — which UU entries are too strong
 * for the tier, and which are too weak — so the briefing has to carry three
 * things: the UU roster in full, and the rungs either side of it as the bars
 * that "too strong" and "too weak" are measured against.
 *
 *   node tools/uu-audit-doc.js           rewrite the generated blocks
 *   node tools/uu-audit-doc.js --check   report drift, write nothing, exit 1
 *
 * THE ONE RULE THIS FILE EXISTS TO OBEY
 *
 * **Ask the engine, never the packaged row.** A movepool summary built from
 * `move.type` / `move.basePower` / `move.priority` is wrong for every move this
 * project resolves at use time, and it has already nearly decided a tier: Ivy
 * Cudgel is packaged Grass and is Fire, Water or Rock from the Mask, so all
 * three masked Ogerpons were once reported as having no damaging STAB. Every
 * number below comes from `battle.moveType`, `battle.moveCategory` and
 * `battle.dynamicBasePower({preview: true})` against a real battle Pokemon
 * holding its real item, plus `Mechanics.ENGINE_PRIORITY` for Grassy Glide's
 * engine-side +1.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {loadEngine} = require('../tests/helpers/engine.js');
const {createProfiler} = require('./lib/profiler.js');

const ROOT = path.join(__dirname, '..');
const DOC = path.join(ROOT, 'docs/UU_FORMAT_AUDIT.md');
const CHECK = process.argv.includes('--check');
const R = loadEngine();
const {Dex, Formats, Mechanics, Calculator, Abilities, Items} = R;

const rosters = {};
for (const tier of Formats.TIER_ORDER) rosters[tier] = Formats.tierRoster(tier);

const itemName = id => (id && Dex.item(id) ? Dex.item(id).name : id);
const statLine = s => [s.baseStats.hp, s.baseStats.atk, s.baseStats.def, s.baseStats.spa, s.baseStats.spd, s.baseStats.spe].join('/');

/* ------------------------------------------------------------------ *
 * Profiling is delegated to `tools/lib/profiler.js`.
 *
 * This file used to carry its own copy, and it had four defects that the
 * shared module exists to fix — the worst being that it compared BASE Attack
 * to BASE Special Attack, so every Huge Power holder had its physical movepool
 * hidden (Mega Starmie is 656 Atk / 394 SpA once the ability is applied, and
 * its physical Waterfall does 2.6x what its Hydro Pump does). It also missed
 * the `-ate` conversions entirely, so Pixilate Hyper Voice read Normal 90
 * instead of Fairy 117.
 *
 * A second copy of "what does this Pokemon do" is exactly the drift this
 * project keeps finding, so there is one now.
 * ------------------------------------------------------------------ */
const P = createProfiler(R);

function profile(entry) {
  const p = P.profile(entry, {tier: 'UU'});
  const s = p.species;
  const out = [];
  out.push(`**${entry.name}** ${s.types.join('/')} ${s.bst} (${statLine(s)}) — ${p.abilities.join(' / ')}`);
  out.push(`  STAB: ${p.stab.join(' · ') || '**none**'}`);
  if (p.physical.length) out.push(`  Physical coverage: ${p.physical.join(', ')}`);
  if (p.special.length) out.push(`  Special coverage: ${p.special.join(', ')}`);
  if (!p.physical.length && !p.special.length) out.push('  Coverage: **none**');
  const line3 = [`Setup: ${p.setup.join(', ') || '**none**'}`,
    `Recovery: ${p.recovery.join(', ') || '**none**'}`];
  if (p.priority.length) line3.push(`Priority: ${p.priority.join(', ')}`);
  out.push('  ' + line3.join(' | '));
  const line4 = [];
  if (p.hazards.length) line4.push(`Hazards: ${p.hazards.join(', ')}`);
  if (p.removal.length) line4.push(`Removal: ${p.removal.join(', ')}`);
  if (p.pivot.length) line4.push(`Pivot: ${p.pivot.join(', ')}`);
  if (p.utility.length) line4.push(`Utility: ${p.utility.join(', ')}`);
  if (line4.length) out.push('  ' + line4.join(' | '));
  if (entry.kind === 'forme') {
    const how = entry.item ? `${entry.base} + ${itemName(entry.item)}`
      : `${entry.base} + ${Dex.ability(entry.ability) ? Dex.ability(entry.ability).name : entry.ability}`;
    out.push(`  *(reached by ${how}${entry.estimated ? ', tier **estimated**' : ''})*`);
  }
  return out.join('\n');
}

/** A one-line bar row for the tiers either side of UU. */
function barRow(entry, i) {
  const s = Dex.species(entry.id);
  const abilities = entry.kind === 'forme' ? Dex.abilityList(s.id)[0] : Dex.abilityList(s.id).join(', ');
  const how = entry.kind === 'forme'
    ? `${entry.base} + ${entry.item ? itemName(entry.item) : (entry.ability || '?')}` : '—';
  return `| ${i + 1} | ${entry.name} | ${s.types.join(' / ')} | ${s.bst} | ${statLine(s)} | ${abilities} | ${how} |`;
}

function barTable(tier) {
  const list = rosters[tier].slice().sort((a, b) => a.name.localeCompare(b.name));
  const lines = ['| # | Pokémon | Types | BST | HP/Atk/Def/SpA/SpD/Spe | Abilities | Reached by |',
    '| --- | --- | --- | --- | --- | --- | --- |'];
  list.forEach((e, i) => lines.push(barRow(e, i)));
  return lines.join('\n');
}

/* ------------------------------------------------------------------ *
 * Which of this project's rule changes actually touch the UU roster.
 * Curated list of WHAT changed (a design record, not derivable), joined
 * against live data for WHO it reaches (derived, so it cannot go stale).
 * ------------------------------------------------------------------ */
const CHANGED_ABILITIES = [
  ['Magic Guard', 'also blocks Toxic Spikes and full paralysis'],
  ['Parental Bond', 'second hit is 50% and still a separate hit'],
  ['Gale Wings', 'works at any HP, not only at full'],
  ['Aerilate', '1.3x, not 1.2x'], ['Pixilate', '1.3x, not 1.2x'], ['Refrigerate', '1.3x, not 1.2x'],
  ['Transistor', '1.5x, not 1.3x'],
  ['Disguise', 'no HP cost when it breaks'],
  ['Protean', 'retriggers on EVERY move, not once per switch-in'],
  ['Libero', 'retriggers on EVERY move, not once per switch-in'],
  ['Intrepid Sword', 'every entry, not once per battle'],
  ['Dauntless Shield', 'every entry, not once per battle'],
  ['Battle Bond', 'the legacy Ash-Greninja transformation'],
  ['Mold Breaker', 'also ignores Dark Aura and Fairy Aura'],
  ['Turboblaze', 'also ignores Dark Aura and Fairy Aura'],
  ['Teravolt', 'also ignores Dark Aura and Fairy Aura'],
  ['Supreme Overlord', 'redesigned: flat +1 Atk on entry, no fallen-ally scaling'],
  ['Download', 'redesigned: always +1 Atk AND +1 SpA'],
  ['Cloud Nine', 'redesigned: DELETES the weather on entry'],
  ['Air Lock', 'redesigned: DELETES the weather on entry'],
  ['Heatproof', 'redesigned: a full Fire IMMUNITY, not a halving'],
  ['Light Metal', 'redesigned: +1 Speed on entry'],
  ['Heavy Metal', 'redesigned: -2 Speed, +1 Def, +1 Atk on entry'],
  ['Pickup', 'redesigned: takes the last item destroyed in the battle'],
  ['Curious Medicine', 'redesigned for singles: resets the OPPOSING Pokémon\'s stat stages'],
  ['Hospitality', 'redesigned for singles: heals the most injured BENCH teammate 1/4'],
  ['Supersweet Syrup', 'fires on every entry'],
  ['Analytic', 'unchanged in effect, but see the turn-order note'],
];

const CHANGED_ITEMS = [
  ['Ring Target', 'REDESIGNED: the holder\'s attacks hit for neutral damage on a target that would be type-immune. One per team, and visible to the opponent from turn one.'],
  ['Toxic Orb', 'fires on ENTRY, not at end of turn'],
  ['Flame Orb', 'fires on ENTRY, not at end of turn'],
  ['Warp Prism', 'project invention: Trick Room the holder sets lasts 8 turns, not 5'],
  ['Wind Sock', 'project invention: Tailwind the holder sets lasts 7 turns, not 4'],
  ['Hero Charm', 'project invention: Palafin enters as Palafin-Hero'],
  ['Oran Berry', 'fires at 1/4 max HP, not 1/2'],
  ['Pink Bow', '1.1x to Normal moves (every other type booster is 1.2x)'],
  ['Polkadot Bow', '1.1x to Normal moves'],
];

function abilityImpact() {
  const uu = rosters.UU;
  const lines = ['| Ability | What RedGPT changed | UU entries with it |', '| --- | --- | --- |'];
  let touched = 0;
  for (const [name, note] of CHANGED_ABILITIES) {
    const id = Dex.toID(name);
    const holders = uu.filter(e => {
      const list = e.kind === 'forme' ? [Dex.abilityList(e.id)[0]] : Dex.abilityList(e.id);
      return list.some(a => Dex.toID(a) === id);
    }).map(e => e.name);
    if (!holders.length) continue;
    touched++;
    lines.push(`| ${name} | ${note} | ${holders.join(', ')} |`);
  }
  return {table: lines.join('\n'), touched, total: CHANGED_ABILITIES.length};
}

function itemImpact() {
  const lines = ['| Item | What RedGPT changed |', '| --- | --- |'];
  for (const [name, note] of CHANGED_ITEMS) lines.push(`| ${name} | ${note} |`);
  return lines.join('\n');
}

/** Which UU species may NOT hold which stone, and which forme it would make. */
function formeGates() {
  const lines = ['| UU Pokémon | Item it may not hold in UU | Forme it would become | That forme\'s tier |',
    '| --- | --- | --- | --- |'];
  let rows = 0;
  for (const entry of rosters.UU.filter(e => e.kind === 'species')) {
    for (const f of Dex.species(entry.id).formeItems || []) {
      if (!f.tier || Formats.tierRank(f.tier) >= Formats.tierRank('UU')) continue;
      rows++;
      lines.push(`| ${entry.name} | ${itemName(f.item)} | ${f.forme} | **${f.tier}** |`);
    }
  }
  return {table: rows ? lines.join('\n') : '_None — no UU species reaches a higher-tier forme._', rows};
}

/** Unconditional priority, Protean/Libero and legacy stats, as they land in UU. */
function ruleCarriers() {
  const uu = rosters.UU;
  const has = (entry, moveId) => {
    const src = entry.kind === 'forme' && entry.base ? Dex.toID(entry.base) : entry.id;
    return (Dex.legalMoveList(src) || []).some(m => Dex.toID(m) === moveId);
  };
  const out = [];
  const UNCONDITIONAL = ['suckerpunch', 'thunderclap', 'firstimpression', 'upperhand', 'grassyglide'];
  for (const id of UNCONDITIONAL) {
    const who = uu.filter(e => has(e, id)).map(e => e.name);
    out.push(`- **${Dex.move(id).name}** (no activation condition here): ${who.length ? who.join(', ') : '_nobody in UU_'}`);
  }
  const protean = uu.filter(e => {
    const list = e.kind === 'forme' ? [Dex.abilityList(e.id)[0]] : Dex.abilityList(e.id);
    return list.some(a => ['protean', 'libero'].includes(Dex.toID(a)));
  }).map(e => e.name);
  out.push(`- **Protean / Libero** (retype on EVERY move, and it grants STAB): ${protean.length ? protean.join(', ') : '_nobody in UU_'}`);
  const LEGACY = ['aegislash', 'aegislashblade', 'cresselia', 'zacian', 'zaciancrowned', 'zamazenta',
    'zamazentacrowned', 'chiyu', 'chienpao', 'tinglu', 'wochien'];
  const legacy = uu.filter(e => LEGACY.includes(e.id)).map(e => e.name);
  out.push(`- **Pre-nerf base stats** (\`LEGACY_BASE_STATS\`): ${legacy.length ? legacy.join(', ') : '_nobody in UU_'}`);
  return out.join('\n');
}

/* ------------------------------------------------------------------ */
function replaceBlock(source, marker, body) {
  const re = new RegExp(`(<!-- BEGIN ${marker} -->)([\\s\\S]*?)(<!-- END ${marker} -->)`);
  if (!re.test(source)) throw new Error(`missing marker block "${marker}"`);
  return source.replace(re, (_m, open, _old, close) => `${open}\n${body}\n${close}`);
}

const uuSorted = rosters.UU.slice().sort((a, b) => a.name.localeCompare(b.name));
const profiles = uuSorted.map(profile).join('\n\n');
const ladder = ['| Tier | Entries | Role in this audit |', '| --- | --- | --- |',
  `| Ubers | ${rosters.Ubers.length} | above OU; out of scope |`,
  `| **OU** | **${rosters.OU.length}** | the bar a UU entry is "too strong" against |`,
  `| **UU** | **${rosters.UU.length}** | **the tier under review** |`,
  `| **RU** | **${rosters.RU.length}** | the bar a UU entry is "too weak" against |`,
  `| NU | ${rosters.NU.length} | below RU; out of scope |`,
  `| PU | ${rosters.PU.length} | |`, `| ZU | ${rosters.ZU.length} | |`].join('\n');

const impact = abilityImpact();
const gates = formeGates();

let source = fs.readFileSync(DOC, 'utf8');
const original = source;
source = replaceBlock(source, 'GENERATED LADDER', ladder);
source = replaceBlock(source, 'GENERATED UU POOLS', `### UU — ${rosters.UU.length} entries\n\n${profiles}`);
source = replaceBlock(source, 'GENERATED OU BAR', `### OU — ${rosters.OU.length} entries\n\n${barTable('OU')}`);
source = replaceBlock(source, 'GENERATED RU BAR', `### RU — ${rosters.RU.length} entries\n\n${barTable('RU')}`);
source = replaceBlock(source, 'GENERATED ABILITY IMPACT',
  `${impact.touched} of this project's ${impact.total} changed abilities are on a UU entry.\n\n${impact.table}`);
source = replaceBlock(source, 'GENERATED ITEM IMPACT', itemImpact());
source = replaceBlock(source, 'GENERATED FORME GATES',
  `${gates.rows} UU species may not hold an item they otherwise could.\n\n${gates.table}`);
source = replaceBlock(source, 'GENERATED RULE CARRIERS', ruleCarriers());

// The move-difference table is already generated and pinned in the UU briefing;
// relocate it rather than re-deriving it against upstream a second time.
const uuBrief = fs.readFileSync(path.join(ROOT, 'docs/UU_ROSTER_FOR_TIERING.md'), 'utf8');
const diff = /<!-- BEGIN GENERATED MOVE DIFF -->([\s\S]*?)<!-- END GENERATED MOVE DIFF -->/.exec(uuBrief);
if (!diff) throw new Error('the UU briefing has no generated move-diff block to relocate');
source = replaceBlock(source, 'GENERATED MOVE DIFF', diff[1].trim());

console.log(`UU profiles: ${uuSorted.length} | OU bar: ${rosters.OU.length} | RU bar: ${rosters.RU.length}`);
console.log(`changed abilities on a UU entry: ${impact.touched} of ${impact.total} | forme gates: ${gates.rows}`);

if (source === original) { console.log('\nunchanged'); process.exit(0); }
if (CHECK) { console.log('\nSTALE — run: node tools/uu-audit-doc.js'); process.exit(1); }
fs.writeFileSync(DOC, source);
console.log('\nrewritten docs/UU_FORMAT_AUDIT.md');
