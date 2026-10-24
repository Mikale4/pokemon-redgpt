# Architecture

Pokémon RedGPT is a static browser application. There is no bundler, no build
step for the app itself, and no runtime dependency: `index.html` loads plain
scripts in order, each attaching to a single `window.RedGPT` namespace. The only
build artefact is the generated dataset under `data/`.

## Layering

```text
data/game-data.js          generated, immutable battle data
        │
src/core/dex.js            the only module that knows the data's shape
        │
src/core/{rng,pokemon,mechanics,abilities,items,formats,validation,teamtext}.js
        │
src/core/battle.js         DOM-free engine: commands in, state + events out
        │
src/core/ai.js             a controller that produces commands
        │
┌───────┴────────┐
src/arena/…      src/campaign/…      mode logic, still DOM-free
└───────┬────────┘
src/ui/…                   the only layer that touches the DOM
```

Nothing below `src/ui` references `document`, `window.localStorage` (except
`store.js`, which is the storage adapter) or any rendering concept. That is what
lets the same engine drive AI battles, local versus, Campaign encounters,
replays and the headless test suite.

## The battle engine

`Battle` is a state machine over commands:

```text
battle state + side commands + seeded RNG
    → resolveChoices()
    → updated state + battle events
```

- **Sides are symmetric.** There is no "player" and "enemy"; there are `sides[0]`
  and `sides[1]`, each with a controller (`human`, `ai` or `script`). Local
  versus is two human controllers; a replay is two script controllers.
- **Requests drive the UI.** `battle.requests[side]` describes what that side
  must choose: `teampreview`, `move` or `switch`, with the legal options and the
  reason any option is unavailable. The UI renders the request; it never
  computes legality itself.
- **Commands are validated, then recorded.** `battle.choose(side, choice)`
  validates against the current request, appends to `battle.commands`, and
  resolves once every side that owes a choice has given one.
- **Events are the render feed.** `battle.events` carries `text`, `turn`,
  `damage`, `heal`, `switch`, `faint`, `status`, `boost`, `weather`, `terrain`
  and `end`. The UI appends log lines from the event stream and re-reads
  `battle.view(side)` for the board.
- **Two RNG streams.** `battle.rng` drives mechanics; `battle.aiRng` drives AI
  tie-breaks. Replays skip AI evaluation entirely, so keeping them separate is
  what makes a recorded command list reproduce a battle exactly.

Turn resolution builds an ordered action queue (priority → fractional priority →
Speed, inverted under Trick Room, RNG tie-break), then walks it. Faints are
noted and resolved after residuals, matching modern generations; mid-turn
switches (U-turn, Eject Button, Emergency Exit) suspend the queue, issue a
switch request, and resume from the same index when the choice arrives.

## Ability and item registries

Abilities and held items are data with named hooks, not branches inside
`executeMove`:

```js
define('Intimidate', {
  onStart(battle, pokemon) { /* … */ },
});

define('Life Orb', {
  onModifyDamage(battle, source, target, move, damage) { return Math.floor(damage * 1.3); },
  onAfterMove(battle, source, target, move, result) { /* recoil */ },
});
```

The engine calls hooks at fixed points (`onStart`, `onBeforeMove`,
`onModifyMove`, `onModifyStat`, `onBasePower`, `onModifyDamage`,
`onSourceModifyDamage`, `onTryHit`, `onDamagingHit`, `onAfterMove`,
`onSetStatus`, `onTryBoost`, `onAfterBoost`, `onResidual`, `onFaint`,
`onFoeFaint`, `onTrapped`, `onFractionalPriority`, …). Numeric hooks are threaded
through `modifyValue`, which ignores non-finite returns so a faulty effect cannot
poison a damage calculation.

Anything absent from a registry is reported by `Abilities.coverage()` /
`Items.coverage()` and surfaced in the UI as "Not simulated". Items that are
legitimately inert in battle (TMs, fossils, Mega Stones, EV-training gear) are
classified separately so the coverage numbers stay meaningful.

## Formats

A format is a plain rule object. The validator, the engine, the random team
generator and the Campaign all read the same object, so there are no
format-specific conditionals scattered through the codebase. `Formats.custom()`
builds a one-off format from the Custom Game screen using the same shape.

Species legality comes from a `powerClass` field baked into the generated data
(`standard`, `restricted`, `unrestricted-only`), derived once at generation time
from the packaged tier snapshot plus legendary flags. RedGPT deliberately does
not track a live tier list.

## Campaign

A run is a plain serialisable object, including its RNG state. `src/campaign/run.js`
exposes functions that take a run and return `{ok, error?, message?}`; the UI
reads `run.phase` and `run.pending` and renders whatever prompt is showing.

Prompts form a stack, so an event can open a recruitment offer which can open a
move-replacement prompt, and each resolves back to the one beneath it. A prompt
whose resolution opens a follow-up is removed from underneath it — detected by
stack depth rather than by return value, so a handler that opens nothing can
never loop.

Battles are handed to the UI as a serialisable configuration (teams, conditions,
seed, format, opponent). The UI builds a `Battle` from it, plays it, and calls
`Campaign.resolveBattle` with the survivors. Because the configuration is stored
rather than the live battle, a reload mid-battle rebuilds the identical encounter
from its seed.

## Persistence

`src/core/store.js` owns the schema, migration and the rolling backup. Every
write copies the previous value to a backup key first; a corrupt main save falls
back to it on load. Migration from the v1/v2 story saves keeps the profile,
settings, records and the Pokémon collection, and drops the obsolete world state.

## Data generation

`tools/generate-data.js` is the only place that talks to `@pkmn/dex` and
`@pkmn/data`. It resolves learnsets up the `changesFrom`/`baseSpecies`/`prevo`
chain, matches every species to front and back artwork through an explicit key
(never falling back to another forme's sprite), converts evolution methods that
have no meaning in solo play into level or item requirements, and writes a
report of everything it skipped to `docs/DATA_REPORT.md`.

Regeneration is reproducible: the same package versions and asset library
produce the same dataset.
