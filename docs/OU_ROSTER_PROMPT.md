# The prompt to paste alongside the OU roster briefing

Attach **`OU_ROSTER_FOR_TIERING.md`**, and ideally
`DIFFERENCES_FROM_SHOWDOWN.md` and `DIFFERENCES_ADDENDUM_ITEMS.md` as well.
Then paste everything below the line.

---

I am tiering a Pokémon battle simulator called RedGPT. It is built on the same
upstream data Pokémon Showdown uses, but it changes a great deal of that data on
purpose, and it imports Smogon's National Dex tiers and then corrects them where
its own rules change the answer.

I have attached the current OverUsed roster and a description of how the game
differs from Showdown.

**My question: which Pokémon currently in RedGPT's OU are too powerful for it
and should be moved up to Ubers?**

## Rules of engagement

**1. The attached documents beat your memory.** Where anything in them
contradicts what you know about Smogon tiers, the main series, or Showdown, the
documents are correct *for this game*. Every difference is a deliberate design
decision, not a bug. In particular: Terastallization does not exist in OU, Mega
Evolution needs no Key Stone and is free, several abilities are stronger than
upstream, some species carry pre-nerf base stats, and five priority moves are
unconditional. If you catch yourself reasoning from SV OU or National Dex
metagame knowledge, stop and check the documents instead.

**2. There is no cap on how many you list.** Do not trim to a tidy five or ten.
If fourteen entries belong in Ubers, name fourteen. If none of them do, say so
plainly and explain why the tier looks healthy — that is a real answer, not a
failure to engage.

**3. Rank by confidence, strongest first.** For each entry give a rough
confidence (high / medium / low is fine) and order the whole list by it. I care
more about knowing which two or three you are certain of than about a long list
with no ordering.

**4. Flag speculation as speculation, in the sentence where it happens.** If you
are extrapolating rather than reasoning from something the documents state, say
so. Treat as speculation by default: anything about a Pokémon's movepool (the
documents do not list movepools), anything depending on usage or ladder data (I
have none), and any of the thirteen forme entries whose tier the document marks
*estimated* — those placements are the project's own guesses and are the softest
evidence in the file.

**5. Give a mechanical reason for every entry.** Name the stat line, ability,
move or interaction that makes it unhealthy, and name the counterplay you
considered and why it is not enough. "It was Ubers in SV" is not a reason —
that is the starting point the current roster already reflects.

**6. Distinguish a forme from its base species.** The roster has 76 species
entries and 33 forme entries. This project bans the *forme*, never the Pokémon:
promoting Metagross-Mega means the Metagrossite becomes illegal in OU while
plain Metagross stays. Say which of the two you mean, every time.

**7. Start with the 25 that were just dropped, but do not stop there.** Those 25
moved from Ubers to OU on 2026-08-15 and are flagged in the roster; they are the
most likely to have overshot. But an entry that has been OU all along can be just
as wrong, so review the whole list.

## What I want back

1. A ranked list, most confident first: entry name, whether it is a species or a
   forme, confidence, and two or three sentences of mechanical reasoning
   including the counterplay you rejected.
2. A short **"considered and rejected"** section — entries you looked hard at and
   decided should stay in OU, with the one-line reason. This is as useful to me
   as the promotions.
3. Anything you needed and the documents did not give you, listed explicitly at
   the end, so I can generate it and re-run this.

Do not restate the roster back to me, and do not summarise the attached
documents. Go straight to the analysis.
