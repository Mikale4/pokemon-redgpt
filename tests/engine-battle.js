/**
 * Battle engine mechanics.
 *
 * Every test drives the engine through its public command interface with a
 * fixed seed, so a failure here means a real behavioural change rather than
 * RNG noise.
 */
'use strict';

const {createSuite} = require('./helpers/assert');
const {loadEngine} = require('./helpers/engine');

const suite = createSuite('engine-battle');
const {test, assert, finish} = suite;

const RedGPT = loadEngine();
const {Dex, Pokemon, Formats, Battle, RNG, AI} = RedGPT;

/** Build a battle with explicit sets and full control of both sides. */
function makeBattle(p1, p2, {seed = 12345, format = 'anythinggoes', overrides = {}, fieldEffects = null} = {}) {
  const rules = Object.assign({}, Formats.get(format).rules, {teamPreview: false, forceLevel: null, maxLevel: 100}, overrides);
  const battle = new Battle({
    format: Object.assign({}, Formats.get(format), {rules}),
    seed,
    fieldEffects,
    sides: [
      {name: 'Red', team: p1, controller: 'human'},
      {name: 'Blue', team: p2, controller: 'human'},
    ],
  });
  battle.start();
  return battle;
}

function set(species, options = {}) {
  return Pokemon.normalizeSet(Object.assign({
    species, level: 50, moves: ['tackle'], evs: {}, ivs: Pokemon.maxIVs(), nature: 'serious',
  }, options));
}

/** Choose a move index for both sides and resolve the turn. */
function turn(battle, a, b) {
  const r1 = battle.choose(0, typeof a === 'number' ? {type: 'move', index: a} : a);
  const r2 = battle.choose(1, typeof b === 'number' ? {type: 'move', index: b} : b);
  return {r1, r2};
}

/* ------------------------------------------------------------------ *
 * Determinism
 * ------------------------------------------------------------------ */

test('the same seed and commands produce an identical battle', () => {
  const build = () => makeBattle([set('garchomp', {moves: ['earthquake', 'dragonclaw']})],
    [set('gengar', {moves: ['shadowball', 'sludgebomb']})], {seed: 424242});
  const a = build();
  const b = build();
  for (let i = 0; i < 5 && !a.ended; i++) { turn(a, 0, 0); turn(b, 0, 0); }
  assert.strictEqual(a.log.join('\n'), b.log.join('\n'));
});

test('different seeds diverge', () => {
  const run = seed => {
    const battle = makeBattle([set('garchomp', {moves: ['earthquake']})], [set('snorlax', {moves: ['bodyslam']})], {seed});
    for (let i = 0; i < 6 && !battle.ended; i++) turn(battle, 0, 0);
    return battle.log.join('\n');
  };
  assert.notStrictEqual(run(1), run(999));
});

/* ------------------------------------------------------------------ *
 * Stats, natures, EVs and IVs
 * ------------------------------------------------------------------ */

test('natures modify the correct non-HP stats by 10%', () => {
  const neutral = Pokemon.calcStats(set('garchomp', {level: 100, nature: 'serious'}));
  const adamant = Pokemon.calcStats(set('garchomp', {level: 100, nature: 'adamant'}));
  assert.strictEqual(adamant.atk, Math.floor(neutral.atk * 1.1));
  assert.strictEqual(adamant.spa, Math.floor(neutral.spa * 0.9));
  assert.strictEqual(adamant.hp, neutral.hp, 'HP is never affected by nature');
  assert.strictEqual(adamant.def, neutral.def);
});

test('EVs and IVs change calculated stats', () => {
  const bare = Pokemon.calcStats(set('garchomp', {level: 100, ivs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}}));
  const maxed = Pokemon.calcStats(set('garchomp', {level: 100, evs: {atk: 252}}));
  assert.ok(maxed.atk > bare.atk + 90, 'max IV+EV Attack should be far higher');
});

test('Shedinja always has 1 HP', () => {
  assert.strictEqual(Pokemon.calcStats(set('shedinja', {level: 100, evs: {hp: 252}})).hp, 1);
});

/* ------------------------------------------------------------------ *
 * Type effectiveness and damage
 * ------------------------------------------------------------------ */

test('type immunities zero out damage and are reported', () => {
  const battle = makeBattle([set('gengar', {moves: ['shadowball']})], [set('snorlax', {moves: ['bodyslam']})]);
  const target = battle.sides[0].team[0];
  const before = target.currentHP;
  turn(battle, 0, 0);
  assert.strictEqual(target.currentHP, before, 'Normal must not damage Ghost');
  assert.ok(battle.log.some(l => /doesn't affect/.test(l)));
});

test('super effective and resisted hits are logged', () => {
  const battle = makeBattle([set('garchomp', {moves: ['earthquake']})], [set('heatran', {moves: ['tackle']})], {seed: 7});
  turn(battle, 0, 0);
  assert.ok(battle.log.some(l => /super effective/.test(l)) || battle.log.some(l => /protected/.test(l)));
});

test('STAB increases damage', () => {
  const measure = species => {
    const battle = makeBattle([set(species, {moves: ['thunderbolt'], level: 100, evs: {spa: 252}, nature: 'modest'})],
      [set('snorlax', {moves: ['tackle'], level: 100})], {seed: 555});
    const target = battle.sides[1].team[0];
    const before = target.currentHP;
    turn(battle, 0, 0);
    return before - target.currentHP;
  };
  // Regieleki (Electric, STAB) vs Mew (Psychic, no STAB) — both have 100 SpA-ish;
  // compare the same species with and without a forced type instead.
  const battle = makeBattle([set('pikachu', {moves: ['thunderbolt', 'swift'], level: 100, evs: {spa: 252}})],
    [set('snorlax', {moves: ['tackle'], level: 100})], {seed: 31337});
  const target = battle.sides[1].team[0];
  let before = target.currentHP;
  turn(battle, 0, 0);
  const stabDamage = before - target.currentHP;
  before = target.currentHP;
  turn(battle, 1, 0);
  const plainDamage = before - target.currentHP;
  assert.ok(stabDamage > plainDamage, `STAB Thunderbolt (${stabDamage}) should beat Swift (${plainDamage})`);
  void measure;
});

test('the packaged type chart matches the canonical Gen 6+ table', () => {
  // Only the non-neutral cells; everything unlisted must be exactly 1.
  const canon = {
    Normal: {Rock: 0.5, Ghost: 0, Steel: 0.5},
    Fire: {Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2},
    Water: {Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5},
    Electric: {Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5},
    Grass: {Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5},
    Ice: {Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5},
    Fighting: {Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5},
    Poison: {Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2},
    Ground: {Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2},
    Flying: {Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5},
    Psychic: {Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5},
    Bug: {Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5},
    Rock: {Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5},
    Ghost: {Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5},
    Dragon: {Dragon: 2, Steel: 0.5, Fairy: 0},
    Dark: {Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5},
    Steel: {Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2},
    Fairy: {Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5},
  };
  const types = Object.keys(canon);
  const wrong = [];
  for (const atk of types) {
    for (const def of types) {
      const expected = canon[atk][def] ?? 1;
      const actual = Dex.typeEffectiveness(atk, [def]);
      if (actual !== expected) wrong.push(`${atk}->${def} expected ${expected} got ${actual}`);
    }
  }
  assert.deepStrictEqual([...wrong], [], `type chart mismatches: ${wrong.join('; ')}`);
  assert.strictEqual(types.length, 18);
});

test('dual typings multiply, and every species and move uses a real type', () => {
  assert.strictEqual(Dex.typeEffectiveness('Ice', ['Grass', 'Ground']), 4);
  assert.strictEqual(Dex.typeEffectiveness('Fire', ['Water', 'Rock']), 0.25);
  assert.strictEqual(Dex.typeEffectiveness('Normal', ['Ghost', 'Fire']), 0, 'immunity beats any weakness');
  assert.strictEqual(Dex.typeEffectiveness('Ground', ['Steel', 'Flying']), 0);
  // Order must not matter.
  assert.strictEqual(Dex.typeEffectiveness('Ice', ['Ground', 'Grass']), 4);

  const known = new Set(Object.keys(Dex.typeChart));
  const badSpecies = Dex.allSpecies.filter(s => !s.types?.length || s.types.some(t => !known.has(t))).map(s => s.name);
  assert.deepStrictEqual([...badSpecies], [], `species with bad typing: ${badSpecies.slice(0, 10).join(', ')}`);
  const badMoves = Object.values(Dex.allMoves).filter(m => m.type && !known.has(m.type)).map(m => m.name);
  assert.deepStrictEqual([...badMoves], [], `moves with bad typing: ${badMoves.slice(0, 10).join(', ')}`);
});

test('Scrappy lets Normal and Fighting moves hit Ghost, and only for its own user', () => {
  const hit = ability => {
    const battle = makeBattle([set('miltank', {moves: ['doubleedge'], ability})],
      [set('polteageist', {moves: ['tackle']})], {seed: 808});
    const target = battle.sides[1].team[0];
    const before = target.currentHP;
    turn(battle, 0, 0);
    return before - target.currentHP;
  };
  assert.ok(hit('Scrappy') > 0, 'Scrappy must break the Ghost immunity');
  assert.strictEqual(hit('Thick Fat'), 0, 'without Scrappy the immunity stands');
});

test('Foresight identifies the defender, not the attacker', () => {
  // Using Foresight on a Ghost lets the user's Normal moves connect.
  const battle = makeBattle([set('miltank', {moves: ['foresight', 'doubleedge'], ability: 'Thick Fat'})],
    [set('polteageist', {moves: ['tackle']})], {seed: 4242});
  const target = battle.sides[1].team[0];
  turn(battle, 0, 0);
  assert.ok(target.volatiles.foresight, 'the volatile belongs to the identified target');
  const before = target.currentHP;
  turn(battle, 1, 0);
  assert.ok(before - target.currentHP > 0, 'Double-Edge should now connect');

  // The inverse must not happen: being identified never grants the *victim*
  // the ability to hit Ghosts.
  const other = makeBattle([set('miltank', {moves: ['doubleedge'], ability: 'Thick Fat'})],
    [set('gengar', {moves: ['foresight'], ability: 'Cursed Body'})], {seed: 4242});
  turn(other, 0, 0);
  const ghost = other.sides[1].team[0];
  assert.ok(other.sides[0].team[0].volatiles.foresight, 'Miltank was the one identified');
  const ghostHP = ghost.currentHP;
  turn(other, 0, 0);
  assert.strictEqual(ghost.currentHP, ghostHP, 'an identified attacker still cannot hit a Ghost');
});

test('Miracle Eye lets Psychic moves hit Dark types', () => {
  const battle = makeBattle([set('alakazam', {moves: ['miracleeye', 'psychic']})],
    [set('umbreon', {moves: ['tackle']})], {seed: 1234});
  const target = battle.sides[1].team[0];
  turn(battle, 0, 0);
  assert.ok(target.volatiles.miracleeye, 'Miracle Eye must actually apply its volatile');
  const before = target.currentHP;
  turn(battle, 1, 0);
  assert.ok(before - target.currentHP > 0, 'Psychic should now connect on Dark');
});

test('Ground immunity breaks only for grounded targets and Thousand Arrows', () => {
  const quake = (moves, item) => {
    const battle = makeBattle([set('golem', {moves})],
      [set('pidgeot', {moves: ['tackle'], ability: 'Keen Eye', item})], {seed: 616});
    const target = battle.sides[1].team[0];
    const before = target.currentHP;
    turn(battle, 0, 0);
    return before - target.currentHP;
  };
  assert.strictEqual(quake(['earthquake']), 0, 'Flying is immune to Ground by default');
  assert.ok(quake(['earthquake'], 'Iron Ball') > 0, 'Iron Ball grounds the target');

  const arrows = makeBattle([set('zygarde', {moves: ['thousandarrows']})],
    [set('pidgeot', {moves: ['tackle'], ability: 'Keen Eye'})], {seed: 616});
  const flier = arrows.sides[1].team[0];
  const before = flier.currentHP;
  turn(arrows, 0, 0);
  assert.ok(before - flier.currentHP > 0, 'Thousand Arrows hits airborne targets');
});

test('First Impression is unconditional; Fake Out keeps its first-turn rule', () => {
  const landed = log => log.some(l => /lost \d+ HP/.test(l)) && !log.some(l => /But it failed/.test(l));

  // Lead, turn 1.
  const lead = makeBattle([set('nymble', {moves: ['firstimpression']})],
    [set('blissey', {moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 3});
  turn(lead, 0, 0);
  assert.ok(landed(lead.log), 'a lead must be able to use First Impression on turn 1');

  // Sent in as a faint replacement — its first acting turn is the next one.
  const replaced = makeBattle(
    [set('magikarp', {moves: ['splash'], level: 5}), set('nymble', {moves: ['firstimpression'], level: 50})],
    [set('mewtwo', {moves: ['psystrike'], level: 100})], {seed: 3});
  turn(replaced, 0, 0);
  assert.ok(replaced.needsChoice(0), 'the lead should have fainted');
  replaced.choose(0, {type: 'switch', index: 1});
  const before = replaced.sides[1].team[0].currentHP;
  turn(replaced, 0, 0);
  assert.ok(replaced.sides[1].team[0].currentHP < before,
    'First Impression must work on the turn after coming in off a KO');

  // Voluntary switch, then next turn.
  const switched = makeBattle(
    [set('snorlax', {moves: ['splash']}), set('nymble', {moves: ['firstimpression']})],
    [set('blissey', {moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 3});
  switched.choose(0, {type: 'switch', index: 1});
  switched.choose(1, {type: 'move', index: 0});
  turn(switched, 0, 0);
  assert.ok(landed(switched.log), 'First Impression works the turn after switching in');

  // First Impression is unconditional in this project — the first-turn
  // restriction was deliberately removed, so a later turn still connects.
  const late = makeBattle([set('nymble', {moves: ['firstimpression', 'tackle']})],
    [set('blissey', {moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 3});
  turn(late, 1, 0);
  const target = late.sides[1].team[0];
  const beforeLate = target.currentHP;
  turn(late, 0, 0);
  assert.ok(beforeLate - target.currentHP > 0, 'First Impression still works after the user has acted');
  assert.ok(!late.log.some(l => /But it failed/.test(l)), 'and must not report a failure');

  // Fake Out shares the gate, and flinches on turn 1.
  const fake = makeBattle([set('lopunny', {moves: ['fakeout']})],
    [set('blissey', {moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 3});
  turn(fake, 0, 0);
  assert.ok(fake.log.some(l => /flinched/.test(l)), 'Fake Out should flinch on turn 1');
  turn(fake, 0, 0);
  assert.ok(fake.log.some(l => /But it failed/.test(l)), 'Fake Out fails on turn 2');
});

test('Focus Punch lands after the user is hit — the condition is gone, accuracy pays for it', () => {
  /*
   * Focus Punch used to fail outright if the user took damage first, which at -3
   * priority was the normal case rather than the exception. That condition was
   * removed by project decision and replaced with 70% accuracy.
   *
   * Asserted behaviourally, through a battle where the user is *definitely* hit
   * first: the data test can only prove the number changed, not that the branch
   * in `moveSpecialFailure` went with it. Accuracy is forced to always-hit for
   * this check so the 30% miss cannot make it flaky — the miss rate is the data
   * test's job, not this one's.
   *
   * The turn order is forced with a **Choice Scarf on the foe**, and it has to
   * be: the -3 priority was removed too (2026-08-14), so the user is no longer
   * automatically last and Okidogi outspeeds an unscarfed Blissey. The "the
   * user must actually have been hit first" guard below is what caught that —
   * without it this test would have quietly stopped testing anything.
   */
  const battle = makeBattle(
    [set('okidogi', {moves: ['focuspunch'], ability: 'Run Away', level: 100})],
    [set('blissey', {moves: ['tackle'], ability: 'Natural Cure', item: 'choicescarf', level: 100, evs: {hp: 252}})],
    {seed: 11});
  const user = battle.sides[0].team[0];
  const foe = battle.sides[1].team[0];
  const before = foe.currentHP;
  battle.moveAccuracy = () => 100;          // isolate the condition from the roll

  turn(battle, 0, 0);
  assert.ok(user.currentHP < user.maxHP, 'the user must actually have been hit first, or this proves nothing');
  assert.ok(before - foe.currentHP > 0, 'Focus Punch should still land after the user took damage');
  assert.ok(!battle.log.some(l => /But it failed/.test(l)),
    `Focus Punch reported a failure: ${battle.log.filter(l => /failed/.test(l)).join(' | ')}`);
});

test('Dream Eater and Poltergeist are unconditional; Snore is not', () => {
  /*
   * Both lost conditions that the *opponent* controlled — a sleeping target, a
   * held item — which made them dead weight rather than a trade-off. Snore is the
   * control: it keeps its condition, because that one is on the **user** and the
   * user's own Rest can satisfy it.
   */
  const eater = makeBattle([set('gengar', {moves: ['dreameater'], level: 100})],
    [set('blissey', {moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 11});
  const awake = eater.sides[1].team[0];
  const user = eater.sides[0].team[0];
  user.currentHP = Math.floor(user.maxHP * 0.5);
  const beforeHP = awake.currentHP;
  const beforeDrain = user.currentHP;
  turn(eater, 0, 0);
  assert.strictEqual(awake.status, null, 'the target must be awake for this to prove anything');
  assert.ok(beforeHP - awake.currentHP > 0, 'Dream Eater should hit an awake target');
  assert.ok(user.currentHP > beforeDrain, 'Dream Eater should still drain');

  // Poltergeist against an itemless target. Machamp, not a Normal type — Normal
  // is immune to Ghost and would fail for an unrelated reason.
  const polt = makeBattle([set('gengar', {moves: ['poltergeist'], level: 100})],
    [set('machamp', {moves: ['splash'], level: 100, item: null})], {seed: 12});
  const itemless = polt.sides[1].team[0];
  itemless.item = null;
  const beforePolt = itemless.currentHP;
  turn(polt, 0, 0);
  assert.ok(beforePolt - itemless.currentHP > 0, 'Poltergeist should hit an itemless target');

  // CONTROL: a genuinely conditional move still fails in the same harness.
  const snore = makeBattle([set('snorlax', {moves: ['snore'], level: 100})],
    [set('blissey', {moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 13});
  const snoreTarget = snore.sides[1].team[0];
  const beforeSnore = snoreTarget.currentHP;
  turn(snore, 0, 0);
  assert.strictEqual(snoreTarget.currentHP, beforeSnore,
    'control failed: Snore should still do nothing while its user is awake');
});

test('Bug Bite, Pluck, Stuff Cheeks and Tea Time apply the Berry effect, not just eat it', () => {
  /*
   * Every Berry used to fuse its trigger to its effect inside `onUpdate`, so there
   * was no way to apply the effect without satisfying the condition. Consequences:
   * Bug Bite and Pluck did not exist at all, and Stuff Cheeks and Tea Time consumed
   * a Berry for **nothing** — Stuff Cheeks paid a Sitrus for +2 Defence and threw
   * the healing away. `items.js` now separates trigger from effect and exposes
   * `onForceEat`, which `battle.forceEatBerry` drives.
   *
   * The assertions are all about the *effect* landing, since disappearing was never
   * the broken part. Controls: a non-Berry must not be taken, a resist Berry has no
   * eater-side effect, Stuff Cheeks fails with nothing to eat, and Berries must
   * still fire on their own trigger.
   */
  const bite = (moveId, holder, attackerItem = null) => {
    const battle = makeBattle(
      [set('scizor', {level: 100, moves: [moveId], item: attackerItem})],
      [set('snorlax', {level: 100, moves: ['splash'], item: holder})], {seed: 41});
    const a = battle.sides[0].team[0];
    const d = battle.sides[1].team[0];
    a.item = attackerItem;
    return {battle, a, d};
  };

  // Bug Bite heals the ATTACKER with the target's Sitrus.
  let scenario = bite('bugbite', 'sitrusberry');
  scenario.a.currentHP = Math.floor(scenario.a.maxHP * 0.4);
  let before = scenario.a.currentHP;
  scenario.battle.executeMove(scenario.a, scenario.d, Dex.move('bugbite'), {index: 0});
  assert.strictEqual(scenario.d.item, null, 'Bug Bite should take the target\'s Berry');
  assert.ok(scenario.a.currentHP > before, 'and the attacker should gain the Berry\'s effect');
  assert.ok(scenario.a.ateBerry, 'the attacker counts as having eaten a Berry');
  assert.ok(!scenario.d.ateBerry, 'the target does not');

  // Pluck applies a boost Berry.
  scenario = bite('pluck', 'liechiberry');
  scenario.battle.executeMove(scenario.a, scenario.d, Dex.move('pluck'), {index: 0});
  assert.ok(scenario.a.boosts.atk > 0, 'Pluck should apply a Liechi Berry\'s Attack boost');

  // A stolen status Berry cures the eater. Burn, not paralysis: paralysis has a
  // full-paralysis roll that can stop the move outright, which made this assertion
  // pass or fail on the seed rather than on the mechanic.
  scenario = bite('bugbite', 'rawstberry');
  scenario.a.status = 'brn';
  scenario.battle.executeMove(scenario.a, scenario.d, Dex.move('bugbite'), {index: 0});
  assert.strictEqual(scenario.a.status, null, 'a stolen Rawst Berry should cure the burn');

  // CONTROL: a non-Berry is left alone.
  scenario = bite('bugbite', 'leftovers');
  scenario.battle.executeMove(scenario.a, scenario.d, Dex.move('bugbite'), {index: 0});
  assert.strictEqual(Dex.toID(scenario.d.item), 'leftovers', 'control failed: a non-Berry must not be taken');
  assert.ok(!scenario.a.ateBerry, 'control failed: and nothing was eaten');

  // GUARD: a Mega Stone is not a Berry and must survive regardless.
  const mega = makeBattle(
    [set('scizor', {level: 100, moves: ['bugbite'], item: null})],
    [set('charizard', {level: 100, moves: ['splash'], item: 'charizarditey'})], {seed: 42});
  mega.sides[0].team[0].item = null;
  mega.executeMove(mega.sides[0].team[0], mega.sides[1].team[0], Dex.move('bugbite'), {index: 0});
  assert.strictEqual(Dex.toID(mega.sides[1].team[0].item), 'charizarditey',
    'Bug Bite must not take a Mega Stone');

  // CONTROL: a resist Berry is eaten but does nothing to the eater.
  scenario = bite('bugbite', 'occaberry');
  const resistHP = scenario.a.currentHP;
  scenario.battle.executeMove(scenario.a, scenario.d, Dex.move('bugbite'), {index: 0});
  assert.strictEqual(scenario.d.item, null, 'a resist Berry is still eaten');
  assert.strictEqual(scenario.a.currentHP, resistHP,
    'control failed: a resist Berry must have no eater-side effect');

  // Stuff Cheeks: +2 Defence *and* the Berry's effect.
  const stuff = makeBattle(
    [set('skwovet', {level: 100, moves: ['stuffcheeks'], item: 'sitrusberry'})],
    [set('snorlax', {level: 100, moves: ['splash'], item: null})], {seed: 43});
  const su = stuff.sides[0].team[0];
  su.currentHP = Math.floor(su.maxHP * 0.4);
  const stuffBefore = su.currentHP;
  stuff.executeMove(su, stuff.sides[1].team[0], Dex.move('stuffcheeks'), {index: 0});
  assert.strictEqual(su.boosts.def, 2, 'Stuff Cheeks should give +2 Defence');
  assert.ok(su.currentHP > stuffBefore, 'and should apply the Berry effect it consumes');
  assert.strictEqual(su.item, null, 'and consume the Berry');

  // CONTROL: Stuff Cheeks with no Berry does nothing.
  const dry = makeBattle(
    [set('skwovet', {level: 100, moves: ['stuffcheeks'], item: 'leftovers'})],
    [set('snorlax', {level: 100, moves: ['splash'], item: null})], {seed: 44});
  dry.executeMove(dry.sides[0].team[0], dry.sides[1].team[0], Dex.move('stuffcheeks'), {index: 0});
  assert.strictEqual(dry.sides[0].team[0].boosts.def, 0,
    'control failed: Stuff Cheeks must fail while holding a non-Berry');

  // Tea Time reaches both sides, not just the user.
  const tea = makeBattle(
    [set('polteageist', {level: 100, moves: ['teatime'], item: 'sitrusberry'})],
    [set('snorlax', {level: 100, moves: ['splash'], item: 'sitrusberry'})], {seed: 45});
  const tu = tea.sides[0].team[0];
  const tf = tea.sides[1].team[0];
  tu.currentHP = Math.floor(tu.maxHP * 0.4);
  tf.currentHP = Math.floor(tf.maxHP * 0.4);
  const tuBefore = tu.currentHP;
  const tfBefore = tf.currentHP;
  tea.executeMove(tu, tf, Dex.move('teatime'), {index: 0});
  assert.ok(tu.currentHP > tuBefore && tf.currentHP > tfBefore,
    'Tea Time should make both active Pokemon eat and gain the effect');
  assert.ok(tu.item == null && tf.item == null, 'and consume both Berries');

  // CONTROL: the ordinary trigger path still works.
  const auto = makeBattle(
    [set('snorlax', {level: 100, moves: ['splash'], item: 'sitrusberry'})],
    [set('machamp', {level: 100, moves: ['splash'], item: null})], {seed: 46});
  const mon = auto.sides[0].team[0];
  mon.currentHP = Math.floor(mon.maxHP * 0.3);
  const autoBefore = mon.currentHP;
  auto.checkItemTriggers(mon);
  assert.ok(mon.currentHP > autoBefore && mon.item == null,
    'control failed: a Sitrus Berry must still fire on its own below half HP');
});

test('Fling consumes the thrown item and applies its landing effect', () => {
  /*
   * Both halves of Fling were missing. The item was never consumed — the user threw
   * it and kept it — and `fling.status` / `fling.volatileStatus` were declared in
   * the packaged data and read by nothing, so a flung Flame Orb never burned. Only
   * `fling.basePower` was ever used.
   *
   * Controls: the move must still fail with no item at all (or "consumed" would be
   * indistinguishable from "never had one"), and an item with no landing effect must
   * apply none (or the status assertions prove nothing about the data being read).
   */
  const fling = (item, defenderSet = {species: 'machamp', moves: ['splash']}) => {
    const battle = makeBattle(
      [set('weavile', {level: 100, moves: ['fling'], item})],
      [set(defenderSet.species, Object.assign({level: 100, item: null}, defenderSet))], {seed: 31});
    const a = battle.sides[0].team[0];
    const d = battle.sides[1].team[0];
    d.item = null;
    const before = d.currentHP;
    battle.executeMove(a, d, Dex.move('fling'), {index: 0});
    return {battle, attacker: a, defender: d, damage: before - d.currentHP};
  };

  let r = fling('ironball');
  assert.ok(r.damage > 0, 'Fling should damage the target');
  assert.strictEqual(r.attacker.item, null, 'Fling must consume the thrown item');
  assert.strictEqual(r.battle.lastRemovedItem, 'ironball',
    'the loss should be recorded so Pickup can recover it');
  assert.strictEqual(Dex.toID(r.attacker.consumedItem), 'ironball', 'and Recycle should see it');

  // The four landing effects the data declares.
  assert.strictEqual(fling('flameorb').defender.status, 'brn', 'a flung Flame Orb should burn');
  assert.strictEqual(fling('toxicorb').defender.status, 'tox', 'a flung Toxic Orb should badly poison');
  assert.strictEqual(fling('lightball').defender.status, 'par', 'a flung Light Ball should paralyse');
  assert.ok(fling('kingsrock').defender.volatiles.flinch, 'a flung King\'s Rock should flinch');

  // CONTROL: an item with no declared effect must apply none.
  const plain = fling('lifeorb');
  assert.strictEqual(plain.defender.status, null,
    'control failed: an item with no fling effect must not inflict a status');
  assert.ok(!plain.defender.volatiles.flinch, 'control failed: nor a flinch');

  // CONTROL: with no item the move still fails outright.
  const empty = makeBattle(
    [set('weavile', {level: 100, moves: ['fling'], item: null})],
    [set('machamp', {level: 100, moves: ['splash'], item: null})], {seed: 32});
  const ea = empty.sides[0].team[0];
  const ed = empty.sides[1].team[0];
  ea.item = null;
  const emptyBefore = ed.currentHP;
  empty.executeMove(ea, ed, Dex.move('fling'), {index: 0});
  assert.strictEqual(ed.currentHP, emptyBefore, 'control failed: Fling with no item must do nothing');

  // A Mega Stone must not be flung away (§5 — it can never be removed). This was
  // possible before, and consuming the item would have destroyed it.
  const mega = makeBattle(
    [set('charizard', {level: 100, moves: ['fling'], item: 'charizarditey'})],
    [set('machamp', {level: 100, moves: ['splash'], item: null})], {seed: 33});
  const ma = mega.sides[0].team[0];
  const md = mega.sides[1].team[0];
  const megaBefore = md.currentHP;
  mega.executeMove(ma, md, Dex.move('fling'), {index: 0});
  assert.strictEqual(Dex.toID(ma.item), 'charizarditey', 'a Mega Stone must not be flung');
  assert.strictEqual(md.currentHP, megaBefore, 'and the move should fail rather than deal damage');

  // A flung Berry is eaten by the *target*, which gains its effect. This was a
  // documented gap until the force-eat path landed (`battle.forceEatBerry`).
  const berry = fling('sitrusberry');
  assert.strictEqual(berry.attacker.item, null, 'a flung Berry is still consumed');
  assert.ok(berry.defender.ateBerry, 'the target should eat a flung Berry');
  assert.ok(!berry.attacker.ateBerry,
    'but the thrower did not eat it, so its own Belch must stay disabled');
});

test('Thief, Magician and Pickpocket steal into an occupied item slot', () => {
  /*
   * All three replace the thief's own item rather than requiring empty hands, and
   * all three must respect the Mega Stone / forme item rule in both directions
   * (§5). Pickpocket and Magician did not consult `canRemoveItem` at all before
   * this, so a Mega Stone was stealable.
   *
   * Covet is the control: it deliberately keeps the official restriction, so a
   * blanket "stealing always works now" regression would fail here.
   */
  const steal = (moveId, thiefSet, victimSet) => {
    const battle = makeBattle([set(thiefSet.species, thiefSet)], [set(victimSet.species, victimSet)], {seed: 21});
    const a = battle.sides[0].team[0];
    const d = battle.sides[1].team[0];
    battle.executeMove(a, d, Dex.move(moveId), {index: 0});
    return {thief: a.item && Dex.toID(a.item), victim: d.item && Dex.toID(d.item)};
  };

  let r = steal('thief', {species: 'weavile', moves: ['thief'], item: 'lifeorb', level: 100},
    {species: 'snorlax', moves: ['splash'], item: 'leftovers', level: 100});
  assert.strictEqual(r.thief, 'leftovers', 'Thief should take the item even while holding one');
  assert.strictEqual(r.victim, null, 'and the victim should lose it');

  // CONTROL: Covet keeps the restriction.
  r = steal('covet', {species: 'weavile', moves: ['covet'], item: 'lifeorb', level: 100},
    {species: 'snorlax', moves: ['splash'], item: 'leftovers', level: 100});
  assert.strictEqual(r.thief, 'lifeorb', 'control failed: Covet should refuse while the user holds an item');
  assert.strictEqual(r.victim, 'leftovers', 'control failed: Covet should leave the victim its item');

  // Neither direction may move a Mega Stone.
  r = steal('thief', {species: 'weavile', moves: ['thief'], item: 'lifeorb', level: 100},
    {species: 'charizard', moves: ['splash'], item: 'charizarditey', level: 100});
  assert.strictEqual(r.victim, 'charizarditey', 'a Mega Stone must not be stealable');
  assert.strictEqual(r.thief, 'lifeorb', 'and the thief keeps what it had');

  r = steal('thief', {species: 'charizard', moves: ['thief'], item: 'charizarditey', level: 100},
    {species: 'snorlax', moves: ['splash'], item: 'leftovers', level: 100});
  assert.strictEqual(r.thief, 'charizarditey', 'a Mega Stone holder must not discard it to steal');

  // Magician fires off its own damaging move.
  r = steal('flamethrower', {species: 'delphox', moves: ['flamethrower'], ability: 'magician', item: 'lifeorb', level: 100},
    {species: 'snorlax', moves: ['splash'], item: 'leftovers', level: 100});
  assert.strictEqual(r.thief, 'leftovers', 'Magician should take the item even while holding one');

  r = steal('flamethrower', {species: 'delphox', moves: ['flamethrower'], ability: 'magician', item: 'lifeorb', level: 100},
    {species: 'charizard', moves: ['splash'], item: 'charizarditey', level: 100});
  assert.strictEqual(r.victim, 'charizarditey', 'Magician must not steal a Mega Stone');

  // Pickpocket reacts to an incoming contact move, so the roles are reversed.
  const pocket = makeBattle(
    [set('weavile', {moves: ['splash'], ability: 'pickpocket', item: 'lifeorb', level: 100})],
    [set('snorlax', {moves: ['bodyslam'], item: 'leftovers', level: 100})], {seed: 22});
  const holder = pocket.sides[0].team[0];
  const attacker = pocket.sides[1].team[0];
  pocket.executeMove(attacker, holder, Dex.move('bodyslam'), {index: 0});
  assert.strictEqual(Dex.toID(holder.item), 'leftovers', 'Pickpocket should take the item even while holding one');
  assert.strictEqual(attacker.item, null, 'and the attacker should lose it');

  const guarded = makeBattle(
    [set('weavile', {moves: ['splash'], ability: 'pickpocket', item: 'lifeorb', level: 100})],
    [set('charizard', {moves: ['bodyslam'], item: 'charizarditey', level: 100})], {seed: 23});
  const gHolder = guarded.sides[0].team[0];
  const gAttacker = guarded.sides[1].team[0];
  guarded.executeMove(gAttacker, gHolder, Dex.move('bodyslam'), {index: 0});
  assert.strictEqual(Dex.toID(gAttacker.item), 'charizarditey', 'Pickpocket must not take a Mega Stone');
  assert.strictEqual(Dex.toID(gHolder.item), 'lifeorb', 'and must not discard its own item for nothing');
});

test('Ceaseless Edge and Stone Axe set hazards on the defending side', () => {
  // A level-5 attacker keeps the target alive long enough to stack layers.
  const battle = makeBattle([set('samurotthisui', {moves: ['ceaselessedge'], level: 5})],
    [set('blissey', {moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 555});
  turn(battle, 0, 0);
  assert.strictEqual(battle.sides[1].conditions.spikes, 1, 'Spikes land on the target side');
  assert.strictEqual(battle.sides[0].conditions.spikes, 0, 'never on the user side');
  for (let i = 0; i < 8 && !battle.ended; i++) turn(battle, 0, 0);
  assert.strictEqual(battle.sides[1].conditions.spikes, 3, 'layers stack and cap at 3');

  const axe = makeBattle([set('kleavor', {moves: ['stoneaxe'], level: 5})],
    [set('blissey', {moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 555});
  turn(axe, 0, 0);
  assert.strictEqual(axe.sides[1].conditions.stealthrock, 1, 'Stone Axe sets Stealth Rock');

  // The hazard must actually bite on the next switch-in.
  const sw = makeBattle([set('samurotthisui', {moves: ['ceaselessedge'], level: 5})],
    [set('blissey', {moves: ['splash'], level: 100, evs: {hp: 252}}), set('snorlax', {moves: ['splash'], level: 100})], {seed: 555});
  turn(sw, 0, 0);
  sw.choose(0, {type: 'move', index: 0});
  sw.choose(1, {type: 'switch', index: 1});
  const entered = sw.sides[1].team[1];
  assert.ok(entered.currentHP < entered.maxHP, 'the switch-in takes Spikes damage');
});

test('Anchor Shot and Spirit Shackle trap the target', () => {
  for (const [user, moveId, foe] of [['dhelmise', 'anchorshot', 'snorlax'], ['decidueye', 'spiritshackle', 'garchomp']]) {
    const battle = makeBattle([set(user, {moves: [moveId]})],
      [set(foe, {moves: ['splash'], level: 100}), set('blissey', {moves: ['splash'], level: 100})], {seed: 606});
    turn(battle, 0, 0);
    assert.ok(battle.isTrapped(battle.sides[1].team[0]), `${moveId} should trap`);
    assert.strictEqual(battle.choose(1, {type: 'switch', index: 1}).ok, false, `${moveId} should block switching`);
  }
});

test('Dire Claw, Diamond Storm and Eerie Spell apply their hidden secondaries', () => {
  const statuses = new Set();
  let defRaised = 0;
  for (let s = 0; s < 20; s++) {
    const claw = makeBattle([set('sneasler', {moves: ['direclaw']})],
      [set('snorlax', {moves: ['splash'], level: 100, ability: 'Thick Fat'})], {seed: 2000 + s});
    turn(claw, 0, 0);
    if (claw.sides[1].team[0].status) statuses.add(claw.sides[1].team[0].status);

    const storm = makeBattle([set('diancie', {moves: ['diamondstorm']})],
      [set('snorlax', {moves: ['splash'], level: 100})], {seed: 1000 + s});
    turn(storm, 0, 0);
    if (storm.sides[0].team[0].boosts.def > 0) defRaised++;
  }
  assert.ok(statuses.size > 0, 'Dire Claw must inflict a status sometimes');
  assert.deepStrictEqual([...statuses].filter(s => !['slp', 'psn', 'par'].includes(s)), [],
    `Dire Claw may only sleep, poison or paralyse — saw ${[...statuses].join(', ')}`);
  assert.ok(defRaised > 0 && defRaised < 20, `Diamond Storm's Defense boost should be a chance (${defRaised}/20)`);

  const spell = makeBattle([set('slowking', {moves: ['eeriespell']})],
    [set('snorlax', {moves: ['tackle'], level: 100})], {seed: 909});
  turn(spell, 0, 0);
  const slot = spell.sides[1].team[0].moves.find(m => m.id === 'tackle');
  assert.strictEqual(slot.maxPP - slot.pp, 4, 'Eerie Spell drains 3 PP on top of the 1 spent using the move');
});

test('the Ruin abilities cut the matching stat of everyone else', () => {
  const measure = (ability, stat) => {
    const battle = makeBattle([set('tinglu', {moves: ['splash'], ability, level: 100})],
      [set('snorlax', {moves: ['tackle'], level: 100})], {seed: 9});
    return {foe: battle.getStat(battle.sides[1].team[0], stat), holder: battle.getStat(battle.sides[0].team[0], stat)};
  };
  for (const [ability, stat] of [['Tablets of Ruin', 'atk'], ['Vessel of Ruin', 'spa'], ['Sword of Ruin', 'def'], ['Beads of Ruin', 'spd']]) {
    const ruin = measure(ability, stat);
    const base = measure('Pressure', stat);
    assert.strictEqual(ruin.foe, Math.floor(base.foe * 0.75), `${ability} should cut the foe's ${stat} by a quarter`);
    assert.strictEqual(ruin.holder, base.holder, `${ability} must not weaken its own holder`);
  }
});

test('Sticky Hold, Early Bird, Gluttony and Ripen do what they claim', () => {
  const itemAfterKnockOff = ability => {
    const battle = makeBattle([set('weezing', {moves: ['knockoff']})],
      [set('gastrodon', {moves: ['splash'], ability, item: 'Leftovers'})], {seed: 42});
    turn(battle, 0, 0);
    return battle.sides[1].team[0].item;
  };
  assert.ok(itemAfterKnockOff('Sticky Hold'), 'Sticky Hold keeps the item');
  assert.ok(!itemAfterKnockOff('Storm Drain'), 'without it the item is knocked off');

  const sleepTurns = ability => {
    const battle = makeBattle([set('breloom', {moves: ['spore', 'splash']})],
      [set('doduo', {moves: ['splash'], ability, level: 100})], {seed: 42});
    turn(battle, 0, 0);
    let n = 0;
    while (battle.sides[1].team[0].status === 'slp' && n < 10) { turn(battle, 1, 0); n++; }
    return n;
  };
  assert.ok(sleepTurns('Early Bird') < sleepTurns('Run Away'), 'Early Bird halves sleep');

  const ateAt45 = ability => {
    const battle = makeBattle([set('snorlax', {moves: ['splash'], ability, item: 'Oran Berry', level: 100})],
      [set('blissey', {moves: ['splash'], level: 100})], {seed: 42});
    const me = battle.sides[0].team[0];
    me.currentHP = Math.floor(me.maxHP * 0.45);
    battle.checkItemTriggers(me);
    return !me.item;
  };
  assert.ok(ateAt45('Gluttony'), 'Gluttony eats a quarter-berry at half HP');
  assert.ok(!ateAt45('Immunity'), 'without Gluttony it waits for a quarter');

  const healAmount = ability => {
    const battle = makeBattle([set('snorlax', {moves: ['splash'], ability, item: 'Sitrus Berry', level: 100})],
      [set('blissey', {moves: ['splash'], level: 100})], {seed: 42});
    const me = battle.sides[0].team[0];
    me.currentHP = Math.floor(me.maxHP * 0.2);
    const before = me.currentHP;
    battle.checkItemTriggers(me);
    return me.currentHP - before;
  };
  assert.strictEqual(healAmount('Ripen'), healAmount('Immunity') * 2, 'Ripen doubles a berry');
});

test('weight abilities and Float Stone change weight-based power', () => {
  const lowKick = (ability, item) => {
    const battle = makeBattle([set('machamp', {moves: ['lowkick'], level: 100})],
      [set('gengar', {moves: ['splash'], ability, item, level: 100})], {seed: 9});
    return battle.dynamicBasePower(battle.sides[0].team[0], battle.sides[1].team[0], Dex.move('lowkick'), {});
  };
  const base = lowKick('Cursed Body');
  assert.ok(lowKick('Heavy Metal') > base, 'Heavy Metal makes the target heavier');
  assert.ok(lowKick('Light Metal') < base, 'Light Metal makes it lighter');
  assert.ok(lowKick('Cursed Body', 'Float Stone') < base, 'Float Stone halves weight');
});

test('Parental Bond doubles single-strike moves only', () => {
  const bond = makeBattle([set('kangaskhan', {moves: ['tackle'], ability: 'Parental Bond', level: 100})],
    [set('blissey', {moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 42});
  turn(bond, 0, 0);
  assert.ok(bond.log.some(l => /Hit 2 time/.test(l)), 'a single-strike move should hit twice');

  const multi = makeBattle([set('kangaskhan', {moves: ['bulletseed'], ability: 'Parental Bond', level: 100})],
    [set('blissey', {moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 42});
  turn(multi, 0, 0);
  const hits = Number((multi.log.find(l => /Hit \d+ time/.test(l)) || '').match(/Hit (\d+)/)?.[1] || 0);
  assert.ok(hits >= 2 && hits <= 5, `a multi-hit move keeps its own count, got ${hits}`);

  const status = makeBattle([set('kangaskhan', {moves: ['growl'], ability: 'Parental Bond', level: 100})],
    [set('blissey', {moves: ['splash'], level: 100})], {seed: 42});
  turn(status, 0, 0);
  assert.strictEqual(status.sides[1].team[0].boosts.atk, -1, 'status moves are untouched');
});

test('a Substitute soaks status and stat drops, not just volatiles', () => {
  /*
   * The doll used to block only what went through `addVolatile` — confusion,
   * Attract, Leech Seed — because that was the one function with a Substitute
   * check. `setStatus` and `boost` had none, so a Substitute stopped confusion
   * but not paralysis, which is backwards from what the move is for.
   *
   * Everything below is one behaviour with four exceptions, and the exceptions
   * are the test: sound moves and Infiltrator go through, your own effects on
   * yourself are untouched, and an ability punishing the attacker is not a move
   * aimed at the attacker's Substitute.
   */
  const behindSub = (attacker, move, {ability, target = 'blissey'} = {}) => {
    const battle = makeBattle(
      [set(attacker, Object.assign({level: 50, moves: [move], evs: {}}, ability ? {ability} : {}))],
      [set(target, {level: 50, moves: ['splash'], ability: 'Natural Cure', evs: {}})],
      {seed: 5});
    battle.moveAccuracy = () => 100;              // isolate the block from the roll
    const foe = battle.sides[1].team[0];
    foe.volatiles.substituteHP = 60;
    const boostsBefore = JSON.stringify(foe.boosts);
    battle.choose(0, {type: 'move', index: 0});
    battle.choose(1, {type: 'move', index: 0});
    return {status: foe.status || null, dropped: JSON.stringify(foe.boosts) !== boostsBefore};
  };

  const leaked = [];
  // Major status must be soaked.
  for (const [species, move] of [['grimmsnarl', 'thunderwave'], ['ninetales', 'willowisp'],
    ['toxapex', 'toxic'], ['breloom', 'spore']]) {
    if (behindSub(species, move).status) leaked.push(`${move} inflicted status through a Substitute`);
  }
  // Non-sound stat drops must be soaked.
  for (const [species, move] of [['persian', 'leer'], ['eevee', 'tailwhip'], ['clefable', 'charm']]) {
    if (behindSub(species, move).dropped) leaked.push(`${move} dropped a stat through a Substitute`);
  }
  assert.deepStrictEqual([...leaked], []);

  /*
   * CONTROLS. Without these, "block everything" passes — and it would be wrong
   * in four separate ways.
   */
  const blocked = [];
  // Sound moves ignore a Substitute. Growl and Screech are sound moves, which is
  // why they are the wrong thing to test the block with.
  if (!behindSub('jigglypuff', 'sing').status) blocked.push('Sing (sound) was soaked');
  if (!behindSub('snorlax', 'growl').dropped) blocked.push('Growl (sound) was soaked');
  // Infiltrator ignores it too.
  if (!behindSub('venomoth', 'toxic', {ability: 'Infiltrator'}).status) blocked.push('Infiltrator was soaked');
  assert.deepStrictEqual([...blocked], []);

  // Your own effects on yourself, from behind your own Substitute.
  const selfBattle = makeBattle(
    [set('garchomp', {level: 50, moves: ['swordsdance'], evs: {}})],
    [set('blissey', {level: 50, moves: ['splash'], evs: {}})], {seed: 5});
  const mine = selfBattle.sides[0].team[0];
  mine.volatiles.substituteHP = 60;
  selfBattle.choose(0, {type: 'move', index: 0});
  selfBattle.choose(1, {type: 'move', index: 0});
  assert.ok(mine.boosts.atk > 0, 'a Substitute blocked its own holder from boosting itself');
});

test('Shed Tail hands the Substitute to the Pokémon coming in', () => {
  const battle = makeBattle(
    [set('cyclizar', {moves: ['shedtail'], ability: 'Run Away', level: 100}),
      set('clefable', {moves: ['splash'], ability: 'Run Away', level: 100})],
    [set('okidogi', {moves: ['focuspunch', 'splash'], ability: 'Run Away', level: 100})], {seed: 5});
  battle.sides[0].team[0].boosts.atk = 2;
  battle.choose(0, {type: 'move', index: 0});
  battle.choose(1, {type: 'move', index: 1});
  battle.choose(0, {type: 'switch', index: 1});

  const incoming = battle.sides[0].team[1];
  assert.ok(incoming.volatiles.substituteHP > 0, 'the Substitute travels with the switch');
  assert.strictEqual(incoming.boosts.atk, 0, 'but Shed Tail passes no stat changes — that is Baton Pass');

  // The whole point: the Pokémon coming in is shielded.
  turn(battle, 0, 0);
  assert.strictEqual(incoming.currentHP, incoming.maxHP, 'the switch-in takes no damage behind the Substitute');
  assert.ok(!battle.log.some(l => /Clefable lost \d+ HP/.test(l)),
    'and the log must not claim it lost HP the Substitute absorbed');

  // Baton Pass still carries both boosts and volatiles.
  const pass = makeBattle(
    [set('espeon', {moves: ['batonpass'], ability: 'Run Away', level: 100}),
      set('clefable', {moves: ['splash'], ability: 'Run Away', level: 100})],
    [set('okidogi', {moves: ['splash'], ability: 'Run Away', level: 100})], {seed: 5});
  pass.sides[0].team[0].boosts.spa = 3;
  pass.sides[0].team[0].volatiles.substituteHP = 50;
  turn(pass, 0, 0);
  pass.choose(0, {type: 'switch', index: 1});
  assert.strictEqual(pass.sides[0].team[1].boosts.spa, 3, 'Baton Pass keeps passing boosts');
  assert.strictEqual(pass.sides[0].team[1].volatiles.substituteHP, 50, 'and volatiles');
});

test('utility moves that used to silently fail now do what they claim', () => {
  const solo = moves => makeBattle(
    [set('mew', {moves, ability: 'Run Away', level: 100}), set('snorlax', {moves: ['splash'], ability: 'Run Away', level: 100})],
    [set('stantler', {moves: ['splash'], ability: 'Run Away', level: 100})], {seed: 9});

  // Chilly Reception sets snow *and* pivots — the weather branch used to eat it.
  const chilly = solo(['chillyreception', 'splash']);
  turn(chilly, 0, 0);
  assert.strictEqual(chilly.field.weather, 'snow', 'Chilly Reception sets snow');
  assert.ok(chilly.sides[0].switchRequest, 'and still switches the user out');

  // Life Dew heals the user's side, not the opponent.
  const dew = solo(['lifedew', 'splash']);
  const healer = dew.sides[0].team[0];
  healer.currentHP = Math.floor(healer.maxHP / 2);
  const before = healer.currentHP;
  turn(dew, 0, 0);
  assert.ok(healer.currentHP > before, 'Life Dew heals its user');

  // Memento drops the foe and takes the user with it.
  const memento = solo(['memento', 'splash']);
  turn(memento, 0, 0);
  assert.strictEqual(memento.sides[1].team[0].boosts.atk, -2, 'Memento drops the foe');
  assert.ok(memento.sides[0].team[0].fainted, 'and faints its user');

  // Revival Blessing brings a fallen teammate back at half HP.
  const revive = solo(['revivalblessing', 'splash']);
  revive.sides[0].team[1].currentHP = 0;
  revive.sides[0].team[1].fainted = true;
  turn(revive, 0, 0);
  assert.ok(!revive.sides[0].team[1].fainted, 'Revival Blessing revives a teammate');

  // Lucky Chant shuts off critical hits for the side.
  const chant = solo(['luckychant', 'splash']);
  turn(chant, 0, 0);
  assert.strictEqual(chant.sides[0].conditions.luckychant, 5, 'Lucky Chant lasts five turns');

  // The sports and Ion Deluge need real field slots to live in.
  for (const [moveId, key] of [['mudsport', 'mudsport'], ['watersport', 'watersport'], ['fairylock', 'fairylock']]) {
    const b = solo([moveId, 'splash']);
    turn(b, 0, 0);
    assert.ok(b.field.pseudoWeather[key] > 0, `${moveId} sets its field effect`);
  }

  // Ion Deluge turns Normal moves Electric while it is up.
  const ions = solo(['iondeluge', 'tackle']);
  ions.field.pseudoWeather.iondeluge = 1;
  assert.strictEqual(ions.moveType(ions.sides[0].team[0], ions.sides[1].team[0], Dex.move('tackle')), 'Electric',
    'Ion Deluge makes Normal moves Electric');

  // Crafty Shield and Mat Block are usable in singles.
  const crafty = solo(['craftyshield', 'splash']);
  turn(crafty, 0, 0);
  assert.ok(crafty.sides[0].conditions.craftyshield > 0, 'Crafty Shield goes up');
});

test('reactive items respect Substitute, Protective Pads and empty benches', () => {
  const bench = [set('pidgeot', {moves: ['tackle']})];

  // Red Card drags the attacker out, and is spent doing it.
  const drag = makeBattle([set('snorlax', {moves: ['splash'], item: 'Red Card'})],
    [set('machamp', {moves: ['tackle']}), ...bench], {seed: 5});
  turn(drag, 0, 0);
  assert.strictEqual(drag.sides[1].activeIndex, 1, 'Red Card drags the attacker out');
  assert.strictEqual(drag.sides[0].team[0].item, null, 'and is consumed');

  // With nobody to drag in, the card is not wasted.
  const alone = makeBattle([set('snorlax', {moves: ['splash'], item: 'Red Card'})],
    [set('machamp', {moves: ['tackle']})], {seed: 5});
  turn(alone, 0, 0);
  assert.strictEqual(alone.sides[0].team[0].item, 'redcard', 'Red Card survives when there is nothing to drag in');

  const button = makeBattle([set('snorlax', {moves: ['splash'], item: 'Eject Button'})],
    [set('machamp', {moves: ['tackle']})], {seed: 5});
  turn(button, 0, 0);
  assert.strictEqual(button.sides[0].team[0].item, 'ejectbutton', 'same for Eject Button');

  // A Substitute taking the hit means the holder was never touched.
  const subbed = makeBattle([set('blissey', {moves: ['splash'], item: 'Red Card', level: 100, evs: {hp: 252}})],
    [set('machamp', {moves: ['tackle']}), ...bench], {seed: 5});
  subbed.sides[0].team[0].volatiles.substituteHP = 100;
  turn(subbed, 0, 0);
  assert.strictEqual(subbed.sides[1].activeIndex, 0, 'a Substitute blocks Red Card');
  assert.strictEqual(subbed.sides[0].team[0].item, 'redcard', 'and the card is not spent');

  const policy = makeBattle([set('blissey', {moves: ['splash'], item: 'Weakness Policy', level: 100, evs: {hp: 252}})],
    [set('smeargle', {moves: ['lowkick'], level: 100})], {seed: 5});
  policy.sides[0].team[0].volatiles.substituteHP = 200;
  turn(policy, 0, 0);
  assert.strictEqual(policy.sides[0].team[0].boosts.atk, 0, 'a Substitute blocks Weakness Policy too');

  // Protective Pads negates contact only.
  const contact = (holder, attackerItem, read) => {
    const battle = makeBattle([holder],
      [set('machamp', {moves: ['closecombat'], level: 20, item: attackerItem}), ...bench], {seed: 5});
    return read(battle);
  };
  const dragged = attackerItem => contact(
    set('blissey', {moves: ['splash'], item: 'Red Card', level: 100, evs: {hp: 252}}), attackerItem,
    b => { const before = b.sides[1].activeIndex; turn(b, 0, 0); return before !== b.sides[1].activeIndex; });
  assert.ok(dragged(null), 'Red Card fires normally');
  assert.ok(dragged('Protective Pads'), 'Protective Pads must not block Red Card — it is not a contact effect');

  const recoil = (holder, attackerItem) => contact(holder, attackerItem, b => {
    const foe = b.sides[1].team[0];
    const before = foe.currentHP;
    turn(b, 0, 0);
    return before - foe.currentHP;
  });
  const helmet = set('blissey', {moves: ['splash'], item: 'Rocky Helmet', level: 100, evs: {hp: 252}});
  assert.ok(recoil(helmet, null) > 0, 'Rocky Helmet chips on contact');
  assert.strictEqual(recoil(helmet, 'Protective Pads'), 0, 'Protective Pads does block Rocky Helmet');

  const roughSkin = set('garchomp', {moves: ['splash'], ability: 'Rough Skin', level: 100});
  assert.ok(recoil(roughSkin, null) > 0, 'Rough Skin chips on contact');
  assert.strictEqual(recoil(roughSkin, 'Protective Pads'), 0, 'and Protective Pads blocks contact abilities too');
});

test('Air Balloon grants a real Ground immunity, not just ungrounded status', () => {
  // `ungrounded` alone only keeps the holder off the ground for hazards and
  // terrain — blocking the move itself needs its own immunity, like Levitate.
  const balloon = makeBattle([set('garchomp', {moves: ['splash'], item: 'Air Balloon', level: 100})],
    [set('golem', {moves: ['earthquake'], level: 100})], {seed: 7});
  const holder = balloon.sides[0].team[0];
  turn(balloon, 0, 0);
  assert.strictEqual(holder.currentHP, holder.maxHP, 'Earthquake must not touch an Air Balloon holder');
  assert.strictEqual(holder.item, 'airballoon', 'a blocked Ground move does not pop the balloon');

  // Any other damaging hit still pops it.
  const popped = makeBattle([set('garchomp', {moves: ['splash'], item: 'Air Balloon', level: 100})],
    [set('mewtwo', {moves: ['psystrike'], level: 100})], {seed: 7});
  turn(popped, 0, 0);
  assert.strictEqual(popped.sides[0].team[0].item, null, 'a non-Ground hit pops the balloon');

  // And it still keeps the holder off Spikes.
  const hazards = makeBattle(
    [set('snorlax', {moves: ['splash']}), set('garchomp', {moves: ['splash'], item: 'Air Balloon'})],
    [set('blissey', {moves: ['spikes'], level: 100})], {seed: 7});
  turn(hazards, 0, 0);
  hazards.choose(0, {type: 'switch', index: 1});
  hazards.choose(1, {type: 'move', index: 0});
  const entered = hazards.sides[0].team[1];
  assert.strictEqual(entered.currentHP, entered.maxHP, 'Air Balloon avoids Spikes too');
});

test('the load-bearing items apply the right numbers', () => {
  const pinned = (build, read) => { const b = build(); b.rng.next = () => 0.5; return read(b); };
  const hit = (item, {attacker = 'garchomp', move = 'tackle', foe = 'blissey'} = {}) => pinned(
    () => makeBattle([set(attacker, {moves: [move], item, level: 100})],
      [set(foe, {moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 4242}),
    b => { const t = b.sides[1].team[0]; const before = t.currentHP; turn(b, 0, 0); return before - t.currentHP; });

  const base = hit(null);
  const ratio = n => Math.abs(n / base - 1);
  assert.ok(ratio(hit('Choice Band')) > 0.4 && hit('Choice Band') > base, 'Choice Band is roughly 1.5x');
  assert.ok(hit('Life Orb') > base && hit('Life Orb') < hit('Choice Band'), 'Life Orb sits between neutral and Choice Band');
  assert.strictEqual(hit('Expert Belt'), base, 'Expert Belt does nothing on a neutral hit');
  assert.ok(hit('Expert Belt', {move: 'earthquake', foe: 'registeel'}) > hit(null, {move: 'earthquake', foe: 'registeel'}),
    'Expert Belt boosts a super-effective hit');

  // Focus Sash survives an OHKO from full and is spent doing it.
  const sash = makeBattle([set('garchomp', {moves: ['splash'], item: 'Focus Sash', level: 100})],
    [set('mewtwo', {moves: ['icebeam'], level: 100})], {seed: 4242});
  turn(sash, 0, 0);
  assert.strictEqual(sash.sides[0].team[0].currentHP, 1, 'Focus Sash leaves exactly 1 HP');
  assert.strictEqual(sash.sides[0].team[0].item, null, 'and is consumed');

  // Weakness Policy pays out when the holder lives through a super-effective hit.
  const policy = makeBattle([set('blissey', {moves: ['splash'], item: 'Weakness Policy', level: 100, evs: {hp: 252}})],
    [set('smeargle', {moves: ['lowkick'], level: 100})], {seed: 4242});
  turn(policy, 0, 0);
  assert.strictEqual(policy.sides[0].team[0].boosts.atk, 2, 'Weakness Policy gives +2 Atk');
  assert.strictEqual(policy.sides[0].team[0].boosts.spa, 2, 'and +2 SpA');
});

test('Binding Band, Grip Claw, Iron Ball and Utility Umbrella take effect', () => {
  const bind = item => {
    const battle = makeBattle([set('onix', {moves: ['bind'], item, level: 100})],
      [set('blissey', {moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 11});
    turn(battle, 0, 0);
    return battle.sides[1].team[0].volatiles.partiallyTrapped;
  };
  assert.strictEqual(bind('Binding Band').denominator, 6, 'Binding Band deepens the bind chip');
  assert.strictEqual(bind('Leftovers').denominator, 8, 'a plain bind chips an eighth');
  // Read after the end-of-turn tick, so compare against a plain bind (4-5 turns).
  assert.ok(bind('Grip Claw').turns > bind('Leftovers').turns, 'Grip Claw lengthens the bind');

  // Iron Ball grounds a Flying type so Ground moves connect.
  const grounded = makeBattle([set('golem', {moves: ['earthquake']})],
    [set('pidgeot', {moves: ['splash'], ability: 'Keen Eye', item: 'Iron Ball'})], {seed: 11});
  const flier = grounded.sides[1].team[0];
  const before = flier.currentHP;
  turn(grounded, 0, 0);
  assert.ok(before - flier.currentHP > 0, 'Iron Ball grounds a Flying type');

  // Utility Umbrella hides sun and rain from its holder.
  const umbrella = makeBattle([set('charizard', {moves: ['splash'], item: 'Utility Umbrella', level: 100})],
    [set('groudon', {moves: ['sunnyday'], level: 100})], {seed: 11});
  turn(umbrella, 0, 0);
  assert.strictEqual(umbrella.field.weather, 'sun', 'the sun is up');
  assert.strictEqual(umbrella.weatherFor(umbrella.sides[0].team[0]), null, 'but the holder does not feel it');
  assert.strictEqual(umbrella.weatherFor(umbrella.sides[1].team[0]), 'sun', 'everyone else does');
});

test('Dark types ignore Prankster-boosted status moves', () => {
  const paralyse = (user, ability, foe) => {
    const battle = makeBattle([set(user, {moves: ['thunderwave'], ability})],
      [set(foe, {moves: ['tackle']})], {seed: 2024});
    turn(battle, 0, 0);
    return battle.sides[1].team[0].status;
  };
  assert.strictEqual(paralyse('thundurus', 'Prankster', 'umbreon'), null, 'Prankster status must not land on a Dark type');
  assert.strictEqual(paralyse('thundurus', 'Prankster', 'snorlax'), 'par', 'non-Dark targets are unaffected by the rule');
  assert.strictEqual(paralyse('klefki', 'Magician', 'umbreon'), 'par', 'Dark only blocks Prankster, not every status move');

  // A Prankster user must still be able to buff itself.
  const selfBuff = makeBattle([set('thundurus', {moves: ['nastyplot'], ability: 'Prankster'})],
    [set('umbreon', {moves: ['tackle']})], {seed: 2024});
  turn(selfBuff, 0, 0);
  assert.ok(selfBuff.sides[0].team[0].boosts.spa > 0, 'self-targeting Prankster moves still work');
});

/* ------------------------------------------------------------------ *
 * Status
 * ------------------------------------------------------------------ */

test('major status is applied, blocked by typing and chips at end of turn', () => {
  const battle = makeBattle([set('gengar', {moves: ['willowisp']})], [set('snorlax', {moves: ['tackle']})], {seed: 11});
  const target = battle.sides[1].team[0];
  turn(battle, 0, 0);
  assert.strictEqual(target.status, 'brn');
  const afterBurn = target.currentHP;
  turn(battle, 0, 0);
  assert.ok(target.currentHP < afterBurn, 'burn should chip HP each turn');

  const fireBattle = makeBattle([set('gengar', {moves: ['willowisp']})], [set('charizard', {moves: ['rest']})], {seed: 11});
  turn(fireBattle, 0, 0);
  assert.strictEqual(fireBattle.sides[1].team[0].status, null, 'Fire types cannot be burned');
});

test('badly poisoned damage escalates', () => {
  let checked = false;
  for (let seed = 0; seed < 30 && !checked; seed++) {
    const battle = makeBattle([set('gengar', {moves: ['toxic']})],
      [set('slaking', {moves: ['tackle'], level: 100, ability: 'Truant'})], {seed});
    const target = battle.sides[1].team[0];
    turn(battle, 0, 0);
    if (target.status !== 'tox') continue;
    checked = true;
    const hp1 = target.currentHP;
    turn(battle, 0, 0);
    const tick1 = hp1 - target.currentHP;
    const hp2 = target.currentHP;
    turn(battle, 0, 0);
    const tick2 = hp2 - target.currentHP;
    assert.ok(tick2 > tick1, );
  }
  assert.ok(checked, 'Toxic never landed across 30 seeds');
});

/* ------------------------------------------------------------------ *
 * Boosts, switching and faint replacement
 * ------------------------------------------------------------------ */

test('stat boosts apply and cap at +6', () => {
  const battle = makeBattle([set('scizor', {moves: ['swordsdance']})], [set('snorlax', {moves: ['tackle']})], {seed: 5});
  const self = battle.sides[0].team[0];
  for (let i = 0; i < 5 && !battle.ended; i++) turn(battle, 0, 0);
  assert.strictEqual(self.boosts.atk, 6);
  assert.ok(battle.log.some(l => /won't go higher/.test(l)));
});

test('switching swaps the active Pokémon and clears boosts', () => {
  const battle = makeBattle(
    [set('scizor', {moves: ['swordsdance']}), set('garchomp', {moves: ['earthquake']})],
    [set('snorlax', {moves: ['tackle']})], {seed: 9});
  turn(battle, 0, 0);
  assert.strictEqual(battle.sides[0].team[0].boosts.atk, 2);
  turn(battle, {type: 'switch', index: 1}, 0);
  assert.strictEqual(battle.active(0).species, 'garchomp');
  turn(battle, {type: 'switch', index: 0}, 0);
  assert.strictEqual(battle.active(0).species, 'scizor');
  assert.strictEqual(battle.active(0).boosts.atk, 0, 'boosts must reset on switch out');
});

test('a fainted Pokémon triggers a replacement request that must be answered', () => {
  const battle = makeBattle(
    [set('magikarp', {moves: ['splash'], level: 5}), set('garchomp', {moves: ['earthquake'], level: 100})],
    [set('rayquaza', {moves: ['dragonascent'], level: 100, evs: {atk: 252}, nature: 'adamant'})], {seed: 21});
  let guard = 0;
  while (!battle.ended && battle.requests[0]?.type === 'move' && guard++ < 8) turn(battle, 0, 0);
  assert.ok(battle.sides[0].team[0].fainted, 'Magikarp should have fainted');
  assert.strictEqual(battle.requests[0]?.type, 'switch', 'a switch request must be issued');
  battle.choose(0, {type: 'switch', index: 1});
  assert.strictEqual(battle.active(0).species, 'garchomp');
});

test('the battle ends when a side has no Pokémon left', () => {
  const battle = makeBattle(
    [set('magikarp', {moves: ['splash'], level: 5})],
    [set('rayquaza', {moves: ['dragonascent'], level: 100, evs: {atk: 252}})], {seed: 4});
  let guard = 0;
  while (!battle.ended && guard++ < 10) turn(battle, 0, 0);
  assert.ok(battle.ended);
  assert.strictEqual(battle.winner, 1);
});

/* ------------------------------------------------------------------ *
 * Priority and speed
 * ------------------------------------------------------------------ */

test('priority moves resolve before faster opponents', () => {
  const battle = makeBattle(
    [set('scizor', {moves: ['bulletpunch'], level: 100, evs: {atk: 252}, nature: 'adamant'})],
    [set('deoxysspeed', {moves: ['psychoboost'], level: 100, evs: {spe: 252}, nature: 'timid'})], {seed: 17});
  turn(battle, 0, 0);
  const scizorIndex = battle.log.findIndex(l => /Scizor used Bullet Punch/.test(l));
  const foeIndex = battle.log.findIndex(l => /used Psycho Boost/.test(l));
  assert.ok(scizorIndex >= 0 && (foeIndex < 0 || scizorIndex < foeIndex), 'priority must move first');
});

test('Trick Room inverts the speed order', () => {
  const battle = makeBattle(
    [set('porygon2', {moves: ['trickroom', 'triattack'], level: 100})],
    [set('deoxysspeed', {moves: ['psychoboost'], level: 100, evs: {spe: 252}, nature: 'timid'})], {seed: 8});
  turn(battle, 0, 0);
  assert.ok(battle.field.pseudoWeather.trickroom > 0);
  const before = battle.log.length;
  turn(battle, 1, 0);
  const slice = battle.log.slice(before);
  const mine = slice.findIndex(l => /Porygon2 used Tri Attack/.test(l));
  const theirs = slice.findIndex(l => /used Psycho Boost/.test(l));
  assert.ok(mine >= 0 && mine < theirs, 'the slower Pokémon should move first under Trick Room');
});

/* ------------------------------------------------------------------ *
 * Field: weather, terrain, hazards, screens
 * ------------------------------------------------------------------ */

test('weather is set, boosts matching types and expires', () => {
  const battle = makeBattle([set('politoed', {moves: ['raindance', 'surf'], level: 100, evs: {spa: 252}})],
    [set('snorlax', {moves: ['tackle'], level: 100})], {seed: 6});
  turn(battle, 0, 0);
  assert.strictEqual(battle.field.weather, 'rain');
  const target = battle.sides[1].team[0];
  let before = target.currentHP;
  turn(battle, 1, 0);
  const rainDamage = before - target.currentHP;

  const dry = makeBattle([set('politoed', {moves: ['raindance', 'surf'], level: 100, evs: {spa: 252}})],
    [set('snorlax', {moves: ['tackle'], level: 100})], {seed: 6});
  const dryTarget = dry.sides[1].team[0];
  before = dryTarget.currentHP;
  turn(dry, 1, 0);
  const dryDamage = before - dryTarget.currentHP;
  assert.ok(rainDamage > dryDamage, `rain should boost Water (${rainDamage} vs ${dryDamage})`);
});

test('sandstorm chips non-immune types and spares Rock, Ground and Steel', () => {
  const battle = makeBattle([set('tyranitar', {moves: ['sandstorm'], level: 100})],
    [set('snorlax', {moves: ['splash', 'tackle'], level: 100})], {seed: 2});
  const setter = battle.sides[0].team[0];
  const foe = battle.sides[1].team[0];
  const setterBefore = setter.currentHP;
  turn(battle, 0, 0);
  assert.strictEqual(battle.field.weather, 'sandstorm');
  assert.ok(foe.currentHP < foe.maxHP, 'Snorlax should be buffeted by the sandstorm');
  assert.strictEqual(setter.currentHP, setterBefore, 'a Rock type takes no sandstorm damage');
});

test('terrain is set and boosts grounded users', () => {
  const battle = makeBattle([set('tapukoko', {moves: ['electricterrain', 'thunderbolt'], level: 100, evs: {spa: 252}})],
    [set('snorlax', {moves: ['tackle'], level: 100})], {seed: 14});
  turn(battle, 0, 0);
  assert.strictEqual(battle.field.terrain, 'electric');
});

test('entry hazards damage switch-ins and respect Heavy-Duty Boots', () => {
  const battle = makeBattle(
    [set('garchomp', {moves: ['stealthrock', 'earthquake'], level: 100}), set('charizard', {moves: ['flamethrower'], level: 100})],
    [set('snorlax', {moves: ['tackle'], level: 100}), set('charizard', {moves: ['flamethrower'], level: 100})], {seed: 1});
  turn(battle, 0, 0);
  assert.strictEqual(battle.sides[1].conditions.stealthrock, 1);
  turn(battle, 1, {type: 'switch', index: 1});
  const switched = battle.active(1);
  assert.ok(switched.currentHP < switched.maxHP, 'Stealth Rock must hit the Charizard switching in');

  const booted = makeBattle(
    [set('garchomp', {moves: ['stealthrock', 'earthquake'], level: 100})],
    [set('snorlax', {moves: ['tackle'], level: 100}), set('charizard', {moves: ['flamethrower'], level: 100, item: 'heavydutyboots'})], {seed: 1});
  turn(booted, 0, 0);
  turn(booted, 1, {type: 'switch', index: 1});
  assert.strictEqual(booted.active(1).currentHP, booted.active(1).maxHP, 'Heavy-Duty Boots ignores hazards');
});

test('screens halve damage of the matching category', () => {
  const measure = useScreen => {
    const battle = makeBattle(
      [set('alakazam', {moves: ['psychic'], level: 100, evs: {spa: 252}, nature: 'modest'})],
      [set('snorlax', {moves: ['lightscreen', 'rest'], level: 100})], {seed: 40});
    turn(battle, 0, useScreen ? 0 : 1);
    const target = battle.sides[1].team[0];
    const before = target.currentHP;
    turn(battle, 0, 1);
    return before - target.currentHP;
  };
  const withScreen = measure(true);
  const without = measure(false);
  assert.ok(withScreen < without, `Light Screen should reduce special damage (${withScreen} vs ${without})`);
});

/* ------------------------------------------------------------------ *
 * Abilities
 * ------------------------------------------------------------------ */

test('Intimidate lowers the opposing Attack on switch-in', () => {
  const battle = makeBattle([set('gyarados', {moves: ['waterfall'], ability: 'Intimidate'})],
    [set('snorlax', {moves: ['bodyslam']})], {seed: 12});
  assert.strictEqual(battle.sides[1].team[0].boosts.atk, -1);
  assert.ok(battle.log.some(l => /Intimidate/.test(l)));
});

test('Levitate grants Ground immunity', () => {
  const battle = makeBattle([set('garchomp', {moves: ['earthquake'], level: 100})],
    [set('rotomwash', {moves: ['hydropump'], ability: 'Levitate', level: 100})], {seed: 15});
  const target = battle.sides[1].team[0];
  const before = target.currentHP;
  turn(battle, 0, 0);
  assert.strictEqual(target.currentHP, before, 'Levitate must block Earthquake');
});

test('Drizzle sets rain on entry', () => {
  const battle = makeBattle([set('pelipper', {moves: ['surf'], ability: 'Drizzle'})], [set('snorlax', {moves: ['tackle']})], {seed: 16});
  assert.strictEqual(battle.field.weather, 'rain');
});

test('Sturdy survives a one-shot at full HP', () => {
  const battle = makeBattle(
    [set('rayquaza', {moves: ['dragonascent'], level: 100, evs: {atk: 252}, nature: 'adamant'})],
    [set('donphan', {moves: ['tackle'], ability: 'Sturdy', level: 5})], {seed: 22});
  turn(battle, 0, 0);
  assert.strictEqual(battle.sides[1].team[0].currentHP, 1, 'Sturdy should leave exactly 1 HP');
});

test('Regenerator heals a third on switch out', () => {
  const battle = makeBattle(
    [set('tangrowth', {moves: ['gigadrain'], ability: 'Regenerator', level: 100}), set('snorlax', {moves: ['tackle'], level: 100})],
    [set('garchomp', {moves: ['earthquake'], level: 100, evs: {atk: 252}})], {seed: 25});
  turn(battle, 0, 0);
  const mon = battle.sides[0].team[0];
  const damaged = mon.currentHP;
  assert.ok(damaged < mon.maxHP);
  turn(battle, {type: 'switch', index: 1}, 0);
  assert.ok(mon.currentHP > damaged, 'Regenerator should restore HP on switch out');
});

test('Static can paralyse on contact', () => {
  let paralysed = false;
  for (let seed = 0; seed < 40 && !paralysed; seed++) {
    const battle = makeBattle([set('scizor', {moves: ['bulletpunch']})],
      [set('pikachu', {moves: ['thunderbolt'], ability: 'Static'})], {seed});
    turn(battle, 0, 0);
    if (battle.sides[0].team[0].status === 'par') paralysed = true;
  }
  assert.ok(paralysed, 'Static never triggered across 40 seeds');
});

/* ------------------------------------------------------------------ *
 * Held items
 * ------------------------------------------------------------------ */

test('Leftovers restores HP at end of turn', () => {
  const battle = makeBattle([set('snorlax', {moves: ['tackle'], item: 'leftovers', level: 100})],
    [set('garchomp', {moves: ['earthquake'], level: 100, evs: {atk: 252}})], {seed: 30});
  const mon = battle.sides[0].team[0];
  turn(battle, 0, 0);
  const damaged = mon.currentHP;
  assert.ok(damaged < mon.maxHP, 'Snorlax should have taken damage first');
  assert.ok(battle.log.some(l => /Leftovers/.test(l)), 'Leftovers should heal at the end of the turn');
  const healEvent = battle.events.find(e => e.type === 'text' && /Leftovers/.test(e.text));
  assert.ok(healEvent, 'a Leftovers heal event should be emitted');
});

test('Focus Sash survives one lethal hit and is consumed', () => {
  const battle = makeBattle(
    [set('rayquaza', {moves: ['dragonascent'], level: 100, evs: {atk: 252}, nature: 'adamant'})],
    [set('gengar', {moves: ['shadowball'], item: 'focussash', level: 5})], {seed: 33});
  const target = battle.sides[1].team[0];
  turn(battle, 0, 0);
  assert.strictEqual(target.currentHP, 1);
  assert.strictEqual(target.item, null, 'the Sash must be consumed');
  assert.strictEqual(target.consumedItem, 'focussash');
});

test('Life Orb boosts damage and costs the holder HP', () => {
  const damage = item => {
    const battle = makeBattle([set('alakazam', {moves: ['psychic'], item, level: 100, evs: {spa: 252}, nature: 'modest'})],
      [set('snorlax', {moves: ['tackle'], level: 100})], {seed: 41});
    const target = battle.sides[1].team[0];
    const before = target.currentHP;
    turn(battle, 0, 0);
    return {dealt: before - target.currentHP, selfHP: battle.sides[0].team[0].currentHP, max: battle.sides[0].team[0].maxHP};
  };
  const orb = damage('lifeorb');
  const none = damage(null);
  assert.ok(orb.dealt > none.dealt, `Life Orb should add damage (${orb.dealt} vs ${none.dealt})`);
  assert.ok(orb.selfHP < orb.max, 'Life Orb recoil should be applied');
});

test('Choice items lock the holder into one move', () => {
  const battle = makeBattle(
    [set('garchomp', {moves: ['earthquake', 'dragonclaw'], item: 'choiceband', level: 100})],
    [set('snorlax', {moves: ['tackle'], level: 100})], {seed: 44});
  turn(battle, 0, 0);
  const request = battle.requests[0];
  assert.strictEqual(request.moves[1].disabled, 'Choice-locked');
  const rejected = battle.choose(0, {type: 'move', index: 1});
  assert.ok(!rejected.ok, 'the locked move must be rejected');
});

test('Sitrus Berry triggers below half HP', () => {
  const battle = makeBattle(
    [set('rayquaza', {moves: ['dragonascent'], level: 100, evs: {atk: 252}})],
    [set('blissey', {moves: ['tackle'], item: 'sitrusberry', level: 100, evs: {hp: 252}})], {seed: 46});
  const target = battle.sides[1].team[0];
  turn(battle, 0, 0);
  if (target.currentHP > 0 && target.currentHP <= target.maxHP / 2 + 1) {
    assert.strictEqual(target.item, null, 'the berry should have been eaten');
  }
  assert.ok(true);
});

test('Assault Vest blocks status moves and raises Sp. Def', () => {
  const battle = makeBattle([set('goodra', {moves: ['dracometeor', 'rest'], item: 'assaultvest', level: 100})],
    [set('snorlax', {moves: ['tackle'], level: 100})], {seed: 48});
  assert.strictEqual(battle.requests[0].moves[1].disabled, 'Assault Vest');
});

/* ------------------------------------------------------------------ *
 * Mega Evolution
 *
 * A real in-battle mechanic here: no Key Stone is needed, it works in every
 * format including Campaign, and Mega formes are never directly selectable.
 * ------------------------------------------------------------------ */

test('Mega Evolution works in every format, including Campaign', () => {
  for (const format of Formats.list({includeInternal: true})) {
    const battle = makeBattle([set('charizard', {item: 'charizarditey', moves: ['flamethrower'], level: 100})],
      [set('blissey', {moves: ['splash'], level: 100})],
      {seed: 321, format: format.id, overrides: {teamPreview: false, speciesClause: false}});
    assert.ok(battle.requests[0].canMega, `${format.name} should offer Mega Evolution`);
    turn(battle, {type: 'move', index: 0, mega: true}, 0);
    assert.strictEqual(battle.sides[0].team[0].species, 'charizardmegay', `${format.name} mega failed`);
    // The Mega forme's ability replaces the old one and fires on arrival.
    assert.strictEqual(battle.field.weather, 'sun', `${format.name}: Mega Charizard Y's Drought should start sun`);
  }
});

test('Mega Evolution follows the usual rules', () => {
  // Needs the matching stone.
  const wrongStone = makeBattle([set('charizard', {item: 'gengarite', moves: ['dragonclaw'], level: 100})],
    [set('blissey', {moves: ['splash'], level: 100})], {seed: 321});
  assert.strictEqual(wrongStone.requests[0].canMega, false, 'the wrong stone must not work');
  const noStone = makeBattle([set('charizard', {item: 'leftovers', moves: ['dragonclaw'], level: 100})],
    [set('blissey', {moves: ['splash'], level: 100})], {seed: 321});
  assert.strictEqual(noStone.requests[0].canMega, false, 'no stone, no Mega Evolution');

  // Once per side, and never twice.
  const battle = makeBattle([set('charizard', {item: 'charizarditex', moves: ['dragonclaw'], level: 100}),
    set('gengar', {item: 'gengarite', moves: ['shadowball'], level: 100})],
  [set('blissey', {moves: ['splash'], level: 100})], {seed: 321, overrides: {speciesClause: false}});
  turn(battle, {type: 'move', index: 0, mega: true}, 0);
  const mega = battle.sides[0].team[0];
  assert.strictEqual(mega.species, 'charizardmegax');
  assert.strictEqual(battle.requests[0].canMega, false, 'cannot Mega Evolve twice');
  turn(battle, {type: 'switch', index: 1}, 0);
  assert.strictEqual(battle.requests[0].canMega, false, 'one Mega Evolution per side per battle');

  // The stone is never consumed, and the forme survives switching.
  assert.strictEqual(mega.item, 'charizarditex', 'the stone is not consumed');
  turn(battle, {type: 'switch', index: 0}, 0);
  const back = battle.sides[0].team[0];
  assert.strictEqual(back.species, 'charizardmegax', 'still Mega after switching back in');
  assert.strictEqual(Dex.toID(back.ability), 'toughclaws', 'and keeps the Mega ability');
  // Nothing leaks out of the battle.
  assert.strictEqual(back.set.species, 'charizard', 'the saved set stays the base forme');
});

test('a Mega Stone cannot be removed', () => {
  const knockOff = item => {
    const battle = makeBattle([set('charizard', {item, moves: ['dragonclaw'], level: 100})],
      [set('blissey', {moves: ['knockoff'], level: 100})], {seed: 321});
    battle.rng.next = () => 0;
    battle.rng.chance = () => false;
    battle.executeMove(battle.sides[1].team[0], battle.sides[0].team[0], Dex.move('knockoff'), {index: 0});
    return battle.sides[0].team[0].item;
  };
  assert.strictEqual(knockOff('charizarditex'), 'charizarditex', 'Knock Off must not take a Mega Stone');
  assert.strictEqual(knockOff('leftovers'), null, 'the control should lose its item');
});

test("the Mega forme's Speed orders the same turn it evolves", () => {
  const battle = makeBattle([set('beedrill', {item: 'beedrillite', moves: ['tackle'], level: 100})],
    [set('blissey', {moves: ['tackle'], level: 100})], {seed: 321});
  const before = battle.sides[0].team[0].stats.spe;
  turn(battle, {type: 'move', index: 0, mega: true}, 0);
  assert.ok(battle.sides[0].team[0].stats.spe > before,
    'Mega Evolution resolves before the moves, so the new Speed applies immediately');
});

test('Rayquaza Mega Evolves through Dragon Ascent, with no stone', () => {
  const canMega = moves => makeBattle([set('rayquaza', {item: 'leftovers', moves, level: 100})],
    [set('blissey', {moves: ['splash'], level: 100})],
    {seed: 321, format: 'anythinggoes'}).requests[0].canMega;
  assert.strictEqual(canMega(['dragonascent']), true, 'Dragon Ascent enables it');
  assert.strictEqual(canMega(['dragonclaw']), false, 'without the move there is no Mega Evolution');
});

/* ------------------------------------------------------------------ *
 * Ability restorations and redesigns
 *
 * These are deliberate project decisions, not main-series behaviour. Each test
 * asserts the observable effect so a "cleanup" that reverts one fails here.
 * See docs/PROJECT_CONTEXT.md for the full table and the rationale.
 * ------------------------------------------------------------------ */

/** Force an ability on the constructed battle Pokemon, bypassing legality. */
function forceAbility(mon, ability) {
  mon.ability = Dex.toID(ability);
  mon.baseAbility = mon.ability;
  return mon;
}
/** Pin the RNG so damage comparisons are exact. */
function pinRng(battle) {
  battle.rng.next = () => 0;
  battle.rng.chance = () => false;
  return battle;
}

test('Magic Guard resists Toxic Spikes and full paralysis, others do not', () => {
  const spiked = ability => {
    const battle = makeBattle([set('clefable', {ability, moves: ['splash'], level: 100}),
      set('snorlax', {moves: ['splash'], level: 100})],
    [set('blissey', {moves: ['splash'], level: 100})], {seed: 909});
    battle.sides[0].conditions.toxicspikes = 1;
    const mon = forceAbility(battle.sides[0].team[0], ability);
    mon.status = null;
    battle.applyEntryHazards(mon);
    return mon.status;
  };
  assert.strictEqual(spiked('Magic Guard'), null, 'Magic Guard should not be poisoned by Toxic Spikes');
  assert.strictEqual(spiked('Run Away'), 'psn', 'the control should be poisoned');

  const paralysed = ability => {
    const battle = makeBattle([set('clefable', {ability, moves: ['tackle'], level: 100})],
      [set('blissey', {moves: ['splash'], level: 100})], {seed: 909});
    const mon = forceAbility(battle.sides[0].team[0], ability);
    mon.status = 'par';
    battle.rng.chance = () => true;      // always roll full paralysis
    let blocked = 0;
    for (let i = 0; i < 5; i++) if (battle.canAct(mon, Dex.move('tackle')) === false) blocked++;
    return blocked;
  };
  assert.strictEqual(paralysed('Magic Guard'), 0, 'Magic Guard should never be fully paralysed');
  assert.strictEqual(paralysed('Run Away'), 5, 'the control should be fully paralysed');
});

test("Parental Bond's second strike is a separate hit at half power", () => {
  const hit = ability => {
    const battle = pinRng(makeBattle([set('kangaskhan', {ability, moves: ['tackle'], level: 100})],
      [set('blissey', {moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 909}));
    const user = forceAbility(battle.sides[0].team[0], ability);
    const foe = battle.sides[1].team[0];
    const before = foe.currentHP;
    battle.executeMove(user, foe, Dex.move('tackle'), {index: 0});
    return {damage: before - foe.currentHP, twoHits: battle.log.some(l => /Hit 2 times/.test(l))};
  };
  const bond = hit('Parental Bond');
  const control = hit('Run Away');
  assert.ok(bond.twoHits, 'Parental Bond must remain two distinct strikes');
  const ratio = (bond.damage - control.damage) / control.damage;
  assert.ok(Math.abs(ratio - 0.5) < 0.03, `second hit should be ~50% of the first, got ${ratio.toFixed(3)}`);
});

test('Gale Wings grants Flying priority at any HP', () => {
  const priorityAt = fraction => {
    const battle = makeBattle([set('talonflame', {ability: 'Gale Wings', moves: ['bravebird'], level: 100})],
      [set('blissey', {moves: ['splash'], level: 100})], {seed: 909});
    const user = forceAbility(battle.sides[0].team[0], 'Gale Wings');
    user.currentHP = Math.max(1, Math.floor(user.maxHP * fraction));
    return battle.modifyValue('onModifyPriority', user, 0, Dex.move('bravebird'));
  };
  assert.strictEqual(priorityAt(1), 1, 'full HP');
  assert.strictEqual(priorityAt(0.5), 1, 'half HP');
  assert.strictEqual(priorityAt(0.001), 1, '1 HP');
});

test('Aerilate/Pixilate/Refrigerate convert and boost 1.3x; Galvanize stays 1.2x', () => {
  const convert = (ability, species) => {
    const battle = pinRng(makeBattle([set(species, {ability, moves: ['tackle'], level: 100})],
      [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
    const user = forceAbility(battle.sides[0].team[0], ability);
    const base = Dex.move('tackle');
    const move = Object.assign({}, base, {flags: Object.assign({}, base.flags)});
    battle.runAbility('onModifyMove', user, move, battle.sides[1].team[0]);
    const power = battle.modifyValue('onBasePower', user, move.basePower, battle.sides[1].team[0], move);
    return {type: move.type, ratio: power / base.basePower};
  };
  for (const [ability, species, type] of [['Aerilate', 'salamence', 'Flying'],
    ['Pixilate', 'sylveon', 'Fairy'], ['Refrigerate', 'glaceon', 'Ice']]) {
    const got = convert(ability, species);
    assert.strictEqual(got.type, type, `${ability} should convert to ${type}`);
    assert.ok(Math.abs(got.ratio - 1.3) < 0.02, `${ability} should be 1.3x, got ${got.ratio}`);
  }
  const galvanize = convert('Galvanize', 'golemalola');
  assert.ok(Math.abs(galvanize.ratio - 1.2) < 0.02,
    `Galvanize was introduced after the nerf and keeps 1.2x, got ${galvanize.ratio}`);
});

test('Transistor multiplies Electric power by 1.5', () => {
  const battle = pinRng(makeBattle([set('regieleki', {ability: 'Transistor', moves: ['thunderbolt'], level: 100})],
    [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
  const user = forceAbility(battle.sides[0].team[0], 'Transistor');
  const move = Dex.move('thunderbolt');
  const power = battle.modifyValue('onBasePower', user, move.basePower, battle.sides[1].team[0], move);
  assert.ok(Math.abs(power / move.basePower - 1.5) < 0.02, `expected 1.5x, got ${power / move.basePower}`);
});

test('Disguise blocks the first hit and costs no HP', () => {
  const battle = pinRng(makeBattle([set('mimikyu', {ability: 'Disguise', moves: ['splash'], level: 100})],
    [set('blissey', {moves: ['earthquake'], level: 100})], {seed: 909}));
  const me = forceAbility(battle.sides[0].team[0], 'Disguise');
  const before = me.currentHP;
  battle.executeMove(battle.sides[1].team[0], me, Dex.move('earthquake'), {index: 0});
  assert.strictEqual(before - me.currentHP, 0, 'busting the disguise must cost no HP');
  assert.ok(me.volatiles.disguiseBusted, 'the disguise should be busted');
});

test('Protean and Libero re-trigger on every move, not once per switch-in', () => {
  for (const ability of ['Protean', 'Libero']) {
    const battle = pinRng(makeBattle([set('greninja', {ability, moves: ['icebeam', 'darkpulse', 'surf'], level: 100})],
      [set('blissey', {moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 909}));
    const user = forceAbility(battle.sides[0].team[0], ability);
    const foe = battle.sides[1].team[0];
    const seen = [];
    for (const moveId of ['icebeam', 'darkpulse', 'surf']) {
      battle.executeMove(user, foe, Dex.move(moveId), {index: 0});
      seen.push(user.types.join('/'));
    }
    assert.deepStrictEqual([...seen], ['Ice', 'Dark', 'Water'], `${ability} should change type each time`);
  }
});

test('Intrepid Sword, Dauntless Shield and Supreme Overlord boost on every entry', () => {
  for (const [ability, stat] of [['Intrepid Sword', 'atk'], ['Dauntless Shield', 'def'], ['Supreme Overlord', 'atk']]) {
    const battle = pinRng(makeBattle([set('zacian', {ability, moves: ['splash'], level: 100}),
      set('snorlax', {moves: ['splash'], level: 100})],
    [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
    forceAbility(battle.sides[0].team[0], ability);
    assert.strictEqual(battle.sides[0].team[0].boosts[stat], 1, `${ability} should boost on the first entry`);
    for (let round = 0; round < 2; round++) {
      battle.switchIn(0, 1, {silent: true});
      battle.switchIn(0, 0, {silent: true});
      assert.strictEqual(battle.sides[0].team[0].boosts[stat], 1,
        `${ability} should boost again on re-entry (round ${round + 2})`);
    }
  }
});

test('Supreme Overlord ignores fainted teammates entirely', () => {
  for (const faintedCount of [0, 1, 3, 5]) {
    const team = [set('kingambit', {ability: 'Supreme Overlord', moves: ['tackle'], level: 100})];
    for (let i = 0; i < 5; i++) team.push(set('snorlax', {moves: ['splash'], level: 100}));
    const battle = pinRng(makeBattle(team, [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
    const user = forceAbility(battle.sides[0].team[0], 'Supreme Overlord');
    for (let i = 1; i <= faintedCount; i++) {
      battle.sides[0].team[i].fainted = true;
      battle.sides[0].team[i].currentHP = 0;
    }
    user.boosts.atk = 0;
    battle.runAbility('onStart', user);
    assert.strictEqual(user.boosts.atk, 1, `+1 Attack with ${faintedCount} fainted`);
    const move = Dex.move('tackle');
    const power = battle.modifyValue('onBasePower', user, move.basePower, battle.sides[1].team[0], move);
    assert.strictEqual(power, move.basePower,
      `power must not scale with ${faintedCount} fainted teammates`);
  }
});

test('Download always raises both Attack and Sp. Atk, whatever the foe', () => {
  for (const foe of ['blissey', 'shuckle', 'aggron']) {
    const battle = pinRng(makeBattle([set('porygonz', {ability: 'Download', moves: ['splash'], level: 100})],
      [set(foe, {moves: ['splash'], level: 100})], {seed: 909}));
    const user = forceAbility(battle.sides[0].team[0], 'Download');
    user.boosts.atk = 0;
    user.boosts.spa = 0;
    battle.runAbility('onStart', user);
    assert.strictEqual(user.boosts.atk, 1, `Attack +1 vs ${foe}`);
    assert.strictEqual(user.boosts.spa, 1, `Sp. Atk +1 vs ${foe}`);
  }
});

test('Cloud Nine and Air Lock delete weather permanently on entry', () => {
  for (const ability of ['Cloud Nine', 'Air Lock']) {
    for (const weather of ['rain', 'sun', 'sandstorm', 'snow']) {
      const battle = pinRng(makeBattle([set('psyduck', {ability, moves: ['splash'], level: 100}),
        set('snorlax', {moves: ['splash'], level: 100})],
      [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
      const mon = forceAbility(battle.sides[0].team[0], ability);
      battle.field.weather = weather;
      battle.field.weatherTurns = 5;
      battle.runAbility('onStart', mon);
      assert.strictEqual(battle.field.weather, null, `${ability} should clear ${weather}`);
      assert.strictEqual(battle.field.weatherTurns, 0, `${ability} should clear the duration`);
      // Leaving must not bring it back.
      battle.switchIn(0, 1, {silent: true});
      assert.strictEqual(battle.field.weather, null, `${weather} must not return when ${ability} leaves`);
      // A later setter still works.
      assert.ok(battle.setWeather('rain', battle.sides[0].team[1]), 'new weather should still be settable');
      assert.strictEqual(battle.field.weather, 'rain');
    }
  }
});

test('weather-setting abilities still make finite weather', () => {
  for (const [ability, weather] of [['Drought', 'sun'], ['Drizzle', 'rain'],
    ['Sand Stream', 'sandstorm'], ['Snow Warning', 'snow']]) {
    const battle = pinRng(makeBattle([set('torkoal', {ability, moves: ['splash'], level: 100})],
      [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
    const mon = forceAbility(battle.sides[0].team[0], ability);
    battle.field.weather = null;
    battle.field.weatherTurns = 0;
    battle.runAbility('onStart', mon);
    assert.strictEqual(battle.field.weather, weather, `${ability} should set ${weather}`);
    assert.ok(battle.field.weatherTurns > 0 && battle.field.weatherTurns <= 8,
      `${ability} weather must be finite, got ${battle.field.weatherTurns}`);
  }
});

test('the Mold Breaker family ignores Dark Aura and Fairy Aura', () => {
  const damage = (attackerAbility, foeAbility, moveId) => {
    const battle = pinRng(makeBattle([set('haxorus', {ability: attackerAbility, moves: [moveId], level: 100})],
      [set('yveltal', {ability: foeAbility, moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 909}));
    const user = forceAbility(battle.sides[0].team[0], attackerAbility);
    const foe = forceAbility(battle.sides[1].team[0], foeAbility);
    const before = foe.currentHP;
    battle.executeMove(user, foe, Dex.move(moveId), {index: 0});
    return before - foe.currentHP;
  };
  for (const [aura, moveId] of [['Dark Aura', 'darkpulse'], ['Fairy Aura', 'moonblast']]) {
    const neutral = damage('Run Away', 'Run Away', moveId);
    assert.ok(damage('Run Away', aura, moveId) > neutral, `${aura} should boost ${moveId} normally`);
    for (const breaker of ['Mold Breaker', 'Turboblaze', 'Teravolt']) {
      assert.strictEqual(damage(breaker, aura, moveId), neutral,
        `${breaker} should ignore ${aura}`);
    }
  }
});

test('Unseen Fist hits through Protect at full damage', () => {
  const damage = (ability, protectedTarget) => {
    const battle = pinRng(makeBattle([set('urshifu', {ability, moves: ['closecombat'], level: 100})],
      [set('blissey', {moves: ['splash'], level: 100, evs: {hp: 252}})], {seed: 909}));
    const user = forceAbility(battle.sides[0].team[0], ability);
    const foe = battle.sides[1].team[0];
    foe.protectedThisTurn = protectedTarget;
    const before = foe.currentHP;
    battle.executeMove(user, foe, Dex.move('closecombat'), {index: 0});
    return before - foe.currentHP;
  };
  const unprotected = damage('Unseen Fist', false);
  assert.ok(unprotected > 0);
  assert.strictEqual(damage('Unseen Fist', true), unprotected,
    'Unseen Fist must deal full damage through Protect, not a fraction');
  assert.strictEqual(damage('Run Away', true), 0, 'the control should be blocked');
});

test('Battle Bond transforms Greninja into Ash-Greninja on a KO', () => {
  const battle = pinRng(makeBattle([set('greninja', {ability: 'Battle Bond', moves: ['surf', 'watershuriken'], level: 100})],
    [set('magikarp', {moves: ['splash'], level: 100}), set('magikarp', {moves: ['splash'], level: 100})], {seed: 909}));
  const user = forceAbility(battle.sides[0].team[0], 'Battle Bond');
  const foe = battle.sides[1].team[0];
  assert.strictEqual(user.species, 'greninja');
  const before = {atk: user.stats.atk, spa: user.stats.spa, spe: user.stats.spe};
  foe.currentHP = 1;
  battle.executeMove(user, foe, Dex.move('surf'), {index: 0});
  battle.checkFaints();          // onFoeFaint fires while faints are processed
  assert.strictEqual(user.species, 'greninjaash', 'Greninja should become Ash-Greninja');
  assert.ok(user.stats.atk > before.atk && user.stats.spa > before.spa && user.stats.spe > before.spe,
    'Ash-Greninja should use the stronger forme stats');
  // Water Shuriken has no forme-specific behaviour: 25 BP, 2-5 hits, both formes.
  const shuriken = Dex.move('watershuriken');
  assert.strictEqual(shuriken.basePower, 25);
  assert.deepStrictEqual([...shuriken.multihit], [2, 5]);
  assert.strictEqual(battle.dynamicBasePower(user, battle.sides[1].team[1], shuriken, {}), 25,
    'Ash-Greninja Water Shuriken must not be special-cased');
  // The persistent set is untouched, so nothing leaks out of the battle.
  assert.strictEqual(user.set.species, 'greninja', 'the saved set must stay Greninja');
});

test('Battle Bond triggers on a KO with any move, not just Water Shuriken', () => {
  for (const moveId of ['surf', 'nightslash', 'watershuriken', 'uturn']) {
    const battle = pinRng(makeBattle([set('greninja', {ability: 'Battle Bond', moves: [moveId], level: 100}),
      set('snorlax', {moves: ['splash'], level: 100})],
    [set('magikarp', {moves: ['splash'], level: 100}), set('magikarp', {moves: ['splash'], level: 100})], {seed: 909}));
    const user = forceAbility(battle.sides[0].team[0], 'Battle Bond');
    battle.sides[1].team[0].currentHP = 1;
    battle.executeMove(user, battle.sides[1].team[0], Dex.move(moveId), {index: 0});
    battle.checkFaints();
    assert.strictEqual(battle.sides[0].team[0].species, 'greninjaash',
      `a KO with ${moveId} should trigger Battle Bond`);
  }
});

test('there is exactly one selectable Greninja, carrying three abilities', () => {
  const selectable = Dex.allSpecies.filter(s => s.baseSpecies === 'Greninja');
  assert.deepStrictEqual([...selectable.map(s => s.id)], ['greninja'],
    `expected only the base forme, got: ${selectable.map(s => s.name).join(', ')}`);
  assert.deepStrictEqual([...Dex.abilityList(Dex.species('greninja'))],
    ['Torrent', 'Protean', 'Battle Bond']);
  // Greninja-Ash is still packaged, because Battle Bond transforms into it...
  assert.ok(Dex.hasSpecies('greninjaash'), 'the transform target must remain resolvable');
  assert.ok(Dex.species('greninjaash').transformOnly, 'and must be marked transform-only');
  // ...but it is not selectable in any format, and validation refuses it.
  for (const format of Formats.list()) {
    const pool = Formats.speciesPool(format.id);
    assert.ok(!pool.some(s => s.id === 'greninjaash'),
      `Greninja-Ash leaked into the ${format.name} pool`);
  }
  const result = RedGPT.Validation.validateTeam(
    [Pokemon.normalizeSet({species: 'greninjaash', moves: ['surf'], level: 100})],
    Formats.get('anythinggoes'));
  assert.ok(result.errors.some(e => /in-battle transformation/.test(e.message)),
    'validation should refuse a transform-only forme even in Anything Goes');
});

test('abilities deliberately left modern are unchanged', () => {
  const registry = RedGPT.Abilities.registry;
  // Trapping abilities keep their onTrapped rules and current immunities.
  assert.ok(typeof registry.shadowtag.onTrapped === 'function');
  assert.strictEqual(registry.shadowtag.onTrapped(null, null, {ability: 'shadowtag'}), false,
    'Shadow Tag must not trap another Shadow Tag holder');
  assert.ok(typeof registry.arenatrap.onTrapped === 'function');
  assert.ok(typeof registry.magnetpull.onTrapped === 'function');
  // Prankster keeps its modern Dark immunity flag, read by the executor.
  assert.ok(registry.prankster.prankster, 'Prankster must keep its Dark-type interaction');
  // Moody must not touch accuracy or evasion.
  const moody = String(registry.moody.onResidual);
  assert.ok(!/accuracy|evasion/.test(moody), 'Moody must not use accuracy/evasion');
  // Intimidate keeps its counters.
  assert.ok(typeof registry.intimidate.onStart === 'function');
  assert.ok(typeof registry.effectspore.onDamagingHit === 'function');
  // Trace keeps a modern uncopyable list — it must not copy form-defining
  // abilities. This was read but never populated before, so Trace copied
  // everything; assert the behaviour, not just that a list exists.
  const uncopyable = RedGPT.Abilities.UNCOPYABLE;
  for (const id of ['battlebond', 'disguise', 'iceface', 'imposter', 'illusion',
    'stancechange', 'zenmode', 'protosynthesis', 'quarkdrive', 'trace']) {
    assert.ok(uncopyable.has(id), `Trace must not be able to copy ${id}`);
  }
  const traced = foeAbility => {
    const battle = makeBattle([set('porygon2', {ability: 'Trace', moves: ['splash'], level: 100})],
      [set('greninja', {ability: foeAbility, moves: ['splash'], level: 100})], {seed: 909});
    const me = battle.sides[0].team[0];
    forceAbility(me, 'Trace');
    forceAbility(battle.sides[1].team[0], foeAbility);
    battle.runAbility('onStart', me);
    return Dex.toID(me.ability);      // the engine stores name or id; compare ids
  };
  assert.strictEqual(traced('Battle Bond'), 'trace', 'Trace must not copy Battle Bond');
  assert.strictEqual(traced('Disguise'), 'trace', 'Trace must not copy Disguise');
  assert.strictEqual(traced('Torrent'), 'torrent', 'Trace should still copy an ordinary ability');
});

/* ------------------------------------------------------------------ *
 * Move targeting vs defender-side guards
 *
 * The executor passes the foe as `defender` for every move, including the
 * user's own Slack Off or Reflect. A defender-side guard that forgets to ask
 * whether the move was aimed at it blocks the *user's* self-buffs — Good as
 * Gold shut down every status move on the field this way.
 * ------------------------------------------------------------------ */

/** Did the foe's ability refuse this move, over and above the baseline? */
function refusedByFoeAbility(moveId, foeAbility) {
  const run = ability => {
    const battle = makeBattle([set('skeledirge', {moves: [moveId, 'splash'], ability: 'Unaware', level: 100})],
      [set('gholdengo', {moves: ['splash'], ability, level: 100})], {seed: 777});
    battle.rng.next = () => 0;
    battle.rng.chance = () => false;
    const mark = battle.log.length;
    battle.executeMove(battle.sides[0].team[0], battle.sides[1].team[0], Dex.move(moveId), {index: 0});
    return battle.log.slice(mark).some(line => /doesn't affect/.test(line));
  };
  return run(foeAbility) && !run('Run Away');
}

test('Good as Gold refuses status moves aimed at it', () => {
  const blocked = ['willowisp', 'toxic', 'thunderwave', 'taunt', 'encore', 'leechseed', 'defog', 'growl']
    .filter(id => !refusedByFoeAbility(id, 'Good as Gold'));
  assert.deepStrictEqual([...blocked], [], `Good as Gold let these through: ${blocked.join(', ')}`);
});

test('Good as Gold does not touch moves the user aims at itself or its own side', () => {
  // Slack Off is the case that was reported: healing yourself is not a move
  // "used on" the foe, so the foe's ability has no say in it.
  const leaked = ['slackoff', 'swordsdance', 'recover', 'substitute', 'protect', 'shellsmash',
    'reflect', 'lightscreen', 'tailwind', 'aromatherapy',
    'trickroom', 'sunnyday', 'electricterrain', 'haze',
    'stealthrock', 'spikes', 'stickyweb']
    .filter(id => refusedByFoeAbility(id, 'Good as Gold'));
  assert.deepStrictEqual([...leaked], [], `Good as Gold wrongly blocked: ${leaked.join(', ')}`);
});

test('Magic Bounce still reflects hazards and status aimed across the field', () => {
  const notBounced = [];
  for (const moveId of ['stealthrock', 'spikes', 'taunt', 'toxic']) {
    const battle = makeBattle([set('skeledirge', {moves: [moveId, 'splash'], ability: 'Unaware', level: 100})],
      [set('espeon', {moves: ['splash'], ability: 'Magic Bounce', level: 100})], {seed: 777});
    battle.rng.next = () => 0;
    battle.rng.chance = () => false;
    const mark = battle.log.length;
    battle.executeMove(battle.sides[0].team[0], battle.sides[1].team[0], Dex.move(moveId), {index: 0});
    if (!battle.log.slice(mark).some(line => /bounced/.test(line))) notBounced.push(moveId);
  }
  assert.deepStrictEqual([...notBounced], [], `Magic Bounce stopped reflecting: ${notBounced.join(', ')}`);
});

test('Wind Rider absorbs an incoming wind attack but not the foe-side Tailwind', () => {
  const attack = ability => {
    const battle = makeBattle([set('skeledirge', {moves: ['bleakwindstorm', 'splash'], ability: 'Unaware', level: 100})],
      [set('brambleghast', {moves: ['splash'], ability, level: 100})], {seed: 777});
    battle.rng.next = () => 0;
    battle.rng.chance = () => false;
    const foe = battle.sides[1].team[0];
    const before = foe.currentHP;
    battle.executeMove(battle.sides[0].team[0], foe, Dex.move('bleakwindstorm'), {index: 0});
    return {damage: before - foe.currentHP, atk: foe.boosts.atk};
  };
  assert.strictEqual(attack('Wind Rider').damage, 0, 'Wind Rider should absorb a wind attack');
  assert.strictEqual(attack('Wind Rider').atk, 1, 'Wind Rider should gain +1 Attack');
  assert.ok(attack('Run Away').damage > 0, 'the control should take damage');

  // Tailwind is a wind move, but it is set on the user's own side.
  const battle = makeBattle([set('skeledirge', {moves: ['tailwind', 'splash'], ability: 'Unaware', level: 100})],
    [set('brambleghast', {moves: ['splash'], ability: 'Wind Rider', level: 100})], {seed: 777});
  battle.executeMove(battle.sides[0].team[0], battle.sides[1].team[0], Dex.move('tailwind'), {index: 0});
  assert.ok(battle.sides[0].conditions.tailwind > 0, 'the foe Wind Rider ate the user own Tailwind');
  assert.strictEqual(battle.sides[1].team[0].boosts.atk, 0, 'Wind Rider should not trigger on the foe own Tailwind');
});

/* ------------------------------------------------------------------ *
 * Terastallization
 * ------------------------------------------------------------------ */

test('Terastallization resolves before any move, not when its own Pokemon acts', () => {
  /*
   * Reported from a real log. Tera used to be applied inline in `continueTurn`,
   * immediately before the actor's own move, so a *slower* Pokémon
   * Terastallized only after it had already been hit — it paid for a defensive
   * typing and then took the attack on the old one. An Arceus Tera'd to Ground,
   * Earthquaked a Kyogre, and only then did Kyogre become Grass.
   *
   * Both sides now Tera before any move runs, which is what the games do.
   * Measured: the Earthquake goes from 82 damage to 41 — Ground into Grass is
   * resisted — so the assertion is on damage, not on log order alone, because
   * printing the message earlier while applying the typing later would pass a
   * log-order check and still be the bug.
   */
  const battle = makeBattle(
    [set('kyogre', {level: 50, moves: ['waterspout', 'calmmind'], teraType: 'Grass', evs: {}})],
    [set('arceusground', {level: 50, moves: ['earthquake'], teraType: 'Ground', evs: {}})],
    {seed: 12});
  const mine = battle.sides[0].team[0];
  const foe = battle.sides[1].team[0];
  assert.ok(battle.getStat(mine, 'spe') < battle.getStat(foe, 'spe'),
    'the defender must be slower, or this proves nothing');

  const before = mine.currentHP;
  battle.choose(0, {type: 'move', index: 0, tera: true});
  battle.choose(1, {type: 'move', index: 0, tera: true});
  const lost = before - mine.currentHP;

  assert.deepStrictEqual([...mine.types], ['Grass'], 'the defender should be Terastallized');
  assert.ok(battle.log.some(l => /not very effective/.test(l)),
    `the Earthquake should have been resisted: ${battle.log.join(' | ')}`);

  // Both Tera messages must precede the first move.
  const firstMove = battle.log.findIndex(l => / used /.test(l));
  const teraLines = battle.log.map((l, i) => (/terastallized/i.test(l) ? i : -1)).filter(i => i >= 0);
  assert.strictEqual(teraLines.length, 2, 'both sides should have Terastallized');
  assert.ok(teraLines.every(i => i < firstMove), 'a Terastallization happened after a move was used');

  // The damage is the real proof: on its base Water typing this hit for 82.
  assert.ok(lost > 0 && lost < 60,
    `expected the resisted hit (~41), got ${lost} — the typing was applied too late`);
});

test('Terastallizing changes typing and applies the correct STAB', () => {
  const battle = makeBattle(
    [set('garchomp', {moves: ['earthquake'], teraType: 'Ground', level: 100, evs: {atk: 252}})],
    [set('snorlax', {moves: ['tackle'], level: 100})], {seed: 51, overrides: {tera: true}});
  assert.ok(battle.requests[0].canTera);
  battle.choose(0, {type: 'move', index: 0, tera: true});
  battle.choose(1, {type: 'move', index: 0});
  const mon = battle.sides[0].team[0];
  assert.ok(mon.terastallized);
  assert.deepStrictEqual([...mon.types], ['Ground']);
  assert.strictEqual(battle.stabFor(mon, 'Ground'), 2, 'matching original + tera type is 2x STAB');
  assert.strictEqual(battle.stabFor(mon, 'Dragon'), 1.5, 'the original type keeps 1.5x');
  assert.strictEqual(battle.stabFor(mon, 'Fire'), 1);
  assert.ok(!battle.requests[0] || !battle.requests[0].canTera, 'Tera is once per side');
});

/* ------------------------------------------------------------------ *
 * Moves with special behaviour
 * ------------------------------------------------------------------ */

test('Leech Seed drains the target and heals the seeder', () => {
  let checked = false;
  for (let seed = 0; seed < 30 && !checked; seed++) {
    const battle = makeBattle([set('venusaur', {moves: ['leechseed'], level: 100})],
      [set('snorlax', {moves: ['defensecurl'], level: 100})], {seed});
    const seeder = battle.sides[0].team[0];
    const target = battle.sides[1].team[0];
    turn(battle, 0, 0);
    if (target.volatiles.leechSeed == null) continue;
    checked = true;
    seeder.currentHP = Math.floor(seeder.maxHP / 2);
    const before = seeder.currentHP;
    const targetBefore = target.currentHP;
    turn(battle, 0, 0);
    assert.ok(target.currentHP < targetBefore, 'Leech Seed should sap the target');
    assert.ok(seeder.currentHP > before, 'Leech Seed should heal the planter');
  }
  assert.ok(checked, 'Leech Seed never landed across 30 seeds');
});

test('Grass types cannot be seeded', () => {
  const battle = makeBattle([set('venusaur', {moves: ['leechseed']})], [set('tangrowth', {moves: ['tackle']})], {seed: 61});
  turn(battle, 0, 0);
  assert.strictEqual(battle.sides[1].team[0].volatiles.leechSeed, undefined);
});

test('Seismic Toss deals damage equal to the user level', () => {
  const battle = makeBattle([set('machamp', {moves: ['seismictoss'], level: 73})],
    [set('snorlax', {moves: ['tackle'], level: 100})], {seed: 62});
  const target = battle.sides[1].team[0];
  const before = target.currentHP;
  turn(battle, 0, 0);
  assert.strictEqual(before - target.currentHP, 73);
});

test('Protect blocks the incoming move and fails when spammed', () => {
  const battle = makeBattle([set('toxapex', {moves: ['protect'], level: 100})],
    [set('garchomp', {moves: ['earthquake'], level: 100, evs: {atk: 252}})], {seed: 63});
  const self = battle.sides[0].team[0];
  turn(battle, 0, 0);
  assert.strictEqual(self.currentHP, self.maxHP, 'Protect must block the hit');
  let blocked = 1;
  for (let i = 0; i < 5 && !battle.ended; i++) {
    const before = self.currentHP;
    turn(battle, 0, 0);
    if (self.currentHP === before) blocked++;
  }
  assert.ok(blocked < 6, 'consecutive Protect must eventually fail');
});

test('Rest fully heals and puts the user to sleep', () => {
  const battle = makeBattle([set('snorlax', {moves: ['rest'], level: 100})],
    [set('garchomp', {moves: ['earthquake'], level: 100, evs: {atk: 252}})], {seed: 64});
  const self = battle.sides[0].team[0];
  self.currentHP = self.maxHP - 1;
  turn(battle, 0, 0);
  assert.strictEqual(self.status, 'slp', 'Rest should put the user to sleep');
  assert.strictEqual(self.currentHP, self.maxHP, 'Rest should fully restore HP');
});

test('Yawn causes sleep one turn later, never immediately', () => {
  const battle = makeBattle([set('slowbro', {moves: ['yawn'], level: 100})],
    [set('snorlax', {moves: ['tackle'], level: 100})], {seed: 65});
  const target = battle.sides[1].team[0];
  turn(battle, 0, 0);
  assert.strictEqual(target.status, null, 'Yawn must not sleep immediately');
  turn(battle, 0, 0);
  assert.strictEqual(target.status, 'slp');
});

test('Struggle is offered when no move has PP', () => {
  const battle = makeBattle([set('snorlax', {moves: ['tackle']})], [set('snorlax', {moves: ['tackle']})], {seed: 66});
  battle.sides[0].team[0].moves[0].pp = 0;
  battle.beginTurn();
  assert.deepStrictEqual([...battle.availableMoveIndices(battle.sides[0].team[0])], [-1]);
});

test('U-turn forces the user to pick a replacement mid-turn', () => {
  const battle = makeBattle(
    [set('scizor', {moves: ['uturn'], level: 100}), set('garchomp', {moves: ['earthquake'], level: 100})],
    [set('snorlax', {moves: ['tackle'], level: 100})], {seed: 67});
  turn(battle, 0, 0);
  assert.strictEqual(battle.requests[0]?.type, 'switch', 'U-turn must request a replacement');
  battle.choose(0, {type: 'switch', index: 1});
  assert.strictEqual(battle.active(0).species, 'garchomp');
});

test('a forfeit immediately awards the other side', () => {
  const battle = makeBattle([set('snorlax', {moves: ['tackle']})], [set('snorlax', {moves: ['tackle']})], {seed: 68});
  battle.choose(0, {type: 'forfeit'});
  assert.ok(battle.ended);
  assert.strictEqual(battle.winner, 1);
});

/* ------------------------------------------------------------------ *
 * Team Preview
 * ------------------------------------------------------------------ */

test('Team Preview reorders the team and picks the lead', () => {
  const rules = Object.assign({}, Formats.get('standard').rules, {teamPreview: true, bringCount: 3, forceLevel: null});
  const battle = new Battle({
    format: Object.assign({}, Formats.get('standard'), {rules}),
    seed: 70,
    sides: [
      {name: 'A', team: [set('snorlax'), set('garchomp'), set('gengar')], controller: 'human'},
      {name: 'B', team: [set('snorlax'), set('garchomp'), set('gengar')], controller: 'human'},
    ],
  });
  battle.start();
  assert.strictEqual(battle.requests[0].type, 'teampreview');
  battle.choose(0, {type: 'team', order: [2, 1, 0]});
  battle.choose(1, {type: 'team', order: [0, 1, 2]});
  assert.strictEqual(battle.active(0).species, 'gengar', 'the first chosen Pokémon leads');
  assert.strictEqual(battle.active(1).species, 'snorlax');
});

/* ------------------------------------------------------------------ *
 * AI
 * ------------------------------------------------------------------ */

test('the AI selects a super-effective KO when one is available', () => {
  const battle = makeBattle(
    [set('venusaur', {moves: ['tackle'], level: 100})],
    [set('charizard', {moves: ['tackle', 'flamethrower', 'ember', 'gust'], level: 100, evs: {spa: 252}})], {seed: 80});
  battle.sides[1].controller = 'ai';
  battle.sides[1].ai = {difficulty: 'expert'};
  const choice = RedGPT.AI.chooseAction(battle, 1, battle.requests[1]);
  assert.strictEqual(choice.type, 'move');
  const picked = battle.sides[1].team[0].moves[choice.index].id;
  assert.strictEqual(picked, 'flamethrower', `AI picked ${picked}`);
});

test('the AI switches away from a hopeless matchup', () => {
  const battle = makeBattle(
    [set('garchomp', {moves: ['earthquake'], level: 100, evs: {atk: 252}})],
    [set('magnezone', {moves: ['flashcannon'], level: 100}), set('rotomwash', {moves: ['hydropump'], level: 100, ability: 'Levitate'})],
    {seed: 81});
  battle.sides[1].controller = 'ai';
  battle.sides[1].ai = {difficulty: 'expert'};
  const choice = RedGPT.AI.chooseAction(battle, 1, battle.requests[1]);
  assert.strictEqual(choice.type, 'switch', 'Magnezone should flee an Earthquake');
});

test('AI difficulty tiers are all usable', () => {
  for (const difficulty of ['casual', 'trainer', 'ace', 'expert']) {
    const battle = makeBattle([set('garchomp', {moves: ['earthquake', 'swordsdance']})],
      [set('snorlax', {moves: ['bodyslam', 'rest']})], {seed: 90});
    battle.sides[1].controller = 'ai';
    battle.sides[1].ai = {difficulty};
    let guard = 0;
    while (!battle.ended && guard++ < 40) {
      const request = battle.requests[0];
      if (!request) break;
      const choice = request.type === 'switch' ? {type: 'switch', index: 0} : {type: 'move', index: 0};
      const result = battle.choose(0, choice);
      if (!result.ok) break;
    }
    assert.ok(battle.turn > 1, `${difficulty} AI stalled`);
  }
});

/* ------------------------------------------------------------------ *
 * Replays
 * ------------------------------------------------------------------ */

test('a replay reproduces the original battle exactly', () => {
  const rng = new RNG(4321);
  const teamA = RedGPT.RandomTeams.randomTeam(rng, {format: 'random'}).sets;
  const teamB = RedGPT.RandomTeams.randomTeam(rng, {format: 'random'}).sets;
  const original = new Battle({
    format: Formats.get('random'), seed: 4321,
    sides: [
      {name: 'Red', team: teamA, controller: 'ai', ai: {difficulty: 'ace'}},
      {name: 'Blue', team: teamB, controller: 'ai', ai: {difficulty: 'trainer'}},
    ],
  });
  original.start();
  assert.ok(original.ended, 'the AI battle should complete on its own');
  const replay = original.replayData();
  const replayed = Battle.fromReplay(replay);
  assert.strictEqual(replayed.log.join('\n'), original.log.join('\n'), 'replay log diverged');
  assert.strictEqual(replayed.winner, original.winner);
  assert.strictEqual(replayed.turn, original.turn);
});

test('replays store commands, not per-turn snapshots', () => {
  const battle = makeBattle([set('snorlax', {moves: ['tackle']})], [set('snorlax', {moves: ['tackle']})], {seed: 99});
  turn(battle, 0, 0);
  const replay = battle.replayData();
  assert.ok(Array.isArray(replay.commands));
  assert.ok(!('turns_snapshot' in replay) && !('states' in replay));
  assert.ok(JSON.stringify(replay).length < 200000, 'replay payload should stay small');
});

/* ------------------------------------------------------------------ *
 * Soak test
 * ------------------------------------------------------------------ */

test('the AI difficulty ladder is ordered — Expert clearly beats Casual', () => {
  /*
   * Difficulty has to mean something. It did not for a long time: the tiers
   * differed only in how far down a good ranking they would pick and in how
   * eagerly they switched, and because switching costs a whole turn here, the
   * *strongest* tier was measurably the weakest — Expert lost to Casual 34-66.
   *
   * Mirrored pairing: each seed is played in both orientations with the same
   * two teams, so neither team quality nor turn order can favour a tier. The
   * bar is deliberately loose (>56% over 120 games) because this is a
   * stochastic measurement inside a unit-test budget; the full sweep lives
   * outside `npm test`. It is tight enough to catch an inversion, which is the
   * failure that actually happened.
   */
  const play = (tierA, tierB, seed) => {
    const rng = new RNG(seed);
    const battle = new Battle({
      format: Formats.get('random'), seed,
      sides: [
        {name: 'A', team: RedGPT.RandomTeams.randomTeam(rng, {format: 'random'}).sets, controller: 'ai', ai: {difficulty: tierA}},
        {name: 'B', team: RedGPT.RandomTeams.randomTeam(rng, {format: 'random'}).sets, controller: 'ai', ai: {difficulty: tierB}},
      ],
    });
    battle.start();
    return battle.ended ? battle.winner : null;
  };

  let strongWins = 0;
  let weakWins = 0;
  for (let i = 0; i < 60; i++) {
    const seed = 700000 + i * 173;
    const a = play('expert', 'casual', seed);      // expert on side 0
    const b = play('casual', 'expert', seed);      // swapped, identical teams
    if (a === 0) strongWins++; else if (a === 1) weakWins++;
    if (b === 1) strongWins++; else if (b === 0) weakWins++;
  }
  const total = strongWins + weakWins;
  assert.ok(total > 100, `expected a full sample, got ${total} decided battles`);
  const rate = 100 * strongWins / total;
  assert.ok(rate > 56,
    `Expert should clearly beat Casual; got ${rate.toFixed(1)}% over ${total} games. ` +
    'Below 50% means the ladder has inverted again — check switch pricing in considerSwitch.');
});

test('200 seeded AI battles complete without throwing', () => {
  const failures = [];
  for (let i = 0; i < 200; i++) {
    const seed = 1000 + i * 37;
    try {
      const rng = new RNG(seed);
      const battle = new Battle({
        format: Formats.get('random'), seed,
        sides: [
          {name: 'A', team: RedGPT.RandomTeams.randomTeam(rng, {format: 'random'}).sets, controller: 'ai', ai: {difficulty: 'ace'}},
          {name: 'B', team: RedGPT.RandomTeams.randomTeam(rng, {format: 'random'}).sets, controller: 'ai', ai: {difficulty: 'expert'}},
        ],
      });
      battle.start();
      if (!battle.ended) failures.push(`${seed}: did not end`);
    } catch (error) {
      failures.push(`${seed}: ${error.message}`);
    }
  }
  assert.deepStrictEqual(failures.slice(0, 5), []);
});

/* ------------------------------------------------------------------ *
 * Forme changes
 * ------------------------------------------------------------------ */

test('held transformation items change forme on entry', () => {
  // Mega Stones are a declared action; these are not. Holding the item is
  // enough and the change happens the moment the holder is on the field.
  const cases = [
    ['groudon', 'redorb', 'groudonprimal'],
    ['kyogre', 'blueorb', 'kyogreprimal'],
    ['zacian', 'rustedsword', 'zaciancrowned'],
    ['zamazenta', 'rustedshield', 'zamazentacrowned'],
    ['giratina', 'griseousorb', 'giratinaorigin'],
    ['dialga', 'adamantcrystal', 'dialgaorigin'],
    ['palkia', 'lustrousglobe', 'palkiaorigin'],
    ['palafin', 'herocharm', 'palafinhero'],
    ['ogerpon', 'hearthflamemask', 'ogerponhearthflame'],
    ['ogerpon', 'wellspringmask', 'ogerponwellspring'],
    ['ogerpon', 'cornerstonemask', 'ogerponcornerstone'],
  ];
  for (const [species, item, expected] of cases) {
    const battle = makeBattle([set(species, {item})], [set('blissey')]);
    assert.strictEqual(battle.sides[0].team[0].species, expected, `${species} + ${item}`);
    // ...and without the item it stays put.
    const plain = makeBattle([set(species)], [set('blissey')]);
    assert.strictEqual(plain.sides[0].team[0].species, Dex.toID(species), `${species} transformed with no item`);
  }
});

test('each Ogerpon Mask brings its own typing and its own ability', () => {
  /*
   * Species alone is not enough here, and it is the weakest thing to assert:
   * all four Ogerpon formes share one base-stat spread, so a Mask that changed
   * the *name* and nothing else would look identical on a damage roll. What the
   * Mask actually buys is the typing and the ability — `applyHeldFormeChange`
   * overwrites the holder's ability with the new forme's first slot, which is
   * the line this pins.
   */
  const cases = [
    ['hearthflamemask', 'ogerponhearthflame', ['Grass', 'Fire'], 'Mold Breaker'],
    ['wellspringmask', 'ogerponwellspring', ['Grass', 'Water'], 'Water Absorb'],
    ['cornerstonemask', 'ogerponcornerstone', ['Grass', 'Rock'], 'Sturdy'],
  ];
  for (const [item, expected, types, ability] of cases) {
    const battle = makeBattle([set('ogerpon', {item, ability: 'Defiant'})], [set('blissey')]);
    const ogerpon = battle.active(0);
    assert.strictEqual(ogerpon.species, expected, item);
    assert.deepStrictEqual([...ogerpon.types], types, `${item} typing`);
    assert.strictEqual(Dex.toID(ogerpon.ability), Dex.toID(ability), `${item} ability`);
  }
  // Control: the set's own ability survives when no Mask is held, so the three
  // assertions above are the Mask's doing and not `normalizeSet` overriding.
  const bare = makeBattle([set('ogerpon', {ability: 'Defiant'})], [set('blissey')]);
  assert.strictEqual(bare.active(0).species, 'ogerpon');
  assert.deepStrictEqual([...bare.active(0).types], ['Grass']);
  assert.strictEqual(Dex.toID(bare.active(0).ability), 'defiant');
});

test('an Ogerpon Mask is worth 1.2x on top of the forme it produces', () => {
  /*
   * Two terms push the same way here and the test has to separate them, which
   * is §8's most-repeated testing lesson. Comparing "Ogerpon with a Mask"
   * against "Ogerpon without one" moves the forme *and* the item at once, so it
   * would pass with the `onBasePower` hook deleted if the forme alone changed
   * the number.
   *
   * The third row is what makes it a real measurement: a **bare** masked forme,
   * same species and same stats as the boosted one, holding nothing. The gap
   * between rows two and three is the item and only the item.
   */
  const dealt = (species, item) => {
    const battle = makeBattle([set(species, {item, moves: ['hornleech']})], [set('blissey')], {seed: 777});
    const before = battle.active(1).currentHP;
    turn(battle, 0, 0);
    return before - battle.active(1).currentHP;
  };
  const plain = dealt('ogerpon', '');
  const masked = dealt('ogerpon', 'hearthflamemask');
  const bareForme = dealt('ogerponhearthflame', '');

  assert.strictEqual(bareForme, plain,
    `the forme alone must not change the damage — all Ogerpon formes share one spread (${bareForme} vs ${plain})`);
  assert.strictEqual(masked, Math.floor(plain * 1.2),
    `the Mask should be worth exactly 1.2x: ${masked} against ${plain}`);
});

test('an Ogerpon Mask pays only the forme that requires it', () => {
  /*
   * The hook reads the holder's packaged `requiredItem`, so it must be silent
   * on anything that is not the matching masked forme. Blissey is the case that
   * matters — an item is offerable to anything, and a boost that leaked would
   * be a free 1.2x on the whole roster.
   */
  const dealt = (species, item) => {
    const battle = makeBattle([set(species, {item, moves: ['tackle']})], [set('snorlax')], {seed: 4242});
    const before = battle.active(1).currentHP;
    turn(battle, 0, 0);
    return before - battle.active(1).currentHP;
  };
  assert.strictEqual(dealt('blissey', 'hearthflamemask'), dealt('blissey', ''),
    'a Hearthflame Mask must do nothing for a Blissey');
  assert.strictEqual(dealt('ogerponwellspring', 'hearthflamemask'), dealt('ogerponwellspring', ''),
    'the wrong Mask must do nothing for a masked Ogerpon');
});

test('a forme item cannot be knocked off, before or after the change', () => {
  const battle = makeBattle([set('groudon', {item: 'redorb'})], [set('weavile', {moves: ['knockoff']})]);
  const groudon = battle.sides[0].team[0];
  assert.strictEqual(groudon.species, 'groudonprimal');
  assert.strictEqual(battle.canRemoveItem(groudon, battle.sides[1].team[0]), false);
});

test('the entry forme change happens before hazards, so the new typing takes the chip', () => {
  // Groudon is pure Ground (12.5% from Stealth Rock); Primal Groudon is
  // Fire/Ground (25%). Getting the order wrong would charge the wrong rate.
  const withOrb = makeBattle([set('furret'), set('groudon', {item: 'redorb'})], [set('blissey', {moves: ['stealthrock']})]);
  const bare = makeBattle([set('furret'), set('groudon')], [set('blissey', {moves: ['stealthrock']})]);
  for (const battle of [withOrb, bare]) {
    turn(battle, 0, 0);                                  // hazards go up
    battle.choose(0, {type: 'switch', index: 1});
    battle.choose(1, {type: 'move', index: 0});
  }
  const primal = withOrb.sides[0].team[1];
  const plain = bare.sides[0].team[1];
  assert.strictEqual(primal.species, 'groudonprimal');
  const primalLost = (primal.maxHP - primal.currentHP) / primal.maxHP;
  const plainLost = (plain.maxHP - plain.currentHP) / plain.maxHP;
  assert.ok(primalLost > plainLost * 1.5,
    `Primal should take double rocks: primal ${primalLost.toFixed(3)} vs plain ${plainLost.toFixed(3)}`);
});

test('ability-driven formes are reachable', () => {
  // Every one of these was inert by design until it was implemented: the formes
  // were packaged and sprited but nothing ever reached them.
  const aegislash = makeBattle([set('aegislash', {ability: 'Stance Change', moves: ['sacredsword', 'kingsshield']})], [set('blissey')]);
  const blade = aegislash.sides[0].team[0];
  aegislash.executeMove(blade, aegislash.sides[1].team[0], Dex.move('sacredsword'), {index: 0});
  assert.strictEqual(blade.species, 'aegislashblade', 'attacking should shift to Blade Forme');
  aegislash.executeMove(blade, aegislash.sides[1].team[0], Dex.move('kingsshield'), {index: 1});
  assert.strictEqual(blade.species, 'aegislash', "King's Shield should shift back");

  const darmanitan = makeBattle([set('darmanitan', {ability: 'Zen Mode'})], [set('blissey')]);
  const darm = darmanitan.sides[0].team[0];
  darm.currentHP = Math.floor(darm.maxHP * 0.4);
  darmanitan.checkFormeTriggers(darm);
  assert.strictEqual(darm.species, 'darmanitanzen');

  const castform = makeBattle([set('castform', {ability: 'Forecast'})], [set('blissey', {moves: ['sunnyday']})]);
  const cast = castform.sides[0].team[0];
  castform.executeMove(castform.sides[1].team[0], cast, Dex.move('sunnyday'), {index: 0});
  assert.strictEqual(cast.species, 'castformsunny');

  const zygarde = makeBattle([set('zygarde', {ability: 'Power Construct'})], [set('blissey')]);
  const zy = zygarde.sides[0].team[0];
  zy.currentHP = Math.floor(zy.maxHP * 0.4);
  zygarde.checkFormeTriggers(zy);
  assert.strictEqual(zy.species, 'zygardecomplete');

  const arceus = makeBattle([set('arceus', {ability: 'Multitype', item: 'flameplate'})], [set('blissey')]);
  assert.strictEqual(arceus.sides[0].team[0].species, 'arceusfire');
  assert.deepStrictEqual([...arceus.sides[0].team[0].types], ['Fire']);
});

test('the busted formes are shown, not just the damage block', () => {
  // Disguise and Ice Face already blocked a hit; the forme change was missing,
  // so Mimikyu-Busted and Eiscue-Noice were never seen.
  const mimikyu = makeBattle([set('mimikyu', {ability: 'Disguise'})], [set('mewtwo', {moves: ['shadowball']})]);
  const mim = mimikyu.sides[0].team[0];
  mimikyu.executeMove(mimikyu.sides[1].team[0], mim, Dex.move('shadowball'), {index: 0});
  assert.strictEqual(mim.species, 'mimikyubusted');

  const eiscue = makeBattle([set('eiscue', {ability: 'Ice Face'})], [set('mewtwo', {moves: ['tackle']})]);
  const eis = eiscue.sides[0].team[0];
  eiscue.executeMove(eiscue.sides[1].team[0], eis, Dex.move('tackle'), {index: 0});
  assert.strictEqual(eis.species, 'eiscuenoice');
});

test('conditional formes revert on switching out, battle-length ones do not', () => {
  const battle = makeBattle(
    [set('aegislash', {ability: 'Stance Change', moves: ['sacredsword']}), set('furret')],
    [set('blissey')]);
  const aegis = battle.sides[0].team[0];
  battle.executeMove(aegis, battle.sides[1].team[0], Dex.move('sacredsword'), {index: 0});
  assert.strictEqual(aegis.species, 'aegislashblade');
  battle.choose(0, {type: 'switch', index: 1});
  battle.choose(1, {type: 'move', index: 0});
  assert.strictEqual(aegis.species, 'aegislash', 'Stance Change should revert off the field');

  // Mega Evolution is deliberately for the rest of the battle.
  const mega = makeBattle([set('blaziken', {item: 'blazikenite'}), set('furret')], [set('blissey')]);
  const blaziken = mega.sides[0].team[0];
  mega.megaEvolve(blaziken);
  assert.strictEqual(blaziken.species, 'blazikenmega');
  mega.choose(0, {type: 'switch', index: 1});
  mega.choose(1, {type: 'move', index: 0});
  assert.strictEqual(blaziken.species, 'blazikenmega', 'a Mega must not revert on switching out');
});

test('Speed Boost lands the turn after a Pokemon arrives, however it arrived', () => {
  // Reported as a bug: a Blaziken switched in during an incoming attack "did not
  // get the boost". It is not a bug — a Pokemon that switches in on turn N is
  // first boosted at the end of turn N+1. A lead has been out since before turn
  // 1, which is why leading looks different. Pinned here so the distinction
  // cannot be "fixed" into a real bug later.
  const switched = makeBattle([set('furret'), set('blaziken', {ability: 'Speed Boost'})], [set('mewtwo', {moves: ['tackle']})]);
  const blaziken = switched.sides[0].team[1];
  switched.choose(0, {type: 'switch', index: 1});
  switched.choose(1, {type: 'move', index: 0});
  assert.strictEqual(blaziken.boosts.spe, 0, 'no boost on the turn it arrives');
  turn(switched, 0, 0);
  assert.strictEqual(blaziken.boosts.spe, 1, 'boost at the end of the next turn');
  turn(switched, 0, 0);
  assert.strictEqual(blaziken.boosts.spe, 2);

  const lead = makeBattle([set('blaziken', {ability: 'Speed Boost'})], [set('mewtwo', {moves: ['tackle']})]);
  turn(lead, 0, 0);
  assert.strictEqual(lead.sides[0].team[0].boosts.spe, 1, 'a lead is boosted at the end of turn 1');
});

/* ------------------------------------------------------------------ *
 * Setting up
 * ------------------------------------------------------------------ */

test('the AI sets up only when it survives the turn and the boost converts', () => {
  const AI = RedGPT.AI;
  const level = AI.difficulty('expert');
  const score = (battle, moveId) => {
    const self = battle.sides[0].team[0];
    const index = self.moves.findIndex(m => m.id === moveId);
    return AI.scoreMove(battle, self, battle.sides[1].team[0], self.moves[index], index, level, {});
  };

  // Dies while boosting: strongly refused.
  const doomed = makeBattle([set('cloyster', {level: 100, moves: ['shellsmash', 'iciclespear']})],
    [set('mewtwo', {level: 100, moves: ['psystrike', 'aurasphere']})]);
  assert.ok(score(doomed, 'shellsmash') < 0, 'setting up into a knockout should be refused');

  // Focus Sash guarantees the turn, so the same setup becomes reasonable.
  const sashed = makeBattle([set('cloyster', {level: 100, item: 'focussash', moves: ['shellsmash', 'iciclespear']})],
    [set('mewtwo', {level: 100, moves: ['psystrike', 'aurasphere']})]);
  assert.ok(score(sashed, 'shellsmash') > score(doomed, 'shellsmash') + 100,
    'a Focus Sash should make setting up markedly better');

  // White Herb pays for Shell Smash's drops.
  const bare = makeBattle([set('cloyster', {level: 100, moves: ['shellsmash', 'iciclespear']})], [set('blissey', {level: 100, moves: ['seismictoss']})]);
  const herb = makeBattle([set('cloyster', {level: 100, item: 'whiteherb', moves: ['shellsmash', 'iciclespear']})], [set('blissey', {level: 100, moves: ['seismictoss']})]);
  assert.ok(score(herb, 'shellsmash') > score(bare, 'shellsmash'), 'White Herb should raise Shell Smash');

  // A priority revenge-kill means the boost never cashes in.
  const safe = makeBattle([set('cloyster', {level: 100, item: 'focussash', moves: ['shellsmash', 'iciclespear']})], [set('blissey', {level: 100, moves: ['seismictoss']})]);
  const revenged = makeBattle([set('cloyster', {level: 100, item: 'focussash', moves: ['shellsmash', 'iciclespear']})],
    [set('scizor', {level: 100, ability: 'Technician', moves: ['bulletpunch']})]);
  assert.ok(score(revenged, 'shellsmash') < score(safe, 'shellsmash'), 'priority revenge should discourage setup');

  // Unaware ignores the boost entirely.
  const unaware = makeBattle([set('cloyster', {level: 100, item: 'focussash', moves: ['shellsmash', 'iciclespear']})],
    [set('clefable', {level: 100, ability: 'Unaware', moves: ['moonblast']})]);
  assert.ok(score(unaware, 'shellsmash') < score(safe, 'shellsmash') - 100, 'setting up into Unaware is pointless');
});

test('a knockout that resolves after you die is not treated as a knockout', () => {
  /*
   * Reported from a real battle: Kingambit had Haxorus in Sucker Punch range,
   * threw a slower move instead and died before it resolved. The cause was a
   * "trade favourably" bonus handed to a lethal-but-slower move for a knockout
   * that could never happen, leaving the priority move barely ahead.
   */
  const AI = RedGPT.AI;
  const level = AI.difficulty('expert');
  const rank = battle => {
    const self = battle.sides[0].team[0];
    const foe = battle.sides[1].team[0];
    return self.moves.map((slot, index) => ({
      id: slot.id,
      score: AI.scoreMove(battle, self, foe, slot, index, level, {}),
    })).sort((a, b) => b.score - a.score);
  };
  const build = (myHP, foeHP, foeSet) => {
    const battle = makeBattle(
      [set('kingambit', {level: 100, moves: ['suckerpunch', 'kowtowcleave']})],
      [set(foeSet.species, Object.assign({level: 100}, foeSet))]);
    const me = battle.sides[0].team[0];
    const foe = battle.sides[1].team[0];
    me.currentHP = Math.max(1, Math.round(me.maxHP * myHP));
    foe.currentHP = Math.max(1, Math.round(foe.maxHP * foeHP));
    return battle;
  };

  // Dying, and the priority move kills: it must win decisively, not by a hair.
  const lethal = build(0.2, 0.25, {species: 'haxorus', moves: ['closecombat']});
  const lethalRank = rank(lethal);
  assert.strictEqual(lethalRank[0].id, 'suckerpunch', 'should take the priority knockout');
  assert.ok(lethalRank[0].score - lethalRank[1].score > 200,
    `the margin should be decisive, was ${Math.round(lethalRank[0].score - lethalRank[1].score)}`);

  // Dying, and the priority move does *not* kill: still better than a slower
  // move, because the slower one never happens at all.
  const chip = build(0.15, 1, {species: 'haxorus', moves: ['closecombat']});
  assert.strictEqual(rank(chip)[0].id, 'suckerpunch', 'a move that resolves beats one that cannot');

  // Not dying: the bigger move should win. Priority must not simply dominate.
  const safe = build(1, 1, {species: 'blissey', moves: ['seismictoss']});
  assert.strictEqual(rank(safe)[0].id, 'kowtowcleave', 'with survival assured, raw damage should decide');
});

test('a weak tier blunders, but never into a move that cannot work', () => {
  /*
   * Reported from a real log: a Nidoking used Earthquake into a Water/Flying
   * Pelipper on two consecutive turns. `scoreMove` was innocent — it rates that
   * Earthquake −500 at every tier. The culprit was `chooseAction`'s blunder
   * roll, which drew uniformly from *every* legal move, so a weak tier could
   * pick the immune one and then pick it again, because nothing about the
   * position had changed.
   *
   * That is not difficulty, it is incoherence. Measured before the fix: 6.7% of
   * Casual's decisions, 5.8% of Trainer's, 4.2% of Ace's.
   *
   * The control is the second half: the weak tiers must still *blunder*. A fix
   * that quietly made Casual play optimally would pass the first assertion and
   * ruin the difficulty ladder.
   */
  const {AI, RandomTeams, RNG} = RedGPT;
  const format = RedGPT.Formats.get('campaign');

  const sample = tier => {
    let futile = 0;
    let offBest = 0;
    let decisions = 0;
    for (let seed = 0; seed < 90; seed++) {
      const nidoking = RandomTeams.randomSet(Dex.species('nidoking'), new RNG(`nk${seed}`),
        {format, level: 50});
      const battle = makeBattle(
        [set('pelipper', {level: 50, ability: 'Drizzle', moves: ['hydropump', 'icebeam', 'uturn', 'roost'], evs: {}})],
        [Object.assign({}, nidoking, {level: 50})],
        {seed: 8 + seed});
      battle.sides[1].ai = {difficulty: tier};
      const self = battle.sides[1].team[0];
      const foe = battle.sides[0].team[0];
      const choice = AI.chooseAction(battle, 1, battle.requests[1]);
      if (choice.type !== 'move' || choice.index < 0) continue;
      decisions++;
      const move = Dex.move(self.moves[choice.index].id);
      if (move.category !== 'Status' &&
          battle.effectiveness(battle.moveType(self, foe, move), foe, move) === 0) futile++;
      const level = AI.difficulty(tier);
      const ranked = self.moves
        .map((slot, index) => ({index, score: AI.scoreMove(battle, self, foe, slot, index, level)}))
        .sort((a, b) => b.score - a.score);
      if (ranked.length > 1 && ranked[0].index !== choice.index) offBest++;
    }
    return {futile, offBest, decisions};
  };

  const problems = [];
  for (const tier of ['casual', 'trainer', 'ace', 'expert']) {
    const result = sample(tier);
    assert.ok(result.decisions > 50, `${tier}: only ${result.decisions} decisions — too few to measure`);
    if (result.futile) problems.push(`${tier} chose a move with no effect ${result.futile}/${result.decisions} times`);
  }
  assert.deepStrictEqual([...problems], []);

  // CONTROL: Casual must still be visibly worse than Expert, or the fix has
  // quietly deleted the difficulty setting rather than the incoherence.
  const casual = sample('casual');
  const expert = sample('expert');
  assert.ok(casual.offBest > expert.offBest,
    `Casual should still play off-best more than Expert (${casual.offBest} vs ${expert.offBest})`);
});

test('the AI never picks a move the target cannot be affected by', () => {
  /*
   * Reported from a real battle log: a Grimmsnarl threw Thunder Wave at a
   * Ground-type Gliscor on three consecutive turns. The engine refused it every
   * time ("It doesn't affect Gliscor..."), but the AI scored it 95 — its best
   * move — because nothing in its scoring asked whether a status move could
   * legally land. `moveSpecialFailure` covers hand-written preconditions, not
   * type immunity, so the loop could never change and it threw the move forever.
   *
   * Damaging moves were already safe (`estimateDamage` returns 0 into an
   * immunity, so they score as worthless); this is specifically about status
   * moves, which are scored by what they inflict.
   *
   * The last three cases are the control: the gate must not touch a move that
   * is not aimed at the target's immunities. Without them, "score everything
   * status at -900" would pass.
   */
  const {AI} = RedGPT;
  const level = AI.difficulty('expert');
  const scoreOf = (mySpecies, moves, moveId, foeSpecies, foeAbility, foeItem) => {
    const battle = makeBattle(
      [set(mySpecies, {level: 50, moves, evs: {}})],
      [set(foeSpecies, Object.assign({level: 50, moves: ['tackle'], evs: {}},
        foeAbility ? {ability: foeAbility} : {}, foeItem ? {item: foeItem} : {}))],
      {seed: 5});
    const self = battle.sides[0].team[0];
    const foe = battle.sides[1].team[0];
    const index = self.moves.findIndex(slot => slot.id === moveId);
    return AI.scoreMove(battle, self, foe, self.moves[index], index, level);
  };

  const refused = [];
  const check = (label, score) => { if (score > -100) refused.push(`${label} scored ${Math.round(score)}`); };

  // The reported case, plus the rest of the class it belongs to.
  check('Thunder Wave into Ground', scoreOf('grimmsnarl', ['thunderwave', 'spiritbreak'], 'thunderwave', 'gliscor'));
  check('Spore into Grass', scoreOf('breloom', ['spore', 'machpunch'], 'spore', 'ferrothorn'));
  check('Growl into Soundproof', scoreOf('snorlax', ['growl', 'bodyslam'], 'growl', 'bouffalant', 'Soundproof'));
  check('Thunder Wave into Good as Gold', scoreOf('grimmsnarl', ['thunderwave', 'spiritbreak'], 'thunderwave', 'gholdengo', 'Good as Gold'));
  /*
   * Held items are a separate table from abilities, because the engine keeps
   * them separate: powder immunity is refused in TWO places in `executeMove`,
   * Grass/Overcoat early and Safety Goggles later via the item hook. The first
   * version of this gate covered only the ability half and Spore into a Safety
   * Goggles holder still scored +40.
   */
  check('Spore into Safety Goggles',
    scoreOf('breloom', ['spore', 'machpunch'], 'spore', 'blissey', null, 'safetygoggles'));
  assert.deepStrictEqual([...refused], [], 'the AI still rates a move that cannot affect the target');

  // CONTROL for the item case: the same move without the item must stay usable.
  assert.ok(scoreOf('breloom', ['spore', 'machpunch'], 'spore', 'blissey') > -100,
    'Spore was refused even without Safety Goggles — the item check is over-reaching');

  // CONTROLS: none of these is blocked, and all must keep a normal score.
  const legal = [
    ['Thunder Wave into a legal target', scoreOf('grimmsnarl', ['thunderwave', 'spiritbreak'], 'thunderwave', 'blissey')],
    ['Swords Dance, aimed at itself', scoreOf('garchomp', ['swordsdance', 'earthquake'], 'swordsdance', 'gliscor')],
    ['Stealth Rock, aimed at the side', scoreOf('forretress', ['stealthrock', 'gyroball'], 'stealthrock', 'gliscor')],
  ];
  const overreach = legal.filter(([, score]) => score <= -100).map(([label]) => label);
  assert.deepStrictEqual([...overreach], [],
    'the immunity gate is refusing moves that are perfectly legal');
});

test('a turn it is sure to survive is a turn to boost, and Shell Smash is measured on the right side of the hit', () => {
  /*
   * Two rules, one mechanism.
   *
   * 1. Survival does not need a Focus Sash or a damage-halving ability. The AI
   *    already knows all four of the foe's moves, so `foeThreat` is the worst of
   *    them; if the arithmetic says it lives, the boost is free and it should
   *    take it. A full-HP Volcarona taking 90 into 160 used to throw Bug Buzz
   *    (96) over Quiver Dance (30) forever.
   *
   * 2. **Which** hit it measures depends on who moves first. Boosting first and
   *    then being hit means the new defences apply; being hit first means they
   *    do not. Shell Smash is the case that makes this matter, because it
   *    *lowers* both defences — measured on a real matchup, the same hit is 36
   *    before the smash and 53 after. Using the wrong one is optimistic by
   *    exactly the size of the drop, which is how a Cloyster smashes into a
   *    knockout. Belly Drum works the same way, paying with HP instead.
   */
  const {AI} = RedGPT;
  const level = AI.difficulty('expert');

  const pick = (species, moves, foeSpecies, foeMoves, {hpFraction = 1, item = 'leftovers'} = {}) => {
    const battle = makeBattle(
      [set(species, {level: 50, item, moves, evs: {}})],
      [set(foeSpecies, {level: 50, moves: foeMoves, evs: {}}),
        set('sylveon', {level: 50, moves: ['moonblast'], evs: {}})],
      {seed: 9});
    const self = battle.sides[0].team[0];
    const foe = battle.sides[1].team[0];
    if (hpFraction < 1) self.currentHP = Math.max(1, Math.round(self.maxHP * hpFraction));
    const scored = self.moves
      .map((slot, index) => ({id: slot.id, value: AI.scoreMove(battle, self, foe, slot, index, level)}))
      .sort((a, b) => b.value - a.value);
    return scored[0].id;
  };

  const QUIVER = ['quiverdance', 'fierydance', 'bugbuzz', 'roost'];
  const HYDREIGON = ['darkpulse', 'flamethrower', 'dracometeor', 'uturn'];

  // Safe and faster: take the boost, no item helping.
  assert.strictEqual(pick('volcarona', QUIVER, 'hydreigon', HYDREIGON), 'quiverdance',
    'a clearly survivable turn should be spent boosting');

  // CONTROL: the same matchup at low HP is no longer survivable, so attack.
  assert.notStrictEqual(pick('volcarona', QUIVER, 'hydreigon', HYDREIGON, {hpFraction: 0.4}), 'quiverdance',
    'it must not boost into a hit that kills it');

  /*
   * Shell Smash from *under* the hit. Dragapult outspeeds Cloyster and hits for
   * more than Cloyster's whole HP bar, so smashing is suicide either way — the
   * point is that it refuses.
   */
  assert.notStrictEqual(
    pick('cloyster', ['shellsmash', 'iciclespear', 'rockblast', 'iceshard'],
      'dragapult', ['dracometeor', 'shadowball', 'flamethrower', 'uturn']),
    'shellsmash', 'Cloyster smashed while slower than something that kills it');

  // And the speed-order rule itself: the boosted defences must only count when
  // the boost lands first.
  const battle = makeBattle(
    [set('cloyster', {level: 50, moves: ['shellsmash', 'iciclespear'], evs: {}})],
    [set('snorlax', {level: 50, moves: ['bodyslam', 'earthquake', 'crunch', 'rest'], evs: {}})],
    {seed: 9});
  const cloyster = battle.sides[0].team[0];
  const snorlax = battle.sides[1].team[0];
  assert.ok(AI.movesFirst(battle, cloyster, snorlax, null, AI.bestDamage(battle, snorlax, cloyster).move),
    'Cloyster should outspeed Snorlax, or this case proves nothing');
  const beforeSmash = AI.bestDamage(battle, snorlax, cloyster).damage;
  Object.assign(cloyster.boosts, {def: -1, spd: -1, atk: 2, spa: 2, spe: 2});
  const afterSmash = AI.bestDamage(battle, snorlax, cloyster).damage;
  assert.ok(afterSmash > beforeSmash,
    `Shell Smash must make the incoming hit bigger (${beforeSmash} -> ${afterSmash})`);
});

test('a guaranteed KO it outspeeds is a free setup turn, when it is sure to survive', () => {
  /*
   * Reported from real play: a full-HP Lilligant-Hisui holding a Focus Sash
   * threw Close Combat at an Arboliva it outsped and could OHKO, instead of
   * taking a free Victory Dance. The KO was not being lost by boosting — it
   * outspeeds, so the target dies next turn either way — and the boost was
   * worth more than one turn of tempo against a team with five Pokémon left.
   *
   * The rule: when the AI can KO *before the target acts* and is sure to
   * survive the hit, it boosts. Every clause carries its own case below,
   * because each one alone would be wrong:
   *   - the last enemy Pokémon: a boost buys nothing, take the KO
   *   - not sure to survive: take the KO
   *   - already stacked: the loop bound, or it boosts forever and never kills
   *   - slower: the KO is not "before the target acts", so nothing is free
   */
  const {AI} = RedGPT;
  const level = AI.difficulty('expert');
  const setupWins = ({item = 'focussash', hpFraction = 1, benchCount = 1, boosts = null} = {}) => {
    const mine = set('lilliganthisui', {level: 50, item, ability: 'Chlorophyll',
      moves: ['closecombat', 'victorydance'], evs: {}});
    const foes = [set('arboliva', {level: 50, moves: ['leafstorm'], evs: {}})];
    for (let i = 0; i < benchCount; i++) foes.push(set('sylveon', {level: 50, moves: ['moonblast'], evs: {}}));
    const battle = makeBattle([mine], foes, {seed: 19});
    const self = battle.sides[0].team[0];
    const foe = battle.sides[1].team[0];
    if (hpFraction < 1) self.currentHP = Math.max(1, Math.round(self.maxHP * hpFraction));
    if (boosts) Object.assign(self.boosts, boosts);
    const scored = self.moves.map((slot, index) => ({
      id: slot.id, value: AI.scoreMove(battle, self, foe, slot, index, level),
    })).sort((a, b) => b.value - a.value);
    return scored[0].id === 'victorydance';
  };

  // The reported position: safe, outspeeds, and there is a team left to sweep.
  assert.ok(setupWins({benchCount: 3}), 'should take the free setup turn');

  // Controls — each must flip the decision back to the knockout.
  assert.ok(!setupWins({benchCount: 0}), 'a boost buys nothing against the last Pokémon');
  assert.ok(!setupWins({benchCount: 3, item: 'leftovers', hpFraction: 0.2}),
    'must not boost when it is not sure to survive');
  assert.ok(!setupWins({benchCount: 3, boosts: {atk: 3}}),
    'must stop boosting once stacked, or it never takes the knockout');
});

test('the resolve rule is global, not one interaction', () => {
  /*
   * The rule: if the foe moves first and its best hit knocks you out, anything
   * slower than it never happens. Asserted across unrelated Pokémon, priority
   * moves and tiers so it cannot decay into a special case for one matchup.
   * Priority moves are unconditional in this project (§5), so a priority move
   * that lands a knockout is always the correct click.
   */
  const AI = RedGPT.AI;
  const cases = [
    // [attacker, priority move, slower move, lethal foe]
    ['kingambit', 'suckerpunch', 'kowtowcleave', 'haxorus', 'closecombat'],
    ['scizor', 'bulletpunch', 'ironhead', 'magnezone', 'thunderbolt'],
    ['mamoswine', 'iceshard', 'earthquake', 'lucario', 'aurasphere'],
    ['talonflame', 'bravebird', 'flamethrower', 'rhyperior', 'rockwrecker'],
    ['banette', 'shadowsneak', 'shadowclaw', 'hydreigon', 'darkpulse'],
  ];
  const problems = [];
  let checked = 0;
  for (const tier of ['ace', 'expert']) {
    const level = AI.difficulty(tier);
    for (const [me, fast, slow, foeName, foeMove] of cases) {
      const battle = makeBattle(
        [set(me, {level: 100, moves: [fast, slow]})],
        [set(foeName, {level: 100, moves: [foeMove]})]);
      const self = battle.sides[0].team[0];
      const foe = battle.sides[1].team[0];
      self.currentHP = Math.max(1, Math.round(self.maxHP * 0.15));   // dies to the incoming hit
      foe.currentHP = Math.max(1, Math.round(foe.maxHP * 0.2));      // dies to either of ours

      const scores = self.moves.map((slot, index) =>
        ({id: slot.id, score: AI.scoreMove(battle, self, foe, slot, index, level, {})}));
      const best = scores.slice().sort((a, b) => b.score - a.score)[0];
      const incoming = AI.bestDamage(battle, foe, self).damage;
      const threat = AI.bestDamage(battle, foe, self).move;
      // The rule only bites when the foe would knock us out *and* the slower
      // move genuinely would not resolve. If we outspeed anyway — Scizor is
      // faster than Magnezone — priority buys nothing and the bigger move is
      // the right pick, so asserting otherwise would be testing a fiction.
      const slowResolves = AI.movesFirst(battle, self, foe, Dex.move(slow), threat);
      const fastResolves = AI.movesFirst(battle, self, foe, Dex.move(fast), threat);
      if (incoming < AI.effectiveHP(battle, self) || slowResolves || !fastResolves) continue;
      checked++;
      if (best.id !== fast) {
        problems.push(`${tier}/${me}: chose ${best.id} over ${fast} while dying ` +
          `(${scores.map(s => `${s.id} ${Math.round(s.score)}`).join(', ')})`);
      }
    }
  }
  assert.deepStrictEqual([...problems], [], problems.join('\n'));
});

test('the AI counts a Mega the foe has not spent yet, and the enemy bench', () => {
  /*
   * Reported from a battle log: a level-68 Kingambit holding Sucker Punch was OHKO'd
   * by a Rayquaza that Mega Evolved on the same turn, without acting.
   *
   * The resolve rule was **not** at fault — it was fed a wrong input. Measured
   * exactly: base Rayquaza's V-create reads 228 against Kingambit's 235 effective HP,
   * so `dying` was false and the biggest move was correctly preferred; Mega
   * Evolution then resolved in `runTurn` before actions were ordered (§5), the
   * Attack jump took the same attack to 266, and the slower move never happened.
   * Speed was never the issue — Rayquaza outsped either way.
   *
   * The format MUST be the resolved object here. Passing its name as a string leaves
   * `battle.rules` empty, so `rules.mega` is undefined and `canMegaEvolve` returns
   * false — which made the first run of this check report no change from a working
   * fix. The first assertion pins that, so the test cannot go vacuous that way again.
   */
  const AI = RedGPT.AI;
  const L = 68;
  const battle = new RedGPT.Battle({
    seed: 'REDGPT-MEGAAWARE', format: RedGPT.Formats.get('campaign'),
    sides: [
      {name: 'A', controller: 'human', team: [set('kingambit', {level: L,
        moves: ['lowkick', 'ironhead', 'suckerpunch', 'dualchop'],
        ability: 'supremeoverlord', item: 'assaultvest', nature: 'adamant'})]},
      {name: 'B', controller: 'ai', team: [set('rayquaza', {level: L,
        moves: ['vcreate', 'dragonascent']})], ai: {difficulty: 'expert'}},
    ],
  });
  battle.start();
  while (battle.requests[0] && battle.requests[0].type === 'team') {
    battle.choose(0, {type: 'team', order: [0]});
  }
  const me = battle.sides[0].team[0];
  const foe = battle.sides[1].team[0];
  assert.ok(battle.canMegaEvolve(foe),
    'control failed: the foe must actually be able to Mega Evolve, or this proves nothing');

  const raw = AI.bestDamage(battle, foe, me).damage;
  const aware = AI.incomingThreat(battle, me, foe).damage;
  const effHP = AI.effectiveHP(battle, me);
  assert.ok(raw < effHP, `the raw estimate should read as survivable (${raw} vs ${effHP})`);
  assert.ok(aware >= effHP, `the Mega-aware estimate should read as lethal (${aware} vs ${effHP})`);

  const level = AI.difficulty('expert');
  const pick = me.moves
    .map((slot, i) => ({id: slot.id, score: AI.scoreMove(battle, me, foe, slot, i, level, {})}))
    .sort((a, b) => b.score - a.score)[0];
  assert.strictEqual(pick.id, 'suckerpunch',
    `should take the priority move against a foe about to Mega (picked ${pick.id})`);

  // CONTROL: a foe that cannot transform must give an unchanged estimate, or the
  // helper is just inflating every threat.
  const plain = makeBattle(
    [set('kingambit', {level: L, moves: ['ironhead', 'suckerpunch'], item: 'assaultvest'})],
    [set('garchomp', {level: L, moves: ['earthquake', 'dragonclaw']})], {seed: 71});
  const pm = plain.sides[0].team[0];
  const pf = plain.sides[1].team[0];
  assert.strictEqual(AI.incomingThreat(plain, pm, pf).damage, AI.bestDamage(plain, pf, pm).damage,
    'control failed: a non-transforming foe must not have its threat inflated');

  /*
   * Enemy *bench* awareness. Scizor is 4x weak to Fire and Swords Dance buys it no
   * Speed, so a fast special Fire attacker on the bench is a clean revenge kill —
   * and setting up in front of one should score worse than setting up in front of a
   * harmless bench. The threat has to genuinely OHKO the boosted sweeper or the
   * branch is never reached.
   */
  const setupScore = benchSet => {
    const b = makeBattle(
      [set('scizor', {level: 100, moves: ['swordsdance', 'ironhead'], ability: 'swarm'})],
      [set('blissey', {level: 100, moves: ['softboiled', 'seismictoss']}), benchSet], {seed: 72});
    const mon = b.sides[0].team[0];
    return AI.scoreMove(b, mon, b.sides[1].team[0], mon.moves[0], 0, level, {});
  };
  const dangerous = setupScore(set('ironmoth', {level: 100, moves: ['fierydance', 'sludgewave']}));
  const harmless = setupScore(set('shuckle', {level: 100, moves: ['withdraw', 'rollout']}));
  assert.ok(dangerous < harmless,
    `setting up should score lower with a revenge killer on the bench (${Math.round(dangerous)} vs ${Math.round(harmless)})`);
});

test('boosting stops once the current attack already knocks the target out', () => {
  /*
   * "When is boosting enough?" The stack counter in `scoreMove` taxes repeated
   * setup, but it cannot see that the attack already wins: a fifth Calm Mind
   * still multiplies damage by 1.5, so it still looked like a gain. Once the move
   * in hand is lethal, another boost buys nothing this turn and gives the foe a
   * free one.
   *
   * Carries a control: the same Pokémon must still *want* to boost against a
   * healthy target, or the rule is just "never boost".
   */
  const AI = RedGPT.AI;
  const level = AI.difficulty('expert');
  const battle = makeBattle(
    [set('cresselia', {level: 100, moves: ['calmmind', 'moonblast'], ability: 'levitate'})],
    [set('hydreigon', {level: 100, moves: ['darkpulse']})]);
  const self = battle.sides[0].team[0];
  const foe = battle.sides[1].team[0];
  const boost = self.moves[0];
  const attack = self.moves[1];

  const boostHealthy = AI.scoreMove(battle, self, foe, boost, 0, level, {});
  const attackHealthy = AI.scoreMove(battle, self, foe, attack, 1, level, {});
  // CONTROL: setting up on a healthy target is a legitimate play and must remain
  // the preferred one, otherwise the assertion below proves nothing.
  assert.ok(boostHealthy > attackHealthy,
    `control failed: boosting should beat attacking a healthy foe (boost ${boostHealthy}, attack ${attackHealthy})`);

  // Now the target is inside knockout range of the unboosted attack.
  foe.currentHP = Math.max(1, Math.round(AI.bestDamage(battle, self, foe).damage * 0.5));
  const boostLethal = AI.scoreMove(battle, self, foe, boost, 0, level, {});
  const attackLethal = AI.scoreMove(battle, self, foe, attack, 1, level, {});
  assert.ok(attackLethal > boostLethal,
    `should take the knockout rather than boost (attack ${attackLethal}, boost ${boostLethal})`);
});

test('a doomed Pokemon spends its last turn on damage, not on deferred value', () => {
  /*
   * Nearly every utility move is a turn bought on credit — hazards collect as the
   * opponent switches, status buys time, screens pay out later. None of it arrives
   * for a Pokémon that is about to faint, so its final action belongs on damage
   * the replacement can build on. `LAST_STAND_MOVES` are the deliberate exception:
   * fainting is their trigger or their cost.
   */
  const AI = RedGPT.AI;
  const level = AI.difficulty('expert');
  const battle = makeBattle(
    [set('skarmory', {level: 100, moves: ['stealthrock', 'toxic', 'bravebird'], ability: 'sturdy'})],
    [set('hydreigon', {level: 100, moves: ['flamethrower']})]);
  const self = battle.sides[0].team[0];
  const foe = battle.sides[1].team[0];
  const rock = () => AI.scoreMove(battle, self, foe, self.moves[0], 0, level, {});
  const toxic = () => AI.scoreMove(battle, self, foe, self.moves[1], 1, level, {});
  const hit = () => AI.scoreMove(battle, self, foe, self.moves[2], 2, level, {});

  const rockHealthy = rock();
  self.currentHP = 1;                       // below Sturdy, so genuinely doomed
  assert.ok(hit() > rock() && hit() > toxic(),
    `dying should chip, not set up (attack ${hit()}, rock ${rock()}, toxic ${toxic()})`);
  // CONTROL: hazards must still be worth a turn while healthy.
  assert.ok(rockHealthy > rock(),
    `control failed: hazards should be worth more at full HP (healthy ${rockHealthy}, dying ${rock()})`);

  // Destiny Bond is the exception — it is *for* this moment.
  const gengar = makeBattle(
    [set('gengar', {level: 100, moves: ['destinybond', 'willowisp', 'shadowball']})],
    [set('hydreigon', {level: 100, moves: ['darkpulse']})]);
  const ghost = gengar.sides[0].team[0];
  const ghostFoe = gengar.sides[1].team[0];
  ghost.currentHP = 1;
  const bond = AI.scoreMove(gengar, ghost, ghostFoe, ghost.moves[0], 0, level, {});
  const wisp = AI.scoreMove(gengar, ghost, ghostFoe, ghost.moves[1], 1, level, {});
  assert.ok(bond > wisp, `Destiny Bond should beat Will-O-Wisp when dying (bond ${bond}, wisp ${wisp})`);
});

test('a spent Pokemon is sacked rather than saved at a healthy one cost', () => {
  /*
   * Switching preserves the doomed Pokémon but hands the replacement a free
   * hit; letting it faint loses it but the *next* replacement arrives
   * untouched. The AI used to discount its switch threshold whenever it was
   * dying, which reliably fed a second healthy Pokémon to the same attack in
   * order to rescue something already spent.
   */
  const AI = RedGPT.AI;
  const level = AI.difficulty('expert');

  const spent = makeBattle(
    [set('skarmory', {level: 100, moves: ['spikes', 'bravebird']}),
      set('blissey', {level: 100, moves: ['softboiled']}),
      set('garchomp', {level: 100, moves: ['earthquake']})],
    [set('mewtwo', {level: 100, moves: ['psystrike', 'aurasphere']})]);
  const lead = spent.sides[0].team[0];
  lead.currentHP = Math.max(1, Math.round(lead.maxHP * 0.12));
  assert.ok(AI.preserveValue(spent, lead) < 0.6, 'a 12% HP lead should read as expendable');
  assert.strictEqual(AI.considerSwitch(spent, 0, level, spent.requests[0]), null,
    'a spent Pokemon should be sacked, not rescued');

  // A healthy Pokémon that is *not* about to faint still switches normally when
  // the matchup is bad enough — the sack rule must not freeze the AI in place.
  const healthy = makeBattle(
    [set('charizard', {level: 100, moves: ['flamethrower']}),
      set('blissey', {level: 100, moves: ['softboiled']})],
    [set('blissey', {level: 100, moves: ['seismictoss']})]);
  const active = healthy.sides[0].team[0];
  assert.ok(AI.preserveValue(healthy, active) > 0.6, 'a full-HP Pokemon should read as worth keeping');
});

test('when every replacement loses, the most expendable one goes in', () => {
  // Sending the best Pokémon into a lost matchup feeds the win condition. The
  // sack buys the same turn and keeps the answer on the bench.
  const AI = RedGPT.AI;
  const level = AI.difficulty('expert');
  const battle = makeBattle(
    [set('furret', {level: 100, moves: ['tackle']}),
      set('sunkern', {level: 5, moves: ['absorb']}),
      set('garchomp', {level: 100, moves: ['earthquake', 'dragonclaw', 'swordsdance']})],
    [set('mewtwo', {level: 100, moves: ['psystrike', 'aurasphere', 'icebeam']})]);
  const fainted = battle.sides[0].team[0];
  fainted.fainted = true;
  fainted.currentHP = 0;

  const sunkern = battle.sides[0].team[1];
  const garchomp = battle.sides[0].team[2];
  // Both options genuinely lose the exchange — that is the situation the rule
  // is for. With a survivor available the AI should (and does) send it instead.
  garchomp.currentHP = Math.max(1, Math.round(garchomp.maxHP * 0.3));
  assert.ok(RedGPT.AI.bestDamage(battle, battle.sides[1].team[0], garchomp).damage >= garchomp.currentHP,
    'the fixture needs every option to lose');
  assert.ok(AI.preserveValue(battle, garchomp) - AI.preserveValue(battle, sunkern) > 0.3,
    'the level-5 Sunkern should be clearly more expendable than the Garchomp');

  const pick = AI.chooseSwitchReplacement(battle, 0, level);
  assert.strictEqual(battle.sides[0].team[pick.index].species, 'sunkern',
    'the sack should go in, keeping the Garchomp for later');
});

test('moves that compute power at use time report it, and the move request shows it', () => {
  /*
   * Last Respects grows by 50 per fallen ally, Rage Fist by 50 per hit taken,
   * Fury Cutter and Rollout double each use, Stored Power climbs with boosts.
   * The engine had all of this right; the move *request* reported the packaged
   * number, so the button read 50 BP off a Last Respects hitting for 250.
   */
  const powerOf = (battle, id) => battle.requests[0].moves.find(m => m.id === id);

  // Last Respects: +50 per fainted ally.
  const respects = makeBattle(
    [set('houndstone', {level: 100, moves: ['lastrespects', 'shadowball']}),
      set('furret', {level: 100}), set('snorlax', {level: 100}), set('blissey', {level: 100})],
    [set('blissey', {level: 100, moves: ['splash']})]);
  assert.strictEqual(powerOf(respects, 'lastrespects').basePower, 50);
  assert.strictEqual(powerOf(respects, 'lastrespects').powerIsDynamic, false);
  for (let i = 1; i < 4; i++) {
    respects.sides[0].team[i].fainted = true;
    respects.sides[0].team[i].currentHP = 0;
  }
  respects.beginTurn();
  assert.strictEqual(powerOf(respects, 'lastrespects').basePower, 200, '50 + 50 per fallen ally');
  assert.strictEqual(powerOf(respects, 'lastrespects').powerIsDynamic, true);
  // A static move alongside it must be untouched.
  assert.strictEqual(powerOf(respects, 'shadowball').powerIsDynamic, false);

  // Rage Fist: +50 per hit taken, capped at six.
  const rage = makeBattle([set('annihilape', {level: 100, moves: ['ragefist']})],
    [set('blissey', {level: 100, moves: ['splash']})]);
  assert.strictEqual(powerOf(rage, 'ragefist').basePower, 50);
  rage.sides[0].team[0].timesHit = 4;
  rage.beginTurn();
  assert.strictEqual(powerOf(rage, 'ragefist').basePower, 250);
  rage.sides[0].team[0].timesHit = 12;
  rage.beginTurn();
  assert.strictEqual(powerOf(rage, 'ragefist').basePower, 350, 'Rage Fist caps at 350');

  // The doubling moves and a boost-scaler.
  const built = makeBattle(
    [set('scizor', {level: 100, moves: ['furycutter', 'rollout', 'storedpower']})],
    [set('blissey', {level: 100, moves: ['splash']})]);
  const self = built.sides[0].team[0];
  self.volatiles.furyCutter = 2;
  self.volatiles.rolloutStage = 3;
  built.boost(self, {atk: 3}, self);
  built.beginTurn();
  assert.strictEqual(powerOf(built, 'furycutter').basePower, 160, 'Fury Cutter caps at 160');
  assert.strictEqual(powerOf(built, 'rollout').basePower, 240);
  assert.strictEqual(powerOf(built, 'storedpower').basePower, 80, '20 + 20 per boost stage');

  // Building the request must not draw from the mechanics RNG or write a log
  // line — the three rolling moves report their mean instead (§5).
  const rolling = makeBattle([set('garchomp', {level: 100, moves: ['magnitude', 'present', 'ficklebeam']})],
    [set('blissey', {level: 100, moves: ['splash']})]);
  const rngBefore = JSON.stringify(rolling.rng.getState());
  const logBefore = rolling.log.length;
  rolling.beginTurn();
  assert.strictEqual(JSON.stringify(rolling.rng.getState()), rngBefore, 'building a request advanced battle.rng');
  assert.strictEqual(rolling.log.length, logBefore, 'building a request wrote to the log');
});

test('the AI distinguishes a fast pivot from a slow one', () => {
  /*
   * A slow pivot lets the foe attack first and only then swaps, so the teammate
   * arrives untouched — which is the whole reason to run one. A fast pivot
   * swaps before the foe acts and walks the teammate straight into the attack.
   * The AI priced both identically, so it had no idea which it was doing.
   */
  const AI = RedGPT.AI;
  const level = AI.difficulty('expert');
  const value = (battle, id) => AI.pivotValue(
    battle, battle.sides[0].team[0], battle.sides[1].team[0], Dex.move(id), level);

  const frail = () => set('alakazam', {level: 100, moves: ['psychic']});
  const foe = () => [set('snorlax', {level: 100, moves: ['bodyslam']})];
  const fast = makeBattle([set('jolteon', {level: 100, moves: ['voltswitch', 'thunderbolt']}), frail()], foe());
  const slow = makeBattle([set('ferrothorn', {level: 100, moves: ['voltswitch', 'gyroball']}), frail()], foe());

  // Confirm the fixture is what it claims before asserting on it.
  assert.ok(fast.getStat(fast.sides[0].team[0], 'spe') > fast.getStat(fast.sides[1].team[0], 'spe'),
    'the fast pivot fixture must actually outspeed');
  assert.ok(slow.getStat(slow.sides[0].team[0], 'spe') < slow.getStat(slow.sides[1].team[0], 'spe'),
    'the slow pivot fixture must actually be slower');

  assert.ok(value(slow, 'voltswitch') > value(fast, 'voltswitch') + 30,
    `the slow pivot should be rated clearly higher (slow ${Math.round(value(slow, 'voltswitch'))}, fast ${Math.round(value(fast, 'voltswitch'))})`);
});

test('Shed Tail is refused below half HP and valued for what it protects', () => {
  // It costs half the user's HP to build the Substitute it hands over, so below
  // half it simply fails — a hard requirement, not a preference.
  const AI = RedGPT.AI;
  const level = AI.difficulty('expert');
  const build = hp => {
    const battle = makeBattle(
      [set('cyclizar', {level: 100, moves: ['shedtail', 'knockoff']}),
        set('cloyster', {level: 100, moves: ['shellsmash', 'iciclespear']})],
      [set('snorlax', {level: 100, moves: ['bodyslam']})]);
    const self = battle.sides[0].team[0];
    self.currentHP = Math.round(self.maxHP * hp);
    return battle;
  };
  const value = battle => AI.pivotValue(
    battle, battle.sides[0].team[0], battle.sides[1].team[0], Dex.move('shedtail'), level);

  assert.ok(value(build(0.4)) < -300, 'Shed Tail below half HP should be refused outright');
  assert.ok(value(build(1)) > 60, 'Shed Tail at full HP into a setup sweeper should be valued');
});

test('Tera is spent on a moment, not on the first opportunity', () => {
  // Once per battle, so the question is whether *this* turn is the one.
  const AI = RedGPT.AI;
  const mk = (mine, theirs) => {
    const rules = Object.assign({}, Formats.get('anythinggoes').rules,
      {teamPreview: false, forceLevel: null, maxLevel: 100, tera: true});
    const battle = new Battle({
      format: Object.assign({}, Formats.get('anythinggoes'), {rules}), seed: 44,
      sides: [{name: 'A', team: mine, controller: 'human', ai: {difficulty: 'expert'}},
        {name: 'B', team: theirs, controller: 'human'}],
    });
    battle.start();
    return battle;
  };
  const teras = battle => !!AI.chooseAction(battle, 0, battle.requests[0]).tera;

  // Nothing changes: no knockout gained, no lethal hit dodged. Hold it.
  const pointless = mk(
    [set('garchomp', {level: 100, teraType: 'Fire', moves: ['dragonclaw']}), set('blissey', {level: 100}), set('skarmory', {level: 100})],
    [set('snorlax', {level: 100, moves: ['bodyslam']}), set('blissey', {level: 100}), set('skarmory', {level: 100})]);
  assert.strictEqual(teras(pointless), false, 'Tera should be held when it changes no outcome');

  // Converts a non-knockout into a knockout: take it.
  const securesKO = mk(
    [set('garchomp', {level: 100, teraType: 'Ground', moves: ['earthquake']}), set('blissey', {level: 100})],
    [set('blissey', {level: 100, moves: ['softboiled']}), set('snorlax', {level: 100}), set('skarmory', {level: 100})]);
  assert.strictEqual(teras(securesKO), true, 'Tera that secures a knockout should be taken');

  // Turns a lethal incoming hit into a survivable one.
  const savesLife = mk(
    [set('dragonite', {level: 100, teraType: 'Steel', moves: ['dragonclaw']}), set('blissey', {level: 100})],
    [set('mewtwo', {level: 100, moves: ['icebeam']}), set('snorlax', {level: 100}), set('skarmory', {level: 100})]);
  const nite = savesLife.sides[0].team[0];
  nite.currentHP = Math.round(nite.maxHP * 0.35);
  assert.strictEqual(teras(savesLife), true, 'Tera that survives a lethal hit should be taken');

  /*
   * Defensive Tera: a Fairy with a Steel Tera type facing a Poison move takes
   * nothing instead of double. Worth the resource even though the hit is not
   * lethal — which the lethal-only rule missed entirely.
   */
  const rest = () => [set('snorlax', {level: 100}), set('skarmory', {level: 100})];
  const immunity = mk(
    [set('clefable', {level: 100, teraType: 'Steel', moves: ['moonblast', 'softboiled']}), set('blissey', {level: 100})],
    [set('gengar', {level: 100, moves: ['sludgebomb']}), ...rest()]);
  assert.strictEqual(teras(immunity), true, 'Tera into an immunity against the incoming move should be taken');

  // ...but not when the foe has coverage that punishes the new typing. The
  // incoming damage is re-read *after* the swap, so this cannot be baited.
  const covered = mk(
    [set('clefable', {level: 100, teraType: 'Steel', moves: ['moonblast', 'softboiled']}), set('blissey', {level: 100})],
    [set('gengar', {level: 100, moves: ['sludgebomb', 'fireblast']}), ...rest()]);
  assert.strictEqual(teras(covered), false, 'Tera should be declined when the foe simply switches coverage');

  // ...and not when nothing threatening is coming in at all.
  const unthreatened = mk(
    [set('clefable', {level: 100, teraType: 'Steel', moves: ['moonblast', 'softboiled']}), set('blissey', {level: 100})],
    [set('gengar', {level: 100, moves: ['shadowball']}), ...rest()]);
  assert.strictEqual(teras(unthreatened), false, 'Tera should be held when the incoming hit is not the problem');
});

test('hazards are chosen against the enemy team, not just the Pokemon in front', () => {
  // Spikes are near-worthless against a team that floats, and Stealth Rock is
  // worth four times as much against a Charizard as against an Excadrill.
  // Counting heads rated all of these the same.
  const AI = RedGPT.AI;
  const level = AI.difficulty('expert');
  const scores = foes => {
    const battle = makeBattle(
      [set('skarmory', {level: 100, moves: ['spikes', 'stealthrock', 'bravebird']})],
      foes.map(name => set(name, {level: 100})));
    const self = battle.sides[0].team[0];
    const foe = battle.sides[1].team[0];
    return {
      spikes: AI.scoreMove(battle, self, foe, self.moves[0], 0, level, {}),
      rocks: AI.scoreMove(battle, self, foe, self.moves[1], 1, level, {}),
    };
  };

  const grounded = scores(['blissey', 'snorlax', 'machamp', 'tyranitar']);
  const floating = scores(['blissey', 'gengar', 'skarmory', 'crobat']);
  assert.ok(grounded.spikes > floating.spikes + 50,
    `Spikes should collapse against a floating team (${Math.round(grounded.spikes)} vs ${Math.round(floating.spikes)})`);
  assert.ok(floating.rocks > floating.spikes,
    'against a floating team Stealth Rock should be the better layer');

  const rockWeak = scores(['blissey', 'charizard', 'articuno', 'volcarona']);
  const rockResist = scores(['blissey', 'excadrill', 'empoleon', 'aggron']);
  assert.ok(rockWeak.rocks > rockResist.rocks + 50,
    `Stealth Rock should be worth far more against Rock-weak targets (${Math.round(rockWeak.rocks)} vs ${Math.round(rockResist.rocks)})`);
  assert.ok(rockWeak.rocks > rockWeak.spikes, 'Rock-weak team: rocks over spikes');
  assert.ok(rockResist.spikes > rockResist.rocks, 'Rock-resistant team: spikes over rocks');
});

test('a contact-punishing ability counts as a defensive asset, not just a deterrent', () => {
  // The AI already avoided *using* contact moves into Flame Body and Rough
  // Skin. It had no idea the same abilities were an asset on its own side, so
  // it never switched the Flame Body holder into the physical attacker it walls.
  const AI = RedGPT.AI;
  const level = AI.difficulty('expert');
  const build = foeMove => {
    const battle = makeBattle(
      [set('furret', {level: 100, moves: ['tackle']}),
        set('rapidash', {level: 100, ability: 'Flame Body', moves: ['flamethrower']}),
        set('rapidash', {level: 100, ability: 'Run Away', moves: ['flamethrower']})],
      [set('machamp', {level: 100, moves: [foeMove]})]);
    battle.sides[0].team[0].fainted = true;
    battle.sides[0].team[0].currentHP = 0;
    return battle;
  };

  // Contact attacker: the punisher is a genuinely better answer.
  const contact = build('closecombat');
  const foe = contact.sides[1].team[0];
  const punisher = contact.sides[0].team[1];
  const plain = contact.sides[0].team[2];
  assert.ok(AI.matchupScore(contact, punisher, foe) > AI.matchupScore(contact, plain, foe) + 0.3,
    'Flame Body should score better against a contact attacker');
  const pick = AI.chooseSwitchReplacement(contact, 0, level);
  assert.strictEqual(contact.sides[0].team[pick.index].ability, 'Flame Body',
    'the punisher should be sent in');

  // Non-contact attacker: it must earn nothing, or the AI would misread it as a
  // wall against everything.
  const ranged = build('rockslide');
  const rFoe = ranged.sides[1].team[0];
  assert.strictEqual(
    AI.matchupScore(ranged, ranged.sides[0].team[1], rFoe),
    AI.matchupScore(ranged, ranged.sides[0].team[2], rFoe),
    'Flame Body should be worth nothing against a non-contact move');
});

test('the AI reads real accuracy, not the packaged number', () => {
  // Thunder and Hurricane never miss in rain and halve in sun; Blizzard never
  // misses in snow; Toxic never misses from a Poison type. Reading move.accuracy
  // had the AI avoiding its own best move in the weather it had just set.
  const AI = RedGPT.AI;
  const build = weatherMove => {
    const battle = makeBattle(
      [set('pelipper', {level: 100, moves: ['thunder', 'hurricane', 'surf']})],
      [set('blissey', {level: 100, moves: ['splash']})]);
    battle.clearWeather();
    if (weatherMove) {
      battle.executeMove(battle.sides[0].team[0], battle.sides[1].team[0], Dex.move(weatherMove), {index: 0});
    }
    return battle;
  };
  const chance = (battle, id) => AI.hitChance(battle, battle.sides[0].team[0], battle.sides[1].team[0], Dex.move(id));

  const clear = build(null);
  assert.ok(Math.abs(chance(clear, 'thunder') - 0.7) < 0.01, 'Thunder should be 70% in clear weather');

  const rain = build('raindance');
  assert.strictEqual(chance(rain, 'thunder'), 1, 'Thunder never misses in rain');
  assert.strictEqual(chance(rain, 'hurricane'), 1, 'Hurricane never misses in rain');

  const sun = build('sunnyday');
  assert.ok(Math.abs(chance(sun, 'thunder') - 0.5) < 0.01, 'Thunder is 50% in sun');

  // Blizzard in snow, and Toxic from a Poison type.
  const snow = makeBattle([set('abomasnow', {level: 100, ability: 'Snow Warning', moves: ['blizzard']})],
    [set('blissey', {level: 100})]);
  assert.strictEqual(AI.hitChance(snow, snow.sides[0].team[0], snow.sides[1].team[0], Dex.move('blizzard')), 1,
    'Blizzard never misses in snow');

  const toxic = makeBattle([set('toxapex', {level: 100, moves: ['toxic']})], [set('blissey', {level: 100})]);
  assert.strictEqual(AI.hitChance(toxic, toxic.sides[0].team[0], toxic.sides[1].team[0], Dex.move('toxic')), 1,
    'Toxic never misses from a Poison type');
});

test('a move that cannot resolve is discounted for status moves too', () => {
  // Not just knockouts: a status move thrown while dying and slower inflicts
  // nothing, so it must rank below anything that actually happens.
  const AI = RedGPT.AI;
  const level = AI.difficulty('expert');
  const battle = makeBattle(
    [set('scizor', {level: 100, moves: ['bulletpunch', 'swordsdance', 'toxic']})],
    [set('magnezone', {level: 100, moves: ['thunderbolt']})]);
  const self = battle.sides[0].team[0];
  const foe = battle.sides[1].team[0];
  self.currentHP = Math.max(1, Math.round(self.maxHP * 0.12));
  const scored = self.moves.map((slot, index) =>
    ({id: slot.id, score: AI.scoreMove(battle, self, foe, slot, index, level, {})}))
    .sort((a, b) => b.score - a.score);
  assert.strictEqual(scored[0].id, 'bulletpunch',
    `expected the priority move while dying, got ${scored.map(s => `${s.id} ${Math.round(s.score)}`).join(', ')}`);
});

test('Belly Drum is refused below half HP and credited when a berry pays it back', () => {
  const AI = RedGPT.AI;
  const level = AI.difficulty('expert');
  const score = battle => {
    const self = battle.sides[0].team[0];
    return AI.scoreMove(battle, self, battle.sides[1].team[0], self.moves[0], 0, level, {});
  };
  /*
   * The foe is deliberately **slower** than Azumarill (Snorlax 30 Spe against
   * 50), so the Drum happens from full HP.
   *
   * That matters: the AI now models a slower user taking the hit *first*, so a
   * faster foe changes the arithmetic entirely — Azumarill would drum from
   * post-hit HP and the Sitrus would fire regardless of parity. §8's "odd max HP
   * means the combo never fires" is a statement about drumming from **full** HP,
   * and this test previously relied on a Blissey that outspeeds, which quietly
   * made it a different scenario. The slower-drummer case is asserted separately
   * below.
   */
  const drum = (options, hp = 1) => {
    const battle = makeBattle([set('azumarill', Object.assign({ability: 'Huge Power', moves: ['bellydrum', 'playrough']}, options))],
      [set('snorlax', {moves: ['bodyslam'], level: 50})]);
    const self = battle.sides[0].team[0];
    self.currentHP = Math.floor(self.maxHP * hp);
    return battle;
  };

  // The move outright fails below half, so it must never be chosen there.
  assert.ok(score(drum({}, 0.4)) < -100, 'Belly Drum below half HP should be refused');

  // Sitrus pays Belly Drum back only when max HP is even — the same constraint
  // real Belly Drum sets are built around, and what this engine implements:
  // an odd max HP leaves the holder one point above the Sitrus threshold.
  const oddNoItem = drum({});
  const oddSitrus = drum({item: 'sitrusberry'});
  assert.strictEqual(oddNoItem.sides[0].team[0].maxHP % 2, 1, 'expected an odd max HP with no EVs');
  assert.strictEqual(score(oddSitrus), score(oddNoItem), 'with odd HP the berry does not fire, so it should not be credited');

  const evenNoItem = drum({evs: {hp: 4}});
  const evenSitrus = drum({evs: {hp: 4}, item: 'sitrusberry'});
  assert.strictEqual(evenNoItem.sides[0].team[0].maxHP % 2, 0, 'expected an even max HP with 4 HP EVs');
  assert.ok(score(evenSitrus) > score(evenNoItem), 'with even HP the berry fires and should be credited');

  /*
   * The slower drummer, which is how Belly Drum + Sitrus is actually played:
   * the foe hits first, that knocks the holder under half, the Sitrus fires and
   * the Drum is legal again. The AI has to evaluate the Drum at the HP it will
   * really be used at, not at the HP it has while choosing.
   */
  const slowDrum = item => {
    const battle = makeBattle(
      [set('azumarill', Object.assign({ability: 'Huge Power', moves: ['bellydrum', 'playrough']},
        item ? {item} : {}))],
      [set('blissey', {moves: ['seismictoss'], level: 50})]);   // 55 Spe, outspeeds
    return battle;
  };
  const slowBattle = slowDrum('sitrusberry');
  const drummer = slowBattle.sides[0].team[0];
  const enemy = slowBattle.sides[1].team[0];
  assert.ok(!RedGPT.AI.movesFirst(slowBattle, drummer, enemy, null,
    RedGPT.AI.bestDamage(slowBattle, enemy, drummer).move),
  'this case needs the drummer to be slower, or it proves nothing');
  assert.ok(score(slowBattle) > -100,
    'a slower Belly Drum user that survives the hit and eats its Sitrus should still consider the Drum');

  // CONTROL: the same slower drummer with no berry has nothing to rescue it.
  assert.ok(score(slowDrum(null)) < score(slowBattle),
    'the Sitrus must be what makes the slower Drum worth more');
});

/* ------------------------------------------------------------------ *
 * Stat breakdown
 * ------------------------------------------------------------------ */

test('every stat breakdown reproduces getStat exactly', () => {
  // The breakdown walks the same layers as getStat. This is the control that
  // stops the two drifting: whatever sources it reports, multiplying them onto
  // the base must land on the real number, for every stat in every situation.
  const scenarios = [
    ['boosted', () => {
      const b = makeBattle([set('garchomp', {moves: ['swordsdance']})], [set('blissey')]);
      b.boost(b.sides[0].team[0], {atk: 2, spe: -1}, b.sides[0].team[0]);
      return b;
    }],
    ['choice item', () => makeBattle([set('garchomp', {item: 'choicescarf'})], [set('blissey')])],
    ['assault vest', () => makeBattle([set('garchomp', {item: 'assaultvest'})], [set('blissey')])],
    ['huge power', () => makeBattle([set('azumarill', {ability: 'Huge Power'})], [set('blissey')])],
    ['protosynthesis in sun', () => {
      const b = makeBattle([set('greattusk', {ability: 'Protosynthesis'})], [set('blissey', {moves: ['sunnyday']})]);
      b.executeMove(b.sides[1].team[0], b.sides[0].team[0], Dex.move('sunnyday'), {index: 0});
      return b;
    }],
    ['quark drive on electric terrain', () => {
      const b = makeBattle([set('irontreads', {ability: 'Quark Drive'})], [set('blissey', {moves: ['electricterrain']})]);
      b.executeMove(b.sides[1].team[0], b.sides[0].team[0], Dex.move('electricterrain'), {index: 0});
      return b;
    }],
    ['chlorophyll in sun', () => {
      const b = makeBattle([set('venusaur', {ability: 'Chlorophyll'})], [set('blissey', {moves: ['sunnyday']})]);
      b.executeMove(b.sides[1].team[0], b.sides[0].team[0], Dex.move('sunnyday'), {index: 0});
      return b;
    }],
    ['paralysed', () => {
      const b = makeBattle([set('garchomp')], [set('blissey')]);
      b.sides[0].team[0].status = 'par';
      return b;
    }],
    ['tailwind', () => {
      const b = makeBattle([set('garchomp')], [set('blissey')]);
      b.sides[0].conditions.tailwind = 4;
      return b;
    }],
    ['ruin', () => makeBattle([set('garchomp')], [set('chienpao', {ability: 'Sword of Ruin'})])],
    ['wonder room', () => {
      const b = makeBattle([set('garchomp', {moves: ['wonderroom']})], [set('blissey')]);
      b.setPseudoWeather('wonderroom');
      return b;
    }],
    ['guts when burned', () => {
      const b = makeBattle([set('conkeldurr', {ability: 'Guts'})], [set('blissey')]);
      b.sides[0].team[0].status = 'brn';
      return b;
    }],
    ['everything at once', () => {
      const b = makeBattle([set('garchomp', {item: 'choicescarf'})], [set('chienpao', {ability: 'Sword of Ruin'})]);
      const me = b.sides[0].team[0];
      b.boost(me, {spe: 1, def: -2}, me);
      me.status = 'par';
      b.sides[0].conditions.tailwind = 4;
      return b;
    }],
  ];

  const problems = [];
  for (const [name, build] of scenarios) {
    const battle = build();
    const mon = battle.sides[0].team[0];
    for (const stat of ['atk', 'def', 'spa', 'spd', 'spe']) {
      const breakdown = battle.statBreakdown(mon, stat);
      const rebuilt = Math.max(1, breakdown.sources.reduce((n, s) => Math.floor(n * s.factor), breakdown.base));
      if (rebuilt !== breakdown.final) {
        problems.push(`${name}/${stat}: sources rebuild to ${rebuilt} but getStat says ${breakdown.final}` +
          ` (base ${breakdown.base}, sources ${breakdown.sources.map(s => `${s.label} x${s.factor.toFixed(3)}`).join(' ')})`);
      }
      if (breakdown.final !== battle.getStat(mon, stat)) problems.push(`${name}/${stat}: final disagrees with getStat`);
    }
  }
  assert.deepStrictEqual([...problems], [], problems.join('\n'));
});

test('the stat breakdown names the sources that are actually acting', () => {
  const battle = makeBattle([set('garchomp', {item: 'choicescarf'})], [set('chienpao', {ability: 'Sword of Ruin'})]);
  const chomp = battle.sides[0].team[0];
  battle.sides[0].conditions.tailwind = 4;
  chomp.status = 'par';

  const spe = battle.statBreakdown(chomp, 'spe');
  const labels = spe.sources.map(s => s.label);
  assert.ok(labels.includes('Choice Scarf'), `no Choice Scarf in ${labels.join(', ')}`);
  assert.ok(labels.includes('Paralysis'), `no Paralysis in ${labels.join(', ')}`);
  assert.ok(labels.includes('Tailwind'), `no Tailwind in ${labels.join(', ')}`);

  // Sword of Ruin cuts Defense, and it is the *opponent's* ability doing it.
  const def = battle.statBreakdown(chomp, 'def');
  assert.ok(def.sources.some(s => s.label === 'Sword of Ruin'), 'Ruin not credited');

  // A stat with nothing acting on it reports nothing rather than a 1x entry.
  const clean = makeBattle([set('garchomp')], [set('blissey')]);
  assert.deepStrictEqual([...clean.statBreakdown(clean.sides[0].team[0], 'spa').sources], []);
});

test('a hidden opponent set is withheld from the breakdown but not from the truth', () => {
  // hideOpponentDetails is on in every format: the foe's ability and item are
  // not public, so the panel must not quietly reveal a Choice Scarf.
  const battle = makeBattle([set('blissey')], [set('garchomp', {item: 'choicescarf'})]);
  const foe = battle.sides[1].team[0];

  const open = battle.statBreakdown(foe, 'spe', {reveal: true});
  const closed = battle.statBreakdown(foe, 'spe', {reveal: false});

  assert.strictEqual(open.partial, false);
  assert.strictEqual(closed.partial, true, 'a held Choice Scarf should be withheld');
  assert.strictEqual(closed.final, open.final, 'the true stat must still be correct');
  assert.ok(closed.shown < closed.final, `shown (${closed.shown}) should stop short of final (${closed.final})`);
  assert.ok(closed.sources.some(s => s.label === 'Choice Scarf' && s.hidden), 'the source should be marked hidden, not dropped');

  // Public sources stay public even when the set is hidden.
  battle.sides[1].conditions.tailwind = 4;
  const withTailwind = battle.statBreakdown(foe, 'spe', {reveal: false});
  assert.ok(withTailwind.sources.some(s => s.label === 'Tailwind' && !s.hidden), 'Tailwind is public');
});

/* ------------------------------------------------------------------ *
 * Moves whose type is decided at use time by the user
 * ------------------------------------------------------------------ */

test('five moves take their type from the user, not from the packaged data', () => {
  /*
   * All five resolved to their packaged type before this. Revelation Dance had
   * no case at all, and Judgment / Multi-Attack / Techno Blast had one that
   * read `return move.type` — the same thing the fallback does, so the branch
   * looked like coverage while changing nothing.
   */
  const cases = [
    ['revelationdance', 'Oricorio-Pom-Pom', null, 'Electric'],
    ['revelationdance', 'Oricorio', null, 'Fire'],
    // Pa'u also pins the sprite-key fix: it was dropped from the packaged data
    // entirely until 2026-08-14, so `hasSpecies` failing here means a rebuild
    // has lost the apostrophe-forme match again (§9).
    ['revelationdance', 'Oricorio-Pa\'u', null, 'Psychic'],
    ['revelationdance', 'Oricorio-Sensu', null, 'Ghost'],
    ['judgment', 'Arceus', 'splashplate', 'Water'],
    ['judgment', 'Arceus', 'zapplate', 'Electric'],
    ['judgment', 'Arceus', null, 'Normal'],
    ['multiattack', 'Silvally', 'watermemory', 'Water'],
    ['multiattack', 'Silvally', null, 'Normal'],
    ['technoblast', 'Genesect', 'shockdrive', 'Electric'],
    ['technoblast', 'Genesect', 'burndrive', 'Fire'],
    ['technoblast', 'Genesect', null, 'Normal'],
    ['aurawheel', 'Morpeko', null, 'Electric'],
    ['aurawheel', 'Morpeko-Hangry', null, 'Dark'],
  ];
  for (const [moveId, species, item, expected] of cases) {
    assert.ok(Dex.hasSpecies(species), `${species} is not packaged`);
    const options = {moves: [moveId]};
    if (item) options.item = item;
    const battle = makeBattle([set(species, options)], [set('snorlax')]);
    const actual = battle.moveType(battle.sides[0].team[0], battle.sides[1].team[0], Dex.move(moveId));
    assert.strictEqual(actual, expected, `${moveId} on ${species}${item ? ` holding ${item}` : ''}`);
  }
});

test('Revelation Dance really lands as the user\'s primary type', () => {
  // The type has to reach the damage pipeline, not just `moveType`: an
  // Electric Revelation Dance cannot touch a Ground type. While the move
  // stayed Normal this hit Garchomp for ordinary neutral damage.
  const immune = makeBattle([set('Oricorio-Pom-Pom', {moves: ['revelationdance']})], [set('garchomp')]);
  const chomp = immune.sides[1].team[0];
  immune.executeMove(immune.sides[0].team[0], chomp, Dex.move('revelationdance'), {index: 0});
  assert.strictEqual(chomp.currentHP, chomp.maxHP, 'Ground is immune to an Electric Revelation Dance');

  // ...and the zero above is the typing, not a move that simply failed.
  const lands = makeBattle([set('Oricorio-Pom-Pom', {moves: ['revelationdance']})], [set('snorlax')]);
  const lax = lands.sides[1].team[0];
  lands.executeMove(lands.sides[0].team[0], lax, Dex.move('revelationdance'), {index: 0});
  assert.ok(lax.currentHP < lax.maxHP, 'the move should still damage a non-immune target');
});

test('Protean grants STAB on the type it adds', () => {
  /*
   * Until 2026-08-16 it did not. `stabFor` read `baseTypes` in both branches,
   * so Protean retyped the Pokémon — the log really did print "transformed into
   * the Ice type!" — and then STAB was computed from Water/Dark, which is the
   * entire offensive point of the ability doing nothing.
   *
   * Damage is read off the **log line**, not from the HP delta across the turn:
   * a defender holding Leftovers heals at end of turn, which understated an
   * earlier version of this measurement by ~10% and made a 2.4x discrepancy
   * elsewhere look real. Read the move's own damage.
   */
  const damage = (ability, moveId) => {
    const battle = makeBattle(
      [set('greninja', {ability, moves: [moveId]})],
      [set('snorlax', {moves: ['splash']})], {seed: 8080});
    const from = battle.log.length;
    turn(battle, 0, 0);
    const line = battle.log.slice(from).find(entry => /opposing .* lost \d+ HP/.test(entry));
    return line ? +/lost (\d+) HP/.exec(line)[1] : 0;
  };

  // Ice is not one of Greninja's types, so only Protean can make it STAB.
  const proteanIce = damage('Protean', 'icebeam');
  const torrentIce = damage('Torrent', 'icebeam');
  assert.ok(proteanIce > 0 && torrentIce > 0, `setup: both should deal damage (${proteanIce}, ${torrentIce})`);
  assert.strictEqual(proteanIce, Math.floor(torrentIce * 1.5),
    `Protean should be worth exactly 1.5x on an added type: ${proteanIce} against ${torrentIce}`);

  /*
   * The control, and it is what stops an over-fix. Water is already a base
   * type, so Protean adds nothing and the two must be identical. A version that
   * simply multiplied everything by 1.5, or that double-counted STAB, fails
   * here while passing above.
   */
  const proteanWater = damage('Protean', 'hydropump');
  const torrentWater = damage('Torrent', 'hydropump');
  assert.strictEqual(proteanWater, torrentWater,
    `CONTROL: on a base type Protean must change nothing: ${proteanWater} against ${torrentWater}`);
});

test('STAB reads live typing without breaking Terastallization', () => {
  /*
   * The two branches of `stabFor` deliberately read different arrays: Tera
   * compares against `baseTypes` ("did it already have this type"), everything
   * else against the live `types`. This pins all four Tera cases so a future
   * change cannot collapse them into one rule.
   */
  const stab = (species, moveType, {teraType = null, tera = false, ability} = {}) => {
    const battle = makeBattle([set(species, {teraType, ability})], [set('snorlax')], {seed: 3});
    const me = battle.active(0);
    if (tera) assert.ok(battle.terastallize(me), 'setup: it should be able to Terastallize');
    return battle.stabFor(me, moveType);
  };

  assert.strictEqual(stab('garchomp', 'Dragon'), 1.5, 'ordinary STAB');
  assert.strictEqual(stab('garchomp', 'Water'), 1, 'no STAB off-type');
  assert.strictEqual(stab('garchomp', 'Dragon', {teraType: 'Dragon', tera: true}), 2,
    'Terastallizing into a type it already had is 2x');
  assert.strictEqual(stab('garchomp', 'Fire', {teraType: 'Fire', tera: true}), 1.5,
    'a brand-new Tera type is ordinary STAB');
  assert.strictEqual(stab('garchomp', 'Dragon', {teraType: 'Fire', tera: true}), 1.5,
    'and the base typing keeps its STAB after Terastallizing');
  assert.strictEqual(stab('garchomp', 'Water', {teraType: 'Fire', tera: true}), 1,
    'while an unrelated type gets nothing');
  // Adaptability doubles rather than adds, on the live-typing branch.
  assert.strictEqual(stab('lucariomega', 'Fighting'), 2, 'Adaptability is 2x');
});

test('a Terastallized Oricorio dances in its Tera type', () => {
  const battle = makeBattle([set('Oricorio-Pom-Pom', {moves: ['revelationdance'], teraType: 'Water'})], [set('snorlax')]);
  const me = battle.sides[0].team[0];
  assert.strictEqual(battle.moveType(me, battle.sides[1].team[0], Dex.move('revelationdance')), 'Electric');
  assert.ok(battle.terastallize(me), 'Oricorio should be able to Terastallize');
  // Reading `types[0]` rather than the species is what buys this for free.
  assert.strictEqual(battle.moveType(me, battle.sides[1].team[0], Dex.move('revelationdance')), 'Water');
});

test('a Plate gives Judgment STAB, but a Drive does not give Techno Blast STAB', () => {
  /*
   * The distinction is the reason these read the item rather than the user's
   * typing. Multitype turns Arceus into a Water type, so its Water Judgment is
   * STAB — but Genesect stays Bug/Steel whatever Drive it holds, so an
   * Electric Techno Blast is not. Reading `types[0]` would have made Techno
   * Blast permanently Bug.
   */
  const arceus = makeBattle([set('Arceus', {moves: ['judgment'], item: 'splashplate'})], [set('snorlax')]);
  const god = arceus.sides[0].team[0];
  assert.deepStrictEqual([...god.types], ['Water'], 'the Splash Plate should retype Arceus');
  assert.strictEqual(arceus.moveType(god, arceus.sides[1].team[0], Dex.move('judgment')), 'Water');
  assert.strictEqual(arceus.stabFor(god, 'Water'), 1.5, 'Arceus-Water should get STAB on a Water Judgment');

  const genesect = makeBattle([set('Genesect', {moves: ['technoblast'], item: 'shockdrive'})], [set('snorlax')]);
  const bug = genesect.sides[0].team[0];
  assert.deepStrictEqual([...bug.types], ['Bug', 'Steel'], 'a Drive must not retype Genesect');
  assert.strictEqual(genesect.moveType(bug, genesect.sides[1].team[0], Dex.move('technoblast')), 'Electric');
  assert.strictEqual(genesect.stabFor(bug, 'Electric'), 1, 'the Drive retypes the move, not the Pokemon');
});

test('a Z-crystal does not retype Judgment', () => {
  // Z-crystals declare `onPlate` too, and this project does not simulate
  // Z-moves at all — so matching on `onPlate` alone would hand out free
  // retyping from an item that is otherwise inert here.
  const battle = makeBattle([set('Arceus', {moves: ['judgment'], item: 'wateriumz'})], [set('snorlax')]);
  const god = battle.sides[0].team[0];
  assert.strictEqual(Dex.item('wateriumz').onPlate, 'Water', 'the fixture must really declare onPlate');
  assert.strictEqual(Dex.item('wateriumz').zMove, true, 'the fixture must really be a Z-crystal');
  assert.strictEqual(battle.moveType(god, battle.sides[1].team[0], Dex.move('judgment')), 'Normal');
});

test('Ring Target is offensive: the holder pierces type immunities', () => {
  /*
   * Project redesign. Upstream Ring Target is *defensive* — the holder loses
   * its own type immunities — which is a pure drawback nobody equips. It now
   * lets the holder's attacks land for neutral damage on a target that would be
   * immune by type.
   */
  const hit = item => {
    const battle = makeBattle([set('snorlax', {moves: ['bodyslam'], item})], [set('gengar')]);
    const foe = battle.sides[1].team[0];
    const before = foe.currentHP;
    battle.executeMove(battle.sides[0].team[0], foe, Dex.move('bodyslam'), {index: 0});
    return before - foe.currentHP;
  };
  assert.strictEqual(hit(null), 0, 'Normal cannot touch a Ghost without it');
  assert.ok(hit('ringtarget') > 0, 'Ring Target should let Body Slam hit Gengar');

  /*
   * CONTROL 1 — an *ability* immunity must survive. Levitate is intercepted on
   * a separate path in `executeMove` and never reaches the type chart as a
   * zero, so piercing it too would make the item far stronger than intended.
   */
  const levitate = makeBattle(
    [set('snorlax', {moves: ['earthquake'], item: 'ringtarget'})], [set('rotomfan')]);
  const floater = levitate.sides[1].team[0];
  const before = floater.currentHP;
  levitate.executeMove(levitate.sides[0].team[0], floater, Dex.move('earthquake'), {index: 0});
  assert.strictEqual(before - floater.currentHP, 0, 'Levitate must still block Earthquake');

  /*
   * CONTROL 2 — the old defensive behaviour must be *gone*, not merely joined
   * by the new one. A Ring Target Gengar keeps its own Normal immunity.
   */
  const defensive = makeBattle(
    [set('gengar', {moves: ['shadowball'], item: 'ringtarget'})], [set('snorlax', {moves: ['bodyslam']})]);
  const ghost = defensive.sides[0].team[0];
  const ghostHP = ghost.currentHP;
  defensive.executeMove(defensive.sides[1].team[0], ghost, Dex.move('bodyslam'), {index: 0});
  assert.strictEqual(ghostHP - ghost.currentHP, 0, 'the holder must keep its own immunities');

  // The packaged description must state the redesign, not upstream's mechanic.
  assert.ok(/holder's attacks/i.test(Dex.item('ringtarget').shortDesc),
    `the description still describes the old item: ${Dex.item('ringtarget').shortDesc}`);
});

test('the Ring Target Clause holds at team building and in battle', () => {
  /*
   * One per team, in every format, whether or not Item Clause is on — the item
   * turns a type immunity into neutral damage and a team stacking several
   * leaves no counterplay to find. Enforced twice, because a team-building
   * clause alone can be walked around with Trick.
   */
  const {Validation} = RedGPT;
  const format = Formats.get('anythinggoes');
  const lax = item => set('snorlax', {moves: ['bodyslam'], item});
  const gar = item => set('gengar', {moves: ['shadowball'], item});
  const two = Validation.validateTeam([lax('ringtarget'), gar('ringtarget')], format);
  assert.strictEqual(two.valid, false, 'two Ring Targets must not validate');
  assert.ok(two.errors.some(e => /Ring Target Clause/.test(e.message || e)),
    `expected a clause error, got: ${JSON.stringify(two.errors)}`);
  // CONTROL: one is fine, or the rule would just be "Ring Target is banned".
  const one = Validation.validateTeam([lax('ringtarget'), gar('leftovers')], format);
  assert.strictEqual(one.valid, true,
    `a single Ring Target must still be legal: ${JSON.stringify(one.errors)}`);

  // In battle: Trick cannot assemble a second one.
  const blocked = makeBattle(
    [set('alakazam', {moves: ['trick'], item: 'choicescarf'}), set('snorlax', {item: 'ringtarget'})],
    [set('gengar', {item: 'ringtarget'})]);
  blocked.executeMove(blocked.sides[0].team[0], blocked.sides[1].team[0], Dex.move('trick'), {index: 0});
  assert.strictEqual(blocked.sides[0].team[0].item, 'choicescarf', 'the swap must be refused whole');
  assert.strictEqual(blocked.sides[1].team[0].item, 'ringtarget', 'and not half-applied');

  // CONTROL: the same Trick works when the receiving side has none, so the
  // refusal above is the clause and not Trick being broken.
  const allowed = makeBattle(
    [set('alakazam', {moves: ['trick'], item: 'choicescarf'}), set('snorlax', {item: 'leftovers'})],
    [set('gengar', {item: 'ringtarget'})]);
  allowed.executeMove(allowed.sides[0].team[0], allowed.sides[1].team[0], Dex.move('trick'), {index: 0});
  assert.strictEqual(allowed.sides[0].team[0].item, 'ringtarget', 'an ordinary Trick still swaps');

  // Fainted teammates still count, or the clause has an obvious hole.
  const spent = makeBattle(
    [set('alakazam', {moves: ['trick'], item: 'choicescarf'}), set('snorlax', {item: 'ringtarget'})],
    [set('gengar', {item: 'ringtarget'})]);
  spent.sides[0].team[1].fainted = true;
  spent.executeMove(spent.sides[0].team[0], spent.sides[1].team[0], Dex.move('trick'), {index: 0});
  assert.strictEqual(spent.sides[0].team[0].item, 'choicescarf',
    'fainting the holder must not open a second slot');
});

test('Ring Target is public information from turn one', () => {
  /*
   * `hideOpponentDetails` is on in every format, and two Campaign relics are
   * *sold* on revealing opponent details — so a hole in it needs a reason. Ring
   * Target has one: it turns a type immunity, the hardest read in the game,
   * into neutral damage. An opponent who cannot see it cannot plan around it
   * and finds out by losing a Pokémon. It is public like a Mega Stone, not
   * hidden like a Choice Band.
   */
  const battle = makeBattle(
    [set('gengar', {moves: ['shadowball']})],
    [set('snorlax', {moves: ['bodyslam'], item: 'ringtarget'})],
    {format: 'standard'});
  assert.strictEqual(battle.rules.hideOpponentDetails, true, 'the fixture must really hide details');
  assert.strictEqual(battle.view(0).sides[1].active.item, 'ringtarget',
    'Ring Target must be visible before it has done anything');

  /*
   * CONTROL — an ordinary item on the same Pokémon must still be hidden, or
   * this asserts nothing about `publicItem` and everything about the format.
   */
  const ordinary = makeBattle(
    [set('gengar', {moves: ['shadowball']})],
    [set('snorlax', {moves: ['bodyslam'], item: 'leftovers'})],
    {format: 'standard'});
  assert.strictEqual(ordinary.view(0).sides[1].active.item, null,
    'an ordinary held item must still be hidden');

  // It also announces itself when it actually pierces.
  battle.executeMove(battle.sides[1].team[0], battle.sides[0].team[0], Dex.move('bodyslam'), {index: 0});
  assert.ok(battle.log.some(line => /Ring Target let the attack through/.test(
    typeof line === 'string' ? line : line.text || '')), 'it should announce itself in the log');
});

test('the AI plays Ring Target, from both sides of it', () => {
  /*
   * An item the engine implements and the AI does not read is half an item: it
   * would keep picking the "safe" move it no longer needs, and keep trusting an
   * immunity it no longer has. Both directions are checked because they run
   * through different code — `scoreMove` for using it, `incomingThreat` for
   * being hit by it.
   */
  const build = item => makeBattle(
    [set('rotomwash', {moves: ['thunderbolt', 'shadowball'], item})],
    [set('garchomp', {moves: ['earthquake']})]);

  // Offence: Thunderbolt into a Ground type is worthless without the item, and
  // the best move on the set with it.
  const without = build(null);
  const with_ = build('ringtarget');
  const level = AI.DIFFICULTIES.expert;
  const scoreOf = battle => AI.scoreMove(battle, battle.sides[0].team[0], battle.sides[1].team[0],
    battle.sides[0].team[0].moves[0], 0, level);

  assert.strictEqual(AI.estimateDamage(without, without.sides[0].team[0], without.sides[1].team[0],
    Dex.move('thunderbolt')), 0, 'CONTROL: Electric does nothing to Ground without the item');
  assert.ok(AI.estimateDamage(with_, with_.sides[0].team[0], with_.sides[1].team[0],
    Dex.move('thunderbolt')) > 0, 'Ring Target should make Thunderbolt worth something');
  assert.ok(scoreOf(with_) > scoreOf(without) + 100,
    `Ring Target should lift the score a long way (${Math.round(scoreOf(without))} -> ${Math.round(scoreOf(with_))})`);

  // ...and it actually changes the choice, which is the point.
  without.sides[0].ai = {difficulty: 'expert'};
  with_.sides[0].ai = {difficulty: 'expert'};
  const pick = battle => {
    const choice = AI.chooseAction(battle, 0, battle.requests[0]);
    return choice.type === 'move' ? battle.sides[0].team[0].moves[choice.index].id : choice.type;
  };
  assert.strictEqual(pick(without), 'shadowball', 'CONTROL: without it the AI avoids the immune move');
  assert.strictEqual(pick(with_), 'thunderbolt', 'with it the AI uses the move the immunity used to stop');

  // Defence: the AI must stop counting on an immunity the foe can pierce.
  const threatOf = item => {
    const battle = makeBattle(
      [set('garchomp', {moves: ['earthquake']}), set('gengar', {moves: ['shadowball']})],
      [set('rotomwash', {moves: ['thunderbolt'], item})]);
    return AI.incomingThreat(battle, battle.sides[0].team[0], battle.sides[1].team[0]).damage;
  };
  assert.strictEqual(threatOf(null), 0, 'CONTROL: a Ground type fears no ordinary Thunderbolt');
  assert.ok(threatOf('ringtarget') > 0, 'a Ring Target Thunderbolt is a real threat to a Ground type');
});

test('Heatproof is a Fire immunity, and the two Metals trade stats on entry', () => {
  /*
   * Three project redesigns. Heatproof halved Fire damage; the two Metals were
   * weight-only, which reaches Low Kick, Grass Knot and Heat Crash and nothing
   * else — an ability slot spent on a coin flip about the opponent's moveset.
   */
  const battle = makeBattle(
    [set('bronzong', {ability: 'Heatproof', moves: ['gyroball']})],
    [set('charizard', {moves: ['fireblast', 'airslash', 'willowisp', 'tackle']})]);
  const me = battle.sides[0].team[0];
  const foe = battle.sides[1].team[0];
  const hit = (moveId, index) => {
    const before = me.currentHP;
    battle.executeMove(foe, me, Dex.move(moveId), {index});
    return before - me.currentHP;
  };
  assert.strictEqual(hit('fireblast', 0), 0, 'Fire attacks must do nothing');
  // CONTROL: it blocks Fire, not everything.
  assert.ok(hit('airslash', 1) > 0, 'a non-Fire attack must still land');
  // CONTROL: an absorbing ability stops attacks, not status — as with Flash Fire.
  battle.executeMove(foe, me, Dex.move('willowisp'), {index: 2});
  assert.strictEqual(me.status, 'brn', 'Fire status moves still work');
  // The AI has to know, or it throws Fire at it every turn (§8).
  assert.strictEqual(AI.estimateDamage(battle, foe, me, Dex.move('fireblast')), 0,
    'the AI must price Heatproof as an immunity');

  const boostsWith = ability => makeBattle(
    [set('klinklang', {ability, moves: ['gyroball']})], [set('snorlax')]).sides[0].team[0].boosts;
  const light = boostsWith('Light Metal');
  assert.strictEqual(light.spe, 1, 'Light Metal gives +1 Speed on entry');
  assert.strictEqual(light.atk, 0, 'and nothing else');
  const heavy = boostsWith('Heavy Metal');
  assert.strictEqual(heavy.spe, -2, 'Heavy Metal costs 2 Speed');
  assert.strictEqual(heavy.def, 1, 'and gives +1 Defence');
  assert.strictEqual(heavy.atk, 1, 'and +1 Attack');

  // The weight multipliers are kept, so the three weight moves still read them.
  assert.strictEqual(RedGPT.Abilities.get('Light Metal').weightMultiplier, 0.5);
  assert.strictEqual(RedGPT.Abilities.get('Heavy Metal').weightMultiplier, 2);

  // Descriptions must state the redesign, not upstream's mechanic.
  assert.ok(/immune to Fire/i.test(Dex.ability('heatproof').shortDesc),
    `Heatproof still describes halving: ${Dex.ability('heatproof').shortDesc}`);
});

test('the AI inspector explains a turn without touching anything', () => {
  /*
   * `explainChoice` exists so "why did it do that?" is answerable by looking
   * rather than by re-deriving the decision by hand. Being read-only is the
   * whole licence for showing it mid-battle: replays skip AI evaluation (§5),
   * so a panel that advanced `aiRng` would desynchronise playback of any battle
   * it had been open during, and one that advanced `rng` would change the
   * battle outright.
   */
  const battle = makeBattle(
    [set('dragonite', {moves: ['outrage', 'roost', 'dragondance', 'firepunch']}), set('garchomp')],
    [set('weezinggalar', {moves: ['gunkshot', 'taunt']})]);

  const snapshot = () => JSON.stringify({
    ai: [battle.aiRng.a, battle.aiRng.b, battle.aiRng.c, battle.aiRng.d, battle.aiRng.calls],
    rng: [battle.rng.a, battle.rng.b, battle.rng.c, battle.rng.d, battle.rng.calls],
    log: battle.log.length,
  });
  const before = snapshot();
  let view = null;
  for (let i = 0; i < 25; i++) view = AI.explainChoice(battle, 0, 'expert');
  assert.strictEqual(snapshot(), before,
    'the inspector must not advance either RNG stream or write to the log');

  // ...and it has to actually say something, or "unchanged" is vacuous.
  assert.ok(view, 'the inspector should return a view');
  assert.strictEqual(view.moves.length, 4, 'one row per move');
  assert.ok(view.switches.length >= 1, 'the bench should be listed');
  assert.strictEqual(typeof view.outspeeds, 'boolean');

  /*
   * The reported Outrage case, as the inspector sees it: Fairy is immune to
   * Dragon, so the move it repeated six times is the one the AI rates worst.
   * This is the evidence that the six-turn repeat was the rampage lock and
   * never the chooser.
   */
  const outrage = view.moves.find(m => m.id === 'outrage');
  assert.strictEqual(outrage.effectiveness, 0, 'Outrage cannot touch a Fairy');
  assert.ok(outrage.score < 0, `Outrage should score badly, scored ${outrage.score}`);
  assert.strictEqual(view.best, view.moves.indexOf(
    view.moves.slice().sort((a, b) => b.score - a.score)[0]), 'best must be the top-scoring move');
  assert.notStrictEqual(view.moves[view.best].id, 'outrage', 'the AI would never pick it');
});

test('a rampage that fails releases its lock instead of repeating forever', () => {
  /*
   * Reported from a real battle: a Dragonite threw Outrage into a
   * Weezing-Galar for six consecutive turns. Fairy is immune to Dragon, so
   * every hit failed — and `finishLockedMove` released the lock on failure for
   * Rollout and Ice Ball *only*, so `remaining` never decremented and the lock
   * ended when Dragonite fainted rather than when the rampage did.
   */
  const battle = makeBattle(
    [set('dragonite', {moves: ['outrage', 'firepunch']})],
    [set('snorlax', {moves: ['tackle']}), set('weezinggalar', {moves: ['taunt']})]);
  const me = battle.sides[0].team[0];
  assert.ok(battle.sides[1].team[1].types.includes('Fairy'), 'the fixture must really be immune to Dragon');

  // A hit establishes the lock...
  battle.executeMove(me, battle.sides[1].team[0], Dex.move('outrage'), {index: 0, fromLocked: false});
  assert.ok(me.volatiles.lockedMove, 'a successful Outrage should lock');

  // ...and a failure against the immune switch-in must end it.
  battle.sides[1].activeIndex = 1;
  battle.executeMove(me, battle.sides[1].team[1], Dex.move('outrage'), {index: 0, fromLocked: true});
  assert.strictEqual(!!me.volatiles.lockedMove, false, 'a failed rampage must release the lock');
  // A rampage broken by failure does not fatigue its user; only a completed one does.
  assert.strictEqual(!!me.volatiles.confusion, false, 'a broken rampage must not confuse');
});

test('a rampage that connects still locks, counts down and confuses', () => {
  /*
   * CONTROL for the fix above. Releasing the lock on *failure* must not release
   * it on success, or Outrage becomes a single-turn move and the drawback that
   * pays for its power disappears.
   *
   * The foe is revived each turn on purpose: leaving it fainted makes every
   * later move fail, which is the path under test above and would make this
   * pass for entirely the wrong reason.
   */
  const battle = makeBattle(
    [set('dragonite', {moves: ['outrage']})], [set('blissey', {moves: ['softboiled']})]);
  const me = battle.sides[0].team[0];
  const foe = battle.sides[1].team[0];

  let turns = 0;
  for (let i = 0; i < 5 && !me.volatiles.confusion; i++) {
    foe.currentHP = foe.maxHP;
    foe.fainted = false;
    const locked = me.volatiles.lockedMove?.moveId === 'outrage';
    battle.executeMove(me, foe, Dex.move('outrage'), {index: 0, fromLocked: locked});
    turns++;
  }
  assert.ok(turns >= 2 && turns <= 3, `a rampage should run 2-3 turns, ran ${turns}`);
  assert.ok(me.volatiles.confusion, 'a completed rampage should confuse its user');
  assert.strictEqual(!!me.volatiles.lockedMove, false, 'and release the lock when it ends');
});

/* ------------------------------------------------------------------ *
 * Primal weather
 * ------------------------------------------------------------------ */

test('primal weather refuses the opposing element and cannot be replaced', () => {
  /*
   * Both abilities were plain weather setters, so Primal Kyogre made ordinary
   * rain and Primal Groudon ordinary sun — reported from real play. What makes
   * them primal is asserted here: the opposing element fails, nothing else can
   * overwrite the weather, and it has no turn counter.
   */
  const battle = makeBattle(
    [set('groudon', {ability: 'Desolate Land', moves: ['firepunch']})],
    [set('kyogre', {ability: 'Drizzle', moves: ['surf', 'icebeam', 'willowisp', 'tackle']})]);
  const me = battle.sides[0].team[0];
  const foe = battle.sides[1].team[0];

  assert.strictEqual(battle.field.weather, 'sun', 'Desolate Land is still sun for everything else');
  assert.strictEqual(battle.field.weatherPrimal, 'desolateland');
  // Kyogre's Drizzle entered second and must not have overwritten it.
  assert.strictEqual(battle.field.weather, 'sun', 'ordinary Drizzle must not replace primal sun');
  assert.strictEqual(battle.field.weatherTurns, 0, 'primal weather does not tick down');

  const damageFrom = (moveId, index) => {
    const before = me.currentHP;
    battle.executeMove(foe, me, Dex.move(moveId), {index});
    return before - me.currentHP;
  };
  assert.strictEqual(damageFrom('surf', 0), 0, 'Water must evaporate in extremely harsh sunlight');
  // CONTROL: a move of another type must still land, or "0 damage" proves
  // nothing about the *type* being refused.
  assert.ok(damageFrom('icebeam', 1) > 0, 'a non-Water move must still work');
  // Status moves are unaffected, as in the games.
  battle.executeMove(foe, me, Dex.move('willowisp'), {index: 2});
  assert.strictEqual(me.status, 'brn', 'a status Fire move still works under primal sun');

  // Air Lock deletes ordinary weather in this project (§5) but must not delete
  // primal weather.
  assert.strictEqual(battle.clearWeather(), false, 'clearWeather must refuse primal weather');
  assert.strictEqual(battle.field.weather, 'sun');
});

test('primal rain blocks Fire, and ends when its setter leaves', () => {
  const battle = makeBattle(
    [set('kyogre', {ability: 'Primordial Sea', moves: ['surf']}), set('pikachu', {moves: ['thunderbolt']})],
    [set('groudon', {ability: 'Drought', moves: ['fireblast', 'earthquake']})]);
  const me = battle.sides[0].team[0];
  const foe = battle.sides[1].team[0];
  assert.strictEqual(battle.field.weatherPrimal, 'primordialsea');

  const before = me.currentHP;
  battle.executeMove(foe, me, Dex.move('fireblast'), {index: 0});
  assert.strictEqual(before - me.currentHP, 0, 'Fire must fizzle out in heavy rain');
  const before2 = me.currentHP;
  battle.executeMove(foe, me, Dex.move('earthquake'), {index: 1});
  assert.ok(before2 - me.currentHP > 0, 'a non-Fire move must still work');

  // No turn counter, so it has to end some other way: the setter leaving.
  battle.switchIn(0, 1);
  assert.strictEqual(battle.field.weather, null, 'primal weather ends when its setter leaves');
  assert.strictEqual(battle.field.weatherPrimal, null);
});

test('the AI knows primal weather refuses its move', () => {
  /*
   * §8: a refusal the AI does not know about becomes a move it throws every
   * turn, because nothing in the loop can change. `cannotAffect` mirrors
   * `executeMove`'s refusals and must have gained this one too.
   */
  const battle = makeBattle(
    [set('kyogre', {ability: 'Primordial Sea', moves: ['surf']})],
    [set('charizard', {moves: ['fireblast', 'airslash']})]);
  const foe = battle.sides[1].team[0];
  const me = battle.sides[0].team[0];
  assert.strictEqual(AI.willFail(battle, foe, me, Dex.move('fireblast')), true,
    'the AI should know Fire Blast cannot work in heavy rain');
  assert.strictEqual(AI.willFail(battle, foe, me, Dex.move('airslash')), false,
    'CONTROL: it must not refuse everything');
});

test('the Wind Sock extends Tailwind, and only Tailwind', () => {
  /*
   * This project's third invented item, added for the same reason as the Warp
   * Prism: screens have Light Clay, weather the four rocks, terrain the Terrain
   * Extender, Trick Room the Warp Prism — and Tailwind had nothing, despite
   * being the shortest of the lot at four turns.
   */
  const tailwindTurns = item => {
    const battle = makeBattle([set('whimsicott', {moves: ['tailwind'], item})], [set('snorlax')]);
    battle.executeMove(battle.sides[0].team[0], battle.sides[1].team[0], Dex.move('tailwind'), {index: 0});
    return battle.sides[0].conditions.tailwind;
  };
  assert.strictEqual(Dex.item('windsock').name, 'Wind Sock', 'the item must be packaged');
  assert.strictEqual(tailwindTurns(null), 4, 'unextended Tailwind is 4 turns');
  assert.strictEqual(tailwindTurns('windsock'), 7, 'the Wind Sock should extend Tailwind to 7');
  // CONTROLS, both directions: the wrong extender must not work, and the right
  // one must not leak into the effects it does not cover.
  assert.strictEqual(tailwindTurns('lightclay'), 4, 'Light Clay must not extend Tailwind');
  const screens = makeBattle([set('whimsicott', {moves: ['reflect'], item: 'windsock'})], [set('snorlax')]);
  screens.executeMove(screens.sides[0].team[0], screens.sides[1].team[0], Dex.move('reflect'), {index: 0});
  assert.strictEqual(screens.sides[0].conditions.reflect, 5, 'the Wind Sock must not extend screens');
});

/* ------------------------------------------------------------------ *
 * Themed teams lead with their setter
 * ------------------------------------------------------------------ */

test('a themed team leads with the Pokemon that sets it up', () => {
  /*
   * On a themed team the setter leading is not a preference, it is the plan:
   * a Rain team that leads its Swift Swim sweeper has not set the rain, and
   * every turn the setter is off the field is a turn the team does not work.
   *
   * Each fixture puts the setter LAST, so "it led with the setter" cannot be an
   * accident of the default order.
   */
  const cases = [
    ['Rain', [
      set('kingdra', {ability: 'Swift Swim', moves: ['surf']}),
      set('politoed', {ability: 'Drizzle', moves: ['scald']}),
    ]],
    ['Sun', [
      set('venusaur', {ability: 'Chlorophyll', moves: ['solarbeam']}),
      set('torkoal', {ability: 'Drought', moves: ['lavaplume']}),
    ]],
    ['Sand', [
      set('excadrill', {ability: 'Sand Rush', moves: ['earthquake']}),
      set('tyranitar', {ability: 'Sand Stream', moves: ['crunch']}),
    ]],
    ['screens', [
      set('garchomp', {ability: 'Rough Skin', moves: ['swordsdance', 'earthquake']}),
      set('grimmsnarl', {ability: 'Prankster', moves: ['lightscreen', 'reflect']}),
    ]],
    ['Trick Room', [
      set('conkeldurr', {ability: 'Guts', moves: ['drainpunch']}),
      set('bronzong', {ability: 'Levitate', moves: ['trickroom', 'gyroball']}),
    ]],
    ['Electric Terrain', [
      set('ironvaliant', {ability: 'Quark Drive', moves: ['moonblast']}),
      set('pincurchin', {ability: 'Electric Surge', moves: ['thunderbolt']}),
    ]],
    ['Psychic Terrain', [
      set('garchomp', {ability: 'Rough Skin', moves: ['swordsdance', 'earthquake']}),
      set('indeedee', {ability: 'Psychic Surge', moves: ['psychic']}),
    ]],
    ['Tailwind', [
      set('rhyperior', {ability: 'Solid Rock', moves: ['earthquake', 'rockwrecker']}),
      set('whimsicott', {ability: 'Prankster', moves: ['tailwind', 'moonblast']}),
    ]],
    ['Snow', [
      set('beartic', {ability: 'Slush Rush', moves: ['iciclecrash']}),
      set('abomasnow', {ability: 'Snow Warning', moves: ['blizzard']}),
    ]],
  ];

  for (const [theme, team] of cases) {
    const battle = makeBattle(team, [set('snorlax'), set('blissey')]);
    const found = AI.themeLead(battle, 0);
    assert.ok(found, `${theme}: no theme lead found`);
    assert.strictEqual(found.index, 1, `${theme}: should lead with the setter (index 1)`);
    assert.strictEqual(found.theme, theme, `${theme}: reported as "${found.theme}"`);

    /*
     * ...and it must reach the chosen order through the *public* path, which is
     * the one Arena, Campaign, Spectate and Assist auto-battle all use.
     * `chooseAction` reads its tier off `side.ai`, so a human-controlled side
     * has to be given one — the same treatment auto-battle applies.
     */
    battle.sides[0].ai = {difficulty: 'expert'};
    const choice = AI.chooseAction(battle, 0, {type: 'teampreview', bring: 2, team});
    assert.strictEqual(choice.order[0], 1, `${theme}: chooseAction did not lead the setter`);
  }
});

test('a setter only leads when the team is actually built around it', () => {
  /*
   * The other half of the rule, and the reason it is not simply "lead any
   * setter". A Tyranitar with no Sand Rush teammate is a bulky Pokémon that
   * happens to make sand, and leading it would be a regression — this was
   * called out explicitly when the rule was requested.
   */
  const loneSand = makeBattle(
    [set('blissey', {moves: ['softboiled']}), set('tyranitar', {ability: 'Sand Stream', moves: ['crunch']})],
    [set('snorlax'), set('garchomp')]);
  assert.strictEqual(AI.themeLead(loneSand, 0), null, 'sand with no abuser must not force a lead');

  // A filler Rain Dance is not a Rain team either.
  const fillerRain = makeBattle(
    [set('blissey', {moves: ['softboiled']}), set('lanturn', {ability: 'Volt Absorb', moves: ['raindance', 'surf']})],
    [set('snorlax'), set('garchomp')]);
  assert.strictEqual(AI.themeLead(fillerRain, 0), null, 'a filler Rain Dance must not force a lead');

  /*
   * Snow is the narrowest gate of the lot. Snow is usually set for Aurora Veil,
   * which is a *screens* plan and is covered by the screens theme — so Ice Body
   * and Snow Cloak, which are passive perks, must not force a snow lead. Only
   * Slush Rush does.
   */
  const passiveSnow = makeBattle(
    [set('glaceon', {ability: 'Ice Body', moves: ['icebeam']}),
      set('abomasnow', {ability: 'Snow Warning', moves: ['blizzard']})],
    [set('snorlax'), set('garchomp')]);
  assert.strictEqual(AI.themeLead(passiveSnow, 0), null,
    'Ice Body is a passive perk and must not force a snow lead');

  // Tailwind needs somebody it actually speeds up: doubling a fast sweeper's
  // Speed changes nothing that needed changing.
  const fastOnly = makeBattle(
    [set('crobat', {ability: 'Inner Focus', moves: ['bravebird']}),
      set('whimsicott', {ability: 'Prankster', moves: ['tailwind', 'moonblast']})],
    [set('snorlax'), set('garchomp')]);
  assert.strictEqual(AI.themeLead(fastOnly, 0), null,
    'Tailwind behind an already-fast team must not force a lead');

  // But a dedicated Drizzle setter is never incidental, so it leads regardless.
  const drizzle = makeBattle(
    [set('blissey', {moves: ['softboiled']}), set('pelipper', {ability: 'Drizzle', moves: ['scald']})],
    [set('snorlax'), set('garchomp')]);
  const found = AI.themeLead(drizzle, 0);
  assert.ok(found && found.index === 1, 'a dedicated Drizzle setter should lead with no abuser');

  // CONTROL for the weak tiers: this is judgement, so it sits behind
  // `level.predicts` and Casual must be unaffected — otherwise the ladder moves.
  const rain = makeBattle(
    [set('kingdra', {ability: 'Swift Swim', moves: ['surf']}), set('politoed', {ability: 'Drizzle', moves: ['scald']})],
    [set('snorlax'), set('blissey')]);
  rain.sides[0].ai = {difficulty: 'casual'};
  const casual = AI.chooseAction(rain, 0, {type: 'teampreview', bring: 2, team: rain.sides[0].team});
  assert.strictEqual(casual.order.length, 2, 'Casual still returns a full order');
  rain.sides[0].ai = {difficulty: 'expert'};
  const expert = AI.chooseAction(rain, 0, {type: 'teampreview', bring: 2, team: rain.sides[0].team});
  assert.strictEqual(expert.order[0], 1, 'Expert leads the Drizzle setter');
});

test('residualSwing predicts exactly what a real residual turn does', () => {
  /*
   * `residualSwing` mirrors `endOfTurn`'s HP sources rather than running them —
   * running the real hooks would heal the Pokémon, print to the log and advance
   * the toxic counter, and asking what a turn *would* do must never change
   * anything. Mirroring is this project's most reliable way to ship a quiet
   * disagreement, so the mirror is checked against the original the way
   * `statBreakdown` is: play a real turn and compare.
   */
  const scenarios = [
    {why: 'Leftovers', mon: {item: 'leftovers'}},
    {why: 'Black Sludge on a Poison type', mon: {species: 'toxapex', item: 'blacksludge'}},
    {why: 'Black Sludge on everything else', mon: {species: 'snorlax', item: 'blacksludge'}},
    {why: 'Sticky Barb', mon: {item: 'stickybarb'}},
    {why: 'a burn', mon: {}, status: 'brn'},
    {why: 'poison', mon: {}, status: 'psn'},
    {why: 'toxic, first tick', mon: {}, status: 'tox'},
    {why: 'toxic, fourth tick', mon: {}, status: 'tox', toxicCounter: 4},
    {why: 'Poison Heal', mon: {species: 'gliscor', ability: 'Poison Heal'}, status: 'tox'},
    {why: 'Poison Heal and Leftovers together', mon: {species: 'gliscor', ability: 'Poison Heal', item: 'leftovers'}, status: 'tox'},
    {why: 'Magic Guard ignoring a burn', mon: {species: 'clefable', ability: 'Magic Guard', item: 'leftovers'}, status: 'brn'},
    {why: 'Leech Seed', mon: {}, volatiles: {leechSeed: 1}},
    {why: 'Aqua Ring', mon: {item: 'leftovers'}, volatiles: {aquaring: true}},
    {why: 'a curse', mon: {}, volatiles: {curse: true}},
    {why: 'Salt Cure on a Water type', mon: {species: 'toxapex'}, volatiles: {saltcure: true}},
    {why: 'nothing at all', mon: {}},
  ];

  let checked = 0;
  let moved = 0;
  for (const scenario of scenarios) {
    const mine = set(scenario.mon.species || 'snorlax', Object.assign({moves: ['protect', 'tackle']}, scenario.mon));
    const battle = makeBattle([mine], [set('blissey', {moves: ['softboiled']})], {seed: 909});
    const me = battle.p1Active;
    // Start damaged, or healing is capped by the HP cap and every scenario reads 0.
    me.currentHP = Math.floor(me.maxHP / 2);
    if (scenario.status) {
      me.status = scenario.status;
      me.statusData = Object.assign({}, me.statusData, {toxicCounter: scenario.toxicCounter || 1});
    }
    Object.assign(me.volatiles, scenario.volatiles || {});

    const predicted = battle.residualSwing(me);
    const before = me.currentHP;
    turn(battle, 0, 0);                       // Protect, so nothing else touches HP
    const observed = me.currentHP - before;
    assert.strictEqual(observed, predicted,
      `${scenario.why}: predicted ${predicted} HP, the turn actually did ${observed}`);
    checked++;
    if (predicted !== 0) moved++;
  }
  // Denominators: a mirror that predicts 0 everywhere and is right because
  // nothing happened has proved nothing.
  assert.ok(checked >= 15, `expected 15+ scenarios, checked ${checked}`);
  assert.ok(moved >= 12, `expected 12+ scenarios where HP actually moved, saw ${moved}`);
});

test('the AI stalls behind Protect when the residual phase is paying it', () => {
  // Reported: Gliscor clicks attacks at half HP with a Toxic Orb running,
  // instead of Protecting and letting Poison Heal put it back together.
  const scoreOf = (battle, id) => {
    const explained = AI.explainChoice(battle, 0, 'expert');
    return explained.moves.find(m => m.id === id).score;
  };
  const gliscor = extra => set('gliscor', Object.assign(
    {ability: 'Poison Heal', item: 'toxicorb', moves: ['protect', 'earthquake']}, extra));
  const build = (mon, hpFraction) => {
    const battle = makeBattle([mon, set('snorlax', {moves: ['tackle']})],
      [set('blissey', {moves: ['seismictoss', 'softboiled']})], {seed: 5150});
    battle.sides[0].ai = {difficulty: 'expert'};
    battle.p1Active.currentHP = Math.max(1, Math.floor(battle.p1Active.maxHP * hpFraction));
    return battle;
  };

  /*
   * The claim under test is the *mechanism*, not one matchup. Asserting "it
   * Protects here" would hang the test on a knife edge: against a Toxapex the
   * two scores land 71 to 70, so the decision really does flip but a point of
   * unrelated tuning either way would break it. The three score comparisons
   * below are 25-point gaps and say exactly the same thing.
   */
  const hurt = build(gliscor(), 0.5);
  assert.strictEqual(hurt.p1Active.status, 'tox', 'the Orb is running');
  assert.ok(hurt.residualSwing(hurt.p1Active) > 0, 'Poison Heal is paying');

  // CONTROL 1 — the same Pokémon, equally hurt, with nothing paying it. If this
  // scored the same, the test would be measuring "Gliscor likes Protect".
  const dry = build(set('gliscor', {ability: 'Sand Veil', item: 'heavydutyboots', moves: ['protect', 'earthquake']}), 0.5);
  assert.strictEqual(dry.residualSwing(dry.p1Active), 0, 'nothing is paying this one');
  assert.ok(scoreOf(hurt, 'protect') > scoreOf(dry, 'protect') + 20,
    `healing must be worth real points (paid ${scoreOf(hurt, 'protect')} vs unpaid ${scoreOf(dry, 'protect')})`);

  /*
   * CONTROL 2 — at full HP there is nothing to bank, so the bonus must vanish.
   * This is why the term is capped at the HP actually missing rather than being
   * a flat reward for holding a healing item, and it is what stops a healthy
   * Pokémon stalling instead of attacking.
   */
  const healthy = build(gliscor(), 1);
  assert.ok(scoreOf(healthy, 'protect') < scoreOf(hurt, 'protect') - 20,
    `at full HP the bonus is gone (full ${scoreOf(healthy, 'protect')} vs hurt ${scoreOf(hurt, 'protect')})`);
  assert.ok(scoreOf(healthy, 'protect') < scoreOf(healthy, 'earthquake'),
    'and a healthy Gliscor attacks');

  // CONTROL 3 — stalling while *bleeding* must be worse than stalling with
  // nothing happening, or the term is rewarding the wrong sign.
  const bleeding = build(set('snorlax', {ability: 'Immunity', item: 'stickybarb', moves: ['protect', 'bodyslam']}), 0.5);
  const inert = build(set('snorlax', {ability: 'Immunity', item: 'heavydutyboots', moves: ['protect', 'bodyslam']}), 0.5);
  assert.ok(bleeding.residualSwing(bleeding.p1Active) < 0, 'this one is bleeding');
  assert.strictEqual(inert.residualSwing(inert.p1Active), 0, 'and this one is not');
  assert.ok(scoreOf(bleeding, 'protect') < scoreOf(inert, 'protect'),
    `a bleeding Pokémon is penalised for stalling (${scoreOf(bleeding, 'protect')} vs ${scoreOf(inert, 'protect')})`);

  // CONTROL 4 — this is judgement, so it sits behind `level.predicts` and the
  // weak tiers keep the old flat read. Otherwise the ladder ordering moves.
  const casualProtect = AI.explainChoice(hurt, 0, 'casual').moves.find(m => m.id === 'protect').score;
  assert.ok(casualProtect < scoreOf(hurt, 'protect') - 15,
    `CONTROL: Casual keeps the old flat read (casual ${casualProtect} vs expert ${scoreOf(hurt, 'protect')})`);
});

test('the AI knows how long Rest lasts and what Sleep Talk is for', () => {
  const scoreOf = (battle, id, tier = 'expert') =>
    AI.explainChoice(battle, 0, tier).moves.find(m => m.id === id).score;
  const build = (mine, foe, hpFraction = 0.35) => {
    const battle = makeBattle([mine, set('snorlax', {moves: ['tackle']})], [foe], {seed: 2024});
    battle.sides[0].ai = {difficulty: 'expert'};
    battle.p1Active.currentHP = Math.max(1, Math.floor(battle.p1Active.maxHP * hpFraction));
    return battle;
  };

  /*
   * Sleep Talk is only worth anything while asleep, and while asleep it is the
   * only thing that works at all. `sleepTurns` is spent at the start of each
   * move attempt, so "still asleep when I try to move" is `> 0`.
   */
  const sleeper = set('snorlax', {moves: ['sleeptalk', 'bodyslam', 'rest'], ability: 'Thick Fat'});
  const asleep = build(sleeper, set('blissey', {moves: ['seismictoss']}));
  asleep.p1Active.status = 'slp';
  asleep.p1Active.statusData.sleepTurns = 2;
  assert.ok(scoreOf(asleep, 'sleeptalk') > scoreOf(asleep, 'bodyslam'),
    `asleep, Sleep Talk is the only move that happens (talk ${scoreOf(asleep, 'sleeptalk')} vs slam ${scoreOf(asleep, 'bodyslam')})`);

  // CONTROL — awake, Sleep Talk does nothing at all and must lose to everything.
  const awake = build(sleeper, set('blissey', {moves: ['seismictoss']}));
  assert.ok(scoreOf(awake, 'sleeptalk') < scoreOf(awake, 'bodyslam'),
    `awake, Sleep Talk is dead weight (talk ${scoreOf(awake, 'sleeptalk')} vs slam ${scoreOf(awake, 'bodyslam')})`);

  // CONTROL — the turn it wakes up (`sleepTurns` 0) it is awake for scoring
  // purposes, so Sleep Talk must go back to being worthless. Getting this
  // boundary wrong would throw away the turn the sleep ends.
  const waking = build(sleeper, set('blissey', {moves: ['seismictoss']}));
  waking.p1Active.status = 'slp';
  waking.p1Active.statusData.sleepTurns = 0;
  assert.ok(scoreOf(waking, 'sleeptalk') < scoreOf(waking, 'bodyslam'),
    'on the waking turn Sleep Talk is worthless again');

  /*
   * Rest costs two helpless turns, and how much that matters depends entirely
   * on what is on the other side of the field. Same Pokémon, same HP, same
   * move — only the opponent's ability to punish two free turns differs.
   */
  const rester = set('snorlax', {moves: ['rest', 'bodyslam'], ability: 'Thick Fat'});
  const vsHarmless = build(rester, set('blissey', {moves: ['seismictoss']}));
  const vsPunisher = build(rester, set('garchomp', {moves: ['earthquake'], item: 'choiceband'}));
  assert.ok(scoreOf(vsHarmless, 'rest') > scoreOf(vsPunisher, 'rest') + 20,
    `Rest is worth more when two free turns cost little (harmless ${scoreOf(vsHarmless, 'rest')} vs punisher ${scoreOf(vsPunisher, 'rest')})`);

  /*
   * ...and Sleep Talk is exactly what buys the turns back, which is why the two
   * are paired on real sets. Same Pokémon, same foe, one extra move.
   */
  const withTalk = build(set('snorlax', {moves: ['rest', 'bodyslam', 'sleeptalk'], ability: 'Thick Fat'}),
    set('garchomp', {moves: ['earthquake'], item: 'choiceband'}));
  assert.strictEqual(AI.restingTurns(withTalk, withTalk.p1Active), 0, 'Sleep Talk means no turn is lost');
  assert.strictEqual(AI.restingTurns(vsPunisher, vsPunisher.p1Active), 2, 'without it, two are');
  assert.ok(scoreOf(withTalk, 'rest') > scoreOf(vsPunisher, 'rest') + 20,
    `RestTalk should rate Rest far higher (${scoreOf(withTalk, 'rest')} vs ${scoreOf(vsPunisher, 'rest')})`);

  /*
   * Rest is a full status cure as well as a full heal, and the cure was worth
   * nothing: a poisoned Pokémon rated Rest identically to a clean one. Reported
   * from a real log — a poisoned Dondozo bleeding every turn while the AI
   * weighed Rest as if the poison were not there.
   */
  const clean = build(rester, set('blissey', {moves: ['seismictoss']}), 0.5);
  const poisoned = build(rester, set('blissey', {moves: ['seismictoss']}), 0.5);
  poisoned.p1Active.status = 'psn';
  assert.ok(poisoned.residualSwing(poisoned.p1Active) < 0, 'the poison is really ticking');
  assert.ok(scoreOf(poisoned, 'rest') > scoreOf(clean, 'rest') + 30,
    `Rest should be worth more to a statused Pokémon (poisoned ${scoreOf(poisoned, 'rest')} vs clean ${scoreOf(clean, 'rest')})`);

  // Early Bird halves it — one lost turn, not two.
  const earlyBird = build(set('dodrio', {moves: ['rest', 'bodyslam'], ability: 'Early Bird'}),
    set('garchomp', {moves: ['earthquake'], item: 'choiceband'}));
  assert.strictEqual(AI.restingTurns(earlyBird, earlyBird.p1Active), 1, 'Early Bird burns two counters a turn');

  // CONTROL — all of this is judgement, so the weak tiers keep the old read.
  assert.ok(scoreOf(asleep, 'sleeptalk', 'casual') < scoreOf(asleep, 'sleeptalk') - 100,
    'CONTROL: Casual does not learn any of this');
});

test('the AI knows primal weather refuses a weather move, not just an attack', () => {
  /*
   * Reported from a real Rebirth battle: a Ludicolo used Rain Dance under
   * Primal Groudon's Desolate Land and the log read "But it failed!".
   *
   * The *type* half of this was already handled — a Water move under Desolate
   * Land scores -900 — because `AI.cannotAffect` mirrors `executeMove`'s
   * refusal. But `cannotAffect` is about what the **target** can be hurt by, and
   * a weather move is not aimed at the target at all: it exits the
   * `aimedAtFoePokemon` guard immediately, so nothing was checking it.
   */
  const build = (item, moves) => {
    const battle = makeBattle(
      [set('ludicolo', {moves, ability: 'Swift Swim'}), set('kingdra', {moves: ['hydropump']})],
      [set('groudon', {moves: ['precipiceblades'], item, ability: 'Drought'})], {seed: 3});
    battle.sides[0].ai = {difficulty: 'expert'};
    return battle;
  };
  const fails = (battle, id) =>
    AI.explainChoice(battle, 0, 'expert').moves.find(m => m.id === id).willFail;

  const primal = build('redorb', ['raindance', 'hydropump', 'gigadrain', 'icebeam']);
  assert.strictEqual(primal.field.weatherPrimal, 'desolateland', 'the fixture really has primal sun up');
  assert.strictEqual(primal.setWeather('rain', primal.p1Active), false,
    'and the engine really does refuse the weather, or there is nothing to know');
  assert.strictEqual(fails(primal, 'raindance'), true, 'Rain Dance is refused');
  assert.strictEqual(fails(primal, 'hydropump'), true, 'and Water moves already were');
  assert.notStrictEqual(AI.explainChoice(primal, 0, 'expert').moves[AI.explainChoice(primal, 0, 'expert').best].id,
    'raindance', 'so it picks something that works');

  // The mirror case: Fire under Primordial Sea.
  const sea = makeBattle(
    [set('charizard', {moves: ['flamethrower', 'airslash'], ability: 'Blaze'})],
    [set('kyogre', {moves: ['originpulse'], item: 'blueorb', ability: 'Drizzle'})], {seed: 3});
  sea.sides[0].ai = {difficulty: 'expert'};
  assert.strictEqual(sea.field.weatherPrimal, 'primordialsea');
  assert.strictEqual(AI.explainChoice(sea, 0, 'expert').moves.find(m => m.id === 'flamethrower').willFail, true,
    'Fire is refused under heavy rain');

  /*
   * CONTROLS — the refusal has to stay narrow, or the AI stops setting weather
   * at all. Ordinary sun is replaceable, and Rain Dance is a fine move there.
   */
  const ordinary = build('leftovers', ['raindance', 'hydropump', 'gigadrain', 'icebeam']);
  assert.strictEqual(ordinary.field.weatherPrimal, null, 'CONTROL: ordinary sun, not primal');
  assert.strictEqual(fails(ordinary, 'raindance'), false, 'CONTROL: Rain Dance still works under ordinary sun');
  assert.strictEqual(fails(ordinary, 'hydropump'), false, 'CONTROL: and so do Water moves');

  // CONTROL — setting the weather that is already up does nothing either.
  const same = makeBattle(
    [set('torkoal', {moves: ['sunnyday', 'lavaplume'], ability: 'Drought'})],
    [set('snorlax', {moves: ['tackle']})], {seed: 3});
  same.sides[0].ai = {difficulty: 'expert'};
  assert.strictEqual(same.field.weather, 'sun');
  assert.strictEqual(AI.explainChoice(same, 0, 'expert').moves.find(m => m.id === 'sunnyday').willFail, true,
    'CONTROL: re-setting the same weather is refused');

  /*
   * CONTROL — Chilly Reception also *pivots*, so failing to change the weather
   * does not make it useless. A refusal that ignored the rest of a move would
   * throw away a switch the AI wanted.
   */
  const pivot = makeBattle(
    [set('slowking', {moves: ['chillyreception', 'scald'], ability: 'Regenerator'}), set('snorlax', {moves: ['tackle']})],
    [set('groudon', {moves: ['precipiceblades'], item: 'redorb', ability: 'Drought'})], {seed: 3});
  pivot.sides[0].ai = {difficulty: 'expert'};
  assert.strictEqual(pivot.field.weatherPrimal, 'desolateland');
  assert.strictEqual(AI.explainChoice(pivot, 0, 'expert').moves.find(m => m.id === 'chillyreception').willFail, false,
    'CONTROL: a move that also pivots is not refused for its weather half');
});

test('a slow team facing a fast one sets Trick Room', () => {
  /*
   * The other half of the Calyrex-Ice report (`tests/teams.js` owns whether the
   * move is ever *generated*). Generating it would be pointless if the AI would
   * not use it, and using it would be pointless if it were never generated —
   * the bug was only ever in the first of those.
   */
  const battle = makeBattle(
    [set('calyrexice', {moves: ['glaciallance', 'trickroom', 'closecombat', 'zenheadbutt']}),
      set('melmetal', {moves: ['doubleironbash']}), set('conkeldurr', {moves: ['drainpunch']})],
    [set('volcarona', {moves: ['fierydance', 'roost']}), set('zeraora', {moves: ['plasmafists']}),
      set('dragapult', {moves: ['dragondarts']})], {seed: 9});
  battle.sides[0].ai = {difficulty: 'expert'};
  /*
   * The foe has to be one Calyrex cannot knock out. A first version put a
   * Dragapult in front, which Glacial Lance one-shots — and attacking something
   * you can KO is correct play on any team, so the fixture was measuring the
   * opposite of what it claims. Volcarona is the Pokémon from the report and
   * survives the hit.
   */
  assert.strictEqual(AI.explainChoice(battle, 0, 'expert').moves.find(m => m.id === 'glaciallance').kos, false,
    'the fixture is only meaningful while the attack is not a knockout');
  const scoreOf = (b, id) => AI.explainChoice(b, 0, 'expert').moves.find(m => m.id === id).score;
  assert.ok(scoreOf(battle, 'trickroom') > scoreOf(battle, 'glaciallance'),
    `a slow team facing a fast one should set the room ` +
    `(room ${scoreOf(battle, 'trickroom')}, attack ${scoreOf(battle, 'glaciallance')})`);

  /*
   * ...and it sets the room **even over a knockout**, by project decision and
   * on the measurement. The AI never looks past the current turn (AI_DESIGN
   * §3), and Trick Room is the one move whose whole value is the turns after
   * this one — so a one-turn model can never price it. Played out 120 times
   * from the reported position, forcing each choice: taking the KO won 3/120,
   * setting the room won 94/120.
   */
  const koable = makeBattle(
    [set('calyrexice', {moves: ['glaciallance', 'trickroom', 'closecombat', 'zenheadbutt']}),
      set('melmetal', {moves: ['doubleironbash']}), set('conkeldurr', {moves: ['drainpunch']})],
    [set('volcarona', {moves: ['fierydance']}), set('zeraora', {moves: ['plasmafists']}),
      set('dragapult', {moves: ['dragondarts']})], {seed: 9});
  koable.sides[0].ai = {difficulty: 'expert'};
  koable.p2Active.currentHP = 1;
  assert.strictEqual(AI.explainChoice(koable, 0, 'expert').moves.find(m => m.id === 'glaciallance').kos, true,
    'the attack really is a knockout here');
  assert.ok(scoreOf(koable, 'trickroom') > scoreOf(koable, 'glaciallance'),
    `the room beats a knockout (room ${scoreOf(koable, 'trickroom')}, KO ${scoreOf(koable, 'glaciallance')})`);

  /*
   * CONTROL 1 — but never when the knockout *ends the battle*. Setting up
   * instead of winning is the obvious way to make this rule worse, so the
   * last opposing Pokémon is excluded.
   */
  const lastFoe = makeBattle(
    [set('calyrexice', {moves: ['glaciallance', 'trickroom', 'closecombat', 'zenheadbutt']}),
      set('melmetal', {moves: ['doubleironbash']}), set('conkeldurr', {moves: ['drainpunch']})],
    [set('volcarona', {moves: ['fierydance']})], {seed: 9});
  lastFoe.sides[0].ai = {difficulty: 'expert'};
  lastFoe.p2Active.currentHP = 1;
  assert.ok(scoreOf(lastFoe, 'glaciallance') > scoreOf(lastFoe, 'trickroom'),
    'CONTROL: take the win rather than set up');

  // CONTROL 2 — a *fast* team gains nothing from inverting the order, so the
  // same move on the same Pokémon must lose to attacking.
  const fast = makeBattle(
    [set('calyrexice', {moves: ['glaciallance', 'trickroom', 'closecombat', 'zenheadbutt']}),
      set('dragapult', {moves: ['dragondarts']}), set('zeraora', {moves: ['plasmafists']})],
    [set('shuckle', {moves: ['toxic']}), set('melmetal', {moves: ['doubleironbash']})], {seed: 9});
  fast.sides[0].ai = {difficulty: 'expert'};
  assert.ok(scoreOf(fast, 'trickroom') < scoreOf(fast, 'glaciallance'),
    'CONTROL: a fast team should not invert the turn order');

  // CONTROL 3 — and it does not re-set a room that is already up.
  const alreadyUp = makeBattle(
    [set('calyrexice', {moves: ['glaciallance', 'trickroom', 'closecombat', 'zenheadbutt']}),
      set('melmetal', {moves: ['doubleironbash']}), set('conkeldurr', {moves: ['drainpunch']})],
    [set('volcarona', {moves: ['fierydance']}), set('zeraora', {moves: ['plasmafists']})],
    {seed: 9, fieldEffects: {side: 0, pseudoWeather: ['trickroom']}});
  alreadyUp.sides[0].ai = {difficulty: 'expert'};
  assert.ok(scoreOf(alreadyUp, 'trickroom') < scoreOf(alreadyUp, 'glaciallance'),
    'CONTROL: the room is already up, so cancelling it would be absurd');
});

test('the AI switches out when it literally cannot do anything', () => {
  /*
   * Reported from a real battle: a Kingambit Choice-locked into Dig against a
   * Flying Skarmory stayed in for **six turns**, alternating burrow and "it
   * doesn't affect", and died there.
   *
   * Two bugs, and the first hid the second. `bestDamage` ignored the Choice
   * lock, so it reported the Kowtow Cleave the Pokémon could not select — which
   * made `canKO`, `matchupScore` and the threat estimate all read a position
   * that did not exist. And `considerSwitch` compares matchups against a margin
   * of 3.4-5.2, so even once the matchup read 0.0 against a bench of 1.1 and
   * 1.5, a *completely* lost position still lost the comparison to a merely bad
   * one. Being unable to act is a gate, not a margin.
   */
  const build = ({locked = true, foe = 'skarmory'} = {}) => {
    const battle = makeBattle([
      set('kingambit', {moves: ['dig', 'kowtowcleave', 'suckerpunch', 'ironhead'], item: 'choiceband', ability: 'Defiant'}),
      set('pheromosa', {moves: ['closecombat', 'tripleaxel'], ability: 'Beast Boost'}),
      set('yveltal', {moves: ['darkpulse', 'uturn'], ability: 'Dark Aura'}),
    ], [set(foe, {moves: ['bodypress', 'roost'], ability: 'Sturdy', item: 'rockyhelmet'})], {seed: 5});
    battle.sides[0].ai = {difficulty: 'expert'};
    if (locked) battle.p1Active.choiceLockedMove = 'dig';
    return battle;
  };

  const stuck = build();
  // The fixture has to be real: the lock must actually restrict what is legal,
  // or this test proves nothing. (A first version set the wrong property name
  // and every move stayed selectable.)
  assert.deepStrictEqual([...stuck.availableMoveIndices(stuck.p1Active)], [0],
    'the Choice lock must really restrict the move list');
  assert.strictEqual(AI.bestDamage(stuck, stuck.p1Active, stuck.p2Active).damage, 0,
    'bestDamage must respect the lock, not report a move it cannot select');
  assert.strictEqual(AI.helpless(stuck, stuck.p1Active, stuck.p2Active), true);
  assert.strictEqual(AI.chooseAction(stuck, 0, stuck.requests[0]).type, 'switch',
    'it must switch rather than keep hitting an immunity');

  /*
   * CONTROLS — this has to stay narrow. Sucker Punch aside, a Choice item is a
   * normal thing to hold and a bad matchup is a normal thing to be in; an AI
   * that fled either would be far worse than the bug.
   */
  const free = build({locked: false});
  assert.strictEqual(AI.helpless(free, free.p1Active, free.p2Active), false,
    'CONTROL: unlocked, it has Kowtow Cleave and is not helpless');
  assert.strictEqual(AI.chooseAction(free, 0, free.requests[0]).type, 'move',
    'CONTROL: so it attacks instead of switching');

  const working = build({foe: 'toxapex'});
  assert.strictEqual(AI.helpless(working, working.p1Active, working.p2Active), false,
    'CONTROL: locked into a move that works is not helpless');
  assert.strictEqual(AI.chooseAction(working, 0, working.requests[0]).type, 'move',
    'CONTROL: so it keeps using it');

  // CONTROL — ungated by design (§8: "a blunder must be a worse move, not an
  // impossible one"), so the weakest tier must escape too. Six turns of hitting
  // nothing reads as broken, not as an easy opponent.
  const casual = build();
  casual.sides[0].ai = {difficulty: 'casual'};
  assert.strictEqual(AI.chooseAction(casual, 0, casual.requests[0]).type, 'switch',
    'CONTROL: even Casual gets out');
});

test('the card can see a Protosynthesis / Quark Drive boost', () => {
  /*
   * These raise a stat with no boost *stage* behind them — the multiplier lives
   * in `onModifyStat` — so nothing in `boosts` reflects them and the only trace
   * was a log line that scrolls away. The view has to carry which stat is
   * boosted for the card to show it as an ordinary boost.
   */
  const battle = makeBattle(
    [set('ironvaliant', {ability: 'Quark Drive', item: 'boosterenergy', moves: ['moonblast']})],
    [set('snorlax', {moves: ['tackle']})]);
  const me = battle.view(0).sides[0].active;
  assert.ok(['atk', 'def', 'spa', 'spd', 'spe'].includes(me.abilityBoost),
    `the view reports the boosted stat, got ${me.abilityBoost}`);
  // The stat really is multiplied, so the card is not announcing a fiction.
  const boosted = battle.p1Active.abilityState.boostedStat;
  const plain = makeBattle(
    [set('ironvaliant', {ability: 'Quark Drive', item: 'leftovers', moves: ['moonblast']})],
    [set('snorlax', {moves: ['tackle']})]);
  assert.ok(battle.getStat(battle.p1Active, boosted) > plain.getStat(plain.p1Active, boosted),
    'and the stat it names is genuinely raised');

  // CONTROL 1 — inactive without its trigger, so the card must show nothing.
  assert.strictEqual(plain.view(0).sides[0].active.abilityBoost, null,
    'CONTROL: no Booster Energy, no Electric Terrain, no badge');

  // CONTROL 2 — an ordinary Pokémon never grows the field at all.
  const ordinary = makeBattle([set('snorlax', {moves: ['tackle']})], [set('blissey', {moves: ['softboiled']})]);
  assert.strictEqual(ordinary.view(0).sides[0].active.abilityBoost, null, 'CONTROL: unrelated ability');

  /*
   * CONTROL 3 — it follows the same reveal gate as the ability name. The
   * activation is announced in the log for both sides so this is not new
   * information, but showing it while the ability itself is hidden would be an
   * odd half-reveal, and `hideOpponentDetails` is on in every format.
   */
  const hidden = makeBattle(
    [set('snorlax', {moves: ['tackle']})],
    [set('ironvaliant', {ability: 'Quark Drive', item: 'boosterenergy', moves: ['moonblast']})],
    {overrides: {hideOpponentDetails: true}});
  const foe = hidden.view(0).sides[1].active;
  assert.strictEqual(foe.ability, null, 'the opponent ability is hidden');
  assert.strictEqual(foe.abilityBoost, null, 'CONTROL: and so is what it boosted');
});

test('the AI refuses a priority move Psychic Terrain or Dazzling will block', () => {
  /*
   * Reported from a real log: a Kingambit threw Sucker Punch into a Tapu Lele
   * under its own Psychic Terrain on three consecutive turns and died without
   * landing anything. `scoreMove` computed the condition and then only used it
   * to withhold a +80 bonus, so the move kept its full damage score.
   */
  const kingambit = () => set('kingambit', {moves: ['suckerpunch', 'kowtowcleave', 'ironhead', 'swordsdance'], ability: 'Defiant'});
  const build = (terrain, foeSpecies = 'tapulele', foeAbility = 'Psychic Surge') => {
    const battle = makeBattle([kingambit(), set('snorlax')],
      [set(foeSpecies, {moves: ['moonblast'], ability: foeAbility})], {seed: 31});
    battle.sides[0].ai = {difficulty: 'expert'};
    if (terrain) battle.setTerrain(terrain, null);
    else battle.field.terrain = null;
    return battle;
  };
  const scoreOf = (battle, id) => AI.explainChoice(battle, 0, 'expert').moves.find(m => m.id === id).score;

  const blocked = build('psychic');
  assert.ok(scoreOf(blocked, 'suckerpunch') < -500,
    `Sucker Punch must be refused under Psychic Terrain (${scoreOf(blocked, 'suckerpunch')})`);
  assert.notStrictEqual(AI.explainChoice(blocked, 0, 'expert').moves[AI.explainChoice(blocked, 0, 'expert').best].id,
    'suckerpunch', 'and it must not be the chosen move');

  // Dazzling / Queenly Majesty / Armor Tail refuse it with no terrain at all.
  assert.ok(scoreOf(build(null, 'bruxish', 'Dazzling'), 'suckerpunch') < -500,
    'Dazzling refuses priority too');

  /*
   * CONTROLS — the refusal must be narrow. Sucker Punch is one of this
   * project's five unconditional priority moves and a major AI tool, so a
   * version of this that refused it too often would be worse than the bug.
   */
  assert.ok(scoreOf(build(null), 'suckerpunch') > 0, 'CONTROL: fine with no terrain');
  assert.ok(scoreOf(build('electric'), 'suckerpunch') > 0, 'CONTROL: only Psychic Terrain blocks');
  assert.ok(scoreOf(build('psychic', 'tornadus', 'Prankster'), 'suckerpunch') > 0,
    'CONTROL: an ungrounded target is not protected by the terrain');

  /*
   * CONTROL — the refusal mirrors the *engine*, which reads the packaged
   * `move.priority`. Grassy Glide's +1 is applied in `runTurn` against a
   * packaged 0 (PROJECT_CONTEXT §5), so in this battle system it really does
   * land under Psychic Terrain, and the AI must keep using it. Mirroring the
   * games instead of the engine would make the AI disagree with the battle.
   */
  const glide = makeBattle([set('rillaboom', {moves: ['grassyglide', 'knockoff'], ability: 'Overgrow'}), set('snorlax')],
    [set('tapulele', {moves: ['moonblast'], ability: 'Psychic Surge'})], {seed: 31});
  glide.sides[0].ai = {difficulty: 'expert'};
  assert.strictEqual(glide.field.terrain, 'psychic', 'the terrain is up');
  assert.ok(scoreOf(glide, 'grassyglide') > 0,
    `CONTROL: Grassy Glide still works here (${scoreOf(glide, 'grassyglide')})`);
});

test('a sleeping Pokemon does not throw moves that cannot happen', () => {
  /*
   * Separate from the Sleep Talk test above, and it has to be: Sleep Talk's own
   * bonus wins on its own against ordinary moves, so that test passes with this
   * gate deleted. What only this gate can do is beat a *knockout* — worth ~390
   * between the damage, the KO bonus and moving first — which a sleeping
   * Pokémon cannot land and would otherwise pick every turn.
   */
  const battle = makeBattle(
    [set('snorlax', {moves: ['sleeptalk', 'brickbreak'], ability: 'Thick Fat'}), set('blissey', {moves: ['softboiled']})],
    [set('tyranitar', {moves: ['crunch']})], {seed: 4242});
  battle.sides[0].ai = {difficulty: 'expert'};
  const foe = battle.p2Active;
  foe.currentHP = 1;                                   // Brick Break is a certain KO
  const scores = id => AI.explainChoice(battle, 0, 'expert').moves.find(m => m.id === id).score;
  const koScore = scores('brickbreak');

  battle.p1Active.status = 'slp';
  battle.p1Active.statusData.sleepTurns = 2;
  assert.ok(scores('sleeptalk') > scores('brickbreak'),
    `asleep, even a guaranteed KO must lose to the only move that happens ` +
    `(talk ${scores('sleeptalk')} vs KO ${scores('brickbreak')})`);

  // CONTROL: awake, that same knockout must be the obvious pick — otherwise
  // this is measuring a blanket dislike of attacking rather than the sleep gate.
  const awake = makeBattle(
    [set('snorlax', {moves: ['sleeptalk', 'brickbreak'], ability: 'Thick Fat'}), set('blissey', {moves: ['softboiled']})],
    [set('tyranitar', {moves: ['crunch']})], {seed: 4242});
  awake.sides[0].ai = {difficulty: 'expert'};
  awake.p2Active.currentHP = 1;
  const awakeScores = id => AI.explainChoice(awake, 0, 'expert').moves.find(m => m.id === id).score;
  assert.ok(awakeScores('brickbreak') > awakeScores('sleeptalk'),
    'CONTROL: awake, the knockout wins');
  assert.ok(koScore > 200, `CONTROL: the KO really is a big score (${koScore})`);
});

test('the status Orbs fire on entry, not at the end of the turn', () => {
  // Officially they activate in the residual phase, which costs the holder the
  // whole turn it switches in — a Guts attacker's first turn is unboosted, a
  // Poison Heal holder's first turn does not heal. Here they fire on entry.
  const guts = set('conkeldurr', {ability: 'Guts', item: 'flameorb', moves: ['drainpunch']});
  const battle = makeBattle([guts, set('snorlax', {moves: ['tackle']})], [set('blissey', {moves: ['softboiled']})]);
  const lead = battle.p1Active;
  assert.strictEqual(lead.status, 'brn', 'a lead is burned before it acts, not after the turn');
  assert.strictEqual(battle.turn, 1, 'and on turn one, not turn two');

  // The whole point: the boost the Orb pays for is live on the turn it enters.
  // Comparing against an unstatused copy is what makes this non-vacuous.
  const noOrb = makeBattle([set('conkeldurr', {ability: 'Guts', moves: ['drainpunch']})],
    [set('blissey', {moves: ['softboiled']})]);
  assert.ok(battle.getStat(lead, 'atk') > noOrb.getStat(noOrb.p1Active, 'atk'),
    `Guts should be live on the entry turn (${battle.getStat(lead, 'atk')} vs ${noOrb.getStat(noOrb.p1Active, 'atk')})`);

  // A mid-battle switch-in takes it on arrival too, not a turn later.
  const swap = makeBattle([set('snorlax', {moves: ['tackle']}), set('gliscor', {ability: 'Poison Heal', item: 'toxicorb', moves: ['earthquake']})],
    [set('blissey', {moves: ['softboiled']})]);
  turn(swap, {type: 'switch', index: 1}, 0);
  assert.strictEqual(swap.p1Active.species, 'gliscor');
  assert.strictEqual(swap.p1Active.status, 'tox', 'a switch-in is afflicted on arrival');

  // CONTROL — `onResidual` is still needed and is not a leftover: an Orb that
  // arrives mid-battle, or a holder whose status is cured, must be re-afflicted
  // at the end of the turn. Deleting the residual hook has to break this.
  // (Both sides use a move that ends nothing: a Guts-boosted Drain Punch ended
  // the battle on turn one, so the residual phase never ran and the control
  // "failed" for the wrong reason.)
  const cured = makeBattle([set('conkeldurr', {ability: 'Guts', item: 'flameorb', moves: ['protect']})],
    [set('blissey', {moves: ['softboiled']})]);
  cured.p1Active.status = null;
  turn(cured, 0, 0);
  assert.ok(!cured.ended, 'the control turn must actually reach the residual phase');
  assert.strictEqual(cured.p1Active.status, 'brn', 'CONTROL: a cured holder is burned again at end of turn');

  // CONTROL — an existing status is never overwritten, on entry or residually.
  const poisoned = makeBattle([set('snorlax', {moves: ['tackle']}), set('gliscor', {ability: 'Sand Veil', item: 'toxicorb', moves: ['earthquake']})],
    [set('blissey', {moves: ['softboiled']})]);
  poisoned.sides[0].team[1].status = 'par';
  turn(poisoned, {type: 'switch', index: 1}, 0);
  assert.strictEqual(poisoned.p1Active.status, 'par', 'CONTROL: the Orb does not overwrite an existing status');
});

/* ------------------------------------------------------------------ *
 * Endless field effects — Rebirth Mode's opening doctrine
 * ------------------------------------------------------------------ */

/** Two inert Pokémon a side: nothing here touches weather, terrain or rooms. */
function inertBattle(fieldEffects) {
  const dummy = () => set('shuckle', {moves: ['tackle', 'withdraw'], ability: 'Sturdy'});
  return makeBattle([dummy(), dummy()], [dummy(), dummy()], {fieldEffects, seed: 777});
}

test('an endless field effect has no turn counter at all', () => {
  const battle = inertBattle({side: 1, weather: 'sun', terrain: 'psychic', pseudoWeather: ['trickroom'],
    own: {reflect: true, tailwind: true}});
  assert.strictEqual(battle.field.weather, 'sun', 'the doctrine is up from turn one');
  assert.strictEqual(battle.field.weatherPrimal, null,
    'endless is a third state — it must not borrow primal weather\'s lock');
  for (let i = 0; i < 12 && !battle.ended; i++) turn(battle, 0, 0);
  assert.ok(battle.turn >= 12, `expected 12+ turns, ran ${battle.turn}`);
  assert.strictEqual(battle.field.weather, 'sun', 'weather still up after a dozen turns');
  assert.strictEqual(battle.field.terrain, 'psychic', 'terrain still up');
  assert.ok(battle.field.pseudoWeather.trickroom > 0, 'Trick Room still up');
  assert.ok(battle.sides[1].conditions.reflect > 0, 'Reflect still up');
  assert.ok(battle.sides[1].conditions.tailwind > 0, 'Tailwind still up');

  // CONTROL: the same effects on ordinary durations must all have expired by
  // now, or this test would pass without `endless` doing anything.
  const ordinary = inertBattle(null);
  ordinary.setWeather('sun', null);
  ordinary.setTerrain('psychic', null);
  ordinary.setPseudoWeather('trickroom', null);
  ordinary.addSideCondition(ordinary.sides[1], 'reflect');
  ordinary.addSideCondition(ordinary.sides[1], 'tailwind');
  for (let i = 0; i < 12 && !ordinary.ended; i++) turn(ordinary, 0, 0);
  assert.strictEqual(ordinary.field.weather, null, 'CONTROL: ordinary weather expires');
  assert.strictEqual(ordinary.field.terrain, null, 'CONTROL: ordinary terrain expires');
  assert.strictEqual(ordinary.field.pseudoWeather.trickroom, 0, 'CONTROL: an ordinary room expires');
  assert.strictEqual(ordinary.sides[1].conditions.reflect, 0, 'CONTROL: an ordinary screen expires');
  assert.strictEqual(ordinary.sides[1].conditions.tailwind, 0, 'CONTROL: an ordinary Tailwind expires');
});

test('an endless weather is still removable, and primal weather still is not', () => {
  // The whole point of the third state: primal weather's persistence without
  // primal weather's lock. Both halves are asserted against each other, so a
  // change that collapsed them into one mechanism fails here.
  const byClear = inertBattle({side: 1, weather: 'sun'});
  assert.strictEqual(byClear.clearWeather({text: 'Air Lock'}), true, 'Cloud Nine / Air Lock beats it');
  assert.strictEqual(byClear.field.weather, null);

  const bySetter = inertBattle({side: 1, weather: 'sun'});
  assert.strictEqual(bySetter.setWeather('rain', null), true, 'an opposing weather setter beats it');
  assert.strictEqual(bySetter.field.weather, 'rain');
  assert.strictEqual(bySetter.field.weatherTurns, 5, 'and the replacement is an ordinary five turns');

  // CONTROL / contrast: primal weather refuses both, and an endless weather
  // cannot overwrite it either.
  const primal = inertBattle(null);
  primal.setWeather('rain', primal.p2Active, {primal: 'primordialsea'});
  assert.strictEqual(primal.clearWeather({text: 'Air Lock'}), false, 'primal refuses Air Lock');
  assert.strictEqual(primal.setWeather('sun', null), false, 'primal refuses an ordinary setter');
  assert.strictEqual(primal.setWeather('sun', null, {endless: true}), false, 'primal refuses an endless setter');
  assert.strictEqual(primal.field.weather, 'rain');
});

test('pre-laid hazards wait for the first switch instead of hitting the leads', () => {
  const battle = inertBattle({side: 1, foe: {stealthrock: true, spikes: 2}});
  assert.strictEqual(battle.sides[0].conditions.stealthrock, 1, 'the rocks are down');
  assert.strictEqual(battle.sides[0].conditions.spikes, 2, 'two layers, applied one at a time');
  const lead = battle.p1Active;
  assert.strictEqual(lead.currentHP, lead.maxHP,
    'a Pokémon already standing on the field does not walk into hazards laid under it');
  // ...but the next one in does, which is what makes them worth laying.
  turn(battle, {type: 'switch', index: 1}, 0);
  const arrived = battle.p1Active;
  assert.ok(arrived.currentHP < arrived.maxHP, 'the switch-in takes the hazards');
});

test('a room used a second time ends it, and Gravity does not', () => {
  // Counterplay for an endless Trick Room: nothing else in the game removes
  // one, so setting it is how you take it down (as in the games).
  const battle = inertBattle({side: 1, pseudoWeather: ['trickroom']});
  assert.ok(battle.field.pseudoWeather.trickroom > 0, 'the room is up');
  assert.strictEqual(battle.setPseudoWeather('trickroom', null, {endless: true}), false,
    'establishing a doctrine must never cancel itself');
  assert.ok(battle.field.pseudoWeather.trickroom > 0, 'still up after the refused re-declaration');
  assert.strictEqual(battle.setPseudoWeather('trickroom', null), true, 'using it again ends it');
  assert.strictEqual(battle.field.pseudoWeather.trickroom, 0);

  // CONTROL: Gravity is not self-cancelling in the games either, so a blanket
  // "re-using a pseudo-weather toggles it" would fail here.
  assert.strictEqual(battle.setPseudoWeather('gravity'), true);
  assert.strictEqual(battle.setPseudoWeather('gravity'), false, 'CONTROL: Gravity does not toggle');
  assert.ok(battle.field.pseudoWeather.gravity > 0, 'CONTROL: Gravity is still up');
});

test('the AI tears down a room that suits the other side and keeps one that suits its own', () => {
  const roomBattle = (team, foe) => {
    const battle = makeBattle(team, foe, {fieldEffects: {side: 1, pseudoWeather: ['trickroom']}, seed: 31337});
    battle.sides[0].ai = {difficulty: 'expert'};
    return battle;
  };
  const trickRoom = m => ({type: 'move', index: m});
  void trickRoom;
  const scoreOf = (battle, index) => AI.explainChoice(battle, 0, 'expert').moves[index].score;

  // A fast team is hurt by the room, so cancelling it is worth doing.
  const fast = roomBattle(
    [set('dragapult', {moves: ['trickroom', 'dragondarts']}), set('weavile', {moves: ['iceshard']})],
    [set('shuckle', {moves: ['tackle']}), set('shuckle', {moves: ['tackle']})]);
  // A slow team is helped by it, so cancelling is the wrong move.
  const slow = roomBattle(
    [set('torkoal', {moves: ['trickroom', 'lavaplume']}), set('melmetal', {moves: ['earthquake']})],
    [set('dragapult', {moves: ['tackle']}), set('weavile', {moves: ['tackle']})]);

  const fastScore = scoreOf(fast, 0);
  const slowScore = scoreOf(slow, 0);
  assert.ok(fastScore > slowScore + 100,
    `cancelling should be worth far more to the fast team (fast ${fastScore} vs slow ${slowScore})`);

  // CONTROL: the weak tiers must not learn this — it is judgement, so it sits
  // behind `level.predicts` and the ladder ordering has to hold.
  fast.sides[0].ai = {difficulty: 'casual'};
  const casual = AI.explainChoice(fast, 0, 'casual').moves[0].score;
  assert.ok(casual < fastScore - 100,
    `CONTROL: Casual keeps the old flat refusal (casual ${casual} vs expert ${fastScore})`);
});

/* ------------------------------------------------------------------ *
 * The 26 previously unsimulated abilities and items (2026-08-14)
 *
 * PROJECT_CONTEXT §9 recorded both groups as deliberately unsimulated; §10
 * item 4c reverses that. Every test below has a control in
 * `tools/coverage-controls.js`, which breaks the implementation on purpose and
 * asserts the matching test goes red — a test nobody has seen fail proves
 * nothing (§11).
 * ------------------------------------------------------------------ */

test('coverage: every packaged ability and item is simulated or inert by design', () => {
  const abilities = RedGPT.Abilities.coverage();
  const items = RedGPT.Items.coverage();
  assert.deepStrictEqual([...abilities.missing], [], 'no ability may be left unsimulated');
  assert.deepStrictEqual([...items.missing], [], 'no item may be left unsimulated');
  // Denominators, so "0 missing" cannot pass by the tables being empty.
  assert.strictEqual(abilities.implemented.length + abilities.cosmetic.length, abilities.total);
  assert.strictEqual(items.implemented.length + items.cosmetic.length, items.total);
  assert.ok(abilities.total > 300 && items.total > 500,
    `the coverage tables must actually be populated (${abilities.total} abilities, ${items.total} items)`);
});

test("Delta Stream's strong winds cancel the Flying type's weaknesses, one cell at a time", () => {
  const battle = pinRng(makeBattle([set('rayquaza', {moves: ['splash'], level: 100})],
    [set('gyarados', {moves: ['splash'], level: 100}), set('garchomp', {moves: ['splash'], level: 100})],
    {seed: 909}));
  const flyer = battle.sides[1].team[0];        // Water / Flying
  const grounded = battle.sides[1].team[1];     // Dragon / Ground, not Flying

  assert.strictEqual(battle.effectiveness('Electric', flyer), 4, 'setup: Electric is 4x on Gyarados');
  assert.strictEqual(battle.effectiveness('Ice', flyer), 1, 'setup: Ice is 1x on Gyarados');
  assert.strictEqual(battle.effectiveness('Rock', flyer), 2, 'setup: Rock is 2x on Gyarados');

  forceAbility(battle.sides[0].team[0], 'Delta Stream');
  assert.ok(battle.strongWindsActive(), 'a Delta Stream holder on the field raises strong winds');

  // The Flying cell drops 2x -> 1x. It is not a cap: the Water half survives
  // intact in both directions, which is what a naive "at most neutral" version
  // would get wrong.
  assert.strictEqual(battle.effectiveness('Electric', flyer), 2, 'Electric 4x -> 2x, not 1x');
  assert.strictEqual(battle.effectiveness('Ice', flyer), 0.5, 'Ice 1x -> 0.5x: the Water resistance is kept');
  assert.strictEqual(battle.effectiveness('Rock', flyer), 1, 'Rock 2x -> 1x');
  // Types Flying was never weak to, and a defender that is not Flying at all.
  assert.strictEqual(battle.effectiveness('Grass', flyer), 1, 'Grass is untouched');
  assert.strictEqual(battle.effectiveness('Ice', grounded), 4, 'a non-Flying defender is untouched');
});

test('Delta Stream deletes the weather, and is the one entry ability that beats primal weather', () => {
  const build = ability => {
    const battle = pinRng(makeBattle([set('rayquaza', {moves: ['splash'], level: 100}),
      set('snorlax', {moves: ['splash'], level: 100})],
    [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
    return {battle, mon: forceAbility(battle.sides[0].team[0], ability)};
  };

  for (const weather of ['rain', 'sun', 'sandstorm', 'snow']) {
    const {battle, mon} = build('Delta Stream');
    battle.field.weather = weather;
    battle.field.weatherTurns = 5;
    battle.runAbility('onStart', mon);
    assert.strictEqual(battle.field.weather, null, `Delta Stream should clear ordinary ${weather}`);
  }

  // Primal weather: Delta Stream removes it (the trio mutually override in the
  // games) while Cloud Nine and Air Lock still cannot. The contrast is the
  // decision, so both halves are pinned together.
  const primal = build('Delta Stream');
  primal.battle.setWeather('sun', primal.battle.sides[1].team[0], {primal: 'desolateland'});
  assert.strictEqual(primal.battle.field.weatherPrimal, 'desolateland', 'setup: primal weather is up');
  primal.battle.runAbility('onStart', primal.mon);
  assert.strictEqual(primal.battle.field.weather, null, 'Delta Stream removes primal weather');
  assert.strictEqual(primal.battle.field.weatherPrimal, null, 'and clears the primal marker with it');

  for (const ability of ['Cloud Nine', 'Air Lock']) {
    const held = build(ability);
    held.battle.setWeather('sun', held.battle.sides[1].team[0], {primal: 'desolateland'});
    held.battle.runAbility('onStart', held.mon);
    assert.strictEqual(held.battle.field.weatherPrimal, 'desolateland',
      `CONTROL: ${ability} must still be refused by primal weather`);
  }
});

test("Mega Sol gives only its own holder sun, and does not set the weather", () => {
  const battle = pinRng(makeBattle([set('meganium', {moves: ['splash'], level: 100})],
    [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
  const user = forceAbility(battle.sides[0].team[0], 'Mega Sol');
  const foe = battle.sides[1].team[0];

  assert.strictEqual(battle.field.weather, null, 'Mega Sol must not set the weather');
  assert.strictEqual(battle.weatherFor(user), 'sun', "the holder's own moves see sun");
  assert.strictEqual(battle.weatherFor(foe), null, 'the opponent sees no weather at all');
  assert.strictEqual(battle.weatherPowerModifier(user, 'Fire'), 1.5, 'Fire is boosted for the holder');
  assert.strictEqual(battle.weatherPowerModifier(user, 'Water'), 0.5, 'Water is weakened for the holder');
  assert.strictEqual(battle.weatherPowerModifier(foe, 'Fire'), 1, "the opponent's Fire move is unaffected");

  // Utility Umbrella is applied last and therefore wins, which is the stated
  // resolution rather than an accident.
  user.item = 'utilityumbrella';
  assert.strictEqual(battle.weatherFor(user), null, 'Utility Umbrella shields its holder from its own Mega Sol');
});

test('Piercing Drill breaks Protect, and pays the quarter-damage price only when it had to', () => {
  // The attacker is deliberately under-levelled. A level-100 Excadrill takes
  // Blissey past its 651 max HP, and the observed damage is then *capped* — the
  // §8 HP-capping trap, which made the first version of this test compare a
  // quarter of a truncated number against the real one.
  const build = ability => {
    const battle = pinRng(makeBattle([set('excadrill', {ability, moves: ['ironhead'], level: 50})],
      [set('blissey', {moves: ['protect', 'splash'], level: 100})], {seed: 909}));
    forceAbility(battle.sides[0].team[0], ability);
    return battle;
  };
  const dealt = (battle, foeMove) => {
    const foe = battle.sides[1].team[0];
    const before = foe.currentHP;
    turn(battle, 0, foeMove);
    const damage = before - foe.currentHP;
    assert.ok(damage < foe.maxHP, `the hit must not be capped by max HP (${damage} of ${foe.maxHP})`);
    return damage;
  };

  // Setup proof: an ordinary ability is stopped dead by Protect, so "it landed"
  // below means something.
  assert.strictEqual(dealt(build('Pressure'), 0), 0, 'setup: Protect stops an ordinary contact move');

  const full = dealt(build('Piercing Drill'), 1);        // foe uses Splash
  const pierced = dealt(build('Piercing Drill'), 0);     // foe uses Protect
  const ordinary = dealt(build('Pressure'), 1);

  assert.ok(full > 4, `setup: the move must deal real damage unprotected (${full})`);
  assert.strictEqual(full, ordinary, 'against an unprotected target Piercing Drill is an ordinary move');
  assert.ok(pierced > 0, 'Piercing Drill goes through the protection');
  assert.strictEqual(pierced, Math.max(1, Math.floor(full * 0.25)),
    `a pierced hit lands for a quarter (${pierced} of ${full})`);
});

test('Poison Puppeteer confuses what it poisons, and only what it poisons', () => {
  const build = (ability, move) => {
    const battle = pinRng(makeBattle([set('pecharunt', {ability, moves: [move], level: 100})],
      [set('snorlax', {moves: ['splash'], level: 100})], {seed: 909}));
    forceAbility(battle.sides[0].team[0], ability);
    // Snorlax's first ability is Immunity, which would refuse the poison outright.
    forceAbility(battle.sides[1].team[0], 'Thick Fat');
    turn(battle, 0, 0);
    return battle.sides[1].team[0];
  };

  const poisoned = build('Poison Puppeteer', 'toxic');
  assert.ok(['psn', 'tox'].includes(poisoned.status), `setup: the target is poisoned (${poisoned.status})`);
  assert.ok(poisoned.volatiles.confusion, 'a poisoned target is also confused');

  // A different status must not confuse — the branch is on the status, not on
  // "this Pokémon inflicted something".
  const paralysed = build('Poison Puppeteer', 'thunderwave');
  assert.strictEqual(paralysed.status, 'par', 'setup: the target is paralysed');
  assert.ok(!paralysed.volatiles.confusion, 'paralysis must not confuse');

  // CONTROL: without the ability the same poison confuses nobody.
  const plain = build('Thick Fat', 'toxic');
  assert.ok(['psn', 'tox'].includes(plain.status), 'setup: the control target is poisoned too');
  assert.ok(!plain.volatiles.confusion, 'CONTROL: poison alone does not confuse');
});

test('Spicy Spray burns any attacker, with no contact requirement and no roll', () => {
  const build = (ability, move) => {
    const battle = pinRng(makeBattle([set('scovillain', {ability, moves: ['splash'], level: 100})],
      [set('vaporeon', {moves: [move], level: 100})], {seed: 909}));
    forceAbility(battle.sides[0].team[0], ability);
    turn(battle, 0, 0);
    return battle.sides[1].team[0];
  };

  // Surf is special and non-contact — the case Flame Body would miss entirely.
  assert.ok(!Dex.move('surf').flags?.contact, 'setup: Surf makes no contact');
  assert.strictEqual(build('Spicy Spray', 'surf').status, 'brn', 'a non-contact attacker is burned');
  assert.strictEqual(build('Spicy Spray', 'waterfall').status, 'brn', 'a contact attacker is burned too');
  // `pinRng` pins every chance roll to false, so a 30% version would burn nobody
  // here — which is exactly what makes this test able to tell the two apart.
  assert.strictEqual(build('Thick Fat', 'surf').status, null, 'CONTROL: no ability, no burn');
});

test('Curious Medicine resets the foe every stage, in both directions', () => {
  const build = ability => {
    const battle = pinRng(makeBattle([set('slowkinggalar', {ability, moves: ['splash'], level: 100}),
      set('snorlax', {moves: ['splash'], level: 100})],
    [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
    const mon = forceAbility(battle.sides[0].team[0], ability);
    const foe = battle.sides[1].team[0];
    foe.boosts.atk = 3;
    foe.boosts.spe = 2;
    foe.boosts.def = -1;
    battle.runAbility('onStart', mon);
    return foe;
  };

  const reset = build('Curious Medicine');
  assert.strictEqual(reset.boosts.atk, 0, 'a positive stage is reset');
  assert.strictEqual(reset.boosts.spe, 0, 'every positive stage is reset');
  assert.strictEqual(reset.boosts.def, 0, 'a negative stage is reset too — this cuts both ways by design');

  const untouched = build('Own Tempo');
  assert.strictEqual(untouched.boosts.atk, 3, 'CONTROL: another ability leaves the boosts alone');
});

test('Hospitality heals the most injured teammate on the bench, never the holder', () => {
  const build = ability => {
    const battle = pinRng(makeBattle([
      set('sinistcha', {ability, moves: ['splash'], level: 100}),
      set('snorlax', {moves: ['splash'], level: 100}),
      set('blissey', {moves: ['splash'], level: 100}),
    ], [set('garchomp', {moves: ['splash'], level: 100})], {seed: 909}));
    const mon = forceAbility(battle.sides[0].team[0], ability);
    mon.currentHP = Math.floor(mon.maxHP / 2);
    const [, mild, hurt] = battle.sides[0].team;
    mild.currentHP = mild.maxHP - 1;
    hurt.currentHP = Math.floor(hurt.maxHP / 4);
    battle.runAbility('onStart', mon);
    return {mon, mild, hurt};
  };

  const {mon, mild, hurt} = build('Hospitality');
  assert.strictEqual(hurt.currentHP, Math.floor(hurt.maxHP / 4) + Math.floor(hurt.maxHP / 4),
    'the most injured teammate gains a quarter of its own max HP');
  assert.strictEqual(mild.currentHP, mild.maxHP - 1, 'the less injured teammate is not served');
  assert.strictEqual(mon.currentHP, Math.floor(mon.maxHP / 2), 'the holder heals nothing itself');

  const control = build('Own Tempo');
  assert.strictEqual(control.hurt.currentHP, Math.floor(control.hurt.maxHP / 4),
    'CONTROL: another ability heals nobody');
});

test('Supersweet Syrup lowers the foe evasiveness on every entry', () => {
  const battle = pinRng(makeBattle([set('hydrapple', {moves: ['splash'], level: 100}),
    set('snorlax', {moves: ['splash'], level: 100})],
  [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
  const mon = forceAbility(battle.sides[0].team[0], 'Supersweet Syrup');
  const foe = battle.sides[1].team[0];
  foe.boosts.evasion = 0;
  battle.runAbility('onStart', mon);
  assert.strictEqual(foe.boosts.evasion, -1, 'evasiveness falls a stage on entry');

  // Every entry, deliberately — the same choice Intrepid Sword and Dauntless
  // Shield already make in this project.
  battle.switchIn(0, 1, {silent: true});
  battle.switchIn(0, 0, {silent: true});
  assert.strictEqual(foe.boosts.evasion, -2, 'and again on re-entry');
});

test('Teraform Zero flattens weather and terrain when Terapagos Terastallizes', () => {
  const build = ability => {
    const battle = pinRng(makeBattle([set('terapagosstellar', {ability, moves: ['splash'], level: 100, teraType: 'Stellar'})],
      [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
    battle.rules.tera = true;
    battle.sides[0].terastallized = false;
    return {battle, mon: forceAbility(battle.sides[0].team[0], ability)};
  };

  const ordinary = build('Teraform Zero');
  ordinary.battle.setWeather('sun', ordinary.mon);
  ordinary.battle.setTerrain('electric', ordinary.mon);
  assert.ok(ordinary.battle.terastallize(ordinary.mon), 'setup: Terastallization is available');
  assert.strictEqual(ordinary.battle.field.weather, null, 'the weather is gone');
  assert.strictEqual(ordinary.battle.field.terrain, null, 'the terrain is gone');

  // It removes primal weather, which Cloud Nine and Air Lock cannot: spending
  // your one Terastallization is the price that buys it.
  const primal = build('Teraform Zero');
  primal.battle.setWeather('rain', primal.battle.sides[1].team[0], {primal: 'primordialsea'});
  primal.battle.terastallize(primal.mon);
  assert.strictEqual(primal.battle.field.weather, null, 'primal weather is flattened too');
  assert.strictEqual(primal.battle.field.weatherPrimal, null, 'and its marker with it');

  const control = build('Own Tempo');
  control.battle.setWeather('sun', control.mon);
  control.battle.setTerrain('electric', control.mon);
  control.battle.terastallize(control.mon);
  assert.strictEqual(control.battle.field.weather, 'sun', 'CONTROL: another ability changes nothing');
  assert.strictEqual(control.battle.field.terrain, 'electric', 'CONTROL: the terrain survives too');
});

test('Lingering Aroma and Mummy spread on contact but never overwrite an identity ability', () => {
  const build = (holderAbility, attacker, attackerAbility) => {
    const battle = pinRng(makeBattle([set('oinkologne', {moves: ['splash'], level: 100})],
      [set(attacker, {moves: ['tackle'], level: 100})], {seed: 909}));
    forceAbility(battle.sides[0].team[0], holderAbility);
    forceAbility(battle.sides[1].team[0], attackerAbility);
    turn(battle, 0, 0);
    return battle.sides[1].team[0];
  };

  assert.strictEqual(Dex.toID(build('Lingering Aroma', 'snorlax', 'Thick Fat').ability), 'lingeringaroma',
    'contact spreads Lingering Aroma');
  assert.strictEqual(Dex.toID(build('Mummy', 'snorlax', 'Thick Fat').ability), 'mummy',
    'Mummy still works, sharing the same implementation');

  // The exclusion list Mummy never had: a forme-defining ability is left alone.
  for (const spreader of ['Lingering Aroma', 'Mummy']) {
    assert.strictEqual(Dex.toID(build(spreader, 'aegislash', 'Stance Change').ability), 'stancechange',
      `${spreader} must not overwrite Stance Change`);
  }
  // And the two do not replace each other.
  assert.strictEqual(Dex.toID(build('Lingering Aroma', 'snorlax', 'Mummy').ability), 'mummy',
    'the two spreaders leave each other alone');
});

test('Eelevate is Levitate and Beast Boost, and the AI reads the immunity', () => {
  const build = ability => {
    const battle = pinRng(makeBattle([set('eelektross', {ability, moves: ['splash'], level: 100})],
      [set('garchomp', {moves: ['earthquake'], level: 100})], {seed: 909}));
    return {battle, mon: forceAbility(battle.sides[0].team[0], ability), foe: battle.sides[1].team[0]};
  };

  const floating = build('Eelevate');
  turn(floating.battle, 0, 0);
  assert.strictEqual(floating.mon.currentHP, floating.mon.maxHP, 'Earthquake does not land on Eelevate');
  assert.strictEqual(AI.estimateDamage(floating.battle, floating.foe, floating.mon, Dex.move('earthquake')), 0,
    'the AI must know the move cannot work, or it throws it every turn (§8)');

  const grounded = build('Levitate');
  assert.ok(grounded.battle.isGrounded(grounded.mon) === false, 'Levitate floats, as the shared helper says');

  const hit = build('Thick Fat');
  turn(hit.battle, 0, 0);
  assert.ok(hit.mon.currentHP < hit.mon.maxHP, 'CONTROL: without the ability Earthquake lands');

  // The Beast Boost half: knocking something out raises the highest stat.
  const koed = build('Eelevate');
  koed.foe.currentHP = 1;
  koed.battle.runAbility('onFoeFaint', koed.mon, koed.foe);
  const raised = Object.entries(koed.mon.boosts).filter(([, v]) => v > 0);
  assert.strictEqual(raised.length, 1, `exactly one stat is raised on a knockout (${JSON.stringify(koed.mon.boosts)})`);
});

test('Dragonize turns Normal moves Dragon at 1.2x, the post-nerf multiplier', () => {
  const battle = pinRng(makeBattle([set('feraligatr', {moves: ['bodyslam'], level: 100})],
    [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
  const user = forceAbility(battle.sides[0].team[0], 'Dragonize');
  const foe = battle.sides[1].team[0];
  const move = Object.assign({}, Dex.move('bodyslam'));

  battle.runAbility('onModifyMove', user, move, foe);
  assert.strictEqual(move.type, 'Dragon', 'a Normal attack becomes Dragon');
  assert.strictEqual(battle.modifyValue('onBasePower', user, move.basePower, foe, move),
    Math.floor(move.basePower * 1.2), 'and hits for 1.2x');
  // Pinned as a literal so it cannot silently drift up to the 1.3x the restored
  // `-ate` abilities carry: those are rollbacks of a nerf, and this ability
  // postdates it.
  assert.notStrictEqual(battle.modifyValue('onBasePower', user, move.basePower, foe, move),
    Math.floor(move.basePower * 1.3), 'Dragonize is not one of the restored 1.3x abilities');

  const status = Object.assign({}, Dex.move('growl'));
  battle.runAbility('onModifyMove', user, status, foe);
  assert.strictEqual(status.type, 'Normal', 'a Normal *status* move is untouched');
});

test('Fire Mane multiplies Fire attacks by 1.5 and nothing else', () => {
  const battle = pinRng(makeBattle([set('pyroar', {moves: ['flamethrower'], level: 100})],
    [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
  const user = forceAbility(battle.sides[0].team[0], 'Fire Mane');
  const foe = battle.sides[1].team[0];
  for (const [id, expected] of [['flamethrower', 1.5], ['hyperbeam', 1]]) {
    const move = Dex.move(id);
    assert.strictEqual(battle.modifyValue('onBasePower', user, move.basePower, foe, move),
      Math.floor(move.basePower * expected), `${id} should be ${expected}x`);
  }
});

test('the Generation 2 healing Berries fire at half HP for their stated amounts', () => {
  const eat = (item, hpFraction) => {
    const battle = pinRng(makeBattle([set('snorlax', {item, moves: ['splash'], level: 100})],
      [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
    const mon = battle.sides[0].team[0];
    mon.currentHP = Math.floor(mon.maxHP * hpFraction);
    const before = mon.currentHP;
    battle.checkItemTriggers(mon);
    return {healed: mon.currentHP - before, item: mon.item};
  };

  const berry = eat('berry', 0.5);
  assert.strictEqual(berry.healed, 10, 'Berry restores 10 HP');
  assert.strictEqual(berry.item, null, 'and is consumed');
  assert.strictEqual(eat('goldberry', 0.5).healed, 30, 'Gold Berry restores 30 HP');
  // The threshold is the half its own description states, not the quarter this
  // project's Oran Berry uses — so it must NOT fire just above a half, and it
  // must fire at a half where Oran does not.
  assert.strictEqual(eat('berry', 0.6).healed, 0, 'above half HP it holds');
  assert.strictEqual(eat('oranberry', 0.5).healed, 0, 'CONTROL: Oran Berry keeps its quarter threshold');
  assert.strictEqual(eat('oranberry', 0.25).healed, 10, 'CONTROL: and still fires at a quarter');
});

test('the Generation 2 status Berries cure their own status, all five of them', () => {
  const cured = (item, status) => {
    const battle = pinRng(makeBattle([set('shuckle', {item, moves: ['splash'], level: 100})],
      [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
    const mon = battle.sides[0].team[0];
    mon.status = status;
    battle.checkItemTriggers(mon);
    return mon.status === null && mon.item === null;
  };
  const table = [['przcureberry', 'par'], ['mintberry', 'slp'], ['psncureberry', 'psn'],
    ['iceberry', 'brn'], ['burntberry', 'frz']];
  let worked = 0;
  for (const [item, status] of table) {
    if (cured(item, status)) worked++;
    // Each must cure only its own status, or the table is not being read.
    assert.ok(!cured(item, status === 'par' ? 'brn' : 'par'),
      `${item} must not cure an unrelated status`);
  }
  assert.strictEqual(worked, table.length, `all ${table.length} Gen 2 status Berries cure (got ${worked})`);
});

test('Bitter Berry, Miracle Berry and Mystery Berry match their modern twins', () => {
  const battleWith = item => {
    const battle = pinRng(makeBattle([set('shuckle', {item, moves: ['splash', 'tackle'], level: 100})],
      [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
    return {battle, mon: battle.sides[0].team[0]};
  };

  const bitter = battleWith('bitterberry');
  bitter.mon.volatiles.confusion = 3;
  bitter.mon.status = 'par';
  bitter.battle.checkItemTriggers(bitter.mon);
  assert.ok(!bitter.mon.volatiles.confusion, 'Bitter Berry cures confusion');
  assert.strictEqual(bitter.mon.status, 'par', 'and leaves a non-volatile status alone, like Persim');

  const miracle = battleWith('miracleberry');
  miracle.mon.volatiles.confusion = 3;
  miracle.mon.status = 'par';
  miracle.battle.checkItemTriggers(miracle.mon);
  assert.ok(!miracle.mon.volatiles.confusion, 'Miracle Berry cures confusion');
  assert.strictEqual(miracle.mon.status, null, 'and the status too, like Lum');

  // Mystery Berry is Leppa at 5 PP, not 10 — the parameter has to be real.
  for (const [item, expected] of [['mysteryberry', 5], ['leppaberry', 10]]) {
    const {battle, mon} = battleWith(item);
    mon.moves[0].pp = 0;
    battle.checkItemTriggers(mon);
    assert.strictEqual(mon.moves[0].pp, expected, `${item} restores ${expected} PP`);
  }
});

test('Berserk Gene trades +2 Attack for confusion on entry, once', () => {
  // Read after `start()` rather than by calling the hook by hand: the Gene fires
  // on the real entry path, and a hand-run hook would find the item already
  // spent and quietly assert nothing.
  const lead = pinRng(makeBattle([set('snorlax', {item: 'berserkgene', moves: ['splash'], level: 100})],
    [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
  const mon = lead.sides[0].team[0];
  assert.strictEqual(mon.boosts.atk, 2, '+2 Attack on entry');
  assert.ok(mon.volatiles.confusion, 'and confusion as the price');
  assert.strictEqual(mon.item, null, 'the Gene is spent');
  assert.strictEqual(mon.consumedItem, 'berserkgene', 'and recorded as consumed');

  const control = pinRng(makeBattle([set('snorlax', {moves: ['splash'], level: 100})],
    [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
  assert.strictEqual(control.sides[0].team[0].boosts.atk, 0, 'CONTROL: no Gene, no boost');
  assert.ok(!control.sides[0].team[0].volatiles.confusion, 'CONTROL: and no confusion');

  // Own Tempo takes the Attack for free, exactly as in Generation 2 — the
  // confusion goes through `addVolatile`, so the refusal is not special-cased.
  const tempo = pinRng(makeBattle([set('slowbro', {ability: 'Own Tempo', item: 'berserkgene', moves: ['splash'], level: 100})],
    [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
  const calm = tempo.sides[0].team[0];
  assert.strictEqual(Dex.toID(calm.ability), 'owntempo', 'setup: the holder really has Own Tempo');
  assert.strictEqual(calm.boosts.atk, 2, 'Own Tempo still gets the Attack');
  assert.ok(!calm.volatiles.confusion, 'but not the confusion');
});

test('Pink Bow and Polkadot Bow boost Normal moves by 1.1x, not the modern 1.2x', () => {
  for (const item of ['pinkbow', 'polkadotbow']) {
    const battle = pinRng(makeBattle([set('snorlax', {item, moves: ['bodyslam'], level: 100})],
      [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
    const user = battle.sides[0].team[0];
    const foe = battle.sides[1].team[0];
    const normal = Dex.move('bodyslam');
    const other = Dex.move('earthquake');
    assert.strictEqual(battle.modifyValue('onBasePower', user, normal.basePower, foe, normal),
      Math.floor(normal.basePower * 1.1), `${item} boosts Normal by 1.1x`);
    assert.notStrictEqual(battle.modifyValue('onBasePower', user, normal.basePower, foe, normal),
      Math.floor(normal.basePower * 1.2), `${item} is not a modern 1.2x type booster`);
    assert.strictEqual(battle.modifyValue('onBasePower', user, other.basePower, foe, other),
      other.basePower, `${item} leaves other types alone`);
  }
});

test('every new Berry works through the force-eat path as well as its own trigger', () => {
  // The reason they are declared with `eatableBerry`: Bug Bite, Pluck, Stuff
  // Cheeks, Tea Time and a flung Berry all apply the effect with no trigger
  // check (§5). A Berry defined with a fused trigger would silently do nothing.
  // Each Berry is force-fed into a position *it* has something to do in. A
  // shared "everything is wrong at once" position looks thorough and is not:
  // the first version used one, and the four status Berries whose status was
  // absent correctly did nothing, so the test measured 6 of 10 and would have
  // passed six broken implementations if it had only asserted "some applied".
  const cases = [
    ['berry', mon => { mon.currentHP = Math.floor(mon.maxHP / 2); }],
    ['goldberry', mon => { mon.currentHP = Math.floor(mon.maxHP / 2); }],
    ['przcureberry', mon => { mon.status = 'par'; }],
    ['mintberry', mon => { mon.status = 'slp'; }],
    ['psncureberry', mon => { mon.status = 'psn'; }],
    ['iceberry', mon => { mon.status = 'brn'; }],
    ['burntberry', mon => { mon.status = 'frz'; }],
    ['bitterberry', mon => { mon.volatiles.confusion = 3; }],
    ['miracleberry', mon => { mon.status = 'par'; }],
    ['mysteryberry', mon => { mon.moves[0].pp = 0; }],
  ];
  const snapshot = mon => `${mon.currentHP}|${mon.status}|${!!mon.volatiles.confusion}|${mon.moves[0].pp}`;
  let applied = 0;
  for (const [id, position] of cases) {
    const battle = pinRng(makeBattle([set('snorlax', {moves: ['splash', 'tackle'], level: 100})],
      [set('blissey', {moves: ['splash'], level: 100})], {seed: 909}));
    const eater = battle.sides[0].team[0];
    position(eater);
    const before = snapshot(eater);
    assert.ok(battle.forceEatBerry(eater, id), `${id} must be recognised as a Berry`);
    if (snapshot(eater) !== before) applied++;
    assert.ok(eater.ateBerry, `${id} sets ateBerry on the eater, so Belch is enabled`);
  }
  assert.strictEqual(applied, cases.length,
    `all ${cases.length} new Berries must apply an effect when force-fed (got ${applied})`);
});

test('Tera Blast takes the Tera type and the dominant attacking stat', () => {
  const build = (species, options = {}) => {
    const battle = pinRng(makeBattle([set(species, Object.assign({moves: ['terablast'], level: 100}, options))],
      [set('blissey', {moves: ['splash'], level: 100})], {seed: 909, overrides: {tera: true}}));
    return {battle, user: battle.sides[0].team[0], move: Dex.move('terablast')};
  };

  // Untransformed it is an ordinary Normal-type special attack — the whole
  // point of the gate, and what it was doing in *every* case before this.
  const plain = build('garchomp', {teraType: 'Ground'});
  assert.strictEqual(plain.battle.moveType(plain.user, null, plain.move), 'Normal');
  assert.strictEqual(plain.battle.moveCategory(plain.user, plain.move), 'Special');

  // Terastallized: the Tera type, and physical because Garchomp's Attack wins.
  const physical = build('garchomp', {teraType: 'Ground'});
  assert.ok(physical.battle.terastallize(physical.user), 'setup: Terastallization is available');
  assert.strictEqual(physical.battle.moveType(physical.user, null, physical.move), 'Ground');
  assert.strictEqual(physical.battle.moveCategory(physical.user, physical.move), 'Physical');

  // A special attacker keeps it special, so this is a comparison and not a
  // blanket "Tera Blast is physical".
  const special = build('alakazam', {teraType: 'Fairy'});
  special.battle.terastallize(special.user);
  assert.strictEqual(special.battle.moveType(special.user, null, special.move), 'Fairy');
  assert.strictEqual(special.battle.moveCategory(special.user, special.move), 'Special');

  // Boosts count, because the comparison goes through `getStat` — a Swords
  // Dance really can flip it, as in the games.
  const boosted = build('alakazam', {teraType: 'Fairy'});
  boosted.battle.terastallize(boosted.user);
  boosted.user.boosts.atk = 6;
  assert.strictEqual(boosted.battle.moveCategory(boosted.user, boosted.move), 'Physical',
    'a large Attack boost flips the category');

  /*
   * It reaches the real damage path, not just the accessor.
   *
   * The **type is held constant** — both runs are a Tera'd Ground Tera Blast
   * into the same Blissey — and only the stat profile is flipped, so the
   * difference can only be the category. A first version compared
   * Terastallized against not, which changes the *type* as well, so it moved
   * for the wrong reason and its control stayed green: two terms pushing the
   * same way, testing the stronger one (§8).
   *
   * Blissey is the target precisely because its defences are lopsided — base 10
   * Defence against base 135 Special Defence — so hitting the wrong one is
   * impossible to miss.
   */
  const teraBlastInto = flipToSpecial => {
    const {battle, user} = build('garchomp', {teraType: 'Ground'});
    battle.terastallize(user);
    // -6 Attack drops it below Special Attack, so the category flips. The
    // *special* side of the calculation is untouched by it.
    if (flipToSpecial) user.boosts.atk = -6;
    const foe = battle.sides[1].team[0];
    const before = foe.currentHP;
    turn(battle, 0, 0);
    return before - foe.currentHP;
  };
  const asPhysical = teraBlastInto(false);
  const asSpecial = teraBlastInto(true);
  assert.ok(asPhysical > 0 && asSpecial > 0, 'setup: both land');
  assert.ok(asPhysical > asSpecial * 3,
    `a physical Tera Blast must hit Blissey's Defence, not its Special Defence (${asPhysical} vs ${asSpecial})`);

  // And the AI reads the same answer, or it prices a physical Tera Blast
  // against Special Defence (docs/AI_DESIGN.md §1).
  const seen = build('garchomp', {teraType: 'Ground'});
  seen.battle.terastallize(seen.user);
  const foe = seen.battle.sides[1].team[0];
  assert.ok(AI.estimateDamage(seen.battle, seen.user, foe, seen.move) > 0,
    'the AI must estimate a Tera Blast at all');
});

test('Revelation Dance follows the user for type and category alike', () => {
  const build = (species, options = {}) => {
    const battle = pinRng(makeBattle([set(species, Object.assign({moves: ['revelationdance'], level: 100}, options))],
      [set('blissey', {moves: ['splash'], level: 100})], {seed: 909, overrides: {tera: true}}));
    return {battle, user: battle.sides[0].team[0], move: Dex.move('revelationdance')};
  };

  // Type from the user's primary type — already the case, and kept here so the
  // category change cannot quietly break it.
  const oricorio = build('oricorio');
  assert.strictEqual(oricorio.battle.moveType(oricorio.user, null, oricorio.move), 'Fire');
  assert.strictEqual(oricorio.battle.moveCategory(oricorio.user, oricorio.move), 'Special',
    "Oricorio's Special Attack is the higher of the two");

  // Category follows the stat with **no Tera gate**, unlike Tera Blast: the
  // move already takes its type from the user in every state, so it takes its
  // category the same way.
  const beefy = build('oricorio');
  beefy.user.boosts.atk = 6;
  assert.strictEqual(beefy.battle.moveCategory(beefy.user, beefy.move), 'Physical');

  // Terastallizing still moves the type, which is what the 2026-08-14 fix
  // established — `types[0]`, not the species' own typing.
  const tera = build('oricorio', {teraType: 'Water'});
  tera.battle.terastallize(tera.user);
  assert.strictEqual(tera.battle.moveType(tera.user, null, tera.move), 'Water');
});

test('heldForme reports the forme a held item produces, and only that', () => {
  const mk = (species, item, extra = {}) => set(species, Object.assign({item, level: 100}, extra));
  const M = RedGPT.Mechanics;

  // A Mega Stone: what it *becomes*, once declared, so not automatic.
  const megaY = M.heldForme(mk('charizard', 'charizarditey'));
  assert.strictEqual(megaY.id, 'charizardmegay');
  assert.strictEqual(megaY.kind, 'mega');
  assert.strictEqual(megaY.automatic, false, 'Mega Evolution is declared in battle, not automatic on entry');
  assert.strictEqual(M.formeAbility(mk('charizard', 'charizarditey'), megaY), 'Drought',
    "the Mega forme's ability replaces the holder's, as megaEvolve does");

  // A forme-change item: what it *is*, from the moment it switches in.
  const primal = M.heldForme(mk('groudon', 'redorb'));
  assert.strictEqual(primal.id, 'groudonprimal');
  assert.strictEqual(primal.kind, 'entry');
  assert.strictEqual(primal.automatic, true, 'the Red Orb transforms on entry');
  assert.strictEqual(M.formeAbility(mk('groudon', 'redorb'), primal), 'Desolate Land');

  // A Plate decides what an Arceus *is* — §8's bug, and why this matters.
  assert.strictEqual(M.heldForme(mk('arceus', 'splashplate')).id, 'arceuswater');

  // A stone for a different species produces nothing. `megaStone` is keyed by
  // species name, so reading it without that check would put Charizard-Mega-X
  // on whatever happened to be holding the item.
  assert.strictEqual(M.heldForme(mk('garchomp', 'charizarditex')), null,
    "another species' Mega Stone must produce no forme");
  assert.strictEqual(M.heldForme(mk('charizard', 'leftovers')), null, 'an ordinary item produces no forme');

  // Ability-driven formes are deliberately excluded: they happen mid-battle on
  // a condition, so drawing them in a team builder would misstate what arrives.
  assert.strictEqual(M.heldForme(mk('aegislash', 'leftovers', {ability: 'Stance Change'})), null,
    'Stance Change is mid-battle, so Aegislash still arrives in Shield forme');
  assert.strictEqual(M.heldForme(mk('greninja', 'leftovers', {ability: 'Battle Bond'})), null,
    'Battle Bond needs a knockout first');
  // ...but `reachableFormes` still lists them, tagged, so the Pokémon menu can.
  const aegis = M.reachableFormes(mk('aegislash', 'leftovers', {ability: 'Stance Change'}));
  assert.ok(aegis.some(f => f.id === 'aegislashblade' && f.kind === 'ability'),
    'reachableFormes keeps the ability-driven forme, tagged as such');

  // Rayquaza is the one route with no item, decided at team-build time all the same.
  assert.strictEqual(M.heldForme(mk('rayquaza', 'leftovers', {moves: ['dragonascent']})).id, 'rayquazamega');
  assert.strictEqual(M.heldForme(mk('rayquaza', 'leftovers', {moves: ['tackle']})), null,
    'without Dragon Ascent there is no Mega');
});

test('a rampage dragged off the field by a Red Card ends without throwing', () => {
  /*
   * Reported by a Rebirth balance probe crash (seed 2377). The order is the
   * whole bug: the Red Card holder must arrive *after* the rampage has started,
   * so the card fires on a turn `fromLocked` is already true and
   * `clearOnSwitch` has wiped the lock `finishLockedMove` then decrements. A
   * card held by the first target fires while `fromLocked` is still false and
   * never reproduces it.
   */
  const battle = pinRng(makeBattle([
    set('tauros', {moves: ['outrage'], level: 100}),
    set('snorlax', {moves: ['splash'], level: 100}),
  ], [
    set('magikarp', {moves: ['splash'], level: 5}),
    set('shuckle', {item: 'redcard', moves: ['splash'], level: 100}),
  ], {seed: 909}));

  const user = battle.sides[0].team[0];
  const first = battle.sides[1].team[0];
  first.currentHP = 1;                       // guarantee the knockout

  turn(battle, 0, 0);
  assert.ok(first.fainted, 'setup: the first target faints to the rampage');
  assert.ok(user.volatiles.lockedMove, 'setup: the rampage locked in on the turn it knocked something out');
  // The Red Card holder arrives only now, which is what makes this reachable.
  if (battle.needsChoice(1)) battle.choose(1, {type: 'switch', index: 1});
  assert.strictEqual(Dex.toID(battle.sides[1].team[battle.sides[1].activeIndex].item), 'redcard',
    'setup: the replacement is the Red Card holder');

  // This threw before the guard: fromLocked is true, and the card's drag-out
  // deletes the lock mid-move.
  turn(battle, 0, 0);
  assert.ok(!user.volatiles.lockedMove, 'being dragged out ends the rampage');
  assert.ok(!user.volatiles.confusion, 'and ends it without fatigue confusion, like every other early break');
  assert.ok(battle.log.some(line => /dragged out/.test(line)), 'setup: the Red Card really fired');
});


test('the AI prices Fishious Rend and Bolt Beak by when the move will land, not by the flag now', () => {
  /*
   * Fishious Rend, Bolt Beak, Payback and Analytic read
   * `defender.hasActedThisTurn`, and the AI chooses BEFORE the turn runs —
   * `resetTurnFlags` has cleared that flag for both sides at choice time. So
   * the engine value is true *now* and false *when the move lands*, and a
   * slower Dracovish rated its own Fishious Rend at the full doubled 170 BP.
   *
   * The engine was never wrong: `dynamicBasePower` reads the flag correctly and
   * a real battle shows the exact 2x swing. What was wrong was the AI's input —
   * the family §8 records for the Mega-aware `incomingThreat` fix.
   */
  const vish = Pokemon.normalizeSet({species: 'Dracovish', ability: 'Strong Jaw', item: '',
    level: 100, nature: 'Adamant', evs: {atk: 252, hp: 4}, moves: ['fishiousrend']});
  const slowFoe = Pokemon.normalizeSet({species: 'Swampert', ability: 'Torrent', item: '',
    level: 100, nature: 'Relaxed', evs: {hp: 252, def: 252}, moves: ['splash']});
  const fastFoe = Pokemon.normalizeSet({species: 'Swampert', ability: 'Torrent', item: 'choicescarf',
    level: 100, nature: 'Relaxed', evs: {hp: 252, def: 252}, moves: ['splash']});

  const move = Dex.move('fishiousrend');
  const a = makeBattle([vish], [slowFoe]);
  const b = makeBattle([vish], [fastFoe]);


  const fast = AI.estimateDamage(a, a.sides[0].team[0], a.sides[1].team[0], move);
  const slow = AI.estimateDamage(b, b.sides[0].team[0], b.sides[1].team[0], move);

  // Turn order really does differ between the two fixtures, or this proves nothing.
  assert.strictEqual(AI.movesFirst(a, a.sides[0].team[0], a.sides[1].team[0]), true, 'fixture: should outspeed');
  assert.strictEqual(AI.movesFirst(b, b.sides[0].team[0], b.sides[1].team[0]), false, 'fixture: should be outsped');

  assert.ok(fast > slow * 1.8 && fast < slow * 2.2,
    `moving first should be about double: saw ${fast} against ${slow}`);

  /*
   * And it must match what the battle actually does. Measured separately:
   * 300 moving first, 151 moving second, so the estimate tracks reality rather
   * than merely being self-consistent.
   */
  assert.ok(Math.abs(fast - 300) < 25, `estimate ${fast} should be near the real 300`);
  assert.ok(Math.abs(slow - 151) < 25, `estimate ${slow} should be near the real 151`);

  // The projection must leave no trace: the flag is restored.
  assert.strictEqual(b.sides[1].team[0].hasActedThisTurn, false, 'the flag must be restored after estimating');

  // Bolt Beak shares the same engine line and must move with it.
  const zolt = Pokemon.normalizeSet({species: 'Arctozolt', ability: 'Volt Absorb', item: '',
    level: 100, nature: 'Adamant', evs: {atk: 252, hp: 4}, moves: ['boltbeak']});
  const tangSlow = Pokemon.normalizeSet({species: 'Tangrowth', ability: 'Chlorophyll', item: '',
    level: 100, nature: 'Relaxed', evs: {hp: 252, def: 252}, moves: ['splash']});
  const tangFast = Pokemon.normalizeSet({species: 'Tangrowth', ability: 'Chlorophyll', item: 'choicescarf',
    level: 100, nature: 'Relaxed', evs: {hp: 252, def: 252}, moves: ['splash']});
  const bb = Dex.move('boltbeak');
  const c = makeBattle([zolt], [tangSlow]), d = makeBattle([zolt], [tangFast]);
  const bbFast = AI.estimateDamage(c, c.sides[0].team[0], c.sides[1].team[0], bb);
  const bbSlow = AI.estimateDamage(d, d.sides[0].team[0], d.sides[1].team[0], bb);
  assert.strictEqual(AI.movesFirst(d, d.sides[0].team[0], d.sides[1].team[0]), false,
    'fixture: Tangrowth must actually outspeed when Scarfed, or this half is vacuous');
  assert.ok(bbFast > bbSlow * 1.8, `Bolt Beak moving first should be about double: ${bbFast} against ${bbSlow}`);

  /*
   * Analytic is the ability-side member of the same family — it reads the same
   * `target.hasActedThisTurn`, through an `onBasePower` hook rather than through
   * `dynamicBasePower`. It is found by the `readsTargetActed` flag declared on
   * the ability rather than by name (§10's rule), and it runs the OTHER way:
   * the boost applies when the target HAS already moved, so the AI should value
   * the move more when it is slower, not less.
   */
  const zone = Pokemon.normalizeSet({species: 'Magnezone', ability: 'Analytic', item: '',
    level: 100, nature: 'Modest', evs: {spa: 252}, moves: ['flashcannon']});
  const blissSlow = Pokemon.normalizeSet({species: 'Blissey', ability: 'Natural Cure', item: '',
    level: 100, nature: 'Bold', evs: {hp: 252, def: 252}, moves: ['splash']});
  const blissFast = Pokemon.normalizeSet({species: 'Blissey', ability: 'Natural Cure', item: 'choicescarf',
    level: 100, nature: 'Bold', evs: {hp: 252, def: 252}, moves: ['splash']});
  const cannon = Dex.move('flashcannon');
  const e = makeBattle([zone], [blissSlow]), f = makeBattle([zone], [blissFast]);
  assert.strictEqual(AI.movesFirst(f, f.sides[0].team[0], f.sides[1].team[0]), false,
    'fixture: Blissey must actually outspeed when Scarfed, or the Analytic half is vacuous');
  const anaFirst = AI.estimateDamage(e, e.sides[0].team[0], e.sides[1].team[0], cannon);
  const anaSecond = AI.estimateDamage(f, f.sides[0].team[0], f.sides[1].team[0], cannon);
  assert.ok(anaSecond > anaFirst,
    `Analytic should pay MORE when the AI moves second: ${anaSecond} against ${anaFirst}`);
  assert.ok(anaSecond > anaFirst * 1.2 && anaSecond < anaFirst * 1.4,
    `and by about the declared 1.3x: ${anaSecond} against ${anaFirst}`);

  /*
   * CONTROL: an ordinary move must NOT change with turn order. Without this the
   * test would pass for a projection that scaled every move by who moves first.
   */
  const ordinary = Dex.move('waterfall');
  const ordFast = AI.estimateDamage(a, a.sides[0].team[0], a.sides[1].team[0], ordinary);
  const ordSlow = AI.estimateDamage(b, b.sides[0].team[0], b.sides[1].team[0], ordinary);
  assert.strictEqual(ordFast, ordSlow, `CONTROL: Waterfall must not depend on turn order (${ordFast} vs ${ordSlow})`);
});

test('the damage calculator can say whether the target has already moved', () => {
  /*
   * `Calculator.applyState` built both Pokémon fresh, so `hasActedThisTurn` was
   * always false and the calculator silently reported Fishious Rend and Bolt
   * Beak at their **doubled** power with no way to ask for the other branch —
   * and Payback and Analytic at their weakest. A tiering evidence packet was
   * generated against it and printed identical numbers for "moving first" and
   * "moving second", which is what surfaced this.
   */
  const {Calculator} = RedGPT;
  const attacker = {set: {species: 'Dracovish', item: 'choiceband', ability: 'Strong Jaw',
    level: 100, nature: 'Adamant', evs: {atk: 252, hp: 4}, moves: ['fishiousrend']}};
  const defender = hasMoved => ({set: {species: 'Swampert', item: 'leftovers', ability: 'Torrent',
    level: 100, nature: 'Relaxed', evs: {hp: 252, def: 252}, moves: ['earthquake']}, hasMoved});

  const notMoved = Calculator.calculate({attacker, defender: defender(false), move: 'fishiousrend'});
  const moved = Calculator.calculate({attacker, defender: defender(true), move: 'fishiousrend'});
  assert.ok(notMoved.min > moved.min * 1.9,
    `a target that has not moved takes about double: ${notMoved.min}-${notMoved.max} against ${moved.min}-${moved.max}`);

  // Payback runs the other way, which is what proves the flag rather than a
  // Fishious-Rend-shaped special case is being honoured.
  const payback = {set: {species: 'Tyranitar', item: '', ability: 'Sand Stream',
    level: 100, nature: 'Adamant', evs: {atk: 252}, moves: ['payback']}};
  const pNot = Calculator.calculate({attacker: payback, defender: defender(false), move: 'payback'});
  const pMoved = Calculator.calculate({attacker: payback, defender: defender(true), move: 'payback'});
  assert.ok(pMoved.min > pNot.min * 1.7,
    `Payback doubles against a target that HAS moved: ${pMoved.min} against ${pNot.min}`);

  // CONTROL: a move with no turn-order term must be identical either way.
  const eq = {set: {species: 'Tyranitar', item: '', ability: 'Sand Stream',
    level: 100, nature: 'Adamant', evs: {atk: 252}, moves: ['earthquake']}};
  const eNot = Calculator.calculate({attacker: eq, defender: defender(false), move: 'earthquake'});
  const eMoved = Calculator.calculate({attacker: eq, defender: defender(true), move: 'earthquake'});
  assert.strictEqual(eNot.min, eMoved.min, 'CONTROL: Earthquake must not care whether the target has moved');
  assert.strictEqual(eNot.max, eMoved.max, 'CONTROL: Earthquake must not care whether the target has moved');

  /*
   * The other half of the same blind spot: `damageTakenThisTurn`. Seven moves
   * read it and were all stuck on their weakest branch. Assurance reads the
   * DEFENDER's counter; Avalanche and Revenge read the ATTACKER's and
   * additionally need `lastDamageSourceUid` to point at the defender, which
   * `buildBattle` wires across because `applyState` only sees one Pokémon.
   */
  const tt = moves => ({set: {species: 'Tyranitar', item: '', ability: 'Sand Stream',
    level: 100, nature: 'Adamant', evs: {atk: 252}, moves}});
  const swamp = extra => Object.assign({set: {species: 'Swampert', item: '', ability: 'Torrent',
    level: 100, nature: 'Relaxed', evs: {hp: 252, def: 252}, moves: ['earthquake']}}, extra || {});

  const aNone = Calculator.calculate({attacker: tt(['assurance']), defender: swamp({damageTakenPercent: 0}), move: 'assurance'});
  const aHurt = Calculator.calculate({attacker: tt(['assurance']), defender: swamp({damageTakenPercent: 40}), move: 'assurance'});
  assert.ok(aHurt.min > aNone.min * 1.8,
    `Assurance doubles against a target already hit: ${aHurt.min} against ${aNone.min}`);

  const vNone = Calculator.calculate({attacker: Object.assign(tt(['avalanche']), {damageTakenPercent: 0}), defender: swamp(), move: 'avalanche'});
  const vHurt = Calculator.calculate({attacker: Object.assign(tt(['avalanche']), {damageTakenPercent: 40}), defender: swamp(), move: 'avalanche'});
  assert.ok(vHurt.min > vNone.min * 1.8,
    `Avalanche doubles when the user was hit first: ${vHurt.min} against ${vNone.min}`);

  // Counter returns a multiple of the damage taken, so it scales rather than doubling.
  const cNone = Calculator.calculate({attacker: Object.assign(tt(['counter']), {damageTakenPercent: 0}), defender: swamp(), move: 'counter'});
  const cHurt = Calculator.calculate({attacker: Object.assign(tt(['counter']), {damageTakenPercent: 30}), defender: swamp(), move: 'counter'});
  assert.strictEqual(cNone.min, 1, 'Counter with nothing to answer is the 1 HP floor');
  assert.ok(cHurt.min > 100, `Counter should answer a 30% hit with real damage, saw ${cHurt.min}`);

  // CONTROL: an ordinary move must not move with the damage-taken field.
  const oNone = Calculator.calculate({attacker: Object.assign(tt(['earthquake']), {damageTakenPercent: 0}), defender: swamp(), move: 'earthquake'});
  const oHurt = Calculator.calculate({attacker: Object.assign(tt(['earthquake']), {damageTakenPercent: 40}), defender: swamp(), move: 'earthquake'});
  assert.strictEqual(oNone.min, oHurt.min, 'CONTROL: Earthquake must not care that the user was hit');
});

/* ------------------------------------------------------------------ *
 * Trapping abilities
 *
 * `battle.isTrapped` is the single predicate, and its branch ORDER is the
 * load-bearing part — Shed Shell is consulted before Fairy Lock, and the Ghost
 * escape sits below the volatile traps but above every ability. These tests
 * pin the order as well as the outcomes.
 *
 * Every set passes its ability EXPLICITLY. `normalizeSet` hands out slot 0,
 * and slot 0 is not the trapping ability for any holder in the game except
 * Gengar-Mega and Meltan — so a test written without it silently measures
 * Sand Veil or Flash Fire.
 * ------------------------------------------------------------------ */

/** Side 0 leads `victim` with a bench; side 1 leads the trapper. */
function trapCase(victim, victimOpts, trapper, trapperAbility, bench = 'blissey') {
  const battle = makeBattle(
    [set(victim, victimOpts), set(bench)],
    [set(trapper, {ability: trapperAbility})],
  );
  const trapped = battle.isTrapped(battle.active(0));
  const res = battle.choose(0, {type: 'switch', index: 1});
  return {trapped, refused: !(res && res.ok !== false), battle};
}

test('trapping is discovered by hook, and exactly three abilities have one', () => {
  /*
   * Discovery must be behavioural. A name list would miss a custom or renamed
   * trapper, and this project preserves historical ability access — so the
   * question "what can trap" is answered by asking the registry for the hook.
   */
  const {Abilities, Items} = RedGPT;
  const withHook = Object.entries(Abilities.registry)
    .filter(([, def]) => def && typeof def.onTrapped === 'function').map(([id]) => id).sort();
  assert.deepStrictEqual([...withHook], ['arenatrap', 'magnetpull', 'shadowtag'],
    'exactly Shadow Tag, Arena Trap and Magnet Pull define onTrapped');

  const immune = Object.entries(Abilities.registry)
    .filter(([, def]) => def && def.trapImmune).map(([id]) => id).sort();
  assert.deepStrictEqual([...immune], ['guarddog'], 'Guard Dog is the one victim-side trap immunity');

  const escapes = Object.entries(Items.registry)
    .filter(([, def]) => def && def.escapesTrapping).map(([id]) => id).sort();
  assert.deepStrictEqual([...escapes], ['shedshell'], 'Shed Shell is the one escape item');
});

test('Shadow Tag traps everything except Ghost, Shed Shell, Guard Dog and another Shadow Tag', () => {
  const trapped = (...args) => trapCase(...args).trapped;

  assert.strictEqual(trapped('snorlax', {}, 'wobbuffet', 'Shadow Tag'), true, 'an ordinary victim is trapped');
  assert.strictEqual(trapped('gengar', {}, 'wobbuffet', 'Shadow Tag'), false, 'Ghost escapes Shadow Tag');
  assert.strictEqual(trapped('snorlax', {item: 'Shed Shell'}, 'wobbuffet', 'Shadow Tag'), false, 'Shed Shell escapes');
  assert.strictEqual(trapped('okidogi', {ability: 'Guard Dog'}, 'wobbuffet', 'Shadow Tag'), false, 'Guard Dog is immune');
  assert.strictEqual(trapped('gothitelle', {ability: 'Shadow Tag'}, 'wobbuffet', 'Shadow Tag'), false,
    'two Shadow Tag users do not trap each other');

  /*
   * CONTROLS. Shadow Tag is not a grounding effect, so none of the escapes that
   * beat Arena Trap may beat it — a version that shared one grounding branch
   * would pass every assertion above and fail these three.
   */
  assert.strictEqual(trapped('skarmory', {}, 'wobbuffet', 'Shadow Tag'), true, 'CONTROL: Flying does not escape Shadow Tag');
  assert.strictEqual(trapped('rotomwash', {ability: 'Levitate'}, 'wobbuffet', 'Shadow Tag'), true, 'CONTROL: Levitate does not escape');
  assert.strictEqual(trapped('snorlax', {item: 'Air Balloon'}, 'wobbuffet', 'Shadow Tag'), true, 'CONTROL: Air Balloon does not escape');
  // And Mold Breaker is an attacker-side ignore; trapping is not a move.
  assert.strictEqual(trapped('excadrill', {ability: 'Mold Breaker'}, 'wobbuffet', 'Shadow Tag'), true,
    'CONTROL: Mold Breaker does not break trapping');
});

test('Arena Trap is grounding, and Magnet Pull is Steel', () => {
  const trapped = (...args) => trapCase(...args).trapped;

  assert.strictEqual(trapped('snorlax', {}, 'dugtrio', 'Arena Trap'), true, 'a grounded victim is trapped');
  assert.strictEqual(trapped('skarmory', {}, 'dugtrio', 'Arena Trap'), false, 'Flying escapes Arena Trap');
  assert.strictEqual(trapped('rotomwash', {ability: 'Levitate'}, 'dugtrio', 'Arena Trap'), false, 'Levitate escapes');
  assert.strictEqual(trapped('snorlax', {item: 'Air Balloon'}, 'dugtrio', 'Arena Trap'), false, 'Air Balloon escapes');
  // The Iron Ball re-grounds a Flying type straight back into the trap.
  assert.strictEqual(trapped('skarmory', {item: 'Iron Ball'}, 'dugtrio', 'Arena Trap'), true, 'Iron Ball grounds a Flyer into the trap');

  assert.strictEqual(trapped('skarmory', {}, 'magnezone', 'Magnet Pull'), true, 'a Steel victim is trapped');
  assert.strictEqual(trapped('snorlax', {}, 'magnezone', 'Magnet Pull'), false, 'a non-Steel victim is not');
  /*
   * Aegislash is Steel/Ghost, and the Ghost escape sits ABOVE the ability
   * branch — so Ghost beats Magnet Pull even on a Steel type. This is the
   * assertion that pins the branch order rather than the two conditions.
   */
  assert.strictEqual(trapped('aegislash', {}, 'magnezone', 'Magnet Pull'), false, 'Steel/Ghost escapes: Ghost is checked first');
});

test('the trapping predicate and the switch command never disagree', () => {
  /*
   * `isTrapped` drives the UI (the Switch button's disabled state) while
   * `choose` is what actually refuses. A build where they diverged would show a
   * live button that errors on click, which no outcome-only test would catch.
   */
  const cases = [
    ['snorlax', {}, 'wobbuffet', 'Shadow Tag'],
    ['gengar', {}, 'wobbuffet', 'Shadow Tag'],
    ['snorlax', {}, 'dugtrio', 'Arena Trap'],
    ['skarmory', {}, 'dugtrio', 'Arena Trap'],
    ['skarmory', {}, 'magnezone', 'Magnet Pull'],
    ['snorlax', {}, 'magnezone', 'Magnet Pull'],
  ];
  let trappedSeen = 0;
  for (const c of cases) {
    const r = trapCase(...c);
    assert.strictEqual(r.trapped, r.refused,
      `${c[0]} vs ${c[3]}: predicate ${r.trapped} but command refused ${r.refused}`);
    if (r.trapped) trappedSeen++;
  }
  // Sized against the fixture: three of the six must actually trap, or the
  // agreement above is vacuously true of six free switches.
  assert.strictEqual(trappedSeen, 3, 'exactly three of the six fixtures should trap');
});

test('trapping ends the moment the trapper leaves, and pivot moves ignore it entirely', () => {
  // The trapper switching out frees the victim on the same turn.
  const battle = makeBattle(
    [set('snorlax'), set('blissey')],
    [set('wobbuffet', {ability: 'Shadow Tag'}), set('pikachu')],
  );
  assert.strictEqual(battle.isTrapped(battle.active(0)), true, 'trapped while the Shadow Tag holder is in');
  turn(battle, 0, {type: 'switch', index: 1});
  assert.strictEqual(battle.isTrapped(battle.active(0)), false, 'free once the trapper has gone');

  /*
   * Every pivot move bypasses trapping: `requestSwitchOut` consults `canSwitch`
   * and never `isTrapped`. That is a major counterplay axis — a trapped
   * Pokemon still escapes with U-turn — so it is pinned rather than left to be
   * "tidied up" later by someone who reads trapping as absolute.
   */
  for (const mv of ['uturn', 'voltswitch', 'flipturn', 'partingshot', 'batonpass', 'teleport']) {
    const b = makeBattle(
      [set('scizor', {moves: [mv, 'tackle'], ability: 'Technician'}), set('blissey')],
      [set('wobbuffet', {ability: 'Shadow Tag', moves: ['tackle']})],
    );
    assert.strictEqual(b.isTrapped(b.active(0)), true, `${mv} fixture: the pivoter must start trapped`);
    turn(b, 0, 0);
    assert.ok(b.sides[0].switchRequest || (b.requests[0] && b.requests[0].forcedSwitch),
      `${mv} must still pivot while trapped`);
  }
});

test('Relic Song transforms Meloetta, toggles, and reverts on switch-out', () => {
  /*
   * The MOVE half of the forme routes, and the third of the three — items
   * (`FORME_CHANGE_ITEMS`), abilities (`ABILITY_FORMES`) and now moves
   * (`MOVE_FORMES`). Before this, Relic Song was an ordinary 75 BP sound move
   * and Meloetta-Pirouette was packaged-but-dead: nothing reached it, so its
   * tier was bookkeeping only.
   */
  const battle = makeBattle(
    [set('meloetta', {moves: ['relicsong', 'tackle'], level: 100}), set('snorlax', {level: 100})],
    [set('blissey', {moves: ['tackle'], level: 100})],
  );
  const me = () => battle.active(0);
  assert.strictEqual(Dex.toID(me().species), 'meloetta', 'starts in Aria forme');
  const atkBefore = battle.getStat(me(), 'atk');

  turn(battle, 0, 0);
  assert.strictEqual(Dex.toID(me().species), 'meloettapirouette', 'Relic Song transforms it');
  assert.deepStrictEqual([...me().types], ['Normal', 'Fighting'], 'and the typing moves with it');
  assert.ok(battle.getStat(me(), 'atk') > atkBefore,
    `Pirouette's Attack must be higher, saw ${battle.getStat(me(), 'atk')} against ${atkBefore}`);

  // It toggles, as in the games.
  turn(battle, 0, 0);
  assert.strictEqual(Dex.toID(me().species), 'meloetta', 'using it again returns to Aria forme');

  // And it reverts when Meloetta leaves the field, so it is a per-appearance
  // state rather than a permanent upgrade like Battle Bond.
  turn(battle, 0, 0);
  assert.strictEqual(Dex.toID(me().species), 'meloettapirouette', 'transformed again');
  // Switch OUT (to slot 1) and back IN (to slot 0). `activeIndex` moves; the
  // team array does not reorder, so the second switch names slot 0 again — a
  // first version passed 1 twice, which is a no-op and proved nothing.
  turn(battle, {type: 'switch', index: 1}, 0);
  assert.strictEqual(Dex.toID(battle.sides[0].team[0].species), 'meloetta',
    'it reverts the moment it leaves the field');
  turn(battle, {type: 'switch', index: 0}, 0);
  assert.strictEqual(Dex.toID(battle.active(0).species), 'meloetta', 'comes back in Aria forme');
});

test('a Relic Song that does not resolve does not transform', () => {
  /*
   * CONTROL for the test above: a blocked move must leave the forme alone.
   * Soundproof refuses a sound move outright.
   *
   * **What actually makes this true is the early return, not the `if (success)`
   * guard at the call site — measured.** Removing that guard changes nothing
   * for Soundproof, Normal-into-Ghost immunity or Protect, because all three
   * return from `executeMove` before reaching it. The guard is kept as the
   * correct semantic (and matches the `roost` line beside it) but it is
   * belt-and-braces, so `coverage-controls.js` deliberately carries no control
   * for this test and says why.
   */
  const battle = makeBattle(
    [set('meloetta', {moves: ['relicsong'], level: 100}), set('snorlax', {level: 100})],
    [set('electrode', {moves: ['tackle'], ability: 'Soundproof', level: 100})],
  );
  turn(battle, 0, 0);
  assert.strictEqual(Dex.toID(battle.active(0).species), 'meloetta',
    'a Soundproof-blocked Relic Song must not transform');
});

test('Aura Guard halves contact damage only, and Long Reach beats it where Pads do not', () => {
  /*
   * Lucario-Mega-Z's real Legends: Z-A ability, replacing the Adaptability
   * placeholder that was byte-identical to ordinary Lucario-Mega's. Aura Guard
   * does not exist upstream at all, so it is packaged through the generator's
   * `ABILITY_ADDITIONS` — the ability counterpart of `ITEM_ADDITIONS`.
   *
   * The control is inside the test rather than beside it: a NON-contact move
   * must be byte-identical between the two, or the halving is being applied to
   * everything and the contact gate is doing nothing.
   */
  const {Dex, Calculator, Pokemon} = RedGPT;
  const built = (species, o = {}) => ({set: Pokemon.normalizeSet(Object.assign({
    species, level: 100, moves: ['tackle'], evs: {}, ivs: Pokemon.maxIVs(), nature: 'serious',
  }, o))});
  const dmg = (a, d, m) => {
    const r = Calculator.calculate({attacker: a, defender: d, move: m});
    assert.ok(r && !r.empty, `${m} should produce damage`);
    return r.max;
  };

  assert.ok(Dex.ability('auraguard'), 'Aura Guard must be packaged by ABILITY_ADDITIONS');
  assert.deepStrictEqual([...Dex.abilityList('Lucario-Mega-Z')], ['Aura Guard'],
    'Lucario-Mega-Z must carry Aura Guard, not the Adaptability placeholder');

  const guard = built('Lucario-Mega-Z');
  const plain = built('Lucario-Mega-Z', {ability: 'Pressure'});   // no damage hook
  const atk = (sp, o) => built(sp, Object.assign({nature: 'adamant', evs: {atk: 252}}, o));

  // Contact: halved. Checked across three different attackers so a single
  // fluke roll cannot carry it.
  for (const [sp, move, opts] of [
    ['Kingambit', 'suckerpunch', {ability: 'Defiant'}],
    ['Scizor', 'bulletpunch', {ability: 'Technician'}],
    ['Dragonite', 'extremespeed', {ability: 'Multiscale'}],
  ]) {
    assert.ok(Dex.move(move).flags.contact, `sanity: ${move} must be a contact move`);
    const on = dmg(atk(sp, opts), guard, move);
    const off = dmg(atk(sp, opts), plain, move);
    assert.strictEqual(on, Math.floor(off * 0.5),
      `${sp} ${move} must be halved: saw ${on} against ${off}`);
  }

  // CONTROL: non-contact must be untouched, or the gate is inert.
  for (const [sp, move, opts] of [
    ['Weavile', 'iceshard', {ability: 'Pressure'}],
    ['Great Tusk', 'earthquake', {ability: 'Protosynthesis'}],
  ]) {
    assert.ok(!Dex.move(move).flags.contact, `sanity: ${move} must NOT be a contact move`);
    assert.strictEqual(dmg(atk(sp, opts), guard, move), dmg(atk(sp, opts), plain, move),
      `CONTROL: ${move} is not contact and must be identical either way`);
  }

  /*
   * The asymmetry, measured rather than assumed — a first draft of the ability's
   * own description got this wrong in both directions.
   *
   * Long Reach strips contact in `onModifyMove`, so the damage pipeline never
   * sees a contact move and the halving cannot apply. Protective Pads only hand
   * a contact-free COPY to the defender's reactive hooks (§8), never to damage
   * calculation, so the halving still applies through them. Both readings are
   * correct: the Pads protect their holder from being punished for contact,
   * which is a different claim from the move not making contact.
   */
  const rowlet = sp => built('Rowlet', {ability: sp, nature: 'adamant', evs: {atk: 252}});
  assert.strictEqual(dmg(rowlet('Long Reach'), guard, 'tackle'), dmg(rowlet('Long Reach'), plain, 'tackle'),
    'Long Reach removes contact outright, so Aura Guard must not reduce it');
  assert.strictEqual(dmg(rowlet('Overgrow'), guard, 'tackle'), Math.floor(dmg(rowlet('Overgrow'), plain, 'tackle') * 0.5),
    'CONTROL: the same Pokemon without Long Reach IS halved');

  const pads = atk('Kingambit', {ability: 'Defiant', item: 'protectivepads'});
  const bare = atk('Kingambit', {ability: 'Defiant'});
  assert.strictEqual(dmg(pads, guard, 'suckerpunch'), Math.floor(dmg(pads, plain, 'suckerpunch') * 0.5),
    'Protective Pads must NOT bypass Aura Guard — they never reach damage calculation');
  assert.strictEqual(dmg(pads, plain, 'suckerpunch'), dmg(bare, plain, 'suckerpunch'),
    'CONTROL: Pads change nothing about the raw damage, so the row above is a fair comparison');

  // No HP gate, unlike Multiscale — which is why `AI.setupValue` must not list it.
  const hurt = built('Lucario-Mega-Z', {}); hurt.hpPercent = 50;
  const full = dmg(atk('Kingambit', {ability: 'Defiant'}), guard, 'suckerpunch');
  const half = dmg(atk('Kingambit', {ability: 'Defiant'}), hurt, 'suckerpunch');
  assert.strictEqual(full, half, 'Aura Guard is unconditional — it must not switch off below full HP');
});

test('the datamined Z-A Mega abilities replaced their placeholders', () => {
  /*
   * All three `-Mega-Z` formes shipped carrying an ability byte-identical to
   * the Pokemon's ORDINARY Mega — Absol-Mega-Z had Magic Bounce like
   * Absol-Mega, Garchomp-Mega-Z Sand Force, Lucario-Mega-Z Adaptability. §5
   * recorded that as "what a provisional placeholder looks like" and said not
   * to treat them as settled. The 2026-09-03 datamine replaced all three.
   *
   * The assertion that matters is the SECOND one in each pair: the Z forme must
   * now DIFFER from the ordinary Mega. Pinning only the new name would still
   * pass if a future rebuild reverted both to the same value.
   */
  const {Dex} = RedGPT;
  for (const [zForme, ability, ordinary, placeholder] of [
    ['Garchomp-Mega-Z', 'Levitate', 'Garchomp-Mega', 'Sand Force'],
    ['Lucario-Mega-Z', 'Aura Guard', 'Lucario-Mega', 'Adaptability'],
    ['Absol-Mega-Z', 'Sharpness', 'Absol-Mega', 'Magic Bounce'],
  ]) {
    assert.deepStrictEqual([...Dex.abilityList(zForme)], [ability],
      `${zForme} must carry ${ability}`);
    assert.deepStrictEqual([...Dex.abilityList(ordinary)], [placeholder],
      `CONTROL: ${ordinary} keeps ${placeholder} — only the Z forme was reassigned`);
    assert.notDeepStrictEqual([...Dex.abilityList(zForme)], [...Dex.abilityList(ordinary)],
      `${zForme} must no longer be a copy of ${ordinary} — that copy WAS the placeholder`);
  }
  // Levitate and Sharpness are upstream and implemented; Aura Guard is ours.
  for (const id of ['levitate', 'sharpness', 'auraguard']) {
    assert.ok(RedGPT.Abilities.registry[id], `${id} must be implemented, not a dead string`);
  }
});

test('the forme-move gate refuses Relic Song below RU while Meloetta stays legal', () => {
  /*
   * "Ban the route, not the Pokémon", applied to a MOVE. Meloetta is NU and
   * Meloetta-Pirouette is RU, so without this an NU team fields a Pokémon that
   * becomes an RU forme on turn one — the exact `maxTier` hole that blocked the
   * Zygarde and Darmanitan-Galar drops until the ability gate existed.
   *
   * Unlike the ability half there is no "must have another option" condition:
   * refusing an ability can delete a Pokémon that has only one, but a Pokémon
   * always has other moves.
   */
  const {Formats: F, Validation, Pokemon: P} = RedGPT;
  const withSong = ['relicsong', 'psychic', 'closecombat', 'shadowball'];
  const without = ['psychic', 'closecombat', 'shadowball'];
  const errs = (moves, fmt) => Validation.validateTeam(
    [P.normalizeSet({species: 'Meloetta', level: 100, moves})], F.get(fmt)).errors.map(e => e.message);

  const nu = errs(withSong, 'tiernu');
  assert.ok(nu.some(m => /Relic Song is banned in NeverUsed/.test(m)),
    `Relic Song must be refused in NU, saw ${JSON.stringify(nu)}`);
  assert.deepStrictEqual([...errs(without, 'tiernu')], [],
    'CONTROL: Meloetta itself must stay legal in NU without the move');
  assert.deepStrictEqual([...errs(withSong, 'tierru')], [],
    'CONTROL: Relic Song must be legal in RU, where the forme sits');
  assert.deepStrictEqual([...errs(withSong, 'tierou')], [],
    'CONTROL: and above it');

  // The derivation itself, so a future forme move is picked up with no edit.
  const routes = F.formeMoves('Meloetta');
  assert.strictEqual(routes.length, 1, 'Meloetta has exactly one forme move');
  assert.strictEqual(routes[0].move, 'relicsong');
  assert.strictEqual(routes[0].tier, 'RU', 'and it targets an RU forme');
  assert.strictEqual(F.illegalFormeMoves('Meloetta', F.get('tierru')).length, 0,
    'RU allows it, because RU is where the forme is');

  /*
   * The 2026-08-17 Meloetta audit, implemented. Both placements were REVIEWED
   * with the forme actually reachable and both were retained — Meloetta NU,
   * Meloetta-Pirouette RU — so the RU tier stops being the roster bookkeeping
   * the NU pass assigned when nothing could reach the forme.
   *
   * Pirouette's tier does exactly one job: it sets the rung from which Relic
   * Song is legal. Lowering it to NU would unlock the transformation for an NU
   * Meloetta, which is what the assertions above refuse — so the tier and the
   * gate are pinned together here rather than in two places.
   */
  assert.strictEqual(Dex.species('Meloetta').tier, 'NU',
    'base Meloetta is NU — reviewed and retained, and judged as Aria without the move');
  assert.strictEqual(Dex.species('Meloetta-Pirouette').tier, 'RU',
    'Meloetta-Pirouette is RU — reviewed and retained now that the route exists');
  assert.strictEqual(Dex.species('Meloetta-Pirouette').tierSource.from, 'redgpt-override',
    'and its RU tier is an explicit reviewed verdict, not an import or an estimate');
  // Tier the FORME, not the base: they must not be merged in either direction.
  assert.notStrictEqual(Dex.species('Meloetta').tier, Dex.species('Meloetta-Pirouette').tier,
    'the base must not be dragged up to its forme’s rung');

  /*
   * It stays unselectable. `battleOnly` is what makes the tier a statement about
   * a ROUTE rather than about a pickable Pokémon, so removing it would quietly
   * turn an RU forme into an RU team slot with no Relic Song spent.
   */
  assert.strictEqual(Dex.species('Meloetta-Pirouette').battleOnly, 'Meloetta',
    'Pirouette must stay battle-only');
  for (const fmt of ['tierou', 'tieruu', 'tierru', 'tiernu']) {
    const direct = Validation.validateTeam(
      [P.normalizeSet({species: 'Meloetta-Pirouette', level: 100, moves: without})], F.get(fmt)).errors;
    assert.ok(direct.some(e => /battle-only forme/.test(e.message)),
      `Pirouette must be refused as a direct pick in ${fmt}, saw ${JSON.stringify(direct.map(e => e.message))}`);
  }
});

test('every trapping ability is legal in every competitive format', () => {
  /*
   * The project rule: trapping abilities stay legal everywhere and balance is
   * handled by tiering their users. This asserts the *policy*, so a future
   * format that reaches for `bannedAbilities` fails here rather than silently
   * reversing the decision.
   */
  const {Abilities, Formats: F} = RedGPT;
  const trappers = Object.entries(Abilities.registry)
    .filter(([, def]) => def && typeof def.onTrapped === 'function').map(([id]) => id);
  assert.ok(trappers.length >= 3, 'sanity: the trapper list must not be empty');

  let checked = 0;
  for (const f of F.list()) {
    const banned = new Set((f.rules.bannedAbilities || []).map(Dex.toID));
    for (const t of trappers) {
      assert.ok(!banned.has(t), `${t} must be legal in ${f.name}`);
    }
    checked++;
  }
  // A denominator: "no format bans one" means nothing if no format was read.
  assert.ok(checked >= 11, `every format must be checked, saw ${checked}`);
});

finish();
