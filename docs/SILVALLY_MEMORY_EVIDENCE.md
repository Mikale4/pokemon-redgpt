# RedGPT Silvally — Per-Memory Evidence Packet

**Generated from the live RedGPT project** by `tools/silvally-memory-evidence.js`.
Every typing, move type, base power and damage figure is measured by building a
real battle Pokémon holding each Memory and reading the engine, **not** by
reading the packaged `Silvally-<Type>` rows.

**RedGPT has no usage, ladder, win-rate, tournament or popularity data.** None is
quoted. **This packet contains no recommendations.**

---

## Why this exists

The ZU audit held Silvally in ZU on **missing evidence rather than on a
judgement**, and said so in as many words:

> *"the current evidence packet does NOT provide exhaustive per-Memory offensive
> and defensive profiles for all 17 possible typings … Until that evidence
> exists: STAY ZU."*

The ZU packet profiles base (Normal) Silvally only, and its standardised matrix
is dominated by Explosion. This document is the missing half.

## Your task

Decide whether **Silvally** belongs in ZU or higher, now that every typing is
measured.

The question is not "is one typing strong" — it is whether **being able to
choose the typing at team-build time**, at the cost of the item slot, is worth
more than ZU can contain. Consider:

1. Which Memory is the best offensive choice, and how much does it actually add?
2. Which is the best defensive choice, and does that matter more?
3. What does spending the item slot cost it? (No Leftovers, no Boots, no Choice
   item, no Life Orb, no Assault Vest, no Ring Target.)
4. Is a 95-across-the-board stat line enough to exploit any of it?
5. Would it be an ordinary PU Pokémon or a problem there?

**This is one species.** If it stays, say so; if it moves, name the destination.

---

## A. The species

**Silvally** — Normal base, **BST 570** (95/95/95/95/95/95), ability **RKS System**

- **Every stat is 95.** There is no offensive bias to exploit and no defensive one either.
- Engine offence @252 (neutral/positive): Atk **289/317**, SpA **289/317**, Spe **289/317**
- Current tier: **ZU** (source: imported)
- **The item slot is the whole cost.** A Memory is not a forced item — Silvally
  is legal without one — but taking a typing means giving up every other item.

**Utility movepool (engine-resolved):**

- Setup: Iron Defense, Swords Dance, Work Up
- Reliable recovery: Rest | Rest: yes | Drain: none
- Priority: none
- Hazards: none | Removal: Defog | Pivot: Parting Shot, U-turn | Phazing: Roar
- Status: Thunder Wave, Toxic
- Physical coverage: Dragon Outrage 120P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Steel Iron Head 80P, Bug X-Scissor 80P, Rock Rock Slide 75P
- Special coverage: Dragon Draco Meteor 140S, Steel Steel Beam 140S, Fire Heat Wave 100S, Ice Ice Beam 95S, Water Surf 95S, Electric Thunderbolt 95S

---

## B. How the retype actually works, measured

**RKS System carries no registry hook** — the retyping is done by the engine off
the held Memory, so reading the ability definition alone finds nothing. Measured
in a real battle:

| Held item | Live types | Multi-Attack type | Multi-Attack BP | STAB? |
| --- | --- | --- | --- | --- |
| _(none)_ | Normal | Normal | 120 | **yes** |
| Bug Memory | **Bug** | Bug | 120 | **yes** |
| Dark Memory | **Dark** | Dark | 120 | **yes** |
| Dragon Memory | **Dragon** | Dragon | 120 | **yes** |
| Electric Memory | **Electric** | Electric | 120 | **yes** |
| Fairy Memory | **Fairy** | Fairy | 120 | **yes** |
| Fighting Memory | **Fighting** | Fighting | 120 | **yes** |
| Fire Memory | **Fire** | Fire | 120 | **yes** |
| Flying Memory | **Flying** | Flying | 120 | **yes** |
| Ghost Memory | **Ghost** | Ghost | 120 | **yes** |
| Grass Memory | **Grass** | Grass | 120 | **yes** |
| Ground Memory | **Ground** | Ground | 120 | **yes** |
| Ice Memory | **Ice** | Ice | 120 | **yes** |
| Poison Memory | **Poison** | Poison | 120 | **yes** |
| Psychic Memory | **Psychic** | Psychic | 120 | **yes** |
| Rock Memory | **Rock** | Rock | 120 | **yes** |
| Steel Memory | **Steel** | Steel | 120 | **yes** |
| Water Memory | **Water** | Water | 120 | **yes** |

**All 17 Memories work**, and Multi-Attack follows the Memory with STAB in
every case. The species stays `silvally` — this is a **retype**, not a forme
change, so nothing about its stats or ability moves with it.

---

## C. Defensive profile per typing

Silvally's bulk is fixed at 95/95/95; only the **typing** changes, so this table
is the entire defensive difference between one Memory and another.

| Typing | Weaknesses | Resistances | Immunities |
| --- | --- | --- | --- |
| Normal _(no Memory)_ | Fighting 2x | none | Ghost |
| **Bug** (Bug Memory) | Fire 2x, Flying 2x, Rock 2x | Fighting 0.5x, Grass 0.5x, Ground 0.5x | none |
| **Dark** (Dark Memory) | Bug 2x, Fairy 2x, Fighting 2x | Dark 0.5x, Ghost 0.5x | Psychic |
| **Dragon** (Dragon Memory) | Dragon 2x, Fairy 2x, Ice 2x | Electric 0.5x, Fire 0.5x, Grass 0.5x, Water 0.5x | none |
| **Electric** (Electric Memory) | Ground 2x | Electric 0.5x, Flying 0.5x, Steel 0.5x | none |
| **Fairy** (Fairy Memory) | Poison 2x, Steel 2x | Bug 0.5x, Dark 0.5x, Fighting 0.5x | Dragon |
| **Fighting** (Fighting Memory) | Fairy 2x, Flying 2x, Psychic 2x | Bug 0.5x, Dark 0.5x, Rock 0.5x | none |
| **Fire** (Fire Memory) | Ground 2x, Rock 2x, Water 2x | Bug 0.5x, Fairy 0.5x, Fire 0.5x, Grass 0.5x, Ice 0.5x, Steel 0.5x | none |
| **Flying** (Flying Memory) | Electric 2x, Ice 2x, Rock 2x | Bug 0.5x, Fighting 0.5x, Grass 0.5x | Ground |
| **Ghost** (Ghost Memory) | Dark 2x, Ghost 2x | Bug 0.5x, Poison 0.5x | Fighting, Normal |
| **Grass** (Grass Memory) | Bug 2x, Fire 2x, Flying 2x, Ice 2x, Poison 2x | Electric 0.5x, Grass 0.5x, Ground 0.5x, Water 0.5x | none |
| **Ground** (Ground Memory) | Grass 2x, Ice 2x, Water 2x | Poison 0.5x, Rock 0.5x | Electric |
| **Ice** (Ice Memory) | Fighting 2x, Fire 2x, Rock 2x, Steel 2x | Ice 0.5x | none |
| **Poison** (Poison Memory) | Ground 2x, Psychic 2x | Bug 0.5x, Fairy 0.5x, Fighting 0.5x, Grass 0.5x, Poison 0.5x | none |
| **Psychic** (Psychic Memory) | Bug 2x, Dark 2x, Ghost 2x | Fighting 0.5x, Psychic 0.5x | none |
| **Rock** (Rock Memory) | Fighting 2x, Grass 2x, Ground 2x, Steel 2x, Water 2x | Fire 0.5x, Flying 0.5x, Normal 0.5x, Poison 0.5x | none |
| **Steel** (Steel Memory) | Fighting 2x, Fire 2x, Ground 2x | Bug 0.5x, Dragon 0.5x, Fairy 0.5x, Flying 0.5x, Grass 0.5x, Ice 0.5x, Normal 0.5x, Psychic 0.5x, Rock 0.5x, Steel 0.5x | Poison |
| **Water** (Water Memory) | Electric 2x, Grass 2x | Fire 0.5x, Ice 0.5x, Steel 0.5x, Water 0.5x | none |

---

## D. Multi-Attack damage per typing, against a fixed core

Attacker: **Silvally**, adamant, 252 Atk / 252 Spe, **holding the Memory named in
the row** — so the damage and the item cost are shown together. Defenders are
252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

Note the attacker cannot hold Life Orb, a Choice item or Boots in any of these
rows: the Memory is in the slot.

| Memory (typing) | Regirock | Regice | Bastiodon | Dusknoir | Pyukumuku | Lapras | Mesprit | Brute Bonnet | Milotic | Aggron |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Bug Memory (Bug) | 76-90 (20.9-24.7%) | 175-206 (48.1-56.6%) | 43-51 (13.3-15.7%) | 51-60 (17.3-20.4%) | 140-164 (44.6-52.2%) | 210-247 (45.3-53.2%) | 336-395 (92.3-108.5%) | 510-600 (119.7-140.8%) | 212-250 (53.8-63.5%) | 41-49 (11.9-14.2%) |
| Dark Memory (Dark) | 76-90 (20.9-24.7%) | 175-206 (48.1-56.6%) | 87-103 (26.9-31.8%) | 206-242 (70.1-82.3%) | 140-164 (44.6-52.2%) | 210-247 (45.3-53.2%) | 336-395 (92.3-108.5%) | 63-75 (14.8-17.6%) | 212-250 (53.8-63.5%) | 83-98 (24.1-28.5%) |
| Dragon Memory (Dragon) | 76-90 (20.9-24.7%) | 175-206 (48.1-56.6%) | 43-51 (13.3-15.7%) | 103-121 (35-41.2%) | 140-164 (44.6-52.2%) | 210-247 (45.3-53.2%) | 168-197 (46.2-54.1%) | 127-150 (29.8-35.2%) | 212-250 (53.8-63.5%) | 41-49 (11.9-14.2%) |
| Electric Memory (Electric) | 76-90 (20.9-24.7%) | 175-206 (48.1-56.6%) | 87-103 (26.9-31.8%) | 103-121 (35-41.2%) | 280-329 (89.2-104.8%) | 420-495 (90.5-106.7%) | 168-197 (46.2-54.1%) | 63-75 (14.8-17.6%) | 425-500 (107.9-126.9%) | 83-98 (24.1-28.5%) |
| Fairy Memory (Fairy) | 76-90 (20.9-24.7%) | 175-206 (48.1-56.6%) | 43-51 (13.3-15.7%) | 103-121 (35-41.2%) | 140-164 (44.6-52.2%) | 210-247 (45.3-53.2%) | 168-197 (46.2-54.1%) | 255-300 (59.9-70.4%) | 212-250 (53.8-63.5%) | 41-49 (11.9-14.2%) |
| Fighting Memory (Fighting) | 153-180 (42-49.5%) | 350-412 (96.2-113.2%) | 323-323 (99.7-99.7%) | 0-0 (0-0%) | 140-164 (44.6-52.2%) | 420-495 (90.5-106.7%) | 84-98 (23.1-26.9%) | 255-300 (59.9-70.4%) | 212-250 (53.8-63.5%) | 333-343 (96.8-99.7%) |
| Fire Memory (Fire) | 38-45 (10.4-12.4%) | 350-412 (96.2-113.2%) | 87-103 (26.9-31.8%) | 103-121 (35-41.2%) | 70-82 (22.3-26.1%) | 210-247 (45.3-53.2%) | 168-197 (46.2-54.1%) | 255-300 (59.9-70.4%) | 106-125 (26.9-31.7%) | 83-98 (24.1-28.5%) |
| Flying Memory (Flying) | 38-45 (10.4-12.4%) | 175-206 (48.1-56.6%) | 21-25 (6.5-7.7%) | 103-121 (35-41.2%) | 140-164 (44.6-52.2%) | 210-247 (45.3-53.2%) | 168-197 (46.2-54.1%) | 255-300 (59.9-70.4%) | 212-250 (53.8-63.5%) | 20-24 (5.8-7%) |
| Ghost Memory (Ghost) | 76-90 (20.9-24.7%) | 175-206 (48.1-56.6%) | 87-103 (26.9-31.8%) | 206-242 (70.1-82.3%) | 140-164 (44.6-52.2%) | 210-247 (45.3-53.2%) | 336-395 (92.3-108.5%) | 63-75 (14.8-17.6%) | 212-250 (53.8-63.5%) | 83-98 (24.1-28.5%) |
| Grass Memory (Grass) | 153-180 (42-49.5%) | 175-206 (48.1-56.6%) | 87-103 (26.9-31.8%) | 103-121 (35-41.2%) | 280-329 (89.2-104.8%) | 420-495 (90.5-106.7%) | 168-197 (46.2-54.1%) | 63-75 (14.8-17.6%) | 425-500 (107.9-126.9%) | 83-98 (24.1-28.5%) |
| Ground Memory (Ground) | 153-180 (42-49.5%) | 175-206 (48.1-56.6%) | 323-323 (99.7-99.7%) | 103-121 (35-41.2%) | 140-164 (44.6-52.2%) | 210-247 (45.3-53.2%) | 168-197 (46.2-54.1%) | 63-75 (14.8-17.6%) | 212-250 (53.8-63.5%) | 333-343 (96.8-99.7%) |
| Ice Memory (Ice) | 76-90 (20.9-24.7%) | 87-103 (23.9-28.3%) | 43-51 (13.3-15.7%) | 103-121 (35-41.2%) | 70-82 (22.3-26.1%) | 52-61 (11.2-13.1%) | 168-197 (46.2-54.1%) | 255-300 (59.9-70.4%) | 106-125 (26.9-31.7%) | 41-49 (11.9-14.2%) |
| Poison Memory (Poison) | 38-45 (10.4-12.4%) | 175-206 (48.1-56.6%) | 0-0 (0-0%) | 51-60 (17.3-20.4%) | 140-164 (44.6-52.2%) | 210-247 (45.3-53.2%) | 168-197 (46.2-54.1%) | 255-300 (59.9-70.4%) | 212-250 (53.8-63.5%) | 0-0 (0-0%) |
| Psychic Memory (Psychic) | 76-90 (20.9-24.7%) | 175-206 (48.1-56.6%) | 43-51 (13.3-15.7%) | 103-121 (35-41.2%) | 140-164 (44.6-52.2%) | 210-247 (45.3-53.2%) | 84-98 (23.1-26.9%) | 0-0 (0-0%) | 212-250 (53.8-63.5%) | 41-49 (11.9-14.2%) |
| Rock Memory (Rock) | 76-90 (20.9-24.7%) | 350-412 (96.2-113.2%) | 43-51 (13.3-15.7%) | 103-121 (35-41.2%) | 140-164 (44.6-52.2%) | 420-495 (90.5-106.7%) | 168-197 (46.2-54.1%) | 127-150 (29.8-35.2%) | 212-250 (53.8-63.5%) | 41-49 (11.9-14.2%) |
| Steel Memory (Steel) | 153-180 (42-49.5%) | 350-412 (96.2-113.2%) | 87-103 (26.9-31.8%) | 103-121 (35-41.2%) | 70-82 (22.3-26.1%) | 210-247 (45.3-53.2%) | 168-197 (46.2-54.1%) | 127-150 (29.8-35.2%) | 106-125 (26.9-31.7%) | 83-98 (24.1-28.5%) |
| Water Memory (Water) | 153-180 (42-49.5%) | 175-206 (48.1-56.6%) | 175-206 (54-63.6%) | 103-121 (35-41.2%) | 70-82 (22.3-26.1%) | 105-123 (22.6-26.5%) | 168-197 (46.2-54.1%) | 63-75 (14.8-17.6%) | 106-125 (26.9-31.7%) | 166-196 (48.3-57%) |

**Baseline, no Memory (Normal Multi-Attack, still STAB):**

| _(no item)_ | 38-45 (10.4-12.4%) | 175-206 (48.1-56.6%) | 21-25 (6.5-7.7%) | 0-0 (0-0%) | 140-164 (44.6-52.2%) | 210-247 (45.3-53.2%) | 168-197 (46.2-54.1%) | 127-150 (29.8-35.2%) | 212-250 (53.8-63.5%) | 20-24 (5.8-7%) |

**And with a Life Orb instead of a Memory**, which is the trade the Memory
actually costs — Normal typing, but a 1.3x multiplier on everything:

| _(Life Orb, Normal)_ | 49-58 (13.5-15.9%) | 227-267 (62.4-73.4%) | 27-32 (8.3-9.9%) | 0-0 (0-0%) | 182-213 (58-67.8%) | 273-321 (58.8-69.2%) | 218-256 (59.9-70.3%) | 165-195 (38.7-45.8%) | 275-325 (69.8-82.5%) | 26-31 (7.6-9%) |

---

## E. Legality

Silvally is legal wherever its **own** tier allows, and the Memory is an ordinary
item — it is **not** a forme item, so there is no Absol/Absolite gate on it:

| Format | Silvally | Silvally + Fire Memory |
| --- | --- | --- |
| ZU | LEGAL | LEGAL |
| PU | LEGAL | LEGAL |
| NeverUsed | LEGAL | LEGAL |
| RarelyUsed | LEGAL | LEGAL |

The packaged `Silvally-<Type>` species are **not selectable** and carry
`requiredItem`; they exist so the Pokédex can show each typing. Nothing needs to
be gated, because the retype never crosses a tier boundary — every
`Silvally-<Type>` sits in the same tier as base Silvally.

---

## F. What this evidence still cannot settle

1. **No usage data exists**, so how often a given Memory would be chosen is
   unknowable. Every typing is presented as equally available, which it is.
2. **The item-slot cost cannot be priced mechanically.** Section D shows the
   Life Orb comparison, which is the closest the engine can get to it.
3. **Coverage moves are unchanged by the Memory.** Only Multi-Attack and the
   typing move; the rest of the movepool in section A is constant.
4. **Defensive typing is a matchup question**, not a damage question. Section C
   is the raw chart; whether Steel or Fairy is the *right* choice depends on what
   it is being switched into, which no engine reading can answer.

**If a number you need is missing, ask for it** rather than estimating.