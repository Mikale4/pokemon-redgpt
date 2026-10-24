# Pokémon RedGPT

Pokémon RedGPT is a self-contained, offline browser game with two modes:

- **Arena** — the primary mode. A dense competitive battle simulator: a full Team
  Builder, text team import/export, stable formats, four AI difficulties, local
  versus, seeded battles and reproducible replays.
- **Campaign** — an optional roguelite. Draft a starter, route a procedurally
  generated branching map across three Acts, recruit and evolve a team, manage
  held items and resources, and beat constructed Act bosses and a final Champion.

Both modes run on the same battle engine and the same generated Pokémon data.

## Start the game

On Windows, double-click **`Launch Pokemon RedGPT.bat`**. It starts a private
local web server and opens the game in your browser. Python 3 is used when
available; otherwise `index.html` opens directly.

Everything is stored in your browser's local storage. There is no account, no
server and no network request during play.

## Contents

| Dataset | Count |
| --- | --- |
| Playable species and formes | 1,138 selectable of 1,270 packaged (Mega formes are reached by Mega Evolving) |
| Moves | 827 |
| Abilities | 316 — 294 implemented, 22 inert by design, **0 not simulated** |
| Held items | 560 — 313 implemented, 247 inert by design, **0 not simulated** |
| Natures | 25 |
| Types | 18 |

A species is only playable when the Dex has valid data for it *and* both a front
and a back sprite exist in the asset library. Nothing in the game can reference a
missing Pokémon sprite. `docs/DATA_REPORT.md` lists every Dex entry that was
skipped and why.

## Arena

**Battle**

- **Random Battle** — one click, balanced generated teams for both sides, no
  Team Builder required.
- **Battle vs AI** — bring a saved team, pick a format and an AI difficulty.
- **Custom Battle** — configure level, team size, clauses, restricted species,
  battle-only formes, Tera and Team Preview.
- **Local Versus** — two players on one device, with the first player's choice
  hidden until both have committed.

**Formats** are fixed RedGPT rulesets, not a live tier feed:

| Format | Rules |
| --- | --- |
| **OverUsed** (default) | Smogon OU and below. Level 100, 6v6, Species Clause, Sleep Clause |
| Ubers, UU, RU, NU, PU, ZU | The rest of the Smogon ladder; each admits its own tier and everything below |
| Ubers (Tera), OU (Tera) | The same two rulesets with Terastallization enabled |
| Anything Goes | No species restrictions; battle-only formes such as Primals are selectable species |
| Random Battle | Generated teams for both sides |

**Terastallization is only legal in three formats**: Anything Goes, Ubers (Tera)
and OU (Tera). Every other format has it off.

Level 50 Singles, Restricted Singles, Battle Tower, Anything Goes (Tiered) and
Standard Singles were removed on 2026-08-14. A team saved under one of them still opens — an
unknown format id falls back to OverUsed, and the validator reports any
resulting illegality rather than accepting it silently. **AG remains a species
tier** (Xerneas, Calyrex-Shadow, Koraidon, Miraidon carry it) even though it no
longer has a ladder of its own; those four are playable in Anything Goes.

**Team Builder** covers species and forme, nickname, level, gender, ability,
held item, nature, Tera Type, four moves, EVs and IVs. It shows typing, sprite,
base stats, calculated stats, BST, ability and item descriptions, and full move
data. EV editing has sliders, numeric entry, a live remaining-EV counter and
shortcuts (Max Atk / Max SpA / Max Spe / walls / Reset). IV shortcuts cover 31
across the board, 0 Attack, 0 Speed and both.

Validation runs live and reports every problem with the exact set and field.
It never repairs a team silently — "Fix legality automatically" is a separate,
explicit button.

**Team text** uses the familiar competitive syntax:

```text
Gengar @ Focus Sash
Ability: Cursed Body
Tera Type: Ghost
EVs: 4 Def / 252 SpA / 252 Spe
Timid Nature
IVs: 0 Atk
- Shadow Ball
- Sludge Bomb
- Focus Blast
- Destiny Bond
```

Import reports errors per set ("Set 2: Blissey cannot learn Close Combat")
rather than failing as a whole. JSON remains available as a backup format.

**Damage Calculator** is a tab between Teams and Pokédex. Pick two Pokémon,
set EVs, natures, items, abilities, boosts, status, HP and Tera, add weather,
terrain and screens, and every move on the attacker is costed at once with a
full damage range, percentages and a KO summary.

It does not reimplement the damage formula: it builds a real battle and calls
the engine across all 16 damage rolls, so its numbers are the numbers a battle
produces — including every ability and move rule this project changes.

The KO summary counts what happens between turns too, by replaying real turns:
"2HKO – 3HKO after sandstorm damage and Leftovers recovery". Chip damage,
passive recovery, Leech Seed and a ramping Toxic counter are all included, and a
target that out-heals the attack is reported as "not a KO".

**Replays** store only the seed, the starting teams and the command list; the
battle is recomputed exactly on playback. The Replay Browser can step, play,
export and delete.

## Campaign

A run is: draft a starter from three candidates → route a branching Act map →
clear nodes → build a team → beat an Act boss → repeat for three Acts → beat the
Champion.

**Node types:** Trainer Battle, Elite Battle, Wild Encounter, Mystery Event,
Shop, Rest Site, Treasure, Specialist, Act Boss. Each Act map is generated from
the run seed as several independent paths merged into one graph, so branches
genuinely diverge; a Rest Site always precedes the boss.

**Team building during a run** — recruitment after wild encounters, events and
shops; a Move Tutor and TM rewards with an explicit move-replacement prompt;
held items you can move freely between party members; evolution by level and by
item, with trade and other multiplayer-only methods converted to solo-friendly
requirements in data (see `tools/generate-data.js`).

**Progression** is by node clear rather than grinding: the whole party shares a
team level that rises as you clear nodes, capped per Act. There is no way to farm
wild encounters for levels.

**Attrition** — after an ordinary battle the party recovers a fraction of its HP
and PP, and Pokémon that fainted return at a small fraction rather than staying
at zero. Rest Sites, Revives and boss clears are what restore a team properly.

**Rescue Beacons** are the run's real life total. Losing a battle spends one: the
team is airlifted out and fully treated, the node stays uncleared, and you route
again. Losing with no beacons left ends the run.

**Trainer Relics** are run-scoped passives that change routing and economy
rather than inflating damage — extra shop stock, free rerolls, better reward
choices, Rest Sites that also teach moves, an extra Beacon each Act.

**Difficulty:** Normal, Veteran and Master change AI quality, opponent team size,
the economy and healing. Ascension modifiers stack on top after a clear. No
difficulty gives an opponent illegal stats.

**Run shape** is chosen when you start: 1–8 Acts and 0–6 Rescue Beacons. Both
make a run more survivable, so the opposition scales sharply to pay for them —
fuller teams, a stronger species pool and a higher AI tier. The setup panel
states the resulting challenge before you commit.

**Recruitment is tiered.** Mythicals are never offered, and legendaries only
appear near the end of a run. You can release a Pokémon from the party at any
time, except your last one.

**Assist Mode** is two independent switches in the run sidebar, both off by
default and toggleable at any time:

- **Recommendations** mark a suggested reward, a suggested move to learn or
  forget, a suggested TM/tutor pick and the best holder for an item — each with
  a one-line reason. Nothing is ever pre-selected or disabled; the suggestion is
  a badge and the choice stays yours.
- **AI battling** hands a battle to the AI, including the lead choice on Team
  Preview. A button in the battle controls takes control back mid-battle at any
  point, and you can hand it back again.

**Act bosses** are constructed teams with a stated plan — rain offence, sandstorm
grind, Trick Room, hazard lock, sun pressure, setup sweep — and the final
Champion fields a balanced six with Expert decision-making.

## Battle engine

The engine has no DOM dependency. It consumes commands and emits state plus
events:

```text
battle state + side commands + seeded RNG
    → Battle.resolve()
    → updated state + battle events
```

Implemented: the Physical/Special split, six modern stats, the 18-type chart,
STAB, dual typings and immunities, IVs, EVs, natures, priority and fractional
priority, Speed, accuracy and evasion stages, critical hits, damage variance,
switching, major status, stat stages, recovery, recoil, draining, protection
moves, entry hazards and their removal, screens, weather, terrain, pseudo-weather
(Trick Room, Gravity, Magic Room, Wonder Room), charge and recharge turns, fixed
damage, multi-hit moves, secondary effects, Terastallization, Mega Evolution,
Team Preview, forced and mid-turn switches, Future Sight, Wish, and residual
ordering.

**Mega Evolution** needs no Key Stone — hold the species' own Mega Stone and the
option appears, in every format and in Campaign. It follows the usual rules
otherwise: once per side per battle, the stone is never consumed and cannot be
knocked off, and the Mega forme's ability replaces the holder's (Mega Charizard
Y really does bring the sun). Rayquaza Mega Evolves through Dragon Ascent with
no stone at all. Mega formes are reached by evolving rather than picked in the
Team Builder, so a Mega Stone is now a real teambuilding decision.

Abilities and held items are hook-based registries (`src/core/abilities.js`,
`src/core/items.js`) rather than branches inside the move executor. Coverage is
audited by the test suite and reported in the in-game Records screen.

**Abilities deliberately differ from the current games.** As with the move and
base-stat tables, a set of abilities is kept at earlier, stronger behaviour, and
four are redesigned outright:

| Ability | Behaviour here |
| --- | --- |
| Magic Guard | Also immune to Toxic Spikes poisoning and to full paralysis |
| Parental Bond | Second strike hits at 50% power, not 25% |
| Gale Wings | Flying-move priority at any HP, not only at full HP |
| Aerilate / Pixilate / Refrigerate | 1.3x on converted moves, not 1.2x |
| Transistor | 1.5x on Electric moves, not 1.3x |
| Disguise | Breaking the disguise costs no HP |
| Protean / Libero | Re-trigger before every qualifying move |
| Intrepid Sword / Dauntless Shield | Boost on every entry, not once per battle |
| Battle Bond | Legacy Ash-Greninja transformation on a KO |
| Mold Breaker / Turboblaze / Teravolt | Also ignore Dark Aura and Fairy Aura |
| **Supreme Overlord** | *Redesign:* +1 Attack on entry; no fainted-ally scaling |
| **Download** | *Redesign:* +1 Attack **and** +1 Sp. Atk, never a comparison |
| **Cloud Nine / Air Lock** | *Redesign:* delete the active weather on entry |
| **Heatproof** | *Redesign:* a full Fire immunity, not a halving |
| **Light Metal / Heavy Metal** | *Redesign:* a stat trade on entry, not weight alone |
| **Delta Stream** | *Redesign:* keeps its strong winds **and** deletes the active weather on entry — the only entry ability that can remove Desolate Land or Primordial Sea |
| **Curious Medicine** | *Redesign:* resets the **opposing** Pokémon's stat stages, since it has no ally to reset in singles |
| **Hospitality** | *Redesign:* restores 1/4 max HP to the most injured teammate **on the bench** |
| **Supersweet Syrup** | *Redesign:* lowers the foe's evasiveness on **every** entry, not once per battle |
| **Poison Puppeteer / Teraform Zero** | *Redesign:* their "only if this Pokémon is Pecharunt / Terapagos" clauses are dropped, so a copied ability is never silently inert |

Six of those abilities come from Legends: Z-A and are reached through the Mega
formes that carry them — Dragonize (Feraligatr), Eelevate (Eelektross), Fire
Mane (Pyroar), Mega Sol (Meganium), Piercing Drill (Excadrill) and Spicy Spray
(Scovillain). **Dragonize keeps its 1.2x**, not the 1.3x the restored `-ate`
abilities above carry: those are rollbacks of a nerf, and an ability introduced
after the nerf has nothing to roll back to. Eelevate is Levitate plus Beast
Boost despite the name — it is not an `-ate` ability at all.

Weather-setting abilities (Drought, Drizzle, Sand Stream, Snow Warning) keep
their modern finite duration, and the trapping abilities, Effect Spore,
Prankster, Moody, Intimidate and Trace all keep their modern rules.
In-game descriptions reflect the behaviour above, not the official text.

**Three held items are redesigned too**, and two are this project's own:

| Item | Behaviour here |
| --- | --- |
| **Ring Target** | *Redesign:* the **holder's** attacks hit for neutral damage through a target's type immunity, instead of stripping the holder's own immunities. One per team, and visible to the opponent from turn one. |
| **Toxic Orb / Flame Orb** | *Redesign:* afflict the holder **the moment it enters battle**, not at the end of the turn — so Guts, Poison Heal, Facade and Quick Feet are live on the turn the holder arrives. |
| **Hero Charm** | *New:* Palafin enters battle in Hero Form. Replaces Zero to Hero's invisible switch-out trigger. |
| **Warp Prism** | *New:* Trick Room the holder sets lasts 8 turns instead of 5. |
| **Wind Sock** | *New:* Tailwind the holder sets lasts 7 turns instead of 4. |
| **Hearthflame / Wellspring / Cornerstone Mask** | *Implemented 2026-08-16:* Ogerpon enters battle wearing the Mask, as the matching forme with its own typing and ability, and hits for 1.2x. Ogerpon itself is RU; every masked forme is OU, so a Mask may not be worn below OU. |

**The Generation 2 items work too** (added 2026-08-14). Berry, Gold Berry, the
five status Berries (PRZ Cure, PSN Cure, Ice, Burnt, Mint), Bitter Berry,
Miracle Berry, Mystery Berry, Berserk Gene, Pink Bow and Polkadot Bow all do
what their descriptions say rather than nothing. They are deliberately *not*
aliases of their modern replacements: Mystery Berry restores 5 PP where Leppa
restores 10, and the two Bows give Normal moves 1.1x where every modern type
booster gives 1.2x.

**Everything is now simulated or inert by design.** No ability and no item is
left in the "not simulated" bucket — `Abilities.coverage()` and
`Items.coverage()` report the split, and the Records screen shows it. The 22
abilities and 250 items listed as *inert by design* are the ones that genuinely
have no battle role here: evolution stones, TMs, Poké Balls, Z-crystals, mail,
and the doubles-only redirection abilities (Propeller Tail, Stalwart, Friend
Guard, Battery, Plus, Minus). Doubles-only effects that *could* be given a
singles meaning were redesigned instead — see Pickup, Curious Medicine and
Hospitality above.

**Mega Evolution *is* an in-battle mechanic** (this reverses an earlier
decision, and an older version of this paragraph said the opposite). Holding the
species' own Mega Stone is enough — there is no Key Stone — and it is declared
on the move choice like Terastallization. Mega formes are therefore not
selectable species: the route is the base forme holding the stone.

## Seeds

Battles and Campaign runs use a seeded RNG rather than `Math.random`, so:

- the same seed reproduces the same battle, map, shop stock and reward sequence,
- replays reproduce exactly from a command list,
- tests are deterministic.

Seeds are shown as `REDGPT-8F32A1` and can be typed into the Custom Battle and
New Run screens.

## Project layout

```text
index.html                 application shell
styles.css                 interface
src/core/rng.js            seeded RNG
src/core/dex.js            data access, sprites, type maths
src/core/pokemon.js        sets, stat calculation, battle Pokémon
src/core/mechanics.js      stateless move tables and damage formulas
src/core/abilities.js      ability hook registry
src/core/items.js          held item hook registry
src/core/battle.js         DOM-free battle engine
src/core/ai.js             AI with four difficulty tiers
src/core/formats.js        format rule objects
src/core/validation.js     team validator and explicit auto-fix
src/core/teamtext.js       text team import/export
src/core/store.js          save schema v4 and migration
src/arena/random-teams.js  role-based random set and team generation
src/campaign/content.js    starters, relics, events, bosses, shop tables
src/campaign/map.js        branching Act map generation
src/campaign/run.js        run state machine
src/ui/                    app shell, battle, team builder, dex, arena, campaign
data/                      generated battle data
tools/generate-data.js     reproducible data generator
tools/balance-probe.js     Campaign balance measurement (not part of npm test)
tests/                     automated tests
docs/                      architecture, data and testing notes
Assets/                    supplied artwork
```

## Saves

Schema v3 separates the three concerns:

```js
{
  version: 3,
  profile:  {name, settings, records, unlocks},
  arena:    {teams, activeTeamId, battleHistory, replays},
  campaign: {activeRun, history, meta}
}
```

Older v1/v2 story saves are migrated rather than discarded: the trainer name,
settings, records and the actual collection of Pokémon are carried
over as an Arena team, and the obsolete story flags are dropped. A rolling
backup copy is kept, and a corrupted main save falls back to it automatically.

The Campaign autosaves after every meaningful transition, including before a
battle starts, so a reload resumes exactly where you were.

## Working on this project

Start with [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) — it records the
design decisions that should not be silently reversed, the measured balance
figures, and the environment traps that have cost time before.

## Development

```bash
npm install
npm test
```

Regenerate the packaged data (requires the `@pkmn` packages):

```bash
npm run build:data
```

The suite covers data integrity and sprite existence, battle mechanics with
seeded determinism, full move execution coverage, ability and item coverage
audits, team validation and text round-trips, random team quality, Arena flows,
replay reproduction, save migration, the whole Campaign run lifecycle, and an
end-to-end browser smoke test that plays an Arena battle and a stretch of a
Campaign run and then reloads the page to confirm nothing is lost.

## Scope

This is a competitive battle sandbox with an optional roguelite, not a ROM
reconstruction. It does not include the original game's maps, script or dialogue.
Doubles battles, breeding, trading and network multiplayer are out of scope; the
engine's command/event architecture is designed so networked play could be added
without rewriting it.

Pokémon and related names and artwork belong to their respective owners. This is
an unofficial fan project and is not affiliated with or endorsed by Nintendo,
Game Freak, Creatures, or The Pokémon Company.
