# RedGPT UU Final Audit — Verified Evidence Packet

**Generated from the live RedGPT project** by `tools/uu-final-evidence.js`.
Every stat, movepool value, damage figure and speed number below comes from the
running engine, the packaged data, the validator or the real damage calculator.

**There is no usage, win-rate, ladder, tournament or popularity data in this
project, so none is quoted.** Where something genuinely cannot be determined,
section S says so.

---

## Your task

You are making the **complete final UU tier audit for Pokémon RedGPT**. Answer
both directions:

1. **Which current UU entries are too strong for UU and should move UP to OU?**
2. **Which current UU entries are too weak for UU and should move DOWN to RU?**

The questions are *not* "would this be good in Smogon UU". They are:

> **Upward** — is this entry so powerful, centralising, hard to check or
> role-compressing **under RedGPT's mechanics** that it belongs in the RedGPT OU
> roster in section E?
>
> **Downward** — is this entry sufficiently outclassed **at its actual job** by
> the RU entries in section D that it no longer deserves UU?

**A high BST is not enough to promote**, and **weak raw stats are not enough to
demote** — a UU entry should only fall if RU already contains one or more
Pokémon that credibly do the same job as well or better.

For every entry you move, give: the exact name, species or forme, the direction,
confidence (high/medium/low), two or three sentences naming the specific Pokémon
it outclasses or is outclassed by, and the numbers you relied on with the ability
and item they assume. Then list separately what you **considered and deliberately
left**. Most entries should not move.

**This packet makes no tiering decisions and contains no recommendations.** It is
evidence for yours. Where it could not settle something, section S says so
explicitly rather than guessing.

---

---

## A. Current tier / rules snapshot

| Tier | Entries |
| --- | --- |
| AG | 0 |
| Ubers | 63 |
| OU | 93 |
| UU | 91 |
| RU | 131 |
| NU | 67 |
| PU | 110 |
| ZU | 677 |

**Format rules for UU** (`Formats.get('tieruu')`, read live):

- Terastallization: **OFF** — UU has **no Tera**.
- Mega Evolution: **ON** — the stone alone enables it, no Key Stone.
- Species Clause **on**, Sleep Clause **on**, Item Clause **off**.
- Evasion clause **on**, OHKO clause **on** — banned moves: Fissure, Guillotine, Horn Drill, Sheer Cold, Double Team, Minimize.
- Level 100, 6v6, EVs 510/252, IVs 31.
- Tier ceiling `maxTier: UU` is enforced **on the team and on the forme**.

**Unconditional priority — exact RedGPT values.** These five keep positive
priority and have **no activation condition**.

| Move | Type | Cat | BP | Priority | Acc |
| --- | --- | --- | --- | --- | --- |
| Sucker Punch | Dark | Physical | **80** | **+1** | 100% |
| Thunderclap | Electric | Special | **70** | **+1** | 100% |
| First Impression | Bug | Physical | **90** | **+2** | 100% |
| Upper Hand | Fighting | Physical | **65** | **+3** | 100% |
| Grassy Glide | Grass | Physical | **70** | **+1** | 100% |

Grassy Glide's packaged `priority` is **0**; the +1 is applied by the engine in
`runTurn`, so reading the move data alone misses it.

**Multi-hit:** 2-5 hit moves are a flat **25 BP per hit**, exactly-2-hit moves
**50 BP per hit**. **Triple Axel is deliberately excluded** — it is packaged
`20 BP × 3` and keeps its own escalating shape.

**Restored / notable base powers (live values):**

| Move | Type | BP | Acc |
| --- | --- | --- | --- |
| Overheat | Fire | 140 | 90% |
| Leaf Storm | Grass | 140 | 90% |
| Draco Meteor | Dragon | 140 | 90% |
| Blizzard | Ice | 120 | 70% |
| Hydro Pump | Water | 120 | 80% |
| Fire Blast | Fire | 120 | 85% |
| Thunder | Electric | 120 | 70% |
| Focus Punch | Fighting | 150 | 70% |
| Head Smash | Rock | 150 | 80% |
| Mind Blown | Fire | 150 | 100% |
| Close Combat | Fighting | 120 | 100% |
| Psystrike | Psychic | 100 | 100% |

**Ring Target** (`Ring Target`): the holder's attacks hit for
**neutral** damage on a target that would be immune **by type**. It does **not**
bypass ability immunities (Levitate, Flash Fire, Water Absorb). **One per team in
every format**, enforced at team building *and* in battle. **Visible to the
opponent from turn one.** A Mega cannot hold it — the stone occupies the slot.

**Toxic Orb and Flame Orb activate on ENTRY**, not at end of turn, so a Guts or
Poison Heal holder is already boosted on the turn it arrives.

**Every species keeps every ability it has ever had** (pre-Gen-8 species only).

---

## B. Corrections to the previous evidence

Four defects in the **previous UU profiler** were found while assembling this
packet. All four are fixed here, and each changed what a profile said.

**B1 — The category filter used BASE stats, so ability-driven offence was
invisible.** The old profiler compared base Attack to base Special Attack and
hid the weaker side. That is wrong for every ability that multiplies a stat.

| Entry | Base line | Engine stats @252+ | Old profile showed | Truth |
| --- | --- | --- | --- | --- |
| Starmie-Mega | 100 Atk / 130 SpA | **Atk 656 / SpA 394** (Huge Power) | special only | physical is the real half |
| Azumarill | 50 Atk / 60 SpA | **Atk 436** (Huge Power) / SpA 240 | mixed, understated | physical |
| Conkeldurr | 140 Atk | **Atk 416** (Guts, before any burn) | physical | physical |

Measured on the same target — Mega Starmie into a 252 HP / 252+ Def Blissey:

| Move | Damage |
| --- | --- |
| +Atk 252 Waterfall (Water STAB) | **434-511 (60.8-71.6%)** |
| +Atk 252 Psycho Cut (Psychic STAB) | 380-448 (53.2-62.7%) |
| +Atk 252 Double-Edge | 434-510 (60.8-71.4%) |
| +SpA 252 Hydro Pump | 168-197 (23.5-27.6%) |
| +SpA 252 Psychic | 126-149 (17.6-20.9%) |

**The physical set does roughly 2.6× what the special set does.** The old
profile showed the special half.

**B2 — The `-ate` abilities were not applied.** They convert in
`onModifyMove`, not in `battle.moveType`, so the profiler read the packaged
type. Corrected via `Abilities.displayMoveType` / `displayBasePower`, which
is what the game's own move buttons use:

| Ability | Move | Packaged | Actual |
| --- | --- | --- | --- |
| Pixilate | Hyper Voice | Normal 90 | **Fairy 117** |
| Pixilate | Double-Edge | Normal 120 | **Fairy 156** |
| Aerilate | Double-Edge | Normal 120 | **Flying 156** |
| Refrigerate | Body Slam | Normal 85 | **Ice 110** |

So Mega Gardevoir's and Mega Altaria's Fairy STAB were both missing from the
previous document.

**B3 — Charge moves won ties.** Mega Starmie's Water STAB was reported as
**Dive** (80, charge) rather than **Waterfall** (80, no charge). Charge moves now
lose ties.

**B4 — Banned moves were advertised.** Double Team appeared under "Setup" across
the roster although UU's evasion clause bans it. The profiler filters
`rules.bannedMoves` now.

---

## C. Full UU competitive profiles

All **91** current UU entries. Engine-resolved throughout.

**Aegislash** — species, **UU**, tier source: imported (natdex)
  Steel/Ghost | BST 520 (60/50/150/50/150/60)
  Abilities: Stance Change
  Engine stats @252 (neutral/positive): Stance Change: Atk 199/218, SpA 199/218, Spe 219/240
  Held item: **free**
  STAB: Steel Steel Beam 140S · Ghost Shadow Ball 80S
  Physical coverage: Rock Head Smash 150P, Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Return 102P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Flying Air Slash 75S, Normal Hidden Power 60S, Electric Shock Wave 60S
  Setup: Autotomize, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Priority: Shadow Sneak 40P Ghost (+1)
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Destiny Bond, Protect, Reflect, Substitute
  Notable: Substitute

**Aegislash-Blade** — species, **UU**, tier source: imported (natdex)
  Steel/Ghost | BST 520 (60/150/50/150/50/60)
  Abilities: Stance Change
  Engine stats @252 (neutral/positive): Stance Change: Atk 399/438, SpA 399/438, Spe 219/240
  Held item: **free**
  STAB: Steel Steel Beam 140S · Ghost Shadow Ball 80S
  Physical coverage: Rock Head Smash 150P, Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Return 102P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Flying Air Slash 75S, Normal Hidden Power 60S, Electric Shock Wave 60S
  Setup: Autotomize, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Priority: Shadow Sneak 40P Ghost (+1)
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Destiny Bond, Protect, Reflect, Substitute
  Notable: Substitute

**Aerodactyl-Mega** — forme, **UU**, tier source: imported (natdex)
  Rock/Flying | BST 615 (80/135/85/70/95/150)
  Abilities: Tough Claws (fixed by the forme)
  Engine stats @252 (neutral/positive): Tough Claws: Atk 369/405, SpA 239/262, Spe 399/438
  Held item: **Aerodactylite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Aerodactyl (NU), pre-Mega abilities: Rock Head / Pressure / Unnerve
  STAB: Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Fire Fire Blast 120S, Dragon Dragon Pulse 90S, Ground Earth Power 90S, Normal Razor Wind 80 (charge)S, Ghost Ominous Wind 60S
  Setup: Agility, Dragon Dance, Hone Claws, Rock Polish
  Reliable recovery: Rest, Roost
  Hazards: Stealth Rock
  Removal: Defog
  Phazing: Roar, Whirlwind
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Protect, Reflect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Alakazam** — species, **UU**, tier source: imported (natdex)
  Psychic | BST 500 (55/50/45/135/95/120)
  Abilities: Synchronize / Inner Focus / Magic Guard
  Engine stats @252 (neutral/positive): Synchronize: Atk 199/218, SpA 369/405, Spe 339/372 — Inner Focus: Atk 199/218, SpA 369/405, Spe 339/372 — Magic Guard: Atk 199/218, SpA 369/405, Spe 339/372
  Held item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Zap Cannon 120S, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Normal Tri Attack 80S
  Setup: Barrier, Calm Mind, Nasty Plot
  Reliable recovery: Recover, Rest
  Drain/unreliable: Drain Punch, Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Disable, Encore, Gravity, Knock Off, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room

**Altaria-Mega** — forme, **UU**, tier source: imported (natdex)
  Dragon/Fairy | BST 590 (75/110/110/110/105/80)
  Abilities: Pixilate (fixed by the forme)
  Engine stats @252 (neutral/positive): Pixilate: Atk 319/350, SpA 319/350, Spe 259/284
  Held item: **Altarianite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Altaria (NU), pre-Mega abilities: Natural Cure / Cloud Nine
  STAB: Dragon Draco Meteor 140S · Fairy Double-Edge 156P
  Physical coverage: Flying Sky Attack 140 (charge)P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Thief 60P, Grass Trailblaze 50P, Fighting Rock Smash 40P
  Special coverage: Fire Fire Blast 120S, Flying Hurricane 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ice Ice Beam 95S, Ghost Ominous Wind 60S
  Setup: Agility, Cotton Guard, Dragon Dance, Hone Claws
  Reliable recovery: Rest, Roost
  Drain/unreliable: Dream Eater
  Removal: Defog
  Phazing: Roar
  Status: Sing, Toxic, Will-O-Wisp
  Cleric/support: Heal Bell
  Weather/terrain: Rain Dance, Snowscape, Sunny Day
  Utility: Haze, Perish Song, Protect, Safeguard, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Amoonguss** — species, **UU**, tier source: imported (natdex)
  Grass/Poison | BST 464 (114/85/70/85/80/30)
  Abilities: Effect Spore / Regenerator
  Engine stats @252 (neutral/positive): Effect Spore: Atk 269/295, SpA 269/295, Spe 159/174 — Regenerator: Atk 269/295, SpA 269/295, Spe 159/174
  Held item: **free**
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Return 102P, Dark Foul Play 95P, Ground Stomping Tantrum 75P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Bug Pollen Puff 90S, Normal Tera Blast 80S, Ghost Hex 65S
  Setup: Defense Curl, Growth
  Reliable recovery: Rest
  Drain/unreliable: Absorb, Giga Drain, Mega Drain
  Status: Poison Powder, Spore, Stun Spore, Toxic
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Clear Smog, Protect, Substitute
  Notable: Substitute

**Archaludon** — species, **UU**, tier source: imported (natdex)
  Steel/Dragon | BST 600 (90/105/130/125/65/85)
  Abilities: Stamina / Sturdy / Stalwart
  Engine stats @252 (neutral/positive): Stamina: Atk 309/339, SpA 349/383, Spe 269/295 — Sturdy: Atk 309/339, SpA 349/383, Spe 269/295 — Stalwart: Atk 309/339, SpA 349/383, Spe 269/295
  Held item: **free**
  STAB: Steel Steel Beam 140S · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Foul Play 95P, Fighting Body Press 80P
  Special coverage: Electric Electro Shot 130 (charge)S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Fighting Aura Sphere 90S, Dark Dark Pulse 80S, Normal Tera Blast 80S
  Setup: Hone Claws, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Dragon Tail, Roar
  Status: Thunder Wave
  Utility: Light Screen, Protect, Reflect, Substitute
  Notable: Substitute

**Azumarill** — species, **UU**, tier source: imported (natdex)
  Water/Fairy | BST 420 (100/50/80/60/80/50)
  Abilities: Thick Fat / Huge Power / Sap Sipper
  Engine stats @252 (neutral/positive): Thick Fat: Atk 199/218, SpA 219/240, Spe 199/218 — Huge Power: Atk 398/436, SpA 219/240, Spe 199/218 — Sap Sipper: Atk 199/218, SpA 219/240, Spe 199/218
  Held item: **free**
  STAB: Water Aqua Tail 90P · Fairy Play Rough 90P
  Physical coverage: Fighting Focus Punch 150P, Steel Steel Roller 130P, Normal Double-Edge 120P, Ground Dig 100 (charge)P, Flying Bounce 85 (charge)P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Psychic Future Sight 120S, Normal Hyper Voice 90S, Grass Grass Knot 60S, Ground Mud Shot 55S
  Setup: Amnesia, Defense Curl, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Draining Kiss
  Priority: Aqua Jet 40P Water (+1)
  Status: Sing, Toxic
  Weather/terrain: Hail, Misty Terrain, Rain Dance, Snowscape
  Utility: Encore, Knock Off, Light Screen, Perish Song, Protect, Substitute
  Notable: Knock Off, Encore, Substitute

**Bisharp** — species, **UU**, tier source: imported (natdex)
  Dark/Steel | BST 490 (65/125/100/60/70/70)
  Abilities: Defiant / Inner Focus / Pressure
  Engine stats @252 (neutral/positive): Defiant: Atk 349/383, SpA 219/240, Spe 239/262 — Inner Focus: Atk 349/383, SpA 219/240, Spe 239/262 — Pressure: Atk 349/383, SpA 219/240, Spe 239/262
  Held item: **free**
  STAB: Dark Foul Play 95P · Steel Iron Head 80P
  Physical coverage: Normal Return 102P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Flying Air Slash 75S, Grass Grass Knot 60S
  Setup: Hone Claws, Iron Defense, Rock Polish, Swords Dance
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1)
  Hazards: Stealth Rock
  Status: Thunder Wave, Toxic
  Trapping: Mean Look
  Weather/terrain: Rain Dance, Sandstorm
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Blacephalon** — species, **UU**, tier source: imported (natdex)
  Fire/Ghost | BST 570 (53/127/53/151/79/107)
  Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 353/388, SpA 401/441, Spe 313/344
  Held item: **free**
  STAB: Fire Mind Blown 150S · Ghost Shadow Ball 80S
  Physical coverage: Normal Explosion 250P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Rock Rock Blast 25x2-5P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S
  Setup: Calm Mind
  Reliable recovery: Rest
  Status: Hypnosis, Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Encore, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Substitute, Taunt, Trick
  Notable: Knock Off, Trick, Encore, Taunt, Substitute

**Blissey** — species, **UU**, tier source: imported (natdex)
  Normal | BST 540 (255/10/10/75/135/55)
  Abilities: Natural Cure / Serene Grace / Healer
  Engine stats @252 (neutral/positive): Natural Cure: Atk 119/130, SpA 249/273, Spe 209/229 — Serene Grace: Atk 119/130, SpA 249/273, Spe 209/229 — Healer: Atk 119/130, SpA 249/273, Spe 209/229
  Held item: **free**
  STAB: Normal Hyper Voice 90S
  Physical coverage: Fighting Focus Punch 150P, Ground Earthquake 100P, Steel Iron Tail 100P, Electric Wild Charge 90P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S
  Setup: Calm Mind, Defense Curl, Work Up
  Reliable recovery: Rest, Soft-Boiled
  Drain/unreliable: Drain Punch, Dream Eater
  Hazards: Stealth Rock
  Pivot: Teleport
  Status: Sing, Thunder Wave, Toxic
  Cleric/support: Aromatherapy, Heal Bell, Life Dew, Wish
  Trapping: Block
  Weather/terrain: Electric Terrain, Hail, Rain Dance, Sandstorm, Snowscape, Sunny Day
  Utility: Gravity, Healing Wish, Light Screen, Protect, Reflect, Safeguard, Substitute, Trick
  Notable: Trick, Substitute

**Buzzwole** — species, **UU**, tier source: imported (natdex)
  Bug/Fighting | BST 570 (107/139/139/53/53/79)
  Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 377/414, SpA 205/225, Spe 257/282
  Held item: **free**
  STAB: Bug Leech Life 80P · Fighting Focus Punch 150P
  Physical coverage: Dragon Outrage 120P, Normal Return 102P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P
  Special coverage: Normal Hidden Power 60S
  Setup: Bulk Up, Harden, Work Up
  Reliable recovery: Rest, Roost
  Drain/unreliable: Drain Punch, Leech Life
  Status: Toxic
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Celesteela** — species, **UU**, tier source: imported (natdex)
  Steel/Flying | BST 570 (97/101/103/107/101/61)
  Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 301/331, SpA 313/344, Spe 221/243
  Held item: **free**
  STAB: Steel Steel Beam 140S · Flying Acrobatics 110P
  Physical coverage: Normal Explosion 250P, Bug Megahorn 120P, Fighting Superpower 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Grass Seed Bomb 80P
  Special coverage: Fire Fire Blast 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Normal Hidden Power 60S, Electric Shock Wave 60S
  Setup: Autotomize, Harden, Iron Defense
  Reliable recovery: Rest
  Drain/unreliable: Absorb, Giga Drain, Mega Drain
  Status: Toxic
  Trapping: Block
  Utility: Gravity, Leech Seed, Protect, Substitute
  Notable: Substitute

**Chandelure** — species, **UU**, tier source: override
  Ghost/Fire | BST 520 (60/55/90/145/90/80)
  Abilities: Flash Fire / Flame Body / Infiltrator / Shadow Tag
  Engine stats @252 (neutral/positive): Flash Fire: Atk 209/229, SpA 389/427, Spe 259/284 — Flame Body: Atk 209/229, SpA 389/427, Spe 259/284 — Infiltrator: Atk 209/229, SpA 389/427, Spe 259/284 — Shadow Tag: Atk 209/229, SpA 389/427, Spe 259/284
  Held item: **free**
  STAB: Ghost Shadow Ball 80S · Fire Overheat 140S
  Physical coverage: Normal Return 102P, Dark Lash Out 75P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S
  Setup: Acid Armor, Calm Mind
  Reliable recovery: Rest
  Drain/unreliable: Dream Eater
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Clear Smog, Haze, Memento, Pain Split, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

**Chandelure-Mega** — forme, **UU**, tier source: override
  Ghost/Fire | BST 620 (60/75/110/175/110/90)
  Abilities: Infiltrator (fixed by the forme)
  Engine stats @252 (neutral/positive): Infiltrator: Atk 249/273, SpA 449/493, Spe 279/306
  Held item: **Chandelurite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Chandelure (UU), pre-Mega abilities: Flash Fire / Flame Body / Infiltrator / Shadow Tag
  STAB: Ghost Shadow Ball 80S · Fire Overheat 140S
  Physical coverage: Normal Return 102P, Dark Lash Out 75P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S
  Setup: Acid Armor, Calm Mind
  Reliable recovery: Rest
  Drain/unreliable: Dream Eater
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Clear Smog, Haze, Memento, Pain Split, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

**Chansey** — species, **UU**, tier source: imported (natdex)
  Normal | BST 450 (250/5/5/35/105/50)
  Abilities: Natural Cure / Serene Grace / Healer
  Engine stats @252 (neutral/positive): Natural Cure: Atk 109/119, SpA 169/185, Spe 199/218 — Serene Grace: Atk 109/119, SpA 169/185, Spe 199/218 — Healer: Atk 109/119, SpA 169/185, Spe 199/218
  Held item: **free**
  STAB: Normal Hyper Voice 90S
  Physical coverage: Fighting Focus Punch 150P, Ground Earthquake 100P, Steel Iron Tail 100P, Electric Wild Charge 90P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S
  Setup: Calm Mind, Defense Curl, Work Up
  Reliable recovery: Rest, Soft-Boiled
  Drain/unreliable: Drain Punch, Dream Eater
  Hazards: Stealth Rock
  Pivot: Teleport
  Status: Sing, Thunder Wave, Toxic
  Cleric/support: Aromatherapy, Heal Bell, Life Dew, Wish
  Weather/terrain: Electric Terrain, Hail, Rain Dance, Sandstorm, Snowscape, Sunny Day
  Utility: Gravity, Healing Wish, Light Screen, Protect, Reflect, Safeguard, Substitute
  Notable: Substitute

**Clefable** — species, **UU**, tier source: imported (natdex)
  Fairy | BST 483 (95/70/73/95/90/60)
  Abilities: Cute Charm / Magic Guard / Unaware
  Engine stats @252 (neutral/positive): Cute Charm: Atk 239/262, SpA 289/317, Spe 219/240 — Magic Guard: Atk 239/262, SpA 289/317, Spe 219/240 — Unaware: Atk 239/262, SpA 289/317, Spe 219/240
  Held item: **free**
  STAB: Fairy Misty Explosion 100S
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S
  Setup: Amnesia, Calm Mind, Cosmic Power, Defense Curl, Work Up
  Reliable recovery: Rest, Soft-Boiled
  Drain/unreliable: Drain Punch, Draining Kiss, Dream Eater
  Hazards: Stealth Rock
  Pivot: Baton Pass, Teleport
  Status: Sing, Thunder Wave, Toxic
  Cleric/support: Aromatherapy, Heal Bell, Life Dew, Wish
  Weather/terrain: Misty Terrain, Rain Dance, Sunny Day
  Utility: Detect, Encore, Gravity, Healing Wish, Knock Off, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick
  Notable: Knock Off, Trick, Encore, Substitute, Baton Pass

**Conkeldurr** — species, **UU**, tier source: imported (natdex)
  Fighting | BST 505 (105/140/95/55/65/45)
  Abilities: Guts / Sheer Force / Iron Fist
  Engine stats @252 (neutral/positive): Guts: Atk 379/416, SpA 209/229, Spe 189/207 — Sheer Force: Atk 379/416, SpA 209/229, Spe 189/207 — Iron Fist: Atk 379/416, SpA 209/229, Spe 189/207
  Held item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Hard Press 100P, Rock Stone Edge 100P, Poison Poison Jab 80P, Fire Fire Punch 75P
  Special coverage: Normal Tera Blast 80S, Grass Grass Knot 60S
  Setup: Bulk Up, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Mach Punch 40P Fighting (+1)
  Removal: Defog
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Corviknight** — species, **UU**, tier source: override
  Flying/Steel | BST 495 (98/87/105/53/85/67)
  Abilities: Pressure / Unnerve / Mirror Armor
  Engine stats @252 (neutral/positive): Pressure: Atk 273/300, SpA 205/225, Spe 233/256 — Unnerve: Atk 273/300, SpA 205/225, Spe 233/256 — Mirror Armor: Atk 273/300, SpA 205/225, Spe 233/256
  Held item: **free**
  STAB: Flying Sky Attack 140 (charge)P · Steel Steel Beam 140S
  Physical coverage: Normal Double-Edge 120P, Fighting Body Press 80P, Bug U-turn 70P, Dark Assurance 60P
  Special coverage: Normal Tera Blast 80S
  Setup: Agility, Bulk Up, Hone Claws, Iron Defense, Nasty Plot, Work Up
  Reliable recovery: Rest, Roost
  Removal: Defog
  Pivot: U-turn
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Light Screen, Protect, Reflect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Delphox-Mega** — forme, **UU**, tier source: override
  Fire/Psychic | BST 634 (75/69/72/159/125/134)
  Abilities: Levitate (fixed by the forme)
  Engine stats @252 (neutral/positive): Levitate: Atk 237/260, SpA 417/458, Spe 367/403
  Held item: **Delphoxite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Delphox (PU), pre-Mega abilities: Blaze / Magician
  STAB: Fire Overheat 140S · Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Dark Foul Play 95P, Electric Thunder Punch 75P, Fighting Low Kick 60P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Normal Hyper Voice 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
  Setup: Agility, Calm Mind, Nasty Plot, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Dream Eater
  Status: Hypnosis, Toxic, Will-O-Wisp
  Cleric/support: Wish
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Encore, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Switcheroo, Trick, Trick Room
  Notable: Trick, Switcheroo, Encore, Substitute, Trick Room

**Dragalge-Mega** — forme, **UU**, tier source: override
  Poison/Dragon | BST 594 (65/85/105/132/163/44)
  Abilities: Regenerator (fixed by the forme)
  Engine stats @252 (neutral/positive): Regenerator: Atk 269/295, SpA 363/399, Spe 187/205
  Held item: **Dragalgite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Dragalge (NU), pre-Mega abilities: Poison Point / Poison Touch / Adaptability
  STAB: Poison Sludge Wave 95S · Dragon Draco Meteor 140S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Water Aqua Tail 90P, Fairy Play Rough 90P, Flying Bounce 85 (charge)P, Dark Feint Attack 60P
  Special coverage: Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ice Icy Wind 55S
  Setup: Acid Armor
  Reliable recovery: Rest
  Hazards: Toxic Spikes
  Pivot: Flip Turn
  Phazing: Dragon Tail
  Status: Toxic
  Weather/terrain: Hail, Rain Dance, Snowscape
  Utility: Haze, Protect, Substitute
  Notable: Substitute

**Drampa-Mega** — forme, **UU**, tier source: override
  Normal/Dragon | BST 585 (78/85/110/160/116/36)
  Abilities: Berserk (fixed by the forme)
  Engine stats @252 (neutral/positive): Berserk: Atk 269/295, SpA 419/460, Spe 171/188
  Held item: **Drampanite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Drampa (NU), pre-Mega abilities: Berserk / Sap Sipper / Cloud Nine
  STAB: Normal Hyper Voice 90S · Dragon Draco Meteor 140S
  Physical coverage: Fighting Superpower 120P, Ground Earthquake 100P, Fairy Play Rough 90P, Flying Fly 90 (charge)P, Dark Fling 80P, Rock Rock Slide 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Flying Hurricane 120S, Water Hydro Pump 120S, Electric Thunder 120S
  Setup: Amnesia, Calm Mind, Dragon Dance, Work Up
  Reliable recovery: Rest, Roost
  Removal: Defog
  Phazing: Dragon Tail, Roar
  Status: Glare, Thunder Wave, Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Light Screen, Protect, Safeguard, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Emboar-Mega** — forme, **UU**, tier source: override
  Fire/Fighting | BST 628 (110/148/75/110/110/75)
  Abilities: Mold Breaker (fixed by the forme)
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 395/434, SpA 319/350, Spe 249/273
  Held item: **Emboarite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Emboar (PU), pre-Mega abilities: Blaze / Reckless
  STAB: Fire Overheat 140S · Fighting Focus Punch 150P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Hard Press 100P, Electric Wild Charge 90P, Dark Fling 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Water Scald 80S, Normal Tera Blast 80S, Poison Smog 30S, Ground Mud-Slap 20S
  Setup: Bulk Up, Defense Curl, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Priority: Sucker Punch 80P Dark (+1)
  Phazing: Roar
  Status: Toxic, Will-O-Wisp, Yawn
  Trapping: Block
  Weather/terrain: Sunny Day
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Enamorus** — species, **UU**, tier source: imported (natdex)
  Fairy/Flying | BST 580 (74/115/70/135/80/106)
  Abilities: Cute Charm / Contrary
  Engine stats @252 (neutral/positive): Cute Charm: Atk 329/361, SpA 369/405, Spe 311/342 — Contrary: Atk 329/361, SpA 369/405, Spe 311/342
  Held item: **free**
  STAB: Fairy Misty Explosion 100S · Flying Fly 90 (charge)P
  Physical coverage: Dragon Outrage 120P, Fighting Superpower 120P, Normal Take Down 90P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Ghost Astonish 30P
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Fire Mystical Fire 75S
  Setup: Agility, Calm Mind, Iron Defense
  Reliable recovery: Rest
  Drain/unreliable: Draining Kiss
  Weather/terrain: Grassy Terrain, Misty Terrain, Rain Dance, Sunny Day
  Utility: Healing Wish, Protect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Excadrill** — species, **UU**, tier source: imported (natdex)
  Ground/Steel | BST 508 (110/135/60/50/65/88)
  Abilities: Sand Rush / Sand Force / Mold Breaker
  Engine stats @252 (neutral/positive): Sand Rush: Atk 369/405, SpA 199/218, Spe 275/302 — Sand Force: Atk 369/405, SpA 199/218, Spe 275/302 — Mold Breaker: Atk 369/405, SpA 199/218, Spe 275/302
  Held item: **free**
  STAB: Ground Earthquake 100P · Steel Iron Head 80P
  Physical coverage: Normal Skull Bash 130P, Poison Poison Jab 80P, Fighting Submission 80P, Dark Throat Chop 80P, Bug X-Scissor 80P, Rock Rock Blast 25x2-5P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Bomb 90S, Normal Tera Blast 80S
  Setup: Hone Claws, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Removal: Rapid Spin
  Status: Toxic
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute

**Gardevoir-Mega** — forme, **UU**, tier source: imported (natdex)
  Psychic/Fairy | BST 618 (68/85/65/165/135/100)
  Abilities: Pixilate (fixed by the forme)
  Engine stats @252 (neutral/positive): Pixilate: Atk 269/295, SpA 429/471, Spe 299/328
  Held item: **Gardevoirite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Gardevoir (RU), pre-Mega abilities: Synchronize / Trace / Telepathy
  STAB: Psychic Future Sight 120S · Fairy Hyper Voice 117S
  Physical coverage: Dark Fling 80P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Ghost Shadow Sneak 40P
  Special coverage: Fighting Focus Blast 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S, Bug Signal Beam 75S
  Setup: Calm Mind, Defense Curl
  Reliable recovery: Rest
  Drain/unreliable: Draining Kiss, Dream Eater
  Priority: Shadow Sneak 40P Ghost (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Teleport
  Status: Hypnosis, Sing, Thunder Wave, Toxic, Will-O-Wisp
  Cleric/support: Heal Bell, Life Dew, Wish
  Trapping: Mean Look
  Weather/terrain: Misty Terrain, Psychic Terrain, Rain Dance, Sunny Day
  Utility: Destiny Bond, Disable, Encore, Gravity, Healing Wish, Knock Off, Light Screen, Magic Coat, Memento, Pain Split, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room

**Gengar** — species, **UU**, tier source: imported (natdex)
  Ghost/Poison | BST 500 (60/65/60/130/75/110)
  Abilities: Cursed Body / Levitate
  Engine stats @252 (neutral/positive): Cursed Body: Atk 229/251, SpA 359/394, Spe 319/350 — Levitate: Atk 229/251, SpA 359/394, Spe 319/350
  Held item: **free**
  STAB: Ghost Shadow Ball 80S · Poison Sludge Wave 95S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Dark Foul Play 95P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Psychic Dream Eater 100S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S
  Setup: Nasty Plot
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch, Dream Eater, Giga Drain, Mega Drain
  Priority: Sucker Punch 80P Dark (+1)
  Hazards: Toxic Spikes
  Status: Hypnosis, Thunder Wave, Toxic, Will-O-Wisp
  Trapping: Mean Look
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Clear Smog, Destiny Bond, Disable, Encore, Haze, Knock Off, Pain Split, Perish Song, Protect, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room

**Glimmora** — species, **UU**, tier source: imported (natdex)
  Rock/Poison | BST 525 (83/55/90/130/81/86)
  Abilities: Toxic Debris / Corrosion
  Engine stats @252 (neutral/positive): Toxic Debris: Atk 209/229, SpA 359/394, Spe 271/298 — Corrosion: Atk 209/229, SpA 359/394, Spe 271/298
  Held item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Poison Sludge Wave 95S
  Physical coverage: Normal Explosion 250P, Ground Sand Tomb 35P
  Special coverage: Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Normal Tera Blast 80S
  Setup: Acid Armor, Harden, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Hazards: Spikes, Stealth Rock, Toxic Spikes
  Removal: Mortal Spin
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Light Screen, Memento, Protect, Reflect, Substitute
  Notable: Substitute

**Goodra-Hisui** — species, **UU**, tier source: imported (natdex)
  Steel/Dragon | BST 600 (80/100/100/110/150/60)
  Abilities: Sap Sipper / Shell Armor / Gooey
  Engine stats @252 (neutral/positive): Sap Sipper: Atk 299/328, SpA 319/350, Spe 219/240 — Shell Armor: Atk 299/328, SpA 319/350, Spe 219/240 — Gooey: Atk 299/328, SpA 319/350, Spe 219/240
  Held item: **free**
  STAB: Steel Steel Beam 140S · Dragon Draco Meteor 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Grass Power Whip 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Poison Sludge Wave 95S
  Setup: Acid Armor, Shelter
  Reliable recovery: Rest
  Drain/unreliable: Absorb
  Priority: Feint 50P Normal (+2)
  Phazing: Dragon Tail
  Status: Toxic
  Cleric/support: Life Dew
  Weather/terrain: Hail, Rain Dance, Sandstorm, Sunny Day
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute

**Gyarados** — species, **UU**, tier source: override
  Water/Flying | BST 540 (95/125/79/60/100/81)
  Abilities: Intimidate / Moxie
  Engine stats @252 (neutral/positive): Intimidate: Atk 349/383, SpA 219/240, Spe 261/287 — Moxie: Atk 349/383, SpA 219/240, Spe 261/287
  Held item: **free**
  STAB: Water Aqua Tail 90P · Flying Bounce 85 (charge)P
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Grass Power Whip 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S, Normal Uproar 90S, Dark Dark Pulse 80S
  Setup: Dragon Dance
  Reliable recovery: Rest
  Phazing: Dragon Tail, Roar
  Status: Thunder Wave, Toxic
  Weather/terrain: Hail, Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Reflect, Substitute, Taunt
  Notable: Taunt, Substitute

**Hatterene** — species, **UU**, tier source: override
  Psychic/Fairy | BST 510 (57/90/95/136/103/29)
  Abilities: Healer / Anticipation / Magic Bounce
  Engine stats @252 (neutral/positive): Healer: Atk 279/306, SpA 371/408, Spe 157/172 — Anticipation: Atk 279/306, SpA 371/408, Spe 157/172 — Magic Bounce: Atk 279/306, SpA 371/408, Spe 157/172
  Held item: **free**
  STAB: Psychic Future Sight 120S · Fairy Misty Explosion 100S
  Physical coverage: Grass Power Whip 120P, Normal Facade 70P, Ghost Shadow Claw 70P, Dark Brutal Swing 60P, Electric Nuzzle 20P
  Special coverage: Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Fire Mystical Fire 75S
  Setup: Agility, Calm Mind, Swords Dance
  Reliable recovery: Rest
  Drain/unreliable: Draining Kiss, Giga Drain
  Pivot: Baton Pass
  Status: Nuzzle, Thunder Wave
  Cleric/support: Aromatherapy, Life Dew
  Weather/terrain: Misty Terrain, Psychic Terrain
  Utility: Gravity, Healing Wish, Light Screen, Pain Split, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Baton Pass, Trick Room

**Hawlucha** — species, **UU**, tier source: override
  Fighting/Flying | BST 500 (78/92/75/74/63/118)
  Abilities: Limber / Unburden / Mold Breaker
  Engine stats @252 (neutral/positive): Limber: Atk 283/311, SpA 247/271, Spe 335/368 — Unburden: Atk 283/311, SpA 247/271, Spe 335/368 — Mold Breaker: Atk 283/311, SpA 247/271, Spe 335/368
  Held item: **free**
  STAB: Fighting Focus Punch 150P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Last Resort 140P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Steel Iron Head 80P, Bug Lunge 80P
  Special coverage: Normal Uproar 90S, Grass Grass Knot 60S
  Setup: Agility, Bulk Up, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest, Roost
  Drain/unreliable: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2)
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Trapping: Mean Look
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Encore, Protect, Substitute, Tailwind, Taunt
  Notable: Encore, Taunt, Substitute, Baton Pass, Tailwind

**Haxorus** — species, **UU**, tier source: imported (natdex)
  Dragon | BST 540 (76/147/90/60/70/97)
  Abilities: Rivalry / Mold Breaker / Unnerve
  Engine stats @252 (neutral/positive): Rivalry: Atk 393/432, SpA 219/240, Spe 293/322 — Mold Breaker: Atk 393/432, SpA 219/240, Spe 293/322 — Unnerve: Atk 393/432, SpA 219/240, Spe 293/322
  Held item: **free**
  STAB: Dragon Outrage 120P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Bug First Impression 90P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Tera Blast 80S, Grass Grass Knot 60S, Fire Incinerate 60S, Electric Shock Wave 60S
  Setup: Dragon Dance, Harden, Hone Claws, Swords Dance
  Reliable recovery: Rest
  Priority: First Impression 90P Bug (+2)
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Heracross-Mega** — forme, **UU**, tier source: imported (natdex)
  Bug/Fighting | BST 600 (80/185/115/40/105/75)
  Abilities: Skill Link (fixed by the forme)
  Engine stats @252 (neutral/positive): Skill Link: Atk 469/515, SpA 179/196, Spe 249/273
  Held item: **Heracronite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Heracross (NU), pre-Mega abilities: Swarm / Guts / Moxie
  STAB: Bug Megahorn 120P · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Fling 80P, Grass Bullet Seed 25x2-5P, Ghost Shadow Claw 70P
  Special coverage: Normal Tera Blast 80S, Poison Venoshock 65S
  Setup: Bulk Up, Harden, Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Vacuum Wave 40S Fighting (+1)
  Hazards: Spikes
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute

**Hippowdon** — species, **UU**, tier source: imported (natdex)
  Ground | BST 525 (108/112/118/68/72/47)
  Abilities: Sand Stream / Sand Force
  Engine stats @252 (neutral/positive): Sand Stream: Atk 323/355, SpA 235/258, Spe 193/212 — Sand Force: Atk 323/355, SpA 235/258, Spe 193/212
  Held item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Fighting Superpower 120P, Rock Stone Edge 100P, Dark Crunch 80P, Fire Fire Fang 65P
  Special coverage: Rock Weather Ball 100S, Water Muddy Water 95S, Normal Hyper Voice 90S
  Setup: Amnesia
  Reliable recovery: Rest, Slack Off
  Hazards: Stealth Rock
  Phazing: Roar, Whirlwind
  Status: Toxic, Yawn
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute

**Hydrapple** — species, **UU**, tier source: imported (natdex)
  Grass/Dragon | BST 540 (106/80/110/120/80/44)
  Abilities: Supersweet Syrup / Regenerator / Sticky Hold
  Engine stats @252 (neutral/positive): Supersweet Syrup: Atk 259/284, SpA 339/372, Spe 187/205 — Regenerator: Atk 259/284, SpA 339/372, Spe 187/205 — Sticky Hold: Atk 259/284, SpA 339/372, Spe 187/205
  Held item: **free**
  STAB: Grass Leaf Storm 140S · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Fighting Body Press 80P, Dark Sucker Punch 80P, Bug Bug Bite 60P, Steel Heavy Slam 40P
  Special coverage: Water Hydro Pump 120S, Ground Earth Power 90S, Bug Pollen Puff 90S, Normal Uproar 90S
  Setup: Defense Curl, Growth, Nasty Plot, Withdraw
  Reliable recovery: Recover, Rest
  Drain/unreliable: Giga Drain
  Priority: Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1)
  Phazing: Dragon Tail
  Status: Yawn
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Protect, Reflect, Substitute
  Notable: Substitute

**Hydreigon** — species, **UU**, tier source: imported (natdex)
  Dark/Dragon | BST 600 (92/105/90/125/90/98)
  Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 309/339, SpA 349/383, Spe 295/324
  Held item: **free**
  STAB: Dark Crunch 80P · Dragon Draco Meteor 140S
  Physical coverage: Rock Head Smash 150P, Fighting Superpower 120P, Flying Acrobatics 110P, Normal Return 102P, Ground Earthquake 100P, Steel Iron Tail 100P
  Special coverage: Poison Belch 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Ground Earth Power 90S, Normal Hyper Voice 90S
  Setup: Dragon Dance, Nasty Plot, Work Up
  Reliable recovery: Rest, Roost
  Hazards: Stealth Rock
  Removal: Defog
  Pivot: U-turn
  Phazing: Dragon Tail, Roar
  Status: Thunder Wave, Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Reflect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Iron Boulder** — species, **UU**, tier source: imported (natdex)
  Rock/Psychic | BST 590 (90/120/80/68/108/124)
  Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 339/372, SpA 235/258, Spe 347/381
  Held item: **free**
  STAB: Rock Stone Edge 100P · Psychic Zen Headbutt 80P
  Physical coverage: Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Ground Earthquake 100P, Electric Wild Charge 90P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S
  Setup: Agility, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Priority: Quick Attack 40P Normal (+1)
  Weather/terrain: Electric Terrain, Sandstorm
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Iron Crown** — species, **UU**, tier source: override
  Steel/Psychic | BST 590 (90/72/100/122/108/98)
  Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 243/267, SpA 343/377, Spe 295/324
  Held item: **free**
  STAB: Steel Steel Beam 140S · Psychic Future Sight 120S
  Physical coverage: Grass Solar Blade 125 (charge)P, Normal Double-Edge 120P, Electric Supercell Slam 100P, Fighting Sacred Sword 90P, Bug X-Scissor 80P, Ground Bulldoze 60P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Flying Air Slash 75S, Electric Volt Switch 70S
  Setup: Agility, Calm Mind, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Pivot: Volt Switch
  Weather/terrain: Electric Terrain
  Utility: Gravity, Protect, Substitute
  Notable: Substitute

**Iron Leaves** — species, **UU**, tier source: imported (natdex)
  Grass/Psychic | BST 590 (90/130/88/70/108/104)
  Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 359/394, SpA 239/262, Spe 307/337
  Held item: **free**
  STAB: Grass Solar Blade 125 (charge)P · Psychic Psyblade 80P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Electric Wild Charge 90P, Dark Throat Chop 80P, Steel Smart Strike 70P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Flying Air Slash 75S
  Setup: Agility, Calm Mind, Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Giga Drain
  Priority: Quick Attack 40P Normal (+1)
  Weather/terrain: Electric Terrain, Grassy Terrain, Psychic Terrain
  Utility: Gravity, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Iron Treads** — species, **UU**, tier source: override
  Ground/Steel | BST 570 (90/112/120/72/70/106)
  Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 323/355, SpA 243/267, Spe 311/342
  Held item: **free**
  STAB: Ground Earthquake 100P · Steel Steel Beam 140S
  Physical coverage: Normal Double-Edge 120P, Bug Megahorn 120P, Rock Stone Edge 100P, Electric Supercell Slam 100P, Fighting Body Press 80P, Ice Ice Spinner 80P
  Special coverage: Electric Thunder 120S, Normal Tera Blast 80S
  Setup: Defense Curl, Iron Defense
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Removal: Rapid Spin
  Pivot: Volt Switch
  Weather/terrain: Electric Terrain, Sandstorm
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute

**Jirachi** — species, **UU**, tier source: imported (natdex)
  Steel/Psychic | BST 600 (100/100/100/100/100/100)
  Abilities: Serene Grace
  Engine stats @252 (neutral/positive): Serene Grace: Atk 299/328, SpA 299/328, Spe 299/328
  Held item: **free**
  STAB: Steel Doom Desire 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Fighting Dynamic Punch 100P, Fairy Play Rough 90P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Dragon Draco Meteor 140S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Fairy Moonblast 95S, Fighting Aura Sphere 90S, Grass Energy Ball 90S
  Setup: Amnesia, Calm Mind, Cosmic Power, Defense Curl, Iron Defense
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch, Dream Eater
  Hazards: Stealth Rock
  Pivot: Baton Pass, U-turn
  Status: Thunder Wave, Toxic
  Cleric/support: Life Dew, Wish
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Encore, Gravity, Healing Wish, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Encore, Substitute, Baton Pass, Trick Room

**Keldeo** — species, **UU**, tier source: imported (natdex)
  Water/Fighting | BST 580 (91/72/90/129/90/108)
  Abilities: Justified
  Engine stats @252 (neutral/positive): Justified: Atk 243/267, SpA 357/392, Spe 315/346
  Held item: **free**
  STAB: Water Hydro Pump 120S · Fighting Focus Blast 120S
  Physical coverage: Normal Last Resort 140P, Bug Megahorn 120P, Rock Stone Edge 100P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P, Steel Smart Strike 70P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Ice Icy Wind 55S
  Setup: Calm Mind, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Upper Hand 65P Fighting (+3), Aqua Jet 40P Water (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Baton Pass, Flip Turn
  Phazing: Roar
  Status: Toxic
  Weather/terrain: Hail, Rain Dance, Sunny Day
  Utility: Pain Split, Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Taunt, Substitute, Baton Pass

**Latias-Mega** — forme, **UU**, tier source: imported (natdex)
  Dragon/Psychic | BST 700 (80/100/120/140/150/110)
  Abilities: Levitate (fixed by the forme)
  Engine stats @252 (neutral/positive): Levitate: Atk 299/328, SpA 379/416, Spe 319/350
  Held item: **Latiasite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Latias (RU), pre-Mega abilities: Levitate
  STAB: Dragon Draco Meteor 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Water Liquidation 85P, Dark Sucker Punch 80P, Ghost Shadow Claw 70P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Water Surf 95S, Fighting Aura Sphere 90S, Fairy Alluring Voice 80S
  Setup: Agility, Calm Mind, Dragon Dance, Hone Claws
  Reliable recovery: Recover, Rest, Roost
  Drain/unreliable: Draining Kiss, Dream Eater
  Priority: Sucker Punch 80P Dark (+1)
  Removal: Defog
  Pivot: Baton Pass
  Phazing: Roar
  Status: Thunder Wave, Toxic
  Cleric/support: Wish
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Healing Wish, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Tailwind, Trick
  Notable: Trick, Substitute, Baton Pass, Tailwind

**Lilligant-Hisui** — species, **UU**, tier source: imported (natdex)
  Grass/Fighting | BST 480 (70/105/75/50/75/105)
  Abilities: Chlorophyll / Hustle / Leaf Guard
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 309/339, SpA 199/218, Spe 309/339 — Hustle: Atk 463/508, SpA 199/218, Spe 309/339 — Leaf Guard: Atk 309/339, SpA 199/218, Spe 309/339
  Held item: **free**
  STAB: Grass Solar Blade 125 (charge)P · Fighting Axe Kick 120P
  Physical coverage: Normal Mega Kick 120P, Flying Acrobatics 110P, Ice Ice Spinner 80P, Poison Poison Jab 80P
  Special coverage: Flying Hurricane 120S, Psychic Dream Eater 100S, Bug Pollen Puff 90S, Fairy Alluring Voice 80S, Normal Tera Blast 80S
  Setup: Growth, Quiver Dance, Swords Dance, Victory Dance
  Reliable recovery: Rest
  Drain/unreliable: Absorb, Dream Eater, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1), Upper Hand 65P Fighting (+3), Vacuum Wave 40S Fighting (+1)
  Removal: Defog
  Status: Grass Whistle, Sleep Powder, Stun Spore, Toxic
  Cleric/support: Aromatherapy, Heal Bell
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Encore, Healing Wish, Leech Seed, Light Screen, Protect, Safeguard, Substitute
  Notable: Encore, Substitute

**Mamoswine** — species, **UU**, tier source: imported (natdex)
  Ice/Ground | BST 530 (110/130/80/70/60/80)
  Abilities: Oblivious / Snow Cloak / Thick Fat
  Engine stats @252 (neutral/positive): Oblivious: Atk 359/394, SpA 239/262, Spe 259/284 — Snow Cloak: Atk 359/394, SpA 239/262, Spe 259/284 — Thick Fat: Atk 359/394, SpA 239/262, Spe 259/284
  Held item: **free**
  STAB: Ice Icicle Crash 85P · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Fighting Superpower 120P, Rock Stone Edge 100P, Dark Throat Chop 80P, Grass Trailblaze 50P
  Special coverage: Normal Tera Blast 80S, Rock Ancient Power 60S
  Setup: Amnesia, Defense Curl
  Reliable recovery: Rest
  Priority: Ice Shard 40P Ice (+1)
  Hazards: Stealth Rock
  Phazing: Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Hail, Rain Dance, Sandstorm, Snowscape
  Utility: Detect, Haze, Knock Off, Light Screen, Protect, Reflect, Substitute
  Notable: Knock Off, Substitute

**Meganium-Mega** — forme, **UU**, tier source: override
  Grass/Fairy | BST 625 (80/92/115/143/115/80)
  Abilities: Mega Sol (fixed by the forme)
  Engine stats @252 (neutral/positive): Mega Sol: Atk 283/311, SpA 385/423, Spe 259/284
  Held item: **Meganiumite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Meganium (ZU), pre-Mega abilities: Overgrow / Leaf Guard
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fighting Body Press 80P, Psychic Zen Headbutt 80P
  Special coverage: Normal Wring Out 120S, Fire Weather Ball 100S, Rock Ancient Power 60S, Ground Mud-Slap 20S
  Setup: Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Giga Drain
  Priority: Grassy Glide 70P Grass (+1)
  Phazing: Dragon Tail
  Status: Grass Whistle, Poison Powder, Toxic
  Cleric/support: Aromatherapy
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Detect, Encore, Knock Off, Leech Seed, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute
  Notable: Knock Off, Encore, Substitute

**Metagross** — species, **UU**, tier source: override
  Steel/Psychic | BST 600 (80/135/130/95/90/70)
  Abilities: Clear Body / Light Metal
  Engine stats @252 (neutral/positive): Clear Body: Atk 369/405, SpA 289/317, Spe 239/262 — Light Metal: Atk 369/405, SpA 289/317, Spe 239/262
  Held item: **free**
  STAB: Steel Steel Beam 140S · Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Ground Earthquake 100P, Rock Stone Edge 100P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Rock Meteor Beam 120 (charge)S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Grass Grass Knot 60S
  Setup: Agility, Cosmic Power, Defense Curl, Hone Claws, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Priority: Bullet Punch 40P Steel (+1)
  Hazards: Stealth Rock
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Gravity, Knock Off, Light Screen, Protect, Reflect, Substitute, Trick
  Notable: Knock Off, Trick, Substitute

**Mew** — species, **UU**, tier source: imported (natdex)
  Psychic | BST 600 (100/100/100/100/100/100)
  Abilities: Synchronize
  Engine stats @252 (neutral/positive): Synchronize: Atk 299/328, SpA 299/328, Spe 299/328
  Held item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Flying Sky Attack 140 (charge)P, Steel Steel Roller 130P, Grass Solar Blade 125 (charge)P, Fire Flare Blitz 120P
  Special coverage: Dragon Draco Meteor 140S, Grass Leaf Storm 140S, Fire Overheat 140S, Steel Steel Beam 140S, Ice Blizzard 120S, Fighting Focus Blast 120S
  Setup: Agility, Amnesia, Barrier, Bulk Up, Calm Mind, Charge, Cosmic Power, Defense Curl, Dragon Dance, Hone Claws, Iron Defense, Nasty Plot, Rock Polish, Swords Dance, Work Up
  Reliable recovery: Rest, Roost, Soft-Boiled
  Drain/unreliable: Drain Punch, Draining Kiss, Dream Eater, Giga Drain, Leech Life, Mega Drain
  Priority: Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1), Upper Hand 65P Fighting (+3), Fake Out 40P Normal (+3)
  Hazards: Spikes, Stealth Rock, Toxic Spikes
  Removal: Defog
  Pivot: Baton Pass, Flip Turn, Teleport, U-turn, Volt Switch
  Phazing: Dragon Tail, Roar, Whirlwind
  Status: Hypnosis, Thunder Wave, Toxic, Will-O-Wisp
  Cleric/support: Heal Bell, Life Dew
  Trapping: Block
  Weather/terrain: Electric Terrain, Grassy Terrain, Hail, Misty Terrain, Psychic Terrain, Rain Dance, Sandstorm, Snowscape, Sunny Day
  Utility: Aurora Veil, Detect, Encore, Gravity, Haze, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Safeguard, Substitute, Tailwind, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Baton Pass, Trick Room, Tailwind

**Mienshao** — species, **UU**, tier source: imported (natdex)
  Fighting | BST 510 (65/125/60/95/60/105)
  Abilities: Inner Focus / Regenerator / Reckless
  Engine stats @252 (neutral/positive): Inner Focus: Atk 349/383, SpA 289/317, Spe 309/339 — Regenerator: Atk 349/383, SpA 289/317, Spe 309/339 — Reckless: Atk 349/383, SpA 289/317, Spe 309/339
  Held item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Fire Blaze Kick 85P
  Special coverage: Normal Tera Blast 80S, Grass Grass Knot 60S
  Setup: Agility, Bulk Up, Calm Mind, Hone Claws, Meditate, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3), Vacuum Wave 40S Fighting (+1)
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Reflect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass

**Moltres** — species, **UU**, tier source: override
  Fire/Flying | BST 580 (90/100/90/125/85/90)
  Abilities: Pressure / Flame Body
  Engine stats @252 (neutral/positive): Pressure: Atk 299/328, SpA 349/383, Spe 279/306 — Flame Body: Atk 299/328, SpA 349/383, Spe 279/306
  Held item: **free**
  STAB: Fire Overheat 140S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Fighting Rock Smash 40P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Extrasensory 80S, Normal Tera Blast 80S, Ground Scorching Sands 70S, Rock Ancient Power 60S, Ghost Ominous Wind 60S
  Setup: Agility
  Reliable recovery: Rest, Roost
  Removal: Defog
  Pivot: U-turn
  Phazing: Roar, Whirlwind
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Protect, Reflect, Safeguard, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Moltres-Galar** — species, **UU**, tier source: imported (natdex)
  Dark/Flying | BST 580 (90/85/90/100/125/90)
  Abilities: Berserk
  Engine stats @252 (neutral/positive): Berserk: Atk 269/295, SpA 299/328, Spe 279/306
  Held item: **free**
  STAB: Dark Foul Play 95P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Fire Flare Blitz 120P, Steel Steel Wing 70P, Bug U-turn 70P, Fighting Rock Smash 40P
  Special coverage: Fire Overheat 140S, Grass Solar Beam 120 (charge)S, Normal Hyper Voice 90S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S, Ground Scorching Sands 70S
  Setup: Agility, Nasty Plot
  Reliable recovery: Rest, Roost
  Priority: Sucker Punch 80P Dark (+1)
  Removal: Defog
  Pivot: U-turn
  Phazing: Roar, Whirlwind
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Memento, Pain Split, Protect, Reflect, Safeguard, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Okidogi** — species, **UU**, tier source: override
  Poison/Fighting | BST 555 (88/128/115/58/86/80)
  Abilities: Toxic Chain / Guard Dog
  Engine stats @252 (neutral/positive): Toxic Chain: Atk 355/390, SpA 215/236, Spe 259/284 — Guard Dog: Atk 355/390, SpA 215/236, Spe 259/284
  Held item: **free**
  STAB: Poison Gunk Shot 120P · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Steel Hard Press 100P, Ground Dig 100 (charge)P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Normal Uproar 90S, Dark Snarl 55S
  Setup: Bulk Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Priority: Upper Hand 65P Fighting (+3)
  Phazing: Roar
  Status: Toxic
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Pecharunt** — species, **UU**, tier source: override
  Poison/Ghost | BST 600 (88/88/160/88/88/88)
  Abilities: Poison Puppeteer
  Engine stats @252 (neutral/positive): Poison Puppeteer: Atk 275/302, SpA 275/302, Spe 275/302
  Held item: **free**
  STAB: Poison Gunk Shot 120P · Ghost Poltergeist 110P
  Physical coverage: Dark Foul Play 95P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S
  Setup: Defense Curl, Nasty Plot, Withdraw
  Reliable recovery: Recover, Rest
  Pivot: Parting Shot
  Status: Toxic
  Trapping: Mean Look
  Utility: Destiny Bond, Memento, Protect, Substitute
  Notable: Substitute

**Polteageist** — species, **UU**, tier source: imported (natdex)
  Ghost | BST 508 (60/65/65/134/114/70)
  Abilities: Weak Armor / Cursed Body
  Engine stats @252 (neutral/positive): Weak Armor: Atk 229/251, SpA 367/403, Spe 239/262 — Cursed Body: Atk 229/251, SpA 367/403, Spe 239/262
  Held item: **free**
  STAB: Ghost Shadow Ball 80S
  Physical coverage: Normal Self-Destruct 200P, Dark Foul Play 95P
  Special coverage: Psychic Psychic 90S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Giga Drain 75S
  Setup: Calm Mind, Nasty Plot, Shell Smash, Withdraw
  Reliable recovery: Rest
  Drain/unreliable: Giga Drain, Mega Drain
  Priority: Sucker Punch 80P Dark (+1)
  Pivot: Baton Pass
  Status: Will-O-Wisp
  Cleric/support: Aromatherapy
  Utility: Light Screen, Memento, Pain Split, Protect, Reflect, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Baton Pass, Trick Room

**Porygon-Z** — species, **UU**, tier source: imported (natdex)
  Normal | BST 535 (85/80/70/135/75/90)
  Abilities: Adaptability / Download / Analytic
  Engine stats @252 (neutral/positive): Adaptability: Atk 259/284, SpA 369/405, Spe 279/306 — Download: Atk 259/284, SpA 369/405, Spe 279/306 — Analytic: Atk 259/284, SpA 369/405, Spe 279/306
  Held item: **free**
  STAB: Normal Uproar 90S
  Physical coverage: Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Flying Aerial Ace 60P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S
  Setup: Agility, Barrier, Charge, Defense Curl, Nasty Plot, Sharpen
  Reliable recovery: Recover, Rest
  Drain/unreliable: Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Gravity, Magic Coat, Pain Split, Protect, Reflect, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

**Primarina** — species, **UU**, tier source: imported (natdex)
  Water/Fairy | BST 530 (80/74/74/126/116/60)
  Abilities: Torrent / Liquid Voice
  Engine stats @252 (neutral/positive): Torrent: Atk 247/271, SpA 351/386, Spe 219/240 — Liquid Voice: Atk 247/271, SpA 351/386, Spe 219/240
  Held item: **free**
  STAB: Water Hydro Pump 120S · Fairy Misty Explosion 100S
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Steel Iron Tail 100P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Psychic Psychic 90S, Ghost Shadow Ball 80S
  Setup: Amnesia, Calm Mind, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Draining Kiss
  Priority: Aqua Jet 40P Water (+1)
  Pivot: Flip Turn
  Status: Sing, Toxic
  Cleric/support: Life Dew
  Weather/terrain: Hail, Misty Terrain, Rain Dance, Snowscape
  Utility: Encore, Haze, Light Screen, Magic Coat, Perish Song, Protect, Reflect, Substitute
  Notable: Encore, Substitute

**Pyroar-Mega** — forme, **UU**, tier source: override
  Fire/Normal | BST 607 (86/88/92/129/86/126)
  Abilities: Fire Mane (fixed by the forme)
  Engine stats @252 (neutral/positive): Fire Mane: Atk 275/302, SpA 357/392, Spe 351/386
  Held item: **Pyroarite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Pyroar (ZU), pre-Mega abilities: Rivalry / Unnerve / Moxie
  STAB: Fire Overheat 140S · Normal Double-Edge 120P
  Physical coverage: Steel Iron Tail 100P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Dark Crunch 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Dark Dark Pulse 80S, Ground Mud-Slap 20S
  Setup: Work Up
  Reliable recovery: Rest
  Phazing: Roar
  Status: Toxic, Will-O-Wisp, Yawn
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Quaquaval** — species, **UU**, tier source: imported (natdex)
  Water/Fighting | BST 530 (85/120/80/85/75/85)
  Abilities: Torrent / Moxie
  Engine stats @252 (neutral/positive): Torrent: Atk 339/372, SpA 269/295, Spe 269/295 — Moxie: Atk 339/372, SpA 269/295, Spe 269/295
  Held item: **free**
  STAB: Water Hydro Pump 120S · Fighting Close Combat 120P
  Physical coverage: Normal Last Resort 140P, Flying Brave Bird 120P, Ice Ice Spinner 80P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Flying Hurricane 120S, Normal Tera Blast 80S, Ice Icy Wind 55S, Fairy Disarming Voice 40S
  Setup: Agility, Bulk Up, Swords Dance, Work Up
  Reliable recovery: Rest, Roost
  Priority: Upper Hand 65P Fighting (+3), Aqua Jet 40P Water (+1)
  Removal: Rapid Spin
  Pivot: Baton Pass, Flip Turn, U-turn
  Weather/terrain: Misty Terrain, Rain Dance
  Utility: Detect, Encore, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Encore, Taunt, Substitute, Baton Pass

**Raichu-Mega-Y** — forme, **UU**, tier source: override
  Electric | BST 585 (60/100/55/160/80/130)
  Abilities: No Guard (fixed by the forme)
  Engine stats @252 (neutral/positive): No Guard: Atk 299/328, SpA 419/460, Spe 359/394
  Held item: **Raichunite Y** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Raichu (ZU), pre-Mega abilities: Static / Lightning Rod
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Grass Grass Knot 60S
  Setup: Agility, Calm Mind, Charge, Defense Curl, Nasty Plot
  Reliable recovery: Rest
  Drain/unreliable: Draining Kiss
  Priority: Extreme Speed 80P Normal (+2), Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3)
  Pivot: Volt Switch
  Status: Nuzzle, Sing, Thunder Wave, Toxic, Yawn
  Cleric/support: Wish
  Weather/terrain: Electric Terrain, Rain Dance
  Utility: Detect, Encore, Knock Off, Light Screen, Protect, Reflect, Safeguard, Substitute
  Notable: Knock Off, Encore, Substitute

**Regieleki** — species, **UU**, tier source: override
  Electric | BST 580 (80/100/50/100/50/200)
  Abilities: Transistor
  Engine stats @252 (neutral/positive): Transistor: Atk 299/328, SpA 299/328, Spe 499/548
  Held item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Explosion 250P, Flying Acrobatics 110P, Dark Assurance 60P
  Special coverage: Normal Tera Blast 80S, Rock Ancient Power 60S
  Setup: Agility, Charge
  Reliable recovery: Rest
  Priority: Extreme Speed 80P Normal (+2)
  Removal: Rapid Spin
  Pivot: Volt Switch
  Status: Thunder Wave
  Weather/terrain: Electric Terrain, Rain Dance
  Utility: Light Screen, Protect, Reflect, Substitute
  Notable: Substitute

**Rotom-Wash** — species, **UU**, tier source: imported (natdex)
  Electric/Water | BST 520 (50/65/107/105/107/86)
  Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 229/251, SpA 309/339, Spe 271/298
  Held item: **free**
  STAB: Electric Thunder 120S · Water Hydro Pump 120S
  Physical coverage: Ghost Poltergeist 110P, Normal Return 102P, Dark Foul Play 95P
  Special coverage: Psychic Dream Eater 100S, Normal Hyper Voice 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Fairy Disarming Voice 40S
  Setup: Charge, Nasty Plot
  Reliable recovery: Rest
  Drain/unreliable: Dream Eater
  Priority: Sucker Punch 80P Dark (+1)
  Removal: Defog
  Pivot: Volt Switch
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Weather/terrain: Electric Terrain, Rain Dance, Sunny Day
  Utility: Light Screen, Pain Split, Protect, Reflect, Substitute, Trick
  Notable: Trick, Substitute

**Sableye-Mega** — forme, **UU**, tier source: imported (natdex)
  Dark/Ghost | BST 480 (50/85/125/85/115/20)
  Abilities: Magic Bounce (fixed by the forme)
  Engine stats @252 (neutral/positive): Magic Bounce: Atk 269/295, SpA 269/295, Spe 139/152
  Held item: **Sablenite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Sableye (ZU), pre-Mega abilities: Keen Eye / Stall / Prankster
  STAB: Dark Foul Play 95P · Ghost Poltergeist 110P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P, Psychic Zen Headbutt 80P
  Special coverage: Psychic Dream Eater 100S, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Rock Power Gem 80S, Normal Tera Blast 80S, Bug Signal Beam 75S
  Setup: Bulk Up, Calm Mind, Hone Claws, Nasty Plot
  Reliable recovery: Recover, Rest
  Drain/unreliable: Drain Punch, Dream Eater, Giga Drain
  Priority: Sucker Punch 80P Dark (+1), Feint 50P Normal (+2), Fake Out 40P Normal (+3), Shadow Sneak 40P Ghost (+1)
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Trapping: Mean Look
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Disable, Encore, Gravity, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Substitute, Taunt, Trick
  Notable: Knock Off, Trick, Encore, Taunt, Substitute

**Salamence** — species, **UU**, tier source: imported (natdex)
  Dragon/Flying | BST 600 (95/135/80/110/80/100)
  Abilities: Intimidate / Moxie
  Engine stats @252 (neutral/positive): Intimidate: Atk 369/405, SpA 319/350, Spe 299/328 — Moxie: Atk 369/405, SpA 319/350, Spe 299/328
  Held item: **free**
  STAB: Dragon Draco Meteor 140S · Flying Hurricane 120S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P
  Special coverage: Fire Fire Blast 120S, Water Hydro Pump 120S, Normal Hyper Voice 90S, Ghost Ominous Wind 60S, Ground Mud-Slap 20S
  Setup: Defense Curl, Dragon Dance, Hone Claws, Iron Defense
  Reliable recovery: Rest, Roost
  Removal: Defog
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Cleric/support: Wish
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Scizor** — species, **UU**, tier source: imported (natdex)
  Bug/Steel | BST 500 (70/130/100/55/80/65)
  Abilities: Swarm / Technician / Light Metal
  Engine stats @252 (neutral/positive): Swarm: Atk 359/394, SpA 209/229, Spe 229/251 — Technician: Atk 359/394, SpA 209/229, Spe 229/251 — Light Metal: Atk 359/394, SpA 209/229, Spe 229/251
  Held item: **free**
  STAB: Bug Lunge 80P · Steel Hard Press 100P
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Flying Acrobatics 110P, Poison Cross Poison 70P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Poison Venoshock 65S, Ghost Ominous Wind 60S, Fighting Vacuum Wave 40S
  Setup: Agility, Iron Defense, Swords Dance
  Reliable recovery: Rest, Roost
  Priority: Feint 50P Normal (+2), Bullet Punch 40P Steel (+1), Quick Attack 40P Normal (+1), Vacuum Wave 40S Fighting (+1)
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Knock Off, Light Screen, Protect, Safeguard, Substitute, Tailwind
  Notable: Knock Off, Substitute, Baton Pass, Tailwind

**Scolipede** — species, **UU**, tier source: imported (natdex)
  Bug/Poison | BST 485 (60/100/89/55/69/112)
  Abilities: Poison Point / Swarm / Speed Boost / Quick Feet
  Engine stats @252 (neutral/positive): Poison Point: Atk 299/328, SpA 209/229, Spe 323/355 — Swarm: Atk 299/328, SpA 209/229, Spe 323/355 — Speed Boost: Atk 299/328, SpA 209/229, Spe 323/355 — Quick Feet: Atk 299/328, SpA 209/229, Spe 323/355
  Held item: **free**
  STAB: Bug Megahorn 120P · Poison Poison Jab 80P
  Physical coverage: Steel Steel Roller 130P, Normal Double-Edge 120P, Fighting Superpower 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Dark Throat Chop 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Ghost Hex 65S, Normal Hidden Power 60S
  Setup: Agility, Defense Curl, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Hazards: Spikes, Toxic Spikes
  Pivot: Baton Pass
  Status: Toxic
  Weather/terrain: Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute, Baton Pass

**Scolipede-Mega** — forme, **UU**, tier source: override
  Bug/Poison | BST 585 (60/140/149/75/99/62)
  Abilities: Shell Armor (fixed by the forme)
  Engine stats @252 (neutral/positive): Shell Armor: Atk 379/416, SpA 249/273, Spe 223/245
  Held item: **Scolipite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Scolipede (UU), pre-Mega abilities: Poison Point / Swarm / Speed Boost / Quick Feet
  STAB: Bug Megahorn 120P · Poison Poison Jab 80P
  Physical coverage: Steel Steel Roller 130P, Normal Double-Edge 120P, Fighting Superpower 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Dark Throat Chop 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Ghost Hex 65S, Normal Hidden Power 60S
  Setup: Agility, Defense Curl, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Hazards: Spikes, Toxic Spikes
  Pivot: Baton Pass
  Status: Toxic
  Weather/terrain: Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute, Baton Pass

**Scrafty-Mega** — forme, **UU**, tier source: override
  Dark/Fighting | BST 588 (65/130/135/55/135/68)
  Abilities: Intimidate (fixed by the forme)
  Engine stats @252 (neutral/positive): Intimidate: Atk 359/394, SpA 209/229, Spe 235/258
  Held item: **Scraftinite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Scrafty (NU), pre-Mega abilities: Shed Skin / Moxie / Intimidate
  STAB: Dark Foul Play 95P · Fighting Focus Punch 150P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P
  Special coverage: Dragon Dragon Pulse 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Grass Grass Knot 60S, Fire Incinerate 60S
  Setup: Amnesia, Bulk Up, Dragon Dance, Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Fake Out 40P Normal (+3)
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Encore, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Encore, Taunt, Substitute

**Serperior** — species, **UU**, tier source: imported (natdex)
  Grass | BST 528 (75/75/95/75/95/113)
  Abilities: Overgrow / Contrary
  Engine stats @252 (neutral/positive): Overgrow: Atk 249/273, SpA 249/273, Spe 325/357 — Contrary: Atk 249/273, SpA 249/273, Spe 325/357
  Held item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Water Aqua Tail 90P, Dark Knock Off 65P, Flying Aerial Ace 60P
  Special coverage: Normal Wring Out 120S, Dragon Dragon Pulse 90S, Psychic Mirror Coat fixedS
  Setup: Calm Mind, Coil, Growth, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1)
  Removal: Defog
  Phazing: Dragon Tail
  Status: Glare, Toxic
  Cleric/support: Aromatherapy
  Trapping: Mean Look
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Knock Off, Leech Seed, Light Screen, Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Sharpedo-Mega** — forme, **UU**, tier source: imported (natdex)
  Water/Dark | BST 560 (70/140/70/110/65/105)
  Abilities: Strong Jaw (fixed by the forme)
  Engine stats @252 (neutral/positive): Strong Jaw: Atk 379/416, SpA 319/350, Spe 309/339
  Held item: **Sharpedonite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Sharpedo (RU), pre-Mega abilities: Rough Skin / Speed Boost
  STAB: Water Hydro Pump 120S · Dark Crunch 80P
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Ground Earthquake 100P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Rock Ancient Power 60S, Ground Mud-Slap 20S
  Setup: Agility
  Reliable recovery: Rest
  Priority: Feint 50P Normal (+2), Aqua Jet 40P Water (+1)
  Pivot: Flip Turn
  Phazing: Roar
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Destiny Bond, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Skarmory** — species, **UU**, tier source: imported (natdex)
  Steel/Flying | BST 465 (65/80/140/40/70/70)
  Abilities: Keen Eye / Sturdy / Weak Armor
  Engine stats @252 (neutral/positive): Keen Eye: Atk 259/284, SpA 179/196, Spe 239/262 — Sturdy: Atk 259/284, SpA 179/196, Spe 239/262 — Weak Armor: Atk 259/284, SpA 179/196, Spe 239/262
  Held item: **free**
  STAB: Steel Iron Head 80P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Fighting Body Press 80P, Ground Drill Run 80P, Bug X-Scissor 80P, Rock Rock Slide 75P, Dark Night Slash 70P
  Special coverage: Dark Dark Pulse 80S, Normal Tera Blast 80S, Ghost Ominous Wind 60S, Ice Icy Wind 55S, Dragon Twister 40S, Ground Mud-Slap 20S
  Setup: Agility, Autotomize, Iron Defense, Swords Dance
  Reliable recovery: Rest, Roost
  Priority: Feint 50P Normal (+2)
  Hazards: Spikes, Stealth Rock
  Removal: Defog
  Phazing: Roar, Whirlwind
  Status: Toxic
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Detect, Protect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Skarmory-Mega** — forme, **UU**, tier source: override
  Steel/Flying | BST 565 (65/140/110/40/100/110)
  Abilities: Stalwart (fixed by the forme)
  Engine stats @252 (neutral/positive): Stalwart: Atk 379/416, SpA 179/196, Spe 319/350
  Held item: **Skarmorite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Skarmory (UU), pre-Mega abilities: Keen Eye / Sturdy / Weak Armor
  STAB: Steel Iron Head 80P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Fighting Body Press 80P, Ground Drill Run 80P, Bug X-Scissor 80P, Rock Rock Slide 75P, Dark Night Slash 70P
  Special coverage: Dark Dark Pulse 80S, Normal Tera Blast 80S, Ghost Ominous Wind 60S, Ice Icy Wind 55S, Dragon Twister 40S, Ground Mud-Slap 20S
  Setup: Agility, Autotomize, Iron Defense, Swords Dance
  Reliable recovery: Rest, Roost
  Priority: Feint 50P Normal (+2)
  Hazards: Spikes, Stealth Rock
  Removal: Defog
  Phazing: Roar, Whirlwind
  Status: Toxic
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Detect, Protect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Slowbro** — species, **UU**, tier source: override
  Water/Psychic | BST 490 (95/75/110/100/80/30)
  Abilities: Oblivious / Own Tempo / Regenerator
  Engine stats @252 (neutral/positive): Oblivious: Atk 249/273, SpA 299/328, Spe 159/174 — Own Tempo: Atk 249/273, SpA 299/328, Spe 159/174 — Regenerator: Atk 249/273, SpA 299/328, Spe 159/174
  Held item: **free**
  STAB: Water Hydro Pump 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Ice Ice Punch 75P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Zap Cannon 120S, Ghost Shadow Ball 80S
  Setup: Amnesia, Calm Mind, Iron Defense, Nasty Plot, Withdraw
  Reliable recovery: Rest, Slack Off
  Drain/unreliable: Drain Punch, Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic, Yawn
  Trapping: Block
  Weather/terrain: Hail, Psychic Terrain, Rain Dance, Snowscape, Sunny Day
  Utility: Disable, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

**Slowbro-Mega** — forme, **UU**, tier source: imported (natdex)
  Water/Psychic | BST 590 (95/75/180/130/80/30)
  Abilities: Shell Armor (fixed by the forme)
  Engine stats @252 (neutral/positive): Shell Armor: Atk 249/273, SpA 359/394, Spe 159/174
  Held item: **Slowbronite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Slowbro (UU), pre-Mega abilities: Oblivious / Own Tempo / Regenerator
  STAB: Water Hydro Pump 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Ice Ice Punch 75P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Zap Cannon 120S, Ghost Shadow Ball 80S
  Setup: Amnesia, Calm Mind, Iron Defense, Nasty Plot, Withdraw
  Reliable recovery: Rest, Slack Off
  Drain/unreliable: Drain Punch, Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic, Yawn
  Trapping: Block
  Weather/terrain: Hail, Psychic Terrain, Rain Dance, Snowscape, Sunny Day
  Utility: Disable, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

**Slowking** — species, **UU**, tier source: imported (natdex)
  Water/Psychic | BST 490 (95/75/80/100/110/30)
  Abilities: Oblivious / Own Tempo / Regenerator
  Engine stats @252 (neutral/positive): Oblivious: Atk 249/273, SpA 299/328, Spe 159/174 — Own Tempo: Atk 249/273, SpA 299/328, Spe 159/174 — Regenerator: Atk 249/273, SpA 299/328, Spe 159/174
  Held item: **free**
  STAB: Water Hydro Pump 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Fire Fire Punch 75P
  Special coverage: Normal Trump Card 200S, Poison Belch 120S, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Zap Cannon 120S
  Setup: Amnesia, Calm Mind, Iron Defense, Nasty Plot
  Reliable recovery: Rest, Slack Off
  Drain/unreliable: Drain Punch, Dream Eater
  Pivot: Chilly Reception, Teleport
  Phazing: Dragon Tail
  Status: Thunder Wave, Toxic, Yawn
  Trapping: Block
  Weather/terrain: Chilly Reception, Hail, Psychic Terrain, Rain Dance, Snowscape, Sunny Day
  Utility: Disable, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

**Staraptor-Mega** — forme, **UU**, tier source: override
  Fighting/Flying | BST 585 (85/140/100/60/90/110)
  Abilities: Contrary (fixed by the forme)
  Engine stats @252 (neutral/positive): Contrary: Atk 379/416, SpA 219/240, Spe 319/350
  Held item: **Staraptite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Staraptor (NU), pre-Mega abilities: Intimidate / Reckless
  STAB: Fighting Close Combat 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Thief 60P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Normal Uproar 90S, Ghost Ominous Wind 60S, Bug Struggle Bug 50S, Dragon Twister 40S, Ground Mud-Slap 20S
  Setup: Agility, Work Up
  Reliable recovery: Rest, Roost
  Priority: Quick Attack 40P Normal (+1)
  Removal: Defog
  Pivot: U-turn
  Phazing: Whirlwind
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Protect, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Starmie-Mega** — forme, **UU**, tier source: override
  Water/Psychic | BST 620 (60/100/105/130/105/120)
  Abilities: Huge Power (fixed by the forme)
  Engine stats @252 (neutral/positive): Huge Power: Atk 598/656, SpA 359/394, Spe 339/372
  Held item: **Starminite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Starmie (NU), pre-Mega abilities: Illuminate / Natural Cure / Analytic
  STAB: Water Waterfall 80P · Psychic Psycho Cut 70P
  Physical coverage: Normal Skull Bash 130P, Ice Avalanche 60P, Rock Rollout 30P, Steel Gyro Ball 14P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Normal Tri Attack 80S
  Setup: Agility, Cosmic Power, Harden
  Reliable recovery: Recover, Rest
  Drain/unreliable: Dream Eater
  Removal: Rapid Spin
  Pivot: Flip Turn, Teleport
  Status: Thunder Wave, Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Gravity, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

**Swampert** — species, **UU**, tier source: imported (natdex)
  Water/Ground | BST 535 (100/110/90/85/90/60)
  Abilities: Torrent / Damp
  Engine stats @252 (neutral/positive): Torrent: Atk 319/350, SpA 269/295, Spe 219/240 — Damp: Atk 319/350, SpA 269/295, Spe 219/240
  Held item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Hard Press 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Uproar 90S, Rock Ancient Power 60S, Psychic Mirror Coat fixedS
  Setup: Amnesia, Barrier, Bulk Up, Defense Curl, Work Up
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Pivot: Flip Turn
  Phazing: Roar
  Status: Toxic, Yawn
  Weather/terrain: Hail, Rain Dance
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute

**Swampert-Mega** — forme, **UU**, tier source: imported (natdex)
  Water/Ground | BST 635 (100/150/110/95/110/70)
  Abilities: Swift Swim (fixed by the forme)
  Engine stats @252 (neutral/positive): Swift Swim: Atk 399/438, SpA 289/317, Spe 239/262
  Held item: **Swampertite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Swampert (UU), pre-Mega abilities: Torrent / Damp
  STAB: Water Aqua Tail 90P · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Hard Press 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Uproar 90S, Rock Ancient Power 60S, Psychic Mirror Coat fixedS
  Setup: Amnesia, Barrier, Bulk Up, Defense Curl, Work Up
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Pivot: Flip Turn
  Phazing: Roar
  Status: Toxic, Yawn
  Weather/terrain: Hail, Rain Dance
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute

**Tapu Fini** — species, **UU**, tier source: imported (natdex)
  Water/Fairy | BST 570 (70/75/115/95/130/85)
  Abilities: Misty Surge / Telepathy
  Engine stats @252 (neutral/positive): Misty Surge: Atk 249/273, SpA 289/317, Spe 269/295 — Telepathy: Atk 249/273, SpA 289/317, Spe 269/295
  Held item: **free**
  STAB: Water Hydro Pump 120S · Fairy Moonblast 95S
  Physical coverage: Normal Return 102P, Ice Ice Punch 75P, Steel Smart Strike 70P, Dark Knock Off 65P
  Special coverage: Ice Blizzard 120S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Normal Hidden Power 60S, Psychic Stored Power 20S
  Setup: Calm Mind, Iron Defense, Withdraw
  Reliable recovery: Rest
  Drain/unreliable: Draining Kiss
  Removal: Defog
  Status: Toxic
  Trapping: Mean Look
  Weather/terrain: Misty Terrain, Rain Dance
  Utility: Gravity, Haze, Knock Off, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Taunt, Trick
  Notable: Knock Off, Trick, Taunt, Substitute

**Terrakion** — species, **UU**, tier source: imported (natdex)
  Rock/Fighting | BST 580 (91/129/90/72/90/108)
  Abilities: Justified
  Engine stats @252 (neutral/positive): Justified: Atk 357/392, SpA 243/267, Spe 315/346
  Held item: **free**
  STAB: Rock Stone Edge 100P · Fighting Close Combat 120P
  Physical coverage: Normal Double-Edge 120P, Bug Megahorn 120P, Ground Earthquake 100P, Steel Iron Head 80P, Poison Poison Jab 80P, Psychic Zen Headbutt 80P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S, Flying Air Slash 75S
  Setup: Calm Mind, Rock Polish, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Upper Hand 65P Fighting (+3), Quick Attack 40P Normal (+1)
  Hazards: Stealth Rock
  Phazing: Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Sandstorm
  Utility: Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Taunt, Substitute

**Thundurus** — species, **UU**, tier source: imported (natdex)
  Electric/Flying | BST 580 (79/115/70/125/80/111)
  Abilities: Prankster / Defiant
  Engine stats @252 (neutral/positive): Prankster: Atk 329/361, SpA 349/383, Spe 321/353 — Defiant: Atk 329/361, SpA 349/383, Spe 321/353
  Held item: **free**
  STAB: Electric Thunder 120S · Flying Acrobatics 110P
  Physical coverage: Fighting Superpower 120P, Normal Thrash 120P, Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Bug U-turn 70P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Wave 95S, Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S
  Setup: Agility, Bulk Up, Charge, Nasty Plot
  Reliable recovery: Rest
  Removal: Defog
  Pivot: U-turn, Volt Switch
  Status: Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Rain Dance, Sunny Day
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Thundurus-Therian** — species, **UU**, tier source: override
  Electric/Flying | BST 580 (79/105/70/145/80/101)
  Abilities: Volt Absorb
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 309/339, SpA 389/427, Spe 301/331
  Held item: **free**
  STAB: Electric Thunder 120S · Flying Acrobatics 110P
  Physical coverage: Fighting Superpower 120P, Normal Thrash 120P, Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Bug U-turn 70P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Wave 95S, Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S
  Setup: Agility, Bulk Up, Charge, Nasty Plot
  Reliable recovery: Rest
  Removal: Defog
  Pivot: U-turn, Volt Switch
  Status: Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Rain Dance, Sunny Day
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Tyranitar** — species, **UU**, tier source: imported (natdex)
  Rock/Dark | BST 600 (100/134/110/95/100/61)
  Abilities: Sand Stream / Unnerve
  Engine stats @252 (neutral/positive): Sand Stream: Atk 367/403, SpA 289/317, Spe 221/243 — Unnerve: Atk 367/403, SpA 289/317, Spe 221/243
  Held item: **free**
  STAB: Rock Stone Edge 100P · Dark Foul Play 95P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Hard Press 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S
  Setup: Dragon Dance, Hone Claws, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Dragon Tail, Roar
  Status: Thunder Wave, Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Ursaluna** — species, **UU**, tier source: imported (natdex)
  Ground/Normal | BST 550 (130/140/105/45/80/50)
  Abilities: Guts / Bulletproof / Unnerve
  Engine stats @252 (neutral/positive): Guts: Atk 379/416, SpA 189/207, Spe 199/218 — Bulletproof: Atk 379/416, SpA 189/207, Spe 199/218 — Unnerve: Atk 379/416, SpA 189/207, Spe 199/218
  Held item: **free**
  STAB: Ground Headlong Rush 120P · Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Electric Supercell Slam 100P, Fairy Play Rough 90P
  Special coverage: Fighting Focus Blast 120S, Electric Zap Cannon 120S
  Setup: Bulk Up, Defense Curl, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Phazing: Roar
  Status: Toxic, Yawn
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Venusaur-Mega** — forme, **UU**, tier source: imported (natdex)
  Grass/Poison | BST 625 (80/100/123/122/120/80)
  Abilities: Thick Fat (fixed by the forme)
  Engine stats @252 (neutral/positive): Thick Fat: Atk 299/328, SpA 343/377, Spe 259/284
  Held item: **Venusaurite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Venusaur (ZU), pre-Mega abilities: Overgrow / Chlorophyll
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Ground Earthquake 100P, Dark Knock Off 65P, Bug Fury Cutter 40P, Fighting Rock Smash 40P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S
  Setup: Amnesia, Defense Curl, Growth, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1)
  Phazing: Roar
  Status: Grass Whistle, Poison Powder, Sleep Powder, Toxic
  Trapping: Block
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Knock Off, Leech Seed, Light Screen, Protect, Reflect, Safeguard, Substitute
  Notable: Knock Off, Substitute

**Victini** — species, **UU**, tier source: imported (natdex)
  Psychic/Fire | BST 600 (100/100/100/100/100/100)
  Abilities: Victory Star
  Engine stats @252 (neutral/positive): Victory Star: Atk 299/328, SpA 299/328, Spe 299/328
  Held item: **free**
  STAB: Psychic Future Sight 120S · Fire V-create 180P
  Physical coverage: Normal Last Resort 140P, Electric Bolt Strike 130P, Flying Bounce 85 (charge)P, Fighting Brick Break 75P, Bug U-turn 70P, Dark Fling 30P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S
  Setup: Work Up
  Reliable recovery: Rest
  Priority: Quick Attack 40P Normal (+1)
  Pivot: Baton Pass, U-turn
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Encore, Light Screen, Magic Coat, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Encore, Taunt, Substitute, Baton Pass, Trick Room

**Weavile** — species, **UU**, tier source: override
  Dark/Ice | BST 510 (70/120/65/45/85/125)
  Abilities: Pressure / Pickpocket
  Engine stats @252 (neutral/positive): Pressure: Atk 339/372, SpA 189/207, Spe 349/383 — Pickpocket: Atk 339/372, SpA 189/207, Spe 349/383
  Held item: **free**
  STAB: Dark Foul Play 95P · Ice Icicle Crash 85P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Psychic Dream Eater 100S, Water Surf 95S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Mud-Slap 20S
  Setup: Agility, Calm Mind, Defense Curl, Hone Claws, Nasty Plot, Swords Dance
  Reliable recovery: Rest
  Drain/unreliable: Dream Eater
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3), Ice Shard 40P Ice (+1)
  Pivot: Baton Pass
  Status: Toxic
  Weather/terrain: Hail, Rain Dance, Snowscape, Sunny Day
  Utility: Detect, Knock Off, Protect, Reflect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass

**Zapdos-Galar** — species, **UU**, tier source: override
  Fighting/Flying | BST 580 (90/125/90/85/90/100)
  Abilities: Defiant
  Engine stats @252 (neutral/positive): Defiant: Atk 349/383, SpA 269/295, Spe 299/328
  Held item: **free**
  STAB: Fighting Close Combat 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Electric Supercell Slam 100P, Fire Blaze Kick 85P, Dark Throat Chop 80P, Ground Stomping Tantrum 75P, Steel Steel Wing 70P
  Special coverage: Electric Thunder 120S, Fire Heat Wave 100S, Psychic Extrasensory 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Rock Ancient Power 60S
  Setup: Agility, Bulk Up, Charge
  Reliable recovery: Rest, Roost
  Removal: Defog
  Pivot: Baton Pass, U-turn, Volt Switch
  Phazing: Roar, Whirlwind
  Status: Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Hail, Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Knock Off, Light Screen, Protect, Reflect, Substitute, Tailwind, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass, Tailwind

**Zeraora** — species, **UU**, tier source: imported (natdex)
  Electric | BST 600 (88/112/75/102/80/143)
  Abilities: Volt Absorb
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 323/355, SpA 303/333, Spe 385/423
  Held item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Dragon Outrage 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Fairy Play Rough 90P
  Special coverage: Fighting Focus Blast 120S, Grass Grass Knot 60S, Normal Hidden Power 60S, Dark Snarl 55S
  Setup: Agility, Bulk Up, Calm Mind, Charge, Hone Claws, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Priority: Fake Out 40P Normal (+3), Quick Attack 40P Normal (+1)
  Pivot: Volt Switch
  Status: Thunder Wave, Toxic
  Weather/terrain: Electric Terrain
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Zoroark-Hisui** — species, **UU**, tier source: imported (natdex)
  Normal/Ghost | BST 510 (55/100/60/125/60/110)
  Abilities: Illusion
  Engine stats @252 (neutral/positive): Illusion: Atk 299/328, SpA 349/383, Spe 319/350
  Held item: **free**
  STAB: Normal Mega Kick 120P · Ghost Poltergeist 110P
  Physical coverage: Fighting Focus Punch 150P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Flying Bounce 85 (charge)P, Bug Skitter Smack 70P
  Special coverage: Fighting Focus Blast 120S, Fire Flamethrower 95S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Dark Night Daze 85S, Grass Grass Knot 60S
  Setup: Agility, Calm Mind, Hone Claws, Nasty Plot, Swords Dance
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1), Shadow Sneak 40P Ghost (+1)
  Pivot: U-turn
  Phazing: Roar
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Rain Dance, Snowscape, Sunny Day
  Utility: Detect, Encore, Knock Off, Memento, Pain Split, Protect, Substitute, Taunt, Trick
  Notable: Knock Off, Trick, Encore, Taunt, Substitute

---

## D. Full RU comparison profiles

All **131** current RU entries, in the same format, so downward
role comparisons can actually be made. This was the largest gap in the previous
document.

**Absol-Mega** — forme, **RU**, tier source: imported (natdex)
  Dark | BST 565 (65/150/60/115/60/115)
  Abilities: Magic Bounce (fixed by the forme)
  Engine stats @252 (neutral/positive): Magic Bounce: Atk 399/438, SpA 329/361, Spe 329/361
  Held item: **Absolite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Absol (PU), pre-Mega abilities: Pressure / Super Luck / Justified
  STAB: Dark Foul Play 95P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Fairy Play Rough 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Normal Razor Wind 80 (charge)S
  Setup: Calm Mind, Hone Claws, Swords Dance
  Reliable recovery: Rest
  Drain/unreliable: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Feint 50P Normal (+2), Quick Attack 40P Normal (+1)
  Pivot: Baton Pass
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Cleric/support: Wish
  Trapping: Mean Look
  Weather/terrain: Hail, Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Knock Off, Magic Coat, Perish Song, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass

**Absol-Mega-Z** — forme, **RU**, tier source: **estimated** _(its own `species.tier` reads PU — the base's; the enforced tier is the one above)_
  Dark/Ghost | BST 565 (65/154/60/75/60/151)
  Abilities: Sharpness (fixed by the forme)
  Engine stats @252 (neutral/positive): Sharpness: Atk 407/447, SpA 249/273, Spe 401/441
  Held item: **Absolite Z** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Absol (PU), pre-Mega abilities: Pressure / Super Luck / Justified
  STAB: Dark Foul Play 95P · Ghost Shadow Claw 70P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Fairy Play Rough 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Normal Razor Wind 80 (charge)S, Flying Air Slash 75S
  Setup: Calm Mind, Hone Claws, Swords Dance
  Reliable recovery: Rest
  Drain/unreliable: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Feint 50P Normal (+2), Quick Attack 40P Normal (+1)
  Pivot: Baton Pass
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Cleric/support: Wish
  Trapping: Mean Look
  Weather/terrain: Hail, Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Knock Off, Magic Coat, Perish Song, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass

**Aggron-Mega** — forme, **RU**, tier source: imported (natdex)
  Steel | BST 630 (70/140/230/60/80/50)
  Abilities: Filter (fixed by the forme)
  Engine stats @252 (neutral/positive): Filter: Atk 379/416, SpA 219/240, Spe 199/218
  Held item: **Aggronite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Aggron (NU), pre-Mega abilities: Sturdy / Rock Head / Heavy Metal
  STAB: Steel Steel Roller 130P
  Physical coverage: Fighting Focus Punch 150P, Rock Head Smash 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S
  Setup: Autotomize, Defense Curl, Harden, Hone Claws, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Dragon Tail, Roar
  Status: Thunder Wave, Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Ampharos-Mega** — forme, **RU**, tier source: imported (natdex)
  Electric/Dragon | BST 610 (90/95/105/165/110/45)
  Abilities: Mold Breaker (fixed by the forme)
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 289/317, SpA 429/471, Spe 189/207
  Held item: **Ampharosite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Ampharos (ZU), pre-Mega abilities: Static / Plus
  STAB: Electric Thunder 120S · Dragon Dragon Pulse 90S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Fling 80P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Rock Meteor Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Bug Signal Beam 75S
  Setup: Agility, Charge, Cotton Guard, Defense Curl
  Reliable recovery: Rest
  Pivot: Volt Switch
  Phazing: Dragon Tail, Roar
  Status: Thunder Wave, Toxic
  Cleric/support: Heal Bell
  Weather/terrain: Electric Terrain, Rain Dance, Sunny Day
  Utility: Light Screen, Protect, Reflect, Safeguard, Substitute
  Notable: Substitute

**Arcanine-Hisui** — species, **RU**, tier source: imported (natdex)
  Fire/Rock | BST 555 (95/115/80/95/80/90)
  Abilities: Intimidate / Flash Fire / Rock Head
  Engine stats @252 (neutral/positive): Intimidate: Atk 329/361, SpA 289/317, Spe 279/306 — Flash Fire: Atk 329/361, SpA 289/317, Spe 279/306 — Rock Head: Atk 329/361, SpA 289/317, Spe 279/306
  Held item: **free**
  STAB: Fire Overheat 140S · Rock Head Smash 150P
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P
  Special coverage: Grass Solar Beam 120 (charge)S, Dragon Dragon Pulse 90S, Normal Hyper Voice 90S, Ground Scorching Sands 70S, Dark Snarl 55S
  Setup: Agility
  Reliable recovery: Rest
  Priority: Extreme Speed 80P Normal (+2)
  Hazards: Stealth Rock
  Pivot: Teleport
  Phazing: Roar
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Protect, Reflect, Safeguard, Substitute
  Notable: Substitute

**Arctozolt** — species, **RU**, tier source: imported (natdex)
  Electric/Ice | BST 505 (90/100/90/90/80/55)
  Abilities: Volt Absorb / Static / Slush Rush
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 299/328, SpA 279/306, Spe 209/229 — Static: Atk 299/328, SpA 279/306, Spe 209/229 — Slush Rush: Atk 299/328, SpA 279/306, Spe 209/229
  Held item: **free**
  STAB: Electric Bolt Beak 170P · Ice Blizzard 120S
  Physical coverage: Normal Mega Kick 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ground Stomping Tantrum 75P, Fighting Low Kick 60P, Flying Pluck 60P
  Special coverage: Water Hydro Pump 120S, Rock Meteor Beam 120 (charge)S, Normal Hyper Voice 90S
  Setup: Charge
  Reliable recovery: Rest
  Status: Thunder Wave
  Weather/terrain: Hail, Rain Dance
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Armarouge** — species, **RU**, tier source: imported (natdex)
  Fire/Psychic | BST 525 (85/60/100/125/80/75)
  Abilities: Flash Fire / Weak Armor
  Engine stats @252 (neutral/positive): Flash Fire: Atk 219/240, SpA 349/383, Spe 249/273 — Weak Armor: Atk 219/240, SpA 349/383, Spe 249/273
  Held item: **free**
  STAB: Fire Overheat 140S · Psychic Psychic 90S
  Physical coverage: Normal Take Down 90P, Ghost Astonish 30P, Dark Fling 30P
  Special coverage: Fighting Focus Blast 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S
  Setup: Calm Mind, Iron Defense
  Reliable recovery: Rest
  Status: Will-O-Wisp
  Weather/terrain: Psychic Terrain, Sunny Day
  Utility: Clear Smog, Destiny Bond, Disable, Light Screen, Protect, Reflect, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

**Azelf** — species, **RU**, tier source: imported (natdex)
  Psychic | BST 580 (75/125/70/125/70/115)
  Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 349/383, SpA 349/383, Spe 329/361
  Held item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Flying Acrobatics 110P, Steel Iron Tail 100P, Fairy Play Rough 90P, Fighting Drain Punch 75P, Fire Fire Punch 75P
  Special coverage: Fire Fire Blast 120S, Electric Thunder 120S, Grass Energy Ball 90S, Normal Uproar 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S
  Setup: Calm Mind, Nasty Plot
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch, Draining Kiss, Dream Eater
  Hazards: Stealth Rock
  Pivot: Baton Pass, U-turn
  Status: Thunder Wave, Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Encore, Knock Off, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Baton Pass, Trick Room

**Banette-Mega** — forme, **RU**, tier source: imported (natdex)
  Ghost | BST 555 (64/165/75/93/83/75)
  Abilities: Prankster (fixed by the forme)
  Engine stats @252 (neutral/positive): Prankster: Atk 429/471, SpA 285/313, Spe 249/273
  Held item: **Banettite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Banette (ZU), pre-Mega abilities: Insomnia / Frisk / Cursed Body
  STAB: Ghost Poltergeist 110P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Dark Foul Play 95P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Fire Burning Jealousy 70S
  Setup: Calm Mind, Cotton Guard, Nasty Plot, Swords Dance
  Reliable recovery: Rest
  Drain/unreliable: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Shadow Sneak 40P Ghost (+1)
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Destiny Bond, Disable, Encore, Knock Off, Magic Coat, Pain Split, Protect, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room

**Barbaracle** — species, **RU**, tier source: imported (natdex)
  Rock/Water | BST 500 (72/105/115/54/86/68)
  Abilities: Tough Claws / Sniper / Pickpocket
  Engine stats @252 (neutral/positive): Tough Claws: Atk 309/339, SpA 207/227, Spe 235/258 — Sniper: Atk 309/339, SpA 207/227, Spe 235/258 — Pickpocket: Atk 309/339, SpA 207/227, Spe 235/258
  Held item: **free**
  STAB: Rock Stone Edge 100P · Water Liquidation 85P
  Physical coverage: Normal Skull Bash 130P, Fighting Superpower 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Poison Poison Jab 80P, Bug X-Scissor 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Ground Earth Power 90S, Normal Uproar 90S, Grass Grass Knot 60S
  Setup: Bulk Up, Hone Claws, Iron Defense, Rock Polish, Shell Smash, Swords Dance, Withdraw
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm
  Utility: Protect, Safeguard, Substitute, Switcheroo, Taunt
  Notable: Switcheroo, Taunt, Substitute

**Barraskewda** — species, **RU**, tier source: imported (natdex)
  Water | BST 490 (61/123/60/60/50/136)
  Abilities: Swift Swim / Propeller Tail
  Engine stats @252 (neutral/positive): Swift Swim: Atk 345/379, SpA 219/240, Spe 371/408 — Propeller Tail: Atk 345/379, SpA 219/240, Spe 371/408
  Held item: **free**
  STAB: Water Liquidation 85P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Dark Crunch 80P, Ground Drill Run 80P
  Special coverage: Ice Blizzard 120S, Normal Tera Blast 80S
  Setup: Agility
  Reliable recovery: Rest
  Priority: Aqua Jet 40P Water (+1)
  Pivot: Flip Turn
  Weather/terrain: Rain Dance
  Utility: Protect, Substitute
  Notable: Substitute

**Beedrill-Mega** — forme, **RU**, tier source: imported (natdex)
  Bug/Poison | BST 495 (65/150/40/15/80/145)
  Abilities: Adaptability (fixed by the forme)
  Engine stats @252 (neutral/positive): Adaptability: Atk 399/438, SpA 129/141, Spe 389/427
  Held item: **Beedrillite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Beedrill (ZU), pre-Mega abilities: Swarm / Sniper
  STAB: Bug Twineedle 50x2P · Poison Poison Jab 80P
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Ground Drill Run 80P, Dark Throat Chop 80P, Fighting Brick Break 75P, Flying Aerial Ace 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Flying Air Cutter 60S, Normal Hidden Power 60S, Ghost Ominous Wind 60S, Electric Electroweb 55S
  Setup: Agility, Harden, Iron Defense, Swords Dance
  Reliable recovery: Rest, Roost
  Drain/unreliable: Giga Drain, Mega Drain
  Hazards: Toxic Spikes
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Weather/terrain: Sunny Day
  Utility: Knock Off, Protect, Reflect, Substitute, Tailwind
  Notable: Knock Off, Substitute, Baton Pass, Tailwind

**Bewear** — species, **RU**, tier source: imported (natdex)
  Normal/Fighting | BST 500 (120/125/80/55/60/60)
  Abilities: Fluffy / Klutz / Unnerve
  Engine stats @252 (neutral/positive): Fluffy: Atk 349/383, SpA 209/229, Spe 219/240 — Klutz: Atk 349/383, SpA 209/229, Spe 219/240 — Unnerve: Atk 349/383, SpA 209/229, Spe 219/240
  Held item: **free**
  STAB: Normal Double-Edge 120P · Fighting Focus Punch 150P
  Physical coverage: Dragon Dual Chop 50x2P, Ground Earthquake 100P, Dark Darkest Lariat 85P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Ice Ice Punch 75P
  Special coverage: **none**
  Setup: Bulk Up, Defense Curl, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Phazing: Roar
  Status: Toxic
  Utility: Pain Split, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Blastoise** — species, **RU**, tier source: imported (natdex)
  Water | BST 530 (79/83/100/85/105/78)
  Abilities: Torrent / Rain Dish
  Engine stats @252 (neutral/positive): Torrent: Atk 265/291, SpA 269/295, Spe 255/280 — Rain Dish: Atk 265/291, SpA 269/295, Spe 255/280
  Held item: **free**
  STAB: Water Water Spout 150S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S, Normal Tera Blast 80S
  Setup: Defense Curl, Iron Defense, Shell Smash, Withdraw, Work Up
  Reliable recovery: Rest
  Priority: Aqua Jet 40P Water (+1), Fake Out 40P Normal (+3)
  Removal: Rapid Spin
  Pivot: Flip Turn
  Phazing: Dragon Tail, Roar
  Status: Toxic, Yawn
  Cleric/support: Life Dew
  Trapping: Block
  Weather/terrain: Hail, Rain Dance
  Utility: Haze, Protect, Reflect, Substitute
  Notable: Substitute

**Breloom** — species, **RU**, tier source: imported (natdex)
  Grass/Fighting | BST 460 (60/130/80/60/60/70)
  Abilities: Effect Spore / Poison Heal / Technician
  Engine stats @252 (neutral/positive): Effect Spore: Atk 359/394, SpA 219/240, Spe 239/262 — Poison Heal: Atk 359/394, SpA 219/240, Spe 239/262 — Technician: Atk 359/394, SpA 219/240, Spe 239/262
  Held item: **free**
  STAB: Grass Seed Bomb 80P · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P
  Special coverage: Poison Sludge Bomb 90S, Normal Tera Blast 80S, Ground Mud Shot 55S
  Setup: Bulk Up, Growth, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Absorb, Drain Punch, Giga Drain, Mega Drain
  Priority: Feint 50P Normal (+2), Mach Punch 40P Fighting (+1), Vacuum Wave 40S Fighting (+1)
  Status: Poison Powder, Spore, Stun Spore, Toxic
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Leech Seed, Protect, Safeguard, Substitute
  Notable: Substitute

**Camerupt-Mega** — forme, **RU**, tier source: imported (natdex)
  Fire/Ground | BST 560 (70/120/100/145/105/20)
  Abilities: Sheer Force (fixed by the forme)
  Engine stats @252 (neutral/positive): Sheer Force: Atk 339/372, SpA 389/427, Spe 139/152
  Held item: **Cameruptite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Camerupt (ZU), pre-Mega abilities: Magma Armor / Solid Rock / Anger Point
  STAB: Fire Eruption 150S · Ground Earthquake 100P
  Physical coverage: Normal Explosion 250P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Fighting Body Press 80P, Psychic Zen Headbutt 80P, Dark Lash Out 75P
  Special coverage: Grass Solar Beam 120 (charge)S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Rock Ancient Power 60S
  Setup: Amnesia, Defense Curl, Growth, Rock Polish
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Roar
  Status: Toxic, Will-O-Wisp, Yawn
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute

**Celebi** — species, **RU**, tier source: imported (natdex)
  Psychic/Grass | BST 600 (100/100/100/100/100/100)
  Abilities: Natural Cure
  Engine stats @252 (neutral/positive): Natural Cure: Atk 299/328, SpA 299/328, Spe 299/328
  Held item: **free**
  STAB: Psychic Future Sight 120S · Grass Leaf Storm 140S
  Physical coverage: Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Dark Sucker Punch 80P, Bug U-turn 70P
  Special coverage: Fighting Aura Sphere 90S, Ground Earth Power 90S, Bug Pollen Puff 90S, Normal Uproar 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S
  Setup: Calm Mind, Defense Curl, Nasty Plot, Swords Dance
  Reliable recovery: Recover, Rest
  Drain/unreliable: Dream Eater, Giga Drain
  Priority: Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1)
  Hazards: Stealth Rock
  Pivot: Baton Pass, U-turn
  Status: Thunder Wave, Toxic
  Cleric/support: Heal Bell, Life Dew
  Weather/terrain: Grassy Terrain, Psychic Terrain, Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Healing Wish, Leech Seed, Light Screen, Magic Coat, Perish Song, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Baton Pass, Trick Room

**Cetitan** — species, **RU**, tier source: imported (natdex)
  Ice | BST 521 (170/113/65/45/55/73)
  Abilities: Thick Fat / Slush Rush / Sheer Force
  Engine stats @252 (neutral/positive): Thick Fat: Atk 325/357, SpA 189/207, Spe 245/269 — Slush Rush: Atk 325/357, SpA 189/207, Spe 245/269 — Sheer Force: Atk 325/357, SpA 189/207, Spe 245/269
  Held item: **free**
  STAB: Ice Icicle Crash 85P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Fighting Superpower 120P, Ground Earthquake 100P, Fairy Play Rough 90P, Water Liquidation 85P
  Special coverage: Normal Hyper Voice 90S, Water Water Pulse 60S
  Setup: Amnesia
  Reliable recovery: Rest
  Priority: Ice Shard 40P Ice (+1)
  Status: Yawn
  Weather/terrain: Rain Dance, Snowscape
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute

**Chesnaught** — species, **RU**, tier source: imported (natdex)
  Grass/Fighting | BST 530 (88/107/122/74/75/64)
  Abilities: Overgrow / Bulletproof
  Engine stats @252 (neutral/positive): Overgrow: Atk 313/344, SpA 247/271, Spe 227/249 — Bulletproof: Atk 313/344, SpA 247/271, Spe 227/249
  Held item: **free**
  STAB: Grass Leaf Storm 140S · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Dark Crunch 80P
  Special coverage: Poison Sludge Bomb 90S, Normal Tera Blast 80S, Ground Mud Shot 55S
  Setup: Bulk Up, Defense Curl, Hone Claws, Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch, Giga Drain
  Priority: Grassy Glide 70P Grass (+1), Feint 50P Normal (+2)
  Hazards: Spikes
  Phazing: Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Knock Off, Leech Seed, Pain Split, Protect, Reflect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Chimecho-Mega** — forme, **RU**, tier source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one above)_
  Psychic/Steel | BST 555 (75/50/110/135/120/65)
  Abilities: Levitate (fixed by the forme)
  Engine stats @252 (neutral/positive): Levitate: Atk 199/218, SpA 369/405, Spe 229/251
  Held item: **Chimechite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Chimecho (ZU), pre-Mega abilities: Levitate
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Dark Knock Off 65P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Grass Energy Ball 90S, Normal Hyper Voice 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Electric Shock Wave 60S
  Setup: Calm Mind, Cosmic Power, Defense Curl
  Reliable recovery: Recover, Rest
  Drain/unreliable: Draining Kiss, Dream Eater
  Removal: Defog
  Pivot: Baton Pass
  Status: Hypnosis, Thunder Wave, Toxic, Yawn
  Cleric/support: Heal Bell, Wish
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Disable, Encore, Gravity, Healing Wish, Knock Off, Light Screen, Magic Coat, Perish Song, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Baton Pass, Trick Room

**Cloyster** — species, **RU**, tier source: imported (natdex)
  Water/Ice | BST 525 (50/95/180/85/45/70)
  Abilities: Shell Armor / Skill Link / Overcoat
  Engine stats @252 (neutral/positive): Shell Armor: Atk 289/317, SpA 269/295, Spe 239/262 — Skill Link: Atk 289/317, SpA 269/295, Spe 239/262 — Overcoat: Atk 289/317, SpA 269/295, Spe 239/262
  Held item: **free**
  STAB: Water Hydro Pump 120S · Ice Blizzard 120S
  Physical coverage: Normal Explosion 250P, Steel Steel Roller 130P, Bug Twineedle 50x2P, Ground Drill Run 80P, Poison Poison Jab 80P, Rock Rock Blast 25x2-5P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S, Ground Mud Shot 55S
  Setup: Barrier, Iron Defense, Shell Smash, Withdraw
  Reliable recovery: Rest
  Priority: Ice Shard 40P Ice (+1)
  Hazards: Spikes, Toxic Spikes
  Removal: Rapid Spin
  Pivot: Teleport
  Status: Toxic
  Cleric/support: Life Dew
  Weather/terrain: Hail, Rain Dance, Snowscape
  Utility: Light Screen, Protect, Reflect, Substitute
  Notable: Substitute

**Cobalion** — species, **RU**, tier source: imported (natdex)
  Steel/Fighting | BST 580 (91/90/129/90/72/108)
  Abilities: Justified
  Engine stats @252 (neutral/positive): Justified: Atk 279/306, SpA 279/306, Spe 315/346
  Held item: **free**
  STAB: Steel Steel Beam 140S · Fighting Close Combat 120P
  Physical coverage: Normal Double-Edge 120P, Bug Megahorn 120P, Rock Stone Edge 100P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P, Psychic Zen Headbutt 80P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Electric Volt Switch 70S
  Setup: Calm Mind, Hone Claws, Iron Defense, Rock Polish, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Upper Hand 65P Fighting (+3), Quick Attack 40P Normal (+1), Vacuum Wave 40S Fighting (+1)
  Hazards: Stealth Rock
  Pivot: Volt Switch
  Phazing: Roar
  Status: Thunder Wave, Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Taunt, Substitute

**Comfey** — species, **RU**, tier source: imported (natdex)
  Fairy | BST 485 (51/52/90/82/110/100)
  Abilities: Flower Veil / Triage / Natural Cure
  Engine stats @252 (neutral/positive): Flower Veil: Atk 203/223, SpA 263/289, Spe 299/328 — Triage: Atk 203/223, SpA 263/289, Spe 299/328 — Natural Cure: Atk 203/223, SpA 263/289, Spe 299/328
  Held item: **free**
  STAB: Fairy Play Rough 90P
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Grass Petal Blizzard 90P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Grass Petal Dance 120S, Bug Pollen Puff 90S, Normal Tera Blast 80S, Psychic Stored Power 20S
  Setup: Amnesia, Calm Mind, Growth
  Reliable recovery: Rest
  Drain/unreliable: Draining Kiss, Giga Drain
  Priority: Grassy Glide 70P Grass (+1)
  Removal: Defog
  Pivot: U-turn
  Status: Toxic
  Cleric/support: Aromatherapy, Floral Healing, Heal Bell
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Encore, Knock Off, Leech Seed, Light Screen, Magic Coat, Pain Split, Protect, Safeguard, Substitute, Tailwind, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room, Tailwind

**Copperajah** — species, **RU**, tier source: override
  Steel | BST 500 (122/130/69/80/69/30)
  Abilities: Sheer Force / Heavy Metal
  Engine stats @252 (neutral/positive): Sheer Force: Atk 359/394, SpA 259/284, Spe 159/174 — Heavy Metal: Atk 359/394, SpA 259/284, Spe 159/174
  Held item: **free**
  STAB: Steel Steel Roller 130P
  Physical coverage: Normal Double-Edge 120P, Fire Heat Crash 120P, Dragon Outrage 120P, Grass Power Whip 120P, Fighting Superpower 120P, Ground Earthquake 100P
  Special coverage: Poison Belch 120S, Ground Earth Power 90S, Normal Tera Blast 80S, Dark Snarl 55S
  Setup: Defense Curl, Iron Defense, Work Up
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Whirlwind
  Weather/terrain: Sandstorm
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Crabominable-Mega** — forme, **RU**, tier source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one above)_
  Fighting/Ice | BST 578 (97/157/122/62/107/33)
  Abilities: Iron Fist (fixed by the forme)
  Engine stats @252 (neutral/positive): Iron Fist: Atk 413/454, SpA 223/245, Spe 165/181
  Held item: **Crabominite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Crabominable (ZU), pre-Mega abilities: Hyper Cutter / Iron Fist / Anger Point
  STAB: Fighting Focus Punch 150P · Ice Ice Hammer 100P
  Physical coverage: Poison Gunk Shot 120P, Normal Return 102P, Water Crabhammer 100P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Hard Press 100P
  Special coverage: Water Scald 80S, Normal Tera Blast 80S, Ground Mud Shot 55S
  Setup: Amnesia, Bulk Up, Iron Defense, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Priority: Upper Hand 65P Fighting (+3)
  Status: Toxic
  Trapping: Block
  Weather/terrain: Hail, Rain Dance, Snowscape, Sunny Day
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute

**Crawdaunt** — species, **RU**, tier source: imported (natdex)
  Water/Dark | BST 468 (63/120/85/90/55/55)
  Abilities: Hyper Cutter / Shell Armor / Adaptability
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 339/372, SpA 279/306, Spe 209/229 — Shell Armor: Atk 339/372, SpA 279/306, Spe 209/229 — Adaptability: Atk 339/372, SpA 279/306, Spe 209/229
  Held item: **free**
  STAB: Water Hydro Pump 120S · Dark Crunch 80P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Steel Hard Press 100P, Ground Dig 100 (charge)P, Bug X-Scissor 80P, Rock Rock Slide 75P
  Special coverage: Normal Trump Card 200S, Ice Blizzard 120S, Poison Sludge Wave 95S, Rock Ancient Power 60S, Ground Mud Shot 55S
  Setup: Dragon Dance, Harden, Hone Claws, Iron Defense, Nasty Plot, Swords Dance
  Reliable recovery: Rest
  Priority: Aqua Jet 40P Water (+1)
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Knock Off, Protect, Substitute, Switcheroo, Taunt
  Notable: Knock Off, Switcheroo, Taunt, Substitute

**Cresselia** — species, **RU**, tier source: imported (natdex)
  Psychic | BST 600 (120/70/120/75/130/85)
  Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 239/262, SpA 249/273, Spe 269/295
  Held item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Bug Fury Cutter 40P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Fairy Moonblast 95S, Rock Power Gem 80S, Ghost Shadow Ball 80S
  Setup: Calm Mind
  Reliable recovery: Rest
  Drain/unreliable: Dream Eater
  Status: Thunder Wave, Toxic
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Gravity, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

**Crobat** — species, **RU**, tier source: imported (natdex)
  Poison/Flying | BST 535 (85/90/80/70/80/130)
  Abilities: Inner Focus / Infiltrator
  Engine stats @252 (neutral/positive): Inner Focus: Atk 279/306, SpA 239/262, Spe 359/394 — Infiltrator: Atk 279/306, SpA 239/262, Spe 359/394
  Held item: **free**
  STAB: Poison Sludge Bomb 90S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Bug Leech Life 80P, Psychic Zen Headbutt 80P, Steel Steel Wing 70P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Grass Giga Drain 75S, Dragon Twister 40S
  Setup: Agility, Nasty Plot
  Reliable recovery: Rest, Roost
  Drain/unreliable: Absorb, Giga Drain, Leech Life, Mega Drain
  Priority: Quick Attack 40P Normal (+1)
  Removal: Defog
  Pivot: U-turn
  Phazing: Whirlwind
  Status: Hypnosis, Toxic
  Trapping: Mean Look
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Haze, Protect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Cyclizar** — species, **RU**, tier source: imported (natdex)
  Dragon/Normal | BST 501 (70/95/65/85/65/121)
  Abilities: Shed Skin / Regenerator
  Engine stats @252 (neutral/positive): Shed Skin: Atk 289/317, SpA 269/295, Spe 341/375 — Regenerator: Atk 289/317, SpA 269/295, Spe 341/375
  Held item: **free**
  STAB: Dragon Draco Meteor 140S · Normal Double-Edge 120P
  Physical coverage: Grass Power Whip 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Electric Supercell Slam 100P, Water Aqua Tail 90P, Dark Crunch 80P
  Special coverage: Fire Overheat 140S, Electric Thunderbolt 95S, Ground Mud Shot 55S
  Setup: Agility, Shift Gear
  Reliable recovery: Rest
  Priority: Quick Attack 40P Normal (+1)
  Removal: Rapid Spin
  Pivot: Shed Tail, U-turn
  Phazing: Dragon Tail
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Darmanitan** — species, **RU**, tier source: imported (natdex)
  Fire | BST 480 (105/140/55/30/55/95)
  Abilities: Sheer Force / Zen Mode
  Engine stats @252 (neutral/positive): Sheer Force: Atk 379/416, SpA 159/174, Spe 289/317 — Zen Mode: Atk 379/416, SpA 159/174, Spe 289/317
  Held item: **free**
  STAB: Fire Flare Blitz 120P
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Steel Iron Head 80P, Psychic Zen Headbutt 80P
  Special coverage: Fighting Focus Blast 120S, Psychic Future Sight 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S
  Setup: Bulk Up, Iron Defense, Work Up
  Reliable recovery: Rest
  Pivot: U-turn
  Phazing: Roar
  Status: Toxic, Will-O-Wisp, Yawn
  Weather/terrain: Sunny Day
  Utility: Encore, Protect, Substitute, Taunt, Trick
  Notable: Trick, Encore, Taunt, Substitute

**Darmanitan-Zen** — forme, **RU**, tier source: imported (natdex)
  Fire/Psychic | BST 540 (105/30/105/140/105/55)
  Abilities: Zen Mode (fixed by the forme)
  Engine stats @252 (neutral/positive): Zen Mode: Atk 379/416, SpA 159/174, Spe 289/317
  Held item: **—** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Darmanitan (RU), pre-Mega abilities: Sheer Force / Zen Mode
  STAB: Fire Flare Blitz 120P · Psychic Zen Headbutt 80P
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Steel Iron Head 80P, Dark Lash Out 75P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S
  Setup: Bulk Up, Iron Defense, Work Up
  Reliable recovery: Rest
  Pivot: U-turn
  Phazing: Roar
  Status: Toxic, Will-O-Wisp, Yawn
  Weather/terrain: Sunny Day
  Utility: Encore, Protect, Substitute, Taunt, Trick
  Notable: Trick, Encore, Taunt, Substitute

**Deoxys-Defense** — species, **RU**, tier source: imported (natdex)
  Psychic | BST 600 (50/70/160/70/160/90)
  Abilities: Pressure
  Engine stats @252 (neutral/positive): Pressure: Atk 239/262, SpA 239/262, Spe 279/306
  Held item: **free**
  STAB: Psychic Psycho Boost 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Meteor Mash 100P, Poison Poison Jab 80P, Dark Throat Chop 80P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Dark Dark Pulse 80S
  Setup: Agility, Amnesia, Calm Mind, Cosmic Power, Iron Defense, Nasty Plot
  Reliable recovery: Recover, Rest
  Drain/unreliable: Drain Punch, Dream Eater
  Priority: Extreme Speed 80P Normal (+2)
  Hazards: Spikes, Stealth Rock
  Pivot: Teleport
  Status: Thunder Wave, Toxic
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Detect, Gravity, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Taunt, Substitute, Trick Room

**Diancie** — species, **RU**, tier source: imported (natdex)
  Rock/Fairy | BST 600 (50/100/150/100/150/50)
  Abilities: Clear Body
  Engine stats @252 (neutral/positive): Clear Body: Atk 299/328, SpA 299/328, Spe 199/218
  Held item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Fairy Misty Explosion 100S
  Physical coverage: Normal Explosion 250P, Fighting Body Press 80P, Ground Bulldoze 60P, Steel Gyro Ball 27P
  Special coverage: Ground Earth Power 90S, Psychic Psychic 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Fire Mystical Fire 75S
  Setup: Amnesia, Calm Mind, Harden, Iron Defense, Rock Polish, Sharpen
  Reliable recovery: Rest
  Drain/unreliable: Draining Kiss
  Hazards: Spikes, Stealth Rock
  Pivot: Baton Pass
  Status: Toxic
  Cleric/support: Heal Bell
  Weather/terrain: Hail, Rain Dance, Sandstorm, Snowscape, Sunny Day
  Utility: Encore, Gravity, Light Screen, Protect, Reflect, Safeguard, Substitute, Trick Room
  Notable: Encore, Substitute, Baton Pass, Trick Room

**Diggersby** — species, **RU**, tier source: imported (natdex)
  Normal/Ground | BST 423 (85/56/77/50/77/78)
  Abilities: Pickup / Cheek Pouch / Huge Power
  Engine stats @252 (neutral/positive): Pickup: Atk 211/232, SpA 199/218, Spe 255/280 — Cheek Pouch: Atk 211/232, SpA 199/218, Spe 255/280 — Huge Power: Atk 422/464, SpA 199/218, Spe 255/280
  Held item: **free**
  STAB: Normal Last Resort 140P · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Dark Foul Play 95P, Electric Wild Charge 90P
  Special coverage: Water Surf 95S, Poison Sludge Bomb 90S, Grass Grass Knot 60S
  Setup: Agility, Bulk Up, Defense Curl, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Quick Attack 40P Normal (+1)
  Hazards: Spikes
  Pivot: U-turn
  Status: Toxic
  Weather/terrain: Sandstorm
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute

**Donphan** — species, **RU**, tier source: imported (natdex)
  Ground | BST 500 (90/120/120/60/60/50)
  Abilities: Sturdy / Sand Veil
  Engine stats @252 (neutral/positive): Sturdy: Atk 339/372, SpA 219/240, Spe 199/218 — Sand Veil: Atk 339/372, SpA 219/240, Spe 199/218
  Held item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Rock Head Smash 150P, Normal Last Resort 140P, Poison Gunk Shot 120P, Fighting Superpower 120P, Steel Iron Tail 100P, Fairy Play Rough 90P
  Special coverage: Normal Hyper Voice 90S, Rock Ancient Power 60S, Water Water Gun 40S
  Setup: Defense Curl, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Priority: Ice Shard 40P Ice (+1)
  Hazards: Stealth Rock
  Removal: Rapid Spin
  Phazing: Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Encore, Knock Off, Protect, Substitute
  Notable: Knock Off, Encore, Substitute

**Dracozolt** — species, **RU**, tier source: imported (natdex)
  Electric/Dragon | BST 505 (90/100/90/80/70/75)
  Abilities: Volt Absorb / Hustle / Sand Rush
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 299/328, SpA 259/284, Spe 249/273 — Hustle: Atk 448/492, SpA 259/284, Spe 249/273 — Sand Rush: Atk 299/328, SpA 259/284, Spe 249/273
  Held item: **free**
  STAB: Electric Bolt Beak 170P · Dragon Outrage 120P
  Physical coverage: Normal Mega Kick 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Fire Fire Fang 65P, Flying Aerial Ace 60P
  Special coverage: Fire Fire Blast 120S, Rock Meteor Beam 120 (charge)S, Ground Earth Power 90S, Normal Round 60S
  Setup: Charge
  Reliable recovery: Rest
  Phazing: Dragon Tail
  Status: Thunder Wave
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Duraludon** — species, **RU**, tier source: override
  Steel/Dragon | BST 535 (70/95/115/120/50/85)
  Abilities: Light Metal / Heavy Metal / Stalwart
  Engine stats @252 (neutral/positive): Light Metal: Atk 289/317, SpA 339/372, Spe 269/295 — Heavy Metal: Atk 289/317, SpA 339/372, Spe 269/295 — Stalwart: Atk 289/317, SpA 339/372, Spe 269/295
  Held item: **free**
  STAB: Steel Steel Beam 140S · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Rock Stone Edge 100P, Dark Foul Play 95P, Fighting Body Press 80P, Ground Stomping Tantrum 75P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Psychic Mirror Coat fixedS
  Setup: Hone Claws, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Dragon Tail, Roar
  Status: Thunder Wave
  Utility: Light Screen, Protect, Reflect, Substitute
  Notable: Substitute

**Durant** — species, **RU**, tier source: imported (natdex)
  Bug/Steel | BST 484 (58/109/112/48/48/109)
  Abilities: Swarm / Hustle / Truant
  Engine stats @252 (neutral/positive): Swarm: Atk 317/348, SpA 195/214, Spe 317/348 — Hustle: Atk 475/522, SpA 195/214, Spe 317/348 — Truant: Atk 317/348, SpA 195/214, Spe 317/348
  Held item: **free**
  STAB: Bug First Impression 90P · Steel Iron Head 80P
  Physical coverage: Fighting Superpower 120P, Normal Return 102P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Ghost Shadow Claw 70P
  Special coverage: Grass Energy Ball 90S, Normal Hidden Power 60S
  Setup: Agility, Hone Claws, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Priority: First Impression 90P Bug (+2)
  Pivot: Baton Pass
  Status: Thunder Wave, Toxic
  Weather/terrain: Sandstorm
  Utility: Protect, Substitute
  Notable: Substitute, Baton Pass

**Eelektross-Mega** — forme, **RU**, tier source: override
  Electric | BST 615 (85/145/80/135/90/80)
  Abilities: Eelevate (fixed by the forme)
  Engine stats @252 (neutral/positive): Eelevate: Atk 389/427, SpA 369/405, Spe 259/284
  Held item: **Eelektrossite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Eelektross (ZU), pre-Mega abilities: Levitate
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Dragon Outrage 120P, Normal Thrash 120P, Steel Iron Tail 100P, Water Aqua Tail 90P, Flying Bounce 85 (charge)P
  Special coverage: Fire Flamethrower 95S, Dragon Dragon Pulse 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Bug Signal Beam 75S
  Setup: Bulk Up, Charge, Coil, Hone Claws
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch, Giga Drain
  Pivot: U-turn, Volt Switch
  Phazing: Dragon Tail, Roar
  Status: Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Rain Dance, Sunny Day
  Utility: Knock Off, Light Screen, Protect, Substitute
  Notable: Knock Off, Substitute

**Empoleon** — species, **RU**, tier source: imported (natdex)
  Water/Steel | BST 530 (84/86/88/111/101/60)
  Abilities: Torrent / Competitive / Defiant
  Engine stats @252 (neutral/positive): Torrent: Atk 271/298, SpA 321/353, Spe 219/240 — Competitive: Atk 271/298, SpA 321/353, Spe 219/240 — Defiant: Atk 271/298, SpA 321/353, Spe 219/240
  Held item: **free**
  STAB: Water Hydro Pump 120S · Steel Steel Beam 140S
  Physical coverage: Normal Double-Edge 120P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Ice Ice Spinner 80P, Dark Throat Chop 80P, Fighting Brick Break 75P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Flying Air Slash 75S, Bug Signal Beam 75S, Grass Grass Knot 60S, Fairy Disarming Voice 40S
  Setup: Agility, Hone Claws, Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest, Roost
  Priority: Aqua Jet 40P Water (+1), Vacuum Wave 40S Fighting (+1)
  Hazards: Stealth Rock
  Removal: Defog
  Pivot: Flip Turn
  Phazing: Roar
  Status: Sing, Toxic, Yawn
  Weather/terrain: Hail, Rain Dance, Snowscape
  Utility: Haze, Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute

**Enamorus-Therian** — species, **RU**, tier source: imported (natdex)
  Fairy/Flying | BST 580 (74/115/110/135/100/46)
  Abilities: Overcoat
  Engine stats @252 (neutral/positive): Overcoat: Atk 329/361, SpA 369/405, Spe 191/210
  Held item: **free**
  STAB: Fairy Misty Explosion 100S · Flying Fly 90 (charge)P
  Physical coverage: Dragon Outrage 120P, Fighting Superpower 120P, Normal Take Down 90P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Ghost Astonish 30P
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Fire Mystical Fire 75S
  Setup: Agility, Calm Mind, Iron Defense
  Reliable recovery: Rest
  Drain/unreliable: Draining Kiss
  Weather/terrain: Grassy Terrain, Misty Terrain, Rain Dance, Sunny Day
  Utility: Healing Wish, Protect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Entei** — species, **RU**, tier source: imported (natdex)
  Fire | BST 580 (115/115/85/90/75/100)
  Abilities: Pressure / Inner Focus / Flash Fire
  Engine stats @252 (neutral/positive): Pressure: Atk 329/361, SpA 279/306, Spe 299/328 — Inner Focus: Atk 329/361, SpA 279/306, Spe 299/328 — Flash Fire: Atk 329/361, SpA 279/306, Spe 299/328
  Held item: **free**
  STAB: Fire Eruption 150S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Scorching Sands 70S, Dark Snarl 55S
  Setup: Agility, Calm Mind
  Reliable recovery: Rest
  Priority: Extreme Speed 80P Normal (+2)
  Phazing: Roar
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Protect, Reflect, Substitute
  Notable: Substitute

**Falinks-Mega** — forme, **RU**, tier source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one above)_
  Fighting | BST 570 (65/135/135/70/65/100)
  Abilities: Defiant (fixed by the forme)
  Engine stats @252 (neutral/positive): Defiant: Atk 369/405, SpA 239/262, Spe 299/328
  Held item: **Falinksite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Falinks (ZU), pre-Mega abilities: Battle Armor / Defiant
  STAB: Fighting Close Combat 120P
  Physical coverage: Bug Megahorn 120P, Ground High Horsepower 95P, Normal Take Down 90P, Steel Iron Head 80P, Poison Poison Jab 80P, Dark Throat Chop 80P
  Special coverage: Normal Uproar 90S
  Setup: Agility, Bulk Up, Iron Defense, No Retreat, Swords Dance
  Reliable recovery: Rest
  Priority: First Impression 90P Bug (+2), Upper Hand 65P Fighting (+3)
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute

**Feraligatr** — species, **RU**, tier source: imported (natdex)
  Water | BST 530 (85/105/100/79/83/78)
  Abilities: Torrent / Sheer Force
  Engine stats @252 (neutral/positive): Torrent: Atk 309/339, SpA 257/282, Spe 255/280 — Sheer Force: Atk 309/339, SpA 257/282, Spe 255/280
  Held item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Dragon Dragon Pulse 90S, Normal Uproar 90S, Rock Ancient Power 60S, Dark Snarl 55S
  Setup: Agility, Dragon Dance, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Aqua Jet 40P Water (+1)
  Pivot: Flip Turn
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Hail, Rain Dance
  Utility: Detect, Protect, Substitute
  Notable: Substitute

**Fezandipiti** — species, **RU**, tier source: imported (natdex)
  Poison/Fairy | BST 555 (88/91/82/70/125/99)
  Abilities: Toxic Chain / Technician
  Engine stats @252 (neutral/positive): Toxic Chain: Atk 281/309, SpA 239/262, Spe 297/326 — Technician: Atk 281/309, SpA 239/262, Spe 297/326
  Held item: **free**
  STAB: Poison Gunk Shot 120P · Fairy Moonblast 95S
  Physical coverage: Flying Brave Bird 120P, Fighting Double Kick 50x2P, Normal Take Down 90P, Dark Lash Out 75P, Ghost Shadow Claw 70P, Bug U-turn 70P
  Special coverage: Flying Hurricane 120S, Fire Heat Wave 100S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Ice Icy Wind 55S
  Setup: Agility, Calm Mind, Nasty Plot, Swords Dance
  Reliable recovery: Rest, Roost
  Priority: Quick Attack 40P Normal (+1)
  Pivot: U-turn
  Status: Toxic
  Utility: Light Screen, Protect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Forretress** — species, **RU**, tier source: imported (natdex)
  Bug/Steel | BST 465 (75/90/140/60/60/40)
  Abilities: Sturdy / Overcoat
  Engine stats @252 (neutral/positive): Sturdy: Atk 279/306, SpA 219/240, Spe 179/196 — Overcoat: Atk 279/306, SpA 219/240, Spe 179/196
  Held item: **free**
  STAB: Bug Bug Buzz 90S · Steel Steel Beam 140S
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Rock Stone Edge 100P, Fighting Body Press 80P, Ice Ice Spinner 80P, Poison Poison Jab 80P
  Special coverage: Electric Zap Cannon 120S, Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Normal Tera Blast 80S, Poison Venoshock 65S
  Setup: Autotomize, Defense Curl, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Drain/unreliable: Giga Drain
  Hazards: Spikes, Stealth Rock, Toxic Spikes
  Removal: Rapid Spin
  Pivot: Volt Switch
  Status: Thunder Wave, Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Gravity, Light Screen, Pain Split, Protect, Reflect, Substitute
  Notable: Substitute

**Froslass-Mega** — forme, **RU**, tier source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one above)_
  Ice/Ghost | BST 580 (70/80/70/140/100/120)
  Abilities: Snow Warning (fixed by the forme)
  Engine stats @252 (neutral/positive): Snow Warning: Atk 259/284, SpA 379/416, Spe 339/372
  Held item: **Froslassite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Froslass (ZU), pre-Mega abilities: Snow Cloak / Cursed Body
  STAB: Ice Blizzard 120S · Ghost Shadow Ball 80S
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Fighting Wake-Up Slap 70P, Grass Trailblaze 50P, Rock Rollout 30P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Normal Tera Blast 80S, Bug Signal Beam 75S, Water Water Pulse 60S, Fairy Draining Kiss 50S
  Reliable recovery: Rest
  Drain/unreliable: Draining Kiss, Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Ice Shard 40P Ice (+1)
  Hazards: Spikes
  Status: Sing, Thunder Wave, Toxic, Will-O-Wisp
  Trapping: Block
  Weather/terrain: Hail, Rain Dance, Snowscape
  Utility: Aurora Veil, Destiny Bond, Disable, Haze, Light Screen, Pain Split, Protect, Reflect, Safeguard, Substitute, Switcheroo, Taunt, Trick
  Notable: Trick, Switcheroo, Taunt, Substitute

**Gallade** — species, **RU**, tier source: imported (natdex)
  Psychic/Fighting | BST 518 (68/125/65/65/115/80)
  Abilities: Steadfast / Sharpness / Justified
  Engine stats @252 (neutral/positive): Steadfast: Atk 349/383, SpA 229/251, Spe 259/284 — Sharpness: Atk 349/383, SpA 229/251, Spe 259/284 — Justified: Atk 349/383, SpA 229/251, Spe 259/284
  Held item: **free**
  STAB: Psychic Zen Headbutt 80P · Fighting Focus Punch 150P
  Physical coverage: Grass Solar Blade 125 (charge)P, Normal Double-Edge 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Poison Poison Jab 80P
  Special coverage: Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Flying Air Slash 75S
  Setup: Agility, Bulk Up, Calm Mind, Defense Curl, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch, Draining Kiss, Dream Eater
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Shadow Sneak 40P Ghost (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Teleport
  Status: Hypnosis, Sing, Thunder Wave, Toxic, Will-O-Wisp
  Cleric/support: Life Dew, Wish
  Trapping: Mean Look
  Weather/terrain: Misty Terrain, Psychic Terrain, Rain Dance, Sunny Day
  Utility: Destiny Bond, Disable, Encore, Knock Off, Light Screen, Magic Coat, Memento, Pain Split, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room

**Gardevoir** — species, **RU**, tier source: imported (natdex)
  Psychic/Fairy | BST 518 (68/65/65/125/115/80)
  Abilities: Synchronize / Trace / Telepathy
  Engine stats @252 (neutral/positive): Synchronize: Atk 229/251, SpA 349/383, Spe 259/284 — Trace: Atk 229/251, SpA 349/383, Spe 259/284 — Telepathy: Atk 229/251, SpA 349/383, Spe 259/284
  Held item: **free**
  STAB: Psychic Future Sight 120S · Fairy Misty Explosion 100S
  Physical coverage: Normal Double-Edge 120P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Dark Knock Off 65P, Ghost Shadow Sneak 40P
  Special coverage: Fighting Focus Blast 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S
  Setup: Calm Mind, Defense Curl
  Reliable recovery: Rest
  Drain/unreliable: Draining Kiss, Dream Eater
  Priority: Shadow Sneak 40P Ghost (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Teleport
  Status: Hypnosis, Sing, Thunder Wave, Toxic, Will-O-Wisp
  Cleric/support: Heal Bell, Life Dew, Wish
  Trapping: Mean Look
  Weather/terrain: Misty Terrain, Psychic Terrain, Rain Dance, Sunny Day
  Utility: Destiny Bond, Disable, Encore, Gravity, Healing Wish, Knock Off, Light Screen, Magic Coat, Memento, Pain Split, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room

**Garganacl** — species, **RU**, tier source: imported (natdex)
  Rock | BST 500 (100/100/130/45/90/35)
  Abilities: Purifying Salt / Sturdy / Clear Body
  Engine stats @252 (neutral/positive): Purifying Salt: Atk 299/328, SpA 189/207, Spe 169/185 — Sturdy: Atk 299/328, SpA 189/207, Spe 169/185 — Clear Body: Atk 299/328, SpA 189/207, Spe 169/185
  Held item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Steel Heavy Slam 120P, Ground Earthquake 100P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Ground Earth Power 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S
  Setup: Harden, Iron Defense, Rock Polish
  Reliable recovery: Recover, Rest
  Hazards: Stealth Rock
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Gravity, Protect, Substitute
  Notable: Substitute

**Gastrodon** — species, **RU**, tier source: imported (natdex)
  Water/Ground | BST 475 (111/83/68/92/82/39)
  Abilities: Sticky Hold / Storm Drain / Sand Force
  Engine stats @252 (neutral/positive): Sticky Hold: Atk 265/291, SpA 283/311, Spe 177/194 — Storm Drain: Atk 265/291, SpA 283/311, Spe 177/194 — Sand Force: Atk 265/291, SpA 283/311, Spe 177/194
  Held item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Normal Return 102P, Rock Stone Edge 100P, Bug Skitter Smack 70P, Fighting Rock Smash 40P
  Special coverage: Normal Trump Card 200S, Ice Blizzard 120S, Poison Sludge Wave 95S, Rock Ancient Power 60S, Bug Infestation 20S, Psychic Mirror Coat fixedS
  Setup: Acid Armor, Amnesia, Harden
  Reliable recovery: Recover, Rest
  Hazards: Spikes, Stealth Rock
  Status: Toxic, Yawn
  Trapping: Block
  Weather/terrain: Hail, Rain Dance, Sandstorm, Snowscape
  Utility: Clear Smog, Memento, Pain Split, Protect, Substitute
  Notable: Substitute

**Golisopod** — species, **RU**, tier source: imported (natdex)
  Bug/Water | BST 530 (75/125/140/60/90/40)
  Abilities: Emergency Exit
  Engine stats @252 (neutral/positive): Emergency Exit: Atk 349/383, SpA 219/240, Spe 179/196
  Held item: **free**
  STAB: Bug First Impression 90P · Water Liquidation 85P
  Physical coverage: Fighting Close Combat 120P, Normal Return 102P, Dragon Dual Chop 50x2P, Ground Drill Run 80P, Steel Iron Head 80P, Poison Poison Jab 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Dark Dark Pulse 80S, Normal Hidden Power 60S, Ground Mud Shot 55S
  Setup: Bulk Up, Defense Curl, Harden, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Drain/unreliable: Leech Life
  Priority: First Impression 90P Bug (+2), Sucker Punch 80P Dark (+1), Aqua Jet 40P Water (+1)
  Hazards: Spikes
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Knock Off, Pain Split, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Golurk-Mega** — forme, **RU**, tier source: **estimated** _(its own `species.tier` reads PU — the base's; the enforced tier is the one above)_
  Ground/Ghost | BST 583 (89/159/105/70/105/55)
  Abilities: Unseen Fist (fixed by the forme)
  Engine stats @252 (neutral/positive): Unseen Fist: Atk 417/458, SpA 239/262, Spe 209/229
  Held item: **Golurkite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Golurk (PU), pre-Mega abilities: Iron Fist / Klutz / No Guard
  STAB: Ground Earthquake 100P · Ghost Poltergeist 110P
  Physical coverage: Normal Self-Destruct 200P, Fighting Focus Punch 150P, Fire Heat Crash 120P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Electric Thunderbolt 95S, Psychic Psychic 90S, Steel Flash Cannon 80S
  Setup: Defense Curl, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Hazards: Stealth Rock
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Gravity, Knock Off, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick
  Notable: Knock Off, Trick, Substitute

**Houndoom-Mega** — forme, **RU**, tier source: imported (natdex)
  Dark/Fire | BST 600 (75/90/90/140/90/115)
  Abilities: Solar Power (fixed by the forme)
  Engine stats @252 (neutral/positive): Solar Power: Atk 279/306, SpA 379/416, Spe 329/361
  Held item: **Houndoominite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Houndoom (ZU), pre-Mega abilities: Early Bird / Flash Fire / Unnerve
  STAB: Dark Dark Pulse 80S · Fire Overheat 140S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P, Electric Thunder Fang 65P, Grass Trailblaze 50P, Fighting Rock Smash 40P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Hyper Voice 90S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S, Ground Mud Shot 55S
  Setup: Nasty Plot
  Reliable recovery: Rest
  Drain/unreliable: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Feint 50P Normal (+2)
  Phazing: Roar
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Destiny Bond, Detect, Pain Split, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Infernape** — species, **RU**, tier source: override
  Fire/Fighting | BST 534 (76/104/71/104/71/108)
  Abilities: Blaze / Iron Fist
  Engine stats @252 (neutral/positive): Blaze: Atk 307/337, SpA 307/337, Spe 315/346 — Iron Fist: Atk 307/337, SpA 307/337, Spe 315/346
  Held item: **free**
  STAB: Fire Overheat 140S · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Ground Scorching Sands 70S
  Setup: Agility, Bulk Up, Calm Mind, Hone Claws, Nasty Plot, Swords Dance, Work Up
  Reliable recovery: Rest, Slack Off
  Drain/unreliable: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3), Mach Punch 40P Fighting (+1)
  Hazards: Stealth Rock
  Pivot: U-turn
  Phazing: Roar
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Encore, Knock Off, Protect, Substitute, Switcheroo, Taunt
  Notable: Knock Off, Switcheroo, Encore, Taunt, Substitute

**Iron Jugulis** — species, **RU**, tier source: imported (natdex)
  Dark/Flying | BST 570 (94/80/86/122/80/108)
  Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 259/284, SpA 343/377, Spe 315/346
  Held item: **free**
  STAB: Dark Crunch 80P · Flying Hurricane 120S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Bug U-turn 70P, Fire Fire Fang 65P
  Special coverage: Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Rock Meteor Beam 120 (charge)S, Dragon Dragon Pulse 90S, Ground Earth Power 90S
  Setup: Work Up
  Reliable recovery: Rest
  Pivot: U-turn
  Phazing: Dragon Tail, Roar
  Weather/terrain: Electric Terrain, Rain Dance, Sunny Day
  Utility: Knock Off, Protect, Substitute, Tailwind, Taunt
  Notable: Knock Off, Taunt, Substitute, Tailwind

**Iron Thorns** — species, **RU**, tier source: imported (natdex)
  Rock/Electric | BST 570 (100/134/110/70/84/72)
  Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 367/403, SpA 239/262, Spe 243/267
  Held item: **free**
  STAB: Rock Stone Edge 100P · Electric Supercell Slam 100P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Ground Earthquake 100P, Fighting Body Press 80P, Dark Crunch 80P, Dragon Dragon Claw 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Ground Earth Power 90S, Normal Tera Blast 80S, Dark Snarl 55S
  Setup: Charge, Dragon Dance, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Hazards: Spikes, Stealth Rock
  Pivot: Volt Switch
  Phazing: Dragon Tail
  Status: Thunder Wave
  Weather/terrain: Electric Terrain, Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Kleavor** — species, **RU**, tier source: imported (natdex)
  Bug/Rock | BST 500 (70/135/95/45/70/85)
  Abilities: Swarm / Sheer Force / Sharpness
  Engine stats @252 (neutral/positive): Swarm: Atk 369/405, SpA 189/207, Spe 269/295 — Sheer Force: Atk 369/405, SpA 189/207, Spe 269/295 — Sharpness: Atk 369/405, SpA 189/207, Spe 269/295
  Held item: **free**
  STAB: Bug Lunge 80P · Rock Stone Edge 100P
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Flying Acrobatics 110P, Poison Cross Poison 70P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Ghost Ominous Wind 60S, Fighting Vacuum Wave 40S
  Setup: Agility, Swords Dance
  Reliable recovery: Rest, Roost
  Priority: Feint 50P Normal (+2), Quick Attack 40P Normal (+1), Vacuum Wave 40S Fighting (+1)
  Hazards: Stealth Rock
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Knock Off, Light Screen, Protect, Safeguard, Substitute, Tailwind
  Notable: Knock Off, Substitute, Baton Pass, Tailwind

**Krookodile** — species, **RU**, tier source: imported (natdex)
  Ground/Dark | BST 519 (95/117/80/65/70/92)
  Abilities: Intimidate / Moxie / Anger Point
  Engine stats @252 (neutral/positive): Intimidate: Atk 333/366, SpA 229/251, Spe 283/311 — Moxie: Atk 333/366, SpA 229/251, Spe 283/311 — Anger Point: Atk 333/366, SpA 229/251, Spe 283/311
  Held item: **free**
  STAB: Ground Earthquake 100P · Dark Foul Play 95P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Poison Gunk Shot 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Fighting Focus Blast 120S, Dragon Dragon Pulse 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Grass Grass Knot 60S, Fire Incinerate 60S
  Setup: Bulk Up, Hone Claws
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Trapping: Block, Mean Look
  Weather/terrain: Sandstorm
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Latias** — species, **RU**, tier source: imported (natdex)
  Dragon/Psychic | BST 600 (80/80/90/110/130/110)
  Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 259/284, SpA 319/350, Spe 319/350
  Held item: **free**
  STAB: Dragon Draco Meteor 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Water Liquidation 85P, Dark Sucker Punch 80P, Ghost Shadow Claw 70P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Water Surf 95S, Fighting Aura Sphere 90S, Fairy Alluring Voice 80S
  Setup: Agility, Calm Mind, Dragon Dance, Hone Claws
  Reliable recovery: Recover, Rest, Roost
  Drain/unreliable: Draining Kiss, Dream Eater
  Priority: Sucker Punch 80P Dark (+1)
  Removal: Defog
  Pivot: Baton Pass
  Phazing: Roar
  Status: Thunder Wave, Toxic
  Cleric/support: Wish
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Healing Wish, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Tailwind, Trick
  Notable: Trick, Substitute, Baton Pass, Tailwind

**Linoone** — species, **RU**, tier source: imported (natdex)
  Normal | BST 420 (78/70/61/50/61/100)
  Abilities: Pickup / Gluttony / Quick Feet
  Engine stats @252 (neutral/positive): Pickup: Atk 239/262, SpA 199/218, Spe 299/328 — Gluttony: Atk 239/262, SpA 199/218, Spe 299/328 — Quick Feet: Atk 239/262, SpA 199/218, Spe 299/328
  Held item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Grass Seed Bomb 80P, Dark Throat Chop 80P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Water Surf 95S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Ground Mud Shot 55S
  Setup: Defense Curl, Hone Claws, Work Up
  Reliable recovery: Rest
  Priority: Extreme Speed 80P Normal (+2)
  Phazing: Roar
  Status: Thunder Wave, Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Switcheroo, Trick
  Notable: Trick, Switcheroo, Substitute

**Lokix** — species, **RU**, tier source: imported (natdex)
  Bug/Dark | BST 450 (71/102/78/52/55/92)
  Abilities: Swarm / Tinted Lens
  Engine stats @252 (neutral/positive): Swarm: Atk 303/333, SpA 203/223, Spe 283/311 — Tinted Lens: Atk 303/333, SpA 203/223, Spe 283/311
  Held item: **free**
  STAB: Bug First Impression 90P · Dark Sucker Punch 80P
  Physical coverage: Fighting Axe Kick 120P, Normal Double-Edge 120P, Flying Bounce 85 (charge)P, Grass Trailblaze 50P, Ghost Astonish 30P
  Special coverage: Normal Tera Blast 80S
  Setup: Agility, Swords Dance
  Reliable recovery: Rest
  Drain/unreliable: Leech Life
  Priority: First Impression 90P Bug (+2), Sucker Punch 80P Dark (+1), Feint 50P Normal (+2)
  Pivot: U-turn
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Lucario** — species, **RU**, tier source: imported (natdex)
  Fighting/Steel | BST 525 (70/110/70/115/70/90)
  Abilities: Steadfast / Inner Focus / Justified
  Engine stats @252 (neutral/positive): Steadfast: Atk 319/350, SpA 329/361, Spe 279/306 — Inner Focus: Atk 319/350, SpA 329/361, Spe 279/306 — Justified: Atk 319/350, SpA 329/361, Spe 279/306
  Held item: **free**
  STAB: Fighting Focus Punch 150P · Steel Steel Beam 140S
  Physical coverage: Normal Mega Kick 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Fire Blaze Kick 85P, Dark Crunch 80P
  Special coverage: Dragon Dragon Pulse 90S, Psychic Psychic 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Water Water Pulse 60S
  Setup: Agility, Bulk Up, Calm Mind, Hone Claws, Iron Defense, Nasty Plot, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Priority: Extreme Speed 80P Normal (+2), Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Bullet Punch 40P Steel (+1)
  Phazing: Circle Throw, Roar
  Status: Toxic
  Cleric/support: Life Dew
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Protect, Substitute
  Notable: Substitute

**Lycanroc-Dusk** — species, **RU**, tier source: imported (natdex)
  Rock | BST 487 (75/117/65/55/65/110)
  Abilities: Tough Claws
  Engine stats @252 (neutral/positive): Tough Claws: Atk 333/366, SpA 209/229, Spe 319/350
  Held item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Normal Last Resort 140P, Fighting Close Combat 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P
  Special coverage: Ground Earth Power 90S, Normal Hyper Voice 90S, Dark Snarl 55S
  Setup: Agility, Bulk Up, Iron Defense, Rock Polish, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1), Accelerock 40P Rock (+1), Quick Attack 40P Normal (+1)
  Hazards: Stealth Rock
  Phazing: Roar
  Status: Toxic
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Machamp** — species, **RU**, tier source: imported (natdex)
  Fighting | BST 505 (90/130/80/65/85/55)
  Abilities: Guts / No Guard / Steadfast
  Engine stats @252 (neutral/positive): Guts: Atk 359/394, SpA 229/251, Spe 209/229 — No Guard: Atk 359/394, SpA 229/251, Spe 209/229 — Steadfast: Atk 359/394, SpA 229/251, Spe 209/229
  Held item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Skull Bash 130P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P, Poison Poison Jab 80P
  Special coverage: Fire Fire Blast 120S, Normal Hidden Power 60S, Ground Mud-Slap 20S
  Setup: Bulk Up, Meditate, Work Up
  Reliable recovery: Rest
  Priority: Bullet Punch 40P Steel (+1), Vacuum Wave 40S Fighting (+1)
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Encore, Knock Off, Light Screen, Protect, Substitute
  Notable: Knock Off, Encore, Substitute

**Magnezone** — species, **RU**, tier source: imported (natdex)
  Electric/Steel | BST 535 (70/70/115/130/90/60)
  Abilities: Magnet Pull / Sturdy / Analytic
  Engine stats @252 (neutral/positive): Magnet Pull: Atk 239/262, SpA 359/394, Spe 219/240 — Sturdy: Atk 239/262, SpA 359/394, Spe 219/240 — Analytic: Atk 239/262, SpA 359/394, Spe 219/240
  Held item: **free**
  STAB: Electric Thunder 120S · Steel Steel Beam 140S
  Physical coverage: Normal Explosion 250P, Fighting Body Press 80P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S, Psychic Mirror Coat fixedS
  Setup: Barrier, Charge, Iron Defense
  Reliable recovery: Rest
  Pivot: Teleport, Volt Switch
  Status: Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Rain Dance, Sandstorm, Sunny Day
  Utility: Gravity, Light Screen, Magic Coat, Protect, Reflect, Substitute
  Notable: Substitute

**Malamar-Mega** — forme, **RU**, tier source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one above)_
  Dark/Psychic | BST 582 (86/102/88/98/120/88)
  Abilities: Contrary (fixed by the forme)
  Engine stats @252 (neutral/positive): Contrary: Atk 303/333, SpA 295/324, Spe 275/302
  Held item: **Malamarite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Malamar (ZU), pre-Mega abilities: Contrary / Suction Cups / Infiltrator
  STAB: Dark Foul Play 95P · Psychic Future Sight 120S
  Physical coverage: Fighting Superpower 120P, Normal Return 102P, Water Liquidation 85P, Bug Lunge 80P, Rock Rock Slide 75P, Flying Aerial Ace 60P
  Special coverage: Fire Flamethrower 95S, Electric Thunderbolt 95S, Normal Tera Blast 80S, Bug Signal Beam 75S
  Setup: Calm Mind, Nasty Plot
  Reliable recovery: Rest
  Pivot: Baton Pass
  Status: Hypnosis, Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Destiny Bond, Disable, Gravity, Knock Off, Light Screen, Protect, Reflect, Substitute, Switcheroo, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Switcheroo, Taunt, Substitute, Baton Pass, Trick Room

**Mandibuzz** — species, **RU**, tier source: imported (natdex)
  Dark/Flying | BST 510 (110/65/105/55/95/80)
  Abilities: Big Pecks / Overcoat / Weak Armor
  Engine stats @252 (neutral/positive): Big Pecks: Atk 229/251, SpA 209/229, Spe 259/284 — Overcoat: Atk 229/251, SpA 209/229, Spe 259/284 — Weak Armor: Atk 229/251, SpA 209/229, Spe 259/284
  Held item: **free**
  STAB: Dark Foul Play 95P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Ground Bone Rush 25x2-5P, Steel Steel Wing 70P, Bug U-turn 70P, Rock Rock Tomb 60P, Fighting Rock Smash 40P
  Special coverage: Fire Heat Wave 100S, Normal Uproar 90S, Ghost Shadow Ball 80S
  Setup: Iron Defense, Nasty Plot
  Reliable recovery: Rest, Roost
  Removal: Defog
  Pivot: U-turn
  Phazing: Whirlwind
  Status: Toxic
  Trapping: Block, Mean Look
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Knock Off, Protect, Substitute, Tailwind, Taunt
  Notable: Knock Off, Taunt, Substitute, Tailwind

**Manectric-Mega** — forme, **RU**, tier source: imported (natdex)
  Electric | BST 575 (70/75/80/135/80/135)
  Abilities: Intimidate (fixed by the forme)
  Engine stats @252 (neutral/positive): Intimidate: Atk 249/273, SpA 369/405, Spe 369/405
  Held item: **Manectite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Manectric (ZU), pre-Mega abilities: Static / Lightning Rod / Minus
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Fire Fire Fang 65P, Ice Ice Fang 65P
  Special coverage: Fire Overheat 140S, Normal Hyper Voice 90S, Bug Signal Beam 75S, Dark Snarl 55S, Ground Mud-Slap 20S
  Setup: Agility, Charge
  Reliable recovery: Rest
  Priority: Quick Attack 40P Normal (+1)
  Pivot: Volt Switch
  Phazing: Roar
  Status: Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Rain Dance
  Utility: Light Screen, Protect, Substitute, Switcheroo
  Notable: Switcheroo, Substitute

**Marowak-Alola** — species, **RU**, tier source: imported (natdex)
  Fire/Ghost | BST 425 (60/80/110/50/80/45)
  Abilities: Cursed Body / Lightning Rod / Rock Head
  Engine stats @252 (neutral/positive): Cursed Body: Atk 259/284, SpA 199/218, Spe 189/207 — Lightning Rod: Atk 259/284, SpA 199/218, Spe 189/207 — Rock Head: Atk 259/284, SpA 199/218, Spe 189/207
  Held item: **free**
  STAB: Fire Fire Blast 120S · Ghost Poltergeist 110P
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Ground Bonemerang 50x2P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Psychic Dream Eater 100S, Ground Earth Power 90S, Normal Uproar 90S
  Setup: Iron Defense, Swords Dance
  Reliable recovery: Rest
  Drain/unreliable: Dream Eater
  Hazards: Stealth Rock
  Status: Sing, Toxic, Will-O-Wisp
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Knock Off, Pain Split, Perish Song, Protect, Substitute
  Notable: Knock Off, Substitute

**Maushold** — species, **RU**, tier source: imported (natdex)
  Normal | BST 470 (74/75/70/65/75/111)
  Abilities: Friend Guard / Cheek Pouch / Technician
  Engine stats @252 (neutral/positive): Friend Guard: Atk 249/273, SpA 229/251, Spe 321/353 — Cheek Pouch: Atk 249/273, SpA 229/251, Spe 321/353 — Technician: Atk 249/273, SpA 229/251, Spe 321/353
  Held item: **free**
  STAB: Normal Population Bomb 20x10P
  Physical coverage: Ground Dig 100 (charge)P, Fairy Play Rough 90P, Dark Crunch 80P, Grass Seed Bomb 80P, Ghost Shadow Claw 70P, Bug U-turn 70P
  Special coverage: Grass Grass Knot 60S, Water Water Pulse 60S, Ground Mud Shot 55S
  Setup: Agility
  Reliable recovery: Rest
  Priority: Feint 50P Normal (+2)
  Removal: Tidy Up
  Pivot: Baton Pass, U-turn
  Status: Thunder Wave
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Encore, Protect, Substitute, Switcheroo, Taunt
  Notable: Switcheroo, Encore, Taunt, Substitute, Baton Pass

**Meloetta-Pirouette** — species, **RU**, tier source: override
  Normal/Fighting | BST 600 (100/128/90/77/77/128)
  Abilities: Serene Grace
  Engine stats @252 (neutral/positive): Serene Grace: Atk 355/390, SpA 253/278, Spe 355/390
  Held item: **free**
  STAB: Normal Last Resort 140P · Fighting Focus Punch 150P
  Physical coverage: Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Fairy Play Rough 90P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Grass Energy Ball 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
  Setup: Calm Mind, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch, Dream Eater
  Priority: Quick Attack 40P Normal (+1)
  Pivot: Baton Pass, U-turn
  Status: Sing, Thunder Wave, Toxic
  Cleric/support: Heal Bell
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Gravity, Knock Off, Light Screen, Magic Coat, Perish Song, Protect, Safeguard, Substitute, Trick, Trick Room
  Notable: Knock Off, Trick, Substitute, Baton Pass, Trick Room

**Meowstic-M-Mega** — forme, **RU**, tier source: override
  Psychic | BST 566 (74/48/76/143/101/124)
  Abilities: Trace (fixed by the forme)
  Engine stats @252 (neutral/positive): Trace: Atk 195/214, SpA 385/423, Spe 347/381
  Held item: **Meowsticite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Meowstic (ZU), pre-Mega abilities: Keen Eye / Infiltrator / Prankster
  STAB: Psychic Dream Eater 100S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Dark Sucker Punch 80P, Grass Trailblaze 50P
  Special coverage: Electric Thunderbolt 95S, Grass Energy Ball 90S, Fairy Alluring Voice 80S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S
  Setup: Barrier, Calm Mind, Nasty Plot, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Fake Out 40P Normal (+3)
  Pivot: Baton Pass
  Status: Thunder Wave, Toxic, Yawn
  Cleric/support: Heal Bell
  Trapping: Mean Look
  Weather/terrain: Misty Terrain, Psychic Terrain, Rain Dance, Sunny Day
  Utility: Gravity, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Baton Pass, Trick Room

**Mimikyu** — species, **RU**, tier source: imported (natdex)
  Ghost/Fairy | BST 476 (55/90/80/50/105/96)
  Abilities: Disguise
  Engine stats @252 (neutral/positive): Disguise: Atk 279/306, SpA 199/218, Spe 291/320
  Held item: **free**
  STAB: Ghost Phantom Force 90 (charge)P · Fairy Play Rough 90P
  Physical coverage: Normal Last Resort 140P, Grass Wood Hammer 120P, Bug Leech Life 80P, Fighting Drain Punch 75P, Dark Feint Attack 60P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Fire Burning Jealousy 70S
  Setup: Bulk Up, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch, Draining Kiss, Dream Eater, Giga Drain, Leech Life
  Priority: Shadow Sneak 40P Ghost (+1)
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Weather/terrain: Misty Terrain, Rain Dance, Sunny Day
  Utility: Destiny Bond, Light Screen, Pain Split, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

**Mimikyu-Busted** — species, **RU**, tier source: imported (natdex)
  Ghost/Fairy | BST 476 (55/90/80/50/105/96)
  Abilities: Disguise
  Engine stats @252 (neutral/positive): Disguise: Atk 279/306, SpA 199/218, Spe 291/320
  Held item: **free**
  STAB: Ghost Phantom Force 90 (charge)P · Fairy Play Rough 90P
  Physical coverage: Normal Last Resort 140P, Grass Wood Hammer 120P, Bug Leech Life 80P, Fighting Drain Punch 75P, Dark Feint Attack 60P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Fire Burning Jealousy 70S
  Setup: Bulk Up, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch, Draining Kiss, Dream Eater, Giga Drain, Leech Life
  Priority: Shadow Sneak 40P Ghost (+1)
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Weather/terrain: Misty Terrain, Rain Dance, Sunny Day
  Utility: Destiny Bond, Light Screen, Pain Split, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

**Muk-Alola** — species, **RU**, tier source: imported (natdex)
  Poison/Dark | BST 500 (105/105/75/65/100/50)
  Abilities: Poison Touch / Gluttony / Power of Alchemy
  Engine stats @252 (neutral/positive): Poison Touch: Atk 309/339, SpA 229/251, Spe 199/218 — Gluttony: Atk 309/339, SpA 229/251, Spe 199/218 — Power of Alchemy: Atk 309/339, SpA 229/251, Spe 199/218
  Held item: **free**
  STAB: Poison Gunk Shot 120P · Dark Foul Play 95P
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Bug Lunge 80P, Psychic Zen Headbutt 80P
  Special coverage: Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Fairy Moonblast 95S, Ghost Shadow Ball 80S, Normal Tera Blast 80S
  Setup: Acid Armor, Harden, Rock Polish
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch, Giga Drain, Mega Drain
  Priority: Shadow Sneak 40P Ghost (+1)
  Hazards: Toxic Spikes
  Status: Toxic
  Trapping: Block, Mean Look
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Clear Smog, Disable, Haze, Knock Off, Memento, Pain Split, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Munkidori** — species, **RU**, tier source: override
  Poison/Psychic | BST 555 (88/75/66/130/90/106)
  Abilities: Toxic Chain / Frisk
  Engine stats @252 (neutral/positive): Toxic Chain: Atk 249/273, SpA 359/394, Spe 311/342 — Frisk: Atk 249/273, SpA 359/394, Spe 311/342
  Held item: **free**
  STAB: Poison Sludge Wave 95S · Psychic Future Sight 120S
  Physical coverage: Ghost Poltergeist 110P, Dark Lash Out 75P, Normal Facade 70P, Bug U-turn 70P, Grass Trailblaze 50P
  Special coverage: Fighting Focus Blast 120S, Normal Uproar 90S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Ground Mud-Slap 20S
  Setup: Calm Mind, Nasty Plot
  Reliable recovery: Rest
  Priority: Fake Out 40P Normal (+3)
  Pivot: Baton Pass, Parting Shot, U-turn
  Status: Toxic
  Weather/terrain: Psychic Terrain
  Utility: Clear Smog, Light Screen, Protect, Substitute, Taunt, Trick
  Notable: Trick, Taunt, Substitute, Baton Pass

**Necrozma** — species, **RU**, tier source: imported (natdex)
  Psychic | BST 600 (97/107/101/127/89/79)
  Abilities: Prism Armor
  Engine stats @252 (neutral/positive): Prism Armor: Atk 313/344, SpA 353/388, Spe 257/282
  Held item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Dragon Outrage 120P, Normal Return 102P, Ground Earthquake 100P, Rock Stone Edge 100P, Steel Iron Head 80P, Bug X-Scissor 80P
  Special coverage: Normal Wring Out 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Fire Heat Wave 100S, Dragon Dragon Pulse 90S, Ground Earth Power 90S
  Setup: Autotomize, Calm Mind, Cosmic Power, Dragon Dance, Iron Defense, Rock Polish, Swords Dance
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Status: Thunder Wave, Toxic
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Gravity, Knock Off, Light Screen, Protect, Reflect, Substitute, Trick Room
  Notable: Knock Off, Substitute, Trick Room

**Nidoking** — species, **RU**, tier source: imported (natdex)
  Poison/Ground | BST 505 (81/102/77/85/75/85)
  Abilities: Poison Point / Rivalry / Sheer Force
  Engine stats @252 (neutral/positive): Poison Point: Atk 303/333, SpA 269/295, Spe 269/295 — Rivalry: Atk 303/333, SpA 269/295, Spe 269/295 — Sheer Force: Atk 303/333, SpA 269/295, Spe 269/295
  Held item: **free**
  STAB: Poison Sludge Wave 95S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Rock Head Smash 150P, Normal Skull Bash 130P, Bug Megahorn 120P, Dragon Outrage 120P, Steel Iron Tail 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Water Surf 95S, Dragon Dragon Pulse 90S
  Setup: Amnesia, Defense Curl, Hone Claws
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1)
  Hazards: Stealth Rock, Toxic Spikes
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Disable, Protect, Reflect, Substitute, Taunt
  Notable: Taunt, Substitute

**Nidoqueen** — species, **RU**, tier source: imported (natdex)
  Poison/Ground | BST 505 (90/92/87/75/85/76)
  Abilities: Poison Point / Rivalry / Sheer Force
  Engine stats @252 (neutral/positive): Poison Point: Atk 283/311, SpA 249/273, Spe 251/276 — Rivalry: Atk 283/311, SpA 249/273, Spe 251/276 — Sheer Force: Atk 283/311, SpA 249/273, Spe 251/276
  Held item: **free**
  STAB: Poison Sludge Wave 95S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Water Surf 95S, Dragon Dragon Pulse 90S
  Setup: Defense Curl, Hone Claws
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1)
  Hazards: Stealth Rock, Toxic Spikes
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Disable, Protect, Reflect, Substitute, Taunt
  Notable: Taunt, Substitute

**Nihilego** — species, **RU**, tier source: imported (natdex)
  Rock/Poison | BST 570 (109/53/47/127/131/103)
  Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 205/225, SpA 353/388, Spe 305/335
  Held item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Poison Sludge Wave 95S
  Physical coverage: Normal Return 102P, Dark Foul Play 95P, Steel Iron Head 80P, Psychic Zen Headbutt 80P
  Special coverage: Electric Thunder 120S, Psychic Psychic 90S, Fairy Dazzling Gleam 80S, Ghost Hex 65S, Grass Grass Knot 60S, Normal Hidden Power 60S
  Reliable recovery: Rest
  Hazards: Stealth Rock, Toxic Spikes
  Status: Thunder Wave, Toxic
  Weather/terrain: Sandstorm
  Utility: Clear Smog, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Safeguard, Substitute, Trick Room
  Notable: Knock Off, Substitute, Trick Room

**Noivern** — species, **RU**, tier source: imported (natdex)
  Flying/Dragon | BST 535 (85/70/80/97/80/123)
  Abilities: Frisk / Infiltrator / Telepathy
  Engine stats @252 (neutral/positive): Frisk: Atk 239/262, SpA 293/322, Spe 345/379 — Infiltrator: Atk 239/262, SpA 293/322, Spe 345/379 — Telepathy: Atk 239/262, SpA 293/322, Spe 345/379
  Held item: **free**
  STAB: Flying Sky Attack 140 (charge)P · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Electric Wild Charge 90P, Bug Leech Life 80P, Fighting Brick Break 75P, Ghost Shadow Claw 70P
  Special coverage: Normal Boomburst 140S, Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Fire Heat Wave 100S, Dark Dark Pulse 80S
  Setup: Agility, Dragon Dance, Hone Claws
  Reliable recovery: Rest, Roost
  Drain/unreliable: Absorb, Dream Eater, Leech Life
  Removal: Defog
  Pivot: U-turn
  Phazing: Dragon Tail, Whirlwind
  Status: Toxic
  Weather/terrain: Sunny Day
  Utility: Protect, Substitute, Switcheroo, Tailwind, Taunt
  Notable: Switcheroo, Taunt, Substitute, Tailwind

**Obstagoon** — species, **RU**, tier source: imported (natdex)
  Dark/Normal | BST 520 (93/90/101/60/81/95)
  Abilities: Reckless / Guts / Defiant
  Engine stats @252 (neutral/positive): Reckless: Atk 279/306, SpA 219/240, Spe 289/317 — Guts: Atk 279/306, SpA 219/240, Spe 289/317 — Defiant: Atk 279/306, SpA 219/240, Spe 289/317
  Held item: **free**
  STAB: Dark Throat Chop 80P · Normal Last Resort 140P
  Physical coverage: Fighting Close Combat 120P, Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Grass Seed Bomb 80P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Water Surf 95S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Ground Mud Shot 55S
  Setup: Bulk Up, Defense Curl, Hone Claws, Iron Defense, Work Up
  Reliable recovery: Rest
  Priority: Extreme Speed 80P Normal (+2)
  Pivot: Parting Shot
  Phazing: Roar
  Status: Thunder Wave, Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Knock Off, Protect, Substitute, Switcheroo, Taunt, Trick
  Notable: Knock Off, Trick, Switcheroo, Taunt, Substitute

**Ogerpon** — species, **RU**, tier source: imported (natdex)
  Grass | BST 550 (80/120/84/60/96/110)
  Abilities: Defiant
  Engine stats @252 (neutral/positive): Defiant: Atk 339/372, SpA 219/240, Spe 319/350
  Held item: **free**
  STAB: Grass Solar Blade 125 (charge)P
  Physical coverage: Fighting Superpower 120P, Fairy Play Rough 90P, Normal Take Down 90P, Dark Throat Chop 80P, Psychic Zen Headbutt 80P, Ground Stomping Tantrum 75P
  Special coverage: Normal Tera Blast 80S
  Setup: Growth, Swords Dance
  Reliable recovery: Rest
  Drain/unreliable: Giga Drain, Horn Leech
  Priority: Grassy Glide 70P Grass (+1), Quick Attack 40P Normal (+1)
  Hazards: Spikes
  Pivot: U-turn
  Weather/terrain: Grassy Terrain, Rain Dance, Sandstorm, Sunny Day
  Utility: Encore, Knock Off, Leech Seed, Protect, Substitute, Taunt
  Notable: Knock Off, Encore, Taunt, Substitute

**Oricorio-Pom-Pom** — species, **RU**, tier source: imported (natdex)
  Electric/Flying | BST 476 (75/70/70/98/70/93)
  Abilities: Dancer
  Engine stats @252 (neutral/positive): Dancer: Atk 239/262, SpA 295/324, Spe 285/313
  Held item: **free**
  STAB: Electric Revelation Dance 90S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Return 102P, Steel Steel Wing 70P, Bug U-turn 70P, Grass Trailblaze 50P, Fighting Reversal 20P
  Special coverage: Fairy Alluring Voice 80S, Normal Tera Blast 80S, Ice Icy Wind 55S
  Setup: Agility, Calm Mind, Quiver Dance, Swords Dance, Work Up
  Reliable recovery: Rest, Roost
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Safeguard, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Baton Pass, Tailwind

**Oricorio-Sensu** — species, **RU**, tier source: imported (natdex)
  Ghost/Flying | BST 476 (75/70/70/98/70/93)
  Abilities: Dancer
  Engine stats @252 (neutral/positive): Dancer: Atk 239/262, SpA 295/324, Spe 285/313
  Held item: **free**
  STAB: Ghost Revelation Dance 90S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Return 102P, Steel Steel Wing 70P, Bug U-turn 70P, Grass Trailblaze 50P, Fighting Reversal 20P
  Special coverage: Fairy Alluring Voice 80S, Normal Tera Blast 80S, Ice Icy Wind 55S
  Setup: Agility, Calm Mind, Quiver Dance, Swords Dance, Work Up
  Reliable recovery: Rest, Roost
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Safeguard, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Baton Pass, Tailwind

**Pangoro** — species, **RU**, tier source: imported (natdex)
  Fighting/Dark | BST 495 (95/124/78/69/71/58)
  Abilities: Iron Fist / Mold Breaker / Scrappy
  Engine stats @252 (neutral/positive): Iron Fist: Atk 347/381, SpA 237/260, Spe 215/236 — Mold Breaker: Atk 347/381, SpA 237/260, Spe 215/236 — Scrappy: Atk 347/381, SpA 237/260, Spe 215/236
  Held item: **free**
  STAB: Fighting Focus Punch 150P · Dark Foul Play 95P
  Physical coverage: Poison Gunk Shot 120P, Normal Mega Kick 120P, Dragon Outrage 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Steel Iron Head 80P
  Special coverage: Water Surf 95S, Normal Hyper Voice 90S, Poison Sludge Bomb 90S, Grass Grass Knot 60S, Bug Infestation 20S
  Setup: Bulk Up, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Priority: Bullet Punch 40P Steel (+1)
  Pivot: Parting Shot
  Phazing: Circle Throw, Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Pelipper** — species, **RU**, tier source: imported (natdex)
  Water/Flying | BST 440 (60/50/100/95/70/65)
  Abilities: Keen Eye / Drizzle / Rain Dish
  Engine stats @252 (neutral/positive): Keen Eye: Atk 199/218, SpA 289/317, Spe 229/251 — Drizzle: Atk 199/218, SpA 289/317, Spe 229/251 — Rain Dish: Atk 199/218, SpA 289/317, Spe 229/251
  Held item: **free**
  STAB: Water Hydro Pump 120S · Flying Hurricane 120S
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Grass Seed Bomb 80P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Ghost Ominous Wind 60S, Electric Shock Wave 60S, Dragon Twister 40S, Ground Mud-Slap 20S
  Setup: Agility
  Reliable recovery: Rest, Roost
  Priority: Quick Attack 40P Normal (+1)
  Removal: Defog
  Pivot: U-turn
  Status: Toxic
  Weather/terrain: Hail, Rain Dance, Snowscape
  Utility: Knock Off, Protect, Substitute, Tailwind
  Notable: Knock Off, Substitute, Tailwind

**Pidgeot-Mega** — forme, **RU**, tier source: imported (natdex)
  Normal/Flying | BST 579 (83/80/80/135/80/121)
  Abilities: No Guard (fixed by the forme)
  Engine stats @252 (neutral/positive): No Guard: Atk 259/284, SpA 369/405, Spe 341/375
  Held item: **Pidgeotite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Pidgeot (ZU), pre-Mega abilities: Keen Eye / Tangled Feet / Big Pecks
  STAB: Normal Uproar 90S · Flying Hurricane 120S
  Physical coverage: Steel Steel Wing 70P, Bug U-turn 70P, Dark Feint Attack 60P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S
  Setup: Agility, Work Up
  Reliable recovery: Rest, Roost
  Priority: Quick Attack 40P Normal (+1)
  Removal: Defog
  Pivot: U-turn
  Phazing: Whirlwind
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Protect, Reflect, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Politoed** — species, **RU**, tier source: imported (natdex)
  Water | BST 500 (90/75/75/90/100/70)
  Abilities: Water Absorb / Damp / Drizzle
  Engine stats @252 (neutral/positive): Water Absorb: Atk 249/273, SpA 279/306, Spe 239/262 — Damp: Atk 249/273, SpA 279/306, Spe 239/262 — Drizzle: Atk 249/273, SpA 279/306, Spe 239/262
  Held item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Earthquake 100P, Flying Bounce 85 (charge)P, Ice Ice Punch 75P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Ground Earth Power 90S, Normal Hyper Voice 90S, Psychic Psychic 90S
  Setup: Amnesia, Defense Curl
  Reliable recovery: Rest
  Status: Hypnosis, Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Detect, Encore, Haze, Perish Song, Protect, Substitute
  Notable: Encore, Substitute

**Porygon2** — species, **RU**, tier source: override
  Normal | BST 515 (85/80/90/105/95/60)
  Abilities: Trace / Download / Analytic
  Engine stats @252 (neutral/positive): Trace: Atk 259/284, SpA 309/339, Spe 219/240 — Download: Atk 259/284, SpA 309/339, Spe 219/240 — Analytic: Atk 259/284, SpA 309/339, Spe 219/240
  Held item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Flying Aerial Ace 60P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
  Setup: Agility, Barrier, Charge, Defense Curl, Sharpen
  Reliable recovery: Recover, Rest
  Drain/unreliable: Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Gravity, Magic Coat, Pain Split, Protect, Reflect, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

**Quagsire** — species, **RU**, tier source: imported (natdex)
  Water/Ground | BST 430 (95/85/85/65/65/35)
  Abilities: Damp / Water Absorb / Unaware
  Engine stats @252 (neutral/positive): Damp: Atk 269/295, SpA 229/251, Spe 169/185 — Water Absorb: Atk 269/295, SpA 229/251, Spe 169/185 — Unaware: Atk 269/295, SpA 229/251, Spe 169/185
  Held item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ice Ice Punch 75P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Tera Blast 80S, Rock Ancient Power 60S, Bug Infestation 20S
  Setup: Amnesia, Defense Curl
  Reliable recovery: Recover, Rest
  Drain/unreliable: Drain Punch
  Hazards: Spikes, Stealth Rock, Toxic Spikes
  Status: Toxic, Yawn
  Weather/terrain: Hail, Rain Dance, Sandstorm, Snowscape
  Utility: Encore, Haze, Protect, Safeguard, Substitute
  Notable: Encore, Substitute

**Raichu-Mega-X** — forme, **RU**, tier source: override
  Electric | BST 585 (60/135/95/90/95/110)
  Abilities: Electric Surge (fixed by the forme)
  Engine stats @252 (neutral/positive): Electric Surge: Atk 369/405, SpA 279/306, Spe 319/350
  Held item: **Raichunite X** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Raichu (ZU), pre-Mega abilities: Static / Lightning Rod
  STAB: Electric Rising Voltage 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Grass Grass Knot 60S
  Setup: Agility, Calm Mind, Charge, Defense Curl, Nasty Plot
  Reliable recovery: Rest
  Drain/unreliable: Draining Kiss
  Priority: Extreme Speed 80P Normal (+2), Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3)
  Pivot: Volt Switch
  Status: Nuzzle, Sing, Thunder Wave, Toxic, Yawn
  Cleric/support: Wish
  Weather/terrain: Electric Terrain, Rain Dance
  Utility: Detect, Encore, Knock Off, Light Screen, Protect, Reflect, Safeguard, Substitute
  Notable: Knock Off, Encore, Substitute

**Regidrago** — species, **RU**, tier source: imported (natdex)
  Dragon | BST 580 (200/100/50/100/50/80)
  Abilities: Dragon's Maw
  Engine stats @252 (neutral/positive): Dragon's Maw: Atk 299/328, SpA 299/328, Spe 259/284
  Held item: **free**
  STAB: Dragon Dragon Energy 150S
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Fighting Hammer Arm 100P, Dark Crunch 80P, Fire Fire Fang 65P, Ice Ice Fang 65P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S, Rock Ancient Power 60S
  Setup: Dragon Dance
  Reliable recovery: Rest
  Utility: Light Screen, Protect, Reflect, Substitute
  Notable: Substitute

**Registeel** — species, **RU**, tier source: imported (natdex)
  Steel | BST 580 (80/75/150/75/150/50)
  Abilities: Clear Body / Light Metal
  Engine stats @252 (neutral/positive): Clear Body: Atk 249/273, SpA 249/273, Spe 199/218 — Light Metal: Atk 249/273, SpA 249/273, Spe 199/218
  Held item: **free**
  STAB: Steel Steel Beam 140S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Ground Earthquake 100P, Ice Ice Spinner 80P, Rock Rock Slide 75P, Electric Thunder Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Normal Tera Blast 80S, Ground Mud-Slap 20S
  Setup: Amnesia, Defense Curl, Hone Claws, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Status: Thunder Wave, Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Gravity, Protect, Safeguard, Substitute
  Notable: Substitute

**Reuniclus** — species, **RU**, tier source: imported (natdex)
  Psychic | BST 490 (110/65/75/125/85/30)
  Abilities: Overcoat / Magic Guard / Regenerator
  Engine stats @252 (neutral/positive): Overcoat: Atk 229/251, SpA 349/383, Spe 159/174 — Magic Guard: Atk 229/251, SpA 349/383, Spe 159/174 — Regenerator: Atk 229/251, SpA 349/383, Spe 159/174
  Held item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Steel Steel Roller 130P, Fire Fire Punch 75P, Ice Ice Punch 75P, Rock Rock Slide 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Energy Ball 90S, Steel Flash Cannon 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S
  Setup: Acid Armor, Calm Mind, Iron Defense
  Reliable recovery: Recover, Rest
  Drain/unreliable: Drain Punch, Dream Eater
  Status: Thunder Wave, Toxic
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Encore, Gravity, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Substitute, Trick Room

**Revavroom** — species, **RU**, tier source: imported (natdex)
  Steel/Poison | BST 500 (80/119/90/54/67/90)
  Abilities: Overcoat / Filter
  Engine stats @252 (neutral/positive): Overcoat: Atk 337/370, SpA 207/227, Spe 279/306 — Filter: Atk 337/370, SpA 207/227, Spe 279/306
  Held item: **free**
  STAB: Steel Hard Press 100P · Poison Gunk Shot 120P
  Physical coverage: Normal Self-Destruct 200P, Ground High Horsepower 95P, Psychic Zen Headbutt 80P, Dark Lash Out 75P, Fire Temper Flare 75P, Ghost Lick 30P
  Special coverage: Fire Overheat 140S, Normal Uproar 90S
  Setup: Iron Defense, Shift Gear
  Reliable recovery: Rest
  Hazards: Toxic Spikes
  Pivot: Parting Shot
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Haze, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Ribombee** — species, **RU**, tier source: imported (natdex)
  Bug/Fairy | BST 464 (60/55/60/95/70/124)
  Abilities: Honey Gather / Shield Dust / Sweet Veil
  Engine stats @252 (neutral/positive): Honey Gather: Atk 209/229, SpA 289/317, Spe 347/381 — Shield Dust: Atk 209/229, SpA 289/317, Spe 347/381 — Sweet Veil: Atk 209/229, SpA 289/317, Spe 347/381
  Held item: **free**
  STAB: Bug Bug Buzz 90S · Fairy Moonblast 95S
  Physical coverage: Normal Last Resort 140P, Flying Acrobatics 110P, Dark Thief 60P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Tera Blast 80S
  Setup: Agility, Calm Mind, Quiver Dance
  Reliable recovery: Rest, Roost
  Drain/unreliable: Absorb, Draining Kiss, Dream Eater, Leech Life
  Hazards: Sticky Web
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Stun Spore, Toxic
  Cleric/support: Aromatherapy
  Weather/terrain: Sunny Day
  Utility: Light Screen, Protect, Reflect, Safeguard, Substitute, Switcheroo, Tailwind, Trick
  Notable: Trick, Switcheroo, Substitute, Baton Pass, Tailwind

**Roserade** — species, **RU**, tier source: imported (natdex)
  Grass/Poison | BST 515 (60/70/65/125/105/90)
  Abilities: Natural Cure / Poison Point / Technician
  Engine stats @252 (neutral/positive): Natural Cure: Atk 239/262, SpA 349/383, Spe 279/306 — Poison Point: Atk 239/262, SpA 349/383, Spe 279/306 — Technician: Atk 239/262, SpA 349/383, Spe 279/306
  Held item: **free**
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Double-Edge 120P, Bug Pin Missile 25x2-5P
  Special coverage: Normal Uproar 90S, Fairy Dazzling Gleam 80S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S, Ground Mud-Slap 20S
  Setup: Growth, Swords Dance
  Reliable recovery: Rest
  Drain/unreliable: Absorb, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1)
  Hazards: Spikes, Toxic Spikes
  Status: Grass Whistle, Sleep Powder, Stun Spore, Toxic
  Cleric/support: Aromatherapy, Life Dew
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Leech Seed, Protect, Substitute
  Notable: Substitute

**Sandy Shocks** — species, **RU**, tier source: imported (natdex)
  Electric/Ground | BST 570 (85/81/97/121/85/101)
  Abilities: Protosynthesis
  Engine stats @252 (neutral/positive): Protosynthesis: Atk 261/287, SpA 341/375, Spe 301/331
  Held item: **free**
  STAB: Electric Thunder 120S · Ground Earthquake 100P
  Physical coverage: Normal Take Down 90P, Fighting Body Press 80P, Steel Heavy Slam 40P
  Special coverage: Steel Flash Cannon 80S, Rock Power Gem 80S, Normal Tera Blast 80S, Psychic Mirror Coat fixedS
  Setup: Charge, Iron Defense
  Reliable recovery: Rest
  Hazards: Spikes, Stealth Rock
  Pivot: Volt Switch
  Status: Thunder Wave
  Weather/terrain: Electric Terrain, Sandstorm, Sunny Day
  Utility: Gravity, Light Screen, Protect, Reflect, Substitute
  Notable: Substitute

**Sceptile-Mega** — forme, **RU**, tier source: imported (natdex)
  Grass/Dragon | BST 630 (70/110/75/145/85/145)
  Abilities: Lightning Rod (fixed by the forme)
  Engine stats @252 (neutral/positive): Lightning Rod: Atk 319/350, SpA 389/427, Spe 389/427
  Held item: **Sceptilite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Sceptile (ZU), pre-Mega abilities: Overgrow / Unburden
  STAB: Grass Leaf Storm 140S · Dragon Outrage 120P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Ground Mud-Slap 20S
  Setup: Agility, Dragon Dance, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Absorb, Drain Punch, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1), Upper Hand 65P Fighting (+3), Quick Attack 40P Normal (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Shed Tail
  Phazing: Dragon Tail, Roar
  Status: Grass Whistle, Toxic
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Detect, Leech Seed, Protect, Safeguard, Substitute
  Notable: Substitute

**Scovillain-Mega** — forme, **RU**, tier source: override
  Grass/Fire | BST 586 (65/138/85/138/85/75)
  Abilities: Spicy Spray (fixed by the forme)
  Engine stats @252 (neutral/positive): Spicy Spray: Atk 375/412, SpA 375/412, Spe 249/273
  Held item: **Scovillainite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Scovillain (ZU), pre-Mega abilities: Chlorophyll / Insomnia / Moody
  STAB: Grass Leaf Storm 140S · Fire Overheat 140S
  Physical coverage: Normal Take Down 90P, Dark Crunch 80P, Psychic Zen Headbutt 80P, Ground Stomping Tantrum 75P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S
  Setup: Growth
  Reliable recovery: Rest
  Drain/unreliable: Giga Drain
  Priority: Grassy Glide 70P Grass (+1)
  Status: Will-O-Wisp
  Weather/terrain: Grassy Terrain, Sandstorm, Sunny Day
  Utility: Leech Seed, Protect, Substitute
  Notable: Substitute

**Seismitoad** — species, **RU**, tier source: imported (natdex)
  Water/Ground | BST 509 (105/95/75/85/75/74)
  Abilities: Swift Swim / Poison Touch / Water Absorb
  Engine stats @252 (neutral/positive): Swift Swim: Atk 289/317, SpA 269/295, Spe 247/271 — Poison Touch: Atk 289/317, SpA 269/295, Spe 247/271 — Water Absorb: Atk 289/317, SpA 269/295, Spe 247/271
  Held item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Grass Power Whip 120P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P, Ice Ice Punch 75P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Hyper Voice 90S, Grass Grass Knot 60S, Ice Icy Wind 55S, Bug Infestation 20S
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Hazards: Stealth Rock
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute

**Sharpedo** — species, **RU**, tier source: imported (natdex)
  Water/Dark | BST 460 (70/120/40/95/40/95)
  Abilities: Rough Skin / Speed Boost
  Engine stats @252 (neutral/positive): Rough Skin: Atk 339/372, SpA 289/317, Spe 289/317 — Speed Boost: Atk 339/372, SpA 289/317, Spe 289/317
  Held item: **free**
  STAB: Water Hydro Pump 120S · Dark Crunch 80P
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Ground Earthquake 100P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Rock Ancient Power 60S, Ground Mud-Slap 20S
  Setup: Agility
  Reliable recovery: Rest
  Priority: Feint 50P Normal (+2), Aqua Jet 40P Water (+1)
  Pivot: Flip Turn
  Phazing: Roar
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Destiny Bond, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Sigilyph** — species, **RU**, tier source: imported (natdex)
  Psychic/Flying | BST 490 (72/58/80/103/80/97)
  Abilities: Wonder Skin / Magic Guard / Tinted Lens
  Engine stats @252 (neutral/positive): Wonder Skin: Atk 215/236, SpA 305/335, Spe 293/322 — Magic Guard: Atk 215/236, SpA 305/335, Spe 293/322 — Tinted Lens: Atk 215/236, SpA 305/335, Spe 293/322
  Held item: **free**
  STAB: Psychic Future Sight 120S · Flying Air Slash 75S
  Physical coverage: Normal Return 102P, Steel Steel Wing 70P, Dark Thief 60P, Rock Smack Down 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Fire Heat Wave 100S, Ice Ice Beam 95S, Dark Dark Pulse 80S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S
  Setup: Calm Mind, Cosmic Power
  Reliable recovery: Rest, Roost
  Drain/unreliable: Dream Eater
  Removal: Defog
  Phazing: Whirlwind
  Status: Hypnosis, Thunder Wave, Toxic
  Weather/terrain: Rain Dance
  Utility: Gravity, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Tailwind, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room, Tailwind

**Sinistcha** — species, **RU**, tier source: imported (natdex)
  Grass/Ghost | BST 508 (71/60/106/121/80/70)
  Abilities: Hospitality / Heatproof
  Engine stats @252 (neutral/positive): Hospitality: Atk 219/240, SpA 341/375, Spe 239/262 — Heatproof: Atk 219/240, SpA 341/375, Spe 239/262
  Held item: **free**
  STAB: Grass Leaf Storm 140S · Ghost Shadow Ball 80S
  Physical coverage: Dark Foul Play 95P
  Special coverage: Normal Uproar 90S, Water Scald 80S
  Setup: Calm Mind, Iron Defense, Nasty Plot, Withdraw
  Reliable recovery: Rest
  Drain/unreliable: Absorb, Giga Drain, Matcha Gotcha, Mega Drain
  Status: Stun Spore
  Cleric/support: Life Dew
  Weather/terrain: Grassy Terrain
  Utility: Memento, Pain Split, Protect, Reflect, Substitute, Trick Room
  Notable: Substitute, Trick Room

**Sirfetch’d** — species, **RU**, tier source: imported (natdex)
  Fighting | BST 507 (62/135/95/68/82/65)
  Abilities: Steadfast / Scrappy
  Engine stats @252 (neutral/positive): Steadfast: Atk 369/405, SpA 235/258, Spe 229/251 — Scrappy: Atk 369/405, SpA 235/258, Spe 229/251
  Held item: **free**
  STAB: Fighting Close Combat 120P
  Physical coverage: Normal Last Resort 140P, Flying Sky Attack 140 (charge)P, Grass Solar Blade 125 (charge)P, Steel Iron Tail 100P, Bug First Impression 90P, Poison Poison Jab 80P
  Special coverage: Normal Trump Card 200S, Fire Heat Wave 100S, Flying Air Slash 75S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S
  Setup: Agility, Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest, Roost
  Priority: First Impression 90P Bug (+2), Grassy Glide 70P Grass (+1), Feint 50P Normal (+2), Quick Attack 40P Normal (+1)
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Phazing: Whirlwind
  Status: Toxic, Yawn
  Cleric/support: Wish
  Weather/terrain: Sunny Day
  Utility: Detect, Knock Off, Protect, Reflect, Substitute, Tailwind
  Notable: Knock Off, Substitute, Baton Pass, Tailwind

**Skeledirge** — species, **RU**, tier source: imported (natdex)
  Fire/Ghost | BST 530 (104/75/100/110/75/66)
  Abilities: Blaze / Unaware
  Engine stats @252 (neutral/positive): Blaze: Atk 249/273, SpA 319/350, Spe 231/254 — Unaware: Atk 249/273, SpA 319/350, Spe 231/254
  Held item: **free**
  STAB: Fire Overheat 140S · Ghost Poltergeist 110P
  Physical coverage: Dragon Outrage 120P, Ground Earthquake 100P, Normal Take Down 90P, Dark Crunch 80P, Grass Seed Bomb 80P, Psychic Zen Headbutt 80P
  Special coverage: Poison Belch 120S, Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Normal Hyper Voice 90S, Fairy Alluring Voice 80S, Dark Snarl 55S
  Reliable recovery: Rest, Slack Off
  Phazing: Roar
  Status: Sing, Will-O-Wisp, Yawn
  Weather/terrain: Sunny Day
  Utility: Encore, Protect, Substitute
  Notable: Encore, Substitute

**Slither Wing** — species, **RU**, tier source: imported (natdex)
  Bug/Fighting | BST 570 (85/135/79/85/105/81)
  Abilities: Protosynthesis
  Engine stats @252 (neutral/positive): Protosynthesis: Atk 369/405, SpA 269/295, Spe 261/287
  Held item: **free**
  STAB: Bug First Impression 90P · Fighting Close Combat 120P
  Physical coverage: Normal Double-Edge 120P, Fire Flare Blitz 120P, Flying Acrobatics 110P, Ground Earthquake 100P, Electric Wild Charge 90P, Psychic Zen Headbutt 80P
  Special coverage: Flying Hurricane 120S, Fire Heat Wave 100S, Normal Tera Blast 80S, Grass Giga Drain 75S
  Setup: Bulk Up
  Reliable recovery: Rest
  Drain/unreliable: Giga Drain, Leech Life
  Priority: First Impression 90P Bug (+2)
  Pivot: U-turn
  Phazing: Whirlwind
  Status: Poison Powder, Stun Spore, Will-O-Wisp
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute

**Slurpuff** — species, **RU**, tier source: imported (natdex)
  Fairy | BST 480 (82/80/86/85/75/72)
  Abilities: Sweet Veil / Unburden
  Engine stats @252 (neutral/positive): Sweet Veil: Atk 259/284, SpA 269/295, Spe 243/267 — Unburden: Atk 259/284, SpA 269/295, Spe 243/267
  Held item: **free**
  STAB: Fairy Misty Explosion 100S
  Physical coverage: Normal Return 102P, Fighting Drain Punch 75P, Dark Thief 60P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Fire Flamethrower 95S, Water Surf 95S, Grass Energy Ball 90S, Normal Hidden Power 60S
  Setup: Amnesia, Calm Mind, Cotton Guard
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch, Draining Kiss, Dream Eater
  Hazards: Sticky Web
  Status: Toxic, Yawn
  Cleric/support: Aromatherapy, Heal Bell, Wish
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Light Screen, Magic Coat, Protect, Safeguard, Substitute
  Notable: Substitute

**Steelix** — species, **RU**, tier source: imported (natdex)
  Steel/Ground | BST 510 (75/85/200/55/65/30)
  Abilities: Rock Head / Sturdy / Sheer Force
  Engine stats @252 (neutral/positive): Rock Head: Atk 269/295, SpA 209/229, Spe 159/174 — Sturdy: Atk 269/295, SpA 209/229, Spe 159/174 — Sheer Force: Atk 269/295, SpA 209/229, Spe 159/174
  Held item: **free**
  STAB: Steel Steel Beam 140S · Ground Earthquake 100P
  Physical coverage: Normal Explosion 250P, Rock Head Smash 150P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Fighting Body Press 80P, Dark Crunch 80P
  Special coverage: Rock Meteor Beam 120 (charge)S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Normal Hidden Power 60S
  Setup: Autotomize, Defense Curl, Dragon Dance, Harden, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Steelix-Mega** — forme, **RU**, tier source: imported (natdex)
  Steel/Ground | BST 610 (75/125/230/55/95/30)
  Abilities: Sand Force (fixed by the forme)
  Engine stats @252 (neutral/positive): Sand Force: Atk 349/383, SpA 209/229, Spe 159/174
  Held item: **Steelixite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Steelix (RU), pre-Mega abilities: Rock Head / Sturdy / Sheer Force
  STAB: Steel Steel Roller 130P · Ground Earthquake 100P
  Physical coverage: Normal Explosion 250P, Rock Head Smash 150P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Fighting Body Press 80P, Dark Crunch 80P
  Special coverage: Rock Meteor Beam 120 (charge)S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Normal Hidden Power 60S
  Setup: Autotomize, Defense Curl, Dragon Dance, Harden, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Suicune** — species, **RU**, tier source: imported (natdex)
  Water | BST 580 (100/75/115/90/115/85)
  Abilities: Pressure / Inner Focus / Water Absorb
  Engine stats @252 (neutral/positive): Pressure: Atk 249/273, SpA 279/306, Spe 269/295 — Inner Focus: Atk 249/273, SpA 279/306, Spe 269/295 — Water Absorb: Atk 249/273, SpA 279/306, Spe 269/295
  Held item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Ice Ice Fang 65P, Grass Trailblaze 50P
  Special coverage: Ice Blizzard 120S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Flying Air Slash 75S, Bug Signal Beam 75S
  Setup: Agility, Calm Mind
  Reliable recovery: Rest
  Priority: Extreme Speed 80P Normal (+2)
  Phazing: Roar
  Status: Toxic
  Weather/terrain: Hail, Rain Dance, Sandstorm, Snowscape, Sunny Day
  Utility: Detect, Protect, Reflect, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Swellow** — species, **RU**, tier source: imported (natdex)
  Normal/Flying | BST 455 (60/85/60/75/50/125)
  Abilities: Guts / Scrappy
  Engine stats @252 (neutral/positive): Guts: Atk 269/295, SpA 249/273, Spe 349/383 — Scrappy: Atk 269/295, SpA 249/273, Spe 349/383
  Held item: **free**
  STAB: Normal Boomburst 140S · Flying Sky Attack 140 (charge)P
  Physical coverage: Steel Steel Wing 70P, Bug U-turn 70P, Dark Thief 60P, Fighting Reversal 20P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S
  Setup: Agility, Work Up
  Reliable recovery: Rest, Roost
  Priority: Quick Attack 40P Normal (+1)
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Phazing: Whirlwind
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Tailwind
  Notable: Substitute, Baton Pass, Tailwind

**Talonflame** — species, **RU**, tier source: imported (natdex)
  Fire/Flying | BST 499 (78/81/71/74/69/126)
  Abilities: Flame Body / Gale Wings
  Engine stats @252 (neutral/positive): Flame Body: Atk 261/287, SpA 247/271, Spe 351/386 — Gale Wings: Atk 261/287, SpA 247/271, Spe 351/386
  Held item: **free**
  STAB: Fire Overheat 140S · Flying Brave Bird 120P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Fighting Upper Hand 65P, Dark Thief 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Tera Blast 80S
  Setup: Agility, Bulk Up, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest, Roost
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Quick Attack 40P Normal (+1)
  Removal: Defog
  Pivot: U-turn
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Tangrowth** — species, **RU**, tier source: imported (natdex)
  Grass | BST 535 (100/100/125/110/50/50)
  Abilities: Chlorophyll / Leaf Guard / Regenerator
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 299/328, SpA 319/350, Spe 199/218 — Leaf Guard: Atk 299/328, SpA 319/350, Spe 199/218 — Regenerator: Atk 299/328, SpA 319/350, Spe 199/218
  Held item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Skull Bash 130P, Ground Earthquake 100P, Poison Poison Jab 80P, Fighting Brick Break 75P, Rock Rock Slide 75P, Dark Knock Off 65P
  Special coverage: Fighting Focus Blast 120S, Normal Wring Out 120S, Poison Sludge Bomb 90S, Rock Ancient Power 60S, Electric Shock Wave 60S, Psychic Confusion 50S
  Setup: Amnesia, Growth, Swords Dance
  Reliable recovery: Rest
  Drain/unreliable: Absorb, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1)
  Status: Poison Powder, Sleep Powder, Stun Spore, Toxic
  Trapping: Block
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Knock Off, Leech Seed, Pain Split, Protect, Reflect, Substitute
  Notable: Knock Off, Substitute

**Tapu Bulu** — species, **RU**, tier source: imported (natdex)
  Grass/Fairy | BST 570 (70/130/115/85/95/75)
  Abilities: Grassy Surge / Telepathy
  Engine stats @252 (neutral/positive): Grassy Surge: Atk 359/394, SpA 269/295, Spe 249/273 — Telepathy: Atk 359/394, SpA 269/295, Spe 249/273
  Held item: **free**
  STAB: Grass Wood Hammer 120P · Fairy Dazzling Gleam 80S **(wrong category)**
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Bug Megahorn 120P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground High Horsepower 95P
  Special coverage: Fighting Focus Blast 120S, Normal Hidden Power 60S, Dark Snarl 55S, Psychic Stored Power 20S
  Setup: Bulk Up, Calm Mind, Iron Defense, Swords Dance, Withdraw, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Giga Drain, Horn Leech, Mega Drain
  Phazing: Roar, Whirlwind
  Status: Toxic
  Trapping: Mean Look
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Disable, Leech Seed, Light Screen, Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Taunt, Substitute

**Tatsugiri-Curly-Mega** — forme, **RU**, tier source: override
  Dragon/Water | BST 575 (68/65/90/135/125/92)
  Abilities: Commander (fixed by the forme)
  Engine stats @252 (neutral/positive): Commander: Atk 229/251, SpA 369/405, Spe 283/311
  Held item: **Tatsugirinite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Tatsugiri (PU), pre-Mega abilities: Commander / Storm Drain
  STAB: Dragon Draco Meteor 140S · Water Hydro Pump 120S
  Physical coverage: Normal Take Down 90P, Bug Lunge 80P, Fighting Counter fixedP
  Special coverage: Normal Tera Blast 80S, Ice Icy Wind 55S, Psychic Mirror Coat fixedS
  Setup: Dragon Dance, Harden, Nasty Plot
  Reliable recovery: Rest
  Removal: Rapid Spin
  Pivot: Baton Pass
  Weather/terrain: Rain Dance
  Utility: Memento, Protect, Substitute, Taunt
  Notable: Taunt, Substitute, Baton Pass

**Tinkaton** — species, **RU**, tier source: imported (natdex)
  Fairy/Steel | BST 506 (85/75/77/70/105/94)
  Abilities: Mold Breaker / Own Tempo / Pickpocket
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 249/273, SpA 239/262, Spe 287/315 — Own Tempo: Atk 249/273, SpA 239/262, Spe 287/315 — Pickpocket: Atk 249/273, SpA 239/262, Spe 287/315
  Held item: **free**
  STAB: Fairy Play Rough 90P · Steel Gigaton Hammer 160P
  Physical coverage: Ice Ice Hammer 100P, Rock Stone Edge 100P, Dark Foul Play 95P, Normal Slam 80P, Fighting Brick Break 75P, Bug Skitter Smack 70P
  Special coverage: Normal Tera Blast 80S
  Setup: Swords Dance
  Reliable recovery: Rest
  Drain/unreliable: Draining Kiss
  Priority: Feint 50P Normal (+2), Fake Out 40P Normal (+3)
  Hazards: Stealth Rock
  Status: Thunder Wave
  Utility: Encore, Knock Off, Light Screen, Protect, Reflect, Substitute
  Notable: Knock Off, Encore, Substitute

**Togekiss** — species, **RU**, tier source: imported (natdex)
  Fairy/Flying | BST 545 (85/50/95/120/115/80)
  Abilities: Hustle / Serene Grace / Super Luck
  Engine stats @252 (neutral/positive): Hustle: Atk 298/327, SpA 339/372, Spe 259/284 — Serene Grace: Atk 199/218, SpA 339/372, Spe 259/284 — Super Luck: Atk 199/218, SpA 339/372, Spe 259/284
  Held item: **free**
  STAB: Fairy Play Rough 90P · Flying Sky Attack 140 (charge)P
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Psychic Zen Headbutt 80P, Steel Smart Strike 70P, Dark Fling 30P, Rock Rollout 30P
  Special coverage: Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Zap Cannon 120S, Grass Solar Beam 120 (charge)S, Fighting Aura Sphere 90S, Normal Hyper Voice 90S
  Setup: Amnesia, Defense Curl, Nasty Plot, Work Up
  Reliable recovery: Rest, Roost, Soft-Boiled
  Drain/unreliable: Drain Punch, Draining Kiss, Dream Eater
  Priority: Extreme Speed 80P Normal (+2)
  Removal: Defog
  Pivot: Baton Pass
  Status: Thunder Wave, Toxic, Yawn
  Cleric/support: Heal Bell, Life Dew, Wish
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Encore, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Tailwind, Trick
  Notable: Trick, Encore, Substitute, Baton Pass, Tailwind

**Tornadus** — species, **RU**, tier source: override
  Flying | BST 580 (79/115/70/125/80/111)
  Abilities: Prankster / Defiant
  Engine stats @252 (neutral/positive): Prankster: Atk 329/361, SpA 349/383, Spe 321/353 — Defiant: Atk 329/361, SpA 349/383, Spe 321/353
  Held item: **free**
  STAB: Flying Hurricane 120S
  Physical coverage: Fighting Superpower 120P, Normal Thrash 120P, Steel Iron Tail 100P, Dark Foul Play 95P, Bug U-turn 70P, Rock Smack Down 50P
  Special coverage: Fighting Focus Blast 120S, Fire Heat Wave 100S, Poison Sludge Wave 95S, Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S
  Setup: Agility, Bulk Up, Nasty Plot
  Reliable recovery: Rest
  Removal: Defog
  Pivot: U-turn
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Snowscape, Sunny Day
  Utility: Knock Off, Protect, Substitute, Tailwind, Taunt
  Notable: Knock Off, Taunt, Substitute, Tailwind

**Torterra** — species, **RU**, tier source: imported (natdex)
  Grass/Ground | BST 525 (95/109/105/75/85/56)
  Abilities: Overgrow / Shell Armor
  Engine stats @252 (neutral/positive): Overgrow: Atk 317/348, SpA 249/273, Spe 211/232 — Shell Armor: Atk 317/348, SpA 249/273, Spe 211/232
  Held item: **free**
  STAB: Grass Leaf Storm 140S · Ground Headlong Rush 120P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Dragon Outrage 120P, Fighting Superpower 120P, Rock Stone Edge 100P, Dark Crunch 80P
  Special coverage: Normal Hyper Voice 90S
  Setup: Amnesia, Growth, Iron Defense, Rock Polish, Shell Smash, Swords Dance, Withdraw, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Absorb, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1)
  Hazards: Stealth Rock
  Phazing: Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Grassy Terrain, Sandstorm, Sunny Day
  Utility: Leech Seed, Light Screen, Protect, Reflect, Safeguard, Substitute
  Notable: Substitute

**Toxtricity** — species, **RU**, tier source: imported (natdex)
  Electric/Poison | BST 502 (75/98/70/114/70/75)
  Abilities: Punk Rock / Plus / Technician
  Engine stats @252 (neutral/positive): Punk Rock: Atk 295/324, SpA 327/359, Spe 249/273 — Plus: Atk 295/324, SpA 327/359, Spe 249/273 — Technician: Atk 295/324, SpA 327/359, Spe 249/273
  Held item: **free**
  STAB: Electric Thunder 120S · Poison Belch 120S
  Physical coverage: Normal Mega Kick 120P, Dark Throat Chop 80P, Fighting Brick Break 75P, Fire Fire Punch 75P, Grass Trailblaze 50P
  Special coverage: Normal Boomburst 140S, Psychic Psychic Noise 75S, Ghost Hex 65S, Dark Snarl 55S
  Setup: Charge, Shift Gear
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Hazards: Toxic Spikes
  Pivot: Volt Switch
  Status: Nuzzle, Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Rain Dance, Sunny Day
  Utility: Encore, Protect, Substitute, Taunt
  Notable: Encore, Taunt, Substitute

**Toxtricity-Low-Key** — species, **RU**, tier source: imported (natdex)
  Electric/Poison | BST 502 (75/98/70/114/70/75)
  Abilities: Punk Rock / Minus / Technician
  Engine stats @252 (neutral/positive): Punk Rock: Atk 295/324, SpA 327/359, Spe 249/273 — Minus: Atk 295/324, SpA 327/359, Spe 249/273 — Technician: Atk 295/324, SpA 327/359, Spe 249/273
  Held item: **free**
  STAB: Electric Thunder 120S · Poison Belch 120S
  Physical coverage: Normal Mega Kick 120P, Dark Throat Chop 80P, Fighting Brick Break 75P, Fire Fire Punch 75P, Grass Trailblaze 50P
  Special coverage: Normal Boomburst 140S, Psychic Psychic Noise 75S, Ghost Hex 65S, Dark Snarl 55S
  Setup: Charge, Shift Gear
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Hazards: Toxic Spikes
  Pivot: Volt Switch
  Status: Nuzzle, Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Rain Dance, Sunny Day
  Utility: Encore, Protect, Substitute, Taunt
  Notable: Encore, Taunt, Substitute

**Umbreon** — species, **RU**, tier source: imported (natdex)
  Dark | BST 525 (95/65/110/60/130/65)
  Abilities: Synchronize / Inner Focus
  Engine stats @252 (neutral/positive): Synchronize: Atk 229/251, SpA 219/240, Spe 229/251 — Inner Focus: Atk 229/251, SpA 219/240, Spe 229/251
  Held item: **free**
  STAB: Dark Foul Play 95P
  Physical coverage: Normal Last Resort 140P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Grass Trailblaze 50P
  Special coverage: Normal Trump Card 200S, Psychic Synchronoise 120S, Electric Zap Cannon 120S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Ground Mud-Slap 20S
  Setup: Calm Mind, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Quick Attack 40P Normal (+1)
  Pivot: Baton Pass
  Phazing: Roar
  Status: Sing, Thunder Wave, Toxic, Yawn
  Cleric/support: Heal Bell, Wish
  Trapping: Mean Look
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Light Screen, Protect, Reflect, Substitute, Taunt
  Notable: Taunt, Substitute, Baton Pass

**Victreebel-Mega** — forme, **RU**, tier source: override
  Grass/Poison | BST 590 (80/125/85/135/95/70)
  Abilities: Innards Out (fixed by the forme)
  Engine stats @252 (neutral/positive): Innards Out: Atk 349/383, SpA 369/405, Spe 239/262
  Held item: **Victreebelite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Victreebel (ZU), pre-Mega abilities: Chlorophyll / Gluttony
  STAB: Grass Leaf Storm 140S · Poison Belch 120S
  Physical coverage: Normal Double-Edge 120P, Bug Leech Life 80P, Dark Sucker Punch 80P
  Special coverage: Normal Wring Out 120S, Bug Infestation 20S
  Setup: Growth, Swords Dance
  Reliable recovery: Rest
  Drain/unreliable: Giga Drain, Leech Life, Mega Drain
  Priority: Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1)
  Status: Poison Powder, Sleep Powder, Stun Spore, Toxic
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Clear Smog, Encore, Knock Off, Protect, Reflect, Substitute
  Notable: Knock Off, Encore, Substitute

**Volcanion** — species, **RU**, tier source: imported (natdex)
  Fire/Water | BST 600 (80/110/120/130/90/70)
  Abilities: Water Absorb
  Engine stats @252 (neutral/positive): Water Absorb: Atk 319/350, SpA 359/394, Spe 239/262
  Held item: **free**
  STAB: Fire Overheat 140S · Water Hydro Pump 120S
  Physical coverage: Normal Explosion 250P, Fighting Superpower 120P, Ground Earthquake 100P, Steel Heavy Slam 100P, Rock Stone Edge 100P, Electric Wild Charge 90P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Poison Sludge Wave 95S, Ground Earth Power 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S
  Reliable recovery: Rest
  Removal: Defog
  Phazing: Roar
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Misty Terrain, Rain Dance, Sandstorm, Sunny Day
  Utility: Haze, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Weezing-Galar** — species, **RU**, tier source: imported (natdex)
  Poison/Fairy | BST 490 (65/90/120/85/70/60)
  Abilities: Levitate / Neutralizing Gas / Misty Surge
  Engine stats @252 (neutral/positive): Levitate: Atk 279/306, SpA 269/295, Spe 219/240 — Neutralizing Gas: Atk 279/306, SpA 269/295, Spe 219/240 — Misty Surge: Atk 279/306, SpA 269/295, Spe 219/240
  Held item: **free**
  STAB: Poison Belch 120S · Fairy Misty Explosion 100S
  Physical coverage: Normal Explosion 250P, Dark Assurance 60P, Rock Rollout 30P, Steel Gyro Ball 24P
  Special coverage: Fire Overheat 140S, Electric Thunder 120S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Psychic Psybeam 65S
  Reliable recovery: Rest
  Hazards: Toxic Spikes
  Removal: Defog
  Status: Toxic, Will-O-Wisp
  Cleric/support: Aromatherapy
  Weather/terrain: Misty Terrain, Rain Dance, Sunny Day
  Utility: Clear Smog, Destiny Bond, Haze, Memento, Pain Split, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Yanmega** — species, **RU**, tier source: imported (natdex)
  Bug/Flying | BST 515 (86/76/86/116/56/95)
  Abilities: Speed Boost / Tinted Lens / Frisk
  Engine stats @252 (neutral/positive): Speed Boost: Atk 251/276, SpA 331/364, Spe 289/317 — Tinted Lens: Atk 251/276, SpA 331/364, Spe 289/317 — Frisk: Atk 251/276, SpA 331/364, Spe 289/317
  Held item: **free**
  STAB: Bug Bug Buzz 90S · Flying Dual Wingbeat 50x2P
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Steel Steel Wing 70P, Fighting Reversal 20P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Uproar 90S, Ghost Shadow Ball 80S, Rock Ancient Power 60S, Ground Mud-Slap 20S
  Setup: Swords Dance
  Reliable recovery: Rest, Roost
  Drain/unreliable: Dream Eater, Giga Drain, Leech Life
  Priority: Feint 50P Normal (+2), Quick Attack 40P Normal (+1)
  Removal: Defog
  Pivot: U-turn
  Phazing: Whirlwind
  Status: Hypnosis, Toxic
  Weather/terrain: Sunny Day
  Utility: Detect, Protect, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Zarude** — species, **RU**, tier source: imported (natdex)
  Dark/Grass | BST 600 (105/120/105/70/95/105)
  Abilities: Leaf Guard
  Engine stats @252 (neutral/positive): Leaf Guard: Atk 339/372, SpA 239/262, Spe 309/339
  Held item: **free**
  STAB: Dark Darkest Lariat 85P · Grass Solar Blade 125 (charge)P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Rock Rock Slide 75P
  Special coverage: Normal Hyper Voice 90S, Ground Mud Shot 55S
  Setup: Bulk Up, Growth, Nasty Plot, Swords Dance
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch, Giga Drain
  Priority: Grassy Glide 70P Grass (+1)
  Pivot: U-turn
  Phazing: Roar
  Cleric/support: Jungle Healing
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Encore, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Encore, Taunt, Substitute

**Zygarde-10%** — species, **RU**, tier source: imported (natdex)
  Dragon/Ground | BST 486 (54/100/71/61/85/115)
  Abilities: Aura Break / Power Construct
  Engine stats @252 (neutral/positive): Aura Break: Atk 299/328, SpA 221/243, Spe 329/361 — Power Construct: Atk 299/328, SpA 221/243, Spe 329/361
  Held item: **free**
  STAB: Dragon Outrage 120P · Ground Earthquake 100P
  Physical coverage: Fighting Superpower 120P, Normal Return 102P, Steel Iron Tail 100P, Rock Stone Edge 100P, Dark Crunch 80P, Psychic Zen Headbutt 80P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Hyper Voice 90S, Grass Grass Knot 60S, Electric Shock Wave 60S
  Setup: Coil, Dragon Dance
  Reliable recovery: Rest
  Priority: Extreme Speed 80P Normal (+2)
  Phazing: Dragon Tail
  Status: Glare, Toxic
  Trapping: Block, Thousand Waves
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Haze, Pain Split, Protect, Safeguard, Substitute
  Notable: Substitute

---

## E. Current OU comparison bar

Compact. Ask for a full movepool profile on any OU entry you want to compare
directly against a UU candidate.

| # | Pokémon | Kind | Types | BST | Spread | Ability | Reached by |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Alakazam-Mega | forme | Psychic | 600 | 55/50/65/175/105/150 | Trace | Alakazam + Alakazite |
| 2 | Alomomola | species | Water | 470 | 165/75/80/40/45/65 | Healer, Hydration, Regenerator | — |
| 3 | Annihilape | species | Fighting/Ghost | 535 | 110/115/80/50/90/90 | Vital Spirit, Inner Focus, Defiant | — |
| 4 | Barbaracle-Mega | forme | Rock/Fighting | 600 | 72/140/130/64/106/88 | Tough Claws | Barbaracle + Barbaracite |
| 5 | Baxcalibur | species | Dragon/Ice | 600 | 115/145/92/75/86/87 | Thermal Exchange, Ice Body | — |
| 6 | Blastoise-Mega | forme | Water | 630 | 79/103/120/135/115/78 | Mega Launcher | Blastoise + Blastoisinite |
| 7 | Blaziken | species | Fire/Fighting | 530 | 80/120/70/110/70/80 | Blaze, Speed Boost | — |
| 8 | Ceruledge | species | Fire/Ghost | 525 | 75/125/80/60/100/85 | Flash Fire, Weak Armor | — |
| 9 | Charizard-Mega-X | forme | Fire/Dragon | 634 | 78/130/111/130/85/100 | Tough Claws | Charizard + Charizardite X |
| 10 | Charizard-Mega-Y | forme | Fire/Flying | 634 | 78/104/78/159/115/100 | Drought | Charizard + Charizardite Y |
| 11 | Chesnaught-Mega | forme | Grass/Fighting | 630 | 88/137/172/74/115/44 | Bulletproof | Chesnaught + Chesnaughtite |
| 12 | Cinderace | species | Fire | 530 | 80/116/75/65/75/119 | Blaze, Libero | — |
| 13 | Clefable-Mega | forme | Fairy/Flying | 583 | 95/80/93/135/110/70 | Magic Bounce | Clefable + Clefablite |
| 14 | Clodsire | species | Poison/Ground | 430 | 130/75/60/45/100/20 | Poison Point, Water Absorb, Unaware | — |
| 15 | Darkrai | species | Dark | 600 | 70/90/90/135/90/125 | Bad Dreams | — |
| 16 | Deoxys | species | Psychic | 600 | 50/150/50/150/50/150 | Pressure | — |
| 17 | Deoxys-Speed | species | Psychic | 600 | 50/95/90/95/90/180 | Pressure | — |
| 18 | Dialga | species | Steel/Dragon | 680 | 100/120/120/150/100/90 | Pressure, Telepathy | — |
| 19 | Diancie-Mega | forme | Rock/Fairy | 700 | 50/160/110/160/110/110 | Magic Bounce | Diancie + Diancite |
| 20 | Dondozo | species | Water | 530 | 150/100/115/65/65/35 | Unaware, Oblivious, Water Veil | — |
| 21 | Dracovish | species | Water/Dragon | 505 | 90/90/100/70/80/75 | Water Absorb, Strong Jaw, Sand Rush | — |
| 22 | Dragapult | species | Dragon/Ghost | 600 | 88/120/75/100/75/142 | Clear Body, Infiltrator, Cursed Body | — |
| 23 | Dragonite | species | Dragon/Flying | 600 | 91/134/95/100/100/80 | Inner Focus, Multiscale | — |
| 24 | Excadrill-Mega | forme | Ground/Steel | 608 | 110/165/100/65/65/103 | Piercing Drill | Excadrill + Excadrite |
| 25 | Feraligatr-Mega | forme | Water/Dragon | 630 | 85/160/125/89/93/78 | Dragonize | Feraligatr + Feraligite |
| 26 | Ferrothorn | species | Grass/Steel | 489 | 74/94/131/54/116/20 | Iron Barbs, Anticipation | — |
| 27 | Floette-Mega | forme | Fairy | 651 | 74/85/87/155/148/102 | Fairy Aura | Floette-Eternal + Floettite |
| 28 | Gallade-Mega | forme | Psychic/Fighting | 618 | 68/165/95/65/115/110 | Inner Focus | Gallade + Galladite |
| 29 | Garchomp | species | Dragon/Ground | 600 | 108/130/95/80/85/102 | Sand Veil, Rough Skin | — |
| 30 | Garchomp-Mega | forme | Dragon/Ground | 700 | 108/170/115/120/95/92 | Sand Force | Garchomp + Garchompite |
| 31 | Gholdengo | species | Steel/Ghost | 550 | 87/60/95/133/91/84 | Good as Gold | — |
| 32 | Glimmora-Mega | forme | Rock/Poison | 625 | 83/90/105/150/96/101 | Adaptability | Glimmora + Glimmoranite |
| 33 | Gliscor | species | Ground/Flying | 510 | 75/95/125/45/75/95 | Hyper Cutter, Sand Veil, Poison Heal | — |
| 34 | Golisopod-Mega | forme | Bug/Steel | 630 | 75/150/175/70/120/40 | Emergency Exit | Golisopod + Golisopite |
| 35 | Great Tusk | species | Ground/Fighting | 570 | 115/131/131/53/53/87 | Protosynthesis | — |
| 36 | Greninja | species | Water/Dark | 530 | 72/95/67/103/71/122 | Torrent, Protean, Battle Bond | — |
| 37 | Greninja-Ash | forme | Water/Dark | 640 | 72/145/67/153/71/132 | Battle Bond | Greninja + — |
| 38 | Greninja-Mega | forme | Water/Dark | 630 | 72/125/77/133/81/142 | Protean | Greninja + Greninjite |
| 39 | Gyarados-Mega | forme | Water/Dark | 640 | 95/155/109/70/130/81 | Mold Breaker | Gyarados + Gyaradosite |
| 40 | Hawlucha-Mega | forme | Fighting/Flying | 600 | 78/137/100/74/93/118 | No Guard | Hawlucha + Hawluchanite |
| 41 | Heatran | species | Fire/Steel | 600 | 91/90/106/130/106/77 | Flash Fire, Flame Body | — |
| 42 | Hoopa-Unbound | species | Psychic/Dark | 680 | 80/160/60/170/130/80 | Magician | — |
| 43 | Iron Hands | species | Fighting/Electric | 570 | 154/140/108/50/68/50 | Quark Drive | — |
| 44 | Iron Moth | species | Fire/Poison | 570 | 80/70/60/140/110/110 | Quark Drive | — |
| 45 | Iron Valiant | species | Fairy/Fighting | 590 | 74/130/90/120/60/116 | Quark Drive | — |
| 46 | Kartana | species | Grass/Steel | 570 | 59/181/131/59/31/109 | Beast Boost | — |
| 47 | Kingambit | species | Dark/Steel | 550 | 100/135/120/60/85/50 | Defiant, Supreme Overlord, Pressure | — |
| 48 | Kommo-o | species | Dragon/Fighting | 600 | 75/110/125/100/105/85 | Bulletproof, Soundproof, Overcoat | — |
| 49 | Kyurem | species | Dragon/Ice | 660 | 125/130/90/130/90/95 | Pressure | — |
| 50 | Kyurem-Black | species | Dragon/Ice | 700 | 125/170/100/120/90/95 | Teravolt | — |
| 51 | Landorus-Therian | species | Ground/Flying | 600 | 89/145/90/105/80/91 | Intimidate | — |
| 52 | Latios | species | Dragon/Psychic | 600 | 80/90/80/130/110/110 | Levitate | — |
| 53 | Latios-Mega | forme | Dragon/Psychic | 700 | 80/130/100/160/120/110 | Levitate | Latios + Latiosite |
| 54 | Lopunny-Mega | forme | Normal/Fighting | 580 | 65/136/94/54/96/135 | Scrappy | Lopunny + Lopunnite |
| 55 | Lucario-Mega | forme | Fighting/Steel | 625 | 70/145/88/140/70/112 | Adaptability | Lucario + Lucarionite |
| 56 | Lugia | species | Psychic/Flying | 680 | 106/90/130/90/154/110 | Pressure, Multiscale | — |
| 57 | Lunala | species | Psychic/Ghost | 680 | 137/113/89/137/107/97 | Shadow Shield | — |
| 58 | Manaphy | species | Water | 600 | 100/100/100/100/100/100 | Hydration | — |
| 59 | Marshadow | species | Fighting/Ghost | 600 | 90/125/80/90/90/125 | Technician | — |
| 60 | Mawile-Mega | forme | Steel/Fairy | 480 | 50/105/125/55/95/50 | Huge Power | Mawile + Mawilite |
| 61 | Medicham-Mega | forme | Fighting/Psychic | 510 | 60/100/85/80/85/100 | Pure Power | Medicham + Medichamite |
| 62 | Melmetal | species | Steel | 600 | 135/143/143/80/65/34 | Iron Fist | — |
| 63 | Meowscarada | species | Grass/Dark | 530 | 76/110/70/81/70/123 | Overgrow, Protean | — |
| 64 | Metagross-Mega | forme | Steel/Psychic | 700 | 80/145/150/105/110/110 | Tough Claws | Metagross + Metagrossite |
| 65 | Naganadel | species | Poison/Dragon | 540 | 73/73/73/127/73/121 | Beast Boost | — |
| 66 | Necrozma-Dawn-Wings | species | Psychic/Ghost | 680 | 97/113/109/157/127/77 | Prism Armor | — |
| 67 | Ogerpon-Cornerstone | forme | Grass/Rock | 550 | 80/120/84/60/96/110 | Sturdy | Ogerpon + Cornerstone Mask |
| 68 | Ogerpon-Hearthflame | forme | Grass/Fire | 550 | 80/120/84/60/96/110 | Mold Breaker | Ogerpon + Hearthflame Mask |
| 69 | Ogerpon-Wellspring | forme | Grass/Water | 550 | 80/120/84/60/96/110 | Water Absorb | Ogerpon + Wellspring Mask |
| 70 | Pheromosa | species | Bug/Fighting | 570 | 71/137/37/137/37/151 | Beast Boost | — |
| 71 | Pinsir-Mega | forme | Bug/Flying | 600 | 65/155/120/65/90/105 | Aerilate | Pinsir + Pinsirite |
| 72 | Raging Bolt | species | Electric/Dragon | 590 | 125/73/91/137/89/75 | Protosynthesis | — |
| 73 | Rillaboom | species | Grass | 530 | 100/125/90/60/70/85 | Overgrow, Grassy Surge | — |
| 74 | Roaring Moon | species | Dragon/Dark | 590 | 105/139/71/55/101/119 | Protosynthesis | — |
| 75 | Samurott-Hisui | species | Water/Dark | 528 | 90/108/80/100/65/85 | Torrent, Sharpness | — |
| 76 | Scizor-Mega | forme | Bug/Steel | 600 | 70/150/140/65/100/75 | Technician | Scizor + Scizorite |
| 77 | Slowking-Galar | species | Poison/Psychic | 490 | 95/65/80/110/110/30 | Curious Medicine, Own Tempo, Regenerator | — |
| 78 | Solgaleo | species | Psychic/Steel | 680 | 137/137/107/113/89/97 | Full Metal Body | — |
| 79 | Spectrier | species | Ghost | 580 | 100/65/60/145/80/130 | Grim Neigh | — |
| 80 | Tapu Koko | species | Electric/Fairy | 570 | 70/115/85/95/75/130 | Electric Surge, Telepathy | — |
| 81 | Tapu Lele | species | Psychic/Fairy | 570 | 70/85/75/130/115/95 | Psychic Surge, Telepathy | — |
| 82 | Terapagos | species | Normal | 450 | 90/65/85/65/85/60 | Tera Shift | — |
| 83 | Terapagos-Terastal | species | Normal | 600 | 95/95/110/105/110/85 | Tera Shell | — |
| 84 | Ting-Lu | species | Dark/Ground | 580 | 165/110/130/50/80/45 | Vessel of Ruin | — |
| 85 | Tornadus-Therian | species | Flying | 580 | 79/100/80/110/90/121 | Regenerator | — |
| 86 | Toxapex | species | Poison/Water | 495 | 50/63/152/53/142/35 | Merciless, Limber, Regenerator | — |
| 87 | Tyranitar-Mega | forme | Rock/Dark | 700 | 100/164/150/95/120/71 | Sand Stream | Tyranitar + Tyranitarite |
| 88 | Urshifu-Rapid-Strike | species | Fighting/Water | 550 | 100/130/100/63/60/97 | Unseen Fist | — |
| 89 | Volcarona | species | Bug/Fire | 550 | 85/60/65/135/105/100 | Flame Body, Swarm | — |
| 90 | Xurkitree | species | Electric | 570 | 83/89/71/173/71/83 | Beast Boost | — |
| 91 | Zamazenta | species | Fighting | 670 | 92/130/115/80/115/138 | Dauntless Shield | — |
| 92 | Zapdos | species | Electric/Flying | 580 | 90/90/85/125/90/100 | Pressure, Static, Lightning Rod | — |
| 93 | Zeraora-Mega | forme | Electric | 700 | 88/157/75/147/80/153 | Volt Absorb | Zeraora + Zeraorite |

---

## F. Estimated-forme audit

**0 UU formes carry an `estimated` tier** — Smogon has never
ranked them, so this project placed them by nearest neighbour. They are the
softest placements in the tier and the easiest to argue with.



---

## G. Serious UU → OU candidate evidence

### Starmie-Mega

**Starmie-Mega** — forme, **UU**, tier source: override
  Water/Psychic | BST 620 (60/100/105/130/105/120)
  Abilities: Huge Power (fixed by the forme)
  Engine stats @252 (neutral/positive): Huge Power: Atk 598/656, SpA 359/394, Spe 339/372
  Held item: **Starminite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Starmie (NU), pre-Mega abilities: Illuminate / Natural Cure / Analytic
  STAB: Water Waterfall 80P · Psychic Psycho Cut 70P
  Physical coverage: Normal Skull Bash 130P, Ice Avalanche 60P, Rock Rollout 30P, Steel Gyro Ball 14P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Normal Tri Attack 80S
  Setup: Agility, Cosmic Power, Harden
  Reliable recovery: Recover, Rest
  Drain/unreliable: Dream Eater
  Removal: Rapid Spin
  Pivot: Flip Turn, Teleport
  Status: Thunder Wave, Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Gravity, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

Attacker: **Starmie-Mega**, adamant {"atk":252,"spe":252,"hp":4}, Starminite (forced) — a representative test set, not a "standard" one.

| Defender (representative test set) | Waterfall | Psycho Cut | Double-Edge |
| --- | --- | --- | --- |
| Aegislash (physWall, no item) | 130-153 (40.1-47.2%) | 57-67 (17.6-20.7%) | 0-0 (0-0%) |
| Slowbro-Mega (physWall, no item) | 57-67 (14.5-17%) | 50-58 (12.7-14.7%) | 113-133 (28.7-33.8%) |
| Slowbro (physWall, Leftovers) | 81-95 (20.6-24.1%) | 71-84 (18-21.3%) | 162-190 (41.1-48.2%) |
| Slowking (specWall, Leftovers) | 144-170 (36.5-43.1%) | 126-149 (32-37.8%) | 288-339 (73.1-86%) |
| Blissey (specWall, Leftovers) | 1006-1183 (140.9-165.7%) | 880-1036 (123.2-145.1%) | 1005-1182 (140.8-165.5%) |
| Chansey (specWall, Eviolite) | 817-961 (116.1-136.5%) | 715-841 (101.6-119.5%) | 816-960 (115.9-136.4%) |
| Clefable (specWall, Leftovers) | 311-366 (78.9-92.9%) | 272-320 (69-81.2%) | 310-365 (78.7-92.6%) |
| Tapu Fini (specWall, Leftovers) | 106-125 (30.8-36.3%) | 187-220 (54.4-64%) | 213-250 (61.9-72.7%) |
| Skarmory (physWall, Leftovers) | 137-161 (41-48.2%) | 60-71 (18-21.3%) | 68-80 (20.4-24%) |
| Skarmory-Mega (physWall, no item) | 163-191 (48.8-57.2%) | 71-84 (21.3-25.1%) | 81-95 (24.3-28.4%) |
| Celesteela (physWall, Leftovers) | 170-200 (42.7-50.3%) | 74-87 (18.6-21.9%) | 84-99 (21.1-24.9%) |
| Hippowdon (physWall, Leftovers) | 310-365 (73.8-86.9%) | 136-160 (32.4-38.1%) | 154-181 (36.7-43.1%) |
| Mew (physWall, Leftovers) | 173-204 (42.8-50.5%) | 76-89 (18.8-22%) | 173-203 (42.8-50.2%) |
| Amoonguss (specWall, Black Sludge) | 160-189 (37-43.8%) | 563-663 (130.3-153.5%) | 321-377 (74.3-87.3%) |
| Goodra-Hisui (specWall, Leftovers) | 120-141 (33-38.7%) | 105-124 (28.8-34.1%) | 119-141 (32.7-38.7%) |
| Rotom-Wash (physWall, Leftovers) | 82-97 (27-31.9%) | 145-171 (47.7-56.3%) | 165-194 (54.3-63.8%) |
| Swampert (physWall, Leftovers) | 186-219 (46-54.2%) | 163-192 (40.3-47.5%) | 185-218 (45.8-54%) |
| Tyranitar (specWall, Leftovers) | 444-522 (109.9-129.2%) | 0-0 (0-0%) | 110-130 (27.2-32.2%) |
| Scizor (physWall, Leftovers) | 173-204 (50.3-59.3%) | 76-89 (22.1-25.9%) | 86-101 (25-29.4%) |
| Buzzwole (physWall, Leftovers) | 138-162 (33-38.8%) | 242-285 (57.9-68.2%) | 137-161 (32.8-38.5%) |

---

### Porygon-Z

**Porygon-Z** — species, **UU**, tier source: imported (natdex)
  Normal | BST 535 (85/80/70/135/75/90)
  Abilities: Adaptability / Download / Analytic
  Engine stats @252 (neutral/positive): Adaptability: Atk 259/284, SpA 369/405, Spe 279/306 — Download: Atk 259/284, SpA 369/405, Spe 279/306 — Analytic: Atk 259/284, SpA 369/405, Spe 279/306
  Held item: **free**
  STAB: Normal Uproar 90S
  Physical coverage: Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Flying Aerial Ace 60P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S
  Setup: Agility, Barrier, Charge, Defense Curl, Nasty Plot, Sharpen
  Reliable recovery: Recover, Rest
  Drain/unreliable: Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Gravity, Magic Coat, Pain Split, Protect, Reflect, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

Attacker: **Porygon-Z**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a representative test set, not a "standard" one.

| Defender (representative test set) | Tri Attack | Thunderbolt | Ice Beam | Shadow Ball |
| --- | --- | --- | --- | --- |
| Aegislash (physWall, no item) | 0-0 (0-0%) | 98-115 (30.2-35.5%) | 49-57 (15.1-17.6%) | 166-196 (51.2-60.5%) |
| Slowbro-Mega (physWall, no item) | 283-334 (71.8-84.8%) | 335-395 (85-100.3%) | 83-98 (21.1-24.9%) | 283-334 (71.8-84.8%) |
| Slowbro (physWall, Leftovers) | 283-334 (71.8-84.8%) | 335-395 (85-100.3%) | 83-98 (21.1-24.9%) | 283-334 (71.8-84.8%) |
| Slowking (specWall, Leftovers) | 159-188 (40.4-47.7%) | 189-223 (48-56.6%) | 46-55 (11.7-14%) | 159-188 (40.4-47.7%) |
| Blissey (specWall, Leftovers) | 139-163 (19.5-22.8%) | 81-96 (11.3-13.4%) | 81-96 (11.3-13.4%) | 0-0 (0-0%) |
| Chansey (specWall, Eviolite) | 111-131 (15.8-18.6%) | 65-76 (9.2-10.8%) | 65-76 (9.2-10.8%) | 0-0 (0-0%) |
| Clefable (specWall, Leftovers) | 183-215 (46.4-54.6%) | 107-127 (27.2-32.2%) | 107-127 (27.2-32.2%) | 91-107 (23.1-27.2%) |
| Tapu Fini (specWall, Leftovers) | 143-167 (41.6-48.5%) | 169-198 (49.1-57.6%) | 41-49 (11.9-14.2%) | 71-83 (20.6-24.1%) |
| Skarmory (physWall, Leftovers) | 157-184 (47-55.1%) | 373-439 (111.7-131.4%) | 185-219 (55.4-65.6%) | 157-184 (47-55.1%) |
| Skarmory-Mega (physWall, no item) | 118-139 (35.3-41.6%) | 279-328 (83.5-98.2%) | 139-163 (41.6-48.8%) | 118-139 (35.3-41.6%) |
| Celesteela (physWall, Leftovers) | 117-137 (29.4-34.4%) | 276-326 (69.3-81.9%) | 137-162 (34.4-40.7%) | 117-137 (29.4-34.4%) |
| Hippowdon (physWall, Leftovers) | 308-362 (73.3-86.2%) | 0-0 (0-0%) | 365-430 (86.9-102.4%) | 153-180 (36.4-42.9%) |
| Mew (physWall, Leftovers) | 236-278 (58.4-68.8%) | 139-163 (34.4-40.3%) | 139-163 (34.4-40.3%) | 236-278 (58.4-68.8%) |
| Amoonguss (specWall, Black Sludge) | 196-231 (45.4-53.5%) | 57-67 (13.2-15.5%) | 232-274 (53.7-63.4%) | 97-115 (22.5-26.6%) |
| Goodra-Hisui (specWall, Leftovers) | 63-75 (17.3-20.6%) | 37-44 (10.2-12.1%) | 75-89 (20.6-24.5%) | 63-75 (17.3-20.6%) |
| Rotom-Wash (physWall, Leftovers) | 223-262 (73.4-86.2%) | 131-154 (43.1-50.7%) | 65-76 (21.4-25%) | 111-131 (36.5-43.1%) |
| Swampert (physWall, Leftovers) | 257-302 (63.6-74.8%) | 0-0 (0-0%) | 152-179 (37.6-44.3%) | 128-150 (31.7-37.1%) |
| Tyranitar (specWall, Leftovers) | 84-100 (20.8-24.8%) | 101-118 (25-29.2%) | 101-118 (25-29.2%) | 41-49 (10.1-12.1%) |
| Scizor (physWall, Leftovers) | 141-166 (41-48.3%) | 167-197 (48.5-57.3%) | 83-98 (24.1-28.5%) | 141-166 (41-48.3%) |
| Buzzwole (physWall, Leftovers) | 390-458 (93.3-109.6%) | 230-271 (55-64.8%) | 230-271 (55-64.8%) | 195-228 (46.7-54.5%) |

---

### Delphox-Mega

**Delphox-Mega** — forme, **UU**, tier source: override
  Fire/Psychic | BST 634 (75/69/72/159/125/134)
  Abilities: Levitate (fixed by the forme)
  Engine stats @252 (neutral/positive): Levitate: Atk 237/260, SpA 417/458, Spe 367/403
  Held item: **Delphoxite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Delphox (PU), pre-Mega abilities: Blaze / Magician
  STAB: Fire Overheat 140S · Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Dark Foul Play 95P, Electric Thunder Punch 75P, Fighting Low Kick 60P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Normal Hyper Voice 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
  Setup: Agility, Calm Mind, Nasty Plot, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Dream Eater
  Status: Hypnosis, Toxic, Will-O-Wisp
  Cleric/support: Wish
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Encore, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Switcheroo, Trick, Trick Room
  Notable: Trick, Switcheroo, Encore, Substitute, Trick Room

Attacker: **Delphox-Mega**, timid {"spa":252,"spe":252,"hp":4}, Delphoxite (forced) — a representative test set, not a "standard" one.

| Defender (representative test set) | Overheat | Fire Blast | Psychic | Focus Blast | Shadow Ball |
| --- | --- | --- | --- | --- | --- |
| Aegislash (physWall, no item) | 377-443 (116.4-136.7%) | 324-381 (100-117.6%) | 61-71 (18.8-21.9%) | 0-0 (0-0%) | 145-170 (44.8-52.5%) |
| Slowbro-Mega (physWall, no item) | 160-189 (40.6-48%) | 137-162 (34.8-41.1%) | 103-122 (26.1-31%) | 91-108 (23.1-27.4%) | 246-289 (62.4-73.4%) |
| Slowbro (physWall, Leftovers) | 160-189 (40.6-48%) | 137-162 (34.8-41.1%) | 103-122 (26.1-31%) | 91-108 (23.1-27.4%) | 246-289 (62.4-73.4%) |
| Slowking (specWall, Leftovers) | 90-106 (22.8-26.9%) | 77-91 (19.5-23.1%) | 58-69 (14.7-17.5%) | 51-61 (12.9-15.5%) | 139-164 (35.3-41.6%) |
| Blissey (specWall, Leftovers) | 156-184 (21.8-25.8%) | 134-158 (18.8-22.1%) | 101-119 (14.1-16.7%) | 179-211 (25.1-29.6%) | 0-0 (0-0%) |
| Chansey (specWall, Eviolite) | 125-147 (17.8-20.9%) | 108-127 (15.3-18%) | 81-96 (11.5-13.6%) | 144-169 (20.5-24%) | 0-0 (0-0%) |
| Clefable (specWall, Leftovers) | 206-243 (52.3-61.7%) | 177-209 (44.9-53%) | 133-157 (33.8-39.8%) | 59-69 (15-17.5%) | 79-93 (20.1-23.6%) |
| Tapu Fini (specWall, Leftovers) | 80-94 (23.3-27.3%) | 69-81 (20.1-23.5%) | 104-123 (30.2-35.8%) | 46-54 (13.4-15.7%) | 62-73 (18-21.2%) |
| Skarmory (physWall, Leftovers) | 715-841 (214.1-251.8%) | 614-722 (183.8-216.2%) | 115-135 (34.4-40.4%) | 204-240 (61.1-71.9%) | 137-161 (41-48.2%) |
| Skarmory-Mega (physWall, no item) | 534-629 (159.9-188.3%) | 459-540 (137.4-161.7%) | 86-101 (25.7-30.2%) | 153-180 (45.8-53.9%) | 102-120 (30.5-35.9%) |
| Celesteela (physWall, Leftovers) | 530-624 (133.2-156.8%) | 455-535 (114.3-134.4%) | 85-100 (21.4-25.1%) | 151-178 (37.9-44.7%) | 101-119 (25.4-29.9%) |
| Hippowdon (physWall, Leftovers) | 349-411 (83.1-97.9%) | 300-353 (71.4-84%) | 225-265 (53.6-63.1%) | 200-235 (47.6-56%) | 134-157 (31.9-37.4%) |
| Mew (physWall, Leftovers) | 267-314 (66.1-77.7%) | 229-270 (56.7-66.8%) | 86-101 (21.3-25%) | 76-90 (18.8-22.3%) | 205-241 (50.7-59.7%) |
| Amoonguss (specWall, Black Sludge) | 445-524 (103-121.3%) | 382-450 (88.4-104.2%) | 288-339 (66.7-78.5%) | 63-75 (14.6-17.4%) | 85-100 (19.7-23.1%) |
| Goodra-Hisui (specWall, Leftovers) | 145-170 (39.8-46.7%) | 124-146 (34.1-40.1%) | 47-55 (12.9-15.1%) | 166-195 (45.6-53.6%) | 56-65 (15.4-17.9%) |
| Rotom-Wash (physWall, Leftovers) | 126-148 (41.4-48.7%) | 108-127 (35.5-41.8%) | 163-192 (53.6-63.2%) | 144-170 (47.4-55.9%) | 96-114 (31.6-37.5%) |
| Swampert (physWall, Leftovers) | 146-171 (36.1-42.3%) | 125-147 (30.9-36.4%) | 188-221 (46.5-54.7%) | 167-196 (41.3-48.5%) | 111-131 (27.5-32.4%) |
| Tyranitar (specWall, Leftovers) | 96-113 (23.8-28%) | 82-97 (20.3-24%) | 0-0 (0-0%) | 442-520 (109.4-128.7%) | 37-43 (9.2-10.6%) |
| Scizor (physWall, Leftovers) | 1286-1513 (373.8-439.8%) | 1103-1298 (320.6-377.3%) | 103-122 (29.9-35.5%) | 183-216 (53.2-62.8%) | 123-144 (35.8-41.9%) |
| Buzzwole (physWall, Leftovers) | 885-1042 (211.7-249.3%) | 759-894 (181.6-213.9%) | 571-672 (136.6-160.8%) | 126-149 (30.1-35.6%) | 169-199 (40.4-47.6%) |

---

### Staraptor-Mega

**Staraptor-Mega** — forme, **UU**, tier source: override
  Fighting/Flying | BST 585 (85/140/100/60/90/110)
  Abilities: Contrary (fixed by the forme)
  Engine stats @252 (neutral/positive): Contrary: Atk 379/416, SpA 219/240, Spe 319/350
  Held item: **Staraptite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Staraptor (NU), pre-Mega abilities: Intimidate / Reckless
  STAB: Fighting Close Combat 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Thief 60P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Normal Uproar 90S, Ghost Ominous Wind 60S, Bug Struggle Bug 50S, Dragon Twister 40S, Ground Mud-Slap 20S
  Setup: Agility, Work Up
  Reliable recovery: Rest, Roost
  Priority: Quick Attack 40P Normal (+1)
  Removal: Defog
  Pivot: U-turn
  Phazing: Whirlwind
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Protect, Substitute, Tailwind
  Notable: Substitute, Tailwind

Attacker: **Staraptor-Mega**, jolly {"atk":252,"spe":252,"hp":4}, Staraptite (forced) — a representative test set, not a "standard" one.

| Defender (representative test set) | Close Combat | Brave Bird | Double-Edge | U-turn |
| --- | --- | --- | --- | --- |
| Aegislash (physWall, no item) | 0-0 (0-0%) | 56-66 (17.3-20.4%) | 0-0 (0-0%) | 11-13 (3.4-4%) |
| Slowbro-Mega (physWall, no item) | 49-58 (12.4-14.7%) | 99-116 (25.1-29.4%) | 66-77 (16.8-19.5%) | 78-92 (19.8-23.4%) |
| Slowbro (physWall, Leftovers) | 70-83 (17.8-21.1%) | 141-166 (35.8-42.1%) | 94-111 (23.9-28.2%) | 111-131 (28.2-33.2%) |
| Slowking (specWall, Leftovers) | 125-147 (31.7-37.3%) | 251-295 (63.7-74.9%) | 167-196 (42.4-49.7%) | 196-231 (49.7-58.6%) |
| Blissey (specWall, Leftovers) | 1744-2052 (244.3-287.4%) | 872-1026 (122.1-143.7%) | 581-684 (81.4-95.8%) | 339-399 (47.5-55.9%) |
| Chansey (specWall, Eviolite) | 1416-1667 (201.1-236.8%) | 708-833 (100.6-118.3%) | 472-555 (67-78.8%) | 276-324 (39.2-46%) |
| Clefable (specWall, Leftovers) | 135-158 (34.3-40.1%) | 270-317 (68.5-80.5%) | 180-211 (45.7-53.6%) | 52-62 (13.2-15.7%) |
| Tapu Fini (specWall, Leftovers) | 92-109 (26.7-31.7%) | 185-218 (53.8-63.4%) | 123-145 (35.8-42.2%) | 36-42 (10.5-12.2%) |
| Skarmory (physWall, Leftovers) | 119-140 (35.6-41.9%) | 59-70 (17.7-21%) | 39-46 (11.7-13.8%) | 11-13 (3.3-3.9%) |
| Skarmory-Mega (physWall, no item) | 141-166 (42.2-49.7%) | 70-83 (21-24.9%) | 47-55 (14.1-16.5%) | 13-16 (3.9-4.8%) |
| Celesteela (physWall, Leftovers) | 147-174 (36.9-43.7%) | 73-87 (18.3-21.9%) | 49-58 (12.3-14.6%) | 14-17 (3.5-4.3%) |
| Hippowdon (physWall, Leftovers) | 134-158 (31.9-37.6%) | 134-158 (31.9-37.6%) | 89-105 (21.2-25%) | 53-62 (12.6-14.8%) |
| Mew (physWall, Leftovers) | 75-88 (18.6-21.8%) | 151-177 (37.4-43.8%) | 100-118 (24.8-29.2%) | 118-139 (29.2-34.4%) |
| Amoonguss (specWall, Black Sludge) | 139-164 (32.2-38%) | 558-657 (129.2-152.1%) | 186-219 (43.1-50.7%) | 109-128 (25.2-29.6%) |
| Goodra-Hisui (specWall, Leftovers) | 417-491 (114.6-134.9%) | 104-122 (28.6-33.5%) | 69-81 (19-22.3%) | 40-48 (11-13.2%) |
| Rotom-Wash (physWall, Leftovers) | 144-169 (47.4-55.6%) | 72-84 (23.7-27.6%) | 96-113 (31.6-37.2%) | 56-66 (18.4-21.7%) |
| Swampert (physWall, Leftovers) | 161-190 (39.9-47%) | 161-190 (39.9-47%) | 107-126 (26.5-31.2%) | 63-74 (15.6-18.3%) |
| Tyranitar (specWall, Leftovers) | 771-907 (190.8-224.5%) | 96-113 (23.8-28%) | 64-75 (15.8-18.6%) | 151-178 (37.4-44.1%) |
| Scizor (physWall, Leftovers) | 151-177 (43.9-51.5%) | 151-177 (43.9-51.5%) | 50-59 (14.5-17.2%) | 29-34 (8.4-9.9%) |
| Buzzwole (physWall, Leftovers) | 60-70 (14.4-16.7%) | 480-565 (114.8-135.2%) | 80-94 (19.1-22.5%) | 23-27 (5.5-6.5%) |

---

### Gardevoir-Mega

**Gardevoir-Mega** — forme, **UU**, tier source: imported (natdex)
  Psychic/Fairy | BST 618 (68/85/65/165/135/100)
  Abilities: Pixilate (fixed by the forme)
  Engine stats @252 (neutral/positive): Pixilate: Atk 269/295, SpA 429/471, Spe 299/328
  Held item: **Gardevoirite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Gardevoir (RU), pre-Mega abilities: Synchronize / Trace / Telepathy
  STAB: Psychic Future Sight 120S · Fairy Hyper Voice 117S
  Physical coverage: Dark Fling 80P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Ghost Shadow Sneak 40P
  Special coverage: Fighting Focus Blast 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S, Bug Signal Beam 75S
  Setup: Calm Mind, Defense Curl
  Reliable recovery: Rest
  Drain/unreliable: Draining Kiss, Dream Eater
  Priority: Shadow Sneak 40P Ghost (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Teleport
  Status: Hypnosis, Sing, Thunder Wave, Toxic, Will-O-Wisp
  Cleric/support: Heal Bell, Life Dew, Wish
  Trapping: Mean Look
  Weather/terrain: Misty Terrain, Psychic Terrain, Rain Dance, Sunny Day
  Utility: Destiny Bond, Disable, Encore, Gravity, Healing Wish, Knock Off, Light Screen, Magic Coat, Memento, Pain Split, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room

Attacker: **Gardevoir-Mega**, timid {"spa":252,"spe":252,"hp":4}, Gardevoirite (forced) — a representative test set, not a "standard" one.

| Defender (representative test set) | Hyper Voice | Focus Blast | Shadow Ball | Mystical Fire |
| --- | --- | --- | --- | --- |
| Aegislash (physWall, no item) | 81-95 (25-29.3%) | 0-0 (0-0%) | 149-175 (46-54%) | 140-164 (43.2-50.6%) |
| Slowbro-Mega (physWall, no item) | 276-325 (70.1-82.5%) | 94-111 (23.9-28.2%) | 253-298 (64.2-75.6%) | 59-69 (15-17.5%) |
| Slowbro (physWall, Leftovers) | 276-325 (70.1-82.5%) | 94-111 (23.9-28.2%) | 253-298 (64.2-75.6%) | 59-69 (15-17.5%) |
| Slowking (specWall, Leftovers) | 156-183 (39.6-46.4%) | 53-62 (13.5-15.7%) | 143-168 (36.3-42.6%) | 33-39 (8.4-9.9%) |
| Blissey (specWall, Leftovers) | 135-159 (18.9-22.3%) | 184-217 (25.8-30.4%) | 0-0 (0-0%) | 58-68 (8.1-9.5%) |
| Chansey (specWall, Eviolite) | 108-127 (15.3-18%) | 148-174 (21-24.7%) | 0-0 (0-0%) | 46-55 (6.5-7.8%) |
| Clefable (specWall, Leftovers) | 178-209 (45.2-53%) | 60-71 (15.2-18%) | 81-96 (20.6-24.4%) | 76-90 (19.3-22.8%) |
| Tapu Fini (specWall, Leftovers) | 138-163 (40.1-47.4%) | 47-55 (13.7-16%) | 63-75 (18.3-21.8%) | 30-35 (8.7-10.2%) |
| Skarmory (physWall, Leftovers) | 153-181 (45.8-54.2%) | 210-247 (62.9-74%) | 140-165 (41.9-49.4%) | 264-311 (79-93.1%) |
| Skarmory-Mega (physWall, no item) | 115-135 (34.4-40.4%) | 157-185 (47-55.4%) | 105-124 (31.4-37.1%) | 198-233 (59.3-69.8%) |
| Celesteela (physWall, Leftovers) | 114-134 (28.6-33.7%) | 156-183 (39.2-46%) | 104-123 (26.1-30.9%) | 196-231 (49.2-58%) |
| Hippowdon (physWall, Leftovers) | 301-354 (71.7-84.3%) | 205-242 (48.8-57.6%) | 137-162 (32.6-38.6%) | 129-152 (30.7-36.2%) |
| Mew (physWall, Leftovers) | 230-270 (56.9-66.8%) | 78-92 (19.3-22.8%) | 211-248 (52.2-61.4%) | 99-116 (24.5-28.7%) |
| Amoonguss (specWall, Black Sludge) | 95-112 (22-25.9%) | 65-77 (15-17.8%) | 87-103 (20.1-23.8%) | 165-194 (38.2-44.9%) |
| Goodra-Hisui (specWall, Leftovers) | 125-147 (34.3-40.4%) | 171-201 (47-55.2%) | 57-67 (15.7-18.4%) | 54-63 (14.8-17.3%) |
| Rotom-Wash (physWall, Leftovers) | 217-255 (71.4-83.9%) | 148-174 (48.7-57.2%) | 99-117 (32.6-38.5%) | 46-55 (15.1-18.1%) |
| Swampert (physWall, Leftovers) | 251-295 (62.1-73%) | 171-202 (42.3-50%) | 115-135 (28.5-33.4%) | 54-63 (13.4-15.6%) |
| Tyranitar (specWall, Leftovers) | 332-391 (82.2-96.8%) | 455-535 (112.6-132.4%) | 38-44 (9.4-10.9%) | 35-42 (8.7-10.4%) |
| Scizor (physWall, Leftovers) | 138-162 (40.1-47.1%) | 189-222 (54.9-64.5%) | 126-149 (36.6-43.3%) | 475-559 (138.1-162.5%) |
| Buzzwole (physWall, Leftovers) | 762-896 (182.3-214.4%) | 130-153 (31.1-36.6%) | 174-205 (41.6-49%) | 326-384 (78-91.9%) |

---

### Latias-Mega

**Latias-Mega** — forme, **UU**, tier source: imported (natdex)
  Dragon/Psychic | BST 700 (80/100/120/140/150/110)
  Abilities: Levitate (fixed by the forme)
  Engine stats @252 (neutral/positive): Levitate: Atk 299/328, SpA 379/416, Spe 319/350
  Held item: **Latiasite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Latias (RU), pre-Mega abilities: Levitate
  STAB: Dragon Draco Meteor 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Water Liquidation 85P, Dark Sucker Punch 80P, Ghost Shadow Claw 70P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Water Surf 95S, Fighting Aura Sphere 90S, Fairy Alluring Voice 80S
  Setup: Agility, Calm Mind, Dragon Dance, Hone Claws
  Reliable recovery: Recover, Rest, Roost
  Drain/unreliable: Draining Kiss, Dream Eater
  Priority: Sucker Punch 80P Dark (+1)
  Removal: Defog
  Pivot: Baton Pass
  Phazing: Roar
  Status: Thunder Wave, Toxic
  Cleric/support: Wish
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Healing Wish, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Tailwind, Trick
  Notable: Trick, Substitute, Baton Pass, Tailwind

Attacker: **Latias-Mega**, timid {"spa":252,"spe":252,"hp":4}, Latiasite (forced) — a representative test set, not a "standard" one.

| Defender (representative test set) | Draco Meteor | Aura Sphere | Ice Beam | Thunderbolt |
| --- | --- | --- | --- | --- |
| Aegislash (physWall, no item) | 85-100 (26.2-30.9%) | 0-0 (0-0%) | 39-46 (12-14.2%) | 78-92 (24.1-28.4%) |
| Slowbro-Mega (physWall, no item) | 292-344 (74.1-87.3%) | 62-74 (15.7-18.8%) | 66-78 (16.8-19.8%) | 265-312 (67.3-79.2%) |
| Slowbro (physWall, Leftovers) | 292-344 (74.1-87.3%) | 62-74 (15.7-18.8%) | 66-78 (16.8-19.8%) | 265-312 (67.3-79.2%) |
| Slowking (specWall, Leftovers) | 164-194 (41.6-49.2%) | 35-41 (8.9-10.4%) | 37-44 (9.4-11.2%) | 150-176 (38.1-44.7%) |
| Blissey (specWall, Leftovers) | 142-168 (19.9-23.5%) | 123-145 (17.2-20.3%) | 65-76 (9.1-10.6%) | 65-76 (9.1-10.6%) |
| Chansey (specWall, Eviolite) | 114-134 (16.2-19%) | 99-116 (14.1-16.5%) | 52-61 (7.4-8.7%) | 52-61 (7.4-8.7%) |
| Clefable (specWall, Leftovers) | 0-0 (0-0%) | 40-47 (10.2-11.9%) | 85-100 (21.6-25.4%) | 85-100 (21.6-25.4%) |
| Tapu Fini (specWall, Leftovers) | 0-0 (0-0%) | 31-37 (9-10.8%) | 33-39 (9.6-11.3%) | 133-157 (38.7-45.6%) |
| Skarmory (physWall, Leftovers) | 162-191 (48.5-57.2%) | 140-164 (41.9-49.1%) | 147-173 (44-51.8%) | 295-347 (88.3-103.9%) |
| Skarmory-Mega (physWall, no item) | 121-143 (36.2-42.8%) | 104-123 (31.1-36.8%) | 110-130 (32.9-38.9%) | 221-260 (66.2-77.8%) |
| Celesteela (physWall, Leftovers) | 120-141 (30.2-35.4%) | 104-122 (26.1-30.7%) | 109-129 (27.4-32.4%) | 219-258 (55-64.8%) |
| Hippowdon (physWall, Leftovers) | 318-374 (75.7-89%) | 137-161 (32.6-38.3%) | 289-340 (68.8-81%) | 0-0 (0-0%) |
| Mew (physWall, Leftovers) | 243-286 (60.1-70.8%) | 52-61 (12.9-15.1%) | 110-130 (27.2-32.2%) | 110-130 (27.2-32.2%) |
| Amoonguss (specWall, Black Sludge) | 202-238 (46.8-55.1%) | 43-51 (10-11.8%) | 184-216 (42.6-50%) | 46-54 (10.6-12.5%) |
| Goodra-Hisui (specWall, Leftovers) | 132-155 (36.3-42.6%) | 114-134 (31.3-36.8%) | 60-71 (16.5-19.5%) | 30-35 (8.2-9.6%) |
| Rotom-Wash (physWall, Leftovers) | 229-270 (75.3-88.8%) | 99-116 (32.6-38.2%) | 52-61 (17.1-20.1%) | 104-122 (34.2-40.1%) |
| Swampert (physWall, Leftovers) | 265-312 (65.6-77.2%) | 114-134 (28.2-33.2%) | 120-142 (29.7-35.1%) | 0-0 (0-0%) |
| Tyranitar (specWall, Leftovers) | 175-206 (43.3-51%) | 303-357 (75-88.4%) | 80-94 (19.8-23.3%) | 80-94 (19.8-23.3%) |
| Scizor (physWall, Leftovers) | 146-172 (42.4-50%) | 125-148 (36.3-43%) | 66-78 (19.2-22.7%) | 132-156 (38.4-45.3%) |
| Buzzwole (physWall, Leftovers) | 402-473 (96.2-113.2%) | 86-101 (20.6-24.2%) | 182-214 (43.5-51.2%) | 182-214 (43.5-51.2%) |

---

### Aegislash-Blade

**Aegislash-Blade** — species, **UU**, tier source: imported (natdex)
  Steel/Ghost | BST 520 (60/150/50/150/50/60)
  Abilities: Stance Change
  Engine stats @252 (neutral/positive): Stance Change: Atk 399/438, SpA 399/438, Spe 219/240
  Held item: **free**
  STAB: Steel Steel Beam 140S · Ghost Shadow Ball 80S
  Physical coverage: Rock Head Smash 150P, Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Return 102P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Flying Air Slash 75S, Normal Hidden Power 60S, Electric Shock Wave 60S
  Setup: Autotomize, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Priority: Shadow Sneak 40P Ghost (+1)
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Destiny Bond, Protect, Reflect, Substitute
  Notable: Substitute

Attacker: **Aegislash-Blade**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a representative test set, not a "standard" one.

| Defender (representative test set) | Steel Beam | Shadow Ball | Close Combat | Shadow Sneak |
| --- | --- | --- | --- | --- |
| Aegislash (physWall, no item) | 88-104 (27.2-32.1%) | 206-243 (63.6-75%) | 0-0 (0-0%) | 117-137 (36.1-42.3%) |
| Slowbro-Mega (physWall, no item) | 150-178 (38.1-45.2%) | 349-410 (88.6-104.1%) | 49-57 (12.4-14.5%) | 102-120 (25.9-30.5%) |
| Slowbro (physWall, Leftovers) | 150-178 (38.1-45.2%) | 349-410 (88.6-104.1%) | 70-83 (17.8-21.1%) | 145-171 (36.8-43.4%) |
| Slowking (specWall, Leftovers) | 84-100 (21.3-25.4%) | 197-232 (50-58.9%) | 124-146 (31.5-37.1%) | 254-300 (64.5-76.1%) |
| Blissey (specWall, Leftovers) | 148-174 (20.7-24.4%) | 0-0 (0-0%) | 1745-2054 (244.4-287.7%) | 0-0 (0-0%) |
| Chansey (specWall, Eviolite) | 118-139 (16.8-19.7%) | 0-0 (0-0%) | 1418-1667 (201.4-236.8%) | 0-0 (0-0%) |
| Clefable (specWall, Leftovers) | 391-460 (99.2-116.8%) | 113-132 (28.7-33.5%) | 133-158 (33.8-40.1%) | 136-161 (34.5-40.9%) |
| Tapu Fini (specWall, Leftovers) | 152-179 (44.2-52%) | 88-104 (25.6-30.2%) | 92-107 (26.7-31.1%) | 94-110 (27.3-32%) |
| Skarmory (physWall, Leftovers) | 167-197 (50-59%) | 193-227 (57.8-68%) | 118-140 (35.3-41.9%) | 61-72 (18.3-21.6%) |
| Skarmory-Mega (physWall, no item) | 126-148 (37.7-44.3%) | 145-170 (43.4-50.9%) | 140-166 (41.9-49.7%) | 72-85 (21.6-25.4%) |
| Celesteela (physWall, Leftovers) | 124-146 (31.2-36.7%) | 144-169 (36.2-42.5%) | 146-172 (36.7-43.2%) | 75-88 (18.8-22.1%) |
| Hippowdon (physWall, Leftovers) | 330-387 (78.6-92.1%) | 189-223 (45-53.1%) | 133-157 (31.7-37.4%) | 68-80 (16.2-19%) |
| Mew (physWall, Leftovers) | 252-296 (62.4-73.3%) | 291-341 (72-84.4%) | 75-88 (18.6-21.8%) | 154-182 (38.1-45%) |
| Amoonguss (specWall, Black Sludge) | 209-247 (48.4-57.2%) | 120-143 (27.8-33.1%) | 139-163 (32.2-37.7%) | 141-166 (32.6-38.4%) |
| Goodra-Hisui (specWall, Leftovers) | 67-80 (18.4-22%) | 79-93 (21.7-25.5%) | 417-491 (114.6-134.9%) | 106-124 (29.1-34.1%) |
| Rotom-Wash (physWall, Leftovers) | 58-70 (19.1-23%) | 137-161 (45.1-53%) | 143-169 (47-55.6%) | 74-87 (24.3-28.6%) |
| Swampert (physWall, Leftovers) | 137-161 (33.9-39.9%) | 158-185 (39.1-45.8%) | 161-189 (39.9-46.8%) | 81-97 (20-24%) |
| Tyranitar (specWall, Leftovers) | 365-429 (90.3-106.2%) | 52-61 (12.9-15.1%) | 770-906 (190.6-224.3%) | 48-57 (11.9-14.1%) |
| Scizor (physWall, Leftovers) | 150-178 (43.6-51.7%) | 174-205 (50.6-59.6%) | 150-176 (43.6-51.2%) | 76-91 (22.1-26.5%) |
| Buzzwole (physWall, Leftovers) | 417-491 (99.8-117.5%) | 239-282 (57.2-67.5%) | 59-70 (14.1-16.7%) | 61-72 (14.6-17.2%) |

---

### Aerodactyl-Mega

**Aerodactyl-Mega** — forme, **UU**, tier source: imported (natdex)
  Rock/Flying | BST 615 (80/135/85/70/95/150)
  Abilities: Tough Claws (fixed by the forme)
  Engine stats @252 (neutral/positive): Tough Claws: Atk 369/405, SpA 239/262, Spe 399/438
  Held item: **Aerodactylite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Aerodactyl (NU), pre-Mega abilities: Rock Head / Pressure / Unnerve
  STAB: Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Fire Fire Blast 120S, Dragon Dragon Pulse 90S, Ground Earth Power 90S, Normal Razor Wind 80 (charge)S, Ghost Ominous Wind 60S
  Setup: Agility, Dragon Dance, Hone Claws, Rock Polish
  Reliable recovery: Rest, Roost
  Hazards: Stealth Rock
  Removal: Defog
  Phazing: Roar, Whirlwind
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Protect, Reflect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

Attacker: **Aerodactyl-Mega**, jolly {"atk":252,"spe":252,"hp":4}, Aerodactylite (forced) — a representative test set, not a "standard" one.

| Defender (representative test set) | Stone Edge | Earthquake | Aqua Tail | Psychic Fangs |
| --- | --- | --- | --- | --- |
| Aegislash (physWall, no item) | 46-54 (14.2-16.7%) | 123-145 (38-44.8%) | 72-84 (22.2-25.9%) | 33-39 (10.2-12%) |
| Slowbro-Mega (physWall, no item) | 80-95 (20.3-24.1%) | 53-63 (13.5-16%) | 31-36 (7.9-9.1%) | 29-34 (7.4-8.6%) |
| Slowbro (physWall, Leftovers) | 115-135 (29.2-34.3%) | 76-90 (19.3-22.8%) | 44-52 (11.2-13.2%) | 42-49 (10.7-12.4%) |
| Slowking (specWall, Leftovers) | 204-240 (51.8-60.9%) | 136-160 (34.5-40.6%) | 79-93 (20.1-23.6%) | 74-87 (18.8-22.1%) |
| Blissey (specWall, Leftovers) | 708-833 (99.2-116.7%) | 472-555 (66.1-77.7%) | 552-649 (77.3-90.9%) | 519-610 (72.7-85.4%) |
| Chansey (specWall, Eviolite) | 575-676 (81.7-96%) | 383-451 (54.4-64.1%) | 448-527 (63.6-74.9%) | 421-496 (59.8-70.5%) |
| Clefable (specWall, Leftovers) | 219-258 (55.6-65.5%) | 146-172 (37.1-43.7%) | 171-201 (43.4-51%) | 160-189 (40.6-48%) |
| Tapu Fini (specWall, Leftovers) | 151-177 (43.9-51.5%) | 100-118 (29.1-34.3%) | 58-69 (16.9-20.1%) | 110-130 (32-37.8%) |
| Skarmory (physWall, Leftovers) | 97-114 (29-34.1%) | 0-0 (0-0%) | 75-89 (22.5-26.6%) | 35-41 (10.5-12.3%) |
| Skarmory-Mega (physWall, no item) | 115-135 (34.4-40.4%) | 0-0 (0-0%) | 89-105 (26.6-31.4%) | 42-49 (12.6-14.7%) |
| Celesteela (physWall, Leftovers) | 120-141 (30.2-35.4%) | 0-0 (0-0%) | 93-110 (23.4-27.6%) | 44-51 (11.1-12.8%) |
| Hippowdon (physWall, Leftovers) | 54-64 (12.9-15.2%) | 73-86 (17.4-20.5%) | 170-201 (40.5-47.9%) | 80-94 (19-22.4%) |
| Mew (physWall, Leftovers) | 123-144 (30.4-35.6%) | 82-96 (20.3-23.8%) | 95-112 (23.5-27.7%) | 45-52 (11.1-12.9%) |
| Amoonguss (specWall, Black Sludge) | 227-267 (52.5-61.8%) | 151-178 (35-41.2%) | 88-104 (20.4-24.1%) | 332-391 (76.9-90.5%) |
| Goodra-Hisui (specWall, Leftovers) | 85-100 (23.4-27.5%) | 226-266 (62.1-73.1%) | 66-77 (18.1-21.2%) | 62-73 (17-20.1%) |
| Rotom-Wash (physWall, Leftovers) | 117-138 (38.5-45.4%) | 156-184 (51.3-60.5%) | 45-53 (14.8-17.4%) | 85-101 (28-33.2%) |
| Swampert (physWall, Leftovers) | 65-77 (16.1-19.1%) | 87-103 (21.5-25.5%) | 102-120 (25.2-29.7%) | 96-113 (23.8-28%) |
| Tyranitar (specWall, Leftovers) | 156-184 (38.6-45.5%) | 209-246 (51.7-60.9%) | 244-287 (60.4-71%) | 0-0 (0-0%) |
| Scizor (physWall, Leftovers) | 123-144 (35.8-41.9%) | 82-96 (23.8-27.9%) | 95-112 (27.6-32.6%) | 45-52 (13.1-15.1%) |
| Buzzwole (physWall, Leftovers) | 98-115 (23.4-27.5%) | 32-38 (7.7-9.1%) | 76-89 (18.2-21.3%) | 143-168 (34.2-40.2%) |

---

### Chandelure-Mega

**Chandelure-Mega** — forme, **UU**, tier source: override
  Ghost/Fire | BST 620 (60/75/110/175/110/90)
  Abilities: Infiltrator (fixed by the forme)
  Engine stats @252 (neutral/positive): Infiltrator: Atk 249/273, SpA 449/493, Spe 279/306
  Held item: **Chandelurite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Chandelure (UU), pre-Mega abilities: Flash Fire / Flame Body / Infiltrator / Shadow Tag
  STAB: Ghost Shadow Ball 80S · Fire Overheat 140S
  Physical coverage: Normal Return 102P, Dark Lash Out 75P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S
  Setup: Acid Armor, Calm Mind
  Reliable recovery: Rest
  Drain/unreliable: Dream Eater
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Clear Smog, Haze, Memento, Pain Split, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

Attacker: **Chandelure-Mega**, timid {"spa":252,"spe":252,"hp":4}, Chandelurite (forced) — a representative test set, not a "standard" one.

| Defender (representative test set) | Overheat | Fire Blast | Shadow Ball | Energy Ball |
| --- | --- | --- | --- | --- |
| Aegislash (physWall, no item) | 405-477 (125-147.2%) | 348-410 (107.4-126.5%) | 234-275 (72.2-84.9%) | 43-51 (13.3-15.7%) |
| Slowbro-Mega (physWall, no item) | 173-203 (43.9-51.5%) | 148-174 (37.6-44.2%) | 397-467 (100.8-118.5%) | 297-350 (75.4-88.8%) |
| Slowbro (physWall, Leftovers) | 173-203 (43.9-51.5%) | 148-174 (37.6-44.2%) | 397-467 (100.8-118.5%) | 297-350 (75.4-88.8%) |
| Slowking (specWall, Leftovers) | 97-114 (24.6-28.9%) | 83-98 (21.1-24.9%) | 224-264 (56.9-67%) | 168-197 (42.6-50%) |
| Blissey (specWall, Leftovers) | 168-198 (23.5-27.7%) | 145-170 (20.3-23.8%) | 0-0 (0-0%) | 72-85 (10.1-11.9%) |
| Chansey (specWall, Eviolite) | 135-158 (19.2-22.4%) | 116-136 (16.5-19.3%) | 0-0 (0-0%) | 58-68 (8.2-9.7%) |
| Clefable (specWall, Leftovers) | 222-261 (56.3-66.2%) | 191-224 (48.5-56.9%) | 128-150 (32.5-38.1%) | 95-112 (24.1-28.4%) |
| Tapu Fini (specWall, Leftovers) | 86-102 (25-29.7%) | 74-87 (21.5-25.3%) | 100-117 (29.1-34%) | 149-176 (43.3-51.2%) |
| Skarmory (physWall, Leftovers) | 770-906 (230.5-271.3%) | 660-777 (197.6-232.6%) | 221-260 (66.2-77.8%) | 41-48 (12.3-14.4%) |
| Skarmory-Mega (physWall, no item) | 575-677 (172.2-202.7%) | 494-581 (147.9-174%) | 165-194 (49.4-58.1%) | 30-36 (9-10.8%) |
| Celesteela (physWall, Leftovers) | 570-671 (143.2-168.6%) | 490-576 (123.1-144.7%) | 164-193 (41.2-48.5%) | 30-36 (7.5-9%) |
| Hippowdon (physWall, Leftovers) | 376-443 (89.5-105.5%) | 323-380 (76.9-90.5%) | 216-254 (51.4-60.5%) | 323-381 (76.9-90.7%) |
| Mew (physWall, Leftovers) | 287-338 (71-83.7%) | 247-290 (61.1-71.8%) | 331-389 (81.9-96.3%) | 123-145 (30.4-35.9%) |
| Amoonguss (specWall, Black Sludge) | 479-563 (110.9-130.3%) | 411-484 (95.1-112%) | 138-162 (31.9-37.5%) | 25-30 (5.8-6.9%) |
| Goodra-Hisui (specWall, Leftovers) | 156-183 (42.9-50.3%) | 134-157 (36.8-43.1%) | 90-106 (24.7-29.1%) | 16-19 (4.4-5.2%) |
| Rotom-Wash (physWall, Leftovers) | 135-159 (44.4-52.3%) | 116-137 (38.2-45.1%) | 156-184 (51.3-60.5%) | 234-275 (77-90.5%) |
| Swampert (physWall, Leftovers) | 157-184 (38.9-45.5%) | 134-158 (33.2-39.1%) | 180-212 (44.6-52.5%) | 541-636 (133.9-157.4%) |
| Tyranitar (specWall, Leftovers) | 103-122 (25.5-30.2%) | 89-104 (22-25.7%) | 59-70 (14.6-17.3%) | 179-210 (44.3-52%) |
| Scizor (physWall, Leftovers) | 1384-1628 (402.3-473.3%) | 1187-1397 (345.1-406.1%) | 198-233 (57.6-67.7%) | 37-43 (10.8-12.5%) |
| Buzzwole (physWall, Leftovers) | 953-1121 (228-268.2%) | 817-962 (195.5-230.1%) | 273-321 (65.3-76.8%) | 102-120 (24.4-28.7%) |

---

### Emboar-Mega

**Emboar-Mega** — forme, **UU**, tier source: override
  Fire/Fighting | BST 628 (110/148/75/110/110/75)
  Abilities: Mold Breaker (fixed by the forme)
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 395/434, SpA 319/350, Spe 249/273
  Held item: **Emboarite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Emboar (PU), pre-Mega abilities: Blaze / Reckless
  STAB: Fire Overheat 140S · Fighting Focus Punch 150P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Hard Press 100P, Electric Wild Charge 90P, Dark Fling 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Water Scald 80S, Normal Tera Blast 80S, Poison Smog 30S, Ground Mud-Slap 20S
  Setup: Bulk Up, Defense Curl, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Priority: Sucker Punch 80P Dark (+1)
  Phazing: Roar
  Status: Toxic, Will-O-Wisp, Yawn
  Trapping: Block
  Weather/terrain: Sunny Day
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

Attacker: **Emboar-Mega**, adamant {"atk":252,"spe":252,"hp":4}, Emboarite (forced) — a representative test set, not a "standard" one.

| Defender (representative test set) | Flare Blitz | Close Combat | Head Smash | Sucker Punch | Wild Charge |
| --- | --- | --- | --- | --- | --- |
| Aegislash (physWall, no item) | 259-305 (79.9-94.1%) | 0-0 (0-0%) | 53-63 (16.4-19.4%) | 116-137 (35.8-42.3%) | 65-76 (20.1-23.5%) |
| Slowbro-Mega (physWall, no item) | 56-66 (14.2-16.8%) | 56-66 (14.2-16.8%) | 93-110 (23.6-27.9%) | 101-119 (25.6-30.2%) | 114-134 (28.9-34%) |
| Slowbro (physWall, Leftovers) | 80-95 (20.3-24.1%) | 80-95 (20.3-24.1%) | 134-158 (34-40.1%) | 145-170 (36.8-43.1%) | 162-191 (41.1-48.5%) |
| Slowking (specWall, Leftovers) | 143-168 (36.3-42.6%) | 143-168 (36.3-42.6%) | 238-281 (60.4-71.3%) | 256-301 (65-76.4%) | 287-338 (72.8-85.8%) |
| Blissey (specWall, Leftovers) | 998-1174 (139.8-164.4%) | 1997-2349 (279.7-329%) | 831-978 (116.4-137%) | 444-522 (62.2-73.1%) | 499-587 (69.9-82.2%) |
| Chansey (specWall, Eviolite) | 810-954 (115.1-135.5%) | 1621-1908 (230.3-271%) | 675-794 (95.9-112.8%) | 360-424 (51.1-60.2%) | 405-477 (57.5-67.8%) |
| Clefable (specWall, Leftovers) | 309-363 (78.4-92.1%) | 154-181 (39.1-45.9%) | 257-302 (65.2-76.6%) | 68-81 (17.3-20.6%) | 154-182 (39.1-46.2%) |
| Tapu Fini (specWall, Leftovers) | 106-124 (30.8-36%) | 106-124 (30.8-36%) | 176-207 (51.2-60.2%) | 47-55 (13.7-16%) | 213-250 (61.9-72.7%) |
| Skarmory (physWall, Leftovers) | 273-321 (81.7-96.1%) | 136-160 (40.7-47.9%) | 113-133 (33.8-39.8%) | 61-72 (18.3-21.6%) | 137-161 (41-48.2%) |
| Skarmory-Mega (physWall, no item) | 323-380 (96.7-113.8%) | 161-190 (48.2-56.9%) | 134-158 (40.1-47.3%) | 72-85 (21.6-25.4%) | 162-191 (48.5-57.2%) |
| Celesteela (physWall, Leftovers) | 338-397 (84.9-99.7%) | 169-198 (42.5-49.7%) | 140-165 (35.2-41.5%) | 75-89 (18.8-22.4%) | 169-199 (42.5-50%) |
| Hippowdon (physWall, Leftovers) | 154-181 (36.7-43.1%) | 154-181 (36.7-43.1%) | 64-75 (15.2-17.9%) | 69-81 (16.4-19.3%) | 0-0 (0-0%) |
| Mew (physWall, Leftovers) | 172-203 (42.6-50.2%) | 86-101 (21.3-25%) | 143-168 (35.4-41.6%) | 154-181 (38.1-44.8%) | 86-102 (21.3-25.2%) |
| Amoonguss (specWall, Black Sludge) | 638-751 (147.7-173.8%) | 159-187 (36.8-43.3%) | 265-312 (61.3-72.2%) | 142-167 (32.9-38.7%) | 80-94 (18.5-21.8%) |
| Goodra-Hisui (specWall, Leftovers) | 238-281 (65.4-77.2%) | 477-562 (131-154.4%) | 99-116 (27.2-31.9%) | 106-125 (29.1-34.3%) | 59-70 (16.2-19.2%) |
| Rotom-Wash (physWall, Leftovers) | 82-96 (27-31.6%) | 164-193 (53.9-63.5%) | 136-160 (44.7-52.6%) | 73-86 (24-28.3%) | 82-97 (27-31.9%) |
| Swampert (physWall, Leftovers) | 92-108 (22.8-26.7%) | 184-217 (45.5-53.7%) | 76-90 (18.8-22.3%) | 82-97 (20.3-24%) | 0-0 (0-0%) |
| Tyranitar (specWall, Leftovers) | 110-129 (27.2-31.9%) | 881-1037 (218.1-256.7%) | 183-215 (45.3-53.2%) | 49-57 (12.1-14.1%) | 110-130 (27.2-32.2%) |
| Scizor (physWall, Leftovers) | 690-812 (200.6-236%) | 172-203 (50-59%) | 143-168 (41.6-48.8%) | 77-90 (22.4-26.2%) | 86-102 (25-29.7%) |
| Buzzwole (physWall, Leftovers) | 274-323 (65.6-77.3%) | 68-80 (16.3-19.1%) | 113-134 (27-32.1%) | 30-36 (7.2-8.6%) | 69-81 (16.5-19.4%) |

---

### Scrafty-Mega

**Scrafty-Mega** — forme, **UU**, tier source: override
  Dark/Fighting | BST 588 (65/130/135/55/135/68)
  Abilities: Intimidate (fixed by the forme)
  Engine stats @252 (neutral/positive): Intimidate: Atk 359/394, SpA 209/229, Spe 235/258
  Held item: **Scraftinite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Scrafty (NU), pre-Mega abilities: Shed Skin / Moxie / Intimidate
  STAB: Dark Foul Play 95P · Fighting Focus Punch 150P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P
  Special coverage: Dragon Dragon Pulse 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Grass Grass Knot 60S, Fire Incinerate 60S
  Setup: Amnesia, Bulk Up, Dragon Dance, Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Fake Out 40P Normal (+3)
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Encore, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Encore, Taunt, Substitute

Attacker: **Scrafty-Mega**, adamant {"atk":252,"spe":252,"hp":4}, Scraftinite (forced) — a representative test set, not a "standard" one.

| Defender (representative test set) | Knock Off | Drain Punch | Head Smash | Upper Hand |
| --- | --- | --- | --- | --- |
| Aegislash (physWall, no item) | 130-153 (40.1-47.2%) | 0-0 (0-0%) | 49-57 (15.1-17.6%) | 0-0 (0-0%) |
| Slowbro-Mega (physWall, no item) | 167-197 (42.4-50%) | 32-38 (8.1-9.6%) | 85-100 (21.6-25.4%) | 28-33 (7.1-8.4%) |
| Slowbro (physWall, Leftovers) | 238-281 (60.4-71.3%) | 46-54 (11.7-13.7%) | 122-143 (31-36.3%) | 40-47 (10.2-11.9%) |
| Slowking (specWall, Leftovers) | 422-497 (107.1-126.1%) | 82-96 (20.8-24.4%) | 216-255 (54.8-64.7%) | 71-83 (18-21.1%) |
| Blissey (specWall, Leftovers) | 733-862 (102.7-120.7%) | 1135-1335 (159-187%) | 755-888 (105.7-124.4%) | 984-1158 (137.8-162.2%) |
| Chansey (specWall, Eviolite) | 595-700 (84.5-99.4%) | 922-1085 (131-154.1%) | 613-721 (87.1-102.4%) | 800-941 (113.6-133.7%) |
| Clefable (specWall, Leftovers) | 113-133 (28.7-33.8%) | 88-103 (22.3-26.1%) | 233-274 (59.1-69.5%) | 76-90 (19.3-22.8%) |
| Tapu Fini (specWall, Leftovers) | 78-92 (22.7-26.7%) | 60-71 (17.4-20.6%) | 160-188 (46.5-54.7%) | 52-62 (15.1-18%) |
| Skarmory (physWall, Leftovers) | 100-118 (29.9-35.3%) | 78-92 (23.4-27.5%) | 103-121 (30.8-36.2%) | 68-80 (20.4-24%) |
| Skarmory-Mega (physWall, no item) | 119-140 (35.6-41.9%) | 92-109 (27.5-32.6%) | 122-143 (36.5-42.8%) | 80-95 (24-28.4%) |
| Celesteela (physWall, Leftovers) | 124-146 (31.2-36.7%) | 97-114 (24.4-28.6%) | 127-150 (31.9-37.7%) | 84-99 (21.1-24.9%) |
| Hippowdon (physWall, Leftovers) | 113-133 (26.9-31.7%) | 88-104 (21-24.8%) | 58-68 (13.8-16.2%) | 77-90 (18.3-21.4%) |
| Mew (physWall, Leftovers) | 254-299 (62.9-74%) | 49-58 (12.1-14.4%) | 130-153 (32.2-37.9%) | 43-50 (10.6-12.4%) |
| Amoonguss (specWall, Black Sludge) | 235-276 (54.4-63.9%) | 91-107 (21.1-24.8%) | 241-284 (55.8-65.7%) | 79-93 (18.3-21.5%) |
| Goodra-Hisui (specWall, Leftovers) | 175-207 (48.1-56.9%) | 273-321 (75-88.2%) | 90-106 (24.7-29.1%) | 237-279 (65.1-76.6%) |
| Rotom-Wash (physWall, Leftovers) | 121-142 (39.8-46.7%) | 94-111 (30.9-36.5%) | 124-146 (40.8-48%) | 82-96 (27-31.6%) |
| Swampert (physWall, Leftovers) | 136-160 (33.7-39.6%) | 105-124 (26-30.7%) | 69-82 (17.1-20.3%) | 92-108 (22.8-26.7%) |
| Tyranitar (specWall, Leftovers) | 81-95 (20-23.5%) | 504-593 (124.8-146.8%) | 166-195 (41.1-48.3%) | 438-516 (108.4-127.7%) |
| Scizor (physWall, Leftovers) | 127-149 (36.9-43.3%) | 99-116 (28.8-33.7%) | 130-153 (37.8-44.5%) | 86-101 (25-29.4%) |
| Buzzwole (physWall, Leftovers) | 50-59 (12-14.1%) | 39-46 (9.3-11%) | 103-121 (24.6-28.9%) | 34-40 (8.1-9.6%) |

---

### Serperior

**Serperior** — species, **UU**, tier source: imported (natdex)
  Grass | BST 528 (75/75/95/75/95/113)
  Abilities: Overgrow / Contrary
  Engine stats @252 (neutral/positive): Overgrow: Atk 249/273, SpA 249/273, Spe 325/357 — Contrary: Atk 249/273, SpA 249/273, Spe 325/357
  Held item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Water Aqua Tail 90P, Dark Knock Off 65P, Flying Aerial Ace 60P
  Special coverage: Normal Wring Out 120S, Dragon Dragon Pulse 90S, Psychic Mirror Coat fixedS
  Setup: Calm Mind, Coil, Growth, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1)
  Removal: Defog
  Phazing: Dragon Tail
  Status: Glare, Toxic
  Cleric/support: Aromatherapy
  Trapping: Mean Look
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Knock Off, Leech Seed, Light Screen, Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

Attacker: **Serperior**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a representative test set, not a "standard" one.

| Defender (representative test set) | Leaf Storm | Giga Drain | Knock Off | Grassy Glide |
| --- | --- | --- | --- | --- |
| Aegislash (physWall, no item) | 72-85 (22.2-26.2%) | 40-46 (12.3-14.2%) | 49-58 (15.1-17.9%) | 19-23 (5.9-7.1%) |
| Slowbro-Mega (physWall, no item) | 501-590 (127.2-149.7%) | 271-319 (68.8-81%) | 63-74 (16-18.8%) | 70-83 (17.8-21.1%) |
| Slowbro (physWall, Leftovers) | 501-590 (127.2-149.7%) | 271-319 (68.8-81%) | 89-105 (22.6-26.6%) | 98-117 (24.9-29.7%) |
| Slowking (specWall, Leftovers) | 283-332 (71.8-84.3%) | 154-182 (39.1-46.2%) | 157-184 (39.8-46.7%) | 171-202 (43.4-51.3%) |
| Blissey (specWall, Leftovers) | 122-144 (17.1-20.2%) | 66-79 (9.2-11.1%) | 270-317 (37.8-44.4%) | 293-345 (41-48.3%) |
| Chansey (specWall, Eviolite) | 98-115 (13.9-16.3%) | 53-63 (7.5-8.9%) | 219-258 (31.1-36.6%) | 237-280 (33.7-39.8%) |
| Clefable (specWall, Leftovers) | 161-189 (40.9-48%) | 87-102 (22.1-25.9%) | 41-49 (10.4-12.4%) | 92-107 (23.4-27.2%) |
| Tapu Fini (specWall, Leftovers) | 252-296 (73.3-86%) | 137-162 (39.8-47.1%) | 28-33 (8.1-9.6%) | 128-150 (37.2-43.6%) |
| Skarmory (physWall, Leftovers) | 68-81 (20.4-24.3%) | 37-44 (11.1-13.2%) | 37-44 (11.1-13.2%) | 10-11 (3-3.3%) |
| Skarmory-Mega (physWall, no item) | 52-61 (15.6-18.3%) | 27-32 (8.1-9.6%) | 44-52 (13.2-15.6%) | 11-14 (3.3-4.2%) |
| Celesteela (physWall, Leftovers) | 50-59 (12.6-14.8%) | 27-32 (6.8-8%) | 46-54 (11.6-13.6%) | 11-14 (2.8-3.5%) |
| Hippowdon (physWall, Leftovers) | 544-642 (129.5-152.9%) | 295-347 (70.2-82.6%) | 42-49 (10-11.7%) | 94-111 (22.4-26.4%) |
| Mew (physWall, Leftovers) | 208-245 (51.5-60.6%) | 113-132 (28-32.7%) | 94-111 (23.3-27.5%) | 52-61 (12.9-15.1%) |
| Amoonguss (specWall, Black Sludge) | 42-50 (9.7-11.6%) | 23-27 (5.3-6.3%) | 87-102 (20.1-23.6%) | 23-27 (5.3-6.3%) |
| Goodra-Hisui (specWall, Leftovers) | 27-32 (7.4-8.8%) | 15-18 (4.1-4.9%) | 65-76 (17.9-20.9%) | 16-20 (4.4-5.5%) |
| Rotom-Wash (physWall, Leftovers) | 393-464 (129.3-152.6%) | 214-252 (70.4-82.9%) | 45-53 (14.8-17.4%) | 100-118 (32.9-38.8%) |
| Swampert (physWall, Leftovers) | 911-1072 (225.5-265.3%) | 494-581 (122.3-143.8%) | 50-59 (12.4-14.6%) | 224-265 (55.4-65.6%) |
| Tyranitar (specWall, Leftovers) | 301-354 (74.5-87.6%) | 165-193 (40.8-47.8%) | 29-35 (7.2-8.7%) | 132-157 (32.7-38.9%) |
| Scizor (physWall, Leftovers) | 62-72 (18-20.9%) | 33-39 (9.6-11.3%) | 46-55 (13.4-16%) | 13-14 (3.8-4.1%) |
| Buzzwole (physWall, Leftovers) | 171-202 (40.9-48.3%) | 92-109 (22-26.1%) | 18-22 (4.3-5.3%) | 20-24 (4.8-5.7%) |

---

### Blacephalon

**Blacephalon** — species, **UU**, tier source: imported (natdex)
  Fire/Ghost | BST 570 (53/127/53/151/79/107)
  Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 353/388, SpA 401/441, Spe 313/344
  Held item: **free**
  STAB: Fire Mind Blown 150S · Ghost Shadow Ball 80S
  Physical coverage: Normal Explosion 250P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Rock Rock Blast 25x2-5P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S
  Setup: Calm Mind
  Reliable recovery: Rest
  Status: Hypnosis, Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Encore, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Substitute, Taunt, Trick
  Notable: Knock Off, Trick, Encore, Taunt, Substitute

Attacker: **Blacephalon**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a representative test set, not a "standard" one.

| Defender (representative test set) | Mind Blown | Shadow Ball | Overheat | Fire Blast |
| --- | --- | --- | --- | --- |
| Aegislash (physWall, no item) | 504-594 (155.6-183.3%) | 271-319 (83.6-98.5%) | 470-555 (145.1-171.3%) | 404-475 (124.7-146.6%) |
| Slowbro-Mega (physWall, no item) | 214-252 (54.3-64%) | 461-543 (117-137.8%) | 200-235 (50.8-59.6%) | 171-202 (43.4-51.3%) |
| Slowbro (physWall, Leftovers) | 214-252 (54.3-64%) | 461-543 (117-137.8%) | 200-235 (50.8-59.6%) | 171-202 (43.4-51.3%) |
| Slowking (specWall, Leftovers) | 120-141 (30.5-35.8%) | 261-306 (66.2-77.7%) | 113-132 (28.7-33.5%) | 96-114 (24.4-28.9%) |
| Blissey (specWall, Leftovers) | 209-247 (29.3-34.6%) | 0-0 (0-0%) | 196-230 (27.5-32.2%) | 167-197 (23.4-27.6%) |
| Chansey (specWall, Eviolite) | 167-197 (23.7-28%) | 0-0 (0-0%) | 156-184 (22.2-26.1%) | 133-158 (18.9-22.4%) |
| Clefable (specWall, Leftovers) | 276-325 (70.1-82.5%) | 148-175 (37.6-44.4%) | 258-304 (65.5-77.2%) | 221-261 (56.1-66.2%) |
| Tapu Fini (specWall, Leftovers) | 107-126 (31.1-36.6%) | 115-136 (33.4-39.5%) | 100-118 (29.1-34.3%) | 85-101 (24.7-29.4%) |
| Skarmory (physWall, Leftovers) | 958-1127 (286.8-337.4%) | 256-301 (76.6-90.1%) | 894-1051 (267.7-314.7%) | 767-902 (229.6-270.1%) |
| Skarmory-Mega (physWall, no item) | 716-842 (214.4-252.1%) | 192-226 (57.5-67.7%) | 668-786 (200-235.3%) | 573-674 (171.6-201.8%) |
| Celesteela (physWall, Leftovers) | 709-834 (178.1-209.5%) | 189-223 (47.5-56%) | 663-780 (166.6-196%) | 569-669 (143-168.1%) |
| Hippowdon (physWall, Leftovers) | 468-551 (111.4-131.2%) | 250-295 (59.5-70.2%) | 436-513 (103.8-122.1%) | 374-440 (89-104.8%) |
| Mew (physWall, Leftovers) | 357-421 (88.4-104.2%) | 384-452 (95-111.9%) | 334-392 (82.7-97%) | 286-336 (70.8-83.2%) |
| Amoonguss (specWall, Black Sludge) | 595-700 (137.7-162%) | 159-188 (36.8-43.5%) | 556-655 (128.7-151.6%) | 478-561 (110.6-129.9%) |
| Goodra-Hisui (specWall, Leftovers) | 193-228 (53-62.6%) | 104-123 (28.6-33.8%) | 180-213 (49.5-58.5%) | 156-183 (42.9-50.3%) |
| Rotom-Wash (physWall, Leftovers) | 169-198 (55.6-65.1%) | 180-213 (59.2-70.1%) | 157-184 (51.6-60.5%) | 135-158 (44.4-52%) |
| Swampert (physWall, Leftovers) | 195-228 (48.3-56.4%) | 209-247 (51.7-61.1%) | 182-214 (45-53%) | 156-183 (38.6-45.3%) |
| Tyranitar (specWall, Leftovers) | 128-152 (31.7-37.6%) | 68-81 (16.8-20%) | 119-141 (29.5-34.9%) | 102-120 (25.2-29.7%) |
| Scizor (physWall, Leftovers) | 1721-2025 (500.3-588.7%) | 230-271 (66.9-78.8%) | 1608-1891 (467.4-549.7%) | 1379-1623 (400.9-471.8%) |
| Buzzwole (physWall, Leftovers) | 1185-1394 (283.5-333.5%) | 317-373 (75.8-89.2%) | 1106-1302 (264.6-311.5%) | 949-1116 (227-267%) |

---

### Sharpedo-Mega

**Sharpedo-Mega** — forme, **UU**, tier source: imported (natdex)
  Water/Dark | BST 560 (70/140/70/110/65/105)
  Abilities: Strong Jaw (fixed by the forme)
  Engine stats @252 (neutral/positive): Strong Jaw: Atk 379/416, SpA 319/350, Spe 309/339
  Held item: **Sharpedonite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Sharpedo (RU), pre-Mega abilities: Rough Skin / Speed Boost
  STAB: Water Hydro Pump 120S · Dark Crunch 80P
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Ground Earthquake 100P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Rock Ancient Power 60S, Ground Mud-Slap 20S
  Setup: Agility
  Reliable recovery: Rest
  Priority: Feint 50P Normal (+2), Aqua Jet 40P Water (+1)
  Pivot: Flip Turn
  Phazing: Roar
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Destiny Bond, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

Attacker: **Sharpedo-Mega**, jolly {"atk":252,"spe":252,"hp":4}, Sharpedonite (forced) — a representative test set, not a "standard" one.

| Defender (representative test set) | Crunch | Psychic Fangs | Waterfall | Ice Fang |
| --- | --- | --- | --- | --- |
| Aegislash (physWall, no item) | 227-267 (70.1-82.4%) | 40-47 (12.3-14.5%) | 76-90 (23.5-27.8%) | 30-36 (9.3-11.1%) |
| Slowbro-Mega (physWall, no item) | 198-233 (50.3-59.1%) | 34-41 (8.6-10.4%) | 33-39 (8.4-9.9%) | 26-31 (6.6-7.9%) |
| Slowbro (physWall, Leftovers) | 283-333 (71.8-84.5%) | 49-58 (12.4-14.7%) | 47-56 (11.9-14.2%) | 38-45 (9.6-11.4%) |
| Slowking (specWall, Leftovers) | 502-590 (127.4-149.7%) | 88-104 (22.3-26.4%) | 84-98 (21.3-24.9%) | 67-79 (17-20.1%) |
| Blissey (specWall, Leftovers) | 872-1026 (122.1-143.7%) | 615-723 (86.1-101.3%) | 582-685 (81.5-95.9%) | 470-553 (65.8-77.5%) |
| Chansey (specWall, Eviolite) | 708-833 (100.6-118.3%) | 499-587 (70.9-83.4%) | 473-556 (67.2-79%) | 382-449 (54.3-63.8%) |
| Clefable (specWall, Leftovers) | 135-158 (34.3-40.1%) | 190-224 (48.2-56.9%) | 180-212 (45.7-53.8%) | 145-171 (36.8-43.4%) |
| Tapu Fini (specWall, Leftovers) | 92-109 (26.7-31.7%) | 130-153 (37.8-44.5%) | 62-73 (18-21.2%) | 50-59 (14.5-17.2%) |
| Skarmory (physWall, Leftovers) | 119-140 (35.6-41.9%) | 42-49 (12.6-14.7%) | 80-94 (24-28.1%) | 64-76 (19.2-22.8%) |
| Skarmory-Mega (physWall, no item) | 141-166 (42.2-49.7%) | 49-58 (14.7-17.4%) | 95-112 (28.4-33.5%) | 76-90 (22.8-26.9%) |
| Celesteela (physWall, Leftovers) | 147-174 (36.9-43.7%) | 52-61 (13.1-15.3%) | 99-117 (24.9-29.4%) | 80-94 (20.1-23.6%) |
| Hippowdon (physWall, Leftovers) | 134-158 (31.9-37.6%) | 95-111 (22.6-26.4%) | 181-213 (43.1-50.7%) | 146-171 (34.8-40.7%) |
| Mew (physWall, Leftovers) | 302-355 (74.8-87.9%) | 53-62 (13.1-15.3%) | 101-119 (25-29.5%) | 81-96 (20-23.8%) |
| Amoonguss (specWall, Black Sludge) | 279-328 (64.6-75.9%) | 393-463 (91-107.2%) | 93-110 (21.5-25.5%) | 301-354 (69.7-81.9%) |
| Goodra-Hisui (specWall, Leftovers) | 208-245 (57.1-67.3%) | 73-86 (20.1-23.6%) | 70-82 (19.2-22.5%) | 112-132 (30.8-36.3%) |
| Rotom-Wash (physWall, Leftovers) | 144-169 (47.4-55.6%) | 101-119 (33.2-39.1%) | 48-57 (15.8-18.8%) | 39-45 (12.8-14.8%) |
| Swampert (physWall, Leftovers) | 161-190 (39.9-47%) | 114-134 (28.2-33.2%) | 108-127 (26.7-31.4%) | 87-102 (21.5-25.2%) |
| Tyranitar (specWall, Leftovers) | 96-113 (23.8-28%) | 0-0 (0-0%) | 258-304 (63.9-75.2%) | 104-122 (25.7-30.2%) |
| Scizor (physWall, Leftovers) | 151-177 (43.9-51.5%) | 53-62 (15.4-18%) | 101-119 (29.4-34.6%) | 40-48 (11.6-14%) |
| Buzzwole (physWall, Leftovers) | 60-70 (14.4-16.7%) | 169-199 (40.4-47.6%) | 80-95 (19.1-22.7%) | 65-76 (15.6-18.2%) |

---

### Dragalge-Mega

**Dragalge-Mega** — forme, **UU**, tier source: override
  Poison/Dragon | BST 594 (65/85/105/132/163/44)
  Abilities: Regenerator (fixed by the forme)
  Engine stats @252 (neutral/positive): Regenerator: Atk 269/295, SpA 363/399, Spe 187/205
  Held item: **Dragalgite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Dragalge (NU), pre-Mega abilities: Poison Point / Poison Touch / Adaptability
  STAB: Poison Sludge Wave 95S · Dragon Draco Meteor 140S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Water Aqua Tail 90P, Fairy Play Rough 90P, Flying Bounce 85 (charge)P, Dark Feint Attack 60P
  Special coverage: Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ice Icy Wind 55S
  Setup: Acid Armor
  Reliable recovery: Rest
  Hazards: Toxic Spikes
  Pivot: Flip Turn
  Phazing: Dragon Tail
  Status: Toxic
  Weather/terrain: Hail, Rain Dance, Snowscape
  Utility: Haze, Protect, Substitute
  Notable: Substitute

Attacker: **Dragalge-Mega**, modest {"spa":252,"spe":252,"hp":4}, Dragalgite (forced) — a representative test set, not a "standard" one.

| Defender (representative test set) | Sludge Wave | Draco Meteor | Focus Blast | Thunderbolt |
| --- | --- | --- | --- | --- |
| Aegislash (physWall, no item) | 0-0 (0-0%) | 90-106 (27.8-32.7%) | 0-0 (0-0%) | 82-96 (25.3-29.6%) |
| Slowbro-Mega (physWall, no item) | 209-246 (53-62.4%) | 307-362 (77.9-91.9%) | 88-103 (22.3-26.1%) | 279-328 (70.8-83.2%) |
| Slowbro (physWall, Leftovers) | 209-246 (53-62.4%) | 307-362 (77.9-91.9%) | 88-103 (22.3-26.1%) | 279-328 (70.8-83.2%) |
| Slowking (specWall, Leftovers) | 118-139 (29.9-35.3%) | 173-204 (43.9-51.8%) | 49-58 (12.4-14.7%) | 158-185 (40.1-47%) |
| Blissey (specWall, Leftovers) | 102-120 (14.3-16.8%) | 150-176 (21-24.6%) | 172-202 (24.1-28.3%) | 68-80 (9.5-11.2%) |
| Chansey (specWall, Eviolite) | 82-97 (11.6-13.8%) | 120-141 (17-20%) | 137-162 (19.5-23%) | 54-64 (7.7-9.1%) |
| Clefable (specWall, Leftovers) | 270-318 (68.5-80.7%) | 0-0 (0-0%) | 56-66 (14.2-16.8%) | 90-106 (22.8-26.9%) |
| Tapu Fini (specWall, Leftovers) | 211-248 (61.3-72.1%) | 0-0 (0-0%) | 44-52 (12.8-15.1%) | 140-165 (40.7-48%) |
| Skarmory (physWall, Leftovers) | 0-0 (0-0%) | 171-201 (51.2-60.2%) | 195-230 (58.4-68.9%) | 310-365 (92.8-109.3%) |
| Skarmory-Mega (physWall, no item) | 0-0 (0-0%) | 128-150 (38.3-44.9%) | 146-172 (43.7-51.5%) | 232-273 (69.5-81.7%) |
| Celesteela (physWall, Leftovers) | 0-0 (0-0%) | 126-149 (31.7-37.4%) | 145-170 (36.4-42.7%) | 230-271 (57.8-68.1%) |
| Hippowdon (physWall, Leftovers) | 114-134 (27.1-31.9%) | 334-394 (79.5-93.8%) | 191-225 (45.5-53.6%) | 0-0 (0-0%) |
| Mew (physWall, Leftovers) | 174-205 (43.1-50.7%) | 256-301 (63.4-74.5%) | 73-86 (18.1-21.3%) | 116-136 (28.7-33.7%) |
| Amoonguss (specWall, Black Sludge) | 145-171 (33.6-39.6%) | 213-250 (49.3-57.9%) | 61-71 (14.1-16.4%) | 48-57 (11.1-13.2%) |
| Goodra-Hisui (specWall, Leftovers) | 0-0 (0-0%) | 139-163 (38.2-44.8%) | 159-187 (43.7-51.4%) | 31-37 (8.5-10.2%) |
| Rotom-Wash (physWall, Leftovers) | 164-194 (53.9-63.8%) | 241-284 (79.3-93.4%) | 138-162 (45.4-53.3%) | 109-129 (35.9-42.4%) |
| Swampert (physWall, Leftovers) | 95-112 (23.5-27.7%) | 279-328 (69.1-81.2%) | 159-188 (39.4-46.5%) | 0-0 (0-0%) |
| Tyranitar (specWall, Leftovers) | 63-74 (15.6-18.3%) | 184-217 (45.5-53.7%) | 423-498 (104.7-123.3%) | 84-99 (20.8-24.5%) |
| Scizor (physWall, Leftovers) | 0-0 (0-0%) | 153-181 (44.5-52.6%) | 176-207 (51.2-60.2%) | 139-164 (40.4-47.7%) |
| Buzzwole (physWall, Leftovers) | 288-339 (68.9-81.1%) | 423-498 (101.2-119.1%) | 121-142 (28.9-34%) | 192-226 (45.9-54.1%) |

---

### Drampa-Mega

**Drampa-Mega** — forme, **UU**, tier source: override
  Normal/Dragon | BST 585 (78/85/110/160/116/36)
  Abilities: Berserk (fixed by the forme)
  Engine stats @252 (neutral/positive): Berserk: Atk 269/295, SpA 419/460, Spe 171/188
  Held item: **Drampanite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Drampa (NU), pre-Mega abilities: Berserk / Sap Sipper / Cloud Nine
  STAB: Normal Hyper Voice 90S · Dragon Draco Meteor 140S
  Physical coverage: Fighting Superpower 120P, Ground Earthquake 100P, Fairy Play Rough 90P, Flying Fly 90 (charge)P, Dark Fling 80P, Rock Rock Slide 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Flying Hurricane 120S, Water Hydro Pump 120S, Electric Thunder 120S
  Setup: Amnesia, Calm Mind, Dragon Dance, Work Up
  Reliable recovery: Rest, Roost
  Removal: Defog
  Phazing: Dragon Tail, Roar
  Status: Glare, Thunder Wave, Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Light Screen, Protect, Safeguard, Substitute, Tailwind
  Notable: Substitute, Tailwind

Attacker: **Drampa-Mega**, modest {"spa":252,"spe":252,"hp":4}, Drampanite (forced) — a representative test set, not a "standard" one.

| Defender (representative test set) | Draco Meteor | Hyper Voice | Fire Blast | Thunderbolt |
| --- | --- | --- | --- | --- |
| Aegislash (physWall, no item) | 103-122 (31.8-37.7%) | 0-0 (0-0%) | 238-280 (73.5-86.4%) | 94-111 (29-34.3%) |
| Slowbro-Mega (physWall, no item) | 354-417 (89.8-105.8%) | 228-269 (57.9-68.3%) | 101-119 (25.6-30.2%) | 321-378 (81.5-95.9%) |
| Slowbro (physWall, Leftovers) | 354-417 (89.8-105.8%) | 228-269 (57.9-68.3%) | 101-119 (25.6-30.2%) | 321-378 (81.5-95.9%) |
| Slowking (specWall, Leftovers) | 199-234 (50.5-59.4%) | 129-152 (32.7-38.6%) | 57-67 (14.5-17%) | 181-213 (45.9-54.1%) |
| Blissey (specWall, Leftovers) | 172-203 (24.1-28.4%) | 112-131 (15.7-18.3%) | 99-116 (13.9-16.2%) | 78-92 (10.9-12.9%) |
| Chansey (specWall, Eviolite) | 138-162 (19.6-23%) | 89-105 (12.6-14.9%) | 79-93 (11.2-13.2%) | 63-74 (8.9-10.5%) |
| Clefable (specWall, Leftovers) | 0-0 (0-0%) | 147-173 (37.3-43.9%) | 130-153 (33-38.8%) | 103-121 (26.1-30.7%) |
| Tapu Fini (specWall, Leftovers) | 0-0 (0-0%) | 115-135 (33.4-39.2%) | 50-59 (14.5-17.2%) | 161-190 (46.8-55.2%) |
| Skarmory (physWall, Leftovers) | 197-232 (59-69.5%) | 127-149 (38-44.6%) | 451-530 (135-158.7%) | 357-421 (106.9-126%) |
| Skarmory-Mega (physWall, no item) | 147-173 (44-51.8%) | 95-112 (28.4-33.5%) | 337-396 (100.9-118.6%) | 267-315 (79.9-94.3%) |
| Celesteela (physWall, Leftovers) | 146-171 (36.7-43%) | 94-111 (23.6-27.9%) | 334-393 (83.9-98.7%) | 265-312 (66.6-78.4%) |
| Hippowdon (physWall, Leftovers) | 385-453 (91.7-107.9%) | 248-292 (59-69.5%) | 220-259 (52.4-61.7%) | 0-0 (0-0%) |
| Mew (physWall, Leftovers) | 294-346 (72.8-85.6%) | 190-224 (47-55.4%) | 168-198 (41.6-49%) | 133-157 (32.9-38.9%) |
| Amoonguss (specWall, Black Sludge) | 245-288 (56.7-66.7%) | 158-186 (36.6-43.1%) | 280-330 (64.8-76.4%) | 55-65 (12.7-15%) |
| Goodra-Hisui (specWall, Leftovers) | 160-188 (44-51.6%) | 51-61 (14-16.8%) | 91-107 (25-29.4%) | 36-42 (9.9-11.5%) |
| Rotom-Wash (physWall, Leftovers) | 278-327 (91.4-107.6%) | 179-211 (58.9-69.4%) | 79-93 (26-30.6%) | 126-148 (41.4-48.7%) |
| Swampert (physWall, Leftovers) | 321-378 (79.5-93.6%) | 207-244 (51.2-60.4%) | 92-108 (22.8-26.7%) | 0-0 (0-0%) |
| Tyranitar (specWall, Leftovers) | 212-250 (52.5-61.9%) | 68-81 (16.8-20%) | 60-71 (14.9-17.6%) | 96-113 (23.8-28%) |
| Scizor (physWall, Leftovers) | 177-208 (51.5-60.5%) | 114-134 (33.1-39%) | 811-954 (235.8-277.3%) | 160-189 (46.5-54.9%) |
| Buzzwole (physWall, Leftovers) | 488-574 (116.7-137.3%) | 314-370 (75.1-88.5%) | 558-657 (133.5-157.2%) | 221-260 (52.9-62.2%) |

---

### Meganium-Mega

**Meganium-Mega** — forme, **UU**, tier source: override
  Grass/Fairy | BST 625 (80/92/115/143/115/80)
  Abilities: Mega Sol (fixed by the forme)
  Engine stats @252 (neutral/positive): Mega Sol: Atk 283/311, SpA 385/423, Spe 259/284
  Held item: **Meganiumite** (forced; **not removable** — `canRemoveItem` refuses it, so no Choice item, Life Orb, Boots or Ring Target)
  Base species: Meganium (ZU), pre-Mega abilities: Overgrow / Leaf Guard
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fighting Body Press 80P, Psychic Zen Headbutt 80P
  Special coverage: Normal Wring Out 120S, Fire Weather Ball 100S, Rock Ancient Power 60S, Ground Mud-Slap 20S
  Setup: Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/unreliable: Giga Drain
  Priority: Grassy Glide 70P Grass (+1)
  Phazing: Dragon Tail
  Status: Grass Whistle, Poison Powder, Toxic
  Cleric/support: Aromatherapy
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Detect, Encore, Knock Off, Leech Seed, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute
  Notable: Knock Off, Encore, Substitute

Attacker: **Meganium-Mega**, modest {"spa":252,"spe":252,"hp":4}, Meganiumite (forced) — a representative test set, not a "standard" one.

| Defender (representative test set) | Energy Ball | Giga Drain |
| --- | --- | --- |
| Aegislash (physWall, no item) | 61-72 (18.8-22.2%) | 51-60 (15.7-18.5%) |
| Slowbro-Mega (physWall, no item) | 421-495 (106.9-125.6%) | 351-413 (89.1-104.8%) |
| Slowbro (physWall, Leftovers) | 421-495 (106.9-125.6%) | 351-413 (89.1-104.8%) |
| Slowking (specWall, Leftovers) | 238-280 (60.4-71.1%) | 199-234 (50.5-59.4%) |
| Blissey (specWall, Leftovers) | 103-121 (14.4-16.9%) | 86-101 (12-14.1%) |
| Chansey (specWall, Eviolite) | 82-97 (11.6-13.8%) | 69-81 (9.8-11.5%) |
| Clefable (specWall, Leftovers) | 135-159 (34.3-40.4%) | 113-133 (28.7-33.8%) |
| Tapu Fini (specWall, Leftovers) | 212-249 (61.6-72.4%) | 177-208 (51.5-60.5%) |
| Skarmory (physWall, Leftovers) | 58-68 (17.4-20.4%) | 48-57 (14.4-17.1%) |
| Skarmory-Mega (physWall, no item) | 43-51 (12.9-15.3%) | 36-43 (10.8-12.9%) |
| Celesteela (physWall, Leftovers) | 43-51 (10.8-12.8%) | 36-42 (9-10.6%) |
| Hippowdon (physWall, Leftovers) | 458-538 (109-128.1%) | 382-450 (91-107.1%) |
| Mew (physWall, Leftovers) | 175-206 (43.3-51%) | 146-172 (36.1-42.6%) |
| Amoonguss (specWall, Black Sludge) | 36-42 (8.3-9.7%) | 30-35 (6.9-8.1%) |
| Goodra-Hisui (specWall, Leftovers) | 23-28 (6.3-7.7%) | 20-23 (5.5-6.3%) |
| Rotom-Wash (physWall, Leftovers) | 331-389 (108.9-128%) | 276-325 (90.8-106.9%) |
| Swampert (physWall, Leftovers) | 765-900 (189.4-222.8%) | 639-752 (158.2-186.1%) |
| Tyranitar (specWall, Leftovers) | 253-298 (62.6-73.8%) | 212-249 (52.5-61.6%) |
| Scizor (physWall, Leftovers) | 52-61 (15.1-17.7%) | 43-51 (12.5-14.8%) |
| Buzzwole (physWall, Leftovers) | 144-170 (34.4-40.7%) | 120-142 (28.7-34%) |

---

## H. Serious UU → RU candidate evidence

The recently-arrived entries plus the long-standing ones whose role the expanded
RU Mega roster may now cover. **Being recently dropped from OU is not evidence
that they overshot** — it is only the reason they are worth re-checking.

### Slowbro

**Slowbro** — Water/Psychic, BST 490 (95/75/110/100/80/30), Oblivious / Own Tempo / Regenerator
Roles: recovery, pivot, setup | STAB: Water Hydro Pump 120S · Psychic Future Sight 120S | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Barraskewda | Water | 490 (61/123/60/60/50/136) | Swift Swim, Propeller Tail | recovery, pivot, setup, priority | Water Liquidation 85P |
| Blastoise | Water | 530 (79/83/100/85/105/78) | Torrent, Rain Dish | removal, recovery, pivot, setup, priority, phazing, cleric | Water Water Spout 150S |
| Cloyster | Water/Ice | 525 (50/95/180/85/45/70) | Shell Armor, Skill Link, Overcoat | hazards, removal, recovery, pivot, setup, priority, cleric | Water Hydro Pump 120S · Ice Blizzard 120S |
| Darmanitan-Zen | Fire/Psychic | 540 (105/30/105/140/105/55) | Zen Mode | recovery, pivot, setup, phazing | Fire Flare Blitz 120P · Psychic Zen Headbutt 80P |

---

### Slowking

**Slowking** — Water/Psychic, BST 490 (95/75/80/100/110/30), Oblivious / Own Tempo / Regenerator
Roles: recovery, pivot, setup, phazing | STAB: Water Hydro Pump 120S · Psychic Future Sight 120S | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Blastoise | Water | 530 (79/83/100/85/105/78) | Torrent, Rain Dish | removal, recovery, pivot, setup, priority, phazing, cleric | Water Water Spout 150S |
| Darmanitan-Zen | Fire/Psychic | 540 (105/30/105/140/105/55) | Zen Mode | recovery, pivot, setup, phazing | Fire Flare Blitz 120P · Psychic Zen Headbutt 80P |
| Empoleon | Water/Steel | 530 (84/86/88/111/101/60) | Torrent, Competitive, Defiant | hazards, removal, recovery, pivot, setup, priority, phazing | Water Hydro Pump 120S · Steel Steel Beam 140S |
| Feraligatr | Water | 530 (85/105/100/79/83/78) | Torrent, Sheer Force | recovery, pivot, setup, priority, phazing | Water Hydro Pump 120S |

---

### Corviknight

**Corviknight** — Flying/Steel, BST 495 (98/87/105/53/85/67), Pressure / Unnerve / Mirror Armor
Roles: removal, recovery, pivot, setup | STAB: Flying Sky Attack 140 (charge)P · Steel Steel Beam 140S | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Crobat | Poison/Flying | 535 (85/90/80/70/80/130) | Inner Focus, Infiltrator | removal, recovery, pivot, setup, priority, phazing | Poison Sludge Bomb 90S · Flying Sky Attack 140 (charge)P |
| Empoleon | Water/Steel | 530 (84/86/88/111/101/60) | Torrent, Competitive, Defiant | hazards, removal, recovery, pivot, setup, priority, phazing | Water Hydro Pump 120S · Steel Steel Beam 140S |
| Forretress | Bug/Steel | 465 (75/90/140/60/60/40) | Sturdy, Overcoat | hazards, removal, recovery, pivot, setup | Bug Bug Buzz 90S · Steel Steel Beam 140S |
| Mandibuzz | Dark/Flying | 510 (110/65/105/55/95/80) | Big Pecks, Overcoat, Weak Armor | removal, recovery, pivot, setup, phazing | Dark Foul Play 95P · Flying Sky Attack 140 (charge)P |

---

### Skarmory

**Skarmory** — Steel/Flying, BST 465 (65/80/140/40/70/70), Keen Eye / Sturdy / Weak Armor
Roles: hazards, removal, recovery, setup, priority, phazing | STAB: Steel Iron Head 80P · Flying Sky Attack 140 (charge)P | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Empoleon | Water/Steel | 530 (84/86/88/111/101/60) | Torrent, Competitive, Defiant | hazards, removal, recovery, pivot, setup, priority, phazing | Water Hydro Pump 120S · Steel Steel Beam 140S |
| Swellow | Normal/Flying | 455 (60/85/60/75/50/125) | Guts, Scrappy | removal, recovery, pivot, setup, priority, phazing | Normal Boomburst 140S · Flying Sky Attack 140 (charge)P |
| Yanmega | Bug/Flying | 515 (86/76/86/116/56/95) | Speed Boost, Tinted Lens, Frisk | removal, recovery, pivot, setup, priority, phazing | Bug Bug Buzz 90S · Flying Dual Wingbeat 50x2P |
| Donphan | Ground | 500 (90/120/120/60/60/50) | Sturdy, Sand Veil | hazards, removal, recovery, setup, priority, phazing | Ground Earthquake 100P |

---

### Skarmory-Mega

**Skarmory-Mega** — Steel/Flying, BST 565 (65/140/110/40/100/110), Stalwart
Roles: hazards, removal, recovery, setup, priority, phazing | STAB: Steel Iron Head 80P · Flying Sky Attack 140 (charge)P | item **locked to Skarmorite**

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Empoleon | Water/Steel | 530 (84/86/88/111/101/60) | Torrent, Competitive, Defiant | hazards, removal, recovery, pivot, setup, priority, phazing | Water Hydro Pump 120S · Steel Steel Beam 140S |
| Cobalion | Steel/Fighting | 580 (91/90/129/90/72/108) | Justified | hazards, recovery, pivot, setup, priority, phazing | Steel Steel Beam 140S · Fighting Close Combat 120P |
| Crobat | Poison/Flying | 535 (85/90/80/70/80/130) | Inner Focus, Infiltrator | removal, recovery, pivot, setup, priority, phazing | Poison Sludge Bomb 90S · Flying Sky Attack 140 (charge)P |
| Pidgeot-Mega | Normal/Flying | 579 (83/80/80/135/80/121) | No Guard | removal, recovery, pivot, setup, priority, phazing | Normal Uproar 90S · Flying Hurricane 120S |

---

### Gyarados

**Gyarados** — Water/Flying, BST 540 (95/125/79/60/100/81), Intimidate / Moxie
Roles: recovery, setup, phazing | STAB: Water Aqua Tail 90P · Flying Bounce 85 (charge)P | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Blastoise | Water | 530 (79/83/100/85/105/78) | Torrent, Rain Dish | removal, recovery, pivot, setup, priority, phazing, cleric | Water Water Spout 150S |
| Crobat | Poison/Flying | 535 (85/90/80/70/80/130) | Inner Focus, Infiltrator | removal, recovery, pivot, setup, priority, phazing | Poison Sludge Bomb 90S · Flying Sky Attack 140 (charge)P |
| Empoleon | Water/Steel | 530 (84/86/88/111/101/60) | Torrent, Competitive, Defiant | hazards, removal, recovery, pivot, setup, priority, phazing | Water Hydro Pump 120S · Steel Steel Beam 140S |
| Feraligatr | Water | 530 (85/105/100/79/83/78) | Torrent, Sheer Force | recovery, pivot, setup, priority, phazing | Water Hydro Pump 120S |

---

### Hawlucha

**Hawlucha** — Fighting/Flying, BST 500 (78/92/75/74/63/118), Limber / Unburden / Mold Breaker
Roles: removal, recovery, pivot, setup, priority | STAB: Fighting Focus Punch 150P · Flying Sky Attack 140 (charge)P | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Crobat | Poison/Flying | 535 (85/90/80/70/80/130) | Inner Focus, Infiltrator | removal, recovery, pivot, setup, priority, phazing | Poison Sludge Bomb 90S · Flying Sky Attack 140 (charge)P |
| Sirfetch’d | Fighting | 507 (62/135/95/68/82/65) | Steadfast, Scrappy | removal, recovery, pivot, setup, priority, phazing, cleric | Fighting Close Combat 120P |
| Swellow | Normal/Flying | 455 (60/85/60/75/50/125) | Guts, Scrappy | removal, recovery, pivot, setup, priority, phazing | Normal Boomburst 140S · Flying Sky Attack 140 (charge)P |
| Talonflame | Fire/Flying | 499 (78/81/71/74/69/126) | Flame Body, Gale Wings | removal, recovery, pivot, setup, priority | Fire Overheat 140S · Flying Brave Bird 120P |

---

### Weavile

**Weavile** — Dark/Ice, BST 510 (70/120/65/45/85/125), Pressure / Pickpocket
Roles: recovery, pivot, setup, priority | STAB: Dark Foul Play 95P · Ice Icicle Crash 85P | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Absol-Mega | Dark | 565 (65/150/60/115/60/115) | Magic Bounce | recovery, pivot, setup, priority, cleric | Dark Foul Play 95P |
| Absol-Mega-Z | Dark/Ghost | 565 (65/154/60/75/60/151) | Sharpness | recovery, pivot, setup, priority, cleric | Dark Foul Play 95P · Ghost Shadow Claw 70P |
| Cloyster | Water/Ice | 525 (50/95/180/85/45/70) | Shell Armor, Skill Link, Overcoat | hazards, removal, recovery, pivot, setup, priority, cleric | Water Hydro Pump 120S · Ice Blizzard 120S |
| Obstagoon | Dark/Normal | 520 (93/90/101/60/81/95) | Reckless, Guts, Defiant | recovery, pivot, setup, priority, phazing | Dark Throat Chop 80P · Normal Last Resort 140P |

---

### Okidogi

**Okidogi** — Poison/Fighting, BST 555 (88/128/115/58/86/80), Toxic Chain / Guard Dog
Roles: recovery, setup, priority, phazing | STAB: Poison Gunk Shot 120P · Fighting Focus Punch 150P | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Chesnaught | Grass/Fighting | 530 (88/107/122/74/75/64) | Overgrow, Bulletproof | hazards, recovery, setup, priority, phazing | Grass Leaf Storm 140S · Fighting Focus Punch 150P |
| Cobalion | Steel/Fighting | 580 (91/90/129/90/72/108) | Justified | hazards, recovery, pivot, setup, priority, phazing | Steel Steel Beam 140S · Fighting Close Combat 120P |
| Crobat | Poison/Flying | 535 (85/90/80/70/80/130) | Inner Focus, Infiltrator | removal, recovery, pivot, setup, priority, phazing | Poison Sludge Bomb 90S · Flying Sky Attack 140 (charge)P |
| Infernape | Fire/Fighting | 534 (76/104/71/104/71/108) | Blaze, Iron Fist | hazards, recovery, pivot, setup, priority, phazing | Fire Overheat 140S · Fighting Focus Punch 150P |

---

### Iron Treads

**Iron Treads** — Ground/Steel, BST 570 (90/112/120/72/70/106), Quark Drive
Roles: hazards, removal, recovery, pivot, setup | STAB: Ground Earthquake 100P · Steel Steel Beam 140S | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Empoleon | Water/Steel | 530 (84/86/88/111/101/60) | Torrent, Competitive, Defiant | hazards, removal, recovery, pivot, setup, priority, phazing | Water Hydro Pump 120S · Steel Steel Beam 140S |
| Steelix-Mega | Steel/Ground | 610 (75/125/230/55/95/30) | Sand Force | hazards, recovery, setup, phazing | Steel Steel Roller 130P · Ground Earthquake 100P |
| Chimecho-Mega | Psychic/Steel | 555 (75/50/110/135/120/65) | Levitate | removal, recovery, pivot, setup, cleric | Psychic Future Sight 120S |
| Cobalion | Steel/Fighting | 580 (91/90/129/90/72/108) | Justified | hazards, recovery, pivot, setup, priority, phazing | Steel Steel Beam 140S · Fighting Close Combat 120P |

---

### Iron Crown

**Iron Crown** — Steel/Psychic, BST 590 (90/72/100/122/108/98), Quark Drive
Roles: recovery, pivot, setup | STAB: Steel Steel Beam 140S · Psychic Future Sight 120S | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Chimecho-Mega | Psychic/Steel | 555 (75/50/110/135/120/65) | Levitate | removal, recovery, pivot, setup, cleric | Psychic Future Sight 120S |
| Azelf | Psychic | 580 (75/125/70/125/70/115) | Levitate | hazards, recovery, pivot, setup | Psychic Future Sight 120S |
| Celebi | Psychic/Grass | 600 (100/100/100/100/100/100) | Natural Cure | hazards, recovery, pivot, setup, priority, cleric | Psychic Future Sight 120S · Grass Leaf Storm 140S |
| Cobalion | Steel/Fighting | 580 (91/90/129/90/72/108) | Justified | hazards, recovery, pivot, setup, priority, phazing | Steel Steel Beam 140S · Fighting Close Combat 120P |

---

### Moltres

**Moltres** — Fire/Flying, BST 580 (90/100/90/125/85/90), Pressure / Flame Body
Roles: removal, recovery, pivot, setup, phazing | STAB: Fire Overheat 140S · Flying Sky Attack 140 (charge)P | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Crobat | Poison/Flying | 535 (85/90/80/70/80/130) | Inner Focus, Infiltrator | removal, recovery, pivot, setup, priority, phazing | Poison Sludge Bomb 90S · Flying Sky Attack 140 (charge)P |
| Noivern | Flying/Dragon | 535 (85/70/80/97/80/123) | Frisk, Infiltrator, Telepathy | removal, recovery, pivot, setup, phazing | Flying Sky Attack 140 (charge)P · Dragon Draco Meteor 140S |
| Pidgeot-Mega | Normal/Flying | 579 (83/80/80/135/80/121) | No Guard | removal, recovery, pivot, setup, priority, phazing | Normal Uproar 90S · Flying Hurricane 120S |
| Talonflame | Fire/Flying | 499 (78/81/71/74/69/126) | Flame Body, Gale Wings | removal, recovery, pivot, setup, priority | Fire Overheat 140S · Flying Brave Bird 120P |

---

### Zapdos-Galar

**Zapdos-Galar** — Fighting/Flying, BST 580 (90/125/90/85/90/100), Defiant
Roles: removal, recovery, pivot, setup, phazing | STAB: Fighting Close Combat 120P · Flying Sky Attack 140 (charge)P | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Crobat | Poison/Flying | 535 (85/90/80/70/80/130) | Inner Focus, Infiltrator | removal, recovery, pivot, setup, priority, phazing | Poison Sludge Bomb 90S · Flying Sky Attack 140 (charge)P |
| Noivern | Flying/Dragon | 535 (85/70/80/97/80/123) | Frisk, Infiltrator, Telepathy | removal, recovery, pivot, setup, phazing | Flying Sky Attack 140 (charge)P · Dragon Draco Meteor 140S |
| Pidgeot-Mega | Normal/Flying | 579 (83/80/80/135/80/121) | No Guard | removal, recovery, pivot, setup, priority, phazing | Normal Uproar 90S · Flying Hurricane 120S |
| Cobalion | Steel/Fighting | 580 (91/90/129/90/72/108) | Justified | hazards, recovery, pivot, setup, priority, phazing | Steel Steel Beam 140S · Fighting Close Combat 120P |

---

### Hatterene

**Hatterene** — Psychic/Fairy, BST 510 (57/90/95/136/103/29), Healer / Anticipation / Magic Bounce
Roles: recovery, pivot, setup, cleric | STAB: Psychic Future Sight 120S · Fairy Misty Explosion 100S | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Gardevoir | Psychic/Fairy | 518 (68/65/65/125/115/80) | Synchronize, Trace, Telepathy | recovery, pivot, setup, priority, cleric | Psychic Future Sight 120S · Fairy Misty Explosion 100S |
| Chimecho-Mega | Psychic/Steel | 555 (75/50/110/135/120/65) | Levitate | removal, recovery, pivot, setup, cleric | Psychic Future Sight 120S |
| Comfey | Fairy | 485 (51/52/90/82/110/100) | Flower Veil, Triage, Natural Cure | removal, recovery, pivot, setup, priority, cleric | Fairy Play Rough 90P |
| Gallade | Psychic/Fighting | 518 (68/125/65/65/115/80) | Steadfast, Sharpness, Justified | recovery, pivot, setup, priority, cleric | Psychic Zen Headbutt 80P · Fighting Focus Punch 150P |

---

### Pecharunt

**Pecharunt** — Poison/Ghost, BST 600 (88/88/160/88/88/88), Poison Puppeteer
Roles: recovery, pivot, setup | STAB: Poison Gunk Shot 120P · Ghost Poltergeist 110P | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Absol-Mega-Z | Dark/Ghost | 565 (65/154/60/75/60/151) | Sharpness | recovery, pivot, setup, priority, cleric | Dark Foul Play 95P · Ghost Shadow Claw 70P |
| Fezandipiti | Poison/Fairy | 555 (88/91/82/70/125/99) | Toxic Chain, Technician | recovery, pivot, setup, priority | Poison Gunk Shot 120P · Fairy Moonblast 95S |
| Munkidori | Poison/Psychic | 555 (88/75/66/130/90/106) | Toxic Chain, Frisk | recovery, pivot, setup, priority | Poison Sludge Wave 95S · Psychic Future Sight 120S |
| Banette-Mega | Ghost | 555 (64/165/75/93/83/75) | Prankster | recovery, setup, priority | Ghost Poltergeist 110P |

---

### Scolipede-Mega

**Scolipede-Mega** — Bug/Poison, BST 585 (60/140/149/75/99/62), Shell Armor
Roles: hazards, recovery, pivot, setup | STAB: Bug Megahorn 120P · Poison Poison Jab 80P | item **locked to Scolipite**

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Beedrill-Mega | Bug/Poison | 495 (65/150/40/15/80/145) | Adaptability | hazards, removal, recovery, pivot, setup | Bug Twineedle 50x2P · Poison Poison Jab 80P |
| Crobat | Poison/Flying | 535 (85/90/80/70/80/130) | Inner Focus, Infiltrator | removal, recovery, pivot, setup, priority, phazing | Poison Sludge Bomb 90S · Flying Sky Attack 140 (charge)P |
| Fezandipiti | Poison/Fairy | 555 (88/91/82/70/125/99) | Toxic Chain, Technician | recovery, pivot, setup, priority | Poison Gunk Shot 120P · Fairy Moonblast 95S |
| Forretress | Bug/Steel | 465 (75/90/140/60/60/40) | Sturdy, Overcoat | hazards, removal, recovery, pivot, setup | Bug Bug Buzz 90S · Steel Steel Beam 140S |

---

### Amoonguss

**Amoonguss** — Grass/Poison, BST 464 (114/85/70/85/80/30), Effect Spore / Regenerator
Roles: recovery, setup | STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Roserade | Grass/Poison | 515 (60/70/65/125/105/90) | Natural Cure, Poison Point, Technician | hazards, recovery, setup, priority, cleric | Grass Leaf Storm 140S · Poison Sludge Bomb 90S |
| Victreebel-Mega | Grass/Poison | 590 (80/125/85/135/95/70) | Innards Out | recovery, setup, priority | Grass Leaf Storm 140S · Poison Belch 120S |
| Beedrill-Mega | Bug/Poison | 495 (65/150/40/15/80/145) | Adaptability | hazards, removal, recovery, pivot, setup | Bug Twineedle 50x2P · Poison Poison Jab 80P |
| Breloom | Grass/Fighting | 460 (60/130/80/60/60/70) | Effect Spore, Poison Heal, Technician | recovery, setup, priority | Grass Seed Bomb 80P · Fighting Focus Punch 150P |

---

### Blissey

**Blissey** — Normal, BST 540 (255/10/10/75/135/55), Natural Cure / Serene Grace / Healer
Roles: hazards, recovery, pivot, setup, cleric | STAB: Normal Hyper Voice 90S | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Cloyster | Water/Ice | 525 (50/95/180/85/45/70) | Shell Armor, Skill Link, Overcoat | hazards, removal, recovery, pivot, setup, priority, cleric | Water Hydro Pump 120S · Ice Blizzard 120S |
| Cyclizar | Dragon/Normal | 501 (70/95/65/85/65/121) | Shed Skin, Regenerator | removal, recovery, pivot, setup, priority, phazing | Dragon Draco Meteor 140S · Normal Double-Edge 120P |
| Diggersby | Normal/Ground | 423 (85/56/77/50/77/78) | Pickup, Cheek Pouch, Huge Power | hazards, recovery, pivot, setup, priority | Normal Last Resort 140P · Ground Earthquake 100P |
| Meloetta-Pirouette | Normal/Fighting | 600 (100/128/90/77/77/128) | Serene Grace | recovery, pivot, setup, priority, cleric | Normal Last Resort 140P · Fighting Focus Punch 150P |

---

### Chansey

**Chansey** — Normal, BST 450 (250/5/5/35/105/50), Natural Cure / Serene Grace / Healer
Roles: hazards, recovery, pivot, setup, cleric | STAB: Normal Hyper Voice 90S | item free

Closest RU entries by shared role, typing and BST band:

| RU entry | Types | BST (spread) | Abilities | Roles | STAB |
| --- | --- | --- | --- | --- | --- |
| Diggersby | Normal/Ground | 423 (85/56/77/50/77/78) | Pickup, Cheek Pouch, Huge Power | hazards, recovery, pivot, setup, priority | Normal Last Resort 140P · Ground Earthquake 100P |
| Ribombee | Bug/Fairy | 464 (60/55/60/95/70/124) | Honey Gather, Shield Dust, Sweet Veil | hazards, removal, recovery, pivot, setup, cleric | Bug Bug Buzz 90S · Fairy Moonblast 95S |
| Cyclizar | Dragon/Normal | 501 (70/95/65/85/65/121) | Shed Skin, Regenerator | removal, recovery, pivot, setup, priority, phazing | Dragon Draco Meteor 140S · Normal Double-Edge 120P |
| Maushold | Normal | 470 (74/75/70/65/75/111) | Friend Guard, Cheek Pouch, Technician | removal, recovery, pivot, setup, priority | Normal Population Bomb 20x10P |

---

## I. Offensive matchup matrices

Every matrix in section G is the candidate against the same twenty-Pokémon
defensive core, so candidates can be compared column by column.

**Classification is yours to make.** The engine gives damage; whether a defender
is a hard counter, a reliable counter, a soft counter, a check, revenge-only or
not an answer depends on recovery, speed and hazard chip, which are all in
sections C, L, M and P.

---

## J. Defensive / revenge-kill matrices

UU counterplay into each upward candidate. Attackers are representative test
sets; the candidate is on its own offensive spread from section G, so these are
"can UU revenge it once it is in".

| Target | Bisharp Sucker Punch | Scizor Bullet Punch | Conkeldurr Mach Punch | Terrakion Close Combat | Weavile Ice Shard | Zeraora Plasma Fists | Aerodactyl-Mega Stone Edge | Azumarill Aqua Jet | Excadrill Earthquake | Keldeo Secret Sword |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Starmie-Mega | 352-414 (134.4-158%) | 52-62 (19.8-23.7%) | 55-65 (21-24.8%) | 94-111 (35.9-42.4%) | 39-46 (14.9-17.6%) | 371-436 (141.6-166.4%) | 163-192 (62.2-73.3%) | 29-34 (11.1-13%) | 163-192 (62.2-73.3%) | 67-79 (25.6-30.2%) |
| Porygon-Z | 245-288 (78.5-92.3%) | 146-172 (46.8-55.1%) | 308-363 (98.7-116.3%) | 526-619 (168.6-198.4%) | 110-130 (35.3-41.7%) | 258-304 (82.7-97.4%) | 227-267 (72.8-85.6%) | 82-96 (26.3-30.8%) | 227-267 (72.8-85.6%) | 374-440 (119.9-141%) |
| Delphox-Mega | 479-564 (164-193.2%) | 71-84 (24.3-28.8%) | 75-88 (25.7-30.1%) | 128-151 (43.8-51.7%) | 53-62 (18.2-21.2%) | 252-297 (86.3-101.7%) | 444-522 (152.1-178.8%) | 160-189 (54.8-64.7%) | 444-522 (152.1-178.8%) | 91-107 (31.2-36.6%) |
| Staraptor-Mega | 91-107 (29.2-34.3%) | 109-129 (34.9-41.3%) | 57-68 (18.3-21.8%) | 98-115 (31.4-36.9%) | 166-195 (53.2-62.5%) | 387-455 (124-145.8%) | 170-200 (54.5-64.1%) | 61-72 (19.6-23.1%) | 0-0 (0-0%) | 70-82 (22.4-26.3%) |
| Gardevoir-Mega | 260-305 (93.5-109.7%) | 310-364 (111.5-130.9%) | 40-48 (14.4-17.3%) | 69-82 (24.8-29.5%) | 117-136 (42.1-48.9%) | 273-322 (98.2-115.8%) | 240-283 (86.3-101.8%) | 86-102 (30.9-36.7%) | 240-283 (86.3-101.8%) | 49-58 (17.6-20.9%) |
| Latias-Mega | 314-370 (104-122.5%) | 94-110 (31.1-36.4%) | 49-58 (16.2-19.2%) | 84-99 (27.8-32.8%) | 143-167 (47.4-55.3%) | 81-97 (26.8-32.1%) | 145-171 (48-56.6%) | 26-31 (8.6-10.3%) | 145-171 (48-56.6%) | 60-70 (19.9-23.2%) |
| Aegislash-Blade | 633-744 (241.6-284%) | 94-111 (35.9-42.4%) | 0-0 (0-0%) | 0-0 (0-0%) | 70-83 (26.7-31.7%) | 332-392 (126.7-149.6%) | 146-172 (55.7-65.6%) | 105-124 (40.1-47.3%) | 586-689 (223.7-263%) | 0-0 (0-0%) |
| Aerodactyl-Mega | 209-247 (69.2-81.8%) | 250-295 (82.8-97.7%) | 132-155 (43.7-51.3%) | 225-265 (74.5-87.7%) | 189-222 (62.6-73.5%) | 442-521 (146.4-172.5%) | 388-457 (128.5-151.3%) | 141-166 (46.7-55%) | 0-0 (0-0%) | 160-188 (53-62.3%) |
| Chandelure-Mega | 339-399 (129.4-152.3%) | 50-59 (19.1-22.5%) | 0-0 (0-0%) | 0-0 (0-0%) | 37-44 (14.1-16.8%) | 178-209 (67.9-79.8%) | 313-369 (119.5-140.8%) | 114-134 (43.5-51.1%) | 313-369 (119.5-140.8%) | 0-0 (0-0%) |
| Emboar-Mega | 115-136 (31.8-37.6%) | 69-81 (19.1-22.4%) | 146-172 (40.3-47.5%) | 249-293 (68.8-80.9%) | 52-61 (14.4-16.9%) | 244-287 (67.4-79.3%) | 215-252 (59.4-69.6%) | 155-183 (42.8-50.6%) | 430-505 (118.8-139.5%) | 177-208 (48.9-57.5%) |
| Scrafty-Mega | 35-41 (12.9-15.1%) | 85-100 (31.3-36.8%) | 179-211 (65.8-77.6%) | 304-358 (111.8-131.6%) | 65-75 (23.9-27.6%) | 149-176 (54.8-64.7%) | 65-77 (23.9-28.3%) | 48-56 (17.6-20.6%) | 131-154 (48.2-56.6%) | 217-255 (79.8-93.8%) |
| Serperior | 191-224 (65.4-76.7%) | 114-134 (39-45.9%) | 120-142 (41.1-48.6%) | 205-241 (70.2-82.5%) | 172-204 (58.9-69.9%) | 100-118 (34.2-40.4%) | 177-208 (60.6-71.2%) | 32-37 (11-12.7%) | 88-104 (30.1-35.6%) | 146-172 (50-58.9%) |
| Blacephalon | 607-713 (244.8-287.5%) | 90-106 (36.3-42.7%) | 0-0 (0-0%) | 0-0 (0-0%) | 67-79 (27-31.9%) | 319-375 (128.6-151.2%) | 561-660 (226.2-266.1%) | 202-238 (81.5-96%) | 561-660 (226.2-266.1%) | 0-0 (0-0%) |
| Sharpedo-Mega | 122-144 (43.3-51.1%) | 73-86 (25.9-30.5%) | 308-363 (109.2-128.7%) | 526-619 (186.5-219.5%) | 54-65 (19.1-23%) | 517-608 (183.3-215.6%) | 227-267 (80.5-94.7%) | 41-48 (14.5-17%) | 227-267 (80.5-94.7%) | 374-440 (132.6-156%) |
| Dragalge-Mega | 175-206 (64.3-75.7%) | 105-124 (38.6-45.6%) | 55-65 (20.2-23.9%) | 94-111 (34.6-40.8%) | 159-187 (58.5-68.8%) | 92-109 (33.8-40.1%) | 163-192 (59.9-70.6%) | 29-34 (10.7-12.5%) | 326-384 (119.9-141.2%) | 67-79 (24.6-29%) |
| Drampa-Mega | 169-198 (56.7-66.4%) | 101-119 (33.9-39.9%) | 213-251 (71.5-84.2%) | 363-427 (121.8-143.3%) | 153-180 (51.3-60.4%) | 88-104 (29.5-34.9%) | 156-184 (52.3-61.7%) | 28-33 (9.4-11.1%) | 156-184 (52.3-61.7%) | 259-304 (86.9-102%) |
| Meganium-Mega | 80-96 (26.5-31.8%) | 195-229 (64.6-75.8%) | 51-60 (16.9-19.9%) | 87-102 (28.8-33.8%) | 148-174 (49-57.6%) | 85-101 (28.1-33.4%) | 151-177 (50-58.6%) | 27-32 (8.9-10.6%) | 75-88 (24.8-29.1%) | 62-73 (20.5-24.2%) |

---

## K. Role-comparison matrices

Section H is the role comparison, one candidate at a time. The RU competitors
are selected by shared role keys, shared typing and BST proximity — a mechanical
shortlist, not a judgement. Their full profiles are in section D.

---

## L. Speed-tier table

Every UU entry at base Speed 85+. Priority is **not** speed and is in section M.

| Pokémon | Base | Max neutral | Max +Spe | +1 | +2 | Choice Scarf (from max +Spe) |
| --- | --- | --- | --- | --- | --- | --- |
| Aerodactyl-Mega | 150 | 399 | 438 | 657 | 876 | 657 |
| Alakazam | 120 | 339 | 372 | 558 | 744 | 558 |
| Archaludon | 85 | 269 | 295 | 442 | 590 | 442 |
| Blacephalon | 107 | 313 | 344 | 516 | 688 | 516 |
| Chandelure-Mega | 90 | 279 | 306 | 459 | 612 | 459 |
| Delphox-Mega | 134 | 367 | 403 | 604 | 806 | 604 |
| Enamorus | 106 | 311 | 342 | 513 | 684 | 513 |
| Excadrill | 88 | 275 | 302 | 453 | 604 | 453 |
| Gardevoir-Mega | 100 | 299 | 328 | 492 | 656 | 492 |
| Gengar | 110 | 319 | 350 | 525 | 700 | 525 |
| Glimmora | 86 | 271 | 298 | 447 | 596 | 447 |
| Hawlucha | 118 | 335 | 368 | 552 | 736 | 552 |
| Haxorus | 97 | 293 | 322 | 483 | 644 | 483 |
| Hydreigon | 98 | 295 | 324 | 486 | 648 | 486 |
| Iron Boulder | 124 | 347 | 381 | 571 | 762 | 571 |
| Iron Crown | 98 | 295 | 324 | 486 | 648 | 486 |
| Iron Leaves | 104 | 307 | 337 | 505 | 674 | 505 |
| Iron Treads | 106 | 311 | 342 | 513 | 684 | 513 |
| Jirachi | 100 | 299 | 328 | 492 | 656 | 492 |
| Keldeo | 108 | 315 | 346 | 519 | 692 | 519 |
| Latias-Mega | 110 | 319 | 350 | 525 | 700 | 525 |
| Lilligant-Hisui | 105 | 309 | 339 | 508 | 678 | 508 |
| Mew | 100 | 299 | 328 | 492 | 656 | 492 |
| Mienshao | 105 | 309 | 339 | 508 | 678 | 508 |
| Moltres | 90 | 279 | 306 | 459 | 612 | 459 |
| Moltres-Galar | 90 | 279 | 306 | 459 | 612 | 459 |
| Pecharunt | 88 | 275 | 302 | 453 | 604 | 453 |
| Porygon-Z | 90 | 279 | 306 | 459 | 612 | 459 |
| Pyroar-Mega | 126 | 351 | 386 | 579 | 772 | 579 |
| Quaquaval | 85 | 269 | 295 | 442 | 590 | 442 |
| Raichu-Mega-Y | 130 | 359 | 394 | 591 | 788 | 591 |
| Regieleki | 200 | 499 | 548 | 822 | 1096 | 822 |
| Rotom-Wash | 86 | 271 | 298 | 447 | 596 | 447 |
| Salamence | 100 | 299 | 328 | 492 | 656 | 492 |
| Scolipede | 112 | 323 | 355 | 532 | 710 | 532 |
| Serperior | 113 | 325 | 357 | 535 | 714 | 535 |
| Sharpedo-Mega | 105 | 309 | 339 | 508 | 678 | 508 |
| Skarmory-Mega | 110 | 319 | 350 | 525 | 700 | 525 |
| Staraptor-Mega | 110 | 319 | 350 | 525 | 700 | 525 |
| Starmie-Mega | 120 | 339 | 372 | 558 | 744 | 558 |
| Tapu Fini | 85 | 269 | 295 | 442 | 590 | 442 |
| Terrakion | 108 | 315 | 346 | 519 | 692 | 519 |
| Thundurus | 111 | 321 | 353 | 529 | 706 | 529 |
| Thundurus-Therian | 101 | 301 | 331 | 496 | 662 | 496 |
| Victini | 100 | 299 | 328 | 492 | 656 | 492 |
| Weavile | 125 | 349 | 383 | 574 | 766 | 574 |
| Zapdos-Galar | 100 | 299 | 328 | 492 | 656 | 492 |
| Zeraora | 143 | 385 | 423 | 634 | 846 | 634 |
| Zoroark-Hisui | 110 | 319 | 350 | 525 | 700 | 525 |

---

## M. Priority table

Engine priority, including Grassy Glide's +1 which the packaged data does not show.

| Pokémon | Priority moves (BP, type, bracket — engine values) | Max offence |
| --- | --- | --- |
| Aegislash | Shadow Sneak 40P Ghost (+1) | Atk 218 / SpA 218 |
| Aegislash-Blade | Shadow Sneak 40P Ghost (+1) | Atk 438 / SpA 438 |
| Azumarill | Aqua Jet 40P Water (+1) | Atk 218 / SpA 240 |
| Bisharp | Sucker Punch 80P Dark (+1) | Atk 383 / SpA 240 |
| Conkeldurr | Upper Hand 65P Fighting (+3); Mach Punch 40P Fighting (+1) | Atk 416 / SpA 229 |
| Emboar-Mega | Sucker Punch 80P Dark (+1) | Atk 434 / SpA 350 |
| Gardevoir-Mega | Shadow Sneak 40P Ghost (+1); Vacuum Wave 40S Fighting (+1) | Atk 295 / SpA 471 |
| Gengar | Sucker Punch 80P Dark (+1) | Atk 251 / SpA 394 |
| Goodra-Hisui | Feint 50P Normal (+2) | Atk 328 / SpA 350 |
| Hawlucha | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2) | Atk 311 / SpA 271 |
| Haxorus | First Impression 90P Bug (+2) | Atk 432 / SpA 240 |
| Heracross-Mega | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Vacuum Wave 40S Fighting (+1) | Atk 515 / SpA 196 |
| Hydrapple | Sucker Punch 80P Dark (+1); Grassy Glide 70P Grass (+1) | Atk 284 / SpA 372 |
| Iron Boulder | Quick Attack 40P Normal (+1) | Atk 372 / SpA 258 |
| Iron Leaves | Quick Attack 40P Normal (+1) | Atk 394 / SpA 262 |
| Keldeo | Upper Hand 65P Fighting (+3); Aqua Jet 40P Water (+1); Vacuum Wave 40S Fighting (+1) | Atk 267 / SpA 392 |
| Latias-Mega | Sucker Punch 80P Dark (+1) | Atk 328 / SpA 416 |
| Lilligant-Hisui | Grassy Glide 70P Grass (+1); Upper Hand 65P Fighting (+3); Vacuum Wave 40S Fighting (+1) | Atk 339 / SpA 218 |
| Mamoswine | Ice Shard 40P Ice (+1) | Atk 394 / SpA 262 |
| Meganium-Mega | Grassy Glide 70P Grass (+1) | Atk 311 / SpA 423 |
| Metagross | Bullet Punch 40P Steel (+1) | Atk 405 / SpA 317 |
| Mew | Sucker Punch 80P Dark (+1); Grassy Glide 70P Grass (+1); Upper Hand 65P Fighting (+3); Fake Out 40P Normal (+3) | Atk 328 / SpA 328 |
| Mienshao | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Fake Out 40P Normal (+3); Vacuum Wave 40S Fighting (+1) | Atk 383 / SpA 317 |
| Moltres-Galar | Sucker Punch 80P Dark (+1) | Atk 295 / SpA 328 |
| Okidogi | Upper Hand 65P Fighting (+3) | Atk 390 / SpA 236 |
| Polteageist | Sucker Punch 80P Dark (+1) | Atk 251 / SpA 403 |
| Primarina | Aqua Jet 40P Water (+1) | Atk 271 / SpA 386 |
| Quaquaval | Upper Hand 65P Fighting (+3); Aqua Jet 40P Water (+1) | Atk 372 / SpA 295 |
| Raichu-Mega-Y | Extreme Speed 80P Normal (+2); Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Fake Out 40P Normal (+3) | Atk 328 / SpA 460 |
| Regieleki | Extreme Speed 80P Normal (+2) | Atk 328 / SpA 328 |
| Rotom-Wash | Sucker Punch 80P Dark (+1) | Atk 251 / SpA 339 |
| Sableye-Mega | Sucker Punch 80P Dark (+1); Feint 50P Normal (+2); Fake Out 40P Normal (+3); Shadow Sneak 40P Ghost (+1) | Atk 295 / SpA 295 |
| Scizor | Feint 50P Normal (+2); Bullet Punch 40P Steel (+1); Quick Attack 40P Normal (+1); Vacuum Wave 40S Fighting (+1) | Atk 394 / SpA 229 |
| Scrafty-Mega | Upper Hand 65P Fighting (+3); Fake Out 40P Normal (+3) | Atk 394 / SpA 229 |
| Serperior | Grassy Glide 70P Grass (+1) | Atk 273 / SpA 273 |
| Sharpedo-Mega | Feint 50P Normal (+2); Aqua Jet 40P Water (+1) | Atk 416 / SpA 350 |
| Skarmory | Feint 50P Normal (+2) | Atk 284 / SpA 196 |
| Skarmory-Mega | Feint 50P Normal (+2) | Atk 416 / SpA 196 |
| Staraptor-Mega | Quick Attack 40P Normal (+1) | Atk 416 / SpA 240 |
| Terrakion | Upper Hand 65P Fighting (+3); Quick Attack 40P Normal (+1) | Atk 392 / SpA 267 |
| Venusaur-Mega | Grassy Glide 70P Grass (+1) | Atk 328 / SpA 377 |
| Victini | Quick Attack 40P Normal (+1) | Atk 328 / SpA 328 |
| Weavile | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Fake Out 40P Normal (+3); Ice Shard 40P Ice (+1) | Atk 372 / SpA 207 |
| Zeraora | Fake Out 40P Normal (+3); Quick Attack 40P Normal (+1) | Atk 355 / SpA 333 |
| Zoroark-Hisui | Sucker Punch 80P Dark (+1); Shadow Sneak 40P Ghost (+1) | Atk 328 / SpA 383 |

---

## N. Item-freedom table

| Candidate | Item freedom | Consequence |
| --- | --- | --- |
| Starmie-Mega | **No** — Starminite is forced and cannot be removed | Band/Specs/Scarf/Life Orb/Boots/Ring Target/Leftovers all unavailable |
| Porygon-Z | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Ring Target, Leftovers, Assault Vest, Orbs all available |
| Delphox-Mega | **No** — Delphoxite is forced and cannot be removed | Band/Specs/Scarf/Life Orb/Boots/Ring Target/Leftovers all unavailable |
| Staraptor-Mega | **No** — Staraptite is forced and cannot be removed | Band/Specs/Scarf/Life Orb/Boots/Ring Target/Leftovers all unavailable |
| Gardevoir-Mega | **No** — Gardevoirite is forced and cannot be removed | Band/Specs/Scarf/Life Orb/Boots/Ring Target/Leftovers all unavailable |
| Latias-Mega | **No** — Latiasite is forced and cannot be removed | Band/Specs/Scarf/Life Orb/Boots/Ring Target/Leftovers all unavailable |
| Aegislash-Blade | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Ring Target, Leftovers, Assault Vest, Orbs all available |
| Aerodactyl-Mega | **No** — Aerodactylite is forced and cannot be removed | Band/Specs/Scarf/Life Orb/Boots/Ring Target/Leftovers all unavailable |
| Chandelure-Mega | **No** — Chandelurite is forced and cannot be removed | Band/Specs/Scarf/Life Orb/Boots/Ring Target/Leftovers all unavailable |
| Emboar-Mega | **No** — Emboarite is forced and cannot be removed | Band/Specs/Scarf/Life Orb/Boots/Ring Target/Leftovers all unavailable |
| Scrafty-Mega | **No** — Scraftinite is forced and cannot be removed | Band/Specs/Scarf/Life Orb/Boots/Ring Target/Leftovers all unavailable |
| Serperior | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Ring Target, Leftovers, Assault Vest, Orbs all available |
| Blacephalon | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Ring Target, Leftovers, Assault Vest, Orbs all available |
| Sharpedo-Mega | **No** — Sharpedonite is forced and cannot be removed | Band/Specs/Scarf/Life Orb/Boots/Ring Target/Leftovers all unavailable |
| Dragalge-Mega | **No** — Dragalgite is forced and cannot be removed | Band/Specs/Scarf/Life Orb/Boots/Ring Target/Leftovers all unavailable |
| Drampa-Mega | **No** — Drampanite is forced and cannot be removed | Band/Specs/Scarf/Life Orb/Boots/Ring Target/Leftovers all unavailable |
| Meganium-Mega | **No** — Meganiumite is forced and cannot be removed | Band/Specs/Scarf/Life Orb/Boots/Ring Target/Leftovers all unavailable |

---

## O. Mega opportunity-cost table

UU has **23** Mega formes and a team may use **one**. A Mega is only tier-breaking if it is worth choosing over all of these.

| Mega | Types | BST (spread) | Ability | Tier source | STAB |
| --- | --- | --- | --- | --- | --- |
| Aerodactyl-Mega | Rock/Flying | 615 (80/135/85/70/95/150) | Tough Claws | imported | Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P |
| Altaria-Mega | Dragon/Fairy | 590 (75/110/110/110/105/80) | Pixilate | imported | Dragon Draco Meteor 140S · Fairy Double-Edge 156P |
| Chandelure-Mega | Ghost/Fire | 620 (60/75/110/175/110/90) | Infiltrator | imported | Ghost Shadow Ball 80S · Fire Overheat 140S |
| Delphox-Mega | Fire/Psychic | 634 (75/69/72/159/125/134) | Levitate | imported | Fire Overheat 140S · Psychic Future Sight 120S |
| Dragalge-Mega | Poison/Dragon | 594 (65/85/105/132/163/44) | Regenerator | imported | Poison Sludge Wave 95S · Dragon Draco Meteor 140S |
| Drampa-Mega | Normal/Dragon | 585 (78/85/110/160/116/36) | Berserk | imported | Normal Hyper Voice 90S · Dragon Draco Meteor 140S |
| Emboar-Mega | Fire/Fighting | 628 (110/148/75/110/110/75) | Mold Breaker | imported | Fire Overheat 140S · Fighting Focus Punch 150P |
| Gardevoir-Mega | Psychic/Fairy | 618 (68/85/65/165/135/100) | Pixilate | imported | Psychic Future Sight 120S · Fairy Hyper Voice 117S |
| Heracross-Mega | Bug/Fighting | 600 (80/185/115/40/105/75) | Skill Link | imported | Bug Megahorn 120P · Fighting Focus Punch 150P |
| Latias-Mega | Dragon/Psychic | 700 (80/100/120/140/150/110) | Levitate | imported | Dragon Draco Meteor 140S · Psychic Future Sight 120S |
| Meganium-Mega | Grass/Fairy | 625 (80/92/115/143/115/80) | Mega Sol | imported | Grass Leaf Storm 140S |
| Pyroar-Mega | Fire/Normal | 607 (86/88/92/129/86/126) | Fire Mane | imported | Fire Overheat 140S · Normal Double-Edge 120P |
| Raichu-Mega-Y | Electric | 585 (60/100/55/160/80/130) | No Guard | imported | Electric Thunder 120S |
| Sableye-Mega | Dark/Ghost | 480 (50/85/125/85/115/20) | Magic Bounce | imported | Dark Foul Play 95P · Ghost Poltergeist 110P |
| Scolipede-Mega | Bug/Poison | 585 (60/140/149/75/99/62) | Shell Armor | imported | Bug Megahorn 120P · Poison Poison Jab 80P |
| Scrafty-Mega | Dark/Fighting | 588 (65/130/135/55/135/68) | Intimidate | imported | Dark Foul Play 95P · Fighting Focus Punch 150P |
| Sharpedo-Mega | Water/Dark | 560 (70/140/70/110/65/105) | Strong Jaw | imported | Water Hydro Pump 120S · Dark Crunch 80P |
| Skarmory-Mega | Steel/Flying | 565 (65/140/110/40/100/110) | Stalwart | imported | Steel Iron Head 80P · Flying Sky Attack 140 (charge)P |
| Slowbro-Mega | Water/Psychic | 590 (95/75/180/130/80/30) | Shell Armor | imported | Water Hydro Pump 120S · Psychic Future Sight 120S |
| Staraptor-Mega | Fighting/Flying | 585 (85/140/100/60/90/110) | Contrary | imported | Fighting Close Combat 120P · Flying Sky Attack 140 (charge)P |
| Starmie-Mega | Water/Psychic | 620 (60/100/105/130/105/120) | Huge Power | imported | Water Waterfall 80P · Psychic Psycho Cut 70P |
| Swampert-Mega | Water/Ground | 635 (100/150/110/95/110/70) | Swift Swim | imported | Water Aqua Tail 90P · Ground Earthquake 100P |
| Venusaur-Mega | Grass/Poison | 625 (80/100/123/122/120/80) | Thick Fat | imported | Grass Leaf Storm 140S · Poison Sludge Bomb 90S |

---

## P. Hazard environment

**Stealth Rock setters:** Aerodactyl-Mega, Archaludon, Bisharp, Blissey, Chansey, Clefable, Excadrill, Glimmora, Hippowdon, Hydreigon, Iron Treads, Jirachi, Mamoswine, Metagross, Mew, Skarmory, Skarmory-Mega, Swampert, Swampert-Mega, Terrakion, Tyranitar

**Spikes:** Glimmora, Heracross-Mega, Mew, Scolipede, Scolipede-Mega, Skarmory, Skarmory-Mega

**Toxic Spikes:** Dragalge-Mega, Gengar, Glimmora, Mew, Scolipede, Scolipede-Mega

**Sticky Web:** none

**Removal (Rapid Spin / Defog / Mortal Spin / Tidy Up):** Aerodactyl-Mega, Altaria-Mega, Conkeldurr, Corviknight, Drampa-Mega, Excadrill, Glimmora, Hawlucha, Hydreigon, Iron Treads, Latias-Mega, Lilligant-Hisui, Mew, Moltres, Moltres-Galar, Quaquaval, Regieleki, Rotom-Wash, Salamence, Scizor, Serperior, Skarmory, Skarmory-Mega, Staraptor-Mega, Starmie-Mega, Tapu Fini, Thundurus, Thundurus-Therian, Zapdos-Galar

**Magic Bounce (bounces hazards back):** Hatterene, Sableye-Mega

**Ghost types (block Rapid Spin):** Aegislash, Aegislash-Blade, Blacephalon, Chandelure, Chandelure-Mega, Gengar, Pecharunt, Polteageist, Sableye-Mega, Zoroark-Hisui

Heavy-Duty Boots are available to every **species** entry and to **no forme**
entry, because the stone occupies the item slot. That asymmetry matters most for
Moltres, Gyarados, Weavile, Blacephalon and for every Mega on the candidate list.

---

## Q. Weather / terrain / Trick Room / Tailwind environment

**Weather setters by move:** Rain Dance — Aegislash, Aegislash-Blade, Aerodactyl-Mega, Alakazam, Altaria-Mega, Amoonguss, Azumarill, Bisharp, Blissey, Chansey, Clefable, Conkeldurr, Corviknight, Delphox-Mega, Dragalge-Mega, Drampa-Mega, Enamorus, Gardevoir-Mega, Gengar, Glimmora, Goodra-Hisui, Gyarados, Hawlucha, Haxorus, Heracross-Mega, Hydrapple, Hydreigon, Jirachi, Keldeo, Latias-Mega, Lilligant-Hisui, Mamoswine, Metagross, Mew, Mienshao, Moltres, Moltres-Galar, Porygon-Z, Primarina, Pyroar-Mega, Quaquaval, Raichu-Mega-Y, Regieleki, Rotom-Wash, Sableye-Mega, Salamence, Scizor, Scrafty-Mega, Sharpedo-Mega, Slowbro, Slowbro-Mega, Slowking, Staraptor-Mega, Starmie-Mega, Swampert, Swampert-Mega, Tapu Fini, Thundurus, Thundurus-Therian, Tyranitar, Ursaluna, Weavile, Zapdos-Galar, Zoroark-Hisui; Sunny Day — Aegislash, Aegislash-Blade, Aerodactyl-Mega, Alakazam, Altaria-Mega, Amoonguss, Blacephalon, Blissey, Chandelure, Chandelure-Mega, Chansey, Clefable, Conkeldurr, Corviknight, Delphox-Mega, Drampa-Mega, Emboar-Mega, Enamorus, Excadrill, Gardevoir-Mega, Gengar, Glimmora, Goodra-Hisui, Gyarados, Hawlucha, Haxorus, Heracross-Mega, Hippowdon, Hydrapple, Hydreigon, Jirachi, Keldeo, Latias-Mega, Lilligant-Hisui, Meganium-Mega, Metagross, Mew, Mienshao, Moltres, Moltres-Galar, Porygon-Z, Pyroar-Mega, Rotom-Wash, Sableye-Mega, Salamence, Scizor, Scolipede, Scolipede-Mega, Scrafty-Mega, Serperior, Skarmory, Skarmory-Mega, Slowbro, Slowbro-Mega, Slowking, Staraptor-Mega, Thundurus, Thundurus-Therian, Tyranitar, Ursaluna, Venusaur-Mega, Victini, Weavile, Zapdos-Galar, Zoroark-Hisui; Sandstorm — Aerodactyl-Mega, Bisharp, Blissey, Chansey, Excadrill, Glimmora, Goodra-Hisui, Gyarados, Hippowdon, Iron Boulder, Iron Treads, Jirachi, Latias-Mega, Mamoswine, Metagross, Mew, Moltres, Moltres-Galar, Scizor, Skarmory, Skarmory-Mega, Terrakion, Tyranitar, Zapdos-Galar; Snowscape — Altaria-Mega, Azumarill, Blissey, Chansey, Dragalge-Mega, Mamoswine, Mew, Primarina, Slowbro, Slowbro-Mega, Slowking, Weavile, Zoroark-Hisui.

**Weather setters by ability:** Hippowdon, Tyranitar.

**Terrain setters by move:** Electric — Blissey, Chansey, Iron Boulder, Iron Crown, Iron Leaves, Iron Treads, Mew, Raichu-Mega-Y, Regieleki, Rotom-Wash, Thundurus, Thundurus-Therian, Zapdos-Galar, Zeraora; Grassy — Amoonguss, Enamorus, Hydrapple, Iron Leaves, Lilligant-Hisui, Meganium-Mega, Mew, Serperior, Venusaur-Mega; Misty — Azumarill, Clefable, Enamorus, Gardevoir-Mega, Hatterene, Mew, Primarina, Quaquaval, Tapu Fini; Psychic — Alakazam, Delphox-Mega, Gardevoir-Mega, Hatterene, Iron Leaves, Mew, Slowbro, Slowbro-Mega, Slowking.

**Terrain setters by ability:** Tapu Fini.

**Weather-speed abilities in UU:** Excadrill, Lilligant-Hisui, Swampert-Mega.

**Mega Sol is PERSONAL weather, not field-wide sun.** It overrides
`battle.weatherFor(pokemon)` for its holder only; nothing else on the field
sees it, and it does not beat primal weather's element block. **Meganium-Mega**
is the UU holder. Anything reasoning about it as a sun setter for teammates is
wrong.

**Trick Room:** Alakazam, Chandelure, Chandelure-Mega, Delphox-Mega, Gardevoir-Mega, Gengar, Hatterene, Jirachi, Mew, Polteageist, Porygon-Z, Slowbro, Slowbro-Mega, Slowking, Starmie-Mega, Victini. The **Warp Prism** extends Trick Room *the holder sets* from 5 turns to **8**.

**Tailwind:** Aerodactyl-Mega, Altaria-Mega, Corviknight, Drampa-Mega, Enamorus, Hawlucha, Hydreigon, Latias-Mega, Mew, Moltres, Moltres-Galar, Salamence, Scizor, Skarmory, Skarmory-Mega, Staraptor-Mega, Zapdos-Galar. The **Wind Sock** extends Tailwind *the holder sets* from 4 turns to **7**.

Neither item can be held by a Mega — the stone occupies the slot — but a
teammate can hold it and set the field. That matters for the slow breakers:
Dragalge-Mega (Spe 205 at max +Spe), Drampa-Mega, Scrafty-Mega, Hatterene and Mega Slowbro.

---

## R. New candidates the mechanical scan surfaced

Mechanical flags only — reasons to look, not verdicts.

- **Aegislash** (Steel/Ghost, BST 520, Stance Change) — setup + priority + reliable recovery on one entry. Raw headline stat 50.
- **Aegislash-Blade** (Steel/Ghost, BST 520, Stance Change) — setup + priority + reliable recovery on one entry. Raw headline stat 150.
- **Azumarill** (Water/Fairy, BST 420, Thick Fat/Huge Power/Sap Sipper) — setup + priority + reliable recovery on one entry. Raw headline stat 60.
- **Bisharp** (Dark/Steel, BST 490, Defiant/Inner Focus/Pressure) — setup + priority + reliable recovery on one entry. Raw headline stat 125.
- **Conkeldurr** (Fighting, BST 505, Guts/Sheer Force/Iron Fist) — setup + priority + reliable recovery on one entry. Raw headline stat 140.
- **Emboar-Mega** (Fire/Fighting, BST 628, Mold Breaker) — setup + priority + reliable recovery on one entry. Raw headline stat 148.
- **Gardevoir-Mega** (Psychic/Fairy, BST 618, Pixilate) — setup + priority + reliable recovery on one entry. Raw headline stat 165.
- **Gengar** (Ghost/Poison, BST 500, Cursed Body/Levitate) — setup + priority + reliable recovery on one entry. Raw headline stat 130.
- **Goodra-Hisui** (Steel/Dragon, BST 600, Sap Sipper/Shell Armor/Gooey) — setup + priority + reliable recovery on one entry. Raw headline stat 110.
- **Hawlucha** (Fighting/Flying, BST 500, Limber/Unburden/Mold Breaker) — setup + priority + reliable recovery on one entry. Raw headline stat 92.
- **Haxorus** (Dragon, BST 540, Rivalry/Mold Breaker/Unnerve) — setup + priority + reliable recovery on one entry. Raw headline stat 147.
- **Heracross-Mega** (Bug/Fighting, BST 600, Skill Link) — setup + priority + reliable recovery on one entry. Raw headline stat 185.
- **Hydrapple** (Grass/Dragon, BST 540, Supersweet Syrup/Regenerator/Sticky Hold) — setup + priority + reliable recovery on one entry. Raw headline stat 120.
- **Iron Boulder** (Rock/Psychic, BST 590, Quark Drive) — setup + priority + reliable recovery on one entry. Raw headline stat 120.
- **Iron Leaves** (Grass/Psychic, BST 590, Quark Drive) — setup + priority + reliable recovery on one entry. Raw headline stat 130.
- **Keldeo** (Water/Fighting, BST 580, Justified) — setup + priority + reliable recovery on one entry. Raw headline stat 129.
- **Latias-Mega** (Dragon/Psychic, BST 700, Levitate) — setup + priority + reliable recovery on one entry. Raw headline stat 140.
- **Lilligant-Hisui** (Grass/Fighting, BST 480, Chlorophyll/Hustle/Leaf Guard) — Attack reaches **508** off a base 105 — an ability is doing the work; setup + priority + reliable recovery on one entry. Raw headline stat 105.
- **Mamoswine** (Ice/Ground, BST 530, Oblivious/Snow Cloak/Thick Fat) — setup + priority + reliable recovery on one entry. Raw headline stat 130.
- **Meganium-Mega** (Grass/Fairy, BST 625, Mega Sol) — setup + priority + reliable recovery on one entry. Raw headline stat 143.
- **Metagross** (Steel/Psychic, BST 600, Clear Body/Light Metal) — setup + priority + reliable recovery on one entry. Raw headline stat 135.
- **Mew** (Psychic, BST 600, Synchronize) — setup + priority + reliable recovery on one entry. Raw headline stat 100.
- **Mienshao** (Fighting, BST 510, Inner Focus/Regenerator/Reckless) — setup + priority + reliable recovery on one entry. Raw headline stat 125.
- **Moltres-Galar** (Dark/Flying, BST 580, Berserk) — setup + priority + reliable recovery on one entry. Raw headline stat 100.
- **Okidogi** (Poison/Fighting, BST 555, Toxic Chain/Guard Dog) — setup + priority + reliable recovery on one entry. Raw headline stat 128.
- **Polteageist** (Ghost, BST 508, Weak Armor/Cursed Body) — setup + priority + reliable recovery on one entry. Raw headline stat 134.
- **Primarina** (Water/Fairy, BST 530, Torrent/Liquid Voice) — setup + priority + reliable recovery on one entry. Raw headline stat 126.
- **Quaquaval** (Water/Fighting, BST 530, Torrent/Moxie) — setup + priority + reliable recovery on one entry. Raw headline stat 120.
- **Raichu-Mega-Y** (Electric, BST 585, No Guard) — setup + priority + reliable recovery on one entry. Raw headline stat 160.
- **Regieleki** (Electric, BST 580, Transistor) — setup + priority + reliable recovery on one entry. Raw headline stat 100.
- **Rotom-Wash** (Electric/Water, BST 520, Levitate) — setup + priority + reliable recovery on one entry. Raw headline stat 105.
- **Sableye-Mega** (Dark/Ghost, BST 480, Magic Bounce) — setup + priority + reliable recovery on one entry. Raw headline stat 85.
- **Scizor** (Bug/Steel, BST 500, Swarm/Technician/Light Metal) — setup + priority + reliable recovery on one entry. Raw headline stat 130.
- **Scrafty-Mega** (Dark/Fighting, BST 588, Intimidate) — setup + priority + reliable recovery on one entry. Raw headline stat 130.
- **Serperior** (Grass, BST 528, Overgrow/Contrary) — setup + priority + reliable recovery on one entry. Raw headline stat 75.
- **Sharpedo-Mega** (Water/Dark, BST 560, Strong Jaw) — setup + priority + reliable recovery on one entry. Raw headline stat 140.
- **Skarmory** (Steel/Flying, BST 465, Keen Eye/Sturdy/Weak Armor) — setup + priority + reliable recovery on one entry. Raw headline stat 80.
- **Skarmory-Mega** (Steel/Flying, BST 565, Stalwart) — setup + priority + reliable recovery on one entry. Raw headline stat 140.
- **Staraptor-Mega** (Fighting/Flying, BST 585, Contrary) — setup + priority + reliable recovery on one entry. Raw headline stat 140.
- **Starmie-Mega** (Water/Psychic, BST 620, Huge Power) — Attack reaches **656** off a base 100 — an ability is doing the work. Raw headline stat 130.
- **Terrakion** (Rock/Fighting, BST 580, Justified) — setup + priority + reliable recovery on one entry. Raw headline stat 129.
- **Venusaur-Mega** (Grass/Poison, BST 625, Thick Fat) — setup + priority + reliable recovery on one entry. Raw headline stat 122.
- **Victini** (Psychic/Fire, BST 600, Victory Star) — setup + priority + reliable recovery on one entry. Raw headline stat 100.
- **Weavile** (Dark/Ice, BST 510, Pressure/Pickpocket) — setup + priority + reliable recovery on one entry. Raw headline stat 120.
- **Zeraora** (Electric, BST 600, Volt Absorb) — setup + priority + reliable recovery on one entry. Raw headline stat 112.
- **Zoroark-Hisui** (Normal/Ghost, BST 510, Illusion) — setup + priority + reliable recovery on one entry. Raw headline stat 125.

---

## S. Remaining genuinely unresolved questions

Things this project **cannot** answer, stated plainly rather than guessed:

1. **No usage, ladder, win-rate, tournament or popularity data exists in RedGPT.**
   There is no metagame history to consult. Every judgement must come from
   mechanics, matchups and role competition.
2. **Nothing in UU has been played by a human.** The whole ladder was rebuilt on
   2026-08-15 and revised on 2026-08-16; the fifteen entries that arrived from OU
   have no play history at all. Campaign balance figures measure a different
   format and say nothing about UU.
3. **`estimated` formes are a nearest-neighbour model, not data.** Nine UU
   formes sit on it (section F). The model reads the 48 Megas Smogon does rank
   and interpolates by BST and base tier; it has no notion of movepool. Section F
   is the evidence that model cannot see.
4. **Guts, and any conditional ability, reads as its unboosted value here.** The
   engine reports Conkeldurr's Attack as 416 because nothing has
   burned it yet. Toxic Orb and Flame Orb fire **on entry**, so the boosted
   number is the one that matters in play — ask for it if you need it.
5. **Ability-vs-ability comparisons on a species entry are not resolved here.**
   A species may run any of its abilities; the profiles report the offensive
   stats for each, but the movepool sections assume the first. Scizor
   (Technician vs Light Metal) and Azumarill (Huge Power vs Thick Fat) are the
   sharpest cases — ask for a per-ability profile if it decides a verdict.
6. **The 0-2 HP rounding difference from Showdown's calculator** is known and
   documented; it never changes a tier.

**If a number you need is missing, ask for it.** Any damage, speed or legality
question can be answered against the real engine, and a request is far cheaper
than a verdict built on an estimate.
