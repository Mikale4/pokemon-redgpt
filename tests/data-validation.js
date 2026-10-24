/**
 * Packaged data integrity.
 *
 * Every playable species must have complete, self-consistent battle data and
 * real front/back artwork — a Pokémon can never reference a missing sprite.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {createSuite} = require('./helpers/assert');
const {loadEngine} = require('./helpers/engine');

const ROOT = path.resolve(__dirname, '..');
const suite = createSuite('data-validation');
const {test, assert, finish} = suite;

const pokemon = require(path.join(ROOT, 'data/pokemon.json'));
const moves = require(path.join(ROOT, 'data/moves.json'));
const abilities = require(path.join(ROOT, 'data/abilities.json'));
const items = require(path.join(ROOT, 'data/items.json'));
const natures = require(path.join(ROOT, 'data/natures.json'));
const typeChart = require(path.join(ROOT, 'data/type-chart.json'));

const RedGPT = loadEngine();
const Dex = RedGPT.Dex;
const Pokemon = RedGPT.Pokemon;

const FRONT_DIR = path.join(ROOT, 'Assets/Sprites/Pokemon Sprites/Front');
const BACK_DIR = path.join(ROOT, 'Assets/Sprites/Pokemon Sprites/Back');
const ITEM_DIR = path.join(ROOT, 'Assets/Sprites/Items');
const frontFiles = new Set(fs.readdirSync(FRONT_DIR));
const backFiles = new Set(fs.readdirSync(BACK_DIR));
const itemFiles = new Set(fs.readdirSync(ITEM_DIR));

/* ------------------------------ scale ------------------------------ */

test('the roster is substantially larger than the original 151', () => {
  assert.ok(pokemon.length > 1000, `only ${pokemon.length} species enabled`);
});
test('species ids and names are unique', () => {
  assert.strictEqual(new Set(pokemon.map(p => p.id)).size, pokemon.length, 'duplicate species id');
  assert.strictEqual(new Set(pokemon.map(p => p.name)).size, pokemon.length, 'duplicate species name');
});
test('later generations and regional formes are present', () => {
  for (const id of ['garchomp', 'dragapult', 'ironvaliant', 'rattataalola', 'zapdosgalar', 'rotomwash', 'urshifurapidstrike']) {
    assert.ok(pokemon.some(p => p.id === id), `${id} is missing from the roster`);
  }
});

/* --------------------------- per-species --------------------------- */

const badStats = [];
const badTypes = [];
const missingFront = [];
const missingBack = [];
const badAbilities = [];
const badLearnsets = [];
const badEvolutions = [];

for (const species of pokemon) {
  const total = Object.values(species.baseStats).reduce((a, b) => a + b, 0);
  if (total !== species.bst) badStats.push(species.name);
  if (Object.keys(species.baseStats).length !== 6) badStats.push(`${species.name} (stat count)`);
  if (!species.types.length || species.types.length > 2 || species.types.some(t => !typeChart[t])) badTypes.push(species.name);
  if (!species.front || !frontFiles.has(species.front)) missingFront.push(species.name);
  if (!species.back || !backFiles.has(species.back)) missingBack.push(species.name);
  const abilityNames = Object.values(species.abilities);
  if (!abilityNames.length || abilityNames.some(name => !abilities[Dex.toID(name)])) badAbilities.push(species.name);
  const learn = Object.keys(species.learnset);
  if (!learn.length || learn.some(id => !moves[id])) badLearnsets.push(species.name);
  for (const rule of species.evolutions || []) {
    if (!pokemon.some(p => p.id === rule.target)) badEvolutions.push(`${species.name} -> ${rule.target}`);
    if (rule.method === 'level' && !(rule.level > 0)) badEvolutions.push(`${species.name} level rule`);
    if (rule.method === 'item' && !items[rule.item]) badEvolutions.push(`${species.name} item ${rule.item}`);
  }
}

test('every species BST equals the sum of its six base stats', () => assert.deepStrictEqual(badStats, []));
test('every species has one or two valid types', () => assert.deepStrictEqual(badTypes, []));
test('every playable species has an existing front sprite', () => assert.deepStrictEqual(missingFront, []));
test('every playable species has an existing back sprite', () => assert.deepStrictEqual(missingBack, []));
test('every species ability exists in the ability database', () => assert.deepStrictEqual(badAbilities, []));
test('every learnset entry references a packaged move', () => assert.deepStrictEqual(badLearnsets, []));
test('every evolution rule targets a playable species with a usable requirement', () => assert.deepStrictEqual(badEvolutions, []));

/* ------------------------------ moves ------------------------------ */

const badMoves = [];
for (const [id, move] of Object.entries(moves)) {
  if (!move.name || !move.type || !move.category) badMoves.push(`${id}: missing core fields`);
  if (!['Physical', 'Special', 'Status'].includes(move.category)) badMoves.push(`${id}: bad category`);
  if (!(move.pp > 0)) badMoves.push(`${id}: bad PP`);
  if (!typeChart[move.type]) badMoves.push(`${id}: unknown type ${move.type}`);
  if (move.basePower > 0 && move.category === 'Status') badMoves.push(`${id}: status move with base power`);
}
test('every packaged move has valid core data', () => assert.deepStrictEqual(badMoves.slice(0, 10), []));
test('the move database covers far more than the Kanto subset', () => {
  assert.ok(Object.keys(moves).length > 700, `only ${Object.keys(moves).length} moves`);
});
test('known move values are correct', () => {
  // 95, not the modern 90 — see the restoration test below.
  assert.strictEqual(moves.thunderbolt.basePower, 95);
  assert.strictEqual(moves.thunderbolt.category, 'Special');
  assert.strictEqual(moves.closecombat.basePower, 120);
  assert.strictEqual(moves.stealthrock.category, 'Status');
  assert.strictEqual(moves.protect.priority, 4);
});

/* ------------------------- abilities / items ------------------------- */

test('abilities carry descriptions', () => {
  const empty = Object.values(abilities).filter(a => !a.shortDesc).map(a => a.name);
  assert.deepStrictEqual(empty, []);
});
test('item sprites that are declared actually exist', () => {
  const broken = Object.values(items).filter(i => i.sprite && !itemFiles.has(i.sprite)).map(i => i.name);
  assert.deepStrictEqual(broken, []);
});
test('the competitive item staples are packaged', () => {
  for (const id of ['leftovers', 'lifeorb', 'choiceband', 'choicespecs', 'choicescarf', 'focussash',
    'heavydutyboots', 'assaultvest', 'rockyhelmet', 'eviolite', 'boosterenergy']) {
    assert.ok(items[id], `${id} is missing`);
  }
});

/* ------------------------------ natures ------------------------------ */

test('all 25 natures exist with correct modifiers', () => {
  assert.strictEqual(Object.keys(natures).length, 25);
  assert.strictEqual(natures.adamant.plus, 'atk');
  assert.strictEqual(natures.adamant.minus, 'spa');
  assert.strictEqual(natures.serious.plus, natures.serious.minus);
});

/* ------------------------------ type chart ------------------------------ */

test('the type chart is complete and correct', () => {
  const types = Object.keys(typeChart);
  assert.strictEqual(types.length, 18);
  for (const attack of types) {
    assert.strictEqual(Object.keys(typeChart[attack]).length, 18, `${attack} row incomplete`);
  }
  assert.strictEqual(typeChart.Ghost.Psychic, 2);
  assert.strictEqual(typeChart.Ice.Fire, 0.5);
  assert.strictEqual(typeChart.Fairy.Dragon, 2);
  assert.strictEqual(typeChart.Normal.Ghost, 0);
  assert.strictEqual(typeChart.Ground.Flying, 0);
});

/* ------------------------- campaign content ------------------------- */

const Content = RedGPT.CampaignContent;
const TRAINER_DIR = path.join(ROOT, 'Assets/Sprites/Trainer Sprites');
const BG_DIR = path.join(ROOT, 'Assets/Battle Backgrounds');
const trainerFiles = new Set(fs.readdirSync(TRAINER_DIR));
const bgFiles = new Set(fs.readdirSync(BG_DIR));

test('every boss team is legal: species, abilities, items and preferred moves', () => {
  const problems = [];
  for (const boss of [...Content.BOSSES, Content.FINAL_BOSS]) {
    if (!trainerFiles.has(boss.sprite)) problems.push(`${boss.name}: sprite ${boss.sprite}`);
    if (boss.background && !bgFiles.has(boss.background)) problems.push(`${boss.name}: background`);
    for (const member of boss.members) {
      const species = Dex.species(member.species);
      if (species.missing) { problems.push(`${boss.name}: unknown species ${member.species}`); continue; }
      if (!Dex.hasAbility(species, member.ability)) problems.push(`${boss.name}/${species.name}: ability ${member.ability}`);
      if (member.item && !Dex.item(member.item)) problems.push(`${boss.name}/${species.name}: item ${member.item}`);
      for (const moveId of member.moves) {
        if (!Dex.hasMove(moveId)) problems.push(`${boss.name}/${species.name}: unknown move ${moveId}`);
        else if (!Dex.canLearn(species, moveId)) problems.push(`${boss.name}/${species.name}: illegal move ${moveId}`);
      }
    }
  }
  assert.deepStrictEqual(problems, []);
});

test('each Act has at least two boss options and a final boss', () => {
  for (const act of [1, 2, 3]) {
    assert.ok(Content.BOSSES.filter(b => b.act === act).length >= 2, `act ${act} has too few bosses`);
  }
  assert.ok(Content.FINAL_BOSS.members.length === 6, 'the final boss must field six Pokémon');
});

test('trainer archetypes, events and node backgrounds reference real assets', () => {
  const problems = [];
  for (const archetype of Content.TRAINER_ARCHETYPES) {
    if (!trainerFiles.has(archetype.sprite)) problems.push(`trainer ${archetype.name}`);
  }
  for (const event of Content.EVENTS) {
    if (event.sprite && !trainerFiles.has(event.sprite)) problems.push(`event ${event.id} sprite`);
    if (event.background && !bgFiles.has(event.background)) problems.push(`event ${event.id} background`);
    if (!event.choices.length || event.choices.length > 3) problems.push(`event ${event.id} choice count`);
  }
  for (const list of Object.values(Content.NODE_BACKGROUNDS)) {
    for (const bg of list) if (!bgFiles.has(bg)) problems.push(`background ${bg}`);
  }
  for (const consumable of Object.values(Content.CONSUMABLES)) {
    if (!itemFiles.has(consumable.sprite)) problems.push(`consumable ${consumable.id}`);
  }
  assert.deepStrictEqual(problems, []);
});

test('Rare Encounter species lists resolve and stay non-empty', () => {
  /*
   * Ultra Beasts and Paradox Pokémon carry no flag in the packaged data, so
   * `content.js` lists them by id. A rename upstream would silently empty a list
   * and Rare Encounters would quietly stop producing that family — no error, just
   * missing content. Assert the lists resolve *and* that they are populated, so
   * the check cannot pass by being vacuous.
   */
  const {ultraBeasts, paradox, marqueeChance} = Content.RARE_ENCOUNTER;
  assert.ok(ultraBeasts.length >= 10, `expected the Ultra Beast list to be populated, got ${ultraBeasts.length}`);
  assert.ok(paradox.length >= 15, `expected the Paradox list to be populated, got ${paradox.length}`);
  assert.ok(marqueeChance > 0 && marqueeChance < 1, `marqueeChance must be a probability, got ${marqueeChance}`);

  const problems = [];
  for (const id of [...ultraBeasts, ...paradox]) {
    // `Dex.species` returns a truthy UNKNOWN_SPECIES stub for a typo (§8), so
    // `hasSpecies` is the only real predicate here.
    if (!Dex.hasSpecies(id)) problems.push(`unknown species ${id}`);
  }
  // Note: a "no pre-evolution" check was tried here and is wrong — Naganadel
  // evolves from Poipole and both are Ultra Beasts, so the families are not all
  // standalone forms. What *is* invariant is that nothing is listed twice, and
  // that no species is claimed by both families.
  for (const [name, list] of [['ultraBeasts', ultraBeasts], ['paradox', paradox]]) {
    const seen = new Set();
    for (const id of list) {
      if (seen.has(id)) problems.push(`${name} lists ${id} twice`);
      seen.add(id);
    }
  }
  for (const id of ultraBeasts) {
    if (paradox.includes(id)) problems.push(`${id} is listed as both an Ultra Beast and a Paradox Pokémon`);
  }
  assert.deepStrictEqual(problems, []);
});

test('every held item offered by the Campaign is actually simulated', () => {
  const problems = [];
  for (const [tier, list] of Object.entries(Content.HELD_ITEM_POOL)) {
    for (const id of list) {
      if (!Dex.item(id)) problems.push(`${tier}: unknown item ${id}`);
      else if (!RedGPT.Items.registry[id]) problems.push(`${tier}: ${id} has no battle implementation`);
    }
  }
  for (const id of Content.EVOLUTION_ITEMS) {
    if (!Dex.item(id)) problems.push(`evolution item ${id} does not exist`);
  }
  assert.deepStrictEqual(problems, []);
});

test('starter pools only contain playable species', () => {
  const problems = [];
  for (const pool of Object.values(Content.STARTER_POOLS)) {
    for (const id of pool.species) if (!Dex.hasSpecies(id)) problems.push(`${pool.id}: ${id}`);
    if (pool.species.length < 12) problems.push(`${pool.id} is too small to draft from`);
  }
  assert.deepStrictEqual(problems, []);
});

test('pre-nerf base stats stay restored after a data rebuild', () => {
  // These species were nerfed by later games/patches; RedGPT deliberately keeps
  // the earlier spreads via LEGACY_BASE_STATS in tools/generate-data.js. Running
  // `npm run build:data` against a newer @pkmn must not quietly undo that, so
  // both the runtime bundle and the JSON copy are checked here.
  const expected = {
    aegislash:        {hp: 60, atk: 50, def: 150, spa: 50, spd: 150, spe: 60, bst: 520},
    aegislashblade:   {hp: 60, atk: 150, def: 50, spa: 150, spd: 50, spe: 60, bst: 520},
    cresselia:        {hp: 120, atk: 70, def: 120, spa: 75, spd: 130, spe: 85, bst: 600},
    zacian:           {hp: 92, atk: 130, def: 115, spa: 80, spd: 115, spe: 138, bst: 670},
    zaciancrowned:    {hp: 92, atk: 170, def: 115, spa: 80, spd: 115, spe: 148, bst: 720},
    zamazenta:        {hp: 92, atk: 130, def: 115, spa: 80, spd: 115, spe: 138, bst: 670},
    zamazentacrowned: {hp: 92, atk: 130, def: 145, spa: 80, spd: 145, spe: 128, bst: 720},
    wochien:          {hp: 85, atk: 90, def: 100, spa: 100, spd: 135, spe: 70, bst: 580},
    chienpao:         {hp: 80, atk: 130, def: 80, spa: 90, spd: 65, spe: 135, bst: 580},
    tinglu:           {hp: 165, atk: 110, def: 130, spa: 50, spd: 80, spe: 45, bst: 580},
    chiyu:            {hp: 55, atk: 80, def: 80, spa: 145, spd: 120, spe: 100, bst: 580},
  };
  const stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
  const raw = new Map(pokemon.map(s => [s.id, s]));
  const problems = [];
  for (const [id, want] of Object.entries(expected)) {
    const species = Dex.species(id);
    if (species.missing) { problems.push(`${id} is not in the dataset`); continue; }
    for (const key of stats) {
      if (species.baseStats[key] !== want[key]) {
        problems.push(`${id} ${key}: ${species.baseStats[key]} should be ${want[key]}`);
      }
    }
    const sum = stats.reduce((total, key) => total + species.baseStats[key], 0);
    if (sum !== want.bst) problems.push(`${id} stats sum to ${sum}, expected ${want.bst}`);
    if (species.bst !== want.bst) problems.push(`${id} stored bst ${species.bst}, expected ${want.bst}`);
    const json = raw.get(id);
    if (!json) problems.push(`${id} missing from data/pokemon.json`);
    else if (stats.some(key => json.baseStats[key] !== want[key]) || json.bst !== want.bst) {
      problems.push(`${id} differs between game-data.js and pokemon.json`);
    }
  }
  assert.deepStrictEqual(problems, []);
});

test('every species has a real typing and a bst matching its stats', () => {
  const stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
  const known = new Set(Object.keys(Dex.typeChart));
  const problems = [];
  for (const species of Dex.allSpecies) {
    if (!species.types?.length) { problems.push(`${species.name} has no typing`); continue; }
    const bad = species.types.filter(t => !known.has(t));
    if (bad.length) problems.push(`${species.name} has unknown type(s) ${bad.join(', ')}`);
    if (species.types.length > 2) problems.push(`${species.name} has ${species.types.length} types`);
    if (new Set(species.types).size !== species.types.length) problems.push(`${species.name} has a duplicated type`);
    const sum = stats.reduce((total, key) => total + (species.baseStats[key] ?? 0), 0);
    if (sum !== species.bst) problems.push(`${species.name} bst ${species.bst} but stats sum to ${sum}`);
    if (stats.some(key => !Number.isInteger(species.baseStats[key]) || species.baseStats[key] < 1)) {
      problems.push(`${species.name} has a non-positive base stat`);
    }
  }
  assert.deepStrictEqual(problems.slice(0, 10), []);
});

test('restored move values survive a data rebuild', () => {
  // These roll back real main-series nerfs and apply this project's own move
  // redesigns. The override lives in MOVE_OVERRIDES in tools/generate-data.js;
  // `npm run build:data` against newer upstream data must not reinstate the
  // nerfs, so the values are pinned here.
  const basePower = {
    dig: 100, feint: 50, aurasphere: 90, blizzard: 120, dracometeor: 140, dragonpulse: 90,
    fireblast: 120, flamethrower: 95, heatwave: 100, hurricane: 120, hydropump: 120, icebeam: 95,
    leafstorm: 140, magmastorm: 120, meteormash: 100, muddywater: 95, overheat: 140, surf: 95,
    thunder: 120, thunderbolt: 95, suckerpunch: 80, tackle: 50, glaciallance: 130,
    grassyglide: 70, wickedblow: 80,
  };
  const problems = [];
  for (const [id, want] of Object.entries(basePower)) {
    if (Dex.move(id).basePower !== want) problems.push(`${id} BP ${Dex.move(id).basePower} != ${want}`);
  }
  if (Dex.move('upperhand').secondary) problems.push('Upper Hand should have no flinch effect');
  if (Dex.move('razorwind').critRatio !== 2) problems.push('Razor Wind should keep its high crit ratio');
  /*
   * Focus Punch trades its "fails if the user was hit" condition for accuracy.
   * Pinned as a literal 70 rather than compared against the override table,
   * which would agree with itself whatever the value became.
   */
  if (Dex.move('focuspunch').accuracy !== 70) {
    problems.push(`Focus Punch accuracy ${Dex.move('focuspunch').accuracy} != 70`);
  }
  // Both original drawbacks are gone — the condition and the -3 priority — and
  // accuracy is the only one left. Pinned as literals for the same reason.
  if (Dex.move('focuspunch').priority !== 0) {
    problems.push(`Focus Punch priority ${Dex.move('focuspunch').priority} != 0`);
  }
  if (Dex.move('focuspunch').basePower !== 150) {
    problems.push(`Focus Punch should keep its 150 BP, got ${Dex.move('focuspunch').basePower}`);
  }
  assert.deepStrictEqual(problems, []);
});

test('accuracy, PP and secondary rates are the current official values', () => {
  // Base power and the deliberate redesigns are overridden; everything else
  // tracks upstream. MOVE_OVERRIDES used to roll back accuracy, PP and
  // secondary-chance nerfs too — that was reversed by project decision, so an
  // override touching any of those three fields is now a regression.
  const overridden = new Set(['accuracy', 'pp', 'secondary', 'secondaries']);
  const source = fs.readFileSync(path.join(ROOT, 'tools/generate-data.js'), 'utf8');
  const table = source.slice(source.indexOf('const MOVE_OVERRIDES'), source.indexOf('const TRAPPING_MULTIHIT'));
  const offenders = [];
  /*
   * Named exemptions, each an explicit project redesign rather than a nerf
   * rollback — which is the thing this guard exists to catch. Anything not on
   * this list that touches accuracy, PP or secondary rates still fails.
   *   upperhand  nulls its secondary as part of a priority redesign
   *   focuspunch trades its "fails if hit" condition for 70% accuracy
   */
  const REDESIGNED = ['upperhand', 'focuspunch'];
  for (const field of overridden) {
    const pattern = new RegExp(`^\\s*(?!(?:${REDESIGNED.join('|')})\\b)[a-z0-9]+:\\s*\\{[^}]*\\b${field}\\s*:`, 'gm');
    for (const match of table.matchAll(pattern)) offenders.push(`${field}: ${match[0].trim()}`);
  }
  assert.deepStrictEqual(offenders, [],
    `MOVE_OVERRIDES must not touch accuracy/PP/secondary rates:\n${offenders.join('\n')}`);

  // Spot-check that previously-overridden moves now read upstream values.
  const official = {
    hypnosis: {accuracy: 60}, thunderwave: {accuracy: 90}, swagger: {accuracy: 85},
    darkvoid: {accuracy: 50}, blizzard: {accuracy: 70}, fireblast: {accuracy: 85},
    acid: {secondaryChance: 10}, psychic: {secondaryChance: 10},
  };
  const wrong = [];
  for (const [id, want] of Object.entries(official)) {
    const move = Dex.move(id);
    if (want.accuracy != null && move.accuracy !== want.accuracy) {
      wrong.push(`${id} accuracy ${move.accuracy} != official ${want.accuracy}`);
    }
    if (want.secondaryChance != null && move.secondary?.chance !== want.secondaryChance) {
      wrong.push(`${id} secondary chance ${move.secondary?.chance} != official ${want.secondaryChance}`);
    }
  }
  assert.deepStrictEqual(wrong, []);
});

test('battle PP is the fully PP-Upped maximum of the official base PP', () => {
  // A move in battle starts at its max PP (base * 8/5, i.e. PP Ups applied),
  // and the base is upstream's since MOVE_OVERRIDES no longer pins PP.
  const wrong = [];
  for (const id of ['recover', 'roost', 'swordsdance', 'outrage', 'tackle', 'thunderbolt', 'rest']) {
    const move = Dex.move(id);
    const set = Pokemon.normalizeSet({species: 'mew', moves: [id], level: 100});
    const built = Pokemon.createBattlePokemon(set);
    const slot = built.moves.find(m => m.id === id);
    const expected = Math.max(1, Math.floor((move.pp || 5) * 8 / 5));
    if (!slot) { wrong.push(`${id} missing from the built set`); continue; }
    if (slot.maxPP !== expected) wrong.push(`${id} maxPP ${slot.maxPP} != ${expected} (base ${move.pp})`);
    if (slot.pp !== slot.maxPP) wrong.push(`${id} should start at full PP`);
  }
  assert.deepStrictEqual(wrong, []);
});

test('multi-hit moves follow the project standard', () => {
  // Exactly two hits -> 50 BP each; two to five -> 25 BP each. Every other hit
  // pattern (three-hit moves, Population Bomb's ten) is deliberately untouched.
  const problems = [];
  const twoFive = [];
  for (const move of Object.values(Dex.allMoves)) {
    if (!move.multihit || !move.basePower) continue;
    if (Array.isArray(move.multihit)) {
      if (move.multihit[0] === 2 && move.multihit[1] === 5) {
        twoFive.push(move.id);
        if (move.basePower !== 25) problems.push(`${move.name} is 2-5 hits but ${move.basePower} BP`);
      }
    } else if (move.multihit === 2 && move.basePower !== 50) {
      problems.push(`${move.name} hits twice but is ${move.basePower} BP`);
    }
  }
  // The four trapping moves must be in that 2-5 group and still trap.
  for (const id of ['wrap', 'bind', 'firespin', 'clamp']) {
    const move = Dex.move(id);
    if (!twoFive.includes(id)) problems.push(`${move.name} should be a 2-5 hit move`);
    if (move.volatileStatus !== 'partiallytrapped') problems.push(`${move.name} lost its trapping effect`);
  }
  // Untouched patterns keep their own power.
  if (Dex.move('populationbomb').multihit !== 10) problems.push('Population Bomb hit count changed');
  if (Dex.move('triplekick').multihit !== 3) problems.push('Triple Kick hit count changed');
  assert.deepStrictEqual(problems, []);
});

test('priority values for the redesigned and phazing moves', () => {
  const expected = {
    suckerpunch: 1, thunderclap: 1, firstimpression: 2, upperhand: 3,
    followme: 2, ragepowder: 2, roar: -6, whirlwind: -6,
  };
  const problems = [];
  for (const [id, want] of Object.entries(expected)) {
    if (Dex.move(id).priority !== want) problems.push(`${id} priority ${Dex.move(id).priority} != ${want}`);
  }
  assert.deepStrictEqual(problems, []);
});

/* ------------------------------------------------------------------ *
 * Smogon tiers and forme-item legality
 * ------------------------------------------------------------------ */

test('the generator\'s forme-item table matches Mechanics.FORME_CHANGE_ITEMS', () => {
  /*
   * `tools/generate-data.js` keeps its own copy of this table, because the
   * generator must not load the runtime engine. A table declared twice is
   * exactly the drift this project keeps getting caught by, so the two are
   * compared entry for entry — the same guard `BattleConstants` gets.
   */
  const source = fs.readFileSync(path.join(ROOT, 'tools/generate-data.js'), 'utf8');
  const block = /const FORME_CHANGE_ITEMS = \{([\s\S]*?)\n\};/.exec(source);
  assert.ok(block, 'FORME_CHANGE_ITEMS not found in the generator');
  const generatorPairs = [...block[1].matchAll(/(\w+):\s*\{([^}]*)\}/g)].map(([, item, body]) => {
    const inner = /['"]?([\w-]+)['"]?:\s*'([^']+)'/.exec(body);
    return `${item}:${inner ? `${inner[1]}->${inner[2]}` : body.trim()}`;
  }).sort();
  const enginePairs = Object.entries(RedGPT.Mechanics.FORME_CHANGE_ITEMS).map(([item, mapping]) =>
    Object.entries(mapping).map(([from, to]) => `${item}:${from}->${to}`).join(',')).sort();
  assert.deepStrictEqual([...generatorPairs], [...enginePairs]);
});

test('every packaged tier is on the ladder, and NFE/LC carry none', () => {
  const ladder = new Set(RedGPT.Formats.TIER_ORDER);
  const offLadder = [];
  for (const species of Dex.allSpecies) {
    if (species.tier != null && !ladder.has(species.tier)) offLadder.push(`${species.name}: ${species.tier}`);
  }
  assert.deepStrictEqual([...offLadder], []);

  /*
   * No species may carry a raw upstream CATEGORY as a tier. `NFE` and `LC` are
   * not rungs — they are resolved to the ZU floor instead.
   */
  const categories = Dex.allSpecies.filter(s => s.tier === 'NFE' || s.tier === 'LC');
  assert.deepStrictEqual([...categories.map(s => `${s.name}: ${s.tier}`)], []);

  /*
   * **THE ZERO-UNTIERED INVARIANT** (2026-08-17). This replaces the assertion
   * that most unevolved species carry NO tier — the "NFE and LC are discarded"
   * policy is superseded, because it left 473 selectable species unable to join
   * a legal team in any tier format.
   *
   * Stated as an invariant rather than as a list of the 473 names, deliberately:
   * a newly packaged species must be caught too. A rebuild that adds an upstream
   * Pokémon with no ladder tier fails here rather than shipping unusable.
   */
  const ladderTiers = new Set(RedGPT.Formats.TIER_ORDER);
  const untiered = Dex.allSpecies.filter(s => !(s.tier && ladderTiers.has(s.tier)));
  assert.deepStrictEqual([...untiered.map(s => `${s.name}: ${s.tier}`)], [],
    'EVERY selectable species must carry a ladder tier — ZU is the floor');

  // A denominator, so the invariant cannot pass by there being nothing to check.
  assert.ok(Dex.allSpecies.length > 1000,
    `sanity: the selectable roster should be large, saw ${Dex.allSpecies.length}`);
  const unevolved = Dex.allSpecies.filter(s => Array.isArray(s.evos) && s.evos.length);
  assert.ok(unevolved.length > 400,
    `sanity: there should be a large unevolved population, found ${unevolved.length}`);
  // And every one of them is on the ladder now, which is the whole point.
  assert.strictEqual(unevolved.filter(s => !(s.tier && ladderTiers.has(s.tier))).length, 0,
    'no unevolved species may be left off the ladder');

  /*
   * The floor must be a FLOOR, not a blanket. Smogon's own ladder rankings for
   * unevolved Pokémon stay authoritative, so these keep their imported tiers
   * rather than being flattened to ZU.
   */
  for (const [name, tier] of [['Chansey', 'UU'], ['Bisharp', 'UU'], ['Duraludon', 'RU'], ['Pikachu', 'ZU']]) {
    if (!Dex.hasSpecies(name)) continue;
    assert.strictEqual(Dex.species(name).tier, tier,
      `${name} is ranked upstream and must keep ${tier} rather than being floored`);
  }
  // And the floored ones must say so, so a floored tier is never mistaken for an import.
  assert.strictEqual(Dex.species('Magikarp').tier, 'ZU', 'Magikarp lands on the floor');
  assert.strictEqual(Dex.species('Magikarp').tierSource.from, 'redgpt-zu-floor',
    'and its provenance must record the floor rather than claiming an import');
});

test('the untiered audit placed exactly 473 species, 43 of them above ZU', () => {
  /*
   * The 2026-08-17 untiered pass. The 430 ordinary entries reach ZU through the
   * floor in the generator; the 43 exceptions are explicit `TIER_OVERRIDES`
   * rows. Both halves are asserted, because a floor that swallowed the
   * exceptions would still satisfy the zero-untiered invariant above.
   */
  const {Dex, Formats, Pokemon, Validation} = RedGPT;
  const tierOf = name => Dex.species(name).tier;
  const mv = sp => { const ls = Dex.learnset(Dex.toID(sp)) || []; return (Array.isArray(ls) ? ls : Object.keys(ls)).slice(0, 1); };
  const legal = (sp, fmt) => Validation.validateTeam(
    [Pokemon.normalizeSet({species: sp, level: 100, moves: mv(sp)})], Formats.get(fmt)).valid;

  assert.strictEqual(tierOf('Porygon2'), 'RU', 'the one RU placement');
  for (const n of ['Gligar', 'Magneton', 'Rhydon', 'Doublade']) {
    assert.strictEqual(tierOf(n), 'NU', `${n} is one of the four NU placements`);
  }
  const PU = ['Floette-Eternal', 'Type: Null', 'Scyther', 'Ursaring', 'Dipplin', 'Tangela', 'Dusclops',
    'Corsola-Galar', 'Sliggoo-Hisui', 'Piloswine', 'Lairon', 'Crocalor', 'Gurdurr', 'Machoke', 'Meditite',
    'Primeape', 'Sneasel-Hisui', 'Fraxure', 'Zweilous', 'Servine', 'Combusken', 'Raboot', 'Thwackey',
    'Qwilfish-Hisui', 'Duosion', 'Kadabra', 'Roselia', 'Gothorita', 'Lampent', 'Slowpoke', 'Slowpoke-Galar',
    'Naclstack', 'Togetic', 'Porygon', 'Vullaby', 'Clefairy', 'Golbat', 'Mienfoo'];
  assert.strictEqual(PU.length, 38, 'there are exactly 38 PU placements');
  for (const n of PU) assert.strictEqual(tierOf(n), 'PU', `${n} should be PU`);

  // Legality, at the boundary each placement creates.
  assert.ok(legal('Porygon2', 'tierru') && !legal('Porygon2', 'tiernu'), 'Porygon2: RU+ only');
  for (const n of ['Gligar', 'Magneton', 'Rhydon', 'Doublade']) {
    assert.ok(legal(n, 'tiernu') && !legal(n, 'tierpu'), `${n}: NU+ only`);
  }
  for (const n of ['Floette-Eternal', 'Type: Null', 'Scyther', 'Gothorita', 'Slowpoke', 'Clefairy', 'Mienfoo']) {
    assert.ok(legal(n, 'tierpu') && !legal(n, 'tierzu'), `${n}: PU+ only`);
  }
  // The ZU floor, including the entries deliberately left there.
  for (const n of ['Abra', 'Magikarp', 'Cosmoem', 'Electabuzz', 'Magmar', 'Haunter',
    'Gothita', 'Litwick', 'Wynaut', 'Trapinch', 'Silvally']) {
    assert.strictEqual(tierOf(n), 'ZU', `${n} was reviewed and left on the ZU floor`);
    assert.ok(legal(n, 'tierzu'), `${n} must be legal in ZU`);
  }

  assert.strictEqual(Formats.tierRoster('ZU').length, 677, 'ZU is 247 + 430');
  assert.strictEqual(Formats.tierRoster('PU').length, 110, 'PU is 72 + 38');
  assert.strictEqual(Formats.tierRoster('NU').length, 67, 'NU is 63 + 4');
  assert.strictEqual(Formats.tierRoster('RU').length, 131, 'RU is 130 + Porygon2');
});

test('the three reviewed Megas are pinned against estimator ripple', () => {
  /*
   * Reviewed verdicts, so they must survive a model shift. Before this pass all
   * three sat on `estimated`, and the pass proved why that is not safe:
   * **Delphox-Mega drifted UU → OU** as a side effect of Floette-Mega becoming a
   * resolved datapoint, and had to be pinned back.
   */
  const {Dex, Formats} = RedGPT;
  const enforced = name => Formats.TIER_ORDER.find(t => Formats.tierRoster(t).some(e => e.name === name));
  const formeSourceOf = (base, forme) => (Dex.species(base).formeItems || []).find(f => f.forme === forme)?.tierSource;

  for (const [base, forme, tier] of [
    ['Floette-Eternal', 'Floette-Mega', 'OU'],
    ['Meowstic', 'Meowstic-M-Mega', 'RU'],
    ['Tatsugiri', 'Tatsugiri-Curly-Mega', 'RU'],
    ['Delphox', 'Delphox-Mega', 'UU'],
  ]) {
    assert.strictEqual(enforced(forme), tier, `${forme} must be ${tier}`);
    assert.strictEqual(formeSourceOf(base, forme), 'redgpt-override',
      `${forme} must be an explicit override, not an estimate, or the model can move it`);
  }

  // Floette: only the Eternal forme has the route, and it is PU while its Mega is OU.
  assert.strictEqual(Dex.species('Floette-Eternal').tier, 'PU');
  assert.deepStrictEqual([...(Dex.species('Floette').formeItems || [])], [],
    'plain Floette still has no Mega route');
});

test('a tier format admits its tier and everything below, and nothing above', () => {
  const {Formats} = RedGPT;
  /*
   * Iterates the tier *formats that exist*, not every rung of `TIER_ORDER`.
   * The two stopped matching on 2026-08-14 when the Anything Goes (Tiered)
   * format was removed: **AG is still a real species tier** — Xerneas,
   * Calyrex-Shadow, Koraidon and Miraidon carry it, and `tierRank` needs it to
   * rank anything — so it stays in `TIER_ORDER` while having no format of its
   * own.
   */
  const formats = Formats.list().filter(f => f.rules.maxTier);
  assert.ok(formats.length >= 7, `expected the tier ladder to still be here, saw ${formats.length}`);
  for (const format of formats) {
    const tier = format.rules.maxTier;
    assert.ok(Formats.TIER_ORDER.includes(tier), `${format.id} declares an unknown tier ${tier}`);
    const pool = Formats.speciesPool(format);
    const wrong = pool.filter(s => !s.tier || Formats.tierRank(s.tier) < Formats.tierRank(tier));
    assert.deepStrictEqual([...wrong.map(s => `${s.name} (${s.tier})`)], [],
      `${tier} format admitted something above its own tier`);
  }

  /*
   * **The AG rung is deliberately empty** (2026-08-15). `TIER_OVERRIDES` moved
   * all six of its members down to Ubers: Smogon ranks for a metagame with
   * Terastallization and this project's regular Ubers does not have it, so the
   * ceiling they were breaking is not the ceiling they now play under.
   *
   * `AG` stays in `TIER_ORDER` because `tierRank` needs a top rung to compare
   * against — an empty tier is the point here, not an oversight, so this
   * asserts it rather than leaving a silent zero.
   */
  const agSpecies = RedGPT.Dex.allSpecies.filter(s => s.tier === 'AG');
  assert.deepStrictEqual([...agSpecies.map(s => s.name)], [],
    'no species should be tiered AG any more');
  const agFormes = RedGPT.Dex.allSpecies.flatMap(s => (s.formeItems || []).filter(f => f.tier === 'AG').map(f => f.forme));
  assert.deepStrictEqual([...agFormes], [], 'and no forme either');
  assert.ok(Formats.TIER_ORDER.includes('AG'), 'AG stays in the ranking order');

  // The six landed in Ubers, and are actually playable there — `powerClass`
  // is a snapshot of the *old* tiering, so two of them would otherwise still be
  // refused by `allowUnrestrictedOnly`.
  const ubers = Formats.speciesPool('tierubers');
  for (const id of ['xerneas', 'calyrexshadow', 'koraidon', 'miraidon']) {
    const species = RedGPT.Dex.species(id);
    assert.strictEqual(species.tier, 'Ubers', `${species.name} should be Ubers`);
    assert.ok(ubers.some(s => s.id === id), `${species.name} must be legal in Ubers, not just ranked there`);
  }
  for (const [base, forme] of [['gengar', 'Gengar-Mega'], ['rayquaza', 'Rayquaza-Mega']]) {
    const entry = (RedGPT.Dex.species(base).formeItems || []).find(f => f.forme === forme);
    assert.ok(entry && entry.tier === 'Ubers', `${forme} should be Ubers`);
  }
});

test('the 2026-08-15 Ubers to OU revision landed, and took nothing with it', () => {
  /*
   * A tiering revision on two arguments: Gen 9 entries whose Ubers case leaned
   * on Terastallization (which regular OU and Ubers do not have), and legacy
   * "automatic Ubers" reassessed against RedGPT's own OU, which is far stronger
   * than the formats that originally banned them.
   *
   * The dangerous half is what must NOT move with them, so both directions are
   * asserted here.
   */
  const {Dex, Formats} = RedGPT;
  /*
   * `magearna` and `magearnaoriginal` were in this list and were **removed on
   * 2026-08-16**, when the verified-evidence pass sent both back to Ubers. They
   * are asserted in the promotion test below instead, so the reversal is
   * pinned in one direction here and the other direction there.
   */
  const dropped = ['ogerponhearthflame', 'roaringmoon', 'baxcalibur', 'annihilape',
    'dragapult', 'darkrai', 'deoxysspeed', 'pheromosa',
    'dracovish', 'naganadel', 'spectrier', 'kyuremblack', 'solgaleo', 'necrozmadawnwings',
    'lunala', 'marshadow', 'deoxys', 'lugia', 'dialga'];
  for (const id of dropped) {
    assert.strictEqual(Dex.species(id).tier, 'OU', `${Dex.species(id).name} should have dropped to OU`);
  }

  const formeTier = (base, forme) => (Dex.species(base).formeItems || []).find(f => f.forme === forme)?.tier;
  for (const [base, forme] of [['metagross', 'Metagross-Mega'], ['blastoise', 'Blastoise-Mega'],
    ['alakazam', 'Alakazam-Mega'], ['lucario', 'Lucario-Mega']]) {
    assert.strictEqual(formeTier(base, forme), 'OU', `${forme} should have dropped to OU`);
  }

  /*
   * The pins. `formeItemsFor` estimates an unranked forme's tier **from its
   * base species' tier**, so dropping Baxcalibur or Darkrai would otherwise
   * have dragged their unranked Megas down with no line saying so. This is the
   * assertion that catches that if the estimator changes. The two Magearna
   * pins are no longer load-bearing (both bases are Ubers again since
   * 2026-08-16) but are asserted anyway, because the pin is still there.
   */
  for (const [base, forme] of [['baxcalibur', 'Baxcalibur-Mega'], ['darkrai', 'Darkrai-Mega'],
    ['magearna', 'Magearna-Mega']]) {
    assert.strictEqual(formeTier(base, forme), 'Ubers',
      `${forme} must stay Ubers whatever its base is`);
  }
  /*
   * Magearna-Original-Mega was pinned here too, and went with the skin change
   * on 2026-08-16: Magearna-Original is no longer a species, so it carries no
   * `formeItems` and there is no such forme reference left to tier. The pin was
   * describing a Mega this project never packaged in the first place.
   */
  assert.strictEqual(Dex.species('magearnaoriginal').formeItems, null,
    'a cosmetic skin carries no forme items of its own');
  assert.strictEqual(Dex.species('dialgaorigin').tier, 'Ubers', 'Dialga-Origin must not follow Dialga down');
  assert.strictEqual(Dex.species('deoxysattack').tier, 'Ubers', 'Deoxys-Attack must not follow Deoxys down');

  /*
   * The explicit hold list. **Palafin was here and moved to ZU on 2026-08-16**:
   * its Ubers ranking was measuring Palafin-Hero, a forme you only reach by
   * holding the Hero Charm. The ban did not go away, it moved to the item —
   * Palafin-Hero is still Ubers, so the Charm is refused below it, which the
   * forme-route test below asserts.
   */
  for (const id of ['espathra', 'gougingfire', 'walkingwake', 'chiyu', 'chienpao',
    'fluttermane', 'ironbundle', 'koraidon', 'miraidon', 'ursalunabloodmoon', 'genesect',
    'urshifu', 'sneasler', 'shayminsky', 'landorus', 'yveltal', 'zekrom', 'palkia', 'reshiram',
    'arceus', 'kyogre', 'groudon', 'rayquaza', 'mewtwo', 'zacian', 'eternatus', 'xerneas',
    'terapagosstellar', 'ogerponhearthflametera']) {
    assert.strictEqual(Dex.species(id).tier, 'Ubers', `${Dex.species(id).name} must stay Ubers`);
  }

  /*
   * The two Terastal-gated formes are transformation-only (2026-08-15), so they
   * cannot be picked in a format that has Tera switched off. They keep their
   * Ubers tier — the tier is about what they would be *if* reached, and the
   * selectability gate is what makes the format rules honest.
   */
  for (const id of ['terapagosstellar', 'ogerponhearthflametera']) {
    assert.ok(Dex.species(id).transformOnly, `${Dex.species(id).name} must be transformation-only`);
    assert.ok(!Dex.allSpecies.some(s => s.id === id), `${id} must not be selectable`);
  }
  // Their reachable counterparts are untouched.
  for (const id of ['terapagos', 'terapagosterastal', 'ogerponhearthflame']) {
    assert.ok(!Dex.species(id).transformOnly, `${Dex.species(id).name} must stay selectable data`);
  }

  /*
   * The two conditional cases stay Ubers because **the engine has no tier gate
   * on a forme change**: a lower-tier base freely transforms into a
   * higher-tier forme mid-battle. Proved by live battle — an OU Darmanitan-Galar
   * with Zen Mode becomes Ubers-ranked Darmanitan-Galar-Zen, and an OU Zygarde
   * becomes Ubers-ranked Zygarde-Complete. Dropping either would have handed OU
   * a banned forme.
   */
  for (const id of ['darmanitangalar', 'darmanitangalarzen', 'zygarde', 'zygardecomplete']) {
    assert.strictEqual(Dex.species(id).tier, 'Ubers',
      `${Dex.species(id).name} stays Ubers until forme changes can be tier-gated`);
  }

  // Tera is still off in the regular formats and on only in the three variants.
  assert.strictEqual(Formats.get('tierou').rules.tera, false);
  assert.strictEqual(Formats.get('tierubers').rules.tera, false);
  assert.deepStrictEqual([...Formats.list().filter(f => f.rules.tera).map(f => f.id)].sort(),
    ['anythinggoes', 'tieroutera', 'tieruberstera']);

  // A dropped base does not legalise its Ubers Mega Stone.
  const banned = Formats.illegalFormeItems('darkrai', 'tierou');
  assert.ok(banned.some(f => f.item === 'darkranite'),
    'Darkranite must still be banned in OU even though Darkrai dropped');
  assert.strictEqual(Formats.illegalFormeItems('metagross', 'tierou').length, 0,
    'Metagrossite is legal in OU, because Mega Metagross dropped too');
});

test('the 2026-08-16 OU to Ubers promotions landed, and took nothing with them', () => {
  /*
   * The reverse pass, decided from the verified-evidence packet (packaged
   * learnsets plus RedGPT-native damage). Exactly three entries moved up, and
   * the *hold* list is the load-bearing half — the point of the pass was as
   * much about what was cleared as about what was promoted.
   *
   * Zeraora-Mega is singled out because it was the leading suspect and was
   * exonerated: its learnset has no Ice, Water or Ground move at all, and its
   * Mega Stone locks it out of the Ring Target that would fix the Ground
   * immunity. A future estimator change must not quietly promote it.
   */
  const {Dex, Formats, Pokemon, Validation} = RedGPT;
  const formeTier = (base, forme) => (Dex.species(base).formeItems || []).find(f => f.forme === forme)?.tier;

  assert.strictEqual(Dex.species('magearna').tier, 'Ubers', 'Magearna was promoted back to Ubers');
  assert.strictEqual(formeTier('lucario', 'Lucario-Mega-Z'), 'Ubers', 'Lucario-Mega-Z was promoted');
  /*
   * Magearna-Original was promoted with it and then **superseded the same day**:
   * it became a cosmetic skin of Magearna rather than a species of its own, so
   * it has no tier to assert. What matters now is that it inherits Magearna's,
   * which it does by being the same Pokémon.
   */
  assert.strictEqual(Dex.species('magearnaoriginal').cosmeticOf, 'magearna',
    'Magearna-Original is a skin of Magearna, not a separately tiered species');
  assert.ok(!Dex.allSpecies.some(s => s.id === 'magearnaoriginal'),
    'and is therefore not selectable in its own right');

  /*
   * Promoting a forme must ban the *item*, never the Pokémon. This is the whole
   * reason a forme carries its own tier, and it is asserted through the
   * validator rather than the data so the ban is proved to actually apply.
   */
  const lucario = item => Pokemon.normalizeSet({species: 'lucario', item, level: 100,
    moves: ['aurasphere', 'flashcannon', 'nastyplot', 'vacuumwave']});
  const errs = (set, format) => Validation.validateTeam([set], Formats.get(format)).errors.map(e => e.message);

  assert.deepStrictEqual([...errs(lucario(''), 'tierou')], [], 'base Lucario stays legal in OU');
  assert.deepStrictEqual([...errs(lucario('lucarionite'), 'tierou')], [],
    'and so does ordinary Mega Lucario, which was NOT promoted');
  const banned = errs(lucario('lucarionitez'), 'tierou');
  assert.strictEqual(banned.length, 1, `Lucarionite Z should be refused in OU, saw ${JSON.stringify(banned)}`);
  assert.ok(/Lucarionite Z is banned/.test(banned[0]), banned[0]);
  assert.deepStrictEqual([...errs(lucario('lucarionitez'), 'tierubers')], [],
    'CONTROL: and it must be legal in Ubers, where the forme now lives');
  assert.strictEqual(Dex.species('lucario').tier, 'RU', 'base Lucario keeps its own tier');
  assert.strictEqual(formeTier('lucario', 'Lucario-Mega'), 'OU', 'ordinary Mega Lucario keeps OU');

  /*
   * The hold list. Every one of these was reviewed against real damage numbers
   * in the same pass and deliberately left in OU.
   */
  for (const id of ['kingambit', 'ragingbolt', 'zamazenta', 'kyuremblack', 'deoxys', 'annihilape']) {
    assert.strictEqual(Dex.species(id).tier, 'OU', `${Dex.species(id).name} was reviewed and held in OU`);
  }
  for (const [base, forme] of [['zeraora', 'Zeraora-Mega'], ['mawile', 'Mawile-Mega'],
    ['medicham', 'Medicham-Mega'], ['metagross', 'Metagross-Mega'], ['greninja', 'Greninja-Mega']]) {
    assert.strictEqual(formeTier(base, forme), 'OU', `${forme} was reviewed and held in OU`);
  }

  /*
   * The roster arithmetic, which moved three times on 2026-08-16 for three
   * unrelated reasons — worth spelling out so a future failure here is read
   * correctly rather than "fixed" by editing the number.
   *
   *   OU     109 → 106  three promotions to Ubers
   *              → 107  Ash-Greninja counted for the first time, via Battle Bond
   *   Ubers   62 → 65   the same three promotions
   *              → 64   Magearna-Original left, becoming a cosmetic skin
   *              → 63   Palafin dropped to ZU; the ban moved to the Hero Charm
   *   OU     107 → 92   the OU → UU pass, 15 entries down (test below)
   *   UU      71 → 86   the same 15
   */
  // OU gained Floette-Mega on 2026-08-17, when the sprite-key fix packaged the
  // three Megas whose artwork is named after their holder.
  assert.strictEqual(Formats.tierRoster('OU').length, 93);
  assert.strictEqual(Formats.tierRoster('Ubers').length, 63);
  // UU gained Chandelure from the trapping pass on 2026-08-16.
  assert.strictEqual(Formats.tierRoster('UU').length, 91);
});

test('the OU → UU pass moved exactly fifteen entries and no forme followed a base down', () => {
  /*
   * The 2026-08-16 OU → UU pass. Fifteen entries dropped, decided from a
   * verified-evidence packet the same way the Ubers pass above was.
   *
   * Three things are pinned, and the second and third are the ones that would
   * break silently:
   *
   *   1. the fifteen are UU and the entries deliberately *held* are still OU;
   *   2. **base and forme moved independently.** Two of the fifteen are Megas
   *      whose base is untouched, and three of the dropped bases have a Mega
   *      that had to stay where it was;
   *   3. dropping a base must not legalise its higher-tier forme — the
   *      Absol/Absolite rule, asserted through the validator rather than the
   *      data so the ban is proved to actually apply.
   */
  const {Dex, Formats, Pokemon, Validation} = RedGPT;
  const formeTier = (base, forme) =>
    (Dex.species(base).formeItems || []).find(f => f.forme === forme)?.tier;
  const errs = (set, format) => Validation.validateTeam([set], Formats.get(format)).errors.map(e => e.message);
  /*
   * The move has to come from the species' own learnset. A hardcoded dummy
   * makes the validator refuse the set for an unlearnable move, which reads
   * exactly like a tier refusal and is not one.
   */
  const build = (species, item) => {
    const learnset = Dex.learnset(Dex.toID(species)) || [];
    const moves = (Array.isArray(learnset) ? learnset : Object.keys(learnset)).slice(0, 1);
    assert.ok(moves.length, `${species} must have a learnset to build a test set from`);
    return Pokemon.normalizeSet({species, item, level: 100, moves});
  };

  // 1. The thirteen species entries that dropped.
  const dropped = ['slowbro', 'irontreads', 'weavile', 'gyarados', 'thundurustherian', 'okidogi',
    'corviknight', 'hatterene', 'hawlucha', 'zapdosgalar', 'moltres', 'ironcrown', 'pecharunt'];
  for (const id of dropped) {
    assert.strictEqual(Dex.species(id).tier, 'UU', `${Dex.species(id).name} dropped to UU`);
  }

  /*
   * 2. The two forme entries that dropped, and their bases, which did not move.
   * Both Megas lose to their own base forme: Scolipede keeps Speed Boost and
   * item freedom, and Mega Skarmory's Stalwart is inert in singles (§9), so it
   * is an effectively blank ability.
   */
  for (const [base, forme] of [['scolipede', 'Scolipede-Mega'], ['skarmory', 'Skarmory-Mega']]) {
    assert.strictEqual(formeTier(base, forme), 'UU', `${forme} dropped to UU`);
    assert.strictEqual(Dex.species(base).tier, 'UU', `CONTROL: base ${base} was already UU and must not move`);
  }

  /*
   * 3. The formes that must NOT have followed their base down. **Hawlucha-Mega
   * is the load-bearing one**: it is unranked, so `formeItemsFor` estimates it
   * from base Hawlucha's tier and dropping Hawlucha would have quietly taken
   * the Hawluchanite to UU. It is pinned in `TIER_OVERRIDES` for that reason.
   * Slowbro-Mega and Gyarados-Mega are ranked by Nat Dex and need no pin.
   */
  assert.strictEqual(formeTier('hawlucha', 'Hawlucha-Mega'), 'OU',
    'Mega Hawlucha stays OU although base Hawlucha dropped');
  assert.strictEqual(formeTier('gyarados', 'Gyarados-Mega'), 'OU',
    'Mega Gyarados stays OU although base Gyarados dropped');
  assert.strictEqual(formeTier('slowbro', 'Slowbro-Mega'), 'UU',
    'Mega Slowbro was already UU and is unaffected');

  // ...and the ban is real: the stone is refused in the tier the base now plays in.
  for (const [base, item, label] of [['hawlucha', 'hawluchanite', 'Hawluchanite'],
    ['gyarados', 'gyaradosite', 'Gyaradosite']]) {
    const banned = errs(build(Dex.species(base).name, item), 'tieruu');
    assert.strictEqual(banned.length, 1,
      `${label} should be refused in UU, saw ${JSON.stringify(banned)}`);
    assert.ok(new RegExp(`${label} is banned`).test(banned[0]), banned[0]);
    assert.deepStrictEqual([...errs(build(Dex.species(base).name, ''), 'tieruu')], [],
      `CONTROL: bare ${Dex.species(base).name} must itself be legal in UU`);
    assert.deepStrictEqual([...errs(build(Dex.species(base).name, item), 'tierou')], [],
      `CONTROL: and the stone must still be legal in OU, where the forme lives`);
  }

  // The two dropped Megas became legal in UU, which is the point of moving them.
  for (const [base, item] of [['scolipede', 'scolipite'], ['skarmory', 'skarmorite']]) {
    assert.deepStrictEqual([...errs(build(Dex.species(base).name, item), 'tieruu')], [],
      `${item} should now be legal in UU`);
  }

  /*
   * The hold list. Every one was reviewed in the same pass and deliberately
   * left in OU. The three masked Ogerpons are here because the provisional
   * profile understated Ivy Cudgel — it is packaged Grass and resolves to
   * Fire/Water/Rock at use time with full STAB and the Mask's 1.2x — and
   * Dracovish because the evidence packet's calculator rows for Fishious Rend
   * did not distinguish its doubled state from its undoubled one.
   */
  for (const id of ['ogerponhearthflame', 'ogerponwellspring', 'ogerponcornerstone', 'dracovish',
    'ceruledge', 'tapulele', 'urshifurapidstrike', 'xurkitree', 'slowkinggalar', 'samurotthisui',
    'alomomola', 'terapagos', 'terapagosterastal']) {
    assert.strictEqual(Dex.species(id).tier, 'OU', `${Dex.species(id).name} was reviewed and held in OU`);
  }

  /*
   * No current UU entry was promoted — the UU → OU audit is a separate pass.
   * Asserted against the roster rather than a list so a promotion anywhere in
   * UU fails this, and with a denominator so it cannot pass vacuously.
   */
  const uu = Formats.tierRoster('UU');
  assert.strictEqual(uu.length, 91,
    'UU is 71 + the 15 dropped here + the 4 promoted from RU + Chandelure from the trapping pass');
  const droppedNames = new Set([...dropped.map(id => Dex.species(id).name), 'Scolipede-Mega', 'Skarmory-Mega']);
  assert.strictEqual(droppedNames.size, 15, 'fifteen entries moved');
  for (const name of droppedNames) {
    assert.ok(uu.some(e => e.name === name), `${name} must appear in the UU roster`);
  }
  const ouNames = new Set(Formats.tierRoster('OU').map(e => e.name));
  for (const name of droppedNames) {
    assert.ok(!ouNames.has(name), `${name} must no longer appear in OU`);
  }
});

test('a forme-producing ability is banned, not the Pokemon that has it', () => {
  /*
   * The ability half of the Absol/Absolite rule (2026-08-16). A species whose
   * ability turns it into a higher-tiered forme keeps its own tier and loses
   * the right to run that ability — it does not get uplifted, and it is not
   * removed.
   *
   * **Only where the species has another ability to fall back on.** Banning
   * Stance Change does not restrict Aegislash, it deletes it: a Pokémon with no
   * legal ability cannot be built. That asymmetry is the whole design and both
   * halves are asserted.
   */
  const {Dex, Formats, Pokemon, Validation} = RedGPT;

  // Separable: the base has an alternative, so the route can be refused.
  const separable = ['greninja', 'zygarde', 'zygarde10', 'darmanitan', 'darmanitangalar'];
  for (const id of separable) {
    assert.ok(Formats.formeAbilities(id).length > 0, `${Dex.species(id).name} should report a forme ability`);
    assert.ok(Dex.abilityList(Dex.species(id)).length > 1,
      `${Dex.species(id).name} must have something to fall back to`);
  }

  // Inseparable: a single-ability transformer is tiered as one unit.
  for (const id of ['aegislash', 'wishiwashi', 'castform', 'cherrim', 'morpeko', 'terapagos', 'mimikyu', 'eiscue']) {
    assert.deepStrictEqual([...Formats.formeAbilities(id)], [],
      `${Dex.species(id).name} has one ability; banning it would delete the Pokémon`);
  }

  /*
   * The live case. Zygarde-10% is RU, Power Construct makes Zygarde-Complete,
   * which is Ubers — so the ability is refused everywhere below Ubers while the
   * Pokémon stays legal on Aura Break.
   */
  const zygarde = ability => Pokemon.normalizeSet({species: 'zygarde10', ability, level: 100,
    moves: ['thousandarrows', 'dragondance', 'substitute', 'coil']});
  const errs = (set, format) => Validation.validateTeam([set], Formats.get(format)).errors.map(e => e.message);

  for (const format of ['tierou', 'tieruu', 'tierru']) {
    const banned = errs(zygarde('Power Construct'), format);
    assert.strictEqual(banned.length, 1, `Power Construct should be refused in ${format}: ${JSON.stringify(banned)}`);
    assert.ok(/Power Construct is banned/.test(banned[0]), banned[0]);
    assert.deepStrictEqual([...errs(zygarde('Aura Break'), format)], [],
      `CONTROL: Zygarde-10% itself must stay legal in ${format} on its other ability`);
  }
  assert.deepStrictEqual([...errs(zygarde('Power Construct'), 'tierubers')], [],
    'CONTROL: and the ability is fine in Ubers, where the forme lives');

  /*
   * Ash-Greninja is the case this was reported for: it belonged to no tier at
   * all, because it is transform-only (so not a species entry) and no item
   * produces it (so not a forme entry).
   */
  const ou = Formats.tierRoster('OU');
  const ash = ou.find(entry => entry.id === 'greninjaash');
  assert.ok(ash, 'Ash-Greninja must appear in a roster');
  assert.strictEqual(ash.kind, 'forme');
  assert.strictEqual(ash.ability, 'battlebond', 'listed by the ability that reaches it');
  assert.strictEqual(ash.base, 'Greninja');

  // autoFix swaps the ability rather than removing the Pokémon.
  const fixed = Validation.autoFix({format: 'tierru', sets: [zygarde('Power Construct')]});
  assert.strictEqual(fixed.sets.length, 1, 'the Pokémon is kept');
  assert.strictEqual(Dex.toID(fixed.sets[0].ability), 'aurabreak', 'and its ability is swapped for a legal one');
});

test('Palafin is tiered as itself, with the ban on the Hero Charm', () => {
  /*
   * The item counterpart, and the odd one out: Zero to Hero is Palafin's only
   * ability, so the ability rule above cannot apply — but this project moved
   * the transformation onto the **Hero Charm** (§5), which makes it an item ban
   * after all. Base Palafin is 457 BST with a hookless ability; Palafin-Hero is
   * 650 with 160 Attack, and that is what Nat Dex's Uber ranking was measuring.
   */
  const {Dex, Formats, Pokemon, Validation} = RedGPT;
  assert.strictEqual(Dex.species('palafin').tier, 'ZU', 'Palafin is tiered as the Pokémon it is');
  assert.strictEqual(Dex.species('palafinhero').tier, 'Ubers', 'Palafin-Hero keeps the Ubers ranking');

  const palafin = item => Pokemon.normalizeSet({species: 'palafin', item, level: 100,
    moves: ['jetpunch', 'wavecrash', 'bulkup', 'drainpunch']});
  const errs = (set, format) => Validation.validateTeam([set], Formats.get(format)).errors.map(e => e.message);

  // The Pokémon plays all the way down; the Charm does not.
  for (const format of ['tierubers', 'tierou', 'tieruu', 'tierru', 'tiernu', 'tierpu', 'tierzu']) {
    assert.deepStrictEqual([...errs(palafin(''), format)], [],
      `bare Palafin should be legal in ${format}`);
  }
  assert.deepStrictEqual([...errs(palafin('herocharm'), 'tierubers')], [],
    'the Hero Charm is legal in Ubers, where Palafin-Hero lives');
  for (const format of ['tierou', 'tieruu', 'tierru', 'tiernu', 'tierpu', 'tierzu']) {
    const banned = errs(palafin('herocharm'), format);
    assert.strictEqual(banned.length, 1, `the Hero Charm should be refused in ${format}: ${JSON.stringify(banned)}`);
    assert.ok(/Hero Charm is banned/.test(banned[0]), banned[0]);
  }
});

test('cosmetic skins are derived, not listed, and change nothing mechanical', () => {
  /*
   * A skin is a different *picture* of a species: mechanically identical to its
   * base AND unreachable by any in-battle transformation. Both halves matter,
   * and the second is what does the work — Cherrim-Sunshine, Mimikyu-Busted and
   * Morpeko-Hangry all pass the first test and are emphatically not skins.
   */
  const {Dex, Mechanics, Pokemon} = RedGPT;

  const skins = Dex.packagedSpecies.filter(s => s.cosmeticOf);
  assert.deepStrictEqual([...skins.map(s => s.name).sort()], ['Keldeo-Resolute', 'Magearna-Original'],
    'exactly these two qualify under the derivation');

  for (const skin of skins) {
    const base = Dex.species(skin.cosmeticOf);
    assert.ok(!Dex.allSpecies.some(s => s.id === skin.id), `${skin.name} must not be selectable`);
    assert.deepStrictEqual([...skin.types], [...base.types], `${skin.name} typing`);
    assert.deepStrictEqual(Object.assign({}, skin.baseStats), Object.assign({}, base.baseStats), `${skin.name} stats`);
    assert.strictEqual(skin.formeItems, null, `${skin.name} carries no forme items of its own`);
    assert.ok(skin.front && skin.back, `${skin.name} keeps its own artwork, which is the whole point`);
  }

  /*
   * The control on the other side, and the reason the rule is not just "same
   * stats". Each of these is mechanically identical to its base and must NOT be
   * a skin, because an ability produces it mid-battle.
   */
  for (const id of ['cherrimsunshine', 'mimikyubusted', 'morpekohangry']) {
    assert.ok(!Dex.species(id).cosmeticOf,
      `${Dex.species(id).name} is a battle forme, not a skin`);
  }

  /*
   * The invariant the generator now leans on, asserted here because it is
   * upstream data rather than something this project sets.
   *
   * `findCosmeticSkins` excludes a forme on `transformOnly` / `battleOnly` /
   * `requiredItem` alone. It used to *also* walk every transformation target as
   * belt-and-braces, and a control proved that second pass excluded **nothing**
   * the three flags had not — 0 cases — so it was deleted as an unreachable
   * guard. This is what stands in for it: if upstream ever ships a forme that a
   * transformation produces without one of those flags, it would silently
   * become a "skin", and this fails instead.
   */
  const transformTargets = new Set(Object.values(Mechanics.ABILITY_FORMES).flat().map(e => Dex.toID(e.to)));
  for (const mapping of Object.values(Mechanics.FORME_CHANGE_ITEMS)) {
    for (const target of Object.values(mapping)) transformTargets.add(Dex.toID(target));
  }
  for (const item of Object.values(Dex.allItems)) {
    const stone = item.megaStone;
    if (!stone) continue;
    for (const target of (typeof stone === 'string' ? [stone] : Object.values(stone))) {
      transformTargets.add(Dex.toID(target));
    }
  }
  const unflagged = [...transformTargets]
    .map(id => Dex.species(id))
    .filter(s => !s.missing && !(s.transformOnly || s.battleOnly || s.requiredItem))
    .map(s => s.name);
  assert.deepStrictEqual([...unflagged], [],
    'every forme a transformation can produce must carry transformOnly, battleOnly or requiredItem');
  assert.ok(transformTargets.size > 50,
    `setup: the target set should be substantial, saw ${transformTargets.size}`);

  // The picker's data, and the fallback that keeps an old save safe.
  assert.deepStrictEqual([...Dex.skinsFor('magearna').map(s => s.id)], ['magearna', 'magearnaoriginal']);
  assert.deepStrictEqual([...Dex.skinsFor('pikachu').map(s => s.id)], ['pikachu'],
    'a species with no skins still reports itself, so a caller needs no special case');

  // An old set naming the cosmetic forme as its species is migrated in place.
  const legacy = Pokemon.normalizeSet({species: 'magearnaoriginal', level: 100, moves: ['fleurcannon']});
  assert.strictEqual(legacy.species, 'magearna', 'the species becomes the real one');
  assert.strictEqual(legacy.skin, 'magearnaoriginal', 'and the appearance is kept');
  assert.strictEqual(Dex.skinnedSpecies(legacy), 'magearnaoriginal', 'so it still looks the same');

  // A skin that is not legal for the species is dropped rather than kept.
  const bogus = Pokemon.normalizeSet({species: 'magearna', skin: 'pikachu', level: 100, moves: ['fleurcannon']});
  assert.strictEqual(bogus.skin, null);
  assert.strictEqual(Dex.skinnedSpecies(bogus), 'magearna');

  /*
   * The defect that motivated all of this: Magearna-Original's Mega forme is
   * not packaged, so picking it silently gave up Mega Evolution while still
   * paying the Magearnite tier ban. As a skin, the Mega is Magearna's and works.
   */
  assert.ok(!Dex.hasSpecies('magearnaoriginalmega'), 'that Mega was never packaged');
  const wearing = Pokemon.normalizeSet({species: 'magearna', skin: 'magearnaoriginal', item: 'magearnite', level: 100, moves: ['fleurcannon']});
  assert.strictEqual(Mechanics.heldForme(wearing)?.id, 'magearnamega',
    'a Magearna wearing the Original skin still reaches Magearna-Mega');
});

test('the UU briefing lists exactly the live UU roster and every move change', () => {
  /*
   * Same reasoning as the OU briefing pin: a tiering brief its reader cannot
   * check is worse than none, because every conclusion inherits the error. This
   * one carries a second generated block — the complete list of moves whose
   * packaged numbers differ from upstream — so that is pinned too.
   */
  const {Dex, Formats} = RedGPT;
  const source = fs.readFileSync(path.join(ROOT, 'docs/UU_ROSTER_FOR_TIERING.md'), 'utf8');

  const listBlock = /<!-- BEGIN GENERATED UU LIST -->([\s\S]*?)<!-- END GENERATED UU LIST -->/.exec(source);
  assert.ok(listBlock, 'the UU roster block must be present and marked');
  // `*` marks an estimated tier in the prose; strip it before comparing.
  const listed = listBlock[1].trim().split(/,\s*/).map(name => name.replace(/\*$/, '').trim()).filter(Boolean);
  const live = Formats.tierRoster('UU').map(entry => entry.name);
  assert.ok(live.length > 40, `sanity: UU should be substantial, saw ${live.length}`);
  assert.deepStrictEqual([...listed].sort(), [...live].sort(), 'the doc and the live UU roster must agree');

  /*
   * The move-difference table. Counted rather than compared name by name: the
   * table is generated by diffing against upstream `@pkmn`, which this suite
   * cannot load, so what is pinned is that the *claim* in the prose matches the
   * number of rows actually present. "46 moves differ" and a table of 44 must
   * not be able to ship together.
   */
  const diffBlock = /<!-- BEGIN GENERATED MOVE DIFF -->([\s\S]*?)<!-- END GENERATED MOVE DIFF -->/.exec(source);
  assert.ok(diffBlock, 'the move-difference block must be present');
  const rows = [...diffBlock[1].matchAll(/^\| (?!Move |--- )([^|]+) \|/gm)].map(m => m[1].trim());
  assert.ok(rows.length > 0, 'the move-difference table must have rows');
  // `\s+` rather than a space: the sentence wraps mid-phrase in the document.
  const claimed = /\*\*(\d+)\s+moves differ\*\*/.exec(source);
  assert.ok(claimed, 'the prose must state how many moves differ');
  assert.strictEqual(rows.length, +claimed[1],
    `the prose claims ${claimed[1]} changed moves and the table lists ${rows.length}`);

  // Every move named in that table must actually exist.
  const unknown = rows.filter(name => !Dex.hasMove(Dex.toID(name)));
  assert.deepStrictEqual([...unknown], [], 'every move in the difference table must be a real move');

  // And the headline roster counts in §2 must match the live ladder.
  for (const [tier, label] of [['OU', 'OU'], ['UU', 'UU'], ['Ubers', 'Ubers']]) {
    const size = Formats.tierRoster(tier).length;
    assert.ok(source.includes(`| ${size} |`) || source.includes(`**${size}**`),
      `the doc should state ${label}'s size of ${size}`);
  }
});

test('the UU format audit lists exactly the live UU, OU and RU rosters', () => {
  /*
   * The two-directional UU audit briefing. Same reasoning as the other two
   * pins: it is written for a reader who cannot check it, so every conclusion
   * drawn from it inherits any error.
   *
   * This one carries three rosters, because the question is two-directional —
   * the UU roster under review, plus the rungs either side as the bars that
   * "too strong" and "too weak" are measured against. All three are pinned.
   */
  const {Dex, Formats} = RedGPT;
  const source = fs.readFileSync(path.join(ROOT, 'docs/UU_FORMAT_AUDIT.md'), 'utf8');

  // The UU block is a profile per entry, each opening with a bold name.
  const pools = /<!-- BEGIN GENERATED UU POOLS -->([\s\S]*?)<!-- END GENERATED UU POOLS -->/.exec(source);
  assert.ok(pools, 'the UU profile block must be present and marked');
  const profiled = [...pools[1].matchAll(/^\*\*(.+?)\*\* /gm)].map(m => m[1]);
  const liveUU = Formats.tierRoster('UU').map(e => e.name);
  assert.ok(liveUU.length > 40, `sanity: UU should be substantial, saw ${liveUU.length}`);
  assert.deepStrictEqual([...profiled].sort(), [...liveUU].sort(),
    'the audit and the live UU roster must name the same Pokémon');

  // The two bars are ordinary tables: `| <n> | <Name> | ...`.
  for (const [marker, tier] of [['GENERATED OU BAR', 'OU'], ['GENERATED RU BAR', 'RU']]) {
    const block = new RegExp(`<!-- BEGIN ${marker} -->([\\s\\S]*?)<!-- END ${marker} -->`).exec(source);
    assert.ok(block, `${marker} must be present`);
    const listed = [...block[1].matchAll(/^\| \d+ \| ([^|]+?) \|/gm)].map(m => m[1].trim());
    const live = Formats.tierRoster(tier).map(e => e.name);
    assert.deepStrictEqual([...listed].sort(), [...live].sort(),
      `the ${tier} bar must match the live ${tier} roster`);
  }

  /*
   * The profiler must not advertise a move the format refuses. UU runs an
   * evasion clause and an OHKO clause through `rules.bannedMoves`, and a
   * profile listing Double Team under "Setup" would be offering a set the
   * validator rejects.
   */
  const banned = (Formats.get('tieruu').rules.bannedMoves || []).map(id => Dex.move(Dex.toID(id)).name);
  assert.ok(banned.length >= 6, `sanity: UU should ban some moves, saw ${banned.length}`);
  for (const name of banned) {
    assert.ok(!pools[1].includes(name), `${name} is banned in UU and must not appear in a profile`);
  }

  /*
   * The profiler must read the ENGINE, not the base stat line. Two defects the
   * shared profiler exists to fix, each pinned by the entry that exposed it:
   *
   * - **Ability-driven offence.** Mega Starmie is 100 Atk / 130 SpA on paper and
   *   656 / 394 once Huge Power is applied, and its physical Waterfall does
   *   2.6x what its Hydro Pump does. Filtering coverage on base stats hid the
   *   entire physical half. Azumarill is the same shape behind slot-0 Thick Fat.
   * - **The `-ate` conversions**, which happen in `onModifyMove` and so are
   *   invisible to `battle.moveType`: Pixilate's Hyper Voice is Fairy 117, not
   *   Normal 90.
   */
  const profileOf = name => {
    const m = new RegExp(`^\\*\\*${name.replace(/[-]/g, '\\-')}\\*\\* [\\s\\S]*?(?=\\n\\n)`, 'm').exec(pools[1]);
    assert.ok(m, `${name} must have a profile in the audit`);
    return m[0];
  };
  for (const [name, needle] of [
    ['Starmie-Mega', 'Physical coverage'],
    ['Starmie-Mega', 'Waterfall'],
    ['Azumarill', 'Physical coverage'],
  ]) {
    assert.ok(profileOf(name).includes(needle),
      `${name}'s profile must show ${needle} — its offence comes from an ability, not its base stats`);
  }
  assert.ok(/Fairy Hyper Voice 117S/.test(profileOf('Gardevoir-Mega')),
    "Mega Gardevoir's Hyper Voice must read Fairy 117 — Pixilate converts in onModifyMove, not in moveType");
  assert.ok(/Fairy Double-Edge 156P/.test(profileOf('Altaria-Mega')),
    "Mega Altaria's Double-Edge must read Fairy 156 for the same reason");
  // Charge moves must lose ties: Dive and Waterfall are both 80.
  assert.ok(!/Water Dive/.test(profileOf('Starmie-Mega')),
    'a charge move must not be quoted as the STAB when an equal non-charge move exists');

  // And the headline counts in the ladder table must match the live ladder.
  const ladder = /<!-- BEGIN GENERATED LADDER -->([\s\S]*?)<!-- END GENERATED LADDER -->/.exec(source);
  assert.ok(ladder, 'the ladder block must be present');
  for (const tier of ['OU', 'UU', 'RU']) {
    const size = Formats.tierRoster(tier).length;
    assert.ok(new RegExp(`\\*\\*${size}\\*\\*`).test(ladder[1]),
      `the ladder should state ${tier}'s size of ${size}`);
  }
});

test('the RU → UU pass moved exactly four entries and no base followed a forme up', () => {
  /*
   * The 2026-08-16 RU pass. Four entries up, nothing down.
   *
   * Two are `estimated` formes the nearest-neighbour model misplaced
   * (Raichu-Mega-Y's No Guard, Pyroar-Mega's Fire Mane) and two are species
   * whose imported tier predates a RedGPT redesign — Regieleki because Ring
   * Target removes the Ground immunity that balances mono-Electric, and
   * Metagross because Light Metal is +1 Speed on every entry here.
   *
   * The pin block is the load-bearing part: making two unranked Megas *ranked*
   * fed them into `estimateFormeTier`'s model and dragged four other ZU-based
   * estimated Megas to UU with them. Without the pins this pass moves 8 and UU
   * comes out at 94.
   */
  const {Dex, Formats, Pokemon, Validation} = RedGPT;
  const formeTier = (base, forme) => (Dex.species(base).formeItems || []).find(f => f.forme === forme)?.tier;
  const tierOf = name => Formats.TIER_ORDER.find(t => Formats.tierRoster(t).some(e => e.name === name));

  for (const n of ['Raichu-Mega-Y', 'Pyroar-Mega', 'Regieleki', 'Metagross']) {
    assert.strictEqual(tierOf(n), 'UU', `${n} should be UU`);
  }
  // The bases do NOT follow their formes up.
  assert.strictEqual(Dex.species('raichu').tier, 'ZU', 'base Raichu keeps its own tier');
  assert.strictEqual(Dex.species('pyroar').tier, 'ZU', 'base Pyroar keeps its own tier');
  assert.strictEqual(formeTier('raichu', 'Raichu-Mega-X'), 'RU', 'Raichu-Mega-X was not part of this pass');

  // The four pinned against the estimator ripple must still be RU.
  for (const n of ['Eelektross-Mega', 'Raichu-Mega-X', 'Scovillain-Mega', 'Victreebel-Mega']) {
    assert.strictEqual(tierOf(n), 'RU', `${n} must stay RU — it was never reviewed`);
  }

  // The stone is refused in RU while the species stays legal.
  const mv = sp => { const ls = Dex.learnset(Dex.toID(sp)) || []; return (Array.isArray(ls) ? ls : Object.keys(ls)).slice(0, 1); };
  const errs = (sp, item, fmt) => Validation.validateTeam(
    [Pokemon.normalizeSet({species: sp, item, level: 100, moves: mv(sp)})], Formats.get(fmt)).errors.map(e => e.message);
  for (const [base, item, label] of [['Raichu', 'raichunitey', 'Raichunite Y'], ['Pyroar', 'pyroarite', 'Pyroarite']]) {
    const banned = errs(base, item, 'tierru');
    assert.strictEqual(banned.length, 1, `${label} should be refused in RU, saw ${JSON.stringify(banned)}`);
    assert.ok(new RegExp(`${label} is banned`).test(banned[0]), banned[0]);
    assert.deepStrictEqual([...errs(base, '', 'tierru')], [], `CONTROL: bare ${base} must stay legal in RU`);
    assert.deepStrictEqual([...errs(base, item, 'tieruu')], [], `CONTROL: ${label} must be legal in UU`);
  }
  // And the two species are refused in RU outright.
  for (const sp of ['Regieleki', 'Metagross']) {
    assert.strictEqual(errs(sp, '', 'tierru').length, 1, `${sp} should be refused in RU now that it is UU`);
    assert.deepStrictEqual([...errs(sp, '', 'tieruu')], [], `CONTROL: ${sp} must be legal in UU`);
  }

  /*
   * These two literals carry the arithmetic of every pass that has touched
   * these rungs, deliberately spelled out rather than derived — a count
   * compared against itself is the tautology §8 records.
   */
  assert.strictEqual(Formats.tierRoster('RU').length, 131,
    'RU is 126 - 4 (the RU → UU pass) + 6 from NU + Meowstic-M-Mega and ' +
    'Tatsugiri-Curly-Mega (the Mega sprite-key fix) + Porygon2 (the untiered audit)');
  assert.strictEqual(Formats.tierRoster('NU').length, 67,
    'NU is 65 - 6 to RU - 1 (Audino-Mega) to PU + 5 from PU + Gothitelle - Chandelure ' +
    '+ the 4 the untiered audit placed; the RU pass itself dropped nothing here');
});

test('the NU pass moved exactly seven entries and no base followed its forme', () => {
  /*
   * The 2026-08-16 NU pass. Six up to RU, one forme down to PU.
   *
   * Two of the six turn on a RedGPT ability redesign the imported tier could
   * not have known about — Duraludon's Light Metal (+1 Speed on every entry)
   * and Copperajah's Heavy Metal (+1 Atk / +1 Def / -2 Spe on entry). That is
   * the same shape that moved Metagross RU → UU, and it is the shape to look
   * for in every future pass.
   *
   * Audino-Mega is the Absol/Absolite rule pointed downward: the *forme* drops
   * to PU and base Audino, already PU, does not move — so the Audinite becomes
   * legal in PU where it was previously refused. That last assertion is the
   * one that would catch a fix applied to the species instead of the forme.
   */
  const {Dex, Formats, Pokemon, Validation} = RedGPT;
  const tierOf = name => Formats.TIER_ORDER.find(t => Formats.tierRoster(t).some(e => e.name === name));
  const mv = sp => { const ls = Dex.learnset(Dex.toID(sp)) || []; return (Array.isArray(ls) ? ls : Object.keys(ls)).slice(0, 1); };
  const errs = (sp, item, fmt) => Validation.validateTeam(
    [Pokemon.normalizeSet({species: sp, item, level: 100, moves: mv(sp)})], Formats.get(fmt)).errors.map(e => e.message);

  const PROMOTED = ['Duraludon', 'Infernape', 'Tornadus', 'Copperajah', 'Munkidori'];
  for (const n of [...PROMOTED, 'Meloetta-Pirouette']) {
    assert.strictEqual(tierOf(n), 'RU', `${n} should be RU after the NU pass`);
  }
  assert.strictEqual(tierOf('Audino-Mega'), 'PU', 'Audino-Mega should have dropped to PU');

  // The bases do NOT move with them, in either direction.
  assert.strictEqual(Dex.species('meloetta').tier, 'NU', 'base Meloetta stays NU — only the Pirouette entry moved');
  assert.strictEqual(Dex.species('audino').tier, 'PU', 'base Audino was already PU and must not move with its Mega');

  // The five selectable promotions are refused in NU and legal in RU.
  for (const sp of PROMOTED) {
    assert.strictEqual(errs(sp, '', 'tiernu').length, 1, `${sp} should be refused in NU now that it is RU`);
    assert.deepStrictEqual([...errs(sp, '', 'tierru')], [], `CONTROL: ${sp} must be legal in RU`);
  }

  /*
   * The Audinite is the forme-ban rule in reverse: dropping the *forme* to PU
   * must make the stone legal there. Before this pass the validator said
   * "Audinite is banned in PU — it turns Audino into Audino-Mega, which is NU".
   */
  assert.deepStrictEqual([...errs('Audino', 'audinite', 'tierpu')], [],
    'the Audinite must be legal in PU now that Audino-Mega is PU');
  /*
   * The control is on the ban *message*, not on the error count: one rung down
   * in ZU the species is illegal too, so counting errors would pass for the
   * wrong reason.
   */
  assert.ok(errs('Audino', 'audinite', 'tierzu').some(m => /Audinite is banned in ZU/.test(m)),
    'CONTROL: the Audinite must still be refused in ZU, one rung below the forme');

  /*
   * Meloetta-Pirouette carries `battleOnly: 'Meloetta'`, and **no route into it
   * exists** — Relic Song is packaged as an ordinary 75 BP sound move with no
   * forme-change implementation anywhere in src/. So its tier is a roster
   * classification and nothing more: the validator refuses it in every tier
   * format at every tier. Pinned so that if a Relic Song forme change is ever
   * implemented, this assertion fails and the tier gate gets revisited with it.
   */
  for (const fmt of ['tierru', 'tiernu', 'tierubers']) {
    const e = errs('Meloetta-Pirouette', '', fmt);
    assert.ok(e.some(m => /battle-only forme/.test(m)),
      `Meloetta-Pirouette must still be refused by the battle-only gate in ${fmt}, saw ${JSON.stringify(e)}`);
  }

  assert.strictEqual(Formats.tierRoster('PU').length, 110,
    'PU is 70 + Audino-Mega - 5 to NU + Dugtrio and Wobbuffet + the 4 from ZU + the 38 the untiered audit placed');
  assert.strictEqual(Formats.tierRoster('ZU').length, 677,
    'ZU is 254 - Gothitelle, Dugtrio, Wobbuffet - the 4 promoted by the ZU pass ' +
    '+ the 430 floored by the untiered audit; the NU pass itself did not touch it');
});

test('the PU and trapping passes moved exactly nine entries, and no forme followed a base', () => {
  /*
   * Two audits implemented together on 2026-08-16: the PU pass (five up, none
   * down) and the global trapping-ability pass (four holders moved, five
   * deliberately left).
   *
   * The load-bearing half is the Chandelure pin. Chandelure-Mega is an
   * `estimated` forme, so its tier is derived from base Chandelure's — and
   * **measured**, moving the base NU → UU sends the Mega's estimate to **OU**
   * without the pin. That is a two-rung jump nothing asked for, so unlike the
   * Hawlucha and Magearna pins this one really is doing work.
   */
  const {Dex, Formats, Pokemon, Validation} = RedGPT;
  const tierOf = name => Formats.TIER_ORDER.find(t => Formats.tierRoster(t).some(e => e.name === name));
  const mv = sp => { const ls = Dex.learnset(Dex.toID(sp)) || []; return (Array.isArray(ls) ? ls : Object.keys(ls)).slice(0, 1); };
  const errs = (sp, item, fmt) => Validation.validateTeam(
    [Pokemon.normalizeSet({species: sp, item, level: 100, moves: mv(sp)})], Formats.get(fmt)).errors.map(e => e.message);

  // -- the PU pass --
  const PROMOTED = ['Aggron', 'Heracross', 'Hariyama', 'Decidueye-Hisui', 'Pawmot'];
  for (const n of PROMOTED) {
    assert.strictEqual(tierOf(n), 'NU', `${n} should be NU after the PU pass`);
    assert.strictEqual(errs(n, '', 'tierpu').length, 1, `${n} should be refused in PU now that it is NU`);
    assert.deepStrictEqual([...errs(n, '', 'tiernu')], [], `CONTROL: ${n} must be legal in NU`);
  }

  // -- the trapping pass --
  assert.strictEqual(tierOf('Chandelure'), 'UU', 'Chandelure went NU → UU');
  assert.strictEqual(tierOf('Gothitelle'), 'NU', 'Gothitelle went ZU → NU, two rungs');
  assert.strictEqual(tierOf('Dugtrio'), 'PU', 'Dugtrio went ZU → PU');
  assert.strictEqual(tierOf('Wobbuffet'), 'PU', 'Wobbuffet went ZU → PU');

  // Reviewed and deliberately LEFT — an absent override must stay absent.
  assert.strictEqual(tierOf('Gengar-Mega'), 'Ubers', 'Gengar-Mega stays Ubers');
  assert.strictEqual(tierOf('Gengar'), 'UU', 'base Gengar is untouched');
  assert.strictEqual(tierOf('Magnezone'), 'RU', 'Magnezone stays RU — Magnet Pull is narrow');
  for (const n of ['Golem-Alola', 'Probopass', 'Meltan']) {
    assert.strictEqual(tierOf(n), 'ZU', `${n} stays ZU`);
  }

  /*
   * The pin, and the Absol/Absolite rule with it: the base moved and the forme
   * did not, so the Chandelurite is legal in UU and refused one rung below.
   */
  assert.strictEqual(tierOf('Chandelure-Mega'), 'UU', 'Chandelure-Mega must NOT follow its base up');
  assert.deepStrictEqual([...errs('Chandelure', 'chandelurite', 'tieruu')], [],
    'the Chandelurite must be legal in UU');
  assert.ok(errs('Chandelure', 'chandelurite', 'tierru').some(m => /Chandelurite is banned in RarelyUsed/.test(m)),
    'CONTROL: the Chandelurite must still be refused one rung below the forme');

  // The other two promoted bases must not drag their Megas either.
  assert.strictEqual(tierOf('Aggron-Mega'), 'RU', 'Aggron-Mega was not part of this pass');
  assert.strictEqual(tierOf('Heracross-Mega'), 'UU', 'Heracross-Mega was not part of this pass');

  /*
   * Meloetta-Pirouette was explicitly excluded from this pass pending a real
   * Relic Song forme route, so it must sit exactly where the NU pass left it.
   */
  assert.strictEqual(tierOf('Meloetta-Pirouette'), 'RU', 'Meloetta-Pirouette is untouched by this pass');
  assert.strictEqual(Dex.species('meloetta').tier, 'NU', 'base Meloetta is untouched');

  // No PU → ZU movement occurred: ZU lost three to that pass and gained none.
  assert.strictEqual(Formats.tierRoster('ZU').length, 677,
    'ZU is 254 - Gothitelle, Dugtrio, Wobbuffet - the 4 promoted by the ZU pass + the 430 floored by the untiered audit');
});

test('the untiered document tracks the live untiered roster, empty or not', () => {
  /*
   * This began as the evidence packet for the 473 selectable species with no
   * ladder tier. **The audit was implemented, so the subject is now empty** and
   * the generator emits a RESOLVED record instead — a generated document has to
   * describe the live state, and a 3,897-line packet asserting that 473 species
   * are untiered stopped being true the moment the placements landed.
   *
   * The test follows the same fork, so it keeps working in either direction: if
   * a future rebuild ever leaves a species tierless, the packet comes back and
   * this asserts its roster again.
   */
  const {Dex, Formats} = RedGPT;
  const source = fs.readFileSync(path.join(ROOT, 'docs/UNTIERED_EVIDENCE.md'), 'utf8');
  const ladder = Formats.TIER_ORDER.filter(t => Formats.tierRoster(t).length);
  const untiered = Dex.allSpecies.filter(s => !(s.tier && ladder.includes(s.tier)));

  if (!untiered.length) {
    assert.ok(/RESOLVED/.test(source), 'with nothing untiered the document must be the resolved record');
    assert.ok(/\*\*0\*\*/.test(source), 'and must state a count of zero');
    // The placements it records are asserted against the live data, not trusted.
    assert.strictEqual(Dex.species('Porygon2').tier, 'RU');
    assert.strictEqual(Dex.species('Mienfoo').tier, 'PU');
    assert.strictEqual(Dex.species('Magikarp').tier, 'ZU');
    return;
  }

  const section = /\n## E\.[\s\S]*?(?=\n## F\.)/.exec(source);
  assert.ok(section, 'section E must be present and followed by F');
  const listed = [...section[0].matchAll(/^\*\*(.+?)\*\* — species, \*\*no tier\*\*/gm)].map(m => m[1]);
  assert.deepStrictEqual([...listed].sort(), [...untiered.map(s => s.name)].sort(),
    'section E must name exactly the live untiered roster');
  assert.ok(/contains no recommendations/.test(source), 'the packet must carry no recommendations');
});

test('the Silvally packet covers every Memory', () => {
  /*
   * The per-Memory evidence the ZU audit said it was missing. Discovery is from
   * the item data (`onMemory`), so a new Memory would have to appear here too.
   */
  const {Dex} = RedGPT;
  const source = fs.readFileSync(path.join(ROOT, 'docs/SILVALLY_MEMORY_EVIDENCE.md'), 'utf8');
  const memories = Object.values(Dex.allItems).filter(i => i.onMemory);
  assert.ok(memories.length >= 17, `sanity: there should be 17+ Memories, saw ${memories.length}`);
  for (const m of memories) {
    assert.ok(source.includes(m.name), `${m.name} must be profiled`);
  }
  assert.ok(/contains no recommendations/.test(source), 'the packet must carry no recommendations');
});

test('a Mega whose artwork is named after its holder is packaged', () => {
  /*
   * Three Megas were dropped for "no matching front+back sprite pair" with
   * complete artwork on disk, because `spriteCandidates` builds
   * `<baseSpecies> <forme>` while the files are named after the Mega's HOLDER:
   *
   *   Floette-Mega          asked FLOETTE MEGA           disk FLOETTE ETERNAL MEGA
   *   Meowstic-M-Mega       asked MEOWSTIC M MEGA        disk MEOWSTIC MEGA
   *   Tatsugiri-Curly-Mega  asked TATSUGIRI CURLY MEGA   disk TATSUGIRI MEGA
   *
   * Three instances of one shape — §9's rule says that means the rule was
   * wrong, not the data.
   */
  const {Dex, Formats, Mechanics, Pokemon} = RedGPT;
  for (const n of ['Floette-Mega', 'Meowstic-M-Mega', 'Tatsugiri-Curly-Mega']) {
    assert.ok(Dex.hasSpecies(n), `${n} must be packaged`);
    assert.ok(Dex.species(n).front && Dex.species(n).back, `${n} must have both sprites resolved`);
  }
  // CONTROL: the ordinary case must not have regressed.
  for (const n of ['Charizard-Mega-X', 'Gengar-Mega', 'Medicham-Mega']) {
    assert.ok(Dex.hasSpecies(n), `CONTROL: ${n} must still be packaged`);
  }

  /*
   * The Floettite is exclusive to Floette-Eternal — plain Floette has no
   * `formeItems` entry at all, and holding one does nothing for it.
   */
  assert.deepStrictEqual([...(Dex.species('Floette').formeItems || [])], [],
    'plain Floette has no Mega route');
  const eternal = (Dex.species('Floette-Eternal').formeItems || []);
  assert.strictEqual(eternal.length, 1, 'Floette-Eternal is the only Floettite holder');
  assert.strictEqual(eternal[0].forme, 'Floette-Mega');
  assert.strictEqual(Dex.species('Floette-Mega').changesFrom, 'Floette-Eternal',
    'and the Mega declares Floette-Eternal as its holder');
  const reach = n => Mechanics.reachableFormes(
    Pokemon.normalizeSet({species: n, item: 'floettite', level: 100, moves: ['tackle']})).map(f => f.name);
  assert.deepStrictEqual([...reach('Floette')], [], 'CONTROL: a Floettite does nothing for plain Floette');
  assert.deepStrictEqual([...reach('Floette-Eternal')], ['Floette-Mega'], 'but Floette-Eternal reaches its Mega');

  // They joined the ladder on their pre-existing estimated rows, not on new ones.
  const tierOf = name => Formats.TIER_ORDER.find(t => Formats.tierRoster(t).some(e => e.name === name));
  assert.strictEqual(tierOf('Floette-Mega'), 'OU');
  assert.strictEqual(tierOf('Meowstic-M-Mega'), 'RU');
  assert.strictEqual(tierOf('Tatsugiri-Curly-Mega'), 'RU');
});

test('the ZU pass promoted exactly four species and no forme followed a base up', () => {
  /*
   * The 2026-08-17 ZU pass — the last rung, and one-directional because ZU is
   * the floor. Four promotions, no demotions.
   *
   * **Medicham is the forme case and it needs no pin**, unlike Chandelure:
   * Medicham-Mega is ranked by Nat Dex at OU rather than `estimated`, so
   * `formeItemsFor` never consults the estimator for it and moving the base
   * cannot drag it. That is asserted rather than assumed, because the same
   * shape DID need a pin one pass earlier.
   */
  const {Dex, Formats, Pokemon, Validation} = RedGPT;
  const tierOf = name => Formats.TIER_ORDER.find(t => Formats.tierRoster(t).some(e => e.name === name));
  const mv = sp => { const ls = Dex.learnset(Dex.toID(sp)) || []; return (Array.isArray(ls) ? ls : Object.keys(ls)).slice(0, 1); };
  const errs = (sp, item, fmt) => Validation.validateTeam(
    [Pokemon.normalizeSet({species: sp, item, level: 100, moves: mv(sp)})], Formats.get(fmt)).errors.map(e => e.message);

  const PROMOTED = ['Medicham', 'Rampardos', 'Virizion', 'Brute Bonnet'];
  for (const n of PROMOTED) {
    assert.strictEqual(tierOf(n), 'PU', `${n} should be PU after the ZU pass`);
    assert.strictEqual(errs(n, '', 'tierzu').length, 1, `${n} should be refused in ZU now that it is PU`);
    assert.deepStrictEqual([...errs(n, '', 'tierpu')], [], `CONTROL: ${n} must be legal in PU`);
  }

  // The forme half: the base moved and the Mega did not.
  assert.strictEqual(tierOf('Medicham-Mega'), 'OU', 'Medicham-Mega must NOT follow its base — it is Nat Dex ranked');
  const fi = (Dex.species('Medicham').formeItems || []).find(f => f.forme === 'Medicham-Mega');
  assert.strictEqual(fi.tierSource, 'natdex',
    'Medicham-Mega is imported, not estimated — which is why this pass needs no pin');
  assert.ok(errs('Medicham', 'medichamite', 'tierpu').some(m => /Medichamite is banned in PU/.test(m)),
    'the Medichamite must be refused in PU while Medicham itself is legal there');
  assert.deepStrictEqual([...errs('Medicham', 'medichamite', 'tierou')], [],
    'CONTROL: the Medichamite must still be legal in OU, where the forme sits');

  /*
   * The two 670 BSTs were reviewed and deliberately left. Their drawbacks are
   * implemented and are each species' only ability, which is the whole reason
   * a BST-driven promotion argument fails for them.
   */
  for (const n of ['Regigigas', 'Slaking', 'Silvally', 'Minior', 'Articuno', 'Mesprit', 'Regirock', 'Regice', 'Jolteon', 'Sceptile', 'Ninetales']) {
    assert.strictEqual(tierOf(n), 'ZU', `${n} was reviewed and deliberately left in ZU`);
  }
  assert.deepStrictEqual([...Dex.abilityList('Regigigas')], ['Slow Start'], 'Regigigas cannot opt out of Slow Start');
  assert.deepStrictEqual([...Dex.abilityList('Slaking')], ['Truant'], 'Slaking cannot opt out of Truant');

  // The settled trapping placements are untouched by this pass.
  for (const [n, t] of [['Golem-Alola', 'ZU'], ['Probopass', 'ZU'], ['Meltan', 'ZU'], ['Palafin', 'ZU']]) {
    assert.strictEqual(tierOf(n), t, `${n} must remain ${t}`);
  }

  // These carry the untiered audit's additions on top now: PU +38, ZU +430.
  assert.strictEqual(Formats.tierRoster('PU').length, 110, 'PU is 68 + 4 from ZU + 38 from the untiered audit');
  assert.strictEqual(Formats.tierRoster('ZU').length, 677, 'ZU is 251 - 4 promoted + 430 floored');
  const total = Formats.TIER_ORDER.reduce((n, t) => n + Formats.tierRoster(t).length, 0);
  /*
   * 756 + the three Megas the 2026-08-17 sprite-key fix packaged. Those are
   * ADDITIONS to the ladder rather than movements — no existing entry changed
   * tier, verified by a full before/after snapshot — so the conservation
   * property still holds for the ZU promotions themselves.
   */
  assert.strictEqual(total, 1232,
    'the ranked total is 756 + the 3 recovered Megas + the 473 the untiered audit placed');
});

test('the ZU evidence packet lists exactly the live ZU and PU rosters', () => {
  /*
   * The ZU audit packet. ZU is the bottom rung, so this pass is
   * ONE-DIRECTIONAL — the packet carries the ZU roster under review and the PU
   * roster as the only bar. There is no downward bar to pin, and the packet
   * says so in as many words rather than omitting the section.
   */
  const {Dex, Formats} = RedGPT;
  const source = fs.readFileSync(path.join(ROOT, 'docs/ZU_FINAL_EVIDENCE.md'), 'utf8');
  const section = (from, to) => {
    const re = new RegExp(`\\n## ${from}\\.[\\s\\S]*?(?=\\n## ${to}\\.)`);
    const m = re.exec(source);
    assert.ok(m, `section ${from} must be present and followed by ${to}`);
    return m[0];
  };
  for (const [from, to, tier] of [['C', 'D', 'ZU'], ['D', 'E', 'PU']]) {
    const profiled = [...section(from, to).matchAll(/^\*\*(.+?)\*\* — /gm)].map(m => m[1]);
    const live = Formats.tierRoster(tier).map(e => e.name);
    assert.ok(live.length > 40, `sanity: ${tier} should be substantial, saw ${live.length}`);
    assert.deepStrictEqual([...profiled].sort(), [...live].sort(),
      `section ${from} must name exactly the live ${tier} roster`);
  }

  // The one-directional framing is the packet's defining property.
  assert.ok(/There is no downward bar/.test(source),
    'the packet must state that ZU has no tier below it');
  /*
   * The instruction, not the arrow. A first version banned any `ZU → X` other
   * than `ZU → PU`, which fired on the *history* section recording that
   * Gothitelle went ZU → NU in the trapping pass — a fact, not a proposal.
   */
  assert.ok(/\*\*do not propose demotions\*\*/i.test(source),
    'the packet must tell its reader not to propose demotions');
  /*
   * Capture the destination rather than using a lookahead. `ZU\s*→\s*(?!PU)`
   * matches "ZU → PU": `\s*` is allowed to match ZERO characters, so the
   * lookahead is evaluated at the space *before* "PU" and succeeds. A guard
   * that fires for the wrong reason is the same defect as one that never fires.
   */
  const headers = [...source.matchAll(/^## .*$/gm)].map(m => m[0]);
  for (const h of headers) {
    const arrow = /ZU\s*→\s*([A-Za-z]+)/.exec(h);
    assert.ok(!arrow || arrow[1] === 'PU',
      `no section may offer a downward destination for ZU, saw: ${h}`);
  }

  /*
   * Regigigas is the only Slow Start holder on the ladder, and `P.offence`
   * measures with the penalty ACTIVE — so its profile must print both the
   * halved and the post-expiry line, or the packet understates a 160-Attack
   * Pokemon by half and picks a special set for it.
   */
  assert.ok(/Slow Start halves Attack and Speed for \*\*five turns\*\*/.test(source),
    'the packet must flag that the engine stat line is measured with Slow Start active');
  assert.ok(/Atk 419\/460/.test(source),
    "Regigigas's post-expiry Attack must be printed, not only the halved 230");

  assert.ok(/This packet contains no recommendations/.test(source),
    'the packet must state that it carries no recommendations');
  assert.ok(!/^\s*(?:\*\*)?(?:Recommendation|Verdict|Final verdict)(?:\*\*)?\s*:/mi.test(source),
    'the packet must not contain a labelled verdict line');
});

test('the UU-OU pass promoted nothing and pinned seven reviewed formes', () => {
  /*
   * The 2026-08-17 UU -> OU pass. **No promotions** — all 91 UU entries were
   * reviewed against the OU bar and every one stayed, so this asserts the
   * absence of movement as much as anything else.
   *
   * The one implementation action was provenance: seven UU formes were sitting
   * on `estimateFormeTier`'s nearest-neighbour guess and have now been reviewed
   * explicitly. Their ENFORCED tier does not move — the pins convert
   * `estimated` to `redgpt-override` so the model can no longer drag a reviewed
   * verdict, which is the ripple that has fired three times on this programme.
   *
   * **Both halves are asserted, and that is what makes a delete-control work
   * here where `hawluchamega`'s was VACUOUS.** There, deleting the row left the
   * estimator producing the same tier and nothing could see it. Here the tier is
   * also the same — but the PROVENANCE is not, so deleting a row reddens this.
   */
  const {Dex, Formats, Pokemon, Validation} = RedGPT;
  const SEVEN = ['Dragalge-Mega', 'Drampa-Mega', 'Emboar-Mega', 'Meganium-Mega',
    'Scrafty-Mega', 'Staraptor-Mega', 'Starmie-Mega'];
  const uu = Formats.tierRoster('UU');

  for (const name of SEVEN) {
    const entry = uu.find(e => e.name === name);
    assert.ok(entry, `${name} must still be a UU roster entry`);
    assert.strictEqual(entry.kind, 'forme', `${name} is a forme, and the pin is on the forme`);
    assert.strictEqual(entry.estimated, false,
      `${name} must no longer sit on an estimated tier — it was reviewed and pinned`);
    // The tier the game actually ENFORCES is the formeItems row, not species.tier.
    const fi = (Dex.species(entry.base).formeItems || []).find(f => f.forme === name);
    assert.ok(fi, `${name} must still be produced by an item on ${entry.base}`);
    assert.strictEqual(fi.tier, 'UU', `${name} must still be enforced at UU`);
    assert.strictEqual(fi.tierSource, 'redgpt-override',
      `${name}'s tier must be an explicit reviewed override, not a model output`);
  }

  /*
   * **Tier the forme, not the base.** All seven bases keep their own tiers, and
   * they are deliberately spread across four rungs — if a pin ever leaked onto a
   * base, this is where it would show.
   */
  for (const [base, tier] of [['Dragalge', 'NU'], ['Drampa', 'NU'], ['Emboar', 'PU'],
    ['Meganium', 'ZU'], ['Scrafty', 'NU'], ['Staraptor', 'NU'], ['Starmie', 'NU']]) {
    assert.strictEqual(Dex.species(base).tier, tier,
      `${base} must keep its own tier — the pin is on its Mega, not on it`);
  }

  // No UU entry is left on an estimate, which is the point of the pass.
  assert.deepStrictEqual([...uu.filter(e => e.estimated).map(e => e.name)], [],
    'UU must contain no estimated tiers once the seven are pinned');

  /*
   * NO PROMOTIONS. The counts are literals by design (§8: a derived count is a
   * tautology worse than nothing) and they carry the running arithmetic: UU is
   * still 71 + the 15 that dropped from OU + 4 from the RU pass + Chandelure.
   */
  assert.strictEqual(Formats.tierRoster('UU').length, 91, 'UU must not have lost an entry to OU');
  assert.strictEqual(Formats.tierRoster('OU').length, 93, 'OU must not have gained one from UU');
  const total = Formats.TIER_ORDER.reduce((n, t) => n + Formats.tierRoster(t).length, 0);
  assert.strictEqual(total, 1232, 'the ranked total is conserved — this pass moved nothing');
  assert.strictEqual(Dex.allSpecies.length, 1138, 'and no species became selectable or stopped being');

  /*
   * The Absol/Absolite rule still holds for all seven: the stone is legal where
   * the forme is, and refused below it, with the base staying legal. Exercised
   * through the real validator rather than read off the data.
   */
  const mv = sp => { const ls = Dex.learnset(Dex.toID(sp)) || []; return (Array.isArray(ls) ? ls : Object.keys(ls)).slice(0, 1); };
  const errs = (sp, item, fmt) => Validation.validateTeam(
    [Pokemon.normalizeSet({species: sp, item, level: 100, moves: mv(sp)})], Formats.get(fmt)).errors.map(e => e.message);
  for (const [base, name] of [['Starmie', 'Starmie-Mega'], ['Staraptor', 'Staraptor-Mega']]) {
    const item = (Dex.species(base).formeItems || []).find(f => f.forme === name).item;
    assert.deepStrictEqual([...errs(base, item, 'tieruu')], [],
      `CONTROL: ${item} must be legal in UU, where the forme sits`);
    assert.ok(errs(base, item, 'tiernu').some(m => /banned in NeverUsed/.test(m)),
      `${item} must be refused in NU, one rung below the forme`);
    assert.deepStrictEqual([...errs(base, '', 'tiernu')], [],
      `CONTROL: ${base} itself must stay legal in NU without the stone`);
  }
});

test('the UU-OU + Meloetta packet lists exactly the live UU and OU rosters', () => {
  /*
   * One document, two audits.
   *
   * **Part I is the UU -> OU pass and is deliberately upward only.** Unlike the
   * ZU packet that is a SCOPING decision rather than a structural fact: UU has
   * RU beneath it, and §10 records why the two directions stay separate — a
   * downward and an upward pass on one rung at the same time cannot be
   * attributed to either. The downward half was asked in `UU_FINAL_EVIDENCE.md`.
   *
   * **Part II is not a rung audit.** Meloetta-Pirouette is `battleOnly`, so it
   * can never be picked and its tier does exactly one job: it decides the rung
   * from which Relic Song is legal. Its sections carry an `MEL` prefix
   * deliberately — a plain `M` would collide with Part I's section M.
   */
  const {Dex, Formats} = RedGPT;
  const source = fs.readFileSync(path.join(ROOT, 'docs/UU_OU_EVIDENCE.md'), 'utf8');
  const section = (from, to) => {
    const re = new RegExp(`\\n## ${from}\\.[\\s\\S]*?(?=\\n## ${to}\\.)`);
    const m = re.exec(source);
    assert.ok(m, `section ${from} must be present and followed by ${to}`);
    return m[0];
  };

  for (const [from, to, tier] of [['C', 'D', 'UU'], ['D', 'E', 'OU']]) {
    const profiled = [...section(from, to).matchAll(/^\*\*(.+?)\*\* — /gm)].map(m => m[1]);
    const live = Formats.tierRoster(tier).map(e => e.name);
    assert.ok(live.length > 40, `sanity: ${tier} should be substantial, saw ${live.length}`);
    assert.deepStrictEqual([...profiled].sort(), [...live].sort(),
      `section ${from} must name exactly the live ${tier} roster`);
  }

  /* ---- Part I: the one-directional framing is the pass's defining property ---- */
  // The bold instruction, not an exact string: the sentence carries a trailing
  // word in one place and a full stop in the other, and both are the same rule.
  assert.ok(/\*\*do not propose demotions/i.test(source),
    'the packet must tell its reader not to propose demotions');
  assert.ok(/There is no downward bar in this pass/.test(source),
    'and must say so in a section of its own rather than omitting it');
  /*
   * Capture the destination rather than using a lookahead. `UU\s*→\s*(?!OU)`
   * matches "UU → OU", because `\s*` may match ZERO characters and the
   * lookahead is then evaluated at the space before "OU". That exact guard
   * fired for the wrong reason once already on the ZU packet.
   */
  for (const h of [...source.matchAll(/^#{1,2} .*$/gm)].map(m => m[0])) {
    const arrow = /UU\s*→\s*([A-Za-z]+)/.exec(h);
    assert.ok(!arrow || arrow[1] === 'OU',
      `no heading may offer a destination other than OU for UU, saw: ${h}`);
  }

  /*
   * The substantive thing this packet does that its five siblings do not:
   * annotate a move the shared profiler quotes at full power but the engine
   * refuses at use time. Last Resort is the sharp case — 140 BP, quoted as
   * Meloetta-Pirouette's Normal STAB, and it fails until every other move in
   * the set has been used.
   */
  assert.ok(/Last Resort 140P \*\*\[conditional/.test(source),
    'Last Resort must be annotated as conditional wherever it is quoted');
  assert.ok(/Every damaging `AVOID` entry quoted anywhere in this packet carries an\n   annotation/.test(source),
    'the reconciliation against RandomTeams.AVOID must come back complete');
  assert.ok(/absent from `Mechanics.CHARGE_MOVES`/.test(source),
    'Skull Bash being single-turn in this engine must be stated, not left to be assumed');

  /* ---- Part II: the route, the gate, and the fact that makes the tier matter ---- */
  assert.ok(/## MEL1\./.test(source) && /## MEL10\./.test(source),
    'Part II must use the MEL prefix so it cannot collide with Part I section M');
  /*
   * Part II carries its own comparison bars in full rather than pointing at
   * RU_FINAL_EVIDENCE and NU_FINAL_EVIDENCE, because the packet is pasted as
   * ONE document and a pointer to another file is not a bar. UU is not
   * repeated — it is already Part I section C, inside the same document.
   * A subset check rather than an exact set: section MEL8 also contains the
   * role-comparison blocks, which repeat Pirouette's own header line.
   */
  const bars = section('MEL8', 'MEL9');
  for (const tier of ['RU', 'NU']) {
    const live = Formats.tierRoster(tier).map(e => e.name);
    assert.ok(live.length > 40, `sanity: ${tier} should be substantial, saw ${live.length}`);
    // Spread first: `live` comes from the VM sandbox, so a sandbox array is not
    // `deepStrictEqual` to a host `[]` even when both are empty (§8).
    assert.deepStrictEqual([...live.filter(n => !bars.includes(`**${n}** — `))], [],
      `section MEL8 must carry the whole live ${tier} roster as a comparison bar`);
  }

  const mel = section('MEL9', 'MEL10');
  assert.ok(/Relic Song is banned in NeverUsed/.test(mel),
    'the gate must be shown refusing the MOVE in NU, quoted from the real validator');
  assert.ok(/battle-only forme/.test(source),
    'and the packet must state that Pirouette can never be picked directly');
  // Both formes, and both tiers, read from the live data rather than written down.
  assert.strictEqual(Dex.species('Meloetta').tier, 'NU');
  assert.strictEqual(Dex.species('Meloetta-Pirouette').tier, 'RU');
  assert.ok(source.includes(`| Meloetta | ${Dex.species('Meloetta').types.join('/')} |`),
    "Meloetta's live base stat line must be in the packet");
  assert.ok(/Pressure \(control/.test(source),
    'the Serene Grace measurement must carry its control row, or it measures nothing');
  assert.ok(/The other three \*\*rotate\*\*/.test(source),
    'the stat change must be described as a rotation — it is not a Def/SpD swap');

  /* ---- and it is evidence, not a verdict ---- */
  assert.ok(/This packet contains no recommendations/.test(source),
    'the packet must state that it carries no recommendations');
  assert.ok(!/^\s*(?:\*\*)?(?:Recommendation|Verdict|Final verdict)(?:\*\*)?\s*:/mi.test(source),
    'the packet must not contain a labelled verdict line');
});

test('the trapping audit prompt names exactly the live trapping holders', () => {
  /*
   * The global trapping packet is discovered by HOOK, so it must stay in step
   * with the ability registry rather than with a written list. If a fourth
   * trapping ability is ever added, or a holder's tier moves, this fails until
   * the document is regenerated.
   */
  const {Dex, Formats, Abilities} = RedGPT;
  const source = fs.readFileSync(path.join(ROOT, 'docs/TRAPPING_ABILITY_TIER_AUDIT_PROMPT.md'), 'utf8');

  const trappers = Object.entries(Abilities.registry)
    .filter(([, def]) => def && typeof def.onTrapped === 'function').map(([id]) => id);
  for (const t of trappers) {
    assert.ok(source.includes(Dex.ability(t).name), `the packet must cover ${Dex.ability(t).name}`);
  }

  // Every holder that carries a ladder tier must appear in the inventory table.
  const ladder = Formats.TIER_ORDER.filter(t => Formats.tierRoster(t).length);
  const tiered = [];
  for (const s of Dex.packagedSpecies) {
    const abilities = Dex.abilityList(s.name) || [];
    if (!abilities.some(a => trappers.includes(Dex.toID(a)))) continue;
    if (s.tier && ladder.includes(s.tier)) tiered.push(s.name);
  }
  assert.ok(tiered.length >= 5, `sanity: there should be several tiered holders, saw ${tiered.length}`);
  for (const n of tiered) {
    assert.ok(source.includes(`**${n}**`), `${n} is a tiered trapping holder and must be in the packet`);
  }

  /*
   * The legality claim is the packet's load-bearing statement, so it is checked
   * against the live formats rather than trusted as prose.
   */
  for (const f of Formats.list()) {
    const banned = new Set((f.rules.bannedAbilities || []).map(Dex.toID));
    for (const t of trappers) assert.ok(!banned.has(t), `${t} must be legal in ${f.name}`);
  }
  // Whitespace-tolerant: the generator hard-wraps its prose, so the sentence
  // is split across a line break in the committed document.
  assert.ok(/No\s+trapping\s+ability\s+is\s+banned\s+anywhere/.test(source),
    'the packet must state the verified legality result');
  /*
   * "No verdicts" means no labelled verdict line — `Verdict: Ubers`,
   * `Recommendation: promote`. A first version matched any line *starting* with
   * "verdict", which caught the wrapped continuation of an ordinary sentence,
   * so it was measuring the hard-wrap rather than the content.
   */
  assert.ok(!/^\s*(?:\*\*)?(?:Recommendation|Verdict|Final verdict)(?:\*\*)?\s*:/mi.test(source),
    'the packet must not contain a labelled verdict line');
});

test('the PU evidence packet lists exactly the live PU, ZU and NU rosters', () => {
  /*
   * The bidirectional PU audit packet: PU under review, ZU as the downward bar
   * and NU as the upward one. Pinned for the reason every briefing here is —
   * its reader cannot check it, so an error propagates into every conclusion
   * drawn from it.
   */
  const {Formats} = RedGPT;
  const source = fs.readFileSync(path.join(ROOT, 'docs/PU_FINAL_EVIDENCE.md'), 'utf8');
  const section = (from, to) => {
    const re = new RegExp(`\\n## ${from}\\.[\\s\\S]*?(?=\\n## ${to}\\.)`);
    const m = re.exec(source);
    assert.ok(m, `section ${from} must be present and followed by ${to}`);
    return m[0];
  };
  for (const [from, to, tier] of [['C', 'D', 'PU'], ['D', 'E', 'ZU'], ['E', 'F', 'NU']]) {
    const profiled = [...section(from, to).matchAll(/^\*\*(.+?)\*\* — /gm)].map(m => m[1]);
    const live = Formats.tierRoster(tier).map(e => e.name);
    assert.ok(live.length > 40, `sanity: ${tier} should be substantial, saw ${live.length}`);
    assert.deepStrictEqual([...profiled].sort(), [...live].sort(),
      `section ${from} must name exactly the live ${tier} roster`);
  }

  /*
   * The packet must carry no verdicts. The agent builds evidence; the tier
   * calls are made elsewhere. This is a cheap guard against a future
   * regeneration that starts recommending.
   */
  assert.ok(/This packet contains no recommendations/.test(source),
    'the packet must state that it carries no recommendations');
  assert.ok(!/^\s*(?:\*\*)?(?:Recommendation|Verdict|Final verdict)(?:\*\*)?\s*:/mi.test(source),
    'the packet must not contain a labelled verdict line');
});

test('the RU evidence packet lists exactly the live RU, NU and UU rosters', () => {
  /*
   * The bidirectional RU audit packet. It carries three rosters — RU under
   * review, NU as the downward bar and UU as the upward one — and all three are
   * pinned for the same reason the other briefings are: its reader cannot check
   * it, so any error propagates into every conclusion drawn from it.
   */
  const {Dex, Formats} = RedGPT;
  const source = fs.readFileSync(path.join(ROOT, 'docs/RU_FINAL_EVIDENCE.md'), 'utf8');
  const section = (from, to) => {
    const re = new RegExp(`\\n## ${from}\\.[\\s\\S]*?(?=\\n## ${to}\\.)`);
    const m = re.exec(source);
    assert.ok(m, `section ${from} must be present and followed by ${to}`);
    return m[0];
  };
  for (const [from, to, tier] of [['C', 'D', 'RU'], ['D', 'E', 'NU'], ['E', 'F', 'UU']]) {
    const profiled = [...section(from, to).matchAll(/^\*\*(.+?)\*\* — /gm)].map(m => m[1]);
    const live = Formats.tierRoster(tier).map(e => e.name);
    assert.ok(live.length > 40, `sanity: ${tier} should be substantial, saw ${live.length}`);
    assert.deepStrictEqual([...profiled].sort(), [...live].sort(),
      `section ${from} must name exactly the live ${tier} roster`);
  }

  /*
   * The legality audit is the load-bearing half. Every RU species that could
   * reach a higher-tier forme through an item must be listed AND actually
   * refused by the validator — asserted here against the validator rather than
   * against the document, so the document cannot claim a gate that is not there.
   */
  const legality = section('R', 'S');
  let routes = 0;
  for (const e of Formats.tierRoster('RU')) {
    for (const f of Dex.species(e.id).formeItems || []) {
      if (!f.tier || Formats.tierRank(f.tier) >= Formats.tierRank('RU')) continue;
      routes++;
      assert.ok(legality.includes(f.forme), `${f.forme} is an above-RU forme reachable from ${e.name} and must be listed in section R`);
      const learnset = Dex.learnset(e.id) || [];
      const moves = (Array.isArray(learnset) ? learnset : Object.keys(learnset)).slice(0, 1);
      const set = RedGPT.Pokemon.normalizeSet({species: Dex.species(e.id).name, item: f.item, level: 100, moves});
      const errs = RedGPT.Validation.validateTeam([set], Formats.get('tierru')).errors;
      assert.strictEqual(errs.length, 1,
        `${Dex.species(e.id).name} holding ${f.item} must be refused in RU — it would become ${f.forme} (${f.tier})`);
    }
  }
  assert.ok(routes >= 10, `sanity: RU should have several above-tier forme routes, saw ${routes}`);

  // RU's rules are read live, not assumed to match UU — the packet says so.
  assert.strictEqual(Formats.get('tierru').rules.maxTier, 'RU');
  assert.strictEqual(Formats.get('tierru').rules.tera, false, 'RU must have Tera off');
});

test('the OU briefing lists exactly the live OU roster', () => {
  /*
   * `docs/OU_ROSTER_FOR_TIERING.md` is written for an outside reader (ChatGPT)
   * who has no way to check it, which is precisely why it needs checking here:
   * a tiering brief that quietly disagrees with the game is worse than none,
   * because every conclusion drawn from it inherits the error.
   *
   * Compared by name against `Formats.tierRoster('OU')` — the same call that
   * generated the table — so a tier change anywhere fails this until the doc is
   * regenerated. Only the block between the generated markers is read; the prose
   * around it is deliberately not pinned.
   */
  const {Formats} = RedGPT;
  const source = fs.readFileSync(path.join(ROOT, 'docs/OU_ROSTER_FOR_TIERING.md'), 'utf8');
  const block = /<!-- BEGIN GENERATED ROSTER -->([\s\S]*?)<!-- END GENERATED ROSTER -->/.exec(source);
  assert.ok(block, 'the generated roster block must be present and marked');

  // Table rows only: `| <n> | <Name> | ...`, which excludes the header and the
  // `| --- |` separator without needing to know the column layout.
  const listed = [...block[1].matchAll(/^\| \d+ \| ([^|]+?) \|/gm)].map(m => m[1].trim());
  const live = Formats.tierRoster('OU').map(entry => entry.name);

  assert.ok(live.length > 50, `sanity: the OU roster should be substantial, saw ${live.length}`);
  assert.strictEqual(listed.length, live.length,
    `the doc lists ${listed.length} entries against a live roster of ${live.length}`);
  assert.deepStrictEqual([...listed].sort(), [...live].sort(),
    'the doc and the live roster must name the same Pokémon');

  // The prose states the count in three places; pin the headline one so the
  // tables and the sentence above them cannot drift apart.
  assert.ok(source.includes(`all ${live.length} entries`),
    `the doc's heading should say "all ${live.length} entries"`);
});

test('base Ogerpon is packaged, and it is the route to all three Masks', () => {
  /*
   * Base Ogerpon was **not in the packaged data at all** until 2026-08-16, and
   * the cause was a sprite key, not a decision: the dex calls it plain
   * "Ogerpon" with an empty forme, so the generator asked for `OGERPON` while
   * the artwork indexes as `OGERPON TEAL MASKED`, and it was dropped for "no
   * sprite pair" with both files on disk. The Oricorio-Pa'u shape (§9) one
   * level up.
   *
   * It matters far more than one species, which is why this is pinned rather
   * than filed as cosmetic: base Ogerpon is the *holder* of all three Masks, so
   * without it `FORME_CHANGE_ITEMS` has no base to key on and the whole line
   * has no supported route into a tier format.
   */
  const {Dex, Mechanics, Pokemon} = RedGPT;
  assert.ok(Dex.hasSpecies('ogerpon'), 'base Ogerpon must be packaged');
  const ogerpon = Dex.species('ogerpon');
  assert.ok(ogerpon.front && ogerpon.back, 'and it must have resolved both sprites');
  assert.ok(Dex.allSpecies.some(s => s.id === 'ogerpon'), 'and be selectable');
  assert.strictEqual(ogerpon.tier, 'RU', 'Nat Dex ranks base Ogerpon RU');

  // Each Mask is declared, and produces its own forme from the base.
  const masks = [
    ['hearthflamemask', 'Ogerpon-Hearthflame'],
    ['wellspringmask', 'Ogerpon-Wellspring'],
    ['cornerstonemask', 'Ogerpon-Cornerstone'],
  ];
  for (const [item, forme] of masks) {
    // Spread the entries rather than comparing the object: a table built inside
    // the VM sandbox has a different `Object.prototype`, so `deepStrictEqual`
    // fails on the prototype rather than the contents (§8, the array version of
    // the same trap).
    assert.deepStrictEqual([...Object.entries(Mechanics.FORME_CHANGE_ITEMS[item] || {})],
      [['Ogerpon', forme]], `${item} mapping`);
    const set = Pokemon.normalizeSet({species: 'ogerpon', item, level: 100, moves: ['ivycudgel']});
    assert.strictEqual(Mechanics.heldForme(set)?.name, forme, `${item} produces ${forme}`);
  }

  /*
   * And the base carries all three as `formeItems`, which is what lets a format
   * refuse the *item* rather than the species. A count is asserted because
   * "0 of 0" and "0 of 3" must not read the same way.
   */
  assert.strictEqual((ogerpon.formeItems || []).length, 3, 'all three Masks are recorded on the base');
  assert.deepStrictEqual([...(ogerpon.formeItems || []).map(f => f.tier)], ['OU', 'OU', 'OU'],
    'all three masked formes are OU, so all three Masks are OU-and-above items');
});

test('every Ogerpon Tera forme is transform-only, not just the Ubers one', () => {
  /*
   * The 2026-08-15 decision was that a forme reached only by Terastallizing must
   * not be selectable, because this project turns Tera off in eight of eleven
   * formats. It named two of five. Ogerpon-Teal-Tera was the sharpest miss: it
   * needs no Mask, so it was the only Ogerpon-line entry pickable in RU, and it
   * arrives with Embody Aspect (Teal) for a free +1 Speed — in a format with no
   * Terastallization in it.
   *
   * Asserted over the *generated* set rather than a written list, so a future
   * Tera forme cannot be added upstream and silently ship selectable.
   */
  const {Dex} = RedGPT;
  const teraFormes = Dex.packagedSpecies.filter(s => /-Tera$/.test(s.forme || ''));
  assert.ok(teraFormes.length >= 4, `expected the Ogerpon Tera formes to exist (saw ${teraFormes.length})`);
  const selectable = teraFormes.filter(s => Dex.allSpecies.some(x => x.id === s.id));
  assert.deepStrictEqual([...selectable.map(s => s.name)], [], 'no -Tera forme may be selectable');

  /*
   * Control on the other side: Terapagos-Terastal is deliberately NOT gated,
   * because Terashift really does produce it on entry. A fix that swept every
   * Terastal-sounding forme out of the Team Builder would fail here.
   */
  assert.ok(Dex.allSpecies.some(s => s.id === 'terapagosterastal'),
    'Terapagos-Terastal is an ordinary entry forme and must stay selectable');
});

test('an Ogerpon Mask is refused below OU, while Ogerpon itself is not', () => {
  /*
   * The Absol/Absolite rule applied to the line this was built for: base
   * Ogerpon is RU, every masked forme is OU, so Ogerpon plays down to RU and
   * simply may not wear a Mask there. Carries its control in both directions —
   * the species must stay legal in RU, and the Mask must be allowed in OU.
   */
  const {Formats, Validation, Pokemon} = RedGPT;
  const bare = Pokemon.normalizeSet({species: 'ogerpon', level: 100, moves: ['ivycudgel', 'hornleech', 'swordsdance', 'knockoff']});
  const masked = Pokemon.normalizeSet(Object.assign({}, bare, {item: 'hearthflamemask'}));
  const messages = (result) => (result.errors || []).map(e => e.message || String(e)).join(' ');

  assert.strictEqual(Validation.validateTeam([bare], Formats.get('tierru')).errors.length, 0,
    'base Ogerpon is RU and must be legal there');
  assert.ok(/Hearthflame Mask is banned/.test(messages(Validation.validateTeam([masked], Formats.get('tierru')))),
    'the Mask must be refused in RU');
  assert.strictEqual(Validation.validateTeam([masked], Formats.get('tierou')).errors.length, 0,
    'CONTROL: the same Mask must be legal in OU, where the forme lives');
});

test('there is one Arceus and one Silvally; their formes are held items', () => {
  /*
   * By project decision (2026-08-15). The typed formes are what a Plate or
   * Memory *does*, not a species you pick — shipping 17 of each as selectable
   * said the opposite and then let the item decide anyway, which is how the §8
   * bug happened where a generated Arceus-Water held Leftovers and entered as
   * plain Normal Arceus with a Water moveset.
   */
  const {Dex, Mechanics, Pokemon, Validation} = RedGPT;
  for (const base of ['Arceus', 'Silvally']) {
    const selectable = Dex.allSpecies.filter(s => (s.baseSpecies || s.name) === base);
    assert.deepStrictEqual([...selectable.map(s => s.name)], [base],
      `only the base ${base} should be selectable`);
    // Still packaged, or nothing could transform into them.
    const packaged = Dex.packagedSpecies.filter(s => (s.baseSpecies || s.name) === base);
    assert.ok(packaged.length > 15, `${base}'s formes must stay packaged (saw ${packaged.length})`);
  }

  // The held item is the route, and it resolves to the right forme.
  const set = Pokemon.normalizeSet({species: 'arceus', item: 'splashplate', level: 100, moves: ['judgment']});
  assert.strictEqual(Mechanics.heldForme(set)?.name, 'Arceus-Water', 'the Plate produces the forme');
  assert.strictEqual(Validation.validateTeam({sets: [set]}, 'anythinggoes').errors.length, 0,
    'and the base forme holding it is legal');

  // Picking the forme directly is refused, with the route named.
  const direct = Pokemon.normalizeSet({species: 'arceuswater', level: 100, moves: ['judgment']});
  const error = Validation.validateTeam({sets: [direct]}, 'anythinggoes').errors[0];
  assert.ok(error && /in-battle transformation/.test(error.message), error?.message);
  assert.ok(/Use Arceus instead/.test(error.message), 'the message names the supported route');
});

test('a forme item is banned where its forme is too strong, but the Pokemon is not', () => {
  /*
   * The rule this project chose over uplifting the species: Absol is PU and Mega
   * Absol is RU, so Absol plays in PU and simply may not hold Absolite there.
   * Carries its own control — the same stone must be legal in a tier that can
   * host the Mega — so a version that banned the item everywhere would fail.
   */
  const {Formats, Validation, Pokemon: P} = RedGPT;
  const absol = Formats.speciesPool(Formats.get('tierpu')).find(s => s.id === 'absol');
  assert.ok(absol, 'Absol should still be legal in PU');

  const set = P.normalizeSet({species: 'absol', level: 100, item: 'absolite',
    moves: ['suckerpunch', 'knockoff', 'swordsdance', 'playrough']});
  const banned = Validation.validateTeam([set], Formats.get('tierpu'));
  const messages = (banned.errors || []).map(e => e.message || String(e)).join(' ');
  assert.ok(/Absolite is banned/.test(messages), `expected Absolite to be refused in PU, got: ${messages}`);

  // Control: in RU, where Mega Absol itself lives, the stone must be allowed.
  const allowed = Validation.validateTeam([set], Formats.get('tierru'));
  const okMessages = (allowed.errors || []).map(e => e.message || String(e)).join(' ');
  assert.ok(!/Absolite is banned/.test(okMessages), `Absolite should be legal in RU, got: ${okMessages}`);
});

test('legacy abilities are restored, and appended rather than inserted', () => {
  /*
   * Every ability a species has held since Gen 3, including Dream World hidden
   * abilities later replaced. Gengar keeps Levitate; the Litwick line keeps
   * Shadow Tag.
   */
  const legacyOf = name => Object.entries(Dex.species(name).abilities || {})
    .filter(([slot]) => slot.startsWith('L')).map(([, ability]) => ability);
  assert.ok(legacyOf('Gengar').includes('Levitate'), 'Gengar should keep Levitate');
  assert.ok(legacyOf('Chandelure').includes('Shadow Tag'), 'Chandelure should keep Shadow Tag');
  assert.ok(Dex.hasAbility('Gengar', 'Levitate'), 'and it should be selectable');

  /*
   * CONTROL — slot 0 is load-bearing: a Mega forme takes `abilityList[0]` as
   * its ability, so a legacy entry enumerating first would silently re-ability
   * every Mega in the game. Checked on the species most likely to break.
   */
  const slotZero = {
    Gengar: 'Cursed Body', Arceus: 'Multitype', Silvally: 'RKS System',
    Aegislash: 'Stance Change', Rayquaza: 'Air Lock', Chandelure: 'Flash Fire',
  };
  for (const [name, expected] of Object.entries(slotZero)) {
    assert.strictEqual(Dex.abilityList(name)[0], expected,
      `${name}'s first ability must stay ${expected}`);
  }

  // Every legacy ability must be one the engine actually implements, or it
  // ships as a selectable string that does nothing.
  const legacy = new Set();
  let count = 0;
  for (const species of Dex.packagedSpecies) {
    for (const [slot, ability] of Object.entries(species.abilities || {})) {
      if (!slot.startsWith('L')) continue;
      legacy.add(ability);
      count++;
    }
  }
  assert.ok(count >= 12, `expected a meaningful number of legacy abilities, found ${count}`);
  for (const ability of legacy) {
    assert.ok(Dex.ability(ability), `legacy ability ${ability} is not packaged`);
  }

  /*
   * CONTROL — only species that predate Gen 8. The eleven introduced by
   * Legends: Arceus carry different abilities in the Gen 8 dataset, but that
   * game has no abilities in its battle system and those species were not legal
   * in Sword/Shield, so the earlier values were never usable by anyone. An
   * ability no released battle system ever read was not *removed*.
   *
   * Not Smogon inventions, for the record — Showdown flags its own creations
   * `isNonstandard: 'CAP'` and these are `'Future'`, i.e. official data for a
   * newer generation. The reason to exclude them is reachability, not origin.
   */
  for (const species of Dex.packagedSpecies) {
    const hasLegacy = Object.keys(species.abilities || {}).some(slot => slot.startsWith('L'));
    if (!hasLegacy) continue;
    assert.ok(species.gen < 8,
      `${species.name} was introduced in gen ${species.gen}; its pre-gen-9 abilities were never usable`);
  }
  assert.strictEqual(Dex.species('Growlithe-Hisui').abilities.H, 'Rock Head',
    'a Legends: Arceus species must keep its real Gen 9 hidden ability');
});

test('every team plan declares a Rebirth doctrine that the engine can apply', () => {
  const WEATHERS = new Set(['rain', 'sun', 'sandstorm', 'snow', 'hail']);
  const TERRAINS = new Set(['electric', 'grassy', 'misty', 'psychic']);
  const ROOMS = new Set(['gravity', 'trickroom', 'magicroom', 'wonderroom']);
  const SIDE_CONDITIONS = new Set(['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'tailwind',
    'stealthrock', 'spikes', 'toxicspikes', 'stickyweb']);
  let checked = 0;
  for (const plan of Content.TEAM_PLANS) {
    const doctrine = plan.rebirth;
    assert.ok(doctrine, `${plan.id} has no Rebirth doctrine`);
    assert.ok(doctrine.name && doctrine.blurb, `${plan.id}'s doctrine needs a name and a blurb`);
    if (doctrine.theme) {
      assert.ok(Content.TRAINER_ARCHETYPES.some(a => a.theme === doctrine.theme),
        `${plan.id}'s theme "${doctrine.theme}" matches no trainer archetype, so it would pick a random sprite`);
    }
    const effect = doctrine.effect;
    assert.ok(effect, `${plan.id}'s doctrine has no effect`);
    if (effect.weather) assert.ok(WEATHERS.has(effect.weather), `${plan.id}: unknown weather ${effect.weather}`);
    if (effect.terrain) assert.ok(TERRAINS.has(effect.terrain), `${plan.id}: unknown terrain ${effect.terrain}`);
    for (const key of effect.pseudoWeather || []) assert.ok(ROOMS.has(key), `${plan.id}: unknown room ${key}`);
    for (const table of [effect.own, effect.foe]) {
      for (const key of Object.keys(table || {})) {
        assert.ok(SIDE_CONDITIONS.has(key), `${plan.id}: unknown side condition ${key}`);
      }
    }
    // A doctrine that sets nothing is a plan with no special ability, which is
    // the one thing every Rebirth opponent is promised.
    const sets = !!(effect.weather || effect.terrain || (effect.pseudoWeather || []).length ||
      Object.keys(effect.own || {}).length || Object.keys(effect.foe || {}).length);
    assert.ok(sets, `${plan.id}'s doctrine sets nothing`);
    checked++;
  }
  assert.ok(checked >= 8, `expected 8+ plans, checked ${checked}`);
});

test('every boss declares a team plan, and none of them can delete its own doctrine', () => {
  const WEATHER_MOVES = {sunnyday: 'sun', raindance: 'rain', sandstorm: 'sandstorm',
    snowscape: 'snow', hail: 'hail', chillyreception: 'snow'};
  const TERRAIN_MOVES = {electricterrain: 'electric', grassyterrain: 'grassy',
    mistyterrain: 'misty', psychicterrain: 'psychic'};
  const Abilities = RedGPT.Abilities;
  let checked = 0;
  let weatherBosses = 0;
  for (const boss of [...Content.BOSSES, Content.FINAL_BOSS]) {
    assert.ok(boss.teamPlan, `${boss.id} declares no teamPlan`);
    const plan = Content.TEAM_PLANS.find(p => p.id === boss.teamPlan);
    assert.ok(plan, `${boss.id}'s teamPlan "${boss.teamPlan}" is not a real plan`);
    checked++;
    /*
     * A boss's authored six is used verbatim in Rebirth Mode — it never passes
     * through the draft's conflict strip — so a mismatch here ships as a boss
     * that deletes its own opening field on turn two.
     */
    const effect = plan.rebirth.effect;
    if (!effect.weather && !effect.terrain) continue;
    weatherBosses++;
    for (const member of boss.members) {
      const ability = Abilities.get(member.ability);
      if (effect.weather && ability) {
        assert.ok(!ability.setsPrimalWeather,
          `${boss.id}: ${member.species}'s ${member.ability} locks the weather away from its own ${plan.id} doctrine`);
        assert.ok(!ability.setsWeather || ability.setsWeather === effect.weather,
          `${boss.id}: ${member.species}'s ${member.ability} sets ${ability.setsWeather}, not ${effect.weather}`);
      }
      if (effect.terrain && ability?.setsTerrain) {
        assert.strictEqual(ability.setsTerrain, effect.terrain,
          `${boss.id}: ${member.species}'s ${member.ability} sets the wrong terrain`);
      }
      for (const id of member.moves.map(Dex.toID)) {
        if (effect.weather && WEATHER_MOVES[id]) {
          assert.strictEqual(WEATHER_MOVES[id], effect.weather,
            `${boss.id}: ${member.species} knows ${id}, which replaces its own ${plan.id} doctrine`);
        }
        if (effect.terrain && TERRAIN_MOVES[id]) {
          assert.strictEqual(TERRAIN_MOVES[id], effect.terrain,
            `${boss.id}: ${member.species} knows ${id}, which replaces its own ${plan.id} doctrine`);
        }
      }
    }
  }
  // Denominators: "no conflicts" means nothing if no boss carries a weather or
  // terrain doctrine in the first place.
  assert.ok(checked >= 9, `expected 9+ bosses, checked ${checked}`);
  assert.ok(weatherBosses >= 3, `expected 3+ bosses on a weather/terrain doctrine, checked ${weatherBosses}`);
});

finish();
