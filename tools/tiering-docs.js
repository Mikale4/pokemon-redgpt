#!/usr/bin/env node
/*
 * Regenerate the pinned blocks in the tiering briefings from the live ladder.
 *
 * `docs/OU_ROSTER_FOR_TIERING.md` and `docs/UU_ROSTER_FOR_TIERING.md` are
 * written for an outside reader who cannot check them, which is exactly why
 * `tests/data-validation.js` compares them to `Formats.tierRoster` — a tiering
 * brief that quietly disagrees with the game is worse than none, because every
 * conclusion drawn from it inherits the error.
 *
 * Until now those blocks were produced ad hoc by whichever session wrote them,
 * so a tier change meant reconstructing the generator from the output. This is
 * that generator, kept.
 *
 *   node tools/tiering-docs.js            rewrite both documents
 *   node tools/tiering-docs.js --check    report drift, write nothing, exit 1
 *
 * WHAT IT DOES AND DOES NOT REGENERATE
 *
 * Roster tables, name lists, headings and every count stated in prose are
 * rebuilt from live data. The per-Pokemon **movepool profiles** are not
 * re-derived: they are parsed out of the existing document keyed by name and
 * re-emitted under whichever tier the Pokemon is in now. That is deliberate.
 * The profiler behind them resolves use-time move typing (Ivy Cudgel is
 * packaged Grass and is Fire/Water/Rock at use time), and a body re-derived by
 * a second, subtly different implementation is the drift this project keeps
 * finding. A profile is a fact about a Pokemon, not about its tier, so moving
 * one between sections is lossless — and a name with no profile is a hard
 * error rather than a silently empty entry.
 */
const fs = require('fs');
const path = require('path');
const {loadEngine} = require('../tests/helpers/engine.js');
const {createProfiler} = require('./lib/profiler.js');

const ROOT = path.join(__dirname, '..');
const CHECK = process.argv.includes('--check');
const R = loadEngine();
const {Dex, Formats} = R;
const P = createProfiler(R);

const rosters = {};
for (const tier of Formats.TIER_ORDER) rosters[tier] = Formats.tierRoster(tier);
const OU = rosters.OU;
const UU = rosters.UU;

const speciesOf = entry => Dex.species(entry.id);
const statLine = s => [s.baseStats.hp, s.baseStats.atk, s.baseStats.def, s.baseStats.spa, s.baseStats.spd, s.baseStats.spe].join('/');
const typeLine = (s, sep) => s.types.join(sep);
const itemName = id => (Dex.item(id) ? Dex.item(id).name : id);

/** Replace the body between two HTML comment markers, asserting they exist. */
function replaceBlock(source, marker, body, where) {
  const re = new RegExp(`(<!-- BEGIN ${marker} -->)([\\s\\S]*?)(<!-- END ${marker} -->)`);
  if (!re.test(source)) throw new Error(`${where}: missing marker block "${marker}"`);
  return source.replace(re, (_m, open, _old, close) => `${open}\n${body}\n${close}`);
}

/** Replace exactly one occurrence of a pattern, asserting the count. */
function replaceOnce(source, re, next, where) {
  const hits = source.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'));
  if (!hits || hits.length !== 1) {
    throw new Error(`${where}: expected exactly 1 match for ${re}, saw ${hits ? hits.length : 0}`);
  }
  return source.replace(re, next);
}

/* ------------------------------------------------------------------ *
 * docs/OU_ROSTER_FOR_TIERING.md
 * ------------------------------------------------------------------ */
function buildOuDoc() {
  const file = path.join(ROOT, 'docs/OU_ROSTER_FOR_TIERING.md');
  let source = fs.readFileSync(file, 'utf8');

  /*
   * The Note column carries one editorial annotation this generator cannot
   * derive — "dropped from Ubers 2026-08-15" — so it is preserved by name from
   * the document itself. The "tier estimated" half IS derivable and is rebuilt
   * from `entry.estimated`, so a forme that stops being a guess stops being
   * labelled one.
   */
  const kept = new Map();
  const block = /<!-- BEGIN GENERATED ROSTER -->([\s\S]*?)<!-- END GENERATED ROSTER -->/.exec(source);
  if (!block) throw new Error('OU doc: missing generated roster block');
  for (const line of block[1].split('\n')) {
    const cells = line.split('|').map(c => c.trim());
    if (cells.length < 4 || !/^\d+$/.test(cells[1])) continue;
    const name = cells[2];
    const note = cells[cells.length - 2];
    if (note && !/estimated/.test(note)) kept.set(name, note);
  }

  const noteFor = entry => {
    const parts = [];
    if (kept.has(entry.name)) parts.push(kept.get(entry.name));
    if (entry.estimated) parts.push('tier *estimated*, not ranked by Smogon');
    return parts.join('; ');
  };

  const species = OU.filter(e => e.kind === 'species').sort((a, b) => a.name.localeCompare(b.name));
  const formes = OU.filter(e => e.kind === 'forme').sort((a, b) => a.name.localeCompare(b.name));

  const lines = [];
  lines.push(`### Species entries (${species.length})`);
  lines.push('');
  lines.push('| # | Pokémon | Types | BST | HP/Atk/Def/SpA/SpD/Spe | Abilities | Note |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- |');
  species.forEach((e, i) => {
    const s = speciesOf(e);
    lines.push(`| ${i + 1} | ${e.name} | ${typeLine(s, ' / ')} | ${s.bst} | ${statLine(s)} | ${Dex.abilityList(s.id).join(', ')} | ${noteFor(e)} |`);
  });
  lines.push('');
  lines.push(`### Forme entries (${formes.length}) — reached by holding an item, never picked directly`);
  lines.push('');
  lines.push('| # | Forme | Reached by | Types | BST | HP/Atk/Def/SpA/SpD/Spe | Ability | Note |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- |');
  formes.forEach((e, i) => {
    const s = speciesOf(e);
    lines.push(`| ${i + 1} | ${e.name} | ${e.base} + ${itemName(e.item)} | ${typeLine(s, ' / ')} | ${s.bst} | ${statLine(s)} | ${Dex.abilityList(s.id)[0]} | ${noteFor(e)} |`);
  });

  source = replaceBlock(source, 'GENERATED ROSTER', lines.join('\n'), 'OU doc');
  source = replaceOnce(source, /## 5\. The OU roster — all \d+ entries/,
    `## 5. The OU roster — all ${OU.length} entries`, 'OU doc heading');
  source = rewriteLadderTable(source, 'OU doc');
  return {file, source};
}

/*
 * The "what the ladder looks like right now" table, shared in shape by both
 * documents. Rebuilt wholesale so a stale rung cannot survive — the OU doc was
 * carrying `UU | 72` and `ZU | 253` against a live 71 and 254 before this tool
 * existed, which is precisely the drift the pinning tests exist to stop and
 * could not see, because the prose is outside the generated markers.
 */
function rewriteLadderTable(source, where) {
  return source.replace(/^\| (\*\*)?(AG|Ubers|OU|UU|RU|NU|PU|ZU)(\*\*)? \| (\*\*)?\d+(\*\*)? \|/gm,
    (line, b1, tier, b2, b3) => {
      const n = rosters[tier].length;
      const name = b1 ? `**${tier}**` : tier;
      const count = b3 ? `**${n}**` : `${n}`;
      return `| ${name} | ${count} |`;
    });
}

/* ------------------------------------------------------------------ *
 * docs/UU_ROSTER_FOR_TIERING.md
 * ------------------------------------------------------------------ */

/** Wrap a comma-separated name list at ~72 columns, as the document does. */
function wrapList(names) {
  const out = [];
  let line = '';
  names.forEach((name, i) => {
    const piece = name + (i === names.length - 1 ? '' : ',');
    if (line && (line + ' ' + piece).length > 72) { out.push(line); line = piece; }
    else line = line ? `${line} ${piece}` : piece;
  });
  if (line) out.push(line);
  return out.join('\n');
}

/**
 * Split a POOLS block into name -> profile text. The profile body is every
 * line from the bold name heading up to the blank line before the next one.
 */
function parsePools(body) {
  const map = new Map();
  let name = null, buf = [];
  const flush = () => { if (name) map.set(name, buf.join('\n').replace(/\s+$/, '')); };
  for (const line of body.split('\n')) {
    const head = /^\*\*(.+?)\*\* /.exec(line);
    if (head) { flush(); name = head[1]; buf = [line]; continue; }
    if (name) buf.push(line);
  }
  flush();
  return map;
}

/** The trailing "(reached by X + Y)" line for a forme, rebuilt from live data. */
function reachedLine(entry) {
  const est = entry.estimated ? ', tier **estimated**' : '';
  return `  *(reached by ${entry.base} + ${itemName(entry.item)}${est})*`;
}

/*
 * A profile for an entry the document has never carried — a Pokémon that has
 * just arrived in this tier from another one.
 *
 * This tool was written to *relocate* profiles rather than derive them, back
 * when the only profiler was a local copy in `uu-audit-doc.js`. It threw for a
 * name it had never seen, which was the right refusal then: emitting an empty
 * entry would have been worse. There is a shared profiler now, so the honest
 * answer is to generate the missing one rather than fail — and it is the same
 * profiler, so a generated entry and a relocated one cannot disagree.
 */
function deriveProfile(entry) {
  const p = P.profile(entry, {tier: entry.tier || 'UU'});
  const s = p.species;
  const out = [`**${entry.name}** ${s.types.join('/')} ${s.bst} (${statLine(s)}) — ${p.abilities.join(' / ')}`];
  out.push(`  STAB: ${p.stab.join(' · ') || '**none**'}`);
  if (p.physical.length) out.push(`  Physical coverage: ${p.physical.join(', ')}`);
  if (p.special.length) out.push(`  Special coverage: ${p.special.join(', ')}`);
  const l3 = [`Setup: ${p.setup.join(', ') || '**none**'}`, `Recovery: ${p.recovery.join(', ') || '**none**'}`];
  if (p.priority.length) l3.push(`Priority: ${p.priority.join(', ')}`);
  out.push('  ' + l3.join(' | '));
  const l4 = [];
  if (p.hazards.length) l4.push(`Hazards: ${p.hazards.join(', ')}`);
  if (p.removal.length) l4.push(`Removal: ${p.removal.join(', ')}`);
  if (p.pivot.length) l4.push(`Pivot: ${p.pivot.join(', ')}`);
  if (p.utility.length) l4.push(`Utility: ${p.utility.join(', ')}`);
  if (l4.length) out.push('  ' + l4.join(' | '));
  return out.join('\n');
}

function emitPools(tier, entries, profiles) {
  const out = [`### ${tier} — ${entries.length} entries`, ''];
  const derived = [];
  for (const e of entries.slice().sort((a, b) => a.name.localeCompare(b.name))) {
    const body = profiles.get(e.name);
    if (!body) {
      derived.push(e.name);
      out.push(deriveProfile(Object.assign({}, e, {tier})));
      if (e.kind === 'forme') out.push(reachedLine(e));
      out.push('');
      continue;
    }
    // Drop any existing "(reached by ...)" tail; it is rebuilt from live data.
    const trimmed = body.split('\n').filter(l => !/^\s*\*\(reached by /.test(l)).join('\n').replace(/\s+$/, '');
    out.push(trimmed);
    if (e.kind === 'forme') out.push(reachedLine(e));
    out.push('');
  }
  if (derived.length) console.log(`  derived ${derived.length} new ${tier} profile(s): ${derived.join(', ')}`);
  return out.join('\n').replace(/\s+$/, '');
}

function buildUuDoc() {
  const file = path.join(ROOT, 'docs/UU_ROSTER_FOR_TIERING.md');
  let source = fs.readFileSync(file, 'utf8');

  // Every profile in the document, from both sections, keyed by name.
  const profiles = new Map();
  for (const marker of ['GENERATED OU POOLS', 'GENERATED UU POOLS']) {
    const m = new RegExp(`<!-- BEGIN ${marker} -->([\\s\\S]*?)<!-- END ${marker} -->`).exec(source);
    if (!m) throw new Error(`UU doc: missing ${marker}`);
    for (const [k, v] of parsePools(m[1])) profiles.set(k, v);
  }

  const uuNames = UU.slice().sort((a, b) => a.name.localeCompare(b.name))
    .map(e => e.name + (e.estimated ? '*' : ''));
  source = replaceBlock(source, 'GENERATED UU LIST', wrapList(uuNames), 'UU doc');
  source = replaceBlock(source, 'GENERATED OU POOLS', emitPools('OU', OU, profiles), 'UU doc');
  source = replaceBlock(source, 'GENERATED UU POOLS', emitPools('UU', UU, profiles), 'UU doc');

  const estimatedUU = UU.filter(e => e.estimated).length;
  const megasIn = t => rosters[t].filter(e => e.kind === 'forme' && /-Mega/.test(e.name)).length;
  const bsts = UU.map(e => speciesOf(e).bst).sort((a, b) => a - b);
  const medianUU = bsts.length % 2 ? bsts[(bsts.length - 1) / 2]
    : Math.round((bsts[bsts.length / 2 - 1] + bsts[bsts.length / 2]) / 2);
  const atOrBelow = OU.filter(e => speciesOf(e).bst <= medianUU).length;

  const edits = [
    [/which of the \d+ OU entries/, `which of the ${OU.length} OU entries`],
    [/### The UU roster — \d+ entries/, `### The UU roster — ${UU.length} entries`],
    [/nearest-neighbour estimate — \*\*\d+ of the \d+\*\*/, `nearest-neighbour estimate — **${estimatedUU} of the ${UU.length}**`],
    [/\*\*\d+ of the \d+ OU entries are Megas\*\*/, `**${megasIn('OU')} of the ${OU.length} OU entries are Megas**`],
    [/\*\*\d+ of the \d+ UU entries are too\.\*\*/, `**${megasIn('UU')} of the ${UU.length} UU entries are too.**`],
    [/\*\*\d+ of the \d+ OU entries sit at or below UU's median BST of \d+\.\*\*/,
      `**${atOrBelow} of the ${OU.length} OU entries sit at or below UU's median BST of ${medianUU}.**`],
    [/which is why OU is \d+ rather than \d+/, `which is why OU is ${OU.length} rather than ${OU.length - 1}`],
  ];
  for (const [re, next] of edits) source = replaceOnce(source, re, next, 'UU doc prose');
  source = rewriteLadderTable(source, 'UU doc');
  return {file, source};
}

/* ------------------------------------------------------------------ */
let drift = 0;
for (const build of [buildOuDoc, buildUuDoc]) {
  const {file, source} = build();
  const before = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (before === source) { console.log(`  unchanged  ${rel}`); continue; }
  drift++;
  if (CHECK) { console.log(`  STALE      ${rel}`); continue; }
  fs.writeFileSync(file, source);
  console.log(`  rewritten  ${rel}`);
}

console.log(`\nladder: ${Formats.TIER_ORDER.map(t => `${t} ${rosters[t].length}`).join(', ')}`);
if (CHECK && drift) { console.log(`\n${drift} document(s) stale — run: node tools/tiering-docs.js`); process.exit(1); }
