# Pokémon RedGPT — the UU format, for a two-directional tiering audit

**This is a briefing about a game that is not Pokémon Showdown.** RedGPT runs its
own engine with its own deliberate rule changes, and several of them change
tiering answers directly. Read §2 before judging anything: a Pokémon that is
mediocre on Showdown can be a problem here, and vice versa.

Everything below the generated markers is produced from the live game by
`node tools/uu-audit-doc.js`, and the roster blocks are **pinned by a test** that
compares them to `Formats.tierRoster`. A briefing its reader cannot check is
worse than none, because every conclusion drawn from it inherits the error.

---

## 1. The question

**Which UU entries are too strong for UU, and which are too weak?**

Both directions, and they are judged against different bars:

- **Too strong** means it should move **up to OU**. The bar is §5 — if it would
  be a routine member of that roster rather than the thing UU has to be built
  around, it stays.
- **Too weak** means it should move **down to RU**. The bar is §6 — if RU's
  better entries outclass it at its own job, it drops.

**Most entries should not move.** A pass that reshuffles a third of the tier is
almost certainly measuring noise or personal taste. The useful output is a short,
confident list with the reasoning attached.

### Two entry kinds, and the distinction is load-bearing

- A **species** entry is a Pokémon you pick in the Team Builder.
- A **forme** entry is *not selectable at all*. It is reached by giving a base
  species a held item (or, for Ash-Greninja, an ability). Skarmory is UU and
  Skarmory-Mega is UU; Charizard is ZU while both its Megas are OU. So "Charizard
  is in OU" would be wrong — what is in OU is the right to hold a Charizardite.

**A forme moves independently of its base.** Moving Mega Skarmory does not move
Skarmory, and moving Skarmory does not move the Mega. If your verdict is about
the Mega, say so explicitly.

---

## 2. How RedGPT differs from Showdown

Only the differences that can change a tiering answer are listed. §7, §8 and §9
give the complete generated tables.

### The format itself

- **No Terastallization in UU.** Tera is on in only three of eleven formats
  (Anything Goes, Ubers (Tera), OU (Tera)). Any Showdown reasoning that leans on
  Tera — defensive Tera to blank a matchup, Tera Blast for coverage, a Tera-boosted
  sweep — **does not apply here**.
- **Mega Evolution needs no Key Stone.** Holding the species' own Mega Stone is
  enough, once per side per battle, and it is on in every format. The entire cost
  of a Mega is the item slot: no Leftovers, no Choice item, no Boots, no Ring
  Target. Rayquaza is the games' own exception and needs Dragon Ascent.
- **Species Clause and Sleep Clause are on. Item Clause is off**, except that
  **Ring Target is one per team in every format** (see §9).
- Level 100, 6v6 singles, EVs capped at 510/252 as usual.
- **Tier ceilings are enforced on the team, and on the forme.** A UU team may not
  hold an item that produces an OU-or-above forme; the Pokémon itself stays legal.

### Priority is unconditional

**Sucker Punch, Thunderclap, First Impression, Upper Hand and Grassy Glide keep
their positive priority and lost their activation conditions.** Sucker Punch does
not care whether the target is attacking; First Impression works on any turn;
Grassy Glide is +1 with no Grassy Terrain needed (the packaged move still reads
priority 0 — the engine adds it). Upper Hand also lost its flinch.

This is one of the largest divergences in the game for tiering. A fast frail
sweeper is much easier to answer here than on Showdown, and §10 lists exactly
which UU entries carry these moves.

**Fake Out keeps its first-turn restriction**, and Dark Void is still
Darkrai-only.

### Damage numbers

- **Multi-hit moves are standardised**: 2-5 hit moves are a flat **25 BP per
  hit**, exactly-2-hit moves **50 BP per hit**. Wrap, Bind, Fire Spin and Clamp
  are 2-5 hit attacks that still trap. Three-hit moves and Population Bomb are
  deliberately untouched — so **Triple Axel is unaffected** and keeps its own
  escalating shape.
- **Base-power nerfs are rolled back** — Draco Meteor, Leaf Storm and Overheat
  are 140, Blizzard 120, and 29 others. The full generated list is §7.
- **Eleven species keep their pre-nerf base stats** (Aegislash both formes,
  Cresselia, Zacian, Zamazenta and all four Treasures of Ruin). §10 names the
  ones that land in UU.
- Damage is **0-2 HP off** Showdown's calculator from a known rounding
  difference (≤0.5%). It never changes a tier and is not worth reasoning about.

### Abilities and items

Full generated tables in §8 and §9. The ones that most often change a verdict:

- **Protean and Libero retrigger on every move** — not once per switch-in — and
  they grant STAB, so a Protean holder gets 1.5x on everything it throws.
- **Heatproof is a full Fire immunity**, not a halving.
- **Cloud Nine and Air Lock delete the weather** on entry rather than suppressing
  it.
- **Intrepid Sword and Dauntless Shield fire on every entry.**
- **Ring Target lets its holder's attacks hit for neutral damage on a target that
  would be immune by type.** It is the strongest item in the game for a Pokémon
  a single immunity blanks, it is **one per team**, and it is **visible to the
  opponent from turn one**. Type immunity only — it does not beat Levitate,
  Flash Fire or Water Absorb.
- **Toxic Orb and Flame Orb activate on entry**, so a Guts or Poison Heal holder
  is boosted on the turn it arrives.
- **Every species keeps every ability it has ever had** — Gengar keeps Levitate,
  the Litwick line keeps Shadow Tag, Zapdos keeps Lightning Rod.

---

<!-- BEGIN GENERATED LADDER -->
| Tier | Entries | Role in this audit |
| --- | --- | --- |
| Ubers | 63 | above OU; out of scope |
| **OU** | **93** | the bar a UU entry is "too strong" against |
| **UU** | **91** | **the tier under review** |
| **RU** | **131** | the bar a UU entry is "too weak" against |
| NU | 67 | below RU; out of scope |
| PU | 110 | |
| ZU | 677 | |
<!-- END GENERATED LADDER -->

---

## 4. The UU roster in full — the tier under review

**How to read a profile.** Every number is what the **engine** produces at use
time, not what the packaged move data says — that distinction has already nearly
decided a tier here (Ivy Cudgel is packaged Grass and resolves to Fire, Water or
Rock from the Mask).

- `100P` / `120S` — base power and physical/special.
- `25x2-5` — a multi-hit move at 25 BP per hit, two to five hits, ranked on its
  *average* hit count.
- `(+1)` on a priority line is the **engine's** priority, so Grassy Glide shows
  +1 against a packaged 0.
- **Coverage is filtered to the category the Pokémon can actually attack from.**
  A legal physical move on a 40-Attack special attacker is not coverage. Both
  categories appear when Attack and Special Attack are within 20 of each other.
- **STAB is filtered the same way but falls back and says so** — a
  `**(wrong category)**` tag means its only STAB of that type is on the wrong
  side of its spread, which is itself a finding.
- `**none**` is meaningful: no setup, no recovery, or no coverage at all.
- A forme entry ends with the route that reaches it.

<!-- BEGIN GENERATED UU POOLS -->
### UU — 91 entries

**Aegislash** Steel/Ghost 520 (60/50/150/50/150/60) — Stance Change
  STAB: Steel Steel Beam 140S · Ghost Shadow Ball 80S
  Physical coverage: Rock Head Smash 150P, Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Return 102P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Flying Air Slash 75S, Normal Hidden Power 60S, Electric Shock Wave 60S
  Setup: Autotomize, Iron Defense, Swords Dance | Recovery: Rest | Priority: Shadow Sneak 40P Ghost (+1)
  Utility: Destiny Bond, Protect, Reflect, Substitute

**Aegislash-Blade** Steel/Ghost 520 (60/150/50/150/50/60) — Stance Change
  STAB: Steel Steel Beam 140S · Ghost Shadow Ball 80S
  Physical coverage: Rock Head Smash 150P, Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Return 102P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Flying Air Slash 75S, Normal Hidden Power 60S, Electric Shock Wave 60S
  Setup: Autotomize, Iron Defense, Swords Dance | Recovery: Rest | Priority: Shadow Sneak 40P Ghost (+1)
  Utility: Destiny Bond, Protect, Reflect, Substitute

**Aerodactyl-Mega** Rock/Flying 615 (80/135/85/70/95/150) — Tough Claws
  STAB: Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Fire Fire Blast 120S, Dragon Dragon Pulse 90S, Ground Earth Power 90S, Normal Razor Wind 80 (charge)S, Ghost Ominous Wind 60S
  Setup: Agility, Dragon Dance, Hone Claws, Rock Polish | Recovery: Rest, Roost
  Hazards: Stealth Rock | Removal: Defog | Utility: Detect, Protect, Reflect, Substitute, Tailwind, Taunt
  *(reached by Aerodactyl + Aerodactylite)*

**Alakazam** Psychic 500 (55/50/45/135/95/120) — Synchronize / Inner Focus / Magic Guard
  STAB: Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Zap Cannon 120S, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Normal Tri Attack 80S
  Setup: Barrier, Calm Mind, Nasty Plot | Recovery: Recover, Rest
  Pivot: Teleport | Utility: Disable, Encore, Gravity, Knock Off, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room

**Altaria-Mega** Dragon/Fairy 590 (75/110/110/110/105/80) — Pixilate
  STAB: Dragon Draco Meteor 140S · Fairy Double-Edge 156P
  Physical coverage: Flying Sky Attack 140 (charge)P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Thief 60P, Grass Trailblaze 50P, Fighting Rock Smash 40P
  Special coverage: Fire Fire Blast 120S, Flying Hurricane 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ice Ice Beam 95S, Ghost Ominous Wind 60S
  Setup: Agility, Cotton Guard, Dragon Dance, Hone Claws | Recovery: Rest, Roost
  Removal: Defog | Utility: Haze, Perish Song, Protect, Safeguard, Substitute, Tailwind
  *(reached by Altaria + Altarianite)*

**Amoonguss** Grass/Poison 464 (114/85/70/85/80/30) — Effect Spore / Regenerator
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Return 102P, Dark Foul Play 95P, Ground Stomping Tantrum 75P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Bug Pollen Puff 90S, Normal Tera Blast 80S, Ghost Hex 65S
  Setup: Defense Curl, Growth | Recovery: Rest
  Utility: Clear Smog, Protect, Substitute

**Archaludon** Steel/Dragon 600 (90/105/130/125/65/85) — Stamina / Sturdy / Stalwart
  STAB: Steel Steel Beam 140S · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Foul Play 95P, Fighting Body Press 80P
  Special coverage: Electric Electro Shot 130 (charge)S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Fighting Aura Sphere 90S, Dark Dark Pulse 80S, Normal Tera Blast 80S
  Setup: Hone Claws, Iron Defense, Swords Dance | Recovery: Rest
  Hazards: Stealth Rock | Utility: Light Screen, Protect, Reflect, Substitute

**Azumarill** Water/Fairy 420 (100/50/80/60/80/50) — Thick Fat / Huge Power / Sap Sipper
  STAB: Water Aqua Tail 90P · Fairy Play Rough 90P
  Physical coverage: Fighting Focus Punch 150P, Steel Steel Roller 130P, Normal Double-Edge 120P, Ground Dig 100 (charge)P, Flying Bounce 85 (charge)P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Psychic Future Sight 120S, Normal Hyper Voice 90S, Grass Grass Knot 60S, Ground Mud Shot 55S
  Setup: Amnesia, Defense Curl, Work Up | Recovery: Rest | Priority: Aqua Jet 40P Water (+1)
  Utility: Encore, Knock Off, Light Screen, Perish Song, Protect, Substitute

**Bisharp** Dark/Steel 490 (65/125/100/60/70/70) — Defiant / Inner Focus / Pressure
  STAB: Dark Foul Play 95P · Steel Iron Head 80P
  Physical coverage: Normal Return 102P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Flying Air Slash 75S, Grass Grass Knot 60S
  Setup: Hone Claws, Iron Defense, Rock Polish, Swords Dance | Recovery: Rest | Priority: Sucker Punch 80P Dark (+1)
  Hazards: Stealth Rock | Utility: Knock Off, Protect, Substitute, Taunt

**Blacephalon** Fire/Ghost 570 (53/127/53/151/79/107) — Beast Boost
  STAB: Fire Mind Blown 150S · Ghost Shadow Ball 80S
  Physical coverage: Normal Explosion 250P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Rock Rock Blast 25x2-5P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S
  Setup: Calm Mind | Recovery: Rest
  Utility: Encore, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Substitute, Taunt, Trick

**Blissey** Normal 540 (255/10/10/75/135/55) — Natural Cure / Serene Grace / Healer
  STAB: Normal Hyper Voice 90S
  Physical coverage: Fighting Focus Punch 150P, Ground Earthquake 100P, Steel Iron Tail 100P, Electric Wild Charge 90P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S
  Setup: Calm Mind, Defense Curl, Work Up | Recovery: Rest, Soft-Boiled
  Hazards: Stealth Rock | Pivot: Teleport | Utility: Gravity, Healing Wish, Light Screen, Protect, Reflect, Safeguard, Substitute, Trick

**Buzzwole** Bug/Fighting 570 (107/139/139/53/53/79) — Beast Boost
  STAB: Bug Leech Life 80P · Fighting Focus Punch 150P
  Physical coverage: Dragon Outrage 120P, Normal Return 102P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P
  Special coverage: Normal Hidden Power 60S
  Setup: Bulk Up, Harden, Work Up | Recovery: Rest, Roost
  Utility: Protect, Substitute, Taunt

**Celesteela** Steel/Flying 570 (97/101/103/107/101/61) — Beast Boost
  STAB: Steel Steel Beam 140S · Flying Acrobatics 110P
  Physical coverage: Normal Explosion 250P, Bug Megahorn 120P, Fighting Superpower 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Grass Seed Bomb 80P
  Special coverage: Fire Fire Blast 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Normal Hidden Power 60S, Electric Shock Wave 60S
  Setup: Autotomize, Harden, Iron Defense | Recovery: Rest
  Utility: Gravity, Leech Seed, Protect, Substitute

**Chandelure** Ghost/Fire 520 (60/55/90/145/90/80) — Flash Fire / Flame Body / Infiltrator / Shadow Tag
  STAB: Ghost Shadow Ball 80S · Fire Overheat 140S
  Physical coverage: Normal Return 102P, Dark Lash Out 75P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S
  Setup: Acid Armor, Calm Mind | Recovery: Rest
  Utility: Clear Smog, Haze, Memento, Pain Split, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room

**Chandelure-Mega** Ghost/Fire 620 (60/75/110/175/110/90) — Infiltrator
  STAB: Ghost Shadow Ball 80S · Fire Overheat 140S
  Physical coverage: Normal Return 102P, Dark Lash Out 75P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S
  Setup: Acid Armor, Calm Mind | Recovery: Rest
  Utility: Clear Smog, Haze, Memento, Pain Split, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  *(reached by Chandelure + Chandelurite)*

**Chansey** Normal 450 (250/5/5/35/105/50) — Natural Cure / Serene Grace / Healer
  STAB: Normal Hyper Voice 90S
  Physical coverage: Fighting Focus Punch 150P, Ground Earthquake 100P, Steel Iron Tail 100P, Electric Wild Charge 90P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S
  Setup: Calm Mind, Defense Curl, Work Up | Recovery: Rest, Soft-Boiled
  Hazards: Stealth Rock | Pivot: Teleport | Utility: Gravity, Healing Wish, Light Screen, Protect, Reflect, Safeguard, Substitute

**Clefable** Fairy 483 (95/70/73/95/90/60) — Cute Charm / Magic Guard / Unaware
  STAB: Fairy Misty Explosion 100S
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S
  Setup: Amnesia, Calm Mind, Cosmic Power, Defense Curl, Work Up | Recovery: Rest, Soft-Boiled
  Hazards: Stealth Rock | Pivot: Baton Pass, Teleport | Utility: Detect, Encore, Gravity, Healing Wish, Knock Off, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick

**Conkeldurr** Fighting 505 (105/140/95/55/65/45) — Guts / Sheer Force / Iron Fist
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Hard Press 100P, Rock Stone Edge 100P, Poison Poison Jab 80P, Fire Fire Punch 75P
  Special coverage: Normal Tera Blast 80S, Grass Grass Knot 60S
  Setup: Bulk Up, Work Up | Recovery: Rest | Priority: Upper Hand 65P Fighting (+3), Mach Punch 40P Fighting (+1)
  Removal: Defog | Utility: Detect, Knock Off, Protect, Substitute, Taunt

**Corviknight** Flying/Steel 495 (98/87/105/53/85/67) — Pressure / Unnerve / Mirror Armor
  STAB: Flying Sky Attack 140 (charge)P · Steel Steel Beam 140S
  Physical coverage: Normal Double-Edge 120P, Fighting Body Press 80P, Bug U-turn 70P, Dark Assurance 60P
  Special coverage: Normal Tera Blast 80S
  Setup: Agility, Bulk Up, Hone Claws, Iron Defense, Nasty Plot, Work Up | Recovery: Rest, Roost
  Removal: Defog | Pivot: U-turn | Utility: Light Screen, Protect, Reflect, Substitute, Tailwind, Taunt

**Delphox-Mega** Fire/Psychic 634 (75/69/72/159/125/134) — Levitate
  STAB: Fire Overheat 140S · Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Dark Foul Play 95P, Electric Thunder Punch 75P, Fighting Low Kick 60P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Normal Hyper Voice 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
  Setup: Agility, Calm Mind, Nasty Plot, Work Up | Recovery: Rest
  Utility: Encore, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Switcheroo, Trick, Trick Room
  *(reached by Delphox + Delphoxite)*

**Dragalge-Mega** Poison/Dragon 594 (65/85/105/132/163/44) — Regenerator
  STAB: Poison Sludge Wave 95S · Dragon Draco Meteor 140S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Water Aqua Tail 90P, Fairy Play Rough 90P, Flying Bounce 85 (charge)P, Dark Feint Attack 60P
  Special coverage: Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ice Icy Wind 55S
  Setup: Acid Armor | Recovery: Rest
  Hazards: Toxic Spikes | Pivot: Flip Turn | Utility: Haze, Protect, Substitute
  *(reached by Dragalge + Dragalgite)*

**Drampa-Mega** Normal/Dragon 585 (78/85/110/160/116/36) — Berserk
  STAB: Normal Hyper Voice 90S · Dragon Draco Meteor 140S
  Physical coverage: Fighting Superpower 120P, Ground Earthquake 100P, Fairy Play Rough 90P, Flying Fly 90 (charge)P, Dark Fling 80P, Rock Rock Slide 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Flying Hurricane 120S, Water Hydro Pump 120S, Electric Thunder 120S
  Setup: Amnesia, Calm Mind, Dragon Dance, Work Up | Recovery: Rest, Roost
  Removal: Defog | Utility: Light Screen, Protect, Safeguard, Substitute, Tailwind
  *(reached by Drampa + Drampanite)*

**Emboar-Mega** Fire/Fighting 628 (110/148/75/110/110/75) — Mold Breaker
  STAB: Fire Overheat 140S · Fighting Focus Punch 150P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Hard Press 100P, Electric Wild Charge 90P, Dark Fling 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Water Scald 80S, Normal Tera Blast 80S, Poison Smog 30S, Ground Mud-Slap 20S
  Setup: Bulk Up, Defense Curl, Work Up | Recovery: Rest | Priority: Sucker Punch 80P Dark (+1)
  Utility: Knock Off, Protect, Substitute, Taunt
  *(reached by Emboar + Emboarite)*

**Enamorus** Fairy/Flying 580 (74/115/70/135/80/106) — Cute Charm / Contrary
  STAB: Fairy Misty Explosion 100S · Flying Fly 90 (charge)P
  Physical coverage: Dragon Outrage 120P, Fighting Superpower 120P, Normal Take Down 90P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Ghost Astonish 30P
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Fire Mystical Fire 75S
  Setup: Agility, Calm Mind, Iron Defense | Recovery: Rest
  Utility: Healing Wish, Protect, Substitute, Tailwind, Taunt

**Excadrill** Ground/Steel 508 (110/135/60/50/65/88) — Sand Rush / Sand Force / Mold Breaker
  STAB: Ground Earthquake 100P · Steel Iron Head 80P
  Physical coverage: Normal Skull Bash 130P, Poison Poison Jab 80P, Fighting Submission 80P, Dark Throat Chop 80P, Bug X-Scissor 80P, Rock Rock Blast 25x2-5P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Bomb 90S, Normal Tera Blast 80S
  Setup: Hone Claws, Iron Defense, Swords Dance | Recovery: Rest
  Hazards: Stealth Rock | Removal: Rapid Spin | Utility: Protect, Substitute

**Gardevoir-Mega** Psychic/Fairy 618 (68/85/65/165/135/100) — Pixilate
  STAB: Psychic Future Sight 120S · Fairy Hyper Voice 117S
  Physical coverage: Dark Fling 80P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Ghost Shadow Sneak 40P
  Special coverage: Fighting Focus Blast 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S, Bug Signal Beam 75S
  Setup: Calm Mind, Defense Curl | Recovery: Rest | Priority: Shadow Sneak 40P Ghost (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Teleport | Utility: Destiny Bond, Disable, Encore, Gravity, Healing Wish, Knock Off, Light Screen, Magic Coat, Memento, Pain Split, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  *(reached by Gardevoir + Gardevoirite)*

**Gengar** Ghost/Poison 500 (60/65/60/130/75/110) — Cursed Body / Levitate
  STAB: Ghost Shadow Ball 80S · Poison Sludge Wave 95S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Dark Foul Play 95P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Psychic Dream Eater 100S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S
  Setup: Nasty Plot | Recovery: Rest | Priority: Sucker Punch 80P Dark (+1)
  Hazards: Toxic Spikes | Utility: Clear Smog, Destiny Bond, Disable, Encore, Haze, Knock Off, Pain Split, Perish Song, Protect, Substitute, Taunt, Trick, Trick Room

**Glimmora** Rock/Poison 525 (83/55/90/130/81/86) — Toxic Debris / Corrosion
  STAB: Rock Meteor Beam 120 (charge)S · Poison Sludge Wave 95S
  Physical coverage: Normal Explosion 250P, Ground Sand Tomb 35P
  Special coverage: Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Normal Tera Blast 80S
  Setup: Acid Armor, Harden, Iron Defense, Rock Polish | Recovery: Rest
  Hazards: Spikes, Stealth Rock, Toxic Spikes | Removal: Mortal Spin | Utility: Light Screen, Memento, Protect, Reflect, Substitute

**Goodra-Hisui** Steel/Dragon 600 (80/100/100/110/150/60) — Sap Sipper / Shell Armor / Gooey
  STAB: Steel Steel Beam 140S · Dragon Draco Meteor 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Grass Power Whip 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Poison Sludge Wave 95S
  Setup: Acid Armor, Shelter | Recovery: Rest | Priority: Feint 50P Normal (+2)
  Utility: Knock Off, Protect, Substitute

**Gyarados** Water/Flying 540 (95/125/79/60/100/81) — Intimidate / Moxie
  STAB: Water Aqua Tail 90P · Flying Bounce 85 (charge)P
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Grass Power Whip 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S, Normal Uproar 90S, Dark Dark Pulse 80S
  Setup: Dragon Dance | Recovery: Rest
  Utility: Protect, Reflect, Substitute, Taunt

**Hatterene** Psychic/Fairy 510 (57/90/95/136/103/29) — Healer / Anticipation / Magic Bounce
  STAB: Psychic Future Sight 120S · Fairy Misty Explosion 100S
  Physical coverage: Grass Power Whip 120P, Normal Facade 70P, Ghost Shadow Claw 70P, Dark Brutal Swing 60P, Electric Nuzzle 20P
  Special coverage: Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Fire Mystical Fire 75S
  Setup: Agility, Calm Mind, Swords Dance | Recovery: Rest
  Pivot: Baton Pass | Utility: Gravity, Healing Wish, Light Screen, Pain Split, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room

**Hawlucha** Fighting/Flying 500 (78/92/75/74/63/118) — Limber / Unburden / Mold Breaker
  STAB: Fighting Focus Punch 150P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Last Resort 140P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Steel Iron Head 80P, Bug Lunge 80P
  Special coverage: Normal Uproar 90S, Grass Grass Knot 60S
  Setup: Agility, Bulk Up, Hone Claws, Swords Dance, Work Up | Recovery: Rest, Roost | Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2)
  Removal: Defog | Pivot: Baton Pass, U-turn | Utility: Detect, Encore, Protect, Substitute, Tailwind, Taunt

**Haxorus** Dragon 540 (76/147/90/60/70/97) — Rivalry / Mold Breaker / Unnerve
  STAB: Dragon Outrage 120P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Bug First Impression 90P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Tera Blast 80S, Grass Grass Knot 60S, Fire Incinerate 60S, Electric Shock Wave 60S
  Setup: Dragon Dance, Harden, Hone Claws, Swords Dance | Recovery: Rest | Priority: First Impression 90P Bug (+2)
  Utility: Protect, Substitute, Taunt

**Heracross-Mega** Bug/Fighting 600 (80/185/115/40/105/75) — Skill Link
  STAB: Bug Megahorn 120P · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Fling 80P, Grass Bullet Seed 25x2-5P, Ghost Shadow Claw 70P
  Special coverage: Normal Tera Blast 80S, Poison Venoshock 65S
  Setup: Bulk Up, Harden, Iron Defense, Swords Dance, Work Up | Recovery: Rest | Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Vacuum Wave 40S Fighting (+1)
  Hazards: Spikes | Utility: Detect, Knock Off, Protect, Substitute
  *(reached by Heracross + Heracronite)*

**Hippowdon** Ground 525 (108/112/118/68/72/47) — Sand Stream / Sand Force
  STAB: Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Fighting Superpower 120P, Rock Stone Edge 100P, Dark Crunch 80P, Fire Fire Fang 65P
  Special coverage: Rock Weather Ball 100S, Water Muddy Water 95S, Normal Hyper Voice 90S
  Setup: Amnesia | Recovery: Rest, Slack Off
  Hazards: Stealth Rock | Utility: Protect, Substitute

**Hydrapple** Grass/Dragon 540 (106/80/110/120/80/44) — Supersweet Syrup / Regenerator / Sticky Hold
  STAB: Grass Leaf Storm 140S · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Fighting Body Press 80P, Dark Sucker Punch 80P, Bug Bug Bite 60P, Steel Heavy Slam 40P
  Special coverage: Water Hydro Pump 120S, Ground Earth Power 90S, Bug Pollen Puff 90S, Normal Uproar 90S
  Setup: Defense Curl, Growth, Nasty Plot, Withdraw | Recovery: Recover, Rest | Priority: Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1)
  Utility: Protect, Reflect, Substitute

**Hydreigon** Dark/Dragon 600 (92/105/90/125/90/98) — Levitate
  STAB: Dark Crunch 80P · Dragon Draco Meteor 140S
  Physical coverage: Rock Head Smash 150P, Fighting Superpower 120P, Flying Acrobatics 110P, Normal Return 102P, Ground Earthquake 100P, Steel Iron Tail 100P
  Special coverage: Poison Belch 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Ground Earth Power 90S, Normal Hyper Voice 90S
  Setup: Dragon Dance, Nasty Plot, Work Up | Recovery: Rest, Roost
  Hazards: Stealth Rock | Removal: Defog | Pivot: U-turn | Utility: Protect, Reflect, Substitute, Tailwind, Taunt

**Iron Boulder** Rock/Psychic 590 (90/120/80/68/108/124) — Quark Drive
  STAB: Rock Stone Edge 100P · Psychic Zen Headbutt 80P
  Physical coverage: Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Ground Earthquake 100P, Electric Wild Charge 90P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S
  Setup: Agility, Iron Defense, Swords Dance | Recovery: Rest | Priority: Quick Attack 40P Normal (+1)
  Utility: Protect, Substitute, Taunt

**Iron Crown** Steel/Psychic 590 (90/72/100/122/108/98) — Quark Drive
  STAB: Steel Steel Beam 140S · Psychic Future Sight 120S
  Physical coverage: Grass Solar Blade 125 (charge)P, Normal Double-Edge 120P, Electric Supercell Slam 100P, Fighting Sacred Sword 90P, Bug X-Scissor 80P, Ground Bulldoze 60P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Flying Air Slash 75S, Electric Volt Switch 70S
  Setup: Agility, Calm Mind, Iron Defense, Swords Dance | Recovery: Rest
  Pivot: Volt Switch | Utility: Gravity, Protect, Substitute

**Iron Leaves** Grass/Psychic 590 (90/130/88/70/108/104) — Quark Drive
  STAB: Grass Solar Blade 125 (charge)P · Psychic Psyblade 80P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Electric Wild Charge 90P, Dark Throat Chop 80P, Steel Smart Strike 70P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Flying Air Slash 75S
  Setup: Agility, Calm Mind, Iron Defense, Swords Dance, Work Up | Recovery: Rest | Priority: Quick Attack 40P Normal (+1)
  Utility: Gravity, Protect, Substitute, Taunt

**Iron Treads** Ground/Steel 570 (90/112/120/72/70/106) — Quark Drive
  STAB: Ground Earthquake 100P · Steel Steel Beam 140S
  Physical coverage: Normal Double-Edge 120P, Bug Megahorn 120P, Rock Stone Edge 100P, Electric Supercell Slam 100P, Fighting Body Press 80P, Ice Ice Spinner 80P
  Special coverage: Electric Thunder 120S, Normal Tera Blast 80S
  Setup: Defense Curl, Iron Defense | Recovery: Rest
  Hazards: Stealth Rock | Removal: Rapid Spin | Pivot: Volt Switch | Utility: Knock Off, Protect, Substitute

**Jirachi** Steel/Psychic 600 (100/100/100/100/100/100) — Serene Grace
  STAB: Steel Doom Desire 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Fighting Dynamic Punch 100P, Fairy Play Rough 90P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Dragon Draco Meteor 140S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Fairy Moonblast 95S, Fighting Aura Sphere 90S, Grass Energy Ball 90S
  Setup: Amnesia, Calm Mind, Cosmic Power, Defense Curl, Iron Defense | Recovery: Rest
  Hazards: Stealth Rock | Pivot: Baton Pass, U-turn | Utility: Encore, Gravity, Healing Wish, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room

**Keldeo** Water/Fighting 580 (91/72/90/129/90/108) — Justified
  STAB: Water Hydro Pump 120S · Fighting Focus Blast 120S
  Physical coverage: Normal Last Resort 140P, Bug Megahorn 120P, Rock Stone Edge 100P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P, Steel Smart Strike 70P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Ice Icy Wind 55S
  Setup: Calm Mind, Swords Dance, Work Up | Recovery: Rest | Priority: Upper Hand 65P Fighting (+3), Aqua Jet 40P Water (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Baton Pass, Flip Turn | Utility: Pain Split, Protect, Reflect, Safeguard, Substitute, Taunt

**Latias-Mega** Dragon/Psychic 700 (80/100/120/140/150/110) — Levitate
  STAB: Dragon Draco Meteor 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Water Liquidation 85P, Dark Sucker Punch 80P, Ghost Shadow Claw 70P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Water Surf 95S, Fighting Aura Sphere 90S, Fairy Alluring Voice 80S
  Setup: Agility, Calm Mind, Dragon Dance, Hone Claws | Recovery: Recover, Rest, Roost | Priority: Sucker Punch 80P Dark (+1)
  Removal: Defog | Pivot: Baton Pass | Utility: Healing Wish, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Tailwind, Trick
  *(reached by Latias + Latiasite)*

**Lilligant-Hisui** Grass/Fighting 480 (70/105/75/50/75/105) — Chlorophyll / Hustle / Leaf Guard
  STAB: Grass Solar Blade 125 (charge)P · Fighting Axe Kick 120P
  Physical coverage: Normal Mega Kick 120P, Flying Acrobatics 110P, Ice Ice Spinner 80P, Poison Poison Jab 80P
  Special coverage: Flying Hurricane 120S, Psychic Dream Eater 100S, Bug Pollen Puff 90S, Fairy Alluring Voice 80S, Normal Tera Blast 80S
  Setup: Growth, Quiver Dance, Swords Dance, Victory Dance | Recovery: Rest | Priority: Grassy Glide 70P Grass (+1), Upper Hand 65P Fighting (+3), Vacuum Wave 40S Fighting (+1)
  Removal: Defog | Utility: Encore, Healing Wish, Leech Seed, Light Screen, Protect, Safeguard, Substitute

**Mamoswine** Ice/Ground 530 (110/130/80/70/60/80) — Oblivious / Snow Cloak / Thick Fat
  STAB: Ice Icicle Crash 85P · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Fighting Superpower 120P, Rock Stone Edge 100P, Dark Throat Chop 80P, Grass Trailblaze 50P
  Special coverage: Normal Tera Blast 80S, Rock Ancient Power 60S
  Setup: Amnesia, Defense Curl | Recovery: Rest | Priority: Ice Shard 40P Ice (+1)
  Hazards: Stealth Rock | Utility: Detect, Haze, Knock Off, Light Screen, Protect, Reflect, Substitute

**Meganium-Mega** Grass/Fairy 625 (80/92/115/143/115/80) — Mega Sol
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fighting Body Press 80P, Psychic Zen Headbutt 80P
  Special coverage: Normal Wring Out 120S, Fire Weather Ball 100S, Rock Ancient Power 60S, Ground Mud-Slap 20S
  Setup: Swords Dance, Work Up | Recovery: Rest | Priority: Grassy Glide 70P Grass (+1)
  Utility: Detect, Encore, Knock Off, Leech Seed, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute
  *(reached by Meganium + Meganiumite)*

**Metagross** Steel/Psychic 600 (80/135/130/95/90/70) — Clear Body / Light Metal
  STAB: Steel Steel Beam 140S · Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Ground Earthquake 100P, Rock Stone Edge 100P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Rock Meteor Beam 120 (charge)S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Grass Grass Knot 60S
  Setup: Agility, Cosmic Power, Defense Curl, Hone Claws, Iron Defense, Rock Polish | Recovery: Rest | Priority: Bullet Punch 40P Steel (+1)
  Hazards: Stealth Rock | Utility: Gravity, Knock Off, Light Screen, Protect, Reflect, Substitute, Trick

**Mew** Psychic 600 (100/100/100/100/100/100) — Synchronize
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Flying Sky Attack 140 (charge)P, Steel Steel Roller 130P, Grass Solar Blade 125 (charge)P, Fire Flare Blitz 120P
  Special coverage: Dragon Draco Meteor 140S, Grass Leaf Storm 140S, Fire Overheat 140S, Steel Steel Beam 140S, Ice Blizzard 120S, Fighting Focus Blast 120S
  Setup: Agility, Amnesia, Barrier, Bulk Up, Calm Mind, Charge, Cosmic Power, Defense Curl, Dragon Dance, Hone Claws, Iron Defense, Nasty Plot, Rock Polish, Swords Dance, Work Up | Recovery: Rest, Roost, Soft-Boiled | Priority: Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1), Upper Hand 65P Fighting (+3), Fake Out 40P Normal (+3)
  Hazards: Spikes, Stealth Rock, Toxic Spikes | Removal: Defog | Pivot: Baton Pass, Flip Turn, Teleport, U-turn, Volt Switch | Utility: Aurora Veil, Detect, Encore, Gravity, Haze, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Safeguard, Substitute, Tailwind, Taunt, Trick, Trick Room

**Mienshao** Fighting 510 (65/125/60/95/60/105) — Inner Focus / Regenerator / Reckless
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Fire Blaze Kick 85P
  Special coverage: Normal Tera Blast 80S, Grass Grass Knot 60S
  Setup: Agility, Bulk Up, Calm Mind, Hone Claws, Meditate, Swords Dance, Work Up | Recovery: Rest | Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3), Vacuum Wave 40S Fighting (+1)
  Pivot: Baton Pass, U-turn | Utility: Detect, Knock Off, Protect, Reflect, Substitute, Taunt

**Moltres** Fire/Flying 580 (90/100/90/125/85/90) — Pressure / Flame Body
  STAB: Fire Overheat 140S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Fighting Rock Smash 40P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Extrasensory 80S, Normal Tera Blast 80S, Ground Scorching Sands 70S, Rock Ancient Power 60S, Ghost Ominous Wind 60S
  Setup: Agility | Recovery: Rest, Roost
  Removal: Defog | Pivot: U-turn | Utility: Detect, Protect, Reflect, Safeguard, Substitute, Tailwind

**Moltres-Galar** Dark/Flying 580 (90/85/90/100/125/90) — Berserk
  STAB: Dark Foul Play 95P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Fire Flare Blitz 120P, Steel Steel Wing 70P, Bug U-turn 70P, Fighting Rock Smash 40P
  Special coverage: Fire Overheat 140S, Grass Solar Beam 120 (charge)S, Normal Hyper Voice 90S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S, Ground Scorching Sands 70S
  Setup: Agility, Nasty Plot | Recovery: Rest, Roost | Priority: Sucker Punch 80P Dark (+1)
  Removal: Defog | Pivot: U-turn | Utility: Detect, Memento, Pain Split, Protect, Reflect, Safeguard, Substitute, Tailwind, Taunt

**Okidogi** Poison/Fighting 555 (88/128/115/58/86/80) — Toxic Chain / Guard Dog
  STAB: Poison Gunk Shot 120P · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Steel Hard Press 100P, Ground Dig 100 (charge)P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Normal Uproar 90S, Dark Snarl 55S
  Setup: Bulk Up | Recovery: Rest | Priority: Upper Hand 65P Fighting (+3)
  Utility: Knock Off, Protect, Substitute, Taunt

**Pecharunt** Poison/Ghost 600 (88/88/160/88/88/88) — Poison Puppeteer
  STAB: Poison Gunk Shot 120P · Ghost Poltergeist 110P
  Physical coverage: Dark Foul Play 95P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S
  Setup: Defense Curl, Nasty Plot, Withdraw | Recovery: Recover, Rest
  Pivot: Parting Shot | Utility: Destiny Bond, Memento, Protect, Substitute

**Polteageist** Ghost 508 (60/65/65/134/114/70) — Weak Armor / Cursed Body
  STAB: Ghost Shadow Ball 80S
  Physical coverage: Normal Self-Destruct 200P, Dark Foul Play 95P
  Special coverage: Psychic Psychic 90S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Giga Drain 75S
  Setup: Calm Mind, Nasty Plot, Shell Smash, Withdraw | Recovery: Rest | Priority: Sucker Punch 80P Dark (+1)
  Pivot: Baton Pass | Utility: Light Screen, Memento, Pain Split, Protect, Reflect, Substitute, Trick, Trick Room

**Porygon-Z** Normal 535 (85/80/70/135/75/90) — Adaptability / Download / Analytic
  STAB: Normal Uproar 90S
  Physical coverage: Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Flying Aerial Ace 60P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S
  Setup: Agility, Barrier, Charge, Defense Curl, Nasty Plot, Sharpen | Recovery: Recover, Rest
  Pivot: Teleport | Utility: Gravity, Magic Coat, Pain Split, Protect, Reflect, Substitute, Trick, Trick Room

**Primarina** Water/Fairy 530 (80/74/74/126/116/60) — Torrent / Liquid Voice
  STAB: Water Hydro Pump 120S · Fairy Misty Explosion 100S
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Steel Iron Tail 100P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Psychic Psychic 90S, Ghost Shadow Ball 80S
  Setup: Amnesia, Calm Mind, Work Up | Recovery: Rest | Priority: Aqua Jet 40P Water (+1)
  Pivot: Flip Turn | Utility: Encore, Haze, Light Screen, Magic Coat, Perish Song, Protect, Reflect, Substitute

**Pyroar-Mega** Fire/Normal 607 (86/88/92/129/86/126) — Fire Mane
  STAB: Fire Overheat 140S · Normal Double-Edge 120P
  Physical coverage: Steel Iron Tail 100P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Dark Crunch 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Dark Dark Pulse 80S, Ground Mud-Slap 20S
  Setup: Work Up | Recovery: Rest
  Utility: Protect, Substitute, Taunt
  *(reached by Pyroar + Pyroarite)*

**Quaquaval** Water/Fighting 530 (85/120/80/85/75/85) — Torrent / Moxie
  STAB: Water Hydro Pump 120S · Fighting Close Combat 120P
  Physical coverage: Normal Last Resort 140P, Flying Brave Bird 120P, Ice Ice Spinner 80P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Flying Hurricane 120S, Normal Tera Blast 80S, Ice Icy Wind 55S, Fairy Disarming Voice 40S
  Setup: Agility, Bulk Up, Swords Dance, Work Up | Recovery: Rest, Roost | Priority: Upper Hand 65P Fighting (+3), Aqua Jet 40P Water (+1)
  Removal: Rapid Spin | Pivot: Baton Pass, Flip Turn, U-turn | Utility: Detect, Encore, Knock Off, Protect, Substitute, Taunt

**Raichu-Mega-Y** Electric 585 (60/100/55/160/80/130) — No Guard
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Grass Grass Knot 60S
  Setup: Agility, Calm Mind, Charge, Defense Curl, Nasty Plot | Recovery: Rest | Priority: Extreme Speed 80P Normal (+2), Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3)
  Pivot: Volt Switch | Utility: Detect, Encore, Knock Off, Light Screen, Protect, Reflect, Safeguard, Substitute
  *(reached by Raichu + Raichunite Y)*

**Regieleki** Electric 580 (80/100/50/100/50/200) — Transistor
  STAB: Electric Thunder 120S
  Physical coverage: Normal Explosion 250P, Flying Acrobatics 110P, Dark Assurance 60P
  Special coverage: Normal Tera Blast 80S, Rock Ancient Power 60S
  Setup: Agility, Charge | Recovery: Rest | Priority: Extreme Speed 80P Normal (+2)
  Removal: Rapid Spin | Pivot: Volt Switch | Utility: Light Screen, Protect, Reflect, Substitute

**Rotom-Wash** Electric/Water 520 (50/65/107/105/107/86) — Levitate
  STAB: Electric Thunder 120S · Water Hydro Pump 120S
  Physical coverage: Ghost Poltergeist 110P, Normal Return 102P, Dark Foul Play 95P
  Special coverage: Psychic Dream Eater 100S, Normal Hyper Voice 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Fairy Disarming Voice 40S
  Setup: Charge, Nasty Plot | Recovery: Rest | Priority: Sucker Punch 80P Dark (+1)
  Removal: Defog | Pivot: Volt Switch | Utility: Light Screen, Pain Split, Protect, Reflect, Substitute, Trick

**Sableye-Mega** Dark/Ghost 480 (50/85/125/85/115/20) — Magic Bounce
  STAB: Dark Foul Play 95P · Ghost Poltergeist 110P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P, Psychic Zen Headbutt 80P
  Special coverage: Psychic Dream Eater 100S, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Rock Power Gem 80S, Normal Tera Blast 80S, Bug Signal Beam 75S
  Setup: Bulk Up, Calm Mind, Hone Claws, Nasty Plot | Recovery: Recover, Rest | Priority: Sucker Punch 80P Dark (+1), Feint 50P Normal (+2), Fake Out 40P Normal (+3), Shadow Sneak 40P Ghost (+1)
  Utility: Detect, Disable, Encore, Gravity, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Substitute, Taunt, Trick
  *(reached by Sableye + Sablenite)*

**Salamence** Dragon/Flying 600 (95/135/80/110/80/100) — Intimidate / Moxie
  STAB: Dragon Draco Meteor 140S · Flying Hurricane 120S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P
  Special coverage: Fire Fire Blast 120S, Water Hydro Pump 120S, Normal Hyper Voice 90S, Ghost Ominous Wind 60S, Ground Mud-Slap 20S
  Setup: Defense Curl, Dragon Dance, Hone Claws, Iron Defense | Recovery: Rest, Roost
  Removal: Defog | Utility: Protect, Substitute, Tailwind

**Scizor** Bug/Steel 500 (70/130/100/55/80/65) — Swarm / Technician / Light Metal
  STAB: Bug Lunge 80P · Steel Hard Press 100P
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Flying Acrobatics 110P, Poison Cross Poison 70P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Poison Venoshock 65S, Ghost Ominous Wind 60S, Fighting Vacuum Wave 40S
  Setup: Agility, Iron Defense, Swords Dance | Recovery: Rest, Roost | Priority: Feint 50P Normal (+2), Bullet Punch 40P Steel (+1), Quick Attack 40P Normal (+1), Vacuum Wave 40S Fighting (+1)
  Removal: Defog | Pivot: Baton Pass, U-turn | Utility: Detect, Knock Off, Light Screen, Protect, Safeguard, Substitute, Tailwind

**Scolipede** Bug/Poison 485 (60/100/89/55/69/112) — Poison Point / Swarm / Speed Boost / Quick Feet
  STAB: Bug Megahorn 120P · Poison Poison Jab 80P
  Physical coverage: Steel Steel Roller 130P, Normal Double-Edge 120P, Fighting Superpower 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Dark Throat Chop 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Ghost Hex 65S, Normal Hidden Power 60S
  Setup: Agility, Defense Curl, Iron Defense, Swords Dance | Recovery: Rest
  Hazards: Spikes, Toxic Spikes | Pivot: Baton Pass | Utility: Protect, Substitute

**Scolipede-Mega** Bug/Poison 585 (60/140/149/75/99/62) — Shell Armor
  STAB: Bug Megahorn 120P · Poison Poison Jab 80P
  Physical coverage: Steel Steel Roller 130P, Normal Double-Edge 120P, Fighting Superpower 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Dark Throat Chop 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Ghost Hex 65S, Normal Hidden Power 60S
  Setup: Agility, Defense Curl, Iron Defense, Swords Dance | Recovery: Rest
  Hazards: Spikes, Toxic Spikes | Pivot: Baton Pass | Utility: Protect, Substitute
  *(reached by Scolipede + Scolipite)*

**Scrafty-Mega** Dark/Fighting 588 (65/130/135/55/135/68) — Intimidate
  STAB: Dark Foul Play 95P · Fighting Focus Punch 150P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P
  Special coverage: Dragon Dragon Pulse 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Grass Grass Knot 60S, Fire Incinerate 60S
  Setup: Amnesia, Bulk Up, Dragon Dance, Iron Defense, Swords Dance, Work Up | Recovery: Rest | Priority: Upper Hand 65P Fighting (+3), Fake Out 40P Normal (+3)
  Utility: Detect, Encore, Knock Off, Protect, Substitute, Taunt
  *(reached by Scrafty + Scraftinite)*

**Serperior** Grass 528 (75/75/95/75/95/113) — Overgrow / Contrary
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Water Aqua Tail 90P, Dark Knock Off 65P, Flying Aerial Ace 60P
  Special coverage: Normal Wring Out 120S, Dragon Dragon Pulse 90S, Psychic Mirror Coat fixedS
  Setup: Calm Mind, Coil, Growth, Swords Dance, Work Up | Recovery: Rest | Priority: Grassy Glide 70P Grass (+1)
  Removal: Defog | Utility: Knock Off, Leech Seed, Light Screen, Protect, Reflect, Safeguard, Substitute, Taunt

**Sharpedo-Mega** Water/Dark 560 (70/140/70/110/65/105) — Strong Jaw
  STAB: Water Hydro Pump 120S · Dark Crunch 80P
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Ground Earthquake 100P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Rock Ancient Power 60S, Ground Mud-Slap 20S
  Setup: Agility | Recovery: Rest | Priority: Feint 50P Normal (+2), Aqua Jet 40P Water (+1)
  Pivot: Flip Turn | Utility: Destiny Bond, Protect, Substitute, Taunt
  *(reached by Sharpedo + Sharpedonite)*

**Skarmory** Steel/Flying 465 (65/80/140/40/70/70) — Keen Eye / Sturdy / Weak Armor
  STAB: Steel Iron Head 80P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Fighting Body Press 80P, Ground Drill Run 80P, Bug X-Scissor 80P, Rock Rock Slide 75P, Dark Night Slash 70P
  Special coverage: Dark Dark Pulse 80S, Normal Tera Blast 80S, Ghost Ominous Wind 60S, Ice Icy Wind 55S, Dragon Twister 40S, Ground Mud-Slap 20S
  Setup: Agility, Autotomize, Iron Defense, Swords Dance | Recovery: Rest, Roost | Priority: Feint 50P Normal (+2)
  Hazards: Spikes, Stealth Rock | Removal: Defog | Utility: Detect, Protect, Substitute, Tailwind, Taunt

**Skarmory-Mega** Steel/Flying 565 (65/140/110/40/100/110) — Stalwart
  STAB: Steel Iron Head 80P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Fighting Body Press 80P, Ground Drill Run 80P, Bug X-Scissor 80P, Rock Rock Slide 75P, Dark Night Slash 70P
  Special coverage: Dark Dark Pulse 80S, Normal Tera Blast 80S, Ghost Ominous Wind 60S, Ice Icy Wind 55S, Dragon Twister 40S, Ground Mud-Slap 20S
  Setup: Agility, Autotomize, Iron Defense, Swords Dance | Recovery: Rest, Roost | Priority: Feint 50P Normal (+2)
  Hazards: Spikes, Stealth Rock | Removal: Defog | Utility: Detect, Protect, Substitute, Tailwind, Taunt
  *(reached by Skarmory + Skarmorite)*

**Slowbro** Water/Psychic 490 (95/75/110/100/80/30) — Oblivious / Own Tempo / Regenerator
  STAB: Water Hydro Pump 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Ice Ice Punch 75P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Zap Cannon 120S, Ghost Shadow Ball 80S
  Setup: Amnesia, Calm Mind, Iron Defense, Nasty Plot, Withdraw | Recovery: Rest, Slack Off
  Pivot: Teleport | Utility: Disable, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room

**Slowbro-Mega** Water/Psychic 590 (95/75/180/130/80/30) — Shell Armor
  STAB: Water Hydro Pump 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Ice Ice Punch 75P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Zap Cannon 120S, Ghost Shadow Ball 80S
  Setup: Amnesia, Calm Mind, Iron Defense, Nasty Plot, Withdraw | Recovery: Rest, Slack Off
  Pivot: Teleport | Utility: Disable, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  *(reached by Slowbro + Slowbronite)*

**Slowking** Water/Psychic 490 (95/75/80/100/110/30) — Oblivious / Own Tempo / Regenerator
  STAB: Water Hydro Pump 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Fire Fire Punch 75P
  Special coverage: Normal Trump Card 200S, Poison Belch 120S, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Zap Cannon 120S
  Setup: Amnesia, Calm Mind, Iron Defense, Nasty Plot | Recovery: Rest, Slack Off
  Pivot: Chilly Reception, Teleport | Utility: Disable, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room

**Staraptor-Mega** Fighting/Flying 585 (85/140/100/60/90/110) — Contrary
  STAB: Fighting Close Combat 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Thief 60P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Normal Uproar 90S, Ghost Ominous Wind 60S, Bug Struggle Bug 50S, Dragon Twister 40S, Ground Mud-Slap 20S
  Setup: Agility, Work Up | Recovery: Rest, Roost | Priority: Quick Attack 40P Normal (+1)
  Removal: Defog | Pivot: U-turn | Utility: Detect, Protect, Substitute, Tailwind
  *(reached by Staraptor + Staraptite)*

**Starmie-Mega** Water/Psychic 620 (60/100/105/130/105/120) — Huge Power
  STAB: Water Waterfall 80P · Psychic Psycho Cut 70P
  Physical coverage: Normal Skull Bash 130P, Ice Avalanche 60P, Rock Rollout 30P, Steel Gyro Ball 14P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Normal Tri Attack 80S
  Setup: Agility, Cosmic Power, Harden | Recovery: Recover, Rest
  Removal: Rapid Spin | Pivot: Flip Turn, Teleport | Utility: Gravity, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Substitute, Trick, Trick Room
  *(reached by Starmie + Starminite)*

**Swampert** Water/Ground 535 (100/110/90/85/90/60) — Torrent / Damp
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Hard Press 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Uproar 90S, Rock Ancient Power 60S, Psychic Mirror Coat fixedS
  Setup: Amnesia, Barrier, Bulk Up, Defense Curl, Work Up | Recovery: Rest
  Hazards: Stealth Rock | Pivot: Flip Turn | Utility: Knock Off, Protect, Substitute

**Swampert-Mega** Water/Ground 635 (100/150/110/95/110/70) — Swift Swim
  STAB: Water Aqua Tail 90P · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Hard Press 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Uproar 90S, Rock Ancient Power 60S, Psychic Mirror Coat fixedS
  Setup: Amnesia, Barrier, Bulk Up, Defense Curl, Work Up | Recovery: Rest
  Hazards: Stealth Rock | Pivot: Flip Turn | Utility: Knock Off, Protect, Substitute
  *(reached by Swampert + Swampertite)*

**Tapu Fini** Water/Fairy 570 (70/75/115/95/130/85) — Misty Surge / Telepathy
  STAB: Water Hydro Pump 120S · Fairy Moonblast 95S
  Physical coverage: Normal Return 102P, Ice Ice Punch 75P, Steel Smart Strike 70P, Dark Knock Off 65P
  Special coverage: Ice Blizzard 120S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Normal Hidden Power 60S, Psychic Stored Power 20S
  Setup: Calm Mind, Iron Defense, Withdraw | Recovery: Rest
  Removal: Defog | Utility: Gravity, Haze, Knock Off, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Taunt, Trick

**Terrakion** Rock/Fighting 580 (91/129/90/72/90/108) — Justified
  STAB: Rock Stone Edge 100P · Fighting Close Combat 120P
  Physical coverage: Normal Double-Edge 120P, Bug Megahorn 120P, Ground Earthquake 100P, Steel Iron Head 80P, Poison Poison Jab 80P, Psychic Zen Headbutt 80P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S, Flying Air Slash 75S
  Setup: Calm Mind, Rock Polish, Swords Dance, Work Up | Recovery: Rest | Priority: Upper Hand 65P Fighting (+3), Quick Attack 40P Normal (+1)
  Hazards: Stealth Rock | Utility: Protect, Reflect, Safeguard, Substitute, Taunt

**Thundurus** Electric/Flying 580 (79/115/70/125/80/111) — Prankster / Defiant
  STAB: Electric Thunder 120S · Flying Acrobatics 110P
  Physical coverage: Fighting Superpower 120P, Normal Thrash 120P, Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Bug U-turn 70P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Wave 95S, Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S
  Setup: Agility, Bulk Up, Charge, Nasty Plot | Recovery: Rest
  Removal: Defog | Pivot: U-turn, Volt Switch | Utility: Knock Off, Protect, Substitute, Taunt

**Thundurus-Therian** Electric/Flying 580 (79/105/70/145/80/101) — Volt Absorb
  STAB: Electric Thunder 120S · Flying Acrobatics 110P
  Physical coverage: Fighting Superpower 120P, Normal Thrash 120P, Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Bug U-turn 70P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Wave 95S, Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S
  Setup: Agility, Bulk Up, Charge, Nasty Plot | Recovery: Rest
  Removal: Defog | Pivot: U-turn, Volt Switch | Utility: Knock Off, Protect, Substitute, Taunt

**Tyranitar** Rock/Dark 600 (100/134/110/95/100/61) — Sand Stream / Unnerve
  STAB: Rock Stone Edge 100P · Dark Foul Play 95P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Hard Press 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S
  Setup: Dragon Dance, Hone Claws, Iron Defense, Rock Polish | Recovery: Rest
  Hazards: Stealth Rock | Utility: Detect, Knock Off, Protect, Substitute, Taunt

**Ursaluna** Ground/Normal 550 (130/140/105/45/80/50) — Guts / Bulletproof / Unnerve
  STAB: Ground Headlong Rush 120P · Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Electric Supercell Slam 100P, Fairy Play Rough 90P
  Special coverage: Fighting Focus Blast 120S, Electric Zap Cannon 120S
  Setup: Bulk Up, Defense Curl, Hone Claws, Swords Dance, Work Up | Recovery: Rest
  Utility: Protect, Substitute, Taunt

**Venusaur-Mega** Grass/Poison 625 (80/100/123/122/120/80) — Thick Fat
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Ground Earthquake 100P, Dark Knock Off 65P, Bug Fury Cutter 40P, Fighting Rock Smash 40P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S
  Setup: Amnesia, Defense Curl, Growth, Swords Dance, Work Up | Recovery: Rest | Priority: Grassy Glide 70P Grass (+1)
  Utility: Knock Off, Leech Seed, Light Screen, Protect, Reflect, Safeguard, Substitute
  *(reached by Venusaur + Venusaurite)*

**Victini** Psychic/Fire 600 (100/100/100/100/100/100) — Victory Star
  STAB: Psychic Future Sight 120S · Fire V-create 180P
  Physical coverage: Normal Last Resort 140P, Electric Bolt Strike 130P, Flying Bounce 85 (charge)P, Fighting Brick Break 75P, Bug U-turn 70P, Dark Fling 30P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S
  Setup: Work Up | Recovery: Rest | Priority: Quick Attack 40P Normal (+1)
  Pivot: Baton Pass, U-turn | Utility: Encore, Light Screen, Magic Coat, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room

**Weavile** Dark/Ice 510 (70/120/65/45/85/125) — Pressure / Pickpocket
  STAB: Dark Foul Play 95P · Ice Icicle Crash 85P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Psychic Dream Eater 100S, Water Surf 95S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Mud-Slap 20S
  Setup: Agility, Calm Mind, Defense Curl, Hone Claws, Nasty Plot, Swords Dance | Recovery: Rest | Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3), Ice Shard 40P Ice (+1)
  Pivot: Baton Pass | Utility: Detect, Knock Off, Protect, Reflect, Substitute, Taunt

**Zapdos-Galar** Fighting/Flying 580 (90/125/90/85/90/100) — Defiant
  STAB: Fighting Close Combat 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Electric Supercell Slam 100P, Fire Blaze Kick 85P, Dark Throat Chop 80P, Ground Stomping Tantrum 75P, Steel Steel Wing 70P
  Special coverage: Electric Thunder 120S, Fire Heat Wave 100S, Psychic Extrasensory 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Rock Ancient Power 60S
  Setup: Agility, Bulk Up, Charge | Recovery: Rest, Roost
  Removal: Defog | Pivot: Baton Pass, U-turn, Volt Switch | Utility: Detect, Knock Off, Light Screen, Protect, Reflect, Substitute, Tailwind, Taunt

**Zeraora** Electric 600 (88/112/75/102/80/143) — Volt Absorb
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Dragon Outrage 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Fairy Play Rough 90P
  Special coverage: Fighting Focus Blast 120S, Grass Grass Knot 60S, Normal Hidden Power 60S, Dark Snarl 55S
  Setup: Agility, Bulk Up, Calm Mind, Charge, Hone Claws, Work Up | Recovery: Rest | Priority: Fake Out 40P Normal (+3), Quick Attack 40P Normal (+1)
  Pivot: Volt Switch | Utility: Knock Off, Protect, Substitute, Taunt

**Zoroark-Hisui** Normal/Ghost 510 (55/100/60/125/60/110) — Illusion
  STAB: Normal Mega Kick 120P · Ghost Poltergeist 110P
  Physical coverage: Fighting Focus Punch 150P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Flying Bounce 85 (charge)P, Bug Skitter Smack 70P
  Special coverage: Fighting Focus Blast 120S, Fire Flamethrower 95S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Dark Night Daze 85S, Grass Grass Knot 60S
  Setup: Agility, Calm Mind, Hone Claws, Nasty Plot, Swords Dance | Recovery: Rest | Priority: Sucker Punch 80P Dark (+1), Shadow Sneak 40P Ghost (+1)
  Pivot: U-turn | Utility: Detect, Encore, Knock Off, Memento, Pain Split, Protect, Substitute, Taunt, Trick
<!-- END GENERATED UU POOLS -->

---

## 5. The bar above — the current OU roster

A UU entry is "too strong" if it belongs in **this** company. Stats and abilities
only; ask for a movepool profile on any entry you want to compare properly.

<!-- BEGIN GENERATED OU BAR -->
### OU — 93 entries

| # | Pokémon | Types | BST | HP/Atk/Def/SpA/SpD/Spe | Abilities | Reached by |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Alakazam-Mega | Psychic | 600 | 55/50/65/175/105/150 | Trace | Alakazam + Alakazite |
| 2 | Alomomola | Water | 470 | 165/75/80/40/45/65 | Healer, Hydration, Regenerator | — |
| 3 | Annihilape | Fighting / Ghost | 535 | 110/115/80/50/90/90 | Vital Spirit, Inner Focus, Defiant | — |
| 4 | Barbaracle-Mega | Rock / Fighting | 600 | 72/140/130/64/106/88 | Tough Claws | Barbaracle + Barbaracite |
| 5 | Baxcalibur | Dragon / Ice | 600 | 115/145/92/75/86/87 | Thermal Exchange, Ice Body | — |
| 6 | Blastoise-Mega | Water | 630 | 79/103/120/135/115/78 | Mega Launcher | Blastoise + Blastoisinite |
| 7 | Blaziken | Fire / Fighting | 530 | 80/120/70/110/70/80 | Blaze, Speed Boost | — |
| 8 | Ceruledge | Fire / Ghost | 525 | 75/125/80/60/100/85 | Flash Fire, Weak Armor | — |
| 9 | Charizard-Mega-X | Fire / Dragon | 634 | 78/130/111/130/85/100 | Tough Claws | Charizard + Charizardite X |
| 10 | Charizard-Mega-Y | Fire / Flying | 634 | 78/104/78/159/115/100 | Drought | Charizard + Charizardite Y |
| 11 | Chesnaught-Mega | Grass / Fighting | 630 | 88/137/172/74/115/44 | Bulletproof | Chesnaught + Chesnaughtite |
| 12 | Cinderace | Fire | 530 | 80/116/75/65/75/119 | Blaze, Libero | — |
| 13 | Clefable-Mega | Fairy / Flying | 583 | 95/80/93/135/110/70 | Magic Bounce | Clefable + Clefablite |
| 14 | Clodsire | Poison / Ground | 430 | 130/75/60/45/100/20 | Poison Point, Water Absorb, Unaware | — |
| 15 | Darkrai | Dark | 600 | 70/90/90/135/90/125 | Bad Dreams | — |
| 16 | Deoxys | Psychic | 600 | 50/150/50/150/50/150 | Pressure | — |
| 17 | Deoxys-Speed | Psychic | 600 | 50/95/90/95/90/180 | Pressure | — |
| 18 | Dialga | Steel / Dragon | 680 | 100/120/120/150/100/90 | Pressure, Telepathy | — |
| 19 | Diancie-Mega | Rock / Fairy | 700 | 50/160/110/160/110/110 | Magic Bounce | Diancie + Diancite |
| 20 | Dondozo | Water | 530 | 150/100/115/65/65/35 | Unaware, Oblivious, Water Veil | — |
| 21 | Dracovish | Water / Dragon | 505 | 90/90/100/70/80/75 | Water Absorb, Strong Jaw, Sand Rush | — |
| 22 | Dragapult | Dragon / Ghost | 600 | 88/120/75/100/75/142 | Clear Body, Infiltrator, Cursed Body | — |
| 23 | Dragonite | Dragon / Flying | 600 | 91/134/95/100/100/80 | Inner Focus, Multiscale | — |
| 24 | Excadrill-Mega | Ground / Steel | 608 | 110/165/100/65/65/103 | Piercing Drill | Excadrill + Excadrite |
| 25 | Feraligatr-Mega | Water / Dragon | 630 | 85/160/125/89/93/78 | Dragonize | Feraligatr + Feraligite |
| 26 | Ferrothorn | Grass / Steel | 489 | 74/94/131/54/116/20 | Iron Barbs, Anticipation | — |
| 27 | Floette-Mega | Fairy | 651 | 74/85/87/155/148/102 | Fairy Aura | Floette-Eternal + Floettite |
| 28 | Gallade-Mega | Psychic / Fighting | 618 | 68/165/95/65/115/110 | Inner Focus | Gallade + Galladite |
| 29 | Garchomp | Dragon / Ground | 600 | 108/130/95/80/85/102 | Sand Veil, Rough Skin | — |
| 30 | Garchomp-Mega | Dragon / Ground | 700 | 108/170/115/120/95/92 | Sand Force | Garchomp + Garchompite |
| 31 | Gholdengo | Steel / Ghost | 550 | 87/60/95/133/91/84 | Good as Gold | — |
| 32 | Glimmora-Mega | Rock / Poison | 625 | 83/90/105/150/96/101 | Adaptability | Glimmora + Glimmoranite |
| 33 | Gliscor | Ground / Flying | 510 | 75/95/125/45/75/95 | Hyper Cutter, Sand Veil, Poison Heal | — |
| 34 | Golisopod-Mega | Bug / Steel | 630 | 75/150/175/70/120/40 | Emergency Exit | Golisopod + Golisopite |
| 35 | Great Tusk | Ground / Fighting | 570 | 115/131/131/53/53/87 | Protosynthesis | — |
| 36 | Greninja | Water / Dark | 530 | 72/95/67/103/71/122 | Torrent, Protean, Battle Bond | — |
| 37 | Greninja-Ash | Water / Dark | 640 | 72/145/67/153/71/132 | Battle Bond | Greninja + battlebond |
| 38 | Greninja-Mega | Water / Dark | 630 | 72/125/77/133/81/142 | Protean | Greninja + Greninjite |
| 39 | Gyarados-Mega | Water / Dark | 640 | 95/155/109/70/130/81 | Mold Breaker | Gyarados + Gyaradosite |
| 40 | Hawlucha-Mega | Fighting / Flying | 600 | 78/137/100/74/93/118 | No Guard | Hawlucha + Hawluchanite |
| 41 | Heatran | Fire / Steel | 600 | 91/90/106/130/106/77 | Flash Fire, Flame Body | — |
| 42 | Hoopa-Unbound | Psychic / Dark | 680 | 80/160/60/170/130/80 | Magician | — |
| 43 | Iron Hands | Fighting / Electric | 570 | 154/140/108/50/68/50 | Quark Drive | — |
| 44 | Iron Moth | Fire / Poison | 570 | 80/70/60/140/110/110 | Quark Drive | — |
| 45 | Iron Valiant | Fairy / Fighting | 590 | 74/130/90/120/60/116 | Quark Drive | — |
| 46 | Kartana | Grass / Steel | 570 | 59/181/131/59/31/109 | Beast Boost | — |
| 47 | Kingambit | Dark / Steel | 550 | 100/135/120/60/85/50 | Defiant, Supreme Overlord, Pressure | — |
| 48 | Kommo-o | Dragon / Fighting | 600 | 75/110/125/100/105/85 | Bulletproof, Soundproof, Overcoat | — |
| 49 | Kyurem | Dragon / Ice | 660 | 125/130/90/130/90/95 | Pressure | — |
| 50 | Kyurem-Black | Dragon / Ice | 700 | 125/170/100/120/90/95 | Teravolt | — |
| 51 | Landorus-Therian | Ground / Flying | 600 | 89/145/90/105/80/91 | Intimidate | — |
| 52 | Latios | Dragon / Psychic | 600 | 80/90/80/130/110/110 | Levitate | — |
| 53 | Latios-Mega | Dragon / Psychic | 700 | 80/130/100/160/120/110 | Levitate | Latios + Latiosite |
| 54 | Lopunny-Mega | Normal / Fighting | 580 | 65/136/94/54/96/135 | Scrappy | Lopunny + Lopunnite |
| 55 | Lucario-Mega | Fighting / Steel | 625 | 70/145/88/140/70/112 | Adaptability | Lucario + Lucarionite |
| 56 | Lugia | Psychic / Flying | 680 | 106/90/130/90/154/110 | Pressure, Multiscale | — |
| 57 | Lunala | Psychic / Ghost | 680 | 137/113/89/137/107/97 | Shadow Shield | — |
| 58 | Manaphy | Water | 600 | 100/100/100/100/100/100 | Hydration | — |
| 59 | Marshadow | Fighting / Ghost | 600 | 90/125/80/90/90/125 | Technician | — |
| 60 | Mawile-Mega | Steel / Fairy | 480 | 50/105/125/55/95/50 | Huge Power | Mawile + Mawilite |
| 61 | Medicham-Mega | Fighting / Psychic | 510 | 60/100/85/80/85/100 | Pure Power | Medicham + Medichamite |
| 62 | Melmetal | Steel | 600 | 135/143/143/80/65/34 | Iron Fist | — |
| 63 | Meowscarada | Grass / Dark | 530 | 76/110/70/81/70/123 | Overgrow, Protean | — |
| 64 | Metagross-Mega | Steel / Psychic | 700 | 80/145/150/105/110/110 | Tough Claws | Metagross + Metagrossite |
| 65 | Naganadel | Poison / Dragon | 540 | 73/73/73/127/73/121 | Beast Boost | — |
| 66 | Necrozma-Dawn-Wings | Psychic / Ghost | 680 | 97/113/109/157/127/77 | Prism Armor | — |
| 67 | Ogerpon-Cornerstone | Grass / Rock | 550 | 80/120/84/60/96/110 | Sturdy | Ogerpon + Cornerstone Mask |
| 68 | Ogerpon-Hearthflame | Grass / Fire | 550 | 80/120/84/60/96/110 | Mold Breaker | Ogerpon + Hearthflame Mask |
| 69 | Ogerpon-Wellspring | Grass / Water | 550 | 80/120/84/60/96/110 | Water Absorb | Ogerpon + Wellspring Mask |
| 70 | Pheromosa | Bug / Fighting | 570 | 71/137/37/137/37/151 | Beast Boost | — |
| 71 | Pinsir-Mega | Bug / Flying | 600 | 65/155/120/65/90/105 | Aerilate | Pinsir + Pinsirite |
| 72 | Raging Bolt | Electric / Dragon | 590 | 125/73/91/137/89/75 | Protosynthesis | — |
| 73 | Rillaboom | Grass | 530 | 100/125/90/60/70/85 | Overgrow, Grassy Surge | — |
| 74 | Roaring Moon | Dragon / Dark | 590 | 105/139/71/55/101/119 | Protosynthesis | — |
| 75 | Samurott-Hisui | Water / Dark | 528 | 90/108/80/100/65/85 | Torrent, Sharpness | — |
| 76 | Scizor-Mega | Bug / Steel | 600 | 70/150/140/65/100/75 | Technician | Scizor + Scizorite |
| 77 | Slowking-Galar | Poison / Psychic | 490 | 95/65/80/110/110/30 | Curious Medicine, Own Tempo, Regenerator | — |
| 78 | Solgaleo | Psychic / Steel | 680 | 137/137/107/113/89/97 | Full Metal Body | — |
| 79 | Spectrier | Ghost | 580 | 100/65/60/145/80/130 | Grim Neigh | — |
| 80 | Tapu Koko | Electric / Fairy | 570 | 70/115/85/95/75/130 | Electric Surge, Telepathy | — |
| 81 | Tapu Lele | Psychic / Fairy | 570 | 70/85/75/130/115/95 | Psychic Surge, Telepathy | — |
| 82 | Terapagos | Normal | 450 | 90/65/85/65/85/60 | Tera Shift | — |
| 83 | Terapagos-Terastal | Normal | 600 | 95/95/110/105/110/85 | Tera Shell | — |
| 84 | Ting-Lu | Dark / Ground | 580 | 165/110/130/50/80/45 | Vessel of Ruin | — |
| 85 | Tornadus-Therian | Flying | 580 | 79/100/80/110/90/121 | Regenerator | — |
| 86 | Toxapex | Poison / Water | 495 | 50/63/152/53/142/35 | Merciless, Limber, Regenerator | — |
| 87 | Tyranitar-Mega | Rock / Dark | 700 | 100/164/150/95/120/71 | Sand Stream | Tyranitar + Tyranitarite |
| 88 | Urshifu-Rapid-Strike | Fighting / Water | 550 | 100/130/100/63/60/97 | Unseen Fist | — |
| 89 | Volcarona | Bug / Fire | 550 | 85/60/65/135/105/100 | Flame Body, Swarm | — |
| 90 | Xurkitree | Electric | 570 | 83/89/71/173/71/83 | Beast Boost | — |
| 91 | Zamazenta | Fighting | 670 | 92/130/115/80/115/138 | Dauntless Shield | — |
| 92 | Zapdos | Electric / Flying | 580 | 90/90/85/125/90/100 | Pressure, Static, Lightning Rod | — |
| 93 | Zeraora-Mega | Electric | 700 | 88/157/75/147/80/153 | Volt Absorb | Zeraora + Zeraorite |
<!-- END GENERATED OU BAR -->

---

## 6. The bar below — the current RU roster

A UU entry is "too weak" if RU's better entries already do its job. This rung is
large because it is where everything Smogon's National Dex does not rank lands
before being split downward.

<!-- BEGIN GENERATED RU BAR -->
### RU — 131 entries

| # | Pokémon | Types | BST | HP/Atk/Def/SpA/SpD/Spe | Abilities | Reached by |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Absol-Mega | Dark | 565 | 65/150/60/115/60/115 | Magic Bounce | Absol + Absolite |
| 2 | Absol-Mega-Z | Dark / Ghost | 565 | 65/154/60/75/60/151 | Sharpness | Absol + Absolite Z |
| 3 | Aggron-Mega | Steel | 630 | 70/140/230/60/80/50 | Filter | Aggron + Aggronite |
| 4 | Ampharos-Mega | Electric / Dragon | 610 | 90/95/105/165/110/45 | Mold Breaker | Ampharos + Ampharosite |
| 5 | Arcanine-Hisui | Fire / Rock | 555 | 95/115/80/95/80/90 | Intimidate, Flash Fire, Rock Head | — |
| 6 | Arctozolt | Electric / Ice | 505 | 90/100/90/90/80/55 | Volt Absorb, Static, Slush Rush | — |
| 7 | Armarouge | Fire / Psychic | 525 | 85/60/100/125/80/75 | Flash Fire, Weak Armor | — |
| 8 | Azelf | Psychic | 580 | 75/125/70/125/70/115 | Levitate | — |
| 9 | Banette-Mega | Ghost | 555 | 64/165/75/93/83/75 | Prankster | Banette + Banettite |
| 10 | Barbaracle | Rock / Water | 500 | 72/105/115/54/86/68 | Tough Claws, Sniper, Pickpocket | — |
| 11 | Barraskewda | Water | 490 | 61/123/60/60/50/136 | Swift Swim, Propeller Tail | — |
| 12 | Beedrill-Mega | Bug / Poison | 495 | 65/150/40/15/80/145 | Adaptability | Beedrill + Beedrillite |
| 13 | Bewear | Normal / Fighting | 500 | 120/125/80/55/60/60 | Fluffy, Klutz, Unnerve | — |
| 14 | Blastoise | Water | 530 | 79/83/100/85/105/78 | Torrent, Rain Dish | — |
| 15 | Breloom | Grass / Fighting | 460 | 60/130/80/60/60/70 | Effect Spore, Poison Heal, Technician | — |
| 16 | Camerupt-Mega | Fire / Ground | 560 | 70/120/100/145/105/20 | Sheer Force | Camerupt + Cameruptite |
| 17 | Celebi | Psychic / Grass | 600 | 100/100/100/100/100/100 | Natural Cure | — |
| 18 | Cetitan | Ice | 521 | 170/113/65/45/55/73 | Thick Fat, Slush Rush, Sheer Force | — |
| 19 | Chesnaught | Grass / Fighting | 530 | 88/107/122/74/75/64 | Overgrow, Bulletproof | — |
| 20 | Chimecho-Mega | Psychic / Steel | 555 | 75/50/110/135/120/65 | Levitate | Chimecho + Chimechite |
| 21 | Cloyster | Water / Ice | 525 | 50/95/180/85/45/70 | Shell Armor, Skill Link, Overcoat | — |
| 22 | Cobalion | Steel / Fighting | 580 | 91/90/129/90/72/108 | Justified | — |
| 23 | Comfey | Fairy | 485 | 51/52/90/82/110/100 | Flower Veil, Triage, Natural Cure | — |
| 24 | Copperajah | Steel | 500 | 122/130/69/80/69/30 | Sheer Force, Heavy Metal | — |
| 25 | Crabominable-Mega | Fighting / Ice | 578 | 97/157/122/62/107/33 | Iron Fist | Crabominable + Crabominite |
| 26 | Crawdaunt | Water / Dark | 468 | 63/120/85/90/55/55 | Hyper Cutter, Shell Armor, Adaptability | — |
| 27 | Cresselia | Psychic | 600 | 120/70/120/75/130/85 | Levitate | — |
| 28 | Crobat | Poison / Flying | 535 | 85/90/80/70/80/130 | Inner Focus, Infiltrator | — |
| 29 | Cyclizar | Dragon / Normal | 501 | 70/95/65/85/65/121 | Shed Skin, Regenerator | — |
| 30 | Darmanitan | Fire | 480 | 105/140/55/30/55/95 | Sheer Force, Zen Mode | — |
| 31 | Darmanitan-Zen | Fire / Psychic | 540 | 105/30/105/140/105/55 | Zen Mode | Darmanitan + zenmode |
| 32 | Deoxys-Defense | Psychic | 600 | 50/70/160/70/160/90 | Pressure | — |
| 33 | Diancie | Rock / Fairy | 600 | 50/100/150/100/150/50 | Clear Body | — |
| 34 | Diggersby | Normal / Ground | 423 | 85/56/77/50/77/78 | Pickup, Cheek Pouch, Huge Power | — |
| 35 | Donphan | Ground | 500 | 90/120/120/60/60/50 | Sturdy, Sand Veil | — |
| 36 | Dracozolt | Electric / Dragon | 505 | 90/100/90/80/70/75 | Volt Absorb, Hustle, Sand Rush | — |
| 37 | Duraludon | Steel / Dragon | 535 | 70/95/115/120/50/85 | Light Metal, Heavy Metal, Stalwart | — |
| 38 | Durant | Bug / Steel | 484 | 58/109/112/48/48/109 | Swarm, Hustle, Truant | — |
| 39 | Eelektross-Mega | Electric | 615 | 85/145/80/135/90/80 | Eelevate | Eelektross + Eelektrossite |
| 40 | Empoleon | Water / Steel | 530 | 84/86/88/111/101/60 | Torrent, Competitive, Defiant | — |
| 41 | Enamorus-Therian | Fairy / Flying | 580 | 74/115/110/135/100/46 | Overcoat | — |
| 42 | Entei | Fire | 580 | 115/115/85/90/75/100 | Pressure, Inner Focus, Flash Fire | — |
| 43 | Falinks-Mega | Fighting | 570 | 65/135/135/70/65/100 | Defiant | Falinks + Falinksite |
| 44 | Feraligatr | Water | 530 | 85/105/100/79/83/78 | Torrent, Sheer Force | — |
| 45 | Fezandipiti | Poison / Fairy | 555 | 88/91/82/70/125/99 | Toxic Chain, Technician | — |
| 46 | Forretress | Bug / Steel | 465 | 75/90/140/60/60/40 | Sturdy, Overcoat | — |
| 47 | Froslass-Mega | Ice / Ghost | 580 | 70/80/70/140/100/120 | Snow Warning | Froslass + Froslassite |
| 48 | Gallade | Psychic / Fighting | 518 | 68/125/65/65/115/80 | Steadfast, Sharpness, Justified | — |
| 49 | Gardevoir | Psychic / Fairy | 518 | 68/65/65/125/115/80 | Synchronize, Trace, Telepathy | — |
| 50 | Garganacl | Rock | 500 | 100/100/130/45/90/35 | Purifying Salt, Sturdy, Clear Body | — |
| 51 | Gastrodon | Water / Ground | 475 | 111/83/68/92/82/39 | Sticky Hold, Storm Drain, Sand Force | — |
| 52 | Golisopod | Bug / Water | 530 | 75/125/140/60/90/40 | Emergency Exit | — |
| 53 | Golurk-Mega | Ground / Ghost | 583 | 89/159/105/70/105/55 | Unseen Fist | Golurk + Golurkite |
| 54 | Houndoom-Mega | Dark / Fire | 600 | 75/90/90/140/90/115 | Solar Power | Houndoom + Houndoominite |
| 55 | Infernape | Fire / Fighting | 534 | 76/104/71/104/71/108 | Blaze, Iron Fist | — |
| 56 | Iron Jugulis | Dark / Flying | 570 | 94/80/86/122/80/108 | Quark Drive | — |
| 57 | Iron Thorns | Rock / Electric | 570 | 100/134/110/70/84/72 | Quark Drive | — |
| 58 | Kleavor | Bug / Rock | 500 | 70/135/95/45/70/85 | Swarm, Sheer Force, Sharpness | — |
| 59 | Krookodile | Ground / Dark | 519 | 95/117/80/65/70/92 | Intimidate, Moxie, Anger Point | — |
| 60 | Latias | Dragon / Psychic | 600 | 80/80/90/110/130/110 | Levitate | — |
| 61 | Linoone | Normal | 420 | 78/70/61/50/61/100 | Pickup, Gluttony, Quick Feet | — |
| 62 | Lokix | Bug / Dark | 450 | 71/102/78/52/55/92 | Swarm, Tinted Lens | — |
| 63 | Lucario | Fighting / Steel | 525 | 70/110/70/115/70/90 | Steadfast, Inner Focus, Justified | — |
| 64 | Lycanroc-Dusk | Rock | 487 | 75/117/65/55/65/110 | Tough Claws | — |
| 65 | Machamp | Fighting | 505 | 90/130/80/65/85/55 | Guts, No Guard, Steadfast | — |
| 66 | Magnezone | Electric / Steel | 535 | 70/70/115/130/90/60 | Magnet Pull, Sturdy, Analytic | — |
| 67 | Malamar-Mega | Dark / Psychic | 582 | 86/102/88/98/120/88 | Contrary | Malamar + Malamarite |
| 68 | Mandibuzz | Dark / Flying | 510 | 110/65/105/55/95/80 | Big Pecks, Overcoat, Weak Armor | — |
| 69 | Manectric-Mega | Electric | 575 | 70/75/80/135/80/135 | Intimidate | Manectric + Manectite |
| 70 | Marowak-Alola | Fire / Ghost | 425 | 60/80/110/50/80/45 | Cursed Body, Lightning Rod, Rock Head | — |
| 71 | Maushold | Normal | 470 | 74/75/70/65/75/111 | Friend Guard, Cheek Pouch, Technician | — |
| 72 | Meloetta-Pirouette | Normal / Fighting | 600 | 100/128/90/77/77/128 | Serene Grace | — |
| 73 | Meowstic-M-Mega | Psychic | 566 | 74/48/76/143/101/124 | Trace | Meowstic + Meowsticite |
| 74 | Mimikyu | Ghost / Fairy | 476 | 55/90/80/50/105/96 | Disguise | — |
| 75 | Mimikyu-Busted | Ghost / Fairy | 476 | 55/90/80/50/105/96 | Disguise | — |
| 76 | Muk-Alola | Poison / Dark | 500 | 105/105/75/65/100/50 | Poison Touch, Gluttony, Power of Alchemy | — |
| 77 | Munkidori | Poison / Psychic | 555 | 88/75/66/130/90/106 | Toxic Chain, Frisk | — |
| 78 | Necrozma | Psychic | 600 | 97/107/101/127/89/79 | Prism Armor | — |
| 79 | Nidoking | Poison / Ground | 505 | 81/102/77/85/75/85 | Poison Point, Rivalry, Sheer Force | — |
| 80 | Nidoqueen | Poison / Ground | 505 | 90/92/87/75/85/76 | Poison Point, Rivalry, Sheer Force | — |
| 81 | Nihilego | Rock / Poison | 570 | 109/53/47/127/131/103 | Beast Boost | — |
| 82 | Noivern | Flying / Dragon | 535 | 85/70/80/97/80/123 | Frisk, Infiltrator, Telepathy | — |
| 83 | Obstagoon | Dark / Normal | 520 | 93/90/101/60/81/95 | Reckless, Guts, Defiant | — |
| 84 | Ogerpon | Grass | 550 | 80/120/84/60/96/110 | Defiant | — |
| 85 | Oricorio-Pom-Pom | Electric / Flying | 476 | 75/70/70/98/70/93 | Dancer | — |
| 86 | Oricorio-Sensu | Ghost / Flying | 476 | 75/70/70/98/70/93 | Dancer | — |
| 87 | Pangoro | Fighting / Dark | 495 | 95/124/78/69/71/58 | Iron Fist, Mold Breaker, Scrappy | — |
| 88 | Pelipper | Water / Flying | 440 | 60/50/100/95/70/65 | Keen Eye, Drizzle, Rain Dish | — |
| 89 | Pidgeot-Mega | Normal / Flying | 579 | 83/80/80/135/80/121 | No Guard | Pidgeot + Pidgeotite |
| 90 | Politoed | Water | 500 | 90/75/75/90/100/70 | Water Absorb, Damp, Drizzle | — |
| 91 | Porygon2 | Normal | 515 | 85/80/90/105/95/60 | Trace, Download, Analytic | — |
| 92 | Quagsire | Water / Ground | 430 | 95/85/85/65/65/35 | Damp, Water Absorb, Unaware | — |
| 93 | Raichu-Mega-X | Electric | 585 | 60/135/95/90/95/110 | Electric Surge | Raichu + Raichunite X |
| 94 | Regidrago | Dragon | 580 | 200/100/50/100/50/80 | Dragon's Maw | — |
| 95 | Registeel | Steel | 580 | 80/75/150/75/150/50 | Clear Body, Light Metal | — |
| 96 | Reuniclus | Psychic | 490 | 110/65/75/125/85/30 | Overcoat, Magic Guard, Regenerator | — |
| 97 | Revavroom | Steel / Poison | 500 | 80/119/90/54/67/90 | Overcoat, Filter | — |
| 98 | Ribombee | Bug / Fairy | 464 | 60/55/60/95/70/124 | Honey Gather, Shield Dust, Sweet Veil | — |
| 99 | Roserade | Grass / Poison | 515 | 60/70/65/125/105/90 | Natural Cure, Poison Point, Technician | — |
| 100 | Sandy Shocks | Electric / Ground | 570 | 85/81/97/121/85/101 | Protosynthesis | — |
| 101 | Sceptile-Mega | Grass / Dragon | 630 | 70/110/75/145/85/145 | Lightning Rod | Sceptile + Sceptilite |
| 102 | Scovillain-Mega | Grass / Fire | 586 | 65/138/85/138/85/75 | Spicy Spray | Scovillain + Scovillainite |
| 103 | Seismitoad | Water / Ground | 509 | 105/95/75/85/75/74 | Swift Swim, Poison Touch, Water Absorb | — |
| 104 | Sharpedo | Water / Dark | 460 | 70/120/40/95/40/95 | Rough Skin, Speed Boost | — |
| 105 | Sigilyph | Psychic / Flying | 490 | 72/58/80/103/80/97 | Wonder Skin, Magic Guard, Tinted Lens | — |
| 106 | Sinistcha | Grass / Ghost | 508 | 71/60/106/121/80/70 | Hospitality, Heatproof | — |
| 107 | Sirfetch’d | Fighting | 507 | 62/135/95/68/82/65 | Steadfast, Scrappy | — |
| 108 | Skeledirge | Fire / Ghost | 530 | 104/75/100/110/75/66 | Blaze, Unaware | — |
| 109 | Slither Wing | Bug / Fighting | 570 | 85/135/79/85/105/81 | Protosynthesis | — |
| 110 | Slurpuff | Fairy | 480 | 82/80/86/85/75/72 | Sweet Veil, Unburden | — |
| 111 | Steelix | Steel / Ground | 510 | 75/85/200/55/65/30 | Rock Head, Sturdy, Sheer Force | — |
| 112 | Steelix-Mega | Steel / Ground | 610 | 75/125/230/55/95/30 | Sand Force | Steelix + Steelixite |
| 113 | Suicune | Water | 580 | 100/75/115/90/115/85 | Pressure, Inner Focus, Water Absorb | — |
| 114 | Swellow | Normal / Flying | 455 | 60/85/60/75/50/125 | Guts, Scrappy | — |
| 115 | Talonflame | Fire / Flying | 499 | 78/81/71/74/69/126 | Flame Body, Gale Wings | — |
| 116 | Tangrowth | Grass | 535 | 100/100/125/110/50/50 | Chlorophyll, Leaf Guard, Regenerator | — |
| 117 | Tapu Bulu | Grass / Fairy | 570 | 70/130/115/85/95/75 | Grassy Surge, Telepathy | — |
| 118 | Tatsugiri-Curly-Mega | Dragon / Water | 575 | 68/65/90/135/125/92 | Commander | Tatsugiri + Tatsugirinite |
| 119 | Tinkaton | Fairy / Steel | 506 | 85/75/77/70/105/94 | Mold Breaker, Own Tempo, Pickpocket | — |
| 120 | Togekiss | Fairy / Flying | 545 | 85/50/95/120/115/80 | Hustle, Serene Grace, Super Luck | — |
| 121 | Tornadus | Flying | 580 | 79/115/70/125/80/111 | Prankster, Defiant | — |
| 122 | Torterra | Grass / Ground | 525 | 95/109/105/75/85/56 | Overgrow, Shell Armor | — |
| 123 | Toxtricity | Electric / Poison | 502 | 75/98/70/114/70/75 | Punk Rock, Plus, Technician | — |
| 124 | Toxtricity-Low-Key | Electric / Poison | 502 | 75/98/70/114/70/75 | Punk Rock, Minus, Technician | — |
| 125 | Umbreon | Dark | 525 | 95/65/110/60/130/65 | Synchronize, Inner Focus | — |
| 126 | Victreebel-Mega | Grass / Poison | 590 | 80/125/85/135/95/70 | Innards Out | Victreebel + Victreebelite |
| 127 | Volcanion | Fire / Water | 600 | 80/110/120/130/90/70 | Water Absorb | — |
| 128 | Weezing-Galar | Poison / Fairy | 490 | 65/90/120/85/70/60 | Levitate, Neutralizing Gas, Misty Surge | — |
| 129 | Yanmega | Bug / Flying | 515 | 86/76/86/116/56/95 | Speed Boost, Tinted Lens, Frisk | — |
| 130 | Zarude | Dark / Grass | 600 | 105/120/105/70/95/105 | Leaf Guard | — |
| 131 | Zygarde-10% | Dragon / Ground | 486 | 54/100/71/61/85/115 | Aura Break, Power Construct | — |
<!-- END GENERATED RU BAR -->

---

## 7. Every move whose numbers differ from Showdown

Generated by diffing all 827 packaged moves against upstream `@pkmn`. This is the
complete list — nothing is summarised or omitted.

<!-- BEGIN GENERATED MOVE DIFF -->
#### Base power restored to a pre-nerf value (32)

| Move | Type | | Change |
| --- | --- | --- | --- |
| Draco Meteor | Dragon | Spec | 130 -> **140** |
| Leaf Storm | Grass | Spec | 130 -> **140** |
| Overheat | Fire | Spec | 130 -> **140** |
| Glacial Lance | Ice | Phys | 120 -> **130** |
| Blizzard | Ice | Spec | 110 -> **120** |
| Fire Blast | Fire | Spec | 110 -> **120** |
| Hurricane | Flying | Spec | 110 -> **120** |
| Hydro Pump | Water | Spec | 110 -> **120** |
| Magma Storm | Fire | Spec | 100 -> **120** |
| Thunder | Electric | Spec | 110 -> **120** |
| Dig | Ground | Phys | 80 -> **100** |
| Heat Wave | Fire | Spec | 95 -> **100** |
| Meteor Mash | Steel | Phys | 90 -> **100** |
| Flamethrower | Fire | Spec | 90 -> **95** |
| Ice Beam | Ice | Spec | 90 -> **95** |
| Muddy Water | Water | Spec | 90 -> **95** |
| Surf | Water | Spec | 90 -> **95** |
| Thunderbolt | Electric | Spec | 90 -> **95** |
| Aura Sphere | Fighting | Spec | 80 -> **90** |
| Dragon Pulse | Dragon | Spec | 85 -> **90** |
| Sucker Punch | Dark | Phys | 70 -> **80** |
| Wicked Blow | Dark | Phys | 75 -> **80** |
| Grassy Glide | Grass | Phys | 55 -> **70** |
| Double Hit | Normal | Phys | 35 -> **50** |
| Double Iron Bash | Steel | Phys | 60 -> **50** |
| Double Kick | Fighting | Phys | 30 -> **50** |
| Dual Chop | Dragon | Phys | 40 -> **50** |
| Dual Wingbeat | Flying | Phys | 40 -> **50** |
| Feint | Normal | Phys | 30 -> **50** |
| Tackle | Normal | Phys | 40 -> **50** |
| Twin Beam | Psychic | Spec | 40 -> **50** |
| Twineedle | Bug | Phys | 25 -> **50** |

#### Multi-hit standardised — flat BP per hit (8)

| Move | Type | | Change |
| --- | --- | --- | --- |
| Arm Thrust | Fighting | Phys | 15 -> **25** |
| Barrage | Normal | Phys | 15 -> **25** |
| Comet Punch | Normal | Phys | 18 -> **25** |
| Double Slap | Normal | Phys | 15 -> **25** |
| Fury Attack | Normal | Phys | 15 -> **25** |
| Fury Swipes | Normal | Phys | 18 -> **25** |
| Spike Cannon | Normal | Phys | 20 -> **25** |
| Water Shuriken | Water | Spec | 15 -> **25** |

#### Trapping moves turned into 2-5 hit attacks that still trap (4)

| Move | Type | | Change |
| --- | --- | --- | --- |
| Bind | Normal | Phys | 15 -> **25**, hits 1 -> **2-5** |
| Clamp | Water | Phys | 35 -> **25**, hits 1 -> **2-5** |
| Fire Spin | Fire | Spec | 35 -> **25**, hits 1 -> **2-5** |
| Wrap | Normal | Phys | 15 -> **25**, hits 1 -> **2-5** |

#### Redesigned outright (2)

| Move | Type | | Change |
| --- | --- | --- | --- |
| Focus Punch | Fighting | Phys | accuracy 100% -> **70%**, priority -3 -> **0** |
| Upper Hand | Fighting | Phys | secondary yes -> **no** |
<!-- END GENERATED MOVE DIFF -->

---

## 8. Ability changes that land on this roster

The left two columns are this project's design record; the right column is
generated from the live roster, so it cannot go stale.

<!-- BEGIN GENERATED ABILITY IMPACT -->
8 of this project's 28 changed abilities are on a UU entry.

| Ability | What RedGPT changed | UU entries with it |
| --- | --- | --- |
| Magic Guard | also blocks Toxic Spikes and full paralysis | Alakazam, Clefable |
| Pixilate | 1.3x, not 1.2x | Altaria-Mega, Gardevoir-Mega |
| Transistor | 1.5x, not 1.3x | Regieleki |
| Mold Breaker | also ignores Dark Aura and Fairy Aura | Emboar-Mega, Excadrill, Hawlucha, Haxorus |
| Download | redesigned: always +1 Atk AND +1 SpA | Porygon-Z |
| Light Metal | redesigned: +1 Speed on entry | Metagross, Scizor |
| Supersweet Syrup | fires on every entry | Hydrapple |
| Analytic | unchanged in effect, but see the turn-order note | Porygon-Z |
<!-- END GENERATED ABILITY IMPACT -->

---

## 9. Item changes

<!-- BEGIN GENERATED ITEM IMPACT -->
| Item | What RedGPT changed |
| --- | --- |
| Ring Target | REDESIGNED: the holder's attacks hit for neutral damage on a target that would be type-immune. One per team, and visible to the opponent from turn one. |
| Toxic Orb | fires on ENTRY, not at end of turn |
| Flame Orb | fires on ENTRY, not at end of turn |
| Warp Prism | project invention: Trick Room the holder sets lasts 8 turns, not 5 |
| Wind Sock | project invention: Tailwind the holder sets lasts 7 turns, not 4 |
| Hero Charm | project invention: Palafin enters as Palafin-Hero |
| Oran Berry | fires at 1/4 max HP, not 1/2 |
| Pink Bow | 1.1x to Normal moves (every other type booster is 1.2x) |
| Polkadot Bow | 1.1x to Normal moves |
<!-- END GENERATED ITEM IMPACT -->

### Which UU Pokémon are refused which item

This is the Absol/Absolite rule: the **forme** is banned from the tier, never the
Pokémon. Each of these plays in UU and simply may not hold the stone here.

<!-- BEGIN GENERATED FORME GATES -->
12 UU species may not hold an item they otherwise could.

| UU Pokémon | Item it may not hold in UU | Forme it would become | That forme's tier |
| --- | --- | --- | --- |
| Alakazam | Alakazite | Alakazam-Mega | **OU** |
| Clefable | Clefablite | Clefable-Mega | **OU** |
| Excadrill | Excadrite | Excadrill-Mega | **OU** |
| Gengar | Gengarite | Gengar-Mega | **Ubers** |
| Glimmora | Glimmoranite | Glimmora-Mega | **OU** |
| Gyarados | Gyaradosite | Gyarados-Mega | **OU** |
| Hawlucha | Hawluchanite | Hawlucha-Mega | **OU** |
| Metagross | Metagrossite | Metagross-Mega | **OU** |
| Salamence | Salamencite | Salamence-Mega | **Ubers** |
| Scizor | Scizorite | Scizor-Mega | **OU** |
| Tyranitar | Tyranitarite | Tyranitar-Mega | **OU** |
| Zeraora | Zeraorite | Zeraora-Mega | **OU** |
<!-- END GENERATED FORME GATES -->

---

## 10. Who actually carries the divergent rules

<!-- BEGIN GENERATED RULE CARRIERS -->
- **Sucker Punch** (no activation condition here): Bisharp, Emboar-Mega, Gengar, Hydrapple, Latias-Mega, Mew, Moltres-Galar, Polteageist, Rotom-Wash, Sableye-Mega, Zoroark-Hisui
- **Thunderclap** (no activation condition here): _nobody in UU_
- **First Impression** (no activation condition here): Haxorus
- **Upper Hand** (no activation condition here): Conkeldurr, Hawlucha, Heracross-Mega, Keldeo, Lilligant-Hisui, Mew, Mienshao, Okidogi, Quaquaval, Raichu-Mega-Y, Scrafty-Mega, Terrakion, Weavile
- **Grassy Glide** (no activation condition here): Hydrapple, Lilligant-Hisui, Meganium-Mega, Mew, Serperior, Venusaur-Mega
- **Protean / Libero** (retype on EVERY move, and it grants STAB): _nobody in UU_
- **Pre-nerf base stats** (`LEGACY_BASE_STATS`): Aegislash, Aegislash-Blade
<!-- END GENERATED RULE CARRIERS -->

---

## 11. Traps specific to this roster

Each of these produces a wrong answer if you reason past it.

1. **A forme is not its base.** Judge Mega Slowbro and Slowbro separately; they
   have different stats, different abilities and different item freedom, and they
   can sit in different tiers.
2. **A Mega costs the item slot.** Compare it against the base holding
   Leftovers, a Choice item or Boots — not against the base holding nothing.
3. **No Tera.** Do not credit a Pokémon with defensive Tera or Tera Blast.
4. **Unconditional priority cuts both ways.** It makes UU's revenge killers
   better than you expect, which is usually an argument *against* promoting a
   fast sweeper.
5. **Check the ability.** Several UU entries have a defining ability that is not
   their first — Scizor's Technician, Azumarill's Huge Power. If you quote a
   damage figure, say which ability it assumes.
6. **`estimated` on a forme means Smogon never ranked it** and this project
   placed it by nearest neighbour. Those are the softest entries here and the
   easiest to argue with — say so if your verdict rests on one.
7. **Read the movepool, not the stat line.** The clearest result of the last pass
   was Zeraora-Mega: an Ubers-shaped 700 BST that stays OU because its learnset
   has no Ice, Water or Ground move at all.

---

## 12. What to send back

For each entry you want to move, give:

- the **name exactly as written** in §4, and whether it is a species or a forme;
- **UP to OU** or **DOWN to RU**;
- **confidence** (high / medium / low);
- the **argument in two or three sentences**, naming the specific UU Pokémon it
  outclasses or is outclassed by;
- the **damage or speed numbers** you are relying on, with the ability and item
  they assume — or say plainly that you are reasoning from the profile alone and
  want them measured.

Then list, separately, the entries you **considered and deliberately left**, with
one line each. That list is as useful as the moves — the last pass's most
valuable single result was a Pokémon that was *not* moved.

**If a number you need is missing, ask for it rather than estimating.** This
project can run any damage calculation against the real engine, and a request is
cheaper than a wrong verdict built on a guess.
