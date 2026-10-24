# Testing

```bash
npm install
npm test
```

The suite is fully deterministic: every test that touches gameplay drives the
engine through its public command interface with a fixed seed, so a failure
means a behavioural change rather than RNG noise.

Engine tests run in a bare Node VM context (`tests/helpers/engine.js`) with no
DOM, which is why they are fast enough to include soak runs. Only the browser
smoke test uses jsdom.

> Arrays created inside the VM context have a different prototype from the host
> realm, so comparisons against literals spread them first
> (`assert.deepStrictEqual([...x], [...])`).

## Suites

### `tests/data-validation.js`
Packaged data integrity. Every playable species has a BST equal to the sum of
its six base stats, one or two valid types, at least one real ability, a
learnset that only references packaged moves, evolution rules that point at
playable targets, and **both a front and a back sprite that exist on disk**.
Also validates the move, ability, item, nature and type-chart tables, and every
piece of Campaign content: boss teams (species, abilities, items and every
preferred move must be legal), trainer archetype sprites, event definitions,
node backgrounds, consumable sprites, the held-item reward pools and the starter
pools.

### `tests/engine-battle.js`
Battle mechanics. Determinism and seed divergence; nature/EV/IV stat maths;
type effectiveness, immunities and STAB; status application, typing immunity and
escalating Toxic; boosts and the +6 cap; switching and boost reset; faint
replacement requests; win detection; priority and Trick Room; weather, terrain,
entry hazards, Heavy-Duty Boots and screens; Intimidate, Levitate, Drizzle,
Sturdy, Regenerator and Static; Leftovers, Focus Sash, Life Orb, Choice locking,
Sitrus Berry and Assault Vest; Terastallization and its STAB rules; Leech Seed,
Seismic Toss, Protect stalling, Rest, Yawn, Struggle, U-turn and forfeit; Team
Preview ordering; AI move choice, switching and every difficulty tier; replay
reproduction; and a 200-battle soak.

### `tests/move-coverage.js`
Coverage audits. Every packaged move must map to an execution path *and* execute
without throwing, with preconditions set up so conditional moves reach their
real branch. Non-finite HP after any move is a failure. Ability and item
registries are audited: the competitively important entries must be implemented,
and anything neither implemented nor deliberately inert must be reportable so
the UI can label it honestly.

### `tests/teams.js`
Team Builder data layer. Set normalisation and legal move filling; EV shortcuts;
validation of empty teams, team size, Species Clause across formes, illegal
moves and abilities, EV/IV limits (including raw out-of-range input), restricted
species, banned moves, Item Clause and battle-only formes; unsimulated
abilities/items as warnings rather than errors; explicit auto-fix. Text import
of the documented sample, a lossless export/import round trip, and per-set
error reporting. Random team fullness, legality, type diversity, role-appropriate
movesets, natures and IVs, and seed reproducibility.

### `tests/arena.js`
Arena flows. Every public format hosts a complete battle and its rules actually
apply; Random Battle needs no saved team; replays save, reload and reproduce
exactly, and stay small because they store commands rather than snapshots; local
versus asks both sides; the battle view hides opponent details; the v3 save
schema, migration from v1/v2 story saves, JSON export/import and battle records.

### `tests/campaign.js`
Run lifecycle. Seeded run creation and reproducibility; starter drafting and
rerolls; Act map validity, real branching and the required node types; node
reachability; battle setup, reward payout and levelling; Rescue Beacons
absorbing losses until they run out; recruitment including the full-party
release flow; held items, consumables, evolution and the move-replacement
prompt; shop stock, purchases and affordability; relics and ascension
modifiers; every event choice applying cleanly; boss team construction; Act
advancement and the victory condition; serialisation at every phase and a
restored run continuing identically; and a soak of complete runs across all
three difficulties.

### `tests/ui-smoke.js`
End-to-end in jsdom against the real `index.html`, asserting zero console or
page errors throughout. Title screen → Arena → Team Builder (add a set, apply an
EV preset, save, export, re-import) → Random Battle played to completion → save
replay → Replay Browser playback → Pokédex search and species detail → Campaign
(new seeded run, starter draft, map, then a loop that plays battles, takes
rewards, recruits, shops, rests and resolves events across several nodes) →
**page reload**, confirming saved teams, replays and the active run all survive
and the run resumes where it left off.

## What is deliberately not asserted

Campaign win rates. Balance is measured separately during development rather
than pinned by a test, because a clear-rate assertion would be flaky and would
lock in tuning. The suite asserts that runs *terminate correctly* and that every
system behaves, not how often a run is won.
