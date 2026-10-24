# Pokémon RedGPT — session handoff context

**Read this first in any new session working on this project.** It is the
durable record of what the project is, what was decided and why, and the traps
that cost time before. Keep it updated as work continues.

- Project root: `C:\Games\Pokemon RedGPT`
- Version: **2.0.0** (see `VERSION`, `RELEASE_NOTES.md`)
- Not a git repository. There is no VCS history — this file is the memory.
- Last major work: 2026-09-03 — **the Legends: Z-A Mega abilities, from the
  Pokémon Champions datamine** (§5, §10). The three `-Mega-Z` placeholders §5
  warned about were placeholders: **Garchomp-Mega-Z Sand Force → Levitate,
  Lucario-Mega-Z Adaptability → Aura Guard, Absol-Mega-Z Magic Bounce →
  Sharpness.** Two new generator mechanisms, both **meant to be retired** when
  upstream ships these values: **`ABILITY_ADDITIONS`** (Aura Guard does not
  exist upstream; abilities 316 → **317**) and **`SPECIES_ABILITY_OVERRIDES`**.
  Aura Guard is a flat contact halving with no HP gate — measured 128-152 →
  **64-76** on Sucker Punch with non-contact byte-identical. **Long Reach
  bypasses it, Protective Pads do not**, which the first draft of its own
  description got wrong in both directions. **Zero tier records changed — and
  that is the finding: three tier placements now rest on abilities those
  Pokémon no longer have**, Lucario-Mega-Z's Ubers pin most of all, since §10
  justified it on Adaptability by name. **All three need a fresh audit; none
  was moved.**
  Before that, 2026-08-17 — **the UU → OU pass and the Meloetta pass,
  carried out. Both moved nothing** (§10). **Zero competitive tier movements: the
  entire diff is provenance.** All 91 UU entries were reviewed against the OU bar
  and retained; Meloetta stays **NU** and Meloetta-Pirouette stays **RU**, with
  Pirouette's RU now a reviewed verdict rather than bookkeeping. **Seven UU
  formes were pinned at the tier they already had** — Dragalge-Mega, Drampa-Mega,
  Emboar-Mega, Meganium-Mega, Scrafty-Mega, Staraptor-Mega, Starmie-Mega — taking
  UU's estimated count **7 → 0** and the §10 disagreement set **25 → 18**. The
  snapshot diff came back **exactly 14 records and not one more**, so the
  estimator did not ripple. **Counts unchanged: Ubers 63, OU 93, UU 91, RU 131,
  NU 67, PU 110, ZU 677 — 1,232.**
  Before that, 2026-08-17 — **the UU → OU packet and the Meloetta packet,
  built as one document** (§10). `docs/UU_OU_EVIDENCE.md` (9,003 lines) carries
  **Part I, the UU → OU pass (sections A-T, upward only)** and **Part II,
  Meloetta / Meloetta-Pirouette (sections MEL1-MEL10)**. **No tier change has
  been made.** With it, a correction worth reading before quoting the open list:
  **the upward UU question HAS been asked once** — `UU_FINAL_EVIDENCE.md` covers
  both directions and returned *move nothing* — so the open item saying otherwise
  is superseded; what is un-asked is that the verdict was reached at **UU 86** and
  **five entries have joined since, all promoted from below**. Also found: **a
  fifth profiler defect, and the first that is ladder-wide** — the shared
  profiler quotes moves the engine refuses at use time, **457 lines across 387
  entries**, led by Last Resort at 140 BP quoted as Meloetta-Pirouette's Normal
  STAB while dealing **0**. Corrected in the new generator only and **reported,
  not fixed**, because a shared fix rewrites five completed audits' evidence.
  Also: **Skull Bash is absent from `Mechanics.CHARGE_MOVES`**, so it is
  single-turn 130 BP here (measured 409 into a Blissey).
  Before that, 2026-08-17 — **the untiered audit: ZU is the floor and NFE/LC
  discard is over** (§5, §10). **473 selectable species that could not be put on
  a legal team anywhere now carry a tier** — RU 1 (Porygon2), NU 4, PU 38, ZU 430
  — leaving **zero untiered selectable species**, asserted as an invariant rather
  than as a list of names. Eviolite is the mechanic it turns on and is implemented
  (Dusclops 394 → 591 Def). **Ladder: Ubers 63, OU 93, UU 91, RU 131, NU 67, PU
  110, ZU 677 (1,232).** The estimator rippled and was caught: **Delphox-Mega
  drifted UU → OU** because pinning Floette-Mega made a previously unresolved
  forme *resolve*, and it was pinned back. Silvally stays ZU on the completed
  17-Memory evidence; Floette-Mega OU / Meowstic-M-Mega RU / Tatsugiri-Curly-Mega
  RU are reviewed and pinned.
  Before that, 2026-08-17 — **the ZU pass, carried out. The standard tier
  ladder audit is COMPLETE** (§10): Medicham, Rampardos, Virizion and Brute
  Bonnet went ZU → PU, taking **PU 68 → 72 and ZU 251 → 247** with the ranked
  total conserved at 756 and **exactly four records changed**. Medicham needed
  **no pin** — Medicham-Mega is `natdex`-ranked, not `estimated` — which sharpens
  the estimator rule to *check `tierSource` on the forme* rather than *a base
  with a Mega needs a pin*. Regigigas and Slaking were reviewed and left, because
  Slow Start and Truant are implemented and are each species' only ability.
  Before that, 2026-08-17 — **the ZU evidence packet** (§10). It is the one
  **one-directional** pass on the programme, because ZU is
  the floor — section E and section K are deliberately empty and say so, and
  "outclassed within ZU" is an argument for *staying*. Three structural facts
  separate ZU from every rung above: it is **Mega-free by construction** (0 forme
  entries, 33 forme-item routes tested and 0 legal), **0 entries sit on an
  estimated tier**, and Heavy-Duty Boots are available to everything. A fourth
  profiler defect of the familiar family was found by reading the output —
  `P.offence` measures with the ability live, so **Regigigas read Atk 230 against
  a real 460** under Slow Start and was given a *special* set; fixed locally
  because it is the only Slow Start holder on the ladder.
  Before that, 2026-08-16 — **the PU pass and the global trapping pass,
  carried out** (§10): nine entries across four rungs — five PU → NU, no PU → ZU,
  and four trapping holders moved (Chandelure NU → UU, Gothitelle ZU → NU,
  Dugtrio and Wobbuffet ZU → PU) with five reviewed and deliberately left.
  **UU 90 → 91, NU 58 → 63, PU 71 → 68, ZU 254 → 251**, ranked total conserved at
  756. **No trapping ability was banned** — balance was handled entirely by
  tiering the holders, and a test now asserts that across all eleven formats.
  One pin is the first genuinely load-bearing one on this programme: without
  `chandeluremega`, moving base Chandelure sends its `estimated` Mega to **OU**,
  measured. **That is the other half of the estimator rule — changing a BASE's
  tier moves every estimated forme derived from it.**
  Before that, 2026-08-16 — **the NU tiering pass, the trapping-ability
  audit, and two new evidence packets** (§10): seven entries moved — six NU → RU
  and Audino-Mega NU → PU — taking **RU 122 → 128, NU 65 → 58, PU 70 → 71** with
  **zero collateral movement** across a full 1,270-species snapshot. A
  project-wide *behavioural* trapping audit (discovery by `onTrapped` hook, never
  by name) found **exactly three** trapping abilities, confirmed all eleven
  formats already carry `bannedAbilities: []` so **no legality fix was needed**,
  and measured two counterplay routes the ability text does not imply: **every
  pivot move bypasses trapping**, and **phazing drags a trapped Pokémon out**.
  Two blockers recorded rather than fixed: **there is no *move* half to the
  forme-route gate** (which is what implementing Relic Song → Meloetta-Pirouette
  would need), and `ai.js` keeps a hand-written copy of the trapping list.
  `docs/PU_FINAL_EVIDENCE.md` and `docs/TRAPPING_ABILITY_TIER_AUDIT_PROMPT.md`
  are written and awaiting ChatGPT. **Read §10 "the NU pass, the trapping audit,
  and the PU packet" first.**
  Before that, 2026-08-16 — **the Fishious Rend / Bolt Beak investigation,
  and the damage calculator rebuilt around both directions** (§10): the engine
  was always right; the AI's *input* was not (it valued both moves at double
  when it would move second) and the calculator could not express turn state at
  all, which is what made a tiering evidence packet print identical numbers for
  "moving first" and "moving second". That packet also turned out to have been
  generated with **ability slot 0** — Water Absorb instead of Strong Jaw,
  Swarm instead of Technician — understating 26 rows by a third. All fixed; the
  calculator now gives both Pokémon their own moves and shows damage both ways,
  with screens moved onto each side.
  Before that, 2026-08-16 — **the OU → UU tiering pass, carried out** (§5,
  §10): fifteen entries dropped, **OU 107 → 92 and UU 71 → 86**. Thirteen
  species plus Mega Scolipede and Mega Skarmory, both of which lose to their own
  base forme, so the *forme* moved and the base stayed. One pin
  (`hawluchamega`), measured and recorded as **not** load-bearing. Zero
  collateral movement across a full 1,270-species snapshot. `tools/tiering-docs.js`
  was written with it, so the two pinned briefings regenerate from the live
  ladder instead of by hand. Ubers, RU, NU, PU and ZU are untouched, and **no UU
  entry was promoted** — that pass is deliberately separate. **Read §10 "the
  OU → UU pass, carried out" and "Still open — from 2026-08-16" first.**
  Before that, 2026-08-16 — **the Ogerpon line made playable** (§5, §8, §10):
  base Ogerpon was **not packaged at all** (dropped for a sprite key, so the
  Masks had no holder), the three Masks are forme items now with their 1.2x
  implemented, all five Terastal formes are consistently transform-only, and
  base Ogerpon is ruled **RU with the Masks refused below OU**. With it: the
  validator stopped calling eight supported forme routes useless (§8), the
  control harness gained `suite` and `rebuild` so generator-side fixes can be
  controlled at all, and `docs/OU_ROSTER_FOR_TIERING.md` + `OU_ROSTER_PROMPT.md`
  were written for the reverse (OU → Ubers) tiering pass.
  Before that, 2026-08-15 — **formats and tiering rebuilt** (§5, §10): Standard
  Singles removed and **OverUsed is the default**; Tera restricted to three
  formats; `TIER_OVERRIDES` added and 25 Ubers entries dropped to OU; one Arceus
  and one Silvally; the Team Builder, Pokédex and Teams screen all gained forme /
  tier browsing; Tera Blast implemented from nothing.
  Before that, 2026-08-14 (third pass) — **full ability and item coverage**
  (§5, §9, §10 item 4c): the last 13 abilities and 13 items were implemented, so
  `Abilities.coverage().missing` and `Items.coverage().missing` are both empty
  and nothing in the game is labelled "not simulated" any more. With it: Delta
  Stream's project-decided weather wipe and the ruling that it — and Teraform
  Zero — may remove primal weather where Cloud Nine and Air Lock may not; three
  doubles-only abilities redesigned for singles; two bugs found in passing
  (Mummy had no exclusion list, `healBerry` read the wrong Pokémon's item); and
  `tools/coverage-controls.js`, a 30-control harness. Also that session: **the
  Pokédex gained the Campaign forme browser**, so Mega formes are reachable
  there with their own typing, stats and abilities (§5), and **a Red Card crash
  in `finishLockedMove`** was found by the Rebirth probe and fixed (§8).
  Before that, 2026-08-14 (second pass) — **Rebirth Mode built** (§5, §6): a
  new run started inside a cleared one, carrying the party and relics, where
  every Trainer, Elite and boss fields a complete six built from a `TEAM_PLANS`
  row, plays at Expert, and opens with that plan's doctrine already on the
  field. With it: a third weather-persistence state (`ENDLESS`, no counter but
  still removable), self-cancelling rooms, `teamPlan` on every boss, a ninth
  team plan (Sandstorm), and the status Orbs firing on entry instead of at end
  of turn. Measured at 26% on Normal against the base game's unchanged 42%.
  Before that, 2026-08-14 — use-time move typing for five moves (Revelation
  Dance, Judgment, Multi-Attack, Techno Blast, Aura Wheel); the Assist-only
  unlock flag wired up; Campaign balance re-measured at 46/33/15; the agent can
  screenshot the preview pane again, so the whole outstanding visual list was
  verified by eye. Before that, 2026-08-13 — AI boost/last-turn judgement and Mega-aware threat
  assessment; battle log reversed and collapsible; stackable reroll relic; Rest Site
  foraging; Rare Encounter nodes (always recruitable); long-run recruitment fix;
  six moves/abilities made unconditional; Pickup implemented; player-chosen branching
  evolutions; priority moves reachable in generated sets.
  Before that, 2026-08-12: audit tooling rebuilt
  around controls; every forme made reachable; Campaign EVs removed; AI awareness
  layer; data-driven meta unlocks; multiple Campaign run slots (save schema v4);
  **Campaign balance re-measured and retuned** against a fixed probe policy (§6).
  See §10 for the change log and the open-work list.

---

## 1. What the product is

A self-contained, offline browser game. Two modes on one engine:

- **Arena** (primary) — a competitive battle simulator: Team Builder, text team
  import/export, eleven fixed formats (OverUsed is the default), four AI difficulties, local versus, seeded
  battles, reproducible replays.
- **Campaign** (optional) — a seeded roguelite: starter draft, branching
  three-Act map, recruitment, evolution, held items, shops, events, relics,
  constructed Act bosses, a final Champion.

**The old product is gone.** v1.x was a linear eight-Gym Kanto-style RPG with a
World Map, Team Rocket story, Battle Token gacha and EV/IV minigames. All of it
was deleted in v2.0.0 — `src/game.js` and `src/content.js` no longer exist. Do
not reintroduce those systems.

---

## 2. Current numbers

| Thing | Value |
| --- | --- |
| Playable species and formes | 1,138 selectable (1,273 packaged; Megas, Greninja-Ash, the Arceus/Silvally typed formes and the five Terastal formes are transform-only, and two are cosmetic skins). **Every selectable species carries a ladder tier** — ZU is the floor (§5, §10) |
| Ladder | Ubers 63, OU 93, UU 91, RU 131, NU 67, PU 110, ZU 677 — **1,232 ranked entries** |
| Moves | 827 |
| Abilities | 317 packaged — **295 implemented, 22 inert by design, 0 not simulated**. One, **Aura Guard**, is this project's own via `ABILITY_ADDITIONS` |
| Held items | 560 packaged — **313 implemented, 247 inert by design, 0 not simulated** |
| Natures | 25 |
| Types | 18 |
| Save schema | v4 (multiple Campaign run slots) |
| Test assertions | 438 across six engine suites, plus a jsdom UI smoke run |
| Control harness | 132 controls in `tools/coverage-controls.js` |

Regenerate the counts with `npm run build:data`; the report lands in
`docs/DATA_REPORT.md`. That command rewrites **both** `data/game-data.js` (the
runtime bundle) and `data/pokemon.json` (read by `tests/data-validation.js`) —
they are two copies of the same generated data and must never be edited by hand.

---

## 3. File map

```text
index.html                 script tags in strict load order — see §4
styles.css                 all styling, dark + light theme, responsive
src/core/rng.js            seeded sfc32 RNG, REDGPT-XXXXXX seed format
src/core/dex.js            the ONLY module that knows the data's shape
src/core/pokemon.js        sets, stat calculation, battle Pokémon construction
src/core/mechanics.js      stateless move tables + pure damage formulas
src/core/abilities.js      ability hook registry (280 entries)
src/core/items.js          held item hook registry (198 hooked + engine forme items)
src/core/battle.js         DOM-free engine: commands in, state + events out
src/core/ai.js             four difficulty tiers, uses battle.aiRng
src/core/formats.js        format rule objects + Formats.custom()
src/core/validation.js     team validator + explicit autoFix
src/core/teamtext.js       competitive text import/export
src/core/store.js          save schema v4, migration, rolling backup, run slots
src/arena/random-teams.js  role-based random set/team generation
src/arena/calculator.js    damage calculator — drives the engine, no formula copy
src/campaign/content.js    starters, relics, events, bosses, shop tables
src/campaign/map.js        branching Act map generation + validateAct
src/campaign/run.js        run state machine (the biggest campaign file)
src/campaign/advisor.js    Assist Mode scoring (DOM-free, deterministic)
src/ui/common.js           DOM helpers, chips, modals, toasts, search picker
src/ui/battle-ui.js        BattleView + replay playback
src/ui/team-builder.js     TeamBuilder class
src/ui/dex-ui.js           Pokédex / data browser
src/ui/calc-ui.js          Damage Calculator tab
src/ui/arena-ui.js         Arena home, battle setup, history, replays
src/ui/campaign-ui.js      Campaign hub, run setup, map, all prompts
src/ui/app.js              shell, routing, title screen, records, settings
tools/generate-data.js     the only file that touches @pkmn packages
tools/balance-probe.js     campaign balance measurement (not part of npm test)
tools/ai-ladder.js         side-mirrored AI tier win rates (not part of npm test)
tools/ai-switch-sweep.js   switch/replacement quality, with denominators (see §10)
Assets/Audio/Cries/        1,025 species cries (13.7 MB) — resolved at build time
tools/audit.js             deep data/engine sweeps, each with a control — see §11
tools/coverage-controls.js 89 controls; each breaks one fix and asserts its test
                           goes red. Patches src/** or the generator in place.
tools/tiering-docs.js      regenerates the pinned roster blocks and every count
                           in the two tiering briefings from the live ladder
tools/evidence-calcs.js    regenerates the damage rows in the UU evidence packet
                           that were generated with the wrong ability
tools/lib/profiler.js      the ONE engine-resolved movepool profiler; both
                           tiering briefings read it, never a local copy
tools/uu-audit-doc.js      generates docs/UU_FORMAT_AUDIT.md
tools/uu-final-evidence.js generates docs/UU_FINAL_EVIDENCE.md — the final UU
                           audit packet (profiles, matrices, calcs, A-S)
tools/ru-final-evidence.js generates docs/RU_FINAL_EVIDENCE.md — RU + NU + UU
tools/nu-final-evidence.js generates docs/NU_FINAL_EVIDENCE.md — NU + PU + RU
                           NOTE its roster variables are named RU/NU/UU and BOUND
                           to NU/PU/RU, so its summary line mislabels its counts.
                           The document is correct; the names are not.
tools/pu-final-evidence.js generates docs/PU_FINAL_EVIDENCE.md — PU + ZU + NU.
                           Names its rosters SUBJECT/DOWN/UP for that reason.
tools/untiered-evidence.js generates docs/UNTIERED_EVIDENCE.md — every selectable
                           species with no ladder tier. Eviolite is the mechanic
                           it turns on and is measured, not described.
tools/silvally-memory-evidence.js  generates docs/SILVALLY_MEMORY_EVIDENCE.md —
                           all 17 Memories, measured in real battles.
tools/uu-ou-evidence.js    generates docs/UU_OU_EVIDENCE.md — ONE document, TWO
                           audits: the UU → OU pass (Part I, upward only) and
                           the Meloetta / Meloetta-Pirouette question (Part II).
                           The ONLY generator that annotates conditional attacks
                           the shared profiler quotes at full power, and it
                           reconciles that live against `RandomTeams.AVOID`.
tools/zu-final-evidence.js generates docs/ZU_FINAL_EVIDENCE.md — ZU + PU only.
                           ONE-DIRECTIONAL: ZU is the floor, so there is no
                           downward bar. Corrects `P.offence` for Slow Start,
                           whose penalty expires (see §10).
tools/trapping-audit-prompt.js  generates docs/TRAPPING_ABILITY_TIER_AUDIT_PROMPT.md
                           — the whole-ladder trapping-holder audit. Discovers
                           trapping abilities by `onTrapped` hook, never by name.
tests/                     see §7
docs/                      ARCHITECTURE, DATA_SOURCES, TESTING, DATA_REPORT
docs/AI_DESIGN.md          the AI's handbook — read before any AI change
docs/DIFFERENCES_FROM_SHOWDOWN.md   briefing written for ChatGPT
docs/DIFFERENCES_ADDENDUM_ITEMS.md  ditto, held items
docs/OU_ROSTER_FOR_TIERING.md       ditto, the OU roster (pinned by a test)
docs/OU_ROSTER_PROMPT.md            the prompt to paste with it
docs/OU_TIERING_EVIDENCE_PROMPT.md  learnsets + engine calcs, paste-ready
docs/UU_ROSTER_FOR_TIERING.md       the OU -> UU pass; movepools for both
                                    rosters and every move diff (pinned)
docs/UU_ROSTER_PROMPT.md            the prompt to paste with it
docs/UU_TIERING_EVIDENCE_PROMPT.md  331 engine calcs for the final UU pass
docs/UU_FORMAT_AUDIT.md             the UU tier reviewed in BOTH directions;
                                    UU profiles plus the OU and RU bars (pinned)
docs/UU_FORMAT_AUDIT_PROMPT.md      the prompt to paste with it
docs/NU_FINAL_EVIDENCE.md           the NU audit packet (NU + PU + RU, pinned)
docs/PU_FINAL_EVIDENCE.md           the PU audit packet (PU + ZU + NU, pinned)
docs/ZU_FINAL_EVIDENCE.md           the ZU audit packet (ZU + PU, upward only)
docs/UU_OU_EVIDENCE.md              Part I: the UU → OU pass, sections A-T,
                                    upward only. Part II: Meloetta and
                                    Meloetta-Pirouette, sections **MEL1-MEL10**
                                    — the prefix is MEL and not M because Part I
                                    already has a section M (pinned)
docs/UNTIERED_EVIDENCE.md           the 473 selectable species with NO ladder
                                    tier, plus the 3 newly-packaged Megas on
                                    unreviewed estimated tiers (pinned)
docs/SILVALLY_MEMORY_EVIDENCE.md    Silvally across all 17 Memories — the
                                    evidence the ZU audit said it lacked (pinned)
docs/NEXT_SESSION_PROMPT.md         paste-ready handoff prompt for the next
                                    session. Refresh it at the end of a session;
                                    it is not generated, so it goes stale.
docs/TRAPPING_ABILITY_TIER_AUDIT_PROMPT.md
                                    whole-ladder trapping-holder audit (pinned)
```

Nothing below `src/ui` touches the DOM. `store.js` is the only non-UI module
that touches `localStorage`. Preserve that boundary.

---

## 4. Script load order matters

`index.html` and `tests/helpers/engine.js` must list the same files in the same
order. Dependencies are resolved at load time via `window.RedGPT`, so a new
module must be inserted in the right place in **both** files:

```
data/game-data.js → rng → dex → pokemon → abilities → items → formats
→ mechanics → ai → battle → validation → teamtext → store
→ arena/random-teams → arena/calculator → campaign/content → campaign/map → campaign/run
→ campaign/advisor
→ ui/common → ui/battle-ui → ui/team-builder → ui/dex-ui → ui/calc-ui → ui/arena-ui
→ ui/campaign-ui → ui/app
```

---

## 5. Design decisions — do not silently reverse these

**Two RNG streams.** `battle.rng` drives mechanics; `battle.aiRng` drives AI
tie-breaks. Replays skip AI evaluation entirely, so a shared stream would
desynchronise playback. If you add randomness to the AI, use `aiRng`.

**Asking what a move *would* do must not change anything —
`dynamicBasePower(attacker, defender, move, {preview: true})`.** Three moves roll
for their power: Magnitude, Present and Fickle Beam. Without the flag they draw
from `battle.rng`, write to the battle log, and — for Present, one roll in five —
really heal the target. `AI.estimateDamage` and `arena/calculator.js` both ask
hypothetically and both pass `preview`, which returns the mean power (71 / 52 /
1.3x) with no draw, no log line and no state change. This was live: scoring a
move the AI never picked healed the opponent 25% and printed "Magnitude 8!"
before anything had been chosen, and the RNG draw desynchronised replays, which
never run AI evaluation. Any new caller that is only *asking* must pass it, and
any new rolling move must be handled in the preview branch.

**A stored replay from before 2026-08-13 will desynchronise if it used Tera.**
Replays are a seed and a command list, so they re-simulate rather than play back
recorded states — and the Tera ordering fix above changes what those same
commands produce. Nothing detects this; the replay simply diverges. It affects
only replays in which somebody Terastallized, and only from that turn on. Not
worth a migration (a replay is a curiosity, not save data), but worth knowing
before treating an old replay as evidence of a bug.

**Replays are seed + initial teams + command list.** No per-turn snapshots.
`side.initialTeam` is captured at construction because Team Preview mutates
`side.team` — replaying from the reordered team double-applies the order.

**Sides are symmetric.** `sides[0]` / `sides[1]`, controller `human` | `ai` |
`script`. There is no hardcoded "player" side.

**Requests stay populated until the turn resolves.** Use `battle.needsChoice(i)`,
not `battle.requests[i]`, to ask whether a side still owes a command. Getting
this wrong broke local versus once already.

**`modifyValue(hook, pokemon, value, ...args)`** invokes hooks as
`hook(battle, pokemon, ...args, value)`. Callers pass only the arguments that
follow `pokemon` in the hook signature. Passing the attacker twice caused
`NaN` damage for every Life Orb holder and Pokémon that could never faint. It
now ignores non-finite returns as a backstop, but get the call site right.

**Species are gated on sprites; items are not.** A Pokémon is only playable when
an exact front *and* back sprite pair exists — never fall back to another
forme's artwork. Items ship without artwork and render as a lettered chip,
because item data is battle data.

**Validation never repairs silently.** `validateTeam` reports; `autoFix` is a
separate function called only from an explicit button. It also checks *raw*
EV/IV input, because normalisation clamps out-of-range values.

**Mega Evolution is a real in-battle mechanic** (this replaced the old "not
simulated, Megas are selectable species" decision). Rules:

- **No Key Stone / Mega Bracelet.** Holding the species' own Mega Stone is
  enough. Rayquaza is the exception the games make too: it needs Dragon Ascent
  and no stone at all.
- Enabled by `rules.mega`, which is **on in every format including Campaign**.
- Once per side per battle, declared on the move choice (`choice.mega`) exactly
  like Tera. It resolves in `runTurn` **before actions are ordered**, so the
  Mega forme's Speed decides that turn.

  **Both are now pre-turn actions, but they are still two separate passes, and
  the order between them is the reason.** Mega has to land before the action
  list is *ordered*, because the Mega forme's Speed decides who moves first.
  Tera changes only typing, so it is applied after the sort — which is what lets
  the log read in Speed order the way the games do. Do not merge them into one
  loop: doing so either orders the turn on pre-Mega Speed or reports the Teras
  in the wrong order.

  **Tera used to apply inline in `continueTurn`, and that was a bug** (fixed
  2026-08-13, reported from a real log). Applying it immediately before the
  actor's own move meant a *slower* Pokémon Terastallized only after it had
  already been hit: an Arceus Tera'd to Ground, Earthquaked a Kyogre, and only
  then did Kyogre become Grass — so it paid for a resistance and took the hit on
  its old typing. Measured at exactly double damage, 82 against 41. In the games
  Terastallization is a pre-turn action for every side that declared it.
- The stone is never consumed and **cannot be removed** — the guard is in
  `canRemoveItem`, so Knock Off, Trick, Switcheroo, Thief and Corrosive Gas are
  all covered at once.
- The Mega forme's ability replaces the holder's and its `onStart` fires (Mega
  Charizard Y really does set sun). The forme persists across switches for the
  rest of the battle and never touches `pokemon.set`.
- **Mega formes are not selectable.** They are `transformOnly` (see below), so
  they are gone from the Team Builder, the Pokédex and every format pool. The
  supported route is the base forme holding the stone.

**Battle rewards must not duplicate each other.** "Field Treatment" restored
50% party HP, which is exactly what the Team Rations consumable does — the same
reward twice on one screen. It is now **Supply Drop**: 60% PP to every move plus
a party-wide status cure. HP is the best-covered resource in a run (potions,
Rations, Rest Sites, automatic post-battle healing); PP comes back at only 35% a
battle and status was curable one Pokémon at a time, so neither overlapped
anything. A test asserts Supply Drop does *not* touch HP and that Team Rations
still exists to do that job.

**Tiers are Smogon's National Dex tiers, imported — never measured.** This
reverses an earlier decision (a tool that ranked the roster by playing ~46,000
battles) and the note in `formats.js` that said the project deliberately does not
track Smogon's list. Both are gone by project decision. Four rules hold it
together:

- **National Dex, not SV.** Nat Dex is the format that still has Mega Evolution,
  and it ranks far more of the roster: 751 of our species carry a Nat Dex tier
  against 509 with an SV one.
- **Banlists roll upward.** `UUBL` means *banned from UU*, so it plays in OU.
  Reading it as its own rung, or as UU, misplaces every banlist entry.
- **The ladder below RU is extended, not invented.** Nat Dex has no NU, PU or ZU
  — everything it does not rank in Uber/OU/UU/RU is swept into RU, which put
  ~517 of our species on one rung. The four tiers above RU are left exactly as
  Nat Dex states them; the RU bucket is split using the same kind of evidence Nat
  Dex is itself built from, namely Smogon's usage-derived tiers from the ladders
  that *do* rank that deep (SV first, then the most recent older generation).
  Nothing overrides Nat Dex where Nat Dex has an opinion.
- ~~**NFE and LC are discarded.**~~ **SUPERSEDED 2026-08-17 — ZU is the floor.**
  Every selectable species carries a ladder tier now; anything whose tier does not
  resolve to a rung lands in **ZU** with `tierSource.from === 'redgpt-zu-floor'`,
  and `raw` keeps the upstream category so a floored tier is never mistaken for an
  import. The discard policy left **473 selectable species unable to join a legal
  team in any tier format**, which is what reversed it. There is still **no Little
  Cup format** and LC is still not a RedGPT rung — the floor replaces the
  category rather than importing it. Upstream ladder rankings remain
  authoritative, so this is *not* "every unevolved Pokémon is ZU": Chansey is UU,
  Bisharp UU, Duraludon RU and Pikachu ZU **by import**, and a test written on the
  wrong assumption caught exactly that once already. A **zero-untiered
  invariant** now asserts no selectable species can be left off the ladder.

**Ban the forme, not the Pokémon.** Mega Evolution needs no Key Stone here, so a
species is only as fair as the forme it can turn into — and the fix is to refuse
the *item*, never to move the species. Absol is PU and Mega Absol is RU, so Absol
plays in PU and simply may not hold Absolite there. An earlier pass instead
*uplifted* the species to its Mega's tier, which is wrong twice over: it deletes a
perfectly fair PU Pokémon from PU, and it lets the Mega into whatever tier the
base was pushed to. `species.formeItems` carries each item with the tier of the
forme it produces; `Formats.illegalFormeItems` and the validator enforce it.
46 of those formes are **upstream formes Smogon has never ranked** (Absol-Mega-Z,
Garchomp-Mega-Z, Dragonite-Mega…) — they are tiered by nearest
neighbour among the 48 Megas Nat Dex *does* rank, and always carry
`tierSource: 'estimated'` so a guess is never mistaken for imported data.

**This line used to say they were "this project's own inventions", and that was
wrong twice** (corrected 2026-08-14). Absol-Mega-Z is upstream in `@pkmn`
(flagged `isNonstandard: 'Future'`, the marker for a species newer than the dex
being queried — Smogon's *own* creations are flagged `'CAP'`), and
**`tools/generate-data.js` has no species-addition mechanism at all**: it
filters upstream data and can never invent a species. Only the two *items* in
`ITEM_ADDITIONS` are this project's inventions. The distinction matters, because
"we invented these" and "Smogon has not ranked these" imply completely different
things about whether the tiering can be checked against anything.

~~Worth knowing about the three `-Mega-Z` formes specifically: their abilities are
**identical to each Pokémon's existing Mega** (Absol-Mega-Z Magic Bounce,
Garchomp-Mega-Z Sand Force, Lucario-Mega-Z Adaptability). That is what a
provisional placeholder looks like, and the `'Future'` flag does not distinguish
datamined-official values from provisional ones — so do not treat those three
ability assignments as settled.~~

**CONFIRMED AND REPLACED 2026-09-03.** They were placeholders, exactly as this
note predicted, and the giveaway was the right one. Real values from the Pokémon
Champions datamine: **Garchomp-Mega-Z Levitate, Lucario-Mega-Z Aura Guard,
Absol-Mega-Z Sharpness**, set through `SPECIES_ABILITY_OVERRIDES` (and Aura Guard
packaged through `ABILITY_ADDITIONS`, since upstream has never had it). See §10.
**The reasoning is kept because it generalises**: an ability byte-identical to
the base Pokémon's ordinary Mega is the tell, and `isNonstandard: 'Future'` still
does not distinguish datamined-official from provisional.

**Species cries are the project's only audio, and playback is feature-detected.**
`Dex.cry(species)` returns a path and nothing more — `src/core` may not touch a
browser API any more than it may touch the DOM — and `UI.playCry` does the
playing. It gates on `canPlayType('audio/ogg')` rather than a try/catch, which
does three jobs at once: Safari degrades to silence instead of throwing on every
switch-in, jsdom returns `''` so `tests/ui-smoke.js` keeps its zero-console-error
guarantee, and a real browser gets sound. One file per *distinct* cry with formes
resolved to their base species at build time, so 17 Arceus formes share one
`arceus.ogg` rather than shipping 17 copies.

The opening leads are a **separate code path from every other cry**, and shipped
silent because of it. `battle.start()` emits its switch events before the view
exists, and playback only ever replays what a `choose()` produced — so the hook
on the played-back `switch` event covered every switch-in *except* the two that
open the battle. `cryForArrivals` runs off `renderBattle` instead, which also
covers battles that begin at Team Preview (nothing is on the field until an order
is picked). `lastCriedUid` is tracked **per side**, not as a set of everything
already heard, so a Pokémon that switches out and back cries again while an
ordinary re-render stays quiet. Pinned by a test that was confirmed to fail on
purpose.

**Campaign runs on zero EVs, for both sides.** The campaign format sets
`evLimit: 0`, enforced in `Battle.scaleSet` — the one function every battle
Pokémon on either side passes through, chosen so a new team source cannot
reintroduce them. `RandomTeams.randomSet` generates none when the format forbids
them, the hand-written boss spreads in `content.js` keep their `evs` (the
data-validation suite reads them) but `run.js` does not apply them, and
`Campaign.memberSet` strips them on read so the party menu shows the numbers the
battle actually uses. Campaign has no EV yield, no vitamins and no way to
redistribute, so EVs were a permanent edge for the authored teams that the player
could never match. `Campaign.deserialize` re-clamps every member's HP on load,
because a run saved before this stored a condition computed from the higher max.

**Held items that change forme on entry are a real mechanic, separate from Mega
Evolution.** `Mechanics.FORME_CHANGE_ITEMS` maps item id → `{BaseName: Target}`
for the Red and Blue Orbs, Rusted Sword and Shield, Griseous Orb and Core,
Adamant Crystal, Lustrous Globe and the project's own Hero Charm. How they differ
from Megas:

- Applied by `battle.applyHeldFormeChange` the moment the holder is on the
  field. No declaration, no once-per-side limit, no interaction with the Mega
  slot.
- It runs **before entry hazards**, because the new typing is what the hazards
  measure against: Groudon takes 12.5% from Stealth Rock, Primal Groudon 25%. It
  also runs before `onStart`, so the new forme's ability is the one that fires.
- The item cannot be removed — `canRemoveItem` calls `isOwnFormeItem`, covering
  Mega Stones and these together, before *and* after the change.
- These formes stay **selectable species**, unlike Megas. Deliberate: they
  already were, and removing them from Arena was not asked for.

**Ability-driven formes are implemented, and were not before.** Stance Change,
Zen Mode, Schooling, Power Construct, Forecast, Flower Gift, Hunger Switch,
Terashift, Multitype and RKS System all sat in the `COSMETIC` set — inert by
design — so an Aegislash never left Shield forme and a Castform never changed
with the weather. Disguise and Ice Face blocked their hit but never showed the
busted sprite. Two shapes:

- `onFormeCheck(battle, pokemon)` for formes that follow a *condition* (HP,
  weather, held plate). Polled by `battle.checkFormeTriggers` from the same call
  sites as `checkItemTriggers`, plus on every weather change. Must be
  idempotent — it is called far more often than it fires.
- Ordinary hooks (`onBeforeMove`, `onSourceModifyDamage`, `onStart`) for the
  ones that fire on an *event*.

`formeReverts: true` sends the holder back to its set's species in
`clearOnSwitch`. Battle-length changes deliberately omit it: Mega, Primal, Battle
Bond and Power Construct persist. Mega additionally overwrites `baseAbility`, so
it is doubly safe from the revert.

**Zero to Hero is redesigned as a held item.** Transforming on switching *out* is
invisible while it happens, cannot be planned around and cannot be shopped
towards in a roguelite. Palafin now works like every other transformation
Pokémon: hold the **Hero Charm** and it enters battle in Hero Form. The ability
carries no hook.

**This project adds its own items, via `ITEM_ADDITIONS` in
`tools/generate-data.js`.** Three so far — the **Hero Charm** (above), the
**Warp Prism**, which extends Trick Room *the holder sets* from 5 turns to 8, and
the **Wind Sock**, which extends Tailwind *the holder sets* from 4 turns to 7.
Both duration items are the counterpart to Light Clay, the four weather rocks and
Terrain Extender, which Trick Room and Tailwind alone lacked (`roomDuration` /
`tailwindDuration` on the item; `setPseudoWeather` takes the source, and the side
condition branch of `executeMove` reads the setter's item the way Light Clay
already did). Tailwind was the shorter gap of the two: four turns does not even
cover a full switch cycle. They are shaped exactly like generated items so nothing downstream
can tell the difference, and they live in the generator for the same reason
`LEGACY_BASE_STATS` does: `npm run build:data` would otherwise drop them. Both
count as **implemented** in `Items.coverage()` — a forme item has no registry
hooks because the *engine* implements it, so `Items.isFormeItem` keeps it out of
"inert by design" and out of "not simulated", either of which would be a lie.

**The Pokédex lists every forme in the family too** (added 2026-08-14). It had
the same gap the Campaign Pokémon menu was built to close, and the fix is the
same function: `Mechanics.speciesFormes` drives a forme toggle on the entry, and
each forme renders from **its own** species data — sprite, typing, base stats,
BST, tier, abilities and type matchups. A Charizard entry now reaches
Charizard-Mega-X as Fire/**Dragon**, BST 634, OU, Tough Claws, with Rock falling
from ×4 to ×2.

**The browse list is deliberately unchanged**, and that distinction is the whole
design: Mega formes are `transformOnly`, which §5 records as a decision — the
supported route is the base forme holding the stone, so they stay out of the
Team Builder, the format pools *and* the Pokédex list. Being unreachable in the
Pokédex **entry** was the actual defect. Measured before building it: 91 of the
1,269 packaged species are hidden from the list, and all 91 are Mega formes plus
Greninja-Ash. Origin, Primal, Crowned, Hero, Blade, Zen and the Arceus/Silvally
types were never missing — those are ordinary selectable species with their own
entries, so "the Pokédex has no alternate formes" was true of Megas only.

`speciesFormes` wants a set and the Pokédex has none, so it gets a bare
`{species}`: every forme comes back `available: false` with a `formeRoute`
explanation, which is the right answer for a reference screen. "How is this
reached" is a fact about the forme; "can this Pokémon reach it right now" is a
fact about a set the Pokédex does not have — so the route is printed and nothing
is greyed out.

**Two things this surfaced, both fixed with it:**

- **The Campaign forme toggle showed the *set's* ability against another forme's
  stats.** A Charizard viewing Mega-Y read "Blaze" beside Drought's stat line.
  `formeAbility` mirrors the engine instead of restating it: both routes that
  change a forme's ability — `megaEvolve` and `applyHeldFormeChange` — overwrite
  it with `Dex.abilityList(species)[0]`, so that is what is read. The move list
  reads it too, so a Pinsir viewing Mega Pinsir sees its Normal moves as Flying.
- **The Pokédex ability modal counted users over `Dex.allSpecies`**, which is the
  1,178 *selectable* species. Every Mega-only ability therefore reported "0
  species can have it" — Delta Stream and all six Legends: Z-A abilities. It
  counts `packagedSpecies` now and names the transform-only holders separately,
  since "which Pokémon has this" and "which Pokémon can I pick" are different
  questions.

**The Pokémon menu lists every forme in the family, not just the reachable ones.**
`Mechanics.speciesFormes(set)` returns all packaged formes sharing a
`baseSpecies`, each annotated with `available` (can this exact set reach it now)
and `when` (how it is reached). `Mechanics.reachableFormes(set)` is the
narrower "right now" answer and is what `available` is computed from. Greninja
therefore shows Ash-Greninja *and* Greninja-Mega whether or not it holds anything;
the unreachable ones are marked, never hidden. `ABILITY_FORMES` is display
metadata for this — a test asserts every id resolves and that every implemented
forme-changing ability appears, which is how the missing Battle Bond entry (no
Ash-Greninja button) was caught.

**`battle.statBreakdown(pokemon, stat, {reveal})` explains a stat, and must not
be re-derived.** It walks the same six layers as `getStat`, in the same order —
Wonder Room's Def/SpD swap, boost stages, `onModifyStat` (ability then item, the
order `modifyValue` uses), the Ruin quartet, paralysis, Tailwind — and *measures*
each factor by running the engine's own hook and taking the ratio, rather than
recomputing the maths. That is deliberate: a new ability or item appears in the
breakdown automatically, and the numbers cannot drift. A test asserts the product
of the reported factors reproduces `getStat` exactly across 13 scenarios × 5
stats; if you add a stat layer to `getStat`, that test fails until it is added
here too.

`reveal: false` marks the sources the viewer is not entitled to see (the
opponent's ability and item under `hideOpponentDetails`, which is on in every
format). Those still count toward `final`, but `shown` stops at the public
subtotal and `partial` says so — the in-battle panel prints `shown` and a
"+ unrevealed" chip rather than a total it cannot justify. Two relics (Annotated
Trail Map, Pathfinder's Map) buy `revealOpponent`, so leaking held items here for
free would devalue them.

**Meta unlocks are data, in `CampaignContent.UNLOCKS`.** They used to be a stack
of `if`s inside `campaign-ui.finaliseRun` — progression logic in a UI file, where
nothing could test it and each new unlock meant another branch. Each row declares
`requires` (any of `won`, `difficulty`, `assistOnly`, `ascension`, `acts`,
`recruited`, `clears`) and `grants` (`{track, id}`). `Campaign.evaluateUnlocks`
is pure: it takes the profile and the finished run and returns the rows earned,
mutating nothing. Three tracks beyond clearing: **Ascension level reached**,
**Acts chosen for the run**, and **lifetime Pokémon recruited** (a
`records.totalRecruited` counter that rises whether or not the run is cleared).
Relics can be unlockable too — `unlockedBy` keeps them out of `randomRelic`'s
pool until earned, and `run.unlocks.relics` carries the profile's list into the
run. A test asserts every grant target exists and every row is reachable.

**A full party still gets offered recruits.** The recruit prompt has always
handled a full party by asking which member to release; the *offers* were what
gated on `party.length < MAX_PARTY`, which quietly ended team-building the moment
the sixth Pokémon joined. Rewards, shop stock, wild recruit-on-win and the
Specialist's Scout all use `shouldOfferRecruit(run)` instead — always with a free
slot, 45% of the time without. `allowDecline` is forced true when the party is
full, because *forcing* a release would be worse than not offering at all.

**Campaign keeps several runs at once.** `campaign.runs` is an array of slots
(cap `Store.MAX_RUN_SLOTS`, currently 6) with `campaign.activeRunId` naming the
one "Continue" resumes — an id, not an index, so deleting a slot cannot silently
point at a different run. Schema v4. `normalize` migrates a v3 `campaign.activeRun`
into slot one and deletes the old key, so nothing can read a stale copy. A
finished run stays in its slot showing its result until the player deletes it;
starting a new run no longer abandons the old one.

**Terastallization is enabled in Campaign too** (`rules.tera` on the campaign
format). Battle Tower was the one format that deliberately had it off, and that
format was removed on 2026-08-14 — so every remaining format has Tera on.

**`MOVE_OVERRIDES` touches base power and redesigns only — never accuracy, PP
or secondary rates.** Those three used to be rolled back too; that was reversed
by project decision and they now track upstream exactly. A test in
`tests/data-validation.js` greps the table and fails if an override reintroduces
any of them, so this cannot drift back. Battle PP is the fully PP-Upped maximum
(`base * 8/5` in `pokemon.js`), computed from the official base.

**Move data carries a deliberate override table too.** `MOVE_OVERRIDES` in
`tools/generate-data.js` rolls back genuine main-series base-power nerfs and
applies this project's own redesigns:
2-5 hit moves are a flat 25 BP per hit, exactly-2-hit moves 50 BP per hit, and
Wrap/Bind/Fire Spin/Clamp are 2-5 hit attacks that still trap. It sits in the
generator for the same reason the stat table does — a rebuild would otherwise
reinstate every nerf. Hit patterns outside those two shapes (three-hit moves,
Population Bomb) are deliberately untouched. Legends-series values are excluded:
that battle system changes power, timing and effects to suit itself, so its
numbers are not nerfs to reverse.

**A move whose condition the *opponent* controls is dead weight, and several were
made unconditional for exactly that reason.** The test applied: can the user do
anything to satisfy it? If not, it is not a trade-off, it is a coin flip on team
preview. Changed 2026-08-13:

- **Dream Eater** no longer needs a sleeping target. It keeps its drain.
- **Poltergeist** no longer needs the target to be holding an item.
- **Thief** steals even while the user is already holding something — the user's
  item is **replaced**, and the old one is destroyed (not handed over; that is
  Trick and Switcheroo). **Covet deliberately keeps** the official restriction,
  as the conservative twin.
- **Magician** and **Pickpocket** match Thief: they steal into an occupied slot,
  discarding what the holder had.

Left conditional on purpose, because the *user* controls them: **Snore** (needs
the user asleep, which its own Rest provides), **Fling** (consumes the user's own
item, which is its cost) and **Fake Out**.

**Focus Punch was the exception that failed its own test, and was redesigned**
(2026-08-13). It was kept on the conditional list because Substitute exists — but
at -3 priority "the user was hit first" is the default case, not the exception,
so satisfying the condition meant spending a *different* move first, every time.
That is a combo, not a trade-off. The condition is gone; it now always executes
and costs **70% accuracy** instead (150 BP at 70% is 105 expected power, before
the -3 priority is counted). Three things moved together and all three are needed:
the branch in `moveSpecialFailure`, the AI's `selfDefeating` penalty (−800 unless
behind a Substitute — leaving it would have had the AI refusing a move that now
works), and the packaged description, because a Pokédex entry that states a
removed condition is exactly what the override tables exist to prevent.

**This is the one accuracy entry in `MOVE_OVERRIDES`, and the guard was widened
rather than weakened.** The standing rule below still holds — accuracy, PP and
secondary rates track upstream — and `tests/data-validation.js` still greps the
table for violations. Focus Punch is a *named* exemption alongside Upper Hand's
nulled secondary, so anything unnamed still fails. The accuracy is pinned as a
literal 70 in the test rather than compared against the override, which would
have agreed with itself whatever the value became.

**Fling now actually throws the item** (fixed 2026-08-13). Two separate halves were
missing and it had been reported only as one:

- The item **was never consumed** — the user threw it and kept it. It now goes
  through `consumeItem`, which makes the rest correct for free: `consumedItem` is
  set for Recycle, Unburden triggers, and `recordItemLoss` lets Pickup find it.
- `fling.status` and `fling.volatileStatus` were **declared in the packaged data
  and read by nothing** — only `fling.basePower` was ever used — so a flung Flame
  Orb never burned, a Toxic Orb never poisoned, a Light Ball never paralysed and a
  King's Rock never flinched. All four now apply.

The failure guard is `!canRemoveItem(attacker, attacker)` rather than
`!attacker.item`, so a **Mega Stone cannot be flung**: that was possible before,
and adding consumption would have destroyed it, breaking the rule that the stone
can never be removed. Passing the attacker as its own source deliberately bypasses
Sticky Hold — an ability that stops *others* taking your item should not stop you
using it. A flung Berry is eaten by the target, via the force-eat path below.

**Berries separate their trigger from their effect, and that is what makes a
force-eat possible.** Every Berry used to fuse the two inside `onUpdate` —
`healBerry` returned early above its HP threshold — so there was no way to apply a
Berry's effect except by satisfying its own condition. One structural fact, four
broken mechanics:

- **Bug Bite** and **Pluck** did not exist at all.
- **Stuff Cheeks** and **Tea Time** *appeared* to work but consumed the Berry for
  **nothing**: they called `eatBerry`, which consumes and fires the ability hook but
  never runs the effect. Stuff Cheeks paid a Sitrus Berry for its +2 Defence and
  threw the healing away. This is the sharp version of §8's rule — the moves did not
  throw, printed a sensible message, and were silently half-inert.
- A flung Berry was destroyed rather than eaten.

`items.js` now defines Berries through `eatableBerry(name, {trigger, effect})` and
exposes `onForceEat`; `battle.forceEatBerry(eater, itemId)` applies the effect on
demand. Three rules for it:

- **The caller owns removing the Berry from its holder**, because the eater is
  usually not the holder — Bug Bite eats the *target's* Berry.
- It sets `ateBerry` on the **eater only**, so Belch is enabled for whoever actually
  ate it and not for the thrower, and Cheek Pouch fires for the right Pokémon.
- A Berry with no eater-side effect — the seventeen type-resist Berries — has no
  `onForceEat` and correctly does nothing when force-fed.

Tea Time also only ever ate the *user's* Berry; it now reaches every active Pokémon,
which is the whole move.

Two guards are load-bearing on all the stealing paths, and neither Magician nor
Pickpocket had them before — **Pickpocket could steal a Mega Stone**, a real
violation of the "cannot be removed" rule below. Both now route through
`stealHeldItem`, which checks `canRemoveItem(victim)` *and*
`isOwnFormeItem(thief)`, so neither a victim's nor a thief's own Mega Stone or
forme item can move.

**Pickup is redesigned as a scavenging ability.** The official version recovers an
item an ally used, which is a doubles mechanic and did nothing here — it sat in
`COSMETIC` as inert. It now takes, on entry, the **last item destroyed in the
battle**, replacing whatever the holder had. `battle.recordItemLoss` is the single
choke point, and what it excludes matters:

- **Berries are never recorded** (keyed on `isBerry`, so it holds however the berry
  left). Handing back a just-eaten Sitrus would make Pickup a second life rather
  than scavenging. This was an explicit project decision.
- **An item that merely changed hands is not recorded** — Thief, Magician,
  Pickpocket, Trick, Switcheroo, Bestow. It still exists on somebody, so recovering
  it would put **two copies of one item** in the battle.

What remains is a non-berry consumable that was spent, or an item destroyed by
Knock Off, Corrosive Gas, or a replacement steal. The record clears on pickup, so
one Pokémon takes it rather than every Pickup holder collecting the same item.

All of these have description overrides in `MOVE_OVERRIDES` / `ABILITY_OVERRIDES`,
because the upstream text states the removed condition and **a Pokédex entry that
misstates the mechanic is the thing those tables exist to prevent**. The overrides
only apply on `npm run build:data`, which was run.

**A locked move that fails releases its lock** (fixed 2026-08-14, reported from
a real battle log). `finishLockedMove` released the lock on failure for Rollout
and Ice Ball **only**, so a rampage that could never work locked its user in
forever: a Dragonite threw Outrage into a Weezing-Galar for six consecutive
turns, every one of them "It doesn't affect...", because Fairy is immune to
Dragon, `remaining` never decremented, and the lock ended when Dragonite fainted
rather than when the rampage did. Thrash and Petal Dance had it too.

The five callers that pass `success = false` are all genuine move *failures* —
a miss, a semi-invulnerable target, Protect, a `moveSpecialFailure`, and type
immunity — and every one ends a rampage in the games. Being unable to *act*
(sleep, full paralysis, flinch) never reaches `executeMove`, so those still
pause the lock rather than break it, which is also correct. **No confusion on
the failure path**: a rampage broken early does not fatigue its user, only one
that runs its course does.

The control matters here more than usual, because the obvious over-fix is to
release the lock unconditionally — which would make Outrage a single-turn move
and delete the drawback that pays for its power. A second test asserts a
connecting rampage still runs 2-3 turns and still confuses; it must keep passing
while the first one fails.

**Five moves are unconditional by design.** Sucker Punch, Thunderclap, First
Impression, Upper Hand and **Grassy Glide** keep their positive priority but lost
their activation conditions (and Upper Hand its flinch). Grassy Glide's +1 is
applied in `runTurn` with no Grassy Terrain check — the packaged move still has
priority 0, so read the engine, not the data. Fake Out **keeps** its first-turn rule —
it shared a line with First Impression in `moveSpecialFailure`, so check that
line before assuming either behaves like the games. Dark Void is restricted to
Darkrai in `moveSpecialFailure`, which runs at use time and so also blocks copied
or called versions. Destiny Bond's modern consecutive-use failure is implemented
there as well; the engine previously had the old repeatable version.

**Eleven species keep their pre-nerf base stats on purpose.** Aegislash (both
formes), Cresselia, Zacian and Zamazenta (both formes each), and all four
Treasures of Ruin use the earlier, stronger spreads rather than the values in
current @pkmn data. The override lives in `LEGACY_BASE_STATS` at the top of
`tools/generate-data.js` — **not** in the packaged data — because
`npm run build:data` would otherwise silently restore the nerfs. Only the six
base stats are overridden; typing, learnset, abilities and evolutions always come
from upstream, and `bst` is recomputed from the six values rather than hardcoded.
Legends-series stat values (Arceus, Z-A) are deliberately excluded: those
compensate for abilities those games omit (Huge Power, Pure Power, Flower Gift),
which is not a nerf to reverse. `tests/data-validation.js` asserts all eleven
spreads in both `game-data.js` and `pokemon.json`, so a rebuild that loses them
fails the suite.

**Abilities carry a deliberate override project too — in code, not data.**
Unlike moves and base stats, ability behaviour lives in `src/core/abilities.js`
and the engine, so there is no generator table for it; only the *descriptions*
are overridden, via `ABILITY_OVERRIDES` in `tools/generate-data.js` (a rebuild
would otherwise restore upstream text that contradicts the code). The full
table is in the README. The shape of it:

- Restored to earlier, stronger behaviour: Magic Guard (+ Toxic Spikes and
  full-paralysis immunity), Parental Bond (2nd hit 50%, still a separate hit),
  Gale Wings (any HP), Aerilate/Pixilate/Refrigerate (1.3x), Transistor (1.5x),
  Disguise (no HP cost), Protean/Libero (every move), Intrepid Sword and
  Dauntless Shield (every entry), Battle Bond (legacy Ash-Greninja
  transformation), Mold Breaker/Turboblaze/Teravolt (also ignore Dark/Fairy
  Aura).
- Redesigned outright: **Supreme Overlord** is now an entry booster (+1 Atk,
  no fallen-ally scaling), **Download** always gives +1 Atk *and* +1 SpA, and
  **Cloud Nine / Air Lock** delete the active weather on entry rather than
  suppressing it.
- Deliberately **not** restored, and asserted by tests: Drought, Drizzle, Sand
  Stream, Snow Warning (finite duration), Shadow Tag, Arena Trap, Magnet Pull,
  Effect Spore, Prankster, Moody, Intimidate, Trace. Galvanize keeps 1.2x — it
  postdates the -ate nerf and never had 1.3x, so it is not a nerf to reverse.
  Legends-series abilities and values are excluded, as everywhere else.

**A Substitute soaks status and stat drops, not only volatiles** (fixed
2026-08-13). The check lived in exactly one function — `addVolatile` — so the
doll blocked confusion, Attract and Leech Seed while paralysis, burn, poison,
sleep and every stat drop went straight through it. Substitute's whole purpose is
buying a free turn against status, so it read far weaker than it should and
quietly favoured status-heavy teams.

`battle.blockedBySubstitute(target, source)` is now consulted by `setStatus` and
`boost` as well. It needed the move's flags, which neither function receives, so
`executeMove` records `activeMove` / `activeMoveUser` for the duration of the
move — saved and restored, because moves nest (Metronome, Copycat, Sleep Talk).
Threading a `move` argument through every call site instead would have meant
editing dozens and silently missing some, which is how a guard ends up existing
and never firing.

Four exclusions, each a real case rather than defensiveness:

- **Sound moves and Infiltrator go through**, as in the games. Note Growl and
  Screech are *sound* moves — they are the wrong thing to test a block with, and
  using them made the fix look broken when it was correct.
- **`source === target`** — Rest and Swords Dance from behind your own doll.
- **The source is not the move's user** — Static and Flame Body punish the
  attacker, and those are ability effects, not a move aimed at the attacker's
  Substitute. Verified by measurement: 9/40 paralysed with a Substitute and 9/40
  without.
- **Only stat *drops*** are soaked. Swagger and Flatter still land, because
  blocking those would be a silent nerf hiding inside a bug fix.

`hitSubstituteThisMove` is what covers a hit that *broke* the doll: the sub is
gone from `volatiles` by the time a secondary applies, but it still took the hit.

**Primal weather is a different mechanic from rain and sun, and was not**
(fixed 2026-08-14, reported from real play). `Desolate Land` and
`Primordial Sea` were plain `weatherSetter` calls, so Primal Groudon made
ordinary sun and Primal Kyogre ordinary rain — the abilities existed, fired, and
were indistinguishable from Drought and Drizzle.

`field.weatherPrimal` now records which primal ability owns the weather, and
three things follow from it:

- **The opposing element fails outright** — Fire under heavy rain, Water under
  extremely harsh sunlight — rather than being halved. Damaging moves only: a
  Will-O-Wisp still works, as in the games. The type is read through `moveType`,
  so a plate-typed Judgment or an `-ate`'d move is refused on the type it will
  actually hit as.
- **Nothing ordinary can replace it.** `setWeather` refuses a non-primal
  weather while primal weather is up, and `clearWeather` needs `force` — so
  **Air Lock and Cloud Nine cannot delete it**, even though this project
  redesigned them to delete ordinary weather. Letting a Psyduck switch-in wipe
  Primal Groudon's sun would make the ability ordinary again.
- **It has no turn counter.** `weatherTurns` is 0, which `runResidual` reads as
  "does not tick", and `clearOnSwitch` ends it when its setter leaves the field.

It still reads as `rain` / `sun` for everything else **on purpose**: Swift Swim,
Chlorophyll, Thunder's accuracy, Solar Beam and the type modifiers are all
correct under primal weather, and a separate weather id would have meant
auditing every one of them.

**`AI.cannotAffect` gained the same refusal**, and had to. A refusal the AI does
not know about is a move it throws every turn, because nothing in the loop can
change — §8's Thunder-Wave-into-Gliscor bug exactly.

**That covered the attacks and missed the weather moves** (fixed 2026-08-14,
reported from a real Rebirth battle: a Ludicolo used Rain Dance under Desolate
Land and the log read "But it failed!"). The type half worked — a Water move
under Desolate Land already scored −900 — but **`cannotAffect` is about what the
target can be hurt by**, and a weather move is not aimed at the target at all:
it exits the `aimedAtFoePokemon` guard on the first line, so nothing was
checking it. `AI.fieldMoveFails` is the separate check `willFail` now consults,
mirroring `setWeather` / `setTerrain`:

- primal weather refuses every ordinary weather outright (the reported case);
- setting the weather or terrain **already up** does nothing.

**A move that does something else as well is excluded**, which is the part a
careless version gets wrong: Chilly Reception still pivots when its snow fails,
and refusing it would throw away a switch the AI wanted. A control asserts
exactly that.

The general shape is worth naming, because this is the third instance: *the
engine has several independent refusal paths, and each one needs the AI to be
told separately.* Type immunity, ability and item interception, primal weather's
element block, priority under Psychic Terrain, and now field moves — all live in
different places in `executeMove`, and `willFail` has had to grow a mirror for
each.

**Measured, and the denominator is the whole story:** `tools/ai-ladder.js` is
*byte-identical* before and after, because **0 of 400** random-format teams
carry a primal Orb and **0 of 400** carry a weather-setting move at all. The
ladder is structurally blind to this, so its silence is neither confirmation nor
contradiction — the targeted test is the evidence.

That zero is also the reason the report came from Rebirth Mode specifically: the
generic set generator never produces a weather move, so the only Rain Dance on
the field was the one `applyPlanToSet` forces onto a Rain doctrine's enabler
(§5). **Weather teams are therefore a Rebirth-only phenomenon right now**, which
is worth knowing before reading a weather-related report as a general AI fault.

**There are three weather-persistence states, not two** (added 2026-08-14 for
Rebirth Mode). `ENDLESS` in `battle.js` is the third, and it exists because the
first two are both wrong for a declared opening field:

| state | turn counter | can ordinary weather replace it? | Air Lock / Cloud Nine? |
| --- | --- | --- | --- |
| ordinary | yes, ticks in `runResidual` | yes | yes |
| **endless** | **none** | **yes** | **yes** |
| primal | none | no | no |

The requirement was primal weather's *persistence* without primal weather's
*lock*, so reusing `field.weatherPrimal` was explicitly not an option: an
opposing weather setter switching in, or Air Lock, must still beat a Rebirth
team's sun.

**`ENDLESS` is `Infinity`, and that is what makes it cost nothing.** Every read
in the engine asks `> 0`, which stays true; every tick is `--x <= 0`, which
`Infinity` never satisfies. So the effect persists while *every removal path* —
`setWeather` from a new setter, `clearWeather`, Defog, Brick Break, a
replacement terrain, Steel Roller — keeps working with no new branch anywhere.
It is an absent counter rather than a large one; a large one would eventually
expire, and this cannot. Three consequences worth knowing:

- **It must never reach anything serialised.** `JSON.stringify(Infinity)` is
  `null`. Battles are never serialised — only their *config* is, and a config
  declares the effect (`{weather: 'sun'}`) rather than its duration — so this
  stays inside the live battle object. A test walks a Rebirth config and fails
  on any non-finite number in it.
- **The UI has to print it.** `renderFieldConditions` renders a non-finite
  counter as `∞`; without that the chip reads "Reflect Infinity", which looks
  like a bug rather than the point.
- **It applies to every field type through one function.**
  `battle.applyFieldEffects(spec)` takes a plain-JSON description
  (`{side, weather, terrain, pseudoWeather, own, foe, label}`) and sets each
  piece endless. `addSideCondition` already accepted a caller-supplied duration
  and hazards never had a counter, so neither needed changing.

**It applies after the leads arrive, and both halves of that are deliberate.**
`beginBattleProper` calls it last, after `onStart`. So a lead's own Drought or
Drizzle has already fired and is *overridden* by the declared plan — which is
what "this team's field" means, and the player can take it back by re-triggering
their own setter — and **pre-laid hazards do not hit the Pokémon already
standing on them**. They bite from the first switch, exactly as hazards set
during a battle do. Applying them first would be a free hit on turn zero that no
in-game mechanic produces.

**Trick Room, Magic Room and Wonder Room now end when used a second time**, as
in the games. The engine refused every re-use, which was invisible while every
room ran out on its own and became the thing standing between an endless Trick
Room and having any counterplay at all — nothing else in the game removes one.
`Mechanics.SELF_CANCELLING_ROOMS` is the single list and **Gravity is
deliberately absent**, because it is not self-cancelling there either. The AI
half is in `docs/AI_DESIGN.md` §8, with its denominator.

**One doctrine has no direct removal, and that is stated rather than hidden.**
Hyper Offense's endless Tailwind cannot be Defogged — Defog does not clear
Tailwind in the games either, and this project did not change that. Its
counterplay is the player's own Trick Room (which inverts what the Tailwind
bought) and priority moves, which §5 makes unconditional here. Everything else
has a direct answer: weather to an opposing setter or Air Lock, terrain to
another terrain, screens to Defog or Brick Break, hazards to Defog / Rapid Spin /
Tidy Up, Toxic Spikes to a grounded Poison type, rooms to themselves.

**Rebirth Mode: a new run started inside a cleared one.** A button on a run the
player has *won* (`Campaign.canRebirth`) starts a fresh run carrying the party
and the relics, resetting everything else, against opposition that is complete
from the first node.

- **Carried:** the party (their sets, moves, held items, re-levelled to
  `STARTING_LEVEL` and fully healed) and the relics. **Reset:** team level, Act,
  map, credits, Beacons, bag, rerolls.
- **A clear can only be spent once.** `createRebirthRun` marks the finished run
  `rebirthUsed`; without it the same victory sits in its slot and can be spent
  over and over for an unlimited supply of fully-built starting teams.
- **`createRebirthRun` wraps `createRun`, it does not fork it.** The reset is the
  long list and the carry-over is the short one — `teamLevel` already starts at
  `STARTING_LEVEL` and everything else is already fresh — so only three things
  are written back over the new run. It also skips the draft: the party exists.
- **The party is built directly, not through `addPartyMember`**, which increments
  `stats.recruits` — and that counter feeds the lifetime `totalRecruited` unlock
  track, so routing six carried-over Pokémon through it would award six recruits
  nobody recruited.
- **`buildBattleConfig` is the whole attachment point.** Every opposing team in
  the game already funnels through it, so one branch gives Trainers, Elites and
  bosses a full themed six at Expert with its doctrine on the field. Wild and
  Rare Encounters are excluded on purpose: both are *one* Pokémon by definition,
  and six of them would be a different node type rather than a harder one.
- **Opponents are built from `TEAM_PLANS`, and the plan comes from the run RNG.**
  Four of the six are drafted for plan fit and two are filled on general quality
  (`REBIRTH.themedMembers`); six fitted members produces near-clones on the
  narrow plans, and a team with no answer to anything is easier, not harder.
  A boss **declares** its plan (`boss.teamPlan`) so a Rain boss cannot open with
  a sandstorm.
- **The enabler is guaranteed, and forced onto exactly one member.** A first
  version forced it on every member that could learn it and produced five of six
  screens-team members carrying Reflect. A second left it to the fit ranking and
  shipped **13 of 30** Sticky Web teams with no Sticky Web, because so few
  species in the band learn it; a targeted draft closes that.
- **A team must not be able to delete its own doctrine.** The two quality-fill
  members knew nothing about plans, so a Sun team could draft a Drizzle holder
  or roll a Rain Dance — measured at 4 in 200 teams, and observed live as a
  "Sun" opponent whose own Primarina used Rain Dance twice.
  `stripDoctrineConflicts` swaps the ability or the move. It reads
  **`setsWeather` / `setsTerrain` / `setsPrimalWeather`, declared on the ability
  definitions**, because the weather is a closure argument in the hook and there
  is otherwise no way to ask an ability what it sets. Those flags are read by
  `run.js`, so they are not the §8 declared-but-inert family.
- **Recruits gain a theme selection.** A Rebirth recruit prompt offers the eight
  specialised plans; picking one redraws the offer biased toward it. Free, and
  **once** per prompt — a free unlimited redraw is a slot machine, and charging a
  reroll makes it the reroll button with extra steps. A reroll afterwards *keeps*
  the theme. The bias is signed, for the reason `Advisor.recruitScore` records
  about Speed: a base-160 Pokémon is a liability on a Trick Room team, not merely
  unhelpful. Seen on the scratch build before that — a Trick Room scout returned
  Ninjask.
- **It reads the player's chosen theme, never `run.assist.plan`.** An Assist
  setting is toggleable mid-run, so letting it decide what is *offered* would
  desynchronise a seeded run. A choice made inside the prompt is a run action,
  like a reroll, and reproduces from the seed plus the command.
- **Better rewards:** one more option on every reward screen, a rarity nudge
  inside `rarityRoll` (so held-item rewards, treasure and shop stock all get it
  from one place) and a 1.4x credit multiplier applied in `buildBattleConfig`,
  the one place every battle payout passes through.
- **The opposition is drawn from the end of the power curve, not the start.**
  A rebirth resets the Act and `powerBand` is a function of `runProgress`, so
  without a floor (`REBIRTH.progressFloor`) six fully-evolved carry-overs met
  Geodude and Dwebble on node one — measured, a Sand trainer fielding Onix,
  Hippopotas, Dwebble, Geodude and Dratini. The floor is applied inside
  `powerBand` and **not** to `runProgress` itself, because the recruitment tier
  gate and reward rarity read that and must keep meaning "how far into the run
  are you": a rebirth must not hand out legendaries on node one.
- **The Act-1 level ramp does not apply.** Every reason it exists — one Pokémon,
  no items, no relics for the whole first Act — is false in a rebirth.
- **`REBIRTH.enemyLevelOffset` is the mode's only difficulty dial**, and §6
  records what it was measured at. Extra Beacons were tried and dropped: they
  took the mode *above* the base game's clear rate.

**A ninth team plan, Sandstorm**, was added with it. `sandlord` is the boss it
existed for — "Sandstorm Grind" had no row to declare — and it is a real
archetype the advisor already had the vocabulary for (Sand Stream, Sand Rush,
Smooth Rock as its Damp Rock). It is selectable in the Assist plan picker like
the other eight.

**Every boss declares a `teamPlan`, and it is not the same field as `plan`.**
`plan` is the prose name shown to the player ("Rain Offence"); `teamPlan` is the
`TEAM_PLANS` id the team is actually built around. Until this existed the bosses
named `raincaller` and `trickroom` only *implied* their theme through their
movesets and nothing in the code could act on it. It now decides the boss's
Rebirth doctrine and which species the Ascension "Hardened Bosses" filler member
is drafted from. A test asserts every id resolves **and** that no authored boss
member can delete its own doctrine, since a boss's six is used verbatim and
never passes through the draft's conflict strip.

**The status Orbs fire on entry, not at the end of the turn** (redesigned
2026-08-14, requested). Officially Toxic Orb and Flame Orb activate in the
residual phase, which costs their holder the whole turn it switches in: a Guts
attacker's first turn is unboosted, a Poison Heal Gliscor's first turn does not
heal, a Facade user's first turn is at half power. That delay is a cost paid for
a drawback the holder *wants*, on the one turn it can least afford it — the same
shape as the conditions §5 removed from Dream Eater and Poltergeist, except
self-inflicted.

Both Orbs now carry `onStart` as well as `onResidual`, through **one shared
function** so the two cannot drift. The residual hook is not a leftover and
deleting it breaks a test: it covers an Orb that arrives mid-battle by Trick,
Switcheroo or Bestow, and a holder whose status is *cured* (a Lum Berry, Natural
Cure on a switch, Heal Bell) and should be re-afflicted.

It lands after entry hazards and after `onStart` abilities, because that is
where item `onStart` already runs on both entry paths — so Toxic Spikes poison
first and the Orb correctly does nothing, rather than the two fighting. An
existing status is never overwritten.

`ITEM_OVERRIDES` gained both descriptions, because upstream says "at the end of
every turn" and a Pokédex entry that misstates the mechanic is what that table
exists to prevent. `npm run build:data` was re-run.

**Residual healing is a real quantity the AI can read: `battle.residualSwing`**
(added 2026-08-14, requested). It returns the net HP a Pokémon will gain or lose
in the coming residual phase, and it is what makes a turn spent behind Protect
worth something — a Leftovers wall or a Poison Heal Gliscor banks HP by
stalling, a burned attacker pays for it. The AI read **none** of this before:
Protect scored a flat +25, plus a flat +25 if the foe was badly poisoned.

Three rules hold it together:

- **It is a prediction and must stay one.** Running the real `onResidual` hooks
  would heal the Pokémon, write to the log and advance the toxic counter, and
  §5's rule is that merely asking what a turn would do must never change
  anything. So the engine-side sources are mirrored from `endOfTurn` in the same
  order, and the ability/item halves are read from a declared
  **`residualFraction(battle, pokemon)`** — a signed fraction of max HP —
  rather than by execution. The one hook it does call is `onWeatherDamage`,
  which is a pure predicate in every implementation.
- **Mirroring is the drift risk this project keeps finding, so it is pinned the
  way `statBreakdown` is:** a test plays a real turn across 16 scenarios
  (Leftovers, Black Sludge both ways, Sticky Barb, burn, poison, toxic at two
  counters, Poison Heal, Magic Guard, Leech Seed, Aqua Ring, curse, Salt Cure,
  and one that should read exactly 0) and asserts the observed HP delta equals
  the prediction. It also asserts how many scenarios actually moved HP, so a
  mirror that returns 0 everywhere cannot pass by being vacuously right.
- **Healing is capped at the HP actually missing.** That is why the Protect term
  is not a flat bonus for holding a healing item: Leftovers is worth nothing at
  full HP, and a healthy Pokémon should still be attacking. A control asserts
  exactly that, and another asserts a *bleeding* Pokémon is penalised for
  stalling rather than rewarded.

`AI.explainChoice` reports it as `residual: {self, foe}`, so "why did it Protect
instead of attacking?" is answerable from the in-battle panel.

**The AI knows how long Rest lasts, and what Sleep Talk is for** (added
2026-08-14, requested). Three separate gaps, all measured:

- **`AI.restingTurns`** — Rest sets `sleepTurns = 2`, spent one per move
  attempt, so the user is helpless for two turns and acts again on the third.
  That cost is now priced against what the opponent can do with two free turns.
  **Early Bird** halves it; **Sleep Talk or Snore in the moveset removes it
  entirely**, which is precisely why those sets pair the two.
- **Sleep Talk was scored at nothing.** Asleep it is the only move that works;
  awake it does nothing at all. Both directions are now large.
- **While asleep, no other move happens** — the §8 type-immunity lesson again:
  a move that cannot execute must never outscore one that can. Without this a
  sleeping Pokémon picked whatever scored highest (usually a knockout worth
  ~390) and printed "is fast asleep" while the Sleep Talk beside it sat unused.
  It is a large penalty rather than a refusal, because sleep ends on its own.

**The boundary is `sleepTurns > 0`, not `>= 0`**, and getting it wrong throws
away the turn the sleep ends: at 1 the counter decrements to 0 and the Pokémon
is *still* asleep, and only at 0 does it wake and act. A test pins the waking
turn specifically.

**Rest is a status cure and that was worth nothing** (fixed 2026-08-14, from a
real log). A badly poisoned Dondozo rated Rest identically to a clean one —
literally the same number — because `RECOVERY_MOVES` only ever priced the HP.
It now earns credit scaled by what the status is actually costing, which
`residualSwing` already measures. Measured on the reported position: at 50% HP
the choice flips from Curse (110) to Rest (145) once poison is on.

Worth knowing before hunting for more of this: **in that report the AI was
right.** Reconstructed, it takes Rest from 35% HP down whenever Rest is in the
moveset; the Dondozo in the log did not have it. `RandomTeams` gives Dondozo
Rest 32% of the time and Curse **0%**, so that moveset came from level-ups and
TMs. Check what the Pokémon was actually carrying before suspecting the chooser
— the same conclusion §8 records for the Kingambit/Sucker Punch report.

**Focus Punch has no drawback left but its accuracy** (2026-08-14, by project
decision). The -3 priority is gone as well as the condition. The reasoning is
the one that removed the condition: two drawbacks were paying for one move, and
the 70% accuracy already replaced the condition — 150 BP at 70% is 105 expected
power, which is what the move now costs. `priority: 0` lives in `MOVE_OVERRIDES`
as a redesign, which that table is for; the guard in `tests/data-validation.js`
forbids accuracy, PP and secondary rates, and Focus Punch's accuracy is a named
exemption there.

Two tests had to move with it, and **both were caught by their own guards rather
than by reading the code**: the behavioural test asserts "the user must actually
have been hit first, or this proves nothing", which stopped being true the
moment the user was no longer automatically last (its fixture now forces the
order with a Choice Scarf on the foe); and the jsdom move-hover-card test used
Focus Punch precisely because it *had* priority, so it stopped exercising the
Priority row it exists to check (it uses Sucker Punch now).

**The Battle Shop offers a Ring Target to a Pokémon a type immunity blanks**
(added 2026-08-14, requested). Spectrier's Ghost moves do literally nothing to a
Normal type and Regieleki's Electric moves do literally nothing to a Ground
type; for those two the item is not a marginal upgrade, it is the difference
between having a game and not. It belongs in the *synergy* tier rather than the
fit-scored one for the reason that tier exists: nothing about Ring Target's stat
line says "somebody here attacks with one type", so a fit score structurally
cannot find it.

**Derived from the type chart, never a species list.** A member qualifies when
some single defending type is immune to *every* attacking type it carries, so a
Dark and Steel attacker does not qualify (nothing is immune to both) and a new
species or a newly taught move is covered with nothing to maintain. Two guards:
a Pokémon with no attacking moves at all is a wall, not a blanked attacker (the
condition is vacuously true for it otherwise), and the Ring Target Clause still
holds — a party already holding one is never offered a second.

**Ring Target is offensive, not defensive** (redesigned 2026-08-14). Upstream
strips the *holder's own* type immunities, which is a pure drawback nobody
equips on purpose — it sat in the item pool doing nothing but harm. It now lets
the holder's attacks land for **neutral damage on a target that would be immune
by type**: a Ring Target Snorlax's Body Slam hits Gengar.

Two boundaries, both asserted:

- **Type immunity only.** An ability immunity (Levitate, Flash Fire, Water
  Absorb) is intercepted on a separate path in `executeMove` and never reaches
  the type chart as a zero, so Ring Target does not quietly beat those too.
- **The old behaviour is gone, not joined.** A Ring Target Gengar keeps its own
  Normal immunity.

It is read off the **attacker**, which `effectiveness` was never given — so the
function took an optional `source`, falling back to `activeMoveUser` (the same
escape hatch the Substitute rework added). **Every call site that knows the
attacker has to pass it**, or the item is half-implemented in a way that is
invisible until someone plays around it. There are seven, and they split evenly:
the damage path and `dynamicBasePower` (attacker), `estimateDamage`, `scoreMove`
and the Choice-lock bench check (`self`), `switchInSurvival`'s resist test
(`foe` — a Ring Target on the *opponent* means the switch-in cannot count on its
immunity), the calculator and the move-button readout.

Measured both directions, since they run through different code:

| | est. damage | score | AI picks |
| --- | --- | --- | --- |
| Rotom-Wash, no item | Thunderbolt **0** | −500 | Shadow Ball |
| Rotom-Wash, Ring Target | Thunderbolt **71** | **+39** | **Thunderbolt** |

and on defence, `incomingThreat` to an Electric-immune Garchomp goes **0 → 71**
when the foe holds one, so the AI stops trusting an immunity it no longer has.

This also added **`ITEM_OVERRIDES`** to `tools/generate-data.js`, the item
counterpart of `ABILITY_OVERRIDES`, because upstream's Ring Target text states
the mechanic that was replaced.

**It is strong enough to need two guard rails, and both are deliberate.**
Measured: an Espeon at +3 Calm Mind OHKOs a **Tyranitar** with Stored Power —
Dark is that move's only hard answer and the item deletes it.

- **`publicItem` — a deliberate hole in `hideOpponentDetails`.** Ring Target is
  the only item that carries it, and it is visible on the mon card *and at Team
  Preview* from turn one, like a Mega Stone rather than a Choice Band. An
  opponent who cannot see it cannot plan around it and finds out by losing a
  Pokémon. It also announces itself in the log when it pierces, which is a
  separate thing from visibility. Anything else added here has to justify
  itself against the two relics that are *sold* on revealing opponent details.
- **`uniquePerSide` — the Ring Target Clause.** One per team, in every format,
  whether or not Item Clause is on. `Validation` enforces it at team building
  and **`battle.canReceiveItem` enforces it in battle**, so a second copy cannot
  be assembled with Trick, Switcheroo, Bestow, Thief, Covet, Magician,
  Pickpocket or Pickup. One predicate called from all seven, for the reason §8
  records about the duplicated release path — the one route somebody forgets is
  the one that ships. **Fainted teammates still count**, or the clause has an
  obvious hole (spend the holder, then Trick a second one in), and a battle
  clause with a known hole is worse than none because it reads as enforced.

A swap is refused *whole* rather than half-applied: Trick checks the clause for
both receiving sides before moving anything.

**Every species keeps every ability it has ever had** (2026-08-14). The
generator unions ability slots across generations 3-8 on top of the current
gen-9 set, so Dream World abilities that were later replaced come back: **Gengar
keeps Levitate, the Litwick line keeps Shadow Tag**, Zapdos keeps Lightning Rod,
the legendary beasts keep their DW absorbs. 26 species gain one; all 26 were
already implemented, so the packaged ability count did not move.

**They are appended, never inserted, and that is load-bearing.**
`Dex.abilityList` reads `Object.values(abilities)`, integer-like keys ('0', '1')
always enumerate first, and the legacy entries use `L*` keys so they land after
'0', '1' and 'H'. A Mega forme takes `abilityList(species)[0]` as its ability —
pushing a legacy entry to the front would silently re-ability every Mega in the
game. A test pins slot 0 for Gengar, Arceus, Silvally, Aegislash, Rayquaza and
Chandelure for exactly that reason.

**Only species that predate Generation 8 qualify**, and the reason is
reachability rather than provenance. A first pass restored 26, eleven of which
were the Legends: Arceus species (the Hisuian formes, Kleavor, Basculegion,
Enamorus) — whose Gen 8 dataset abilities differ from their Gen 9 ones. Those
earlier values were **never usable by anyone**: Legends: Arceus has no abilities
in its battle system at all, and the species were not legal in Sword/Shield, so
Scarlet/Violet shipped the first values that ever functioned. An ability no
released battle system read was not *removed*, which is what this restoration is
for — Gengar's Levitate ran for six generations, Hisuian Growlithe's Justified
for none.

**They are not Smogon inventions**, which is worth recording because it is the
obvious guess and it is wrong: Showdown flags its own creations
`isNonstandard: 'CAP'` (Syclant, Revenankh), and these are flagged `'Future'`,
meaning official data for a species newer than the dex being queried.

`s.gen < 8` separates the two groups exactly — all eleven excluded are Gen 8,
all fifteen kept are Gen 1-7 — so there is no case-by-case list to maintain. A
test asserts both halves.

**Three abilities redesigned** (2026-08-14), all with `ABILITY_OVERRIDES` text
because upstream states the old mechanic:

- **Heatproof is a full Fire immunity**, not a halving. Shaped as an
  `onTryHit` returning `'absorb'` like Flash Fire, rather than a 0x damage
  modifier, so it refuses the move on the path `estimateDamage` and
  `AI.cannotAffect` already read. Status moves still land, as with every other
  absorber. **The AI's name-matched immunity table gained it** — without that it
  throws Fire at the holder every turn (§8).
- **Light Metal**: +1 Speed on entry.
- **Heavy Metal**: -2 Speed, +1 Defence, +1 Attack on entry.

Both Metals keep their weight multipliers. The redesign exists because
weight-only reaches Low Kick, Grass Knot and Heat Crash and nothing else — an
ability slot spent on a coin flip about the opponent's moveset.

**Nothing is left "not simulated" any more** (2026-08-14, closing §10 item 4c).
The last 13 abilities and 13 items were implemented; `Abilities.coverage()` and
`Items.coverage()` both report an empty `missing` list, and §9 no longer records
either group as deliberately unsimulated. The durable decisions:

**Delta Stream beats primal weather; Cloud Nine and Air Lock still do not.**
Delta Stream carries two effects here. The upstream one is *strong winds* — while
a holder is on the field, Electric, Ice and Rock stop being super effective
against the Flying half of any Flying-type Pokémon on either side. On top of
that, by project decision, it **deletes the active weather on entry** exactly as
this project's redesigned Cloud Nine and Air Lock do; there is no fourth weather
id, so upstream's "replaces the weather" becomes "removes it", which is the same
thing to every other reader.

The interaction the open item flagged as a real question resolves in Delta
Stream's favour, and the reason is worth keeping because it generalises:

> **Primal weather can only be removed by something that is itself a member of
> the primal trio, or that costs its user a once-per-battle resource.**

Cloud Nine and Air Lock are refused because §5's existing reason still holds — a
Psyduck switching in is free, repeatable and incidental, and letting it wipe
Primal Groudon's sun makes the ability ordinary. Delta Stream is the third member
of the trio, and in the games the three mutually override: whichever arrives last
owns the field. Refusing it would make Rayquaza-Mega the one primal ability that
loses to the other two, inverting the mechanic it exists for. **Teraform Zero
qualifies by the other clause** — flattening the field costs Terapagos its single
Terastallization, which is the most expensive thing it owns.

The wipe fires on entry only, so a Primal Groudon switching in *afterwards* sets
its sun again normally, and "last one in wins" reproduces itself with no new
state. The strong winds are independent of the weather slot and persist
regardless: making them fight over it would need a fourth weather id and a
re-audit of every weather read, which is the exact cost this section already
records for keeping primal weather reading as `rain` / `sun`.

Strong winds live in **`battle.effectiveness`**, through
`battle.strongWindsActive()`. That is the one place the type chart is consulted,
so the AI, the damage calculator and the move buttons all price it with no second
copy of the rule. It is expressed as *the Flying cell dropping from 2x to 1x*,
not as a cap on the total — a Water/Flying defender keeps its 0.5x against Ice
rather than being rounded up to neutral, and a Rock/Flying goes 4x to 2x rather
than to 1x. A version that capped the product would be wrong in both directions.

**Three doubles-only abilities were redesigned rather than left inert**, which is
the same call this project already made for Pickup and Zero to Hero:

- **Curious Medicine** resets the *opposing* Pokémon's stat stages on entry
  instead of an ally's. Deliberately **every** stage rather than only the
  positive ones, because "reset to 0" is what the ability does and the drawback
  is the honest half: switching it in behind an Intimidate gives that up too. It
  writes `boosts` directly, as Haze and Clear Smog do, so Clear Body and Mirror
  Armor have nothing to say — a reset is not a stat drop.
- **Hospitality** restores 1/4 max HP to the most injured teammate **on the
  bench**, which is who a singles battle's teammates actually are. Most injured
  rather than random, so it can be played around. It writes `currentHP` directly
  the way Regenerator does, because `battle.heal` emits an event and the view has
  no card for a Pokémon that is not on the field.
- **Supersweet Syrup** fires on **every** entry rather than once per battle, for
  the reason already recorded above Intrepid Sword: `abilityState` is wiped on
  every switch, so a per-battle guard would need state that survives one, and
  this project already chose the repeating version for two much stronger entry
  abilities. Teraform Zero needs no such guard — a side may Terastallize once, so
  its hook can only fire once by construction.

**Two species clauses were dropped, and that is a decision.** Poison Puppeteer's
"if this Pokemon is a Pecharunt" and Teraform Zero's "Terapagos:" are gone. The
data gives each ability to exactly one species, so the gate changes nothing in an
ordinary battle — and in the one case where it *could* apply, an ability moved by
Skill Swap, Role Play or Entrainment (all three are implemented), it would make
the copy silently do nothing, which is §8's most-repeated bug shape. Both remain
in `UNCOPYABLE`, so Trace still cannot take them. Note this is **not** a reversal
of the Dark Void and Aura Wheel restrictions: those are *moves*, which any
species can be taught, so their gates do real work every game.

**Two hooks were added to the engine, and one shared helper extracted:**

- **`onAfterInflictStatus(battle, pokemon, target, status)`** — the inflicting
  side's counterpart to `onAfterStatus` (which is Synchronize, on the receiving
  side). Poison Puppeteer needed it. Hooked inside `setStatus` rather than in the
  move executor, so every route counts: a Toxic, a secondary effect, Toxic Chain,
  and the holder's own Poison Point punishing a contact attacker.
- **`onTerastallize(battle, pokemon)`** — dispatched from `battle.terastallize`
  after the type change and its event, so the log reads in order.
- **`move.brokeProtect`** is set by `executeMove` when a move actually shatters a
  protection. Piercing Drill charges its quarter-damage price off *that*, not off
  "the holder has this ability", which is the whole implementation: against a
  target that did not Protect the move is completely ordinary, so it is a trade
  rather than a permanent 75% penalty. Unseen Fist declares no reduction and is
  unaffected — the flag simply goes unread by it.
- **`battle.clearTerrain()`** is the counterpart to `clearWeather`, and it emits,
  because the field chips render from the `terrain` event.

**Mega Sol is a personal weather, and it needed one line.**
`battle.weatherFor(pokemon)` was already the single function every attacker-side
weather read goes through (Solar Beam's charge, Thunder and Blizzard's accuracy,
Weather Ball's type and power, Hydro Steam, the damage modifier) — built for
Utility Umbrella. An ability declaring `personalWeather` now overrides the real
weather there, which reaches `AI.estimateDamage` and the calculator for free. The
umbrella is applied **last and therefore wins**: an item whose whole text is
"ignore sun and rain" should shield its holder from the sun it is standing in
whatever produced it. Mega Sol sets no weather, so nothing else on the field sees
it, and it does not beat primal weather's element block — that is a refusal in
`executeMove`, not a weather reading.

**Two things were fixed in passing, both found by writing the above:**

- **Mummy had no exclusion list**, although its own packaged description states
  one. It would have overwritten Stance Change, Multitype and every other
  identity ability. Mummy and Lingering Aroma are one mechanic under two names
  and now share `abilitySpreader`, which consults `UNCOPYABLE` — already this
  project's single source of truth for that set, and it has to be an id set
  because most of those abilities are inert by design and carry no registry
  object. The two also leave each other alone, as in the games.
- **`healBerry` inferred its threshold from `pokemon.item === 'sitrusberry'`**,
  which reads the *holder's* item — wrong for a force-eaten Berry, since the
  eater is usually not the holder. The threshold is now a parameter. Behaviour is
  unchanged for Sitrus and Oran. Separately, **Oran Berry's packaged text says
  1/2 and this project fires it at 1/4**; the behaviour is shipped balance and
  was left alone, but `ITEM_OVERRIDES` now states the real threshold, because a
  Pokédex entry that misstates the mechanic is what that table exists to prevent.
  The Gen 2 Berry and Gold Berry really do use the half their own descriptions
  state, so they need no override.

**The Legends: Z-A abilities are reached through Mega formes**, the supported
route: Dragonize on Feraligatr-Mega, Eelevate on Eelektross-Mega, Fire Mane on
Pyroar-Mega, Mega Sol on Meganium-Mega, Piercing Drill on Excadrill-Mega, Spicy
Spray on Scovillain-Mega, and Delta Stream on Rayquaza-Mega. **Check the packaged
data before assuming what one of them does** — `Eelevate` sounds like an `-ate`
ability and is Levitate plus Beast Boost; guessing from the name would have
shipped a Normal-to-Electric converter. **Dragonize keeps its 1.2x**, for
Galvanize's reason: the 1.3x values are rollbacks of a nerf, and an ability
introduced after the nerf has nothing to roll back to.

**The Generation 2 items are implemented as themselves, not as aliases.** Mystery
Berry restores 5 PP where Leppa restores 10, and Pink Bow and Polkadot Bow give
Normal moves 1.1x where every entry in `TYPE_BOOSTERS` gives 1.2x. All ten of the
new Berries are declared through `eatableBerry`, so the force-eat path (Bug Bite,
Pluck, Stuff Cheeks, Tea Time, a flung Berry) applies their effects — a Berry
defined with a fused trigger would be silently half-inert on exactly those five
mechanics.

**The format list was rebuilt around Smogon's tier ladder** (2026-08-14, by
project decision, over several passes). Five formats were removed — Level 50
Singles, Restricted Singles, Battle Tower, Anything Goes (Tiered) and finally
**Standard Singles** — and **OverUsed is the default**, declared once as
`Formats.DEFAULT_FORMAT` rather than as a literal at the seven call sites that
used to say `'standard'`.

Standard was the odd one out and that is why it went: it gated on `powerClass`,
a fixed snapshot in the packaged data, while the ladder gates on Smogon's actual
tiers — so the two disagreed about the same Pokémon, and only one of them has a
source. `Formats.get` falls back to the default for an unknown id, so a team
saved under any removed format still opens and is validated against OU.

**Terastallization is now off almost everywhere**: only Anything Goes and the
two new Tera variants — **Ubers (Tera)** and **OU (Tera)** — allow it. The pair
are generated from the same `tierRules` as their plain versions, so the only
difference between OverUsed and OverUsed (Tera) is the one switch; a test
asserts exactly that, because a hand-written second entry is how two formats
silently drift. Random Battle lost Tera with them. Campaign keeps it — that is
§5's own decision, and it is an internal format rather than a selectable one.

**The validator never enforced the tier ceiling, and that was a real hole.**
`Formats.speciesPool` always filtered on `maxTier`, but the pool is what the
*pickers* offer — the validator is what a built or imported team is actually
checked against, and it never asked. A Mewtwo validated cleanly in OU, UU and
ZU. It went unnoticed while Standard was the default (no `maxTier`; it blocked
Mewtwo through `allowRestricted: false`) and became the whole ruleset the moment
OU took over. It reads `Formats.tierAllowed`, the same predicate the pool uses,
rather than a second copy of the comparison.

**`Formats.tierRoster(tier)` is strictly one rung**, and drives the Teams
screen's **Format** browser. Deliberately not `speciesPool`, which is
cumulative-downward because that is what a format plays with: the OU pool holds
583 Pokémon of which 87 are actually OU, and "show me Ubers" wants the 108, not
the 653. **Megas are listed under their own tier**, which is why it cannot be a
filter on `species.tier` — a Mega is not a species here (they are
`transformOnly`), it is an entry in the base species' `formeItems` carrying the
tier of the forme it produces. Charizard sits in ZU while both its Megas sit in
OU, and Mewtwo sits in Ubers with both of its. It dedupes by target forme,
because Giratina-Origin is produced by both the Griseous Orb and the Griseous
Core and would otherwise be listed twice.

**`TIER_OVERRIDES` is where this project's own tiering decisions live**
(`tools/generate-data.js`, added 2026-08-15). Smogon ranks for a metagame *with*
Terastallization; RedGPT allows it in three of eleven formats. Where that gap
changes the answer, the tier is corrected here. It sits in the generator for the
same reason `LEGACY_BASE_STATS` and `MOVE_OVERRIDES` do, and is applied inside
`smogonTier`, the single choke point every tier read passes through — species
tiers *and* the per-forme tiers in `formeItemsFor`.

Four batches so far, on four different arguments:

- **The AG rung was emptied.** Xerneas, Calyrex-Shadow, Koraidon, Miraidon,
  Mega Gengar and Mega Rayquaza moved to Ubers. `AG` stays in `TIER_ORDER`
  because `tierRank` needs a top rung to compare against.
- **25 Ubers entries dropped to OU.** Four are Gen 9 whose case leaned on Tera
  (Ogerpon-Hearthflame, Roaring Moon, Baxcalibur, Annihilape); the rest are
  legacy "automatic Ubers" reassessed against RedGPT's own OU, which is far
  stronger than the formats that banned them. Ubers 88 → 62 entries, OU 87 → 111.
- **Three OU entries promoted to Ubers** (2026-08-16): Lucario-Mega-Z, Magearna
  and Magearna-Original. The last two by *removing* their overrides rather than
  adding new ones, which restores Nat Dex's own Uber — this table means "where
  this project disagrees with Smogon", so an absent row is the honest
  representation when it no longer does.
- **Fifteen OU entries dropped to UU** (2026-08-16), thirteen species and two
  Megas, on **role competition inside UU** rather than on raw power. OU 107 → 92,
  UU 71 → 86. See §10. The two Megas are the shape worth remembering: both lose
  to their own base forme, so the *forme* dropped while the base stayed where it
  was — the Absol/Absolite rule pointed the other way round.

**The estimator is the trap here, and it is load-bearing.** `formeItemsFor`
estimates an unranked forme's tier **from its base species' tier**, through this
same function — so dropping Baxcalibur, Darkrai or Magearna silently dragged
their unranked Megas down with it and nothing said so. Four Megas are pinned
back to Ubers explicitly for that reason. **Any future tier drop of a species
with an unranked Mega needs the same pin.**

**Two tier drops were deliberately refused, and the reason generalises: the
engine has no tier gate on a forme change.** `maxTier` appears only in
`validation.js`, which checks a *team*; nothing in `battle.js` consults it. Proved
by live battle — an OU Darmanitan-Galar with Zen Mode becomes Ubers-ranked
Darmanitan-Galar-Zen mid-battle, and an OU Zygarde becomes Zygarde-Complete. So
dropping either would hand OU a banned forme, and both stay Ubers until forme
changes can be tier-gated. **That gate is the prerequisite for any future drop of
a species whose forme outranks it.**

**The two Terastal-gated formes are transformation-only** (2026-08-15).
Terapagos-Stellar and Ogerpon-Hearthflame-Tera exist only as the result of
Terastallizing, so offering them in the Team Builder let a player pick, in a
no-Tera format, a forme that format says is unreachable. They keep their Ubers
tier — a tier says what a forme *would* be if reached — and the selectability
gate is what makes the rules honest.

**Neither transformation is implemented, so they are now packaged-but-dead.**
`ABILITY_FORMES` takes Terapagos to Terastal on entry via Terashift and stops;
nothing produces Terapagos-Stellar, and nothing produces any Ogerpon Tera forme.

**The Ogerpon line is playable, and the blocker was not the one recorded**
(2026-08-16). The note here used to say the line was unreachable because Ogerpon
and its three masked formes all carry `requiredItem` while the Masks were
missing from `Mechanics.FORME_CHANGE_ITEMS`. The second half was right. The
first half was wrong in a way that mattered: **base Ogerpon was not in the
packaged data at all.**

`Dex.hasSpecies('ogerpon')` was false. The dex calls the base forme plain
"Ogerpon" with an empty `forme`, so `spriteCandidates` asked for `OGERPON` while
the artwork indexes as `OGERPON TEAL MASKED`, and the species was dropped for
"no sprite pair" with both files sitting on disk — the Oricorio-Pa'u shape (§9)
one level up. So the Masks had **no holder**, and the Red Orb pattern was not
merely unwritten, it was unimplementable: `FORME_CHANGE_ITEMS` keys on the base
species, and `tests/move-coverage.js` asserts every base in that table resolves.

Four things landed together:

- **`BASE_FORME_SPRITE_ALIASES`** in the generator, one entry, consulted only on
  the `forme === ''` branch. **Deliberately not `BASE_SPRITE_ALIASES`**, which
  substitutes the base half of *every* forme's key — aliasing Ogerpon there asks
  for `OGERPON TEAL MASKED WELLSPRING MASKED` and drops the three masked formes,
  recovering one species by losing three. A control asserts exactly that, so the
  two tables cannot be merged while it fails.
  Measured before writing it, across all 1,120 upstream base formes: 98 have no
  exact sprite pair and **exactly one** has artwork on disk under another key.
  The other 97 are Nidoran-F/M (already aliased), MissingNo., the CAP species
  and the Pokestar props. A one-entry table is the right size; no general rule
  is warranted.
- **The three Masks in `FORME_CHANGE_ITEMS`**, in both copies. Base Ogerpon
  holding one arrives as the masked forme with its typing and its own first
  ability — Mold Breaker, Water Absorb, Sturdy.
- **The Masks' 1.2x, implemented in `items.js`.** This is not optional garnish:
  a forme item counts as **implemented** in `Items.coverage()` because the
  engine implements it, so wiring the forme change alone would have relabelled
  three items from "inert by design" to "implemented" while half of each one's
  own packaged description did nothing — §8's most-repeated bug, with the
  coverage label hiding it. Gated on the holder's packaged `requiredItem`, which
  is the data's own statement of "this forme is the one this Mask makes", so it
  covers the Tera formes for free and cannot drift.
  `.* Mask$` was **deleted** from `INERT_NAMES` rather than left in place: it
  matched exactly these three items and nothing else in the 560-item set, and it
  is now unreachable, which is the shape §8 keeps recording.
- **Base Ogerpon's legality, decided: it is RU, and it may not wear a Mask
  there.** Nat Dex ranks it RU and that is what it takes. All three masked
  formes are OU, so `formeItems` carries each Mask at OU and the Absol/Absolite
  rule does the rest — Ogerpon is legal in Ubers, OU, UU and RU; a Mask is legal
  only in Ubers and OU. The validator says so in as many words: *"Hearthflame
  Mask is banned in RarelyUsed — it turns Ogerpon into Ogerpon-Hearthflame,
  which is OU. Ogerpon itself is legal here."* The masked formes stay
  *selectable* species refused by the battle-only gate outside Anything Goes,
  exactly as Groudon-Primal is; nothing about that needed changing.

**Embody Aspect is not part of this and cannot be.** All four Embody Aspect
abilities are implemented, but every one of them lives on an Ogerpon **-Tera**
forme, and nothing produces those. A Mask gives Mold Breaker / Water Absorb /
Sturdy and the 1.2x, never the +1 stat. Checking that before assuming the Mask
alone was enough is what kept the scope honest.

**The 2026-08-15 Terastal decision named two of five formes, and that was a
bug** (fixed 2026-08-16). It made Terapagos-Stellar and Ogerpon-Hearthflame-Tera
transform-only on the argument that a forme reached only by Terastallizing must
not be selectable in a game that turns Tera off in eight of eleven formats — and
left Ogerpon-Teal-Tera, Ogerpon-Wellspring-Tera and Ogerpon-Cornerstone-Tera
directly pickable. The argument never had anything to do with their tier; the
two that got fixed were simply the two whose tier made them conspicuous.
**Teal-Tera was the sharpest hole**: it needs no Mask, so it was the only
Ogerpon-line entry a player could pick in RU, and it arrived with Embody Aspect
(Teal) for a free +1 Speed in a format with no Terastallization in it. The test
asserts over the *generated* set (`/-Tera$/`) rather than a written list, and
carries a control in the other direction — Terapagos-Terastal is an ordinary
entry forme produced by Terashift and must stay selectable.

Selectable species 1,142 → **1,140**: plus base Ogerpon, minus the three Tera
formes. The OU roster is 111 → **109** for the same reason, with no tier change.

**Tera Blast had no implementation at all** (fixed 2026-08-14, reported). It was
a flat Normal-type Special 80 BP move however the user Terastallized — the one
thing the move exists to do. It now takes the user's Tera type, and becomes
**Physical when the user's Attack beats its Special Attack**, gated on actually
being Terastallized. **Revelation Dance gets the same category rule** by project
decision (upstream it is always Special); its type already followed the user.

`battle.moveCategory(attacker, move)` is the shared answer, and `executeMove`
resolves it onto the per-use move copy **before anything reads it** — so the
attacking stat, Reflect versus Light Screen, Assault Vest and every other
`move.category` branch see one answer rather than disagreeing. `AI.estimateDamage`
asks the same function, or it would price a physical Tera Blast against Special
Defence. The comparison runs through `getStat`, so a Swords Dance really can flip
it; ties stay Special.

**Its first test was vacuous and the control caught it.** The damage assertion
compared Terastallized against not, which changes the *type* as well — two terms
pushing the same way, so it moved for the wrong reason and passed with the
category resolution deleted. It now holds the type constant and flips only the
stat profile, against a Blissey whose base 10 Defence and base 135 Special
Defence make hitting the wrong one impossible to miss.

**Weather is never "suppressed", only set or cleared.** There is no
`suppressWeather` flag any more and `effectiveWeather()` is a plain accessor.
Cloud Nine and Air Lock call `battle.clearWeather()`, which wipes state,
duration and source. Anything that needs "weather is inactive right now" should
clear it, not add a suppression layer back.

**Mid-battle forme changes go through `battle.formeChange`.** It recomputes the
six stats from the new species using the same set, carries current HP across as
a ratio, updates `baseTypes`/`types` (respecting Terastal) and emits a `forme`
event the UI handles by swapping the sprite in place. It never touches
`pokemon.set`, which is what makes the change temporary: battle Pokémon are
rebuilt from their sets each battle, so nothing leaks into the team or the save.
Legacy Battle Bond is the only current caller.

**Trace's uncopyable list is a set, not a flag.** `UNCOPYABLE` in
`abilities.js` is the single source of truth. It has to be an id set because
most entries (Illusion, Imposter, Zen Mode, Stance Change...) are inert by
design and have no registry object, so a per-definition flag would silently miss
them — which is exactly what happened before: `uncopyable` was read by Trace and
never set by anything, so Trace could copy every ability in the game.

**Coverage is reported, never faked.** `Abilities.coverage()` /
`Items.coverage()` split into implemented / inert-by-design / not-simulated. The
UI labels the third group. If you implement something, the counts move on their
own — no hardcoded numbers in code (the README table is manual, update it).

**Type effectiveness lives in one place.** `Dex.typeEffectiveness` multiplies the
packaged chart (verified cell-by-cell against the canonical Gen 6+ table in
`tests/engine-battle.js`); `battle.effectiveness` layers the exceptions on top —
Thousand Arrows, Freeze-Dry, Flying Press, Tar Shot, Ring Target, and the
identify effects. Attacker-side and defender-side bypasses are easy to confuse:
Scrappy and Mind's Eye read the **attacker's** ability, while Foresight, Odor
Sleuth and Miracle Eye read a volatile on the **defender**. Reading `foresight`
off the attacker inverted the mechanic — using it did nothing, and being hit by
it let the victim punch through Ghosts.

**Five moves take their type from the user at use time, and all five were
broken** (fixed 2026-08-14). `battle.moveType` is where use-time type resolution
lives — never `MOVE_OVERRIDES`, because the packaged type is correct and it is
the *runtime* resolution that was missing.

- **Revelation Dance** had no case at all and was always Normal.
- **Judgment, Multi-Attack and Techno Blast** had a case that read
  `return move.type` — **exactly what the fallback below it does**. The branch
  named the three moves, looked like coverage, and changed nothing, so all three
  were Normal too. This is the §8 declared-but-inert family in its most
  convincing costume: a line that mentions the right ids and is a no-op.
- **Aura Wheel** ignored Hangry mode. `moveSpecialFailure` already restricted the
  move to Morpeko, which made it *look* handled.

Three rules the fix turns on, each of which a simpler version gets wrong:

- **Revelation Dance reads `attacker.types[0]`, not the species' typing.**
  Terastallizing replaces `types`, so a Tera'd Oricorio dances in its Tera type
  as it does in the games — and Soak, Conversion and Burn Up come along free. A
  control that read the species instead fails exactly the Tera test and nothing
  else.
- **The other three read the held item, not the user's typing.** Multitype and
  RKS System retype Arceus and Silvally, so those two would work either way —
  but **Genesect stays Bug/Steel whatever Drive it holds**, so only the item
  carries the answer. Reading `types[0]` would have made Techno Blast
  permanently Bug.
- **Z-crystals declare `onPlate` too and are excluded on `zMove`** (a clean
  boolean: `true` only on Z-crystals). Matching `onPlate` alone would hand out
  free retyping from an item this project does not otherwise simulate.

Consequences beyond the type chart: **Judgment and Multi-Attack were losing
STAB** (an Arceus-Water read 1.0, not 1.5), and because `AI.scoreMove` and
`arena/calculator.js` both call `battle.moveType`, the AI was scoring these five
moves at the wrong type as well — so the fix reaches Assist Mode and the
calculator for free. Techno Blast correctly does *not* gain STAB.

**The defender is the foe for *every* move, so guards must check targeting.**
`executeMove` passes the opposing Pokémon as `defender` even when the move is
the user's own Slack Off, Reflect or Trick Room. Anything on the defending side
that reacts to an incoming move has to ask `battle.aimedAtFoe(move)` first.
`NON_FOE_TARGETS` in `mechanics.js` lists the targets that never cross the field
(`self`, `allySide`, `allyTeam`, `allies`, `adjacentAlly`, `adjacentAllyOrSelf`,
`all`). `foeSide` is deliberately **not** in that list — hazards do cross, and
Magic Bounce has to be offered the chance to reflect them. For "does this hit
the Pokémon rather than its side" use `battle.aimedAtFoePokemon(move)`, which
additionally excludes `foeSide`; that is the distinction between Good as Gold
(refuses status moves aimed at the holder, does not stop hazards) and Magic
Bounce (reflects hazards too).

**The assist-only unlock state is shown on the run screen** (added 2026-08-14).
`run.stats.assistOnly` is one-way and was invisible: a single hand-played battle
forfeits Tacticians/Paragons for the whole run, and the player only found out on
the end screen after twenty-odd battles. The easiest way to lose it by accident
is pressing **"Start battle"** at Team Preview, which counts as acting.

`Campaign.assistOnlyStatus(run, profile)` is the predicate and it lives in the
campaign layer, not the UI — the same reason the unlocks themselves became data.
It reads the rows out of `Content.UNLOCKS` rather than hardcoding Veteran and
Master, so a third assist-only unlock is picked up with no UI change, and it
returns **null** when there is nothing to say (no assist-only unlock applies to
this difficulty, or every one that does is already owned) so the chip never
tracks a reward that cannot be earned. Three controls in `tests/campaign.js`,
all confirmed to fail: drop the difficulty gate and Normal shows the chip, drop
the already-owned gate and an earned pool is tracked again, hardcode `intact`
and forfeiting stops registering.

**Assist Mode is advisory, never automatic.** Two independent per-run switches
in `run.assist`, both off by default, both toggleable mid-run (neither touches
run RNG or rules, so flipping them cannot desynchronise a seeded run):

- **Recommendations** — `src/campaign/advisor.js` scores rewards, move swaps,
  TM/tutor picks and held-item holders. It is DOM-free, mutates nothing and is
  **deterministic** (no RNG), so advice cannot change under the player between
  renders. The UI only ever adds a badge and a one-line reason; it never
  pre-selects, reorders or disables an option. Every suggestion carries a `why`
  — a recommendation the player cannot interrogate is worse than none, because
  these are heuristics and they will sometimes be wrong.
- **AI battling** — `BattleView.setAutoBattle()`. It drives only the controlled
  sides through the same `submit()` path a click uses, so playback, replays and
  the command log are identical to a human playing those moves. The button
  appears on Team Preview (where the AI also picks the lead, via
  `Advisor.recommendLead`) and in the battle controls, and control can be taken
  back at any point mid-battle. Auto-battle skips the `.is-busy` control lock
  for the same reason Spectate does: locking would put "take over" out of reach
  for the length of playback.

Watch the fallback score for unrecognised status moves in the advisor: an early
version set it high enough to beat a type-duplicated attack and cheerfully
advised learning **Splash** over Ember. `NO_EFFECT_MOVES` now zeroes the useless
ones and a test asserts Splash is never recommended — **against every team plan**,
since a plan multiplies the status table and a bias applied before the
no-effect check would reopen exactly that hole.

**Team plans are the third Assist switch, and they are data** (added
2026-08-14). `CampaignContent.TEAM_PLANS` declares eight — Balance, Hyper
Offense, Stall, Rain, Sun, Trick Room, Sticky Web, Screens — each a row of
preferences rather than a branch, for the same reason the unlocks are data.
`run.assist.plan` stores the choice.

The advisor was otherwise plan-blind: it scored a recruit, an item or a move on
general quality, which is right for a balanced team and actively wrong for a
specific one. **Trick Room is the case that proves it** — it wants the *slowest*
Pokémon on offer, and quality scoring hands it the fastest. Measured on one
recruit screen: Balance and Hyper Offense take a Crobat (BST 535), Trick Room
takes a Torkoal, 104 to 3.

What a plan steers: recruit choice (`recommendRecruit`), who to release when the
party is full (`recommendRelease`), ability swaps (`recommendAbility`), held-item
holders, TM and tutor picks, move replacements, and reward ranking — a Damp Rock
offered to a Rain team now outranks the generically-better item beside it.

Five rules that hold it together:

- **A plan is advisory only.** It must never be read by anything that draws from
  the run RNG or decides what is *offered* — only by what is *recommended*.
  That is what lets it be switched mid-run, exactly like the other two switches.
- **The enabler outranks everything.** A payoff piece with no enabler is a dead
  card, so the first Drizzle user is worth more than anything else on the
  screen (150 points against a ~95 payoff cap). `recommendRelease` will never
  suggest releasing the **sole** enabler of an active plan — that trades the
  whole plan for one Pokémon.
- **Speed is signed, not just unrewarded.** A base-130 Pokémon is a *liability*
  on a Trick Room team, not merely unhelpful. Scoring it zero let coverage and
  base stats hand the recommendation to the one Pokémon the plan cannot use.
- **Coverage scales with party size.** With one Pokémon drafted, everything adds
  two or three "missing" types and the term pays out in full to every candidate.
  That is noise, and it was loud enough to drown out the Trick Room Speed
  profile entirely.
- **Bulk is weighted to reach the same order as coverage.** At its first value
  it topped out near 25 against coverage's 40, and Stall — the plan whose whole
  identity is bulk — recommended a Crobat over a Slowbro.

The reasoning is rendered **on the page** (`assistReason`), not in a `title`
tooltip: a recruit is the choice that most shapes a run, and §5's rule is that a
recommendation the player cannot interrogate is worse than none.

**Run length and Beacons are player-chosen, and difficulty pays for both.**
`createRun({acts, beacons})` — 1-8 Acts, 0-6 Beacons, stored in `run.setup`.
Both make a run more survivable, so `challengeLevel(run)` counts every step
above the difficulty's default and the opposition scales super-linearly with it
(`challengeFactor` = 1.4^steps): fuller teams, a stronger species pool, and an
AI tier promotion every two steps. The run-setup panel states the resulting
challenge in plain terms rather than letting it surprise anyone.

**`run.act` is not a difficulty clock — use `runProgress(run)`.** It returns 0
at the opening node and 1 at the final Act's boss, whatever the run length, so
one curve stretches over eight Acts or compresses into one. Everything that used
to ramp on the Act number reads it: the opponent power band (`POWER_CURVE`
anchors interpolated by progress), reward rarity, credit rewards, recruit power
bonus and recruit tier unlocks. `actLevelCap` interpolates the same way and still
reproduces the hand-tuned 32/48/68 exactly for a three-Act run. Acts past the
third reuse the Act 3 layout and boss tier; only the *last* Act hosts the
Champion (`run.act === actCount(run)`).

**Recruitment is tiered, with exactly one deliberate exception.** `recruitTier`
sorts candidates into common / uncommon / rare / legendary / never, with
`RECRUIT_TIERS` giving each a weight and a `runProgress` threshold. Mythicals
(Arceus, Mew, Celebi) and the Anything-Goes tier are *never* offered by random
recruitment; legendaries only past 82% of the run, at 1/30th the weight of a
common. The bug this fixes: the BST band's fallback used to drop to the whole
viable pool, which handed out an Arceus in Act 1. **Any fallback here must stay
inside the tier gate.**

**The exception is the Rare Encounter node** (changed 2026-08-13, by project
decision — previously it obeyed the gate). Defeating one **always** offers the
Pokémon fought, which may be a legendary or a mythical that random recruitment
refuses outright. The reasoning for allowing it:

- The gate exists to stop *random offers* bypassing rarity — that is the Arceus-in-
  Act-1 bug. A Rare Encounter is neither random nor free: the node has to be
  found and routed to, and the Pokémon beaten at or above the player's own level,
  fully built, with a Beacon on the line if they lose.
- **The fight is the price.** This was a one-in-three roll until 2026-08-13, and
  the roll is gone (`recruitChance` removed, not set to 1 — a probability that is
  never a probability is exactly the sort of knob this project keeps finding
  inert later). An expensive, deliberately-routed-to fight that gave nothing two
  times in three read as arbitrary rather than as a gamble.
- Appearance is separately gated: legendary and mythical cannot show up in the
  first 35% of a run, so this cannot happen in Act 1 of a three-Act run at all.
  The node is also weighted 5, below every other type, and barred from rows 0-1.

The offer is **the exact set that was fought** — moves, ability, held item,
nature, Tera type — passed through as `reward.recruitSet` and re-levelled to the
team level, so the reward is the Pokémon the player beat rather than a fresh roll
of the same species. The flat chance replaces `shouldOfferRecruit` here on purpose:
that function declines 55% of the time once the party is full, which would compound
with the offer and quietly reintroduce a refusal rate for a settled team. A
full party still gets the release prompt and can always decline.

**Heal All spends potions, never Revives.** `Campaign.healAll(run)` brings every
injured party member to full from the bag, because doing it by hand was seven
trips through an item picker for a decision that is almost never interesting. Two
rules keep it from spending something the player wanted to keep:

- **HP items only.** A fainted Pokémon needs a Revive (400 credits, or 800 for a
  Max Revive) and that is a decision to make deliberately, not to lose to a button
  press. Fainted members are counted and reported instead: *"2 still fainted — use
  a Revive."*
- **Cheapest healing wins**, measured as `price / min(amount, deficit)` — the
  price of the HP the item actually delivers. The obvious rule, "smallest item
  that covers the gap", is wrong in both directions: a 62 HP dent is *covered* by
  one Hyper Potion (320 credits) but better served by two Potions (180), while a
  650 HP hole came out at 820 credits under this rule against 990 for all-Potions
  and 960 for all-Hyper. Full Restore is a last resort, used only when the finite
  potions cannot finish that Pokémon, since it also carries status and PP value.

`Campaign.canHealAll(run)` gates whether the button renders at all, so it never
sits there offering nothing. The test carries controls on both axes — one that
makes it revive the fainted, one that makes it pick the largest item — and both
were confirmed to fail.

**Campaign progression is by node clear, not grinding.** One shared team level,
capped per Act. There is no XP farming.

**A branching evolution is the player's choice, not data order.**
`checkEvolutions` used to sort the eligible rules by level and take `[0]`, so a
Wurmple was always a Silcoon, a Tyrogue always a Hitmonlee and a Slowpoke always a
Slowbro — decided invisibly by whichever rule @pkmn happened to list first. It now
raises an `evolvechoice` prompt whenever more than one target is eligible, and
`resolveEvolvePrompt` does the same when two usable stones are in the bag (an Eevee
at a free-evolution service silently became whichever of its five stone forms came
first). Three details worth keeping:

- **Every eligible target is offered**, not just the lowest-level one, so a
  level-60 Eevee sees Sylveon (55) alongside Espeon and Umbreon (25).
- `autoEvolve` handles the unambiguous part and stops at a branch, so a
  single-target line — and a whole chain like Caterpie → Metapod → Butterfree —
  still resolves with **no prompt at all**. Interrupting every level-up would be
  much worse than the bug.
- After a choice, the chain continues through its remaining unambiguous steps
  immediately (Cascoon → Dustox), but a *second* branch waits for the next
  level-up rather than stacking prompts mid-resolution.

The prompt carries `memberUid`, so `pruneDanglingPrompts` drops it automatically
if the Pokémon is released first — the §8 trap that blanks the run screen. The
probe and both test resolvers were given explicit cases; without one they fall
through to `skip`, which would mean **never evolving a Wurmple, Tyrogue, Slowpoke
or Eevee** and quietly weakening every measured run.

**Rescue Beacons are the run's life total.** A ~20-battle run ending on a single
loss made clears statistically impossible. Losing spends a beacon: full heal,
node stays uncleared, route again. Zero beacons = run over.

**Relics are unique, except where `maxStack` says otherwise.** `grantRelic`
refused every duplicate and `randomRelic` excluded anything owned, so no relic
could ever stack. A relic may now declare `maxStack` and be offered until every
copy is held; `modifiers()` already sums by iterating `run.relics`, so nothing
else had to learn about stacking. **Scout's Tally** (`bonusRerolls: 1`,
`maxStack: 3`) is the only one so far, and it exists because rerolls otherwise
refill once per Act at a fixed difficulty allowance that nothing in a run can
raise. It applies its extra reroll **immediately as well as at the next Act** —
a relic found on an Act's own boss node would otherwise do nothing for the Act
you earned it in. The UI collapses duplicates into one `×N` chip via
`relicChips`; rendering `run.relics` directly printed the same chip three times.

**The Battle Shop is the narrow counterpart to the Supply Depot** (added
2026-08-14). A specialist held-item dealer: **only** held items, chosen by
scoring every candidate against every party member, and **one purchase** — then
the dealer packs up and the node ends. A narrow shelf you can afford one thing
from is a decision; a wide one you can afford one thing from is a sorting
exercise. Ending the node on the purchase rather than leaving the shelf open
with everything unaffordable is the difference between "you chose" and "you were
shown what you missed".

**Every slot is tailored, not just a reserved pair**, and each card names the
party member it is for and why — "Bronzong knows Trick Room", "Charizard
transforms with it", "Iron Valiant has Quark Drive". A shelf with an anonymous
item on it would be the Supply Depot wearing a different sign.

Two tiers, and the order matters:

1. **Synergy items**, from `partySynergyItems` — the ones a fit score
   *structurally cannot find*. Nothing about a Warp Prism's stat line says
   "somebody here knows Trick Room"; a Damp Rock is a bad item on paper and the
   right one for the Pokémon setting the rain. Five sources in descending
   specificity: forme/Mega items, a Plate or Memory for a Multitype / RKS
   System holder, items whose packaged `itemUser` names a party species (Light
   Ball, Thick Club, Leek — read from the data rather than listed), a move
   somebody knows (`MOVE_SYNERGY_ITEMS`), and an ability somebody has
   (`ABILITY_SYNERGY_ITEMS`).
2. **Fit-scored items** fill the rest, each attributed to its best holder with
   a reason from `fitNote`, which mirrors `itemFit`'s own branches rather than
   re-deriving a fit — a second opinion would drift; this is a label for the
   first one.

**`Items.isSimulated` is the wrong filter for a shop, and that is a trap worth
recording.** It passes the inert-by-design group — Z-crystals, mail, flutes —
because those are not a coverage *gap*. Correct for the coverage report, wrong
here: `itemUser` names Pikachu on **Pikanium Z** exactly as it does on the Light
Ball, and this project does not simulate Z-moves, so that slot would have been a
sale of nothing. The shop uses `Items.registry[id] || isFormeItem(id)` instead.

Three things worth keeping:

- **It reuses `Advisor.itemFit`** rather than growing a second copy of "what
  suits this Pokémon". `advisor.js` loads *after* `run.js` (§4), so it is read
  at call time and guarded — the shop degrades to an unsorted pick rather than
  throwing.
- **The team plan is deliberately not passed to `itemFit` here.** Passing it
  would let an Assist Mode setting change what the run *offers*, which is the
  line §5 draws around plans and would desynchronise a seeded run the moment
  the player switched plan. Advice may read the plan; generation may not.
- **Barred below row 3**, one row later than the general Shop: at row 2 the
  party is one or two Pokémon and a shelf scored against it has almost nothing
  to be relevant to. Measured across 40 runs: 36 contain at least one.

Found while building it: **Black Sludge was recommendable to anything bulky**.
It heals a Poison type and *damages* everything else, so on a non-Poison holder
it is strictly worse than an empty slot — it sat in `BULK_ITEMS` beside
Leftovers. `itemFit` now returns -1 for it, which also fixes the advisor's
held-item recommendation and the Supply Depot's stock.

**Rest Sites do not manage held items.** The "Reorganise" option opened a
held-item table that duplicated the party menu, where items can be moved at any
time — so spending a whole node on it was never a real choice. It is now
**Forage**, which banks two consumables scaled by `runProgress`
(`FORAGE_TIERS`), deliberately *stored* rather than instant healing so it is not
the same choice as "Rest" twice over; revives are the part healing cannot
replace. The `items` prompt type and its renderer were deleted with it rather
than left unreachable.

**Rare Encounter nodes are a single fully-built Pokémon, and appearance is gated
separately from recruitment.** `marqueeChance` (30%) of the time the species is a
legendary, mythical, Ultra Beast, Paradox or pseudo-legendary; otherwise it is an
ordinary species from the run's power band built by `RandomTeams.randomSet`,
which already supplies a competitive moveset, ability, item, nature, Tera type
and max IVs. Three things about it that are easy to get wrong:

- **IVs are not forced to a flat 31.** `pickIVs` drops Attack to 0 on a purely
  special attacker, which is the competitively correct spread — it cuts
  confusion damage and Foul Play — so overriding it would make the Pokémon worse
  while claiming to perfect it.
- **Appearance must not be gated on `recruitTierAvailable`.** That was tried: it
  makes mythicals (tier `never`) unable to appear *at all*, and holds legendaries
  back to 82% progress, which dropped the measured marquee rate to 18% against a
  configured 30%. Facing something is not keeping it. Legendary and mythical are
  simply held out of the first 35% of a run instead.
- **Recruiting one deliberately bypasses the tier gate** — see the exception
  recorded under the recruitment rule below. A win rolls
  no chance at all any more: it always offers **the exact set
  that was fought**, held item and all, re-levelled to the team level.

The node is weighted 5 (below every other type), barred from rows 0-1, and its
level is floored at the player's own: `enemyLevel` applies `rampOffset`, which
runs nine levels deep through Act 1 and produced a "rare" Pokémon at level 10
against a level-16 party.

**The Beacon count is arithmetic, not taste — mandatory bosses set the floor.**
A losing battle costs a Beacon and leaves the node uncleared, so a node with win
probability `p` costs `(1-p)/p` Beacons in expectation before it is cleared.
Optional nodes can be routed around; **bosses cannot**, and a default run has
three of them (§9 — the last Act *is* the Champion). So the boss line alone
costs `3 × (1-p)/p`:

| Boss win rate | Expected Beacons spent on bosses |
| --- | --- |
| 32% | 6.4 |
| 45% | 3.7 |
| 55% | 2.5 |
| 65% | 1.6 |

Elites and Trainers add roughly another 1.0-1.5 on top. This is why a difficulty
whose bosses sit near a coin flip is unclearable at any sane Beacon count, and
why Master measured 0% for three consecutive tunings while its bosses stayed
around 30%: no amount of healing or level handicap fixes a mandatory fight the
player loses two times in three. **When a difficulty will not move, look at its
boss win rate before touching anything else.** Correspondingly, difficulty is
carried mostly by AI tier, level offset and the healing economy; the Beacon
count is what pays for the boss line and should be set from it.

---

## 6. Campaign specifics

- `STARTING_LEVEL = 16`; `ACT_LEVEL_CAP = {1: 32, 2: 48, 3: 68}`.
- Beacons by difficulty: **Normal 3, Veteran 3, Master 2** (Veteran and Master
  both raised 2026-08-12 — see the Beacon arithmetic in §5 and the measured table
  below). Normal and Veteran deliberately share a Beacon count, and after tuning
  they also share `enemyLevelOffset: -2` and `bossTeamPenalty: 1` — so **the whole
  Normal/Veteran gap (36% vs 19%) is carried by AI tiers, healing and the
  economy**: Casual trainers and an Ace Champion versus Trainer-tier trainers and
  an Expert Champion, 0.66 vs 0.62 healing, 500 vs 400 starting credits, 1.0 vs
  1.15 shop prices, 2 vs 1 rerolls. Normal was measured at 4 Beacons and cleared
  56%, too high.
- Bosses by Act — Act 1: `galewarden`, `embercircle`. Act 2: `raincaller`,
  `sandlord`, `trickroom`. Act 3: `hazardlock`, `sunburst`, `setupwarden`.
  Final: `championsyn`. Two-plus options per Act so runs differ. **But the last
  Act is always the Champion**, so at the default three Acts the Act 3 roster
  never appears and a run has three boss fights, not four (§9).
- Boss teams list *preferred* moves; `run.js` filters to legal ones and
  `tests/data-validation.js` fails the build if any preferred move is illegal.
  **Always run the tests after editing `campaign/content.js`.**
- Prompts form a stack. A prompt whose resolution opens a follow-up is removed
  from underneath it via `collapseInto`, detected by **stack depth**, not by
  return value — a handler that opens nothing must not loop.
- Rest/Specialist hub services use `replacePrompt`, not `pushPrompt`, so
  completing a service ends the node instead of returning to the hub forever.
- The run object is fully serialisable including `rngState`. Battles are stored
  as a configuration, so a reload mid-battle rebuilds the identical encounter.

### Measured balance (automated policy, not a human)

Re-measured and **retuned** on 2026-08-12, replacing figures that predated the AI
rework, the run-shape and recruitment changes and the removal of EVs.

Method: `node tools/balance-probe.js 200 <difficulty> advisor` — 200 runs each,
default three Acts, each difficulty's own Beacon count, fixed seeds, all three
rows from the same build. ±3 points of standard error. **24 runs is ±7 points and
is too noisy to tune on.**

**Re-measured twice on 2026-08-14** (200 runs each, advisor policy, same fixed
seeds). The second table is current.

| Difficulty | Clear rate | Target | Avg nodes | Deaths by Act | trainer | elite | boss | rare |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Normal | **41%** | 35 | 31.2 | A3 107, A2 9, A1 2 | 94% | 53% | 59% | 99% |
| Veteran | **30%** | 20 | 30.3 | A3 120, A2 17, A1 3 | 90% | 49% | 58% | 99% |
| Master | **11%** | 8 | 25.1 | A3 112, A2 52, A1 15 | 84% | 47% | 64% | 98% |

**All three moved *toward* target, which is the opposite of what a session of
player-facing additions suggests, and the reason is §6's own lesson: content
feeds both sides.** Ring Target, primal weather, the Wind Sock, the theme leads
and the legacy abilities are all available to the opposition, and on the harder
tiers the opposition's quality matters more than the party's. Master fell 15% →
11% against an 8% target — closer than it has ever been — and Normal 46% → 41%.

Measured mid-session before the Battle Shop's synergy tier existed: 42 / 31 / 10.
The final 41 / 30 / 11 is within ±3 of that on all three, i.e. the shop's
tailored shelf did **not** measurably move clear rates. Worth knowing before
assuming a generous-looking node is a balance problem.

The earlier table, from before this session's content (kept for the trend):

| Difficulty | Clear rate | Avg nodes | trainer | elite | boss | rare |
| --- | --- | --- | --- | --- | --- | --- |
| Normal | 46% | 30.8 | 95% | 51% | 60% | 97% |
| Veteran | 33% | 30.0 | 90% | 47% | 60% | 98% |
| Master | 15% | 25.0 | 84% | 48% | 64% | 94% |

Previously (2026-08-12 tuning, measured after the priority-move generator change):

| Difficulty | Clear rate | Avg nodes | Deaths by Act | trainer | elite | boss | rare |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Normal | 40% | 30.8 | A3 104, A2 10, A1 7 | 93% | 51% | 58% | 98% |
| Veteran | 25% | 30.0 | A3 128, A2 16, A1 7 | 89% | 47% | 57% | 98% |
| Master | 10% | 25.0 | A3 106, A2 56, A1 18 | 84% | 47% | 58% | 95% |

**All three rose 6-8 points and are now 7-13 points above target**, with the
ordering and the death shape both still correct and run lengths unchanged. At
±3 points of standard error every one of those moves is real, not noise.

Three content changes were bundled between the two measurements — the
Arceus/Silvally forme-item generator fix, the Substitute buff (it now soaks
status and stat drops) and several AI changes, plus the 2026-08-14 move-typing
fix — so **the individual attribution is not measured**, only the total. The
boss line is where it shows: 58/57/58 → 60/60/**64**. Master's boss win rate
moved most, which is exactly why its clear rate moved most in relative terms
(10% → 15%) — see §5's Beacon arithmetic, where the boss line is the mandatory
cost.

If a retune is wanted, the lever ranking below still applies and one
`enemyLevelOffset` step is worth ~8-10 points: -2 → -1 would land roughly
36-38 / 23-25 / 5-7 against targets of 35 / 20 / 8. Nothing finer exists, so
**this is a decision to take deliberately rather than to chase**; the §10 note
about wanting a finer lever than any that exists is now the binding constraint
on all three difficulties rather than on Master alone.

Controls: `moves taught` was 1463 / 1369 / 1138 (non-zero on all three), so the
policy was playing the game properly in every row rather than skipping prompts.

Wild encounters sit at 100% / 100% / 100% on all three and are omitted above.

Targets are 35 / 20 / 8, and as of 2026-08-14 nothing is on target — see the
table above. The granularity problem first recorded for Master now applies to
all three: **`enemyLevelOffset` moves in ~8-10 point steps with nothing in
between, the healing dials are provably inert on clear rate, and
`bossTeamPenalty` is binary** (it took Master 13% → 1%). See the lever ranking
below. Master was previously held at the higher of its two reachable values
because the death shape is better there and because erring toward *achievable*
is safer for a difficulty that measured 0% for the project's entire history.

The figures moved several times on 2026-08-13 as content was added, which is worth
recording as a caution: **content changes move clear rates as much as difficulty
dials do.**

| After | Normal | Veteran | Master |
| --- | --- | --- | --- |
| the difficulty retune alone | 36% | 19% | 13% |
| + Rare Encounter nodes | 31% | 22% | 12% |
| + Rare Encounters recruitable at 1 in 3 (since made guaranteed) | 32% | 24% | 13% |
| + branching evolutions | 36% | 25% | 13% |
| + priority moves in generated sets | 40% | 25% | 10% |
| + Arceus/Silvally fix, Substitute buff, AI changes, use-time typing (current) | **46%** | **33%** | **15%** |

A Rare Encounter is one Pokémon against a party, so the probe wins ~95% of them
while the node displaces harder ones. Branching evolutions were worth ~4 points on
Normal on their own, because the probe now takes the highest-BST branch where the
data order previously chose for it.

The **priority-moves** row is the instructive one: **generated sets feed both
sides**, so a
generator improvement is not a player buff. Normal rose 4 points while Master *fell*
3, because on Master the opposition's quality matters more than the party's — the
same change helps the player on the easy tier and hurts them on the hard one. A
change to `random-teams.js` needs the whole table re-run, not a guess about which
way it points.

As of the second 2026-08-14 measurement all three sit **3-10 points** above the
35 / 20 / 8 targets (41 / 30 / 11) — Master is within 3, the closest it has been.
Veteran is the outlier at +10. The granularity argument is unchanged: a
level-offset step is 8-10 points, `bossTeamPenalty` is binary and the healing
dials are inert, so a single global step would fix Veteran and push Normal and
Master well under. **A per-difficulty lever is what is actually needed**, which
is the §10 open item — and it now binds on Veteran alone rather than on all
three, which is a much easier target.

**Re-measure after any content change**, not just after touching a difficulty
number. This has now been demonstrated three times over: the 2026-08-13 content
run moved the table repeatedly, and the 2026-08-14 re-measure found another
6-8 points of drift from changes that were not difficulty dials at all.

**Re-measured twice after this session's work, as a control: base Normal has not
moved.** 200 runs, advisor policy, same fixed seeds:

| after | clear | nodes | trainer | elite | boss |
| --- | --- | --- | --- | --- | --- |
| the previous session (recorded above) | 41% | 31.2 | 94% | 53% | 59% |
| Rebirth Mode | **41%** | 31.2 | 94% | 53% | 59% |
| + the status Orbs firing on entry | **42%** | 31.2 | 94% | 53% | 59% |
| + chip healing, the sleep model, Focus Punch, Ring Target | **43%** | 31.2 | 93% | 55% | 59% |
| + the priority refusal and the duplicate-species fix | **43%** | 31.2 | 93% | 55% | 59% |
| + the `helpless` switch gate (ungated, so both sides) | **42%** | 31.1 | 94% | 53% | 59% |
| + Trick Room over a knockout, and in generated sets | **44%** | 30.9 | 94% | 55% | 57% |

Rebirth is additive by construction — `run.rebirth` is 0 in every ordinary run,
so every branch it touches is inert — and the second row is the evidence rather
than the argument.

The rest **are** content changes that reach both sides: the Orbs sit on Gliscor
and Conkeldurr, Focus Punch is in the generated pool, and the AI additions drive
every opponent as well as Assist Mode. Total drift across the whole session is
**41% → 42%** against a ±3 standard error, run length unchanged at ~31.2 nodes,
the death shape unchanged, and the four per-kind rates within two points
throughout. Not measurable — but measured rather than assumed, which is the
point of the rule.

The last two rows are worth reading rather than skipping. Both are **ungated**
AI changes, so they improve the opposition as much as the player, and the
Trick Room one also alters generated sets — which §6 records as feeding both
sides. The visible signature is in the boss line: **57%, the lowest it has
been**, because a boss team is authored and several of them are slow enough to
want the room. Elites and Trainers hold, and the clear rate ends at 44% against
a ±3 standard error.

Session total: **41% → 44%**, run length 31.2 → 30.9 nodes, death shape
unchanged. That is at the edge of the error bar rather than inside it, so the
honest reading is "probably a small real rise, not measurably more than that" —
and if the next session wants the 35% target back, `enemyLevelOffset` is still
the lever, at ~8-10 points a step (§6's lever ranking).

**Re-measured 2026-08-14 (third pass), after full ability and item coverage.**
200 runs each, advisor policy, same fixed seeds:

| Difficulty | Clear rate | Previous | Target | Avg nodes | trainer | elite | boss |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Normal | **44%** | 44% | 35 | 30.8 | 94% | 54% | 57% |
| Veteran | **23%** | 30% | 20 | 30.2 | 89% | 47% | 56% |
| Master | **14%** | 11% | 8 | 25.2 | 85% | 49% | 62% |

**Only the Normal row is a clean before/after, and it did not move.** Veteran's
30% and Master's 11% were measured in the *first* 2026-08-14 pass and were never
re-run after Rebirth Mode's session, which moved base Normal 41% → 44% — so
30 → 23 and 11 → 14 each mix two sessions' changes and **cannot be attributed to
this one**.

The denominator says the same thing, and it is the reason not to go looking for a
cause in this session's work: **15 of 1,269 packaged species** can carry one of
the 13 new abilities, seven of those are Mega formes that need their stone in
play, and **0 of the 78 entries in `Content.HELD_ITEM_POOL`** is one of the 13
new items. Campaign is almost entirely unexposed to this change. Veteran is
worth re-measuring against a fresh baseline before anyone tunes it — it now sits
3 points above its target rather than 10, which would be good news if it were
attributable, and it is not.

### Rebirth Mode, measured separately

`node tools/balance-probe.js <runs> <difficulty> advisor rebirth`. The mode's
opposition is a different team, at a different AI tier, with a field effect the
base game never has, so the table above says nothing about it.

**How it is measured, and why the denominator matters.** A rebirth can only
start from a run that cleared, so the probe plays an ordinary run first and
measures the rebirth only when it wins. The denominator is therefore the base
clear rate: 60 Normal seeds bought 27 rebirths, 80 Veteran seeds bought 22. The
tool prints `rebirths measured: N of M seeds`. Master is **not** measurable this
way at sane cost — its 11% base rate would need ~500 seeds for a usable sample.

| | Clear rate | Avg nodes | Deaths by Act | trainer | elite | boss |
| --- | --- | --- | --- | --- | --- | --- |
| **Rebirth Normal (n=27)** | **26%** | 29.0 | A3 14, A2 6 | 67% | 56% | 62% |
| Rebirth Veteran (n=22) | 36% | 28.2 | A3 6, A2 8 | 72% | 63% | 62% |
| *base Normal, for contrast* | 42% | 31.2 | A3 105, A2 9, A1 2 | 94% | 53% | 59% |

**Both rows above are superseded — re-measured 2026-08-14 (third pass):**

| | Clear rate | n | Avg nodes | trainer | elite | boss |
| --- | --- | --- | --- | --- | --- | --- |
| **Rebirth Normal** | **32%** | 31 of 60 seeds | 29.8 | 65% | 59% | 74% |
| **Rebirth Veteran** | **33%** | 21 of 80 seeds | 29.1 | 70% | 54% | 65% |

That closes the "re-measure Veteran before quoting it" note: its stale 36% is
really **33%**, and the two difficulties sit on top of each other exactly as §6
predicts they should — Rebirth forces every tier to Expert, so only the economy
separates them. At n≈21-31 the clear rate carries ±9-10 points, so read the
per-kind rates instead.

**The Rebirth Normal run also crashed one seed, and that was a real bug** — see
§8's Red Card entry. It is fixed; the denominator moving 30 → 31 of 60 seeds
between the two runs *is* that seed completing.

At n≈25 the clear rate carries ±9-10 points, so read the per-kind rates instead:
those have 60-250 battles behind them and moved consistently.

**Normal and Veteran Rebirth are expected to sit close together**, and that is a
consequence of the design rather than a defect: §6 records that the whole
Normal/Veteran gap is carried by AI tiers, healing and the economy, and Rebirth
forces **every** tier to Expert. What is left to separate them is the economy
alone.

**Where the difficulty actually lives is the Trainer nodes.** Rebirth bosses and
Elites sit near the base game's; Trainers fall 94% → 67%. That is the mode
working as specified — an ordinary Trainer stops being attrition and becomes a
real fight — and it is also why the level handicap is needed at all: a ~30-node
run cannot pay for thirty coin flips. Rebirth Normal lands between base Veteran
(30%) and base Master (11%), which is about right for a mode you unlock by
clearing the game.

| `REBIRTH.enemyLevelOffset` | Beacons | clear | trainer | elite | boss |
| --- | --- | --- | --- | --- | --- |
| 0 | +0 | **0%** | 44% | 11% | 38% |
| −4 | +2 | 50% | 69% | 59% | 61% |
| **−4** | **+0** | **26%** | 67% | 56% | 62% |

The middle row is why there is no Beacon bonus: it made the mode *easier* than
the base game, which is backwards for a mode you unlock by clearing it. §6's own
lever ranking says the Beacon count is what pays for the boss line, and Rebirth's
bosses are already better than base — so it needs no help there, and the knob was
deleted rather than left at zero.

The shape is now right on all three: deaths concentrated in the last Act, and
every difficulty reaches roughly its full run length. Before the retune, Master
died in Act 1 in 147 of 200 runs and ended after 11 of ~31 nodes.

**No test asserts a win rate**; that would be flaky and would freeze tuning.

#### What the probe is, and is not

It is a *floor*, not a model of good play. It routes sensibly, equips items via
the Advisor, keeps movesets current, uses potions before hard fights and avoids
nodes that already cost a Beacon — but it never builds a team on purpose, never
plans a type matchup, and takes rewards from a fixed priority table. A human
should do better. Its own deficiencies were worth 11 points on Normal (§8), so
**check the policy before concluding the game is mistuned.**

#### Lever ranking, measured

Ranked by observed effect, because the intuitive ordering is wrong:

1. **Boss team size — dominant.** Removing Master's `bossTeamPenalty` (one extra
   boss Pokémon) moved its boss win rate 59% → 37% and its clear rate 13% → 1%.
   One Pokémon on a boss team is worth ~22 points of that fight.
2. **Enemy level offset — strong.** One level step was worth ~8-10 points of
   clear rate: Normal fell 46% → 36% going -3 → -2, Master rose 4% → 12% going
   -1 → -2. All three difficulties ended on -2 as a result.
3. **Beacons — moderate, and worth less as boss win rates rise.** Normal 3 → 4
   Beacons bought only 6 points once its bosses were at 64%, because the run
   rarely needed the fourth.
4. **AI tier — weak.** Promoting *every* Master tier to Expert moved 12% → 13%
   and left its Trainer win rate at 86%. The probe already plays Expert, and the
   Expert-vs-Ace gap is only ~6 points a battle (§10).
5. **Healing and revive fractions — negligible at the margin.** Master was 12% at
   a 0.28 revive fraction and 12% at 0.38; its `battleHealPercent` moved 0.48 →
   0.56 for no measurable change. These matter for *feel*, not for clear rate.

The practical consequence: **tune the boss line first.** It is three mandatory
fights that cannot be routed around, and §5's Beacon arithmetic shows why nothing
else compensates for it.

---

## 7. Testing

```bash
npm install     # see §8 first if this fails
npm test
```

| Suite | Covers |
| --- | --- |
| `tests/data-validation.js` | data integrity, sprite existence, all campaign content |
| `tests/engine-battle.js` | mechanics, determinism, abilities, items, Tera, AI, replays, 200-battle soak |
| `tests/move-coverage.js` | every move mapped + executed; ability/item coverage audits |
| `tests/teams.js` | validation, text round-trip, random team quality |
| `tests/arena.js` | formats, replays, local versus, save migration, records |
| `tests/campaign.js` | full run lifecycle, persistence, bosses, soak |
| `tests/ui-smoke.js` | end-to-end jsdom, asserts **zero** console errors |

Engine tests run in a bare Node VM (`tests/helpers/engine.js`) — fast, no DOM.
Only the smoke test uses jsdom.

---

## 8. Traps that cost time before

**npm install fails with ETIMEDOUT.** `package-lock.json` shipped with
`resolved` URLs pointing at an internal artifactory host that is unreachable.
They were rewritten to `https://registry.npmjs.org/`. If a fresh lockfile
reintroduces them, rewrite again:

```bash
node -e "const f=require('fs');let s=f.readFileSync('package-lock.json','utf8');s=s.replace(/https:\/\/packages\.[^/]*\/artifactory\/api\/npm\/npm-public\//g,'https://registry.npmjs.org/');f.writeFileSync('package-lock.json',s)"
```

**Arrays from the VM sandbox are not `deepStrictEqual` to host arrays.** They
have a different `Array.prototype`. In tests, spread first:
`assert.deepStrictEqual([...x], [...])`. The error message is the misleading
"Values have same structure but are not reference-equal".

**The same realm split breaks `instanceof` — including `instanceof Set`.** A
first pass at the Mechanics-table test filtered the export with `v instanceof
Set`, which is `false` for every table the engine builds, so it silently checked
nothing and reported a clean sweep. Duck-type instead: `typeof
v[Symbol.iterator] === 'function'`. Any `instanceof` against a sandbox value is
suspect.

**`Dex.move()` never returns null — it returns a truthy `UNKNOWN_MOVE` stub.**
So `if (Dex.move(id))` accepts every typo. The predicate for "is this a real
move" is `Dex.hasMove(id)`. `Dex.species()` behaves the same way
(`UNKNOWN_SPECIES`); `Dex.ability()` and `Dex.item()` do return null. This is
exactly how `fickelbeam` survived in a table for so long.

**`BattleConstants` is a hand-written partial mirror of `Mechanics`.** It
re-exports most tables but not all — `PROTECT_MOVES` and `NON_FOE_TARGETS` are
absent. Anything auditing "every table" must read `Mechanics`, the source of
truth; a test written against `BattleConstants` would have missed the `maxguard`
entry entirely. `tests/move-coverage.js` asserts the mirrored tables are the
*same object*, so the two cannot drift.

**`canSwitch(sideIndex)` is not "can this side escape".** It only asks whether
anyone healthy is left on the bench; trapping lives in `isTrapped(pokemon)`.
Reading `canSwitch` to test trapping reported Shadow Tag, Arena Trap and Magnet
Pull as doing nothing.

**Comparing only the *final* state hides anything the battle later undoes.** A
harness that ran four turns and diffed the end state reported Shell Bell as
"announced but inert" — it heals correctly, but the scenario's later Giga Drain
refilled both runs to full and the end states matched exactly. `tools/audit.js`
now records a snapshot after every turn (`battle.trace`). The same trap in
reverse is the HP-capping one: a heal on a full-HP Pokémon changes nothing, so
put the damaging move *first*.

**A move the target is immune to had no check at all, and the AI threw it every
turn.** Reported from a real log: a Grimmsnarl used Thunder Wave into a
Ground-type Gliscor three turns running. The engine refused it each time ("It
doesn't affect Gliscor..."), but `AI.scoreMove` rated it **95 — its best move**,
because `willFail` only asked `battle.moveSpecialFailure`, which covers
hand-written preconditions (Fake Out's first turn, Dark Void being Darkrai-only)
and **not type immunity**. Nothing in the loop could ever change, so it repeated
until something else did.

Why only status moves were exposed: a damaging move into an immunity already
scores as worthless, because `estimateDamage` returns 0. Status moves are scored
by what they *inflict*, so nothing was consulting effectiveness at all.

`AI.cannotAffect` now mirrors `executeMove`'s own refusal order — powder into
Grass, status-move type immunity, Prankster into Dark, and the interception
abilities **and items** — and `willFail` calls it, so these score −900.
The items are a second table on purpose, because the engine keeps them separate:
**powder immunity is refused in two different places**, Grass/Overcoat early and
Safety Goggles later through the item hook. The first version of this gate
covered only the ability half, and Spore into a Safety Goggles holder still
scored +40 — found by an audit rather than by the original report. It matches abilities
**by name** rather than running their `onTryHit`, for the same reason
`estimateDamage` does: those hooks mutate (Flash Fire takes a boost, Disguise
busts) and asking what a move would do must never change anything (§5). A new
immunity ability has to be added to that list too.

Worth knowing before hunting for more of these: **most of the class was already
handled.** Limber, Insomnia, Immunity and Water Veil (−375 to −420), Safeguard
and Misty Terrain (−495) and an already-statused target (−180) were all priced
correctly. Type immunity was the hole. Measured over 1,731 random move
decisions the old build picked a no-effect move **once** (0.06%) and the fixed
one never — but the rate badly understates it, because the situation *repeats
every turn until something else changes*, which is exactly what the report shows.

**A Trick Room setter sets Trick Room first, even over a knockout** (2026-08-14,
by project decision). Reported twice from real battles: a Calyrex-Ice facing a
team that entirely outsped it took two knockouts and then died without acting.

The old scoring was right by its own arithmetic — a certain KO is ~320 and the
room ~130 — and wrong in outcome, because `ai.js` never looks past the current
turn (`docs/AI_DESIGN.md` §3) and Trick Room is the one move whose whole value is
the turns *after* this one. Settled by playing the position out 120 times both
ways rather than by argument: **taking the knockout won 3/120, setting the room
won 94/120.** Guards, each with a control: only when the team-majority Speed test
already says the room helps, never when the knockout would end the battle, and
never when the room is already up. The Speed test itself now measures against
the median of the whole opposing team rather than the Pokémon in front.

**The method is the durable part.** Two rounds of reasoning about the scores —
including mine — concluded the AI was playing it correctly. Playing it out
answered it in one run. A one-turn scorer cannot price a multi-turn investment
from the inside, so that class of question has to be measured by outcome.

**Trick Room was also unreachable in generated sets** (`0 of 300` Calyrex-Ice
sets carried it, despite base 50 Speed and 165 Attack). Same shape as the
priority-move gap in §8: `chooseMoves` picks attacks by power and utility by
role, and Trick Room is a *stat-profile* move that is neither. It now has a slot
of its own on slow, hard-hitting species — measured at 12% for Calyrex-Ice and
21% for Hatterene, and 0% for Dragapult, Pheromosa, Blissey and Shuckle. That is
a separate finding from the report above, which was about a set that *had* the
move.

**A Pokémon that can do nothing must leave, and that is a gate rather than a
comparison** (fixed 2026-08-14, reported from a real log). A Kingambit
Choice-locked into Dig against a Flying Skarmory stayed in for **six turns**,
alternating burrow and "it doesn't affect", and died there.

Two bugs, and the first hid the second:

- **`AI.bestDamage` ignored the Choice lock**, reporting a Kowtow Cleave the
  Pokémon could not select. Everything downstream inherited that fiction —
  `canKO` refused to abandon a knockout it could not execute, `matchupScore`
  read the position as survivable, and a Choice-locked *foe* was mis-priced
  too. It now filters to the locked move, which improves all three at once.
  **Only the Choice lock**, deliberately: Taunt, Disable and Encore lapse, and
  pricing a two-turn Taunt as permanent would make the AI flee positions it
  should hold.
- **`considerSwitch` weighs matchups against a margin of 3.4-5.2.** Even with
  the matchup correctly reading 0.0 against a bench of 1.1 and 1.5, a
  *completely* lost position still lost the comparison to a merely bad one. No
  threshold tuning fixes that — staying is worth exactly zero, so nothing
  should have to outbid it.

`AI.helpless` asks the engine (`availableMoveIndices`) what may be selected
rather than re-deriving the Choice/Taunt/Disable/PP rules, so it stays correct
as restrictions are added. Struggle counts as damage. **It is ungated**, unlike
most of the AI's judgement, for §8's reason about impossible moves: six turns of
hitting something that cannot be hit reads as broken, not as beatable. It is the
only change this session that moved the ladder, which is recorded with its
numbers in `docs/AI_DESIGN.md` §9.

**A guard that knows a move cannot work and only withholds a bonus is not a
guard** (fixed 2026-08-14, reported from a real log). A Kingambit threw Sucker
Punch into a Tapu Lele under its own Psychic Terrain on **three consecutive
turns** and died without landing anything.

`scoreMove` *did* know — it computed a `priorityBlocked` local with exactly the
right condition — and then used it only to withhold a +80 knockout bonus. The
move kept its full damage score, stayed the best-rated option, and nothing in
the loop could ever change: §8's Thunder-Wave-into-Gliscor bug wearing the
costume of a fix. The refusal now lives in `AI.cannotAffect`, which is where
every other "this move cannot work" belongs, and covers **Dazzling / Queenly
Majesty / Armor Tail** at the same time — the engine refuses those on the very
next line and the AI knew about neither.

`priorityBlocked` was **deleted rather than left in place**: `willFail` now
returns −900 far above the lines that read it, so a second copy of the test
could never fire, and an unreachable guard is the exact shape this section keeps
recording.

**It mirrors the engine, not the games, and that distinction is load-bearing
here.** `executeMove` tests the *packaged* `move.priority`, so Grassy Glide —
whose +1 this project applies in `runTurn` against a packaged 0 (§5) — really
does land under Psychic Terrain in this battle system. A version that used
`effectivePriority` would be more games-accurate and would make the AI refuse a
move that works, which is the same class of bug in the opposite direction. Four
controls pin the narrowness: no terrain, Electric Terrain, an ungrounded target,
and Grassy Glide all keep scoring positive.

**Measured, with the denominator that makes the number mean anything.** Only
**10 of 400** random teams can create the position at all — a Psychic Surge
holder, a Psychic Terrain move, or one of the three `blocksPriority` abilities —
which is why `tools/ai-ladder.js` is *byte-identical* before and after and can
say nothing either way. But once the position exists it repeats until something
else changes: over six turns of the reported matchup the old build threw away
**3 turns**, the fixed build **0**, which is exactly the three wasted turns in
the log. Rare per team, decisive per occurrence — the same shape as the Thunder
Wave into Gliscor entry, and the reason a rate alone understates this class of
bug.

**A blunder must be a worse move, not an impossible one.** `chooseAction` gives
the weak tiers a `mistakeChance` that "ignores the ranking and plays something at
random" — and it drew uniformly from *every* legal move, including ones scored
−500 for having no effect. A Nidoking therefore Earthquaked a Water/Flying
Pelipper on two consecutive turns: the roll came up, and nothing about the
position had changed by the next turn. Reported from a real log. `scoreMove` was
innocent throughout; it rates that Earthquake −500 at **every** tier.

Measured before the fix: **6.7% of Casual's decisions, 5.8% of Trainer's, 4.2% of
Ace's, 0% of Expert's** (Expert has no mistake roll). After: zero everywhere. Both
randomisers now draw from moves that can actually do something, falling back to
the full list only when everything is futile.

The distinction matters because it is the one mistake that reads as the game
being *broken* rather than the opponent being beatable. The weak tiers keep every
other way of being wrong — the ladder still checks out at 58–81% with correct
ordering, and a test asserts Casual still plays off-best more often than Expert,
so a "fix" that quietly deleted the difficulty setting would fail.

**"Will this move even happen?" is the AI's most important question, and it is
asked once.** `scoreMove` computes `resolves = outspeeds || !dying` and every
branch is weighed against it. If the foe moves first and its best hit is lethal,
anything slower never resolves: the knockout does not land, the status is not
inflicted, the heal does not happen. Three separate places had this backwards
and all three cost real games:

- A lethal-but-slower move collected a **+90 "trade favourably" bonus** for a
  knockout that could not occur. Reported from a real battle — Kingambit had
  Haxorus in Sucker Punch range, threw a slower move and died before it landed.
- **Damage was uncapped**, so a 397-damage Earthquake into a 56 HP target
  outbid a priority move that would actually resolve. Damage is now worth what
  it *removes*, capped at the target's remaining HP; the knockout bonus is what
  rewards securing it.
- `pivotValue` **rewarded pivoting precisely when the pivot would not happen**.

Priority moves are unconditional in this project (§5), so `movesFirst` is a
straight answer rather than a prediction — which is what makes the rule safe to
lean on this hard. Test: `the resolve rule is global, not one interaction`
checks five unrelated Pokémon at two tiers, and carries a control asserting the
guards did not skip every case.

**A turn you are certain to survive is a turn to boost, and it needs no item.**
The AI already knows all four of the foe's moves, so `foeThreat` is the worst of
them and the arithmetic is available — no Focus Sash or damage-halving ability
required. A full-HP Volcarona taking 90 into 160 used to throw Bug Buzz (96) over
Quiver Dance (30) turn after turn. Setup is now paid the **forgone damage**,
priced the way `scoreMove` prices a hit, so it scales itself rather than being a
number tuned to one matchup.

**Which hit it measures depends on who moves first.** Boost first and the new
defences apply; get hit first and they do not. Shell Smash is what makes this
load-bearing, because it *lowers* both defences — the same Snorlax hit is 36
before the smash and 53 after. `incomingAfter` is measured inside the temporarily
boosted window, so `movesFirstNow ? incomingAfter : incoming` is the whole rule.
A Speed boost never helps here either: turn order is fixed at the start of the
turn, so Agility does not outrun anything on the turn it is used.

**The Shell Smash "scoring gradient" is not a gradient — it is a step at the
crit-proof safety margin** (characterised 2026-08-14; it had been noticed as
"200 against a Lv66 Snorlax and 0 against a Lv70 one" and left unexplained).

The whole thing hangs on one flag in `setupValue`:

```js
const survivesForSure = survivesOutright(...) || incomingThisTurn * 1.5 < hpAfterCost;
```

The `1.5` is the allowance for a high roll *and* a critical hit — "sure to
survive" is deliberately stricter than the mean-roll estimate. It is a hard
threshold, and **two discrete bonuses hang off it**, so crossing it moves the
score by a lot at once:

| position | above the margin | below it | swing |
| --- | --- | --- | --- |
| not lethal yet | `safeSetupTurn`, up to +140 | 0 | up to 140 |
| already lethal | `freeSetupTurn` **+250** | `alreadyLethal` **−170** | **420** |

Measured, Gorebyss L66 into a Snorlax, sweeping the foe's level: **86 → 40** at
foe L68 in the first case and **290 → −130** at the same L68 in the second. The
420-point version is the one that was reported. The margin is crossed by a
single point — 169 HP against `113 × 1.5 = 169.5`.

**Shell Smash is the sharpest case in the game for it, because it is the only
common setup move that lowers both defences.** `incomingAfter` is measured
inside the boosted window, so one stage off Def and SpD makes it ~1.5x
`incoming`, and the margin it must clear is 1.5x bigger in turn. The practical
rule, and it predicts the crossing level exactly:

- an ordinary setup move needs the foe's best hit under **67%** of your HP
  (`1 / 1.5`);
- **Shell Smash needs it under ~44%** (`1 / 2.25`), measured *before* smashing.

Gorebyss has 169 HP, so 44% is 75: at foe L67 the hit is 74 and it sets up, at
L68 it is 76 and it does not.

Two consequences worth knowing before touching it:

- **A White Herb removes the cliff entirely**, because the drops never happen and
  `incomingAfter === incoming`. Verified as the control: the same sweep is flat
  at 325 across every foe level. If a future change makes the White Herb case
  cliff too, this explanation is wrong.
- **The cliff only exists for a smasher that outspeeds.** `incomingThisTurn` is
  `movesFirstNow ? incomingAfter : incoming`, so a *slower* smasher is judged on
  its pre-smash defences (the hit lands first) and gets the ordinary 67% rule.
  Shuckle shows this in the sweep.

It errs conservative, which is the intended direction — refusing a setup that a
crit would punish is the project's stated rule. **Not changed.** Softening it
would mean ramping the bonus as the margin narrows rather than switching it, and
that is a tuning change that needs `tools/ai-ladder.js` behind it, not a guess.

A note on measuring it: the first sweep built for this reported **0 of 28**
learners affected, vacuously — both branches require `foesLeft > 1` and the
harness gave each side one Pokémon, so neither could ever fire. That is §11's
rule again, and it cost a round here even though the rule is written down.

**Belly Drum is evaluated at the HP it will actually be used at.** The standard
Belly Drum set pairs it with a Sitrus Berry precisely so a *slower* drummer can
be knocked under half, eat the berry, and drum anyway. Checking the HP cost
against *current* HP gets that wrong in both directions — approving a Drum the
incoming hit makes illegal, and refusing one the berry would rescue. `setupValue`
now walks the turn in order: take the hit if slower, eat the berry it triggers,
then check the cost. Verified against the engine: a slower Azumarill with Sitrus
ends the turn at 81 HP with +6 Attack (scored 95) against 38 HP with no berry
(scored 0). §8's "odd max HP breaks the combo" still holds, but only for a
drummer that moves **first** — a test that used a faster Blissey was quietly
measuring the other case.

**"Is the boosting finished?" and "is this my last turn?" are separate questions
from the resolve rule, and both were missing.** Two additions, both measured to
change real decisions:

- **Already lethal means stop boosting.** `scoreMove` taxes repeated setup by
  stack count, but a fifth Calm Mind still multiplies damage by 1.5, so it still
  read as a gain. `setupValue` now penalises a boost heavily when the *current*
  move already knocks the target out (`damageBefore >= effectiveHP(foe)`). That
  is what "when is boosting enough" means in practice: the moment the move in
  hand already wins the exchange.
- **A doomed Pokémon spends its final action on damage.** Nearly every utility
  move is a turn bought on credit — hazards collect as the opponent switches,
  status buys time, screens pay out later — and none of it arrives for a Pokémon
  about to faint. Status moves are penalised when `dying`, except
  `LAST_STAND_MOVES` (Destiny Bond, Memento, Healing Wish, Lunar Dance), which are
  *for* that moment and are rewarded instead. Measured: Stealth Rock 20 → −175
  when doomed, while chipping stays selectable.

`considerSwitch` also now measures `dyingSoon` and `canKO` against
`effectiveHP` rather than raw HP, matching `scoreMove`'s own `dying`, so the two
halves of the AI agree about whether a Pokémon is about to faint.

**Two AI changes were written, measured to change nothing, and removed.** Both are
worth not rediscovering, because both are intuitively appealing:

1. **"Boosted and surviving, so hold position"** — the +2 Cresselia versus Dark
   Pulse case. Across 2,400 decisions (600 randomised matchups × four tiers) it
   altered **zero** choices; its precondition was reached 86 times and the existing
   logic had already chosen to stay in every one. Three things get there first: the
   guaranteed-KO short-circuit, `switchCost += boosted * 0.5`, and the fact that
   failing `margin < threshold` defaults to staying. **The AI already does this.**
2. **A tiered type-resistance bonus in `matchupScore`** — `threat` already prices
   resistance continuously, because a resisted hit simply *is* less damage, so an
   explicit bonus double-counts it. Zero of 512 switch decisions changed.

The measurement matters more than the conclusion: the **first** sweep built for
this produced 0 switch decisions in 2,400 calls, because `switchThreshold` is a
matchup *margin* of 3.4-5.2 that random bulky-versus-bulky matchups never
approach. Every "no difference" it reported was vacuous. A switch sweep must
report how many switches it actually produced, and lopsided positions have to be
built deliberately — see the §11 rule, which this is a textbook case of.

**"Am I dying?" must be asked of the foe the foe is about to *become*.** The AI
chooses before the turn runs, and Mega Evolution resolves in `runTurn` **before
actions are ordered** (§5) — so a foe one step from Mega Evolving is already stronger
than `bestDamage` reports. `AI.incomingThreat` counts an unspent Mega (scaling by the
forme's offensive base-stat ratio) and an unspent Tera that would lift STAB on the
foe's own best move, and it is what feeds `dying` in `scoreMove` and `dyingSoon` in
`considerSwitch`.

The reported case, measured exactly: a level-68 Kingambit holding Sucker Punch read
Rayquaza's V-create at **228** against its **235** effective HP, concluded it survives
by 7, and correctly took its biggest move — then Rayquaza Mega Evolved, the Attack
jump (150 → 180) took the same attack to **266**, and the slower move never happened.
**The resolve rule was right and its input was wrong**, which is the more general
lesson: every branch that leans on `dying` inherits the accuracy of that one number.
Speed was never involved — Rayquaza outsped either way.

Deliberately an estimate, not a simulation: damage scales linearly with the
attacker's offensive stat, so the base-stat ratio is exact for that component
(predicted 1.2x against an observed 1.17x). The Mega forme's *ability* is not
modelled. Erring high is the safe direction.

**The AI reads the whole enemy team's movesets, not just the active foe's.**
`AI.teamThreat` returns the hardest hit anything unfainted on the other side could
land, and who lands it. The first consumer is the setup decision: `setupValue` now
asks whether a **bench** Pokémon outspeeds the *boosted* sweeper and knocks it out,
because the AI would otherwise set up in front of its own revenge killer. Measured
decisive — setting up in front of a Blissey scores 160 with an Iron Moth on the bench
against 230 with a Shuckle.

Two notes for anyone extending it:

- The bench check is measured **inside the boosted window** in `setupValue`, so the
  Speed a Dragon Dance buys counts when asking who is faster.
- This is **full information**: the AI sees movesets the player cannot, since
  `hideOpponentDetails` is on in every format. That is a deliberate choice — the AI
  is an opponent, not a simulated player, and it already read the active foe's real
  moves rather than a guess.

**The AI asks the engine for accuracy, never the packaged number.** `hitChance`
calls `battle.moveAccuracy`, so Thunder and Hurricane read 100% in rain (50% in
sun), Blizzard 100% in snow, Toxic 100% from a Poison type, plus Gravity,
accuracy/evasion stages, Compound Eyes, Wonder Skin and Bright Powder. Reading
`move.accuracy` had the AI avoiding its own best move in the weather it had
just set.

**Hazards and status are judged against the whole enemy team.** `hazardValue`
returns expected chip per remaining Pokémon rather than a head count, so Stealth
Rock is worth four times as much against a Charizard as against an Excadrill and
Spikes collapse against a floating team — the AI flips its layer choice
accordingly. Existing layers are priced marginally (a fourth Spikes layer is
worth nothing). Status is weighed by whether it buys time: Toxic is worth more
into a wall, burn into a physical attacker, and everything is discounted against
a team holding a cleric or Natural Cure.

**A contact-punishing ability is an asset, not only a deterrent.** The AI already
avoided *using* contact moves into Flame Body and Rough Skin; `matchupScore` now
credits holding one against a contact attacker, so it will switch the Flame Body
holder into the physical attacker it walls. Worth nothing against a non-contact
move, which a test asserts.

**Sacking is a decision, not a failure.** A Pokémon about to faint presents a
choice: switching preserves it but hands the replacement a free hit, while
letting it faint loses it and the *next* replacement arrives untouched.
`considerSwitch` used to discount its threshold whenever it was dying, which
reliably fed a second healthy Pokémon to the same attack to rescue a spent one.
It now weighs `preserveValue` (health, what it still answers, whether it can
meaningfully damage anything at all, role, boosts) against whether any bench
member can actually absorb the hit. `chooseSwitchReplacement` sends the most
expendable Pokémon when every option loses anyway, keeping the answer for later.

**Tera is spent on a moment.** Once per battle, so the test is whether *this*
turn is the one: it converts a non-knockout into a knockout, saves a lethal hit,
blunts an incoming attack (a Fairy with a Steel Tera type takes nothing from a
Poison move instead of double), breaks a wall for an already-boosted sweeper, or
there is nothing left to save it for. It is explicitly *held* when it changes no
outcome. Incoming damage is re-read **after** the type swap, so a foe holding
coverage that punishes the new typing correctly declines the bait. The previous
version measured correctly but named the two halves backwards — `incomingBefore`
was read while Tera'd — which made the condition impossible to check by eye.

**Fast and slow pivots are different moves.** A slow pivot lets the foe attack
first and only then swaps, so the teammate arrives untouched; a fast pivot walks
it into the attack. `pivotValue` prices the landing matchup net of hazards *and*
net of the free hit on a fast pivot. Shed Tail is separate again: it fails below
half HP (a hard refusal), and the Substitute it hands over is worth most when a
setup sweeper is waiting.

**Setting up asks four questions** (`setupValue`): does the move work at all
(Belly Drum below half fails), do I survive the turn (Focus Sash, Sturdy,
Multiscale, and a berry the HP cost itself triggers), does the boost convert
(applied temporarily, then damage and turn order re-measured), and can it be
taken away (phazing, Taunt, priority revenge, Unaware).

**The move request reports the power a move will actually hit for.**
`buildMoveRequest` runs `dynamicBasePower(..., {preview: true})` against the
current foe, then layers the ability-aware display on top, and sets
`powerIsDynamic` when the result differs from the packaged number so the button
can mark it rather than silently disagreeing with the Pokédex. Without this the
button read 50 BP off a Last Respects hitting for 250. Covers every use-time
power: Last Respects (+50 per fallen ally), Rage Fist (+50 per hit taken, cap
350), Fury Cutter (doubling, cap 160), Rollout (doubling to 480), Stored Power
and Power Trip (+20 per boost), Acrobatics, Trump Card, Facade and the rest.
`preview` keeps it read-only — the three rolling moves report their mean rather
than drawing from the battle RNG, and a test asserts building a request advances
neither the RNG nor the log.

**A second copy of a release loses whatever the first copy gains.** The
full-party recruit swap released its victim *inline* — splice the party, prune
the prompts — instead of calling `releaseMember`. Every effect of a release then
had to be remembered and repeated at that call site, and two were not: the
**held item was destroyed rather than returned to the bag** (swap out a Pokémon
holding a Choice Scarf and the Scarf was simply gone) and Full House's
`releaseRefund` never paid on that route. Reported from real play, after the
prompt-pruning half of the same duplication had already been found and patched
in isolation — which is the tell: a call site that keeps needing "and also do
this" is not missing a line, it is missing a function call. Fixed by routing
through `releaseMember`, not by adding the two missing calls. The test asserts
both routes and would fail only the recruit half if they ever fork again.

**A prompt outliving the Pokémon it was for blanks the whole run screen.**
Several prompts carry a `memberUid` — move-learn, tutor, ability swap, nature
change. Release that Pokémon and the prompt stays on the stack holding a dead
uid; the renderer dereferences `member.set`, throws, and the run screen goes
blank with no way out but editing the save. It was nearly unreachable while a
full party was never *offered* recruits, and became routine the moment it was.
Fixed in three places, and all three are needed: `releaseMember` prunes,
the recruit path prunes (it releases inline, not through `releaseMember`), and
`Campaign.deserialize` prunes on load so an already-stuck save heals itself,
falling back to the map when the stack empties. The three member-scoped
renderers also fail to a dismissible card rather than throwing, so a *future*
prompt carrying a member reference cannot brick a run.

**Belly Drum + Sitrus Berry needs an even max HP, and that is correct.** The
Sitrus threshold is `currentHP > maxHP/2 → don't eat`, and Belly Drum leaves the
holder at `maxHP - floor(maxHP/2)`, which is one point *above* the threshold when
max HP is odd. At level 100 with no EVs max HP is always odd (`2·base + 141`), so
in Campaign the combo never fires; 4 HP EVs in Arena make it work. This matches
both the games and real set-building practice — do not "fix" it. `AI.setupValue`
mirrors the engine's own threshold rather than `pinchBerryThreshold`, which is a
different number (`maxHP/4`); using the wrong one made the AI credit a payback
that never happens.

**Speed Boost on a switch-in is not a bug.** A Pokémon that switches in on turn
N is first boosted at the end of turn N+**1**, never on the turn it arrives; a
*lead* has been out since before turn 1, which is why leading looks different.
Reported as a bug, reproduced in all three cases, and pinned by a test so the
distinction cannot be "fixed" into a real bug later. `activeSinceTurn` is what
Speed Boost reads; `activeTurns` is what Fake Out reads. Still do not merge them.

**Removing a stat source strands saved HP above the new maximum.** Dropping EVs
from Campaign lowered every party member's max HP, and existing runs carried a
`condition.currentHP` computed from the old one — the party card read "199/164"
and stayed there. `Campaign.deserialize` now re-clamps on load. Any future change
that moves a stat needs the same treatment.

**Bookkeeping volatiles change on every single move.** `echoedVoice`,
`furyCutter`, `stallCounter` and `rolloutStage` are per-move counters, not
effects. Including them in a diffed state snapshot makes any move-level sweep
unable to fail — a control move that did nothing at all still "changed state".

**Chrome caches the local scripts hard.** Editing a `src/**.js` and reloading
often serves the old file even with a forced navigate. `run_game.py` now sends
`Cache-Control: no-store`, so the real launcher is safe — but a bare
`python -m http.server` is not. Serve on a **different port** when using one, and
suspect the cache first when a change "does not work": that has happened more
than once and cost real time each round.

**Field VFX follow two rules.** Both were learned by shipping the wrong thing
twice:
1. **Weather is the air; terrain is the floor.** Weather layers are particles
   travelling through the scene. Terrain layers are the surface the Pokémon
   stand on — anchored to the bottom edge, larger and denser near the camera,
   swaying or pulsing *in place*. Sliding a terrain sideways is what made all
   four read wrong.
2. **Particles, not `repeating-linear-gradient`.** Rain always looked right
   because it is layered `radial-gradient` droplets. A stripe pattern in a field
   layer is a regression; the only `linear-gradient` allowed is a soft wash
   (haze, ground glow), never a repeating one.

`vfx-preview.html` in the project root shows every weather and terrain side by
side on a mock field — open it through the local server to review VFX work.

**Screenshots of the preview pane work — but only while the pane is displayed**
(verified 2026-08-14). This refines the long-standing note that they always time
out. They do not: a displayed pane composites frames and screenshots fine, and a
VFX or layout change *can* be visually verified by the agent. A **hidden** pane
composites nothing, and the call fails with exactly that reason —
*"the Browser pane is not displayed, so the page is not compositing frames"*.
That is almost certainly what produced the original "screenshots do not work"
note, and it is not something the agent can fix from its side: ask the player to
show the pane. Four caveats that still bite:

- **The pane caps screenshots at 800px wide** and downsamples anything larger.
  For a legible desktop shot, launch the real app (`Launch Pokemon RedGPT.bat`)
  and use the Windows screenshot tool.
- **The pane's own viewport is ~780x694**, which is narrow-desktop. Layout that
  is fine there may still differ at the width the player actually uses, and
  `resize_window` will not go above the native size.
- **`computer{action:"zoom"}` returns a stale cached frame.** It is not
  supported in this pane and silently hands back the previous full screenshot —
  which disagreed with the live DOM once during this session and looked like a
  rendering bug. Use `action:"screenshot"`, and pair anything important with a
  DOM read.

**Verify the UI on a scratch instance, never the player's save.** `localStorage`
is per-origin, so a second server on a **different port** has its own empty save
and cannot touch the real one. `.claude/launch.json` carries a `redgpt-scratch`
entry on port 8124 for exactly this. It makes the whole UI reachable safely:
create a run with `Campaign.createRun` + `chooseStarter`, stage any prompt by
pushing it (`run.promptStack.push(p); run.phase = 'prompt'; run.pending = p;`),
write it into `save.campaign.runs[0]` with `activeRunId`, reload, and press
Continue. That is how the tutor table, the move-learn prompt and Heal All were
reached on 2026-08-14 without a single battle.

**The `-ate` abilities do not live in `moveType`.** An earlier note here said
they did. They apply in `onModifyMove` at use time, which is why
`src/ui/battle-ui.js` builds a converted copy of the move before asking for
effectiveness. `moveType` handles the *move's own* use-time typing (Weather
Ball, Terrain Pulse, Judgment, Revelation Dance, Ivy Cudgel, Raging Bull...) and
deliberately does not defer to an `-ate` conversion — Weather Ball already made
that choice, and the five moves fixed on 2026-08-14 match it.

**Windows mouse coordinates do not match screenshot pixels** (display scaling),
so clicking by coordinate on the desktop is unreliable. Drive the page through
the preview pane or JavaScript instead.

**Relic and ability modifier keys are declared in one file and read in another,
so a new one is dead on arrival unless you wire it up.** Six modifier keys
invented for new unlockable relics (`rerollsPerAct`, `endurancePerAct`,
`mapLookahead`, `restFullPP`, `wildRecruitChance`, `creditsPerAct`) were caught
this way before shipping — `grep -c` across `run.js`, `campaign-ui.js` and
`map.js` returned 0 for every one. Either reuse a key `modifiers()` already
aggregates and something already reads, or implement the new one and add it to
the `modifiers()` defaults. `releaseRefund` is the one that was implemented.

**A declared flag or hook that nothing reads is the project's most common silent
bug.** An ability or item definition carries `parentalBond: true`, `ruinStat`,
`grounded`, `bindingMultiplier` or an `onModifyWeight` hook, no engine file ever
reads it, and the effect ships counted as *implemented* while doing nothing —
sometimes while printing a message claiming it worked (the Ruin abilities did
exactly that). Eleven of these were found and fixed in one pass. When adding an
ability or item, grep the flag name outside its own definition file and confirm
something consumes it. The same applies to a move whose packaged `secondary` is
an empty object: Showdown implements those with an `onHit` function that does not
survive data export, so they must be special-cased by id in `battle.js`.
`tests/move-coverage.js` guards the move case with an explicit list. A purely
static guard for the ability/item case was tried and removed — hooks are
dispatched dynamically by name, so text matching produced hundreds of false
positives. Behavioural tests are the reliable check.

**Spectate Mode drives both AIs from the UI.** Building an AI-vs-AI battle with
`controller: 'ai'` on both sides makes `autoResolve` play the entire battle
during `start()` — there is nothing left to watch. So both sides are built as
`human` (the engine then waits for choices) and `BattleView.spectateStep()` asks
`AI.chooseAction` for each side, turn by turn, through the normal `choose()`
path. Turn playback, replays and the command log all keep working unchanged.
Spectated battles are deliberately **not** written to the player's win/loss
record. Playback speed is `settings.spectateSpeed` (a multiplier — higher is
slower) applied through `BattleView.pace()`; the range runs 0.12x to 4x because
even "slow" at 2x was still too quick to follow.

**The end screen must be deferred *and* released.** The `end` event fires inside
`choose()` — while the turn is still being captured and before `playTurn()` runs
— so gating the end screen on `animating` alone let it appear mid-playback; the
player could act on it, and playback's closing `render()` then re-showed it over
whatever screen came next. In Campaign that overwrote the reward screen and asked
for the reward a second time. `handleEvent` now defers on `capturing || animating`,
and `BattleView.detached` is set the moment an end-screen action fires so no
later callback can render over the screen that replaced it. Every render path
checks it.

**A stat multiplier with no boost stage behind it is invisible on the card**
(fixed 2026-08-14, reported). Protosynthesis and Quark Drive raise a stat
through `onModifyStat`, not through `boosts`, so nothing on the mon card
reflected them and the only trace was a log line that scrolls away — the player
could see "Quark Drive" named as the ability and had no way to tell *which* stat
it had picked, or whether it was still active.

`pokemonView` now carries `abilityBoost` (the stat id) and the card renders it
in the same green `boost-chip` as an ordinary boost: **"Quark Drive: +Atk"**.
Two things worth keeping:

- **It follows the same `reveal` gate as the ability name.** The activation is
  announced in the log for both sides, so this is not new information — but
  showing what an opponent's hidden ability boosted while the ability itself is
  masked would be an odd half-reveal, and `hideOpponentDetails` is on in every
  format.
- **The badge appears on switch-in and at end of turn, not mid-turn.** The
  ability sets its stat in `onStart` (covered by the switch `refreshCard`) or in
  `onResidual` (covered by the authoritative end-of-turn `render`), and it emits
  no event of its own. If a future effect changes `abilityState.boostedStat`
  mid-turn, it needs a `refreshCard` — which is the rule the next paragraph is
  about.

**The card renders type, Tera state, ability and item — so every event that changes
one of those needs a `refreshCard`, and two did not have a case at all.** `tera` and
`itemused` fell through to the default beat, so a Terastallized Pokémon kept showing
its base typing and a spent Focus Sash or eaten Berry stayed listed as held until the
authoritative end-of-turn `render()` — seconds, on a long turn. Mega Evolution was
never affected because it goes through `formeChange`, which emits `forme`, which was
handled. Check the emitted event list against what the card reads before assuming a
new effect is covered.

**Playback must refresh the cards, not just the sprites.** The end-of-turn
`render()` is authoritative, but a turn can be seconds long — so anything the
info card shows has to be updated as its event plays, or the card describes a
Pokémon that already left the field. `refreshCard(side)` runs on switch, faint,
status and boost; `refreshFieldEffects()` runs on weather, terrain, pseudo-weather
and side conditions. HP stays on the cheap in-place `updateHP` so the bar keeps
its CSS transition — a full card rebuild would restart it every tick.

**The spectate bar must never be locked during playback.** `playTurn()` puts
`.is-busy` on `.battle-controls` to stop double-input, but in Spectate Mode there
are no move choices to protect — and locking it created a trap: the faster the
battle ran, the smaller the window to slow it down, so the fastest setting was
unrecoverable. Spectate skips `is-busy` entirely. For the same reason the speed
picker is a button group, not a `<select>`: the controls are rebuilt every turn,
which closes an open dropdown.

**Turn playback is a UI concern layered over a synchronous engine.** `choose()`
still resolves the whole turn in one call — nothing about the engine became
async. `BattleView` captures the emitted events (with `battle.events.length` as
a log cursor), then replays them on a timer, animating the sprites and easing
the HP bars before one authoritative `render()` at the end. Input is blocked via
`.battle-controls.is-busy` while it runs, and `submit()` ignores re-entry. Timings
live in `BEATS` in `src/ui/battle-ui.js`; the visuals are all CSS in `styles.css`
(no sprite frames, no new assets). It honours the existing `animations` setting
and `prefers-reduced-motion`. **`tests/ui-smoke.js` disables animations before
its click-through loops** — with them on, a 3 ms-per-click loop outruns playback
and the battle never finishes. A separate test drives the animated path directly.

**Scope UI lookups by class, not id, when two views can coexist.** Playback used
`UI.$('#battleControls', root)`; in jsdom a second `BattleView` produces a
duplicate id and the scoped id lookup returns nothing, so the test saw controls
that were never disabled. `.battle-controls` is unambiguous. The same trap bites
any test that mounts a second view into the document.

**Defender-side reactive effects have three easy mistakes**, all of which were
live at once in `applyDamagingMove`. (1) A Substitute that soaked the hit means
the holder was never touched — Red Card, Eject Button and Weakness Policy must
not fire; gate on `defender.hitSubstituteThisMove`. (2) Protective Pads and Long
Reach negate **contact only**, so do not skip the hooks wholesale — pass a
contact-free copy of the move, which lets Rocky Helmet and Rough Skin opt out via
`move.flags.contact` while Red Card (not a contact effect) still fires. The item
branch used to skip everything and the ability branch used to ignore Pads
entirely, i.e. wrong in both directions. (3) A switch item is only spent if the
switch can actually happen — check `canSwitch` *before* `consumeItem`.

**A defender-side guard that ignores move targeting blocks the *user's* own
moves.** Good as Gold was `move.category === 'Status' && target !== source`,
which is what the ability text says — but the executor hands it every status
move on the field, so while Gholdengo was active *nobody* could use Swords
Dance, Protect, Substitute, Rest, screens, weather, terrain, Trick Room or
hazards. 39 of 53 probed cases were wrong and it read as a plausible "It doesn't
affect..." message every time. The same gap made the opponent's Wind Rider
absorb your Tailwind (`allySide` + the `wind` flag) and would have let Soundproof
eat an opposing Howl. The fix is the `aimedAtFoe` gate in §5. When adding
anything that reacts on the defending side, test it against a self-targeting
move, an `allySide` move and a hazard — not just an attack.

**`ungrounded` is not an immunity.** It only makes `isGrounded` false, which
covers hazards, terrain and Ground-move *effectiveness against Flying types*. It
does **not** stop a Ground move hitting an otherwise-grounded holder — Levitate
blocks Earthquake through a separate `onTryHit`, and Air Balloon shipped without
one, so it ate full Earthquakes for a while. Anything that claims to float needs
both.

**Fake Out and First Impression key off `activeTurns`, not the turn number.**
They previously compared `activeSinceTurn !== battle.turn`, which was false in
every situation — the moves never worked at all, including for a turn-1 lead.
`activeTurns` counts up in `resetTurnFlags`, so a Pokémon sent in as a faint
replacement at the end of a turn is correctly on its first *acting* turn next
turn. `activeSinceTurn` still exists and is what Speed Boost uses; do not merge
the two.

**Dummy Pokémon in tests must not heal themselves.** Using `rest` as the
opponent's move silently restored their HP and made damage assertions read 0.
Use `tackle` or an inert status move. Also: Snorlax's first ability is
**Immunity**, so it cannot be poisoned — pick a different dummy for status tests.

**Party uids come from `Date.now()`**, so two playthroughs never produce equal
uids. Compare set content, not serialised party objects.

**A "best move of each type" generator can never pick the second-best of a type,
however good it is.** `chooseMoves` takes the highest-`movePower` STAB per type and
dedupes by type, and `movePower` ignored **priority** entirely — so a Kingambit's
Kowtow Cleave (85 BP) always beat Sucker Punch (80), and Sucker Punch could then
never be the second Dark STAB either. Measured **0 of 40** generated sets for Sucker
Punch, Bullet Punch, Grassy Glide and Upper Hand alike. The only priority moves that
appeared were the ones that happened to *also* be their type's strongest STAB (Brave
Bird, First Impression, 40/40). Four of the five moves §5 makes **unconditional** —
the ones that answer "a faster foe that would knock me out first" — were unreachable.

Reported from a real battle log: a lead Kingambit died to a faster Ho-Oh without
acting, and the obvious suspicion was the AI's resolve rule. It was not — the AI picks
Sucker Punch at every tier in that exact position (score 123 with `movesFirst=YES`
versus −45 for the bigger Kowtow Cleave). **The set simply never had the move.** Check
what the Pokémon was actually carrying before suspecting the chooser.

Three things the fix had to get right, each of which a naive version breaks:

- **A priority attack gets its own slot, not a power bonus.** Inflating `movePower`
  would make Sucker Punch *replace* Kowtow Cleave as the main Dark STAB, which is
  worse than not having it — the set wants both. The slot bypasses the type dedupe on
  purpose.
- **Grassy Glide's priority is applied by the engine, not the data.** The packaged
  move reads priority 0 (§5), so a filter on `move.priority` silently misses it;
  `ENGINE_PRIORITY` names it.
- **Power floors need a Technician exception, and some priority moves are not
  attacks.** A 55 floor correctly excludes Quick Attack but also excluded Bullet Punch
  (40) — premium on a Technician Scizor at an effective 60. And Feint (50) outranked
  Bullet Punch on raw power while being a move whose only merit is breaking Protect;
  Fake Out keeps its first-turn restriction so it gives no "always resolves"
  guarantee. Both are excluded by name.

**A themed pool six entries deep can be one Pokémon, because formes are not
species** (fixed 2026-08-14, reported from a real battle: a Skier fielded **two
Arceus-Ice**).

Two halves, and the second is the one that made it visible:

- `campaignPool` decides a themed pool is usable when `themed.length >= 6` —
  and that counts **formes**. Arceus has 18 and Silvally 18, so the check can
  pass on a pool with almost no variety. The **Ice band 600-780 holds exactly
  six formes and four base species** (Arceus-Ice, Kyurem, Kyurem-Black,
  Kyurem-White, Calyrex-Ice, Baxcalibur).
- `buildOpponentTeam` dedupes by base species in its main loop and then had a
  fallback loop **with no check at all**, which fires exactly when the pool
  cannot fill the team. So it placed four and cloned the fifth.

It now tops up from the *unthemed* band instead of repeating: losing the theme
on a last slot is far cheaper than a clone. **Nothing downstream was ever going
to catch this** — Campaign runs `speciesClause: false` on purpose, so the
*player* can keep two of something in a roguelite, and that same rule lets the
opposition do it.

**The run shape decides whether you ever see it**, which is why it went
unnoticed: at the default three Acts the band never sits on that window. A
seven-Act run at the default Beacon count puts it exactly there. Measured with
the old fallback restored: **120 of 240** themed teams cloned a species; with
the fix, 0 of 240, and none came up short. `buildRebirthTeam` had the same
duplicate-tolerant fallback and was fixed with it.

**A band fallback that drops to the whole pool drops to the *bottom* of it.**
Recruit offers filter the tier-gated pool to a BST band and fell back to the
entire pool when fewer than `count` candidates matched. That fallback fires on
**long runs**, not late Acts: `powerBand` adds a `challengeLevel` lift of 28 per
step and a run's own length is worth steps, so an eight-Act run is +5 — **+140
BST**. Past the middle of such a run the band floor climbs past 620 while
legendaries are still gated until 82% progress, almost nothing qualifies, and the
fallback handed over the whole non-legendary pool. Measured: a 472-BST Furfrou
offered at 74% of an eight-Act run, immediately after 600-BST offers. Reported as
"after Act 3 recruitment gives random low tier Pokémon" — it is a run-length bug,
not an Act-number one, and three- and five-Act runs were **byte-identical** before
and after the fix because their bands were always satisfiable. The fallback now
takes the candidates *closest in power* to the band. Any future band-and-fallback
pair needs the same treatment: check what happens when the band is unsatisfiable,
and prefer nearest over arbitrary.

**"Keep the best of N" harvests luck, and it scales with N rather than with
quality.** Taking a maximum over noisy measurements is biased upward by roughly
`0.56σ` for two, `0.85σ` for three. In the measurement this was found in, `σ` was
7.8 points, so that is
+4.4 and +6.6 — one to two tiers — applied *only* to the species that have more than
one configuration, which is exactly the Mega and forme-item species. Demonstrated
rather than derived: one fixed Mega Manectric configuration measured six times scored
2.5, 10.0, 5.0, 20.0, 12.5 and 2.5, so best-of-six beat its own honest mean by 11.2
points. **The v2 notes recommended "score each species from several generated sets and
keep the best" as the next improvement; it would have made the ranking worse.** The
fixes are to *average* repeated measurements of the same thing, and — where a genuine
choice between alternatives is wanted — to choose on one set of seeds and score on
another, so the published number is never the number that won the argument. Any
"take the best" over measured values needs this treatment.

**A ranking with no error bar is the "0 findings" sweep of §11 in another costume.**
Two successive versions of the (since removed) tier list reported a score *spread*
and never a score *error*,
and both shipped a headline conclusion that was really a draw — v2's famous
"Alomomola is still ZU" was one noisy draw of the opposing teams, and it re-measures
near zero. A spread of 80 points means nothing until you know whether a re-run moves a
Pokémon by 2 points or by 20. Measure test-retest before believing a ranking, and
before concluding that the *method* is wrong: two sessions were spent redesigning the
battle format to fix what was actually sampling error.

**A species whose forme comes from a held item is a different Pokémon without it.**
`RandomTeams.randomSet` picked items by role, so an Arceus-Water got Leftovers — and
Multitype reads the held Plate, so it entered battle as plain Normal-type Arceus while
keeping the Water moveset chosen for it. All 17 Arceus and all 17 Silvally formes, and
nothing caught it: the set was legal, the battle threw nothing, and the Pokédex was
right. `pickItem` now returns the Plate or Memory before any role logic, read from the
item data (`onPlate` / `onMemory`) rather than hardcoded, skipping Z-crystals — which
carry `onPlate` too and would fix the typing while spending the item slot on a Z-move
this project does not simulate. A test in `tests/teams.js` asserts every forme keeps
its typing **through a real battle start**, not by reading the item back, because the
entry hook was the broken part. Confirmed to fail on purpose. Contrast the Mega Stones
and `FORME_CHANGE_ITEMS` (§5), which were already handled — the ability-driven formes
were the gap.

**A Red Card crashed a rampage, and the order of arrival is why it survived**
(fixed 2026-08-14, found by a Rebirth balance probe on seed 2377 — not by a
test). `finishLockedMove` decremented `volatiles.lockedMove.remaining` whenever
`fromLocked` was true, but anything that switches the user out *during its own
move* runs `clearOnSwitch`, which wipes every volatile including that lock. The
throw blanked the whole run.

**The reproduction is the lesson.** The obvious two-Pokémon setup — rampage user
versus a Red Card holder — does *not* reproduce it: the card fires on the turn
the lock is created, when `fromLocked` is still false. It needs the holder to
arrive **after** the rampage has started. The real sequence was a Tauros locked
into Outrage knocking out a Nidoking (no card, that holder was gone), the
replacement Shuckle arriving with one, and the next Outrage triggering it. Two
hand-built reproductions failed before the engine was instrumented to print the
log tail at the moment the lock vanished, which named the cause in one run —
guessing at the shape cost more time than measuring it.

The fix is a `return`: being dragged off the field ends a rampage, and ends it
without fatigue confusion, which is the rule the failure path above already
applied. `tools/balance-probe.js` now prints a stack for each failed run under
`REDGPT_PROBE_STACK=1`, because "seed 2377: Cannot read properties of undefined"
is not enough to find anything.

**`itemUser` names the forme an item is *for*, which is often not the Pokémon
that should hold it** (fixed 2026-08-16). The validator warned *"Rusted Sword
only does something for Zacian-Crowned"* on a Zacian holding a Rusted Sword —
the one supported route to Zacian-Crowned — printing it directly above a Team
Builder card reading *"Enters battle as Zacian-Crowned"*. The note and the card
cannot both be right.

Measured rather than guessed: of the twelve forme-item/holder pairs, **eight**
name the target rather than the holder (Rusted Sword, Rusted Shield, Griseous
Core, Adamant Crystal, Lustrous Globe and the three Ogerpon Masks), while the
Red Orb, Blue Orb, Griseous Orb and Hero Charm name the holder and were fine.
**All 96 Mega Stone pairs name the holder**, which is why this went unnoticed —
the common case is correct.

Fixed once, not per item: the warning is skipped when
`Mechanics.heldForme(set)` resolves, which is **the same function the Team
Builder card draws from**, so the two cannot disagree again. Found by looking at
the screen, not by a test — five species had been warned at wrongly for some
time. Carries controls in both directions, because the obvious over-fix is to
delete the warning, which also "fixes" all eight.

**Line endings are per-file, not project-wide — check before writing a scripted
anchor** (refined 2026-08-14, re-measured 2026-08-16). Every file is internally
uniform, but they do not agree with each other. **Measured at byte level**:
`battle.js`, `ai.js`, `campaign/run.js`, `campaign/content.js`, `mechanics.js`,
`abilities.js`, `items.js`, `formats.js`, `tools/coverage-controls.js`,
`tests/campaign.js` and **`tests/engine-battle.js`** are **LF**, while
`ui/campaign-ui.js`, `ui/battle-ui.js`, **`tests/data-validation.js`** and
**`tools/generate-data.js`** are **CRLF**. A two-line anchor written with
`\r\n` matched zero times in `battle.js`, which is the same silent
failure the note below describes with the endings reversed. **The reliable fix is
to use single-line anchors and assert the match count**, which works whatever the
file uses.

**Neither grep direction is a safe check, and both have now failed here.**
`grep -c $'\r' file` reported every line as CRLF for a file that is entirely LF;
and `head -c 200000 file | grep -q $'\r'` reported four CRLF files as LF in the
same session. Count the bytes instead — walk the buffer and test whether each
`\n` is preceded by `\r`:

```bash
node -e "const b=require('fs').readFileSync(process.argv[1]);let c=0,l=0;for(let i=0;i<b.length;i++)if(b[i]===10){b[i-1]===13?c++:l++}console.log(c?'CRLF':'LF',c,l)" path/to/file
```

**A multi-line scripted patch silently matches nothing when it guesses the
endings wrong.** Scripted edits that search for `'line one
      line two'` fail
against every multi-line anchor here — quietly, returning the file unchanged. It
is harmless when the edit is the point (you notice the missing change) and
dangerous when the edit is a *control*: a control that removes nothing leaves the
test passing, which reads as "the test cannot detect this bug" when it really
means "the control never ran". That happened while pinning the lead-cry fix, and
again on 2026-08-14 with two of Rebirth Mode's fourteen controls, which reported
`SKIPPED — anchor matched 0x` only because the harness asserts its own match
count. Verify a scripted patch actually changed the file before drawing a
conclusion from it.

**Two of Rebirth Mode's tests passed with the fix deleted, and the sample size
was the reason both times.** Neither was a badly-written assertion; both were
measuring a rate too rare for the sample.

- *"A Rebirth team can always put its own doctrine back up"* sampled 40 random
  opponents. A random sample is dominated by the plans that are easy to satisfy,
  and the failing one was rare — 13 of 30 **Sticky Web** teams shipped without a
  Sticky Web while every other plan was fine. Fixed by building every plan
  explicitly, six teams each, instead of sampling.
- *"No Rebirth team carries the means to delete its own doctrine"* checks a ~6%
  rate among weather/terrain teams and was looking at ~15 of them, so a build
  with the fix removed passed comfortably. Fixed by building 100 such teams —
  at 6%, that leaves a 0.2% chance of a false pass.

The general rule, which is §11's in another costume: **a test that asserts "this
never happens" has to be sized against how often it would happen if broken.**
Both were caught by running the control, not by reading the test.

**A margin in an assertion should be measured, not guessed.** The themed-recruit
test asserts a themed offer fits the plan better than an unthemed one, which is a
noisy comparison — three candidates drawn without a theme are quite often a
better fit by luck. The first version asserted a single pair and passed with the
bias deleted. The margin is now set from a measurement of both distributions
across 12 seeds (24 pairs: real lift min 14.3, null lift max 5.6, so the margin
is 8) and the table is written into the test, so the next person to touch it can
see where the number came from.

**A difficulty dial clamped from the wrong side does nothing.**
`bossTeamPenalty` was subtracted *inside* the clamp —
`clamp(party + actBonus - penalty, 3, ceiling)` — so the per-Act ceiling bound
first and the penalty was **completely inert for any party of five or more**:
`clamp(6+1-1, 3, 5)` and `clamp(6+1-0, 3, 5)` are both 5. Normal's advertised
"bosses field one fewer Pokémon" therefore stopped applying exactly when the
player had finished building a team, i.e. at the hardest bosses in the run. The
penalty is now applied *after* the ceiling. This is the same family as the
declared-but-unread flags above: the dial existed, was read, and still changed
nothing. **Check a tuning dial by printing its effect across the real input
range, not by confirming something reads it.**

**The probe's policy is part of the measurement, and it was understating the
game badly.** Three separate deficiencies, each worth real points on Normal:

- It answered **every** move-learn prompt with `skip`. `addLevels` only prompts
  when a moveset is already full, so the party fought the Act 3 boss with the
  moves it had at level 16. Worth ~7 points of clear rate on Normal.
- It never took a tutor move either — the two-stage tutor prompt named a member
  in stage one and then skipped in stage two.
- After a loss the team is **fully healed**, and `pickNode` scores an Elite `+5`
  when healthy — so the run re-attacked the fight that had just killed it and
  fed it every remaining Beacon. Worth ~4 more points.

Fixing all three moved Normal from 11% to 22% **with no engine change at all**.
Before concluding the game is too hard, check that the policy is playing it
properly; a probe deficiency otherwise gets "fixed" by nerfing the game. The
`basic` argument still selects the old *policy*, so the two can be compared on
identical seeds — but it cannot reproduce the pre-2026-08-12 *numbers*, because
the difficulty dials moved too. Comparing policies is only meaningful within one
build.

**Difficulty defaults are duplicated in the run-setup form.** `#runBeacons` had
`value="3"` hardcoded, which merely *happened* to equal Normal's default. The
click handler syncs the field when a difficulty button is pressed, but the
initial render does not, so changing `DIFFICULTIES[].beacons` silently started
Normal runs with the wrong Beacon count. It now interpolates
`Content.difficulty('normal').beacons`. Any new per-difficulty default shown in
that form needs the same treatment.

A test for this was written and then **deleted**, which is worth recording. It
asserted "the Beacon field equals Normal's configured Beacons" — and once the
field is *derived* from that same value, the assertion is tautological. Proved it
by setting Normal to 5 Beacons and re-running: the test still passed, because the
form moved with the data. Interpolating from the data makes the bug structurally
impossible, which is strictly better than a check that cannot fail; a passing
tautology is worse than nothing because it reads as coverage. If that field is
ever hardcoded again, the guard has to compare against a *literal* expectation.

---

## 9. Known gaps and deliberate non-goals

- ~~13 abilities and 13 items are unsimulated. Mostly Gen-2 legacy berries and
  niche abilities.~~ **Closed 2026-08-14 — and this entry was the decision being
  reversed, not a bug report.** All 26 are implemented; `Abilities.coverage()`
  and `Items.coverage()` both return an empty `missing` list. See §5 for the
  redesigns the doubles-only abilities needed and the Delta Stream / primal
  weather ruling. The lists are still generated, so **check
  `Abilities.coverage().missing` rather than trusting any list written down** —
  a rebuild that adds a new upstream ability will put it there.
- Propeller Tail and Stalwart are listed as inert by design rather than
  implemented: they ignore move redirection, which only exists in doubles. Same
  reasoning as Friend Guard, Battery, Plus and Minus. Wide Guard is tracked but
  blocks nothing for the same reason. **This is the line that separates them
  from Curious Medicine, Hospitality and Pickup**, which were doubles-only too
  and *were* redesigned (§5): redirection has no singles analogue at all, while
  "reset an ally's stats" and "heal an ally" both point at something a singles
  battle really has. A future doubles-only ability should be tested against that
  question rather than filed automatically in either bucket.
- Every field effect and hazard the engine can produce renders a chip with an
  inline-SVG glyph (`FIELD_ICONS` in `src/ui/battle-ui.js`, drawn with
  `currentColor` so each inherits its chip's colour). There is no hazard artwork
  in `Assets/`, and none is needed. `tests/ui-smoke.js` fails if a new effect
  ships without a glyph.
- Battle visuals are entirely CSS — turn playback (lunge, hit, faint, switch,
  boost/drop, heal) plus animated weather and terrain layers over the field
  (`wx-<weather>`, `tr-<terrain>`). Movement classes go on `.mon-wrap`, not the
  `<img>`. There is deliberately **no** per-status sprite effect: a masked
  silhouette was tried and removed because it read as a coloured box rather than
  the Pokémon. Status is shown by the pill on the mon card instead.
- No doubles, breeding, trading or network play. The command/event architecture
  is designed so networked play could be added without a rewrite.
- Campaign clear rate is measured only with an automated policy; real-player
  balance is unverified.
- ~~There is no way to force a Pokémon to eat a Berry it is not holding.~~
  **Closed 2026-08-13** — see the force-eat path in §5. Bug Bite, Pluck, Stuff
  Cheeks, Tea Time and the flung-Berry half of Fling all work now.
- **The three authored Act 3 bosses never appear in a default run.**
  `FINAL_BOSS.act` is 4 and `startBoss` treats the *last* Act as the Champion, so
  in a standard three-Act run Act 3 resolves to `championsyn` and
  `hazardlock` / `sunburst` / `setupwarden` are unreachable — a third of the
  authored boss roster is dead content at the default run length. They are only
  reached at 4+ Acts. **Still open after 2026-08-14**, and now slightly worse
  value left on the table: those three carry `teamPlan` rows (`stall`, `sun`,
  `screens`) whose Rebirth doctrines nobody at the default run length will meet. A default run therefore has **three** mandatory boss
  fights (Act 1, Act 2, Champion), which is the number the Beacon economy has to
  pay for. Not yet decided whether the fix is to route the last Act through the
  Act-3 roster and add a separate Champion node, or to accept them as
  long-run-only content.
- ~~Oricorio-Pa'u is missing from the packaged data.~~ **Fixed 2026-08-14.**
  Kept because the cause generalises. The base half of a sprite key has always
  used `compactKey` (punctuation deleted) but the **forme** half used
  `spriteKey` (punctuation turned into a *space*), so `Pa'u` asked for
  `ORICORIO PA U` while the file indexes as `ORICORIO PAU` — and the species was
  dropped for "no sprite pair" with both sprites sitting on disk. `Pom-Pom` hit
  the identical wall and had been patched by hand in `FORME_SPRITE_ALIASES`,
  which is the tell: a second hand-written alias for the same shape means the
  rule is wrong, not the datum. `spriteCandidates` now also tries the compact
  forme spelling, added last so the aliases still win first.

  **Measured before changing it**, across all 1,416 upstream species: 147 fail
  the current keys, and exactly **one** — Oricorio-Pa'u — has artwork a compact
  key would find. The other 146 are genuinely missing artwork (Gmax, Totem, the
  Pikachu costumes). Zero key collisions. Farfetch'd, Sirfetch'd, Ho-Oh and
  Type: Null were never at risk, because base names already used `compactKey`.
  Species 1268 → 1269; the rebuild diff was that entry, the timestamp and the
  count, with no upstream drift. A test case in `tests/engine-battle.js` asserts
  `Dex.hasSpecies("Oricorio-Pa'u")`, so a rebuild that loses it fails.
- `docs/ASSET_REPORT.md` is an asset inventory carried over from v1.x. It is
  still factually an inventory, but it was not regenerated in the redesign.
- The Campaign map's edge rendering measures laid-out DOM. If the map layout
  changes, re-check `drawMapEdges` in `src/ui/campaign-ui.js`.

---

## 10. Change log and open work

Durable decisions live in §5, traps in §8, auditing method in §11 — those are the
sections to read. This is the short history plus, more importantly, **what is
still outstanding**.

### Still open — start here

0. **Tiers are Smogon's, imported — the measured tier list is gone.** By project
   decision the whole measurement apparatus was deleted (tool, calibrator,
   comparison, `data/tiers.json`, `docs/TIER_LIST.md`) and replaced with a direct
   import of Smogon's **National Dex** tiers, generated into `species.tier` by
   `tools/generate-data.js`. See §5 for the rules that make it work.

   **What is worth carrying forward from the measured era**, because each cost
   real time to learn, is recorded in §8 rather than here:

   - a ranking must report its own error, or it will ship conclusions that are
     really ties — two versions did exactly that;
   - "keep the best of N" harvests luck rather than quality, and biases upward
     with N, so it silently inflates whichever species have the most variants;
   - the measurement is only ever as good as the sets the generator builds, which
     is how the Arceus/Silvally forme-item bug was found.

1. ~~Revelation Dance ignores its user's type.~~ **Closed 2026-08-14** — and it
   was five moves, not one. See §5 (use-time move typing) and the change log.

2. ~~The Tacticians and Paragons unlocks are unreachable.~~ **Closed
   2026-08-14** — `automated` is now passed from `campaign-ui.js`, pinned by a
   jsdom test with controls in both directions.

1. ~~**Rebirth Mode — specified, not built.**~~ **Built 2026-08-14.** See §5 for
   the durable decisions, §6 for the measured balance and the change log below
   for what shipped. The original specification is kept here because the
   *reasoning* in it is still the design:

   - **Carried over:** the finished run's party (their sets, moves, held items)
     and its relics. **Reset:** team level, Act, map, credits, Beacons, bag.
   - **Every opponent is fully realised.** Trainers, Elites and bosses all get
     complete six-Pokémon teams with a declared strategy, and **every AI tier is
     Expert** regardless of difficulty.
   - **Themed opposition.** Reuse `CampaignContent.TEAM_PLANS` — the eight plans
     already carry enablers, payoff and item preferences, and `AI.themeLead`
     already leads a themed team with its setter. A Rebirth trainer should
     declare a plan and be *built* from it, which is the missing half.
   - **One special ability per opponent team**, expressed as a battle-start
     field effect the plan implies: a Sun team opens with **permanent** sun, a
     Trick Room team with permanent Trick Room, screens pre-set, hazards
     pre-laid. "Permanent" must mean *no turn counter*, not a large one — the
     mechanism already exists as `field.weatherPrimal` (PROJECT_CONTEXT §5),
     which is exactly this: a weather with `weatherTurns = 0` that ordinary
     weather cannot replace. **It must stay removable**, per the request: a
     different weather setter switching in, or Cloud Nine / Air Lock, should
     still beat it — so it wants primal weather's *persistence* without primal
     weather's *lock*, i.e. a third state rather than a reuse of `weatherPrimal`.
   - **Better rewards**, and **recruits gain a theme selection option** — offer
     the player a plan and draw candidates that fit it, which `partySynergyItems`
     and `Advisor.recruitScore` already have the vocabulary for.

   Two traps to respect while building it. **Anything that decides what is
   *offered* must not read `run.assist.plan`** (§5) — a Rebirth run needs its own
   plan field, separate from the advisory one, or switching Assist plans
   desynchronises a seeded run. And **re-measure**: this changes every opponent
   in the mode, so the §6 table says nothing about Rebirth until it is measured
   separately.

   **Where it hooks in**, from reading the code on 2026-08-14 — this is the
   scouting a fresh session would otherwise repeat:

   - `createRun({seed, difficulty, ascension, trainerName, unlocks, beacons,
     acts})` builds the whole run object and ends by generating the map and
     calling `syncRng`. A `createRebirthRun(profile, finishedRun)` most likely
     wraps it and then overwrites `party`, `relics` and a new `rebirth: true`
     flag, rather than forking the constructor — `teamLevel` already starts at
     `STARTING_LEVEL`, and `bag` / `credits` / `beacons` / `map` already reset,
     so the carry-over is the short list, not the reset.
   - **Every opposing team funnels through one function**:
     `buildBattleConfig(run, {kind, theme, size, levelOffset, opponent, boss,
     background, reward, title, sets})`. It picks `enemySets` from
     `buildBossTeam` or `buildOpponentTeam`, and the AI tier from
     `aiTierFor(run, kind)`. That is the single choke point for "fully realised
     teams at Expert" — a `run.rebirth` branch there covers trainers, Elites and
     bosses at once, and the existing `sets` parameter already proves a caller
     can hand the team over outright.
   - `pickTrainerArchetype(run, kind, theme)` already carries a `theme` through
     `TRAINER_ARCHETYPES`, so themed opposition has a place to attach rather
     than needing a parallel system.
   - The per-battle `config` is stored on the run and re-read on load (§6), so
     any new field on it must survive `JSON` round-tripping — no functions.

   **All of that scouting held up**, which is worth recording as evidence the
   note was worth writing: `createRebirthRun` does wrap `createRun`,
   `buildBattleConfig` did cover Trainers, Elites and bosses in one branch, and
   `pickTrainerArchetype`'s `theme` parameter was where themed opposition
   attached. What the scouting did **not** anticipate, and what most of the work
   turned out to be:

   - the power band and the Act-1 level ramp are both functions of Act/progress,
     so a mode that resets the Act inherits the *opening* difficulty curve;
   - a themed team drafted by a plan-blind generator can carry the means to
     delete its own field, which needed declarative flags on the abilities;
   - Trick Room had no counterplay at all in this engine, so "permanent Trick
     Room" was unbeatable until re-use was made to cancel it;
   - and Rebirth as first built was unclearable (0 of 5), which took one
     measured difficulty dial to fix.

2. **Confirm the audit's residual findings.** The sweeps can now fail (§11), and
   what they report is a *shortlist to check by hand*, not a bug list. Currently
   **59 of 281** abilities and 18 of 199 items are "not proven by any scenario",
   plus 6 abilities that changed only the log. Three of those 59 —
   **Pickup, Pickpocket and Magician** — are known-good: all three were rewritten
   on 2026-08-13 and verified by dedicated harnesses, and the sweep's scenarios
   simply never set up what they need (an item destroyed earlier in the battle, or a
   thief that is already holding something). They are scenario gaps in exactly the
   sense this list keeps turning out to be. Every spot-check so far turned out to
   be a scenario gap rather than a bug — Water Absorb, Air Lock, Shadow Tag and
   Shell Bell were each flagged, each verified working by hand, and the scenario
   widened. Work down the list the same way: verify first, then either fix the
   engine or widen the scenario. Named gaps already known: Magnet Pull is tested
   against a non-Steel foe so it cannot trap; Serene Grace is masked because the
   sweep pins every chance roll to true, which makes doubling a secondary
   invisible.

2. **Campaign clear rates were re-measured and retuned on 2026-08-12.** The
   numbers, the method and the per-battle breakdown are in §6 — read them there
   rather than duplicating them here. What is left over:

   - **Master lands at 10% against an 8% target, and the dials cannot close the
     gap.** It measured 4% at `enemyLevelOffset: -1` and 13% at `-2` before the
     generator changes, 10% after; the healing
     and revive fractions are provably inert on clear rate, and the one dial with
     enough force (`bossTeamPenalty`) is binary — turning it off drops Master to
     1%. Closing this properly needs a *finer* lever than any that exists, e.g. a
     per-difficulty boss level offset, or a fractional `challengeFactor` applied
     to boss teams only. Worth adding before the next difficulty tuning.
   - The retune assumes the **automated policy** is a fair stand-in for a
     competent human. It is a floor: the probe never builds a team on purpose,
     never plans a type matchup, and takes rewards by a fixed priority table.
     Real-player rates are still unverified (§9) — the most valuable next
     measurement is a human playing a few seeded runs at each difficulty and
     comparing.
   - `bossTeamPenalty` is **1 on all three difficulties**, so it no longer
     separates them. Setting Master's to 0 was tried and reverted: it is far too
     strong a step (13% → 1%). Master's identity is instead that *every* AI tier
     is Expert, which costs almost nothing in clear rate (12% → 13% when measured) but is what
     its description promises.

3. **AI: read `docs/AI_DESIGN.md` first — it is now the AI's own handbook.** It
   records where decisions are actually made, the rule that **every in-battle AI
   improvement must reach every consumer including Assist Mode** (auto-battle
   calls `AI.chooseAction` directly, so it does automatically), the one deliberate
   divergence (`Advisor.recommendLead` is restricted to player-visible information
   because two relics are *sold* on revealing opponent details), and the rules for
   changing any of it.

   **Switch discipline, added 2026-08-13.** A switch-in must still be standing
   when its own turn arrives — the free hit on the way in *and* the second hit a
   slower Pokémon eats before acting, measured against `effectiveHP`. At the
   predicting tiers this is a gate, not a price. Doomed switches went **30.4% →
   0%** of all switches and switching itself fell 5.0% → 3.6% of decisions; the
   ladder gained **+8 (Ace vs Casual, 65 → 73)**, **+6 (Expert vs Casual)** and
   **+5 (Expert vs Trainer)**, with Trainer vs Casual byte-identical as a control
   because those tiers lack `predicts`, and Expert vs Ace flat because both got
   the same upgrade.
   Replacements now prefer a revenge killer (taken 82.7% of the times one
   existed) and avoid sending a Pokémon that never gets to act (15.1% → 5.2%).
   `tools/ai-switch-sweep.js` measures all of this and reports its own
   denominators.

   **The old awareness work, still true.** The AI reads items, abilities,
   hazards, pivots, turn order, field effects, team archetype, whether a move
   will resolve at all, real accuracy, sacking, setup payoff and Tera timing
   (§5). What it still does *not* do is predict: it never asks what the opponent
   will switch to, and never looks past the current turn. Opponent switch
   prediction and multi-turn lookahead are the next real gain.

   **Measure with the mirrored method** — play each pairing from *both sides* on
   the same teams and seeds. Single-sided sampling carries an uncorrected
   side-0/side-1 bias that produced swings of ~18 points between runs and made
   tuning look effective when it was noise.

   `node tools/ai-ladder.js [pairs] [format]` does this (added 2026-08-13). Before
   that the numbers here had been measured by hand and could not be re-run — which
   became a problem the moment a `random-teams.js` change altered the teams they were
   measured on. Current, 60 mirrored pairs (120 battles) a pairing:

   | | vs Casual | vs Trainer | vs Ace |
   | --- | --- | --- | --- |
   | Trainer | 57% | | |
   | Ace | 66% | 62% | |
   | Expert | 79% | 66% | 57% |

   Ordering is monotonic — every stronger tier beats every weaker one, which the tool
   checks and prints. Expert and Ace are deliberately close (they differ only in
   mistake rates), so ~57% is the design, not a defect. These replace the earlier
   hand-measured 56 / 64 / 61 / 73; the differences are mostly within the ±4-5 points
   that 120 battles buys, and the teams are not the same ones any more.

   **Re-measured 2026-08-14 after the room-cancel change** — 66 / 79 / 78 / 59 /
   71 / 64 in the same order, ordering still monotonic. Do not read the movement
   as an effect of that change: **0 of 400** random-format teams carry a room at
   all, so the decision is never reached in this format and the ladder cannot
   see it (`docs/AI_DESIGN.md` §8 measures it with built positions instead).
   The tool *is* reproducible run to run — two consecutive runs were
   byte-identical — so the differences between the tables here and in AI_DESIGN
   §7 are between builds, not run-to-run noise on one.

   ~~Boss teams could declare a `TEAM_PLAN`.~~ **Closed 2026-08-14** — every boss
   now carries `teamPlan` alongside its prose `plan` (§5). It decides the boss's
   Rebirth doctrine and the Ascension filler member's draft. The deeper use — a
   boss's *authored* six being generated from its plan rather than hand-written —
   is deliberately not done: those teams are content, and the point of authoring
   them is that a person chose the six.

4. **The Calculator does not model hazards** or multi-turn field decay in its KO
   summary — residuals are covered, entry hazards are not.

4b. **Damage is 0-2 HP off Smogon's calculator, and the cause is known.**
   Diagnosed 2026-08-14 after a report; **left unfixed by decision**, and
   recorded here so nobody re-investigates it.

   The *inputs* are right — with identical sets our stats match Showdown
   exactly (Blissey 652 HP / 130 Def, Garchomp 359 Atk at 31 IVs), and
   `tests/arena.js` pins that. The gap is the rounding chain in
   `battle.calculateDamage`, which is a single expression with a single floor:

   ```js
   Math.floor((((2 * level / 5 + 2) * power * atk / def) / 50 + 2) * modifier)
   ```

   The official formula floors at three intermediate points and then applies
   each modifier with round-half-**down**. Worked through for
   Choice Band Garchomp Earthquake vs 4 HP / 252+ Def Blissey:

   | | result |
   | --- | --- |
   | ours | `floor(((42×100×538/130)/50 + 2) × 1.5)` = `floor(524.45)` = **524** |
   | official | `pokeRound((floor(floor(42×100×538/130)/50) + 2) × 1.5)` = `pokeRound(523.5)` = **523** |

   Across the 16 rolls the difference is 0, 1 or 2 HP (≤0.5%): 445-524 against
   Showdown's 444-523. This case lands exactly on a half, which is the worst
   case for the rounding mode.

   **This is not a deliberate divergence** like `MOVE_OVERRIDES` or
   `LEGACY_BASE_STATS` — there is no design reason for it. Two fix sizes:
   intermediate floors plus round-half-down (gets the common cases exact), or
   Showdown's full 4096 fixed-point modifier chain in its exact order (exact
   always, much larger rewrite). **Either changes every damage number in the
   game**, so it needs a Campaign balance re-measure and a ladder run, which is
   why it was not done at the end of a long session.

4c. ~~**26 abilities and items are flagged "not simulated" and want
   implementing.**~~ **Closed 2026-08-14.** All 26 are implemented and both
   `missing` lists are empty; the durable decisions are in §5 and the reversal is
   recorded in §9. Three things from doing it that are worth carrying forward:

   - **The scoping question the item asked was the right one.** Seven of the
     thirteen abilities returned *no holder* when checked against
     `Dex.allSpecies` — because that array is the 1,178 **selectable** species
     and every Z-A ability lives on a `transformOnly` Mega forme. The full set is
     `Dex.packagedSpecies` (1,269). An ability audit run against the wrong one
     concludes half the roster is unreachable.
   - **Reading the packaged data beat knowing the games.** `Eelevate` is
     Levitate plus Beast Boost, not a Normal-to-Electric `-ate` ability; the name
     says otherwise and a guess would have shipped the wrong mechanic.
   - **`tools/coverage-controls.js`** is the control harness for the 21 new
     tests — 30 controls, each breaking one implementation and asserting the
     matching test goes red. It declares a required match count per anchor, so a
     patch that silently matches nothing reports `SKIPPED` instead of passing.

   The original list, kept because the traps in it generalise:

   - **Abilities (13):** Curious Medicine, Delta Stream, Dragonize, Eelevate,
     Fire Mane, Hospitality, Lingering Aroma, Mega Sol, Piercing Drill, Poison
     Puppeteer, Spicy Spray, Supersweet Syrup, Teraform Zero.
   - **Items (13):** Berry, Berserk Gene, Bitter Berry, Burnt Berry, Gold Berry,
     Ice Berry, Mint Berry, Miracle Berry, Mystery Berry, Pink Bow, Polkadot
     Bow, PRZ Cure Berry, PSN Cure Berry.

   **Delta Stream's extra requirement was delivered, and the interaction it
   flagged was decided in Delta Stream's favour** — it removes primal weather,
   Cloud Nine and Air Lock still cannot, and §5 records the rule that separates
   them. **Supersweet Syrup is not a Z-A ability** (it is Dipplin's, from the
   Scarlet/Violet DLC); the six that are appear on Mega formes. The Gen-2 items
   were implemented as themselves rather than as aliases of their modern
   equivalents, so the scope did cover all 26.

5. **`iceball` is handled by `dynamicBasePower` but missing from
   `Mechanics.DYNAMIC_POWER_MOVES`.** Harmless today — the damage path calls
   `dynamicBasePower` unconditionally, so the table only feeds the AI and the
   move-request display — but the table claims to enumerate the use-time power
   moves and does not. Add it, and check nothing else is in the same position.

6. ~~Visual work is unverified by the agent, by construction.~~ **Largely closed
   2026-08-14 — the preview pane screenshots fine now** (§8), which reverses the
   constraint this item was built on. Verified by eye that session: the Heal All
   button (and that it is correctly absent when nobody is injured), the cries
   toggle and volume slider, the move hover cards, the tutor sort/filter/search
   controls, the starter-pool toggles, the run-setup modal, the Act map and the
   party panel. One defect found, and **fixed** the same day: the Cry Volume
   slider stayed enabled when Pokémon cries were off, so it was a live control
   with no effect — and its own confirmation cry is silenced too, so dragging it
   gave no feedback at all. It now renders `disabled` with an `is-disabled`
   class on its label (`styles.css`, matching `button:disabled`), and the cries
   checkbox toggles both **live** rather than by re-rendering — a re-render
   would drop focus off the checkbox the player just pressed.

   Still genuinely unverified: anything above ~780px wide (the pane's viewport)
   and the battle screen's stat panel under real animation. For a legible
   desktop shot, launch the real app.

### Ban the route, not the Pokémon — the ability half (2026-08-16)

**A forme reached by an *ability* is now tiered like one reached by an item: the
ability is refused, and the Pokémon keeps its own tier.** This is the missing
half of the Absol/Absolite rule, and it closes the §10 open item that blocked
two tier drops.

**Reported as: Ash-Greninja is not counted in the formats.** It was not. It is
`transformOnly`, so `tierRoster`'s species branch skips it, and **no item
produces it**, so the forme branch missed it too — Ash-Greninja belonged to no
tier at all, and neither did Zygarde-Complete by the Zygarde-10% route. Every
roster, count and tiering pass has been blind to them.

**The rule, and its one hard condition:**

> An ability-produced forme is tiered separately **only when the base has
> another usable ability.** Otherwise banning the ability does not restrict the
> Pokémon, it deletes it — nothing can be built with no legal ability.

That splits the fifteen ability-forme routes cleanly:

- **Separable (5 bases):** Greninja (Battle Bond, keeps Torrent and Protean),
  Zygarde and Zygarde-10% (Power Construct, keep Aura Break), Darmanitan and
  Darmanitan-Galar (Zen Mode, keep Sheer Force / Gorilla Tactics).
- **Inseparable (8):** Aegislash, Wishiwashi, Castform, Cherrim, Morpeko,
  Terapagos, Mimikyu, Eiscue — all single-ability, all tiered as one unit,
  which is what their species tier already does.

**The live effect today is Zygarde-10%**, and it is exactly the case §10 said
was blocking progress: it is RU, Power Construct turns it into Ubers-ranked
Zygarde-Complete, so Power Construct is now refused in OU, UU and RU while
Zygarde-10% stays legal there on Aura Break. *"Power Construct is banned in
RarelyUsed — it turns Zygarde-10% into Zygarde-Complete, which is Ubers.
Zygarde-10% itself is legal here with another ability."*

**`Formats.formeAbilities` is computed live, not packaged**, and that is the one
real design decision here. A forme *item*'s tier can be an estimate the
generator has to compute, so it must be baked into the data; an ability forme is
an ordinary packaged species whose tier is already sitting there. Deriving it at
call time means **no third copy of the from → to table** — `ABILITY_FORMES` in
`mechanics.js` stays the single source. `formats.js` loads *before*
`mechanics.js` (§4), so it is read inside the function rather than at module
scope.

Enforced in three places, because one is not enough: the validator refuses the
set, `autoFix` swaps the ability rather than removing the Pokémon, and
`RandomTeams.pickAbility` drops it from the pool so a generated team is legal in
the format it was generated for.

**This unblocks the two refused drops.** §10 recorded that Darmanitan-Galar and
Zygarde could not be dropped because `maxTier` was checked when validating a
team and never in battle. That gate now exists. Neither has been dropped — that
is a tiering decision for a later pass — but the obstacle is gone.

### Palafin is the odd case, and it resolves to an item ban (2026-08-16)

Zero to Hero is Palafin's *only* ability, so the rule above cannot apply. But
this project already moved the transformation onto the **Hero Charm** (§5), and
the ability is a hookless registry entry — so it is an item ban after all, and
the machinery for that already existed.

**What was wrong: Palafin's tier was measuring a Pokémon you only get by holding
an item.** Nat Dex ranks "Palafin" Uber and means Palafin-Hero, 650 BST with 160
Attack. Base Palafin is **457 BST, pure Water, and with anything but the Charm
its ability slot does nothing at all**. It was sitting in Ubers as a 457 BST
Pokémon with no ability, which is not an opinion anybody formed.

Palafin is **ZU** now — chosen over PU precisely because of that blank slot; its
BST neighbours there (Seaking 450, Jumpluff 460, Masquerain 454) all have
working abilities. Palafin-Hero is untouched at Ubers, and `formeItemsFor` reads
the *target's* tier, so **the Hero Charm is refused everywhere below Ubers**
while Palafin itself plays down to ZU.

### Cosmetic skins are an appearance, not a species (2026-08-16)

**A forme that is a different *picture* of the same Pokémon is now a `skin` on
the set, not an entry in the species list.** Two qualify: **Magearna-Original**
and **Keldeo-Resolute**.

**Derived, never listed**, the same call as the Ring Target shop rule. A forme
qualifies when it is mechanically indistinguishable from its base — same typing,
stats, ability list and legal move pool — **and** carries none of
`transformOnly` / `battleOnly` / `requiredItem`. The second half is what does
the work: Cherrim-Sunshine, Mimikyu-Busted and Morpeko-Hangry all pass the first
test and are emphatically not skins, because Flower Gift, Disguise and Hunger
Switch produce them mid-battle.

**Magearna-Original was not merely redundant, it was a trap, and that is the
argument for the change.** Its `formeItems` named Magearna-Original-Mega, which
this project does not package (no sprite pair) — so holding a Magearnite banned
it below Ubers and then **failed to Mega Evolve at all**: `megaEvolve` returned
false and the Team Builder showed no forme. Picking it over plain Magearna was
strictly worse, for no stated reason and with nothing saying so. As a skin the
Mega is Magearna's and works.

How it hangs together:

- The skin keeps its packaged entry — it has to, or its artwork is unreachable —
  and is marked `cosmeticOf`, which joins `transformOnly` in the filter behind
  `Dex.allSpecies`. Selectable species 1,140 → **1,138**.
- **A skin is a packaged species id**, which is what makes it cheap: every
  sprite accessor already takes one, so nothing downstream needed a new code
  path. `Dex.skinnedSpecies(set)` is the single "which picture" answer, and it
  falls back to the species whenever the skin is missing or illegal — so a set
  carrying a skin that stopped existing draws as its base rather than as a
  broken image.
- **`normalizeSet` migrates an old set in place.** A team saved when
  Magearna-Original was selectable names it as the *species*; that is rewritten
  to Magearna with the appearance kept as a skin. Silent, because the two were
  mechanically identical — which is the whole reason it became a skin.
- **A held forme beats a chosen skin** in the Team Builder preview, and must: a
  Charizardite Y Charizard is drawn as Mega Charizard Y, and the Mega has its
  own art.
- `null` means the default appearance rather than the species' own id, so a set
  that never touched the picker is byte-identical to one saved before skins
  existed.

**An unreachable guard was written and deleted inside the hour, and the harness
is what caught it.** `findCosmeticSkins` originally also walked
`ABILITY_FORMES`, the Mega Stones and `FORME_CHANGE_ITEMS` to build a set of
"anything a transformation can produce" and excluded against that as well. Its
control came back **VACUOUS** — breaking it left the suite green — and measuring
showed why: it excluded **0** formes the three flags had not already excluded.
It was also a *third* copy of a table already declared twice. Both it and its
`ABILITY_FORME_TARGETS` mirror are gone; the invariant they implied is asserted
in `tests/data-validation.js` instead, where a failure is visible — if upstream
ever ships a transformation target without `battleOnly`, that test fails rather
than the forme silently becoming a "skin".

### What was decided (2026-08-16 — the OU → Ubers pass, carried out)

**Three entries promoted, and the hold list is the more interesting half.**
Decided from a verified-evidence packet (`docs/OU_TIERING_EVIDENCE_PROMPT.md`):
packaged learnsets read from the data, and damage from the real engine rather
than a Showdown calculator.

- **Lucario-Mega-Z → Ubers.** 70/100/70/164/70/151 with **Adaptability**, so
  STAB is 2x, plus Nasty Plot and a full special pool. The deciding argument was
  not its damage but that **RedGPT's unconditional priority does not answer it**:
  Fighting/Steel resists the common priority types, so +1 Kingambit Sucker Punch
  is 63.1-74.5% — a 2HKO, not a revenge kill.
  **Pinned explicitly, because Smogon has never ranked it** and it was sitting on
  `estimateFormeTier`'s guess. **Only the forme moved**: base Lucario is still
  RU, ordinary Lucario-Mega is still OU, and the effect is that Lucarionite Z is
  illegal in OU while Lucarionite is not — the Absol/Absolite rule.
- **Magearna and Magearna-Original → Ubers**, by *removing* their overrides
  rather than adding new ones, which restores Nat Dex's own Uber. The table
  means "where this project disagrees with Smogon", and on these two it no
  longer does. The evidence was Ring Target: at +3 Calm Mind, Stored Power goes
  from a flat **immunity** against Ting-Lu and Kingambit to 48.9-57.5% and
  118.6-139.6%; at +6 it is 260 BP for 351.7-413.9% into a defensive Kingambit.
  The Dark immunity *was* the counterplay, and one item deletes it.

**Zeraora-Mega was the leading suspect and was cleared**, which is the result
worth recording. Its stat line (88/157/75/147/80/153) is Ubers-shaped, and its
*learnset* is not: **no Ice, Water or Ground move of any kind**, so its only
answers to a Ground type are Fighting moves and Grass Knot. Meanwhile everything
that walls it kills it back — Mega Garchomp 176-207%, Great Tusk 205-242%, +1
Kingambit Sucker Punch 106-125%, all guaranteed. And the Zeraorite occupies the
item slot, so it **cannot hold the Ring Target** that would fix the immunity.
A stat line is not a verdict; the learnset was.

Also reviewed and held in OU: Kingambit, Raging Bolt, Zamazenta, Mega Mawile,
Mega Medicham, Kyurem-Black, Mega Metagross, Deoxys, Annihilape, Greninja-Mega.
Roster totals **OU 109 → 106, Ubers 62 → 65**.

Two of those hold decisions rest on a measured expectation rather than a raw
number, and are worth not re-litigating: **Mega Medicham's Focus Punch is worse
than High Jump Kick** (150 × 0.70 = 105 expected against 130 × 0.90 = 117), and
**Kingambit's unconditional Sucker Punch does 18-21% to Great Tusk at +1** while
Great Tusk OHKOs back.

### What was decided (2026-08-16 — the OU → UU pass, carried out)

**Fifteen entries dropped OU → UU. OU 107 → 92, UU 71 → 86.** Decided from a
verified-evidence packet (`docs/UU_TIERING_EVIDENCE_PROMPT.md`) the same way the
Ubers pass was: packaged learnsets read from the data, damage from the real
engine. Implemented as thirteen species rows and two forme rows in
`TIER_OVERRIDES`, plus one pin.

The recurring argument is **role competition inside UU**, not raw power — in
almost every case UU already contains something doing the job at least as well,
so the OU entry is a variant rather than a ceiling:

| dropped | already in UU doing the job |
| --- | --- |
| Slowbro | Mega Slowbro, Slowking |
| Iron Treads | Excadrill (stronger, and faster still under sand) |
| Gyarados | Salamence (faster, stronger, 600 BST) |
| Thundurus-Therian | Thundurus — a sidegrade, ±10 Speed for +20 SpA |
| Okidogi | Buzzwole, Conkeldurr |
| Corviknight | Skarmory, Celesteela |
| Hatterene | Mega Gardevoir (Psychic/Fairy) + Mega Sableye (Magic Bounce) |
| Zapdos-Galar | Terrakion, Mienshao |
| Iron Crown | Jirachi, the more flexible Steel/Psychic |
| Weavile, Hawlucha, Moltres, Pecharunt | ample structural counterplay measured |

**The two Megas are the interesting half, because both lose to their own base
forme.** Mega Scolipede gives up Speed Boost and item freedom, and the numbers
are decisive: base Scolipede after **one automatic** Speed Boost is 532 against
the Mega's 490 after spending a whole turn on Agility. Mega Skarmory's
**Stalwart is inert in singles** — it ignores move redirection, which only
exists in doubles (§9) — so it trades 30 Defence and item freedom for an
effectively blank ability. Both bases were already UU and did not move: this is
the Absol/Absolite rule pointed the other way, and Scolipite and Skarmorite are
now legal in UU while the species were legal there all along.

**One pin, and it is honest about not being load-bearing.** `hawluchamega: 'OU'`
stops Mega Hawlucha following base Hawlucha down. **Measured**: with the row
deleted and the data rebuilt, `estimateFormeTier` lands it on OU by itself, so
the tier does not actually move — the same shape §5 records for the Magearna
pin. It is kept because an explicit decision is cheaper to trust than a model,
and because it buys one real thing: `tierSource` becomes `redgpt-override`
rather than `estimated`, so the Pokédex stops calling that tier a guess.
**Do not control it by deleting the row** — that leaves the suite green and
reports VACUOUS. The control sets it to `UU` instead, which proves the *test*
would catch the Mega following its base down. Slowbro-Mega and Gyarados-Mega
need no pin and deliberately do not get one: both are ranked by Nat Dex, so the
estimator is never consulted for them.

**Zero collateral movement, and that was the risk worth measuring.** Pinning
three previously-unranked Megas makes them datapoints in `estimateFormeTier`'s
own model, which could have shifted every other unranked forme's estimate. A
full before/after snapshot of all 1,270 species and all 105 forme entries shows
**18 records changed and not one more** — the 15 tier assignments plus three
`tierSource` provenance updates where the tier itself is unchanged. Ubers, RU,
NU, PU and ZU are byte-identical, and selectable species stays 1,138.

**Held in OU, deliberately**, each for a stated reason rather than by omission:
the three masked Ogerpons (the provisional profile understated Ivy Cudgel — it
is packaged Grass and resolves to Fire/Water/Rock at use time with full STAB and
the Mask's 1.2x, and none of the three has ever actually been played), Ceruledge
(physical; the automated screen matched it against a special Mega Chandelure),
Tapu Lele (the screen cannot value Psychic Surge or item freedom),
Urshifu-Rapid-Strike (physical; Keldeo is special), Xurkitree (Tail Glow plus
Beast Boost is a ceiling Zeraora does not have), Slowking-Galar, Samurott-Hisui,
Alomomola, and both Terapagos entries.

**Dracovish was held on an evidence contradiction, not on a judgement.** The
packet's calculator rows gave *identical* damage for Fishious Rend "moving
first — doubled" and "moving second — not doubled" (Tapu Fini 158-186 both
ways, Swampert 275-324 both ways). That cannot represent both an 85 BP and a
170 BP state, so one of the two rows is wrong and the tier cannot be decided
from it. **Left OU by instruction; investigated separately and now diagnosed —
see "the Fishious Rend / Bolt Beak evidence, diagnosed" below.**

**`tools/tiering-docs.js` exists now, and it is the reusable part.** Both
briefings carry roster blocks pinned by tests, and the blocks had been produced
ad hoc by whichever session wrote them — so a tier change meant reconstructing
the generator from its own output. It regenerates the roster tables, the name
lists, the headings and every count stated in prose from `Formats.tierRoster`.
The per-Pokémon **movepool profiles are relocated between sections, never
re-derived**: the profiler behind them resolves use-time move typing, and a
second subtly-different implementation is exactly the drift this project keeps
finding. A name with no profile is a hard error rather than an empty entry.

Regenerating found three numbers that were already wrong before this pass and
that no test could see, because prose outside the generated markers is not
pinned: the OU briefing's ladder table said **UU 72** and **ZU 253** against a
live 71 and 254, and the UU briefing claimed **"11 of the 71 UU entries are
Megas"** when the real count was 19. All three are derived now.

**69 controls** (64 → 69) and **408 assertions** (407 → 408). The five new
controls cover a species drop, a forme drop, a Mega following its base down, and
both doc pins; all five were confirmed to fail their own test.

### The Fishious Rend / Bolt Beak evidence, diagnosed (2026-08-16)

**The engine is correct and was never the problem.** `battle.js:3128` is one
shared line — `case 'boltbeak': case 'fishiousrend': return
defender.hasActedThisTurn ? move.basePower : move.basePower * 2;` — and real
battles confirm the exact 2x swing for both moves. Identical sets, the only
difference being a Choice Scarf on the *defender*, which flips who moves first
and changes nothing about its defences:

| | foe has not acted | foe has acted | ratio |
| --- | --- | --- | --- |
| Fishious Rend (Dracovish → Swampert) | 300 | 151 | **1.99** |
| Bolt Beak (Arctozolt → Tangrowth) | 86 | 43 | **2.00** |

**Two independent defects produced the contradiction, and neither is in the
engine.**

**1. The calculator cannot express turn order at all.** `Calculator.applyState`
sets boosts, status, `hpPercent` and `tera` and nothing else, and both Pokémon
are built fresh — so `hasActedThisTurn` is *always* false and
`damageTakenThisTurn` *always* 0. The packet's two rows were therefore the same
calculation twice, both in the "defender has not acted" state, i.e. **both were
the doubled reading**.

That default is not neutral. It silently picks a branch, and not the same one
each time — measured per effect:

| effect | calculator always shows | the other branch | direction |
| --- | --- | --- | --- |
| Fishious Rend, Bolt Beak | 170 | 85 | **overstates** |
| Payback | 50 | 100 | understates |
| Assurance, Avalanche, Revenge | 60 | 120 | understates |
| Analytic | 80 | 104 | understates |

Counter, Mirror Coat, Metal Burst and Comeuppance need
`damageTakenThisTurn > 0` and Zoom Lens needs `target.hasActedThisTurn`, so they
are in the same family. **20 call sites read turn-order state the calculator
never sets.**

**2. The packet used the wrong ability, and this is the larger error.** Every
Fishious Rend row matches **Water Absorb**, not Strong Jaw, although the prose
above the table says Strong Jaw. `normalizeSet` gives ability **slot 0**, and
Dracovish's slot 0 is Water Absorb — the trap §8 already records. Checked
against all six targets in the packet, and it is unambiguous:

| target | packet | Water Absorb | Strong Jaw |
| --- | --- | --- | --- |
| Tapu Fini | 158-186 | **158-186** | 236-278 |
| Swampert | 275-324 | **275-324** | 412-484 |
| Skarmory | 203-239 | **203-239** | 303-333 |
| Blissey | 645-759 | **645-759** | 966-1137 |

**The two errors point in opposite directions and do not cancel**, which is why
the packet's Dracovish section cannot be repaired by scaling it:

- the "moving first" rows are right about the doubling and **1.5x too low**;
- the "moving second" rows are wrong twice — they need halving *and* the 1.5x,
  so the true figure is **0.75x** what is printed.

Corrected, Choice Band Strong Jaw Dracovish moving first is **412-484 into a
fully defensive Swampert, a guaranteed OHKO**, and 90.7-99.7% into Skarmory.
That is materially stronger than the packet showed — so the decision to hold
Dracovish in OU stands, but on the opposite reasoning to the one recorded.

**3. The AI over-values both moves when it will move second, and this is a real
defect.** `AI.estimateDamage` returns the same number either way while
`movesFirst` correctly differs:

| | estimateDamage | movesFirst |
| --- | --- | --- |
| Fishious Rend, AI faster | 299 | true |
| Fishious Rend, AI slower | **299** | false |
| Bolt Beak, AI faster | 86 | true |
| Bolt Beak, AI slower | **86** | false |

The AI chooses *before* the turn runs and `hasActedThisTurn` is reset to false
at the start of every turn, so the engine value is true *at choice time* and
false *when the move lands*. This is the family §8 records for the Mega-aware
`incomingThreat` fix — **the resolve rule is right and its input is wrong** —
and `movesFirst` is already computed a few lines away, so the information is
present and simply unused.

**Denominator, before anyone sizes the fix:** **16 of 400** random-format teams
carry one of these moves (16 of 2,400 sets — Arctovish 5, Arctozolt 4,
Dracozolt 4, Dracovish 3). Comparable to the Protean/Libero 7-of-400, so
`tools/ai-ladder.js` will be close to blind to the AI half.

Holders are Dracovish (OU) and Arctovish (PU) for Fishious Rend, Dracozolt and
Arctozolt (both RU) for Bolt Beak. Note **Bolt Beak is correctly not a bite
move** (`bite=false` in the packaged data, as upstream) and neither of its
holders has Strong Jaw, so defect 2 cannot affect it.

**All three were then fixed, plus the calculator rebuilt around both
directions.** What landed:

- **The AI projects turn order.** `estimateDamage` asks "will the target have
  moved by the time this lands", not "has it moved", for
  `Mechanics.TURN_ORDER_POWER_MOVES` (Fishious Rend, Bolt Beak, Payback) and for
  any ability declaring **`readsTargetActed`** (Analytic). Measured: Fishious
  Rend 299 → **150** when the AI is slower, against a real 151; Bolt Beak
  86 → **43** against a real 43.
  Implemented as a **set-and-restore of `defender.hasActedThisTurn` in a
  `finally`**, deliberately, because one mechanism then covers `dynamicBasePower`
  *and* the `onBasePower` hooks — two different systems — and nothing observable
  changes, so §5's "asking must not change anything" still holds.
  **`movesFirst` defaults its `foeMove` to `bestDamage`, which calls
  `estimateDamage`** — so the projection is behind a recursion guard, and inside
  a projection the live flag is used. Without it, two turn-order carriers facing
  each other recurse forever.
  **Deliberately NOT the `damageTakenThisTurn` family** (Assurance, Avalanche,
  Revenge, Counter…): those depend on whether the opponent *chose to attack*,
  which is a prediction this AI does not make (AI_DESIGN §3). Turn order is
  already computed; that is the whole difference.
- **The calculator can express turn state**, through `hasMoved` and
  `damageTakenPercent` on each side, which between them cover all ten affected
  moves plus Analytic. `buildBattle` wires `lastDamageSourceUid` across, because
  Avalanche and Revenge need *who* hit them, not merely that something did.
- **The calculator runs both directions at once**, which is how Showdown's does
  it — each Pokémon has its own four move slots and attacks the other. Checked
  against `calc.pokemonshowdown.com` rather than assumed. **Showdown has no
  turn-order control at all**, so those two fields are a RedGPT addition this
  engine needs and its does not.
  **Screens had to move onto each side**, and that is the part a careless
  version gets wrong: they were one global set applied to `sides[1]`, which is
  correct while only one direction runs and becomes "the screen follows whoever
  is defending" once both do — putting Pokémon 2's Reflect in front of Pokémon
  2's own attack. A control pins exactly that.
- **The packet's Fishious Rend (21) and Scizor Bullet Punch (5) rows were
  regenerated** by `tools/evidence-calcs.js` from declared sets, and now name
  their ability in bold. The rest is **not** re-verified and the document says
  so in as many words — its attacker cells are inconsistent, so those sets
  cannot be recovered from the text, and inventing them would manufacture
  exactly the false authority being fixed.

**One control was designed, measured to be vacuous, and replaced.** Deleting
`hawluchamega`-style pins is the usual shape, but here the candidate was
"delete `readsTargetActed`" — which does fail — while "delete the
`damageTakenCategory` select" would not have, because the calculator never
consults `moveSpecialFailure` and Counter reported **204 off both a Physical and
a Special hit**. The select was **removed rather than shipped**: it was a live
control with no effect, which §10 records as a defect once already. The config
field stays for anything driving `Calculator` directly.

**Known limitation, stated rather than hidden:** the calculator reports Counter
and Mirror Coat damage without checking that the move could legally fire. It
never modelled move failure (it prices Sucker Punch the same way); this only
became visible because the damage-taken field gives those moves something to
report.

**79 controls** (69 → 79) and **410 assertions** (408 → 410). `tests/ui-smoke.js`
is now a **fourth control suite** (`smoke`), because UI *wiring* — does a control
on the page reach the module behind it — is invisible to an engine test. It does
not honour `REDGPT_TEST_FILTER`, so a control naming it runs the whole jsdom
suite.

**Two traps worth carrying forward from doing it.** `tests/engine-battle.js` is
**LF**, not CRLF as §8 lists it — detect, never assume. And a `node -e` script
inside double quotes in bash **executes backticks**: a scripted patch landed with
every template literal silently deleted and still reported success, which is §8's
"verify a scripted patch actually changed the file" in a new costume.

### The UU format audit — briefing written, waiting on ChatGPT (2026-08-16)

**The next pass is UU reviewed in both directions at once**: which UU entries
are too strong for the tier, and which are too weak. Two documents are written
and current:

- **`docs/UU_FORMAT_AUDIT.md`** — the UU roster profiled in full, plus the OU
  roster as the bar "too strong" is measured against and the RU roster as the
  bar for "too weak". With it: RedGPT's divergences that change tiering answers,
  the complete generated move-difference table, the ability and item changes
  joined against *who in UU actually has them*, and the forme gates.
- **`docs/UU_FORMAT_AUDIT_PROMPT.md`** — the prompt to paste with it.

**No tier change has been made.** Implement the reply the way the OU → UU pass
was implemented: `TIER_OVERRIDES`, regenerate, update the pinned docs, add a
control per new assertion.

**`tools/uu-audit-doc.js` generates it, and the one rule it exists to obey is
§10's:** *anything that summarises a movepool for judgement must ask the engine,
not the packaged row.* Every type, power and category comes from
`battle.moveType`, `battle.moveCategory` and
`dynamicBasePower({preview: true})` against a real battle Pokémon **holding its
real item** — which is what makes Ivy Cudgel read Fire on Ogerpon-Hearthflame
rather than the packaged Grass.

Four things the first generated draft got wrong, all caught by reading the
output rather than by a test, and all worth knowing before writing the next
profiler:

- **It advertised moves the format bans.** UU runs an evasion clause and an OHKO
  clause, so Double Team appeared under "Setup" on half the roster — a set the
  validator would refuse. It filters on `rules.bannedMoves` now, and the pinning
  test asserts no banned move appears in any profile.
- **Hyper Beam and Giga Impact topped the coverage list** on almost every
  physical entry, which is true and says nothing. `RECHARGE_MOVES` are excluded;
  `CHARGE_MOVES` are kept but tagged `(charge)`, because Solar Beam under sun is
  a real option and hiding it would be the opposite error.
- **Bide showed up as a priority attack** at 0 base power. The priority list
  needs a power floor.
- **Defog was listed twice**, once as removal and once as utility.

**`Mechanics.ENGINE_PRIORITY` is new and is a dedupe, not an addition.**
`random-teams.js` kept a local copy of "moves whose priority the engine applies"
(Grassy Glide) and the profiler needed the same answer; there is one declared
list now and `random-teams.js` reads it.

**The control harness gained `regenerate`**, the document counterpart of
`rebuild`: a control that patches a *doc* generator changes nothing any suite
reads until the document is rewritten. Without it the profiler control ran and
proved nothing.

**Found while building it: `evasionClause` and `ohkoClause` were declared and
read by nothing. Fixed the same day** — see below.

### The evasion and OHKO clauses are read now, not merely declared (2026-08-16)

`formats.js` set both flags on every tier format and a repo-wide grep found no
other reference, while `speciesClause` and `sleepClause` are each read in four
or five files. The *behaviour* was right — the same six ids were hardcoded into
`bannedMoves` a dozen lines below the flags, and the validator enforces that
list — but the flags were the §8 declared-but-inert family: a format setting
`evasionClause: false` would still have banned Double Team.

**`bannedMoves` is derived from the flags now**, through
`Formats.clauseBannedMoves(rules)`, at both places a ruleset is built:
`tierRules` and `Formats.custom`. `custom` is the one that would have gone
stale — `Object.assign` copies the base format's already-derived list, so a
custom game that ever gains an evasion toggle would have kept OU's answer and
the flag would be inert again.

Two properties are deliberate and each has a control: the derivation
**preserves a ban that is not a clause's** (a format may ban a move outright,
and recomputing must not drop it), and it is **idempotent**.

**Behaviour is unchanged**, verified across all twelve formats: the nine ladder
formats ban the same six moves as before, and Anything Goes, Random Battle and
Campaign still ban none. Both flags default to the same values they had.

**One control was written, reported VACUOUS, and replaced — correctly.** The
obvious control is "put the hardcoded list back", and it cannot fail: every
shipped format sets both flags `true`, so a hardcoded list and a derived one are
byte-identical. There is no observable difference to assert. The control that
works removes the *assignment* instead, leaving the ladder banning nothing.
Worth remembering as a shape: **a fix that only changes behaviour under
configurations nothing ships cannot be controlled by output alone** — control
the wiring rather than the values.

### The profiler had four defects, and there is one copy of it now (2026-08-16)

Assembling `docs/UU_FINAL_EVIDENCE.md` — the packet for the final UU audit —
turned up four defects in the movepool profiler. All four changed what a profile
said, none would have been caught by a test, and all four were found by **reading
the output**.

**1. The category filter compared BASE Attack to BASE Special Attack**, so every
ability that multiplies a stat had the wrong half of its movepool hidden. The
sharp case is **Mega Starmie: 100 Atk / 130 SpA on paper, `getStat` says 656 /
394 with Huge Power live** — and measured into a 252/252 Blissey its physical
Waterfall is **434-511 (60.8-71.6%)** against Hydro Pump's **168-197
(23.5-27.6%)**. The profile showed the special half. **Azumarill** was the same
shape hidden behind slot-0 Thick Fat (Huge Power reaches **436 Atk**).
Offence is measured per ability through the engine now, and the best decides.

**2. The `-ate` abilities were never applied.** §8 already records that they
live in `onModifyMove` rather than `battle.moveType`; the profiler asked
`moveType` and got the packaged answer. Pixilate's Hyper Voice read **Normal 90**
against a real **Fairy 117**, so Mega Gardevoir's and Mega Altaria's Fairy STAB
were simply missing. `Abilities.displayMoveType` / `displayBasePower` are the
project's own answer — the move buttons use them — and the profiler does now.

**3. Charge moves won ties**, so Mega Starmie's Water STAB read *Dive* (80,
charge) rather than *Waterfall* (80, free).

**4. Banned moves were advertised** — Double Team under "Setup" although UU's
evasion clause bans it.

**`tools/lib/profiler.js` is the single copy.** `uu-audit-doc.js` carried its own
and that is what drifted; both briefings read the shared module now, and the
controls point at it. This is the §5 rule about tables applied to code: a second
implementation of "what does this Pokémon do" is exactly the drift this project
keeps finding.

**The pinning test grew assertions that can see all of it** — Mega Starmie must
show physical coverage and Waterfall, Azumarill must show physical coverage,
Mega Gardevoir's Hyper Voice must read `Fairy Hyper Voice 117S`, Mega Altaria's
Double-Edge `Fairy Double-Edge 156P`, and no charge move may be quoted as a STAB
where an equal free move exists. Without those the base-stat control was
VACUOUS: the roster pin cannot see a missing coverage line.

**Verified from the engine while building the packet**, and worth not
re-deriving:

| Question | Answer |
| --- | --- |
| Contrary + Close Combat | **stacks**, +1 Def and +1 SpD per use, measured to +5/+5 |
| Sharpedo pre-Mega Speed Boost | **survives Mega Evolution** — 317 → +1 475 → Mega **508** with the stage kept |
| Download, Light Metal | re-apply on **every** entry, reset on switch-out, never stack |
| Upper Hand | **65 BP at priority +3** |
| First Impression / Sucker Punch / Grassy Glide / Thunderclap | 90/+2, 80/+1, 70/+1, 70/+1 |
| Triple Axel | 20 BP × 3, **excluded** from the multi-hit rewrite |
| Meganium-Mega's Mega Sol | **personal** weather — no teammate sees it |

### The RU audit packet, and the UU audit's result (2026-08-16)

**The UU audit came back "move nothing", in both directions.** Starmie-Mega,
Porygon-Z and Delphox-Mega were the watch list and all three stayed; no UU entry
dropped to RU. So the UU roster is unchanged at **86**, and it is the live bar the
RU pass measures upward against.

**`docs/RU_FINAL_EVIDENCE.md`** is the next packet — RU reviewed in both
directions (RU → UU and RU → NU), generated by `tools/ru-final-evidence.js`. It
carries all three rosters in full: **RU 126**, **NU 65** and **UU 86**, because
the UU pass showed that a downward audit without the lower tier's movepools
cannot be finished. Sections A-T, 6,313 lines.

**It reuses `tools/lib/profiler.js`**, so it has none of the four defects the UU
pass found. That is the payoff from making the profiler shared rather than
copying it a third time.

**Verified live rather than assumed, because the brief specifically warned not
to inherit UU's answers:**

- **RU's rules are byte-identical to UU's except `maxTier: 'RU'`.** Compared key
  by key. No RU-specific bans of any kind.
- **NU has 0 estimated formes; RU has 13** — Absol-Mega-Z, Chimecho-Mega,
  Crabominable-Mega, Eelektross-Mega, Falinks-Mega, Froslass-Mega, Golurk-Mega,
  Malamar-Mega, Pyroar-Mega, Raichu-Mega-X, Raichu-Mega-Y, Scovillain-Mega,
  Victreebel-Mega. That is the softest evidence in the tier and section F
  inspects each one directly.
- **The transformation legality audit comes back clean.** 16 item-driven routes
  from an RU species to an above-RU forme, **every one refused by the real
  validator**; two ability-driven routes, of which Darmanitan → Darmanitan-Zen is
  same-rung and **Zygarde-10% → Zygarde-Complete (Ubers) is refused** with the
  Pokémon staying legal on Aura Break. Asserted through `validateTeam`, not read
  off the data, and pinned by a test with a control that breaks the gate.
- **The calculator honours Skill Link** — Cloyster's Icicle Spear reports **5
  hits** with it and 3 without, so the multi-hit figures are the real forced-max
  ones. Cloyster is RU's only Skill Link holder.

**A control was written, reported VACUOUS, and fixed — the second time this
session.** "A tier move leaves the packet stale" carried `regenerate`, which
rebuilt the document to match the moved roster, so nothing could fail. Staleness
controls must **not** regenerate; the shape to remember is that `rebuild` and
`regenerate` answer opposite questions — `rebuild` makes a generator patch
*visible*, `regenerate` makes a doc patch visible, and a **staleness** test needs
neither.

### The Z-A Mega abilities, from the Champions datamine (2026-09-03)

**The three `-Mega-Z` placeholders §5 warned about were placeholders, and all
three are now real values.** Supplied by the player from a Pokémon Champions
datamine, ahead of the official update:

| Forme | Was (a copy of the ordinary Mega) | Now |
| --- | --- | --- |
| Garchomp-Mega-Z | Sand Force | **Levitate** |
| Lucario-Mega-Z | Adaptability | **Aura Guard** (new) |
| Absol-Mega-Z | Magic Bounce | **Sharpness** |

§5 had recorded the giveaway correctly: all three were byte-identical to each
Pokémon's *ordinary* Mega, which "is what a provisional placeholder looks like".

**Two new generator mechanisms, both meant to be retired.** There was no way to
add an ability upstream lacks, and no way to reassign a species' ability at all
(`ABILITY_OVERRIDES` is descriptions only):

- **`ABILITY_ADDITIONS`** — the ability counterpart of `ITEM_ADDITIONS`, for
  **Aura Guard**, which `@pkmn` does not carry. Without it the ability is a dead
  string and the forme ships with nothing. Abilities **316 → 317**, implemented
  **294 → 295**.
- **`SPECIES_ABILITY_OVERRIDES`** — sets a species' ability list outright. It
  **clears the object before writing**, because a merge would leave the upstream
  placeholder in slot `'0'` and *a Mega forme reads `abilityList(species)[0]`*.

Both are listed in `docs/DATA_REPORT.md` under **Project ability assignments**,
rendered rather than merely collected — §8's most-repeated bug shape — precisely
so they can be found and deleted when upstream catches up.

**Aura Guard: flat halving of contact damage, no HP gate.** Measured against a
neutral-ability control on the same defender — Sucker Punch 128-152 → **64-76**,
Bullet Punch 109-128 → **54-64**, Extreme Speed 85-100 → **42-50** — while Ice
Shard, Earthquake and Flamethrower are byte-identical, which is what proves the
contact gate is doing the work rather than a blanket halving.

**Long Reach bypasses it; Protective Pads do not — and the first draft of the
ability's own description asserted the opposite for both.** Caught by reading the
measurement, not by a test. Long Reach strips contact in `onModifyMove`, so the
damage pipeline never sees a contact move (Rowlet's Tackle 24-28 either way).
Protective Pads only hand a **contact-free copy to the defender's reactive
hooks** (§8), never to damage calculation, so a Pads Kingambit is still halved,
49-58 against 99-117. Both readings are correct: the Pads shield their holder
from being *punished* for contact, which is not the same claim as the move not
making contact. The description now states the measured behaviour.

**It is deliberately NOT added to `AI.setupValue`'s `guarded` list** beside
Multiscale and Shadow Shield. Those two are there because a full-HP halving buys
a *guaranteed turn*, the way a Focus Sash does; Aura Guard has no HP gate and
buys no such guarantee, and `estimateDamage` already prices it by running the
engine's own damage pipeline. Listing it would be the exact double-count
AI_DESIGN §5 records for Multiscale's `effectiveHP` entry.

**Zero tier records changed** — the full snapshot diff came back **0 of 1,273
species and 105 forme records**. Tiers derive from `TIER_OVERRIDES` and upstream
tier data, not from abilities, so an ability swap moves nothing on its own.
**That is the finding, not the reassurance:**

> **Three tier placements now rest on abilities those Pokémon no longer have.**
> Lucario-Mega-Z is **Ubers on an explicit pin justified in §10 by Adaptability
> by name** — "70/100/70/164/70/151 with **Adaptability**, so STAB is 2x". Aura
> Guard cuts that STAB to 1.5x, a flat 25% off its main damage, while making the
> pin's *deciding* argument stronger: that argument was that unconditional
> priority cannot revenge it, and **Sucker Punch, Bullet Punch, Mach Punch,
> Extreme Speed, Grassy Glide, First Impression, Upper Hand and Aqua Jet are all
> contact — Ice Shard is the only common non-contact one.** Garchomp-Mega-Z
> (Ubers) and Absol-Mega-Z (RU) are both still `estimated`. **All three need a
> fresh audit; none was moved here.**

**One control was written, measured VACUOUS, and removed with its reason.** The
clear-loop cannot be controlled by output: all three overridden formes have
exactly **one** upstream slot (`{"0": "Sand Force"}` and so on), so merge and
replace are byte-identical for everything this project ships. The loop is kept as
the correct semantic and `coverage-controls.js` says why it carries no control —
§10's rule that a fix which only changes behaviour under configurations nothing
ships must be controlled by wiring, not output.

**132 controls** (129 → 132) and **438 assertions** (436 → 438). Six documents
regenerated. **The official update lands ~2026-09-09**; when upstream ships these
values, delete both tables and rebuild.

### The UU → OU pass and the Meloetta pass, carried out — both moved nothing (2026-08-17)

**Two audits implemented, ZERO competitive tier movements, and the whole change
is provenance.** This is the first pass on the programme whose entire diff is
`tierSource`.

| Pass | Verdict |
| --- | --- |
| UU → OU (upward only) | **no promotions** — all 91 UU entries retained |
| Meloetta / Meloetta-Pirouette | **no movement** — Meloetta NU, Pirouette RU |

**Live counts are unchanged and were verified from the rebuilt project rather
than assumed: Ubers 63, OU 93, UU 91, RU 131, NU 67, PU 110, ZU 677 — 1,232
ranked entries**, selectable 1,138, packaged 1,273.

**Seven UU formes were reviewed and pinned** — Dragalge-Mega, Drampa-Mega,
Emboar-Mega, Meganium-Mega, Scrafty-Mega, Staraptor-Mega and Starmie-Mega, all at
**UU**, the tier they already had. `TIER_OVERRIDES` rows, so `tierSource` goes
`estimated` → `redgpt-override`.

**The snapshot diff is the evidence, and it came back exactly 14 records.** Seven
`formeItems[]` rows changed **provenance only** with the enforced tier still UU,
and seven `species.tier` rows moved off the base-species fallback (NU/NU/PU/ZU/
NU/NU/NU) onto UU. **Not one other record moved** — the estimator did not ripple,
which was the risk worth measuring, since pinning a forme makes it a datapoint in
`estimateFormeTier`'s model and that has fired three times before.

**UU now carries 0 entries on an estimated tier** (was 7), and the §10
`species.tier` disagreement set went **25 → 18**. The *enforced* tier never moved
for any of them.

**Tier the forme, not the base — verified, because the seven bases span four
rungs.** Dragalge NU, Drampa NU, Scrafty NU, Staraptor NU, Starmie NU, Emboar PU,
**Meganium ZU**. A pin leaking onto a base would be conspicuous there, and none
did.

**The delete-control on these pins is NOT vacuous, and that is the contrast with
`hawluchamega`.** There, deleting the row left the estimator producing the same
tier and the control reported VACUOUS. Here the estimator also produces UU — so
the *tier* is unchanged — but the *provenance* is not, and the test asserts
provenance as well as tier. **Reviewing a forme and recording that you reviewed
it are two different facts, and only the second survives a delete.** A second
control moves one pin to RU, so the test can demonstrably see a real tier change
too.

**Meloetta: both placements reviewed with the forme actually reachable, and both
retained.** Meloetta stays **NU** (imported), Meloetta-Pirouette stays **RU** —
and Pirouette was **already** `redgpt-override`, so no conversion was needed;
what changed is its status, from the roster bookkeeping the NU pass assigned when
nothing could reach the forme to a reviewed competitive verdict. **Relic Song
remains refused in NU** because it reaches an RU battle-only forme, verified
through the real validator: *"Relic Song is banned in NeverUsed — it turns
Meloetta into Meloetta-Pirouette, which is RU. Meloetta itself is legal here
without it."*

**The Meloetta control now runs in the dangerous direction.** The existing
trapping-pass control moves Pirouette *up* to UU; the new one moves it **down to
NU**, which is what would actually hand an NU Meloetta a turn-one transformation
into a forme the format does not admit. The forme-move gate test catches it.

**129 controls** (126 → 129) and **436 assertions** (435 → 436). Six generated
documents drifted from the `species.tier` alignment and were regenerated —
`tiering-docs`, `uu-audit-doc`, `uu-final-evidence`, `ru-final-evidence`,
`zu-final-evidence` and `uu-ou-evidence`. **`docs/UU_OU_EVIDENCE.md` now opens
with a RESOLVED banner and its section F records the seven pins**, the same fork
`untiered-evidence.js` uses — a generated document has to describe the live
state, and a packet that still reads as an open request after its verdict landed
is not describing it.

**`tools/lib/profiler.js` was deliberately NOT touched.** The ladder-wide
conditional-move defect below stays open and reported; fixing it rewrites the
evidence behind five completed audits and is its own pass.

### The UU → OU packet and the Meloetta packet, in one document (2026-08-17)

**`docs/UU_OU_EVIDENCE.md`** (9,003 lines) is built by `tools/uu-ou-evidence.js`
and pinned by a test with three controls. **No tier change has been made.** It
carries two audits that share a document because they were commissioned
together, not because they interact:

- **Part I, sections A-T** — the UU → OU pass. **Upward only**, and unlike the ZU
  packet that is a *scoping* decision rather than a structural fact: UU has RU
  beneath it, and §10 already records that a downward and an upward pass on one
  rung at the same time cannot be attributed to either.
- **Part II, sections MEL1-MEL10** — Meloetta and Meloetta-Pirouette, now that
  Relic Song reaches the forme.

**The `MEL` prefix is not decoration.** A first draft numbered Part II `M1-M10`
and collided with Part I's **section M**, the priority table. Caught by listing
the generated headings, not by a test.

**The honest statement about what had already been asked, which the brief did
not contain.** §10's open item said *"the UU → OU pass has not been done"*. That
is **superseded**: `UU_FINAL_EVIDENCE.md` asks *both* directions, including
"which UU entries are too strong for UU", and returned **move nothing** — the
open item predates that packet and was never struck through. What is genuinely
un-asked is narrower and is stated in the packet's context section: **the verdict
was reached when UU held 86 entries, and five have joined since, every one by
promotion from below** — Regieleki, Metagross, Raichu-Mega-Y and Pyroar-Mega from
the RU pass, Chandelure from the trapping pass. None has been measured against
OU.

**Two structural facts separate UU from the rung the last deep pass examined:**

- **UU is Mega-heavy where ZU was Mega-free.** **23 of 91 entries are formes**
  (25%) against ZU's 0, so item freedom is *not* universal: a forme entry has no
  Boots, no Leftovers, no Choice item and no Ring Target, and it spends the
  team's one Mega slot. In the other direction **12 UU species are barred from
  their own stone**, all 12 verified refused through the real validator, 0 legal.
- **7 UU entries sit on `estimated` tiers** — Dragalge-Mega, Drampa-Mega,
  Emboar-Mega, Meganium-Mega, Scrafty-Mega, Staraptor-Mega, Starmie-Mega — and
  every one is also a §10 `species.tier` disagreement row.

**The scan's first version returned 68 of 91, which is not a shortlist.** ZU's
flat "three or more flags" rule does not transfer: UU is the second-highest rung,
so "above OU's median" is true of most of it. It is now **two classes** — an
entry must clear at least one *strong* bar (OU's **75th percentile** on
engine-resolved Attack, SpA, Speed or BST, or a trapping ability, or an
unreviewed estimated tier) **and** trip three flags in total. **39 of 91**, each
with two matrices: against a UU core (*can UU answer it*) and an OU core (*would
it be ordinary there*). Percentiles are computed live, so the bar moves with the
ladder instead of going stale.

### A fifth profiler defect, and this one is ladder-wide (2026-08-17)

**The shared profiler quotes moves the engine refuses at use time.**
`tools/lib/profiler.js` ranks a movepool by delivered power and never consults
`moveSpecialFailure`. **Last Resort is the sharp case: 140 BP, quoted as
Meloetta-Pirouette's Normal STAB, and it fails until every other move in the set
has been used — measured at 0 damage when led with, log "But it failed!".**

**Scope measured before deciding where to fix it, exactly as the ZU pass's Slow
Start note requires: 457 quoted lines across 387 entries** — Last Resort 154
(OU 14, UU 9), Fake Out 97, Belch 63, Steel Roller 46, Mirror Coat 40, Fling 37,
Counter 14, Snore 5, Endeavor 1.

**That is NOT the Slow Start shape and the reasoning inverts.** ZU fixed locally
because scope was one Pokémon in one document, so a shared fix was "no gain".
Here the gain is real — but a shared fix **rewrites the evidence behind five
completed audits**, which is a project decision rather than a side effect of
writing a new packet. **So it is corrected in the new generator only, reported,
and the five siblings carry it uncorrected.** The packet says so in section T.

**The correction annotates rather than deletes**, because a conditional move is
still a real move — Last Resort genuinely fires on turn four. Conditional moves
are excluded only from the *auto-built* attacking sets, where a move that fails
on turn one produces a matrix of zeros.

**The annotation is reconciled against the project's own list, not hand-written.**
`RandomTeams.AVOID` in `src/arena/random-teams.js` declares 117 moves as *"traps
for a generated set"* (39 damaging) and is **maintained** — its comment records
Poltergeist and Dream Eater being *removed* when this project removed their
conditions. The profiler does not read it. The generator now parses it (with the
match asserted, so a moved anchor throws rather than silently yielding zero) and
**section T lists every damaging entry the packet quotes and fails to annotate**.
A control drops one row and watches that sentence flip.

**Skull Bash is a divergence running the other way, found by reading a matrix.**
It is **absent from `Mechanics.CHARGE_MOVES`** and the engine has no other case
for it, so it is an ordinary **single-turn 130 BP** physical move here —
measured at **409** damage to a Blissey on the turn it is used, where the games
make it two-turn. It is the top physical coverage of several UU entries,
including Starmie-Mega. Same family as §10 item 5 (`iceball`). **Not changed** —
recorded, and annotated in the packet so a reader who knows the games does not
discount it.

### Meloetta, measured — the forme is reachable and the tier was never a judgement (2026-08-17)

**What Pirouette's tier actually decides, and it is only one thing:** it carries
`battleOnly: 'Meloetta'`, so it can never be picked — refused in every tier
format. Its tier's *sole* function is to set **the rung from which Relic Song is
legal**, through `Formats.illegalFormeMoves`.

**The stat change is a rotation, not a mirror, and the first draft got it wrong.**
Attack and Special Attack swap (190 ↔ 292 at L100 neutral), but the other three
**rotate**: Defence takes Speed's old value (190 → 216), Speed takes Special
Defence's (216 → 292), and Special Defence takes Defence's (292 → 190). Written
first as "Defence and Special Defence swap", which gets Pirouette's bulk wrong in
both directions; **caught by reading the generated table against the trace.**
BST is identical at 600 — a redistribution, not an upgrade.

**Three things measured with their own controls:**

- **Serene Grace is Meloetta's only ability and it doubles Relic Song's sleep
  secondary.** 300 seeded single-turn battles: **54/300 (18.0%)** against
  **28/300 (9.3%)** with Serene Grace swapped for Pressure on the same seeds.
  Packaged secondary is 10%. **The move that performs the transformation is also
  a 20% sleep chance**, with Sleep Clause on in every tier format.
- **Relic Song is a sound move, so it goes through a Substitute.** With a 162 HP
  doll up: Relic Song takes **86** off the Pokémon and leaves the doll at 162;
  Hyper Voice 102, likewise untouched; **Psychic — the control, not a sound
  move — deals 0** and knocks the doll to 60 instead. Relic Song **still
  transforms** while doing it.
- **It reverts on switch-out**, so it is a per-appearance state and every entry
  costs a turn again. Verified by switching out and back.

**The route's four costs are itemised rather than buried in a damage number:** a
permanent move slot, a turn on every appearance, the transform being cast off
the Special Attack it is *giving up* (292 → 190 the moment it resolves), and
Special Defence falling 102 points. Against that it buys +102 Attack, +76 Speed
and a Fighting STAB.

**Only two move-driven forme routes exist on the entire ladder and both are
Meloetta's** (the second is the toggle back, which `illegalFormeMoves` filters
because a route to a *lower* tier is no threat). So the move half of the forme
gate exists for exactly one Pokémon.

**126 controls** (123 → 126) and **435 assertions** (434 → 435). The three new
controls are a staleness control that deliberately carries **no** `regenerate`,
and two that do — the shape `rebuild`/`regenerate`/neither has now been got right
by asking which question the control is answering.

### The untiered audit — ZU is the floor now, and NFE/LC discard is over (2026-08-17)

**§5's "NFE and LC are discarded" decision is SUPERSEDED.** It read as tidy and had
one consequence nobody wanted: a tier format admits nothing off the ladder, so
**473 selectable species could not be put on a legal team anywhere.** Reported
from real play: *"NFEs don't seem to be in any tier, meaning I can't put them on
a legal team."*

**Every selectable species now carries a ladder tier. ZU is the floor.**

**The implementation is a floor, not a category, and that distinction is the
whole design.** In the species loop, anything whose tier does not resolve to a
rung becomes **ZU** with `tierSource.from === 'redgpt-zu-floor'` and `raw` keeping
the upstream category (`NFE`, `LC`, `Illegal`) — so a floored tier is never
mistaken for an imported one. `TIER_OVERRIDES` is checked **first** inside
`smogonTier`, so the explicit placements win over the floor. Upstream ladder
rankings still win too: **Chansey stays UU and Pikachu stays ZU by import**, not
by floor. This is deliberately *not* "every unevolved Pokémon is ZU".

**Distribution of the 473:** RU **1**, NU **4**, PU **38**, ZU **430**.

- **RU:** Porygon2 — Eviolite ~459 Def / ~339 SpD, and **RedGPT Download gives
  +1 Atk *and* +1 SpA on every entry**, so it re-boosts each time it pivots back in.
- **NU:** Gligar, Magneton, Rhydon, Doublade.
- **PU:** 38, led by Floette-Eternal (the only fully-evolved one, so **Eviolite
  does not apply to it**) and the RedGPT-mechanic cases — Servine's Contrary with
  restored 140 BP Leaf Storm, Meditite's Pure Power, Lairon's redesigned Heavy
  Metal, Dipplin's every-entry Supersweet Syrup, Raboot's re-triggering Libero,
  Thwackey's Grassy Surge plus unconditional Grassy Glide.

**Eviolite is the mechanic the pass turns on**, and it is implemented — gated on
`Dex.evolutions(...).length`, so all 472 NFE get **1.5x Def and SpD**. Measured:
Dusclops **394 → 591** Def and **296 → 444** SpD. A pass reading raw stat lines
would have misplaced every bulky NFE.

**Final ladder: Ubers 63, OU 93, UU 91, RU 131, NU 67, PU 110, ZU 677 — 1,232
ranked entries** against 1,138 selectable species plus the forme entries.

**The estimator rippled, exactly as the standing rule predicts, and it was caught
by the snapshot.** **Delphox-Mega drifted UU → OU.** Two things in this pass moved
`estimateFormeTier`'s model under it: pinning Floette-Mega made a previously
*unresolved* forme **resolve**, adding a BST-651 / base-PU / rank-OU datapoint;
and the ZU floor changed the `baseRank` of every Mega whose base used to fall
through to RU by default. Delphox-Mega is base-PU and BST-adjacent to that new
datapoint, so its nearest-neighbour median moved a rung. **Pinned back to UU** —
an unreviewed Pokémon must not move as a side effect. That is the third time this
ripple has fired on this programme and the first time a *floor* caused it.

**The three recovered Megas are reviewed and pinned now**, not left on estimates:
**Floette-Mega OU, Meowstic-M-Mega RU, Tatsugiri-Curly-Mega RU** — all
retentions of the tier they already had, converted from `estimated` to
`redgpt-override` so a future model shift cannot move a reviewed verdict.
**Floette-Mega was already counted in OU**, so OU stays 93 rather than gaining.

**Pinning them also aligned three inert rows**: Delphox-Mega, Meowstic-M-Mega and
Tatsugiri-Curly-Mega had `species.tier` disagreeing with their enforced
`formeItems` tier, and now agree — the §10 disagreement set went **26 → 25**.
Their *enforced* tiers never moved.

**Silvally stays ZU**, on the completed all-17-Memory evidence. Every Memory
retypes correctly and Multi-Attack follows with STAB, but the Memory spends the
item slot, and no single typing invalidates ZU broadly.

**The zero-untiered invariant is a test, not a list.** It asserts that **no
selectable species lacks a ladder tier** rather than checking the 473 names, so a
newly packaged upstream species is caught too. Both directions are controlled:
removing the floor reddens it, and a floor applied *before* the overrides — which
would flatten all 43 exceptions and still satisfy "nothing is untiered" — is
caught by a separate control on the placements.

**`docs/UNTIERED_EVIDENCE.md` is now a RESOLVED record**, not a packet. Its
generator detects the empty case and emits the outcome, because a generated
document must describe the live state and a 3,897-line file asserting that 473
species are untiered stopped being true the moment the placements landed.

**Five running-arithmetic count pins had to move again** (Ubers, OU→UU, RU→UU, NU
and PU/trapping tests). That is now the fifth pass to pay that cost, and it is
still the right trade against a tautology — but the arithmetic strings are
getting long enough to be worth a rethink if a sixth pass touches them.

**A scripted patch silently matched nothing, for the recorded reason.** A Python
heredoc rewriting four assertions in `tests/data-validation.js` reported success
and changed nothing: the file is **CRLF** and the literals used `\n`. §8's exact
trap, in a new language. The Edit tool handled it; **verify a scripted patch
actually changed the file.**

### Relic Song, the move-forme gate, and three Megas recovered (2026-08-17)

**The forme-route rule has a third half now.** §5's *"ban the route, not the
Pokémon"* had an **item** half (`illegalFormeItems`) and an **ability** half
(`illegalFormeAbilities`); the **move** half (`illegalFormeMoves`) is what Relic
Song needed, and it landed with it.

**Relic Song works.** `Mechanics.MOVE_FORMES` is the single from → to table, read
by the engine, the validator, the Pokédex and the team builder alike. Measured:
Meloetta → Meloetta-Pirouette (Normal/Psychic → Normal/Fighting, Atk 190 → 292,
Spe 216 → 292), **it toggles** on a second use, and **it reverts on switch-out**,
so it is a per-appearance state rather than a Battle-Bond-style permanent upgrade.
The revert is derived from the table rather than flagged on the Pokémon, so it
cannot drift from what produced it.

**The gate is the load-bearing half.** Meloetta is NU and Pirouette is RU, so
without it an NU team fields a Pokémon that becomes an RU forme on turn one —
exactly the `maxTier` hole that blocked the Zygarde and Darmanitan-Galar drops.
Verified through the real validator: *"Relic Song is banned in NeverUsed — it
turns Meloetta into Meloetta-Pirouette, which is RU. Meloetta itself is legal
here without it."* Legal in RU and above. Enforced in the validator, `autoFix`
and `RandomTeams.chooseMoves`, the same three places the ability half is.

**One difference from the ability half, and it is deliberate:** `formeAbilities`
requires the base to have **two** abilities, because refusing the only one
deletes the Pokémon. A move ban never can, so `formeMoves` has no such guard.

**A guard was written, measured to be inert, and kept — with no control.**
`if (success) this.applyMoveFormeChange(...)` reads like the protection against
a blocked Relic Song transforming. It is not: every failure path (Soundproof,
Normal-into-Ghost, Protect) **returns from `executeMove` before reaching it**,
measured with the guard on and off producing byte-identical results. The test is
pinned by the early-return structure instead. The guard stays because it is the
correct semantic and matches the `roost` line beside it, but
`coverage-controls.js` deliberately carries **no control for it and says why** —
shipping a control that cannot fail is worse than admitting the gap.

**Three Megas were recovered, and it is the Oricorio-Pa'u shape a third time.**
`Floette-Mega`, `Meowstic-M-Mega` and `Tatsugiri-Curly-Mega` were dropped for
"no matching front+back sprite pair" **with complete artwork on disk**:

| Forme | key asked for | file on disk |
| --- | --- | --- |
| Floette-Mega | `FLOETTE MEGA` | `FLOETTE ETERNAL MEGA` |
| Meowstic-M-Mega | `MEOWSTIC M MEGA` | `MEOWSTIC MEGA` |
| Tatsugiri-Curly-Mega | `TATSUGIRI CURLY MEGA` | `TATSUGIRI MEGA` |

They look like three different problems and are one: **a Mega's artwork is named
after its HOLDER's artwork, plus " MEGA"**. Floette-Eternal's own sprite is
`FLOETTE ETERNAL`; Meowstic-M's and Tatsugiri-Curly's are the plain `MEOWSTIC`
and `TATSUGIRI`, because those are each species' default forme. Resolve the
holder's key first and append the suffix. **Keyed on `changesFrom`, not
`baseSpecies`** — a control proves the `baseSpecies` version still recovers two
of the three, so it looks like it works.

Packaged species **1,270 → 1,273**, skipped 147 → 144, and the diff is exactly
those three: **0 tier moves, 3 additions**.

**The ladder gained 3 entries as a side effect, and none of them is a decision
anybody made.** `tierRoster` skips a forme whose target is not packaged, so three
pre-existing `formeItems` rows had been counted by nothing. They are now visible
on the tiers the *estimator* gave them — **OU 92 → 93** (Floette-Mega) and
**RU 128 → 130** (the other two) — so the ranked total is 756 → **759**.
**All three sit on `estimated` tiers nobody has reviewed**, and section A0 of
`docs/UNTIERED_EVIDENCE.md` puts them in front of the next audit rather than
leaving them to pass as settled.

**Floette-Mega is the awkward one**: BST 651, listed in OU, and its only holder
Floette-Eternal carries **no tier at all** — so the Mega is legal in OU while the
Pokémon that produces it cannot legally be brought anywhere. **Only
Floette-Eternal can Mega Evolve**; plain Floette has no `formeItems` entry and a
Floettite does nothing for it, pinned by a test in both directions.

### The ZU pass, carried out — the ladder audit is complete (2026-08-17)

**Four promotions, no demotions, and the estimator did not move at all.**
Medicham, Rampardos, Virizion and Brute Bonnet went **ZU → PU**.
**PU 68 → 72, ZU 251 → 247**; Ubers, OU, UU, RU and NU are byte-identical and the
ranked total is conserved at **756**.

**The diff was exactly four records** — the four species, nothing else. No forme
moved, no `estimated` forme drifted, no provenance changed.

**Medicham is the forme case and it needed NO pin, which is the contrast worth
keeping.** One pass earlier Chandelure needed one, because Chandelure-Mega is
`estimated` and derives its tier from its base. **Medicham-Mega is `natdex`-ranked
at OU**, so `formeItemsFor` never consults the estimator for it and moving the
base cannot drag it. The rule is therefore not "a base with a Mega needs a pin" —
it is **check `tierSource` on the forme**: `estimated` follows, `natdex` /
`redgpt-override` does not. A control forces Medicham-Mega down anyway, so the
test can demonstrably see a Mega following its base rather than merely asserting
it does not happen. The Medichamite stays refused below OU while Medicham plays
in PU — the Absol/Absolite rule, verified through the validator.

**Rampardos, Virizion and Brute Bonnet have no formes, no family entries and no
`ABILITY_FORMES` routes at all**, so they carried no ripple risk. Checked before
the change rather than assumed.

**The two 670 BSTs were reviewed and deliberately left**, and the reason is
recorded because "it has the highest BST" will come round again: **Slow Start and
Truant are both fully implemented and are each species' only ability**, so
Regigigas and Slaking really do pay their drawbacks and cannot opt out. Tests now
pin both ability lists as single-element arrays. Also held: Silvally (pending a
per-Memory profile), Minior, Articuno, Mesprit, Regirock, Regice, Jolteon,
Sceptile and Ninetales.

**109 → 112 controls, 425 → 426 assertions.** Two pinned count literals moved
again — this is the fifth pass to touch running arithmetic across rungs, which is
the standing cost of pinning literals rather than deriving them, and still
cheaper than a tautology.

**The standard tier ladder audit is now complete.** Every rung has been audited:
Ubers, OU, UU, RU, NU, PU and ZU, plus the whole-ladder trapping pass. The only
open tiering question is Meloetta-Pirouette, which is blocked on Relic Song.

### The ZU evidence packet — the last rung, and it is one-directional (2026-08-17)

**`docs/ZU_FINAL_EVIDENCE.md`** (9,998 lines, sections A-T) is built by
`tools/zu-final-evidence.js` and pinned by a test with two controls. **No tier
change has been made.**

**ZU is the floor, so the pass cannot be bidirectional**, and that is the packet's
defining property rather than a scoping choice. "Too weak for ZU" has nowhere to
go. Section E exists and is deliberately empty, saying so; section K likewise,
because the downward role comparison every sibling packet has does not exist here.
**Being outclassed inside ZU is an argument for staying**, which inverts the rule
every previous pass ran on. The lettering is kept aligned with the sibling packets
so "section L is the speed table" means the same thing in all five.

**Three structural facts make ZU unlike every rung above it**, all measured:

- **ZU is Mega-free by construction.** It contains **0 forme entries**, so no
  forme carries a ZU tier and the Absol/Absolite rule refuses every stone —
  **33 forme-item routes tested through the real validator, 0 legal**. So item
  freedom is universal, no team ever spends a Mega slot, and "it costs the only
  Mega" — an argument that carried real weight in the NU and PU passes — has no
  force here in either direction. **Do not read `rules.mega: true` as evidence
  Megas are playable in ZU**; that flag is on in every format including Campaign.
- **0 ZU entries sit on an `estimated` tier.** The nearest-neighbour model that
  supplied the softest evidence in the RU, UU and PU passes has no input at all.
- **Heavy-Duty Boots are available to every entry**, because none is a forme.

**A profiler defect was found by reading the output, and it is the fourth of that
family.** `P.offence` measures through the engine with the ability **live**, which
is right for Huge Power and wrong for a penalty that **expires**. Regigigas
measured **Atk 230 / Spe 164** against a real **460 / 328**, because Slow Start
halves both — and the physical/special chooser then read SpA 284 > Atk 230 and
built a **special** set for a 160-Attack Pokémon, with every damage cell halved.

**Scope was measured before fixing: Regigigas is the only Slow Start holder on
the entire ladder** (Varoom is NFE and carries no tier), and Defeatist — the only
other self-debuffing `onModifyStat` — is HP-gated and therefore inactive at the
full HP a profile is built at. **So it is fixed in `zu-final-evidence.js`, not in
`tools/lib/profiler.js`**: the shared profiler feeds five pinned documents, and
changing it to correct one Pokémon that appears in only this one would force all
five to be regenerated for no gain. The packet prints **both** stat lines and
builds the matrix with the penalty expired, saying so in the caption.

**A cap was written, caught and removed.** The candidate section was capped at the
30 most-flagged entries and **Regigigas fell below the cut** — the highest BST on
the rung, excluded because a flag *count* ranked it under entries with more
numerous but weaker flags. A cap that drops the conspicuous case is a cap making a
judgement. All **65** flagged entries have matrices now.

**Two false alarms worth recording, because both cost time and neither was a bug:**

- **Crush Grip is priced correctly.** Its 65-76 into Regirock looked far too low
  for 460 Attack, but it is byte-identical to Double-Edge (packaged 120 BP) from
  the same attacker, and the engine previews it at 120. The hand-arithmetic was
  wrong, not the engine.
- **The calculator does default a defender to full HP.** Verified against Brine,
  which correctly flips at 50%.

**A test guard fired for the wrong reason**, which is the same defect class as one
that never fires: `ZU\s*→\s*(?!PU)` matches *"ZU → PU"*, because `\s*` may match
**zero** characters, so the lookahead is evaluated at the space before "PU" and
succeeds. Capture the destination and compare it instead.

**Live counts unchanged: Ubers 63, OU 92, UU 91, RU 128, NU 63, PU 68, ZU 251.**

### The PU pass and the global trapping pass, carried out (2026-08-16)

**Nine entries moved across four rungs, and one pin stopped a two-rung accident.**
Two audits implemented together because they overlap on one rung.

| Pass | Moves |
| --- | --- |
| PU → NU | Aggron, Heracross, Hariyama, Decidueye-Hisui, Pawmot |
| PU → ZU | **none** — the downward review established nothing ZU should absorb |
| trapping | Chandelure NU → **UU**; Gothitelle ZU → **NU** (two rungs); Dugtrio and Wobbuffet ZU → **PU** |
| trapping, reviewed and left | Gengar-Mega (Ubers), Magnezone (RU), Golem-Alola, Probopass, Meltan (ZU) |

**UU 90 → 91, NU 58 → 63, PU 71 → 68, ZU 254 → 251.** Ubers 63, OU 92 and RU 128
are byte-identical, the ranked total is conserved at **756**, and selectable
species stays 1,138.

**The Chandelure pin is the first one on this programme that is genuinely
load-bearing, and it was measured rather than assumed.** Chandelure-Mega is an
`estimated` forme, so `formeItemsFor` derives its tier from its base — and with
the row removed and the data rebuilt, the estimator lands it on **OU**, not the
UU it already had. Moving base Chandelure NU → UU would therefore have carried
its Mega two rungs with nothing saying so. Contrast `hawluchamega` and
`magearnamega`, where deleting the row changes nothing and a delete-control is
VACUOUS: **here deleting the row IS the correct control**, and it fails properly.

**The rule this refines:** §10 already says a tier change that makes an unranked
forme *ranked* needs a re-diff. This adds the other direction — **changing a
BASE's tier moves every `estimated` forme derived from it.** Aggron and Heracross
were safe only because their Megas are Nat-Dex-ranked (`natdex`, not
`estimated`); Chandelure's was not. Check `tierSource` on every forme of every
species you are about to move.

**The diff came back 11 records: the 9 decisions, plus two that are the pin
working.** Chandelure-Mega's *forme-item* row changed provenance only
(`estimated` → `redgpt-override`, tier unchanged at UU), and its *species* row
moved NU → UU — which **closes** a pre-existing disagreement rather than creating
one, since `species.tier` had been falling back to the base's while the enforced
tier was UU. That is one fewer entry in the §10 "unranked Megas disagree" set.
**Not one of the other 32 estimated forme entries moved.**

**Meloetta-Pirouette was explicitly excluded and left untouched.** The verdict
was that it cannot be meaningfully tiered until Relic Song actually implements
its forme change, which remains unbuilt — and a control now fails if anyone
retiers it. It stays at the RU the NU pass gave it, still refused by the
battle-only gate in every tier format.

**No trapping ability was banned, and a test asserts that across all eleven
formats.** The policy held: balance was handled entirely by moving four holders,
and five were reviewed and deliberately left.

**103 → 107 controls**, **423 → 424 assertions**. Four stale count pins had to be
updated — the Ubers, OU→UU, RU→UU and NU pass tests all carry running arithmetic
across rungs these passes touched, which is the cost of pinning literals and is
still cheaper than a tautology.

### The NU pass, the trapping audit, and the PU packet (2026-08-16)

**Seven entries moved and the estimator did not ripple.** Six NU → RU (Duraludon,
Copperajah, Infernape, Tornadus, Munkidori, Meloetta-Pirouette) and one NU → PU
(Audino-Mega). **RU 122 → 128, NU 65 → 58, PU 70 → 71**; Ubers, OU, UU and ZU are
byte-identical and selectable species stays 1,138.

**Two of the six moved on a RedGPT ability redesign the imported tier could not
have known about** — Light Metal on Duraludon and Heavy Metal on Copperajah, both
entry boosts here rather than weight modifiers. That is the third time this shape
has decided a pass (Metagross was the first), and it is the thing to look for
first in any future one.

**The ripple was measured and was zero, for a reason worth recording.** A full
before/after snapshot of all 1,270 species and all 105 forme-item records shows
**8 changed records and not one more** — the seven tier assignments plus the
Audino→Audinite forme-item row, which is the same decision expressed on the item.
Audino-Mega is the only one of the seven that feeds `estimateFormeTier`'s model,
and it was **already ranked**, so changing its rank moved a datapoint that was
already there rather than adding one. **An unranked forme becoming ranked is the
dangerous case; a ranked one changing tier is not.** `scratchpad/snap-tiers.js`
is the tool, and it normalises `tierSource` to a string first — `species.tierSource`
is an **object** and `formeItems[].tierSource` is a **string**, so a naive diff
compares object identities and reports all 1,375 records as changed.

**Meloetta-Pirouette is a roster classification and nothing more, and the brief
was right to ask.** It carries `battleOnly: 'Meloetta'`, so the validator refuses
it in **all seven tier formats at every tier** — before the change and after it.
And there is **no route into it**: `relicsong` appears nowhere in `src/`, it is
packaged as an ordinary 75 BP Normal special sound move, and
`speciesFormes(Meloetta)` returns Pirouette `available: false` with the generic
fallback text. It is packaged-but-dead, the state §5 records for Terapagos-Stellar.

> **The player's stated design is that Pirouette is reached mid-battle by Relic
> Song, and that banning Relic Song is the escape hatch if it is too strong.**
> That is coherent and matches this project's architecture — but §5's *"ban the
> route, not the Pokémon"* rule has an **item** half (`illegalFormeItems`) and an
> **ability** half (`illegalFormeAbilities`) and **no move half**. Implementing
> Relic Song would need that third gate, or an NU Meloetta could become an RU
> forme mid-battle — the exact `maxTier` hole that blocked the Zygarde and
> Darmanitan-Galar drops. **Not built; recorded as a blocker.**

**The trapping audit came back with nothing to fix, which is the honest result.**
Discovery was behavioural — every ability in the registry defining an `onTrapped`
hook — and it returns **exactly three**: Shadow Tag, Arena Trap, Magnet Pull.
Plus **Guard Dog** (`trapImmune`, victim side), **Shed Shell** (`escapesTrapping`)
and **Ability Shield** (`abilityProtected`).

**All eleven formats already carry `bannedAbilities: []`.** The requested policy —
trapping abilities legal everywhere, balance handled by tiering their users — was
already the live state, so **no legality fix was required**. A test asserts it now,
with a control that bans Shadow Tag in a format and watches the test go red.

Behaviour, all measured through the real engine and cross-checked against a real
`{type:'switch'}` command (**the predicate and the command agreed in every case**):

- **`battle.isTrapped` branch ORDER is load-bearing.** Shed Shell first (so it
  beats Fairy Lock and partial trapping too), then Fairy Lock, then the volatile
  traps, then the **Ghost escape**, then `trapImmune`, then the trapper's hook.
  Ghost therefore beats Magnet Pull **even on a Steel type** — Aegislash walks out.
- **Mold Breaker does not break trapping.** Suppression does: Gastro Acid,
  Neutralizing Gas or the ability being swapped away all free the victim, and the
  trapper switching out or fainting frees it immediately.
- **Every pivot move bypasses trapping** — U-turn, Volt Switch, Flip Turn,
  Parting Shot, Baton Pass, Teleport, all six verified. **And phazing drags a
  trapped Pokémon out**, because forced switches never consult `isTrapped`.
  Those two are the largest counterplay axes and neither is obvious from the
  ability text.

**Two scoping facts that decide what a trapping audit can even do:** of 21
packaged holders, **9 carry a ladder tier** (Gengar-Mega Ubers, Magnezone RU,
Chandelure NU, and Dugtrio / Golem-Alola / Gothitelle / Meltan / Probopass /
Wobbuffet in ZU) and **12 are NFE with no tier at all** — verified refused in all
seven tier formats, so they are Anything Goes only and cannot be tiered.
**No PU entry has a trapping ability**, which is why the trapping audit is a
separate document rather than part of the PU pass.

**`ai.js` keeps a hand-written `TRAPPING_ABILITIES` set** that happens to match
today. It is a second copy of a list the registry already answers — the drift
shape this project keeps finding — so a fourth trapping ability would be invisible
to the AI. Noted, not changed.

**Two new generators, and the naming lesson from cloning one.**
`tools/pu-final-evidence.js` produces `docs/PU_FINAL_EVIDENCE.md` (6,071 lines,
sections A-T: PU 71 profiled, ZU 254 as the downward bar, NU 58 as the upward
bar, 27 scan-flagged candidates with matrices against a 20-strong PU defensive
core). `tools/trapping-audit-prompt.js` produces
`docs/TRAPPING_ABILITY_TIER_AUDIT_PROMPT.md` (991 lines, sections A-S, the
whole-ladder trapping audit).

**Name roster variables for their ROLE, not for a tier.**
`nu-final-evidence.js` was cloned from `ru-final-evidence.js` and kept the names
`RU`/`NU`/`UU` while rebinding them to NU/PU/RU — so its own summary line prints
NU's count under the label "RU". The *document* is correct and the names are not.
`pu-final-evidence.js` uses `SUBJECT`/`DOWN`/`UP` so the next clone cannot
inherit it.

**A control was VACUOUS because it patched a function the feature never calls.**
"Pivot moves start respecting the trap" patched `requestSwitchOut` — which
belongs to Eject Button. **No pivot move calls it**: they set
`side.switchRequest` directly, in **six separate places**. The control passes now
that it patches the self-switch branch. The general shape is the familiar one in
a new costume: *verify the patched code is on the path the test exercises*, not
merely that the anchor matched.

**89 → 103 controls**, and two test guards were themselves wrong before they were
right: a control counted validator errors where one rung down produces two (the
species *and* the item), and a "no verdicts" guard matched any line beginning
with "verdict", which caught the wrapped continuation of an ordinary sentence.

### The tiering programme, and who does what (2026-08-16)

**The division of labour is fixed, and I got it wrong once — worth stating so
nobody repeats it.** The agent's job is to **build the evidence packet**;
**ChatGPT makes the tier calls**; the player authorises implementation. When a
brief says "perform the audit", it still means *produce the evidence*. A packet
must contain **no verdicts and no recommendations** — only mechanical flags,
explicitly labelled as reasons to look.

**Where the programme has got to:**

| Pass | Result | Packet |
| --- | --- | --- |
| OU → Ubers | 3 promoted | `OU_ROSTER_FOR_TIERING.md` |
| OU → UU | 15 dropped | `UU_ROSTER_FOR_TIERING.md`, `UU_FORMAT_AUDIT.md` |
| UU (both ways) | **nothing moved** | `UU_FINAL_EVIDENCE.md` |
| RU (both ways) | **4 promoted, 0 dropped** | `RU_FINAL_EVIDENCE.md` |
| NU (both ways) | **6 promoted, 1 dropped** | `NU_FINAL_EVIDENCE.md` |
| PU (both ways) | **5 promoted, 0 dropped** | `PU_FINAL_EVIDENCE.md` |
| trapping holders (whole ladder) | **4 moved, 5 left** | `TRAPPING_ABILITY_TIER_AUDIT_PROMPT.md` |
| ZU (**upward only**) | **4 promoted** | `ZU_FINAL_EVIDENCE.md` |
| UU → OU (**upward only**) | **0 promoted** — all 91 retained; 7 formes pinned | `UU_OU_EVIDENCE.md` Part I |
| Meloetta / Pirouette | **0 moved** — NU and RU both reviewed and retained | `UU_OU_EVIDENCE.md` Part II |

**Live counts: Ubers 63, OU 92, UU 91, RU 128, NU 63, PU 72, ZU 247** — 756 ranked
entries, conserved across every pass.

**The standard tier ladder audit is COMPLETE.** Every rung has been audited in
both directions except ZU, which is the floor and was therefore one-directional
by construction. ~~The only open tiering question is Meloetta-Pirouette, which is
blocked on Relic Song having no implemented forme route.~~ **Updated
2026-08-17**: Relic Song is implemented, and two packets are now built and
awaiting ChatGPT — **UU → OU** (upward only; the previous UU verdict was reached
at UU 86 and five entries have joined since) and **Meloetta / Pirouette**. Both
live in `docs/UU_OU_EVIDENCE.md`. No tier change has been made for either.

**The trapping audit is deliberately NOT a rung.** It spans Ubers → ZU, because a
trapping holder may need to move several tiers in either direction, so it cannot
be folded into a single-rung pass. Chandelure's NU placement was left explicitly
provisional pending it.

**The RU pass, implemented.** Raichu-Mega-Y and Pyroar-Mega (formes) plus
Regieleki and Metagross (species) went RU → UU. Three of the four moved on a
**RedGPT-specific mechanic the imported tier could not have known** — two were
`estimated` formes, and Metagross's tier predates this project's redesign of
Light Metal into +1 Speed on every entry. That is the shape to look for in every
future pass.

**The estimator ripple is now a standing rule, not an anecdote.** Pinning two
previously-unranked Megas made them datapoints in `estimateFormeTier`'s model
and dragged **four other ZU-based estimated Megas** to UU with them — the pass
moved 8 entries and UU came out at 94 instead of 90. Eelektross-Mega,
Raichu-Mega-X, Scovillain-Mega and Victreebel-Mega are pinned back at RU.
**Any tier change that makes an unranked forme *ranked* needs a full re-diff**,
because the model moves underneath it. A control breaks the pins and watches the
ripple return.

**`tools/lib/profiler.js` is the single profiler** and every briefing reads it.
`tiering-docs.js` used to throw for a name it had never profiled — correct when
it could only relocate text, wrong once a shared profiler existed — so it
derives missing profiles now. That fired for the four RU arrivals.

**Two more vacuous controls were caught and replaced**, which is now four across
the programme. The shapes worth remembering:

- **A staleness control must not regenerate.** "A tier move leaves the packet
  stale" carried `regenerate`, which rebuilt the document to match and left the
  suite green. `rebuild` makes a *generator* patch visible, `regenerate` makes a
  *doc* patch visible, and a staleness test needs **neither**.
- **A fix that only changes behaviour under configurations nothing ships cannot
  be controlled by output.** Control the wiring instead.

### Still open — from 2026-08-16

- ~~**The PU audit and the trapping audit are both mid-flight.**~~ **Both carried
  out 2026-08-16** — 5 promoted PU → NU, 0 dropped, and 4 trapping holders moved.
  See "the PU pass and the global trapping pass, carried out" above. Both packets
  are still current and pinned; they now describe the post-implementation state.

- ~~**473 selectable species carry NO ladder tier.**~~ **Closed 2026-08-17** —
  all 473 placed (RU 1, NU 4, PU 38, ZU 430) and **ZU is the floor** now, so the
  count is zero and a test asserts it as an invariant. See "the untiered audit"
  above.

- ~~**Three newly-packaged Megas sit on unreviewed `estimated` tiers.**~~
  **Closed 2026-08-17** — reviewed and **pinned**: Floette-Mega OU,
  Meowstic-M-Mega RU, Tatsugiri-Curly-Mega RU, plus Delphox-Mega pinned back to
  UU after it rippled.

- ~~**Meloetta-Pirouette is blocked.**~~ **Unblocked 2026-08-17** — Relic Song is
  implemented and the move-forme gate exists. Its RU tier is now a real placement
  rather than bookkeeping, and it is reachable in RU and above. ~~Whether RU is
  the *right* rung for it has never been audited with it actually reachable.~~
  **Packet built 2026-08-17** — `docs/UU_OU_EVIDENCE.md` Part II. No tier change
  made; see the open item above.

- **Silvally's per-Memory evidence exists now** — `docs/SILVALLY_MEMORY_EVIDENCE.md`
  covers all 17 typings with Multi-Attack output, defensive charts and damage,
  which is what the ZU audit said it was missing. **No tier change made.**

- **The superseded note, kept because the constraint still explains the design:**
  Meloetta-Pirouette is blocked, deliberately, and must not be tiered. The
  verdict was explicit: it cannot be meaningfully audited until Relic Song
  implements its forme change, because nothing reaches it. **Do not make it
  directly selectable as a workaround** — a control fails if it is retiered.
  When Relic Song is built, the *move* half of the forme-route gate has to be
  built with it (below), and then it needs a fresh dedicated evidence packet.

- ~~**The ZU audit is mid-flight.**~~ **Carried out 2026-08-17** — 4 promoted
  ZU → PU, no demotions (ZU is the floor). **That completes the standard ladder
  audit**: every rung has now been reviewed. Do not start another balance pass
  without a reason; the packets remain current and pinned.

- ~~**Silvally was held on missing evidence.**~~ **Closed 2026-08-17** — the
  per-Memory packet exists (`docs/SILVALLY_MEMORY_EVIDENCE.md`, all 17 typings
  measured) and the reopened audit **kept it in ZU**. That verdict is final.

- **There is no move half to the forme-route gate.** `illegalFormeItems` covers
  items and `illegalFormeAbilities` covers abilities; a forme reached by a *move*
  is ungated. Inert today — nothing in any tier reaches a higher-tier forme
  through a move — and it is the blocker for implementing Relic Song →
  Meloetta-Pirouette, which the player has said is the intended mechanic. Doing
  it needs the third gate built with it, or an NU Meloetta becomes an RU forme
  mid-battle.

- **`ai.js` hardcodes `TRAPPING_ABILITIES` as a literal set** of the same three
  ids the registry answers for. In sync today; a fourth trapping ability would be
  invisible to the AI's trapping logic. The registry (`onTrapped`) is the source
  of truth — the AI should read it rather than restate it.

- ~~**Chandelure's placement is provisional.**~~ **Settled 2026-08-17** — the
  global trapping audit moved it **NU → UU**. Its Shadow Tag is optional (one of
  four abilities) and it trapped 52 of 58 NU and 118 of 128 RU entries, which is
  why RU was judged too permissive. No longer provisional.

- ~~**The OU → UU pass is mid-flight, waiting on ChatGPT.**~~ **Carried out
  2026-08-16** — 15 entries dropped. See "the OU → UU pass, carried out" below.
  The three briefing documents are still current and are now regenerated by
  `tools/tiering-docs.js` rather than by hand.

- ~~**The UU → OU pass has not been done, and was explicitly deferred.**~~
  **SUPERSEDED, and the correction matters more than the item.** This was
  written during the OU → UU pass and never struck through — but
  `UU_FINAL_EVIDENCE.md` asks **both** directions, including *"which UU entries
  are too strong for UU"*, and returned **move nothing**. So the upward question
  has been asked once. The four *wrong-direction* entries named here — **Mega
  Latias, Mega Gardevoir, Aegislash, Mega Aerodactyl** — were deferred during the
  OU → UU pass and then covered by that audit's upward half, and did not move.
  **What is genuinely un-asked is narrower: the verdict was reached at UU 86, and
  five entries have joined UU since, every one by promotion from below** —
  Regieleki, Metagross, Raichu-Mega-Y, Pyroar-Mega (RU pass) and Chandelure
  (trapping pass). ~~`docs/UU_OU_EVIDENCE.md` Part I is the packet for that.
  **Awaiting ChatGPT.**~~ **CARRIED OUT 2026-08-17 — no promotions.** All five
  new arrivals were reviewed and retained, as were the strong legacy outliers
  (Starmie-Mega, Latias-Mega, Delphox-Mega, Staraptor-Mega, Gardevoir-Mega,
  Aerodactyl-Mega, Aegislash). **The UU → OU direction is now closed.**
  A test still asserts UU is exactly 71 + the 15 that dropped, so a stray
  promotion fails it.

- ~~**The Meloetta packet is mid-flight.**~~ **CARRIED OUT 2026-08-17 — no
  movement.** Meloetta stays **NU**, judged as Aria without the move since Relic
  Song is refused there; Meloetta-Pirouette stays **RU**, and its RU is now an
  explicitly reviewed competitive verdict rather than bookkeeping. The control
  that fails if anybody retiers Pirouette stays, and a second one now moves it
  **down** to NU — the direction that would actually unlock the transformation
  for an NU Meloetta.

- ~~**Seven UU formes sit on unreviewed `estimated` tiers.**~~ **Closed
  2026-08-17** — Dragalge-Mega, Drampa-Mega, Emboar-Mega, Meganium-Mega,
  Scrafty-Mega, Staraptor-Mega and Starmie-Mega are reviewed and pinned at UU.
  **UU carries 0 estimated entries now.** The remaining estimated formes are in
  Ubers (4), OU (9) and RU (7).

- **The shared profiler quotes conditional attacks at full power, ladder-wide.**
  `tools/lib/profiler.js` never consults `moveSpecialFailure`: **457 quoted lines
  across 387 entries**, led by Last Resort (154) at 140 BP, which fails until
  every other move in the set has been used. `tools/uu-ou-evidence.js` annotates
  them and reconciles live against `RandomTeams.AVOID`; **the five sibling
  packets carry the defect uncorrected**, because fixing the shared module
  rewrites the evidence behind five completed audits. That is a decision to take
  deliberately — and if it is taken, all five need regenerating and their pins
  updating in one pass.

- **`skullbash` is missing from `Mechanics.CHARGE_MOVES`**, so Skull Bash is an
  ordinary single-turn **130 BP** physical move here rather than the two-turn one
  the games have — measured at 409 damage to a Blissey on the turn it is used. It
  is the top physical coverage of several UU entries including Starmie-Mega.
  Exactly the shape of item 5 (`iceball`): decide whether it is a divergence to
  keep or a table gap to close, and check nothing else is in the same position.

- **Pecharunt is a monitoring candidate rather than a settled placement.** It
  went to UU on the weakest confidence of the fifteen. Poison Puppeteer
  confuses on *every* poison it inflicts, which is disruptive in a way damage
  numbers do not capture, and it has never been played in UU. Revisit it first
  if UU starts feeling coin-flippy.

- **A tiering profiler must resolve use-time move typing, or it lies about the
  Pokémon the pass is judging.** Recorded because it nearly decided a tier.

  The movepool profiler behind `UU_ROSTER_FOR_TIERING.md` read each move's
  *packaged* type. Ivy Cudgel is packaged Grass and resolves to Fire, Water or
  Rock from the Mask at use time — so all three masked Ogerpons were reported as
  having **no damaging STAB of their mask's type**, when in fact Ivy Cudgel is
  100 BP, physical, crit ratio 2, takes the Mask's 1.2x, and gets full STAB.
  ChatGPT's provisional list leaned on that. The same read also hid Fishious
  Rend from Dracovish's profile via a category filter.

  Fixed by resolving the type the way `battle.moveType` does. The general rule:
  **anything that summarises a movepool for judgement must ask the engine, not
  the packaged row** — the five use-time typing moves (§5), Grassy Glide's
  engine-side +1, and the multi-hit standardisation all make the packaged number
  the wrong one to quote.

- ~~**`stabFor` reads `baseTypes`, so Protean and Libero grant no STAB.**~~
  **Fixed 2026-08-16.** The non-Tera branch now reads the live `types`; the Tera
  branch still reads `baseTypes`, because "did it already have the type it
  Terastallized into" is a question about what it *was*. Both halves are pinned,
  with three controls. The original diagnosis is kept below because the shape
  generalises.

  The retype itself worked — the log reads *"Greninja transformed into the Ice
  type!"* before the move and `pokemon.types` becomes `['Ice']` — but
  `battle.stabFor` asks `pokemon.baseTypes.includes(moveType)`, and `baseTypes`
  never moves. So the ability changes what the holder *resists* and gives it
  nothing offensively, which is the whole point of it.

  Measured in real battles, Mega Greninja into a 252 HP / 252 SpD Great Tusk:
  Ice Beam **223-261**, against **335-392 (×1.50)** with `stabFor` reading the
  live types. The control is in the same run and is what makes it conclusive:
  Hydro Pump and Dark Pulse are **×1.00**, because Water and Dark are already
  base types — only a type Protean *adds* changes.

  It is the §8 declared-but-inert family: §5 lists Protean/Libero under
  "restored to earlier, stronger behaviour (every move)", and the *re-trigger*
  half really was restored, so the ability reads as implemented.

  **Scope of the fix:** four OU entries — Greninja, Greninja-Mega, Cinderace
  (Libero) and Meowscarada — plus Soak, Conversion, Conversion 2, Burn Up,
  Double Shock, Magic Powder, Reflect Type, Trick-or-Treat and Forest's Curse,
  none of which could give STAB before either. Terastallization was unaffected:
  `stabFor` handles `terastallized` / `teraType` on a separate branch, which is
  probably why the gap survived — **the one type change anybody tested was the
  one that already worked**, and its correct-for-its-own-reason use of
  `baseTypes` made the line below it look deliberate.

  **Measured before and after on the same build**, by reverting the one line and
  re-running — the only way to get a comparison that is not confounded by the
  session's other changes:

  | | before (broken) | after (fixed) |
  | --- | --- | --- |
  | trainer vs casual | 69% (81/117) | **69% (81/117)** |
  | ace vs casual | 76% (90/119) | **76% (90/119)** |
  | expert vs casual | 83% (99/120) | 82% (98/120) |
  | ace vs trainer | 62% (73/117) | **62% (73/117)** |
  | expert vs trainer | 71% (85/120) | 70% (84/120) |
  | expert vs ace | 57% (68/120) | **57% (68/120)** |
  | Campaign Normal | 48% (95/200) | 47% (94/200) |

  Ordering monotonic both ways. **Four of six pairings are byte-identical and
  the other two moved by exactly one battle**; Campaign moved by one run in 200
  with run length unchanged at 30.7 nodes.

  **That is the expected result, and the denominator is why: 7 of 400
  random-format teams carry a Protean or Libero holder at all** (7 of 2,400
  Pokémon, 0.29%). The format is very nearly blind to this, the same shape as
  the primal-weather and Psychic-Terrain measurements. So read the table as a
  safety check that nothing regressed — the evidence that the fix *works* is the
  1.5x measurement above with its ×1.00 control, not the ladder.

  **A note on how the before/after was taken, because it bit.** Reverting one
  line and re-running is the honest way to get a same-build comparison, and the
  run was killed by a timeout partway through — which skipped the restoring
  `finally` and left `battle.js` holding the *broken* line. `coverage-controls.js
  --verify` caught it by anchor count. Do not take a patched-build measurement
  without that check afterwards.

- **`species.tier` and `formeItems[].tier` disagree for 18 unranked Mega formes**
  (**re-measured 2026-08-17 after the UU → OU pass**; was 25. The seven UU pins —
  Dragalge-Mega, Drampa-Mega, Emboar-Mega, Meganium-Mega, Scrafty-Mega,
  Staraptor-Mega, Starmie-Mega — each removed one, which is the same alignment
  effect every explicit pin has. The remaining 18 are in Ubers, OU and RU.)
  The original note follows, count and all, because the mechanism is unchanged.

- **`species.tier` and `formeItems[].tier` disagree for 25 unranked Mega formes**
  (**re-measured 2026-08-17**; was 33, then 26. Every explicit pin removes one,
  which is how Chandelure-Mega, Delphox-Mega, Meowstic-M-Mega,
  Tatsugiri-Curly-Mega and Floette-Mega left the set. **Also note the three
  formerly-unpackaged forme targets are packaged now**, so the `Dex.hasSpecies`
  caveat below no longer inflates the count for them.) The original note follows
  because the mechanism is unchanged. **Count it with `Dex.hasSpecies` first**: three forme items
  point at formes this project does not package — Floette-Mega, Meowstic-M-Mega
  and Tatsugiri-Curly-Mega — and `Dex.species()` returns a truthy
  UNKNOWN_SPECIES stub for those (§8), which inflates the count from 33 to 36.
  Those three are worth a look in their own right: an item that is tier-banned
  and then cannot transform is the Magearna-Original trap §5 records.
  For a Mega Smogon has never ranked, the species' own `tier` falls
  back to the *base species'* tier (`generate-data.js` line ~1555), while the
  tier the game actually enforces is the nearest-neighbour estimate recorded in
  the base's `formeItems`. Zeraora-Mega reads **UU** as a species and is
  enforced as **OU**; Lucario-Mega-Z reads RU and is enforced as OU; Heatran-Mega
  reads OU and is enforced as Ubers.

  **Mechanically inert** — `speciesPool` and `tierRoster`'s species branch both
  iterate `Dex.allSpecies`, which excludes transform-only formes, and legality
  goes through `illegalFormeItems`, which reads `formeItems`. **Visibly wrong in
  one place**: `dex-ui.js` prints `shown.tier` in the Pokédex forme browser, so
  a player browsing Zeraora's formes is told Mega Zeraora is UU while the
  Zeraorite is an OU-and-above item. Not fixed: picking which of the two numbers
  is right for 36 formes is a tiering decision, not a cleanup.

- **Run the OU → Ubers pass.** `docs/OU_ROSTER_FOR_TIERING.md` and
  `docs/OU_ROSTER_PROMPT.md` were written for it and are current as of
  2026-08-16. Nothing has ever been *promoted* by `TIER_OVERRIDES`; the 25
  Ubers → OU drops of 2026-08-15 have not been reviewed in play, and
  **Annihilape is flagged in the generator's own comment as "the residual risk —
  first to revisit"**. The briefing's roster block is pinned by a test against
  `Formats.tierRoster('OU')`, so regenerate the tables if any tier moves.
- **Ogerpon-Hearthflame has never actually been played in OU.** It was dropped
  there on 2026-08-15 and only became reachable on 2026-08-16, so its OU
  placement is untested by anyone. Same for Wellspring and Cornerstone, which
  were never Ubers but were equally unplayable.
- **Thirteen of the 33 OU forme entries carry an *estimated* tier** — Smogon has
  never ranked them, so they sit where `estimateFormeTier`'s nearest-neighbour
  model put them. Zeraora-Mega is the loudest: 700 BST, 153 Speed, 157/147 mixed
  offences, in OU on a guess. Worth a deliberate pass of its own.

### Still open — from 2026-08-15

- ~~**Wire up the three Ogerpon Masks as forme items.**~~ **Closed 2026-08-16**,
  and the recorded diagnosis was half wrong — base Ogerpon was not merely gated
  by `requiredItem`, it was **not packaged at all**, dropped for a sprite key.
  See §5 for what landed and for base Ogerpon's legality ruling (RU, and it may
  not wear a Mask there).
- ~~**Tier-gate forme changes.**~~ **Closed 2026-08-16**, and by a different
  route than this item assumed. The fix is not a runtime check in `battle.js`:
  it is refusing the *ability* at team validation, so the illegal forme can
  never be reached in the first place. `Formats.illegalFormeAbilities` does it,
  and §5 records the one condition — the base must have another usable ability,
  or the ban deletes the Pokémon rather than restricting it.
  **This unblocks the Darmanitan-Galar and Zygarde drops**; neither has been
  made, but the obstacle is gone.
  The original text, kept because the reasoning still explains the constraint:
  `maxTier` is checked only when validating a team,
  never in battle, so a lower-tier base freely transforms into a higher-tier
  forme. This blocks the Darmanitan-Galar and Zygarde tier drops, and is the
  prerequisite for any future drop of a species whose forme outranks it.
  **Checked against the current OU roster on 2026-08-16: nothing in OU exploits
  it** — no OU entry reaches an above-OU forme through an ability. So it is a
  latent hole rather than a live one, and it still blocks those two drops.
- **Re-measure campaign balance.** §6's numbers predate the format rebuild, the
  tiering revision, the Arceus/Silvally collapse and the Tera restrictions. They
  are stale. **Still stale after 2026-08-16** — this session added a species and
  three items, so it is another content change on the pile rather than a reason
  to trust the old table.
- **Consider whether Terapagos-Stellar and the Ogerpon Tera formes should be
  reachable at all**, or stay packaged-but-dead. Making them reachable means
  implementing a Terastal-to-Stellar step and an Ogerpon Tera step. **All five
  are now consistently gated** (2026-08-16) rather than two of five, so the
  decision is a clean yes/no rather than a cleanup.

### What was built (2026-08-16 — the Ogerpon line, and the OU briefing)

**The whole Ogerpon line is playable** (§5). Base Ogerpon recovered from a
sprite-key drop, the three Masks wired as forme items with their 1.2x
implemented, the remaining three Ogerpon Tera formes gated, and base Ogerpon's
legality settled at RU with the Masks refused below OU.

**The `itemUser` warning stopped calling eight supported forme routes useless**
(§8), including five that predate the Masks. Found by reading the Team Builder
screen, where the note contradicted the card underneath it.

**`tools/coverage-controls.js` grew two capabilities**, because the Ogerpon work
could not be controlled without them and an uncontrolled test is not evidence:

- **`suite`** — a control can now name which suite holds its test
  (`engine` / `data` / `teams`). It was hardwired to `engine-battle.js`, so
  anything pinned in `data-validation.js` was structurally uncontrollable.
- **`rebuild`** — a control that patches `tools/generate-data.js` regenerates
  `data/**` before running and again on the way out. Without it a generator
  patch changes nothing the suites can see, which is a control that runs and
  proves nothing. The build is 1.5s and reproducible.
- **`--verify` now regenerates the data as well as checking the anchors.** A
  `rebuild` control opens a window where a hard kill leaves every source file
  clean and the packaged data written from a broken generator, which no anchor
  check can detect. Regenerating unconditionally closes it.

34 → **46 controls**, 392 → **400 assertions**.

**`docs/OU_ROSTER_FOR_TIERING.md` and `docs/OU_ROSTER_PROMPT.md`** — the reverse
of the 2026-08-15 tiering pass: a briefing giving ChatGPT the current OU roster
so it can say what should move *up*. The roster block is generated from
`Formats.tierRoster('OU')` and **pinned by a test** that compares it to the live
roster, with a control that moves a tier and watches the doc stop matching. A
tiering brief its reader cannot check is worse than none, because every
conclusion drawn from it inherits the error.

### What was built (2026-08-15 — formats, tiering, and the Team Builder forme preview)

**The format list was rebuilt around the tier ladder** (§5). Five formats
removed — Level 50 Singles, Restricted Singles, Battle Tower, Anything Goes
(Tiered) and Standard Singles — **OverUsed is the default**, and two Tera
variants were added. Only Anything Goes, Ubers (Tera) and OverUsed (Tera) allow
Terastallization.

**The validator never enforced the tier ceiling** (§5). `speciesPool` filtered on
`maxTier` but the validator did not, so a Mewtwo validated cleanly in OU, UU and
ZU. Invisible while Standard was the default; the whole ruleset once OU took
over.

**`TIER_OVERRIDES`** (§5) — the AG rung emptied, then 25 Ubers entries dropped to
OU. Four Megas pinned so the estimator could not drag them down with their bases.

**One Arceus and one Silvally** (§5). The typed formes are a held item, not a
species choice. `random-teams.js` gained `FORME_TYPE_ITEM_POOL` so a generated
Arceus still rolls a Plate and keeps its type variety.

**The Team Builder draws the forme its held item produces** (§5) —
`Mechanics.heldForme` and `formeAbility`, shared with the Campaign menu and the
Pokédex, so a Charizardite Y Charizard shows Mega-Y's sprite, BST and Drought.

**The Pokédex gained a forme browser and the Teams screen a tier browser**
(`Formats.tierRoster`, strictly one rung, Megas under their own tier).

**Tera Blast and Revelation Dance** (§5) — Tera Blast had no implementation at
all; both now take their category from the user's dominant attacking stat.

**A Red Card crash** (§8), found by the Rebirth probe rather than a test.

### What was built (2026-08-14, third pass — full ability and item coverage)

**The last 26 unsimulated abilities and items were implemented** (§5, §9, §10
item 4c). `Abilities.coverage()` goes 281 → **294 implemented with 0 missing**,
`Items.coverage()` 297 → **310 implemented with 0 missing**. Nothing in the game
is labelled "not simulated" any more.

**Delta Stream got its project-decided second effect and the primal-weather
ruling it needed.** It keeps strong winds *and* deletes the active weather on
entry — and it is the one entry ability that beats Desolate Land and Primordial
Sea, while Cloud Nine and Air Lock still cannot. The rule §5 records is the
durable part: primal weather yields only to a member of the primal trio, or to
something that costs its user a once-per-battle resource (which is why Teraform
Zero also qualifies).

**Three doubles-only abilities were redesigned rather than left inert** — Curious
Medicine resets the *foe's* stat stages, Hospitality heals the most injured
teammate on the *bench*, Supersweet Syrup fires on every entry. Same call as
Pickup and Zero to Hero. §9 now records the line that separates these from
Propeller Tail and Stalwart, which stay inert because redirection has no singles
analogue at all.

**Two bugs found in passing, neither caused by this work:**

- **Mummy had no exclusion list** despite its own packaged description stating
  one, so it would have overwritten Stance Change, Multitype and every other
  forme-defining ability. It now shares `abilitySpreader` with Lingering Aroma
  and consults `UNCOPYABLE`.
- **`healBerry` read the *holder's* item id to pick its threshold**, which is the
  wrong Pokémon for a force-eaten Berry. It is a parameter now, with Sitrus and
  Oran unchanged. Oran's packaged text also disagreed with the engine (1/2 vs
  1/4); the behaviour was left alone and `ITEM_OVERRIDES` now states the truth.

**Three AI mirrors, per the `docs/AI_DESIGN.md` §1 rule.** `estimateDamage`, the
AI's Gravity valuation and `Advisor.FLOATS` all matched Levitate **by name**;
all three now ask the registry's own `ungrounded` declaration, so Eelevate is
priced and a fourth floating ability needs no edit. `estimateDamage`'s Levitate
line also ignored Thousand Arrows and `ignoreImmunity`, so it reported 0 for
moves that really land — fixed with it. Strong winds and Mega Sol needed no
mirror at all: they live in `battle.effectiveness` and `battle.weatherFor`, which
the AI and the calculator already read.

**The Pokédex gained the Campaign forme browser** (§5), so Mega formes are
reachable there for the first time — with their own typing, stats, abilities and
matchups. Two bugs surfaced with it: the Campaign forme toggle showed the set's
ability beside another forme's stats, and the Pokédex ability modal reported
"0 species can have it" for every Mega-only ability, including the six added
this session.

**A Red Card crash, found by the Rebirth probe rather than by a test** (§8). A
rampage dragged off the field mid-move decremented a lock `clearOnSwitch` had
already deleted, and the run died. Fixed, with a regression test whose control
restores the crash — and `balance-probe.js` now prints a stack per failure,
because the message alone named nothing.

**23 new assertions and `tools/coverage-controls.js`**, a 30-control harness that
breaks each implementation on purpose and asserts the matching test goes red.
Three of the 21 tests failed on their first run and all three were real: one hit
§8's HP-capping trap (Blissey's 651 max HP truncated the "full damage" reading),
one asserted against a hand-run hook where the real entry path had already fired
the item, and one measured 6 of 10 because four status Berries were force-fed
into a position with no status to cure. The suite now runs 384 assertions.

### What was built (2026-08-14, second pass — Rebirth Mode)

**Rebirth Mode** (§5, §6) — a button on a cleared run that starts a new run
inside it, carrying the party and relics and resetting everything else. Every
Trainer, Elite and boss fields a complete six built from a `TEAM_PLANS` row,
plays at Expert whatever the difficulty, and opens with that plan's doctrine
already on the field. Recruits gain a theme selection; rewards are richer.
Measured at **26% on Normal** against the base game's 42%, full run length,
deaths concentrated in the last Act.

**A third weather-persistence state** (§5). `ENDLESS` is `Infinity`, which every
`> 0` read and every `--x <= 0` tick already handles, so the effect never expires
while every removal path keeps working unchanged. Primal weather's persistence
without primal weather's lock, which was the stated requirement.

**Trick Room, Magic Room and Wonder Room end when used a second time**, as in the
games — the counterplay an endless room needs, since nothing else removes one.
The AI values the cancel at the negative of what setting it would be worth, behind
`level.predicts`; measured 12/12 correct at Ace and Expert with a fast team and
0/12 at Casual and Trainer as the control (`docs/AI_DESIGN.md` §8).

**Every boss declares a `teamPlan`** (§5), which closes the open item asking for
it, and a ninth team plan (**Sandstorm**) was added so `sandlord` had a row to
declare.

**Fifteen new assertions across three suites, and a fourteen-control harness**
that breaks each fix on purpose and asserts the matching test goes red. All
fourteen confirmed. Two tests and two controls were vacuous first (§8).

**Five requested changes landed alongside it** (§5): the status Orbs fire on
entry; `battle.residualSwing` gives the AI a model of chip healing, which it
reads for Protect; the AI knows how long Rest lasts and what Sleep Talk is for;
Rest earns credit for the status it cures; Focus Punch loses its -3 priority;
and the Battle Shop offers a Ring Target to a Pokémon a single type immunity
blanks. `ITEM_OVERRIDES` and `MOVE_OVERRIDES` gained the matching descriptions
and the data was rebuilt.

**A note on where the bugs were.** Of the two reported from real logs this
session, one was real (Rest ignoring the status it cures) and one was not — the
Dondozo that did not Rest simply did not have Rest. That is the third time §8's
rule has paid out: **check what the Pokémon was actually carrying before
suspecting the chooser.**

**The base game was re-measured as a control and has not moved**: base Normal is
41% on every figure (§6).

**README corrections made in passing**, both of which a reader would have been
actively misled by: it still said "Mega Evolution is not an in-battle mechanic:
Mega Stones are inert", which §5 reversed some time ago, and it listed the save
schema as v3. It also had no held-item redesign table beside its ability one,
so Ring Target and the Orbs were undocumented there; there is one now.

### What was built (2026-08-14 — two reported bugs, and the balance re-measure)

**Five moves take their type from the user, and all five were broken** (§5).
Reported as Revelation Dance alone; the check the report asked for found the
same hole in Judgment, Multi-Attack, Techno Blast and Aura Wheel. The three
plate/memory/drive moves had a branch that named them and read
`return move.type` — the fallback's own behaviour — so they looked handled and
resolved to Normal, losing STAB as well as the type chart. Pinned by five tests
in `tests/engine-battle.js`, each with a control confirmed to fail on its own
assertion (Revelation Dance neutered, species typing instead of live types, the
item branch disabled, the `zMove` guard removed, the Hangry branch removed).

**The Tacticians and Paragons unlocks are reachable** (§10 open item 2).
`campaign-ui.js` now passes `automated: !view.playerActedManually` to
`Campaign.resolveBattle`. **The test for this had to be a jsdom test**: the flag
is decided at the UI call site, so an engine-level test of `resolveBattle` would
have passed with the bug fully present. `tests/ui-smoke.js` plays the first
battle of a run with nothing touched by hand — handing over at Team Preview,
since confirming the lead yourself counts as acting — and asserts the flag
survives; a second assertion checks a hand-played battle still clears it, so
hardcoding `automated: true` fails too. Both controls were confirmed.

Fixed in passing: `autoBattleStep` read `side.ai` where `side` is an *index*, so
the `finally` that claims to restore the tier always fell to the delete branch.
Inert today (a controlled side is human and has no `ai`) but the guard did not
do what its comment said.

**The AI inspector** (`AI.explainChoice`, docs/AI_DESIGN.md §6) — an **AI view**
button in the battle controls that shows the AI's own scoring for the player's
position: a score per move with the damage, effectiveness, real accuracy and
setup valuation behind it, the three facts most branches hang off (turn order,
incoming hit, dying), and the bench ranked by matchup. Read-only and proven so:
a test calls it 25 times and asserts both RNG streams and the log are unchanged.
Its first use confirmed a live report — the repeated Outrage scores **−500**,
so the AI never chose it and the repeat was the rampage lock.

**Assist Mode learned to recommend recruits, and gained team plans** (§5).
Eight plans in `CampaignContent.TEAM_PLANS`, a picker in the Assist panel, and
plan-aware advice across recruiting, releasing, abilities, items, TMs, tutors
and rewards. The reasoning renders on the page rather than in a tooltip.

**Two of its tests were vacuous and the controls caught both**, which is the
part worth remembering. The Trick Room test passed with the Speed term deleted
entirely, because the fixture's slow candidate also happened to carry two Trick
Room payoff moves — it was proving payoff scoring worked. And the
"never release the sole enabler" test passed with the guard deleted, because the
enabler was a Politoed that outscored every filler anyway, so the advisor would
never have suggested releasing it. Both fixtures were rebuilt until the control
failed: neither candidate carries a payoff move, and the sole enabler is now a
Sunkern holding Rain Dance beside two 600-BST attackers.

**Oricorio-Pa'u recovered** (§9) — a forme-key normalisation bug in
`tools/generate-data.js` dropped it despite both sprites existing. 1268 → 1269
species. The Shell Smash scoring cliff **characterised** (§8) and deliberately
left alone. The **Cry Volume slider is disabled and dimmed when cries are off**
(`label.field.is-disabled` in `styles.css`), which closes the one defect the
2026-08-14 visual pass found.

**Campaign balance re-measured** (§6) — 46 / 33 / 15 against targets of
35 / 20 / 8, all three up 6-8 points from bundled content changes rather than
from any difficulty dial. Not retuned: that is a deliberate decision, and the
only lever with enough force overshoots.

**The agent can screenshot the preview pane again** (§8), which reverses a
standing constraint — every visual item on the outstanding list was verified by
eye this session, on a scratch server on port 8124 whose separate origin gives
it its own empty save.

### What was built (2026-08-13 — AI judgement, log, and four Campaign changes)

**AI: two new questions, and two intuitions disproved.** Stop boosting once the
move in hand already knocks the target out, and spend a doomed Pokémon's last
action on damage rather than on utility it will not live to collect (§5). Both
measured to change real decisions and pinned by tests. The "boosted and surviving,
so hold position" rule and a type-resistance bonus in `matchupScore` were both
written, measured to change **zero** of thousands of decisions, and removed —
along with the discovery that the first sweep built to test them produced no
switches at all (§5, §11).

**The battle log reads newest-turn-first and starts collapsed**, with a Full
log / Collapse toggle. Turn *blocks* are reversed but the lines inside them are
not, so a turn still reads forwards. The end screen forces it expanded. Structure
is asserted in `tests/ui-smoke.js` — the layout itself is unverifiable by the
agent (§8), so the DOM assertions are the only check, and they were confirmed to
fail on purpose.

**Scout's Tally**, the first stackable relic (§5): +1 reroll immediately and per
Act, up to three copies.

**Rest Sites forage instead of reorganising held items** (§5). The `items` prompt
and its renderer were deleted rather than left unreachable.

**Rare Encounter nodes** (§5) — a single fully-built Pokémon, 30% of the time a
legendary, mythical, Ultra Beast, Paradox or pseudo-legendary. Defeating one gives
a **guaranteed offer of the exact Pokémon fought** (originally 1 in 3), the project's one
deliberate exception to the recruitment tier gate (§5) — legendaries and mythicals
included. Pinned by a test in `tests/campaign.js` carrying controls for both
"always offered" and "never offered".

**Recruitment fixed for long runs** (§8) — the BST-band fallback was collapsing to
the bottom of the pool on runs of four or more Acts.

**Six moves and abilities lost conditions the opponent controlled** (§5): Dream
Eater no longer needs a sleeping target, Poltergeist no longer needs a held item,
and Thief / Magician / Pickpocket steal into an occupied item slot. Covet keeps the
restriction deliberately. Fixed in passing: **Magician and Pickpocket never
consulted `canRemoveItem`, so Pickpocket could steal a Mega Stone** — both now
route through one `stealHeldItem` helper that guards both directions.

**Pickup implemented** (§5), redesigned from the doubles-only ally recovery it was
inert as: on entry it takes the last item *destroyed* in the battle. Berries and
merely-changed-hands items are excluded — the latter because recovering a stolen
item would put two copies of it in play. Abilities coverage 280 → 281 implemented,
23 → 22 inert.

**Branching evolutions are chosen by the player** (§6), for both level-up and
two-stones cases. Previously decided by @pkmn's data order, invisibly.

**A measured tier list, twice** (§11). v1 ranked 1,177 selectable formes by 1v1 duel
win rate over 142,800 battles. Compared against Smogon's SV tiers — which ship in
`@pkmn/dex`, so the check is offline — it correlated 0.517 and matched 19%. Their
Tiering FAQ explains why in one line: one-on-one win rates are unreliable because
Pokémon battle in teams where support roles matter. v2 rebuilt it around their
reasoning: marginal contribution to a team measured three-a-side, NFE unranked, LC
measured separately at level 5, and tier sizes shaped from Smogon's real distribution.
Exact agreement 19% → 29%, NFE/LC 0/331 → 331/331; correlation slipped to 0.488 and
the role Pokémon did not move.

**All of it was deleted later the same day** (§10 open item 0) — the player is
rebuilding the tier list from scratch. Kept here because the *findings* outlived the
tool: v3 established that the v2 ranking was about a third noise (score error 8.98
points against middle tiers 3.46 points wide), that "the role Pokémon did not move"
was therefore mostly sampling error rather than a flaw in the metric, and that 6v6
with full-range opposition — the experiment v2 left as its recommended next step —
calibrates fine but ranks *worse* than three-a-side for 2.5× the cost. Anything that
replaces this should start by measuring its own reproducibility.

**Two generator bugs, both found *by* the tier list** (§8): the coverage list was
type-filtered only once before its loop, so Mewtwo was built with two Fire moves and
no Psychic STAB; and Future Sight's 120 BP made it the highest-rated Psychic move in
the game despite landing two turns later. Duplicate attacking types across generated
sets fell 21% → 10%.

**Fling fixed** (§5) — it never consumed the thrown item, and its four declared
landing effects (`fling.status` / `fling.volatileStatus`) were read by nothing. A
Mega Stone was also flingable, which consumption would have destroyed.

**A force-eat path for Berries** (§5), which closes the §9 gap and lands four
mechanics at once: **Bug Bite** and **Pluck** implemented from nothing, **Stuff
Cheeks** and **Tea Time** fixed from consuming a Berry for no effect, and a flung
Berry now eaten by its target. Tea Time also reaches both sides rather than only the
user. The cause was structural — every Berry fused its trigger to its effect — so
Berries in `items.js` are now defined through `eatableBerry(trigger, effect)`.

**Generated sets can carry a priority attack** (§8) — four of the five unconditional
priority moves were unreachable, measured 0/40. Traced from a battle log where the
suspicion fell on the AI and the AI was innocent. Also **`tools/ai-ladder.js`**, so
the mirrored AI tier numbers in §10 are reproducible instead of hand-measured.

### What was built (2026-08-12, fifth pass — Campaign balance re-measured)

Closes §10 open item 2. The numbers are in §6; this is what moved and why.

**The probe was measuring itself, not the game.** Three policy defects, fixed
before any balance change so the retune was not compensating for a bad player
(§8): every move-learn prompt was skipped, tutors were never used, and the run
re-attacked the node that had just killed it. Normal went **11% → 22% with no
engine change**. `balance-probe.js` now takes a policy argument
(`advisor` default, `basic` for the old behaviour) and reports a
`moves taught / declined` control so a policy that is not playing the game is
visible rather than assumed.

**`bossTeamPenalty` was inert and it was the binding constraint.** Subtracted
inside a clamp, it did nothing for any party of five or more (§8), so Normal's
advertised "bosses field one fewer" never applied at the bosses that matter.
Applying it after the ceiling was the single largest change measured: at that
point in the tuning it took Master's boss win rate 32% → 52% and its clear rate
0% → 5%, after two earlier rounds of healing and level changes had moved it not
at all. (Figures in this entry are the effect of each individual change at the
time it was made — the shipped totals are in §6.)

**The early-run level ramp now covers most of Act 1** instead of its first three
nodes (§8 records the measured cause). This fixed Master's *shape*: 147 of 200
runs died in Act 1 before, 18 in the shipped configuration, and average run
length went 11.8 → 24.8 nodes, so Master runs now actually reach Act 2 and 3.

**Difficulty steps were compressed.** Each rung had stacked five or six
simultaneous nerfs — Veteran vs Normal was +2 levels, one fewer Beacon, an extra
boss Pokémon, every AI tier promoted, healing 60%→42% and revive 40%→28% at
once, which is why Veteran and Master were both pinned near 0%. Beacons, level
offsets, healing and revive fractions were all re-spread; see §6 for the final
values and §5 for the Beacon arithmetic that constrains them.

**Also found and recorded, not fixed:** the three authored Act 3 bosses are
unreachable at the default run length (§9), and a test asserting the run-setup
Beacon default was written, shown to be tautological, and deleted (§8).

Balance-relevant files touched: `tools/balance-probe.js`,
`src/campaign/content.js` (difficulty rows), `src/campaign/run.js`
(`buildBossTeam`, `rampOffset`), `src/ui/campaign-ui.js` (Beacon field default).
No save migration is needed — an in-progress run stores its own Beacon count and
`run.setup.beacons`, so neither its life total nor its challenge scaling changes
retroactively.

### Closed 2026-08-12 — the audit-tooling items

Kept here because the *diagnosis* was partly wrong and the corrected version is
worth not rediscovering.

- **The item sweep could not fail.** The recorded cause was
  `field.weatherSource`, a `Date.now()`-derived uid, leaking into the state
  snapshot. That was real but secondary. The dominant cause was that the
  snapshot included `p.item`: the with-item and without-item runs differed on
  the *held item itself*, on the very first scenario, before any effect was
  considered. The previously recorded result "with the uid stripped, all 198
  items still pass" was therefore still measuring the vacuous thing. With both
  causes fixed, 17 items are unproven and need checking (open item 1).
- **Abilities had no behavioural sweep.** There is one now, across all 270.
- **Mechanics table ids were unvalidated.** `fickelbeam` is fixed to
  `ficklebeam` *and* Fickle Beam's 30%-chance-to-double-power is now implemented
  in `dynamicBasePower` (it really was a flat 80 BP). `maxguard` is gone from
  `PROTECT_MOVES`, and `battle.js` now uses that table instead of the drifted
  inline duplicate it had been carrying. `tests/move-coverage.js` fails on any
  unresolvable id.

### What was built (2026-08-12, fourth pass — AI decision quality)

Driven by a real battle log the player brought in: Kingambit had Haxorus in
Sucker Punch range, threw a slower move and died before it resolved.

**The resolve rule** (§5) — three separate places assumed a move happens.
**Real accuracy** (§5) — `hitChance` asks the engine, so Thunder is 100% in rain.
**Sacking and preserving** (§5) — the switch threshold used to *drop* when dying.
**Contact punishers as assets** (§5) — Flame Body is a reason to switch *in*.
**Hazards and status judged against the whole enemy team** (§5).
**Tera as a moment**, including defensive Tera and declining the bait (§5).
**Fast versus slow pivots**, and Shed Tail priced separately (§5).
**Setup payoff** with item synergies — Focus Sash, White Herb, Sitrus (§5).
**Dynamic base power in the move request** so the button shows 200, not 50 (§5).
**Supply Drop** replaces the duplicated Field Treatment reward (§5).

Also fixed: recruiting into a full party blanked the run screen, because
released Pokémon left their prompts behind (§8).

### What was built (2026-08-12, third pass)

**Meta unlocks became data** (§5) — `CampaignContent.UNLOCKS`, with three new
tracks: Ascension level reached, Acts chosen, and lifetime Pokémon recruited.
Five new starter pools (Ascendants, Apex Predators, Wayfarers, Sprinters,
Menagerie) and six unlockable relics. The run-setup screen lists every unlock
with the hint for earning it and the player's lifetime totals.

**A full party is offered recruits again** (§5), at a reduced rate, always
declinable.

**Multiple Campaign run slots** (§5), save schema v4 with a migration.

**Setup-move evaluation** — `AI.setupValue` replaces a "am I comfortably
healthy" guess with four questions: does the move work at all (Belly Drum below
half fails), do I survive the turn I spend (Focus Sash, Sturdy, Multiscale, and a
berry the move's own HP cost triggers), does the boost convert (applied
temporarily, then damage and turn order re-measured), and can it be taken away
(phazing, Taunt, priority revenge, Unaware). Items are read throughout: White
Herb makes Shell Smash's drops free, Focus Sash guarantees the turn, Sitrus pays
Belly Drum back when max HP is even.

**In-battle stat breakdown** — an expandable panel on each mon card listing every
modifier acting on Atk/Def/SpA/SpD/Spe with its multiplier, not just boost stages
(§5). Covers all 24 stat-modifying abilities, all 13 stat-modifying items, the
Ruin quartet, Wonder Room, paralysis and Tailwind.

**The Pokédex stat block got the same toggle as the Campaign menu** — species
base stats, or raw stats at level 50/100 with a neutral nature, 31 IVs and no
EVs, stated in the caption rather than left to guess. The mode persists across
entries so two species can be compared at the same level.

### What was built (2026-08-12, later the same day)

**Campaign drops EVs entirely** (§5), with a load-time HP re-clamp for runs saved
before it.

**Every forme is reachable by its proper route** (§5). Held transformation items
(Red/Blue Orb, Rusted Sword/Shield, Griseous Orb/Core, Adamant Crystal, Lustrous
Globe) plus ten ability-driven forme changes that had never been implemented.
Campaign shops and rewards offer the transformation items the party can use, the
advisor scores them, and `Items.coverage()` reports them honestly.

**Two project-authored items** — Hero Charm (Palafin, replacing Zero to Hero's
switch-out trigger) and Warp Prism (Trick Room 5 → 8 turns).

**The Pokémon menu** shows nature with its ±stats, current *and* base stats, and
a toggle across every forme in the family with its sprite, typing and BST.

**AI awareness** (§10 open item 3, largely closed):

- *Move preconditions* — asks `battle.moveSpecialFailure` rather than keeping a
  second copy of the rules, so the project's own versions apply. Focus Punch used
  to be handled separately here (scored −800 unless behind a Substitute, because
  at choice time nothing has hit yet); **that penalty was removed on 2026-08-13
  when Focus Punch lost its condition** (§5). `AI.selfDefeating` still exists but
  now matches nothing — kept because the shape is the reusable part: a move whose
  failure depends on what happens *between* the choice and the execution cannot
  be caught by `willFail`, and that is where it goes.
- *Turn order* — `movesFirst` replaces a bare Speed comparison, honouring
  priority, ability priority modifiers, Grassy Glide's engine-side +1 and Trick
  Room. Priority is now valued most exactly when the Speed race is lost, and not
  at all when Psychic Terrain will refuse it.
- *Items* — Choice lock, Assault Vest (status moves are unselectable), Life Orb
  recoil at low HP, Focus Sash / Sturdy / Multiscale / Disguise / Ice Face in an
  `effectiveHP` estimate, status-curing berries, Flame and Toxic Orb.
- *Abilities* — contact punishers, status-wanting abilities (poisoning a Guts
  holder), Magic Bounce and Good as Gold, Regenerator making pivots cheap,
  trapping abilities making them impossible.
- *Hazards* — priced per-Pokémon (`hazardCost`) rather than by layer count, so a
  Heavy-Duty Boots switch-in is correctly free; setting them is valued by how
  much of the opposing bench they will actually bite, whether the foe still has
  removal, and how much switching this team forces.
- *Pivoting* — status pivots (Teleport, Parting Shot, Baton Pass, Chilly
  Reception, Shed Tail) were not scored as pivots at all. Now valued by the
  landing matchup net of hazards, with Baton Pass keyed to stored boosts and
  Volt Switch refusing a Ground type.
- *Field effects* — terrain scored by what the team collects from it and by the
  status/priority it blocks; Trick Room by how much of the team is slow; Gravity,
  Wonder Room and Magic Room scored at all for the first time.
- *Team composition* — `archetypeOf` classifies a side as hyper offense, stall,
  weather or balance and identifies leads, suicide leads, weather leads, walls,
  sweepers and breakers. Drives lead choice at Team Preview and weights hazards,
  setup and weather.

Measured on mirrored random teams, ~60 battles a pairing: Expert 71% vs Casual,
74% vs Trainer, 64% vs Ace; Ace 77% vs Casual; Trainer 54% vs Casual. The ladder
is still correctly ordered. Trainer vs Casual is the weakest separation and is
worth revisiting.

### What was built (2026-08-12, audit session)

**`tools/audit.js` rebuilt around controls.** Five sections, each with an inert
control fixture; non-zero exit if any control is not flagged (§11). Shared
uid-scrubbing `snapshot()`, per-turn `battle.trace`, and cross-run diffs that
exclude what differs by construction while keeping its consequence.

**A behavioural ability sweep** across all 270 implemented abilities — fifteen
scenarios covering entry, attack, defence, status, residual, fainting, switching,
a set field, every type and every move flag, plus a `derived` probe that reads
computed values (stats, effectiveness, priority, accuracy, trapping, immunity)
for the modifier abilities that never write state. Took the unproven count from
131 to 56 as scenarios were widened.

**Fickle Beam implemented.** `DYNAMIC_POWER_MOVES` held `fickelbeam`, a typo, and
`dynamicBasePower` had no case for it either, so the move was a flat 80 BP.
`maxguard` removed from `PROTECT_MOVES`, and `battle.js` now uses that table
rather than the inline duplicate it had drifted from.

**Preview mode for `dynamicBasePower`** (§5) — AI scoring and the damage
calculator no longer draw from the mechanics RNG, write to the battle log, or, in
Present's case, heal the opponent while merely *considering* a move.

**Tests:** every Mechanics table id must resolve; `BattleConstants` must not
drift from `Mechanics`; Fickle Beam's doubling; previewing never mutates. 232 →
237 assertions.

### What was built (2026-08-11 → 2026-08-12)

**Correctness auditing.** A large sweep using the method in §11 found and fixed:
inverted Foresight/Odor Sleuth, unimplemented Miracle Eye, Thousand Arrows vs
Flying, Prankster's Dark immunity, seven moves whose packaged `secondary` is an
empty object (Ceaseless Edge, Stone Axe, Anchor Shot, Spirit Shackle, Diamond
Storm, Dire Claw, Eerie Spell), Fake Out and First Impression never working at
all, Shed Tail, eleven declared-but-inert abilities/items including the four Ruin
abilities, Air Balloon not blocking Ground, and Destiny Bond's old repeatable
behaviour.

**Move targeting.** `executeMove` passes the foe as `defender` for *every* move,
including the user's own. Good as Gold blocked every status move on the field
because of it. Fixed with the `aimedAtFoe` gate (§5).

**Ability restoration + redesign project.** The table in §5 / the README: Magic
Guard, Parental Bond, Gale Wings, the `-ate` family, Transistor, Disguise,
Protean/Libero, Intrepid Sword, Dauntless Shield, Battle Bond, the Mold Breaker
family, plus the Supreme Overlord / Download / Cloud Nine / Air Lock redesigns.
Trace's uncopyable list did not exist and now does.

**Mega Evolution** as a real mechanic, **Terastallization in Campaign**, and the
`transformOnly` species split (§5).

**Assist Mode** for Campaign — recommendations and AI battling (§5).

**Campaign systems** — player-chosen run length and Beacons with exponential
difficulty scaling, `runProgress` replacing Act number as the difficulty clock,
tiered recruitment (no more Arceus in Act 1), the Poké Mart replacing the Item
Fitter, releasing party members, and two Assist-clear unlocks.

**AI difficulty** — the ladder was inverted (Expert lost to Casual 34-66) because
switching was unpriced. Now Expert beats Casual 72% with every rung separated
(§5, §8).

**Field VFX** rebuilt on two rules: weather is air, terrain is floor; particles,
never stripe gradients (§8).

**Ability-aware move display** — move type *and* effective base power now reflect
the holder's ability everywhere a move is shown.

**Damage Calculator tab** — drives the real engine, never a second copy of the
formula, with a residual-aware KO summary (§8).

**Fixed from live play:** Campaign level-ups no longer drop a full-HP Pokémon
below full; an 8-Act run no longer blanks the screen at Act 4; Mega Stones the
player already owns are no longer re-offered.

## 11. Auditing beyond `npm test`

```bash
node tools/audit.js                                        # every section
node tools/audit.js species moves abilities abilityflags items
```

Not in `npm test`: it is slower and the species section compares against live
`@pkmn`, which moves. It takes about 8 seconds.

**Every sweep carries a control, and the controls are the point.** Each section
injects a deliberately inert fixture — a hookless ability, a hookless item, a
move declaring a boost of zero, a species with a wrong bst — and asserts the
sweep flags it. The run ends with a `=== CONTROLS ===` block; if any control
slipped through, it prints `VACUOUS` and **exits 1**. A sweep that reports "0
findings" has told you nothing until you have seen it fail on purpose.

This is not theoretical. Every one of these was caught by a control while this
tooling was being written:

- The item sweep passed a hookless control for two independent reasons at once
  (§10, closed items).
- The first item control was **Abomasite** — and Mega Stones are a real mechanic
  handled outside the item registry (§5), so it was correctly *not* inert. Pick
  a Poké Ball: nothing in a battle can read one.
- An earlier item control was an id that is not in the packaged data, so
  `normalizeSet` dropped it and the control was never actually equipped. It
  "passed" while never being held. Assert the fixture is really in play.
- The moves control passed because the snapshot included per-move bookkeeping
  volatiles (§8), which change on every move.

**A sweep must report how much of the behaviour it actually exercised.** The
switch sweep written to test an AI rule produced **0 switch decisions in 2,400
calls** and dutifully reported "no difference" for every variant tried — because
`switchThreshold` is a matchup margin of 3.4-5.2 that ordinary matchups never
cross. It looked exactly like a clean result. The fix was to print the count
(`# decisions=512 switches=284`) and to build lopsided positions deliberately.
Generalise: any sweep whose subject is a *rare* decision needs a denominator in
its output, and a precondition counter. "0 changed" and "0 reached" are different
findings and must not print the same way.

**Watch for `Date.now()`-derived uids in anything you diff.** `snapshot()` in
`audit.js` rewrites every uid to a positional token (`mon0.1`), which covers
`field.weatherSource`, `lastDamageSourceUid`, `conditions.futureSight` and the
`attract` / `lockon` volatiles at once.

**Exclude what differs by construction, keep its consequence.** The two runs of
a comparison differ in the held item or the ability, so those fields are dropped
from the diff — but `item !== baseItem` and `ability !== baseAbility` stay, so
consumption, Trace and forme changes still register.

**Snapshot every turn, not just the end** (§8) — and remember a finding can be
an artefact of the scenario rather than a bug.

The method that worked, and is worth repeating: **"it does not throw" is not
"it works."** For every ability, item and move, assert the *declared* effect
actually changes battle state. That is what caught Ceaseless Edge, the Ruin
abilities and Air Balloon — all of which looked implemented and were counted as
such.

### Reading the output

**A finding is a candidate, not a verdict.** The overwhelmingly common cause of
a finding is that no scenario reached the ability's trigger. Confirm each in a
real battle before changing engine code; every spot-check so far has exonerated
the engine and improved the scenario instead (§10, open item 1).

Expect these, and treat anything else as worth investigating:

- **species** — exactly 11 base-stat differences, the intentional
  `LEGACY_BASE_STATS` overrides. Zero bst and zero typing findings.
- **moves** — 0 silent moves; ~19 that report their own failure because they
  need a precondition the probe does not set up (Attract needs opposite
  genders, Dark Void is Darkrai-only, Encore needs a previous move).
- **abilityflags** — exactly **two** lines, both benign, both verified by hand:
  - `typeChange` *is* read, by `displayMoveType` / `displayBasePower` inside
    `abilities.js`, which the sweep excludes as the defining file.
  - `formeItem`, declared by Zero to Hero, is genuinely read by nothing — but it is
    not a dead *hook*. It documents why the ability is hookless (the Hero Charm item
    does the transformation, §5) and gives the definition a key, which is what keeps
    it classified as implemented rather than inert. Do not "fix" it by deleting it
    without checking `Abilities.coverage()` first. (`formeItemMatches` in
    `battle.js` is an unrelated method that merely shares the prefix.)

  This static scan is weak by nature — hooks are dispatched dynamically by name —
  and the behavioural ability sweep is the real check.
- **abilities / items** — the residual shortlists (§10, open item 1).

## 12. Running it

```bash
# Play
Launch Pokemon RedGPT.bat        # starts run_game.py, opens the browser

# Or serve manually
python -m http.server 8123 --bind 127.0.0.1

# Tests
npm test

# The control harness: 89 controls. Breaks each implementation on purpose and
# asserts the matching test goes red; exits non-zero if any control leaves the
# suite green. ~3 minutes for all 46.
#
# A control declares which suite holds its test (`engine` / `data` / `teams`)
# and, for anything whose fix lives in `tools/generate-data.js`, `rebuild: true`
# — which regenerates `data/**` around the patch, because a broken generator
# alone changes nothing the suites read.
#
# NEVER run `npm test` at the same time: it patches src/** — and, for a rebuild
# control, data/** — in place. If it is interrupted, a file is left patched: the
# restore is in a `finally`, which a hard kill skips. `--verify` finds it, names
# the line to put back, and regenerates the data so the packaged copy cannot be
# left written from a broken generator.
node tools/coverage-controls.js
node tools/coverage-controls.js eelevate      # only controls matching a term
node tools/coverage-controls.js ogerpon       # the 2026-08-16 batch
node tools/coverage-controls.js "OU->UU"      # the OU -> UU tiering batch
node tools/coverage-controls.js --verify      # after an interrupted run

# Regenerate the two tiering briefings from the live ladder. Both carry roster
# blocks pinned by tests, so any tier change needs this run afterwards; the
# per-Pokemon movepool profiles are relocated between sections, never re-derived.
node tools/tiering-docs.js
node tools/tiering-docs.js --check            # report drift, write nothing

# The UU format audit briefing (UU profiled, plus the OU and RU bars). Also
# pinned by a test, so re-run it after any tier change. Every move value is
# resolved by the engine at use time, never read off the packaged row.
node tools/uu-audit-doc.js
node tools/uu-audit-doc.js --check

# Regenerate the damage rows in the UU evidence packet that were generated with
# ability slot 0 instead of the ability the prose named.
node tools/evidence-calcs.js --check

# The audit packets and the whole-ladder trapping packet. All are pinned by
# tests, so re-run the relevant one after ANY tier change.
node tools/nu-final-evidence.js --check      # NU + PU + RU
node tools/pu-final-evidence.js --check      # PU + ZU + NU
node tools/ru-final-evidence.js --check      # RU + NU + UU
node tools/zu-final-evidence.js --check      # ZU + PU, UPWARD ONLY (ZU is the floor)
node tools/trapping-audit-prompt.js --check  # every trapping holder, Ubers -> ZU

# The estimator-ripple guard. Snapshot BEFORE any tier change, and diff after
# rebuilding — a tier change that makes an unranked forme *ranked* moves the
# nearest-neighbour model underneath every other estimated forme.
node scratchpad/snap-tiers.js scratchpad/tiers-BEFORE.json
#   ... edit TIER_OVERRIDES, npm run build:data ...
node scratchpad/snap-tiers.js scratchpad/tiers-AFTER.json scratchpad/tiers-BEFORE.json

# Each control runs the suite narrowed to the test it is about, via
# REDGPT_TEST_FILTER — unfiltered the suite is ~2 minutes and almost all of it
# is soak tests no control touches, which put a full run near an hour. A filter
# matching nothing **exits non-zero** rather than reporting "0 checks passed",
# or every control downstream would be silently vacuous.
REDGPT_TEST_FILTER="Delta Stream" node tests/engine-battle.js

# Deep audits (not part of npm test, ~8s) — see §11.
# Exits non-zero if any sweep fails its control fixture.
node tools/audit.js
node tools/audit.js species
node tools/audit.js abilities items

# Rebuild the dataset (needs @pkmn packages installed).
# Preserves LEGACY_BASE_STATS and MOVE_OVERRIDES; re-run npm test afterwards.
npm run build:data

# Switch and replacement quality, with denominators (see §10 item 3 and
# docs/AI_DESIGN.md). Reports how often the decision was reached at all, so a
# "0 problems" result cannot be vacuous.
node tools/ai-switch-sweep.js 60 expert

# Measure the AI difficulty ladder, side-mirrored (see §10 open item 3).
# `pairs` is mirrored PAIRS, so the battle count is twice that. Prints an ordering
# check: every stronger tier must beat every weaker one.
node tools/ai-ladder.js 60 random

# Measure campaign balance (slow — ~1.5s per run, so 200 runs is ~5 minutes;
# run the three difficulties in parallel). Seeds are fixed at `2000 + i * 13`,
# so the same arguments always reproduce the same result.
#   node tools/balance-probe.js [runs] [normal|veteran|master] [advisor|basic] [rebirth]
node tools/balance-probe.js 200 normal            # advisor policy (default)
node tools/balance-probe.js 200 normal basic      # the old, weaker policy

# Rebirth Mode, measured separately (§6). A rebirth can only start from a run
# that cleared, so the probe plays an ordinary run first and measures the
# rebirth only when it wins — it prints `rebirths measured: N of M seeds`, and
# that N is the denominator, not an aside. 60 Normal seeds buy ~27 rebirths.
# Master is not measurable this way at sane cost (11% base rate).
node tools/balance-probe.js 60 normal advisor rebirth

# 24 runs is ±7 points of standard error at these rates — too noisy to tune on.
# Use 200 (±3 points). The probe reports `moves taught / declined` as a control:
# a policy reporting 0 taught is not playing the game (see §8).
```
