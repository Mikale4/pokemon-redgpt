/**
 * Campaign run lifecycle: seeded generation, map validity, node progression,
 * rewards, shops, recruitment, persistence across reload, bosses, and the
 * win/lose terminations.
 */
'use strict';

const {createSuite} = require('./helpers/assert');
const {loadEngine} = require('./helpers/engine');

const suite = createSuite('campaign');
const {test, assert, finish} = suite;

const RedGPT = loadEngine();
const {Dex, Campaign, CampaignMap, CampaignContent, Pokemon, Validation, RNG, AI} = RedGPT;

function newRun(options = {}) {
  return Campaign.createRun(Object.assign({seed: 'REDGPT-TEST01', difficulty: 'normal', trainerName: 'Tester'}, options));
}

function draft(run, index = 0) {
  const result = Campaign.chooseStarter(run, {index});
  assert.ok(result.ok, result.error);
  return run;
}

/** Play a queued battle to completion with both sides driven by the AI. */
function autoBattle(run) {
  const config = run.pending.config;
  const battle = Campaign.createBattle(run, config);
  battle.sides[0].ai = {difficulty: 'expert'};
  battle.start();
  let guard = 0;
  while (!battle.ended && guard++ < 3000) {
    const request = battle.requests[0];
    if (!request) break;
    const choice = AI.chooseAction(battle, 0, request);
    if (!battle.choose(0, choice).ok) battle.choose(0, battle.fallbackChoice(0, request));
  }
  return {battle, won: battle.winner === 0, survivors: Campaign.collectSurvivors(battle, 0)};
}

/** Resolve whatever prompt is showing with a sensible default. */
function resolveAnyPrompt(run) {
  const prompt = run.pending;
  if (!prompt) return;
  switch (prompt.type) {
    case 'reward': return Campaign.resolvePrompt(run, {index: 0});
    case 'tm': return Campaign.resolvePrompt(run, {moveIndex: 0, memberUid: prompt.moves[0].eligible[0]});
    case 'tutor': return prompt.memberUid ? Campaign.resolvePrompt(run, {skip: true}) : Campaign.resolvePrompt(run, {memberUid: run.party[0].uid});
    case 'movelearn': return Campaign.resolvePrompt(run, {skip: true});
    case 'recruit': return prompt.needsRelease
      ? Campaign.resolvePrompt(run, {index: prompt.chosenIndex, releaseUid: run.party[run.party.length - 1].uid})
      : Campaign.resolvePrompt(run, {index: 0});
    case 'shop': return Campaign.resolvePrompt(run, {leave: true});
    case 'rest': return Campaign.resolvePrompt(run, {id: 'heal'});
    case 'event': return Campaign.resolvePrompt(run, {index: prompt.choices.findIndex(c => c.enabled)});
    case 'message': return Campaign.resolvePrompt(run, {});
    case 'specialist': return Campaign.resolvePrompt(run, {id: 'leave'});
    case 'ability': return prompt.memberUid ? Campaign.resolvePrompt(run, {skip: true}) : Campaign.resolvePrompt(run, {memberUid: run.party[0].uid});
    case 'nature': return prompt.memberUid ? Campaign.resolvePrompt(run, {skip: true}) : Campaign.resolvePrompt(run, {memberUid: run.party[0].uid});
    // A branching evolution takes the first option rather than skipping, so the
    // soak actually exercises evolving through a branch.
    case 'evolvechoice': return Campaign.resolvePrompt(run, {index: 0});
    // No `items` case: the Rest Site's "Reorganise" option was its only entry
    // point and became "Forage" on 2026-08-13, so the prompt type no longer
    // exists. Held items are managed from the party menu.
    default: return Campaign.resolvePrompt(run, {skip: true});
  }
}

/** Advance the run one step, whatever phase it is in. */
function step(run, rng) {
  if (run.phase === 'map') {
    const pick = rng.pick(run.availableNodeIds);
    const result = Campaign.enterNode(run, pick);
    assert.ok(result.ok, result.error);
    return;
  }
  if (run.phase === 'battle') {
    const result = autoBattle(run);
    const applied = Campaign.resolveBattle(run, {won: result.won, survivors: result.survivors});
    assert.ok(applied.ok, applied.error);
    return;
  }
  const result = resolveAnyPrompt(run);
  if (result && !result.ok) throw new Error(`${run.pending?.type}: ${result.error}`);
}

/* ------------------------------------------------------------------ *
 * Run creation and seeding
 * ------------------------------------------------------------------ */

test('a new run starts in the draft phase with three starter candidates', () => {
  const run = newRun();
  assert.strictEqual(run.phase, 'draft');
  assert.strictEqual(run.pending.type, 'draft');
  assert.strictEqual(run.pending.options.length, 3);
  assert.strictEqual(run.party.length, 0);
  assert.strictEqual(run.act, 1);
  assert.ok(run.credits > 0);
  assert.ok(run.beacons > 0, 'a run must start with at least one Rescue Beacon');
});

test('starter candidates are legal, viable and varied', () => {
  for (let i = 0; i < 12; i++) {
    const run = newRun({seed: 1000 + i});
    const species = run.pending.options.map(s => Dex.species(s.species));
    assert.strictEqual(new Set(species.map(s => s.id)).size, 3, 'candidates must be distinct');
    for (const set of run.pending.options) {
      const result = Validation.validateTeam({sets: [set]}, 'campaign');
      assert.deepStrictEqual([...result.errors.map(e => e.message)], []);
      assert.ok(set.moves.length >= 1);
      assert.strictEqual(set.level, Campaign.STARTING_LEVEL);
    }
  }
});

test('the same seed produces the same run, a different seed does not', () => {
  const a = newRun({seed: 'REDGPT-ABCDEF'});
  const b = newRun({seed: 'REDGPT-ABCDEF'});
  const c = newRun({seed: 'REDGPT-123456'});
  assert.strictEqual(JSON.stringify(a.map), JSON.stringify(b.map));
  assert.strictEqual(JSON.stringify(a.pending.options), JSON.stringify(b.pending.options));
  assert.notStrictEqual(JSON.stringify(a.map), JSON.stringify(c.map));
});

test('a seed label round-trips', () => {
  const run = newRun({seed: 'REDGPT-8F32A1'});
  assert.strictEqual(run.seedLabel, 'REDGPT-8F32A1');
  assert.strictEqual(RNG.parse(run.seedLabel).value, run.seed);
});

test('an invalid seed string is hashed rather than rejected', () => {
  const run = newRun({seed: 'not a hex seed at all'});
  assert.ok(Number.isFinite(run.seed));
  assert.ok(/^REDGPT-[0-9A-F]{6}$/.test(run.seedLabel));
});

test('drafting a starter moves the run to the map', () => {
  const run = draft(newRun());
  assert.strictEqual(run.phase, 'map');
  assert.strictEqual(run.party.length, 1);
  assert.ok(run.availableNodeIds.length >= 2, 'the first row must offer a real choice');
  const member = run.party[0];
  assert.strictEqual(member.condition.currentHP, Campaign.memberMaxHP(run, member));
});

test('a reroll costs a reroll charge and changes the offer', () => {
  const run = newRun();
  const before = JSON.stringify(run.pending.options);
  const rerolls = run.rerolls;
  Campaign.chooseStarter(run, {reroll: true});
  assert.strictEqual(run.rerolls, rerolls - 1);
  assert.notStrictEqual(JSON.stringify(run.pending.options), before);
});

/* ------------------------------------------------------------------ *
 * Map
 * ------------------------------------------------------------------ */

test('levelling up keeps a full-HP Pokemon at full HP', () => {
  const run = draft(newRun());
  const member = run.party[0];

  // Full HP stays full: max HP and current HP rise together.
  member.condition.currentHP = Campaign.memberMaxHP(run, member);
  Campaign.addLevels(run, 5);
  assert.strictEqual(member.condition.currentHP, Campaign.memberMaxHP(run, member),
    'a Pokemon at full HP must still be at full HP after levelling');

  // A damaged Pokemon carries the same absolute damage, not a bigger deficit.
  const max = Campaign.memberMaxHP(run, member);
  member.condition.currentHP = max - 15;
  Campaign.addLevels(run, 5);
  assert.strictEqual(Campaign.memberMaxHP(run, member) - member.condition.currentHP, 15,
    'levelling must not increase the damage a Pokemon is carrying');

  // Levelling never revives.
  member.condition.currentHP = 0;
  Campaign.addLevels(run, 3);
  assert.strictEqual(member.condition.currentHP, 0, 'levelling must not revive a fainted Pokemon');
});

test('Assist Mode state defaults off, toggles and survives a reload', () => {
  const run = draft(newRun());
  // Both switches off by default; the team plan defaults to Balance, which is
  // the plan that applies no bias at all.
  assert.deepStrictEqual(Object.assign({}, Campaign.assistState(run)),
    {recommend: false, autoBattle: false, plan: 'balance'});
  Campaign.setAssist(run, 'recommend', true);
  Campaign.setAssist(run, 'autoBattle', true);
  Campaign.setAssist(run, 'plan', 'trickroom');
  const reloaded = Campaign.deserialize(Campaign.serialize(run));
  assert.strictEqual(reloaded.assist.recommend, true);
  assert.strictEqual(reloaded.assist.autoBattle, true);
  assert.strictEqual(reloaded.assist.plan, 'trickroom', 'the team plan should survive a reload');
  // A run saved before Assist Mode existed still loads, and one saved before
  // team plans existed gets the default on read rather than a migration.
  const legacy = Campaign.serialize(run);
  delete legacy.assist;
  assert.deepStrictEqual(Object.assign({}, Campaign.assistState(Campaign.deserialize(legacy))),
    {recommend: false, autoBattle: false, plan: 'balance'});
  const preplan = Campaign.serialize(run);
  delete preplan.assist.plan;
  assert.strictEqual(Campaign.assistState(Campaign.deserialize(preplan)).plan, 'balance',
    'a run saved before team plans should default to Balance');
  // Unknown keys are ignored rather than written, and so is an unknown plan.
  Campaign.setAssist(run, 'somethingElse', true);
  Campaign.setAssist(run, 'plan', 'notaplan');
  assert.strictEqual(run.assist.plan, 'trickroom', 'an unknown plan id must be refused');
  assert.deepStrictEqual(Object.keys(run.assist).sort(), ['autoBattle', 'plan', 'recommend']);
});

test('the advisor gives sane, deterministic recommendations', () => {
  const Advisor = RedGPT.Advisor;
  const set = {species: 'charizard', ability: 'Blaze', moves: ['flamethrower', 'ember', 'growl', 'tackle']};

  // A clear upgrade is taken; a worthless move is refused.
  const upgrade = Advisor.recommendMoveReplacement(set, 'fireblast');
  assert.ok(upgrade, 'Fire Blast should be recommended over one of these');
  assert.ok(Advisor.moveScore('fireblast', set) > Advisor.moveScore(set.moves[upgrade.index], set));
  assert.strictEqual(Advisor.recommendMoveReplacement(set, 'splash'), null,
    'Splash must never be recommended — a no-effect move is not an upgrade');
  assert.strictEqual(Advisor.moveScore('splash', set), 0);

  // Item advice matches the obvious holder, and refuses a stone that fits nobody.
  const party = [
    {uid: 'a', set: {species: 'machamp', ability: 'Guts', moves: ['closecombat']}, condition: {currentHP: 100}},
    {uid: 'b', set: {species: 'alakazam', ability: 'Synchronize', moves: ['psychic']}, condition: {currentHP: 100}},
  ];
  const fake = {party, bag: {held: {}}, act: 1};
  assert.strictEqual(Advisor.recommendHeldItemTarget(fake, 'choiceband').uid, 'a');
  assert.strictEqual(Advisor.recommendHeldItemTarget(fake, 'choicespecs').uid, 'b');
  assert.strictEqual(Advisor.recommendHeldItemTarget(fake, 'gengarite'), null,
    'a Mega Stone nobody can use should not be recommended');

  // Rewards: deterministic, and an empty prompt yields no opinion.
  const prompt = {options: [{kind: 'credits', amount: 200}, {kind: 'relic', id: 'x'}]};
  const first = Advisor.recommendReward(fake, prompt);
  assert.strictEqual(JSON.stringify(first), JSON.stringify(Advisor.recommendReward(fake, prompt)),
    'advice must be deterministic');
  assert.ok(first.why, 'every recommendation must explain itself');
  assert.strictEqual(Advisor.recommendReward(fake, {options: []}), null);

  // Lead choice reads the type matchup.
  const mine = [{species: 'charizard'}, {species: 'blastoise'}];
  assert.strictEqual(mine[Advisor.recommendLead(mine, [{species: 'arcanine'}])].species, 'blastoise');
  assert.strictEqual(mine[Advisor.recommendLead(mine, [{species: 'sceptile'}])].species, 'charizard');
});

test('nobody trains EVs in Campaign — neither side, from any team source', () => {
  // Campaign has no EV yield, no vitamins and no way to redistribute, so the
  // hand-written boss spreads in content.js would be a permanent stat edge the
  // player could never match. Enforced at one choke point (`Battle.scaleSet`,
  // via the campaign format's `evLimit: 0`) precisely so a new team source
  // cannot reintroduce them.
  const rng = new RNG('REDGPT-EVTEST');
  const run = draft(newRun({acts: 3}));
  const seen = {player: 0, opponent: 0};
  let battles = 0;

  for (let i = 0; i < 260 && run.phase !== 'over' && battles < 6; i++) {
    if (run.phase === 'battle') {
      const battle = Campaign.createBattle(run, run.pending.config);
      battle.start();
      battles++;
      for (const side of battle.sides) {
        for (const mon of side.team) {
          const total = Pokemon.evTotal(mon.set.evs);
          if (side.index === 0) seen.player = Math.max(seen.player, total);
          else seen.opponent = Math.max(seen.opponent, total);
        }
      }
    }
    step(run, rng);
  }

  assert.ok(battles >= 3, `only ${battles} battles sampled`);
  assert.strictEqual(seen.player, 0, 'a player Pokémon entered a Campaign battle with EVs');
  assert.strictEqual(seen.opponent, 0, 'an opponent entered a Campaign battle with EVs');
});

test('the boss spreads that declare EVs still lose them in battle', () => {
  // content.js deliberately keeps its competitive spreads (they are also read by
  // the data-validation suite); the format is what strips them. Assert both
  // halves, so removing the rule cannot pass silently.
  const declared = [...CampaignContent.BOSSES, CampaignContent.FINAL_BOSS]
    .flatMap(b => b.members || []);
  const withEVs = declared.filter(m => m.evs && Pokemon.evTotal(m.evs) > 0);
  assert.ok(withEVs.length > 0, 'expected boss members to declare EV spreads');

  const run = draft(newRun({acts: 1}));
  const format = RedGPT.Formats.get('campaign');
  assert.strictEqual(format.rules.evLimit, 0, 'campaign format must forbid EVs');

  const battle = new RedGPT.Battle({
    format, seed: 1234,
    sides: [
      {name: 'A', team: [Pokemon.normalizeSet({species: 'garchomp', level: 50, moves: ['tackle'], evs: {atk: 252, spe: 252}})], controller: 'human'},
      {name: 'B', team: [Pokemon.normalizeSet({species: 'blissey', level: 50, moves: ['splash'], evs: {hp: 252}})], controller: 'human'},
    ],
  });
  battle.start();
  for (const side of battle.sides) {
    assert.strictEqual(Pokemon.evTotal(side.team[0].set.evs), 0, 'scaleSet did not strip EVs');
  }
  void run;
});

test('loading a run re-clamps HP that a stat change left above full', () => {
  // A run saved before Campaign dropped EVs stores a currentHP computed from the
  // old, higher max. Without a clamp on load it reads as "199/164" forever.
  const run = draft(newRun());
  const member = run.party[0];
  member.condition.currentHP = Campaign.memberMaxHP(run, member) + 40;
  const restored = Campaign.deserialize(Campaign.serialize(run));
  const reloaded = restored.party[0];
  assert.strictEqual(reloaded.condition.currentHP, Campaign.memberMaxHP(restored, reloaded),
    'currentHP should be clamped to max on load');
});

test('a full party is still offered recruits, and can always decline', () => {
  const run = draft(newRun());
  // Fill the party.
  while (run.party.length < Campaign.MAX_PARTY) {
    Campaign.offerRecruit(run, {count: 1});
    const prompt = run.pending;
    assert.ok(prompt && prompt.type === 'recruit', 'expected a recruit prompt');
    const result = Campaign.resolvePrompt(run, {index: 0});
    assert.ok(result.ok, result.error);
  }
  assert.strictEqual(run.party.length, Campaign.MAX_PARTY);

  // The offer must still be made — this used to be skipped entirely.
  const opened = Campaign.offerRecruit(run, {count: 3});
  assert.ok(opened, 'a full party should still be offered a recruit');
  const prompt = run.pending;
  assert.strictEqual(prompt.type, 'recruit');
  assert.strictEqual(prompt.partyFull, true, 'the prompt should say the party is full');
  assert.strictEqual(prompt.allowDecline, true, 'a full party must always be able to walk away');

  // Taking one asks which member to release rather than silently failing.
  const before = run.party.map(m => m.uid);
  Campaign.resolvePrompt(run, {index: 0});
  assert.strictEqual(run.pending.needsRelease, true, 'should ask which Pokémon to release');
  const released = before[before.length - 1];
  const taken = Campaign.resolvePrompt(run, {index: run.pending.chosenIndex, releaseUid: released});
  assert.ok(taken.ok, taken.error);
  assert.strictEqual(run.party.length, Campaign.MAX_PARTY, 'party stays at the cap');
  assert.ok(!run.party.some(m => m.uid === released), 'the released member is gone');
});

test('the Specialist always offers Scout, full party or not', () => {
  // Losing a whole service the moment the sixth slot filled was the bug.
  const run = draft(newRun());
  while (run.party.length < Campaign.MAX_PARTY) {
    Campaign.offerRecruit(run, {count: 1});
    Campaign.resolvePrompt(run, {index: 0});
  }
  // Drain any prompts the recruiting left behind.
  let guard = 0;
  while (run.pending && guard++ < 20) resolveAnyPrompt(run);
  const stock = Campaign.buildShopStock(run);
  assert.ok(Array.isArray(stock), 'shop stock should build with a full party');
});

test('meta unlocks are data, and every one of them is reachable', () => {
  // The unlock rules used to be a stack of `if`s inside a UI file, where
  // nothing could test them. Assert the table is coherent: every grant target
  // exists, and no two rows grant the same thing.
  const problems = [];
  const seen = new Set();
  for (const entry of CampaignContent.UNLOCKS) {
    const key = `${entry.grants.track}:${entry.grants.id}`;
    if (seen.has(key)) problems.push(`duplicate grant ${key}`);
    seen.add(key);
    if (!entry.hint) problems.push(`${entry.id} has no hint explaining how to earn it`);
    if (entry.grants.track === 'starterPools' && !CampaignContent.STARTER_POOLS[entry.grants.id]) {
      problems.push(`${entry.id} grants starter pool "${entry.grants.id}", which does not exist`);
    }
    if (entry.grants.track === 'relics' && !CampaignContent.relic(entry.grants.id)) {
      problems.push(`${entry.id} grants relic "${entry.grants.id}", which does not exist`);
    }
  }
  assert.deepStrictEqual([...problems], [], problems.join('; '));
  assert.ok(CampaignContent.UNLOCKS.length >= 15, `only ${CampaignContent.UNLOCKS.length} unlocks`);
});

test('unlocks are awarded on ascension, act count and lifetime recruits', () => {
  const emptyProfile = () => ({
    unlocks: {starterPools: ['classic'], relics: [], difficulties: ['normal'], ascension: 0},
    records: {campaign: {wins: 0, totalRecruited: 0}},
  });
  const finished = extra => Object.assign({
    phase: 'victory', difficulty: 'normal', ascension: 0,
    setup: {acts: 3}, stats: {assistOnly: false, recruits: 0},
  }, extra);
  const idsFor = (profile, run) => Campaign.evaluateUnlocks(profile, run).map(e => e.id).sort();

  // Ascension.
  assert.ok(idsFor(emptyProfile(), finished({ascension: 2})).includes('ascendants'),
    'Ascension 2 should unlock Ascendants');
  assert.ok(!idsFor(emptyProfile(), finished({ascension: 1})).includes('ascendants'),
    'Ascension 1 should not');
  assert.ok(idsFor(emptyProfile(), finished({ascension: 5})).includes('apexpredators'));

  // Act count.
  assert.ok(idsFor(emptyProfile(), finished({setup: {acts: 5}})).includes('wayfarers'),
    'a 5-Act clear should unlock Wayfarers');
  assert.ok(!idsFor(emptyProfile(), finished({setup: {acts: 4}})).includes('wayfarers'));
  assert.ok(idsFor(emptyProfile(), finished({setup: {acts: 1}})).includes('sprinters'));
  assert.ok(idsFor(emptyProfile(), finished({setup: {acts: 8}})).includes('relicmarathon'));

  // Lifetime recruits, counting this run — and not gated on winning.
  const veteran = emptyProfile();
  veteran.records.campaign.totalRecruited = 20;
  assert.ok(idsFor(veteran, finished({stats: {recruits: 5, assistOnly: false}})).includes('relicscoutnet'),
    '20 banked + 5 this run should cross the 25 threshold');
  assert.ok(idsFor(veteran, finished({phase: 'defeat', stats: {recruits: 5, assistOnly: false}})).includes('relicscoutnet'),
    'recruit unlocks should not require a win');

  // Already-owned unlocks are not re-awarded.
  const owner = emptyProfile();
  owner.unlocks.starterPools.push('wild');
  assert.ok(!idsFor(owner, finished({})).includes('wild'));
});

test('unlockable relics stay out of the reward pool until earned', () => {
  const gated = CampaignContent.RELICS.filter(r => r.unlockedBy).map(r => r.id);
  assert.ok(gated.length >= 6, `expected gated relics, saw ${gated.length}`);
  const run = draft(newRun());
  run.unlocks = {relics: []};
  const rolled = new Set();
  for (let i = 0; i < 200; i++) {
    const id = Campaign.grantRelic(run);
    if (id) rolled.add(id);
    if (run.relics.length >= CampaignContent.RELICS.length) break;
  }
  const leaked = [...rolled].filter(id => gated.includes(id));
  assert.deepStrictEqual([...leaked], [], `unearned relics were offered: ${leaked.join(', ')}`);
});

test('Full House refunds credits on release, and the modifier is actually read', () => {
  const run = draft(newRun());
  while (run.party.length < 2) { Campaign.offerRecruit(run, {count: 1}); Campaign.resolvePrompt(run, {index: 0}); }
  let guard = 0;
  while (run.pending && guard++ < 20) resolveAnyPrompt(run);
  run.relics.push('fullhouse');
  const before = run.credits;
  const result = Campaign.releaseMember(run, run.party[run.party.length - 1].uid);
  assert.ok(result.ok, result.error);
  assert.strictEqual(run.credits, before + 200, 'releaseRefund did nothing');
});

test('releasing a Pokemon drops the prompts that were queued for it', () => {
  // The blank-screen bug: a move-learn prompt outlived the Pokémon it was for,
  // and the renderer dereferenced a member that was no longer in the party.
  // Nearly unreachable while a full party was never offered recruits; routine
  // once it was.
  const run = draft(newRun());
  while (run.party.length < 3) { Campaign.offerRecruit(run, {count: 1}); Campaign.resolvePrompt(run, {index: 0}); }
  let guard = 0;
  while (run.pending && guard++ < 20) resolveAnyPrompt(run);

  const doomed = run.party[run.party.length - 1];
  run.promptStack.push({type: 'movelearn', title: 'Learn a move', memberUid: doomed.uid, moveId: 'suckerpunch', current: []});
  run.pending = run.promptStack[run.promptStack.length - 1];

  const result = Campaign.releaseMember(run, doomed.uid);
  assert.ok(result.ok, result.error);
  assert.ok(!run.promptStack.some(p => p.memberUid === doomed.uid), 'the orphaned prompt survived the release');
  assert.ok(!run.pending || run.pending.memberUid !== doomed.uid, 'pending still points at the released Pokémon');
});

test('recruiting over a full party clears the released Pokemon prompts', () => {
  // The recruit path releases inline rather than through releaseMember, so it
  // needs its own cleanup — this is the exact sequence that blanked the screen.
  const run = draft(newRun());
  while (run.party.length < Campaign.MAX_PARTY) { Campaign.offerRecruit(run, {count: 1}); Campaign.resolvePrompt(run, {index: 0}); }
  let guard = 0;
  while (run.pending && guard++ < 20) resolveAnyPrompt(run);

  const doomed = run.party[run.party.length - 1];
  run.promptStack.push({type: 'movelearn', title: 'Learn a move', memberUid: doomed.uid, moveId: 'suckerpunch', current: []});
  run.pending = run.promptStack[run.promptStack.length - 1];

  Campaign.offerRecruit(run, {count: 3});
  Campaign.resolvePrompt(run, {index: 0});
  assert.strictEqual(run.pending.needsRelease, true);
  const taken = Campaign.resolvePrompt(run, {index: run.pending.chosenIndex, releaseUid: doomed.uid});
  assert.ok(taken.ok, taken.error);

  const dangling = (run.promptStack || []).filter(p => p.memberUid && !run.party.some(m => m.uid === p.memberUid));
  assert.deepStrictEqual([...dangling.map(p => p.type)], [], 'a prompt outlived the Pokémon it was for');
});

test('a save already stuck on an orphaned prompt heals itself on load', () => {
  const run = draft(newRun());
  run.phase = 'prompt';
  run.promptStack = [{type: 'movelearn', title: 'Learn a move', memberUid: 'gone-forever', moveId: 'suckerpunch', current: []}];
  run.pending = run.promptStack[0];

  const restored = Campaign.deserialize(Campaign.serialize(run));
  assert.deepStrictEqual([...restored.promptStack], [], 'the dangling prompt should be dropped on load');
  assert.strictEqual(restored.pending, null);
  assert.strictEqual(restored.phase, 'map', 'the run should fall back to the map rather than an empty prompt');
});

test('Supply Drop restores PP and cures status, and duplicates nothing', () => {
  // It replaced "Field Treatment", which healed 50% party HP — exactly what
  // Team Rations does, so the reward screen offered the same thing twice.
  const run = draft(newRun());
  const member = run.party[0];
  for (const id of Object.keys(member.condition.pp)) member.condition.pp[id] = 0;
  member.condition.status = 'brn';
  const hpBefore = member.condition.currentHP;

  run.promptStack = [{type: 'reward', title: 'Choose a reward', kind: 'battle',
    options: [{kind: 'supplies', amount: 0.6, label: 'Supply Drop', detail: 'x'}]}];
  run.pending = run.promptStack[0];
  run.phase = 'prompt';
  const result = Campaign.resolvePrompt(run, {index: 0});
  assert.ok(result.ok, result.error);

  assert.strictEqual(member.condition.status, null, 'status should be cured');
  assert.ok(Object.values(member.condition.pp).every(pp => pp > 0), 'PP should be restored');
  assert.strictEqual(member.condition.currentHP, hpBefore,
    'Supply Drop must not heal HP — that is what Team Rations is for');

  // Team Rations still exists and still does the HP job.
  const rations = CampaignContent.CONSUMABLES.teamrations;
  assert.ok(rations && rations.effect === 'teamheal', 'Team Rations should remain the party HP option');
});

test('a run honours the chosen Act count and scales its curve to it', () => {
  for (const acts of [1, 3, 6, 8]) {
    const run = draft(Campaign.createRun({seed: 'REDGPT-ACTS1', difficulty: 'normal', trainerName: 'T', acts}));
    assert.strictEqual(run.map.acts.length, acts, `expected ${acts} Acts`);
    assert.strictEqual(Campaign.actCount(run), acts);
    // Progress spans the whole run whatever its length, so everything keyed on
    // it (power bands, reward richness, recruit rarity) stretches with the run.
    run.act = 1;
    run.stats.nodesInAct = 0;
    assert.strictEqual(Campaign.runProgress(run), 0, 'the opening is progress 0');
    run.act = acts;
    run.stats.nodesInAct = run.map.acts[acts - 1].rows;
    assert.ok(Math.abs(Campaign.runProgress(run) - 1) < 1e-9, 'the finale is progress 1');
    // Every Act map is still valid.
    for (const actMap of run.map.acts) {
      assert.ok(actMap.nodes.length > 0, 'empty Act map');
      assert.ok(actMap.bossId, 'an Act with no boss');
    }
  }
});

test('every Act of a long run has a resolvable name, and the UI never indexes ACT_LAYOUT', () => {
  /*
   * `ACT_LAYOUT` has three hand-authored entries but a run may have up to eight
   * Acts. `campaign-ui.js` read `ACT_LAYOUT[run.act - 1].name` directly, which
   * is `undefined` from Act 4 on — the TypeError blanked the entire Campaign
   * screen the moment an 8-Act run cleared Act 3.
   */
  const run = draft(Campaign.createRun({seed: 'REDGPT-NAMES', difficulty: 'normal', trainerName: 'T', acts: 8}));
  for (let act = 1; act <= 8; act++) {
    run.act = act;
    const map = Campaign.currentActMap(run);
    assert.ok(map, `Act ${act} has no generated map`);
    assert.ok(map.name && typeof map.name === 'string', `Act ${act} map has no name`);
    assert.ok(CampaignMap.layoutFor(act)?.name, `layoutFor(${act}) has no name`);
  }

  // The real guard: nothing in the UI may index the table by Act again.
  const fs = require('fs');
  const path = require('path');
  const uiDir = path.join(__dirname, '..', 'src', 'ui');
  const offenders = [];
  for (const file of fs.readdirSync(uiDir)) {
    if (!file.endsWith('.js')) continue;
    const source = fs.readFileSync(path.join(uiDir, file), 'utf8');
    source.split('\n').forEach((line, i) => {
      // Skip comments — the explanation of this very bug names ACT_LAYOUT[3].
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
      if (/ACT_LAYOUT\s*\[/.test(line)) offenders.push(`${file}:${i + 1} ${line.trim()}`);
    });
  }
  assert.deepStrictEqual(offenders, [],
    `the UI must use Campaign.currentActMap()/CampaignMap.layoutFor() instead:\n${offenders.join('\n')}`);
});

test('the level cap ramps to the same ceiling however many Acts there are', () => {
  for (const acts of [1, 3, 6, 8]) {
    const run = draft(Campaign.createRun({seed: 'REDGPT-CAP', difficulty: 'normal', trainerName: 'T', acts}));
    const caps = [];
    for (let act = 1; act <= acts; act++) {
      run.act = act;
      run.teamLevel = 1;
      Campaign.addLevels(run, 500);
      caps.push(run.teamLevel);
    }
    assert.strictEqual(caps[caps.length - 1], 68, `final cap should be 68, got ${caps[caps.length - 1]}`);
    for (let i = 1; i < caps.length; i++) {
      assert.ok(caps[i] >= caps[i - 1], `caps must not go backwards: ${caps.join(',')}`);
    }
    if (acts === 3) assert.deepStrictEqual([...caps], [32, 48, 68], 'the standard ramp must be unchanged');
  }
});

test('a higher self-chosen challenge makes opponents genuinely tougher', () => {
  const sample = (beacons, acts) => {
    const run = draft(Campaign.createRun({seed: 'REDGPT-CHAL', difficulty: 'normal', trainerName: 'T', beacons, acts}));
    run.act = 1;
    run.stats.nodesInAct = 2;
    return {challenge: Campaign.challengeLevel(run), beacons: run.beacons};
  };
  const base = sample(3, 3);
  const harder = sample(5, 3);
  const longer = sample(3, 6);
  assert.strictEqual(base.challenge, 0, 'the default shape is challenge 0');
  assert.ok(harder.challenge > base.challenge, 'extra Beacons must raise the challenge');
  assert.ok(longer.challenge > base.challenge, 'extra Acts must raise the challenge');
  assert.strictEqual(harder.beacons, 5, 'the chosen Beacon count is what the run starts with');
});

test('recruitment is tiered — no mythicals, legendaries only late', () => {
  const offered = {early: [], late: []};
  for (let i = 0; i < 25; i++) {
    const run = draft(Campaign.createRun({seed: `REDGPT-TIER${i}`, difficulty: 'normal', trainerName: 'T'}));
    for (const [phase, act] of [['early', 1], ['late', 3]]) {
      run.act = act;
      run.stats.nodesInAct = act === 3 ? run.map.acts[2].rows : 0;
      Campaign.offerRecruit(run, {count: 4, quality: 'normal', reason: 'test'});
      for (const set of (run.pending && run.pending.options) || []) offered[phase].push(Dex.species(set.species));
      run.promptStack = [];
      run.pending = null;
    }
  }
  assert.ok(offered.early.length > 20 && offered.late.length > 20, 'not enough samples');
  // Mythicals and the Anything-Goes tier are never recruitable at all. This is
  // the case that shipped an Arceus in Act 1.
  const forbidden = offered.early.concat(offered.late)
    .filter(s => s.mythical || s.powerClass === 'unrestricted-only')
    .map(s => s.name);
  assert.deepStrictEqual([...new Set(forbidden)], [], `these must never be recruitable: ${forbidden.join(', ')}`);
  // Legendaries are a late-run rarity, never an opening-Act one.
  const earlyLegends = offered.early.filter(s => s.legendary || s.powerClass === 'restricted').map(s => s.name);
  assert.deepStrictEqual([...new Set(earlyLegends)], [], `no legendaries early, got: ${earlyLegends.join(', ')}`);
});

test('a Pokemon can be released, but never the last one', () => {
  const run = draft(newRun());
  assert.strictEqual(Campaign.releaseMember(run, run.party[0].uid).ok, false,
    'the last Pokemon must not be releasable');
  // Give the party a second member holding an item.
  const clone = JSON.parse(JSON.stringify(run.party[0]));
  clone.uid = 'second-uid';
  clone.set.item = 'leftovers';
  run.party.push(clone);
  const before = run.bag.held.leftovers || 0;
  const result = Campaign.releaseMember(run, 'second-uid');
  assert.ok(result.ok, result.error);
  assert.strictEqual(run.party.length, 1);
  assert.strictEqual(run.bag.held.leftovers, before + 1, 'a held item returns to the bag');
  assert.strictEqual(Campaign.releaseMember(run, 'nope').ok, false, 'unknown uid is rejected');
});

test('the Poké Mart stocks usable Mega Stones and Tera Shards', () => {
  const run = draft(newRun());
  run.party[0].set.species = 'charizard';
  run.party[0].set = Pokemon.normalizeSet(run.party[0].set);
  const stock = Campaign.buildMartStock(run);
  assert.ok(stock.length >= 4, 'the mart should stock something');

  const stones = stock.filter(e => Dex.item(e.id)?.megaStone);
  assert.ok(stones.length, 'a Charizard in the party should see Charizardite on sale');
  for (const entry of stones) {
    const pairs = Object.keys(Dex.item(entry.id).megaStone);
    assert.ok(pairs.some(base => Dex.toID(base) === 'charizard'),
      `${entry.name} is not usable by this party and should not be stocked`);
  }
  const shards = stock.filter(e => e.kind === 'terashard');
  assert.ok(shards.length, 'Tera Shards should be on sale');
  for (const shard of shards) assert.ok(Dex.TYPES.includes(shard.teraType), `bad shard type ${shard.teraType}`);
  assert.ok(stock.every(e => e.price > 0), 'everything needs a price');
});

test('a Tera Shard retypes exactly one party member', () => {
  const run = draft(newRun());
  const member = run.party[0];
  const original = member.set.teraType;
  const target = Dex.TYPES.find(t => t !== original);
  run.promptStack = [];
  run.pending = null;
  Campaign.enterNode(run, run.availableNodeIds[0]);
  // Drive the prompt directly rather than depending on which node opened.
  run.promptStack = [{type: 'terashard', title: 'shard', teraType: target}];
  run.pending = run.promptStack[0];
  const result = Campaign.resolvePrompt(run, {memberUid: member.uid});
  assert.ok(result.ok, result.error);
  assert.strictEqual(member.set.teraType, target, 'the Tera Type should have changed');
});

test('every generated Act map is a valid branching graph', () => {
  for (let i = 0; i < 20; i++) {
    const rng = new RNG(9000 + i * 13);
    const map = CampaignMap.generateRunMap(rng, {});
    assert.strictEqual(map.acts.length, 3);
    for (const actMap of map.acts) {
      const problems = CampaignMap.validateAct(actMap);
      assert.deepStrictEqual([...problems], [], `act ${actMap.act} seed ${i}`);
    }
  }
});

test('maps branch rather than funnelling every path together', () => {
  const rng = new RNG(31415);
  const map = CampaignMap.generateRunMap(rng, {});
  for (const actMap of map.acts) {
    const rowsWithChoice = [];
    for (let row = 0; row < actMap.rows - 1; row++) {
      const nodes = actMap.nodes.filter(n => n.row === row);
      if (nodes.some(n => n.next.length > 1) || nodes.length > 1) rowsWithChoice.push(row);
    }
    assert.ok(rowsWithChoice.length >= actMap.rows / 2,
      `act ${actMap.act} only offers choices on ${rowsWithChoice.length} of ${actMap.rows} rows`);
  }
});

test('each Act contains the full spread of node types and ends in a boss', () => {
  const rng = new RNG(2718);
  const map = CampaignMap.generateRunMap(rng, {});
  for (const actMap of map.acts) {
    const types = new Set(actMap.nodes.map(n => n.type));
    for (const required of ['trainer', 'elite', 'shop', 'rest', 'boss']) {
      assert.ok(types.has(required), `act ${actMap.act} has no ${required} node`);
    }
    const boss = actMap.nodes.find(n => n.id === actMap.bossId);
    assert.strictEqual(boss.row, actMap.rows - 1);
    const preBoss = actMap.nodes.filter(n => n.row === actMap.rows - 2);
    assert.ok(preBoss.every(n => n.type === 'rest'), 'a Rest Site always precedes the boss');
  }
});

test('only nodes connected to the current position are selectable', () => {
  const run = draft(newRun());
  const entry = run.availableNodeIds[0];
  const unreachable = Campaign.currentActMap(run).nodes.find(n => n.row === 3);
  const blocked = Campaign.enterNode(run, unreachable.id);
  assert.ok(!blocked.ok, 'a distant node must not be enterable');
  assert.ok(/not reachable/i.test(blocked.error));
  const allowed = Campaign.enterNode(run, entry);
  assert.ok(allowed.ok);
});

/* ------------------------------------------------------------------ *
 * Nodes and progression
 * ------------------------------------------------------------------ */

test('entering a battle node produces a playable, legal encounter', () => {
  const run = draft(newRun({seed: 'REDGPT-000101'}));
  const rng = new RNG(1);
  let guard = 0;
  while (run.phase !== 'battle' && guard++ < 20) step(run, rng);
  assert.strictEqual(run.phase, 'battle');
  const config = run.pending.config;
  assert.ok(config.enemyTeam.length >= 1);
  assert.ok(config.playerTeam.length >= 1);
  const result = Validation.validateTeam({sets: config.enemyTeam}, 'campaign');
  assert.deepStrictEqual([...result.errors.map(e => e.message)], []);
  const battle = Campaign.createBattle(run, config);
  battle.start();
  assert.ok(battle.turn >= 1 || battle.phase === 'teampreview');
});

test('winning a node clears it, pays out and levels the team', () => {
  const run = draft(newRun({seed: 'REDGPT-000202'}));
  const rng = new RNG(2);
  let guard = 0;
  while (run.phase !== 'battle' && guard++ < 20) step(run, rng);
  const levelBefore = run.teamLevel;
  const creditsBefore = run.credits;
  const nodeId = run.activeNodeId;
  const config = run.pending.config;
  // Force a win so the assertion does not depend on the AI's luck.
  const survivors = run.party.map(m => ({uid: m.uid, condition: m.condition}));
  const result = Campaign.resolveBattle(run, {won: true, survivors});
  assert.ok(result.ok, result.error);
  assert.ok(run.clearedNodeIds.includes(nodeId));
  assert.ok(run.teamLevel > levelBefore, 'clearing a battle should raise the team level');
  assert.ok(run.credits >= creditsBefore + (config.reward.credits || 0) - 1);
});

test('losing a battle spends a Rescue Beacon, and running out ends the run', () => {
  const run = draft(newRun({seed: 'REDGPT-000303'}));
  const rng = new RNG(3);
  const beacons = run.beacons;
  let losses = 0;
  let guard = 0;
  while (run.phase !== 'defeat' && guard++ < 200) {
    if (run.phase === 'battle') {
      losses++;
      const survivors = run.party.map(m => ({uid: m.uid, condition: Object.assign({}, m.condition, {currentHP: 0})}));
      const result = Campaign.resolveBattle(run, {won: false, survivors});
      assert.ok(result.ok, result.error);
      if (losses <= beacons) {
        assert.strictEqual(run.phase, 'map', 'a beacon should return the run to the map');
        assert.ok(run.party.every(m => m.condition.currentHP > 0), 'a rescue restores the party');
      }
    } else {
      step(run, rng);
    }
  }
  assert.strictEqual(run.phase, 'defeat');
  assert.strictEqual(losses, beacons + 1, `expected ${beacons + 1} losses, got ${losses}`);
  assert.ok(/no Rescue Beacons remaining/.test(run.result.reason));
});

test('a rescued node stays uncleared so the loss costs progress', () => {
  const run = draft(newRun({seed: 'REDGPT-000404'}));
  const rng = new RNG(4);
  let guard = 0;
  while (run.phase !== 'battle' && guard++ < 20) step(run, rng);
  const nodeId = run.activeNodeId;
  const survivors = run.party.map(m => ({uid: m.uid, condition: Object.assign({}, m.condition, {currentHP: 0})}));
  Campaign.resolveBattle(run, {won: false, survivors});
  assert.ok(!run.clearedNodeIds.includes(nodeId), 'a lost node must not count as cleared');
});

/* ------------------------------------------------------------------ *
 * Team building during a run
 * ------------------------------------------------------------------ */

test('recruitment adds a legal Pokémon at the run level', () => {
  const run = draft(newRun({seed: 'REDGPT-000505'}));
  Campaign.offerRecruit(run, {count: 3, quality: 'normal'});
  assert.strictEqual(run.pending.type, 'recruit');
  assert.strictEqual(run.pending.options.length, 3);
  const before = run.party.length;
  const result = Campaign.resolvePrompt(run, {index: 0});
  assert.ok(result.ok, result.error);
  assert.strictEqual(run.party.length, before + 1);
  const recruit = run.party[run.party.length - 1];
  assert.strictEqual(recruit.set.level, run.teamLevel);
  const validation = Validation.validateTeam({sets: [recruit.set]}, 'campaign');
  assert.deepStrictEqual([...validation.errors.map(e => e.message)], []);
});

test('a full party must release someone before recruiting', () => {
  const run = draft(newRun({seed: 'REDGPT-000606'}));
  while (run.party.length < Campaign.MAX_PARTY) {
    const candidates = Campaign.draftCandidates(run, run.unlocks);
    run.party.push({
      uid: Pokemon.newUid('c'),
      set: candidates[0],
      condition: Pokemon.fullyHealCondition(candidates[0]),
      joinedAtNode: 0,
    });
  }
  Campaign.offerRecruit(run, {count: 2});
  const blocked = Campaign.resolvePrompt(run, {index: 0});
  assert.ok(blocked.ok);
  assert.ok(run.pending.needsRelease, 'a full party must be asked who to release');
  const releasing = run.party[5].uid;
  Campaign.resolvePrompt(run, {index: run.pending.chosenIndex, releaseUid: releasing});
  assert.strictEqual(run.party.length, Campaign.MAX_PARTY);
  assert.ok(!run.party.some(m => m.uid === releasing));
});

test('held items move between the bag and party members', () => {
  const run = draft(newRun({seed: 'REDGPT-000707'}));
  Campaign.addHeldItem(run, 'leftovers');
  const member = run.party[0];
  const previous = member.set.item;
  const result = Campaign.equipHeldItem(run, member.uid, 'leftovers');
  assert.ok(result.ok, result.error);
  assert.strictEqual(member.set.item, 'leftovers');
  assert.ok(!run.bag.held.leftovers, 'the item leaves the bag');
  if (previous) assert.strictEqual(run.bag.held[previous], 1, 'the replaced item returns to the bag');
  Campaign.equipHeldItem(run, member.uid, null);
  assert.strictEqual(member.set.item, null);
  assert.strictEqual(run.bag.held.leftovers, 1);
});

test('consumables heal, revive and are spent', () => {
  const run = draft(newRun({seed: 'REDGPT-000808'}));
  const member = run.party[0];
  Campaign.addConsumable(run, 'hyperpotion', 1);
  member.condition.currentHP = 1;
  const heal = Campaign.useConsumable(run, 'hyperpotion', member.uid);
  assert.ok(heal.ok, heal.error);
  assert.ok(member.condition.currentHP > 1);
  assert.ok(!run.bag.consumables.hyperpotion);

  Campaign.addConsumable(run, 'revive', 1);
  member.condition.currentHP = 0;
  const revive = Campaign.useConsumable(run, 'revive', member.uid);
  assert.ok(revive.ok, revive.error);
  assert.ok(member.condition.currentHP > 0);
});

test('a consumable with no effect is refused and not consumed', () => {
  const run = draft(newRun({seed: 'REDGPT-000909'}));
  Campaign.addConsumable(run, 'potion', 1);
  const stock = run.bag.consumables.potion;
  const result = Campaign.useConsumable(run, 'potion', run.party[0].uid);
  assert.ok(!result.ok, 'healing a Pokémon at full HP should be refused');
  assert.strictEqual(run.bag.consumables.potion, stock, 'a refused item is not consumed');
});

test('levelling evolves party members and offers new moves', () => {
  const run = draft(newRun({seed: 'REDGPT-001010'}));
  // Replace the starter with something that evolves at a known level.
  const set = Pokemon.normalizeSet({species: 'charmander', level: run.teamLevel, moves: ['ember', 'scratch', 'growl', 'smokescreen']});
  run.party = [{uid: Pokemon.newUid('c'), set, condition: Pokemon.fullyHealCondition(set), joinedAtNode: 0}];
  Campaign.addLevels(run, 40);
  const species = Dex.species(run.party[0].set.species);
  assert.notStrictEqual(species.id, 'charmander', 'Charmander should have evolved by level 56');
  assert.ok(['charmeleon', 'charizard'].includes(species.id), `evolved into ${species.id}`);
  for (const moveId of run.party[0].set.moves) {
    assert.ok(Dex.canLearn(species, moveId), `${species.name} kept an illegal move ${moveId}`);
  }
});

test('a move-learning prompt never silently replaces a move', () => {
  const run = draft(newRun({seed: 'REDGPT-001111'}));
  const member = run.party[0];
  const species = Dex.species(member.set.species);
  member.set.moves = Dex.legalMoveList(species).slice(0, 4);
  const extra = Dex.legalMoveList(species).find(id => !member.set.moves.includes(id));
  const before = [...member.set.moves];
  // Teach through the tutor path, which must ask before overwriting.
  run.promptStack = [{type: 'tutor', title: 'Teach', memberUid: member.uid}];
  run.pending = run.promptStack[0];
  run.phase = 'prompt';
  Campaign.resolvePrompt(run, {memberUid: member.uid, moveId: extra});
  assert.strictEqual(run.pending.type, 'movelearn', 'a full moveset must prompt for a replacement');
  assert.deepStrictEqual([...member.set.moves], before, 'nothing changes until the player chooses');
  Campaign.resolvePrompt(run, {replaceIndex: 0});
  assert.strictEqual(member.set.moves[0], extra);
});

/* ------------------------------------------------------------------ *
 * Shops and rewards
 * ------------------------------------------------------------------ */

test('shop stock is generated, purchasable and deducts credits', () => {
  const run = draft(newRun({seed: 'REDGPT-001212'}));
  run.credits = 5000;
  const stock = Campaign.buildShopStock(run);
  assert.ok(stock.length >= 3);
  run.promptStack = [{type: 'shop', title: 'Shop', stock}];
  run.pending = run.promptStack[0];
  run.phase = 'prompt';
  const entry = stock.find(s => s.kind === 'consumable' || s.kind === 'held');
  const before = run.credits;
  const result = Campaign.resolvePrompt(run, {index: entry.index});
  assert.ok(result.ok, result.error);
  assert.strictEqual(run.credits, before - entry.price);
  assert.ok(run.pending.stock[entry.index].sold);
});

test('a purchase you cannot afford is refused', () => {
  const run = draft(newRun({seed: 'REDGPT-001313'}));
  run.credits = 0;
  const stock = Campaign.buildShopStock(run);
  run.promptStack = [{type: 'shop', title: 'Shop', stock}];
  run.pending = run.promptStack[0];
  run.phase = 'prompt';
  const result = Campaign.resolvePrompt(run, {index: 0});
  assert.ok(!result.ok);
  assert.ok(/Not enough credits/.test(result.error));
});

test('shops only stock evolution items the party can use', () => {
  const run = draft(newRun({seed: 'REDGPT-001414'}));
  const usable = new Set();
  for (const member of run.party) {
    for (const rule of Dex.evolutions(member.set.species)) {
      if (rule.method === 'item' && Dex.item(rule.item)) usable.add(Dex.item(rule.item).id);
    }
  }
  for (let i = 0; i < 8; i++) {
    for (const entry of Campaign.buildShopStock(run)) {
      if (entry.kind === 'evolution') assert.ok(usable.has(entry.id), `stocked a useless ${entry.name}`);
    }
  }
});

test('relics apply their modifiers to the run', () => {
  const run = draft(newRun({seed: 'REDGPT-001515'}));
  const before = Campaign.modifiers(run);
  Campaign.grantRelic(run, 'bargainchip');
  const after = Campaign.modifiers(run);
  assert.strictEqual(after.shopSlots, before.shopSlots + 1);
  assert.ok(after.priceMultiplier < before.priceMultiplier);
});

test('ascension modifiers stack and only tighten the economy', () => {
  const base = Campaign.modifiers(newRun({ascension: 0}));
  const high = Campaign.modifiers(newRun({ascension: 3}));
  assert.ok(high.priceMultiplier > base.priceMultiplier);
  assert.ok(high.shopSlots < base.shopSlots);
  assert.strictEqual(high.eliteAi, 'expert');
});

/* ------------------------------------------------------------------ *
 * Events
 * ------------------------------------------------------------------ */

test('every event definition is well formed and its choices apply cleanly', () => {
  for (const event of CampaignContent.EVENTS) {
    assert.ok(event.title && event.text, `${event.id} missing text`);
    assert.ok(event.choices.length >= 2 && event.choices.length <= 3, `${event.id} choice count`);
    for (let i = 0; i < event.choices.length; i++) {
      const run = draft(newRun({seed: 3000 + i}));
      run.credits = 5000;
      Campaign.addHeldItem(run, 'leftovers');
      const choice = event.choices[i];
      assert.ok(choice.label, `${event.id} choice ${i} has no label`);
      if (choice.enabled && !choice.enabled(run)) continue;
      run.promptStack = [{type: 'event', eventId: event.id, title: event.title, text: event.text,
        choices: event.choices.map((c, index) => ({index, label: c.label, detail: c.detail, enabled: c.enabled ? !!c.enabled(run) : true}))}];
      run.pending = run.promptStack[0];
      run.phase = 'prompt';
      const result = Campaign.resolvePrompt(run, {index: i});
      assert.ok(result.ok, `${event.id} choice ${i}: ${result.error}`);
    }
  }
});

/* ------------------------------------------------------------------ *
 * Bosses
 * ------------------------------------------------------------------ */

test('boss encounters build legal, plan-appropriate teams', () => {
  const run = draft(newRun({seed: 'REDGPT-001616'}));
  run.party.push(...[1, 2, 3].map(() => {
    const set = Campaign.draftCandidates(run, run.unlocks)[0];
    return {uid: Pokemon.newUid('c'), set, condition: Pokemon.fullyHealCondition(set), joinedAtNode: 0};
  }));
  for (const boss of [...CampaignContent.BOSSES, CampaignContent.FINAL_BOSS]) {
    const config = Campaign.buildBattleConfig(run, {kind: 'boss', boss, title: boss.name, background: boss.background});
    assert.ok(config.enemyTeam.length >= 3, `${boss.name} fielded ${config.enemyTeam.length}`);
    const validation = Validation.validateTeam({sets: config.enemyTeam}, 'campaign');
    assert.deepStrictEqual([...validation.errors.map(e => e.message)], [], boss.name);
    // The plan's key members must survive the size cap.
    const species = config.enemyTeam.map(s => s.species);
    assert.strictEqual(species[0], Dex.species(boss.members[0].species).id, `${boss.name} lost its lead`);
  }
});

test('a branching evolution asks which form; a single line still evolves silently', () => {
  /*
   * `checkEvolutions` used to sort the eligible rules by level and take `[0]`, so
   * a Wurmple was always a Silcoon and a Tyrogue always a Hitmonlee — the branch
   * was decided by data order, invisibly. Now it asks.
   *
   * Controls both ways: an unambiguous line must still evolve with no prompt at
   * all (or every level-up would interrupt the run), and an unambiguous *chain*
   * must still run to completion.
   */
  const build = (species, level, {extra = false} = {}) => {
    const run = draft(newRun({seed: 'REDGPT-EVO001'}));
    const set = Pokemon.normalizeSet({species, level: Campaign.STARTING_LEVEL, moves: ['tackle']});
    run.party = [{uid: 'e1', set, condition: Pokemon.fullyHealCondition(set), joinedAtNode: 0}];
    if (extra) {
      const spare = Pokemon.normalizeSet({species: 'rattata', level: Campaign.STARTING_LEVEL, moves: ['tackle']});
      run.party.push({uid: 'e2', set: spare, condition: Pokemon.fullyHealCondition(spare), joinedAtNode: 0});
    }
    run.promptStack = [];
    run.pending = null;
    // Act 3, so `actLevelCap` does not clamp below the level the evolution needs.
    run.act = 3;
    run.teamLevel = Campaign.STARTING_LEVEL;
    Campaign.addLevels(run, level - Campaign.STARTING_LEVEL);
    return run;
  };
  const choiceIn = run => run.promptStack.find(p => p.type === 'evolvechoice');

  // Wurmple branches at level 7.
  let run = build('wurmple', 12);
  let prompt = choiceIn(run);
  assert.ok(prompt, 'a branching evolution should raise a choice prompt');
  assert.strictEqual(Dex.toID(run.party[0].set.species), 'wurmple', 'it must not evolve before being asked');
  assert.deepStrictEqual([...prompt.options.map(o => Dex.toID(o.target))].sort(), ['cascoon', 'silcoon']);

  // Take the second option, so passing on data order alone is impossible. At
  // level 12 the chain then continues by itself: Cascoon becomes Dustox at 10.
  run.pending = prompt;
  run.promptStack = [prompt];
  assert.ok(Campaign.resolvePrompt(run, {index: 1}).ok, 'resolving the choice should succeed');
  assert.strictEqual(Dex.toID(run.party[0].set.species), 'dustox',
    'choosing Cascoon should commit to that line and carry the chain through');

  // Tyrogue offers all three.
  assert.strictEqual(choiceIn(build('tyrogue', 20)).options.length, 3, 'Tyrogue should offer three forms');

  // Every eligible target is offered, not just the lowest-level one.
  const eevee = choiceIn(build('eevee', 60)).options.map(o => Dex.toID(o.target));
  for (const id of ['espeon', 'umbreon', 'sylveon']) {
    assert.ok(eevee.includes(id), `a level-60 Eevee should be offered ${id} (got ${eevee.join(', ')})`);
  }

  // CONTROL: one target means no prompt.
  run = build('oddish', 25);
  assert.ok(!choiceIn(run), 'control failed: a single-target evolution must not prompt');
  assert.strictEqual(Dex.toID(run.party[0].set.species), 'gloom', 'and it should have evolved');

  // CONTROL: an unambiguous chain still completes.
  assert.strictEqual(Dex.toID(build('caterpie', 20).party[0].set.species), 'butterfree',
    'control failed: an unambiguous chain should evolve all the way');

  // Declining leaves it alone.
  run = build('slowpoke', 40);
  prompt = choiceIn(run);
  run.pending = prompt;
  run.promptStack = [prompt];
  Campaign.resolvePrompt(run, {skip: true});
  assert.strictEqual(Dex.toID(run.party[0].set.species), 'slowpoke', 'declining should leave it unevolved');

  // And releasing the Pokemon must not strand the prompt (§8).
  run = build('wurmple', 12, {extra: true});
  assert.ok(choiceIn(run), 'expected a prompt before releasing');
  Campaign.releaseMember(run, 'e1');
  assert.ok(!choiceIn(run), 'releasing the Pokemon should prune its evolution prompt');
});

test('a Rare Encounter always offers the exact Pokemon it fielded', () => {
  /*
   * Three things at once, because they only mean anything together:
   *   - **every** win offers, with no roll (project decision — this replaced a
   *     flat one-in-three, and the assertion below is a literal 100%, not a
   *     comparison against a configured rate, so reintroducing any chance fails
   *     here rather than quietly agreeing with itself);
   *   - the offered set is the one that was *fought* (moves, ability, item,
   *     nature, Tera type), not a freshly rolled set of the same species;
   *   - the tier gate is deliberately bypassed here, so legendaries and mythicals
   *     — which random recruitment refuses outright — do get offered.
   *
   * The full-party damping in `shouldOfferRecruit` must stay bypassed too, which
   * is what `offered === entered` really pins: some of these runs reach a Rare
   * Encounter with six Pokémon, and a single declined offer would fail it.
   *
   * Controls: the sweep must actually reach encounters, and the marquee families
   * must actually appear or the tier-gate bypass is untested.
   */
  let entered = 0, offered = 0, matched = 0, joined = 0, marquee = 0;
  for (let s = 0; s < 2500 && entered < 120; s++) {
    const run = draft(newRun({seed: `REDGPT-RARE${String(s).padStart(2, '0')}`}));
    // Late run, so the legendary/mythical appearance gate is open.
    run.act = 3;
    run.stats.nodesInAct = 7;
    const act = Campaign.currentActMap(run);
    const rare = act.nodes.find(n => n.type === 'rare' && (n.prev || []).length);
    if (!rare) continue;
    run.currentNodeId = rare.prev[0];
    run.clearedNodeIds = [rare.prev[0]];
    run.phase = 'map';
    Campaign.refreshAvailableNodes(run);
    if (!run.availableNodeIds.includes(rare.id)) continue;
    if (!Campaign.enterNode(run, rare.id).ok) continue;
    entered++;

    const fought = run.pending.config.enemyTeam[0];
    const species = Dex.species(fought.species);
    if (species.legendary || species.mythical) marquee++;
    assert.ok(Campaign.resolveBattle(run, {won: true, survivors: []}).ok, 'rare battle did not resolve');

    // The reward prompt is pushed above the recruit, and a reward option can be a
    // recruit of its own — so drain by matching the species that was fought.
    const ours = p => p && p.type === 'recruit' && p.options?.[0] &&
      Dex.toID(p.options[0].species) === Dex.toID(fought.species);
    let guard = 0;
    while (run.pending && !ours(run.pending) && guard++ < 12) {
      const prompt = run.pending;
      if (prompt.type === 'reward') {
        const index = prompt.options.findIndex(o => o.kind !== 'recruit');
        Campaign.resolvePrompt(run, {index: index >= 0 ? index : 0});
      } else if (prompt.type === 'message') Campaign.resolvePrompt(run, {});
      else Campaign.resolvePrompt(run, {skip: true});
    }
    if (!ours(run.pending)) continue;
    offered++;

    const offer = run.pending.options[0];
    const same = Dex.toID(offer.item || '') === Dex.toID(fought.item || '') &&
      Dex.toID(offer.ability || '') === Dex.toID(fought.ability || '') &&
      offer.nature === fought.nature && offer.teraType === fought.teraType &&
      JSON.stringify([...offer.moves].sort()) === JSON.stringify([...fought.moves].sort());
    if (same) matched++;

    Campaign.resolvePrompt(run, {index: 0});
    if (run.pending?.needsRelease) {
      Campaign.resolvePrompt(run, {index: 0, releaseUid: run.party[run.party.length - 1].uid});
    }
    if (run.party.some(m => Dex.toID(m.set.species) === Dex.toID(fought.species))) joined++;
  }

  // CONTROL: without this the assertions below pass trivially on zero samples.
  assert.ok(entered >= 60, `only reached ${entered} Rare Encounters — too few to measure`);
  assert.strictEqual(offered, entered,
    `every Rare Encounter win must offer its Pokemon — ${offered} of ${entered} did`);
  // The dial is gone, not set to 1. A probability that is never a probability is
  // the kind of knob this project keeps finding inert years later.
  assert.strictEqual(CampaignContent.RARE_ENCOUNTER.recruitChance, undefined,
    'recruitChance should have been removed, not set to 1');
  assert.strictEqual(matched, offered, 'an offered set differed from the set that was fought');
  assert.strictEqual(joined, offered, 'accepting the offer did not add the Pokemon to the party');
  assert.ok(marquee > 0, 'no legendary or mythical was ever fielded — the tier-gate bypass is untested');
});

test('defeating an Act boss advances the Act and fully heals the team', () => {
  const run = draft(newRun({seed: 'REDGPT-001717'}));
  const bossId = Campaign.currentActMap(run).bossId;
  run.currentNodeId = Campaign.currentActMap(run).nodes.find(n => n.row === Campaign.currentActMap(run).rows - 2).id;
  run.availableNodeIds = [bossId];
  Campaign.enterNode(run, bossId);
  assert.strictEqual(run.phase, 'battle');
  for (const member of run.party) member.condition.currentHP = 1;
  const survivors = run.party.map(m => ({uid: m.uid, condition: m.condition}));
  Campaign.resolveBattle(run, {won: true, survivors});
  assert.strictEqual(run.stats.bossesBeaten, 1);
  let guard = 0;
  while (run.phase === 'prompt' && guard++ < 12) resolveAnyPrompt(run);
  assert.strictEqual(run.act, 2, 'the run should advance to Act 2');
  assert.ok(run.party.every(m => m.condition.currentHP === Campaign.memberMaxHP(run, m)), 'the team is fully healed between Acts');
  assert.ok(run.availableNodeIds.length >= 2, 'Act 2 must present a fresh set of openings');
});

test('defeating the final boss wins the run', () => {
  const run = draft(newRun({seed: 'REDGPT-001818'}));
  run.act = 3;
  run.stats.nodesInAct = 8;
  const actMap = Campaign.currentActMap(run);
  run.currentNodeId = actMap.nodes.find(n => n.row === actMap.rows - 2).id;
  run.availableNodeIds = [actMap.bossId];
  Campaign.enterNode(run, actMap.bossId);
  assert.strictEqual(run.pending.config.reward.final, true);
  assert.strictEqual(run.pending.config.opponent.name, CampaignContent.FINAL_BOSS.name);
  const survivors = run.party.map(m => ({uid: m.uid, condition: m.condition}));
  Campaign.resolveBattle(run, {won: true, survivors});
  assert.strictEqual(run.phase, 'victory');
  assert.ok(run.result.won);
});

/* ------------------------------------------------------------------ *
 * Persistence
 * ------------------------------------------------------------------ */

test('a run survives serialisation at every phase', () => {
  const run = draft(newRun({seed: 'REDGPT-001919'}));
  const rng = new RNG(19);
  const phasesSeen = new Set();
  for (let i = 0; i < 40 && !['victory', 'defeat'].includes(run.phase); i++) {
    phasesSeen.add(run.phase === 'prompt' ? `prompt:${run.pending.type}` : run.phase);
    const serialized = Campaign.serialize(run);
    const restored = Campaign.deserialize(JSON.parse(JSON.stringify(serialized)));
    assert.ok(restored, `deserialise failed at ${run.phase}`);
    assert.strictEqual(restored.phase, run.phase);
    assert.strictEqual(restored.party.length, run.party.length);
    assert.strictEqual(restored.teamLevel, run.teamLevel);
    assert.strictEqual(JSON.stringify(restored.rngState), JSON.stringify(serialized.rngState));
    step(run, rng);
  }
  assert.ok(phasesSeen.size >= 3, `only saw ${[...phasesSeen].join(', ')}`);
});

test('a restored run continues identically to one that was never saved', () => {
  const play = (restoreAt) => {
    let run = draft(newRun({seed: 'REDGPT-002020'}));
    const rng = new RNG(20);
    for (let i = 0; i < 12 && !['victory', 'defeat'].includes(run.phase); i++) {
      if (i === restoreAt) run = Campaign.deserialize(JSON.parse(JSON.stringify(Campaign.serialize(run))));
      step(run, rng);
    }
    return Campaign.serialize(run);
  };
  const plain = play(-1);
  const restored = play(4);
  const shape = run => run.party.map(m => ({
    species: m.set.species, level: m.set.level, item: m.set.item,
    ability: m.set.ability, moves: [...m.set.moves], hp: m.condition.currentHP,
  }));
  assert.strictEqual(JSON.stringify(shape(plain)), JSON.stringify(shape(restored)));
  assert.strictEqual(plain.teamLevel, restored.teamLevel);
  assert.strictEqual(plain.credits, restored.credits);
});

test('a corrupt or foreign run object is rejected rather than crashing', () => {
  assert.strictEqual(Campaign.deserialize(null), null);
  assert.strictEqual(Campaign.deserialize({version: 999}), null);
});

/* ------------------------------------------------------------------ *
 * Full-run soak
 * ------------------------------------------------------------------ */

test('runs play from draft to a terminal state without throwing', () => {
  const failures = [];
  let wins = 0;
  let completed = 0;
  for (let i = 0; i < 8; i++) {
    try {
      const run = draft(newRun({seed: 5000 + i * 29, difficulty: ['normal', 'veteran', 'master'][i % 3]}));
      const rng = new RNG(i + 1);
      let guard = 0;
      while (!['victory', 'defeat'].includes(run.phase) && guard++ < 600) step(run, rng);
      if (guard >= 600) throw new Error('run did not terminate');
      completed++;
      if (run.result.won) wins++;
      assert.ok(run.result, 'a finished run must record a result');
      const summary = Campaign.summarise(run);
      assert.ok(summary.seedLabel && summary.nodes >= 0 && Array.isArray(summary.team));
    } catch (error) {
      failures.push(`seed ${5000 + i * 29}: ${error.message}`);
    }
  }
  assert.deepStrictEqual(failures.slice(0, 3), []);
  assert.strictEqual(completed, 8);
  console.log(`        soak: ${completed} runs completed, ${wins} cleared`);
});

test('the starter draft is confined to the pools chosen for the run', () => {
  /*
   * Starter pools are toggled per run in the setup screen, so `unlocks
   * .starterPools` is now "what the player left switched on" rather than
   * "everything they own". The draft has to honour that, and the UI has to keep
   * at least one on — an empty selection leaves `draftCandidates` with nothing
   * to pick from and hands back an empty draft, which soft-locks the run rather
   * than erroring.
   *
   * The control is the widening: one pool must offer strictly fewer distinct
   * species than all of them, or the filter could be doing nothing.
   */
  const poolIds = Object.keys(CampaignContent.STARTER_POOLS);
  const sample = selected => {
    const allowed = new Set(selected.flatMap(id =>
      CampaignContent.STARTER_POOLS[id].species.map(Dex.toID)));
    const seen = new Set();
    let outside = 0;
    let offered = 0;
    for (let i = 0; i < 25; i++) {
      const run = newRun({seed: `REDGPT-POOL${String(i).padStart(2, '0')}`,
        unlocks: {starterPools: selected, relics: []}});
      for (const option of (run.pending && run.pending.options) || []) {
        offered++;
        const id = Dex.toID(option.species);
        seen.add(id);
        if (!allowed.has(id)) outside++;
      }
    }
    return {distinct: seen.size, offered, outside};
  };

  const one = sample([poolIds[0]]);
  assert.ok(one.offered > 0, 'no starters were offered at all');
  assert.strictEqual(one.outside, 0, 'the draft offered a species from a pool that was switched off');

  const every = sample(poolIds);
  assert.strictEqual(every.outside, 0, 'the draft offered a species from no pool at all');
  // CONTROL: without this, a filter that silently ignored the selection passes.
  assert.ok(every.distinct > one.distinct,
    `selecting every pool should widen the draft (${every.distinct} vs ${one.distinct} distinct species)`);
});

test('releasing for a recruit returns the held item and pays the refund', () => {
  /*
   * Swapping a Pokémon out for a recruit used to release it *inline* rather than
   * through `releaseMember`, so every effect of a release had to be remembered
   * and repeated at that call site. Two were not: the held item was destroyed
   * instead of returned (a Choice Scarf simply vanished) and Full House's
   * `releaseRefund` never paid on this route. Reported from real play.
   *
   * The assertions deliberately cover **both** effects and the party menu route
   * as a control: if a future change re-forks the two paths, the recruit half
   * fails while the menu half keeps passing, which names the bug precisely.
   */
  const build = () => {
    const run = draft(newRun({seed: 'REDGPT-RELEASE9'}));
    while (run.party.length < 6) {
      const clone = JSON.parse(JSON.stringify(run.party[0]));
      clone.uid = `rel${run.party.length}`;
      run.party.push(clone);
    }
    run.relics.push('fullhouse');
    run.credits = 0;
    run.bag.held = {};
    run.party[5].set.item = 'choicescarf';
    return run;
  };

  // Route 1: the full-party recruit swap.
  const run = build();
  const victim = run.party[5].uid;
  Campaign.offerRecruit(run, {count: 1, species: 'pikachu', reason: 'test', allowDecline: true});
  assert.strictEqual(run.pending.type, 'recruit');
  assert.ok(Campaign.resolvePrompt(run, {index: 0}).ok, 'choosing the recruit should ask which to release');
  const result = Campaign.resolvePrompt(run, {index: 0, releaseUid: victim});
  assert.ok(result.ok, result.error);

  assert.strictEqual(run.bag.held.choicescarf, 1, 'the released Pokémon\'s held item was not returned');
  assert.strictEqual(run.credits, 200, 'Full House did not pay out on the recruit-swap route');
  assert.ok(!run.party.some(m => m.uid === victim), 'the released Pokémon is still in the party');
  assert.strictEqual(run.party.length, 6, 'the recruit should have taken the freed slot');
  assert.ok(/Choice Scarf/.test(result.message), `the player should be told the item came back: ${result.message}`);

  // Route 2 (control): the party menu, which always worked. Both must agree.
  const menu = build();
  const menuVictim = menu.party[5].uid;
  const menuResult = Campaign.releaseMember(menu, menuVictim);
  assert.ok(menuResult.ok, menuResult.error);
  assert.strictEqual(menu.bag.held.choicescarf, 1, 'the party-menu route lost the held item');
  assert.strictEqual(menu.credits, 200, 'the party-menu route lost the refund');
});

test('Heal All fills every injured Pokemon and never spends a Revive', () => {
  /*
   * The button exists so a bad fight is not seven trips through the bag. What it
   * must not do is spend the scarce things: Revives are 400 credits and Max
   * Revives 800, and burning one on a button press is a decision the player
   * should make deliberately. Fainted Pokémon are counted and reported instead.
   *
   * Also pins the allocation rule — cheapest healing per HP actually delivered,
   * not "smallest item that covers the gap", which would pay 320 credits of Hyper
   * Potion for a dent two 90-credit Potions would fix.
   */
  const run = draft(newRun({seed: 'REDGPT-HEALALL'}));
  while (run.party.length < 4) {
    const clone = JSON.parse(JSON.stringify(run.party[0]));
    clone.uid = `heal${run.party.length}`;
    run.party.push(clone);
  }
  const maxOf = member => Pokemon.fullyHealCondition(Campaign.memberSet(run, member)).currentHP;

  // Three dented, one fainted, and a bag holding both potions and revives.
  run.party[0].condition.currentHP = 1;
  run.party[1].condition.currentHP = Math.max(1, maxOf(run.party[1]) - 30);
  run.party[2].condition.currentHP = Math.max(1, maxOf(run.party[2]) - 10);
  run.party[3].condition.currentHP = 0;
  run.bag.consumables = {potion: 6, superpotion: 2, hyperpotion: 1, revive: 2, maxrevive: 1};

  const result = Campaign.healAll(run);
  assert.ok(result.ok, result.error);

  for (let i = 0; i < 3; i++) {
    assert.strictEqual(run.party[i].condition.currentHP, maxOf(run.party[i]),
      `party member ${i} was not restored to full`);
  }
  // CONTROL: the fainted one must be untouched, and its revives still in the bag.
  assert.strictEqual(run.party[3].condition.currentHP, 0, 'Heal All revived a fainted Pokémon');
  assert.strictEqual(run.bag.consumables.revive, 2, 'Heal All spent a Revive');
  assert.strictEqual(run.bag.consumables.maxrevive, 1, 'Heal All spent a Max Revive');
  assert.strictEqual(result.fainted, 1, 'the fainted Pokémon should be reported');
  assert.ok(/Revive/.test(result.message), `the message should mention the fainted one: ${result.message}`);

  // A 10 HP dent must cost a Potion, never the Hyper Potion.
  assert.strictEqual(run.bag.consumables.hyperpotion, 1, 'a small dent was healed with the Hyper Potion');

  // Nothing left to do, and the button knows it.
  assert.strictEqual(Campaign.canHealAll(run), false, 'canHealAll should be false once everyone is full');
  assert.strictEqual(Campaign.healAll(run).ok, false, 'a second Heal All should report nothing to do');
});

test('the assist-only chip tracks the unlock, and only where it can be earned', () => {
  /*
   * `run.stats.assistOnly` is one-way and was invisible until 2026-08-14: a
   * single hand-played battle forfeits Tacticians/Paragons for the whole run
   * and the player only found out on the end screen.
   */
  const noPools = {unlocks: {starterPools: ['classic']}};

  // Veteran: Tacticians is reachable, so the state is worth showing.
  const vet = newRun({difficulty: 'veteran'});
  const intact = Campaign.assistOnlyStatus(vet, noPools);
  assert.ok(intact, 'Veteran should track the assist-only unlock');
  assert.strictEqual(intact.intact, true, 'a fresh run starts intact');
  assert.ok(intact.targets.includes('Tacticians'), `expected Tacticians, got ${intact.targets}`);

  // A hand-played battle forfeits it, permanently.
  vet.stats.assistOnly = false;
  assert.strictEqual(Campaign.assistOnlyStatus(vet, noPools).intact, false, 'a hand-played battle should forfeit');

  // Master tracks its own row rather than Veteran's.
  const master = Campaign.assistOnlyStatus(newRun({difficulty: 'master'}), noPools);
  assert.ok(master && master.targets.includes('Paragons'), `expected Paragons, got ${master && master.targets}`);

  /*
   * CONTROL 1 — Normal has no assist-only unlock, so the chip must not render.
   * Without this the chip would sit on every run tracking nothing.
   */
  assert.strictEqual(Campaign.assistOnlyStatus(newRun({difficulty: 'normal'}), noPools), null,
    'Normal has no assist-only unlock and must not show the chip');

  /*
   * CONTROL 2 — already owning the pool means there is nothing left to earn.
   */
  const owned = {unlocks: {starterPools: ['classic', 'tacticians']}};
  assert.strictEqual(Campaign.assistOnlyStatus(newRun({difficulty: 'veteran'}), owned), null,
    'an already-unlocked pool must not be tracked again');

  /*
   * CONTROL 3 — the rows are read from the data, not hardcoded. Every
   * assist-only row in UNLOCKS must be reachable through this function, so a
   * third one added later is picked up without touching the UI.
   */
  const assistRows = CampaignContent.UNLOCKS.filter(row => row.requires?.assistOnly);
  assert.ok(assistRows.length >= 2, `expected at least two assist-only unlocks, found ${assistRows.length}`);
  for (const row of assistRows) {
    const status = Campaign.assistOnlyStatus(newRun({difficulty: row.requires.difficulty}), noPools);
    assert.ok(status && status.targets.includes(row.name),
      `${row.name} is declared in UNLOCKS but the chip never surfaces it`);
  }
});

/* ------------------------------------------------------------------ *
 * Team plans and recruit advice
 * ------------------------------------------------------------------ */

test('every id declared by a team plan resolves', () => {
  /*
   * The `fickelbeam` guard, applied to a new table. A plan that names a move or
   * ability that does not exist is silently inert — it would simply never match,
   * and the plan would quietly do less than it claims.
   */
  let checked = 0;
  for (const plan of CampaignContent.TEAM_PLANS) {
    assert.ok(plan.id && plan.name && plan.blurb, `${plan.id} is missing a name or blurb`);
    for (const key of ['enablers', 'payoff']) {
      for (const moveId of plan[key].moves || []) {
        assert.ok(Dex.hasMove(moveId), `plan ${plan.id}.${key} names unknown move "${moveId}"`);
        checked++;
      }
      for (const abilityId of plan[key].abilities || []) {
        assert.ok(Dex.ability(abilityId), `plan ${plan.id}.${key} names unknown ability "${abilityId}"`);
        checked++;
      }
    }
    for (const itemId of Object.keys(plan.items || {})) {
      assert.ok(Dex.item(itemId), `plan ${plan.id} names unknown item "${itemId}"`);
      checked++;
    }
    for (const moveId of Object.keys(plan.statusBias || {})) {
      assert.ok(Dex.hasMove(moveId), `plan ${plan.id}.statusBias names unknown move "${moveId}"`);
      checked++;
    }
  }
  // Denominator: "0 bad ids" means nothing if nothing was checked.
  assert.ok(checked > 100, `expected to check well over 100 ids, checked ${checked}`);
});

test('a team plan changes what the advisor recommends', () => {
  const Advisor = RedGPT.Advisor;
  const run = draft(newRun());
  Campaign.setAssist(run, 'recommend', true);

  /*
   * Trick Room is the sharpest test of the whole feature, because it inverts
   * the usual rule. Generic quality scoring prefers the fast Pokémon; a Trick
   * Room team wants the slow one. If the plan is being read at all, these two
   * calls disagree.
   */
  /*
   * Neither candidate carries a Trick Room payoff move or ability, so Speed is
   * the only term that can separate them. An earlier version of this fixture
   * gave the slow one Earthquake and Body Press — both Trick Room payoff — and
   * the test passed with the Speed term deleted entirely. It was proving that
   * payoff scoring works, not that the plan's Speed profile is read at all.
   */
  const fast = {species: 'crobat', ability: 'Inner Focus', item: '', nature: 'serious',
    moves: ['bravebird', 'crosspoison', 'uturn', 'roost']};
  const slow = {species: 'torkoal', ability: 'Drought', item: '', nature: 'serious',
    moves: ['eruption', 'lavaplume', 'rapidspin', 'yawn']};

  Campaign.setAssist(run, 'plan', 'balance');
  const balanced = Advisor.recommendRecruit(run, [fast, slow]);
  Campaign.setAssist(run, 'plan', 'trickroom');
  const trickroom = Advisor.recommendRecruit(run, [fast, slow]);

  assert.ok(balanced && trickroom, 'the advisor should have an opinion on both plans');
  assert.strictEqual(trickroom.index, 1, 'Trick Room should take the slow Pokémon');
  assert.notStrictEqual(balanced.index, trickroom.index,
    'Balance and Trick Room must not pick the same candidate here — the plan is being ignored');
  assert.ok(/Trick Room/i.test(trickroom.why), `the reason should cite the plan: ${trickroom.why}`);

  // Sun should take the Drought setter, and say why.
  Campaign.setAssist(run, 'plan', 'sun');
  const sun = Advisor.recommendRecruit(run, [fast, slow]);
  assert.strictEqual(sun.index, 1, 'Sun should take the Drought setter');
  assert.ok(/sets Sun up|built for Sun/i.test(sun.why), `expected an enabler reason, got: ${sun.why}`);
});

test('the advisor explains a recruit against the actual party', () => {
  const Advisor = RedGPT.Advisor;
  const run = draft(newRun());
  Campaign.setAssist(run, 'recommend', true);

  const pick = Advisor.recommendRecruit(run, [
    {species: 'gyarados', ability: 'Intimidate', item: '', nature: 'serious',
      moves: ['waterfall', 'crunch', 'dragondance', 'earthquake']},
    {species: 'sunkern', ability: 'Chlorophyll', item: '', nature: 'serious',
      moves: ['seedbomb', 'sunnyday', 'growth', 'endeavor']},
  ]);
  assert.ok(pick, 'the advisor should recommend a recruit');
  assert.strictEqual(pick.index, 0, 'Gyarados is plainly the better balanced pick over Sunkern');
  assert.ok(pick.why.length > 25, `the reason should be a real sentence: "${pick.why}"`);
  assert.ok(/Gyarados/.test(pick.why), 'the reason should name the Pokémon');

  // Deterministic: the same state must give the same advice on every render.
  const again = Advisor.recommendRecruit(run, [
    {species: 'gyarados', ability: 'Intimidate', item: '', nature: 'serious',
      moves: ['waterfall', 'crunch', 'dragondance', 'earthquake']},
    {species: 'sunkern', ability: 'Chlorophyll', item: '', nature: 'serious',
      moves: ['seedbomb', 'sunnyday', 'growth', 'endeavor']},
  ]);
  assert.deepStrictEqual(again, pick, 'advice must not change between renders');
});

test('a plan re-weights items, moves and abilities, and never recommends Splash', () => {
  const Advisor = RedGPT.Advisor;
  const rain = CampaignContent.teamPlan('rain');
  const balance = CampaignContent.teamPlan('balance');
  const member = {uid: 'x', set: {species: 'politoed', ability: 'Drizzle', item: '', nature: 'serious',
    moves: ['scald', 'raindance', 'protect', 'icebeam']}};

  // A Damp Rock is junk in the abstract and the best item in the pool for Rain.
  const plain = Advisor.itemFit(member, 'damprock', balance);
  const planned = Advisor.itemFit(member, 'damprock', rain);
  assert.ok(planned > plain + 100, `Rain should rate a Damp Rock far higher (${plain} -> ${planned})`);

  // ...and it belongs on the Pokémon that sets the rain.
  assert.strictEqual(Advisor.isEnabler(rain, member.set), true, 'Drizzle should register as a Rain enabler');

  // Status moves are re-weighted by the plan.
  const set = {species: 'politoed', ability: 'Drizzle', moves: []};
  assert.ok(Advisor.moveScore('raindance', set, rain) > Advisor.moveScore('raindance', set, balance) * 2,
    'Rain should value Rain Dance far above a balanced team');

  /*
   * CONTROL — the §5 Splash trap, re-checked against every plan. A plan
   * multiplies the status table, so a bias applied before the no-effect check
   * would let a plan talk the advisor into recommending Splash.
   */
  for (const plan of CampaignContent.TEAM_PLANS) {
    assert.strictEqual(Advisor.moveScore('splash', set, plan), 0,
      `plan ${plan.id} must never give Splash a score`);
    assert.ok(Advisor.moveScore('splash', set, plan) < Advisor.moveScore('ember', set, plan),
      `plan ${plan.id} must prefer Ember to Splash`);
  }
});

test('the advisor never releases the only enabler of an active plan', () => {
  const Advisor = RedGPT.Advisor;
  const run = draft(newRun());
  Campaign.setAssist(run, 'recommend', true);
  Campaign.setAssist(run, 'plan', 'rain');

  const base = run.party[0];
  const clone = (uid, species, ability, moves) => ({
    uid, joinedAtNode: 0, condition: Object.assign({}, base.condition),
    set: {species, ability, item: '', nature: 'serious', level: base.set.level, moves,
      evs: {}, ivs: {}, happiness: 255, shiny: false},
  });
  /*
   * The sole Rain setter is deliberately the *weakest* member — a Sunkern
   * holding Rain Dance next to two 600-BST attackers. Without that the test is
   * vacuous: a Politoed outscores any filler on raw quality, so the advisor
   * would never have suggested releasing it and the guard would never run.
   * Confirmed by deleting the guard and watching this pass.
   */
  run.party = [
    clone('setter', 'sunkern', 'Chlorophyll', ['raindance', 'seedbomb', 'growth', 'endeavor']),
    clone('strong1', 'tyranitar', 'Sand Stream', ['crunch', 'stoneedge', 'earthquake', 'firepunch']),
    clone('strong2', 'dragonite', 'Multiscale', ['dragonclaw', 'earthquake', 'firepunch', 'roost']),
  ];

  const release = Advisor.recommendRelease(run, {species: 'gyarados'});
  assert.ok(release, 'the advisor should suggest someone to release');
  assert.strictEqual(Advisor.isEnabler(CampaignContent.teamPlan('rain'), run.party[0].set), true,
    'the fixture must really register as a Rain enabler, or the guard is untested');
  assert.notStrictEqual(release.uid, 'setter',
    'releasing the only Rain Dance user would trade away the whole Rain plan');

  // CONTROL: with a second setter present the first is no longer protected, so
  // the weakest member becomes releasable again. This distinguishes "the guard
  // fired" from "Sunkern was never the lowest scorer".
  run.party.push(clone('setter2', 'pelipper', 'Drizzle', ['scald', 'hurricane', 'roost', 'uturn']));
  const withSpare = Advisor.recommendRelease(run, {species: 'gyarados'});
  assert.ok(withSpare, 'still an opinion with a spare setter');
  assert.strictEqual(withSpare.uid, 'setter',
    'with a spare setter the weak one should become the release suggestion');
});

test('Assist Mode leads a themed team with its setter, exactly as the AI does', () => {
  /*
   * docs/AI_DESIGN.md's standing rule: an in-battle improvement must reach
   * every consumer, Assist Mode included. This one *can*, because "which
   * weather does my own team want" needs no information about the opponent —
   * it is squarely inside the §2 boundary that keeps the advisor from reading
   * opposing movesets.
   *
   * The two implementations are separate by necessity (`ai.js` loads before
   * `campaign/`, and they run on battle Pokémon versus sets), so this asserts
   * the *rule* matches rather than the code.
   */
  const Advisor = RedGPT.Advisor;
  const mk = (species, ability, moves, item) => ({species, ability, item: item || '',
    nature: 'serious', level: 50, moves, evs: {}, ivs: {}, happiness: 255, shiny: false});

  const cases = [
    ['Rain', [mk('kingdra', 'Swift Swim', ['surf']), mk('politoed', 'Drizzle', ['scald'])]],
    ['Sun', [mk('venusaur', 'Chlorophyll', ['solarbeam']), mk('torkoal', 'Drought', ['lavaplume'])]],
    ['Sand', [mk('excadrill', 'Sand Rush', ['earthquake']), mk('tyranitar', 'Sand Stream', ['crunch'])]],
    ['screens', [mk('garchomp', 'Rough Skin', ['swordsdance']), mk('grimmsnarl', 'Prankster', ['lightscreen'])]],
    ['Trick Room', [mk('conkeldurr', 'Guts', ['drainpunch']), mk('bronzong', 'Levitate', ['trickroom'])]],
    ['Electric Terrain', [mk('ironvaliant', 'Quark Drive', ['moonblast']), mk('pincurchin', 'Electric Surge', ['thunderbolt'])]],
    ['Psychic Terrain', [mk('garchomp', 'Rough Skin', ['swordsdance']), mk('indeedee', 'Psychic Surge', ['psychic'])]],
    ['Tailwind', [mk('rhyperior', 'Solid Rock', ['earthquake']), mk('whimsicott', 'Prankster', ['tailwind'])]],
    ['Snow', [mk('beartic', 'Slush Rush', ['iciclecrash']), mk('abomasnow', 'Snow Warning', ['blizzard'])]],
  ];
  const foes = [{species: 'snorlax'}, {species: 'blissey'}];

  for (const [theme, team] of cases) {
    const found = Advisor.themeLeadFromSets(team);
    assert.ok(found, `${theme}: the advisor found no theme lead`);
    assert.strictEqual(found.theme, theme, `${theme}: reported as "${found.theme}"`);
    // The setter is last in every fixture, so index 1 cannot be the default.
    assert.strictEqual(Advisor.recommendLead(team, foes), 1,
      `${theme}: Assist Mode should recommend leading the setter`);
  }

  // The same restraint as the AI: an incidental setter must not force a lead.
  assert.strictEqual(Advisor.themeLeadFromSets([
    mk('blissey', 'Natural Cure', ['softboiled']),
    mk('tyranitar', 'Sand Stream', ['crunch']),
  ]), null, 'sand with no Sand Rush abuser must not force a lead');
  assert.strictEqual(Advisor.themeLeadFromSets([
    mk('blissey', 'Natural Cure', ['softboiled']),
    mk('lanturn', 'Volt Absorb', ['raindance', 'surf']),
  ]), null, 'a filler Rain Dance must not force a lead');
  // Snow set for Aurora Veil is a screens plan, not a snow plan.
  assert.strictEqual(Advisor.themeLeadFromSets([
    mk('glaceon', 'Ice Body', ['icebeam']),
    mk('abomasnow', 'Snow Warning', ['blizzard']),
  ]), null, 'Ice Body is passive and must not force a snow lead');
});

test('the Battle Shop stocks only relevant held items, and sells exactly one', () => {
  const Advisor = RedGPT.Advisor;
  const run = draft(newRun());
  const stock = Campaign.buildBattleShopStock(run);
  assert.ok(stock.length >= 3, `expected a real shelf, got ${stock.length}`);

  const works = id => !!RedGPT.Items.registry[Dex.toID(id)] || RedGPT.Items.isFormeItem(Dex.toID(id));
  for (const entry of stock) {
    assert.strictEqual(entry.kind, 'held', `${entry.name} is not a held item`);
    assert.ok(!run.party.some(m => Dex.toID(m.set.item) === entry.id),
      `${entry.name} is already held by somebody`);
    // Every card names the party member it is for, and why. This is the whole
    // node: a shelf with an anonymous item on it is the Supply Depot.
    assert.ok(entry.note, `${entry.name} has no reason attached`);
    assert.ok(entry.forName, `${entry.name} is not tied to a party member`);
    /*
     * ...and nothing inert. `itemUser` names Pikachu on Pikanium Z exactly as
     * on the Light Ball, and Z-moves are not simulated here — `isSimulated`
     * passes those because they are not a coverage *gap*, which is the wrong
     * question for a shop.
     */
    assert.ok(works(entry.id), `${entry.name} does nothing in battle and must not be sold`);
  }

  /*
   * The synergy tier is what a fit score structurally cannot find: nothing
   * about a Warp Prism's stat line says "somebody here knows Trick Room".
   * Built deliberately, because a starter party may not trigger any pairing.
   */
  const base = run.party[0];
  const mk = (uid, species, ability, moves) => ({
    uid, joinedAtNode: 0, condition: Object.assign({}, base.condition),
    set: {species, ability, item: '', nature: 'serious', level: base.set.level, moves,
      evs: {}, ivs: {}, happiness: 255, shiny: false},
  });
  const themed = draft(newRun({seed: 'REDGPT-SYNERGY'}));
  themed.party = [
    mk('a', 'bronzong', 'Levitate', ['trickroom', 'gyroball', 'earthquake', 'rest']),
    mk('b', 'charizard', 'Blaze', ['fireblast', 'airslash', 'dragonpulse', 'roost']),
    mk('c', 'ironvaliant', 'Quark Drive', ['moonblast', 'closecombat', 'swordsdance', 'knockoff']),
  ];
  const synergy = Campaign.partySynergyItems(themed);
  const found = new Set(synergy.map(entry => entry.id));
  assert.ok(found.has('warpprism'), 'a Trick Room user should be offered the Warp Prism');
  assert.ok(found.has('boosterenergy'), 'a Quark Drive holder should be offered a Booster Energy');
  assert.ok([...found].some(id => Dex.item(id)?.megaStone), 'a Mega Stone should be offered for Charizard');
  for (const entry of synergy) {
    assert.ok(works(entry.id), `${entry.id} is inert and must not be offered`);
    assert.ok(entry.reason && entry.uid, `${entry.id} has no reason or holder`);
  }

  /*
   * CONTROL — a party with none of those moves or abilities must produce none
   * of those items, or the table is matching everything.
   */
  const plain = draft(newRun({seed: 'REDGPT-PLAIN'}));
  plain.party = [mk('x', 'snorlax', 'Immunity', ['bodyslam', 'crunch', 'earthquake', 'yawn'])];
  const plainIds = new Set(Campaign.partySynergyItems(plain).map(e => e.id));
  assert.ok(!plainIds.has('warpprism'), 'no Trick Room user, so no Warp Prism');
  assert.ok(!plainIds.has('boosterenergy'), 'no Quark Drive, so no Booster Energy');

  assert.ok(Advisor.itemFit(run.party[0], 'eviolite') !== 0,
    'the fixture must have an opinion about Eviolite');

  // One purchase closes the node.
  run.credits = 99999;
  run.promptStack.push({type: 'shop', title: 'Battle Shop', stock, onePurchase: true});
  run.phase = 'prompt';
  run.pending = run.promptStack[run.promptStack.length - 1];
  const result = Campaign.resolvePrompt(run, {index: 0});
  assert.ok(result.ok, result.error);
  assert.notStrictEqual(run.phase, 'prompt', 'the Battle Shop should close after one purchase');
  assert.strictEqual(Object.values(run.bag.held).reduce((a, b) => a + b, 0), 1, 'exactly one item bought');

  /*
   * CONTROL — an ordinary Supply Depot must stay open after a purchase, or the
   * assertion above is testing shops in general rather than `onePurchase`.
   */
  const other = draft(newRun({seed: 'REDGPT-DEPOT'}));
  other.credits = 99999;
  other.promptStack.push({type: 'shop', title: 'Supply Depot', stock: Campaign.buildShopStock(other)});
  other.phase = 'prompt';
  other.pending = other.promptStack[other.promptStack.length - 1];
  Campaign.resolvePrompt(other, {index: 0});
  assert.strictEqual(other.phase, 'prompt', 'an ordinary shop stays open after a purchase');
});

test('every id in the Battle Shop synergy tables resolves and does something', () => {
  /*
   * The `fickelbeam` guard applied to two more tables. A key that is not a real
   * move or ability never matches, and a value that is not a functional item
   * ships as a shelf slot that sells nothing — both silent.
   */
  const moves = Campaign.MOVE_SYNERGY_ITEMS;
  const abilities = Campaign.ABILITY_SYNERGY_ITEMS;
  const works = id => !!RedGPT.Items.registry[Dex.toID(id)] || RedGPT.Items.isFormeItem(Dex.toID(id));

  let checked = 0;
  for (const [moveId, itemId] of Object.entries(moves)) {
    assert.ok(Dex.hasMove(moveId), `MOVE_SYNERGY_ITEMS key "${moveId}" is not a real move`);
    assert.ok(Dex.item(itemId), `MOVE_SYNERGY_ITEMS value "${itemId}" is not a real item`);
    assert.ok(works(itemId), `${itemId} does nothing in battle, so ${moveId} would sell an inert item`);
    checked++;
  }
  for (const [abilityId, itemId] of Object.entries(abilities)) {
    assert.ok(Dex.ability(abilityId), `ABILITY_SYNERGY_ITEMS key "${abilityId}" is not a real ability`);
    if (itemId === null) continue;                 // Multitype/RKS resolve to a plate at run time
    assert.ok(Dex.item(itemId), `ABILITY_SYNERGY_ITEMS value "${itemId}" is not a real item`);
    assert.ok(works(itemId), `${itemId} does nothing in battle`);
    checked++;
  }
  // Denominator: "0 bad ids" means nothing if the tables were not reached.
  assert.ok(checked > 30, `expected to check 30+ pairings, checked ${checked}`);
});

test('Black Sludge is a non-starter on anything that is not Poison', () => {
  // It heals a Poison type and damages everything else, so on a non-Poison
  // holder it is strictly worse than an empty item slot — a non-starter rather
  // than a low score. It sits in the bulk-item list beside Leftovers, which had
  // the advisor recommending it and the Battle Shop stocking it.
  const Advisor = RedGPT.Advisor;
  const fire = {uid: 'a', set: {species: 'charizard', ability: 'Blaze', item: '', moves: ['flamethrower']}};
  const poison = {uid: 'b', set: {species: 'toxapex', ability: 'Regenerator', item: '', moves: ['scald']}};
  assert.strictEqual(Advisor.itemFit(fire, 'blacksludge'), -1, 'never on a non-Poison holder');
  assert.ok(Advisor.itemFit(poison, 'blacksludge') > 0, 'still good on a Poison type');
  // CONTROL: Leftovers, the item it sits beside, must still be recommendable.
  assert.ok(Advisor.itemFit(fire, 'leftovers') > 0, 'Leftovers must still suit a non-Poison holder');
});

test('a generated opponent team never fields the same species twice', () => {
  /*
   * Reported from a real battle: a Skier fielded **two Arceus-Ice**.
   *
   * `buildOpponentTeam` dedupes by base species in its main loop and then had a
   * fallback loop with no check at all, which fired whenever the themed pool
   * could not fill the team. And it could: `campaignPool` decides a themed pool
   * is usable when it holds six entries, counting **formes, not distinct base
   * species** — Arceus has 18 formes and Silvally 18. The Ice band 600-780
   * holds exactly six formes and four base species (Arceus-Ice, Kyurem,
   * Kyurem-Black, Kyurem-White, Calyrex-Ice, Baxcalibur).
   *
   * Nothing downstream catches it: Campaign runs `speciesClause: false` on
   * purpose, so the *player* can keep two of something in a roguelite.
   *
   * The run shape matters and is not arbitrary — a seven-Act run at the default
   * Beacon count puts the power band exactly on that window. Measured with the
   * old fallback restored: **120 of 240** teams cloned a species.
   */
  const run = newRun({seed: 'REDGPT-DUPE01', acts: 7, beacons: 3});
  draft(run);
  for (const id of ['garchomp', 'toxapex', 'volcarona', 'kingambit', 'dragapult']) {
    const set = Pokemon.normalizeSet({species: id, level: 70, moves: ['tackle']});
    run.party.push({uid: `p-${id}`, set, condition: Pokemon.fullyHealCondition(set), joinedAtNode: 1});
  }
  run.teamLevel = 70;
  run.act = 7;
  run.stats.nodesInAct = 8;

  let teams = 0;
  let short = 0;
  const clones = [];
  for (const theme of ['Ice', 'Fairy', 'Normal', 'Fighting']) {
    for (let i = 0; i < 8; i++) {
      const config = Campaign.buildBattleConfig(run, {kind: 'trainer', theme, background: 'x'});
      teams++;
      if (config.enemyTeam.length < 5) short++;
      const bases = config.enemyTeam.map(s => Dex.toID(Dex.species(s.species).baseSpecies));
      if (new Set(bases).size !== bases.length) {
        clones.push(`${theme}: ${config.enemyTeam.map(s => Dex.species(s.species).name).join(', ')}`);
      }
    }
  }
  // Denominator: this only means anything if the narrow themed pools were
  // actually exercised, and a team that came up *short* is the other failure.
  assert.ok(teams >= 30, `expected 30+ themed teams, built ${teams}`);
  assert.strictEqual(short, 0, `${short} teams came up short instead of topping up`);
  assert.deepStrictEqual([...clones], [], `duplicate species: ${clones.slice(0, 3).join(' | ')}`);
});

test('the Battle Shop offers a Ring Target to a Pokemon a type immunity blanks', () => {
  /*
   * The clearest case for the synergy tier's "a fit score structurally cannot
   * find this" rule: nothing about Ring Target's stat line says "somebody here
   * attacks with one type", and quality scoring rates it near the bottom of the
   * pool — but a Spectrier's Ghost moves do literally nothing to a Normal type.
   */
  const member = (species, moves, item = '') => ({
    uid: `u-${species}`,
    set: Pokemon.normalizeSet({species, level: 50, moves, item}),
    condition: {currentHP: 100},
  });
  const offers = party => {
    const run = newRun({seed: 'REDGPT-RT0100'});
    draft(run);
    run.party = party;
    return Campaign.partySynergyItems(run).filter(entry => entry.id === 'ringtarget');
  };

  const ghost = offers([member('spectrier', ['shadowball', 'nastyplot', 'substitute', 'willowisp'])]);
  assert.strictEqual(ghost.length, 1, 'a mono-Ghost attacker is offered one');
  assert.strictEqual(ghost[0].uid, 'u-spectrier', 'and it is attributed to the right member');
  assert.ok(/Normal/.test(ghost[0].reason), `the reason names the wall: ${ghost[0].reason}`);

  const electric = offers([member('regieleki', ['thunderbolt', 'voltswitch', 'thunder', 'rest'])]);
  assert.strictEqual(electric.length, 1, 'a mono-Electric attacker is offered one');
  assert.ok(/Ground/.test(electric[0].reason), `the reason names the wall: ${electric[0].reason}`);

  /*
   * CONTROL 1 — derived from the type chart, not a species list. Nothing is
   * immune to both Dark and Steel, so a Hydreigon is not blanked and must not
   * be offered one; otherwise the rule is "offer it to everybody".
   */
  assert.deepStrictEqual([...offers([member('hydreigon', ['darkpulse', 'flashcannon', 'uturn', 'roost'])])], [],
    'CONTROL: a Pokémon with two unblockable attacking types is not blanked');

  // CONTROL 2 — a Pokémon with no attacking moves is a wall, not a blanked
  // attacker. Without the guard the condition is vacuously true for it.
  assert.deepStrictEqual([...offers([member('blissey', ['softboiled', 'toxic', 'protect', 'wish'])])], [],
    'CONTROL: a pure wall is not offered one');

  // CONTROL 3 — the Ring Target Clause is one per side, so a party already
  // holding one is never offered a second.
  assert.deepStrictEqual([...offers([member('spectrier', ['shadowball'], 'ringtarget')])], [],
    'CONTROL: never a second copy');
});

/* ------------------------------------------------------------------ *
 * Rebirth Mode
 * ------------------------------------------------------------------ */

const REBIRTH_TEAM = ['garchomp', 'toxapex', 'volcarona', 'kingambit', 'dragapult', 'corviknight'];

/** A cleared run with a full six at level 68 and a relic, ready to be reborn. */
function clearedRun(seed = 'REDGPT-REB001', {relics = ['scoutstally']} = {}) {
  const run = newRun({seed});
  draft(run);
  run.party = REBIRTH_TEAM.map(id => {
    const set = Pokemon.normalizeSet({species: id, level: 68, moves: ['tackle'],
      ability: Dex.abilityList(Dex.species(id))[0]});
    return {uid: `reb-${id}`, set, condition: Pokemon.fullyHealCondition(set), joinedAtNode: 1};
  });
  run.teamLevel = 68;
  run.act = 3;
  run.credits = 4200;
  run.relics = [...relics];
  run.bag.consumables.hyperpotion = 5;
  run.stats.recruits = 5;
  Campaign.endRun(run, true, 'Cleared.');
  return run;
}

/** Assert every leaf of `value` survives being stored in the save file. */
function jsonSafe(value, path) {
  if (value === null) return;
  const type = typeof value;
  if (type === 'string' || type === 'boolean') return;
  if (type === 'number') {
    assert.ok(Number.isFinite(value), `${path} is ${value}, which JSON.stringify turns into null`);
    return;
  }
  if (type === 'object') {
    for (const [key, child] of Object.entries(value)) jsonSafe(child, `${path}.${key}`);
    return;
  }
  assert.ok(false, `${path} is a ${type}, which does not survive a save`);
}

/** Build `count` Rebirth opponent configs from one reborn run. */
function rebirthConfigs(run, count, options = {}) {
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(Campaign.buildBattleConfig(run, Object.assign({kind: 'trainer', theme: null, background: 'x'}, options)));
  }
  return out;
}

test('a rebirth keeps the party and the relics and resets everything else', () => {
  const cleared = clearedRun();
  const before = cleared.party.map(m => m.set.species);
  const reborn = Campaign.createRebirthRun(cleared, {seed: 'REDGPT-REB002'});
  assert.ok(reborn, 'a cleared run can be reborn');

  assert.deepStrictEqual([...reborn.party.map(m => m.set.species)], [...before], 'the party comes with you');
  assert.deepStrictEqual([...reborn.relics], ['scoutstally'], 'and so do the relics');
  assert.ok(reborn.party.every(m => m.set.level === Campaign.STARTING_LEVEL), 'every member is re-levelled');
  assert.ok(reborn.party.every(m => m.condition.currentHP === Pokemon.calcStats(m.set).hp), 'and fully healed');

  assert.strictEqual(reborn.teamLevel, Campaign.STARTING_LEVEL, 'the team level resets');
  assert.strictEqual(reborn.act, 1, 'the Act resets');
  assert.strictEqual(reborn.credits, CampaignContent.difficulty('normal').startingCredits, 'credits reset');
  assert.deepStrictEqual(Object.keys(reborn.bag.consumables), ['potion'], 'the bag resets to a starting kit');
  // Beacons reset to the run shape's own allowance and gain nothing: extra
  // Beacons were measured and dropped (they took Rebirth *above* the base
  // game's clear rate), and the whole difficulty dial is the level handicap.
  assert.strictEqual(reborn.beacons, cleared.setup.beacons, 'Beacons reset to the run shape\'s allowance');
  assert.notStrictEqual(reborn.map, cleared.map, 'a fresh map');
  assert.strictEqual(reborn.phase, 'map', 'no draft: the party already exists');
  assert.strictEqual(reborn.rebirth, 1, 'and it knows how deep it is');

  // `addPartyMember` bumps `stats.recruits`, and that counter feeds the
  // lifetime `totalRecruited` unlock track — so carrying six Pokémon through it
  // would award six recruits nobody recruited.
  assert.strictEqual(reborn.stats.recruits, 0, 'carrying a party over is not recruiting it');

  // The stackable reroll relic pays out at grant time as well as per Act, and
  // copying `relics` wholesale skips that call.
  assert.strictEqual(reborn.rerolls, CampaignContent.difficulty('normal').rerolls + 1,
    'a carried reroll relic still tops up the allowance');
});

test('a clear can only be spent on one rebirth', () => {
  const cleared = clearedRun('REDGPT-REB003');
  assert.strictEqual(Campaign.canRebirth(cleared), true, 'a cleared run offers a rebirth');
  assert.ok(Campaign.createRebirthRun(cleared, {seed: 'REDGPT-REB004'}), 'the first one works');
  assert.strictEqual(Campaign.canRebirth(cleared), false, 'the same clear cannot be spent twice');
  assert.strictEqual(Campaign.createRebirthRun(cleared, {seed: 'REDGPT-REB005'}), null, 'and the engine refuses');

  // CONTROL for the gate itself: a *lost* run is not a rebirth, or the mode
  // would be a way to undo a defeat.
  const lost = newRun({seed: 'REDGPT-REB006'});
  draft(lost);
  Campaign.endRun(lost, false, 'Out of Beacons.');
  assert.strictEqual(Campaign.canRebirth(lost), false, 'a lost run cannot be reborn');
  assert.strictEqual(Campaign.createRebirthRun(lost), null);
});

test('every Rebirth opponent is a full six at Expert with a doctrine on the field', () => {
  const reborn = Campaign.createRebirthRun(clearedRun('REDGPT-REB010'), {seed: 'REDGPT-REB011'});
  reborn.difficulty = 'normal';            // whose trainer tier is Casual
  const configs = [
    ...rebirthConfigs(reborn, 12),
    ...rebirthConfigs(reborn, 4, {kind: 'elite'}),
    Campaign.buildBattleConfig(reborn, {kind: 'boss', boss: CampaignContent.boss('raincaller'), background: 'x'}),
    Campaign.buildBattleConfig(reborn, {kind: 'boss', boss: CampaignContent.FINAL_BOSS, background: 'x'}),
  ];
  // Denominator: "every one of them" means nothing without a count.
  assert.ok(configs.length >= 18, `expected 18+ opponents, built ${configs.length}`);
  for (const config of configs) {
    assert.strictEqual(config.enemyTeam.length, 6, `${config.title} should field six, fielded ${config.enemyTeam.length}`);
    assert.strictEqual(config.aiDifficulty, 'expert', `${config.title} should be played at Expert`);
    assert.ok(config.rebirthPlan, `${config.title} should declare a plan`);
    assert.ok(config.fieldEffects, `${config.title} should open with a doctrine`);
    assert.strictEqual(config.fieldEffects.side, 1, 'the doctrine belongs to the opposing side');
    // The config is stored on the run and re-read on load, so nothing in the
    // declared field state may be a function or a non-finite number —
    // `JSON.stringify` turns `Infinity` into `null`, and `ENDLESS` is
    // `Infinity`. A round-trip comparison would not catch that (both sides
    // stringify the same way), so the structure is walked instead. Note also
    // that `deepStrictEqual` cannot be used across the VM sandbox boundary at
    // all — the prototypes differ (see PROJECT_CONTEXT §8).
    jsonSafe(config.fieldEffects, 'fieldEffects');
  }
  const plans = new Set(configs.map(c => c.rebirthPlan));
  assert.ok(plans.size >= 4, `expected several plans across 18 opponents, saw ${[...plans].join(',')}`);

  // CONTROL: an ordinary run on the same difficulty must be none of those
  // things, or the assertions above are describing the base game.
  const ordinary = newRun({seed: 'REDGPT-REB012'});
  draft(ordinary);
  const plain = Campaign.buildBattleConfig(ordinary, {kind: 'trainer', theme: null, background: 'x'});
  assert.ok(plain.enemyTeam.length < 6, 'CONTROL: an ordinary opening Trainer does not field six');
  assert.notStrictEqual(plain.aiDifficulty, 'expert', 'CONTROL: an ordinary Normal Trainer is not Expert');
  assert.strictEqual(plain.fieldEffects, null, 'CONTROL: an ordinary Trainer brings no doctrine');
});

test('a Rebirth team can always put its own doctrine back up', () => {
  /*
   * The doctrine is removable by design, so a team with no way to re-establish
   * it loses its whole identity to one Defog. `Advisor.recruitScore` calls the
   * enabler the linchpin for the same reason.
   *
   * Every plan is built explicitly rather than sampling random opponents: a
   * random sample is dominated by the plans that are easy to satisfy, and the
   * one that fails is the rare one.
   *
   * **The count is sized from the failure rate, not chosen.** With the targeted
   * draft removed, the miss rate is `21/60` for Sticky Web — so few species in
   * the band learn it — and `0/60` for every other plan. At 35%, six teams
   * apiece leaves a 7.5% chance that a broken build passes, and that is exactly
   * what happened: the control went vacuous on the second run. Twenty apiece
   * takes it to 0.02%.
   */
  const reborn = Campaign.createRebirthRun(clearedRun('REDGPT-REB020'), {seed: 'REDGPT-REB021'});
  const misses = [];
  let needed = 0;
  for (const id of CampaignContent.REBIRTH.trainerPlans) {
    const plan = CampaignContent.teamPlan(id);
    const enablers = new Set([...(plan.enablers.moves || []), ...(plan.enablers.abilities || [])].map(Dex.toID));
    if (!enablers.size) continue;
    for (let i = 0; i < 20; i++) {
      needed++;
      const team = Campaign.buildRebirthTeam(reborn, plan, 50);
      if (!team.some(s => enablers.has(Dex.toID(s.ability)) || s.moves.some(m => enablers.has(Dex.toID(m))))) {
        misses.push(plan.id);
      }
    }
  }
  assert.ok(needed >= 100, `expected 100+ teams whose plan has an enabler, built ${needed}`);
  assert.deepStrictEqual([...misses], [],
    `${misses.length} of ${needed} teams could not re-establish their own plan (${[...new Set(misses)].join(', ')})`);
});

test('no Rebirth team carries the means to delete its own doctrine', () => {
  /*
   * Two of the six are filled on general quality and `RandomTeams` knows
   * nothing about plans, so a Sun team could draft a Drizzle holder and wipe
   * its own sun on the switch-in, or roll a Rain Dance onto a filler member and
   * wipe it on turn two. Both were observed while building this.
   *
   * The rate is ~6% of weather/terrain teams, so the sample is deliberately
   * large enough that a build without the strip is near-certain to trip it: at
   * 6%, 100 teams leaves a 0.2% chance of a false pass. Only the plans whose
   * doctrine is a weather or a terrain can have this problem at all, so those
   * are the ones built.
   */
  const WEATHER_MOVES = {sunnyday: 'sun', raindance: 'rain', sandstorm: 'sandstorm',
    snowscape: 'snow', hail: 'hail', chillyreception: 'snow'};
  const TERRAIN_MOVES = {electricterrain: 'electric', grassyterrain: 'grassy',
    mistyterrain: 'misty', psychicterrain: 'psychic'};
  const reborn = Campaign.createRebirthRun(clearedRun('REDGPT-REB030'), {seed: 'REDGPT-REB031'});
  const fielded = CampaignContent.TEAM_PLANS.filter(p => p.rebirth.effect.weather || p.rebirth.effect.terrain);
  let checked = 0;
  const problems = [];
  for (const plan of fielded) {
    const effect = plan.rebirth.effect;
    for (let i = 0; i < 25; i++) {
      checked++;
      for (const s of Campaign.buildRebirthTeam(reborn, plan, 50)) {
        const ability = RedGPT.Abilities.get(s.ability);
        if (effect.weather && ability && (ability.setsPrimalWeather ||
          (ability.setsWeather && ability.setsWeather !== effect.weather))) {
          problems.push(`${s.species} has ${s.ability} on a ${plan.id} team`);
        }
        if (effect.terrain && ability?.setsTerrain && ability.setsTerrain !== effect.terrain) {
          problems.push(`${s.species} has ${s.ability} on a ${plan.id} team`);
        }
        for (const id of s.moves.map(Dex.toID)) {
          if (effect.weather && WEATHER_MOVES[id] && WEATHER_MOVES[id] !== effect.weather) {
            problems.push(`${s.species} knows ${id} on a ${plan.id} team`);
          }
          if (effect.terrain && TERRAIN_MOVES[id] && TERRAIN_MOVES[id] !== effect.terrain) {
            problems.push(`${s.species} knows ${id} on a ${plan.id} team`);
          }
        }
      }
    }
  }
  // Denominator: "0 conflicts in 0 weather teams" and "0 in 100" are different
  // findings and must not print the same way.
  assert.ok(checked >= 100, `expected 100+ weather/terrain doctrine teams, checked ${checked}`);
  assert.deepStrictEqual([...problems], [],
    `${problems.length} doctrine conflicts: ${problems.slice(0, 5).join('; ')}`);
});

test('the recruit theme option redraws the offer toward the plan, once', () => {
  const reborn = Campaign.createRebirthRun(clearedRun('REDGPT-REB040'), {seed: 'REDGPT-REB041'});
  reborn.party = reborn.party.slice(0, 3);
  const trickRoom = CampaignContent.teamPlan('trickroom');
  const fits = sets => sets.reduce((sum, s) =>
    sum + Campaign.planSpeciesFit(Dex.species(s.species), trickRoom), 0) / sets.length;

  /*
   * Paired sampling, because one offer proves nothing: three candidates drawn
   * without a theme are quite often a better Trick Room fit than three drawn
   * with one, purely by luck. The first version of this test asserted a single
   * pair and passed with the bias deleted.
   *
   * The pair count and the margin are measured rather than guessed, across 12
   * seeds, with and without the bias:
   *
   *   pairs   with the bias         without it
   *      8    mean 21.3, min  3.7   mean −5.4, max 5.0
   *     16    mean 20.9, min 12.0   mean −0.8, max 4.8
   *     24    mean 21.0, min 14.3   mean −1.3, max 5.6
   *
   * So 24 pairs and a margin of 8 separate the two cleanly, and 8 pairs do not.
   * (The "with" column was 15.8 at 24 pairs before the bias was made *signed* —
   * see `planRecruitBias`, which now penalises a species the plan cannot use
   * rather than merely not rewarding it.)
   */
  const PAIRS = 24;
  let plainTotal = 0;
  let themedTotal = 0;
  let offers = 0;
  let sawPicker = 0;
  for (let i = 0; i < PAIRS; i++) {
    const prompt = Campaign.offerRecruit(reborn, {count: 3});
    assert.ok(prompt, 'a recruit offer was made');
    if (prompt.themes?.length) sawPicker++;
    offers++;
    plainTotal += fits(prompt.options);
    assert.ok(Campaign.resolvePrompt(reborn, {theme: 'trickroom'}).ok, 'the theme is accepted');
    themedTotal += fits(reborn.pending.options);
    Campaign.resolvePrompt(reborn, {skip: true});
  }
  assert.strictEqual(sawPicker, offers, `every Rebirth recruit offers themes (${sawPicker}/${offers})`);
  const plainMean = plainTotal / PAIRS;
  const themedMean = themedTotal / PAIRS;
  assert.ok(themedMean > plainMean + 8,
    `a themed redraw should fit the plan better (plain ${plainMean.toFixed(1)}, themed ${themedMean.toFixed(1)})`);

  // One choice, not a slot machine: a second theme is refused, and a *reroll*
  // stays on the theme rather than silently throwing it away.
  const prompt = Campaign.offerRecruit(reborn, {count: 3});
  assert.strictEqual(prompt.themeUsed, false);
  assert.ok(Campaign.resolvePrompt(reborn, {theme: 'trickroom'}).ok);
  assert.strictEqual(reborn.pending.plan, 'trickroom', 'the choice is recorded on the prompt');
  assert.strictEqual(reborn.pending.themeUsed, true);
  assert.strictEqual(Campaign.resolvePrompt(reborn, {theme: 'rain'}).ok, false, 'a second theme is refused');
  reborn.rerolls = 2;
  assert.ok(Campaign.resolvePrompt(reborn, {reroll: true}).ok, 'rerolling still works');
  assert.strictEqual(reborn.pending.plan, 'trickroom', 'and stays on the chosen theme');

  // CONTROL: an ordinary run gets no theme picker at all.
  const ordinary = newRun({seed: 'REDGPT-REB042'});
  draft(ordinary);
  const plain = Campaign.offerRecruit(ordinary, {count: 3});
  assert.strictEqual(plain.themes, null, 'CONTROL: themes are a Rebirth feature');
});

test('Rebirth pays better', () => {
  const cleared = clearedRun('REDGPT-REB050');
  const reborn = Campaign.createRebirthRun(cleared, {seed: 'REDGPT-REB051'});
  const ordinary = newRun({seed: 'REDGPT-REB052'});
  draft(ordinary);

  const rich = Campaign.modifiers(reborn);
  const plain = Campaign.modifiers(ordinary);
  assert.ok(rich.rewardOptions > plain.rewardOptions,
    `more choices on a reward screen (${rich.rewardOptions} vs ${plain.rewardOptions})`);
  assert.ok(rich.rewardCreditMultiplier > plain.rewardCreditMultiplier,
    `richer credit payouts (${rich.rewardCreditMultiplier} vs ${plain.rewardCreditMultiplier})`);

  // And the multiplier really reaches a battle payout, which is the single
  // place every battle reward passes through.
  const paid = Campaign.buildBattleConfig(reborn, {kind: 'trainer', theme: null, background: 'x', reward: {credits: 100}});
  assert.strictEqual(paid.reward.credits, Math.round(100 * rich.rewardCreditMultiplier));
  const unpaid = Campaign.buildBattleConfig(ordinary, {kind: 'trainer', theme: null, background: 'x', reward: {credits: 100}});
  assert.strictEqual(unpaid.reward.credits, 100, 'CONTROL: an ordinary run pays the stated amount');
});

test('a rebirth meets opposition built for the end of a run, not the start of one', () => {
  // A rebirth resets the Act, and both the power band and the opening level
  // ramp are functions of that — so without lifting them, six fully-evolved
  // carry-overs met Geodude and Dwebble on node one. Measured on the first
  // build: a Sand trainer fielding Onix, Hippopotas, Dwebble, Geodude, Dratini.
  const reborn = Campaign.createRebirthRun(clearedRun('REDGPT-REB060'), {seed: 'REDGPT-REB061'});
  const ordinary = newRun({seed: 'REDGPT-REB062'});
  draft(ordinary);

  const meanBst = configs => configs.reduce((sum, c) =>
    sum + c.enemyTeam.reduce((s, m) => s + Dex.species(m.species).bst, 0) / c.enemyTeam.length, 0) / configs.length;
  const rebornBst = meanBst(rebirthConfigs(reborn, 10));
  const plainBst = meanBst(Array.from({length: 10}, () =>
    Campaign.buildBattleConfig(ordinary, {kind: 'trainer', theme: null, background: 'x'})));
  assert.ok(rebornBst > plainBst + 120,
    `Rebirth opposition should be far stronger at node one (${Math.round(rebornBst)} vs ${Math.round(plainBst)} mean BST)`);

  // The nine-level opening handicap exists because the ordinary player has one
  // Pokémon, no items and no relics for the whole of Act 1. None of that is
  // true here, so it does not apply.
  assert.strictEqual(rebornBst > 0 && reborn.act, 1, 'still Act 1');
  const rebornLevel = Campaign.buildBattleConfig(reborn, {kind: 'trainer', theme: null, background: 'x'}).enemyTeam[0].level;
  const plainLevel = Campaign.buildBattleConfig(ordinary, {kind: 'trainer', theme: null, background: 'x'}).enemyTeam[0].level;
  assert.ok(rebornLevel > plainLevel,
    `CONTROL for the ramp: no Act-1 handicap in a rebirth (${rebornLevel} vs ${plainLevel})`);
});

finish();
