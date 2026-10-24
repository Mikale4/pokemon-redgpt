/**
 * Team Builder data layer: set editing, validation, text import/export and
 * random team generation quality.
 */
'use strict';

const {createSuite} = require('./helpers/assert');
const {loadEngine} = require('./helpers/engine');

const suite = createSuite('teams');
const {test, assert, finish} = suite;

const RedGPT = loadEngine();
const {Dex, Pokemon, Formats, Validation, TeamText, Store, RandomTeams, RNG} = RedGPT;

function baseSet(species, options = {}) {
  return Pokemon.normalizeSet(Object.assign({species, level: 100}, options));
}

/* ------------------------------------------------------------------ *
 * Sets
 * ------------------------------------------------------------------ */

test('a new set is complete and self-consistent', () => {
  const set = baseSet('garchomp');
  assert.strictEqual(set.species, 'garchomp');
  assert.strictEqual(set.level, 100);
  assert.ok(Dex.hasAbility('garchomp', set.ability));
  assert.strictEqual(Object.keys(set.evs).length, 6);
  assert.strictEqual(Object.keys(set.ivs).length, 6);
  assert.strictEqual(set.ivs.hp, 31, 'IVs default to 31');
  assert.strictEqual(set.evs.hp, 0, 'EVs default to 0');
  assert.ok(Dex.TYPES.includes(set.teraType));
});

test('fillMoves only ever produces legal moves', () => {
  for (const speciesId of ['garchomp', 'blissey', 'shedinja', 'ditto', 'dragapult']) {
    const filled = Pokemon.fillMoves(baseSet(speciesId));
    assert.ok(filled.moves.length >= 1, `${speciesId} got no moves`);
    for (const moveId of filled.moves) {
      assert.ok(Dex.canLearn(speciesId, moveId) || moveId === 'struggle', `${speciesId} cannot learn ${moveId}`);
    }
  }
});

test('EV shortcuts respect the per-stat and total caps', () => {
  const set = Pokemon.applyEvPreset(baseSet('garchomp'), 'physicalSweeper');
  assert.strictEqual(set.evs.atk, 252);
  assert.strictEqual(set.evs.spe, 252);
  assert.ok(Pokemon.evTotal(set.evs) <= Pokemon.EV_TOTAL_LIMIT);
});

/* ------------------------------------------------------------------ *
 * Validation
 * ------------------------------------------------------------------ */

function firstError(team, format) {
  const result = Validation.validateTeam(team, format);
  return result.errors.length ? result.errors[0].message : null;
}

test('a legal team validates cleanly', () => {
  const team = {
    format: 'anythinggoes',
    sets: [
      baseSet('garchomp', {moves: ['earthquake', 'dragonclaw', 'swordsdance', 'stealthrock'], nature: 'jolly', evs: {atk: 252, spe: 252, hp: 4}, item: 'leftovers'}),
      baseSet('rotomwash', {moves: ['hydropump', 'voltswitch', 'willowisp', 'painsplit'], nature: 'bold', evs: {hp: 252, def: 252, spd: 4}, item: 'leftovers', ability: 'Levitate'}),
    ],
  };
  const result = Validation.validateTeam(team, 'anythinggoes');
  assert.deepStrictEqual([...result.errors.map(e => e.message)], []);
  assert.ok(result.valid);
});

test('an empty team is rejected', () => {
  assert.ok(/empty/i.test(firstError({sets: []}, 'anythinggoes')));
});

test('more than six Pokémon is rejected', () => {
  const sets = new Array(7).fill(null).map((_, i) => baseSet(['garchomp', 'gengar', 'snorlax', 'blissey', 'scizor', 'starmie', 'lapras'][i], {moves: ['tackle']}));
  assert.ok(/at most 6|at most six|6 Pokémon/i.test(firstError({sets}, 'anythinggoes')));
});

test('Species Clause blocks duplicates and different formes of the same species', () => {
  // Anything Goes deliberately has no Species Clause, and every other shipped
  // format now has a tier ceiling that would refuse these two first — so the
  // clause is tested on a custom ruleset that has it and nothing else.
  const sets = [baseSet('rotom', {moves: ['thundershock']}), baseSet('rotomwash', {moves: ['thundershock']})];
  const clause = Formats.custom({base: 'anythinggoes', speciesClause: true, allowRestricted: true});
  assert.ok(clause.rules.speciesClause, 'setup: the format really enforces Species Clause');
  const message = firstError({sets}, clause);
  assert.ok(/Species Clause/.test(message), message);
  // Control: without the clause the same pair is fine, so this is not passing
  // on some unrelated error.
  assert.strictEqual(firstError({sets}, 'anythinggoes'), null, 'CONTROL: legal where the clause is off');
});

test('an illegal move is rejected by name', () => {
  const sets = [baseSet('magikarp', {moves: ['hyperbeam']})];
  const message = firstError({sets}, 'anythinggoes');
  assert.ok(/cannot learn/i.test(message), message);
});

test('an illegal ability is rejected and lists the legal options', () => {
  const sets = [baseSet('garchomp', {ability: 'Levitate', moves: ['earthquake']})];
  const message = firstError({sets}, 'anythinggoes');
  assert.ok(/cannot have Levitate/.test(message) && /Rough Skin/.test(message), message);
});

test('EV limits are enforced', () => {
  const overTotal = [baseSet('garchomp', {moves: ['earthquake'], evs: {hp: 252, atk: 252, def: 252}})];
  assert.ok(/EVs used/.test(firstError({sets: overTotal}, 'anythinggoes')));
  const overStat = [baseSet('garchomp', {moves: ['earthquake'], evs: {atk: 300}})];
  const normalized = Pokemon.normalizeSet(overStat[0]);
  assert.strictEqual(normalized.evs.atk, 252, 'normalisation caps a stat at 252');
});

test('IV limits are enforced', () => {
  const set = baseSet('garchomp', {moves: ['earthquake']});
  set.ivs.atk = 99;
  const message = firstError({sets: [set]}, 'anythinggoes');
  assert.ok(/IVs must be a whole number between 0 and 31/.test(message), message);
});

test('a tier format refuses anything ranked above it, and the validator is what enforces it', () => {
  /*
   * `Formats.speciesPool` always filtered on `maxTier`, but the pool is only
   * what the *pickers* offer — the validator is what a built or imported team
   * is checked against, and it never asked. A Mewtwo therefore validated
   * cleanly in OU, UU and ZU. It went unnoticed while Standard Singles was the
   * default (no `maxTier`; it blocked Mewtwo via `allowRestricted: false`), and
   * became the whole ruleset when Standard was removed and OU became the
   * default on 2026-08-14.
   */
  const sets = [baseSet('mewtwo', {moves: ['psystrike']})];
  assert.ok(/Ubers tier/.test(firstError({sets}, 'tierou')), 'Ubers is refused in OU');
  assert.ok(/Ubers tier/.test(firstError({sets}, 'tierzu')), 'and refused all the way down');
  assert.strictEqual(firstError({sets}, 'tierubers'), null, 'but legal in its own tier');
  assert.strictEqual(firstError({sets}, 'anythinggoes'), null, 'and in Anything Goes, which has no ceiling');

  // Cumulative-downward: a lower tier is legal in a higher format, or every
  // ladder would be a single-tier cup.
  const low = [baseSet('pikachu', {moves: ['thunderbolt']})];
  assert.strictEqual(firstError({sets: low}, 'tierou'), null, 'a ZU Pokémon is legal in OU');

  // The validator must agree with the pool, or the picker offers what the team
  // screen then rejects.
  for (const id of ['tierou', 'tieruu', 'tierzu']) {
    const pool = Formats.speciesPool(id);
    assert.ok(pool.length > 0, `${id} pool is populated`);
    assert.ok(!pool.some(s => s.id === 'mewtwo'), `${id} pool excludes Mewtwo too`);
  }
});

test('tierRoster lists one tier strictly, with Megas under their own tier', () => {
  /*
   * Drives the Teams screen's Format browser. Strictly one rung, unlike
   * `speciesPool`, which is cumulative-downward because that is what a format
   * plays with — the OU *pool* is ~583 Pokémon, of which only a fraction are
   * actually OU.
   */
  const ou = Formats.tierRoster('OU');
  assert.ok(ou.length > 20 && ou.length < 200, `OU roster should be one tier's worth, saw ${ou.length}`);
  assert.ok(ou.every(entry => entry.kind === 'forme' || Dex.species(entry.id).tier === 'OU'),
    'every plain species in the roster is OU itself');
  assert.ok(Formats.speciesPool('tierou').length > ou.length,
    'the playable pool is larger than the tier, because it includes everything below');

  // A Mega is ranked apart from the Pokémon it belongs to — the whole reason
  // this cannot be a filter on `species.tier`.
  const megaX = ou.find(entry => entry.id === 'charizardmegax');
  assert.ok(megaX, 'Charizard-Mega-X belongs to OU');
  assert.strictEqual(megaX.kind, 'forme');
  assert.strictEqual(megaX.base, 'Charizard');
  assert.strictEqual(Dex.species('charizard').tier, 'ZU', 'while Charizard itself is ZU');
  assert.ok(Formats.tierRoster('ZU').some(entry => entry.id === 'charizard'),
    'and Charizard appears in the ZU roster instead');
  assert.ok(!ou.some(entry => entry.id === 'charizard'), 'the base forme is not pulled up into OU');

  // Mewtwo and both its Megas sit in Ubers together.
  const ubers = new Set(Formats.tierRoster('Ubers').map(entry => entry.id));
  for (const id of ['mewtwo', 'mewtwomegax', 'mewtwomegay']) {
    assert.ok(ubers.has(id), `${id} should be in Ubers`);
  }

  // No duplicates: Giratina-Origin is produced by both the Griseous Orb and the
  // Griseous Core, and listing it twice reads as two different Pokémon.
  for (const tier of Formats.TIER_ORDER) {
    const roster = Formats.tierRoster(tier);
    const ids = roster.map(entry => entry.id);
    assert.strictEqual(new Set(ids).size, ids.length, `${tier} roster has a duplicate`);
  }

  // Every tier is covered and nothing is lost between them.
  const total = Formats.TIER_ORDER.reduce((sum, tier) => sum + Formats.tierRoster(tier).length, 0);
  assert.ok(total > 700, `the tiers together should cover most of the roster, saw ${total}`);
});

test('banned moves are rejected per format', () => {
  const sets = [baseSet('lapras', {moves: ['sheercold']})];
  assert.ok(/banned/i.test(firstError({sets}, 'tierou')));
  assert.strictEqual(firstError({sets}, 'anythinggoes'), null);
});

test('Item Clause is enforced only where the format enables it', () => {
  const sets = [
    baseSet('garchomp', {moves: ['earthquake'], item: 'leftovers'}),
    baseSet('gengar', {moves: ['shadowball'], item: 'leftovers'}),
    baseSet('snorlax', {moves: ['bodyslam'], item: 'sitrusberry'}),
  ];
  assert.strictEqual(firstError({sets}, 'anythinggoes'), null, 'no shipped format has Item Clause');
  // No shipped preset carries Item Clause since Level 50 Singles and Battle
  // Tower were removed (2026-08-14), so the rule is exercised through a custom
  // ruleset — the validator is what is under test, not which presets exist.
  const itemClause = Formats.custom({itemClause: true, speciesClause: true});
  assert.ok(itemClause.rules.itemClause, 'setup: the custom format really enforces Item Clause');
  assert.ok(/Item Clause/.test(firstError({sets}, itemClause)), 'Item Clause is enforced when a format sets it');
});

test('battle-only formes are blocked outside Anything Goes and explained', () => {
  // A non-Mega battle-only forme: legal in Anything Goes, refused elsewhere.
  // "Elsewhere" is a custom format based on AG with `allowBattleOnly` off, so
  // the battle-only rule is tested on its own — a tier format would refuse
  // Aegislash-Blade on its tier first and prove nothing about this rule.
  const sets = [baseSet('aegislashblade', {moves: ['shadowball']})];
  const noBattleOnly = Formats.custom({base: 'anythinggoes', allowBattleOnly: false, allowRestricted: true});
  assert.strictEqual(noBattleOnly.rules.allowBattleOnly, false, 'setup: the format really refuses battle-only formes');
  assert.strictEqual(noBattleOnly.rules.maxTier, undefined, 'setup: and has no tier ceiling to interfere');
  const message = firstError({sets}, noBattleOnly);
  assert.ok(/battle-only forme/.test(message), message);
  assert.strictEqual(firstError({sets}, 'anythinggoes'), null, 'Anything Goes allows it');
});

test('Mega formes cannot be put on a team in any format', () => {
  // Mega Evolution is a real in-battle mechanic here, so a Mega forme is
  // reached by holding the stone and evolving — never by picking it directly.
  // Padded to three so the minimum-team-size formats reach the species check.
  const sets = [
    baseSet('charizardmegax', {moves: ['dragonclaw']}),
    baseSet('snorlax', {moves: ['bodyslam']}),
    baseSet('gengar', {moves: ['shadowball']}),
  ];
  /*
   * Every format refuses a Mega forme, Anything Goes included — §5 made them
   * `transformOnly`, so the base forme holding the stone is the only route.
   * The old list also carried `'battletower'`, which was never a real id (the
   * format was `'tower'`), so `Formats.get` fell back and it tested Standard a
   * second time. Removed with the three formats that were real.
   */
  for (const format of ['anythinggoes', 'tierubers', 'tierou', 'tierzu']) {
    const message = firstError({sets}, format);
    assert.ok(message && /in-battle transformation/.test(message),
      `${format} should refuse a Mega forme, got: ${message}`);
  }
  // The base forme holding the stone is the supported way, and is legal.
  const legal = [baseSet('charizard', {moves: ['dragonclaw'], item: 'charizarditex'})];
  assert.strictEqual(firstError({sets: legal}, 'anythinggoes'), null);
});

test('unsimulated abilities and items are warnings, not errors', () => {
  const set = baseSet('garchomp', {moves: ['earthquake'], item: 'berrysweet'});
  const result = Validation.validateTeam({sets: [set]}, 'anythinggoes');
  assert.ok(result.valid, 'an unimplemented item must not make the team illegal');
});

test('a forme item is not reported as useless to the Pokemon it transforms', () => {
  /*
   * `itemUser` names the forme the item is *for*, and for eight of the twelve
   * forme-item pairs that is the target rather than the holder — the Rusted
   * Sword says "Zacian-Crowned", each Ogerpon Mask says its own masked forme.
   * So the validator told a Zacian holding a Rusted Sword that the item does
   * nothing for it, printed directly above a Team Builder card reading "Enters
   * battle as Zacian-Crowned". Predates the Masks by some time; found while
   * adding them, because the note and the card contradicted each other on
   * screen.
   *
   * Driven off `Mechanics.heldForme`, the same function the card draws from, so
   * the two cannot disagree again.
   */
  const useless = (species, item) => {
    const result = Validation.validateTeam({sets: [baseSet(species, {moves: ['tackle'], item})]}, 'anythinggoes');
    return [...(result.warnings || []), ...(result.notes || [])]
      .map(w => w.message || String(w))
      .filter(message => /only does something for/.test(message));
  };

  const routes = [
    ['zacian', 'rustedsword'], ['zamazenta', 'rustedshield'], ['giratina', 'griseouscore'],
    ['dialga', 'adamantcrystal'], ['palkia', 'lustrousglobe'],
    ['ogerpon', 'hearthflamemask'], ['ogerpon', 'wellspringmask'], ['ogerpon', 'cornerstonemask'],
  ];
  const noisy = routes.filter(([species, item]) => useless(species, item).length)
    .map(([species, item]) => `${species}+${item}`);
  assert.deepStrictEqual([...noisy], [], 'a supported forme route must not be called useless');
  assert.strictEqual(routes.length, 8, 'and the count is asserted, so an empty list cannot pass vacuously');

  /*
   * Controls. The warning is genuinely useful and must survive: on a Pokémon
   * the item does nothing for, on the *same* Mask held by something that is not
   * an Ogerpon, and on a species-locked item that is not a forme item at all.
   */
  assert.ok(useless('blissey', 'hearthflamemask').length, 'CONTROL: a Mask on a Blissey is still useless');
  assert.ok(useless('snorlax', 'rustedsword').length, 'CONTROL: a Rusted Sword on a Snorlax is still useless');
  assert.ok(useless('blissey', 'lightball').length, 'CONTROL: a Light Ball on a Blissey is still useless');
  assert.strictEqual(useless('pikachu', 'lightball').length, 0, 'CONTROL: and silent on the Pokémon it is for');
});

test('auto-fix repairs a team only when asked', () => {
  const broken = {
    format: 'anythinggoes',
    sets: [
      baseSet('blissey', {moves: ['closecombat', 'softboiled'], ability: 'Levitate', evs: {hp: 252, atk: 252, def: 252}}),
      baseSet('mewtwo', {moves: ['psystrike']}),
    ],
  };
  assert.ok(!Validation.validateTeam(broken, 'anythinggoes').valid);
  const fixed = Validation.autoFix(broken, 'anythinggoes');
  const result = Validation.validateTeam({sets: fixed.sets}, 'anythinggoes');
  assert.deepStrictEqual([...result.errors.map(e => e.message)], []);
  assert.ok(fixed.changes.length > 0, 'auto-fix should report what it changed');
});

/* ------------------------------------------------------------------ *
 * Text import / export
 * ------------------------------------------------------------------ */

const SAMPLE = `Gengar @ Focus Sash
Ability: Cursed Body
Tera Type: Ghost
EVs: 4 Def / 252 SpA / 252 Spe
Timid Nature
IVs: 0 Atk
- Shadow Ball
- Sludge Bomb
- Focus Blast
- Destiny Bond

Chomper (Garchomp) (M) @ Rocky Helmet
Ability: Rough Skin
Level: 87
EVs: 252 HP / 4 Atk / 252 Def
Impish Nature
- Earthquake
- Dragon Tail
- Stealth Rock
- Roost`;

test('the documented sample team imports exactly', () => {
  const result = TeamText.importTeam(SAMPLE);
  assert.deepStrictEqual([...result.errors], []);
  assert.strictEqual(result.sets.length, 2);

  const gengar = result.sets[0];
  assert.strictEqual(gengar.species, 'gengar');
  assert.strictEqual(gengar.item, 'focussash');
  assert.strictEqual(gengar.ability, 'Cursed Body');
  assert.strictEqual(gengar.teraType, 'Ghost');
  assert.strictEqual(gengar.nature, 'timid');
  assert.strictEqual(gengar.evs.spa, 252);
  assert.strictEqual(gengar.evs.spe, 252);
  assert.strictEqual(gengar.evs.def, 4);
  assert.strictEqual(gengar.ivs.atk, 0);
  assert.strictEqual(gengar.ivs.spa, 31);
  assert.deepStrictEqual([...gengar.moves], ['shadowball', 'sludgebomb', 'focusblast', 'destinybond']);

  const chomp = result.sets[1];
  assert.strictEqual(chomp.species, 'garchomp');
  assert.strictEqual(chomp.nickname, 'Chomper');
  assert.strictEqual(chomp.gender, 'M');
  assert.strictEqual(chomp.level, 87);
  assert.strictEqual(chomp.item, 'rockyhelmet');
});

test('export then import is a lossless round trip', () => {
  const original = TeamText.importTeam(SAMPLE).sets;
  const text = TeamText.exportTeam({sets: original});
  const reimported = TeamText.importTeam(text);
  assert.deepStrictEqual([...reimported.errors], []);
  assert.strictEqual(reimported.sets.length, original.sets ? original.sets.length : original.length);
  for (let i = 0; i < original.length; i++) {
    const a = original[i];
    const b = reimported.sets[i];
    for (const key of ['species', 'nickname', 'level', 'gender', 'ability', 'item', 'nature', 'teraType']) {
      assert.strictEqual(b[key], a[key], `${key} differs on set ${i + 1}`);
    }
    assert.deepStrictEqual([...b.moves], [...a.moves]);
    assert.deepStrictEqual({...b.evs}, {...a.evs});
    assert.deepStrictEqual({...b.ivs}, {...a.ivs});
  }
});

test('import errors identify the offending set and field', () => {
  const bad = `Notapokemon @ Leftovers
Ability: Levitate
- Tackle

Garchomp @ Nonexistent Item
Ability: Not An Ability
Wrong Nature
EVs: 999 Bananas
- Earthquake
- Notamove`;
  const result = TeamText.importTeam(bad);
  const joined = result.errors.join('\n');
  assert.ok(/Set 1: "Notapokemon" is not a Pokémon/.test(joined), joined);
  assert.ok(/Set 2: unknown held item "Nonexistent Item"/.test(joined), joined);
  assert.ok(/Set 2: "Not An Ability" is not an ability/.test(joined), joined);
  assert.ok(/Set 2: "Bananas" is not a stat name/.test(joined), joined);
  assert.ok(/Set 2: "Notamove" is not a move/.test(joined), joined);
  assert.strictEqual(result.sets.length, 1, 'the unparseable species is dropped, the rest is kept');
});

test('empty input reports a useful message rather than throwing', () => {
  const result = TeamText.importTeam('   \n\n  ');
  assert.strictEqual(result.sets.length, 0);
  assert.ok(/No Pokémon/.test(result.errors[0]));
});

test('a team with no EV or IV lines exports without those lines', () => {
  const text = TeamText.exportSet(baseSet('garchomp', {moves: ['earthquake'], nature: 'serious'}));
  assert.ok(!/EVs:/.test(text));
  assert.ok(!/IVs:/.test(text));
  assert.ok(/Serious Nature/.test(text));
});

/* ------------------------------------------------------------------ *
 * Team storage
 * ------------------------------------------------------------------ */

test('teams round-trip through storage', () => {
  Store.reset();
  const team = Store.createTeam({name: 'Test squad', format: 'anythinggoes', sets: [baseSet('garchomp', {moves: ['earthquake']})]});
  Store.update(data => { data.arena.teams.push(team); data.arena.activeTeamId = team.id; });
  const reloaded = Store.load();
  assert.strictEqual(reloaded.arena.teams.length, 1);
  assert.strictEqual(reloaded.arena.teams[0].name, 'Test squad');
  assert.strictEqual(reloaded.arena.teams[0].sets[0].species, 'garchomp');
});

/* ------------------------------------------------------------------ *
 * Random teams
 * ------------------------------------------------------------------ */

test('random teams are full, legal and free of duplicates', () => {
  for (let seed = 0; seed < 25; seed++) {
    const rng = new RNG(seed * 101 + 3);
    const team = RandomTeams.randomTeam(rng, {format: 'random'});
    assert.strictEqual(team.sets.length, 6, `seed ${seed} produced ${team.sets.length} Pokémon`);
    const result = Validation.validateTeam({sets: team.sets}, 'random');
    assert.deepStrictEqual([...result.errors.map(e => e.message)], [], `seed ${seed}`);
    const bases = team.sets.map(s => Dex.species(s.species).baseSpecies);
    assert.strictEqual(new Set(bases).size, 6, `seed ${seed} has duplicate base species`);
  }
});

test('random sets match their offensive bias instead of dumping four random moves', () => {
  const problems = [];
  for (let seed = 0; seed < 30; seed++) {
    const rng = new RNG(seed * 61 + 11);
    for (const set of RandomTeams.randomTeam(rng, {format: 'random'}).sets) {
      const species = Dex.species(set.species);
      const moves = set.moves.map(id => Dex.move(id));
      const physical = moves.filter(m => m.category === 'Physical').length;
      const special = moves.filter(m => m.category === 'Special').length;
      const attacks = physical + special;
      if (attacks === 0) problems.push(`${species.name} has no attacking move`);
      // A strongly physical Pokémon should not be handed a purely special set.
      if (species.baseStats.atk >= species.baseStats.spa + 40 && special >= 3 && physical === 0) {
        problems.push(`${species.name} (Atk ${species.baseStats.atk}/SpA ${species.baseStats.spa}) got ${special} special moves`);
      }
      if (species.baseStats.spa >= species.baseStats.atk + 40 && physical >= 3 && special === 0) {
        problems.push(`${species.name} (Atk ${species.baseStats.atk}/SpA ${species.baseStats.spa}) got ${physical} physical moves`);
      }
      if (new Set(set.moves).size !== set.moves.length) problems.push(`${species.name} has a duplicate move`);
    }
  }
  assert.deepStrictEqual(problems.slice(0, 5), []);
});

test('generated sets can carry Trick Room, and only where it belongs', () => {
  /*
   * Reported from a real battle: a Calyrex-Ice was outsped and killed by a
   * Volcarona it would have moved first against under Trick Room, and the
   * player asked why it had not set one. It never had it — **0 of 300**
   * generated sets carried Trick Room, despite base 50 Speed and base 165
   * Attack making it the best user of the move in the game.
   *
   * The same shape as the priority slot below: `chooseMoves` picks attacks by
   * power and utility by role, and Trick Room is neither. It is a *stat-profile*
   * move, so it needs a slot of its own.
   *
   * The effective rate is well below the 45% roll because the slot is often
   * already full by then — that is legitimate competition with STAB, setup and
   * a priority attack, not a defect, so the assertion is a band rather than a
   * target.
   */
  const rate = speciesId => {
    const species = Dex.species(speciesId);
    let hits = 0;
    for (let seed = 0; seed < 60; seed++) {
      const set = RandomTeams.randomSet(species, new RNG(8100 + seed), {format: Formats.get('singles'), level: 100});
      if (set.moves.includes('trickroom')) hits++;
    }
    return hits;
  };

  const problems = [];
  // Slow and strong: the move is for them, so it must be reachable — and must
  // not be automatic, or every one of them becomes the same set.
  for (const id of ['calyrexice', 'hatterene']) {
    const hits = rate(id);
    if (hits === 0) problems.push(`${id} never gets Trick Room`);
    if (hits >= 55) problems.push(`${id} gets Trick Room ${hits}/60 — the roll is not being made`);
  }
  /*
   * CONTROLS, both directions. Fast Pokémon are the ones Trick Room actively
   * hurts, and a slow *weak* one gains nothing by moving first — if either
   * picked it up, the gate would be "is it slow" rather than "is this the
   * Pokémon the move was written for".
   */
  for (const id of ['dragapult', 'pheromosa', 'zeraora']) {
    if (rate(id) > 0) problems.push(`${id} is fast and must never roll Trick Room`);
  }
  for (const id of ['blissey', 'shuckle', 'chansey']) {
    if (rate(id) > 0) problems.push(`${id} is slow but cannot use the turn it buys`);
  }
  assert.deepStrictEqual([...problems], [], problems.join('; '));

  // Whether the AI *uses* it is asserted in tests/engine-battle.js; this suite
  // owns the question of whether the option exists at all.
});

test('generated sets can carry a priority attack, without it becoming filler', () => {
  /*
   * Reported from a real battle: a lead Kingambit died to a faster Ho-Oh without
   * acting, and the player asked why it had not used Sucker Punch. It never had it.
   * `movePower` ignored priority entirely, and step 1 of `chooseMoves` takes the
   * highest-power STAB per type and dedupes by type — so Kowtow Cleave (85) always
   * beat Sucker Punch (80), and Sucker Punch could then never be the second Dark
   * STAB either. Measured 0 of 40 sets, likewise for Bullet Punch, Grassy Glide and
   * Upper Hand. Five moves in this project have *unconditional* priority (§5), which
   * makes them the answer to exactly the situation in that log.
   *
   * Asserted in both directions, because a naive fix breaks the other one:
   *   - a species whose priority move is worth having must actually get it, and must
   *     keep its main STAB;
   *   - a 40 BP jab on a species with no Technician must NOT become filler.
   */
  const rate = (speciesId, moveId) => {
    const species = Dex.species(speciesId);
    let hits = 0;
    for (let seed = 0; seed < 40; seed++) {
      const set = RandomTeams.randomSet(species, new RNG(7000 + seed), {format: Formats.get('singles'), level: 100});
      if (set.moves.includes(moveId)) hits++;
    }
    return hits;
  };

  const problems = [];
  // Worth carrying: these should appear often, but not always (the slot is a 70%
  // roll, so "always" would mean the roll is not being made).
  for (const [speciesId, moveId] of [
    ['kingambit', 'suckerpunch'],
    ['rillaboom', 'grassyglide'],      // priority applied by the engine, not the data
    ['scizor', 'bulletpunch'],         // 40 BP, but Technician makes it 60
  ]) {
    if (!Dex.canLearn(Dex.species(speciesId), moveId)) continue;
    const hits = rate(speciesId, moveId);
    if (hits < 10) problems.push(`${speciesId} got ${moveId} in only ${hits}/40 sets`);
    if (hits === 40) problems.push(`${speciesId} got ${moveId} in all 40 sets — the chance roll is not applied`);
  }

  // Kingambit must keep its stronger STAB alongside the priority move: a power
  // bonus would have made Sucker Punch *replace* Kowtow Cleave, which is worse.
  if (rate('kingambit', 'kowtowcleave') < 38) {
    problems.push('Kingambit lost its main Dark STAB to the priority slot');
  }

  // CONTROL: a weak jab on a species that cannot boost it stays out.
  if (Dex.canLearn(Dex.species('raichu'), 'quickattack') && rate('raichu', 'quickattack') > 4) {
    problems.push('Quick Attack became filler on Raichu — the power floor is not holding');
  }
  assert.deepStrictEqual(problems, []);
});

test('random teams have reasonable type diversity', () => {
  let worst = 0;
  for (let seed = 0; seed < 20; seed++) {
    const rng = new RNG(seed * 17 + 5);
    const team = RandomTeams.randomTeam(rng, {format: 'random'});
    const counts = {};
    for (const set of team.sets) {
      for (const type of Dex.species(set.species).types) counts[type] = (counts[type] || 0) + 1;
    }
    worst = Math.max(worst, Math.max(...Object.values(counts)));
  }
  assert.ok(worst <= 4, `a generated team stacked ${worst} Pokémon of one type`);
});

test('random sets pick natures and EVs that match their role', () => {
  const rng = new RNG(777);
  for (const set of RandomTeams.randomTeam(rng, {format: 'random'}).sets) {
    const nature = Dex.nature(set.nature);
    const moves = set.moves.map(id => Dex.move(id));
    const usesPhysical = moves.some(m => m.category === 'Physical');
    const usesSpecial = moves.some(m => m.category === 'Special');
    if (nature.plus === 'atk') assert.ok(usesPhysical, `${set.species} has an Attack-boosting nature but no physical move`);
    if (nature.plus === 'spa') assert.ok(usesSpecial, `${set.species} has a Sp. Atk nature but no special move`);
    if (!usesPhysical) assert.strictEqual(set.ivs.atk, 0, `${set.species} should minimise Attack IVs`);
    assert.ok(Pokemon.evTotal(set.evs) <= Pokemon.EV_TOTAL_LIMIT);
  }
});

test('generation is reproducible from a seed', () => {
  const a = RandomTeams.randomTeam(new RNG(2024), {format: 'random'});
  const b = RandomTeams.randomTeam(new RNG(2024), {format: 'random'});
  assert.strictEqual(JSON.stringify(a.sets), JSON.stringify(b.sets));
});

test('a generated Arceus or Silvally forme is given the item that is its typing', () => {
  /*
   * Multitype and RKS System take the forme from a held Plate or Memory, so a
   * generated Arceus-Water holding Leftovers reverts to Normal-type Arceus the
   * instant it enters — carrying a moveset chosen for a typing it no longer
   * has. Every one of the 17 Arceus and 17 Silvally formes was built that way,
   * and nothing caught it because the set was perfectly legal and the battle
   * threw no error. Asserted through a real battle rather than by reading the
   * item back, because the entry hook is the thing that was broken.
   */
  /*
   * Rewritten 2026-08-15: the typed formes are no longer selectable, so the
   * generator is handed **base** Arceus and Silvally and rolls a Plate or
   * Memory itself (`FORME_TYPE_ITEM_POOL`). The guarantee is unchanged and
   * still worth pinning through a real battle — whatever item it picks, the
   * Pokémon must actually enter as that type rather than reverting to Normal.
   */
  const {Battle} = RedGPT;
  const formes = Formats.speciesPool(Formats.get('anythinggoes'))
    .filter(s => !s.missing && ['Arceus', 'Silvally'].includes(s.baseSpecies || s.name));
  assert.deepStrictEqual([...formes.map(s => s.name)].sort(), ['Arceus', 'Silvally'],
    'only the two base species are selectable now');

  // Many rolls, because the item is random: a version that stopped giving them
  // one at all would otherwise pass whenever the roll happened to be Normal.
  let typed = 0;
  for (let i = 0; i < 24; i++) {
    for (const species of formes) {
      const rolled = RandomTeams.randomSet(species, new RNG(`plate-${species.id}-${i}`), {format: 'anythinggoes', level: 100});
      const item = Dex.item(rolled.item);
      if (item && (item.onPlate || item.onMemory)) typed++;
    }
  }
  assert.ok(typed >= 40, `a generated Arceus or Silvally should be given a Plate or Memory (got ${typed} of 48)`);

  const foe = Pokemon.normalizeSet({species: 'pikachu', level: 100});
  const wrong = [];
  for (const species of formes) {
    const set = Pokemon.normalizeSet({
      ...RandomTeams.randomSet(species, new RNG(`forme-${species.id}`), {format: 'anythinggoes', level: 100}),
      level: 100,
    });
    const battle = new Battle({
      format: Formats.get('anythinggoes'),
      seed: 7,
      sides: [
        {name: 'A', team: [set], controller: 'ai', ai: {difficulty: 'expert'}},
        {name: 'B', team: [foe], controller: 'ai', ai: {difficulty: 'expert'}},
      ],
    });
    battle.start();
    const active = battle.active(0);
    /*
     * The forme must match **the held item**, not the set's species. That is
     * the reversal from the old version of this test: the set now always names
     * the base species, and entering as the item's type is the correct
     * behaviour rather than the bug. A Mind Plate Arceus that stayed plain
     * Normal on entry would be the original §8 defect in a new costume.
     */
    const type = Dex.item(set.item)?.onPlate || Dex.item(set.item)?.onMemory;
    const expected = type && type !== 'Normal' ? Dex.toID(`${species.name}${type}`) : species.id;
    if (Dex.toID(active.species) !== expected) {
      wrong.push(`${species.name} holding ${set.item || '(none)'} entered as ${active.species}, expected ${expected}`);
    }
    /*
     * `baseTypes`, not `types`: both sides are AI, so `start()` auto-resolves
     * the whole battle and an Expert AI will happily Terastallize, which
     * replaces `types` outright. `baseTypes` is what the forme change actually
     * set, which is the thing under test.
     */
    if (type && !active.baseTypes.includes(type)) {
      wrong.push(`${species.name} holding ${set.item} is not ${type}-type (baseTypes ${active.baseTypes.join('/')})`);
    }
  }
  assert.deepStrictEqual([...wrong], [], `forme did not follow the held item: ${wrong.join(', ')}`);
});

/* ------------------------------------------------------------------ *
 * Formats
 * ------------------------------------------------------------------ */

test('formats are data-driven rule objects with distinct pools', () => {
  // Rewritten for the tier ladder: Standard Singles was removed on 2026-08-14
  // and OverUsed is the default, so the pool is decided by `maxTier` rather
  // than by the `powerClass` snapshot Standard used.
  const ou = Formats.get(Formats.DEFAULT_FORMAT);
  const anything = Formats.get('anythinggoes');
  assert.strictEqual(ou.id, 'tierou', 'OverUsed is the default format');
  assert.ok(ou.rules.speciesClause);
  assert.ok(!anything.rules.speciesClause);
  assert.ok(Formats.speciesPool(anything).length > Formats.speciesPool(ou).length);
  // Every member is OU or below — the ladder is cumulative-downward.
  assert.ok(Formats.speciesPool(ou).every(s => Formats.tierAllowed(s.tier, 'OU')),
    'the OU pool must contain nothing ranked above OU');
  // And the ladder really narrows as it descends, so the pools are distinct.
  const sizes = ['tierubers', 'tierou', 'tieruu', 'tierru', 'tiernu', 'tierpu', 'tierzu']
    .map(id => Formats.speciesPool(id).length);
  for (let i = 1; i < sizes.length; i++) {
    assert.ok(sizes[i] < sizes[i - 1], `each rung should be smaller than the one above: ${sizes.join(' > ')}`);
  }
});

test('a Custom Game format applies the chosen settings', () => {
  // Based on Anything Goes explicitly: the default is now a *tier* format, and
  // inheriting its `maxTier` would quietly filter the restricted species this
  // test is about.
  const custom = Formats.custom({base: 'anythinggoes', level: 50, teamSize: 3, bringCount: 3, speciesClause: false, tera: false, allowRestricted: true});
  assert.strictEqual(custom.rules.forceLevel, 50);
  assert.strictEqual(custom.rules.teamSize, 3);
  assert.strictEqual(custom.rules.tera, false);
  assert.ok(custom.rules.allowRestricted);
  assert.ok(Formats.speciesPool(custom).some(s => s.powerClass === 'restricted'));
});

finish();
