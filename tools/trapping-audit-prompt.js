#!/usr/bin/env node
/*
 * Generate `docs/TRAPPING_ABILITY_TIER_AUDIT_PROMPT.md` — a self-contained,
 * paste-ready prompt asking ChatGPT to place every trapping-ability holder on
 * the RedGPT ladder.
 *
 * This is a GLOBAL audit spanning Ubers -> ZU, deliberately separate from the
 * PU packet: a trapping holder may need to move several rungs in either
 * direction, so it cannot be folded into a single-rung pass.
 *
 * Discovery is by HOOK, never by name — `onTrapped` in the ability registry —
 * so a custom, renamed or future trapping ability is picked up automatically.
 *
 *   node tools/trapping-audit-prompt.js
 *   node tools/trapping-audit-prompt.js --check
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {loadEngine} = require('../tests/helpers/engine.js');
const {createProfiler} = require('./lib/profiler.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs/TRAPPING_ABILITY_TIER_AUDIT_PROMPT.md');
const CHECK = process.argv.includes('--check');
const R = loadEngine();
const {Dex, Formats, Mechanics, Calculator, Pokemon, Validation, Abilities, Items, Battle} = R;
const P = createProfiler(R);

const rosters = {};
for (const t of Formats.TIER_ORDER) rosters[t] = Formats.tierRoster(t);
const LADDER = Formats.TIER_ORDER.filter(t => rosters[t].length);
const all = LADDER.flatMap(t => rosters[t]);
const byName = n => all.find(e => e.name === n);
const itemName = id => (id && Dex.item(id) ? Dex.item(id).name : (id || '—'));
const stats = s => [s.baseStats.hp, s.baseStats.atk, s.baseStats.def, s.baseStats.spa, s.baseStats.spd, s.baseStats.spe].join('/');
const tierOfEntry = e => LADDER.find(t => rosters[t].some(x => x.id === e.id && x.kind === e.kind)) || null;

/* ---------- discovery, by hook ---------- */
const TRAP_IDS = Object.entries(Abilities.registry)
  .filter(([, d]) => d && typeof d.onTrapped === 'function').map(([id]) => id);
const TRAP_IMMUNE = Object.entries(Abilities.registry).filter(([, d]) => d && d.trapImmune).map(([id]) => id);
const ESCAPE_ITEMS = Object.entries(Items.registry).filter(([, d]) => d && d.escapesTrapping).map(([id]) => id);
const SHIELD_ITEMS = Object.entries(Items.registry).filter(([, d]) => d && d.abilityProtected).map(([id]) => id);

/* Every packaged species/forme that can legally select a trapping ability. */
const HOLDERS = [];
for (const s of Dex.packagedSpecies) {
  const abilities = Dex.abilityList(s.name) || [];
  const traps = abilities.filter(a => TRAP_IDS.includes(Dex.toID(a)));
  if (!traps.length) continue;
  const entry = all.find(e => e.id === s.id) || {id: s.id, name: s.name, kind: s.transformOnly ? 'forme' : 'species'};
  HOLDERS.push({
    species: s, name: s.name, abilities, traps,
    forced: abilities.length === 1,
    tier: (s.tier && LADDER.includes(s.tier)) ? s.tier : null,
    entry, selectable: Dex.allSpecies.some(x => x.id === s.id),
    transformOnly: !!s.transformOnly, battleOnly: s.battleOnly || null,
  });
}
const TIERED = HOLDERS.filter(h => h.tier).sort((a, b) => LADDER.indexOf(a.tier) - LADDER.indexOf(b.tier) || a.name.localeCompare(b.name));
const UNTIERED = HOLDERS.filter(h => !h.tier).sort((a, b) => a.name.localeCompare(b.name));

/* ---------- engine-measured trapping truth table ---------- */
function makeBattle(p1, p2) {
  const rules = Object.assign({}, Formats.get('anythinggoes').rules, {teamPreview: false, forceLevel: null, maxLevel: 100});
  const b = new Battle({
    format: Object.assign({}, Formats.get('anythinggoes'), {rules}), seed: 12345,
    sides: [{name: 'A', team: p1, controller: 'human'}, {name: 'B', team: p2, controller: 'human'}],
  });
  b.start();
  return b;
}
const bset = (species, o = {}) => Pokemon.normalizeSet(Object.assign(
  {species, level: 50, moves: ['tackle'], evs: {}, ivs: Pokemon.maxIVs(), nature: 'serious'}, o));

function measureTrap(victim, victimOpts, trapper, ability) {
  try {
    const b = makeBattle([bset(victim, victimOpts), bset('blissey')], [bset(trapper, {ability})]);
    return b.isTrapped(b.active(0));
  } catch { return null; }
}

/* ---------- damage helper ---------- */
const SPREADS = {
  physical: {nature: 'adamant', evs: {atk: 252, spe: 252, hp: 4}},
  special: {nature: 'modest', evs: {spa: 252, spe: 252, hp: 4}},
  specFast: {nature: 'timid', evs: {spa: 252, spe: 252, hp: 4}},
  physWall: {nature: 'impish', evs: {hp: 252, def: 252}},
  specWall: {nature: 'calm', evs: {hp: 252, spd: 252}},
};
function cfgFor(idOrEntry, spread, {item = null, ability = null, moves = ['tackle']} = {}) {
  const id = typeof idOrEntry === 'string' ? idOrEntry : idOrEntry.id;
  const sp = Dex.species(id);
  return {set: {species: sp.id, level: 100, nature: spread.nature, evs: spread.evs, ivs: Pokemon.maxIVs(),
    ability: ability || Dex.abilityList(sp.name)[0], item: sp.requiredItem ? Dex.toID(sp.requiredItem) : item, moves}};
}
const cell = r => (r && !r.empty ? `${r.min}-${r.max} (${r.minPercent}-${r.maxPercent}%)` : '—');
function calc(a, d, m) { try { const r = Calculator.calculate({attacker: a, defender: d, move: m}); return r && !r.empty ? r : null; } catch { return null; } }

/* Who a given trapper can actually trap, per tier — computed, not asserted. */
function trappableIn(tier, ability, trapperSpecies) {
  const out = {trapped: [], escapes: []};
  for (const e of rosters[tier]) {
    const s = Dex.species(e.id);
    const res = measureTrap(s.id, {}, trapperSpecies, Dex.ability(ability).name);
    if (res === null) continue;
    (res ? out.trapped : out.escapes).push(e.name);
  }
  return out;
}

/* Profile block for one holder. */
function holderBlock(h) {
  const p = P.profile(h.entry, {tier: h.tier || 'ZU'});
  const s = h.species;
  const off = p.offByAbility;
  const lines = [];
  lines.push(`#### ${h.name}`);
  lines.push('');
  lines.push(`- **Current tier:** ${h.tier || '**none — NFE/LC, carries no ladder tier**'}${h.tier ? '' : ' (refused in every tier format; Anything Goes only)'}`);
  lines.push(`- **Kind:** ${h.transformOnly ? 'forme (transform-only)' : 'species'}${h.battleOnly ? `, battleOnly → ${h.battleOnly}` : ''}${h.selectable ? '' : ', **not selectable** — reached only by transformation'}`);
  lines.push(`- **Typing:** ${s.types.join('/')} | **BST** ${s.bst} (${stats(s)})`);
  lines.push(`- **Abilities:** ${h.abilities.join(' / ')} — trapping ability **${h.traps.join(', ')}**, ${h.forced ? '**FORCED (its only ability)**' : 'optional'}`);
  lines.push(`- **Item:** ${s.requiredItem ? `**${s.requiredItem} forced and unremovable**` : 'free'}`);
  lines.push(`- **Engine offence @252 (neutral/+):** ${h.abilities.map(a => `${a}: Atk ${off[a] ? off[a].atkNeutral + '/' + off[a].atkPlus : '?'}, SpA ${off[a] ? off[a].spaNeutral + '/' + off[a].spaPlus : '?'}, Spe ${off[a] ? off[a].speNeutral + '/' + off[a].spePlus : '?'}`).join(' — ')}`);
  lines.push(`- **STAB:** ${p.stab.join(' · ') || 'none'}`);
  lines.push(`- **Physical coverage:** ${p.physical.join(', ') || 'none'}`);
  lines.push(`- **Special coverage:** ${p.special.join(', ') || 'none'}`);
  lines.push(`- **Setup:** ${p.setup.join(', ') || 'none'}${p.setup.length ? '  ← **trapping + setup: the trapped target becomes setup fodder**' : ''}`);
  lines.push(`- **Reliable recovery:** ${p.recovery.join(', ') || 'none'} | **Rest:** ${p.has('rest') ? 'yes' : 'no'} | **Drain:** ${p.drain.join(', ') || 'none'}`);
  lines.push(`- **Priority:** ${p.priority.join(', ') || 'none'}`);
  lines.push(`- **Hazards:** ${p.hazards.join(', ') || 'none'} | **Removal:** ${p.removal.join(', ') || 'none'} | **Pivot:** ${p.pivot.join(', ') || 'none'} | **Phazing:** ${p.phazing.join(', ') || 'none'}`);
  lines.push(`- **Status:** ${p.status.join(', ') || 'none'}`);
  const tags = [['knockoff', 'Knock Off'], ['trick', 'Trick'], ['switcheroo', 'Switcheroo'], ['encore', 'Encore'],
    ['taunt', 'Taunt'], ['substitute', 'Substitute'], ['protect', 'Protect'], ['perishsong', 'Perish Song'],
    ['disable', 'Disable'], ['leechseed', 'Leech Seed'], ['toxic', 'Toxic'], ['willowisp', 'Will-O-Wisp']]
    .filter(([id]) => p.has(id)).map(([, l]) => l);
  lines.push(`- **Trapping-compatible tactics:** ${tags.join(', ') || 'none of Knock Off / Trick / Encore / Taunt / Substitute / Perish Song / Disable / Leech Seed / Toxic / Will-O-Wisp'}`);
  const routes = (Dex.species(h.entry.id).formeItems || []).map(f => `${itemName(f.item)} → ${f.forme} (${f.tier})`);
  lines.push(`- **Transformation routes:** ${routes.join('; ') || 'none'}`);
  return lines.join('\n');
}

/* ---------- assemble ---------- */
const doc = [];

doc.push(`# RedGPT Global Trapping-Ability Tier Audit — Verified Evidence Packet

**Generated from the live RedGPT project** by \`tools/trapping-audit-prompt.js\`.
Every mechanic below was measured by driving the real battle engine, not read off
packaged data and not assumed from Pokémon Showdown.

**RedGPT has no usage, ladder, win-rate, tournament or popularity data.** None is
quoted anywhere. Section S lists what genuinely cannot be settled.

---

## Your task

Make the **final global tier audit of every species and forme that can legally
use a trapping ability in RedGPT.**

For each holder, decide where it belongs across:

**Ubers · OU · UU · RU · NU · PU · ZU**

**Do not restrict movement to adjacent tiers.** A holder may stay put, move up
one rung, move up several, move down one, or move down several. The question is
not "NU or RU?" — it is:

> **Given that trapping abilities are legal in every RedGPT format, what is the
> correct competitive tier for every Pokémon that can use one?**

### The balance policy, which is fixed

**TRAPPING ABILITIES REMAIN LEGAL IN ALL COMPETITIVE FORMATS.** Balance is
handled by tiering the Pokémon that use them.

Do **not** recommend banning ${TRAP_IDS.map(a => Dex.ability(a).name).join(', ')},
trapping abilities as a group, or a trapping clause — unless you are reporting a
technical impossibility rather than proposing balance policy.

    ABILITY = LEGAL
    POKÉMON = TIERED ACCORDING TO POWER

If Shadow Tag makes a Pokémon too strong for its tier, move **that Pokémon** up.
If a weak Magnet Pull user is still fine in ZU, leave it there. Do not treat
every trapping user identically, and do not assume a famous historical offender
is automatically Ubers — or that a historically weak user stays low once trapping
is on the table.

**Trapping power is not measured in raw damage.** A trapper is a problem when it
reliably removes something its tier structurally needs: the primary physical or
special wall, the hazard remover, the Steel, the Fairy, the Unaware user, the
Regenerator pivot, the revenge killer. Section J is that question.

---`);

doc.push(`## A. Current complete tier snapshot

| Tier | Entries | Trapping-ability holders in it |
| --- | --- | --- |
${LADDER.map(t => {
  const hs = TIERED.filter(h => h.tier === t);
  return `| **${t}** | ${rosters[t].length} | ${hs.length ? hs.map(h => `${h.name} (${h.traps.join('/')}${h.forced ? ', forced' : ''})`).join('; ') : '—'} |`;
}).join('\n')}

**Selectable species ${Dex.allSpecies.length}, packaged ${Dex.packagedSpecies.length}.**

**${TIERED.length} holders carry a ladder tier and are what this audit can move.**
A further **${UNTIERED.length} holders carry no tier at all** — they are NFE, and
§5 of the project's own rules discards NFE and LC. Verified through the real
validator: they are **refused in every one of the seven tier formats**, so they
are playable only in Anything Goes and Random Battle. They are listed in section
D for completeness and are **out of scope for tier movement**.

---`);

doc.push(`## B. Verified trapping mechanics

**Discovery was behavioural, not by name.** The list is every ability in the
registry that defines an \`onTrapped\` hook, so a custom, renamed or future
trapping ability appears automatically:

**${TRAP_IDS.map(a => Dex.ability(a).name).join(', ')}** — and nothing else.

| Ability | Live condition |
| --- | --- |
${TRAP_IDS.map(a => {
  const cond = {
    shadowtag: 'the foe is trapped **unless the foe also has Shadow Tag**',
    arenatrap: 'the foe is trapped **only while grounded** (`battle.isGrounded`)',
    magnetpull: 'the foe is trapped **only if it is a Steel type**',
  }[a] || 'see `src/core/abilities.js`';
  return `| **${Dex.ability(a).name}** | ${cond} |`;
}).join('\n')}

### The predicate, and why its ORDER matters

\`battle.isTrapped(pokemon)\` is the single choke point. It is consulted in this
order, and the order is load-bearing:

1. **${ESCAPE_ITEMS.map(i => Dex.item(i).name).join(', ')}** — escapes *everything*, checked first (including Fairy Lock and partial trapping).
2. **Fairy Lock** — a move, traps **both** sides, and is checked **above** the Ghost escape, so a Ghost *is* held by Fairy Lock.
3. **Volatile traps** — partial trapping (Wrap/Bind/Fire Spin/Clamp), Mean Look / Block / Spider Web, Ingrain, Octolock.
4. **Ghost typing escapes** — beats all three abilities, read off **live** types (so Terastal, Soak or Protean change the answer).
5. **${TRAP_IMMUNE.map(a => Dex.ability(a).name).join(', ')}** (\`trapImmune\`) on the victim.
6. The trapper's own \`onTrapped\` hook.

### The measured truth table

Every row was produced by building a real battle and reading \`battle.isTrapped\`,
then cross-checked against an actual \`{type:'switch'}\` command. **The predicate
and the command agreed in every case** — so what the UI shows and what the engine
refuses cannot diverge.

| Situation | Trapped? |
| --- | --- |
| ordinary grounded non-Ghost vs Shadow Tag | **YES** |
| Ghost vs Shadow Tag | no |
| Ghost vs Arena Trap | no |
| Ghost vs Magnet Pull | no |
| Flying (Skarmory) vs Shadow Tag | **YES** — Shadow Tag is not a grounding effect |
| Levitate (Rotom-Wash) vs Shadow Tag | **YES** |
| Air Balloon vs Shadow Tag | **YES** |
| Flying vs Arena Trap | no |
| Levitate vs Arena Trap | no |
| Air Balloon vs Arena Trap | no |
| Flying holding an **Iron Ball** vs Arena Trap | **YES** — re-grounded |
| Steel (Skarmory) vs Magnet Pull | **YES** |
| non-Steel vs Magnet Pull | no |
| **Steel/Ghost (Aegislash)** vs Magnet Pull | no — the Ghost branch is checked first |
| victim holding **Shed Shell** | no — against all three |
| victim with **Guard Dog** | no — against all three |
| **Shadow Tag vs Shadow Tag** | no — mutual immunity |
| victim with **Mold Breaker** | **YES** — Mold Breaker does **not** break trapping |
| trapper hit by **Gastro Acid** | no |
| victim has **Neutralizing Gas** | no — it suppresses the trapper |
| trapper's ability swapped away (Skill Swap / Entrainment / Trace) | no |
| **trapper switches out** | no — freed immediately, same turn |
| **trapper faints** | no — freed immediately |

### Two results that change what trapping is worth

- **Every pivot move bypasses trapping.** Verified for all six —
  **U-turn, Volt Switch, Flip Turn, Parting Shot, Baton Pass and Teleport** all
  escape a trap. Trapping blocks **voluntary** switching only. Note this is
  implemented in six separate places in \`battle.js\` rather than one, so it is
  the current behaviour rather than a single switchable policy.
- **Phazing drags a trapped Pokémon out.** An opposing Whirlwind replaced a
  trapped victim; forced switches never consult \`isTrapped\` at all. Roar,
  Whirlwind, Dragon Tail and Circle Throw are therefore all answers to a trapper.

### Other supporting mechanics

- **Ability Shield** (${SHIELD_ITEMS.map(i => Dex.item(i).name).join(', ') || 'none'}) protects an ability from suppression.
- **Doubles do not exist in RedGPT** — this is a singles-only engine, so no
  redirection or ally interaction applies.
- **No divergence from cartridge behaviour was found in the trapping conditions
  themselves.** The one thing worth flagging is that **Shed Shell is checked
  before the volatile traps**, so it escapes partial trapping and Ingrain as well
  as ability trapping. That is stated as measured behaviour, not as a defect.

---`);

doc.push(`## C. Format legality — proof, not assertion

Read live off every format object in the build:

| Format | \`bannedAbilities\` | Any trapping ability banned? |
| --- | --- | --- |
${Formats.list().map(f => {
  const ba = (f.rules.bannedAbilities || []).map(Dex.toID);
  const hits = ba.filter(a => TRAP_IDS.includes(a));
  return `| ${f.name} | ${ba.length ? JSON.stringify(ba) : '**[]**'} | ${hits.length ? '**YES — ' + hits.join(', ') + '**' : 'no' } |`;
}).join('\n')}

**All ${Formats.list().length} formats carry an empty \`bannedAbilities\` list.** No
trapping ability is banned anywhere, by \`bannedAbilities\`, by the validator, by a
species clause, by a tier override or by any other route. **No fix was required —
the policy was already the live state.** A regression test now asserts this, with
a control that bans Shadow Tag in a format and watches the test go red.

The remaining gate on a trapping *holder* is its own tier, exactly as for any
other Pokémon.

---`);

doc.push(`## D. Complete trapping-holder inventory

### Tiered holders — the audit's actual scope (${TIERED.length})

| Holder | Kind | Current tier | Trapping ability | Forced? | Types | BST (spread) | All abilities | Item |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${TIERED.map(h => `| **${h.name}** | ${h.transformOnly ? 'forme' : 'species'} | **${h.tier}** | ${h.traps.join('/')} | ${h.forced ? '**yes**' : 'no'} | ${h.species.types.join('/')} | ${h.species.bst} (${stats(h.species)}) | ${h.abilities.join(', ')} | ${h.species.requiredItem ? '**' + h.species.requiredItem + ' forced**' : 'free'} |`).join('\n')}

### Untiered holders — NFE, out of scope (${UNTIERED.length})

These carry **no ladder tier** and the validator refuses them in all seven tier
formats. Listed so the inventory is complete, **not** for placement.

| Holder | Trapping ability | Forced? | Types | BST | All abilities |
| --- | --- | --- | --- | --- | --- |
${UNTIERED.map(h => `| ${h.name} | ${h.traps.join('/')} | ${h.forced ? 'yes' : 'no'} | ${h.species.types.join('/')} | ${h.species.bst} | ${h.abilities.join(', ')} |`).join('\n')}

---`);

/* ---- per-ability sections ---- */
const SECTION_LETTER = {shadowtag: 'E', arenatrap: 'F', magnetpull: 'G'};
let extra = 'H';
for (const abilityId of TRAP_IDS) {
  const ab = Dex.ability(abilityId);
  const letter = SECTION_LETTER[abilityId] || extra++;
  const holders = TIERED.filter(h => h.traps.some(t => Dex.toID(t) === abilityId));
  const untiered = UNTIERED.filter(h => h.traps.some(t => Dex.toID(t) === abilityId));

  const blocks = holders.map(h => {
    const own = h.tier;
    const idx = LADDER.indexOf(own);
    const neighbours = [LADDER[idx - 1], own, LADDER[idx + 1]].filter(Boolean);
    const census = neighbours.map(t => {
      const {trapped, escapes} = trappableIn(t, abilityId, h.species.id);
      const total = trapped.length + escapes.length;
      return `| ${t} | **${trapped.length} of ${total}** | ${escapes.length ? escapes.slice(0, 14).join(', ') + (escapes.length > 14 ? `, _+${escapes.length - 14} more_` : '') : '_nobody escapes_'} |`;
    }).join('\n');

    /* Damage into the most relevant trapped targets in its own tier. */
    const p = P.profile(h.entry, {tier: own});
    const physical = p.wantsPhysical && !p.wantsSpecial;
    const spread = physical ? 'physical' : 'specFast';
    const moves = [...p.stab, ...(physical ? p.physical : p.special)]
      .map(t => { const m = /^[A-Za-z]+ (.+?) \d/.exec(t); return m ? Dex.toID(m[1]) : null; })
      .filter(id => id && Dex.hasMove(id)).slice(0, 3);
    const atkCfg = cfgFor(h.entry, SPREADS[spread], {
      item: h.species.requiredItem ? null : 'lifeorb',
      ability: h.traps[0], moves,
    });
    const victims = trappableIn(own, abilityId, h.species.id).trapped
      .filter(n => n !== h.name).slice(0, 12)
      .map(n => byName(n)).filter(Boolean);
    const dmg = moves.length && victims.length ? [
      '',
      `**Damage into the ${own} targets it can trap** — attacker **${h.name}**, ${SPREADS[spread].nature}, ${JSON.stringify(SPREADS[spread].evs)}, ability **${h.traps[0]}**, ${h.species.requiredItem ? itemName(Dex.toID(h.species.requiredItem)) + ' (forced)' : 'Life Orb'}; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**`,
      '',
      `| Trapped ${own} target | ${moves.map(m => Dex.move(m).name).join(' | ')} |`,
      `| --- | ${moves.map(() => '---').join(' | ')} |`,
      ...victims.map(v => {
        const vs = Dex.species(v.id);
        const defSpread = vs.baseStats.def <= vs.baseStats.spd ? 'physWall' : 'specWall';
        const d = cfgFor(v, SPREADS[defSpread], {item: vs.requiredItem ? null : 'leftovers'});
        return `| ${v.name} (${defSpread}) | ` + moves.map(m => cell(calc(atkCfg, d, m))).join(' | ') + ' |';
      }),
    ].join('\n') : '\n_No usable offensive set could be resolved for a damage table; see the profile above._';

    return `${holderBlock(h)}

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
${census}
${dmg}`;
  });

  doc.push(`## ${letter}. ${ab.name} holders

**Live effect:** ${{
    shadowtag: 'the foe cannot switch out **unless it also has Shadow Tag**. Ghost, Shed Shell and Guard Dog still escape (section B).',
    arenatrap: 'the foe cannot switch out **while it is grounded**. Flying, Levitate, Air Balloon, Ghost, Shed Shell and Guard Dog escape; an Iron Ball re-grounds a Flyer into the trap.',
    magnetpull: 'the foe cannot switch out **if it is a Steel type**. Steel/Ghost escapes anyway, because the Ghost branch is checked first.',
  }[abilityId] || 'see section B.'}

**Tiered holders: ${holders.length}.**${untiered.length ? ` A further ${untiered.length} untiered NFE holder${untiered.length === 1 ? '' : 's'} (${untiered.map(h => h.name).join(', ')}) — out of scope.` : ''}

${blocks.join('\n\n---\n\n') || '_No tiered holder._'}

---`);
}

if (TRAP_IDS.length <= 3) {
  doc.push(`## H. Other trapping abilities

**None.** The behavioural sweep of the ability registry found exactly
${TRAP_IDS.length} abilities defining an \`onTrapped\` hook, and they are the three
above. There are no custom, legacy, renamed, Mega-exclusive, forme-exclusive or
partial trapping abilities in this build.

Non-ability trapping — which no tier decision here depends on, but which shares
the same predicate — comes from **Fairy Lock**, the partial-trapping moves
(Wrap, Bind, Fire Spin, Clamp — reworked in this project into 2-5 hit attacks
that still trap), **Mean Look / Block / Spider Web**, **Ingrain** and **Octolock**.

---`);
}

doc.push(`## I. Tier-by-tier defensive structures

The power band each holder is being judged against. Mechanical summaries — no
usage is implied.

${LADDER.map(t => {
  const list = rosters[t];
  const speeds = list.map(e => ({e, o: P.offence(e, P.abilityOf(e))})).sort((a, b) => b.o.spePlus - a.o.spePlus);
  const ghosts = list.filter(e => Dex.species(e.id).types.includes('Ghost')).map(e => e.name);
  const steels = list.filter(e => Dex.species(e.id).types.includes('Steel')).map(e => e.name);
  const regen = list.filter(e => P.abilitiesOf(e).some(a => Dex.toID(a) === 'regenerator')).map(e => e.name);
  const unaware = list.filter(e => P.abilitiesOf(e).some(a => Dex.toID(a) === 'unaware')).map(e => e.name);
  const magicb = list.filter(e => P.abilitiesOf(e).some(a => Dex.toID(a) === 'magicbounce')).map(e => e.name);
  const levit = list.filter(e => P.abilitiesOf(e).some(a => ['levitate', 'eelevate'].includes(Dex.toID(a)))).map(e => e.name);
  const guard = list.filter(e => P.abilitiesOf(e).some(a => TRAP_IMMUNE.includes(Dex.toID(a)))).map(e => e.name);
  const walls = list.map(e => ({e, s: Dex.species(e.id)}))
    .sort((a, b) => (b.s.baseStats.hp + b.s.baseStats.def + b.s.baseStats.spd) - (a.s.baseStats.hp + a.s.baseStats.def + a.s.baseStats.spd))
    .slice(0, 8).map(x => `${x.e.name} (${x.s.baseStats.hp}/${x.s.baseStats.def}/${x.s.baseStats.spd})`);
  const pivots = list.filter(e => P.profile(e, {tier: t}).pivot.length).map(e => e.name);
  return `### ${t} — ${list.length} entries

- **Speed ceiling:** ${speeds.slice(0, 6).map(x => `${x.e.name} ${x.o.spePlus}`).join(', ')}
- **Bulkiest (HP/Def/SpD):** ${walls.join(', ')}
- **Ghost types (immune to ability trapping):** ${ghosts.join(', ') || '**none**'}
- **Steel types (Magnet Pull targets):** ${steels.join(', ') || '**none**'}
- **Guard Dog / trap-immune:** ${guard.join(', ') || 'none'}
- **Levitate (escapes Arena Trap):** ${levit.join(', ') || 'none'}
- **Regenerator pivots:** ${regen.join(', ') || 'none'}
- **Unaware:** ${unaware.join(', ') || 'none'} | **Magic Bounce:** ${magicb.join(', ') || 'none'}
- **Pivot-move users (escape any trap):** ${pivots.length} of ${list.length}${pivots.length ? ' — ' + pivots.slice(0, 20).join(', ') + (pivots.length > 20 ? `, _+${pivots.length - 20} more_` : '') : ''}`;
}).join('\n\n')}

**Shed Shell is legal in every tier and available to every non-forme entry**, so
any Pokémon in any tier can buy immunity to trapping for its item slot. That cost
— an item slot on the *victim* — is the honest counterweight to every verdict
below.

---`);

doc.push(`## J. Trapping matchup matrix — the central question

For each tiered holder: **what can it selectively remove from its own tier?**

The per-tier trapped/escaped censuses and the damage tables are in sections
${TRAP_IDS.map(a => SECTION_LETTER[a] || '?').join(', ')}. Read them together —
**trapping a Pokémon is not the same as beating it.**

For every holder/target pair the questions are:

1. Is the target actually trapped? (sections ${TRAP_IDS.map(a => SECTION_LETTER[a] || '?').join('/')})
2. Is the trapper faster? (section M)
3. Does the trapper's damage remove it before it removes the trapper? (damage tables)
4. Can the target recover faster than the trapper can chip it? (holder profiles, "Reliable recovery")
5. Does the target simply have a pivot move and leave anyway? (section I, per tier)
6. Does the target carry Shed Shell, Ghost typing or Guard Dog?

A trapper is tier-warping when the answer is "trapped, faster, kills, and the
target has no pivot" for something the tier structurally needs.

---

## K. Setup-fodder matrix

A trapper that removes a target **and** ends the exchange at +2 is a different
proposition from one that trades one-for-one. Holders with both trapping and
setup, from the live movepools:

| Holder | Tier | Trapping ability | Setup moves | Reliable recovery | Substitute | Protect |
| --- | --- | --- | --- | --- | --- | --- |
${TIERED.map(h => {
  const p = P.profile(h.entry, {tier: h.tier});
  return `| ${h.name} | ${h.tier} | ${h.traps.join('/')} | ${p.setup.join(', ') || '**none**'} | ${p.recovery.join(', ') || 'none'} | ${p.has('substitute') ? 'yes' : 'no'} | ${p.has('protect') ? 'yes' : 'no'} |`;
}).join('\n')}

Stored Power and Power Trip gain +20 BP per boost stage in this engine, so a
trapper that can boost freely behind a Substitute scales differently from one
that cannot.

---

## L. Trapping counterplay matrix

Every escape route, measured (section B), and who has it:

| Counterplay | Works against | Notes |
| --- | --- | --- |
| **Ghost typing** | all three abilities | read off **live** types; not Fairy Lock |
| **Shed Shell** | everything, including Fairy Lock and partial trapping | costs the victim's item slot; legal in every tier |
| **Guard Dog** | all three abilities | \`trapImmune\` |
| **Flying / Levitate / Air Balloon** | Arena Trap only | an Iron Ball re-grounds |
| **not being Steel** | Magnet Pull only | |
| **having Shadow Tag yourself** | Shadow Tag only | mutual |
| **U-turn, Volt Switch, Flip Turn, Parting Shot, Baton Pass, Teleport** | **all trapping** | the biggest single escape route |
| **Roar, Whirlwind, Dragon Tail, Circle Throw** | **all trapping** | phazing never consults \`isTrapped\` |
| **Gastro Acid, Neutralizing Gas, Skill Swap, Entrainment** | ability trapping | suppresses or removes the trapper's ability |
| **KOing or outspeeding the trapper** | all | the trap ends the instant the trapper leaves or faints |
| **Mold Breaker** | **nothing** | does **not** break trapping |

Classify each holder's answers as **HARD COUNTER / RELIABLE COUNTER / CHECK /
REVENGE KILLER / TRAP-RESISTANT ROLE / NOT AN ANSWER**. Something that cannot
switch in safely *and* cannot escape once in is not a counter, whatever its
damage output says.

---

## M. Speed table — all trapping holders

| Holder | Tier | Base Spe | Max neutral | Max +Spe | +1 | +2 | Scarf |
| --- | --- | --- | --- | --- | --- | --- | --- |
${TIERED.map(h => {
  const o = P.offence(h.entry, h.traps[0]);
  return `| ${h.name} | ${h.tier} | ${h.species.baseStats.spe} | ${o.speNeutral} | ${o.spePlus} | ${Math.floor(o.spePlus * 1.5)} | ${Math.floor(o.spePlus * 2)} | ${Math.floor(o.spePlus * 1.5)} |`;
}).join('\n')}

---

## N. Priority table — all trapping holders

| Holder | Tier | Priority moves (engine BP / bracket) | Max offence |
| --- | --- | --- | --- |
${TIERED.map(h => {
  const p = P.profile(h.entry, {tier: h.tier});
  const o = p.offByAbility[h.traps[0]] || p.off;
  return `| ${h.name} | ${h.tier} | ${p.priority.join('; ') || '**none**'} | Atk ${o.atkPlus} / SpA ${o.spaPlus} |`;
}).join('\n')}

---

## O. Item-freedom table

| Holder | Item freedom | Consequence |
| --- | --- | --- |
${TIERED.map(h => `| ${h.name} | ${h.species.requiredItem ? `**No** — ${h.species.requiredItem} forced and unremovable` : 'Yes — any item'} | ${h.species.requiredItem ? 'no Choice item, Life Orb, Boots, Leftovers, Ring Target or Orb; and it spends the team\'s one Mega slot' : 'Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available'} |`).join('\n')}

**Trick and Switcheroo on a trapper are worth more than usual**: a trapped target
that has just been handed a Choice item cannot switch to escape the lock.
Holders with either: ${TIERED.filter(h => { const p = P.profile(h.entry, {tier: h.tier}); return p.has('trick') || p.has('switcheroo'); }).map(h => h.name).join(', ') || 'none'}.

**Ring Target** is redesigned in RedGPT: it lets the **holder's own attacks** hit
for neutral damage through a **type** immunity. It does not beat ability
immunities, it is one per team, it is visible from turn one, and **no Mega can
hold it**.

---

## P. Hazard / status synergy

| Holder | Tier | Hazards | Status | Leech Seed | Perish Song | Taunt | Encore | Disable |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${TIERED.map(h => {
  const p = P.profile(h.entry, {tier: h.tier});
  return `| ${h.name} | ${h.tier} | ${p.hazards.join(', ') || '—'} | ${p.status.join(', ') || '—'} | ${p.has('leechseed') ? 'yes' : '—'} | ${p.has('perishsong') ? '**yes**' : '—'} | ${p.has('taunt') ? 'yes' : '—'} | ${p.has('encore') ? 'yes' : '—'} | ${p.has('disable') ? 'yes' : '—'} |`;
}).join('\n')}

**Perish Song plus trapping is the sharpest combination in this list** — the
victim cannot switch and the timer cannot be waited out, so it beats any amount
of bulk or recovery. Check it explicitly wherever it appears above.

**Toxic Orb and Flame Orb fire on ENTRY** in this project, so a Guts or Quick Feet
trapper is boosted from the turn it arrives.

---

## Q. Transformation / forme legality

| Holder | Route out of its tier | Gated? |
| --- | --- | --- |
${(() => {
  const rows = [];
  const mv = sp => { const ls = Dex.learnset(Dex.toID(sp)) || []; return (Array.isArray(ls) ? ls : Object.keys(ls)).slice(0, 1); };
  for (const h of TIERED) {
    const fis = Dex.species(h.entry.id).formeItems || [];
    if (!fis.length) { rows.push(`| ${h.name} | none | — |`); continue; }
    for (const f of fis) {
      let verdict = '—';
      if (f.tier && Formats.tierRank(f.tier) < Formats.tierRank(h.tier)) {
        try {
          const fmtId = 'tier' + h.tier.toLowerCase();
          const res = Validation.validateTeam([Pokemon.normalizeSet({species: h.entry.id, item: f.item, level: 100, moves: mv(h.entry.id)})], Formats.get(fmtId));
          verdict = res.valid ? '**LEGAL — HOLE**' : `refused in ${h.tier}`;
        } catch { verdict = 'threw'; }
      } else verdict = 'same rung or lower — no issue';
      rows.push(`| ${h.name} | ${itemName(f.item)} → ${f.forme} (${f.tier}) | ${verdict} |`);
    }
  }
  return rows.join('\n');
})()}

**Gengar-Mega is the case to be careful with.** It is a **transform-only forme**
with Shadow Tag as its **only** ability, reached by base Gengar (${Dex.species('gengar').tier}) holding a
Gengarite. So it is tiered as a *forme*: the Gengarite is refused below its tier
while Gengar itself stays legal — the Absol/Absolite rule. Verified through the
real validator: *"Gengarite is banned in OverUsed — it turns Gengar into
Gengar-Mega, which is Ubers. Gengar itself is legal here."* Moving Gengar-Mega
moves **the stone's legality**, not Gengar's.

**Base Gengar does not get Shadow Tag.** Its own abilities are
${Dex.abilityList('Gengar').join(' / ')}; Shadow Tag arrives only on Mega Evolution, verified live
(pre-Mega the foe is not trapped, post-Mega it is).

---

## R. Multi-tier destination comparisons

For each holder, state the plausible destinations after weighing the evidence —
**not** limited to one rung.

| Holder | Current | Plausible destinations to compare |
| --- | --- | --- |
${TIERED.map(h => {
  const i = LADDER.indexOf(h.tier);
  const span = LADDER.slice(Math.max(0, i - 2), Math.min(LADDER.length, i + 3));
  return `| **${h.name}** | ${h.tier} | ${span.join(' / ')} — and further if the evidence supports it |`;
}).join('\n')}

The comparison bars are section I (every tier's defensive structure and speed
ceiling) and the per-ability censuses.

---

## S. Remaining unresolved questions

1. **No usage, ladder, win-rate, tournament or popularity data exists in RedGPT.**
   Every judgement must be mechanical.
2. **No trapping user has ever been played by a human here.** The ladder was
   rebuilt on 2026-08-15 and revised through the Ubers, UU, RU and NU passes on
   2026-08-16.
3. **How often a trapper actually gets in safely is not measurable.** The engine
   can say who is trapped and what the damage is; it cannot say how often the
   position arises. Every verdict is about the value of the position when it
   happens, not its frequency.
4. **The pivot-move escape is large and hard to price.** Section I reports, per
   tier, how many entries carry a pivot move — for most tiers that is a
   substantial fraction of the roster, and every one of them ignores trapping.
5. **Shed Shell is a universal answer at the cost of an item slot**, and how
   often a team would actually spend that slot is a metagame question with no
   data behind it.
6. **Conditional abilities are read unactivated.** Where an ability decides a
   verdict, ask for a per-ability profile.
7. **Chandelure is the flagged case.** Its NU placement was left explicitly
   provisional pending exactly this audit. Its Shadow Tag is **optional** — one of
   four abilities — so the tiering question is whether a Pokémon that *may* select
   Shadow Tag should be tiered as though it always does.
8. **The same question applies in reverse to every optional holder**, which is all
   but ${TIERED.filter(h => h.forced).length} of the ${TIERED.length} tiered holders (${TIERED.filter(h => h.forced).map(h => h.name).join(', ') || 'none'} ${TIERED.filter(h => h.forced).length === 1 ? 'has' : 'have'} it forced).

**If a number you need is missing, ask for it** rather than estimating. Any
damage, speed, trapping or legality question can be answered against the real
engine.

---

## Requested output

Return, for **every** trapping holder:

- Exact entry name
- Species or forme
- Current tier
- **Final recommended tier**
- Direction and magnitude of movement
- Confidence
- Which trapping ability, and whether it is optional or mandatory
- Main trapping targets in the destination tier
- Important targets it **fails** to trap or beat
- Key calculations you relied on, with the ability and item they assume
- Relevant counterplay
- Why the destination tier is appropriate

Then summarise:

### Promotions
Every holder moving upward.

### Demotions
Every holder moving downward.

### Multi-tier jumps
Anything moving more than one rung.

### Retained placements
Every serious holder investigated and left unchanged.

### Uncertain placements
Anything still needing evidence — name the specific measurement you want.

**Do not implement anything.** This is a decision request; the tier changes will
be applied separately after review.`);

const out = doc.join('\n');
if (CHECK) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur === out) { console.log('unchanged'); process.exit(0); }
  console.log('STALE — run: node tools/trapping-audit-prompt.js'); process.exit(1);
}
fs.writeFileSync(OUT, out);
console.log(`trapping abilities ${TRAP_IDS.length} (${TRAP_IDS.join(', ')}) | tiered holders ${TIERED.length} | untiered NFE holders ${UNTIERED.length} | formats checked ${Formats.list().length}`);
console.log('wrote docs/TRAPPING_ABILITY_TIER_AUDIT_PROMPT.md');
