# AI design — one brain, several doors

**Read this before changing anything that makes a decision for a player or an
opponent.** It exists because "improve the AI" is ambiguous in this project:
there are two decision-making modules, they are deliberately different, and a
change to one does not reach the other.

The rule this document establishes:

> **Every in-battle AI improvement must apply to every consumer of the battle
> AI, including Assist Mode.** If a change cannot apply to one of them, that is a
> deliberate decision and it must be recorded here with its reason.

---

## 1. Where decisions are actually made

| Module | What it decides | Who uses it |
| --- | --- | --- |
| `src/core/ai.js` | everything in battle: move, switch, replacement after a faint, Tera, Mega, lead order at Team Preview | Arena AI, Campaign AI, Spectate Mode, **Assist Mode auto-battle** |
| `src/campaign/advisor.js` | everything out of battle: rewards, move swaps, TM/tutor picks, held-item holders, **and the Assist Mode lead recommendation** | Assist Mode recommendations only |

**The single most important fact: Assist Mode's auto-battle is not a copy of the
AI, it *is* the AI.** `BattleView.autoBattleStep()` calls
`RedGPT.AI.chooseAction` through the same `submit()` path a human click uses, so
any improvement to `ai.js` reaches Assist Mode the moment it lands, with no
porting and no second implementation to keep in sync. This is why there is no
"Assist Mode AI" to update separately, and it should stay that way — a forked
copy would drift silently, which is this project's most common class of bug.

One detail that has already bitten: `AI.chooseAction` reads its difficulty tier
off `side.ai`, and a human-controlled side has no `side.ai`. Auto-battle
temporarily installs `{difficulty: this.autoBattleTier}` and restores it in a
`finally`. Without that it silently played at the default Trainer tier instead of
the best available one. Any new caller driving a human side through the AI needs
the same treatment.

---

## 2. The one real divergence, and why it is not simply a bug

`Advisor.recommendLead` is a **second, weaker** lead chooser. `ai.js` has
`chooseTeamPreview`, which knows about archetypes, suicide leads, hazard leads,
weather leads and win conditions. The advisor's version scores by BST and the
type chart alone.

That gap is **not** an oversight to close by pointing the advisor at
`chooseTeamPreview`, because the two run on different information:

- `chooseTeamPreview` is **full information**. It reads the opposing team's real
  movesets, items and abilities. §5 records this as deliberate: *"the AI is an
  opponent, not a simulated player"*.
- The advisor is **player information**. `hideOpponentDetails` is on in every
  format, and two Campaign relics (Annotated Trail Map, Pathfinder's Map) are
  *sold* on the promise of revealing opponent details. An advisor that quietly
  read the opponent's held items would hand the player, for free, the thing those
  relics charge for — and §5 makes the same point about `statBreakdown`, which
  goes out of its way to mark what the viewer is not entitled to see.

**`run.assist.plan` is an advisor-only concept, and that is deliberate** (added
2026-08-14). It picks one of nine rows in `CampaignContent.TEAM_PLANS`, and it
steers recruit, item, ability, TM, tutor and reward advice. `ai.js` does **not**
read it, for two reasons worth stating so nobody "fixes" the omission:

- The battle AI drives *opponents* as well as the player's Assist auto-battle.
  A plan is a statement about the team the player is building over a whole run;
  it has no meaning for a boss team constructed in `content.js`.
- `AI.archetypeOf` already classifies a side as hyper offense, stall, weather or
  balance **from the team in front of it**, which is the right input for a
  single battle. A plan is a prior about a team that does not exist yet — the
  right input for a draft screen and the wrong one for turn 3.

**Rebirth Mode does not weaken that rule, and the distinction is worth being
precise about** (2026-08-14). Rebirth *builds* every opposing team from a
`TEAM_PLANS` row and a boss declares its own (`boss.teamPlan`), so the table is
now read by generation as well as by advice. What stays forbidden is reading
**the player's Assist setting** during generation — `run.assist.plan` is
toggleable mid-run and would desynchronise a seeded run the moment it was
flipped. A Rebirth opponent's plan is rolled from the *run* RNG at
battle-construction time and stored on the battle config, so it reproduces from
the seed. `ai.js` still reads neither: it meets the finished team and classifies
it with `archetypeOf` exactly as before, and `AI.themeLead` leads the setter
because the team really is built around one.

So the standing rule for the advisor is: **improve the reasoning, never the
information.** At Team Preview the player genuinely can see the opposing
*species*, and fully sees their own team — so own-team role awareness (is this a
hazard setter? a weather setter whose teammates want the weather? a win condition
that should be held back?) is fair game and was added on 2026-08-13. Reading the
opponent's moves, items or abilities there is not.

---

## 3. What the battle AI already knows

Worth reading before "adding" something that exists. The AI reads, today:

- **The active foe's real moveset, ability and item**, because `estimateDamage`
  runs the engine's own damage pipeline rather than a copy — so Levitate, Flash
  Fire, Assault Vest, Choice lock, Rocky Helmet, screens, weather and terrain are
  all already priced.
- **The whole opposing team's movesets** (`teamThreat`), which is what stops it
  setting up in front of its own revenge killer.
- **Real accuracy** (`hitChance` asks `battle.moveAccuracy`, so Thunder is 100%
  in rain), **turn order** including priority and Trick Room (`movesFirst`),
  **hazards priced per-Pokémon**, **an unspent Mega or Tera on the foe**
  (`incomingThreat`), and **effective HP** including Focus Sash, Sturdy,
  Multiscale, Disguise and Ice Face.

What it still does **not** do is *predict*: it never asks what the opponent will
switch to, and never looks past the current turn.

**An engine fix can be an AI fix, and this one was** (2026-08-14). `scoreMove`,
`matchupScore` and `estimateDamage` all ask `battle.moveType`, so while five
moves resolved to the wrong type there (Revelation Dance, Judgment,
Multi-Attack, Techno Blast, Aura Wheel — see PROJECT_CONTEXT §5), the AI was
scoring them at the wrong type and the wrong STAB: an Arceus-Water rated its own
Judgment as a non-STAB Normal move. Nothing in `ai.js` was wrong, and nothing in
`ai.js` had to change. The general point for this handbook: **the AI's judgement
is only ever as good as the engine values it reads** — the same lesson as the
Mega-aware `incomingThreat` fix, where the resolve rule was right and its input
was wrong. Before tuning a score, check the number going into it.

Because the fix is in `battle.js`, it reached Arena, Campaign, Spectate,
**Assist Mode auto-battle** and the damage calculator at once, with no porting —
the §1 property doing its job.

---

## 4. Rules for changing the AI

1. **Measure it, and report a denominator.** Two AI changes have been written,
   measured to alter **zero** of thousands of decisions, and removed. A sweep
   whose subject is a rare decision must print how often the decision was reached
   at all — `tools/ai-switch-sweep.js` is the worked example, and it exists
   because an earlier sweep produced 0 switches in 2,400 calls and reported "no
   difference" for every variant tried.
2. **A rate needs its ceiling.** "The AI revenge-kills 39% of the time" is
   meaningless; "82.7% of the times a revenge killer was on the bench" is a
   verdict on the chooser. Always count the cases where the good option existed.
3. **Check the ladder afterwards** with `node tools/ai-ladder.js 60 random`,
   which plays every pairing from both sides on the same teams and seeds. Single
   sided sampling carries a ~18-point side bias. Every stronger tier must still
   beat every weaker one; the tool checks and prints this.
4. **Use `battle.aiRng`, never `battle.rng`.** Replays skip AI evaluation
   entirely, so drawing from the mechanics stream desynchronises playback.
5. **Ask hypothetically.** Anything that only *considers* a move must pass
   `{preview: true}` to `dynamicBasePower`, or scoring a move the AI never picks
   will roll Magnitude's power, write to the battle log and — for Present — really
   heal the opponent.
6. **Difficulty tiers are dials on the same brain.** Most new judgement should sit
   behind `level.predicts` so the lower tiers stay beatable and the ladder keeps
   its ordering.

---

## 5. Changes on 2026-08-13 (second session)

All of these are in `ai.js`, so all of them apply to Assist Mode auto-battle.

- **A switch-in must still be standing when its own turn arrives.**
  `switchInSurvival` measures the free hit on the way in *and* the second hit a
  slower Pokémon eats before it ever acts, against `effectiveHP`. At the
  predicting tiers this is a **gate**, not a price. Measured over 1,561 switch
  decisions: doomed switches fell from **30.4% of all switches to 0%**, and
  switching itself fell from 5.0% to 3.6% of decisions — the AI makes progress
  instead of shuffling.
  Resisting the foe's best move is *preferred* but not required: demanding a
  resist as well left the AI with no legal switch in ordinary positions.
- **Progress is charged against switching.** The chip the current Pokémon would
  deal is priced into `switchCost`, so a switch that merely improves the matchup
  on paper no longer beats a turn that was actually accomplishing something.
- **Replacements prefer a revenge killer** — faster, and knocking the foe out
  measured against `effectiveHP` so a Focus Sash is not mistaken for a kill.
  Taken **82.7%** of the times one was available.
- **A replacement is not a switch.** Nothing hits it on the way in, so "does it
  survive a free hit" is the wrong question; the right one is "does it get to act
  at all" (slower *and* knocked out). A first version of the penalty used the
  switch-in test and scored *down* exactly the fast frail revenge killers it was
  meant to find. Wasted replacements, where a better option was on the bench,
  fell from **15.1% to 5.2%**.
- **Assist Mode's lead recommendation** gained own-team role awareness — hazard
  and screen leads, suicide leads, weather setters whose teammates want the
  weather, and holding win conditions back — **without** gaining any new
  information about the opponent, for the reason in §2.
- **Multiscale was counted twice, and Shadow Shield was the tell.** Both have
  byte-identical `onSourceModifyDamage` hooks halving damage at full HP, and
  `estimateDamage` already applies that halving for both — but `effectiveHP` *also*
  inflated HP by 1.5x for Multiscale only. A full-HP Multiscale Dragonite therefore
  read as 484 effective HP against a hit already reduced to 124: 3.9 hits of bulk
  where the truth is 2.6. The AI under-attacked it and over-valued setting up in
  front of it. Two abilities doing the same thing cannot correctly disagree — that
  discrepancy is the cheapest way to find this class of bug.
  Disguise and Ice Face keep their `effectiveHP` entries and are *not* double
  counted: `estimateDamage` deliberately does not run their hooks, because those
  hooks bust the disguise, print a message and change forme, and merely *asking*
  what a move would do must never change anything (§5).
- **A guaranteed turn is spent on the turn it is guaranteed.** Focus Sash, an
  unbroken Sturdy and a full-HP Multiscale or Shadow Shield each buy exactly one
  turn, and they buy it *now* — attacking first and boosting later pays for the
  same boost out of real HP. A fresh sweeper that will outspeed once boosted now
  takes the boost immediately. Gated on all three conditions together (guarantee,
  opening turn, and the boost actually winning the Speed race) so it is not a
  reward for setting up badly. Measured: Swords Dance on a lead Garchomp scores
  **135 holding a Focus Sash against 70 holding Leftovers**.

## 6. The AI inspector (2026-08-14)

`AI.explainChoice(battle, sideIndex, tier)` returns the AI's working for the
current turn as data: a score per move alongside the numbers the score was built
from (damage, share of the target's health, effectiveness, real accuracy,
whether the move can work at all, whether it KOs, the setup valuation), plus the
three facts most of `scoreMove`'s branches hang off — who moves first, the
incoming hit, and whether this Pokémon is dying — and the bench ranked by
`matchupScore`. `BattleView.renderAiInspector` draws it under the move grid
behind an **AI view** button.

It exists because the AI computed all of this and threw it away, so *"why did it
do that?"* could only be answered by re-deriving the decision by hand. Two
sessions have now been spent proving an AI change altered nothing; this makes
that visible by eye.

**Three rules keep it honest, and all three are load-bearing:**

- **It must not draw from `battle.aiRng`.** Replays skip AI evaluation
  entirely, so a panel that advanced the AI stream would desynchronise playback
  of any battle it had been open during. `scoreMove` is safe — the noise and the
  `lapse` rolls live in `chooseAction`, not the scorer — but **`considerSwitch`
  is not**, so the bench rows use the pure `matchupScore` rather than asking the
  real switch logic. A test calls it 25 times and asserts both streams and the
  log are byte-identical afterwards.
- **It must not draw from `battle.rng`.** Every damage figure comes from
  `estimateDamage`, which previews (§5).
- **Only ever the controlled side.** The battle AI is full-information: it reads
  the opposing moveset, item and ability. Pointing the inspector at the opponent
  would hand the player everything `hideOpponentDetails` withholds and
  everything two Campaign relics are *sold* on revealing. What it shows is the
  reasoning for the player's own Pokémon — the same reasoning Assist Mode acts
  on when it plays for them, which is precisely what makes it checkable.

Its first use was confirming a real report: a Dragonite that threw Outrage into
a Weezing-Galar six turns running scores that Outrage at **−500**, so the AI
would never have chosen it. The repeat was the rampage lock (PROJECT_CONTEXT
§5), and the inspector says so at a glance.

## 7. Themed teams lead with their setter (2026-08-14)

`chooseTeamPreview` scored leads on matchup and nudged a weather setter by
+0.8 — a preference. On a themed team it is not a preference: a Rain team that
leads its Swift Swim sweeper has not set the rain, and every turn the setter is
off the field is a turn the team does not work. `AI.themeLead` moves the setter
to the front of the order outright, before the `bring` slice so it is also
guaranteed to be brought.

**Which themes are unconditional, and which have to show payoff, is the whole
design.** A move can be filler; a dedicated ability cannot:

| theme | leads when |
| --- | --- |
| Trick Room, screens | always — neither move is ever filler |
| Rain, Sun (ability setter) | always — Drizzle and Drought Pokémon are only brought to set weather |
| Sand, Snow (ability setter) | only with an abuser — Tyranitar and Hippowdon are routinely standalone bulky Pokémon |
| any weather *move* setter | only with an abuser — a filler Rain Dance is not a Rain team |
| Electric, Psychic Terrain | ability setter always; the move needs payoff |
| Tailwind | needs an attacker it actually speeds up |

Two narrowings worth keeping:

- **Snow counts only Slush Rush** (`LEAD_ABUSERS`). Snow is usually set for
  Aurora Veil, which is a *screens* plan and is already covered by the screens
  row; Ice Body and Snow Cloak are passive perks that create no reason to spend
  turn one on the setter.
- **Psychic Terrain counts grounded teammates only**, since that is who its
  priority block protects.

Grassy and Misty Terrain are deliberately absent: Grassy Terrain's headline
payoff elsewhere is Grassy Glide's priority, and **this project makes Grassy
Glide unconditional** (PROJECT_CONTEXT §5), so the terrain no longer buys it.

**It reached Assist Mode, as the rule requires.** `Advisor.themeLeadFromSets` is
the mirror, and this one is squarely inside the §2 boundary — which weather your
*own* team wants needs no information about the opponent. The two are separate
implementations by necessity (`ai.js` loads before `campaign/`, and they run on
battle Pokémon versus sets), so the tests assert the *rule* matches rather than
the code: the same seven-theme table is checked against both.

Behind `level.predicts`, like the rest of the AI's real judgement, so Casual and
Trainer are unaffected and the ladder ordering holds.

### What it was worth, measured

`node tools/ai-ladder.js 60 random`, 120 mirrored battles a pairing, the same
teams and seeds before and after:

| pairing | before | switch work only | everything |
| --- | --- | --- | --- |
| trainer vs casual | 61% | 61% | 61% |
| ace vs trainer | 63% | 63% | 63% |
| expert vs ace | 55% | 55% | 55% |
| ace vs casual | 65% | 75% | **73%** |
| expert vs casual | 73% | 79% | **79%** |
| expert vs trainer | 66% | 71% | **71%** |

120 battles buys about ±4-5 points, so the 75 → 73 wobble in the middle column is
noise and should not be read as the later changes costing anything.

**The first row is the control, and it matters.** All of this sits behind
`level.predicts`, which Casual and Trainer do not have — so Trainer vs Casual
*must* be unchanged, and it is, at an identical 73/120. Expert vs Ace is flat for
the opposite reason: both tiers got the same upgrade, so the gap between them
holds. The gain shows up exactly where the theory says it should, which is
better evidence than a uniform lift would have been.

## 8. Tearing a room down is a decision, and the AI now makes it (2026-08-14)

Using Trick Room, Magic Room or Wonder Room while it is already up **ends** it,
as in the games. The engine refused every re-use instead
(`setPseudoWeather` returned false), which was invisible while every room ran
out on its own — and became load-bearing the moment Rebirth Mode gave a team a
room with no turn counter, because nothing else in the game removes one. Setting
one is how you take one down. Gravity is deliberately excluded: it is not
self-cancelling in the games either, and `Mechanics.SELF_CANCELLING_ROOMS` is
the single list.

The AI half follows from it directly. When a self-cancelling room is up the move
is a *cancel*, so it is worth **the negative of what setting it would be worth**:
tear down a room that suits the other side, leave one that suits your own. The
old flat `−300` would simply have declined a newly-available option forever.

**Measured with a denominator, because the ladder cannot see this.** Only 12 of
the six pairings' battles would ever reach the decision — in fact **0 of 400**
random-format teams carry a room at all, so `tools/ai-ladder.js` samples it
never, and a ladder run is not evidence either way. Positions were built
deliberately instead: a fast team and a slow team, each facing a room already up,
12 seeds each, at all four tiers.

| tier | picks the cancel with a **fast** team (should) | with a **slow** team (should not) |
| --- | --- | --- |
| casual | 0 / 12 | 0 / 12 |
| trainer | 0 / 12 | 0 / 12 |
| ace | **12 / 12** | 0 / 12 |
| expert | **12 / 12** | 0 / 12 |

The bottom two rows are the change and the top two are the control: it sits
behind `level.predicts`, so Casual and Trainer keep the old flat refusal and the
ladder ordering cannot move. The ladder was run anyway and stays monotonic —
every stronger tier beats every weaker one — which the tool checks and prints.

`tools/ai-ladder.js` **is** reproducible run to run: two consecutive runs of
`12 random` were byte-identical. The differences between the tables in §7 and
in PROJECT_CONTEXT §10 are therefore *between builds*, not run-to-run noise on
one build, and should be read that way.

## 9. Attrition: what the AI could not previously see (2026-08-14)

Three requested additions, all behind `level.predicts`, all about the part of a
battle that happens between the attacks. Full detail is in PROJECT_CONTEXT §5;
this is what a future AI change needs to know about them.

**`battle.residualSwing(pokemon)` is now the AI's model of chip.** It returns
net HP per turn from every residual source. The AI reads it in two places so
far — the Protect family, and Rest's status cure — and it is reported by
`AI.explainChoice` as `residual: {self, foe}`. It is the natural input for
anything else about attrition: Toxic's real value against a Leftovers wall,
whether a stall matchup is actually winnable, whether Leech Seed pays. **It is a
prediction and must never execute the hooks** (§5's rule) — extend it by
declaring `residualFraction` on the ability or item, and the mirror test will
tell you if the declaration and the hook disagree.

**A Trick Room setter sets Trick Room, and it does it over a knockout**
(2026-08-14, by project decision, and the strongest measurement of the session).

Reported twice: a Calyrex-Ice came in against a team that entirely outsped it,
took two knockouts with Glacial Lance, and died to the third Pokémon without
acting. The old scoring was *correct by its own lights* — a certain KO is worth
~320 and the room ~130, so the room could never win. The flaw is §3's known
limitation, not the arithmetic: **the AI never looks past the current turn, and
Trick Room is the one move whose entire value is the turns after this one.**

Played out 120 times from that exact position, forcing each choice:

| turn-7 choice | battles won | avg foes knocked out |
| --- | --- | --- |
| take the knockout | **3 / 120 (3%)** | 1.38 |
| set Trick Room | **94 / 120 (78%)** | 3.56 |

A 75-point swing, and afterwards the AI's own free choice reproduces the 78%.
So the room is priced *above* a knockout outright rather than nudged. Three
guards keep it from becoming a blanket rule, each with a control:

- only when the team-majority Speed test already says the room helps, so a fast
  team still refuses it;
- **never when the knockout would end the battle** — setting up instead of
  winning is the obvious way to make this worse;
- and never when the room is already up.

**The general lesson is about method, not Trick Room.** "Is this the right move?"
was settled by playing the position out both ways, not by reasoning about the
scores — and the reasoning had been wrong twice, including mine. Any future
argument about a multi-turn investment losing to immediate damage should be
settled the same way, because a one-turn scorer cannot answer it from the inside.

**Judging it against the whole opposing team, not the Pokémon in front.** The
Speed test used to compare only against the active foe, so a slow team facing
one fast lead scored the room the same as a slow team facing six. It now uses
the median Speed of everything still standing on the other side — the AI is
already full-information there (§2), so this is better reasoning rather than new
information.

**Being unable to act is a gate, not a margin — and `bestDamage` must respect
what the Pokémon may actually select.** Reported: a Kingambit Choice-locked into
Dig against a Flying Skarmory stayed in for six turns and died there.

Two bugs, and the first hid the second:

- **`bestDamage` ignored `choiceLockedMove`**, so it reported a Kowtow Cleave
  the Pokémon could not pick. Everything built on it inherited the fiction —
  `canKO` refused to abandon a knockout it could not execute, `matchupScore`
  rated the position survivable, `incomingThreat` mis-priced a locked *foe*.
  It now filters to the locked move. Deliberately **only** the Choice lock:
  Taunt, Disable and Encore are volatile and lapse, and pricing a two-turn
  Taunt as permanent would make the AI flee positions it should hold.
- **`considerSwitch` compares matchups against a margin of 3.4-5.2.** Even once
  the matchup read 0.0 against a bench of 1.1 and 1.5, a *completely* lost
  position lost the comparison to a merely bad one. No threshold tuning fixes
  that — staying is worth exactly zero, so nothing should have to outbid it.
  `AI.helpless` (no legal move deals damage or lands as status) is now a hard
  switch trigger.

**`helpless` reads `battle.availableMoveIndices`** rather than re-deriving the
Choice/Taunt/Disable/PP rules, so it stays correct as restrictions are added.
Struggle counts as damage, so a Pokémon reduced to it is not helpless.

**It is ungated**, unlike most of the AI's judgement, for the reason §8 gives
about impossible moves: *a blunder must be a worse move, not an impossible one*.
Six turns of hitting something that cannot be hit reads as the game being
broken, not as an easy opponent, and the weak tiers keep every other way of
being wrong.

**Priority is refused when Psychic Terrain or a `blocksPriority` ability will
block it**, and the way that bug survived is the part worth keeping. `scoreMove`
already computed the exact condition, in a local named `priorityBlocked` — and
used it only to withhold a bonus. The move kept its full damage score and a
Kingambit threw Sucker Punch into Psychic Terrain three turns running. **Knowing
a move cannot work and not refusing it is indistinguishable from not knowing**,
so anything of this shape belongs in `AI.cannotAffect`, never as a local
adjustment inside a scoring branch. The local was deleted, not left beside the
new refusal: `willFail` returns first, so it could never have fired again.

**Sleep is now modelled properly, and it is the §8 immunity lesson again.** A
move that cannot execute must never outscore one that can, or the AI throws it
every turn until something outside the loop changes — a sleeping Pokémon used to
pick a knockout worth ~390 and print "is fast asleep" while the Sleep Talk in
its own moveset sat unused. The boundary to respect is `sleepTurns > 0`: the
counter is spent at the *start* of a move attempt, so at 1 the Pokémon is still
asleep and only at 0 does it wake and act.

**One general lesson, which cost the most time here.** Two of these tests passed
with the fix deleted, and neither was a badly written assertion — the Sleep Talk
test could not fail without its gate because Sleep Talk's *own* bonus already
beat an ordinary move, so proving the gate needed a position where a **knockout**
was on the table. When two terms both push the same way, a test that does not
separate them is only testing the stronger one. Break each one on its own.

### Measured

`node tools/ai-ladder.js 60 random`, before and after all three changes on the
same build family:

| pairing | before | after |
| --- | --- | --- |
| trainer vs casual | 66% (78/119) | **66% (78/119)** |
| ace vs casual | 79% | 78% |
| expert vs casual | 78% | 78% |
| ace vs trainer | 59% | 59% |
| expert vs trainer | 71% | 72% |
| expert vs ace | 64% | 63% |

Ordering monotonic, which the tool checks and prints. **The first row is the
control and it is byte-identical — 78 of 119 with one draw, both runs** — as it
must be, since all three changes sit behind `level.predicts` and neither of
those tiers has it. The predicting rows each moved by a single battle.

**The `helpless` switch gate is the one change this session that did move the
ladder**, and it should have: it is the only ungated one, so every tier got it.

| pairing | before | after |
| --- | --- | --- |
| trainer vs casual | 66% | 62% |
| ace vs casual | 78% | 79% |
| expert vs casual | 78% | **82%** |
| ace vs trainer | 59% | 61% |
| expert vs trainer | 72% | 72% |
| expert vs ace | 63% | 61% |

Ordering still monotonic. Every move is inside the ±4-5 points that 120 battles
buys, and the two largest are in opposite directions for a coherent reason:
Expert vs Casual widens because Expert exploits the escape better, while Trainer
vs Casual narrows because *both* tiers gained the same ability and the gap
between them is what the row measures.

**After the Trick Room rule** (also ungated, and it reaches every tier through
generated sets as well as scoring): 61 / 81 / 82 / 62 / 74 / 57 in the same
order, ordering still monotonic. Every row is within ~2 points of the run above,
which is what a change confined to slow, Trick-Room-carrying teams should look
like in a random format — the ladder is again a safety check rather than
evidence, and the evidence is the 3% → 78% outcome measurement.

**Read that as a safety check, not as evidence the changes work.** A
random-format battle almost never presents the positions these rules are about:
a Leftovers holder deciding whether to stall, a Rest user weighing two helpless
turns, a sleeper with Sleep Talk. The ladder's job here was to prove nothing
*regressed*; the targeted tests with their own denominators are what prove the
rules fire, exactly as §4 requires for a rare decision.

## 10. Coverage work reaches the AI two different ways (2026-08-14)

The 26 previously unsimulated abilities and items (PROJECT_CONTEXT §5) are an
engine change, not an AI change — but §3's lesson applies: **the AI's judgement
is only ever as good as the engine values it reads.** Two of the new abilities
needed nothing at all, and three places needed a real edit. The split is the
useful part, because it says where to attach the next one.

**Free, because the value flows through a function the AI already asks.**

- **Delta Stream's strong winds** live in `battle.effectiveness`, which
  `estimateDamage` calls on line one. So the AI already prices an Ice move at
  0.5x into a Gyarados under strong winds, `cannotAffect` sees the same chart,
  and the damage calculator and the move buttons agree. No mirror, no drift.
- **Mega Sol** lives in `battle.weatherFor`, which `weatherPowerModifier`,
  `moveType`, `moveAccuracy` and the charge-skip all read. The AI values a Fire
  move from a Mega Sol holder at 1.5x without knowing the ability exists.

That is the shape to aim for: **put the rule in the one function every reader
already consults**, and the AI mirror is free. Both of these could have been
written as an `ai.js` branch and would then have needed the calculator and the
move-button readout separately — the Ring Target work (PROJECT_CONTEXT §5) found
seven call sites the hard way.

**Not free, because the AI matched an ability by *name*.** Three sites read
`Dex.toID(p.ability) === 'levitate'` or `guard.name === 'Levitate'`, so Eelevate
— which is Levitate plus Beast Boost — was invisible to all three:

| site | what it decides |
| --- | --- |
| `AI.estimateDamage` | whether a Ground move does anything at all |
| `AI.scoreMove`'s Gravity valuation | how many opposing floaters Gravity grounds |
| `Advisor.FLOATS` | whether terrain does anything for a party member (Assist Mode) |

All three now ask the registry's own `ungrounded` declaration instead, so a
fourth floating ability is priced with nothing to edit. **The Assist-Mode mirror
is the §1 rule doing its job**: `Advisor.FLOATS` is out-of-battle advice and
would not have been reached by an `ai.js` fix, so it had to be changed with the
other two.

`estimateDamage`'s Levitate line was **also wrong before Eelevate existed**: it
returned 0 for Thousand Arrows and for any `ignoreImmunity` move, both of which
really land. The engine hook has always excluded them; the AI's copy did not. It
now mirrors the hook exactly. Rare, and the same class as every other entry here
— the AI reading a number the engine disagrees with.

### Measured, and the denominator is again the whole story

`node tools/ai-ladder.js 60 random`, 120 mirrored battles a pairing:

| pairing | before | after |
| --- | --- | --- |
| trainer vs casual | 61% | **61% (73/120)** |
| ace vs casual | 81% | 82% |
| expert vs casual | 82% | 80% |
| ace vs trainer | 62% | 62% |
| expert vs trainer | 74% | 74% |
| expert vs ace | 57% | 56% |

Ordering monotonic, which the tool checks and prints. Every row is inside the
±4-5 points 120 battles buys, and three are identical.

**Read that as a safety check and nothing more.** These are engine changes, so
unlike most of this document they are *ungated* — every tier gets them equally,
and the ladder measures the gap between tiers, so equal changes cancel by
construction. More to the point, the format barely contains them: of 400
random-format teams, **11 carry one of the 13 new abilities, 0 carry one of the
13 new items, and 0 carry a Mega Stone at all** — which means the six Legends:
Z-A abilities, all of them on Mega formes, are unreachable in this format. The
ladder cannot see this change, so its silence is neither confirmation nor
contradiction; the 23 targeted tests and their 30 controls are the evidence.

**Name-matching is not banned, and §8 records why it exists**: `estimateDamage`
deliberately will not *run* a defensive `onTryHit`, because those hooks mutate
(Flash Fire takes a boost, Disguise busts), and asking what a move would do must
never change anything. The fix is not "run the hook", it is **match on a declared
flag rather than on a name** wherever the registry already carries one.
`ungrounded` did; there is no equivalent declaration for Flash Fire or Water
Absorb, so those stay name-matched until one is added.

## 11. The Ogerpon Masks needed no AI change at all, and that is the point (2026-08-16)

A new species, three new forme items and a new damage modifier landed
(PROJECT_CONTEXT §5). **Nothing in `ai.js` or `advisor.js` was edited**, and
both halves were verified rather than assumed — which is the whole reason to
write this down, because §10 records the *opposite* outcome for a change that
looked equally self-contained.

**In battle, free.** The Mask's 1.2x is an `onBasePower` hook, and
`AI.estimateDamage` runs the engine's own damage pipeline rather than a copy, so
the AI prices it without knowing the item exists. Measured, Horn Leech into a
Blissey: **216 without the Mask, 259 with it**. The damage calculator agrees
(198–234 → 238–280) and reports the forme change with it. So Arena, Campaign,
Spectate, **Assist Mode auto-battle** and the calculator all moved together, with
no porting — §1 and §10's "put the rule in the one function every reader already
consults" doing exactly their job.

**Out of battle, also free, and this is the half that usually is not.** §10's
Levitate case had to be fixed in three places because `Advisor.FLOATS` is
out-of-battle advice that an `ai.js` fix cannot reach. Here it needed nothing,
for a specific reason worth keeping: **`Advisor.itemFit` and
`Campaign.partyFormeItems` both read `Mechanics.FORME_CHANGE_ITEMS` directly**,
so adding three rows to that table taught them both. Verified rather than
assumed — the Battle Shop offers all three Masks to a party Ogerpon with the
reason *"Ogerpon transforms with it"*, and `itemFit` scores each at **500**
against 240 for a Choice Band and 177 for Leftovers.

**The generalisable rule, which is §10's with the scope widened:** a table the
AI, the advisor and the campaign all read is worth more than a hook in any one
of them. Before writing an AI mirror for something new, check whether it can be
expressed as a row in a table those three already consult — `FORME_CHANGE_ITEMS`,
`TEAM_PLANS` and `residualFraction` are the three that currently have this
property.

**One thing the Masks do *not* give the AI, and it would be easy to assume they
do:** Embody Aspect. All four are implemented, but each lives on an Ogerpon
`-Tera` forme and nothing produces those, so a masked Ogerpon has Mold Breaker /
Water Absorb / Sturdy and never the +1 stat. An AI change that priced "Ogerpon
enters and boosts" would be pricing something that cannot happen.

## 12. "Will this happen?" applies to the move's *inputs*, not just to the move (2026-08-16)

§3 records that the AI's judgement is only ever as good as the engine values it
reads, and §9's `bestDamage` fix is the same lesson. Here it is again, one level
further in: **the value was read at the right time and was still the wrong one.**

Fishious Rend, Bolt Beak, Payback and Analytic read
`defender.hasActedThisTurn`. The AI chooses *before* the turn runs, and
`resetTurnFlags` clears that flag for both sides — so at choice time it is
honestly `false`, and by the time a slower Pokémon's move lands it is `true`.
A slower Dracovish therefore rated its own Fishious Rend at the doubled 170 BP:
**estimateDamage 299 whether `movesFirst` was true or false, against a real 151
when it moved second.**

`estimateDamage` now projects it — `!movesFirst(...)` — for
`Mechanics.TURN_ORDER_POWER_MOVES` and for any ability declaring
`readsTargetActed`. Measured after: 299 / **150** and 86 / **43**, matching the
real 300 / 151 and 86 / 43.

**Three things about the implementation are load-bearing:**

- **It is a set-and-restore in a `finally`, not a threaded option.** One
  mechanism then covers `dynamicBasePower` *and* the `onBasePower` hooks
  (Analytic), which are two different systems. Nothing observable changes, so
  §5's rule holds — the same idiom `hitPlan` uses for the RNG.
- **It needs a recursion guard.** `movesFirst` defaults its `foeMove` to
  `bestDamage(battle, foe, self).move`, and `bestDamage` calls `estimateDamage`
  for every move it ranks. Unguarded, two turn-order carriers facing each other
  recurse forever. Inside a projection the live flag is used, which terminates
  at one level and is the right answer anyway.
- **The `damageTakenThisTurn` family is deliberately excluded** — Assurance,
  Avalanche, Revenge, Counter, Mirror Coat, Metal Burst, Comeuppance. Those turn
  on whether the opponent *chose to attack*, which is the prediction §3 says
  this AI does not make. Turn order is already computed; that is the whole
  difference, and it is the line to hold if someone extends this.

**Measured with a denominator, and the ladder cannot see it.** Only **16 of 400**
random-format teams carry one of these moves (16 of 2,400 sets), so this is the
Protean/Libero shape. `node tools/ai-ladder.js 60 random` after: 65 / 76 / 82 /
62 / 69 / 57, ordering monotonic, every row inside the ±4-5 points 120 battles
buys. Read it as a safety check; the evidence is the before/after estimate
against real battle damage.
