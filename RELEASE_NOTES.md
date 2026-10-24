# Pokémon RedGPT 2.0.0

## Arena + Campaign redesign

RedGPT is now a competitive Pokémon battle sandbox first, with an optional
roguelite Campaign. The linear eight-Gym overworld, World Map, Rocket storyline,
Battle Token gacha and EV/IV minigames have been removed.

### Roster and data

- Expanded the playable roster from 151 species to **1,269 species and formes**,
  including later generations, regional forms and Mega formes.
- Every playable Pokémon is validated against real front *and* back artwork; a
  species with no exact sprite pair is skipped and listed in `docs/DATA_REPORT.md`.
- Move database grown from 473 to **827** moves; **316 abilities**, **557 items**
  and all **25 natures** are now packaged.
- Trade, friendship, time-of-day and location evolutions are converted to solo
  requirements in data rather than by scattered exceptions.

### Arena

- New title screen built around Arena (primary) and Campaign (optional).
- Arena dashboard: Random Battle, Battle vs AI, Custom Battle and Local Versus.
- Full competitive Team Builder: species and forme, nickname, level, gender,
  ability, held item, nature, Tera Type, four moves, EVs and IVs, with live
  calculated stats and EV/IV shortcuts.
- Text team import and export in the familiar competitive syntax, with per-set
  error reporting. JSON remains available as a backup format.
- A real validator that explains problems and never repairs a team silently.
- Six stable RedGPT formats including a Battle Tower preset and Custom Game.
- Team Preview, a first-class battle log, and saved replays that reproduce a
  battle exactly from a seed and a command list.

### Campaign

- Complete replacement: a seeded roguelite across three Acts with a branching
  procedurally generated map and nine node types.
- Starter draft, recruitment, evolution, a Move Tutor and TM rewards, held item
  management, shops, Mystery Events, Trainer Relics and run currency.
- Rescue Beacons make a lost battle cost resources and progress rather than
  instantly ending a twenty-battle run.
- Eight Act bosses with stated strategies plus a balanced final Champion.
- Normal / Veteran / Master difficulties and stacking Ascension modifiers.
- Run history, records and meta unlocks that add variety, never raw power.

### Engine

- The battle engine is now DOM-free: commands and a seeded RNG in, state and
  events out. Arena, Campaign, local versus, AI battles and replays all use it.
- Abilities and held items are hook-based registries instead of branches inside
  the move executor: **271 abilities** and **198 items** are simulated, and
  everything else is labelled "Not simulated" in the interface.
- Natures, Terastallization, fractional priority, Aurora Veil, Sticky Web, Wish,
  mid-turn switches and modern faint ordering added.
- New AI with four difficulty tiers that improve decision quality rather than
  cheating; it draws from a separate RNG stream so replays stay exact.
- Save schema v3 separates profile, Arena and Campaign state, and migrates v1/v2
  story saves instead of discarding them.

### Fixed

- Ability and item damage hooks were called with a duplicated argument, which
  made Life Orb and similar items produce `NaN` damage and left Pokémon unable
  to faint.
- A forfeit waited for the opponent's command instead of ending the battle.
- A Choice-locked or otherwise disabled move could be selected when it was the
  only remaining option.
- The team validator normalised EV/IV input before checking it, so
  out-of-range values were silently clamped instead of reported.

# Pokémon RedGPT 1.2.2

## Pokédex evolution details update

- Made every seen Pokémon card in the Pokédex open a detailed species entry.
- Added the complete evolution family to each entry, including pre-evolutions, later stages, and every branching option.
- Displayed the exact in-game requirement between each stage, using either the required level or the correct evolution stone.
- Highlighted the Pokémon currently being viewed while retaining the full family context, including all three Eevee stone branches.
- Added exhaustive automated checks confirming that every packaged evolution rule both triggers correctly in gameplay and appears correctly in the Pokédex.

# Pokémon RedGPT 1.2.1

## Evolution system correctness update

- Fixed the core evolution lookup so requirements are read from the evolved species and attached to the correct current Pokémon.
- Bulbasaur now evolves into Ivysaur at level 16, and every available Kanto level evolution is generated and checked through the same source-centric rule system.
- Converted trade evolutions to level-up evolutions: Kadabra and Haunter evolve at level 36; Machoke and Graveler evolve at level 40.
- Added functional Moon, Fire, Water, Thunder and Leaf Stones, including correct branching behavior for Eevee and safe rejection of incompatible stones.
- Added evolution stones to regional shops and ensured a stone is consumed only after a successful evolution.
- Made level-up and evolution messages safe outside battle so Rare Candy can trigger evolution correctly.
- Added automated evolution regression coverage for rule completeness, multi-stage leveling, all converted trade lines, stone availability, branching, consumption and failed-use safety.

# Pokémon RedGPT 1.2.0

## Battle move correctness update

- Fixed Leech Seed so end-of-turn drain heals the Pokémon on the side that planted the seed instead of incorrectly healing the seeded target.
- Limited Leech Seed recovery to the HP actually removed from the target and preserved Grass-type immunity.
- Expanded generated move metadata and the singles battle resolver for weather, terrain, side conditions, hazards, screens, charge and recharge turns, locked moves, fixed-damage and one-hit-knockout moves, forced and voluntary switching, dynamic power, recoil and crash damage, multihit behavior, secondary effects, and move-specific status interactions.
- Added field-state, substitute, grounding, hazard, residual-damage, and switching helpers used across the move engine.
- Added a coverage audit and runtime smoke test for all 473 packaged moves, plus deterministic regression assertions for Leech Seed, Yawn, Seismic Toss, immunities, and Struggle.
- Passed the complete automated data, campaign UI, postgame, move, and player-choice test suite.

# Pokémon RedGPT 1.1.0

## Traversal, saving, and story update

- Reworked destination checks around the connected map graph so Granite City is reachable from the beginning while badge- and Champion-gated areas remain locked.
- Added clear dialogue explaining why a route or Gym is unavailable instead of leaving progression controls silent.
- Fixed the manual **Save** button handler so a click performs a normal save rather than being interpreted as a silent autosave.
- Added success/failure feedback, a visible saved-state confirmation, timestamps, backup preservation, and more defensive browser-storage handling.
- Added an original clean-room dialogue system with opening scenes, first-visit scenes, ambient NPC/sign conversations, service interactions, trainer introductions, battle outcomes, Gym dialogue, rival scenes, Team Rocket events, League scenes, and postgame dialogue.
- Repaired all five optional side quests, which previously referenced missing encounters and could fail when selected.
- Added automated coverage for Granite City access, locked-route messaging, manual save persistence, dialogue flow, encounter references, map connectivity, and the repaired museum side quest.

# Pokémon RedGPT 1.0.3

## Core battle-flow fixes

- When the player's active Pokémon faints and usable party members remain, battle now pauses and asks the player which Pokémon to send out next.
- Forced replacement prompts cannot be dismissed without making a valid selection.
- When a Pokémon tries to learn a fifth move, the player can choose any one of the four current moves to forget.
- The player can explicitly decline the new move and keep the existing moves.
- Move-learning prompts cannot be dismissed without choosing a current move or declining the new move.
- Added automated UI tests for both forced faint replacement and four-move learning decisions.

# Pokémon RedGPT 1.0.2

## Fixes

- Fixed overlapping world map nodes by giving each destination unique grid coordinates and improved node sizing/wrapping.
- Kept the dedicated **World Map** tab open after map travel, added a direct **Open current location** button, and added travel feedback so destination changes are immediately visible.
- Reworked Leech Seed so it now applies correctly and resolves end-of-turn drain/healing.
- Expanded move-effect handling in battle to better support volatile effects and residual processing such as confusion, flinch, trapping, Yawn, Toxic scaling, recoil, drain, multihit moves, and self-boost/self-drop effects.
- Added regression coverage for world map travel behavior, unique map coordinates, and Leech Seed battle resolution.

# Pokémon RedGPT 1.0.1

## Interface update

- Added a dedicated **World Map** tab to the top navigation.
- Removed the map from the **World** tab.
- Reworked the World tab party panel into a compact responsive grid so the normal desktop view no longer becomes vertically scrollable because of the party list.
- Added an active-tab indicator and a map legend.

# Pokémon RedGPT 1.0.0

This package is the consolidated playable release built from the supplied asset archive.

## Campaign

- New Game, Trainer naming and starter selection
- Original clean-room world progression
- Rival and Team Rocket story battles
- Five optional side-quest subplots
- Eight Gyms and badges
- Victory Road
- Elite Four and Champion sequence
- Hall of Fame and postgame unlocks
- Mewtwo postgame encounter

## Systems

- All 151 Kanto species with modern data
- 473 modern move records
- Physical/Special split and separate special stats
- Modern 18-type chart
- Catching, experience, leveling, learnsets and level evolutions
- Party, storage, Pokédex, Bag, shops and healing
- Versioned autosaves, backup save and JSON export/import
- Battle Tower with level scaling, Species Clause, restricted list, matchup AI, milestone bosses, streaks and Battle Tokens
- One-token Game Corner gacha with pity and duplicate compensation
- Six-stat EV timing games and postgame IV challenges

## Validation

The release passed automated data validation, core campaign UI testing and postgame UI testing before packaging. See `docs/TESTING.md` for details.
