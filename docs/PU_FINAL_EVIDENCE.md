# RedGPT PU Final Audit — Verified Evidence Packet

**Generated from the live RedGPT project** by `tools/pu-final-evidence.js`.
Every stat, movepool value, damage figure and speed number comes from the running
engine, the packaged data, the validator or the real damage calculator.

**RedGPT has no usage, ladder, win-rate, tournament or popularity data**, so none
is quoted. Section T lists what genuinely cannot be determined.

---

## Your task

Make the **complete bidirectional PU tier audit**:

1. **Which current PU entries are too strong for PU and should move UP to NU?**
2. **Which current PU entries are too weak or outclassed and should move DOWN to ZU?**

The bars are section E (the current NU roster, **after** the NU pass moved seven
entries) and section D (the complete ZU roster).

**Most entries should stay put.** A high BST alone does not promote, and weak raw
stats alone do not demote — a demotion needs ZU to already contain something that
credibly does the candidate's **actual job** as well or better. Unique value that
justifies staying includes superior typing, Regenerator, Magic Bounce, reliable
recovery, a better hazard or pivot role, unique priority, item freedom, a
trapping ability, or simply not costing the team's only Mega slot.

**Dropping a Pokémon from PU to ZU does not make it unusable in PU** — it makes it
legal in ZU. So the real question for every demotion is **can ZU absorb it
healthily?** If it would immediately become one of ZU's dominant threats, it
should stay in PU even if it looks weak beside the rest of PU.

**There is no cap on how many entries may move — including zero.**

For each entry you move: exact name, species or forme, direction, confidence,
two or three sentences naming the specific Pokémon it outclasses or is outclassed
by, and the numbers you relied on with the ability and item they assume. Then list
what you **considered and deliberately left**.

**This packet contains no recommendations.** Every flag in sections G, H and S is
a mechanical reason to look, not a verdict.

---

## Context: the NU pass that preceded this one

**The NU audit promoted six entries and demoted one**, and all seven have already
been applied — so the NU roster in section E is the **post-pass** bar, and PU has
already **gained Mega Audino**:

| Moved | Kind | Direction | The mechanic that decided it |
| --- | --- | --- | --- |
| Duraludon | species | NU → RU | **Light Metal** is +1 Speed on every entry here — ~295 Spe becomes ~442 with no setup turn |
| Copperajah | species | NU → RU | **Heavy Metal** is +1 Atk / +1 Def / -2 Spe on entry here — ~394 Atk becomes ~591 before the item |
| Infernape | species | NU → RU | mixed attacker with restored 140 BP Overheat *and* redesigned 150 BP Focus Punch |
| Tornadus | species | NU → RU | restored 120 BP Hurricane, Nasty Plot, 111 Speed, Prankster/Defiant |
| Munkidori | species | NU → RU | 130 SpA / 106 Speed with Nasty Plot, Toxic Chain and Parting Shot |
| Meloetta-Pirouette | forme entry | NU → RU | 128 Atk / 128 Speed with 150 BP Focus Punch |
| **Audino-Mega** | forme | **NU → PU** | the Audinite costs the item slot *and* the team's only Mega slot; base Audino is already PU with Regenerator and item freedom |

**Two consequences for this audit:**

- **NU is 67, not 65**, and **PU is 110**, because Mega Audino joined it.
  A PU entry moving up joins the roster in section E as it stands now.
- **Two of the six moved on a RedGPT ability redesign the imported tier could not
  have known about.** That is the shape worth looking for again in PU: an
  imported tier that is right about the Pokémon Smogon ranked and wrong about the
  one this engine ships.

**Meloetta-Pirouette is a bookkeeping caveat worth knowing**: it carries
`battleOnly`, and **no route into it exists** — Relic Song is packaged as an
ordinary 75 BP sound move with no forme-change implementation. Its tier is a
roster classification; the validator refuses it in every tier format at every
tier. It is listed in NU→RU for completeness, not because anything changed on the
field.

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

**Selectable species: 1138** (packaged 1273).

**PU format rules, read live — and compared against NU and ZU rather than assumed:**

| Rule | PU | NU | ZU |
| --- | --- | --- | --- |
| `maxTier` | **PU** | NU | ZU |
| `tera` | false | false | false |
| `mega` | true | true | true |
| `speciesClause` | true | true | true |
| `sleepClause` | true | true | true |
| `itemClause` | false | false | false |
| `evasionClause` | true | true | true |
| `ohkoClause` | true | true | true |
| `bannedMoves` | Fissure, Guillotine, Horn Drill, Sheer Cold, Double Team, Minimize | 6 | 6 |
| `bannedItems` | none | none | none |
| `bannedSpecies` | none | none | none |
| `bannedAbilities` | **none** | **none** | **none** |
| level / team | 100 / 6v6 | 100 / 6v6 | 100 / 6v6 |
| EV limit / per stat / IV max | 510-252 / 31 | 510-252 / 31 | 510-252 / 31 |

**PU is byte-identical to NU and ZU on every rule except `maxTier`.** There are
no PU-specific bans of any kind.

**Trapping abilities are LEGAL in PU, and in every other competitive format.**
Verified live across all 11 formats: every one carries
`bannedAbilities: []`. The complete list of trapping abilities, discovered by
hook rather than by name, is **Shadow Tag, Arena Trap, Magnet Pull**.
Section Q covers what that is worth; sections C and S mark every holder.
---

## B. RedGPT mechanics that decide tiering here — reconfirmed from the live build

**Priority (all unconditional in this project):**

| Move | Type | Cat | BP | Priority | Acc |
| --- | --- | --- | --- | --- | --- |
| Sucker Punch | Dark | Physical | **80** | **+1** | 100% |
| Thunderclap | Electric | Special | **70** | **+1** | 100% |
| First Impression | Bug | Physical | **90** | **+2** | 100% |
| Upper Hand | Fighting | Physical | **65** | **+3** | 100% |
| Grassy Glide | Grass | Physical | **70** | **+1** | 100% |

Grassy Glide's packaged priority is **0** — the +1 is added by the engine, so
reading the move data alone misses it. Upper Hand has no condition and no flinch.

**Restored base powers (live):** Overheat 140, Leaf Storm 140, Draco Meteor 140, Blizzard 120, Hydro Pump 120, Fire Blast 120, Thunder 120, Hurricane 120, Head Smash 150, Close Combat 120.

**Focus Punch is 150 BP at 70% accuracy and priority 0** — no Substitute condition, no negative priority.

**Multi-hit:** 2-5 hit moves are **25 BP per hit**, exactly-2-hit moves **50 BP
per hit**. Triple Axel is deliberately excluded (20 BP × 3) and so is Population Bomb (20 BP × 10).
**Skill Link forces the maximum** and the calculator honours it.

**Ring Target:** the holder's attacks hit for **neutral** damage through a
**type** immunity. It does **not** beat Levitate, Flash Fire, Water Absorb or any
other ability immunity. One per team, visible from turn one, and **no Mega can
hold it**.

**Toxic Orb and Flame Orb fire on ENTRY**, so Guts / Poison Heal / Quick Feet
holders are already boosted the turn they arrive.

**Light Metal — verified live:** Halves this Pokemon's weight; +1 Speed on entry.

**Heavy Metal — verified live:** Doubles this Pokemon's weight; on entry -2 Speed, +1 Defense, +1 Attack.

**Download — verified live:** Raises the Pokemon's Attack and Sp. Atk when it enters battle.

**Supreme Overlord — verified live:** Raises the Pokemon's Attack when it enters battle.

**Cloud Nine — verified live:** Removes the current weather when the Pokemon enters battle.

**Air Lock — verified live:** Removes the current weather when the Pokemon enters battle.

### Trapping abilities — the complete verified Part II result

Discovery was **behavioural**: every ability in the registry defining an
`onTrapped` hook, not a search for three familiar names.

| Ability | Live condition (from `abilities.js`) |
| --- | --- |
| **Shadow Tag** | traps the foe **unless the foe also has Shadow Tag** |
| **Arena Trap** | traps the foe **only while the foe is grounded** (`battle.isGrounded`) |
| **Magnet Pull** | traps the foe **only if the foe is a Steel type** |

`battle.isTrapped` is the single predicate and its **branch order** is
load-bearing. In order:

1. **Shed Shell** — escapes everything, checked first.
2. **Fairy Lock** (pseudo-weather) — traps both sides, and is checked **above** the Ghost escape.
3. Volatile traps — partial trapping (Wrap/Bind), Mean Look/Block, Ingrain, Octolock.
4. **Ghost typing escapes** — all three abilities, read off **live** types.
5. **Guard Dog** (`trapImmune`) on the victim.
6. The trapper's `onTrapped` hook.

Measured behaviour, every row driven through the real engine and cross-checked
against a real `{type:'switch'}` command (the predicate and the command agreed
in every case):

| Situation | Trapped? |
| --- | --- |
| ordinary grounded non-Ghost vs Shadow Tag | **yes** |
| Ghost vs Shadow Tag / Arena Trap / Magnet Pull | no |
| Flying or Levitate vs Shadow Tag | **yes** (Shadow Tag is not a grounding effect) |
| Flying, Levitate or Air Balloon vs Arena Trap | no |
| Flying holding an **Iron Ball** vs Arena Trap | **yes** — it is grounded again |
| Steel vs Magnet Pull | **yes** |
| Steel **/Ghost** (Aegislash) vs Magnet Pull | no — Ghost is checked first |
| victim holding **Shed Shell** | no |
| victim with **Guard Dog** | no |
| Shadow Tag vs Shadow Tag | no — mutual |
| victim with **Mold Breaker** | **yes** — Mold Breaker does not break trapping |
| trapper **Gastro Acid**'d, or victim has **Neutralizing Gas** | no |
| trapper switches out or faints | no — frees immediately |

**Two results that change what trapping is worth:**

- **Every pivot move bypasses trapping.** U-turn, Volt Switch, Flip Turn,
  Parting Shot, Baton Pass and Teleport all escape a trap — verified for all six.
  Trapping blocks **voluntary** switching only.
- **Phazing pulls a trapped Pokémon out.** An opposing Whirlwind replaced a
  trapped victim; forced switches never consult `isTrapped`.

**Ability Shield** (`abilityProtected`) exists and protects an ability from
suppression.
---

## C. Full PU competitive profiles

All **110** current PU entries, engine-resolved. Trapping-ability
holders are marked in bold on their own line.

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
  Trapping moves: Mean Look
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
  Trapping moves: Block
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
  Trapping moves: Block
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
  **TRAPPING ABILITY: Arena Trap** (optional — one of 3)
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
  Trapping moves: Mean Look
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
  Trapping moves: Block
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
  Trapping moves: Spider Web
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
  Trapping moves: Block
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
  Trapping moves: Mean Look
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
  Trapping moves: Block
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
  **TRAPPING ABILITY: Shadow Tag** (optional — one of 3)
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
  Trapping moves: Mean Look
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
  Trapping moves: Block
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
  Trapping moves: Block
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
  **TRAPPING ABILITY: Shadow Tag** (optional — one of 4)
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
  Trapping moves: Mean Look
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
  Trapping moves: Block
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
  Trapping moves: Block
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
  Trapping moves: Mean Look
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
  Trapping moves: Block
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
  Trapping moves: Block
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
  Trapping moves: Block
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
  Trapping moves: Block
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
  Trapping moves: Block
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
  Trapping moves: Block
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
  Trapping moves: Block, Mean Look
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
  Trapping moves: Mean Look
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Knock Off, Leech Seed, Light Screen, Protect, Reflect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Wobbuffet** — species, **PU**, source: override
  Psychic | BST 405 (190/33/58/33/58/33) | Abilities: Shadow Tag / Telepathy
  Engine stats @252 (neutral/positive): Shadow Tag: Atk 165/181, SpA 165/181, Spe 165/181 — Telepathy: Atk 165/181, SpA 165/181, Spe 165/181
  **TRAPPING ABILITY: Shadow Tag** (optional — one of 2)
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

## D. Full ZU comparison bar

All **677** current ZU entries — this is what a downward move is
measured against, and the roster that has to absorb anything that drops. Compact
format (the same fields, minus the utility rows) because ZU is large; **nothing
is omitted**.

**Abomasnow** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass/Ice | BST 494 (90/92/75/92/85/60) | Abilities: Snow Warning / Soundproof
  Engine stats @252 (neutral/positive): Snow Warning: Atk 283/311, SpA 283/311, Spe 219/240 — Soundproof: Atk 283/311, SpA 283/311, Spe 219/240
  Item: **free**
  STAB: Grass Leaf Storm 140S · Ice Blizzard 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Hard Press 100P, Rock Rock Slide 75P
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Water Water Pulse 60S

**Abra** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 310 (25/20/15/105/55/90) | Abilities: Synchronize / Inner Focus / Magic Guard
  Engine stats @252 (neutral/positive): Synchronize: Atk 139/152, SpA 309/339, Spe 279/306 — Inner Focus: Atk 139/152, SpA 309/339, Spe 279/306 — Magic Guard: Atk 139/152, SpA 309/339, Spe 279/306
  Item: **free**
  STAB: Psychic Dream Eater 100S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Steel Iron Tail 100P, Dark Foul Play 95P, Fire Fire Punch 75P, Ice Ice Punch 75P
  Special coverage: Electric Zap Cannon 120S, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Normal Tri Attack 80S, Bug Signal Beam 75S

**Accelgor** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Bug | BST 495 (80/70/40/100/60/145) | Abilities: Hydration / Sticky Hold / Unburden
  Engine stats @252 (neutral/positive): Hydration: Atk 239/262, SpA 299/328, Spe 389/427 — Sticky Hold: Atk 239/262, SpA 299/328, Spe 389/427 — Unburden: Atk 239/262, SpA 299/328, Spe 389/427
  Item: **free**
  STAB: Bug Bug Buzz 90S
  Physical coverage: Normal Double-Edge 120P, Fighting Drain Punch 75P, Dark Knock Off 65P
  Special coverage: Fighting Focus Blast 120S, Grass Energy Ball 90S, Poison Sludge Bomb 90S, Water Water Shuriken 25x2-5S, Normal Hidden Power 60S, Ground Mud Shot 55S

**Aipom** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 360 (55/70/55/40/55/85) | Abilities: Run Away / Pickup / Skill Link
  Engine stats @252 (neutral/positive): Run Away: Atk 239/262, SpA 179/196, Spe 269/295 — Pickup: Atk 239/262, SpA 179/196, Spe 269/295 — Skill Link: Atk 239/262, SpA 179/196, Spe 269/295
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ghost Shadow Ball 80S, Water Water Pulse 60S, Ground Mud Shot 55S

**Amaura** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Ice | BST 362 (77/59/50/67/63/46) | Abilities: Refrigerate / Snow Warning
  Engine stats @252 (neutral/positive): Refrigerate: Atk 217/238, SpA 233/256, Spe 191/210 — Snow Warning: Atk 217/238, SpA 233/256, Spe 191/210
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Ice Blizzard 120S
  Physical coverage: Dragon Outrage 120P, Steel Iron Tail 100P, Water Aqua Tail 90P, Psychic Zen Headbutt 80P, Ground Bulldoze 60P, Fighting Rock Smash 40P
  Special coverage: Psychic Dream Eater 100S, Electric Thunderbolt 95S, Ground Earth Power 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S, Water Water Pulse 60S

**Ampharos** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 510 (90/75/85/115/90/55) | Abilities: Static / Plus
  Engine stats @252 (neutral/positive): Static: Atk 249/273, SpA 329/361, Spe 209/229 — Plus: Atk 249/273, SpA 329/361, Spe 209/229
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Rock Meteor Beam 120 (charge)S, Dragon Dragon Pulse 90S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Anorith** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Bug | BST 355 (45/95/50/40/50/75) | Abilities: Battle Armor / Swift Swim
  Engine stats @252 (neutral/positive): Battle Armor: Atk 289/317, SpA 179/196, Spe 249/273 — Swift Swim: Atk 289/317, SpA 179/196, Spe 249/273
  Item: **free**
  STAB: Rock Rock Blast 25x2-5P · Bug X-Scissor 80P
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Fighting Brick Break 75P, Poison Cross Poison 70P, Dark Knock Off 65P, Flying Aerial Ace 60P
  Special coverage: Ground Earth Power 90S, Water Brine 65S, Normal Hidden Power 60S

**Appletun** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass/Dragon | BST 485 (110/85/80/100/80/30) | Abilities: Ripen / Gluttony / Thick Fat
  Engine stats @252 (neutral/positive): Ripen: Atk 269/295, SpA 299/328, Spe 159/174 — Gluttony: Atk 269/295, SpA 299/328, Spe 159/174 — Thick Fat: Atk 269/295, SpA 299/328, Spe 159/174
  Item: **free**
  STAB: Grass Leaf Storm 140S · Dragon Draco Meteor 140S
  Physical coverage: Fighting Superpower 120P, Ground Earthquake 100P, Normal Take Down 90P, Steel Iron Head 80P, Dark Sucker Punch 80P, Psychic Zen Headbutt 80P
  Special coverage: Normal Tera Blast 80S

**Applin** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Dragon | BST 260 (40/40/80/40/40/20) | Abilities: Ripen / Gluttony / Bulletproof
  Engine stats @252 (neutral/positive): Ripen: Atk 179/196, SpA 179/196, Spe 139/152 — Gluttony: Atk 179/196, SpA 179/196, Spe 139/152 — Bulletproof: Atk 179/196, SpA 179/196, Spe 139/152
  Item: **free**
  STAB: Grass Grassy Glide 70P · Dragon Draco Meteor 140S
  Physical coverage: Dark Sucker Punch 80P, Bug Pounce 50P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S

**Arbok** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Poison | BST 448 (60/95/69/65/79/80) | Abilities: Intimidate / Shed Skin / Unnerve
  Engine stats @252 (neutral/positive): Intimidate: Atk 289/317, SpA 229/251, Spe 259/284 — Shed Skin: Atk 289/317, SpA 229/251, Spe 259/284 — Unnerve: Atk 289/317, SpA 229/251, Spe 259/284
  Item: **free**
  STAB: Poison Belch 120S
  Physical coverage: Normal Skull Bash 130P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Ground Mud Bomb 65S, Bug Infestation 20S

**Arboliva** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass/Normal | BST 510 (78/69/90/125/109/39) | Abilities: Seed Sower / Harvest
  Engine stats @252 (neutral/positive): Seed Sower: Atk 237/260, SpA 349/383, Spe 177/194 — Harvest: Atk 237/260, SpA 349/383, Spe 177/194
  Item: **free**
  STAB: Grass Leaf Storm 140S · Normal Hyper Voice 90S
  Physical coverage: Dark Fling 30P
  Special coverage: Ground Earth Power 90S, Bug Pollen Puff 90S, Fairy Alluring Voice 80S, Psychic Mirror Coat fixedS

**Archen** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Flying | BST 401 (55/112/45/74/45/70) | Abilities: Defeatist
  Engine stats @252 (neutral/positive): Defeatist: Atk 323/355, SpA 247/271, Spe 239/262
  Item: **free**
  STAB: Rock Head Smash 150P · Flying Acrobatics 110P
  Physical coverage: Normal Thrash 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Dark Crunch 80P, Dragon Dragon Claw 80P
  Special coverage: Fire Heat Wave 100S, Dragon Dragon Pulse 90S, Ground Earth Power 90S, Normal Uproar 90S

**Arctibax** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dragon/Ice | BST 423 (90/95/66/45/65/62) | Abilities: Thermal Exchange / Ice Body
  Engine stats @252 (neutral/positive): Thermal Exchange: Atk 289/317, SpA 189/207, Spe 223/245 — Ice Body: Atk 289/317, SpA 189/207, Spe 223/245
  Item: **free**
  STAB: Dragon Outrage 120P · Ice Icicle Crash 85P
  Physical coverage: Ground Dig 100 (charge)P, Water Aqua Tail 90P, Normal Take Down 90P, Dark Crunch 80P, Steel Iron Head 80P, Fighting Brick Break 75P
  Special coverage: Normal Tera Blast 80S

**Ariados** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Bug/Poison | BST 400 (70/90/70/60/70/40) | Abilities: Swarm / Insomnia / Sniper
  Engine stats @252 (neutral/positive): Swarm: Atk 279/306, SpA 219/240, Spe 179/196 — Insomnia: Atk 279/306, SpA 219/240, Spe 179/196 — Sniper: Atk 279/306, SpA 219/240, Spe 179/196
  Item: **free**
  STAB: Bug Megahorn 120P · Poison Sludge Wave 95S
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Flying Bounce 85 (charge)P, Steel Smart Strike 70P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Psychic 90S, Normal Tera Blast 80S, Ghost Hex 65S, Electric Electroweb 55S

**Armaldo** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Rock/Bug | BST 495 (75/125/100/70/80/45) | Abilities: Battle Armor / Swift Swim
  Engine stats @252 (neutral/positive): Battle Armor: Atk 349/383, SpA 239/262, Spe 189/207 — Swift Swim: Atk 349/383, SpA 239/262, Spe 189/207
  Item: **free**
  STAB: Rock Stone Edge 100P · Bug X-Scissor 80P
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Poison Cross Poison 70P
  Special coverage: Ground Earth Power 90S, Steel Flash Cannon 80S, Water Brine 65S, Normal Hidden Power 60S

**Aron** — species, **ZU**, source: imported (redgpt-zu-floor)
  Steel/Rock | BST 330 (50/70/100/40/40/30) | Abilities: Sturdy / Rock Head / Heavy Metal
  Engine stats @252 (neutral/positive): Sturdy: Atk 239/262, SpA 179/196, Spe 159/174 — Rock Head: Atk 239/262, SpA 179/196, Spe 159/174 — Heavy Metal: Atk 239/262, SpA 179/196, Spe 159/174
  Item: **free**
  STAB: Steel Steel Roller 130P · Rock Head Smash 150P
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Dragon Dragon Rush 100P, Ground Earthquake 100P, Ghost Shadow Claw 70P, Flying Aerial Ace 60P
  Special coverage: Ground Earth Power 90S, Normal Uproar 90S, Electric Shock Wave 60S, Water Water Pulse 60S

**Arrokuda** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 280 (41/63/40/40/30/66) | Abilities: Swift Swim / Propeller Tail
  Engine stats @252 (neutral/positive): Swift Swim: Atk 225/247, SpA 179/196, Spe 231/254 — Propeller Tail: Atk 225/247, SpA 179/196, Spe 231/254
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Dark Crunch 80P, Ground Drill Run 80P
  Special coverage: Normal Tera Blast 80S

**Articuno** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ice/Flying | BST 580 (90/85/100/95/125/85) | Abilities: Pressure / Snow Cloak
  Engine stats @252 (neutral/positive): Pressure: Atk 269/295, SpA 289/317, Spe 269/295 — Snow Cloak: Atk 269/295, SpA 289/317, Spe 269/295
  Item: **free**
  STAB: Ice Blizzard 120S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Fighting Rock Smash 40P
  Special coverage: Psychic Extrasensory 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Water Bubble Beam 65S, Rock Ancient Power 60S, Ghost Ominous Wind 60S

**Axew** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dragon | BST 320 (46/87/60/30/40/57) | Abilities: Rivalry / Mold Breaker / Unnerve
  Engine stats @252 (neutral/positive): Rivalry: Atk 273/300, SpA 159/174, Spe 213/234 — Mold Breaker: Atk 273/300, SpA 159/174, Spe 213/234 — Unnerve: Atk 273/300, SpA 159/174, Spe 213/234
  Item: **free**
  STAB: Dragon Outrage 120P
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Water Aqua Tail 90P, Bug First Impression 90P
  Special coverage: Water Surf 95S, Normal Tera Blast 80S, Fire Incinerate 60S, Electric Shock Wave 60S, Dark Snarl 55S

**Azurill** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Fairy | BST 190 (50/20/40/20/40/20) | Abilities: Thick Fat / Huge Power / Sap Sipper
  Engine stats @252 (neutral/positive): Thick Fat: Atk 139/152, SpA 139/152, Spe 139/152 — Huge Power: Atk 278/304, SpA 139/152, Spe 139/152 — Sap Sipper: Atk 139/152, SpA 139/152, Spe 139/152
  Item: **free**
  STAB: Normal Double-Edge 120P · Fairy Alluring Voice 80S **(wrong category)**
  Physical coverage: Steel Iron Tail 100P, Flying Bounce 85 (charge)P, Water Waterfall 80P, Dark Knock Off 65P, Rock Rollout 30P
  Special coverage: Ice Blizzard 120S, Water Muddy Water 95S, Ground Mud Shot 55S

**Bagon** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dragon | BST 300 (45/75/60/40/30/50) | Abilities: Rock Head / Sheer Force
  Engine stats @252 (neutral/positive): Rock Head: Atk 249/273, SpA 179/196, Spe 199/218 — Sheer Force: Atk 249/273, SpA 179/196, Spe 199/218
  Item: **free**
  STAB: Dragon Outrage 120P
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Fighting Brick Break 75P, Rock Rock Slide 75P
  Special coverage: Fire Fire Blast 120S, Water Hydro Pump 120S, Normal Hyper Voice 90S, Ground Mud-Slap 20S

**Baltoy** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground/Psychic | BST 300 (40/40/55/40/70/55) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 179/196, SpA 179/196, Spe 209/229
  Item: **free**
  STAB: Ground Earthquake 100P · Psychic Dream Eater 100S
  Physical coverage: Normal Explosion 250P, Rock Rock Slide 75P, Steel Gyro Ball 26P
  Special coverage: Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Rock Ancient Power 60S

**Banette** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ghost | BST 455 (64/115/65/83/63/65) | Abilities: Insomnia / Frisk / Cursed Body
  Engine stats @252 (neutral/positive): Insomnia: Atk 329/361, SpA 265/291, Spe 229/251 — Frisk: Atk 329/361, SpA 265/291, Spe 229/251 — Cursed Body: Atk 329/361, SpA 265/291, Spe 229/251
  Item: **free**
  STAB: Ghost Poltergeist 110P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Dark Foul Play 95P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Fire Burning Jealousy 70S

**Barboach** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Ground | BST 288 (50/48/43/46/41/60) | Abilities: Oblivious / Anticipation / Hydration
  Engine stats @252 (neutral/positive): Oblivious: Atk 195/214, SpA 191/210, Spe 219/240 — Anticipation: Atk 195/214, SpA 191/210, Spe 219/240 — Hydration: Atk 195/214, SpA 191/210, Spe 219/240
  Item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Rock Stone Edge 100P, Flying Bounce 85 (charge)P, Psychic Zen Headbutt 80P, Electric Spark 65P
  Special coverage: Ice Blizzard 120S, Psychic Future Sight 120S, Normal Tera Blast 80S

**Basculin** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Water | BST 460 (70/92/65/80/55/98) | Abilities: Reckless / Adaptability / Mold Breaker
  Engine stats @252 (neutral/positive): Reckless: Atk 283/311, SpA 259/284, Spe 295/324 — Adaptability: Atk 283/311, SpA 259/284, Spe 295/324 — Mold Breaker: Atk 283/311, SpA 259/284, Spe 295/324
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Fighting Superpower 120P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Dark Crunch 80P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Ground Mud Shot 55S, Fighting Final Gambit fixedS

**Bastiodon** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Rock/Steel | BST 495 (60/52/168/47/138/30) | Abilities: Sturdy / Soundproof
  Engine stats @252 (neutral/positive): Sturdy: Atk 203/223, SpA 193/212, Spe 159/174 — Soundproof: Atk 203/223, SpA 193/212, Spe 159/174
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Steel Steel Beam 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Dark Foul Play 95P, Fighting Body Press 80P, Ice Avalanche 60P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Ground Earth Power 90S, Normal Tera Blast 80S

**Bayleef** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 405 (60/62/80/63/80/60) | Abilities: Overgrow / Leaf Guard
  Engine stats @252 (neutral/positive): Overgrow: Atk 223/245, SpA 225/247, Spe 219/240 — Leaf Guard: Atk 223/245, SpA 225/247, Spe 219/240
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Stomping Tantrum 75P, Dark Knock Off 65P, Bug Fury Cutter 40P, Fighting Rock Smash 40P
  Special coverage: Normal Wring Out 120S, Rock Ancient Power 60S, Ground Mud-Slap 20S

**Beartic** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ice | BST 505 (95/130/80/70/80/50) | Abilities: Snow Cloak / Slush Rush / Swift Swim
  Engine stats @252 (neutral/positive): Snow Cloak: Atk 359/394, SpA 239/262, Spe 199/218 — Slush Rush: Atk 359/394, SpA 239/262, Spe 199/218 — Swift Swim: Atk 359/394, SpA 239/262, Spe 199/218
  Item: **free**
  STAB: Ice Icicle Crash 85P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Heavy Slam 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Fairy Play Rough 90P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Tera Blast 80S, Grass Grass Knot 60S, Ground Mud Shot 55S, Dark Snarl 55S

**Beautifly** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Bug/Flying | BST 395 (60/70/50/100/50/65) | Abilities: Swarm / Rivalry
  Engine stats @252 (neutral/positive): Swarm: Atk 239/262, SpA 299/328, Spe 229/251 — Rivalry: Atk 239/262, SpA 299/328, Spe 229/251
  Item: **free**
  STAB: Bug Bug Buzz 90S · Flying Acrobatics 110P
  Physical coverage: Normal Double-Edge 120P, Dark Thief 60P, Poison Poison Sting 15P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Psychic 90S, Ghost Shadow Ball 80S, Poison Venoshock 65S, Normal Hidden Power 60S, Electric Electroweb 55S

**Beedrill** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Bug/Poison | BST 395 (65/90/40/45/80/75) | Abilities: Swarm / Sniper
  Engine stats @252 (neutral/positive): Swarm: Atk 279/306, SpA 189/207, Spe 249/273 — Sniper: Atk 279/306, SpA 189/207, Spe 249/273
  Item: **free**
  STAB: Bug Twineedle 50x2P · Poison Poison Jab 80P
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Flying Acrobatics 110P, Ground Drill Run 80P, Dark Throat Chop 80P, Fighting Brick Break 75P
  Special coverage: Grass Solar Beam 120 (charge)S, Flying Air Cutter 60S, Normal Hidden Power 60S, Ghost Ominous Wind 60S, Electric Electroweb 55S

**Beheeyem** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Psychic | BST 485 (75/75/75/125/95/40) | Abilities: Telepathy / Synchronize / Analytic
  Engine stats @252 (neutral/positive): Telepathy: Atk 249/273, SpA 349/383, Spe 179/196 — Synchronize: Atk 249/273, SpA 349/383, Spe 179/196 — Analytic: Atk 249/273, SpA 349/383, Spe 179/196
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Rock Rock Slide 75P, Steel Steel Wing 70P, Dark Thief 60P, Ghost Astonish 30P
  Special coverage: Rock Meteor Beam 120 (charge)S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S

**Beldum** — species, **ZU**, source: imported (redgpt-zu-floor)
  Steel/Psychic | BST 300 (40/55/80/35/60/30) | Abilities: Clear Body / Light Metal
  Engine stats @252 (neutral/positive): Clear Body: Atk 209/229, SpA 169/185, Spe 159/174 — Light Metal: Atk 209/229, SpA 169/185, Spe 159/174
  Item: **free**
  STAB: Steel Steel Beam 140S · Psychic Zen Headbutt 80P
  Physical coverage: Normal Take Down 90P
  Special coverage: Normal Tera Blast 80S

**Bellsprout** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Poison | BST 300 (50/75/35/70/30/40) | Abilities: Chlorophyll / Gluttony
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 249/273, SpA 239/262, Spe 179/196 — Gluttony: Atk 249/273, SpA 239/262, Spe 179/196
  Item: **free**
  STAB: Grass Leaf Storm 140S · Poison Belch 120S
  Physical coverage: Normal Double-Edge 120P, Bug Leech Life 80P, Dark Sucker Punch 80P
  Special coverage: Normal Wring Out 120S, Bug Infestation 20S

**Bergmite** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ice | BST 304 (55/69/85/32/35/28) | Abilities: Own Tempo / Ice Body / Sturdy
  Engine stats @252 (neutral/positive): Own Tempo: Atk 237/260, SpA 163/179, Spe 155/170 — Ice Body: Atk 237/260, SpA 163/179, Spe 155/170 — Sturdy: Atk 237/260, SpA 163/179, Spe 155/170
  Item: **free**
  STAB: Ice Ice Spinner 80P
  Physical coverage: Normal Double-Edge 120P, Rock Stone Edge 100P, Dark Crunch 80P, Ground Bulldoze 60P, Steel Gyro Ball 40P, Fighting Rock Smash 40P
  Special coverage: Water Surf 95S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Psychic Mirror Coat fixedS

**Bibarel** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Normal/Water | BST 410 (79/85/60/55/60/71) | Abilities: Simple / Unaware / Moody
  Engine stats @252 (neutral/positive): Simple: Atk 269/295, SpA 209/229, Spe 241/265 — Unaware: Atk 269/295, SpA 209/229, Spe 241/265 — Moody: Atk 269/295, SpA 209/229, Spe 241/265
  Item: **free**
  STAB: Normal Last Resort 140P · Water Surf 95S
  Physical coverage: Fighting Focus Punch 150P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Flying Pluck 60P, Bug Fury Cutter 40P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Ground Mud-Slap 20S

**Bidoof** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 250 (59/45/40/35/40/31) | Abilities: Simple / Unaware / Moody
  Engine stats @252 (neutral/positive): Simple: Atk 189/207, SpA 169/185, Spe 161/177 — Unaware: Atk 189/207, SpA 169/185, Spe 161/177 — Moody: Atk 189/207, SpA 169/185, Spe 161/177
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Superpower 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Water Aqua Tail 90P, Dark Crunch 80P, Flying Pluck 60P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Ground Mud-Slap 20S

**Binacle** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Water | BST 306 (42/52/67/39/56/50) | Abilities: Tough Claws / Sniper / Pickpocket
  Engine stats @252 (neutral/positive): Tough Claws: Atk 203/223, SpA 177/194, Spe 199/218 — Sniper: Atk 203/223, SpA 177/194, Spe 199/218 — Pickpocket: Atk 203/223, SpA 177/194, Spe 199/218
  Item: **free**
  STAB: Rock Stone Edge 100P · Water Surf 95S
  Physical coverage: Normal Return 102P, Fighting Cross Chop 100P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Poison Poison Jab 80P, Bug X-Scissor 80P
  Special coverage: Ice Blizzard 120S, Poison Sludge Wave 95S, Normal Uproar 90S, Grass Grass Knot 60S, Ground Mud Shot 55S, Bug Infestation 20S

**Blipbug** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 180 (25/20/20/25/45/45) | Abilities: Swarm / Compound Eyes / Telepathy
  Engine stats @252 (neutral/positive): Swarm: Atk 139/152, SpA 149/163, Spe 189/207 — Compound Eyes: Atk 139/152, SpA 149/163, Spe 189/207 — Telepathy: Atk 139/152, SpA 149/163, Spe 189/207
  Item: **free**
  STAB: Bug Struggle Bug 50S
  Physical coverage: **none**
  Special coverage: **none**

**Blitzle** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric | BST 295 (45/60/32/50/32/76) | Abilities: Lightning Rod / Motor Drive / Sap Sipper
  Engine stats @252 (neutral/positive): Lightning Rod: Atk 219/240, SpA 199/218, Spe 251/276 — Motor Drive: Atk 219/240, SpA 199/218, Spe 251/276 — Sap Sipper: Atk 219/240, SpA 199/218, Spe 251/276
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Fighting Double Kick 50x2P, Flying Bounce 85 (charge)P, Steel Smart Strike 70P, Fire Flame Charge 50P, Grass Trailblaze 50P
  Special coverage: Normal Uproar 90S, Bug Signal Beam 75S

**Boldore** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock | BST 390 (70/105/105/50/40/20) | Abilities: Sturdy / Weak Armor / Sand Force
  Engine stats @252 (neutral/positive): Sturdy: Atk 309/339, SpA 199/218, Spe 139/152 — Weak Armor: Atk 309/339, SpA 199/218, Spe 139/152 — Sand Force: Atk 309/339, SpA 199/218, Spe 139/152
  Item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Fighting Body Press 80P, Steel Heavy Slam 60P
  Special coverage: Ground Earth Power 90S, Steel Flash Cannon 80S, Normal Hidden Power 60S

**Boltund** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Electric | BST 490 (69/90/60/90/60/121) | Abilities: Strong Jaw / Competitive
  Engine stats @252 (neutral/positive): Strong Jaw: Atk 279/306, SpA 279/306, Spe 341/375 — Competitive: Atk 279/306, SpA 279/306, Spe 341/375
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Fire Fire Fang 65P
  Special coverage: Normal Hyper Voice 90S, Dark Snarl 55S

**Bonsly** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock | BST 290 (50/80/95/10/45/10) | Abilities: Sturdy / Rock Head / Rattled
  Engine stats @252 (neutral/positive): Sturdy: Atk 259/284, SpA 119/130, Spe 119/130 — Rock Head: Atk 259/284, SpA 119/130, Spe 119/130 — Rattled: Atk 259/284, SpA 119/130, Spe 119/130
  Item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Dark Foul Play 95P, Fighting Brick Break 75P, Grass Trailblaze 50P
  Special coverage: Ground Earth Power 90S, Normal Uproar 90S, Grass Grass Knot 60S

**Bouffalant** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Normal | BST 490 (95/110/95/40/95/55) | Abilities: Reckless / Sap Sipper / Soundproof
  Engine stats @252 (neutral/positive): Reckless: Atk 319/350, SpA 179/196, Spe 209/229 — Sap Sipper: Atk 319/350, SpA 179/196, Spe 209/229 — Soundproof: Atk 319/350, SpA 179/196, Spe 209/229
  Item: **free**
  STAB: Normal Skull Bash 130P
  Physical coverage: Fighting Close Combat 120P, Bug Megahorn 120P, Dragon Outrage 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Electric Wild Charge 90P
  Special coverage: Poison Belch 120S, Water Surf 95S, Ground Mud Shot 55S

**Bounsweet** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 210 (42/30/38/30/38/32) | Abilities: Leaf Guard / Oblivious / Sweet Veil
  Engine stats @252 (neutral/positive): Leaf Guard: Atk 159/174, SpA 159/174, Spe 163/179 — Oblivious: Atk 159/174, SpA 159/174, Spe 163/179 — Sweet Veil: Atk 159/174, SpA 159/174, Spe 163/179
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Return 102P, Fairy Play Rough 90P, Flying Bounce 85 (charge)P, Psychic Zen Headbutt 80P
  Special coverage: Fairy Dazzling Gleam 80S, Normal Tera Blast 80S

**Braixen** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 409 (59/59/58/90/70/73) | Abilities: Blaze / Magician
  Engine stats @252 (neutral/positive): Blaze: Atk 217/238, SpA 279/306, Spe 245/269 — Magician: Atk 217/238, SpA 279/306, Spe 245/269
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Electric Thunder Punch 75P, Fighting Low Kick 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Tera Blast 80S, Electric Shock Wave 60S, Ground Mud Shot 55S

**Bramblin** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Ghost | BST 275 (40/65/30/45/35/60) | Abilities: Wind Rider / Infiltrator
  Engine stats @252 (neutral/positive): Wind Rider: Atk 229/251, SpA 189/207, Spe 219/240 — Infiltrator: Atk 229/251, SpA 189/207, Spe 219/240
  Item: **free**
  STAB: Grass Leaf Storm 140S · Ghost Poltergeist 110P
  Physical coverage: Normal Facade 70P, Dark Thief 60P, Bug Pounce 50P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S, Bug Infestation 20S

**Brionne** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 420 (60/69/69/91/81/50) | Abilities: Torrent / Liquid Voice
  Engine stats @252 (neutral/positive): Torrent: Atk 237/260, SpA 281/309, Spe 199/218 — Liquid Voice: Atk 237/260, SpA 281/309, Spe 199/218
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Steel Iron Tail 100P, Fairy Play Rough 90P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fairy Moonblast 95S, Normal Hyper Voice 90S

**Bronzor** — species, **ZU**, source: imported (redgpt-zu-floor)
  Steel/Psychic | BST 300 (57/24/86/24/86/23) | Abilities: Levitate / Heatproof / Heavy Metal
  Engine stats @252 (neutral/positive): Levitate: Atk 147/161, SpA 147/161, Spe 145/159 — Heatproof: Atk 147/161, SpA 147/161, Spe 145/159 — Heavy Metal: Atk 147/161, SpA 147/161, Spe 145/159
  Item: **free**
  STAB: Steel Steel Beam 140S · Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Ground Earthquake 100P, Ice Ice Spinner 80P, Rock Rock Blast 25x2-5P, Dark Feint Attack 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Rock Power Gem 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Electric Charge Beam 50S

**Budew** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Poison | BST 280 (40/30/35/50/70/55) | Abilities: Natural Cure / Poison Point / Leaf Guard
  Engine stats @252 (neutral/positive): Natural Cure: Atk 159/174, SpA 199/218, Spe 209/229 — Poison Point: Atk 159/174, SpA 199/218, Spe 209/229 — Leaf Guard: Atk 159/174, SpA 199/218, Spe 209/229
  Item: **free**
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Return 102P, Bug Pin Missile 25x2-5P
  Special coverage: Normal Uproar 90S, Fairy Dazzling Gleam 80S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S, Ground Mud-Slap 20S

**Buizel** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 330 (55/65/35/60/30/85) | Abilities: Swift Swim / Water Veil
  Engine stats @252 (neutral/positive): Swift Swim: Atk 229/251, SpA 219/240, Spe 269/295 — Water Veil: Atk 229/251, SpA 219/240, Spe 269/295
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Normal Tera Blast 80S, Ground Mud-Slap 20S

**Bulbasaur** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Poison | BST 318 (45/49/49/65/65/45) | Abilities: Overgrow / Chlorophyll
  Engine stats @252 (neutral/positive): Overgrow: Atk 197/216, SpA 229/251, Spe 189/207 — Chlorophyll: Atk 197/216, SpA 229/251, Spe 189/207
  Item: **free**
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Dark Knock Off 65P, Bug Fury Cutter 40P, Fighting Rock Smash 40P
  Special coverage: Normal Tera Blast 80S, Ground Mud-Slap 20S

**Buneary** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 350 (55/66/44/44/56/85) | Abilities: Run Away / Klutz / Limber
  Engine stats @252 (neutral/positive): Run Away: Atk 231/254, SpA 187/205, Spe 269/295 — Klutz: Atk 231/254, SpA 187/205, Spe 269/295 — Limber: Atk 231/254, SpA 187/205, Spe 269/295
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Flying Bounce 85 (charge)P, Fire Fire Punch 75P
  Special coverage: Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Electric Thunderbolt 95S, Ghost Shadow Ball 80S, Water Water Pulse 60S, Ground Mud-Slap 20S

**Bunnelby** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 237 (38/36/38/32/36/57) | Abilities: Pickup / Cheek Pouch / Huge Power
  Engine stats @252 (neutral/positive): Pickup: Atk 171/188, SpA 163/179, Spe 213/234 — Cheek Pouch: Atk 171/188, SpA 163/179, Spe 213/234 — Huge Power: Atk 342/376, SpA 163/179, Spe 213/234
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Double Kick 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Electric Wild Charge 90P, Flying Bounce 85 (charge)P
  Special coverage: Water Surf 95S, Poison Sludge Bomb 90S, Grass Grass Knot 60S, Ground Mud Shot 55S

**Burmy** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 224 (40/29/45/29/45/36) | Abilities: Shed Skin / Overcoat
  Engine stats @252 (neutral/positive): Shed Skin: Atk 157/172, SpA 157/172, Spe 171/188 — Overcoat: Atk 157/172, SpA 157/172, Spe 171/188
  Item: **free**
  STAB: Bug Bug Bite 60P
  Physical coverage: Normal Tackle 50P
  Special coverage: Normal Hidden Power 60S, Electric Electroweb 55S

**Butterfree** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Bug/Flying | BST 395 (60/45/50/90/80/70) | Abilities: Compound Eyes / Tinted Lens
  Engine stats @252 (neutral/positive): Compound Eyes: Atk 189/207, SpA 279/306, Spe 239/262 — Tinted Lens: Atk 189/207, SpA 279/306, Spe 239/262
  Item: **free**
  STAB: Bug Bug Buzz 90S · Flying Hurricane 120S
  Physical coverage: Normal Double-Edge 120P, Dark Thief 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ghost Shadow Ball 80S, Normal Razor Wind 80 (charge)S, Poison Venoshock 65S, Electric Electroweb 55S

**Cacnea** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 335 (50/85/40/85/40/35) | Abilities: Sand Veil / Water Absorb
  Engine stats @252 (neutral/positive): Sand Veil: Atk 269/295, SpA 269/295, Spe 169/185 — Water Absorb: Atk 269/295, SpA 269/295, Spe 169/185
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Poison Poison Jab 80P, Bug Pin Missile 25x2-5P
  Special coverage: Poison Belch 120S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Ground Mud-Slap 20S

**Cacturne** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass/Dark | BST 475 (70/115/60/115/60/55) | Abilities: Sand Veil / Water Absorb
  Engine stats @252 (neutral/positive): Sand Veil: Atk 329/361, SpA 329/361, Spe 209/229 — Water Absorb: Atk 329/361, SpA 329/361, Spe 209/229
  Item: **free**
  STAB: Grass Leaf Storm 140S · Dark Foul Play 95P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Dig 100 (charge)P, Bug Lunge 80P, Poison Poison Jab 80P, Psychic Zen Headbutt 80P
  Special coverage: Poison Belch 120S, Fighting Focus Blast 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Mud-Slap 20S

**Calyrex** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Psychic/Grass | BST 500 (100/80/80/80/80/80) | Abilities: Unnerve
  Engine stats @252 (neutral/positive): Unnerve: Atk 259/284, SpA 259/284, Spe 259/284
  Item: **free**
  STAB: Psychic Future Sight 120S · Grass Leaf Storm 140S
  Physical coverage: Normal Take Down 90P, Fighting Body Press 80P
  Special coverage: Bug Pollen Puff 90S, Normal Tera Blast 80S, Ground Mud Shot 55S, Dark Snarl 55S, Fairy Draining Kiss 50S

**Camerupt** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fire/Ground | BST 460 (70/100/70/105/75/40) | Abilities: Magma Armor / Solid Rock / Anger Point
  Engine stats @252 (neutral/positive): Magma Armor: Atk 299/328, SpA 309/339, Spe 179/196 — Solid Rock: Atk 299/328, SpA 309/339, Spe 179/196 — Anger Point: Atk 299/328, SpA 309/339, Spe 179/196
  Item: **free**
  STAB: Fire Eruption 150S · Ground Earthquake 100P
  Physical coverage: Normal Explosion 250P, Steel Heavy Slam 100P, Rock Stone Edge 100P, Fighting Body Press 80P, Psychic Zen Headbutt 80P, Dark Lash Out 75P
  Special coverage: Grass Solar Beam 120 (charge)S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Rock Ancient Power 60S

**Capsakid** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 304 (50/62/40/62/40/50) | Abilities: Chlorophyll / Insomnia / Klutz
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 223/245, SpA 223/245, Spe 199/218 — Insomnia: Atk 223/245, SpA 223/245, Spe 199/218 — Klutz: Atk 223/245, SpA 223/245, Spe 199/218
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Take Down 90P, Dark Crunch 80P, Psychic Zen Headbutt 80P, Ground Stomping Tantrum 75P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S

**Carbink** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Rock/Fairy | BST 500 (50/50/150/50/150/50) | Abilities: Clear Body / Sturdy
  Engine stats @252 (neutral/positive): Clear Body: Atk 199/218, SpA 199/218, Spe 199/218 — Sturdy: Atk 199/218, SpA 199/218, Spe 199/218
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Fairy Misty Explosion 100S
  Physical coverage: Normal Explosion 250P, Fighting Body Press 80P, Steel Iron Head 80P, Ground Stomping Tantrum 75P
  Special coverage: Ground Earth Power 90S, Psychic Psychic 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S

**Carkol** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Fire | BST 410 (80/60/90/60/70/50) | Abilities: Steam Engine / Flame Body / Flash Fire
  Engine stats @252 (neutral/positive): Steam Engine: Atk 219/240, SpA 219/240, Spe 199/218 — Flame Body: Atk 219/240, SpA 219/240, Spe 199/218 — Flash Fire: Atk 219/240, SpA 219/240, Spe 199/218
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Fire Overheat 140S
  Physical coverage: Normal Explosion 250P, Ground Dig 100 (charge)P, Fighting Body Press 80P, Steel Iron Head 80P
  Special coverage: Water Scald 80S, Normal Tera Blast 80S, Ground Scorching Sands 70S

**Carnivine** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Grass | BST 454 (74/100/72/90/72/46) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 299/328, SpA 279/306, Spe 191/210
  Item: **free**
  STAB: Grass Power Whip 120P
  Physical coverage: Normal Return 102P, Dark Crunch 80P, Bug Bug Bite 60P
  Special coverage: Normal Wring Out 120S, Poison Sludge Bomb 90S, Bug Infestation 20S, Ground Mud-Slap 20S

**Carracosta** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Water/Rock | BST 495 (74/108/133/83/65/32) | Abilities: Solid Rock / Sturdy / Swift Swim
  Engine stats @252 (neutral/positive): Solid Rock: Atk 315/346, SpA 265/291, Spe 163/179 — Sturdy: Atk 315/346, SpA 265/291, Spe 163/179 — Swift Swim: Atk 315/346, SpA 265/291, Spe 163/179
  Item: **free**
  STAB: Water Hydro Pump 120S · Rock Meteor Beam 120 (charge)S
  Physical coverage: Fighting Superpower 120P, Normal Return 102P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P, Psychic Zen Headbutt 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Ground Earth Power 90S, Normal Hidden Power 60S

**Carvanha** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Dark | BST 305 (45/90/20/65/20/65) | Abilities: Rough Skin / Speed Boost
  Engine stats @252 (neutral/positive): Rough Skin: Atk 279/306, SpA 229/251, Spe 229/251 — Speed Boost: Atk 279/306, SpA 229/251, Spe 229/251
  Item: **free**
  STAB: Water Hydro Pump 120S · Dark Crunch 80P
  Physical coverage: Normal Double-Edge 120P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Dragon Scale Shot 25x2-5P, Ice Ice Fang 65P, Poison Poison Fang 50P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Rock Ancient Power 60S, Ground Mud-Slap 20S

**Cascoon** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 205 (50/35/55/25/25/15) | Abilities: Shed Skin
  Engine stats @252 (neutral/positive): Shed Skin: Atk 169/185, SpA 149/163, Spe 129/141
  Item: **free**
  STAB: Bug Bug Bite 60P
  Physical coverage: Normal Tackle 50P, Poison Poison Sting 15P
  Special coverage: Electric Electroweb 55S, Normal Snore 50S

**Castform** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Normal | BST 420 (70/70/70/70/70/70) | Abilities: Forecast
  Engine stats @252 (neutral/positive): Forecast: Atk 239/262, SpA 239/262, Spe 239/262
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Ice Avalanche 60P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Future Sight 120S, Flying Hurricane 120S, Water Hydro Pump 120S, Electric Thunder 120S

**Castform-Rainy** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Water | BST 420 (70/70/70/70/70/70) | Abilities: Forecast
  Engine stats @252 (neutral/positive): Forecast: Atk 239/262, SpA 239/262, Spe 239/262
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Last Resort 140P, Ice Avalanche 60P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Future Sight 120S, Flying Hurricane 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S

**Castform-Snowy** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Ice | BST 420 (70/70/70/70/70/70) | Abilities: Forecast
  Engine stats @252 (neutral/positive): Forecast: Atk 239/262, SpA 239/262, Spe 239/262
  Item: **free**
  STAB: Ice Blizzard 120S
  Physical coverage: Normal Last Resort 140P, Dark Thief 60P
  Special coverage: Fire Fire Blast 120S, Psychic Future Sight 120S, Flying Hurricane 120S, Water Hydro Pump 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S

**Castform-Sunny** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Fire | BST 420 (70/70/70/70/70/70) | Abilities: Forecast
  Engine stats @252 (neutral/positive): Forecast: Atk 239/262, SpA 239/262, Spe 239/262
  Item: **free**
  STAB: Fire Fire Blast 120S
  Physical coverage: Normal Last Resort 140P, Ice Avalanche 60P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Psychic Future Sight 120S, Flying Hurricane 120S, Water Hydro Pump 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S

**Caterpie** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 195 (45/30/35/20/20/45) | Abilities: Shield Dust / Run Away
  Engine stats @252 (neutral/positive): Shield Dust: Atk 159/174, SpA 139/152, Spe 189/207 — Run Away: Atk 159/174, SpA 139/152, Spe 189/207
  Item: **free**
  STAB: Bug Bug Bite 60P
  Physical coverage: Normal Tackle 50P
  Special coverage: Electric Electroweb 55S, Normal Snore 50S

**Cetoddle** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ice | BST 334 (108/68/45/30/40/43) | Abilities: Thick Fat / Snow Cloak / Sheer Force
  Engine stats @252 (neutral/positive): Thick Fat: Atk 235/258, SpA 159/174, Spe 185/203 — Snow Cloak: Atk 235/258, SpA 159/174, Spe 185/203 — Sheer Force: Atk 235/258, SpA 159/174, Spe 185/203
  Item: **free**
  STAB: Ice Icicle Crash 85P
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Ground Earthquake 100P, Fairy Play Rough 90P, Water Liquidation 85P, Flying Bounce 85 (charge)P
  Special coverage: Normal Hyper Voice 90S, Water Water Pulse 60S

**Charcadet** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 255 (40/50/40/50/40/35) | Abilities: Flash Fire / Flame Body
  Engine stats @252 (neutral/positive): Flash Fire: Atk 199/218, SpA 199/218, Spe 169/185 — Flame Body: Atk 199/218, SpA 199/218, Spe 169/185
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Take Down 90P, Ghost Astonish 30P
  Special coverage: Normal Tera Blast 80S, Poison Clear Smog 50S, Ghost Night Shade fixedS

**Charizard** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fire/Flying | BST 534 (78/84/78/109/85/100) | Abilities: Blaze / Solar Power
  Engine stats @252 (neutral/positive): Blaze: Atk 267/293, SpA 317/348, Spe 299/328 — Solar Power: Atk 267/293, SpA 317/348, Spe 299/328
  Item: **free**
  STAB: Fire Overheat 140S · Flying Hurricane 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Dragon Dragon Pulse 90S, Normal Tera Blast 80S, Ground Scorching Sands 70S, Rock Ancient Power 60S

**Charjabug** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Electric | BST 400 (57/82/95/55/75/36) | Abilities: Battery
  Engine stats @252 (neutral/positive): Battery: Atk 263/289, SpA 209/229, Spe 171/188
  Item: **free**
  STAB: Bug Lunge 80P · Electric Thunder 120S
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Ground Dig 100 (charge)P, Dark Crunch 80P, Poison Poison Jab 80P
  Special coverage: Normal Tera Blast 80S, Ground Mud Shot 55S

**Charmander** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 309 (39/52/43/60/50/65) | Abilities: Blaze / Solar Power
  Engine stats @252 (neutral/positive): Blaze: Atk 203/223, SpA 219/240, Spe 229/251 — Solar Power: Atk 203/223, SpA 219/240, Spe 229/251
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Ground Dig 100 (charge)P
  Special coverage: Fighting Focus Blast 120S, Dragon Dragon Pulse 90S, Normal Tera Blast 80S, Flying Air Cutter 60S, Rock Ancient Power 60S, Ground Mud-Slap 20S

**Charmeleon** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 405 (58/64/58/80/65/80) | Abilities: Blaze / Solar Power
  Engine stats @252 (neutral/positive): Blaze: Atk 227/249, SpA 259/284, Spe 259/284 — Solar Power: Atk 227/249, SpA 259/284, Spe 259/284
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Ground Dig 100 (charge)P
  Special coverage: Fighting Focus Blast 120S, Dragon Dragon Pulse 90S, Normal Tera Blast 80S, Flying Air Cutter 60S, Rock Ancient Power 60S, Ground Mud-Slap 20S

**Chatot** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Normal/Flying | BST 411 (76/65/45/92/42/91) | Abilities: Keen Eye / Tangled Feet / Big Pecks
  Engine stats @252 (neutral/positive): Keen Eye: Atk 229/251, SpA 283/311, Spe 281/309 — Tangled Feet: Atk 229/251, SpA 283/311, Spe 281/309 — Big Pecks: Atk 229/251, SpA 283/311, Spe 281/309
  Item: **free**
  STAB: Normal Boomburst 140S · Flying Sky Attack 140 (charge)P
  Physical coverage: Steel Steel Wing 70P, Bug U-turn 70P, Dark Thief 60P
  Special coverage: Psychic Synchronoise 120S, Fire Heat Wave 100S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Cherrim** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Grass | BST 450 (70/60/70/87/78/85) | Abilities: Flower Gift
  Engine stats @252 (neutral/positive): Flower Gift: Atk 219/240, SpA 273/300, Spe 269/295
  Item: **free**
  STAB: Grass Solar Blade 125 (charge)P
  Physical coverage: Normal Return 102P, Fairy Play Rough 90P, Rock Rollout 30P
  Special coverage: Bug Pollen Puff 90S, Fairy Dazzling Gleam 80S, Normal Hidden Power 60S

**Cherrim-Sunshine** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Grass | BST 450 (70/60/70/87/78/85) | Abilities: Flower Gift
  Engine stats @252 (neutral/positive): Flower Gift: Atk 219/240, SpA 273/300, Spe 269/295
  Item: **free**
  STAB: Grass Solar Blade 125 (charge)P
  Physical coverage: Normal Return 102P, Fairy Play Rough 90P, Rock Rollout 30P
  Special coverage: Bug Pollen Puff 90S, Fairy Dazzling Gleam 80S, Normal Hidden Power 60S

**Cherubi** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 275 (45/35/45/62/53/35) | Abilities: Chlorophyll
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 169/185, SpA 223/245, Spe 169/185
  Item: **free**
  STAB: Grass Solar Beam 120 (charge)S
  Physical coverage: Normal Return 102P, Rock Rollout 30P
  Special coverage: Bug Pollen Puff 90S, Fairy Dazzling Gleam 80S, Normal Hidden Power 60S

**Chespin** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 313 (56/61/65/48/45/38) | Abilities: Overgrow / Bulletproof
  Engine stats @252 (neutral/positive): Overgrow: Atk 221/243, SpA 195/214, Spe 175/192 — Bulletproof: Atk 221/243, SpA 195/214, Spe 175/192
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Return 102P, Dragon Dual Chop 50x2P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ground Dig 100 (charge)P
  Special coverage: Poison Sludge Bomb 90S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Chewtle** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 284 (50/64/50/38/38/44) | Abilities: Strong Jaw / Shell Armor / Swift Swim
  Engine stats @252 (neutral/positive): Strong Jaw: Atk 227/249, SpA 175/192, Spe 187/205 — Shell Armor: Atk 227/249, SpA 175/192, Spe 187/205 — Swift Swim: Atk 227/249, SpA 175/192, Spe 187/205
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Skull Bash 130P, Dark Crunch 80P, Poison Poison Jab 80P, Dragon Scale Shot 25x2-5P, Ground Stomping Tantrum 75P, Bug Skitter Smack 70P
  Special coverage: Normal Tera Blast 80S, Ground Mud Shot 55S

**Chikorita** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 318 (45/49/65/49/65/45) | Abilities: Overgrow / Leaf Guard
  Engine stats @252 (neutral/positive): Overgrow: Atk 197/216, SpA 197/216, Spe 189/207 — Leaf Guard: Atk 197/216, SpA 197/216, Spe 189/207
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Bug Fury Cutter 40P, Fighting Counter fixedP
  Special coverage: Normal Wring Out 120S, Rock Ancient Power 60S, Ground Mud-Slap 20S

**Chimchar** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 309 (44/58/44/58/44/61) | Abilities: Blaze / Iron Fist
  Engine stats @252 (neutral/positive): Blaze: Atk 215/236, SpA 215/236, Spe 221/243 — Iron Fist: Atk 215/236, SpA 215/236, Spe 221/243
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Ground Dig 100 (charge)P
  Special coverage: Normal Uproar 90S, Grass Grass Knot 60S, Fighting Vacuum Wave 40S, Ground Mud-Slap 20S

**Chimecho** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Psychic | BST 455 (75/50/80/95/90/65) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 199/218, SpA 289/317, Spe 229/251
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Dark Knock Off 65P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Grass Energy Ball 90S, Normal Hyper Voice 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Electric Shock Wave 60S

**Chinchou** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Electric | BST 330 (75/38/38/56/56/67) | Abilities: Volt Absorb / Illuminate / Water Absorb
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 175/192, SpA 211/232, Spe 233/256 — Illuminate: Atk 175/192, SpA 211/232, Spe 233/256 — Water Absorb: Atk 175/192, SpA 211/232, Spe 233/256
  Item: **free**
  STAB: Water Hydro Pump 120S · Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Flying Bounce 85 (charge)P, Dark Sucker Punch 80P
  Special coverage: Ice Blizzard 120S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Psychic Psybeam 65S

**Chingling** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 285 (45/30/50/65/50/45) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 159/174, SpA 229/251, Spe 189/207
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Dark Knock Off 65P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Grass Energy Ball 90S, Normal Hyper Voice 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Electric Shock Wave 60S

**Clamperl** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 345 (35/64/85/74/55/32) | Abilities: Shell Armor / Rattled
  Engine stats @252 (neutral/positive): Shell Armor: Atk 227/249, SpA 247/271, Spe 163/179 — Rattled: Atk 227/249, SpA 247/271, Spe 163/179
  Item: **free**
  STAB: Water Muddy Water 95S
  Physical coverage: Normal Double-Edge 120P
  Special coverage: Ice Blizzard 120S, Normal Hidden Power 60S

**Clauncher** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 330 (50/53/62/58/63/44) | Abilities: Mega Launcher
  Engine stats @252 (neutral/positive): Mega Launcher: Atk 205/225, SpA 215/236, Spe 187/205
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Flying Bounce 85 (charge)P, Rock Rock Slide 75P, Bug U-turn 70P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Poison Sludge Wave 95S, Fighting Aura Sphere 90S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S

**Clawitzer** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Water | BST 500 (71/73/88/120/89/59) | Abilities: Mega Launcher
  Engine stats @252 (neutral/positive): Mega Launcher: Atk 245/269, SpA 339/372, Spe 217/238
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Flying Bounce 85 (charge)P, Rock Rock Slide 75P, Bug U-turn 70P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S

**Cleffa** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fairy | BST 218 (50/25/28/45/55/15) | Abilities: Cute Charm / Magic Guard / Friend Guard
  Engine stats @252 (neutral/positive): Cute Charm: Atk 149/163, SpA 189/207, Spe 129/141 — Magic Guard: Atk 149/163, SpA 189/207, Spe 129/141 — Friend Guard: Atk 149/163, SpA 189/207, Spe 129/141
  Item: **free**
  STAB: Fairy Play Rough 90P
  Physical coverage: Normal Last Resort 140P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P, Dark Fling 30P, Rock Rollout 30P
  Special coverage: Fire Fire Blast 120S, Electric Zap Cannon 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Hyper Voice 90S, Ghost Shadow Ball 80S

**Clobbopus** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fighting | BST 310 (50/68/60/50/50/32) | Abilities: Limber / Technician
  Engine stats @252 (neutral/positive): Limber: Atk 235/258, SpA 199/218, Spe 163/179 — Technician: Atk 235/258, SpA 199/218, Spe 163/179
  Item: **free**
  STAB: Fighting Close Combat 120P
  Physical coverage: Normal Body Slam 85P, Water Liquidation 85P, Dark Sucker Punch 80P, Ice Ice Punch 75P
  Special coverage: Water Muddy Water 95S, Normal Round 60S, Ground Mud Shot 55S

**Cofagrigus** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Ghost | BST 483 (58/50/145/95/105/30) | Abilities: Mummy
  Engine stats @252 (neutral/positive): Mummy: Atk 199/218, SpA 289/317, Spe 159/174
  Item: **free**
  STAB: Ghost Shadow Ball 80S
  Physical coverage: Normal Return 102P, Fighting Body Press 80P, Psychic Zen Headbutt 80P, Dark Knock Off 65P
  Special coverage: Psychic Dream Eater 100S, Grass Energy Ball 90S, Dark Dark Pulse 80S, Normal Hidden Power 60S, Electric Shock Wave 60S, Bug Infestation 20S

**Combee** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Flying | BST 244 (30/30/42/30/42/70) | Abilities: Honey Gather / Hustle
  Engine stats @252 (neutral/positive): Honey Gather: Atk 159/174, SpA 159/174, Spe 239/262 — Hustle: Atk 238/261, SpA 159/174, Spe 239/262
  Item: **free**
  STAB: Bug Lunge 80P · Flying Dual Wingbeat 50x2P
  Physical coverage: Normal Endeavor fixedP
  Special coverage: Normal Tera Blast 80S, Ghost Ominous Wind 60S, Ground Mud-Slap 20S

**Corphish** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 308 (43/80/65/50/35/35) | Abilities: Hyper Cutter / Shell Armor / Adaptability
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 259/284, SpA 199/218, Spe 169/185 — Shell Armor: Atk 259/284, SpA 199/218, Spe 169/185 — Adaptability: Atk 259/284, SpA 199/218, Spe 169/185
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Ground Dig 100 (charge)P, Dark Crunch 80P, Bug X-Scissor 80P, Rock Rock Slide 75P
  Special coverage: Normal Trump Card 200S, Ice Blizzard 120S, Poison Sludge Bomb 90S, Rock Ancient Power 60S, Ground Mud Shot 55S

**Corsola** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Water/Rock | BST 410 (65/55/95/65/95/35) | Abilities: Hustle / Natural Cure / Regenerator
  Engine stats @252 (neutral/positive): Hustle: Atk 313/343, SpA 229/251, Spe 169/185 — Natural Cure: Atk 209/229, SpA 229/251, Spe 169/185 — Regenerator: Atk 209/229, SpA 229/251, Spe 169/185
  Item: **free**
  STAB: Water Liquidation 85P · Rock Head Smash 150P
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Dark Sucker Punch 80P, Ice Icicle Spear 25x2-5P, Fighting Rock Smash 40P
  Special coverage: Ice Blizzard 120S, Ground Earth Power 90S, Psychic Psychic 90S, Ghost Shadow Ball 80S, Normal Hidden Power 60S

**Corvisquire** — species, **ZU**, source: imported (redgpt-zu-floor)
  Flying | BST 365 (68/67/55/43/55/77) | Abilities: Keen Eye / Unnerve / Big Pecks
  Engine stats @252 (neutral/positive): Keen Eye: Atk 233/256, SpA 185/203, Spe 253/278 — Unnerve: Atk 233/256, SpA 185/203, Spe 253/278 — Big Pecks: Atk 233/256, SpA 185/203, Spe 253/278
  Item: **free**
  STAB: Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Take Down 90P, Bug U-turn 70P, Dark Assurance 60P, Fighting Revenge 60P
  Special coverage: Normal Tera Blast 80S

**Cosmoem** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 400 (43/29/131/29/131/37) | Abilities: Sturdy
  Engine stats @252 (neutral/positive): Sturdy: Atk 157/172, SpA 157/172, Spe 173/190
  Item: **free**
  STAB: **none**
  Physical coverage: **none**
  Special coverage: **none**

**Cosmog** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 200 (43/29/31/29/31/37) | Abilities: Unaware
  Engine stats @252 (neutral/positive): Unaware: Atk 157/172, SpA 157/172, Spe 173/190
  Item: **free**
  STAB: **none**
  Physical coverage: **none**
  Special coverage: **none**

**Cottonee** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Fairy | BST 280 (40/27/60/37/50/66) | Abilities: Prankster / Infiltrator / Chlorophyll
  Engine stats @252 (neutral/positive): Prankster: Atk 153/168, SpA 173/190, Spe 231/254 — Infiltrator: Atk 153/168, SpA 173/190, Spe 231/254 — Chlorophyll: Atk 153/168, SpA 173/190, Spe 231/254
  Item: **free**
  STAB: Grass Solar Beam 120 (charge)S · Fairy Dazzling Gleam 80S
  Physical coverage: Normal Return 102P, Dark Knock Off 65P
  Special coverage: Psychic Dream Eater 100S, Normal Tera Blast 80S

**Crabominable** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fighting/Ice | BST 478 (97/132/77/62/67/43) | Abilities: Hyper Cutter / Iron Fist / Anger Point
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 363/399, SpA 223/245, Spe 185/203 — Iron Fist: Atk 363/399, SpA 223/245, Spe 185/203 — Anger Point: Atk 363/399, SpA 223/245, Spe 185/203
  Item: **free**
  STAB: Fighting Focus Punch 150P · Ice Ice Hammer 100P
  Physical coverage: Poison Gunk Shot 120P, Normal Return 102P, Water Crabhammer 100P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Hard Press 100P
  Special coverage: Water Scald 80S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Crabrawler** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fighting | BST 338 (47/82/57/42/47/63) | Abilities: Hyper Cutter / Iron Fist / Anger Point
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 263/289, SpA 183/201, Spe 225/247 — Iron Fist: Atk 263/289, SpA 183/201, Spe 225/247 — Anger Point: Atk 263/289, SpA 183/201, Spe 225/247
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Poison Gunk Shot 120P, Normal Return 102P, Water Crabhammer 100P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P
  Special coverage: Water Scald 80S, Normal Tera Blast 80S, Ice Frost Breath 60S, Ground Mud Shot 55S

**Cradily** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Rock/Grass | BST 495 (86/81/97/81/107/43) | Abilities: Suction Cups / Storm Drain
  Engine stats @252 (neutral/positive): Suction Cups: Atk 261/287, SpA 261/287, Spe 185/203 — Storm Drain: Atk 261/287, SpA 261/287, Spe 185/203
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Grass Power Whip 120P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Fighting Rock Smash 40P, Ghost Astonish 30P
  Special coverage: Normal Wring Out 120S, Poison Sludge Wave 95S, Ground Earth Power 90S, Water Brine 65S, Bug Infestation 20S, Psychic Mirror Coat fixedS

**Cranidos** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock | BST 350 (67/125/40/30/30/58) | Abilities: Mold Breaker / Sheer Force
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 349/383, SpA 159/174, Spe 215/236 — Sheer Force: Atk 349/383, SpA 159/174, Spe 215/236
  Item: **free**
  STAB: Rock Head Smash 150P
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P, Psychic Zen Headbutt 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S, Ground Earth Power 90S, Normal Uproar 90S

**Croagunk** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison/Fighting | BST 300 (48/61/40/61/40/50) | Abilities: Anticipation / Dry Skin / Poison Touch
  Engine stats @252 (neutral/positive): Anticipation: Atk 221/243, SpA 221/243, Spe 199/218 — Dry Skin: Atk 221/243, SpA 221/243, Spe 199/218 — Poison Touch: Atk 221/243, SpA 221/243, Spe 199/218
  Item: **free**
  STAB: Poison Belch 120S · Fighting Focus Punch 150P
  Physical coverage: Normal Mega Kick 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Dark Foul Play 95P, Flying Bounce 85 (charge)P, Bug X-Scissor 80P
  Special coverage: Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Mud Bomb 65S, Ice Icy Wind 55S, Water Chilling Water 50S

**Croconaw** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 405 (65/80/80/59/63/58) | Abilities: Torrent / Sheer Force
  Engine stats @252 (neutral/positive): Torrent: Atk 259/284, SpA 217/238, Spe 215/236 — Sheer Force: Atk 259/284, SpA 217/238, Spe 215/236
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Rock Ancient Power 60S, Ground Mud-Slap 20S

**Crustle** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Bug/Rock | BST 485 (70/105/125/65/75/45) | Abilities: Sturdy / Shell Armor / Weak Armor
  Engine stats @252 (neutral/positive): Sturdy: Atk 309/339, SpA 229/251, Spe 189/207 — Shell Armor: Atk 309/339, SpA 229/251, Spe 189/207 — Weak Armor: Atk 309/339, SpA 229/251, Spe 189/207
  Item: **free**
  STAB: Bug X-Scissor 80P · Rock Stone Edge 100P
  Physical coverage: Grass Solar Blade 125 (charge)P, Normal Return 102P, Ground Earthquake 100P, Steel Heavy Slam 100P, Fighting Body Press 80P, Poison Poison Jab 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Hidden Power 60S

**Cryogonal** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ice | BST 515 (80/50/50/95/135/105) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 199/218, SpA 289/317, Spe 309/339
  Item: **free**
  STAB: Ice Blizzard 120S
  Physical coverage: Normal Explosion 250P, Flying Acrobatics 110P, Poison Poison Jab 80P, Dark Night Slash 70P
  Special coverage: Grass Solar Beam 120 (charge)S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Rock Ancient Power 60S, Water Water Pulse 60S

**Cubchoo** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ice | BST 305 (55/70/40/60/40/40) | Abilities: Snow Cloak / Slush Rush / Rattled
  Engine stats @252 (neutral/positive): Snow Cloak: Atk 239/262, SpA 219/240, Spe 179/196 — Slush Rush: Atk 239/262, SpA 219/240, Spe 179/196 — Rattled: Atk 239/262, SpA 219/240, Spe 179/196
  Item: **free**
  STAB: Ice Blizzard 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Water Liquidation 85P, Dark Crunch 80P
  Special coverage: Water Surf 95S, Normal Tera Blast 80S, Grass Grass Knot 60S, Ground Mud Shot 55S, Dark Snarl 55S

**Cubone** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground | BST 320 (50/50/95/40/50/35) | Abilities: Rock Head / Lightning Rod / Battle Armor
  Engine stats @252 (neutral/positive): Rock Head: Atk 199/218, SpA 179/196, Spe 169/185 — Lightning Rod: Atk 199/218, SpA 179/196, Spe 169/185 — Battle Armor: Atk 199/218, SpA 179/196, Spe 169/185
  Item: **free**
  STAB: Ground Bonemerang 50x2P
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Steel Iron Tail 100P, Fire Fire Punch 75P, Rock Rock Slide 75P, Electric Thunder Punch 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Normal Uproar 90S, Water Bubble Beam 65S, Rock Ancient Power 60S

**Cufant** — species, **ZU**, source: imported (redgpt-zu-floor)
  Steel | BST 330 (72/80/49/40/49/40) | Abilities: Sheer Force / Heavy Metal
  Engine stats @252 (neutral/positive): Sheer Force: Atk 259/284, SpA 179/196, Spe 179/196 — Heavy Metal: Atk 259/284, SpA 179/196, Spe 179/196
  Item: **free**
  STAB: Steel Steel Roller 130P
  Physical coverage: Normal Double-Edge 120P, Grass Power Whip 120P, Fighting Superpower 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Fairy Play Rough 90P
  Special coverage: Poison Belch 120S, Ground Earth Power 90S, Normal Tera Blast 80S

**Cursola** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Ghost | BST 510 (60/95/50/145/130/30) | Abilities: Weak Armor / Perish Body
  Engine stats @252 (neutral/positive): Weak Armor: Atk 289/317, SpA 389/427, Spe 159/174 — Perish Body: Atk 289/317, SpA 389/427, Spe 159/174
  Item: **free**
  STAB: Ghost Shadow Ball 80S
  Physical coverage: Normal Explosion 250P, Rock Head Smash 150P, Ground Earthquake 100P, Water Liquidation 85P, Bug Leech Life 80P, Dark Sucker Punch 80P
  Special coverage: Ice Blizzard 120S, Water Hydro Pump 120S, Rock Meteor Beam 120 (charge)S, Ground Earth Power 90S, Psychic Psychic 90S, Grass Giga Drain 75S

**Cutiefly** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Fairy | BST 304 (40/45/40/55/40/84) | Abilities: Honey Gather / Shield Dust / Sweet Veil
  Engine stats @252 (neutral/positive): Honey Gather: Atk 189/207, SpA 209/229, Spe 267/293 — Shield Dust: Atk 189/207, SpA 209/229, Spe 267/293 — Sweet Veil: Atk 189/207, SpA 209/229, Spe 267/293
  Item: **free**
  STAB: Bug Bug Buzz 90S · Fairy Moonblast 95S
  Physical coverage: Normal Last Resort 140P, Flying Acrobatics 110P, Dark Thief 60P, Grass Trailblaze 50P
  Special coverage: Psychic Dream Eater 100S, Grass Energy Ball 90S, Normal Tera Blast 80S

**Cyndaquil** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 309 (39/52/43/60/50/65) | Abilities: Blaze / Flash Fire
  Engine stats @252 (neutral/positive): Blaze: Atk 203/223, SpA 219/240, Spe 229/251 — Flash Fire: Atk 203/223, SpA 219/240, Spe 229/251
  Item: **free**
  STAB: Fire Eruption 150S
  Physical coverage: Normal Double-Edge 120P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Electric Wild Charge 90P
  Special coverage: Psychic Extrasensory 80S, Normal Tera Blast 80S, Ground Mud-Slap 20S

**Dachsbun** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fairy | BST 477 (57/80/115/50/80/95) | Abilities: Well-Baked Body / Aroma Veil
  Engine stats @252 (neutral/positive): Well-Baked Body: Atk 259/284, SpA 199/218, Spe 289/317 — Aroma Veil: Atk 259/284, SpA 199/218, Spe 289/317
  Item: **free**
  STAB: Fairy Play Rough 90P
  Physical coverage: Normal Last Resort 140P, Ground Dig 100 (charge)P, Psychic Psychic Fangs 85P, Fighting Body Press 80P, Dark Crunch 80P, Fire Fire Fang 65P
  Special coverage: Normal Tera Blast 80S, Ground Mud Shot 55S, Dark Snarl 55S

**Dartrix** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Flying | BST 420 (78/75/75/70/70/52) | Abilities: Overgrow / Long Reach
  Engine stats @252 (neutral/positive): Overgrow: Atk 249/273, SpA 239/262, Spe 203/223 — Long Reach: Atk 249/273, SpA 239/262, Spe 203/223
  Item: **free**
  STAB: Grass Leaf Storm 140S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Return 102P, Dark Sucker Punch 80P, Ghost Shadow Claw 70P, Steel Steel Wing 70P
  Special coverage: Normal Tera Blast 80S, Ghost Ominous Wind 60S

**Darumaka** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 315 (70/90/45/15/45/50) | Abilities: Hustle / Inner Focus
  Engine stats @252 (neutral/positive): Hustle: Atk 418/459, SpA 129/141, Spe 199/218 — Inner Focus: Atk 279/306, SpA 129/141, Spe 199/218
  Item: **free**
  STAB: Fire Flare Blitz 120P
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P, Rock Rock Slide 75P, Bug U-turn 70P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Psychic Extrasensory 80S

**Darumaka-Galar** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ice | BST 315 (70/90/45/15/45/50) | Abilities: Hustle / Inner Focus
  Engine stats @252 (neutral/positive): Hustle: Atk 418/459, SpA 129/141, Spe 199/218 — Inner Focus: Atk 279/306, SpA 129/141, Spe 199/218
  Item: **free**
  STAB: Ice Ice Punch 75P
  Physical coverage: Fighting Focus Punch 150P, Fire Flare Blitz 120P, Normal Mega Kick 120P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P, Rock Rock Slide 75P
  Special coverage: Fire Overheat 140S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Psychic Extrasensory 80S

**Dedenne** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric/Fairy | BST 431 (67/58/57/81/67/101) | Abilities: Cheek Pouch / Pickup / Plus
  Engine stats @252 (neutral/positive): Cheek Pouch: Atk 215/236, SpA 261/287, Spe 301/331 — Pickup: Atk 215/236, SpA 261/287, Spe 301/331 — Plus: Atk 215/236, SpA 261/287, Spe 301/331
  Item: **free**
  STAB: Electric Thunder 120S · Fairy Play Rough 90P
  Physical coverage: Normal Last Resort 140P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Grass Seed Bomb 80P, Bug U-turn 70P, Flying Aerial Ace 60P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S, Grass Grass Knot 60S

**Deerling** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Grass | BST 335 (60/60/50/40/50/75) | Abilities: Chlorophyll / Sap Sipper / Serene Grace
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 219/240, SpA 179/196, Spe 249/273 — Sap Sipper: Atk 219/240, SpA 179/196, Spe 249/273 — Serene Grace: Atk 219/240, SpA 179/196, Spe 249/273
  Item: **free**
  STAB: Normal Last Resort 140P · Grass Leaf Storm 140S
  Physical coverage: Fighting Double Kick 50x2P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Electric Wild Charge 90P, Flying Bounce 85 (charge)P, Psychic Zen Headbutt 80P
  Special coverage: Ghost Shadow Ball 80S

**Deino** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark/Dragon | BST 300 (52/65/50/45/50/38) | Abilities: Hustle
  Engine stats @252 (neutral/positive): Hustle: Atk 343/376, SpA 189/207, Spe 175/192
  Item: **free**
  STAB: Dark Crunch 80P · Dragon Outrage 120P
  Physical coverage: Rock Head Smash 150P, Fighting Superpower 120P, Normal Return 102P, Water Aqua Tail 90P, Psychic Zen Headbutt 80P, Fire Fire Fang 65P
  Special coverage: Poison Belch 120S, Ground Earth Power 90S, Normal Hyper Voice 90S, Fire Incinerate 60S, Electric Shock Wave 60S

**Delcatty** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Normal | BST 400 (70/65/65/55/55/90) | Abilities: Cute Charm / Normalize / Wonder Skin
  Engine stats @252 (neutral/positive): Cute Charm: Atk 229/251, SpA 209/229, Spe 279/306 — Normalize: Atk 229/251, SpA 209/229, Spe 279/306 — Wonder Skin: Atk 229/251, SpA 209/229, Spe 279/306
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Electric Wild Charge 90P, Dark Sucker Punch 80P, Psychic Zen Headbutt 80P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ghost Shadow Ball 80S, Ground Mud Bomb 65S

**Delibird** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ice/Flying | BST 330 (45/55/45/65/45/75) | Abilities: Vital Spirit / Hustle / Insomnia
  Engine stats @252 (neutral/positive): Vital Spirit: Atk 209/229, SpA 229/251, Spe 249/273 — Hustle: Atk 313/343, SpA 229/251, Spe 249/273 — Insomnia: Atk 209/229, SpA 229/251, Spe 249/273
  Item: **free**
  STAB: Ice Ice Spinner 80P · Flying Sky Attack 140 (charge)P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Poison Gunk Shot 120P, Dark Foul Play 95P, Ground Drill Run 80P, Grass Seed Bomb 80P
  Special coverage: Psychic Future Sight 120S, Normal Tera Blast 80S, Bug Signal Beam 75S, Water Water Pulse 60S, Ground Mud-Slap 20S

**Dewgong** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Water/Ice | BST 475 (90/70/80/70/95/70) | Abilities: Thick Fat / Hydration / Ice Body
  Engine stats @252 (neutral/positive): Thick Fat: Atk 239/262, SpA 239/262, Spe 239/262 — Hydration: Atk 239/262, SpA 239/262, Spe 239/262 — Ice Body: Atk 239/262, SpA 239/262, Spe 239/262
  Item: **free**
  STAB: Water Hydro Pump 120S · Ice Blizzard 120S
  Physical coverage: Normal Skull Bash 130P, Bug Megahorn 120P, Steel Iron Tail 100P, Fairy Play Rough 90P, Ground Drill Run 80P, Dark Knock Off 65P
  Special coverage: Poison Belch 120S, Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S

**Dewott** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 413 (75/75/60/83/60/60) | Abilities: Torrent / Shell Armor
  Engine stats @252 (neutral/positive): Torrent: Atk 249/273, SpA 265/291, Spe 219/240 — Shell Armor: Atk 249/273, SpA 265/291, Spe 219/240
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fighting Sacred Sword 90P, Bug X-Scissor 80P, Dark Night Slash 70P
  Special coverage: Normal Trump Card 200S, Ice Blizzard 120S, Flying Air Slash 75S, Grass Grass Knot 60S, Fighting Vacuum Wave 40S

**Dewpider** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Bug | BST 269 (38/40/52/40/72/27) | Abilities: Water Bubble / Water Absorb
  Engine stats @252 (neutral/positive): Water Bubble: Atk 179/196, SpA 179/196, Spe 153/168 — Water Absorb: Atk 179/196, SpA 179/196, Spe 153/168
  Item: **free**
  STAB: Water Hydro Pump 120S · Bug Bug Buzz 90S
  Physical coverage: Normal Return 102P, Dark Crunch 80P, Poison Poison Jab 80P, Grass Trailblaze 50P
  Special coverage: Ice Blizzard 120S, Normal Tera Blast 80S, Grass Giga Drain 75S, Psychic Mirror Coat fixedS

**Diglett** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground | BST 265 (10/55/25/35/45/95) | Abilities: Sand Veil / Arena Trap / Sand Force
  Engine stats @252 (neutral/positive): Sand Veil: Atk 209/229, SpA 169/185, Spe 289/317 — Arena Trap: Atk 209/229, SpA 169/185, Spe 289/317 — Sand Force: Atk 209/229, SpA 169/185, Spe 289/317
  **TRAPPING ABILITY: Arena Trap** (optional — one of 3)
  Item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Rock Stone Edge 100P, Dark Foul Play 95P, Ghost Shadow Claw 70P, Flying Aerial Ace 60P, Fighting Rock Smash 40P
  Special coverage: Poison Sludge Bomb 90S, Normal Uproar 90S, Rock Ancient Power 60S, Fighting Final Gambit fixedS

**Diglett-Alola** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground/Steel | BST 265 (10/55/30/35/45/90) | Abilities: Sand Veil / Tangling Hair / Sand Force
  Engine stats @252 (neutral/positive): Sand Veil: Atk 209/229, SpA 169/185, Spe 279/306 — Tangling Hair: Atk 209/229, SpA 169/185, Spe 279/306 — Sand Force: Atk 209/229, SpA 169/185, Spe 279/306
  Item: **free**
  STAB: Ground Earthquake 100P · Steel Steel Beam 140S
  Physical coverage: Normal Double-Edge 120P, Rock Stone Edge 100P, Dark Foul Play 95P, Ghost Shadow Claw 70P, Flying Aerial Ace 60P, Fighting Rock Smash 40P
  Special coverage: Poison Sludge Bomb 90S, Normal Uproar 90S, Rock Ancient Power 60S, Fighting Final Gambit fixedS

**Ditto** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 288 (48/48/48/48/48/48) | Abilities: Limber / Imposter
  Engine stats @252 (neutral/positive): Limber: Atk 195/214, SpA 195/214, Spe 195/214 — Imposter: Atk 195/214, SpA 195/214, Spe 195/214
  Item: **free**
  STAB: **none**
  Physical coverage: **none**
  Special coverage: **none**

**Dodrio** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal/Flying | BST 470 (60/110/70/60/60/110) | Abilities: Run Away / Early Bird / Tangled Feet
  Engine stats @252 (neutral/positive): Run Away: Atk 319/350, SpA 219/240, Spe 319/350 — Early Bird: Atk 319/350, SpA 219/240, Spe 319/350 — Tangled Feet: Atk 319/350, SpA 219/240, Spe 319/350
  Item: **free**
  STAB: Normal Skull Bash 130P · Flying Sky Attack 140 (charge)P
  Physical coverage: Fighting Jump Kick 100P, Ground Drill Run 80P, Bug Lunge 80P, Dark Throat Chop 80P, Steel Steel Wing 70P, Grass Trailblaze 50P
  Special coverage: Ground Mud-Slap 20S

**Doduo** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Flying | BST 310 (35/85/45/35/35/75) | Abilities: Run Away / Early Bird / Tangled Feet
  Engine stats @252 (neutral/positive): Run Away: Atk 269/295, SpA 169/185, Spe 249/273 — Early Bird: Atk 269/295, SpA 169/185, Spe 249/273 — Tangled Feet: Atk 269/295, SpA 169/185, Spe 249/273
  Item: **free**
  STAB: Normal Skull Bash 130P · Flying Sky Attack 140 (charge)P
  Physical coverage: Fighting Jump Kick 100P, Bug Lunge 80P, Dark Throat Chop 80P, Steel Steel Wing 70P
  Special coverage: Ground Mud-Slap 20S

**Dolliv** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Normal | BST 354 (52/53/60/78/78/33) | Abilities: Early Bird / Harvest
  Engine stats @252 (neutral/positive): Early Bird: Atk 205/225, SpA 255/280, Spe 165/181 — Harvest: Atk 205/225, SpA 255/280, Spe 165/181
  Item: **free**
  STAB: Grass Leaf Storm 140S · Normal Tera Blast 80S
  Physical coverage: **none**
  Special coverage: Ground Earth Power 90S

**Dottler** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Psychic | BST 335 (50/35/80/50/90/30) | Abilities: Swarm / Compound Eyes / Telepathy
  Engine stats @252 (neutral/positive): Swarm: Atk 169/185, SpA 199/218, Spe 159/174 — Compound Eyes: Atk 169/185, SpA 199/218, Spe 159/174 — Telepathy: Atk 169/185, SpA 199/218, Spe 159/174
  Item: **free**
  STAB: Bug Bug Buzz 90S · Psychic Future Sight 120S
  Physical coverage: Fighting Body Press 80P, Normal Facade 70P, Dark Payback 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S, Normal Round 60S

**Dragonair** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dragon | BST 420 (61/84/65/70/70/70) | Abilities: Shed Skin / Marvel Scale
  Engine stats @252 (neutral/positive): Shed Skin: Atk 267/293, SpA 239/262, Spe 239/262 — Marvel Scale: Atk 267/293, SpA 239/262, Spe 239/262
  Item: **free**
  STAB: Dragon Draco Meteor 140S
  Physical coverage: Normal Skull Bash 130P, Steel Iron Tail 100P, Water Aqua Tail 90P, Dark Brutal Swing 60P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Normal Tera Blast 80S

**Drakloak** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dragon/Ghost | BST 410 (68/80/50/60/50/102) | Abilities: Clear Body / Infiltrator / Cursed Body
  Engine stats @252 (neutral/positive): Clear Body: Atk 259/284, SpA 219/240, Spe 303/333 — Infiltrator: Atk 259/284, SpA 219/240, Spe 303/333 — Cursed Body: Atk 259/284, SpA 219/240, Spe 303/333
  Item: **free**
  STAB: Dragon Draco Meteor 140S · Ghost Phantom Force 90 (charge)P
  Physical coverage: Normal Last Resort 140P, Flying Acrobatics 110P, Psychic Psychic Fangs 85P, Dark Sucker Punch 80P, Water Dive 80 (charge)P, Steel Steel Wing 70P
  Special coverage: Fire Fire Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Normal Tera Blast 80S, Bug Infestation 20S

**Dratini** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dragon | BST 300 (41/64/45/50/50/50) | Abilities: Shed Skin / Marvel Scale
  Engine stats @252 (neutral/positive): Shed Skin: Atk 227/249, SpA 199/218, Spe 199/218 — Marvel Scale: Atk 227/249, SpA 199/218, Spe 199/218
  Item: **free**
  STAB: Dragon Draco Meteor 140S
  Physical coverage: Normal Skull Bash 130P, Steel Iron Tail 100P, Water Aqua Tail 90P, Dark Brutal Swing 60P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Normal Tera Blast 80S

**Dreepy** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dragon/Ghost | BST 270 (28/60/30/40/30/82) | Abilities: Clear Body / Infiltrator / Cursed Body
  Engine stats @252 (neutral/positive): Clear Body: Atk 219/240, SpA 179/196, Spe 263/289 — Infiltrator: Atk 219/240, SpA 179/196, Spe 263/289 — Cursed Body: Atk 219/240, SpA 179/196, Spe 263/289
  Item: **free**
  STAB: Dragon Draco Meteor 140S · Ghost Astonish 30P
  Physical coverage: Dark Sucker Punch 80P, Normal Facade 70P
  Special coverage: Normal Tera Blast 80S, Bug Infestation 20S

**Drifblim** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ghost/Flying | BST 498 (150/80/44/90/54/80) | Abilities: Aftermath / Unburden / Flare Boost
  Engine stats @252 (neutral/positive): Aftermath: Atk 259/284, SpA 279/306, Spe 259/284 — Unburden: Atk 259/284, SpA 279/306, Spe 259/284 — Flare Boost: Atk 259/284, SpA 279/306, Spe 259/284
  Item: **free**
  STAB: Ghost Phantom Force 90 (charge)P · Flying Acrobatics 110P
  Physical coverage: Normal Explosion 250P, Dark Sucker Punch 80P, Fire Temper Flare 75P, Rock Rollout 30P, Steel Gyro Ball 19P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Normal Tera Blast 80S, Bug Silver Wind 60S, Ice Icy Wind 55S, Poison Clear Smog 50S

**Drifloon** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ghost/Flying | BST 348 (90/50/34/60/44/70) | Abilities: Aftermath / Unburden / Flare Boost
  Engine stats @252 (neutral/positive): Aftermath: Atk 199/218, SpA 219/240, Spe 239/262 — Unburden: Atk 199/218, SpA 219/240, Spe 239/262 — Flare Boost: Atk 199/218, SpA 219/240, Spe 239/262
  Item: **free**
  STAB: Ghost Phantom Force 90 (charge)P · Flying Acrobatics 110P
  Physical coverage: Normal Explosion 250P, Dark Sucker Punch 80P, Fire Temper Flare 75P, Rock Rollout 30P, Steel Gyro Ball 21P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Normal Tera Blast 80S, Bug Silver Wind 60S, Ice Icy Wind 55S, Poison Clear Smog 50S

**Drilbur** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground | BST 328 (60/85/40/30/45/68) | Abilities: Sand Rush / Sand Force / Mold Breaker
  Engine stats @252 (neutral/positive): Sand Rush: Atk 269/295, SpA 159/174, Spe 235/258 — Sand Force: Atk 269/295, SpA 159/174, Spe 235/258 — Mold Breaker: Atk 269/295, SpA 159/174, Spe 235/258
  Item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Normal Skull Bash 130P, Poison Poison Jab 80P, Fighting Submission 80P, Bug X-Scissor 80P, Rock Rock Slide 75P, Ghost Shadow Claw 70P
  Special coverage: Poison Sludge Bomb 90S, Normal Tera Blast 80S

**Drizzile** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 420 (65/60/55/95/55/90) | Abilities: Torrent / Sniper
  Engine stats @252 (neutral/positive): Torrent: Atk 219/240, SpA 289/317, Spe 279/306 — Sniper: Atk 219/240, SpA 289/317, Spe 279/306
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Take Down 90P, Flying Bounce 85 (charge)P, Dark Sucker Punch 80P, Bug U-turn 70P, Ice Ice Shard 40P
  Special coverage: Normal Tera Blast 80S, Ground Mud Shot 55S

**Drowzee** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 328 (60/48/45/43/90/42) | Abilities: Insomnia / Forewarn / Inner Focus
  Engine stats @252 (neutral/positive): Insomnia: Atk 195/214, SpA 185/203, Spe 183/201 — Forewarn: Atk 195/214, SpA 185/203, Spe 183/201 — Inner Focus: Atk 195/214, SpA 185/203, Spe 183/201
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dark Foul Play 95P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Zap Cannon 120S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Dubwool** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Normal | BST 490 (72/80/100/60/90/88) | Abilities: Fluffy / Steadfast / Bulletproof
  Engine stats @252 (neutral/positive): Fluffy: Atk 259/284, SpA 219/240, Spe 275/302 — Steadfast: Atk 259/284, SpA 219/240, Spe 275/302 — Bulletproof: Atk 259/284, SpA 219/240, Spe 275/302
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Double Kick 50x2P, Electric Wild Charge 90P, Flying Bounce 85 (charge)P, Psychic Zen Headbutt 80P, Grass Grassy Glide 70P, Dark Payback 50P
  Special coverage: Electric Electro Ball 60S

**Ducklett** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Flying | BST 305 (62/44/50/44/50/55) | Abilities: Keen Eye / Big Pecks / Hydration
  Engine stats @252 (neutral/positive): Keen Eye: Atk 187/205, SpA 187/205, Spe 209/229 — Big Pecks: Atk 187/205, SpA 187/205, Spe 209/229 — Hydration: Atk 187/205, SpA 187/205, Spe 209/229
  Item: **free**
  STAB: Water Surf 95S · Flying Brave Bird 120P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Grass Trailblaze 50P
  Special coverage: Ice Ice Beam 95S, Normal Uproar 90S, Fairy Disarming Voice 40S

**Dugtrio-Alola** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ground/Steel | BST 425 (35/100/60/50/70/110) | Abilities: Sand Veil / Tangling Hair / Sand Force
  Engine stats @252 (neutral/positive): Sand Veil: Atk 299/328, SpA 199/218, Spe 319/350 — Tangling Hair: Atk 299/328, SpA 199/218, Spe 319/350 — Sand Force: Atk 299/328, SpA 199/218, Spe 319/350
  Item: **free**
  STAB: Ground Earthquake 100P · Steel Iron Head 80P
  Physical coverage: Normal Double-Edge 120P, Rock Stone Edge 100P, Dark Foul Play 95P, Ghost Shadow Claw 70P, Flying Aerial Ace 60P, Fighting Rock Smash 40P
  Special coverage: Poison Sludge Wave 95S, Normal Uproar 90S, Rock Ancient Power 60S, Fighting Final Gambit fixedS

**Dunsparce** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 415 (100/70/70/65/65/45) | Abilities: Serene Grace / Run Away / Rattled
  Engine stats @252 (neutral/positive): Serene Grace: Atk 239/262, SpA 229/251, Spe 189/207 — Run Away: Atk 239/262, SpA 229/251, Spe 189/207 — Rattled: Atk 239/262, SpA 229/251, Spe 189/207
  Item: **free**
  STAB: Normal Trump Card 200S
  Physical coverage: Dragon Dragon Rush 100P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ground Earth Power 90S

**Dusknoir** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ghost | BST 525 (45/100/135/65/135/45) | Abilities: Pressure / Frisk
  Engine stats @252 (neutral/positive): Pressure: Atk 299/328, SpA 229/251, Spe 189/207 — Frisk: Atk 299/328, SpA 229/251, Spe 189/207
  Item: **free**
  STAB: Ghost Poltergeist 110P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Hard Press 100P, Dark Darkest Lariat 85P, Bug Leech Life 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Psychic Future Sight 120S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Charge Beam 50S

**Duskull** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ghost | BST 295 (20/40/90/30/90/25) | Abilities: Levitate / Frisk
  Engine stats @252 (neutral/positive): Levitate: Atk 179/196, SpA 159/174, Spe 149/163 — Frisk: Atk 179/196, SpA 159/174, Spe 149/163
  Item: **free**
  STAB: Ghost Poltergeist 110P
  Physical coverage: Normal Double-Edge 120P, Bug Leech Life 80P, Dark Sucker Punch 80P, Fighting Revenge 60P
  Special coverage: Ice Blizzard 120S, Psychic Future Sight 120S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Charge Beam 50S, Bug Infestation 20S

**Dustox** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Bug/Poison | BST 385 (60/50/70/50/90/65) | Abilities: Shield Dust / Compound Eyes
  Engine stats @252 (neutral/positive): Shield Dust: Atk 199/218, SpA 199/218, Spe 229/251 — Compound Eyes: Atk 199/218, SpA 199/218, Spe 229/251
  Item: **free**
  STAB: Bug Bug Buzz 90S · Poison Sludge Bomb 90S
  Physical coverage: Normal Double-Edge 120P, Flying Acrobatics 110P, Dark Thief 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Psychic 90S, Ghost Shadow Ball 80S, Flying Air Cutter 60S, Normal Hidden Power 60S, Electric Electroweb 55S

**Dwebble** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Rock | BST 325 (50/65/85/35/35/55) | Abilities: Sturdy / Shell Armor / Weak Armor
  Engine stats @252 (neutral/positive): Sturdy: Atk 229/251, SpA 169/185, Spe 209/229 — Shell Armor: Atk 229/251, SpA 169/185, Spe 209/229 — Weak Armor: Atk 229/251, SpA 169/185, Spe 209/229
  Item: **free**
  STAB: Bug X-Scissor 80P · Rock Stone Edge 100P
  Physical coverage: Normal Return 102P, Ground Earthquake 100P, Poison Poison Jab 80P, Dark Night Slash 70P, Ghost Shadow Claw 70P, Flying Aerial Ace 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Hidden Power 60S

**Eelektrik** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric | BST 405 (65/85/70/75/70/40) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 269/295, SpA 249/273, Spe 179/196
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Thrash 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Water Aqua Tail 90P, Dark Crunch 80P, Bug Lunge 80P
  Special coverage: Steel Flash Cannon 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Bug Signal Beam 75S, Poison Acid 40S

**Eelektross** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 515 (85/115/80/105/80/50) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 329/361, SpA 309/339, Spe 199/218
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Dragon Outrage 120P, Normal Thrash 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Water Aqua Tail 90P
  Special coverage: Fire Flamethrower 95S, Dragon Dragon Pulse 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Bug Signal Beam 75S

**Eevee** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 325 (55/55/50/45/65/55) | Abilities: Run Away / Adaptability / Anticipation
  Engine stats @252 (neutral/positive): Run Away: Atk 209/229, SpA 189/207, Spe 209/229 — Adaptability: Atk 209/229, SpA 189/207, Spe 209/229 — Anticipation: Atk 209/229, SpA 189/207, Spe 209/229
  Item: **free**
  STAB: Normal Trump Card 200S
  Physical coverage: Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Bite 60P, Grass Trailblaze 50P
  Special coverage: Psychic Synchronoise 120S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Ground Mud-Slap 20S

**Eiscue** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ice | BST 470 (75/80/110/65/90/50) | Abilities: Ice Face
  Engine stats @252 (neutral/positive): Ice Face: Atk 259/284, SpA 229/251, Spe 199/218
  Item: **free**
  STAB: Ice Blizzard 120S
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Water Liquidation 85P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Fighting Reversal 20P
  Special coverage: Water Hydro Pump 120S, Normal Tera Blast 80S

**Eiscue-Noice** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ice | BST 470 (75/80/70/65/50/130) | Abilities: Ice Face
  Engine stats @252 (neutral/positive): Ice Face: Atk 259/284, SpA 229/251, Spe 359/394
  Item: **free**
  STAB: Ice Blizzard 120S
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Water Liquidation 85P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Fighting Reversal 20P
  Special coverage: Water Hydro Pump 120S, Normal Tera Blast 80S

**Ekans** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison | BST 288 (35/60/44/40/54/55) | Abilities: Intimidate / Shed Skin / Unnerve
  Engine stats @252 (neutral/positive): Intimidate: Atk 219/240, SpA 179/196, Spe 209/229 — Shed Skin: Atk 219/240, SpA 179/196, Spe 209/229 — Unnerve: Atk 219/240, SpA 179/196, Spe 209/229
  Item: **free**
  STAB: Poison Belch 120S
  Physical coverage: Normal Skull Bash 130P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Ground Mud Bomb 65S, Bug Infestation 20S

**Electabuzz** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric | BST 490 (65/83/57/95/85/105) | Abilities: Static / Vital Spirit
  Engine stats @252 (neutral/positive): Static: Atk 265/291, SpA 289/317, Spe 309/339 — Vital Spirit: Atk 265/291, SpA 289/317, Spe 309/339
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Dual Chop 50x2P, Steel Iron Tail 100P, Fire Fire Punch 75P, Ice Ice Punch 75P
  Special coverage: Fighting Focus Blast 120S, Psychic Psychic 90S, Normal Uproar 90S, Bug Signal Beam 75S, Ground Mud-Slap 20S

**Electivire** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 540 (75/123/67/95/85/95) | Abilities: Motor Drive / Vital Spirit
  Engine stats @252 (neutral/positive): Motor Drive: Atk 345/379, SpA 289/317, Spe 289/317 — Vital Spirit: Atk 345/379, SpA 289/317, Spe 289/317
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Darkest Lariat 85P
  Special coverage: Fighting Focus Blast 120S, Fire Flamethrower 95S, Psychic Psychic 90S, Normal Uproar 90S, Bug Signal Beam 75S, Ground Mud-Slap 20S

**Electrike** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric | BST 295 (40/45/40/65/40/65) | Abilities: Static / Lightning Rod / Minus
  Engine stats @252 (neutral/positive): Static: Atk 189/207, SpA 229/251, Spe 229/251 — Lightning Rod: Atk 189/207, SpA 229/251, Spe 229/251 — Minus: Atk 189/207, SpA 229/251, Spe 229/251
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Fire Fire Fang 65P, Ice Ice Fang 65P
  Special coverage: Fire Flamethrower 95S, Normal Uproar 90S, Bug Signal Beam 75S, Dark Snarl 55S, Ground Mud-Slap 20S

**Electrode** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 490 (60/50/70/80/80/150) | Abilities: Soundproof / Static / Aftermath
  Engine stats @252 (neutral/positive): Soundproof: Atk 199/218, SpA 259/284, Spe 399/438 — Static: Atk 199/218, SpA 259/284, Spe 399/438 — Aftermath: Atk 199/218, SpA 259/284, Spe 399/438
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Explosion 250P, Dark Foul Play 95P, Rock Rollout 30P, Steel Gyro Ball 11P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S, Psychic Mirror Coat fixedS

**Elekid** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric | BST 360 (45/63/37/65/55/95) | Abilities: Static / Vital Spirit
  Engine stats @252 (neutral/positive): Static: Atk 225/247, SpA 229/251, Spe 289/317 — Vital Spirit: Atk 225/247, SpA 229/251, Spe 289/317
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Dual Chop 50x2P, Fire Fire Punch 75P, Ice Ice Punch 75P, Dark Knock Off 65P
  Special coverage: Fighting Focus Blast 120S, Psychic Psychic 90S, Normal Uproar 90S, Bug Signal Beam 75S, Ground Mud-Slap 20S

**Elgyem** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 335 (55/55/55/85/55/30) | Abilities: Telepathy / Synchronize / Analytic
  Engine stats @252 (neutral/positive): Telepathy: Atk 209/229, SpA 269/295, Spe 159/174 — Synchronize: Atk 209/229, SpA 269/295, Spe 159/174 — Analytic: Atk 209/229, SpA 269/295, Spe 159/174
  Item: **free**
  STAB: Psychic Synchronoise 120S
  Physical coverage: Normal Return 102P, Rock Rock Slide 75P, Steel Steel Wing 70P, Dark Thief 60P, Ghost Astonish 30P
  Special coverage: Rock Meteor Beam 120 (charge)S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S

**Emolga** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Electric/Flying | BST 428 (55/75/60/75/60/103) | Abilities: Static / Motor Drive
  Engine stats @252 (neutral/positive): Static: Atk 249/273, SpA 249/273, Spe 305/335 — Motor Drive: Atk 249/273, SpA 249/273, Spe 305/335
  Item: **free**
  STAB: Electric Thunder 120S · Flying Acrobatics 110P
  Physical coverage: Normal Last Resort 140P, Steel Iron Tail 100P, Bug U-turn 70P, Dark Knock Off 65P, Ghost Astonish 30P
  Special coverage: Grass Solar Beam 120 (charge)S, Bug Signal Beam 75S, Normal Hidden Power 60S

**Espurr** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 355 (62/48/54/63/60/68) | Abilities: Keen Eye / Infiltrator / Own Tempo
  Engine stats @252 (neutral/positive): Keen Eye: Atk 195/214, SpA 225/247, Spe 235/258 — Infiltrator: Atk 195/214, SpA 225/247, Spe 235/258 — Own Tempo: Atk 195/214, SpA 225/247, Spe 235/258
  Item: **free**
  STAB: Psychic Dream Eater 100S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Fairy Play Rough 90P, Dark Payback 50P
  Special coverage: Electric Thunderbolt 95S, Grass Energy Ball 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Exeggcute** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Psychic | BST 325 (60/40/80/60/45/40) | Abilities: Chlorophyll / Harvest
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 179/196, SpA 219/240, Spe 179/196 — Harvest: Atk 179/196, SpA 219/240, Spe 179/196
  Item: **free**
  STAB: Grass Leaf Storm 140S · Psychic Dream Eater 100S
  Physical coverage: Normal Explosion 250P, Dark Thief 60P, Rock Rollout 30P
  Special coverage: Poison Sludge Bomb 90S, Normal Uproar 90S, Rock Ancient Power 60S, Bug Infestation 20S

**Exeggutor** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass/Psychic | BST 530 (95/95/85/125/75/55) | Abilities: Chlorophyll / Harvest
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 289/317, SpA 349/383, Spe 209/229 — Harvest: Atk 289/317, SpA 349/383, Spe 209/229
  Item: **free**
  STAB: Grass Leaf Storm 140S · Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Fighting Low Kick 60P, Dark Thief 60P, Rock Rollout 30P
  Special coverage: Poison Sludge Bomb 90S, Normal Uproar 90S, Rock Ancient Power 60S, Bug Infestation 20S

**Exeggutor-Alola** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass/Dragon | BST 530 (95/105/85/125/75/45) | Abilities: Frisk / Harvest
  Engine stats @252 (neutral/positive): Frisk: Atk 309/339, SpA 349/383, Spe 189/207 — Harvest: Atk 309/339, SpA 349/383, Spe 189/207
  Item: **free**
  STAB: Grass Leaf Storm 140S · Dragon Draco Meteor 140S
  Physical coverage: Normal Explosion 250P, Fighting Superpower 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Psychic Zen Headbutt 80P, Dark Knock Off 65P
  Special coverage: Psychic Future Sight 120S, Fire Flamethrower 95S, Poison Sludge Bomb 90S, Normal Uproar 90S, Rock Ancient Power 60S, Bug Infestation 20S

**Falinks** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fighting | BST 470 (65/100/100/70/60/75) | Abilities: Battle Armor / Defiant
  Engine stats @252 (neutral/positive): Battle Armor: Atk 299/328, SpA 239/262, Spe 249/273 — Defiant: Atk 299/328, SpA 239/262, Spe 249/273
  Item: **free**
  STAB: Fighting Close Combat 120P
  Physical coverage: Bug Megahorn 120P, Ground High Horsepower 95P, Normal Take Down 90P, Steel Iron Head 80P, Poison Poison Jab 80P, Dark Throat Chop 80P
  Special coverage: Normal Uproar 90S

**Farfetch’d** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Normal/Flying | BST 377 (52/90/55/58/62/60) | Abilities: Keen Eye / Inner Focus / Defiant
  Engine stats @252 (neutral/positive): Keen Eye: Atk 279/306, SpA 215/236, Spe 219/240 — Inner Focus: Atk 279/306, SpA 215/236, Spe 219/240 — Defiant: Atk 279/306, SpA 215/236, Spe 219/240
  Item: **free**
  STAB: Normal Trump Card 200S · Flying Sky Attack 140 (charge)P
  Physical coverage: Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Steel Iron Tail 100P, Bug First Impression 90P, Poison Poison Jab 80P, Dark Throat Chop 80P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S, Fighting Final Gambit fixedS

**Farfetch’d-Galar** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fighting | BST 377 (52/95/55/58/62/55) | Abilities: Steadfast / Scrappy
  Engine stats @252 (neutral/positive): Steadfast: Atk 289/317, SpA 215/236, Spe 209/229 — Scrappy: Atk 289/317, SpA 215/236, Spe 209/229
  Item: **free**
  STAB: Fighting Close Combat 120P
  Physical coverage: Normal Last Resort 140P, Flying Sky Attack 140 (charge)P, Grass Solar Blade 125 (charge)P, Steel Iron Tail 100P, Bug First Impression 90P, Poison Poison Jab 80P
  Special coverage: Normal Trump Card 200S, Fire Heat Wave 100S, Flying Air Slash 75S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Farigiraf** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal/Psychic | BST 520 (120/90/70/110/70/60) | Abilities: Cud Chew / Armor Tail / Sap Sipper
  Engine stats @252 (neutral/positive): Cud Chew: Atk 279/306, SpA 319/350, Spe 219/240 — Armor Tail: Atk 279/306, SpA 319/350, Spe 219/240 — Sap Sipper: Atk 279/306, SpA 319/350, Spe 219/240
  Item: **free**
  STAB: Normal Double-Edge 120P · Psychic Future Sight 120S
  Physical coverage: Fighting Double Kick 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Grass Trailblaze 50P, Ghost Astonish 30P
  Special coverage: Electric Thunder 120S, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Ground Mud-Slap 20S

**Fearow** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Normal/Flying | BST 442 (65/90/65/61/61/100) | Abilities: Keen Eye / Sniper
  Engine stats @252 (neutral/positive): Keen Eye: Atk 279/306, SpA 221/243, Spe 299/328 — Sniper: Atk 279/306, SpA 221/243, Spe 299/328
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Ground Drill Run 80P, Dark Throat Chop 80P, Steel Steel Wing 70P, Bug U-turn 70P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Feebas** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 200 (20/15/20/10/55/80) | Abilities: Swift Swim / Oblivious / Adaptability
  Engine stats @252 (neutral/positive): Swift Swim: Atk 129/141, SpA 119/130, Spe 259/284 — Oblivious: Atk 129/141, SpA 119/130, Spe 259/284 — Adaptability: Atk 129/141, SpA 119/130, Spe 259/284
  Item: **free**
  STAB: Water Muddy Water 95S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Dragon Scale Shot 25x2-5P
  Special coverage: Ice Blizzard 120S, Dragon Dragon Pulse 90S, Normal Tera Blast 80S, Ground Mud Shot 55S, Psychic Mirror Coat fixedS

**Fennekin** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 307 (40/45/40/62/60/60) | Abilities: Blaze / Magician
  Engine stats @252 (neutral/positive): Blaze: Atk 189/207, SpA 223/245, Spe 219/240 — Magician: Atk 189/207, SpA 223/245, Spe 219/240
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Dark Foul Play 95P, Fighting Power-Up Punch 40P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Ferroseed** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Steel | BST 305 (44/50/91/24/86/10) | Abilities: Iron Barbs
  Engine stats @252 (neutral/positive): Iron Barbs: Atk 199/218, SpA 147/161, Spe 119/130
  Item: **free**
  STAB: Grass Seed Bomb 80P · Steel Steel Roller 130P
  Physical coverage: Normal Explosion 250P, Poison Poison Jab 80P, Bug Pin Missile 25x2-5P, Dark Knock Off 65P, Fighting Revenge 60P, Rock Rollout 30P
  Special coverage: Electric Thunderbolt 95S, Normal Hidden Power 60S, Poison Acid Spray 40S

**Fidough** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fairy | BST 312 (37/55/70/30/55/65) | Abilities: Own Tempo / Klutz
  Engine stats @252 (neutral/positive): Own Tempo: Atk 209/229, SpA 159/174, Spe 229/251 — Klutz: Atk 209/229, SpA 159/174, Spe 229/251
  Item: **free**
  STAB: Fairy Play Rough 90P
  Physical coverage: Normal Last Resort 140P, Ground Dig 100 (charge)P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Fire Fire Fang 65P, Ice Ice Fang 65P
  Special coverage: Normal Tera Blast 80S, Ground Mud Shot 55S, Dark Snarl 55S

**Finizen** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 315 (70/45/40/45/40/75) | Abilities: Water Veil
  Engine stats @252 (neutral/positive): Water Veil: Atk 189/207, SpA 189/207, Spe 249/273
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Flying Acrobatics 110P, Normal Double Hit 50x2P, Psychic Zen Headbutt 80P, Ghost Astonish 30P, Dark Fling 30P, Fighting Counter fixedP
  Special coverage: Normal Boomburst 140S, Ice Blizzard 120S, Fairy Draining Kiss 50S

**Finneon** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 330 (49/49/56/49/61/66) | Abilities: Swift Swim / Storm Drain / Water Veil
  Engine stats @252 (neutral/positive): Swift Swim: Atk 197/216, SpA 197/216, Spe 231/254 — Storm Drain: Atk 197/216, SpA 197/216, Spe 231/254 — Water Veil: Atk 197/216, SpA 197/216, Spe 231/254
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Bug U-turn 70P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Fairy Alluring Voice 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Psychic Psybeam 65S, Flying Air Cutter 60S

**Flaaffy** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric | BST 365 (70/55/55/80/60/45) | Abilities: Static / Plus
  Engine stats @252 (neutral/positive): Static: Atk 209/229, SpA 259/284, Spe 189/207 — Plus: Atk 209/229, SpA 259/284, Spe 189/207
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fire Fire Punch 75P, Ice Ice Punch 75P
  Special coverage: Fairy Dazzling Gleam 80S, Rock Power Gem 80S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Flabébé** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fairy | BST 303 (44/38/39/61/79/42) | Abilities: Flower Veil / Symbiosis
  Engine stats @252 (neutral/positive): Flower Veil: Atk 175/192, SpA 221/243, Spe 183/201 — Symbiosis: Atk 175/192, SpA 221/243, Spe 183/201
  Item: **free**
  STAB: Fairy Moonblast 95S
  Physical coverage: Normal Return 102P, Grass Petal Blizzard 90P
  Special coverage: Grass Petal Dance 120S, Bug Pollen Puff 90S, Psychic Psychic 90S, Normal Tera Blast 80S, Water Chilling Water 50S

**Flapple** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass/Dragon | BST 485 (70/110/80/95/60/70) | Abilities: Ripen / Gluttony / Hustle
  Engine stats @252 (neutral/positive): Ripen: Atk 319/350, SpA 289/317, Spe 239/262 — Gluttony: Atk 319/350, SpA 289/317, Spe 239/262 — Hustle: Atk 478/525, SpA 289/317, Spe 239/262
  Item: **free**
  STAB: Grass Grav Apple 80P · Dragon Outrage 120P
  Physical coverage: Flying Acrobatics 110P, Normal Take Down 90P, Dark Sucker Punch 80P, Bug U-turn 70P, Steel Heavy Slam 40P, Ghost Astonish 30P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Poison Acid Spray 40S

**Flareon** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fire | BST 525 (65/130/60/95/110/65) | Abilities: Flash Fire / Guts
  Engine stats @252 (neutral/positive): Flash Fire: Atk 359/394, SpA 289/317, Spe 229/251 — Guts: Atk 359/394, SpA 289/317, Spe 229/251
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Last Resort 140P, Fighting Superpower 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Bite 60P, Grass Trailblaze 50P
  Special coverage: Normal Trump Card 200S, Psychic Synchronoise 120S, Electric Zap Cannon 120S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Ground Scorching Sands 70S

**Fletchinder** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire/Flying | BST 382 (62/73/55/56/52/84) | Abilities: Flame Body / Gale Wings
  Engine stats @252 (neutral/positive): Flame Body: Atk 245/269, SpA 211/232, Spe 267/293 — Gale Wings: Atk 245/269, SpA 211/232, Spe 267/293
  Item: **free**
  STAB: Fire Overheat 140S · Flying Brave Bird 120P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Thief 60P
  Special coverage: Normal Tera Blast 80S

**Fletchling** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Flying | BST 278 (45/50/43/40/38/62) | Abilities: Big Pecks / Gale Wings
  Engine stats @252 (neutral/positive): Big Pecks: Atk 199/218, SpA 179/196, Spe 223/245 — Gale Wings: Atk 199/218, SpA 179/196, Spe 223/245
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Brave Bird 120P
  Physical coverage: Fire Flare Blitz 120P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Thief 60P
  Special coverage: Fire Overheat 140S

**Flittle** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 255 (30/35/30/55/30/75) | Abilities: Anticipation / Frisk / Speed Boost
  Engine stats @252 (neutral/positive): Anticipation: Atk 169/185, SpA 209/229, Spe 249/273 — Frisk: Atk 169/185, SpA 209/229, Spe 249/273 — Speed Boost: Atk 169/185, SpA 209/229, Spe 249/273
  Item: **free**
  STAB: Psychic Psychic 90S
  Physical coverage: Dark Foul Play 95P, Normal Take Down 90P, Grass Seed Bomb 80P, Bug U-turn 70P, Flying Pluck 60P
  Special coverage: Normal Uproar 90S, Fairy Disarming Voice 40S, Ground Mud-Slap 20S

**Floette** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fairy | BST 371 (54/45/47/75/98/52) | Abilities: Flower Veil / Symbiosis
  Engine stats @252 (neutral/positive): Flower Veil: Atk 189/207, SpA 249/273, Spe 203/223 — Symbiosis: Atk 189/207, SpA 249/273, Spe 203/223
  Item: **free**
  STAB: Fairy Moonblast 95S
  Physical coverage: Normal Return 102P, Grass Petal Blizzard 90P
  Special coverage: Grass Petal Dance 120S, Bug Pollen Puff 90S, Psychic Psychic 90S, Normal Tera Blast 80S, Water Chilling Water 50S

**Floragato** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 410 (61/80/63/60/63/83) | Abilities: Overgrow / Protean
  Engine stats @252 (neutral/positive): Overgrow: Atk 259/284, SpA 219/240, Spe 265/291 — Protean: Atk 259/284, SpA 219/240, Spe 265/291
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Flying Acrobatics 110P, Fairy Play Rough 90P, Normal Take Down 90P, Dark Sucker Punch 80P, Electric Thunder Punch 75P, Ghost Shadow Claw 70P
  Special coverage: Normal Tera Blast 80S, Fairy Disarming Voice 40S, Ground Mud-Slap 20S

**Fomantis** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 250 (40/55/35/50/35/35) | Abilities: Leaf Guard / Contrary
  Engine stats @252 (neutral/positive): Leaf Guard: Atk 209/229, SpA 199/218, Spe 169/185 — Contrary: Atk 209/229, SpA 199/218, Spe 169/185
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Fighting Superpower 120P, Normal Return 102P, Dragon Dual Chop 50x2P, Bug Leech Life 80P, Poison Poison Jab 80P, Dark Payback 50P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S

**Foongus** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Poison | BST 294 (69/55/45/55/55/15) | Abilities: Effect Spore / Regenerator
  Engine stats @252 (neutral/positive): Effect Spore: Atk 209/229, SpA 209/229, Spe 129/141 — Regenerator: Atk 209/229, SpA 209/229, Spe 129/141
  Item: **free**
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Return 102P, Dark Foul Play 95P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Bug Pollen Puff 90S, Normal Tera Blast 80S

**Frigibax** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dragon/Ice | BST 320 (65/75/45/35/45/55) | Abilities: Thermal Exchange / Ice Body
  Engine stats @252 (neutral/positive): Thermal Exchange: Atk 249/273, SpA 169/185, Spe 209/229 — Ice Body: Atk 249/273, SpA 169/185, Spe 209/229
  Item: **free**
  STAB: Dragon Outrage 120P · Ice Icicle Crash 85P
  Physical coverage: Ground Dig 100 (charge)P, Water Aqua Tail 90P, Normal Take Down 90P, Dark Crunch 80P
  Special coverage: Normal Tera Blast 80S

**Frillish** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Ghost | BST 335 (55/40/50/65/85/40) | Abilities: Water Absorb / Cursed Body / Damp
  Engine stats @252 (neutral/positive): Water Absorb: Atk 179/196, SpA 229/251, Spe 179/196 — Cursed Body: Atk 179/196, SpA 229/251, Spe 179/196 — Damp: Atk 179/196, SpA 229/251, Spe 179/196
  Item: **free**
  STAB: Water Water Spout 150S · Ghost Poltergeist 110P
  Physical coverage: Normal Return 102P, Poison Poison Sting 15P
  Special coverage: Ice Blizzard 120S, Normal Wring Out 120S, Psychic Dream Eater 100S, Poison Sludge Wave 95S, Grass Energy Ball 90S, Dark Dark Pulse 80S

**Froakie** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 314 (41/56/40/62/44/71) | Abilities: Torrent / Protean
  Engine stats @252 (neutral/positive): Torrent: Atk 211/232, SpA 223/245, Spe 241/265 — Protean: Atk 211/232, SpA 223/245, Spe 241/265
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Ground Dig 100 (charge)P, Rock Rock Slide 75P, Bug U-turn 70P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Normal Tera Blast 80S, Grass Grass Knot 60S, Ground Mud Shot 55S

**Frogadier** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 405 (54/63/52/83/56/97) | Abilities: Torrent / Protean
  Engine stats @252 (neutral/positive): Torrent: Atk 225/247, SpA 265/291, Spe 293/322 — Protean: Atk 225/247, SpA 265/291, Spe 293/322
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Poison Gunk Shot 120P, Flying Acrobatics 110P, Normal Return 102P, Ground Dig 100 (charge)P, Ice Ice Punch 75P, Rock Rock Slide 75P
  Special coverage: Ice Blizzard 120S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Grass Knot 60S, Ground Mud Shot 55S

**Froslass** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ice/Ghost | BST 480 (70/80/70/80/70/110) | Abilities: Snow Cloak / Cursed Body
  Engine stats @252 (neutral/positive): Snow Cloak: Atk 259/284, SpA 259/284, Spe 319/350 — Cursed Body: Atk 259/284, SpA 259/284, Spe 319/350
  Item: **free**
  STAB: Ice Blizzard 120S · Ghost Poltergeist 110P
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Fighting Wake-Up Slap 70P, Grass Trailblaze 50P, Rock Rollout 30P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Normal Tera Blast 80S, Bug Signal Beam 75S, Water Water Pulse 60S, Fairy Draining Kiss 50S

**Fuecoco** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 310 (67/45/59/63/40/36) | Abilities: Blaze / Unaware
  Engine stats @252 (neutral/positive): Blaze: Atk 189/207, SpA 225/247, Spe 171/188 — Unaware: Atk 189/207, SpA 225/247, Spe 171/188
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Dragon Outrage 120P, Ground Dig 100 (charge)P, Normal Take Down 90P, Dark Crunch 80P, Grass Seed Bomb 80P, Psychic Zen Headbutt 80P
  Special coverage: Poison Belch 120S, Normal Hyper Voice 90S, Dark Snarl 55S, Fairy Disarming Voice 40S, Ground Mud-Slap 20S

**Furfrou** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Normal | BST 472 (75/80/60/65/90/102) | Abilities: Fur Coat
  Engine stats @252 (neutral/positive): Fur Coat: Atk 259/284, SpA 229/251, Spe 303/333
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Steel Iron Tail 100P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Dark Sucker Punch 80P, Psychic Zen Headbutt 80P, Bug U-turn 70P
  Special coverage: Water Surf 95S, Dark Dark Pulse 80S, Grass Grass Knot 60S, Electric Charge Beam 50S

**Furret** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 415 (85/76/64/45/55/90) | Abilities: Run Away / Keen Eye / Frisk
  Engine stats @252 (neutral/positive): Run Away: Atk 251/276, SpA 189/207, Spe 279/306 — Keen Eye: Atk 251/276, SpA 189/207, Spe 279/306 — Frisk: Atk 251/276, SpA 189/207, Spe 279/306
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Water Aqua Tail 90P, Fairy Play Rough 90P, Grass Seed Bomb 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Fire Flamethrower 95S, Water Surf 95S

**Gabite** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dragon/Ground | BST 410 (68/90/65/50/55/82) | Abilities: Sand Veil / Rough Skin
  Engine stats @252 (neutral/positive): Sand Veil: Atk 279/306, SpA 199/218, Spe 263/289 — Rough Skin: Atk 279/306, SpA 199/218, Spe 263/289
  Item: **free**
  STAB: Dragon Outrage 120P · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Dark Crunch 80P, Ghost Shadow Claw 70P, Fire Fire Fang 65P
  Special coverage: Fire Fire Blast 120S, Rock Power Gem 80S, Normal Tera Blast 80S

**Gastly** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ghost/Poison | BST 310 (30/35/30/100/35/80) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 169/185, SpA 299/328, Spe 259/284
  Item: **free**
  STAB: Ghost Shadow Ball 80S · Poison Sludge Wave 95S
  Physical coverage: Normal Explosion 250P, Dark Foul Play 95P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Bug Skitter Smack 70P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Fairy Dazzling Gleam 80S

**Geodude** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Ground | BST 300 (40/80/100/30/30/20) | Abilities: Rock Head / Sturdy / Sand Veil
  Engine stats @252 (neutral/positive): Rock Head: Atk 259/284, SpA 159/174, Spe 139/152 — Sturdy: Atk 259/284, SpA 159/174, Spe 139/152 — Sand Veil: Atk 259/284, SpA 159/174, Spe 139/152
  Item: **free**
  STAB: Rock Stone Edge 100P · Ground Earthquake 100P
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Dark Sucker Punch 80P, Fire Fire Punch 75P, Electric Thunder Punch 75P, Steel Gyro Ball 49P
  Special coverage: Fire Fire Blast 120S, Normal Tera Blast 80S

**Geodude-Alola** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Electric | BST 300 (40/80/100/30/30/20) | Abilities: Magnet Pull / Sturdy / Galvanize
  Engine stats @252 (neutral/positive): Magnet Pull: Atk 259/284, SpA 159/174, Spe 139/152 — Sturdy: Atk 259/284, SpA 159/174, Spe 139/152 — Galvanize: Atk 259/284, SpA 159/174, Spe 139/152
  **TRAPPING ABILITY: Magnet Pull** (optional — one of 3)
  Item: **free**
  STAB: Rock Stone Edge 100P · Electric Supercell Slam 100P
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Ground Earthquake 100P, Dark Sucker Punch 80P, Fire Fire Punch 75P, Steel Gyro Ball 49P
  Special coverage: Fire Fire Blast 120S, Ground Earth Power 90S, Normal Tera Blast 80S

**Gible** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dragon/Ground | BST 300 (58/70/45/40/45/42) | Abilities: Sand Veil / Rough Skin
  Engine stats @252 (neutral/positive): Sand Veil: Atk 239/262, SpA 179/196, Spe 183/201 — Rough Skin: Atk 239/262, SpA 179/196, Spe 183/201
  Item: **free**
  STAB: Dragon Outrage 120P · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ghost Shadow Claw 70P, Fire Fire Fang 65P, Electric Thunder Fang 65P
  Special coverage: Fire Fire Blast 120S, Normal Tera Blast 80S

**Gimmighoul** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ghost | BST 300 (45/30/70/75/70/10) | Abilities: Rattled
  Engine stats @252 (neutral/positive): Rattled: Atk 159/174, SpA 249/273, Spe 119/130
  Item: **free**
  STAB: Ghost Shadow Ball 80S
  Physical coverage: Normal Take Down 90P, Dark Thief 60P
  Special coverage: Rock Power Gem 80S, Normal Tera Blast 80S

**Gimmighoul-Roaming** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ghost | BST 300 (45/30/25/75/45/80) | Abilities: Run Away
  Engine stats @252 (neutral/positive): Run Away: Atk 159/174, SpA 249/273, Spe 259/284
  Item: **free**
  STAB: Ghost Shadow Ball 80S
  Physical coverage: Normal Take Down 90P, Dark Thief 60P
  Special coverage: Rock Power Gem 80S, Normal Tera Blast 80S

**Girafarig** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Psychic | BST 455 (70/80/65/90/65/85) | Abilities: Inner Focus / Early Bird / Sap Sipper
  Engine stats @252 (neutral/positive): Inner Focus: Atk 259/284, SpA 279/306, Spe 269/295 — Early Bird: Atk 259/284, SpA 279/306, Spe 269/295 — Sap Sipper: Atk 259/284, SpA 279/306, Spe 269/295
  Item: **free**
  STAB: Normal Double-Edge 120P · Psychic Future Sight 120S
  Physical coverage: Fighting Double Kick 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Grass Trailblaze 50P, Ghost Astonish 30P
  Special coverage: Electric Thunder 120S, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Ground Mud-Slap 20S

**Glaceon** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ice | BST 525 (65/60/110/130/95/65) | Abilities: Snow Cloak / Ice Body
  Engine stats @252 (neutral/positive): Snow Cloak: Atk 219/240, SpA 359/394, Spe 229/251 — Ice Body: Atk 219/240, SpA 359/394, Spe 229/251
  Item: **free**
  STAB: Ice Blizzard 120S
  Physical coverage: Normal Last Resort 140P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Water Aqua Tail 90P, Dark Bite 60P
  Special coverage: Normal Trump Card 200S, Psychic Synchronoise 120S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Water Water Pulse 60S

**Glalie** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ice | BST 480 (80/80/80/80/80/80) | Abilities: Inner Focus / Ice Body / Moody
  Engine stats @252 (neutral/positive): Inner Focus: Atk 259/284, SpA 259/284, Spe 259/284 — Ice Body: Atk 259/284, SpA 259/284, Spe 259/284 — Moody: Atk 259/284, SpA 259/284, Spe 259/284
  Item: **free**
  STAB: Ice Blizzard 120S
  Physical coverage: Normal Explosion 250P, Steel Steel Roller 130P, Ground Earthquake 100P, Dark Foul Play 95P, Grass Trailblaze 50P, Ghost Astonish 30P
  Special coverage: Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Water Water Pulse 60S

**Glameow** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 310 (49/55/42/42/37/85) | Abilities: Limber / Own Tempo / Keen Eye
  Engine stats @252 (neutral/positive): Limber: Atk 209/229, SpA 183/201, Spe 269/295 — Own Tempo: Atk 209/229, SpA 183/201, Spe 269/295 — Keen Eye: Atk 209/229, SpA 183/201, Spe 269/295
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Fairy Play Rough 90P, Ghost Shadow Claw 70P, Bug U-turn 70P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Ghost Shadow Ball 80S, Water Water Pulse 60S, Ground Mud-Slap 20S

**Glimmet** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Poison | BST 350 (48/35/42/105/60/60) | Abilities: Toxic Debris / Corrosion
  Engine stats @252 (neutral/positive): Toxic Debris: Atk 169/185, SpA 309/339, Spe 219/240 — Corrosion: Atk 169/185, SpA 309/339, Spe 219/240
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Poison Sludge Wave 95S
  Physical coverage: Normal Explosion 250P, Ground Sand Tomb 35P
  Special coverage: Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Gloom** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Poison | BST 395 (60/65/70/85/75/40) | Abilities: Chlorophyll / Stench
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 229/251, SpA 269/295, Spe 179/196 — Stench: Atk 229/251, SpA 269/295, Spe 179/196
  Item: **free**
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Double-Edge 120P, Fighting Drain Punch 75P, Dark Fling 30P
  Special coverage: Fairy Moonblast 95S, Bug Pollen Puff 90S, Normal Tera Blast 80S

**Gogoat** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass | BST 531 (123/100/62/97/81/68) | Abilities: Sap Sipper / Grass Pelt
  Engine stats @252 (neutral/positive): Sap Sipper: Atk 299/328, SpA 293/322, Spe 235/258 — Grass Pelt: Atk 299/328, SpA 293/322, Spe 235/258
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fairy Play Rough 90P, Electric Wild Charge 90P
  Special coverage: Water Surf 95S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Goldeen** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 320 (45/67/60/35/50/63) | Abilities: Swift Swim / Water Veil / Lightning Rod
  Engine stats @252 (neutral/positive): Swift Swim: Atk 233/256, SpA 169/185, Spe 225/247 — Water Veil: Atk 233/256, SpA 169/185, Spe 225/247 — Lightning Rod: Atk 233/256, SpA 169/185, Spe 225/247
  Item: **free**
  STAB: Water Aqua Tail 90P
  Physical coverage: Normal Skull Bash 130P, Bug Megahorn 120P, Flying Bounce 85 (charge)P, Ground Drill Run 80P, Poison Poison Jab 80P, Dark Throat Chop 80P
  Special coverage: Ice Blizzard 120S, Bug Signal Beam 75S, Psychic Psybeam 65S, Normal Hidden Power 60S, Ground Mud Shot 55S

**Golduck** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Water | BST 500 (80/82/78/95/80/85) | Abilities: Damp / Cloud Nine / Swift Swim
  Engine stats @252 (neutral/positive): Damp: Atk 263/289, SpA 289/317, Spe 269/295 — Cloud Nine: Atk 263/289, SpA 289/317, Spe 269/295 — Swift Swim: Atk 263/289, SpA 289/317, Spe 269/295
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P, Ice Ice Punch 75P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Psychic Future Sight 120S, Rock Power Gem 80S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Golem** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Rock/Ground | BST 495 (80/120/130/55/65/45) | Abilities: Rock Head / Sturdy / Sand Veil
  Engine stats @252 (neutral/positive): Rock Head: Atk 339/372, SpA 209/229, Spe 189/207 — Sturdy: Atk 339/372, SpA 209/229, Spe 189/207 — Sand Veil: Atk 339/372, SpA 209/229, Spe 189/207
  Item: **free**
  STAB: Rock Stone Edge 100P · Ground Earthquake 100P
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Steel Heavy Slam 120P, Dark Sucker Punch 80P, Fire Fire Punch 75P, Electric Thunder Punch 75P
  Special coverage: Fire Fire Blast 120S, Fighting Focus Blast 120S, Normal Tera Blast 80S

**Golem-Alola** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Rock/Electric | BST 495 (80/120/130/55/65/45) | Abilities: Magnet Pull / Sturdy / Galvanize
  Engine stats @252 (neutral/positive): Magnet Pull: Atk 339/372, SpA 209/229, Spe 189/207 — Sturdy: Atk 339/372, SpA 209/229, Spe 189/207 — Galvanize: Atk 339/372, SpA 209/229, Spe 189/207
  **TRAPPING ABILITY: Magnet Pull** (optional — one of 3)
  Item: **free**
  STAB: Rock Stone Edge 100P · Electric Supercell Slam 100P
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Steel Heavy Slam 120P, Ground Earthquake 100P, Dark Sucker Punch 80P, Fire Fire Punch 75P
  Special coverage: Fire Fire Blast 120S, Fighting Focus Blast 120S, Ground Earth Power 90S, Normal Tera Blast 80S

**Golett** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground/Ghost | BST 303 (59/74/50/35/50/35) | Abilities: Iron Fist / Klutz / No Guard
  Engine stats @252 (neutral/positive): Iron Fist: Atk 247/271, SpA 169/185, Spe 169/185 — Klutz: Atk 247/271, SpA 169/185, Spe 169/185 — No Guard: Atk 247/271, SpA 169/185, Spe 169/185
  Item: **free**
  STAB: Ground Earthquake 100P · Ghost Poltergeist 110P
  Physical coverage: Normal Self-Destruct 200P, Fighting Focus Punch 150P, Fire Fire Punch 75P, Ice Ice Punch 75P, Rock Rock Slide 75P, Electric Thunder Punch 75P
  Special coverage: Fighting Focus Blast 120S, Ice Ice Beam 95S, Psychic Psychic 90S, Normal Tera Blast 80S, Bug Signal Beam 75S, Grass Grass Knot 60S

**Goomy** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dragon | BST 300 (45/50/35/55/75/40) | Abilities: Sap Sipper / Hydration / Gooey
  Engine stats @252 (neutral/positive): Sap Sipper: Atk 199/218, SpA 209/229, Spe 179/196 — Hydration: Atk 199/218, SpA 209/229, Spe 179/196 — Gooey: Atk 199/218, SpA 209/229, Spe 179/196
  Item: **free**
  STAB: Dragon Draco Meteor 140S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Rock Rock Slide 75P, Bug Skitter Smack 70P, Poison Poison Tail 50P, Fighting Counter fixedP
  Special coverage: Water Muddy Water 95S, Poison Sludge Wave 95S, Electric Thunderbolt 95S, Normal Tera Blast 80S, Ground Mud Shot 55S, Grass Absorb 20S

**Gossifleur** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 250 (40/40/60/40/60/10) | Abilities: Cotton Down / Regenerator / Effect Spore
  Engine stats @252 (neutral/positive): Cotton Down: Atk 179/196, SpA 179/196, Spe 119/130 — Regenerator: Atk 179/196, SpA 179/196, Spe 119/130 — Effect Spore: Atk 179/196, SpA 179/196, Spe 119/130
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Facade 70P
  Special coverage: Normal Hyper Voice 90S, Bug Pollen Puff 90S

**Gothita** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 290 (45/30/50/55/65/45) | Abilities: Frisk / Competitive / Shadow Tag
  Engine stats @252 (neutral/positive): Frisk: Atk 159/174, SpA 209/229, Spe 189/207 — Competitive: Atk 159/174, SpA 209/229, Spe 189/207 — Shadow Tag: Atk 159/174, SpA 209/229, Spe 189/207
  **TRAPPING ABILITY: Shadow Tag** (optional — one of 3)
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Dark Foul Play 95P, Rock Rock Slide 75P
  Special coverage: Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Gourgeist** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Ghost/Grass | BST 494 (65/90/122/58/75/84) | Abilities: Pickup / Frisk / Insomnia
  Engine stats @252 (neutral/positive): Pickup: Atk 279/306, SpA 215/236, Spe 267/293 — Frisk: Atk 279/306, SpA 215/236, Spe 267/293 — Insomnia: Atk 279/306, SpA 215/236, Spe 267/293
  Item: **free**
  STAB: Ghost Poltergeist 110P · Grass Power Whip 120P
  Physical coverage: Normal Explosion 250P, Dark Foul Play 95P, Rock Rock Slide 75P, Bug Skitter Smack 70P, Fire Flame Charge 50P, Fighting Rock Smash 40P
  Special coverage: Fire Fire Blast 120S, Fighting Focus Blast 120S, Psychic Dream Eater 100S, Fairy Moonblast 95S, Poison Sludge Bomb 90S, Dark Dark Pulse 80S

**Granbull** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fairy | BST 450 (90/120/75/60/60/45) | Abilities: Intimidate / Quick Feet / Rattled
  Engine stats @252 (neutral/positive): Intimidate: Atk 339/372, SpA 219/240, Spe 189/207 — Quick Feet: Atk 339/372, SpA 219/240, Spe 189/207 — Rattled: Atk 339/372, SpA 219/240, Spe 189/207
  Item: **free**
  STAB: Fairy Play Rough 90P
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Fire Overheat 140S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Normal Hyper Voice 90S, Poison Sludge Bomb 90S

**Grapploct** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Fighting | BST 480 (80/118/90/70/80/42) | Abilities: Limber / Technician
  Engine stats @252 (neutral/positive): Limber: Atk 335/368, SpA 239/262, Spe 183/201 — Technician: Atk 335/368, SpA 239/262, Spe 183/201
  Item: **free**
  STAB: Fighting Close Combat 120P
  Physical coverage: Ground Dig 100 (charge)P, Normal Body Slam 85P, Water Liquidation 85P, Dark Sucker Punch 80P, Ice Ice Punch 75P, Bug Skitter Smack 70P
  Special coverage: Water Hydro Pump 120S, Normal Round 60S, Ground Mud Shot 55S

**Graveler** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Ground | BST 390 (55/95/115/45/45/35) | Abilities: Rock Head / Sturdy / Sand Veil
  Engine stats @252 (neutral/positive): Rock Head: Atk 289/317, SpA 189/207, Spe 169/185 — Sturdy: Atk 289/317, SpA 189/207, Spe 169/185 — Sand Veil: Atk 289/317, SpA 189/207, Spe 169/185
  Item: **free**
  STAB: Rock Stone Edge 100P · Ground Earthquake 100P
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Steel Hard Press 100P, Dark Sucker Punch 80P, Fire Fire Punch 75P, Electric Thunder Punch 75P
  Special coverage: Fire Fire Blast 120S, Fighting Focus Blast 120S, Normal Tera Blast 80S

**Graveler-Alola** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Electric | BST 390 (55/95/115/45/45/35) | Abilities: Magnet Pull / Sturdy / Galvanize
  Engine stats @252 (neutral/positive): Magnet Pull: Atk 289/317, SpA 189/207, Spe 169/185 — Sturdy: Atk 289/317, SpA 189/207, Spe 169/185 — Galvanize: Atk 289/317, SpA 189/207, Spe 169/185
  **TRAPPING ABILITY: Magnet Pull** (optional — one of 3)
  Item: **free**
  STAB: Rock Stone Edge 100P · Electric Supercell Slam 100P
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Ground Earthquake 100P, Steel Hard Press 100P, Dark Sucker Punch 80P, Fire Fire Punch 75P
  Special coverage: Fire Fire Blast 120S, Fighting Focus Blast 120S, Ground Earth Power 90S, Normal Tera Blast 80S

**Greavard** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ghost | BST 290 (50/61/60/30/55/34) | Abilities: Pickup / Fluffy
  Engine stats @252 (neutral/positive): Pickup: Atk 221/243, SpA 159/174, Spe 167/183 — Fluffy: Atk 221/243, SpA 159/174, Spe 167/183
  Item: **free**
  STAB: Ghost Poltergeist 110P
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Fire Fire Fang 65P
  Special coverage: Normal Uproar 90S, Ground Mud Shot 55S, Dark Snarl 55S

**Greedent** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 460 (120/95/95/55/75/20) | Abilities: Cheek Pouch / Gluttony
  Engine stats @252 (neutral/positive): Cheek Pouch: Atk 289/317, SpA 209/229, Spe 139/152 — Gluttony: Atk 289/317, SpA 209/229, Spe 139/152
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Superpower 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Electric Wild Charge 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Poison Belch 120S, Ground Mud Shot 55S

**Grimer** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison | BST 325 (80/80/50/40/50/25) | Abilities: Stench / Sticky Hold / Poison Touch
  Engine stats @252 (neutral/positive): Stench: Atk 259/284, SpA 179/196, Spe 149/163 — Sticky Hold: Atk 259/284, SpA 179/196, Spe 149/163 — Poison Touch: Atk 259/284, SpA 179/196, Spe 149/163
  Item: **free**
  STAB: Poison Gunk Shot 120P
  Physical coverage: Normal Explosion 250P, Fighting Dynamic Punch 100P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P, Ice Ice Punch 75P
  Special coverage: Fire Fire Blast 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Ground Mud Bomb 65S

**Grimer-Alola** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison/Dark | BST 325 (80/80/50/40/50/25) | Abilities: Poison Touch / Gluttony / Power of Alchemy
  Engine stats @252 (neutral/positive): Poison Touch: Atk 259/284, SpA 179/196, Spe 149/163 — Gluttony: Atk 259/284, SpA 179/196, Spe 149/163 — Power of Alchemy: Atk 259/284, SpA 179/196, Spe 149/163
  Item: **free**
  STAB: Poison Gunk Shot 120P · Dark Crunch 80P
  Physical coverage: Normal Explosion 250P, Fighting Dynamic Punch 100P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Fire Fire Blast 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Ground Mud Bomb 65S

**Grookey** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 310 (50/65/50/40/40/65) | Abilities: Overgrow / Grassy Surge
  Engine stats @252 (neutral/positive): Overgrow: Atk 229/251, SpA 179/196, Spe 229/251 — Grassy Surge: Atk 229/251, SpA 179/196, Spe 229/251
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Mega Kick 120P, Flying Acrobatics 110P, Fighting Hammer Arm 100P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Normal Uproar 90S

**Grotle** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 405 (75/89/85/55/65/36) | Abilities: Overgrow / Shell Armor
  Engine stats @252 (neutral/positive): Overgrow: Atk 277/304, SpA 209/229, Spe 171/188 — Shell Armor: Atk 277/304, SpA 209/229, Spe 171/188
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Steel Iron Tail 100P, Dark Crunch 80P, Psychic Zen Headbutt 80P, Ground Bulldoze 60P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S

**Grovyle** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 405 (50/65/45/85/65/95) | Abilities: Overgrow / Unburden
  Engine stats @252 (neutral/positive): Overgrow: Atk 229/251, SpA 269/295, Spe 289/317 — Unburden: Atk 229/251, SpA 269/295, Spe 289/317
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Crunch 80P
  Special coverage: Normal Tera Blast 80S, Dragon Dragon Breath 60S, Fighting Vacuum Wave 40S, Ground Mud-Slap 20S

**Growlithe** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 350 (55/70/45/70/50/60) | Abilities: Intimidate / Flash Fire / Justified
  Engine stats @252 (neutral/positive): Intimidate: Atk 239/262, SpA 239/262, Spe 219/240 — Flash Fire: Atk 239/262, SpA 239/262, Spe 219/240 — Justified: Atk 239/262, SpA 239/262, Spe 219/240
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P
  Special coverage: Normal Tera Blast 80S, Dragon Dragon Breath 60S, Dark Snarl 55S, Ground Mud-Slap 20S

**Growlithe-Hisui** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire/Rock | BST 350 (60/75/45/65/50/55) | Abilities: Intimidate / Flash Fire / Rock Head
  Engine stats @252 (neutral/positive): Intimidate: Atk 249/273, SpA 229/251, Spe 209/229 — Flash Fire: Atk 249/273, SpA 229/251, Spe 209/229 — Rock Head: Atk 249/273, SpA 229/251, Spe 209/229
  Item: **free**
  STAB: Fire Overheat 140S · Rock Head Smash 150P
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P
  Special coverage: Normal Tera Blast 80S, Ground Scorching Sands 70S, Dragon Dragon Breath 60S, Dark Snarl 55S

**Grubbin** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 300 (47/62/45/55/45/46) | Abilities: Swarm
  Engine stats @252 (neutral/positive): Swarm: Atk 223/245, SpA 209/229, Spe 191/210
  Item: **free**
  STAB: Bug Lunge 80P
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Dark Crunch 80P, Poison Poison Jab 80P
  Special coverage: Electric Thunderbolt 95S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Grumpig** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Psychic | BST 470 (80/45/65/90/110/80) | Abilities: Thick Fat / Own Tempo / Gluttony
  Engine stats @252 (neutral/positive): Thick Fat: Atk 189/207, SpA 279/306, Spe 259/284 — Own Tempo: Atk 189/207, SpA 279/306, Spe 259/284 — Gluttony: Atk 189/207, SpA 279/306, Spe 259/284
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Flying Bounce 85 (charge)P, Bug Lunge 80P
  Special coverage: Poison Belch 120S, Fighting Focus Blast 120S, Ground Earth Power 90S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Fairy Dazzling Gleam 80S

**Gulpin** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison | BST 302 (70/43/53/43/53/40) | Abilities: Liquid Ooze / Sticky Hold / Gluttony
  Engine stats @252 (neutral/positive): Liquid Ooze: Atk 185/203, SpA 185/203, Spe 179/196 — Sticky Hold: Atk 185/203, SpA 185/203, Spe 179/196 — Gluttony: Atk 185/203, SpA 185/203, Spe 179/196
  Item: **free**
  STAB: Poison Belch 120S
  Physical coverage: Normal Explosion 250P, Fighting Dynamic Punch 100P, Grass Seed Bomb 80P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Normal Wring Out 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ice Ice Beam 95S, Ghost Shadow Ball 80S, Electric Shock Wave 60S

**Gumshoos** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 418 (88/110/60/55/60/45) | Abilities: Stakeout / Strong Jaw / Adaptability
  Engine stats @252 (neutral/positive): Stakeout: Atk 319/350, SpA 209/229, Spe 189/207 — Strong Jaw: Atk 319/350, SpA 209/229, Spe 189/207 — Adaptability: Atk 319/350, SpA 209/229, Spe 189/207
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Electric Wild Charge 90P, Psychic Psychic Fangs 85P
  Special coverage: Electric Shock Wave 60S, Ground Mud Shot 55S, Water Chilling Water 50S

**Hakamo-o** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dragon/Fighting | BST 420 (55/75/90/65/70/65) | Abilities: Bulletproof / Soundproof / Overcoat
  Engine stats @252 (neutral/positive): Bulletproof: Atk 249/273, SpA 229/251, Spe 229/251 — Soundproof: Atk 249/273, SpA 229/251, Spe 229/251 — Overcoat: Atk 249/273, SpA 229/251, Spe 229/251
  Item: **free**
  STAB: Dragon Draco Meteor 140S · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Dark Throat Chop 80P, Bug X-Scissor 80P
  Special coverage: Normal Uproar 90S

**Happiny** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 220 (100/5/5/15/65/30) | Abilities: Natural Cure / Serene Grace / Friend Guard
  Engine stats @252 (neutral/positive): Natural Cure: Atk 109/119, SpA 129/141, Spe 159/174 — Serene Grace: Atk 109/119, SpA 129/141, Spe 159/174 — Friend Guard: Atk 109/119, SpA 129/141, Spe 159/174
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Psychic Zen Headbutt 80P, Fighting Drain Punch 75P, Dark Fling 30P, Rock Rollout 30P
  Special coverage: Fire Fire Blast 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ghost Shadow Ball 80S, Ground Mud Bomb 65S, Electric Shock Wave 60S

**Hatenna** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 265 (42/30/45/56/53/39) | Abilities: Healer / Anticipation / Magic Bounce
  Engine stats @252 (neutral/positive): Healer: Atk 159/174, SpA 211/232, Spe 177/194 — Anticipation: Atk 159/174, SpA 211/232, Spe 177/194 — Magic Bounce: Atk 159/174, SpA 211/232, Spe 177/194
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Fairy Play Rough 90P, Normal Facade 70P, Electric Nuzzle 20P
  Special coverage: Dark Dark Pulse 80S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Fire Mystical Fire 75S

**Hattrem** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 370 (57/40/65/86/73/49) | Abilities: Healer / Anticipation / Magic Bounce
  Engine stats @252 (neutral/positive): Healer: Atk 179/196, SpA 271/298, Spe 197/216 — Anticipation: Atk 179/196, SpA 271/298, Spe 197/216 — Magic Bounce: Atk 179/196, SpA 271/298, Spe 197/216
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Fairy Play Rough 90P, Normal Facade 70P, Dark Brutal Swing 60P, Electric Nuzzle 20P
  Special coverage: Dark Dark Pulse 80S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Fire Mystical Fire 75S

**Haunter** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ghost/Poison | BST 405 (45/50/45/115/55/95) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 199/218, SpA 329/361, Spe 289/317
  Item: **free**
  STAB: Ghost Shadow Ball 80S · Poison Sludge Wave 95S
  Physical coverage: Normal Explosion 250P, Dark Foul Play 95P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Bug Skitter Smack 70P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Psychic Dream Eater 100S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S

**Heatmor** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Fire | BST 484 (85/97/66/105/66/65) | Abilities: Gluttony / Flash Fire / White Smoke
  Engine stats @252 (neutral/positive): Gluttony: Atk 293/322, SpA 309/339, Spe 229/251 — Flash Fire: Atk 293/322, SpA 309/339, Spe 229/251 — White Smoke: Atk 293/322, SpA 309/339, Spe 229/251
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Return 102P, Ground Dig 100 (charge)P, Dark Sucker Punch 80P, Electric Thunder Punch 75P, Ghost Shadow Claw 70P
  Special coverage: Poison Belch 120S, Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Ground Scorching Sands 70S, Normal Hidden Power 60S

**Helioptile** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric/Normal | BST 289 (44/38/33/61/43/70) | Abilities: Dry Skin / Sand Veil / Solar Power
  Engine stats @252 (neutral/positive): Dry Skin: Atk 175/192, SpA 221/243, Spe 239/262 — Sand Veil: Atk 175/192, SpA 221/243, Spe 239/262 — Solar Power: Atk 175/192, SpA 221/243, Spe 239/262
  Item: **free**
  STAB: Electric Thunder 120S · Normal Return 102P
  Physical coverage: Dragon Dragon Rush 100P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Rock Rock Slide 75P, Bug U-turn 70P, Fighting Low Sweep 65P
  Special coverage: Water Surf 95S, Dark Dark Pulse 80S, Bug Signal Beam 75S, Grass Grass Knot 60S, Ground Mud-Slap 20S

**Herdier** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 370 (65/80/65/35/65/60) | Abilities: Intimidate / Sand Rush / Scrappy
  Engine stats @252 (neutral/positive): Intimidate: Atk 259/284, SpA 169/185, Spe 219/240 — Sand Rush: Atk 259/284, SpA 169/185, Spe 219/240 — Scrappy: Atk 259/284, SpA 169/185, Spe 219/240
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Ground Dig 100 (charge)P, Fairy Play Rough 90P, Electric Wild Charge 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Fire Fire Fang 65P
  Special coverage: Water Surf 95S, Electric Thunderbolt 95S, Ghost Shadow Ball 80S, Dark Snarl 55S, Ground Mud-Slap 20S

**Hippopotas** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground | BST 330 (68/72/78/38/42/32) | Abilities: Sand Stream / Sand Force
  Engine stats @252 (neutral/positive): Sand Stream: Atk 243/267, SpA 175/192, Spe 163/179 — Sand Force: Atk 243/267, SpA 175/192, Spe 163/179
  Item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Dark Crunch 80P, Fire Fire Fang 65P
  Special coverage: Rock Weather Ball 100S, Water Muddy Water 95S, Normal Tera Blast 80S

**Hitmonchan** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fighting | BST 455 (50/105/79/35/110/76) | Abilities: Keen Eye / Iron Fist / Inner Focus
  Engine stats @252 (neutral/positive): Keen Eye: Atk 309/339, SpA 169/185, Spe 251/276 — Iron Fist: Atk 309/339, SpA 169/185, Spe 251/276 — Inner Focus: Atk 309/339, SpA 169/185, Spe 251/276
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Skull Bash 130P, Ground Earthquake 100P, Rock Stone Edge 100P, Poison Poison Jab 80P, Dark Throat Chop 80P, Fire Fire Punch 75P
  Special coverage: Normal Uproar 90S, Ground Mud-Slap 20S

**Hitmontop** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fighting | BST 455 (50/95/95/35/110/70) | Abilities: Intimidate / Technician / Steadfast
  Engine stats @252 (neutral/positive): Intimidate: Atk 289/317, SpA 169/185, Spe 239/262 — Technician: Atk 289/317, SpA 169/185, Spe 239/262 — Steadfast: Atk 289/317, SpA 169/185, Spe 239/262
  Item: **free**
  STAB: Fighting High Jump Kick 130P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Ice Ice Spinner 80P, Dark Sucker Punch 80P, Flying Aerial Ace 60P
  Special coverage: Normal Uproar 90S, Dragon Twister 40S, Ground Mud-Slap 20S

**Honchkrow** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Dark/Flying | BST 505 (100/125/52/105/52/71) | Abilities: Insomnia / Super Luck / Moxie
  Engine stats @252 (neutral/positive): Insomnia: Atk 349/383, SpA 309/339, Spe 241/265 — Super Luck: Atk 349/383, SpA 309/339, Spe 241/265 — Moxie: Atk 349/383, SpA 309/339, Spe 241/265
  Item: **free**
  STAB: Dark Foul Play 95P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Steel Steel Wing 70P, Bug U-turn 70P, Ghost Astonish 30P
  Special coverage: Psychic Dream Eater 100S, Fire Heat Wave 100S, Normal Uproar 90S, Ghost Shadow Ball 80S, Ice Icy Wind 55S, Water Chilling Water 50S

**Honedge** — species, **ZU**, source: imported (redgpt-zu-floor)
  Steel/Ghost | BST 325 (45/80/100/35/37/28) | Abilities: No Guard
  Engine stats @252 (neutral/positive): No Guard: Atk 259/284, SpA 169/185, Spe 155/170
  Item: **free**
  STAB: Steel Iron Head 80P · Ghost Shadow Claw 70P
  Physical coverage: Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Return 102P, Rock Rock Slide 75P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Normal Hidden Power 60S, Electric Shock Wave 60S

**Hoothoot** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Flying | BST 262 (60/30/30/36/56/50) | Abilities: Insomnia / Keen Eye / Tinted Lens
  Engine stats @252 (neutral/positive): Insomnia: Atk 159/174, SpA 171/188, Spe 199/218 — Keen Eye: Atk 159/174, SpA 171/188, Spe 199/218 — Tinted Lens: Atk 159/174, SpA 171/188, Spe 199/218
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Psychic Zen Headbutt 80P, Steel Steel Wing 70P, Dark Feint Attack 60P
  Special coverage: Psychic Synchronoise 120S, Fire Heat Wave 100S, Fairy Moonblast 95S, Ghost Shadow Ball 80S, Bug Silver Wind 60S, Dragon Twister 40S

**Hoppip** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Flying | BST 250 (35/35/40/35/55/50) | Abilities: Chlorophyll / Leaf Guard / Infiltrator
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 169/185, SpA 169/185, Spe 199/218 — Leaf Guard: Atk 169/185, SpA 169/185, Spe 199/218 — Infiltrator: Atk 169/185, SpA 169/185, Spe 199/218
  Item: **free**
  STAB: Grass Leaf Storm 140S · Flying Acrobatics 110P
  Physical coverage: Normal Double-Edge 120P, Bug Lunge 80P, Dark Thief 60P
  Special coverage: Bug Pollen Puff 90S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Psychic Confusion 50S

**Horsea** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 295 (30/40/70/70/25/60) | Abilities: Swift Swim / Sniper / Damp
  Engine stats @252 (neutral/positive): Swift Swim: Atk 179/196, SpA 239/262, Spe 219/240 — Sniper: Atk 179/196, SpA 239/262, Spe 219/240 — Damp: Atk 179/196, SpA 239/262, Spe 219/240
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Flying Bounce 85 (charge)P
  Special coverage: Ice Blizzard 120S, Dragon Dragon Pulse 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Poison Clear Smog 50S

**Houndoom** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Dark/Fire | BST 500 (75/90/50/110/80/95) | Abilities: Early Bird / Flash Fire / Unnerve
  Engine stats @252 (neutral/positive): Early Bird: Atk 279/306, SpA 319/350, Spe 289/317 — Flash Fire: Atk 279/306, SpA 319/350, Spe 289/317 — Unnerve: Atk 279/306, SpA 319/350, Spe 289/317
  Item: **free**
  STAB: Dark Foul Play 95P · Fire Overheat 140S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P, Electric Thunder Fang 65P, Grass Trailblaze 50P, Fighting Rock Smash 40P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Hyper Voice 90S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S, Ground Mud Shot 55S

**Houndour** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark/Fire | BST 330 (45/60/30/80/50/65) | Abilities: Early Bird / Flash Fire / Unnerve
  Engine stats @252 (neutral/positive): Early Bird: Atk 219/240, SpA 259/284, Spe 229/251 — Flash Fire: Atk 219/240, SpA 259/284, Spe 229/251 — Unnerve: Atk 219/240, SpA 259/284, Spe 229/251
  Item: **free**
  STAB: Dark Foul Play 95P · Fire Overheat 140S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P, Electric Thunder Fang 65P, Grass Trailblaze 50P, Fighting Rock Smash 40P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Hyper Voice 90S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S, Ground Mud Shot 55S

**Huntail** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Water | BST 485 (55/104/105/94/75/52) | Abilities: Swift Swim / Water Veil
  Engine stats @252 (neutral/positive): Swift Swim: Atk 307/337, SpA 287/315, Spe 203/223 — Water Veil: Atk 307/337, SpA 287/315, Spe 203/223
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Double-Edge 120P, Flying Bounce 85 (charge)P, Dark Crunch 80P, Ice Ice Fang 65P, Rock Rock Tomb 60P
  Special coverage: Ice Blizzard 120S, Normal Hidden Power 60S, Bug Infestation 20S, Ground Mud-Slap 20S

**Hypno** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Psychic | BST 483 (85/73/70/73/115/67) | Abilities: Insomnia / Forewarn / Inner Focus
  Engine stats @252 (neutral/positive): Insomnia: Atk 245/269, SpA 245/269, Spe 233/256 — Forewarn: Atk 245/269, SpA 245/269, Spe 233/256 — Inner Focus: Atk 245/269, SpA 245/269, Spe 233/256
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dark Foul Play 95P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Zap Cannon 120S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Igglybuff** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Fairy | BST 210 (90/30/15/40/20/15) | Abilities: Cute Charm / Competitive / Friend Guard
  Engine stats @252 (neutral/positive): Cute Charm: Atk 159/174, SpA 179/196, Spe 129/141 — Competitive: Atk 159/174, SpA 179/196, Spe 129/141 — Friend Guard: Atk 159/174, SpA 179/196, Spe 129/141
  Item: **free**
  STAB: Normal Last Resort 140P · Fairy Play Rough 90P
  Physical coverage: Ground Dig 100 (charge)P, Electric Wild Charge 90P, Flying Bounce 85 (charge)P, Dark Feint Attack 60P, Grass Trailblaze 50P, Rock Rollout 30P
  Special coverage: Fire Fire Blast 120S, Electric Zap Cannon 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ghost Shadow Ball 80S, Water Water Pulse 60S

**Illumise** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Bug | BST 430 (65/47/75/73/85/85) | Abilities: Oblivious / Tinted Lens / Prankster
  Engine stats @252 (neutral/positive): Oblivious: Atk 193/212, SpA 245/269, Spe 269/295 — Tinted Lens: Atk 193/212, SpA 245/269, Spe 269/295 — Prankster: Atk 193/212, SpA 245/269, Spe 269/295
  Item: **free**
  STAB: Bug Bug Buzz 90S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Flying Acrobatics 110P, Fairy Play Rough 90P, Psychic Zen Headbutt 80P, Ice Ice Punch 75P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Flying Air Slash 75S

**Impidimp** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark/Fairy | BST 265 (45/45/30/55/40/50) | Abilities: Prankster / Frisk / Pickpocket
  Engine stats @252 (neutral/positive): Prankster: Atk 189/207, SpA 209/229, Spe 199/218 — Frisk: Atk 189/207, SpA 209/229, Spe 199/218 — Pickpocket: Atk 189/207, SpA 209/229, Spe 199/218
  Item: **free**
  STAB: Dark Foul Play 95P · Fairy Play Rough 90P
  Physical coverage: Normal Mega Kick 120P, Bug Leech Life 80P, Fighting Drain Punch 75P, Grass Trailblaze 50P
  Special coverage: Normal Uproar 90S, Fire Burning Jealousy 70S, Water Chilling Water 50S

**Inkay** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark/Psychic | BST 288 (53/54/53/37/46/45) | Abilities: Contrary / Suction Cups / Infiltrator
  Engine stats @252 (neutral/positive): Contrary: Atk 207/227, SpA 173/190, Spe 189/207 — Suction Cups: Atk 207/227, SpA 173/190, Spe 189/207 — Infiltrator: Atk 207/227, SpA 173/190, Spe 189/207
  Item: **free**
  STAB: Dark Foul Play 95P · Psychic Future Sight 120S
  Physical coverage: Fighting Superpower 120P, Normal Return 102P, Water Liquidation 85P, Bug Lunge 80P, Rock Rock Slide 75P, Flying Aerial Ace 60P
  Special coverage: Fire Flamethrower 95S, Electric Thunderbolt 95S, Normal Tera Blast 80S

**Ivysaur** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Poison | BST 405 (60/62/63/80/80/60) | Abilities: Overgrow / Chlorophyll
  Engine stats @252 (neutral/positive): Overgrow: Atk 223/245, SpA 259/284, Spe 219/240 — Chlorophyll: Atk 223/245, SpA 259/284, Spe 219/240
  Item: **free**
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Dark Knock Off 65P, Bug Fury Cutter 40P, Fighting Rock Smash 40P
  Special coverage: Normal Tera Blast 80S, Ground Mud-Slap 20S

**Jangmo-o** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dragon | BST 300 (45/55/65/45/45/45) | Abilities: Bulletproof / Soundproof / Overcoat
  Engine stats @252 (neutral/positive): Bulletproof: Atk 209/229, SpA 189/207, Spe 189/207 — Soundproof: Atk 209/229, SpA 189/207, Spe 189/207 — Overcoat: Atk 209/229, SpA 189/207, Spe 189/207
  Item: **free**
  STAB: Dragon Draco Meteor 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Return 102P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Normal Uproar 90S

**Jigglypuff** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Fairy | BST 270 (115/45/20/45/25/20) | Abilities: Cute Charm / Competitive / Friend Guard
  Engine stats @252 (neutral/positive): Cute Charm: Atk 189/207, SpA 189/207, Spe 139/152 — Competitive: Atk 189/207, SpA 189/207, Spe 139/152 — Friend Guard: Atk 189/207, SpA 189/207, Spe 139/152
  Item: **free**
  STAB: Normal Self-Destruct 200P · Fairy Misty Explosion 100S
  Physical coverage: Fighting Focus Punch 150P, Steel Steel Roller 130P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Flying Bounce 85 (charge)P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S

**Jolteon** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 525 (65/65/60/110/95/130) | Abilities: Volt Absorb / Quick Feet
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 229/251, SpA 319/350, Spe 359/394 — Quick Feet: Atk 229/251, SpA 319/350, Spe 359/394
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Last Resort 140P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Bug Pin Missile 25x2-5P, Dark Bite 60P
  Special coverage: Normal Trump Card 200S, Psychic Synchronoise 120S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Ground Mud-Slap 20S

**Joltik** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Electric | BST 319 (50/47/50/57/50/65) | Abilities: Compound Eyes / Unnerve / Swarm
  Engine stats @252 (neutral/positive): Compound Eyes: Atk 193/212, SpA 213/234, Spe 229/251 — Unnerve: Atk 193/212, SpA 213/234, Spe 229/251 — Swarm: Atk 193/212, SpA 213/234, Spe 229/251
  Item: **free**
  STAB: Bug Bug Buzz 90S · Electric Thunder 120S
  Physical coverage: Normal Return 102P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P, Dark Sucker Punch 80P
  Special coverage: Grass Energy Ball 90S, Normal Tera Blast 80S

**Jumpluff** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass/Flying | BST 460 (75/55/70/55/95/110) | Abilities: Chlorophyll / Leaf Guard / Infiltrator
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 209/229, SpA 209/229, Spe 319/350 — Leaf Guard: Atk 209/229, SpA 209/229, Spe 319/350 — Infiltrator: Atk 209/229, SpA 209/229, Spe 319/350
  Item: **free**
  STAB: Grass Leaf Storm 140S · Flying Acrobatics 110P
  Physical coverage: Normal Double-Edge 120P, Bug Lunge 80P, Dark Thief 60P
  Special coverage: Bug Pollen Puff 90S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Psychic Confusion 50S

**Jynx** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Ice/Psychic | BST 455 (65/50/35/115/95/95) | Abilities: Oblivious / Forewarn / Dry Skin
  Engine stats @252 (neutral/positive): Oblivious: Atk 199/218, SpA 329/361, Spe 289/317 — Forewarn: Atk 199/218, SpA 329/361, Spe 289/317 — Dry Skin: Atk 199/218, SpA 329/361, Spe 289/317
  Item: **free**
  STAB: Ice Blizzard 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dark Thief 60P, Ghost Lick 30P
  Special coverage: Fighting Focus Blast 120S, Normal Wring Out 120S, Grass Energy Ball 90S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Water Bubble Beam 65S

**Kabuto** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Water | BST 355 (30/80/90/55/45/55) | Abilities: Swift Swim / Battle Armor / Weak Armor
  Engine stats @252 (neutral/positive): Swift Swim: Atk 259/284, SpA 209/229, Spe 209/229 — Battle Armor: Atk 259/284, SpA 209/229, Spe 209/229 — Weak Armor: Atk 259/284, SpA 209/229, Spe 209/229
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Water Hydro Pump 120S
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Bug Leech Life 80P, Dark Knock Off 65P, Flying Aerial Ace 60P, Fighting Rock Smash 40P
  Special coverage: Ice Blizzard 120S, Normal Wring Out 120S, Ground Earth Power 90S, Grass Giga Drain 75S

**Kabutops** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Rock/Water | BST 495 (60/115/105/65/70/80) | Abilities: Swift Swim / Battle Armor / Weak Armor
  Engine stats @252 (neutral/positive): Swift Swim: Atk 329/361, SpA 229/251, Spe 259/284 — Battle Armor: Atk 329/361, SpA 229/251, Spe 259/284 — Weak Armor: Atk 329/361, SpA 229/251, Spe 259/284
  Item: **free**
  STAB: Rock Stone Edge 100P · Water Aqua Tail 90P
  Physical coverage: Normal Skull Bash 130P, Fighting Superpower 120P, Ground Dig 100 (charge)P, Bug Leech Life 80P, Poison Cross Poison 70P, Dark Night Slash 70P
  Special coverage: Ice Blizzard 120S, Normal Wring Out 120S, Ground Earth Power 90S, Grass Giga Drain 75S

**Kakuna** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Poison | BST 205 (45/25/50/25/25/35) | Abilities: Shed Skin
  Engine stats @252 (neutral/positive): Shed Skin: Atk 149/163, SpA 149/163, Spe 169/185
  Item: **free**
  STAB: Bug Bug Bite 60P · Poison Poison Sting 15P
  Physical coverage: **none**
  Special coverage: Electric Electroweb 55S

**Kangaskhan** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Normal | BST 490 (105/95/80/40/80/90) | Abilities: Early Bird / Scrappy / Inner Focus
  Engine stats @252 (neutral/positive): Early Bird: Atk 289/317, SpA 179/196, Spe 279/306 — Scrappy: Atk 289/317, SpA 179/196, Spe 279/306 — Inner Focus: Atk 289/317, SpA 179/196, Spe 279/306
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Dark Crunch 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S

**Karrablast** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 315 (50/75/45/40/45/60) | Abilities: Swarm / Shed Skin / No Guard
  Engine stats @252 (neutral/positive): Swarm: Atk 249/273, SpA 179/196, Spe 219/240 — Shed Skin: Atk 249/273, SpA 179/196, Spe 219/240 — No Guard: Atk 249/273, SpA 179/196, Spe 219/240
  Item: **free**
  STAB: Bug Megahorn 120P
  Physical coverage: Normal Double-Edge 120P, Ground Drill Run 80P, Poison Poison Jab 80P, Dark Night Slash 70P, Flying Aerial Ace 60P, Fighting Counter fixedP
  Special coverage: Grass Energy Ball 90S, Normal Hidden Power 60S, Poison Acid Spray 40S

**Kecleon** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Normal | BST 440 (60/90/70/60/120/40) | Abilities: Color Change / Protean
  Engine stats @252 (neutral/positive): Color Change: Atk 279/306, SpA 219/240, Spe 179/196 — Protean: Atk 279/306, SpA 219/240, Spe 179/196
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Water Aqua Tail 90P, Fire Fire Punch 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Synchronoise 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S

**Kirlia** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic/Fairy | BST 278 (38/35/35/65/55/50) | Abilities: Synchronize / Trace / Telepathy
  Engine stats @252 (neutral/positive): Synchronize: Atk 169/185, SpA 229/251, Spe 199/218 — Trace: Atk 169/185, SpA 229/251, Spe 199/218 — Telepathy: Atk 169/185, SpA 229/251, Spe 199/218
  Item: **free**
  STAB: Psychic Future Sight 120S · Fairy Alluring Voice 80S
  Physical coverage: Normal Double-Edge 120P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Dark Knock Off 65P, Ghost Shadow Sneak 40P
  Special coverage: Electric Thunderbolt 95S, Normal Hyper Voice 90S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S, Bug Signal Beam 75S, Grass Grass Knot 60S

**Klang** — species, **ZU**, source: imported (redgpt-zu-floor)
  Steel | BST 440 (60/80/95/70/85/50) | Abilities: Plus / Minus / Clear Body
  Engine stats @252 (neutral/positive): Plus: Atk 259/284, SpA 239/262, Spe 199/218 — Minus: Atk 259/284, SpA 239/262, Spe 199/218 — Clear Body: Atk 259/284, SpA 239/262, Spe 199/218
  Item: **free**
  STAB: Steel Steel Beam 140S
  Physical coverage: Normal Return 102P, Electric Wild Charge 90P, Dark Assurance 60P, Fighting Rock Smash 40P
  Special coverage: Electric Zap Cannon 120S, Normal Uproar 90S, Rock Power Gem 80S, Bug Signal Beam 75S

**Klawf** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Rock | BST 450 (70/100/115/35/55/75) | Abilities: Anger Shell / Shell Armor / Regenerator
  Engine stats @252 (neutral/positive): Anger Shell: Atk 299/328, SpA 169/185, Spe 249/273 — Shell Armor: Atk 299/328, SpA 169/185, Spe 249/273 — Regenerator: Atk 299/328, SpA 169/185, Spe 249/273
  Item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Water Crabhammer 100P, Ground Dig 100 (charge)P, Normal Take Down 90P, Dark Throat Chop 80P, Bug X-Scissor 80P, Fighting Brick Break 75P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S

**Klink** — species, **ZU**, source: imported (redgpt-zu-floor)
  Steel | BST 300 (40/55/70/45/60/30) | Abilities: Plus / Minus / Clear Body
  Engine stats @252 (neutral/positive): Plus: Atk 209/229, SpA 189/207, Spe 159/174 — Minus: Atk 209/229, SpA 189/207, Spe 159/174 — Clear Body: Atk 209/229, SpA 189/207, Spe 159/174
  Item: **free**
  STAB: Steel Steel Beam 140S
  Physical coverage: Normal Return 102P, Electric Wild Charge 90P, Dark Assurance 60P, Fighting Rock Smash 40P
  Special coverage: Electric Zap Cannon 120S, Normal Uproar 90S, Rock Power Gem 80S, Bug Signal Beam 75S

**Klinklang** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Steel | BST 520 (60/100/115/70/85/90) | Abilities: Plus / Minus / Clear Body
  Engine stats @252 (neutral/positive): Plus: Atk 299/328, SpA 239/262, Spe 279/306 — Minus: Atk 299/328, SpA 239/262, Spe 279/306 — Clear Body: Atk 299/328, SpA 239/262, Spe 279/306
  Item: **free**
  STAB: Steel Steel Beam 140S
  Physical coverage: Normal Return 102P, Electric Wild Charge 90P, Dark Assurance 60P, Fighting Rock Smash 40P
  Special coverage: Electric Thunder 120S, Normal Uproar 90S, Rock Power Gem 80S, Bug Signal Beam 75S

**Koffing** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison | BST 340 (40/65/95/60/45/35) | Abilities: Levitate / Neutralizing Gas / Stench
  Engine stats @252 (neutral/positive): Levitate: Atk 229/251, SpA 219/240, Spe 169/185 — Neutralizing Gas: Atk 229/251, SpA 219/240, Spe 169/185 — Stench: Atk 229/251, SpA 219/240, Spe 169/185
  Item: **free**
  STAB: Poison Belch 120S
  Physical coverage: Normal Explosion 250P, Dark Assurance 60P, Steel Gyro Ball 35P, Rock Rollout 30P
  Special coverage: Fire Fire Blast 120S, Electric Thunder 120S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Psychic Psybeam 65S

**Komala** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 480 (65/115/65/75/95/65) | Abilities: Comatose
  Engine stats @252 (neutral/positive): Comatose: Atk 329/361, SpA 249/273, Spe 229/251
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Poison Gunk Shot 120P, Fighting Superpower 120P, Grass Wood Hammer 120P, Flying Acrobatics 110P, Ground Earthquake 100P, Fairy Play Rough 90P
  Special coverage: **none**

**Krabby** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 325 (30/105/90/25/25/50) | Abilities: Hyper Cutter / Shell Armor / Sheer Force
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 309/339, SpA 149/163, Spe 199/218 — Shell Armor: Atk 309/339, SpA 149/163, Spe 199/218 — Sheer Force: Atk 309/339, SpA 149/163, Spe 199/218
  Item: **free**
  STAB: Water Crabhammer 100P
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Ground Dig 100 (charge)P, Bug X-Scissor 80P, Rock Rock Slide 75P, Dark Night Slash 70P
  Special coverage: Ice Blizzard 120S, Rock Ancient Power 60S, Normal Hidden Power 60S, Ground Mud Shot 55S

**Kricketot** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 194 (37/25/41/25/41/25) | Abilities: Shed Skin / Run Away
  Engine stats @252 (neutral/positive): Shed Skin: Atk 149/163, SpA 149/163, Spe 149/163 — Run Away: Atk 149/163, SpA 149/163, Spe 149/163
  Item: **free**
  STAB: Bug Lunge 80P
  Physical coverage: Normal Tackle 50P
  Special coverage: Normal Uproar 90S, Ground Mud-Slap 20S

**Kricketune** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Bug | BST 384 (77/85/51/55/51/65) | Abilities: Swarm / Technician
  Engine stats @252 (neutral/positive): Swarm: Atk 269/295, SpA 209/229, Spe 229/251 — Technician: Atk 269/295, SpA 209/229, Spe 229/251
  Item: **free**
  STAB: Bug Bug Buzz 90S
  Physical coverage: Normal Return 102P, Dark Throat Chop 80P, Fighting Brick Break 75P, Flying Aerial Ace 60P, Grass Trailblaze 50P
  Special coverage: Normal Hyper Voice 90S, Grass Giga Drain 75S, Ground Mud-Slap 20S

**Krokorok** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground/Dark | BST 351 (60/82/45/45/45/74) | Abilities: Intimidate / Moxie / Anger Point
  Engine stats @252 (neutral/positive): Intimidate: Atk 263/289, SpA 189/207, Spe 247/271 — Moxie: Atk 263/289, SpA 189/207, Spe 247/271 — Anger Point: Atk 263/289, SpA 189/207, Spe 247/271
  Item: **free**
  STAB: Ground Earthquake 100P · Dark Foul Play 95P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P, Dragon Dragon Claw 80P
  Special coverage: Poison Sludge Bomb 90S, Normal Uproar 90S, Grass Grass Knot 60S, Fire Incinerate 60S

**Kubfu** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fighting | BST 385 (60/90/60/53/50/72) | Abilities: Inner Focus
  Engine stats @252 (neutral/positive): Inner Focus: Atk 279/306, SpA 205/225, Spe 243/267
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Flying Acrobatics 110P, Ground Dig 100 (charge)P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Normal Tera Blast 80S

**Lapras** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Water/Ice | BST 535 (130/85/80/85/95/60) | Abilities: Water Absorb / Shell Armor / Hydration
  Engine stats @252 (neutral/positive): Water Absorb: Atk 269/295, SpA 269/295, Spe 219/240 — Shell Armor: Atk 269/295, SpA 269/295, Spe 219/240 — Hydration: Atk 269/295, SpA 269/295, Spe 219/240
  Item: **free**
  STAB: Water Hydro Pump 120S · Ice Blizzard 120S
  Physical coverage: Normal Skull Bash 130P, Bug Megahorn 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fighting Body Press 80P
  Special coverage: Psychic Future Sight 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Dragon Dragon Pulse 90S, Normal Hyper Voice 90S, Fairy Alluring Voice 80S

**Larvesta** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Fire | BST 360 (55/85/55/50/55/60) | Abilities: Flame Body / Swarm
  Engine stats @252 (neutral/positive): Flame Body: Atk 269/295, SpA 199/218, Spe 219/240 — Swarm: Atk 269/295, SpA 199/218, Spe 219/240
  Item: **free**
  STAB: Bug Leech Life 80P · Fire Flare Blitz 120P
  Physical coverage: Normal Double-Edge 120P, Flying Acrobatics 110P, Electric Wild Charge 90P, Psychic Zen Headbutt 80P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Psychic 90S, Normal Tera Blast 80S

**Larvitar** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Ground | BST 300 (50/64/50/45/50/41) | Abilities: Guts / Sand Veil
  Engine stats @252 (neutral/positive): Guts: Atk 227/249, SpA 189/207, Spe 181/199 — Sand Veil: Atk 227/249, SpA 189/207, Spe 181/199
  Item: **free**
  STAB: Rock Stone Edge 100P · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Fighting Superpower 120P, Steel Iron Tail 100P, Dark Crunch 80P
  Special coverage: Water Muddy Water 95S, Normal Uproar 90S, Dark Dark Pulse 80S

**Leafeon** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass | BST 525 (65/110/130/60/65/95) | Abilities: Leaf Guard / Chlorophyll
  Engine stats @252 (neutral/positive): Leaf Guard: Atk 319/350, SpA 219/240, Spe 289/317 — Chlorophyll: Atk 319/350, SpA 219/240, Spe 289/317
  Item: **free**
  STAB: Grass Solar Blade 125 (charge)P
  Physical coverage: Normal Last Resort 140P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Bug X-Scissor 80P, Dark Knock Off 65P
  Special coverage: Normal Trump Card 200S, Psychic Synchronoise 120S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Ground Mud Shot 55S

**Leavanny** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Bug/Grass | BST 500 (75/103/80/70/80/92) | Abilities: Swarm / Chlorophyll / Overcoat
  Engine stats @252 (neutral/positive): Swarm: Atk 305/335, SpA 239/262, Spe 283/311 — Chlorophyll: Atk 305/335, SpA 239/262, Spe 283/311 — Overcoat: Atk 305/335, SpA 239/262, Spe 283/311
  Item: **free**
  STAB: Bug Bug Buzz 90S · Grass Leaf Storm 140S
  Physical coverage: Normal Return 102P, Poison Poison Jab 80P, Dark Throat Chop 80P, Ghost Shadow Claw 70P, Steel Steel Wing 70P, Flying Aerial Ace 60P
  Special coverage: Psychic Dream Eater 100S, Normal Tera Blast 80S, Flying Air Slash 75S, Electric Electroweb 55S

**Lechonk** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 254 (54/45/40/35/45/35) | Abilities: Aroma Veil / Gluttony / Thick Fat
  Engine stats @252 (neutral/positive): Aroma Veil: Atk 189/207, SpA 169/185, Spe 169/185 — Gluttony: Atk 189/207, SpA 169/185, Spe 169/185 — Thick Fat: Atk 189/207, SpA 169/185, Spe 169/185
  Item: **free**
  STAB: Normal Double-Edge 120P
  Physical coverage: Ground Dig 100 (charge)P, Fairy Play Rough 90P, Steel Iron Head 80P, Grass Seed Bomb 80P, Psychic Zen Headbutt 80P, Dark Thief 60P
  Special coverage: Ground Mud Shot 55S, Water Chilling Water 50S, Fairy Disarming Voice 40S

**Ledian** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Bug/Flying | BST 390 (55/35/50/55/110/85) | Abilities: Swarm / Early Bird / Iron Fist
  Engine stats @252 (neutral/positive): Swarm: Atk 169/185, SpA 209/229, Spe 269/295 — Early Bird: Atk 169/185, SpA 209/229, Spe 269/295 — Iron Fist: Atk 169/185, SpA 209/229, Spe 269/295
  Item: **free**
  STAB: Bug Bug Buzz 90S · Flying Acrobatics 110P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Dig 100 (charge)P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Dark Knock Off 65P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Psychic Psybeam 65S, Ghost Ominous Wind 60S

**Ledyba** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Flying | BST 265 (40/20/30/40/80/55) | Abilities: Swarm / Early Bird / Rattled
  Engine stats @252 (neutral/positive): Swarm: Atk 139/152, SpA 179/196, Spe 209/229 — Early Bird: Atk 139/152, SpA 179/196, Spe 209/229 — Rattled: Atk 139/152, SpA 179/196, Spe 209/229
  Item: **free**
  STAB: Bug Bug Buzz 90S · Flying Acrobatics 110P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Dig 100 (charge)P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Dark Knock Off 65P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Psychic Psybeam 65S, Ghost Ominous Wind 60S

**Lickilicky** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Normal | BST 515 (110/85/95/80/95/50) | Abilities: Own Tempo / Oblivious / Cloud Nine
  Engine stats @252 (neutral/positive): Own Tempo: Atk 269/295, SpA 259/284, Spe 199/218 — Oblivious: Atk 269/295, SpA 259/284, Spe 199/218 — Cloud Nine: Atk 269/295, SpA 259/284, Spe 199/218
  Item: **free**
  STAB: Normal Explosion 250P
  Physical coverage: Fighting Focus Punch 150P, Steel Steel Roller 130P, Grass Power Whip 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Psychic Zen Headbutt 80P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S

**Lickitung** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 385 (90/55/75/60/75/30) | Abilities: Own Tempo / Oblivious / Cloud Nine
  Engine stats @252 (neutral/positive): Own Tempo: Atk 209/229, SpA 219/240, Spe 159/174 — Oblivious: Atk 209/229, SpA 219/240, Spe 159/174 — Cloud Nine: Atk 209/229, SpA 219/240, Spe 159/174
  Item: **free**
  STAB: Normal Skull Bash 130P
  Physical coverage: Fighting Focus Punch 150P, Steel Steel Roller 130P, Grass Power Whip 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Psychic Zen Headbutt 80P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Fire Fire Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S

**Liepard** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Dark | BST 446 (64/88/50/88/50/106) | Abilities: Limber / Unburden / Prankster
  Engine stats @252 (neutral/positive): Limber: Atk 275/302, SpA 275/302, Spe 311/342 — Unburden: Atk 275/302, SpA 275/302, Spe 311/342 — Prankster: Atk 275/302, SpA 275/302, Spe 311/342
  Item: **free**
  STAB: Dark Foul Play 95P
  Physical coverage: Poison Gunk Shot 120P, Normal Return 102P, Steel Iron Tail 100P, Fairy Play Rough 90P, Grass Seed Bomb 80P, Psychic Psycho Cut 70P
  Special coverage: Psychic Dream Eater 100S, Normal Hyper Voice 90S, Ghost Shadow Ball 80S, Fire Burning Jealousy 70S, Grass Grass Knot 60S

**Lileep** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Grass | BST 355 (66/41/77/61/87/23) | Abilities: Suction Cups / Storm Drain
  Engine stats @252 (neutral/positive): Suction Cups: Atk 181/199, SpA 221/243, Spe 145/159 — Storm Drain: Atk 181/199, SpA 221/243, Spe 145/159
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Grass Solar Beam 120 (charge)S
  Physical coverage: Normal Double-Edge 120P, Ghost Astonish 30P
  Special coverage: Normal Wring Out 120S, Ground Earth Power 90S, Poison Sludge Bomb 90S, Water Brine 65S, Bug Infestation 20S, Psychic Mirror Coat fixedS

**Lilligant** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass | BST 480 (70/60/75/110/75/90) | Abilities: Chlorophyll / Own Tempo / Leaf Guard
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 219/240, SpA 319/350, Spe 279/306 — Own Tempo: Atk 219/240, SpA 319/350, Spe 279/306 — Leaf Guard: Atk 219/240, SpA 319/350, Spe 279/306
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Return 102P
  Special coverage: Psychic Dream Eater 100S, Bug Pollen Puff 90S, Fairy Alluring Voice 80S, Normal Tera Blast 80S

**Lillipup** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 275 (45/60/45/25/45/55) | Abilities: Vital Spirit / Pickup / Run Away
  Engine stats @252 (neutral/positive): Vital Spirit: Atk 219/240, SpA 149/163, Spe 209/229 — Pickup: Atk 219/240, SpA 149/163, Spe 209/229 — Run Away: Atk 219/240, SpA 149/163, Spe 209/229
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Ground Dig 100 (charge)P, Fairy Play Rough 90P, Electric Wild Charge 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Fire Fire Fang 65P
  Special coverage: Electric Thunderbolt 95S, Ghost Shadow Ball 80S, Dark Snarl 55S, Ground Mud-Slap 20S

**Linoone-Galar** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark/Normal | BST 420 (78/70/61/50/61/100) | Abilities: Pickup / Gluttony / Quick Feet
  Engine stats @252 (neutral/positive): Pickup: Atk 239/262, SpA 199/218, Spe 299/328 — Gluttony: Atk 239/262, SpA 199/218, Spe 299/328 — Quick Feet: Atk 239/262, SpA 199/218, Spe 299/328
  Item: **free**
  STAB: Dark Throat Chop 80P · Normal Last Resort 140P
  Physical coverage: Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Fighting Body Press 80P, Grass Seed Bomb 80P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Water Surf 95S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Ground Mud Shot 55S

**Litleo** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire/Normal | BST 369 (62/50/58/73/54/72) | Abilities: Rivalry / Unnerve / Moxie
  Engine stats @252 (neutral/positive): Rivalry: Atk 199/218, SpA 245/269, Spe 243/267 — Unnerve: Atk 199/218, SpA 245/269, Spe 243/267 — Moxie: Atk 199/218, SpA 245/269, Spe 243/267
  Item: **free**
  STAB: Fire Overheat 140S · Normal Double-Edge 120P
  Physical coverage: Flying Acrobatics 110P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Dark Dark Pulse 80S, Ground Mud-Slap 20S

**Litten** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 320 (45/65/40/60/40/70) | Abilities: Blaze / Intimidate
  Engine stats @252 (neutral/positive): Blaze: Atk 229/251, SpA 219/240, Spe 239/262 — Intimidate: Atk 229/251, SpA 219/240, Spe 239/262
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Flying Acrobatics 110P, Fighting Double Kick 50x2P, Dark Crunch 80P, Bug Leech Life 80P
  Special coverage: Normal Tera Blast 80S

**Litwick** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ghost/Fire | BST 275 (50/30/55/65/55/20) | Abilities: Flash Fire / Flame Body / Infiltrator / Shadow Tag
  Engine stats @252 (neutral/positive): Flash Fire: Atk 159/174, SpA 229/251, Spe 139/152 — Flame Body: Atk 159/174, SpA 229/251, Spe 139/152 — Infiltrator: Atk 159/174, SpA 229/251, Spe 139/152 — Shadow Tag: Atk 159/174, SpA 229/251, Spe 139/152
  **TRAPPING ABILITY: Shadow Tag** (optional — one of 4)
  Item: **free**
  STAB: Ghost Shadow Ball 80S · Fire Overheat 140S
  Physical coverage: Normal Return 102P, Bug Skitter Smack 70P, Dark Thief 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S

**Lombre** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Grass | BST 340 (60/50/50/60/70/50) | Abilities: Swift Swim / Rain Dish / Own Tempo
  Engine stats @252 (neutral/positive): Swift Swim: Atk 199/218, SpA 219/240, Spe 199/218 — Rain Dish: Atk 199/218, SpA 219/240, Spe 199/218 — Own Tempo: Atk 199/218, SpA 219/240, Spe 199/218
  Item: **free**
  STAB: Water Hydro Pump 120S · Grass Solar Beam 120 (charge)S
  Physical coverage: Normal Double-Edge 120P, Fighting Dynamic Punch 100P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Ice Blizzard 120S, Normal Hyper Voice 90S, Ground Mud Shot 55S, Fairy Disarming Voice 40S

**Lopunny** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Normal | BST 480 (65/76/84/54/96/105) | Abilities: Cute Charm / Klutz / Limber
  Engine stats @252 (neutral/positive): Cute Charm: Atk 251/276, SpA 207/227, Spe 309/339 — Klutz: Atk 251/276, SpA 207/227, Spe 309/339 — Limber: Atk 251/276, SpA 207/227, Spe 309/339
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Flying Acrobatics 110P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Fire Fire Punch 75P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S, Water Water Pulse 60S

**Lotad** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Grass | BST 220 (40/30/30/40/50/30) | Abilities: Swift Swim / Rain Dish / Own Tempo
  Engine stats @252 (neutral/positive): Swift Swim: Atk 159/174, SpA 179/196, Spe 159/174 — Rain Dish: Atk 159/174, SpA 179/196, Spe 159/174 — Own Tempo: Atk 159/174, SpA 179/196, Spe 159/174
  Item: **free**
  STAB: Water Muddy Water 95S · Grass Solar Beam 120 (charge)S
  Physical coverage: Normal Double-Edge 120P, Psychic Zen Headbutt 80P, Dark Thief 60P, Ghost Astonish 30P, Fighting Counter fixedP
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Fairy Disarming Voice 40S

**Loudred** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 360 (84/71/43/71/43/48) | Abilities: Soundproof / Scrappy
  Engine stats @252 (neutral/positive): Soundproof: Atk 241/265, SpA 241/265, Spe 195/214 — Scrappy: Atk 241/265, SpA 241/265, Spe 195/214
  Item: **free**
  STAB: Normal Double-Edge 120P
  Physical coverage: Fighting Dynamic Punch 100P, Ground Earthquake 100P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P, Ice Ice Punch 75P, Rock Rock Slide 75P
  Special coverage: Fire Overheat 140S, Ice Blizzard 120S, Psychic Synchronoise 120S, Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S, Electric Shock Wave 60S

**Ludicolo** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Water/Grass | BST 480 (80/70/70/90/100/70) | Abilities: Swift Swim / Rain Dish / Own Tempo
  Engine stats @252 (neutral/positive): Swift Swim: Atk 239/262, SpA 279/306, Spe 239/262 — Rain Dish: Atk 239/262, SpA 279/306, Spe 239/262 — Own Tempo: Atk 239/262, SpA 279/306, Spe 239/262
  Item: **free**
  STAB: Water Hydro Pump 120S · Grass Leaf Storm 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ice Ice Spinner 80P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P, Electric Thunder Punch 75P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Normal Hyper Voice 90S, Ground Mud Shot 55S, Fairy Disarming Voice 40S

**Lumineon** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Water | BST 460 (69/69/76/69/86/91) | Abilities: Swift Swim / Storm Drain / Water Veil
  Engine stats @252 (neutral/positive): Swift Swim: Atk 237/260, SpA 237/260, Spe 281/309 — Storm Drain: Atk 237/260, SpA 237/260, Spe 281/309 — Water Veil: Atk 237/260, SpA 237/260, Spe 281/309
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Bug U-turn 70P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Fairy Alluring Voice 80S, Normal Tera Blast 80S, Flying Air Slash 75S, Bug Signal Beam 75S, Psychic Psybeam 65S

**Lunatone** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Rock/Psychic | BST 460 (90/55/65/95/85/70) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 209/229, SpA 289/317, Spe 239/262
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Flying Acrobatics 110P, Ground Earthquake 100P, Steel Iron Head 80P
  Special coverage: Ice Blizzard 120S, Fairy Moonblast 95S, Ground Earth Power 90S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Grass Grass Knot 60S

**Lurantis** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass | BST 480 (70/105/90/80/90/45) | Abilities: Leaf Guard / Contrary
  Engine stats @252 (neutral/positive): Leaf Guard: Atk 309/339, SpA 259/284, Spe 189/207 — Contrary: Atk 309/339, SpA 259/284, Spe 189/207
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Fighting Superpower 120P, Normal Return 102P, Dragon Dual Chop 50x2P, Bug Leech Life 80P, Poison Poison Jab 80P, Dark Night Slash 70P
  Special coverage: Bug Pollen Puff 90S, Normal Tera Blast 80S

**Luvdisc** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Water | BST 330 (43/30/55/40/65/97) | Abilities: Swift Swim / Hydration
  Engine stats @252 (neutral/positive): Swift Swim: Atk 159/174, SpA 179/196, Spe 293/322 — Hydration: Atk 159/174, SpA 179/196, Spe 293/322
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Double-Edge 120P, Flying Bounce 85 (charge)P, Dragon Scale Shot 25x2-5P, Psychic Heart Stamp 60P
  Special coverage: Ice Blizzard 120S, Normal Tera Blast 80S, Fairy Draining Kiss 50S

**Luxio** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric | BST 363 (60/85/49/60/49/60) | Abilities: Rivalry / Intimidate / Guts
  Engine stats @252 (neutral/positive): Rivalry: Atk 269/295, SpA 219/240, Spe 219/240 — Intimidate: Atk 269/295, SpA 219/240, Spe 219/240 — Guts: Atk 269/295, SpA 219/240, Spe 219/240
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S, Dark Snarl 55S, Ground Mud-Slap 20S

**Luxray** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 523 (80/120/79/95/79/70) | Abilities: Rivalry / Intimidate / Guts
  Engine stats @252 (neutral/positive): Rivalry: Atk 339/372, SpA 289/317, Spe 239/262 — Intimidate: Atk 339/372, SpA 289/317, Spe 239/262 — Guts: Atk 339/372, SpA 289/317, Spe 239/262
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Steel Iron Tail 100P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S, Dark Snarl 55S, Ground Mud-Slap 20S

**Lycanroc** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Rock | BST 487 (75/115/65/55/65/112) | Abilities: Keen Eye / Sand Rush / Steadfast
  Engine stats @252 (neutral/positive): Keen Eye: Atk 329/361, SpA 209/229, Spe 323/355 — Sand Rush: Atk 329/361, SpA 209/229, Spe 323/355 — Steadfast: Atk 329/361, SpA 209/229, Spe 323/355
  Item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Normal Last Resort 140P, Fighting Close Combat 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P
  Special coverage: Ground Earth Power 90S, Normal Hyper Voice 90S, Dark Snarl 55S

**Lycanroc-Midnight** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Rock | BST 487 (85/115/75/55/75/82) | Abilities: Keen Eye / Vital Spirit / No Guard
  Engine stats @252 (neutral/positive): Keen Eye: Atk 329/361, SpA 209/229, Spe 263/289 — Vital Spirit: Atk 329/361, SpA 209/229, Spe 263/289 — No Guard: Atk 329/361, SpA 209/229, Spe 263/289
  Item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P
  Special coverage: Ground Earth Power 90S, Normal Hyper Voice 90S, Dark Snarl 55S

**Mabosstiff** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Dark | BST 505 (80/120/90/60/70/85) | Abilities: Intimidate / Guard Dog / Stakeout
  Engine stats @252 (neutral/positive): Intimidate: Atk 339/372, SpA 219/240, Spe 269/295 — Guard Dog: Atk 339/372, SpA 219/240, Spe 269/295 — Stakeout: Atk 339/372, SpA 219/240, Spe 269/295
  Item: **free**
  STAB: Dark Crunch 80P
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Electric Wild Charge 90P, Psychic Psychic Fangs 85P
  Special coverage: Normal Hyper Voice 90S

**Machop** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fighting | BST 305 (70/80/50/35/35/35) | Abilities: Guts / No Guard / Steadfast
  Engine stats @252 (neutral/positive): Guts: Atk 259/284, SpA 169/185, Spe 169/185 — No Guard: Atk 259/284, SpA 169/185, Spe 169/185 — Steadfast: Atk 259/284, SpA 169/185, Spe 169/185
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Skull Bash 130P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Poison Poison Jab 80P, Fire Fire Punch 75P, Ice Ice Punch 75P
  Special coverage: Fire Fire Blast 120S, Normal Hidden Power 60S, Ground Mud-Slap 20S

**Magby** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 365 (45/75/37/70/55/83) | Abilities: Flame Body / Vital Spirit
  Engine stats @252 (neutral/positive): Flame Body: Atk 249/273, SpA 239/262, Spe 265/291 — Vital Spirit: Atk 249/273, SpA 239/262, Spe 265/291
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Dual Chop 50x2P, Steel Iron Tail 100P, Poison Poison Jab 80P, Electric Thunder Punch 75P
  Special coverage: Poison Belch 120S, Psychic Psychic 90S, Normal Uproar 90S, Ground Mud-Slap 20S

**Magcargo** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fire/Rock | BST 430 (60/50/120/90/80/30) | Abilities: Magma Armor / Flame Body / Weak Armor
  Engine stats @252 (neutral/positive): Magma Armor: Atk 199/218, SpA 279/306, Spe 159/174 — Flame Body: Atk 199/218, SpA 279/306, Spe 159/174 — Weak Armor: Atk 199/218, SpA 279/306, Spe 159/174
  Item: **free**
  STAB: Fire Overheat 140S · Rock Power Gem 80S
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Fighting Rock Smash 40P, Steel Gyro Ball 39P
  Special coverage: Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Normal Tera Blast 80S, Poison Clear Smog 50S, Bug Infestation 20S

**Magikarp** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 200 (20/10/55/15/20/80) | Abilities: Swift Swim / Rattled
  Engine stats @252 (neutral/positive): Swift Swim: Atk 119/130, SpA 129/141, Spe 259/284 — Rattled: Atk 119/130, SpA 129/141, Spe 259/284
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Flying Bounce 85 (charge)P, Normal Tackle 50P
  Special coverage: **none**

**Magmar** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 495 (65/95/57/100/85/93) | Abilities: Flame Body / Vital Spirit
  Engine stats @252 (neutral/positive): Flame Body: Atk 289/317, SpA 299/328, Spe 285/313 — Vital Spirit: Atk 289/317, SpA 299/328, Spe 285/313
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Dual Chop 50x2P, Steel Iron Tail 100P, Poison Poison Jab 80P, Electric Thunder Punch 75P
  Special coverage: Poison Belch 120S, Fighting Focus Blast 120S, Psychic Psychic 90S, Normal Uproar 90S, Ground Scorching Sands 70S

**Magmortar** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fire | BST 540 (75/95/67/125/95/83) | Abilities: Flame Body / Vital Spirit
  Engine stats @252 (neutral/positive): Flame Body: Atk 289/317, SpA 349/383, Spe 265/291 — Vital Spirit: Atk 289/317, SpA 349/383, Spe 265/291
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Poison Poison Jab 80P
  Special coverage: Poison Belch 120S, Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Electric Thunderbolt 95S, Normal Hyper Voice 90S, Psychic Psychic 90S

**Magnemite** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric/Steel | BST 325 (25/35/70/95/55/45) | Abilities: Magnet Pull / Sturdy / Analytic
  Engine stats @252 (neutral/positive): Magnet Pull: Atk 169/185, SpA 289/317, Spe 189/207 — Sturdy: Atk 169/185, SpA 289/317, Spe 189/207 — Analytic: Atk 169/185, SpA 289/317, Spe 189/207
  **TRAPPING ABILITY: Magnet Pull** (optional — one of 3)
  Item: **free**
  STAB: Electric Thunder 120S · Steel Steel Beam 140S
  Physical coverage: Normal Explosion 250P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S

**Makuhita** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fighting | BST 237 (72/60/30/20/30/25) | Abilities: Thick Fat / Guts / Sheer Force
  Engine stats @252 (neutral/positive): Thick Fat: Atk 219/240, SpA 139/152, Spe 149/163 — Guts: Atk 219/240, SpA 139/152, Spe 149/163 — Sheer Force: Atk 219/240, SpA 139/152, Spe 149/163
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Poison Poison Jab 80P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Water Surf 95S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Malamar** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Dark/Psychic | BST 482 (86/92/88/68/75/73) | Abilities: Contrary / Suction Cups / Infiltrator
  Engine stats @252 (neutral/positive): Contrary: Atk 283/311, SpA 235/258, Spe 245/269 — Suction Cups: Atk 283/311, SpA 235/258, Spe 245/269 — Infiltrator: Atk 283/311, SpA 235/258, Spe 245/269
  Item: **free**
  STAB: Dark Foul Play 95P · Psychic Future Sight 120S
  Physical coverage: Fighting Superpower 120P, Normal Return 102P, Water Liquidation 85P, Bug Lunge 80P, Rock Rock Slide 75P, Flying Aerial Ace 60P
  Special coverage: Fire Flamethrower 95S, Electric Thunderbolt 95S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Manectric** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Electric | BST 475 (70/75/60/105/60/105) | Abilities: Static / Lightning Rod / Minus
  Engine stats @252 (neutral/positive): Static: Atk 249/273, SpA 309/339, Spe 309/339 — Lightning Rod: Atk 249/273, SpA 309/339, Spe 309/339 — Minus: Atk 249/273, SpA 309/339, Spe 309/339
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Fire Fire Fang 65P, Ice Ice Fang 65P
  Special coverage: Fire Overheat 140S, Normal Hyper Voice 90S, Bug Signal Beam 75S, Dark Snarl 55S, Ground Mud-Slap 20S

**Mankey** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fighting | BST 305 (40/80/35/35/45/70) | Abilities: Vital Spirit / Anger Point / Defiant
  Engine stats @252 (neutral/positive): Vital Spirit: Atk 259/284, SpA 169/185, Spe 239/262 — Anger Point: Atk 259/284, SpA 169/185, Spe 239/262 — Defiant: Atk 259/284, SpA 169/185, Spe 239/262
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Skull Bash 130P, Poison Gunk Shot 120P, Dragon Outrage 120P, Flying Acrobatics 110P, Ground Earthquake 100P, Steel Iron Tail 100P
  Special coverage: Fire Overheat 140S, Electric Thunder 120S, Normal Uproar 90S, Ground Mud-Slap 20S

**Mantyke** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Flying | BST 345 (45/20/50/60/120/50) | Abilities: Swift Swim / Water Absorb / Water Veil
  Engine stats @252 (neutral/positive): Swift Swim: Atk 139/152, SpA 219/240, Spe 199/218 — Water Absorb: Atk 139/152, SpA 219/240, Spe 199/218 — Water Veil: Atk 139/152, SpA 219/240, Spe 199/218
  Item: **free**
  STAB: Water Hydro Pump 120S · Flying Air Slash 75S
  Physical coverage: Normal Return 102P, Ground Earthquake 100P, Rock Rock Slide 75P
  Special coverage: Ice Blizzard 120S, Bug Signal Beam 75S, Normal Hidden Power 60S, Dragon Twister 40S, Ground Mud-Slap 20S, Psychic Mirror Coat fixedS

**Maractus** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Grass | BST 461 (75/86/67/106/67/60) | Abilities: Water Absorb / Chlorophyll / Storm Drain
  Engine stats @252 (neutral/positive): Water Absorb: Atk 271/298, SpA 311/342, Spe 219/240 — Chlorophyll: Atk 271/298, SpA 311/342, Spe 219/240 — Storm Drain: Atk 271/298, SpA 311/342, Spe 219/240
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Return 102P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P, Dark Sucker Punch 80P, Bug Pin Missile 25x2-5P, Fighting Drain Punch 75P
  Special coverage: Normal Hyper Voice 90S

**Mareanie** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison/Water | BST 305 (50/53/62/43/52/45) | Abilities: Merciless / Limber / Regenerator
  Engine stats @252 (neutral/positive): Merciless: Atk 205/225, SpA 185/203, Spe 189/207 — Limber: Atk 205/225, SpA 185/203, Spe 189/207 — Regenerator: Atk 205/225, SpA 185/203, Spe 189/207
  Item: **free**
  STAB: Poison Gunk Shot 120P · Water Hydro Pump 120S
  Physical coverage: Normal Return 102P, Ice Ice Spinner 80P, Bug Lunge 80P, Dark Knock Off 65P, Flying Peck 35P
  Special coverage: Ice Blizzard 120S, Normal Tera Blast 80S, Ground Mud Shot 55S, Bug Infestation 20S

**Mareep** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric | BST 280 (55/40/40/65/45/35) | Abilities: Static / Plus
  Engine stats @252 (neutral/positive): Static: Atk 179/196, SpA 229/251, Spe 169/185 — Plus: Atk 179/196, SpA 229/251, Spe 169/185
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Grass Trailblaze 50P
  Special coverage: Fairy Dazzling Gleam 80S, Rock Power Gem 80S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Marill** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Fairy | BST 250 (70/20/50/20/50/40) | Abilities: Thick Fat / Huge Power / Sap Sipper
  Engine stats @252 (neutral/positive): Thick Fat: Atk 139/152, SpA 139/152, Spe 179/196 — Huge Power: Atk 278/304, SpA 139/152, Spe 179/196 — Sap Sipper: Atk 139/152, SpA 139/152, Spe 179/196
  Item: **free**
  STAB: Water Aqua Tail 90P · Fairy Play Rough 90P
  Physical coverage: Fighting Focus Punch 150P, Steel Steel Roller 130P, Normal Double-Edge 120P, Ground Dig 100 (charge)P, Flying Bounce 85 (charge)P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Psychic Future Sight 120S, Normal Hyper Voice 90S, Grass Grass Knot 60S, Ground Mud Shot 55S

**Marowak** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Ground | BST 425 (60/80/110/50/80/45) | Abilities: Rock Head / Lightning Rod / Battle Armor
  Engine stats @252 (neutral/positive): Rock Head: Atk 259/284, SpA 199/218, Spe 189/207 — Lightning Rod: Atk 259/284, SpA 199/218, Spe 189/207 — Battle Armor: Atk 259/284, SpA 199/218, Spe 189/207
  Item: **free**
  STAB: Ground Bonemerang 50x2P
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Dark Throat Chop 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Normal Uproar 90S, Water Bubble Beam 65S, Rock Ancient Power 60S

**Marshtomp** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Ground | BST 405 (70/85/70/60/70/50) | Abilities: Torrent / Damp
  Engine stats @252 (neutral/positive): Torrent: Atk 269/295, SpA 219/240, Spe 199/218 — Damp: Atk 269/295, SpA 219/240, Spe 199/218
  Item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Ice Ice Punch 75P, Rock Rock Slide 75P, Dark Bite 60P
  Special coverage: Ice Blizzard 120S, Poison Sludge Wave 95S, Normal Uproar 90S, Rock Ancient Power 60S, Psychic Mirror Coat fixedS

**Maschiff** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark | BST 340 (60/78/60/40/51/51) | Abilities: Intimidate / Run Away / Stakeout
  Engine stats @252 (neutral/positive): Intimidate: Atk 255/280, SpA 179/196, Spe 201/221 — Run Away: Atk 255/280, SpA 179/196, Spe 201/221 — Stakeout: Atk 255/280, SpA 179/196, Spe 201/221
  Item: **free**
  STAB: Dark Crunch 80P
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P, Fire Fire Fang 65P, Ice Ice Fang 65P
  Special coverage: Normal Tera Blast 80S

**Masquerain** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Bug/Flying | BST 454 (70/60/62/100/82/80) | Abilities: Intimidate / Unnerve
  Engine stats @252 (neutral/positive): Intimidate: Atk 219/240, SpA 299/328, Spe 259/284 — Unnerve: Atk 219/240, SpA 299/328, Spe 259/284
  Item: **free**
  STAB: Bug Bug Buzz 90S · Flying Hurricane 120S
  Physical coverage: Normal Double-Edge 120P, Dark Foul Play 95P, Water Liquidation 85P
  Special coverage: Ice Blizzard 120S, Water Hydro Pump 120S, Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Psychic Psybeam 65S

**Mawile** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Steel/Fairy | BST 380 (50/85/85/55/55/50) | Abilities: Hyper Cutter / Intimidate / Sheer Force
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 269/295, SpA 209/229, Spe 199/218 — Intimidate: Atk 269/295, SpA 209/229, Spe 199/218 — Sheer Force: Atk 269/295, SpA 209/229, Spe 199/218
  Item: **free**
  STAB: Steel Steel Beam 140S · Fairy Play Rough 90P
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Rock Stone Edge 100P, Dark Foul Play 95P, Psychic Psychic Fangs 85P, Ice Ice Punch 75P
  Special coverage: Fire Fire Blast 120S, Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Poison Sludge Bomb 90S, Dark Dark Pulse 80S

**Meganium** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass | BST 525 (80/82/100/83/100/80) | Abilities: Overgrow / Leaf Guard
  Engine stats @252 (neutral/positive): Overgrow: Atk 263/289, SpA 265/291, Spe 259/284 — Leaf Guard: Atk 263/289, SpA 265/291, Spe 259/284
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fighting Body Press 80P, Psychic Zen Headbutt 80P
  Special coverage: Normal Wring Out 120S, Rock Ancient Power 60S, Ground Mud-Slap 20S

**Meltan** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Steel | BST 300 (46/65/65/55/35/34) | Abilities: Magnet Pull
  Engine stats @252 (neutral/positive): Magnet Pull: Atk 229/251, SpA 209/229, Spe 167/183
  **TRAPPING ABILITY: Magnet Pull** (forced — its only ability)
  Item: **free**
  STAB: Steel Steel Beam 140S
  Physical coverage: Normal Facade 70P
  Special coverage: Electric Thunderbolt 95S, Normal Round 60S

**Meowstic** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Psychic | BST 466 (74/48/76/83/81/104) | Abilities: Keen Eye / Infiltrator / Prankster
  Engine stats @252 (neutral/positive): Keen Eye: Atk 195/214, SpA 265/291, Spe 307/337 — Infiltrator: Atk 195/214, SpA 265/291, Spe 307/337 — Prankster: Atk 195/214, SpA 265/291, Spe 307/337
  Item: **free**
  STAB: Psychic Dream Eater 100S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Dark Sucker Punch 80P, Grass Trailblaze 50P
  Special coverage: Electric Thunderbolt 95S, Grass Energy Ball 90S, Fairy Alluring Voice 80S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S

**Meowth** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 290 (40/45/35/40/40/90) | Abilities: Pickup / Technician / Unnerve
  Engine stats @252 (neutral/positive): Pickup: Atk 189/207, SpA 179/196, Spe 279/306 — Technician: Atk 189/207, SpA 179/196, Spe 279/306 — Unnerve: Atk 189/207, SpA 179/196, Spe 279/306
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Fairy Play Rough 90P, Grass Seed Bomb 80P
  Special coverage: Grass Petal Dance 120S, Electric Thunder 120S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Rock Power Gem 80S, Ghost Shadow Ball 80S

**Meowth-Alola** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark | BST 290 (40/35/35/50/40/90) | Abilities: Pickup / Technician / Rattled
  Engine stats @252 (neutral/positive): Pickup: Atk 169/185, SpA 199/218, Spe 279/306 — Technician: Atk 169/185, SpA 199/218, Spe 279/306 — Rattled: Atk 169/185, SpA 199/218, Spe 279/306
  Item: **free**
  STAB: Dark Foul Play 95P
  Physical coverage: Normal Last Resort 140P, Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Grass Seed Bomb 80P
  Special coverage: Grass Petal Dance 120S, Electric Thunder 120S, Psychic Dream Eater 100S, Normal Hyper Voice 90S, Rock Power Gem 80S, Ghost Shadow Ball 80S

**Meowth-Galar** — species, **ZU**, source: imported (redgpt-zu-floor)
  Steel | BST 290 (50/65/55/40/40/40) | Abilities: Pickup / Tough Claws / Unnerve
  Engine stats @252 (neutral/positive): Pickup: Atk 229/251, SpA 179/196, Spe 179/196 — Tough Claws: Atk 229/251, SpA 179/196, Spe 179/196 — Unnerve: Atk 229/251, SpA 179/196, Spe 179/196
  Item: **free**
  STAB: Steel Steel Beam 140S
  Physical coverage: Normal Last Resort 140P, Poison Gunk Shot 120P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Fairy Play Rough 90P, Grass Seed Bomb 80P
  Special coverage: Grass Petal Dance 120S, Electric Thunder 120S, Psychic Dream Eater 100S, Normal Hyper Voice 90S, Dark Dark Pulse 80S, Rock Power Gem 80S

**Mesprit** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Psychic | BST 580 (80/105/105/105/105/80) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 309/339, SpA 309/339, Spe 259/284
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Double-Edge 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Fairy Play Rough 90P, Fighting Drain Punch 75P, Fire Fire Punch 75P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S

**Metang** — species, **ZU**, source: imported (redgpt-zu-floor)
  Steel/Psychic | BST 420 (60/75/100/55/80/50) | Abilities: Clear Body / Light Metal
  Engine stats @252 (neutral/positive): Clear Body: Atk 249/273, SpA 209/229, Spe 199/218 — Light Metal: Atk 249/273, SpA 209/229, Spe 199/218
  Item: **free**
  STAB: Steel Steel Beam 140S · Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Ground Earthquake 100P, Ice Ice Punch 75P, Rock Rock Slide 75P, Electric Thunder Punch 75P
  Special coverage: Rock Meteor Beam 120 (charge)S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Grass Grass Knot 60S

**Metapod** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 205 (50/20/55/25/25/30) | Abilities: Shed Skin
  Engine stats @252 (neutral/positive): Shed Skin: Atk 139/152, SpA 149/163, Spe 159/174
  Item: **free**
  STAB: Bug Bug Bite 60P
  Physical coverage: Normal Tackle 50P
  Special coverage: Electric Electroweb 55S, Normal Snore 50S

**Mightyena** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Dark | BST 420 (70/90/70/60/60/70) | Abilities: Intimidate / Quick Feet / Moxie
  Engine stats @252 (neutral/positive): Intimidate: Atk 279/306, SpA 219/240, Spe 239/262 — Quick Feet: Atk 279/306, SpA 219/240, Spe 239/262 — Moxie: Atk 279/306, SpA 219/240, Spe 239/262
  Item: **free**
  STAB: Dark Foul Play 95P
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P, Fire Fire Fang 65P
  Special coverage: Normal Hyper Voice 90S, Ghost Shadow Ball 80S, Fire Incinerate 60S, Ground Mud-Slap 20S

**Milcery** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fairy | BST 270 (45/40/40/50/61/34) | Abilities: Sweet Veil / Aroma Veil
  Engine stats @252 (neutral/positive): Sweet Veil: Atk 179/196, SpA 199/218, Spe 167/183 — Aroma Veil: Atk 179/196, SpA 199/218, Spe 167/183
  Item: **free**
  STAB: Fairy Dazzling Gleam 80S
  Physical coverage: Normal Last Resort 140P, Dark Fling 30P
  Special coverage: Normal Tera Blast 80S, Psychic Stored Power 20S

**Miltank** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Normal | BST 490 (95/80/105/40/70/100) | Abilities: Thick Fat / Scrappy / Sap Sipper
  Engine stats @252 (neutral/positive): Thick Fat: Atk 259/284, SpA 179/196, Spe 299/328 — Scrappy: Atk 259/284, SpA 179/196, Spe 299/328 — Sap Sipper: Atk 259/284, SpA 179/196, Spe 299/328
  Item: **free**
  STAB: Normal Double-Edge 120P
  Physical coverage: Fighting Focus Punch 150P, Steel Steel Roller 130P, Ground Earthquake 100P, Fairy Play Rough 90P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Water Surf 95S

**Mime Jr.** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic/Fairy | BST 310 (20/25/45/70/90/60) | Abilities: Soundproof / Filter / Technician
  Engine stats @252 (neutral/positive): Soundproof: Atk 149/163, SpA 239/262, Spe 219/240 — Filter: Atk 149/163, SpA 239/262, Spe 219/240 — Technician: Atk 149/163, SpA 239/262, Spe 219/240
  Item: **free**
  STAB: Psychic Future Sight 120S · Fairy Dazzling Gleam 80S
  Physical coverage: Fighting Focus Punch 150P, Normal Return 102P, Dark Sucker Punch 80P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Ice Icy Wind 55S

**Minccino** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 300 (55/50/40/40/40/75) | Abilities: Cute Charm / Technician / Skill Link
  Engine stats @252 (neutral/positive): Cute Charm: Atk 199/218, SpA 179/196, Spe 249/273 — Technician: Atk 199/218, SpA 179/196, Spe 249/273 — Skill Link: Atk 199/218, SpA 179/196, Spe 249/273
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Water Aqua Tail 90P, Fairy Play Rough 90P, Grass Seed Bomb 80P
  Special coverage: Electric Thunderbolt 95S, Fairy Alluring Voice 80S, Grass Grass Knot 60S, Water Chilling Water 50S, Ground Mud-Slap 20S

**Minior** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Rock/Flying | BST 500 (60/100/60/100/60/120) | Abilities: Shields Down
  Engine stats @252 (neutral/positive): Shields Down: Atk 299/328, SpA 299/328, Spe 339/372
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Flying Acrobatics 110P
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Bug U-turn 70P
  Special coverage: Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Psychic Psychic 90S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Electric Charge Beam 50S

**Minun** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 405 (60/40/50/75/85/95) | Abilities: Minus / Volt Absorb
  Engine stats @252 (neutral/positive): Minus: Atk 179/196, SpA 249/273, Spe 289/317 — Volt Absorb: Atk 179/196, SpA 249/273, Spe 289/317
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Last Resort 140P, Fighting Dynamic Punch 100P, Steel Iron Tail 100P, Fairy Play Rough 90P, Grass Trailblaze 50P, Dark Fling 30P
  Special coverage: Normal Trump Card 200S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Grass Grass Knot 60S, Ground Mud-Slap 20S

**Misdreavus** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ghost | BST 435 (60/60/60/85/85/85) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 219/240, SpA 269/295, Spe 269/295
  Item: **free**
  STAB: Ghost Poltergeist 110P
  Physical coverage: Normal Double-Edge 120P, Dark Foul Play 95P, Flying Aerial Ace 60P
  Special coverage: Psychic Future Sight 120S, Electric Thunder 120S, Fire Inferno 100S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Dark Dark Pulse 80S

**Monferno** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire/Fighting | BST 405 (64/78/52/78/52/81) | Abilities: Blaze / Iron Fist
  Engine stats @252 (neutral/positive): Blaze: Atk 255/280, SpA 255/280, Spe 261/287 — Iron Fist: Atk 255/280, SpA 255/280, Spe 261/287
  Item: **free**
  STAB: Fire Overheat 140S · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P
  Special coverage: Normal Uproar 90S, Grass Grass Knot 60S, Ground Mud-Slap 20S

**Morelull** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Fairy | BST 285 (40/35/55/65/75/15) | Abilities: Illuminate / Effect Spore / Rain Dish
  Engine stats @252 (neutral/positive): Illuminate: Atk 169/185, SpA 229/251, Spe 129/141 — Effect Spore: Atk 169/185, SpA 229/251, Spe 129/141 — Rain Dish: Atk 169/185, SpA 229/251, Spe 129/141
  Item: **free**
  STAB: Grass Solar Beam 120 (charge)S · Fairy Moonblast 95S
  Physical coverage: Normal Return 102P, Ghost Astonish 30P
  Special coverage: Psychic Dream Eater 100S, Bug Pollen Puff 90S, Poison Sludge Bomb 90S, Normal Hidden Power 60S

**Morgrem** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark/Fairy | BST 370 (65/60/45/75/55/70) | Abilities: Prankster / Frisk / Pickpocket
  Engine stats @252 (neutral/positive): Prankster: Atk 219/240, SpA 249/273, Spe 239/262 — Frisk: Atk 219/240, SpA 249/273, Spe 239/262 — Pickpocket: Atk 219/240, SpA 249/273, Spe 239/262
  Item: **free**
  STAB: Dark Foul Play 95P · Fairy Play Rough 90P
  Physical coverage: Normal Mega Kick 120P, Bug Leech Life 80P, Fighting Drain Punch 75P, Ghost Shadow Claw 70P, Grass Trailblaze 50P
  Special coverage: Normal Uproar 90S, Fire Burning Jealousy 70S, Water Chilling Water 50S

**Morpeko** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric/Dark | BST 436 (58/95/58/70/58/97) | Abilities: Hunger Switch
  Engine stats @252 (neutral/positive): Hunger Switch: Atk 289/317, SpA 239/262, Spe 293/322
  Item: **free**
  STAB: Electric Thunder 120S · Dark Foul Play 95P
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Psychic Psychic Fangs 85P, Grass Seed Bomb 80P, Fighting Brick Break 75P, Ground Stomping Tantrum 75P
  Special coverage: Normal Uproar 90S

**Morpeko-Hangry** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric/Dark | BST 436 (58/95/58/70/58/97) | Abilities: Hunger Switch
  Engine stats @252 (neutral/positive): Hunger Switch: Atk 289/317, SpA 239/262, Spe 293/322
  Item: **free**
  STAB: Electric Thunder 120S · Dark Aura Wheel 110P
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Psychic Psychic Fangs 85P, Grass Seed Bomb 80P, Fighting Brick Break 75P, Ground Stomping Tantrum 75P
  Special coverage: Normal Uproar 90S

**Mothim** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Bug/Flying | BST 424 (70/94/50/94/50/66) | Abilities: Swarm / Tinted Lens
  Engine stats @252 (neutral/positive): Swarm: Atk 287/315, SpA 287/315, Spe 231/254 — Tinted Lens: Atk 287/315, SpA 287/315, Spe 231/254
  Item: **free**
  STAB: Bug Bug Buzz 90S · Flying Acrobatics 110P
  Physical coverage: Normal Return 102P, Dark Thief 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ghost Shadow Ball 80S, Poison Venoshock 65S, Normal Hidden Power 60S, Electric Electroweb 55S

**Mr. Mime** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Psychic/Fairy | BST 460 (40/45/65/100/120/90) | Abilities: Soundproof / Filter / Technician
  Engine stats @252 (neutral/positive): Soundproof: Atk 189/207, SpA 299/328, Spe 279/306 — Filter: Atk 189/207, SpA 299/328, Spe 279/306 — Technician: Atk 189/207, SpA 299/328, Spe 279/306
  Item: **free**
  STAB: Psychic Future Sight 120S · Fairy Dazzling Gleam 80S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dark Foul Play 95P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S

**Mr. Mime-Galar** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ice/Psychic | BST 460 (50/65/65/90/90/100) | Abilities: Vital Spirit / Screen Cleaner / Ice Body
  Engine stats @252 (neutral/positive): Vital Spirit: Atk 229/251, SpA 279/306, Spe 299/328 — Screen Cleaner: Atk 229/251, SpA 279/306, Spe 299/328 — Ice Body: Atk 229/251, SpA 279/306, Spe 299/328
  Item: **free**
  STAB: Ice Blizzard 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dark Foul Play 95P, Fire Fire Punch 75P, Ground Stomping Tantrum 75P, Electric Thunder Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S

**Mr. Rime** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Ice/Psychic | BST 520 (80/85/75/110/100/70) | Abilities: Tangled Feet / Screen Cleaner / Ice Body
  Engine stats @252 (neutral/positive): Tangled Feet: Atk 269/295, SpA 319/350, Spe 239/262 — Screen Cleaner: Atk 269/295, SpA 319/350, Spe 239/262 — Ice Body: Atk 269/295, SpA 319/350, Spe 239/262
  Item: **free**
  STAB: Ice Blizzard 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dark Foul Play 95P, Fire Fire Punch 75P, Ground Stomping Tantrum 75P, Electric Thunder Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S

**Mudbray** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground | BST 385 (70/100/70/45/55/45) | Abilities: Own Tempo / Stamina / Inner Focus
  Engine stats @252 (neutral/positive): Own Tempo: Atk 299/328, SpA 189/207, Spe 189/207 — Stamina: Atk 299/328, SpA 189/207, Spe 189/207 — Inner Focus: Atk 299/328, SpA 189/207, Spe 189/207
  Item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Rock Stone Edge 100P, Steel Iron Head 80P, Dark Payback 50P
  Special coverage: Normal Tera Blast 80S

**Mudkip** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 310 (50/70/50/50/50/40) | Abilities: Torrent / Damp
  Engine stats @252 (neutral/positive): Torrent: Atk 239/262, SpA 199/218, Spe 179/196 — Damp: Atk 239/262, SpA 199/218, Spe 179/196
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Rock Rock Slide 75P, Ice Avalanche 60P
  Special coverage: Ice Blizzard 120S, Poison Sludge Wave 95S, Ground Earth Power 90S, Normal Uproar 90S, Rock Ancient Power 60S, Psychic Mirror Coat fixedS

**Muk** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Poison | BST 500 (105/105/75/65/100/50) | Abilities: Stench / Sticky Hold / Poison Touch
  Engine stats @252 (neutral/positive): Stench: Atk 309/339, SpA 229/251, Spe 199/218 — Sticky Hold: Atk 309/339, SpA 229/251, Spe 199/218 — Poison Touch: Atk 309/339, SpA 229/251, Spe 199/218
  Item: **free**
  STAB: Poison Gunk Shot 120P
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Ground Dig 100 (charge)P, Bug Lunge 80P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Fairy Moonblast 95S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S

**Munchlax** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 390 (135/85/40/40/85/5) | Abilities: Pickup / Thick Fat / Gluttony
  Engine stats @252 (neutral/positive): Pickup: Atk 269/295, SpA 179/196, Spe 109/119 — Thick Fat: Atk 269/295, SpA 179/196, Spe 109/119 — Gluttony: Atk 269/295, SpA 179/196, Spe 109/119
  Item: **free**
  STAB: Normal Self-Destruct 200P
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Ground Earthquake 100P, Dark Crunch 80P, Grass Seed Bomb 80P, Psychic Zen Headbutt 80P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Fire Fire Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S

**Munna** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 292 (76/25/45/67/55/24) | Abilities: Forewarn / Synchronize / Telepathy
  Engine stats @252 (neutral/positive): Forewarn: Atk 149/163, SpA 233/256, Spe 147/161 — Synchronize: Atk 149/163, SpA 233/256, Spe 147/161 — Telepathy: Atk 149/163, SpA 233/256, Spe 147/161
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Rock Rock Slide 75P, Steel Gyro Ball 44P
  Special coverage: Fairy Moonblast 95S, Grass Energy Ball 90S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Normal Hidden Power 60S, Electric Shock Wave 60S

**Murkrow** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark/Flying | BST 405 (60/85/42/85/42/91) | Abilities: Insomnia / Super Luck / Prankster
  Engine stats @252 (neutral/positive): Insomnia: Atk 269/295, SpA 269/295, Spe 281/309 — Super Luck: Atk 269/295, SpA 269/295, Spe 281/309 — Prankster: Atk 269/295, SpA 269/295, Spe 281/309
  Item: **free**
  STAB: Dark Foul Play 95P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Ghost Astonish 30P
  Special coverage: Psychic Dream Eater 100S, Fire Heat Wave 100S, Normal Uproar 90S, Ghost Shadow Ball 80S, Ice Icy Wind 55S, Dragon Twister 40S

**Musharna** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Psychic | BST 487 (116/55/85/107/95/29) | Abilities: Forewarn / Synchronize / Telepathy
  Engine stats @252 (neutral/positive): Forewarn: Atk 209/229, SpA 313/344, Spe 157/172 — Synchronize: Atk 209/229, SpA 313/344, Spe 157/172 — Telepathy: Atk 209/229, SpA 313/344, Spe 157/172
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Rock Rock Slide 75P, Steel Gyro Ball 39P
  Special coverage: Fairy Misty Explosion 100S, Grass Energy Ball 90S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Normal Hidden Power 60S, Electric Shock Wave 60S

**Nacli** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock | BST 280 (55/55/75/35/35/25) | Abilities: Purifying Salt / Sturdy / Clear Body
  Engine stats @252 (neutral/positive): Purifying Salt: Atk 209/229, SpA 169/185, Spe 149/163 — Sturdy: Atk 209/229, SpA 169/185, Spe 149/163 — Clear Body: Atk 209/229, SpA 169/185, Spe 149/163
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S
  Physical coverage: Ground Earthquake 100P, Normal Take Down 90P, Steel Iron Head 80P, Psychic Zen Headbutt 80P
  Special coverage: Ground Earth Power 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S

**Natu** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic/Flying | BST 320 (40/50/45/70/45/70) | Abilities: Synchronize / Early Bird / Magic Bounce
  Engine stats @252 (neutral/positive): Synchronize: Atk 199/218, SpA 239/262, Spe 239/262 — Early Bird: Atk 199/218, SpA 239/262, Spe 239/262 — Magic Bounce: Atk 199/218, SpA 239/262, Spe 239/262
  Item: **free**
  STAB: Psychic Future Sight 120S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Dark Sucker Punch 80P, Steel Steel Wing 70P, Bug U-turn 70P
  Special coverage: Grass Solar Beam 120 (charge)S, Fire Heat Wave 100S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Normal Hidden Power 60S

**Nickit** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark | BST 245 (40/28/28/47/52/50) | Abilities: Run Away / Unburden / Stakeout
  Engine stats @252 (neutral/positive): Run Away: Atk 155/170, SpA 193/212, Spe 199/218 — Unburden: Atk 155/170, SpA 193/212, Spe 199/218 — Stakeout: Atk 155/170, SpA 193/212, Spe 199/218
  Item: **free**
  STAB: Dark Foul Play 95P
  Physical coverage: Ground Dig 100 (charge)P, Fairy Play Rough 90P, Normal Tail Slap 25x2-5P
  Special coverage: Normal Round 60S, Ground Mud Shot 55S

**Nidoran-F** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison | BST 275 (55/47/52/40/40/41) | Abilities: Poison Point / Rivalry / Hustle
  Engine stats @252 (neutral/positive): Poison Point: Atk 193/212, SpA 179/196, Spe 181/199 — Rivalry: Atk 193/212, SpA 179/196, Spe 181/199 — Hustle: Atk 289/318, SpA 179/196, Spe 181/199
  Item: **free**
  STAB: Poison Poison Jab 80P
  Physical coverage: Normal Skull Bash 130P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Ghost Shadow Claw 70P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Ground Earth Power 90S, Normal Hidden Power 60S, Water Water Pulse 60S

**Nidoran-M** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison | BST 273 (46/57/40/40/40/50) | Abilities: Poison Point / Rivalry / Hustle
  Engine stats @252 (neutral/positive): Poison Point: Atk 213/234, SpA 179/196, Spe 199/218 — Rivalry: Atk 213/234, SpA 179/196, Spe 199/218 — Hustle: Atk 319/351, SpA 179/196, Spe 199/218
  Item: **free**
  STAB: Poison Poison Jab 80P
  Physical coverage: Rock Head Smash 150P, Normal Skull Bash 130P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Sucker Punch 80P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Ground Earth Power 90S, Normal Hidden Power 60S, Water Water Pulse 60S, Psychic Confusion 50S

**Nidorina** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison | BST 365 (70/62/67/55/55/56) | Abilities: Poison Point / Rivalry / Hustle
  Engine stats @252 (neutral/positive): Poison Point: Atk 223/245, SpA 209/229, Spe 211/232 — Rivalry: Atk 223/245, SpA 209/229, Spe 211/232 — Hustle: Atk 334/367, SpA 209/229, Spe 211/232
  Item: **free**
  STAB: Poison Poison Jab 80P
  Physical coverage: Normal Skull Bash 130P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Ghost Shadow Claw 70P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Ground Earth Power 90S, Water Bubble Beam 65S, Normal Hidden Power 60S

**Nidorino** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison | BST 365 (61/72/57/55/55/65) | Abilities: Poison Point / Rivalry / Hustle
  Engine stats @252 (neutral/positive): Poison Point: Atk 243/267, SpA 209/229, Spe 229/251 — Rivalry: Atk 243/267, SpA 209/229, Spe 229/251 — Hustle: Atk 364/400, SpA 209/229, Spe 229/251
  Item: **free**
  STAB: Poison Poison Jab 80P
  Physical coverage: Rock Head Smash 150P, Normal Skull Bash 130P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Sucker Punch 80P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Ground Earth Power 90S, Water Bubble Beam 65S, Normal Hidden Power 60S, Psychic Confusion 50S

**Nincada** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Ground | BST 266 (31/45/90/30/30/40) | Abilities: Compound Eyes / Run Away
  Engine stats @252 (neutral/positive): Compound Eyes: Atk 189/207, SpA 159/174, Spe 179/196 — Run Away: Atk 189/207, SpA 159/174, Spe 179/196
  Item: **free**
  STAB: Bug Bug Buzz 90S · Ground Dig 100 (charge)P
  Physical coverage: Normal Double-Edge 120P, Dark Night Slash 70P, Flying Aerial Ace 60P, Steel Metal Claw 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S, Normal Hidden Power 60S, Flying Gust 40S, Fighting Final Gambit fixedS

**Ninetales** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fire | BST 505 (73/76/75/81/100/100) | Abilities: Flash Fire / Drought
  Engine stats @252 (neutral/positive): Flash Fire: Atk 251/276, SpA 261/287, Spe 299/328 — Drought: Atk 251/276, SpA 261/287, Spe 299/328
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Skull Bash 130P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Psychic Zen Headbutt 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Scorching Sands 70S

**Noctowl** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal/Flying | BST 452 (100/50/50/86/96/70) | Abilities: Insomnia / Keen Eye / Tinted Lens
  Engine stats @252 (neutral/positive): Insomnia: Atk 199/218, SpA 271/298, Spe 239/262 — Keen Eye: Atk 199/218, SpA 271/298, Spe 239/262 — Tinted Lens: Atk 199/218, SpA 271/298, Spe 239/262
  Item: **free**
  STAB: Normal Hyper Voice 90S · Flying Hurricane 120S
  Physical coverage: Psychic Zen Headbutt 80P, Steel Steel Wing 70P, Dark Feint Attack 60P
  Special coverage: Psychic Future Sight 120S, Fire Heat Wave 100S, Fairy Moonblast 95S, Ghost Shadow Ball 80S, Bug Silver Wind 60S, Dragon Twister 40S

**Noibat** — species, **ZU**, source: imported (redgpt-zu-floor)
  Flying/Dragon | BST 245 (40/30/35/45/40/55) | Abilities: Frisk / Infiltrator / Telepathy
  Engine stats @252 (neutral/positive): Frisk: Atk 159/174, SpA 189/207, Spe 209/229 — Infiltrator: Atk 159/174, SpA 189/207, Spe 209/229 — Telepathy: Atk 159/174, SpA 189/207, Spe 209/229
  Item: **free**
  STAB: Flying Sky Attack 140 (charge)P · Dragon Draco Meteor 140S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Electric Wild Charge 90P, Bug Leech Life 80P, Fighting Brick Break 75P, Ghost Shadow Claw 70P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Fire Heat Wave 100S, Normal Hyper Voice 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S

**Nosepass** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock | BST 375 (30/45/135/45/90/30) | Abilities: Sturdy / Magnet Pull / Sand Force
  Engine stats @252 (neutral/positive): Sturdy: Atk 189/207, SpA 189/207, Spe 159/174 — Magnet Pull: Atk 189/207, SpA 189/207, Spe 159/174 — Sand Force: Atk 189/207, SpA 189/207, Spe 159/174
  **TRAPPING ABILITY: Magnet Pull** (optional — one of 3)
  Item: **free**
  STAB: Rock Head Smash 150P
  Physical coverage: Normal Explosion 250P, Fighting Dynamic Punch 100P, Ground Earthquake 100P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Steel Steel Beam 140S, Electric Thunder 120S, Ground Earth Power 90S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S

**Numel** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire/Ground | BST 305 (60/60/40/65/45/35) | Abilities: Oblivious / Simple / Own Tempo
  Engine stats @252 (neutral/positive): Oblivious: Atk 219/240, SpA 229/251, Spe 169/185 — Simple: Atk 219/240, SpA 229/251, Spe 169/185 — Own Tempo: Atk 219/240, SpA 229/251, Spe 169/185
  Item: **free**
  STAB: Fire Overheat 140S · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Rock Stone Edge 100P, Fighting Body Press 80P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Dark Lash Out 75P
  Special coverage: Steel Flash Cannon 80S, Normal Tera Blast 80S, Rock Ancient Power 60S

**Nuzleaf** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Dark | BST 340 (70/70/40/60/40/60) | Abilities: Chlorophyll / Early Bird / Pickpocket
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 239/262, SpA 219/240, Spe 219/240 — Early Bird: Atk 239/262, SpA 219/240, Spe 219/240 — Pickpocket: Atk 239/262, SpA 219/240, Spe 219/240
  Item: **free**
  STAB: Grass Leaf Storm 140S · Dark Foul Play 95P
  Physical coverage: Normal Explosion 250P, Ground Dig 100 (charge)P, Fighting Brick Break 75P, Rock Rock Slide 75P, Bug Fury Cutter 40P, Ghost Astonish 30P
  Special coverage: Normal Uproar 90S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S, Flying Air Cutter 60S, Water Chilling Water 50S, Ground Mud-Slap 20S

**Nymble** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 210 (33/46/40/21/25/45) | Abilities: Swarm / Tinted Lens
  Engine stats @252 (neutral/positive): Swarm: Atk 191/210, SpA 141/155, Spe 189/207 — Tinted Lens: Atk 191/210, SpA 141/155, Spe 189/207
  Item: **free**
  STAB: Bug First Impression 90P
  Physical coverage: Fighting Double Kick 50x2P, Normal Take Down 90P, Dark Sucker Punch 80P, Grass Trailblaze 50P, Ghost Astonish 30P
  Special coverage: Normal Tera Blast 80S

**Octillery** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Water | BST 480 (75/105/75/105/75/45) | Abilities: Suction Cups / Sniper / Moody
  Engine stats @252 (neutral/positive): Suction Cups: Atk 309/339, SpA 309/339, Spe 189/207 — Sniper: Atk 309/339, SpA 309/339, Spe 189/207 — Moody: Atk 309/339, SpA 309/339, Spe 189/207
  Item: **free**
  STAB: Water Water Spout 150S
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Flying Bounce 85 (charge)P, Grass Seed Bomb 80P, Rock Rock Blast 25x2-5P, Bug Skitter Smack 70P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Normal Wring Out 120S, Poison Sludge Wave 95S, Grass Energy Ball 90S, Psychic Psychic 90S

**Oddish** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Poison | BST 320 (45/50/55/75/65/30) | Abilities: Chlorophyll / Run Away
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 199/218, SpA 249/273, Spe 159/174 — Run Away: Atk 199/218, SpA 249/273, Spe 159/174
  Item: **free**
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Double-Edge 120P
  Special coverage: Fairy Moonblast 95S, Normal Tera Blast 80S, Bug Infestation 20S

**Oinkologne** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 489 (110/100/75/59/80/65) | Abilities: Lingering Aroma / Gluttony / Thick Fat
  Engine stats @252 (neutral/positive): Lingering Aroma: Atk 299/328, SpA 217/238, Spe 229/251 — Gluttony: Atk 299/328, SpA 217/238, Spe 229/251 — Thick Fat: Atk 299/328, SpA 217/238, Spe 229/251
  Item: **free**
  STAB: Normal Double-Edge 120P
  Physical coverage: Ground Dig 100 (charge)P, Fairy Play Rough 90P, Fighting Body Press 80P, Steel Iron Head 80P, Grass Seed Bomb 80P, Psychic Zen Headbutt 80P
  Special coverage: Poison Belch 120S, Ground Earth Power 90S, Grass Energy Ball 90S, Water Chilling Water 50S, Fairy Disarming Voice 40S

**Omanyte** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Water | BST 355 (35/40/100/90/55/35) | Abilities: Swift Swim / Shell Armor / Weak Armor
  Engine stats @252 (neutral/positive): Swift Swim: Atk 179/196, SpA 279/306, Spe 169/185 — Shell Armor: Atk 179/196, SpA 279/306, Spe 169/185 — Weak Armor: Atk 179/196, SpA 279/306, Spe 169/185
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Water Hydro Pump 120S
  Physical coverage: Normal Double-Edge 120P, Dark Knock Off 65P, Fighting Rock Smash 40P, Steel Gyro Ball 35P
  Special coverage: Ice Blizzard 120S, Normal Wring Out 120S, Ground Earth Power 90S

**Onix** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Ground | BST 385 (35/45/160/30/45/70) | Abilities: Rock Head / Sturdy / Weak Armor
  Engine stats @252 (neutral/positive): Rock Head: Atk 189/207, SpA 159/174, Spe 239/262 — Sturdy: Atk 189/207, SpA 159/174, Spe 239/262 — Weak Armor: Atk 189/207, SpA 159/174, Spe 239/262
  Item: **free**
  STAB: Rock Head Smash 150P · Ground Earthquake 100P
  Physical coverage: Normal Explosion 250P, Steel Heavy Slam 100P, Fighting Body Press 80P, Dragon Breaking Swipe 60P, Dark Brutal Swing 60P
  Special coverage: Dragon Dragon Pulse 90S, Steel Flash Cannon 80S, Normal Hidden Power 60S

**Oranguru** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal/Psychic | BST 490 (90/60/80/90/110/60) | Abilities: Inner Focus / Telepathy / Symbiosis
  Engine stats @252 (neutral/positive): Inner Focus: Atk 219/240, SpA 279/306, Spe 219/240 — Telepathy: Atk 219/240, SpA 279/306, Spe 219/240 — Symbiosis: Atk 219/240, SpA 279/306, Spe 219/240
  Item: **free**
  STAB: Normal Last Resort 140P · Psychic Future Sight 120S
  Physical coverage: Ground Earthquake 100P, Dark Foul Play 95P, Fighting Brick Break 75P, Rock Rock Slide 75P, Grass Trailblaze 50P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Energy Ball 90S, Ghost Shadow Ball 80S, Water Chilling Water 50S

**Orbeetle** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Bug/Psychic | BST 505 (60/45/110/80/120/90) | Abilities: Swarm / Frisk / Telepathy
  Engine stats @252 (neutral/positive): Swarm: Atk 189/207, SpA 259/284, Spe 279/306 — Frisk: Atk 189/207, SpA 259/284, Spe 279/306 — Telepathy: Atk 189/207, SpA 259/284, Spe 279/306
  Item: **free**
  STAB: Bug Bug Buzz 90S · Psychic Future Sight 120S
  Physical coverage: Fighting Body Press 80P, Normal Facade 70P, Dark Payback 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S, Normal Round 60S

**Orthworm** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Steel | BST 480 (70/85/145/60/55/65) | Abilities: Earth Eater / Sand Veil
  Engine stats @252 (neutral/positive): Earth Eater: Atk 269/295, SpA 219/240, Spe 229/251 — Sand Veil: Atk 269/295, SpA 219/240, Spe 229/251
  Item: **free**
  STAB: Steel Steel Beam 140S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Fighting Body Press 80P, Rock Rock Blast 25x2-5P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S

**Oshawott** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 308 (55/55/45/63/45/45) | Abilities: Torrent / Shell Armor
  Engine stats @252 (neutral/positive): Torrent: Atk 209/229, SpA 225/247, Spe 189/207 — Shell Armor: Atk 209/229, SpA 225/247, Spe 189/207
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fighting Sacred Sword 90P, Bug X-Scissor 80P, Dark Night Slash 70P
  Special coverage: Normal Trump Card 200S, Ice Blizzard 120S, Flying Air Slash 75S, Grass Grass Knot 60S

**Pachirisu** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 405 (60/45/70/45/90/95) | Abilities: Run Away / Pickup / Volt Absorb
  Engine stats @252 (neutral/positive): Run Away: Atk 189/207, SpA 189/207, Spe 289/317 — Pickup: Atk 189/207, SpA 189/207, Spe 289/317 — Volt Absorb: Atk 189/207, SpA 189/207, Spe 289/317
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Last Resort 140P, Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Grass Seed Bomb 80P
  Special coverage: Normal Uproar 90S, Fairy Alluring Voice 80S, Grass Grass Knot 60S, Ground Mud Shot 55S

**Palafin** — species, **ZU**, source: override
  Water | BST 457 (100/70/72/53/62/100) | Abilities: Zero to Hero
  Engine stats @252 (neutral/positive): Zero to Hero: Atk 239/262, SpA 205/225, Spe 299/328
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Dragon Outrage 120P, Flying Acrobatics 110P, Normal Double Hit 50x2P, Steel Hard Press 100P, Dark Throat Chop 80P
  Special coverage: Normal Boomburst 140S, Ice Blizzard 120S, Fighting Focus Blast 120S, Grass Grass Knot 60S, Fairy Draining Kiss 50S

**Palpitoad** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Ground | BST 384 (75/65/55/65/55/69) | Abilities: Swift Swim / Hydration / Water Absorb
  Engine stats @252 (neutral/positive): Swift Swim: Atk 229/251, SpA 229/251, Spe 237/260 — Hydration: Atk 229/251, SpA 229/251, Spe 237/260 — Water Absorb: Atk 229/251, SpA 229/251, Spe 237/260
  Item: **free**
  STAB: Water Hydro Pump 120S · Ground Earth Power 90S
  Physical coverage: Fighting Focus Punch 150P, Grass Power Whip 120P, Normal Return 102P, Flying Bounce 85 (charge)P
  Special coverage: Poison Sludge Wave 95S, Normal Hyper Voice 90S, Ice Icy Wind 55S, Bug Infestation 20S

**Pancham** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fighting | BST 348 (67/82/62/46/48/43) | Abilities: Iron Fist / Mold Breaker / Scrappy
  Engine stats @252 (neutral/positive): Iron Fist: Atk 263/289, SpA 191/210, Spe 185/203 — Mold Breaker: Atk 263/289, SpA 191/210, Spe 185/203 — Scrappy: Atk 263/289, SpA 191/210, Spe 185/203
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Poison Gunk Shot 120P, Normal Mega Kick 120P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P
  Special coverage: Water Surf 95S, Normal Hyper Voice 90S, Poison Sludge Bomb 90S, Dark Dark Pulse 80S, Grass Grass Knot 60S

**Panpour** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 316 (50/53/48/53/48/64) | Abilities: Gluttony / Torrent
  Engine stats @252 (neutral/positive): Gluttony: Atk 205/225, SpA 205/225, Spe 227/249 — Torrent: Atk 205/225, SpA 205/225, Spe 227/249
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Grass Grass Knot 60S, Fairy Disarming Voice 40S

**Pansage** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 316 (50/53/48/53/48/64) | Abilities: Gluttony / Overgrow
  Engine stats @252 (neutral/positive): Gluttony: Atk 205/225, SpA 205/225, Spe 227/249 — Overgrow: Atk 205/225, SpA 205/225, Spe 227/249
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P
  Special coverage: Normal Uproar 90S, Fairy Disarming Voice 40S

**Pansear** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 316 (50/53/48/53/48/64) | Abilities: Gluttony / Blaze
  Engine stats @252 (neutral/positive): Gluttony: Atk 205/225, SpA 205/225, Spe 227/249 — Blaze: Atk 205/225, SpA 205/225, Spe 227/249
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P
  Special coverage: Poison Belch 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Fairy Disarming Voice 40S

**Paras** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Grass | BST 285 (35/70/55/45/55/25) | Abilities: Effect Spore / Dry Skin / Damp
  Engine stats @252 (neutral/positive): Effect Spore: Atk 239/262, SpA 189/207, Spe 149/163 — Dry Skin: Atk 239/262, SpA 189/207, Spe 149/163 — Damp: Atk 239/262, SpA 189/207, Spe 149/163
  Item: **free**
  STAB: Bug Leech Life 80P · Grass Solar Beam 120 (charge)S
  Physical coverage: Normal Skull Bash 130P, Ground Dig 100 (charge)P, Fighting Brick Break 75P, Poison Cross Poison 70P, Dark Knock Off 65P, Flying Aerial Ace 60P
  Special coverage: Poison Sludge Bomb 90S, Psychic Psybeam 65S, Normal Hidden Power 60S

**Parasect** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Bug/Grass | BST 405 (60/95/80/60/80/30) | Abilities: Effect Spore / Dry Skin / Damp
  Engine stats @252 (neutral/positive): Effect Spore: Atk 289/317, SpA 219/240, Spe 159/174 — Dry Skin: Atk 289/317, SpA 219/240, Spe 159/174 — Damp: Atk 289/317, SpA 219/240, Spe 159/174
  Item: **free**
  STAB: Bug Leech Life 80P · Grass Solar Beam 120 (charge)S
  Physical coverage: Normal Skull Bash 130P, Ground Dig 100 (charge)P, Dark Throat Chop 80P, Fighting Brick Break 75P, Poison Cross Poison 70P, Flying Aerial Ace 60P
  Special coverage: Poison Sludge Bomb 90S, Psychic Psybeam 65S, Normal Hidden Power 60S

**Patrat** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 255 (45/55/39/35/39/42) | Abilities: Run Away / Keen Eye / Analytic
  Engine stats @252 (neutral/positive): Run Away: Atk 209/229, SpA 169/185, Spe 183/201 — Keen Eye: Atk 209/229, SpA 169/185, Spe 183/201 — Analytic: Atk 209/229, SpA 169/185, Spe 183/201
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Water Aqua Tail 90P, Dark Crunch 80P, Grass Seed Bomb 80P
  Special coverage: Electric Thunderbolt 95S, Ghost Shadow Ball 80S, Grass Grass Knot 60S

**Pawmi** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric | BST 240 (45/50/20/40/25/60) | Abilities: Static / Natural Cure / Iron Fist
  Engine stats @252 (neutral/positive): Static: Atk 199/218, SpA 179/196, Spe 219/240 — Natural Cure: Atk 199/218, SpA 179/196, Spe 219/240 — Iron Fist: Atk 199/218, SpA 179/196, Spe 219/240
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Ground Dig 100 (charge)P, Fairy Play Rough 90P, Normal Take Down 90P, Dark Crunch 80P, Steel Metal Claw 50P, Fighting Mach Punch 40P
  Special coverage: Normal Tera Blast 80S

**Pawmo** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric/Fighting | BST 350 (60/75/40/50/40/85) | Abilities: Volt Absorb / Natural Cure / Iron Fist
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 249/273, SpA 199/218, Spe 269/295 — Natural Cure: Atk 249/273, SpA 199/218, Spe 269/295 — Iron Fist: Atk 249/273, SpA 199/218, Spe 269/295
  Item: **free**
  STAB: Electric Thunder 120S · Fighting Focus Punch 150P
  Physical coverage: Ground Dig 100 (charge)P, Fairy Play Rough 90P, Normal Take Down 90P, Dark Crunch 80P, Steel Metal Claw 50P
  Special coverage: Normal Tera Blast 80S

**Pawniard** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark/Steel | BST 340 (45/85/70/40/40/60) | Abilities: Defiant / Inner Focus / Pressure
  Engine stats @252 (neutral/positive): Defiant: Atk 269/295, SpA 179/196, Spe 219/240 — Inner Focus: Atk 269/295, SpA 179/196, Spe 219/240 — Pressure: Atk 269/295, SpA 179/196, Spe 219/240
  Item: **free**
  STAB: Dark Foul Play 95P · Steel Iron Head 80P
  Physical coverage: Normal Return 102P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Grass Grass Knot 60S

**Perrserker** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Steel | BST 440 (70/110/100/50/60/50) | Abilities: Battle Armor / Tough Claws / Steely Spirit
  Engine stats @252 (neutral/positive): Battle Armor: Atk 319/350, SpA 199/218, Spe 199/218 — Tough Claws: Atk 319/350, SpA 199/218, Spe 199/218 — Steely Spirit: Atk 319/350, SpA 199/218, Spe 199/218
  Item: **free**
  STAB: Steel Iron Tail 100P
  Physical coverage: Normal Last Resort 140P, Fighting Close Combat 120P, Poison Gunk Shot 120P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Fairy Play Rough 90P
  Special coverage: Grass Petal Dance 120S, Electric Thunder 120S, Psychic Dream Eater 100S, Normal Hyper Voice 90S, Dark Dark Pulse 80S, Rock Power Gem 80S

**Persian** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 440 (65/70/60/65/65/115) | Abilities: Limber / Technician / Unnerve
  Engine stats @252 (neutral/positive): Limber: Atk 239/262, SpA 229/251, Spe 329/361 — Technician: Atk 239/262, SpA 229/251, Spe 329/361 — Unnerve: Atk 239/262, SpA 229/251, Spe 329/361
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Fairy Play Rough 90P, Grass Seed Bomb 80P
  Special coverage: Grass Petal Dance 120S, Electric Thunder 120S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Rock Power Gem 80S, Ghost Shadow Ball 80S

**Persian-Alola** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Dark | BST 440 (65/60/60/75/65/115) | Abilities: Fur Coat / Technician / Rattled
  Engine stats @252 (neutral/positive): Fur Coat: Atk 219/240, SpA 249/273, Spe 329/361 — Technician: Atk 219/240, SpA 249/273, Spe 329/361 — Rattled: Atk 219/240, SpA 249/273, Spe 329/361
  Item: **free**
  STAB: Dark Foul Play 95P
  Physical coverage: Normal Last Resort 140P, Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Grass Seed Bomb 80P
  Special coverage: Grass Petal Dance 120S, Electric Thunder 120S, Psychic Dream Eater 100S, Normal Hyper Voice 90S, Rock Power Gem 80S, Ghost Shadow Ball 80S

**Petilil** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 280 (45/35/50/70/50/30) | Abilities: Chlorophyll / Own Tempo / Leaf Guard
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 169/185, SpA 239/262, Spe 159/174 — Own Tempo: Atk 169/185, SpA 239/262, Spe 159/174 — Leaf Guard: Atk 169/185, SpA 239/262, Spe 159/174
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Return 102P
  Special coverage: Psychic Dream Eater 100S, Bug Pollen Puff 90S, Normal Tera Blast 80S

**Phanpy** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground | BST 330 (90/60/60/40/40/40) | Abilities: Pickup / Sand Veil
  Engine stats @252 (neutral/positive): Pickup: Atk 219/240, SpA 179/196, Spe 179/196 — Sand Veil: Atk 219/240, SpA 179/196, Spe 179/196
  Item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Rock Head Smash 150P, Normal Last Resort 140P, Poison Gunk Shot 120P, Fighting Superpower 120P, Steel Iron Tail 100P, Fairy Play Rough 90P
  Special coverage: Normal Hyper Voice 90S, Rock Ancient Power 60S, Water Water Gun 40S

**Phantump** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ghost/Grass | BST 309 (43/70/48/50/60/38) | Abilities: Natural Cure / Frisk / Harvest
  Engine stats @252 (neutral/positive): Natural Cure: Atk 239/262, SpA 199/218, Spe 175/192 — Frisk: Atk 239/262, SpA 199/218, Spe 175/192 — Harvest: Atk 239/262, SpA 199/218, Spe 175/192
  Item: **free**
  STAB: Ghost Poltergeist 110P · Grass Wood Hammer 120P
  Physical coverage: Normal Return 102P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Poison Poison Jab 80P, Rock Rock Slide 75P, Bug Skitter Smack 70P
  Special coverage: Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S

**Phione** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Water | BST 480 (80/80/80/80/80/80) | Abilities: Hydration
  Engine stats @252 (neutral/positive): Hydration: Atk 259/284, SpA 259/284, Spe 259/284
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Last Resort 140P, Flying Bounce 85 (charge)P, Psychic Zen Headbutt 80P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Rock Ancient Power 60S, Grass Grass Knot 60S

**Pichu** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric | BST 205 (20/40/15/35/35/60) | Abilities: Static / Lightning Rod
  Engine stats @252 (neutral/positive): Static: Atk 179/196, SpA 169/185, Spe 219/240 — Lightning Rod: Atk 179/196, SpA 169/185, Spe 219/240
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Fairy Play Rough 90P, Grass Trailblaze 50P, Dark Fling 30P, Rock Rollout 30P
  Special coverage: Water Surf 95S, Normal Uproar 90S, Bug Signal Beam 75S, Grass Grass Knot 60S, Fairy Disarming Voice 40S, Ground Mud-Slap 20S

**Pidgeot** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Normal/Flying | BST 479 (83/80/75/70/70/101) | Abilities: Keen Eye / Tangled Feet / Big Pecks
  Engine stats @252 (neutral/positive): Keen Eye: Atk 259/284, SpA 239/262, Spe 301/331 — Tangled Feet: Atk 259/284, SpA 239/262, Spe 301/331 — Big Pecks: Atk 259/284, SpA 239/262, Spe 301/331
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Steel Steel Wing 70P, Bug U-turn 70P, Dark Feint Attack 60P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Pidgeotto** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Flying | BST 349 (63/60/55/50/50/71) | Abilities: Keen Eye / Tangled Feet / Big Pecks
  Engine stats @252 (neutral/positive): Keen Eye: Atk 219/240, SpA 199/218, Spe 241/265 — Tangled Feet: Atk 219/240, SpA 199/218, Spe 241/265 — Big Pecks: Atk 219/240, SpA 199/218, Spe 241/265
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Steel Steel Wing 70P, Bug U-turn 70P, Dark Feint Attack 60P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Pidgey** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Flying | BST 251 (40/45/40/35/35/56) | Abilities: Keen Eye / Tangled Feet / Big Pecks
  Engine stats @252 (neutral/positive): Keen Eye: Atk 189/207, SpA 169/185, Spe 211/232 — Tangled Feet: Atk 189/207, SpA 169/185, Spe 211/232 — Big Pecks: Atk 189/207, SpA 169/185, Spe 211/232
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Steel Steel Wing 70P, Bug U-turn 70P, Dark Feint Attack 60P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Pidove** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Flying | BST 264 (50/55/50/36/30/43) | Abilities: Big Pecks / Super Luck / Rivalry
  Engine stats @252 (neutral/positive): Big Pecks: Atk 209/229, SpA 171/188, Spe 185/203 — Super Luck: Atk 209/229, SpA 171/188, Spe 185/203 — Rivalry: Atk 209/229, SpA 171/188, Spe 185/203
  Item: **free**
  STAB: Normal Return 102P · Flying Sky Attack 140 (charge)P
  Physical coverage: Dark Night Slash 70P, Steel Steel Wing 70P, Bug U-turn 70P
  Special coverage: Fire Heat Wave 100S

**Pignite** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire/Fighting | BST 418 (90/93/55/70/55/55) | Abilities: Blaze / Thick Fat
  Engine stats @252 (neutral/positive): Blaze: Atk 285/313, SpA 239/262, Spe 209/229 — Thick Fat: Atk 285/313, SpA 239/262, Spe 209/229
  Item: **free**
  STAB: Fire Overheat 140S · Fighting Focus Punch 150P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Poison Poison Jab 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Tera Blast 80S, Poison Smog 30S, Ground Mud-Slap 20S

**Pikachu** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 320 (35/55/40/50/50/90) | Abilities: Static / Lightning Rod
  Engine stats @252 (neutral/positive): Static: Atk 209/229, SpA 199/218, Spe 279/306 — Lightning Rod: Atk 209/229, SpA 199/218, Spe 279/306
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Flying Fly 90 (charge)P
  Special coverage: Water Surf 95S, Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Grass Grass Knot 60S, Ground Mud-Slap 20S

**Pikipek** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Flying | BST 265 (35/75/30/30/30/65) | Abilities: Keen Eye / Skill Link / Pickup
  Engine stats @252 (neutral/positive): Keen Eye: Atk 249/273, SpA 159/174, Spe 229/251 — Skill Link: Atk 249/273, SpA 159/174, Spe 229/251 — Pickup: Atk 249/273, SpA 159/174, Spe 229/251
  Item: **free**
  STAB: Normal Return 102P · Flying Sky Attack 140 (charge)P
  Physical coverage: Poison Gunk Shot 120P, Grass Bullet Seed 25x2-5P, Fighting Brick Break 75P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Fire Heat Wave 100S

**Pincurchin** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 435 (48/101/95/91/85/15) | Abilities: Lightning Rod / Electric Surge
  Engine stats @252 (neutral/positive): Lightning Rod: Atk 301/331, SpA 281/309, Spe 129/141 — Electric Surge: Atk 301/331, SpA 281/309, Spe 129/141
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Self-Destruct 200P, Water Liquidation 85P, Poison Poison Jab 80P, Dark Sucker Punch 80P, Bug Pin Missile 25x2-5P, Flying Peck 35P
  Special coverage: Water Hydro Pump 120S, Normal Tera Blast 80S, Ghost Hex 65S, Poison Venoshock 65S

**Pineco** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 290 (50/65/90/35/35/15) | Abilities: Sturdy / Overcoat
  Engine stats @252 (neutral/positive): Sturdy: Atk 229/251, SpA 169/185, Spe 129/141 — Overcoat: Atk 229/251, SpA 169/185, Spe 129/141
  Item: **free**
  STAB: Bug Lunge 80P
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Ice Ice Spinner 80P, Poison Poison Jab 80P, Grass Seed Bomb 80P, Rock Rock Blast 25x2-5P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Tera Blast 80S, Poison Venoshock 65S

**Pinsir** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Bug | BST 500 (65/125/100/55/70/85) | Abilities: Hyper Cutter / Mold Breaker / Moxie
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 349/383, SpA 209/229, Spe 269/295 — Mold Breaker: Atk 349/383, SpA 209/229, Spe 269/295 — Moxie: Atk 349/383, SpA 209/229, Spe 269/295
  Item: **free**
  STAB: Bug X-Scissor 80P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Throat Chop 80P
  Special coverage: Fighting Focus Blast 120S, Normal Hidden Power 60S

**Piplup** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 314 (53/51/53/61/56/40) | Abilities: Torrent / Competitive / Defiant
  Engine stats @252 (neutral/positive): Torrent: Atk 201/221, SpA 221/243, Spe 179/196 — Competitive: Atk 201/221, SpA 221/243, Spe 179/196 — Defiant: Atk 201/221, SpA 221/243, Spe 179/196
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Return 102P, Ground Dig 100 (charge)P, Flying Drill Peck 80P, Ice Ice Spinner 80P, Fighting Brick Break 75P, Rock Rock Tomb 60P
  Special coverage: Ice Blizzard 120S, Normal Tera Blast 80S, Bug Signal Beam 75S, Grass Grass Knot 60S, Fairy Disarming Voice 40S, Ground Mud-Slap 20S

**Plusle** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 405 (60/50/40/85/75/95) | Abilities: Plus / Lightning Rod
  Engine stats @252 (neutral/positive): Plus: Atk 199/218, SpA 269/295, Spe 289/317 — Lightning Rod: Atk 199/218, SpA 269/295, Spe 289/317
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Last Resort 140P, Fighting Dynamic Punch 100P, Steel Iron Tail 100P, Fairy Play Rough 90P, Grass Trailblaze 50P, Dark Fling 30P
  Special coverage: Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Grass Grass Knot 60S, Ground Mud-Slap 20S

**Poipole** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison | BST 420 (67/73/67/73/67/73) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 245/269, SpA 245/269, Spe 245/269
  Item: **free**
  STAB: Poison Gunk Shot 120P
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Bug Pin Missile 25x2-5P, Flying Peck 35P
  Special coverage: Dragon Dragon Pulse 90S, Normal Uproar 90S, Bug Signal Beam 75S

**Poliwag** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 300 (40/50/40/40/40/90) | Abilities: Water Absorb / Damp / Swift Swim
  Engine stats @252 (neutral/positive): Water Absorb: Atk 199/218, SpA 179/196, Spe 279/306 — Damp: Atk 199/218, SpA 179/196, Spe 279/306 — Swift Swim: Atk 199/218, SpA 179/196, Spe 279/306
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Dig 100 (charge)P, Dark Thief 60P, Ice Ice Ball 30P
  Special coverage: Ice Blizzard 120S, Ground Earth Power 90S, Psychic Psychic 90S, Normal Tera Blast 80S

**Poliwhirl** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 385 (65/65/65/50/50/90) | Abilities: Water Absorb / Damp / Swift Swim
  Engine stats @252 (neutral/positive): Water Absorb: Atk 229/251, SpA 199/218, Spe 279/306 — Damp: Atk 229/251, SpA 199/218, Spe 279/306 — Swift Swim: Atk 229/251, SpA 199/218, Spe 279/306
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Earthquake 100P, Ice Ice Punch 75P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Ground Earth Power 90S, Psychic Psychic 90S, Normal Tera Blast 80S

**Poliwrath** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Water/Fighting | BST 510 (90/95/95/70/90/70) | Abilities: Water Absorb / Damp / Swift Swim
  Engine stats @252 (neutral/positive): Water Absorb: Atk 289/317, SpA 239/262, Spe 239/262 — Damp: Atk 289/317, SpA 239/262, Spe 239/262 — Swift Swim: Atk 289/317, SpA 239/262, Spe 239/262
  Item: **free**
  STAB: Water Hydro Pump 120S · Fighting Focus Punch 150P
  Physical coverage: Normal Skull Bash 130P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Dark Darkest Lariat 85P, Poison Poison Jab 80P, Ice Ice Punch 75P
  Special coverage: Ice Blizzard 120S, Ground Earth Power 90S, Psychic Psychic 90S, Normal Tera Blast 80S

**Poltchageist** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Ghost | BST 308 (40/45/45/74/54/50) | Abilities: Hospitality / Heatproof
  Engine stats @252 (neutral/positive): Hospitality: Atk 189/207, SpA 247/271, Spe 199/218 — Heatproof: Atk 189/207, SpA 247/271, Spe 199/218
  Item: **free**
  STAB: Grass Leaf Storm 140S · Ghost Poltergeist 110P
  Physical coverage: Dark Foul Play 95P
  Special coverage: Normal Uproar 90S, Water Scald 80S

**Ponyta** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 410 (50/85/55/65/65/90) | Abilities: Run Away / Flash Fire / Flame Body
  Engine stats @252 (neutral/positive): Run Away: Atk 269/295, SpA 229/251, Spe 279/306 — Flash Fire: Atk 269/295, SpA 229/251, Spe 279/306 — Flame Body: Atk 269/295, SpA 229/251, Spe 279/306
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Skull Bash 130P, Grass Solar Blade 125 (charge)P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground High Horsepower 95P, Fairy Play Rough 90P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Hidden Power 60S

**Ponyta-Galar** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 410 (50/85/55/65/65/90) | Abilities: Run Away / Pastel Veil / Anticipation
  Engine stats @252 (neutral/positive): Run Away: Atk 269/295, SpA 229/251, Spe 279/306 — Pastel Veil: Atk 269/295, SpA 229/251, Spe 279/306 — Anticipation: Atk 269/295, SpA 229/251, Spe 279/306
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Skull Bash 130P, Grass Solar Blade 125 (charge)P, Fire Flare Blitz 120P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground High Horsepower 95P
  Special coverage: Fire Overheat 140S, Grass Solar Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Normal Hidden Power 60S

**Poochyena** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark | BST 220 (35/55/35/30/30/35) | Abilities: Run Away / Quick Feet / Rattled
  Engine stats @252 (neutral/positive): Run Away: Atk 209/229, SpA 159/174, Spe 169/185 — Quick Feet: Atk 209/229, SpA 159/174, Spe 169/185 — Rattled: Atk 209/229, SpA 159/174, Spe 169/185
  Item: **free**
  STAB: Dark Foul Play 95P
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P, Fire Fire Fang 65P
  Special coverage: Normal Hyper Voice 90S, Ghost Shadow Ball 80S, Fire Incinerate 60S, Ground Mud-Slap 20S

**Popplio** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 320 (50/54/54/66/56/40) | Abilities: Torrent / Liquid Voice
  Engine stats @252 (neutral/positive): Torrent: Atk 207/227, SpA 231/254, Spe 179/196 — Liquid Voice: Atk 207/227, SpA 231/254, Spe 179/196
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Steel Iron Tail 100P, Fairy Play Rough 90P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fairy Moonblast 95S, Normal Hyper Voice 90S

**Prinplup** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 405 (64/66/68/81/76/50) | Abilities: Torrent / Competitive / Defiant
  Engine stats @252 (neutral/positive): Torrent: Atk 231/254, SpA 261/287, Spe 199/218 — Competitive: Atk 231/254, SpA 261/287, Spe 199/218 — Defiant: Atk 231/254, SpA 261/287, Spe 199/218
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Flying Drill Peck 80P, Ice Ice Spinner 80P, Fighting Brick Break 75P, Ghost Shadow Claw 70P
  Special coverage: Ice Blizzard 120S, Normal Tera Blast 80S, Bug Signal Beam 75S, Grass Grass Knot 60S, Fairy Disarming Voice 40S, Ground Mud-Slap 20S

**Probopass** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Rock/Steel | BST 525 (60/55/145/75/150/40) | Abilities: Sturdy / Magnet Pull / Sand Force
  Engine stats @252 (neutral/positive): Sturdy: Atk 209/229, SpA 249/273, Spe 179/196 — Magnet Pull: Atk 209/229, SpA 249/273, Spe 179/196 — Sand Force: Atk 209/229, SpA 249/273, Spe 179/196
  **TRAPPING ABILITY: Magnet Pull** (optional — one of 3)
  Item: **free**
  STAB: Rock Head Smash 150P · Steel Steel Beam 140S
  Physical coverage: Normal Explosion 250P, Fighting Dynamic Punch 100P, Ground Earthquake 100P, Electric Supercell Slam 100P, Fire Fire Punch 75P, Ice Ice Punch 75P
  Special coverage: Electric Thunder 120S, Ground Earth Power 90S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S

**Psyduck** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 320 (50/52/48/65/50/55) | Abilities: Damp / Cloud Nine / Swift Swim
  Engine stats @252 (neutral/positive): Damp: Atk 203/223, SpA 229/251, Spe 209/229 — Cloud Nine: Atk 203/223, SpA 229/251, Spe 209/229 — Swift Swim: Atk 203/223, SpA 229/251, Spe 209/229
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P, Ice Ice Punch 75P
  Special coverage: Ice Blizzard 120S, Psychic Future Sight 120S, Normal Tera Blast 80S, Bug Signal Beam 75S, Ground Mud Bomb 65S, Poison Clear Smog 50S

**Pumpkaboo** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ghost/Grass | BST 335 (49/66/70/44/55/51) | Abilities: Pickup / Frisk / Insomnia
  Engine stats @252 (neutral/positive): Pickup: Atk 231/254, SpA 187/205, Spe 201/221 — Frisk: Atk 231/254, SpA 187/205, Spe 201/221 — Insomnia: Atk 231/254, SpA 187/205, Spe 201/221
  Item: **free**
  STAB: Ghost Poltergeist 110P · Grass Solar Beam 120 (charge)S
  Physical coverage: Normal Explosion 250P, Dark Foul Play 95P, Rock Rock Slide 75P, Bug Skitter Smack 70P, Fire Flame Charge 50P, Fighting Rock Smash 40P
  Special coverage: Fire Fire Blast 120S, Psychic Dream Eater 100S, Poison Sludge Bomb 90S, Dark Dark Pulse 80S, Normal Hidden Power 60S, Electric Charge Beam 50S

**Pupitar** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Ground | BST 410 (70/84/70/65/70/51) | Abilities: Shed Skin
  Engine stats @252 (neutral/positive): Shed Skin: Atk 267/293, SpA 229/251, Spe 201/221
  Item: **free**
  STAB: Rock Stone Edge 100P · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Fighting Superpower 120P, Steel Iron Tail 100P, Dark Crunch 80P, Flying Aerial Ace 60P
  Special coverage: Water Muddy Water 95S, Normal Uproar 90S, Dark Dark Pulse 80S

**Purrloin** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark | BST 281 (41/50/37/50/37/66) | Abilities: Limber / Unburden / Prankster
  Engine stats @252 (neutral/positive): Limber: Atk 199/218, SpA 199/218, Spe 231/254 — Unburden: Atk 199/218, SpA 199/218, Spe 231/254 — Prankster: Atk 199/218, SpA 199/218, Spe 231/254
  Item: **free**
  STAB: Dark Foul Play 95P
  Physical coverage: Poison Gunk Shot 120P, Normal Return 102P, Steel Iron Tail 100P, Fairy Play Rough 90P, Grass Seed Bomb 80P, Ghost Shadow Claw 70P
  Special coverage: Psychic Dream Eater 100S, Normal Hyper Voice 90S, Ghost Shadow Ball 80S, Grass Grass Knot 60S

**Purugly** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Normal | BST 452 (71/82/64/64/59/112) | Abilities: Thick Fat / Own Tempo / Defiant
  Engine stats @252 (neutral/positive): Thick Fat: Atk 263/289, SpA 227/249, Spe 323/355 — Own Tempo: Atk 263/289, SpA 227/249, Spe 323/355 — Defiant: Atk 263/289, SpA 227/249, Spe 323/355
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Fairy Play Rough 90P, Ghost Shadow Claw 70P, Bug U-turn 70P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Ghost Shadow Ball 80S, Water Water Pulse 60S, Ground Mud-Slap 20S

**Pyroar** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fire/Normal | BST 507 (86/68/72/109/66/106) | Abilities: Rivalry / Unnerve / Moxie
  Engine stats @252 (neutral/positive): Rivalry: Atk 235/258, SpA 317/348, Spe 311/342 — Unnerve: Atk 235/258, SpA 317/348, Spe 311/342 — Moxie: Atk 235/258, SpA 317/348, Spe 311/342
  Item: **free**
  STAB: Fire Overheat 140S · Normal Hyper Voice 90S
  Physical coverage: Flying Acrobatics 110P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Dark Dark Pulse 80S, Ground Mud-Slap 20S

**Pyukumuku** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Water | BST 410 (55/60/130/30/130/5) | Abilities: Innards Out / Unaware
  Engine stats @252 (neutral/positive): Innards Out: Atk 219/240, SpA 159/174, Spe 109/119 — Unaware: Atk 219/240, SpA 159/174, Spe 109/119
  Item: **free**
  STAB: **none**
  Physical coverage: Fighting Counter fixedP
  Special coverage: Psychic Mirror Coat fixedS

**Quaxly** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 310 (55/65/45/50/45/50) | Abilities: Torrent / Moxie
  Engine stats @252 (neutral/positive): Torrent: Atk 229/251, SpA 199/218, Spe 199/218 — Moxie: Atk 229/251, SpA 199/218, Spe 199/218
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Last Resort 140P, Flying Brave Bird 120P, Fighting Low Kick 60P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Fairy Disarming Voice 40S

**Quaxwell** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 410 (70/85/65/65/60/65) | Abilities: Torrent / Moxie
  Engine stats @252 (neutral/positive): Torrent: Atk 269/295, SpA 229/251, Spe 229/251 — Moxie: Atk 269/295, SpA 229/251, Spe 229/251
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Last Resort 140P, Flying Brave Bird 120P, Fighting Low Sweep 65P, Ice Triple Axel 20x3P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Fairy Disarming Voice 40S

**Quilava** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 405 (58/64/58/80/65/80) | Abilities: Blaze / Flash Fire
  Engine stats @252 (neutral/positive): Blaze: Atk 227/249, SpA 259/284, Spe 259/284 — Flash Fire: Atk 227/249, SpA 259/284, Spe 259/284
  Item: **free**
  STAB: Fire Eruption 150S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Electric Wild Charge 90P
  Special coverage: Psychic Extrasensory 80S, Normal Tera Blast 80S, Ground Mud-Slap 20S

**Quilladin** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 405 (61/78/95/56/58/57) | Abilities: Overgrow / Bulletproof
  Engine stats @252 (neutral/positive): Overgrow: Atk 255/280, SpA 211/232, Spe 213/234 — Bulletproof: Atk 255/280, SpA 211/232, Spe 213/234
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Return 102P, Dragon Dual Chop 50x2P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ground Dig 100 (charge)P
  Special coverage: Poison Sludge Bomb 90S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Rabsca** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Bug/Psychic | BST 470 (75/50/85/115/100/45) | Abilities: Synchronize / Telepathy
  Engine stats @252 (neutral/positive): Synchronize: Atk 199/218, SpA 329/361, Spe 189/207 — Telepathy: Atk 199/218, SpA 329/361, Spe 189/207
  Item: **free**
  STAB: Bug Bug Buzz 90S · Psychic Future Sight 120S
  Physical coverage: Poison Gunk Shot 120P, Ghost Poltergeist 110P, Ground Dig 100 (charge)P, Normal Take Down 90P, Rock Rock Tomb 60P, Dark Thief 60P
  Special coverage: Ground Earth Power 90S, Grass Energy Ball 90S, Poison Sludge Bomb 90S, Fairy Dazzling Gleam 80S, Rock Power Gem 80S, Ghost Shadow Ball 80S

**Raichu** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 485 (60/90/55/90/80/110) | Abilities: Static / Lightning Rod
  Engine stats @252 (neutral/positive): Static: Atk 279/306, SpA 279/306, Spe 319/350 — Lightning Rod: Atk 279/306, SpA 279/306, Spe 319/350
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Grass Grass Knot 60S

**Raichu-Alola** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric/Psychic | BST 485 (60/85/50/95/85/110) | Abilities: Surge Surfer
  Engine stats @252 (neutral/positive): Surge Surfer: Atk 269/295, SpA 289/317, Spe 319/350
  Item: **free**
  STAB: Electric Thunder 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Grass Grass Knot 60S

**Ralts** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic/Fairy | BST 198 (28/25/25/45/35/40) | Abilities: Synchronize / Trace / Telepathy
  Engine stats @252 (neutral/positive): Synchronize: Atk 149/163, SpA 189/207, Spe 179/196 — Trace: Atk 149/163, SpA 189/207, Spe 179/196 — Telepathy: Atk 149/163, SpA 189/207, Spe 179/196
  Item: **free**
  STAB: Psychic Future Sight 120S · Fairy Alluring Voice 80S
  Physical coverage: Normal Double-Edge 120P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Dark Knock Off 65P, Ghost Shadow Sneak 40P
  Special coverage: Electric Thunderbolt 95S, Normal Hyper Voice 90S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S, Bug Signal Beam 75S, Grass Grass Knot 60S

**Rapidash** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Fire | BST 500 (65/100/70/80/80/105) | Abilities: Run Away / Flash Fire / Flame Body
  Engine stats @252 (neutral/positive): Run Away: Atk 299/328, SpA 259/284, Spe 309/339 — Flash Fire: Atk 299/328, SpA 259/284, Spe 309/339 — Flame Body: Atk 299/328, SpA 259/284, Spe 309/339
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Skull Bash 130P, Grass Solar Blade 125 (charge)P, Bug Megahorn 120P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground High Horsepower 95P
  Special coverage: Grass Solar Beam 120 (charge)S, Ground Scorching Sands 70S, Normal Hidden Power 60S

**Rapidash-Galar** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Psychic/Fairy | BST 500 (65/100/70/80/80/105) | Abilities: Run Away / Pastel Veil / Anticipation
  Engine stats @252 (neutral/positive): Run Away: Atk 299/328, SpA 259/284, Spe 309/339 — Pastel Veil: Atk 299/328, SpA 259/284, Spe 309/339 — Anticipation: Atk 299/328, SpA 259/284, Spe 309/339
  Item: **free**
  STAB: Psychic Future Sight 120S · Fairy Play Rough 90P
  Physical coverage: Normal Skull Bash 130P, Grass Solar Blade 125 (charge)P, Fire Flare Blitz 120P, Bug Megahorn 120P, Fighting Double Kick 50x2P, Steel Iron Tail 100P
  Special coverage: Fire Overheat 140S, Grass Solar Beam 120 (charge)S, Ground Scorching Sands 70S, Normal Hidden Power 60S

**Raticate** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Normal | BST 413 (55/81/60/50/70/97) | Abilities: Run Away / Guts / Hustle
  Engine stats @252 (neutral/positive): Run Away: Atk 261/287, SpA 199/218, Spe 293/322 — Guts: Atk 261/287, SpA 199/218, Spe 293/322 — Hustle: Atk 391/430, SpA 199/218, Spe 293/322
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Steel Iron Tail 100P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Dark Crunch 80P, Psychic Zen Headbutt 80P, Bug U-turn 70P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Water Bubble Beam 65S, Grass Grass Knot 60S, Ground Mud-Slap 20S

**Rattata** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 253 (30/56/35/25/35/72) | Abilities: Run Away / Guts / Hustle
  Engine stats @252 (neutral/positive): Run Away: Atk 211/232, SpA 149/163, Spe 243/267 — Guts: Atk 211/232, SpA 149/163, Spe 243/267 — Hustle: Atk 316/348, SpA 149/163, Spe 243/267
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Steel Iron Tail 100P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Dark Crunch 80P, Psychic Zen Headbutt 80P, Bug U-turn 70P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Water Bubble Beam 65S, Grass Grass Knot 60S, Ground Mud-Slap 20S

**Rattata-Alola** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark/Normal | BST 253 (30/56/35/25/35/72) | Abilities: Gluttony / Hustle / Thick Fat
  Engine stats @252 (neutral/positive): Gluttony: Atk 211/232, SpA 149/163, Spe 243/267 — Hustle: Atk 316/348, SpA 149/163, Spe 243/267 — Thick Fat: Atk 211/232, SpA 149/163, Spe 243/267
  Item: **free**
  STAB: Dark Crunch 80P · Normal Last Resort 140P
  Physical coverage: Steel Iron Tail 100P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Psychic Zen Headbutt 80P, Ghost Shadow Claw 70P, Bug U-turn 70P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S, Water Bubble Beam 65S, Grass Grass Knot 60S

**Regice** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ice | BST 580 (80/50/100/100/200/50) | Abilities: Clear Body / Ice Body
  Engine stats @252 (neutral/positive): Clear Body: Atk 199/218, SpA 299/328, Spe 199/218 — Ice Body: Atk 199/218, SpA 299/328, Spe 199/218
  Item: **free**
  STAB: Ice Blizzard 120S
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Ground Earthquake 100P, Steel Heavy Slam 80P, Rock Rock Slide 75P, Electric Thunder Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Rock Ancient Power 60S

**Regigigas** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 670 (110/160/110/80/110/100) | Abilities: Slow Start
  Engine stats @252 (neutral/positive): Slow Start: Atk 209/230, SpA 259/284, Spe 149/164
  Item: **free**
  STAB: Normal Crush Grip 120P
  Physical coverage: Fighting Focus Punch 150P, Fire Heat Crash 120P, Steel Heavy Slam 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Ground Earth Power 90S, Rock Ancient Power 60S, Ice Icy Wind 55S

**Regirock** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Rock | BST 580 (80/100/200/50/100/50) | Abilities: Clear Body / Sturdy
  Engine stats @252 (neutral/positive): Clear Body: Atk 299/328, SpA 199/218, Spe 199/218 — Sturdy: Atk 299/328, SpA 199/218, Spe 199/218
  Item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Ground Earthquake 100P, Steel Hard Press 100P, Fire Fire Punch 75P, Ice Ice Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Ground Earth Power 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S

**Relicanth** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Water/Rock | BST 485 (100/90/130/45/65/55) | Abilities: Swift Swim / Rock Head / Sturdy
  Engine stats @252 (neutral/positive): Swift Swim: Atk 279/306, SpA 189/207, Spe 209/229 — Rock Head: Atk 279/306, SpA 189/207, Spe 209/229 — Sturdy: Atk 279/306, SpA 189/207, Spe 209/229
  Item: **free**
  STAB: Water Aqua Tail 90P · Rock Head Smash 150P
  Physical coverage: Normal Skull Bash 130P, Ground Earthquake 100P, Flying Bounce 85 (charge)P, Fighting Body Press 80P, Psychic Zen Headbutt 80P, Dragon Scale Shot 25x2-5P
  Special coverage: Ice Blizzard 120S, Ground Earth Power 90S, Normal Hidden Power 60S

**Rellor** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 270 (41/50/60/31/58/30) | Abilities: Compound Eyes / Shed Skin
  Engine stats @252 (neutral/positive): Compound Eyes: Atk 199/218, SpA 161/177, Spe 159/174 — Shed Skin: Atk 199/218, SpA 161/177, Spe 159/174
  Item: **free**
  STAB: Bug Bug Buzz 90S
  Physical coverage: Poison Gunk Shot 120P, Ground Dig 100 (charge)P, Normal Take Down 90P, Rock Rock Tomb 60P, Dark Thief 60P
  Special coverage: Poison Sludge Bomb 90S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Remoraid** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 300 (35/65/35/65/35/65) | Abilities: Hustle / Sniper / Moody
  Engine stats @252 (neutral/positive): Hustle: Atk 343/376, SpA 229/251, Spe 229/251 — Sniper: Atk 229/251, SpA 229/251, Spe 229/251 — Moody: Atk 229/251, SpA 229/251, Spe 229/251
  Item: **free**
  STAB: Water Waterfall 80P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Flying Bounce 85 (charge)P, Grass Seed Bomb 80P, Rock Rock Blast 25x2-5P, Dark Assurance 60P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Psychic 90S, Bug Signal Beam 75S, Normal Hidden Power 60S, Ground Mud Shot 55S

**Rhyhorn** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground/Rock | BST 345 (80/85/95/30/30/25) | Abilities: Lightning Rod / Rock Head / Reckless
  Engine stats @252 (neutral/positive): Lightning Rod: Atk 269/295, SpA 159/174, Spe 149/163 — Rock Head: Atk 269/295, SpA 159/174, Spe 149/163 — Reckless: Atk 269/295, SpA 159/174, Spe 149/163
  Item: **free**
  STAB: Ground Earthquake 100P · Rock Stone Edge 100P
  Physical coverage: Normal Skull Bash 130P, Bug Megahorn 120P, Fighting Superpower 120P, Dragon Dragon Rush 100P, Steel Iron Tail 100P, Electric Supercell Slam 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S, Normal Uproar 90S

**Riolu** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fighting | BST 285 (40/70/40/35/40/60) | Abilities: Steadfast / Inner Focus / Prankster
  Engine stats @252 (neutral/positive): Steadfast: Atk 239/262, SpA 169/185, Spe 219/240 — Inner Focus: Atk 239/262, SpA 169/185, Spe 219/240 — Prankster: Atk 239/262, SpA 169/185, Spe 219/240
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Mega Kick 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Fire Blaze Kick 85P, Dark Crunch 80P
  Special coverage: Normal Tera Blast 80S, Ground Mud-Slap 20S

**Rockruff** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock | BST 280 (45/65/40/30/40/60) | Abilities: Keen Eye / Vital Spirit / Steadfast / Own Tempo
  Engine stats @252 (neutral/positive): Keen Eye: Atk 229/251, SpA 159/174, Spe 219/240 — Vital Spirit: Atk 229/251, SpA 159/174, Spe 219/240 — Steadfast: Atk 229/251, SpA 159/174, Spe 219/240 — Own Tempo: Atk 229/251, SpA 159/174, Spe 219/240
  Item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Normal Last Resort 140P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Ground Earth Power 90S, Normal Hyper Voice 90S, Dark Snarl 55S

**Roggenrola** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock | BST 280 (55/75/85/25/25/15) | Abilities: Sturdy / Weak Armor / Sand Force
  Engine stats @252 (neutral/positive): Sturdy: Atk 249/273, SpA 149/163, Spe 129/141 — Weak Armor: Atk 249/273, SpA 149/163, Spe 129/141 — Sand Force: Atk 249/273, SpA 149/163, Spe 129/141
  Item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Fighting Body Press 80P, Steel Heavy Slam 40P
  Special coverage: Ground Earth Power 90S, Steel Flash Cannon 80S, Normal Hidden Power 60S

**Rolycoly** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock | BST 240 (30/40/50/40/50/30) | Abilities: Steam Engine / Heatproof / Flash Fire
  Engine stats @252 (neutral/positive): Steam Engine: Atk 179/196, SpA 179/196, Spe 159/174 — Heatproof: Atk 179/196, SpA 179/196, Spe 159/174 — Flash Fire: Atk 179/196, SpA 179/196, Spe 159/174
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S
  Physical coverage: Normal Explosion 250P, Ground Dig 100 (charge)P, Steel Iron Head 80P, Fire Temper Flare 75P
  Special coverage: Normal Tera Blast 80S, Fire Incinerate 60S, Ground Mud-Slap 20S

**Rookidee** — species, **ZU**, source: imported (redgpt-zu-floor)
  Flying | BST 245 (38/47/35/33/35/57) | Abilities: Keen Eye / Unnerve / Big Pecks
  Engine stats @252 (neutral/positive): Keen Eye: Atk 193/212, SpA 165/181, Spe 213/234 — Unnerve: Atk 193/212, SpA 165/181, Spe 213/234 — Big Pecks: Atk 193/212, SpA 165/181, Spe 213/234
  Item: **free**
  STAB: Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Take Down 90P, Bug U-turn 70P, Dark Assurance 60P, Fighting Revenge 60P
  Special coverage: Normal Tera Blast 80S

**Rotom** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric/Ghost | BST 440 (50/50/77/95/77/91) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 199/218, SpA 289/317, Spe 281/309
  Item: **free**
  STAB: Electric Thunder 120S · Ghost Shadow Ball 80S
  Physical coverage: Normal Return 102P, Dark Foul Play 95P
  Special coverage: Psychic Dream Eater 100S, Normal Hyper Voice 90S, Dark Dark Pulse 80S, Bug Signal Beam 75S, Fairy Disarming Voice 40S, Ground Mud-Slap 20S

**Rotom-Fan** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric/Flying | BST 520 (50/65/107/105/107/86) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 229/251, SpA 309/339, Spe 271/298
  Item: **free**
  STAB: Electric Thunder 120S · Flying Air Slash 75S
  Physical coverage: Ghost Poltergeist 110P, Normal Return 102P, Dark Foul Play 95P
  Special coverage: Psychic Dream Eater 100S, Normal Hyper Voice 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Fairy Disarming Voice 40S

**Rotom-Frost** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric/Ice | BST 520 (50/65/107/105/107/86) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 229/251, SpA 309/339, Spe 271/298
  Item: **free**
  STAB: Electric Thunder 120S · Ice Blizzard 120S
  Physical coverage: Ghost Poltergeist 110P, Normal Return 102P, Dark Foul Play 95P
  Special coverage: Psychic Dream Eater 100S, Normal Hyper Voice 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Fairy Disarming Voice 40S

**Rowlet** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Flying | BST 320 (68/55/55/50/50/42) | Abilities: Overgrow / Long Reach
  Engine stats @252 (neutral/positive): Overgrow: Atk 209/229, SpA 199/218, Spe 183/201 — Long Reach: Atk 209/229, SpA 199/218, Spe 183/201
  Item: **free**
  STAB: Grass Leaf Storm 140S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Return 102P, Dark Sucker Punch 80P, Ghost Shadow Claw 70P, Steel Steel Wing 70P
  Special coverage: Normal Tera Blast 80S, Ghost Ominous Wind 60S

**Rufflet** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Flying | BST 350 (70/83/50/37/50/60) | Abilities: Keen Eye / Sheer Force / Hustle
  Engine stats @252 (neutral/positive): Keen Eye: Atk 265/291, SpA 173/190, Spe 219/240 — Sheer Force: Atk 265/291, SpA 173/190, Spe 219/240 — Hustle: Atk 397/436, SpA 173/190, Spe 219/240
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Brave Bird 120P
  Physical coverage: Fighting Close Combat 120P, Psychic Zen Headbutt 80P, Rock Rock Slide 75P, Ghost Shadow Claw 70P, Steel Steel Wing 70P, Bug U-turn 70P
  Special coverage: Fire Heat Wave 100S

**Runerigus** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Ground/Ghost | BST 483 (58/95/145/50/105/30) | Abilities: Wandering Spirit
  Engine stats @252 (neutral/positive): Wandering Spirit: Atk 289/317, SpA 199/218, Spe 159/174
  Item: **free**
  STAB: Ground Earthquake 100P · Ghost Poltergeist 110P
  Physical coverage: Normal Return 102P, Rock Stone Edge 100P, Fighting Body Press 80P, Psychic Zen Headbutt 80P, Dark Knock Off 65P
  Special coverage: Psychic Dream Eater 100S, Dragon Dragon Pulse 90S, Grass Energy Ball 90S, Dark Dark Pulse 80S, Normal Hidden Power 60S, Electric Shock Wave 60S

**Sableye** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Dark/Ghost | BST 380 (50/75/75/65/65/50) | Abilities: Keen Eye / Stall / Prankster
  Engine stats @252 (neutral/positive): Keen Eye: Atk 249/273, SpA 229/251, Spe 199/218 — Stall: Atk 249/273, SpA 229/251, Spe 199/218 — Prankster: Atk 249/273, SpA 229/251, Spe 199/218
  Item: **free**
  STAB: Dark Foul Play 95P · Ghost Poltergeist 110P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P, Psychic Zen Headbutt 80P
  Special coverage: Psychic Dream Eater 100S, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Rock Power Gem 80S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Salandit** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison/Fire | BST 320 (48/44/40/71/40/77) | Abilities: Corrosion / Oblivious
  Engine stats @252 (neutral/positive): Corrosion: Atk 187/205, SpA 241/265, Spe 253/278 — Oblivious: Atk 187/205, SpA 241/265, Spe 253/278
  Item: **free**
  STAB: Poison Belch 120S · Fire Overheat 140S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Dark Foul Play 95P, Dragon Dragon Claw 80P, Bug Leech Life 80P, Ghost Shadow Claw 70P
  Special coverage: Dragon Dragon Pulse 90S, Normal Tera Blast 80S, Ground Mud-Slap 20S

**Samurott** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Water | BST 528 (95/100/85/108/70/70) | Abilities: Torrent / Shell Armor
  Engine stats @252 (neutral/positive): Torrent: Atk 299/328, SpA 315/346, Spe 239/262 — Shell Armor: Atk 299/328, SpA 315/346, Spe 239/262
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Bug Megahorn 120P, Fighting Superpower 120P, Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Night Slash 70P
  Special coverage: Normal Trump Card 200S, Ice Blizzard 120S, Flying Air Slash 75S, Grass Grass Knot 60S, Fighting Vacuum Wave 40S

**Sandaconda** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ground | BST 510 (72/107/125/65/70/71) | Abilities: Sand Spit / Shed Skin / Sand Veil
  Engine stats @252 (neutral/positive): Sand Spit: Atk 313/344, SpA 229/251, Spe 241/265 — Shed Skin: Atk 313/344, SpA 229/251, Spe 241/265 — Sand Veil: Atk 313/344, SpA 229/251, Spe 241/265
  Item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Normal Last Resort 140P, Dragon Outrage 120P, Rock Stone Edge 100P, Fighting Body Press 80P, Steel Iron Head 80P, Psychic Zen Headbutt 80P
  Special coverage: Poison Belch 120S, Flying Hurricane 120S, Normal Tera Blast 80S

**Sandile** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground/Dark | BST 292 (50/72/35/35/35/65) | Abilities: Intimidate / Moxie / Anger Point
  Engine stats @252 (neutral/positive): Intimidate: Atk 243/267, SpA 169/185, Spe 229/251 — Moxie: Atk 243/267, SpA 169/185, Spe 229/251 — Anger Point: Atk 243/267, SpA 169/185, Spe 229/251
  Item: **free**
  STAB: Ground Earthquake 100P · Dark Foul Play 95P
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P, Fighting Brick Break 75P, Ghost Shadow Claw 70P
  Special coverage: Poison Sludge Bomb 90S, Normal Uproar 90S, Grass Grass Knot 60S, Fire Incinerate 60S

**Sandshrew** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground | BST 300 (50/75/85/20/30/40) | Abilities: Sand Veil / Sand Rush
  Engine stats @252 (neutral/positive): Sand Veil: Atk 249/273, SpA 139/152, Spe 179/196 — Sand Rush: Atk 249/273, SpA 139/152, Spe 179/196
  Item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Steel Steel Roller 130P, Rock Stone Edge 100P, Bug Leech Life 80P, Poison Poison Jab 80P
  Special coverage: Normal Tera Blast 80S

**Sandshrew-Alola** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ice/Steel | BST 300 (50/75/90/10/35/40) | Abilities: Snow Cloak / Slush Rush
  Engine stats @252 (neutral/positive): Snow Cloak: Atk 249/273, SpA 119/130, Spe 179/196 — Slush Rush: Atk 249/273, SpA 119/130, Spe 179/196
  Item: **free**
  STAB: Ice Icicle Crash 85P · Steel Steel Roller 130P
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Ground Earthquake 100P, Rock Stone Edge 100P, Water Aqua Tail 90P, Bug Leech Life 80P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S, Psychic Mirror Coat fixedS

**Sandslash** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ground | BST 450 (75/100/110/45/55/65) | Abilities: Sand Veil / Sand Rush
  Engine stats @252 (neutral/positive): Sand Veil: Atk 299/328, SpA 189/207, Spe 229/251 — Sand Rush: Atk 299/328, SpA 189/207, Spe 229/251
  Item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Steel Steel Roller 130P, Poison Gunk Shot 120P, Rock Stone Edge 100P, Bug Leech Life 80P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S

**Sandygast** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ghost/Ground | BST 320 (55/55/80/70/45/15) | Abilities: Water Compaction / Sand Veil
  Engine stats @252 (neutral/positive): Water Compaction: Atk 209/229, SpA 239/262, Spe 129/141 — Sand Veil: Atk 209/229, SpA 239/262, Spe 129/141
  Item: **free**
  STAB: Ghost Poltergeist 110P · Ground Earthquake 100P
  Physical coverage: Normal Return 102P, Rock Stone Edge 100P, Dark Fling 30P
  Special coverage: Grass Energy Ball 90S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Water Brine 65S

**Sawk** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Fighting | BST 465 (75/125/75/30/75/85) | Abilities: Sturdy / Inner Focus / Mold Breaker
  Engine stats @252 (neutral/positive): Sturdy: Atk 349/383, SpA 159/174, Spe 269/295 — Inner Focus: Atk 349/383, SpA 159/174, Spe 269/295 — Mold Breaker: Atk 349/383, SpA 159/174, Spe 269/295
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Mega Kick 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Poison Poison Jab 80P, Dark Throat Chop 80P
  Special coverage: Grass Grass Knot 60S, Normal Hidden Power 60S

**Sawsbuck** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal/Grass | BST 475 (80/100/70/60/70/95) | Abilities: Chlorophyll / Sap Sipper / Serene Grace
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 299/328, SpA 219/240, Spe 289/317 — Sap Sipper: Atk 299/328, SpA 219/240, Spe 289/317 — Serene Grace: Atk 299/328, SpA 219/240, Spe 289/317
  Item: **free**
  STAB: Normal Last Resort 140P · Grass Petal Blizzard 90P
  Physical coverage: Bug Megahorn 120P, Fighting Double Kick 50x2P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Electric Wild Charge 90P, Flying Bounce 85 (charge)P
  Special coverage: Ghost Shadow Ball 80S

**Scatterbug** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 200 (38/35/40/27/25/35) | Abilities: Shield Dust / Compound Eyes / Friend Guard
  Engine stats @252 (neutral/positive): Shield Dust: Atk 169/185, SpA 153/168, Spe 169/185 — Compound Eyes: Atk 169/185, SpA 153/168, Spe 169/185 — Friend Guard: Atk 169/185, SpA 153/168, Spe 169/185
  Item: **free**
  STAB: Bug Bug Bite 60P
  Physical coverage: Normal Tackle 50P
  Special coverage: Normal Tera Blast 80S

**Sceptile** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass | BST 530 (70/85/65/105/85/120) | Abilities: Overgrow / Unburden
  Engine stats @252 (neutral/positive): Overgrow: Atk 269/295, SpA 309/339, Spe 339/372 — Unburden: Atk 269/295, SpA 309/339, Spe 339/372
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Flying Acrobatics 110P, Ground Earthquake 100P, Steel Iron Tail 100P
  Special coverage: Fighting Focus Blast 120S, Dragon Dragon Pulse 90S, Normal Tera Blast 80S, Ground Mud-Slap 20S

**Scorbunny** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 310 (50/71/40/40/40/69) | Abilities: Blaze / Libero
  Engine stats @252 (neutral/positive): Blaze: Atk 241/265, SpA 179/196, Spe 237/260 — Libero: Atk 241/265, SpA 179/196, Spe 237/260
  Item: **free**
  STAB: Fire Flare Blitz 120P
  Physical coverage: Fighting High Jump Kick 130P, Normal Double-Edge 120P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Dark Sucker Punch 80P, Bug U-turn 70P
  Special coverage: Normal Tera Blast 80S, Electric Electro Ball 60S, Ground Mud Shot 55S

**Scovillain** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass/Fire | BST 486 (65/108/65/108/65/75) | Abilities: Chlorophyll / Insomnia / Moody
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 315/346, SpA 315/346, Spe 249/273 — Insomnia: Atk 315/346, SpA 315/346, Spe 249/273 — Moody: Atk 315/346, SpA 315/346, Spe 249/273
  Item: **free**
  STAB: Grass Leaf Storm 140S · Fire Overheat 140S
  Physical coverage: Normal Take Down 90P, Dark Crunch 80P, Psychic Zen Headbutt 80P, Ground Stomping Tantrum 75P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S

**Scraggy** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark/Fighting | BST 348 (50/75/70/35/70/48) | Abilities: Shed Skin / Moxie / Intimidate
  Engine stats @252 (neutral/positive): Shed Skin: Atk 249/273, SpA 169/185, Spe 195/214 — Moxie: Atk 249/273, SpA 169/185, Spe 195/214 — Intimidate: Atk 249/273, SpA 169/185, Spe 195/214
  Item: **free**
  STAB: Dark Foul Play 95P · Fighting Focus Punch 150P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Dragon Dual Chop 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P
  Special coverage: Dragon Dragon Pulse 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Grass Grass Knot 60S, Fire Incinerate 60S

**Seadra** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 440 (55/65/95/95/45/85) | Abilities: Poison Point / Sniper / Damp
  Engine stats @252 (neutral/positive): Poison Point: Atk 229/251, SpA 289/317, Spe 269/295 — Sniper: Atk 229/251, SpA 289/317, Spe 269/295 — Damp: Atk 229/251, SpA 289/317, Spe 269/295
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Flying Bounce 85 (charge)P
  Special coverage: Ice Blizzard 120S, Dragon Dragon Pulse 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Poison Clear Smog 50S

**Seaking** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Water | BST 450 (80/92/65/65/80/68) | Abilities: Swift Swim / Water Veil / Lightning Rod
  Engine stats @252 (neutral/positive): Swift Swim: Atk 283/311, SpA 229/251, Spe 235/258 — Water Veil: Atk 283/311, SpA 229/251, Spe 235/258 — Lightning Rod: Atk 283/311, SpA 229/251, Spe 235/258
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Skull Bash 130P, Bug Megahorn 120P, Flying Bounce 85 (charge)P, Ground Drill Run 80P, Poison Poison Jab 80P, Dark Throat Chop 80P
  Special coverage: Ice Blizzard 120S, Bug Signal Beam 75S, Psychic Psybeam 65S, Normal Hidden Power 60S, Ground Mud Shot 55S

**Sealeo** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ice/Water | BST 410 (90/60/70/75/70/45) | Abilities: Thick Fat / Ice Body / Oblivious
  Engine stats @252 (neutral/positive): Thick Fat: Atk 219/240, SpA 249/273, Spe 189/207 — Ice Body: Atk 219/240, SpA 249/273, Spe 189/207 — Oblivious: Atk 219/240, SpA 249/273, Spe 189/207
  Item: **free**
  STAB: Ice Blizzard 120S · Water Surf 95S
  Physical coverage: Steel Steel Roller 130P, Normal Double-Edge 120P, Ground Earthquake 100P, Rock Rock Slide 75P, Fighting Rock Smash 40P
  Special coverage: Bug Signal Beam 75S, Normal Hidden Power 60S, Ground Mud-Slap 20S

**Seedot** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 220 (40/40/50/30/30/30) | Abilities: Chlorophyll / Early Bird / Pickpocket
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 179/196, SpA 159/174, Spe 159/174 — Early Bird: Atk 179/196, SpA 159/174, Spe 159/174 — Pickpocket: Atk 179/196, SpA 159/174, Spe 159/174
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Explosion 250P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Fighting Rock Smash 40P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Ghost Shadow Ball 80S, Normal Tera Blast 80S

**Seel** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 325 (65/45/55/45/70/45) | Abilities: Thick Fat / Hydration / Ice Body
  Engine stats @252 (neutral/positive): Thick Fat: Atk 189/207, SpA 189/207, Spe 189/207 — Hydration: Atk 189/207, SpA 189/207, Spe 189/207 — Ice Body: Atk 189/207, SpA 189/207, Spe 189/207
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Skull Bash 130P, Bug Megahorn 120P, Steel Iron Tail 100P, Ground Drill Run 80P, Ice Ice Spinner 80P, Dark Thief 60P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Normal Uproar 90S, Bug Signal Beam 75S

**Sentret** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 215 (35/46/34/35/45/20) | Abilities: Run Away / Keen Eye / Frisk
  Engine stats @252 (neutral/positive): Run Away: Atk 191/210, SpA 169/185, Spe 139/152 — Keen Eye: Atk 191/210, SpA 169/185, Spe 139/152 — Frisk: Atk 191/210, SpA 169/185, Spe 139/152
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Water Aqua Tail 90P, Fairy Play Rough 90P, Grass Seed Bomb 80P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Fire Flamethrower 95S, Water Surf 95S, Ghost Shadow Ball 80S

**Seviper** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Poison | BST 458 (73/100/60/100/60/65) | Abilities: Shed Skin / Infiltrator
  Engine stats @252 (neutral/positive): Shed Skin: Atk 299/328, SpA 299/328, Spe 229/251 — Infiltrator: Atk 299/328, SpA 299/328, Spe 229/251
  Item: **free**
  STAB: Poison Belch 120S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Normal Wring Out 120S, Fire Flamethrower 95S, Dark Dark Pulse 80S, Grass Giga Drain 75S, Bug Infestation 20S, Ground Mud-Slap 20S

**Sewaddle** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Grass | BST 310 (45/53/70/40/60/42) | Abilities: Swarm / Chlorophyll / Overcoat
  Engine stats @252 (neutral/positive): Swarm: Atk 205/225, SpA 179/196, Spe 183/201 — Chlorophyll: Atk 205/225, SpA 179/196, Spe 183/201 — Overcoat: Atk 205/225, SpA 179/196, Spe 183/201
  Item: **free**
  STAB: Bug Bug Buzz 90S · Grass Solar Beam 120 (charge)S
  Physical coverage: Normal Return 102P, Dark Payback 50P
  Special coverage: Psychic Dream Eater 100S, Normal Tera Blast 80S, Flying Air Slash 75S, Electric Electroweb 55S

**Shedinja** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Bug/Ghost | BST 236 (1/90/45/30/30/40) | Abilities: Wonder Guard
  Engine stats @252 (neutral/positive): Wonder Guard: Atk 279/306, SpA 159/174, Spe 179/196
  Item: **free**
  STAB: Bug Leech Life 80P · Ghost Poltergeist 110P
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Dark Sucker Punch 80P, Flying Aerial Ace 60P, Steel Metal Claw 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Hidden Power 60S, Flying Gust 40S, Ground Mud-Slap 20S, Fighting Final Gambit fixedS

**Shelgon** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dragon | BST 420 (65/95/100/60/50/50) | Abilities: Rock Head / Overcoat
  Engine stats @252 (neutral/positive): Rock Head: Atk 289/317, SpA 219/240, Spe 199/218 — Overcoat: Atk 289/317, SpA 219/240, Spe 199/218
  Item: **free**
  STAB: Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Fighting Brick Break 75P, Rock Rock Slide 75P
  Special coverage: Fire Fire Blast 120S, Water Hydro Pump 120S, Normal Hyper Voice 90S, Ground Mud-Slap 20S

**Shellder** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 305 (30/65/100/45/25/40) | Abilities: Shell Armor / Skill Link / Overcoat
  Engine stats @252 (neutral/positive): Shell Armor: Atk 229/251, SpA 189/207, Spe 179/196 — Skill Link: Atk 229/251, SpA 189/207, Spe 179/196 — Overcoat: Atk 229/251, SpA 189/207, Spe 179/196
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Explosion 250P, Bug Twineedle 50x2P, Ice Ice Spinner 80P, Rock Rock Blast 25x2-5P, Dark Payback 50P
  Special coverage: Ice Blizzard 120S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Shellos** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 325 (76/48/48/57/62/34) | Abilities: Sticky Hold / Storm Drain / Sand Force
  Engine stats @252 (neutral/positive): Sticky Hold: Atk 195/214, SpA 213/234, Spe 167/183 — Storm Drain: Atk 195/214, SpA 213/234, Spe 167/183 — Sand Force: Atk 195/214, SpA 213/234, Spe 167/183
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Return 102P, Rock Stone Edge 100P, Bug Skitter Smack 70P, Ground Bulldoze 60P, Fighting Counter fixedP
  Special coverage: Normal Trump Card 200S, Ice Blizzard 120S, Ground Earth Power 90S, Poison Sludge 65S, Rock Ancient Power 60S, Bug Infestation 20S

**Shelmet** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 305 (50/40/85/40/65/25) | Abilities: Hydration / Shell Armor / Overcoat
  Engine stats @252 (neutral/positive): Hydration: Atk 179/196, SpA 179/196, Spe 149/163 — Shell Armor: Atk 179/196, SpA 179/196, Spe 149/163 — Overcoat: Atk 179/196, SpA 179/196, Spe 149/163
  Item: **free**
  STAB: Bug Bug Buzz 90S
  Physical coverage: Normal Double-Edge 120P, Dark Pursuit 40P
  Special coverage: Grass Energy Ball 90S, Poison Sludge Bomb 90S, Normal Hidden Power 60S, Ground Mud Shot 55S, Fighting Final Gambit fixedS

**Shieldon** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Steel | BST 350 (30/42/118/42/88/30) | Abilities: Sturdy / Soundproof
  Engine stats @252 (neutral/positive): Sturdy: Atk 183/201, SpA 183/201, Spe 159/174 — Soundproof: Atk 183/201, SpA 183/201, Spe 159/174
  Item: **free**
  STAB: Rock Stone Edge 100P · Steel Steel Beam 140S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Grass Trailblaze 50P, Fighting Rock Smash 40P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Ground Earth Power 90S, Normal Tera Blast 80S

**Shiftry** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass/Dark | BST 480 (90/100/60/90/60/80) | Abilities: Chlorophyll / Wind Rider / Pickpocket / Early Bird
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 299/328, SpA 279/306, Spe 259/284 — Wind Rider: Atk 299/328, SpA 279/306, Spe 259/284 — Pickpocket: Atk 299/328, SpA 279/306, Spe 259/284 — Early Bird: Atk 299/328, SpA 279/306, Spe 259/284
  Item: **free**
  STAB: Grass Leaf Storm 140S · Dark Foul Play 95P
  Physical coverage: Normal Explosion 250P, Ground Dig 100 (charge)P, Flying Bounce 85 (charge)P, Bug X-Scissor 80P, Fighting Brick Break 75P, Rock Rock Slide 75P
  Special coverage: Fighting Focus Blast 120S, Flying Hurricane 120S, Fire Heat Wave 100S, Normal Uproar 90S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S

**Shiinotic** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Grass/Fairy | BST 405 (60/45/80/90/100/30) | Abilities: Illuminate / Effect Spore / Rain Dish
  Engine stats @252 (neutral/positive): Illuminate: Atk 189/207, SpA 279/306, Spe 159/174 — Effect Spore: Atk 189/207, SpA 279/306, Spe 159/174 — Rain Dish: Atk 189/207, SpA 279/306, Spe 159/174
  Item: **free**
  STAB: Grass Solar Beam 120 (charge)S · Fairy Moonblast 95S
  Physical coverage: Normal Return 102P, Fighting Drain Punch 75P, Ghost Astonish 30P
  Special coverage: Psychic Dream Eater 100S, Bug Pollen Puff 90S, Poison Sludge Bomb 90S, Normal Hidden Power 60S, Electric Charge Beam 50S

**Shinx** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric | BST 263 (45/65/34/40/34/45) | Abilities: Rivalry / Intimidate / Guts
  Engine stats @252 (neutral/positive): Rivalry: Atk 229/251, SpA 179/196, Spe 189/207 — Intimidate: Atk 229/251, SpA 179/196, Spe 189/207 — Guts: Atk 229/251, SpA 179/196, Spe 189/207
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S, Dark Snarl 55S, Ground Mud-Slap 20S

**Shroodle** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison/Normal | BST 290 (40/65/35/40/35/75) | Abilities: Unburden / Pickpocket / Prankster
  Engine stats @252 (neutral/positive): Unburden: Atk 229/251, SpA 179/196, Spe 249/273 — Pickpocket: Atk 229/251, SpA 179/196, Spe 249/273 — Prankster: Atk 229/251, SpA 179/196, Spe 249/273
  Item: **free**
  STAB: Poison Gunk Shot 120P · Normal Double-Edge 120P
  Physical coverage: Flying Acrobatics 110P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Ground Mud Shot 55S

**Shroomish** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 295 (60/40/60/40/60/35) | Abilities: Effect Spore / Poison Heal / Quick Feet
  Engine stats @252 (neutral/positive): Effect Spore: Atk 179/196, SpA 179/196, Spe 169/185 — Poison Heal: Atk 179/196, SpA 179/196, Spe 169/185 — Quick Feet: Atk 179/196, SpA 179/196, Spe 169/185
  Item: **free**
  STAB: Grass Solar Beam 120 (charge)S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Poison Gunk Shot 120P, Psychic Zen Headbutt 80P, Bug Pounce 50P
  Special coverage: Poison Sludge Bomb 90S, Normal Tera Blast 80S

**Shuckle** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Bug/Rock | BST 505 (20/10/230/10/230/5) | Abilities: Sturdy / Gluttony / Contrary
  Engine stats @252 (neutral/positive): Sturdy: Atk 119/130, SpA 119/130, Spe 109/119 — Gluttony: Atk 119/130, SpA 119/130, Spe 109/119 — Contrary: Atk 119/130, SpA 119/130, Spe 109/119
  Item: **free**
  STAB: Bug Skitter Smack 70P · Rock Meteor Beam 120 (charge)S
  Physical coverage: Steel Steel Roller 130P, Normal Double-Edge 120P, Ground Earthquake 100P, Dark Knock Off 65P, Fighting Rock Smash 40P
  Special coverage: Poison Sludge Wave 95S, Ground Earth Power 90S, Normal Hidden Power 60S, Fighting Final Gambit fixedS

**Shuppet** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ghost | BST 295 (44/75/35/63/33/45) | Abilities: Insomnia / Frisk / Cursed Body
  Engine stats @252 (neutral/positive): Insomnia: Atk 249/273, SpA 225/247, Spe 189/207 — Frisk: Atk 249/273, SpA 225/247, Spe 189/207 — Cursed Body: Atk 249/273, SpA 225/247, Spe 189/207
  Item: **free**
  STAB: Ghost Poltergeist 110P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Dark Foul Play 95P, Bug Skitter Smack 70P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Ice Icy Wind 55S

**Silcoon** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 205 (50/35/55/25/25/15) | Abilities: Shed Skin
  Engine stats @252 (neutral/positive): Shed Skin: Atk 169/185, SpA 149/163, Spe 129/141
  Item: **free**
  STAB: Bug Bug Bite 60P
  Physical coverage: Normal Tackle 50P, Poison Poison Sting 15P
  Special coverage: Electric Electroweb 55S, Normal Snore 50S

**Silicobra** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground | BST 315 (52/57/75/35/50/46) | Abilities: Sand Spit / Shed Skin / Sand Veil
  Engine stats @252 (neutral/positive): Sand Spit: Atk 213/234, SpA 169/185, Spe 191/210 — Shed Skin: Atk 213/234, SpA 169/185, Spe 191/210 — Sand Veil: Atk 213/234, SpA 169/185, Spe 191/210
  Item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Normal Last Resort 140P, Dragon Dragon Rush 100P, Rock Stone Edge 100P, Bug Skitter Smack 70P, Dark Brutal Swing 60P, Poison Poison Tail 50P
  Special coverage: Poison Belch 120S, Normal Tera Blast 80S

**Silvally** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Normal | BST 570 (95/95/95/95/95/95) | Abilities: RKS System
  Engine stats @252 (neutral/positive): RKS System: Atk 289/317, SpA 289/317, Spe 289/317
  Item: **free**
  STAB: Normal Explosion 250P
  Physical coverage: Dragon Outrage 120P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Steel Iron Head 80P, Bug X-Scissor 80P, Rock Rock Slide 75P
  Special coverage: Dragon Draco Meteor 140S, Steel Steel Beam 140S, Fire Heat Wave 100S, Ice Ice Beam 95S, Water Surf 95S, Electric Thunderbolt 95S

**Simipour** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Water | BST 498 (75/98/63/98/63/101) | Abilities: Gluttony / Torrent
  Engine stats @252 (neutral/positive): Gluttony: Atk 295/324, SpA 295/324, Spe 301/331 — Torrent: Atk 295/324, SpA 295/324, Spe 301/331
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Normal Uproar 90S, Grass Grass Knot 60S, Fairy Disarming Voice 40S

**Simisage** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Grass | BST 498 (75/98/63/98/63/101) | Abilities: Gluttony / Overgrow
  Engine stats @252 (neutral/positive): Gluttony: Atk 295/324, SpA 295/324, Spe 301/331 — Overgrow: Atk 295/324, SpA 295/324, Spe 301/331
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P
  Special coverage: Fighting Focus Blast 120S, Normal Uproar 90S, Fairy Disarming Voice 40S

**Simisear** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Fire | BST 498 (75/98/63/98/63/101) | Abilities: Gluttony / Blaze
  Engine stats @252 (neutral/positive): Gluttony: Atk 295/324, SpA 295/324, Spe 301/331 — Blaze: Atk 295/324, SpA 295/324, Spe 301/331
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P
  Special coverage: Poison Belch 120S, Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Fairy Disarming Voice 40S

**Sinistea** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ghost | BST 308 (40/45/45/74/54/50) | Abilities: Weak Armor / Cursed Body
  Engine stats @252 (neutral/positive): Weak Armor: Atk 189/207, SpA 247/271, Spe 199/218 — Cursed Body: Atk 189/207, SpA 247/271, Spe 199/218
  Item: **free**
  STAB: Ghost Poltergeist 110P
  Physical coverage: Dark Foul Play 95P, Normal Facade 70P
  Special coverage: Psychic Psychic 90S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Giga Drain 75S

**Sizzlipede** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire/Bug | BST 305 (50/65/45/50/50/45) | Abilities: Flash Fire / White Smoke / Flame Body
  Engine stats @252 (neutral/positive): Flash Fire: Atk 229/251, SpA 199/218, Spe 189/207 — White Smoke: Atk 229/251, SpA 199/218, Spe 189/207 — Flame Body: Atk 229/251, SpA 199/218, Spe 189/207
  Item: **free**
  STAB: Fire Burn Up 130S · Bug Bug Buzz 90S
  Physical coverage: Grass Power Whip 120P, Dark Crunch 80P, Normal Slam 80P, Rock Rollout 30P
  Special coverage: Water Scald 80S, Ground Scorching Sands 70S, Poison Venoshock 65S, Normal Round 60S

**Skiddo** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 350 (66/65/48/62/57/52) | Abilities: Sap Sipper / Grass Pelt
  Engine stats @252 (neutral/positive): Sap Sipper: Atk 229/251, SpA 223/245, Spe 203/223 — Grass Pelt: Atk 229/251, SpA 223/245, Spe 203/223
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Electric Wild Charge 90P, Psychic Zen Headbutt 80P
  Special coverage: Water Surf 95S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Skiploom** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Flying | BST 340 (55/45/50/45/65/80) | Abilities: Chlorophyll / Leaf Guard / Infiltrator
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 189/207, SpA 189/207, Spe 259/284 — Leaf Guard: Atk 189/207, SpA 189/207, Spe 259/284 — Infiltrator: Atk 189/207, SpA 189/207, Spe 259/284
  Item: **free**
  STAB: Grass Leaf Storm 140S · Flying Acrobatics 110P
  Physical coverage: Normal Double-Edge 120P, Bug Lunge 80P, Dark Thief 60P
  Special coverage: Bug Pollen Puff 90S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Psychic Confusion 50S

**Skitty** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 260 (50/45/45/35/35/50) | Abilities: Cute Charm / Normalize / Wonder Skin
  Engine stats @252 (neutral/positive): Cute Charm: Atk 189/207, SpA 169/185, Spe 199/218 — Normalize: Atk 189/207, SpA 169/185, Spe 199/218 — Wonder Skin: Atk 189/207, SpA 169/185, Spe 199/218
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Electric Wild Charge 90P, Dark Sucker Punch 80P, Psychic Zen Headbutt 80P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ghost Shadow Ball 80S, Ground Mud Bomb 65S

**Skorupi** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison/Bug | BST 330 (40/50/90/30/55/65) | Abilities: Battle Armor / Sniper / Keen Eye
  Engine stats @252 (neutral/positive): Battle Armor: Atk 199/218, SpA 159/174, Spe 229/251 — Sniper: Atk 199/218, SpA 159/174, Spe 229/251 — Keen Eye: Atk 199/218, SpA 159/174, Spe 229/251
  Item: **free**
  STAB: Poison Sludge Bomb 90S · Bug Twineedle 50x2P
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Water Aqua Tail 90P, Dark Crunch 80P, Fighting Brick Break 75P
  Special coverage: Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Hidden Power 60S, Ground Mud-Slap 20S

**Skrelp** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison/Water | BST 320 (50/60/60/60/60/30) | Abilities: Poison Point / Poison Touch / Adaptability
  Engine stats @252 (neutral/positive): Poison Point: Atk 219/240, SpA 219/240, Spe 159/174 — Poison Touch: Atk 219/240, SpA 219/240, Spe 159/174 — Adaptability: Atk 219/240, SpA 219/240, Spe 159/174
  Item: **free**
  STAB: Poison Gunk Shot 120P · Water Hydro Pump 120S
  Physical coverage: Dragon Outrage 120P, Normal Return 102P, Steel Iron Tail 100P, Fairy Play Rough 90P, Flying Bounce 85 (charge)P, Dark Feint Attack 60P
  Special coverage: Electric Thunderbolt 95S, Dragon Dragon Pulse 90S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ice Icy Wind 55S, Ground Mud Shot 55S

**Skuntank** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Poison/Dark | BST 479 (103/93/67/71/61/84) | Abilities: Stench / Aftermath / Keen Eye
  Engine stats @252 (neutral/positive): Stench: Atk 285/313, SpA 241/265, Spe 267/293 — Aftermath: Atk 285/313, SpA 241/265, Spe 267/293 — Keen Eye: Atk 285/313, SpA 241/265, Spe 267/293
  Item: **free**
  STAB: Poison Belch 120S · Dark Foul Play 95P
  Physical coverage: Normal Explosion 250P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Fire Temper Flare 75P, Ghost Shadow Claw 70P
  Special coverage: Fire Fire Blast 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Mud-Slap 20S

**Skwovet** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 275 (70/55/55/35/35/25) | Abilities: Cheek Pouch / Gluttony
  Engine stats @252 (neutral/positive): Cheek Pouch: Atk 209/229, SpA 169/185, Spe 149/163 — Gluttony: Atk 209/229, SpA 169/185, Spe 149/163
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Grass Seed Bomb 80P, Rock Rollout 30P, Fighting Counter fixedP
  Special coverage: Poison Belch 120S, Ground Mud Shot 55S

**Slaking** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 670 (150/160/100/95/65/100) | Abilities: Truant
  Engine stats @252 (neutral/positive): Truant: Atk 419/460, SpA 289/317, Spe 299/328
  Item: **free**
  STAB: Normal Double-Edge 120P
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Hard Press 100P, Fairy Play Rough 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S

**Slakoth** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 280 (60/60/60/35/35/30) | Abilities: Truant
  Engine stats @252 (neutral/positive): Truant: Atk 219/240, SpA 169/185, Spe 159/174
  Item: **free**
  STAB: Normal Double-Edge 120P
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Fairy Play Rough 90P, Grass Seed Bomb 80P, Dark Sucker Punch 80P, Bug X-Scissor 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S, Water Water Pulse 60S

**Sliggoo** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dragon | BST 452 (68/75/53/83/113/60) | Abilities: Sap Sipper / Hydration / Gooey
  Engine stats @252 (neutral/positive): Sap Sipper: Atk 249/273, SpA 265/291, Spe 219/240 — Hydration: Atk 249/273, SpA 265/291, Spe 219/240 — Gooey: Atk 249/273, SpA 265/291, Spe 219/240
  Item: **free**
  STAB: Dragon Draco Meteor 140S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Rock Rock Slide 75P, Bug Skitter Smack 70P, Poison Poison Tail 50P, Fighting Counter fixedP
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Water Muddy Water 95S, Poison Sludge Wave 95S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Slugma** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 250 (40/40/40/70/40/20) | Abilities: Magma Armor / Flame Body / Weak Armor
  Engine stats @252 (neutral/positive): Magma Armor: Atk 179/196, SpA 239/262, Spe 139/152 — Flame Body: Atk 179/196, SpA 239/262, Spe 139/152 — Weak Armor: Atk 179/196, SpA 239/262, Spe 139/152
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Self-Destruct 200P, Ground Earthquake 100P, Rock Stone Edge 100P, Fighting Rock Smash 40P
  Special coverage: Ground Earth Power 90S, Rock Power Gem 80S, Normal Tera Blast 80S, Poison Clear Smog 50S, Bug Infestation 20S

**Smeargle** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 250 (55/20/35/20/45/75) | Abilities: Own Tempo / Technician / Moody
  Engine stats @252 (neutral/positive): Own Tempo: Atk 139/152, SpA 139/152, Spe 249/273 — Technician: Atk 139/152, SpA 139/152, Spe 249/273 — Moody: Atk 139/152, SpA 139/152, Spe 249/273
  Item: **free**
  STAB: Normal Double Slap 25x2-5P
  Physical coverage: Steel Iron Tail 100P, Fighting Seismic Toss fixedP
  Special coverage: Fire Flamethrower 95S

**Smoliv** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Normal | BST 260 (41/35/45/58/51/30) | Abilities: Early Bird / Harvest
  Engine stats @252 (neutral/positive): Early Bird: Atk 169/185, SpA 215/236, Spe 159/174 — Harvest: Atk 169/185, SpA 215/236, Spe 159/174
  Item: **free**
  STAB: Grass Leaf Storm 140S · Normal Tera Blast 80S
  Physical coverage: **none**
  Special coverage: Ground Earth Power 90S

**Smoochum** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ice/Psychic | BST 305 (45/30/15/85/65/65) | Abilities: Oblivious / Forewarn / Hydration
  Engine stats @252 (neutral/positive): Oblivious: Atk 159/174, SpA 269/295, Spe 229/251 — Forewarn: Atk 159/174, SpA 269/295, Spe 229/251 — Hydration: Atk 159/174, SpA 269/295, Spe 229/251
  Item: **free**
  STAB: Ice Blizzard 120S · Psychic Dream Eater 100S
  Physical coverage: Normal Double-Edge 120P, Fighting Dynamic Punch 100P, Dark Thief 60P, Ghost Lick 30P
  Special coverage: Normal Uproar 90S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Grass Grass Knot 60S, Water Water Pulse 60S, Fairy Draining Kiss 50S

**Sneasel** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark/Ice | BST 430 (55/95/55/35/75/115) | Abilities: Inner Focus / Keen Eye / Pickpocket
  Engine stats @252 (neutral/positive): Inner Focus: Atk 289/317, SpA 169/185, Spe 329/361 — Keen Eye: Atk 289/317, SpA 169/185, Spe 329/361 — Pickpocket: Atk 289/317, SpA 169/185, Spe 329/361
  Item: **free**
  STAB: Dark Foul Play 95P · Ice Icicle Crash 85P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P
  Special coverage: Psychic Dream Eater 100S, Water Surf 95S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Mud-Slap 20S

**Snivy** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 308 (45/45/55/45/55/63) | Abilities: Overgrow / Contrary
  Engine stats @252 (neutral/positive): Overgrow: Atk 189/207, SpA 189/207, Spe 225/247 — Contrary: Atk 189/207, SpA 189/207, Spe 225/247
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Water Aqua Tail 90P, Dark Knock Off 65P, Flying Aerial Ace 60P
  Special coverage: Normal Wring Out 120S, Dragon Twister 40S, Psychic Mirror Coat fixedS

**Snom** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ice/Bug | BST 185 (30/25/35/45/30/20) | Abilities: Shield Dust / Ice Scales
  Engine stats @252 (neutral/positive): Shield Dust: Atk 149/163, SpA 189/207, Spe 139/152 — Ice Scales: Atk 149/163, SpA 189/207, Spe 139/152
  Item: **free**
  STAB: Ice Icicle Spear 25x2-5P · Bug Bug Buzz 90S
  Physical coverage: Normal Facade 70P
  Special coverage: Normal Tera Blast 80S, Fairy Fairy Wind 40S, Psychic Mirror Coat fixedS

**Snorunt** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ice | BST 300 (50/50/50/50/50/50) | Abilities: Inner Focus / Ice Body / Moody
  Engine stats @252 (neutral/positive): Inner Focus: Atk 199/218, SpA 199/218, Spe 199/218 — Ice Body: Atk 199/218, SpA 199/218, Spe 199/218 — Moody: Atk 199/218, SpA 199/218, Spe 199/218
  Item: **free**
  STAB: Ice Blizzard 120S
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Grass Trailblaze 50P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Ghost Shadow Ball 80S, Normal Tera Blast 80S, Water Water Pulse 60S

**Snover** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Ice | BST 334 (60/62/50/62/60/40) | Abilities: Snow Warning / Soundproof
  Engine stats @252 (neutral/positive): Snow Warning: Atk 223/245, SpA 223/245, Spe 179/196 — Soundproof: Atk 223/245, SpA 223/245, Spe 179/196
  Item: **free**
  STAB: Grass Leaf Storm 140S · Ice Blizzard 120S
  Physical coverage: Normal Skull Bash 130P, Steel Iron Tail 100P
  Special coverage: Ghost Shadow Ball 80S, Normal Tera Blast 80S, Water Water Pulse 60S, Ground Mud-Slap 20S

**Snubbull** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fairy | BST 300 (60/80/50/40/40/30) | Abilities: Intimidate / Run Away / Rattled
  Engine stats @252 (neutral/positive): Intimidate: Atk 259/284, SpA 179/196, Spe 159/174 — Run Away: Atk 259/284, SpA 179/196, Spe 159/174 — Rattled: Atk 259/284, SpA 179/196, Spe 159/174
  Item: **free**
  STAB: Fairy Play Rough 90P
  Physical coverage: Fighting Focus Punch 150P, Normal Last Resort 140P, Ground Earthquake 100P, Electric Wild Charge 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Fire Overheat 140S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Normal Hyper Voice 90S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S

**Sobble** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 310 (50/40/40/70/40/70) | Abilities: Torrent / Sniper
  Engine stats @252 (neutral/positive): Torrent: Atk 179/196, SpA 239/262, Spe 239/262 — Sniper: Atk 179/196, SpA 239/262, Spe 239/262
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Take Down 90P, Flying Bounce 85 (charge)P, Dark Sucker Punch 80P, Bug U-turn 70P, Ice Ice Shard 40P
  Special coverage: Normal Tera Blast 80S, Ground Mud Shot 55S

**Solosis** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 290 (45/30/40/105/50/20) | Abilities: Overcoat / Magic Guard / Regenerator
  Engine stats @252 (neutral/positive): Overcoat: Atk 159/174, SpA 309/339, Spe 139/152 — Magic Guard: Atk 159/174, SpA 309/339, Spe 139/152 — Regenerator: Atk 159/174, SpA 309/339, Spe 139/152
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Steel Steel Roller 130P, Rock Rock Slide 75P, Ghost Astonish 30P
  Special coverage: Electric Thunder 120S, Grass Energy Ball 90S, Steel Flash Cannon 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Solrock** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Rock/Psychic | BST 460 (90/95/85/55/65/70) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 289/317, SpA 209/229, Spe 239/262
  Item: **free**
  STAB: Rock Stone Edge 100P · Psychic Zen Headbutt 80P
  Physical coverage: Normal Explosion 250P, Fire Flare Blitz 120P, Flying Acrobatics 110P, Ground Earthquake 100P, Steel Iron Head 80P
  Special coverage: Fire Overheat 140S, Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Normal Hidden Power 60S

**Spearow** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Flying | BST 262 (40/60/30/31/31/70) | Abilities: Keen Eye / Sniper
  Engine stats @252 (neutral/positive): Keen Eye: Atk 219/240, SpA 161/177, Spe 239/262 — Sniper: Atk 219/240, SpA 161/177, Spe 239/262
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Ground Drill Run 80P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Assurance 60P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Spewpa** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 213 (45/22/60/27/30/29) | Abilities: Shed Skin / Friend Guard
  Engine stats @252 (neutral/positive): Shed Skin: Atk 143/157, SpA 153/168, Spe 157/172 — Friend Guard: Atk 143/157, SpA 153/168, Spe 157/172
  Item: **free**
  STAB: Bug Bug Bite 60P
  Physical coverage: Normal Tackle 50P
  Special coverage: Normal Tera Blast 80S, Electric Electroweb 55S

**Spheal** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ice/Water | BST 290 (70/40/50/55/50/25) | Abilities: Thick Fat / Ice Body / Oblivious
  Engine stats @252 (neutral/positive): Thick Fat: Atk 179/196, SpA 209/229, Spe 149/163 — Ice Body: Atk 179/196, SpA 209/229, Spe 149/163 — Oblivious: Atk 179/196, SpA 209/229, Spe 149/163
  Item: **free**
  STAB: Ice Blizzard 120S · Water Surf 95S
  Physical coverage: Steel Steel Roller 130P, Normal Double-Edge 120P, Ground Earthquake 100P, Rock Rock Slide 75P, Fighting Rock Smash 40P
  Special coverage: Bug Signal Beam 75S, Normal Hidden Power 60S, Ground Mud-Slap 20S

**Spidops** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Bug | BST 404 (60/79/92/52/86/35) | Abilities: Insomnia / Stakeout
  Engine stats @252 (neutral/positive): Insomnia: Atk 257/282, SpA 203/223, Spe 169/185 — Stakeout: Atk 257/282, SpA 203/223, Spe 169/185
  Item: **free**
  STAB: Bug Bug Buzz 90S
  Physical coverage: Normal Take Down 90P, Poison Poison Jab 80P, Dark Sucker Punch 80P, Grass Bullet Seed 25x2-5P, Fighting Brick Break 75P, Ghost Shadow Claw 70P
  Special coverage: Normal Tera Blast 80S, Grass Giga Drain 75S, Electric Electroweb 55S

**Spinarak** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Poison | BST 250 (40/60/40/40/40/30) | Abilities: Swarm / Insomnia / Sniper
  Engine stats @252 (neutral/positive): Swarm: Atk 219/240, SpA 179/196, Spe 159/174 — Insomnia: Atk 219/240, SpA 179/196, Spe 159/174 — Sniper: Atk 219/240, SpA 179/196, Spe 159/174
  Item: **free**
  STAB: Bug Megahorn 120P · Poison Sludge Wave 95S
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Flying Bounce 85 (charge)P, Grass Trailblaze 50P, Ghost Shadow Sneak 40P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Psychic 90S, Normal Tera Blast 80S, Ghost Hex 65S, Electric Electroweb 55S

**Spinda** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Normal | BST 360 (60/60/60/60/60/60) | Abilities: Own Tempo / Tangled Feet / Contrary
  Engine stats @252 (neutral/positive): Own Tempo: Atk 219/240, SpA 219/240, Spe 219/240 — Tangled Feet: Atk 219/240, SpA 219/240, Spe 219/240 — Contrary: Atk 219/240, SpA 219/240, Spe 219/240
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Dark Sucker Punch 80P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Psychic Dream Eater 100S, Ghost Shadow Ball 80S, Electric Shock Wave 60S, Water Water Pulse 60S, Ice Icy Wind 55S, Ground Mud-Slap 20S

**Spiritomb** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ghost/Dark | BST 485 (50/92/108/92/108/35) | Abilities: Pressure / Infiltrator
  Engine stats @252 (neutral/positive): Pressure: Atk 283/311, SpA 283/311, Spe 169/185 — Infiltrator: Atk 283/311, SpA 283/311, Spe 169/185
  Item: **free**
  STAB: Ghost Poltergeist 110P · Dark Foul Play 95P
  Physical coverage: Normal Return 102P, Rock Rock Tomb 60P
  Special coverage: Psychic Dream Eater 100S, Normal Uproar 90S, Fire Burning Jealousy 70S, Electric Shock Wave 60S, Bug Silver Wind 60S, Water Water Pulse 60S

**Spoink** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 330 (60/25/35/70/80/60) | Abilities: Thick Fat / Own Tempo / Gluttony
  Engine stats @252 (neutral/positive): Thick Fat: Atk 149/163, SpA 239/262, Spe 219/240 — Own Tempo: Atk 149/163, SpA 239/262, Spe 219/240 — Gluttony: Atk 149/163, SpA 239/262, Spe 219/240
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Flying Bounce 85 (charge)P, Bug Lunge 80P, Dark Thief 60P, Grass Trailblaze 50P
  Special coverage: Normal Uproar 90S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Rock Power Gem 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Sprigatito** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 310 (40/61/54/45/45/65) | Abilities: Overgrow / Protean
  Engine stats @252 (neutral/positive): Overgrow: Atk 221/243, SpA 189/207, Spe 229/251 — Protean: Atk 221/243, SpA 189/207, Spe 229/251
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Flying Acrobatics 110P, Fairy Play Rough 90P, Normal Take Down 90P, Dark Sucker Punch 80P, Ghost Shadow Claw 70P, Bug U-turn 70P
  Special coverage: Normal Tera Blast 80S, Fairy Disarming Voice 40S, Ground Mud-Slap 20S

**Spritzee** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fairy | BST 341 (78/52/60/63/65/23) | Abilities: Healer / Aroma Veil
  Engine stats @252 (neutral/positive): Healer: Atk 203/223, SpA 225/247, Spe 145/159 — Aroma Veil: Atk 203/223, SpA 225/247, Spe 145/159
  Item: **free**
  STAB: Fairy Misty Explosion 100S
  Physical coverage: Normal Return 102P, Steel Gyro Ball 45P
  Special coverage: Psychic Dream Eater 100S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Steel Flash Cannon 80S, Normal Hidden Power 60S

**Squawkabilly** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal/Flying | BST 417 (82/96/51/45/51/92) | Abilities: Intimidate / Hustle / Guts
  Engine stats @252 (neutral/positive): Intimidate: Atk 291/320, SpA 189/207, Spe 283/311 — Hustle: Atk 436/480, SpA 189/207, Spe 283/311 — Guts: Atk 291/320, SpA 189/207, Spe 283/311
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Brave Bird 120P
  Physical coverage: Dark Foul Play 95P, Bug U-turn 70P, Fighting Reversal 20P
  Special coverage: Fire Heat Wave 100S, Fighting Final Gambit fixedS

**Squirtle** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 314 (44/48/65/50/64/43) | Abilities: Torrent / Rain Dish
  Engine stats @252 (neutral/positive): Torrent: Atk 195/214, SpA 199/218, Spe 185/203 — Rain Dish: Atk 195/214, SpA 199/218, Spe 185/203
  Item: **free**
  STAB: Water Water Spout 150S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fighting Aura Sphere 90S, Dragon Dragon Pulse 90S, Normal Tera Blast 80S, Ground Mud Shot 55S, Psychic Confusion 50S

**Stantler** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 465 (73/95/62/85/65/85) | Abilities: Intimidate / Frisk / Sap Sipper
  Engine stats @252 (neutral/positive): Intimidate: Atk 289/317, SpA 269/295, Spe 269/295 — Frisk: Atk 289/317, SpA 269/295, Spe 269/295 — Sap Sipper: Atk 289/317, SpA 269/295, Spe 269/295
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Bug Megahorn 120P, Fighting Double Kick 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Electric Wild Charge 90P, Flying Bounce 85 (charge)P
  Special coverage: Psychic Future Sight 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Staravia** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Flying | BST 340 (55/75/50/40/40/80) | Abilities: Intimidate / Reckless
  Engine stats @252 (neutral/positive): Intimidate: Atk 249/273, SpA 179/196, Spe 259/284 — Reckless: Atk 249/273, SpA 179/196, Spe 259/284
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Brave Bird 120P
  Physical coverage: Steel Steel Wing 70P, Bug U-turn 70P, Fighting Revenge 60P, Dark Thief 60P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S, Fighting Final Gambit fixedS

**Starly** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Flying | BST 245 (40/55/30/30/30/60) | Abilities: Keen Eye / Reckless
  Engine stats @252 (neutral/positive): Keen Eye: Atk 209/229, SpA 159/174, Spe 219/240 — Reckless: Atk 209/229, SpA 159/174, Spe 219/240
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Brave Bird 120P
  Physical coverage: Steel Steel Wing 70P, Bug U-turn 70P, Fighting Revenge 60P, Dark Thief 60P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S, Fighting Final Gambit fixedS

**Staryu** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 340 (30/45/55/70/55/85) | Abilities: Illuminate / Natural Cure / Analytic
  Engine stats @252 (neutral/positive): Illuminate: Atk 189/207, SpA 239/262, Spe 269/295 — Natural Cure: Atk 189/207, SpA 239/262, Spe 269/295 — Analytic: Atk 189/207, SpA 239/262, Spe 269/295
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Skull Bash 130P, Rock Rollout 30P, Steel Gyro Ball 18P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Psychic Psychic 90S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Rock Power Gem 80S

**Steenee** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 290 (52/40/48/40/48/62) | Abilities: Leaf Guard / Oblivious / Sweet Veil
  Engine stats @252 (neutral/positive): Leaf Guard: Atk 179/196, SpA 179/196, Spe 223/245 — Oblivious: Atk 179/196, SpA 179/196, Spe 223/245 — Sweet Veil: Atk 179/196, SpA 179/196, Spe 223/245
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Return 102P, Fairy Play Rough 90P, Flying Bounce 85 (charge)P, Psychic Zen Headbutt 80P, Dark Knock Off 65P, Fighting Low Sweep 65P
  Special coverage: Fairy Dazzling Gleam 80S, Normal Tera Blast 80S

**Stonjourner** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Rock | BST 470 (100/125/135/20/20/70) | Abilities: Power Spot
  Engine stats @252 (neutral/positive): Power Spot: Atk 349/383, SpA 139/152, Spe 239/262
  Item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Normal Self-Destruct 200P, Fire Heat Crash 120P, Steel Heavy Slam 120P, Fighting Superpower 120P, Ground Earthquake 100P, Dark Assurance 60P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S

**Stoutland** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Normal | BST 500 (85/110/90/45/90/80) | Abilities: Intimidate / Sand Rush / Scrappy
  Engine stats @252 (neutral/positive): Intimidate: Atk 319/350, SpA 189/207, Spe 259/284 — Sand Rush: Atk 319/350, SpA 189/207, Spe 259/284 — Scrappy: Atk 319/350, SpA 189/207, Spe 259/284
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Superpower 120P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Electric Wild Charge 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Electric Thunder 120S, Water Surf 95S, Ghost Shadow Ball 80S, Dark Snarl 55S, Ground Mud-Slap 20S

**Stufful** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Fighting | BST 340 (70/75/50/45/50/50) | Abilities: Fluffy / Klutz / Cute Charm
  Engine stats @252 (neutral/positive): Fluffy: Atk 249/273, SpA 189/207, Spe 199/218 — Klutz: Atk 249/273, SpA 189/207, Spe 199/218 — Cute Charm: Atk 249/273, SpA 189/207, Spe 199/218
  Item: **free**
  STAB: Normal Double-Edge 120P · Fighting Focus Punch 150P
  Physical coverage: Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Ice Ice Punch 75P, Rock Rock Slide 75P
  Special coverage: **none**

**Stunfisk** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Ground/Electric | BST 471 (109/66/84/81/99/32) | Abilities: Static / Limber / Sand Veil
  Engine stats @252 (neutral/positive): Static: Atk 231/254, SpA 261/287, Spe 163/179 — Limber: Atk 231/254, SpA 261/287, Spe 163/179 — Sand Veil: Atk 231/254, SpA 261/287, Spe 163/179
  Item: **free**
  STAB: Ground Earthquake 100P · Electric Thunder 120S
  Physical coverage: Normal Return 102P, Rock Stone Edge 100P, Dark Foul Play 95P, Water Aqua Tail 90P, Flying Bounce 85 (charge)P, Fighting Revenge 60P
  Special coverage: Water Muddy Water 95S, Poison Sludge Wave 95S, Normal Uproar 90S, Bug Infestation 20S

**Stunfisk-Galar** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Ground/Steel | BST 471 (109/81/99/66/84/32) | Abilities: Mimicry
  Engine stats @252 (neutral/positive): Mimicry: Atk 261/287, SpA 231/254, Spe 163/179
  Item: **free**
  STAB: Ground Earthquake 100P · Steel Steel Beam 140S
  Physical coverage: Normal Return 102P, Rock Stone Edge 100P, Dark Foul Play 95P, Water Aqua Tail 90P, Flying Bounce 85 (charge)P, Ice Ice Fang 65P
  Special coverage: Electric Thunder 120S, Water Muddy Water 95S, Poison Sludge Wave 95S, Normal Uproar 90S, Bug Infestation 20S

**Stunky** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison/Dark | BST 329 (63/63/47/41/41/74) | Abilities: Stench / Aftermath / Keen Eye
  Engine stats @252 (neutral/positive): Stench: Atk 225/247, SpA 181/199, Spe 247/271 — Aftermath: Atk 225/247, SpA 181/199, Spe 247/271 — Keen Eye: Atk 225/247, SpA 181/199, Spe 247/271
  Item: **free**
  STAB: Poison Belch 120S · Dark Foul Play 95P
  Physical coverage: Normal Explosion 250P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Fire Temper Flare 75P, Ghost Shadow Claw 70P
  Special coverage: Fire Fire Blast 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Mud-Slap 20S

**Sudowoodo** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Rock | BST 410 (70/100/115/30/65/30) | Abilities: Sturdy / Rock Head / Rattled
  Engine stats @252 (neutral/positive): Sturdy: Atk 299/328, SpA 159/174, Spe 159/174 — Rock Head: Atk 299/328, SpA 159/174, Spe 159/174 — Rattled: Atk 299/328, SpA 159/174, Spe 159/174
  Item: **free**
  STAB: Rock Head Smash 150P
  Physical coverage: Normal Explosion 250P, Fighting Focus Punch 150P, Grass Wood Hammer 120P, Ground Earthquake 100P, Dark Foul Play 95P, Fire Fire Punch 75P
  Special coverage: Ground Earth Power 90S, Normal Uproar 90S, Grass Grass Knot 60S

**Sunflora** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass | BST 425 (75/75/55/105/85/30) | Abilities: Chlorophyll / Solar Power / Early Bird
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 249/273, SpA 309/339, Spe 159/174 — Solar Power: Atk 249/273, SpA 309/339, Spe 159/174 — Early Bird: Atk 249/273, SpA 309/339, Spe 159/174
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P
  Special coverage: Ground Earth Power 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Fairy Dazzling Gleam 80S

**Sunkern** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 180 (30/30/30/30/30/30) | Abilities: Chlorophyll / Solar Power / Early Bird
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 159/174, SpA 159/174, Spe 159/174 — Solar Power: Atk 159/174, SpA 159/174, Spe 159/174 — Early Bird: Atk 159/174, SpA 159/174, Spe 159/174
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P
  Special coverage: Ground Earth Power 90S, Poison Sludge Bomb 90S, Normal Uproar 90S

**Surskit** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Water | BST 269 (40/30/32/50/52/65) | Abilities: Swift Swim / Rain Dish
  Engine stats @252 (neutral/positive): Swift Swim: Atk 159/174, SpA 199/218, Spe 229/251 — Rain Dish: Atk 159/174, SpA 199/218, Spe 229/251
  Item: **free**
  STAB: Bug Bug Buzz 90S · Water Hydro Pump 120S
  Physical coverage: Normal Double-Edge 120P, Flying Acrobatics 110P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Psychic Psybeam 65S, Ground Mud Shot 55S

**Swablu** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Flying | BST 310 (45/40/60/40/75/50) | Abilities: Natural Cure / Cloud Nine
  Engine stats @252 (neutral/positive): Natural Cure: Atk 179/196, SpA 179/196, Spe 199/218 — Cloud Nine: Atk 179/196, SpA 179/196, Spe 199/218
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Dragon Outrage 120P, Fairy Play Rough 90P, Steel Steel Wing 70P, Dark Thief 60P, Grass Trailblaze 50P, Ghost Astonish 30P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Fire Heat Wave 100S, Ice Ice Beam 95S, Fairy Moonblast 95S, Dragon Dragon Pulse 90S

**Swadloon** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Grass | BST 380 (55/63/90/50/80/42) | Abilities: Leaf Guard / Chlorophyll / Overcoat
  Engine stats @252 (neutral/positive): Leaf Guard: Atk 225/247, SpA 199/218, Spe 183/201 — Chlorophyll: Atk 225/247, SpA 199/218, Spe 183/201 — Overcoat: Atk 225/247, SpA 199/218, Spe 183/201
  Item: **free**
  STAB: Bug Bug Buzz 90S · Grass Solar Beam 120 (charge)S
  Physical coverage: Normal Return 102P, Dark Payback 50P
  Special coverage: Psychic Dream Eater 100S, Normal Tera Blast 80S, Flying Air Slash 75S, Electric Electroweb 55S

**Swalot** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Poison | BST 467 (100/73/83/73/83/55) | Abilities: Liquid Ooze / Sticky Hold / Gluttony
  Engine stats @252 (neutral/positive): Liquid Ooze: Atk 245/269, SpA 245/269, Spe 209/229 — Sticky Hold: Atk 245/269, SpA 245/269, Spe 209/229 — Gluttony: Atk 245/269, SpA 245/269, Spe 209/229
  Item: **free**
  STAB: Poison Belch 120S
  Physical coverage: Normal Explosion 250P, Fighting Dynamic Punch 100P, Ground Earthquake 100P, Grass Seed Bomb 80P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Normal Wring Out 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ice Ice Beam 95S, Ghost Shadow Ball 80S, Electric Shock Wave 60S

**Swanna** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Water/Flying | BST 473 (75/87/63/87/63/98) | Abilities: Keen Eye / Big Pecks / Hydration
  Engine stats @252 (neutral/positive): Keen Eye: Atk 273/300, SpA 273/300, Spe 295/324 — Big Pecks: Atk 273/300, SpA 273/300, Spe 295/324 — Hydration: Atk 273/300, SpA 273/300, Spe 295/324
  Item: **free**
  STAB: Water Hydro Pump 120S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Dark Knock Off 65P, Grass Trailblaze 50P
  Special coverage: Ice Ice Beam 95S, Normal Uproar 90S, Fairy Alluring Voice 80S

**Swinub** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ice/Ground | BST 250 (50/50/40/30/30/50) | Abilities: Oblivious / Snow Cloak / Thick Fat
  Engine stats @252 (neutral/positive): Oblivious: Atk 199/218, SpA 159/174, Spe 199/218 — Snow Cloak: Atk 199/218, SpA 159/174, Spe 199/218 — Thick Fat: Atk 199/218, SpA 159/174, Spe 199/218
  Item: **free**
  STAB: Ice Blizzard 120S · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Rock Stone Edge 100P, Dark Bite 60P, Grass Trailblaze 50P
  Special coverage: Normal Tera Blast 80S, Rock Ancient Power 60S

**Swirlix** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fairy | BST 341 (62/48/66/59/57/49) | Abilities: Sweet Veil / Unburden
  Engine stats @252 (neutral/positive): Sweet Veil: Atk 195/214, SpA 217/238, Spe 197/216 — Unburden: Atk 195/214, SpA 217/238, Spe 197/216
  Item: **free**
  STAB: Fairy Misty Explosion 100S
  Physical coverage: Normal Return 102P, Dark Thief 60P
  Special coverage: Psychic Dream Eater 100S, Fire Flamethrower 95S, Water Surf 95S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Hidden Power 60S

**Swoobat** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Psychic/Flying | BST 425 (67/57/55/77/55/114) | Abilities: Unaware / Klutz / Simple
  Engine stats @252 (neutral/positive): Unaware: Atk 213/234, SpA 253/278, Spe 327/359 — Klutz: Atk 213/234, SpA 253/278, Spe 327/359 — Simple: Atk 213/234, SpA 253/278, Spe 327/359
  Item: **free**
  STAB: Psychic Future Sight 120S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Return 102P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Fire Heat Wave 100S, Grass Energy Ball 90S, Normal Uproar 90S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Electric Shock Wave 60S

**Tadbulb** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric | BST 272 (61/31/41/59/35/45) | Abilities: Own Tempo / Static / Damp
  Engine stats @252 (neutral/positive): Own Tempo: Atk 161/177, SpA 217/238, Spe 189/207 — Static: Atk 161/177, SpA 217/238, Spe 189/207 — Damp: Atk 161/177, SpA 217/238, Spe 189/207
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Dark Sucker Punch 80P, Normal Tackle 50P
  Special coverage: Water Muddy Water 95S, Normal Hyper Voice 90S, Ground Mud Shot 55S, Poison Acid Spray 40S

**Taillow** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Flying | BST 270 (40/55/30/30/30/85) | Abilities: Guts / Scrappy
  Engine stats @252 (neutral/positive): Guts: Atk 209/229, SpA 159/174, Spe 269/295 — Scrappy: Atk 209/229, SpA 159/174, Spe 269/295
  Item: **free**
  STAB: Normal Boomburst 140S · Flying Sky Attack 140 (charge)P
  Physical coverage: Steel Steel Wing 70P, Bug U-turn 70P, Dark Thief 60P, Fighting Reversal 20P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Tandemaus** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 305 (50/50/45/40/45/75) | Abilities: Run Away / Pickup / Own Tempo
  Engine stats @252 (neutral/positive): Run Away: Atk 199/218, SpA 179/196, Spe 249/273 — Pickup: Atk 199/218, SpA 179/196, Spe 249/273 — Own Tempo: Atk 199/218, SpA 179/196, Spe 249/273
  Item: **free**
  STAB: Normal Population Bomb 20x10P
  Physical coverage: Ground Dig 100 (charge)P, Fairy Play Rough 90P, Dark Crunch 80P, Grass Seed Bomb 80P, Ghost Shadow Claw 70P, Bug U-turn 70P
  Special coverage: Grass Grass Knot 60S, Water Water Pulse 60S, Ground Mud Shot 55S

**Tarountula** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 210 (35/41/45/29/40/20) | Abilities: Insomnia / Stakeout
  Engine stats @252 (neutral/positive): Insomnia: Atk 181/199, SpA 157/172, Spe 139/152 — Stakeout: Atk 181/199, SpA 157/172, Spe 139/152
  Item: **free**
  STAB: Bug Bug Buzz 90S
  Physical coverage: Normal Take Down 90P, Poison Poison Jab 80P, Dark Sucker Punch 80P, Grass Bullet Seed 25x2-5P, Ghost Shadow Claw 70P, Fighting Circle Throw 60P
  Special coverage: Normal Tera Blast 80S, Grass Giga Drain 75S

**Tauros** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 490 (75/100/95/40/70/110) | Abilities: Intimidate / Anger Point / Sheer Force
  Engine stats @252 (neutral/positive): Intimidate: Atk 299/328, SpA 179/196, Spe 319/350 — Anger Point: Atk 299/328, SpA 179/196, Spe 319/350 — Sheer Force: Atk 299/328, SpA 179/196, Spe 319/350
  Item: **free**
  STAB: Normal Skull Bash 130P
  Physical coverage: Fighting Close Combat 120P, Bug Megahorn 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Water Surf 95S, Ghost Shadow Ball 80S

**Tauros-Paldea-Combat** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fighting | BST 490 (75/110/105/30/70/100) | Abilities: Intimidate / Anger Point / Cud Chew
  Engine stats @252 (neutral/positive): Intimidate: Atk 319/350, SpA 159/174, Spe 299/328 — Anger Point: Atk 319/350, SpA 159/174, Spe 299/328 — Cud Chew: Atk 319/350, SpA 159/174, Spe 299/328
  Item: **free**
  STAB: Fighting Close Combat 120P
  Physical coverage: Normal Skull Bash 130P, Bug Megahorn 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Water Surf 95S, Normal Uproar 90S

**Teddiursa** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 330 (60/80/50/50/50/40) | Abilities: Pickup / Quick Feet / Honey Gather
  Engine stats @252 (neutral/positive): Pickup: Atk 259/284, SpA 199/218, Spe 179/196 — Quick Feet: Atk 259/284, SpA 199/218, Spe 179/196 — Honey Gather: Atk 259/284, SpA 199/218, Spe 179/196
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Ground Earthquake 100P, Fairy Play Rough 90P, Dark Crunch 80P, Grass Seed Bomb 80P
  Special coverage: Electric Zap Cannon 120S, Ground Mud-Slap 20S

**Tentacool** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Poison | BST 335 (40/40/35/50/100/70) | Abilities: Clear Body / Liquid Ooze / Rain Dish
  Engine stats @252 (neutral/positive): Clear Body: Atk 179/196, SpA 199/218, Spe 239/262 — Liquid Ooze: Atk 179/196, SpA 199/218, Spe 239/262 — Rain Dish: Atk 179/196, SpA 199/218, Spe 239/262
  Item: **free**
  STAB: Water Hydro Pump 120S · Poison Gunk Shot 120P
  Physical coverage: Normal Skull Bash 130P, Dark Throat Chop 80P, Bug Pounce 50P
  Special coverage: Ice Blizzard 120S, Normal Wring Out 120S, Fairy Dazzling Gleam 80S, Grass Giga Drain 75S, Ghost Hex 65S, Ground Mud Shot 55S

**Tepig** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 308 (65/63/45/45/45/45) | Abilities: Blaze / Thick Fat
  Engine stats @252 (neutral/positive): Blaze: Atk 225/247, SpA 189/207, Spe 189/207 — Thick Fat: Atk 225/247, SpA 189/207, Spe 189/207
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Fighting Superpower 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Electric Wild Charge 90P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Tera Blast 80S, Poison Smog 30S, Ground Mud-Slap 20S

**Thievul** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Dark | BST 455 (70/58/58/87/92/90) | Abilities: Run Away / Unburden / Stakeout
  Engine stats @252 (neutral/positive): Run Away: Atk 215/236, SpA 273/300, Spe 279/306 — Unburden: Atk 215/236, SpA 273/300, Spe 279/306 — Stakeout: Atk 215/236, SpA 273/300, Spe 279/306
  Item: **free**
  STAB: Dark Foul Play 95P
  Physical coverage: Flying Acrobatics 110P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Normal Tail Slap 25x2-5P, Ghost Shadow Claw 70P, Bug U-turn 70P
  Special coverage: Psychic Psychic 90S, Ghost Shadow Ball 80S, Fire Burning Jealousy 70S, Grass Grass Knot 60S, Normal Round 60S, Ground Mud Shot 55S

**Throh** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Fighting | BST 465 (120/100/85/30/85/45) | Abilities: Guts / Inner Focus / Mold Breaker
  Engine stats @252 (neutral/positive): Guts: Atk 299/328, SpA 159/174, Spe 189/207 — Inner Focus: Atk 299/328, SpA 159/174, Spe 189/207 — Mold Breaker: Atk 299/328, SpA 159/174, Spe 189/207
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Mega Kick 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Poison Poison Jab 80P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Grass Grass Knot 60S, Normal Hidden Power 60S

**Timburr** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fighting | BST 305 (75/80/55/25/35/35) | Abilities: Guts / Sheer Force / Iron Fist
  Engine stats @252 (neutral/positive): Guts: Atk 259/284, SpA 149/163, Spe 169/185 — Sheer Force: Atk 259/284, SpA 149/163, Spe 169/185 — Iron Fist: Atk 259/284, SpA 149/163, Spe 169/185
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Fire Fire Punch 75P, Ice Ice Punch 75P
  Special coverage: Normal Tera Blast 80S, Grass Grass Knot 60S

**Tinkatink** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fairy/Steel | BST 297 (50/45/45/35/64/58) | Abilities: Mold Breaker / Own Tempo / Pickpocket
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 189/207, SpA 169/185, Spe 215/236 — Own Tempo: Atk 189/207, SpA 169/185, Spe 215/236 — Pickpocket: Atk 189/207, SpA 169/185, Spe 215/236
  Item: **free**
  STAB: Fairy Play Rough 90P · Steel Steel Beam 140S
  Physical coverage: Ice Ice Hammer 100P, Rock Stone Edge 100P, Dark Foul Play 95P, Normal Slam 80P, Bug Skitter Smack 70P, Fighting Rock Smash 40P
  Special coverage: Normal Tera Blast 80S

**Tinkatuff** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fairy/Steel | BST 380 (65/55/55/45/82/78) | Abilities: Mold Breaker / Own Tempo / Pickpocket
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 209/229, SpA 189/207, Spe 255/280 — Own Tempo: Atk 209/229, SpA 189/207, Spe 255/280 — Pickpocket: Atk 209/229, SpA 189/207, Spe 255/280
  Item: **free**
  STAB: Fairy Play Rough 90P · Steel Steel Beam 140S
  Physical coverage: Ice Ice Hammer 100P, Rock Stone Edge 100P, Dark Foul Play 95P, Normal Slam 80P, Fighting Brick Break 75P, Bug Skitter Smack 70P
  Special coverage: Normal Tera Blast 80S

**Tirtouga** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Rock | BST 355 (54/78/103/53/45/22) | Abilities: Solid Rock / Sturdy / Swift Swim
  Engine stats @252 (neutral/positive): Solid Rock: Atk 255/280, SpA 205/225, Spe 143/157 — Sturdy: Atk 255/280, SpA 205/225, Spe 143/157 — Swift Swim: Atk 255/280, SpA 205/225, Spe 143/157
  Item: **free**
  STAB: Water Hydro Pump 120S · Rock Meteor Beam 120 (charge)S
  Physical coverage: Normal Return 102P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P, Psychic Zen Headbutt 80P, Fighting Rock Smash 40P
  Special coverage: Ice Blizzard 120S, Ground Earth Power 90S, Normal Hidden Power 60S

**Toedscool** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground/Grass | BST 335 (40/40/35/50/100/70) | Abilities: Mycelium Might
  Engine stats @252 (neutral/positive): Mycelium Might: Atk 179/196, SpA 199/218, Spe 239/262
  Item: **free**
  STAB: Ground Earth Power 90S · Grass Leaf Storm 140S
  Physical coverage: Dark Foul Play 95P, Bug Lunge 80P, Normal Wrap 25x2-5P
  Special coverage: Poison Sludge Bomb 90S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Ghost Hex 65S, Psychic Mirror Coat fixedS

**Toedscruel** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ground/Grass | BST 515 (80/70/65/80/120/100) | Abilities: Mycelium Might
  Engine stats @252 (neutral/positive): Mycelium Might: Atk 239/262, SpA 259/284, Spe 299/328
  Item: **free**
  STAB: Ground Earth Power 90S · Grass Leaf Storm 140S
  Physical coverage: Dark Foul Play 95P, Bug Lunge 80P, Normal Wrap 25x2-5P
  Special coverage: Poison Sludge Bomb 90S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Ghost Hex 65S, Psychic Mirror Coat fixedS

**Togepi** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fairy | BST 245 (35/20/65/40/65/20) | Abilities: Hustle / Serene Grace / Super Luck
  Engine stats @252 (neutral/positive): Hustle: Atk 208/228, SpA 179/196, Spe 139/152 — Serene Grace: Atk 139/152, SpA 179/196, Spe 139/152 — Super Luck: Atk 139/152, SpA 179/196, Spe 139/152
  Item: **free**
  STAB: Fairy Play Rough 90P
  Physical coverage: Normal Last Resort 140P, Psychic Zen Headbutt 80P, Flying Aerial Ace 60P, Fighting Rock Smash 40P, Dark Fling 30P, Rock Rollout 30P
  Special coverage: Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Zap Cannon 120S, Grass Solar Beam 120 (charge)S, Normal Hyper Voice 90S, Ghost Shadow Ball 80S

**Torchic** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 310 (45/60/40/70/50/45) | Abilities: Blaze / Speed Boost
  Engine stats @252 (neutral/positive): Blaze: Atk 219/240, SpA 239/262, Spe 189/207 — Speed Boost: Atk 219/240, SpA 239/262, Spe 189/207
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Last Resort 140P, Ground Dig 100 (charge)P, Flying Bounce 85 (charge)P, Rock Rock Slide 75P, Dark Night Slash 70P, Ghost Shadow Claw 70P
  Special coverage: Normal Uproar 90S, Ground Mud-Slap 20S

**Torkoal** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fire | BST 470 (70/85/140/85/70/20) | Abilities: White Smoke / Drought / Shell Armor
  Engine stats @252 (neutral/positive): White Smoke: Atk 269/295, SpA 269/295, Spe 139/152 — Drought: Atk 269/295, SpA 269/295, Spe 139/152 — Shell Armor: Atk 269/295, SpA 269/295, Spe 139/152
  Item: **free**
  STAB: Fire Eruption 150S
  Physical coverage: Normal Explosion 250P, Fighting Superpower 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Psychic Zen Headbutt 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Poison Sludge Bomb 90S, Normal Tera Blast 80S, Rock Ancient Power 60S

**Torracat** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 420 (65/85/50/80/50/90) | Abilities: Blaze / Intimidate
  Engine stats @252 (neutral/positive): Blaze: Atk 269/295, SpA 259/284, Spe 279/306 — Intimidate: Atk 269/295, SpA 259/284, Spe 279/306
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Flying Acrobatics 110P, Fighting Double Kick 50x2P, Dark Crunch 80P, Bug Leech Life 80P
  Special coverage: Normal Tera Blast 80S

**Totodile** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 314 (50/65/64/44/48/43) | Abilities: Torrent / Sheer Force
  Engine stats @252 (neutral/positive): Torrent: Atk 229/251, SpA 187/205, Spe 185/203 — Sheer Force: Atk 229/251, SpA 187/205, Spe 185/203
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Dragon Dragon Claw 80P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Rock Ancient Power 60S, Ground Mud-Slap 20S

**Toucannon** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal/Flying | BST 485 (80/120/75/75/75/60) | Abilities: Keen Eye / Skill Link / Sheer Force
  Engine stats @252 (neutral/positive): Keen Eye: Atk 339/372, SpA 249/273, Spe 219/240 — Skill Link: Atk 339/372, SpA 249/273, Spe 219/240 — Sheer Force: Atk 339/372, SpA 249/273, Spe 219/240
  Item: **free**
  STAB: Normal Return 102P · Flying Sky Attack 140 (charge)P
  Physical coverage: Poison Gunk Shot 120P, Grass Seed Bomb 80P, Dark Throat Chop 80P, Rock Rock Blast 25x2-5P, Fighting Brick Break 75P, Fire Temper Flare 75P
  Special coverage: Fire Overheat 140S, Steel Flash Cannon 80S

**Toxel** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric/Poison | BST 242 (40/38/35/54/35/40) | Abilities: Rattled / Static / Klutz
  Engine stats @252 (neutral/positive): Rattled: Atk 175/192, SpA 207/227, Spe 179/196 — Static: Atk 175/192, SpA 207/227, Spe 179/196 — Klutz: Atk 175/192, SpA 207/227, Spe 179/196
  Item: **free**
  STAB: Electric Nuzzle 20P · Poison Belch 120S
  Physical coverage: Normal Facade 70P, Fighting Power-Up Punch 40P
  Special coverage: Normal Tera Blast 80S

**Toxicroak** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Poison/Fighting | BST 490 (83/106/65/86/65/85) | Abilities: Anticipation / Dry Skin / Poison Touch
  Engine stats @252 (neutral/positive): Anticipation: Atk 311/342, SpA 271/298, Spe 269/295 — Dry Skin: Atk 311/342, SpA 271/298, Spe 269/295 — Poison Touch: Atk 311/342, SpA 271/298, Spe 269/295
  Item: **free**
  STAB: Poison Belch 120S · Fighting Focus Punch 150P
  Physical coverage: Normal Mega Kick 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Foul Play 95P, Flying Bounce 85 (charge)P
  Special coverage: Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Mud Bomb 65S, Ice Icy Wind 55S, Water Chilling Water 50S

**Tranquill** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Flying | BST 358 (62/77/62/50/42/65) | Abilities: Big Pecks / Super Luck / Rivalry
  Engine stats @252 (neutral/positive): Big Pecks: Atk 253/278, SpA 199/218, Spe 229/251 — Super Luck: Atk 253/278, SpA 199/218, Spe 229/251 — Rivalry: Atk 253/278, SpA 199/218, Spe 229/251
  Item: **free**
  STAB: Normal Return 102P · Flying Sky Attack 140 (charge)P
  Physical coverage: Dark Night Slash 70P, Steel Steel Wing 70P, Bug U-turn 70P
  Special coverage: Fire Heat Wave 100S

**Trapinch** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground | BST 290 (45/100/45/45/45/10) | Abilities: Hyper Cutter / Arena Trap / Sheer Force
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 299/328, SpA 189/207, Spe 119/130 — Arena Trap: Atk 299/328, SpA 189/207, Spe 119/130 — Sheer Force: Atk 299/328, SpA 189/207, Spe 119/130
  **TRAPPING ABILITY: Arena Trap** (optional — one of 3)
  Item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Rock Stone Edge 100P, Bug First Impression 90P, Dark Crunch 80P, Ghost Astonish 30P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Tera Blast 80S, Bug Signal Beam 75S, Flying Gust 40S

**Treecko** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 310 (40/45/35/65/55/70) | Abilities: Overgrow / Unburden
  Engine stats @252 (neutral/positive): Overgrow: Atk 189/207, SpA 229/251, Spe 239/262 — Unburden: Atk 189/207, SpA 229/251, Spe 239/262
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Crunch 80P
  Special coverage: Normal Tera Blast 80S, Dragon Dragon Breath 60S, Ground Mud-Slap 20S

**Trevenant** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Ghost/Grass | BST 474 (85/110/76/65/82/56) | Abilities: Natural Cure / Frisk / Harvest
  Engine stats @252 (neutral/positive): Natural Cure: Atk 319/350, SpA 229/251, Spe 211/232 — Frisk: Atk 319/350, SpA 229/251, Spe 211/232 — Harvest: Atk 319/350, SpA 229/251, Spe 211/232
  Item: **free**
  STAB: Ghost Poltergeist 110P · Grass Wood Hammer 120P
  Physical coverage: Normal Return 102P, Ground Earthquake 100P, Dark Foul Play 95P, Poison Poison Jab 80P, Bug X-Scissor 80P, Fighting Drain Punch 75P
  Special coverage: Fighting Focus Blast 120S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Fire Burning Jealousy 70S

**Tropius** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass/Flying | BST 460 (99/68/83/72/87/51) | Abilities: Chlorophyll / Solar Power / Harvest
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 235/258, SpA 243/267, Spe 201/221 — Solar Power: Atk 235/258, SpA 243/267, Spe 201/221 — Harvest: Atk 235/258, SpA 243/267, Spe 201/221
  Item: **free**
  STAB: Grass Leaf Storm 140S · Flying Hurricane 120S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Fighting Body Press 80P, Psychic Zen Headbutt 80P, Steel Steel Wing 70P
  Special coverage: Dragon Dragon Pulse 90S, Normal Tera Blast 80S, Ghost Ominous Wind 60S, Bug Silver Wind 60S, Ground Mud-Slap 20S

**Trubbish** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison | BST 329 (50/50/62/40/62/65) | Abilities: Stench / Sticky Hold / Aftermath
  Engine stats @252 (neutral/positive): Stench: Atk 199/218, SpA 179/196, Spe 229/251 — Sticky Hold: Atk 199/218, SpA 179/196, Spe 229/251 — Aftermath: Atk 199/218, SpA 179/196, Spe 229/251
  Item: **free**
  STAB: Poison Belch 120S
  Physical coverage: Normal Explosion 250P, Grass Seed Bomb 80P, Rock Rock Blast 25x2-5P, Fighting Drain Punch 75P, Dark Thief 60P
  Special coverage: Dark Dark Pulse 80S, Grass Giga Drain 75S, Normal Hidden Power 60S, Bug Infestation 20S

**Trumbeak** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Flying | BST 355 (55/85/50/40/50/75) | Abilities: Keen Eye / Skill Link / Pickup
  Engine stats @252 (neutral/positive): Keen Eye: Atk 269/295, SpA 179/196, Spe 249/273 — Skill Link: Atk 269/295, SpA 179/196, Spe 249/273 — Pickup: Atk 269/295, SpA 179/196, Spe 249/273
  Item: **free**
  STAB: Normal Return 102P · Flying Sky Attack 140 (charge)P
  Physical coverage: Poison Gunk Shot 120P, Grass Bullet Seed 25x2-5P, Rock Rock Blast 25x2-5P, Fighting Brick Break 75P, Steel Steel Wing 70P, Bug U-turn 70P
  Special coverage: Fire Heat Wave 100S

**Turtwig** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass | BST 318 (55/68/64/45/55/31) | Abilities: Overgrow / Shell Armor
  Engine stats @252 (neutral/positive): Overgrow: Atk 235/258, SpA 189/207, Spe 161/177 — Shell Armor: Atk 235/258, SpA 189/207, Spe 161/177
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Steel Iron Tail 100P, Dark Crunch 80P, Psychic Zen Headbutt 80P, Ground Bulldoze 60P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S

**Tympole** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 294 (50/50/40/50/40/64) | Abilities: Swift Swim / Hydration / Water Absorb
  Engine stats @252 (neutral/positive): Swift Swim: Atk 199/218, SpA 199/218, Spe 227/249 — Hydration: Atk 199/218, SpA 199/218, Spe 227/249 — Water Absorb: Atk 199/218, SpA 199/218, Spe 227/249
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Return 102P, Flying Bounce 85 (charge)P
  Special coverage: Poison Sludge Wave 95S, Ground Earth Power 90S, Normal Hyper Voice 90S, Ice Icy Wind 55S, Bug Infestation 20S

**Tynamo** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric | BST 275 (35/55/40/45/40/60) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 209/229, SpA 189/207, Spe 219/240
  Item: **free**
  STAB: Electric Spark 65P
  Physical coverage: Dark Knock Off 65P, Normal Tackle 50P
  Special coverage: Normal Tera Blast 80S

**Typhlosion** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Fire | BST 534 (78/84/78/109/85/100) | Abilities: Blaze / Flash Fire
  Engine stats @252 (neutral/positive): Blaze: Atk 267/293, SpA 317/348, Spe 299/328 — Flash Fire: Atk 267/293, SpA 317/348, Spe 299/328
  Item: **free**
  STAB: Fire Eruption 150S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fairy Play Rough 90P, Electric Wild Charge 90P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Scorching Sands 70S

**Tyrogue** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fighting | BST 210 (35/35/35/35/35/35) | Abilities: Guts / Steadfast / Vital Spirit
  Engine stats @252 (neutral/positive): Guts: Atk 169/185, SpA 169/185, Spe 169/185 — Steadfast: Atk 169/185, SpA 169/185, Spe 169/185 — Vital Spirit: Atk 169/185, SpA 169/185, Spe 169/185
  Item: **free**
  STAB: Fighting High Jump Kick 130P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Rock Rock Slide 75P, Dark Thief 60P, Steel Bullet Punch 40P
  Special coverage: Normal Uproar 90S, Ground Mud-Slap 20S

**Tyrunt** — species, **ZU**, source: imported (redgpt-zu-floor)
  Rock/Dragon | BST 362 (58/89/77/45/45/48) | Abilities: Strong Jaw / Sturdy
  Engine stats @252 (neutral/positive): Strong Jaw: Atk 277/304, SpA 189/207, Spe 195/214 — Sturdy: Atk 277/304, SpA 189/207, Spe 195/214
  Item: **free**
  STAB: Rock Stone Edge 100P · Dragon Outrage 120P
  Physical coverage: Fighting Close Combat 120P, Normal Thrash 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P
  Special coverage: Ground Earth Power 90S, Normal Hyper Voice 90S, Dark Dark Pulse 80S

**Unfezant** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Normal/Flying | BST 488 (80/115/80/65/55/93) | Abilities: Big Pecks / Super Luck / Rivalry
  Engine stats @252 (neutral/positive): Big Pecks: Atk 329/361, SpA 229/251, Spe 285/313 — Super Luck: Atk 329/361, SpA 229/251, Spe 285/313 — Rivalry: Atk 329/361, SpA 229/251, Spe 285/313
  Item: **free**
  STAB: Normal Return 102P · Flying Sky Attack 140 (charge)P
  Physical coverage: Dark Night Slash 70P, Steel Steel Wing 70P, Bug U-turn 70P
  Special coverage: Fire Heat Wave 100S

**Unown** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Psychic | BST 336 (48/72/48/72/48/48) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 243/267, SpA 243/267, Spe 195/214
  Item: **free**
  STAB: **none**
  Physical coverage: **none**
  Special coverage: Normal Hidden Power 60S

**Vanillish** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ice | BST 395 (51/65/65/80/75/59) | Abilities: Ice Body / Snow Cloak / Weak Armor
  Engine stats @252 (neutral/positive): Ice Body: Atk 229/251, SpA 259/284, Spe 217/238 — Snow Cloak: Atk 229/251, SpA 259/284, Spe 217/238 — Weak Armor: Atk 229/251, SpA 259/284, Spe 217/238
  Item: **free**
  STAB: Ice Blizzard 120S
  Physical coverage: Normal Explosion 250P, Ghost Astonish 30P
  Special coverage: Normal Hyper Voice 90S, Steel Flash Cannon 80S, Bug Signal Beam 75S, Water Water Pulse 60S, Psychic Mirror Coat fixedS

**Vanillite** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ice | BST 305 (36/50/50/65/60/44) | Abilities: Ice Body / Snow Cloak / Weak Armor
  Engine stats @252 (neutral/positive): Ice Body: Atk 199/218, SpA 229/251, Spe 187/205 — Snow Cloak: Atk 199/218, SpA 229/251, Spe 187/205 — Weak Armor: Atk 199/218, SpA 229/251, Spe 187/205
  Item: **free**
  STAB: Ice Blizzard 120S
  Physical coverage: Normal Explosion 250P, Ghost Astonish 30P
  Special coverage: Normal Hyper Voice 90S, Steel Flash Cannon 80S, Bug Signal Beam 75S, Water Water Pulse 60S, Psychic Mirror Coat fixedS

**Varoom** — species, **ZU**, source: imported (redgpt-zu-floor)
  Steel/Poison | BST 300 (45/70/63/30/45/47) | Abilities: Overcoat / Slow Start
  Engine stats @252 (neutral/positive): Overcoat: Atk 239/262, SpA 159/174, Spe 193/212 — Slow Start: Atk 119/131, SpA 159/174, Spe 96/106
  Item: **free**
  STAB: Steel Spin Out 100P · Poison Gunk Shot 120P
  Physical coverage: Normal Self-Destruct 200P, Psychic Zen Headbutt 80P, Dark Assurance 60P, Ground Bulldoze 60P, Ghost Lick 30P
  Special coverage: Normal Uproar 90S

**Veluza** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Water/Psychic | BST 478 (90/102/73/78/65/70) | Abilities: Mold Breaker / Sharpness
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 303/333, SpA 255/280, Spe 239/262 — Sharpness: Atk 303/333, SpA 255/280, Spe 239/262
  Item: **free**
  STAB: Water Hydro Pump 120S · Psychic Psychic 90S
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Ground Drill Run 80P, Dragon Scale Shot 25x2-5P, Ice Ice Fang 65P, Flying Pluck 60P
  Special coverage: Ice Blizzard 120S, Normal Tera Blast 80S, Fighting Final Gambit fixedS

**Venipede** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Poison | BST 260 (30/45/59/30/39/57) | Abilities: Poison Point / Swarm / Speed Boost / Quick Feet
  Engine stats @252 (neutral/positive): Poison Point: Atk 189/207, SpA 159/174, Spe 213/234 — Swarm: Atk 189/207, SpA 159/174, Spe 213/234 — Speed Boost: Atk 189/207, SpA 159/174, Spe 213/234 — Quick Feet: Atk 189/207, SpA 159/174, Spe 213/234
  Item: **free**
  STAB: Bug Twineedle 50x2P · Poison Sludge Bomb 90S
  Physical coverage: Steel Steel Roller 130P, Normal Double-Edge 120P, Dark Bite 60P, Fighting Rock Smash 40P, Rock Rollout 30P
  Special coverage: Grass Solar Beam 120 (charge)S, Ghost Hex 65S, Normal Hidden Power 60S

**Venonat** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Poison | BST 305 (60/55/50/40/55/45) | Abilities: Compound Eyes / Tinted Lens / Run Away
  Engine stats @252 (neutral/positive): Compound Eyes: Atk 209/229, SpA 179/196, Spe 189/207 — Tinted Lens: Atk 209/229, SpA 179/196, Spe 189/207 — Run Away: Atk 209/229, SpA 179/196, Spe 189/207
  Item: **free**
  STAB: Bug Bug Buzz 90S · Poison Sludge Bomb 90S
  Physical coverage: Normal Double-Edge 120P, Psychic Zen Headbutt 80P, Dark Thief 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Psychic 90S, Normal Tera Blast 80S, Ghost Night Shade fixedS

**Venusaur** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass/Poison | BST 525 (80/82/83/100/100/80) | Abilities: Overgrow / Chlorophyll
  Engine stats @252 (neutral/positive): Overgrow: Atk 263/289, SpA 299/328, Spe 259/284 — Chlorophyll: Atk 263/289, SpA 299/328, Spe 259/284
  Item: **free**
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Skull Bash 130P, Dragon Outrage 120P, Ground Earthquake 100P, Dark Knock Off 65P, Bug Fury Cutter 40P, Fighting Rock Smash 40P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S

**Vespiquen** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Bug/Flying | BST 474 (70/80/102/80/102/40) | Abilities: Pressure / Unnerve
  Engine stats @252 (neutral/positive): Pressure: Atk 259/284, SpA 259/284, Spe 179/196 — Unnerve: Atk 259/284, SpA 259/284, Spe 179/196
  Item: **free**
  STAB: Bug Attack Order 90P · Flying Hurricane 120S
  Physical coverage: Normal Return 102P, Poison Cross Poison 70P, Dark Assurance 60P, Fighting Revenge 60P
  Special coverage: Poison Sludge Bomb 90S, Normal Uproar 90S, Rock Power Gem 80S, Psychic Psychic Noise 75S, Ghost Hex 65S, Ground Mud-Slap 20S

**Vibrava** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground/Dragon | BST 340 (50/70/50/50/50/70) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 239/262, SpA 199/218, Spe 239/262
  Item: **free**
  STAB: Ground Earthquake 100P · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Flying Dual Wingbeat 50x2P, Rock Stone Edge 100P, Bug First Impression 90P, Dark Crunch 80P
  Special coverage: Normal Boomburst 140S, Grass Solar Beam 120 (charge)S, Fire Heat Wave 100S, Bug Bug Buzz 90S, Flying Air Slash 75S, Ghost Ominous Wind 60S

**Victreebel** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass/Poison | BST 490 (80/105/65/100/70/70) | Abilities: Chlorophyll / Gluttony
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 309/339, SpA 299/328, Spe 239/262 — Gluttony: Atk 309/339, SpA 299/328, Spe 239/262
  Item: **free**
  STAB: Grass Leaf Storm 140S · Poison Belch 120S
  Physical coverage: Normal Double-Edge 120P, Bug Leech Life 80P, Dark Sucker Punch 80P
  Special coverage: Normal Wring Out 120S, Bug Infestation 20S

**Vigoroth** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 440 (80/80/80/55/55/90) | Abilities: Vital Spirit
  Engine stats @252 (neutral/positive): Vital Spirit: Atk 259/284, SpA 209/229, Spe 279/306
  Item: **free**
  STAB: Normal Double-Edge 120P
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Dragon Outrage 120P, Ground Earthquake 100P, Fairy Play Rough 90P, Grass Seed Bomb 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S

**Vikavolt** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Bug/Electric | BST 500 (77/70/90/145/75/43) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 239/262, SpA 389/427, Spe 185/203
  Item: **free**
  STAB: Bug Bug Buzz 90S · Electric Thunder 120S
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Ground Dig 100 (charge)P, Dark Crunch 80P, Poison Poison Jab 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Flying Air Slash 75S, Ground Mud Shot 55S

**Vivillon** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Bug/Flying | BST 411 (80/52/50/90/50/89) | Abilities: Shield Dust / Compound Eyes / Friend Guard
  Engine stats @252 (neutral/positive): Shield Dust: Atk 203/223, SpA 279/306, Spe 277/304 — Compound Eyes: Atk 203/223, SpA 279/306, Spe 277/304 — Friend Guard: Atk 203/223, SpA 279/306, Spe 277/304
  Item: **free**
  STAB: Bug Bug Buzz 90S · Flying Hurricane 120S
  Physical coverage: Normal Return 102P, Dark Thief 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Tera Blast 80S, Electric Electroweb 55S, Fairy Draining Kiss 50S

**Volbeat** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Bug | BST 430 (65/73/75/47/85/85) | Abilities: Illuminate / Swarm / Prankster
  Engine stats @252 (neutral/positive): Illuminate: Atk 245/269, SpA 193/212, Spe 269/295 — Swarm: Atk 245/269, SpA 193/212, Spe 269/295 — Prankster: Atk 245/269, SpA 193/212, Spe 269/295
  Item: **free**
  STAB: Bug Bug Buzz 90S
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Flying Acrobatics 110P, Fairy Play Rough 90P, Psychic Zen Headbutt 80P, Ice Ice Punch 75P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Flying Air Slash 75S

**Voltorb** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric | BST 330 (40/30/50/55/55/100) | Abilities: Soundproof / Static / Aftermath
  Engine stats @252 (neutral/positive): Soundproof: Atk 159/174, SpA 209/229, Spe 299/328 — Static: Atk 159/174, SpA 209/229, Spe 299/328 — Aftermath: Atk 159/174, SpA 209/229, Spe 299/328
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Explosion 250P, Dark Foul Play 95P, Rock Rollout 30P, Steel Gyro Ball 16P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S, Psychic Mirror Coat fixedS

**Voltorb-Hisui** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric/Grass | BST 330 (40/30/50/55/55/100) | Abilities: Soundproof / Static / Aftermath
  Engine stats @252 (neutral/positive): Soundproof: Atk 159/174, SpA 209/229, Spe 299/328 — Static: Atk 159/174, SpA 209/229, Spe 299/328 — Aftermath: Atk 159/174, SpA 209/229, Spe 299/328
  Item: **free**
  STAB: Electric Thunder 120S · Grass Leaf Storm 140S
  Physical coverage: Normal Explosion 250P, Dark Foul Play 95P, Rock Rollout 30P, Steel Gyro Ball 16P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S, Psychic Mirror Coat fixedS

**Vulpix** — species, **ZU**, source: imported (redgpt-zu-floor)
  Fire | BST 299 (38/41/40/50/65/65) | Abilities: Flash Fire / Drought
  Engine stats @252 (neutral/positive): Flash Fire: Atk 181/199, SpA 199/218, Spe 229/251 — Drought: Atk 181/199, SpA 199/218, Spe 229/251
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Skull Bash 130P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Psychic Zen Headbutt 80P
  Special coverage: Grass Energy Ball 90S, Dark Dark Pulse 80S, Psychic Extrasensory 80S, Normal Tera Blast 80S, Ghost Hex 65S

**Vulpix-Alola** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ice | BST 299 (38/41/40/50/65/65) | Abilities: Snow Cloak / Snow Warning
  Engine stats @252 (neutral/positive): Snow Cloak: Atk 181/199, SpA 199/218, Spe 229/251 — Snow Warning: Atk 181/199, SpA 199/218, Spe 229/251
  Item: **free**
  STAB: Ice Blizzard 120S
  Physical coverage: Normal Skull Bash 130P, Fire Flare Blitz 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Water Aqua Tail 90P
  Special coverage: Fire Overheat 140S, Fairy Moonblast 95S, Grass Energy Ball 90S, Dark Dark Pulse 80S, Psychic Extrasensory 80S, Normal Tera Blast 80S

**Wailmer** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 400 (130/70/35/70/35/60) | Abilities: Water Veil / Oblivious / Pressure
  Engine stats @252 (neutral/positive): Water Veil: Atk 239/262, SpA 239/262, Spe 219/240 — Oblivious: Atk 239/262, SpA 239/262, Spe 219/240 — Pressure: Atk 239/262, SpA 239/262, Spe 219/240
  Item: **free**
  STAB: Water Water Spout 150S
  Physical coverage: Normal Self-Destruct 200P, Steel Steel Roller 130P, Ground Earthquake 100P, Flying Bounce 85 (charge)P, Fighting Body Press 80P, Psychic Zen Headbutt 80P
  Special coverage: Ice Blizzard 120S, Normal Hyper Voice 90S, Poison Clear Smog 50S

**Wailord** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Water | BST 500 (170/90/45/90/45/60) | Abilities: Water Veil / Oblivious / Pressure
  Engine stats @252 (neutral/positive): Water Veil: Atk 279/306, SpA 279/306, Spe 219/240 — Oblivious: Atk 279/306, SpA 279/306, Spe 219/240 — Pressure: Atk 279/306, SpA 279/306, Spe 219/240
  Item: **free**
  STAB: Water Water Spout 150S
  Physical coverage: Normal Self-Destruct 200P, Steel Steel Roller 130P, Ground Earthquake 100P, Flying Bounce 85 (charge)P, Fighting Body Press 80P, Psychic Zen Headbutt 80P
  Special coverage: Ice Blizzard 120S, Normal Hyper Voice 90S, Poison Clear Smog 50S

**Walrein** — species, **ZU**, source: imported (natdex-RU refined by gen8)
  Ice/Water | BST 530 (110/80/90/95/90/65) | Abilities: Thick Fat / Ice Body / Oblivious
  Engine stats @252 (neutral/positive): Thick Fat: Atk 259/284, SpA 289/317, Spe 229/251 — Ice Body: Atk 259/284, SpA 289/317, Spe 229/251 — Oblivious: Atk 259/284, SpA 289/317, Spe 229/251
  Item: **free**
  STAB: Ice Blizzard 120S · Water Hydro Pump 120S
  Physical coverage: Steel Steel Roller 130P, Normal Double-Edge 120P, Ground Earthquake 100P, Fighting Body Press 80P, Dark Crunch 80P, Rock Rock Slide 75P
  Special coverage: Bug Signal Beam 75S, Normal Hidden Power 60S, Ground Mud-Slap 20S

**Wartortle** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 405 (59/63/80/65/80/58) | Abilities: Torrent / Rain Dish
  Engine stats @252 (neutral/positive): Torrent: Atk 225/247, SpA 229/251, Spe 215/236 — Rain Dish: Atk 225/247, SpA 229/251, Spe 215/236
  Item: **free**
  STAB: Water Water Spout 150S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fighting Aura Sphere 90S, Dragon Dragon Pulse 90S, Normal Tera Blast 80S, Ground Mud Shot 55S, Psychic Confusion 50S

**Watchog** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Normal | BST 420 (60/85/69/60/69/77) | Abilities: Illuminate / Keen Eye / Analytic
  Engine stats @252 (neutral/positive): Illuminate: Atk 269/295, SpA 219/240, Spe 253/278 — Keen Eye: Atk 269/295, SpA 219/240, Spe 253/278 — Analytic: Atk 269/295, SpA 219/240, Spe 253/278
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Water Aqua Tail 90P, Dark Crunch 80P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Psychic Dream Eater 100S, Fire Flamethrower 95S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Wattrel** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric/Flying | BST 280 (40/40/35/55/40/70) | Abilities: Wind Power / Volt Absorb / Competitive
  Engine stats @252 (neutral/positive): Wind Power: Atk 179/196, SpA 209/229, Spe 239/262 — Volt Absorb: Atk 179/196, SpA 209/229, Spe 239/262 — Competitive: Atk 179/196, SpA 209/229, Spe 239/262
  Item: **free**
  STAB: Electric Thunder 120S · Flying Brave Bird 120P
  Physical coverage: Normal Take Down 90P, Bug U-turn 70P
  Special coverage: Normal Uproar 90S

**Weedle** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Poison | BST 195 (40/35/30/20/20/50) | Abilities: Shield Dust / Run Away
  Engine stats @252 (neutral/positive): Shield Dust: Atk 169/185, SpA 139/152, Spe 199/218 — Run Away: Atk 169/185, SpA 139/152, Spe 199/218
  Item: **free**
  STAB: Bug Bug Bite 60P · Poison Poison Sting 15P
  Physical coverage: **none**
  Special coverage: Electric Electroweb 55S

**Weepinbell** — species, **ZU**, source: imported (redgpt-zu-floor)
  Grass/Poison | BST 390 (65/90/50/85/45/55) | Abilities: Chlorophyll / Gluttony
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 279/306, SpA 269/295, Spe 209/229 — Gluttony: Atk 279/306, SpA 269/295, Spe 209/229
  Item: **free**
  STAB: Grass Leaf Storm 140S · Poison Belch 120S
  Physical coverage: Normal Double-Edge 120P, Bug Leech Life 80P, Dark Sucker Punch 80P
  Special coverage: Normal Wring Out 120S, Bug Infestation 20S

**Weezing** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Poison | BST 490 (65/90/120/85/70/60) | Abilities: Levitate / Neutralizing Gas / Stench
  Engine stats @252 (neutral/positive): Levitate: Atk 279/306, SpA 269/295, Spe 219/240 — Neutralizing Gas: Atk 279/306, SpA 269/295, Spe 219/240 — Stench: Atk 279/306, SpA 269/295, Spe 219/240
  Item: **free**
  STAB: Poison Belch 120S
  Physical coverage: Normal Explosion 250P, Dark Assurance 60P, Rock Rollout 30P, Steel Gyro Ball 24P
  Special coverage: Fire Fire Blast 120S, Electric Thunder 120S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Psychic Psybeam 65S

**Whimsicott** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Grass/Fairy | BST 480 (60/67/85/77/75/116) | Abilities: Prankster / Infiltrator / Chlorophyll
  Engine stats @252 (neutral/positive): Prankster: Atk 233/256, SpA 253/278, Spe 331/364 — Infiltrator: Atk 233/256, SpA 253/278, Spe 331/364 — Chlorophyll: Atk 233/256, SpA 253/278, Spe 331/364
  Item: **free**
  STAB: Grass Solar Beam 120 (charge)S · Fairy Moonblast 95S
  Physical coverage: Normal Return 102P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Flying Hurricane 120S, Psychic Dream Eater 100S, Ghost Shadow Ball 80S, Normal Tera Blast 80S

**Whirlipede** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Poison | BST 360 (40/55/99/40/79/47) | Abilities: Poison Point / Swarm / Speed Boost / Quick Feet
  Engine stats @252 (neutral/positive): Poison Point: Atk 209/229, SpA 179/196, Spe 193/212 — Swarm: Atk 209/229, SpA 179/196, Spe 193/212 — Speed Boost: Atk 209/229, SpA 179/196, Spe 193/212 — Quick Feet: Atk 209/229, SpA 179/196, Spe 193/212
  Item: **free**
  STAB: Bug Twineedle 50x2P · Poison Sludge Bomb 90S
  Physical coverage: Steel Steel Roller 130P, Normal Double-Edge 120P, Dark Bite 60P, Fighting Rock Smash 40P, Rock Rollout 30P
  Special coverage: Grass Solar Beam 120 (charge)S, Ghost Hex 65S, Normal Hidden Power 60S

**Whiscash** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Water/Ground | BST 468 (110/78/73/76/71/60) | Abilities: Oblivious / Anticipation / Hydration
  Engine stats @252 (neutral/positive): Oblivious: Atk 255/280, SpA 251/276, Spe 219/240 — Anticipation: Atk 255/280, SpA 251/276, Spe 219/240 — Hydration: Atk 255/280, SpA 251/276, Spe 219/240
  Item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Rock Stone Edge 100P, Flying Bounce 85 (charge)P, Psychic Zen Headbutt 80P, Electric Spark 65P
  Special coverage: Poison Belch 120S, Ice Blizzard 120S, Psychic Future Sight 120S, Normal Uproar 90S

**Whismur** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 240 (64/51/23/51/23/28) | Abilities: Soundproof / Rattled
  Engine stats @252 (neutral/positive): Soundproof: Atk 201/221, SpA 201/221, Spe 155/170 — Rattled: Atk 201/221, SpA 201/221, Spe 155/170
  Item: **free**
  STAB: Normal Double-Edge 120P
  Physical coverage: Fighting Dynamic Punch 100P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Ghost Astonish 30P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Synchronoise 120S, Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S, Electric Shock Wave 60S

**Wigglytuff** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal/Fairy | BST 435 (140/70/45/85/50/45) | Abilities: Cute Charm / Competitive / Frisk
  Engine stats @252 (neutral/positive): Cute Charm: Atk 239/262, SpA 269/295, Spe 189/207 — Competitive: Atk 239/262, SpA 269/295, Spe 189/207 — Frisk: Atk 239/262, SpA 269/295, Spe 189/207
  Item: **free**
  STAB: Normal Self-Destruct 200P · Fairy Misty Explosion 100S
  Physical coverage: Fighting Focus Punch 150P, Steel Steel Roller 130P, Ground Dig 100 (charge)P, Electric Wild Charge 90P, Flying Bounce 85 (charge)P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S

**Wiglett** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water | BST 245 (10/55/25/35/25/95) | Abilities: Gooey / Rattled / Sand Veil
  Engine stats @252 (neutral/positive): Gooey: Atk 209/229, SpA 169/185, Spe 289/317 — Rattled: Atk 209/229, SpA 169/185, Spe 289/317 — Sand Veil: Atk 209/229, SpA 169/185, Spe 289/317
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Ground Dig 100 (charge)P, Dark Foul Play 95P, Normal Take Down 90P
  Special coverage: Ice Blizzard 120S, Ground Earth Power 90S, Normal Tera Blast 80S, Fighting Final Gambit fixedS

**Wimpod** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Water | BST 230 (25/35/40/20/30/80) | Abilities: Wimp Out
  Engine stats @252 (neutral/positive): Wimp Out: Atk 169/185, SpA 139/152, Spe 259/284
  Item: **free**
  STAB: Bug Bug Buzz 90S · Water Surf 95S
  Physical coverage: Normal Return 102P, Dark Assurance 60P, Steel Metal Claw 50P, Rock Rollout 30P
  Special coverage: Normal Hidden Power 60S, Ground Mud Shot 55S

**Wingull** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Flying | BST 270 (40/30/30/55/30/85) | Abilities: Keen Eye / Hydration / Rain Dish
  Engine stats @252 (neutral/positive): Keen Eye: Atk 159/174, SpA 209/229, Spe 269/295 — Hydration: Atk 159/174, SpA 209/229, Spe 269/295 — Rain Dish: Atk 159/174, SpA 209/229, Spe 269/295
  Item: **free**
  STAB: Water Hydro Pump 120S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Ghost Ominous Wind 60S, Electric Shock Wave 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Woobat** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic/Flying | BST 323 (65/45/43/55/43/72) | Abilities: Unaware / Klutz / Simple
  Engine stats @252 (neutral/positive): Unaware: Atk 189/207, SpA 209/229, Spe 243/267 — Klutz: Atk 189/207, SpA 209/229, Spe 243/267 — Simple: Atk 189/207, SpA 209/229, Spe 243/267
  Item: **free**
  STAB: Psychic Future Sight 120S · Flying Acrobatics 110P
  Physical coverage: Normal Return 102P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Fire Heat Wave 100S, Grass Energy Ball 90S, Normal Uproar 90S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Electric Shock Wave 60S

**Wooloo** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 270 (42/40/55/40/45/48) | Abilities: Fluffy / Run Away / Bulletproof
  Engine stats @252 (neutral/positive): Fluffy: Atk 179/196, SpA 179/196, Spe 195/214 — Run Away: Atk 179/196, SpA 179/196, Spe 195/214 — Bulletproof: Atk 179/196, SpA 179/196, Spe 195/214
  Item: **free**
  STAB: Normal Double-Edge 120P
  Physical coverage: Fighting Double Kick 50x2P, Electric Wild Charge 90P, Grass Grassy Glide 70P, Dark Payback 50P
  Special coverage: Electric Electro Ball 40S

**Wooper** — species, **ZU**, source: imported (redgpt-zu-floor)
  Water/Ground | BST 210 (55/45/45/25/25/15) | Abilities: Damp / Water Absorb / Unaware
  Engine stats @252 (neutral/positive): Damp: Atk 189/207, SpA 149/163, Spe 129/141 — Water Absorb: Atk 189/207, SpA 149/163, Spe 129/141 — Unaware: Atk 189/207, SpA 149/163, Spe 129/141
  Item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ice Ice Punch 75P, Grass Trailblaze 50P
  Special coverage: Ice Blizzard 120S, Poison Sludge Wave 95S, Normal Tera Blast 80S, Rock Ancient Power 60S, Bug Infestation 20S

**Wooper-Paldea** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison/Ground | BST 210 (55/45/45/25/25/15) | Abilities: Poison Point / Water Absorb / Unaware
  Engine stats @252 (neutral/positive): Poison Point: Atk 189/207, SpA 149/163, Spe 129/141 — Water Absorb: Atk 189/207, SpA 149/163, Spe 129/141 — Unaware: Atk 189/207, SpA 149/163, Spe 129/141
  Item: **free**
  STAB: Poison Gunk Shot 120P · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P, Ice Ice Punch 75P
  Special coverage: Ice Blizzard 120S, Water Hydro Pump 120S, Normal Tera Blast 80S, Rock Ancient Power 60S, Bug Infestation 20S

**Wormadam** — species, **ZU**, source: imported (natdex-RU refined by gen7)
  Bug/Grass | BST 424 (60/59/85/79/105/36) | Abilities: Anticipation / Overcoat
  Engine stats @252 (neutral/positive): Anticipation: Atk 217/238, SpA 257/282, Spe 171/188 — Overcoat: Atk 217/238, SpA 257/282, Spe 171/188
  Item: **free**
  STAB: Bug Bug Buzz 90S · Grass Leaf Storm 140S
  Physical coverage: Normal Return 102P, Dark Sucker Punch 80P
  Special coverage: Psychic Dream Eater 100S, Normal Uproar 90S, Ghost Shadow Ball 80S, Poison Venoshock 65S, Electric Electroweb 55S

**Wugtrio** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Water | BST 425 (35/100/50/50/70/120) | Abilities: Gooey / Rattled / Sand Veil
  Engine stats @252 (neutral/positive): Gooey: Atk 299/328, SpA 199/218, Spe 339/372 — Rattled: Atk 299/328, SpA 199/218, Spe 339/372 — Sand Veil: Atk 299/328, SpA 199/218, Spe 339/372
  Item: **free**
  STAB: Water Triple Dive 30x3P
  Physical coverage: Ground Dig 100 (charge)P, Dark Foul Play 95P, Normal Take Down 90P
  Special coverage: Ice Blizzard 120S, Ground Earth Power 90S, Normal Tera Blast 80S, Fighting Final Gambit fixedS

**Wurmple** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug | BST 195 (45/45/35/20/30/20) | Abilities: Shield Dust / Run Away
  Engine stats @252 (neutral/positive): Shield Dust: Atk 189/207, SpA 139/152, Spe 139/152 — Run Away: Atk 189/207, SpA 139/152, Spe 139/152
  Item: **free**
  STAB: Bug Bug Bite 60P
  Physical coverage: Normal Tackle 50P, Poison Poison Sting 15P
  Special coverage: Electric Electroweb 55S, Normal Snore 50S

**Wynaut** — species, **ZU**, source: imported (redgpt-zu-floor)
  Psychic | BST 260 (95/23/48/23/48/23) | Abilities: Shadow Tag / Telepathy
  Engine stats @252 (neutral/positive): Shadow Tag: Atk 145/159, SpA 145/159, Spe 145/159 — Telepathy: Atk 145/159, SpA 145/159, Spe 145/159
  **TRAPPING ABILITY: Shadow Tag** (optional — one of 2)
  Item: **free**
  STAB: Psychic Mirror Coat fixedS
  Physical coverage: Fighting Counter fixedP
  Special coverage: **none**

**Wyrdeer** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal/Psychic | BST 525 (103/105/72/105/75/65) | Abilities: Intimidate / Frisk / Sap Sipper
  Engine stats @252 (neutral/positive): Intimidate: Atk 309/339, SpA 309/339, Spe 229/251 — Frisk: Atk 309/339, SpA 309/339, Spe 229/251 — Sap Sipper: Atk 309/339, SpA 309/339, Spe 229/251
  Item: **free**
  STAB: Normal Last Resort 140P · Psychic Future Sight 120S
  Physical coverage: Bug Megahorn 120P, Fighting Double Kick 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Electric Wild Charge 90P, Flying Bounce 85 (charge)P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Yamask** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ghost | BST 303 (38/30/85/55/65/30) | Abilities: Mummy
  Engine stats @252 (neutral/positive): Mummy: Atk 159/174, SpA 209/229, Spe 159/174
  Item: **free**
  STAB: Ghost Poltergeist 110P
  Physical coverage: Normal Return 102P, Psychic Zen Headbutt 80P, Dark Knock Off 65P
  Special coverage: Psychic Dream Eater 100S, Grass Energy Ball 90S, Dark Dark Pulse 80S, Normal Hidden Power 60S, Electric Shock Wave 60S, Bug Infestation 20S

**Yamask-Galar** — species, **ZU**, source: imported (redgpt-zu-floor)
  Ground/Ghost | BST 303 (38/55/85/30/65/30) | Abilities: Wandering Spirit
  Engine stats @252 (neutral/positive): Wandering Spirit: Atk 209/229, SpA 159/174, Spe 159/174
  Item: **free**
  STAB: Ground Earthquake 100P · Ghost Poltergeist 110P
  Physical coverage: Normal Return 102P, Psychic Zen Headbutt 80P, Rock Rock Slide 75P, Dark Knock Off 65P
  Special coverage: Psychic Dream Eater 100S, Grass Energy Ball 90S, Dark Dark Pulse 80S, Normal Hidden Power 60S, Electric Shock Wave 60S, Bug Infestation 20S

**Yamper** — species, **ZU**, source: imported (redgpt-zu-floor)
  Electric | BST 270 (59/45/50/40/50/26) | Abilities: Ball Fetch / Rattled
  Engine stats @252 (neutral/positive): Ball Fetch: Atk 189/207, SpA 179/196, Spe 151/166 — Rattled: Atk 189/207, SpA 179/196, Spe 151/166
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Dark Crunch 80P, Fire Fire Fang 65P
  Special coverage: Normal Uproar 90S, Dark Snarl 55S

**Yanma** — species, **ZU**, source: imported (redgpt-zu-floor)
  Bug/Flying | BST 390 (65/65/45/75/45/95) | Abilities: Speed Boost / Compound Eyes / Frisk
  Engine stats @252 (neutral/positive): Speed Boost: Atk 229/251, SpA 249/273, Spe 289/317 — Compound Eyes: Atk 229/251, SpA 249/273, Spe 289/317 — Frisk: Atk 229/251, SpA 249/273, Spe 289/317
  Item: **free**
  STAB: Bug Bug Buzz 90S · Flying Air Slash 75S
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Dark Feint Attack 60P, Fighting Reversal 20P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Normal Uproar 90S, Ghost Shadow Ball 80S, Rock Ancient Power 60S

**Yungoos** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 253 (48/70/30/30/30/45) | Abilities: Stakeout / Strong Jaw / Adaptability
  Engine stats @252 (neutral/positive): Stakeout: Atk 239/262, SpA 159/174, Spe 189/207 — Strong Jaw: Atk 239/262, SpA 159/174, Spe 189/207 — Adaptability: Atk 239/262, SpA 159/174, Spe 189/207
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Ground Earthquake 100P, Steel Iron Tail 100P, Electric Wild Charge 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Grass Seed Bomb 80P
  Special coverage: Electric Shock Wave 60S, Ground Mud Shot 55S, Water Chilling Water 50S

**Zangoose** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 458 (73/115/60/60/60/90) | Abilities: Immunity / Toxic Boost
  Engine stats @252 (neutral/positive): Immunity: Atk 329/361, SpA 219/240, Spe 279/306 — Toxic Boost: Atk 329/361, SpA 219/240, Spe 279/306
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Fighting Focus Punch 150P, Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Grass Seed Bomb 80P, Dark Throat Chop 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Water Surf 95S

**Zebstrika** — species, **ZU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 497 (75/100/63/80/63/116) | Abilities: Lightning Rod / Motor Drive / Sap Sipper
  Engine stats @252 (neutral/positive): Lightning Rod: Atk 299/328, SpA 259/284, Spe 331/364 — Motor Drive: Atk 299/328, SpA 259/284, Spe 331/364 — Sap Sipper: Atk 299/328, SpA 259/284, Spe 331/364
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Fighting Double Kick 50x2P, Ground High Horsepower 95P, Flying Bounce 85 (charge)P, Steel Smart Strike 70P, Fire Flame Charge 50P
  Special coverage: Fire Overheat 140S, Normal Uproar 90S, Bug Signal Beam 75S

**Zigzagoon** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal | BST 240 (38/30/41/30/41/60) | Abilities: Pickup / Gluttony / Quick Feet
  Engine stats @252 (neutral/positive): Pickup: Atk 159/174, SpA 159/174, Spe 219/240 — Gluttony: Atk 159/174, SpA 159/174, Spe 219/240 — Quick Feet: Atk 159/174, SpA 159/174, Spe 219/240
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Grass Seed Bomb 80P, Bug Pin Missile 25x2-5P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Water Surf 95S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Ground Mud Shot 55S

**Zigzagoon-Galar** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark/Normal | BST 240 (38/30/41/30/41/60) | Abilities: Pickup / Gluttony / Quick Feet
  Engine stats @252 (neutral/positive): Pickup: Atk 159/174, SpA 159/174, Spe 219/240 — Gluttony: Atk 159/174, SpA 159/174, Spe 219/240 — Quick Feet: Atk 159/174, SpA 159/174, Spe 219/240
  Item: **free**
  STAB: Dark Lash Out 75P · Normal Last Resort 140P
  Physical coverage: Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Grass Seed Bomb 80P, Bug Pin Missile 25x2-5P, Fighting Rock Smash 40P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Water Surf 95S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Ground Mud Shot 55S

**Zorua** — species, **ZU**, source: imported (redgpt-zu-floor)
  Dark | BST 330 (40/65/40/80/40/65) | Abilities: Illusion
  Engine stats @252 (neutral/positive): Illusion: Atk 229/251, SpA 259/284, Spe 229/251
  Item: **free**
  STAB: Dark Foul Play 95P
  Physical coverage: Normal Return 102P, Ground Dig 100 (charge)P, Flying Bounce 85 (charge)P, Ghost Shadow Claw 70P, Bug Skitter Smack 70P, Fighting Revenge 60P
  Special coverage: Normal Hyper Voice 90S, Poison Sludge Bomb 90S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S, Fire Burning Jealousy 70S, Grass Grass Knot 60S

**Zorua-Hisui** — species, **ZU**, source: imported (redgpt-zu-floor)
  Normal/Ghost | BST 330 (35/60/40/85/40/70) | Abilities: Illusion
  Engine stats @252 (neutral/positive): Illusion: Atk 219/240, SpA 269/295, Spe 239/262
  Item: **free**
  STAB: Normal Return 102P · Ghost Phantom Force 90 (charge)P
  Physical coverage: Fighting Focus Punch 150P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Flying Bounce 85 (charge)P, Bug Skitter Smack 70P
  Special coverage: Poison Sludge Bomb 90S, Dark Night Daze 85S, Psychic Extrasensory 80S, Fire Burning Jealousy 70S, Grass Grass Knot 60S, Ice Icy Wind 55S

**Zubat** — species, **ZU**, source: imported (redgpt-zu-floor)
  Poison/Flying | BST 245 (40/45/35/30/40/55) | Abilities: Inner Focus / Infiltrator
  Engine stats @252 (neutral/positive): Inner Focus: Atk 189/207, SpA 159/174, Spe 209/229 — Infiltrator: Atk 189/207, SpA 159/174, Spe 209/229
  Item: **free**
  STAB: Poison Sludge Bomb 90S · Flying Brave Bird 120P
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Bug Leech Life 80P, Psychic Zen Headbutt 80P, Steel Steel Wing 70P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Normal Uproar 90S, Ghost Shadow Ball 80S, Grass Giga Drain 75S, Dragon Twister 40S
---

## E. Post-change NU comparison bar

All **67** NU entries **after** the NU pass. This is the destination a
promotion joins — do not compare against the stale 65-entry roster.

**Abomasnow-Mega** — forme, **NU**, source: imported (natdex-RU refined by gen7)
  Grass/Ice | BST 594 (90/132/105/132/105/30) | Abilities: Snow Warning
  Engine stats @252 (neutral/positive): Snow Warning: Atk 363/399, SpA 363/399, Spe 159/174
  Item: **Abomasite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Abomasnow (ZU), pre-Mega abilities Snow Warning / Soundproof, pre-Mega Spe 240 (max +Spe)
  STAB: Grass Leaf Storm 140S · Ice Blizzard 120S
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Hard Press 100P, Dark Fling 80P
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Water Water Pulse 60S

**Aerodactyl** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Rock/Flying | BST 515 (80/105/65/60/75/130) | Abilities: Rock Head / Pressure / Unnerve
  Engine stats @252 (neutral/positive): Rock Head: Atk 309/339, SpA 219/240, Spe 359/394 — Pressure: Atk 309/339, SpA 219/240, Spe 359/394 — Unnerve: Atk 309/339, SpA 219/240, Spe 359/394
  Item: **free**
  STAB: Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Fire Fire Blast 120S, Dragon Dragon Pulse 90S, Ground Earth Power 90S, Normal Razor Wind 80 (charge)S, Ghost Ominous Wind 60S

**Aggron** — species, **NU**, source: override
  Steel/Rock | BST 530 (70/110/180/60/60/50) | Abilities: Sturdy / Rock Head / Heavy Metal
  Engine stats @252 (neutral/positive): Sturdy: Atk 319/350, SpA 219/240, Spe 199/218 — Rock Head: Atk 319/350, SpA 219/240, Spe 199/218 — Heavy Metal: Atk 319/350, SpA 219/240, Spe 199/218
  Item: **free**
  STAB: Steel Steel Roller 130P · Rock Head Smash 150P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Dark Crunch 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S

**Altaria** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Dragon/Flying | BST 490 (75/70/90/70/105/80) | Abilities: Natural Cure / Cloud Nine
  Engine stats @252 (neutral/positive): Natural Cure: Atk 239/262, SpA 239/262, Spe 259/284 — Cloud Nine: Atk 239/262, SpA 239/262, Spe 259/284
  Item: **free**
  STAB: Dragon Draco Meteor 140S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fairy Play Rough 90P, Dark Thief 60P, Grass Trailblaze 50P
  Special coverage: Fire Fire Blast 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Ice Ice Beam 95S, Fairy Moonblast 95S, Normal Hyper Voice 90S

**Araquanid** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water/Bug | BST 454 (68/70/92/50/132/42) | Abilities: Water Bubble / Water Absorb
  Engine stats @252 (neutral/positive): Water Bubble: Atk 239/262, SpA 199/218, Spe 183/201 — Water Absorb: Atk 239/262, SpA 199/218, Spe 183/201
  Item: **free**
  STAB: Water Hydro Pump 120S · Bug Bug Buzz 90S
  Physical coverage: Normal Return 102P, Dark Crunch 80P, Poison Poison Jab 80P, Grass Trailblaze 50P
  Special coverage: Ice Blizzard 120S, Normal Tera Blast 80S, Grass Giga Drain 75S, Psychic Mirror Coat fixedS

**Arcanine** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Fire | BST 555 (90/110/80/100/80/95) | Abilities: Intimidate / Flash Fire / Justified
  Engine stats @252 (neutral/positive): Intimidate: Atk 319/350, SpA 299/328, Spe 289/317 — Flash Fire: Atk 319/350, SpA 299/328, Spe 289/317 — Justified: Atk 319/350, SpA 299/328, Spe 289/317
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Skull Bash 130P, Fighting Close Combat 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P
  Special coverage: Grass Solar Beam 120 (charge)S, Dragon Dragon Pulse 90S, Normal Hyper Voice 90S, Ground Scorching Sands 70S, Dark Snarl 55S

**Articuno-Galar** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Psychic/Flying | BST 580 (90/85/85/125/100/95) | Abilities: Competitive
  Engine stats @252 (neutral/positive): Competitive: Atk 269/295, SpA 349/383, Spe 289/317
  Item: **free**
  STAB: Psychic Future Sight 120S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Ice Ice Spinner 80P, Steel Steel Wing 70P, Bug U-turn 70P, Fighting Rock Smash 40P
  Special coverage: Ice Blizzard 120S, Normal Hyper Voice 90S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Water Bubble Beam 65S, Rock Ancient Power 60S

**Avalugg** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Ice | BST 514 (95/117/184/44/46/28) | Abilities: Own Tempo / Ice Body / Sturdy
  Engine stats @252 (neutral/positive): Own Tempo: Atk 333/366, SpA 187/205, Spe 155/170 — Ice Body: Atk 333/366, SpA 187/205, Spe 155/170 — Sturdy: Atk 333/366, SpA 187/205, Spe 155/170
  Item: **free**
  STAB: Ice Icicle Crash 85P
  Physical coverage: Normal Skull Bash 130P, Steel Heavy Slam 120P, Fighting Superpower 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Crunch 80P
  Special coverage: Water Hydro Pump 120S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Psychic Mirror Coat fixedS

**Basculegion** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water/Ghost | BST 530 (120/112/65/80/75/78) | Abilities: Swift Swim / Adaptability / Mold Breaker
  Engine stats @252 (neutral/positive): Swift Swim: Atk 323/355, SpA 259/284, Spe 255/280 — Adaptability: Atk 323/355, SpA 259/284, Spe 255/280 — Mold Breaker: Atk 323/355, SpA 259/284, Spe 255/280
  Item: **free**
  STAB: Water Hydro Pump 120S · Ghost Phantom Force 90 (charge)P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Fighting Superpower 120P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Ground Mud Shot 55S, Fighting Final Gambit fixedS

**Bellibolt** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 495 (109/64/91/103/83/45) | Abilities: Electromorphosis / Static / Damp
  Engine stats @252 (neutral/positive): Electromorphosis: Atk 227/249, SpA 305/335, Spe 189/207 — Static: Atk 227/249, SpA 305/335, Spe 189/207 — Damp: Atk 227/249, SpA 305/335, Spe 189/207
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Dark Sucker Punch 80P, Normal Tackle 50P
  Special coverage: Water Muddy Water 95S, Normal Hyper Voice 90S, Ground Mud Shot 55S, Poison Acid Spray 40S

**Brambleghast** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Grass/Ghost | BST 480 (55/115/70/80/70/90) | Abilities: Wind Rider / Infiltrator
  Engine stats @252 (neutral/positive): Wind Rider: Atk 329/361, SpA 259/284, Spe 279/306 — Infiltrator: Atk 329/361, SpA 259/284, Spe 279/306
  Item: **free**
  STAB: Grass Leaf Storm 140S · Ghost Poltergeist 110P
  Physical coverage: Normal Facade 70P, Bug Skitter Smack 70P, Dark Thief 60P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S, Bug Infestation 20S

**Braviary** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Normal/Flying | BST 510 (100/123/75/57/75/80) | Abilities: Keen Eye / Sheer Force / Defiant
  Engine stats @252 (neutral/positive): Keen Eye: Atk 345/379, SpA 213/234, Spe 259/284 — Sheer Force: Atk 345/379, SpA 213/234, Spe 259/284 — Defiant: Atk 345/379, SpA 213/234, Spe 259/284
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Fighting Close Combat 120P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Rock Rock Slide 75P, Ghost Shadow Claw 70P, Bug U-turn 70P
  Special coverage: Fire Heat Wave 100S

**Bronzong** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Steel/Psychic | BST 500 (67/89/116/79/116/33) | Abilities: Levitate / Heatproof / Heavy Metal
  Engine stats @252 (neutral/positive): Levitate: Atk 277/304, SpA 257/282, Spe 165/181 — Heatproof: Atk 277/304, SpA 257/282, Spe 165/181 — Heavy Metal: Atk 277/304, SpA 257/282, Spe 165/181
  Item: **free**
  STAB: Steel Steel Beam 140S · Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P, Ground Earthquake 100P, Fighting Body Press 80P, Ice Ice Spinner 80P, Rock Rock Blast 25x2-5P, Dark Feint Attack 60P
  Special coverage: Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Electric Charge Beam 50S

**Cinccino** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 470 (75/95/60/65/60/115) | Abilities: Cute Charm / Technician / Skill Link
  Engine stats @252 (neutral/positive): Cute Charm: Atk 289/317, SpA 229/251, Spe 329/361 — Technician: Atk 289/317, SpA 229/251, Spe 329/361 — Skill Link: Atk 289/317, SpA 229/251, Spe 329/361
  Item: **free**
  STAB: Normal Last Resort 140P
  Physical coverage: Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Water Aqua Tail 90P, Fairy Play Rough 90P, Ice Ice Spinner 80P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Fairy Alluring Voice 80S, Grass Grass Knot 60S, Water Chilling Water 50S, Ground Mud-Slap 20S

**Decidueye** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Grass/Ghost | BST 530 (78/107/75/100/100/70) | Abilities: Overgrow / Long Reach
  Engine stats @252 (neutral/positive): Overgrow: Atk 313/344, SpA 299/328, Spe 239/262 — Long Reach: Atk 313/344, SpA 299/328, Spe 239/262
  Item: **free**
  STAB: Grass Leaf Storm 140S · Ghost Poltergeist 110P
  Physical coverage: Flying Sky Attack 140 (charge)P, Normal Return 102P, Dark Sucker Punch 80P, Psychic Psycho Cut 70P, Bug Skitter Smack 70P, Steel Steel Wing 70P
  Special coverage: Flying Hurricane 120S, Normal Tera Blast 80S

**Decidueye-Hisui** — species, **NU**, source: override
  Grass/Fighting | BST 530 (88/112/80/95/95/60) | Abilities: Overgrow / Scrappy
  Engine stats @252 (neutral/positive): Overgrow: Atk 323/355, SpA 289/317, Spe 219/240 — Scrappy: Atk 323/355, SpA 289/317, Spe 219/240
  Item: **free**
  STAB: Grass Leaf Storm 140S · Fighting Focus Punch 150P
  Physical coverage: Flying Sky Attack 140 (charge)P, Ghost Poltergeist 110P, Normal Return 102P, Dark Sucker Punch 80P, Psychic Psycho Cut 70P, Bug Skitter Smack 70P
  Special coverage: Flying Hurricane 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S

**Dhelmise** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Ghost/Grass | BST 517 (70/131/100/86/90/40) | Abilities: Steelworker
  Engine stats @252 (neutral/positive): Steelworker: Atk 361/397, SpA 271/298, Spe 179/196
  Item: **free**
  STAB: Ghost Poltergeist 110P · Grass Solar Blade 125 (charge)P
  Physical coverage: Steel Steel Roller 130P, Normal Return 102P, Ground Earthquake 100P, Water Liquidation 85P, Fighting Body Press 80P, Rock Rock Slide 75P
  Special coverage: Water Hydro Pump 120S, Poison Sludge Wave 95S, Steel Flash Cannon 80S, Normal Hidden Power 60S

**Doublade** — species, **NU**, source: override
  Steel/Ghost | BST 448 (59/110/150/45/49/35) | Abilities: No Guard
  Engine stats @252 (neutral/positive): No Guard: Atk 319/350, SpA 189/207, Spe 169/185
  Item: **free**
  STAB: Steel Iron Head 80P · Ghost Shadow Claw 70P
  Physical coverage: Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Return 102P, Rock Rock Slide 75P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Normal Hidden Power 60S, Electric Shock Wave 60S

**Dragalge** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Poison/Dragon | BST 494 (65/75/90/97/123/44) | Abilities: Poison Point / Poison Touch / Adaptability
  Engine stats @252 (neutral/positive): Poison Point: Atk 249/273, SpA 293/322, Spe 187/205 — Poison Touch: Atk 249/273, SpA 293/322, Spe 187/205 — Adaptability: Atk 249/273, SpA 293/322, Spe 187/205
  Item: **free**
  STAB: Poison Gunk Shot 120P · Dragon Draco Meteor 140S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Water Aqua Tail 90P, Fairy Play Rough 90P, Flying Bounce 85 (charge)P, Dark Feint Attack 60P
  Special coverage: Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ice Icy Wind 55S

**Drampa** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Normal/Dragon | BST 485 (78/60/85/135/91/36) | Abilities: Berserk / Sap Sipper / Cloud Nine
  Engine stats @252 (neutral/positive): Berserk: Atk 219/240, SpA 369/405, Spe 171/188 — Sap Sipper: Atk 219/240, SpA 369/405, Spe 171/188 — Cloud Nine: Atk 219/240, SpA 369/405, Spe 171/188
  Item: **free**
  STAB: Normal Hyper Voice 90S · Dragon Draco Meteor 140S
  Physical coverage: Fighting Superpower 120P, Ground Earthquake 100P, Fairy Play Rough 90P, Flying Fly 90 (charge)P, Dark Lash Out 75P, Rock Rock Slide 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Flying Hurricane 120S, Water Hydro Pump 120S, Electric Thunder 120S

**Drapion** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Poison/Dark | BST 500 (70/90/110/60/75/95) | Abilities: Battle Armor / Sniper / Keen Eye
  Engine stats @252 (neutral/positive): Battle Armor: Atk 279/306, SpA 219/240, Spe 289/317 — Sniper: Atk 279/306, SpA 219/240, Spe 289/317 — Keen Eye: Atk 279/306, SpA 219/240, Spe 289/317
  Item: **free**
  STAB: Poison Sludge Bomb 90S · Dark Crunch 80P
  Physical coverage: Normal Return 102P, Ground Earthquake 100P, Steel Iron Tail 100P, Bug Twineedle 50x2P, Water Aqua Tail 90P, Fighting Brick Break 75P
  Special coverage: Bug Bug Buzz 90S, Ghost Shadow Ball 80S, Normal Hidden Power 60S, Ground Mud-Slap 20S

**Drednaw** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water/Rock | BST 485 (90/115/90/48/68/74) | Abilities: Strong Jaw / Shell Armor / Swift Swim
  Engine stats @252 (neutral/positive): Strong Jaw: Atk 329/361, SpA 195/214, Spe 247/271 — Shell Armor: Atk 329/361, SpA 195/214, Spe 247/271 — Swift Swim: Atk 329/361, SpA 195/214, Spe 247/271
  Item: **free**
  STAB: Water Liquidation 85P · Rock Head Smash 150P
  Physical coverage: Normal Skull Bash 130P, Bug Megahorn 120P, Fighting Superpower 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P
  Special coverage: Ice Blizzard 120S, Ground Earth Power 90S, Normal Tera Blast 80S

**Dudunsparce** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 520 (125/100/80/85/75/55) | Abilities: Serene Grace / Run Away / Rattled
  Engine stats @252 (neutral/positive): Serene Grace: Atk 299/328, SpA 269/295, Spe 209/229 — Run Away: Atk 299/328, SpA 269/295, Spe 209/229 — Rattled: Atk 299/328, SpA 269/295, Spe 209/229
  Item: **free**
  STAB: Normal Trump Card 200S
  Physical coverage: Dragon Outrage 120P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Flying Hurricane 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S

**Escavalier** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Bug/Steel | BST 495 (70/135/105/60/105/20) | Abilities: Swarm / Shell Armor / Overcoat
  Engine stats @252 (neutral/positive): Swarm: Atk 369/405, SpA 219/240, Spe 139/152 — Shell Armor: Atk 369/405, SpA 219/240, Spe 139/152 — Overcoat: Atk 369/405, SpA 219/240, Spe 139/152
  Item: **free**
  STAB: Bug Megahorn 120P · Steel Iron Head 80P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Ground Drill Run 80P, Poison Poison Jab 80P, Water Razor Shell 75P, Dark Night Slash 70P
  Special coverage: Fighting Focus Blast 120S, Grass Energy Ball 90S, Normal Hidden Power 60S, Poison Acid Spray 40S

**Espeon** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Psychic | BST 525 (65/65/60/130/95/110) | Abilities: Synchronize / Magic Bounce
  Engine stats @252 (neutral/positive): Synchronize: Atk 229/251, SpA 359/394, Spe 319/350 — Magic Bounce: Atk 229/251, SpA 359/394, Spe 319/350
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Bite 60P, Grass Trailblaze 50P
  Special coverage: Normal Trump Card 200S, Electric Zap Cannon 120S, Fairy Alluring Voice 80S, Rock Power Gem 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Exploud** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Normal | BST 490 (104/91/63/91/73/68) | Abilities: Soundproof / Scrappy
  Engine stats @252 (neutral/positive): Soundproof: Atk 281/309, SpA 281/309, Spe 235/258 — Scrappy: Atk 281/309, SpA 281/309, Spe 235/258
  Item: **free**
  STAB: Normal Boomburst 140S
  Physical coverage: Dragon Outrage 120P, Fighting Dynamic Punch 100P, Ground Earthquake 100P, Dark Crunch 80P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Fire Overheat 140S, Ice Blizzard 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Psychic Synchronoise 120S, Grass Solar Beam 120 (charge)S

**Flamigo** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Flying/Fighting | BST 500 (82/115/74/75/64/90) | Abilities: Scrappy / Tangled Feet / Costar
  Engine stats @252 (neutral/positive): Scrappy: Atk 329/361, SpA 249/273, Spe 279/306 — Tangled Feet: Atk 329/361, SpA 249/273, Spe 279/306 — Costar: Atk 329/361, SpA 249/273, Spe 279/306
  Item: **free**
  STAB: Flying Sky Attack 140 (charge)P · Fighting Close Combat 120P
  Physical coverage: Normal Mega Kick 120P, Water Liquidation 85P, Bug Lunge 80P, Dark Throat Chop 80P
  Special coverage: Normal Tera Blast 80S, Water Water Pulse 60S

**Flygon** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Ground/Dragon | BST 520 (80/100/80/80/80/100) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 299/328, SpA 259/284, Spe 299/328
  Item: **free**
  STAB: Ground Earthquake 100P · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Flying Dual Wingbeat 50x2P, Steel Iron Tail 100P, Rock Stone Edge 100P, Bug First Impression 90P
  Special coverage: Normal Boomburst 140S, Fire Fire Blast 120S, Grass Solar Beam 120 (charge)S, Bug Bug Buzz 90S, Fairy Alluring Voice 80S, Flying Air Slash 75S

**Glalie-Mega** — forme, **NU**, source: imported (natdex-RU refined by gen7)
  Ice | BST 580 (80/120/80/120/80/100) | Abilities: Refrigerate
  Engine stats @252 (neutral/positive): Refrigerate: Atk 339/372, SpA 339/372, Spe 299/328
  Item: **Glalitite** (forced, **not removable** — no Choice item, Life Orb, Boots, Leftovers or Ring Target)
  Base: Glalie (ZU), pre-Mega abilities Inner Focus / Ice Body / Moody, pre-Mega Spe 284 (max +Spe)
  STAB: Ice Explosion 325P
  Physical coverage: Steel Steel Roller 130P, Ground Earthquake 100P, Dark Foul Play 95P, Grass Trailblaze 50P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Water Water Pulse 60S

**Gligar** — species, **NU**, source: override
  Ground/Flying | BST 430 (65/75/105/35/65/85) | Abilities: Hyper Cutter / Sand Veil / Immunity
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 249/273, SpA 169/185, Spe 269/295 — Sand Veil: Atk 249/273, SpA 169/185, Spe 269/295 — Immunity: Atk 249/273, SpA 169/185, Spe 269/295
  Item: **free**
  STAB: Ground Earthquake 100P · Flying Acrobatics 110P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Water Crabhammer 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Psychic Psychic Fangs 85P
  Special coverage: Psychic Dream Eater 100S, Poison Sludge Bomb 90S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Bug Struggle Bug 50S

**Goodra** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Dragon | BST 600 (90/100/70/110/150/80) | Abilities: Sap Sipper / Hydration / Gooey
  Engine stats @252 (neutral/positive): Sap Sipper: Atk 299/328, SpA 319/350, Spe 259/284 — Hydration: Atk 299/328, SpA 319/350, Spe 259/284 — Gooey: Atk 299/328, SpA 319/350, Spe 259/284
  Item: **free**
  STAB: Dragon Draco Meteor 140S
  Physical coverage: Fighting Focus Punch 150P, Normal Mega Kick 120P, Grass Power Whip 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Poison Sludge Wave 95S

**Gothitelle** — species, **NU**, source: override
  Psychic | BST 490 (70/55/95/95/110/65) | Abilities: Frisk / Competitive / Shadow Tag
  Engine stats @252 (neutral/positive): Frisk: Atk 209/229, SpA 289/317, Spe 229/251 — Competitive: Atk 209/229, SpA 289/317, Spe 229/251 — Shadow Tag: Atk 209/229, SpA 289/317, Spe 229/251
  **TRAPPING ABILITY: Shadow Tag** (optional — one of 3)
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Return 102P, Dark Foul Play 95P, Fighting Brick Break 75P, Rock Rock Slide 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S

**Grafaiai** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Poison/Normal | BST 485 (63/95/65/80/72/110) | Abilities: Unburden / Poison Touch / Prankster
  Engine stats @252 (neutral/positive): Unburden: Atk 289/317, SpA 259/284, Spe 319/350 — Poison Touch: Atk 289/317, SpA 259/284, Spe 319/350 — Prankster: Atk 289/317, SpA 259/284, Spe 319/350
  Item: **free**
  STAB: Poison Gunk Shot 120P · Normal Double-Edge 120P
  Physical coverage: Flying Acrobatics 110P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Bug X-Scissor 80P, Ghost Shadow Claw 70P, Fighting Low Sweep 65P
  Special coverage: Ground Mud Shot 55S

**Guzzlord** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Dark/Dragon | BST 570 (223/101/53/97/53/43) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 301/331, SpA 293/322, Spe 185/203
  Item: **free**
  STAB: Dark Crunch 80P · Dragon Draco Meteor 140S
  Physical coverage: Normal Last Resort 140P, Steel Steel Roller 130P, Fire Heat Crash 120P, Ground Earthquake 100P, Fighting Hammer Arm 100P, Rock Stone Edge 100P
  Special coverage: Poison Belch 120S, Fire Fire Blast 120S, Normal Wring Out 120S, Electric Shock Wave 60S

**Hariyama** — species, **NU**, source: override
  Fighting | BST 474 (144/120/60/40/60/50) | Abilities: Thick Fat / Guts / Sheer Force
  Engine stats @252 (neutral/positive): Thick Fat: Atk 339/372, SpA 179/196, Spe 199/218 — Guts: Atk 339/372, SpA 179/196, Spe 199/218 — Sheer Force: Atk 339/372, SpA 179/196, Spe 199/218
  Item: **free**
  STAB: Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Ground Headlong Rush 120P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Poison Poison Jab 80P, Dark Throat Chop 80P
  Special coverage: Water Surf 95S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Heliolisk** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Electric/Normal | BST 481 (62/55/52/109/94/109) | Abilities: Dry Skin / Sand Veil / Solar Power
  Engine stats @252 (neutral/positive): Dry Skin: Atk 209/229, SpA 317/348, Spe 317/348 — Sand Veil: Atk 209/229, SpA 317/348, Spe 317/348 — Solar Power: Atk 209/229, SpA 317/348, Spe 317/348
  Item: **free**
  STAB: Electric Thunder 120S · Normal Hyper Voice 90S
  Physical coverage: Dragon Dragon Rush 100P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fire Fire Punch 75P, Rock Rock Slide 75P, Bug U-turn 70P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Water Surf 95S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Bug Signal Beam 75S

**Heracross** — species, **NU**, source: override
  Bug/Fighting | BST 500 (80/125/75/40/95/85) | Abilities: Swarm / Guts / Moxie
  Engine stats @252 (neutral/positive): Swarm: Atk 349/383, SpA 179/196, Spe 269/295 — Guts: Atk 349/383, SpA 179/196, Spe 269/295 — Moxie: Atk 349/383, SpA 179/196, Spe 269/295
  Item: **free**
  STAB: Bug Megahorn 120P · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Throat Chop 80P, Grass Bullet Seed 25x2-5P, Ghost Shadow Claw 70P
  Special coverage: Normal Tera Blast 80S, Poison Venoshock 65S

**Houndstone** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Ghost | BST 488 (72/101/100/50/97/68) | Abilities: Sand Rush / Fluffy
  Engine stats @252 (neutral/positive): Sand Rush: Atk 301/331, SpA 199/218, Spe 235/258 — Fluffy: Atk 301/331, SpA 199/218, Spe 235/258
  Item: **free**
  STAB: Ghost Poltergeist 110P
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P, Fighting Body Press 80P, Dark Crunch 80P
  Special coverage: Normal Uproar 90S, Ground Mud Shot 55S, Dark Snarl 55S

**Incineroar** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Fire/Dark | BST 530 (95/115/90/80/90/60) | Abilities: Blaze / Intimidate
  Engine stats @252 (neutral/positive): Blaze: Atk 329/361, SpA 259/284, Spe 219/240 — Intimidate: Atk 329/361, SpA 259/284, Spe 219/240
  Item: **free**
  STAB: Fire Overheat 140S · Dark Darkest Lariat 85P
  Physical coverage: Fighting Focus Punch 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Flying Acrobatics 110P, Ground Earthquake 100P, Steel Iron Head 80P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Ground Scorching Sands 70S

**Indeedee** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Psychic/Normal | BST 475 (60/65/55/105/95/95) | Abilities: Inner Focus / Synchronize / Psychic Surge
  Engine stats @252 (neutral/positive): Inner Focus: Atk 229/251, SpA 309/339, Spe 289/317 — Synchronize: Atk 229/251, SpA 309/339, Spe 289/317 — Psychic Surge: Atk 229/251, SpA 309/339, Spe 289/317
  Item: **free**
  STAB: Psychic Future Sight 120S · Normal Hyper Voice 90S
  Physical coverage: Fairy Play Rough 90P, Fighting Drain Punch 75P
  Special coverage: Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S

**Inteleon** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water | BST 530 (70/85/65/125/65/120) | Abilities: Torrent / Sniper
  Engine stats @252 (neutral/positive): Torrent: Atk 269/295, SpA 349/383, Spe 339/372 — Sniper: Atk 269/295, SpA 349/383, Spe 339/372
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Flying Acrobatics 110P, Normal Take Down 90P, Dark Sucker Punch 80P, Ice Icicle Spear 25x2-5P, Dragon Scale Shot 25x2-5P, Bug Skitter Smack 70P
  Special coverage: Ice Blizzard 120S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Flying Air Slash 75S, Ground Mud Shot 55S

**Kilowattrel** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Electric/Flying | BST 490 (70/70/60/105/60/125) | Abilities: Wind Power / Volt Absorb / Competitive
  Engine stats @252 (neutral/positive): Wind Power: Atk 239/262, SpA 309/339, Spe 349/383 — Volt Absorb: Atk 239/262, SpA 309/339, Spe 349/383 — Competitive: Atk 239/262, SpA 309/339, Spe 349/383
  Item: **free**
  STAB: Electric Thunder 120S · Flying Brave Bird 120P
  Physical coverage: Normal Take Down 90P, Bug U-turn 70P
  Special coverage: Normal Uproar 90S

**Kingler** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Water | BST 475 (55/130/115/50/50/75) | Abilities: Hyper Cutter / Shell Armor / Sheer Force
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 359/394, SpA 199/218, Spe 249/273 — Shell Armor: Atk 359/394, SpA 199/218, Spe 249/273 — Sheer Force: Atk 359/394, SpA 199/218, Spe 249/273
  Item: **free**
  STAB: Water Crabhammer 100P
  Physical coverage: Normal Double-Edge 120P, Fighting Superpower 120P, Ground Dig 100 (charge)P, Bug X-Scissor 80P, Rock Rock Slide 75P, Dark Night Slash 70P
  Special coverage: Ice Blizzard 120S, Rock Ancient Power 60S, Normal Hidden Power 60S, Ground Mud Shot 55S

**Klefki** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Steel/Fairy | BST 470 (57/80/91/80/87/75) | Abilities: Prankster / Magician
  Engine stats @252 (neutral/positive): Prankster: Atk 259/284, SpA 259/284, Spe 249/273 — Magician: Atk 259/284, SpA 259/284, Spe 249/273
  Item: **free**
  STAB: Steel Steel Beam 140S · Fairy Play Rough 90P
  Physical coverage: Normal Last Resort 140P, Dark Foul Play 95P, Bug Skitter Smack 70P, Ghost Astonish 30P
  Special coverage: Psychic Psychic 90S, Normal Tera Blast 80S

**Magneton** — species, **NU**, source: override
  Electric/Steel | BST 465 (50/60/95/120/70/70) | Abilities: Magnet Pull / Sturdy / Analytic
  Engine stats @252 (neutral/positive): Magnet Pull: Atk 219/240, SpA 339/372, Spe 239/262 — Sturdy: Atk 219/240, SpA 339/372, Spe 239/262 — Analytic: Atk 219/240, SpA 339/372, Spe 239/262
  **TRAPPING ABILITY: Magnet Pull** (optional — one of 3)
  Item: **free**
  STAB: Electric Thunder 120S · Steel Steel Beam 140S
  Physical coverage: Normal Explosion 250P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S

**Mantine** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Water/Flying | BST 485 (85/40/70/80/140/70) | Abilities: Swift Swim / Water Absorb / Water Veil
  Engine stats @252 (neutral/positive): Swift Swim: Atk 179/196, SpA 259/284, Spe 239/262 — Water Absorb: Atk 179/196, SpA 259/284, Spe 239/262 — Water Veil: Atk 179/196, SpA 259/284, Spe 239/262
  Item: **free**
  STAB: Water Hydro Pump 120S · Flying Hurricane 120S
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Ground Earthquake 100P, Fighting Body Press 80P, Steel Iron Head 80P, Grass Seed Bomb 80P
  Special coverage: Ice Blizzard 120S, Bug Signal Beam 75S, Psychic Psybeam 65S, Normal Hidden Power 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Meloetta** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Normal/Psychic | BST 600 (100/77/77/128/128/90) | Abilities: Serene Grace
  Engine stats @252 (neutral/positive): Serene Grace: Atk 253/278, SpA 355/390, Spe 279/306
  Item: **free**
  STAB: Normal Hyper Voice 90S · Psychic Dream Eater 100S
  Physical coverage: Fighting Focus Punch 150P, Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Fairy Play Rough 90P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Energy Ball 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Omastar** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Rock/Water | BST 495 (70/60/125/115/70/55) | Abilities: Swift Swim / Shell Armor / Weak Armor
  Engine stats @252 (neutral/positive): Swift Swim: Atk 219/240, SpA 329/361, Spe 209/229 — Shell Armor: Atk 219/240, SpA 329/361, Spe 209/229 — Weak Armor: Atk 219/240, SpA 329/361, Spe 209/229
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Water Hydro Pump 120S
  Physical coverage: Normal Skull Bash 130P, Dark Crunch 80P, Fighting Submission 80P, Bug Pin Missile 25x2-5P, Steel Gyro Ball 26P
  Special coverage: Ice Blizzard 120S, Normal Wring Out 120S, Ground Earth Power 90S

**Overqwil** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Dark/Poison | BST 510 (85/115/95/65/65/85) | Abilities: Poison Point / Swift Swim / Intimidate
  Engine stats @252 (neutral/positive): Poison Point: Atk 329/361, SpA 229/251, Spe 269/295 — Swift Swim: Atk 329/361, SpA 229/251, Spe 269/295 — Intimidate: Atk 329/361, SpA 229/251, Spe 269/295
  Item: **free**
  STAB: Dark Crunch 80P · Poison Gunk Shot 120P
  Physical coverage: Normal Explosion 250P, Steel Steel Roller 130P, Water Aqua Tail 90P, Flying Bounce 85 (charge)P, Bug Pin Missile 25x2-5P, Dragon Scale Shot 25x2-5P
  Special coverage: Ice Blizzard 120S, Water Hydro Pump 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Electric Shock Wave 60S

**Pawmot** — species, **NU**, source: override
  Electric/Fighting | BST 490 (70/115/70/70/60/105) | Abilities: Volt Absorb / Natural Cure / Iron Fist
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 329/361, SpA 239/262, Spe 309/339 — Natural Cure: Atk 329/361, SpA 239/262, Spe 309/339 — Iron Fist: Atk 329/361, SpA 239/262, Spe 309/339
  Item: **free**
  STAB: Electric Double Shock 120P · Fighting Focus Punch 150P
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Dark Crunch 80P, Grass Seed Bomb 80P, Fire Fire Punch 75P
  Special coverage: Normal Tera Blast 80S, Grass Grass Knot 60S

**Raikou** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Electric | BST 580 (90/85/75/115/100/115) | Abilities: Pressure / Inner Focus / Volt Absorb
  Engine stats @252 (neutral/positive): Pressure: Atk 269/295, SpA 329/361, Spe 329/361 — Inner Focus: Atk 269/295, SpA 329/361, Spe 329/361 — Volt Absorb: Atk 269/295, SpA 329/361, Spe 329/361
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Grass Trailblaze 50P, Fighting Rock Smash 40P
  Special coverage: Fighting Aura Sphere 90S, Psychic Extrasensory 80S, Water Scald 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Rhydon** — species, **NU**, source: override
  Ground/Rock | BST 485 (105/130/120/45/45/40) | Abilities: Lightning Rod / Rock Head / Reckless
  Engine stats @252 (neutral/positive): Lightning Rod: Atk 359/394, SpA 189/207, Spe 179/196 — Rock Head: Atk 359/394, SpA 189/207, Spe 179/196 — Reckless: Atk 359/394, SpA 189/207, Spe 179/196
  Item: **free**
  STAB: Ground Earthquake 100P · Rock Stone Edge 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Bug Megahorn 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Electric Supercell Slam 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S

**Rhyperior** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Ground/Rock | BST 535 (115/140/130/55/55/40) | Abilities: Lightning Rod / Solid Rock / Reckless
  Engine stats @252 (neutral/positive): Lightning Rod: Atk 379/416, SpA 209/229, Spe 179/196 — Solid Rock: Atk 379/416, SpA 209/229, Spe 179/196 — Reckless: Atk 379/416, SpA 209/229, Spe 179/196
  Item: **free**
  STAB: Ground Earthquake 100P · Rock Stone Edge 100P
  Physical coverage: Fighting Focus Punch 150P, Normal Skull Bash 130P, Fire Heat Crash 120P, Steel Heavy Slam 120P, Bug Megahorn 120P, Dragon Outrage 120P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S

**Scrafty** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Dark/Fighting | BST 488 (65/90/115/45/115/58) | Abilities: Shed Skin / Moxie / Intimidate
  Engine stats @252 (neutral/positive): Shed Skin: Atk 279/306, SpA 189/207, Spe 215/236 — Moxie: Atk 279/306, SpA 189/207, Spe 215/236 — Intimidate: Atk 279/306, SpA 189/207, Spe 215/236
  Item: **free**
  STAB: Dark Foul Play 95P · Fighting Focus Punch 150P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P
  Special coverage: Dragon Dragon Pulse 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Grass Grass Knot 60S, Fire Incinerate 60S

**Scream Tail** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Fairy/Psychic | BST 570 (115/65/99/65/115/111) | Abilities: Protosynthesis
  Engine stats @252 (neutral/positive): Protosynthesis: Atk 229/251, SpA 229/251, Spe 321/353
  Item: **free**
  STAB: Fairy Misty Explosion 100S · Psychic Psychic 90S
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Dark Crunch 80P, Fighting Drain Punch 75P, Fire Fire Punch 75P, Ice Ice Punch 75P
  Special coverage: Normal Boomburst 140S, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Grass Knot 60S

**Stakataka** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Rock/Steel | BST 570 (61/131/211/53/101/13) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 361/397, SpA 205/225, Spe 125/137
  Item: **free**
  STAB: Rock Stone Edge 100P · Steel Steel Roller 130P
  Physical coverage: Normal Double-Edge 120P, Fire Heat Crash 120P, Fighting Superpower 120P, Ground Earthquake 100P, Psychic Zen Headbutt 80P, Dark Brutal Swing 60P
  Special coverage: Normal Hidden Power 60S, Bug Infestation 20S

**Staraptor** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Normal/Flying | BST 485 (85/120/70/50/60/100) | Abilities: Intimidate / Reckless
  Engine stats @252 (neutral/positive): Intimidate: Atk 339/372, SpA 199/218, Spe 299/328 — Reckless: Atk 339/372, SpA 199/218, Spe 299/328
  Item: **free**
  STAB: Normal Double-Edge 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Fighting Close Combat 120P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Thief 60P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Bug Struggle Bug 50S, Dragon Twister 40S, Ground Mud-Slap 20S, Fighting Final Gambit fixedS

**Starmie** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Water/Psychic | BST 520 (60/75/85/100/85/115) | Abilities: Illuminate / Natural Cure / Analytic
  Engine stats @252 (neutral/positive): Illuminate: Atk 249/273, SpA 299/328, Spe 329/361 — Natural Cure: Atk 249/273, SpA 299/328, Spe 329/361 — Analytic: Atk 249/273, SpA 299/328, Spe 329/361
  Item: **free**
  STAB: Water Hydro Pump 120S · Psychic Dream Eater 100S
  Physical coverage: Normal Skull Bash 130P, Ice Avalanche 60P, Rock Rollout 30P, Steel Gyro Ball 14P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Normal Tri Attack 80S

**Sylveon** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Fairy | BST 525 (95/65/65/110/130/60) | Abilities: Cute Charm / Pixilate
  Engine stats @252 (neutral/positive): Cute Charm: Atk 229/251, SpA 319/350, Spe 219/240 — Pixilate: Atk 229/251, SpA 319/350, Spe 219/240
  Item: **free**
  STAB: Fairy Misty Explosion 100S
  Physical coverage: Normal Last Resort 140P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Bite 60P, Grass Trailblaze 50P
  Special coverage: Normal Trump Card 200S, Psychic Synchronoise 120S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S, Grass Magical Leaf 60S, Ground Mud-Slap 20S

**Tauros-Paldea-Aqua** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Fighting/Water | BST 490 (75/110/105/30/70/100) | Abilities: Intimidate / Anger Point / Cud Chew
  Engine stats @252 (neutral/positive): Intimidate: Atk 319/350, SpA 159/174, Spe 299/328 — Anger Point: Atk 319/350, SpA 159/174, Spe 299/328 — Cud Chew: Atk 319/350, SpA 159/174, Spe 299/328
  Item: **free**
  STAB: Fighting Close Combat 120P · Water Wave Crash 120P
  Physical coverage: Normal Skull Bash 130P, Bug Megahorn 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Ghost Shadow Ball 80S

**Tentacruel** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water/Poison | BST 515 (80/70/65/80/120/100) | Abilities: Clear Body / Liquid Ooze / Rain Dish
  Engine stats @252 (neutral/positive): Clear Body: Atk 239/262, SpA 259/284, Spe 299/328 — Liquid Ooze: Atk 239/262, SpA 259/284, Spe 299/328 — Rain Dish: Atk 239/262, SpA 259/284, Spe 299/328
  Item: **free**
  STAB: Water Hydro Pump 120S · Poison Gunk Shot 120P
  Physical coverage: Normal Skull Bash 130P, Dark Throat Chop 80P, Bug Skitter Smack 70P
  Special coverage: Ice Blizzard 120S, Normal Wring Out 120S, Fairy Dazzling Gleam 80S, Grass Giga Drain 75S, Ghost Hex 65S, Ground Mud Shot 55S

**Tsareena** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Grass | BST 510 (72/120/98/50/98/72) | Abilities: Leaf Guard / Queenly Majesty / Sweet Veil
  Engine stats @252 (neutral/positive): Leaf Guard: Atk 339/372, SpA 199/218, Spe 243/267 — Queenly Majesty: Atk 339/372, SpA 199/218, Spe 243/267 — Sweet Veil: Atk 339/372, SpA 199/218, Spe 243/267
  Item: **free**
  STAB: Grass Solar Blade 125 (charge)P
  Physical coverage: Fighting High Jump Kick 130P, Normal Mega Kick 120P, Flying Acrobatics 110P, Fairy Play Rough 90P, Psychic Zen Headbutt 80P, Bug U-turn 70P
  Special coverage: Fairy Dazzling Gleam 80S, Normal Tera Blast 80S

**Tyrantrum** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Rock/Dragon | BST 521 (82/121/119/69/59/71) | Abilities: Strong Jaw / Rock Head
  Engine stats @252 (neutral/positive): Strong Jaw: Atk 341/375, SpA 237/260, Spe 241/265 — Rock Head: Atk 341/375, SpA 237/260, Spe 241/265
  Item: **free**
  STAB: Rock Head Smash 150P · Dragon Outrage 120P
  Physical coverage: Fighting Close Combat 120P, Normal Thrash 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P
  Special coverage: Ground Earth Power 90S, Normal Hyper Voice 90S, Dark Dark Pulse 80S

**Uxie** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Psychic | BST 580 (75/75/130/75/130/95) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 249/273, SpA 249/273, Spe 289/317
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Steel Iron Tail 100P, Dark Foul Play 95P, Fairy Play Rough 90P, Fighting Drain Punch 75P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Vanilluxe** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Ice | BST 535 (71/95/85/110/95/79) | Abilities: Ice Body / Snow Warning / Weak Armor
  Engine stats @252 (neutral/positive): Ice Body: Atk 289/317, SpA 319/350, Spe 257/282 — Snow Warning: Atk 289/317, SpA 319/350, Spe 257/282 — Weak Armor: Atk 289/317, SpA 319/350, Spe 257/282
  Item: **free**
  STAB: Ice Blizzard 120S
  Physical coverage: Normal Explosion 250P, Ghost Astonish 30P, Dark Beat Up 10P
  Special coverage: Normal Hyper Voice 90S, Steel Flash Cannon 80S, Bug Signal Beam 75S, Water Water Pulse 60S, Psychic Mirror Coat fixedS

**Vaporeon** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water | BST 525 (130/65/60/110/95/65) | Abilities: Water Absorb / Hydration
  Engine stats @252 (neutral/positive): Water Absorb: Atk 229/251, SpA 319/350, Spe 229/251 — Hydration: Atk 229/251, SpA 319/350, Spe 229/251
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Last Resort 140P, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Bite 60P, Grass Trailblaze 50P
  Special coverage: Normal Trump Card 200S, Ice Blizzard 120S, Psychic Synchronoise 120S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Xatu** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Psychic/Flying | BST 470 (65/75/70/95/70/95) | Abilities: Synchronize / Early Bird / Magic Bounce
  Engine stats @252 (neutral/positive): Synchronize: Atk 249/273, SpA 289/317, Spe 289/317 — Early Bird: Atk 249/273, SpA 289/317, Spe 289/317 — Magic Bounce: Atk 249/273, SpA 289/317, Spe 289/317
  Item: **free**
  STAB: Psychic Future Sight 120S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Dark Foul Play 95P, Steel Steel Wing 70P, Bug U-turn 70P
  Special coverage: Grass Solar Beam 120 (charge)S, Fire Heat Wave 100S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Normal Hidden Power 60S
---

## F. Estimated-forme audit

**0 PU formes carry an `estimated` tier** — Smogon never
ranked them, so a nearest-neighbour model placed them by BST and base tier. **The
model has no notion of movepool, ability, matchup structure or item opportunity
cost**, which is exactly what it got wrong on Mega Starmie in the UU pass. These
are the softest placements in PU and estimated placement is **soft evidence only**.

**ZU has 0 estimated formes; NU has 0.**

_No PU forme carries an estimated tier — every forme entry in PU is imported or an explicit override._
---

## G. Serious PU → NU candidate evidence

**No fixed cap.** 42 of 110 PU entries tripped two
or more mechanical flags in the scan; the 41 with usable
offensive sets get a full matrix below, against the same PU defensive core.

**Flags are reasons to look, not verdicts.**

### Dugtrio

_Flagged for: Speed **372**; setup + priority + reliable recovery; strong setup on a fast frame; **trapping ability: Arena Trap**; **trapping + setup**; **trapping + reliable recovery**._

**Dugtrio** — species, **PU**, source: override
  Ground | BST 425 (35/100/50/50/70/120) | Abilities: Sand Veil / Arena Trap / Sand Force
  Engine stats @252 (neutral/positive): Sand Veil: Atk 299/328, SpA 199/218, Spe 339/372 — Arena Trap: Atk 299/328, SpA 199/218, Spe 339/372 — Sand Force: Atk 299/328, SpA 199/218, Spe 339/372
  **TRAPPING ABILITY: Arena Trap** (optional — one of 3)
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

Attacker: **Dugtrio**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Earthquake | Double-Edge | Stone Edge | Foul Play |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 16-19 (4.7-5.5%) | 28-32 (8.1-9.3%) | 46-54 (13.4-15.7%) |
| Avalugg-Hisui (physWall, Leftovers) | 167-197 (42.4-50%) | 32-39 (8.1-9.9%) | 111-131 (28.2-33.2%) | 52-61 (13.2-15.5%) |
| Milotic (specWall, Leftovers) | 217-256 (55.1-65%) | 172-204 (43.7-51.8%) | 144-170 (36.5-43.1%) | 65-76 (16.5-19.3%) |
| Florges (specWall, Leftovers) | 244-288 (67.8-80%) | 195-230 (54.2-63.9%) | 162-192 (45-53.3%) | 39-45 (10.8-12.5%) |
| Snorlax (specWall, Leftovers) | 253-297 (48.3-56.7%) | 202-237 (38.5-45.2%) | 169-198 (32.3-37.8%) | 123-145 (23.5-27.7%) |
| Mudsdale (physWall, Leftovers) | 130-152 (32.2-37.6%) | 102-120 (25.2-29.7%) | 42-50 (10.4-12.4%) | 78-92 (19.3-22.8%) |
| Jellicent (specWall, Leftovers) | 239-282 (59.2-69.8%) | 0-0 (0-0%) | 158-187 (39.1-46.3%) | 144-169 (35.6-41.8%) |
| Claydol (specWall, Leftovers) | 171-202 (52.8-62.3%) | 136-161 (42-49.7%) | 57-67 (17.6-20.7%) | 117-137 (36.1-42.3%) |
| Eldegoss (specWall, Leftovers) | 97-114 (29.9-35.2%) | 156-183 (48.1-56.5%) | 130-153 (40.1-47.2%) | 52-61 (16-18.8%) |
| Wo-Chien (specWall, Leftovers) | 67-79 (17.9-21.1%) | 107-126 (28.6-33.7%) | 89-105 (23.8-28.1%) | 36-42 (9.6-11.2%) |
| Gigalith (physWall, Leftovers) | 217-256 (58-68.4%) | 42-50 (11.2-13.4%) | 71-84 (19-22.5%) | 70-81 (18.7-21.7%) |
| Coalossal (physWall, Leftovers) | 460-542 (108.5-127.8%) | 45-53 (10.6-12.5%) | 153-180 (36.1-42.5%) | 48-57 (11.3-13.4%) |
| Turtonator (physWall, Leftovers) | 211-249 (65.1-76.9%) | 83-98 (25.6-30.2%) | 140-166 (43.2-51.2%) | 42-50 (13-15.4%) |
| Alcremie (specWall, Leftovers) | 226-266 (67.7-79.6%) | 180-213 (53.9-63.8%) | 150-178 (44.9-53.3%) | 33-40 (9.9-12%) |
| Audino-Mega (physWall, no item) | 110-130 (26.8-31.7%) | 88-104 (21.5-25.4%) | 74-87 (18-21.2%) | 18-22 (4.4-5.4%) |
| Slowbro-Galar (physWall, Leftovers) | 269-315 (68.3-79.9%) | 106-126 (26.9-32%) | 89-105 (22.6-26.6%) | 135-158 (34.3-40.1%) |
| Vileplume (specWall, Black Sludge) | 205-240 (57.9-67.8%) | 163-192 (46-54.2%) | 136-159 (38.4-44.9%) | 76-91 (21.5-25.7%) |
| Lanturn (specWall, Leftovers) | 553-651 (121.8-143.4%) | 221-260 (48.7-57.3%) | 184-217 (40.5-47.8%) | 80-94 (17.6-20.7%) |
| Sandslash-Alola (physWall, Leftovers) | 230-270 (65-76.3%) | 45-53 (12.7-15%) | 76-89 (21.5-25.1%) | 57-67 (16.1-18.9%) |
| Wishiwashi-School (physWall, Leftovers) | 107-127 (36.4-43.2%) | 85-101 (28.9-34.4%) | 71-84 (24.1-28.6%) | 72-85 (24.5-28.9%) |

---

### Ambipom

_Flagged for: Speed **361**; setup + priority + reliable recovery; strong setup on a fast frame; ability: Technician/Skill Link._

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

Attacker: **Ambipom**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Last Resort | Focus Punch | Gunk Shot | Acrobatics |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 28-33 (8.1-9.6%) | 338-343 (98.3-99.7%) | 0-0 (0-0%) | 11-13 (3.2-3.8%) |
| Avalugg-Hisui (physWall, Leftovers) | 57-67 (14.5-17%) | 332-391 (84.3-99.2%) | 32-39 (8.1-9.9%) | 22-27 (5.6-6.9%) |
| Milotic (specWall, Leftovers) | 302-356 (76.6-90.4%) | 215-254 (54.6-64.5%) | 172-204 (43.7-51.8%) | 118-140 (29.9-35.5%) |
| Florges (specWall, Leftovers) | 341-401 (94.7-111.4%) | 120-143 (33.3-39.7%) | 391-460 (108.6-127.8%) | 133-157 (36.9-43.6%) |
| Snorlax (specWall, Leftovers) | 353-416 (67.4-79.4%) | 505-594 (96.4-113.4%) | 202-237 (38.5-45.2%) | 139-163 (26.5-31.1%) |
| Mudsdale (physWall, Leftovers) | 180-211 (44.6-52.2%) | 128-150 (31.7-37.1%) | 50-59 (12.4-14.6%) | 71-83 (17.6-20.5%) |
| Jellicent (specWall, Leftovers) | 0-0 (0-0%) | 0-0 (0-0%) | 94-111 (23.3-27.5%) | 131-154 (32.4-38.1%) |
| Claydol (specWall, Leftovers) | 239-282 (73.8-87%) | 84-100 (25.9-30.9%) | 67-80 (20.7-24.7%) | 93-110 (28.7-34%) |
| Eldegoss (specWall, Leftovers) | 273-321 (84.3-99.1%) | 193-228 (59.6-70.4%) | 312-367 (96.3-113.3%) | 214-252 (66-77.8%) |
| Wo-Chien (specWall, Leftovers) | 187-221 (50-59.1%) | 267-315 (71.4-84.2%) | 215-253 (57.5-67.6%) | 148-174 (39.6-46.5%) |
| Gigalith (physWall, Leftovers) | 75-88 (20.1-23.5%) | 214-253 (57.2-67.6%) | 42-50 (11.2-13.4%) | 29-35 (7.8-9.4%) |
| Coalossal (physWall, Leftovers) | 79-93 (18.6-21.9%) | 227-267 (53.5-63%) | 45-53 (10.6-12.5%) | 31-36 (7.3-8.5%) |
| Turtonator (physWall, Leftovers) | 146-172 (45.1-53.1%) | 104-123 (32.1-38%) | 83-98 (25.6-30.2%) | 57-67 (17.6-20.7%) |
| Alcremie (specWall, Leftovers) | 315-371 (94.3-111.1%) | 111-132 (33.2-39.5%) | 361-426 (108.1-127.5%) | 123-145 (36.8-43.4%) |
| Audino-Mega (physWall, no item) | 153-180 (37.3-43.9%) | 109-128 (26.6-31.2%) | 176-208 (42.9-50.7%) | 61-71 (14.9-17.3%) |
| Slowbro-Galar (physWall, Leftovers) | 185-219 (47-55.6%) | 32-39 (8.1-9.9%) | 53-62 (13.5-15.7%) | 72-85 (18.3-21.6%) |
| Vileplume (specWall, Black Sludge) | 286-336 (80.8-94.9%) | 101-119 (28.5-33.6%) | 163-192 (46-54.2%) | 224-263 (63.3-74.3%) |
| Lanturn (specWall, Leftovers) | 386-453 (85-99.8%) | 275-323 (60.6-71.1%) | 221-260 (48.7-57.3%) | 75-88 (16.5-19.4%) |
| Sandslash-Alola (physWall, Leftovers) | 79-93 (22.3-26.3%) | 456-536 (128.8-151.4%) | 0-0 (0-0%) | 31-36 (8.8-10.2%) |
| Wishiwashi-School (physWall, Leftovers) | 150-176 (51-59.9%) | 106-126 (36.1-42.9%) | 85-101 (28.9-34.4%) | 59-70 (20.1-23.8%) |

---

### Gothorita

_Flagged for: setup + priority + reliable recovery; **trapping ability: Shadow Tag**; **trapping + setup**; **trapping + reliable recovery**._

**Gothorita** — species, **PU**, source: override
  Psychic | BST 390 (60/45/70/75/85/55) | Abilities: Frisk / Competitive / Shadow Tag
  Engine stats @252 (neutral/positive): Frisk: Atk 189/207, SpA 249/273, Spe 209/229 — Competitive: Atk 189/207, SpA 249/273, Spe 209/229 — Shadow Tag: Atk 189/207, SpA 249/273, Spe 209/229
  **TRAPPING ABILITY: Shadow Tag** (optional — one of 3)
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
  Trapping moves: Mean Look
  Weather/terrain: Psychic Terrain, Rain Dance
  Utility: Gravity, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

Attacker: **Gothorita**, modest {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Future Sight | Thunderbolt | Energy Ball | Uproar |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 146-172 (42.4-50%) | 156-183 (45.3-53.2%) | 148-174 (43-50.6%) | 36-42 (10.5-12.2%) |
| Avalugg-Hisui (physWall, Leftovers) | 425-500 (107.9-126.9%) | 224-263 (56.9-66.8%) | 426-501 (108.1-127.2%) | 106-124 (26.9-31.5%) |
| Milotic (specWall, Leftovers) | 122-143 (31-36.3%) | 130-152 (33-38.6%) | 123-144 (31.2-36.5%) | 61-71 (15.5-18%) |
| Florges (specWall, Leftovers) | 105-123 (29.2-34.2%) | 55-65 (15.3-18.1%) | 52-62 (14.4-17.2%) | 52-62 (14.4-17.2%) |
| Snorlax (specWall, Leftovers) | 132-156 (25.2-29.8%) | 70-83 (13.4-15.8%) | 66-78 (12.6-14.9%) | 66-78 (12.6-14.9%) |
| Mudsdale (physWall, Leftovers) | 223-263 (55.2-65.1%) | 0-0 (0-0%) | 224-265 (55.4-65.6%) | 111-132 (27.5-32.7%) |
| Jellicent (specWall, Leftovers) | 137-161 (33.9-39.9%) | 145-171 (35.9-42.3%) | 137-162 (33.9-40.1%) | 0-0 (0-0%) |
| Claydol (specWall, Leftovers) | 62-72 (19.1-22.2%) | 0-0 (0-0%) | 126-148 (38.9-45.7%) | 62-74 (19.1-22.8%) |
| Eldegoss (specWall, Leftovers) | 124-146 (38.3-45.1%) | 32-39 (9.9-12%) | 31-36 (9.6-11.1%) | 62-74 (19.1-22.8%) |
| Wo-Chien (specWall, Leftovers) | 0-0 (0-0%) | 29-35 (7.8-9.4%) | 28-33 (7.5-8.8%) | 58-67 (15.5-17.9%) |
| Gigalith (physWall, Leftovers) | 235-276 (62.8-73.8%) | 124-146 (33.2-39%) | 236-278 (63.1-74.3%) | 58-68 (15.5-18.2%) |
| Coalossal (physWall, Leftovers) | 213-252 (50.2-59.4%) | 113-132 (26.7-31.1%) | 106-126 (25-29.7%) | 53-62 (12.5-14.6%) |
| Turtonator (physWall, Leftovers) | 223-263 (68.8-81.2%) | 58-68 (17.9-21%) | 27-32 (8.3-9.9%) | 111-132 (34.3-40.7%) |
| Alcremie (specWall, Leftovers) | 124-146 (37.1-43.7%) | 66-78 (19.8-23.4%) | 62-74 (18.6-22.2%) | 62-74 (18.6-22.2%) |
| Audino-Mega (physWall, no item) | 161-189 (39.3-46.1%) | 84-100 (20.5-24.4%) | 80-94 (19.5-22.9%) | 80-94 (19.5-22.9%) |
| Slowbro-Galar (physWall, Leftovers) | 261-308 (66.2-78.2%) | 137-162 (34.8-41.1%) | 65-76 (16.5-19.3%) | 131-154 (33.2-39.1%) |
| Vileplume (specWall, Black Sludge) | 304-357 (85.9-100.8%) | 40-46 (11.3-13%) | 18-22 (5.1-6.2%) | 76-89 (21.5-25.1%) |
| Lanturn (specWall, Leftovers) | 167-197 (36.8-43.4%) | 88-104 (19.4-22.9%) | 169-198 (37.2-43.6%) | 84-98 (18.5-21.6%) |
| Sandslash-Alola (physWall, Leftovers) | 137-162 (38.7-45.8%) | 146-172 (41.2-48.6%) | 68-81 (19.2-22.9%) | 68-81 (19.2-22.9%) |
| Wishiwashi-School (physWall, Leftovers) | 152-178 (51.7-60.5%) | 161-189 (54.8-64.3%) | 153-179 (52-60.9%) | 76-89 (25.9-30.3%) |

---

### Medicham

_Flagged for: Attack **480**; Attack reaches 480 off base 60 — an ability is doing the work; setup + priority + reliable recovery; ability: Pure Power._

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

Attacker: **Medicham**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Focus Punch | Zen Headbutt | Double-Edge | Poison Jab |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 54-63 (15.7-18.3%) | 26-31 (7.6-9%) | 0-0 (0-0%) |
| Avalugg-Hisui (physWall, Leftovers) | 794-934 (201.5-237.1%) | 106-126 (26.9-32%) | 52-62 (13.2-15.7%) | 35-41 (8.9-10.4%) |
| Milotic (specWall, Leftovers) | 520-611 (132-155.1%) | 278-327 (70.6-83%) | 276-326 (70.1-82.7%) | 185-218 (47-55.3%) |
| Florges (specWall, Leftovers) | 292-344 (81.1-95.6%) | 313-369 (86.9-102.5%) | 312-367 (86.7-101.9%) | 418-492 (116.1-136.7%) |
| Snorlax (specWall, Leftovers) | 1214-1428 (231.7-272.5%) | 325-382 (62-72.9%) | 323-380 (61.6-72.5%) | 215-254 (41-48.5%) |
| Mudsdale (physWall, Leftovers) | 308-362 (76.2-89.6%) | 165-195 (40.8-48.3%) | 165-193 (40.8-47.8%) | 54-65 (13.4-16.1%) |
| Jellicent (specWall, Leftovers) | 0-0 (0-0%) | 306-360 (75.7-89.1%) | 0-0 (0-0%) | 101-119 (25-29.5%) |
| Claydol (specWall, Leftovers) | 205-240 (63.3-74.1%) | 109-128 (33.6-39.5%) | 218-257 (67.3-79.3%) | 72-85 (22.2-26.2%) |
| Eldegoss (specWall, Leftovers) | 466-549 (143.8-169.4%) | 249-295 (76.9-91%) | 249-293 (76.9-90.4%) | 334-392 (103.1-121%) |
| Wo-Chien (specWall, Leftovers) | 643-756 (171.9-202.1%) | 0-0 (0-0%) | 171-201 (45.7-53.7%) | 230-271 (61.5-72.5%) |
| Gigalith (physWall, Leftovers) | 373-373 (99.7-99.7%) | 137-162 (36.6-43.3%) | 68-80 (18.2-21.4%) | 45-53 (12-14.2%) |
| Coalossal (physWall, Leftovers) | 544-640 (128.3-150.9%) | 146-172 (34.4-40.6%) | 72-85 (17-20%) | 48-57 (11.3-13.4%) |
| Turtonator (physWall, Leftovers) | 249-295 (76.9-91%) | 135-158 (41.7-48.8%) | 133-157 (41-48.5%) | 89-105 (27.5-32.4%) |
| Alcremie (specWall, Leftovers) | 270-318 (80.8-95.2%) | 289-341 (86.5-102.1%) | 288-340 (86.2-101.8%) | 387-455 (115.9-136.2%) |
| Audino-Mega (physWall, no item) | 262-309 (63.9-75.4%) | 141-166 (34.4-40.5%) | 140-165 (34.1-40.2%) | 188-222 (45.9-54.1%) |
| Slowbro-Galar (physWall, Leftovers) | 79-93 (20.1-23.6%) | 171-201 (43.4-51%) | 170-200 (43.1-50.8%) | 57-66 (14.5-16.8%) |
| Vileplume (specWall, Black Sludge) | 244-287 (68.9-81.1%) | 525-617 (148.3-174.3%) | 261-306 (73.7-86.4%) | 174-205 (49.2-57.9%) |
| Lanturn (specWall, Leftovers) | 661-778 (145.6-171.4%) | 354-417 (78-91.9%) | 353-416 (77.8-91.6%) | 236-278 (52-61.2%) |
| Sandslash-Alola (physWall, Leftovers) | 1090-1283 (307.9-362.4%) | 72-85 (20.3-24%) | 72-85 (20.3-24%) | 0-0 (0-0%) |
| Wishiwashi-School (physWall, Leftovers) | 257-302 (87.4-102.7%) | 137-162 (46.6-55.1%) | 137-161 (46.6-54.8%) | 92-107 (31.3-36.4%) |

---

### Salazzle

_Flagged for: Speed **366**; setup + priority + reliable recovery; strong setup on a fast frame; ability: Corrosion._

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

Attacker: **Salazzle**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Belch | Overheat | Dragon Pulse | Hyper Voice |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 0-0 (0-0%) | 343-343 (99.7-99.7%) | 85-101 (24.7-29.4%) | 42-50 (12.2-14.5%) |
| Avalugg-Hisui (physWall, Leftovers) | 249-293 (63.2-74.4%) | 582-685 (147.7-173.9%) | 249-293 (63.2-74.4%) | 124-146 (31.5-37.1%) |
| Milotic (specWall, Leftovers) | 143-167 (36.3-42.4%) | 83-97 (21.1-24.6%) | 71-84 (18-21.3%) | 71-84 (18-21.3%) |
| Florges (specWall, Leftovers) | 245-289 (68.1-80.3%) | 143-167 (39.7-46.4%) | 0-0 (0-0%) | 61-72 (16.9-20%) |
| Snorlax (specWall, Leftovers) | 156-183 (29.8-34.9%) | 182-213 (34.7-40.6%) | 78-92 (14.9-17.6%) | 78-92 (14.9-17.6%) |
| Mudsdale (physWall, Leftovers) | 131-154 (32.4-38.1%) | 306-360 (75.7-89.1%) | 131-154 (32.4-38.1%) | 131-154 (32.4-38.1%) |
| Jellicent (specWall, Leftovers) | 80-94 (19.8-23.3%) | 93-110 (23-27.2%) | 80-94 (19.8-23.3%) | 0-0 (0-0%) |
| Claydol (specWall, Leftovers) | 72-85 (22.2-26.2%) | 170-201 (52.5-62%) | 74-87 (22.8-26.9%) | 74-87 (22.8-26.9%) |
| Eldegoss (specWall, Leftovers) | 293-345 (90.4-106.5%) | 341-403 (105.2-124.4%) | 74-87 (22.8-26.9%) | 74-87 (22.8-26.9%) |
| Wo-Chien (specWall, Leftovers) | 270-318 (72.2-85%) | 314-370 (84-98.9%) | 67-79 (17.9-21.1%) | 67-79 (17.9-21.1%) |
| Gigalith (physWall, Leftovers) | 137-162 (36.6-43.3%) | 161-188 (43-50.3%) | 137-162 (36.6-43.3%) | 68-80 (18.2-21.4%) |
| Coalossal (physWall, Leftovers) | 124-146 (29.2-34.4%) | 72-85 (17-20%) | 126-148 (29.7-34.9%) | 62-74 (14.6-17.5%) |
| Turtonator (physWall, Leftovers) | 262-309 (80.9-95.4%) | 76-89 (23.5-27.5%) | 263-310 (81.2-95.7%) | 131-154 (40.4-47.5%) |
| Alcremie (specWall, Leftovers) | 292-343 (87.4-102.7%) | 169-198 (50.6-59.3%) | 0-0 (0-0%) | 72-85 (21.6-25.4%) |
| Audino-Mega (physWall, no item) | 378-445 (92.2-108.5%) | 219-258 (53.4-62.9%) | 0-0 (0-0%) | 94-111 (22.9-27.1%) |
| Slowbro-Galar (physWall, Leftovers) | 153-180 (38.8-45.7%) | 358-421 (90.9-106.9%) | 153-180 (38.8-45.7%) | 153-180 (38.8-45.7%) |
| Vileplume (specWall, Black Sludge) | 178-209 (50.3-59%) | 414-488 (116.9-137.9%) | 89-105 (25.1-29.7%) | 89-105 (25.1-29.7%) |
| Lanturn (specWall, Leftovers) | 197-231 (43.4-50.9%) | 114-135 (25.1-29.7%) | 98-115 (21.6-25.3%) | 98-115 (21.6-25.3%) |
| Sandslash-Alola (physWall, Leftovers) | 0-0 (0-0%) | 1519-1788 (429.1-505.1%) | 80-96 (22.6-27.1%) | 80-96 (22.6-27.1%) |
| Wishiwashi-School (physWall, Leftovers) | 178-209 (60.5-71.1%) | 102-122 (34.7-41.5%) | 89-105 (30.3-35.7%) | 89-105 (30.3-35.7%) |

---

### Archeops

_Flagged for: BST 567; setup + priority + reliable recovery; hazards + real offence._

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

Attacker: **Archeops**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Head Smash | Sky Attack | Outrage | Thrash |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 79-93 (23-27%) | 36-42 (10.5-12.2%) | 42-49 (12.2-14.2%) | 20-24 (5.8-7%) |
| Avalugg-Hisui (physWall, Leftovers) | 314-370 (79.7-93.9%) | 72-85 (18.3-21.6%) | 83-98 (21.1-24.9%) | 41-49 (10.4-12.4%) |
| Milotic (specWall, Leftovers) | 410-483 (104.1-122.6%) | 383-451 (97.2-114.5%) | 219-257 (55.6-65.2%) | 219-257 (55.6-65.2%) |
| Florges (specWall, Leftovers) | 462-544 (128.3-151.1%) | 431-508 (119.7-141.1%) | 0-0 (0-0%) | 247-291 (68.6-80.8%) |
| Snorlax (specWall, Leftovers) | 479-564 (91.4-107.6%) | 447-526 (85.3-100.4%) | 256-301 (48.9-57.4%) | 256-301 (48.9-57.4%) |
| Mudsdale (physWall, Leftovers) | 122-143 (30.2-35.4%) | 227-267 (56.2-66.1%) | 130-153 (32.2-37.9%) | 130-153 (32.2-37.9%) |
| Jellicent (specWall, Leftovers) | 452-531 (111.9-131.4%) | 422-496 (104.5-122.8%) | 241-284 (59.7-70.3%) | 0-0 (0-0%) |
| Claydol (specWall, Leftovers) | 162-191 (50-59%) | 302-356 (93.2-109.9%) | 172-204 (53.1-63%) | 172-204 (53.1-63%) |
| Eldegoss (specWall, Leftovers) | 369-434 (113.9-134%) | 690-812 (213-250.6%) | 197-231 (60.8-71.3%) | 197-231 (60.8-71.3%) |
| Wo-Chien (specWall, Leftovers) | 253-299 (67.6-79.9%) | 474-559 (126.7-149.5%) | 135-159 (36.1-42.5%) | 135-159 (36.1-42.5%) |
| Gigalith (physWall, Leftovers) | 204-239 (54.5-63.9%) | 94-111 (25.1-29.7%) | 109-127 (29.1-34%) | 54-63 (14.4-16.8%) |
| Coalossal (physWall, Leftovers) | 431-508 (101.7-119.8%) | 100-118 (23.6-27.8%) | 114-135 (26.9-31.8%) | 57-67 (13.4-15.8%) |
| Turtonator (physWall, Leftovers) | 396-466 (122.2-143.8%) | 184-218 (56.8-67.3%) | 211-249 (65.1-76.9%) | 105-124 (32.4-38.3%) |
| Alcremie (specWall, Leftovers) | 427-504 (127.8-150.9%) | 400-470 (119.8-140.7%) | 0-0 (0-0%) | 228-269 (68.3-80.5%) |
| Audino-Mega (physWall, no item) | 208-244 (50.7-59.5%) | 193-228 (47.1-55.6%) | 0-0 (0-0%) | 110-130 (26.8-31.7%) |
| Slowbro-Galar (physWall, Leftovers) | 252-296 (64-75.1%) | 235-276 (59.6-70.1%) | 135-158 (34.3-40.1%) | 135-158 (34.3-40.1%) |
| Vileplume (specWall, Black Sludge) | 387-455 (109.3-128.5%) | 722-851 (204-240.4%) | 206-243 (58.2-68.6%) | 206-243 (58.2-68.6%) |
| Lanturn (specWall, Leftovers) | 523-616 (115.2-135.7%) | 244-287 (53.7-63.2%) | 279-328 (61.5-72.2%) | 279-328 (61.5-72.2%) |
| Sandslash-Alola (physWall, Leftovers) | 215-253 (60.7-71.5%) | 100-118 (28.2-33.3%) | 57-67 (16.1-18.9%) | 57-67 (16.1-18.9%) |
| Wishiwashi-School (physWall, Leftovers) | 204-239 (69.4-81.3%) | 189-223 (64.3-75.9%) | 109-127 (37.1-43.2%) | 109-127 (37.1-43.2%) |

---

### Bruxish

_Flagged for: setup + priority + reliable recovery; strong setup on a fast frame; ability: Strong Jaw._

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

Attacker: **Bruxish**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Hydro Pump | Synchronoise | Return | Iron Tail |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 85-101 (24.7-29.4%) | 15-18 (4.4-5.2%) | 63-75 (18.3-21.8%) |
| Avalugg-Hisui (physWall, Leftovers) | 495-582 (125.6-147.7%) | 247-291 (62.7-73.9%) | 31-37 (7.9-9.4%) | 253-299 (64.2-75.9%) |
| Milotic (specWall, Leftovers) | 35-41 (8.9-10.4%) | 71-84 (18-21.3%) | 166-196 (42.1-49.7%) | 81-96 (20.6-24.4%) |
| Florges (specWall, Leftovers) | 61-72 (16.9-20%) | 61-72 (16.9-20%) | 188-221 (52.2-61.4%) | 369-435 (102.5-120.8%) |
| Snorlax (specWall, Leftovers) | 78-92 (14.9-17.6%) | 78-92 (14.9-17.6%) | 195-228 (37.2-43.5%) | 191-224 (36.5-42.7%) |
| Mudsdale (physWall, Leftovers) | 262-308 (64.9-76.2%) | 131-153 (32.4-37.9%) | 98-117 (24.3-29%) | 97-114 (24-28.2%) |
| Jellicent (specWall, Leftovers) | 40-46 (9.9-11.4%) | 80-94 (19.8-23.3%) | 0-0 (0-0%) | 89-105 (22-26%) |
| Claydol (specWall, Leftovers) | 148-174 (45.7-53.7%) | 36-42 (11.1-13%) | 132-156 (40.7-48.1%) | 130-152 (40.1-46.9%) |
| Eldegoss (specWall, Leftovers) | 36-42 (11.1-13%) | 74-87 (22.8-26.9%) | 149-176 (46-54.3%) | 146-172 (45.1-53.1%) |
| Wo-Chien (specWall, Leftovers) | 33-39 (8.8-10.4%) | 0-0 (0-0%) | 104-122 (27.8-32.6%) | 101-119 (27-31.8%) |
| Gigalith (physWall, Leftovers) | 275-323 (73.5-86.4%) | 137-161 (36.6-43%) | 41-48 (11-12.8%) | 163-192 (43.6-51.3%) |
| Coalossal (physWall, Leftovers) | 501-590 (118.2-139.2%) | 124-146 (29.2-34.4%) | 44-52 (10.4-12.3%) | 85-101 (20-23.8%) |
| Turtonator (physWall, Leftovers) | 131-153 (40.4-47.2%) | 131-153 (40.4-47.2%) | 80-94 (24.7-29%) | 39-46 (12-14.2%) |
| Alcremie (specWall, Leftovers) | 72-85 (21.6-25.4%) | 72-85 (21.6-25.4%) | 174-205 (52.1-61.4%) | 341-403 (102.1-120.7%) |
| Audino-Mega (physWall, no item) | 94-110 (22.9-26.8%) | 94-110 (22.9-26.8%) | 84-100 (20.5-24.4%) | 166-196 (40.5-47.8%) |
| Slowbro-Galar (physWall, Leftovers) | 152-179 (38.6-45.4%) | 152-179 (38.6-45.4%) | 102-120 (25.9-30.5%) | 101-118 (25.6-29.9%) |
| Vileplume (specWall, Black Sludge) | 44-52 (12.4-14.7%) | 178-210 (50.3-59.3%) | 157-184 (44.4-52%) | 154-182 (43.5-51.4%) |
| Lanturn (specWall, Leftovers) | 49-57 (10.8-12.6%) | 98-115 (21.6-25.3%) | 213-250 (46.9-55.1%) | 52-61 (11.5-13.4%) |
| Sandslash-Alola (physWall, Leftovers) | 161-189 (45.5-53.4%) | 80-94 (22.6-26.6%) | 44-52 (12.4-14.7%) | 85-101 (24-28.5%) |
| Wishiwashi-School (physWall, Leftovers) | 44-52 (15-17.7%) | 88-105 (29.9-35.7%) | 83-97 (28.2-33%) | 40-48 (13.6-16.3%) |

---

### Floatzel

_Flagged for: Speed **361**; setup + priority + reliable recovery; strong setup on a fast frame._

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

Attacker: **Floatzel**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Hydro Pump | Focus Punch | Double-Edge | Iron Tail |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 343-343 (99.7-99.7%) | 16-19 (4.7-5.5%) | 58-68 (16.9-19.8%) |
| Avalugg-Hisui (physWall, Leftovers) | 578-681 (146.7-172.8%) | 343-404 (87.1-102.5%) | 33-40 (8.4-10.2%) | 231-273 (58.6-69.3%) |
| Milotic (specWall, Leftovers) | 41-49 (10.4-12.4%) | 223-262 (56.6-66.5%) | 179-210 (45.4-53.3%) | 74-87 (18.8-22.1%) |
| Florges (specWall, Leftovers) | 71-84 (19.7-23.3%) | 126-148 (35-41.1%) | 201-237 (55.8-65.8%) | 336-396 (93.3-110%) |
| Snorlax (specWall, Leftovers) | 91-106 (17.4-20.2%) | 522-614 (99.6-117.2%) | 209-245 (39.9-46.8%) | 174-205 (33.2-39.1%) |
| Mudsdale (physWall, Leftovers) | 305-360 (75.5-89.1%) | 132-156 (32.7-38.6%) | 106-124 (26.2-30.7%) | 88-105 (21.8-26%) |
| Jellicent (specWall, Leftovers) | 46-54 (11.4-13.4%) | 0-0 (0-0%) | 0-0 (0-0%) | 81-96 (20-23.8%) |
| Claydol (specWall, Leftovers) | 171-202 (52.8-62.3%) | 88-104 (27.2-32.1%) | 141-166 (43.5-51.2%) | 118-139 (36.4-42.9%) |
| Eldegoss (specWall, Leftovers) | 42-50 (13-15.4%) | 200-236 (61.7-72.8%) | 161-189 (49.7-58.3%) | 133-158 (41-48.8%) |
| Wo-Chien (specWall, Leftovers) | 39-46 (10.4-12.3%) | 276-325 (73.8-86.9%) | 110-130 (29.4-34.8%) | 92-109 (24.6-29.1%) |
| Gigalith (physWall, Leftovers) | 321-373 (85.8-99.7%) | 222-261 (59.4-69.8%) | 44-52 (11.8-13.9%) | 149-175 (39.8-46.8%) |
| Coalossal (physWall, Leftovers) | 585-689 (138-162.5%) | 235-276 (55.4-65.1%) | 46-54 (10.8-12.7%) | 79-92 (18.6-21.7%) |
| Turtonator (physWall, Leftovers) | 152-179 (46.9-55.2%) | 107-127 (33-39.2%) | 87-101 (26.9-31.2%) | 36-42 (11.1-13%) |
| Alcremie (specWall, Leftovers) | 84-100 (25.1-29.9%) | 115-136 (34.4-40.7%) | 187-219 (56-65.6%) | 312-367 (93.4-109.9%) |
| Audino-Mega (physWall, no item) | 110-130 (26.8-31.7%) | 113-132 (27.6-32.2%) | 91-106 (22.2-25.9%) | 152-179 (37.1-43.7%) |
| Slowbro-Galar (physWall, Leftovers) | 178-209 (45.2-53%) | 33-40 (8.4-10.2%) | 110-130 (27.9-33%) | 92-107 (23.4-27.2%) |
| Vileplume (specWall, Black Sludge) | 52-61 (14.7-17.2%) | 105-123 (29.7-34.7%) | 169-198 (47.7-55.9%) | 140-166 (39.5-46.9%) |
| Lanturn (specWall, Leftovers) | 57-67 (12.6-14.8%) | 284-335 (62.6-73.8%) | 227-267 (50-58.8%) | 46-55 (10.1-12.1%) |
| Sandslash-Alola (physWall, Leftovers) | 188-222 (53.1-62.7%) | 470-553 (132.8-156.2%) | 46-54 (13-15.3%) | 79-92 (22.3-26%) |
| Wishiwashi-School (physWall, Leftovers) | 52-61 (17.7-20.7%) | 110-130 (37.4-44.2%) | 88-105 (29.9-35.7%) | 36-42 (12.2-14.3%) |

---

### Lampent

_Flagged for: **trapping ability: Shadow Tag**; **trapping + setup**; **trapping + reliable recovery**._

**Lampent** — species, **PU**, source: override
  Ghost/Fire | BST 370 (60/40/60/95/60/55) | Abilities: Flash Fire / Flame Body / Infiltrator / Shadow Tag
  Engine stats @252 (neutral/positive): Flash Fire: Atk 179/196, SpA 289/317, Spe 209/229 — Flame Body: Atk 179/196, SpA 289/317, Spe 209/229 — Infiltrator: Atk 179/196, SpA 289/317, Spe 209/229 — Shadow Tag: Atk 179/196, SpA 289/317, Spe 209/229
  **TRAPPING ABILITY: Shadow Tag** (optional — one of 4)
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

Attacker: **Lampent**, modest {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Shadow Ball | Overheat | Solar Beam | Dream Eater |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 228-269 (66.3-78.2%) | 343-343 (99.7-99.7%) | 227-267 (66-77.6%) | 94-111 (27.3-32.3%) |
| Avalugg-Hisui (physWall, Leftovers) | 330-387 (83.8-98.2%) | 574-676 (145.7-171.6%) | 657-773 (166.8-196.2%) | 274-322 (69.5-81.7%) |
| Milotic (specWall, Leftovers) | 94-111 (23.9-28.2%) | 81-96 (20.6-24.4%) | 188-221 (47.7-56.1%) | 78-92 (19.8-23.4%) |
| Florges (specWall, Leftovers) | 81-96 (22.5-26.7%) | 140-166 (38.9-46.1%) | 80-94 (22.2-26.1%) | 67-79 (18.6-21.9%) |
| Snorlax (specWall, Leftovers) | 0-0 (0-0%) | 179-210 (34.2-40.1%) | 102-120 (19.5-22.9%) | 85-101 (16.2-19.3%) |
| Mudsdale (physWall, Leftovers) | 174-205 (43.1-50.7%) | 302-356 (74.8-88.1%) | 347-408 (85.9-101%) | 144-170 (35.6-42.1%) |
| Jellicent (specWall, Leftovers) | 214-252 (53-62.4%) | 92-107 (22.8-26.5%) | 211-249 (52.2-61.6%) | 88-104 (21.8-25.7%) |
| Claydol (specWall, Leftovers) | 196-230 (60.5-71%) | 169-198 (52.2-61.1%) | 193-227 (59.6-70.1%) | 40-46 (12.3-14.2%) |
| Eldegoss (specWall, Leftovers) | 97-114 (29.9-35.2%) | 338-397 (104.3-122.5%) | 48-55 (14.8-17%) | 80-94 (24.7-29%) |
| Wo-Chien (specWall, Leftovers) | 44-52 (11.8-13.9%) | 310-366 (82.9-97.9%) | 44-52 (11.8-13.9%) | 0-0 (0-0%) |
| Gigalith (physWall, Leftovers) | 183-215 (48.9-57.5%) | 158-187 (42.2-50%) | 364-373 (97.3-99.7%) | 152-178 (40.6-47.6%) |
| Coalossal (physWall, Leftovers) | 166-195 (39.2-46%) | 71-84 (16.7-19.8%) | 165-193 (38.9-45.5%) | 137-162 (32.3-38.2%) |
| Turtonator (physWall, Leftovers) | 174-205 (53.7-63.3%) | 75-88 (23.1-27.2%) | 42-50 (13-15.4%) | 144-170 (44.4-52.5%) |
| Alcremie (specWall, Leftovers) | 96-114 (28.7-34.1%) | 167-197 (50-59%) | 96-113 (28.7-33.8%) | 80-94 (24-28.1%) |
| Audino-Mega (physWall, no item) | 0-0 (0-0%) | 217-256 (52.9-62.4%) | 124-145 (30.2-35.4%) | 104-122 (25.4-29.8%) |
| Slowbro-Galar (physWall, Leftovers) | 406-479 (103-121.6%) | 353-416 (89.6-105.6%) | 101-118 (25.6-29.9%) | 169-198 (42.9-50.3%) |
| Vileplume (specWall, Black Sludge) | 118-139 (33.3-39.3%) | 409-482 (115.5-136.2%) | 28-33 (7.9-9.3%) | 196-231 (55.4-65.3%) |
| Lanturn (specWall, Leftovers) | 130-153 (28.6-33.7%) | 113-132 (24.9-29.1%) | 260-305 (57.3-67.2%) | 107-127 (23.6-28%) |
| Sandslash-Alola (physWall, Leftovers) | 215-253 (60.7-71.5%) | 1501-1766 (424-498.9%) | 106-126 (29.9-35.6%) | 89-105 (25.1-29.7%) |
| Wishiwashi-School (physWall, Leftovers) | 118-139 (40.1-47.3%) | 101-119 (34.4-40.5%) | 234-275 (79.6-93.5%) | 97-115 (33-39.1%) |

---

### Ninjask

_Flagged for: Speed **460**; strong setup on a fast frame; ability: Speed Boost._

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

Attacker: **Ninjask**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Leech Life | Acrobatics | Double-Edge | Dig |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 31-37 (9-10.8%) | 10-13 (2.9-3.8%) | 15-18 (4.4-5.2%) | 213-252 (61.9-73.3%) |
| Avalugg-Hisui (physWall, Leftovers) | 63-74 (16-18.8%) | 22-26 (5.6-6.6%) | 31-36 (7.9-9.1%) | 105-123 (26.6-31.2%) |
| Milotic (specWall, Leftovers) | 162-191 (41.1-48.5%) | 113-132 (28.7-33.5%) | 161-189 (40.9-48%) | 135-158 (34.3-40.1%) |
| Florges (specWall, Leftovers) | 91-107 (25.3-29.7%) | 127-149 (35.3-41.4%) | 182-214 (50.6-59.4%) | 152-179 (42.2-49.7%) |
| Snorlax (specWall, Leftovers) | 189-223 (36.1-42.6%) | 131-154 (25-29.4%) | 188-222 (35.9-42.4%) | 157-185 (30-35.3%) |
| Mudsdale (physWall, Leftovers) | 97-114 (24-28.2%) | 67-79 (16.6-19.6%) | 96-113 (23.8-28%) | 80-94 (19.8-23.3%) |
| Jellicent (specWall, Leftovers) | 89-105 (22-26%) | 123-145 (30.4-35.9%) | 0-0 (0-0%) | 148-175 (36.6-43.3%) |
| Claydol (specWall, Leftovers) | 258-304 (79.6-93.8%) | 89-105 (27.5-32.4%) | 127-150 (39.2-46.3%) | 106-126 (32.7-38.9%) |
| Eldegoss (specWall, Leftovers) | 293-345 (90.4-106.5%) | 204-240 (63-74.1%) | 145-171 (44.8-52.8%) | 59-71 (18.2-21.9%) |
| Wo-Chien (specWall, Leftovers) | 406-479 (108.6-128.1%) | 141-166 (37.7-44.4%) | 100-118 (26.7-31.6%) | 41-49 (11-13.1%) |
| Gigalith (physWall, Leftovers) | 81-96 (21.7-25.7%) | 28-33 (7.5-8.8%) | 40-46 (10.7-12.3%) | 135-158 (36.1-42.2%) |
| Coalossal (physWall, Leftovers) | 42-50 (9.9-11.8%) | 29-35 (6.8-8.3%) | 41-49 (9.7-11.6%) | 287-338 (67.7-79.7%) |
| Turtonator (physWall, Leftovers) | 39-46 (12-14.2%) | 55-65 (17-20.1%) | 78-92 (24.1-28.4%) | 131-154 (40.4-47.5%) |
| Alcremie (specWall, Leftovers) | 84-100 (25.1-29.9%) | 117-137 (35-41%) | 169-198 (50.6-59.3%) | 140-166 (41.9-49.7%) |
| Audino-Mega (physWall, no item) | 41-48 (10-11.7%) | 58-68 (14.1-16.6%) | 81-96 (19.8-23.4%) | 68-80 (16.6-19.5%) |
| Slowbro-Galar (physWall, Leftovers) | 100-118 (25.4-29.9%) | 70-81 (17.8-20.6%) | 100-117 (25.4-29.7%) | 167-196 (42.4-49.7%) |
| Vileplume (specWall, Black Sludge) | 153-180 (43.2-50.8%) | 213-250 (60.2-70.6%) | 152-179 (42.9-50.6%) | 127-149 (35.9-42.1%) |
| Lanturn (specWall, Leftovers) | 206-244 (45.4-53.7%) | 71-84 (15.6-18.5%) | 205-243 (45.2-53.5%) | 344-405 (75.8-89.2%) |
| Sandslash-Alola (physWall, Leftovers) | 42-50 (11.9-14.1%) | 29-35 (8.2-9.9%) | 41-49 (11.6-13.8%) | 143-169 (40.4-47.7%) |
| Wishiwashi-School (physWall, Leftovers) | 81-96 (27.6-32.7%) | 57-67 (19.4-22.8%) | 80-94 (27.2-32%) | 67-79 (22.8-26.9%) |

---

### Raboot

_Flagged for: setup + priority + reliable recovery; strong setup on a fast frame; ability: Libero._

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

Attacker: **Raboot**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Overheat | High Jump Kick | Double-Edge | Gunk Shot |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 166-196 (48.3-57%) | 293-343 (85.2-99.7%) | 16-19 (4.7-5.5%) | 0-0 (0-0%) |
| Avalugg-Hisui (physWall, Leftovers) | 239-280 (60.7-71.1%) | 288-339 (73.1-86%) | 32-39 (8.1-9.9%) | 32-39 (8.1-9.9%) |
| Milotic (specWall, Leftovers) | 33-40 (8.4-10.2%) | 187-219 (47.5-55.6%) | 172-202 (43.7-51.3%) | 172-202 (43.7-51.3%) |
| Florges (specWall, Leftovers) | 59-70 (16.4-19.4%) | 105-123 (29.2-34.2%) | 195-228 (54.2-63.3%) | 390-458 (108.3-127.2%) |
| Snorlax (specWall, Leftovers) | 75-89 (14.3-17%) | 436-514 (83.2-98.1%) | 201-236 (38.4-45%) | 201-236 (38.4-45%) |
| Mudsdale (physWall, Leftovers) | 126-149 (31.2-36.9%) | 111-131 (27.5-32.4%) | 102-120 (25.2-29.7%) | 50-59 (12.4-14.6%) |
| Jellicent (specWall, Leftovers) | 39-45 (9.7-11.1%) | 0-0 (0-0%) | 0-0 (0-0%) | 94-111 (23.3-27.5%) |
| Claydol (specWall, Leftovers) | 71-84 (21.9-25.9%) | 74-87 (22.8-26.9%) | 136-161 (42-49.7%) | 67-80 (20.7-24.7%) |
| Eldegoss (specWall, Leftovers) | 143-169 (44.1-52.2%) | 167-197 (51.5-60.8%) | 154-183 (47.5-56.5%) | 310-366 (95.7-113%) |
| Wo-Chien (specWall, Leftovers) | 132-156 (35.3-41.7%) | 231-273 (61.8-73%) | 106-126 (28.3-33.7%) | 214-252 (57.2-67.4%) |
| Gigalith (physWall, Leftovers) | 66-78 (17.6-20.9%) | 185-219 (49.5-58.6%) | 42-50 (11.2-13.4%) | 42-50 (11.2-13.4%) |
| Coalossal (physWall, Leftovers) | 29-35 (6.8-8.3%) | 197-231 (46.5-54.5%) | 45-53 (10.6-12.5%) | 45-53 (10.6-12.5%) |
| Turtonator (physWall, Leftovers) | 31-36 (9.6-11.1%) | 89-106 (27.5-32.7%) | 83-98 (25.6-30.2%) | 83-98 (25.6-30.2%) |
| Alcremie (specWall, Leftovers) | 70-83 (21-24.9%) | 97-114 (29-34.1%) | 179-211 (53.6-63.2%) | 360-423 (107.8-126.6%) |
| Audino-Mega (physWall, no item) | 91-107 (22.2-26.1%) | 94-111 (22.9-27.1%) | 87-102 (21.2-24.9%) | 175-206 (42.7-50.2%) |
| Slowbro-Galar (physWall, Leftovers) | 148-174 (37.6-44.2%) | 28-33 (7.1-8.4%) | 106-124 (26.9-31.5%) | 53-62 (13.5-15.7%) |
| Vileplume (specWall, Black Sludge) | 172-204 (48.6-57.6%) | 87-102 (24.6-28.8%) | 162-191 (45.8-54%) | 162-191 (45.8-54%) |
| Lanturn (specWall, Leftovers) | 46-55 (10.1-12.1%) | 237-280 (52.2-61.7%) | 219-258 (48.2-56.8%) | 219-258 (48.2-56.8%) |
| Sandslash-Alola (physWall, Leftovers) | 627-738 (177.1-208.5%) | 395-464 (111.6-131.1%) | 45-53 (12.7-15%) | 0-0 (0-0%) |
| Wishiwashi-School (physWall, Leftovers) | 42-50 (14.3-17%) | 92-109 (31.3-37.1%) | 85-101 (28.9-34.4%) | 85-101 (28.9-34.4%) |

---

### Rampardos

_Flagged for: Attack **471**; ability: Sheer Force; hazards + real offence._

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

Attacker: **Rampardos**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Head Smash | Focus Punch | Double-Edge | Outrage |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 98-115 (28.5-33.4%) | 529-622 (153.8-180.8%) | 26-31 (7.6-9%) | 52-62 (15.1-18%) |
| Avalugg-Hisui (physWall, Leftovers) | 390-458 (99-116.2%) | 520-611 (132-155.1%) | 52-61 (13.2-15.5%) | 104-122 (26.4-31%) |
| Milotic (specWall, Leftovers) | 509-599 (129.2-152%) | 339-399 (86-101.3%) | 271-319 (68.8-81%) | 271-319 (68.8-81%) |
| Florges (specWall, Leftovers) | 574-676 (159.4-187.8%) | 191-224 (53.1-62.2%) | 306-361 (85-100.3%) | 0-0 (0-0%) |
| Snorlax (specWall, Leftovers) | 595-700 (113.5-133.6%) | 794-934 (151.5-178.2%) | 317-374 (60.5-71.4%) | 317-374 (60.5-71.4%) |
| Mudsdale (physWall, Leftovers) | 150-178 (37.1-44.1%) | 201-236 (49.8-58.4%) | 161-189 (39.9-46.8%) | 161-189 (39.9-46.8%) |
| Jellicent (specWall, Leftovers) | 561-660 (138.9-163.4%) | 0-0 (0-0%) | 0-0 (0-0%) | 299-352 (74-87.1%) |
| Claydol (specWall, Leftovers) | 201-236 (62-72.8%) | 133-157 (41-48.5%) | 214-252 (66-77.8%) | 214-252 (66-77.8%) |
| Eldegoss (specWall, Leftovers) | 457-539 (141-166.4%) | 305-358 (94.1-110.5%) | 244-287 (75.3-88.6%) | 244-287 (75.3-88.6%) |
| Wo-Chien (specWall, Leftovers) | 314-370 (84-98.9%) | 419-494 (112-132.1%) | 167-197 (44.7-52.7%) | 167-197 (44.7-52.7%) |
| Gigalith (physWall, Leftovers) | 252-296 (67.4-79.1%) | 336-396 (89.8-105.9%) | 67-79 (17.9-21.1%) | 135-158 (36.1-42.2%) |
| Coalossal (physWall, Leftovers) | 534-629 (125.9-148.3%) | 356-419 (84-98.8%) | 71-83 (16.7-19.6%) | 143-167 (33.7-39.4%) |
| Turtonator (physWall, Leftovers) | 491-578 (151.5-178.4%) | 163-192 (50.3-59.3%) | 131-154 (40.4-47.5%) | 262-309 (80.9-95.4%) |
| Alcremie (specWall, Leftovers) | 531-625 (159-187.1%) | 176-208 (52.7-62.3%) | 283-334 (84.7-100%) | 0-0 (0-0%) |
| Audino-Mega (physWall, no item) | 257-302 (62.7-73.7%) | 171-201 (41.7-49%) | 137-161 (33.4-39.3%) | 0-0 (0-0%) |
| Slowbro-Galar (physWall, Leftovers) | 313-367 (79.4-93.1%) | 52-61 (13.2-15.5%) | 167-196 (42.4-49.7%) | 167-196 (42.4-49.7%) |
| Vileplume (specWall, Black Sludge) | 479-565 (135.3-159.6%) | 159-188 (44.9-53.1%) | 256-301 (72.3-85%) | 256-301 (72.3-85%) |
| Lanturn (specWall, Leftovers) | 650-764 (143.2-168.3%) | 432-509 (95.2-112.1%) | 347-408 (76.4-89.9%) | 347-408 (76.4-89.9%) |
| Sandslash-Alola (physWall, Leftovers) | 266-314 (75.1-88.7%) | 713-839 (201.4-237%) | 71-83 (20.1-23.4%) | 71-83 (20.1-23.4%) |
| Wishiwashi-School (physWall, Leftovers) | 252-296 (85.7-100.7%) | 167-197 (56.8-67%) | 135-158 (45.9-53.7%) | 135-158 (45.9-53.7%) |

---

### Scyther

_Flagged for: setup + priority + reliable recovery; strong setup on a fast frame; ability: Technician._

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

Attacker: **Scyther**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Lunge | Acrobatics | Skull Bash | Close Combat |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 36-42 (10.5-12.2%) | 11-14 (3.2-4.1%) | 19-22 (5.5-6.4%) | 289-341 (84-99.1%) |
| Avalugg-Hisui (physWall, Leftovers) | 71-84 (18-21.3%) | 24-29 (6.1-7.4%) | 37-44 (9.4-11.2%) | 284-335 (72.1-85%) |
| Milotic (specWall, Leftovers) | 185-218 (47-55.3%) | 128-150 (32.5-38.1%) | 200-235 (50.8-59.6%) | 184-217 (46.7-55.1%) |
| Florges (specWall, Leftovers) | 104-122 (28.9-33.9%) | 144-170 (40-47.2%) | 224-265 (62.2-73.6%) | 104-122 (28.9-33.9%) |
| Snorlax (specWall, Leftovers) | 217-254 (41.4-48.5%) | 149-176 (28.4-33.6%) | 234-274 (44.7-52.3%) | 431-508 (82.3-96.9%) |
| Mudsdale (physWall, Leftovers) | 110-131 (27.2-32.4%) | 76-91 (18.8-22.5%) | 118-140 (29.2-34.7%) | 110-130 (27.2-32.2%) |
| Jellicent (specWall, Leftovers) | 101-119 (25-29.5%) | 141-166 (34.9-41.1%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Claydol (specWall, Leftovers) | 295-347 (91-107.1%) | 101-119 (31.2-36.7%) | 158-185 (48.8-57.1%) | 72-85 (22.2-26.2%) |
| Eldegoss (specWall, Leftovers) | 335-393 (103.4-121.3%) | 232-273 (71.6-84.3%) | 179-211 (55.2-65.1%) | 166-195 (51.2-60.2%) |
| Wo-Chien (specWall, Leftovers) | 464-546 (124.1-146%) | 161-189 (43-50.5%) | 123-145 (32.9-38.8%) | 228-270 (61-72.2%) |
| Gigalith (physWall, Leftovers) | 92-109 (24.6-29.1%) | 32-37 (8.6-9.9%) | 49-58 (13.1-15.5%) | 184-217 (49.2-58%) |
| Coalossal (physWall, Leftovers) | 49-57 (11.6-13.4%) | 33-40 (7.8-9.4%) | 52-61 (12.3-14.4%) | 195-228 (46-53.8%) |
| Turtonator (physWall, Leftovers) | 45-53 (13.9-16.4%) | 62-74 (19.1-22.8%) | 96-114 (29.6-35.2%) | 89-105 (27.5-32.4%) |
| Alcremie (specWall, Leftovers) | 96-113 (28.7-33.8%) | 133-157 (39.8-47%) | 208-245 (62.3-73.4%) | 96-113 (28.7-33.8%) |
| Audino-Mega (physWall, no item) | 46-55 (11.2-13.4%) | 66-78 (16.1-19%) | 101-119 (24.6-29%) | 93-110 (22.7-26.8%) |
| Slowbro-Galar (physWall, Leftovers) | 114-135 (28.9-34.3%) | 79-93 (20.1-23.6%) | 123-144 (31.2-36.5%) | 27-32 (6.9-8.1%) |
| Vileplume (specWall, Black Sludge) | 175-206 (49.4-58.2%) | 243-286 (68.6-80.8%) | 188-222 (53.1-62.7%) | 87-102 (24.6-28.8%) |
| Lanturn (specWall, Leftovers) | 236-278 (52-61.2%) | 81-96 (17.8-21.1%) | 254-300 (55.9-66.1%) | 235-276 (51.8-60.8%) |
| Sandslash-Alola (physWall, Leftovers) | 49-57 (13.8-16.1%) | 33-40 (9.3-11.3%) | 52-61 (14.7-17.2%) | 390-458 (110.2-129.4%) |
| Wishiwashi-School (physWall, Leftovers) | 92-109 (31.3-37.1%) | 65-76 (22.1-25.9%) | 98-117 (33.3-39.8%) | 92-107 (31.3-36.4%) |

---

### Shaymin

_Flagged for: BST 600; setup + priority + reliable recovery; strong setup on a fast frame._

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

Attacker: **Shaymin**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Leaf Storm | Last Resort | Play Rough | Zen Headbutt |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 267-314 (77.6-91.3%) | 19-22 (5.5-6.4%) | 24-29 (7-8.4%) | 22-26 (6.4-7.6%) |
| Avalugg-Hisui (physWall, Leftovers) | 770-907 (195.4-230.2%) | 37-45 (9.4-11.4%) | 50-59 (12.7-15%) | 44-53 (11.2-13.5%) |
| Milotic (specWall, Leftovers) | 222-261 (56.3-66.2%) | 201-237 (51-60.2%) | 130-153 (33-38.8%) | 115-136 (29.2-34.5%) |
| Florges (specWall, Leftovers) | 94-111 (26.1-30.8%) | 227-267 (63.1-74.2%) | 146-172 (40.6-47.8%) | 130-153 (36.1-42.5%) |
| Snorlax (specWall, Leftovers) | 120-141 (22.9-26.9%) | 235-276 (44.8-52.7%) | 152-179 (29-34.2%) | 135-159 (25.8-30.3%) |
| Mudsdale (physWall, Leftovers) | 406-479 (100.5-118.6%) | 119-141 (29.5-34.9%) | 78-91 (19.3-22.5%) | 68-81 (16.8-20%) |
| Jellicent (specWall, Leftovers) | 249-293 (61.6-72.5%) | 0-0 (0-0%) | 143-169 (35.4-41.8%) | 127-150 (31.4-37.1%) |
| Claydol (specWall, Leftovers) | 227-269 (70.1-83%) | 159-187 (49.1-57.7%) | 102-120 (31.5-37%) | 45-53 (13.9-16.4%) |
| Eldegoss (specWall, Leftovers) | 55-66 (17-20.4%) | 182-213 (56.2-65.7%) | 117-137 (36.1-42.3%) | 104-123 (32.1-38%) |
| Wo-Chien (specWall, Leftovers) | 52-61 (13.9-16.3%) | 124-146 (33.2-39%) | 162-191 (43.3-51.1%) | 0-0 (0-0%) |
| Gigalith (physWall, Leftovers) | 373-373 (99.7-99.7%) | 49-58 (13.1-15.5%) | 65-76 (17.4-20.3%) | 58-67 (15.5-17.9%) |
| Coalossal (physWall, Leftovers) | 193-228 (45.5-53.8%) | 53-62 (12.5-14.6%) | 33-40 (7.8-9.4%) | 61-72 (14.4-17%) |
| Turtonator (physWall, Leftovers) | 50-59 (15.4-18.2%) | 97-114 (29.9-35.2%) | 63-74 (19.4-22.8%) | 55-66 (17-20.4%) |
| Alcremie (specWall, Leftovers) | 113-132 (33.8-39.5%) | 210-248 (62.9-74.3%) | 135-159 (40.4-47.6%) | 120-143 (35.9-42.8%) |
| Audino-Mega (physWall, no item) | 145-171 (35.4-41.7%) | 102-120 (24.9-29.3%) | 66-78 (16.1-19%) | 58-70 (14.1-17.1%) |
| Slowbro-Galar (physWall, Leftovers) | 118-139 (29.9-35.3%) | 123-145 (31.2-36.8%) | 40-46 (10.2-11.7%) | 71-84 (18-21.3%) |
| Vileplume (specWall, Black Sludge) | 33-40 (9.3-11.3%) | 189-223 (53.4-63%) | 61-71 (17.2-20.1%) | 219-258 (61.9-72.9%) |
| Lanturn (specWall, Leftovers) | 305-358 (67.2-78.9%) | 257-302 (56.6-66.5%) | 166-195 (36.6-43%) | 148-174 (32.6-38.3%) |
| Sandslash-Alola (physWall, Leftovers) | 126-148 (35.6-41.8%) | 53-62 (15-17.5%) | 33-40 (9.3-11.3%) | 29-36 (8.2-10.2%) |
| Wishiwashi-School (physWall, Leftovers) | 275-325 (93.5-110.5%) | 100-118 (34-40.1%) | 65-76 (22.1-25.9%) | 58-67 (19.7-22.8%) |

---

### Sneasel-Hisui

_Flagged for: Speed **361**; setup + priority + reliable recovery; strong setup on a fast frame._

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

Attacker: **Sneasel-Hisui**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Focus Punch | Gunk Shot | Double-Edge | Iron Tail |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 0-0 (0-0%) | 15-18 (4.4-5.2%) | 54-65 (15.7-18.9%) |
| Avalugg-Hisui (physWall, Leftovers) | 483-568 (122.6-144.2%) | 48-57 (12.2-14.5%) | 31-37 (7.9-9.4%) | 217-256 (55.1-65%) |
| Milotic (specWall, Leftovers) | 313-369 (79.4-93.7%) | 252-296 (64-75.1%) | 167-197 (42.4-50%) | 70-81 (17.8-20.6%) |
| Florges (specWall, Leftovers) | 176-208 (48.9-57.8%) | 566-668 (157.2-185.6%) | 188-222 (52.2-61.7%) | 315-371 (87.5-103.1%) |
| Snorlax (specWall, Leftovers) | 733-863 (139.9-164.7%) | 293-345 (55.9-65.8%) | 195-230 (37.2-43.9%) | 163-192 (31.1-36.6%) |
| Mudsdale (physWall, Leftovers) | 187-219 (46.3-54.2%) | 74-88 (18.3-21.8%) | 100-117 (24.8-29%) | 83-98 (20.5-24.3%) |
| Jellicent (specWall, Leftovers) | 0-0 (0-0%) | 137-162 (33.9-40.1%) | 0-0 (0-0%) | 76-89 (18.8-22%) |
| Claydol (specWall, Leftovers) | 123-145 (38-44.8%) | 98-117 (30.2-36.1%) | 132-156 (40.7-48.1%) | 110-130 (34-40.1%) |
| Eldegoss (specWall, Leftovers) | 282-331 (87-102.2%) | 453-533 (139.8-164.5%) | 150-176 (46.3-54.3%) | 126-148 (38.9-45.7%) |
| Wo-Chien (specWall, Leftovers) | 388-456 (103.7-121.9%) | 312-366 (83.4-97.9%) | 104-122 (27.8-32.6%) | 87-101 (23.3-27%) |
| Gigalith (physWall, Leftovers) | 312-367 (83.4-98.1%) | 62-72 (16.6-19.3%) | 41-48 (11-12.8%) | 140-165 (37.4-44.1%) |
| Coalossal (physWall, Leftovers) | 330-388 (77.8-91.5%) | 66-78 (15.6-18.4%) | 44-52 (10.4-12.3%) | 74-87 (17.5-20.5%) |
| Turtonator (physWall, Leftovers) | 152-178 (46.9-54.9%) | 122-143 (37.7-44.1%) | 80-94 (24.7-29%) | 33-39 (10.2-12%) |
| Alcremie (specWall, Leftovers) | 163-192 (48.8-57.5%) | 525-617 (157.2-184.7%) | 174-205 (52.1-61.4%) | 292-344 (87.4-103%) |
| Audino-Mega (physWall, no item) | 158-187 (38.5-45.6%) | 256-301 (62.4-73.4%) | 84-100 (20.5-24.4%) | 143-167 (34.9-40.7%) |
| Slowbro-Galar (physWall, Leftovers) | 48-55 (12.2-14%) | 76-91 (19.3-23.1%) | 102-120 (25.9-30.5%) | 85-101 (21.6-25.6%) |
| Vileplume (specWall, Black Sludge) | 146-174 (41.2-49.2%) | 236-279 (66.7-78.8%) | 157-185 (44.4-52.3%) | 131-154 (37-43.5%) |
| Lanturn (specWall, Leftovers) | 399-470 (87.9-103.5%) | 319-377 (70.3-83%) | 213-250 (46.9-55.1%) | 44-52 (9.7-11.5%) |
| Sandslash-Alola (physWall, Leftovers) | 661-778 (186.7-219.8%) | 0-0 (0-0%) | 44-52 (12.4-14.7%) | 74-87 (20.9-24.6%) |
| Wishiwashi-School (physWall, Leftovers) | 156-183 (53.1-62.2%) | 124-146 (42.2-49.7%) | 83-97 (28.2-33%) | 35-40 (11.9-13.6%) |

---

### Typhlosion-Hisui

_Flagged for: BST 534; setup + priority + reliable recovery; strong setup on a fast frame._

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

Attacker: **Typhlosion-Hisui**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Eruption | Poltergeist | Focus Blast | Solar Beam |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 58-68 (16.9-19.8%) | 343-343 (99.7-99.7%) | 241-284 (70.1-82.6%) |
| Avalugg-Hisui (physWall, Leftovers) | 653-769 (165.7-195.2%) | 57-67 (14.5-17%) | 1398-1645 (354.8-417.5%) | 699-822 (177.4-208.6%) |
| Milotic (specWall, Leftovers) | 92-109 (23.4-27.7%) | 146-172 (37.1-43.7%) | 100-117 (25.4-29.7%) | 200-235 (50.8-59.6%) |
| Florges (specWall, Leftovers) | 159-188 (44.2-52.2%) | 165-195 (45.8-54.2%) | 42-49 (11.7-13.6%) | 85-100 (23.6-27.8%) |
| Snorlax (specWall, Leftovers) | 204-239 (38.9-45.6%) | 0-0 (0-0%) | 218-257 (41.6-49%) | 109-128 (20.8-24.4%) |
| Mudsdale (physWall, Leftovers) | 344-405 (85.1-100.2%) | 88-104 (21.8-25.7%) | 183-215 (45.3-53.2%) | 367-432 (90.8-106.9%) |
| Jellicent (specWall, Leftovers) | 105-123 (26-30.4%) | 325-382 (80.4-94.6%) | 0-0 (0-0%) | 224-265 (55.4-65.6%) |
| Claydol (specWall, Leftovers) | 192-226 (59.3-69.8%) | 234-275 (72.2-84.9%) | 50-59 (15.4-18.2%) | 205-241 (63.3-74.4%) |
| Eldegoss (specWall, Leftovers) | 384-452 (118.5-139.5%) | 132-156 (40.7-48.1%) | 102-120 (31.5-37%) | 50-59 (15.4-18.2%) |
| Wo-Chien (specWall, Leftovers) | 353-416 (94.4-111.2%) | 45-53 (12-14.2%) | 188-222 (50.3-59.4%) | 46-54 (12.3-14.4%) |
| Gigalith (physWall, Leftovers) | 180-211 (48.1-56.4%) | 74-87 (19.8-23.3%) | 373-373 (99.7-99.7%) | 373-373 (99.7-99.7%) |
| Coalossal (physWall, Leftovers) | 81-96 (19.1-22.6%) | 78-92 (18.4-21.7%) | 351-413 (82.8-97.4%) | 175-206 (41.3-48.6%) |
| Turtonator (physWall, Leftovers) | 85-101 (26.2-31.2%) | 71-84 (21.9-25.9%) | 183-215 (56.5-66.4%) | 45-53 (13.9-16.4%) |
| Alcremie (specWall, Leftovers) | 189-223 (56.6-66.8%) | 153-180 (45.8-53.9%) | 50-59 (15-17.7%) | 101-119 (30.2-35.6%) |
| Audino-Mega (physWall, no item) | 247-291 (60.2-71%) | 0-0 (0-0%) | 131-154 (32-37.6%) | 131-154 (32-37.6%) |
| Slowbro-Galar (physWall, Leftovers) | 403-473 (102.3-120.1%) | 183-215 (46.4-54.6%) | 53-62 (13.5-15.7%) | 106-126 (26.9-32%) |
| Vileplume (specWall, Black Sludge) | 465-548 (131.4-154.8%) | 139-163 (39.3-46%) | 62-72 (17.5-20.3%) | 31-36 (8.8-10.2%) |
| Lanturn (specWall, Leftovers) | 128-150 (28.2-33%) | 187-219 (41.2-48.2%) | 137-162 (30.2-35.7%) | 275-325 (60.6-71.6%) |
| Sandslash-Alola (physWall, Leftovers) | 1708-2009 (482.5-567.5%) | 78-92 (22-26%) | 912-1073 (257.6-303.1%) | 113-133 (31.9-37.6%) |
| Wishiwashi-School (physWall, Leftovers) | 115-136 (39.1-46.3%) | 74-87 (25.2-29.6%) | 124-146 (42.2-49.7%) | 249-293 (84.7-99.7%) |

---

### Virizion

_Flagged for: BST 580; setup + priority + reliable recovery; strong setup on a fast frame._

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
  Trapping moves: Block
  Weather/terrain: Sunny Day
  Utility: Light Screen, Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Taunt, Substitute

Attacker: **Virizion**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Leaf Storm | Close Combat | Double-Edge | Megahorn |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 245-288 (71.2-83.7%) | 343-343 (99.7-99.7%) | 15-18 (4.4-5.2%) | 31-36 (9-10.5%) |
| Avalugg-Hisui (physWall, Leftovers) | 705-830 (178.9-210.7%) | 375-442 (95.2-112.2%) | 31-36 (7.9-9.1%) | 62-72 (15.7-18.3%) |
| Milotic (specWall, Leftovers) | 202-239 (51.3-60.7%) | 243-286 (61.7-72.6%) | 161-189 (40.9-48%) | 161-189 (40.9-48%) |
| Florges (specWall, Leftovers) | 87-102 (24.2-28.3%) | 136-161 (37.8-44.7%) | 182-214 (50.6-59.4%) | 91-106 (25.3-29.4%) |
| Snorlax (specWall, Leftovers) | 110-130 (21-24.8%) | 568-668 (108.4-127.5%) | 188-222 (35.9-42.4%) | 188-222 (35.9-42.4%) |
| Mudsdale (physWall, Leftovers) | 373-439 (92.3-108.7%) | 144-170 (35.6-42.1%) | 96-113 (23.8-28%) | 96-113 (23.8-28%) |
| Jellicent (specWall, Leftovers) | 228-269 (56.4-66.6%) | 0-0 (0-0%) | 0-0 (0-0%) | 88-104 (21.8-25.7%) |
| Claydol (specWall, Leftovers) | 209-245 (64.5-75.6%) | 96-113 (29.6-34.9%) | 127-150 (39.2-46.3%) | 256-301 (79-92.9%) |
| Eldegoss (specWall, Leftovers) | 52-61 (16-18.8%) | 218-257 (67.3-79.3%) | 145-171 (44.8-52.8%) | 291-343 (89.8-105.9%) |
| Wo-Chien (specWall, Leftovers) | 48-55 (12.8-14.7%) | 301-354 (80.5-94.7%) | 100-118 (26.7-31.6%) | 403-474 (107.8-126.7%) |
| Gigalith (physWall, Leftovers) | 373-373 (99.7-99.7%) | 243-286 (65-76.5%) | 40-46 (10.7-12.3%) | 80-94 (21.4-25.1%) |
| Coalossal (physWall, Leftovers) | 178-209 (42-49.3%) | 256-301 (60.4-71%) | 41-49 (9.7-11.6%) | 41-49 (9.7-11.6%) |
| Turtonator (physWall, Leftovers) | 45-54 (13.9-16.7%) | 118-139 (36.4-42.9%) | 78-92 (24.1-28.4%) | 39-45 (12-13.9%) |
| Alcremie (specWall, Leftovers) | 104-122 (31.1-36.5%) | 126-148 (37.7-44.3%) | 169-198 (50.6-59.3%) | 84-98 (25.1-29.3%) |
| Audino-Mega (physWall, no item) | 133-157 (32.4-38.3%) | 123-145 (30-35.4%) | 81-96 (19.8-23.4%) | 40-48 (9.8-11.7%) |
| Slowbro-Galar (physWall, Leftovers) | 107-127 (27.2-32.2%) | 36-44 (9.1-11.2%) | 100-117 (25.4-29.7%) | 100-117 (25.4-29.7%) |
| Vileplume (specWall, Black Sludge) | 31-36 (8.8-10.2%) | 114-133 (32.2-37.6%) | 152-179 (42.9-50.6%) | 152-179 (42.9-50.6%) |
| Lanturn (specWall, Leftovers) | 279-328 (61.5-72.2%) | 309-364 (68.1-80.2%) | 205-243 (45.2-53.5%) | 205-243 (45.2-53.5%) |
| Sandslash-Alola (physWall, Leftovers) | 114-135 (32.2-38.1%) | 513-604 (144.9-170.6%) | 41-49 (11.6-13.8%) | 41-49 (11.6-13.8%) |
| Wishiwashi-School (physWall, Leftovers) | 253-297 (86.1-101%) | 120-143 (40.8-48.6%) | 80-94 (27.2-32%) | 80-94 (27.2-32%) |

---

### Avalugg-Hisui

_Flagged for: ability: Strong Jaw; hazards + real offence._

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
  Trapping moves: Block
  Weather/terrain: Hail, Rain Dance, Sandstorm, Snowscape
  Utility: Aurora Veil, Protect, Safeguard, Substitute
  Notable: Substitute

Attacker: **Avalugg-Hisui**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Mountain Gale | Stone Edge | Skull Bash | Heavy Slam |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 54-65 (15.7-18.9%) | 54-65 (15.7-18.9%) | 23-27 (6.7-7.8%) | 29-35 (8.4-10.2%) |
| Avalugg-Hisui (physWall, Leftovers) | 53-63 (13.5-16%) | 217-254 (55.1-64.5%) | 45-54 (11.4-13.7%) | 120-141 (30.5-35.8%) |
| Milotic (specWall, Leftovers) | 140-165 (35.5-41.9%) | 280-331 (71.1-84%) | 243-286 (61.7-72.6%) | 37-44 (9.4-11.2%) |
| Florges (specWall, Leftovers) | 317-373 (88.1-103.6%) | 317-373 (88.1-103.6%) | 274-322 (76.1-89.4%) | 505-595 (140.3-165.3%) |
| Snorlax (specWall, Leftovers) | 327-386 (62.4-73.7%) | 327-386 (62.4-73.7%) | 283-334 (54-63.7%) | 88-104 (16.8-19.8%) |
| Mudsdale (physWall, Leftovers) | 335-395 (82.9-97.8%) | 83-98 (20.5-24.3%) | 144-170 (35.6-42.1%) | 45-53 (11.1-13.1%) |
| Jellicent (specWall, Leftovers) | 154-182 (38.1-45%) | 309-364 (76.5-90.1%) | 0-0 (0-0%) | 41-49 (10.1-12.1%) |
| Claydol (specWall, Leftovers) | 444-523 (137-161.4%) | 110-130 (34-40.1%) | 192-226 (59.3-69.8%) | 89-105 (27.5-32.4%) |
| Eldegoss (specWall, Leftovers) | 505-595 (155.9-183.6%) | 252-297 (77.8-91.7%) | 218-257 (67.3-79.3%) | 201-237 (62-73.1%) |
| Wo-Chien (specWall, Leftovers) | 349-410 (93.3-109.6%) | 174-205 (46.5-54.8%) | 150-176 (40.1-47.1%) | 93-109 (24.9-29.1%) |
| Gigalith (physWall, Leftovers) | 140-165 (37.4-44.1%) | 140-165 (37.4-44.1%) | 59-70 (15.8-18.7%) | 76-91 (20.3-24.3%) |
| Coalossal (physWall, Leftovers) | 74-87 (17.5-20.5%) | 296-348 (69.8-82.1%) | 63-74 (14.9-17.5%) | 40-48 (9.4-11.3%) |
| Turtonator (physWall, Leftovers) | 136-159 (42-49.1%) | 273-321 (84.3-99.1%) | 117-137 (36.1-42.3%) | 18-22 (5.6-6.8%) |
| Alcremie (specWall, Leftovers) | 292-344 (87.4-103%) | 292-344 (87.4-103%) | 253-297 (75.7-88.9%) | 468-551 (140.1-165%) |
| Audino-Mega (physWall, no item) | 143-167 (34.9-40.7%) | 143-167 (34.9-40.7%) | 123-144 (30-35.1%) | 227-267 (55.4-65.1%) |
| Slowbro-Galar (physWall, Leftovers) | 172-204 (43.7-51.8%) | 172-204 (43.7-51.8%) | 149-175 (37.8-44.4%) | 92-109 (23.4-27.7%) |
| Vileplume (specWall, Black Sludge) | 530-624 (149.7-176.3%) | 265-312 (74.9-88.1%) | 228-269 (64.4-76%) | 211-248 (59.6-70.1%) |
| Lanturn (specWall, Leftovers) | 178-210 (39.2-46.3%) | 357-421 (78.6-92.7%) | 309-364 (68.1-80.2%) | 71-83 (15.6-18.3%) |
| Sandslash-Alola (physWall, Leftovers) | 36-42 (10.2-11.9%) | 148-174 (41.8-49.2%) | 63-74 (17.8-20.9%) | 98-115 (27.7-32.5%) |
| Wishiwashi-School (physWall, Leftovers) | 70-81 (23.8-27.6%) | 140-165 (47.6-56.1%) | 120-141 (40.8-48%) | 36-44 (12.2-15%) |

---

### Brute Bonnet

_Flagged for: BST 570; setup + priority + reliable recovery._

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

Attacker: **Brute Bonnet**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Seed Bomb | Crunch | Close Combat | Double-Edge |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 88-104 (25.6-30.2%) | 88-104 (25.6-30.2%) | 343-343 (99.7-99.7%) | 20-24 (5.8-7%) |
| Avalugg-Hisui (physWall, Leftovers) | 174-205 (44.2-52%) | 87-102 (22.1-25.9%) | 345-405 (87.6-102.8%) | 42-50 (10.7-12.7%) |
| Milotic (specWall, Leftovers) | 451-531 (114.5-134.8%) | 224-265 (56.9-67.3%) | 224-263 (56.9-66.8%) | 224-263 (56.9-66.8%) |
| Florges (specWall, Leftovers) | 253-299 (70.3-83.1%) | 126-149 (35-41.4%) | 126-148 (35-41.1%) | 252-297 (70-82.5%) |
| Snorlax (specWall, Leftovers) | 262-309 (50-59%) | 262-309 (50-59%) | 523-617 (99.8-117.7%) | 261-308 (49.8-58.8%) |
| Mudsdale (physWall, Leftovers) | 269-317 (66.6-78.5%) | 133-158 (32.9-39.1%) | 133-157 (32.9-38.9%) | 133-157 (32.9-38.9%) |
| Jellicent (specWall, Leftovers) | 496-585 (122.8-144.8%) | 496-585 (122.8-144.8%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Claydol (specWall, Leftovers) | 357-419 (110.2-129.3%) | 357-419 (110.2-129.3%) | 88-104 (27.2-32.1%) | 176-208 (54.3-64.2%) |
| Eldegoss (specWall, Leftovers) | 101-119 (31.2-36.7%) | 202-239 (62.3-73.8%) | 201-237 (62-73.1%) | 201-237 (62-73.1%) |
| Wo-Chien (specWall, Leftovers) | 70-81 (18.7-21.7%) | 70-81 (18.7-21.7%) | 278-327 (74.3-87.4%) | 139-163 (37.2-43.6%) |
| Gigalith (physWall, Leftovers) | 224-265 (59.9-70.9%) | 111-132 (29.7-35.3%) | 223-262 (59.6-70.1%) | 55-65 (14.7-17.4%) |
| Coalossal (physWall, Leftovers) | 118-140 (27.8-33%) | 118-140 (27.8-33%) | 236-278 (55.7-65.6%) | 58-68 (13.7-16%) |
| Turtonator (physWall, Leftovers) | 27-31 (8.3-9.6%) | 109-128 (33.6-39.5%) | 107-127 (33-39.2%) | 107-127 (33-39.2%) |
| Alcremie (specWall, Leftovers) | 235-276 (70.4-82.6%) | 117-137 (35-41%) | 117-137 (35-41%) | 234-275 (70.1-82.3%) |
| Audino-Mega (physWall, no item) | 114-135 (27.8-32.9%) | 57-67 (13.9-16.3%) | 113-133 (27.6-32.4%) | 113-133 (27.6-32.4%) |
| Slowbro-Galar (physWall, Leftovers) | 68-81 (17.3-20.6%) | 278-327 (70.6-83%) | 33-40 (8.4-10.2%) | 137-162 (34.8-41.1%) |
| Vileplume (specWall, Black Sludge) | 52-62 (14.7-17.5%) | 211-249 (59.6-70.3%) | 105-123 (29.7-34.7%) | 211-248 (59.6-70.1%) |
| Lanturn (specWall, Leftovers) | 574-676 (126.4-148.9%) | 287-338 (63.2-74.4%) | 286-336 (63-74%) | 286-336 (63-74%) |
| Sandslash-Alola (physWall, Leftovers) | 58-70 (16.4-19.8%) | 118-140 (33.3-39.5%) | 473-556 (133.6-157.1%) | 58-68 (16.4-19.2%) |
| Wishiwashi-School (physWall, Leftovers) | 224-265 (76.2-90.1%) | 111-132 (37.8-44.9%) | 111-131 (37.8-44.6%) | 111-131 (37.8-44.6%) |

---

### Combusken

_Flagged for: setup + priority + reliable recovery; ability: Speed Boost._

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

Attacker: **Combusken**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Overheat | Focus Punch | Last Resort | Dual Chop |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 234-275 (68-79.9%) | 343-343 (99.7-99.7%) | 19-22 (5.5-6.4%) | 28-32 (8.1-9.3%) |
| Avalugg-Hisui (physWall, Leftovers) | 336-396 (85.3-100.5%) | 492-579 (124.9-147%) | 37-44 (9.4-11.2%) | 56-66 (14.2-16.8%) |
| Milotic (specWall, Leftovers) | 48-57 (12.2-14.5%) | 319-377 (81-95.7%) | 198-234 (50.3-59.4%) | 142-168 (36-42.6%) |
| Florges (specWall, Leftovers) | 83-98 (23.1-27.2%) | 180-211 (50-58.6%) | 224-263 (62.2-73.1%) | 0-0 (0-0%) |
| Snorlax (specWall, Leftovers) | 105-124 (20-23.7%) | 748-880 (142.7-167.9%) | 232-273 (44.3-52.1%) | 168-196 (32.1-37.4%) |
| Mudsdale (physWall, Leftovers) | 178-209 (44.1-51.7%) | 191-223 (47.3-55.2%) | 118-139 (29.2-34.4%) | 84-100 (20.8-24.8%) |
| Jellicent (specWall, Leftovers) | 54-63 (13.4-15.6%) | 0-0 (0-0%) | 0-0 (0-0%) | 158-186 (39.1-46%) |
| Claydol (specWall, Leftovers) | 100-117 (30.9-36.1%) | 126-148 (38.9-45.7%) | 157-185 (48.5-57.1%) | 114-134 (35.2-41.4%) |
| Eldegoss (specWall, Leftovers) | 200-235 (61.7-72.5%) | 287-339 (88.6-104.6%) | 179-210 (55.2-64.8%) | 130-152 (40.1-46.9%) |
| Wo-Chien (specWall, Leftovers) | 184-217 (49.2-58%) | 396-466 (105.9-124.6%) | 123-145 (32.9-38.8%) | 90-106 (24.1-28.3%) |
| Gigalith (physWall, Leftovers) | 93-109 (24.9-29.1%) | 318-373 (85-99.7%) | 49-58 (13.1-15.5%) | 72-84 (19.3-22.5%) |
| Coalossal (physWall, Leftovers) | 41-49 (9.7-11.6%) | 336-396 (79.2-93.4%) | 52-61 (12.3-14.4%) | 78-90 (18.4-21.2%) |
| Turtonator (physWall, Leftovers) | 44-52 (13.6-16%) | 154-182 (47.5-56.2%) | 96-113 (29.6-34.9%) | 142-168 (43.8-51.9%) |
| Alcremie (specWall, Leftovers) | 98-117 (29.3-35%) | 166-196 (49.7-58.7%) | 208-244 (62.3-73.1%) | 0-0 (0-0%) |
| Audino-Mega (physWall, no item) | 127-150 (31-36.6%) | 162-191 (39.5-46.6%) | 101-118 (24.6-28.8%) | 0-0 (0-0%) |
| Slowbro-Galar (physWall, Leftovers) | 208-244 (52.8-61.9%) | 49-57 (12.4-14.5%) | 122-144 (31-36.5%) | 88-106 (22.3-26.9%) |
| Vileplume (specWall, Black Sludge) | 241-284 (68.1-80.2%) | 150-176 (42.4-49.7%) | 187-221 (52.8-62.4%) | 134-160 (37.9-45.2%) |
| Lanturn (specWall, Leftovers) | 66-78 (14.5-17.2%) | 408-479 (89.9-105.5%) | 253-299 (55.7-65.9%) | 182-214 (40.1-47.1%) |
| Sandslash-Alola (physWall, Leftovers) | 881-1037 (248.9-292.9%) | 674-794 (190.4-224.3%) | 52-61 (14.7-17.2%) | 38-44 (10.7-12.4%) |
| Wishiwashi-School (physWall, Leftovers) | 59-70 (20.1-23.8%) | 158-187 (53.7-63.6%) | 98-117 (33.3-39.8%) | 72-84 (24.5-28.6%) |

---

### Delphox

_Flagged for: BST 534; strong setup on a fast frame._

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

Attacker: **Delphox**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Overheat | Future Sight | Focus Blast | Solar Beam |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 175-206 (50.9-59.9%) | 343-343 (99.7-99.7%) | 235-276 (68.3-80.2%) |
| Avalugg-Hisui (physWall, Leftovers) | 592-698 (150.3-177.2%) | 508-598 (128.9-151.8%) | 1357-1596 (344.4-405.1%) | 678-798 (172.1-202.5%) |
| Milotic (specWall, Leftovers) | 84-98 (21.3-24.9%) | 145-171 (36.8-43.4%) | 96-114 (24.4-28.9%) | 193-228 (49-57.9%) |
| Florges (specWall, Leftovers) | 145-171 (40.3-47.5%) | 124-146 (34.4-40.6%) | 41-48 (11.4-13.3%) | 83-97 (23.1-26.9%) |
| Snorlax (specWall, Leftovers) | 184-217 (35.1-41.4%) | 158-187 (30.2-35.7%) | 211-249 (40.3-47.5%) | 105-124 (20-23.7%) |
| Mudsdale (physWall, Leftovers) | 312-367 (77.2-90.8%) | 267-315 (66.1-78%) | 178-210 (44.1-52%) | 357-421 (88.4-104.2%) |
| Jellicent (specWall, Leftovers) | 94-111 (23.3-27.5%) | 163-192 (40.3-47.5%) | 0-0 (0-0%) | 218-257 (54-63.6%) |
| Claydol (specWall, Leftovers) | 174-205 (53.7-63.3%) | 74-87 (22.8-26.9%) | 49-58 (15.1-17.9%) | 200-235 (61.7-72.5%) |
| Eldegoss (specWall, Leftovers) | 348-410 (107.4-126.5%) | 149-175 (46-54%) | 100-117 (30.9-36.1%) | 49-58 (15.1-17.9%) |
| Wo-Chien (specWall, Leftovers) | 321-377 (85.8-100.8%) | 0-0 (0-0%) | 183-215 (48.9-57.5%) | 45-53 (12-14.2%) |
| Gigalith (physWall, Leftovers) | 163-192 (43.6-51.3%) | 280-331 (74.9-88.5%) | 373-373 (99.7-99.7%) | 373-373 (99.7-99.7%) |
| Coalossal (physWall, Leftovers) | 74-87 (17.5-20.5%) | 256-300 (60.4-70.8%) | 340-401 (80.2-94.6%) | 170-200 (40.1-47.2%) |
| Turtonator (physWall, Leftovers) | 78-91 (24.1-28.1%) | 267-315 (82.4-97.2%) | 178-210 (54.9-64.8%) | 44-52 (13.6-16%) |
| Alcremie (specWall, Leftovers) | 172-202 (51.5-60.5%) | 148-174 (44.3-52.1%) | 49-57 (14.7-17.1%) | 98-115 (29.3-34.4%) |
| Audino-Mega (physWall, no item) | 223-263 (54.4-64.1%) | 192-226 (46.8-55.1%) | 127-150 (31-36.6%) | 127-150 (31-36.6%) |
| Slowbro-Galar (physWall, Leftovers) | 365-429 (92.6-108.9%) | 313-367 (79.4-93.1%) | 52-61 (13.2-15.5%) | 104-122 (26.4-31%) |
| Vileplume (specWall, Black Sludge) | 422-497 (119.2-140.4%) | 362-427 (102.3-120.6%) | 59-70 (16.7-19.8%) | 29-35 (8.2-9.9%) |
| Lanturn (specWall, Leftovers) | 117-136 (25.8-30%) | 200-236 (44.1-52%) | 133-157 (29.3-34.6%) | 267-314 (58.8-69.2%) |
| Sandslash-Alola (physWall, Leftovers) | 1548-1821 (437.3-514.4%) | 165-195 (46.6-55.1%) | 885-1042 (250-294.4%) | 110-130 (31.1-36.7%) |
| Wishiwashi-School (physWall, Leftovers) | 105-123 (35.7-41.8%) | 180-213 (61.2-72.4%) | 120-141 (40.8-48%) | 241-284 (82-96.6%) |

---

### Druddigon

_Flagged for: setup + priority + reliable recovery; ability: Sheer Force._

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

Attacker: **Druddigon**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Outrage | Gunk Shot | Superpower | Return |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 62-74 (18-21.5%) | 0-0 (0-0%) | 336-343 (97.7-99.7%) | 16-20 (4.7-5.8%) |
| Avalugg-Hisui (physWall, Leftovers) | 123-145 (31.2-36.8%) | 40-48 (10.2-12.2%) | 331-390 (84-99%) | 35-41 (8.9-10.4%) |
| Milotic (specWall, Leftovers) | 322-379 (81.7-96.2%) | 214-253 (54.3-64.2%) | 214-253 (54.3-64.2%) | 183-215 (46.4-54.6%) |
| Florges (specWall, Leftovers) | 0-0 (0-0%) | 486-572 (135-158.9%) | 120-143 (33.3-39.7%) | 206-243 (57.2-67.5%) |
| Snorlax (specWall, Leftovers) | 377-443 (71.9-84.5%) | 250-295 (47.7-56.3%) | 503-591 (96-112.8%) | 213-252 (40.6-48.1%) |
| Mudsdale (physWall, Leftovers) | 192-226 (47.5-55.9%) | 63-75 (15.6-18.6%) | 127-150 (31.4-37.1%) | 109-128 (27-31.7%) |
| Jellicent (specWall, Leftovers) | 356-418 (88.1-103.5%) | 118-139 (29.2-34.4%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Claydol (specWall, Leftovers) | 254-300 (78.4-92.6%) | 84-100 (25.9-30.9%) | 84-100 (25.9-30.9%) | 144-170 (44.4-52.5%) |
| Eldegoss (specWall, Leftovers) | 289-341 (89.2-105.2%) | 387-456 (119.4-140.7%) | 193-227 (59.6-70.1%) | 165-193 (50.9-59.6%) |
| Wo-Chien (specWall, Leftovers) | 200-235 (53.5-62.8%) | 266-314 (71.1-84%) | 266-314 (71.1-84%) | 113-133 (30.2-35.6%) |
| Gigalith (physWall, Leftovers) | 159-188 (42.5-50.3%) | 53-62 (14.2-16.6%) | 214-252 (57.2-67.4%) | 45-53 (12-14.2%) |
| Coalossal (physWall, Leftovers) | 170-200 (40.1-47.2%) | 55-66 (13-15.6%) | 226-266 (53.3-62.7%) | 48-55 (11.3-13%) |
| Turtonator (physWall, Leftovers) | 313-367 (96.6-113.3%) | 104-122 (32.1-37.7%) | 104-122 (32.1-37.7%) | 88-104 (27.2-32.1%) |
| Alcremie (specWall, Leftovers) | 0-0 (0-0%) | 449-529 (134.4-158.4%) | 111-131 (33.2-39.2%) | 191-224 (57.2-67.1%) |
| Audino-Mega (physWall, no item) | 0-0 (0-0%) | 218-257 (53.2-62.7%) | 109-128 (26.6-31.2%) | 92-109 (22.4-26.6%) |
| Slowbro-Galar (physWall, Leftovers) | 198-234 (50.3-59.4%) | 66-78 (16.8-19.8%) | 32-39 (8.1-9.9%) | 113-132 (28.7-33.5%) |
| Vileplume (specWall, Black Sludge) | 304-358 (85.9-101.1%) | 202-239 (57.1-67.5%) | 101-119 (28.5-33.6%) | 172-202 (48.6-57.1%) |
| Lanturn (specWall, Leftovers) | 412-484 (90.7-106.6%) | 274-322 (60.4-70.9%) | 274-322 (60.4-70.9%) | 232-274 (51.1-60.4%) |
| Sandslash-Alola (physWall, Leftovers) | 84-100 (23.7-28.2%) | 0-0 (0-0%) | 453-534 (128-150.8%) | 48-55 (13.6-15.5%) |
| Wishiwashi-School (physWall, Leftovers) | 159-188 (54.1-63.9%) | 106-126 (36.1-42.9%) | 106-126 (36.1-42.9%) | 91-106 (31-36.1%) |

---

### Eldegoss

_Flagged for: setup + priority + reliable recovery; ability: Regenerator._

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

Attacker: **Eldegoss**, modest {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Leaf Storm | Hyper Voice | Pollen Puff |
| --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 37-44 (10.8-12.8%) | 76-89 (22.1-25.9%) |
| Avalugg-Hisui (physWall, Leftovers) | 1030-1212 (261.4-307.6%) | 110-130 (27.9-33%) | 221-260 (56.1-66%) |
| Milotic (specWall, Leftovers) | 295-347 (74.9-88.1%) | 63-75 (16-19%) | 63-75 (16-19%) |
| Florges (specWall, Leftovers) | 126-149 (35-41.4%) | 54-65 (15-18.1%) | 27-32 (7.5-8.9%) |
| Snorlax (specWall, Leftovers) | 161-189 (30.7-36.1%) | 68-81 (13-15.5%) | 68-81 (13-15.5%) |
| Mudsdale (physWall, Leftovers) | 543-639 (134.4-158.2%) | 117-137 (29-33.9%) | 117-137 (29-33.9%) |
| Jellicent (specWall, Leftovers) | 332-391 (82.2-96.8%) | 0-0 (0-0%) | 35-41 (8.7-10.1%) |
| Claydol (specWall, Leftovers) | 304-357 (93.8-110.2%) | 65-76 (20.1-23.5%) | 131-154 (40.4-47.5%) |
| Eldegoss (specWall, Leftovers) | 75-88 (23.1-27.2%) | 65-76 (20.1-23.5%) | 131-154 (40.4-47.5%) |
| Wo-Chien (specWall, Leftovers) | 68-81 (18.2-21.7%) | 59-71 (15.8-19%) | 243-286 (65-76.5%) |
| Gigalith (physWall, Leftovers) | 373-373 (99.7-99.7%) | 61-71 (16.3-19%) | 122-144 (32.6-38.5%) |
| Coalossal (physWall, Leftovers) | 258-304 (60.8-71.7%) | 55-65 (13-15.3%) | 55-65 (13-15.3%) |
| Turtonator (physWall, Leftovers) | 67-79 (20.7-24.4%) | 117-137 (36.1-42.3%) | 58-68 (17.9-21%) |
| Alcremie (specWall, Leftovers) | 150-176 (44.9-52.7%) | 65-76 (19.5-22.8%) | 32-37 (9.6-11.1%) |
| Audino-Mega (physWall, no item) | 195-228 (47.6-55.6%) | 84-98 (20.5-23.9%) | 41-49 (10-12%) |
| Slowbro-Galar (physWall, Leftovers) | 158-185 (40.1-47%) | 136-159 (34.5-40.4%) | 136-159 (34.5-40.4%) |
| Vileplume (specWall, Black Sludge) | 45-53 (12.7-15%) | 79-93 (22.3-26.3%) | 79-93 (22.3-26.3%) |
| Lanturn (specWall, Leftovers) | 406-479 (89.4-105.5%) | 87-102 (19.2-22.5%) | 87-102 (19.2-22.5%) |
| Sandslash-Alola (physWall, Leftovers) | 167-197 (47.2-55.6%) | 71-84 (20.1-23.7%) | 71-84 (20.1-23.7%) |
| Wishiwashi-School (physWall, Leftovers) | 367-432 (124.8-146.9%) | 79-93 (26.9-31.6%) | 79-93 (26.9-31.6%) |

---

### Electrode-Hisui

_Flagged for: Speed **438**; setup + priority + reliable recovery._

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

Attacker: **Electrode-Hisui**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Thunder | Chloroblast | Tera Blast | Signal Beam |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 279-330 (81.1-95.9%) | 343-343 (99.7-99.7%) | 31-36 (9-10.5%) | 58-68 (16.9-19.8%) |
| Avalugg-Hisui (physWall, Leftovers) | 403-474 (102.3-120.3%) | 1007-1185 (255.6-300.8%) | 89-105 (22.6-26.6%) | 169-198 (42.9-50.3%) |
| Milotic (specWall, Leftovers) | 231-273 (58.6-69.3%) | 288-339 (73.1-86%) | 52-61 (13.2-15.5%) | 48-57 (12.2-14.5%) |
| Florges (specWall, Leftovers) | 100-117 (27.8-32.5%) | 123-145 (34.2-40.3%) | 44-52 (12.2-14.4%) | 20-24 (5.6-6.7%) |
| Snorlax (specWall, Leftovers) | 126-148 (24-28.2%) | 157-184 (30-35.1%) | 55-66 (10.5-12.6%) | 53-62 (10.1-11.8%) |
| Mudsdale (physWall, Leftovers) | 0-0 (0-0%) | 531-625 (131.4-154.7%) | 94-111 (23.3-27.5%) | 89-105 (22-26%) |
| Jellicent (specWall, Leftovers) | 261-308 (64.6-76.2%) | 325-382 (80.4-94.6%) | 0-0 (0-0%) | 27-32 (6.7-7.9%) |
| Claydol (specWall, Leftovers) | 0-0 (0-0%) | 296-349 (91.4-107.7%) | 53-62 (16.4-19.1%) | 100-118 (30.9-36.4%) |
| Eldegoss (specWall, Leftovers) | 59-70 (18.2-21.6%) | 74-87 (22.8-26.9%) | 53-62 (16.4-19.1%) | 100-118 (30.9-36.4%) |
| Wo-Chien (specWall, Leftovers) | 54-63 (14.4-16.8%) | 67-79 (17.9-21.1%) | 49-57 (13.1-15.2%) | 185-219 (49.5-58.6%) |
| Gigalith (physWall, Leftovers) | 223-262 (59.6-70.1%) | 373-373 (99.7-99.7%) | 49-58 (13.1-15.5%) | 93-110 (24.9-29.4%) |
| Coalossal (physWall, Leftovers) | 202-239 (47.6-56.4%) | 253-297 (59.7-70%) | 45-53 (10.6-12.5%) | 41-49 (9.7-11.6%) |
| Turtonator (physWall, Leftovers) | 106-124 (32.7-38.3%) | 66-78 (20.4-24.1%) | 94-111 (29-34.3%) | 44-52 (13.6-16%) |
| Alcremie (specWall, Leftovers) | 118-139 (35.3-41.6%) | 146-172 (43.7-51.5%) | 53-62 (15.9-18.6%) | 24-28 (7.2-8.4%) |
| Audino-Mega (physWall, no item) | 153-179 (37.3-43.7%) | 191-223 (46.6-54.4%) | 68-80 (16.6-19.5%) | 31-37 (7.6-9%) |
| Slowbro-Galar (physWall, Leftovers) | 248-292 (62.9-74.1%) | 154-182 (39.1-46.2%) | 110-130 (27.9-33%) | 104-122 (26.4-31%) |
| Vileplume (specWall, Black Sludge) | 71-84 (20.1-23.7%) | 44-52 (12.4-14.7%) | 65-75 (18.4-21.2%) | 61-71 (17.2-20.1%) |
| Lanturn (specWall, Leftovers) | 159-187 (35-41.2%) | 397-468 (87.4-103.1%) | 71-84 (15.6-18.5%) | 66-79 (14.5-17.4%) |
| Sandslash-Alola (physWall, Leftovers) | 263-309 (74.3-87.3%) | 163-192 (46-54.2%) | 58-68 (16.4-19.2%) | 54-65 (15.3-18.4%) |
| Wishiwashi-School (physWall, Leftovers) | 288-339 (98-115.3%) | 360-422 (122.4-143.5%) | 65-75 (22.1-25.5%) | 61-71 (20.7-24.1%) |

---

### Floette-Eternal

_Flagged for: BST 551; strong setup on a fast frame._

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

Attacker: **Floette-Eternal**, modest {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Light of Ruin | Petal Dance | Pollen Puff | Psychic |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 240-283 (69.8-82.3%) | 275-323 (79.9-93.9%) | 102-120 (29.7-34.9%) | 102-120 (29.7-34.9%) |
| Avalugg-Hisui (physWall, Leftovers) | 694-816 (176.1-207.1%) | 794-933 (201.5-236.8%) | 297-351 (75.4-89.1%) | 297-351 (75.4-89.1%) |
| Milotic (specWall, Leftovers) | 197-232 (50-58.9%) | 226-266 (57.4-67.5%) | 84-100 (21.3-25.4%) | 84-100 (21.3-25.4%) |
| Florges (specWall, Leftovers) | 170-200 (47.2-55.6%) | 97-114 (26.9-31.7%) | 36-42 (10-11.7%) | 72-85 (20-23.6%) |
| Snorlax (specWall, Leftovers) | 215-254 (41-48.5%) | 123-145 (23.5-27.7%) | 93-109 (17.7-20.8%) | 93-109 (17.7-20.8%) |
| Mudsdale (physWall, Leftovers) | 365-429 (90.3-106.2%) | 417-491 (103.2-121.5%) | 157-184 (38.9-45.5%) | 157-184 (38.9-45.5%) |
| Jellicent (specWall, Leftovers) | 222-262 (55-64.9%) | 256-300 (63.4-74.3%) | 48-55 (11.9-13.6%) | 96-113 (23.8-28%) |
| Claydol (specWall, Leftovers) | 202-239 (62.3-73.8%) | 232-274 (71.6-84.6%) | 175-206 (54-63.6%) | 42-50 (13-15.4%) |
| Eldegoss (specWall, Leftovers) | 202-239 (62.3-73.8%) | 57-67 (17.6-20.7%) | 175-206 (54-63.6%) | 87-102 (26.9-31.5%) |
| Wo-Chien (specWall, Leftovers) | 374-440 (100-117.6%) | 53-62 (14.2-16.6%) | 323-380 (86.4-101.6%) | 0-0 (0-0%) |
| Gigalith (physWall, Leftovers) | 373-373 (99.7-99.7%) | 373-373 (99.7-99.7%) | 165-193 (44.1-51.6%) | 165-193 (44.1-51.6%) |
| Coalossal (physWall, Leftovers) | 174-204 (41-48.1%) | 198-234 (46.7-55.2%) | 74-88 (17.5-20.8%) | 149-176 (35.1-41.5%) |
| Turtonator (physWall, Leftovers) | 365-429 (112.7-132.4%) | 52-61 (16-18.8%) | 78-92 (24.1-28.4%) | 157-184 (48.5-56.8%) |
| Alcremie (specWall, Leftovers) | 201-237 (60.2-71%) | 115-135 (34.4-40.4%) | 42-50 (12.6-15%) | 87-102 (26-30.5%) |
| Audino-Mega (physWall, no item) | 261-308 (63.7-75.1%) | 149-176 (36.3-42.9%) | 55-66 (13.4-16.1%) | 113-132 (27.6-32.2%) |
| Slowbro-Galar (physWall, Leftovers) | 213-250 (54.1-63.5%) | 122-143 (31-36.3%) | 183-215 (46.4-54.6%) | 183-215 (46.4-54.6%) |
| Vileplume (specWall, Black Sludge) | 123-144 (34.7-40.7%) | 35-41 (9.9-11.6%) | 106-124 (29.9-35%) | 213-250 (60.2-70.6%) |
| Lanturn (specWall, Leftovers) | 273-321 (60.1-70.7%) | 313-367 (68.9-80.8%) | 117-137 (25.8-30.2%) | 117-137 (25.8-30.2%) |
| Sandslash-Alola (physWall, Leftovers) | 226-265 (63.8-74.9%) | 128-152 (36.2-42.9%) | 96-114 (27.1-32.2%) | 96-114 (27.1-32.2%) |
| Wishiwashi-School (physWall, Leftovers) | 247-289 (84-98.3%) | 282-332 (95.9-112.9%) | 106-124 (36.1-42.2%) | 106-124 (36.1-42.2%) |

---

### Galvantula

_Flagged for: setup + priority + reliable recovery; ability: Compound Eyes._

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
  Trapping moves: Spider Web
  Weather/terrain: Rain Dance
  Utility: Disable, Light Screen, Protect, Substitute
  Notable: Substitute

Attacker: **Galvantula**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Bug Buzz | Thunder | Energy Ball | Tera Blast |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 118-139 (34.3-40.4%) | 315-343 (91.6-99.7%) | 158-185 (45.9-53.8%) | 35-41 (10.2-11.9%) |
| Avalugg-Hisui (physWall, Leftovers) | 343-403 (87.1-102.3%) | 456-536 (115.7-136%) | 457-538 (116-136.5%) | 101-119 (25.6-30.2%) |
| Milotic (specWall, Leftovers) | 98-115 (24.9-29.2%) | 261-308 (66.2-78.2%) | 131-154 (33.2-39.1%) | 58-68 (14.7-17.3%) |
| Florges (specWall, Leftovers) | 41-49 (11.4-13.6%) | 111-132 (30.8-36.7%) | 55-66 (15.3-18.3%) | 50-59 (13.9-16.4%) |
| Snorlax (specWall, Leftovers) | 107-126 (20.4-24%) | 143-167 (27.3-31.9%) | 71-84 (13.5-16%) | 63-75 (12-14.3%) |
| Mudsdale (physWall, Leftovers) | 180-213 (44.6-52.7%) | 0-0 (0-0%) | 241-284 (59.7-70.3%) | 106-126 (26.2-31.2%) |
| Jellicent (specWall, Leftovers) | 54-65 (13.4-16.1%) | 295-347 (73-85.9%) | 148-174 (36.6-43.1%) | 0-0 (0-0%) |
| Claydol (specWall, Leftovers) | 202-239 (62.3-73.8%) | 0-0 (0-0%) | 135-159 (41.7-49.1%) | 59-70 (18.2-21.6%) |
| Eldegoss (specWall, Leftovers) | 202-239 (62.3-73.8%) | 66-79 (20.4-24.4%) | 33-39 (10.2-12%) | 59-70 (18.2-21.6%) |
| Wo-Chien (specWall, Leftovers) | 375-442 (100.3-118.2%) | 61-72 (16.3-19.3%) | 31-36 (8.3-9.6%) | 55-65 (14.7-17.4%) |
| Gigalith (physWall, Leftovers) | 189-223 (50.5-59.6%) | 252-297 (67.4-79.4%) | 253-299 (67.6-79.9%) | 55-66 (14.7-17.6%) |
| Coalossal (physWall, Leftovers) | 85-101 (20-23.8%) | 228-270 (53.8-63.7%) | 114-135 (26.9-31.8%) | 50-59 (11.8-13.9%) |
| Turtonator (physWall, Leftovers) | 89-106 (27.5-32.7%) | 119-141 (36.7-43.5%) | 29-35 (9-10.8%) | 106-126 (32.7-38.9%) |
| Alcremie (specWall, Leftovers) | 49-58 (14.7-17.4%) | 132-157 (39.5-47%) | 66-79 (19.8-23.7%) | 59-70 (17.7-21%) |
| Audino-Mega (physWall, no item) | 65-76 (15.9-18.5%) | 172-202 (42-49.3%) | 87-101 (21.2-24.6%) | 76-91 (18.5-22.2%) |
| Slowbro-Galar (physWall, Leftovers) | 211-248 (53.6-62.9%) | 280-330 (71.1-83.8%) | 70-81 (17.8-20.6%) | 124-146 (31.5-37.1%) |
| Vileplume (specWall, Black Sludge) | 122-144 (34.5-40.7%) | 80-94 (22.6-26.6%) | 19-23 (5.4-6.5%) | 72-85 (20.3-24%) |
| Lanturn (specWall, Leftovers) | 135-159 (29.7-35%) | 179-211 (39.4-46.5%) | 180-213 (39.6-46.9%) | 80-94 (17.6-20.7%) |
| Sandslash-Alola (physWall, Leftovers) | 111-131 (31.4-37%) | 297-349 (83.9-98.6%) | 74-87 (20.9-24.6%) | 66-78 (18.6-22%) |
| Wishiwashi-School (physWall, Leftovers) | 122-144 (41.5-49%) | 326-383 (110.9-130.3%) | 163-192 (55.4-65.3%) | 72-85 (24.5-28.9%) |

---

### Glastrier

_Flagged for: BST 580; ability: Chilling Neigh._

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

Attacker: **Glastrier**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Icicle Crash | Close Combat | Double-Edge | Heavy Slam |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 50-59 (14.5-17.2%) | 343-343 (99.7-99.7%) | 23-27 (6.7-7.8%) | 48-57 (14-16.6%) |
| Avalugg-Hisui (physWall, Leftovers) | 50-59 (12.7-15%) | 379-445 (96.2-112.9%) | 46-54 (11.7-13.7%) | 254-300 (64.5-76.1%) |
| Milotic (specWall, Leftovers) | 131-154 (33.2-39.1%) | 247-289 (62.7-73.4%) | 247-289 (62.7-73.4%) | 102-120 (25.9-30.5%) |
| Florges (specWall, Leftovers) | 296-348 (82.2-96.7%) | 139-163 (38.6-45.3%) | 278-327 (77.2-90.8%) | 556-655 (154.4-181.9%) |
| Snorlax (specWall, Leftovers) | 306-361 (58.4-68.9%) | 577-678 (110.1-129.4%) | 288-339 (55-64.7%) | 97-114 (18.5-21.8%) |
| Mudsdale (physWall, Leftovers) | 314-369 (77.7-91.3%) | 146-172 (36.1-42.6%) | 146-172 (36.1-42.6%) | 49-58 (12.1-14.4%) |
| Jellicent (specWall, Leftovers) | 144-170 (35.6-42.1%) | 0-0 (0-0%) | 0-0 (0-0%) | 135-159 (33.4-39.4%) |
| Claydol (specWall, Leftovers) | 417-490 (128.7-151.2%) | 97-114 (29.9-35.2%) | 195-228 (60.2-70.4%) | 195-228 (60.2-70.4%) |
| Eldegoss (specWall, Leftovers) | 474-557 (146.3-171.9%) | 222-261 (68.5-80.6%) | 222-261 (68.5-80.6%) | 222-261 (68.5-80.6%) |
| Wo-Chien (specWall, Leftovers) | 326-384 (87.2-102.7%) | 305-360 (81.6-96.3%) | 152-179 (40.6-47.9%) | 152-179 (40.6-47.9%) |
| Gigalith (physWall, Leftovers) | 131-154 (35-41.2%) | 245-288 (65.5-77%) | 61-71 (16.3-19%) | 165-193 (44.1-51.6%) |
| Coalossal (physWall, Leftovers) | 68-80 (16-18.9%) | 260-305 (61.3-71.9%) | 65-75 (15.3-17.7%) | 65-76 (15.3-17.9%) |
| Turtonator (physWall, Leftovers) | 127-149 (39.2-46%) | 119-140 (36.7-43.2%) | 119-140 (36.7-43.2%) | 39-46 (12-14.2%) |
| Alcremie (specWall, Leftovers) | 274-322 (82-96.4%) | 128-150 (38.3-44.9%) | 257-302 (76.9-90.4%) | 514-605 (153.9-181.1%) |
| Audino-Mega (physWall, no item) | 133-157 (32.4-38.3%) | 124-146 (30.2-35.6%) | 124-146 (30.2-35.6%) | 249-295 (60.7-72%) |
| Slowbro-Galar (physWall, Leftovers) | 162-191 (41.1-48.5%) | 37-44 (9.4-11.2%) | 152-178 (38.6-45.2%) | 152-178 (38.6-45.2%) |
| Vileplume (specWall, Black Sludge) | 496-583 (140.1-164.7%) | 115-136 (32.5-38.4%) | 232-273 (65.5-77.1%) | 232-273 (65.5-77.1%) |
| Lanturn (specWall, Leftovers) | 167-196 (36.8-43.2%) | 314-370 (69.2-81.5%) | 314-370 (69.2-81.5%) | 78-92 (17.2-20.3%) |
| Sandslash-Alola (physWall, Leftovers) | 33-40 (9.3-11.3%) | 520-611 (146.9-172.6%) | 65-75 (18.4-21.2%) | 130-152 (36.7-42.9%) |
| Wishiwashi-School (physWall, Leftovers) | 65-76 (22.1-25.9%) | 122-144 (41.5-49%) | 122-144 (41.5-49%) | 61-71 (20.7-24.1%) |

---

### Gurdurr

_Flagged for: setup + priority + reliable recovery; ability: Guts/Sheer Force._

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
  Trapping moves: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Focus Punch

Attacker: **Gurdurr**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Focus Punch | Double-Edge | Stone Edge | Dig |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 18-22 (5.2-6.4%) | 31-37 (9-10.8%) | 257-304 (74.7-88.4%) |
| Avalugg-Hisui (physWall, Leftovers) | 564-664 (143.1-168.5%) | 37-44 (9.4-11.2%) | 126-149 (32-37.8%) | 126-149 (32-37.8%) |
| Milotic (specWall, Leftovers) | 367-432 (93.1-109.6%) | 196-231 (49.7-58.6%) | 163-192 (41.4-48.7%) | 163-192 (41.4-48.7%) |
| Florges (specWall, Leftovers) | 206-243 (57.2-67.5%) | 221-260 (61.4-72.2%) | 184-217 (51.1-60.3%) | 184-217 (51.1-60.3%) |
| Snorlax (specWall, Leftovers) | 859-1010 (163.9-192.7%) | 228-269 (43.5-51.3%) | 191-224 (36.5-42.7%) | 191-224 (36.5-42.7%) |
| Mudsdale (physWall, Leftovers) | 218-257 (54-63.6%) | 117-137 (29-33.9%) | 48-57 (11.9-14.1%) | 97-114 (24-28.2%) |
| Jellicent (specWall, Leftovers) | 0-0 (0-0%) | 0-0 (0-0%) | 180-211 (44.6-52.2%) | 180-211 (44.6-52.2%) |
| Claydol (specWall, Leftovers) | 144-170 (44.4-52.5%) | 154-182 (47.5-56.2%) | 65-75 (20.1-23.1%) | 130-152 (40.1-46.9%) |
| Eldegoss (specWall, Leftovers) | 330-388 (101.9-119.8%) | 176-208 (54.3-64.2%) | 146-172 (45.1-53.1%) | 72-85 (22.2-26.2%) |
| Wo-Chien (specWall, Leftovers) | 455-535 (121.7-143%) | 120-143 (32.1-38.2%) | 101-119 (27-31.8%) | 50-59 (13.4-15.8%) |
| Gigalith (physWall, Leftovers) | 365-373 (97.6-99.7%) | 48-57 (12.8-15.2%) | 81-96 (21.7-25.7%) | 163-192 (43.6-51.3%) |
| Coalossal (physWall, Leftovers) | 386-455 (91-107.3%) | 50-59 (11.8-13.9%) | 172-204 (40.6-48.1%) | 347-408 (81.8-96.2%) |
| Turtonator (physWall, Leftovers) | 178-209 (54.9-64.5%) | 94-111 (29-34.3%) | 158-187 (48.8-57.7%) | 158-187 (48.8-57.7%) |
| Alcremie (specWall, Leftovers) | 191-224 (57.2-67.1%) | 204-240 (61.1-71.9%) | 170-201 (50.9-60.2%) | 170-201 (50.9-60.2%) |
| Audino-Mega (physWall, no item) | 185-218 (45.1-53.2%) | 98-117 (23.9-28.5%) | 83-97 (20.2-23.7%) | 83-97 (20.2-23.7%) |
| Slowbro-Galar (physWall, Leftovers) | 55-66 (14-16.8%) | 120-141 (30.5-35.8%) | 101-118 (25.6-29.9%) | 202-237 (51.3-60.2%) |
| Vileplume (specWall, Black Sludge) | 172-204 (48.6-57.6%) | 184-217 (52-61.3%) | 154-182 (43.5-51.4%) | 154-182 (43.5-51.4%) |
| Lanturn (specWall, Leftovers) | 468-551 (103.1-121.4%) | 249-293 (54.8-64.5%) | 208-245 (45.8-54%) | 417-491 (91.9-108.1%) |
| Sandslash-Alola (physWall, Leftovers) | 773-910 (218.4-257.1%) | 50-59 (14.1-16.7%) | 85-101 (24-28.5%) | 172-204 (48.6-57.6%) |
| Wishiwashi-School (physWall, Leftovers) | 182-214 (61.9-72.8%) | 97-114 (33-38.8%) | 81-96 (27.6-32.7%) | 81-96 (27.6-32.7%) |

---

### Machoke

_Flagged for: setup + priority + reliable recovery; ability: Guts._

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

Attacker: **Machoke**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Focus Punch | Skull Bash | Dual Chop | Earthquake |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 19-23 (5.5-6.7%) | 30-36 (8.7-10.5%) | 249-293 (72.4-85.2%) |
| Avalugg-Hisui (physWall, Leftovers) | 547-643 (138.8-163.2%) | 39-45 (9.9-11.4%) | 62-72 (15.7-18.3%) | 122-144 (31-36.5%) |
| Milotic (specWall, Leftovers) | 356-418 (90.4-106.1%) | 205-241 (52-61.2%) | 160-188 (40.6-47.7%) | 158-187 (40.1-47.5%) |
| Florges (specWall, Leftovers) | 200-235 (55.6-65.3%) | 231-273 (64.2-75.8%) | 0-0 (0-0%) | 178-210 (49.4-58.3%) |
| Snorlax (specWall, Leftovers) | 830-977 (158.4-186.5%) | 240-282 (45.8-53.8%) | 186-218 (35.5-41.6%) | 184-217 (35.1-41.4%) |
| Mudsdale (physWall, Leftovers) | 211-249 (52.2-61.6%) | 122-144 (30.2-35.6%) | 96-114 (23.8-28.2%) | 94-111 (23.3-27.5%) |
| Jellicent (specWall, Leftovers) | 0-0 (0-0%) | 0-0 (0-0%) | 176-208 (43.6-51.5%) | 174-205 (43.1-50.7%) |
| Claydol (specWall, Leftovers) | 140-165 (43.2-50.9%) | 162-191 (50-59%) | 126-150 (38.9-46.3%) | 124-148 (38.3-45.7%) |
| Eldegoss (specWall, Leftovers) | 319-377 (98.5-116.4%) | 184-217 (56.8-67%) | 142-168 (43.8-51.9%) | 71-83 (21.9-25.6%) |
| Wo-Chien (specWall, Leftovers) | 442-520 (118.2-139%) | 127-149 (34-39.8%) | 98-116 (26.2-31%) | 49-57 (13.1-15.2%) |
| Gigalith (physWall, Leftovers) | 353-373 (94.4-99.7%) | 50-59 (13.4-15.8%) | 80-92 (21.4-24.6%) | 158-185 (42.2-49.5%) |
| Coalossal (physWall, Leftovers) | 374-440 (88.2-103.8%) | 53-63 (12.5-14.9%) | 84-100 (19.8-23.6%) | 335-395 (79-93.2%) |
| Turtonator (physWall, Leftovers) | 171-202 (52.8-62.3%) | 98-117 (30.2-36.1%) | 158-186 (48.8-57.4%) | 154-182 (47.5-56.2%) |
| Alcremie (specWall, Leftovers) | 184-218 (55.1-65.3%) | 214-252 (64.1-75.4%) | 0-0 (0-0%) | 165-195 (49.4-58.4%) |
| Audino-Mega (physWall, no item) | 180-211 (43.9-51.5%) | 104-122 (25.4-29.8%) | 0-0 (0-0%) | 80-94 (19.5-22.9%) |
| Slowbro-Galar (physWall, Leftovers) | 54-63 (13.7-16%) | 126-148 (32-37.6%) | 98-116 (24.9-29.4%) | 196-230 (49.7-58.4%) |
| Vileplume (specWall, Black Sludge) | 167-196 (47.2-55.4%) | 193-227 (54.5-64.1%) | 150-176 (42.4-49.7%) | 149-175 (42.1-49.4%) |
| Lanturn (specWall, Leftovers) | 453-533 (99.8-117.4%) | 261-308 (57.5-67.8%) | 202-238 (44.5-52.4%) | 404-475 (89-104.6%) |
| Sandslash-Alola (physWall, Leftovers) | 748-881 (211.3-248.9%) | 53-63 (15-17.8%) | 40-48 (11.3-13.6%) | 167-197 (47.2-55.6%) |
| Wishiwashi-School (physWall, Leftovers) | 176-208 (59.9-70.7%) | 101-119 (34.4-40.5%) | 80-92 (27.2-31.3%) | 79-92 (26.9-31.3%) |

---

### Meditite

_Flagged for: setup + priority + reliable recovery; ability: Pure Power._

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

Attacker: **Meditite**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Focus Punch | Zen Headbutt | Double-Edge | Poison Jab |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 44-52 (12.8-15.1%) | 22-26 (6.4-7.6%) | 0-0 (0-0%) |
| Avalugg-Hisui (physWall, Leftovers) | 651-765 (165.2-194.2%) | 88-104 (22.3-26.4%) | 42-50 (10.7-12.7%) | 28-33 (7.1-8.4%) |
| Milotic (specWall, Leftovers) | 425-499 (107.9-126.6%) | 227-267 (57.6-67.8%) | 226-266 (57.4-67.5%) | 152-178 (38.6-45.2%) |
| Florges (specWall, Leftovers) | 239-280 (66.4-77.8%) | 256-301 (71.1-83.6%) | 254-300 (70.6-83.3%) | 341-403 (94.7-111.9%) |
| Snorlax (specWall, Leftovers) | 991-1167 (189.1-222.7%) | 265-313 (50.6-59.7%) | 265-312 (50.6-59.5%) | 176-208 (33.6-39.7%) |
| Mudsdale (physWall, Leftovers) | 252-296 (62.4-73.3%) | 135-159 (33.4-39.4%) | 135-158 (33.4-39.1%) | 44-53 (10.9-13.1%) |
| Jellicent (specWall, Leftovers) | 0-0 (0-0%) | 250-295 (61.9-73%) | 0-0 (0-0%) | 83-97 (20.5-24%) |
| Claydol (specWall, Leftovers) | 167-197 (51.5-60.8%) | 89-105 (27.5-32.4%) | 179-210 (55.2-64.8%) | 59-70 (18.2-21.6%) |
| Eldegoss (specWall, Leftovers) | 382-449 (117.9-138.6%) | 205-240 (63.3-74.1%) | 204-239 (63-73.8%) | 273-321 (84.3-99.1%) |
| Wo-Chien (specWall, Leftovers) | 526-618 (140.6-165.2%) | 0-0 (0-0%) | 140-165 (37.4-44.1%) | 188-222 (50.3-59.4%) |
| Gigalith (physWall, Leftovers) | 373-373 (99.7-99.7%) | 113-133 (30.2-35.6%) | 55-66 (14.7-17.6%) | 37-44 (9.9-11.8%) |
| Coalossal (physWall, Leftovers) | 445-525 (105-123.8%) | 119-141 (28.1-33.3%) | 58-70 (13.7-16.5%) | 39-46 (9.2-10.8%) |
| Turtonator (physWall, Leftovers) | 205-240 (63.3-74.1%) | 110-130 (34-40.1%) | 109-128 (33.6-39.5%) | 72-87 (22.2-26.9%) |
| Alcremie (specWall, Leftovers) | 221-260 (66.2-77.8%) | 237-279 (71-83.5%) | 236-278 (70.7-83.2%) | 317-373 (94.9-111.7%) |
| Audino-Mega (physWall, no item) | 214-252 (52.2-61.5%) | 115-136 (28-33.2%) | 114-135 (27.8-32.9%) | 154-182 (37.6-44.4%) |
| Slowbro-Galar (physWall, Leftovers) | 65-76 (16.5-19.3%) | 140-165 (35.5-41.9%) | 139-163 (35.3-41.4%) | 46-54 (11.7-13.7%) |
| Vileplume (specWall, Black Sludge) | 200-235 (56.5-66.4%) | 430-505 (121.5-142.7%) | 213-250 (60.2-70.6%) | 143-167 (40.4-47.2%) |
| Lanturn (specWall, Leftovers) | 540-637 (118.9-140.3%) | 289-340 (63.7-74.9%) | 288-339 (63.4-74.7%) | 193-227 (42.5-50%) |
| Sandslash-Alola (physWall, Leftovers) | 893-1050 (252.3-296.6%) | 59-70 (16.7-19.8%) | 58-70 (16.4-19.8%) | 0-0 (0-0%) |
| Wishiwashi-School (physWall, Leftovers) | 210-248 (71.4-84.4%) | 113-133 (38.4-45.2%) | 111-132 (37.8-44.9%) | 75-88 (25.5-29.9%) |

---

### Mienfoo

_Flagged for: setup + priority + reliable recovery; ability: Regenerator._

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

Attacker: **Mienfoo**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Focus Punch | Mega Kick | Acrobatics | Dual Chop |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 15-19 (4.4-5.5%) | 7-9 (2-2.6%) | 28-32 (8.1-9.3%) |
| Avalugg-Hisui (physWall, Leftovers) | 492-579 (124.9-147%) | 32-37 (8.1-9.4%) | 15-18 (3.8-4.6%) | 56-66 (14.2-16.8%) |
| Milotic (specWall, Leftovers) | 319-377 (81-95.7%) | 170-201 (43.1-51%) | 79-93 (20.1-23.6%) | 142-168 (36-42.6%) |
| Florges (specWall, Leftovers) | 180-211 (50-58.6%) | 192-226 (53.3-62.8%) | 89-105 (24.7-29.2%) | 0-0 (0-0%) |
| Snorlax (specWall, Leftovers) | 748-880 (142.7-167.9%) | 198-235 (37.8-44.8%) | 92-109 (17.6-20.8%) | 168-196 (32.1-37.4%) |
| Mudsdale (physWall, Leftovers) | 191-223 (47.3-55.2%) | 101-119 (25-29.5%) | 48-55 (11.9-13.6%) | 84-100 (20.8-24.8%) |
| Jellicent (specWall, Leftovers) | 0-0 (0-0%) | 0-0 (0-0%) | 87-102 (21.5-25.2%) | 158-186 (39.1-46%) |
| Claydol (specWall, Leftovers) | 126-148 (38.9-45.7%) | 135-158 (41.7-48.8%) | 62-74 (19.1-22.8%) | 114-134 (35.2-41.4%) |
| Eldegoss (specWall, Leftovers) | 287-339 (88.6-104.6%) | 153-180 (47.2-55.6%) | 143-169 (44.1-52.2%) | 130-152 (40.1-46.9%) |
| Wo-Chien (specWall, Leftovers) | 396-466 (105.9-124.6%) | 105-124 (28.1-33.2%) | 98-117 (26.2-31.3%) | 90-106 (24.1-28.3%) |
| Gigalith (physWall, Leftovers) | 318-373 (85-99.7%) | 41-49 (11-13.1%) | 19-23 (5.1-6.1%) | 72-84 (19.3-22.5%) |
| Coalossal (physWall, Leftovers) | 336-396 (79.2-93.4%) | 44-52 (10.4-12.3%) | 20-24 (4.7-5.7%) | 78-90 (18.4-21.2%) |
| Turtonator (physWall, Leftovers) | 154-182 (47.5-56.2%) | 83-97 (25.6-29.9%) | 39-45 (12-13.9%) | 142-168 (43.8-51.9%) |
| Alcremie (specWall, Leftovers) | 166-196 (49.7-58.7%) | 178-209 (53.3-62.6%) | 81-97 (24.3-29%) | 0-0 (0-0%) |
| Audino-Mega (physWall, no item) | 162-191 (39.5-46.6%) | 87-102 (21.2-24.9%) | 40-48 (9.8-11.7%) | 0-0 (0-0%) |
| Slowbro-Galar (physWall, Leftovers) | 49-57 (12.4-14.5%) | 105-123 (26.6-31.2%) | 49-57 (12.4-14.5%) | 88-106 (22.3-26.9%) |
| Vileplume (specWall, Black Sludge) | 150-176 (42.4-49.7%) | 161-189 (45.5-53.4%) | 149-176 (42.1-49.7%) | 134-160 (37.9-45.2%) |
| Lanturn (specWall, Leftovers) | 408-479 (89.9-105.5%) | 217-256 (47.8-56.4%) | 49-58 (10.8-12.8%) | 182-214 (40.1-47.1%) |
| Sandslash-Alola (physWall, Leftovers) | 674-794 (190.4-224.3%) | 44-52 (12.4-14.7%) | 20-24 (5.6-6.8%) | 38-44 (10.7-12.4%) |
| Wishiwashi-School (physWall, Leftovers) | 158-187 (53.7-63.6%) | 84-100 (28.6-34%) | 40-46 (13.6-15.6%) | 72-84 (24.5-28.6%) |

---

### Milotic

_Flagged for: BST 540; ability: Marvel Scale._

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

Attacker: **Milotic**, modest {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Hydro Pump | Blizzard | Dragon Pulse | Alluring Voice |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 117-137 (34-39.8%) | 88-104 (25.6-30.2%) | 78-92 (22.7-26.7%) |
| Avalugg-Hisui (physWall, Leftovers) | 1020-1201 (258.9-304.8%) | 169-200 (42.9-50.8%) | 254-300 (64.5-76.1%) | 227-267 (57.6-67.8%) |
| Milotic (specWall, Leftovers) | 72-85 (18.3-21.6%) | 48-57 (12.2-14.5%) | 72-85 (18.3-21.6%) | 65-76 (16.5-19.3%) |
| Florges (specWall, Leftovers) | 124-146 (34.4-40.6%) | 83-97 (23.1-26.9%) | 0-0 (0-0%) | 55-66 (15.3-18.3%) |
| Snorlax (specWall, Leftovers) | 158-187 (30.2-35.7%) | 105-124 (20-23.7%) | 79-93 (15.1-17.7%) | 71-83 (13.5-15.8%) |
| Mudsdale (physWall, Leftovers) | 538-633 (133.2-156.7%) | 358-421 (88.6-104.2%) | 135-158 (33.4-39.1%) | 119-140 (29.5-34.7%) |
| Jellicent (specWall, Leftovers) | 81-96 (20-23.8%) | 54-63 (13.4-15.6%) | 81-97 (20-24%) | 72-87 (17.8-21.5%) |
| Claydol (specWall, Leftovers) | 300-353 (92.6-109%) | 200-235 (61.7-72.5%) | 75-88 (23.1-27.2%) | 67-79 (20.7-24.4%) |
| Eldegoss (specWall, Leftovers) | 74-88 (22.8-27.2%) | 200-235 (61.7-72.5%) | 75-88 (23.1-27.2%) | 67-79 (20.7-24.4%) |
| Wo-Chien (specWall, Leftovers) | 68-80 (18.2-21.4%) | 184-217 (49.2-58%) | 68-81 (18.2-21.7%) | 123-145 (32.9-38.8%) |
| Gigalith (physWall, Leftovers) | 373-373 (99.7-99.7%) | 188-221 (50.3-59.1%) | 141-166 (37.7-44.4%) | 126-148 (33.7-39.6%) |
| Coalossal (physWall, Leftovers) | 1027-1209 (242.2-285.1%) | 84-100 (19.8-23.6%) | 128-150 (30.2-35.4%) | 57-67 (13.4-15.8%) |
| Turtonator (physWall, Leftovers) | 269-315 (83-97.2%) | 179-210 (55.2-64.8%) | 270-317 (83.3-97.8%) | 119-140 (36.7-43.2%) |
| Alcremie (specWall, Leftovers) | 148-175 (44.3-52.4%) | 98-117 (29.3-35%) | 0-0 (0-0%) | 66-78 (19.8-23.4%) |
| Audino-Mega (physWall, no item) | 192-227 (46.8-55.4%) | 128-150 (31.2-36.6%) | 0-0 (0-0%) | 85-101 (20.7-24.6%) |
| Slowbro-Galar (physWall, Leftovers) | 314-369 (79.7-93.7%) | 209-245 (53-62.2%) | 157-184 (39.8-46.7%) | 70-81 (17.8-20.6%) |
| Vileplume (specWall, Black Sludge) | 91-106 (25.7-29.9%) | 243-286 (68.6-80.8%) | 91-107 (25.7-30.2%) | 40-48 (11.3-13.6%) |
| Lanturn (specWall, Leftovers) | 100-118 (22-26%) | 66-78 (14.5-17.2%) | 101-118 (22.2-26%) | 89-105 (19.6-23.1%) |
| Sandslash-Alola (physWall, Leftovers) | 332-391 (93.8-110.5%) | 54-65 (15.3-18.4%) | 83-97 (23.4-27.4%) | 74-87 (20.9-24.6%) |
| Wishiwashi-School (physWall, Leftovers) | 91-106 (31-36.1%) | 59-71 (20.1-24.1%) | 91-107 (31-36.4%) | 80-96 (27.2-32.7%) |

---

### Mismagius

_Flagged for: setup + priority + reliable recovery; strong setup on a fast frame._

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
  Trapping moves: Mean Look
  Weather/terrain: Rain Dance, Snowscape, Sunny Day
  Utility: Destiny Bond, Magic Coat, Memento, Pain Split, Perish Song, Protect, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

Attacker: **Mismagius**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Shadow Ball | Future Sight | Thunder | Inferno |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 223-262 (64.8-76.2%) | 110-130 (32-37.8%) | 222-261 (64.5-75.9%) | 185-218 (53.8-63.4%) |
| Avalugg-Hisui (physWall, Leftovers) | 321-378 (81.5-95.9%) | 319-377 (81-95.7%) | 319-377 (81-95.7%) | 266-314 (67.5-79.7%) |
| Milotic (specWall, Leftovers) | 92-109 (23.4-27.7%) | 91-107 (23.1-27.2%) | 183-215 (46.4-54.6%) | 37-44 (9.4-11.2%) |
| Florges (specWall, Leftovers) | 79-93 (21.9-25.8%) | 78-92 (21.7-25.6%) | 78-92 (21.7-25.6%) | 66-78 (18.3-21.7%) |
| Snorlax (specWall, Leftovers) | 0-0 (0-0%) | 100-117 (19.1-22.3%) | 100-117 (19.1-22.3%) | 83-98 (15.8-18.7%) |
| Mudsdale (physWall, Leftovers) | 170-200 (42.1-49.5%) | 169-198 (41.8-49%) | 0-0 (0-0%) | 140-166 (34.7-41.1%) |
| Jellicent (specWall, Leftovers) | 209-245 (51.7-60.6%) | 102-120 (25.2-29.7%) | 206-243 (51-60.1%) | 42-50 (10.4-12.4%) |
| Claydol (specWall, Leftovers) | 191-224 (59-69.1%) | 46-54 (14.2-16.7%) | 0-0 (0-0%) | 79-92 (24.4-28.4%) |
| Eldegoss (specWall, Leftovers) | 94-111 (29-34.3%) | 93-110 (28.7-34%) | 46-54 (14.2-16.7%) | 158-185 (48.8-57.1%) |
| Wo-Chien (specWall, Leftovers) | 42-50 (11.2-13.4%) | 0-0 (0-0%) | 42-50 (11.2-13.4%) | 145-171 (38.8-45.7%) |
| Gigalith (physWall, Leftovers) | 178-209 (47.6-55.9%) | 176-208 (47.1-55.6%) | 176-208 (47.1-55.6%) | 74-87 (19.8-23.3%) |
| Coalossal (physWall, Leftovers) | 162-191 (38.2-45%) | 161-189 (38-44.6%) | 161-189 (38-44.6%) | 32-39 (7.5-9.2%) |
| Turtonator (physWall, Leftovers) | 170-200 (52.5-61.7%) | 169-198 (52.2-61.1%) | 84-98 (25.9-30.2%) | 35-41 (10.8-12.7%) |
| Alcremie (specWall, Leftovers) | 94-111 (28.1-33.2%) | 93-110 (27.8-32.9%) | 93-110 (27.8-32.9%) | 78-92 (23.4-27.5%) |
| Audino-Mega (physWall, no item) | 0-0 (0-0%) | 120-143 (29.3-34.9%) | 120-143 (29.3-34.9%) | 101-119 (24.6-29%) |
| Slowbro-Galar (physWall, Leftovers) | 396-466 (100.5-118.3%) | 197-231 (50-58.6%) | 197-231 (50-58.6%) | 165-193 (41.9-49%) |
| Vileplume (specWall, Black Sludge) | 115-135 (32.5-38.1%) | 228-269 (64.4-76%) | 57-66 (16.1-18.6%) | 191-224 (54-63.3%) |
| Lanturn (specWall, Leftovers) | 127-149 (28-32.8%) | 126-148 (27.8-32.6%) | 126-148 (27.8-32.6%) | 52-62 (11.5-13.7%) |
| Sandslash-Alola (physWall, Leftovers) | 210-247 (59.3-69.8%) | 104-122 (29.4-34.5%) | 209-245 (59-69.2%) | 699-822 (197.5-232.2%) |
| Wishiwashi-School (physWall, Leftovers) | 115-135 (39.1-45.9%) | 114-133 (38.8-45.2%) | 228-269 (77.6-91.5%) | 46-55 (15.6-18.7%) |

---

### Mudsdale

_Flagged for: ability: Stamina; hazards + real offence._

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

Attacker: **Mudsdale**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Earthquake | Close Combat | Double-Edge | Heavy Slam |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 343-343 (99.7-99.7%) | 20-24 (5.8-7%) | 44-52 (12.8-15.1%) |
| Avalugg-Hisui (physWall, Leftovers) | 214-252 (54.3-64%) | 340-401 (86.3-101.8%) | 41-49 (10.4-12.4%) | 230-270 (58.4-68.5%) |
| Milotic (specWall, Leftovers) | 276-326 (70.1-82.7%) | 221-261 (56.1-66.2%) | 221-261 (56.1-66.2%) | 110-130 (27.9-33%) |
| Florges (specWall, Leftovers) | 313-367 (86.9-101.9%) | 124-146 (34.4-40.6%) | 249-293 (69.2-81.4%) | 499-587 (138.6-163.1%) |
| Snorlax (specWall, Leftovers) | 323-380 (61.6-72.5%) | 517-609 (98.7-116.2%) | 258-304 (49.2-58%) | 130-153 (24.8-29.2%) |
| Mudsdale (physWall, Leftovers) | 165-195 (40.8-48.3%) | 131-154 (32.4-38.1%) | 131-154 (32.4-38.1%) | 45-53 (11.1-13.1%) |
| Jellicent (specWall, Leftovers) | 305-360 (75.5-89.1%) | 0-0 (0-0%) | 0-0 (0-0%) | 122-143 (30.2-35.4%) |
| Claydol (specWall, Leftovers) | 219-258 (67.6-79.6%) | 87-102 (26.9-31.5%) | 175-205 (54-63.3%) | 175-205 (54-63.3%) |
| Eldegoss (specWall, Leftovers) | 124-146 (38.3-45.1%) | 198-234 (61.1-72.2%) | 198-234 (61.1-72.2%) | 198-234 (61.1-72.2%) |
| Wo-Chien (specWall, Leftovers) | 85-101 (22.7-27%) | 274-323 (73.3-86.4%) | 136-161 (36.4-43%) | 136-161 (36.4-43%) |
| Gigalith (physWall, Leftovers) | 276-325 (73.8-86.9%) | 219-258 (58.6-69%) | 54-63 (14.4-16.8%) | 148-174 (39.6-46.5%) |
| Coalossal (physWall, Leftovers) | 586-689 (138.2-162.5%) | 232-274 (54.7-64.6%) | 57-67 (13.4-15.8%) | 58-68 (13.7-16%) |
| Turtonator (physWall, Leftovers) | 269-317 (83-97.8%) | 106-126 (32.7-38.9%) | 106-126 (32.7-38.9%) | 44-52 (13.6-16%) |
| Alcremie (specWall, Leftovers) | 289-340 (86.5-101.8%) | 115-135 (34.4-40.4%) | 231-271 (69.2-81.1%) | 462-544 (138.3-162.9%) |
| Audino-Mega (physWall, no item) | 140-166 (34.1-40.5%) | 111-132 (27.1-32.2%) | 111-132 (27.1-32.2%) | 224-265 (54.6-64.6%) |
| Slowbro-Galar (physWall, Leftovers) | 341-403 (86.5-102.3%) | 33-39 (8.4-9.9%) | 136-159 (34.5-40.4%) | 136-159 (34.5-40.4%) |
| Vileplume (specWall, Black Sludge) | 261-308 (73.7-87%) | 104-122 (29.4-34.5%) | 208-245 (58.8-69.2%) | 208-245 (58.8-69.2%) |
| Lanturn (specWall, Leftovers) | 707-832 (155.7-183.3%) | 282-331 (62.1-72.9%) | 282-331 (62.1-72.9%) | 70-81 (15.4-17.8%) |
| Sandslash-Alola (physWall, Leftovers) | 292-344 (82.5-97.2%) | 466-549 (131.6-155.1%) | 57-67 (16.1-18.9%) | 115-136 (32.5-38.4%) |
| Wishiwashi-School (physWall, Leftovers) | 137-162 (46.6-55.1%) | 109-128 (37.1-43.5%) | 109-128 (37.1-43.5%) | 54-63 (18.4-21.4%) |

---

### Ninetales-Alola

_Flagged for: setup + priority + reliable recovery; strong setup on a fast frame._

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

Attacker: **Ninetales-Alola**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Blizzard | Moonblast | Overheat | Solar Beam |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 140-165 (40.7-48%) | 111-131 (32.3-38.1%) | 218-257 (63.4-74.7%) | 188-221 (54.7-64.2%) |
| Avalugg-Hisui (physWall, Leftovers) | 202-239 (51.3-60.7%) | 322-379 (81.7-96.2%) | 315-371 (79.9-94.2%) | 542-638 (137.6-161.9%) |
| Milotic (specWall, Leftovers) | 58-68 (14.7-17.3%) | 92-109 (23.4-27.7%) | 44-53 (11.2-13.5%) | 156-183 (39.6-46.4%) |
| Florges (specWall, Leftovers) | 100-118 (27.8-32.8%) | 79-93 (21.9-25.8%) | 78-91 (21.7-25.3%) | 66-78 (18.3-21.7%) |
| Snorlax (specWall, Leftovers) | 127-149 (24.2-28.4%) | 101-119 (19.3-22.7%) | 98-115 (18.7-21.9%) | 84-100 (16-19.1%) |
| Mudsdale (physWall, Leftovers) | 429-505 (106.2-125%) | 170-200 (42.1-49.5%) | 166-195 (41.1-48.3%) | 286-336 (70.8-83.2%) |
| Jellicent (specWall, Leftovers) | 65-76 (16.1-18.8%) | 104-123 (25.7-30.4%) | 50-59 (12.4-14.6%) | 175-206 (43.3-51%) |
| Claydol (specWall, Leftovers) | 240-283 (74.1-87.3%) | 94-111 (29-34.3%) | 92-109 (28.4-33.6%) | 159-188 (49.1-58%) |
| Eldegoss (specWall, Leftovers) | 240-283 (74.1-87.3%) | 94-111 (29-34.3%) | 185-219 (57.1-67.6%) | 39-46 (12-14.2%) |
| Wo-Chien (specWall, Leftovers) | 221-260 (59.1-69.5%) | 176-208 (47.1-55.6%) | 171-201 (45.7-53.7%) | 36-42 (9.6-11.2%) |
| Gigalith (physWall, Leftovers) | 224-265 (59.9-70.9%) | 179-210 (47.9-56.1%) | 87-102 (23.3-27.3%) | 300-353 (80.2-94.4%) |
| Coalossal (physWall, Leftovers) | 101-119 (23.8-28.1%) | 80-94 (18.9-22.2%) | 39-46 (9.2-10.8%) | 136-159 (32.1-37.5%) |
| Turtonator (physWall, Leftovers) | 214-252 (66-77.8%) | 170-200 (52.5-61.7%) | 41-48 (12.7-14.8%) | 35-41 (10.8-12.7%) |
| Alcremie (specWall, Leftovers) | 118-140 (35.3-41.9%) | 94-111 (28.1-33.2%) | 92-107 (27.5-32%) | 79-93 (23.7-27.8%) |
| Audino-Mega (physWall, no item) | 154-182 (37.6-44.4%) | 122-144 (29.8-35.1%) | 119-140 (29-34.1%) | 102-120 (24.9-29.3%) |
| Slowbro-Galar (physWall, Leftovers) | 250-295 (63.5-74.9%) | 98-117 (24.9-29.7%) | 193-228 (49-57.9%) | 83-97 (21.1-24.6%) |
| Vileplume (specWall, Black Sludge) | 291-341 (82.2-96.3%) | 57-67 (16.1-18.9%) | 224-265 (63.3-74.9%) | 23-27 (6.5-7.6%) |
| Lanturn (specWall, Leftovers) | 80-93 (17.6-20.5%) | 127-150 (28-33%) | 62-72 (13.7-15.9%) | 214-252 (47.1-55.5%) |
| Sandslash-Alola (physWall, Leftovers) | 66-78 (18.6-22%) | 105-123 (29.7-34.7%) | 825-971 (233.1-274.3%) | 88-104 (24.9-29.4%) |
| Wishiwashi-School (physWall, Leftovers) | 72-84 (24.5-28.6%) | 115-136 (39.1-46.3%) | 55-66 (18.7-22.4%) | 193-227 (65.6-77.2%) |

---

### Primeape

_Flagged for: setup + priority + reliable recovery; strong setup on a fast frame._

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

Attacker: **Primeape**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Focus Punch | Skull Bash | Gunk Shot | Outrage |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 18-22 (5.2-6.4%) | 0-0 (0-0%) | 35-40 (10.2-11.6%) |
| Avalugg-Hisui (physWall, Leftovers) | 516-607 (131-154.1%) | 36-42 (9.1-10.7%) | 33-40 (8.4-10.2%) | 68-80 (17.3-20.3%) |
| Milotic (specWall, Leftovers) | 335-395 (85-100.3%) | 193-227 (49-57.6%) | 179-210 (45.4-53.3%) | 179-210 (45.4-53.3%) |
| Florges (specWall, Leftovers) | 188-222 (52.2-61.7%) | 218-257 (60.6-71.4%) | 404-475 (112.2-131.9%) | 0-0 (0-0%) |
| Snorlax (specWall, Leftovers) | 783-921 (149.4-175.8%) | 226-266 (43.1-50.8%) | 209-245 (39.9-46.8%) | 209-245 (39.9-46.8%) |
| Mudsdale (physWall, Leftovers) | 198-235 (49-58.2%) | 115-135 (28.5-33.4%) | 53-62 (13.1-15.3%) | 106-124 (26.2-30.7%) |
| Jellicent (specWall, Leftovers) | 0-0 (0-0%) | 0-0 (0-0%) | 98-115 (24.3-28.5%) | 197-231 (48.8-57.2%) |
| Claydol (specWall, Leftovers) | 132-156 (40.7-48.1%) | 153-180 (47.2-55.6%) | 70-83 (21.6-25.6%) | 141-166 (43.5-51.2%) |
| Eldegoss (specWall, Leftovers) | 301-354 (92.9-109.3%) | 174-205 (53.7-63.3%) | 322-379 (99.4-117%) | 161-189 (49.7-58.3%) |
| Wo-Chien (specWall, Leftovers) | 414-487 (110.7-130.2%) | 119-140 (31.8-37.4%) | 222-261 (59.4-69.8%) | 110-130 (29.4-34.8%) |
| Gigalith (physWall, Leftovers) | 334-373 (89.3-99.7%) | 48-55 (12.8-14.7%) | 44-52 (11.8-13.9%) | 88-105 (23.5-28.1%) |
| Coalossal (physWall, Leftovers) | 352-414 (83-97.6%) | 50-59 (11.8-13.9%) | 46-54 (10.8-12.7%) | 93-110 (21.9-25.9%) |
| Turtonator (physWall, Leftovers) | 162-191 (50-59%) | 93-110 (28.7-34%) | 87-101 (26.9-31.2%) | 174-204 (53.7-63%) |
| Alcremie (specWall, Leftovers) | 174-205 (52.1-61.4%) | 201-237 (60.2-71%) | 374-439 (112-131.4%) | 0-0 (0-0%) |
| Audino-Mega (physWall, no item) | 170-200 (41.5-48.8%) | 98-115 (23.9-28%) | 182-214 (44.4-52.2%) | 0-0 (0-0%) |
| Slowbro-Galar (physWall, Leftovers) | 50-59 (12.7-15%) | 119-140 (30.2-35.5%) | 54-65 (13.7-16.5%) | 110-130 (27.9-33%) |
| Vileplume (specWall, Black Sludge) | 157-185 (44.4-52.3%) | 182-214 (51.4-60.5%) | 169-198 (47.7-55.9%) | 169-198 (47.7-55.9%) |
| Lanturn (specWall, Leftovers) | 427-503 (94.1-110.8%) | 247-289 (54.4-63.7%) | 227-267 (50-58.8%) | 227-267 (50-58.8%) |
| Sandslash-Alola (physWall, Leftovers) | 705-830 (199.2-234.5%) | 50-59 (14.1-16.7%) | 0-0 (0-0%) | 46-54 (13-15.3%) |
| Wishiwashi-School (physWall, Leftovers) | 166-196 (56.5-66.7%) | 96-113 (32.7-38.4%) | 88-105 (29.9-35.7%) | 88-105 (29.9-35.7%) |

---

### Servine

_Flagged for: setup + priority + reliable recovery; ability: Contrary._

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
  Trapping moves: Mean Look
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Knock Off, Leech Seed, Light Screen, Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

Attacker: **Servine**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Leaf Storm | Double-Edge | Iron Tail | Aqua Tail |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 178-209 (51.7-60.8%) | 13-15 (3.8-4.4%) | 45-54 (13.1-15.7%) | 83-98 (24.1-28.5%) |
| Avalugg-Hisui (physWall, Leftovers) | 510-601 (129.4-152.5%) | 26-31 (6.6-7.9%) | 182-214 (46.2-54.3%) | 81-96 (20.6-24.4%) |
| Milotic (specWall, Leftovers) | 148-174 (37.6-44.2%) | 139-163 (35.3-41.4%) | 58-67 (14.7-17%) | 52-61 (13.2-15.5%) |
| Florges (specWall, Leftovers) | 63-75 (17.5-20.8%) | 157-184 (43.6-51.1%) | 262-309 (72.8-85.8%) | 118-139 (32.8-38.6%) |
| Snorlax (specWall, Leftovers) | 80-94 (15.3-17.9%) | 162-191 (30.9-36.5%) | 135-159 (25.8-30.3%) | 122-144 (23.3-27.5%) |
| Mudsdale (physWall, Leftovers) | 270-318 (66.8-78.7%) | 83-97 (20.5-24%) | 68-81 (16.8-20%) | 126-148 (31.2-36.6%) |
| Jellicent (specWall, Leftovers) | 166-196 (41.1-48.5%) | 0-0 (0-0%) | 63-75 (15.6-18.6%) | 57-67 (14.1-16.6%) |
| Claydol (specWall, Leftovers) | 152-179 (46.9-55.2%) | 110-130 (34-40.1%) | 92-107 (28.4-33%) | 166-196 (51.2-60.5%) |
| Eldegoss (specWall, Leftovers) | 37-44 (11.4-13.6%) | 124-148 (38.3-45.7%) | 105-123 (32.4-38%) | 46-55 (14.2-17%) |
| Wo-Chien (specWall, Leftovers) | 35-40 (9.4-10.7%) | 87-101 (23.3-27%) | 72-85 (19.3-22.7%) | 32-37 (8.6-9.9%) |
| Gigalith (physWall, Leftovers) | 284-335 (75.9-89.6%) | 33-40 (8.8-10.7%) | 117-137 (31.3-36.6%) | 105-124 (28.1-33.2%) |
| Coalossal (physWall, Leftovers) | 128-152 (30.2-35.8%) | 36-42 (8.5-9.9%) | 61-72 (14.4-17%) | 223-263 (52.6-62%) |
| Turtonator (physWall, Leftovers) | 33-39 (10.2-12%) | 67-79 (20.7-24.4%) | 28-32 (8.6-9.9%) | 50-59 (15.4-18.2%) |
| Alcremie (specWall, Leftovers) | 75-88 (22.5-26.3%) | 145-171 (43.4-51.2%) | 243-286 (72.8-85.6%) | 109-128 (32.6-38.3%) |
| Audino-Mega (physWall, no item) | 97-114 (23.7-27.8%) | 70-83 (17.1-20.2%) | 119-140 (29-34.1%) | 53-63 (12.9-15.4%) |
| Slowbro-Galar (physWall, Leftovers) | 78-92 (19.8-23.4%) | 85-101 (21.6-25.6%) | 71-84 (18-21.3%) | 65-76 (16.5-19.3%) |
| Vileplume (specWall, Black Sludge) | 22-26 (6.2-7.3%) | 131-154 (37-43.5%) | 109-128 (30.8-36.2%) | 49-58 (13.8-16.4%) |
| Lanturn (specWall, Leftovers) | 204-239 (44.9-52.6%) | 176-209 (38.8-46%) | 36-42 (7.9-9.3%) | 66-78 (14.5-17.2%) |
| Sandslash-Alola (physWall, Leftovers) | 83-97 (23.4-27.4%) | 36-42 (10.2-11.9%) | 61-72 (17.2-20.3%) | 55-65 (15.5-18.4%) |
| Wishiwashi-School (physWall, Leftovers) | 184-217 (62.6-73.8%) | 68-81 (23.1-27.6%) | 28-33 (9.5-11.2%) | 26-31 (8.8-10.5%) |

---

### Tangela

_Flagged for: setup + priority + reliable recovery; ability: Regenerator._

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

Attacker: **Tangela**, modest {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Leaf Storm | Wring Out | Sludge Bomb | Ancient Power |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 58-68 (16.9-19.8%) | 0-0 (0-0%) | 58-68 (16.9-19.8%) |
| Avalugg-Hisui (physWall, Leftovers) | 1189-1400 (301.8-355.3%) | 169-200 (42.9-50.8%) | 127-149 (32.2-37.8%) | 341-403 (86.5-102.3%) |
| Milotic (specWall, Leftovers) | 339-400 (86-101.5%) | 97-114 (24.6-28.9%) | 72-85 (18.3-21.6%) | 49-58 (12.4-14.7%) |
| Florges (specWall, Leftovers) | 145-171 (40.3-47.5%) | 83-97 (23.1-26.9%) | 126-148 (35-41.1%) | 42-49 (11.7-13.6%) |
| Snorlax (specWall, Leftovers) | 185-218 (35.3-41.6%) | 105-124 (20-23.7%) | 79-93 (15.1-17.7%) | 53-63 (10.1-12%) |
| Mudsdale (physWall, Leftovers) | 626-737 (155-182.4%) | 179-210 (44.3-52%) | 67-79 (16.6-19.6%) | 44-53 (10.9-13.1%) |
| Jellicent (specWall, Leftovers) | 383-451 (94.8-111.6%) | 0-0 (0-0%) | 40-48 (9.9-11.9%) | 55-65 (13.6-16.1%) |
| Claydol (specWall, Leftovers) | 349-412 (107.7-127.2%) | 100-117 (30.9-36.1%) | 37-44 (11.4-13.6%) | 24-29 (7.4-9%) |
| Eldegoss (specWall, Leftovers) | 87-102 (26.9-31.5%) | 100-117 (30.9-36.1%) | 150-178 (46.3-54.9%) | 50-59 (15.4-18.2%) |
| Wo-Chien (specWall, Leftovers) | 79-93 (21.1-24.9%) | 92-107 (24.6-28.6%) | 139-163 (37.2-43.6%) | 46-54 (12.3-14.4%) |
| Gigalith (physWall, Leftovers) | 373-373 (99.7-99.7%) | 93-110 (24.9-29.4%) | 70-83 (18.7-22.2%) | 94-111 (25.1-29.7%) |
| Coalossal (physWall, Leftovers) | 299-351 (70.5-82.8%) | 84-100 (19.8-23.6%) | 63-75 (14.9-17.7%) | 172-204 (40.6-48.1%) |
| Turtonator (physWall, Leftovers) | 78-91 (24.1-28.1%) | 179-210 (55.2-64.8%) | 135-158 (41.7-48.8%) | 180-213 (55.6-65.7%) |
| Alcremie (specWall, Leftovers) | 172-204 (51.5-61.1%) | 98-117 (29.3-35%) | 149-176 (44.6-52.7%) | 50-59 (15-17.7%) |
| Audino-Mega (physWall, no item) | 224-263 (54.6-64.1%) | 128-150 (31.2-36.6%) | 193-228 (47.1-55.6%) | 65-76 (15.9-18.5%) |
| Slowbro-Galar (physWall, Leftovers) | 182-214 (46.2-54.3%) | 209-245 (53-62.2%) | 78-92 (19.8-23.4%) | 105-123 (26.6-31.2%) |
| Vileplume (specWall, Black Sludge) | 52-62 (14.7-17.5%) | 120-143 (33.9-40.4%) | 91-107 (25.7-30.2%) | 61-72 (17.2-20.3%) |
| Lanturn (specWall, Leftovers) | 469-552 (103.3-121.6%) | 133-157 (29.3-34.6%) | 101-118 (22.2-26%) | 67-79 (14.8-17.4%) |
| Sandslash-Alola (physWall, Leftovers) | 193-227 (54.5-64.1%) | 110-130 (31.1-36.7%) | 0-0 (0-0%) | 111-131 (31.4-37%) |
| Wishiwashi-School (physWall, Leftovers) | 423-499 (143.9-169.7%) | 120-143 (40.8-48.6%) | 91-107 (31-36.4%) | 61-72 (20.7-24.5%) |

---

### Wishiwashi-School

_Flagged for: BST 620; ability: Schooling._

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

Attacker: **Wishiwashi-School**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Hydro Pump | Double-Edge | Earthquake | Iron Tail |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 23-27 (6.7-7.8%) | 314-343 (91.3-99.7%) | 78-92 (22.7-26.7%) |
| Avalugg-Hisui (physWall, Leftovers) | 885-1041 (224.6-264.2%) | 45-53 (11.4-13.5%) | 154-182 (39.1-46.2%) | 309-364 (78.4-92.4%) |
| Milotic (specWall, Leftovers) | 62-74 (15.7-18.8%) | 240-283 (60.9-71.8%) | 200-236 (50.8-59.9%) | 100-118 (25.4-29.9%) |
| Florges (specWall, Leftovers) | 109-128 (30.3-35.6%) | 270-318 (75-88.3%) | 226-266 (62.8-73.9%) | 452-533 (125.6-148.1%) |
| Snorlax (specWall, Leftovers) | 137-162 (26.1-30.9%) | 280-330 (53.4-63%) | 234-275 (44.7-52.5%) | 234-275 (44.7-52.5%) |
| Mudsdale (physWall, Leftovers) | 466-548 (115.3-135.6%) | 143-167 (35.4-41.3%) | 119-140 (29.5-34.7%) | 119-140 (29.5-34.7%) |
| Jellicent (specWall, Leftovers) | 71-83 (17.6-20.5%) | 0-0 (0-0%) | 221-260 (54.7-64.4%) | 110-130 (27.2-32.2%) |
| Claydol (specWall, Leftovers) | 261-306 (80.6-94.4%) | 189-223 (58.3-68.8%) | 158-187 (48.8-57.7%) | 158-187 (48.8-57.7%) |
| Eldegoss (specWall, Leftovers) | 65-76 (20.1-23.5%) | 215-254 (66.4-78.4%) | 89-105 (27.5-32.4%) | 180-211 (55.6-65.1%) |
| Wo-Chien (specWall, Leftovers) | 59-70 (15.8-18.7%) | 148-175 (39.6-46.8%) | 62-72 (16.6-19.3%) | 124-146 (33.2-39%) |
| Gigalith (physWall, Leftovers) | 373-373 (99.7-99.7%) | 59-70 (15.8-18.7%) | 200-235 (53.5-62.8%) | 200-235 (53.5-62.8%) |
| Coalossal (physWall, Leftovers) | 891-1049 (210.1-247.4%) | 62-74 (14.6-17.5%) | 423-497 (99.8-117.2%) | 105-123 (24.8-29%) |
| Turtonator (physWall, Leftovers) | 232-274 (71.6-84.6%) | 115-136 (35.5-42%) | 195-228 (60.2-70.4%) | 48-57 (14.8-17.6%) |
| Alcremie (specWall, Leftovers) | 128-152 (38.3-45.5%) | 250-295 (74.9-88.3%) | 209-245 (62.6-73.4%) | 418-492 (125.1-147.3%) |
| Audino-Mega (physWall, no item) | 167-197 (40.7-48%) | 122-143 (29.8-34.9%) | 101-119 (24.6-29%) | 204-240 (49.8-58.5%) |
| Slowbro-Galar (physWall, Leftovers) | 271-319 (68.8-81%) | 148-174 (37.6-44.2%) | 247-291 (62.7-73.9%) | 123-145 (31.2-36.8%) |
| Vileplume (specWall, Black Sludge) | 78-92 (22-26%) | 226-266 (63.8-75.1%) | 188-222 (53.1-62.7%) | 188-222 (53.1-62.7%) |
| Lanturn (specWall, Leftovers) | 87-102 (19.2-22.5%) | 306-360 (67.4-79.3%) | 512-601 (112.8-132.4%) | 63-74 (13.9-16.3%) |
| Sandslash-Alola (physWall, Leftovers) | 288-339 (81.4-95.8%) | 62-74 (17.5-20.9%) | 211-248 (59.6-70.1%) | 105-123 (29.7-34.7%) |
| Wishiwashi-School (physWall, Leftovers) | 78-92 (26.5-31.3%) | 119-140 (40.5-47.6%) | 100-117 (34-39.8%) | 49-58 (16.7-19.7%) |

---

### Wo-Chien

_Flagged for: BST 580; ability: Tablets of Ruin._

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
  Trapping moves: Mean Look
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Knock Off, Leech Seed, Light Screen, Protect, Reflect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

Attacker: **Wo-Chien**, modest {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Foul Play | Leaf Storm | Pollen Puff | Tera Blast |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 53-62 (15.4-18%) | 343-343 (99.7-99.7%) | 88-104 (25.6-30.2%) | 39-45 (11.3-13.1%) |
| Avalugg-Hisui (physWall, Leftovers) | 58-68 (14.7-17.3%) | 1189-1400 (301.8-355.3%) | 254-300 (64.5-76.1%) | 113-133 (28.7-33.8%) |
| Milotic (specWall, Leftovers) | 74-87 (18.8-22.1%) | 339-400 (86-101.5%) | 72-85 (18.3-21.6%) | 65-76 (16.5-19.3%) |
| Florges (specWall, Leftovers) | 44-52 (12.2-14.4%) | 145-171 (40.3-47.5%) | 31-36 (8.6-10%) | 55-66 (15.3-18.3%) |
| Snorlax (specWall, Leftovers) | 139-165 (26.5-31.5%) | 185-218 (35.3-41.6%) | 79-93 (15.1-17.7%) | 71-83 (13.5-15.8%) |
| Mudsdale (physWall, Leftovers) | 88-105 (21.8-26%) | 626-737 (155-182.4%) | 135-158 (33.4-39.1%) | 119-140 (29.5-34.7%) |
| Jellicent (specWall, Leftovers) | 163-192 (40.3-47.5%) | 383-451 (94.8-111.6%) | 40-48 (9.9-11.9%) | 0-0 (0-0%) |
| Claydol (specWall, Leftovers) | 132-156 (40.7-48.1%) | 349-412 (107.7-127.2%) | 150-178 (46.3-54.9%) | 67-79 (20.7-24.4%) |
| Eldegoss (specWall, Leftovers) | 58-68 (17.9-21%) | 87-102 (26.9-31.5%) | 150-178 (46.3-54.9%) | 67-79 (20.7-24.4%) |
| Wo-Chien (specWall, Leftovers) | 41-49 (11-13.1%) | 79-93 (21.1-24.9%) | 278-327 (74.3-87.4%) | 61-72 (16.3-19.3%) |
| Gigalith (physWall, Leftovers) | 79-93 (21.1-24.9%) | 373-373 (99.7-99.7%) | 141-166 (37.7-44.4%) | 62-74 (16.6-19.8%) |
| Coalossal (physWall, Leftovers) | 54-65 (12.7-15.3%) | 299-351 (70.5-82.8%) | 63-75 (14.9-17.7%) | 57-67 (13.4-15.8%) |
| Turtonator (physWall, Leftovers) | 49-58 (15.1-17.9%) | 78-91 (24.1-28.1%) | 67-79 (20.7-24.4%) | 119-140 (36.7-43.2%) |
| Alcremie (specWall, Leftovers) | 37-45 (11.1-13.5%) | 172-204 (51.5-61.1%) | 36-44 (10.8-13.2%) | 66-78 (19.8-23.4%) |
| Audino-Mega (physWall, no item) | 20-24 (4.9-5.9%) | 224-263 (54.6-64.1%) | 48-57 (11.7-13.9%) | 85-101 (20.7-24.6%) |
| Slowbro-Galar (physWall, Leftovers) | 153-180 (38.8-45.7%) | 182-214 (46.2-54.3%) | 157-184 (39.8-46.7%) | 140-165 (35.5-41.9%) |
| Vileplume (specWall, Black Sludge) | 87-102 (24.6-28.8%) | 52-62 (14.7-17.5%) | 91-107 (25.7-30.2%) | 80-96 (22.6-27.1%) |
| Lanturn (specWall, Leftovers) | 91-107 (20-23.6%) | 469-552 (103.3-121.6%) | 101-118 (22.2-26%) | 89-105 (19.6-23.1%) |
| Sandslash-Alola (physWall, Leftovers) | 65-76 (18.4-21.5%) | 193-227 (54.5-64.1%) | 83-97 (23.4-27.4%) | 74-87 (20.9-24.6%) |
| Wishiwashi-School (physWall, Leftovers) | 81-97 (27.6-33%) | 423-499 (143.9-169.7%) | 91-107 (31-36.4%) | 80-96 (27.2-32.7%) |

---

### Zoroark

_Flagged for: setup + priority + reliable recovery; strong setup on a fast frame._

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

Attacker: **Zoroark**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**.

| PU defender (representative test set) | Foul Play | Focus Blast | Flamethrower | Hyper Voice |
| --- | --- | --- | --- | --- |
| Aggron (physWall, Leftovers) | 70-81 (20.3-23.5%) | 343-343 (99.7-99.7%) | 193-227 (56.1-66%) | 45-53 (13.1-15.4%) |
| Avalugg-Hisui (physWall, Leftovers) | 78-91 (19.8-23.1%) | 1406-1654 (356.9-419.8%) | 278-327 (70.6-83%) | 131-154 (33.2-39.1%) |
| Milotic (specWall, Leftovers) | 97-115 (24.6-29.2%) | 100-118 (25.4-29.9%) | 39-46 (9.9-11.7%) | 75-88 (19-22.3%) |
| Florges (specWall, Leftovers) | 58-68 (16.1-18.9%) | 42-50 (11.7-13.9%) | 68-80 (18.9-22.2%) | 65-76 (18.1-21.1%) |
| Snorlax (specWall, Leftovers) | 185-218 (35.3-41.6%) | 219-258 (41.8-49.2%) | 87-102 (16.6-19.5%) | 81-97 (15.5-18.5%) |
| Mudsdale (physWall, Leftovers) | 118-139 (29.2-34.4%) | 184-217 (45.5-53.7%) | 146-172 (36.1-42.6%) | 139-163 (34.4-40.3%) |
| Jellicent (specWall, Leftovers) | 215-254 (53.2-62.9%) | 0-0 (0-0%) | 44-52 (10.9-12.9%) | 0-0 (0-0%) |
| Claydol (specWall, Leftovers) | 175-206 (54-63.6%) | 50-59 (15.4-18.2%) | 81-96 (25-29.6%) | 78-91 (24.1-28.1%) |
| Eldegoss (specWall, Leftovers) | 78-91 (24.1-28.1%) | 102-120 (31.5-37%) | 165-193 (50.9-59.6%) | 78-91 (24.1-28.1%) |
| Wo-Chien (specWall, Leftovers) | 55-65 (14.7-17.4%) | 189-223 (50.5-59.6%) | 150-178 (40.1-47.6%) | 71-84 (19-22.5%) |
| Gigalith (physWall, Leftovers) | 105-123 (28.1-32.9%) | 373-373 (99.7-99.7%) | 76-91 (20.3-24.3%) | 72-85 (19.3-22.7%) |
| Coalossal (physWall, Leftovers) | 72-85 (17-20%) | 353-416 (83.3-98.1%) | 35-40 (8.3-9.4%) | 66-78 (15.6-18.4%) |
| Turtonator (physWall, Leftovers) | 65-76 (20.1-23.5%) | 184-217 (56.8-67%) | 36-42 (11.1-13%) | 139-163 (42.9-50.3%) |
| Alcremie (specWall, Leftovers) | 50-59 (15-17.7%) | 50-59 (15-17.7%) | 81-96 (24.3-28.7%) | 76-91 (22.8-27.2%) |
| Audino-Mega (physWall, no item) | 27-32 (6.6-7.8%) | 132-156 (32.2-38%) | 105-123 (25.6-30%) | 100-117 (24.4-28.5%) |
| Slowbro-Galar (physWall, Leftovers) | 202-239 (51.3-60.7%) | 53-63 (13.5-16%) | 171-201 (43.4-51%) | 162-191 (41.1-48.5%) |
| Vileplume (specWall, Black Sludge) | 115-136 (32.5-38.4%) | 62-72 (17.5-20.3%) | 198-234 (55.9-66.1%) | 93-110 (26.3-31.1%) |
| Lanturn (specWall, Leftovers) | 120-143 (26.4-31.5%) | 137-162 (30.2-35.7%) | 54-65 (11.9-14.3%) | 104-122 (22.9-26.9%) |
| Sandslash-Alola (physWall, Leftovers) | 87-101 (24.6-28.5%) | 917-1080 (259-305.1%) | 728-856 (205.6-241.8%) | 85-101 (24-28.5%) |
| Wishiwashi-School (physWall, Leftovers) | 109-128 (37.1-43.5%) | 124-146 (42.2-49.7%) | 49-58 (16.7-19.7%) | 93-110 (31.6-37.4%) |
---

## H. Serious PU → ZU candidate evidence

The 22 PU entries with the lowest combination of engine
offence, utility breadth and BST. **Low output is not a verdict** — several of
these will have a role ZU cannot fill, which is what section K is for, and the
binding question is whether ZU can absorb them healthily.

### Wobbuffet

**Wobbuffet** — Psychic, BST 405 (190/33/58/33/58/33), Shadow Tag / Telepathy, item free
Roles: setup | STAB: Psychic Mirror Coat fixedS | Recovery: none | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Chimecho | Psychic | 455 (75/50/80/95/90/65) | Levitate | removal, recovery, pivot, setup, cleric, status | Recover, Rest | Psychic Future Sight 120S |
| Cosmoem | Psychic | 400 (43/29/131/29/131/37) | Sturdy | pivot, setup | none | none |
| Espurr | Psychic | 355 (62/48/54/63/60/68) | Keen Eye, Infiltrator, Own Tempo | recovery, setup, priority, cleric, status | Rest | Psychic Dream Eater 100S |
| Girafarig | Normal/Psychic | 455 (70/80/65/90/65/85) | Inner Focus, Early Bird, Sap Sipper | recovery, pivot, setup, priority, cleric, status | Rest | Normal Double-Edge 120P · Psychic Future Sight 120S |
| Grumpig | Psychic | 470 (80/45/65/90/110/80) | Thick Fat, Own Tempo, Gluttony | recovery, setup, phazing, cleric, status | Rest | Psychic Future Sight 120S |

---

### Wishiwashi

**Wishiwashi** — Water, BST 175 (45/20/20/25/25/40), Schooling, item free
Roles: recovery, pivot, status | STAB: Water Hydro Pump 120S | Recovery: Rest | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Basculin | Water | 460 (70/92/65/80/55/98) | Reckless, Adaptability, Mold Breaker | recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S |
| Brionne | Water | 420 (60/69/69/91/81/50) | Torrent, Liquid Voice | recovery, pivot, setup, priority, cleric, status | Rest | Water Hydro Pump 120S |
| Buizel | Water | 330 (55/65/35/60/30/85) | Swift Swim, Water Veil | recovery, pivot, setup, priority, phazing, status | Rest | Water Hydro Pump 120S |
| Carvanha | Water/Dark | 305 (45/90/20/65/20/65) | Rough Skin, Speed Boost | recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Dark Crunch 80P |
| Chinchou | Water/Electric | 330 (75/38/38/56/56/67) | Volt Absorb, Illuminate, Water Absorb | recovery, pivot, setup, priority, cleric, status | Rest | Water Hydro Pump 120S · Electric Thunder 120S |

---

### Naclstack

**Naclstack** — Rock, BST 355 (60/60/100/35/65/35), Purifying Salt / Sturdy / Clear Body, item free
Roles: hazards, recovery, setup | STAB: Rock Meteor Beam 120 (charge)S | Recovery: Recover, Rest | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Amaura | Rock/Ice | 362 (77/59/50/67/63/46) | Refrigerate, Snow Warning | hazards, recovery, setup, phazing, status | Rest | Rock Meteor Beam 120 (charge)S · Ice Blizzard 120S |
| Anorith | Rock/Bug | 355 (45/95/50/40/50/75) | Battle Armor, Swift Swim | hazards, removal, recovery, setup, priority, status | Rest | Rock Rock Blast 25x2-5P · Bug X-Scissor 80P |
| Archen | Rock/Flying | 401 (55/112/45/74/45/70) | Defeatist | hazards, removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Rock Head Smash 150P · Flying Acrobatics 110P |
| Aron | Steel/Rock | 330 (50/70/100/40/40/30) | Sturdy, Rock Head, Heavy Metal | hazards, recovery, setup, phazing, status | Rest | Steel Steel Roller 130P · Rock Head Smash 150P |
| Binacle | Rock/Water | 306 (42/52/67/39/56/50) | Tough Claws, Sniper, Pickpocket | hazards, recovery, setup, status | Rest | Rock Stone Edge 100P · Water Surf 95S |

---

### Slowpoke

**Slowpoke** — Water/Psychic, BST 315 (90/65/65/40/40/15), Oblivious / Own Tempo / Regenerator, item free
Roles: recovery, pivot, setup, status | STAB: Water Hydro Pump 120S · Psychic Future Sight 120S | Recovery: Rest, Slack Off | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Abra | Psychic | 310 (25/20/15/105/55/90) | Synchronize, Inner Focus, Magic Guard | recovery, pivot, setup, status | Rest | Psychic Dream Eater 100S |
| Buizel | Water | 330 (55/65/35/60/30/85) | Swift Swim, Water Veil | recovery, pivot, setup, priority, phazing, status | Rest | Water Hydro Pump 120S |
| Carvanha | Water/Dark | 305 (45/90/20/65/20/65) | Rough Skin, Speed Boost | recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Dark Crunch 80P |
| Chinchou | Water/Electric | 330 (75/38/38/56/56/67) | Volt Absorb, Illuminate, Water Absorb | recovery, pivot, setup, priority, cleric, status | Rest | Water Hydro Pump 120S · Electric Thunder 120S |
| Chingling | Psychic | 285 (45/30/50/65/50/45) | Levitate | recovery, pivot, setup, cleric, status | Recover, Rest | Psychic Future Sight 120S |

---

### Slowpoke-Galar

**Slowpoke-Galar** — Psychic, BST 315 (90/65/65/40/40/15), Gluttony / Own Tempo / Regenerator, item free
Roles: recovery, pivot, setup, status | STAB: Psychic Future Sight 120S | Recovery: Rest, Slack Off | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Abra | Psychic | 310 (25/20/15/105/55/90) | Synchronize, Inner Focus, Magic Guard | recovery, pivot, setup, status | Rest | Psychic Dream Eater 100S |
| Chingling | Psychic | 285 (45/30/50/65/50/45) | Levitate | recovery, pivot, setup, cleric, status | Recover, Rest | Psychic Future Sight 120S |
| Drowzee | Psychic | 328 (60/48/45/43/90/42) | Insomnia, Forewarn, Inner Focus | recovery, pivot, setup, cleric, status | Rest | Psychic Future Sight 120S |
| Elgyem | Psychic | 335 (55/55/55/85/55/30) | Telepathy, Synchronize, Analytic | recovery, pivot, setup, status | Recover, Rest | Psychic Synchronoise 120S |
| Exeggcute | Grass/Psychic | 325 (60/40/80/60/45/40) | Chlorophyll, Harvest | recovery, pivot, setup, priority, cleric, status | Rest | Grass Leaf Storm 140S · Psychic Dream Eater 100S |

---

### Lampent

**Lampent** — Ghost/Fire, BST 370 (60/40/60/95/60/55), Flash Fire / Flame Body / Infiltrator / Shadow Tag, item free
Roles: recovery, setup, status | STAB: Ghost Shadow Ball 80S · Fire Overheat 140S | Recovery: Rest | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Litwick | Ghost/Fire | 275 (50/30/55/65/55/20) | Flash Fire, Flame Body, Infiltrator, Shadow Tag | recovery, setup, status | Rest | Ghost Shadow Ball 80S · Fire Overheat 140S |
| Braixen | Fire | 409 (59/59/58/90/70/73) | Blaze, Magician | recovery, setup, cleric, status | Rest | Fire Overheat 140S |
| Carkol | Rock/Fire | 410 (80/60/90/60/70/50) | Steam Engine, Flame Body, Flash Fire | hazards, removal, recovery, setup, status | Rest | Rock Meteor Beam 120 (charge)S · Fire Overheat 140S |
| Castform-Sunny | Fire | 420 (70/70/70/70/70/70) | Forecast | removal, recovery, setup, status | Rest | Fire Fire Blast 120S |
| Charmander | Fire | 309 (39/52/43/60/50/65) | Blaze, Solar Power | recovery, setup, priority, phazing, status | Rest | Fire Overheat 140S |

---

### Arctovish

**Arctovish** — Water/Ice, BST 505 (90/90/100/80/90/55), Water Absorb / Ice Body / Slush Rush, item free
Roles: recovery, setup | STAB: Water Fishious Rend 170P · Ice Blizzard 120S | Recovery: Rest | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Lapras | Water/Ice | 535 (130/85/80/85/95/60) | Water Absorb, Shell Armor, Hydration | recovery, setup, priority, phazing, cleric, status | Rest | Water Hydro Pump 120S · Ice Blizzard 120S |
| Walrein | Ice/Water | 530 (110/80/90/95/90/65) | Thick Fat, Ice Body, Oblivious | recovery, setup, phazing, status | Rest | Ice Blizzard 120S · Water Hydro Pump 120S |
| Sealeo | Ice/Water | 410 (90/60/70/75/70/45) | Thick Fat, Ice Body, Oblivious | recovery, setup, phazing, status | Rest | Ice Blizzard 120S · Water Surf 95S |
| Spheal | Ice/Water | 290 (70/40/50/55/50/25) | Thick Fat, Ice Body, Oblivious | recovery, setup, status | Rest | Ice Blizzard 120S · Water Surf 95S |
| Abomasnow | Grass/Ice | 494 (90/92/75/92/85/60) | Snow Warning, Soundproof | recovery, setup, priority, status | Rest | Grass Leaf Storm 140S · Ice Blizzard 120S |

---

### Crocalor

**Crocalor** — Fire, BST 411 (81/55/78/90/58/49), Blaze / Unaware, item free
Roles: recovery, phazing, status | STAB: Fire Overheat 140S | Recovery: Rest, Slack Off | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Camerupt | Fire/Ground | 460 (70/100/70/105/75/40) | Magma Armor, Solid Rock, Anger Point | hazards, recovery, setup, phazing, status | Rest | Fire Eruption 150S · Ground Earthquake 100P |
| Charmeleon | Fire | 405 (58/64/58/80/65/80) | Blaze, Solar Power | recovery, setup, priority, phazing, status | Rest | Fire Overheat 140S |
| Growlithe | Fire | 350 (55/70/45/70/50/60) | Intimidate, Flash Fire, Justified | recovery, setup, phazing, status | Rest | Fire Overheat 140S |
| Growlithe-Hisui | Fire/Rock | 350 (60/75/45/65/50/55) | Intimidate, Flash Fire, Rock Head | hazards, recovery, setup, phazing, status | Rest | Fire Overheat 140S · Rock Head Smash 150P |
| Litleo | Fire/Normal | 369 (62/50/58/73/54/72) | Rivalry, Unnerve, Moxie | recovery, setup, phazing, status | Rest | Fire Overheat 140S · Normal Double-Edge 120P |

---

### Duosion

**Duosion** — Psychic, BST 370 (65/40/50/125/60/30), Overcoat / Magic Guard / Regenerator, item free
Roles: recovery, setup, status | STAB: Psychic Future Sight 120S | Recovery: Recover, Rest | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Abra | Psychic | 310 (25/20/15/105/55/90) | Synchronize, Inner Focus, Magic Guard | recovery, pivot, setup, status | Rest | Psychic Dream Eater 100S |
| Drowzee | Psychic | 328 (60/48/45/43/90/42) | Insomnia, Forewarn, Inner Focus | recovery, pivot, setup, cleric, status | Rest | Psychic Future Sight 120S |
| Elgyem | Psychic | 335 (55/55/55/85/55/30) | Telepathy, Synchronize, Analytic | recovery, pivot, setup, status | Recover, Rest | Psychic Synchronoise 120S |
| Espurr | Psychic | 355 (62/48/54/63/60/68) | Keen Eye, Infiltrator, Own Tempo | recovery, setup, priority, cleric, status | Rest | Psychic Dream Eater 100S |
| Exeggcute | Grass/Psychic | 325 (60/40/80/60/45/40) | Chlorophyll, Harvest | recovery, pivot, setup, priority, cleric, status | Rest | Grass Leaf Storm 140S · Psychic Dream Eater 100S |

---

### Cramorant

**Cramorant** — Flying/Water, BST 475 (70/85/55/85/95/85), Gulp Missile, item free
Roles: removal, recovery, setup | STAB: Flying Brave Bird 120P · Water Hydro Pump 120S | Recovery: Rest, Roost | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Wingull | Water/Flying | 270 (40/30/30/55/30/85) | Keen Eye, Hydration, Rain Dish | removal, recovery, pivot, setup, priority, status | Rest, Roost | Water Hydro Pump 120S · Flying Sky Attack 140 (charge)P |
| Castform-Rainy | Water | 420 (70/70/70/70/70/70) | Forecast | removal, recovery, setup, status | Rest | Water Hydro Pump 120S |
| Charizard | Fire/Flying | 534 (78/84/78/109/85/100) | Blaze, Solar Power | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Flying Hurricane 120S |
| Chatot | Normal/Flying | 411 (76/65/45/92/42/91) | Keen Eye, Tangled Feet, Big Pecks | removal, recovery, pivot, setup, status | Rest, Roost | Normal Boomburst 140S · Flying Sky Attack 140 (charge)P |
| Dartrix | Grass/Flying | 420 (78/75/75/70/70/52) | Overgrow, Long Reach | removal, recovery, pivot, setup, priority, status | Rest, Roost | Grass Leaf Storm 140S · Flying Sky Attack 140 (charge)P |

---

### Jellicent

**Jellicent** — Water/Ghost, BST 480 (100/60/70/85/105/60), Water Absorb / Cursed Body / Damp, item free
Roles: recovery, setup, status | STAB: Water Water Spout 150S · Ghost Poltergeist 110P | Recovery: Recover, Rest | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Frillish | Water/Ghost | 335 (55/40/50/65/85/40) | Water Absorb, Cursed Body, Damp | recovery, setup, status | Recover, Rest | Water Water Spout 150S · Ghost Poltergeist 110P |
| Banette | Ghost | 455 (64/115/65/83/63/65) | Insomnia, Frisk, Cursed Body | recovery, setup, priority, status | Rest | Ghost Poltergeist 110P |
| Basculin | Water | 460 (70/92/65/80/55/98) | Reckless, Adaptability, Mold Breaker | recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S |
| Brionne | Water | 420 (60/69/69/91/81/50) | Torrent, Liquid Voice | recovery, pivot, setup, priority, cleric, status | Rest | Water Hydro Pump 120S |
| Carracosta | Water/Rock | 495 (74/108/133/83/65/32) | Solid Rock, Sturdy, Swift Swim | hazards, recovery, setup, priority, status | Rest | Water Hydro Pump 120S · Rock Meteor Beam 120 (charge)S |

---

### Audino

**Audino** — Normal, BST 445 (103/60/86/60/86/50), Healer / Regenerator / Klutz, item free
Roles: recovery, setup, cleric, status | STAB: Normal Last Resort 140P | Recovery: Rest | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Delcatty | Normal | 400 (70/65/65/55/55/90) | Cute Charm, Normalize, Wonder Skin | recovery, pivot, setup, priority, cleric, status | Rest | Normal Last Resort 140P |
| Farfetch’d | Normal/Flying | 377 (52/90/55/58/62/60) | Keen Eye, Inner Focus, Defiant | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest, Roost | Normal Trump Card 200S · Flying Sky Attack 140 (charge)P |
| Girafarig | Normal/Psychic | 455 (70/80/65/90/65/85) | Inner Focus, Early Bird, Sap Sipper | recovery, pivot, setup, priority, cleric, status | Rest | Normal Double-Edge 120P · Psychic Future Sight 120S |
| Kangaskhan | Normal | 490 (105/95/80/40/80/90) | Early Bird, Scrappy, Inner Focus | recovery, setup, priority, phazing, cleric, status | Rest | Normal Last Resort 140P |
| Lickitung | Normal | 385 (90/55/75/60/75/30) | Own Tempo, Oblivious, Cloud Nine | recovery, setup, phazing, cleric, status | Rest | Normal Skull Bash 130P |

---

### Porygon

**Porygon** — Normal, BST 395 (65/60/70/85/75/40), Trace / Download / Analytic, item free
Roles: recovery, pivot, setup, status | STAB: Normal Last Resort 140P | Recovery: Recover, Rest | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Aipom | Normal | 360 (55/70/55/40/55/85) | Run Away, Pickup, Skill Link | recovery, pivot, setup, priority, status | Rest | Normal Last Resort 140P |
| Buneary | Normal | 350 (55/66/44/44/56/85) | Run Away, Klutz, Limber | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Normal Last Resort 140P |
| Chatot | Normal/Flying | 411 (76/65/45/92/42/91) | Keen Eye, Tangled Feet, Big Pecks | removal, recovery, pivot, setup, status | Rest, Roost | Normal Boomburst 140S · Flying Sky Attack 140 (charge)P |
| Deerling | Normal/Grass | 335 (60/60/50/40/50/75) | Chlorophyll, Sap Sipper, Serene Grace | recovery, pivot, setup, priority, cleric, status | Rest | Normal Last Resort 140P · Grass Leaf Storm 140S |
| Delcatty | Normal | 400 (70/65/65/55/55/90) | Cute Charm, Normalize, Wonder Skin | recovery, pivot, setup, priority, cleric, status | Rest | Normal Last Resort 140P |

---

### Thwackey

**Thwackey** — Grass, BST 420 (70/85/70/55/60/80), Overgrow / Grassy Surge, item free
Roles: recovery, pivot, setup, priority | STAB: Grass Leaf Storm 140S | Recovery: Rest | Priority: Grassy Glide 70P Grass (+1), Fake Out 40P Normal (+3)

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Dartrix | Grass/Flying | 420 (78/75/75/70/70/52) | Overgrow, Long Reach | removal, recovery, pivot, setup, priority, status | Rest, Roost | Grass Leaf Storm 140S · Flying Sky Attack 140 (charge)P |
| Flapple | Grass/Dragon | 485 (70/110/80/95/60/70) | Ripen, Gluttony, Hustle | recovery, pivot, setup, priority | Rest | Grass Grav Apple 80P · Dragon Outrage 120P |
| Floragato | Grass | 410 (61/80/63/60/63/83) | Overgrow, Protean | recovery, pivot, setup, priority | Rest | Grass Leaf Storm 140S |
| Sawsbuck | Normal/Grass | 475 (80/100/70/60/70/95) | Chlorophyll, Sap Sipper, Serene Grace | recovery, pivot, setup, priority, cleric, status | Rest | Normal Last Resort 140P · Grass Petal Blizzard 90P |
| Swadloon | Bug/Grass | 380 (55/63/90/50/80/42) | Leaf Guard, Chlorophyll, Overcoat | hazards, recovery, pivot, setup, priority, status | Rest | Bug Bug Buzz 90S · Grass Solar Beam 120 (charge)S |

---

### Dusclops

**Dusclops** — Ghost, BST 455 (40/70/130/60/130/25), Pressure / Frisk, item free
Roles: recovery, setup, priority, status | STAB: Ghost Poltergeist 110P | Recovery: Rest | Priority: Sucker Punch 80P Dark (+1), Shadow Sneak 40P Ghost (+1)

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Banette | Ghost | 455 (64/115/65/83/63/65) | Insomnia, Frisk, Cursed Body | recovery, setup, priority, status | Rest | Ghost Poltergeist 110P |
| Cursola | Ghost | 510 (60/95/50/145/130/30) | Weak Armor, Perish Body | hazards, recovery, setup, priority, cleric, status | Recover, Rest | Ghost Shadow Ball 80S |
| Drakloak | Dragon/Ghost | 410 (68/80/50/60/50/102) | Clear Body, Infiltrator, Cursed Body | recovery, pivot, setup, priority, phazing, status | Rest | Dragon Draco Meteor 140S · Ghost Phantom Force 90 (charge)P |
| Drifblim | Ghost/Flying | 498 (150/80/44/90/54/80) | Aftermath, Unburden, Flare Boost | removal, recovery, pivot, setup, priority, status | Rest | Ghost Phantom Force 90 (charge)P · Flying Acrobatics 110P |
| Gourgeist | Ghost/Grass | 494 (65/90/122/58/75/84) | Pickup, Frisk, Insomnia | recovery, setup, priority, status | Rest | Ghost Poltergeist 110P · Grass Power Whip 120P |

---

### Raboot

**Raboot** — Fire, BST 420 (65/86/60/55/60/94), Blaze / Libero, item free
Roles: recovery, pivot, setup, priority | STAB: Fire Overheat 140S | Recovery: Rest | Priority: Sucker Punch 80P Dark (+1), Quick Attack 40P Normal (+1)

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Fletchinder | Fire/Flying | 382 (62/73/55/56/52/84) | Flame Body, Gale Wings | removal, recovery, pivot, setup, priority, status | Rest, Roost | Fire Overheat 140S · Flying Brave Bird 120P |
| Monferno | Fire/Fighting | 405 (64/78/52/78/52/81) | Blaze, Iron Fist | hazards, recovery, pivot, setup, priority, status | Rest, Slack Off | Fire Overheat 140S · Fighting Focus Punch 150P |
| Torracat | Fire | 420 (65/85/50/80/50/90) | Blaze, Intimidate | recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S |
| Chimchar | Fire | 309 (44/58/44/58/44/61) | Blaze, Iron Fist | hazards, recovery, pivot, setup, priority, status | Rest, Slack Off | Fire Overheat 140S |
| Flareon | Fire | 525 (65/130/60/95/110/65) | Flash Fire, Guts | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Fire Overheat 140S |

---

### Tauros-Paldea-Blaze

**Tauros-Paldea-Blaze** — Fighting/Fire, BST 490 (75/110/105/30/70/100), Intimidate / Anger Point / Cud Chew, item free
Roles: recovery, setup, status | STAB: Fighting Close Combat 120P · Fire Flare Blitz 120P | Recovery: Rest | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Monferno | Fire/Fighting | 405 (64/78/52/78/52/81) | Blaze, Iron Fist | hazards, recovery, pivot, setup, priority, status | Rest, Slack Off | Fire Overheat 140S · Fighting Focus Punch 150P |
| Pignite | Fire/Fighting | 418 (90/93/55/70/55/55) | Blaze, Thick Fat | recovery, setup, priority, phazing, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P |
| Camerupt | Fire/Ground | 460 (70/100/70/105/75/40) | Magma Armor, Solid Rock, Anger Point | hazards, recovery, setup, phazing, status | Rest | Fire Eruption 150S · Ground Earthquake 100P |
| Charizard | Fire/Flying | 534 (78/84/78/109/85/100) | Blaze, Solar Power | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Flying Hurricane 120S |
| Crabominable | Fighting/Ice | 478 (97/132/77/62/67/43) | Hyper Cutter, Iron Fist, Anger Point | recovery, setup, priority, status | Rest | Fighting Focus Punch 150P · Ice Ice Hammer 100P |

---

### Alcremie

**Alcremie** — Fairy, BST 495 (65/60/75/110/121/64), Sweet Veil / Aroma Veil, item free
Roles: recovery, setup, cleric | STAB: Fairy Misty Explosion 100S | Recovery: Recover, Rest | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Dachsbun | Fairy | 477 (57/80/115/50/80/95) | Well-Baked Body, Aroma Veil | recovery, pivot, setup, phazing, cleric, status | Rest | Fairy Play Rough 90P |
| Granbull | Fairy | 450 (90/120/75/60/60/45) | Intimidate, Quick Feet, Rattled | recovery, setup, phazing, cleric, status | Rest | Fairy Play Rough 90P |
| Wigglytuff | Normal/Fairy | 435 (140/70/45/85/50/45) | Cute Charm, Competitive, Frisk | hazards, recovery, pivot, setup, cleric, status | Rest | Normal Self-Destruct 200P · Fairy Misty Explosion 100S |
| Cleffa | Fairy | 218 (50/25/28/45/55/15) | Cute Charm, Magic Guard, Friend Guard | recovery, setup, cleric, status | Rest, Soft-Boiled | Fairy Play Rough 90P |
| Cutiefly | Bug/Fairy | 304 (40/45/40/55/40/84) | Honey Gather, Shield Dust, Sweet Veil | hazards, removal, recovery, pivot, setup, cleric, status | Rest, Roost | Bug Bug Buzz 90S · Fairy Moonblast 95S |

---

### Machoke

**Machoke** — Fighting, BST 405 (80/100/70/50/60/45), Guts / No Guard / Steadfast, item free
Roles: recovery, setup, priority, status | STAB: Fighting Focus Punch 150P | Recovery: Rest | Priority: Bullet Punch 40P Steel (+1), Vacuum Wave 40S Fighting (+1)

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Crabrawler | Fighting | 338 (47/82/57/42/47/63) | Hyper Cutter, Iron Fist, Anger Point | recovery, setup, priority, status | Rest | Fighting Focus Punch 150P |
| Farfetch’d-Galar | Fighting | 377 (52/95/55/58/62/55) | Steadfast, Scrappy | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest, Roost | Fighting Close Combat 120P |
| Hakamo-o | Dragon/Fighting | 420 (55/75/90/65/70/65) | Bulletproof, Soundproof, Overcoat | recovery, setup, priority, phazing, status | Rest | Dragon Draco Meteor 140S · Fighting Focus Punch 150P |
| Hitmonchan | Fighting | 455 (50/105/79/35/110/76) | Keen Eye, Iron Fist, Inner Focus | removal, recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P |
| Hitmontop | Fighting | 455 (50/95/95/35/110/70) | Intimidate, Technician, Steadfast | removal, recovery, pivot, setup, priority, status | Rest | Fighting High Jump Kick 130P |

---

### Sliggoo-Hisui

**Sliggoo-Hisui** — Steel/Dragon, BST 452 (58/75/83/83/113/40), Sap Sipper / Shell Armor / Gooey, item free
Roles: recovery, setup, cleric, status | STAB: Steel Steel Beam 140S · Dragon Draco Meteor 140S | Recovery: Rest | Priority: none

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Shelgon | Dragon | 420 (65/95/100/60/50/50) | Rock Head, Overcoat | recovery, setup, phazing, cleric, status | Rest | Dragon Draco Meteor 140S |
| Sliggoo | Dragon | 452 (68/75/53/83/113/60) | Sap Sipper, Hydration, Gooey | recovery, setup, cleric, status | Rest | Dragon Draco Meteor 140S |
| Bagon | Dragon | 300 (45/75/60/40/30/50) | Rock Head, Sheer Force | recovery, setup, phazing, cleric, status | Rest | Dragon Outrage 120P |
| Exeggutor-Alola | Grass/Dragon | 530 (95/105/85/125/75/45) | Frisk, Harvest | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Grass Leaf Storm 140S · Dragon Draco Meteor 140S |
| Goomy | Dragon | 300 (45/50/35/55/75/40) | Sap Sipper, Hydration, Gooey | recovery, setup, cleric, status | Rest | Dragon Draco Meteor 140S |

---

### Tangela

**Tangela** — Grass, BST 435 (65/55/115/100/40/60), Chlorophyll / Leaf Guard / Regenerator, item free
Roles: recovery, setup, priority, status | STAB: Grass Leaf Storm 140S | Recovery: Rest | Priority: Grassy Glide 70P Grass (+1)

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Abomasnow | Grass/Ice | 494 (90/92/75/92/85/60) | Snow Warning, Soundproof | recovery, setup, priority, status | Rest | Grass Leaf Storm 140S · Ice Blizzard 120S |
| Bayleef | Grass | 405 (60/62/80/63/80/60) | Overgrow, Leaf Guard | recovery, setup, priority, cleric, status | Rest | Grass Leaf Storm 140S |
| Cacturne | Grass/Dark | 475 (70/115/60/115/60/55) | Sand Veil, Water Absorb | hazards, recovery, setup, priority, status | Rest | Grass Leaf Storm 140S · Dark Foul Play 95P |
| Cherrim | Grass | 450 (70/60/70/87/78/85) | Flower Gift | recovery, setup, priority, cleric, status | Rest | Grass Solar Blade 125 (charge)P |
| Cherrim-Sunshine | Grass | 450 (70/60/70/87/78/85) | Flower Gift | recovery, setup, priority, cleric, status | Rest | Grass Solar Blade 125 (charge)P |

---

### Mienfoo

**Mienfoo** — Fighting, BST 350 (45/85/50/55/50/65), Inner Focus / Regenerator / Reckless, item free
Roles: recovery, pivot, setup, priority, status | STAB: Fighting Focus Punch 150P | Recovery: Rest | Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3)

Closest ZU entries by shared role, typing and BST band:

| ZU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Croagunk | Poison/Fighting | 300 (48/61/40/61/40/50) | Anticipation, Dry Skin, Poison Touch | recovery, pivot, setup, priority, status | Rest | Poison Belch 120S · Fighting Focus Punch 150P |
| Farfetch’d-Galar | Fighting | 377 (52/95/55/58/62/55) | Steadfast, Scrappy | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest, Roost | Fighting Close Combat 120P |
| Mankey | Fighting | 305 (40/80/35/35/45/70) | Vital Spirit, Anger Point, Defiant | recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P |
| Monferno | Fire/Fighting | 405 (64/78/52/78/52/81) | Blaze, Iron Fist | hazards, recovery, pivot, setup, priority, status | Rest, Slack Off | Fire Overheat 140S · Fighting Focus Punch 150P |
| Pawmo | Electric/Fighting | 350 (60/75/40/50/40/85) | Volt Absorb, Natural Cure, Iron Fist | recovery, pivot, setup, priority, cleric, status | Rest | Electric Thunder 120S · Fighting Focus Punch 150P |
---

## I. PU offensive matrices

Every matrix in section G runs against the **same PU defensive core**, built from
PU entries rather than reused from NU, so candidates compare column by column.

**The core (20 entries):** Aggron (physWall), Avalugg-Hisui (physWall), Milotic (specWall), Florges (specWall), Snorlax (specWall), Mudsdale (physWall), Jellicent (specWall), Claydol (specWall), Eldegoss (specWall), Wo-Chien (specWall), Gigalith (physWall), Coalossal (physWall), Turtonator (physWall), Alcremie (specWall), Audino-Mega (physWall), Slowbro-Galar (physWall), Vileplume (specWall), Lanturn (specWall), Sandslash-Alola (physWall), Wishiwashi-School (physWall).

Type and role coverage of the core: physical walls, special walls, Steel, Water,
Ground, Fairy, Flying-resist, Grass, Poison, Ghost, Dark, Rock, Ice, Fire,
Regenerator (Eldegoss, Slowbro-Galar), immunity absorbers (Jellicent Water
Absorb, Lanturn Volt Absorb, Claydol Levitate) and the tier's one Mega.

Every cell states attacker, nature, EVs, item, ability and move; defenders carry
the spread and item named in the row. These are **representative test sets**, not
usage sets — RedGPT has no usage data.

Classification — hard counter, reliable counter, soft counter, check,
revenge-only, not an answer — is yours; the engine supplies damage, and recovery,
speed and hazard chip are in sections C, L, M and P.
---

## J. PU revenge / check matrix

PU's counterplay into each upward candidate. Attackers are **representative test
sets**; the target sits on its own offensive spread from section G, so these are
the numbers against a candidate that has *not* invested in bulk.

| Candidate | Archeops Stone Edge | Electrode-Hisui Thunderbolt | Floatzel Waterfall | Ambipom Tail Slap | Salazzle Sludge Wave | Ninetales-Alola Ice Beam | Galvantula Thunder | Mismagius Shadow Ball | Zoroark Dark Pulse | Tauros-Paldea-Blaze Close Combat |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dugtrio | 224-264 (105.7-124.5%) | 0-0 (0-0%) | 512-603 (241.5-284.4%) | 345-408 (162.7-192.5%) | 94-110 (44.3-51.9%) | 306-361 (144.3-170.3%) | 0-0 (0-0%) | 197-232 (92.9-109.4%) | 217-256 (102.4-120.8%) | 454-534 (214.2-251.9%) |
| Ambipom | 364-429 (124.7-146.9%) | 159-187 (54.5-64%) | 208-244 (71.2-83.6%) | 282-330 (96.6-113%) | 196-231 (67.1-79.1%) | 160-188 (54.8-64.4%) | 226-266 (77.4-91.1%) | 0-0 (0-0%) | 227-267 (77.7-91.4%) | 736-866 (252.1-296.6%) |
| Gothorita | 348-409 (132.8-156.1%) | 130-153 (49.6-58.4%) | 197-232 (75.2-88.5%) | 267-318 (101.9-121.4%) | 161-189 (61.5-72.1%) | 131-154 (50-58.8%) | 185-218 (70.6-83.2%) | 340-400 (129.8-152.7%) | 373-438 (142.4-167.2%) | 175-206 (66.8-78.6%) |
| Medicham | 164-193 (62.6-73.7%) | 144-169 (55-64.5%) | 187-221 (71.4-84.4%) | 255-300 (97.3-114.5%) | 178-209 (67.9-79.8%) | 145-170 (55.3-64.9%) | 205-241 (78.2-92%) | 375-442 (143.1-168.7%) | 205-241 (78.2-92%) | 166-195 (63.4-74.4%) |
| Salazzle | 785-923 (282.4-332%) | 171-201 (61.5-72.3%) | 447-526 (160.8-189.2%) | 303-357 (109-128.4%) | 105-124 (37.8-44.6%) | 86-101 (30.9-36.3%) | 243-286 (87.4-102.9%) | 223-262 (80.2-94.2%) | 244-288 (87.8-103.6%) | 198-233 (71.2-83.8%) |
| Archeops | 738-868 (252.7-297.3%) | 322-379 (110.3-129.8%) | 421-495 (144.2-169.5%) | 138-165 (47.3-56.5%) | 99-117 (33.9-40.1%) | 325-382 (111.3-130.8%) | 458-539 (156.8-184.6%) | 210-247 (71.9-84.6%) | 230-270 (78.8-92.5%) | 372-438 (127.4-150%) |
| Bruxish | 348-409 (125.2-147.1%) | 304-358 (109.4-128.8%) | 98-115 (35.3-41.4%) | 267-318 (96-114.4%) | 188-221 (67.6-79.5%) | 76-90 (27.3-32.4%) | 433-509 (155.8-183.1%) | 396-466 (142.4-167.6%) | 435-512 (156.5-184.2%) | 175-206 (62.9-74.1%) |
| Floatzel | 419-493 (134.3-158%) | 392-461 (125.6-147.8%) | 118-140 (37.8-44.9%) | 321-381 (102.9-122.1%) | 242-285 (77.6-91.3%) | 98-116 (31.4-37.2%) | 558-657 (178.8-210.6%) | 256-301 (82.1-96.5%) | 280-330 (89.7-105.8%) | 423-498 (135.6-159.6%) |
| Lampent | 785-923 (299.6-352.3%) | 171-201 (65.3-76.7%) | 447-526 (170.6-200.8%) | 0-0 (0-0%) | 105-124 (40.1-47.3%) | 86-101 (32.8-38.5%) | 243-286 (92.7-109.2%) | 447-526 (170.6-200.8%) | 490-577 (187-220.2%) | 0-0 (0-0%) |
| Ninjask | 1941-2284 (735.2-865.2%) | 392-461 (148.5-174.6%) | 275-325 (104.2-123.1%) | 372-438 (140.9-165.9%) | 242-285 (91.7-108%) | 395-465 (149.6-176.1%) | 558-657 (211.4-248.9%) | 256-301 (97-114%) | 280-330 (106.1-125%) | 122-144 (46.2-54.5%) |
| Raboot | 785-923 (288.6-339.3%) | 171-201 (62.9-73.9%) | 447-526 (164.3-193.4%) | 303-357 (111.4-131.3%) | 211-249 (77.6-91.5%) | 86-101 (31.6-37.1%) | 243-286 (89.3-105.1%) | 223-262 (82-96.3%) | 244-288 (89.7-105.9%) | 396-466 (145.6-171.3%) |
| Rampardos | 392-461 (116.7-137.2%) | 196-230 (58.3-68.5%) | 447-526 (133-156.5%) | 150-177 (44.6-52.7%) | 121-142 (36-42.3%) | 197-232 (58.6-69%) | 279-328 (83-97.6%) | 256-301 (76.2-89.6%) | 280-330 (83.3-98.2%) | 792-932 (235.7-277.4%) |
| Scyther | 1251-1472 (443.6-522%) | 273-322 (96.8-114.2%) | 178-209 (63.1-74.1%) | 243-288 (86.2-102.1%) | 169-199 (59.9-70.6%) | 276-324 (97.9-114.9%) | 389-458 (137.9-162.4%) | 178-209 (63.1-74.1%) | 195-230 (69.1-81.6%) | 78-92 (27.7-32.6%) |
| Shaymin | 260-306 (76-89.5%) | 57-67 (16.7-19.6%) | 74-87 (21.6-25.4%) | 201-240 (58.8-70.2%) | 281-331 (82.2-96.8%) | 230-270 (67.3-78.9%) | 81-95 (23.7-27.8%) | 148-174 (43.3-50.9%) | 162-191 (47.4-55.8%) | 262-309 (76.6-90.4%) |
| Sneasel-Hisui | 209-246 (82.9-97.6%) | 144-169 (57.1-67.1%) | 237-280 (94-111.1%) | 321-381 (127.4-151.2%) | 89-104 (35.3-41.3%) | 145-170 (57.5-67.5%) | 205-241 (81.3-95.6%) | 187-221 (74.2-87.7%) | 102-120 (40.5-47.6%) | 211-249 (83.7-98.8%) |
| Typhlosion-Hisui | 638-751 (221.5-260.8%) | 130-153 (45.1-53.1%) | 364-429 (126.4-149%) | 0-0 (0-0%) | 80-94 (27.8-32.6%) | 65-77 (22.6-26.7%) | 185-218 (64.2-75.7%) | 340-400 (118.1-138.9%) | 373-438 (129.5-152.1%) | 0-0 (0-0%) |
| Virizion | 170-200 (52.5-61.7%) | 46-54 (14.2-16.7%) | 96-114 (29.6-35.2%) | 264-312 (81.5-96.3%) | 227-267 (70.1-82.4%) | 185-218 (57.1-67.3%) | 65-76 (20.1-23.5%) | 119-140 (36.7-43.2%) | 65-76 (20.1-23.5%) | 343-404 (105.9-124.7%) |
| Avalugg-Hisui | 306-360 (92.2-108.4%) | 246-290 (74.1-87.3%) | 176-208 (53-62.7%) | 57-69 (17.2-20.8%) | 152-179 (45.8-53.9%) | 124-146 (37.3-44%) | 351-413 (105.7-124.4%) | 321-378 (96.7-113.9%) | 352-414 (106-124.7%) | 618-727 (186.1-219%) |
| Brute Bonnet | 262-308 (72-84.6%) | 57-67 (15.7-18.4%) | 74-88 (20.3-24.2%) | 204-240 (56-65.9%) | 284-334 (78-91.8%) | 232-273 (63.7-75%) | 81-96 (22.3-26.4%) | 74-88 (20.3-24.2%) | 81-96 (22.3-26.4%) | 530-623 (145.6-171.2%) |
| Combusken | 392-461 (149.6-176%) | 171-201 (65.3-76.7%) | 447-526 (170.6-200.8%) | 303-357 (115.6-136.3%) | 211-249 (80.5-95%) | 86-101 (32.8-38.5%) | 243-286 (92.7-109.2%) | 223-262 (85.1-100%) | 122-144 (46.6-55%) | 396-466 (151.1-177.9%) |
| Delphox | 681-801 (233.2-274.3%) | 114-134 (39-45.9%) | 388-457 (132.9-156.5%) | 264-312 (90.4-106.8%) | 140-165 (47.9-56.5%) | 57-67 (19.5-22.9%) | 162-190 (55.5-65.1%) | 297-349 (101.7-119.5%) | 326-383 (111.6-131.2%) | 171-202 (58.6-69.2%) |
| Druddigon | 284-334 (95.9-112.8%) | 62-73 (20.9-24.7%) | 80-94 (27-31.8%) | 222-261 (75-88.2%) | 153-180 (51.7-60.8%) | 250-295 (84.5-99.7%) | 88-104 (29.7-35.1%) | 162-191 (54.7-64.5%) | 178-209 (60.1-70.6%) | 286-337 (96.6-113.9%) |
| Eldegoss | 284-334 (108.4-127.5%) | 49-57 (18.7-21.8%) | 80-94 (30.5-35.9%) | 222-261 (84.7-99.6%) | 241-284 (92-108.4%) | 197-232 (75.2-88.5%) | 69-81 (26.3-30.9%) | 127-149 (48.5-56.9%) | 139-163 (53.1-62.2%) | 286-337 (109.2-128.6%) |
| Electrode-Hisui | 348-409 (132.8-156.1%) | 34-40 (13-15.3%) | 98-115 (37.4-43.9%) | 267-318 (101.9-121.4%) | 338-398 (129-151.9%) | 276-324 (105.3-123.7%) | 48-57 (18.3-21.8%) | 178-209 (67.9-79.8%) | 195-230 (74.4-87.8%) | 351-413 (134-157.6%) |
| Floette-Eternal | 360-423 (124.1-145.9%) | 92-109 (31.7-37.6%) | 205-241 (70.7-83.1%) | 279-327 (96.2-112.8%) | 228-269 (78.6-92.8%) | 93-109 (32.1-37.6%) | 131-154 (45.2-53.1%) | 120-141 (41.4-48.6%) | 66-78 (22.8-26.9%) | 181-214 (62.4-73.8%) |
| Galvantula | 785-923 (278.4-327.3%) | 85-100 (30.1-35.5%) | 223-262 (79.1-92.9%) | 303-357 (107.4-126.6%) | 211-249 (74.8-88.3%) | 172-203 (61-72%) | 121-143 (42.9-50.7%) | 223-262 (79.1-92.9%) | 244-288 (86.5-102.1%) | 198-233 (70.2-82.6%) |
| Glastrier | 416-489 (121.6-143%) | 105-124 (30.7-36.3%) | 118-140 (34.5-40.9%) | 162-195 (47.4-57%) | 130-153 (38-44.7%) | 53-62 (15.5-18.1%) | 149-176 (43.6-51.5%) | 136-161 (39.8-47.1%) | 150-176 (43.9-51.5%) | 420-494 (122.8-144.4%) |
| Gurdurr | 148-175 (47.4-56.1%) | 196-230 (62.8-73.7%) | 170-200 (54.5-64.1%) | 234-273 (75-87.5%) | 242-285 (77.6-91.3%) | 197-232 (63.1-74.4%) | 279-328 (89.4-105.1%) | 256-301 (82.1-96.5%) | 140-165 (44.9-52.9%) | 300-353 (96.2-113.1%) |
| Machoke | 174-204 (57.6-67.5%) | 171-201 (56.6-66.6%) | 197-232 (65.2-76.8%) | 267-318 (88.4-105.3%) | 211-249 (69.9-82.5%) | 172-203 (57-67.2%) | 243-286 (80.5-94.7%) | 223-262 (73.8-86.8%) | 122-144 (40.4-47.7%) | 351-413 (116.2-136.8%) |
| Meditite | 209-246 (103.5-121.8%) | 183-215 (90.6-106.4%) | 237-280 (117.3-138.6%) | 321-381 (158.9-188.6%) | 226-266 (111.9-131.7%) | 184-216 (91.1-106.9%) | 260-306 (128.7-151.5%) | 477-561 (236.1-277.7%) | 261-308 (129.2-152.5%) | 211-249 (104.5-123.3%) |
| Mienfoo | 224-264 (96.6-113.8%) | 196-230 (84.5-99.1%) | 256-301 (110.3-129.7%) | 345-408 (148.7-175.9%) | 242-285 (104.3-122.8%) | 197-232 (84.9-100%) | 279-328 (120.3-141.4%) | 256-301 (110.3-129.7%) | 140-165 (60.3-71.1%) | 454-534 (195.7-230.2%) |
| Milotic | 316-371 (95.2-111.7%) | 189-222 (56.9-66.9%) | 89-105 (26.8-31.6%) | 243-288 (73.2-86.7%) | 116-137 (34.9-41.3%) | 47-56 (14.2-16.9%) | 268-315 (80.7-94.9%) | 123-144 (37-43.4%) | 135-158 (40.7-47.6%) | 319-375 (96.1-113%) |
| Mismagius | 392-461 (149.6-176%) | 109-129 (41.6-49.2%) | 223-262 (85.1-100%) | 0-0 (0-0%) | 67-79 (25.6-30.2%) | 110-129 (42-49.2%) | 155-183 (59.2-69.8%) | 286-336 (109.2-128.2%) | 313-367 (119.5-140.1%) | 0-0 (0-0%) |
| Mudsdale | 130-153 (38-44.7%) | 0-0 (0-0%) | 297-349 (86.8-102%) | 201-240 (58.8-70.2%) | 80-94 (23.4-27.5%) | 262-309 (76.6-90.4%) | 0-0 (0-0%) | 170-200 (49.7-58.5%) | 185-218 (54.1-63.7%) | 262-309 (76.6-90.4%) |
| Ninetales-Alola | 659-775 (228.8-269.1%) | 114-134 (39.6-46.5%) | 187-221 (64.9-76.7%) | 255-300 (88.5-104.2%) | 281-331 (97.6-114.9%) | 57-67 (19.8-23.3%) | 162-190 (56.3-66%) | 148-174 (51.4-60.4%) | 80-94 (27.8-32.6%) | 332-391 (115.3-135.8%) |
| Primeape | 196-230 (72.1-84.6%) | 152-179 (55.9-65.8%) | 223-262 (82-96.3%) | 303-357 (111.4-131.3%) | 188-221 (69.1-81.3%) | 153-180 (56.3-66.2%) | 216-254 (79.4-93.4%) | 197-232 (72.4-85.3%) | 107-127 (39.3-46.7%) | 396-466 (145.6-171.3%) |
| Servine | 329-387 (125.6-147.7%) | 72-84 (27.5-32.1%) | 93-110 (35.5-42%) | 255-300 (97.3-114.5%) | 356-419 (135.9-159.9%) | 290-341 (110.7-130.2%) | 102-120 (38.9-45.8%) | 187-221 (71.4-84.4%) | 205-241 (78.2-92%) | 332-391 (126.7-149.2%) |
| Tangela | 231-272 (84.9-100%) | 114-135 (41.9-49.6%) | 66-78 (24.3-28.7%) | 183-213 (67.3-78.3%) | 568-668 (208.8-245.6%) | 462-544 (169.9-200%) | 163-192 (59.9-70.6%) | 299-352 (109.9-129.4%) | 327-386 (120.2-141.9%) | 233-274 (85.7-100.7%) |
| Wishiwashi-School | 208-244 (89.7-105.2%) | 177-208 (76.3-89.7%) | 58-70 (25-30.2%) | 162-195 (69.8-84.1%) | 109-128 (47-55.2%) | 44-52 (19-22.4%) | 251-295 (108.2-127.2%) | 115-135 (49.6-58.2%) | 126-148 (54.3-63.8%) | 210-247 (90.5-106.5%) |
| Wo-Chien | 195-230 (62.5-73.7%) | 44-52 (14.1-16.7%) | 55-65 (17.6-20.8%) | 156-183 (50-58.7%) | 218-257 (69.9-82.4%) | 178-210 (57.1-67.3%) | 62-73 (19.9-23.4%) | 57-67 (18.3-21.5%) | 62-74 (19.9-23.7%) | 395-464 (126.6-148.7%) |
| Zoroark | 392-461 (149.6-176%) | 171-201 (65.3-76.7%) | 223-262 (85.1-100%) | 303-357 (115.6-136.3%) | 211-249 (80.5-95%) | 172-203 (65.6-77.5%) | 243-286 (92.7-109.2%) | 111-131 (42.4-50%) | 122-144 (46.6-55%) | 792-932 (302.3-355.7%) |

**Remember trapping cuts both ways here.** A revenge killer that cannot switch in
safely is not an answer, and a trapped revenge killer cannot leave — but every
pivot move still escapes (section B).
---

## K. PU → ZU role-comparison matrices

Section H is the role comparison, one candidate at a time. ZU competitors are
selected by shared role keys, shared typing and BST proximity — a **mechanical
shortlist, not a judgement**. Their full profiles are in section D.

For each candidate the questions to answer are:

1. What does the PU candidate do that its ZU alternatives cannot?
2. What do the ZU alternatives do better?
3. Is the candidate actually outclassed, or merely weaker in the abstract?
4. **Would it be oppressive in ZU?**
5. Does it retain a unique niche that justifies PU?
---

## L. PU speed-tier table

Every PU entry at base Speed 80+. **Priority is not Speed** — that is section M.

| Pokémon | Base | Max neutral | Max +Spe | +1 | +2 | Scarf (from max +Spe) |
| --- | --- | --- | --- | --- | --- | --- |
| Ninjask | 160 | 419 | 460 | 690 | 920 | 690 |
| Electrode-Hisui | 150 | 399 | 438 | 657 | 876 | 657 |
| Dugtrio | 120 | 339 | 372 | 558 | 744 | 558 |
| Salazzle | 117 | 333 | 366 | 549 | 732 | 549 |
| Ambipom | 115 | 329 | 361 | 541 | 722 | 541 |
| Floatzel | 115 | 329 | 361 | 541 | 722 | 541 |
| Sneasel-Hisui | 115 | 329 | 361 | 541 | 722 | 541 |
| Archeops | 110 | 319 | 350 | 525 | 700 | 525 |
| Ninetales-Alola | 109 | 317 | 348 | 522 | 696 | 522 |
| Galvantula | 108 | 315 | 346 | 519 | 692 | 519 |
| Virizion | 108 | 315 | 346 | 519 | 692 | 519 |
| Kadabra | 105 | 309 | 339 | 508 | 678 | 508 |
| Mismagius | 105 | 309 | 339 | 508 | 678 | 508 |
| Scyther | 105 | 309 | 339 | 508 | 678 | 508 |
| Zoroark | 105 | 309 | 339 | 508 | 678 | 508 |
| Delphox | 104 | 307 | 337 | 505 | 674 | 505 |
| Shaymin | 100 | 299 | 328 | 492 | 656 | 492 |
| Tauros-Paldea-Blaze | 100 | 299 | 328 | 492 | 656 | 492 |
| Togedemaru | 96 | 291 | 320 | 480 | 640 | 480 |
| Primeape | 95 | 289 | 317 | 475 | 634 | 475 |
| Typhlosion-Hisui | 95 | 289 | 317 | 475 | 634 | 475 |
| Raboot | 94 | 287 | 315 | 472 | 630 | 472 |
| Oricorio | 93 | 285 | 313 | 469 | 626 | 469 |
| Oricorio-Pa'u | 93 | 285 | 313 | 469 | 626 | 469 |
| Bruxish | 92 | 283 | 311 | 466 | 622 | 466 |
| Floette-Eternal | 92 | 283 | 311 | 466 | 622 | 466 |
| Golbat | 90 | 279 | 306 | 459 | 612 | 459 |
| Venomoth | 90 | 279 | 306 | 459 | 612 | 459 |
| Hitmonlee | 87 | 273 | 300 | 450 | 600 | 450 |
| Rotom-Heat | 86 | 271 | 298 | 447 | 596 | 447 |
| Rotom-Mow | 86 | 271 | 298 | 447 | 596 | 447 |
| Cramorant | 85 | 269 | 295 | 442 | 590 | 442 |
| Kingdra | 85 | 269 | 295 | 442 | 590 | 442 |
| Qwilfish | 85 | 269 | 295 | 442 | 590 | 442 |
| Qwilfish-Hisui | 85 | 269 | 295 | 442 | 590 | 442 |
| Servine | 83 | 265 | 291 | 436 | 582 | 436 |
| Bombirdier | 82 | 263 | 289 | 433 | 578 | 433 |
| Tatsugiri | 82 | 263 | 289 | 433 | 578 | 433 |
| Milotic | 81 | 261 | 287 | 430 | 574 | 430 |
| Medicham | 80 | 259 | 284 | 426 | 568 | 426 |
| Passimian | 80 | 259 | 284 | 426 | 568 | 426 |
| Thwackey | 80 | 259 | 284 | 426 | 568 | 426 |

**Conditional speed abilities in PU** — none of these is active by default, and
the table above does **not** assume any of them:

- **Swift Swim — needs rain**: Floatzel, Gorebyss, Kingdra, Qwilfish, Qwilfish-Hisui
- **Chlorophyll — needs sun**: Bellossom, Tangela, Vileplume
- **Sand Rush — needs sandstorm**: _nobody in PU_
- **Slush Rush — needs snow**: Arctovish, Sandslash-Alola
- **Unburden — needs its item consumed**: Hitmonlee
- **Speed Boost — +1 at the end of each turn**: Combusken, Ninjask
- **Quick Feet — needs a status; the Orbs fire ON ENTRY, so this one is live from turn one**: Ursaring
- **Light Metal — +1 Speed on EVERY entry, resets on switch-out**: _nobody in PU_
- **Quark Drive — needs Electric Terrain or Booster Energy**: _nobody in PU_
- **Protosynthesis — needs sun or Booster Energy**: Brute Bonnet
---

## M. PU priority table

Engine priority for every PU entry that has any, including Grassy Glide's
engine-side +1.

| Pokémon | Priority moves (engine BP / bracket) | Max offence | Abilities |
| --- | --- | --- | --- |
| Absol | Sucker Punch 80P Dark (+1); Feint 50P Normal (+2); Quick Attack 40P Normal (+1) | Atk 394 / SpA 273 | Pressure/Super Luck/Justified |
| Ambipom | Upper Hand 65P Fighting (+3); Fake Out 40P Normal (+3) | Atk 328 / SpA 240 | Technician/Pickup/Skill Link |
| Archeops | Quick Attack 40P Normal (+1) | Atk 416 / SpA 355 | Defeatist |
| Bellossom | Grassy Glide 70P Grass (+1) | Atk 284 / SpA 306 | Chlorophyll/Healer |
| Bombirdier | Sucker Punch 80P Dark (+1) | Atk 335 / SpA 240 | Big Pecks/Keen Eye/Rocky Payload |
| Brute Bonnet | Sucker Punch 80P Dark (+1) | Atk 388 / SpA 282 | Protosynthesis |
| Bruxish | Aqua Jet 40P Water (+1) | Atk 339 / SpA 262 | Dazzling/Strong Jaw/Wonder Skin |
| Combusken | Feint 50P Normal (+2); Quick Attack 40P Normal (+1); Vacuum Wave 40S Fighting (+1) | Atk 295 / SpA 295 | Blaze/Speed Boost |
| Corsola-Galar | Sucker Punch 80P Dark (+1) | Atk 229 / SpA 251 | Weak Armor/Cursed Body |
| Dipplin | Sucker Punch 80P Dark (+1); Grassy Glide 70P Grass (+1) | Atk 284 / SpA 317 | Supersweet Syrup/Gluttony/Sticky Hold |
| Druddigon | Sucker Punch 80P Dark (+1) | Atk 372 / SpA 240 | Rough Skin/Sheer Force/Mold Breaker |
| Dugtrio | Sucker Punch 80P Dark (+1) | Atk 328 / SpA 218 | Sand Veil/Arena Trap/Sand Force |
| Dusclops | Sucker Punch 80P Dark (+1); Shadow Sneak 40P Ghost (+1) | Atk 262 / SpA 240 | Pressure/Frisk |
| Eldegoss | Grassy Glide 70P Grass (+1) | Atk 218 / SpA 284 | Cotton Down/Regenerator/Effect Spore |
| Electrode-Hisui | Sucker Punch 80P Dark (+1); Grassy Glide 70P Grass (+1) | Atk 218 / SpA 284 | Soundproof/Static/Aftermath |
| Emboar | Sucker Punch 80P Dark (+1) | Atk 379 / SpA 328 | Blaze/Reckless |
| Floatzel | Aqua Jet 40P Water (+1); Quick Attack 40P Normal (+1) | Atk 339 / SpA 295 | Swift Swim/Water Veil |
| Fraxure | First Impression 90P Bug (+2) | Atk 366 / SpA 196 | Rivalry/Mold Breaker/Unnerve |
| Galvantula | Sucker Punch 80P Dark (+1) | Atk 278 / SpA 322 | Compound Eyes/Unnerve/Swarm |
| Golbat | Quick Attack 40P Normal (+1) | Atk 284 / SpA 251 | Inner Focus/Infiltrator |
| Gothorita | Fake Out 40P Normal (+3) | Atk 207 / SpA 273 | Frisk/Competitive/Shadow Tag |
| Grimmsnarl | Sucker Punch 80P Dark (+1); Fake Out 40P Normal (+3) | Atk 372 / SpA 317 | Prankster/Frisk/Pickpocket |
| Gurdurr | Mach Punch 40P Fighting (+1) | Atk 339 / SpA 196 | Guts/Sheer Force/Iron Fist |
| Hitmonlee | Sucker Punch 80P Dark (+1); Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Bullet Punch 40P Steel (+1) | Atk 372 / SpA 185 | Limber/Reckless/Unburden |
| Lanturn | Sucker Punch 80P Dark (+1) | Atk 236 / SpA 276 | Volt Absorb/Illuminate/Water Absorb |
| Machoke | Bullet Punch 40P Steel (+1); Vacuum Wave 40S Fighting (+1) | Atk 328 / SpA 218 | Guts/No Guard/Steadfast |
| Medicham | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Bullet Punch 40P Steel (+1); Fake Out 40P Normal (+3) | Atk 480 / SpA 240 | Pure Power/Telepathy |
| Meditite | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Bullet Punch 40P Steel (+1); Fake Out 40P Normal (+3) | Atk 392 / SpA 196 | Pure Power/Telepathy |
| Mienfoo | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Fake Out 40P Normal (+3) | Atk 295 / SpA 229 | Inner Focus/Regenerator/Reckless |
| Mismagius | Sucker Punch 80P Dark (+1); Shadow Sneak 40P Ghost (+1) | Atk 240 / SpA 339 | Levitate |
| Ninetales-Alola | Ice Shard 40P Ice (+1); Quick Attack 40P Normal (+1) | Atk 256 / SpA 287 | Snow Cloak/Snow Warning |
| Passimian | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Quick Attack 40P Normal (+1); Vacuum Wave 40S Fighting (+1) | Atk 372 / SpA 196 | Receiver/Defiant |
| Piloswine | Ice Shard 40P Ice (+1) | Atk 328 / SpA 240 | Oblivious/Snow Cloak/Thick Fat |
| Primeape | Vacuum Wave 40S Fighting (+1) | Atk 339 / SpA 240 | Vital Spirit/Anger Point/Defiant |
| Qwilfish | Aqua Jet 40P Water (+1) | Atk 317 / SpA 229 | Poison Point/Swift Swim/Intimidate |
| Qwilfish-Hisui | Aqua Jet 40P Water (+1) | Atk 317 / SpA 229 | Poison Point/Swift Swim/Intimidate |
| Raboot | Sucker Punch 80P Dark (+1); Quick Attack 40P Normal (+1) | Atk 298 / SpA 229 | Blaze/Libero |
| Raticate-Alola | Sucker Punch 80P Dark (+1); Quick Attack 40P Normal (+1) | Atk 265 / SpA 196 | Gluttony/Hustle/Thick Fat |
| Roselia | Grassy Glide 70P Grass (+1) | Atk 240 / SpA 328 | Natural Cure/Poison Point/Leaf Guard |
| Rotom-Heat | Sucker Punch 80P Dark (+1) | Atk 251 / SpA 339 | Levitate |
| Rotom-Mow | Sucker Punch 80P Dark (+1) | Atk 251 / SpA 339 | Levitate |
| Salazzle | Fake Out 40P Normal (+3) | Atk 249 / SpA 353 | Corrosion/Oblivious |
| Sandslash-Alola | Ice Shard 40P Ice (+1) | Atk 328 / SpA 163 | Snow Cloak/Slush Rush |
| Scyther | Feint 50P Normal (+2); Quick Attack 40P Normal (+1); Vacuum Wave 40S Fighting (+1) | Atk 350 / SpA 229 | Swarm/Technician/Steadfast |
| Servine | Grassy Glide 70P Grass (+1) | Atk 240 / SpA 240 | Overgrow/Contrary |
| Shaymin | Grassy Glide 70P Grass (+1); Quick Attack 40P Normal (+1) | Atk 328 / SpA 328 | Natural Cure |
| Sneasel-Hisui | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Fake Out 40P Normal (+3); Ice Shard 40P Ice (+1) | Atk 317 / SpA 185 | Inner Focus/Keen Eye/Pickpocket |
| Tangela | Grassy Glide 70P Grass (+1) | Atk 229 / SpA 328 | Chlorophyll/Leaf Guard/Regenerator |
| Thwackey | Grassy Glide 70P Grass (+1); Fake Out 40P Normal (+3) | Atk 295 / SpA 229 | Overgrow/Grassy Surge |
| Togedemaru | Fake Out 40P Normal (+3) | Atk 324 / SpA 196 | Iron Barbs/Lightning Rod/Sturdy |
| Typhlosion-Hisui | Quick Attack 40P Normal (+1) | Atk 293 / SpA 370 | Blaze/Frisk |
| Vileplume | Grassy Glide 70P Grass (+1) | Atk 284 / SpA 350 | Chlorophyll/Effect Spore |
| Virizion | Grassy Glide 70P Grass (+1); Upper Hand 65P Fighting (+3); Quick Attack 40P Normal (+1); Vacuum Wave 40S Fighting (+1) | Atk 306 / SpA 306 | Justified |
| Zoroark | Sucker Punch 80P Dark (+1) | Atk 339 / SpA 372 | Illusion |
---

## N. Weather / terrain / Trick Room / Tailwind environment

**Weather by move:** Rain — Absol, Ambipom, Arctovish, Aromatisse, Audino, Audino-Mega, Aurorus, Avalugg-Hisui, Bombirdier, Bruxish, Claydol, Clefairy, Corsola-Galar, Cramorant, Delphox, Druddigon, Duosion, Dusclops, Electrode-Hisui, Floatzel, Floette-Eternal, Florges, Fraxure, Galvantula, Garbodor, Golbat, Golurk, Gorebyss, Gothorita, Gurdurr, Hitmonlee, Hoopa, Jellicent, Kadabra, Kingdra, Lairon, Lanturn, Machoke, Medicham, Meditite, Mienfoo, Milotic, Mismagius, Naclstack, Ninetales-Alola, Oricorio, Oricorio-Pa'u, Palossand, Passimian, Piloswine, Porygon, Primeape, Qwilfish, Qwilfish-Hisui, Rampardos, Raticate-Alola, Roselia, Rotom-Heat, Rotom-Mow, Scyther, Sliggoo-Hisui, Slowbro-Galar, Slowpoke, Slowpoke-Galar, Sneasel-Hisui, Snorlax, Tatsugiri, Tauros-Paldea-Blaze, Togetic, Type: Null, Ursaring, Vullaby, Wishiwashi, Wishiwashi-School, Wo-Chien, Zoroark, Zweilous; Sun — Absol, Ambipom, Aromatisse, Audino, Audino-Mega, Bellossom, Bombirdier, Brute Bonnet, Centiskorch, Claydol, Clefairy, Coalossal, Combusken, Corsola-Galar, Crocalor, Delphox, Dipplin, Druddigon, Dugtrio, Duosion, Dusclops, Eldegoss, Emboar, Floette-Eternal, Florges, Fraxure, Garbodor, Golbat, Golurk, Gurdurr, Hitmonlee, Hoopa, Kadabra, Lairon, Lampent, Machoke, Medicham, Meditite, Mienfoo, Mismagius, Mudsdale, Naclstack, Ninetales-Alola, Ninjask, Oricorio, Oricorio-Pa'u, Palossand, Passimian, Porygon, Primeape, Raboot, Rampardos, Raticate-Alola, Roselia, Rotom-Heat, Rotom-Mow, Salazzle, Sandslash-Alola, Scyther, Servine, Shaymin, Sliggoo-Hisui, Slowbro-Galar, Slowpoke, Slowpoke-Galar, Sneasel-Hisui, Snorlax, Tangela, Tauros-Paldea-Blaze, Thwackey, Togetic, Turtonator, Type: Null, Typhlosion-Hisui, Ursaring, Venomoth, Vileplume, Virizion, Vullaby, Wo-Chien, Zoroark, Zweilous; Sand — Absol, Archeops, Aurorus, Avalugg-Hisui, Bombirdier, Claydol, Coalossal, Corsola-Galar, Dugtrio, Gigalith, Golurk, Hoopa, Lairon, Mudsdale, Naclstack, Ninjask, Oricorio, Oricorio-Pa'u, Palossand, Piloswine, Rampardos, Sandslash-Alola, Sliggoo-Hisui, Slowbro-Galar, Snorlax, Tauros-Paldea-Blaze, Type: Null; Snow — Avalugg-Hisui, Frosmoth, Glastrier, Kingdra, Mismagius, Ninetales-Alola, Piloswine, Sandslash-Alola, Slowbro-Galar, Slowpoke, Slowpoke-Galar, Sneasel-Hisui.

**Weather by ability (automatic):** Aurorus, Gigalith, Ninetales-Alola.

**Weather abusers by ability:** Arctovish, Avalugg-Hisui, Bellossom, Dugtrio, Floatzel, Gigalith, Gorebyss, Kingdra, Qwilfish, Qwilfish-Hisui, Sandslash-Alola, Tangela, Vileplume.

**Terrain by move:** Electric — Electrode-Hisui, Lanturn, Rotom-Heat, Rotom-Mow, Togedemaru; Grassy — Bellossom, Brute Bonnet, Dipplin, Eldegoss, Electrode-Hisui, Floette-Eternal, Florges, Servine, Shaymin, Tangela, Thwackey, Vileplume, Wo-Chien; Misty — Alcremie, Aromatisse, Audino, Audino-Mega, Clefairy, Floette-Eternal, Florges, Grimmsnarl, Ninetales-Alola; Psychic — Bruxish, Claydol, Delphox, Duosion, Gothorita, Hoopa, Kadabra, Medicham, Meditite, Slowbro-Galar, Slowpoke, Slowpoke-Galar.

**Terrain by ability:** Thwackey.

**Trick Room setters:** Aromatisse, Audino, Audino-Mega, Bruxish, Claydol, Delphox, Duosion, Dusclops, Gothorita, Hoopa, Jellicent, Kadabra, Lampent, Medicham, Meditite, Mismagius, Porygon, Slowbro-Galar, Slowpoke, Slowpoke-Galar. The **Warp Prism** makes Trick Room *the holder sets* last **8** turns instead of 5.

**Slow breakers that want it** (base Speed ≤ 50 with real offence): Avalugg-Hisui, Druddigon, Duosion, Gigalith, Glastrier, Gurdurr, Mudsdale, Snorlax, Vileplume, Wishiwashi, Wishiwashi-School.

**Tailwind setters:** Archeops, Bombirdier, Cramorant, Frosmoth, Golbat, Oricorio, Oricorio-Pa'u, Scyther, Shaymin, Togetic, Venomoth, Vullaby. The **Wind Sock** makes Tailwind *the holder sets* last **7** turns instead of 4.

Neither item can be held by a Mega, but a teammate can hold it.

**Mega Sol is PERSONAL weather**, not field-wide sun: it overrides
`battle.weatherFor` for its holder only. Nothing else on the field sees it.
No PU entry has it.
---

## O. PU hazard environment

**Stealth Rock:** Archeops, Aurorus, Avalugg-Hisui, Bombirdier, Claydol, Clefairy, Coalossal, Corsola-Galar, Druddigon, Dugtrio, Gigalith, Golurk, Lairon, Mudsdale, Naclstack, Palossand, Piloswine, Primeape, Rampardos, Sandslash-Alola

**Spikes:** Coalossal, Garbodor, Qwilfish, Qwilfish-Hisui, Roselia, Sandslash-Alola

**Toxic Spikes:** Garbodor, Qwilfish, Qwilfish-Hisui, Roselia, Salazzle, Sneasel-Hisui, Venomoth

**Sticky Web:** Galvantula

**Rapid Spin:** Avalugg-Hisui, Claydol, Coalossal, Eldegoss, Hitmonlee, Sandslash-Alola, Tatsugiri, Turtonator

**Defog:** Archeops, Combusken, Cramorant, Florges, Frosmoth, Golbat, Gurdurr, Ninjask, Oricorio, Oricorio-Pa'u, Rotom-Heat, Rotom-Mow, Scyther, Servine, Togetic, Venomoth, Vullaby

**Mortal Spin / Tidy Up / Court Change:** none

**Magic Bounce:** none

**Taunt (hazard deterrence):** Absol, Ambipom, Archeops, Bombirdier, Brute Bonnet, Bruxish, Druddigon, Dusclops, Electrode-Hisui, Emboar, Floatzel, Fraxure, Glastrier, Golbat, Gothorita, Grimmsnarl, Gurdurr, Hitmonlee, Hoopa, Jellicent, Kadabra, Lampent, Medicham, Meditite, Mienfoo, Mismagius, Oricorio, Oricorio-Pa'u, Passimian, Primeape, Qwilfish, Qwilfish-Hisui, Raboot, Raticate-Alola, Salazzle, Servine, Sneasel-Hisui, Tatsugiri, Thwackey, Turtonator, Ursaring, Virizion, Vullaby, Wo-Chien, Zoroark, Zweilous

**Ghost types (block Rapid Spin):** Corsola-Galar, Dusclops, Golurk, Hoopa, Jellicent, Lampent, Mismagius, Palossand, Typhlosion-Hisui

**Heavy-Duty Boots** are available to every **species** entry and to **no forme**
entry — the stone occupies the slot. That asymmetry is decisive for any
Rock-weak or pivot-reliant Mega on the candidate list.
---

## P. Recovery / longevity

These four categories are **not** interchangeable and are deliberately kept apart.

**TRUE IMMEDIATE RECOVERY** — Recover, Roost, Slack Off, Shore Up, Soft-Boiled, Milk Drink, Morning Sun, Synthesis, Moonlight:

Absol (Rest); Alcremie (Recover, Rest); Ambipom (Rest); Archeops (Rest, Roost); Arctovish (Rest); Aromatisse (Rest); Audino (Rest); Audino-Mega (Rest); Aurorus (Rest); Avalugg-Hisui (Recover, Rest); Bellossom (Rest); Bombirdier (Rest, Roost); Brute Bonnet (Rest); Bruxish (Rest); Centiskorch (Rest); Claydol (Rest); Clefairy (Rest, Soft-Boiled); Coalossal (Rest); Combusken (Rest); Corsola-Galar (Recover, Rest); Cramorant (Rest, Roost); Crocalor (Rest, Slack Off); Delphox (Rest); Dipplin (Recover, Rest); Druddigon (Rest); Dugtrio (Rest); Duosion (Recover, Rest); Dusclops (Rest); Eldegoss (Rest); Electrode-Hisui (Rest); Emboar (Rest); Floatzel (Rest); Floette-Eternal (Rest); Florges (Rest); Fraxure (Rest); Frosmoth (Rest); Galvantula (Rest); Garbodor (Rest); Gigalith (Rest); Glastrier (Rest); Golbat (Rest, Roost); Golurk (Rest); Gorebyss (Rest); Gothorita (Rest); Grimmsnarl (Rest); Gurdurr (Rest); Hitmonlee (Rest); Hoopa (Rest); Jellicent (Recover, Rest); Kadabra (Recover, Rest); Kingdra (Rest); Lairon (Rest); Lampent (Rest); Lanturn (Rest); Machoke (Rest); Medicham (Recover, Rest); Meditite (Recover, Rest); Mienfoo (Rest); Milotic (Recover, Rest); Mismagius (Rest); Mudsdale (Rest); Naclstack (Recover, Rest); Ninetales-Alola (Rest); Ninjask (Rest, Roost); Oricorio (Rest, Roost); Oricorio-Pa'u (Rest, Roost); Palossand (Rest); Passimian (Rest); Piloswine (Rest); Porygon (Recover, Rest); Primeape (Rest); Qwilfish (Rest); Qwilfish-Hisui (Rest); Raboot (Rest); Rampardos (Rest); Raticate-Alola (Rest); Roselia (Rest); Rotom-Heat (Rest); Rotom-Mow (Rest); Salazzle (Rest); Sandslash-Alola (Rest); Scyther (Rest, Roost); Servine (Rest); Shaymin (Rest); Sliggoo-Hisui (Rest); Slowbro-Galar (Rest, Slack Off); Slowpoke (Rest, Slack Off); Slowpoke-Galar (Rest, Slack Off); Sneasel-Hisui (Rest); Snorlax (Rest); Tangela (Rest); Tatsugiri (Rest); Tauros-Paldea-Blaze (Rest); Thwackey (Rest); Togedemaru (Rest); Togetic (Rest, Roost, Soft-Boiled); Turtonator (Rest); Type: Null (Rest); Typhlosion-Hisui (Rest); Ursaring (Rest); Venomoth (Rest, Roost); Vileplume (Rest); Virizion (Rest); Vullaby (Rest, Roost); Wishiwashi (Rest); Wishiwashi-School (Rest); Wo-Chien (Rest); Zoroark (Rest); Zweilous (Rest)

**REST** — two helpless turns unless Early Bird, Sleep Talk or Snore is in the set. **Not** equivalent to the above:

Absol, Alcremie, Ambipom, Archeops, Arctovish, Aromatisse, Audino, Audino-Mega, Aurorus, Avalugg-Hisui, Bellossom, Bombirdier, Brute Bonnet, Bruxish, Centiskorch, Claydol, Clefairy, Coalossal, Combusken, Corsola-Galar, Cramorant, Crocalor, Delphox, Dipplin, Druddigon, Dugtrio, Duosion, Dusclops, Eldegoss, Electrode-Hisui, Emboar, Floatzel, Floette-Eternal, Florges, Fraxure, Frosmoth, Galvantula, Garbodor, Gigalith, Glastrier, Golbat, Golurk, Gorebyss, Gothorita, Grimmsnarl, Gurdurr, Hitmonlee, Hoopa, Jellicent, Kadabra, Kingdra, Lairon, Lampent, Lanturn, Machoke, Medicham, Meditite, Mienfoo, Milotic, Mismagius, Mudsdale, Naclstack, Ninetales-Alola, Ninjask, Oricorio, Oricorio-Pa'u, Palossand, Passimian, Piloswine, Porygon, Primeape, Qwilfish, Qwilfish-Hisui, Raboot, Rampardos, Raticate-Alola, Roselia, Rotom-Heat, Rotom-Mow, Salazzle, Sandslash-Alola, Scyther, Servine, Shaymin, Sliggoo-Hisui, Slowbro-Galar, Slowpoke, Slowpoke-Galar, Sneasel-Hisui, Snorlax, Tangela, Tatsugiri, Tauros-Paldea-Blaze, Thwackey, Togedemaru, Togetic, Turtonator, Type: Null, Typhlosion-Hisui, Ursaring, Venomoth, Vileplume, Virizion, Vullaby, Wishiwashi, Wishiwashi-School, Wo-Chien, Zoroark, Zweilous

**DRAINING** — proportional to damage dealt, so it fails against a resist and against a wall:

Absol (Dream Eater); Alcremie (Drain Punch, Draining Kiss, Giga Drain); Ambipom (Dream Eater); Aromatisse (Drain Punch, Draining Kiss, Dream Eater); Audino (Drain Punch, Draining Kiss, Dream Eater); Audino-Mega (Drain Punch, Draining Kiss, Dream Eater); Aurorus (Dream Eater); Bellossom (Absorb, Drain Punch, Giga Drain, Mega Drain); Brute Bonnet (Absorb, Giga Drain, Mega Drain); Bruxish (Dream Eater); Centiskorch (Leech Life); Claydol (Dream Eater); Clefairy (Drain Punch, Draining Kiss, Dream Eater); Corsola-Galar (Giga Drain); Delphox (Dream Eater); Dipplin (Giga Drain); Duosion (Dream Eater); Dusclops (Dream Eater, Leech Life); Eldegoss (Giga Drain); Electrode-Hisui (Giga Drain); Emboar (Drain Punch); Floette-Eternal (Draining Kiss, Giga Drain); Florges (Draining Kiss, Giga Drain); Frosmoth (Giga Drain, Leech Life); Galvantula (Absorb, Giga Drain, Leech Life); Garbodor (Drain Punch, Giga Drain); Golbat (Absorb, Giga Drain, Leech Life, Mega Drain); Golurk (Drain Punch); Gorebyss (Draining Kiss); Gothorita (Dream Eater); Grimmsnarl (Drain Punch, Draining Kiss, Leech Life); Gurdurr (Drain Punch); Hoopa (Drain Punch, Dream Eater); Jellicent (Absorb, Dream Eater, Giga Drain); Kadabra (Drain Punch, Dream Eater); Lampent (Dream Eater); Medicham (Drain Punch, Dream Eater); Meditite (Drain Punch, Dream Eater); Mienfoo (Drain Punch); Milotic (Draining Kiss); Mismagius (Draining Kiss, Dream Eater); Ninetales-Alola (Draining Kiss, Dream Eater); Ninjask (Absorb, Giga Drain, Leech Life); Palossand (Absorb, Giga Drain, Mega Drain); Passimian (Drain Punch); Porygon (Dream Eater); Primeape (Drain Punch); Roselia (Absorb, Giga Drain, Mega Drain); Rotom-Heat (Dream Eater); Rotom-Mow (Dream Eater); Salazzle (Leech Life); Sandslash-Alola (Leech Life); Servine (Giga Drain, Mega Drain); Shaymin (Giga Drain); Sliggoo-Hisui (Absorb); Slowbro-Galar (Drain Punch, Dream Eater); Slowpoke (Dream Eater); Slowpoke-Galar (Dream Eater); Sneasel-Hisui (Dream Eater); Tangela (Absorb, Giga Drain, Mega Drain); Thwackey (Drain Punch, Giga Drain); Togetic (Drain Punch, Draining Kiss, Dream Eater); Venomoth (Dream Eater, Giga Drain, Leech Life, Mega Drain); Vileplume (Absorb, Drain Punch, Giga Drain, Mega Drain); Virizion (Giga Drain); Wo-Chien (Absorb, Giga Drain, Mega Drain)

**PASSIVE** — Regenerator, Poison Heal, absorbs, weather healing (Leftovers is available to every non-forme entry):

Arctovish (Water Absorb/Ice Body); Audino (Regenerator); Avalugg-Hisui (Ice Body); Duosion (Regenerator); Eldegoss (Regenerator); Jellicent (Water Absorb); Lanturn (Volt Absorb/Water Absorb); Mienfoo (Regenerator); Slowbro-Galar (Regenerator); Slowpoke (Regenerator); Slowpoke-Galar (Regenerator); Tangela (Regenerator)
---

## Q. Item / ability edge cases, and what trapping changes

**Item freedom across the upward candidates:**

| Candidate | Item freedom | Consequence |
| --- | --- | --- |
| Dugtrio | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Ambipom | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Gothorita | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Medicham | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Salazzle | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Archeops | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Bruxish | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Floatzel | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Lampent | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Ninjask | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Raboot | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Rampardos | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Scyther | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Shaymin | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Sneasel-Hisui | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Typhlosion-Hisui | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Virizion | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Avalugg-Hisui | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Brute Bonnet | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Combusken | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Delphox | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Druddigon | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Eldegoss | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Electrode-Hisui | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Floette-Eternal | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Galvantula | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Glastrier | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Gurdurr | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Machoke | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Meditite | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Mienfoo | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Milotic | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Mismagius | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Mudsdale | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Ninetales-Alola | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Primeape | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Servine | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Tangela | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Wishiwashi-School | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Wo-Chien | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |
| Zoroark | Yes — any item | Band, Specs, Scarf, Life Orb, Boots, Leftovers, Assault Vest, Focus Sash, Ring Target and the Orbs are all available |

**PU Mega opportunity cost:**

PU has **1** forme entries and a team gets **one** Mega.

| Forme | Types | BST (spread) | Ability | Source | STAB | Setup | Recovery | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Audino-Mega | Normal/Fairy | 545 (103/60/126/80/126/50) | Healer | imported | Normal Last Resort 140P · Fairy Dazzling Gleam 80S | Amnesia, Calm Mind, Work Up | Rest | — |

A Mega is only tier-breaking if a team is pressured to spend its **one** Mega
slot on it rather than on anything else.

### Trapping in PU

**PU trapping-ability holders: Dugtrio, Gothorita, Lampent, Wobbuffet.**

For context, across the whole ladder:

| Tier | Trapping-ability holders |
| --- | --- |
| Ubers | Gengar-Mega |
| OU | — |
| UU | Chandelure |
| RU | Magnezone |
| NU | Gothitelle, Magneton |
| PU | Dugtrio, Gothorita, Lampent, Wobbuffet |
| ZU | Diglett, Geodude-Alola, Golem-Alola, Gothita, Graveler-Alola, Litwick, Magnemite, Meltan, Nosepass, Probopass, Trapinch, Wynaut |

**A trapped opponent changes the real value of** Choice attackers (the lock stops
mattering when the foe cannot leave either), setup sweepers (the trapped
Pokémon becomes setup fodder), hazard support, recovery stalling and
wallbreakers. **Do not judge a trapping user as though switching remains freely
available to its victim** — but do remember the two escapes measured in section
B: every pivot move still works, and phazing still drags the victim out.

**The full global trapping audit is deliberately NOT part of this packet.** It
spans the whole ladder and is a separate document,
`docs/TRAPPING_ABILITY_TIER_AUDIT_PROMPT.md`.
---

## R. Transformation / forme legality audit

Every PU entry was checked for a route to a **higher-tier forme in battle** — the
Zygarde / Darmanitan-Galar shape this project has had to gate before.

**Item-driven routes from a PU species to a higher-tier forme: 8.** Each was put through `Validation.validateTeam` in the PU format:

| PU species | Item | Forme it would make | That forme's tier | Validator |
| --- | --- | --- | --- | --- |
| Absol | Absolite Z | Absol-Mega-Z | **RU** | refused |
| Absol | Absolite | Absol-Mega | **RU** | refused |
| Delphox | Delphoxite | Delphox-Mega | **UU** | refused |
| Emboar | Emboarite | Emboar-Mega | **UU** | refused |
| Floette-Eternal | Floettite | Floette-Mega | **OU** | refused |
| Golurk | Golurkite | Golurk-Mega | **RU** | refused |
| Medicham | Medichamite | Medicham-Mega | **OU** | refused |
| Tatsugiri | Tatsugirinite | Tatsugiri-Curly-Mega | **RU** | refused |

**Ability-driven routes:**

_None._

**One known gap, reported rather than hidden.** §5's *"ban the route, not the
Pokémon"* rule has an **item** half (`illegalFormeItems`) and an **ability**
half (`illegalFormeAbilities`). There is **no move half**. Nothing in PU
exploits that today — no PU entry reaches a higher-tier forme through a move —
but a move-driven forme change (Relic Song → Meloetta-Pirouette is the obvious
candidate) would be **ungated** if it were ever implemented. Recorded as a
blocker, not fixed.
---

## S. New mechanical outliers surfaced by the broad scan

**Mechanical flags only — reasons to look, NOT recommendations.** 42 of
110 PU entries tripped two or more. No arbitrary cap was applied.

- **Dugtrio** (Ground, BST 425, Sand Veil/Arena Trap/Sand Force) — Speed **372**; setup + priority + reliable recovery; strong setup on a fast frame; **trapping ability: Arena Trap**; **trapping + setup**; **trapping + reliable recovery**.
- **Ambipom** (Normal, BST 482, Technician/Pickup/Skill Link) — Speed **361**; setup + priority + reliable recovery; strong setup on a fast frame; ability: Technician/Skill Link.
- **Gothorita** (Psychic, BST 390, Frisk/Competitive/Shadow Tag) — setup + priority + reliable recovery; **trapping ability: Shadow Tag**; **trapping + setup**; **trapping + reliable recovery**.
- **Medicham** (Fighting/Psychic, BST 410, Pure Power/Telepathy) — Attack **480**; Attack reaches 480 off base 60 — an ability is doing the work; setup + priority + reliable recovery; ability: Pure Power.
- **Salazzle** (Poison/Fire, BST 480, Corrosion/Oblivious) — Speed **366**; setup + priority + reliable recovery; strong setup on a fast frame; ability: Corrosion.
- **Archeops** (Rock/Flying, BST 567, Defeatist) — BST 567; setup + priority + reliable recovery; hazards + real offence.
- **Bruxish** (Water/Psychic, BST 475, Dazzling/Strong Jaw/Wonder Skin) — setup + priority + reliable recovery; strong setup on a fast frame; ability: Strong Jaw.
- **Floatzel** (Water, BST 495, Swift Swim/Water Veil) — Speed **361**; setup + priority + reliable recovery; strong setup on a fast frame.
- **Lampent** (Ghost/Fire, BST 370, Flash Fire/Flame Body/Infiltrator/Shadow Tag) — **trapping ability: Shadow Tag**; **trapping + setup**; **trapping + reliable recovery**.
- **Ninjask** (Bug/Flying, BST 456, Speed Boost/Infiltrator) — Speed **460**; strong setup on a fast frame; ability: Speed Boost.
- **Raboot** (Fire, BST 420, Blaze/Libero) — setup + priority + reliable recovery; strong setup on a fast frame; ability: Libero.
- **Rampardos** (Rock, BST 495, Mold Breaker/Sheer Force) — Attack **471**; ability: Sheer Force; hazards + real offence.
- **Scyther** (Bug/Flying, BST 500, Swarm/Technician/Steadfast) — setup + priority + reliable recovery; strong setup on a fast frame; ability: Technician.
- **Shaymin** (Grass, BST 600, Natural Cure) — BST 600; setup + priority + reliable recovery; strong setup on a fast frame.
- **Sneasel-Hisui** (Fighting/Poison, BST 430, Inner Focus/Keen Eye/Pickpocket) — Speed **361**; setup + priority + reliable recovery; strong setup on a fast frame.
- **Typhlosion-Hisui** (Fire/Ghost, BST 534, Blaze/Frisk) — BST 534; setup + priority + reliable recovery; strong setup on a fast frame.
- **Virizion** (Grass/Fighting, BST 580, Justified) — BST 580; setup + priority + reliable recovery; strong setup on a fast frame.
- **Avalugg-Hisui** (Ice/Rock, BST 514, Strong Jaw/Ice Body/Sturdy) — ability: Strong Jaw; hazards + real offence.
- **Brute Bonnet** (Grass/Dark, BST 570, Protosynthesis) — BST 570; setup + priority + reliable recovery.
- **Combusken** (Fire/Fighting, BST 405, Blaze/Speed Boost) — setup + priority + reliable recovery; ability: Speed Boost.
- **Delphox** (Fire/Psychic, BST 534, Blaze/Magician) — BST 534; strong setup on a fast frame.
- **Druddigon** (Dragon, BST 485, Rough Skin/Sheer Force/Mold Breaker) — setup + priority + reliable recovery; ability: Sheer Force.
- **Eldegoss** (Grass, BST 460, Cotton Down/Regenerator/Effect Spore) — setup + priority + reliable recovery; ability: Regenerator.
- **Electrode-Hisui** (Electric/Grass, BST 490, Soundproof/Static/Aftermath) — Speed **438**; setup + priority + reliable recovery.
- **Floette-Eternal** (Fairy, BST 551, Flower Veil/Symbiosis) — BST 551; strong setup on a fast frame.
- **Galvantula** (Bug/Electric, BST 472, Compound Eyes/Unnerve/Swarm) — setup + priority + reliable recovery; ability: Compound Eyes.
- **Glastrier** (Ice, BST 580, Chilling Neigh) — BST 580; ability: Chilling Neigh.
- **Gurdurr** (Fighting, BST 405, Guts/Sheer Force/Iron Fist) — setup + priority + reliable recovery; ability: Guts/Sheer Force.
- **Machoke** (Fighting, BST 405, Guts/No Guard/Steadfast) — setup + priority + reliable recovery; ability: Guts.
- **Meditite** (Fighting/Psychic, BST 280, Pure Power/Telepathy) — setup + priority + reliable recovery; ability: Pure Power.
- **Mienfoo** (Fighting, BST 350, Inner Focus/Regenerator/Reckless) — setup + priority + reliable recovery; ability: Regenerator.
- **Milotic** (Water, BST 540, Marvel Scale/Competitive/Cute Charm) — BST 540; ability: Marvel Scale.
- **Mismagius** (Ghost, BST 495, Levitate) — setup + priority + reliable recovery; strong setup on a fast frame.
- **Mudsdale** (Ground, BST 500, Own Tempo/Stamina/Inner Focus) — ability: Stamina; hazards + real offence.
- **Ninetales-Alola** (Ice/Fairy, BST 505, Snow Cloak/Snow Warning) — setup + priority + reliable recovery; strong setup on a fast frame.
- **Primeape** (Fighting, BST 455, Vital Spirit/Anger Point/Defiant) — setup + priority + reliable recovery; strong setup on a fast frame.
- **Servine** (Grass, BST 413, Overgrow/Contrary) — setup + priority + reliable recovery; ability: Contrary.
- **Tangela** (Grass, BST 435, Chlorophyll/Leaf Guard/Regenerator) — setup + priority + reliable recovery; ability: Regenerator.
- **Wishiwashi-School** (Water, BST 620, Schooling) — BST 620; ability: Schooling.
- **Wo-Chien** (Dark/Grass, BST 580, Tablets of Ruin) — BST 580; ability: Tablets of Ruin.
- **Wobbuffet** (Psychic, BST 405, Shadow Tag/Telepathy) — **trapping ability: Shadow Tag**; **trapping + setup**.
- **Zoroark** (Dark, BST 510, Illusion) — setup + priority + reliable recovery; strong setup on a fast frame.

**Multi-hit users in PU**, because the 25-BP-per-hit rewrite changes what these
moves are worth and Skill Link forces the maximum:

| Move | Type | BP × hits | PU users |
| --- | --- | --- | --- |
| Rock Blast | Rock | 25 × [2,5] | Archeops, Arctovish, Aurorus, Avalugg-Hisui, Bombirdier, Coalossal, Corsola-Galar, Dugtrio, Garbodor, Gigalith, Lairon, Rampardos, Slowbro-Galar |
| Bullet Seed | Grass | 25 × [2,5] | Bellossom, Brute Bonnet, Dipplin, Eldegoss, Electrode-Hisui, Roselia, Servine, Shaymin, Tangela, Thwackey, Vileplume, Virizion, Wo-Chien |
| Icicle Spear | Ice | 25 × [2,5] | Arctovish, Aurorus, Avalugg-Hisui, Corsola-Galar, Frosmoth, Glastrier, Ninetales-Alola, Piloswine, Sandslash-Alola, Sneasel-Hisui |
| Pin Missile | Bug | 25 × [2,5] | Galvantula, Qwilfish, Qwilfish-Hisui, Roselia, Sandslash-Alola, Togedemaru |
| Tail Slap | Normal | 25 × [2,5] | Ambipom, Floatzel, Ninetales-Alola |
| Arm Thrust | Fighting | 25 × [2,5] | Emboar |
| Fury Attack | Normal | 25 × [2,5] | Cramorant, Piloswine, Vullaby |
| Fury Swipes | Normal | 25 × [2,5] | Ambipom, Dugtrio, Floatzel, Mienfoo, Ninjask, Primeape, Raticate-Alola, Sandslash-Alola, Sneasel-Hisui, Typhlosion-Hisui, Ursaring, Zoroark |
| Spike Cannon | Normal | 25 × [2,5] | Corsola-Galar |
| Double Hit | Normal | 50 × 2 | Ambipom, Dipplin, Floatzel, Scyther, Sneasel-Hisui, Thwackey, Type: Null, Zweilous |
| Dual Chop | Dragon | 50 × 2 | Ambipom, Combusken, Fraxure, Hoopa, Machoke, Mienfoo, Primeape |
| Dual Wingbeat | Flying | 50 × 2 | Archeops, Bombirdier, Clefairy, Cramorant, Druddigon, Frosmoth, Golbat, Ninjask, Oricorio, Oricorio-Pa'u, Scyther, Togetic, Vullaby |
| Twineedle | Bug | 50 × 2 | Togedemaru |
| Triple Axel | Ice | 20 × 3 | Ambipom, Bellossom, Frosmoth, Milotic, Ninetales-Alola, Sandslash-Alola, Sneasel-Hisui |
| Scale Shot | Dragon | 25 × [2,5] | Druddigon, Fraxure, Kingdra, Milotic, Qwilfish, Qwilfish-Hisui, Salazzle, Turtonator, Wishiwashi, Wishiwashi-School |

**Skill Link holders in PU: Ambipom** — Skill Link forces the
maximum hit count and the calculator honours it.
---

## T. Remaining genuinely unresolved questions

1. **No usage, ladder, win-rate, tournament or popularity data exists in RedGPT.**
   There is no metagame history for any tier. Every judgement must be mechanical.
2. **Nothing in PU has been played by a human.** The ladder was rebuilt on
   2026-08-15 and has been revised on 2026-08-16 by the Ubers, UU, RU and NU passes.
3. **0 PU formes sit on an `estimated` tier** — a nearest-neighbour
   model over BST and base tier, with **no notion of movepool, ability, matchup
   structure or item opportunity cost**. Section F is the evidence the model
   cannot see.
4. **Conditional abilities are read at their unactivated value.** Guts, Quick
   Feet, Protosynthesis, Quark Drive, Unburden, Swift Swim, Schooling and the
   rest are reported unboosted, because nothing has triggered them. The Orbs fire
   **on entry**, so for a Guts or Quick Feet holder the activated number is the
   one that matters — ask and it can be measured.
   **Wishiwashi is the sharpest case in PU**: base Wishiwashi is BST 175 and
   Wishiwashi-School is BST 620, and they are separate roster entries.
5. **A species may run any of its abilities.** Offence is reported per ability,
   but the movepool sections assume the first. Where an ability decides a verdict
   — any trapping holder, any Skill Link or Regenerator user — ask for a
   per-ability profile.
6. **Trapping is verified, but its *value* is not measurable here.** Section B
   establishes exactly who can be trapped and how they escape. What that is worth
   in a real game — how often a trapper gets in safely, how much a removed wall
   costs the victim's team — has no data behind it, and the global trapping audit
   is a separate document.
7. **There is no move-half to the forme-route gate** (section R). Inert today;
   a blocker for any future move-driven forme change.
8. **The 0-2 HP rounding difference from Showdown's calculator** is known and
   documented; it never changes a tier.

**If a number you need is missing, ask for it** rather than estimating. Any
damage, speed, trapping or legality question can be answered against the real
engine.