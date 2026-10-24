# The prompt to paste alongside the UU briefing

Attach **`UU_ROSTER_FOR_TIERING.md`** — it is self-contained this time and
includes the movepools and every move change, so the other documents are
optional. Then paste everything below the line.

---

I am tiering a Pokémon battle simulator called RedGPT. It is built on the same
upstream data Pokémon Showdown uses, but it changes a great deal of that data on
purpose. I have attached a single briefing that contains the current OU and UU
rosters, the full movepool profile of every entry in both, and the complete list
of moves whose numbers differ from Showdown.

**My question: which Pokémon currently in RedGPT's OU are underwhelming enough
that they should drop to UnderUsed?**

This is the downward pass. I ran the upward one already; three entries went to
Ubers and that is reflected in the roster you have.

## Rules of engagement

**1. The attached document beats your memory, and it is exhaustive on purpose.**
Section 3 lists **every** move whose packaged numbers differ from upstream — 46
of 827 — plus the behavioural changes that do not show as numbers. If a move is
not in that list, it is exactly as you know it. Do not assume a change I have
not documented, and do not assume a move is unchanged if it is in that list.
Section 6 gives you the movepools you asked for last time.

**2. There is no cap.** Do not trim to a tidy number. If eleven entries belong
in UU, name eleven. If none do, say so and explain why OU looks healthy at the
bottom — that is a real answer.

**3. Rank by confidence, strongest first**, with a rough confidence per entry.

**4. The strongest argument is "a UU entry already does this job better."**
Both rosters' movepools are in §6 specifically so you can make that comparison
by name. *"X should drop because Y is already in UU with better bulk and the
same coverage"* is far more useful than *"X seems weak."* Name the UU Pokémon.

**5. "Underwhelming" is not "low BST."** OU contains Clodsire at 430 and
Toxapex at 495 and both earn it. Judge the role, not the stat total. §5 gives a
structural first cut of the 44 OU entries at or below UU's median BST — that is
a place to start looking, not a list of answers.

**6. Flag speculation as speculation, in the sentence where it happens.** Treat
as speculation by default: anything depending on usage or ladder data (I have
none), and any forme whose tier the document marks *estimated* — 12 in OU, 9 in
UU. Those placements are the project's own nearest-neighbour guesses.

**7. Say which of a species and its forme you mean.** 33 of the 107 OU entries
are formes reached by holding an item or by an ability. Dropping one means that
*item or ability* becomes legal in UU, not the base species — the base keeps its
own tier. Be explicit every time.

**8. Three entries have never actually been played in OU** and the document says
so: the three masked Ogerpons only became reachable on 2026-08-16. Judge them on
their mechanics, and say plainly that you are doing so without play evidence.

**9. Remember what OU has to hold.** Dropping something to UU does not remove it
from OU — it stays legal there and becomes legal in UU too. So the test is
partly "can UU take this without being warped by it?" UU already contains
Blissey, Chansey, Clefable, Scizor, Skarmory, Tyranitar, Gengar and eleven
Megas, so it is not a fragile tier — but a drop that would dominate UU is not a
drop, it is a different problem.

## What I want back

1. A ranked list, most confident first: entry name, species or forme,
   confidence, the UU Pokémon that outclasses it where one does, and two or
   three sentences of mechanical reasoning.
2. A **"considered and kept"** section — entries you looked hard at and decided
   are correctly OU, with a one-line reason each. As useful to me as the drops.
3. Any entry you think is in the *wrong direction* — something in UU that looks
   like it should be in OU. I did not ask for it, but if the data shows it, say
   so.
4. Anything you needed and the document did not give you, listed at the end. If
   a verdict turns on a specific damage calculation, name the exact attacker,
   defender, move and spread and I will run it through the real engine.

Do not restate the rosters back to me and do not summarise the document. Go
straight to the analysis.
