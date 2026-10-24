# RedGPT — the current OverUsed roster, for deciding what should move up to Ubers

**Purpose.** This is a briefing for an AI assistant (ChatGPT or similar) that is
being asked one specific question: **which Pokémon currently in RedGPT's OU are
too powerful for it and should be promoted to Ubers?**

It is the reverse of the pass run on 2026-08-15, which moved 25 entries *down*
from Ubers to OU. Those 25 are in the roster below and are flagged; they are the
obvious first place to look for something that overshot.

**Read this alongside `DIFFERENCES_FROM_SHOWDOWN.md` and
`DIFFERENCES_ADDENDUM_ITEMS.md`.** Those two describe the game; this one
describes the tier. Where any of the three disagrees with your knowledge of
Smogon or the main series, **the documents are right for this game**. Every
difference is a deliberate project decision, not a bug or an incomplete
implementation.

Every figure in this file was generated from the live packaged data on
**2026-08-16**, directly from `Formats.tierRoster('OU')` and the species table.
None of it is written from memory.

---

## 1. The question, stated precisely

RedGPT imports Smogon's **National Dex** tiers and then corrects them where this
project's rules change the answer. The correction table (`TIER_OVERRIDES`) has
been used in one direction only so far — downward. Nothing has ever been
promoted.

So the question is: **given the OU roster below, and given how this game
actually plays, which entries are warping it badly enough to belong in Ubers?**

Two things that are *not* being asked:

- Not "what does Smogon say". Smogon's opinion is the starting point that
  produced this roster; restating it is not an answer.
- Not "which are strong". OU is supposed to contain strong Pokémon. The test is
  whether an entry is *unhealthy* for the tier — no reasonable counterplay, or
  it forces the whole metagame to be built around answering it.

## 2. What the ladder looks like right now

| Tier | Entries | Notes |
| --- | --- | --- |
| AG | 0 | deliberately emptied on 2026-08-15 |
| **Ubers** | **63** | the tier things would move *into* |
| **OU** | **93** | the roster in §5 |
| UU | 91 | |
| RU | 131 | |
| NU | 67 | |
| PU | 110 | |
| ZU | 677 | |

Roster totals count **one rung strictly**. A tier *format* is cumulative
downward — the OU format's legal pool is 602 species, because OU plays with UU,
RU and everything below it as well. So an OU Pokémon is not being judged against
105 rivals, it is being judged against 602, of which these 106 are the ceiling.

**OU moved twice on 2026-08-16, and the two moves are different in kind.**

111 → 109 was **not** a tiering change: Ogerpon-Wellspring-Tera and
Ogerpon-Cornerstone-Tera were selectable species and became transform-only,
because they can only be reached by Terastallizing and OU has no
Terastallization. Three Ogerpon masked formes changed *kind* in the same pass,
from directly-pickable species to items held by base Ogerpon.

109 → 106 **was** a tiering change — it is the OU → Ubers pass this document was
written for, now carried out. **Lucario-Mega-Z, Magearna and Magearna-Original
were promoted to Ubers.** They are absent from the roster below and present in
the Ubers list above. Everything else reviewed stayed in OU, including
**Zeraora-Mega, which was the leading suspect and was cleared** once its
learnset showed it has no Ice, Water or Ground coverage of any kind.

### The Ubers roster, for calibration (63)

Arceus, Baxcalibur-Mega, Blaziken-Mega, Calyrex-Ice, Calyrex-Shadow, Chi-Yu,
Chien-Pao, Darkrai-Mega, Darmanitan-Galar, Darmanitan-Galar-Zen,
Deoxys-Attack, Dialga-Origin, Dragonite-Mega, Espathra, Eternatus,
Flutter Mane, Garchomp-Mega-Z, Genesect, Gengar-Mega, Giratina,
Giratina-Origin, Gouging Fire, Groudon, Groudon-Primal, Heatran-Mega, Ho-Oh,
Iron Bundle, Kangaskhan-Mega, Koraidon, Kyogre, Kyogre-Primal, Kyurem-White,
Landorus, Lucario-Mega-Z, Magearna, Magearna-Mega, Mewtwo, Mewtwo-Mega-X,
Mewtwo-Mega-Y, Miraidon, Necrozma-Dusk-Mane, Necrozma-Ultra, Palafin-Hero,
Palkia, Palkia-Origin, Rayquaza, Rayquaza-Mega, Reshiram, Salamence-Mega,
Shaymin-Sky, Sneasler, Ursaluna-Bloodmoon, Urshifu, Walking Wake, Xerneas,
Yveltal, Zacian, Zacian-Crowned, Zamazenta-Crowned, Zekrom, Zygarde,
Zygarde-Complete, Zygarde-Mega

**Note how thin Ubers still is.** Even after the 2026-08-16 promotions it holds almost nothing
but box legendaries, Primal/Origin formes, the strongest Megas, and the Ruin
duo. That is the bar a promotion has to clear: *is this entry in the same
conversation as Kyogre and Mewtwo?* If the honest answer is "no, but it is very
strong", the answer to the question is no.

---

## 3. The 25 dropped from Ubers on 2026-08-15 — the first place to look

All 25 are in the OU roster today. They were moved on two separate arguments,
which are worth keeping apart because they carry different risk.

**(a) Generation 9, dropped because their Ubers case leaned on Terastallization.**
Regular OU and regular Ubers both have Tera off, so the mechanic that carried
them is simply absent.

| Entry | BST | Types | Ability | The stated reason, and the residual risk |
| --- | --- | --- | --- | --- |
| Ogerpon-Hearthflame | 550 | Grass / Fire | Mold Breaker | Cannot reach its Tera forme or Embody Aspect. **But see §6 — it became genuinely playable only on 2026-08-16, so it has never been played in OU.** |
| Roaring Moon | 590 | Dragon / Dark | Protosynthesis | No Tera Flying Acrobatics, no defensive flip; still 4x Fairy |
| Baxcalibur | 600 | Dragon / Ice | Thermal Exchange | Loses defensive Tera. Its Mega stayed Ubers |
| Annihilape | 535 | Fighting / Ghost | Defiant / Vital Spirit | **Flagged in the source as "the residual risk — first to revisit."** Rage Fist does not need Tera |

**(b) Legacy "automatic Ubers", reassessed against RedGPT's own OU.** The
argument was that RedGPT's OU is far stronger than the historical formats that
banned these — free Mega Evolution, ~30 Megas already legal in OU, restored
abilities and pre-nerf stats. These are the drops most likely to have overshot,
because the argument was comparative rather than mechanical.

| Entry | BST | Types | Ability | Since |
| --- | --- | --- | --- | --- |
| Kyurem-Black | 700 | Dragon / Ice | Teravolt |  |
| Metagross-Mega | 700 | Steel / Psychic | Tough Claws |  |
| Dialga | 680 | Steel / Dragon | Pressure |  |
| Lugia | 680 | Psychic / Flying | Multiscale |  |
| Lunala | 680 | Psychic / Ghost | Shadow Shield |  |
| Necrozma-Dawn-Wings | 680 | Psychic / Ghost | Prism Armor |  |
| Solgaleo | 680 | Psychic / Steel | Full Metal Body |  |
| Blastoise-Mega | 630 | Water | Mega Launcher |  |
| Lucario-Mega | 625 | Fighting / Steel | Adaptability |  |
| Alakazam-Mega | 600 | Psychic | Trace |  |
| Darkrai | 600 | Dark | Bad Dreams |  |
| Deoxys | 600 | Psychic | Pressure |  |
| Deoxys-Speed | 600 | Psychic | Pressure |  |
| Dragapult | 600 | Dragon / Ghost | Clear Body / Infiltrator |  |
| Magearna | 600 | Steel / Fairy | Soul-Heart | **reversed 2026-08-16 — back in Ubers** |
| Magearna-Original | 600 | Steel / Fairy | Soul-Heart | **reversed 2026-08-16 — back in Ubers** |
| Marshadow | 600 | Fighting / Ghost | Technician |  |
| Spectrier | 580 | Ghost | Grim Neigh |  |
| Pheromosa | 570 | Bug / Fighting | Beast Boost |  |
| Naganadel | 540 | Poison / Dragon | Beast Boost |  |
| Dracovish | 505 | Water / Dragon | Strong Jaw |  |

Five of these are **680–700 BST box legendaries** (Kyurem-Black, Dialga, Lugia,
Lunala, Necrozma-Dawn-Wings, Solgaleo). Reasoning about them purely by BST is
lazy — Lugia is a wall, not a sweeper — but a tier whose top six entries by raw
stats are all recent Ubers refugees is worth examining closely.

---

## 4. The RedGPT-specific facts that change the answer

These are the ones that matter *for judging OU upward*. The full list is in
`DIFFERENCES_FROM_SHOWDOWN.md`.

1. **No Terastallization in OU.** Not "banned in practice" — the format rule is
   off. Only Anything Goes and the two "(Tera)" variants have it. Any argument
   of the form "it Teras into X" is void here. This cuts both ways: it weakens
   Tera-dependent attackers *and* removes the defensive Tera that let frail
   Pokémon survive one hit.
2. **Mega Evolution needs no Key Stone and costs only the item slot.** It is on
   in every format. 29 of the 106 OU entries are Megas. A Pokémon promoted out
   of OU is being removed from a metagame that already contains Mega Garchomp,
   Mega Metagross, Mega Tyranitar, Mega Latios and Mega Diancie at 700 BST.
3. **Priority is unconditional.** Sucker Punch, Thunderclap, First Impression,
   Upper Hand and Grassy Glide have lost their activation conditions entirely.
   Revenge killing is far more reliable here than on Showdown, which suppresses
   frail setup sweepers — relevant to Pheromosa, Marshadow, Spectrier and
   Naganadel, all of which are fast and paper-thin.
4. **Several abilities are stronger than upstream.** Adaptability, Technician,
   Multiscale and Shadow Shield behave as expected, but Parental Bond's second
   hit is 50%, Transistor is 1.5x, the `-ate` family is 1.3x, Gale Wings works
   at any HP, Protean/Libero re-trigger on every move, Magic Guard also ignores
   Toxic Spikes and full paralysis, and Dauntless Shield / Intrepid Sword fire
   on **every** entry rather than once per battle.
5. **Supreme Overlord is redesigned** to a flat +1 Attack on entry with no
   fallen-ally scaling — so Kingambit is *better* early and worse late than you
   expect.
6. **Some OU entries carry pre-nerf base stats**, and the deltas are real:

   | OU entry | RedGPT spread | Upstream spread |
   | --- | --- | --- |
   | Zamazenta | 92/**130**/115/80/115/138 (BST 670) | 92/120/115/80/115/138 (660) |
   | Ting-Lu | **165**/110/**130**/50/80/45 (580) | 155/110/125/55/80/45 (570) |

7. **Ring Target is the strongest item in the game** and OU may hold one per
   team. It turns any single type immunity into neutral damage. See the addendum
   — it is the reason a mono-Ghost or mono-Electric attacker cannot be dismissed
   on "it has an immunity that walls it".
8. **Multi-hit moves are a flat 25 BP per hit** (2–5 hit) and **50 BP per hit**
   (exactly-2), so Population-Bomb-style spam maths is different.
9. **Toxic Orb and Flame Orb activate on entry**, not at end of turn. A Guts or
   Poison Heal attacker is boosted on the turn it arrives.
10. **The AI is full-information** and plays at four tiers. It reads the whole
    opposing team's movesets. This is not a tiering input directly, but it means
    "this thing is only good because the opponent misplays" is not an argument
    that works here.

---

## 5. The OU roster — all 93 entries

Generated from `Formats.tierRoster('OU')`. Two kinds of entry, and the
distinction is load-bearing:

- a **species** entry is a Pokémon you pick in the Team Builder;
- a **forme** entry is *not selectable at all*. It is reached by giving the base
  species a held item. Charizard is ZU; Charizard-Mega-Y is OU. So "Charizard is
  in OU" would be wrong — what is in OU is the right to hold a Charizardite.

<!-- BEGIN GENERATED ROSTER -->
### Species entries (61)

| # | Pokémon | Types | BST | HP/Atk/Def/SpA/SpD/Spe | Abilities | Note |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Alomomola | Water | 470 | 165/75/80/40/45/65 | Healer, Hydration, Regenerator |  |
| 2 | Annihilape | Fighting / Ghost | 535 | 110/115/80/50/90/90 | Vital Spirit, Inner Focus, Defiant | **dropped from Ubers 2026-08-15** |
| 3 | Baxcalibur | Dragon / Ice | 600 | 115/145/92/75/86/87 | Thermal Exchange, Ice Body | **dropped from Ubers 2026-08-15** |
| 4 | Blaziken | Fire / Fighting | 530 | 80/120/70/110/70/80 | Blaze, Speed Boost |  |
| 5 | Ceruledge | Fire / Ghost | 525 | 75/125/80/60/100/85 | Flash Fire, Weak Armor |  |
| 6 | Cinderace | Fire | 530 | 80/116/75/65/75/119 | Blaze, Libero |  |
| 7 | Clodsire | Poison / Ground | 430 | 130/75/60/45/100/20 | Poison Point, Water Absorb, Unaware |  |
| 8 | Darkrai | Dark | 600 | 70/90/90/135/90/125 | Bad Dreams | **dropped from Ubers 2026-08-15** |
| 9 | Deoxys | Psychic | 600 | 50/150/50/150/50/150 | Pressure | **dropped from Ubers 2026-08-15** |
| 10 | Deoxys-Speed | Psychic | 600 | 50/95/90/95/90/180 | Pressure | **dropped from Ubers 2026-08-15** |
| 11 | Dialga | Steel / Dragon | 680 | 100/120/120/150/100/90 | Pressure, Telepathy | **dropped from Ubers 2026-08-15** |
| 12 | Dondozo | Water | 530 | 150/100/115/65/65/35 | Unaware, Oblivious, Water Veil |  |
| 13 | Dracovish | Water / Dragon | 505 | 90/90/100/70/80/75 | Water Absorb, Strong Jaw, Sand Rush | **dropped from Ubers 2026-08-15** |
| 14 | Dragapult | Dragon / Ghost | 600 | 88/120/75/100/75/142 | Clear Body, Infiltrator, Cursed Body | **dropped from Ubers 2026-08-15** |
| 15 | Dragonite | Dragon / Flying | 600 | 91/134/95/100/100/80 | Inner Focus, Multiscale |  |
| 16 | Ferrothorn | Grass / Steel | 489 | 74/94/131/54/116/20 | Iron Barbs, Anticipation |  |
| 17 | Garchomp | Dragon / Ground | 600 | 108/130/95/80/85/102 | Sand Veil, Rough Skin |  |
| 18 | Gholdengo | Steel / Ghost | 550 | 87/60/95/133/91/84 | Good as Gold |  |
| 19 | Gliscor | Ground / Flying | 510 | 75/95/125/45/75/95 | Hyper Cutter, Sand Veil, Poison Heal |  |
| 20 | Great Tusk | Ground / Fighting | 570 | 115/131/131/53/53/87 | Protosynthesis |  |
| 21 | Greninja | Water / Dark | 530 | 72/95/67/103/71/122 | Torrent, Protean, Battle Bond |  |
| 22 | Heatran | Fire / Steel | 600 | 91/90/106/130/106/77 | Flash Fire, Flame Body |  |
| 23 | Hoopa-Unbound | Psychic / Dark | 680 | 80/160/60/170/130/80 | Magician |  |
| 24 | Iron Hands | Fighting / Electric | 570 | 154/140/108/50/68/50 | Quark Drive |  |
| 25 | Iron Moth | Fire / Poison | 570 | 80/70/60/140/110/110 | Quark Drive |  |
| 26 | Iron Valiant | Fairy / Fighting | 590 | 74/130/90/120/60/116 | Quark Drive |  |
| 27 | Kartana | Grass / Steel | 570 | 59/181/131/59/31/109 | Beast Boost |  |
| 28 | Kingambit | Dark / Steel | 550 | 100/135/120/60/85/50 | Defiant, Supreme Overlord, Pressure |  |
| 29 | Kommo-o | Dragon / Fighting | 600 | 75/110/125/100/105/85 | Bulletproof, Soundproof, Overcoat |  |
| 30 | Kyurem | Dragon / Ice | 660 | 125/130/90/130/90/95 | Pressure |  |
| 31 | Kyurem-Black | Dragon / Ice | 700 | 125/170/100/120/90/95 | Teravolt | **dropped from Ubers 2026-08-15** |
| 32 | Landorus-Therian | Ground / Flying | 600 | 89/145/90/105/80/91 | Intimidate |  |
| 33 | Latios | Dragon / Psychic | 600 | 80/90/80/130/110/110 | Levitate |  |
| 34 | Lugia | Psychic / Flying | 680 | 106/90/130/90/154/110 | Pressure, Multiscale | **dropped from Ubers 2026-08-15** |
| 35 | Lunala | Psychic / Ghost | 680 | 137/113/89/137/107/97 | Shadow Shield | **dropped from Ubers 2026-08-15** |
| 36 | Manaphy | Water | 600 | 100/100/100/100/100/100 | Hydration |  |
| 37 | Marshadow | Fighting / Ghost | 600 | 90/125/80/90/90/125 | Technician | **dropped from Ubers 2026-08-15** |
| 38 | Melmetal | Steel | 600 | 135/143/143/80/65/34 | Iron Fist |  |
| 39 | Meowscarada | Grass / Dark | 530 | 76/110/70/81/70/123 | Overgrow, Protean |  |
| 40 | Naganadel | Poison / Dragon | 540 | 73/73/73/127/73/121 | Beast Boost | **dropped from Ubers 2026-08-15** |
| 41 | Necrozma-Dawn-Wings | Psychic / Ghost | 680 | 97/113/109/157/127/77 | Prism Armor | **dropped from Ubers 2026-08-15** |
| 42 | Pheromosa | Bug / Fighting | 570 | 71/137/37/137/37/151 | Beast Boost | **dropped from Ubers 2026-08-15** |
| 43 | Raging Bolt | Electric / Dragon | 590 | 125/73/91/137/89/75 | Protosynthesis |  |
| 44 | Rillaboom | Grass | 530 | 100/125/90/60/70/85 | Overgrow, Grassy Surge |  |
| 45 | Roaring Moon | Dragon / Dark | 590 | 105/139/71/55/101/119 | Protosynthesis | **dropped from Ubers 2026-08-15** |
| 46 | Samurott-Hisui | Water / Dark | 528 | 90/108/80/100/65/85 | Torrent, Sharpness |  |
| 47 | Slowking-Galar | Poison / Psychic | 490 | 95/65/80/110/110/30 | Curious Medicine, Own Tempo, Regenerator |  |
| 48 | Solgaleo | Psychic / Steel | 680 | 137/137/107/113/89/97 | Full Metal Body | **dropped from Ubers 2026-08-15** |
| 49 | Spectrier | Ghost | 580 | 100/65/60/145/80/130 | Grim Neigh | **dropped from Ubers 2026-08-15** |
| 50 | Tapu Koko | Electric / Fairy | 570 | 70/115/85/95/75/130 | Electric Surge, Telepathy |  |
| 51 | Tapu Lele | Psychic / Fairy | 570 | 70/85/75/130/115/95 | Psychic Surge, Telepathy |  |
| 52 | Terapagos | Normal | 450 | 90/65/85/65/85/60 | Tera Shift |  |
| 53 | Terapagos-Terastal | Normal | 600 | 95/95/110/105/110/85 | Tera Shell |  |
| 54 | Ting-Lu | Dark / Ground | 580 | 165/110/130/50/80/45 | Vessel of Ruin |  |
| 55 | Tornadus-Therian | Flying | 580 | 79/100/80/110/90/121 | Regenerator |  |
| 56 | Toxapex | Poison / Water | 495 | 50/63/152/53/142/35 | Merciless, Limber, Regenerator |  |
| 57 | Urshifu-Rapid-Strike | Fighting / Water | 550 | 100/130/100/63/60/97 | Unseen Fist |  |
| 58 | Volcarona | Bug / Fire | 550 | 85/60/65/135/105/100 | Flame Body, Swarm |  |
| 59 | Xurkitree | Electric | 570 | 83/89/71/173/71/83 | Beast Boost |  |
| 60 | Zamazenta | Fighting | 670 | 92/130/115/80/115/138 | Dauntless Shield |  |
| 61 | Zapdos | Electric / Flying | 580 | 90/90/85/125/90/100 | Pressure, Static, Lightning Rod |  |

### Forme entries (32) — reached by holding an item, never picked directly

| # | Forme | Reached by | Types | BST | HP/Atk/Def/SpA/SpD/Spe | Ability | Note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Alakazam-Mega | Alakazam + Alakazite | Psychic | 600 | 55/50/65/175/105/150 | Trace | **dropped from Ubers 2026-08-15** |
| 2 | Barbaracle-Mega | Barbaracle + Barbaracite | Rock / Fighting | 600 | 72/140/130/64/106/88 | Tough Claws | tier *estimated*, not ranked by Smogon |
| 3 | Blastoise-Mega | Blastoise + Blastoisinite | Water | 630 | 79/103/120/135/115/78 | Mega Launcher | **dropped from Ubers 2026-08-15** |
| 4 | Charizard-Mega-X | Charizard + Charizardite X | Fire / Dragon | 634 | 78/130/111/130/85/100 | Tough Claws |  |
| 5 | Charizard-Mega-Y | Charizard + Charizardite Y | Fire / Flying | 634 | 78/104/78/159/115/100 | Drought |  |
| 6 | Chesnaught-Mega | Chesnaught + Chesnaughtite | Grass / Fighting | 630 | 88/137/172/74/115/44 | Bulletproof | tier *estimated*, not ranked by Smogon |
| 7 | Clefable-Mega | Clefable + Clefablite | Fairy / Flying | 583 | 95/80/93/135/110/70 | Magic Bounce | tier *estimated*, not ranked by Smogon |
| 8 | Diancie-Mega | Diancie + Diancite | Rock / Fairy | 700 | 50/160/110/160/110/110 | Magic Bounce |  |
| 9 | Excadrill-Mega | Excadrill + Excadrite | Ground / Steel | 608 | 110/165/100/65/65/103 | Piercing Drill | tier *estimated*, not ranked by Smogon |
| 10 | Feraligatr-Mega | Feraligatr + Feraligite | Water / Dragon | 630 | 85/160/125/89/93/78 | Dragonize | tier *estimated*, not ranked by Smogon |
| 11 | Floette-Mega | Floette-Eternal + Floettite | Fairy | 651 | 74/85/87/155/148/102 | Fairy Aura |  |
| 12 | Gallade-Mega | Gallade + Galladite | Psychic / Fighting | 618 | 68/165/95/65/115/110 | Inner Focus |  |
| 13 | Garchomp-Mega | Garchomp + Garchompite | Dragon / Ground | 700 | 108/170/115/120/95/92 | Sand Force |  |
| 14 | Glimmora-Mega | Glimmora + Glimmoranite | Rock / Poison | 625 | 83/90/105/150/96/101 | Adaptability | tier *estimated*, not ranked by Smogon |
| 15 | Golisopod-Mega | Golisopod + Golisopite | Bug / Steel | 630 | 75/150/175/70/120/40 | Emergency Exit | tier *estimated*, not ranked by Smogon |
| 16 | Greninja-Ash | Greninja + null | Water / Dark | 640 | 72/145/67/153/71/132 | Battle Bond |  |
| 17 | Greninja-Mega | Greninja + Greninjite | Water / Dark | 630 | 72/125/77/133/81/142 | Protean | tier *estimated*, not ranked by Smogon |
| 18 | Gyarados-Mega | Gyarados + Gyaradosite | Water / Dark | 640 | 95/155/109/70/130/81 | Mold Breaker |  |
| 19 | Hawlucha-Mega | Hawlucha + Hawluchanite | Fighting / Flying | 600 | 78/137/100/74/93/118 | No Guard |  |
| 20 | Latios-Mega | Latios + Latiosite | Dragon / Psychic | 700 | 80/130/100/160/120/110 | Levitate |  |
| 21 | Lopunny-Mega | Lopunny + Lopunnite | Normal / Fighting | 580 | 65/136/94/54/96/135 | Scrappy |  |
| 22 | Lucario-Mega | Lucario + Lucarionite | Fighting / Steel | 625 | 70/145/88/140/70/112 | Adaptability | **dropped from Ubers 2026-08-15** |
| 23 | Mawile-Mega | Mawile + Mawilite | Steel / Fairy | 480 | 50/105/125/55/95/50 | Huge Power |  |
| 24 | Medicham-Mega | Medicham + Medichamite | Fighting / Psychic | 510 | 60/100/85/80/85/100 | Pure Power |  |
| 25 | Metagross-Mega | Metagross + Metagrossite | Steel / Psychic | 700 | 80/145/150/105/110/110 | Tough Claws | **dropped from Ubers 2026-08-15** |
| 26 | Ogerpon-Cornerstone | Ogerpon + Cornerstone Mask | Grass / Rock | 550 | 80/120/84/60/96/110 | Sturdy |  |
| 27 | Ogerpon-Hearthflame | Ogerpon + Hearthflame Mask | Grass / Fire | 550 | 80/120/84/60/96/110 | Mold Breaker | **dropped from Ubers 2026-08-15** |
| 28 | Ogerpon-Wellspring | Ogerpon + Wellspring Mask | Grass / Water | 550 | 80/120/84/60/96/110 | Water Absorb |  |
| 29 | Pinsir-Mega | Pinsir + Pinsirite | Bug / Flying | 600 | 65/155/120/65/90/105 | Aerilate |  |
| 30 | Scizor-Mega | Scizor + Scizorite | Bug / Steel | 600 | 70/150/140/65/100/75 | Technician |  |
| 31 | Tyranitar-Mega | Tyranitar + Tyranitarite | Rock / Dark | 700 | 100/164/150/95/120/71 | Sand Stream |  |
| 32 | Zeraora-Mega | Zeraora + Zeraorite | Electric | 700 | 88/157/75/147/80/153 | Volt Absorb | tier *estimated*, not ranked by Smogon |
<!-- END GENERATED ROSTER -->

---

## 6. Traps specific to this roster

Each of these will produce a wrong answer if you reason past it.

**Twelve forme entries carry an *estimated* tier.** Smogon has never ranked
Barbaracle-Mega, Chesnaught-Mega, Clefable-Mega, Excadrill-Mega,
Feraligatr-Mega, Glimmora-Mega, Golisopod-Mega, Greninja-Mega, Hawlucha-Mega,
Scolipede-Mega, Skarmory-Mega or Zeraora-Mega. Their OU
placement is this project's own nearest-neighbour guess from the 48 Megas Nat
Dex *does* rank. **This is the softest evidence in the file and the easiest to
move** — Zeraora-Mega in particular is a 700 BST, 153-Speed, 157/147 mixed
attacker sitting in OU on an estimate. Say so explicitly if you flag one.

**Promoting a forme is not promoting its base species, and vice versa.** This
project bans the *forme*, never the Pokémon: Absol plays in PU and simply may
not hold Absolite there. So "Metagross-Mega should go to Ubers" means "the
Metagrossite becomes illegal in OU", and plain Metagross is unaffected. **This
is exactly how the Lucario-Mega-Z promotion was applied on 2026-08-16**: base
Lucario is still RU, ordinary Lucario-Mega is still OU, and only Lucarionite Z
became illegal in OU. Eight OU species are in the same position:

> Baxcalibur, Blaziken, Darkrai, Dialga, Dragonite, Garchomp, Heatran and
> Zamazenta are all legal in OU while their Mega, Origin or Crowned forme is
> Ubers and its item is banned there.

**Five OU species have a Mega that is also OU**, so both halves are legal
together — Garchomp, Greninja, Gyarados, Hawlucha and Latios. That is a species
whose ceiling is much higher than its own stat line suggests.

**Terapagos's 450 BST is a fiction.** Tera Shift turns it into
Terapagos-Terastal (600 BST, 95/95/110/105/110/85, Tera Shell) automatically on
entry, with no item and no declaration. Both are listed separately in the roster
above, but in play there is only ever the 600 BST one. Terapagos-Stellar (700
BST) is Ubers and is **unreachable** — the Terastal-to-Stellar step is not
implemented and Tera is off in OU anyway.

**Ogerpon-Hearthflame has never actually been played in OU.** It was dropped to
OU on 2026-08-15, but the Hearthflame Mask did not exist as a working item until
2026-08-16 — the whole Ogerpon line was unreachable outside Anything Goes. As of
now it works: base Ogerpon (RU) holds the Mask and arrives as Grass/Fire
Ogerpon-Hearthflame with **Mold Breaker** and a flat **1.2x on every attack**
from the Mask. It does *not* get Embody Aspect (+1 Attack), because that lives on
the Tera forme and OU has no Tera. Treat it as an untested arrival rather than as
a settled OU citizen. The same applies to Ogerpon-Wellspring (Water Absorb) and
Ogerpon-Cornerstone (Sturdy), which were never Ubers but were equally unplayable.

**No OU entry can transform into an above-OU forme mid-battle.** Worth stating,
because the engine has a known hole here: `maxTier` is checked when validating a
team and *never in battle*, so an ability-driven forme change is not tier-gated.
That is why Darmanitan-Galar and Zygarde were deliberately **not** dropped — they
would become Ubers-ranked formes mid-battle. It was checked against the current
roster on 2026-08-16 and nothing in OU exploits it. Do not propose a promotion on
this basis without saying which forme you mean.

**Ting-Lu is the only Treasure of Ruin in OU.** Chi-Yu and Chien-Pao are Ubers,
Wo-Chien is PU. Ting-Lu has the pre-nerf spread (165 HP / 130 Def) and Vessel of
Ruin, which cuts every opposing Pokémon's Special Attack by 25% just by standing
there.

---

## 7. What a useful answer looks like

- **List as many as you think belong, with no cap.** If the honest answer is
  "none of them", say that; if it is fourteen, say fourteen.
- **Rank by confidence, not by power.** Put the ones you are most sure about
  first and say roughly how sure — a clear ordering matters more than a number.
- **Give a mechanical reason per entry**, naming the thing that makes it
  unhealthy: a stat line, an ability, a move, a lack of counterplay in *this*
  roster. "It was Ubers in SV" is not a reason.
- **Name the counterplay you considered and why it fails.** The 604-species OU
  pool is large; something in it usually answers a threat, and the interesting
  claim is that nothing does.
- **Flag speculation as speculation.** Where you are extrapolating rather than
  reasoning from something stated here, say so in the same sentence. An
  estimated-tier Mega, or anything whose behaviour depends on a mechanic this
  file does not describe, is speculation by default.
- **Say when you need a fact this file does not contain.** Movepools, for
  instance, are not in here. Asking is better than assuming.
- **Distinguish "promote the forme" from "promote the species"** for every one
  of the 32 forme entries.
