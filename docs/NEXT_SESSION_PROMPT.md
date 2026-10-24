Continuing Pokémon RedGPT at C:\Games\Pokemon RedGPT.

FIRST, before anything else:

1. Read docs/PROJECT_CONTEXT.md in full, then docs/AI_DESIGN.md. There is no git
   history — those two files are the memory. In §10, read the newest entries
   first (2026-09-03, then 2026-08-17), newest at the top:
     - "the Z-A Mega abilities, from the Champions datamine"
     - "the UU → OU pass and the Meloetta pass, carried out — both moved nothing"
     - "the UU → OU packet and the Meloetta packet, in one document"
     - "a fifth profiler defect, and this one is ladder-wide"
     - "Meloetta, measured — the forme is reachable and the tier was never a
        judgement"
     - "the untiered audit — ZU is the floor now, and NFE/LC discard is over"
     - "Relic Song, the move-forme gate, and three Megas recovered"
     - "the ZU pass, carried out — the ladder audit is complete"
     - "the ZU evidence packet — the last rung, and it is one-directional"
   Then the 2026-08-16 entries below them. §5 is the durable-decisions section and
   §8 is the traps section.

2. Open the game in the in-app browser so I can see it:
     preview_start with name "redgpt"   (.claude/launch.json, port 8123)
   If port 8123 is held by another chat's server, attach instead with
   preview_start {url: "http://localhost:8123"} — that's my real save. There is
   also "redgpt-scratch" on port 8124; a different origin means a different
   localStorage, so use THAT for any UI verification and never write to my save
   from the browser. Check the console for errors after loading. Note the pane may
   not be displayed, in which case screenshots time out — verify via DOM reads
   instead and tell me if you need the pane shown. If you rebuild data, RELOAD the
   page before reading counts from it: the tab keeps the old bundle otherwise, and
   that misled us once.

## The one rule that matters most

**You build evidence packets. ChatGPT makes the tier calls. I authorise
implementation.** Even when a brief says "perform the audit" and asks for final
promotions/demotions with confidence, it still means *produce the evidence*. A
packet must contain no verdicts and no recommendations — mechanical flags only,
labelled as reasons to look. This was got wrong once; don't repeat it.

## State at the end of the last session — all verified green

npm test: **438 assertions** across six engine suites, jsdom **0 console errors**,
exit 0.
node tools/coverage-controls.js --verify: **CLEAN, 132 anchors**.
node tools/audit.js: exit 0, all five sweep controls flagged.
All **twelve** doc generators report no drift.

**The ladder is complete — every rung audited, and there are ZERO untiered
selectable species:**

| Ubers | OU | UU | RU | NU | PU | ZU | total |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 63 | 93 | 91 | 131 | 67 | 110 | 677 | 1,232 |

Selectable species **1,138**; packaged **1,273**.

**What the last session did:**

- **Replaced the three `-Mega-Z` placeholder abilities** from a Pokémon Champions
  datamine the player supplied: **Garchomp-Mega-Z Sand Force → Levitate,
  Lucario-Mega-Z Adaptability → Aura Guard, Absol-Mega-Z Magic Bounce →
  Sharpness.** §5 had flagged all three as provisional because each was
  byte-identical to the Pokémon's ordinary Mega — that tell was correct.
- **Two new generator mechanisms, and BOTH ARE MEANT TO BE RETIRED.**
  `ABILITY_ADDITIONS` (Aura Guard does not exist upstream at all; abilities
  316 → **317**) and `SPECIES_ABILITY_OVERRIDES`. Listed in
  `docs/DATA_REPORT.md` under *Project ability assignments* so they can be found
  and deleted. **The official update was due ~2026-09-09 — check whether upstream
  now ships these values, and if it does, delete both tables and rebuild.**
- **Aura Guard is a flat contact halving, no HP gate.** Measured with a control:
  Sucker Punch 128-152 → **64-76**, while Ice Shard / Earthquake / Flamethrower
  are byte-identical. **Long Reach bypasses it; Protective Pads do not** — the
  first draft of its own description asserted the opposite for both, caught by
  reading the measurement.
- **Zero tier records changed, and that IS the open problem** — see below.
- **Carried out BOTH audits in `UU_OU_EVIDENCE.md`, and both moved nothing.**
  **Zero competitive tier movements — the entire diff is provenance.** All 91 UU
  entries were reviewed against the OU bar and retained; Meloetta stays **NU**
  and Meloetta-Pirouette stays **RU**, with Pirouette's RU now a reviewed verdict
  rather than the bookkeeping the NU pass assigned.
- **Pinned seven UU formes** at the tier they already had — Dragalge-Mega,
  Drampa-Mega, Emboar-Mega, Meganium-Mega, Scrafty-Mega, Staraptor-Mega,
  Starmie-Mega. **UU's estimated count 7 → 0**, the §10 disagreement set
  **25 → 18**, and the snapshot diff came back **exactly 14 records and not one
  more** — 7 provenance-only on the enforced `formeItems` rows and 7 `species.tier`
  alignments. **The estimator did not ripple.**
- **The delete-control on those pins is not vacuous, unlike `hawluchamega`'s.**
  The estimator produces the same UU, so the *tier* does not move — but the
  *provenance* does, and the test asserts both. Reviewing a forme and recording
  that you reviewed it are two different facts.
- **Regenerated six drifted documents** — `tiering-docs`, `uu-audit-doc`,
  `uu-final-evidence`, `ru-final-evidence`, `zu-final-evidence`, `uu-ou-evidence`.
  The packet now opens with a **RESOLVED** banner and its section F records the
  pins, the same fork `untiered-evidence.js` uses.
- **`tools/lib/profiler.js` was deliberately not touched** — see the open item.

**Earlier in that session:**

- **Built `docs/UU_OU_EVIDENCE.md`** (9,003 lines) — ONE document, TWO audits:
  **Part I, the UU → OU pass** (sections A-T, upward only) and **Part II,
  Meloetta / Meloetta-Pirouette** (sections **MEL1-MEL10** — the prefix is MEL
  and not M because Part I already has a section M, and the first draft
  collided). **No tier change was made.** Pinned by a test with three controls.
- **Corrected the open list, and this matters more than the item.** The entry
  saying *"the UU → OU pass has never been done"* was **superseded and never
  struck through**: `UU_FINAL_EVIDENCE.md` asks both directions — including
  "which UU entries are too strong for UU" — and returned *move nothing*. What is
  genuinely un-asked is narrower: that verdict was reached at **UU 86**, and
  **five entries have joined UU since, every one promoted from below** —
  Regieleki, Metagross, Raichu-Mega-Y, Pyroar-Mega (RU pass) and Chandelure
  (trapping pass). The packet states this history itself.
- **Found a fifth profiler defect, and the first that is ladder-wide.**
  `tools/lib/profiler.js` quotes moves the engine refuses at use time — **457
  lines across 387 entries**, led by Last Resort (140 BP, quoted as
  Meloetta-Pirouette's own Normal STAB, and it deals **0** when led with).
  **Reported, not fixed**: a shared fix rewrites the evidence behind five
  completed audits.
- **Found Skull Bash absent from `Mechanics.CHARGE_MOVES`** — so it is a
  single-turn 130 BP physical move here, measured at 409 into a Blissey.
- **Measured the whole Meloetta route** with controls: the transform is a stat
  **rotation** not a mirror, Serene Grace **doubles** Relic Song's sleep
  secondary (54/300 against a control 28/300 on the same seeds), and Relic Song
  goes **through a Substitute** because it is a sound move.

**The session before that:** the ZU pass (Medicham, Rampardos, Virizion, Brute
Bonnet ZU → PU); Relic Song and the move half of the forme gate; three Megas
recovered from a sprite-key bug; the untiered audit that made **ZU the floor**
and placed 473 species; Silvally reviewed on all 17 Memories and kept in ZU.

**Evidence packets, all generated and pinned by tests:**
`UU_FINAL_EVIDENCE`, `RU_FINAL_EVIDENCE`, `NU_FINAL_EVIDENCE`,
`PU_FINAL_EVIDENCE`, `ZU_FINAL_EVIDENCE`, `TRAPPING_ABILITY_TIER_AUDIT_PROMPT`,
`SILVALLY_MEMORY_EVIDENCE`, `UNTIERED_EVIDENCE` (now a **RESOLVED** record,
because its subject is empty — the generator emits that automatically), and
`UU_OU_EVIDENCE` (**new, awaiting ChatGPT on both of its parts**).

## Traps that have cost real time — please respect these

- **The estimator ripple has THREE triggers now**, not one. `estimateFormeTier`
  builds its model from every Mega whose tier resolves, so it moves when you
  (a) pin a previously-unranked forme, (b) move a base that has an `estimated`
  forme, or (c) **change the fallback rule itself** — the ZU floor did exactly
  that and drifted **Delphox-Mega UU → OU**, which had to be pinned back.
  **Check `tierSource` on every forme of anything you move**: `estimated`
  follows, `natdex` / `redgpt-override` does not. Snapshot before and after and
  diff: `node scratchpad/snap-tiers.js before.json` then
  `node scratchpad/snap-tiers.js after.json before.json`. Regenerate that script
  if the scratchpad is gone; it must stringify `tierSource`, which is an **object**
  on species and a **string** on `formeItems[]`.
- **Expect 4-6 stale tier-count pins after any tier change.** They are literals
  by design (a derived count is a tautology §8 records as worse than nothing) and
  they carry the running arithmetic of every pass. Let
  `node tests/data-validation.js` name them rather than hunting.
- **Every test needs a control, and a control that cannot fail is worse than
  none.** Three shapes to remember: a **staleness** control must **not**
  regenerate the document; a control on a *doc generator* **must** regenerate; and
  a fix that only changes behaviour under configurations nothing ships cannot be
  controlled by output — control the wiring instead.
- **Never run `npm test` while coverage-controls.js is running** — it patches
  src/** and data/** in place. Run `--verify` after any interrupted run.
- **`npm test | tail` masks the exit code** — a pipeline reports `tail`'s status.
  Run it unpiped, or check the output file.
- **Do not use `node -e` for anything containing backticks, `${...}` or `\n`.**
  Write the script to the scratchpad and run the file. **A bash heredoc is not a
  safe substitute** — one broke mid-script last session and reported a syntax
  error rather than writing anything.
- **Scripted multi-line patches silently match nothing when the line endings are
  wrong**, and this has now happened in **bash and in Python**.
  `tests/data-validation.js` and `tools/generate-data.js` are **CRLF**; most of
  `src/**`, `tests/engine-battle.js`, `docs/**` and `tools/**` are **LF**. Neither
  grep direction is a safe check — count the bytes (§8 has the one-liner). Prefer
  the Edit tool.
- **A dummy in a measurement must not heal itself** (§8, and it cost a round
  again last session): a probe that gave the defender `softboiled` read **0
  damage** for a dozen moves that were landing perfectly well. Use `splash` or
  `tackle`.
- **PowerShell `Measure-Object -Line` undercounts a document.** It reported 6,395
  lines for a file with **7,407** newlines. Count the bytes with node whenever the
  number is going into a doc.
- **A scan threshold does not transfer between rungs.** ZU's flat "three or more
  flags" rule returned **68 of 91** on UU, because "above OU's median" is true of
  most of the second-highest rung. A shortlist that is 75% of the roster is not a
  shortlist — gate on a *strong* bar and let the rest be context.
- **Ask the engine, never the packaged row.** `tools/lib/profiler.js` is the ONE
  profiler and every briefing reads it. Three live gotchas now:
  `battle.moveType` takes **(attacker, defender, move)** — a two-argument call
  silently returns `null`; `P.offence` measures with the ability **live**, which
  reads Regigigas at half Attack under Slow Start; and **it knows nothing about
  `moveSpecialFailure`**, so it quotes Last Resort, Fake Out, Belch, Steel Roller,
  Mirror Coat and Fling at full power.
- **`Dex.evolutions()` returns `[{target, method, level}]`, not names.**
- **`Dex.species()` returns a truthy UNKNOWN_SPECIES stub** — gate on
  `Dex.hasSpecies` before comparing tiers.
- **`Dex.allSpecies` and `Dex.packagedSpecies` are arrays, not functions.**
- **Verify what a Pokémon is actually carrying.** `normalizeSet` gives ability
  slot 0; that error understated 26 rows of a whole evidence packet.
- **A cap is a judgement.** A candidate list capped at 30 dropped **Regigigas**,
  the highest BST on the rung. If you must cap, say so in the document and name
  what fell below the cut.
- **Watch regex guards that fire for the wrong reason** — `\s*` can match zero
  characters, so `ZU\s*→\s*(?!PU)` matches "ZU → PU". Capture and compare instead.

Generators, all with `--check`: `tiering-docs`, `uu-audit-doc`,
`uu-final-evidence`, `ru-final-evidence`, `nu-final-evidence`,
`pu-final-evidence`, `zu-final-evidence`, `uu-ou-evidence`,
`trapping-audit-prompt`, `untiered-evidence`, `silvally-memory-evidence`,
`evidence-calcs`. Re-run the relevant ones after any tier change; several are
pinned by tests.

## What is still open

- **THREE TIER PLACEMENTS NOW REST ON ABILITIES THOSE POKÉMON NO LONGER HAVE.**
  An ability swap moves no tier by itself, so nothing shifted — but
  **Lucario-Mega-Z is Ubers on an explicit pin §10 justified on *Adaptability* by
  name**, and it now has Aura Guard. That cuts its STAB from 2x to 1.5x (−25%
  damage) while making the pin's *deciding* argument stronger, since the
  unconditional priority moves that were supposed to revenge it — Sucker Punch,
  Bullet Punch, Mach Punch, Extreme Speed, Grassy Glide, First Impression, Upper
  Hand, Aqua Jet — are **all contact**. Garchomp-Mega-Z (Ubers) and Absol-Mega-Z
  (RU) are both still `estimated`. **All three want a fresh evidence packet.**

**Tiering — the whole standard programme is otherwise closed.** Every rung has been
audited in both directions except ZU (the floor, upward only) and UU → OU
(upward only, its downward half having been asked separately). The Meloetta
question, the last open one, is settled. **Do not start another balance pass
without a reason.**

- **20 forme entries still sit on `estimated` tiers** — Ubers 4, OU 9, RU 7,
  and **UU is now 0** — and **18 have `species.tier` disagreeing with the
  enforced `formeItems` tier** (inert mechanically, wrong in the Pokédex
  display). Zeraora-Mega is the loudest: 700 BST, 153 Speed, in OU on a guess.
  This is the softest evidence left on the ladder and the natural next packet.

**Engine / housekeeping:**

- **The shared profiler's conditional-move defect is ladder-wide and unfixed.**
  Fixing `tools/lib/profiler.js` means regenerating all five sibling packets and
  updating their pins in one pass — a deliberate decision, not a side effect of
  something else.
- **`skullbash` is missing from `Mechanics.CHARGE_MOVES`.** Same shape as
  `iceball` below, but this one is **not** harmless: Skull Bash is a single-turn
  130 BP physical move here and is the top physical coverage of several UU
  entries. Divergence to keep, or table gap to close?
- **`ai.js` hardcodes `TRAPPING_ABILITIES`** as a literal set of the same three
  ids the registry already answers via the `onTrapped` hook. In sync today; a
  fourth trapping ability would be invisible to the AI.
- **`iceball` is handled by `dynamicBasePower` but missing from
  `Mechanics.DYNAMIC_POWER_MOVES`** (§10 item 5). Harmless today.
- **Damage is 0-2 HP off Smogon's calculator**, cause known and documented, left
  unfixed by decision — it would change every damage number in the game.

**Longer-standing, lower priority:**

- **Re-measure campaign balance.** §6's numbers are stale and have been for
  several sessions; the content has moved a lot since.
- **Decide whether Terapagos-Stellar and the Ogerpon Tera formes should be
  reachable** at all, or stay packaged-but-dead. All five are consistently gated
  now, so it is a clean yes/no.
- **The three authored Act 3 bosses never appear in a default run** (§9) —
  `hazardlock`, `sunburst`, `setupwarden` need 4+ Acts.

## What I might ask for next

Nothing is queued — both verdicts are implemented and the standard tiering
programme is closed. Two things are worth doing and neither needs a verdict:

- **The 20 remaining estimated formes** (Ubers 4, OU 9, RU 7). Zeraora-Mega is
  the loudest at 700 BST sitting in OU on a guess. This would follow the usual
  shape: I build the packet, ChatGPT decides, you authorise.
- **Deciding whether to fix the shared profiler's conditional-move defect.** It
  is a five-document regeneration and wants to be its own pass, not a side
  effect of something else.

Beyond tiering, §6's campaign balance numbers are stale and the content has
moved a lot since they were taken.

Confirm you've read both docs and the game is up, then wait for me.
