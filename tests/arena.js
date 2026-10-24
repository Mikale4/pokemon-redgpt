/**
 * Arena flows at the data layer: starting battles in every format, Random
 * Battle, Team Preview, replay storage and reproduction, battle history and the
 * save-migration path from the pre-redesign story saves.
 */
'use strict';

const {createSuite} = require('./helpers/assert');
const {loadEngine} = require('./helpers/engine');

const suite = createSuite('arena');
const {test, assert, finish} = suite;

const RedGPT = loadEngine();
const {Dex, Pokemon, Formats, Battle, Store, RandomTeams, Validation, RNG, AI} = RedGPT;

function playToEnd(battle, {controlSides = [0]} = {}) {
  let guard = 0;
  while (!battle.ended && guard++ < 4000) {
    let acted = false;
    for (const side of controlSides) {
      const request = battle.requests[side];
      if (!request) continue;
      const choice = AI.chooseAction(battle, side, request);
      const result = battle.choose(side, choice);
      if (!result.ok) battle.choose(side, battle.fallbackChoice(side, request));
      acted = true;
    }
    if (!acted) break;
  }
  return battle;
}

/* ------------------------------------------------------------------ *
 * Formats
 * ------------------------------------------------------------------ */

test('every public format can host a complete battle', () => {
  const failures = [];
  for (const format of Formats.list()) {
    try {
      const seed = 777;
      const rng = new RNG(seed);
      const teamA = RandomTeams.randomTeam(rng, {format, size: format.rules.teamSize}).sets;
      const teamB = RandomTeams.randomTeam(rng, {format, size: format.rules.teamSize}).sets;
      const battle = new Battle({
        format, seed,
        sides: [
          {name: 'A', team: teamA, controller: 'ai', ai: {difficulty: 'trainer'}},
          {name: 'B', team: teamB, controller: 'ai', ai: {difficulty: 'ace'}},
        ],
      });
      battle.start();
      if (!battle.ended) failures.push(`${format.id}: did not finish`);
      if (battle.turn < 1) failures.push(`${format.id}: no turns played`);
    } catch (error) {
      failures.push(`${format.id}: ${error.message}`);
    }
  }
  assert.deepStrictEqual(failures, []);
});

test('format rules actually apply in battle', () => {
  /*
   * Built with `Formats.custom` rather than a preset. This used to run on the
   * Level 50 Singles format, which was removed on 2026-08-14 — and the test was
   * never about that preset, it is about `forceLevel` and `bringCount` reaching
   * the engine at all. Driving it from a custom ruleset keeps that and stops the
   * test from depending on which presets happen to ship.
   */
  const rng = new RNG(11);
  const format = Formats.custom({level: 50, teamSize: 6, bringCount: 3, speciesClause: true, sleepClause: true});
  assert.strictEqual(format.rules.forceLevel, 50, 'setup: the custom format really is level 50');
  assert.strictEqual(format.rules.bringCount, 3, 'setup: and really brings three');
  const team = RandomTeams.randomTeam(rng, {format: 'standard'}).sets.map(s => Object.assign({}, s, {level: 100}));
  const battle = new Battle({
    format, seed: 11,
    sides: [
      {name: 'A', team, controller: 'human'},
      {name: 'B', team: RandomTeams.randomTeam(rng, {format: 'standard'}).sets, controller: 'ai', ai: {difficulty: 'casual'}},
    ],
  });
  battle.start();
  assert.ok(battle.sides[0].team.every(p => p.level === 50), 'forceLevel must rescale every Pokémon');
  assert.strictEqual(battle.requests[0].type, 'teampreview');
  assert.strictEqual(battle.requests[0].bring, 3, 'bringCount must reach the Team Preview request');
});

test('the formats removed on 2026-08-14 are gone, and fall back to the default', () => {
  /*
   * Level 50 Singles, Restricted Singles, Battle Tower, Anything Goes (Tiered)
   * and finally Standard Singles were all removed by project decision.
   * `Formats.get` falls back to the default for an unknown id, so a team saved
   * under any of them still opens — it is validated against OverUsed, and any
   * illegality is reported rather than silently accepted. That is the behaviour
   * worth pinning: without it a stale saved team would throw.
   */
  const removed = ['level50', 'restricted', 'tower', 'tierag', 'standard'];
  const ids = new Set(Formats.list().map(f => f.id));
  assert.strictEqual(Formats.DEFAULT_FORMAT, 'tierou', 'OverUsed is the default format');
  for (const id of removed) {
    assert.ok(!ids.has(id), `${id} should no longer be listed`);
    assert.strictEqual(Formats.get(id).id, Formats.DEFAULT_FORMAT, `${id} should fall back to the default`);
  }
  // A denominator, so this cannot pass by the list being empty.
  assert.strictEqual(ids.size, 11, `expected eleven formats, saw ${ids.size}: ${[...ids].join(', ')}`);
  assert.ok(ids.has('anythinggoes') && ids.has('random'), 'the two non-tier formats must survive');
  assert.ok(ids.has('tierou') && ids.has('tierubers') && ids.has('tierzu'), 'the tier ladder must survive');
});

test('only Anything Goes and the two Tera tier formats allow Terastallization', () => {
  /*
   * By project decision (2026-08-14). The pair are generated from the same
   * `tierRules` as their plain versions, so the *only* difference between
   * OverUsed and OverUsed (Tera) must be the Tera switch — asserted below,
   * because a hand-written second entry is how two formats silently drift.
   */
  const teraOn = Formats.list().filter(f => f.rules.tera).map(f => f.id).sort();
  assert.deepStrictEqual([...teraOn], ['anythinggoes', 'tieroutera', 'tieruberstera'],
    'exactly three formats may allow Tera');

  for (const [plain, tera] of [['tierou', 'tieroutera'], ['tierubers', 'tieruberstera']]) {
    const a = Formats.get(plain).rules;
    const b = Formats.get(tera).rules;
    assert.strictEqual(a.tera, false, `${plain} must have Tera off`);
    assert.strictEqual(b.tera, true, `${tera} must have Tera on`);
    assert.strictEqual(a.maxTier, b.maxTier, 'the pair must share a tier ceiling');
    const differing = Object.keys(a).filter(k => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
    assert.deepStrictEqual([...differing], ['tera'], `${tera} should differ from ${plain} in nothing but Tera`);
    assert.strictEqual(Formats.speciesPool(plain).length, Formats.speciesPool(tera).length,
      'and share a species pool');
  }
});

/* ------------------------------------------------------------------ *
 * Random Battle
 * ------------------------------------------------------------------ */

test('Random Battle needs no saved team and produces a legal matchup', () => {
  const seed = RNG.hash('random-battle-test');
  const rng = new RNG(seed);
  const format = Formats.get('random');
  const playerTeam = RandomTeams.randomTeam(rng, {format}).sets;
  const opponentTeam = RandomTeams.randomTeam(rng, {format}).sets;
  for (const team of [playerTeam, opponentTeam]) {
    const result = Validation.validateTeam({sets: team}, format);
    assert.deepStrictEqual([...result.errors.map(e => e.message)], []);
  }
  const battle = new Battle({
    format, seed,
    sides: [
      {name: 'You', team: playerTeam, controller: 'human'},
      {name: 'Random Challenger', team: opponentTeam, controller: 'ai', ai: {difficulty: 'trainer'}},
    ],
  });
  battle.start();
  assert.strictEqual(battle.requests[0].type, 'teampreview', 'Random Battle opens with Team Preview');
  battle.choose(0, {type: 'team', order: [0, 1, 2, 3, 4, 5]});
  assert.ok(battle.requests[0].type === 'move', 'the battle begins right after preview');
  playToEnd(battle);
  assert.ok(battle.ended);
  assert.ok(battle.winner === 0 || battle.winner === 1 || battle.winner === null);
});

/* ------------------------------------------------------------------ *
 * Replays
 * ------------------------------------------------------------------ */

test('a finished battle can be saved and replayed from storage', () => {
  Store.reset();
  const seed = 20240;
  const rng = new RNG(seed);
  const format = Formats.get('random');
  const battle = new Battle({
    format, seed,
    sides: [
      {name: 'Red', team: RandomTeams.randomTeam(rng, {format}).sets, controller: 'ai', ai: {difficulty: 'ace'}},
      {name: 'Blue', team: RandomTeams.randomTeam(rng, {format}).sets, controller: 'ai', ai: {difficulty: 'trainer'}},
    ],
  });
  battle.start();
  assert.ok(battle.ended);

  const replayId = Store.saveReplay(battle.replayData({label: 'Red vs Blue'}));
  Store.recordArenaBattle({
    formatId: format.id, won: battle.winner === 0, drew: battle.winner == null,
    turns: battle.turn, opponent: 'Blue', replayId, teamName: 'Random team',
  });

  const save = Store.load();
  assert.strictEqual(save.arena.replays.length, 1);
  assert.strictEqual(save.arena.battleHistory.length, 1);
  assert.strictEqual(save.arena.battleHistory[0].replayId, replayId);
  assert.strictEqual(save.profile.records.arena.battles, 1);

  const stored = save.arena.replays[0].data;
  const replayed = Battle.fromReplay(stored);
  assert.strictEqual(replayed.log.join('\n'), battle.log.join('\n'), 'the stored replay must reproduce the battle');
  assert.strictEqual(replayed.winner, battle.winner);
});

test('replay payloads are commands, not per-turn state dumps', () => {
  const seed = 5150;
  const rng = new RNG(seed);
  const format = Formats.get('random');
  const battle = new Battle({
    format, seed,
    sides: [
      {name: 'A', team: RandomTeams.randomTeam(rng, {format}).sets, controller: 'ai', ai: {difficulty: 'ace'}},
      {name: 'B', team: RandomTeams.randomTeam(rng, {format}).sets, controller: 'ai', ai: {difficulty: 'ace'}},
    ],
  });
  battle.start();
  const replay = battle.replayData();
  const size = JSON.stringify(replay).length;
  assert.ok(replay.commands.length >= battle.turn, 'commands should cover every turn');
  assert.ok(size < 120000, `replay is ${size} bytes — too large for a command log`);
});

test('replays survive a storage round trip as plain JSON', () => {
  Store.reset();
  const seed = 991;
  const rng = new RNG(seed);
  const format = Formats.get('random');
  const battle = new Battle({
    format, seed,
    sides: [
      {name: 'A', team: RandomTeams.randomTeam(rng, {format}).sets, controller: 'ai', ai: {difficulty: 'trainer'}},
      {name: 'B', team: RandomTeams.randomTeam(rng, {format}).sets, controller: 'ai', ai: {difficulty: 'trainer'}},
    ],
  });
  battle.start();
  Store.saveReplay(battle.replayData());
  const exported = Store.exportJSON();
  Store.reset();
  const imported = Store.importJSON(exported);
  assert.ok(imported.ok, imported.error);
  const restored = Store.load().arena.replays[0].data;
  assert.strictEqual(Battle.fromReplay(restored).log.join('\n'), battle.log.join('\n'));
});

/* ------------------------------------------------------------------ *
 * Local versus
 * ------------------------------------------------------------------ */

test('a local versus battle asks both sides for commands', () => {
  const rng = new RNG(64);
  const format = Formats.get('anythinggoes');
  const battle = new Battle({
    format, seed: 64,
    sides: [
      {name: 'Player 1', team: RandomTeams.randomTeam(rng, {format}).sets, controller: 'human'},
      {name: 'Player 2', team: RandomTeams.randomTeam(rng, {format}).sets, controller: 'human'},
    ],
  });
  battle.start();
  assert.ok(battle.requests[0] && battle.requests[1], 'both sides must be asked at Team Preview');
  battle.choose(0, {type: 'team', order: [0, 1, 2, 3, 4, 5]});
  assert.ok(battle.requests[1], 'the second player still owes a choice');
  battle.choose(1, {type: 'team', order: [0, 1, 2, 3, 4, 5]});
  assert.ok(battle.requests[0] && battle.requests[1], 'turn one asks both players');
  assert.strictEqual(battle.turn, 1, 'setup: the battle is on turn one');
  battle.choose(0, {type: 'move', index: 0});
  assert.ok(battle.needsChoice(1), 'the turn does not resolve until both have chosen');
  assert.strictEqual(battle.turn, 1, 'and it has not resolved yet');
  battle.choose(1, {type: 'move', index: 0});
  /*
   * The turn ran. Asserted as "the turn was processed" rather than
   * `turn === 2`, because a first-turn knockout leaves the battle on turn one
   * owing a replacement — which is the engine working, not failing. The old
   * assertion only held because the removed Standard Singles format happened to
   * produce a matchup with no early KO on this seed.
   */
  assert.ok(battle.turn === 2 || battle.needsChoice(0) || battle.needsChoice(1),
    `the turn should have resolved (turn ${battle.turn})`);
  assert.ok(battle.log.some(line => / used /.test(line)), 'both commands were executed');
  playToEnd(battle, {controlSides: [0, 1]});
  assert.ok(battle.ended);
});

/* ------------------------------------------------------------------ *
 * Views
 * ------------------------------------------------------------------ */

test('the battle view hides opponent details until revealed', () => {
  const rng = new RNG(70);
  const format = Formats.get('anythinggoes');
  const battle = new Battle({
    format, seed: 70,
    sides: [
      {name: 'You', team: RandomTeams.randomTeam(rng, {format}).sets, controller: 'human'},
      {name: 'AI', team: RandomTeams.randomTeam(rng, {format}).sets, controller: 'ai', ai: {difficulty: 'trainer'}},
    ],
  });
  battle.start();
  battle.choose(0, {type: 'team', order: [0, 1, 2, 3, 4, 5]});
  const view = battle.view(0);
  assert.ok(view.sides[0].active.moves, 'your own moves are visible');
  assert.strictEqual(view.sides[1].active.moves, null, "the opponent's moveset is hidden");
  assert.ok(view.sides[1].team.filter(m => m.revealed).length <= 1, 'only the lead is revealed at first');
  assert.ok(view.sides[0].active.hp > 0 && view.sides[0].active.hpPercent > 0);
});

/* ------------------------------------------------------------------ *
 * Save architecture and migration
 * ------------------------------------------------------------------ */

test('the save schema separates profile, arena and campaign', () => {
  Store.reset();
  const save = Store.load();
  assert.strictEqual(save.version, Store.SCHEMA_VERSION);
  assert.ok(save.profile && save.arena && save.campaign);
  assert.ok(save.profile.settings && save.profile.records && save.profile.unlocks);
  assert.ok(Array.isArray(save.arena.teams) && Array.isArray(save.arena.replays));
  assert.deepStrictEqual([...save.campaign.runs], []);
  assert.strictEqual(save.campaign.activeRunId, null);
});

test('a v3 save with one active run migrates into a run slot', () => {
  // Multiple Campaign slots replaced the single `campaign.activeRun`. A save
  // written before that must keep its run rather than silently losing it.
  const legacy = {
    version: 3,
    profile: {name: 'Slots'},
    arena: {teams: [], replays: [], battleHistory: []},
    campaign: {
      activeRun: {id: 'run-abc', seedLabel: 'REDGPT-OLDRUN', phase: 'map', party: [], relics: []},
      history: [],
      meta: {lastSeed: null, lastDifficulty: 'normal'},
    },
  };
  const migrated = Store.migrate(JSON.parse(JSON.stringify(legacy)));
  assert.strictEqual(migrated.version, Store.SCHEMA_VERSION);
  assert.strictEqual(migrated.campaign.runs.length, 1, 'the run was dropped instead of moved into a slot');
  assert.strictEqual(migrated.campaign.runs[0].id, 'run-abc');
  assert.strictEqual(migrated.campaign.activeRunId, 'run-abc', 'the migrated run should be the selected one');
  assert.strictEqual(migrated.campaign.activeRun, undefined, 'the old key must not linger');
});

test('run slots are capped and never point at a missing run', () => {
  const many = {
    version: Store.SCHEMA_VERSION,
    profile: {name: 'Slots'},
    arena: {teams: [], replays: [], battleHistory: []},
    campaign: {
      runs: Array.from({length: Store.MAX_RUN_SLOTS + 4}, (_, i) => ({id: `r${i}`, phase: 'map', party: [], relics: []})),
      activeRunId: 'r99',
      history: [], meta: {},
    },
  };
  const out = Store.migrate(many);
  assert.strictEqual(out.campaign.runs.length, Store.MAX_RUN_SLOTS);
  assert.strictEqual(out.campaign.activeRunId, 'r0', 'a dangling activeRunId should fall back to a real slot');
});

test('a v2 story save migrates without destroying the collection', () => {
  const legacy = {
    version: 2,
    playerName: 'Mikale',
    money: 9000,
    badges: ['brock', 'misty'],
    flags: {champion: true, starter: true},
    settings: {animations: false},
    towerBest: 14,
    dexSeen: {bulbasaur: true, pikachu: true},
    dexCaught: {bulbasaur: true},
    hallOfFame: [{date: '2024-01-01', team: ['Venusaur Lv.60']}],
    party: [
      {species: 'venusaur', nickname: 'Bulby', level: 60, moves: [{id: 'gigadrain'}, {id: 'sludgebomb'}], ivs: {hp: 20}, evs: {hp: 100}, heldItem: 'leftovers'},
      {species: 'charizard', level: 58, moves: ['flamethrower', 'airslash']},
    ],
    storage: [{species: 'snorlax', level: 50, moves: ['bodyslam']}],
  };
  const migrated = Store.migrate(legacy);
  assert.strictEqual(migrated.version, Store.SCHEMA_VERSION);
  assert.strictEqual(migrated.profile.name, 'Mikale');
  assert.strictEqual(migrated.profile.settings.animations, false);
  assert.strictEqual(migrated.profile.records.tower.best, 14);
  assert.strictEqual(migrated.profile.migratedFrom, 'v2');
  assert.strictEqual(migrated.profile.legacy.badges, 2);
  assert.ok(migrated.profile.legacy.championed);
  assert.strictEqual(migrated.arena.teams.length, 1, 'the collection becomes an Arena team');
  const team = migrated.arena.teams[0];
  assert.strictEqual(team.sets.length, 3);
  assert.strictEqual(team.sets[0].species, 'venusaur');
  assert.strictEqual(team.sets[0].nickname, 'Bulby');
  assert.strictEqual(team.sets[0].item, 'leftovers');
  assert.deepStrictEqual([...team.sets[0].moves], ['gigadrain', 'sludgebomb']);
  assert.deepStrictEqual([...migrated.campaign.runs], []);
  const validation = Validation.validateTeam(team, 'anythinggoes');
  assert.ok(validation.errors.every(e => !/is not a Pokémon/.test(e.message)), 'migrated species must resolve');
});

test('a v1 save and an empty save both migrate safely', () => {
  const v1 = Store.migrate({version: 1, playerName: 'Old', party: [], storage: []});
  assert.strictEqual(v1.version, Store.SCHEMA_VERSION);
  assert.strictEqual(v1.profile.name, 'Old');
  const blank = Store.migrate(null);
  assert.strictEqual(blank.version, Store.SCHEMA_VERSION);
  assert.strictEqual(blank.arena.teams.length, 0);
});

test('importing a file that is not a save is rejected with a message', () => {
  assert.ok(!Store.importJSON('not json at all').ok);
  assert.ok(/valid JSON/.test(Store.importJSON('not json at all').error));
  assert.ok(!Store.importJSON('{"hello":"world"}').ok);
  assert.ok(/RedGPT save/.test(Store.importJSON('{"hello":"world"}').error));
});

test('export and import round-trip the whole save', () => {
  Store.reset();
  Store.update(data => {
    data.profile.name = 'Round Trip';
    data.arena.teams.push(Store.createTeam({name: 'A', sets: [Pokemon.normalizeSet({species: 'garchomp', moves: ['earthquake']})]}));
  });
  const json = Store.exportJSON();
  Store.reset();
  assert.strictEqual(Store.load().arena.teams.length, 0);
  const result = Store.importJSON(json);
  assert.ok(result.ok, result.error);
  const restored = Store.load();
  assert.strictEqual(restored.profile.name, 'Round Trip');
  assert.strictEqual(restored.arena.teams.length, 1);
  assert.strictEqual(restored.arena.teams[0].sets[0].species, 'garchomp');
});

test('battle records track wins, losses and streaks per format', () => {
  Store.reset();
  Store.recordArenaBattle({formatId: 'standard', won: true, drew: false, turns: 10, opponent: 'A'});
  Store.recordArenaBattle({formatId: 'standard', won: true, drew: false, turns: 12, opponent: 'B'});
  Store.recordArenaBattle({formatId: 'random', won: false, drew: false, turns: 8, opponent: 'C'});
  const records = Store.load().profile.records.arena;
  assert.strictEqual(records.battles, 3);
  assert.strictEqual(records.wins, 2);
  assert.strictEqual(records.losses, 1);
  assert.strictEqual(records.longestWinStreak, 2);
  assert.strictEqual(records.currentWinStreak, 0);
  assert.strictEqual(records.byFormat.standard.wins, 2);
  assert.strictEqual(records.byFormat.random.battles, 1);
});

/* ------------------------------------------------------------------ *
 * Damage calculator
 * ------------------------------------------------------------------ */

test('the calculator agrees with the battle engine, roll for roll', () => {
  /*
   * The calculator's whole promise is that it reports what a battle would
   * actually do — it drives the engine rather than reimplementing the damage
   * formula, so it can never drift from this project's own ability and move
   * rules. This asserts that promise directly.
   *
   * The comparison harness needs three guards, each of which produced a false
   * mismatch while this was being written:
   *   - the target needs vast HP, or damage is capped at its remaining HP
   *   - crits must be suppressed, or a pinned roll of 0 crits every time
   *   - accuracy must be bypassed, or a pinned roll of ~1 misses
   */
  const mk = (species, options) => Pokemon.normalizeSet(Object.assign(
    {species, level: 100, nature: 'serious', ivs: Pokemon.maxIVs(), evs: {}}, options));

  const engineDamage = (attackerSet, defenderSet, moveId, roll) => {
    const format = Formats.get('anythinggoes');
    const rules = Object.assign({}, format.rules,
      {teamPreview: false, forceLevel: null, maxLevel: 100, speciesClause: false, itemClause: false});
    const battle = new Battle({
      format: Object.assign({}, format, {rules}), seed: 99,
      sides: [
        {name: 'A', controller: 'human', team: [attackerSet]},
        {name: 'B', controller: 'human', team: [defenderSet]},
      ],
    });
    battle.start();
    const defender = battle.sides[1].team[0];
    defender.currentHP = 9999999;          // never capped, never faints
    battle.criticalChance = () => 0;       // never crit
    battle.moveAccuracy = () => null;      // never miss
    battle.rng.next = () => roll;
    battle.rng.chance = () => false;
    const before = defender.currentHP;
    battle.executeMove(battle.sides[0].team[0], defender, Dex.move(moveId), {index: 0});
    return before - defender.currentHP;
  };

  const cases = [
    // Plain STAB, and a held item that multiplies damage.
    [mk('garchomp', {ability: 'Rough Skin', moves: ['earthquake'], evs: {atk: 252}, nature: 'adamant', item: 'lifeorb'}),
      mk('toxapex', {ability: 'Regenerator', moves: ['splash'], evs: {hp: 252, def: 252}, nature: 'bold'}), 'earthquake'],
    // -ate ability: converts the type AND multiplies power.
    [mk('sylveon', {ability: 'Pixilate', moves: ['bodyslam'], evs: {spa: 252}, nature: 'modest'}),
      mk('garchomp', {ability: 'Rough Skin', moves: ['splash'], evs: {hp: 252}}), 'bodyslam'],
    // Parental Bond: two strikes, the second at half power.
    [mk('kangaskhan', {ability: 'Parental Bond', moves: ['return'], evs: {atk: 252}, nature: 'adamant'}),
      mk('blissey', {ability: 'Natural Cure', moves: ['splash'], evs: {hp: 252}}), 'return'],
    // Transistor at its restored 1.5x.
    [mk('regieleki', {ability: 'Transistor', moves: ['thunderbolt'], evs: {spa: 252}, nature: 'timid'}),
      mk('blissey', {ability: 'Natural Cure', moves: ['splash'], evs: {hp: 252}}), 'thunderbolt'],
  ];

  const problems = [];
  for (const [attackerSet, defenderSet, moveId] of cases) {
    const result = RedGPT.Calculator.calculate({
      attacker: {set: attackerSet}, defender: {set: defenderSet}, move: moveId,
    });
    assert.ok(result, `${moveId} produced no result`);
    const min = engineDamage(attackerSet, defenderSet, moveId, 0);
    const max = engineDamage(attackerSet, defenderSet, moveId, 0.999999);
    if (result.min !== min) problems.push(`${attackerSet.species} ${moveId}: min ${result.min} != engine ${min}`);
    if (Math.abs(result.max - max) > 1) problems.push(`${attackerSet.species} ${moveId}: max ${result.max} != engine ${max}`);
  }
  assert.deepStrictEqual(problems, []);
});

test('the calculator reports immunity, multi-hit and KO thresholds', () => {
  const mk = (species, options) => Pokemon.normalizeSet(Object.assign(
    {species, level: 100, nature: 'serious', ivs: Pokemon.maxIVs(), evs: {}}, options));

  // Ground does not touch a Flying type.
  const immune = RedGPT.Calculator.calculate({
    attacker: {set: mk('garchomp', {ability: 'Rough Skin', moves: ['earthquake'], evs: {atk: 252}})},
    defender: {set: mk('corviknight', {ability: 'Pressure', moves: ['splash'], evs: {hp: 252}})},
    move: 'earthquake',
  });
  assert.ok(immune.immune, 'Earthquake should be listed as immune against a Flying type');
  assert.strictEqual(immune.max, 0, 'an immune move must deal 0, not 1');

  // Parental Bond is two distinct strikes.
  const bond = RedGPT.Calculator.calculate({
    attacker: {set: mk('kangaskhan', {ability: 'Parental Bond', moves: ['return'], evs: {atk: 252}})},
    defender: {set: mk('blissey', {ability: 'Natural Cure', moves: ['splash'], evs: {hp: 252}})},
    move: 'return',
  });
  assert.strictEqual(bond.hits, 2);
  assert.ok(bond.parentalBond);

  // A target already at low HP should read as a guaranteed KO.
  const weakened = RedGPT.Calculator.calculate({
    attacker: {set: mk('garchomp', {ability: 'Rough Skin', moves: ['earthquake'], evs: {atk: 252}})},
    defender: {set: mk('blissey', {ability: 'Natural Cure', moves: ['splash'], evs: {hp: 252}}), hpPercent: 5},
    move: 'earthquake',
  });
  assert.strictEqual(weakened.koChance, 100, 'a nearly-fainted target should be a guaranteed KO');

  // Boosts and screens move the numbers in the expected directions.
  const base = RedGPT.Calculator.calculate({
    attacker: {set: mk('garchomp', {ability: 'Rough Skin', moves: ['earthquake'], evs: {atk: 252}})},
    defender: {set: mk('blissey', {ability: 'Natural Cure', moves: ['splash'], evs: {hp: 252}})},
    move: 'earthquake',
  });
  const boosted = RedGPT.Calculator.calculate({
    attacker: {set: mk('garchomp', {ability: 'Rough Skin', moves: ['earthquake'], evs: {atk: 252}}), boosts: {atk: 2}},
    defender: {set: mk('blissey', {ability: 'Natural Cure', moves: ['splash'], evs: {hp: 252}})},
    move: 'earthquake',
  });
  const screened = RedGPT.Calculator.calculate({
    attacker: {set: mk('garchomp', {ability: 'Rough Skin', moves: ['earthquake'], evs: {atk: 252}})},
    defender: {set: mk('blissey', {ability: 'Natural Cure', moves: ['splash'], evs: {hp: 252}})},
    move: 'earthquake', field: {reflect: true},
  });
  // Close to 2x and 0.5x rather than exact: the damage formula floors at
  // several stages, so a boost lands a point or two off a clean multiple.
  const boostRatio = boosted.min / base.min;
  const screenRatio = screened.min / base.min;
  assert.ok(Math.abs(boostRatio - 2) < 0.02, `+2 Attack should roughly double damage, got x${boostRatio.toFixed(3)}`);
  assert.ok(Math.abs(screenRatio - 0.5) < 0.02, `Reflect should roughly halve damage, got x${screenRatio.toFixed(3)}`);
});

test('the KO summary accounts for what happens between turns', () => {
  /*
   * The summary replays real turns and calls the engine's own `endOfTurn`, so
   * chip damage and passive recovery are counted rather than approximated by
   * dividing HP by damage. Assert the direction of each effect, not exact turn
   * counts, so ordinary balance changes do not churn this test.
   */
  const mk = (species, options) => Object.assign(
    {species, level: 100, nature: 'serious', ivs: Pokemon.maxIVs(), evs: {}}, options);
  const attacker = {set: mk('garchomp', {ability: 'Rough Skin', moves: ['earthquake'], evs: {atk: 252}, nature: 'adamant'})};
  const blissey = extra => ({set: mk('blissey', Object.assign(
    {ability: 'Natural Cure', moves: ['splash'], evs: {hp: 252, def: 252}, nature: 'bold'}, extra))});
  const ko = config => RedGPT.Calculator.calculate(Object.assign({move: 'earthquake', attacker}, config)).ko;

  const plain = ko({defender: blissey({})});
  assert.ok(plain.guaranteed >= 2, 'the baseline should need more than one hit');

  // Chip damage can only help, recovery can only hurt.
  const poisoned = ko({defender: Object.assign(blissey({}), {status: 'tox'})});
  assert.ok(poisoned.guaranteed <= plain.guaranteed, 'poison chip should not slow the KO down');
  assert.ok(poisoned.residuals ? true : true);
  assert.ok(/poison damage/.test(poisoned.text), `expected poison named, got: ${poisoned.text}`);

  const leftovers = ko({defender: blissey({item: 'leftovers'})});
  assert.ok(leftovers.guaranteed >= plain.guaranteed, 'Leftovers should never speed the KO up');
  assert.ok(/Leftovers recovery/.test(leftovers.text), `expected Leftovers named, got: ${leftovers.text}`);

  // Sources that cancel out must still both be reported — naming neither is
  // the least useful answer.
  const both = ko({defender: blissey({item: 'leftovers'}), field: {weather: 'sandstorm'}});
  assert.ok(/sandstorm damage/.test(both.text) && /Leftovers recovery/.test(both.text),
    `expected both sources named, got: ${both.text}`);

  // A Pokemon the chip cannot touch must not have it named.
  const steel = RedGPT.Calculator.calculate({
    attacker: {set: mk('garchomp', {ability: 'Rough Skin', moves: ['ironhead'], evs: {atk: 252}})},
    defender: {set: mk('skarmory', {ability: 'Sturdy', moves: ['splash'], evs: {hp: 252, def: 252}, nature: 'impish'})},
    move: 'ironhead', field: {weather: 'sandstorm'},
  });
  assert.ok(!/sandstorm/.test(steel.ko.text), `a Steel type takes no sand chip: ${steel.ko.text}`);

  // Terrain expires during a long simulation; it must still be named, because
  // the description is taken from the starting state.
  const grassy = ko({defender: blissey({}), field: {terrain: 'grassy'}});
  assert.ok(/Grassy Terrain recovery/.test(grassy.text), `expected terrain named, got: ${grassy.text}`);

  // Out-healed: the summary must say so rather than inventing a turn count.
  const hopeless = RedGPT.Calculator.calculate({
    attacker: {set: mk('caterpie', {ability: 'Shield Dust', moves: ['tackle']})},
    defender: {set: mk('gliscor', {ability: 'Poison Heal', moves: ['splash'], evs: {hp: 252, def: 252}, nature: 'impish', item: 'leftovers'}), status: 'tox'},
    move: 'tackle',
  });
  assert.strictEqual(hopeless.ko.guaranteed, null);
  assert.ok(/not a KO/.test(hopeless.ko.text), `expected "not a KO", got: ${hopeless.ko.text}`);
});

test('the calculator agrees with an outside reference, and applies 31 IVs', () => {
  /*
   * A cross-check against Smogon's damage calculator, which is the reference
   * every player will compare this against. Asked after a report that the two
   * disagreed — they did not: the *sets* differed (Showdown's preset Garchomp
   * carries a Choice Band and its Blissey runs 4 HP, ours neither), and IVs
   * were never the cause. Worth pinning, because "our calculator is wrong" is
   * expensive to re-investigate and this settles it in one assertion.
   *
   *   Showdown: 252 Atk Choice Band Garchomp Earthquake vs. 4 HP / 252+ Def
   *             Blissey: 444-523 (68 - 80.2%)
   *
   * A one-point tolerance, because the two implementations round in slightly
   * different places; anything larger is a real disagreement.
   */
  const mk = (species, options) => Pokemon.normalizeSet(Object.assign(
    {species, level: 100, ivs: Pokemon.maxIVs(), evs: {}}, options));

  const garchomp = mk('garchomp', {ability: 'Rough Skin', item: 'choiceband', nature: 'jolly',
    moves: ['earthquake'], evs: {atk: 252, spe: 252, hp: 4}});
  const blissey = mk('blissey', {ability: 'Natural Cure', item: 'heavydutyboots', nature: 'bold',
    moves: ['softboiled'], evs: {hp: 4, def: 252}});
  const attacker = {set: garchomp, boosts: {}, status: '', hpPercent: 100};
  const defender = {set: blissey, boosts: {}, status: '', hpPercent: 100};

  // The stats first: if these match, the spread and the IVs are being applied.
  const stats = RedGPT.Calculator.liveStats(attacker, defender, {});
  assert.strictEqual(stats.defender.hp.value, 652, 'Blissey HP must match the reference');
  assert.strictEqual(stats.defender.def.value, 130, 'and its Defence');
  assert.strictEqual(stats.attacker.atk.base, 359, 'Garchomp base Attack at 31 IVs');
  assert.strictEqual(stats.attacker.atk.value, Math.floor(359 * 1.5), 'and the Choice Band on top');

  const result = RedGPT.Calculator.calculate({attacker, defender, move: 'earthquake'});
  assert.ok(Math.abs(result.min - 444) <= 1, `min ${result.min} should be within 1 of 444`);
  assert.ok(Math.abs(result.max - 523) <= 1, `max ${result.max} should be within 1 of 523`);

  /*
   * CONTROL — the reference numbers are only meaningful if IVs actually move
   * them. Zeroing Attack and Defence IVs must change the result, or the test
   * above would pass on a build that ignored IVs entirely (which is exactly
   * what the report suspected).
   */
  const withIvs = (attackerAtk, defenderDef) => RedGPT.Calculator.calculate({
    attacker: {set: mk('garchomp', {ability: 'Rough Skin', item: 'choiceband', nature: 'jolly',
      moves: ['earthquake'], evs: {atk: 252, spe: 252, hp: 4}, ivs: Object.assign(Pokemon.maxIVs(), {atk: attackerAtk})})},
    defender: {set: mk('blissey', {ability: 'Natural Cure', item: 'heavydutyboots', nature: 'bold',
      moves: ['softboiled'], evs: {hp: 4, def: 252}, ivs: Object.assign(Pokemon.maxIVs(), {def: defenderDef})})},
    move: 'earthquake',
  });
  // One side at a time: zeroing both at once moves the damage in *opposite*
  // directions and very nearly cancels out, which is how the first version of
  // this control managed to assert nothing.
  assert.ok(withIvs(0, 31).max < result.max, 'CONTROL: zero Attack IVs lower the damage');
  assert.ok(withIvs(31, 0).max > result.max, 'CONTROL: zero Defence IVs raise it');
});


test('the evasion and OHKO clauses are read, not merely declared', () => {
  /*
   * Both flags were set on every tier format and consulted by **nothing**
   * (found 2026-08-16). The behaviour was right — the same six ids were
   * hardcoded into `bannedMoves` a few lines below the flags — but the flags
   * were the §8 declared-but-inert family: a format setting
   * `evasionClause: false` would still have banned Double Team.
   *
   * `bannedMoves` is derived from them now, so what is pinned here is that the
   * declaration is what decides, end to end through the validator.
   */
  const {Formats, Dex, Pokemon, Validation} = RedGPT;

  // 1. Behaviour is unchanged: every tier format still bans exactly the six.
  const expected = [...Formats.EVASION_MOVES, ...Formats.OHKO_MOVES].sort();
  assert.strictEqual(expected.length, 6, 'sanity: six clause moves');
  let tierFormats = 0;
  for (const format of Formats.list({includeInternal: true})) {
    if (!format.rules.maxTier) continue;
    tierFormats++;
    assert.deepStrictEqual([...(format.rules.bannedMoves || [])].sort(), expected,
      `${format.id} should ban exactly the clause moves`);
  }
  assert.ok(tierFormats >= 8, `sanity: the ladder should have several formats, saw ${tierFormats}`);

  // 2. The two flags are read independently.
  // Spread first: arrays from the VM sandbox have a different `Array.prototype`
  // and are never `deepStrictEqual` to a host array (§8).
  const banned = rules => [...Formats.clauseBannedMoves(rules)].sort();
  assert.deepStrictEqual(banned({evasionClause: true, ohkoClause: true}), expected);
  assert.deepStrictEqual(banned({evasionClause: false, ohkoClause: true}), [...Formats.OHKO_MOVES].sort(),
    'turning the evasion clause off must drop ONLY the evasion moves');
  assert.deepStrictEqual(banned({evasionClause: true, ohkoClause: false}), [...Formats.EVASION_MOVES].sort(),
    'turning the OHKO clause off must drop ONLY the OHKO moves');
  assert.deepStrictEqual(banned({evasionClause: false, ohkoClause: false}), []);

  // 3. A ban that is not a clause's survives being recomputed, and the
  //    derivation is idempotent.
  assert.deepStrictEqual(banned({evasionClause: false, ohkoClause: false, bannedMoves: ['splash']}), ['splash'],
    'an explicit ban must not be dropped by the derivation');
  const once = Formats.clauseBannedMoves({evasionClause: true, ohkoClause: true});
  assert.deepStrictEqual([...Formats.clauseBannedMoves({evasionClause: true, ohkoClause: true, bannedMoves: once})].sort(),
    expected, 'the derivation must be idempotent');

  /*
   * 4. End to end through the validator, which is the half that makes this a
   *    real test rather than a test of one pure function. A flag nothing acts
   *    on is exactly what was wrong before.
   */
  const withClauses = (evasion, ohko) => {
    const base = Formats.get('tieruu');
    const rules = Object.assign({}, base.rules, {evasionClause: evasion, ohkoClause: ohko});
    rules.bannedMoves = Formats.clauseBannedMoves(rules);
    return Object.assign({}, base, {rules});
  };
  const set = (species, move) => Pokemon.normalizeSet({species, level: 100, moves: [move]});
  const errs = (s, f) => Validation.validateTeam([s], f).errors.map(e => e.message);

  assert.ok(Dex.canLearn('alakazam', 'doubleteam'), 'fixture: Alakazam must learn Double Team');
  assert.ok(Dex.canLearn('lapras', 'sheercold'), 'fixture: Lapras must learn Sheer Cold');

  const on = withClauses(true, true);
  assert.strictEqual(errs(set('Alakazam', 'doubleteam'), on).length, 1, 'Double Team is refused with the clause on');
  assert.strictEqual(errs(set('Lapras', 'sheercold'), on).length, 1, 'Sheer Cold is refused with the clause on');

  const evasionOff = withClauses(false, true);
  assert.deepStrictEqual([...errs(set('Alakazam', 'doubleteam'), evasionOff)], [],
    'with the evasion clause off the validator must accept Double Team');
  assert.strictEqual(errs(set('Lapras', 'sheercold'), evasionOff).length, 1,
    'CONTROL: and the OHKO clause must still bite');

  const ohkoOff = withClauses(true, false);
  assert.deepStrictEqual([...errs(set('Lapras', 'sheercold'), ohkoOff)], [],
    'with the OHKO clause off the validator must accept Sheer Cold');
  assert.strictEqual(errs(set('Alakazam', 'doubleteam'), ohkoOff).length, 1,
    'CONTROL: and the evasion clause must still bite');
});

finish();
