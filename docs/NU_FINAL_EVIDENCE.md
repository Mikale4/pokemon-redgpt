# RedGPT NU Final Audit — Verified Evidence Packet

**Generated from the live RedGPT project** by `tools/nu-final-evidence.js`.
Every stat, movepool value, damage figure and speed number comes from the running
engine, the packaged data, the validator or the real damage calculator.

**RedGPT has no usage, ladder, win-rate, tournament or popularity data**, so none
is quoted. Section T lists what genuinely cannot be determined.

---

## Your task

Make the **complete bidirectional NU tier audit**:

1. **Which current NU entries are too strong for NU and should move UP to RU?**
2. **Which current NU entries are too weak or outclassed and should move DOWN to PU?**

The bars are section E (the current RU roster, after the four promotions the
RU audit made) and section D (the complete PU roster).

**Most entries should stay put.** A high BST alone does not promote, and weak raw
stats alone do not demote — a demotion needs PU to already contain something that
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

## Context: the RU audit that preceded this one

**The RU audit promoted four entries and demoted none**, and those four have
already been applied — so the RU roster in section E is the **post-promotion**
bar, not the one the RU packet was written against:

| Promoted RU → UU | Kind | The mechanic that decided it |
| --- | --- | --- |
| Raichu-Mega-Y | forme | No Guard makes Sing a guaranteed sleep, on 160 SpA / 130 Speed |
| Pyroar-Mega | forme | Fire Mane is 1.5x the offensive stat on Fire moves, with restored 140 BP Overheat |
| Regieleki | species | 200 base Speed, and **Ring Target is legal on it** (not a Mega), which removes the Ground immunity that balances mono-Electric |
| Metagross | species | Light Metal is **+1 Speed on every entry** here, with full item freedom kept |

**RU → NU: none.** The downward review found nothing NU already did as well.

Two consequences for this audit:

- **RU is 122, not 126.** An NU entry moving up joins the roster in section E as
  it stands now.
- **Three of those four moved because of a RedGPT-specific mechanic the imported
  tier could not have known about** — two were `estimated` formes, and
  Metagross's tier predates this project's redesign of Light Metal. That is the
  shape worth looking for again in NU: an imported tier that is right about the
  Pokémon Smogon ranked and wrong about the one this engine ships.

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

**NU format rules, read live — and compared against RU and PU rather than assumed:**

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

## C. Full NU competitive profiles

All **67** current NU entries, engine-resolved.

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

## D. Full PU comparison profiles

All **110** current NU entries, same format — this is what a downward
move is measured against. **NU contains no `estimated` formes.**

**Absol** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Dark | BST 465 (65/130/60/75/60/75) | Abilities: Pressure / Super Luck / Justified
  Engine stats @252 (neutral/positive): Pressure: Atk 359/394, SpA 249/273, Spe 249/273 — Super Luck: Atk 359/394, SpA 249/273, Spe 249/273 — Justified: Atk 359/394, SpA 249/273, Spe 249/273
  Item: **free**
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

**Alcremie** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Fairy | BST 495 (65/60/75/110/121/64) | Abilities: Sweet Veil / Aroma Veil
  Engine stats @252 (neutral/positive): Sweet Veil: Atk 219/240, SpA 319/350, Spe 227/249 — Aroma Veil: Atk 219/240, SpA 319/350, Spe 227/249
  Item: **free**
  STAB: Fairy Misty Explosion 100S
  Physical coverage: Normal Last Resort 140P, Fighting Drain Punch 75P, Dark Fling 30P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Psychic 90S, Normal Tera Blast 80S, Fire Mystical Fire 75S
  Setup: Acid Armor, Calm Mind
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Drain Punch, Draining Kiss, Giga Drain
  Cleric: Aromatherapy
  Weather/terrain: Misty Terrain
  Utility: Encore, Light Screen, Pain Split, Protect, Safeguard, Substitute
  Notable: Encore, Substitute

**Ambipom** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 482 (75/100/66/60/66/115) | Abilities: Technician / Pickup / Skill Link
  Engine stats @252 (neutral/positive): Technician: Atk 299/328, SpA 219/240, Spe 329/361 — Pickup: Atk 299/328, SpA 219/240, Spe 329/361 — Skill Link: Atk 299/328, SpA 219/240, Spe 329/361
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ghost Shadow Ball 80S, Water Water Pulse 60S, Ground Mud Shot 55S
  Setup: Agility, Defense Curl, Hone Claws, Nasty Plot, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Upper Hand 65P Fighting (+3), Fake Out 40P Normal (+3)
  Pivot: Baton Pass, U-turn
  Status: Thunder Wave, Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute, Switcheroo, Taunt
  Notable: Knock Off, Switcheroo, Taunt, Substitute, Baton Pass, Focus Punch

**Archeops** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Rock/Flying | BST 567 (75/140/65/112/65/110) | Abilities: Defeatist
  Engine stats @252 (neutral/positive): Defeatist: Atk 379/416, SpA 323/355, Spe 319/350
  Item: **free**
  STAB: Rock Head Smash 150P · Flying Sky Attack 140 (charge)P
  Physical coverage: Dragon Outrage 120P, Normal Thrash 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Dark Crunch 80P
  Special coverage: Fighting Focus Blast 120S, Fire Heat Wave 100S, Dragon Dragon Pulse 90S, Ground Earth Power 90S, Normal Uproar 90S
  Setup: Agility, Hone Claws, Iron Defense, Rock Polish
  Reliable recovery: Rest, Roost
  Priority: Quick Attack 40P Normal (+1)
  Hazards: Stealth Rock
  Removal: Defog
  Pivot: U-turn
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Weather/terrain: Sandstorm
  Utility: Knock Off, Protect, Substitute, Switcheroo, Tailwind, Taunt
  Notable: Knock Off, Switcheroo, Taunt, Substitute, Tailwind

**Arctovish** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Water/Ice | BST 505 (90/90/100/80/90/55) | Abilities: Water Absorb / Ice Body / Slush Rush
  Engine stats @252 (neutral/positive): Water Absorb: Atk 279/306, SpA 259/284, Spe 209/229 — Ice Body: Atk 279/306, SpA 259/284, Spe 209/229 — Slush Rush: Atk 279/306, SpA 259/284, Spe 209/229
  Item: **free**
  STAB: Water Fishious Rend 170P · Ice Blizzard 120S
  Physical coverage: Rock Stone Edge 100P, Normal Body Slam 85P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Steel Iron Head 80P
  Special coverage: Rock Meteor Beam 120 (charge)S, Normal Round 60S
  Setup: Iron Defense
  Reliable recovery: Rest
  Weather/terrain: Hail, Rain Dance
  Utility: Aurora Veil, Protect, Substitute
  Notable: Substitute

**Aromatisse** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Fairy | BST 462 (101/72/72/99/89/29) | Abilities: Healer / Aroma Veil
  Engine stats @252 (neutral/positive): Healer: Atk 243/267, SpA 297/326, Spe 157/172 — Aroma Veil: Atk 243/267, SpA 297/326, Spe 157/172
  Item: **free**
  STAB: Fairy Misty Explosion 100S
  Physical coverage: Normal Return 102P, Fighting Drain Punch 75P, Steel Gyro Ball 39P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Grass Energy Ball 90S, Steel Flash Cannon 80S, Normal Hidden Power 60S
  Setup: Calm Mind, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Draining Kiss, Dream Eater
  Status: Toxic
  Cleric: Aromatherapy, Heal Bell, Wish
  Weather/terrain: Misty Terrain, Rain Dance, Sunny Day
  Utility: Disable, Encore, Light Screen, Magic Coat, Protect, Reflect, Substitute, Trick Room
  Notable: Encore, Substitute, Trick Room

**Audino** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Normal | BST 445 (103/60/86/60/86/50) | Abilities: Healer / Regenerator / Klutz
  Engine stats @252 (neutral/positive): Healer: Atk 219/240, SpA 219/240, Spe 199/218 — Regenerator: Atk 219/240, SpA 219/240, Spe 199/218 — Klutz: Atk 219/240, SpA 219/240, Spe 199/218
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Dark Throat Chop 80P, Psychic Zen Headbutt 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Water Surf 95S
  Setup: Amnesia, Calm Mind, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Draining Kiss, Dream Eater
  Status: Thunder Wave, Toxic, Yawn
  Cleric: Heal Bell, Life Dew, Wish
  Weather/terrain: Misty Terrain, Rain Dance, Sunny Day
  Utility: Encore, Gravity, Healing Wish, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Safeguard, Substitute, Trick Room
  Notable: Knock Off, Encore, Substitute, Trick Room, Focus Punch

**Audino-Mega** — forme, **PU**, source: override
  Normal/Fairy | BST 545 (103/60/126/80/126/50) | Abilities: Healer
  Engine stats @252 (neutral/positive): Healer: Atk 219/240, SpA 259/284, Spe 199/218
  Item: **Audinite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Audino (PU), pre-Mega abilities Healer / Regenerator / Klutz, pre-Mega Spe 218 (max +Spe)
  STAB: Normal Last Resort 140P · Fairy Dazzling Gleam 80S
  Physical coverage: Fighting Focus Punch 150P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Dark Fling 80P, Psychic Zen Headbutt 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Water Surf 95S
  Setup: Amnesia, Calm Mind, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Draining Kiss, Dream Eater
  Status: Thunder Wave, Toxic, Yawn
  Cleric: Heal Bell, Life Dew, Wish
  Weather/terrain: Misty Terrain, Rain Dance, Sunny Day
  Utility: Encore, Gravity, Healing Wish, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Safeguard, Substitute, Trick Room
  Notable: Knock Off, Encore, Substitute, Trick Room, Focus Punch

**Aurorus** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Rock/Ice | BST 521 (123/77/72/99/92/58) | Abilities: Refrigerate / Snow Warning
  Engine stats @252 (neutral/positive): Refrigerate: Atk 253/278, SpA 297/326, Spe 215/236 — Snow Warning: Atk 253/278, SpA 297/326, Spe 215/236
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Ice Blizzard 120S
  Physical coverage: Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Psychic Zen Headbutt 80P, Fighting Rock Smash 40P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Ground Earth Power 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S, Water Water Pulse 60S
  Setup: Barrier, Calm Mind, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Hazards: Stealth Rock
  Phazing: Dragon Tail, Roar
  Status: Thunder Wave, Toxic
  Weather/terrain: Hail, Rain Dance, Sandstorm
  Utility: Aurora Veil, Encore, Haze, Light Screen, Protect, Reflect, Safeguard, Substitute
  Notable: Encore, Substitute

**Avalugg-Hisui** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Ice/Rock | BST 514 (95/127/184/34/36/38) | Abilities: Strong Jaw / Ice Body / Sturdy
  Engine stats @252 (neutral/positive): Strong Jaw: Atk 353/388, SpA 167/183, Spe 175/192 — Ice Body: Atk 353/388, SpA 167/183, Spe 175/192 — Sturdy: Atk 353/388, SpA 167/183, Spe 175/192
  Item: **free**
  STAB: Ice Mountain Gale 100P · Rock Stone Edge 100P
  Physical coverage: Normal Skull Bash 130P, Steel Heavy Slam 120P, Fighting Superpower 120P, Ground Earthquake 100P, Dark Crunch 80P
  Special coverage: Water Hydro Pump 120S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Psychic Mirror Coat fixedS
  Setup: Barrier, Harden, Iron Defense, Rock Polish, Sharpen
  Reliable recovery: Recover, Rest
  Hazards: Stealth Rock
  Removal: Rapid Spin
  Phazing: Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Hail, Rain Dance, Sandstorm, Snowscape
  Utility: Aurora Veil, Protect, Safeguard, Substitute
  Notable: Substitute

**Bellossom** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Grass | BST 490 (75/80/95/90/100/50) | Abilities: Chlorophyll / Healer
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 259/284, SpA 279/306, Spe 199/218 — Healer: Atk 259/284, SpA 279/306, Spe 199/218
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Fairy Play Rough 90P, Fighting Drain Punch 75P, Ice Triple Axel 20x3P, Dark Fling 30P
  Special coverage: Fairy Moonblast 95S, Bug Pollen Puff 90S, Poison Sludge Bomb 90S, Normal Uproar 90S
  Setup: Growth, Quiver Dance, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Drain Punch, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1)
  Pivot: Baton Pass
  Status: Poison Powder, Sleep Powder, Stun Spore, Toxic
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Encore, Leech Seed, Protect, Reflect, Safeguard, Substitute
  Notable: Encore, Substitute, Baton Pass

**Bombirdier** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Flying/Dark | BST 485 (70/103/85/60/85/82) | Abilities: Big Pecks / Keen Eye / Rocky Payload
  Engine stats @252 (neutral/positive): Big Pecks: Atk 305/335, SpA 219/240, Spe 263/289 — Keen Eye: Atk 305/335, SpA 219/240, Spe 263/289 — Rocky Payload: Atk 305/335, SpA 219/240, Spe 263/289
  Item: **free**
  STAB: Flying Sky Attack 140 (charge)P · Dark Foul Play 95P
  Physical coverage: Rock Stone Edge 100P, Normal Take Down 90P, Ground Drill Run 80P, Bug U-turn 70P
  Special coverage: Fire Heat Wave 100S, Normal Hyper Voice 90S, Rock Power Gem 80S, Ice Icy Wind 55S
  Setup: Hone Claws, Nasty Plot
  Reliable recovery: Rest, Roost
  Priority: Sucker Punch 80P Dark (+1)
  Hazards: Stealth Rock
  Pivot: Parting Shot, U-turn
  Phazing: Whirlwind
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Knock Off, Memento, Protect, Substitute, Tailwind, Taunt
  Notable: Knock Off, Taunt, Substitute, Tailwind

**Brute Bonnet** — species, **PU**, source: override
  Grass/Dark | BST 570 (111/127/99/79/99/55) | Abilities: Protosynthesis
  Engine stats @252 (neutral/positive): Protosynthesis: Atk 353/388, SpA 257/282, Spe 209/229
  Item: **free**
  STAB: Grass Seed Bomb 80P · Dark Crunch 80P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Dragon Outrage 120P, Psychic Zen Headbutt 80P, Ground Stomping Tantrum 75P, Ghost Astonish 30P
  Special coverage: Ground Earth Power 90S, Bug Pollen Puff 90S, Normal Tera Blast 80S, Ghost Hex 65S, Poison Venoshock 65S
  Setup: Growth
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Giga Drain, Mega Drain
  Priority: Sucker Punch 80P Dark (+1)
  Status: Spore, Stun Spore
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Clear Smog, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Bruxish** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Water/Psychic | BST 475 (68/105/70/70/70/92) | Abilities: Dazzling / Strong Jaw / Wonder Skin
  Engine stats @252 (neutral/positive): Dazzling: Atk 309/339, SpA 239/262, Spe 283/311 — Strong Jaw: Atk 309/339, SpA 239/262, Spe 283/311 — Wonder Skin: Atk 309/339, SpA 239/262, Spe 283/311
  Item: **free**
  STAB: Water Hydro Pump 120S · Psychic Synchronoise 120S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Dark Crunch 80P, Ice Ice Fang 65P, Flying Aerial Ace 60P, Poison Poison Fang 50P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Bug Signal Beam 75S, Poison Venoshock 65S
  Setup: Agility, Bulk Up, Calm Mind, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Aqua Jet 40P Water (+1)
  Pivot: Flip Turn
  Status: Toxic
  Weather/terrain: Psychic Terrain, Rain Dance
  Utility: Disable, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Safeguard, Substitute, Taunt, Trick Room
  Notable: Taunt, Substitute, Trick Room

**Centiskorch** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Fire/Bug | BST 525 (100/115/65/90/90/65) | Abilities: Flash Fire / White Smoke / Flame Body
  Engine stats @252 (neutral/positive): Flash Fire: Atk 329/361, SpA 279/306, Spe 229/251 — White Smoke: Atk 329/361, SpA 279/306, Spe 229/251 — Flame Body: Atk 329/361, SpA 279/306, Spe 229/251
  Item: **free**
  STAB: Fire Overheat 140S · Bug Bug Buzz 90S
  Physical coverage: Grass Power Whip 120P, Dark Crunch 80P, Normal Slam 80P, Electric Thunder Fang 65P, Rock Rollout 30P
  Special coverage: Grass Solar Beam 120 (charge)S, Water Scald 80S, Ground Scorching Sands 70S, Poison Venoshock 65S, Normal Round 60S
  Setup: Coil, Defense Curl
  Reliable recovery: Rest
  Drain/Rest-only: Leech Life
  Status: Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute

**Claydol** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Ground/Psychic | BST 500 (60/70/105/70/120/75) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 239/262, SpA 239/262, Spe 249/273
  Item: **free**
  STAB: Ground Earthquake 100P · Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Rock Stone Edge 100P, Fighting Body Press 80P, Steel Gyro Ball 20P
  Special coverage: Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Rock Ancient Power 60S
  Setup: Calm Mind, Cosmic Power, Harden, Iron Defense, Nasty Plot, Rock Polish
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Hazards: Stealth Rock
  Removal: Rapid Spin
  Pivot: Teleport
  Status: Toxic
  Weather/terrain: Psychic Terrain, Rain Dance, Sandstorm, Sunny Day
  Utility: Gravity, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

**Clefairy** — species, **PU**, source: override
  Fairy | BST 323 (70/45/48/60/65/35) | Abilities: Cute Charm / Magic Guard / Friend Guard
  Engine stats @252 (neutral/positive): Cute Charm: Atk 189/207, SpA 219/240, Spe 169/185 — Magic Guard: Atk 189/207, SpA 219/240, Spe 169/185 — Friend Guard: Atk 189/207, SpA 219/240, Spe 169/185
  Item: **free**
  STAB: Fairy Misty Explosion 100S
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S
  Setup: Amnesia, Calm Mind, Cosmic Power, Defense Curl, Work Up
  Reliable recovery: Rest, Soft-Boiled
  Drain/Rest-only: Drain Punch, Draining Kiss, Dream Eater
  Hazards: Stealth Rock
  Pivot: Baton Pass, Teleport
  Status: Sing, Thunder Wave, Toxic
  Cleric: Aromatherapy, Heal Bell, Life Dew, Wish
  Weather/terrain: Misty Terrain, Rain Dance, Sunny Day
  Utility: Detect, Encore, Gravity, Healing Wish, Knock Off, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick
  Notable: Knock Off, Trick, Encore, Substitute, Baton Pass, Focus Punch

**Coalossal** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Rock/Fire | BST 510 (110/80/120/80/90/30) | Abilities: Steam Engine / Flame Body / Flash Fire
  Engine stats @252 (neutral/positive): Steam Engine: Atk 259/284, SpA 259/284, Spe 159/174 — Flame Body: Atk 259/284, SpA 259/284, Spe 159/174 — Flash Fire: Atk 259/284, SpA 259/284, Spe 159/174
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Fire Overheat 140S
  Physical coverage: Normal Explosion 250P, Steel Heavy Slam 120P, Ground Earthquake 100P, Fighting Body Press 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Water Scald 80S, Normal Tera Blast 80S
  Setup: Iron Defense, Rock Polish
  Reliable recovery: Rest
  Hazards: Spikes, Stealth Rock
  Removal: Rapid Spin
  Status: Will-O-Wisp
  Trapping: Block
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Protect, Reflect, Substitute
  Notable: Substitute

**Combusken** — species, **PU**, source: override
  Fire/Fighting | BST 405 (60/85/60/85/60/55) | Abilities: Blaze / Speed Boost
  Engine stats @252 (neutral/positive): Blaze: Atk 269/295, SpA 269/295, Spe 209/229 — Speed Boost: Atk 269/295, SpA 269/295, Spe 209/229
  Item: **free**
  STAB: Fire Overheat 140S · Fighting Focus Punch 150P
  Physical coverage: Normal Last Resort 140P, Dragon Dual Chop 50x2P, Ground Dig 100 (charge)P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P, Rock Rock Slide 75P
  Special coverage: Normal Uproar 90S, Ground Mud-Slap 20S
  Setup: Agility, Bulk Up, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Feint 50P Normal (+2), Quick Attack 40P Normal (+1), Vacuum Wave 40S Fighting (+1)
  Removal: Defog
  Pivot: Baton Pass
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Detect, Protect, Substitute
  Notable: Substitute, Baton Pass, Focus Punch

**Corsola-Galar** — species, **PU**, source: override
  Ghost | BST 410 (60/55/100/65/100/30) | Abilities: Weak Armor / Cursed Body
  Engine stats @252 (neutral/positive): Weak Armor: Atk 209/229, SpA 229/251, Spe 159/174 — Cursed Body: Atk 209/229, SpA 229/251, Spe 159/174
  Item: **free**
  STAB: Ghost Shadow Ball 80S
  Physical coverage: Normal Explosion 250P, Rock Head Smash 150P, Ground Earthquake 100P, Water Liquidation 85P, Dark Sucker Punch 80P, Ice Icicle Spear 25x2-5P
  Special coverage: Ice Blizzard 120S, Water Hydro Pump 120S, Rock Meteor Beam 120 (charge)S, Ground Earth Power 90S, Psychic Psychic 90S, Grass Giga Drain 75S
  Setup: Amnesia, Barrier, Calm Mind, Defense Curl, Harden, Iron Defense, Rock Polish
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Giga Drain
  Priority: Sucker Punch 80P Dark (+1)
  Hazards: Stealth Rock
  Status: Toxic, Will-O-Wisp
  Cleric: Life Dew
  Weather/terrain: Hail, Rain Dance, Sandstorm, Sunny Day
  Utility: Destiny Bond, Disable, Haze, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute
  Notable: Substitute

**Cramorant** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Flying/Water | BST 475 (70/85/55/85/95/85) | Abilities: Gulp Missile
  Engine stats @252 (neutral/positive): Gulp Missile: Atk 269/295, SpA 269/295, Spe 269/295
  Item: **free**
  STAB: Flying Brave Bird 120P · Water Hydro Pump 120S
  Physical coverage: Fighting Superpower 120P, Normal Thrash 120P, Dark Throat Chop 80P, Steel Steel Wing 70P, Bug Pounce 50P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Normal Uproar 90S
  Setup: Agility, Amnesia
  Reliable recovery: Rest, Roost
  Removal: Defog
  Weather/terrain: Rain Dance
  Utility: Protect, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Crocalor** — species, **PU**, source: override
  Fire | BST 411 (81/55/78/90/58/49) | Abilities: Blaze / Unaware
  Engine stats @252 (neutral/positive): Blaze: Atk 209/229, SpA 279/306, Spe 197/216 — Unaware: Atk 209/229, SpA 279/306, Spe 197/216
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Dragon Outrage 120P, Ground Dig 100 (charge)P, Normal Take Down 90P, Dark Crunch 80P, Grass Seed Bomb 80P, Psychic Zen Headbutt 80P
  Special coverage: Poison Belch 120S, Normal Hyper Voice 90S, Dark Snarl 55S, Fairy Disarming Voice 40S, Ground Mud-Slap 20S
  Reliable recovery: Rest, Slack Off
  Phazing: Roar
  Status: Will-O-Wisp, Yawn
  Weather/terrain: Sunny Day
  Utility: Encore, Protect, Substitute
  Notable: Encore, Substitute

**Delphox** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Fire/Psychic | BST 534 (75/69/72/114/100/104) | Abilities: Blaze / Magician
  Engine stats @252 (neutral/positive): Blaze: Atk 237/260, SpA 327/359, Spe 307/337 — Magician: Atk 237/260, SpA 327/359, Spe 307/337
  Item: **free**
  STAB: Fire Overheat 140S · Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Dark Foul Play 95P, Electric Thunder Punch 75P, Fighting Low Kick 60P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Normal Hyper Voice 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
  Setup: Agility, Calm Mind, Nasty Plot, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Status: Hypnosis, Toxic, Will-O-Wisp
  Cleric: Wish
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Encore, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Switcheroo, Trick, Trick Room
  Notable: Trick, Switcheroo, Encore, Substitute, Trick Room

**Dipplin** — species, **PU**, source: override
  Grass/Dragon | BST 485 (80/80/110/95/80/40) | Abilities: Supersweet Syrup / Gluttony / Sticky Hold
  Engine stats @252 (neutral/positive): Supersweet Syrup: Atk 259/284, SpA 289/317, Spe 179/196 — Gluttony: Atk 259/284, SpA 289/317, Spe 179/196 — Sticky Hold: Atk 259/284, SpA 289/317, Spe 179/196
  Item: **free**
  STAB: Grass Leaf Storm 140S · Dragon Draco Meteor 140S
  Physical coverage: Normal Double Hit 50x2P, Dark Sucker Punch 80P, Bug Bug Bite 60P, Steel Gyro Ball 32P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Bug Pollen Puff 90S, Normal Tera Blast 80S
  Setup: Defense Curl, Growth, Withdraw
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Giga Drain
  Priority: Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1)
  Phazing: Dragon Tail
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Protect, Reflect, Substitute
  Notable: Substitute

**Druddigon** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Dragon | BST 485 (77/120/90/60/90/48) | Abilities: Rough Skin / Sheer Force / Mold Breaker
  Engine stats @252 (neutral/positive): Rough Skin: Atk 339/372, SpA 219/240, Spe 195/214 — Sheer Force: Atk 339/372, SpA 219/240, Spe 195/214 — Mold Breaker: Atk 339/372, SpA 219/240, Spe 195/214
  Item: **free**
  STAB: Dragon Outrage 120P
  Physical coverage: Poison Gunk Shot 120P, Fighting Superpower 120P, Normal Return 102P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P
  Special coverage: Fighting Focus Blast 120S, Fire Heat Wave 100S, Water Surf 95S, Poison Sludge Bomb 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S
  Setup: Hone Claws
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1)
  Hazards: Stealth Rock
  Phazing: Dragon Tail, Roar
  Status: Glare, Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Dugtrio** — species, **PU**, source: override
  Ground | BST 425 (35/100/50/50/70/120) | Abilities: Sand Veil / Arena Trap / Sand Force
  Engine stats @252 (neutral/positive): Sand Veil: Atk 299/328, SpA 199/218, Spe 339/372 — Arena Trap: Atk 299/328, SpA 199/218, Spe 339/372 — Sand Force: Atk 299/328, SpA 199/218, Spe 339/372
  Item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Rock Stone Edge 100P, Dark Foul Play 95P, Ghost Shadow Claw 70P, Flying Aerial Ace 60P, Fighting Rock Smash 40P
  Special coverage: Poison Sludge Wave 95S, Normal Uproar 90S, Rock Ancient Power 60S, Fighting Final Gambit fixedS
  Setup: Agility, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1)
  Hazards: Stealth Rock
  Status: Toxic
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Memento, Protect, Substitute
  Notable: Substitute

**Duosion** — species, **PU**, source: override
  Psychic | BST 370 (65/40/50/125/60/30) | Abilities: Overcoat / Magic Guard / Regenerator
  Engine stats @252 (neutral/positive): Overcoat: Atk 179/196, SpA 349/383, Spe 159/174 — Magic Guard: Atk 179/196, SpA 349/383, Spe 159/174 — Regenerator: Atk 179/196, SpA 349/383, Spe 159/174
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Steel Steel Roller 130P, Rock Rock Slide 75P, Ghost Astonish 30P
  Special coverage: Electric Thunder 120S, Grass Energy Ball 90S, Steel Flash Cannon 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S
  Setup: Acid Armor, Calm Mind, Iron Defense
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Dream Eater
  Status: Thunder Wave, Toxic
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Encore, Gravity, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Encore, Substitute, Trick Room

**Dusclops** — species, **PU**, source: override
  Ghost | BST 455 (40/70/130/60/130/25) | Abilities: Pressure / Frisk
  Engine stats @252 (neutral/positive): Pressure: Atk 239/262, SpA 219/240, Spe 149/163 — Frisk: Atk 239/262, SpA 219/240, Spe 149/163
  Item: **free**
  STAB: Ghost Poltergeist 110P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Earthquake 100P, Bug Leech Life 80P, Dark Sucker Punch 80P, Fire Fire Punch 75P
  Special coverage: Ice Blizzard 120S, Psychic Future Sight 120S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Charge Beam 50S, Bug Infestation 20S
  Setup: Calm Mind
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater, Leech Life
  Priority: Sucker Punch 80P Dark (+1), Shadow Sneak 40P Ghost (+1)
  Status: Toxic, Will-O-Wisp
  Trapping: Mean Look
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Destiny Bond, Disable, Gravity, Haze, Memento, Pain Split, Protect, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room, Focus Punch

**Eldegoss** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Grass | BST 460 (60/50/90/80/120/60) | Abilities: Cotton Down / Regenerator / Effect Spore
  Engine stats @252 (neutral/positive): Cotton Down: Atk 199/218, SpA 259/284, Spe 219/240 — Regenerator: Atk 199/218, SpA 259/284, Spe 219/240 — Effect Spore: Atk 199/218, SpA 259/284, Spe 219/240
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Facade 70P
  Special coverage: Normal Hyper Voice 90S, Bug Pollen Puff 90S
  Setup: Cotton Guard, Growth
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain
  Priority: Grassy Glide 70P Grass (+1)
  Removal: Rapid Spin
  Status: Poison Powder, Sing, Sleep Powder, Stun Spore
  Cleric: Aromatherapy
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Leech Seed, Light Screen, Protect, Substitute
  Notable: Substitute

**Electrode-Hisui** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Electric/Grass | BST 490 (60/50/70/80/80/150) | Abilities: Soundproof / Static / Aftermath
  Engine stats @252 (neutral/positive): Soundproof: Atk 199/218, SpA 259/284, Spe 399/438 — Static: Atk 199/218, SpA 259/284, Spe 399/438 — Aftermath: Atk 199/218, SpA 259/284, Spe 399/438
  Item: **free**
  STAB: Electric Thunder 120S · Grass Chloroblast 150S
  Physical coverage: Normal Explosion 250P, Dark Foul Play 95P, Rock Rollout 30P, Steel Gyro Ball 11P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S, Psychic Mirror Coat fixedS
  Setup: Agility, Charge
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain
  Priority: Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1)
  Pivot: Teleport, Volt Switch
  Status: Stun Spore, Thunder Wave, Toxic
  Weather/terrain: Electric Terrain, Grassy Terrain, Rain Dance
  Utility: Leech Seed, Light Screen, Magic Coat, Protect, Reflect, Substitute, Taunt
  Notable: Taunt, Substitute

**Emboar** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Fire/Fighting | BST 528 (110/123/65/100/65/65) | Abilities: Blaze / Reckless
  Engine stats @252 (neutral/positive): Blaze: Atk 345/379, SpA 299/328, Spe 229/251 — Reckless: Atk 345/379, SpA 299/328, Spe 229/251
  Item: **free**
  STAB: Fire Overheat 140S · Fighting Focus Punch 150P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Hard Press 100P, Electric Wild Charge 90P, Poison Poison Jab 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Water Scald 80S, Normal Tera Blast 80S, Poison Smog 30S, Ground Mud-Slap 20S
  Setup: Bulk Up, Defense Curl, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Sucker Punch 80P Dark (+1)
  Phazing: Roar
  Status: Toxic, Will-O-Wisp, Yawn
  Trapping: Block
  Weather/terrain: Sunny Day
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Focus Punch

**Floatzel** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Water | BST 495 (85/105/55/85/50/115) | Abilities: Swift Swim / Water Veil
  Engine stats @252 (neutral/positive): Swift Swim: Atk 309/339, SpA 269/295, Spe 329/361 — Water Veil: Atk 309/339, SpA 269/295, Spe 329/361
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Normal Tera Blast 80S, Dark Snarl 55S, Ground Mud-Slap 20S
  Setup: Agility, Bulk Up
  Reliable recovery: Rest
  Priority: Aqua Jet 40P Water (+1), Quick Attack 40P Normal (+1)
  Pivot: Baton Pass, Flip Turn
  Phazing: Roar
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Protect, Substitute, Switcheroo, Taunt
  Notable: Switcheroo, Taunt, Substitute, Baton Pass, Focus Punch

**Floette-Eternal** — species, **PU**, source: override
  Fairy | BST 551 (74/65/67/125/128/92) | Abilities: Flower Veil / Symbiosis
  Engine stats @252 (neutral/positive): Flower Veil: Atk 229/251, SpA 349/383, Spe 283/311 — Symbiosis: Atk 229/251, SpA 349/383, Spe 283/311
  Item: **free**
  STAB: Fairy Light of Ruin 140S
  Physical coverage: Normal Return 102P, Grass Petal Blizzard 90P
  Special coverage: Grass Petal Dance 120S, Bug Pollen Puff 90S, Psychic Psychic 90S, Normal Tera Blast 80S, Water Chilling Water 50S
  Setup: Calm Mind
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss, Giga Drain
  Pivot: Baton Pass
  Status: Toxic
  Cleric: Aromatherapy, Heal Bell, Wish
  Weather/terrain: Grassy Terrain, Misty Terrain, Rain Dance, Sunny Day
  Utility: Light Screen, Magic Coat, Protect, Safeguard, Substitute, Trick
  Notable: Trick, Substitute, Baton Pass

**Florges** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Fairy | BST 552 (78/65/68/112/154/75) | Abilities: Flower Veil / Symbiosis
  Engine stats @252 (neutral/positive): Flower Veil: Atk 229/251, SpA 323/355, Spe 249/273 — Symbiosis: Atk 229/251, SpA 323/355, Spe 249/273
  Item: **free**
  STAB: Fairy Misty Explosion 100S
  Physical coverage: Normal Return 102P, Grass Petal Blizzard 90P
  Special coverage: Grass Petal Dance 120S, Bug Pollen Puff 90S, Psychic Psychic 90S, Normal Tera Blast 80S, Water Chilling Water 50S
  Setup: Calm Mind
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss, Giga Drain
  Removal: Defog
  Pivot: Baton Pass
  Status: Toxic
  Cleric: Aromatherapy, Heal Bell, Wish
  Weather/terrain: Grassy Terrain, Misty Terrain, Rain Dance, Sunny Day
  Utility: Light Screen, Magic Coat, Protect, Safeguard, Substitute, Trick
  Notable: Trick, Substitute, Baton Pass

**Fraxure** — species, **PU**, source: override
  Dragon | BST 410 (66/117/70/40/50/67) | Abilities: Rivalry / Mold Breaker / Unnerve
  Engine stats @252 (neutral/positive): Rivalry: Atk 333/366, SpA 179/196, Spe 233/256 — Mold Breaker: Atk 333/366, SpA 179/196, Spe 233/256 — Unnerve: Atk 333/366, SpA 179/196, Spe 233/256
  Item: **free**
  STAB: Dragon Outrage 120P
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Water Aqua Tail 90P, Bug First Impression 90P
  Special coverage: Water Surf 95S, Normal Tera Blast 80S, Fire Incinerate 60S, Electric Shock Wave 60S, Dark Snarl 55S
  Setup: Dragon Dance, Harden, Hone Claws, Swords Dance
  Reliable recovery: Rest
  Priority: First Impression 90P Bug (+2)
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Frosmoth** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Ice/Bug | BST 475 (70/65/60/125/90/65) | Abilities: Shield Dust / Ice Scales
  Engine stats @252 (neutral/positive): Shield Dust: Atk 229/251, SpA 349/383, Spe 229/251 — Ice Scales: Atk 229/251, SpA 349/383, Spe 229/251
  Item: **free**
  STAB: Ice Blizzard 120S · Bug Bug Buzz 90S
  Physical coverage: Flying Acrobatics 110P, Fairy Play Rough 90P, Normal Take Down 90P
  Special coverage: Flying Hurricane 120S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Psychic Mirror Coat fixedS
  Setup: Calm Mind, Quiver Dance
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain, Leech Life
  Removal: Defog
  Pivot: U-turn
  Status: Stun Spore
  Weather/terrain: Hail, Snowscape
  Utility: Aurora Veil, Light Screen, Protect, Reflect, Safeguard, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Galvantula** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Bug/Electric | BST 472 (70/77/60/97/60/108) | Abilities: Compound Eyes / Unnerve / Swarm
  Engine stats @252 (neutral/positive): Compound Eyes: Atk 253/278, SpA 293/322, Spe 315/346 — Unnerve: Atk 253/278, SpA 293/322, Spe 315/346 — Swarm: Atk 253/278, SpA 293/322, Spe 315/346
  Item: **free**
  STAB: Bug Bug Buzz 90S · Electric Thunder 120S
  Physical coverage: Normal Return 102P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P, Dark Sucker Punch 80P
  Special coverage: Grass Energy Ball 90S, Normal Tera Blast 80S
  Setup: Agility, Charge
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Giga Drain, Leech Life
  Priority: Sucker Punch 80P Dark (+1)
  Hazards: Sticky Web
  Pivot: Volt Switch
  Status: Thunder Wave, Toxic
  Trapping: Spider Web
  Weather/terrain: Rain Dance
  Utility: Disable, Light Screen, Protect, Substitute
  Notable: Substitute

**Garbodor** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Poison | BST 474 (80/95/82/60/82/75) | Abilities: Stench / Weak Armor / Aftermath
  Engine stats @252 (neutral/positive): Stench: Atk 289/317, SpA 219/240, Spe 249/273 — Weak Armor: Atk 289/317, SpA 219/240, Spe 249/273 — Aftermath: Atk 289/317, SpA 219/240, Spe 249/273
  Item: **free**
  STAB: Poison Belch 120S
  Physical coverage: Normal Explosion 250P, Fighting Body Press 80P, Grass Seed Bomb 80P, Rock Rock Blast 25x2-5P, Ground Stomping Tantrum 75P, Dark Thief 60P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Electric Thunderbolt 95S, Psychic Psychic 90S, Dark Dark Pulse 80S, Normal Hidden Power 60S
  Setup: Amnesia, Autotomize, Rock Polish
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Giga Drain
  Hazards: Spikes, Toxic Spikes
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Clear Smog, Haze, Pain Split, Protect, Substitute
  Notable: Substitute

**Gigalith** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Rock | BST 515 (85/135/130/60/80/25) | Abilities: Sturdy / Sand Stream / Sand Force
  Engine stats @252 (neutral/positive): Sturdy: Atk 369/405, SpA 219/240, Spe 149/163 — Sand Stream: Atk 369/405, SpA 219/240, Spe 149/163 — Sand Force: Atk 369/405, SpA 219/240, Spe 149/163
  Item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Normal Explosion 250P, Steel Heavy Slam 120P, Fighting Superpower 120P, Ground Earthquake 100P, Dark Throat Chop 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Steel Flash Cannon 80S, Normal Hidden Power 60S
  Setup: Autotomize, Harden, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Status: Toxic
  Trapping: Block
  Weather/terrain: Sandstorm
  Utility: Gravity, Protect, Substitute
  Notable: Substitute

**Glastrier** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Ice | BST 580 (100/145/130/65/110/30) | Abilities: Chilling Neigh
  Engine stats @252 (neutral/positive): Chilling Neigh: Atk 389/427, SpA 229/251, Spe 159/174
  Item: **free**
  STAB: Ice Icicle Crash 85P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Steel Heavy Slam 120P, Bug Megahorn 120P, Dragon Outrage 120P, Ground High Horsepower 95P
  Special coverage: Normal Uproar 90S, Ground Mud Shot 55S, Dark Snarl 55S
  Setup: Iron Defense, Swords Dance
  Reliable recovery: Rest
  Phazing: Roar
  Weather/terrain: Hail, Snowscape
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Golbat** — species, **PU**, source: override
  Poison/Flying | BST 455 (75/80/70/65/75/90) | Abilities: Inner Focus / Infiltrator
  Engine stats @252 (neutral/positive): Inner Focus: Atk 259/284, SpA 229/251, Spe 279/306 — Infiltrator: Atk 259/284, SpA 229/251, Spe 279/306
  Item: **free**
  STAB: Poison Sludge Bomb 90S · Flying Brave Bird 120P
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Bug Leech Life 80P, Psychic Zen Headbutt 80P, Steel Steel Wing 70P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Normal Uproar 90S, Ghost Shadow Ball 80S, Grass Giga Drain 75S, Dragon Twister 40S
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

**Golurk** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Ground/Ghost | BST 483 (89/124/80/55/80/55) | Abilities: Iron Fist / Klutz / No Guard
  Engine stats @252 (neutral/positive): Iron Fist: Atk 347/381, SpA 209/229, Spe 209/229 — Klutz: Atk 347/381, SpA 209/229, Spe 209/229 — No Guard: Atk 347/381, SpA 209/229, Spe 209/229
  Item: **free**
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

**Gorebyss** — species, **PU**, source: imported (natdex-RU refined by gen7)
  Water | BST 485 (55/84/105/114/75/52) | Abilities: Swift Swim / Hydration
  Engine stats @252 (neutral/positive): Swift Swim: Atk 267/293, SpA 327/359, Spe 203/223 — Hydration: Atk 267/293, SpA 327/359, Spe 203/223
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Double-Edge 120P, Flying Bounce 85 (charge)P
  Special coverage: Ice Blizzard 120S, Psychic Psychic 90S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Normal Hidden Power 60S, Fairy Draining Kiss 50S
  Setup: Agility, Amnesia, Barrier, Coil, Iron Defense, Shell Smash
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Pivot: Baton Pass
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Protect, Safeguard, Substitute
  Notable: Substitute, Baton Pass

**Gothorita** — species, **PU**, source: override
  Psychic | BST 390 (60/45/70/75/85/55) | Abilities: Frisk / Competitive / Shadow Tag
  Engine stats @252 (neutral/positive): Frisk: Atk 189/207, SpA 249/273, Spe 209/229 — Competitive: Atk 189/207, SpA 249/273, Spe 209/229 — Shadow Tag: Atk 189/207, SpA 249/273, Spe 209/229
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Dark Foul Play 95P, Rock Rock Slide 75P
  Special coverage: Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
  Setup: Calm Mind, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Fake Out 40P Normal (+3)
  Status: Hypnosis, Thunder Wave, Toxic
  Cleric: Heal Bell
  Trapping: Mean Look
  Weather/terrain: Psychic Terrain, Rain Dance
  Utility: Gravity, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

**Grimmsnarl** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Dark/Fairy | BST 510 (95/120/65/95/75/60) | Abilities: Prankster / Frisk / Pickpocket
  Engine stats @252 (neutral/positive): Prankster: Atk 339/372, SpA 289/317, Spe 219/240 — Frisk: Atk 339/372, SpA 289/317, Spe 219/240 — Pickpocket: Atk 339/372, SpA 289/317, Spe 219/240
  Item: **free**
  STAB: Dark Foul Play 95P · Fairy Play Rough 90P
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Grass Power Whip 120P, Bug Leech Life 80P, Fire Fire Punch 75P, Ice Ice Punch 75P
  Special coverage: Fighting Focus Blast 120S, Normal Uproar 90S, Fire Burning Jealousy 70S, Water Chilling Water 50S
  Setup: Bulk Up, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Draining Kiss, Leech Life
  Priority: Sucker Punch 80P Dark (+1), Fake Out 40P Normal (+3)
  Pivot: Parting Shot
  Status: Thunder Wave
  Weather/terrain: Misty Terrain
  Utility: Light Screen, Protect, Reflect, Substitute, Taunt, Trick
  Notable: Trick, Taunt, Substitute, Focus Punch

**Gurdurr** — species, **PU**, source: override
  Fighting | BST 405 (85/105/85/40/50/40) | Abilities: Guts / Sheer Force / Iron Fist
  Engine stats @252 (neutral/positive): Guts: Atk 309/339, SpA 179/196, Spe 179/196 — Sheer Force: Atk 309/339, SpA 179/196, Spe 179/196 — Iron Fist: Atk 309/339, SpA 179/196, Spe 179/196
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Fire Fire Punch 75P, Ice Ice Punch 75P
  Special coverage: Normal Tera Blast 80S, Grass Grass Knot 60S
  Setup: Bulk Up, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Mach Punch 40P Fighting (+1)
  Removal: Defog
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Focus Punch

**Hitmonlee** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Fighting | BST 455 (50/120/53/35/110/87) | Abilities: Limber / Reckless / Unburden
  Engine stats @252 (neutral/positive): Limber: Atk 339/372, SpA 169/185, Spe 273/300 — Reckless: Atk 339/372, SpA 169/185, Spe 273/300 — Unburden: Atk 339/372, SpA 169/185, Spe 273/300
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Skull Bash 130P, Ground Earthquake 100P, Rock Stone Edge 100P, Fire Blaze Kick 85P, Flying Bounce 85 (charge)P, Bug Lunge 80P
  Special coverage: Normal Uproar 90S, Ground Mud-Slap 20S
  Setup: Bulk Up, Meditate, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1), Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Bullet Punch 40P Steel (+1)
  Removal: Rapid Spin
  Pivot: Baton Pass
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass, Focus Punch

**Hoopa** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Psychic/Ghost | BST 600 (80/110/60/150/130/70) | Abilities: Magician
  Engine stats @252 (neutral/positive): Magician: Atk 319/350, SpA 399/438, Spe 239/262
  Item: **free**
  STAB: Psychic Future Sight 120S · Ghost Phantom Force 90 (charge)P
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Poison Gunk Shot 120P, Dragon Dual Chop 50x2P, Dark Hyperspace Fury 100P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Bug Signal Beam 75S
  Setup: Calm Mind, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Dream Eater
  Status: Thunder Wave, Toxic
  Trapping: Block
  Weather/terrain: Psychic Terrain, Rain Dance, Sandstorm, Sunny Day
  Utility: Destiny Bond, Gravity, Knock Off, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Taunt, Substitute, Trick Room, Focus Punch

**Jellicent** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Water/Ghost | BST 480 (100/60/70/85/105/60) | Abilities: Water Absorb / Cursed Body / Damp
  Engine stats @252 (neutral/positive): Water Absorb: Atk 219/240, SpA 269/295, Spe 219/240 — Cursed Body: Atk 219/240, SpA 269/295, Spe 219/240 — Damp: Atk 219/240, SpA 269/295, Spe 219/240
  Item: **free**
  STAB: Water Water Spout 150S · Ghost Poltergeist 110P
  Physical coverage: Normal Return 102P, Poison Poison Sting 15P
  Special coverage: Ice Blizzard 120S, Normal Wring Out 120S, Psychic Dream Eater 100S, Poison Sludge Wave 95S, Grass Energy Ball 90S, Dark Dark Pulse 80S
  Setup: Acid Armor
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Absorb, Dream Eater, Giga Drain
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Hail, Rain Dance
  Utility: Destiny Bond, Magic Coat, Pain Split, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

**Kadabra** — species, **PU**, source: override
  Psychic | BST 400 (40/35/30/120/70/105) | Abilities: Synchronize / Inner Focus / Magic Guard
  Engine stats @252 (neutral/positive): Synchronize: Atk 169/185, SpA 339/372, Spe 309/339 — Inner Focus: Atk 169/185, SpA 339/372, Spe 309/339 — Magic Guard: Atk 169/185, SpA 339/372, Spe 309/339
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Fire Fire Punch 75P
  Special coverage: Electric Zap Cannon 120S, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Normal Tri Attack 80S, Bug Signal Beam 75S
  Setup: Barrier, Calm Mind
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Drain Punch, Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Disable, Encore, Gravity, Knock Off, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room, Focus Punch

**Kingdra** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Water/Dragon | BST 540 (75/95/95/95/95/85) | Abilities: Swift Swim / Sniper / Damp
  Engine stats @252 (neutral/positive): Swift Swim: Atk 289/317, SpA 289/317, Spe 269/295 — Sniper: Atk 289/317, SpA 289/317, Spe 269/295 — Damp: Atk 289/317, SpA 289/317, Spe 269/295
  Item: **free**
  STAB: Water Hydro Pump 120S · Dragon Draco Meteor 140S
  Physical coverage: Normal Skull Bash 130P, Flying Bounce 85 (charge)P, Steel Iron Head 80P
  Special coverage: Ice Blizzard 120S, Flying Hurricane 120S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Poison Clear Smog 50S
  Setup: Agility, Dragon Dance
  Reliable recovery: Rest
  Pivot: Flip Turn
  Status: Toxic, Yawn
  Weather/terrain: Hail, Rain Dance, Snowscape
  Utility: Clear Smog, Disable, Protect, Substitute
  Notable: Substitute

**Lairon** — species, **PU**, source: override
  Steel/Rock | BST 430 (60/90/140/50/50/40) | Abilities: Sturdy / Rock Head / Heavy Metal
  Engine stats @252 (neutral/positive): Sturdy: Atk 279/306, SpA 199/218, Spe 179/196 — Rock Head: Atk 279/306, SpA 199/218, Spe 179/196 — Heavy Metal: Atk 279/306, SpA 199/218, Spe 179/196
  Item: **free**
  STAB: Steel Steel Roller 130P · Rock Head Smash 150P
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Dragon Dragon Rush 100P, Ground Earthquake 100P, Ghost Shadow Claw 70P, Flying Aerial Ace 60P
  Special coverage: Ground Earth Power 90S, Normal Uproar 90S, Electric Shock Wave 60S, Water Water Pulse 60S
  Setup: Autotomize, Defense Curl, Harden, Hone Claws, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Roar
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute

**Lampent** — species, **PU**, source: override
  Ghost/Fire | BST 370 (60/40/60/95/60/55) | Abilities: Flash Fire / Flame Body / Infiltrator / Shadow Tag
  Engine stats @252 (neutral/positive): Flash Fire: Atk 179/196, SpA 289/317, Spe 209/229 — Flame Body: Atk 179/196, SpA 289/317, Spe 209/229 — Infiltrator: Atk 179/196, SpA 289/317, Spe 209/229 — Shadow Tag: Atk 179/196, SpA 289/317, Spe 209/229
  Item: **free**
  STAB: Ghost Shadow Ball 80S · Fire Overheat 140S
  Physical coverage: Normal Return 102P, Dark Lash Out 75P, Bug Skitter Smack 70P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S
  Setup: Acid Armor, Calm Mind
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Clear Smog, Haze, Memento, Pain Split, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

**Lanturn** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Water/Electric | BST 460 (125/58/58/76/76/67) | Abilities: Volt Absorb / Illuminate / Water Absorb
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 215/236, SpA 251/276, Spe 233/256 — Illuminate: Atk 215/236, SpA 251/276, Spe 233/256 — Water Absorb: Atk 215/236, SpA 251/276, Spe 233/256
  Item: **free**
  STAB: Water Hydro Pump 120S · Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Flying Bounce 85 (charge)P, Dark Sucker Punch 80P
  Special coverage: Ice Blizzard 120S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Psychic Psybeam 65S
  Setup: Agility, Amnesia, Charge
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1)
  Pivot: Flip Turn, Volt Switch
  Status: Thunder Wave, Toxic
  Cleric: Heal Bell
  Weather/terrain: Electric Terrain, Hail, Rain Dance
  Utility: Protect, Substitute
  Notable: Substitute

**Machoke** — species, **PU**, source: override
  Fighting | BST 405 (80/100/70/50/60/45) | Abilities: Guts / No Guard / Steadfast
  Engine stats @252 (neutral/positive): Guts: Atk 299/328, SpA 199/218, Spe 189/207 — No Guard: Atk 299/328, SpA 199/218, Spe 189/207 — Steadfast: Atk 299/328, SpA 199/218, Spe 189/207
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Skull Bash 130P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Poison Poison Jab 80P, Fire Fire Punch 75P, Ice Ice Punch 75P
  Special coverage: Fire Fire Blast 120S, Normal Hidden Power 60S, Ground Mud-Slap 20S
  Setup: Bulk Up, Meditate, Work Up
  Reliable recovery: Rest
  Priority: Bullet Punch 40P Steel (+1), Vacuum Wave 40S Fighting (+1)
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Encore, Knock Off, Light Screen, Protect, Substitute
  Notable: Knock Off, Encore, Substitute, Focus Punch

**Medicham** — species, **PU**, source: override
  Fighting/Psychic | BST 410 (60/60/75/60/75/80) | Abilities: Pure Power / Telepathy
  Engine stats @252 (neutral/positive): Pure Power: Atk 438/480, SpA 219/240, Spe 259/284 — Telepathy: Atk 219/240, SpA 219/240, Spe 259/284
  Item: **free**
  STAB: Fighting Focus Punch 150P · Psychic Zen Headbutt 80P
  Physical coverage: Normal Double-Edge 120P, Poison Poison Jab 80P, Fire Fire Punch 75P, Ice Ice Punch 75P, Rock Rock Slide 75P, Electric Thunder Punch 75P
  Special coverage: Grass Energy Ball 90S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Ground Mud-Slap 20S
  Setup: Bulk Up, Calm Mind, Meditate, Work Up
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Drain Punch, Dream Eater
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Bullet Punch 40P Steel (+1), Fake Out 40P Normal (+3)
  Pivot: Baton Pass
  Status: Toxic
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Detect, Gravity, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Baton Pass, Trick Room, Focus Punch

**Meditite** — species, **PU**, source: override
  Fighting/Psychic | BST 280 (30/40/55/40/55/60) | Abilities: Pure Power / Telepathy
  Engine stats @252 (neutral/positive): Pure Power: Atk 358/392, SpA 179/196, Spe 219/240 — Telepathy: Atk 179/196, SpA 179/196, Spe 219/240
  Item: **free**
  STAB: Fighting Focus Punch 150P · Psychic Zen Headbutt 80P
  Physical coverage: Normal Double-Edge 120P, Poison Poison Jab 80P, Fire Fire Punch 75P, Ice Ice Punch 75P, Rock Rock Slide 75P, Electric Thunder Punch 75P
  Special coverage: Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Grass Grass Knot 60S, Ground Mud-Slap 20S
  Setup: Bulk Up, Calm Mind, Meditate, Work Up
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Drain Punch, Dream Eater
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Bullet Punch 40P Steel (+1), Fake Out 40P Normal (+3)
  Pivot: Baton Pass
  Status: Toxic
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Detect, Gravity, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Baton Pass, Trick Room, Focus Punch

**Mienfoo** — species, **PU**, source: override
  Fighting | BST 350 (45/85/50/55/50/65) | Abilities: Inner Focus / Regenerator / Reckless
  Engine stats @252 (neutral/positive): Inner Focus: Atk 269/295, SpA 209/229, Spe 229/251 — Regenerator: Atk 269/295, SpA 209/229, Spe 229/251 — Reckless: Atk 269/295, SpA 209/229, Spe 229/251
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Mega Kick 120P, Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P
  Special coverage: Normal Tera Blast 80S, Grass Grass Knot 60S
  Setup: Agility, Bulk Up, Calm Mind, Hone Claws, Meditate, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3)
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Reflect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass, Focus Punch

**Milotic** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Water | BST 540 (95/60/79/100/125/81) | Abilities: Marvel Scale / Competitive / Cute Charm
  Engine stats @252 (neutral/positive): Marvel Scale: Atk 219/240, SpA 299/328, Spe 261/287 — Competitive: Atk 219/240, SpA 299/328, Spe 261/287 — Cute Charm: Atk 219/240, SpA 299/328, Spe 261/287
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Dragon Scale Shot 25x2-5P, Bug Skitter Smack 70P, Ice Avalanche 60P, Dark Brutal Swing 60P
  Special coverage: Ice Blizzard 120S, Dragon Dragon Pulse 90S, Fairy Alluring Voice 80S, Normal Tera Blast 80S, Ground Mud Shot 55S, Psychic Mirror Coat fixedS
  Setup: Coil, Dragon Dance
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Draining Kiss
  Pivot: Flip Turn
  Phazing: Dragon Tail
  Status: Hypnosis, Toxic
  Cleric: Life Dew
  Weather/terrain: Hail, Rain Dance
  Utility: Haze, Light Screen, Magic Coat, Protect, Safeguard, Substitute
  Notable: Substitute

**Mismagius** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Ghost | BST 495 (60/60/60/105/105/105) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 219/240, SpA 309/339, Spe 309/339
  Item: **free**
  STAB: Ghost Shadow Ball 80S
  Physical coverage: Normal Double-Edge 120P, Dark Foul Play 95P, Flying Aerial Ace 60P
  Special coverage: Psychic Future Sight 120S, Electric Thunder 120S, Fire Inferno 100S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Dark Dark Pulse 80S
  Setup: Calm Mind, Defense Curl, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss, Dream Eater
  Priority: Sucker Punch 80P Dark (+1), Shadow Sneak 40P Ghost (+1)
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Cleric: Heal Bell
  Trapping: Mean Look
  Weather/terrain: Rain Dance, Snowscape, Sunny Day
  Utility: Destiny Bond, Magic Coat, Memento, Pain Split, Perish Song, Protect, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

**Mudsdale** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Ground | BST 500 (100/125/100/55/85/35) | Abilities: Own Tempo / Stamina / Inner Focus
  Engine stats @252 (neutral/positive): Own Tempo: Atk 349/383, SpA 209/229, Spe 169/185 — Stamina: Atk 349/383, SpA 209/229, Spe 169/185 — Inner Focus: Atk 349/383, SpA 209/229, Spe 169/185
  Item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Dark Lash Out 75P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S
  Setup: Iron Defense
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Roar
  Status: Toxic
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute

**Naclstack** — species, **PU**, source: override
  Rock | BST 355 (60/60/100/35/65/35) | Abilities: Purifying Salt / Sturdy / Clear Body
  Engine stats @252 (neutral/positive): Purifying Salt: Atk 219/240, SpA 169/185, Spe 169/185 — Sturdy: Atk 219/240, SpA 169/185, Spe 169/185 — Clear Body: Atk 219/240, SpA 169/185, Spe 169/185
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Fighting Body Press 80P, Steel Iron Head 80P, Psychic Zen Headbutt 80P
  Special coverage: Ground Earth Power 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S
  Setup: Harden, Iron Defense, Rock Polish
  Reliable recovery: Recover, Rest
  Hazards: Stealth Rock
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute

**Ninetales-Alola** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Ice/Fairy | BST 505 (73/67/75/81/100/109) | Abilities: Snow Cloak / Snow Warning
  Engine stats @252 (neutral/positive): Snow Cloak: Atk 233/256, SpA 261/287, Spe 317/348 — Snow Warning: Atk 233/256, SpA 261/287, Spe 317/348
  Item: **free**
  STAB: Ice Blizzard 120S · Fairy Moonblast 95S
  Physical coverage: Normal Skull Bash 130P, Fire Flare Blitz 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Water Aqua Tail 90P
  Special coverage: Fire Overheat 140S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S
  Setup: Agility, Calm Mind, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss, Dream Eater
  Priority: Ice Shard 40P Ice (+1), Quick Attack 40P Normal (+1)
  Pivot: Baton Pass
  Phazing: Roar
  Status: Hypnosis, Toxic, Will-O-Wisp
  Cleric: Heal Bell
  Weather/terrain: Hail, Misty Terrain, Rain Dance, Snowscape, Sunny Day
  Utility: Aurora Veil, Disable, Encore, Healing Wish, Memento, Pain Split, Protect, Reflect, Safeguard, Substitute
  Notable: Encore, Substitute, Baton Pass

**Ninjask** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Bug/Flying | BST 456 (61/90/45/50/50/160) | Abilities: Speed Boost / Infiltrator
  Engine stats @252 (neutral/positive): Speed Boost: Atk 279/306, SpA 199/218, Spe 419/460 — Infiltrator: Atk 279/306, SpA 199/218, Spe 419/460
  Item: **free**
  STAB: Bug Leech Life 80P · Flying Acrobatics 110P
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Dark Night Slash 70P, Steel Metal Claw 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Ghost Shadow Ball 80S, Ground Mud-Slap 20S, Fighting Final Gambit fixedS
  Setup: Agility, Harden, Hone Claws, Swords Dance
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Absorb, Giga Drain, Leech Life
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute, Baton Pass

**Oricorio** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Fire/Flying | BST 476 (75/70/70/98/70/93) | Abilities: Dancer
  Engine stats @252 (neutral/positive): Dancer: Atk 239/262, SpA 295/324, Spe 285/313
  Item: **free**
  STAB: Fire Revelation Dance 90S · Flying Sky Attack 140 (charge)P
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

**Oricorio-Pa'u** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Psychic/Flying | BST 476 (75/70/70/98/70/93) | Abilities: Dancer
  Engine stats @252 (neutral/positive): Dancer: Atk 239/262, SpA 295/324, Spe 285/313
  Item: **free**
  STAB: Psychic Revelation Dance 90S · Flying Sky Attack 140 (charge)P
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

**Palossand** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Ghost/Ground | BST 480 (85/75/110/100/75/35) | Abilities: Water Compaction / Sand Veil
  Engine stats @252 (neutral/positive): Water Compaction: Atk 249/273, SpA 299/328, Spe 169/185 — Sand Veil: Atk 249/273, SpA 299/328, Spe 169/185
  Item: **free**
  STAB: Ghost Poltergeist 110P · Ground Earthquake 100P
  Physical coverage: Normal Return 102P, Rock Stone Edge 100P, Dark Fling 30P
  Special coverage: Grass Energy Ball 90S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Water Brine 65S
  Setup: Amnesia, Harden, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Giga Drain, Mega Drain
  Hazards: Stealth Rock
  Status: Hypnosis, Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Destiny Bond, Gravity, Pain Split, Protect, Substitute, Trick
  Notable: Trick, Substitute

**Passimian** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Fighting | BST 490 (100/120/90/40/60/80) | Abilities: Receiver / Defiant
  Engine stats @252 (neutral/positive): Receiver: Atk 339/372, SpA 179/196, Spe 259/284 — Defiant: Atk 339/372, SpA 179/196, Spe 259/284
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Ground Earthquake 100P, Steel Iron Tail 100P, Grass Seed Bomb 80P
  Special coverage: Grass Energy Ball 90S, Normal Uproar 90S, Ghost Shadow Ball 80S, Electric Shock Wave 60S, Water Chilling Water 50S
  Setup: Bulk Up, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Quick Attack 40P Normal (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Trapping: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Knock Off, Pain Split, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass, Focus Punch

**Piloswine** — species, **PU**, source: override
  Ice/Ground | BST 450 (100/100/80/60/60/50) | Abilities: Oblivious / Snow Cloak / Thick Fat
  Engine stats @252 (neutral/positive): Oblivious: Atk 299/328, SpA 219/240, Spe 199/218 — Snow Cloak: Atk 299/328, SpA 219/240, Spe 199/218 — Thick Fat: Atk 299/328, SpA 219/240, Spe 199/218
  Item: **free**
  STAB: Ice Icicle Crash 85P · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Rock Stone Edge 100P, Dark Throat Chop 80P, Grass Trailblaze 50P, Flying Peck 35P
  Special coverage: Normal Tera Blast 80S, Rock Ancient Power 60S
  Setup: Amnesia, Defense Curl
  Reliable recovery: Rest
  Priority: Ice Shard 40P Ice (+1)
  Hazards: Stealth Rock
  Phazing: Roar
  Status: Toxic
  Weather/terrain: Hail, Rain Dance, Sandstorm, Snowscape
  Utility: Detect, Haze, Light Screen, Protect, Reflect, Substitute
  Notable: Substitute

**Porygon** — species, **PU**, source: override
  Normal | BST 395 (65/60/70/85/75/40) | Abilities: Trace / Download / Analytic
  Engine stats @252 (neutral/positive): Trace: Atk 219/240, SpA 269/295, Spe 179/196 — Download: Atk 219/240, SpA 269/295, Spe 179/196 — Analytic: Atk 219/240, SpA 269/295, Spe 179/196
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

**Primeape** — species, **PU**, source: override
  Fighting | BST 455 (65/105/60/60/70/95) | Abilities: Vital Spirit / Anger Point / Defiant
  Engine stats @252 (neutral/positive): Vital Spirit: Atk 309/339, SpA 219/240, Spe 289/317 — Anger Point: Atk 309/339, SpA 219/240, Spe 289/317 — Defiant: Atk 309/339, SpA 219/240, Spe 289/317
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Skull Bash 130P, Poison Gunk Shot 120P, Dragon Outrage 120P, Flying Acrobatics 110P, Ground Earthquake 100P, Steel Iron Tail 100P
  Special coverage: Fire Overheat 140S, Electric Thunder 120S, Normal Uproar 90S, Ground Mud-Slap 20S
  Setup: Bulk Up, Defense Curl, Hone Claws, Meditate, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Vacuum Wave 40S Fighting (+1)
  Hazards: Stealth Rock
  Pivot: U-turn
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Encore, Protect, Substitute, Taunt
  Notable: Encore, Taunt, Substitute, Focus Punch

**Qwilfish** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Water/Poison | BST 440 (65/95/85/55/55/85) | Abilities: Poison Point / Swift Swim / Intimidate
  Engine stats @252 (neutral/positive): Poison Point: Atk 289/317, SpA 209/229, Spe 269/295 — Swift Swim: Atk 289/317, SpA 209/229, Spe 269/295 — Intimidate: Atk 289/317, SpA 209/229, Spe 269/295
  Item: **free**
  STAB: Water Aqua Tail 90P · Poison Gunk Shot 120P
  Physical coverage: Normal Explosion 250P, Steel Steel Roller 130P, Flying Bounce 85 (charge)P, Dark Crunch 80P, Bug Pin Missile 25x2-5P, Dragon Scale Shot 25x2-5P
  Special coverage: Ice Blizzard 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Electric Shock Wave 60S, Ground Mud Shot 55S
  Setup: Agility, Defense Curl, Harden, Swords Dance
  Reliable recovery: Rest
  Priority: Aqua Jet 40P Water (+1)
  Hazards: Spikes, Toxic Spikes
  Pivot: Flip Turn
  Status: Thunder Wave, Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Destiny Bond, Haze, Pain Split, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Qwilfish-Hisui** — species, **PU**, source: override
  Dark/Poison | BST 440 (65/95/85/55/55/85) | Abilities: Poison Point / Swift Swim / Intimidate
  Engine stats @252 (neutral/positive): Poison Point: Atk 289/317, SpA 209/229, Spe 269/295 — Swift Swim: Atk 289/317, SpA 209/229, Spe 269/295 — Intimidate: Atk 289/317, SpA 209/229, Spe 269/295
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

**Raboot** — species, **PU**, source: override
  Fire | BST 420 (65/86/60/55/60/94) | Abilities: Blaze / Libero
  Engine stats @252 (neutral/positive): Blaze: Atk 271/298, SpA 209/229, Spe 287/315 — Libero: Atk 271/298, SpA 209/229, Spe 287/315
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Fighting High Jump Kick 130P, Normal Double-Edge 120P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Dark Sucker Punch 80P, Bug U-turn 70P
  Special coverage: Normal Tera Blast 80S, Electric Electro Ball 60S, Ground Mud Shot 55S
  Setup: Agility, Bulk Up, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1), Quick Attack 40P Normal (+1)
  Pivot: Baton Pass, U-turn
  Weather/terrain: Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute, Baton Pass

**Rampardos** — species, **PU**, source: override
  Rock | BST 495 (97/165/60/65/50/58) | Abilities: Mold Breaker / Sheer Force
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 429/471, SpA 229/251, Spe 215/236 — Sheer Force: Atk 429/471, SpA 229/251, Spe 215/236
  Item: **free**
  STAB: Rock Head Smash 150P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Electric Supercell Slam 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Water Surf 95S, Dragon Dragon Pulse 90S
  Setup: Rock Polish, Swords Dance
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Dragon Tail, Roar, Whirlwind
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Pain Split, Protect, Substitute
  Notable: Substitute, Focus Punch

**Raticate-Alola** — species, **PU**, source: imported (natdex-RU refined by gen7)
  Dark/Normal | BST 413 (75/71/70/40/80/77) | Abilities: Gluttony / Hustle / Thick Fat
  Engine stats @252 (neutral/positive): Gluttony: Atk 241/265, SpA 179/196, Spe 253/278 — Hustle: Atk 361/397, SpA 179/196, Spe 253/278 — Thick Fat: Atk 241/265, SpA 179/196, Spe 253/278
  Item: **free**
  STAB: Dark Crunch 80P · Normal Last Resort 140P
  Physical coverage: Steel Iron Tail 100P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Psychic Zen Headbutt 80P, Ghost Shadow Claw 70P, Bug U-turn 70P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Poison Sludge Wave 95S, Ghost Shadow Ball 80S, Water Bubble Beam 65S, Grass Grass Knot 60S
  Setup: Bulk Up, Defense Curl, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1), Quick Attack 40P Normal (+1)
  Pivot: U-turn
  Phazing: Roar
  Status: Thunder Wave, Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Knock Off, Protect, Substitute, Switcheroo, Taunt
  Notable: Knock Off, Switcheroo, Taunt, Substitute

**Roselia** — species, **PU**, source: override
  Grass/Poison | BST 400 (50/60/45/100/80/65) | Abilities: Natural Cure / Poison Point / Leaf Guard
  Engine stats @252 (neutral/positive): Natural Cure: Atk 219/240, SpA 299/328, Spe 229/251 — Poison Point: Atk 219/240, SpA 299/328, Spe 229/251 — Leaf Guard: Atk 219/240, SpA 299/328, Spe 229/251
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
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Leech Seed, Protect, Substitute
  Notable: Substitute

**Rotom-Heat** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Electric/Fire | BST 520 (50/65/107/105/107/86) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 229/251, SpA 309/339, Spe 271/298
  Item: **free**
  STAB: Electric Thunder 120S · Fire Overheat 140S
  Physical coverage: Ghost Poltergeist 110P, Normal Return 102P, Dark Foul Play 95P
  Special coverage: Psychic Dream Eater 100S, Normal Hyper Voice 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Fairy Disarming Voice 40S
  Setup: Charge, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Sucker Punch 80P Dark (+1)
  Removal: Defog
  Pivot: Volt Switch
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Weather/terrain: Electric Terrain, Rain Dance, Sunny Day
  Utility: Light Screen, Pain Split, Protect, Reflect, Substitute, Trick
  Notable: Trick, Substitute

**Rotom-Mow** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Electric/Grass | BST 520 (50/65/107/105/107/86) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 229/251, SpA 309/339, Spe 271/298
  Item: **free**
  STAB: Electric Thunder 120S · Grass Leaf Storm 140S
  Physical coverage: Ghost Poltergeist 110P, Normal Return 102P, Dark Foul Play 95P
  Special coverage: Psychic Dream Eater 100S, Normal Hyper Voice 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Fairy Disarming Voice 40S
  Setup: Charge, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Sucker Punch 80P Dark (+1)
  Removal: Defog
  Pivot: Volt Switch
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Weather/terrain: Electric Terrain, Rain Dance, Sunny Day
  Utility: Light Screen, Pain Split, Protect, Reflect, Substitute, Trick
  Notable: Trick, Substitute

**Salazzle** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Poison/Fire | BST 480 (68/64/60/111/60/117) | Abilities: Corrosion / Oblivious
  Engine stats @252 (neutral/positive): Corrosion: Atk 227/249, SpA 321/353, Spe 333/366 — Oblivious: Atk 227/249, SpA 321/353, Spe 333/366
  Item: **free**
  STAB: Poison Belch 120S · Fire Overheat 140S
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Steel Iron Tail 100P, Dark Foul Play 95P, Dragon Dragon Claw 80P, Bug Leech Life 80P
  Special coverage: Dragon Dragon Pulse 90S, Normal Hyper Voice 90S, Ground Mud-Slap 20S
  Setup: Agility, Dragon Dance, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Leech Life
  Priority: Fake Out 40P Normal (+3)
  Hazards: Toxic Spikes
  Phazing: Dragon Tail
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Disable, Encore, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Encore, Taunt, Substitute

**Sandslash-Alola** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Ice/Steel | BST 450 (75/100/120/25/65/65) | Abilities: Snow Cloak / Slush Rush
  Engine stats @252 (neutral/positive): Snow Cloak: Atk 299/328, SpA 149/163, Spe 229/251 — Slush Rush: Atk 299/328, SpA 149/163, Spe 229/251
  Item: **free**
  STAB: Ice Icicle Crash 85P · Steel Steel Roller 130P
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Poison Gunk Shot 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Water Aqua Tail 90P
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Normal Tera Blast 80S, Psychic Mirror Coat fixedS
  Setup: Agility, Amnesia, Defense Curl, Hone Claws, Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Leech Life
  Priority: Ice Shard 40P Ice (+1)
  Hazards: Spikes, Stealth Rock
  Removal: Rapid Spin
  Status: Toxic
  Weather/terrain: Hail, Sandstorm, Snowscape, Sunny Day
  Utility: Aurora Veil, Detect, Knock Off, Protect, Safeguard, Substitute
  Notable: Knock Off, Substitute, Focus Punch

**Scyther** — species, **PU**, source: override
  Bug/Flying | BST 500 (70/110/80/55/80/105) | Abilities: Swarm / Technician / Steadfast
  Engine stats @252 (neutral/positive): Swarm: Atk 319/350, SpA 209/229, Spe 309/339 — Technician: Atk 319/350, SpA 209/229, Spe 309/339 — Steadfast: Atk 319/350, SpA 209/229, Spe 309/339
  Item: **free**
  STAB: Bug Lunge 80P · Flying Acrobatics 110P
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Poison Cross Poison 70P, Dark Night Slash 70P, Psychic Psycho Cut 70P, Steel Steel Wing 70P
  Special coverage: Normal Tera Blast 80S, Ghost Ominous Wind 60S, Fighting Vacuum Wave 40S
  Setup: Agility, Swords Dance
  Reliable recovery: Rest, Roost
  Priority: Feint 50P Normal (+2), Quick Attack 40P Normal (+1), Vacuum Wave 40S Fighting (+1)
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Light Screen, Protect, Safeguard, Substitute, Tailwind
  Notable: Knock Off, Substitute, Baton Pass, Tailwind

**Servine** — species, **PU**, source: override
  Grass | BST 413 (60/60/75/60/75/83) | Abilities: Overgrow / Contrary
  Engine stats @252 (neutral/positive): Overgrow: Atk 219/240, SpA 219/240, Spe 265/291 — Contrary: Atk 219/240, SpA 219/240, Spe 265/291
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Water Aqua Tail 90P, Dark Knock Off 65P, Flying Aerial Ace 60P
  Special coverage: Normal Wring Out 120S, Dragon Twister 40S, Psychic Mirror Coat fixedS
  Setup: Calm Mind, Coil, Growth, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1)
  Removal: Defog
  Status: Glare, Toxic
  Cleric: Aromatherapy
  Trapping: Mean Look
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Knock Off, Leech Seed, Light Screen, Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Shaymin** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Grass | BST 600 (100/100/100/100/100/100) | Abilities: Natural Cure
  Engine stats @252 (neutral/positive): Natural Cure: Atk 299/328, SpA 299/328, Spe 299/328
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Last Resort 140P, Fairy Play Rough 90P, Psychic Zen Headbutt 80P
  Special coverage: Ground Earth Power 90S, Psychic Psychic 90S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Flying Air Slash 75S, Ghost Ominous Wind 60S
  Setup: Defense Curl, Growth, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain
  Priority: Grassy Glide 70P Grass (+1), Quick Attack 40P Normal (+1)
  Pivot: Baton Pass
  Status: Grass Whistle, Toxic
  Cleric: Aromatherapy
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Healing Wish, Leech Seed, Protect, Safeguard, Substitute, Tailwind
  Notable: Substitute, Baton Pass, Tailwind

**Sliggoo-Hisui** — species, **PU**, source: override
  Steel/Dragon | BST 452 (58/75/83/83/113/40) | Abilities: Sap Sipper / Shell Armor / Gooey
  Engine stats @252 (neutral/positive): Sap Sipper: Atk 249/273, SpA 265/291, Spe 179/196 — Shell Armor: Atk 249/273, SpA 265/291, Spe 179/196 — Gooey: Atk 249/273, SpA 265/291, Spe 179/196
  Item: **free**
  STAB: Steel Steel Beam 140S · Dragon Draco Meteor 140S
  Physical coverage: Normal Return 102P, Ice Ice Spinner 80P, Rock Rock Slide 75P, Bug Skitter Smack 70P, Poison Poison Tail 50P, Fighting Counter fixedP
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Water Muddy Water 95S, Poison Sludge Wave 95S, Normal Tera Blast 80S, Ground Mud Shot 55S
  Setup: Acid Armor, Shelter
  Reliable recovery: Rest
  Drain/Rest-only: Absorb
  Status: Toxic
  Cleric: Life Dew
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute

**Slowbro-Galar** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Poison/Psychic | BST 490 (95/100/95/100/70/30) | Abilities: Quick Draw / Own Tempo / Regenerator
  Engine stats @252 (neutral/positive): Quick Draw: Atk 299/328, SpA 299/328, Spe 159/174 — Own Tempo: Atk 299/328, SpA 299/328, Spe 159/174 — Regenerator: Atk 299/328, SpA 299/328, Spe 159/174
  Item: **free**
  STAB: Poison Belch 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Zap Cannon 120S, Rock Power Gem 80S
  Setup: Amnesia, Calm Mind, Iron Defense, Nasty Plot, Withdraw
  Reliable recovery: Rest, Slack Off
  Drain/Rest-only: Drain Punch, Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic, Yawn
  Trapping: Block
  Weather/terrain: Hail, Psychic Terrain, Rain Dance, Sandstorm, Snowscape, Sunny Day
  Utility: Disable, Haze, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room, Focus Punch

**Slowpoke** — species, **PU**, source: override
  Water/Psychic | BST 315 (90/65/65/40/40/15) | Abilities: Oblivious / Own Tempo / Regenerator
  Engine stats @252 (neutral/positive): Oblivious: Atk 229/251, SpA 179/196, Spe 129/141 — Own Tempo: Atk 229/251, SpA 179/196, Spe 129/141 — Regenerator: Atk 229/251, SpA 179/196, Spe 129/141
  Item: **free**
  STAB: Water Hydro Pump 120S · Psychic Future Sight 120S
  Physical coverage: Normal Skull Bash 130P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Ice Avalanche 60P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Fire Fire Blast 120S, Electric Zap Cannon 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S
  Setup: Amnesia, Calm Mind
  Reliable recovery: Rest, Slack Off
  Drain/Rest-only: Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic, Yawn
  Trapping: Block
  Weather/terrain: Hail, Psychic Terrain, Rain Dance, Snowscape, Sunny Day
  Utility: Disable, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

**Slowpoke-Galar** — species, **PU**, source: override
  Psychic | BST 315 (90/65/65/40/40/15) | Abilities: Gluttony / Own Tempo / Regenerator
  Engine stats @252 (neutral/positive): Gluttony: Atk 229/251, SpA 179/196, Spe 129/141 — Own Tempo: Atk 229/251, SpA 179/196, Spe 129/141 — Regenerator: Atk 229/251, SpA 179/196, Spe 129/141
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Skull Bash 130P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Water Aqua Tail 90P, Ice Avalanche 60P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Fire Fire Blast 120S, Water Hydro Pump 120S, Electric Zap Cannon 120S, Ghost Shadow Ball 80S
  Setup: Amnesia, Calm Mind
  Reliable recovery: Rest, Slack Off
  Drain/Rest-only: Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic, Yawn
  Trapping: Block
  Weather/terrain: Hail, Psychic Terrain, Rain Dance, Snowscape, Sunny Day
  Utility: Disable, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

**Sneasel-Hisui** — species, **PU**, source: override
  Fighting/Poison | BST 430 (55/95/55/35/75/115) | Abilities: Inner Focus / Keen Eye / Pickpocket
  Engine stats @252 (neutral/positive): Inner Focus: Atk 289/317, SpA 169/185, Spe 329/361 — Keen Eye: Atk 289/317, SpA 169/185, Spe 329/361 — Pickpocket: Atk 289/317, SpA 169/185, Spe 329/361
  Item: **free**
  STAB: Fighting Focus Punch 150P · Poison Gunk Shot 120P
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Ice Icicle Crash 85P, Bug X-Scissor 80P
  Special coverage: Ice Blizzard 120S, Psychic Dream Eater 100S, Water Surf 95S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S
  Setup: Agility, Bulk Up, Calm Mind, Defense Curl, Hone Claws, Nasty Plot, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3), Ice Shard 40P Ice (+1)
  Hazards: Toxic Spikes
  Status: Toxic
  Weather/terrain: Hail, Rain Dance, Snowscape, Sunny Day
  Utility: Detect, Knock Off, Protect, Reflect, Substitute, Switcheroo, Taunt
  Notable: Knock Off, Switcheroo, Taunt, Substitute, Focus Punch

**Snorlax** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 540 (160/110/65/65/110/30) | Abilities: Immunity / Thick Fat / Gluttony
  Engine stats @252 (neutral/positive): Immunity: Atk 319/350, SpA 229/251, Spe 159/174 — Thick Fat: Atk 319/350, SpA 229/251, Spe 159/174 — Gluttony: Atk 319/350, SpA 229/251, Spe 159/174
  Item: **free**
  STAB: Normal Self-Destruct 200P
  Physical coverage: Fighting Focus Punch 150P, Steel Steel Roller 130P, Poison Gunk Shot 120P, Fire Heat Crash 120P, Dragon Outrage 120P, Ground Earthquake 100P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S
  Setup: Amnesia, Defense Curl, Harden, Work Up
  Reliable recovery: Rest
  Phazing: Whirlwind
  Status: Toxic, Yawn
  Trapping: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Encore, Protect, Reflect, Substitute
  Notable: Encore, Substitute, Focus Punch

**Tangela** — species, **PU**, source: override
  Grass | BST 435 (65/55/115/100/40/60) | Abilities: Chlorophyll / Leaf Guard / Regenerator
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 209/229, SpA 299/328, Spe 219/240 — Leaf Guard: Atk 209/229, SpA 299/328, Spe 219/240 — Regenerator: Atk 209/229, SpA 299/328, Spe 219/240
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Skull Bash 130P, Fighting Wake-Up Slap 70P, Dark Knock Off 65P
  Special coverage: Normal Wring Out 120S, Poison Sludge Bomb 90S, Rock Ancient Power 60S, Electric Shock Wave 60S, Psychic Confusion 50S, Bug Infestation 20S
  Setup: Amnesia, Growth, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1)
  Status: Poison Powder, Sleep Powder, Stun Spore, Toxic
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Knock Off, Leech Seed, Pain Split, Protect, Reflect, Substitute
  Notable: Knock Off, Substitute

**Tatsugiri** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Dragon/Water | BST 475 (68/50/60/120/95/82) | Abilities: Commander / Storm Drain
  Engine stats @252 (neutral/positive): Commander: Atk 199/218, SpA 339/372, Spe 263/289 — Storm Drain: Atk 199/218, SpA 339/372, Spe 263/289
  Item: **free**
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

**Tauros-Paldea-Blaze** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Fighting/Fire | BST 490 (75/110/105/30/70/100) | Abilities: Intimidate / Anger Point / Cud Chew
  Engine stats @252 (neutral/positive): Intimidate: Atk 319/350, SpA 159/174, Spe 299/328 — Anger Point: Atk 319/350, SpA 159/174, Spe 299/328 — Cud Chew: Atk 319/350, SpA 159/174, Spe 299/328
  Item: **free**
  STAB: Fighting Close Combat 120P · Fire Flare Blitz 120P
  Physical coverage: Normal Skull Bash 130P, Bug Megahorn 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Water Surf 95S, Normal Uproar 90S, Ghost Shadow Ball 80S
  Setup: Bulk Up, Work Up
  Reliable recovery: Rest
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute

**Thwackey** — species, **PU**, source: override
  Grass | BST 420 (70/85/70/55/60/80) | Abilities: Overgrow / Grassy Surge
  Engine stats @252 (neutral/positive): Overgrow: Atk 269/295, SpA 209/229, Spe 259/284 — Grassy Surge: Atk 269/295, SpA 209/229, Spe 259/284
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Flying Acrobatics 110P, Fighting Hammer Arm 100P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Normal Uproar 90S
  Setup: Growth, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Giga Drain
  Priority: Grassy Glide 70P Grass (+1), Fake Out 40P Normal (+3)
  Pivot: U-turn
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Knock Off, Leech Seed, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Togedemaru** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Electric/Steel | BST 435 (65/98/63/40/73/96) | Abilities: Iron Barbs / Lightning Rod / Sturdy
  Engine stats @252 (neutral/positive): Iron Barbs: Atk 295/324, SpA 179/196, Spe 291/320 — Lightning Rod: Atk 295/324, SpA 179/196, Spe 291/320 — Sturdy: Atk 295/324, SpA 179/196, Spe 291/320
  Item: **free**
  STAB: Electric Wild Charge 90P · Steel Steel Roller 130P
  Physical coverage: Normal Last Resort 140P, Bug Twineedle 50x2P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P, Psychic Zen Headbutt 80P, Dark Assurance 60P
  Special coverage: Grass Grass Knot 60S, Normal Hidden Power 60S, Fairy Disarming Voice 40S
  Setup: Agility, Charge, Defense Curl, Work Up
  Reliable recovery: Rest
  Priority: Fake Out 40P Normal (+3)
  Pivot: U-turn, Volt Switch
  Status: Nuzzle, Thunder Wave, Toxic
  Cleric: Wish
  Weather/terrain: Electric Terrain
  Utility: Encore, Gravity, Protect, Reflect, Substitute
  Notable: Encore, Substitute

**Togetic** — species, **PU**, source: override
  Fairy/Flying | BST 405 (55/40/85/80/105/40) | Abilities: Hustle / Serene Grace / Super Luck
  Engine stats @252 (neutral/positive): Hustle: Atk 268/294, SpA 259/284, Spe 179/196 — Serene Grace: Atk 179/196, SpA 259/284, Spe 179/196 — Super Luck: Atk 179/196, SpA 259/284, Spe 179/196
  Item: **free**
  STAB: Fairy Play Rough 90P · Flying Sky Attack 140 (charge)P
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Psychic Zen Headbutt 80P, Steel Smart Strike 70P, Dark Fling 30P, Rock Rollout 30P
  Special coverage: Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Zap Cannon 120S, Grass Solar Beam 120 (charge)S, Normal Hyper Voice 90S, Ghost Shadow Ball 80S
  Setup: Defense Curl, Nasty Plot, Work Up
  Reliable recovery: Rest, Roost, Soft-Boiled
  Drain/Rest-only: Drain Punch, Draining Kiss, Dream Eater
  Removal: Defog
  Pivot: Baton Pass
  Status: Thunder Wave, Toxic, Yawn
  Cleric: Heal Bell, Life Dew, Wish
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Encore, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Tailwind, Trick
  Notable: Trick, Encore, Substitute, Baton Pass, Tailwind, Focus Punch

**Turtonator** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Fire/Dragon | BST 485 (60/78/135/91/85/36) | Abilities: Shell Armor
  Engine stats @252 (neutral/positive): Shell Armor: Atk 255/280, SpA 281/309, Spe 171/188
  Item: **free**
  STAB: Fire Shell Trap 150S · Dragon Draco Meteor 140S
  Physical coverage: Normal Explosion 250P, Rock Head Smash 150P, Ground Earthquake 100P, Steel Heavy Slam 100P, Fighting Body Press 80P, Dark Lash Out 75P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Normal Hyper Voice 90S, Steel Flash Cannon 80S, Ground Scorching Sands 70S, Poison Venoshock 65S
  Setup: Bulk Up, Iron Defense, Shell Smash, Work Up
  Reliable recovery: Rest
  Removal: Rapid Spin
  Phazing: Dragon Tail, Roar
  Status: Toxic, Will-O-Wisp
  Trapping: Block
  Weather/terrain: Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Type: Null** — species, **PU**, source: override
  Normal | BST 534 (95/95/95/95/95/59) | Abilities: Battle Armor
  Engine stats @252 (neutral/positive): Battle Armor: Atk 289/317, SpA 289/317, Spe 217/238
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Dragon Dragon Claw 80P, Steel Iron Head 80P, Bug X-Scissor 80P, Rock Rock Slide 75P, Ghost Shadow Claw 70P, Flying Aerial Ace 60P
  Special coverage: Flying Air Slash 75S, Bug Signal Beam 75S, Ice Icy Wind 55S
  Setup: Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest
  Pivot: U-turn
  Phazing: Roar
  Status: Thunder Wave, Toxic
  Weather/terrain: Hail, Rain Dance, Sandstorm, Sunny Day
  Utility: Magic Coat, Protect, Substitute
  Notable: Substitute

**Typhlosion-Hisui** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Fire/Ghost | BST 534 (73/84/78/119/85/95) | Abilities: Blaze / Frisk
  Engine stats @252 (neutral/positive): Blaze: Atk 267/293, SpA 337/370, Spe 289/317 — Frisk: Atk 267/293, SpA 337/370, Spe 289/317
  Item: **free**
  STAB: Fire Eruption 150S · Ghost Poltergeist 110P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fairy Play Rough 90P, Electric Wild Charge 90P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Psychic Extrasensory 80S, Normal Tera Blast 80S, Ground Scorching Sands 70S
  Setup: Calm Mind, Defense Curl, Work Up
  Reliable recovery: Rest
  Priority: Quick Attack 40P Normal (+1)
  Phazing: Roar
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Detect, Protect, Substitute
  Notable: Substitute, Focus Punch

**Ursaring** — species, **PU**, source: override
  Normal | BST 500 (90/130/75/75/75/55) | Abilities: Guts / Quick Feet / Unnerve
  Engine stats @252 (neutral/positive): Guts: Atk 359/394, SpA 249/273, Spe 209/229 — Quick Feet: Atk 359/394, SpA 249/273, Spe 209/229 — Unnerve: Atk 359/394, SpA 249/273, Spe 209/229
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Fairy Play Rough 90P, Dark Crunch 80P
  Special coverage: Fighting Focus Blast 120S, Electric Zap Cannon 120S, Ground Mud-Slap 20S
  Setup: Bulk Up, Defense Curl, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Phazing: Roar
  Status: Toxic, Yawn
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute, Focus Punch

**Venomoth** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Bug/Poison | BST 450 (70/65/60/90/75/90) | Abilities: Shield Dust / Tinted Lens / Wonder Skin
  Engine stats @252 (neutral/positive): Shield Dust: Atk 229/251, SpA 279/306, Spe 279/306 — Tinted Lens: Atk 229/251, SpA 279/306, Spe 279/306 — Wonder Skin: Atk 229/251, SpA 279/306, Spe 279/306
  Item: **free**
  STAB: Bug Bug Buzz 90S · Poison Sludge Wave 95S
  Physical coverage: Normal Double-Edge 120P, Flying Acrobatics 110P, Psychic Zen Headbutt 80P, Dark Thief 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Tera Blast 80S, Flying Air Slash 75S, Ghost Ominous Wind 60S, Dragon Twister 40S
  Setup: Agility, Quiver Dance
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Dream Eater, Giga Drain, Leech Life, Mega Drain
  Hazards: Toxic Spikes
  Removal: Defog
  Pivot: Baton Pass, Teleport, U-turn
  Phazing: Whirlwind
  Status: Poison Powder, Sleep Powder, Stun Spore, Toxic
  Weather/terrain: Sunny Day
  Utility: Disable, Protect, Reflect, Substitute, Tailwind
  Notable: Substitute, Baton Pass, Tailwind

**Vileplume** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Grass/Poison | BST 490 (75/80/85/110/90/50) | Abilities: Chlorophyll / Effect Spore
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 259/284, SpA 319/350, Spe 199/218 — Effect Spore: Atk 259/284, SpA 319/350, Spe 199/218
  Item: **free**
  STAB: Grass Leaf Storm 140S · Poison Sludge Wave 95S
  Physical coverage: Normal Double-Edge 120P, Fighting Drain Punch 75P, Dark Fling 30P
  Special coverage: Fairy Moonblast 95S, Bug Pollen Puff 90S, Normal Tera Blast 80S
  Setup: Growth, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Drain Punch, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1)
  Status: Poison Powder, Sleep Powder, Stun Spore, Toxic
  Cleric: Aromatherapy
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Leech Seed, Protect, Reflect, Safeguard, Substitute
  Notable: Substitute

**Virizion** — species, **PU**, source: override
  Grass/Fighting | BST 580 (91/90/72/90/129/108) | Abilities: Justified
  Engine stats @252 (neutral/positive): Justified: Atk 279/306, SpA 279/306, Spe 315/346
  Item: **free**
  STAB: Grass Leaf Storm 140S · Fighting Close Combat 120P
  Physical coverage: Normal Double-Edge 120P, Bug Megahorn 120P, Rock Stone Edge 100P, Flying Bounce 85 (charge)P, Psychic Zen Headbutt 80P, Steel Smart Strike 70P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S
  Setup: Calm Mind, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain
  Priority: Grassy Glide 70P Grass (+1), Upper Hand 65P Fighting (+3), Quick Attack 40P Normal (+1), Vacuum Wave 40S Fighting (+1)
  Phazing: Roar
  Status: Toxic
  Trapping: Block
  Weather/terrain: Sunny Day
  Utility: Light Screen, Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Taunt, Substitute

**Vullaby** — species, **PU**, source: override
  Dark/Flying | BST 370 (70/55/75/45/65/60) | Abilities: Big Pecks / Overcoat / Weak Armor
  Engine stats @252 (neutral/positive): Big Pecks: Atk 209/229, SpA 189/207, Spe 219/240 — Overcoat: Atk 209/229, SpA 189/207, Spe 219/240 — Weak Armor: Atk 209/229, SpA 189/207, Spe 219/240
  Item: **free**
  STAB: Dark Foul Play 95P · Flying Brave Bird 120P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Rock Rock Tomb 60P, Fighting Rock Smash 40P
  Special coverage: Fire Heat Wave 100S, Normal Uproar 90S, Ghost Shadow Ball 80S
  Setup: Iron Defense, Nasty Plot
  Reliable recovery: Rest, Roost
  Removal: Defog
  Pivot: U-turn
  Phazing: Whirlwind
  Status: Toxic
  Trapping: Block, Mean Look
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Knock Off, Protect, Substitute, Tailwind, Taunt
  Notable: Knock Off, Taunt, Substitute, Tailwind

**Wishiwashi** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Water | BST 175 (45/20/20/25/25/40) | Abilities: Schooling
  Engine stats @252 (neutral/positive): Schooling: Atk 379/416, SpA 379/416, Spe 159/174
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dragon Scale Shot 25x2-5P, Bug U-turn 70P, Dark Feint Attack 60P
  Special coverage: Ice Ice Beam 95S, Normal Uproar 90S, Ground Mud Shot 55S
  Reliable recovery: Rest
  Pivot: Flip Turn, U-turn
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Protect, Substitute
  Notable: Substitute

**Wishiwashi-School** — species, **PU**, source: imported (natdex-RU refined by gen8)
  Water | BST 620 (45/140/130/140/135/30) | Abilities: Schooling
  Engine stats @252 (neutral/positive): Schooling: Atk 379/416, SpA 379/416, Spe 159/174
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dragon Scale Shot 25x2-5P, Bug U-turn 70P, Dark Feint Attack 60P
  Special coverage: Ice Ice Beam 95S, Normal Uproar 90S, Ground Mud Shot 55S
  Reliable recovery: Rest
  Pivot: Flip Turn, U-turn
  Status: Toxic
  Weather/terrain: Hail, Rain Dance
  Utility: Protect, Substitute
  Notable: Substitute

**Wo-Chien** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Dark/Grass | BST 580 (85/90/100/100/135/70) | Abilities: Tablets of Ruin
  Engine stats @252 (neutral/positive): Tablets of Ruin: Atk 279/306, SpA 299/328, Spe 239/262
  Item: **free**
  STAB: Dark Foul Play 95P · Grass Leaf Storm 140S
  Physical coverage: Normal Take Down 90P, Fighting Body Press 80P, Psychic Zen Headbutt 80P
  Special coverage: Bug Pollen Puff 90S, Normal Tera Blast 80S, Ghost Hex 65S, Ground Mud Shot 55S
  Setup: Growth
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Giga Drain, Mega Drain
  Status: Poison Powder, Stun Spore
  Trapping: Mean Look
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Knock Off, Leech Seed, Light Screen, Protect, Reflect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Wobbuffet** — species, **PU**, source: override
  Psychic | BST 405 (190/33/58/33/58/33) | Abilities: Shadow Tag / Telepathy
  Engine stats @252 (neutral/positive): Shadow Tag: Atk 165/181, SpA 165/181, Spe 165/181 — Telepathy: Atk 165/181, SpA 165/181, Spe 165/181
  Item: **free**
  STAB: Psychic Mirror Coat fixedS
  Physical coverage: Fighting Counter fixedP
  Special coverage: **none**
  Setup: Amnesia
  Utility: Destiny Bond, Encore, Safeguard
  Notable: Encore

**Zoroark** — species, **PU**, source: imported (natdex-RU refined by gen9)
  Dark | BST 510 (60/105/60/120/60/105) | Abilities: Illusion
  Engine stats @252 (neutral/positive): Illusion: Atk 309/339, SpA 339/372, Spe 309/339
  Item: **free**
  STAB: Dark Foul Play 95P
  Physical coverage: Normal Mega Kick 120P, Ground Dig 100 (charge)P, Flying Bounce 85 (charge)P, Fighting Brick Break 75P, Ghost Shadow Claw 70P, Bug Skitter Smack 70P
  Special coverage: Fighting Focus Blast 120S, Fire Flamethrower 95S, Normal Hyper Voice 90S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S
  Setup: Agility, Calm Mind, Hone Claws, Nasty Plot, Swords Dance
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1)
  Pivot: U-turn
  Phazing: Roar
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Encore, Knock Off, Memento, Pain Split, Protect, Substitute, Taunt, Trick
  Notable: Knock Off, Trick, Encore, Taunt, Substitute

**Zweilous** — species, **PU**, source: override
  Dark/Dragon | BST 420 (72/85/70/65/70/58) | Abilities: Hustle
  Engine stats @252 (neutral/positive): Hustle: Atk 403/442, SpA 229/251, Spe 215/236
  Item: **free**
  STAB: Dark Crunch 80P · Dragon Outrage 120P
  Physical coverage: Rock Head Smash 150P, Fighting Superpower 120P, Normal Return 102P, Water Aqua Tail 90P, Psychic Zen Headbutt 80P, Ground Stomping Tantrum 75P
  Special coverage: Poison Belch 120S, Ground Earth Power 90S, Normal Hyper Voice 90S, Fire Incinerate 60S, Electric Shock Wave 60S
  Setup: Nasty Plot, Work Up
  Reliable recovery: Rest
  Phazing: Dragon Tail, Roar
  Status: Thunder Wave, Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute
---

## E. Current RU comparison bar (post-promotion)

All **131** UU entries — the roster the last audit left unchanged.

**Absol-Mega** — forme, **RU**, source: imported (natdex)
  Dark | BST 565 (65/150/60/115/60/115) | Abilities: Magic Bounce
  Engine stats @252 (neutral/positive): Magic Bounce: Atk 399/438, SpA 329/361, Spe 329/361
  Item: **Absolite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Absol (PU), pre-Mega abilities Pressure / Super Luck / Justified, pre-Mega Spe 273 (max +Spe)
  STAB: Dark Foul Play 95P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Fairy Play Rough 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Normal Razor Wind 80 (charge)S

**Absol-Mega-Z** — forme, **RU**, source: **estimated** _(its own `species.tier` reads PU — the base's; the enforced tier is the one shown)_
  Dark/Ghost | BST 565 (65/154/60/75/60/151) | Abilities: Sharpness
  Engine stats @252 (neutral/positive): Sharpness: Atk 407/447, SpA 249/273, Spe 401/441
  Item: **Absolite Z** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Absol (PU), pre-Mega abilities Pressure / Super Luck / Justified, pre-Mega Spe 273 (max +Spe)
  STAB: Dark Foul Play 95P · Ghost Shadow Claw 70P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Fairy Play Rough 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Normal Razor Wind 80 (charge)S, Flying Air Slash 75S

**Aggron-Mega** — forme, **RU**, source: imported (natdex)
  Steel | BST 630 (70/140/230/60/80/50) | Abilities: Filter
  Engine stats @252 (neutral/positive): Filter: Atk 379/416, SpA 219/240, Spe 199/218
  Item: **Aggronite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Aggron (NU), pre-Mega abilities Sturdy / Rock Head / Heavy Metal, pre-Mega Spe 218 (max +Spe)
  STAB: Steel Steel Roller 130P
  Physical coverage: Fighting Focus Punch 150P, Rock Head Smash 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S

**Ampharos-Mega** — forme, **RU**, source: imported (natdex)
  Electric/Dragon | BST 610 (90/95/105/165/110/45) | Abilities: Mold Breaker
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 289/317, SpA 429/471, Spe 189/207
  Item: **Ampharosite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Ampharos (ZU), pre-Mega abilities Static / Plus, pre-Mega Spe 229 (max +Spe)
  STAB: Electric Thunder 120S · Dragon Dragon Pulse 90S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Fling 80P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Rock Meteor Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Arcanine-Hisui** — species, **RU**, source: imported (natdex)
  Fire/Rock | BST 555 (95/115/80/95/80/90) | Abilities: Intimidate / Flash Fire / Rock Head
  Engine stats @252 (neutral/positive): Intimidate: Atk 329/361, SpA 289/317, Spe 279/306 — Flash Fire: Atk 329/361, SpA 289/317, Spe 279/306 — Rock Head: Atk 329/361, SpA 289/317, Spe 279/306
  Item: **free**
  STAB: Fire Overheat 140S · Rock Head Smash 150P
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P
  Special coverage: Grass Solar Beam 120 (charge)S, Dragon Dragon Pulse 90S, Normal Hyper Voice 90S, Ground Scorching Sands 70S, Dark Snarl 55S

**Arctozolt** — species, **RU**, source: imported (natdex)
  Electric/Ice | BST 505 (90/100/90/90/80/55) | Abilities: Volt Absorb / Static / Slush Rush
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 299/328, SpA 279/306, Spe 209/229 — Static: Atk 299/328, SpA 279/306, Spe 209/229 — Slush Rush: Atk 299/328, SpA 279/306, Spe 209/229
  Item: **free**
  STAB: Electric Bolt Beak 170P · Ice Blizzard 120S
  Physical coverage: Normal Mega Kick 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ground Stomping Tantrum 75P, Fighting Low Kick 60P, Flying Pluck 60P
  Special coverage: Water Hydro Pump 120S, Rock Meteor Beam 120 (charge)S, Normal Hyper Voice 90S

**Armarouge** — species, **RU**, source: imported (natdex)
  Fire/Psychic | BST 525 (85/60/100/125/80/75) | Abilities: Flash Fire / Weak Armor
  Engine stats @252 (neutral/positive): Flash Fire: Atk 219/240, SpA 349/383, Spe 249/273 — Weak Armor: Atk 219/240, SpA 349/383, Spe 249/273
  Item: **free**
  STAB: Fire Overheat 140S · Psychic Psychic 90S
  Physical coverage: Normal Take Down 90P, Ghost Astonish 30P, Dark Fling 30P
  Special coverage: Fighting Focus Blast 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S

**Azelf** — species, **RU**, source: imported (natdex)
  Psychic | BST 580 (75/125/70/125/70/115) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 349/383, SpA 349/383, Spe 329/361
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Flying Acrobatics 110P, Steel Iron Tail 100P, Fairy Play Rough 90P, Fighting Drain Punch 75P, Fire Fire Punch 75P
  Special coverage: Fire Fire Blast 120S, Electric Thunder 120S, Grass Energy Ball 90S, Normal Uproar 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S

**Banette-Mega** — forme, **RU**, source: imported (natdex)
  Ghost | BST 555 (64/165/75/93/83/75) | Abilities: Prankster
  Engine stats @252 (neutral/positive): Prankster: Atk 429/471, SpA 285/313, Spe 249/273
  Item: **Banettite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Banette (ZU), pre-Mega abilities Insomnia / Frisk / Cursed Body, pre-Mega Spe 251 (max +Spe)
  STAB: Ghost Poltergeist 110P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Dark Foul Play 95P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Fire Burning Jealousy 70S

**Barbaracle** — species, **RU**, source: imported (natdex)
  Rock/Water | BST 500 (72/105/115/54/86/68) | Abilities: Tough Claws / Sniper / Pickpocket
  Engine stats @252 (neutral/positive): Tough Claws: Atk 309/339, SpA 207/227, Spe 235/258 — Sniper: Atk 309/339, SpA 207/227, Spe 235/258 — Pickpocket: Atk 309/339, SpA 207/227, Spe 235/258
  Item: **free**
  STAB: Rock Stone Edge 100P · Water Liquidation 85P
  Physical coverage: Normal Skull Bash 130P, Fighting Superpower 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Poison Poison Jab 80P, Bug X-Scissor 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Ground Earth Power 90S, Normal Uproar 90S, Grass Grass Knot 60S

**Barraskewda** — species, **RU**, source: imported (natdex)
  Water | BST 490 (61/123/60/60/50/136) | Abilities: Swift Swim / Propeller Tail
  Engine stats @252 (neutral/positive): Swift Swim: Atk 345/379, SpA 219/240, Spe 371/408 — Propeller Tail: Atk 345/379, SpA 219/240, Spe 371/408
  Item: **free**
  STAB: Water Liquidation 85P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Dark Crunch 80P, Ground Drill Run 80P
  Special coverage: Ice Blizzard 120S, Normal Tera Blast 80S

**Beedrill-Mega** — forme, **RU**, source: imported (natdex)
  Bug/Poison | BST 495 (65/150/40/15/80/145) | Abilities: Adaptability
  Engine stats @252 (neutral/positive): Adaptability: Atk 399/438, SpA 129/141, Spe 389/427
  Item: **Beedrillite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Beedrill (ZU), pre-Mega abilities Swarm / Sniper, pre-Mega Spe 273 (max +Spe)
  STAB: Bug Twineedle 50x2P · Poison Poison Jab 80P
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Ground Drill Run 80P, Dark Throat Chop 80P, Fighting Brick Break 75P, Flying Aerial Ace 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Flying Air Cutter 60S, Normal Hidden Power 60S, Ghost Ominous Wind 60S, Electric Electroweb 55S

**Bewear** — species, **RU**, source: imported (natdex)
  Normal/Fighting | BST 500 (120/125/80/55/60/60) | Abilities: Fluffy / Klutz / Unnerve
  Engine stats @252 (neutral/positive): Fluffy: Atk 349/383, SpA 209/229, Spe 219/240 — Klutz: Atk 349/383, SpA 209/229, Spe 219/240 — Unnerve: Atk 349/383, SpA 209/229, Spe 219/240
  Item: **free**
  STAB: Normal Double-Edge 120P · Fighting Focus Punch 150P
  Physical coverage: Dragon Dual Chop 50x2P, Ground Earthquake 100P, Dark Darkest Lariat 85P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Ice Ice Punch 75P
  Special coverage: **none**

**Blastoise** — species, **RU**, source: imported (natdex)
  Water | BST 530 (79/83/100/85/105/78) | Abilities: Torrent / Rain Dish
  Engine stats @252 (neutral/positive): Torrent: Atk 265/291, SpA 269/295, Spe 255/280 — Rain Dish: Atk 265/291, SpA 269/295, Spe 255/280
  Item: **free**
  STAB: Water Water Spout 150S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S, Normal Tera Blast 80S

**Breloom** — species, **RU**, source: imported (natdex)
  Grass/Fighting | BST 460 (60/130/80/60/60/70) | Abilities: Effect Spore / Poison Heal / Technician
  Engine stats @252 (neutral/positive): Effect Spore: Atk 359/394, SpA 219/240, Spe 239/262 — Poison Heal: Atk 359/394, SpA 219/240, Spe 239/262 — Technician: Atk 359/394, SpA 219/240, Spe 239/262
  Item: **free**
  STAB: Grass Seed Bomb 80P · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P
  Special coverage: Poison Sludge Bomb 90S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Camerupt-Mega** — forme, **RU**, source: imported (natdex)
  Fire/Ground | BST 560 (70/120/100/145/105/20) | Abilities: Sheer Force
  Engine stats @252 (neutral/positive): Sheer Force: Atk 339/372, SpA 389/427, Spe 139/152
  Item: **Cameruptite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Camerupt (ZU), pre-Mega abilities Magma Armor / Solid Rock / Anger Point, pre-Mega Spe 196 (max +Spe)
  STAB: Fire Eruption 150S · Ground Earthquake 100P
  Physical coverage: Normal Explosion 250P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Fighting Body Press 80P, Psychic Zen Headbutt 80P, Dark Lash Out 75P
  Special coverage: Grass Solar Beam 120 (charge)S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Rock Ancient Power 60S

**Celebi** — species, **RU**, source: imported (natdex)
  Psychic/Grass | BST 600 (100/100/100/100/100/100) | Abilities: Natural Cure
  Engine stats @252 (neutral/positive): Natural Cure: Atk 299/328, SpA 299/328, Spe 299/328
  Item: **free**
  STAB: Psychic Future Sight 120S · Grass Leaf Storm 140S
  Physical coverage: Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Dark Sucker Punch 80P, Bug U-turn 70P
  Special coverage: Fighting Aura Sphere 90S, Ground Earth Power 90S, Bug Pollen Puff 90S, Normal Uproar 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S

**Cetitan** — species, **RU**, source: imported (natdex)
  Ice | BST 521 (170/113/65/45/55/73) | Abilities: Thick Fat / Slush Rush / Sheer Force
  Engine stats @252 (neutral/positive): Thick Fat: Atk 325/357, SpA 189/207, Spe 245/269 — Slush Rush: Atk 325/357, SpA 189/207, Spe 245/269 — Sheer Force: Atk 325/357, SpA 189/207, Spe 245/269
  Item: **free**
  STAB: Ice Icicle Crash 85P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Fighting Superpower 120P, Ground Earthquake 100P, Fairy Play Rough 90P, Water Liquidation 85P
  Special coverage: Normal Hyper Voice 90S, Water Water Pulse 60S

**Chesnaught** — species, **RU**, source: imported (natdex)
  Grass/Fighting | BST 530 (88/107/122/74/75/64) | Abilities: Overgrow / Bulletproof
  Engine stats @252 (neutral/positive): Overgrow: Atk 313/344, SpA 247/271, Spe 227/249 — Bulletproof: Atk 313/344, SpA 247/271, Spe 227/249
  Item: **free**
  STAB: Grass Leaf Storm 140S · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Dark Crunch 80P
  Special coverage: Poison Sludge Bomb 90S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Chimecho-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one shown)_
  Psychic/Steel | BST 555 (75/50/110/135/120/65) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 199/218, SpA 369/405, Spe 229/251
  Item: **Chimechite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Chimecho (ZU), pre-Mega abilities Levitate, pre-Mega Spe 251 (max +Spe)
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Dark Knock Off 65P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Grass Energy Ball 90S, Normal Hyper Voice 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Electric Shock Wave 60S

**Cloyster** — species, **RU**, source: imported (natdex)
  Water/Ice | BST 525 (50/95/180/85/45/70) | Abilities: Shell Armor / Skill Link / Overcoat
  Engine stats @252 (neutral/positive): Shell Armor: Atk 289/317, SpA 269/295, Spe 239/262 — Skill Link: Atk 289/317, SpA 269/295, Spe 239/262 — Overcoat: Atk 289/317, SpA 269/295, Spe 239/262
  Item: **free**
  STAB: Water Hydro Pump 120S · Ice Blizzard 120S
  Physical coverage: Normal Explosion 250P, Steel Steel Roller 130P, Bug Twineedle 50x2P, Ground Drill Run 80P, Poison Poison Jab 80P, Rock Rock Blast 25x2-5P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S, Ground Mud Shot 55S

**Cobalion** — species, **RU**, source: imported (natdex)
  Steel/Fighting | BST 580 (91/90/129/90/72/108) | Abilities: Justified
  Engine stats @252 (neutral/positive): Justified: Atk 279/306, SpA 279/306, Spe 315/346
  Item: **free**
  STAB: Steel Steel Beam 140S · Fighting Close Combat 120P
  Physical coverage: Normal Double-Edge 120P, Bug Megahorn 120P, Rock Stone Edge 100P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P, Psychic Zen Headbutt 80P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Electric Volt Switch 70S

**Comfey** — species, **RU**, source: imported (natdex)
  Fairy | BST 485 (51/52/90/82/110/100) | Abilities: Flower Veil / Triage / Natural Cure
  Engine stats @252 (neutral/positive): Flower Veil: Atk 203/223, SpA 263/289, Spe 299/328 — Triage: Atk 203/223, SpA 263/289, Spe 299/328 — Natural Cure: Atk 203/223, SpA 263/289, Spe 299/328
  Item: **free**
  STAB: Fairy Play Rough 90P
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Grass Petal Blizzard 90P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Grass Petal Dance 120S, Bug Pollen Puff 90S, Normal Tera Blast 80S, Psychic Stored Power 20S

**Copperajah** — species, **RU**, source: override
  Steel | BST 500 (122/130/69/80/69/30) | Abilities: Sheer Force / Heavy Metal
  Engine stats @252 (neutral/positive): Sheer Force: Atk 359/394, SpA 259/284, Spe 159/174 — Heavy Metal: Atk 359/394, SpA 259/284, Spe 159/174
  Item: **free**
  STAB: Steel Steel Roller 130P
  Physical coverage: Normal Double-Edge 120P, Fire Heat Crash 120P, Dragon Outrage 120P, Grass Power Whip 120P, Fighting Superpower 120P, Ground Earthquake 100P
  Special coverage: Poison Belch 120S, Ground Earth Power 90S, Normal Tera Blast 80S, Dark Snarl 55S

**Crabominable-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one shown)_
  Fighting/Ice | BST 578 (97/157/122/62/107/33) | Abilities: Iron Fist
  Engine stats @252 (neutral/positive): Iron Fist: Atk 413/454, SpA 223/245, Spe 165/181
  Item: **Crabominite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Crabominable (ZU), pre-Mega abilities Hyper Cutter / Iron Fist / Anger Point, pre-Mega Spe 203 (max +Spe)
  STAB: Fighting Focus Punch 150P · Ice Ice Hammer 100P
  Physical coverage: Poison Gunk Shot 120P, Normal Return 102P, Water Crabhammer 100P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Hard Press 100P
  Special coverage: Water Scald 80S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Crawdaunt** — species, **RU**, source: imported (natdex)
  Water/Dark | BST 468 (63/120/85/90/55/55) | Abilities: Hyper Cutter / Shell Armor / Adaptability
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 339/372, SpA 279/306, Spe 209/229 — Shell Armor: Atk 339/372, SpA 279/306, Spe 209/229 — Adaptability: Atk 339/372, SpA 279/306, Spe 209/229
  Item: **free**
  STAB: Water Hydro Pump 120S · Dark Crunch 80P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Steel Hard Press 100P, Ground Dig 100 (charge)P, Bug X-Scissor 80P, Rock Rock Slide 75P
  Special coverage: Normal Trump Card 200S, Ice Blizzard 120S, Poison Sludge Wave 95S, Rock Ancient Power 60S, Ground Mud Shot 55S

**Cresselia** — species, **RU**, source: imported (natdex)
  Psychic | BST 600 (120/70/120/75/130/85) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 239/262, SpA 249/273, Spe 269/295
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Bug Fury Cutter 40P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Fairy Moonblast 95S, Rock Power Gem 80S, Ghost Shadow Ball 80S

**Crobat** — species, **RU**, source: imported (natdex)
  Poison/Flying | BST 535 (85/90/80/70/80/130) | Abilities: Inner Focus / Infiltrator
  Engine stats @252 (neutral/positive): Inner Focus: Atk 279/306, SpA 239/262, Spe 359/394 — Infiltrator: Atk 279/306, SpA 239/262, Spe 359/394
  Item: **free**
  STAB: Poison Sludge Bomb 90S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Bug Leech Life 80P, Psychic Zen Headbutt 80P, Steel Steel Wing 70P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Grass Giga Drain 75S, Dragon Twister 40S

**Cyclizar** — species, **RU**, source: imported (natdex)
  Dragon/Normal | BST 501 (70/95/65/85/65/121) | Abilities: Shed Skin / Regenerator
  Engine stats @252 (neutral/positive): Shed Skin: Atk 289/317, SpA 269/295, Spe 341/375 — Regenerator: Atk 289/317, SpA 269/295, Spe 341/375
  Item: **free**
  STAB: Dragon Draco Meteor 140S · Normal Double-Edge 120P
  Physical coverage: Grass Power Whip 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Electric Supercell Slam 100P, Water Aqua Tail 90P, Dark Crunch 80P
  Special coverage: Fire Overheat 140S, Electric Thunderbolt 95S, Ground Mud Shot 55S

**Darmanitan** — species, **RU**, source: imported (natdex)
  Fire | BST 480 (105/140/55/30/55/95) | Abilities: Sheer Force / Zen Mode
  Engine stats @252 (neutral/positive): Sheer Force: Atk 379/416, SpA 159/174, Spe 289/317 — Zen Mode: Atk 379/416, SpA 159/174, Spe 289/317
  Item: **free**
  STAB: Fire Flare Blitz 120P
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Steel Iron Head 80P, Psychic Zen Headbutt 80P
  Special coverage: Fighting Focus Blast 120S, Psychic Future Sight 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S

**Darmanitan-Zen** — forme, **RU**, source: imported (natdex)
  Fire/Psychic | BST 540 (105/30/105/140/105/55) | Abilities: Zen Mode
  Engine stats @252 (neutral/positive): Zen Mode: Atk 379/416, SpA 159/174, Spe 289/317
  Item: **—** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Darmanitan (RU), pre-Mega abilities Sheer Force / Zen Mode, pre-Mega Spe 317 (max +Spe)
  STAB: Fire Flare Blitz 120P · Psychic Zen Headbutt 80P
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Steel Iron Head 80P, Dark Lash Out 75P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S

**Deoxys-Defense** — species, **RU**, source: imported (natdex)
  Psychic | BST 600 (50/70/160/70/160/90) | Abilities: Pressure
  Engine stats @252 (neutral/positive): Pressure: Atk 239/262, SpA 239/262, Spe 279/306
  Item: **free**
  STAB: Psychic Psycho Boost 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Meteor Mash 100P, Poison Poison Jab 80P, Dark Throat Chop 80P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Dark Dark Pulse 80S

**Diancie** — species, **RU**, source: imported (natdex)
  Rock/Fairy | BST 600 (50/100/150/100/150/50) | Abilities: Clear Body
  Engine stats @252 (neutral/positive): Clear Body: Atk 299/328, SpA 299/328, Spe 199/218
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Fairy Misty Explosion 100S
  Physical coverage: Normal Explosion 250P, Fighting Body Press 80P, Ground Bulldoze 60P, Steel Gyro Ball 27P
  Special coverage: Ground Earth Power 90S, Psychic Psychic 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Fire Mystical Fire 75S

**Diggersby** — species, **RU**, source: imported (natdex)
  Normal/Ground | BST 423 (85/56/77/50/77/78) | Abilities: Pickup / Cheek Pouch / Huge Power
  Engine stats @252 (neutral/positive): Pickup: Atk 211/232, SpA 199/218, Spe 255/280 — Cheek Pouch: Atk 211/232, SpA 199/218, Spe 255/280 — Huge Power: Atk 422/464, SpA 199/218, Spe 255/280
  Item: **free**
  STAB: Normal Last Resort 140P · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Dark Foul Play 95P, Electric Wild Charge 90P
  Special coverage: Water Surf 95S, Poison Sludge Bomb 90S, Grass Grass Knot 60S

**Donphan** — species, **RU**, source: imported (natdex)
  Ground | BST 500 (90/120/120/60/60/50) | Abilities: Sturdy / Sand Veil
  Engine stats @252 (neutral/positive): Sturdy: Atk 339/372, SpA 219/240, Spe 199/218 — Sand Veil: Atk 339/372, SpA 219/240, Spe 199/218
  Item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Rock Head Smash 150P, Normal Last Resort 140P, Poison Gunk Shot 120P, Fighting Superpower 120P, Steel Iron Tail 100P, Fairy Play Rough 90P
  Special coverage: Normal Hyper Voice 90S, Rock Ancient Power 60S, Water Water Gun 40S

**Dracozolt** — species, **RU**, source: imported (natdex)
  Electric/Dragon | BST 505 (90/100/90/80/70/75) | Abilities: Volt Absorb / Hustle / Sand Rush
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 299/328, SpA 259/284, Spe 249/273 — Hustle: Atk 448/492, SpA 259/284, Spe 249/273 — Sand Rush: Atk 299/328, SpA 259/284, Spe 249/273
  Item: **free**
  STAB: Electric Bolt Beak 170P · Dragon Outrage 120P
  Physical coverage: Normal Mega Kick 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Fire Fire Fang 65P, Flying Aerial Ace 60P
  Special coverage: Fire Fire Blast 120S, Rock Meteor Beam 120 (charge)S, Ground Earth Power 90S, Normal Round 60S

**Duraludon** — species, **RU**, source: override
  Steel/Dragon | BST 535 (70/95/115/120/50/85) | Abilities: Light Metal / Heavy Metal / Stalwart
  Engine stats @252 (neutral/positive): Light Metal: Atk 289/317, SpA 339/372, Spe 269/295 — Heavy Metal: Atk 289/317, SpA 339/372, Spe 269/295 — Stalwart: Atk 289/317, SpA 339/372, Spe 269/295
  Item: **free**
  STAB: Steel Steel Beam 140S · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Rock Stone Edge 100P, Dark Foul Play 95P, Fighting Body Press 80P, Ground Stomping Tantrum 75P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Psychic Mirror Coat fixedS

**Durant** — species, **RU**, source: imported (natdex)
  Bug/Steel | BST 484 (58/109/112/48/48/109) | Abilities: Swarm / Hustle / Truant
  Engine stats @252 (neutral/positive): Swarm: Atk 317/348, SpA 195/214, Spe 317/348 — Hustle: Atk 475/522, SpA 195/214, Spe 317/348 — Truant: Atk 317/348, SpA 195/214, Spe 317/348
  Item: **free**
  STAB: Bug First Impression 90P · Steel Iron Head 80P
  Physical coverage: Fighting Superpower 120P, Normal Return 102P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Ghost Shadow Claw 70P
  Special coverage: Grass Energy Ball 90S, Normal Hidden Power 60S

**Eelektross-Mega** — forme, **RU**, source: override
  Electric | BST 615 (85/145/80/135/90/80) | Abilities: Eelevate
  Engine stats @252 (neutral/positive): Eelevate: Atk 389/427, SpA 369/405, Spe 259/284
  Item: **Eelektrossite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Eelektross (ZU), pre-Mega abilities Levitate, pre-Mega Spe 218 (max +Spe)
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Dragon Outrage 120P, Normal Thrash 120P, Steel Iron Tail 100P, Water Aqua Tail 90P, Flying Bounce 85 (charge)P
  Special coverage: Fire Flamethrower 95S, Dragon Dragon Pulse 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Bug Signal Beam 75S

**Empoleon** — species, **RU**, source: imported (natdex)
  Water/Steel | BST 530 (84/86/88/111/101/60) | Abilities: Torrent / Competitive / Defiant
  Engine stats @252 (neutral/positive): Torrent: Atk 271/298, SpA 321/353, Spe 219/240 — Competitive: Atk 271/298, SpA 321/353, Spe 219/240 — Defiant: Atk 271/298, SpA 321/353, Spe 219/240
  Item: **free**
  STAB: Water Hydro Pump 120S · Steel Steel Beam 140S
  Physical coverage: Normal Double-Edge 120P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Ice Ice Spinner 80P, Dark Throat Chop 80P, Fighting Brick Break 75P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Flying Air Slash 75S, Bug Signal Beam 75S, Grass Grass Knot 60S, Fairy Disarming Voice 40S

**Enamorus-Therian** — species, **RU**, source: imported (natdex)
  Fairy/Flying | BST 580 (74/115/110/135/100/46) | Abilities: Overcoat
  Engine stats @252 (neutral/positive): Overcoat: Atk 329/361, SpA 369/405, Spe 191/210
  Item: **free**
  STAB: Fairy Misty Explosion 100S · Flying Fly 90 (charge)P
  Physical coverage: Dragon Outrage 120P, Fighting Superpower 120P, Normal Take Down 90P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Ghost Astonish 30P
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Fire Mystical Fire 75S

**Entei** — species, **RU**, source: imported (natdex)
  Fire | BST 580 (115/115/85/90/75/100) | Abilities: Pressure / Inner Focus / Flash Fire
  Engine stats @252 (neutral/positive): Pressure: Atk 329/361, SpA 279/306, Spe 299/328 — Inner Focus: Atk 329/361, SpA 279/306, Spe 299/328 — Flash Fire: Atk 329/361, SpA 279/306, Spe 299/328
  Item: **free**
  STAB: Fire Eruption 150S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Scorching Sands 70S, Dark Snarl 55S

**Falinks-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one shown)_
  Fighting | BST 570 (65/135/135/70/65/100) | Abilities: Defiant
  Engine stats @252 (neutral/positive): Defiant: Atk 369/405, SpA 239/262, Spe 299/328
  Item: **Falinksite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Falinks (ZU), pre-Mega abilities Battle Armor / Defiant, pre-Mega Spe 273 (max +Spe)
  STAB: Fighting Close Combat 120P
  Physical coverage: Bug Megahorn 120P, Ground High Horsepower 95P, Normal Take Down 90P, Steel Iron Head 80P, Poison Poison Jab 80P, Dark Throat Chop 80P
  Special coverage: Normal Uproar 90S

**Feraligatr** — species, **RU**, source: imported (natdex)
  Water | BST 530 (85/105/100/79/83/78) | Abilities: Torrent / Sheer Force
  Engine stats @252 (neutral/positive): Torrent: Atk 309/339, SpA 257/282, Spe 255/280 — Sheer Force: Atk 309/339, SpA 257/282, Spe 255/280
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Dragon Dragon Pulse 90S, Normal Uproar 90S, Rock Ancient Power 60S, Dark Snarl 55S

**Fezandipiti** — species, **RU**, source: imported (natdex)
  Poison/Fairy | BST 555 (88/91/82/70/125/99) | Abilities: Toxic Chain / Technician
  Engine stats @252 (neutral/positive): Toxic Chain: Atk 281/309, SpA 239/262, Spe 297/326 — Technician: Atk 281/309, SpA 239/262, Spe 297/326
  Item: **free**
  STAB: Poison Gunk Shot 120P · Fairy Moonblast 95S
  Physical coverage: Flying Brave Bird 120P, Fighting Double Kick 50x2P, Normal Take Down 90P, Dark Lash Out 75P, Ghost Shadow Claw 70P, Bug U-turn 70P
  Special coverage: Flying Hurricane 120S, Fire Heat Wave 100S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Ice Icy Wind 55S

**Forretress** — species, **RU**, source: imported (natdex)
  Bug/Steel | BST 465 (75/90/140/60/60/40) | Abilities: Sturdy / Overcoat
  Engine stats @252 (neutral/positive): Sturdy: Atk 279/306, SpA 219/240, Spe 179/196 — Overcoat: Atk 279/306, SpA 219/240, Spe 179/196
  Item: **free**
  STAB: Bug Bug Buzz 90S · Steel Steel Beam 140S
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Rock Stone Edge 100P, Fighting Body Press 80P, Ice Ice Spinner 80P, Poison Poison Jab 80P
  Special coverage: Electric Zap Cannon 120S, Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Normal Tera Blast 80S, Poison Venoshock 65S

**Froslass-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one shown)_
  Ice/Ghost | BST 580 (70/80/70/140/100/120) | Abilities: Snow Warning
  Engine stats @252 (neutral/positive): Snow Warning: Atk 259/284, SpA 379/416, Spe 339/372
  Item: **Froslassite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Froslass (ZU), pre-Mega abilities Snow Cloak / Cursed Body, pre-Mega Spe 350 (max +Spe)
  STAB: Ice Blizzard 120S · Ghost Shadow Ball 80S
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Fighting Wake-Up Slap 70P, Grass Trailblaze 50P, Rock Rollout 30P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Normal Tera Blast 80S, Bug Signal Beam 75S, Water Water Pulse 60S, Fairy Draining Kiss 50S

**Gallade** — species, **RU**, source: imported (natdex)
  Psychic/Fighting | BST 518 (68/125/65/65/115/80) | Abilities: Steadfast / Sharpness / Justified
  Engine stats @252 (neutral/positive): Steadfast: Atk 349/383, SpA 229/251, Spe 259/284 — Sharpness: Atk 349/383, SpA 229/251, Spe 259/284 — Justified: Atk 349/383, SpA 229/251, Spe 259/284
  Item: **free**
  STAB: Psychic Zen Headbutt 80P · Fighting Focus Punch 150P
  Physical coverage: Grass Solar Blade 125 (charge)P, Normal Double-Edge 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Poison Poison Jab 80P
  Special coverage: Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Flying Air Slash 75S

**Gardevoir** — species, **RU**, source: imported (natdex)
  Psychic/Fairy | BST 518 (68/65/65/125/115/80) | Abilities: Synchronize / Trace / Telepathy
  Engine stats @252 (neutral/positive): Synchronize: Atk 229/251, SpA 349/383, Spe 259/284 — Trace: Atk 229/251, SpA 349/383, Spe 259/284 — Telepathy: Atk 229/251, SpA 349/383, Spe 259/284
  Item: **free**
  STAB: Psychic Future Sight 120S · Fairy Misty Explosion 100S
  Physical coverage: Normal Double-Edge 120P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Dark Knock Off 65P, Ghost Shadow Sneak 40P
  Special coverage: Fighting Focus Blast 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S

**Garganacl** — species, **RU**, source: imported (natdex)
  Rock | BST 500 (100/100/130/45/90/35) | Abilities: Purifying Salt / Sturdy / Clear Body
  Engine stats @252 (neutral/positive): Purifying Salt: Atk 299/328, SpA 189/207, Spe 169/185 — Sturdy: Atk 299/328, SpA 189/207, Spe 169/185 — Clear Body: Atk 299/328, SpA 189/207, Spe 169/185
  Item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Steel Heavy Slam 120P, Ground Earthquake 100P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Ground Earth Power 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S

**Gastrodon** — species, **RU**, source: imported (natdex)
  Water/Ground | BST 475 (111/83/68/92/82/39) | Abilities: Sticky Hold / Storm Drain / Sand Force
  Engine stats @252 (neutral/positive): Sticky Hold: Atk 265/291, SpA 283/311, Spe 177/194 — Storm Drain: Atk 265/291, SpA 283/311, Spe 177/194 — Sand Force: Atk 265/291, SpA 283/311, Spe 177/194
  Item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Normal Return 102P, Rock Stone Edge 100P, Bug Skitter Smack 70P, Fighting Rock Smash 40P
  Special coverage: Normal Trump Card 200S, Ice Blizzard 120S, Poison Sludge Wave 95S, Rock Ancient Power 60S, Bug Infestation 20S, Psychic Mirror Coat fixedS

**Golisopod** — species, **RU**, source: imported (natdex)
  Bug/Water | BST 530 (75/125/140/60/90/40) | Abilities: Emergency Exit
  Engine stats @252 (neutral/positive): Emergency Exit: Atk 349/383, SpA 219/240, Spe 179/196
  Item: **free**
  STAB: Bug First Impression 90P · Water Liquidation 85P
  Physical coverage: Fighting Close Combat 120P, Normal Return 102P, Dragon Dual Chop 50x2P, Ground Drill Run 80P, Steel Iron Head 80P, Poison Poison Jab 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Dark Dark Pulse 80S, Normal Hidden Power 60S, Ground Mud Shot 55S

**Golurk-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads PU — the base's; the enforced tier is the one shown)_
  Ground/Ghost | BST 583 (89/159/105/70/105/55) | Abilities: Unseen Fist
  Engine stats @252 (neutral/positive): Unseen Fist: Atk 417/458, SpA 239/262, Spe 209/229
  Item: **Golurkite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Golurk (PU), pre-Mega abilities Iron Fist / Klutz / No Guard, pre-Mega Spe 229 (max +Spe)
  STAB: Ground Earthquake 100P · Ghost Poltergeist 110P
  Physical coverage: Normal Self-Destruct 200P, Fighting Focus Punch 150P, Fire Heat Crash 120P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Electric Thunderbolt 95S, Psychic Psychic 90S, Steel Flash Cannon 80S

**Houndoom-Mega** — forme, **RU**, source: imported (natdex)
  Dark/Fire | BST 600 (75/90/90/140/90/115) | Abilities: Solar Power
  Engine stats @252 (neutral/positive): Solar Power: Atk 279/306, SpA 379/416, Spe 329/361
  Item: **Houndoominite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Houndoom (ZU), pre-Mega abilities Early Bird / Flash Fire / Unnerve, pre-Mega Spe 317 (max +Spe)
  STAB: Dark Dark Pulse 80S · Fire Overheat 140S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P, Electric Thunder Fang 65P, Grass Trailblaze 50P, Fighting Rock Smash 40P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Hyper Voice 90S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S, Ground Mud Shot 55S

**Infernape** — species, **RU**, source: override
  Fire/Fighting | BST 534 (76/104/71/104/71/108) | Abilities: Blaze / Iron Fist
  Engine stats @252 (neutral/positive): Blaze: Atk 307/337, SpA 307/337, Spe 315/346 — Iron Fist: Atk 307/337, SpA 307/337, Spe 315/346
  Item: **free**
  STAB: Fire Overheat 140S · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Ground Scorching Sands 70S

**Iron Jugulis** — species, **RU**, source: imported (natdex)
  Dark/Flying | BST 570 (94/80/86/122/80/108) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 259/284, SpA 343/377, Spe 315/346
  Item: **free**
  STAB: Dark Crunch 80P · Flying Hurricane 120S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Bug U-turn 70P, Fire Fire Fang 65P
  Special coverage: Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Rock Meteor Beam 120 (charge)S, Dragon Dragon Pulse 90S, Ground Earth Power 90S

**Iron Thorns** — species, **RU**, source: imported (natdex)
  Rock/Electric | BST 570 (100/134/110/70/84/72) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 367/403, SpA 239/262, Spe 243/267
  Item: **free**
  STAB: Rock Stone Edge 100P · Electric Supercell Slam 100P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Ground Earthquake 100P, Fighting Body Press 80P, Dark Crunch 80P, Dragon Dragon Claw 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Ground Earth Power 90S, Normal Tera Blast 80S, Dark Snarl 55S

**Kleavor** — species, **RU**, source: imported (natdex)
  Bug/Rock | BST 500 (70/135/95/45/70/85) | Abilities: Swarm / Sheer Force / Sharpness
  Engine stats @252 (neutral/positive): Swarm: Atk 369/405, SpA 189/207, Spe 269/295 — Sheer Force: Atk 369/405, SpA 189/207, Spe 269/295 — Sharpness: Atk 369/405, SpA 189/207, Spe 269/295
  Item: **free**
  STAB: Bug Lunge 80P · Rock Stone Edge 100P
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Flying Acrobatics 110P, Poison Cross Poison 70P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Ghost Ominous Wind 60S, Fighting Vacuum Wave 40S

**Krookodile** — species, **RU**, source: imported (natdex)
  Ground/Dark | BST 519 (95/117/80/65/70/92) | Abilities: Intimidate / Moxie / Anger Point
  Engine stats @252 (neutral/positive): Intimidate: Atk 333/366, SpA 229/251, Spe 283/311 — Moxie: Atk 333/366, SpA 229/251, Spe 283/311 — Anger Point: Atk 333/366, SpA 229/251, Spe 283/311
  Item: **free**
  STAB: Ground Earthquake 100P · Dark Foul Play 95P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Poison Gunk Shot 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Fighting Focus Blast 120S, Dragon Dragon Pulse 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Grass Grass Knot 60S, Fire Incinerate 60S

**Latias** — species, **RU**, source: imported (natdex)
  Dragon/Psychic | BST 600 (80/80/90/110/130/110) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 259/284, SpA 319/350, Spe 319/350
  Item: **free**
  STAB: Dragon Draco Meteor 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Water Liquidation 85P, Dark Sucker Punch 80P, Ghost Shadow Claw 70P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Water Surf 95S, Fighting Aura Sphere 90S, Fairy Alluring Voice 80S

**Linoone** — species, **RU**, source: imported (natdex)
  Normal | BST 420 (78/70/61/50/61/100) | Abilities: Pickup / Gluttony / Quick Feet
  Engine stats @252 (neutral/positive): Pickup: Atk 239/262, SpA 199/218, Spe 299/328 — Gluttony: Atk 239/262, SpA 199/218, Spe 299/328 — Quick Feet: Atk 239/262, SpA 199/218, Spe 299/328
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Grass Seed Bomb 80P, Dark Throat Chop 80P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Water Surf 95S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Ground Mud Shot 55S

**Lokix** — species, **RU**, source: imported (natdex)
  Bug/Dark | BST 450 (71/102/78/52/55/92) | Abilities: Swarm / Tinted Lens
  Engine stats @252 (neutral/positive): Swarm: Atk 303/333, SpA 203/223, Spe 283/311 — Tinted Lens: Atk 303/333, SpA 203/223, Spe 283/311
  Item: **free**
  STAB: Bug First Impression 90P · Dark Sucker Punch 80P
  Physical coverage: Fighting Axe Kick 120P, Normal Double-Edge 120P, Flying Bounce 85 (charge)P, Grass Trailblaze 50P, Ghost Astonish 30P
  Special coverage: Normal Tera Blast 80S

**Lucario** — species, **RU**, source: imported (natdex)
  Fighting/Steel | BST 525 (70/110/70/115/70/90) | Abilities: Steadfast / Inner Focus / Justified
  Engine stats @252 (neutral/positive): Steadfast: Atk 319/350, SpA 329/361, Spe 279/306 — Inner Focus: Atk 319/350, SpA 329/361, Spe 279/306 — Justified: Atk 319/350, SpA 329/361, Spe 279/306
  Item: **free**
  STAB: Fighting Focus Punch 150P · Steel Steel Beam 140S
  Physical coverage: Normal Mega Kick 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Fire Blaze Kick 85P, Dark Crunch 80P
  Special coverage: Dragon Dragon Pulse 90S, Psychic Psychic 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Water Water Pulse 60S

**Lycanroc-Dusk** — species, **RU**, source: imported (natdex)
  Rock | BST 487 (75/117/65/55/65/110) | Abilities: Tough Claws
  Engine stats @252 (neutral/positive): Tough Claws: Atk 333/366, SpA 209/229, Spe 319/350
  Item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Normal Last Resort 140P, Fighting Close Combat 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P
  Special coverage: Ground Earth Power 90S, Normal Hyper Voice 90S, Dark Snarl 55S

**Machamp** — species, **RU**, source: imported (natdex)
  Fighting | BST 505 (90/130/80/65/85/55) | Abilities: Guts / No Guard / Steadfast
  Engine stats @252 (neutral/positive): Guts: Atk 359/394, SpA 229/251, Spe 209/229 — No Guard: Atk 359/394, SpA 229/251, Spe 209/229 — Steadfast: Atk 359/394, SpA 229/251, Spe 209/229
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Skull Bash 130P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P, Poison Poison Jab 80P
  Special coverage: Fire Fire Blast 120S, Normal Hidden Power 60S, Ground Mud-Slap 20S

**Magnezone** — species, **RU**, source: imported (natdex)
  Electric/Steel | BST 535 (70/70/115/130/90/60) | Abilities: Magnet Pull / Sturdy / Analytic
  Engine stats @252 (neutral/positive): Magnet Pull: Atk 239/262, SpA 359/394, Spe 219/240 — Sturdy: Atk 239/262, SpA 359/394, Spe 219/240 — Analytic: Atk 239/262, SpA 359/394, Spe 219/240
  Item: **free**
  STAB: Electric Thunder 120S · Steel Steel Beam 140S
  Physical coverage: Normal Explosion 250P, Fighting Body Press 80P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S, Psychic Mirror Coat fixedS

**Malamar-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU — the base's; the enforced tier is the one shown)_
  Dark/Psychic | BST 582 (86/102/88/98/120/88) | Abilities: Contrary
  Engine stats @252 (neutral/positive): Contrary: Atk 303/333, SpA 295/324, Spe 275/302
  Item: **Malamarite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Malamar (ZU), pre-Mega abilities Contrary / Suction Cups / Infiltrator, pre-Mega Spe 269 (max +Spe)
  STAB: Dark Foul Play 95P · Psychic Future Sight 120S
  Physical coverage: Fighting Superpower 120P, Normal Return 102P, Water Liquidation 85P, Bug Lunge 80P, Rock Rock Slide 75P, Flying Aerial Ace 60P
  Special coverage: Fire Flamethrower 95S, Electric Thunderbolt 95S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Mandibuzz** — species, **RU**, source: imported (natdex)
  Dark/Flying | BST 510 (110/65/105/55/95/80) | Abilities: Big Pecks / Overcoat / Weak Armor
  Engine stats @252 (neutral/positive): Big Pecks: Atk 229/251, SpA 209/229, Spe 259/284 — Overcoat: Atk 229/251, SpA 209/229, Spe 259/284 — Weak Armor: Atk 229/251, SpA 209/229, Spe 259/284
  Item: **free**
  STAB: Dark Foul Play 95P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Ground Bone Rush 25x2-5P, Steel Steel Wing 70P, Bug U-turn 70P, Rock Rock Tomb 60P, Fighting Rock Smash 40P
  Special coverage: Fire Heat Wave 100S, Normal Uproar 90S, Ghost Shadow Ball 80S

**Manectric-Mega** — forme, **RU**, source: imported (natdex)
  Electric | BST 575 (70/75/80/135/80/135) | Abilities: Intimidate
  Engine stats @252 (neutral/positive): Intimidate: Atk 249/273, SpA 369/405, Spe 369/405
  Item: **Manectite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Manectric (ZU), pre-Mega abilities Static / Lightning Rod / Minus, pre-Mega Spe 339 (max +Spe)
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Fire Fire Fang 65P, Ice Ice Fang 65P
  Special coverage: Fire Overheat 140S, Normal Hyper Voice 90S, Bug Signal Beam 75S, Dark Snarl 55S, Ground Mud-Slap 20S

**Marowak-Alola** — species, **RU**, source: imported (natdex)
  Fire/Ghost | BST 425 (60/80/110/50/80/45) | Abilities: Cursed Body / Lightning Rod / Rock Head
  Engine stats @252 (neutral/positive): Cursed Body: Atk 259/284, SpA 199/218, Spe 189/207 — Lightning Rod: Atk 259/284, SpA 199/218, Spe 189/207 — Rock Head: Atk 259/284, SpA 199/218, Spe 189/207
  Item: **free**
  STAB: Fire Fire Blast 120S · Ghost Poltergeist 110P
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Ground Bonemerang 50x2P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Psychic Dream Eater 100S, Ground Earth Power 90S, Normal Uproar 90S

**Maushold** — species, **RU**, source: imported (natdex)
  Normal | BST 470 (74/75/70/65/75/111) | Abilities: Friend Guard / Cheek Pouch / Technician
  Engine stats @252 (neutral/positive): Friend Guard: Atk 249/273, SpA 229/251, Spe 321/353 — Cheek Pouch: Atk 249/273, SpA 229/251, Spe 321/353 — Technician: Atk 249/273, SpA 229/251, Spe 321/353
  Item: **free**
  STAB: Normal Population Bomb 20x10P
  Physical coverage: Ground Dig 100 (charge)P, Fairy Play Rough 90P, Dark Crunch 80P, Grass Seed Bomb 80P, Ghost Shadow Claw 70P, Bug U-turn 70P
  Special coverage: Grass Grass Knot 60S, Water Water Pulse 60S, Ground Mud Shot 55S

**Meloetta-Pirouette** — species, **RU**, source: override
  Normal/Fighting | BST 600 (100/128/90/77/77/128) | Abilities: Serene Grace
  Engine stats @252 (neutral/positive): Serene Grace: Atk 355/390, SpA 253/278, Spe 355/390
  Item: **free**
  STAB: Normal Last Resort 140P · Fighting Focus Punch 150P
  Physical coverage: Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Fairy Play Rough 90P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Grass Energy Ball 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Meowstic-M-Mega** — forme, **RU**, source: override
  Psychic | BST 566 (74/48/76/143/101/124) | Abilities: Trace
  Engine stats @252 (neutral/positive): Trace: Atk 195/214, SpA 385/423, Spe 347/381
  Item: **Meowsticite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Meowstic (ZU), pre-Mega abilities Keen Eye / Infiltrator / Prankster, pre-Mega Spe 337 (max +Spe)
  STAB: Psychic Dream Eater 100S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Dark Sucker Punch 80P, Grass Trailblaze 50P
  Special coverage: Electric Thunderbolt 95S, Grass Energy Ball 90S, Fairy Alluring Voice 80S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S

**Mimikyu** — species, **RU**, source: imported (natdex)
  Ghost/Fairy | BST 476 (55/90/80/50/105/96) | Abilities: Disguise
  Engine stats @252 (neutral/positive): Disguise: Atk 279/306, SpA 199/218, Spe 291/320
  Item: **free**
  STAB: Ghost Phantom Force 90 (charge)P · Fairy Play Rough 90P
  Physical coverage: Normal Last Resort 140P, Grass Wood Hammer 120P, Bug Leech Life 80P, Fighting Drain Punch 75P, Dark Feint Attack 60P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Fire Burning Jealousy 70S

**Mimikyu-Busted** — species, **RU**, source: imported (natdex)
  Ghost/Fairy | BST 476 (55/90/80/50/105/96) | Abilities: Disguise
  Engine stats @252 (neutral/positive): Disguise: Atk 279/306, SpA 199/218, Spe 291/320
  Item: **free**
  STAB: Ghost Phantom Force 90 (charge)P · Fairy Play Rough 90P
  Physical coverage: Normal Last Resort 140P, Grass Wood Hammer 120P, Bug Leech Life 80P, Fighting Drain Punch 75P, Dark Feint Attack 60P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Fire Burning Jealousy 70S

**Muk-Alola** — species, **RU**, source: imported (natdex)
  Poison/Dark | BST 500 (105/105/75/65/100/50) | Abilities: Poison Touch / Gluttony / Power of Alchemy
  Engine stats @252 (neutral/positive): Poison Touch: Atk 309/339, SpA 229/251, Spe 199/218 — Gluttony: Atk 309/339, SpA 229/251, Spe 199/218 — Power of Alchemy: Atk 309/339, SpA 229/251, Spe 199/218
  Item: **free**
  STAB: Poison Gunk Shot 120P · Dark Foul Play 95P
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Bug Lunge 80P, Psychic Zen Headbutt 80P
  Special coverage: Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Fairy Moonblast 95S, Ghost Shadow Ball 80S, Normal Tera Blast 80S

**Munkidori** — species, **RU**, source: override
  Poison/Psychic | BST 555 (88/75/66/130/90/106) | Abilities: Toxic Chain / Frisk
  Engine stats @252 (neutral/positive): Toxic Chain: Atk 249/273, SpA 359/394, Spe 311/342 — Frisk: Atk 249/273, SpA 359/394, Spe 311/342
  Item: **free**
  STAB: Poison Sludge Wave 95S · Psychic Future Sight 120S
  Physical coverage: Ghost Poltergeist 110P, Dark Lash Out 75P, Normal Facade 70P, Bug U-turn 70P, Grass Trailblaze 50P
  Special coverage: Fighting Focus Blast 120S, Normal Uproar 90S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Ground Mud-Slap 20S

**Necrozma** — species, **RU**, source: imported (natdex)
  Psychic | BST 600 (97/107/101/127/89/79) | Abilities: Prism Armor
  Engine stats @252 (neutral/positive): Prism Armor: Atk 313/344, SpA 353/388, Spe 257/282
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Dragon Outrage 120P, Normal Return 102P, Ground Earthquake 100P, Rock Stone Edge 100P, Steel Iron Head 80P, Bug X-Scissor 80P
  Special coverage: Normal Wring Out 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Fire Heat Wave 100S, Dragon Dragon Pulse 90S, Ground Earth Power 90S

**Nidoking** — species, **RU**, source: imported (natdex)
  Poison/Ground | BST 505 (81/102/77/85/75/85) | Abilities: Poison Point / Rivalry / Sheer Force
  Engine stats @252 (neutral/positive): Poison Point: Atk 303/333, SpA 269/295, Spe 269/295 — Rivalry: Atk 303/333, SpA 269/295, Spe 269/295 — Sheer Force: Atk 303/333, SpA 269/295, Spe 269/295
  Item: **free**
  STAB: Poison Sludge Wave 95S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Rock Head Smash 150P, Normal Skull Bash 130P, Bug Megahorn 120P, Dragon Outrage 120P, Steel Iron Tail 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Water Surf 95S, Dragon Dragon Pulse 90S

**Nidoqueen** — species, **RU**, source: imported (natdex)
  Poison/Ground | BST 505 (90/92/87/75/85/76) | Abilities: Poison Point / Rivalry / Sheer Force
  Engine stats @252 (neutral/positive): Poison Point: Atk 283/311, SpA 249/273, Spe 251/276 — Rivalry: Atk 283/311, SpA 249/273, Spe 251/276 — Sheer Force: Atk 283/311, SpA 249/273, Spe 251/276
  Item: **free**
  STAB: Poison Sludge Wave 95S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Water Surf 95S, Dragon Dragon Pulse 90S

**Nihilego** — species, **RU**, source: imported (natdex)
  Rock/Poison | BST 570 (109/53/47/127/131/103) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 205/225, SpA 353/388, Spe 305/335
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Poison Sludge Wave 95S
  Physical coverage: Normal Return 102P, Dark Foul Play 95P, Steel Iron Head 80P, Psychic Zen Headbutt 80P
  Special coverage: Electric Thunder 120S, Psychic Psychic 90S, Fairy Dazzling Gleam 80S, Ghost Hex 65S, Grass Grass Knot 60S, Normal Hidden Power 60S

**Noivern** — species, **RU**, source: imported (natdex)
  Flying/Dragon | BST 535 (85/70/80/97/80/123) | Abilities: Frisk / Infiltrator / Telepathy
  Engine stats @252 (neutral/positive): Frisk: Atk 239/262, SpA 293/322, Spe 345/379 — Infiltrator: Atk 239/262, SpA 293/322, Spe 345/379 — Telepathy: Atk 239/262, SpA 293/322, Spe 345/379
  Item: **free**
  STAB: Flying Sky Attack 140 (charge)P · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Electric Wild Charge 90P, Bug Leech Life 80P, Fighting Brick Break 75P, Ghost Shadow Claw 70P
  Special coverage: Normal Boomburst 140S, Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Fire Heat Wave 100S, Dark Dark Pulse 80S

**Obstagoon** — species, **RU**, source: imported (natdex)
  Dark/Normal | BST 520 (93/90/101/60/81/95) | Abilities: Reckless / Guts / Defiant
  Engine stats @252 (neutral/positive): Reckless: Atk 279/306, SpA 219/240, Spe 289/317 — Guts: Atk 279/306, SpA 219/240, Spe 289/317 — Defiant: Atk 279/306, SpA 219/240, Spe 289/317
  Item: **free**
  STAB: Dark Throat Chop 80P · Normal Last Resort 140P
  Physical coverage: Fighting Close Combat 120P, Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Grass Seed Bomb 80P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Water Surf 95S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Ground Mud Shot 55S

**Ogerpon** — species, **RU**, source: imported (natdex)
  Grass | BST 550 (80/120/84/60/96/110) | Abilities: Defiant
  Engine stats @252 (neutral/positive): Defiant: Atk 339/372, SpA 219/240, Spe 319/350
  Item: **free**
  STAB: Grass Solar Blade 125 (charge)P
  Physical coverage: Fighting Superpower 120P, Fairy Play Rough 90P, Normal Take Down 90P, Dark Throat Chop 80P, Psychic Zen Headbutt 80P, Ground Stomping Tantrum 75P
  Special coverage: Normal Tera Blast 80S

**Oricorio-Pom-Pom** — species, **RU**, source: imported (natdex)
  Electric/Flying | BST 476 (75/70/70/98/70/93) | Abilities: Dancer
  Engine stats @252 (neutral/positive): Dancer: Atk 239/262, SpA 295/324, Spe 285/313
  Item: **free**
  STAB: Electric Revelation Dance 90S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Return 102P, Steel Steel Wing 70P, Bug U-turn 70P, Grass Trailblaze 50P, Fighting Reversal 20P
  Special coverage: Fairy Alluring Voice 80S, Normal Tera Blast 80S, Ice Icy Wind 55S

**Oricorio-Sensu** — species, **RU**, source: imported (natdex)
  Ghost/Flying | BST 476 (75/70/70/98/70/93) | Abilities: Dancer
  Engine stats @252 (neutral/positive): Dancer: Atk 239/262, SpA 295/324, Spe 285/313
  Item: **free**
  STAB: Ghost Revelation Dance 90S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Return 102P, Steel Steel Wing 70P, Bug U-turn 70P, Grass Trailblaze 50P, Fighting Reversal 20P
  Special coverage: Fairy Alluring Voice 80S, Normal Tera Blast 80S, Ice Icy Wind 55S

**Pangoro** — species, **RU**, source: imported (natdex)
  Fighting/Dark | BST 495 (95/124/78/69/71/58) | Abilities: Iron Fist / Mold Breaker / Scrappy
  Engine stats @252 (neutral/positive): Iron Fist: Atk 347/381, SpA 237/260, Spe 215/236 — Mold Breaker: Atk 347/381, SpA 237/260, Spe 215/236 — Scrappy: Atk 347/381, SpA 237/260, Spe 215/236
  Item: **free**
  STAB: Fighting Focus Punch 150P · Dark Foul Play 95P
  Physical coverage: Poison Gunk Shot 120P, Normal Mega Kick 120P, Dragon Outrage 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Steel Iron Head 80P
  Special coverage: Water Surf 95S, Normal Hyper Voice 90S, Poison Sludge Bomb 90S, Grass Grass Knot 60S, Bug Infestation 20S

**Pelipper** — species, **RU**, source: imported (natdex)
  Water/Flying | BST 440 (60/50/100/95/70/65) | Abilities: Keen Eye / Drizzle / Rain Dish
  Engine stats @252 (neutral/positive): Keen Eye: Atk 199/218, SpA 289/317, Spe 229/251 — Drizzle: Atk 199/218, SpA 289/317, Spe 229/251 — Rain Dish: Atk 199/218, SpA 289/317, Spe 229/251
  Item: **free**
  STAB: Water Hydro Pump 120S · Flying Hurricane 120S
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Grass Seed Bomb 80P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Ghost Ominous Wind 60S, Electric Shock Wave 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Pidgeot-Mega** — forme, **RU**, source: imported (natdex)
  Normal/Flying | BST 579 (83/80/80/135/80/121) | Abilities: No Guard
  Engine stats @252 (neutral/positive): No Guard: Atk 259/284, SpA 369/405, Spe 341/375
  Item: **Pidgeotite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Pidgeot (ZU), pre-Mega abilities Keen Eye / Tangled Feet / Big Pecks, pre-Mega Spe 331 (max +Spe)
  STAB: Normal Uproar 90S · Flying Hurricane 120S
  Physical coverage: Steel Steel Wing 70P, Bug U-turn 70P, Dark Feint Attack 60P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Politoed** — species, **RU**, source: imported (natdex)
  Water | BST 500 (90/75/75/90/100/70) | Abilities: Water Absorb / Damp / Drizzle
  Engine stats @252 (neutral/positive): Water Absorb: Atk 249/273, SpA 279/306, Spe 239/262 — Damp: Atk 249/273, SpA 279/306, Spe 239/262 — Drizzle: Atk 249/273, SpA 279/306, Spe 239/262
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Earthquake 100P, Flying Bounce 85 (charge)P, Ice Ice Punch 75P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Ground Earth Power 90S, Normal Hyper Voice 90S, Psychic Psychic 90S

**Porygon2** — species, **RU**, source: override
  Normal | BST 515 (85/80/90/105/95/60) | Abilities: Trace / Download / Analytic
  Engine stats @252 (neutral/positive): Trace: Atk 259/284, SpA 309/339, Spe 219/240 — Download: Atk 259/284, SpA 309/339, Spe 219/240 — Analytic: Atk 259/284, SpA 309/339, Spe 219/240
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Flying Aerial Ace 60P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Quagsire** — species, **RU**, source: imported (natdex)
  Water/Ground | BST 430 (95/85/85/65/65/35) | Abilities: Damp / Water Absorb / Unaware
  Engine stats @252 (neutral/positive): Damp: Atk 269/295, SpA 229/251, Spe 169/185 — Water Absorb: Atk 269/295, SpA 229/251, Spe 169/185 — Unaware: Atk 269/295, SpA 229/251, Spe 169/185
  Item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ice Ice Punch 75P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Tera Blast 80S, Rock Ancient Power 60S, Bug Infestation 20S

**Raichu-Mega-X** — forme, **RU**, source: override
  Electric | BST 585 (60/135/95/90/95/110) | Abilities: Electric Surge
  Engine stats @252 (neutral/positive): Electric Surge: Atk 369/405, SpA 279/306, Spe 319/350
  Item: **Raichunite X** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Raichu (ZU), pre-Mega abilities Static / Lightning Rod, pre-Mega Spe 350 (max +Spe)
  STAB: Electric Rising Voltage 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Grass Grass Knot 60S

**Regidrago** — species, **RU**, source: imported (natdex)
  Dragon | BST 580 (200/100/50/100/50/80) | Abilities: Dragon's Maw
  Engine stats @252 (neutral/positive): Dragon's Maw: Atk 299/328, SpA 299/328, Spe 259/284
  Item: **free**
  STAB: Dragon Dragon Energy 150S
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Fighting Hammer Arm 100P, Dark Crunch 80P, Fire Fire Fang 65P, Ice Ice Fang 65P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S, Rock Ancient Power 60S

**Registeel** — species, **RU**, source: imported (natdex)
  Steel | BST 580 (80/75/150/75/150/50) | Abilities: Clear Body / Light Metal
  Engine stats @252 (neutral/positive): Clear Body: Atk 249/273, SpA 249/273, Spe 199/218 — Light Metal: Atk 249/273, SpA 249/273, Spe 199/218
  Item: **free**
  STAB: Steel Steel Beam 140S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Ground Earthquake 100P, Ice Ice Spinner 80P, Rock Rock Slide 75P, Electric Thunder Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Normal Tera Blast 80S, Ground Mud-Slap 20S

**Reuniclus** — species, **RU**, source: imported (natdex)
  Psychic | BST 490 (110/65/75/125/85/30) | Abilities: Overcoat / Magic Guard / Regenerator
  Engine stats @252 (neutral/positive): Overcoat: Atk 229/251, SpA 349/383, Spe 159/174 — Magic Guard: Atk 229/251, SpA 349/383, Spe 159/174 — Regenerator: Atk 229/251, SpA 349/383, Spe 159/174
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Steel Steel Roller 130P, Fire Fire Punch 75P, Ice Ice Punch 75P, Rock Rock Slide 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Energy Ball 90S, Steel Flash Cannon 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S

**Revavroom** — species, **RU**, source: imported (natdex)
  Steel/Poison | BST 500 (80/119/90/54/67/90) | Abilities: Overcoat / Filter
  Engine stats @252 (neutral/positive): Overcoat: Atk 337/370, SpA 207/227, Spe 279/306 — Filter: Atk 337/370, SpA 207/227, Spe 279/306
  Item: **free**
  STAB: Steel Hard Press 100P · Poison Gunk Shot 120P
  Physical coverage: Normal Self-Destruct 200P, Ground High Horsepower 95P, Psychic Zen Headbutt 80P, Dark Lash Out 75P, Fire Temper Flare 75P, Ghost Lick 30P
  Special coverage: Fire Overheat 140S, Normal Uproar 90S

**Ribombee** — species, **RU**, source: imported (natdex)
  Bug/Fairy | BST 464 (60/55/60/95/70/124) | Abilities: Honey Gather / Shield Dust / Sweet Veil
  Engine stats @252 (neutral/positive): Honey Gather: Atk 209/229, SpA 289/317, Spe 347/381 — Shield Dust: Atk 209/229, SpA 289/317, Spe 347/381 — Sweet Veil: Atk 209/229, SpA 289/317, Spe 347/381
  Item: **free**
  STAB: Bug Bug Buzz 90S · Fairy Moonblast 95S
  Physical coverage: Normal Last Resort 140P, Flying Acrobatics 110P, Dark Thief 60P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Tera Blast 80S

**Roserade** — species, **RU**, source: imported (natdex)
  Grass/Poison | BST 515 (60/70/65/125/105/90) | Abilities: Natural Cure / Poison Point / Technician
  Engine stats @252 (neutral/positive): Natural Cure: Atk 239/262, SpA 349/383, Spe 279/306 — Poison Point: Atk 239/262, SpA 349/383, Spe 279/306 — Technician: Atk 239/262, SpA 349/383, Spe 279/306
  Item: **free**
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Double-Edge 120P, Bug Pin Missile 25x2-5P
  Special coverage: Normal Uproar 90S, Fairy Dazzling Gleam 80S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S, Ground Mud-Slap 20S

**Sandy Shocks** — species, **RU**, source: imported (natdex)
  Electric/Ground | BST 570 (85/81/97/121/85/101) | Abilities: Protosynthesis
  Engine stats @252 (neutral/positive): Protosynthesis: Atk 261/287, SpA 341/375, Spe 301/331
  Item: **free**
  STAB: Electric Thunder 120S · Ground Earthquake 100P
  Physical coverage: Normal Take Down 90P, Fighting Body Press 80P, Steel Heavy Slam 40P
  Special coverage: Steel Flash Cannon 80S, Rock Power Gem 80S, Normal Tera Blast 80S, Psychic Mirror Coat fixedS

**Sceptile-Mega** — forme, **RU**, source: imported (natdex)
  Grass/Dragon | BST 630 (70/110/75/145/85/145) | Abilities: Lightning Rod
  Engine stats @252 (neutral/positive): Lightning Rod: Atk 319/350, SpA 389/427, Spe 389/427
  Item: **Sceptilite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Sceptile (ZU), pre-Mega abilities Overgrow / Unburden, pre-Mega Spe 372 (max +Spe)
  STAB: Grass Leaf Storm 140S · Dragon Outrage 120P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Ground Mud-Slap 20S

**Scovillain-Mega** — forme, **RU**, source: override
  Grass/Fire | BST 586 (65/138/85/138/85/75) | Abilities: Spicy Spray
  Engine stats @252 (neutral/positive): Spicy Spray: Atk 375/412, SpA 375/412, Spe 249/273
  Item: **Scovillainite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Scovillain (ZU), pre-Mega abilities Chlorophyll / Insomnia / Moody, pre-Mega Spe 273 (max +Spe)
  STAB: Grass Leaf Storm 140S · Fire Overheat 140S
  Physical coverage: Normal Take Down 90P, Dark Crunch 80P, Psychic Zen Headbutt 80P, Ground Stomping Tantrum 75P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S

**Seismitoad** — species, **RU**, source: imported (natdex)
  Water/Ground | BST 509 (105/95/75/85/75/74) | Abilities: Swift Swim / Poison Touch / Water Absorb
  Engine stats @252 (neutral/positive): Swift Swim: Atk 289/317, SpA 269/295, Spe 247/271 — Poison Touch: Atk 289/317, SpA 269/295, Spe 247/271 — Water Absorb: Atk 289/317, SpA 269/295, Spe 247/271
  Item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Grass Power Whip 120P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P, Ice Ice Punch 75P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Hyper Voice 90S, Grass Grass Knot 60S, Ice Icy Wind 55S, Bug Infestation 20S

**Sharpedo** — species, **RU**, source: imported (natdex)
  Water/Dark | BST 460 (70/120/40/95/40/95) | Abilities: Rough Skin / Speed Boost
  Engine stats @252 (neutral/positive): Rough Skin: Atk 339/372, SpA 289/317, Spe 289/317 — Speed Boost: Atk 339/372, SpA 289/317, Spe 289/317
  Item: **free**
  STAB: Water Hydro Pump 120S · Dark Crunch 80P
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Ground Earthquake 100P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Rock Ancient Power 60S, Ground Mud-Slap 20S

**Sigilyph** — species, **RU**, source: imported (natdex)
  Psychic/Flying | BST 490 (72/58/80/103/80/97) | Abilities: Wonder Skin / Magic Guard / Tinted Lens
  Engine stats @252 (neutral/positive): Wonder Skin: Atk 215/236, SpA 305/335, Spe 293/322 — Magic Guard: Atk 215/236, SpA 305/335, Spe 293/322 — Tinted Lens: Atk 215/236, SpA 305/335, Spe 293/322
  Item: **free**
  STAB: Psychic Future Sight 120S · Flying Air Slash 75S
  Physical coverage: Normal Return 102P, Steel Steel Wing 70P, Dark Thief 60P, Rock Smack Down 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Fire Heat Wave 100S, Ice Ice Beam 95S, Dark Dark Pulse 80S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S

**Sinistcha** — species, **RU**, source: imported (natdex)
  Grass/Ghost | BST 508 (71/60/106/121/80/70) | Abilities: Hospitality / Heatproof
  Engine stats @252 (neutral/positive): Hospitality: Atk 219/240, SpA 341/375, Spe 239/262 — Heatproof: Atk 219/240, SpA 341/375, Spe 239/262
  Item: **free**
  STAB: Grass Leaf Storm 140S · Ghost Shadow Ball 80S
  Physical coverage: Dark Foul Play 95P
  Special coverage: Normal Uproar 90S, Water Scald 80S

**Sirfetch’d** — species, **RU**, source: imported (natdex)
  Fighting | BST 507 (62/135/95/68/82/65) | Abilities: Steadfast / Scrappy
  Engine stats @252 (neutral/positive): Steadfast: Atk 369/405, SpA 235/258, Spe 229/251 — Scrappy: Atk 369/405, SpA 235/258, Spe 229/251
  Item: **free**
  STAB: Fighting Close Combat 120P
  Physical coverage: Normal Last Resort 140P, Flying Sky Attack 140 (charge)P, Grass Solar Blade 125 (charge)P, Steel Iron Tail 100P, Bug First Impression 90P, Poison Poison Jab 80P
  Special coverage: Normal Trump Card 200S, Fire Heat Wave 100S, Flying Air Slash 75S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Skeledirge** — species, **RU**, source: imported (natdex)
  Fire/Ghost | BST 530 (104/75/100/110/75/66) | Abilities: Blaze / Unaware
  Engine stats @252 (neutral/positive): Blaze: Atk 249/273, SpA 319/350, Spe 231/254 — Unaware: Atk 249/273, SpA 319/350, Spe 231/254
  Item: **free**
  STAB: Fire Overheat 140S · Ghost Poltergeist 110P
  Physical coverage: Dragon Outrage 120P, Ground Earthquake 100P, Normal Take Down 90P, Dark Crunch 80P, Grass Seed Bomb 80P, Psychic Zen Headbutt 80P
  Special coverage: Poison Belch 120S, Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Normal Hyper Voice 90S, Fairy Alluring Voice 80S, Dark Snarl 55S

**Slither Wing** — species, **RU**, source: imported (natdex)
  Bug/Fighting | BST 570 (85/135/79/85/105/81) | Abilities: Protosynthesis
  Engine stats @252 (neutral/positive): Protosynthesis: Atk 369/405, SpA 269/295, Spe 261/287
  Item: **free**
  STAB: Bug First Impression 90P · Fighting Close Combat 120P
  Physical coverage: Normal Double-Edge 120P, Fire Flare Blitz 120P, Flying Acrobatics 110P, Ground Earthquake 100P, Electric Wild Charge 90P, Psychic Zen Headbutt 80P
  Special coverage: Flying Hurricane 120S, Fire Heat Wave 100S, Normal Tera Blast 80S, Grass Giga Drain 75S

**Slurpuff** — species, **RU**, source: imported (natdex)
  Fairy | BST 480 (82/80/86/85/75/72) | Abilities: Sweet Veil / Unburden
  Engine stats @252 (neutral/positive): Sweet Veil: Atk 259/284, SpA 269/295, Spe 243/267 — Unburden: Atk 259/284, SpA 269/295, Spe 243/267
  Item: **free**
  STAB: Fairy Misty Explosion 100S
  Physical coverage: Normal Return 102P, Fighting Drain Punch 75P, Dark Thief 60P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Fire Flamethrower 95S, Water Surf 95S, Grass Energy Ball 90S, Normal Hidden Power 60S

**Steelix** — species, **RU**, source: imported (natdex)
  Steel/Ground | BST 510 (75/85/200/55/65/30) | Abilities: Rock Head / Sturdy / Sheer Force
  Engine stats @252 (neutral/positive): Rock Head: Atk 269/295, SpA 209/229, Spe 159/174 — Sturdy: Atk 269/295, SpA 209/229, Spe 159/174 — Sheer Force: Atk 269/295, SpA 209/229, Spe 159/174
  Item: **free**
  STAB: Steel Steel Beam 140S · Ground Earthquake 100P
  Physical coverage: Normal Explosion 250P, Rock Head Smash 150P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Fighting Body Press 80P, Dark Crunch 80P
  Special coverage: Rock Meteor Beam 120 (charge)S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Normal Hidden Power 60S

**Steelix-Mega** — forme, **RU**, source: imported (natdex)
  Steel/Ground | BST 610 (75/125/230/55/95/30) | Abilities: Sand Force
  Engine stats @252 (neutral/positive): Sand Force: Atk 349/383, SpA 209/229, Spe 159/174
  Item: **Steelixite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Steelix (RU), pre-Mega abilities Rock Head / Sturdy / Sheer Force, pre-Mega Spe 174 (max +Spe)
  STAB: Steel Steel Roller 130P · Ground Earthquake 100P
  Physical coverage: Normal Explosion 250P, Rock Head Smash 150P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Fighting Body Press 80P, Dark Crunch 80P
  Special coverage: Rock Meteor Beam 120 (charge)S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Normal Hidden Power 60S

**Suicune** — species, **RU**, source: imported (natdex)
  Water | BST 580 (100/75/115/90/115/85) | Abilities: Pressure / Inner Focus / Water Absorb
  Engine stats @252 (neutral/positive): Pressure: Atk 249/273, SpA 279/306, Spe 269/295 — Inner Focus: Atk 249/273, SpA 279/306, Spe 269/295 — Water Absorb: Atk 249/273, SpA 279/306, Spe 269/295
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Ice Ice Fang 65P, Grass Trailblaze 50P
  Special coverage: Ice Blizzard 120S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Flying Air Slash 75S, Bug Signal Beam 75S

**Swellow** — species, **RU**, source: imported (natdex)
  Normal/Flying | BST 455 (60/85/60/75/50/125) | Abilities: Guts / Scrappy
  Engine stats @252 (neutral/positive): Guts: Atk 269/295, SpA 249/273, Spe 349/383 — Scrappy: Atk 269/295, SpA 249/273, Spe 349/383
  Item: **free**
  STAB: Normal Boomburst 140S · Flying Sky Attack 140 (charge)P
  Physical coverage: Steel Steel Wing 70P, Bug U-turn 70P, Dark Thief 60P, Fighting Reversal 20P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Talonflame** — species, **RU**, source: imported (natdex)
  Fire/Flying | BST 499 (78/81/71/74/69/126) | Abilities: Flame Body / Gale Wings
  Engine stats @252 (neutral/positive): Flame Body: Atk 261/287, SpA 247/271, Spe 351/386 — Gale Wings: Atk 261/287, SpA 247/271, Spe 351/386
  Item: **free**
  STAB: Fire Overheat 140S · Flying Brave Bird 120P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Fighting Upper Hand 65P, Dark Thief 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Tera Blast 80S

**Tangrowth** — species, **RU**, source: imported (natdex)
  Grass | BST 535 (100/100/125/110/50/50) | Abilities: Chlorophyll / Leaf Guard / Regenerator
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 299/328, SpA 319/350, Spe 199/218 — Leaf Guard: Atk 299/328, SpA 319/350, Spe 199/218 — Regenerator: Atk 299/328, SpA 319/350, Spe 199/218
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Skull Bash 130P, Ground Earthquake 100P, Poison Poison Jab 80P, Fighting Brick Break 75P, Rock Rock Slide 75P, Dark Knock Off 65P
  Special coverage: Fighting Focus Blast 120S, Normal Wring Out 120S, Poison Sludge Bomb 90S, Rock Ancient Power 60S, Electric Shock Wave 60S, Psychic Confusion 50S

**Tapu Bulu** — species, **RU**, source: imported (natdex)
  Grass/Fairy | BST 570 (70/130/115/85/95/75) | Abilities: Grassy Surge / Telepathy
  Engine stats @252 (neutral/positive): Grassy Surge: Atk 359/394, SpA 269/295, Spe 249/273 — Telepathy: Atk 359/394, SpA 269/295, Spe 249/273
  Item: **free**
  STAB: Grass Wood Hammer 120P · Fairy Dazzling Gleam 80S **(wrong category)**
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Bug Megahorn 120P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground High Horsepower 95P
  Special coverage: Fighting Focus Blast 120S, Normal Hidden Power 60S, Dark Snarl 55S, Psychic Stored Power 20S

**Tatsugiri-Curly-Mega** — forme, **RU**, source: override
  Dragon/Water | BST 575 (68/65/90/135/125/92) | Abilities: Commander
  Engine stats @252 (neutral/positive): Commander: Atk 229/251, SpA 369/405, Spe 283/311
  Item: **Tatsugirinite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Tatsugiri (PU), pre-Mega abilities Commander / Storm Drain, pre-Mega Spe 289 (max +Spe)
  STAB: Dragon Draco Meteor 140S · Water Hydro Pump 120S
  Physical coverage: Normal Take Down 90P, Bug Lunge 80P, Fighting Counter fixedP
  Special coverage: Normal Tera Blast 80S, Ice Icy Wind 55S, Psychic Mirror Coat fixedS

**Tinkaton** — species, **RU**, source: imported (natdex)
  Fairy/Steel | BST 506 (85/75/77/70/105/94) | Abilities: Mold Breaker / Own Tempo / Pickpocket
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 249/273, SpA 239/262, Spe 287/315 — Own Tempo: Atk 249/273, SpA 239/262, Spe 287/315 — Pickpocket: Atk 249/273, SpA 239/262, Spe 287/315
  Item: **free**
  STAB: Fairy Play Rough 90P · Steel Gigaton Hammer 160P
  Physical coverage: Ice Ice Hammer 100P, Rock Stone Edge 100P, Dark Foul Play 95P, Normal Slam 80P, Fighting Brick Break 75P, Bug Skitter Smack 70P
  Special coverage: Normal Tera Blast 80S

**Togekiss** — species, **RU**, source: imported (natdex)
  Fairy/Flying | BST 545 (85/50/95/120/115/80) | Abilities: Hustle / Serene Grace / Super Luck
  Engine stats @252 (neutral/positive): Hustle: Atk 298/327, SpA 339/372, Spe 259/284 — Serene Grace: Atk 199/218, SpA 339/372, Spe 259/284 — Super Luck: Atk 199/218, SpA 339/372, Spe 259/284
  Item: **free**
  STAB: Fairy Play Rough 90P · Flying Sky Attack 140 (charge)P
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Psychic Zen Headbutt 80P, Steel Smart Strike 70P, Dark Fling 30P, Rock Rollout 30P
  Special coverage: Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Zap Cannon 120S, Grass Solar Beam 120 (charge)S, Fighting Aura Sphere 90S, Normal Hyper Voice 90S

**Tornadus** — species, **RU**, source: override
  Flying | BST 580 (79/115/70/125/80/111) | Abilities: Prankster / Defiant
  Engine stats @252 (neutral/positive): Prankster: Atk 329/361, SpA 349/383, Spe 321/353 — Defiant: Atk 329/361, SpA 349/383, Spe 321/353
  Item: **free**
  STAB: Flying Hurricane 120S
  Physical coverage: Fighting Superpower 120P, Normal Thrash 120P, Steel Iron Tail 100P, Dark Foul Play 95P, Bug U-turn 70P, Rock Smack Down 50P
  Special coverage: Fighting Focus Blast 120S, Fire Heat Wave 100S, Poison Sludge Wave 95S, Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S

**Torterra** — species, **RU**, source: imported (natdex)
  Grass/Ground | BST 525 (95/109/105/75/85/56) | Abilities: Overgrow / Shell Armor
  Engine stats @252 (neutral/positive): Overgrow: Atk 317/348, SpA 249/273, Spe 211/232 — Shell Armor: Atk 317/348, SpA 249/273, Spe 211/232
  Item: **free**
  STAB: Grass Leaf Storm 140S · Ground Headlong Rush 120P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Dragon Outrage 120P, Fighting Superpower 120P, Rock Stone Edge 100P, Dark Crunch 80P
  Special coverage: Normal Hyper Voice 90S

**Toxtricity** — species, **RU**, source: imported (natdex)
  Electric/Poison | BST 502 (75/98/70/114/70/75) | Abilities: Punk Rock / Plus / Technician
  Engine stats @252 (neutral/positive): Punk Rock: Atk 295/324, SpA 327/359, Spe 249/273 — Plus: Atk 295/324, SpA 327/359, Spe 249/273 — Technician: Atk 295/324, SpA 327/359, Spe 249/273
  Item: **free**
  STAB: Electric Thunder 120S · Poison Belch 120S
  Physical coverage: Normal Mega Kick 120P, Dark Throat Chop 80P, Fighting Brick Break 75P, Fire Fire Punch 75P, Grass Trailblaze 50P
  Special coverage: Normal Boomburst 140S, Psychic Psychic Noise 75S, Ghost Hex 65S, Dark Snarl 55S

**Toxtricity-Low-Key** — species, **RU**, source: imported (natdex)
  Electric/Poison | BST 502 (75/98/70/114/70/75) | Abilities: Punk Rock / Minus / Technician
  Engine stats @252 (neutral/positive): Punk Rock: Atk 295/324, SpA 327/359, Spe 249/273 — Minus: Atk 295/324, SpA 327/359, Spe 249/273 — Technician: Atk 295/324, SpA 327/359, Spe 249/273
  Item: **free**
  STAB: Electric Thunder 120S · Poison Belch 120S
  Physical coverage: Normal Mega Kick 120P, Dark Throat Chop 80P, Fighting Brick Break 75P, Fire Fire Punch 75P, Grass Trailblaze 50P
  Special coverage: Normal Boomburst 140S, Psychic Psychic Noise 75S, Ghost Hex 65S, Dark Snarl 55S

**Umbreon** — species, **RU**, source: imported (natdex)
  Dark | BST 525 (95/65/110/60/130/65) | Abilities: Synchronize / Inner Focus
  Engine stats @252 (neutral/positive): Synchronize: Atk 229/251, SpA 219/240, Spe 229/251 — Inner Focus: Atk 229/251, SpA 219/240, Spe 229/251
  Item: **free**
  STAB: Dark Foul Play 95P
  Physical coverage: Normal Last Resort 140P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Grass Trailblaze 50P
  Special coverage: Normal Trump Card 200S, Psychic Synchronoise 120S, Electric Zap Cannon 120S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Ground Mud-Slap 20S

**Victreebel-Mega** — forme, **RU**, source: override
  Grass/Poison | BST 590 (80/125/85/135/95/70) | Abilities: Innards Out
  Engine stats @252 (neutral/positive): Innards Out: Atk 349/383, SpA 369/405, Spe 239/262
  Item: **Victreebelite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Victreebel (ZU), pre-Mega abilities Chlorophyll / Gluttony, pre-Mega Spe 262 (max +Spe)
  STAB: Grass Leaf Storm 140S · Poison Belch 120S
  Physical coverage: Normal Double-Edge 120P, Bug Leech Life 80P, Dark Sucker Punch 80P
  Special coverage: Normal Wring Out 120S, Bug Infestation 20S

**Volcanion** — species, **RU**, source: imported (natdex)
  Fire/Water | BST 600 (80/110/120/130/90/70) | Abilities: Water Absorb
  Engine stats @252 (neutral/positive): Water Absorb: Atk 319/350, SpA 359/394, Spe 239/262
  Item: **free**
  STAB: Fire Overheat 140S · Water Hydro Pump 120S
  Physical coverage: Normal Explosion 250P, Fighting Superpower 120P, Ground Earthquake 100P, Steel Heavy Slam 100P, Rock Stone Edge 100P, Electric Wild Charge 90P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Poison Sludge Wave 95S, Ground Earth Power 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S

**Weezing-Galar** — species, **RU**, source: imported (natdex)
  Poison/Fairy | BST 490 (65/90/120/85/70/60) | Abilities: Levitate / Neutralizing Gas / Misty Surge
  Engine stats @252 (neutral/positive): Levitate: Atk 279/306, SpA 269/295, Spe 219/240 — Neutralizing Gas: Atk 279/306, SpA 269/295, Spe 219/240 — Misty Surge: Atk 279/306, SpA 269/295, Spe 219/240
  Item: **free**
  STAB: Poison Belch 120S · Fairy Misty Explosion 100S
  Physical coverage: Normal Explosion 250P, Dark Assurance 60P, Rock Rollout 30P, Steel Gyro Ball 24P
  Special coverage: Fire Overheat 140S, Electric Thunder 120S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Psychic Psybeam 65S

**Yanmega** — species, **RU**, source: imported (natdex)
  Bug/Flying | BST 515 (86/76/86/116/56/95) | Abilities: Speed Boost / Tinted Lens / Frisk
  Engine stats @252 (neutral/positive): Speed Boost: Atk 251/276, SpA 331/364, Spe 289/317 — Tinted Lens: Atk 251/276, SpA 331/364, Spe 289/317 — Frisk: Atk 251/276, SpA 331/364, Spe 289/317
  Item: **free**
  STAB: Bug Bug Buzz 90S · Flying Dual Wingbeat 50x2P
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Steel Steel Wing 70P, Fighting Reversal 20P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Uproar 90S, Ghost Shadow Ball 80S, Rock Ancient Power 60S, Ground Mud-Slap 20S

**Zarude** — species, **RU**, source: imported (natdex)
  Dark/Grass | BST 600 (105/120/105/70/95/105) | Abilities: Leaf Guard
  Engine stats @252 (neutral/positive): Leaf Guard: Atk 339/372, SpA 239/262, Spe 309/339
  Item: **free**
  STAB: Dark Darkest Lariat 85P · Grass Solar Blade 125 (charge)P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Rock Rock Slide 75P
  Special coverage: Normal Hyper Voice 90S, Ground Mud Shot 55S

**Zygarde-10%** — species, **RU**, source: imported (natdex)
  Dragon/Ground | BST 486 (54/100/71/61/85/115) | Abilities: Aura Break / Power Construct
  Engine stats @252 (neutral/positive): Aura Break: Atk 299/328, SpA 221/243, Spe 329/361 — Power Construct: Atk 299/328, SpA 221/243, Spe 329/361
  Item: **free**
  STAB: Dragon Outrage 120P · Ground Earthquake 100P
  Physical coverage: Fighting Superpower 120P, Normal Return 102P, Steel Iron Tail 100P, Rock Stone Edge 100P, Dark Crunch 80P, Psychic Zen Headbutt 80P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Hyper Voice 90S, Grass Grass Knot 60S, Electric Shock Wave 60S
---

## F. Estimated-forme audit

**0 RU formes carry an `estimated` tier** — Smogon never ranked
them, so a nearest-neighbour model placed them by BST and base tier. **The model
has no notion of movepool, ability or item cost**, which is exactly what it got
wrong on Mega Starmie in the UU pass. These are the softest placements in RU.

**NU has 0 estimated formes.**


---

## G. Serious NU → RU candidate evidence

**No fixed cap.** 11 of 67 NU entries tripped two or
more mechanical flags in the scan; the 11 with usable
offensive sets get a full matrix below. Flags are reasons to look, not verdicts.

### Abomasnow-Mega

_Flagged for: BST 594; setup + priority + reliable recovery._

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

Attacker: **Abomasnow-Mega**, adamant {"atk":252,"spe":252,"hp":4}, Abomasite (forced) — a **representative test set**.

| RU defender (representative test set) | Leaf Storm | Blizzard | Focus Punch | Skull Bash |
| --- | --- | --- | --- | --- |
| Bronzong (physWall, Leftovers) | 76-90 (22.5-26.6%) | 66-77 (19.5-22.8%) | 119-140 (35.2-41.4%) | 51-60 (15.1-17.8%) |
| Avalugg (physWall, Leftovers) | 318-375 (80.7-95.2%) | 136-160 (34.5-40.6%) | 170-200 (43.1-50.8%) | 73-86 (18.5-21.8%) |
| Copperajah (physWall, Leftovers) | 117-138 (26.1-30.8%) | 100-118 (22.3-26.3%) | 332-390 (74.1-87.1%) | 72-84 (16.1-18.8%) |
| Mantine (specWall, Leftovers) | 99-117 (26.5-31.3%) | 85-101 (22.7-27%) | 122-143 (32.6-38.2%) | 212-249 (56.7-66.6%) |
| Vaporeon (specWall, Leftovers) | 260-306 (56-65.9%) | 56-65 (12.1-14%) | 275-324 (59.3-69.8%) | 239-281 (51.5-60.6%) |
| Sylveon (specWall, Leftovers) | 105-123 (26.6-31.2%) | 90-106 (22.8-26.9%) | 129-152 (32.7-38.6%) | 224-264 (56.9-67%) |
| Tentacruel (specWall, Black Sludge) | 111-131 (30.5-36%) | 47-56 (12.9-15.4%) | 129-152 (35.4-41.8%) | 224-264 (61.5-72.5%) |
| Rhyperior (physWall, Leftovers) | 1119-1316 (257.8-303.2%) | 480-565 (110.6-130.2%) | 220-259 (50.7-59.7%) | 47-56 (10.8-12.9%) |
| Drapion (physWall, Leftovers) | 110-129 (32-37.5%) | 189-222 (54.9-64.5%) | 123-145 (35.8-42.2%) | 107-126 (31.1-36.6%) |
| Uxie (physWall, Leftovers) | 139-163 (39.3-46%) | 119-140 (33.6-39.5%) | 55-64 (15.5-18.1%) | 95-112 (26.8-31.6%) |
| Xatu (specWall, Leftovers) | 78-92 (23.4-27.5%) | 269-317 (80.5-94.9%) | 61-71 (18.3-21.3%) | 212-249 (63.5-74.6%) |
| Klefki (physWall, Leftovers) | 97-114 (30.5-35.8%) | 83-98 (26.1-30.8%) | 139-164 (43.7-51.6%) | 60-71 (18.9-22.3%) |
| Altaria (specWall, Leftovers) | 30-35 (8.5-9.9%) | 419-493 (118.4-139.3%) | 99-117 (28-33.1%) | 173-203 (48.9-57.3%) |
| Goodra (specWall, Leftovers) | 47-55 (12.2-14.3%) | 163-192 (42.4-50%) | 244-287 (63.5-74.7%) | 212-249 (55.2-64.8%) |
| Escavalier (physWall, Leftovers) | 41-49 (11.9-14.2%) | 71-84 (20.6-24.4%) | 127-150 (36.9-43.6%) | 55-65 (16-18.9%) |
| Duraludon (specWall, Leftovers) | 47-55 (13.7-16%) | 161-190 (46.8-55.2%) | 324-382 (94.2-111%) | 70-82 (20.3-23.8%) |
| Stakataka (physWall, Leftovers) | 172-203 (52.8-62.3%) | 74-87 (22.7-26.7%) | 305-358 (93.6-109.8%) | 16-19 (4.9-5.8%) |
| Arcanine (physWall, Leftovers) | 104-123 (27.1-32%) | 89-105 (23.2-27.3%) | 152-179 (39.6-46.6%) | 132-155 (34.4-40.4%) |
| Tsareena (physWall, Leftovers) | 88-104 (25.3-29.9%) | 304-357 (87.4-102.6%) | 133-157 (38.2-45.1%) | 116-136 (33.3-39.1%) |
| Dragalge (specWall, Black Sludge) | 27-32 (8.1-9.6%) | 188-221 (56.3-66.2%) | 99-117 (29.6-35%) | 173-203 (51.8-60.8%) |

---

### Aerodactyl

_Flagged for: Speed **394**; strong setup on a fast frame._

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

Attacker: **Aerodactyl**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Stone Edge | Sky Attack | Double-Edge | Earthquake |
| --- | --- | --- | --- | --- |
| Bronzong (physWall, Leftovers) | 59-70 (17.5-20.7%) | 83-98 (24.6-29%) | 48-55 (14.2-16.3%) | 161-189 (47.6-55.9%) |
| Avalugg (physWall, Leftovers) | 174-204 (44.2-51.8%) | 119-141 (30.2-35.8%) | 68-80 (17.3-20.3%) | 57-67 (14.5-17%) |
| Copperajah (physWall, Leftovers) | 83-98 (18.5-21.9%) | 117-137 (26.1-30.6%) | 66-78 (14.7-17.4%) | 224-263 (50-58.7%) |
| Mantine (specWall, Leftovers) | 495-582 (132.4-155.6%) | 344-405 (92-108.3%) | 197-231 (52.7-61.8%) | 0-0 (0-0%) |
| Vaporeon (specWall, Leftovers) | 278-327 (59.9-70.5%) | 388-457 (83.6-98.5%) | 222-261 (47.8-56.3%) | 185-218 (39.9-47%) |
| Sylveon (specWall, Leftovers) | 261-308 (66.2-78.2%) | 365-430 (92.6-109.1%) | 209-245 (53-62.2%) | 174-205 (44.2-52%) |
| Tentacruel (specWall, Black Sludge) | 261-308 (71.7-84.6%) | 365-430 (100.3-118.1%) | 209-245 (57.4-67.3%) | 349-410 (95.9-112.6%) |
| Rhyperior (physWall, Leftovers) | 55-65 (12.7-15%) | 78-91 (18-21%) | 44-52 (10.1-12%) | 149-175 (34.3-40.3%) |
| Drapion (physWall, Leftovers) | 126-148 (36.6-43%) | 174-205 (50.6-59.6%) | 100-117 (29.1-34%) | 167-197 (48.5-57.3%) |
| Uxie (physWall, Leftovers) | 111-131 (31.4-37%) | 156-183 (44.1-51.7%) | 88-105 (24.9-29.7%) | 74-87 (20.9-24.6%) |
| Xatu (specWall, Leftovers) | 495-582 (148.2-174.3%) | 344-405 (103-121.3%) | 197-231 (59-69.2%) | 0-0 (0-0%) |
| Klefki (physWall, Leftovers) | 70-83 (22-26.1%) | 98-115 (30.8-36.2%) | 55-66 (17.3-20.8%) | 189-223 (59.4-70.1%) |
| Altaria (specWall, Leftovers) | 404-475 (114.1-134.2%) | 282-331 (79.7-93.5%) | 161-189 (45.5-53.4%) | 0-0 (0-0%) |
| Goodra (specWall, Leftovers) | 247-291 (64.3-75.8%) | 344-405 (89.6-105.5%) | 197-231 (51.3-60.2%) | 165-193 (43-50.3%) |
| Escavalier (physWall, Leftovers) | 130-152 (37.8-44.2%) | 180-211 (52.3-61.3%) | 50-59 (14.5-17.2%) | 85-101 (24.7-29.4%) |
| Duraludon (specWall, Leftovers) | 81-96 (23.5-27.9%) | 114-133 (33.1-38.7%) | 65-76 (18.9-22.1%) | 219-258 (63.7-75%) |
| Stakataka (physWall, Leftovers) | 39-45 (12-13.8%) | 26-31 (8-9.5%) | 14-18 (4.3-5.5%) | 208-245 (63.8-75.2%) |
| Arcanine (physWall, Leftovers) | 309-364 (80.5-94.8%) | 214-252 (55.7-65.6%) | 122-144 (31.8-37.5%) | 205-241 (53.4-62.8%) |
| Tsareena (physWall, Leftovers) | 135-159 (38.8-45.7%) | 378-444 (108.6-127.6%) | 107-127 (30.7-36.5%) | 44-53 (12.6-15.2%) |
| Dragalge (specWall, Black Sludge) | 201-237 (60.2-71%) | 282-331 (84.4-99.1%) | 161-189 (48.2-56.6%) | 269-317 (80.5-94.9%) |

---

### Articuno-Galar

_Flagged for: BST 580; setup + priority + reliable recovery._

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

Attacker: **Articuno-Galar**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Future Sight | Sky Attack | Blizzard | Hyper Voice |
| --- | --- | --- | --- | --- |
| Bronzong (physWall, Leftovers) | 54-63 (16-18.6%) | 50-59 (14.8-17.5%) | 72-85 (21.3-25.1%) | 54-65 (16-19.2%) |
| Avalugg (physWall, Leftovers) | 457-539 (116-136.8%) | 72-85 (18.3-21.6%) | 152-179 (38.6-45.4%) | 228-270 (57.9-68.5%) |
| Copperajah (physWall, Leftovers) | 169-198 (37.7-44.2%) | 70-83 (15.6-18.5%) | 111-132 (24.8-29.5%) | 84-98 (18.8-21.9%) |
| Mantine (specWall, Leftovers) | 143-167 (38.2-44.7%) | 208-244 (55.6-65.2%) | 94-111 (25.1-29.7%) | 71-84 (19-22.5%) |
| Vaporeon (specWall, Leftovers) | 187-219 (40.3-47.2%) | 234-275 (50.4-59.3%) | 62-72 (13.4-15.5%) | 93-110 (20-23.7%) |
| Sylveon (specWall, Leftovers) | 150-176 (38.1-44.7%) | 219-258 (55.6-65.5%) | 100-118 (25.4-29.9%) | 75-88 (19-22.3%) |
| Tentacruel (specWall, Black Sludge) | 319-375 (87.6-103%) | 219-258 (60.2-70.9%) | 53-62 (14.6-17%) | 79-93 (21.7-25.5%) |
| Rhyperior (physWall, Leftovers) | 401-473 (92.4-109%) | 46-54 (10.6-12.4%) | 536-630 (123.5-145.2%) | 100-118 (23-27.2%) |
| Drapion (physWall, Leftovers) | 0-0 (0-0%) | 105-124 (30.5-36%) | 210-248 (61-72.1%) | 158-185 (45.9-53.8%) |
| Uxie (physWall, Leftovers) | 100-117 (28.2-33.1%) | 93-110 (26.3-31.1%) | 132-156 (37.3-44.1%) | 100-118 (28.2-33.3%) |
| Xatu (specWall, Leftovers) | 111-132 (33.2-39.5%) | 208-244 (62.3-73.1%) | 300-353 (89.8-105.7%) | 113-132 (33.8-39.5%) |
| Klefki (physWall, Leftovers) | 140-165 (44-51.9%) | 59-70 (18.6-22%) | 93-109 (29.2-34.3%) | 70-81 (22-25.5%) |
| Altaria (specWall, Leftovers) | 174-205 (49.2-57.9%) | 169-200 (47.7-56.5%) | 466-549 (131.6-155.1%) | 87-102 (24.6-28.8%) |
| Goodra (specWall, Leftovers) | 135-159 (35.2-41.4%) | 208-244 (54.2-63.5%) | 180-213 (46.9-55.5%) | 67-80 (17.4-20.8%) |
| Escavalier (physWall, Leftovers) | 119-140 (34.6-40.7%) | 109-128 (31.7-37.2%) | 79-93 (23-27%) | 59-70 (17.2-20.3%) |
| Duraludon (specWall, Leftovers) | 135-158 (39.2-45.9%) | 68-80 (19.8-23.3%) | 179-211 (52-61.3%) | 67-79 (19.5-23%) |
| Stakataka (physWall, Leftovers) | 123-145 (37.7-44.5%) | 15-18 (4.6-5.5%) | 81-96 (24.8-29.4%) | 29-36 (8.9-11%) |
| Arcanine (physWall, Leftovers) | 300-353 (78.1-91.9%) | 130-152 (33.9-39.6%) | 100-117 (26-30.5%) | 150-176 (39.1-45.8%) |
| Tsareena (physWall, Leftovers) | 253-299 (72.7-85.9%) | 228-269 (65.5-77.3%) | 339-399 (97.4-114.7%) | 127-149 (36.5-42.8%) |
| Dragalge (specWall, Black Sludge) | 313-369 (93.7-110.5%) | 169-200 (50.6-59.9%) | 209-245 (62.6-73.4%) | 78-92 (23.4-27.5%) |

---

### Basculegion

_Flagged for: setup + priority + reliable recovery; ability: Adaptability._

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

Attacker: **Basculegion**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Hydro Pump | Phantom Force | Head Smash | Double-Edge |
| --- | --- | --- | --- | --- |
| Bronzong (physWall, Leftovers) | 111-132 (32.8-39.1%) | 250-295 (74-87.3%) | 68-80 (20.1-23.7%) | 54-65 (16-19.2%) |
| Avalugg (physWall, Leftovers) | 232-273 (58.9-69.3%) | 89-105 (22.6-26.6%) | 196-231 (49.7-58.6%) | 78-92 (19.8-23.4%) |
| Copperajah (physWall, Leftovers) | 171-201 (38.2-44.9%) | 174-204 (38.8-45.5%) | 94-113 (21-25.2%) | 76-89 (17-19.9%) |
| Mantine (specWall, Leftovers) | 36-42 (9.6-11.2%) | 254-300 (67.9-80.2%) | 565-665 (151.1-177.8%) | 226-266 (60.4-71.1%) |
| Vaporeon (specWall, Leftovers) | 46-55 (9.9-11.9%) | 287-339 (61.9-73.1%) | 318-374 (68.5-80.6%) | 254-300 (54.7-64.7%) |
| Sylveon (specWall, Leftovers) | 76-91 (19.3-23.1%) | 270-318 (68.5-80.7%) | 299-352 (75.9-89.3%) | 239-282 (60.7-71.6%) |
| Tentacruel (specWall, Black Sludge) | 40-48 (11-13.2%) | 270-318 (74.2-87.4%) | 299-352 (82.1-96.7%) | 239-282 (65.7-77.5%) |
| Rhyperior (physWall, Leftovers) | 817-963 (188.2-221.9%) | 115-136 (26.5-31.3%) | 63-74 (14.5-17.1%) | 50-59 (11.5-13.6%) |
| Drapion (physWall, Leftovers) | 161-189 (46.8-54.9%) | 65-76 (18.9-22.1%) | 143-167 (41.6-48.5%) | 114-135 (33.1-39.2%) |
| Uxie (physWall, Leftovers) | 101-119 (28.5-33.6%) | 231-273 (65.3-77.1%) | 127-149 (35.9-42.1%) | 101-119 (28.5-33.6%) |
| Xatu (specWall, Leftovers) | 114-135 (34.1-40.4%) | 510-601 (152.7-179.9%) | 565-665 (169.2-199.1%) | 226-266 (67.7-79.6%) |
| Klefki (physWall, Leftovers) | 143-167 (45-52.5%) | 146-172 (45.9-54.1%) | 80-94 (25.2-29.6%) | 65-75 (20.4-23.6%) |
| Altaria (specWall, Leftovers) | 44-52 (12.4-14.7%) | 208-245 (58.8-69.2%) | 461-543 (130.2-153.4%) | 184-217 (52-61.3%) |
| Goodra (specWall, Leftovers) | 35-40 (9.1-10.4%) | 254-300 (66.1-78.1%) | 282-332 (73.4-86.5%) | 226-266 (58.9-69.3%) |
| Escavalier (physWall, Leftovers) | 122-144 (35.5-41.9%) | 133-157 (38.7-45.6%) | 146-172 (42.4-50%) | 58-68 (16.9-19.8%) |
| Duraludon (specWall, Leftovers) | 68-80 (19.8-23.3%) | 170-200 (49.4-58.1%) | 93-110 (27-32%) | 75-88 (21.8-25.6%) |
| Stakataka (physWall, Leftovers) | 253-297 (77.6-91.1%) | 80-94 (24.5-28.8%) | 44-52 (13.5-16%) | 16-20 (4.9-6.1%) |
| Arcanine (physWall, Leftovers) | 305-360 (79.4-93.8%) | 159-187 (41.4-48.7%) | 352-414 (91.7-107.8%) | 140-166 (36.5-43.2%) |
| Tsareena (physWall, Leftovers) | 65-75 (18.7-21.6%) | 140-165 (40.2-47.4%) | 154-182 (44.3-52.3%) | 123-145 (35.3-41.7%) |
| Dragalge (specWall, Black Sludge) | 40-46 (12-13.8%) | 208-245 (62.3-73.4%) | 230-271 (68.9-81.1%) | 184-217 (55.1-65%) |

---

### Glalie-Mega

_Flagged for: BST 580; setup + priority + reliable recovery._

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

Attacker: **Glalie-Mega**, jolly {"atk":252,"spe":252,"hp":4}, Glalitite (forced) — a **representative test set**.

| RU defender (representative test set) | Explosion | Steel Roller | Earthquake | Foul Play |
| --- | --- | --- | --- | --- |
| Bronzong (physWall, Leftovers) | 325-382 (96.2-113%) | 44-51 (13-15.1%) | 136-160 (40.2-47.3%) | 83-97 (24.6-28.7%) |
| Avalugg (physWall, Leftovers) | 231-272 (58.6-69%) | 126-148 (32-37.6%) | 48-57 (12.2-14.5%) | 37-44 (9.4-11.2%) |
| Copperajah (physWall, Leftovers) | 455-535 (101.6-119.4%) | 61-72 (13.6-16.1%) | 189-223 (42.2-49.8%) | 78-92 (17.4-20.5%) |
| Mantine (specWall, Leftovers) | 1343-1580 (359.1-422.5%) | 90-106 (24.1-28.3%) | 0-0 (0-0%) | 41-49 (11-13.1%) |
| Vaporeon (specWall, Leftovers) | 757-891 (163.1-192%) | 101-119 (21.8-25.6%) | 156-184 (33.6-39.7%) | 66-78 (14.2-16.8%) |
| Sylveon (specWall, Leftovers) | 1424-1675 (361.4-425.1%) | 382-450 (97-114.2%) | 147-173 (37.3-43.9%) | 31-36 (7.9-9.1%) |
| Tentacruel (specWall, Black Sludge) | 712-837 (195.6-229.9%) | 95-112 (26.1-30.8%) | 295-347 (81-95.3%) | 66-77 (18.1-21.2%) |
| Rhyperior (physWall, Leftovers) | 1203-1415 (277.2-326%) | 163-191 (37.6-44%) | 126-148 (29-34.1%) | 56-66 (12.9-15.2%) |
| Drapion (physWall, Leftovers) | 676-796 (196.5-231.4%) | 91-107 (26.5-31.1%) | 141-166 (41-48.3%) | 21-25 (6.1-7.3%) |
| Uxie (physWall, Leftovers) | 601-707 (169.8-199.7%) | 81-95 (22.9-26.8%) | 63-74 (17.8-20.9%) | 67-79 (18.9-22.3%) |
| Xatu (specWall, Leftovers) | 2686-3161 (804.2-946.4%) | 180-212 (53.9-63.5%) | 0-0 (0-0%) | 132-155 (39.5-46.4%) |
| Klefki (physWall, Leftovers) | 384-452 (120.8-142.1%) | 103-121 (32.4-38.1%) | 160-188 (50.3-59.1%) | 22-26 (6.9-8.2%) |
| Altaria (specWall, Leftovers) | 4380-5153 (1237.3-1455.6%) | 147-173 (41.5-48.9%) | 0-0 (0-0%) | 51-60 (14.4-16.9%) |
| Goodra (specWall, Leftovers) | 2686-3161 (699.5-823.2%) | 180-212 (46.9-55.2%) | 139-163 (36.2-42.4%) | 83-98 (21.6-25.5%) |
| Escavalier (physWall, Leftovers) | 350-412 (101.7-119.8%) | 47-55 (13.7-16%) | 73-86 (21.2-25%) | 62-74 (18-21.5%) |
| Duraludon (specWall, Leftovers) | 889-1046 (258.4-304.1%) | 59-70 (17.2-20.3%) | 185-218 (53.8-63.4%) | 53-62 (15.4-18%) |
| Stakataka (physWall, Leftovers) | 207-244 (63.5-74.8%) | 56-66 (17.2-20.2%) | 175-206 (53.7-63.2%) | 36-43 (11-13.2%) |
| Arcanine (physWall, Leftovers) | 416-490 (108.3-127.6%) | 56-66 (14.6-17.2%) | 173-204 (45.1-53.1%) | 62-73 (16.1-19%) |
| Tsareena (physWall, Leftovers) | 1461-1719 (419.8-494%) | 98-116 (28.2-33.3%) | 38-44 (10.9-12.6%) | 59-69 (17-19.8%) |
| Dragalge (specWall, Black Sludge) | 2190-2576 (655.7-771.3%) | 147-173 (44-51.8%) | 227-267 (68-79.9%) | 54-63 (16.2-18.9%) |

---

### Goodra

_Flagged for: BST 600; setup + priority + reliable recovery._

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

Attacker: **Goodra**, modest {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Draco Meteor | Blizzard | Fire Blast | Focus Blast |
| --- | --- | --- | --- | --- |
| Bronzong (physWall, Leftovers) | 128-150 (37.9-44.4%) | 72-85 (21.3-25.1%) | 295-347 (87.3-102.7%) | 146-172 (43.2-50.9%) |
| Avalugg (physWall, Leftovers) | 535-630 (135.8-159.9%) | 152-179 (38.6-45.4%) | 612-721 (155.3-183%) | 612-721 (155.3-183%) |
| Copperajah (physWall, Leftovers) | 197-231 (44-51.6%) | 113-132 (25.2-29.5%) | 452-531 (100.9-118.5%) | 452-531 (100.9-118.5%) |
| Mantine (specWall, Leftovers) | 166-196 (44.4-52.4%) | 94-111 (25.1-29.7%) | 46-55 (12.3-14.7%) | 46-55 (12.3-14.7%) |
| Vaporeon (specWall, Leftovers) | 218-256 (47-55.2%) | 62-72 (13.4-15.5%) | 62-72 (13.4-15.5%) | 124-146 (26.7-31.5%) |
| Sylveon (specWall, Leftovers) | 0-0 (0-0%) | 100-118 (25.4-29.9%) | 100-118 (25.4-29.9%) | 49-58 (12.4-14.7%) |
| Tentacruel (specWall, Black Sludge) | 185-218 (50.8-59.9%) | 53-62 (14.6-17%) | 53-62 (14.6-17%) | 53-62 (14.6-17%) |
| Rhyperior (physWall, Leftovers) | 469-552 (108.1-127.2%) | 538-633 (124-145.9%) | 133-157 (30.6-36.2%) | 538-633 (124-145.9%) |
| Drapion (physWall, Leftovers) | 369-434 (107.3-126.2%) | 210-248 (61-72.1%) | 210-248 (61-72.1%) | 210-248 (61-72.1%) |
| Uxie (physWall, Leftovers) | 232-274 (65.5-77.4%) | 133-157 (37.6-44.4%) | 133-157 (37.6-44.4%) | 66-78 (18.6-22%) |
| Xatu (specWall, Leftovers) | 262-309 (78.4-92.5%) | 301-354 (90.1-106%) | 150-176 (44.9-52.7%) | 37-44 (11.1-13.2%) |
| Klefki (physWall, Leftovers) | 0-0 (0-0%) | 93-110 (29.2-34.6%) | 375-442 (117.9-139%) | 187-221 (58.8-69.5%) |
| Altaria (specWall, Leftovers) | 408-481 (115.3-135.9%) | 468-551 (132.2-155.6%) | 58-68 (16.4-19.2%) | 58-68 (16.4-19.2%) |
| Goodra (specWall, Leftovers) | 317-373 (82.6-97.1%) | 182-214 (47.4-55.7%) | 45-53 (11.7-13.8%) | 91-106 (23.7-27.6%) |
| Escavalier (physWall, Leftovers) | 139-163 (40.4-47.4%) | 79-93 (23-27%) | 642-755 (186.6-219.5%) | 159-188 (46.2-54.7%) |
| Duraludon (specWall, Leftovers) | 315-371 (91.6-107.8%) | 180-211 (52.3-61.3%) | 180-211 (52.3-61.3%) | 361-425 (104.9-123.5%) |
| Stakataka (physWall, Leftovers) | 144-170 (44.2-52.1%) | 81-97 (24.8-29.8%) | 165-195 (50.6-59.8%) | 663-780 (203.4-239.3%) |
| Arcanine (physWall, Leftovers) | 351-413 (91.4-107.6%) | 100-118 (26-30.7%) | 100-118 (26-30.7%) | 200-236 (52.1-61.5%) |
| Tsareena (physWall, Leftovers) | 296-349 (85.1-100.3%) | 339-400 (97.4-114.9%) | 339-400 (97.4-114.9%) | 169-200 (48.6-57.5%) |
| Dragalge (specWall, Black Sludge) | 366-430 (109.6-128.7%) | 209-247 (62.6-74%) | 52-61 (15.6-18.3%) | 52-61 (15.6-18.3%) |

---

### Hariyama

_Flagged for: setup + priority + reliable recovery; ability: Sheer Force._

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

Attacker: **Hariyama**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Focus Punch | Double-Edge | Headlong Rush | Heavy Slam |
| --- | --- | --- | --- | --- |
| Bronzong (physWall, Leftovers) | 215-254 (63.6-75.1%) | 57-67 (16.9-19.8%) | 231-273 (68.3-80.8%) | 19-23 (5.6-6.8%) |
| Avalugg (physWall, Leftovers) | 309-364 (78.4-92.4%) | 81-97 (20.6-24.6%) | 81-97 (20.6-24.6%) | 57-67 (14.5-17%) |
| Copperajah (physWall, Leftovers) | 603-709 (134.6-158.3%) | 80-94 (17.9-21%) | 322-379 (71.9-84.6%) | 27-32 (6-7.1%) |
| Mantine (specWall, Leftovers) | 222-261 (59.4-69.8%) | 236-279 (63.1-74.6%) | 0-0 (0-0%) | 40-46 (10.7-12.3%) |
| Vaporeon (specWall, Leftovers) | 500-588 (107.8-126.7%) | 267-314 (57.5-67.7%) | 267-314 (57.5-67.7%) | 133-157 (28.7-33.8%) |
| Sylveon (specWall, Leftovers) | 235-276 (59.6-70.1%) | 250-295 (63.5-74.9%) | 250-295 (63.5-74.9%) | 503-591 (127.7-150%) |
| Tentacruel (specWall, Black Sludge) | 235-276 (64.6-75.8%) | 250-295 (68.7-81%) | 503-591 (138.2-162.4%) | 104-123 (28.6-33.8%) |
| Rhyperior (physWall, Leftovers) | 400-470 (92.2-108.3%) | 53-62 (12.2-14.3%) | 214-252 (49.3-58.1%) | 74-87 (17.1-20%) |
| Drapion (physWall, Leftovers) | 224-263 (65.1-76.5%) | 119-141 (34.6-41%) | 240-283 (69.8-82.3%) | 100-118 (29.1-34.3%) |
| Uxie (physWall, Leftovers) | 100-117 (28.2-33.1%) | 106-126 (29.9-35.6%) | 106-126 (29.9-35.6%) | 106-126 (29.9-35.6%) |
| Xatu (specWall, Leftovers) | 110-130 (32.9-38.9%) | 236-279 (70.7-83.5%) | 0-0 (0-0%) | 236-279 (70.7-83.5%) |
| Klefki (physWall, Leftovers) | 253-299 (79.6-94%) | 67-79 (21.1-24.8%) | 271-319 (85.2-100.3%) | 135-159 (42.5-50%) |
| Altaria (specWall, Leftovers) | 180-213 (50.8-60.2%) | 193-227 (54.5-64.1%) | 0-0 (0-0%) | 193-227 (54.5-64.1%) |
| Goodra (specWall, Leftovers) | 444-522 (115.6-135.9%) | 236-279 (61.5-72.7%) | 236-279 (61.5-72.7%) | 80-94 (20.8-24.5%) |
| Escavalier (physWall, Leftovers) | 231-273 (67.2-79.4%) | 61-72 (17.7-20.9%) | 123-145 (35.8-42.2%) | 61-72 (17.7-20.9%) |
| Duraludon (specWall, Leftovers) | 590-694 (171.5-201.7%) | 78-92 (22.7-26.7%) | 315-370 (91.6-107.6%) | 78-92 (22.7-26.7%) |
| Stakataka (physWall, Leftovers) | 555-652 (170.2-200%) | 18-20 (5.5-6.1%) | 297-349 (91.1-107.1%) | 26-29 (8-8.9%) |
| Arcanine (physWall, Leftovers) | 275-325 (71.6-84.6%) | 146-174 (38-45.3%) | 295-348 (76.8-90.6%) | 24-29 (6.3-7.6%) |
| Tsareena (physWall, Leftovers) | 241-286 (69.3-82.2%) | 130-152 (37.4-43.7%) | 65-75 (18.7-21.6%) | 130-152 (37.4-43.7%) |
| Dragalge (specWall, Black Sludge) | 180-213 (53.9-63.8%) | 193-227 (57.8-68%) | 387-456 (115.9-136.5%) | 130-152 (38.9-45.5%) |

---

### Inteleon

_Flagged for: setup + priority + reliable recovery; strong setup on a fast frame._

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

Attacker: **Inteleon**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Hydro Pump | Blizzard | Dark Pulse | Shadow Ball |
| --- | --- | --- | --- | --- |
| Bronzong (physWall, Leftovers) | 219-258 (64.8-76.3%) | 72-85 (21.3-25.1%) | 197-232 (58.3-68.6%) | 197-232 (58.3-68.6%) |
| Avalugg (physWall, Leftovers) | 457-539 (116-136.8%) | 152-179 (38.6-45.4%) | 204-240 (51.8-60.9%) | 204-240 (51.8-60.9%) |
| Copperajah (physWall, Leftovers) | 338-397 (75.4-88.6%) | 111-132 (24.8-29.5%) | 150-176 (33.5-39.3%) | 150-176 (33.5-39.3%) |
| Mantine (specWall, Leftovers) | 71-83 (19-22.2%) | 94-111 (25.1-29.7%) | 63-75 (16.8-20.1%) | 63-75 (16.8-20.1%) |
| Vaporeon (specWall, Leftovers) | 93-109 (20-23.5%) | 62-72 (13.4-15.5%) | 83-97 (17.9-20.9%) | 83-97 (17.9-20.9%) |
| Sylveon (specWall, Leftovers) | 150-176 (38.1-44.7%) | 100-118 (25.4-29.9%) | 33-39 (8.4-9.9%) | 67-79 (17-20.1%) |
| Tentacruel (specWall, Black Sludge) | 79-93 (21.7-25.5%) | 53-62 (14.6-17%) | 71-84 (19.5-23.1%) | 71-84 (19.5-23.1%) |
| Rhyperior (physWall, Leftovers) | 1610-1894 (371-436.4%) | 536-630 (123.5-145.2%) | 179-210 (41.2-48.4%) | 179-210 (41.2-48.4%) |
| Drapion (physWall, Leftovers) | 315-371 (91.6-107.8%) | 210-248 (61-72.1%) | 70-83 (20.3-24.1%) | 70-83 (20.3-24.1%) |
| Uxie (physWall, Leftovers) | 200-235 (56.5-66.4%) | 132-156 (37.3-44.1%) | 179-210 (50.6-59.3%) | 179-210 (50.6-59.3%) |
| Xatu (specWall, Leftovers) | 224-265 (67.1-79.3%) | 300-353 (89.8-105.7%) | 201-237 (60.2-71%) | 201-237 (60.2-71%) |
| Klefki (physWall, Leftovers) | 280-330 (88.1-103.8%) | 93-109 (29.2-34.3%) | 62-72 (19.5-22.6%) | 124-146 (39-45.9%) |
| Altaria (specWall, Leftovers) | 87-102 (24.6-28.8%) | 466-549 (131.6-155.1%) | 78-92 (22-26%) | 78-92 (22-26%) |
| Goodra (specWall, Leftovers) | 67-79 (17.4-20.6%) | 180-213 (46.9-55.5%) | 61-71 (15.9-18.5%) | 61-71 (15.9-18.5%) |
| Escavalier (physWall, Leftovers) | 239-282 (69.5-82%) | 79-93 (23-27%) | 106-126 (30.8-36.6%) | 106-126 (30.8-36.6%) |
| Duraludon (specWall, Leftovers) | 135-158 (39.2-45.9%) | 179-211 (52-61.3%) | 120-141 (34.9-41%) | 120-141 (34.9-41%) |
| Stakataka (physWall, Leftovers) | 496-583 (152.1-178.8%) | 81-96 (24.8-29.4%) | 110-130 (33.7-39.9%) | 110-130 (33.7-39.9%) |
| Arcanine (physWall, Leftovers) | 600-707 (156.3-184.1%) | 100-117 (26-30.5%) | 133-157 (34.6-40.9%) | 133-157 (34.6-40.9%) |
| Tsareena (physWall, Leftovers) | 126-149 (36.2-42.8%) | 339-399 (97.4-114.7%) | 113-133 (32.5-38.2%) | 113-133 (32.5-38.2%) |
| Dragalge (specWall, Black Sludge) | 78-92 (23.4-27.5%) | 209-245 (62.6-73.4%) | 70-81 (21-24.3%) | 70-81 (21-24.3%) |

---

### Kilowattrel

_Flagged for: Speed **383**; setup + priority + reliable recovery._

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

Attacker: **Kilowattrel**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Thunder | Brave Bird | Uproar |
| --- | --- | --- | --- |
| Bronzong (physWall, Leftovers) | 195-230 (57.7-68%) | 37-44 (10.9-13%) | 48-57 (14.2-16.9%) |
| Avalugg (physWall, Leftovers) | 405-478 (102.8-121.3%) | 54-63 (13.7-16%) | 202-239 (51.3-60.7%) |
| Copperajah (physWall, Leftovers) | 299-352 (66.7-78.6%) | 52-61 (11.6-13.6%) | 74-88 (16.5-19.6%) |
| Mantine (specWall, Leftovers) | 509-599 (136.1-160.2%) | 152-179 (40.6-47.9%) | 63-75 (16.8-20.1%) |
| Vaporeon (specWall, Leftovers) | 331-390 (71.3-84.1%) | 171-202 (36.9-43.5%) | 83-97 (17.9-20.9%) |
| Sylveon (specWall, Leftovers) | 133-157 (33.8-39.8%) | 161-189 (40.9-48%) | 67-79 (17-20.1%) |
| Tentacruel (specWall, Black Sludge) | 283-334 (77.7-91.8%) | 161-189 (44.2-51.9%) | 71-83 (19.5-22.8%) |
| Rhyperior (physWall, Leftovers) | 0-0 (0-0%) | 35-40 (8.1-9.2%) | 88-105 (20.3-24.2%) |
| Drapion (physWall, Leftovers) | 280-330 (81.4-95.9%) | 78-92 (22.7-26.7%) | 140-165 (40.7-48%) |
| Uxie (physWall, Leftovers) | 176-208 (49.7-58.8%) | 70-81 (19.8-22.9%) | 88-104 (24.9-29.4%) |
| Xatu (specWall, Leftovers) | 400-470 (119.8-140.7%) | 152-179 (45.5-53.6%) | 100-118 (29.9-35.3%) |
| Klefki (physWall, Leftovers) | 248-292 (78-91.8%) | 44-52 (13.8-16.4%) | 62-72 (19.5-22.6%) |
| Altaria (specWall, Leftovers) | 154-182 (43.5-51.4%) | 124-146 (35-41.2%) | 78-91 (22-25.7%) |
| Goodra (specWall, Leftovers) | 59-70 (15.4-18.2%) | 152-179 (39.6-46.6%) | 61-71 (15.9-18.5%) |
| Escavalier (physWall, Leftovers) | 211-249 (61.3-72.4%) | 80-94 (23.3-27.3%) | 53-62 (15.4-18%) |
| Duraludon (specWall, Leftovers) | 119-140 (34.6-40.7%) | 50-59 (14.5-17.2%) | 59-70 (17.2-20.3%) |
| Stakataka (physWall, Leftovers) | 219-258 (67.2-79.1%) | 11-14 (3.4-4.3%) | 27-32 (8.3-9.8%) |
| Arcanine (physWall, Leftovers) | 266-313 (69.3-81.5%) | 96-113 (25-29.4%) | 133-157 (34.6-40.9%) |
| Tsareena (physWall, Leftovers) | 111-132 (31.9-37.9%) | 169-198 (48.6-56.9%) | 113-132 (32.5-37.9%) |
| Dragalge (specWall, Black Sludge) | 68-81 (20.4-24.3%) | 124-146 (37.1-43.7%) | 70-81 (21-24.3%) |

---

### Meloetta

_Flagged for: BST 600; setup + priority + reliable recovery._

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

Attacker: **Meloetta**, modest {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Hyper Voice | Dream Eater | Focus Blast | Thunder |
| --- | --- | --- | --- | --- |
| Bronzong (physWall, Leftovers) | 92-109 (27.2-32.2%) | 50-59 (14.8-17.5%) | 163-192 (48.2-56.8%) | 163-192 (48.2-56.8%) |
| Avalugg (physWall, Leftovers) | 384-452 (97.5-114.7%) | 426-501 (108.1-127.2%) | 682-803 (173.1-203.8%) | 340-401 (86.3-101.8%) |
| Copperajah (physWall, Leftovers) | 141-166 (31.5-37.1%) | 157-184 (35-41.1%) | 503-591 (112.3-131.9%) | 250-295 (55.8-65.8%) |
| Mantine (specWall, Leftovers) | 119-141 (31.8-37.7%) | 132-157 (35.3-42%) | 53-62 (14.2-16.6%) | 426-501 (113.9-134%) |
| Vaporeon (specWall, Leftovers) | 157-184 (33.8-39.7%) | 174-205 (37.5-44.2%) | 139-163 (30-35.1%) | 278-327 (59.9-70.5%) |
| Sylveon (specWall, Leftovers) | 126-149 (32-37.8%) | 140-165 (35.5-41.9%) | 55-65 (14-16.5%) | 111-131 (28.2-33.2%) |
| Tentacruel (specWall, Black Sludge) | 133-157 (36.5-43.1%) | 297-351 (81.6-96.4%) | 58-68 (15.9-18.7%) | 237-279 (65.1-76.6%) |
| Rhyperior (physWall, Leftovers) | 169-197 (38.9-45.4%) | 374-440 (86.2-101.4%) | 599-704 (138-162.2%) | 0-0 (0-0%) |
| Drapion (physWall, Leftovers) | 265-312 (77-90.7%) | 0-0 (0-0%) | 235-276 (68.3-80.2%) | 235-276 (68.3-80.2%) |
| Uxie (physWall, Leftovers) | 167-197 (47.2-55.6%) | 92-109 (26-30.8%) | 74-87 (20.9-24.6%) | 148-174 (41.8-49.2%) |
| Xatu (specWall, Leftovers) | 189-222 (56.6-66.5%) | 104-123 (31.1-36.8%) | 41-49 (12.3-14.7%) | 335-395 (100.3-118.3%) |
| Klefki (physWall, Leftovers) | 117-137 (36.8-43.1%) | 130-153 (40.9-48.1%) | 208-245 (65.4-77%) | 208-245 (65.4-77%) |
| Altaria (specWall, Leftovers) | 146-172 (41.2-48.6%) | 162-191 (45.8-54%) | 65-75 (18.4-21.2%) | 130-152 (36.7-42.9%) |
| Goodra (specWall, Leftovers) | 114-133 (29.7-34.6%) | 126-149 (32.8-38.8%) | 100-118 (26-30.7%) | 49-58 (12.8-15.1%) |
| Escavalier (physWall, Leftovers) | 100-118 (29.1-34.3%) | 111-131 (32.3-38.1%) | 178-209 (51.7-60.8%) | 178-209 (51.7-60.8%) |
| Duraludon (specWall, Leftovers) | 113-132 (32.8-38.4%) | 126-148 (36.6-43%) | 401-473 (116.6-137.5%) | 100-118 (29.1-34.3%) |
| Stakataka (physWall, Leftovers) | 52-61 (16-18.7%) | 115-135 (35.3-41.4%) | 738-868 (226.4-266.3%) | 184-217 (56.4-66.6%) |
| Arcanine (physWall, Leftovers) | 252-296 (65.6-77.1%) | 279-328 (72.7-85.4%) | 223-262 (58.1-68.2%) | 223-262 (58.1-68.2%) |
| Tsareena (physWall, Leftovers) | 213-250 (61.2-71.8%) | 236-278 (67.8-79.9%) | 188-222 (54-63.8%) | 93-110 (26.7-31.6%) |
| Dragalge (specWall, Black Sludge) | 131-154 (39.2-46.1%) | 292-344 (87.4-103%) | 57-67 (17.1-20.1%) | 57-67 (17.1-20.1%) |

---

### Raikou

_Flagged for: BST 580; setup + priority + reliable recovery._

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

Attacker: **Raikou**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| RU defender (representative test set) | Thunder | Aura Sphere | Extrasensory | Scald |
| --- | --- | --- | --- | --- |
| Bronzong (physWall, Leftovers) | 208-244 (61.5-72.2%) | 104-122 (30.8-36.1%) | 22-27 (6.5-8%) | 92-109 (27.2-32.2%) |
| Avalugg (physWall, Leftovers) | 431-508 (109.4-128.9%) | 432-509 (109.6-129.2%) | 192-226 (48.7-57.4%) | 192-226 (48.7-57.4%) |
| Copperajah (physWall, Leftovers) | 318-374 (71-83.5%) | 319-375 (71.2-83.7%) | 70-83 (15.6-18.5%) | 141-167 (31.5-37.3%) |
| Mantine (specWall, Leftovers) | 540-637 (144.4-170.3%) | 33-39 (8.8-10.4%) | 59-71 (15.8-19%) | 29-35 (7.8-9.4%) |
| Vaporeon (specWall, Leftovers) | 352-414 (75.9-89.2%) | 88-104 (19-22.4%) | 78-92 (16.8-19.8%) | 39-45 (8.4-9.7%) |
| Sylveon (specWall, Leftovers) | 141-167 (35.8-42.4%) | 35-41 (8.9-10.4%) | 63-75 (16-19%) | 63-75 (16-19%) |
| Tentacruel (specWall, Black Sludge) | 301-354 (82.7-97.3%) | 37-44 (10.2-12.1%) | 135-158 (37.1-43.4%) | 33-39 (9.1-10.7%) |
| Rhyperior (physWall, Leftovers) | 0-0 (0-0%) | 380-447 (87.6-103%) | 169-198 (38.9-45.6%) | 677-796 (156-183.4%) |
| Drapion (physWall, Leftovers) | 297-351 (86.3-102%) | 149-175 (43.3-50.9%) | 0-0 (0-0%) | 132-156 (38.4-45.3%) |
| Uxie (physWall, Leftovers) | 188-222 (53.1-62.7%) | 46-55 (13-15.5%) | 41-49 (11.6-13.8%) | 84-98 (23.7-27.7%) |
| Xatu (specWall, Leftovers) | 425-500 (127.2-149.7%) | 26-31 (7.8-9.3%) | 46-55 (13.8-16.5%) | 94-111 (28.1-33.2%) |
| Klefki (physWall, Leftovers) | 263-310 (82.7-97.5%) | 132-156 (41.5-49.1%) | 58-68 (18.2-21.4%) | 118-139 (37.1-43.7%) |
| Altaria (specWall, Leftovers) | 165-193 (46.6-54.5%) | 41-48 (11.6-13.6%) | 74-87 (20.9-24.6%) | 36-42 (10.2-11.9%) |
| Goodra (specWall, Leftovers) | 63-75 (16.4-19.5%) | 63-75 (16.4-19.5%) | 57-67 (14.8-17.4%) | 28-33 (7.3-8.6%) |
| Escavalier (physWall, Leftovers) | 226-266 (65.7-77.3%) | 113-133 (32.8-38.7%) | 50-58 (14.5-16.9%) | 101-118 (29.4-34.3%) |
| Duraludon (specWall, Leftovers) | 127-149 (36.9-43.3%) | 256-301 (74.4-87.5%) | 55-66 (16-19.2%) | 55-66 (16-19.2%) |
| Stakataka (physWall, Leftovers) | 234-275 (71.8-84.4%) | 470-553 (144.2-169.6%) | 52-61 (16-18.7%) | 209-245 (64.1-75.2%) |
| Arcanine (physWall, Leftovers) | 283-332 (73.7-86.5%) | 141-166 (36.7-43.2%) | 126-148 (32.8-38.5%) | 253-297 (65.9-77.3%) |
| Tsareena (physWall, Leftovers) | 119-140 (34.2-40.2%) | 119-141 (34.2-40.5%) | 106-126 (30.5-36.2%) | 53-62 (15.2-17.8%) |
| Dragalge (specWall, Black Sludge) | 74-87 (22.2-26%) | 36-42 (10.8-12.6%) | 132-156 (39.5-46.7%) | 32-39 (9.6-11.7%) |
---

## H. Serious NU → PU candidate evidence

The 22 NU entries with the lowest combination of engine
offence, utility breadth and BST. **Low output is not a verdict** — several of
these will have a role NU cannot fill, which is what section K is for.

### Araquanid

**Araquanid** — Water/Bug, BST 454 (68/70/92/50/132/42), Water Bubble / Water Absorb, item free
Roles: hazards, recovery, setup, status | STAB: Water Hydro Pump 120S · Bug Bug Buzz 90S | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Galvantula | Bug/Electric | 472 (70/77/60/97/60/108) | Compound Eyes, Unnerve, Swarm | hazards, recovery, pivot, setup, priority, status | Rest | Bug Bug Buzz 90S · Electric Thunder 120S |
| Qwilfish | Water/Poison | 440 (65/95/85/55/55/85) | Poison Point, Swift Swim, Intimidate | hazards, recovery, pivot, setup, priority, status | Rest | Water Aqua Tail 90P · Poison Gunk Shot 120P |
| Venomoth | Bug/Poison | 450 (70/65/60/90/75/90) | Shield Dust, Tinted Lens, Wonder Skin | hazards, removal, recovery, pivot, setup, phazing, status | Rest, Roost | Bug Bug Buzz 90S · Poison Sludge Wave 95S |
| Aurorus | Rock/Ice | 521 (123/77/72/99/92/58) | Refrigerate, Snow Warning | hazards, recovery, setup, phazing, status | Rest | Rock Meteor Beam 120 (charge)S · Ice Blizzard 120S |
| Avalugg-Hisui | Ice/Rock | 514 (95/127/184/34/36/38) | Strong Jaw, Ice Body, Sturdy | hazards, removal, recovery, setup, phazing, status | Recover, Rest | Ice Mountain Gale 100P · Rock Stone Edge 100P |

---

### Kingler

**Kingler** — Water, BST 475 (55/130/115/50/50/75), Hyper Cutter / Shell Armor / Sheer Force, item free
Roles: recovery, setup, status | STAB: Water Crabhammer 100P | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Bruxish | Water/Psychic | 475 (68/105/70/70/70/92) | Dazzling, Strong Jaw, Wonder Skin | recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Psychic Synchronoise 120S |
| Floatzel | Water | 495 (85/105/55/85/50/115) | Swift Swim, Water Veil | recovery, pivot, setup, priority, phazing, status | Rest | Water Hydro Pump 120S |
| Gorebyss | Water | 485 (55/84/105/114/75/52) | Swift Swim, Hydration | recovery, pivot, setup, status | Rest | Water Hydro Pump 120S |
| Jellicent | Water/Ghost | 480 (100/60/70/85/105/60) | Water Absorb, Cursed Body, Damp | recovery, setup, status | Recover, Rest | Water Water Spout 150S · Ghost Poltergeist 110P |
| Kingdra | Water/Dragon | 540 (75/95/95/95/95/85) | Swift Swim, Sniper, Damp | recovery, pivot, setup, status | Rest | Water Hydro Pump 120S · Dragon Draco Meteor 140S |

---

### Mantine

**Mantine** — Water/Flying, BST 485 (85/40/70/80/140/70), Swift Swim / Water Absorb / Water Veil, item free
Roles: removal, recovery, setup, status | STAB: Water Hydro Pump 120S · Flying Hurricane 120S | Recovery: Rest, Roost | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Cramorant | Flying/Water | 475 (70/85/55/85/95/85) | Gulp Missile | removal, recovery, setup | Rest, Roost | Flying Brave Bird 120P · Water Hydro Pump 120S |
| Golbat | Poison/Flying | 455 (75/80/70/65/75/90) | Inner Focus, Infiltrator | removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Poison Sludge Bomb 90S · Flying Brave Bird 120P |
| Ninjask | Bug/Flying | 456 (61/90/45/50/50/160) | Speed Boost, Infiltrator | removal, recovery, pivot, setup, status | Rest, Roost | Bug Leech Life 80P · Flying Acrobatics 110P |
| Oricorio | Fire/Flying | 476 (75/70/70/98/70/93) | Dancer | removal, recovery, pivot, setup, status | Rest, Roost | Fire Revelation Dance 90S · Flying Sky Attack 140 (charge)P |
| Oricorio-Pa'u | Psychic/Flying | 476 (75/70/70/98/70/93) | Dancer | removal, recovery, pivot, setup, status | Rest, Roost | Psychic Revelation Dance 90S · Flying Sky Attack 140 (charge)P |

---

### Escavalier

**Escavalier** — Bug/Steel, BST 495 (70/135/105/60/105/20), Swarm / Shell Armor / Overcoat, item free
Roles: recovery, setup, status | STAB: Bug Megahorn 120P · Steel Iron Head 80P | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Centiskorch | Fire/Bug | 525 (100/115/65/90/90/65) | Flash Fire, White Smoke, Flame Body | recovery, setup, status | Rest | Fire Overheat 140S · Bug Bug Buzz 90S |
| Frosmoth | Ice/Bug | 475 (70/65/60/125/90/65) | Shield Dust, Ice Scales | removal, recovery, pivot, setup, status | Rest | Ice Blizzard 120S · Bug Bug Buzz 90S |
| Galvantula | Bug/Electric | 472 (70/77/60/97/60/108) | Compound Eyes, Unnerve, Swarm | hazards, recovery, pivot, setup, priority, status | Rest | Bug Bug Buzz 90S · Electric Thunder 120S |
| Lairon | Steel/Rock | 430 (60/90/140/50/50/40) | Sturdy, Rock Head, Heavy Metal | hazards, recovery, setup, phazing, status | Rest | Steel Steel Roller 130P · Rock Head Smash 150P |
| Ninjask | Bug/Flying | 456 (61/90/45/50/50/160) | Speed Boost, Infiltrator | removal, recovery, pivot, setup, status | Rest, Roost | Bug Leech Life 80P · Flying Acrobatics 110P |

---

### Doublade

**Doublade** — Steel/Ghost, BST 448 (59/110/150/45/49/35), No Guard, item free
Roles: recovery, setup, priority, status | STAB: Steel Iron Head 80P · Ghost Shadow Claw 70P | Recovery: Rest | Priority: Shadow Sneak 40P Ghost (+1)

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Corsola-Galar | Ghost | 410 (60/55/100/65/100/30) | Weak Armor, Cursed Body | hazards, recovery, setup, priority, cleric, status | Recover, Rest | Ghost Shadow Ball 80S |
| Dusclops | Ghost | 455 (40/70/130/60/130/25) | Pressure, Frisk | recovery, setup, priority, status | Rest | Ghost Poltergeist 110P |
| Mismagius | Ghost | 495 (60/60/60/105/105/105) | Levitate | recovery, setup, priority, cleric, status | Rest | Ghost Shadow Ball 80S |
| Sandslash-Alola | Ice/Steel | 450 (75/100/120/25/65/65) | Snow Cloak, Slush Rush | hazards, removal, recovery, setup, priority, status | Rest | Ice Icicle Crash 85P · Steel Steel Roller 130P |
| Togedemaru | Electric/Steel | 435 (65/98/63/40/73/96) | Iron Barbs, Lightning Rod, Sturdy | recovery, pivot, setup, priority, cleric, status | Rest | Electric Wild Charge 90P · Steel Steel Roller 130P |

---

### Exploud

**Exploud** — Normal, BST 490 (104/91/63/91/73/68), Soundproof / Scrappy, item free
Roles: recovery, setup, phazing, status | STAB: Normal Boomburst 140S | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Snorlax | Normal | 540 (160/110/65/65/110/30) | Immunity, Thick Fat, Gluttony | recovery, setup, phazing, status | Rest | Normal Self-Destruct 200P |
| Type: Null | Normal | 534 (95/95/95/95/95/59) | Battle Armor | recovery, pivot, setup, phazing, status | Rest | Normal Last Resort 140P |
| Ursaring | Normal | 500 (90/130/75/75/75/55) | Guts, Quick Feet, Unnerve | recovery, setup, phazing, status | Rest | Normal Last Resort 140P |
| Raticate-Alola | Dark/Normal | 413 (75/71/70/40/80/77) | Gluttony, Hustle, Thick Fat | recovery, pivot, setup, priority, phazing, status | Rest | Dark Crunch 80P · Normal Last Resort 140P |
| Ambipom | Normal | 482 (75/100/66/60/66/115) | Technician, Pickup, Skill Link | recovery, pivot, setup, priority, status | Rest | Normal Last Resort 140P |

---

### Grafaiai

**Grafaiai** — Poison/Normal, BST 485 (63/95/65/80/72/110), Unburden / Poison Touch / Prankster, item free
Roles: recovery, pivot, setup, status | STAB: Poison Gunk Shot 120P · Normal Double-Edge 120P | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Ambipom | Normal | 482 (75/100/66/60/66/115) | Technician, Pickup, Skill Link | recovery, pivot, setup, priority, status | Rest | Normal Last Resort 140P |
| Golbat | Poison/Flying | 455 (75/80/70/65/75/90) | Inner Focus, Infiltrator | removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Poison Sludge Bomb 90S · Flying Brave Bird 120P |
| Qwilfish | Water/Poison | 440 (65/95/85/55/55/85) | Poison Point, Swift Swim, Intimidate | hazards, recovery, pivot, setup, priority, status | Rest | Water Aqua Tail 90P · Poison Gunk Shot 120P |
| Qwilfish-Hisui | Dark/Poison | 440 (65/95/85/55/55/85) | Poison Point, Swift Swim, Intimidate | hazards, recovery, pivot, setup, priority, status | Rest | Dark Crunch 80P · Poison Gunk Shot 120P |
| Slowbro-Galar | Poison/Psychic | 490 (95/100/95/100/70/30) | Quick Draw, Own Tempo, Regenerator | recovery, pivot, setup, status | Rest, Slack Off | Poison Belch 120S · Psychic Future Sight 120S |

---

### Bronzong

**Bronzong** — Steel/Psychic, BST 500 (67/89/116/79/116/33), Levitate / Heatproof / Heavy Metal, item free
Roles: hazards, recovery, setup, status | STAB: Steel Steel Beam 140S · Psychic Future Sight 120S | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Claydol | Ground/Psychic | 500 (60/70/105/70/120/75) | Levitate | hazards, removal, recovery, pivot, setup, status | Rest | Ground Earthquake 100P · Psychic Future Sight 120S |
| Sandslash-Alola | Ice/Steel | 450 (75/100/120/25/65/65) | Snow Cloak, Slush Rush | hazards, removal, recovery, setup, priority, status | Rest | Ice Icicle Crash 85P · Steel Steel Roller 130P |
| Lairon | Steel/Rock | 430 (60/90/140/50/50/40) | Sturdy, Rock Head, Heavy Metal | hazards, recovery, setup, phazing, status | Rest | Steel Steel Roller 130P · Rock Head Smash 150P |
| Archeops | Rock/Flying | 567 (75/140/65/112/65/110) | Defeatist | hazards, removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Rock Head Smash 150P · Flying Sky Attack 140 (charge)P |
| Aurorus | Rock/Ice | 521 (123/77/72/99/92/58) | Refrigerate, Snow Warning | hazards, recovery, setup, phazing, status | Rest | Rock Meteor Beam 120 (charge)S · Ice Blizzard 120S |

---

### Indeedee

**Indeedee** — Psychic/Normal, BST 475 (60/65/55/105/95/95), Inner Focus / Synchronize / Psychic Surge, item free
Roles: recovery, setup, priority, cleric | STAB: Psychic Future Sight 120S · Normal Hyper Voice 90S | Recovery: Rest | Priority: Fake Out 40P Normal (+3)

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Gothorita | Psychic | 390 (60/45/70/75/85/55) | Frisk, Competitive, Shadow Tag | recovery, setup, priority, cleric, status | Rest | Psychic Future Sight 120S |
| Absol | Dark | 465 (65/130/60/75/60/75) | Pressure, Super Luck, Justified | recovery, pivot, setup, priority, cleric, status | Rest | Dark Foul Play 95P |
| Ambipom | Normal | 482 (75/100/66/60/66/115) | Technician, Pickup, Skill Link | recovery, pivot, setup, priority, status | Rest | Normal Last Resort 140P |
| Audino | Normal | 445 (103/60/86/60/86/50) | Healer, Regenerator, Klutz | recovery, setup, cleric, status | Rest | Normal Last Resort 140P |
| Bruxish | Water/Psychic | 475 (68/105/70/70/70/92) | Dazzling, Strong Jaw, Wonder Skin | recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Psychic Synchronoise 120S |

---

### Houndstone

**Houndstone** — Ghost, BST 488 (72/101/100/50/97/68), Sand Rush / Fluffy, item free
Roles: recovery, priority, phazing, status | STAB: Ghost Poltergeist 110P | Recovery: Rest | Priority: Shadow Sneak 40P Ghost (+1)

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Typhlosion-Hisui | Fire/Ghost | 534 (73/84/78/119/85/95) | Blaze, Frisk | recovery, setup, priority, phazing, status | Rest | Fire Eruption 150S · Ghost Poltergeist 110P |
| Druddigon | Dragon | 485 (77/120/90/60/90/48) | Rough Skin, Sheer Force, Mold Breaker | hazards, recovery, setup, priority, phazing, status | Rest | Dragon Outrage 120P |
| Dusclops | Ghost | 455 (40/70/130/60/130/25) | Pressure, Frisk | recovery, setup, priority, status | Rest | Ghost Poltergeist 110P |
| Emboar | Fire/Fighting | 528 (110/123/65/100/65/65) | Blaze, Reckless | recovery, setup, priority, phazing, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P |
| Floatzel | Water | 495 (85/105/55/85/50/115) | Swift Swim, Water Veil | recovery, pivot, setup, priority, phazing, status | Rest | Water Hydro Pump 120S |

---

### Magneton

**Magneton** — Electric/Steel, BST 465 (50/60/95/120/70/70), Magnet Pull / Sturdy / Analytic, item free
Roles: recovery, pivot, setup, status | STAB: Electric Thunder 120S · Steel Steel Beam 140S | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Togedemaru | Electric/Steel | 435 (65/98/63/40/73/96) | Iron Barbs, Lightning Rod, Sturdy | recovery, pivot, setup, priority, cleric, status | Rest | Electric Wild Charge 90P · Steel Steel Roller 130P |
| Electrode-Hisui | Electric/Grass | 490 (60/50/70/80/80/150) | Soundproof, Static, Aftermath | recovery, pivot, setup, priority, status | Rest | Electric Thunder 120S · Grass Chloroblast 150S |
| Galvantula | Bug/Electric | 472 (70/77/60/97/60/108) | Compound Eyes, Unnerve, Swarm | hazards, recovery, pivot, setup, priority, status | Rest | Bug Bug Buzz 90S · Electric Thunder 120S |
| Lanturn | Water/Electric | 460 (125/58/58/76/76/67) | Volt Absorb, Illuminate, Water Absorb | recovery, pivot, setup, priority, cleric, status | Rest | Water Hydro Pump 120S · Electric Thunder 120S |
| Rotom-Heat | Electric/Fire | 520 (50/65/107/105/107/86) | Levitate | removal, recovery, pivot, setup, priority, status | Rest | Electric Thunder 120S · Fire Overheat 140S |

---

### Tauros-Paldea-Aqua

**Tauros-Paldea-Aqua** — Fighting/Water, BST 490 (75/110/105/30/70/100), Intimidate / Anger Point / Cud Chew, item free
Roles: recovery, setup, priority, status | STAB: Fighting Close Combat 120P · Water Wave Crash 120P | Recovery: Rest | Priority: Aqua Jet 40P Water (+1)

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Bruxish | Water/Psychic | 475 (68/105/70/70/70/92) | Dazzling, Strong Jaw, Wonder Skin | recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Psychic Synchronoise 120S |
| Emboar | Fire/Fighting | 528 (110/123/65/100/65/65) | Blaze, Reckless | recovery, setup, priority, phazing, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P |
| Floatzel | Water | 495 (85/105/55/85/50/115) | Swift Swim, Water Veil | recovery, pivot, setup, priority, phazing, status | Rest | Water Hydro Pump 120S |
| Hitmonlee | Fighting | 455 (50/120/53/35/110/87) | Limber, Reckless, Unburden | removal, recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P |
| Lanturn | Water/Electric | 460 (125/58/58/76/76/67) | Volt Absorb, Illuminate, Water Absorb | recovery, pivot, setup, priority, cleric, status | Rest | Water Hydro Pump 120S · Electric Thunder 120S |

---

### Drednaw

**Drednaw** — Water/Rock, BST 485 (90/115/90/48/68/74), Strong Jaw / Shell Armor / Swift Swim, item free
Roles: hazards, recovery, setup, phazing | STAB: Water Liquidation 85P · Rock Head Smash 150P | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Aurorus | Rock/Ice | 521 (123/77/72/99/92/58) | Refrigerate, Snow Warning | hazards, recovery, setup, phazing, status | Rest | Rock Meteor Beam 120 (charge)S · Ice Blizzard 120S |
| Avalugg-Hisui | Ice/Rock | 514 (95/127/184/34/36/38) | Strong Jaw, Ice Body, Sturdy | hazards, removal, recovery, setup, phazing, status | Recover, Rest | Ice Mountain Gale 100P · Rock Stone Edge 100P |
| Lairon | Steel/Rock | 430 (60/90/140/50/50/40) | Sturdy, Rock Head, Heavy Metal | hazards, recovery, setup, phazing, status | Rest | Steel Steel Roller 130P · Rock Head Smash 150P |
| Rampardos | Rock | 495 (97/165/60/65/50/58) | Mold Breaker, Sheer Force | hazards, recovery, setup, phazing, status | Rest | Rock Head Smash 150P |
| Archeops | Rock/Flying | 567 (75/140/65/112/65/110) | Defeatist | hazards, removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Rock Head Smash 150P · Flying Sky Attack 140 (charge)P |

---

### Omastar

**Omastar** — Rock/Water, BST 495 (70/60/125/115/70/55), Swift Swim / Shell Armor / Weak Armor, item free
Roles: hazards, recovery, setup, status | STAB: Rock Meteor Beam 120 (charge)S · Water Hydro Pump 120S | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Aurorus | Rock/Ice | 521 (123/77/72/99/92/58) | Refrigerate, Snow Warning | hazards, recovery, setup, phazing, status | Rest | Rock Meteor Beam 120 (charge)S · Ice Blizzard 120S |
| Avalugg-Hisui | Ice/Rock | 514 (95/127/184/34/36/38) | Strong Jaw, Ice Body, Sturdy | hazards, removal, recovery, setup, phazing, status | Recover, Rest | Ice Mountain Gale 100P · Rock Stone Edge 100P |
| Coalossal | Rock/Fire | 510 (110/80/120/80/90/30) | Steam Engine, Flame Body, Flash Fire | hazards, removal, recovery, setup, status | Rest | Rock Meteor Beam 120 (charge)S · Fire Overheat 140S |
| Gigalith | Rock | 515 (85/135/130/60/80/25) | Sturdy, Sand Stream, Sand Force | hazards, recovery, setup, status | Rest | Rock Stone Edge 100P |
| Lairon | Steel/Rock | 430 (60/90/140/50/50/40) | Sturdy, Rock Head, Heavy Metal | hazards, recovery, setup, phazing, status | Rest | Steel Steel Roller 130P · Rock Head Smash 150P |

---

### Flamigo

**Flamigo** — Flying/Fighting, BST 500 (82/115/74/75/64/90), Scrappy / Tangled Feet / Costar, item free
Roles: recovery, pivot, setup, priority | STAB: Flying Sky Attack 140 (charge)P · Fighting Close Combat 120P | Recovery: Rest, Roost | Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2)

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Archeops | Rock/Flying | 567 (75/140/65/112/65/110) | Defeatist | hazards, removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Rock Head Smash 150P · Flying Sky Attack 140 (charge)P |
| Bombirdier | Flying/Dark | 485 (70/103/85/60/85/82) | Big Pecks, Keen Eye, Rocky Payload | hazards, recovery, pivot, setup, priority, phazing | Rest, Roost | Flying Sky Attack 140 (charge)P · Dark Foul Play 95P |
| Golbat | Poison/Flying | 455 (75/80/70/65/75/90) | Inner Focus, Infiltrator | removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Poison Sludge Bomb 90S · Flying Brave Bird 120P |
| Hitmonlee | Fighting | 455 (50/120/53/35/110/87) | Limber, Reckless, Unburden | removal, recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P |
| Passimian | Fighting | 490 (100/120/90/40/60/80) | Receiver, Defiant | recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P |

---

### Klefki

**Klefki** — Steel/Fairy, BST 470 (57/80/91/80/87/75), Prankster / Magician, item free
Roles: hazards, removal, recovery, setup, status | STAB: Steel Steel Beam 140S · Fairy Play Rough 90P | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Sandslash-Alola | Ice/Steel | 450 (75/100/120/25/65/65) | Snow Cloak, Slush Rush | hazards, removal, recovery, setup, priority, status | Rest | Ice Icicle Crash 85P · Steel Steel Roller 130P |
| Avalugg-Hisui | Ice/Rock | 514 (95/127/184/34/36/38) | Strong Jaw, Ice Body, Sturdy | hazards, removal, recovery, setup, phazing, status | Recover, Rest | Ice Mountain Gale 100P · Rock Stone Edge 100P |
| Claydol | Ground/Psychic | 500 (60/70/105/70/120/75) | Levitate | hazards, removal, recovery, pivot, setup, status | Rest | Ground Earthquake 100P · Psychic Future Sight 120S |
| Coalossal | Rock/Fire | 510 (110/80/120/80/90/30) | Steam Engine, Flame Body, Flash Fire | hazards, removal, recovery, setup, status | Rest | Rock Meteor Beam 120 (charge)S · Fire Overheat 140S |
| Lairon | Steel/Rock | 430 (60/90/140/50/50/40) | Sturdy, Rock Head, Heavy Metal | hazards, recovery, setup, phazing, status | Rest | Steel Steel Roller 130P · Rock Head Smash 150P |

---

### Vanilluxe

**Vanilluxe** — Ice, BST 535 (71/95/85/110/95/79), Ice Body / Snow Warning / Weak Armor, item free
Roles: recovery, setup, priority, status | STAB: Ice Blizzard 120S | Recovery: Rest | Priority: Ice Shard 40P Ice (+1)

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Ninetales-Alola | Ice/Fairy | 505 (73/67/75/81/100/109) | Snow Cloak, Snow Warning | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Ice Blizzard 120S · Fairy Moonblast 95S |
| Piloswine | Ice/Ground | 450 (100/100/80/60/60/50) | Oblivious, Snow Cloak, Thick Fat | hazards, recovery, setup, priority, phazing, status | Rest | Ice Icicle Crash 85P · Ground Earthquake 100P |
| Sandslash-Alola | Ice/Steel | 450 (75/100/120/25/65/65) | Snow Cloak, Slush Rush | hazards, removal, recovery, setup, priority, status | Rest | Ice Icicle Crash 85P · Steel Steel Roller 130P |
| Ambipom | Normal | 482 (75/100/66/60/66/115) | Technician, Pickup, Skill Link | recovery, pivot, setup, priority, status | Rest | Normal Last Resort 140P |
| Archeops | Rock/Flying | 567 (75/140/65/112/65/110) | Defeatist | hazards, removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Rock Head Smash 150P · Flying Sky Attack 140 (charge)P |

---

### Guzzlord

**Guzzlord** — Dark/Dragon, BST 570 (223/101/53/97/53/43), Beast Boost, item free
Roles: recovery, setup, phazing, status | STAB: Dark Crunch 80P · Dragon Draco Meteor 140S | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Zweilous | Dark/Dragon | 420 (72/85/70/65/70/58) | Hustle | recovery, setup, phazing, status | Rest | Dark Crunch 80P · Dragon Outrage 120P |
| Zoroark | Dark | 510 (60/105/60/120/60/105) | Illusion | recovery, pivot, setup, priority, phazing, status | Rest | Dark Foul Play 95P |
| Druddigon | Dragon | 485 (77/120/90/60/90/48) | Rough Skin, Sheer Force, Mold Breaker | hazards, recovery, setup, priority, phazing, status | Rest | Dragon Outrage 120P |
| Fraxure | Dragon | 410 (66/117/70/40/50/67) | Rivalry, Mold Breaker, Unnerve | recovery, setup, priority, phazing, status | Rest | Dragon Outrage 120P |
| Raticate-Alola | Dark/Normal | 413 (75/71/70/40/80/77) | Gluttony, Hustle, Thick Fat | recovery, pivot, setup, priority, phazing, status | Rest | Dark Crunch 80P · Normal Last Resort 140P |

---

### Cinccino

**Cinccino** — Normal, BST 470 (75/95/60/65/60/115), Cute Charm / Technician / Skill Link, item free
Roles: removal, recovery, pivot, setup, status | STAB: Normal Last Resort 140P | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Ambipom | Normal | 482 (75/100/66/60/66/115) | Technician, Pickup, Skill Link | recovery, pivot, setup, priority, status | Rest | Normal Last Resort 140P |
| Claydol | Ground/Psychic | 500 (60/70/105/70/120/75) | Levitate | hazards, removal, recovery, pivot, setup, status | Rest | Ground Earthquake 100P · Psychic Future Sight 120S |
| Combusken | Fire/Fighting | 405 (60/85/60/85/60/55) | Blaze, Speed Boost | removal, recovery, pivot, setup, priority, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P |
| Frosmoth | Ice/Bug | 475 (70/65/60/125/90/65) | Shield Dust, Ice Scales | removal, recovery, pivot, setup, status | Rest | Ice Blizzard 120S · Bug Bug Buzz 90S |
| Golbat | Poison/Flying | 455 (75/80/70/65/75/90) | Inner Focus, Infiltrator | removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Poison Sludge Bomb 90S · Flying Brave Bird 120P |

---

### Inteleon

**Inteleon** — Water, BST 530 (70/85/65/125/65/120), Torrent / Sniper, item free
Roles: recovery, pivot, setup, priority | STAB: Water Hydro Pump 120S | Recovery: Rest | Priority: Sucker Punch 80P Dark (+1), Aqua Jet 40P Water (+1), Ice Shard 40P Ice (+1), Vacuum Wave 40S Fighting (+1)

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Bruxish | Water/Psychic | 475 (68/105/70/70/70/92) | Dazzling, Strong Jaw, Wonder Skin | recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Psychic Synchronoise 120S |
| Floatzel | Water | 495 (85/105/55/85/50/115) | Swift Swim, Water Veil | recovery, pivot, setup, priority, phazing, status | Rest | Water Hydro Pump 120S |
| Lanturn | Water/Electric | 460 (125/58/58/76/76/67) | Volt Absorb, Illuminate, Water Absorb | recovery, pivot, setup, priority, cleric, status | Rest | Water Hydro Pump 120S · Electric Thunder 120S |
| Qwilfish | Water/Poison | 440 (65/95/85/55/55/85) | Poison Point, Swift Swim, Intimidate | hazards, recovery, pivot, setup, priority, status | Rest | Water Aqua Tail 90P · Poison Gunk Shot 120P |
| Absol | Dark | 465 (65/130/60/75/60/75) | Pressure, Super Luck, Justified | recovery, pivot, setup, priority, cleric, status | Rest | Dark Foul Play 95P |

---

### Scrafty

**Scrafty** — Dark/Fighting, BST 488 (65/90/115/45/115/58), Shed Skin / Moxie / Intimidate, item free
Roles: recovery, setup, priority, phazing, status | STAB: Dark Foul Play 95P · Fighting Focus Punch 150P | Recovery: Rest | Priority: Upper Hand 65P Fighting (+3), Fake Out 40P Normal (+3)

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Emboar | Fire/Fighting | 528 (110/123/65/100/65/65) | Blaze, Reckless | recovery, setup, priority, phazing, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P |
| Zoroark | Dark | 510 (60/105/60/120/60/105) | Illusion | recovery, pivot, setup, priority, phazing, status | Rest | Dark Foul Play 95P |
| Raticate-Alola | Dark/Normal | 413 (75/71/70/40/80/77) | Gluttony, Hustle, Thick Fat | recovery, pivot, setup, priority, phazing, status | Rest | Dark Crunch 80P · Normal Last Resort 140P |
| Virizion | Grass/Fighting | 580 (91/90/72/90/129/108) | Justified | recovery, setup, priority, phazing, status | Rest | Grass Leaf Storm 140S · Fighting Close Combat 120P |
| Absol | Dark | 465 (65/130/60/75/60/75) | Pressure, Super Luck, Justified | recovery, pivot, setup, priority, cleric, status | Rest | Dark Foul Play 95P |

---

### Drapion

**Drapion** — Poison/Dark, BST 500 (70/90/110/60/75/95), Battle Armor / Sniper / Keen Eye, item free
Roles: hazards, recovery, setup, phazing, status | STAB: Poison Sludge Bomb 90S · Dark Crunch 80P | Recovery: Rest | Priority: none

Closest NU entries by shared role, typing and BST band:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Qwilfish-Hisui | Dark/Poison | 440 (65/95/85/55/55/85) | Poison Point, Swift Swim, Intimidate | hazards, recovery, pivot, setup, priority, status | Rest | Dark Crunch 80P · Poison Gunk Shot 120P |
| Salazzle | Poison/Fire | 480 (68/64/60/111/60/117) | Corrosion, Oblivious | hazards, recovery, setup, priority, phazing, status | Rest | Poison Belch 120S · Fire Overheat 140S |
| Venomoth | Bug/Poison | 450 (70/65/60/90/75/90) | Shield Dust, Tinted Lens, Wonder Skin | hazards, removal, recovery, pivot, setup, phazing, status | Rest, Roost | Bug Bug Buzz 90S · Poison Sludge Wave 95S |
| Archeops | Rock/Flying | 567 (75/140/65/112/65/110) | Defeatist | hazards, removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Rock Head Smash 150P · Flying Sky Attack 140 (charge)P |
| Aurorus | Rock/Ice | 521 (123/77/72/99/92/58) | Refrigerate, Snow Warning | hazards, recovery, setup, phazing, status | Rest | Rock Meteor Beam 120 (charge)S · Ice Blizzard 120S |
---

## I. Offensive matchup matrices

Every matrix in section G runs against the **same NU defensive core**, built from
NU entries rather than reused from RU, so candidates compare column by column:

Bronzong (physWall), Avalugg (physWall), Copperajah (physWall), Mantine (specWall), Vaporeon (specWall), Sylveon (specWall), Tentacruel (specWall), Rhyperior (physWall), Drapion (physWall), Uxie (physWall), Xatu (specWall), Klefki (physWall), Altaria (specWall), Goodra (specWall), Escavalier (physWall), Duraludon (specWall), Stakataka (physWall), Arcanine (physWall), Tsareena (physWall), Dragalge (specWall).

Classification — hard counter, reliable counter, soft counter, check, revenge-only,
not an answer — is yours; the engine supplies damage, and recovery, speed and
hazard chip are in sections C, L, M and P.
---

## J. Defensive / revenge-kill matrices

NU's counterplay into each upward candidate. Attackers are **representative test
sets**; the target is on its own offensive spread from section G.

| Candidate | Aerodactyl Stone Edge | Raikou Thunderbolt | Infernape Mach Punch | Staraptor Brave Bird | Cinccino Tail Slap | Inteleon Hydro Pump | Tornadus Hurricane | Scrafty Upper Hand | Kilowattrel Thunderbolt | Flamigo Close Combat |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Abomasnow-Mega | 274-322 (85.1-100%) | 69-81 (21.4-25.2%) | 145-170 (45-52.8%) | 535-630 (166.1-195.7%) | 132-156 (41-48.4%) | 92-108 (28.6-33.5%) | 479-565 (148.8-175.5%) | 231-271 (71.7-84.2%) | 65-76 (20.2-23.6%) | 520-612 (161.5-190.1%) |
| Aerodactyl | 403-475 (133.4-157.3%) | 365-429 (120.9-142.1%) | 105-124 (34.8-41.1%) | 197-232 (65.2-76.8%) | 93-108 (30.8-35.8%) | 487-573 (161.3-189.7%) | 157-185 (52-61.3%) | 169-198 (56-65.6%) | 343-403 (113.6-133.4%) | 384-452 (127.2-149.7%) |
| Articuno-Galar | 326-384 (101.2-119.3%) | 288-339 (89.4-105.3%) | 20-24 (6.2-7.5%) | 319-375 (99.1-116.5%) | 156-183 (48.4-56.8%) | 192-226 (59.6-70.2%) | 249-293 (77.3-91%) | 33-40 (10.2-12.4%) | 271-319 (84.2-99.1%) | 77-91 (23.9-28.3%) |
| Basculegion | 201-237 (52.6-62%) | 365-429 (95.5-112.3%) | 0-0 (0-0%) | 395-465 (103.4-121.7%) | 0-0 (0-0%) | 121-143 (31.7-37.4%) | 315-371 (82.5-97.1%) | 0-0 (0-0%) | 343-403 (89.8-105.5%) | 0-0 (0-0%) |
| Glalie-Mega | 342-403 (113.2-133.4%) | 173-203 (57.3-67.2%) | 180-211 (59.6-69.9%) | 335-394 (110.9-130.5%) | 162-189 (53.6-62.6%) | 231-272 (76.5-90.1%) | 300-353 (99.3-116.9%) | 288-339 (95.4-112.3%) | 162-191 (53.6-63.2%) | 651-766 (215.6-253.6%) |
| Goodra | 190-224 (59-69.6%) | 51-60 (15.8-18.6%) | 100-117 (31.1-36.3%) | 373-439 (115.8-136.3%) | 177-210 (55-65.2%) | 68-80 (21.1-24.8%) | 176-208 (54.7-64.6%) | 159-188 (49.4-58.4%) | 48-56 (14.9-17.4%) | 362-426 (112.4-132.3%) |
| Hariyama | 107-126 (24.9-29.3%) | 217-255 (50.5-59.3%) | 111-132 (25.8-30.7%) | 842-990 (195.8-230.2%) | 201-237 (46.7-55.1%) | 290-341 (67.4-79.3%) | 754-886 (175.3-206%) | 180-211 (41.9-49.1%) | 204-240 (47.4-55.8%) | 408-480 (94.9-111.6%) |
| Inteleon | 201-237 (71.3-84%) | 408-480 (144.7-170.2%) | 105-124 (37.2-44%) | 395-465 (140.1-164.9%) | 189-222 (67-78.7%) | 136-160 (48.2-56.7%) | 353-416 (125.2-147.5%) | 169-198 (59.9-70.2%) | 383-451 (135.8-159.9%) | 384-452 (136.2-160.3%) |
| Kilowattrel | 429-505 (152.1-179.1%) | 217-255 (77-90.4%) | 55-66 (19.5-23.4%) | 210-247 (74.5-87.6%) | 201-237 (71.3-84%) | 290-341 (102.8-120.9%) | 188-221 (66.7-78.4%) | 89-105 (31.6-37.2%) | 204-240 (72.3-85.1%) | 204-240 (72.3-85.1%) |
| Meloetta | 176-207 (51.5-60.5%) | 117-137 (34.2-40.1%) | 92-109 (26.9-31.9%) | 346-407 (101.2-119%) | 165-195 (48.2-57%) | 156-183 (45.6-53.5%) | 202-237 (59.1-69.3%) | 148-174 (43.3-50.9%) | 110-129 (32.2-37.7%) | 336-395 (98.2-115.5%) |
| Raikou | 180-212 (55.9-65.8%) | 72-84 (22.4-26.1%) | 94-111 (29.2-34.5%) | 176-207 (54.7-64.3%) | 171-198 (53.1-61.5%) | 192-226 (59.6-70.2%) | 124-146 (38.5-45.3%) | 152-178 (47.2-55.3%) | 67-79 (20.8-24.5%) | 343-403 (106.5-125.2%) |
---

## K. NU → PU role-comparison matrices

Section H is the role comparison, one candidate at a time. NU competitors are
selected by shared role keys, shared typing and BST proximity — a mechanical
shortlist, not a judgement. Their full profiles are in section D.
---

## L. Speed-tier table

Every RU entry at base Speed 80+. **Priority is not Speed** — it is section M.

| Pokémon | Base | Max neutral | Max +Spe | +1 | +2 | Scarf (from max +Spe) |
| --- | --- | --- | --- | --- | --- | --- |
| Aerodactyl | 130 | 359 | 394 | 591 | 788 | 591 |
| Kilowattrel | 125 | 349 | 383 | 574 | 766 | 574 |
| Inteleon | 120 | 339 | 372 | 558 | 744 | 558 |
| Cinccino | 115 | 329 | 361 | 541 | 722 | 541 |
| Raikou | 115 | 329 | 361 | 541 | 722 | 541 |
| Starmie | 115 | 329 | 361 | 541 | 722 | 541 |
| Scream Tail | 111 | 321 | 353 | 529 | 706 | 529 |
| Espeon | 110 | 319 | 350 | 525 | 700 | 525 |
| Grafaiai | 110 | 319 | 350 | 525 | 700 | 525 |
| Heliolisk | 109 | 317 | 348 | 522 | 696 | 522 |
| Pawmot | 105 | 309 | 339 | 508 | 678 | 508 |
| Flygon | 100 | 299 | 328 | 492 | 656 | 492 |
| Glalie-Mega | 100 | 299 | 328 | 492 | 656 | 492 |
| Staraptor | 100 | 299 | 328 | 492 | 656 | 492 |
| Tauros-Paldea-Aqua | 100 | 299 | 328 | 492 | 656 | 492 |
| Tentacruel | 100 | 299 | 328 | 492 | 656 | 492 |
| Arcanine | 95 | 289 | 317 | 475 | 634 | 475 |
| Articuno-Galar | 95 | 289 | 317 | 475 | 634 | 475 |
| Drapion | 95 | 289 | 317 | 475 | 634 | 475 |
| Indeedee | 95 | 289 | 317 | 475 | 634 | 475 |
| Uxie | 95 | 289 | 317 | 475 | 634 | 475 |
| Xatu | 95 | 289 | 317 | 475 | 634 | 475 |
| Brambleghast | 90 | 279 | 306 | 459 | 612 | 459 |
| Flamigo | 90 | 279 | 306 | 459 | 612 | 459 |
| Meloetta | 90 | 279 | 306 | 459 | 612 | 459 |
| Gligar | 85 | 269 | 295 | 442 | 590 | 442 |
| Heracross | 85 | 269 | 295 | 442 | 590 | 442 |
| Overqwil | 85 | 269 | 295 | 442 | 590 | 442 |
| Altaria | 80 | 259 | 284 | 426 | 568 | 426 |
| Braviary | 80 | 259 | 284 | 426 | 568 | 426 |
| Goodra | 80 | 259 | 284 | 426 | 568 | 426 |

**Conditional speed abilities in RU** (none of these is active by default):

- **Swift Swim — needs rain**: Basculegion, Drednaw, Mantine, Omastar, Overqwil
- **Chlorophyll — needs sun**: _nobody in RU_
- **Sand Rush — needs sandstorm**: Houndstone
- **Slush Rush — needs snow**: _nobody in RU_
- **Unburden — needs its item consumed**: Grafaiai
- **Speed Boost — +1 at the end of each turn**: _nobody in RU_
- **Quick Feet — needs a status**: _nobody in RU_
- **Light Metal — +1 Speed on EVERY entry, resets on switch-out**: _nobody in RU_
- **Quark Drive — needs Electric Terrain or Booster Energy**: _nobody in RU_
- **Protosynthesis — needs sun or Booster Energy**: Scream Tail
---

## M. Priority table

Engine priority for every RU entry that has any, including Grassy Glide's
engine-side +1.

| Pokémon | Priority moves (engine BP / bracket) | Max offence | Abilities |
| --- | --- | --- | --- |
| Abomasnow-Mega | Grassy Glide 70P Grass (+1); Ice Shard 40P Ice (+1) | Atk 399 / SpA 399 | Snow Warning |
| Arcanine | Extreme Speed 80P Normal (+2) | Atk 350 / SpA 328 | Intimidate/Flash Fire/Justified |
| Articuno-Galar | Ice Shard 40P Ice (+1) | Atk 295 / SpA 383 | Competitive |
| Basculegion | Aqua Jet 40P Water (+1) | Atk 355 / SpA 284 | Swift Swim/Adaptability/Mold Breaker |
| Bellibolt | Sucker Punch 80P Dark (+1) | Atk 249 / SpA 335 | Electromorphosis/Static/Damp |
| Brambleghast | Grassy Glide 70P Grass (+1); Shadow Sneak 40P Ghost (+1) | Atk 361 / SpA 284 | Wind Rider/Infiltrator |
| Decidueye | Sucker Punch 80P Dark (+1); Grassy Glide 70P Grass (+1); Shadow Sneak 40P Ghost (+1) | Atk 344 / SpA 328 | Overgrow/Long Reach |
| Decidueye-Hisui | Sucker Punch 80P Dark (+1); Grassy Glide 70P Grass (+1); Upper Hand 65P Fighting (+3); Shadow Sneak 40P Ghost (+1) | Atk 355 / SpA 317 | Overgrow/Scrappy |
| Dhelmise | Grassy Glide 70P Grass (+1) | Atk 397 / SpA 298 | Steelworker |
| Doublade | Shadow Sneak 40P Ghost (+1) | Atk 350 / SpA 207 | No Guard |
| Espeon | Quick Attack 40P Normal (+1) | Atk 251 / SpA 394 | Synchronize/Magic Bounce |
| Flamigo | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2) | Atk 361 / SpA 273 | Scrappy/Tangled Feet/Costar |
| Flygon | First Impression 90P Bug (+2); Feint 50P Normal (+2); Quick Attack 40P Normal (+1); Vacuum Wave 40S Fighting (+1) | Atk 328 / SpA 284 | Levitate |
| Glalie-Mega | Ice Shard 40P Ice (+1) | Atk 372 / SpA 372 | Refrigerate |
| Gligar | Feint 50P Normal (+2); Quick Attack 40P Normal (+1) | Atk 273 / SpA 185 | Hyper Cutter/Sand Veil/Immunity |
| Goodra | Feint 50P Normal (+2) | Atk 328 / SpA 350 | Sap Sipper/Hydration/Gooey |
| Gothitelle | Fake Out 40P Normal (+3) | Atk 229 / SpA 317 | Frisk/Competitive/Shadow Tag |
| Hariyama | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Bullet Punch 40P Steel (+1); Fake Out 40P Normal (+3) | Atk 372 / SpA 196 | Thick Fat/Guts/Sheer Force |
| Heliolisk | Quick Attack 40P Normal (+1) | Atk 229 / SpA 348 | Dry Skin/Sand Veil/Solar Power |
| Heracross | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Vacuum Wave 40S Fighting (+1) | Atk 383 / SpA 196 | Swarm/Guts/Moxie |
| Houndstone | Shadow Sneak 40P Ghost (+1) | Atk 331 / SpA 218 | Sand Rush/Fluffy |
| Incineroar | Fake Out 40P Normal (+3) | Atk 361 / SpA 284 | Blaze/Intimidate |
| Indeedee | Fake Out 40P Normal (+3) | Atk 251 / SpA 339 | Inner Focus/Synchronize/Psychic Surge |
| Inteleon | Sucker Punch 80P Dark (+1); Aqua Jet 40P Water (+1); Ice Shard 40P Ice (+1); Vacuum Wave 40S Fighting (+1) | Atk 295 / SpA 383 | Torrent/Sniper |
| Kilowattrel | Quick Attack 40P Normal (+1) | Atk 262 / SpA 339 | Wind Power/Volt Absorb/Competitive |
| Meloetta | Quick Attack 40P Normal (+1) | Atk 278 / SpA 390 | Serene Grace |
| Overqwil | Aqua Jet 40P Water (+1) | Atk 361 / SpA 251 | Poison Point/Swift Swim/Intimidate |
| Pawmot | Upper Hand 65P Fighting (+3); Fake Out 40P Normal (+3); Mach Punch 40P Fighting (+1); Quick Attack 40P Normal (+1) | Atk 361 / SpA 262 | Volt Absorb/Natural Cure/Iron Fist |
| Raikou | Extreme Speed 80P Normal (+2); Quick Attack 40P Normal (+1) | Atk 295 / SpA 361 | Pressure/Inner Focus/Volt Absorb |
| Scrafty | Upper Hand 65P Fighting (+3); Fake Out 40P Normal (+3) | Atk 306 / SpA 207 | Shed Skin/Moxie/Intimidate |
| Staraptor | Quick Attack 40P Normal (+1) | Atk 372 / SpA 218 | Intimidate/Reckless |
| Sylveon | Quick Attack 40P Normal (+1) | Atk 251 / SpA 350 | Cute Charm/Pixilate |
| Tauros-Paldea-Aqua | Aqua Jet 40P Water (+1) | Atk 350 / SpA 174 | Intimidate/Anger Point/Cud Chew |
| Tsareena | Grassy Glide 70P Grass (+1); Feint 50P Normal (+2) | Atk 372 / SpA 218 | Leaf Guard/Queenly Majesty/Sweet Veil |
| Vanilluxe | Ice Shard 40P Ice (+1) | Atk 317 / SpA 350 | Ice Body/Snow Warning/Weak Armor |
| Vaporeon | Quick Attack 40P Normal (+1) | Atk 251 / SpA 350 | Water Absorb/Hydration |
| Xatu | Sucker Punch 80P Dark (+1); Quick Attack 40P Normal (+1) | Atk 273 / SpA 317 | Synchronize/Early Bird/Magic Bounce |
---

## N. Item-freedom table

| Candidate | Item freedom | Consequence |
| --- | --- | --- |
| Abomasnow-Mega | **No** — Abomasite is forced and unremovable | no Band/Specs/Scarf/Life Orb/Boots/Leftovers/Ring Target/Orbs |
| Aerodactyl | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Articuno-Galar | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Basculegion | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Glalie-Mega | **No** — Glalitite is forced and unremovable | no Band/Specs/Scarf/Life Orb/Boots/Leftovers/Ring Target/Orbs |
| Goodra | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Hariyama | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Inteleon | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Kilowattrel | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Meloetta | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Raikou | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
---

## O. NU Mega opportunity-cost table

NU has **2** forme entries and a team gets **one** Mega.

| Forme | Types | BST (spread) | Ability | Source | STAB | Setup | Recovery | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Abomasnow-Mega | Grass/Ice | 594 (90/132/105/132/105/30) | Snow Warning | imported | Grass Leaf Storm 140S · Ice Blizzard 120S | Growth, Swords Dance | Rest | Grassy Glide 70P Grass (+1), Ice Shard 40P Ice (+1) |
| Glalie-Mega | Ice | 580 (80/120/80/120/80/100) | Refrigerate | imported | Ice Explosion 325P | Defense Curl | Rest | Ice Shard 40P Ice (+1) |

A Mega is only tier-breaking if a team is pressured to spend its **one** Mega
slot on it rather than on any of the above.
---

## P. Hazard environment

**Stealth Rock:** Aerodactyl, Aggron, Bronzong, Drednaw, Dudunsparce, Flygon, Gligar, Omastar, Rhydon, Rhyperior, Scream Tail, Stakataka, Tyrantrum, Uxie

**Spikes:** Brambleghast, Glalie-Mega, Gligar, Heracross, Klefki, Omastar, Overqwil

**Toxic Spikes:** Dragalge, Drapion, Gligar, Omastar, Overqwil, Tentacruel

**Sticky Web:** Araquanid

**Rapid Spin:** Avalugg, Brambleghast, Dhelmise, Starmie, Tentacruel, Tsareena

**Defog:** Aerodactyl, Altaria, Articuno-Galar, Braviary, Decidueye, Decidueye-Hisui, Drampa, Flygon, Gligar, Klefki, Mantine, Staraptor, Xatu

**Mortal Spin / Tidy Up / Court Change:** Cinccino

**Magic Bounce:** Espeon, Xatu

**Ghost types (block Rapid Spin):** Basculegion, Brambleghast, Decidueye, Dhelmise, Doublade, Houndstone

**Heavy-Duty Boots** are available to every **species** entry and to **no forme**
entry — the stone occupies the slot. That asymmetry is decisive for any
Rock-weak or pivot-reliant Mega on the candidate list.
---

## Q. Weather / terrain / Trick Room / Tailwind environment

**Weather by move:** Rain — Abomasnow-Mega, Aerodactyl, Aggron, Altaria, Araquanid, Articuno-Galar, Avalugg, Basculegion, Bellibolt, Braviary, Bronzong, Cinccino, Decidueye, Decidueye-Hisui, Dhelmise, Doublade, Dragalge, Drampa, Drapion, Drednaw, Dudunsparce, Escavalier, Espeon, Exploud, Glalie-Mega, Gligar, Goodra, Gothitelle, Grafaiai, Hariyama, Heliolisk, Heracross, Houndstone, Inteleon, Kingler, Klefki, Magneton, Mantine, Meloetta, Omastar, Overqwil, Pawmot, Raikou, Rhydon, Rhyperior, Scrafty, Scream Tail, Staraptor, Starmie, Sylveon, Tauros-Paldea-Aqua, Tentacruel, Uxie, Vanilluxe, Vaporeon, Xatu; Sun — Aerodactyl, Aggron, Altaria, Arcanine, Articuno-Galar, Braviary, Bronzong, Cinccino, Decidueye, Decidueye-Hisui, Dhelmise, Drampa, Drapion, Dudunsparce, Espeon, Exploud, Flygon, Gligar, Goodra, Grafaiai, Hariyama, Heliolisk, Heracross, Houndstone, Incineroar, Klefki, Magneton, Meloetta, Pawmot, Raikou, Rhydon, Rhyperior, Scrafty, Scream Tail, Staraptor, Sylveon, Tauros-Paldea-Aqua, Tsareena, Tyrantrum, Uxie, Vaporeon, Xatu; Sand — Aerodactyl, Aggron, Articuno-Galar, Bronzong, Drednaw, Dudunsparce, Flygon, Gligar, Heliolisk, Houndstone, Klefki, Magneton, Omastar, Raikou, Rhydon, Rhyperior, Scream Tail, Stakataka, Tauros-Paldea-Aqua, Tyrantrum, Uxie; Snow — Abomasnow-Mega, Altaria, Articuno-Galar, Avalugg, Basculegion, Dragalge, Glalie-Mega, Inteleon, Scream Tail.

**Weather by ability:** Abomasnow-Mega, Vanilluxe.

**Terrain by move:** Electric — Bellibolt, Heliolisk, Kilowattrel, Magneton, Pawmot, Raikou; Grassy — Brambleghast, Decidueye, Decidueye-Hisui, Tsareena; Misty — Klefki, Scream Tail, Sylveon; Psychic — Bronzong, Espeon, Gothitelle, Indeedee, Scream Tail.

**Terrain by ability:** Indeedee.

**Trick Room setters:** Articuno-Galar, Bronzong, Espeon, Gothitelle, Indeedee, Klefki, Meloetta, Scream Tail, Stakataka, Starmie, Uxie, Xatu. The **Warp Prism** makes Trick Room *the holder sets* last **8** turns.

**Tailwind setters:** Aerodactyl, Altaria, Articuno-Galar, Braviary, Decidueye, Decidueye-Hisui, Drampa, Dudunsparce, Flamigo, Flygon, Gligar, Kilowattrel, Mantine, Staraptor, Xatu. The **Wind Sock** makes Tailwind *the holder sets* last **7** turns.

Neither item can be held by a Mega, but a teammate can hold it — which matters
for every slow breaker in section G.

**Mega Sol is PERSONAL weather**, not field-wide sun: it overrides
`battle.weatherFor` for its holder only. Nothing else on the field sees it.
---

## R. Transformation / forme legality audit

Every NU entry was checked for a route to a **higher-tier forme in battle** —
the Zygarde / Darmanitan-Galar shape that this project has had to gate before.

**Item-driven routes from an NU species to a higher-tier forme: 9.** Every one was put through `Validation.validateTeam` in the NU format and
**every one is refused** — the Absol/Absolite rule, with the species staying legal:

| NU species | Item refused in NU | Forme it would make | That forme's tier |
| --- | --- | --- | --- |
| Aerodactyl | Aerodactylite | Aerodactyl-Mega | **UU** |
| Aggron | Aggronite | Aggron-Mega | **RU** |
| Altaria | Altarianite | Altaria-Mega | **UU** |
| Dragalge | Dragalgite | Dragalge-Mega | **UU** |
| Drampa | Drampanite | Drampa-Mega | **UU** |
| Heracross | Heracronite | Heracross-Mega | **UU** |
| Scrafty | Scraftinite | Scrafty-Mega | **UU** |
| Staraptor | Staraptite | Staraptor-Mega | **UU** |
| Starmie | Starminite | Starmie-Mega | **UU** |

**Ability-driven routes:**

_None._

**Conclusion: no legality hole found.** Both classes are gated, and the gates
were exercised through the real validator rather than read off the data.
---

## S. New candidates surfaced by the mechanical scan

Mechanical flags only — reasons to look, **not** recommendations. 11 of
67 NU entries tripped two or more.

- **Abomasnow-Mega** (Grass/Ice, BST 594, Snow Warning) — BST 594; setup + priority + reliable recovery.
- **Aerodactyl** (Rock/Flying, BST 515, Rock Head/Pressure/Unnerve) — Speed **394**; strong setup on a fast frame.
- **Articuno-Galar** (Psychic/Flying, BST 580, Competitive) — BST 580; setup + priority + reliable recovery.
- **Basculegion** (Water/Ghost, BST 530, Swift Swim/Adaptability/Mold Breaker) — setup + priority + reliable recovery; ability: Adaptability.
- **Glalie-Mega** (Ice, BST 580, Refrigerate) — BST 580; setup + priority + reliable recovery.
- **Goodra** (Dragon, BST 600, Sap Sipper/Hydration/Gooey) — BST 600; setup + priority + reliable recovery.
- **Hariyama** (Fighting, BST 474, Thick Fat/Guts/Sheer Force) — setup + priority + reliable recovery; ability: Sheer Force.
- **Inteleon** (Water, BST 530, Torrent/Sniper) — setup + priority + reliable recovery; strong setup on a fast frame.
- **Kilowattrel** (Electric/Flying, BST 490, Wind Power/Volt Absorb/Competitive) — Speed **383**; setup + priority + reliable recovery.
- **Meloetta** (Normal/Psychic, BST 600, Serene Grace) — BST 600; setup + priority + reliable recovery.
- **Raikou** (Electric, BST 580, Pressure/Inner Focus/Volt Absorb) — BST 580; setup + priority + reliable recovery.

**Multi-hit users in RU**, because the 25-BP-per-hit rewrite changes what these
moves are worth, and Skill Link forces the maximum:

| Move | Type | BP × hits | RU users |
| --- | --- | --- | --- |
| Rock Blast | Rock | 25 × [2,5] | Aerodactyl, Aggron, Bronzong, Cinccino, Drednaw, Heracross, Mantine, Omastar, Rhydon, Rhyperior, Stakataka, Tyrantrum |
| Bullet Seed | Grass | 25 × [2,5] | Abomasnow-Mega, Brambleghast, Cinccino, Decidueye, Decidueye-Hisui, Heracross, Mantine, Tsareena |
| Icicle Spear | Ice | 25 × [2,5] | Abomasnow-Mega, Articuno-Galar, Avalugg, Glalie-Mega, Inteleon, Vanilluxe |
| Pin Missile | Bug | 25 × [2,5] | Drapion, Heracross, Omastar, Overqwil |
| Tail Slap | Normal | 25 × [2,5] | Cinccino |
| Arm Thrust | Fighting | 25 × [2,5] | Hariyama, Heracross, Pawmot |
| Fury Attack | Normal | 25 × [2,5] | Altaria, Braviary, Decidueye, Decidueye-Hisui, Escavalier, Heracross, Rhydon, Rhyperior, Staraptor |
| Fury Swipes | Normal | 25 × [2,5] | Grafaiai, Incineroar |
| Spike Cannon | Normal | 25 × [2,5] | Omastar |
| Dual Chop | Dragon | 50 × 2 | Guzzlord, Incineroar, Meloetta, Scrafty |
| Dual Wingbeat | Flying | 50 × 2 | Aerodactyl, Altaria, Articuno-Galar, Braviary, Decidueye, Decidueye-Hisui, Dudunsparce, Flamigo, Flygon, Gligar, Kilowattrel, Mantine, Staraptor, Xatu |
| Twineedle | Bug | 50 × 2 | Drapion, Escavalier |
| Triple Axel | Ice | 20 × 3 | Articuno-Galar, Cinccino, Meloetta, Tsareena |
| Scale Shot | Dragon | 25 × [2,5] | Basculegion, Dragalge, Drampa, Drednaw, Dudunsparce, Flygon, Gligar, Heliolisk, Inteleon, Overqwil, Tyrantrum |

**Skill Link holders in RU: Cinccino** — Skill Link forces the
maximum hit count, and the calculator honours it (Cloyster's Icicle Spear reports
5 hits with it, 3 without).
---

## T. Remaining genuinely unresolved questions

1. **No usage, ladder, win-rate, tournament or popularity data exists in RedGPT.**
   There is no metagame history for any tier. Every judgement must be mechanical.
2. **Nothing in RU has been played by a human.** The ladder was rebuilt on
   2026-08-15 and revised on 2026-08-16.
3. **0 RU formes sit on an `estimated` tier** — a nearest-neighbour model
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