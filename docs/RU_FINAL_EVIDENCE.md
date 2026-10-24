# RedGPT RU Final Audit — Verified Evidence Packet

**Generated from the live RedGPT project** by `tools/ru-final-evidence.js`.
Every stat, movepool value, damage figure and speed number comes from the running
engine, the packaged data, the validator or the real damage calculator.

**RedGPT has no usage, ladder, win-rate, tournament or popularity data**, so none
is quoted. Section T lists what genuinely cannot be determined.

---

## Your task

Make the **complete bidirectional RU tier audit**:

1. **Which current RU entries are too strong for RU and should move UP to UU?**
2. **Which current RU entries are too weak or outclassed and should move DOWN to NU?**

The bars are section E (the current UU roster, unchanged by the last audit) and
section D (the complete NU roster).

**Most entries should stay put.** A high BST alone does not promote, and weak raw
stats alone do not demote — a demotion needs NU to already contain something that
credibly does the candidate's **actual job** as well or better. Unique value that
justifies staying includes superior typing, Regenerator, Magic Bounce, reliable
recovery, a better hazard or pivot role, unique priority, item freedom, or simply
not costing the team's only Mega slot.

**There is no cap on how many entries may move — including zero.**

For each entry you move: exact name, species or forme, direction, confidence,
two or three sentences naming the specific Pokémon it outclasses or is outclassed
by, and the numbers you relied on with the ability and item they assume. Then list
what you **considered and deliberately left**.

**This packet contains no recommendations.**

---

## Context: the UU audit that preceded this one

The final UU audit moved **nothing** in either direction. Its watch-list —
Starmie-Mega, Porygon-Z, Delphox-Mega — stayed UU, as did Gardevoir-Mega,
Latias-Mega, Staraptor-Mega, Chandelure-Mega, Blacephalon, the Aegislash package,
Aerodactyl-Mega, Emboar-Mega, Scrafty-Mega, Serperior, Sharpedo-Mega,
Dragalge-Mega, Drampa-Mega and Meganium-Mega. No UU entry dropped to RU.

**So the UU roster in section E is the live, current bar** — an RU entry moving up
joins that company, not a hypothetical one.

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

**RU format rules, read live — and compared against UU rather than assumed:**

RU is byte-identical to UU on every rule **except the tier ceiling**:

| Rule | RU | Same as UU? |
| --- | --- | --- |
| `maxTier` | **RU** | **no** — UU is UU |
| `tera` | false | yes — **no Terastallization in RU** |
| `mega` | true | yes — Mega on, stone only, one per side |
| `speciesClause` / `sleepClause` / `itemClause` | true / true / false | yes |
| `evasionClause` / `ohkoClause` | true / true | yes |
| `bannedMoves` | Fissure, Guillotine, Horn Drill, Sheer Cold, Double Team, Minimize | yes |
| `bannedItems` / `bannedSpecies` / `bannedAbilities` | none / none / none | yes |
| level / team / EV / IV | 100 / 6v6 / 510-252 / 31 | yes |

There are **no RU-specific bans** beyond the shared clause list.

**Mechanics that decide tiering here, all verified live:**

| Move | Type | Cat | BP | Priority | Acc |
| --- | --- | --- | --- | --- | --- |
| Sucker Punch | Dark | Physical | **80** | **+1** | 100% |
| Thunderclap | Electric | Special | **70** | **+1** | 100% |
| First Impression | Bug | Physical | **90** | **+2** | 100% |
| Upper Hand | Fighting | Physical | **65** | **+3** | 100% |
| Grassy Glide | Grass | Physical | **70** | **+1** | 100% |

All five are **unconditional**. Grassy Glide's packaged priority is 0 — the +1 is
added by the engine, so reading the move data alone misses it. Upper Hand has no
condition and no flinch.

**Restored base powers (live):** Overheat 140, Leaf Storm 140, Draco Meteor 140, Blizzard 120, Hydro Pump 120, Fire Blast 120, Thunder 120, Hurricane 120, Head Smash 150, Mind Blown 150, Close Combat 120.
**Focus Punch is 150 BP at 70% accuracy and priority 0** — no Substitute condition, no negative priority.

**Multi-hit:** 2-5 hit moves are **25 BP per hit**, exactly-2-hit moves **50 BP
per hit**. Triple Axel is deliberately excluded (20 BP × 3) and so is Population Bomb (20 BP × 10).

**Ring Target:** the holder's attacks hit for **neutral** damage through a
**type** immunity. It does **not** beat Levitate, Flash Fire, Water Absorb or any
other ability immunity. One per team, visible from turn one, and **no Mega can
hold it**.

**Toxic Orb and Flame Orb fire on ENTRY**, so Guts/Poison Heal/Quick Feet holders
are already boosted the turn they arrive.
---

## B. Profiler validation — the four defects this build does not have

The UU pass found four defects in the movepool profiler. This packet uses the
shared `tools/lib/profiler.js`, which fixes all four; they are listed so you can
tell that these numbers are not the earlier, wrong ones.

1. **Ability-driven offence.** Coverage used to be filtered on *base* Attack vs
   *base* Special Attack, which hid a Huge Power holder's whole physical
   movepool. Offence is now measured through `getStat` **per ability**, and the
   best decides. Every profile below prints the engine's numbers for each ability.
2. **`-ate` conversion.** Pixilate/Aerilate/Refrigerate convert in
   `onModifyMove`, invisible to `battle.moveType`; the profiler asks
   `Abilities.displayMoveType` / `displayBasePower` instead, so a Refrigerate
   Body Slam reads **Ice 110**, not Normal 85.
3. **Charge moves winning ties** — a charge move is no longer quoted as the STAB
   when an equal free move exists.
4. **Banned moves advertised** — the RU banlist is applied, so Double Team and
   the OHKO moves never appear.

**Verified for this packet:** the damage calculator **does** honour Skill Link —
Cloyster's Icicle Spear reports **5 hits** with Skill Link against 3 without, so
the Cloyster figures below are the real forced-5-hit numbers.
---

## C. Full RU competitive profiles

All **131** current RU entries, engine-resolved.

**Absol-Mega** — forme, **RU**, source: imported (natdex)
  Dark | BST 565 (65/150/60/115/60/115) | Abilities: Magic Bounce
  Engine stats @252 (neutral/positive): Magic Bounce: Atk 399/438, SpA 329/361, Spe 329/361
  Item: **Absolite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Absol (PU), pre-Mega abilities Pressure / Super Luck / Justified, pre-Mega Spe 273 (max +Spe)
  STAB: Dark Foul Play 95P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Fairy Play Rough 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Normal Razor Wind 80 (charge)S
  Setup: Calm Mind, Hone Claws, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Feint 50P Normal (+2), Quick Attack 40P Normal (+1)
  Pivot: Baton Pass
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Cleric: Wish
  Trapping: Mean Look
  Weather/terrain: Hail, Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Knock Off, Magic Coat, Perish Song, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass

**Absol-Mega-Z** — forme, **RU**, source: **estimated** _(its own `species.tier` reads PU — the base's; the enforced tier is the one shown)_
  Dark/Ghost | BST 565 (65/154/60/75/60/151) | Abilities: Sharpness
  Engine stats @252 (neutral/positive): Sharpness: Atk 407/447, SpA 249/273, Spe 401/441
  Item: **Absolite Z** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Absol (PU), pre-Mega abilities Pressure / Super Luck / Justified, pre-Mega Spe 273 (max +Spe)
  STAB: Dark Foul Play 95P · Ghost Shadow Claw 70P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Fairy Play Rough 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Normal Razor Wind 80 (charge)S, Flying Air Slash 75S
  Setup: Calm Mind, Hone Claws, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Feint 50P Normal (+2), Quick Attack 40P Normal (+1)
  Pivot: Baton Pass
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Cleric: Wish
  Trapping: Mean Look
  Weather/terrain: Hail, Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Knock Off, Magic Coat, Perish Song, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass

**Aggron-Mega** — forme, **RU**, source: imported (natdex)
  Steel | BST 630 (70/140/230/60/80/50) | Abilities: Filter
  Engine stats @252 (neutral/positive): Filter: Atk 379/416, SpA 219/240, Spe 199/218
  Item: **Aggronite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Aggron (NU), pre-Mega abilities Sturdy / Rock Head / Heavy Metal, pre-Mega Spe 218 (max +Spe)
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
  Notable: Taunt, Substitute, Focus Punch

**Ampharos-Mega** — forme, **RU**, source: imported (natdex)
  Electric/Dragon | BST 610 (90/95/105/165/110/45) | Abilities: Mold Breaker
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 289/317, SpA 429/471, Spe 189/207
  Item: **Ampharosite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Ampharos (ZU), pre-Mega abilities Static / Plus, pre-Mega Spe 229 (max +Spe)
  STAB: Electric Thunder 120S · Dragon Dragon Pulse 90S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Fling 80P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Rock Meteor Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Bug Signal Beam 75S
  Setup: Agility, Charge, Cotton Guard, Defense Curl
  Reliable recovery: Rest
  Pivot: Volt Switch
  Phazing: Dragon Tail, Roar
  Status: Thunder Wave, Toxic
  Cleric: Heal Bell
  Weather/terrain: Electric Terrain, Rain Dance, Sunny Day
  Utility: Light Screen, Protect, Reflect, Safeguard, Substitute
  Notable: Substitute, Focus Punch

**Arcanine-Hisui** — species, **RU**, source: imported (natdex)
  Fire/Rock | BST 555 (95/115/80/95/80/90) | Abilities: Intimidate / Flash Fire / Rock Head
  Engine stats @252 (neutral/positive): Intimidate: Atk 329/361, SpA 289/317, Spe 279/306 — Flash Fire: Atk 329/361, SpA 289/317, Spe 279/306 — Rock Head: Atk 329/361, SpA 289/317, Spe 279/306
  Item: **free**
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

**Arctozolt** — species, **RU**, source: imported (natdex)
  Electric/Ice | BST 505 (90/100/90/90/80/55) | Abilities: Volt Absorb / Static / Slush Rush
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 299/328, SpA 279/306, Spe 209/229 — Static: Atk 299/328, SpA 279/306, Spe 209/229 — Slush Rush: Atk 299/328, SpA 279/306, Spe 209/229
  Item: **free**
  STAB: Electric Bolt Beak 170P · Ice Blizzard 120S
  Physical coverage: Normal Mega Kick 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ground Stomping Tantrum 75P, Fighting Low Kick 60P, Flying Pluck 60P
  Special coverage: Water Hydro Pump 120S, Rock Meteor Beam 120 (charge)S, Normal Hyper Voice 90S
  Setup: Charge
  Reliable recovery: Rest
  Status: Thunder Wave
  Weather/terrain: Hail, Rain Dance
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Armarouge** — species, **RU**, source: imported (natdex)
  Fire/Psychic | BST 525 (85/60/100/125/80/75) | Abilities: Flash Fire / Weak Armor
  Engine stats @252 (neutral/positive): Flash Fire: Atk 219/240, SpA 349/383, Spe 249/273 — Weak Armor: Atk 219/240, SpA 349/383, Spe 249/273
  Item: **free**
  STAB: Fire Overheat 140S · Psychic Psychic 90S
  Physical coverage: Normal Take Down 90P, Ghost Astonish 30P, Dark Fling 30P
  Special coverage: Fighting Focus Blast 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S
  Setup: Calm Mind, Iron Defense
  Reliable recovery: Rest
  Status: Will-O-Wisp
  Weather/terrain: Psychic Terrain, Sunny Day
  Utility: Clear Smog, Destiny Bond, Disable, Light Screen, Protect, Reflect, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

**Azelf** — species, **RU**, source: imported (natdex)
  Psychic | BST 580 (75/125/70/125/70/115) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 349/383, SpA 349/383, Spe 329/361
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Flying Acrobatics 110P, Steel Iron Tail 100P, Fairy Play Rough 90P, Fighting Drain Punch 75P, Fire Fire Punch 75P
  Special coverage: Fire Fire Blast 120S, Electric Thunder 120S, Grass Energy Ball 90S, Normal Uproar 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S
  Setup: Calm Mind, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Draining Kiss, Dream Eater
  Hazards: Stealth Rock
  Pivot: Baton Pass, U-turn
  Status: Thunder Wave, Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Encore, Knock Off, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Baton Pass, Trick Room

**Banette-Mega** — forme, **RU**, source: imported (natdex)
  Ghost | BST 555 (64/165/75/93/83/75) | Abilities: Prankster
  Engine stats @252 (neutral/positive): Prankster: Atk 429/471, SpA 285/313, Spe 249/273
  Item: **Banettite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Banette (ZU), pre-Mega abilities Insomnia / Frisk / Cursed Body, pre-Mega Spe 251 (max +Spe)
  STAB: Ghost Poltergeist 110P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Dark Foul Play 95P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Fire Burning Jealousy 70S
  Setup: Calm Mind, Cotton Guard, Nasty Plot, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Shadow Sneak 40P Ghost (+1)
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Destiny Bond, Disable, Encore, Knock Off, Magic Coat, Pain Split, Protect, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room

**Barbaracle** — species, **RU**, source: imported (natdex)
  Rock/Water | BST 500 (72/105/115/54/86/68) | Abilities: Tough Claws / Sniper / Pickpocket
  Engine stats @252 (neutral/positive): Tough Claws: Atk 309/339, SpA 207/227, Spe 235/258 — Sniper: Atk 309/339, SpA 207/227, Spe 235/258 — Pickpocket: Atk 309/339, SpA 207/227, Spe 235/258
  Item: **free**
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

**Barraskewda** — species, **RU**, source: imported (natdex)
  Water | BST 490 (61/123/60/60/50/136) | Abilities: Swift Swim / Propeller Tail
  Engine stats @252 (neutral/positive): Swift Swim: Atk 345/379, SpA 219/240, Spe 371/408 — Propeller Tail: Atk 345/379, SpA 219/240, Spe 371/408
  Item: **free**
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

**Beedrill-Mega** — forme, **RU**, source: imported (natdex)
  Bug/Poison | BST 495 (65/150/40/15/80/145) | Abilities: Adaptability
  Engine stats @252 (neutral/positive): Adaptability: Atk 399/438, SpA 129/141, Spe 389/427
  Item: **Beedrillite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Beedrill (ZU), pre-Mega abilities Swarm / Sniper, pre-Mega Spe 273 (max +Spe)
  STAB: Bug Twineedle 50x2P · Poison Poison Jab 80P
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Ground Drill Run 80P, Dark Throat Chop 80P, Fighting Brick Break 75P, Flying Aerial Ace 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Flying Air Cutter 60S, Normal Hidden Power 60S, Ghost Ominous Wind 60S, Electric Electroweb 55S
  Setup: Agility, Harden, Iron Defense, Swords Dance
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Giga Drain, Mega Drain
  Hazards: Toxic Spikes
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Weather/terrain: Sunny Day
  Utility: Knock Off, Protect, Reflect, Substitute, Tailwind
  Notable: Knock Off, Substitute, Baton Pass, Tailwind

**Bewear** — species, **RU**, source: imported (natdex)
  Normal/Fighting | BST 500 (120/125/80/55/60/60) | Abilities: Fluffy / Klutz / Unnerve
  Engine stats @252 (neutral/positive): Fluffy: Atk 349/383, SpA 209/229, Spe 219/240 — Klutz: Atk 349/383, SpA 209/229, Spe 219/240 — Unnerve: Atk 349/383, SpA 209/229, Spe 219/240
  Item: **free**
  STAB: Normal Double-Edge 120P · Fighting Focus Punch 150P
  Physical coverage: Dragon Dual Chop 50x2P, Ground Earthquake 100P, Dark Darkest Lariat 85P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Ice Ice Punch 75P
  Special coverage: **none**
  Setup: Bulk Up, Defense Curl, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Phazing: Roar
  Status: Toxic
  Utility: Pain Split, Protect, Substitute, Taunt
  Notable: Taunt, Substitute, Focus Punch

**Blastoise** — species, **RU**, source: imported (natdex)
  Water | BST 530 (79/83/100/85/105/78) | Abilities: Torrent / Rain Dish
  Engine stats @252 (neutral/positive): Torrent: Atk 265/291, SpA 269/295, Spe 255/280 — Rain Dish: Atk 265/291, SpA 269/295, Spe 255/280
  Item: **free**
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
  Cleric: Life Dew
  Trapping: Block
  Weather/terrain: Hail, Rain Dance
  Utility: Haze, Protect, Reflect, Substitute
  Notable: Substitute, Focus Punch

**Breloom** — species, **RU**, source: imported (natdex)
  Grass/Fighting | BST 460 (60/130/80/60/60/70) | Abilities: Effect Spore / Poison Heal / Technician
  Engine stats @252 (neutral/positive): Effect Spore: Atk 359/394, SpA 219/240, Spe 239/262 — Poison Heal: Atk 359/394, SpA 219/240, Spe 239/262 — Technician: Atk 359/394, SpA 219/240, Spe 239/262
  Item: **free**
  STAB: Grass Seed Bomb 80P · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P
  Special coverage: Poison Sludge Bomb 90S, Normal Tera Blast 80S, Ground Mud Shot 55S
  Setup: Bulk Up, Growth, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Drain Punch, Giga Drain, Mega Drain
  Priority: Feint 50P Normal (+2), Mach Punch 40P Fighting (+1), Vacuum Wave 40S Fighting (+1)
  Status: Poison Powder, Spore, Stun Spore, Toxic
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Leech Seed, Protect, Safeguard, Substitute
  Notable: Substitute, Focus Punch

**Camerupt-Mega** — forme, **RU**, source: imported (natdex)
  Fire/Ground | BST 560 (70/120/100/145/105/20) | Abilities: Sheer Force
  Engine stats @252 (neutral/positive): Sheer Force: Atk 339/372, SpA 389/427, Spe 139/152
  Item: **Cameruptite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Camerupt (ZU), pre-Mega abilities Magma Armor / Solid Rock / Anger Point, pre-Mega Spe 196 (max +Spe)
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

**Celebi** — species, **RU**, source: imported (natdex)
  Psychic/Grass | BST 600 (100/100/100/100/100/100) | Abilities: Natural Cure
  Engine stats @252 (neutral/positive): Natural Cure: Atk 299/328, SpA 299/328, Spe 299/328
  Item: **free**
  STAB: Psychic Future Sight 120S · Grass Leaf Storm 140S
  Physical coverage: Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Dark Sucker Punch 80P, Bug U-turn 70P
  Special coverage: Fighting Aura Sphere 90S, Ground Earth Power 90S, Bug Pollen Puff 90S, Normal Uproar 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S
  Setup: Calm Mind, Defense Curl, Nasty Plot, Swords Dance
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Dream Eater, Giga Drain
  Priority: Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1)
  Hazards: Stealth Rock
  Pivot: Baton Pass, U-turn
  Status: Thunder Wave, Toxic
  Cleric: Heal Bell, Life Dew
  Weather/terrain: Grassy Terrain, Psychic Terrain, Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Healing Wish, Leech Seed, Light Screen, Magic Coat, Perish Song, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Baton Pass, Trick Room

**Cetitan** — species, **RU**, source: imported (natdex)
  Ice | BST 521 (170/113/65/45/55/73) | Abilities: Thick Fat / Slush Rush / Sheer Force
  Engine stats @252 (neutral/positive): Thick Fat: Atk 325/357, SpA 189/207, Spe 245/269 — Slush Rush: Atk 325/357, SpA 189/207, Spe 245/269 — Sheer Force: Atk 325/357, SpA 189/207, Spe 245/269
  Item: **free**
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

**Chesnaught** — species, **RU**, source: imported (natdex)
  Grass/Fighting | BST 530 (88/107/122/74/75/64) | Abilities: Overgrow / Bulletproof
  Engine stats @252 (neutral/positive): Overgrow: Atk 313/344, SpA 247/271, Spe 227/249 — Bulletproof: Atk 313/344, SpA 247/271, Spe 227/249
  Item: **free**
  STAB: Grass Leaf Storm 140S · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Dark Crunch 80P
  Special coverage: Poison Sludge Bomb 90S, Normal Tera Blast 80S, Ground Mud Shot 55S
  Setup: Bulk Up, Defense Curl, Hone Claws, Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Giga Drain
  Priority: Grassy Glide 70P Grass (+1), Feint 50P Normal (+2)
  Hazards: Spikes
  Phazing: Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Knock Off, Leech Seed, Pain Split, Protect, Reflect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Focus Punch

**Chimecho-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one shown)_
  Psychic/Steel | BST 555 (75/50/110/135/120/65) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 199/218, SpA 369/405, Spe 229/251
  Item: **Chimechite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Chimecho (ZU), pre-Mega abilities Levitate, pre-Mega Spe 251 (max +Spe)
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Dark Knock Off 65P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Grass Energy Ball 90S, Normal Hyper Voice 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Electric Shock Wave 60S
  Setup: Calm Mind, Cosmic Power, Defense Curl
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Draining Kiss, Dream Eater
  Removal: Defog
  Pivot: Baton Pass
  Status: Hypnosis, Thunder Wave, Toxic, Yawn
  Cleric: Heal Bell, Wish
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Disable, Encore, Gravity, Healing Wish, Knock Off, Light Screen, Magic Coat, Perish Song, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Baton Pass, Trick Room

**Cloyster** — species, **RU**, source: imported (natdex)
  Water/Ice | BST 525 (50/95/180/85/45/70) | Abilities: Shell Armor / Skill Link / Overcoat
  Engine stats @252 (neutral/positive): Shell Armor: Atk 289/317, SpA 269/295, Spe 239/262 — Skill Link: Atk 289/317, SpA 269/295, Spe 239/262 — Overcoat: Atk 289/317, SpA 269/295, Spe 239/262
  Item: **free**
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
  Cleric: Life Dew
  Weather/terrain: Hail, Rain Dance, Snowscape
  Utility: Light Screen, Protect, Reflect, Substitute
  Notable: Substitute

**Cobalion** — species, **RU**, source: imported (natdex)
  Steel/Fighting | BST 580 (91/90/129/90/72/108) | Abilities: Justified
  Engine stats @252 (neutral/positive): Justified: Atk 279/306, SpA 279/306, Spe 315/346
  Item: **free**
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

**Comfey** — species, **RU**, source: imported (natdex)
  Fairy | BST 485 (51/52/90/82/110/100) | Abilities: Flower Veil / Triage / Natural Cure
  Engine stats @252 (neutral/positive): Flower Veil: Atk 203/223, SpA 263/289, Spe 299/328 — Triage: Atk 203/223, SpA 263/289, Spe 299/328 — Natural Cure: Atk 203/223, SpA 263/289, Spe 299/328
  Item: **free**
  STAB: Fairy Play Rough 90P
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Grass Petal Blizzard 90P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Grass Petal Dance 120S, Bug Pollen Puff 90S, Normal Tera Blast 80S, Psychic Stored Power 20S
  Setup: Amnesia, Calm Mind, Growth
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss, Giga Drain
  Priority: Grassy Glide 70P Grass (+1)
  Removal: Defog
  Pivot: U-turn
  Status: Toxic
  Cleric: Aromatherapy, Floral Healing, Heal Bell
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Encore, Knock Off, Leech Seed, Light Screen, Magic Coat, Pain Split, Protect, Safeguard, Substitute, Tailwind, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room, Tailwind

**Copperajah** — species, **RU**, source: override
  Steel | BST 500 (122/130/69/80/69/30) | Abilities: Sheer Force / Heavy Metal
  Engine stats @252 (neutral/positive): Sheer Force: Atk 359/394, SpA 259/284, Spe 159/174 — Heavy Metal: Atk 359/394, SpA 259/284, Spe 159/174
  Item: **free**
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

**Crabominable-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one shown)_
  Fighting/Ice | BST 578 (97/157/122/62/107/33) | Abilities: Iron Fist
  Engine stats @252 (neutral/positive): Iron Fist: Atk 413/454, SpA 223/245, Spe 165/181
  Item: **Crabominite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Crabominable (ZU), pre-Mega abilities Hyper Cutter / Iron Fist / Anger Point, pre-Mega Spe 203 (max +Spe)
  STAB: Fighting Focus Punch 150P · Ice Ice Hammer 100P
  Physical coverage: Poison Gunk Shot 120P, Normal Return 102P, Water Crabhammer 100P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Hard Press 100P
  Special coverage: Water Scald 80S, Normal Tera Blast 80S, Ground Mud Shot 55S
  Setup: Amnesia, Bulk Up, Iron Defense, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Upper Hand 65P Fighting (+3)
  Status: Toxic
  Trapping: Block
  Weather/terrain: Hail, Rain Dance, Snowscape, Sunny Day
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute, Focus Punch

**Crawdaunt** — species, **RU**, source: imported (natdex)
  Water/Dark | BST 468 (63/120/85/90/55/55) | Abilities: Hyper Cutter / Shell Armor / Adaptability
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 339/372, SpA 279/306, Spe 209/229 — Shell Armor: Atk 339/372, SpA 279/306, Spe 209/229 — Adaptability: Atk 339/372, SpA 279/306, Spe 209/229
  Item: **free**
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

**Cresselia** — species, **RU**, source: imported (natdex)
  Psychic | BST 600 (120/70/120/75/130/85) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 239/262, SpA 249/273, Spe 269/295
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Bug Fury Cutter 40P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Fairy Moonblast 95S, Rock Power Gem 80S, Ghost Shadow Ball 80S
  Setup: Calm Mind
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Status: Thunder Wave, Toxic
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Gravity, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

**Crobat** — species, **RU**, source: imported (natdex)
  Poison/Flying | BST 535 (85/90/80/70/80/130) | Abilities: Inner Focus / Infiltrator
  Engine stats @252 (neutral/positive): Inner Focus: Atk 279/306, SpA 239/262, Spe 359/394 — Infiltrator: Atk 279/306, SpA 239/262, Spe 359/394
  Item: **free**
  STAB: Poison Sludge Bomb 90S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Bug Leech Life 80P, Psychic Zen Headbutt 80P, Steel Steel Wing 70P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Grass Giga Drain 75S, Dragon Twister 40S
  Setup: Agility, Nasty Plot
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Absorb, Giga Drain, Leech Life, Mega Drain
  Priority: Quick Attack 40P Normal (+1)
  Removal: Defog
  Pivot: U-turn
  Phazing: Whirlwind
  Status: Hypnosis, Toxic
  Trapping: Mean Look
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Haze, Protect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Cyclizar** — species, **RU**, source: imported (natdex)
  Dragon/Normal | BST 501 (70/95/65/85/65/121) | Abilities: Shed Skin / Regenerator
  Engine stats @252 (neutral/positive): Shed Skin: Atk 289/317, SpA 269/295, Spe 341/375 — Regenerator: Atk 289/317, SpA 269/295, Spe 341/375
  Item: **free**
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

**Darmanitan** — species, **RU**, source: imported (natdex)
  Fire | BST 480 (105/140/55/30/55/95) | Abilities: Sheer Force / Zen Mode
  Engine stats @252 (neutral/positive): Sheer Force: Atk 379/416, SpA 159/174, Spe 289/317 — Zen Mode: Atk 379/416, SpA 159/174, Spe 289/317
  Item: **free**
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
  Notable: Trick, Encore, Taunt, Substitute, Focus Punch

**Darmanitan-Zen** — forme, **RU**, source: imported (natdex)
  Fire/Psychic | BST 540 (105/30/105/140/105/55) | Abilities: Zen Mode
  Engine stats @252 (neutral/positive): Zen Mode: Atk 379/416, SpA 159/174, Spe 289/317
  Item: **—** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Darmanitan (RU), pre-Mega abilities Sheer Force / Zen Mode, pre-Mega Spe 317 (max +Spe)
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
  Notable: Trick, Encore, Taunt, Substitute, Focus Punch

**Deoxys-Defense** — species, **RU**, source: imported (natdex)
  Psychic | BST 600 (50/70/160/70/160/90) | Abilities: Pressure
  Engine stats @252 (neutral/positive): Pressure: Atk 239/262, SpA 239/262, Spe 279/306
  Item: **free**
  STAB: Psychic Psycho Boost 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Meteor Mash 100P, Poison Poison Jab 80P, Dark Throat Chop 80P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Dark Dark Pulse 80S
  Setup: Agility, Amnesia, Calm Mind, Cosmic Power, Iron Defense, Nasty Plot
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Drain Punch, Dream Eater
  Priority: Extreme Speed 80P Normal (+2)
  Hazards: Spikes, Stealth Rock
  Pivot: Teleport
  Status: Thunder Wave, Toxic
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Detect, Gravity, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Taunt, Substitute, Trick Room, Focus Punch

**Diancie** — species, **RU**, source: imported (natdex)
  Rock/Fairy | BST 600 (50/100/150/100/150/50) | Abilities: Clear Body
  Engine stats @252 (neutral/positive): Clear Body: Atk 299/328, SpA 299/328, Spe 199/218
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Fairy Misty Explosion 100S
  Physical coverage: Normal Explosion 250P, Fighting Body Press 80P, Ground Bulldoze 60P, Steel Gyro Ball 27P
  Special coverage: Ground Earth Power 90S, Psychic Psychic 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Fire Mystical Fire 75S
  Setup: Amnesia, Calm Mind, Harden, Iron Defense, Rock Polish, Sharpen
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Hazards: Spikes, Stealth Rock
  Pivot: Baton Pass
  Status: Toxic
  Cleric: Heal Bell
  Weather/terrain: Hail, Rain Dance, Sandstorm, Snowscape, Sunny Day
  Utility: Encore, Gravity, Light Screen, Protect, Reflect, Safeguard, Substitute, Trick Room
  Notable: Encore, Substitute, Baton Pass, Trick Room

**Diggersby** — species, **RU**, source: imported (natdex)
  Normal/Ground | BST 423 (85/56/77/50/77/78) | Abilities: Pickup / Cheek Pouch / Huge Power
  Engine stats @252 (neutral/positive): Pickup: Atk 211/232, SpA 199/218, Spe 255/280 — Cheek Pouch: Atk 211/232, SpA 199/218, Spe 255/280 — Huge Power: Atk 422/464, SpA 199/218, Spe 255/280
  Item: **free**
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
  Notable: Knock Off, Substitute, Focus Punch

**Donphan** — species, **RU**, source: imported (natdex)
  Ground | BST 500 (90/120/120/60/60/50) | Abilities: Sturdy / Sand Veil
  Engine stats @252 (neutral/positive): Sturdy: Atk 339/372, SpA 219/240, Spe 199/218 — Sand Veil: Atk 339/372, SpA 219/240, Spe 199/218
  Item: **free**
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

**Dracozolt** — species, **RU**, source: imported (natdex)
  Electric/Dragon | BST 505 (90/100/90/80/70/75) | Abilities: Volt Absorb / Hustle / Sand Rush
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 299/328, SpA 259/284, Spe 249/273 — Hustle: Atk 448/492, SpA 259/284, Spe 249/273 — Sand Rush: Atk 299/328, SpA 259/284, Spe 249/273
  Item: **free**
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

**Duraludon** — species, **RU**, source: override
  Steel/Dragon | BST 535 (70/95/115/120/50/85) | Abilities: Light Metal / Heavy Metal / Stalwart
  Engine stats @252 (neutral/positive): Light Metal: Atk 289/317, SpA 339/372, Spe 269/295 — Heavy Metal: Atk 289/317, SpA 339/372, Spe 269/295 — Stalwart: Atk 289/317, SpA 339/372, Spe 269/295
  Item: **free**
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

**Durant** — species, **RU**, source: imported (natdex)
  Bug/Steel | BST 484 (58/109/112/48/48/109) | Abilities: Swarm / Hustle / Truant
  Engine stats @252 (neutral/positive): Swarm: Atk 317/348, SpA 195/214, Spe 317/348 — Hustle: Atk 475/522, SpA 195/214, Spe 317/348 — Truant: Atk 317/348, SpA 195/214, Spe 317/348
  Item: **free**
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

**Eelektross-Mega** — forme, **RU**, source: override
  Electric | BST 615 (85/145/80/135/90/80) | Abilities: Eelevate
  Engine stats @252 (neutral/positive): Eelevate: Atk 389/427, SpA 369/405, Spe 259/284
  Item: **Eelektrossite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Eelektross (ZU), pre-Mega abilities Levitate, pre-Mega Spe 218 (max +Spe)
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Dragon Outrage 120P, Normal Thrash 120P, Steel Iron Tail 100P, Water Aqua Tail 90P, Flying Bounce 85 (charge)P
  Special coverage: Fire Flamethrower 95S, Dragon Dragon Pulse 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Bug Signal Beam 75S
  Setup: Bulk Up, Charge, Coil, Hone Claws
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Giga Drain
  Pivot: U-turn, Volt Switch
  Phazing: Dragon Tail, Roar
  Status: Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Rain Dance, Sunny Day
  Utility: Knock Off, Light Screen, Protect, Substitute
  Notable: Knock Off, Substitute, Focus Punch

**Empoleon** — species, **RU**, source: imported (natdex)
  Water/Steel | BST 530 (84/86/88/111/101/60) | Abilities: Torrent / Competitive / Defiant
  Engine stats @252 (neutral/positive): Torrent: Atk 271/298, SpA 321/353, Spe 219/240 — Competitive: Atk 271/298, SpA 321/353, Spe 219/240 — Defiant: Atk 271/298, SpA 321/353, Spe 219/240
  Item: **free**
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

**Enamorus-Therian** — species, **RU**, source: imported (natdex)
  Fairy/Flying | BST 580 (74/115/110/135/100/46) | Abilities: Overcoat
  Engine stats @252 (neutral/positive): Overcoat: Atk 329/361, SpA 369/405, Spe 191/210
  Item: **free**
  STAB: Fairy Misty Explosion 100S · Flying Fly 90 (charge)P
  Physical coverage: Dragon Outrage 120P, Fighting Superpower 120P, Normal Take Down 90P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Ghost Astonish 30P
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Fire Mystical Fire 75S
  Setup: Agility, Calm Mind, Iron Defense
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Weather/terrain: Grassy Terrain, Misty Terrain, Rain Dance, Sunny Day
  Utility: Healing Wish, Protect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Entei** — species, **RU**, source: imported (natdex)
  Fire | BST 580 (115/115/85/90/75/100) | Abilities: Pressure / Inner Focus / Flash Fire
  Engine stats @252 (neutral/positive): Pressure: Atk 329/361, SpA 279/306, Spe 299/328 — Inner Focus: Atk 329/361, SpA 279/306, Spe 299/328 — Flash Fire: Atk 329/361, SpA 279/306, Spe 299/328
  Item: **free**
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

**Falinks-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one shown)_
  Fighting | BST 570 (65/135/135/70/65/100) | Abilities: Defiant
  Engine stats @252 (neutral/positive): Defiant: Atk 369/405, SpA 239/262, Spe 299/328
  Item: **Falinksite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Falinks (ZU), pre-Mega abilities Battle Armor / Defiant, pre-Mega Spe 273 (max +Spe)
  STAB: Fighting Close Combat 120P
  Physical coverage: Bug Megahorn 120P, Ground High Horsepower 95P, Normal Take Down 90P, Steel Iron Head 80P, Poison Poison Jab 80P, Dark Throat Chop 80P
  Special coverage: Normal Uproar 90S
  Setup: Agility, Bulk Up, Iron Defense, No Retreat, Swords Dance
  Reliable recovery: Rest
  Priority: First Impression 90P Bug (+2), Upper Hand 65P Fighting (+3)
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute

**Feraligatr** — species, **RU**, source: imported (natdex)
  Water | BST 530 (85/105/100/79/83/78) | Abilities: Torrent / Sheer Force
  Engine stats @252 (neutral/positive): Torrent: Atk 309/339, SpA 257/282, Spe 255/280 — Sheer Force: Atk 309/339, SpA 257/282, Spe 255/280
  Item: **free**
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
  Notable: Substitute, Focus Punch

**Fezandipiti** — species, **RU**, source: imported (natdex)
  Poison/Fairy | BST 555 (88/91/82/70/125/99) | Abilities: Toxic Chain / Technician
  Engine stats @252 (neutral/positive): Toxic Chain: Atk 281/309, SpA 239/262, Spe 297/326 — Technician: Atk 281/309, SpA 239/262, Spe 297/326
  Item: **free**
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

**Forretress** — species, **RU**, source: imported (natdex)
  Bug/Steel | BST 465 (75/90/140/60/60/40) | Abilities: Sturdy / Overcoat
  Engine stats @252 (neutral/positive): Sturdy: Atk 279/306, SpA 219/240, Spe 179/196 — Overcoat: Atk 279/306, SpA 219/240, Spe 179/196
  Item: **free**
  STAB: Bug Bug Buzz 90S · Steel Steel Beam 140S
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Rock Stone Edge 100P, Fighting Body Press 80P, Ice Ice Spinner 80P, Poison Poison Jab 80P
  Special coverage: Electric Zap Cannon 120S, Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Normal Tera Blast 80S, Poison Venoshock 65S
  Setup: Autotomize, Defense Curl, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain
  Hazards: Spikes, Stealth Rock, Toxic Spikes
  Removal: Rapid Spin
  Pivot: Volt Switch
  Status: Thunder Wave, Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Gravity, Light Screen, Pain Split, Protect, Reflect, Substitute
  Notable: Substitute

**Froslass-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one shown)_
  Ice/Ghost | BST 580 (70/80/70/140/100/120) | Abilities: Snow Warning
  Engine stats @252 (neutral/positive): Snow Warning: Atk 259/284, SpA 379/416, Spe 339/372
  Item: **Froslassite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Froslass (ZU), pre-Mega abilities Snow Cloak / Cursed Body, pre-Mega Spe 350 (max +Spe)
  STAB: Ice Blizzard 120S · Ghost Shadow Ball 80S
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Fighting Wake-Up Slap 70P, Grass Trailblaze 50P, Rock Rollout 30P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Normal Tera Blast 80S, Bug Signal Beam 75S, Water Water Pulse 60S, Fairy Draining Kiss 50S
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss, Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Ice Shard 40P Ice (+1)
  Hazards: Spikes
  Status: Sing, Thunder Wave, Toxic, Will-O-Wisp
  Trapping: Block
  Weather/terrain: Hail, Rain Dance, Snowscape
  Utility: Aurora Veil, Destiny Bond, Disable, Haze, Light Screen, Pain Split, Protect, Reflect, Safeguard, Substitute, Switcheroo, Taunt, Trick
  Notable: Trick, Switcheroo, Taunt, Substitute

**Gallade** — species, **RU**, source: imported (natdex)
  Psychic/Fighting | BST 518 (68/125/65/65/115/80) | Abilities: Steadfast / Sharpness / Justified
  Engine stats @252 (neutral/positive): Steadfast: Atk 349/383, SpA 229/251, Spe 259/284 — Sharpness: Atk 349/383, SpA 229/251, Spe 259/284 — Justified: Atk 349/383, SpA 229/251, Spe 259/284
  Item: **free**
  STAB: Psychic Zen Headbutt 80P · Fighting Focus Punch 150P
  Physical coverage: Grass Solar Blade 125 (charge)P, Normal Double-Edge 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Poison Poison Jab 80P
  Special coverage: Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Flying Air Slash 75S
  Setup: Agility, Bulk Up, Calm Mind, Defense Curl, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Draining Kiss, Dream Eater
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Shadow Sneak 40P Ghost (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Teleport
  Status: Hypnosis, Sing, Thunder Wave, Toxic, Will-O-Wisp
  Cleric: Life Dew, Wish
  Trapping: Mean Look
  Weather/terrain: Misty Terrain, Psychic Terrain, Rain Dance, Sunny Day
  Utility: Destiny Bond, Disable, Encore, Knock Off, Light Screen, Magic Coat, Memento, Pain Split, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room, Focus Punch

**Gardevoir** — species, **RU**, source: imported (natdex)
  Psychic/Fairy | BST 518 (68/65/65/125/115/80) | Abilities: Synchronize / Trace / Telepathy
  Engine stats @252 (neutral/positive): Synchronize: Atk 229/251, SpA 349/383, Spe 259/284 — Trace: Atk 229/251, SpA 349/383, Spe 259/284 — Telepathy: Atk 229/251, SpA 349/383, Spe 259/284
  Item: **free**
  STAB: Psychic Future Sight 120S · Fairy Misty Explosion 100S
  Physical coverage: Normal Double-Edge 120P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Dark Knock Off 65P, Ghost Shadow Sneak 40P
  Special coverage: Fighting Focus Blast 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S
  Setup: Calm Mind, Defense Curl
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss, Dream Eater
  Priority: Shadow Sneak 40P Ghost (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Teleport
  Status: Hypnosis, Sing, Thunder Wave, Toxic, Will-O-Wisp
  Cleric: Heal Bell, Life Dew, Wish
  Trapping: Mean Look
  Weather/terrain: Misty Terrain, Psychic Terrain, Rain Dance, Sunny Day
  Utility: Destiny Bond, Disable, Encore, Gravity, Healing Wish, Knock Off, Light Screen, Magic Coat, Memento, Pain Split, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room

**Garganacl** — species, **RU**, source: imported (natdex)
  Rock | BST 500 (100/100/130/45/90/35) | Abilities: Purifying Salt / Sturdy / Clear Body
  Engine stats @252 (neutral/positive): Purifying Salt: Atk 299/328, SpA 189/207, Spe 169/185 — Sturdy: Atk 299/328, SpA 189/207, Spe 169/185 — Clear Body: Atk 299/328, SpA 189/207, Spe 169/185
  Item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Steel Heavy Slam 120P, Ground Earthquake 100P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Ground Earth Power 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S
  Setup: Harden, Iron Defense, Rock Polish
  Reliable recovery: Recover, Rest
  Hazards: Stealth Rock
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Gravity, Protect, Substitute
  Notable: Substitute, Focus Punch

**Gastrodon** — species, **RU**, source: imported (natdex)
  Water/Ground | BST 475 (111/83/68/92/82/39) | Abilities: Sticky Hold / Storm Drain / Sand Force
  Engine stats @252 (neutral/positive): Sticky Hold: Atk 265/291, SpA 283/311, Spe 177/194 — Storm Drain: Atk 265/291, SpA 283/311, Spe 177/194 — Sand Force: Atk 265/291, SpA 283/311, Spe 177/194
  Item: **free**
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

**Golisopod** — species, **RU**, source: imported (natdex)
  Bug/Water | BST 530 (75/125/140/60/90/40) | Abilities: Emergency Exit
  Engine stats @252 (neutral/positive): Emergency Exit: Atk 349/383, SpA 219/240, Spe 179/196
  Item: **free**
  STAB: Bug First Impression 90P · Water Liquidation 85P
  Physical coverage: Fighting Close Combat 120P, Normal Return 102P, Dragon Dual Chop 50x2P, Ground Drill Run 80P, Steel Iron Head 80P, Poison Poison Jab 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Dark Dark Pulse 80S, Normal Hidden Power 60S, Ground Mud Shot 55S
  Setup: Bulk Up, Defense Curl, Harden, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Leech Life
  Priority: First Impression 90P Bug (+2), Sucker Punch 80P Dark (+1), Aqua Jet 40P Water (+1)
  Hazards: Spikes
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Knock Off, Pain Split, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Golurk-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads PU — the base's; the enforced tier is the one shown)_
  Ground/Ghost | BST 583 (89/159/105/70/105/55) | Abilities: Unseen Fist
  Engine stats @252 (neutral/positive): Unseen Fist: Atk 417/458, SpA 239/262, Spe 209/229
  Item: **Golurkite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Golurk (PU), pre-Mega abilities Iron Fist / Klutz / No Guard, pre-Mega Spe 229 (max +Spe)
  STAB: Ground Earthquake 100P · Ghost Poltergeist 110P
  Physical coverage: Normal Self-Destruct 200P, Fighting Focus Punch 150P, Fire Heat Crash 120P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Electric Thunderbolt 95S, Psychic Psychic 90S, Steel Flash Cannon 80S
  Setup: Defense Curl, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Hazards: Stealth Rock
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Gravity, Knock Off, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick
  Notable: Knock Off, Trick, Substitute, Focus Punch

**Houndoom-Mega** — forme, **RU**, source: imported (natdex)
  Dark/Fire | BST 600 (75/90/90/140/90/115) | Abilities: Solar Power
  Engine stats @252 (neutral/positive): Solar Power: Atk 279/306, SpA 379/416, Spe 329/361
  Item: **Houndoominite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Houndoom (ZU), pre-Mega abilities Early Bird / Flash Fire / Unnerve, pre-Mega Spe 317 (max +Spe)
  STAB: Dark Dark Pulse 80S · Fire Overheat 140S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P, Electric Thunder Fang 65P, Grass Trailblaze 50P, Fighting Rock Smash 40P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Hyper Voice 90S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S, Ground Mud Shot 55S
  Setup: Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Feint 50P Normal (+2)
  Phazing: Roar
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Destiny Bond, Detect, Pain Split, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Infernape** — species, **RU**, source: override
  Fire/Fighting | BST 534 (76/104/71/104/71/108) | Abilities: Blaze / Iron Fist
  Engine stats @252 (neutral/positive): Blaze: Atk 307/337, SpA 307/337, Spe 315/346 — Iron Fist: Atk 307/337, SpA 307/337, Spe 315/346
  Item: **free**
  STAB: Fire Overheat 140S · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Ground Scorching Sands 70S
  Setup: Agility, Bulk Up, Calm Mind, Hone Claws, Nasty Plot, Swords Dance, Work Up
  Reliable recovery: Rest, Slack Off
  Drain/Rest-only: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3), Mach Punch 40P Fighting (+1)
  Hazards: Stealth Rock
  Pivot: U-turn
  Phazing: Roar
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Encore, Knock Off, Protect, Substitute, Switcheroo, Taunt
  Notable: Knock Off, Switcheroo, Encore, Taunt, Substitute, Focus Punch

**Iron Jugulis** — species, **RU**, source: imported (natdex)
  Dark/Flying | BST 570 (94/80/86/122/80/108) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 259/284, SpA 343/377, Spe 315/346
  Item: **free**
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

**Iron Thorns** — species, **RU**, source: imported (natdex)
  Rock/Electric | BST 570 (100/134/110/70/84/72) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 367/403, SpA 239/262, Spe 243/267
  Item: **free**
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

**Kleavor** — species, **RU**, source: imported (natdex)
  Bug/Rock | BST 500 (70/135/95/45/70/85) | Abilities: Swarm / Sheer Force / Sharpness
  Engine stats @252 (neutral/positive): Swarm: Atk 369/405, SpA 189/207, Spe 269/295 — Sheer Force: Atk 369/405, SpA 189/207, Spe 269/295 — Sharpness: Atk 369/405, SpA 189/207, Spe 269/295
  Item: **free**
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

**Krookodile** — species, **RU**, source: imported (natdex)
  Ground/Dark | BST 519 (95/117/80/65/70/92) | Abilities: Intimidate / Moxie / Anger Point
  Engine stats @252 (neutral/positive): Intimidate: Atk 333/366, SpA 229/251, Spe 283/311 — Moxie: Atk 333/366, SpA 229/251, Spe 283/311 — Anger Point: Atk 333/366, SpA 229/251, Spe 283/311
  Item: **free**
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
  Notable: Knock Off, Taunt, Substitute, Focus Punch

**Latias** — species, **RU**, source: imported (natdex)
  Dragon/Psychic | BST 600 (80/80/90/110/130/110) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 259/284, SpA 319/350, Spe 319/350
  Item: **free**
  STAB: Dragon Draco Meteor 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Water Liquidation 85P, Dark Sucker Punch 80P, Ghost Shadow Claw 70P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Water Surf 95S, Fighting Aura Sphere 90S, Fairy Alluring Voice 80S
  Setup: Agility, Calm Mind, Dragon Dance, Hone Claws
  Reliable recovery: Recover, Rest, Roost
  Drain/Rest-only: Draining Kiss, Dream Eater
  Priority: Sucker Punch 80P Dark (+1)
  Removal: Defog
  Pivot: Baton Pass
  Phazing: Roar
  Status: Thunder Wave, Toxic
  Cleric: Wish
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Healing Wish, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Tailwind, Trick
  Notable: Trick, Substitute, Baton Pass, Tailwind

**Linoone** — species, **RU**, source: imported (natdex)
  Normal | BST 420 (78/70/61/50/61/100) | Abilities: Pickup / Gluttony / Quick Feet
  Engine stats @252 (neutral/positive): Pickup: Atk 239/262, SpA 199/218, Spe 299/328 — Gluttony: Atk 239/262, SpA 199/218, Spe 299/328 — Quick Feet: Atk 239/262, SpA 199/218, Spe 299/328
  Item: **free**
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

**Lokix** — species, **RU**, source: imported (natdex)
  Bug/Dark | BST 450 (71/102/78/52/55/92) | Abilities: Swarm / Tinted Lens
  Engine stats @252 (neutral/positive): Swarm: Atk 303/333, SpA 203/223, Spe 283/311 — Tinted Lens: Atk 303/333, SpA 203/223, Spe 283/311
  Item: **free**
  STAB: Bug First Impression 90P · Dark Sucker Punch 80P
  Physical coverage: Fighting Axe Kick 120P, Normal Double-Edge 120P, Flying Bounce 85 (charge)P, Grass Trailblaze 50P, Ghost Astonish 30P
  Special coverage: Normal Tera Blast 80S
  Setup: Agility, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Leech Life
  Priority: First Impression 90P Bug (+2), Sucker Punch 80P Dark (+1), Feint 50P Normal (+2)
  Pivot: U-turn
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Lucario** — species, **RU**, source: imported (natdex)
  Fighting/Steel | BST 525 (70/110/70/115/70/90) | Abilities: Steadfast / Inner Focus / Justified
  Engine stats @252 (neutral/positive): Steadfast: Atk 319/350, SpA 329/361, Spe 279/306 — Inner Focus: Atk 319/350, SpA 329/361, Spe 279/306 — Justified: Atk 319/350, SpA 329/361, Spe 279/306
  Item: **free**
  STAB: Fighting Focus Punch 150P · Steel Steel Beam 140S
  Physical coverage: Normal Mega Kick 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Fire Blaze Kick 85P, Dark Crunch 80P
  Special coverage: Dragon Dragon Pulse 90S, Psychic Psychic 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Water Water Pulse 60S
  Setup: Agility, Bulk Up, Calm Mind, Hone Claws, Iron Defense, Nasty Plot, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Extreme Speed 80P Normal (+2), Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Bullet Punch 40P Steel (+1)
  Phazing: Circle Throw, Roar
  Status: Toxic
  Cleric: Life Dew
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Protect, Substitute
  Notable: Substitute, Focus Punch

**Lycanroc-Dusk** — species, **RU**, source: imported (natdex)
  Rock | BST 487 (75/117/65/55/65/110) | Abilities: Tough Claws
  Engine stats @252 (neutral/positive): Tough Claws: Atk 333/366, SpA 209/229, Spe 319/350
  Item: **free**
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

**Machamp** — species, **RU**, source: imported (natdex)
  Fighting | BST 505 (90/130/80/65/85/55) | Abilities: Guts / No Guard / Steadfast
  Engine stats @252 (neutral/positive): Guts: Atk 359/394, SpA 229/251, Spe 209/229 — No Guard: Atk 359/394, SpA 229/251, Spe 209/229 — Steadfast: Atk 359/394, SpA 229/251, Spe 209/229
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Skull Bash 130P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P, Poison Poison Jab 80P
  Special coverage: Fire Fire Blast 120S, Normal Hidden Power 60S, Ground Mud-Slap 20S
  Setup: Bulk Up, Meditate, Work Up
  Reliable recovery: Rest
  Priority: Bullet Punch 40P Steel (+1), Vacuum Wave 40S Fighting (+1)
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Encore, Knock Off, Light Screen, Protect, Substitute
  Notable: Knock Off, Encore, Substitute, Focus Punch

**Magnezone** — species, **RU**, source: imported (natdex)
  Electric/Steel | BST 535 (70/70/115/130/90/60) | Abilities: Magnet Pull / Sturdy / Analytic
  Engine stats @252 (neutral/positive): Magnet Pull: Atk 239/262, SpA 359/394, Spe 219/240 — Sturdy: Atk 239/262, SpA 359/394, Spe 219/240 — Analytic: Atk 239/262, SpA 359/394, Spe 219/240
  Item: **free**
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

**Malamar-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one shown)_
  Dark/Psychic | BST 582 (86/102/88/98/120/88) | Abilities: Contrary
  Engine stats @252 (neutral/positive): Contrary: Atk 303/333, SpA 295/324, Spe 275/302
  Item: **Malamarite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Malamar (ZU), pre-Mega abilities Contrary / Suction Cups / Infiltrator, pre-Mega Spe 269 (max +Spe)
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

**Mandibuzz** — species, **RU**, source: imported (natdex)
  Dark/Flying | BST 510 (110/65/105/55/95/80) | Abilities: Big Pecks / Overcoat / Weak Armor
  Engine stats @252 (neutral/positive): Big Pecks: Atk 229/251, SpA 209/229, Spe 259/284 — Overcoat: Atk 229/251, SpA 209/229, Spe 259/284 — Weak Armor: Atk 229/251, SpA 209/229, Spe 259/284
  Item: **free**
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

**Manectric-Mega** — forme, **RU**, source: imported (natdex)
  Electric | BST 575 (70/75/80/135/80/135) | Abilities: Intimidate
  Engine stats @252 (neutral/positive): Intimidate: Atk 249/273, SpA 369/405, Spe 369/405
  Item: **Manectite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Manectric (ZU), pre-Mega abilities Static / Lightning Rod / Minus, pre-Mega Spe 339 (max +Spe)
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

**Marowak-Alola** — species, **RU**, source: imported (natdex)
  Fire/Ghost | BST 425 (60/80/110/50/80/45) | Abilities: Cursed Body / Lightning Rod / Rock Head
  Engine stats @252 (neutral/positive): Cursed Body: Atk 259/284, SpA 199/218, Spe 189/207 — Lightning Rod: Atk 259/284, SpA 199/218, Spe 189/207 — Rock Head: Atk 259/284, SpA 199/218, Spe 189/207
  Item: **free**
  STAB: Fire Fire Blast 120S · Ghost Poltergeist 110P
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Ground Bonemerang 50x2P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Psychic Dream Eater 100S, Ground Earth Power 90S, Normal Uproar 90S
  Setup: Iron Defense, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Hazards: Stealth Rock
  Status: Sing, Toxic, Will-O-Wisp
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Knock Off, Pain Split, Perish Song, Protect, Substitute
  Notable: Knock Off, Substitute, Focus Punch

**Maushold** — species, **RU**, source: imported (natdex)
  Normal | BST 470 (74/75/70/65/75/111) | Abilities: Friend Guard / Cheek Pouch / Technician
  Engine stats @252 (neutral/positive): Friend Guard: Atk 249/273, SpA 229/251, Spe 321/353 — Cheek Pouch: Atk 249/273, SpA 229/251, Spe 321/353 — Technician: Atk 249/273, SpA 229/251, Spe 321/353
  Item: **free**
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

**Meloetta-Pirouette** — species, **RU**, source: override
  Normal/Fighting | BST 600 (100/128/90/77/77/128) | Abilities: Serene Grace
  Engine stats @252 (neutral/positive): Serene Grace: Atk 355/390, SpA 253/278, Spe 355/390
  Item: **free**
  STAB: Normal Last Resort 140P · Fighting Focus Punch 150P
  Physical coverage: Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Fairy Play Rough 90P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Grass Energy Ball 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
  Setup: Calm Mind, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Dream Eater
  Priority: Quick Attack 40P Normal (+1)
  Pivot: Baton Pass, U-turn
  Status: Sing, Thunder Wave, Toxic
  Cleric: Heal Bell
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Gravity, Knock Off, Light Screen, Magic Coat, Perish Song, Protect, Safeguard, Substitute, Trick, Trick Room
  Notable: Knock Off, Trick, Substitute, Baton Pass, Trick Room, Focus Punch

**Meowstic-M-Mega** — forme, **RU**, source: override
  Psychic | BST 566 (74/48/76/143/101/124) | Abilities: Trace
  Engine stats @252 (neutral/positive): Trace: Atk 195/214, SpA 385/423, Spe 347/381
  Item: **Meowsticite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Meowstic (ZU), pre-Mega abilities Keen Eye / Infiltrator / Prankster, pre-Mega Spe 337 (max +Spe)
  STAB: Psychic Dream Eater 100S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Dark Sucker Punch 80P, Grass Trailblaze 50P
  Special coverage: Electric Thunderbolt 95S, Grass Energy Ball 90S, Fairy Alluring Voice 80S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S
  Setup: Barrier, Calm Mind, Nasty Plot, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Fake Out 40P Normal (+3)
  Pivot: Baton Pass
  Status: Thunder Wave, Toxic, Yawn
  Cleric: Heal Bell
  Trapping: Mean Look
  Weather/terrain: Misty Terrain, Psychic Terrain, Rain Dance, Sunny Day
  Utility: Gravity, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Baton Pass, Trick Room

**Mimikyu** — species, **RU**, source: imported (natdex)
  Ghost/Fairy | BST 476 (55/90/80/50/105/96) | Abilities: Disguise
  Engine stats @252 (neutral/positive): Disguise: Atk 279/306, SpA 199/218, Spe 291/320
  Item: **free**
  STAB: Ghost Phantom Force 90 (charge)P · Fairy Play Rough 90P
  Physical coverage: Normal Last Resort 140P, Grass Wood Hammer 120P, Bug Leech Life 80P, Fighting Drain Punch 75P, Dark Feint Attack 60P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Fire Burning Jealousy 70S
  Setup: Bulk Up, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Draining Kiss, Dream Eater, Giga Drain, Leech Life
  Priority: Shadow Sneak 40P Ghost (+1)
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Weather/terrain: Misty Terrain, Rain Dance, Sunny Day
  Utility: Destiny Bond, Light Screen, Pain Split, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

**Mimikyu-Busted** — species, **RU**, source: imported (natdex)
  Ghost/Fairy | BST 476 (55/90/80/50/105/96) | Abilities: Disguise
  Engine stats @252 (neutral/positive): Disguise: Atk 279/306, SpA 199/218, Spe 291/320
  Item: **free**
  STAB: Ghost Phantom Force 90 (charge)P · Fairy Play Rough 90P
  Physical coverage: Normal Last Resort 140P, Grass Wood Hammer 120P, Bug Leech Life 80P, Fighting Drain Punch 75P, Dark Feint Attack 60P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Fire Burning Jealousy 70S
  Setup: Bulk Up, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Draining Kiss, Dream Eater, Giga Drain, Leech Life
  Priority: Shadow Sneak 40P Ghost (+1)
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Weather/terrain: Misty Terrain, Rain Dance, Sunny Day
  Utility: Destiny Bond, Light Screen, Pain Split, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

**Muk-Alola** — species, **RU**, source: imported (natdex)
  Poison/Dark | BST 500 (105/105/75/65/100/50) | Abilities: Poison Touch / Gluttony / Power of Alchemy
  Engine stats @252 (neutral/positive): Poison Touch: Atk 309/339, SpA 229/251, Spe 199/218 — Gluttony: Atk 309/339, SpA 229/251, Spe 199/218 — Power of Alchemy: Atk 309/339, SpA 229/251, Spe 199/218
  Item: **free**
  STAB: Poison Gunk Shot 120P · Dark Foul Play 95P
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Bug Lunge 80P, Psychic Zen Headbutt 80P
  Special coverage: Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Fairy Moonblast 95S, Ghost Shadow Ball 80S, Normal Tera Blast 80S
  Setup: Acid Armor, Harden, Rock Polish
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Giga Drain, Mega Drain
  Priority: Shadow Sneak 40P Ghost (+1)
  Hazards: Toxic Spikes
  Status: Toxic
  Trapping: Block, Mean Look
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Clear Smog, Disable, Haze, Knock Off, Memento, Pain Split, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Focus Punch

**Munkidori** — species, **RU**, source: override
  Poison/Psychic | BST 555 (88/75/66/130/90/106) | Abilities: Toxic Chain / Frisk
  Engine stats @252 (neutral/positive): Toxic Chain: Atk 249/273, SpA 359/394, Spe 311/342 — Frisk: Atk 249/273, SpA 359/394, Spe 311/342
  Item: **free**
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

**Necrozma** — species, **RU**, source: imported (natdex)
  Psychic | BST 600 (97/107/101/127/89/79) | Abilities: Prism Armor
  Engine stats @252 (neutral/positive): Prism Armor: Atk 313/344, SpA 353/388, Spe 257/282
  Item: **free**
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

**Nidoking** — species, **RU**, source: imported (natdex)
  Poison/Ground | BST 505 (81/102/77/85/75/85) | Abilities: Poison Point / Rivalry / Sheer Force
  Engine stats @252 (neutral/positive): Poison Point: Atk 303/333, SpA 269/295, Spe 269/295 — Rivalry: Atk 303/333, SpA 269/295, Spe 269/295 — Sheer Force: Atk 303/333, SpA 269/295, Spe 269/295
  Item: **free**
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
  Notable: Taunt, Substitute, Focus Punch

**Nidoqueen** — species, **RU**, source: imported (natdex)
  Poison/Ground | BST 505 (90/92/87/75/85/76) | Abilities: Poison Point / Rivalry / Sheer Force
  Engine stats @252 (neutral/positive): Poison Point: Atk 283/311, SpA 249/273, Spe 251/276 — Rivalry: Atk 283/311, SpA 249/273, Spe 251/276 — Sheer Force: Atk 283/311, SpA 249/273, Spe 251/276
  Item: **free**
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
  Notable: Taunt, Substitute, Focus Punch

**Nihilego** — species, **RU**, source: imported (natdex)
  Rock/Poison | BST 570 (109/53/47/127/131/103) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 205/225, SpA 353/388, Spe 305/335
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Poison Sludge Wave 95S
  Physical coverage: Normal Return 102P, Dark Foul Play 95P, Steel Iron Head 80P, Psychic Zen Headbutt 80P
  Special coverage: Electric Thunder 120S, Psychic Psychic 90S, Fairy Dazzling Gleam 80S, Ghost Hex 65S, Grass Grass Knot 60S, Normal Hidden Power 60S
  Reliable recovery: Rest
  Hazards: Stealth Rock, Toxic Spikes
  Status: Thunder Wave, Toxic
  Weather/terrain: Sandstorm
  Utility: Clear Smog, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Safeguard, Substitute, Trick Room
  Notable: Knock Off, Substitute, Trick Room

**Noivern** — species, **RU**, source: imported (natdex)
  Flying/Dragon | BST 535 (85/70/80/97/80/123) | Abilities: Frisk / Infiltrator / Telepathy
  Engine stats @252 (neutral/positive): Frisk: Atk 239/262, SpA 293/322, Spe 345/379 — Infiltrator: Atk 239/262, SpA 293/322, Spe 345/379 — Telepathy: Atk 239/262, SpA 293/322, Spe 345/379
  Item: **free**
  STAB: Flying Sky Attack 140 (charge)P · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Electric Wild Charge 90P, Bug Leech Life 80P, Fighting Brick Break 75P, Ghost Shadow Claw 70P
  Special coverage: Normal Boomburst 140S, Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Fire Heat Wave 100S, Dark Dark Pulse 80S
  Setup: Agility, Dragon Dance, Hone Claws
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Absorb, Dream Eater, Leech Life
  Removal: Defog
  Pivot: U-turn
  Phazing: Dragon Tail, Whirlwind
  Status: Toxic
  Weather/terrain: Sunny Day
  Utility: Protect, Substitute, Switcheroo, Tailwind, Taunt
  Notable: Switcheroo, Taunt, Substitute, Tailwind

**Obstagoon** — species, **RU**, source: imported (natdex)
  Dark/Normal | BST 520 (93/90/101/60/81/95) | Abilities: Reckless / Guts / Defiant
  Engine stats @252 (neutral/positive): Reckless: Atk 279/306, SpA 219/240, Spe 289/317 — Guts: Atk 279/306, SpA 219/240, Spe 289/317 — Defiant: Atk 279/306, SpA 219/240, Spe 289/317
  Item: **free**
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

**Ogerpon** — species, **RU**, source: imported (natdex)
  Grass | BST 550 (80/120/84/60/96/110) | Abilities: Defiant
  Engine stats @252 (neutral/positive): Defiant: Atk 339/372, SpA 219/240, Spe 319/350
  Item: **free**
  STAB: Grass Solar Blade 125 (charge)P
  Physical coverage: Fighting Superpower 120P, Fairy Play Rough 90P, Normal Take Down 90P, Dark Throat Chop 80P, Psychic Zen Headbutt 80P, Ground Stomping Tantrum 75P
  Special coverage: Normal Tera Blast 80S
  Setup: Growth, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain, Horn Leech
  Priority: Grassy Glide 70P Grass (+1), Quick Attack 40P Normal (+1)
  Hazards: Spikes
  Pivot: U-turn
  Weather/terrain: Grassy Terrain, Rain Dance, Sandstorm, Sunny Day
  Utility: Encore, Knock Off, Leech Seed, Protect, Substitute, Taunt
  Notable: Knock Off, Encore, Taunt, Substitute

**Oricorio-Pom-Pom** — species, **RU**, source: imported (natdex)
  Electric/Flying | BST 476 (75/70/70/98/70/93) | Abilities: Dancer
  Engine stats @252 (neutral/positive): Dancer: Atk 239/262, SpA 295/324, Spe 285/313
  Item: **free**
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

**Oricorio-Sensu** — species, **RU**, source: imported (natdex)
  Ghost/Flying | BST 476 (75/70/70/98/70/93) | Abilities: Dancer
  Engine stats @252 (neutral/positive): Dancer: Atk 239/262, SpA 295/324, Spe 285/313
  Item: **free**
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

**Pangoro** — species, **RU**, source: imported (natdex)
  Fighting/Dark | BST 495 (95/124/78/69/71/58) | Abilities: Iron Fist / Mold Breaker / Scrappy
  Engine stats @252 (neutral/positive): Iron Fist: Atk 347/381, SpA 237/260, Spe 215/236 — Mold Breaker: Atk 347/381, SpA 237/260, Spe 215/236 — Scrappy: Atk 347/381, SpA 237/260, Spe 215/236
  Item: **free**
  STAB: Fighting Focus Punch 150P · Dark Foul Play 95P
  Physical coverage: Poison Gunk Shot 120P, Normal Mega Kick 120P, Dragon Outrage 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Steel Iron Head 80P
  Special coverage: Water Surf 95S, Normal Hyper Voice 90S, Poison Sludge Bomb 90S, Grass Grass Knot 60S, Bug Infestation 20S
  Setup: Bulk Up, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Bullet Punch 40P Steel (+1)
  Pivot: Parting Shot
  Phazing: Circle Throw, Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Focus Punch

**Pelipper** — species, **RU**, source: imported (natdex)
  Water/Flying | BST 440 (60/50/100/95/70/65) | Abilities: Keen Eye / Drizzle / Rain Dish
  Engine stats @252 (neutral/positive): Keen Eye: Atk 199/218, SpA 289/317, Spe 229/251 — Drizzle: Atk 199/218, SpA 289/317, Spe 229/251 — Rain Dish: Atk 199/218, SpA 289/317, Spe 229/251
  Item: **free**
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

**Pidgeot-Mega** — forme, **RU**, source: imported (natdex)
  Normal/Flying | BST 579 (83/80/80/135/80/121) | Abilities: No Guard
  Engine stats @252 (neutral/positive): No Guard: Atk 259/284, SpA 369/405, Spe 341/375
  Item: **Pidgeotite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Pidgeot (ZU), pre-Mega abilities Keen Eye / Tangled Feet / Big Pecks, pre-Mega Spe 331 (max +Spe)
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

**Politoed** — species, **RU**, source: imported (natdex)
  Water | BST 500 (90/75/75/90/100/70) | Abilities: Water Absorb / Damp / Drizzle
  Engine stats @252 (neutral/positive): Water Absorb: Atk 249/273, SpA 279/306, Spe 239/262 — Damp: Atk 249/273, SpA 279/306, Spe 239/262 — Drizzle: Atk 249/273, SpA 279/306, Spe 239/262
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Earthquake 100P, Flying Bounce 85 (charge)P, Ice Ice Punch 75P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Ground Earth Power 90S, Normal Hyper Voice 90S, Psychic Psychic 90S
  Setup: Amnesia, Defense Curl
  Reliable recovery: Rest
  Status: Hypnosis, Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Detect, Encore, Haze, Perish Song, Protect, Substitute
  Notable: Encore, Substitute, Focus Punch

**Porygon2** — species, **RU**, source: override
  Normal | BST 515 (85/80/90/105/95/60) | Abilities: Trace / Download / Analytic
  Engine stats @252 (neutral/positive): Trace: Atk 259/284, SpA 309/339, Spe 219/240 — Download: Atk 259/284, SpA 309/339, Spe 219/240 — Analytic: Atk 259/284, SpA 309/339, Spe 219/240
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Flying Aerial Ace 60P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
  Setup: Agility, Barrier, Charge, Defense Curl, Sharpen
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Gravity, Magic Coat, Pain Split, Protect, Reflect, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

**Quagsire** — species, **RU**, source: imported (natdex)
  Water/Ground | BST 430 (95/85/85/65/65/35) | Abilities: Damp / Water Absorb / Unaware
  Engine stats @252 (neutral/positive): Damp: Atk 269/295, SpA 229/251, Spe 169/185 — Water Absorb: Atk 269/295, SpA 229/251, Spe 169/185 — Unaware: Atk 269/295, SpA 229/251, Spe 169/185
  Item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ice Ice Punch 75P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Tera Blast 80S, Rock Ancient Power 60S, Bug Infestation 20S
  Setup: Amnesia, Defense Curl
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Drain Punch
  Hazards: Spikes, Stealth Rock, Toxic Spikes
  Status: Toxic, Yawn
  Weather/terrain: Hail, Rain Dance, Sandstorm, Snowscape
  Utility: Encore, Haze, Protect, Safeguard, Substitute
  Notable: Encore, Substitute, Focus Punch

**Raichu-Mega-X** — forme, **RU**, source: override
  Electric | BST 585 (60/135/95/90/95/110) | Abilities: Electric Surge
  Engine stats @252 (neutral/positive): Electric Surge: Atk 369/405, SpA 279/306, Spe 319/350
  Item: **Raichunite X** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Raichu (ZU), pre-Mega abilities Static / Lightning Rod, pre-Mega Spe 350 (max +Spe)
  STAB: Electric Rising Voltage 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Grass Grass Knot 60S
  Setup: Agility, Calm Mind, Charge, Defense Curl, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Priority: Extreme Speed 80P Normal (+2), Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3)
  Pivot: Volt Switch
  Status: Nuzzle, Sing, Thunder Wave, Toxic, Yawn
  Cleric: Wish
  Weather/terrain: Electric Terrain, Rain Dance
  Utility: Detect, Encore, Knock Off, Light Screen, Protect, Reflect, Safeguard, Substitute
  Notable: Knock Off, Encore, Substitute, Focus Punch

**Regidrago** — species, **RU**, source: imported (natdex)
  Dragon | BST 580 (200/100/50/100/50/80) | Abilities: Dragon's Maw
  Engine stats @252 (neutral/positive): Dragon's Maw: Atk 299/328, SpA 299/328, Spe 259/284
  Item: **free**
  STAB: Dragon Dragon Energy 150S
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Fighting Hammer Arm 100P, Dark Crunch 80P, Fire Fire Fang 65P, Ice Ice Fang 65P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S, Rock Ancient Power 60S
  Setup: Dragon Dance
  Reliable recovery: Rest
  Utility: Light Screen, Protect, Reflect, Substitute
  Notable: Substitute

**Registeel** — species, **RU**, source: imported (natdex)
  Steel | BST 580 (80/75/150/75/150/50) | Abilities: Clear Body / Light Metal
  Engine stats @252 (neutral/positive): Clear Body: Atk 249/273, SpA 249/273, Spe 199/218 — Light Metal: Atk 249/273, SpA 249/273, Spe 199/218
  Item: **free**
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
  Notable: Substitute, Focus Punch

**Reuniclus** — species, **RU**, source: imported (natdex)
  Psychic | BST 490 (110/65/75/125/85/30) | Abilities: Overcoat / Magic Guard / Regenerator
  Engine stats @252 (neutral/positive): Overcoat: Atk 229/251, SpA 349/383, Spe 159/174 — Magic Guard: Atk 229/251, SpA 349/383, Spe 159/174 — Regenerator: Atk 229/251, SpA 349/383, Spe 159/174
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Steel Steel Roller 130P, Fire Fire Punch 75P, Ice Ice Punch 75P, Rock Rock Slide 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Energy Ball 90S, Steel Flash Cannon 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S
  Setup: Acid Armor, Calm Mind, Iron Defense
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Drain Punch, Dream Eater
  Status: Thunder Wave, Toxic
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Encore, Gravity, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Substitute, Trick Room, Focus Punch

**Revavroom** — species, **RU**, source: imported (natdex)
  Steel/Poison | BST 500 (80/119/90/54/67/90) | Abilities: Overcoat / Filter
  Engine stats @252 (neutral/positive): Overcoat: Atk 337/370, SpA 207/227, Spe 279/306 — Filter: Atk 337/370, SpA 207/227, Spe 279/306
  Item: **free**
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

**Ribombee** — species, **RU**, source: imported (natdex)
  Bug/Fairy | BST 464 (60/55/60/95/70/124) | Abilities: Honey Gather / Shield Dust / Sweet Veil
  Engine stats @252 (neutral/positive): Honey Gather: Atk 209/229, SpA 289/317, Spe 347/381 — Shield Dust: Atk 209/229, SpA 289/317, Spe 347/381 — Sweet Veil: Atk 209/229, SpA 289/317, Spe 347/381
  Item: **free**
  STAB: Bug Bug Buzz 90S · Fairy Moonblast 95S
  Physical coverage: Normal Last Resort 140P, Flying Acrobatics 110P, Dark Thief 60P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Tera Blast 80S
  Setup: Agility, Calm Mind, Quiver Dance
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Absorb, Draining Kiss, Dream Eater, Leech Life
  Hazards: Sticky Web
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Stun Spore, Toxic
  Cleric: Aromatherapy
  Weather/terrain: Sunny Day
  Utility: Light Screen, Protect, Reflect, Safeguard, Substitute, Switcheroo, Tailwind, Trick
  Notable: Trick, Switcheroo, Substitute, Baton Pass, Tailwind

**Roserade** — species, **RU**, source: imported (natdex)
  Grass/Poison | BST 515 (60/70/65/125/105/90) | Abilities: Natural Cure / Poison Point / Technician
  Engine stats @252 (neutral/positive): Natural Cure: Atk 239/262, SpA 349/383, Spe 279/306 — Poison Point: Atk 239/262, SpA 349/383, Spe 279/306 — Technician: Atk 239/262, SpA 349/383, Spe 279/306
  Item: **free**
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Double-Edge 120P, Bug Pin Missile 25x2-5P
  Special coverage: Normal Uproar 90S, Fairy Dazzling Gleam 80S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S, Ground Mud-Slap 20S
  Setup: Growth, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1)
  Hazards: Spikes, Toxic Spikes
  Status: Grass Whistle, Sleep Powder, Stun Spore, Toxic
  Cleric: Aromatherapy, Life Dew
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Leech Seed, Protect, Substitute
  Notable: Substitute

**Sandy Shocks** — species, **RU**, source: imported (natdex)
  Electric/Ground | BST 570 (85/81/97/121/85/101) | Abilities: Protosynthesis
  Engine stats @252 (neutral/positive): Protosynthesis: Atk 261/287, SpA 341/375, Spe 301/331
  Item: **free**
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

**Sceptile-Mega** — forme, **RU**, source: imported (natdex)
  Grass/Dragon | BST 630 (70/110/75/145/85/145) | Abilities: Lightning Rod
  Engine stats @252 (neutral/positive): Lightning Rod: Atk 319/350, SpA 389/427, Spe 389/427
  Item: **Sceptilite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Sceptile (ZU), pre-Mega abilities Overgrow / Unburden, pre-Mega Spe 372 (max +Spe)
  STAB: Grass Leaf Storm 140S · Dragon Outrage 120P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Ground Mud-Slap 20S
  Setup: Agility, Dragon Dance, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Drain Punch, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1), Upper Hand 65P Fighting (+3), Quick Attack 40P Normal (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Shed Tail
  Phazing: Dragon Tail, Roar
  Status: Grass Whistle, Toxic
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Detect, Leech Seed, Protect, Safeguard, Substitute
  Notable: Substitute, Focus Punch

**Scovillain-Mega** — forme, **RU**, source: override
  Grass/Fire | BST 586 (65/138/85/138/85/75) | Abilities: Spicy Spray
  Engine stats @252 (neutral/positive): Spicy Spray: Atk 375/412, SpA 375/412, Spe 249/273
  Item: **Scovillainite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Scovillain (ZU), pre-Mega abilities Chlorophyll / Insomnia / Moody, pre-Mega Spe 273 (max +Spe)
  STAB: Grass Leaf Storm 140S · Fire Overheat 140S
  Physical coverage: Normal Take Down 90P, Dark Crunch 80P, Psychic Zen Headbutt 80P, Ground Stomping Tantrum 75P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S
  Setup: Growth
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain
  Priority: Grassy Glide 70P Grass (+1)
  Status: Will-O-Wisp
  Weather/terrain: Grassy Terrain, Sandstorm, Sunny Day
  Utility: Leech Seed, Protect, Substitute
  Notable: Substitute

**Seismitoad** — species, **RU**, source: imported (natdex)
  Water/Ground | BST 509 (105/95/75/85/75/74) | Abilities: Swift Swim / Poison Touch / Water Absorb
  Engine stats @252 (neutral/positive): Swift Swim: Atk 289/317, SpA 269/295, Spe 247/271 — Poison Touch: Atk 289/317, SpA 269/295, Spe 247/271 — Water Absorb: Atk 289/317, SpA 269/295, Spe 247/271
  Item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Grass Power Whip 120P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P, Ice Ice Punch 75P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Hyper Voice 90S, Grass Grass Knot 60S, Ice Icy Wind 55S, Bug Infestation 20S
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Hazards: Stealth Rock
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute, Focus Punch

**Sharpedo** — species, **RU**, source: imported (natdex)
  Water/Dark | BST 460 (70/120/40/95/40/95) | Abilities: Rough Skin / Speed Boost
  Engine stats @252 (neutral/positive): Rough Skin: Atk 339/372, SpA 289/317, Spe 289/317 — Speed Boost: Atk 339/372, SpA 289/317, Spe 289/317
  Item: **free**
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

**Sigilyph** — species, **RU**, source: imported (natdex)
  Psychic/Flying | BST 490 (72/58/80/103/80/97) | Abilities: Wonder Skin / Magic Guard / Tinted Lens
  Engine stats @252 (neutral/positive): Wonder Skin: Atk 215/236, SpA 305/335, Spe 293/322 — Magic Guard: Atk 215/236, SpA 305/335, Spe 293/322 — Tinted Lens: Atk 215/236, SpA 305/335, Spe 293/322
  Item: **free**
  STAB: Psychic Future Sight 120S · Flying Air Slash 75S
  Physical coverage: Normal Return 102P, Steel Steel Wing 70P, Dark Thief 60P, Rock Smack Down 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Fire Heat Wave 100S, Ice Ice Beam 95S, Dark Dark Pulse 80S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S
  Setup: Calm Mind, Cosmic Power
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Dream Eater
  Removal: Defog
  Phazing: Whirlwind
  Status: Hypnosis, Thunder Wave, Toxic
  Weather/terrain: Rain Dance
  Utility: Gravity, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Tailwind, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room, Tailwind

**Sinistcha** — species, **RU**, source: imported (natdex)
  Grass/Ghost | BST 508 (71/60/106/121/80/70) | Abilities: Hospitality / Heatproof
  Engine stats @252 (neutral/positive): Hospitality: Atk 219/240, SpA 341/375, Spe 239/262 — Heatproof: Atk 219/240, SpA 341/375, Spe 239/262
  Item: **free**
  STAB: Grass Leaf Storm 140S · Ghost Shadow Ball 80S
  Physical coverage: Dark Foul Play 95P
  Special coverage: Normal Uproar 90S, Water Scald 80S
  Setup: Calm Mind, Iron Defense, Nasty Plot, Withdraw
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Giga Drain, Matcha Gotcha, Mega Drain
  Status: Stun Spore
  Cleric: Life Dew
  Weather/terrain: Grassy Terrain
  Utility: Memento, Pain Split, Protect, Reflect, Substitute, Trick Room
  Notable: Substitute, Trick Room

**Sirfetch’d** — species, **RU**, source: imported (natdex)
  Fighting | BST 507 (62/135/95/68/82/65) | Abilities: Steadfast / Scrappy
  Engine stats @252 (neutral/positive): Steadfast: Atk 369/405, SpA 235/258, Spe 229/251 — Scrappy: Atk 369/405, SpA 235/258, Spe 229/251
  Item: **free**
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
  Cleric: Wish
  Weather/terrain: Sunny Day
  Utility: Detect, Knock Off, Protect, Reflect, Substitute, Tailwind
  Notable: Knock Off, Substitute, Baton Pass, Tailwind

**Skeledirge** — species, **RU**, source: imported (natdex)
  Fire/Ghost | BST 530 (104/75/100/110/75/66) | Abilities: Blaze / Unaware
  Engine stats @252 (neutral/positive): Blaze: Atk 249/273, SpA 319/350, Spe 231/254 — Unaware: Atk 249/273, SpA 319/350, Spe 231/254
  Item: **free**
  STAB: Fire Overheat 140S · Ghost Poltergeist 110P
  Physical coverage: Dragon Outrage 120P, Ground Earthquake 100P, Normal Take Down 90P, Dark Crunch 80P, Grass Seed Bomb 80P, Psychic Zen Headbutt 80P
  Special coverage: Poison Belch 120S, Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Normal Hyper Voice 90S, Fairy Alluring Voice 80S, Dark Snarl 55S
  Reliable recovery: Rest, Slack Off
  Phazing: Roar
  Status: Sing, Will-O-Wisp, Yawn
  Weather/terrain: Sunny Day
  Utility: Encore, Protect, Substitute
  Notable: Encore, Substitute

**Slither Wing** — species, **RU**, source: imported (natdex)
  Bug/Fighting | BST 570 (85/135/79/85/105/81) | Abilities: Protosynthesis
  Engine stats @252 (neutral/positive): Protosynthesis: Atk 369/405, SpA 269/295, Spe 261/287
  Item: **free**
  STAB: Bug First Impression 90P · Fighting Close Combat 120P
  Physical coverage: Normal Double-Edge 120P, Fire Flare Blitz 120P, Flying Acrobatics 110P, Ground Earthquake 100P, Electric Wild Charge 90P, Psychic Zen Headbutt 80P
  Special coverage: Flying Hurricane 120S, Fire Heat Wave 100S, Normal Tera Blast 80S, Grass Giga Drain 75S
  Setup: Bulk Up
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain, Leech Life
  Priority: First Impression 90P Bug (+2)
  Pivot: U-turn
  Phazing: Whirlwind
  Status: Poison Powder, Stun Spore, Will-O-Wisp
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute

**Slurpuff** — species, **RU**, source: imported (natdex)
  Fairy | BST 480 (82/80/86/85/75/72) | Abilities: Sweet Veil / Unburden
  Engine stats @252 (neutral/positive): Sweet Veil: Atk 259/284, SpA 269/295, Spe 243/267 — Unburden: Atk 259/284, SpA 269/295, Spe 243/267
  Item: **free**
  STAB: Fairy Misty Explosion 100S
  Physical coverage: Normal Return 102P, Fighting Drain Punch 75P, Dark Thief 60P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Fire Flamethrower 95S, Water Surf 95S, Grass Energy Ball 90S, Normal Hidden Power 60S
  Setup: Amnesia, Calm Mind, Cotton Guard
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Draining Kiss, Dream Eater
  Hazards: Sticky Web
  Status: Toxic, Yawn
  Cleric: Aromatherapy, Heal Bell, Wish
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Light Screen, Magic Coat, Protect, Safeguard, Substitute
  Notable: Substitute

**Steelix** — species, **RU**, source: imported (natdex)
  Steel/Ground | BST 510 (75/85/200/55/65/30) | Abilities: Rock Head / Sturdy / Sheer Force
  Engine stats @252 (neutral/positive): Rock Head: Atk 269/295, SpA 209/229, Spe 159/174 — Sturdy: Atk 269/295, SpA 209/229, Spe 159/174 — Sheer Force: Atk 269/295, SpA 209/229, Spe 159/174
  Item: **free**
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

**Steelix-Mega** — forme, **RU**, source: imported (natdex)
  Steel/Ground | BST 610 (75/125/230/55/95/30) | Abilities: Sand Force
  Engine stats @252 (neutral/positive): Sand Force: Atk 349/383, SpA 209/229, Spe 159/174
  Item: **Steelixite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Steelix (RU), pre-Mega abilities Rock Head / Sturdy / Sheer Force, pre-Mega Spe 174 (max +Spe)
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

**Suicune** — species, **RU**, source: imported (natdex)
  Water | BST 580 (100/75/115/90/115/85) | Abilities: Pressure / Inner Focus / Water Absorb
  Engine stats @252 (neutral/positive): Pressure: Atk 249/273, SpA 279/306, Spe 269/295 — Inner Focus: Atk 249/273, SpA 279/306, Spe 269/295 — Water Absorb: Atk 249/273, SpA 279/306, Spe 269/295
  Item: **free**
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

**Swellow** — species, **RU**, source: imported (natdex)
  Normal/Flying | BST 455 (60/85/60/75/50/125) | Abilities: Guts / Scrappy
  Engine stats @252 (neutral/positive): Guts: Atk 269/295, SpA 249/273, Spe 349/383 — Scrappy: Atk 269/295, SpA 249/273, Spe 349/383
  Item: **free**
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

**Talonflame** — species, **RU**, source: imported (natdex)
  Fire/Flying | BST 499 (78/81/71/74/69/126) | Abilities: Flame Body / Gale Wings
  Engine stats @252 (neutral/positive): Flame Body: Atk 261/287, SpA 247/271, Spe 351/386 — Gale Wings: Atk 261/287, SpA 247/271, Spe 351/386
  Item: **free**
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

**Tangrowth** — species, **RU**, source: imported (natdex)
  Grass | BST 535 (100/100/125/110/50/50) | Abilities: Chlorophyll / Leaf Guard / Regenerator
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 299/328, SpA 319/350, Spe 199/218 — Leaf Guard: Atk 299/328, SpA 319/350, Spe 199/218 — Regenerator: Atk 299/328, SpA 319/350, Spe 199/218
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Skull Bash 130P, Ground Earthquake 100P, Poison Poison Jab 80P, Fighting Brick Break 75P, Rock Rock Slide 75P, Dark Knock Off 65P
  Special coverage: Fighting Focus Blast 120S, Normal Wring Out 120S, Poison Sludge Bomb 90S, Rock Ancient Power 60S, Electric Shock Wave 60S, Psychic Confusion 50S
  Setup: Amnesia, Growth, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1)
  Status: Poison Powder, Sleep Powder, Stun Spore, Toxic
  Trapping: Block
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Knock Off, Leech Seed, Pain Split, Protect, Reflect, Substitute
  Notable: Knock Off, Substitute

**Tapu Bulu** — species, **RU**, source: imported (natdex)
  Grass/Fairy | BST 570 (70/130/115/85/95/75) | Abilities: Grassy Surge / Telepathy
  Engine stats @252 (neutral/positive): Grassy Surge: Atk 359/394, SpA 269/295, Spe 249/273 — Telepathy: Atk 359/394, SpA 269/295, Spe 249/273
  Item: **free**
  STAB: Grass Wood Hammer 120P · Fairy Dazzling Gleam 80S **(wrong category)**
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Bug Megahorn 120P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground High Horsepower 95P
  Special coverage: Fighting Focus Blast 120S, Normal Hidden Power 60S, Dark Snarl 55S, Psychic Stored Power 20S
  Setup: Bulk Up, Calm Mind, Iron Defense, Swords Dance, Withdraw, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain, Horn Leech, Mega Drain
  Phazing: Roar, Whirlwind
  Status: Toxic
  Trapping: Mean Look
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Disable, Leech Seed, Light Screen, Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Taunt, Substitute, Focus Punch

**Tatsugiri-Curly-Mega** — forme, **RU**, source: override
  Dragon/Water | BST 575 (68/65/90/135/125/92) | Abilities: Commander
  Engine stats @252 (neutral/positive): Commander: Atk 229/251, SpA 369/405, Spe 283/311
  Item: **Tatsugirinite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Tatsugiri (PU), pre-Mega abilities Commander / Storm Drain, pre-Mega Spe 289 (max +Spe)
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

**Tinkaton** — species, **RU**, source: imported (natdex)
  Fairy/Steel | BST 506 (85/75/77/70/105/94) | Abilities: Mold Breaker / Own Tempo / Pickpocket
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 249/273, SpA 239/262, Spe 287/315 — Own Tempo: Atk 249/273, SpA 239/262, Spe 287/315 — Pickpocket: Atk 249/273, SpA 239/262, Spe 287/315
  Item: **free**
  STAB: Fairy Play Rough 90P · Steel Gigaton Hammer 160P
  Physical coverage: Ice Ice Hammer 100P, Rock Stone Edge 100P, Dark Foul Play 95P, Normal Slam 80P, Fighting Brick Break 75P, Bug Skitter Smack 70P
  Special coverage: Normal Tera Blast 80S
  Setup: Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Priority: Feint 50P Normal (+2), Fake Out 40P Normal (+3)
  Hazards: Stealth Rock
  Status: Thunder Wave
  Utility: Encore, Knock Off, Light Screen, Protect, Reflect, Substitute
  Notable: Knock Off, Encore, Substitute

**Togekiss** — species, **RU**, source: imported (natdex)
  Fairy/Flying | BST 545 (85/50/95/120/115/80) | Abilities: Hustle / Serene Grace / Super Luck
  Engine stats @252 (neutral/positive): Hustle: Atk 298/327, SpA 339/372, Spe 259/284 — Serene Grace: Atk 199/218, SpA 339/372, Spe 259/284 — Super Luck: Atk 199/218, SpA 339/372, Spe 259/284
  Item: **free**
  STAB: Fairy Play Rough 90P · Flying Sky Attack 140 (charge)P
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Psychic Zen Headbutt 80P, Steel Smart Strike 70P, Dark Fling 30P, Rock Rollout 30P
  Special coverage: Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Zap Cannon 120S, Grass Solar Beam 120 (charge)S, Fighting Aura Sphere 90S, Normal Hyper Voice 90S
  Setup: Amnesia, Defense Curl, Nasty Plot, Work Up
  Reliable recovery: Rest, Roost, Soft-Boiled
  Drain/Rest-only: Drain Punch, Draining Kiss, Dream Eater
  Priority: Extreme Speed 80P Normal (+2)
  Removal: Defog
  Pivot: Baton Pass
  Status: Thunder Wave, Toxic, Yawn
  Cleric: Heal Bell, Life Dew, Wish
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Encore, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Tailwind, Trick
  Notable: Trick, Encore, Substitute, Baton Pass, Tailwind, Focus Punch

**Tornadus** — species, **RU**, source: override
  Flying | BST 580 (79/115/70/125/80/111) | Abilities: Prankster / Defiant
  Engine stats @252 (neutral/positive): Prankster: Atk 329/361, SpA 349/383, Spe 321/353 — Defiant: Atk 329/361, SpA 349/383, Spe 321/353
  Item: **free**
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

**Torterra** — species, **RU**, source: imported (natdex)
  Grass/Ground | BST 525 (95/109/105/75/85/56) | Abilities: Overgrow / Shell Armor
  Engine stats @252 (neutral/positive): Overgrow: Atk 317/348, SpA 249/273, Spe 211/232 — Shell Armor: Atk 317/348, SpA 249/273, Spe 211/232
  Item: **free**
  STAB: Grass Leaf Storm 140S · Ground Headlong Rush 120P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Dragon Outrage 120P, Fighting Superpower 120P, Rock Stone Edge 100P, Dark Crunch 80P
  Special coverage: Normal Hyper Voice 90S
  Setup: Amnesia, Growth, Iron Defense, Rock Polish, Shell Smash, Swords Dance, Withdraw, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1)
  Hazards: Stealth Rock
  Phazing: Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Grassy Terrain, Sandstorm, Sunny Day
  Utility: Leech Seed, Light Screen, Protect, Reflect, Safeguard, Substitute
  Notable: Substitute

**Toxtricity** — species, **RU**, source: imported (natdex)
  Electric/Poison | BST 502 (75/98/70/114/70/75) | Abilities: Punk Rock / Plus / Technician
  Engine stats @252 (neutral/positive): Punk Rock: Atk 295/324, SpA 327/359, Spe 249/273 — Plus: Atk 295/324, SpA 327/359, Spe 249/273 — Technician: Atk 295/324, SpA 327/359, Spe 249/273
  Item: **free**
  STAB: Electric Thunder 120S · Poison Belch 120S
  Physical coverage: Normal Mega Kick 120P, Dark Throat Chop 80P, Fighting Brick Break 75P, Fire Fire Punch 75P, Grass Trailblaze 50P
  Special coverage: Normal Boomburst 140S, Psychic Psychic Noise 75S, Ghost Hex 65S, Dark Snarl 55S
  Setup: Charge, Shift Gear
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Hazards: Toxic Spikes
  Pivot: Volt Switch
  Status: Nuzzle, Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Rain Dance, Sunny Day
  Utility: Encore, Protect, Substitute, Taunt
  Notable: Encore, Taunt, Substitute

**Toxtricity-Low-Key** — species, **RU**, source: imported (natdex)
  Electric/Poison | BST 502 (75/98/70/114/70/75) | Abilities: Punk Rock / Minus / Technician
  Engine stats @252 (neutral/positive): Punk Rock: Atk 295/324, SpA 327/359, Spe 249/273 — Minus: Atk 295/324, SpA 327/359, Spe 249/273 — Technician: Atk 295/324, SpA 327/359, Spe 249/273
  Item: **free**
  STAB: Electric Thunder 120S · Poison Belch 120S
  Physical coverage: Normal Mega Kick 120P, Dark Throat Chop 80P, Fighting Brick Break 75P, Fire Fire Punch 75P, Grass Trailblaze 50P
  Special coverage: Normal Boomburst 140S, Psychic Psychic Noise 75S, Ghost Hex 65S, Dark Snarl 55S
  Setup: Charge, Shift Gear
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Hazards: Toxic Spikes
  Pivot: Volt Switch
  Status: Nuzzle, Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Rain Dance, Sunny Day
  Utility: Encore, Protect, Substitute, Taunt
  Notable: Encore, Taunt, Substitute

**Umbreon** — species, **RU**, source: imported (natdex)
  Dark | BST 525 (95/65/110/60/130/65) | Abilities: Synchronize / Inner Focus
  Engine stats @252 (neutral/positive): Synchronize: Atk 229/251, SpA 219/240, Spe 229/251 — Inner Focus: Atk 229/251, SpA 219/240, Spe 229/251
  Item: **free**
  STAB: Dark Foul Play 95P
  Physical coverage: Normal Last Resort 140P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Grass Trailblaze 50P
  Special coverage: Normal Trump Card 200S, Psychic Synchronoise 120S, Electric Zap Cannon 120S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Ground Mud-Slap 20S
  Setup: Calm Mind, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Quick Attack 40P Normal (+1)
  Pivot: Baton Pass
  Phazing: Roar
  Status: Sing, Thunder Wave, Toxic, Yawn
  Cleric: Heal Bell, Wish
  Trapping: Mean Look
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Light Screen, Protect, Reflect, Substitute, Taunt
  Notable: Taunt, Substitute, Baton Pass

**Victreebel-Mega** — forme, **RU**, source: override
  Grass/Poison | BST 590 (80/125/85/135/95/70) | Abilities: Innards Out
  Engine stats @252 (neutral/positive): Innards Out: Atk 349/383, SpA 369/405, Spe 239/262
  Item: **Victreebelite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Victreebel (ZU), pre-Mega abilities Chlorophyll / Gluttony, pre-Mega Spe 262 (max +Spe)
  STAB: Grass Leaf Storm 140S · Poison Belch 120S
  Physical coverage: Normal Double-Edge 120P, Bug Leech Life 80P, Dark Sucker Punch 80P
  Special coverage: Normal Wring Out 120S, Bug Infestation 20S
  Setup: Growth, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain, Leech Life, Mega Drain
  Priority: Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1)
  Status: Poison Powder, Sleep Powder, Stun Spore, Toxic
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Clear Smog, Encore, Knock Off, Protect, Reflect, Substitute
  Notable: Knock Off, Encore, Substitute

**Volcanion** — species, **RU**, source: imported (natdex)
  Fire/Water | BST 600 (80/110/120/130/90/70) | Abilities: Water Absorb
  Engine stats @252 (neutral/positive): Water Absorb: Atk 319/350, SpA 359/394, Spe 239/262
  Item: **free**
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

**Weezing-Galar** — species, **RU**, source: imported (natdex)
  Poison/Fairy | BST 490 (65/90/120/85/70/60) | Abilities: Levitate / Neutralizing Gas / Misty Surge
  Engine stats @252 (neutral/positive): Levitate: Atk 279/306, SpA 269/295, Spe 219/240 — Neutralizing Gas: Atk 279/306, SpA 269/295, Spe 219/240 — Misty Surge: Atk 279/306, SpA 269/295, Spe 219/240
  Item: **free**
  STAB: Poison Belch 120S · Fairy Misty Explosion 100S
  Physical coverage: Normal Explosion 250P, Dark Assurance 60P, Rock Rollout 30P, Steel Gyro Ball 24P
  Special coverage: Fire Overheat 140S, Electric Thunder 120S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Psychic Psybeam 65S
  Reliable recovery: Rest
  Hazards: Toxic Spikes
  Removal: Defog
  Status: Toxic, Will-O-Wisp
  Cleric: Aromatherapy
  Weather/terrain: Misty Terrain, Rain Dance, Sunny Day
  Utility: Clear Smog, Destiny Bond, Haze, Memento, Pain Split, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Yanmega** — species, **RU**, source: imported (natdex)
  Bug/Flying | BST 515 (86/76/86/116/56/95) | Abilities: Speed Boost / Tinted Lens / Frisk
  Engine stats @252 (neutral/positive): Speed Boost: Atk 251/276, SpA 331/364, Spe 289/317 — Tinted Lens: Atk 251/276, SpA 331/364, Spe 289/317 — Frisk: Atk 251/276, SpA 331/364, Spe 289/317
  Item: **free**
  STAB: Bug Bug Buzz 90S · Flying Dual Wingbeat 50x2P
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Steel Steel Wing 70P, Fighting Reversal 20P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Uproar 90S, Ghost Shadow Ball 80S, Rock Ancient Power 60S, Ground Mud-Slap 20S
  Setup: Swords Dance
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Dream Eater, Giga Drain, Leech Life
  Priority: Feint 50P Normal (+2), Quick Attack 40P Normal (+1)
  Removal: Defog
  Pivot: U-turn
  Phazing: Whirlwind
  Status: Hypnosis, Toxic
  Weather/terrain: Sunny Day
  Utility: Detect, Protect, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Zarude** — species, **RU**, source: imported (natdex)
  Dark/Grass | BST 600 (105/120/105/70/95/105) | Abilities: Leaf Guard
  Engine stats @252 (neutral/positive): Leaf Guard: Atk 339/372, SpA 239/262, Spe 309/339
  Item: **free**
  STAB: Dark Darkest Lariat 85P · Grass Solar Blade 125 (charge)P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Rock Rock Slide 75P
  Special coverage: Normal Hyper Voice 90S, Ground Mud Shot 55S
  Setup: Bulk Up, Growth, Nasty Plot, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Giga Drain
  Priority: Grassy Glide 70P Grass (+1)
  Pivot: U-turn
  Phazing: Roar
  Cleric: Jungle Healing
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Encore, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Encore, Taunt, Substitute, Focus Punch

**Zygarde-10%** — species, **RU**, source: imported (natdex)
  Dragon/Ground | BST 486 (54/100/71/61/85/115) | Abilities: Aura Break / Power Construct
  Engine stats @252 (neutral/positive): Aura Break: Atk 299/328, SpA 221/243, Spe 329/361 — Power Construct: Atk 299/328, SpA 221/243, Spe 329/361
  Item: **free**
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

## D. Full NU comparison profiles

All **67** current NU entries, same format — this is what a downward
move is measured against. **NU contains no `estimated` formes.**

**Abomasnow-Mega** — forme, **NU**, source: imported (natdex-RU refined by gen7)
  Grass/Ice | BST 594 (90/132/105/132/105/30) | Abilities: Snow Warning
  Engine stats @252 (neutral/positive): Snow Warning: Atk 363/399, SpA 363/399, Spe 159/174
  Item: **Abomasite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Abomasnow (ZU), pre-Mega abilities Snow Warning / Soundproof, pre-Mega Spe 240 (max +Spe)
  STAB: Grass Leaf Storm 140S · Ice Blizzard 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Hard Press 100P, Dark Fling 80P
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Water Water Pulse 60S
  Setup: Growth, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain
  Priority: Grassy Glide 70P Grass (+1), Ice Shard 40P Ice (+1)
  Status: Grass Whistle, Toxic
  Trapping: Block
  Weather/terrain: Hail, Rain Dance, Snowscape
  Utility: Aurora Veil, Leech Seed, Light Screen, Protect, Safeguard, Substitute
  Notable: Substitute, Focus Punch

**Aerodactyl** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Rock/Flying | BST 515 (80/105/65/60/75/130) | Abilities: Rock Head / Pressure / Unnerve
  Engine stats @252 (neutral/positive): Rock Head: Atk 309/339, SpA 219/240, Spe 359/394 — Pressure: Atk 309/339, SpA 219/240, Spe 359/394 — Unnerve: Atk 309/339, SpA 219/240, Spe 359/394
  Item: **free**
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

**Aggron** — species, **NU**, source: override
  Steel/Rock | BST 530 (70/110/180/60/60/50) | Abilities: Sturdy / Rock Head / Heavy Metal
  Engine stats @252 (neutral/positive): Sturdy: Atk 319/350, SpA 219/240, Spe 199/218 — Rock Head: Atk 319/350, SpA 219/240, Spe 199/218 — Heavy Metal: Atk 319/350, SpA 219/240, Spe 199/218
  Item: **free**
  STAB: Steel Steel Roller 130P · Rock Head Smash 150P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Dark Crunch 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S
  Setup: Autotomize, Defense Curl, Harden, Hone Claws, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Dragon Tail, Roar
  Status: Thunder Wave, Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute, Focus Punch

**Altaria** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Dragon/Flying | BST 490 (75/70/90/70/105/80) | Abilities: Natural Cure / Cloud Nine
  Engine stats @252 (neutral/positive): Natural Cure: Atk 239/262, SpA 239/262, Spe 259/284 — Cloud Nine: Atk 239/262, SpA 239/262, Spe 259/284
  Item: **free**
  STAB: Dragon Draco Meteor 140S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fairy Play Rough 90P, Dark Thief 60P, Grass Trailblaze 50P
  Special coverage: Fire Fire Blast 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ice Ice Beam 95S, Fairy Moonblast 95S, Normal Hyper Voice 90S
  Setup: Agility, Cotton Guard, Dragon Dance, Hone Claws
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Dream Eater
  Removal: Defog
  Phazing: Roar
  Status: Sing, Toxic, Will-O-Wisp
  Cleric: Heal Bell
  Weather/terrain: Rain Dance, Snowscape, Sunny Day
  Utility: Haze, Perish Song, Protect, Safeguard, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Araquanid** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water/Bug | BST 454 (68/70/92/50/132/42) | Abilities: Water Bubble / Water Absorb
  Engine stats @252 (neutral/positive): Water Bubble: Atk 239/262, SpA 199/218, Spe 183/201 — Water Absorb: Atk 239/262, SpA 199/218, Spe 183/201
  Item: **free**
  STAB: Water Hydro Pump 120S · Bug Bug Buzz 90S
  Physical coverage: Normal Return 102P, Dark Crunch 80P, Poison Poison Jab 80P, Grass Trailblaze 50P
  Special coverage: Ice Blizzard 120S, Normal Tera Blast 80S, Grass Giga Drain 75S, Psychic Mirror Coat fixedS
  Setup: Iron Defense
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain, Leech Life
  Hazards: Sticky Web
  Status: Toxic
  Trapping: Spider Web
  Weather/terrain: Rain Dance
  Utility: Magic Coat, Protect, Reflect, Safeguard, Substitute
  Notable: Substitute

**Arcanine** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Fire | BST 555 (90/110/80/100/80/95) | Abilities: Intimidate / Flash Fire / Justified
  Engine stats @252 (neutral/positive): Intimidate: Atk 319/350, SpA 299/328, Spe 289/317 — Flash Fire: Atk 319/350, SpA 299/328, Spe 289/317 — Justified: Atk 319/350, SpA 299/328, Spe 289/317
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P
  Special coverage: Grass Solar Beam 120 (charge)S, Dragon Dragon Pulse 90S, Normal Hyper Voice 90S, Ground Scorching Sands 70S, Dark Snarl 55S
  Setup: Agility
  Reliable recovery: Rest
  Priority: Extreme Speed 80P Normal (+2)
  Pivot: Teleport
  Phazing: Roar
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Protect, Reflect, Safeguard, Substitute
  Notable: Substitute

**Articuno-Galar** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Psychic/Flying | BST 580 (90/85/85/125/100/95) | Abilities: Competitive
  Engine stats @252 (neutral/positive): Competitive: Atk 269/295, SpA 349/383, Spe 289/317
  Item: **free**
  STAB: Psychic Future Sight 120S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Ice Ice Spinner 80P, Steel Steel Wing 70P, Bug U-turn 70P, Fighting Rock Smash 40P
  Special coverage: Ice Blizzard 120S, Normal Hyper Voice 90S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Water Bubble Beam 65S, Rock Ancient Power 60S
  Setup: Agility, Calm Mind
  Reliable recovery: Recover, Rest, Roost
  Drain/Rest-only: Dream Eater
  Priority: Ice Shard 40P Ice (+1)
  Removal: Defog
  Pivot: U-turn
  Phazing: Roar, Whirlwind
  Status: Hypnosis, Toxic
  Cleric: Heal Bell
  Weather/terrain: Hail, Rain Dance, Sandstorm, Snowscape, Sunny Day
  Utility: Aurora Veil, Detect, Haze, Light Screen, Protect, Reflect, Substitute, Tailwind, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room, Tailwind

**Avalugg** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Ice | BST 514 (95/117/184/44/46/28) | Abilities: Own Tempo / Ice Body / Sturdy
  Engine stats @252 (neutral/positive): Own Tempo: Atk 333/366, SpA 187/205, Spe 155/170 — Ice Body: Atk 333/366, SpA 187/205, Spe 155/170 — Sturdy: Atk 333/366, SpA 187/205, Spe 155/170
  Item: **free**
  STAB: Ice Icicle Crash 85P
  Physical coverage: Normal Skull Bash 130P, Steel Heavy Slam 120P, Fighting Superpower 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Crunch 80P
  Special coverage: Water Hydro Pump 120S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Psychic Mirror Coat fixedS
  Setup: Barrier, Harden, Iron Defense, Rock Polish, Sharpen
  Reliable recovery: Recover, Rest
  Removal: Rapid Spin
  Phazing: Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Hail, Rain Dance, Snowscape
  Utility: Aurora Veil, Protect, Safeguard, Substitute
  Notable: Substitute

**Basculegion** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water/Ghost | BST 530 (120/112/65/80/75/78) | Abilities: Swift Swim / Adaptability / Mold Breaker
  Engine stats @252 (neutral/positive): Swift Swim: Atk 323/355, SpA 259/284, Spe 255/280 — Adaptability: Atk 323/355, SpA 259/284, Spe 255/280 — Mold Breaker: Atk 323/355, SpA 259/284, Spe 255/280
  Item: **free**
  STAB: Water Hydro Pump 120S · Ghost Phantom Force 90 (charge)P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Fighting Superpower 120P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Ground Mud Shot 55S, Fighting Final Gambit fixedS
  Setup: Agility
  Reliable recovery: Rest
  Priority: Aqua Jet 40P Water (+1)
  Pivot: Flip Turn
  Status: Toxic
  Weather/terrain: Hail, Rain Dance, Snowscape
  Utility: Pain Split, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Bellibolt** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 495 (109/64/91/103/83/45) | Abilities: Electromorphosis / Static / Damp
  Engine stats @252 (neutral/positive): Electromorphosis: Atk 227/249, SpA 305/335, Spe 189/207 — Static: Atk 227/249, SpA 305/335, Spe 189/207 — Damp: Atk 227/249, SpA 305/335, Spe 189/207
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Dark Sucker Punch 80P, Normal Tackle 50P
  Special coverage: Water Muddy Water 95S, Normal Hyper Voice 90S, Ground Mud Shot 55S, Poison Acid Spray 40S
  Setup: Charge
  Reliable recovery: Rest, Slack Off
  Drain/Rest-only: Parabolic Charge
  Priority: Sucker Punch 80P Dark (+1)
  Pivot: Volt Switch
  Status: Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Rain Dance
  Utility: Light Screen, Protect, Reflect, Substitute
  Notable: Substitute

**Brambleghast** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Grass/Ghost | BST 480 (55/115/70/80/70/90) | Abilities: Wind Rider / Infiltrator
  Engine stats @252 (neutral/positive): Wind Rider: Atk 329/361, SpA 259/284, Spe 279/306 — Infiltrator: Atk 329/361, SpA 259/284, Spe 279/306
  Item: **free**
  STAB: Grass Leaf Storm 140S · Ghost Poltergeist 110P
  Physical coverage: Normal Facade 70P, Bug Skitter Smack 70P, Dark Thief 60P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S, Bug Infestation 20S
  Setup: Defense Curl
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1), Shadow Sneak 40P Ghost (+1)
  Hazards: Spikes
  Removal: Rapid Spin
  Trapping: Block
  Weather/terrain: Grassy Terrain
  Utility: Disable, Leech Seed, Pain Split, Protect, Substitute
  Notable: Substitute

**Braviary** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Normal/Flying | BST 510 (100/123/75/57/75/80) | Abilities: Keen Eye / Sheer Force / Defiant
  Engine stats @252 (neutral/positive): Keen Eye: Atk 345/379, SpA 213/234, Spe 259/284 — Sheer Force: Atk 345/379, SpA 213/234, Spe 259/284 — Defiant: Atk 345/379, SpA 213/234, Spe 259/284
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Fighting Close Combat 120P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Rock Rock Slide 75P, Ghost Shadow Claw 70P, Bug U-turn 70P
  Special coverage: Fire Heat Wave 100S
  Setup: Agility, Bulk Up, Hone Claws, Work Up
  Reliable recovery: Rest, Roost
  Removal: Defog
  Pivot: U-turn
  Phazing: Whirlwind
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Bronzong** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Steel/Psychic | BST 500 (67/89/116/79/116/33) | Abilities: Levitate / Heatproof / Heavy Metal
  Engine stats @252 (neutral/positive): Levitate: Atk 277/304, SpA 257/282, Spe 165/181 — Heatproof: Atk 277/304, SpA 257/282, Spe 165/181 — Heavy Metal: Atk 277/304, SpA 257/282, Spe 165/181
  Item: **free**
  STAB: Steel Steel Beam 140S · Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Fighting Body Press 80P, Ice Ice Spinner 80P, Rock Rock Blast 25x2-5P, Dark Feint Attack 60P
  Special coverage: Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Electric Charge Beam 50S
  Setup: Calm Mind, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Hazards: Stealth Rock
  Status: Hypnosis, Toxic
  Trapping: Block
  Weather/terrain: Psychic Terrain, Rain Dance, Sandstorm, Sunny Day
  Utility: Gravity, Light Screen, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

**Cinccino** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 470 (75/95/60/65/60/115) | Abilities: Cute Charm / Technician / Skill Link
  Engine stats @252 (neutral/positive): Cute Charm: Atk 289/317, SpA 229/251, Spe 329/361 — Technician: Atk 289/317, SpA 229/251, Spe 329/361 — Skill Link: Atk 289/317, SpA 229/251, Spe 329/361
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Water Aqua Tail 90P, Fairy Play Rough 90P, Ice Ice Spinner 80P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Fairy Alluring Voice 80S, Grass Grass Knot 60S, Water Chilling Water 50S, Ground Mud-Slap 20S
  Setup: Calm Mind, Work Up
  Reliable recovery: Rest
  Removal: Tidy Up
  Pivot: Baton Pass, U-turn
  Status: Sing, Thunder Wave, Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Encore, Knock Off, Light Screen, Protect, Safeguard, Substitute
  Notable: Knock Off, Encore, Substitute, Baton Pass

**Decidueye** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Grass/Ghost | BST 530 (78/107/75/100/100/70) | Abilities: Overgrow / Long Reach
  Engine stats @252 (neutral/positive): Overgrow: Atk 313/344, SpA 299/328, Spe 239/262 — Long Reach: Atk 313/344, SpA 299/328, Spe 239/262
  Item: **free**
  STAB: Grass Leaf Storm 140S · Ghost Poltergeist 110P
  Physical coverage: Flying Sky Attack 140 (charge)P, Normal Return 102P, Dark Sucker Punch 80P, Psychic Psycho Cut 70P, Bug Skitter Smack 70P, Steel Steel Wing 70P
  Special coverage: Flying Hurricane 120S, Normal Tera Blast 80S
  Setup: Nasty Plot, Swords Dance, Work Up
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Giga Drain
  Priority: Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1), Shadow Sneak 40P Ghost (+1)
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Trapping: Spirit Shackle
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Haze, Knock Off, Light Screen, Protect, Safeguard, Substitute, Tailwind
  Notable: Knock Off, Substitute, Baton Pass, Tailwind

**Decidueye-Hisui** — species, **NU**, source: override
  Grass/Fighting | BST 530 (88/112/80/95/95/60) | Abilities: Overgrow / Scrappy
  Engine stats @252 (neutral/positive): Overgrow: Atk 323/355, SpA 289/317, Spe 219/240 — Scrappy: Atk 323/355, SpA 289/317, Spe 219/240
  Item: **free**
  STAB: Grass Leaf Storm 140S · Fighting Focus Punch 150P
  Physical coverage: Flying Sky Attack 140 (charge)P, Ghost Poltergeist 110P, Normal Return 102P, Dark Sucker Punch 80P, Psychic Psycho Cut 70P, Bug Skitter Smack 70P
  Special coverage: Flying Hurricane 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S
  Setup: Bulk Up, Nasty Plot, Swords Dance, Work Up
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Giga Drain
  Priority: Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1), Upper Hand 65P Fighting (+3), Shadow Sneak 40P Ghost (+1)
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Trapping: Spirit Shackle
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Haze, Knock Off, Light Screen, Protect, Safeguard, Substitute, Tailwind, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass, Tailwind, Focus Punch

**Dhelmise** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Ghost/Grass | BST 517 (70/131/100/86/90/40) | Abilities: Steelworker
  Engine stats @252 (neutral/positive): Steelworker: Atk 361/397, SpA 271/298, Spe 179/196
  Item: **free**
  STAB: Ghost Poltergeist 110P · Grass Solar Blade 125 (charge)P
  Physical coverage: Steel Steel Roller 130P, Normal Return 102P, Ground Earthquake 100P, Water Liquidation 85P, Fighting Body Press 80P, Rock Rock Slide 75P
  Special coverage: Water Hydro Pump 120S, Poison Sludge Wave 95S, Steel Flash Cannon 80S, Normal Hidden Power 60S
  Setup: Growth, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1)
  Removal: Rapid Spin
  Status: Toxic
  Trapping: Anchor Shot, Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Knock Off, Pain Split, Protect, Substitute, Switcheroo
  Notable: Knock Off, Switcheroo, Substitute

**Doublade** — species, **NU**, source: override
  Steel/Ghost | BST 448 (59/110/150/45/49/35) | Abilities: No Guard
  Engine stats @252 (neutral/positive): No Guard: Atk 319/350, SpA 189/207, Spe 169/185
  Item: **free**
  STAB: Steel Iron Head 80P · Ghost Shadow Claw 70P
  Physical coverage: Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Return 102P, Rock Rock Slide 75P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Normal Hidden Power 60S, Electric Shock Wave 60S
  Setup: Autotomize, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Priority: Shadow Sneak 40P Ghost (+1)
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance
  Utility: Destiny Bond, Protect, Reflect, Substitute
  Notable: Substitute

**Dragalge** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Poison/Dragon | BST 494 (65/75/90/97/123/44) | Abilities: Poison Point / Poison Touch / Adaptability
  Engine stats @252 (neutral/positive): Poison Point: Atk 249/273, SpA 293/322, Spe 187/205 — Poison Touch: Atk 249/273, SpA 293/322, Spe 187/205 — Adaptability: Atk 249/273, SpA 293/322, Spe 187/205
  Item: **free**
  STAB: Poison Gunk Shot 120P · Dragon Draco Meteor 140S
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

**Drampa** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Normal/Dragon | BST 485 (78/60/85/135/91/36) | Abilities: Berserk / Sap Sipper / Cloud Nine
  Engine stats @252 (neutral/positive): Berserk: Atk 219/240, SpA 369/405, Spe 171/188 — Sap Sipper: Atk 219/240, SpA 369/405, Spe 171/188 — Cloud Nine: Atk 219/240, SpA 369/405, Spe 171/188
  Item: **free**
  STAB: Normal Hyper Voice 90S · Dragon Draco Meteor 140S
  Physical coverage: Fighting Superpower 120P, Ground Earthquake 100P, Fairy Play Rough 90P, Flying Fly 90 (charge)P, Dark Lash Out 75P, Rock Rock Slide 75P
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

**Drapion** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Poison/Dark | BST 500 (70/90/110/60/75/95) | Abilities: Battle Armor / Sniper / Keen Eye
  Engine stats @252 (neutral/positive): Battle Armor: Atk 279/306, SpA 219/240, Spe 289/317 — Sniper: Atk 279/306, SpA 219/240, Spe 289/317 — Keen Eye: Atk 279/306, SpA 219/240, Spe 289/317
  Item: **free**
  STAB: Poison Sludge Bomb 90S · Dark Crunch 80P
  Physical coverage: Normal Return 102P, Ground Earthquake 100P, Steel Iron Tail 100P, Bug Twineedle 50x2P, Water Aqua Tail 90P, Fighting Brick Break 75P
  Special coverage: Bug Bug Buzz 90S, Ghost Shadow Ball 80S, Normal Hidden Power 60S, Ground Mud-Slap 20S
  Setup: Agility, Hone Claws, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Leech Life
  Hazards: Toxic Spikes
  Phazing: Roar, Whirlwind
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Drednaw** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water/Rock | BST 485 (90/115/90/48/68/74) | Abilities: Strong Jaw / Shell Armor / Swift Swim
  Engine stats @252 (neutral/positive): Strong Jaw: Atk 329/361, SpA 195/214, Spe 247/271 — Shell Armor: Atk 329/361, SpA 195/214, Spe 247/271 — Swift Swim: Atk 329/361, SpA 195/214, Spe 247/271
  Item: **free**
  STAB: Water Liquidation 85P · Rock Head Smash 150P
  Physical coverage: Normal Skull Bash 130P, Bug Megahorn 120P, Fighting Superpower 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P
  Special coverage: Ice Blizzard 120S, Ground Earth Power 90S, Normal Tera Blast 80S
  Setup: Iron Defense, Rock Polish, Shell Smash, Swords Dance
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Dragon Tail
  Trapping: Jaw Lock
  Weather/terrain: Rain Dance, Sandstorm
  Utility: Protect, Substitute
  Notable: Substitute

**Dudunsparce** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 520 (125/100/80/85/75/55) | Abilities: Serene Grace / Run Away / Rattled
  Engine stats @252 (neutral/positive): Serene Grace: Atk 299/328, SpA 269/295, Spe 209/229 — Run Away: Atk 299/328, SpA 269/295, Spe 209/229 — Rattled: Atk 299/328, SpA 269/295, Spe 209/229
  Item: **free**
  STAB: Normal Trump Card 200S
  Physical coverage: Dragon Outrage 120P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Flying Hurricane 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S
  Setup: Agility, Amnesia, Calm Mind, Coil, Defense Curl
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Dream Eater
  Hazards: Stealth Rock
  Pivot: Baton Pass
  Phazing: Dragon Tail
  Status: Glare, Thunder Wave, Toxic, Yawn
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Magic Coat, Pain Split, Protect, Substitute, Tailwind
  Notable: Substitute, Baton Pass, Tailwind

**Escavalier** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Bug/Steel | BST 495 (70/135/105/60/105/20) | Abilities: Swarm / Shell Armor / Overcoat
  Engine stats @252 (neutral/positive): Swarm: Atk 369/405, SpA 219/240, Spe 139/152 — Shell Armor: Atk 369/405, SpA 219/240, Spe 139/152 — Overcoat: Atk 369/405, SpA 219/240, Spe 139/152
  Item: **free**
  STAB: Bug Megahorn 120P · Steel Iron Head 80P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Ground Drill Run 80P, Poison Poison Jab 80P, Water Razor Shell 75P, Dark Night Slash 70P
  Special coverage: Fighting Focus Blast 120S, Grass Energy Ball 90S, Normal Hidden Power 60S, Poison Acid Spray 40S
  Setup: Agility, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain
  Status: Toxic
  Weather/terrain: Rain Dance
  Utility: Encore, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Encore, Taunt, Substitute

**Espeon** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Psychic | BST 525 (65/65/60/130/95/110) | Abilities: Synchronize / Magic Bounce
  Engine stats @252 (neutral/positive): Synchronize: Atk 229/251, SpA 359/394, Spe 319/350 — Magic Bounce: Atk 229/251, SpA 359/394, Spe 319/350
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Bite 60P, Grass Trailblaze 50P
  Special coverage: Normal Trump Card 200S, Electric Zap Cannon 120S, Fairy Alluring Voice 80S, Rock Power Gem 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
  Setup: Calm Mind, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss, Dream Eater
  Priority: Quick Attack 40P Normal (+1)
  Pivot: Baton Pass
  Phazing: Roar
  Status: Sing, Thunder Wave, Toxic, Yawn
  Cleric: Heal Bell, Wish
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Detect, Gravity, Light Screen, Magic Coat, Protect, Reflect, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Baton Pass, Trick Room

**Exploud** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Normal | BST 490 (104/91/63/91/73/68) | Abilities: Soundproof / Scrappy
  Engine stats @252 (neutral/positive): Soundproof: Atk 281/309, SpA 281/309, Spe 235/258 — Scrappy: Atk 281/309, SpA 281/309, Spe 235/258
  Item: **free**
  STAB: Normal Boomburst 140S
  Physical coverage: Dragon Outrage 120P, Fighting Dynamic Punch 100P, Ground Earthquake 100P, Dark Crunch 80P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Fire Overheat 140S, Ice Blizzard 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Psychic Synchronoise 120S, Grass Solar Beam 120 (charge)S
  Setup: Defense Curl, Work Up
  Reliable recovery: Rest
  Phazing: Circle Throw, Roar, Whirlwind
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Flamigo** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Flying/Fighting | BST 500 (82/115/74/75/64/90) | Abilities: Scrappy / Tangled Feet / Costar
  Engine stats @252 (neutral/positive): Scrappy: Atk 329/361, SpA 249/273, Spe 279/306 — Tangled Feet: Atk 329/361, SpA 249/273, Spe 279/306 — Costar: Atk 329/361, SpA 249/273, Spe 279/306
  Item: **free**
  STAB: Flying Sky Attack 140 (charge)P · Fighting Close Combat 120P
  Physical coverage: Normal Mega Kick 120P, Water Liquidation 85P, Bug Lunge 80P, Dark Throat Chop 80P
  Special coverage: Normal Tera Blast 80S, Water Water Pulse 60S
  Setup: Agility, Bulk Up, Swords Dance
  Reliable recovery: Rest, Roost
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2)
  Pivot: U-turn
  Utility: Detect, Protect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Flygon** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Ground/Dragon | BST 520 (80/100/80/80/80/100) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 299/328, SpA 259/284, Spe 299/328
  Item: **free**
  STAB: Ground Earthquake 100P · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Flying Dual Wingbeat 50x2P, Steel Iron Tail 100P, Rock Stone Edge 100P, Bug First Impression 90P
  Special coverage: Normal Boomburst 140S, Fire Fire Blast 120S, Grass Solar Beam 120 (charge)S, Bug Bug Buzz 90S, Fairy Alluring Voice 80S, Flying Air Slash 75S
  Setup: Agility, Dragon Dance, Hone Claws
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Giga Drain
  Priority: First Impression 90P Bug (+2), Feint 50P Normal (+2), Quick Attack 40P Normal (+1), Vacuum Wave 40S Fighting (+1)
  Hazards: Stealth Rock
  Removal: Defog
  Pivot: U-turn
  Phazing: Dragon Tail
  Status: Toxic
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Protect, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Glalie-Mega** — forme, **NU**, source: imported (natdex-RU refined by gen7)
  Ice | BST 580 (80/120/80/120/80/100) | Abilities: Refrigerate
  Engine stats @252 (neutral/positive): Refrigerate: Atk 339/372, SpA 339/372, Spe 299/328
  Item: **Glalitite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Glalie (ZU), pre-Mega abilities Inner Focus / Ice Body / Moody, pre-Mega Spe 284 (max +Spe)
  STAB: Ice Explosion 325P
  Physical coverage: Steel Steel Roller 130P, Ground Earthquake 100P, Dark Foul Play 95P, Grass Trailblaze 50P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Water Water Pulse 60S
  Setup: Defense Curl
  Reliable recovery: Rest
  Priority: Ice Shard 40P Ice (+1)
  Hazards: Spikes
  Status: Sing, Toxic
  Trapping: Block
  Weather/terrain: Hail, Rain Dance, Snowscape
  Utility: Disable, Light Screen, Protect, Safeguard, Substitute, Switcheroo, Taunt
  Notable: Switcheroo, Taunt, Substitute

**Gligar** — species, **NU**, source: override
  Ground/Flying | BST 430 (65/75/105/35/65/85) | Abilities: Hyper Cutter / Sand Veil / Immunity
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 249/273, SpA 169/185, Spe 269/295 — Sand Veil: Atk 249/273, SpA 169/185, Spe 269/295 — Immunity: Atk 249/273, SpA 169/185, Spe 269/295
  Item: **free**
  STAB: Ground Earthquake 100P · Flying Acrobatics 110P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Water Crabhammer 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Psychic Psychic Fangs 85P
  Special coverage: Psychic Dream Eater 100S, Poison Sludge Bomb 90S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Bug Struggle Bug 50S
  Setup: Agility, Harden, Hone Claws, Rock Polish, Swords Dance
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Dream Eater
  Priority: Feint 50P Normal (+2), Quick Attack 40P Normal (+1)
  Hazards: Spikes, Stealth Rock, Toxic Spikes
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute, Tailwind, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass, Tailwind

**Goodra** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Dragon | BST 600 (90/100/70/110/150/80) | Abilities: Sap Sipper / Hydration / Gooey
  Engine stats @252 (neutral/positive): Sap Sipper: Atk 299/328, SpA 319/350, Spe 259/284 — Hydration: Atk 299/328, SpA 319/350, Spe 259/284 — Gooey: Atk 299/328, SpA 319/350, Spe 259/284
  Item: **free**
  STAB: Dragon Draco Meteor 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Grass Power Whip 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Poison Sludge Wave 95S
  Setup: Acid Armor
  Reliable recovery: Rest
  Drain/Rest-only: Absorb
  Priority: Feint 50P Normal (+2)
  Phazing: Dragon Tail
  Status: Toxic
  Cleric: Life Dew
  Weather/terrain: Hail, Rain Dance, Sunny Day
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute, Focus Punch

**Gothitelle** — species, **NU**, source: override
  Psychic | BST 490 (70/55/95/95/110/65) | Abilities: Frisk / Competitive / Shadow Tag
  Engine stats @252 (neutral/positive): Frisk: Atk 209/229, SpA 289/317, Spe 229/251 — Competitive: Atk 209/229, SpA 289/317, Spe 229/251 — Shadow Tag: Atk 209/229, SpA 289/317, Spe 229/251
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Dark Foul Play 95P, Fighting Brick Break 75P, Rock Rock Slide 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S
  Setup: Calm Mind, Cosmic Power, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Fake Out 40P Normal (+3)
  Status: Hypnosis, Thunder Wave, Toxic
  Cleric: Heal Bell
  Trapping: Mean Look
  Weather/terrain: Psychic Terrain, Rain Dance
  Utility: Gravity, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

**Grafaiai** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Poison/Normal | BST 485 (63/95/65/80/72/110) | Abilities: Unburden / Poison Touch / Prankster
  Engine stats @252 (neutral/positive): Unburden: Atk 289/317, SpA 259/284, Spe 319/350 — Poison Touch: Atk 289/317, SpA 259/284, Spe 319/350 — Prankster: Atk 289/317, SpA 259/284, Spe 319/350
  Item: **free**
  STAB: Poison Gunk Shot 120P · Normal Double-Edge 120P
  Physical coverage: Flying Acrobatics 110P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Bug X-Scissor 80P, Ghost Shadow Claw 70P, Fighting Low Sweep 65P
  Special coverage: Ground Mud Shot 55S
  Setup: Nasty Plot, Swords Dance
  Reliable recovery: Rest
  Pivot: Baton Pass, Parting Shot, U-turn
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Encore, Knock Off, Protect, Substitute, Switcheroo, Taunt
  Notable: Knock Off, Switcheroo, Encore, Taunt, Substitute, Baton Pass

**Guzzlord** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Dark/Dragon | BST 570 (223/101/53/97/53/43) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 301/331, SpA 293/322, Spe 185/203
  Item: **free**
  STAB: Dark Crunch 80P · Dragon Draco Meteor 140S
  Physical coverage: Normal Last Resort 140P, Steel Steel Roller 130P, Fire Heat Crash 120P, Ground Earthquake 100P, Fighting Hammer Arm 100P, Rock Stone Edge 100P
  Special coverage: Poison Belch 120S, Fire Fire Blast 120S, Normal Wring Out 120S, Electric Shock Wave 60S
  Setup: Amnesia, Iron Defense
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Phazing: Dragon Tail
  Status: Toxic
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute

**Hariyama** — species, **NU**, source: override
  Fighting | BST 474 (144/120/60/40/60/50) | Abilities: Thick Fat / Guts / Sheer Force
  Engine stats @252 (neutral/positive): Thick Fat: Atk 339/372, SpA 179/196, Spe 199/218 — Guts: Atk 339/372, SpA 179/196, Spe 199/218 — Sheer Force: Atk 339/372, SpA 179/196, Spe 199/218
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Ground Headlong Rush 120P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Poison Poison Jab 80P, Dark Throat Chop 80P
  Special coverage: Water Surf 95S, Normal Tera Blast 80S, Ground Mud Shot 55S
  Setup: Bulk Up, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Bullet Punch 40P Steel (+1), Fake Out 40P Normal (+3)
  Phazing: Whirlwind
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Focus Punch

**Heliolisk** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Electric/Normal | BST 481 (62/55/52/109/94/109) | Abilities: Dry Skin / Sand Veil / Solar Power
  Engine stats @252 (neutral/positive): Dry Skin: Atk 209/229, SpA 317/348, Spe 317/348 — Sand Veil: Atk 209/229, SpA 317/348, Spe 317/348 — Solar Power: Atk 209/229, SpA 317/348, Spe 317/348
  Item: **free**
  STAB: Electric Thunder 120S · Normal Hyper Voice 90S
  Physical coverage: Dragon Dragon Rush 100P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fire Fire Punch 75P, Rock Rock Slide 75P, Bug U-turn 70P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Water Surf 95S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Bug Signal Beam 75S
  Setup: Agility, Charge
  Reliable recovery: Rest
  Drain/Rest-only: Parabolic Charge
  Priority: Quick Attack 40P Normal (+1)
  Pivot: U-turn, Volt Switch
  Phazing: Dragon Tail
  Status: Glare, Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Rain Dance, Sandstorm, Sunny Day
  Utility: Light Screen, Protect, Substitute
  Notable: Substitute

**Heracross** — species, **NU**, source: override
  Bug/Fighting | BST 500 (80/125/75/40/95/85) | Abilities: Swarm / Guts / Moxie
  Engine stats @252 (neutral/positive): Swarm: Atk 349/383, SpA 179/196, Spe 269/295 — Guts: Atk 349/383, SpA 179/196, Spe 269/295 — Moxie: Atk 349/383, SpA 179/196, Spe 269/295
  Item: **free**
  STAB: Bug Megahorn 120P · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Throat Chop 80P, Grass Bullet Seed 25x2-5P, Ghost Shadow Claw 70P
  Special coverage: Normal Tera Blast 80S, Poison Venoshock 65S
  Setup: Bulk Up, Harden, Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Vacuum Wave 40S Fighting (+1)
  Hazards: Spikes
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute, Focus Punch

**Houndstone** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Ghost | BST 488 (72/101/100/50/97/68) | Abilities: Sand Rush / Fluffy
  Engine stats @252 (neutral/positive): Sand Rush: Atk 301/331, SpA 199/218, Spe 235/258 — Fluffy: Atk 301/331, SpA 199/218, Spe 235/258
  Item: **free**
  STAB: Ghost Poltergeist 110P
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P, Fighting Body Press 80P, Dark Crunch 80P
  Special coverage: Normal Uproar 90S, Ground Mud Shot 55S, Dark Snarl 55S
  Reliable recovery: Rest
  Priority: Shadow Sneak 40P Ghost (+1)
  Phazing: Roar
  Status: Will-O-Wisp, Yawn
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Destiny Bond, Disable, Memento, Pain Split, Protect, Substitute, Trick
  Notable: Trick, Substitute

**Incineroar** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Fire/Dark | BST 530 (95/115/90/80/90/60) | Abilities: Blaze / Intimidate
  Engine stats @252 (neutral/positive): Blaze: Atk 329/361, SpA 259/284, Spe 219/240 — Intimidate: Atk 329/361, SpA 259/284, Spe 219/240
  Item: **free**
  STAB: Fire Overheat 140S · Dark Darkest Lariat 85P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Flying Acrobatics 110P, Ground Earthquake 100P, Steel Iron Head 80P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Ground Scorching Sands 70S
  Setup: Bulk Up, Nasty Plot, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Leech Life
  Priority: Fake Out 40P Normal (+3)
  Pivot: Baton Pass, Parting Shot, U-turn
  Phazing: Roar
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass, Focus Punch

**Indeedee** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Psychic/Normal | BST 475 (60/65/55/105/95/95) | Abilities: Inner Focus / Synchronize / Psychic Surge
  Engine stats @252 (neutral/positive): Inner Focus: Atk 229/251, SpA 309/339, Spe 289/317 — Synchronize: Atk 229/251, SpA 309/339, Spe 289/317 — Psychic Surge: Atk 229/251, SpA 309/339, Spe 289/317
  Item: **free**
  STAB: Psychic Future Sight 120S · Normal Hyper Voice 90S
  Physical coverage: Fairy Play Rough 90P, Fighting Drain Punch 75P
  Special coverage: Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S
  Setup: Calm Mind
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Draining Kiss
  Priority: Fake Out 40P Normal (+3)
  Cleric: Aromatherapy
  Weather/terrain: Psychic Terrain
  Utility: Encore, Gravity, Healing Wish, Protect, Substitute, Trick, Trick Room
  Notable: Trick, Encore, Substitute, Trick Room

**Inteleon** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water | BST 530 (70/85/65/125/65/120) | Abilities: Torrent / Sniper
  Engine stats @252 (neutral/positive): Torrent: Atk 269/295, SpA 349/383, Spe 339/372 — Sniper: Atk 269/295, SpA 349/383, Spe 339/372
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Flying Acrobatics 110P, Normal Take Down 90P, Dark Sucker Punch 80P, Ice Icicle Spear 25x2-5P, Dragon Scale Shot 25x2-5P, Bug Skitter Smack 70P
  Special coverage: Ice Blizzard 120S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Flying Air Slash 75S, Ground Mud Shot 55S
  Setup: Agility, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1), Aqua Jet 40P Water (+1), Ice Shard 40P Ice (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Baton Pass, Flip Turn, U-turn
  Weather/terrain: Rain Dance, Snowscape
  Utility: Haze, Light Screen, Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Taunt, Substitute, Baton Pass

**Kilowattrel** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Electric/Flying | BST 490 (70/70/60/105/60/125) | Abilities: Wind Power / Volt Absorb / Competitive
  Engine stats @252 (neutral/positive): Wind Power: Atk 239/262, SpA 309/339, Spe 349/383 — Volt Absorb: Atk 239/262, SpA 309/339, Spe 349/383 — Competitive: Atk 239/262, SpA 309/339, Spe 349/383
  Item: **free**
  STAB: Electric Thunder 120S · Flying Brave Bird 120P
  Physical coverage: Normal Take Down 90P, Bug U-turn 70P
  Special coverage: Normal Uproar 90S
  Setup: Agility, Charge
  Reliable recovery: Rest, Roost
  Priority: Quick Attack 40P Normal (+1)
  Pivot: U-turn, Volt Switch
  Status: Thunder Wave
  Weather/terrain: Electric Terrain
  Utility: Protect, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Kingler** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Water | BST 475 (55/130/115/50/50/75) | Abilities: Hyper Cutter / Shell Armor / Sheer Force
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 359/394, SpA 199/218, Spe 249/273 — Shell Armor: Atk 359/394, SpA 199/218, Spe 249/273 — Sheer Force: Atk 359/394, SpA 199/218, Spe 249/273
  Item: **free**
  STAB: Water Crabhammer 100P
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Ground Dig 100 (charge)P, Bug X-Scissor 80P, Rock Rock Slide 75P, Dark Night Slash 70P
  Special coverage: Ice Blizzard 120S, Rock Ancient Power 60S, Normal Hidden Power 60S, Ground Mud Shot 55S
  Setup: Agility, Amnesia, Harden, Hone Claws, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Haze, Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute

**Klefki** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Steel/Fairy | BST 470 (57/80/91/80/87/75) | Abilities: Prankster / Magician
  Engine stats @252 (neutral/positive): Prankster: Atk 259/284, SpA 259/284, Spe 249/273 — Magician: Atk 259/284, SpA 259/284, Spe 249/273
  Item: **free**
  STAB: Steel Steel Beam 140S · Fairy Play Rough 90P
  Physical coverage: Normal Last Resort 140P, Dark Foul Play 95P, Bug Skitter Smack 70P, Ghost Astonish 30P
  Special coverage: Psychic Psychic 90S, Normal Tera Blast 80S
  Setup: Calm Mind, Iron Defense
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Hazards: Spikes
  Removal: Defog
  Status: Thunder Wave, Toxic
  Weather/terrain: Misty Terrain, Rain Dance, Sandstorm, Sunny Day
  Utility: Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Switcheroo, Trick Room
  Notable: Switcheroo, Substitute, Trick Room

**Magneton** — species, **NU**, source: override
  Electric/Steel | BST 465 (50/60/95/120/70/70) | Abilities: Magnet Pull / Sturdy / Analytic
  Engine stats @252 (neutral/positive): Magnet Pull: Atk 219/240, SpA 339/372, Spe 239/262 — Sturdy: Atk 219/240, SpA 339/372, Spe 239/262 — Analytic: Atk 219/240, SpA 339/372, Spe 239/262
  Item: **free**
  STAB: Electric Thunder 120S · Steel Steel Beam 140S
  Physical coverage: Normal Explosion 250P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S
  Setup: Charge, Iron Defense
  Reliable recovery: Rest
  Pivot: Teleport, Volt Switch
  Status: Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Rain Dance, Sandstorm, Sunny Day
  Utility: Gravity, Light Screen, Magic Coat, Protect, Reflect, Substitute
  Notable: Substitute

**Mantine** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Water/Flying | BST 485 (85/40/70/80/140/70) | Abilities: Swift Swim / Water Absorb / Water Veil
  Engine stats @252 (neutral/positive): Swift Swim: Atk 179/196, SpA 259/284, Spe 239/262 — Water Absorb: Atk 179/196, SpA 259/284, Spe 239/262 — Water Veil: Atk 179/196, SpA 259/284, Spe 239/262
  Item: **free**
  STAB: Water Hydro Pump 120S · Flying Hurricane 120S
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Ground Earthquake 100P, Fighting Body Press 80P, Steel Iron Head 80P, Grass Seed Bomb 80P
  Special coverage: Ice Blizzard 120S, Bug Signal Beam 75S, Psychic Psybeam 65S, Normal Hidden Power 60S, Dragon Twister 40S, Ground Mud-Slap 20S
  Setup: Agility, Amnesia
  Reliable recovery: Rest, Roost
  Removal: Defog
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Haze, Protect, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Meloetta** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Normal/Psychic | BST 600 (100/77/77/128/128/90) | Abilities: Serene Grace
  Engine stats @252 (neutral/positive): Serene Grace: Atk 253/278, SpA 355/390, Spe 279/306
  Item: **free**
  STAB: Normal Hyper Voice 90S · Psychic Dream Eater 100S
  Physical coverage: Fighting Focus Punch 150P, Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Fairy Play Rough 90P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Energy Ball 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
  Setup: Calm Mind, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Dream Eater
  Priority: Quick Attack 40P Normal (+1)
  Pivot: Baton Pass, U-turn
  Status: Sing, Thunder Wave, Toxic
  Cleric: Heal Bell
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Gravity, Knock Off, Light Screen, Magic Coat, Perish Song, Protect, Safeguard, Substitute, Trick, Trick Room
  Notable: Knock Off, Trick, Substitute, Baton Pass, Trick Room, Focus Punch

**Omastar** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Rock/Water | BST 495 (70/60/125/115/70/55) | Abilities: Swift Swim / Shell Armor / Weak Armor
  Engine stats @252 (neutral/positive): Swift Swim: Atk 219/240, SpA 329/361, Spe 209/229 — Shell Armor: Atk 219/240, SpA 329/361, Spe 209/229 — Weak Armor: Atk 219/240, SpA 329/361, Spe 209/229
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Water Hydro Pump 120S
  Physical coverage: Normal Skull Bash 130P, Dark Crunch 80P, Fighting Submission 80P, Bug Pin Missile 25x2-5P, Steel Gyro Ball 26P
  Special coverage: Ice Blizzard 120S, Normal Wring Out 120S, Ground Earth Power 90S
  Setup: Iron Defense, Rock Polish, Shell Smash, Withdraw
  Reliable recovery: Rest
  Hazards: Spikes, Stealth Rock, Toxic Spikes
  Status: Toxic
  Weather/terrain: Hail, Rain Dance, Sandstorm
  Utility: Haze, Knock Off, Protect, Reflect, Substitute
  Notable: Knock Off, Substitute

**Overqwil** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Dark/Poison | BST 510 (85/115/95/65/65/85) | Abilities: Poison Point / Swift Swim / Intimidate
  Engine stats @252 (neutral/positive): Poison Point: Atk 329/361, SpA 229/251, Spe 269/295 — Swift Swim: Atk 329/361, SpA 229/251, Spe 269/295 — Intimidate: Atk 329/361, SpA 229/251, Spe 269/295
  Item: **free**
  STAB: Dark Crunch 80P · Poison Gunk Shot 120P
  Physical coverage: Normal Explosion 250P, Steel Steel Roller 130P, Water Aqua Tail 90P, Flying Bounce 85 (charge)P, Bug Pin Missile 25x2-5P, Dragon Scale Shot 25x2-5P
  Special coverage: Ice Blizzard 120S, Water Hydro Pump 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Electric Shock Wave 60S
  Setup: Agility, Defense Curl, Harden, Swords Dance
  Reliable recovery: Rest
  Priority: Aqua Jet 40P Water (+1)
  Hazards: Spikes, Toxic Spikes
  Pivot: Flip Turn
  Status: Thunder Wave, Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Destiny Bond, Haze, Pain Split, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Pawmot** — species, **NU**, source: override
  Electric/Fighting | BST 490 (70/115/70/70/60/105) | Abilities: Volt Absorb / Natural Cure / Iron Fist
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 329/361, SpA 239/262, Spe 309/339 — Natural Cure: Atk 329/361, SpA 239/262, Spe 309/339 — Iron Fist: Atk 329/361, SpA 239/262, Spe 309/339
  Item: **free**
  STAB: Electric Double Shock 120P · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Dark Crunch 80P, Grass Seed Bomb 80P, Fire Fire Punch 75P
  Special coverage: Normal Tera Blast 80S, Grass Grass Knot 60S
  Setup: Agility, Bulk Up, Charge
  Reliable recovery: Rest
  Priority: Upper Hand 65P Fighting (+3), Fake Out 40P Normal (+3), Mach Punch 40P Fighting (+1), Quick Attack 40P Normal (+1)
  Pivot: Baton Pass, Volt Switch
  Status: Nuzzle, Thunder Wave
  Cleric: Wish
  Weather/terrain: Electric Terrain, Rain Dance, Sunny Day
  Utility: Encore, Knock Off, Protect, Substitute
  Notable: Knock Off, Encore, Substitute, Baton Pass, Focus Punch

**Raikou** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 580 (90/85/75/115/100/115) | Abilities: Pressure / Inner Focus / Volt Absorb
  Engine stats @252 (neutral/positive): Pressure: Atk 269/295, SpA 329/361, Spe 329/361 — Inner Focus: Atk 269/295, SpA 329/361, Spe 329/361 — Volt Absorb: Atk 269/295, SpA 329/361, Spe 329/361
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Grass Trailblaze 50P, Fighting Rock Smash 40P
  Special coverage: Fighting Aura Sphere 90S, Psychic Extrasensory 80S, Water Scald 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S
  Setup: Agility, Calm Mind, Charge
  Reliable recovery: Rest
  Priority: Extreme Speed 80P Normal (+2), Quick Attack 40P Normal (+1)
  Pivot: Volt Switch
  Phazing: Roar
  Status: Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Light Screen, Protect, Reflect, Substitute
  Notable: Substitute

**Rhydon** — species, **NU**, source: override
  Ground/Rock | BST 485 (105/130/120/45/45/40) | Abilities: Lightning Rod / Rock Head / Reckless
  Engine stats @252 (neutral/positive): Lightning Rod: Atk 359/394, SpA 189/207, Spe 179/196 — Rock Head: Atk 359/394, SpA 189/207, Spe 179/196 — Reckless: Atk 359/394, SpA 189/207, Spe 179/196
  Item: **free**
  STAB: Ground Earthquake 100P · Rock Stone Edge 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Bug Megahorn 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Electric Supercell Slam 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S
  Setup: Iron Defense, Rock Polish, Swords Dance
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute, Focus Punch

**Rhyperior** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Ground/Rock | BST 535 (115/140/130/55/55/40) | Abilities: Lightning Rod / Solid Rock / Reckless
  Engine stats @252 (neutral/positive): Lightning Rod: Atk 379/416, SpA 209/229, Spe 179/196 — Solid Rock: Atk 379/416, SpA 209/229, Spe 179/196 — Reckless: Atk 379/416, SpA 209/229, Spe 179/196
  Item: **free**
  STAB: Ground Earthquake 100P · Rock Stone Edge 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Fire Heat Crash 120P, Steel Heavy Slam 120P, Bug Megahorn 120P, Dragon Outrage 120P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S
  Setup: Iron Defense, Rock Polish, Swords Dance
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute, Focus Punch

**Scrafty** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Dark/Fighting | BST 488 (65/90/115/45/115/58) | Abilities: Shed Skin / Moxie / Intimidate
  Engine stats @252 (neutral/positive): Shed Skin: Atk 279/306, SpA 189/207, Spe 215/236 — Moxie: Atk 279/306, SpA 189/207, Spe 215/236 — Intimidate: Atk 279/306, SpA 189/207, Spe 215/236
  Item: **free**
  STAB: Dark Foul Play 95P · Fighting Focus Punch 150P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P
  Special coverage: Dragon Dragon Pulse 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Grass Grass Knot 60S, Fire Incinerate 60S
  Setup: Amnesia, Bulk Up, Dragon Dance, Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Fake Out 40P Normal (+3)
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Encore, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Encore, Taunt, Substitute, Focus Punch

**Scream Tail** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Fairy/Psychic | BST 570 (115/65/99/65/115/111) | Abilities: Protosynthesis
  Engine stats @252 (neutral/positive): Protosynthesis: Atk 229/251, SpA 229/251, Spe 321/353
  Item: **free**
  STAB: Fairy Misty Explosion 100S · Psychic Psychic 90S
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Dark Crunch 80P, Fighting Drain Punch 75P, Fire Fire Punch 75P, Ice Ice Punch 75P
  Special coverage: Normal Boomburst 140S, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Grass Knot 60S
  Setup: Amnesia, Bulk Up, Calm Mind
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Hazards: Stealth Rock
  Pivot: Baton Pass
  Phazing: Roar
  Status: Sing, Thunder Wave
  Cleric: Wish
  Weather/terrain: Misty Terrain, Psychic Terrain, Rain Dance, Sandstorm, Snowscape, Sunny Day
  Utility: Disable, Encore, Light Screen, Perish Song, Protect, Reflect, Substitute, Trick, Trick Room
  Notable: Trick, Encore, Substitute, Baton Pass, Trick Room

**Stakataka** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Rock/Steel | BST 570 (61/131/211/53/101/13) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 361/397, SpA 205/225, Spe 125/137
  Item: **free**
  STAB: Rock Stone Edge 100P · Steel Steel Roller 130P
  Physical coverage: Normal Double-Edge 120P, Fire Heat Crash 120P, Fighting Superpower 120P, Ground Earthquake 100P, Psychic Zen Headbutt 80P, Dark Brutal Swing 60P
  Special coverage: Normal Hidden Power 60S, Bug Infestation 20S
  Setup: Autotomize, Harden, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Status: Toxic
  Trapping: Block
  Weather/terrain: Sandstorm
  Utility: Gravity, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick Room
  Notable: Substitute, Trick Room

**Staraptor** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Normal/Flying | BST 485 (85/120/70/50/60/100) | Abilities: Intimidate / Reckless
  Engine stats @252 (neutral/positive): Intimidate: Atk 339/372, SpA 199/218, Spe 299/328 — Reckless: Atk 339/372, SpA 199/218, Spe 299/328
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Fighting Close Combat 120P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Thief 60P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Bug Struggle Bug 50S, Dragon Twister 40S, Ground Mud-Slap 20S, Fighting Final Gambit fixedS
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

**Starmie** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Water/Psychic | BST 520 (60/75/85/100/85/115) | Abilities: Illuminate / Natural Cure / Analytic
  Engine stats @252 (neutral/positive): Illuminate: Atk 249/273, SpA 299/328, Spe 329/361 — Natural Cure: Atk 249/273, SpA 299/328, Spe 329/361 — Analytic: Atk 249/273, SpA 299/328, Spe 329/361
  Item: **free**
  STAB: Water Hydro Pump 120S · Psychic Dream Eater 100S
  Physical coverage: Normal Skull Bash 130P, Ice Avalanche 60P, Rock Rollout 30P, Steel Gyro Ball 14P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Normal Tri Attack 80S
  Setup: Agility, Cosmic Power, Harden
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Dream Eater
  Removal: Rapid Spin
  Pivot: Flip Turn, Teleport
  Status: Thunder Wave, Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Gravity, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

**Sylveon** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Fairy | BST 525 (95/65/65/110/130/60) | Abilities: Cute Charm / Pixilate
  Engine stats @252 (neutral/positive): Cute Charm: Atk 229/251, SpA 319/350, Spe 219/240 — Pixilate: Atk 229/251, SpA 319/350, Spe 219/240
  Item: **free**
  STAB: Fairy Misty Explosion 100S
  Physical coverage: Normal Last Resort 140P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Bite 60P, Grass Trailblaze 50P
  Special coverage: Normal Trump Card 200S, Psychic Synchronoise 120S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S, Grass Magical Leaf 60S, Ground Mud-Slap 20S
  Setup: Calm Mind, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Priority: Quick Attack 40P Normal (+1)
  Pivot: Baton Pass
  Phazing: Roar
  Status: Sing, Toxic, Yawn
  Cleric: Heal Bell, Wish
  Weather/terrain: Misty Terrain, Rain Dance, Sunny Day
  Utility: Detect, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute
  Notable: Substitute, Baton Pass

**Tauros-Paldea-Aqua** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Fighting/Water | BST 490 (75/110/105/30/70/100) | Abilities: Intimidate / Anger Point / Cud Chew
  Engine stats @252 (neutral/positive): Intimidate: Atk 319/350, SpA 159/174, Spe 299/328 — Anger Point: Atk 319/350, SpA 159/174, Spe 299/328 — Cud Chew: Atk 319/350, SpA 159/174, Spe 299/328
  Item: **free**
  STAB: Fighting Close Combat 120P · Water Wave Crash 120P
  Physical coverage: Normal Skull Bash 130P, Bug Megahorn 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Ghost Shadow Ball 80S
  Setup: Bulk Up, Work Up
  Reliable recovery: Rest
  Priority: Aqua Jet 40P Water (+1)
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute

**Tentacruel** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water/Poison | BST 515 (80/70/65/80/120/100) | Abilities: Clear Body / Liquid Ooze / Rain Dish
  Engine stats @252 (neutral/positive): Clear Body: Atk 239/262, SpA 259/284, Spe 299/328 — Liquid Ooze: Atk 239/262, SpA 259/284, Spe 299/328 — Rain Dish: Atk 239/262, SpA 259/284, Spe 299/328
  Item: **free**
  STAB: Water Hydro Pump 120S · Poison Gunk Shot 120P
  Physical coverage: Normal Skull Bash 130P, Dark Throat Chop 80P, Bug Skitter Smack 70P
  Special coverage: Ice Blizzard 120S, Normal Wring Out 120S, Fairy Dazzling Gleam 80S, Grass Giga Drain 75S, Ghost Hex 65S, Ground Mud Shot 55S
  Setup: Acid Armor, Barrier, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain, Mega Drain
  Hazards: Toxic Spikes
  Removal: Rapid Spin
  Pivot: Flip Turn
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Haze, Knock Off, Magic Coat, Protect, Reflect, Safeguard, Substitute
  Notable: Knock Off, Substitute

**Tsareena** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Grass | BST 510 (72/120/98/50/98/72) | Abilities: Leaf Guard / Queenly Majesty / Sweet Veil
  Engine stats @252 (neutral/positive): Leaf Guard: Atk 339/372, SpA 199/218, Spe 243/267 — Queenly Majesty: Atk 339/372, SpA 199/218, Spe 243/267 — Sweet Veil: Atk 339/372, SpA 199/218, Spe 243/267
  Item: **free**
  STAB: Grass Solar Blade 125 (charge)P
  Physical coverage: Fighting High Jump Kick 130P, Normal Mega Kick 120P, Flying Acrobatics 110P, Fairy Play Rough 90P, Psychic Zen Headbutt 80P, Bug U-turn 70P
  Special coverage: Fairy Dazzling Gleam 80S, Normal Tera Blast 80S
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss, Giga Drain
  Priority: Grassy Glide 70P Grass (+1), Feint 50P Normal (+2)
  Removal: Rapid Spin
  Pivot: U-turn
  Status: Grass Whistle, Toxic
  Cleric: Aromatherapy
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Knock Off, Light Screen, Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Tyrantrum** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Rock/Dragon | BST 521 (82/121/119/69/59/71) | Abilities: Strong Jaw / Rock Head
  Engine stats @252 (neutral/positive): Strong Jaw: Atk 341/375, SpA 237/260, Spe 241/265 — Rock Head: Atk 341/375, SpA 237/260, Spe 241/265
  Item: **free**
  STAB: Rock Head Smash 150P · Dragon Outrage 120P
  Physical coverage: Fighting Close Combat 120P, Normal Thrash 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P
  Special coverage: Ground Earth Power 90S, Normal Hyper Voice 90S, Dark Dark Pulse 80S
  Setup: Dragon Dance, Hone Claws, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute

**Uxie** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Psychic | BST 580 (75/75/130/75/130/95) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 249/273, SpA 249/273, Spe 289/317
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Steel Iron Tail 100P, Dark Foul Play 95P, Fairy Play Rough 90P, Fighting Drain Punch 75P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S
  Setup: Amnesia, Calm Mind, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Draining Kiss, Dream Eater, Giga Drain
  Hazards: Stealth Rock
  Pivot: Baton Pass, U-turn
  Status: Thunder Wave, Toxic, Yawn
  Cleric: Heal Bell
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Encore, Knock Off, Light Screen, Magic Coat, Memento, Pain Split, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Substitute, Baton Pass, Trick Room

**Vanilluxe** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Ice | BST 535 (71/95/85/110/95/79) | Abilities: Ice Body / Snow Warning / Weak Armor
  Engine stats @252 (neutral/positive): Ice Body: Atk 289/317, SpA 319/350, Spe 257/282 — Snow Warning: Atk 289/317, SpA 319/350, Spe 257/282 — Weak Armor: Atk 289/317, SpA 319/350, Spe 257/282
  Item: **free**
  STAB: Ice Blizzard 120S
  Physical coverage: Normal Explosion 250P, Ghost Astonish 30P, Dark Beat Up 10P
  Special coverage: Normal Hyper Voice 90S, Steel Flash Cannon 80S, Bug Signal Beam 75S, Water Water Pulse 60S, Psychic Mirror Coat fixedS
  Setup: Acid Armor, Autotomize, Harden, Iron Defense
  Reliable recovery: Rest
  Priority: Ice Shard 40P Ice (+1)
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Aurora Veil, Light Screen, Magic Coat, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Vaporeon** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water | BST 525 (130/65/60/110/95/65) | Abilities: Water Absorb / Hydration
  Engine stats @252 (neutral/positive): Water Absorb: Atk 229/251, SpA 319/350, Spe 229/251 — Hydration: Atk 229/251, SpA 319/350, Spe 229/251
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Last Resort 140P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Bite 60P, Grass Trailblaze 50P
  Special coverage: Normal Trump Card 200S, Ice Blizzard 120S, Psychic Synchronoise 120S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
  Setup: Acid Armor, Calm Mind, Work Up
  Reliable recovery: Rest
  Priority: Quick Attack 40P Normal (+1)
  Pivot: Baton Pass, Flip Turn
  Phazing: Roar
  Status: Sing, Toxic, Yawn
  Cleric: Heal Bell, Wish
  Weather/terrain: Hail, Rain Dance, Sunny Day
  Utility: Detect, Haze, Protect, Reflect, Substitute
  Notable: Substitute, Baton Pass

**Xatu** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Psychic/Flying | BST 470 (65/75/70/95/70/95) | Abilities: Synchronize / Early Bird / Magic Bounce
  Engine stats @252 (neutral/positive): Synchronize: Atk 249/273, SpA 289/317, Spe 289/317 — Early Bird: Atk 249/273, SpA 289/317, Spe 289/317 — Magic Bounce: Atk 249/273, SpA 289/317, Spe 289/317
  Item: **free**
  STAB: Psychic Future Sight 120S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Dark Foul Play 95P, Steel Steel Wing 70P, Bug U-turn 70P
  Special coverage: Grass Solar Beam 120 (charge)S, Fire Heat Wave 100S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Normal Hidden Power 60S
  Setup: Calm Mind, Cosmic Power
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Dream Eater, Giga Drain
  Priority: Sucker Punch 80P Dark (+1), Quick Attack 40P Normal (+1)
  Removal: Defog
  Pivot: Baton Pass, Teleport, U-turn
  Status: Thunder Wave, Toxic
  Cleric: Wish
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Haze, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Substitute, Tailwind, Trick, Trick Room
  Notable: Trick, Substitute, Baton Pass, Trick Room, Tailwind
---

## E. Current UU comparison bar

All **91** UU entries — the roster the last audit left unchanged.

**Aegislash** — species, **UU**, source: imported (natdex)
  Steel/Ghost | BST 520 (60/50/150/50/150/60) | Abilities: Stance Change
  Engine stats @252 (neutral/positive): Stance Change: Atk 199/218, SpA 199/218, Spe 219/240
  Item: **free**
  STAB: Steel Steel Beam 140S · Ghost Shadow Ball 80S
  Physical coverage: Rock Head Smash 150P, Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Return 102P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Flying Air Slash 75S, Normal Hidden Power 60S, Electric Shock Wave 60S

**Aegislash-Blade** — species, **UU**, source: imported (natdex)
  Steel/Ghost | BST 520 (60/150/50/150/50/60) | Abilities: Stance Change
  Engine stats @252 (neutral/positive): Stance Change: Atk 399/438, SpA 399/438, Spe 219/240
  Item: **free**
  STAB: Steel Steel Beam 140S · Ghost Shadow Ball 80S
  Physical coverage: Rock Head Smash 150P, Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Return 102P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Flying Air Slash 75S, Normal Hidden Power 60S, Electric Shock Wave 60S

**Aerodactyl-Mega** — forme, **UU**, source: imported (natdex)
  Rock/Flying | BST 615 (80/135/85/70/95/150) | Abilities: Tough Claws
  Engine stats @252 (neutral/positive): Tough Claws: Atk 369/405, SpA 239/262, Spe 399/438
  Item: **Aerodactylite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Aerodactyl (NU), pre-Mega abilities Rock Head / Pressure / Unnerve, pre-Mega Spe 394 (max +Spe)
  STAB: Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Fire Fire Blast 120S, Dragon Dragon Pulse 90S, Ground Earth Power 90S, Normal Razor Wind 80 (charge)S, Ghost Ominous Wind 60S

**Alakazam** — species, **UU**, source: imported (natdex)
  Psychic | BST 500 (55/50/45/135/95/120) | Abilities: Synchronize / Inner Focus / Magic Guard
  Engine stats @252 (neutral/positive): Synchronize: Atk 199/218, SpA 369/405, Spe 339/372 — Inner Focus: Atk 199/218, SpA 369/405, Spe 339/372 — Magic Guard: Atk 199/218, SpA 369/405, Spe 339/372
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Zap Cannon 120S, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Normal Tri Attack 80S

**Altaria-Mega** — forme, **UU**, source: imported (natdex)
  Dragon/Fairy | BST 590 (75/110/110/110/105/80) | Abilities: Pixilate
  Engine stats @252 (neutral/positive): Pixilate: Atk 319/350, SpA 319/350, Spe 259/284
  Item: **Altarianite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Altaria (NU), pre-Mega abilities Natural Cure / Cloud Nine, pre-Mega Spe 284 (max +Spe)
  STAB: Dragon Draco Meteor 140S · Fairy Double-Edge 156P
  Physical coverage: Flying Sky Attack 140 (charge)P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Thief 60P, Grass Trailblaze 50P, Fighting Rock Smash 40P
  Special coverage: Fire Fire Blast 120S, Flying Hurricane 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ice Ice Beam 95S, Ghost Ominous Wind 60S

**Amoonguss** — species, **UU**, source: imported (natdex)
  Grass/Poison | BST 464 (114/85/70/85/80/30) | Abilities: Effect Spore / Regenerator
  Engine stats @252 (neutral/positive): Effect Spore: Atk 269/295, SpA 269/295, Spe 159/174 — Regenerator: Atk 269/295, SpA 269/295, Spe 159/174
  Item: **free**
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Return 102P, Dark Foul Play 95P, Ground Stomping Tantrum 75P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Bug Pollen Puff 90S, Normal Tera Blast 80S, Ghost Hex 65S

**Archaludon** — species, **UU**, source: imported (natdex)
  Steel/Dragon | BST 600 (90/105/130/125/65/85) | Abilities: Stamina / Sturdy / Stalwart
  Engine stats @252 (neutral/positive): Stamina: Atk 309/339, SpA 349/383, Spe 269/295 — Sturdy: Atk 309/339, SpA 349/383, Spe 269/295 — Stalwart: Atk 309/339, SpA 349/383, Spe 269/295
  Item: **free**
  STAB: Steel Steel Beam 140S · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Foul Play 95P, Fighting Body Press 80P
  Special coverage: Electric Electro Shot 130 (charge)S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Fighting Aura Sphere 90S, Dark Dark Pulse 80S, Normal Tera Blast 80S

**Azumarill** — species, **UU**, source: imported (natdex)
  Water/Fairy | BST 420 (100/50/80/60/80/50) | Abilities: Thick Fat / Huge Power / Sap Sipper
  Engine stats @252 (neutral/positive): Thick Fat: Atk 199/218, SpA 219/240, Spe 199/218 — Huge Power: Atk 398/436, SpA 219/240, Spe 199/218 — Sap Sipper: Atk 199/218, SpA 219/240, Spe 199/218
  Item: **free**
  STAB: Water Aqua Tail 90P · Fairy Play Rough 90P
  Physical coverage: Fighting Focus Punch 150P, Steel Steel Roller 130P, Normal Double-Edge 120P, Ground Dig 100 (charge)P, Flying Bounce 85 (charge)P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Psychic Future Sight 120S, Normal Hyper Voice 90S, Grass Grass Knot 60S, Ground Mud Shot 55S

**Bisharp** — species, **UU**, source: imported (natdex)
  Dark/Steel | BST 490 (65/125/100/60/70/70) | Abilities: Defiant / Inner Focus / Pressure
  Engine stats @252 (neutral/positive): Defiant: Atk 349/383, SpA 219/240, Spe 239/262 — Inner Focus: Atk 349/383, SpA 219/240, Spe 239/262 — Pressure: Atk 349/383, SpA 219/240, Spe 239/262
  Item: **free**
  STAB: Dark Foul Play 95P · Steel Iron Head 80P
  Physical coverage: Normal Return 102P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Flying Air Slash 75S, Grass Grass Knot 60S

**Blacephalon** — species, **UU**, source: imported (natdex)
  Fire/Ghost | BST 570 (53/127/53/151/79/107) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 353/388, SpA 401/441, Spe 313/344
  Item: **free**
  STAB: Fire Mind Blown 150S · Ghost Shadow Ball 80S
  Physical coverage: Normal Explosion 250P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Rock Rock Blast 25x2-5P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S

**Blissey** — species, **UU**, source: imported (natdex)
  Normal | BST 540 (255/10/10/75/135/55) | Abilities: Natural Cure / Serene Grace / Healer
  Engine stats @252 (neutral/positive): Natural Cure: Atk 119/130, SpA 249/273, Spe 209/229 — Serene Grace: Atk 119/130, SpA 249/273, Spe 209/229 — Healer: Atk 119/130, SpA 249/273, Spe 209/229
  Item: **free**
  STAB: Normal Hyper Voice 90S
  Physical coverage: Fighting Focus Punch 150P, Ground Earthquake 100P, Steel Iron Tail 100P, Electric Wild Charge 90P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S

**Buzzwole** — species, **UU**, source: imported (natdex)
  Bug/Fighting | BST 570 (107/139/139/53/53/79) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 377/414, SpA 205/225, Spe 257/282
  Item: **free**
  STAB: Bug Leech Life 80P · Fighting Focus Punch 150P
  Physical coverage: Dragon Outrage 120P, Normal Return 102P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P
  Special coverage: Normal Hidden Power 60S

**Celesteela** — species, **UU**, source: imported (natdex)
  Steel/Flying | BST 570 (97/101/103/107/101/61) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 301/331, SpA 313/344, Spe 221/243
  Item: **free**
  STAB: Steel Steel Beam 140S · Flying Acrobatics 110P
  Physical coverage: Normal Explosion 250P, Bug Megahorn 120P, Fighting Superpower 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Grass Seed Bomb 80P
  Special coverage: Fire Fire Blast 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Normal Hidden Power 60S, Electric Shock Wave 60S

**Chandelure** — species, **UU**, source: override
  Ghost/Fire | BST 520 (60/55/90/145/90/80) | Abilities: Flash Fire / Flame Body / Infiltrator / Shadow Tag
  Engine stats @252 (neutral/positive): Flash Fire: Atk 209/229, SpA 389/427, Spe 259/284 — Flame Body: Atk 209/229, SpA 389/427, Spe 259/284 — Infiltrator: Atk 209/229, SpA 389/427, Spe 259/284 — Shadow Tag: Atk 209/229, SpA 389/427, Spe 259/284
  Item: **free**
  STAB: Ghost Shadow Ball 80S · Fire Overheat 140S
  Physical coverage: Normal Return 102P, Dark Lash Out 75P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S

**Chandelure-Mega** — forme, **UU**, source: override
  Ghost/Fire | BST 620 (60/75/110/175/110/90) | Abilities: Infiltrator
  Engine stats @252 (neutral/positive): Infiltrator: Atk 249/273, SpA 449/493, Spe 279/306
  Item: **Chandelurite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Chandelure (UU), pre-Mega abilities Flash Fire / Flame Body / Infiltrator / Shadow Tag, pre-Mega Spe 284 (max +Spe)
  STAB: Ghost Shadow Ball 80S · Fire Overheat 140S
  Physical coverage: Normal Return 102P, Dark Lash Out 75P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S

**Chansey** — species, **UU**, source: imported (natdex)
  Normal | BST 450 (250/5/5/35/105/50) | Abilities: Natural Cure / Serene Grace / Healer
  Engine stats @252 (neutral/positive): Natural Cure: Atk 109/119, SpA 169/185, Spe 199/218 — Serene Grace: Atk 109/119, SpA 169/185, Spe 199/218 — Healer: Atk 109/119, SpA 169/185, Spe 199/218
  Item: **free**
  STAB: Normal Hyper Voice 90S
  Physical coverage: Fighting Focus Punch 150P, Ground Earthquake 100P, Steel Iron Tail 100P, Electric Wild Charge 90P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S

**Clefable** — species, **UU**, source: imported (natdex)
  Fairy | BST 483 (95/70/73/95/90/60) | Abilities: Cute Charm / Magic Guard / Unaware
  Engine stats @252 (neutral/positive): Cute Charm: Atk 239/262, SpA 289/317, Spe 219/240 — Magic Guard: Atk 239/262, SpA 289/317, Spe 219/240 — Unaware: Atk 239/262, SpA 289/317, Spe 219/240
  Item: **free**
  STAB: Fairy Misty Explosion 100S
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S

**Conkeldurr** — species, **UU**, source: imported (natdex)
  Fighting | BST 505 (105/140/95/55/65/45) | Abilities: Guts / Sheer Force / Iron Fist
  Engine stats @252 (neutral/positive): Guts: Atk 379/416, SpA 209/229, Spe 189/207 — Sheer Force: Atk 379/416, SpA 209/229, Spe 189/207 — Iron Fist: Atk 379/416, SpA 209/229, Spe 189/207
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Hard Press 100P, Rock Stone Edge 100P, Poison Poison Jab 80P, Fire Fire Punch 75P
  Special coverage: Normal Tera Blast 80S, Grass Grass Knot 60S

**Corviknight** — species, **UU**, source: override
  Flying/Steel | BST 495 (98/87/105/53/85/67) | Abilities: Pressure / Unnerve / Mirror Armor
  Engine stats @252 (neutral/positive): Pressure: Atk 273/300, SpA 205/225, Spe 233/256 — Unnerve: Atk 273/300, SpA 205/225, Spe 233/256 — Mirror Armor: Atk 273/300, SpA 205/225, Spe 233/256
  Item: **free**
  STAB: Flying Sky Attack 140 (charge)P · Steel Steel Beam 140S
  Physical coverage: Normal Double-Edge 120P, Fighting Body Press 80P, Bug U-turn 70P, Dark Assurance 60P
  Special coverage: Normal Tera Blast 80S

**Delphox-Mega** — forme, **UU**, source: override
  Fire/Psychic | BST 634 (75/69/72/159/125/134) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 237/260, SpA 417/458, Spe 367/403
  Item: **Delphoxite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Delphox (PU), pre-Mega abilities Blaze / Magician, pre-Mega Spe 337 (max +Spe)
  STAB: Fire Overheat 140S · Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Dark Foul Play 95P, Electric Thunder Punch 75P, Fighting Low Kick 60P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Normal Hyper Voice 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Dragalge-Mega** — forme, **UU**, source: override
  Poison/Dragon | BST 594 (65/85/105/132/163/44) | Abilities: Regenerator
  Engine stats @252 (neutral/positive): Regenerator: Atk 269/295, SpA 363/399, Spe 187/205
  Item: **Dragalgite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Dragalge (NU), pre-Mega abilities Poison Point / Poison Touch / Adaptability, pre-Mega Spe 205 (max +Spe)
  STAB: Poison Sludge Wave 95S · Dragon Draco Meteor 140S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Water Aqua Tail 90P, Fairy Play Rough 90P, Flying Bounce 85 (charge)P, Dark Feint Attack 60P
  Special coverage: Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ice Icy Wind 55S

**Drampa-Mega** — forme, **UU**, source: override
  Normal/Dragon | BST 585 (78/85/110/160/116/36) | Abilities: Berserk
  Engine stats @252 (neutral/positive): Berserk: Atk 269/295, SpA 419/460, Spe 171/188
  Item: **Drampanite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Drampa (NU), pre-Mega abilities Berserk / Sap Sipper / Cloud Nine, pre-Mega Spe 188 (max +Spe)
  STAB: Normal Hyper Voice 90S · Dragon Draco Meteor 140S
  Physical coverage: Fighting Superpower 120P, Ground Earthquake 100P, Fairy Play Rough 90P, Flying Fly 90 (charge)P, Dark Fling 80P, Rock Rock Slide 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Flying Hurricane 120S, Water Hydro Pump 120S, Electric Thunder 120S

**Emboar-Mega** — forme, **UU**, source: override
  Fire/Fighting | BST 628 (110/148/75/110/110/75) | Abilities: Mold Breaker
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 395/434, SpA 319/350, Spe 249/273
  Item: **Emboarite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Emboar (PU), pre-Mega abilities Blaze / Reckless, pre-Mega Spe 251 (max +Spe)
  STAB: Fire Overheat 140S · Fighting Focus Punch 150P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Hard Press 100P, Electric Wild Charge 90P, Dark Fling 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Water Scald 80S, Normal Tera Blast 80S, Poison Smog 30S, Ground Mud-Slap 20S

**Enamorus** — species, **UU**, source: imported (natdex)
  Fairy/Flying | BST 580 (74/115/70/135/80/106) | Abilities: Cute Charm / Contrary
  Engine stats @252 (neutral/positive): Cute Charm: Atk 329/361, SpA 369/405, Spe 311/342 — Contrary: Atk 329/361, SpA 369/405, Spe 311/342
  Item: **free**
  STAB: Fairy Misty Explosion 100S · Flying Fly 90 (charge)P
  Physical coverage: Dragon Outrage 120P, Fighting Superpower 120P, Normal Take Down 90P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Ghost Astonish 30P
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Fire Mystical Fire 75S

**Excadrill** — species, **UU**, source: imported (natdex)
  Ground/Steel | BST 508 (110/135/60/50/65/88) | Abilities: Sand Rush / Sand Force / Mold Breaker
  Engine stats @252 (neutral/positive): Sand Rush: Atk 369/405, SpA 199/218, Spe 275/302 — Sand Force: Atk 369/405, SpA 199/218, Spe 275/302 — Mold Breaker: Atk 369/405, SpA 199/218, Spe 275/302
  Item: **free**
  STAB: Ground Earthquake 100P · Steel Iron Head 80P
  Physical coverage: Normal Skull Bash 130P, Poison Poison Jab 80P, Fighting Submission 80P, Dark Throat Chop 80P, Bug X-Scissor 80P, Rock Rock Blast 25x2-5P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Bomb 90S, Normal Tera Blast 80S

**Gardevoir-Mega** — forme, **UU**, source: imported (natdex)
  Psychic/Fairy | BST 618 (68/85/65/165/135/100) | Abilities: Pixilate
  Engine stats @252 (neutral/positive): Pixilate: Atk 269/295, SpA 429/471, Spe 299/328
  Item: **Gardevoirite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Gardevoir (RU), pre-Mega abilities Synchronize / Trace / Telepathy, pre-Mega Spe 284 (max +Spe)
  STAB: Psychic Future Sight 120S · Fairy Hyper Voice 117S
  Physical coverage: Dark Fling 80P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Ghost Shadow Sneak 40P
  Special coverage: Fighting Focus Blast 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S, Bug Signal Beam 75S

**Gengar** — species, **UU**, source: imported (natdex)
  Ghost/Poison | BST 500 (60/65/60/130/75/110) | Abilities: Cursed Body / Levitate
  Engine stats @252 (neutral/positive): Cursed Body: Atk 229/251, SpA 359/394, Spe 319/350 — Levitate: Atk 229/251, SpA 359/394, Spe 319/350
  Item: **free**
  STAB: Ghost Shadow Ball 80S · Poison Sludge Wave 95S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Dark Foul Play 95P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Psychic Dream Eater 100S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S

**Glimmora** — species, **UU**, source: imported (natdex)
  Rock/Poison | BST 525 (83/55/90/130/81/86) | Abilities: Toxic Debris / Corrosion
  Engine stats @252 (neutral/positive): Toxic Debris: Atk 209/229, SpA 359/394, Spe 271/298 — Corrosion: Atk 209/229, SpA 359/394, Spe 271/298
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Poison Sludge Wave 95S
  Physical coverage: Normal Explosion 250P, Ground Sand Tomb 35P
  Special coverage: Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Normal Tera Blast 80S

**Goodra-Hisui** — species, **UU**, source: imported (natdex)
  Steel/Dragon | BST 600 (80/100/100/110/150/60) | Abilities: Sap Sipper / Shell Armor / Gooey
  Engine stats @252 (neutral/positive): Sap Sipper: Atk 299/328, SpA 319/350, Spe 219/240 — Shell Armor: Atk 299/328, SpA 319/350, Spe 219/240 — Gooey: Atk 299/328, SpA 319/350, Spe 219/240
  Item: **free**
  STAB: Steel Steel Beam 140S · Dragon Draco Meteor 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Grass Power Whip 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Poison Sludge Wave 95S

**Gyarados** — species, **UU**, source: override
  Water/Flying | BST 540 (95/125/79/60/100/81) | Abilities: Intimidate / Moxie
  Engine stats @252 (neutral/positive): Intimidate: Atk 349/383, SpA 219/240, Spe 261/287 — Moxie: Atk 349/383, SpA 219/240, Spe 261/287
  Item: **free**
  STAB: Water Aqua Tail 90P · Flying Bounce 85 (charge)P
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Grass Power Whip 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S, Normal Uproar 90S, Dark Dark Pulse 80S

**Hatterene** — species, **UU**, source: override
  Psychic/Fairy | BST 510 (57/90/95/136/103/29) | Abilities: Healer / Anticipation / Magic Bounce
  Engine stats @252 (neutral/positive): Healer: Atk 279/306, SpA 371/408, Spe 157/172 — Anticipation: Atk 279/306, SpA 371/408, Spe 157/172 — Magic Bounce: Atk 279/306, SpA 371/408, Spe 157/172
  Item: **free**
  STAB: Psychic Future Sight 120S · Fairy Misty Explosion 100S
  Physical coverage: Grass Power Whip 120P, Normal Facade 70P, Ghost Shadow Claw 70P, Dark Brutal Swing 60P, Electric Nuzzle 20P
  Special coverage: Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Fire Mystical Fire 75S

**Hawlucha** — species, **UU**, source: override
  Fighting/Flying | BST 500 (78/92/75/74/63/118) | Abilities: Limber / Unburden / Mold Breaker
  Engine stats @252 (neutral/positive): Limber: Atk 283/311, SpA 247/271, Spe 335/368 — Unburden: Atk 283/311, SpA 247/271, Spe 335/368 — Mold Breaker: Atk 283/311, SpA 247/271, Spe 335/368
  Item: **free**
  STAB: Fighting Focus Punch 150P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Last Resort 140P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Steel Iron Head 80P, Bug Lunge 80P
  Special coverage: Normal Uproar 90S, Grass Grass Knot 60S

**Haxorus** — species, **UU**, source: imported (natdex)
  Dragon | BST 540 (76/147/90/60/70/97) | Abilities: Rivalry / Mold Breaker / Unnerve
  Engine stats @252 (neutral/positive): Rivalry: Atk 393/432, SpA 219/240, Spe 293/322 — Mold Breaker: Atk 393/432, SpA 219/240, Spe 293/322 — Unnerve: Atk 393/432, SpA 219/240, Spe 293/322
  Item: **free**
  STAB: Dragon Outrage 120P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Bug First Impression 90P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Tera Blast 80S, Grass Grass Knot 60S, Fire Incinerate 60S, Electric Shock Wave 60S

**Heracross-Mega** — forme, **UU**, source: imported (natdex)
  Bug/Fighting | BST 600 (80/185/115/40/105/75) | Abilities: Skill Link
  Engine stats @252 (neutral/positive): Skill Link: Atk 469/515, SpA 179/196, Spe 249/273
  Item: **Heracronite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Heracross (NU), pre-Mega abilities Swarm / Guts / Moxie, pre-Mega Spe 295 (max +Spe)
  STAB: Bug Megahorn 120P · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Fling 80P, Grass Bullet Seed 25x2-5P, Ghost Shadow Claw 70P
  Special coverage: Normal Tera Blast 80S, Poison Venoshock 65S

**Hippowdon** — species, **UU**, source: imported (natdex)
  Ground | BST 525 (108/112/118/68/72/47) | Abilities: Sand Stream / Sand Force
  Engine stats @252 (neutral/positive): Sand Stream: Atk 323/355, SpA 235/258, Spe 193/212 — Sand Force: Atk 323/355, SpA 235/258, Spe 193/212
  Item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Fighting Superpower 120P, Rock Stone Edge 100P, Dark Crunch 80P, Fire Fire Fang 65P
  Special coverage: Rock Weather Ball 100S, Water Muddy Water 95S, Normal Hyper Voice 90S

**Hydrapple** — species, **UU**, source: imported (natdex)
  Grass/Dragon | BST 540 (106/80/110/120/80/44) | Abilities: Supersweet Syrup / Regenerator / Sticky Hold
  Engine stats @252 (neutral/positive): Supersweet Syrup: Atk 259/284, SpA 339/372, Spe 187/205 — Regenerator: Atk 259/284, SpA 339/372, Spe 187/205 — Sticky Hold: Atk 259/284, SpA 339/372, Spe 187/205
  Item: **free**
  STAB: Grass Leaf Storm 140S · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Fighting Body Press 80P, Dark Sucker Punch 80P, Bug Bug Bite 60P, Steel Heavy Slam 40P
  Special coverage: Water Hydro Pump 120S, Ground Earth Power 90S, Bug Pollen Puff 90S, Normal Uproar 90S

**Hydreigon** — species, **UU**, source: imported (natdex)
  Dark/Dragon | BST 600 (92/105/90/125/90/98) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 309/339, SpA 349/383, Spe 295/324
  Item: **free**
  STAB: Dark Crunch 80P · Dragon Draco Meteor 140S
  Physical coverage: Rock Head Smash 150P, Fighting Superpower 120P, Flying Acrobatics 110P, Normal Return 102P, Ground Earthquake 100P, Steel Iron Tail 100P
  Special coverage: Poison Belch 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Ground Earth Power 90S, Normal Hyper Voice 90S

**Iron Boulder** — species, **UU**, source: imported (natdex)
  Rock/Psychic | BST 590 (90/120/80/68/108/124) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 339/372, SpA 235/258, Spe 347/381
  Item: **free**
  STAB: Rock Stone Edge 100P · Psychic Zen Headbutt 80P
  Physical coverage: Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Ground Earthquake 100P, Electric Wild Charge 90P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S

**Iron Crown** — species, **UU**, source: override
  Steel/Psychic | BST 590 (90/72/100/122/108/98) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 243/267, SpA 343/377, Spe 295/324
  Item: **free**
  STAB: Steel Steel Beam 140S · Psychic Future Sight 120S
  Physical coverage: Grass Solar Blade 125 (charge)P, Normal Double-Edge 120P, Electric Supercell Slam 100P, Fighting Sacred Sword 90P, Bug X-Scissor 80P, Ground Bulldoze 60P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Flying Air Slash 75S, Electric Volt Switch 70S

**Iron Leaves** — species, **UU**, source: imported (natdex)
  Grass/Psychic | BST 590 (90/130/88/70/108/104) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 359/394, SpA 239/262, Spe 307/337
  Item: **free**
  STAB: Grass Solar Blade 125 (charge)P · Psychic Psyblade 80P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Electric Wild Charge 90P, Dark Throat Chop 80P, Steel Smart Strike 70P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Flying Air Slash 75S

**Iron Treads** — species, **UU**, source: override
  Ground/Steel | BST 570 (90/112/120/72/70/106) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 323/355, SpA 243/267, Spe 311/342
  Item: **free**
  STAB: Ground Earthquake 100P · Steel Steel Beam 140S
  Physical coverage: Normal Double-Edge 120P, Bug Megahorn 120P, Rock Stone Edge 100P, Electric Supercell Slam 100P, Fighting Body Press 80P, Ice Ice Spinner 80P
  Special coverage: Electric Thunder 120S, Normal Tera Blast 80S

**Jirachi** — species, **UU**, source: imported (natdex)
  Steel/Psychic | BST 600 (100/100/100/100/100/100) | Abilities: Serene Grace
  Engine stats @252 (neutral/positive): Serene Grace: Atk 299/328, SpA 299/328, Spe 299/328
  Item: **free**
  STAB: Steel Doom Desire 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Fighting Dynamic Punch 100P, Fairy Play Rough 90P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Dragon Draco Meteor 140S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Fairy Moonblast 95S, Fighting Aura Sphere 90S, Grass Energy Ball 90S

**Keldeo** — species, **UU**, source: imported (natdex)
  Water/Fighting | BST 580 (91/72/90/129/90/108) | Abilities: Justified
  Engine stats @252 (neutral/positive): Justified: Atk 243/267, SpA 357/392, Spe 315/346
  Item: **free**
  STAB: Water Hydro Pump 120S · Fighting Focus Blast 120S
  Physical coverage: Normal Last Resort 140P, Bug Megahorn 120P, Rock Stone Edge 100P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P, Steel Smart Strike 70P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Ice Icy Wind 55S

**Latias-Mega** — forme, **UU**, source: imported (natdex)
  Dragon/Psychic | BST 700 (80/100/120/140/150/110) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 299/328, SpA 379/416, Spe 319/350
  Item: **Latiasite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Latias (RU), pre-Mega abilities Levitate, pre-Mega Spe 350 (max +Spe)
  STAB: Dragon Draco Meteor 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Water Liquidation 85P, Dark Sucker Punch 80P, Ghost Shadow Claw 70P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Water Surf 95S, Fighting Aura Sphere 90S, Fairy Alluring Voice 80S

**Lilligant-Hisui** — species, **UU**, source: imported (natdex)
  Grass/Fighting | BST 480 (70/105/75/50/75/105) | Abilities: Chlorophyll / Hustle / Leaf Guard
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 309/339, SpA 199/218, Spe 309/339 — Hustle: Atk 463/508, SpA 199/218, Spe 309/339 — Leaf Guard: Atk 309/339, SpA 199/218, Spe 309/339
  Item: **free**
  STAB: Grass Solar Blade 125 (charge)P · Fighting Axe Kick 120P
  Physical coverage: Normal Mega Kick 120P, Flying Acrobatics 110P, Ice Ice Spinner 80P, Poison Poison Jab 80P
  Special coverage: Flying Hurricane 120S, Psychic Dream Eater 100S, Bug Pollen Puff 90S, Fairy Alluring Voice 80S, Normal Tera Blast 80S

**Mamoswine** — species, **UU**, source: imported (natdex)
  Ice/Ground | BST 530 (110/130/80/70/60/80) | Abilities: Oblivious / Snow Cloak / Thick Fat
  Engine stats @252 (neutral/positive): Oblivious: Atk 359/394, SpA 239/262, Spe 259/284 — Snow Cloak: Atk 359/394, SpA 239/262, Spe 259/284 — Thick Fat: Atk 359/394, SpA 239/262, Spe 259/284
  Item: **free**
  STAB: Ice Icicle Crash 85P · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Fighting Superpower 120P, Rock Stone Edge 100P, Dark Throat Chop 80P, Grass Trailblaze 50P
  Special coverage: Normal Tera Blast 80S, Rock Ancient Power 60S

**Meganium-Mega** — forme, **UU**, source: override
  Grass/Fairy | BST 625 (80/92/115/143/115/80) | Abilities: Mega Sol
  Engine stats @252 (neutral/positive): Mega Sol: Atk 283/311, SpA 385/423, Spe 259/284
  Item: **Meganiumite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Meganium (ZU), pre-Mega abilities Overgrow / Leaf Guard, pre-Mega Spe 284 (max +Spe)
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fighting Body Press 80P, Psychic Zen Headbutt 80P
  Special coverage: Normal Wring Out 120S, Fire Weather Ball 100S, Rock Ancient Power 60S, Ground Mud-Slap 20S

**Metagross** — species, **UU**, source: override
  Steel/Psychic | BST 600 (80/135/130/95/90/70) | Abilities: Clear Body / Light Metal
  Engine stats @252 (neutral/positive): Clear Body: Atk 369/405, SpA 289/317, Spe 239/262 — Light Metal: Atk 369/405, SpA 289/317, Spe 239/262
  Item: **free**
  STAB: Steel Steel Beam 140S · Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Ground Earthquake 100P, Rock Stone Edge 100P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Rock Meteor Beam 120 (charge)S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Grass Grass Knot 60S

**Mew** — species, **UU**, source: imported (natdex)
  Psychic | BST 600 (100/100/100/100/100/100) | Abilities: Synchronize
  Engine stats @252 (neutral/positive): Synchronize: Atk 299/328, SpA 299/328, Spe 299/328
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Flying Sky Attack 140 (charge)P, Steel Steel Roller 130P, Grass Solar Blade 125 (charge)P, Fire Flare Blitz 120P
  Special coverage: Dragon Draco Meteor 140S, Grass Leaf Storm 140S, Fire Overheat 140S, Steel Steel Beam 140S, Ice Blizzard 120S, Fighting Focus Blast 120S

**Mienshao** — species, **UU**, source: imported (natdex)
  Fighting | BST 510 (65/125/60/95/60/105) | Abilities: Inner Focus / Regenerator / Reckless
  Engine stats @252 (neutral/positive): Inner Focus: Atk 349/383, SpA 289/317, Spe 309/339 — Regenerator: Atk 349/383, SpA 289/317, Spe 309/339 — Reckless: Atk 349/383, SpA 289/317, Spe 309/339
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Fire Blaze Kick 85P
  Special coverage: Normal Tera Blast 80S, Grass Grass Knot 60S

**Moltres** — species, **UU**, source: override
  Fire/Flying | BST 580 (90/100/90/125/85/90) | Abilities: Pressure / Flame Body
  Engine stats @252 (neutral/positive): Pressure: Atk 299/328, SpA 349/383, Spe 279/306 — Flame Body: Atk 299/328, SpA 349/383, Spe 279/306
  Item: **free**
  STAB: Fire Overheat 140S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Fighting Rock Smash 40P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Extrasensory 80S, Normal Tera Blast 80S, Ground Scorching Sands 70S, Rock Ancient Power 60S, Ghost Ominous Wind 60S

**Moltres-Galar** — species, **UU**, source: imported (natdex)
  Dark/Flying | BST 580 (90/85/90/100/125/90) | Abilities: Berserk
  Engine stats @252 (neutral/positive): Berserk: Atk 269/295, SpA 299/328, Spe 279/306
  Item: **free**
  STAB: Dark Foul Play 95P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Fire Flare Blitz 120P, Steel Steel Wing 70P, Bug U-turn 70P, Fighting Rock Smash 40P
  Special coverage: Fire Overheat 140S, Grass Solar Beam 120 (charge)S, Normal Hyper Voice 90S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S, Ground Scorching Sands 70S

**Okidogi** — species, **UU**, source: override
  Poison/Fighting | BST 555 (88/128/115/58/86/80) | Abilities: Toxic Chain / Guard Dog
  Engine stats @252 (neutral/positive): Toxic Chain: Atk 355/390, SpA 215/236, Spe 259/284 — Guard Dog: Atk 355/390, SpA 215/236, Spe 259/284
  Item: **free**
  STAB: Poison Gunk Shot 120P · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Steel Hard Press 100P, Ground Dig 100 (charge)P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Normal Uproar 90S, Dark Snarl 55S

**Pecharunt** — species, **UU**, source: override
  Poison/Ghost | BST 600 (88/88/160/88/88/88) | Abilities: Poison Puppeteer
  Engine stats @252 (neutral/positive): Poison Puppeteer: Atk 275/302, SpA 275/302, Spe 275/302
  Item: **free**
  STAB: Poison Gunk Shot 120P · Ghost Poltergeist 110P
  Physical coverage: Dark Foul Play 95P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S

**Polteageist** — species, **UU**, source: imported (natdex)
  Ghost | BST 508 (60/65/65/134/114/70) | Abilities: Weak Armor / Cursed Body
  Engine stats @252 (neutral/positive): Weak Armor: Atk 229/251, SpA 367/403, Spe 239/262 — Cursed Body: Atk 229/251, SpA 367/403, Spe 239/262
  Item: **free**
  STAB: Ghost Shadow Ball 80S
  Physical coverage: Normal Self-Destruct 200P, Dark Foul Play 95P
  Special coverage: Psychic Psychic 90S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Giga Drain 75S

**Porygon-Z** — species, **UU**, source: imported (natdex)
  Normal | BST 535 (85/80/70/135/75/90) | Abilities: Adaptability / Download / Analytic
  Engine stats @252 (neutral/positive): Adaptability: Atk 259/284, SpA 369/405, Spe 279/306 — Download: Atk 259/284, SpA 369/405, Spe 279/306 — Analytic: Atk 259/284, SpA 369/405, Spe 279/306
  Item: **free**
  STAB: Normal Uproar 90S
  Physical coverage: Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Flying Aerial Ace 60P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S

**Primarina** — species, **UU**, source: imported (natdex)
  Water/Fairy | BST 530 (80/74/74/126/116/60) | Abilities: Torrent / Liquid Voice
  Engine stats @252 (neutral/positive): Torrent: Atk 247/271, SpA 351/386, Spe 219/240 — Liquid Voice: Atk 247/271, SpA 351/386, Spe 219/240
  Item: **free**
  STAB: Water Hydro Pump 120S · Fairy Misty Explosion 100S
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Steel Iron Tail 100P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Psychic Psychic 90S, Ghost Shadow Ball 80S

**Pyroar-Mega** — forme, **UU**, source: override
  Fire/Normal | BST 607 (86/88/92/129/86/126) | Abilities: Fire Mane
  Engine stats @252 (neutral/positive): Fire Mane: Atk 275/302, SpA 357/392, Spe 351/386
  Item: **Pyroarite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Pyroar (ZU), pre-Mega abilities Rivalry / Unnerve / Moxie, pre-Mega Spe 342 (max +Spe)
  STAB: Fire Overheat 140S · Normal Double-Edge 120P
  Physical coverage: Steel Iron Tail 100P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Dark Crunch 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Dark Dark Pulse 80S, Ground Mud-Slap 20S

**Quaquaval** — species, **UU**, source: imported (natdex)
  Water/Fighting | BST 530 (85/120/80/85/75/85) | Abilities: Torrent / Moxie
  Engine stats @252 (neutral/positive): Torrent: Atk 339/372, SpA 269/295, Spe 269/295 — Moxie: Atk 339/372, SpA 269/295, Spe 269/295
  Item: **free**
  STAB: Water Hydro Pump 120S · Fighting Close Combat 120P
  Physical coverage: Normal Last Resort 140P, Flying Brave Bird 120P, Ice Ice Spinner 80P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Flying Hurricane 120S, Normal Tera Blast 80S, Ice Icy Wind 55S, Fairy Disarming Voice 40S

**Raichu-Mega-Y** — forme, **UU**, source: override
  Electric | BST 585 (60/100/55/160/80/130) | Abilities: No Guard
  Engine stats @252 (neutral/positive): No Guard: Atk 299/328, SpA 419/460, Spe 359/394
  Item: **Raichunite Y** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Raichu (ZU), pre-Mega abilities Static / Lightning Rod, pre-Mega Spe 350 (max +Spe)
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Grass Grass Knot 60S

**Regieleki** — species, **UU**, source: override
  Electric | BST 580 (80/100/50/100/50/200) | Abilities: Transistor
  Engine stats @252 (neutral/positive): Transistor: Atk 299/328, SpA 299/328, Spe 499/548
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Explosion 250P, Flying Acrobatics 110P, Dark Assurance 60P
  Special coverage: Normal Tera Blast 80S, Rock Ancient Power 60S

**Rotom-Wash** — species, **UU**, source: imported (natdex)
  Electric/Water | BST 520 (50/65/107/105/107/86) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 229/251, SpA 309/339, Spe 271/298
  Item: **free**
  STAB: Electric Thunder 120S · Water Hydro Pump 120S
  Physical coverage: Ghost Poltergeist 110P, Normal Return 102P, Dark Foul Play 95P
  Special coverage: Psychic Dream Eater 100S, Normal Hyper Voice 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Fairy Disarming Voice 40S

**Sableye-Mega** — forme, **UU**, source: imported (natdex)
  Dark/Ghost | BST 480 (50/85/125/85/115/20) | Abilities: Magic Bounce
  Engine stats @252 (neutral/positive): Magic Bounce: Atk 269/295, SpA 269/295, Spe 139/152
  Item: **Sablenite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Sableye (ZU), pre-Mega abilities Keen Eye / Stall / Prankster, pre-Mega Spe 218 (max +Spe)
  STAB: Dark Foul Play 95P · Ghost Poltergeist 110P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P, Psychic Zen Headbutt 80P
  Special coverage: Psychic Dream Eater 100S, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Rock Power Gem 80S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Salamence** — species, **UU**, source: imported (natdex)
  Dragon/Flying | BST 600 (95/135/80/110/80/100) | Abilities: Intimidate / Moxie
  Engine stats @252 (neutral/positive): Intimidate: Atk 369/405, SpA 319/350, Spe 299/328 — Moxie: Atk 369/405, SpA 319/350, Spe 299/328
  Item: **free**
  STAB: Dragon Draco Meteor 140S · Flying Hurricane 120S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P
  Special coverage: Fire Fire Blast 120S, Water Hydro Pump 120S, Normal Hyper Voice 90S, Ghost Ominous Wind 60S, Ground Mud-Slap 20S

**Scizor** — species, **UU**, source: imported (natdex)
  Bug/Steel | BST 500 (70/130/100/55/80/65) | Abilities: Swarm / Technician / Light Metal
  Engine stats @252 (neutral/positive): Swarm: Atk 359/394, SpA 209/229, Spe 229/251 — Technician: Atk 359/394, SpA 209/229, Spe 229/251 — Light Metal: Atk 359/394, SpA 209/229, Spe 229/251
  Item: **free**
  STAB: Bug Lunge 80P · Steel Hard Press 100P
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Flying Acrobatics 110P, Poison Cross Poison 70P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Poison Venoshock 65S, Ghost Ominous Wind 60S, Fighting Vacuum Wave 40S

**Scolipede** — species, **UU**, source: imported (natdex)
  Bug/Poison | BST 485 (60/100/89/55/69/112) | Abilities: Poison Point / Swarm / Speed Boost / Quick Feet
  Engine stats @252 (neutral/positive): Poison Point: Atk 299/328, SpA 209/229, Spe 323/355 — Swarm: Atk 299/328, SpA 209/229, Spe 323/355 — Speed Boost: Atk 299/328, SpA 209/229, Spe 323/355 — Quick Feet: Atk 299/328, SpA 209/229, Spe 323/355
  Item: **free**
  STAB: Bug Megahorn 120P · Poison Poison Jab 80P
  Physical coverage: Steel Steel Roller 130P, Normal Double-Edge 120P, Fighting Superpower 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Dark Throat Chop 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Ghost Hex 65S, Normal Hidden Power 60S

**Scolipede-Mega** — forme, **UU**, source: override
  Bug/Poison | BST 585 (60/140/149/75/99/62) | Abilities: Shell Armor
  Engine stats @252 (neutral/positive): Shell Armor: Atk 379/416, SpA 249/273, Spe 223/245
  Item: **Scolipite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Scolipede (UU), pre-Mega abilities Poison Point / Swarm / Speed Boost / Quick Feet, pre-Mega Spe 355 (max +Spe)
  STAB: Bug Megahorn 120P · Poison Poison Jab 80P
  Physical coverage: Steel Steel Roller 130P, Normal Double-Edge 120P, Fighting Superpower 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Dark Throat Chop 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Ghost Hex 65S, Normal Hidden Power 60S

**Scrafty-Mega** — forme, **UU**, source: override
  Dark/Fighting | BST 588 (65/130/135/55/135/68) | Abilities: Intimidate
  Engine stats @252 (neutral/positive): Intimidate: Atk 359/394, SpA 209/229, Spe 235/258
  Item: **Scraftinite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Scrafty (NU), pre-Mega abilities Shed Skin / Moxie / Intimidate, pre-Mega Spe 236 (max +Spe)
  STAB: Dark Foul Play 95P · Fighting Focus Punch 150P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P
  Special coverage: Dragon Dragon Pulse 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Grass Grass Knot 60S, Fire Incinerate 60S

**Serperior** — species, **UU**, source: imported (natdex)
  Grass | BST 528 (75/75/95/75/95/113) | Abilities: Overgrow / Contrary
  Engine stats @252 (neutral/positive): Overgrow: Atk 249/273, SpA 249/273, Spe 325/357 — Contrary: Atk 249/273, SpA 249/273, Spe 325/357
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Water Aqua Tail 90P, Dark Knock Off 65P, Flying Aerial Ace 60P
  Special coverage: Normal Wring Out 120S, Dragon Dragon Pulse 90S, Psychic Mirror Coat fixedS

**Sharpedo-Mega** — forme, **UU**, source: imported (natdex)
  Water/Dark | BST 560 (70/140/70/110/65/105) | Abilities: Strong Jaw
  Engine stats @252 (neutral/positive): Strong Jaw: Atk 379/416, SpA 319/350, Spe 309/339
  Item: **Sharpedonite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Sharpedo (RU), pre-Mega abilities Rough Skin / Speed Boost, pre-Mega Spe 317 (max +Spe)
  STAB: Water Hydro Pump 120S · Dark Crunch 80P
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Ground Earthquake 100P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Rock Ancient Power 60S, Ground Mud-Slap 20S

**Skarmory** — species, **UU**, source: imported (natdex)
  Steel/Flying | BST 465 (65/80/140/40/70/70) | Abilities: Keen Eye / Sturdy / Weak Armor
  Engine stats @252 (neutral/positive): Keen Eye: Atk 259/284, SpA 179/196, Spe 239/262 — Sturdy: Atk 259/284, SpA 179/196, Spe 239/262 — Weak Armor: Atk 259/284, SpA 179/196, Spe 239/262
  Item: **free**
  STAB: Steel Iron Head 80P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Fighting Body Press 80P, Ground Drill Run 80P, Bug X-Scissor 80P, Rock Rock Slide 75P, Dark Night Slash 70P
  Special coverage: Dark Dark Pulse 80S, Normal Tera Blast 80S, Ghost Ominous Wind 60S, Ice Icy Wind 55S, Dragon Twister 40S, Ground Mud-Slap 20S

**Skarmory-Mega** — forme, **UU**, source: override
  Steel/Flying | BST 565 (65/140/110/40/100/110) | Abilities: Stalwart
  Engine stats @252 (neutral/positive): Stalwart: Atk 379/416, SpA 179/196, Spe 319/350
  Item: **Skarmorite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Skarmory (UU), pre-Mega abilities Keen Eye / Sturdy / Weak Armor, pre-Mega Spe 262 (max +Spe)
  STAB: Steel Iron Head 80P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Fighting Body Press 80P, Ground Drill Run 80P, Bug X-Scissor 80P, Rock Rock Slide 75P, Dark Night Slash 70P
  Special coverage: Dark Dark Pulse 80S, Normal Tera Blast 80S, Ghost Ominous Wind 60S, Ice Icy Wind 55S, Dragon Twister 40S, Ground Mud-Slap 20S

**Slowbro** — species, **UU**, source: override
  Water/Psychic | BST 490 (95/75/110/100/80/30) | Abilities: Oblivious / Own Tempo / Regenerator
  Engine stats @252 (neutral/positive): Oblivious: Atk 249/273, SpA 299/328, Spe 159/174 — Own Tempo: Atk 249/273, SpA 299/328, Spe 159/174 — Regenerator: Atk 249/273, SpA 299/328, Spe 159/174
  Item: **free**
  STAB: Water Hydro Pump 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Ice Ice Punch 75P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Zap Cannon 120S, Ghost Shadow Ball 80S

**Slowbro-Mega** — forme, **UU**, source: imported (natdex)
  Water/Psychic | BST 590 (95/75/180/130/80/30) | Abilities: Shell Armor
  Engine stats @252 (neutral/positive): Shell Armor: Atk 249/273, SpA 359/394, Spe 159/174
  Item: **Slowbronite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Slowbro (UU), pre-Mega abilities Oblivious / Own Tempo / Regenerator, pre-Mega Spe 174 (max +Spe)
  STAB: Water Hydro Pump 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Ice Ice Punch 75P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Zap Cannon 120S, Ghost Shadow Ball 80S

**Slowking** — species, **UU**, source: imported (natdex)
  Water/Psychic | BST 490 (95/75/80/100/110/30) | Abilities: Oblivious / Own Tempo / Regenerator
  Engine stats @252 (neutral/positive): Oblivious: Atk 249/273, SpA 299/328, Spe 159/174 — Own Tempo: Atk 249/273, SpA 299/328, Spe 159/174 — Regenerator: Atk 249/273, SpA 299/328, Spe 159/174
  Item: **free**
  STAB: Water Hydro Pump 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Fire Fire Punch 75P
  Special coverage: Normal Trump Card 200S, Poison Belch 120S, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Zap Cannon 120S

**Staraptor-Mega** — forme, **UU**, source: override
  Fighting/Flying | BST 585 (85/140/100/60/90/110) | Abilities: Contrary
  Engine stats @252 (neutral/positive): Contrary: Atk 379/416, SpA 219/240, Spe 319/350
  Item: **Staraptite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Staraptor (NU), pre-Mega abilities Intimidate / Reckless, pre-Mega Spe 328 (max +Spe)
  STAB: Fighting Close Combat 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Thief 60P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Normal Uproar 90S, Ghost Ominous Wind 60S, Bug Struggle Bug 50S, Dragon Twister 40S, Ground Mud-Slap 20S

**Starmie-Mega** — forme, **UU**, source: override
  Water/Psychic | BST 620 (60/100/105/130/105/120) | Abilities: Huge Power
  Engine stats @252 (neutral/positive): Huge Power: Atk 598/656, SpA 359/394, Spe 339/372
  Item: **Starminite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Starmie (NU), pre-Mega abilities Illuminate / Natural Cure / Analytic, pre-Mega Spe 361 (max +Spe)
  STAB: Water Waterfall 80P · Psychic Psycho Cut 70P
  Physical coverage: Normal Skull Bash 130P, Ice Avalanche 60P, Rock Rollout 30P, Steel Gyro Ball 14P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Normal Tri Attack 80S

**Swampert** — species, **UU**, source: imported (natdex)
  Water/Ground | BST 535 (100/110/90/85/90/60) | Abilities: Torrent / Damp
  Engine stats @252 (neutral/positive): Torrent: Atk 319/350, SpA 269/295, Spe 219/240 — Damp: Atk 319/350, SpA 269/295, Spe 219/240
  Item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Hard Press 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Uproar 90S, Rock Ancient Power 60S, Psychic Mirror Coat fixedS

**Swampert-Mega** — forme, **UU**, source: imported (natdex)
  Water/Ground | BST 635 (100/150/110/95/110/70) | Abilities: Swift Swim
  Engine stats @252 (neutral/positive): Swift Swim: Atk 399/438, SpA 289/317, Spe 239/262
  Item: **Swampertite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Swampert (UU), pre-Mega abilities Torrent / Damp, pre-Mega Spe 240 (max +Spe)
  STAB: Water Aqua Tail 90P · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Hard Press 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Uproar 90S, Rock Ancient Power 60S, Psychic Mirror Coat fixedS

**Tapu Fini** — species, **UU**, source: imported (natdex)
  Water/Fairy | BST 570 (70/75/115/95/130/85) | Abilities: Misty Surge / Telepathy
  Engine stats @252 (neutral/positive): Misty Surge: Atk 249/273, SpA 289/317, Spe 269/295 — Telepathy: Atk 249/273, SpA 289/317, Spe 269/295
  Item: **free**
  STAB: Water Hydro Pump 120S · Fairy Moonblast 95S
  Physical coverage: Normal Return 102P, Ice Ice Punch 75P, Steel Smart Strike 70P, Dark Knock Off 65P
  Special coverage: Ice Blizzard 120S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Normal Hidden Power 60S, Psychic Stored Power 20S

**Terrakion** — species, **UU**, source: imported (natdex)
  Rock/Fighting | BST 580 (91/129/90/72/90/108) | Abilities: Justified
  Engine stats @252 (neutral/positive): Justified: Atk 357/392, SpA 243/267, Spe 315/346
  Item: **free**
  STAB: Rock Stone Edge 100P · Fighting Close Combat 120P
  Physical coverage: Normal Double-Edge 120P, Bug Megahorn 120P, Ground Earthquake 100P, Steel Iron Head 80P, Poison Poison Jab 80P, Psychic Zen Headbutt 80P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S, Flying Air Slash 75S

**Thundurus** — species, **UU**, source: imported (natdex)
  Electric/Flying | BST 580 (79/115/70/125/80/111) | Abilities: Prankster / Defiant
  Engine stats @252 (neutral/positive): Prankster: Atk 329/361, SpA 349/383, Spe 321/353 — Defiant: Atk 329/361, SpA 349/383, Spe 321/353
  Item: **free**
  STAB: Electric Thunder 120S · Flying Acrobatics 110P
  Physical coverage: Fighting Superpower 120P, Normal Thrash 120P, Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Bug U-turn 70P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Wave 95S, Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S

**Thundurus-Therian** — species, **UU**, source: override
  Electric/Flying | BST 580 (79/105/70/145/80/101) | Abilities: Volt Absorb
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 309/339, SpA 389/427, Spe 301/331
  Item: **free**
  STAB: Electric Thunder 120S · Flying Acrobatics 110P
  Physical coverage: Fighting Superpower 120P, Normal Thrash 120P, Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Bug U-turn 70P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Wave 95S, Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S

**Tyranitar** — species, **UU**, source: imported (natdex)
  Rock/Dark | BST 600 (100/134/110/95/100/61) | Abilities: Sand Stream / Unnerve
  Engine stats @252 (neutral/positive): Sand Stream: Atk 367/403, SpA 289/317, Spe 221/243 — Unnerve: Atk 367/403, SpA 289/317, Spe 221/243
  Item: **free**
  STAB: Rock Stone Edge 100P · Dark Foul Play 95P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Hard Press 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S

**Ursaluna** — species, **UU**, source: imported (natdex)
  Ground/Normal | BST 550 (130/140/105/45/80/50) | Abilities: Guts / Bulletproof / Unnerve
  Engine stats @252 (neutral/positive): Guts: Atk 379/416, SpA 189/207, Spe 199/218 — Bulletproof: Atk 379/416, SpA 189/207, Spe 199/218 — Unnerve: Atk 379/416, SpA 189/207, Spe 199/218
  Item: **free**
  STAB: Ground Headlong Rush 120P · Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Electric Supercell Slam 100P, Fairy Play Rough 90P
  Special coverage: Fighting Focus Blast 120S, Electric Zap Cannon 120S

**Venusaur-Mega** — forme, **UU**, source: imported (natdex)
  Grass/Poison | BST 625 (80/100/123/122/120/80) | Abilities: Thick Fat
  Engine stats @252 (neutral/positive): Thick Fat: Atk 299/328, SpA 343/377, Spe 259/284
  Item: **Venusaurite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Venusaur (ZU), pre-Mega abilities Overgrow / Chlorophyll, pre-Mega Spe 284 (max +Spe)
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Ground Earthquake 100P, Dark Knock Off 65P, Bug Fury Cutter 40P, Fighting Rock Smash 40P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S

**Victini** — species, **UU**, source: imported (natdex)
  Psychic/Fire | BST 600 (100/100/100/100/100/100) | Abilities: Victory Star
  Engine stats @252 (neutral/positive): Victory Star: Atk 299/328, SpA 299/328, Spe 299/328
  Item: **free**
  STAB: Psychic Future Sight 120S · Fire V-create 180P
  Physical coverage: Normal Last Resort 140P, Electric Bolt Strike 130P, Flying Bounce 85 (charge)P, Fighting Brick Break 75P, Bug U-turn 70P, Dark Fling 30P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S

**Weavile** — species, **UU**, source: override
  Dark/Ice | BST 510 (70/120/65/45/85/125) | Abilities: Pressure / Pickpocket
  Engine stats @252 (neutral/positive): Pressure: Atk 339/372, SpA 189/207, Spe 349/383 — Pickpocket: Atk 339/372, SpA 189/207, Spe 349/383
  Item: **free**
  STAB: Dark Foul Play 95P · Ice Icicle Crash 85P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Psychic Dream Eater 100S, Water Surf 95S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Mud-Slap 20S

**Zapdos-Galar** — species, **UU**, source: override
  Fighting/Flying | BST 580 (90/125/90/85/90/100) | Abilities: Defiant
  Engine stats @252 (neutral/positive): Defiant: Atk 349/383, SpA 269/295, Spe 299/328
  Item: **free**
  STAB: Fighting Close Combat 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Electric Supercell Slam 100P, Fire Blaze Kick 85P, Dark Throat Chop 80P, Ground Stomping Tantrum 75P, Steel Steel Wing 70P
  Special coverage: Electric Thunder 120S, Fire Heat Wave 100S, Psychic Extrasensory 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Rock Ancient Power 60S

**Zeraora** — species, **UU**, source: imported (natdex)
  Electric | BST 600 (88/112/75/102/80/143) | Abilities: Volt Absorb
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 323/355, SpA 303/333, Spe 385/423
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Dragon Outrage 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Fairy Play Rough 90P
  Special coverage: Fighting Focus Blast 120S, Grass Grass Knot 60S, Normal Hidden Power 60S, Dark Snarl 55S

**Zoroark-Hisui** — species, **UU**, source: imported (natdex)
  Normal/Ghost | BST 510 (55/100/60/125/60/110) | Abilities: Illusion
  Engine stats @252 (neutral/positive): Illusion: Atk 299/328, SpA 349/383, Spe 319/350
  Item: **free**
  STAB: Normal Mega Kick 120P · Ghost Poltergeist 110P
  Physical coverage: Fighting Focus Punch 150P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Flying Bounce 85 (charge)P, Bug Skitter Smack 70P
  Special coverage: Fighting Focus Blast 120S, Fire Flamethrower 95S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Dark Night Daze 85S, Grass Grass Knot 60S
---

## F. Estimated-forme audit

**7 RU formes carry an `estimated` tier** — Smogon never ranked
them, so a nearest-neighbour model placed them by BST and base tier. **The model
has no notion of movepool, ability or item cost**, which is exactly what it got
wrong on Mega Starmie in the UU pass. These are the softest placements in RU.

**NU has 0 estimated formes.**

### Absol-Mega-Z

- Base **Absol** (PU), 65/130/60/75/60/75; pre-Mega abilities Pressure / Super Luck / Justified
- Item **Absolite Z** — forced, not removable, and it is the entire cost of the forme
- Dark/Ghost | BST 565 (65/154/60/75/60/151)
- Ability **Sharpness** — packaged: _This Pokemon's slicing moves have their power multiplied by 1.5._
- Speed: base 273 → Mega **441** (max +Spe)
- Engine offence @252+: Atk **447**, SpA **273**
- STAB Dark Foul Play 95P · Ghost Shadow Claw 70P | Setup Calm Mind, Hone Claws, Swords Dance | Recovery Rest | Priority Sucker Punch 80P Dark (+1), Feint 50P Normal (+2), Quick Attack 40P Normal (+1)
- Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Fairy Play Rough 90P
- Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Normal Razor Wind 80 (charge)S, Flying Air Slash 75S

### Chimecho-Mega

- Base **Chimecho** (ZU), 75/50/80/95/90/65; pre-Mega abilities Levitate
- Item **Chimechite** — forced, not removable, and it is the entire cost of the forme
- Psychic/Steel | BST 555 (75/50/110/135/120/65)
- Ability **Levitate** — packaged: _This Pokemon is immune to Ground; Gravity/Ingrain/Smack Down/Iron Ball nullify it._
- Speed: base 251 → Mega **251** (max +Spe)
- Engine offence @252+: Atk **218**, SpA **405**
- STAB Psychic Future Sight 120S | Setup Calm Mind, Cosmic Power, Defense Curl | Recovery Recover, Rest | Priority **none**
- Physical coverage: Normal Last Resort 140P, Dark Knock Off 65P, Ghost Astonish 30P, Rock Rollout 30P
- Special coverage: Grass Energy Ball 90S, Normal Hyper Voice 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Electric Shock Wave 60S

### Crabominable-Mega

- Base **Crabominable** (ZU), 97/132/77/62/67/43; pre-Mega abilities Hyper Cutter / Iron Fist / Anger Point
- Item **Crabominite** — forced, not removable, and it is the entire cost of the forme
- Fighting/Ice | BST 578 (97/157/122/62/107/33)
- Ability **Iron Fist** — packaged: _This Pokemon's punch-based attacks have 1.2x power. Sucker Punch is not boosted._
- Speed: base 203 → Mega **181** (max +Spe)
- Engine offence @252+: Atk **454**, SpA **245**
- STAB Fighting Focus Punch 150P · Ice Ice Hammer 100P | Setup Amnesia, Bulk Up, Iron Defense, Work Up | Recovery Rest | Priority Upper Hand 65P Fighting (+3)
- Physical coverage: Poison Gunk Shot 120P, Normal Return 102P, Water Crabhammer 100P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Hard Press 100P
- Special coverage: Water Scald 80S, Normal Tera Blast 80S, Ground Mud Shot 55S

### Falinks-Mega

- Base **Falinks** (ZU), 65/100/100/70/60/75; pre-Mega abilities Battle Armor / Defiant
- Item **Falinksite** — forced, not removable, and it is the entire cost of the forme
- Fighting | BST 570 (65/135/135/70/65/100)
- Ability **Defiant** — packaged: _This Pokemon's Attack is raised by 2 for each of its stats that is lowered by a foe._
- Speed: base 273 → Mega **328** (max +Spe)
- Engine offence @252+: Atk **405**, SpA **262**
- STAB Fighting Close Combat 120P | Setup Agility, Bulk Up, Iron Defense, No Retreat, Swords Dance | Recovery Rest | Priority First Impression 90P Bug (+2), Upper Hand 65P Fighting (+3)
- Physical coverage: Bug Megahorn 120P, Ground High Horsepower 95P, Normal Take Down 90P, Steel Iron Head 80P, Poison Poison Jab 80P, Dark Throat Chop 80P
- Special coverage: Normal Uproar 90S

### Froslass-Mega

- Base **Froslass** (ZU), 70/80/70/80/70/110; pre-Mega abilities Snow Cloak / Cursed Body
- Item **Froslassite** — forced, not removable, and it is the entire cost of the forme
- Ice/Ghost | BST 580 (70/80/70/140/100/120)
- Ability **Snow Warning** — packaged: _On switch-in, this Pokemon summons Snow._
- Speed: base 350 → Mega **372** (max +Spe)
- Engine offence @252+: Atk **284**, SpA **416**
- STAB Ice Blizzard 120S · Ghost Shadow Ball 80S | Setup **none** | Recovery Rest | Priority Sucker Punch 80P Dark (+1), Ice Shard 40P Ice (+1)
- Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Fighting Wake-Up Slap 70P, Grass Trailblaze 50P, Rock Rollout 30P
- Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Normal Tera Blast 80S, Bug Signal Beam 75S, Water Water Pulse 60S, Fairy Draining Kiss 50S

### Golurk-Mega

- Base **Golurk** (PU), 89/124/80/55/80/55; pre-Mega abilities Iron Fist / Klutz / No Guard
- Item **Golurkite** — forced, not removable, and it is the entire cost of the forme
- Ground/Ghost | BST 583 (89/159/105/70/105/55)
- Ability **Unseen Fist** — packaged: _This Pokemon's contact moves hit through protection at full damage._
- Speed: base 229 → Mega **229** (max +Spe)
- Engine offence @252+: Atk **458**, SpA **262**
- STAB Ground Earthquake 100P · Ghost Poltergeist 110P | Setup Defense Curl, Iron Defense, Rock Polish | Recovery Rest | Priority **none**
- Physical coverage: Normal Self-Destruct 200P, Fighting Focus Punch 150P, Fire Heat Crash 120P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Flying Fly 90 (charge)P
- Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Electric Thunderbolt 95S, Psychic Psychic 90S, Steel Flash Cannon 80S

### Malamar-Mega

- Base **Malamar** (ZU), 86/92/88/68/75/73; pre-Mega abilities Contrary / Suction Cups / Infiltrator
- Item **Malamarite** — forced, not removable, and it is the entire cost of the forme
- Dark/Psychic | BST 582 (86/102/88/98/120/88)
- Ability **Contrary** — packaged: _If this Pokemon has a stat stage raised it is lowered instead, and vice versa._
- Speed: base 269 → Mega **302** (max +Spe)
- Engine offence @252+: Atk **333**, SpA **324**
- STAB Dark Foul Play 95P · Psychic Future Sight 120S | Setup Calm Mind, Nasty Plot | Recovery Rest | Priority **none**
- Physical coverage: Fighting Superpower 120P, Normal Return 102P, Water Liquidation 85P, Bug Lunge 80P, Rock Rock Slide 75P, Flying Aerial Ace 60P
- Special coverage: Fire Flamethrower 95S, Electric Thunderbolt 95S, Normal Tera Blast 80S, Bug Signal Beam 75S
---

## G. Serious RU → UU candidate evidence

**No fixed cap.** 53 of 131 RU entries tripped two or
more mechanical flags in the scan; the 24 with usable
offensive sets get a full matrix below. Flags are reasons to look, not verdicts.

### Absol-Mega-Z

_Flagged for: Speed **441**; setup + priority + reliable recovery; strong setup on a fast frame; ability: Sharpness._

**Absol-Mega-Z** — forme, **RU**, source: **estimated** _(its own `species.tier` reads PU — the base's; the enforced tier is the one shown)_
  Dark/Ghost | BST 565 (65/154/60/75/60/151) | Abilities: Sharpness
  Engine stats @252 (neutral/positive): Sharpness: Atk 407/447, SpA 249/273, Spe 401/441
  Item: **Absolite Z** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Absol (PU), pre-Mega abilities Pressure / Super Luck / Justified, pre-Mega Spe 273 (max +Spe)
  STAB: Dark Foul Play 95P · Ghost Shadow Claw 70P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Fairy Play Rough 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Normal Razor Wind 80 (charge)S, Flying Air Slash 75S
  Setup: Calm Mind, Hone Claws, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Feint 50P Normal (+2), Quick Attack 40P Normal (+1)
  Pivot: Baton Pass
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Cleric: Wish
  Trapping: Mean Look
  Weather/terrain: Hail, Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Knock Off, Magic Coat, Perish Song, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass

Attacker: **Absol-Mega-Z**, jolly {"atk":252,"spe":252,"hp":4}, Absolite Z (forced) — a **representative test set**.

| RU defender (representative test set) | Foul Play | Shadow Claw | Close Combat | Double-Edge |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 40-47 (11.3-13.3%) | 58-68 (16.4-19.2%) | 130-153 (36.7-43.2%) | 32-38 (9-10.7%) |
| Steelix-Mega (physWall, no item) | 49-58 (13.8-16.4%) | 52-61 (14.7-17.2%) | 116-137 (32.8-38.7%) | 29-34 (8.2-9.6%) |
| Tangrowth (physWall, Leftovers) | 65-76 (16.1-18.8%) | 82-96 (20.3-23.8%) | 92-109 (22.8-27%) | 92-109 (22.8-27%) |
| Mandibuzz (physWall, Leftovers) | 26-30 (6.1-7.1%) | 46-54 (10.8-12.7%) | 104-123 (24.5-29%) | 104-123 (24.5-29%) |
| Forretress (physWall, Leftovers) | 55-65 (15.5-18.4%) | 75-89 (21.2-25.1%) | 85-100 (24-28.2%) | 42-50 (11.9-14.1%) |
| Empoleon (specWall, Leftovers) | 92-108 (24.7-29%) | 146-172 (39.2-46.2%) | 332-391 (89.2-105.1%) | 83-97 (22.3-26.1%) |
| Gastrodon (specWall, Leftovers) | 109-128 (25.6-30%) | 179-211 (42-49.5%) | 204-240 (47.9-56.3%) | 204-240 (47.9-56.3%) |
| Registeel (specWall, Leftovers) | 53-62 (14.6-17%) | 93-109 (25.5-29.9%) | 210-248 (57.7-68.1%) | 52-62 (14.3-17%) |
| Aggron-Mega (physWall, no item) | 54-64 (15.7-18.6%) | 52-61 (15.1-17.7%) | 87-102 (25.3-29.7%) | 29-34 (8.4-9.9%) |
| Crobat (physWall, Leftovers) | 79-94 (21.1-25.1%) | 109-129 (29.1-34.5%) | 31-36 (8.3-9.6%) | 124-146 (33.2-39%) |
| Roserade (specWall, Black Sludge) | 99-116 (30.6-35.8%) | 186-219 (57.4-67.6%) | 105-124 (32.4-38.3%) | 211-249 (65.1-76.9%) |
| Necrozma (physWall, Leftovers) | 118-139 (29.6-34.9%) | 141-166 (35.4-41.7%) | 53-62 (13.3-15.6%) | 107-125 (26.9-31.4%) |
| Torterra (physWall, Leftovers) | 78-92 (19.8-23.4%) | 92-108 (23.4-27.4%) | 104-123 (26.4-31.2%) | 104-123 (26.4-31.2%) |
| Weezing-Galar (physWall, Leftovers) | 30-36 (9-10.8%) | 84-99 (25.1-29.6%) | 23-28 (6.9-8.4%) | 95-112 (28.4-33.5%) |
| Celebi (specWall, Leftovers) | 187-221 (46.3-54.7%) | 263-310 (65.1-76.7%) | 74-87 (18.3-21.5%) | 149-175 (36.9-43.3%) |
| Togekiss (specWall, Leftovers) | 42-49 (11.2-13.1%) | 137-161 (36.6-43%) | 38-45 (10.2-12%) | 155-183 (41.4-48.9%) |
| Garganacl (physWall, Leftovers) | 63-74 (15.6-18.3%) | 39-47 (9.7-11.6%) | 180-212 (44.6-52.5%) | 45-53 (11.1-13.1%) |
| Donphan (physWall, Leftovers) | 78-91 (20.3-23.7%) | 84-99 (21.9-25.8%) | 95-112 (24.7-29.2%) | 95-112 (24.7-29.2%) |
| Comfey (specWall, Leftovers) | 30-36 (9.8-11.8%) | 143-169 (46.7-55.2%) | 81-95 (26.5-31%) | 163-191 (53.3-62.4%) |
| Nidoqueen (specWall, Leftovers) | 98-115 (25.5-29.9%) | 147-173 (38.3-45.1%) | 83-98 (21.6-25.5%) | 167-197 (43.5-51.3%) |

---

### Beedrill-Mega

_Flagged for: Speed **427**; strong setup on a fast frame; ability: Adaptability; hazards + real offence._

**Beedrill-Mega** — forme, **RU**, source: imported (natdex)
  Bug/Poison | BST 495 (65/150/40/15/80/145) | Abilities: Adaptability
  Engine stats @252 (neutral/positive): Adaptability: Atk 399/438, SpA 129/141, Spe 389/427
  Item: **Beedrillite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Beedrill (ZU), pre-Mega abilities Swarm / Sniper, pre-Mega Spe 273 (max +Spe)
  STAB: Bug Twineedle 50x2P · Poison Poison Jab 80P
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Ground Drill Run 80P, Dark Throat Chop 80P, Fighting Brick Break 75P, Flying Aerial Ace 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Flying Air Cutter 60S, Normal Hidden Power 60S, Ghost Ominous Wind 60S, Electric Electroweb 55S
  Setup: Agility, Harden, Iron Defense, Swords Dance
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Giga Drain, Mega Drain
  Hazards: Toxic Spikes
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Weather/terrain: Sunny Day
  Utility: Knock Off, Protect, Reflect, Substitute, Tailwind
  Notable: Knock Off, Substitute, Baton Pass, Tailwind

Attacker: **Beedrill-Mega**, jolly {"atk":252,"spe":252,"hp":4}, Beedrillite (forced) — a **representative test set**.

| RU defender (representative test set) | Twineedle | Poison Jab | Skull Bash | Outrage |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 54-64 (15.3-18.1%) | 0-0 (0-0%) | 34-40 (9.6-11.3%) | 32-37 (9-10.5%) |
| Steelix-Mega (physWall, no item) | 48-58 (13.6-16.4%) | 0-0 (0-0%) | 31-36 (8.8-10.2%) | 28-33 (7.9-9.3%) |
| Tangrowth (physWall, Leftovers) | 310-366 (76.7-90.6%) | 244-288 (60.4-71.3%) | 98-115 (24.3-28.5%) | 90-107 (22.3-26.5%) |
| Mandibuzz (physWall, Leftovers) | 174-204 (41-48.1%) | 137-162 (32.3-38.2%) | 110-130 (25.9-30.7%) | 102-120 (24.1-28.3%) |
| Forretress (physWall, Leftovers) | 70-84 (19.8-23.7%) | 0-0 (0-0%) | 45-53 (12.7-15%) | 41-49 (11.6-13.8%) |
| Empoleon (specWall, Leftovers) | 136-162 (36.6-43.5%) | 0-0 (0-0%) | 88-103 (23.7-27.7%) | 81-95 (21.8-25.5%) |
| Gastrodon (specWall, Leftovers) | 338-396 (79.3-93%) | 134-157 (31.5-36.9%) | 217-255 (50.9-59.9%) | 200-235 (46.9-55.2%) |
| Registeel (specWall, Leftovers) | 88-102 (24.2-28%) | 0-0 (0-0%) | 55-65 (15.1-17.9%) | 51-60 (14-16.5%) |
| Aggron-Mega (physWall, no item) | 48-58 (14-16.9%) | 0-0 (0-0%) | 31-36 (9-10.5%) | 28-33 (8.1-9.6%) |
| Crobat (physWall, Leftovers) | 50-60 (13.4-16%) | 81-96 (21.7-25.7%) | 132-155 (35.3-41.4%) | 122-143 (32.6-38.2%) |
| Roserade (specWall, Black Sludge) | 350-410 (108-126.5%) | 277-327 (85.5-100.9%) | 224-264 (69.1-81.5%) | 207-244 (63.9-75.3%) |
| Necrozma (physWall, Leftovers) | 266-314 (66.8-78.9%) | 141-166 (35.4-41.7%) | 113-133 (28.4-33.4%) | 104-123 (26.1-30.9%) |
| Torterra (physWall, Leftovers) | 348-410 (88.3-104.1%) | 137-162 (34.8-41.1%) | 110-130 (27.9-33%) | 102-120 (25.9-30.5%) |
| Weezing-Galar (physWall, Leftovers) | 38-46 (11.4-13.8%) | 125-148 (37.4-44.3%) | 101-119 (30.2-35.6%) | 0-0 (0-0%) |
| Celebi (specWall, Leftovers) | 992-1168 (245.5-289.1%) | 393-462 (97.3-114.4%) | 158-186 (39.1-46%) | 146-172 (36.1-42.6%) |
| Togekiss (specWall, Leftovers) | 64-76 (17.1-20.3%) | 410-482 (109.6-128.9%) | 165-194 (44.1-51.9%) | 0-0 (0-0%) |
| Garganacl (physWall, Leftovers) | 150-178 (37.1-44.1%) | 59-70 (14.6-17.3%) | 47-56 (11.6-13.9%) | 88-104 (21.8-25.7%) |
| Donphan (physWall, Leftovers) | 158-188 (41.1-49%) | 62-74 (16.1-19.3%) | 101-119 (26.3-31%) | 93-110 (24.2-28.6%) |
| Comfey (specWall, Leftovers) | 134-158 (43.8-51.6%) | 428-504 (139.9-164.7%) | 173-203 (56.5-66.3%) | 0-0 (0-0%) |
| Nidoqueen (specWall, Leftovers) | 138-162 (35.9-42.2%) | 55-64 (14.3-16.7%) | 178-209 (46.4-54.4%) | 164-193 (42.7-50.3%) |

---

### Meloetta-Pirouette

_Flagged for: Speed **390**; BST 600; setup + priority + reliable recovery; strong setup on a fast frame._

**Meloetta-Pirouette** — species, **RU**, source: override
  Normal/Fighting | BST 600 (100/128/90/77/77/128) | Abilities: Serene Grace
  Engine stats @252 (neutral/positive): Serene Grace: Atk 355/390, SpA 253/278, Spe 355/390
  Item: **free**
  STAB: Normal Last Resort 140P · Fighting Focus Punch 150P
  Physical coverage: Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Fairy Play Rough 90P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Grass Energy Ball 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
  Setup: Calm Mind, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Dream Eater
  Priority: Quick Attack 40P Normal (+1)
  Pivot: Baton Pass, U-turn
  Status: Sing, Thunder Wave, Toxic
  Cleric: Heal Bell
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Gravity, Knock Off, Light Screen, Magic Coat, Perish Song, Protect, Safeguard, Substitute, Trick, Trick Room
  Notable: Knock Off, Trick, Substitute, Baton Pass, Trick Room, Focus Punch

Attacker: **Meloetta-Pirouette**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Last Resort | Focus Punch | Acrobatics | Dual Chop |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 63-75 (17.8-21.2%) | 276-325 (78-91.8%) | 16-19 (4.5-5.4%) | 30-36 (8.5-10.2%) |
| Steelix-Mega (physWall, no item) | 57-67 (16.1-18.9%) | 247-291 (69.8-82.2%) | 15-18 (4.2-5.1%) | 28-32 (7.9-9%) |
| Tangrowth (physWall, Leftovers) | 183-215 (45.3-53.2%) | 196-231 (48.5-57.2%) | 98-115 (24.3-28.5%) | 88-104 (21.8-25.7%) |
| Mandibuzz (physWall, Leftovers) | 206-243 (48.6-57.3%) | 221-260 (52.1-61.3%) | 54-65 (12.7-15.3%) | 100-116 (23.6-27.4%) |
| Forretress (physWall, Leftovers) | 84-98 (23.7-27.7%) | 180-213 (50.8-60.2%) | 45-53 (12.7-15%) | 40-46 (11.3-13%) |
| Empoleon (specWall, Leftovers) | 163-193 (43.8-51.9%) | 705-829 (189.5-222.8%) | 42-50 (11.3-13.4%) | 78-92 (21-24.7%) |
| Gastrodon (specWall, Leftovers) | 405-477 (95.1-112%) | 434-510 (101.9-119.7%) | 106-126 (24.9-29.6%) | 194-228 (45.5-53.5%) |
| Registeel (specWall, Leftovers) | 104-122 (28.6-33.5%) | 447-526 (122.8-144.5%) | 27-32 (7.4-8.8%) | 48-58 (13.2-15.9%) |
| Aggron-Mega (physWall, no item) | 57-67 (16.6-19.5%) | 185-218 (53.8-63.4%) | 15-18 (4.4-5.2%) | 28-32 (8.1-9.3%) |
| Crobat (physWall, Leftovers) | 245-289 (65.5-77.3%) | 65-76 (17.4-20.3%) | 65-76 (17.4-20.3%) | 118-140 (31.6-37.4%) |
| Roserade (specWall, Black Sludge) | 419-494 (129.3-152.5%) | 224-263 (69.1-81.2%) | 222-261 (68.5-80.6%) | 202-236 (62.3-72.8%) |
| Necrozma (physWall, Leftovers) | 211-249 (53-62.6%) | 113-132 (28.4-33.2%) | 55-66 (13.8-16.6%) | 100-122 (25.1-30.7%) |
| Torterra (physWall, Leftovers) | 206-243 (52.3-61.7%) | 221-260 (56.1-66%) | 110-130 (27.9-33%) | 100-116 (25.4-29.4%) |
| Weezing-Galar (physWall, Leftovers) | 188-222 (56.3-66.5%) | 49-58 (14.7-17.4%) | 50-59 (15-17.7%) | 0-0 (0-0%) |
| Celebi (specWall, Leftovers) | 296-348 (73.3-86.1%) | 158-185 (39.1-45.8%) | 157-184 (38.9-45.5%) | 142-168 (35.1-41.6%) |
| Togekiss (specWall, Leftovers) | 309-364 (82.6-97.3%) | 81-96 (21.7-25.7%) | 81-96 (21.7-25.7%) | 0-0 (0-0%) |
| Garganacl (physWall, Leftovers) | 88-104 (21.8-25.7%) | 382-449 (94.6-111.1%) | 23-27 (5.7-6.7%) | 84-100 (20.8-24.8%) |
| Donphan (physWall, Leftovers) | 188-222 (49-57.8%) | 201-237 (52.3-61.7%) | 50-59 (13-15.4%) | 90-108 (23.4-28.1%) |
| Comfey (specWall, Leftovers) | 322-379 (105.2-123.9%) | 172-202 (56.2-66%) | 85-100 (27.8-32.7%) | 0-0 (0-0%) |
| Nidoqueen (specWall, Leftovers) | 332-391 (86.5-101.8%) | 178-209 (46.4-54.4%) | 88-104 (22.9-27.1%) | 160-188 (41.7-49%) |

---

### Sceptile-Mega

_Flagged for: Speed **427**; BST 630; setup + priority + reliable recovery; strong setup on a fast frame._

**Sceptile-Mega** — forme, **RU**, source: imported (natdex)
  Grass/Dragon | BST 630 (70/110/75/145/85/145) | Abilities: Lightning Rod
  Engine stats @252 (neutral/positive): Lightning Rod: Atk 319/350, SpA 389/427, Spe 389/427
  Item: **Sceptilite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Sceptile (ZU), pre-Mega abilities Overgrow / Unburden, pre-Mega Spe 372 (max +Spe)
  STAB: Grass Leaf Storm 140S · Dragon Outrage 120P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Ground Mud-Slap 20S
  Setup: Agility, Dragon Dance, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Drain Punch, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1), Upper Hand 65P Fighting (+3), Quick Attack 40P Normal (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Shed Tail
  Phazing: Dragon Tail, Roar
  Status: Grass Whistle, Toxic
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Detect, Leech Seed, Protect, Safeguard, Substitute
  Notable: Substitute, Focus Punch

Attacker: **Sceptile-Mega**, timid {"spa":252,"spe":252,"hp":4}, Sceptilite (forced) — a **representative test set**.

| RU defender (representative test set) | Leaf Storm | Outrage | Focus Blast | Tera Blast |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 353-416 (99.7-117.5%) | 28-33 (7.9-9.3%) | 404-476 (114.1-134.5%) | 67-79 (18.9-22.3%) |
| Steelix-Mega (physWall, no item) | 260-306 (73.4-86.4%) | 25-29 (7.1-8.2%) | 298-351 (84.2-99.2%) | 50-58 (14.1-16.4%) |
| Tangrowth (physWall, Leftovers) | 215-253 (53.2-62.6%) | 79-93 (19.6-23%) | 246-290 (60.9-71.8%) | 165-194 (40.8-48%) |
| Mandibuzz (physWall, Leftovers) | 130-153 (30.7-36.1%) | 89-105 (21-24.8%) | 149-175 (35.1-41.3%) | 100-117 (23.6-27.6%) |
| Forretress (physWall, Leftovers) | 94-110 (26.6-31.1%) | 36-43 (10.2-12.1%) | 215-253 (60.7-71.5%) | 72-84 (20.3-23.7%) |
| Empoleon (specWall, Leftovers) | 178-210 (47.8-56.5%) | 70-83 (18.8-22.3%) | 204-240 (54.8-64.5%) | 34-40 (9.1-10.8%) |
| Gastrodon (specWall, Leftovers) | 817-961 (191.8-225.6%) | 174-205 (40.8-48.1%) | 117-137 (27.5-32.2%) | 78-92 (18.3-21.6%) |
| Registeel (specWall, Leftovers) | 67-79 (18.4-21.7%) | 45-53 (12.4-14.6%) | 155-183 (42.6-50.3%) | 26-30 (7.1-8.2%) |
| Aggron-Mega (physWall, no item) | 150-176 (43.6-51.2%) | 25-29 (7.3-8.4%) | 257-303 (74.7-88.1%) | 57-67 (16.6-19.5%) |
| Crobat (physWall, Leftovers) | 75-88 (20.1-23.5%) | 106-125 (28.3-33.4%) | 42-50 (11.2-13.4%) | 115-135 (30.7-36.1%) |
| Roserade (specWall, Black Sludge) | 43-51 (13.3-15.7%) | 180-212 (55.6-65.4%) | 50-58 (15.4-17.9%) | 67-79 (20.7-24.4%) |
| Necrozma (physWall, Leftovers) | 275-323 (69.1-81.2%) | 91-108 (22.9-27.1%) | 78-92 (19.6-23.1%) | 105-124 (26.4-31.2%) |
| Torterra (physWall, Leftovers) | 285-336 (72.3-85.3%) | 89-105 (22.6-26.6%) | 163-192 (41.4-48.7%) | 109-128 (27.7-32.5%) |
| Weezing-Galar (physWall, Leftovers) | 166-196 (49.7-58.7%) | 0-0 (0-0%) | 47-56 (14.1-16.8%) | 127-150 (38-44.9%) |
| Celebi (specWall, Leftovers) | 90-106 (22.3-26.2%) | 127-150 (31.4-37.1%) | 51-60 (12.6-14.9%) | 69-81 (17.1-20%) |
| Togekiss (specWall, Leftovers) | 82-96 (21.9-25.7%) | 0-0 (0-0%) | 23-27 (6.1-7.2%) | 63-74 (16.8-19.8%) |
| Garganacl (physWall, Leftovers) | 545-641 (134.9-158.7%) | 77-91 (19.1-22.5%) | 312-367 (77.2-90.8%) | 52-61 (12.9-15.1%) |
| Donphan (physWall, Leftovers) | 383-383 (99.7-99.7%) | 82-96 (21.4-25%) | 215-253 (56-65.9%) | 144-169 (37.5-44%) |
| Comfey (specWall, Leftovers) | 169-199 (55.2-65%) | 0-0 (0-0%) | 48-57 (15.7-18.6%) | 65-76 (21.2-24.8%) |
| Nidoqueen (specWall, Leftovers) | 200-235 (52.1-61.2%) | 143-168 (37.2-43.8%) | 57-67 (14.8-17.4%) | 77-90 (20.1-23.4%) |

---

### Talonflame

_Flagged for: Speed **386**; setup + priority + reliable recovery; strong setup on a fast frame; ability: Gale Wings._

**Talonflame** — species, **RU**, source: imported (natdex)
  Fire/Flying | BST 499 (78/81/71/74/69/126) | Abilities: Flame Body / Gale Wings
  Engine stats @252 (neutral/positive): Flame Body: Atk 261/287, SpA 247/271, Spe 351/386 — Gale Wings: Atk 261/287, SpA 247/271, Spe 351/386
  Item: **free**
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

Attacker: **Talonflame**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Overheat | Brave Bird | Double-Edge | Steel Wing |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 393-462 (111-130.5%) | 40-48 (11.3-13.6%) | 27-32 (7.6-9%) | 15-19 (4.2-5.4%) |
| Steelix-Mega (physWall, no item) | 291-341 (82.2-96.3%) | 36-42 (10.2-11.9%) | 24-28 (6.8-7.9%) | 14-16 (4-4.5%) |
| Tangrowth (physWall, Leftovers) | 478-564 (118.3-139.6%) | 234-275 (57.9-68.1%) | 78-91 (19.3-22.5%) | 45-54 (11.1-13.4%) |
| Mandibuzz (physWall, Leftovers) | 145-170 (34.2-40.1%) | 131-154 (30.9-36.3%) | 87-102 (20.5-24.1%) | 52-61 (12.3-14.4%) |
| Forretress (physWall, Leftovers) | 353-353 (99.7-99.7%) | 107-126 (30.2-35.6%) | 35-41 (9.9-11.6%) | 20-24 (5.6-6.8%) |
| Empoleon (specWall, Leftovers) | 100-117 (26.9-31.5%) | 104-122 (28-32.8%) | 68-81 (18.3-21.8%) | 19-23 (5.1-6.2%) |
| Gastrodon (specWall, Leftovers) | 57-66 (13.4-15.5%) | 256-301 (60.1-70.7%) | 170-200 (39.9-46.9%) | 49-58 (11.5-13.6%) |
| Registeel (specWall, Leftovers) | 153-179 (42-49.2%) | 66-78 (18.1-21.4%) | 44-52 (12.1-14.3%) | 26-29 (7.1-8%) |
| Aggron-Mega (physWall, no item) | 250-294 (72.7-85.5%) | 36-42 (10.5-12.2%) | 24-28 (7-8.1%) | 14-16 (4.1-4.7%) |
| Crobat (physWall, Leftovers) | 166-196 (44.4-52.4%) | 156-183 (41.7-48.9%) | 104-122 (27.8-32.6%) | 61-72 (16.3-19.3%) |
| Roserade (specWall, Black Sludge) | 196-230 (60.5-71%) | 531-625 (163.9-192.9%) | 176-208 (54.3-64.2%) | 104-122 (32.1-37.7%) |
| Necrozma (physWall, Leftovers) | 153-180 (38.4-45.2%) | 133-158 (33.4-39.7%) | 89-105 (22.4-26.4%) | 53-62 (13.3-15.6%) |
| Torterra (physWall, Leftovers) | 318-374 (80.7-94.9%) | 262-309 (66.5-78.4%) | 87-102 (22.1-25.9%) | 52-61 (13.2-15.5%) |
| Weezing-Galar (physWall, Leftovers) | 185-218 (55.4-65.3%) | 119-141 (35.6-42.2%) | 79-93 (23.7-27.8%) | 94-111 (28.1-33.2%) |
| Celebi (specWall, Leftovers) | 201-237 (49.8-58.7%) | 375-442 (92.8-109.4%) | 124-146 (30.7-36.1%) | 72-87 (17.8-21.5%) |
| Togekiss (specWall, Leftovers) | 92-107 (24.6-28.6%) | 195-230 (52.1-61.5%) | 130-153 (34.8-40.9%) | 153-180 (40.9-48.1%) |
| Garganacl (physWall, Leftovers) | 75-88 (18.6-21.8%) | 55-66 (13.6-16.3%) | 37-44 (9.2-10.9%) | 89-105 (22-26%) |
| Donphan (physWall, Leftovers) | 209-245 (54.4-63.8%) | 119-141 (31-36.7%) | 79-93 (20.6-24.2%) | 46-55 (12-14.3%) |
| Comfey (specWall, Leftovers) | 94-111 (30.7-36.3%) | 204-240 (66.7-78.4%) | 136-159 (44.4-52%) | 161-189 (52.6-61.8%) |
| Nidoqueen (specWall, Leftovers) | 111-131 (28.9-34.1%) | 210-247 (54.7-64.3%) | 140-165 (36.5-43%) | 81-97 (21.1-25.3%) |

---

### Cobalion

_Flagged for: BST 580; setup + priority + reliable recovery; strong setup on a fast frame._

**Cobalion** — species, **RU**, source: imported (natdex)
  Steel/Fighting | BST 580 (91/90/129/90/72/108) | Abilities: Justified
  Engine stats @252 (neutral/positive): Justified: Atk 279/306, SpA 279/306, Spe 315/346
  Item: **free**
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

Attacker: **Cobalion**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Steel Beam | Close Combat | Double-Edge | Megahorn |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 114-135 (32.2-38.1%) | 175-206 (49.4-58.2%) | 28-33 (7.9-9.3%) | 28-33 (7.9-9.3%) |
| Steelix-Mega (physWall, no item) | 84-100 (23.7-28.2%) | 157-185 (44.4-52.3%) | 26-29 (7.3-8.2%) | 26-29 (7.3-8.2%) |
| Tangrowth (physWall, Leftovers) | 280-330 (69.3-81.7%) | 124-146 (30.7-36.1%) | 83-97 (20.5-24%) | 166-195 (41.1-48.3%) |
| Mandibuzz (physWall, Leftovers) | 170-200 (40.1-47.2%) | 140-165 (33-38.9%) | 93-109 (21.9-25.7%) | 93-109 (21.9-25.7%) |
| Forretress (physWall, Leftovers) | 122-144 (34.5-40.7%) | 114-135 (32.2-38.1%) | 37-44 (10.5-12.4%) | 37-44 (10.5-12.4%) |
| Empoleon (specWall, Leftovers) | 28-33 (7.5-8.9%) | 445-523 (119.6-140.6%) | 74-87 (19.9-23.4%) | 74-87 (19.9-23.4%) |
| Gastrodon (specWall, Leftovers) | 66-78 (15.5-18.3%) | 274-322 (64.3-75.6%) | 182-214 (42.7-50.2%) | 182-214 (42.7-50.2%) |
| Registeel (specWall, Leftovers) | 44-52 (12.1-14.3%) | 283-334 (77.7-91.8%) | 46-54 (12.6-14.8%) | 46-54 (12.6-14.8%) |
| Aggron-Mega (physWall, no item) | 97-114 (28.2-33.1%) | 117-138 (34-40.1%) | 26-29 (7.6-8.4%) | 26-29 (7.6-8.4%) |
| Crobat (physWall, Leftovers) | 195-230 (52.1-61.5%) | 41-48 (11-12.8%) | 110-131 (29.4-35%) | 27-32 (7.2-8.6%) |
| Roserade (specWall, Black Sludge) | 114-133 (35.2-41%) | 141-166 (43.5-51.2%) | 188-222 (58-68.5%) | 188-222 (58-68.5%) |
| Necrozma (physWall, Leftovers) | 179-210 (45-52.8%) | 71-84 (17.8-21.1%) | 94-111 (23.6-27.9%) | 143-168 (35.9-42.2%) |
| Torterra (physWall, Leftovers) | 185-219 (47-55.6%) | 140-165 (35.5-41.9%) | 93-109 (23.6-27.7%) | 187-219 (47.5-55.6%) |
| Weezing-Galar (physWall, Leftovers) | 435-512 (130.2-153.3%) | 31-37 (9.3-11.1%) | 84-100 (25.1-29.9%) | 20-24 (6-7.2%) |
| Celebi (specWall, Leftovers) | 118-139 (29.2-34.4%) | 100-117 (24.8-29%) | 132-157 (32.7-38.9%) | 534-629 (132.2-155.7%) |
| Togekiss (specWall, Leftovers) | 215-253 (57.5-67.6%) | 52-61 (13.9-16.3%) | 139-163 (37.2-43.6%) | 33-40 (8.8-10.7%) |
| Garganacl (physWall, Leftovers) | 356-418 (88.1-103.5%) | 243-286 (60.1-70.8%) | 40-46 (9.9-11.4%) | 80-94 (19.8-23.3%) |
| Donphan (physWall, Leftovers) | 245-288 (63.8-75%) | 127-150 (33.1-39.1%) | 84-100 (21.9-26%) | 84-100 (21.9-26%) |
| Comfey (specWall, Leftovers) | 222-261 (72.5-85.3%) | 109-128 (35.6-41.8%) | 145-171 (47.4-55.9%) | 72-85 (23.5-27.8%) |
| Nidoqueen (specWall, Leftovers) | 131-154 (34.1-40.1%) | 111-131 (28.9-34.1%) | 149-175 (38.8-45.6%) | 74-87 (19.3-22.7%) |

---

### Crobat

_Flagged for: Speed **394**; setup + priority + reliable recovery; strong setup on a fast frame._

**Crobat** — species, **RU**, source: imported (natdex)
  Poison/Flying | BST 535 (85/90/80/70/80/130) | Abilities: Inner Focus / Infiltrator
  Engine stats @252 (neutral/positive): Inner Focus: Atk 279/306, SpA 239/262, Spe 359/394 — Infiltrator: Atk 279/306, SpA 239/262, Spe 359/394
  Item: **free**
  STAB: Poison Sludge Bomb 90S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Bug Leech Life 80P, Psychic Zen Headbutt 80P, Steel Steel Wing 70P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Grass Giga Drain 75S, Dragon Twister 40S
  Setup: Agility, Nasty Plot
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Absorb, Giga Drain, Leech Life, Mega Drain
  Priority: Quick Attack 40P Normal (+1)
  Removal: Defog
  Pivot: U-turn
  Phazing: Whirlwind
  Status: Hypnosis, Toxic
  Trapping: Mean Look
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Haze, Protect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

Attacker: **Crobat**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Sludge Bomb | Sky Attack | Double-Edge | Crunch |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 0-0 (0-0%) | 50-59 (14.1-16.7%) | 28-33 (7.9-9.3%) | 39-46 (11-13%) |
| Steelix-Mega (physWall, no item) | 0-0 (0-0%) | 45-53 (12.7-15%) | 26-29 (7.3-8.2%) | 35-41 (9.9-11.6%) |
| Tangrowth (physWall, Leftovers) | 297-349 (73.5-86.4%) | 289-341 (71.5-84.4%) | 83-97 (20.5-24%) | 55-65 (13.6-16.1%) |
| Mandibuzz (physWall, Leftovers) | 89-106 (21-25%) | 162-192 (38.2-45.3%) | 93-109 (21.9-25.7%) | 31-36 (7.3-8.5%) |
| Forretress (physWall, Leftovers) | 0-0 (0-0%) | 133-157 (37.6-44.4%) | 37-44 (10.5-12.4%) | 52-61 (14.7-17.2%) |
| Empoleon (specWall, Leftovers) | 0-0 (0-0%) | 128-152 (34.4-40.9%) | 74-87 (19.9-23.4%) | 98-117 (26.3-31.5%) |
| Gastrodon (specWall, Leftovers) | 35-41 (8.2-9.6%) | 318-375 (74.6-88%) | 182-214 (42.7-50.2%) | 122-144 (28.6-33.8%) |
| Registeel (specWall, Leftovers) | 0-0 (0-0%) | 81-96 (22.3-26.4%) | 46-54 (12.6-14.8%) | 63-74 (17.3-20.3%) |
| Aggron-Mega (physWall, no item) | 0-0 (0-0%) | 45-53 (13.1-15.4%) | 26-29 (7.6-8.4%) | 35-41 (10.2-11.9%) |
| Crobat (physWall, Leftovers) | 52-61 (13.9-16.3%) | 193-228 (51.6-61%) | 110-131 (29.4-35%) | 74-88 (19.8-23.5%) |
| Roserade (specWall, Black Sludge) | 61-71 (18.8-21.9%) | 661-777 (204-239.8%) | 188-222 (58-68.5%) | 126-148 (38.9-45.7%) |
| Necrozma (physWall, Leftovers) | 94-111 (23.6-27.9%) | 166-196 (41.7-49.2%) | 94-111 (23.6-27.9%) | 96-114 (24.1-28.6%) |
| Torterra (physWall, Leftovers) | 98-115 (24.9-29.2%) | 326-384 (82.7-97.5%) | 93-109 (23.6-27.7%) | 62-74 (15.7-18.8%) |
| Weezing-Galar (physWall, Leftovers) | 115-135 (34.4-40.4%) | 149-175 (44.6-52.4%) | 84-100 (25.1-29.9%) | 28-33 (8.4-9.9%) |
| Celebi (specWall, Leftovers) | 126-149 (31.2-36.9%) | 466-549 (115.3-135.9%) | 132-157 (32.7-38.9%) | 179-210 (44.3-52%) |
| Togekiss (specWall, Leftovers) | 115-136 (30.7-36.4%) | 243-286 (65-76.5%) | 139-163 (37.2-43.6%) | 46-54 (12.3-14.4%) |
| Garganacl (physWall, Leftovers) | 46-54 (11.4-13.4%) | 70-81 (17.3-20%) | 40-46 (9.9-11.4%) | 54-63 (13.4-15.6%) |
| Donphan (physWall, Leftovers) | 65-75 (16.9-19.5%) | 149-175 (38.8-45.6%) | 84-100 (21.9-26%) | 57-67 (14.8-17.4%) |
| Comfey (specWall, Leftovers) | 119-140 (38.9-45.8%) | 254-299 (83-97.7%) | 145-171 (47.4-55.9%) | 48-57 (15.7-18.6%) |
| Nidoqueen (specWall, Leftovers) | 16-19 (4.2-4.9%) | 261-308 (68-80.2%) | 149-175 (38.8-45.6%) | 100-118 (26-30.7%) |

---

### Diggersby

_Flagged for: setup + priority + reliable recovery; ability: Huge Power; hazards + real offence._

**Diggersby** — species, **RU**, source: imported (natdex)
  Normal/Ground | BST 423 (85/56/77/50/77/78) | Abilities: Pickup / Cheek Pouch / Huge Power
  Engine stats @252 (neutral/positive): Pickup: Atk 211/232, SpA 199/218, Spe 255/280 — Cheek Pouch: Atk 211/232, SpA 199/218, Spe 255/280 — Huge Power: Atk 422/464, SpA 199/218, Spe 255/280
  Item: **free**
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
  Notable: Knock Off, Substitute, Focus Punch

Attacker: **Diggersby**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Last Resort | Earthquake | Focus Punch | Gunk Shot |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 42-49 (11.9-13.8%) | 123-145 (34.7-41%) | 122-143 (34.5-40.4%) | 0-0 (0-0%) |
| Steelix-Mega (physWall, no item) | 37-44 (10.5-12.4%) | 111-131 (31.4-37%) | 109-128 (30.8-36.2%) | 0-0 (0-0%) |
| Tangrowth (physWall, Leftovers) | 120-141 (29.7-34.9%) | 42-50 (10.4-12.4%) | 85-101 (21-25%) | 139-163 (34.4-40.3%) |
| Mandibuzz (physWall, Leftovers) | 136-159 (32.1-37.5%) | 0-0 (0-0%) | 96-114 (22.6-26.9%) | 78-91 (18.4-21.5%) |
| Forretress (physWall, Leftovers) | 55-65 (15.5-18.4%) | 80-94 (22.6-26.6%) | 79-93 (22.3-26.3%) | 0-0 (0-0%) |
| Empoleon (specWall, Leftovers) | 107-127 (28.8-34.1%) | 310-365 (83.3-98.1%) | 308-362 (82.8-97.3%) | 0-0 (0-0%) |
| Gastrodon (specWall, Leftovers) | 265-312 (62.2-73.2%) | 191-223 (44.8-52.3%) | 189-222 (44.4-52.1%) | 75-88 (17.6-20.7%) |
| Registeel (specWall, Leftovers) | 68-80 (18.7-22%) | 198-234 (54.4-64.3%) | 196-231 (53.8-63.5%) | 0-0 (0-0%) |
| Aggron-Mega (physWall, no item) | 37-44 (10.8-12.8%) | 83-98 (24.1-28.5%) | 81-96 (23.5-27.9%) | 0-0 (0-0%) |
| Crobat (physWall, Leftovers) | 162-191 (43.3-51.1%) | 0-0 (0-0%) | 28-33 (7.5-8.8%) | 45-54 (12-14.4%) |
| Roserade (specWall, Black Sludge) | 275-323 (84.9-99.7%) | 197-232 (60.8-71.6%) | 97-115 (29.9-35.5%) | 157-184 (48.5-56.8%) |
| Necrozma (physWall, Leftovers) | 139-163 (34.9-41%) | 100-118 (25.1-29.6%) | 49-58 (12.3-14.6%) | 79-93 (19.8-23.4%) |
| Torterra (physWall, Leftovers) | 136-159 (34.5-40.4%) | 48-57 (12.2-14.5%) | 96-114 (24.4-28.9%) | 78-91 (19.8-23.1%) |
| Weezing-Galar (physWall, Leftovers) | 124-146 (37.1-43.7%) | 179-211 (53.6-63.2%) | 22-26 (6.6-7.8%) | 71-83 (21.3-24.9%) |
| Celebi (specWall, Leftovers) | 193-228 (47.8-56.4%) | 68-81 (16.8-20%) | 68-80 (16.8-19.8%) | 222-262 (55-64.9%) |
| Togekiss (specWall, Leftovers) | 202-239 (54-63.9%) | 0-0 (0-0%) | 35-41 (9.4-11%) | 232-273 (62-73%) |
| Garganacl (physWall, Leftovers) | 58-68 (14.4-16.8%) | 170-200 (42.1-49.5%) | 167-197 (41.3-48.8%) | 33-39 (8.2-9.7%) |
| Donphan (physWall, Leftovers) | 124-146 (32.3-38%) | 89-105 (23.2-27.3%) | 88-104 (22.9-27.1%) | 35-41 (9.1-10.7%) |
| Comfey (specWall, Leftovers) | 211-249 (69-81.4%) | 152-179 (49.7-58.5%) | 75-88 (24.5-28.8%) | 243-286 (79.4-93.5%) |
| Nidoqueen (specWall, Leftovers) | 218-256 (56.8-66.7%) | 313-369 (81.5-96.1%) | 78-91 (20.3-23.7%) | 31-36 (8.1-9.4%) |

---

### Durant

_Flagged for: Attack **522**; Attack reaches 522 off base 109 — an ability is doing the work; setup + priority + reliable recovery._

**Durant** — species, **RU**, source: imported (natdex)
  Bug/Steel | BST 484 (58/109/112/48/48/109) | Abilities: Swarm / Hustle / Truant
  Engine stats @252 (neutral/positive): Swarm: Atk 317/348, SpA 195/214, Spe 317/348 — Hustle: Atk 475/522, SpA 195/214, Spe 317/348 — Truant: Atk 317/348, SpA 195/214, Spe 317/348
  Item: **free**
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

Attacker: **Durant**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | First Impression | Iron Head | Superpower | Return |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 37-44 (10.5-12.4%) | 33-39 (9.3-11%) | 132-156 (37.3-44.1%) | 27-32 (7.6-9%) |
| Steelix-Mega (physWall, no item) | 33-39 (9.3-11%) | 29-35 (8.2-9.9%) | 118-140 (33.3-39.5%) | 24-29 (6.8-8.2%) |
| Tangrowth (physWall, Leftovers) | 213-250 (52.7-61.9%) | 94-111 (23.3-27.5%) | 93-110 (23-27.2%) | 79-93 (19.6-23%) |
| Mandibuzz (physWall, Leftovers) | 119-141 (28.1-33.3%) | 106-126 (25-29.7%) | 105-124 (24.8-29.2%) | 89-106 (21-25%) |
| Forretress (physWall, Leftovers) | 49-57 (13.8-16.1%) | 42-50 (11.9-14.1%) | 85-101 (24-28.5%) | 36-42 (10.2-11.9%) |
| Empoleon (specWall, Leftovers) | 94-111 (25.3-29.8%) | 41-49 (11-13.2%) | 336-396 (90.3-106.5%) | 71-84 (19.1-22.6%) |
| Gastrodon (specWall, Leftovers) | 234-274 (54.9-64.3%) | 104-122 (24.4-28.6%) | 206-243 (48.4-57%) | 175-206 (41.1-48.4%) |
| Registeel (specWall, Leftovers) | 59-70 (16.2-19.2%) | 53-63 (14.6-17.3%) | 214-252 (58.8-69.2%) | 45-53 (12.4-14.6%) |
| Aggron-Mega (physWall, no item) | 33-39 (9.6-11.3%) | 29-35 (8.4-10.2%) | 88-105 (25.6-30.5%) | 24-29 (7-8.4%) |
| Crobat (physWall, Leftovers) | 35-41 (9.4-11%) | 127-149 (34-39.8%) | 31-36 (8.3-9.6%) | 106-126 (28.3-33.7%) |
| Roserade (specWall, Black Sludge) | 241-284 (74.4-87.7%) | 215-253 (66.4-78.1%) | 106-126 (32.7-38.9%) | 182-214 (56.2-66%) |
| Necrozma (physWall, Leftovers) | 183-216 (46-54.3%) | 109-128 (27.4-32.2%) | 53-63 (13.3-15.8%) | 92-109 (23.1-27.4%) |
| Torterra (physWall, Leftovers) | 240-283 (60.9-71.8%) | 106-126 (26.9-32%) | 105-124 (26.6-31.5%) | 89-106 (22.6-26.9%) |
| Weezing-Galar (physWall, Leftovers) | 27-31 (8.1-9.3%) | 196-230 (58.7-68.9%) | 23-27 (6.9-8.1%) | 81-97 (24.3-29%) |
| Celebi (specWall, Leftovers) | 686-807 (169.8-199.8%) | 152-179 (37.6-44.3%) | 75-88 (18.6-21.8%) | 128-152 (31.7-37.6%) |
| Togekiss (specWall, Leftovers) | 44-52 (11.8-13.9%) | 318-374 (85-100%) | 39-45 (10.4-12%) | 133-158 (35.6-42.2%) |
| Garganacl (physWall, Leftovers) | 104-122 (25.7-30.2%) | 184-218 (45.5-54%) | 183-215 (45.3-53.2%) | 39-45 (9.7-11.1%) |
| Donphan (physWall, Leftovers) | 109-128 (28.4-33.3%) | 97-114 (25.3-29.7%) | 96-113 (25-29.4%) | 81-97 (21.1-25.3%) |
| Comfey (specWall, Leftovers) | 93-109 (30.4-35.6%) | 332-391 (108.5-127.8%) | 81-96 (26.5-31.4%) | 140-165 (45.8-53.9%) |
| Nidoqueen (specWall, Leftovers) | 96-113 (25-29.4%) | 170-201 (44.3-52.3%) | 84-100 (21.9-26%) | 144-170 (37.5-44.3%) |

---

### Golurk-Mega

_Flagged for: BST 583; BST 583 on an **estimated** tier; hazards + real offence._

**Golurk-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads PU — the base's; the enforced tier is the one shown)_
  Ground/Ghost | BST 583 (89/159/105/70/105/55) | Abilities: Unseen Fist
  Engine stats @252 (neutral/positive): Unseen Fist: Atk 417/458, SpA 239/262, Spe 209/229
  Item: **Golurkite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Golurk (PU), pre-Mega abilities Iron Fist / Klutz / No Guard, pre-Mega Spe 229 (max +Spe)
  STAB: Ground Earthquake 100P · Ghost Poltergeist 110P
  Physical coverage: Normal Self-Destruct 200P, Fighting Focus Punch 150P, Fire Heat Crash 120P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Electric Thunderbolt 95S, Psychic Psychic 90S, Steel Flash Cannon 80S
  Setup: Defense Curl, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Hazards: Stealth Rock
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Gravity, Knock Off, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick
  Notable: Knock Off, Trick, Substitute, Focus Punch

Attacker: **Golurk-Mega**, adamant {"atk":252,"spe":252,"hp":4}, Golurkite (forced) — a **representative test set**.

| RU defender (representative test set) | Earthquake | Poltergeist | Self-Destruct | Focus Punch |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 184-216 (52-61%) | 101-118 (28.5-33.3%) | 120-141 (33.9-39.8%) | 182-214 (51.4-60.5%) |
| Steelix-Mega (physWall, no item) | 164-193 (46.3-54.5%) | 90-106 (25.4-29.9%) | 107-126 (30.2-35.6%) | 163-191 (46-54%) |
| Tangrowth (physWall, Leftovers) | 65-76 (16.1-18.8%) | 143-168 (35.4-41.6%) | 344-404 (85.1-100%) | 129-152 (31.9-37.6%) |
| Mandibuzz (physWall, Leftovers) | 0-0 (0-0%) | 80-95 (18.9-22.4%) | 388-457 (91.5-107.8%) | 146-172 (34.4-40.6%) |
| Forretress (physWall, Leftovers) | 120-141 (33.9-39.8%) | 132-155 (37.3-43.8%) | 158-185 (44.6-52.3%) | 119-140 (33.6-39.5%) |
| Empoleon (specWall, Leftovers) | 467-550 (125.5-147.8%) | 257-302 (69.1-81.2%) | 309-363 (83.1-97.6%) | 466-548 (125.3-147.3%) |
| Gastrodon (specWall, Leftovers) | 287-338 (67.4-79.3%) | 316-372 (74.2-87.3%) | 762-896 (178.9-210.3%) | 286-337 (67.1-79.1%) |
| Registeel (specWall, Leftovers) | 297-349 (81.6-95.9%) | 163-191 (44.8-52.5%) | 195-230 (53.6-63.2%) | 295-347 (81-95.3%) |
| Aggron-Mega (physWall, no item) | 123-144 (35.8-41.9%) | 90-106 (26.2-30.8%) | 107-126 (31.1-36.6%) | 122-143 (35.5-41.6%) |
| Crobat (physWall, Leftovers) | 0-0 (0-0%) | 192-226 (51.3-60.4%) | 462-543 (123.5-145.2%) | 43-51 (11.5-13.6%) |
| Roserade (specWall, Black Sludge) | 298-350 (92-108%) | 327-385 (100.9-118.8%) | 789-929 (243.5-286.7%) | 148-174 (45.7-53.7%) |
| Necrozma (physWall, Leftovers) | 150-177 (37.7-44.5%) | 248-291 (62.3-73.1%) | 398-468 (100-117.6%) | 74-88 (18.6-22.1%) |
| Torterra (physWall, Leftovers) | 73-86 (18.5-21.8%) | 161-190 (40.9-48.2%) | 388-457 (98.5-116%) | 146-172 (37.1-43.7%) |
| Weezing-Galar (physWall, Leftovers) | 268-316 (80.2-94.6%) | 147-173 (44-51.8%) | 353-415 (105.7-124.3%) | 33-39 (9.9-11.7%) |
| Celebi (specWall, Leftovers) | 105-123 (26-30.4%) | 462-543 (114.4-134.4%) | 555-654 (137.4-161.9%) | 104-123 (25.7-30.4%) |
| Togekiss (specWall, Leftovers) | 0-0 (0-0%) | 241-283 (64.4-75.7%) | 580-682 (155.1-182.4%) | 54-64 (14.4-17.1%) |
| Garganacl (physWall, Leftovers) | 254-298 (62.9-73.8%) | 69-82 (17.1-20.3%) | 166-196 (41.1-48.5%) | 252-296 (62.4-73.3%) |
| Donphan (physWall, Leftovers) | 134-158 (34.9-41.1%) | 147-173 (38.3-45.1%) | 353-383 (91.9-99.7%) | 133-157 (34.6-40.9%) |
| Comfey (specWall, Leftovers) | 229-270 (74.8-88.2%) | 252-296 (82.4-96.7%) | 607-714 (198.4-233.3%) | 114-134 (37.3-43.8%) |
| Nidoqueen (specWall, Leftovers) | 472-555 (122.9-144.5%) | 259-305 (67.4-79.4%) | 624-734 (162.5-191.1%) | 117-138 (30.5-35.9%) |

---

### Houndoom-Mega

_Flagged for: BST 600; setup + priority + reliable recovery; strong setup on a fast frame._

**Houndoom-Mega** — forme, **RU**, source: imported (natdex)
  Dark/Fire | BST 600 (75/90/90/140/90/115) | Abilities: Solar Power
  Engine stats @252 (neutral/positive): Solar Power: Atk 279/306, SpA 379/416, Spe 329/361
  Item: **Houndoominite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Houndoom (ZU), pre-Mega abilities Early Bird / Flash Fire / Unnerve, pre-Mega Spe 317 (max +Spe)
  STAB: Dark Dark Pulse 80S · Fire Overheat 140S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P, Electric Thunder Fang 65P, Grass Trailblaze 50P, Fighting Rock Smash 40P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Hyper Voice 90S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S, Ground Mud Shot 55S
  Setup: Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Feint 50P Normal (+2)
  Phazing: Roar
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Destiny Bond, Detect, Pain Split, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

Attacker: **Houndoom-Mega**, timid {"spa":252,"spe":252,"hp":4}, Houndoominite (forced) — a **representative test set**.

| RU defender (representative test set) | Dark Pulse | Overheat | Solar Beam | Dream Eater |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 198-233 (55.9-65.8%) | 689-811 (194.6-229.1%) | 197-232 (55.6-65.5%) | 82-96 (23.2-27.1%) |
| Steelix-Mega (physWall, no item) | 146-172 (41.2-48.6%) | 507-597 (143.2-168.6%) | 145-171 (41-48.3%) | 60-71 (16.9-20.1%) |
| Tangrowth (physWall, Leftovers) | 241-283 (59.7-70%) | 840-989 (207.9-244.8%) | 120-141 (29.7-34.9%) | 200-236 (49.5-58.4%) |
| Mandibuzz (physWall, Leftovers) | 73-86 (17.2-20.3%) | 253-298 (59.7-70.3%) | 72-85 (17-20%) | 0-0 (0-0%) |
| Forretress (physWall, Leftovers) | 210-247 (59.3-69.8%) | 353-353 (99.7-99.7%) | 52-61 (14.7-17.2%) | 87-103 (24.6-29.1%) |
| Empoleon (specWall, Leftovers) | 100-118 (26.9-31.7%) | 174-204 (46.8-54.8%) | 99-117 (26.6-31.5%) | 41-49 (11-13.2%) |
| Gastrodon (specWall, Leftovers) | 114-135 (26.8-31.7%) | 99-117 (23.2-27.5%) | 456-536 (107-125.8%) | 95-112 (22.3-26.3%) |
| Registeel (specWall, Leftovers) | 76-90 (20.9-24.7%) | 264-311 (72.5-85.4%) | 37-44 (10.2-12.1%) | 31-37 (8.5-10.2%) |
| Aggron-Mega (physWall, no item) | 168-197 (48.8-57.3%) | 438-516 (127.3-150%) | 83-98 (24.1-28.5%) | 69-82 (20.1-23.8%) |
| Crobat (physWall, Leftovers) | 168-197 (44.9-52.7%) | 292-344 (78.1-92%) | 41-49 (11-13.1%) | 279-328 (74.6-87.7%) |
| Roserade (specWall, Black Sludge) | 98-115 (30.2-35.5%) | 340-400 (104.9-123.5%) | 24-28 (7.4-8.6%) | 163-191 (50.3-59%) |
| Necrozma (physWall, Leftovers) | 231-272 (58-68.3%) | 268-315 (67.3-79.1%) | 153-180 (38.4-45.2%) | 64-75 (16.1-18.8%) |
| Torterra (physWall, Leftovers) | 160-188 (40.6-47.7%) | 556-655 (141.1-166.2%) | 159-187 (40.4-47.5%) | 133-156 (33.8-39.6%) |
| Weezing-Galar (physWall, Leftovers) | 93-110 (27.8-32.9%) | 325-382 (97.3-114.4%) | 93-109 (27.8-32.6%) | 310-365 (92.8-109.3%) |
| Celebi (specWall, Leftovers) | 203-238 (50.2-58.9%) | 351-413 (86.9-102.2%) | 50-59 (12.4-14.6%) | 42-49 (10.4-12.1%) |
| Togekiss (specWall, Leftovers) | 46-54 (12.3-14.4%) | 159-188 (42.5-50.3%) | 45-53 (12-14.2%) | 76-90 (20.3-24.1%) |
| Garganacl (physWall, Leftovers) | 152-179 (37.6-44.3%) | 132-156 (32.7-38.6%) | 304-357 (75.2-88.4%) | 126-149 (31.2-36.9%) |
| Donphan (physWall, Leftovers) | 210-247 (54.7-64.3%) | 366-383 (95.3-99.7%) | 383-383 (99.7-99.7%) | 175-206 (45.6-53.6%) |
| Comfey (specWall, Leftovers) | 47-56 (15.4-18.3%) | 164-194 (53.6-63.4%) | 94-111 (30.7-36.3%) | 79-92 (25.8-30.1%) |
| Nidoqueen (specWall, Leftovers) | 112-132 (29.2-34.4%) | 195-229 (50.8-59.6%) | 111-131 (28.9-34.1%) | 186-219 (48.4-57%) |

---

### Kleavor

_Flagged for: setup + priority + reliable recovery; ability: Sheer Force/Sharpness; hazards + real offence._

**Kleavor** — species, **RU**, source: imported (natdex)
  Bug/Rock | BST 500 (70/135/95/45/70/85) | Abilities: Swarm / Sheer Force / Sharpness
  Engine stats @252 (neutral/positive): Swarm: Atk 369/405, SpA 189/207, Spe 269/295 — Sheer Force: Atk 369/405, SpA 189/207, Spe 269/295 — Sharpness: Atk 369/405, SpA 189/207, Spe 269/295
  Item: **free**
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

Attacker: **Kleavor**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Lunge | Stone Edge | Skull Bash | Close Combat |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 41-49 (11.6-13.8%) | 26-31 (7.3-8.8%) | 45-53 (12.7-15%) | 169-197 (47.7-55.6%) |
| Steelix-Mega (physWall, no item) | 37-44 (10.5-12.4%) | 23-27 (6.5-7.6%) | 40-48 (11.3-13.6%) | 150-176 (42.4-49.7%) |
| Tangrowth (physWall, Leftovers) | 241-284 (59.7-70.3%) | 149-176 (36.9-43.6%) | 128-152 (31.7-37.6%) | 119-140 (29.5-34.7%) |
| Mandibuzz (physWall, Leftovers) | 135-159 (31.8-37.5%) | 339-399 (80-94.1%) | 145-171 (34.2-40.3%) | 135-158 (31.8-37.3%) |
| Forretress (physWall, Leftovers) | 54-65 (15.3-18.4%) | 137-162 (38.7-45.8%) | 59-70 (16.7-19.8%) | 110-130 (31.1-36.7%) |
| Empoleon (specWall, Leftovers) | 107-126 (28.8-33.9%) | 133-157 (35.8-42.2%) | 115-136 (30.9-36.6%) | 429-505 (115.3-135.8%) |
| Gastrodon (specWall, Leftovers) | 265-312 (62.2-73.2%) | 165-193 (38.7-45.3%) | 286-336 (67.1-78.9%) | 263-310 (61.7-72.8%) |
| Registeel (specWall, Leftovers) | 67-80 (18.4-22%) | 84-100 (23.1-27.5%) | 72-85 (19.8-23.4%) | 271-321 (74.5-88.2%) |
| Aggron-Mega (physWall, no item) | 37-44 (10.8-12.8%) | 46-55 (13.4-16%) | 40-48 (11.6-14%) | 112-132 (32.6-38.4%) |
| Crobat (physWall, Leftovers) | 40-46 (10.7-12.3%) | 403-474 (107.8-126.7%) | 174-204 (46.5-54.5%) | 39-46 (10.4-12.3%) |
| Roserade (specWall, Black Sludge) | 274-322 (84.6-99.4%) | 341-403 (105.2-124.4%) | 296-348 (91.4-107.4%) | 136-159 (42-49.1%) |
| Necrozma (physWall, Leftovers) | 208-245 (52.3-61.6%) | 172-204 (43.2-51.3%) | 149-175 (37.4-44%) | 68-80 (17.1-20.1%) |
| Torterra (physWall, Leftovers) | 271-319 (68.8-81%) | 84-98 (21.3-24.9%) | 145-171 (36.8-43.4%) | 135-158 (34.3-40.1%) |
| Weezing-Galar (physWall, Leftovers) | 29-36 (8.7-10.8%) | 154-182 (46.1-54.5%) | 132-156 (39.5-46.7%) | 29-35 (8.7-10.5%) |
| Celebi (specWall, Leftovers) | 777-913 (192.3-226%) | 241-284 (59.7-70.3%) | 208-245 (51.5-60.6%) | 96-113 (23.8-28%) |
| Togekiss (specWall, Leftovers) | 50-58 (13.4-15.5%) | 504-594 (134.8-158.8%) | 218-256 (58.3-68.4%) | 49-58 (13.1-15.5%) |
| Garganacl (physWall, Leftovers) | 117-137 (29-33.9%) | 145-171 (35.9-42.3%) | 62-74 (15.3-18.3%) | 232-274 (57.4-67.8%) |
| Donphan (physWall, Leftovers) | 123-145 (32-37.8%) | 76-91 (19.8-23.7%) | 132-156 (34.4-40.6%) | 122-144 (31.8-37.5%) |
| Comfey (specWall, Leftovers) | 105-124 (34.3-40.5%) | 263-310 (85.9-101.3%) | 227-267 (74.2-87.3%) | 105-123 (34.3-40.2%) |
| Nidoqueen (specWall, Leftovers) | 107-127 (27.9-33.1%) | 135-159 (35.2-41.4%) | 234-275 (60.9-71.6%) | 107-127 (27.9-33.1%) |

---

### Latias

_Flagged for: BST 600; setup + priority + reliable recovery; strong setup on a fast frame._

**Latias** — species, **RU**, source: imported (natdex)
  Dragon/Psychic | BST 600 (80/80/90/110/130/110) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 259/284, SpA 319/350, Spe 319/350
  Item: **free**
  STAB: Dragon Draco Meteor 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Water Liquidation 85P, Dark Sucker Punch 80P, Ghost Shadow Claw 70P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Water Surf 95S, Fighting Aura Sphere 90S, Fairy Alluring Voice 80S
  Setup: Agility, Calm Mind, Dragon Dance, Hone Claws
  Reliable recovery: Recover, Rest, Roost
  Drain/Rest-only: Draining Kiss, Dream Eater
  Priority: Sucker Punch 80P Dark (+1)
  Removal: Defog
  Pivot: Baton Pass
  Phazing: Roar
  Status: Thunder Wave, Toxic
  Cleric: Wish
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Healing Wish, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Tailwind, Trick
  Notable: Trick, Substitute, Baton Pass, Tailwind

Attacker: **Latias**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Draco Meteor | Future Sight | Thunder | Solar Beam |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 188-221 (53.1-62.4%) | 161-189 (45.5-53.4%) | 0-0 (0-0%) | 215-253 (60.7-71.5%) |
| Steelix-Mega (physWall, no item) | 139-162 (39.3-45.8%) | 118-140 (33.3-39.5%) | 0-0 (0-0%) | 158-187 (44.6-52.8%) |
| Tangrowth (physWall, Leftovers) | 460-540 (113.9-133.7%) | 395-464 (97.8-114.9%) | 131-154 (32.4-38.1%) | 131-154 (32.4-38.1%) |
| Mandibuzz (physWall, Leftovers) | 278-326 (65.6-76.9%) | 0-0 (0-0%) | 318-374 (75-88.2%) | 79-93 (18.6-21.9%) |
| Forretress (physWall, Leftovers) | 200-235 (56.5-66.4%) | 171-202 (48.3-57.1%) | 228-270 (64.4-76.3%) | 57-67 (16.1-18.9%) |
| Empoleon (specWall, Leftovers) | 94-111 (25.3-29.8%) | 81-96 (21.8-25.8%) | 218-257 (58.6-69.1%) | 109-128 (29.3-34.4%) |
| Gastrodon (specWall, Leftovers) | 218-256 (51.2-60.1%) | 187-219 (43.9-51.4%) | 0-0 (0-0%) | 500-588 (117.4-138%) |
| Registeel (specWall, Leftovers) | 71-84 (19.5-23.1%) | 62-72 (17-19.8%) | 83-97 (22.8-26.6%) | 41-48 (11.3-13.2%) |
| Aggron-Mega (physWall, no item) | 159-188 (46.2-54.7%) | 136-161 (39.5-46.8%) | 183-215 (53.2-62.5%) | 91-107 (26.5-31.1%) |
| Crobat (physWall, Leftovers) | 319-377 (85.3-100.8%) | 549-647 (146.8-173%) | 366-431 (97.9-115.2%) | 45-53 (12-14.2%) |
| Roserade (specWall, Black Sludge) | 185-218 (57.1-67.3%) | 319-377 (98.5-116.4%) | 53-62 (16.4-19.1%) | 26-31 (8-9.6%) |
| Necrozma (physWall, Leftovers) | 293-344 (73.6-86.4%) | 126-148 (31.7-37.2%) | 167-197 (42-49.5%) | 167-197 (42-49.5%) |
| Torterra (physWall, Leftovers) | 304-358 (77.2-90.9%) | 261-308 (66.2-78.2%) | 0-0 (0-0%) | 174-205 (44.2-52%) |
| Weezing-Galar (physWall, Leftovers) | 0-0 (0-0%) | 611-720 (182.9-215.6%) | 202-239 (60.5-71.6%) | 101-119 (30.2-35.6%) |
| Celebi (specWall, Leftovers) | 192-226 (47.5-55.9%) | 81-97 (20-24%) | 54-65 (13.4-16.1%) | 54-65 (13.4-16.1%) |
| Togekiss (specWall, Leftovers) | 0-0 (0-0%) | 150-176 (40.1-47.1%) | 200-236 (53.5-63.1%) | 49-58 (13.1-15.5%) |
| Garganacl (physWall, Leftovers) | 289-341 (71.5-84.4%) | 249-293 (61.6-72.5%) | 166-195 (41.1-48.3%) | 332-391 (82.2-96.8%) |
| Donphan (physWall, Leftovers) | 383-383 (99.7-99.7%) | 344-383 (89.6-99.7%) | 0-0 (0-0%) | 383-383 (99.7-99.7%) |
| Comfey (specWall, Leftovers) | 0-0 (0-0%) | 154-182 (50.3-59.5%) | 102-120 (33.3-39.2%) | 102-120 (33.3-39.2%) |
| Nidoqueen (specWall, Leftovers) | 213-250 (55.5-65.1%) | 367-432 (95.6-112.5%) | 0-0 (0-0%) | 122-144 (31.8-37.5%) |

---

### Lycanroc-Dusk

_Flagged for: setup + priority + reliable recovery; strong setup on a fast frame; ability: Tough Claws._

**Lycanroc-Dusk** — species, **RU**, source: imported (natdex)
  Rock | BST 487 (75/117/65/55/65/110) | Abilities: Tough Claws
  Engine stats @252 (neutral/positive): Tough Claws: Atk 333/366, SpA 209/229, Spe 319/350
  Item: **free**
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

Attacker: **Lycanroc-Dusk**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Stone Edge | Last Resort | Close Combat | Outrage |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 20-24 (5.6-6.8%) | 52-61 (14.7-17.2%) | 179-211 (50.6-59.6%) | 44-52 (12.4-14.7%) |
| Steelix-Mega (physWall, no item) | 19-22 (5.4-6.2%) | 46-54 (13-15.3%) | 161-189 (45.5-53.4%) | 40-46 (11.3-13%) |
| Tangrowth (physWall, Leftovers) | 123-145 (30.4-35.9%) | 148-174 (36.6-43.1%) | 127-149 (31.4-36.9%) | 127-149 (31.4-36.9%) |
| Mandibuzz (physWall, Leftovers) | 279-328 (65.8-77.4%) | 167-197 (39.4-46.5%) | 144-169 (34-39.9%) | 144-169 (34-39.9%) |
| Forretress (physWall, Leftovers) | 114-133 (32.2-37.6%) | 67-80 (18.9-22.6%) | 117-137 (33.1-38.7%) | 58-68 (16.4-19.2%) |
| Empoleon (specWall, Leftovers) | 110-130 (29.6-34.9%) | 132-157 (35.5-42.2%) | 458-539 (123.1-144.9%) | 114-133 (30.6-35.8%) |
| Gastrodon (specWall, Leftovers) | 135-159 (31.7-37.3%) | 328-386 (77-90.6%) | 282-331 (66.2-77.7%) | 282-331 (66.2-77.7%) |
| Registeel (specWall, Leftovers) | 70-81 (19.2-22.3%) | 84-98 (23.1-26.9%) | 291-341 (79.9-93.7%) | 72-84 (19.8-23.1%) |
| Aggron-Mega (physWall, no item) | 39-45 (11.3-13.1%) | 46-54 (13.4-15.7%) | 120-141 (34.9-41%) | 40-46 (11.6-13.4%) |
| Crobat (physWall, Leftovers) | 332-391 (88.8-104.5%) | 200-235 (53.5-62.8%) | 42-49 (11.2-13.1%) | 171-201 (45.7-53.7%) |
| Roserade (specWall, Black Sludge) | 282-331 (87-102.2%) | 340-400 (104.9-123.5%) | 145-171 (44.8-52.8%) | 292-343 (90.1-105.9%) |
| Necrozma (physWall, Leftovers) | 143-167 (35.9-42%) | 171-201 (43-50.5%) | 72-85 (18.1-21.4%) | 146-172 (36.7-43.2%) |
| Torterra (physWall, Leftovers) | 68-81 (17.3-20.6%) | 167-197 (42.4-50%) | 144-169 (36.5-42.9%) | 144-169 (36.5-42.9%) |
| Weezing-Galar (physWall, Leftovers) | 127-149 (38-44.6%) | 153-179 (45.8-53.6%) | 32-37 (9.6-11.1%) | 0-0 (0-0%) |
| Celebi (specWall, Leftovers) | 198-234 (49-57.9%) | 240-282 (59.4-69.8%) | 102-120 (25.2-29.7%) | 205-241 (50.7-59.7%) |
| Togekiss (specWall, Leftovers) | 416-490 (111.2-131%) | 250-295 (66.8-78.9%) | 53-62 (14.2-16.6%) | 0-0 (0-0%) |
| Garganacl (physWall, Leftovers) | 120-141 (29.7-34.9%) | 71-84 (17.6-20.8%) | 248-292 (61.4-72.3%) | 123-145 (30.4-35.9%) |
| Donphan (physWall, Leftovers) | 63-74 (16.4-19.3%) | 153-179 (39.8-46.6%) | 131-154 (34.1-40.1%) | 131-154 (34.1-40.1%) |
| Comfey (specWall, Leftovers) | 217-256 (70.9-83.7%) | 262-308 (85.6-100.7%) | 111-132 (36.3-43.1%) | 0-0 (0-0%) |
| Nidoqueen (specWall, Leftovers) | 111-131 (28.9-34.1%) | 269-317 (70.1-82.6%) | 115-135 (29.9-35.2%) | 231-271 (60.2-70.6%) |

---

### Malamar-Mega

_Flagged for: BST 582; ability: Contrary; BST 582 on an **estimated** tier._

**Malamar-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one shown)_
  Dark/Psychic | BST 582 (86/102/88/98/120/88) | Abilities: Contrary
  Engine stats @252 (neutral/positive): Contrary: Atk 303/333, SpA 295/324, Spe 275/302
  Item: **Malamarite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Malamar (ZU), pre-Mega abilities Contrary / Suction Cups / Infiltrator, pre-Mega Spe 269 (max +Spe)
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

Attacker: **Malamar-Mega**, adamant {"atk":252,"spe":252,"hp":4}, Malamarite (forced) — a **representative test set**.

| RU defender (representative test set) | Foul Play | Future Sight | Superpower | Return |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 40-47 (11.3-13.3%) | 81-96 (22.9-27.1%) | 107-126 (30.2-35.6%) | 22-27 (6.2-7.6%) |
| Steelix-Mega (physWall, no item) | 49-58 (13.8-16.4%) | 60-71 (16.9-20.1%) | 96-113 (27.1-31.9%) | 20-24 (5.6-6.8%) |
| Tangrowth (physWall, Leftovers) | 65-76 (16.1-18.8%) | 199-234 (49.3-57.9%) | 76-89 (18.8-22%) | 65-76 (16.1-18.8%) |
| Mandibuzz (physWall, Leftovers) | 26-30 (6.1-7.1%) | 0-0 (0-0%) | 85-101 (20-23.8%) | 73-86 (17.2-20.3%) |
| Forretress (physWall, Leftovers) | 55-65 (15.5-18.4%) | 86-102 (24.3-28.8%) | 70-82 (19.8-23.2%) | 29-35 (8.2-9.9%) |
| Empoleon (specWall, Leftovers) | 92-108 (24.7-29%) | 41-49 (11-13.2%) | 272-320 (73.1-86%) | 58-68 (15.6-18.3%) |
| Gastrodon (specWall, Leftovers) | 109-128 (25.6-30%) | 95-111 (22.3-26.1%) | 167-197 (39.2-46.2%) | 142-167 (33.3-39.2%) |
| Registeel (specWall, Leftovers) | 53-62 (14.6-17%) | 31-37 (8.5-10.2%) | 173-203 (47.5-55.8%) | 36-43 (9.9-11.8%) |
| Aggron-Mega (physWall, no item) | 54-64 (15.7-18.6%) | 69-81 (20.1-23.5%) | 72-84 (20.9-24.4%) | 20-24 (5.8-7%) |
| Crobat (physWall, Leftovers) | 79-94 (21.1-25.1%) | 277-326 (74.1-87.2%) | 25-30 (6.7-8%) | 87-102 (23.3-27.3%) |
| Roserade (specWall, Black Sludge) | 99-116 (30.6-35.8%) | 162-191 (50-59%) | 86-102 (26.5-31.5%) | 147-173 (45.4-53.4%) |
| Necrozma (physWall, Leftovers) | 118-139 (29.6-34.9%) | 63-74 (15.8-18.6%) | 43-51 (10.8-12.8%) | 74-88 (18.6-22.1%) |
| Torterra (physWall, Leftovers) | 78-92 (19.8-23.4%) | 132-155 (33.5-39.3%) | 85-101 (21.6-25.6%) | 73-86 (18.5-21.8%) |
| Weezing-Galar (physWall, Leftovers) | 30-36 (9-10.8%) | 308-363 (92.2-108.7%) | 19-23 (5.7-6.9%) | 66-78 (19.8-23.4%) |
| Celebi (specWall, Leftovers) | 187-221 (46.3-54.7%) | 42-49 (10.4-12.1%) | 61-72 (15.1-17.8%) | 104-122 (25.7-30.2%) |
| Togekiss (specWall, Leftovers) | 42-49 (11.2-13.1%) | 76-90 (20.3-24.1%) | 31-37 (8.3-9.9%) | 109-128 (29.1-34.2%) |
| Garganacl (physWall, Leftovers) | 63-74 (15.6-18.3%) | 126-148 (31.2-36.6%) | 148-174 (36.6-43.1%) | 31-37 (7.7-9.2%) |
| Donphan (physWall, Leftovers) | 78-91 (20.3-23.7%) | 173-204 (45.1-53.1%) | 78-92 (20.3-24%) | 66-78 (17.2-20.3%) |
| Comfey (specWall, Leftovers) | 30-36 (9.8-11.8%) | 78-92 (25.5-30.1%) | 66-78 (21.6-25.5%) | 113-134 (36.9-43.8%) |
| Nidoqueen (specWall, Leftovers) | 98-115 (25.5-29.9%) | 186-219 (48.4-57%) | 68-80 (17.7-20.8%) | 117-137 (30.5-35.7%) |

---

### Meowstic-M-Mega

_Flagged for: Speed **381**; setup + priority + reliable recovery; strong setup on a fast frame._

**Meowstic-M-Mega** — forme, **RU**, source: override
  Psychic | BST 566 (74/48/76/143/101/124) | Abilities: Trace
  Engine stats @252 (neutral/positive): Trace: Atk 195/214, SpA 385/423, Spe 347/381
  Item: **Meowsticite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Meowstic (ZU), pre-Mega abilities Keen Eye / Infiltrator / Prankster, pre-Mega Spe 337 (max +Spe)
  STAB: Psychic Dream Eater 100S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Dark Sucker Punch 80P, Grass Trailblaze 50P
  Special coverage: Electric Thunderbolt 95S, Grass Energy Ball 90S, Fairy Alluring Voice 80S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S
  Setup: Barrier, Calm Mind, Nasty Plot, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Fake Out 40P Normal (+3)
  Pivot: Baton Pass
  Status: Thunder Wave, Toxic, Yawn
  Cleric: Heal Bell
  Trapping: Mean Look
  Weather/terrain: Misty Terrain, Psychic Terrain, Rain Dance, Sunny Day
  Utility: Gravity, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Baton Pass, Trick Room

Attacker: **Meowstic-M-Mega**, timid {"spa":252,"spe":252,"hp":4}, Meowsticite (forced) — a **representative test set**.

| RU defender (representative test set) | Dream Eater | Thunderbolt | Energy Ball | Alluring Voice |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 125-147 (35.3-41.5%) | 0-0 (0-0%) | 150-177 (42.4-50%) | 67-78 (18.9-22%) |
| Steelix-Mega (physWall, no item) | 92-108 (26-30.5%) | 0-0 (0-0%) | 111-130 (31.4-36.7%) | 49-58 (13.8-16.4%) |
| Tangrowth (physWall, Leftovers) | 305-359 (75.5-88.9%) | 96-113 (23.8-28%) | 91-108 (22.5-26.7%) | 163-192 (40.3-47.5%) |
| Mandibuzz (physWall, Leftovers) | 0-0 (0-0%) | 234-275 (55.2-64.9%) | 55-65 (13-15.3%) | 198-232 (46.7-54.7%) |
| Forretress (physWall, Leftovers) | 133-156 (37.6-44.1%) | 169-198 (47.7-55.9%) | 40-47 (11.3-13.3%) | 71-83 (20.1-23.4%) |
| Empoleon (specWall, Leftovers) | 63-74 (16.9-19.9%) | 161-189 (43.3-50.8%) | 76-89 (20.4-23.9%) | 34-40 (9.1-10.8%) |
| Gastrodon (specWall, Leftovers) | 145-170 (34-39.9%) | 0-0 (0-0%) | 349-410 (81.9-96.2%) | 77-91 (18.1-21.4%) |
| Registeel (specWall, Leftovers) | 48-56 (13.2-15.4%) | 61-72 (16.8-19.8%) | 29-34 (8-9.3%) | 25-30 (6.9-8.2%) |
| Aggron-Mega (physWall, no item) | 106-125 (30.8-36.3%) | 134-158 (39-45.9%) | 63-75 (18.3-21.8%) | 56-67 (16.3-19.5%) |
| Crobat (physWall, Leftovers) | 425-501 (113.6-134%) | 269-317 (71.9-84.8%) | 31-37 (8.3-9.9%) | 56-67 (15-17.9%) |
| Roserade (specWall, Black Sludge) | 248-292 (76.5-90.1%) | 39-46 (12-14.2%) | 18-21 (5.6-6.5%) | 33-39 (10.2-12%) |
| Necrozma (physWall, Leftovers) | 97-114 (24.4-28.6%) | 123-145 (30.9-36.4%) | 117-138 (29.4-34.7%) | 104-122 (26.1-30.7%) |
| Torterra (physWall, Leftovers) | 202-238 (51.3-60.4%) | 0-0 (0-0%) | 121-143 (30.7-36.3%) | 108-127 (27.4-32.2%) |
| Weezing-Galar (physWall, Leftovers) | 473-557 (141.6-166.8%) | 150-176 (44.9-52.7%) | 71-83 (21.3-24.9%) | 63-74 (18.9-22.2%) |
| Celebi (specWall, Leftovers) | 64-75 (15.8-18.6%) | 40-47 (9.9-11.6%) | 38-45 (9.4-11.1%) | 68-80 (16.8-19.8%) |
| Togekiss (specWall, Leftovers) | 116-137 (31-36.6%) | 148-174 (39.6-46.5%) | 35-41 (9.4-11%) | 62-73 (16.6-19.5%) |
| Garganacl (physWall, Leftovers) | 193-227 (47.8-56.2%) | 122-144 (30.2-35.6%) | 232-273 (57.4-67.6%) | 103-121 (25.5-30%) |
| Donphan (physWall, Leftovers) | 266-313 (69.3-81.5%) | 0-0 (0-0%) | 320-377 (83.3-98.2%) | 142-167 (37-43.5%) |
| Comfey (specWall, Leftovers) | 120-141 (39.2-46.1%) | 76-89 (24.8-29.1%) | 72-85 (23.5-27.8%) | 64-75 (20.9-24.5%) |
| Nidoqueen (specWall, Leftovers) | 284-334 (74-87%) | 0-0 (0-0%) | 85-100 (22.1-26%) | 38-44 (9.9-11.5%) |

---

### Raichu-Mega-X

_Flagged for: BST 585; setup + priority + reliable recovery; strong setup on a fast frame._

**Raichu-Mega-X** — forme, **RU**, source: override
  Electric | BST 585 (60/135/95/90/95/110) | Abilities: Electric Surge
  Engine stats @252 (neutral/positive): Electric Surge: Atk 369/405, SpA 279/306, Spe 319/350
  Item: **Raichunite X** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Raichu (ZU), pre-Mega abilities Static / Lightning Rod, pre-Mega Spe 350 (max +Spe)
  STAB: Electric Rising Voltage 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Grass Grass Knot 60S
  Setup: Agility, Calm Mind, Charge, Defense Curl, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Priority: Extreme Speed 80P Normal (+2), Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3)
  Pivot: Volt Switch
  Status: Nuzzle, Sing, Thunder Wave, Toxic, Yawn
  Cleric: Wish
  Weather/terrain: Electric Terrain, Rain Dance
  Utility: Detect, Encore, Knock Off, Light Screen, Protect, Reflect, Safeguard, Substitute
  Notable: Knock Off, Encore, Substitute, Focus Punch

Attacker: **Raichu-Mega-X**, jolly {"atk":252,"spe":252,"hp":4}, Raichunite X (forced) — a **representative test set**.

| RU defender (representative test set) | Rising Voltage | Focus Punch | Last Resort | Iron Tail |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 0-0 (0-0%) | 147-173 (41.5-48.9%) | 34-40 (9.6-11.3%) | 24-29 (6.8-8.2%) |
| Steelix-Mega (physWall, no item) | 0-0 (0-0%) | 132-155 (37.3-43.8%) | 30-36 (8.5-10.2%) | 22-26 (6.2-7.3%) |
| Tangrowth (physWall, Leftovers) | 140-165 (34.7-40.8%) | 104-123 (25.7-30.4%) | 98-115 (24.3-28.5%) | 70-82 (17.3-20.3%) |
| Mandibuzz (physWall, Leftovers) | 173-204 (40.8-48.1%) | 118-139 (27.8-32.8%) | 110-130 (25.9-30.7%) | 79-93 (18.6-21.9%) |
| Forretress (physWall, Leftovers) | 245-289 (69.2-81.6%) | 96-113 (27.1-31.9%) | 45-53 (12.7-15%) | 32-38 (9-10.7%) |
| Empoleon (specWall, Leftovers) | 235-276 (63.2-74.2%) | 376-442 (101.1-118.8%) | 87-103 (23.4-27.7%) | 31-37 (8.3-9.9%) |
| Gastrodon (specWall, Leftovers) | 0-0 (0-0%) | 231-272 (54.2-63.8%) | 216-254 (50.7-59.6%) | 77-91 (18.1-21.4%) |
| Registeel (specWall, Leftovers) | 89-105 (24.5-28.8%) | 238-280 (65.4-76.9%) | 55-65 (15.1-17.9%) | 40-47 (11-12.9%) |
| Aggron-Mega (physWall, no item) | 196-230 (57-66.9%) | 99-116 (28.8-33.7%) | 30-36 (8.7-10.5%) | 22-26 (6.4-7.6%) |
| Crobat (physWall, Leftovers) | 199-234 (53.2-62.6%) | 35-41 (9.4-11%) | 131-154 (35-41.2%) | 94-111 (25.1-29.7%) |
| Roserade (specWall, Black Sludge) | 57-67 (17.6-20.7%) | 119-141 (36.7-43.5%) | 223-263 (68.8-81.2%) | 160-188 (49.4-58%) |
| Necrozma (physWall, Leftovers) | 180-211 (45.2-53%) | 60-71 (15.1-17.8%) | 113-133 (28.4-33.4%) | 81-95 (20.4-23.9%) |
| Torterra (physWall, Leftovers) | 0-0 (0-0%) | 118-139 (29.9-35.3%) | 110-130 (27.9-33%) | 79-93 (20.1-23.6%) |
| Weezing-Galar (physWall, Leftovers) | 110-130 (32.9-38.9%) | 26-31 (7.8-9.3%) | 100-118 (29.9-35.3%) | 145-170 (43.4-50.9%) |
| Celebi (specWall, Leftovers) | 59-69 (14.6-17.1%) | 84-99 (20.8-24.5%) | 157-185 (38.9-45.8%) | 113-133 (28-32.9%) |
| Togekiss (specWall, Leftovers) | 111-131 (29.7-35%) | 44-51 (11.8-13.6%) | 164-194 (43.9-51.9%) | 236-278 (63.1-74.3%) |
| Garganacl (physWall, Leftovers) | 178-209 (44.1-51.7%) | 204-240 (50.5-59.4%) | 47-56 (11.6-13.9%) | 137-161 (33.9-39.9%) |
| Donphan (physWall, Leftovers) | 0-0 (0-0%) | 107-126 (27.9-32.8%) | 100-118 (26-30.7%) | 72-85 (18.8-22.1%) |
| Comfey (specWall, Leftovers) | 111-131 (36.3-42.8%) | 92-108 (30.1-35.3%) | 172-202 (56.2-66%) | 247-291 (80.7-95.1%) |
| Nidoqueen (specWall, Leftovers) | 0-0 (0-0%) | 94-111 (24.5-28.9%) | 177-208 (46.1-54.2%) | 127-149 (33.1-38.8%) |

---

### Zarude

_Flagged for: BST 600; setup + priority + reliable recovery; strong setup on a fast frame._

**Zarude** — species, **RU**, source: imported (natdex)
  Dark/Grass | BST 600 (105/120/105/70/95/105) | Abilities: Leaf Guard
  Engine stats @252 (neutral/positive): Leaf Guard: Atk 339/372, SpA 239/262, Spe 309/339
  Item: **free**
  STAB: Dark Darkest Lariat 85P · Grass Solar Blade 125 (charge)P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Rock Rock Slide 75P
  Special coverage: Normal Hyper Voice 90S, Ground Mud Shot 55S
  Setup: Bulk Up, Growth, Nasty Plot, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Giga Drain
  Priority: Grassy Glide 70P Grass (+1)
  Pivot: U-turn
  Phazing: Roar
  Cleric: Jungle Healing
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Encore, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Encore, Taunt, Substitute, Focus Punch

Attacker: **Zarude**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Darkest Lariat | Solar Blade | Focus Punch | Double-Edge |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 75-89 (21.2-25.1%) | 110-130 (31.1-36.7%) | 175-206 (49.4-58.2%) | 35-41 (9.9-11.6%) |
| Steelix-Mega (physWall, no item) | 67-80 (18.9-22.6%) | 98-115 (27.7-32.5%) | 157-185 (44.4-52.3%) | 31-36 (8.8-10.2%) |
| Tangrowth (physWall, Leftovers) | 107-126 (26.5-31.2%) | 78-92 (19.3-22.8%) | 124-146 (30.7-36.1%) | 100-118 (24.8-29.2%) |
| Mandibuzz (physWall, Leftovers) | 59-71 (13.9-16.7%) | 88-104 (20.8-24.5%) | 140-166 (33-39.2%) | 113-132 (26.7-31.1%) |
| Forretress (physWall, Leftovers) | 98-117 (27.7-33.1%) | 35-41 (9.9-11.6%) | 114-135 (32.2-38.1%) | 45-54 (12.7-15.3%) |
| Empoleon (specWall, Leftovers) | 192-226 (51.6-60.8%) | 280-330 (75.3-88.7%) | 448-527 (120.4-141.7%) | 89-105 (23.9-28.2%) |
| Gastrodon (specWall, Leftovers) | 235-278 (55.2-65.3%) | 1384-1628 (324.9-382.2%) | 275-325 (64.6-76.3%) | 221-260 (51.9-61%) |
| Registeel (specWall, Leftovers) | 122-144 (33.5-39.6%) | 88-104 (24.2-28.6%) | 284-335 (78-92%) | 57-66 (15.7-18.1%) |
| Aggron-Mega (physWall, no item) | 67-80 (19.5-23.3%) | 49-57 (14.2-16.6%) | 117-138 (34-40.1%) | 31-36 (9-10.5%) |
| Crobat (physWall, Leftovers) | 144-169 (38.5-45.2%) | 52-61 (13.9-16.3%) | 41-49 (11-13.1%) | 133-158 (35.6-42.2%) |
| Roserade (specWall, Black Sludge) | 244-287 (75.3-88.6%) | 88-105 (27.2-32.4%) | 143-167 (44.1-51.5%) | 228-269 (70.4-83%) |
| Necrozma (physWall, Leftovers) | 186-219 (46.7-55%) | 180-213 (45.2-53.5%) | 71-84 (17.8-21.1%) | 115-136 (28.9-34.2%) |
| Torterra (physWall, Leftovers) | 120-143 (30.5-36.3%) | 176-208 (44.7-52.8%) | 140-166 (35.5-42.1%) | 113-132 (28.7-33.5%) |
| Weezing-Galar (physWall, Leftovers) | 54-65 (16.2-19.5%) | 80-94 (24-28.1%) | 31-37 (9.3-11.1%) | 102-120 (30.5-35.9%) |
| Celebi (specWall, Leftovers) | 345-406 (85.4-100.5%) | 126-148 (31.2-36.6%) | 100-118 (24.8-29.2%) | 161-189 (39.9-46.8%) |
| Togekiss (specWall, Leftovers) | 89-105 (23.8-28.1%) | 131-154 (35-41.2%) | 52-61 (13.9-16.3%) | 169-198 (45.2-52.9%) |
| Garganacl (physWall, Leftovers) | 104-123 (25.7-30.4%) | 305-360 (75.5-89.1%) | 243-286 (60.1-70.8%) | 48-57 (11.9-14.1%) |
| Donphan (physWall, Leftovers) | 110-130 (28.6-33.9%) | 323-380 (84.1-99%) | 128-150 (33.3-39.1%) | 102-120 (26.6-31.3%) |
| Comfey (specWall, Leftovers) | 93-110 (30.4-35.9%) | 275-325 (89.9-106.2%) | 109-128 (35.6-41.8%) | 176-208 (57.5-68%) |
| Nidoqueen (specWall, Leftovers) | 193-227 (50.3-59.1%) | 283-334 (73.7-87%) | 113-132 (29.4-34.4%) | 182-213 (47.4-55.5%) |

---

### Absol-Mega

_Flagged for: setup + priority + reliable recovery; strong setup on a fast frame._

**Absol-Mega** — forme, **RU**, source: imported (natdex)
  Dark | BST 565 (65/150/60/115/60/115) | Abilities: Magic Bounce
  Engine stats @252 (neutral/positive): Magic Bounce: Atk 399/438, SpA 329/361, Spe 329/361
  Item: **Absolite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Absol (PU), pre-Mega abilities Pressure / Super Luck / Justified, pre-Mega Spe 273 (max +Spe)
  STAB: Dark Foul Play 95P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Fairy Play Rough 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Normal Razor Wind 80 (charge)S
  Setup: Calm Mind, Hone Claws, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Feint 50P Normal (+2), Quick Attack 40P Normal (+1)
  Pivot: Baton Pass
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Cleric: Wish
  Trapping: Mean Look
  Weather/terrain: Hail, Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Knock Off, Magic Coat, Perish Song, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass

Attacker: **Absol-Mega**, jolly {"atk":252,"spe":252,"hp":4}, Absolite (forced) — a **representative test set**.

| RU defender (representative test set) | Foul Play | Close Combat | Double-Edge | Megahorn |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 40-47 (11.3-13.3%) | 128-150 (36.2-42.4%) | 32-37 (9-10.5%) | 32-37 (9-10.5%) |
| Steelix-Mega (physWall, no item) | 49-58 (13.8-16.4%) | 114-135 (32.2-38.1%) | 28-33 (7.9-9.3%) | 28-33 (7.9-9.3%) |
| Tangrowth (physWall, Leftovers) | 65-76 (16.1-18.8%) | 90-107 (22.3-26.5%) | 90-107 (22.3-26.5%) | 181-214 (44.8-53%) |
| Mandibuzz (physWall, Leftovers) | 26-30 (6.1-7.1%) | 102-120 (24.1-28.3%) | 102-120 (24.1-28.3%) | 102-120 (24.1-28.3%) |
| Forretress (physWall, Leftovers) | 55-65 (15.5-18.4%) | 83-98 (23.4-27.7%) | 41-49 (11.6-13.8%) | 41-49 (11.6-13.8%) |
| Empoleon (specWall, Leftovers) | 92-108 (24.7-29%) | 325-383 (87.4-103%) | 81-95 (21.8-25.5%) | 81-95 (21.8-25.5%) |
| Gastrodon (specWall, Leftovers) | 109-128 (25.6-30%) | 200-235 (46.9-55.2%) | 200-235 (46.9-55.2%) | 200-235 (46.9-55.2%) |
| Registeel (specWall, Leftovers) | 53-62 (14.6-17%) | 206-243 (56.6-66.8%) | 51-60 (14-16.5%) | 51-60 (14-16.5%) |
| Aggron-Mega (physWall, no item) | 54-64 (15.7-18.6%) | 85-101 (24.7-29.4%) | 28-33 (8.1-9.6%) | 28-33 (8.1-9.6%) |
| Crobat (physWall, Leftovers) | 79-94 (21.1-25.1%) | 30-35 (8-9.4%) | 122-143 (32.6-38.2%) | 30-35 (8-9.4%) |
| Roserade (specWall, Black Sludge) | 99-116 (30.6-35.8%) | 103-122 (31.8-37.7%) | 207-244 (63.9-75.3%) | 207-244 (63.9-75.3%) |
| Necrozma (physWall, Leftovers) | 118-139 (29.6-34.9%) | 52-61 (13.1-15.3%) | 104-123 (26.1-30.9%) | 156-185 (39.2-46.5%) |
| Torterra (physWall, Leftovers) | 78-92 (19.8-23.4%) | 102-120 (25.9-30.5%) | 102-120 (25.9-30.5%) | 205-241 (52-61.2%) |
| Weezing-Galar (physWall, Leftovers) | 30-36 (9-10.8%) | 23-27 (6.9-8.1%) | 93-110 (27.8-32.9%) | 23-27 (6.9-8.1%) |
| Celebi (specWall, Leftovers) | 187-221 (46.3-54.7%) | 73-86 (18.1-21.3%) | 146-172 (36.1-42.6%) | 586-689 (145-170.5%) |
| Togekiss (specWall, Leftovers) | 42-49 (11.2-13.1%) | 38-44 (10.2-11.8%) | 152-179 (40.6-47.9%) | 38-44 (10.2-11.8%) |
| Garganacl (physWall, Leftovers) | 63-74 (15.6-18.3%) | 176-208 (43.6-51.5%) | 44-52 (10.9-12.9%) | 88-104 (21.8-25.7%) |
| Donphan (physWall, Leftovers) | 78-91 (20.3-23.7%) | 93-110 (24.2-28.6%) | 93-110 (24.2-28.6%) | 93-110 (24.2-28.6%) |
| Comfey (specWall, Leftovers) | 30-36 (9.8-11.8%) | 79-94 (25.8-30.7%) | 159-188 (52-61.4%) | 79-94 (25.8-30.7%) |
| Nidoqueen (specWall, Leftovers) | 98-115 (25.5-29.9%) | 82-96 (21.4-25%) | 164-193 (42.7-50.3%) | 82-96 (21.4-25%) |

---

### Aggron-Mega

_Flagged for: BST 630; hazards + real offence._

**Aggron-Mega** — forme, **RU**, source: imported (natdex)
  Steel | BST 630 (70/140/230/60/80/50) | Abilities: Filter
  Engine stats @252 (neutral/positive): Filter: Atk 379/416, SpA 219/240, Spe 199/218
  Item: **Aggronite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Aggron (NU), pre-Mega abilities Sturdy / Rock Head / Heavy Metal, pre-Mega Spe 218 (max +Spe)
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
  Notable: Taunt, Substitute, Focus Punch

Attacker: **Aggron-Mega**, adamant {"atk":252,"spe":252,"hp":4}, Aggronite (forced) — a **representative test set**.

| RU defender (representative test set) | Steel Roller | Focus Punch | Head Smash | Double-Edge |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 54-63 (15.3-17.8%) | 166-195 (46.9-55.1%) | 20-24 (5.6-6.8%) | 33-39 (9.3-11%) |
| Steelix-Mega (physWall, no item) | 48-56 (13.6-15.8%) | 148-174 (41.8-49.2%) | 18-21 (5.1-5.9%) | 29-35 (8.2-9.9%) |
| Tangrowth (physWall, Leftovers) | 153-180 (37.9-44.6%) | 118-138 (29.2-34.2%) | 118-138 (29.2-34.2%) | 94-111 (23.3-27.5%) |
| Mandibuzz (physWall, Leftovers) | 173-204 (40.8-48.1%) | 133-156 (31.4-36.8%) | 266-313 (62.7-73.8%) | 106-125 (25-29.5%) |
| Forretress (physWall, Leftovers) | 70-83 (19.8-23.4%) | 108-128 (30.5-36.2%) | 108-128 (30.5-36.2%) | 43-51 (12.1-14.4%) |
| Empoleon (specWall, Leftovers) | 68-81 (18.3-21.8%) | 423-498 (113.7-133.9%) | 105-124 (28.2-33.3%) | 84-99 (22.6-26.6%) |
| Gastrodon (specWall, Leftovers) | 169-199 (39.7-46.7%) | 260-306 (61-71.8%) | 130-153 (30.5-35.9%) | 208-245 (48.8-57.5%) |
| Registeel (specWall, Leftovers) | 87-102 (23.9-28%) | 268-316 (73.6-86.8%) | 67-79 (18.4-21.7%) | 53-63 (14.6-17.3%) |
| Aggron-Mega (physWall, no item) | 48-56 (14-16.3%) | 111-130 (32.3-37.8%) | 37-43 (10.8-12.5%) | 29-35 (8.4-10.2%) |
| Crobat (physWall, Leftovers) | 206-242 (55.1-64.7%) | 39-46 (10.4-12.3%) | 317-373 (84.8-99.7%) | 127-149 (34-39.8%) |
| Roserade (specWall, Black Sludge) | 351-413 (108.3-127.5%) | 135-158 (41.7-48.8%) | 270-317 (83.3-97.8%) | 216-254 (66.7-78.4%) |
| Necrozma (physWall, Leftovers) | 177-208 (44.5-52.3%) | 68-80 (17.1-20.1%) | 136-160 (34.2-40.2%) | 109-128 (27.4-32.2%) |
| Torterra (physWall, Leftovers) | 173-204 (43.9-51.8%) | 133-156 (33.8-39.6%) | 66-78 (16.8-19.8%) | 106-125 (26.9-31.7%) |
| Weezing-Galar (physWall, Leftovers) | 316-372 (94.6-111.4%) | 30-35 (9-10.5%) | 121-142 (36.2-42.5%) | 97-114 (29-34.1%) |
| Celebi (specWall, Leftovers) | 247-291 (61.1-72%) | 95-112 (23.5-27.7%) | 190-224 (47-55.4%) | 152-179 (37.6-44.3%) |
| Togekiss (specWall, Leftovers) | 517-609 (138.2-162.8%) | 49-58 (13.1-15.5%) | 397-467 (106.1-124.9%) | 159-187 (42.5-50%) |
| Garganacl (physWall, Leftovers) | 299-351 (74-86.9%) | 229-270 (56.7-66.8%) | 114-135 (28.2-33.4%) | 46-54 (11.4-13.4%) |
| Donphan (physWall, Leftovers) | 158-186 (41.1-48.4%) | 121-142 (31.5-37%) | 60-71 (15.6-18.5%) | 97-114 (25.3-29.7%) |
| Comfey (specWall, Leftovers) | 541-636 (176.8-207.8%) | 103-122 (33.7-39.9%) | 207-244 (67.6-79.7%) | 166-196 (54.2-64.1%) |
| Nidoqueen (specWall, Leftovers) | 278-327 (72.4-85.2%) | 106-125 (27.6-32.6%) | 106-125 (27.6-32.6%) | 171-201 (44.5-52.3%) |

---

### Azelf

_Flagged for: BST 580; strong setup on a fast frame._

**Azelf** — species, **RU**, source: imported (natdex)
  Psychic | BST 580 (75/125/70/125/70/115) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 349/383, SpA 349/383, Spe 329/361
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Flying Acrobatics 110P, Steel Iron Tail 100P, Fairy Play Rough 90P, Fighting Drain Punch 75P, Fire Fire Punch 75P
  Special coverage: Fire Fire Blast 120S, Electric Thunder 120S, Grass Energy Ball 90S, Normal Uproar 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S
  Setup: Calm Mind, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Draining Kiss, Dream Eater
  Hazards: Stealth Rock
  Pivot: Baton Pass, U-turn
  Status: Thunder Wave, Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Encore, Knock Off, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Baton Pass, Trick Room

Attacker: **Azelf**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Future Sight | Explosion | Acrobatics | Iron Tail |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 130-153 (36.7-43.2%) | 148-174 (41.8-49.2%) | 16-19 (4.5-5.4%) | 29-35 (8.2-9.9%) |
| Steelix-Mega (physWall, no item) | 96-113 (27.1-31.9%) | 132-156 (37.3-44.1%) | 15-18 (4.2-5.1%) | 27-31 (7.6-8.8%) |
| Tangrowth (physWall, Leftovers) | 318-374 (78.7-92.6%) | 425-500 (105.2-123.8%) | 96-114 (23.8-28.2%) | 85-101 (21-25%) |
| Mandibuzz (physWall, Leftovers) | 0-0 (0-0%) | 481-565 (113.4-133.3%) | 54-63 (12.7-14.9%) | 97-114 (22.9-26.9%) |
| Forretress (physWall, Leftovers) | 139-163 (39.3-46%) | 195-230 (55.1-65%) | 44-52 (12.4-14.7%) | 39-46 (11-13%) |
| Empoleon (specWall, Leftovers) | 66-78 (17.7-21%) | 382-449 (102.7-120.7%) | 42-50 (11.3-13.4%) | 37-45 (9.9-12.1%) |
| Gastrodon (specWall, Leftovers) | 150-178 (35.2-41.8%) | 943-1110 (221.4-260.6%) | 105-123 (24.6-28.9%) | 94-111 (22.1-26.1%) |
| Registeel (specWall, Leftovers) | 49-58 (13.5-15.9%) | 241-284 (66.2-78%) | 27-31 (7.4-8.5%) | 48-57 (13.2-15.7%) |
| Aggron-Mega (physWall, no item) | 110-130 (32-37.8%) | 132-156 (38.4-45.3%) | 15-18 (4.4-5.2%) | 27-31 (7.8-9%) |
| Crobat (physWall, Leftovers) | 444-522 (118.7-139.6%) | 572-673 (152.9-179.9%) | 63-75 (16.8-20.1%) | 115-136 (30.7-36.4%) |
| Roserade (specWall, Black Sludge) | 258-305 (79.6-94.1%) | 977-1150 (301.5-354.9%) | 218-257 (67.3-79.3%) | 196-231 (60.5-71.3%) |
| Necrozma (physWall, Leftovers) | 101-119 (25.4-29.9%) | 492-579 (123.6-145.5%) | 55-65 (13.8-16.3%) | 98-117 (24.6-29.4%) |
| Torterra (physWall, Leftovers) | 210-248 (53.3-62.9%) | 481-565 (122.1-143.4%) | 109-128 (27.7-32.5%) | 97-114 (24.6-28.9%) |
| Weezing-Galar (physWall, Leftovers) | 494-581 (147.9-174%) | 436-514 (130.5-153.9%) | 49-58 (14.7-17.4%) | 178-209 (53.3-62.6%) |
| Celebi (specWall, Leftovers) | 66-78 (16.3-19.3%) | 687-809 (170-200.2%) | 154-182 (38.1-45%) | 139-163 (34.4-40.3%) |
| Togekiss (specWall, Leftovers) | 122-143 (32.6-38.2%) | 717-845 (191.7-225.9%) | 80-94 (21.4-25.1%) | 289-341 (77.3-91.2%) |
| Garganacl (physWall, Leftovers) | 201-236 (49.8-58.4%) | 205-243 (50.7-60.1%) | 23-27 (5.7-6.7%) | 167-197 (41.3-48.8%) |
| Donphan (physWall, Leftovers) | 278-327 (72.4-85.2%) | 383-383 (99.7-99.7%) | 49-58 (12.8-15.1%) | 88-104 (22.9-27.1%) |
| Comfey (specWall, Leftovers) | 124-148 (40.5-48.4%) | 751-884 (245.4-288.9%) | 84-98 (27.5-32%) | 304-357 (99.3-116.7%) |
| Nidoqueen (specWall, Leftovers) | 297-349 (77.3-90.9%) | 773-910 (201.3-237%) | 85-101 (22.1-26.3%) | 156-183 (40.6-47.7%) |

---

### Barraskewda

_Flagged for: Speed **408**; setup + priority + reliable recovery._

**Barraskewda** — species, **RU**, source: imported (natdex)
  Water | BST 490 (61/123/60/60/50/136) | Abilities: Swift Swim / Propeller Tail
  Engine stats @252 (neutral/positive): Swift Swim: Atk 345/379, SpA 219/240, Spe 371/408 — Propeller Tail: Atk 345/379, SpA 219/240, Spe 371/408
  Item: **free**
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

Attacker: **Barraskewda**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Liquidation | Close Combat | Double-Edge | Psychic Fangs |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 154-182 (43.5-51.4%) | 144-169 (40.7-47.7%) | 35-41 (9.9-11.6%) | 24-29 (6.8-8.2%) |
| Steelix-Mega (physWall, no item) | 139-163 (39.3-46%) | 128-152 (36.2-42.9%) | 31-37 (8.8-10.5%) | 22-27 (6.2-7.6%) |
| Tangrowth (physWall, Leftovers) | 54-63 (13.4-15.6%) | 101-119 (25-29.5%) | 101-119 (25-29.5%) | 72-85 (17.8-21%) |
| Mandibuzz (physWall, Leftovers) | 123-144 (29-34%) | 114-135 (26.9-31.8%) | 114-135 (26.9-31.8%) | 0-0 (0-0%) |
| Forretress (physWall, Leftovers) | 101-118 (28.5-33.3%) | 93-110 (26.3-31.1%) | 46-54 (13-15.3%) | 33-39 (9.3-11%) |
| Empoleon (specWall, Leftovers) | 97-114 (26.1-30.6%) | 366-431 (98.4-115.9%) | 91-107 (24.5-28.8%) | 65-76 (17.5-20.4%) |
| Gastrodon (specWall, Leftovers) | 240-282 (56.3-66.2%) | 224-265 (52.6-62.2%) | 224-265 (52.6-62.2%) | 159-188 (37.3-44.1%) |
| Registeel (specWall, Leftovers) | 124-145 (34.1-39.8%) | 232-274 (63.7-75.3%) | 57-67 (15.7-18.4%) | 41-48 (11.3-13.2%) |
| Aggron-Mega (physWall, no item) | 68-81 (19.8-23.5%) | 96-114 (27.9-33.1%) | 31-37 (9-10.8%) | 22-27 (6.4-7.8%) |
| Crobat (physWall, Leftovers) | 146-172 (39-46%) | 33-40 (8.8-10.7%) | 136-161 (36.4-43%) | 195-230 (52.1-61.5%) |
| Roserade (specWall, Black Sludge) | 123-145 (38-44.8%) | 115-136 (35.5-42%) | 232-274 (71.6-84.6%) | 331-390 (102.2-120.4%) |
| Necrozma (physWall, Leftovers) | 126-148 (31.7-37.2%) | 58-68 (14.6-17.1%) | 118-139 (29.6-34.9%) | 41-49 (10.3-12.3%) |
| Torterra (physWall, Leftovers) | 123-144 (31.2-36.5%) | 114-135 (28.9-34.3%) | 114-135 (28.9-34.3%) | 81-96 (20.6-24.4%) |
| Weezing-Galar (physWall, Leftovers) | 111-132 (33.2-39.5%) | 26-29 (7.8-8.7%) | 105-123 (31.4-36.8%) | 149-176 (44.6-52.7%) |
| Celebi (specWall, Leftovers) | 87-102 (21.5-25.2%) | 81-96 (20-23.8%) | 163-193 (40.3-47.8%) | 58-68 (14.4-16.8%) |
| Togekiss (specWall, Leftovers) | 183-215 (48.9-57.5%) | 42-49 (11.2-13.1%) | 171-201 (45.7-53.7%) | 122-143 (32.6-38.2%) |
| Garganacl (physWall, Leftovers) | 213-250 (52.7-61.9%) | 198-234 (49-57.9%) | 49-58 (12.1-14.4%) | 70-83 (17.3-20.5%) |
| Donphan (physWall, Leftovers) | 224-265 (58.3-69%) | 105-123 (27.3-32%) | 105-123 (27.3-32%) | 74-88 (19.3-22.9%) |
| Comfey (specWall, Leftovers) | 191-226 (62.4-73.9%) | 89-105 (29.1-34.3%) | 179-211 (58.5-69%) | 127-150 (41.5-49%) |
| Nidoqueen (specWall, Leftovers) | 395-464 (102.9-120.8%) | 92-107 (24-27.9%) | 184-217 (47.9-56.5%) | 262-309 (68.2-80.5%) |

---

### Breloom

_Flagged for: setup + priority + reliable recovery; ability: Technician._

**Breloom** — species, **RU**, source: imported (natdex)
  Grass/Fighting | BST 460 (60/130/80/60/60/70) | Abilities: Effect Spore / Poison Heal / Technician
  Engine stats @252 (neutral/positive): Effect Spore: Atk 359/394, SpA 219/240, Spe 239/262 — Poison Heal: Atk 359/394, SpA 219/240, Spe 239/262 — Technician: Atk 359/394, SpA 219/240, Spe 239/262
  Item: **free**
  STAB: Grass Seed Bomb 80P · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P
  Special coverage: Poison Sludge Bomb 90S, Normal Tera Blast 80S, Ground Mud Shot 55S
  Setup: Bulk Up, Growth, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Drain Punch, Giga Drain, Mega Drain
  Priority: Feint 50P Normal (+2), Mach Punch 40P Fighting (+1), Vacuum Wave 40S Fighting (+1)
  Status: Poison Powder, Spore, Stun Spore, Toxic
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Leech Seed, Protect, Safeguard, Substitute
  Notable: Substitute, Focus Punch

Attacker: **Breloom**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Seed Bomb | Focus Punch | Double-Edge | Gunk Shot |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 83-97 (23.4-27.4%) | 306-360 (86.4-101.7%) | 40-48 (11.3-13.6%) | 0-0 (0-0%) |
| Steelix-Mega (physWall, no item) | 74-87 (20.9-24.6%) | 274-322 (77.4-91%) | 36-42 (10.2-11.9%) | 0-0 (0-0%) |
| Tangrowth (physWall, Leftovers) | 58-68 (14.4-16.8%) | 217-256 (53.7-63.4%) | 115-136 (28.5-33.7%) | 232-274 (57.4-67.8%) |
| Mandibuzz (physWall, Leftovers) | 66-78 (15.6-18.4%) | 245-288 (57.8-67.9%) | 131-154 (30.9-36.3%) | 131-154 (30.9-36.3%) |
| Forretress (physWall, Leftovers) | 26-31 (7.3-8.8%) | 200-236 (56.5-66.7%) | 53-62 (15-17.5%) | 0-0 (0-0%) |
| Empoleon (specWall, Leftovers) | 209-247 (56.2-66.4%) | 782-920 (210.2-247.3%) | 104-122 (28-32.8%) | 0-0 (0-0%) |
| Gastrodon (specWall, Leftovers) | 1033-1215 (242.5-285.2%) | 481-565 (112.9-132.6%) | 256-301 (60.1-70.7%) | 127-150 (29.8-35.2%) |
| Registeel (specWall, Leftovers) | 66-78 (18.1-21.4%) | 495-583 (136-160.2%) | 66-78 (18.1-21.4%) | 0-0 (0-0%) |
| Aggron-Mega (physWall, no item) | 36-42 (10.5-12.2%) | 205-241 (59.6-70.1%) | 36-42 (10.5-12.2%) | 0-0 (0-0%) |
| Crobat (physWall, Leftovers) | 39-45 (10.4-12%) | 72-85 (19.3-22.7%) | 156-183 (41.7-48.9%) | 78-91 (20.9-24.3%) |
| Roserade (specWall, Black Sludge) | 66-78 (20.4-24.1%) | 248-292 (76.5-90.1%) | 266-313 (82.1-96.6%) | 266-313 (82.1-96.6%) |
| Necrozma (physWall, Leftovers) | 135-158 (33.9-39.7%) | 124-146 (31.2-36.7%) | 133-157 (33.4-39.4%) | 133-157 (33.4-39.4%) |
| Torterra (physWall, Leftovers) | 132-156 (33.5-39.6%) | 245-288 (62.2-73.1%) | 131-154 (33.2-39.1%) | 131-154 (33.2-39.1%) |
| Weezing-Galar (physWall, Leftovers) | 59-70 (17.7-21%) | 55-65 (16.5-19.5%) | 119-140 (35.6-41.9%) | 119-140 (35.6-41.9%) |
| Celebi (specWall, Leftovers) | 93-110 (23-27.2%) | 175-206 (43.3-51%) | 187-221 (46.3-54.7%) | 375-442 (92.8-109.4%) |
| Togekiss (specWall, Leftovers) | 97-115 (25.9-30.7%) | 91-107 (24.3-28.6%) | 196-230 (52.4-61.5%) | 392-461 (104.8-123.3%) |
| Garganacl (physWall, Leftovers) | 228-269 (56.4-66.6%) | 423-499 (104.7-123.5%) | 55-66 (13.6-16.3%) | 55-66 (13.6-16.3%) |
| Donphan (physWall, Leftovers) | 241-284 (62.8-74%) | 223-263 (58.1-68.5%) | 119-140 (31-36.5%) | 59-70 (15.4-18.2%) |
| Comfey (specWall, Leftovers) | 205-241 (67-78.8%) | 191-224 (62.4-73.2%) | 204-240 (66.7-78.4%) | 409-482 (133.7-157.5%) |
| Nidoqueen (specWall, Leftovers) | 211-249 (54.9-64.8%) | 196-231 (51-60.2%) | 210-248 (54.7-64.6%) | 52-61 (13.5-15.9%) |

---

### Celebi

_Flagged for: BST 600; setup + priority + reliable recovery._

**Celebi** — species, **RU**, source: imported (natdex)
  Psychic/Grass | BST 600 (100/100/100/100/100/100) | Abilities: Natural Cure
  Engine stats @252 (neutral/positive): Natural Cure: Atk 299/328, SpA 299/328, Spe 299/328
  Item: **free**
  STAB: Psychic Future Sight 120S · Grass Leaf Storm 140S
  Physical coverage: Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Dark Sucker Punch 80P, Bug U-turn 70P
  Special coverage: Fighting Aura Sphere 90S, Ground Earth Power 90S, Bug Pollen Puff 90S, Normal Uproar 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S
  Setup: Calm Mind, Defense Curl, Nasty Plot, Swords Dance
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Dream Eater, Giga Drain
  Priority: Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1)
  Hazards: Stealth Rock
  Pivot: Baton Pass, U-turn
  Status: Thunder Wave, Toxic
  Cleric: Heal Bell, Life Dew
  Weather/terrain: Grassy Terrain, Psychic Terrain, Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Healing Wish, Leech Seed, Light Screen, Magic Coat, Perish Song, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Baton Pass, Trick Room

Attacker: **Celebi**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Future Sight | Leaf Storm | Last Resort | Dual Wingbeat |
| --- | --- | --- | --- | --- |
| Steelix (physWall, Leftovers) | 107-127 (30.2-35.9%) | 252-296 (71.2-83.6%) | 36-42 (10.2-11.9%) | 26-30 (7.3-8.5%) |
| Steelix-Mega (physWall, no item) | 79-93 (22.3-26.3%) | 185-218 (52.3-61.6%) | 32-37 (9-10.5%) | 22-28 (6.2-7.9%) |
| Tangrowth (physWall, Leftovers) | 262-309 (64.9-76.5%) | 153-179 (37.9-44.3%) | 102-120 (25.2-29.7%) | 152-178 (37.6-44.1%) |
| Mandibuzz (physWall, Leftovers) | 0-0 (0-0%) | 92-109 (21.7-25.7%) | 115-136 (27.1-32.1%) | 84-100 (19.8-23.6%) |
| Forretress (physWall, Leftovers) | 114-135 (32.2-38.1%) | 66-78 (18.6-22%) | 46-55 (13-15.5%) | 70-82 (19.8-23.2%) |
| Empoleon (specWall, Leftovers) | 54-63 (14.5-16.9%) | 127-149 (34.1-40.1%) | 92-107 (24.7-28.8%) | 66-78 (17.7-21%) |
| Gastrodon (specWall, Leftovers) | 124-146 (29.1-34.3%) | 585-687 (137.3-161.3%) | 227-267 (53.3-62.7%) | 162-194 (38-45.5%) |
| Registeel (specWall, Leftovers) | 41-49 (11.3-13.5%) | 48-57 (13.2-15.7%) | 58-68 (15.9-18.7%) | 40-48 (11-13.2%) |
| Aggron-Mega (physWall, no item) | 91-107 (26.5-31.1%) | 106-124 (30.8-36%) | 32-37 (9.3-10.8%) | 22-28 (6.4-8.1%) |
| Crobat (physWall, Leftovers) | 367-432 (98.1-115.5%) | 53-62 (14.2-16.6%) | 137-162 (36.6-43.3%) | 100-118 (26.7-31.6%) |
| Roserade (specWall, Black Sludge) | 214-253 (66-78.1%) | 31-36 (9.6-11.1%) | 235-276 (72.5-85.2%) | 342-402 (105.6-124.1%) |
| Necrozma (physWall, Leftovers) | 83-98 (20.9-24.6%) | 196-230 (49.2-57.8%) | 118-140 (29.6-35.2%) | 84-100 (21.1-25.1%) |
| Torterra (physWall, Leftovers) | 174-205 (44.2-52%) | 202-239 (51.3-60.7%) | 115-136 (29.2-34.5%) | 170-202 (43.1-51.3%) |
| Weezing-Galar (physWall, Leftovers) | 408-481 (122.2-144%) | 118-139 (35.3-41.6%) | 106-124 (31.7-37.1%) | 78-90 (23.4-26.9%) |
| Celebi (specWall, Leftovers) | 54-65 (13.4-16.1%) | 63-75 (15.6-18.6%) | 166-195 (41.1-48.3%) | 240-286 (59.4-70.8%) |
| Togekiss (specWall, Leftovers) | 101-118 (27-31.6%) | 58-68 (15.5-18.2%) | 172-204 (46-54.5%) | 124-148 (33.2-39.6%) |
| Garganacl (physWall, Leftovers) | 166-196 (41.1-48.5%) | 388-457 (96-113.1%) | 49-58 (12.1-14.4%) | 36-40 (8.9-9.9%) |
| Donphan (physWall, Leftovers) | 230-270 (59.9-70.3%) | 383-383 (99.7-99.7%) | 106-124 (27.6-32.3%) | 78-90 (20.3-23.4%) |
| Comfey (specWall, Leftovers) | 104-122 (34-39.9%) | 120-141 (39.2-46.1%) | 182-213 (59.5-69.6%) | 132-156 (43.1-51%) |
| Nidoqueen (specWall, Leftovers) | 245-289 (63.8-75.3%) | 143-167 (37.2-43.5%) | 187-219 (48.7-57%) | 134-158 (34.9-41.1%) |
---

## H. Serious RU → NU candidate evidence

The 22 RU entries with the lowest combination of engine
offence, utility breadth and BST. **Low output is not a verdict** — several of
these will have a role NU cannot fill, which is what section K is for.

### Regidrago

**Regidrago** — Dragon, BST 580 (200/100/50/100/50/80), Dragon's Maw, item free
Roles: recovery, setup | STAB: Dragon Dragon Energy 150S | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Flygon | Ground/Dragon | 520 (80/100/80/80/80/100) | Levitate | hazards, removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Ground Earthquake 100P · Dragon Draco Meteor 140S |
| Goodra | Dragon | 600 (90/100/70/110/150/80) | Sap Sipper, Hydration, Gooey | recovery, setup, priority, phazing, cleric, status | Rest | Dragon Draco Meteor 140S |
| Guzzlord | Dark/Dragon | 570 (223/101/53/97/53/43) | Beast Boost | recovery, setup, phazing, status | Rest | Dark Crunch 80P · Dragon Draco Meteor 140S |
| Tyrantrum | Rock/Dragon | 521 (82/121/119/69/59/71) | Strong Jaw, Rock Head | hazards, recovery, setup, phazing, status | Rest | Rock Head Smash 150P · Dragon Outrage 120P |
| Altaria | Dragon/Flying | 490 (75/70/90/70/105/80) | Natural Cure, Cloud Nine | removal, recovery, setup, phazing, cleric, status | Rest, Roost | Dragon Draco Meteor 140S · Flying Sky Attack 140 (charge)P |

---

### Politoed

**Politoed** — Water, BST 500 (90/75/75/90/100/70), Water Absorb / Damp / Drizzle, item free
Roles: recovery, setup, status | STAB: Water Hydro Pump 120S | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Araquanid | Water/Bug | 454 (68/70/92/50/132/42) | Water Bubble, Water Absorb | hazards, recovery, setup, status | Rest | Water Hydro Pump 120S · Bug Bug Buzz 90S |
| Basculegion | Water/Ghost | 530 (120/112/65/80/75/78) | Swift Swim, Adaptability, Mold Breaker | recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Ghost Phantom Force 90 (charge)P |
| Kingler | Water | 475 (55/130/115/50/50/75) | Hyper Cutter, Shell Armor, Sheer Force | recovery, setup, status | Rest | Water Crabhammer 100P |
| Mantine | Water/Flying | 485 (85/40/70/80/140/70) | Swift Swim, Water Absorb, Water Veil | removal, recovery, setup, status | Rest, Roost | Water Hydro Pump 120S · Flying Hurricane 120S |
| Omastar | Rock/Water | 495 (70/60/125/115/70/55) | Swift Swim, Shell Armor, Weak Armor | hazards, recovery, setup, status | Rest | Rock Meteor Beam 120 (charge)S · Water Hydro Pump 120S |

---

### Seismitoad

**Seismitoad** — Water/Ground, BST 509 (105/95/75/85/75/74), Swift Swim / Poison Touch / Water Absorb, item free
Roles: hazards, recovery, status | STAB: Water Hydro Pump 120S · Ground Earthquake 100P | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Araquanid | Water/Bug | 454 (68/70/92/50/132/42) | Water Bubble, Water Absorb | hazards, recovery, setup, status | Rest | Water Hydro Pump 120S · Bug Bug Buzz 90S |
| Flygon | Ground/Dragon | 520 (80/100/80/80/80/100) | Levitate | hazards, removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Ground Earthquake 100P · Dragon Draco Meteor 140S |
| Omastar | Rock/Water | 495 (70/60/125/115/70/55) | Swift Swim, Shell Armor, Weak Armor | hazards, recovery, setup, status | Rest | Rock Meteor Beam 120 (charge)S · Water Hydro Pump 120S |
| Rhydon | Ground/Rock | 485 (105/130/120/45/45/40) | Lightning Rod, Rock Head, Reckless | hazards, recovery, setup, phazing, status | Rest | Ground Earthquake 100P · Rock Stone Edge 100P |
| Rhyperior | Ground/Rock | 535 (115/140/130/55/55/40) | Lightning Rod, Solid Rock, Reckless | hazards, recovery, setup, phazing, status | Rest | Ground Earthquake 100P · Rock Stone Edge 100P |

---

### Garganacl

**Garganacl** — Rock, BST 500 (100/100/130/45/90/35), Purifying Salt / Sturdy / Clear Body, item free
Roles: hazards, recovery, setup | STAB: Rock Stone Edge 100P | Recovery: Recover, Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Aerodactyl | Rock/Flying | 515 (80/105/65/60/75/130) | Rock Head, Pressure, Unnerve | hazards, removal, recovery, setup, phazing, status | Rest, Roost | Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P |
| Aggron | Steel/Rock | 530 (70/110/180/60/60/50) | Sturdy, Rock Head, Heavy Metal | hazards, recovery, setup, phazing, status | Rest | Steel Steel Roller 130P · Rock Head Smash 150P |
| Drednaw | Water/Rock | 485 (90/115/90/48/68/74) | Strong Jaw, Shell Armor, Swift Swim | hazards, recovery, setup, phazing | Rest | Water Liquidation 85P · Rock Head Smash 150P |
| Omastar | Rock/Water | 495 (70/60/125/115/70/55) | Swift Swim, Shell Armor, Weak Armor | hazards, recovery, setup, status | Rest | Rock Meteor Beam 120 (charge)S · Water Hydro Pump 120S |
| Rhydon | Ground/Rock | 485 (105/130/120/45/45/40) | Lightning Rod, Rock Head, Reckless | hazards, recovery, setup, phazing, status | Rest | Ground Earthquake 100P · Rock Stone Edge 100P |

---

### Marowak-Alola

**Marowak-Alola** — Fire/Ghost, BST 425 (60/80/110/50/80/45), Cursed Body / Lightning Rod / Rock Head, item free
Roles: hazards, recovery, setup, status | STAB: Fire Fire Blast 120S · Ghost Poltergeist 110P | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Araquanid | Water/Bug | 454 (68/70/92/50/132/42) | Water Bubble, Water Absorb | hazards, recovery, setup, status | Rest | Water Hydro Pump 120S · Bug Bug Buzz 90S |
| Brambleghast | Grass/Ghost | 480 (55/115/70/80/70/90) | Wind Rider, Infiltrator | hazards, removal, recovery, setup, priority | Rest | Grass Leaf Storm 140S · Ghost Poltergeist 110P |
| Doublade | Steel/Ghost | 448 (59/110/150/45/49/35) | No Guard | recovery, setup, priority, status | Rest | Steel Iron Head 80P · Ghost Shadow Claw 70P |
| Dragalge | Poison/Dragon | 494 (65/75/90/97/123/44) | Poison Point, Poison Touch, Adaptability | hazards, recovery, pivot, setup, phazing, status | Rest | Poison Gunk Shot 120P · Dragon Draco Meteor 140S |
| Gligar | Ground/Flying | 430 (65/75/105/35/65/85) | Hyper Cutter, Sand Veil, Immunity | hazards, removal, recovery, pivot, setup, priority, status | Rest, Roost | Ground Earthquake 100P · Flying Acrobatics 110P |

---

### Arctozolt

**Arctozolt** — Electric/Ice, BST 505 (90/100/90/90/80/55), Volt Absorb / Static / Slush Rush, item free
Roles: recovery, setup, status | STAB: Electric Bolt Beak 170P · Ice Blizzard 120S | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Avalugg | Ice | 514 (95/117/184/44/46/28) | Own Tempo, Ice Body, Sturdy | removal, recovery, setup, phazing, status | Recover, Rest | Ice Icicle Crash 85P |
| Bellibolt | Electric | 495 (109/64/91/103/83/45) | Electromorphosis, Static, Damp | recovery, pivot, setup, priority, status | Rest, Slack Off | Electric Thunder 120S |
| Heliolisk | Electric/Normal | 481 (62/55/52/109/94/109) | Dry Skin, Sand Veil, Solar Power | recovery, pivot, setup, priority, phazing, status | Rest | Electric Thunder 120S · Normal Hyper Voice 90S |
| Kilowattrel | Electric/Flying | 490 (70/70/60/105/60/125) | Wind Power, Volt Absorb, Competitive | recovery, pivot, setup, priority, status | Rest, Roost | Electric Thunder 120S · Flying Brave Bird 120P |
| Magneton | Electric/Steel | 465 (50/60/95/120/70/70) | Magnet Pull, Sturdy, Analytic | recovery, pivot, setup, status | Rest | Electric Thunder 120S · Steel Steel Beam 140S |

---

### Quagsire

**Quagsire** — Water/Ground, BST 430 (95/85/85/65/65/35), Damp / Water Absorb / Unaware, item free
Roles: hazards, recovery, setup, status | STAB: Water Hydro Pump 120S · Ground Earthquake 100P | Recovery: Recover, Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Araquanid | Water/Bug | 454 (68/70/92/50/132/42) | Water Bubble, Water Absorb | hazards, recovery, setup, status | Rest | Water Hydro Pump 120S · Bug Bug Buzz 90S |
| Gligar | Ground/Flying | 430 (65/75/105/35/65/85) | Hyper Cutter, Sand Veil, Immunity | hazards, removal, recovery, pivot, setup, priority, status | Rest, Roost | Ground Earthquake 100P · Flying Acrobatics 110P |
| Omastar | Rock/Water | 495 (70/60/125/115/70/55) | Swift Swim, Shell Armor, Weak Armor | hazards, recovery, setup, status | Rest | Rock Meteor Beam 120 (charge)S · Water Hydro Pump 120S |
| Rhydon | Ground/Rock | 485 (105/130/120/45/45/40) | Lightning Rod, Rock Head, Reckless | hazards, recovery, setup, phazing, status | Rest | Ground Earthquake 100P · Rock Stone Edge 100P |
| Flygon | Ground/Dragon | 520 (80/100/80/80/80/100) | Levitate | hazards, removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Ground Earthquake 100P · Dragon Draco Meteor 140S |

---

### Enamorus-Therian

**Enamorus-Therian** — Fairy/Flying, BST 580 (74/115/110/135/100/46), Overcoat, item free
Roles: recovery, setup | STAB: Fairy Misty Explosion 100S · Flying Fly 90 (charge)P | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Aerodactyl | Rock/Flying | 515 (80/105/65/60/75/130) | Rock Head, Pressure, Unnerve | hazards, removal, recovery, setup, phazing, status | Rest, Roost | Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P |
| Articuno-Galar | Psychic/Flying | 580 (90/85/85/125/100/95) | Competitive | removal, recovery, pivot, setup, priority, phazing, cleric, status | Recover, Rest, Roost | Psychic Future Sight 120S · Flying Sky Attack 140 (charge)P |
| Scream Tail | Fairy/Psychic | 570 (115/65/99/65/115/111) | Protosynthesis | hazards, recovery, pivot, setup, phazing, cleric, status | Rest | Fairy Misty Explosion 100S · Psychic Psychic 90S |
| Sylveon | Fairy | 525 (95/65/65/110/130/60) | Cute Charm, Pixilate | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Fairy Misty Explosion 100S |
| Altaria | Dragon/Flying | 490 (75/70/90/70/105/80) | Natural Cure, Cloud Nine | removal, recovery, setup, phazing, cleric, status | Rest, Roost | Dragon Draco Meteor 140S · Flying Sky Attack 140 (charge)P |

---

### Cresselia

**Cresselia** — Psychic, BST 600 (120/70/120/75/130/85), Levitate, item free
Roles: recovery, setup, status | STAB: Psychic Future Sight 120S | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Articuno-Galar | Psychic/Flying | 580 (90/85/85/125/100/95) | Competitive | removal, recovery, pivot, setup, priority, phazing, cleric, status | Recover, Rest, Roost | Psychic Future Sight 120S · Flying Sky Attack 140 (charge)P |
| Meloetta | Normal/Psychic | 600 (100/77/77/128/128/90) | Serene Grace | recovery, pivot, setup, priority, cleric, status | Rest | Normal Hyper Voice 90S · Psychic Dream Eater 100S |
| Scream Tail | Fairy/Psychic | 570 (115/65/99/65/115/111) | Protosynthesis | hazards, recovery, pivot, setup, phazing, cleric, status | Rest | Fairy Misty Explosion 100S · Psychic Psychic 90S |
| Uxie | Psychic | 580 (75/75/130/75/130/95) | Levitate | hazards, recovery, pivot, setup, cleric, status | Rest | Psychic Future Sight 120S |
| Bronzong | Steel/Psychic | 500 (67/89/116/79/116/33) | Levitate, Heatproof, Heavy Metal | hazards, recovery, setup, status | Rest | Steel Steel Beam 140S · Psychic Future Sight 120S |

---

### Reuniclus

**Reuniclus** — Psychic, BST 490 (110/65/75/125/85/30), Overcoat / Magic Guard / Regenerator, item free
Roles: recovery, setup, status | STAB: Psychic Future Sight 120S | Recovery: Recover, Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Bronzong | Steel/Psychic | 500 (67/89/116/79/116/33) | Levitate, Heatproof, Heavy Metal | hazards, recovery, setup, status | Rest | Steel Steel Beam 140S · Psychic Future Sight 120S |
| Espeon | Psychic | 525 (65/65/60/130/95/110) | Synchronize, Magic Bounce | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Psychic Future Sight 120S |
| Gothitelle | Psychic | 490 (70/55/95/95/110/65) | Frisk, Competitive, Shadow Tag | recovery, setup, priority, cleric, status | Rest | Psychic Future Sight 120S |
| Starmie | Water/Psychic | 520 (60/75/85/100/85/115) | Illuminate, Natural Cure, Analytic | removal, recovery, pivot, setup, status | Recover, Rest | Water Hydro Pump 120S · Psychic Dream Eater 100S |
| Xatu | Psychic/Flying | 470 (65/75/70/95/70/95) | Synchronize, Early Bird, Magic Bounce | removal, recovery, pivot, setup, priority, cleric, status | Rest, Roost | Psychic Future Sight 120S · Flying Sky Attack 140 (charge)P |

---

### Skeledirge

**Skeledirge** — Fire/Ghost, BST 530 (104/75/100/110/75/66), Blaze / Unaware, item free
Roles: recovery, phazing, status | STAB: Fire Overheat 140S · Ghost Poltergeist 110P | Recovery: Rest, Slack Off | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Arcanine | Fire | 555 (90/110/80/100/80/95) | Intimidate, Flash Fire, Justified | recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S |
| Houndstone | Ghost | 488 (72/101/100/50/97/68) | Sand Rush, Fluffy | recovery, priority, phazing, status | Rest | Ghost Poltergeist 110P |
| Incineroar | Fire/Dark | 530 (95/115/90/80/90/60) | Blaze, Intimidate | recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S · Dark Darkest Lariat 85P |
| Aerodactyl | Rock/Flying | 515 (80/105/65/60/75/130) | Rock Head, Pressure, Unnerve | hazards, removal, recovery, setup, phazing, status | Rest, Roost | Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P |
| Aggron | Steel/Rock | 530 (70/110/180/60/60/50) | Sturdy, Rock Head, Heavy Metal | hazards, recovery, setup, phazing, status | Rest | Steel Steel Roller 130P · Rock Head Smash 150P |

---

### Mimikyu

**Mimikyu** — Ghost/Fairy, BST 476 (55/90/80/50/105/96), Disguise, item free
Roles: recovery, setup, priority, status | STAB: Ghost Phantom Force 90 (charge)P · Fairy Play Rough 90P | Recovery: Rest | Priority: Shadow Sneak 40P Ghost (+1)

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Basculegion | Water/Ghost | 530 (120/112/65/80/75/78) | Swift Swim, Adaptability, Mold Breaker | recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Ghost Phantom Force 90 (charge)P |
| Decidueye | Grass/Ghost | 530 (78/107/75/100/100/70) | Overgrow, Long Reach | removal, recovery, pivot, setup, priority, status | Rest, Roost | Grass Leaf Storm 140S · Ghost Poltergeist 110P |
| Dhelmise | Ghost/Grass | 517 (70/131/100/86/90/40) | Steelworker | removal, recovery, setup, priority, status | Rest | Ghost Poltergeist 110P · Grass Solar Blade 125 (charge)P |
| Doublade | Steel/Ghost | 448 (59/110/150/45/49/35) | No Guard | recovery, setup, priority, status | Rest | Steel Iron Head 80P · Ghost Shadow Claw 70P |
| Sylveon | Fairy | 525 (95/65/65/110/130/60) | Cute Charm, Pixilate | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Fairy Misty Explosion 100S |

---

### Mimikyu-Busted

**Mimikyu-Busted** — Ghost/Fairy, BST 476 (55/90/80/50/105/96), Disguise, item free
Roles: recovery, setup, priority, status | STAB: Ghost Phantom Force 90 (charge)P · Fairy Play Rough 90P | Recovery: Rest | Priority: Shadow Sneak 40P Ghost (+1)

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Basculegion | Water/Ghost | 530 (120/112/65/80/75/78) | Swift Swim, Adaptability, Mold Breaker | recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Ghost Phantom Force 90 (charge)P |
| Decidueye | Grass/Ghost | 530 (78/107/75/100/100/70) | Overgrow, Long Reach | removal, recovery, pivot, setup, priority, status | Rest, Roost | Grass Leaf Storm 140S · Ghost Poltergeist 110P |
| Dhelmise | Ghost/Grass | 517 (70/131/100/86/90/40) | Steelworker | removal, recovery, setup, priority, status | Rest | Ghost Poltergeist 110P · Grass Solar Blade 125 (charge)P |
| Doublade | Steel/Ghost | 448 (59/110/150/45/49/35) | No Guard | recovery, setup, priority, status | Rest | Steel Iron Head 80P · Ghost Shadow Claw 70P |
| Sylveon | Fairy | 525 (95/65/65/110/130/60) | Cute Charm, Pixilate | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Fairy Misty Explosion 100S |

---

### Lokix

**Lokix** — Bug/Dark, BST 450 (71/102/78/52/55/92), Swarm / Tinted Lens, item free
Roles: recovery, pivot, setup, priority | STAB: Bug First Impression 90P · Dark Sucker Punch 80P | Recovery: Rest | Priority: First Impression 90P Bug (+2), Sucker Punch 80P Dark (+1), Feint 50P Normal (+2)

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Overqwil | Dark/Poison | 510 (85/115/95/65/65/85) | Poison Point, Swift Swim, Intimidate | hazards, recovery, pivot, setup, priority, status | Rest | Dark Crunch 80P · Poison Gunk Shot 120P |
| Incineroar | Fire/Dark | 530 (95/115/90/80/90/60) | Blaze, Intimidate | recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S · Dark Darkest Lariat 85P |
| Bellibolt | Electric | 495 (109/64/91/103/83/45) | Electromorphosis, Static, Damp | recovery, pivot, setup, priority, status | Rest, Slack Off | Electric Thunder 120S |
| Flamigo | Flying/Fighting | 500 (82/115/74/75/64/90) | Scrappy, Tangled Feet, Costar | recovery, pivot, setup, priority | Rest, Roost | Flying Sky Attack 140 (charge)P · Fighting Close Combat 120P |
| Gligar | Ground/Flying | 430 (65/75/105/35/65/85) | Hyper Cutter, Sand Veil, Immunity | hazards, removal, recovery, pivot, setup, priority, status | Rest, Roost | Ground Earthquake 100P · Flying Acrobatics 110P |

---

### Gastrodon

**Gastrodon** — Water/Ground, BST 475 (111/83/68/92/82/39), Sticky Hold / Storm Drain / Sand Force, item free
Roles: hazards, recovery, setup, status | STAB: Water Hydro Pump 120S · Ground Earthquake 100P | Recovery: Recover, Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Araquanid | Water/Bug | 454 (68/70/92/50/132/42) | Water Bubble, Water Absorb | hazards, recovery, setup, status | Rest | Water Hydro Pump 120S · Bug Bug Buzz 90S |
| Flygon | Ground/Dragon | 520 (80/100/80/80/80/100) | Levitate | hazards, removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Ground Earthquake 100P · Dragon Draco Meteor 140S |
| Gligar | Ground/Flying | 430 (65/75/105/35/65/85) | Hyper Cutter, Sand Veil, Immunity | hazards, removal, recovery, pivot, setup, priority, status | Rest, Roost | Ground Earthquake 100P · Flying Acrobatics 110P |
| Omastar | Rock/Water | 495 (70/60/125/115/70/55) | Swift Swim, Shell Armor, Weak Armor | hazards, recovery, setup, status | Rest | Rock Meteor Beam 120 (charge)S · Water Hydro Pump 120S |
| Rhydon | Ground/Rock | 485 (105/130/120/45/45/40) | Lightning Rod, Rock Head, Reckless | hazards, recovery, setup, phazing, status | Rest | Ground Earthquake 100P · Rock Stone Edge 100P |

---

### Armarouge

**Armarouge** — Fire/Psychic, BST 525 (85/60/100/125/80/75), Flash Fire / Weak Armor, item free
Roles: recovery, setup, status | STAB: Fire Overheat 140S · Psychic Psychic 90S | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Arcanine | Fire | 555 (90/110/80/100/80/95) | Intimidate, Flash Fire, Justified | recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S |
| Articuno-Galar | Psychic/Flying | 580 (90/85/85/125/100/95) | Competitive | removal, recovery, pivot, setup, priority, phazing, cleric, status | Recover, Rest, Roost | Psychic Future Sight 120S · Flying Sky Attack 140 (charge)P |
| Bronzong | Steel/Psychic | 500 (67/89/116/79/116/33) | Levitate, Heatproof, Heavy Metal | hazards, recovery, setup, status | Rest | Steel Steel Beam 140S · Psychic Future Sight 120S |
| Espeon | Psychic | 525 (65/65/60/130/95/110) | Synchronize, Magic Bounce | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Psychic Future Sight 120S |
| Gothitelle | Psychic | 490 (70/55/95/95/110/65) | Frisk, Competitive, Shadow Tag | recovery, setup, priority, cleric, status | Rest | Psychic Future Sight 120S |

---

### Linoone

**Linoone** — Normal, BST 420 (78/70/61/50/61/100), Pickup / Gluttony / Quick Feet, item free
Roles: recovery, setup, priority, phazing, status | STAB: Normal Last Resort 140P | Recovery: Rest | Priority: Extreme Speed 80P Normal (+2)

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Heliolisk | Electric/Normal | 481 (62/55/52/109/94/109) | Dry Skin, Sand Veil, Solar Power | recovery, pivot, setup, priority, phazing, status | Rest | Electric Thunder 120S · Normal Hyper Voice 90S |
| Staraptor | Normal/Flying | 485 (85/120/70/50/60/100) | Intimidate, Reckless | removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Normal Double-Edge 120P · Flying Sky Attack 140 (charge)P |
| Drampa | Normal/Dragon | 485 (78/60/85/135/91/36) | Berserk, Sap Sipper, Cloud Nine | removal, recovery, setup, phazing, status | Rest, Roost | Normal Hyper Voice 90S · Dragon Draco Meteor 140S |
| Hariyama | Fighting | 474 (144/120/60/40/60/50) | Thick Fat, Guts, Sheer Force | recovery, setup, priority, phazing, status | Rest | Fighting Focus Punch 150P |
| Scrafty | Dark/Fighting | 488 (65/90/115/45/115/58) | Shed Skin, Moxie, Intimidate | recovery, setup, priority, phazing, status | Rest | Dark Foul Play 95P · Fighting Focus Punch 150P |

---

### Nihilego

**Nihilego** — Rock/Poison, BST 570 (109/53/47/127/131/103), Beast Boost, item free
Roles: hazards, recovery, status | STAB: Rock Meteor Beam 120 (charge)S · Poison Sludge Wave 95S | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Aerodactyl | Rock/Flying | 515 (80/105/65/60/75/130) | Rock Head, Pressure, Unnerve | hazards, removal, recovery, setup, phazing, status | Rest, Roost | Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P |
| Aggron | Steel/Rock | 530 (70/110/180/60/60/50) | Sturdy, Rock Head, Heavy Metal | hazards, recovery, setup, phazing, status | Rest | Steel Steel Roller 130P · Rock Head Smash 150P |
| Overqwil | Dark/Poison | 510 (85/115/95/65/65/85) | Poison Point, Swift Swim, Intimidate | hazards, recovery, pivot, setup, priority, status | Rest | Dark Crunch 80P · Poison Gunk Shot 120P |
| Rhyperior | Ground/Rock | 535 (115/140/130/55/55/40) | Lightning Rod, Solid Rock, Reckless | hazards, recovery, setup, phazing, status | Rest | Ground Earthquake 100P · Rock Stone Edge 100P |
| Stakataka | Rock/Steel | 570 (61/131/211/53/101/13) | Beast Boost | hazards, recovery, setup, status | Rest | Rock Stone Edge 100P · Steel Steel Roller 130P |

---

### Barbaracle

**Barbaracle** — Rock/Water, BST 500 (72/105/115/54/86/68), Tough Claws / Sniper / Pickpocket, item free
Roles: hazards, recovery, setup, status | STAB: Rock Stone Edge 100P · Water Liquidation 85P | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Omastar | Rock/Water | 495 (70/60/125/115/70/55) | Swift Swim, Shell Armor, Weak Armor | hazards, recovery, setup, status | Rest | Rock Meteor Beam 120 (charge)S · Water Hydro Pump 120S |
| Aerodactyl | Rock/Flying | 515 (80/105/65/60/75/130) | Rock Head, Pressure, Unnerve | hazards, removal, recovery, setup, phazing, status | Rest, Roost | Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P |
| Aggron | Steel/Rock | 530 (70/110/180/60/60/50) | Sturdy, Rock Head, Heavy Metal | hazards, recovery, setup, phazing, status | Rest | Steel Steel Roller 130P · Rock Head Smash 150P |
| Araquanid | Water/Bug | 454 (68/70/92/50/132/42) | Water Bubble, Water Absorb | hazards, recovery, setup, status | Rest | Water Hydro Pump 120S · Bug Bug Buzz 90S |
| Drednaw | Water/Rock | 485 (90/115/90/48/68/74) | Strong Jaw, Shell Armor, Swift Swim | hazards, recovery, setup, phazing | Rest | Water Liquidation 85P · Rock Head Smash 150P |

---

### Crawdaunt

**Crawdaunt** — Water/Dark, BST 468 (63/120/85/90/55/55), Hyper Cutter / Shell Armor / Adaptability, item free
Roles: recovery, setup, priority, status | STAB: Water Hydro Pump 120S · Dark Crunch 80P | Recovery: Rest | Priority: Aqua Jet 40P Water (+1)

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Basculegion | Water/Ghost | 530 (120/112/65/80/75/78) | Swift Swim, Adaptability, Mold Breaker | recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Ghost Phantom Force 90 (charge)P |
| Incineroar | Fire/Dark | 530 (95/115/90/80/90/60) | Blaze, Intimidate | recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S · Dark Darkest Lariat 85P |
| Overqwil | Dark/Poison | 510 (85/115/95/65/65/85) | Poison Point, Swift Swim, Intimidate | hazards, recovery, pivot, setup, priority, status | Rest | Dark Crunch 80P · Poison Gunk Shot 120P |
| Scrafty | Dark/Fighting | 488 (65/90/115/45/115/58) | Shed Skin, Moxie, Intimidate | recovery, setup, priority, phazing, status | Rest | Dark Foul Play 95P · Fighting Focus Punch 150P |
| Tauros-Paldea-Aqua | Fighting/Water | 490 (75/110/105/30/70/100) | Intimidate, Anger Point, Cud Chew | recovery, setup, priority, status | Rest | Fighting Close Combat 120P · Water Wave Crash 120P |

---

### Registeel

**Registeel** — Steel, BST 580 (80/75/150/75/150/50), Clear Body / Light Metal, item free
Roles: hazards, recovery, setup, status | STAB: Steel Steel Beam 140S | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Aggron | Steel/Rock | 530 (70/110/180/60/60/50) | Sturdy, Rock Head, Heavy Metal | hazards, recovery, setup, phazing, status | Rest | Steel Steel Roller 130P · Rock Head Smash 150P |
| Stakataka | Rock/Steel | 570 (61/131/211/53/101/13) | Beast Boost | hazards, recovery, setup, status | Rest | Rock Stone Edge 100P · Steel Steel Roller 130P |
| Bronzong | Steel/Psychic | 500 (67/89/116/79/116/33) | Levitate, Heatproof, Heavy Metal | hazards, recovery, setup, status | Rest | Steel Steel Beam 140S · Psychic Future Sight 120S |
| Klefki | Steel/Fairy | 470 (57/80/91/80/87/75) | Prankster, Magician | hazards, removal, recovery, setup, status | Rest | Steel Steel Beam 140S · Fairy Play Rough 90P |
| Aerodactyl | Rock/Flying | 515 (80/105/65/60/75/130) | Rock Head, Pressure, Unnerve | hazards, removal, recovery, setup, phazing, status | Rest, Roost | Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P |

---

### Breloom

**Breloom** — Grass/Fighting, BST 460 (60/130/80/60/60/70), Effect Spore / Poison Heal / Technician, item free
Roles: recovery, setup, priority, status | STAB: Grass Seed Bomb 80P · Fighting Focus Punch 150P | Recovery: Rest | Priority: Feint 50P Normal (+2), Mach Punch 40P Fighting (+1), Vacuum Wave 40S Fighting (+1)

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Decidueye-Hisui | Grass/Fighting | 530 (88/112/80/95/95/60) | Overgrow, Scrappy | removal, recovery, pivot, setup, priority, status | Rest, Roost | Grass Leaf Storm 140S · Fighting Focus Punch 150P |
| Dhelmise | Ghost/Grass | 517 (70/131/100/86/90/40) | Steelworker | removal, recovery, setup, priority, status | Rest | Ghost Poltergeist 110P · Grass Solar Blade 125 (charge)P |
| Hariyama | Fighting | 474 (144/120/60/40/60/50) | Thick Fat, Guts, Sheer Force | recovery, setup, priority, phazing, status | Rest | Fighting Focus Punch 150P |
| Heracross | Bug/Fighting | 500 (80/125/75/40/95/85) | Swarm, Guts, Moxie | hazards, recovery, setup, priority, status | Rest | Bug Megahorn 120P · Fighting Focus Punch 150P |
| Pawmot | Electric/Fighting | 490 (70/115/70/70/60/105) | Volt Absorb, Natural Cure, Iron Fist | recovery, pivot, setup, priority, cleric, status | Rest | Electric Double Shock 120P · Fighting Focus Punch 150P |
---

## I. Offensive matchup matrices

Every matrix in section G runs against the **same RU defensive core**, built from
RU entries rather than reused from UU, so candidates compare column by column:

Steelix (physWall), Steelix-Mega (physWall), Tangrowth (physWall), Mandibuzz (physWall), Forretress (physWall), Empoleon (specWall), Gastrodon (specWall), Registeel (specWall), Aggron-Mega (physWall), Crobat (physWall), Roserade (specWall), Necrozma (physWall), Torterra (physWall), Weezing-Galar (physWall), Celebi (specWall), Togekiss (specWall), Garganacl (physWall), Donphan (physWall), Comfey (specWall), Nidoqueen (specWall).

Classification — hard counter, reliable counter, soft counter, check, revenge-only,
not an answer — is yours; the engine supplies damage, and recovery, speed and
hazard chip are in sections C, L, M and P.
---

## J. Defensive / revenge-kill matrices

RU's counterplay into each upward candidate. Attackers are **representative test
sets**; the target is on its own offensive spread from section G.

| Candidate | Crobat Brave Bird | Barraskewda Liquidation | Talonflame Brave Bird | Lucario Extreme Speed | Krookodile Earthquake | Noivern Draco Meteor | Cloyster Icicle Spear | Breloom Mach Punch | Kleavor Stone Axe | Zarude Power Whip |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Absol-Mega-Z | 232-273 (85.3-100.4%) | 304-357 (111.8-131.3%) | 282-331 (103.7-121.7%) | 0-0 (0-0%) | 231-271 (84.9-99.6%) | 284-334 (104.4-122.8%) | 201-237 (73.9-87.1%) | 0-0 (0-0%) | 249-293 (91.5-107.7%) | 421-495 (154.8-182%) |
| Beedrill-Mega | 623-733 (229-269.5%) | 408-480 (150-176.5%) | 757-891 (278.3-327.6%) | 226-265 (83.1-97.4%) | 310-364 (114-133.8%) | 226-266 (83.1-97.8%) | 267-315 (98.2-115.8%) | 48-55 (17.6-20.2%) | 668-786 (245.6-289%) | 141-166 (51.8-61%) |
| Meloetta-Pirouette | 337-396 (98.5-115.8%) | 220-259 (64.3-75.7%) | 409-482 (119.6-140.9%) | 122-143 (35.7-41.8%) | 167-197 (48.8-57.6%) | 233-275 (68.1-80.4%) | 147-174 (43-50.9%) | 209-245 (61.1-71.6%) | 90-106 (26.3-31%) | 304-358 (88.9-104.7%) |
| Sceptile-Mega | 390-459 (138.3-162.8%) | 63-75 (22.3-26.6%) | 474-559 (168.1-198.2%) | 141-166 (50-58.9%) | 97-114 (34.4-40.4%) | 431-507 (152.8-179.8%) | 684-807 (242.6-286.2%) | 120-141 (42.6-50%) | 209-246 (74.1-87.2%) | 88-103 (31.2-36.5%) |
| Talonflame | 203-239 (68.1-80.2%) | 533-628 (178.9-210.7%) | 247-291 (82.9-97.7%) | 148-174 (49.7-58.4%) | 0-0 (0-0%) | 255-300 (85.6-100.7%) | 177-210 (59.4-70.5%) | 62-74 (20.8-24.8%) | 875-1029 (293.6-345.3%) | 92-108 (30.9-36.2%) |
| Cobalion | 124-146 (38.3-45.1%) | 162-191 (50-59%) | 150-178 (46.3-54.9%) | 44-53 (13.6-16.4%) | 247-291 (76.2-89.8%) | 123-145 (38-44.8%) | 54-60 (16.7-18.5%) | 154-183 (47.5-56.5%) | 33-39 (10.2-12%) | 112-132 (34.6-40.7%) |
| Crobat | 185-218 (59.3-69.9%) | 242-285 (77.6-91.3%) | 224-265 (71.8-84.9%) | 133-158 (42.6-50.6%) | 0-0 (0-0%) | 226-266 (72.4-85.3%) | 327-381 (104.8-122.1%) | 28-33 (9-10.6%) | 397-468 (127.2-150%) | 83-98 (26.6-31.4%) |
| Diggersby | 191-225 (61.2-72.1%) | 500-588 (160.3-188.5%) | 232-273 (74.4-87.5%) | 137-162 (43.9-51.9%) | 190-223 (60.9-71.5%) | 233-275 (74.7-88.1%) | 333-393 (106.7-126%) | 236-279 (75.6-89.4%) | 102-120 (32.7-38.5%) | 692-814 (221.8-260.9%) |
| Durant | 140-165 (54.3-64%) | 183-215 (70.9-83.3%) | 170-200 (65.9-77.5%) | 50-59 (19.4-22.9%) | 139-164 (53.9-63.6%) | 167-197 (64.7-76.4%) | 60-72 (23.3-27.9%) | 87-102 (33.7-39.5%) | 150-177 (58.1-68.6%) | 63-74 (24.4-28.7%) |
| Golurk-Mega | 148-174 (46.3-54.4%) | 387-456 (120.9-142.5%) | 179-211 (55.9-65.9%) | 0-0 (0-0%) | 147-173 (45.9-54.1%) | 181-213 (56.6-66.6%) | 264-312 (82.5-97.5%) | 0-0 (0-0%) | 79-93 (24.7-29.1%) | 535-630 (167.2-196.9%) |
| Houndoom-Mega | 168-198 (57.5-67.8%) | 440-518 (150.7-177.4%) | 204-240 (69.9-82.2%) | 122-143 (41.8-49%) | 335-394 (114.7-134.9%) | 205-242 (70.2-82.9%) | 72-84 (24.7-28.8%) | 209-245 (71.6-83.9%) | 361-425 (123.6-145.5%) | 152-179 (52.1-61.3%) |
| Kleavor | 161-189 (57.1-67%) | 421-496 (149.3-175.9%) | 195-230 (69.1-81.6%) | 58-68 (20.6-24.1%) | 160-188 (56.7-66.7%) | 252-296 (89.4-105%) | 138-165 (48.9-58.5%) | 100-117 (35.5-41.5%) | 345-406 (122.3-144%) | 291-342 (103.2-121.3%) |
| Latias | 168-198 (55.6-65.6%) | 110-129 (36.4-42.7%) | 204-240 (67.5-79.5%) | 122-143 (40.4-47.4%) | 167-197 (55.3-65.2%) | 301-355 (99.7-117.5%) | 294-351 (97.4-116.2%) | 52-61 (17.2-20.2%) | 180-212 (59.6-70.2%) | 152-179 (50.3-59.3%) |
| Lycanroc-Dusk | 109-128 (37.3-43.8%) | 572-673 (195.9-230.5%) | 132-156 (45.2-53.4%) | 79-92 (27.1-31.5%) | 434-511 (148.6-175%) | 267-314 (91.4-107.5%) | 189-222 (64.7-76%) | 270-318 (92.5-108.9%) | 234-275 (80.1-94.2%) | 791-931 (270.9-318.8%) |
| Malamar-Mega | 171-201 (54.5-64%) | 224-264 (71.3-84.1%) | 208-245 (66.2-78%) | 124-145 (39.5-46.2%) | 170-200 (54.1-63.7%) | 161-190 (51.3-60.5%) | 150-174 (47.8-55.4%) | 106-124 (33.8-39.5%) | 184-216 (58.6-68.8%) | 310-365 (98.7-116.2%) |
| Meowstic-M-Mega | 193-227 (66.6-78.3%) | 252-297 (86.9-102.4%) | 234-275 (80.7-94.8%) | 140-165 (48.3-56.9%) | 192-226 (66.2-77.9%) | 187-220 (64.5-75.9%) | 165-198 (56.9-68.3%) | 59-70 (20.3-24.1%) | 207-243 (71.4-83.8%) | 349-411 (120.3-141.7%) |
| Raichu-Mega-X | 80-94 (30.5-35.9%) | 210-248 (80.2-94.7%) | 97-114 (37-43.5%) | 117-137 (44.7-52.3%) | 320-377 (122.1-143.9%) | 196-231 (74.8-88.2%) | 138-165 (52.7-63%) | 100-117 (38.2-44.7%) | 172-203 (65.6-77.5%) | 291-342 (111.1-130.5%) |
| Zarude | 296-348 (84.1-98.9%) | 96-114 (27.3-32.4%) | 360-423 (102.3-120.2%) | 106-126 (30.1-35.8%) | 73-86 (20.7-24.4%) | 196-231 (55.7-65.6%) | 264-312 (75-88.6%) | 184-217 (52.3-61.6%) | 159-187 (45.2-53.1%) | 133-157 (37.8-44.6%) |
| Absol-Mega | 232-273 (85.3-100.4%) | 304-357 (111.8-131.3%) | 282-331 (103.7-121.7%) | 167-197 (61.4-72.4%) | 231-271 (84.9-99.6%) | 284-334 (104.4-122.8%) | 201-237 (73.9-87.1%) | 287-338 (105.5-124.3%) | 249-293 (91.5-107.7%) | 421-495 (154.8-182%) |
| Aggron-Mega | 37-44 (13.1-15.6%) | 97-114 (34.4-40.4%) | 45-53 (16-18.8%) | 27-31 (9.6-11%) | 111-131 (39.4-46.5%) | 113-133 (40.1-47.2%) | 33-39 (11.7-13.8%) | 70-83 (24.8-29.4%) | 40-47 (14.2-16.7%) | 67-78 (23.8-27.7%) |
| Azelf | 206-242 (70.5-82.9%) | 269-317 (92.1-108.6%) | 250-295 (85.6-101%) | 149-175 (51-59.9%) | 205-241 (70.2-82.5%) | 252-296 (86.3-101.4%) | 177-210 (60.6-71.9%) | 63-74 (21.6-25.3%) | 221-260 (75.7-89%) | 373-439 (127.7-150.3%) |
| Barraskewda | 232-273 (87.9-103.4%) | 152-178 (57.6-67.4%) | 282-331 (106.8-125.4%) | 167-197 (63.3-74.6%) | 231-271 (87.5-102.7%) | 325-383 (123.1-145.1%) | 99-117 (37.5-44.3%) | 143-169 (54.2-64%) | 249-293 (94.3-111%) | 842-990 (318.9-375%) |
| Breloom | 741-872 (282.8-332.8%) | 121-142 (46.2-54.2%) | 902-1062 (344.3-405.3%) | 133-158 (50.8-60.3%) | 92-108 (35.1-41.2%) | 284-334 (108.4-127.5%) | 327-381 (124.8-145.4%) | 114-135 (43.5-51.5%) | 99-117 (37.8-44.7%) | 167-197 (63.7-75.2%) |
| Celebi | 308-363 (90.1-106.1%) | 100-118 (29.2-34.5%) | 375-442 (109.6-129.2%) | 111-131 (32.5-38.3%) | 76-90 (22.2-26.3%) | 188-222 (55-64.9%) | 273-321 (79.8-93.9%) | 48-55 (14-16.1%) | 165-194 (48.2-56.7%) | 139-164 (40.6-48%) |
---

## K. RU → NU role-comparison matrices

Section H is the role comparison, one candidate at a time. NU competitors are
selected by shared role keys, shared typing and BST proximity — a mechanical
shortlist, not a judgement. Their full profiles are in section D.
---

## L. Speed-tier table

Every RU entry at base Speed 80+. **Priority is not Speed** — it is section M.

| Pokémon | Base | Max neutral | Max +Spe | +1 | +2 | Scarf (from max +Spe) |
| --- | --- | --- | --- | --- | --- | --- |
| Absol-Mega-Z | 151 | 401 | 441 | 661 | 882 | 661 |
| Beedrill-Mega | 145 | 389 | 427 | 640 | 854 | 640 |
| Sceptile-Mega | 145 | 389 | 427 | 640 | 854 | 640 |
| Barraskewda | 136 | 371 | 408 | 612 | 816 | 612 |
| Manectric-Mega | 135 | 369 | 405 | 607 | 810 | 607 |
| Crobat | 130 | 359 | 394 | 591 | 788 | 591 |
| Meloetta-Pirouette | 128 | 355 | 390 | 585 | 780 | 585 |
| Talonflame | 126 | 351 | 386 | 579 | 772 | 579 |
| Swellow | 125 | 349 | 383 | 574 | 766 | 574 |
| Meowstic-M-Mega | 124 | 347 | 381 | 571 | 762 | 571 |
| Ribombee | 124 | 347 | 381 | 571 | 762 | 571 |
| Noivern | 123 | 345 | 379 | 568 | 758 | 568 |
| Cyclizar | 121 | 341 | 375 | 562 | 750 | 562 |
| Pidgeot-Mega | 121 | 341 | 375 | 562 | 750 | 562 |
| Froslass-Mega | 120 | 339 | 372 | 558 | 744 | 558 |
| Absol-Mega | 115 | 329 | 361 | 541 | 722 | 541 |
| Azelf | 115 | 329 | 361 | 541 | 722 | 541 |
| Houndoom-Mega | 115 | 329 | 361 | 541 | 722 | 541 |
| Zygarde-10% | 115 | 329 | 361 | 541 | 722 | 541 |
| Maushold | 111 | 321 | 353 | 529 | 706 | 529 |
| Tornadus | 111 | 321 | 353 | 529 | 706 | 529 |
| Latias | 110 | 319 | 350 | 525 | 700 | 525 |
| Lycanroc-Dusk | 110 | 319 | 350 | 525 | 700 | 525 |
| Ogerpon | 110 | 319 | 350 | 525 | 700 | 525 |
| Raichu-Mega-X | 110 | 319 | 350 | 525 | 700 | 525 |
| Durant | 109 | 317 | 348 | 522 | 696 | 522 |
| Cobalion | 108 | 315 | 346 | 519 | 692 | 519 |
| Infernape | 108 | 315 | 346 | 519 | 692 | 519 |
| Iron Jugulis | 108 | 315 | 346 | 519 | 692 | 519 |
| Munkidori | 106 | 311 | 342 | 513 | 684 | 513 |
| Zarude | 105 | 309 | 339 | 508 | 678 | 508 |
| Nihilego | 103 | 305 | 335 | 502 | 670 | 502 |
| Sandy Shocks | 101 | 301 | 331 | 496 | 662 | 496 |
| Celebi | 100 | 299 | 328 | 492 | 656 | 492 |
| Comfey | 100 | 299 | 328 | 492 | 656 | 492 |
| Entei | 100 | 299 | 328 | 492 | 656 | 492 |
| Falinks-Mega | 100 | 299 | 328 | 492 | 656 | 492 |
| Linoone | 100 | 299 | 328 | 492 | 656 | 492 |
| Fezandipiti | 99 | 297 | 326 | 489 | 652 | 489 |
| Sigilyph | 97 | 293 | 322 | 483 | 644 | 483 |
| Mimikyu | 96 | 291 | 320 | 480 | 640 | 480 |
| Mimikyu-Busted | 96 | 291 | 320 | 480 | 640 | 480 |
| Darmanitan | 95 | 289 | 317 | 475 | 634 | 475 |
| Obstagoon | 95 | 289 | 317 | 475 | 634 | 475 |
| Sharpedo | 95 | 289 | 317 | 475 | 634 | 475 |
| Yanmega | 95 | 289 | 317 | 475 | 634 | 475 |
| Tinkaton | 94 | 287 | 315 | 472 | 630 | 472 |
| Oricorio-Pom-Pom | 93 | 285 | 313 | 469 | 626 | 469 |
| Oricorio-Sensu | 93 | 285 | 313 | 469 | 626 | 469 |
| Krookodile | 92 | 283 | 311 | 466 | 622 | 466 |
| Lokix | 92 | 283 | 311 | 466 | 622 | 466 |
| Tatsugiri-Curly-Mega | 92 | 283 | 311 | 466 | 622 | 466 |
| Arcanine-Hisui | 90 | 279 | 306 | 459 | 612 | 459 |
| Deoxys-Defense | 90 | 279 | 306 | 459 | 612 | 459 |
| Lucario | 90 | 279 | 306 | 459 | 612 | 459 |
| Revavroom | 90 | 279 | 306 | 459 | 612 | 459 |
| Roserade | 90 | 279 | 306 | 459 | 612 | 459 |
| Malamar-Mega | 88 | 275 | 302 | 453 | 604 | 453 |
| Cresselia | 85 | 269 | 295 | 442 | 590 | 442 |
| Duraludon | 85 | 269 | 295 | 442 | 590 | 442 |
| Kleavor | 85 | 269 | 295 | 442 | 590 | 442 |
| Nidoking | 85 | 269 | 295 | 442 | 590 | 442 |
| Suicune | 85 | 269 | 295 | 442 | 590 | 442 |
| Slither Wing | 81 | 261 | 287 | 430 | 574 | 430 |
| Eelektross-Mega | 80 | 259 | 284 | 426 | 568 | 426 |
| Gallade | 80 | 259 | 284 | 426 | 568 | 426 |
| Gardevoir | 80 | 259 | 284 | 426 | 568 | 426 |
| Mandibuzz | 80 | 259 | 284 | 426 | 568 | 426 |
| Regidrago | 80 | 259 | 284 | 426 | 568 | 426 |
| Togekiss | 80 | 259 | 284 | 426 | 568 | 426 |

**Conditional speed abilities in RU** (none of these is active by default):

- **Swift Swim — needs rain**: Barraskewda, Seismitoad
- **Chlorophyll — needs sun**: Tangrowth
- **Sand Rush — needs sandstorm**: Dracozolt
- **Slush Rush — needs snow**: Arctozolt, Cetitan
- **Unburden — needs its item consumed**: Slurpuff
- **Speed Boost — +1 at the end of each turn**: Sharpedo, Yanmega
- **Quick Feet — needs a status**: Linoone
- **Light Metal — +1 Speed on EVERY entry, resets on switch-out**: Duraludon, Registeel
- **Quark Drive — needs Electric Terrain or Booster Energy**: Iron Jugulis, Iron Thorns
- **Protosynthesis — needs sun or Booster Energy**: Sandy Shocks, Slither Wing
---

## M. Priority table

Engine priority for every RU entry that has any, including Grassy Glide's
engine-side +1.

| Pokémon | Priority moves (engine BP / bracket) | Max offence | Abilities |
| --- | --- | --- | --- |
| Absol-Mega | Sucker Punch 80P Dark (+1); Feint 50P Normal (+2); Quick Attack 40P Normal (+1) | Atk 438 / SpA 361 | Magic Bounce |
| Absol-Mega-Z | Sucker Punch 80P Dark (+1); Feint 50P Normal (+2); Quick Attack 40P Normal (+1) | Atk 447 / SpA 273 | Sharpness |
| Arcanine-Hisui | Extreme Speed 80P Normal (+2) | Atk 361 / SpA 317 | Intimidate/Flash Fire/Rock Head |
| Banette-Mega | Sucker Punch 80P Dark (+1); Shadow Sneak 40P Ghost (+1) | Atk 471 / SpA 313 | Prankster |
| Barraskewda | Aqua Jet 40P Water (+1) | Atk 379 / SpA 240 | Swift Swim/Propeller Tail |
| Blastoise | Aqua Jet 40P Water (+1); Fake Out 40P Normal (+3) | Atk 291 / SpA 295 | Torrent/Rain Dish |
| Breloom | Feint 50P Normal (+2); Mach Punch 40P Fighting (+1); Vacuum Wave 40S Fighting (+1) | Atk 394 / SpA 240 | Effect Spore/Poison Heal/Technician |
| Celebi | Sucker Punch 80P Dark (+1); Grassy Glide 70P Grass (+1) | Atk 328 / SpA 328 | Natural Cure |
| Cetitan | Ice Shard 40P Ice (+1) | Atk 357 / SpA 207 | Thick Fat/Slush Rush/Sheer Force |
| Chesnaught | Grassy Glide 70P Grass (+1); Feint 50P Normal (+2) | Atk 344 / SpA 271 | Overgrow/Bulletproof |
| Cloyster | Ice Shard 40P Ice (+1) | Atk 317 / SpA 295 | Shell Armor/Skill Link/Overcoat |
| Cobalion | Upper Hand 65P Fighting (+3); Quick Attack 40P Normal (+1); Vacuum Wave 40S Fighting (+1) | Atk 306 / SpA 306 | Justified |
| Comfey | Grassy Glide 70P Grass (+1) | Atk 223 / SpA 289 | Flower Veil/Triage/Natural Cure |
| Crabominable-Mega | Upper Hand 65P Fighting (+3) | Atk 454 / SpA 245 | Iron Fist |
| Crawdaunt | Aqua Jet 40P Water (+1) | Atk 372 / SpA 306 | Hyper Cutter/Shell Armor/Adaptability |
| Crobat | Quick Attack 40P Normal (+1) | Atk 306 / SpA 262 | Inner Focus/Infiltrator |
| Cyclizar | Quick Attack 40P Normal (+1) | Atk 317 / SpA 295 | Shed Skin/Regenerator |
| Deoxys-Defense | Extreme Speed 80P Normal (+2) | Atk 262 / SpA 262 | Pressure |
| Diggersby | Quick Attack 40P Normal (+1) | Atk 232 / SpA 218 | Pickup/Cheek Pouch/Huge Power |
| Donphan | Ice Shard 40P Ice (+1) | Atk 372 / SpA 240 | Sturdy/Sand Veil |
| Durant | First Impression 90P Bug (+2) | Atk 348 / SpA 214 | Swarm/Hustle/Truant |
| Empoleon | Aqua Jet 40P Water (+1); Vacuum Wave 40S Fighting (+1) | Atk 298 / SpA 353 | Torrent/Competitive/Defiant |
| Entei | Extreme Speed 80P Normal (+2) | Atk 361 / SpA 306 | Pressure/Inner Focus/Flash Fire |
| Falinks-Mega | First Impression 90P Bug (+2); Upper Hand 65P Fighting (+3) | Atk 405 / SpA 262 | Defiant |
| Feraligatr | Aqua Jet 40P Water (+1) | Atk 339 / SpA 282 | Torrent/Sheer Force |
| Fezandipiti | Quick Attack 40P Normal (+1) | Atk 309 / SpA 262 | Toxic Chain/Technician |
| Froslass-Mega | Sucker Punch 80P Dark (+1); Ice Shard 40P Ice (+1) | Atk 284 / SpA 416 | Snow Warning |
| Gallade | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Shadow Sneak 40P Ghost (+1); Vacuum Wave 40S Fighting (+1) | Atk 383 / SpA 251 | Steadfast/Sharpness/Justified |
| Gardevoir | Shadow Sneak 40P Ghost (+1); Vacuum Wave 40S Fighting (+1) | Atk 251 / SpA 383 | Synchronize/Trace/Telepathy |
| Golisopod | First Impression 90P Bug (+2); Sucker Punch 80P Dark (+1); Aqua Jet 40P Water (+1) | Atk 383 / SpA 240 | Emergency Exit |
| Houndoom-Mega | Sucker Punch 80P Dark (+1); Feint 50P Normal (+2) | Atk 306 / SpA 416 | Solar Power |
| Infernape | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Fake Out 40P Normal (+3); Mach Punch 40P Fighting (+1) | Atk 337 / SpA 337 | Blaze/Iron Fist |
| Kleavor | Feint 50P Normal (+2); Quick Attack 40P Normal (+1); Vacuum Wave 40S Fighting (+1) | Atk 405 / SpA 207 | Swarm/Sheer Force/Sharpness |
| Latias | Sucker Punch 80P Dark (+1) | Atk 284 / SpA 350 | Levitate |
| Linoone | Extreme Speed 80P Normal (+2) | Atk 262 / SpA 218 | Pickup/Gluttony/Quick Feet |
| Lokix | First Impression 90P Bug (+2); Sucker Punch 80P Dark (+1); Feint 50P Normal (+2) | Atk 333 / SpA 223 | Swarm/Tinted Lens |
| Lucario | Extreme Speed 80P Normal (+2); Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Bullet Punch 40P Steel (+1) | Atk 350 / SpA 361 | Steadfast/Inner Focus/Justified |
| Lycanroc-Dusk | Sucker Punch 80P Dark (+1); Accelerock 40P Rock (+1); Quick Attack 40P Normal (+1) | Atk 366 / SpA 229 | Tough Claws |
| Machamp | Bullet Punch 40P Steel (+1); Vacuum Wave 40S Fighting (+1) | Atk 394 / SpA 251 | Guts/No Guard/Steadfast |
| Manectric-Mega | Quick Attack 40P Normal (+1) | Atk 273 / SpA 405 | Intimidate |
| Maushold | Feint 50P Normal (+2) | Atk 273 / SpA 251 | Friend Guard/Cheek Pouch/Technician |
| Meloetta-Pirouette | Quick Attack 40P Normal (+1) | Atk 390 / SpA 278 | Serene Grace |
| Meowstic-M-Mega | Sucker Punch 80P Dark (+1); Fake Out 40P Normal (+3) | Atk 214 / SpA 423 | Trace |
| Mimikyu | Shadow Sneak 40P Ghost (+1) | Atk 306 / SpA 218 | Disguise |
| Mimikyu-Busted | Shadow Sneak 40P Ghost (+1) | Atk 306 / SpA 218 | Disguise |
| Muk-Alola | Shadow Sneak 40P Ghost (+1) | Atk 339 / SpA 251 | Poison Touch/Gluttony/Power of Alchemy |
| Munkidori | Fake Out 40P Normal (+3) | Atk 273 / SpA 394 | Toxic Chain/Frisk |
| Nidoking | Sucker Punch 80P Dark (+1) | Atk 333 / SpA 295 | Poison Point/Rivalry/Sheer Force |
| Nidoqueen | Sucker Punch 80P Dark (+1) | Atk 311 / SpA 273 | Poison Point/Rivalry/Sheer Force |
| Obstagoon | Extreme Speed 80P Normal (+2) | Atk 306 / SpA 240 | Reckless/Guts/Defiant |
| Ogerpon | Grassy Glide 70P Grass (+1); Quick Attack 40P Normal (+1) | Atk 372 / SpA 240 | Defiant |
| Pangoro | Bullet Punch 40P Steel (+1) | Atk 381 / SpA 260 | Iron Fist/Mold Breaker/Scrappy |
| Pelipper | Quick Attack 40P Normal (+1) | Atk 218 / SpA 317 | Keen Eye/Drizzle/Rain Dish |
| Pidgeot-Mega | Quick Attack 40P Normal (+1) | Atk 284 / SpA 405 | No Guard |
| Raichu-Mega-X | Extreme Speed 80P Normal (+2); Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Fake Out 40P Normal (+3) | Atk 405 / SpA 306 | Electric Surge |
| Roserade | Grassy Glide 70P Grass (+1) | Atk 262 / SpA 383 | Natural Cure/Poison Point/Technician |
| Sceptile-Mega | Grassy Glide 70P Grass (+1); Upper Hand 65P Fighting (+3); Quick Attack 40P Normal (+1); Vacuum Wave 40S Fighting (+1) | Atk 350 / SpA 427 | Lightning Rod |
| Scovillain-Mega | Grassy Glide 70P Grass (+1) | Atk 412 / SpA 412 | Spicy Spray |
| Sharpedo | Feint 50P Normal (+2); Aqua Jet 40P Water (+1) | Atk 372 / SpA 317 | Rough Skin/Speed Boost |
| Sirfetch’d | First Impression 90P Bug (+2); Grassy Glide 70P Grass (+1); Feint 50P Normal (+2); Quick Attack 40P Normal (+1) | Atk 405 / SpA 258 | Steadfast/Scrappy |
| Slither Wing | First Impression 90P Bug (+2) | Atk 405 / SpA 295 | Protosynthesis |
| Suicune | Extreme Speed 80P Normal (+2) | Atk 273 / SpA 306 | Pressure/Inner Focus/Water Absorb |
| Swellow | Quick Attack 40P Normal (+1) | Atk 295 / SpA 273 | Guts/Scrappy |
| Talonflame | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Quick Attack 40P Normal (+1) | Atk 287 / SpA 271 | Flame Body/Gale Wings |
| Tangrowth | Grassy Glide 70P Grass (+1) | Atk 328 / SpA 350 | Chlorophyll/Leaf Guard/Regenerator |
| Tinkaton | Feint 50P Normal (+2); Fake Out 40P Normal (+3) | Atk 273 / SpA 262 | Mold Breaker/Own Tempo/Pickpocket |
| Togekiss | Extreme Speed 80P Normal (+2) | Atk 327 / SpA 372 | Hustle/Serene Grace/Super Luck |
| Torterra | Grassy Glide 70P Grass (+1) | Atk 348 / SpA 273 | Overgrow/Shell Armor |
| Umbreon | Sucker Punch 80P Dark (+1); Quick Attack 40P Normal (+1) | Atk 251 / SpA 240 | Synchronize/Inner Focus |
| Victreebel-Mega | Sucker Punch 80P Dark (+1); Grassy Glide 70P Grass (+1) | Atk 383 / SpA 405 | Innards Out |
| Yanmega | Feint 50P Normal (+2); Quick Attack 40P Normal (+1) | Atk 276 / SpA 364 | Speed Boost/Tinted Lens/Frisk |
| Zarude | Grassy Glide 70P Grass (+1) | Atk 372 / SpA 262 | Leaf Guard |
| Zygarde-10% | Extreme Speed 80P Normal (+2) | Atk 328 / SpA 243 | Aura Break/Power Construct |
---

## N. Item-freedom table

| Candidate | Item freedom | Consequence |
| --- | --- | --- |
| Absol-Mega-Z | **No** — Absolite Z is forced and unremovable | no Band/Specs/Scarf/Life Orb/Boots/Leftovers/Ring Target/Orbs |
| Beedrill-Mega | **No** — Beedrillite is forced and unremovable | no Band/Specs/Scarf/Life Orb/Boots/Leftovers/Ring Target/Orbs |
| Meloetta-Pirouette | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Sceptile-Mega | **No** — Sceptilite is forced and unremovable | no Band/Specs/Scarf/Life Orb/Boots/Leftovers/Ring Target/Orbs |
| Talonflame | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Cobalion | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Crobat | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Diggersby | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Durant | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Golurk-Mega | **No** — Golurkite is forced and unremovable | no Band/Specs/Scarf/Life Orb/Boots/Leftovers/Ring Target/Orbs |
| Houndoom-Mega | **No** — Houndoominite is forced and unremovable | no Band/Specs/Scarf/Life Orb/Boots/Leftovers/Ring Target/Orbs |
| Kleavor | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Latias | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Lycanroc-Dusk | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Malamar-Mega | **No** — Malamarite is forced and unremovable | no Band/Specs/Scarf/Life Orb/Boots/Leftovers/Ring Target/Orbs |
| Meowstic-M-Mega | **No** — Meowsticite is forced and unremovable | no Band/Specs/Scarf/Life Orb/Boots/Leftovers/Ring Target/Orbs |
| Raichu-Mega-X | **No** — Raichunite X is forced and unremovable | no Band/Specs/Scarf/Life Orb/Boots/Leftovers/Ring Target/Orbs |
| Zarude | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Absol-Mega | **No** — Absolite is forced and unremovable | no Band/Specs/Scarf/Life Orb/Boots/Leftovers/Ring Target/Orbs |
| Aggron-Mega | **No** — Aggronite is forced and unremovable | no Band/Specs/Scarf/Life Orb/Boots/Leftovers/Ring Target/Orbs |
| Azelf | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Barraskewda | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Breloom | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Celebi | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
---

## O. RU Mega opportunity-cost table

RU has **25** forme entries and a team gets **one** Mega.

| Forme | Types | BST (spread) | Ability | Source | STAB | Setup | Recovery | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Absol-Mega | Dark | 565 (65/150/60/115/60/115) | Magic Bounce | imported | Dark Foul Play 95P | Calm Mind, Hone Claws, Swords Dance | Rest | Sucker Punch 80P Dark (+1), Feint 50P Normal (+2), Quick Attack 40P Normal (+1) |
| Absol-Mega-Z | Dark/Ghost | 565 (65/154/60/75/60/151) | Sharpness | **estimated** | Dark Foul Play 95P · Ghost Shadow Claw 70P | Calm Mind, Hone Claws, Swords Dance | Rest | Sucker Punch 80P Dark (+1), Feint 50P Normal (+2), Quick Attack 40P Normal (+1) |
| Aggron-Mega | Steel | 630 (70/140/230/60/80/50) | Filter | imported | Steel Steel Roller 130P | Autotomize, Defense Curl, Harden, Hone Claws, Iron Defense, Rock Polish | Rest | — |
| Ampharos-Mega | Electric/Dragon | 610 (90/95/105/165/110/45) | Mold Breaker | imported | Electric Thunder 120S · Dragon Dragon Pulse 90S | Agility, Charge, Cotton Guard, Defense Curl | Rest | — |
| Banette-Mega | Ghost | 555 (64/165/75/93/83/75) | Prankster | imported | Ghost Poltergeist 110P | Calm Mind, Cotton Guard, Nasty Plot, Swords Dance | Rest | Sucker Punch 80P Dark (+1), Shadow Sneak 40P Ghost (+1) |
| Beedrill-Mega | Bug/Poison | 495 (65/150/40/15/80/145) | Adaptability | imported | Bug Twineedle 50x2P · Poison Poison Jab 80P | Agility, Harden, Iron Defense, Swords Dance | Rest, Roost | — |
| Camerupt-Mega | Fire/Ground | 560 (70/120/100/145/105/20) | Sheer Force | imported | Fire Eruption 150S · Ground Earthquake 100P | Amnesia, Defense Curl, Growth, Rock Polish | Rest | — |
| Chimecho-Mega | Psychic/Steel | 555 (75/50/110/135/120/65) | Levitate | **estimated** | Psychic Future Sight 120S | Calm Mind, Cosmic Power, Defense Curl | Recover, Rest | — |
| Crabominable-Mega | Fighting/Ice | 578 (97/157/122/62/107/33) | Iron Fist | **estimated** | Fighting Focus Punch 150P · Ice Ice Hammer 100P | Amnesia, Bulk Up, Iron Defense, Work Up | Rest | Upper Hand 65P Fighting (+3) |
| Darmanitan-Zen | Fire/Psychic | 540 (105/30/105/140/105/55) | Zen Mode | imported | Fire Flare Blitz 120P · Psychic Zen Headbutt 80P | Bulk Up, Iron Defense, Work Up | Rest | — |
| Eelektross-Mega | Electric | 615 (85/145/80/135/90/80) | Eelevate | imported | Electric Thunder 120S | Bulk Up, Charge, Coil, Hone Claws | Rest | — |
| Falinks-Mega | Fighting | 570 (65/135/135/70/65/100) | Defiant | **estimated** | Fighting Close Combat 120P | Agility, Bulk Up, Iron Defense, No Retreat, Swords Dance | Rest | First Impression 90P Bug (+2), Upper Hand 65P Fighting (+3) |
| Froslass-Mega | Ice/Ghost | 580 (70/80/70/140/100/120) | Snow Warning | **estimated** | Ice Blizzard 120S · Ghost Shadow Ball 80S | — | Rest | Sucker Punch 80P Dark (+1), Ice Shard 40P Ice (+1) |
| Golurk-Mega | Ground/Ghost | 583 (89/159/105/70/105/55) | Unseen Fist | **estimated** | Ground Earthquake 100P · Ghost Poltergeist 110P | Defense Curl, Iron Defense, Rock Polish | Rest | — |
| Houndoom-Mega | Dark/Fire | 600 (75/90/90/140/90/115) | Solar Power | imported | Dark Dark Pulse 80S · Fire Overheat 140S | Nasty Plot | Rest | Sucker Punch 80P Dark (+1), Feint 50P Normal (+2) |
| Malamar-Mega | Dark/Psychic | 582 (86/102/88/98/120/88) | Contrary | **estimated** | Dark Foul Play 95P · Psychic Future Sight 120S | Calm Mind, Nasty Plot | Rest | — |
| Manectric-Mega | Electric | 575 (70/75/80/135/80/135) | Intimidate | imported | Electric Thunder 120S | Agility, Charge | Rest | Quick Attack 40P Normal (+1) |
| Meowstic-M-Mega | Psychic | 566 (74/48/76/143/101/124) | Trace | imported | Psychic Dream Eater 100S | Barrier, Calm Mind, Nasty Plot, Work Up | Rest | Sucker Punch 80P Dark (+1), Fake Out 40P Normal (+3) |
| Pidgeot-Mega | Normal/Flying | 579 (83/80/80/135/80/121) | No Guard | imported | Normal Uproar 90S · Flying Hurricane 120S | Agility, Work Up | Rest, Roost | Quick Attack 40P Normal (+1) |
| Raichu-Mega-X | Electric | 585 (60/135/95/90/95/110) | Electric Surge | imported | Electric Rising Voltage 140S | Agility, Calm Mind, Charge, Defense Curl, Nasty Plot | Rest | Extreme Speed 80P Normal (+2), Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3) |
| Sceptile-Mega | Grass/Dragon | 630 (70/110/75/145/85/145) | Lightning Rod | imported | Grass Leaf Storm 140S · Dragon Outrage 120P | Agility, Dragon Dance, Hone Claws, Swords Dance, Work Up | Rest | Grassy Glide 70P Grass (+1), Upper Hand 65P Fighting (+3), Quick Attack 40P Normal (+1), Vacuum Wave 40S Fighting (+1) |
| Scovillain-Mega | Grass/Fire | 586 (65/138/85/138/85/75) | Spicy Spray | imported | Grass Leaf Storm 140S · Fire Overheat 140S | Growth | Rest | Grassy Glide 70P Grass (+1) |
| Steelix-Mega | Steel/Ground | 610 (75/125/230/55/95/30) | Sand Force | imported | Steel Steel Roller 130P · Ground Earthquake 100P | Autotomize, Defense Curl, Dragon Dance, Harden, Iron Defense, Rock Polish | Rest | — |
| Tatsugiri-Curly-Mega | Dragon/Water | 575 (68/65/90/135/125/92) | Commander | imported | Dragon Draco Meteor 140S · Water Hydro Pump 120S | Dragon Dance, Harden, Nasty Plot | Rest | — |
| Victreebel-Mega | Grass/Poison | 590 (80/125/85/135/95/70) | Innards Out | imported | Grass Leaf Storm 140S · Poison Belch 120S | Growth, Swords Dance | Rest | Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1) |

A Mega is only tier-breaking if a team is pressured to spend its **one** Mega
slot on it rather than on any of the above.
---

## P. Hazard environment

**Stealth Rock:** Aggron-Mega, Arcanine-Hisui, Azelf, Barbaracle, Camerupt-Mega, Celebi, Cobalion, Copperajah, Deoxys-Defense, Diancie, Donphan, Duraludon, Empoleon, Forretress, Garganacl, Gastrodon, Golurk-Mega, Infernape, Iron Thorns, Kleavor, Krookodile, Lycanroc-Dusk, Marowak-Alola, Necrozma, Nidoking, Nidoqueen, Nihilego, Quagsire, Registeel, Sandy Shocks, Seismitoad, Steelix, Steelix-Mega, Tinkaton, Torterra

**Spikes:** Chesnaught, Cloyster, Deoxys-Defense, Diancie, Diggersby, Forretress, Froslass-Mega, Gastrodon, Golisopod, Iron Thorns, Ogerpon, Quagsire, Roserade, Sandy Shocks

**Toxic Spikes:** Beedrill-Mega, Cloyster, Forretress, Muk-Alola, Nidoking, Nidoqueen, Nihilego, Quagsire, Revavroom, Roserade, Toxtricity, Toxtricity-Low-Key, Weezing-Galar

**Sticky Web:** Ribombee, Slurpuff

**Rapid Spin:** Blastoise, Cloyster, Cyclizar, Donphan, Forretress, Tatsugiri-Curly-Mega

**Defog:** Beedrill-Mega, Chimecho-Mega, Comfey, Crobat, Empoleon, Kleavor, Latias, Mandibuzz, Noivern, Oricorio-Pom-Pom, Oricorio-Sensu, Pelipper, Pidgeot-Mega, Ribombee, Sigilyph, Sirfetch’d, Swellow, Talonflame, Togekiss, Tornadus, Volcanion, Weezing-Galar, Yanmega

**Mortal Spin / Tidy Up / Court Change:** Maushold

**Magic Bounce:** Absol-Mega

**Ghost types (block Rapid Spin):** Absol-Mega-Z, Banette-Mega, Froslass-Mega, Golurk-Mega, Marowak-Alola, Mimikyu, Mimikyu-Busted, Oricorio-Sensu, Sinistcha, Skeledirge

**Heavy-Duty Boots** are available to every **species** entry and to **no forme**
entry — the stone occupies the slot. That asymmetry is decisive for any
Rock-weak or pivot-reliant Mega on the candidate list.
---

## Q. Weather / terrain / Trick Room / Tailwind environment

**Weather by move:** Rain — Absol-Mega, Absol-Mega-Z, Aggron-Mega, Ampharos-Mega, Arctozolt, Azelf, Banette-Mega, Barbaracle, Barraskewda, Blastoise, Breloom, Camerupt-Mega, Celebi, Cetitan, Chesnaught, Chimecho-Mega, Cloyster, Cobalion, Crabominable-Mega, Crawdaunt, Cresselia, Crobat, Cyclizar, Deoxys-Defense, Diancie, Donphan, Dracozolt, Eelektross-Mega, Empoleon, Enamorus-Therian, Entei, Falinks-Mega, Feraligatr, Forretress, Froslass-Mega, Gallade, Gardevoir, Garganacl, Gastrodon, Golisopod, Golurk-Mega, Houndoom-Mega, Iron Jugulis, Iron Thorns, Kleavor, Latias, Linoone, Lokix, Lucario, Machamp, Magnezone, Malamar-Mega, Mandibuzz, Manectric-Mega, Marowak-Alola, Maushold, Meloetta-Pirouette, Meowstic-M-Mega, Mimikyu, Mimikyu-Busted, Muk-Alola, Nidoking, Nidoqueen, Obstagoon, Ogerpon, Oricorio-Pom-Pom, Oricorio-Sensu, Pangoro, Pelipper, Pidgeot-Mega, Politoed, Porygon2, Quagsire, Raichu-Mega-X, Registeel, Reuniclus, Revavroom, Roserade, Seismitoad, Sharpedo, Sigilyph, Slither Wing, Slurpuff, Suicune, Swellow, Talonflame, Tatsugiri-Curly-Mega, Togekiss, Tornadus, Toxtricity, Toxtricity-Low-Key, Umbreon, Volcanion, Weezing-Galar; Sun — Absol-Mega, Absol-Mega-Z, Aggron-Mega, Ampharos-Mega, Arcanine-Hisui, Armarouge, Azelf, Banette-Mega, Beedrill-Mega, Breloom, Camerupt-Mega, Celebi, Chesnaught, Chimecho-Mega, Cobalion, Comfey, Crabominable-Mega, Cresselia, Crobat, Cyclizar, Darmanitan, Darmanitan-Zen, Deoxys-Defense, Diancie, Donphan, Dracozolt, Eelektross-Mega, Enamorus-Therian, Entei, Falinks-Mega, Forretress, Gallade, Gardevoir, Garganacl, Golurk-Mega, Houndoom-Mega, Infernape, Iron Jugulis, Iron Thorns, Kleavor, Latias, Linoone, Lokix, Lucario, Lycanroc-Dusk, Machamp, Magnezone, Malamar-Mega, Mandibuzz, Marowak-Alola, Maushold, Meloetta-Pirouette, Meowstic-M-Mega, Mimikyu, Mimikyu-Busted, Muk-Alola, Necrozma, Nidoking, Nidoqueen, Noivern, Obstagoon, Ogerpon, Oricorio-Pom-Pom, Oricorio-Sensu, Pangoro, Pidgeot-Mega, Porygon2, Registeel, Reuniclus, Revavroom, Ribombee, Roserade, Sandy Shocks, Sceptile-Mega, Scovillain-Mega, Sirfetch’d, Skeledirge, Slither Wing, Slurpuff, Steelix, Steelix-Mega, Suicune, Swellow, Talonflame, Tangrowth, Tapu Bulu, Togekiss, Tornadus, Torterra, Toxtricity, Toxtricity-Low-Key, Umbreon, Victreebel-Mega, Volcanion, Weezing-Galar, Yanmega, Zarude, Zygarde-10%; Sand — Absol-Mega, Absol-Mega-Z, Aggron-Mega, Arcanine-Hisui, Azelf, Barbaracle, Camerupt-Mega, Celebi, Cobalion, Copperajah, Diancie, Diggersby, Donphan, Durant, Entei, Forretress, Garganacl, Gastrodon, Golurk-Mega, Iron Thorns, Kleavor, Krookodile, Latias, Lycanroc-Dusk, Magnezone, Mandibuzz, Marowak-Alola, Muk-Alola, Necrozma, Nidoking, Nidoqueen, Nihilego, Ogerpon, Oricorio-Pom-Pom, Oricorio-Sensu, Quagsire, Registeel, Revavroom, Sandy Shocks, Scovillain-Mega, Slither Wing, Steelix, Steelix-Mega, Suicune, Tornadus, Torterra, Volcanion, Zygarde-10%; Snow — Cetitan, Cloyster, Crabominable-Mega, Diancie, Empoleon, Froslass-Mega, Gastrodon, Pelipper, Quagsire, Suicune, Tornadus.

**Weather by ability:** Froslass-Mega, Pelipper, Politoed.

**Terrain by move:** Electric — Ampharos-Mega, Eelektross-Mega, Iron Jugulis, Iron Thorns, Magnezone, Manectric-Mega, Raichu-Mega-X, Sandy Shocks, Toxtricity, Toxtricity-Low-Key; Grassy — Breloom, Celebi, Chesnaught, Comfey, Enamorus-Therian, Ogerpon, Roserade, Sceptile-Mega, Scovillain-Mega, Sinistcha, Tangrowth, Tapu Bulu, Torterra, Victreebel-Mega, Zarude; Misty — Enamorus-Therian, Gallade, Gardevoir, Meowstic-M-Mega, Mimikyu, Mimikyu-Busted, Volcanion, Weezing-Galar; Psychic — Armarouge, Celebi, Cresselia, Deoxys-Defense, Gallade, Gardevoir, Meowstic-M-Mega, Munkidori, Reuniclus.

**Terrain by ability:** Raichu-Mega-X, Tapu Bulu, Weezing-Galar.

**Trick Room setters:** Armarouge, Azelf, Banette-Mega, Celebi, Chimecho-Mega, Comfey, Cresselia, Deoxys-Defense, Diancie, Gallade, Gardevoir, Malamar-Mega, Meloetta-Pirouette, Meowstic-M-Mega, Mimikyu, Mimikyu-Busted, Necrozma, Nihilego, Porygon2, Reuniclus, Sigilyph, Sinistcha. The **Warp Prism** makes Trick Room *the holder sets* last **8** turns.

**Tailwind setters:** Beedrill-Mega, Comfey, Crobat, Enamorus-Therian, Fezandipiti, Iron Jugulis, Kleavor, Latias, Mandibuzz, Noivern, Oricorio-Pom-Pom, Oricorio-Sensu, Pelipper, Pidgeot-Mega, Ribombee, Sigilyph, Sirfetch’d, Suicune, Swellow, Talonflame, Togekiss, Tornadus, Yanmega. The **Wind Sock** makes Tailwind *the holder sets* last **7** turns.

Neither item can be held by a Mega, but a teammate can hold it — which matters
for every slow breaker in section G.

**Mega Sol is PERSONAL weather**, not field-wide sun: it overrides
`battle.weatherFor` for its holder only. Nothing else on the field sees it.
---

## R. Transformation / forme legality audit

Every RU entry was checked for a route to a **higher-tier forme in battle** —
the Zygarde / Darmanitan-Galar shape that this project has had to gate before.

**Item-driven routes from an RU species to a higher-tier forme: 15.** Every one was put through `Validation.validateTeam` in the RU format and
**every one is refused** — the Absol/Absolite rule, with the species staying legal:

| RU species | Item refused in RU | Forme it would make | That forme's tier |
| --- | --- | --- | --- |
| Barbaracle | Barbaracite | Barbaracle-Mega | **OU** |
| Blastoise | Blastoisinite | Blastoise-Mega | **OU** |
| Chesnaught | Chesnaughtite | Chesnaught-Mega | **OU** |
| Diancie | Diancite | Diancie-Mega | **OU** |
| Feraligatr | Feraligite | Feraligatr-Mega | **OU** |
| Gallade | Galladite | Gallade-Mega | **OU** |
| Gardevoir | Gardevoirite | Gardevoir-Mega | **UU** |
| Golisopod | Golisopite | Golisopod-Mega | **OU** |
| Latias | Latiasite | Latias-Mega | **UU** |
| Lucario | Lucarionite Z | Lucario-Mega-Z | **Ubers** |
| Lucario | Lucarionite | Lucario-Mega | **OU** |
| Ogerpon | Cornerstone Mask | Ogerpon-Cornerstone | **OU** |
| Ogerpon | Hearthflame Mask | Ogerpon-Hearthflame | **OU** |
| Ogerpon | Wellspring Mask | Ogerpon-Wellspring | **OU** |
| Sharpedo | Sharpedonite | Sharpedo-Mega | **UU** |

**Ability-driven routes:**

- **Darmanitan** → Darmanitan-Zen via **Zen Mode** (at half HP or less) — target tier **RU**. Same rung as RU — no legality issue.
- **Zygarde-10%** → Zygarde-Complete via **Power Construct** (at half HP or less) — target tier **Ubers**. **Higher than RU: the ability is refused at team validation** (verified: _"Power Construct is banned in RarelyUsed"_), and the Pokémon stays legal on its other ability.

**Conclusion: no legality hole found.** Both classes are gated, and the gates
were exercised through the real validator rather than read off the data.
---

## S. New candidates surfaced by the mechanical scan

Mechanical flags only — reasons to look, **not** recommendations. 53 of
131 RU entries tripped two or more.

- **Absol-Mega-Z** (Dark/Ghost, BST 565, Sharpness, **estimated**) — Speed **441**; setup + priority + reliable recovery; strong setup on a fast frame; ability: Sharpness.
- **Beedrill-Mega** (Bug/Poison, BST 495, Adaptability) — Speed **427**; strong setup on a fast frame; ability: Adaptability; hazards + real offence.
- **Meloetta-Pirouette** (Normal/Fighting, BST 600, Serene Grace) — Speed **390**; BST 600; setup + priority + reliable recovery; strong setup on a fast frame.
- **Sceptile-Mega** (Grass/Dragon, BST 630, Lightning Rod) — Speed **427**; BST 630; setup + priority + reliable recovery; strong setup on a fast frame.
- **Talonflame** (Fire/Flying, BST 499, Flame Body/Gale Wings) — Speed **386**; setup + priority + reliable recovery; strong setup on a fast frame; ability: Gale Wings.
- **Cobalion** (Steel/Fighting, BST 580, Justified) — BST 580; setup + priority + reliable recovery; strong setup on a fast frame.
- **Crobat** (Poison/Flying, BST 535, Inner Focus/Infiltrator) — Speed **394**; setup + priority + reliable recovery; strong setup on a fast frame.
- **Diggersby** (Normal/Ground, BST 423, Pickup/Cheek Pouch/Huge Power) — setup + priority + reliable recovery; ability: Huge Power; hazards + real offence.
- **Durant** (Bug/Steel, BST 484, Swarm/Hustle/Truant) — Attack **522**; Attack reaches 522 off base 109 — an ability is doing the work; setup + priority + reliable recovery.
- **Golurk-Mega** (Ground/Ghost, BST 583, Unseen Fist, **estimated**) — BST 583; BST 583 on an **estimated** tier; hazards + real offence.
- **Houndoom-Mega** (Dark/Fire, BST 600, Solar Power) — BST 600; setup + priority + reliable recovery; strong setup on a fast frame.
- **Kleavor** (Bug/Rock, BST 500, Swarm/Sheer Force/Sharpness) — setup + priority + reliable recovery; ability: Sheer Force/Sharpness; hazards + real offence.
- **Latias** (Dragon/Psychic, BST 600, Levitate) — BST 600; setup + priority + reliable recovery; strong setup on a fast frame.
- **Lycanroc-Dusk** (Rock, BST 487, Tough Claws) — setup + priority + reliable recovery; strong setup on a fast frame; ability: Tough Claws.
- **Malamar-Mega** (Dark/Psychic, BST 582, Contrary, **estimated**) — BST 582; ability: Contrary; BST 582 on an **estimated** tier.
- **Meowstic-M-Mega** (Psychic, BST 566, Trace) — Speed **381**; setup + priority + reliable recovery; strong setup on a fast frame.
- **Raichu-Mega-X** (Electric, BST 585, Electric Surge) — BST 585; setup + priority + reliable recovery; strong setup on a fast frame.
- **Zarude** (Dark/Grass, BST 600, Leaf Guard) — BST 600; setup + priority + reliable recovery; strong setup on a fast frame.
- **Absol-Mega** (Dark, BST 565, Magic Bounce) — setup + priority + reliable recovery; strong setup on a fast frame.
- **Aggron-Mega** (Steel, BST 630, Filter) — BST 630; hazards + real offence.
- **Azelf** (Psychic, BST 580, Levitate) — BST 580; strong setup on a fast frame.
- **Barraskewda** (Water, BST 490, Swift Swim/Propeller Tail) — Speed **408**; setup + priority + reliable recovery.
- **Breloom** (Grass/Fighting, BST 460, Effect Spore/Poison Heal/Technician) — setup + priority + reliable recovery; ability: Technician.
- **Celebi** (Psychic/Grass, BST 600, Natural Cure) — BST 600; setup + priority + reliable recovery.
- **Cetitan** (Ice, BST 521, Thick Fat/Slush Rush/Sheer Force) — setup + priority + reliable recovery; ability: Sheer Force.
- **Cloyster** (Water/Ice, BST 525, Shell Armor/Skill Link/Overcoat) — setup + priority + reliable recovery; ability: Skill Link.
- **Crabominable-Mega** (Fighting/Ice, BST 578, Iron Fist, **estimated**) — setup + priority + reliable recovery; BST 578 on an **estimated** tier.
- **Crawdaunt** (Water/Dark, BST 468, Hyper Cutter/Shell Armor/Adaptability) — setup + priority + reliable recovery; ability: Adaptability.
- **Cyclizar** (Dragon/Normal, BST 501, Shed Skin/Regenerator) — setup + priority + reliable recovery; strong setup on a fast frame.
- **Deoxys-Defense** (Psychic, BST 600, Pressure) — BST 600; setup + priority + reliable recovery.
- **Entei** (Fire, BST 580, Pressure/Inner Focus/Flash Fire) — BST 580; setup + priority + reliable recovery.
- **Falinks-Mega** (Fighting, BST 570, Defiant, **estimated**) — setup + priority + reliable recovery; BST 570 on an **estimated** tier.
- **Feraligatr** (Water, BST 530, Torrent/Sheer Force) — setup + priority + reliable recovery; ability: Sheer Force.
- **Fezandipiti** (Poison/Fairy, BST 555, Toxic Chain/Technician) — setup + priority + reliable recovery; ability: Technician.
- **Froslass-Mega** (Ice/Ghost, BST 580, Snow Warning, **estimated**) — BST 580; BST 580 on an **estimated** tier.
- **Gallade** (Psychic/Fighting, BST 518, Steadfast/Sharpness/Justified) — setup + priority + reliable recovery; ability: Sharpness.
- **Infernape** (Fire/Fighting, BST 534, Blaze/Iron Fist) — setup + priority + reliable recovery; strong setup on a fast frame.
- **Manectric-Mega** (Electric, BST 575, Intimidate) — Speed **405**; setup + priority + reliable recovery.
- **Maushold** (Normal, BST 470, Friend Guard/Cheek Pouch/Technician) — setup + priority + reliable recovery; ability: Technician.
- **Munkidori** (Poison/Psychic, BST 555, Toxic Chain/Frisk) — setup + priority + reliable recovery; strong setup on a fast frame.
- **Nidoking** (Poison/Ground, BST 505, Poison Point/Rivalry/Sheer Force) — setup + priority + reliable recovery; ability: Sheer Force.
- **Nidoqueen** (Poison/Ground, BST 505, Poison Point/Rivalry/Sheer Force) — setup + priority + reliable recovery; ability: Sheer Force.
- **Ogerpon** (Grass, BST 550, Defiant) — setup + priority + reliable recovery; strong setup on a fast frame.
- **Ribombee** (Bug/Fairy, BST 464, Honey Gather/Shield Dust/Sweet Veil) — Speed **381**; strong setup on a fast frame.
- **Roserade** (Grass/Poison, BST 515, Natural Cure/Poison Point/Technician) — setup + priority + reliable recovery; ability: Technician.
- **Scovillain-Mega** (Grass/Fire, BST 586, Spicy Spray) — BST 586; setup + priority + reliable recovery.
- **Sharpedo** (Water/Dark, BST 460, Rough Skin/Speed Boost) — setup + priority + reliable recovery; ability: Speed Boost.
- **Suicune** (Water, BST 580, Pressure/Inner Focus/Water Absorb) — BST 580; setup + priority + reliable recovery.
- **Swellow** (Normal/Flying, BST 455, Guts/Scrappy) — Speed **383**; setup + priority + reliable recovery.
- **Tornadus** (Flying, BST 580, Prankster/Defiant) — BST 580; strong setup on a fast frame.
- **Victreebel-Mega** (Grass/Poison, BST 590, Innards Out) — BST 590; setup + priority + reliable recovery.
- **Yanmega** (Bug/Flying, BST 515, Speed Boost/Tinted Lens/Frisk) — setup + priority + reliable recovery; ability: Speed Boost.
- **Zygarde-10%** (Dragon/Ground, BST 486, Aura Break/Power Construct) — setup + priority + reliable recovery; strong setup on a fast frame.

**Multi-hit users in RU**, because the 25-BP-per-hit rewrite changes what these
moves are worth, and Skill Link forces the maximum:

| Move | Type | BP × hits | RU users |
| --- | --- | --- | --- |
| Rock Blast | Rock | 25 × [2,5] | Aggron-Mega, Arcanine-Hisui, Arctozolt, Barbaracle, Cloyster, Copperajah, Dracozolt, Forretress, Garganacl, Gastrodon, Iron Thorns, Kleavor, Lycanroc-Dusk, Machamp, Necrozma, Nidoking, Nidoqueen, Steelix, Steelix-Mega, Torterra |
| Bullet Seed | Grass | 25 × [2,5] | Breloom, Chesnaught, Comfey, Maushold, Ogerpon, Roserade, Sceptile-Mega, Scovillain-Mega, Tangrowth, Tapu Bulu, Torterra, Victreebel-Mega, Zarude |
| Icicle Spear | Ice | 25 × [2,5] | Arctozolt, Cetitan, Cloyster, Froslass-Mega |
| Pin Missile | Bug | 25 × [2,5] | Beedrill-Mega, Chesnaught, Cloyster, Forretress, Golisopod, Iron Thorns, Linoone, Obstagoon, Roserade |
| Bone Rush | Ground | 25 × [2,5] | Lucario, Mandibuzz, Marowak-Alola |
| Tail Slap | Normal | 25 × [2,5] | Fezandipiti, Linoone, Lycanroc-Dusk, Meowstic-M-Mega, Obstagoon |
| Arm Thrust | Fighting | 25 × [2,5] | Pangoro |
| Fury Attack | Normal | 25 × [2,5] | Barraskewda, Beedrill-Mega, Donphan, Empoleon, Mandibuzz, Nidoking, Sirfetch’d |
| Fury Swipes | Normal | 25 × [2,5] | Barbaracle, Infernape, Linoone, Nidoqueen, Obstagoon, Zarude |
| Spike Cannon | Normal | 25 × [2,5] | Cloyster |
| Double Hit | Normal | 50 × 2 | Crawdaunt, Empoleon, Kleavor, Maushold, Weezing-Galar |
| Dual Chop | Dragon | 50 × 2 | Barbaracle, Bewear, Chesnaught, Crabominable-Mega, Gallade, Golisopod, Infernape, Lucario, Machamp, Meloetta-Pirouette, Pangoro, Sceptile-Mega, Tapu Bulu |
| Dual Wingbeat | Flying | 50 × 2 | Celebi, Crobat, Empoleon, Fezandipiti, Iron Jugulis, Kleavor, Latias, Mandibuzz, Noivern, Oricorio-Pom-Pom, Oricorio-Sensu, Pelipper, Ribombee, Sigilyph, Sirfetch’d, Slither Wing, Talonflame, Togekiss, Yanmega |
| Twineedle | Bug | 50 × 2 | Beedrill-Mega, Cloyster |
| Bonemerang | Ground | 50 × 2 | Marowak-Alola |
| Triple Axel | Ice | 20 × 3 | Empoleon, Froslass-Mega, Gallade, Gardevoir, Meloetta-Pirouette |
| Population Bomb | Normal | 20 × 10 | Maushold |
| Scale Shot | Dragon | 25 × [2,5] | Barraskewda, Cyclizar, Feraligatr, Krookodile, Latias, Regidrago, Sceptile-Mega, Sharpedo, Zygarde-10% |

**Skill Link holders in RU: Cloyster** — Skill Link forces the
maximum hit count, and the calculator honours it (Cloyster's Icicle Spear reports
5 hits with it, 3 without).
---

## T. Remaining genuinely unresolved questions

1. **No usage, ladder, win-rate, tournament or popularity data exists in RedGPT.**
   There is no metagame history for any tier. Every judgement must be mechanical.
2. **Nothing in RU has been played by a human.** The ladder was rebuilt on
   2026-08-15 and revised on 2026-08-16.
3. **7 RU formes sit on an `estimated` tier** — a nearest-neighbour model
   over BST and base tier, with **no notion of movepool, ability or item cost**.
   That model placed Mega Starmie, whose real profile the UU pass had to correct.
   Section F is the evidence the model cannot see.
4. **Conditional abilities read at their unactivated value.** Guts, Quick Feet,
   Protosynthesis, Quark Drive, Unburden, Swift Swim and the rest are reported
   unboosted, because nothing has triggered them. The Orbs fire **on entry**, so
   for a Guts or Quick Feet holder the activated number is the one that matters —
   ask and it can be measured.
5. **A species may run any of its abilities.** Offence is reported per ability,
   but the movepool sections assume the first. Where an ability decides a verdict
   (Cloyster's Skill Link, any Contrary or Huge Power holder), ask for a
   per-ability profile.
6. **The 0-2 HP rounding difference from Showdown's calculator** is known and
   documented; it never changes a tier.

**If a number you need is missing, ask for it** rather than estimating. Any
damage, speed or legality question can be answered against the real engine.