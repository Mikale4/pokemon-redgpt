# Paste-ready evidence packet: the final RedGPT OU → UU audit

Everything below the horizontal rule is the prompt. Paste it into the same
ChatGPT thread that produced the provisional downward list.

Generated 2026-08-16 from the live packaged data and the real RedGPT damage
engine. Nothing is written from memory.

---

This is the evidence you said was missing. It resolves every open question from
your provisional OU → UU list so your next response can be the final audit.

**Ground rules, unchanged:** this packet beats your recollection of Smogon or
the main series; no cap on how many you list; rank by confidence; flag
speculation in the sentence where it happens; say which of a species and its
forme you mean; and **do not invent usage, ladder, tournament or win-rate
data** — none exists for RedGPT.

**How this was produced.** Damage comes from `Calculator.calculate`, which
drives the real engine rather than a copy of the formula. Every spread below is
a **representative test set, not a measured standard set** — RedGPT has no usage
data. Mega formes are named directly as the species and carry **no item**,
because the stone occupies the slot. Level 100, max IVs, no weather or terrain
unless stated.

---

## A. Corrections to the previous briefing

### A1. Ivy Cudgel — the previous briefing was wrong, and it was my error

**The three masked Ogerpons have excellent STAB. The earlier profile said
otherwise and that was a bug in my tooling, not a fact about the game.**

The profiler read Ivy Cudgel's *packaged* type, which is Grass, and therefore
filed it under Grass STAB — so Ogerpon-Hearthflame reported "Fire — no damaging
STAB". Verified in the live engine:

| Mask | Forme | Ability | Ivy Cudgel resolves to | STAB |
| --- | --- | --- | --- | --- |
| Hearthflame Mask | Ogerpon-Hearthflame | **Mold Breaker** | **Fire** | 1.5x |
| Wellspring Mask | Ogerpon-Wellspring | **Water Absorb** | **Water** | 1.5x |
| Cornerstone Mask | Ogerpon-Cornerstone | **Sturdy** | **Rock** | 1.5x |

Confirmed for all three formes:

- **Ivy Cudgel is legally learnable** and passes team validation.
- **100 BP, Physical, 100% accurate, and crit ratio 2** — it crits far more
  often than a normal move.
- **The Mask's 1.2x applies to it.** Measured against an identical bare forme:
  **265-311 with the Mask against 221-260 without, base power 120 against 100,
  a clean 1.20x.** All Ogerpon formes share one stat spread, so that gap is the
  item alone.
- **The abilities work as expected** — Mold Breaker ignores the target's
  ability, Water Absorb heals on Water moves, Sturdy survives from full.
- **Embody Aspect never activates.** All four Embody Aspect abilities sit on
  Ogerpon **-Tera** formes; all four of those are `transformOnly` and
  **unreachable — nothing in the engine produces them**, and OU/UU have no
  Terastallization anyway. There is no +1 stat on entry.
- **The Mask is a forced item and cannot be removed** (`canRemoveItem` returns
  false). So no Life Orb, no Choice item, no Ring Target, no Leftovers, no
  Heavy-Duty Boots.
- **Grassy Glide is the RedGPT version on these formes**: 70 BP, **+1 priority
  applied by the engine with no Grassy Terrain requirement**. The packaged move
  still reads priority 0 — do not judge it from move data.

**None of the three has any play evidence.** They became reachable on
2026-08-16. Judge them on mechanics and say you are doing so.

### A2. Fishious Rend — legal, and much stronger than the profile implied

The profiler omitted it because of the same category filter, not because
Dracovish lacks it.

- **Legal on Dracovish**, and it passes validation.
- **85 BP packaged, 100% accurate, Water, Physical, `bite` flag set.**
- **The doubling is implemented.** `dynamicBasePower` returns **170 when the
  target has not yet acted** (Dracovish moving first) and **85 when it has**.
- **Strong Jaw boosts it, and the two stack: 170 → 255 base power.** Verified by
  running the same set with Water Absorb (170, unchanged) and Strong Jaw (255).
  Dracovish's *slot-0* ability is Water Absorb, so a set must pick Strong Jaw
  deliberately.
- **Choice Band and Choice Scarf are both legal** — Dracovish has no forced item.
- **Ring Target does not help here and does not hurt.** It pierces **type**
  immunity only. **It does NOT bypass Water Absorb, Storm Drain or Dry Skin** —
  those are ability interceptions on a different code path in `executeMove`, and
  the type chart never sees a zero.

### A3. Other profiler notes

- **Tera Blast is excluded from every coverage list** in the earlier briefing
  and here. It needs Terastallization, which OU and UU do not have.
- **Weather Ball, Terrain Pulse and Nature Power are excluded** too: their
  packaged type is Normal and reporting that would be misleading in exactly the
  cases where they matter.
- Everything else in the previous briefing's movepool section stands.

---

## B. Verified candidate data

### Ogerpon (all three masked formes)
Grass + one type, **550 BST (80/120/84/60/96/110)**, 110 Speed. Swords Dance,
Horn Leech and Synthesis for recovery, Grassy Glide at +1, Superpower and Play
Rough for coverage, Knock Off unavailable. Forced Mask.

### Dracovish
Water/Dragon **505 (90/90/100/70/80/75)**, 75 Speed. Water Absorb / **Strong
Jaw** / Sand Rush. Full item freedom.

### Mega Scolipede vs base Scolipede

| | Base Scolipede (already UU) | Mega Scolipede |
| --- | --- | --- |
| Stats | 485 (60/100/89/55/69/112) | **585 (60/140/149/75/99/62)** |
| Ability | **Speed Boost** / Swarm / Poison Point | **Shell Armor** (blocks critical hits, nothing else) |
| Item | **free** — Life Orb, Choice, Black Sludge | **locked to Scolipite** |
| Speed | **112** | **62** |
| Movepool | identical | identical |
| Setup | Swords Dance, Agility, Iron Defense | same |
| Hazards | Spikes, Toxic Spikes | same |

**The Speed is the whole story and it is the opposite of what a Mega usually
does.** Mega Scolipede is *fifty base Speed slower* than the Pokémon it comes
from, and Speed Boost is gone.

### Hawlucha
Fighting/Flying **500 (78/92/75/74/63/118)**, Limber / **Unburden** / Mold
Breaker. **Unburden verified in a real battle: Speed 368 → 736, exactly x2**,
triggered by consuming a held item. Activation is a real cost — it needs a
consumable (Sitrus, Salac, Liechi, White Herb, Focus Sash, Power Herb, a Gem,
Air Balloon, Mental Herb are all packaged), and until it is consumed Hawlucha is
a 118-Speed Pokémon.

### Mega Skarmory
Steel/Flying **565 (65/140/110/40/100/110)** against base Skarmory's
**465 (65/80/140/40/70/70)**. **Stalwart is NOT IMPLEMENTED in this build and is
inert in singles** — it only ignores move redirection, which does not exist
here. So Mega Skarmory trades Sturdy/Keen Eye/Weak Armor and full item freedom
for +60 Attack, +40 Speed, −30 Defence, +30 SpD, and **a blank ability**. It
keeps Swords Dance, Agility, Autotomize, Iron Defense, Roost, Stealth Rock,
Spikes and Defog.

### Pecharunt — Poison Puppeteer, exactly as implemented

```js
define('Poison Puppeteer', {
  onAfterInflictStatus(battle, pokemon, target, status) {
    if (status !== 'psn' && status !== 'tox') return;
    if (!target || target.fainted) return;
    battle.addVolatile(target, 'confusion', pokemon);
  },
});
```

- **Trigger:** any time *this Pokémon* inflicts poison or bad poison. It hooks
  `setStatus`, so **every route counts** — Toxic, a damaging Poison move's
  secondary, Malignant Chain, and Poison Point punishing a contact attacker.
- **Effect:** ordinary confusion. Not a new status.
- **Pecharunt has only Poison Puppeteer.** It does **not** have Toxic Chain —
  verified, not assumed.

### Iron Treads vs Excadrill

| | Iron Treads (OU) | Excadrill (UU) |
| --- | --- | --- |
| Stats | **570 (90/112/120/72/70/106)** | 508 (110/135/60/50/65/88) |
| Ability | Quark Drive (needs Electric Terrain or Booster Energy) | **Sand Rush** / Sand Force / Mold Breaker |
| Speed | **106** | 88 (**doubled in sand**) |
| Rapid Spin | yes | yes |
| Stealth Rock | yes | yes |
| Knock Off | yes | yes |
| Volt Switch | yes | no |
| Recovery | **none** | **none** |

### Gyarados vs Salamence

| | Gyarados (OU) | Salamence (UU) |
| --- | --- | --- |
| Stats | 540 (95/125/79/60/100/81) | **600 (95/135/80/110/80/100)** |
| Ability | Intimidate / Moxie | Intimidate / Moxie |
| Speed | 81 | **100** |
| Dragon Dance | yes | yes |
| Weakness | **4x Electric**, permanent | 4x Ice, permanent |

### Weavile
Dark/Ice **510 (70/120/65/45/85/125)**, Pressure / Pickpocket. Knock Off,
**Triple Axel (three hits, deliberately untouched by the multi-hit
standardisation)**, Ice Shard, Swords Dance. No Upper Hand.

### Okidogi
Poison/Fighting **555 (88/128/115/58/86/80)**, **Toxic Chain** / Guard Dog.
Bulk Up, Drain Punch, Gunk Shot, Knock Off. Compare with UU's Conkeldurr
(505, Guts/Iron Fist, Drain Punch, Mach Punch) and Buzzwole (570, Beast Boost).

### Corviknight vs Skarmory vs Celesteela
Corviknight **495 (98/87/105/53/85/67)** Pressure / Unnerve / **Mirror Armor**;
Skarmory **465 (65/80/140/40/70/70)**; Celesteela **570 (97/101/103/107/101/61)**.
All three have Roost. Corviknight and Skarmory have Defog; Skarmory has Stealth
Rock and Spikes; Corviknight has **U-turn** and Body Press; Celesteela has
Leech Seed and Heavy Slam.

---

## C. RedGPT-native damage calculations

> **Corrected 2026-08-16, and read this before trusting a row.**
>
> Two defects were found in this section and both understated damage.
>
> 1. **Rows generated without naming an ability got `normalizeSet`'s slot 0.**
>    Dracovish's slot 0 is Water Absorb, not Strong Jaw; Scizor's is Swarm, not
>    Technician. Both are 1.5x on the exact move being measured. The Azumarill
>    rows name "Huge Power" in the attacker cell and were always correct — where
>    the ability was named it was set, where it was not the default won.
> 2. **The Fishious Rend rows could not express turn order.** The calculator had
>    no way to say "the target has already moved", so the "moving first" and
>    "moving second" rows were the same calculation twice and printed identical
>    numbers. `Calculator.applyState` now takes `hasMoved` and both states are
>    real.
>
> The **Fishious Rend (21 rows)** and **Scizor Bullet Punch (5 rows)** groups
> have been regenerated from declared sets by `tools/evidence-calcs.js`, and now
> name their ability in bold so the trap cannot recur silently.
>
> **The rest of this section has NOT been re-verified.** Its attacker cells are
> inconsistent — some state EVs and a nature, some state none — so those sets
> cannot be recovered from the text, and inventing them would produce numbers
> that look authoritative and could be wrong in a new way. **Treat any row that
> does not name its ability as unchecked**, and re-derive it before leaning on
> it. The attackers whose defining ability is not slot 0 are: Azumarill (Huge
> Power), Scizor (Technician), Dracovish (Strong Jaw), Hawlucha (Unburden),
> Gengar (Levitate), Excadrill (Sand Force / Mold Breaker) and Conkeldurr
> (Sheer Force / Iron Fist).

<!-- BEGIN GENERATED CALCS -->
### Ogerpon-Hearthflame

*Grass/Fire 550 (80/120/84/60/96/110), Mold Breaker. Hearthflame Mask: forced item, +1.2x on every attack. Ivy Cudgel becomes **Fire**, 100 BP physical, crit ratio 2.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Ogerpon-Hearthflame 252 Atk Jolly, Mask | Ivy Cudgel | Skarmory 252 HP / 252+ Def Impish, Leftovers | 214-252 | 64.1-75.4% | guaranteed 2HKO after Leftovers recovery |
| Ogerpon-Hearthflame 252 Atk Jolly, Mask | Ivy Cudgel | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 44-52 | 11.2-13.2% | 8HKO – 9HKO |
| Ogerpon-Hearthflame 252 Atk Jolly, Mask | Ivy Cudgel | Salamence 252 HP / 4 Def Impish, Leftovers (Intimidate NOT applied) | 102-120 | 25.9-30.5% | 4HKO – 5HKO after Leftovers recovery |
| Ogerpon-Hearthflame 252 Atk Jolly, Mask | Ivy Cudgel | Clefable 252 HP / 252+ Def Bold, Leftovers | 164-193 | 41.6-49% | guaranteed 3HKO after Leftovers recovery |
| Ogerpon-Hearthflame 252 Atk Jolly, Mask | Ivy Cudgel | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | 83-97 | 24.1-28.2% | 5HKO – 6HKO after Leftovers recovery |
| Ogerpon-Hearthflame 252 Atk Jolly, Mask | Ivy Cudgel | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 120-142 | 28.6-33.8% | 4HKO – 5HKO after Leftovers recovery |
| Ogerpon-Hearthflame 252 Atk Jolly, Mask | Ivy Cudgel | Mew 252 HP / 252+ Def Bold, Leftovers | 135-159 | 33.4-39.4% | 3HKO – 4HKO after Leftovers recovery |
| Ogerpon-Hearthflame 252 Atk Jolly, Mask | Ivy Cudgel | Scizor 252 HP / 252+ Def Impish, Leftovers | 541-637 | 157.3-185.2% | guaranteed OHKO after Leftovers recovery |
| Ogerpon-Hearthflame 252 Atk Jolly, Mask | Ivy Cudgel | Celesteela 252 HP / 252+ Def Impish, Leftovers | 265-312 | 66.6-78.4% | guaranteed 2HKO after Leftovers recovery |
| Ogerpon-Hearthflame 252 Atk Jolly, Mask | Ivy Cudgel | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 204-240 | 63-74.1% | guaranteed 2HKO after Leftovers recovery |
| Ogerpon-Hearthflame 252 Atk Jolly, Mask | Horn Leech | Swampert 252 HP / 252+ Def Relaxed, Leftovers | 437-514 | 108.2-127.2% | guaranteed OHKO after Leftovers recovery |
| Ogerpon-Hearthflame 252 Atk Jolly, Mask — *grassy terrain* | Grassy Glide | Swampert 252 HP / 252+ Def Relaxed, Leftovers | 531-625 | 131.4-154.7% | guaranteed OHKO after Leftovers recovery and Grassy Terrain recovery |
| Ogerpon-Hearthflame 252 Atk Jolly, Mask | Superpower | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 405-476 | 100.2-117.8% | guaranteed OHKO after Leftovers recovery |
| Ogerpon-Hearthflame +2 Swords Dance, Mask | Ivy Cudgel | Skarmory 252 HP / 252+ Def Impish, Leftovers | 424-498 | 126.9-149.1% | guaranteed OHKO after Leftovers recovery |
| Ogerpon-Hearthflame +2 Swords Dance, Mask | Ivy Cudgel | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 87-103 | 22.1-26.1% | 4HKO – 5HKO |
| Ogerpon-Hearthflame +2 Swords Dance, Mask | Ivy Cudgel | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 239-281 | 56.9-66.9% | guaranteed 2HKO after Leftovers recovery |
| Ogerpon-Hearthflame +2 Swords Dance, Mask | Ivy Cudgel | Clefable 252 HP / 252+ Def Bold, Leftovers | 326-384 | 82.7-97.5% | guaranteed 2HKO after Leftovers recovery |
| Ogerpon-Hearthflame +2 Swords Dance, Mask | Ivy Cudgel | Celesteela 252 HP / 252+ Def Impish, Leftovers | 525-618 | 131.9-155.3% | guaranteed OHKO after Leftovers recovery |
| Mega Aerodactyl 252 Atk Jolly, no item | Stone Edge | Ogerpon-Hearthflame 4 HP / 252 Atk Jolly, Hearthflame Mask | 392-461 | 129.8-152.6% | guaranteed OHKO |
| Zeraora 252 Atk Jolly, Life Orb | Close Combat | Ogerpon-Hearthflame 4 HP / 252 Atk Jolly, Hearthflame Mask | 178-209 | 58.9-69.2% | guaranteed 2HKO |
| Weavile 252 Atk Jolly, Life Orb | Knock Off | Ogerpon-Hearthflame 4 HP / 252 Atk Jolly, Hearthflame Mask | 227-267 | 75.2-88.4% | guaranteed 2HKO |
| Scizor 252 Atk Adamant, Choice Band, **Technician** | Bullet Punch | Ogerpon-Hearthflame 4 HP / 252 Atk Jolly, Hearthflame Mask | 94-111 | 31.1-36.8% | 3HKO – 4HKO |

### Ogerpon-Wellspring

*Grass/Water 550, Water Absorb. Ivy Cudgel becomes **Water**.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Ogerpon-Wellspring 252 Atk Jolly, Mask | Ivy Cudgel | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 241-284 | 57.4-67.6% | guaranteed 2HKO after Leftovers recovery |
| Ogerpon-Wellspring 252 Atk Jolly, Mask | Ivy Cudgel | Skarmory 252 HP / 252+ Def Impish, Leftovers | 107-126 | 32-37.7% | 3HKO – 4HKO after Leftovers recovery |
| Ogerpon-Wellspring 252 Atk Jolly, Mask | Ivy Cudgel | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 44-52 | 11.2-13.2% | 8HKO – 9HKO |
| Ogerpon-Wellspring 252 Atk Jolly, Mask | Ivy Cudgel | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 254-298 | 62.9-73.8% | guaranteed 2HKO after Leftovers recovery |
| Ogerpon-Wellspring 252 Atk Jolly, Mask | Ivy Cudgel | Salamence 252 HP / 4 Def Impish, Leftovers (Intimidate NOT applied) | 102-120 | 25.9-30.5% | 4HKO – 5HKO after Leftovers recovery |
| Ogerpon-Wellspring 252 Atk Jolly, Mask | Ivy Cudgel | Clefable 252 HP / 252+ Def Bold, Leftovers | 164-193 | 41.6-49% | guaranteed 3HKO after Leftovers recovery |
| Ogerpon-Wellspring 252 Atk Jolly, Mask | Ivy Cudgel | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | 83-97 | 24.1-28.2% | 5HKO – 6HKO after Leftovers recovery |
| Ogerpon-Wellspring 252 Atk Jolly, Mask | Ivy Cudgel | Excadrill 252 HP / 4 Def Adamant, Leftovers | 560-658 | 132.1-155.2% | guaranteed OHKO after Leftovers recovery |
| Ogerpon-Wellspring 252 Atk Jolly, Mask | Horn Leech | Rotom-Wash 252 HP / 252+ Def Bold, Leftovers | 195-229 | 64.1-75.3% | guaranteed 2HKO after Leftovers recovery |
| Ogerpon-Wellspring 252 Atk Jolly, Mask — *grassy terrain* | Grassy Glide | Rotom-Wash 252 HP / 252+ Def Bold, Leftovers | 237-278 | 78-91.4% | guaranteed 2HKO after Leftovers recovery |
| Ogerpon-Wellspring 252 Atk Jolly, Mask | Play Rough | Salamence 252 HP / 4 Def Impish, Leftovers (Intimidate NOT applied) | 245-288 | 62.2-73.1% | guaranteed 2HKO after Leftovers recovery |
| Ogerpon-Wellspring +2 Swords Dance, Mask | Ivy Cudgel | Skarmory 252 HP / 252+ Def Impish, Leftovers | 212-249 | 63.5-74.6% | guaranteed 2HKO after Leftovers recovery |
| Ogerpon-Wellspring +2 Swords Dance, Mask | Ivy Cudgel | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 478-563 | 113.8-134% | guaranteed OHKO after Leftovers recovery |
| Ogerpon-Wellspring +2 Swords Dance, Mask | Ivy Cudgel | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 87-103 | 22.1-26.1% | 4HKO – 5HKO |
| Ogerpon-Wellspring +2 Swords Dance, Mask | Ivy Cudgel | Celesteela 252 HP / 252+ Def Impish, Leftovers | 262-309 | 65.8-77.6% | guaranteed 2HKO after Leftovers recovery |

### Ogerpon-Cornerstone

*Grass/Rock 550, Sturdy. Ivy Cudgel becomes **Rock**.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Ogerpon-Cornerstone 252 Atk Jolly, Mask | Ivy Cudgel | Moltres 252 HP / 4 SpD Bold, Leftovers | 745-877 | 194-228.4% | guaranteed OHKO after Leftovers recovery |
| Ogerpon-Cornerstone 252 Atk Jolly, Mask | Ivy Cudgel | Skarmory 252 HP / 252+ Def Impish, Leftovers | 107-126 | 32-37.7% | 3HKO – 4HKO after Leftovers recovery |
| Ogerpon-Cornerstone 252 Atk Jolly, Mask | Ivy Cudgel | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 88-104 | 22.3-26.4% | 4HKO – 5HKO |
| Ogerpon-Cornerstone 252 Atk Jolly, Mask | Ivy Cudgel | Celesteela 252 HP / 252+ Def Impish, Leftovers | 132-156 | 33.2-39.2% | 3HKO – 4HKO after Leftovers recovery |
| Ogerpon-Cornerstone 252 Atk Jolly, Mask | Ivy Cudgel | Salamence 252 HP / 4 Def Impish, Leftovers (Intimidate NOT applied) | 408-480 | 103.6-121.8% | guaranteed OHKO after Leftovers recovery |
| Ogerpon-Cornerstone 252 Atk Jolly, Mask | Ivy Cudgel | Victini 252 HP / 4 Def Adamant, Leftovers | 372-438 | 92.1-108.4% | 1HKO – 2HKO after Leftovers recovery |
| Ogerpon-Cornerstone 252 Atk Jolly, Mask | Ivy Cudgel | Clefable 252 HP / 252+ Def Bold, Leftovers | 164-193 | 41.6-49% | guaranteed 3HKO after Leftovers recovery |
| Ogerpon-Cornerstone 252 Atk Jolly, Mask | Horn Leech | Swampert 252 HP / 252+ Def Relaxed, Leftovers | 437-514 | 108.2-127.2% | guaranteed OHKO after Leftovers recovery |
| Ogerpon-Cornerstone 252 Atk Jolly, Mask | Superpower | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 405-476 | 100.2-117.8% | guaranteed OHKO after Leftovers recovery |
| Ogerpon-Cornerstone +2 Swords Dance, Mask | Ivy Cudgel | Skarmory 252 HP / 252+ Def Impish, Leftovers | 212-249 | 63.5-74.6% | guaranteed 2HKO after Leftovers recovery |
| Ogerpon-Cornerstone +2 Swords Dance, Mask | Ivy Cudgel | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 119-140 | 28.3-33.3% | 4HKO – 5HKO after Leftovers recovery |
| Ogerpon-Cornerstone +2 Swords Dance, Mask | Ivy Cudgel | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 175-206 | 44.4-52.3% | 2HKO – 3HKO |

### Dracovish

*Water/Dragon 505 (90/90/100/70/80/75), Strong Jaw. Fishious Rend doubles when the user moves first.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving FIRST (Fishious Rend doubled, 170 BP) | Fishious Rend | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 125-147 | 31.7-37.3% | 3HKO – 4HKO |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving SECOND (not doubled, 85 BP) | Fishious Rend | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 63-74 | 16-18.8% | guaranteed 4HKO |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving FIRST (Fishious Rend doubled, 170 BP) | Fishious Rend | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | 236-278 | 68.6-80.8% | guaranteed 2HKO after Leftovers recovery |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving SECOND (not doubled, 85 BP) | Fishious Rend | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | 118-139 | 34.3-40.4% | 2HKO – 3HKO after Leftovers recovery |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving FIRST (Fishious Rend doubled, 170 BP) | Fishious Rend | Primarina 252 HP / 252+ SpD Calm, Leftovers | 341-402 | 93.7-110.4% | 1HKO – 2HKO after Leftovers recovery |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving SECOND (not doubled, 85 BP) | Fishious Rend | Primarina 252 HP / 252+ SpD Calm, Leftovers | 170-201 | 46.7-55.2% | guaranteed 2HKO after Leftovers recovery |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving FIRST (Fishious Rend doubled, 170 BP) | Fishious Rend | Rotom-Wash 252 HP / 252+ Def Bold, Leftovers | 183-215 | 60.2-70.7% | guaranteed 2HKO after Leftovers recovery |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving SECOND (not doubled, 85 BP) | Fishious Rend | Rotom-Wash 252 HP / 252+ Def Bold, Leftovers | 92-108 | 30.3-35.5% | 2HKO – 3HKO after Leftovers recovery |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving FIRST (Fishious Rend doubled, 170 BP) | Fishious Rend | Swampert 252 HP / 252+ Def Relaxed, Leftovers | 412-484 | 102-119.8% | guaranteed OHKO after Leftovers recovery |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving SECOND (not doubled, 85 BP) | Fishious Rend | Swampert 252 HP / 252+ Def Relaxed, Leftovers | 206-243 | 51-60.1% | guaranteed 2HKO after Leftovers recovery |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving FIRST (Fishious Rend doubled, 170 BP) | Fishious Rend | Mega Venusaur 252 HP / 252+ Def Bold, no item (stone) | 166-196 | 45.6-53.8% | 2HKO – 3HKO |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving SECOND (not doubled, 85 BP) | Fishious Rend | Mega Venusaur 252 HP / 252+ Def Bold, no item (stone) | 83-98 | 22.8-26.9% | guaranteed 3HKO |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving FIRST (Fishious Rend doubled, 170 BP) | Fishious Rend | Hydrapple 252 HP / 252+ SpD Calm, Leftovers | 123-144 | 29.6-34.6% | 4HKO – 5HKO after Leftovers recovery |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving SECOND (not doubled, 85 BP) | Fishious Rend | Hydrapple 252 HP / 252+ SpD Calm, Leftovers | 61-72 | 14.7-17.3% | 4HKO – 5HKO after Leftovers recovery |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving FIRST (Fishious Rend doubled, 170 BP) | Fishious Rend | Goodra-Hisui 252 HP / 252+ SpD Calm, Leftovers | 266-313 | 73.1-86% | guaranteed 2HKO after Leftovers recovery |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving SECOND (not doubled, 85 BP) | Fishious Rend | Goodra-Hisui 252 HP / 252+ SpD Calm, Leftovers | 133-157 | 36.5-43.1% | guaranteed 2HKO after Leftovers recovery |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving FIRST (Fishious Rend doubled, 170 BP) | Fishious Rend | Blissey 252 HP / 252+ Def Bold, Leftovers | 966-1137 | 135.3-159.2% | guaranteed OHKO after Leftovers recovery |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving SECOND (not doubled, 85 BP) | Fishious Rend | Blissey 252 HP / 252+ Def Bold, Leftovers | 482-567 | 67.5-79.4% | guaranteed 2HKO after Leftovers recovery |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving FIRST (Fishious Rend doubled, 170 BP) | Fishious Rend | Skarmory 252 HP / 252+ Def Impish, Leftovers | 303-357 | 90.7-106.9% | 1HKO – 2HKO after Leftovers recovery |
| Dracovish 252 Atk Adamant, Choice Band, **Strong Jaw**, moving SECOND (not doubled, 85 BP) | Fishious Rend | Skarmory 252 HP / 252+ Def Impish, Leftovers | 152-179 | 45.5-53.6% | guaranteed 2HKO after Leftovers recovery |
| Dracovish 252 Atk / 252 Spe Jolly, Choice Scarf, **Strong Jaw**, moving FIRST (doubled, 170 BP) | Fishious Rend | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 76-90 | 19.3-22.8% | 5HKO – 6HKO |
| Dracovish Choice Band | Psychic Fangs | Mega Venusaur 252 HP / 252+ Def Bold, no item (stone) | 150-176 | 41.2-48.4% | guaranteed 3HKO |
| Dracovish Choice Band | Crunch | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 107-126 | 27.2-32% | guaranteed 4HKO |
| Zeraora 252 Atk Jolly, Life Orb | Plasma Fists | Dracovish 4 HP / 252 Atk Adamant, Choice Band | 193-227 | 59.9-70.5% | guaranteed 2HKO |
| Mega Aerodactyl 252 Atk Jolly | Stone Edge | Dracovish 4 HP / 252 Atk Adamant, Choice Band | 170-200 | 52.8-62.1% | guaranteed 2HKO |
| Terrakion 252 Atk Jolly, Life Orb | Close Combat | Dracovish 4 HP / 252 Atk Adamant, Choice Band | 254-300 | 78.9-93.2% | guaranteed 2HKO |

### Mega Scolipede

*Bug/Poison 585 (60/140/149/75/99/62), Shell Armor (blocks crits only). Item locked to Scolipite. Base Scolipede is already UU with Speed Boost and item freedom.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Mega Scolipede 252 Atk Adamant, no item | Megahorn | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 217-255 | 55.1-64.7% | guaranteed 2HKO |
| Mega Scolipede +2 Swords Dance, no item | Megahorn | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 429-505 | 108.9-128.2% | guaranteed OHKO |
| Mega Scolipede 252 Atk Adamant, no item | Megahorn | Mew 252 HP / 252+ Def Bold, Leftovers | 331-389 | 81.9-96.3% | guaranteed 2HKO after Leftovers recovery |
| Mega Scolipede +2 Swords Dance, no item | Megahorn | Mew 252 HP / 252+ Def Bold, Leftovers | 657-773 | 162.6-191.3% | guaranteed OHKO after Leftovers recovery |
| Mega Scolipede 252 Atk Adamant, no item | Megahorn | Clefable 252 HP / 252+ Def Bold, Leftovers | 100-118 | 25.4-29.9% | 4HKO – 5HKO after Leftovers recovery |
| Mega Scolipede +2 Swords Dance, no item | Megahorn | Clefable 252 HP / 252+ Def Bold, Leftovers | 200-235 | 50.8-59.6% | 2HKO – 3HKO after Leftovers recovery |
| Mega Scolipede 252 Atk Adamant, no item | Megahorn | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 310-365 | 76.7-90.3% | guaranteed 2HKO after Leftovers recovery |
| Mega Scolipede +2 Swords Dance, no item | Megahorn | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 616-724 | 152.5-179.2% | guaranteed OHKO after Leftovers recovery |
| Mega Scolipede 252 Atk Adamant, no item | Megahorn | Skarmory 252 HP / 252+ Def Impish, Leftovers | 32-38 | 9.6-11.4% | possible 18HKO after Leftovers recovery |
| Mega Scolipede +2 Swords Dance, no item | Megahorn | Skarmory 252 HP / 252+ Def Impish, Leftovers | 64-76 | 19.2-22.8% | 6HKO – 8HKO after Leftovers recovery |
| Mega Scolipede 252 Atk Adamant, no item | Megahorn | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 147-173 | 35-41.2% | 3HKO – 4HKO after Leftovers recovery |
| Mega Scolipede +2 Swords Dance, no item | Megahorn | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 293-344 | 69.8-81.9% | guaranteed 2HKO after Leftovers recovery |
| Mega Scolipede 252 Atk Adamant, no item | Megahorn | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 31-36 | 9.6-11.1% | possible 19HKO after Leftovers recovery |
| Mega Scolipede +2 Swords Dance, no item | Megahorn | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 61-72 | 18.8-22.2% | 6HKO – 8HKO after Leftovers recovery |
| Mega Scolipede +2 Swords Dance | Poison Jab | Clefable 252 HP / 252+ Def Bold, Leftovers | 535-629 | 135.8-159.6% | guaranteed OHKO after Leftovers recovery |
| Mega Scolipede +2 Swords Dance | Superpower | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 821-966 | 203.2-239.1% | guaranteed OHKO after Leftovers recovery |
| Mega Scolipede +2 Swords Dance | Steel Roller | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | 292-343 | 84.9-99.7% | guaranteed 2HKO after Leftovers recovery |
| BASE Scolipede +2 Swords Dance, Life Orb (comparison) | Megahorn | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 440-518 | 111.7-131.5% | guaranteed OHKO |
| BASE Scolipede +2 Swords Dance, Life Orb (comparison) | Megahorn | Mew 252 HP / 252+ Def Bold, Leftovers | 674-793 | 166.8-196.3% | guaranteed OHKO after Leftovers recovery |
| Mega Aerodactyl 252 Atk Jolly | Stone Edge | Mega Scolipede 4 HP / 252 Atk Adamant, no item (stone) | 241-284 | 92-108.4% | 1HKO – 2HKO |
| Victini 252 Atk Adamant, Choice Band | V-create | Mega Scolipede 4 HP / 252 Atk Adamant, no item (stone) | 573-674 | 218.7-257.3% | guaranteed OHKO |

### Hawlucha

*Fighting/Flying 500 (78/92/75/74/63/118), Unburden doubles Speed once its item is consumed.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Close Combat | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 80-94 | 20.3-23.9% | guaranteed 5HKO |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Acrobatics | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 147-174 | 37.3-44.2% | guaranteed 3HKO |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Close Combat | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | 151-178 | 43.9-51.7% | guaranteed 3HKO after Leftovers recovery |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Acrobatics | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | 278-327 | 80.8-95.1% | guaranteed 2HKO after Leftovers recovery |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Close Combat | Clefable 252 HP / 252+ Def Bold, Leftovers | 149-176 | 37.8-44.7% | guaranteed 3HKO after Leftovers recovery |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Acrobatics | Clefable 252 HP / 252+ Def Bold, Leftovers | 274-323 | 69.5-82% | guaranteed 2HKO after Leftovers recovery |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Close Combat | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | **immune** | 0% | — |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Acrobatics | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 84-99 | 25.9-30.6% | 4HKO – 5HKO after Leftovers recovery |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Close Combat | Skarmory 252 HP / 252+ Def Impish, Leftovers | 194-229 | 58.1-68.6% | guaranteed 2HKO after Leftovers recovery |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Acrobatics | Skarmory 252 HP / 252+ Def Impish, Leftovers | 89-105 | 26.6-31.4% | 4HKO – 5HKO after Leftovers recovery |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Close Combat | Salamence 252 HP / 4 Def Impish, Leftovers (Intimidate NOT applied) | 186-219 | 47.2-55.6% | 2HKO – 3HKO after Leftovers recovery |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Acrobatics | Salamence 252 HP / 4 Def Impish, Leftovers (Intimidate NOT applied) | 341-402 | 86.5-102% | 1HKO – 2HKO after Leftovers recovery |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Close Combat | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 219-258 | 52.1-61.4% | 2HKO – 3HKO after Leftovers recovery |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Acrobatics | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 201-237 | 47.9-56.4% | 2HKO – 3HKO after Leftovers recovery |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Close Combat | Mew 252 HP / 252+ Def Bold, Leftovers | 123-144 | 30.4-35.6% | guaranteed 4HKO after Leftovers recovery |
| Hawlucha +2 Swords Dance, no item (Unburden active) | Acrobatics | Mew 252 HP / 252+ Def Bold, Leftovers | 225-265 | 55.7-65.6% | guaranteed 2HKO after Leftovers recovery |
| Hawlucha +0, no item | Close Combat | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 466-549 | 115.3-135.9% | guaranteed OHKO after Leftovers recovery |
| Scizor 252 Atk Adamant, Choice Band, **Technician** | Bullet Punch | Hawlucha 4 HP / 252 Atk Adamant, no item (Unburden consumed it) | 206-243 | 69.1-81.5% | guaranteed 2HKO |
| Azumarill 252 Atk Adamant, Choice Band, Huge Power | Aqua Jet | Hawlucha 4 HP / 252 Atk Adamant, no item (Unburden consumed it) | 153-180 | 51.3-60.4% | guaranteed 2HKO |
| Mega Aerodactyl 252 Atk Jolly | Stone Edge | Hawlucha 4 HP / 252 Atk Adamant, no item (Unburden consumed it) | 215-252 | 72.1-84.6% | guaranteed 2HKO |

### Mega Skarmory

*Steel/Flying 565 (65/140/110/40/100/110), **Stalwart — inert in singles** (it only ignores redirection). Item locked to Skarmorite.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Mega Skarmory +2 Swords Dance, no item | Brave Bird | Rotom-Wash 252 HP / 252+ Def Bold, Leftovers | 156-184 | 51.3-60.5% | 2HKO – 3HKO after Leftovers recovery |
| Mega Skarmory +2 Swords Dance, no item | Iron Head | Rotom-Wash 252 HP / 252+ Def Bold, Leftovers | 52-61 | 17.1-20.1% | 7HKO – 9HKO after Leftovers recovery |
| Mega Skarmory +2 Swords Dance, no item | Brave Bird | Swampert 252 HP / 252+ Def Relaxed, Leftovers | 351-414 | 86.9-102.5% | 1HKO – 2HKO after Leftovers recovery |
| Mega Skarmory +2 Swords Dance, no item | Iron Head | Swampert 252 HP / 252+ Def Relaxed, Leftovers | 117-138 | 29-34.2% | 4HKO – 5HKO after Leftovers recovery |
| Mega Skarmory +2 Swords Dance, no item | Brave Bird | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 123-145 | 38-44.8% | guaranteed 3HKO after Leftovers recovery |
| Mega Skarmory +2 Swords Dance, no item | Iron Head | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 82-97 | 25.3-29.9% | 4HKO – 5HKO after Leftovers recovery |
| Mega Skarmory +2 Swords Dance, no item | Brave Bird | Victini 252 HP / 4 Def Adamant, Leftovers | 453-533 | 112.1-131.9% | guaranteed OHKO after Leftovers recovery |
| Mega Skarmory +2 Swords Dance, no item | Iron Head | Victini 252 HP / 4 Def Adamant, Leftovers | 151-178 | 37.4-44.1% | 3HKO – 4HKO after Leftovers recovery |
| Mega Skarmory +2 Swords Dance, no item | Brave Bird | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 214-252 | 54.3-64% | guaranteed 2HKO |
| Mega Skarmory +2 Swords Dance, no item | Iron Head | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 71-84 | 18-21.3% | 5HKO – 6HKO |
| Mega Skarmory +2 Swords Dance, no item | Brave Bird | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 293-344 | 69.8-81.9% | guaranteed 2HKO after Leftovers recovery |
| Mega Skarmory +2 Swords Dance, no item | Iron Head | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 196-230 | 46.7-54.8% | 2HKO – 3HKO after Leftovers recovery |
| Mega Skarmory +2 Swords Dance, no item | Brave Bird | Celesteela 252 HP / 252+ Def Impish, Leftovers | 160-189 | 40.2-47.5% | guaranteed 3HKO after Leftovers recovery |
| Mega Skarmory +2 Swords Dance, no item | Iron Head | Celesteela 252 HP / 252+ Def Impish, Leftovers | 107-126 | 26.9-31.7% | 4HKO – 5HKO after Leftovers recovery |
| Mega Skarmory +2 Swords Dance, no item | Brave Bird | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 154-181 | 38.1-44.8% | guaranteed 3HKO after Leftovers recovery |
| Mega Skarmory +2 Swords Dance, no item | Iron Head | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 412-485 | 102-120% | guaranteed OHKO after Leftovers recovery |
| Mega Skarmory +0, no item | Brave Bird | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 108-127 | 27.4-32.2% | guaranteed 4HKO |
| Mega Skarmory +0, no item | Body Press | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 173-204 | 42.8-50.5% | guaranteed 3HKO after Leftovers recovery |
| Rotom-Wash 252 SpA Modest, Choice Specs | Thunderbolt | Mega Skarmory 4 HP / 252 Atk Adamant, no item (stone) | 443-521 | 162.9-191.5% | guaranteed OHKO |
| Victini 252 Atk Adamant, Choice Band | V-create | Mega Skarmory 4 HP / 252 Atk Adamant, no item (stone) | 746-877 | 274.3-322.4% | guaranteed OHKO |
| Zeraora 252 Atk Jolly, Life Orb | Plasma Fists | Mega Skarmory 4 HP / 252 Atk Adamant, no item (stone) | 357-419 | 131.3-154% | guaranteed OHKO |

### Pecharunt

*Poison/Ghost 600 (88/88/160/88/88/88), Poison Puppeteer.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Pecharunt 252 SpA Modest, Leftovers | Malignant Chain | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 69-82 | 17.1-20.3% | 7HKO – 9HKO after Leftovers recovery |
| Pecharunt +2 Nasty Plot, Leftovers | Malignant Chain | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 138-162 | 34.2-40.1% | 3HKO – 4HKO after Leftovers recovery |
| Pecharunt 252 SpA Modest, Leftovers | Malignant Chain | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | **immune** | 0% | — |
| Pecharunt +2 Nasty Plot, Leftovers | Malignant Chain | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | **immune** | 0% | — |
| Pecharunt 252 SpA Modest, Leftovers | Malignant Chain | Gengar 4 HP / 252 SpA Timid, Life Orb | 44-51 | 16.8-19.5% | guaranteed 6HKO |
| Pecharunt +2 Nasty Plot, Leftovers | Malignant Chain | Gengar 4 HP / 252 SpA Timid, Life Orb | 87-103 | 33.2-39.3% | 3HKO – 4HKO |
| Pecharunt 252 SpA Modest, Leftovers | Malignant Chain | Blissey 252 HP / 252+ Def Bold, Leftovers | 108-127 | 15.1-17.8% | 9HKO – 11HKO after Leftovers recovery |
| Pecharunt +2 Nasty Plot, Leftovers | Malignant Chain | Blissey 252 HP / 252+ Def Bold, Leftovers | 213-251 | 29.8-35.2% | guaranteed 4HKO after Leftovers recovery |
| Pecharunt 252 SpA Modest, Leftovers | Malignant Chain | Chansey 252 HP / 252+ Def Bold, Eviolite | 90-106 | 12.8-15.1% | 7HKO – 8HKO |
| Pecharunt +2 Nasty Plot, Leftovers | Malignant Chain | Chansey 252 HP / 252+ Def Bold, Eviolite | 177-209 | 25.1-29.7% | guaranteed 4HKO |
| Pecharunt 252 SpA Modest, Leftovers | Malignant Chain | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 167-197 | 42.4-50% | 2HKO – 3HKO |
| Pecharunt +2 Nasty Plot, Leftovers | Malignant Chain | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 332-391 | 84.3-99.2% | guaranteed 2HKO |
| Pecharunt 252 SpA Modest, Leftovers | Malignant Chain | Mew 252 HP / 252+ Def Bold, Leftovers | 139-164 | 34.4-40.6% | 3HKO – 4HKO after Leftovers recovery |
| Pecharunt +2 Nasty Plot, Leftovers | Malignant Chain | Mew 252 HP / 252+ Def Bold, Leftovers | 276-325 | 68.3-80.4% | guaranteed 2HKO after Leftovers recovery |
| Pecharunt 252 SpA Modest, Leftovers | Malignant Chain | Hydreigon 252 HP / 4 SpD Modest, Leftovers | 151-178 | 38.9-45.9% | guaranteed 3HKO after Leftovers recovery |
| Pecharunt +2 Nasty Plot, Leftovers | Malignant Chain | Hydreigon 252 HP / 4 SpD Modest, Leftovers | 300-353 | 77.3-91% | guaranteed 2HKO after Leftovers recovery |
| Pecharunt 252 Atk Adamant, Leftovers | Poltergeist | Mew 252 HP / 252+ Def Bold, Leftovers | 222-261 | 55-64.6% | guaranteed 2HKO after Leftovers recovery |
| Pecharunt 252 Atk Adamant, Leftovers | Foul Play | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 30-35 | 7.4-8.7% | not a KO after Leftovers recovery |

### Iron Treads vs Excadrill

*Both Ground/Steel spinners. Iron Treads 570 (90/112/120/72/70/106) Quark Drive; Excadrill 508 (110/135/60/50/65/88) Sand Rush / Mold Breaker.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Iron Treads 252 Atk Jolly, Leftovers | Earthquake | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 71-83 | 18-21.1% | 5HKO – 6HKO |
| Excadrill 252 Atk Adamant, Leftovers | Earthquake | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 88-104 | 22.3-26.4% | 4HKO – 5HKO |
| Iron Treads 252 Atk Jolly, Leftovers | Earthquake | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 96-113 | 22.9-26.9% | 5HKO – 6HKO after Leftovers recovery |
| Excadrill 252 Atk Adamant, Leftovers | Earthquake | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 120-141 | 28.6-33.6% | 4HKO – 5HKO after Leftovers recovery |
| Iron Treads 252 Atk Jolly, Leftovers | Earthquake | Rotom-Wash 252 HP / 252+ Def Bold, Leftovers | 206-242 | 67.8-79.6% | guaranteed 2HKO after Leftovers recovery |
| Excadrill 252 Atk Adamant, Leftovers | Earthquake | Rotom-Wash 252 HP / 252+ Def Bold, Leftovers | 257-302 | 84.5-99.3% | guaranteed 2HKO after Leftovers recovery |
| Iron Treads 252 Atk Jolly, Leftovers | Earthquake | Skarmory 252 HP / 252+ Def Impish, Leftovers | **immune** | 0% | — |
| Excadrill 252 Atk Adamant, Leftovers | Earthquake | Skarmory 252 HP / 252+ Def Impish, Leftovers | **immune** | 0% | — |
| Iron Treads 252 Atk Jolly, Leftovers | Earthquake | Swampert 252 HP / 252+ Def Relaxed, Leftovers | 115-136 | 28.5-33.7% | 4HKO – 5HKO after Leftovers recovery |
| Excadrill 252 Atk Adamant, Leftovers | Earthquake | Swampert 252 HP / 252+ Def Relaxed, Leftovers | 144-169 | 35.6-41.8% | 3HKO – 4HKO after Leftovers recovery |
| Iron Treads 252 Atk Jolly | Iron Head | Clefable 252 HP / 252+ Def Bold, Leftovers | 210-248 | 53.3-62.9% | guaranteed 2HKO after Leftovers recovery |
| Excadrill 252 Atk Adamant | Iron Head | Clefable 252 HP / 252+ Def Bold, Leftovers | 263-309 | 66.8-78.4% | guaranteed 2HKO after Leftovers recovery |
| Rotom-Wash Choice Specs | Hydro Pump | Iron Treads 4 HP / 252 Atk Jolly, Leftovers | 747-878 | 232-272.7% | guaranteed OHKO after Leftovers recovery |
| Rotom-Wash Choice Specs | Hydro Pump | Excadrill 252 HP / 4 Def Adamant, Leftovers | 791-931 | 186.6-219.6% | guaranteed OHKO after Leftovers recovery |

### Gyarados vs Salamence

*Gyarados 540 (95/125/79/60/100/81) Intimidate / Moxie; Salamence 600 (95/135/80/110/80/100) Intimidate / Moxie.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Gyarados +1 Dragon Dance, Leftovers | Waterfall | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 50-58 | 12.7-14.7% | 7HKO – 8HKO |
| Salamence +1 Dragon Dance, Life Orb (UU comparator) | Dragon Claw | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 136-161 | 34.5-40.9% | guaranteed 3HKO |
| Gyarados +1 Dragon Dance, Leftovers | Waterfall | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | 93-110 | 27-32% | 4HKO – 5HKO after Leftovers recovery |
| Salamence +1 Dragon Dance, Life Orb (UU comparator) | Dragon Claw | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | **immune** | 0% | — |
| Gyarados +1 Dragon Dance, Leftovers | Waterfall | Rotom-Wash 252 HP / 252+ Def Bold, Leftovers | 72-85 | 23.7-28% | 5HKO – 6HKO after Leftovers recovery |
| Salamence +1 Dragon Dance, Life Orb (UU comparator) | Dragon Claw | Rotom-Wash 252 HP / 252+ Def Bold, Leftovers | 198-234 | 65.1-77% | guaranteed 2HKO after Leftovers recovery |
| Gyarados +1 Dragon Dance, Leftovers | Waterfall | Skarmory 252 HP / 252+ Def Impish, Leftovers | 120-142 | 35.9-42.5% | 3HKO – 4HKO after Leftovers recovery |
| Salamence +1 Dragon Dance, Life Orb (UU comparator) | Dragon Claw | Skarmory 252 HP / 252+ Def Impish, Leftovers | 81-97 | 24.3-29% | 5HKO – 6HKO after Leftovers recovery |
| Gyarados +1 Dragon Dance, Leftovers | Waterfall | Clefable 252 HP / 252+ Def Bold, Leftovers | 185-218 | 47-55.3% | 2HKO – 3HKO after Leftovers recovery |
| Salamence +1 Dragon Dance, Life Orb (UU comparator) | Dragon Claw | Clefable 252 HP / 252+ Def Bold, Leftovers | **immune** | 0% | — |
| Gyarados +1 Dragon Dance, Leftovers | Waterfall | Mew 252 HP / 252+ Def Bold, Leftovers | 152-179 | 37.6-44.3% | guaranteed 3HKO after Leftovers recovery |
| Salamence +1 Dragon Dance, Life Orb (UU comparator) | Dragon Claw | Mew 252 HP / 252+ Def Bold, Leftovers | 209-245 | 51.7-60.6% | 2HKO – 3HKO after Leftovers recovery |
| Gyarados +1 Dragon Dance, Leftovers | Waterfall | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 286-336 | 70.8-83.2% | guaranteed 2HKO after Leftovers recovery |
| Salamence +1 Dragon Dance, Life Orb (UU comparator) | Dragon Claw | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 196-230 | 48.5-56.9% | 2HKO – 3HKO after Leftovers recovery |
| Gyarados +1 Dragon Dance | Earthquake | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 237-279 | 58.7-69.1% | guaranteed 2HKO after Leftovers recovery |
| Zeraora 252 Atk Jolly, Life Orb | Plasma Fists | Gyarados 4 HP / 252 Atk Adamant, Leftovers | 939-1106 | 282.8-333.1% | guaranteed OHKO after Leftovers recovery |
| Mega Aerodactyl 252 Atk Jolly | Stone Edge | Gyarados 4 HP / 252 Atk Adamant, Leftovers | 412-485 | 124.1-146.1% | guaranteed OHKO after Leftovers recovery |

### Weavile

*Dark/Ice 510 (70/120/65/45/85/125), Pressure / Pickpocket.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Weavile 252 Atk Jolly, Life Orb | Knock Off | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 127-150 | 32.2-38.1% | 3HKO – 4HKO |
| Weavile 252 Atk Jolly, Life Orb | Triple Axel | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 30-33 | 7.6-8.4% | 12HKO – 14HKO |
| Weavile 252 Atk Jolly, Life Orb | Knock Off | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | 87-102 | 25.3-29.7% | 4HKO – 5HKO after Leftovers recovery |
| Weavile 252 Atk Jolly, Life Orb | Triple Axel | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | 54-66 | 15.7-19.2% | 8HKO – 10HKO after Leftovers recovery |
| Weavile 252 Atk Jolly, Life Orb | Knock Off | Primarina 252 HP / 252+ SpD Calm, Leftovers | 124-148 | 34.1-40.7% | 3HKO – 4HKO after Leftovers recovery |
| Weavile 252 Atk Jolly, Life Orb | Triple Axel | Primarina 252 HP / 252+ SpD Calm, Leftovers | 81-93 | 22.3-25.5% | 5HKO – 6HKO after Leftovers recovery |
| Weavile 252 Atk Jolly, Life Orb | Knock Off | Skarmory 252 HP / 252+ Def Impish, Leftovers | 113-132 | 33.8-39.5% | 3HKO – 4HKO after Leftovers recovery |
| Weavile 252 Atk Jolly, Life Orb | Triple Axel | Skarmory 252 HP / 252+ Def Impish, Leftovers | 78-87 | 23.4-26% | 5HKO – 6HKO after Leftovers recovery |
| Weavile 252 Atk Jolly, Life Orb | Knock Off | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 66-78 | 16.3-19.3% | 8HKO – 10HKO after Leftovers recovery |
| Weavile 252 Atk Jolly, Life Orb | Triple Axel | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 87-105 | 21.5-26% | 5HKO – 7HKO after Leftovers recovery |
| Weavile 252 Atk Jolly, Life Orb | Knock Off | Clefable 252 HP / 252+ Def Bold, Leftovers | 85-101 | 21.6-25.6% | 5HKO – 7HKO after Leftovers recovery |
| Weavile 252 Atk Jolly, Life Orb | Triple Axel | Clefable 252 HP / 252+ Def Bold, Leftovers | 111-132 | 28.2-33.5% | 4HKO – 5HKO after Leftovers recovery |
| Weavile 252 Atk Jolly, Life Orb | Knock Off | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 214-253 | 66-78.1% | guaranteed 2HKO after Leftovers recovery |
| Weavile 252 Atk Jolly, Life Orb | Triple Axel | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 33-42 | 10.2-13% | possible 14HKO after Leftovers recovery |
| Weavile 252 Atk Jolly, Life Orb | Knock Off | Mamoswine 4 HP / 252 Atk Adamant, Life Orb | 236-278 | 65.2-76.8% | guaranteed 2HKO |
| Weavile 252 Atk Jolly, Life Orb | Triple Axel | Mamoswine 4 HP / 252 Atk Adamant, Life Orb | 150-177 | 41.4-48.9% | guaranteed 3HKO |
| Weavile +2 Swords Dance, Life Orb | Knock Off | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 249-293 | 63.2-74.4% | guaranteed 2HKO |
| Weavile +2 Swords Dance, Life Orb | Triple Axel | Skarmory 252 HP / 252+ Def Impish, Leftovers | 144-171 | 43.1-51.2% | guaranteed 3HKO after Leftovers recovery |
| Scizor 252 Atk Adamant, Choice Band, **Technician** | Bullet Punch | Weavile 4 HP / 252 Atk Jolly, Life Orb | 462-544 | 163.8-192.9% | guaranteed OHKO |
| Azumarill Choice Band, Huge Power | Aqua Jet | Weavile 4 HP / 252 Atk Jolly, Life Orb | 171-201 | 60.6-71.3% | guaranteed 2HKO |
| Keldeo 252 SpA Timid, Choice Specs | Secret Sword | Weavile 4 HP / 252 Atk Jolly, Life Orb | 1183-1392 | 419.5-493.6% | guaranteed OHKO |
| Terrakion 252 Atk Jolly, Life Orb | Close Combat | Weavile 4 HP / 252 Atk Jolly, Life Orb | 1449-1705 | 513.8-604.6% | guaranteed OHKO |
| Zeraora 252 Atk Jolly, Life Orb | Close Combat | Weavile 4 HP / 252 Atk Jolly, Life Orb | 874-1029 | 309.9-364.9% | guaranteed OHKO |
| Mega Aerodactyl 252 Atk Jolly | Stone Edge | Weavile 4 HP / 252 Atk Jolly, Life Orb | 481-566 | 170.6-200.7% | guaranteed OHKO |

### Okidogi

*Poison/Fighting 555 (88/128/115/58/86/80), Toxic Chain / Guard Dog.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Okidogi 252 Atk Adamant, Leftovers | Gunk Shot | Clefable 252 HP / 252+ Def Bold, Leftovers | 377-444 | 95.7-112.7% | 1HKO – 2HKO after Leftovers recovery |
| Okidogi +2 Bulk Up, Leftovers | Drain Punch | Clefable 252 HP / 252+ Def Bold, Leftovers | 117-138 | 29.7-35% | guaranteed 4HKO after Leftovers recovery |
| Okidogi 252 Atk Adamant, Leftovers | Gunk Shot | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 102-120 | 25.9-30.5% | guaranteed 4HKO |
| Okidogi +2 Bulk Up, Leftovers | Drain Punch | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 63-74 | 16-18.8% | 6HKO – 7HKO |
| Okidogi 252 Atk Adamant, Leftovers | Gunk Shot | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | **immune** | 0% | — |
| Okidogi +2 Bulk Up, Leftovers | Drain Punch | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | **immune** | 0% | — |
| Okidogi 252 Atk Adamant, Leftovers | Gunk Shot | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 69-81 | 16.4-19.3% | 8HKO – 10HKO after Leftovers recovery |
| Okidogi +2 Bulk Up, Leftovers | Drain Punch | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 172-203 | 41-48.3% | guaranteed 3HKO after Leftovers recovery |
| Okidogi 252 Atk Adamant, Leftovers | Gunk Shot | Mew 252 HP / 252+ Def Bold, Leftovers | 155-182 | 38.4-45% | guaranteed 3HKO after Leftovers recovery |
| Okidogi +2 Bulk Up, Leftovers | Drain Punch | Mew 252 HP / 252+ Def Bold, Leftovers | 96-113 | 23.8-28% | 5HKO – 6HKO after Leftovers recovery |
| Okidogi 252 Atk Adamant, Leftovers | Gunk Shot | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | 381-449 | 110.8-130.5% | guaranteed OHKO after Leftovers recovery |
| Okidogi +2 Bulk Up, Leftovers | Drain Punch | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | 119-140 | 34.6-40.7% | 3HKO – 4HKO after Leftovers recovery |
| Conkeldurr 252 Atk Adamant, Leftovers (UU comparator) | Drain Punch | Clefable 252 HP / 252+ Def Bold, Leftovers | 63-74 | 16-18.8% | 8HKO – 10HKO after Leftovers recovery |
| Buzzwole 252 Atk Adamant, Leftovers (UU comparator) | Close Combat | Clefable 252 HP / 252+ Def Bold, Leftovers | 100-117 | 25.4-29.7% | 4HKO – 5HKO after Leftovers recovery |

### Corviknight vs Skarmory / Celesteela

*Corviknight 495 (98/87/105/53/85/67) Pressure / Unnerve / Mirror Armor.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Victini Choice Band V-create | V-create | Corviknight 252 HP / 252+ Def Impish, Leftovers | 564-664 | 141-166% | guaranteed OHKO after Leftovers recovery |
| Victini Choice Band V-create | V-create | Skarmory 252 HP / 252+ Def Impish, Leftovers | 461-542 | 138-162.3% | guaranteed OHKO after Leftovers recovery |
| Victini Choice Band V-create | V-create | Celesteela 252 HP / 252+ Def Impish, Leftovers | 571-672 | 143.5-168.8% | guaranteed OHKO after Leftovers recovery |
| Rotom-Wash Choice Specs Thunderbolt | Thunderbolt | Corviknight 252 HP / 252+ Def Impish, Leftovers | 506-596 | 126.5-149% | guaranteed OHKO after Leftovers recovery |
| Rotom-Wash Choice Specs Thunderbolt | Thunderbolt | Skarmory 252 HP / 252+ Def Impish, Leftovers | 592-696 | 177.2-208.4% | guaranteed OHKO after Leftovers recovery |
| Rotom-Wash Choice Specs Thunderbolt | Thunderbolt | Celesteela 252 HP / 252+ Def Impish, Leftovers | 439-516 | 110.3-129.6% | guaranteed OHKO after Leftovers recovery |
| Zeraora Life Orb Plasma Fists | Plasma Fists | Corviknight 252 HP / 252+ Def Impish, Leftovers | 271-319 | 67.8-79.8% | guaranteed 2HKO after Leftovers recovery |
| Zeraora Life Orb Plasma Fists | Plasma Fists | Skarmory 252 HP / 252+ Def Impish, Leftovers | 222-261 | 66.5-78.1% | guaranteed 2HKO after Leftovers recovery |
| Zeraora Life Orb Plasma Fists | Plasma Fists | Celesteela 252 HP / 252+ Def Impish, Leftovers | 274-322 | 68.8-80.9% | guaranteed 2HKO after Leftovers recovery |
| Corviknight 252 Atk Adamant | Brave Bird | Mew 252 HP / 252+ Def Bold, Leftovers | 120-141 | 29.7-34.9% | guaranteed 4HKO after Leftovers recovery |
| Corviknight +2 Iron Defense Body Press | Body Press | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 449-528 | 111.1-130.7% | guaranteed OHKO after Leftovers recovery |

### Moltres and Zapdos-Galar

*Moltres 580 (90/100/90/125/85/90) Flame Body / Pressure. Zapdos-Galar 580 (90/125/90/85/90/100) Defiant.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Moltres 252 SpA Timid, Life Orb | Fire Blast | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 124-146 | 30.7-36.1% | guaranteed 4HKO after Leftovers recovery |
| Moltres 252 SpA Timid, Life Orb | Hurricane | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 124-146 | 30.7-36.1% | guaranteed 4HKO after Leftovers recovery |
| Moltres 252 SpA Timid, Life Orb | Fire Blast | Rotom-Wash 252 HP / 252+ Def Bold, Leftovers | 117-139 | 38.5-45.7% | guaranteed 3HKO after Leftovers recovery |
| Moltres 252 SpA Timid, Life Orb | Hurricane | Rotom-Wash 252 HP / 252+ Def Bold, Leftovers | 117-139 | 38.5-45.7% | guaranteed 3HKO after Leftovers recovery |
| Moltres 252 SpA Timid, Life Orb | Fire Blast | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 149-176 | 37.8-44.7% | guaranteed 3HKO |
| Moltres 252 SpA Timid, Life Orb | Hurricane | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 300-353 | 76.1-89.6% | guaranteed 2HKO |
| Moltres 252 SpA Timid, Life Orb | Fire Blast | Swampert 252 HP / 252+ Def Relaxed, Leftovers | 136-159 | 33.7-39.4% | 3HKO – 4HKO after Leftovers recovery |
| Moltres 252 SpA Timid, Life Orb | Hurricane | Swampert 252 HP / 252+ Def Relaxed, Leftovers | 273-321 | 67.6-79.5% | guaranteed 2HKO after Leftovers recovery |
| Moltres 252 SpA Timid, Life Orb | Fire Blast | Victini 252 HP / 4 Def Adamant, Leftovers | 124-146 | 30.7-36.1% | guaranteed 4HKO after Leftovers recovery |
| Moltres 252 SpA Timid, Life Orb | Hurricane | Victini 252 HP / 4 Def Adamant, Leftovers | 249-293 | 61.6-72.5% | guaranteed 2HKO after Leftovers recovery |
| Moltres 252 SpA Timid, Life Orb | Fire Blast | Blissey 252 HP / 252+ Def Bold, Leftovers | 193-227 | 27-31.8% | 4HKO – 5HKO after Leftovers recovery |
| Moltres 252 SpA Timid, Life Orb | Hurricane | Blissey 252 HP / 252+ Def Bold, Leftovers | 193-227 | 27-31.8% | 4HKO – 5HKO after Leftovers recovery |
| Zapdos-Galar 252 Atk Jolly, Life Orb | Close Combat | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 58-68 | 14.7-17.3% | 6HKO – 7HKO |
| Zapdos-Galar 252 Atk Jolly, Life Orb | Brave Bird | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 118-139 | 29.9-35.3% | 3HKO – 4HKO |
| Zapdos-Galar 252 Atk Jolly, Life Orb | Close Combat | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | 110-130 | 32-37.8% | 3HKO – 4HKO after Leftovers recovery |
| Zapdos-Galar 252 Atk Jolly, Life Orb | Brave Bird | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | 222-261 | 64.5-75.9% | guaranteed 2HKO after Leftovers recovery |
| Zapdos-Galar 252 Atk Jolly, Life Orb | Close Combat | Clefable 252 HP / 252+ Def Bold, Leftovers | 109-128 | 27.7-32.5% | 4HKO – 5HKO after Leftovers recovery |
| Zapdos-Galar 252 Atk Jolly, Life Orb | Brave Bird | Clefable 252 HP / 252+ Def Bold, Leftovers | 219-258 | 55.6-65.5% | guaranteed 2HKO after Leftovers recovery |
| Zapdos-Galar 252 Atk Jolly, Life Orb | Close Combat | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | **immune** | 0% | — |
| Zapdos-Galar 252 Atk Jolly, Life Orb | Brave Bird | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 67-79 | 20.7-24.4% | 6HKO – 7HKO after Leftovers recovery |
| Zapdos-Galar 252 Atk Jolly, Life Orb | Close Combat | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 161-189 | 38.3-45% | guaranteed 3HKO after Leftovers recovery |
| Zapdos-Galar 252 Atk Jolly, Life Orb | Brave Bird | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 161-189 | 38.3-45% | guaranteed 3HKO after Leftovers recovery |
| Zapdos-Galar 252 Atk Jolly, Life Orb | Close Combat | Salamence 252 HP / 4 Def Impish, Leftovers (Intimidate NOT applied) | 136-159 | 34.5-40.4% | 3HKO – 4HKO after Leftovers recovery |
| Zapdos-Galar 252 Atk Jolly, Life Orb | Brave Bird | Salamence 252 HP / 4 Def Impish, Leftovers (Intimidate NOT applied) | 273-321 | 69.3-81.5% | guaranteed 2HKO after Leftovers recovery |

### Iron Crown vs Jirachi

*Iron Crown 590 (90/72/100/122/108/98) Quark Drive; Jirachi 600 (100/100/100/100/100/100) Serene Grace.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Iron Crown 252 SpA Modest, Leftovers | Tachyon Cutter | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 352-414 | 87.1-102.5% | 1HKO – 2HKO after Leftovers recovery |
| Iron Crown +2 Calm Mind, Leftovers | Tachyon Cutter | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 694-816 | 171.8-202% | guaranteed OHKO after Leftovers recovery |
| Iron Crown 252 SpA Modest, Leftovers | Tachyon Cutter | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 104-124 | 26.4-31.5% | guaranteed 4HKO |
| Iron Crown +2 Calm Mind, Leftovers | Tachyon Cutter | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 208-244 | 52.8-61.9% | guaranteed 2HKO |
| Iron Crown 252 SpA Modest, Leftovers | Tachyon Cutter | Blissey 252 HP / 252+ Def Bold, Leftovers | 136-160 | 19-22.4% | 6HKO – 8HKO after Leftovers recovery |
| Iron Crown +2 Calm Mind, Leftovers | Tachyon Cutter | Blissey 252 HP / 252+ Def Bold, Leftovers | 268-316 | 37.5-44.3% | guaranteed 3HKO after Leftovers recovery |
| Iron Crown 252 SpA Modest, Leftovers | Tachyon Cutter | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 62-72 | 19.1-22.2% | 6HKO – 8HKO after Leftovers recovery |
| Iron Crown +2 Calm Mind, Leftovers | Tachyon Cutter | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 122-144 | 37.7-44.4% | guaranteed 3HKO after Leftovers recovery |
| Iron Crown 252 SpA Modest, Leftovers | Tachyon Cutter | Swampert 252 HP / 252+ Def Relaxed, Leftovers | 96-112 | 23.8-27.7% | 5HKO – 6HKO after Leftovers recovery |
| Iron Crown +2 Calm Mind, Leftovers | Tachyon Cutter | Swampert 252 HP / 252+ Def Relaxed, Leftovers | 188-222 | 46.5-55% | 2HKO – 3HKO after Leftovers recovery |
| Iron Crown 252 SpA Modest, Leftovers | Tachyon Cutter | Hydreigon 252 HP / 4 SpD Modest, Leftovers | 190-224 | 49-57.7% | 2HKO – 3HKO after Leftovers recovery |
| Iron Crown +2 Calm Mind, Leftovers | Tachyon Cutter | Hydreigon 252 HP / 4 SpD Modest, Leftovers | 376-442 | 96.9-113.9% | 1HKO – 2HKO after Leftovers recovery |
| Iron Crown 252 SpA Modest | Focus Blast | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 554-652 | 137.1-161.4% | guaranteed OHKO after Leftovers recovery |
| Iron Crown 252 SpA Modest | Psychic | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 93-110 | 23.6-27.9% | 4HKO – 5HKO |
| Jirachi 252 SpA Modest, Leftovers (UU comparator) | Psychic | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 81-96 | 20.6-24.4% | guaranteed 5HKO |

### Mega Latias (UU — possibly too strong)

*80/100/120/140/150/110, Levitate. No item (stone).*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Mega Latias +1 Calm Mind, no item | Draco Meteor | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 363-427 | 89.9-105.7% | 1HKO – 2HKO after Leftovers recovery |
| Mega Latias +1 Calm Mind, no item | Psychic | Tyranitar 252 HP / 252+ Def Impish, Leftovers | **immune** | 0% | — |
| Mega Latias +1 Calm Mind, no item | Draco Meteor | Blissey 252 HP / 252+ Def Bold, Leftovers | 280-330 | 39.2-46.2% | guaranteed 3HKO after Leftovers recovery |
| Mega Latias +1 Calm Mind, no item | Psychic | Blissey 252 HP / 252+ Def Bold, Leftovers | 181-213 | 25.4-29.8% | 4HKO – 5HKO after Leftovers recovery |
| Mega Latias +1 Calm Mind, no item | Draco Meteor | Clefable 252 HP / 252+ Def Bold, Leftovers | **immune** | 0% | — |
| Mega Latias +1 Calm Mind, no item | Psychic | Clefable 252 HP / 252+ Def Bold, Leftovers | 256-301 | 65-76.4% | guaranteed 2HKO after Leftovers recovery |
| Mega Latias +1 Calm Mind, no item | Draco Meteor | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 128-150 | 39.5-46.3% | guaranteed 3HKO after Leftovers recovery |
| Mega Latias +1 Calm Mind, no item | Psychic | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 82-97 | 25.3-29.9% | 4HKO – 5HKO after Leftovers recovery |
| Mega Latias +1 Calm Mind, no item | Draco Meteor | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | **immune** | 0% | — |
| Mega Latias +1 Calm Mind, no item | Psychic | Tapu Fini 252 HP / 252+ SpD Calm, Leftovers | 141-166 | 41-48.3% | guaranteed 3HKO after Leftovers recovery |
| Weavile Life Orb Knock Off | Knock Off | Mega Latias 252 HP / 4 Def Bold, no item (stone) | 208-244 | 57.1-67% | guaranteed 2HKO |
| Tyranitar Choice Band Crunch | Crunch | Mega Latias 252 HP / 4 Def Bold, no item (stone) | 345-406 | 94.8-111.5% | guaranteed 1HKO after sandstorm damage |
| Scizor 252 Atk Adamant, Choice Band, **Technician** | Bullet Punch | Mega Latias 252 HP / 4 Def Bold, no item (stone) | 127-149 | 34.9-40.9% | guaranteed 3HKO |

### Mega Gardevoir (UU — possibly too strong)

*68/85/65/165/135/100, **Pixilate at 1.3x in RedGPT** (upstream 1.2x).*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Mega Gardevoir 252 SpA Timid, no item | Hyper Voice | Blissey 252 HP / 252+ Def Bold, Leftovers | 178-209 | 24.9-29.3% | guaranteed 5HKO after Leftovers recovery |
| Mega Gardevoir +1 Calm Mind, no item | Hyper Voice | Blissey 252 HP / 252+ Def Bold, Leftovers | 265-312 | 37.1-43.7% | 3HKO – 4HKO after Leftovers recovery |
| Mega Gardevoir 252 SpA Timid, no item | Hyper Voice | Chansey 252 HP / 252+ Def Bold, Eviolite | 148-174 | 21-24.7% | guaranteed 5HKO |
| Mega Gardevoir +1 Calm Mind, no item | Hyper Voice | Chansey 252 HP / 252+ Def Bold, Eviolite | 220-259 | 31.3-36.8% | 3HKO – 4HKO |
| Mega Gardevoir 252 SpA Timid, no item | Hyper Voice | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 81-95 | 25-29.3% | guaranteed 5HKO after Leftovers recovery |
| Mega Gardevoir +1 Calm Mind, no item | Hyper Voice | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 121-142 | 37.3-43.8% | 3HKO – 4HKO after Leftovers recovery |
| Mega Gardevoir 252 SpA Timid, no item | Hyper Voice | Scizor 252 HP / 252+ Def Impish, Leftovers | 138-162 | 40.1-47.1% | guaranteed 3HKO after Leftovers recovery |
| Mega Gardevoir +1 Calm Mind, no item | Hyper Voice | Scizor 252 HP / 252+ Def Impish, Leftovers | 206-243 | 59.9-70.6% | guaranteed 2HKO after Leftovers recovery |
| Mega Gardevoir 252 SpA Timid, no item | Hyper Voice | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 276-325 | 70.1-82.5% | guaranteed 2HKO |
| Mega Gardevoir +1 Calm Mind, no item | Hyper Voice | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 413-486 | 104.8-123.4% | guaranteed OHKO |
| Mega Gardevoir 252 SpA Timid, no item | Hyper Voice | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 460-541 | 113.9-133.9% | guaranteed OHKO after Leftovers recovery |
| Mega Gardevoir +1 Calm Mind, no item | Hyper Voice | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 687-809 | 170-200.2% | guaranteed OHKO after Leftovers recovery |
| Mega Gardevoir 252 SpA Timid | Focus Blast | Blissey 252 HP / 252+ Def Bold, Leftovers | 243-286 | 34-40.1% | 3HKO – 4HKO after Leftovers recovery |
| Mega Gardevoir 252 SpA Timid | Focus Blast | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 629-740 | 155.7-183.2% | guaranteed OHKO after Leftovers recovery |

### Aegislash (UU — restored 150/150 Shield bulk)

*Shield 60/50/150/50/150/60, Blade 60/150/50/150/50/60. Stance Change.*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Victini Choice Band V-create | V-create | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 438-515 | 135.2-159% | guaranteed OHKO after Leftovers recovery |
| Terrakion Life Orb Close Combat | Close Combat | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | **immune** | 0% | — |
| Gengar Life Orb Shadow Ball | Shadow Ball | Aegislash (Shield) 252 HP / 252+ Def Impish, Leftovers | 244-287 | 75.3-88.6% | guaranteed 2HKO after Leftovers recovery |
| Aegislash-Blade +2 Swords Dance | Shadow Claw | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 265-312 | 67.3-79.2% | guaranteed 2HKO |
| Aegislash-Blade +0 | Shadow Sneak | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 79-93 | 20.1-23.6% | guaranteed 5HKO |
| Aegislash-Blade +2 Swords Dance | Shadow Claw | Clefable 252 HP / 252+ Def Bold, Leftovers | 246-290 | 62.4-73.6% | guaranteed 2HKO after Leftovers recovery |
| Aegislash-Blade +0 | Shadow Sneak | Clefable 252 HP / 252+ Def Bold, Leftovers | 72-85 | 18.3-21.6% | 7HKO – 8HKO after Leftovers recovery |
| Aegislash-Blade +2 Swords Dance | Shadow Claw | Mew 252 HP / 252+ Def Bold, Leftovers | 405-477 | 100.2-118.1% | guaranteed OHKO after Leftovers recovery |
| Aegislash-Blade +0 | Shadow Sneak | Mew 252 HP / 252+ Def Bold, Leftovers | 119-140 | 29.5-34.7% | 4HKO – 5HKO after Leftovers recovery |
| Aegislash-Blade +2 Swords Dance | Shadow Claw | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 95-111 | 23.5-27.5% | 5HKO – 6HKO after Leftovers recovery |
| Aegislash-Blade +0 | Shadow Sneak | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 28-33 | 6.9-8.2% | not a KO after Leftovers recovery |
| Aegislash-Blade +2 Swords Dance | Shadow Claw | Skarmory 252 HP / 252+ Def Impish, Leftovers | 160-188 | 47.9-56.3% | 2HKO – 3HKO after Leftovers recovery |
| Aegislash-Blade +0 | Shadow Sneak | Skarmory 252 HP / 252+ Def Impish, Leftovers | 47-56 | 14.1-16.8% | 9HKO – 12HKO after Leftovers recovery |

### Mega Aerodactyl (UU — possibly too strong)

*80/135/85/70/95/150, Tough Claws (1.3x on contact).*

| Attacker (representative set) | Move | Defender | Damage | % | KO |
| --- | --- | --- | --- | --- | --- |
| Mega Aerodactyl +0, no item | Stone Edge | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 80-95 | 20.3-24.1% | guaranteed 5HKO |
| Mega Aerodactyl +1 Dragon Dance, no item | Stone Edge | Mega Slowbro 252 HP / 252+ Def Bold, no item (stone) | 120-141 | 30.5-35.8% | 3HKO – 4HKO |
| Mega Aerodactyl +0, no item | Stone Edge | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 54-64 | 12.9-15.2% | 11HKO – 15HKO after Leftovers recovery |
| Mega Aerodactyl +1 Dragon Dance, no item | Stone Edge | Hippowdon 252 HP / 252+ Def Impish, Leftovers | 81-96 | 19.3-22.9% | 6HKO – 8HKO after Leftovers recovery |
| Mega Aerodactyl +0, no item | Stone Edge | Skarmory 252 HP / 252+ Def Impish, Leftovers | 97-114 | 29-34.1% | 4HKO – 5HKO after Leftovers recovery |
| Mega Aerodactyl +1 Dragon Dance, no item | Stone Edge | Skarmory 252 HP / 252+ Def Impish, Leftovers | 144-170 | 43.1-50.9% | guaranteed 3HKO after Leftovers recovery |
| Mega Aerodactyl +0, no item | Stone Edge | Clefable 252 HP / 252+ Def Bold, Leftovers | 149-175 | 37.8-44.4% | guaranteed 3HKO after Leftovers recovery |
| Mega Aerodactyl +1 Dragon Dance, no item | Stone Edge | Clefable 252 HP / 252+ Def Bold, Leftovers | 222-262 | 56.3-66.5% | guaranteed 2HKO after Leftovers recovery |
| Mega Aerodactyl +0, no item | Stone Edge | Swampert 252 HP / 252+ Def Relaxed, Leftovers | 65-77 | 16.1-19.1% | 8HKO – 10HKO after Leftovers recovery |
| Mega Aerodactyl +1 Dragon Dance, no item | Stone Edge | Swampert 252 HP / 252+ Def Relaxed, Leftovers | 98-115 | 24.3-28.5% | 5HKO – 6HKO after Leftovers recovery |
| Mega Aerodactyl +0, no item | Stone Edge | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 115-135 | 28.5-33.4% | 4HKO – 5HKO after Leftovers recovery |
| Mega Aerodactyl +1 Dragon Dance, no item | Stone Edge | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 171-202 | 42.3-50% | guaranteed 3HKO after Leftovers recovery |
| Mega Aerodactyl +0, no item | Stone Edge | Celesteela 252 HP / 252+ Def Impish, Leftovers | 120-141 | 30.2-35.4% | guaranteed 4HKO after Leftovers recovery |
| Mega Aerodactyl +1 Dragon Dance, no item | Stone Edge | Celesteela 252 HP / 252+ Def Impish, Leftovers | 179-210 | 45-52.8% | guaranteed 3HKO after Leftovers recovery |
| Mega Aerodactyl +1 Dragon Dance | Earthquake | Tyranitar 252 HP / 252+ Def Impish, Leftovers | 229-269 | 56.7-66.6% | guaranteed 2HKO after Leftovers recovery |
| Scizor 252 Atk Adamant, Choice Band, **Technician** | Bullet Punch | Mega Aerodactyl 4 HP / 252 Atk Jolly, no item (stone) | 373-439 | 123.5-145.4% | guaranteed OHKO |
| Azumarill Choice Band Aqua Jet | Aqua Jet | Mega Aerodactyl 4 HP / 252 Atk Jolly, no item (stone) | 277-326 | 91.7-107.9% | 1HKO – 2HKO |
<!-- END GENERATED CALCS -->

---

## D. Speed tiers

Level 100, 252 Speed EVs, nature as labelled. No usage data involved — these are
raw stat computations.

<!-- BEGIN GENERATED SPEED -->
| Speed | Pokémon |
| --- | --- |
| 736 | Hawlucha AFTER Unburden (jolly, 252 Spe) |
| 700 | Mega Skarmory after Agility (+2) (jolly, 252 Spe) |
| 657 | Mega Aerodactyl +1 Dragon Dance (jolly, 252 Spe) |
| 532 | Scolipede after 1 Speed Boost (jolly, 252 Spe) |
| 490 | Mega Scolipede after Agility (+2) (jolly, 252 Spe) |
| 438 | Mega Aerodactyl (jolly, 252 Spe) |
| 430 | Gyarados +1 Dragon Dance (jolly, 252 Spe) |
| 423 | Zeraora (jolly, 252 Spe) |
| 383 | Weavile (jolly, 252 Spe) |
| 368 | Hawlucha (jolly, 252 Spe) |
| 355 | Scolipede (jolly, 252 Spe) |
| 350 | Mega Latias (timid, 252 Spe) |
| 350 | Ogerpon (any Mask) (jolly, 252 Spe) |
| 350 | Mega Skarmory (jolly, 252 Spe) |
| 346 | Terrakion (jolly, 252 Spe) |
| 342 | Iron Treads (jolly, 252 Spe) |
| 328 | Mega Gardevoir (timid, 252 Spe) |
| 328 | Zapdos-Galar (jolly, 252 Spe) |
| 328 | Salamence (jolly, 252 Spe) |
| 324 | Iron Crown (timid, 252 Spe) |
| 306 | Moltres (timid, 252 Spe) |
| 302 | Excadrill (jolly, 252 Spe) |
| 302 | Pecharunt (timid, 252 Spe) |
| 287 | Gyarados (jolly, 252 Spe) |
| 284 | Okidogi (jolly, 252 Spe) |
| 273 | Dracovish (jolly, 252 Spe) |
| 256 | Corviknight (jolly, 252 Spe) |
| 245 | Mega Scolipede (jolly, 252 Spe) |
<!-- END GENERATED SPEED -->

**Read two rows together:** base Scolipede after **one** Speed Boost (532)
outruns Mega Scolipede after **Agility** (490). The Mega is slower after two
stages than the base is after one.

---

## E. UU health check — can UU take each proposed drop?

Answer this for every drop you propose; here is the raw material. All damage
figures are in §C.

| Proposed drop | Existing UU answers | Kind |
| --- | --- | --- |
| **Ogerpon-Hearthflame** | Mega Slowbro (takes 11-13% from Ivy Cudgel), Tapu Fini, Hippowdon, Mega Aerodactyl / Zeraora as revenge | hard wall, soft check, revenge |
| **Ogerpon-Wellspring** | Hydrapple, Goodra-Hisui, Mega Venusaur, Rotom-Wash into Grass | soft checks |
| **Ogerpon-Cornerstone** | Mega Slowbro, Swampert, Excadrill, Skarmory | walls |
| **Dracovish** | **Mega Venusaur, Hydrapple, Goodra-Hisui** (Water resists), Tapu Fini; Zeraora / Terrakion / Mega Aerodactyl revenge — but note Dracovish is only 75 Speed | resists + revenge |
| **Mega Scolipede** | Skarmory, Mega Slowbro, Celesteela, Mega Aerodactyl, Victini | walls + revenge |
| **Slowbro** | Slowking and Mega Slowbro do the same job, Hydreigon, Gengar | outclassed |
| **Iron Treads** | Mega Slowbro, Hippowdon, Skarmory, Rotom-Wash | walls |
| **Gyarados** | Rotom-Wash, Zeraora, Tapu Fini, Thundurus — 4x Electric | hard |
| **Hawlucha** | Scizor Bullet Punch, Azumarill Aqua Jet, Mega Aerodactyl, Clefable, Mega Slowbro | priority + walls |
| **Weavile** | Scizor, Azumarill, Terrakion, Keldeo, Mega Aerodactyl, Tyranitar | priority + revenge |
| **Okidogi** | Mega Slowbro, Clefable, Mew, Tapu Fini, Aegislash | walls |
| **Corviknight** | Rotom-Wash, Zeraora, Victini, Moltres-Galar | Electric/Fire |
| **Moltres** | Tyranitar, Rotom-Wash, Blissey, Swampert | special walls |
| **Zapdos-Galar** | Mega Slowbro, Clefable, Aegislash, Salamence (Intimidate) | physical walls |
| **Iron Crown** | Tyranitar, Blissey, Hydreigon, Aegislash | special walls |
| **Mega Skarmory** | Rotom-Wash, Victini, Zeraora, Moltres-Galar | Electric/Fire |
| **Pecharunt** | Aegislash, Tyranitar, Blissey/Chansey, Mew | walls |

---

## F. Wrong-direction UU entries

Calculations in §C. Verified packages:

- **Mega Latias** 700 (80/100/120/140/150/110), Levitate, no item. Calm Mind,
  Recover and Roost, Draco Meteor at the **restored 140 BP**. 350 Speed.
- **Mega Gardevoir** 618 (68/85/65/165/135/100), **Pixilate at 1.3x in RedGPT
  against 1.2x upstream**. Hyper Voice becomes Fairy and takes both the 1.3x and
  STAB. Calm Mind, Focus Blast. No recovery move.
- **Aegislash** — **restored 150/150 Shield spread** (60/50/150/50/150/60) and
  Blade (60/150/50/150/50/60). **Stance Change is its only ability**, so the
  ability-ban route this project uses elsewhere cannot separate the formes: a
  tier decision on Aegislash is a decision on the whole package. Swords Dance,
  Shadow Sneak, King's Shield.
- **Mega Aerodactyl** 615 (80/135/85/70/95/150), **Tough Claws 1.3x on contact**
  — note Stone Edge is **not** a contact move and does not get it, while
  Aqua Tail / Crunch / Dragon Dance-boosted contact moves do. 438 Speed, the
  fastest thing in UU.

---

## G. Full estimated-forme audit

All 12 OU entries whose tier is a nearest-neighbour estimate rather than an
imported ranking.

<!-- BEGIN GENERATED FORMES -->
12 of the 107 OU entries carry an estimated tier.

**Barbaracle-Mega** Rock/Fighting 600 (72/140/130/64/106/88) — Tough Claws
  reached by: Barbaracle (RU) + Barbaracite
  setup: Swords Dance, Bulk Up, Shell Smash, Iron Defense | hazards: Stealth Rock
  nearest UU Megas by BST: Heracross-Mega 600, Dragalge-Mega 594

**Chesnaught-Mega** Grass/Fighting 630 (88/137/172/74/115/44) — Bulletproof
  reached by: Chesnaught (RU) + Chesnaughtite
  setup: Swords Dance, Bulk Up, Iron Defense | recovery: Synthesis | hazards: Spikes | priority: Grassy Glide
  nearest UU Megas by BST: Emboar-Mega 628, Delphox-Mega 634

**Clefable-Mega** Fairy/Flying 583 (95/80/93/135/110/70) — Magic Bounce
  reached by: Clefable (UU) + Clefablite
  setup: Calm Mind | recovery: Soft-Boiled, Moonlight | hazards: Stealth Rock | pivot: Teleport
  nearest UU Megas by BST: Drampa-Mega 585, Staraptor-Mega 585

**Excadrill-Mega** Ground/Steel 608 (110/165/100/65/65/103) — Piercing Drill
  reached by: Excadrill (UU) + Excadrite
  setup: Swords Dance, Iron Defense | hazards: Stealth Rock | removal: Rapid Spin
  nearest UU Megas by BST: Aerodactyl-Mega 615, Heracross-Mega 600

**Feraligatr-Mega** Water/Dragon 630 (85/160/125/89/93/78) — Dragonize
  reached by: Feraligatr (RU) + Feraligite
  setup: Swords Dance, Dragon Dance, Agility | pivot: Flip Turn | priority: Aqua Jet
  nearest UU Megas by BST: Emboar-Mega 628, Delphox-Mega 634

**Glimmora-Mega** Rock/Poison 625 (83/90/105/150/96/101) — Adaptability
  reached by: Glimmora (UU) + Glimmoranite
  setup: Iron Defense | hazards: Stealth Rock, Spikes, Toxic Spikes
  nearest UU Megas by BST: Meganium-Mega 625, Venusaur-Mega 625

**Golisopod-Mega** Bug/Steel 630 (75/150/175/70/120/40) — Emergency Exit
  reached by: Golisopod (RU) + Golisopite
  setup: Swords Dance, Bulk Up, Iron Defense | hazards: Spikes | priority: Aqua Jet, Sucker Punch
  nearest UU Megas by BST: Emboar-Mega 628, Delphox-Mega 634

**Greninja-Mega** Water/Dark 630 (72/125/77/133/81/142) — Protean
  reached by: Greninja (OU) + Greninjite
  setup: Swords Dance | hazards: Spikes, Toxic Spikes | pivot: U-turn | priority: Shadow Sneak, Upper Hand
  nearest UU Megas by BST: Emboar-Mega 628, Delphox-Mega 634

**Hawlucha-Mega** Fighting/Flying 600 (78/137/100/74/93/118) — No Guard
  reached by: Hawlucha (OU) + Hawluchanite
  setup: Swords Dance, Bulk Up, Agility | recovery: Roost | removal: Defog | pivot: U-turn | priority: Upper Hand
  nearest UU Megas by BST: Heracross-Mega 600, Dragalge-Mega 594

**Scolipede-Mega** Bug/Poison 585 (60/140/149/75/99/62) — Shell Armor
  reached by: Scolipede (UU) + Scolipite
  setup: Swords Dance, Agility, Iron Defense | hazards: Spikes, Toxic Spikes
  nearest UU Megas by BST: Drampa-Mega 585, Staraptor-Mega 585

**Skarmory-Mega** Steel/Flying 565 (65/140/110/40/100/110) — Stalwart
  reached by: Skarmory (UU) + Skarmorite
  **ability is INERT in singles: Stalwart**
  **ability not implemented in this build: Stalwart**
  setup: Swords Dance, Agility, Autotomize, Iron Defense | recovery: Roost | hazards: Stealth Rock, Spikes | removal: Defog
  nearest UU Megas by BST: Sharpedo-Mega 560, Drampa-Mega 585

**Zeraora-Mega** Electric 700 (88/157/75/147/80/153) — Volt Absorb
  reached by: Zeraora (UU) + Zeraorite
  setup: Calm Mind, Bulk Up, Agility | pivot: Volt Switch
  nearest UU Megas by BST: Latias-Mega 700, Swampert-Mega 635
<!-- END GENERATED FORMES -->

---

## H. Additional candidates discovered

A systematic screen over both rosters: for each OU entry, UU entries with the
**same defensive typing** that match or beat it on BST, Speed, total bulk, and
every role marker it has (recovery, setup, hazards, removal, pivot).

<!-- BEGIN GENERATED OUTCLASS -->
For each OU entry, UU entries that beat or match it on every one of:
BST, the same defensive typing OR the same role markers, recovery, setup,
hazards, removal, pivot — and are at least as fast.

**Ceruledge** Fire/Ghost 525 (Spe 85, bulk 255)
    outclassed on every axis by UU **Chandelure-Mega** 620 (Spe 90, bulk 280)
**Hatterene** Fairy/Psychic 510 (Spe 29, bulk 255)
    outclassed on every axis by UU **Gardevoir-Mega** 618 (Spe 100, bulk 268)
**Iron Crown** Psychic/Steel 590 (Spe 98, bulk 298)
    outclassed on every axis by UU **Jirachi** 600 (Spe 100, bulk 300)
**Slowbro** Psychic/Water 490 (Spe 30, bulk 285)
    outclassed on every axis by UU **Slowbro-Mega** 590 (Spe 30, bulk 355)
    outclassed on every axis by UU **Slowking** 490 (Spe 30, bulk 285)
**Tapu Lele** Fairy/Psychic 570 (Spe 95, bulk 260)
    outclassed on every axis by UU **Gardevoir-Mega** 618 (Spe 100, bulk 268)
**Thundurus-Therian** Electric/Flying 580 (Spe 101, bulk 229)
    outclassed on every axis by UU **Thundurus** 580 (Spe 111, bulk 229)
**Urshifu-Rapid-Strike** Fighting/Water 550 (Spe 97, bulk 260)
    outclassed on every axis by UU **Keldeo** 580 (Spe 108, bulk 271)
**Xurkitree** Electric 570 (Spe 83, bulk 225)
    outclassed on every axis by UU **Zeraora** 600 (Spe 143, bulk 243)

(Same defensive typing required, so this is a strict same-role test. An empty
result for a Pokémon does not clear it — it only means no UU entry dominates
it on every axis at once.)
<!-- END GENERATED OUTCLASS -->

**Treat this as a screen, not a verdict.** It compares stat totals and move
*presence*, not ability quality or move power — so it does not know that Tapu
Lele brings Psychic Surge, that Urshifu-Rapid-Strike has Unseen Fist and Surging
Strikes, or that Iron Crown's Quark Drive can outpace Jirachi's flat 100s. Use
it to find candidates you have not considered, then judge them on §C and §B.

---

## I. Item and ability edge cases

| Candidate | Forced item? | Ability note |
| --- | --- | --- |
| Ogerpon x3 | **yes — the Mask.** No Ring Target, Life Orb, Choice or Leftovers | Mold Breaker / Water Absorb / Sturdy all work; **Embody Aspect unreachable** |
| Mega Scolipede | **yes — Scolipite** | Shell Armor blocks crits only; **loses Speed Boost** |
| Mega Skarmory | **yes — Skarmorite** | **Stalwart inert and unimplemented** |
| Mega Latias / Gardevoir / Aerodactyl | **yes — their stones** | Pixilate **1.3x** (upstream 1.2x); Tough Claws contact-only |
| Dracovish | no | Strong Jaw **must be chosen** — slot 0 is Water Absorb |
| Hawlucha | no, but **Unburden requires consuming one** | x2 Speed verified |
| Iron Treads / Iron Crown | no | **Quark Drive needs Electric Terrain or Booster Energy** — inert otherwise |
| Pecharunt | no | Poison Puppeteer fires on **every** poison route |
| Okidogi | no | Toxic Chain; **Guard Dog blocks Intimidate** |
| Gyarados / Salamence | no | Intimidate or Moxie, chosen at team build |
| Weavile | no | no Upper Hand; Ice Shard is its only priority |

**General, and it applies to every candidate:** no Terastallization in OU or UU,
so any historical Tera-based setup or coverage path is simply absent. And
unconditional priority (Sucker Punch 80 BP no condition, Upper Hand +3, Grassy
Glide +1 with no terrain) makes revenge-killing frail sweepers far more reliable
than on Showdown.

---

## J. Remaining unknowns

1. **No usage, ladder or win-rate data exists.** Every spread here is a
   representative test set. Do not treat any of them as "the" standard set.
2. **No play evidence for the three masked Ogerpons** — reachable only since
   2026-08-16.
3. **Multi-turn sequences are not modelled.** All damage is single-attack;
   the KO column includes only Leftovers-class residuals, not hazard chip or
   switch cycles.
4. **Quark Drive and Protosynthesis are inactive** in these numbers — no
   Electric Terrain, no sun, no Booster Energy. Iron Treads and Iron Crown are
   therefore shown at their floor.
5. **Only the defenders listed were tested.** If a verdict turns on a wall I did
   not include, name the exact attacker, defender, move and spread and I will
   run it.

## What I want back

1. The **final ranked OU → UU list**, most confident first: name, species or
   forme, confidence, the UU comparator where one exists, and the mechanical
   reason.
2. A **"considered and kept"** section with one-line reasons.
3. Your verdict on the **four wrong-direction UU entries** in §F, plus any
   others you find.
4. Anything still unresolved, stated explicitly rather than guessed.
