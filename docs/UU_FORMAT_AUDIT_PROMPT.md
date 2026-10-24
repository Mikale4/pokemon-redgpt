# Prompt — the RedGPT UU format audit

Paste this together with `docs/UU_FORMAT_AUDIT.md`.

---

You are auditing the **UnderUsed (UU) tier of Pokémon RedGPT**, a competitive
battle simulator that runs its own engine. It is **not** Pokémon Showdown, and
several of its rule changes decide tiering answers on their own. The attached
document is generated from the live game and is authoritative — where it and
your knowledge of Showdown disagree, **the document is right**.

## Your task

Go through the UU roster and tell me, in both directions:

1. **Which UU entries are too strong for UU** and should move **up to OU**.
2. **Which UU entries are too weak for UU** and should move **down to RU**.

The document gives you the OU roster as the bar above and the RU roster as the
bar below. Judge against those, not against Showdown's UU.

## Before you start — read these or you will get it wrong

- **There is no Terastallization in UU.** Discard any argument that depends on
  it. This is the single most common way to be wrong here.
- **Mega Evolution needs no Key Stone.** A Mega costs only the item slot. Compare
  a Mega against the base holding Leftovers or a Choice item, never against the
  base holding nothing.
- **Priority is unconditional.** Sucker Punch, Thunderclap, First Impression,
  Upper Hand and Grassy Glide have no activation conditions. UU's revenge
  killers are therefore better than you expect, which usually argues *against*
  promoting a fast frail sweeper.
- **Multi-hit moves are flat 25 BP per hit** (2-5 hit) and **50 BP per hit**
  (exactly 2). Triple Axel is deliberately unaffected.
- **A forme is a separate entry from its base.** Skarmory and Skarmory-Mega are
  tiered independently. Say which one you mean, every time.
- **Several base powers are restored to pre-nerf values** — Draco Meteor, Leaf
  Storm and Overheat are 140, and 30 others. The complete list is in the
  document; use it rather than your memory of the current games.
- **Check the ability.** Some UU entries have a defining ability that is not
  their first slot — Scizor's Technician, Azumarill's Huge Power. If you quote a
  number, state the ability and item it assumes.

## What I want back

For each entry you would move:

- the **name exactly as written in the document**, and whether it is a species or
  a forme;
- **UP to OU** or **DOWN to RU**;
- **confidence**: high / medium / low;
- **two or three sentences** of argument that name the specific Pokémon it
  outclasses, or that outclass it — role competition inside the tier is the
  argument that has held up best in previous passes;
- the **numbers you relied on**, with the ability and item they assume. If you do
  not have them, say so plainly and ask — I can run any calculation against the
  real engine, and a request is far cheaper than a wrong verdict.

Then, separately, a short list of entries you **considered and deliberately
left**, one line each. This matters as much as the moves: the most valuable
single result of the previous pass was a Pokémon that was *not* moved, because
its stat line said Ubers and its learnset said otherwise.

## Calibration

- **Most entries should not move.** A pass that reshuffles a third of the tier is
  measuring noise or taste. Expect a short list.
- **Be willing to return "nothing should move" in one direction.** If UU has no
  genuine over-performers, say so — that is a real finding, not a failure.
- **Rank your list** so I can implement the confident half and hold the rest.
- **Flag anything you cannot settle from the document**, and say exactly what
  measurement would settle it.

## What not to do

- Do not propose changes to stats, moves, abilities, items or mechanics. This is
  a tiering pass only.
- Do not retier anything outside UU. OU and RU are context here, not subjects.
- Do not invent damage figures. An unsourced number that looks authoritative is
  worse than no number — say what you would need measured instead.
