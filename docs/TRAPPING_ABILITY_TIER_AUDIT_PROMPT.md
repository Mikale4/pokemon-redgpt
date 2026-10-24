# RedGPT Global Trapping-Ability Tier Audit — Verified Evidence Packet

**Generated from the live RedGPT project** by `tools/trapping-audit-prompt.js`.
Every mechanic below was measured by driving the real battle engine, not read off
packaged data and not assumed from Pokémon Showdown.

**RedGPT has no usage, ladder, win-rate, tournament or popularity data.** None is
quoted anywhere. Section S lists what genuinely cannot be settled.

---

## Your task

Make the **final global tier audit of every species and forme that can legally
use a trapping ability in RedGPT.**

For each holder, decide where it belongs across:

**Ubers · OU · UU · RU · NU · PU · ZU**

**Do not restrict movement to adjacent tiers.** A holder may stay put, move up
one rung, move up several, move down one, or move down several. The question is
not "NU or RU?" — it is:

> **Given that trapping abilities are legal in every RedGPT format, what is the
> correct competitive tier for every Pokémon that can use one?**

### The balance policy, which is fixed

**TRAPPING ABILITIES REMAIN LEGAL IN ALL COMPETITIVE FORMATS.** Balance is
handled by tiering the Pokémon that use them.

Do **not** recommend banning Shadow Tag, Arena Trap, Magnet Pull,
trapping abilities as a group, or a trapping clause — unless you are reporting a
technical impossibility rather than proposing balance policy.

    ABILITY = LEGAL
    POKÉMON = TIERED ACCORDING TO POWER

If Shadow Tag makes a Pokémon too strong for its tier, move **that Pokémon** up.
If a weak Magnet Pull user is still fine in ZU, leave it there. Do not treat
every trapping user identically, and do not assume a famous historical offender
is automatically Ubers — or that a historically weak user stays low once trapping
is on the table.

**Trapping power is not measured in raw damage.** A trapper is a problem when it
reliably removes something its tier structurally needs: the primary physical or
special wall, the hazard remover, the Steel, the Fairy, the Unaware user, the
Regenerator pivot, the revenge killer. Section J is that question.

---
## A. Current complete tier snapshot

| Tier | Entries | Trapping-ability holders in it |
| --- | --- | --- |
| **Ubers** | 63 | Gengar-Mega (Shadow Tag, forced) |
| **OU** | 93 | — |
| **UU** | 91 | Chandelure (Shadow Tag) |
| **RU** | 131 | Magnezone (Magnet Pull) |
| **NU** | 67 | Gothitelle (Shadow Tag); Magneton (Magnet Pull) |
| **PU** | 110 | Dugtrio (Arena Trap); Gothorita (Shadow Tag); Lampent (Shadow Tag); Wobbuffet (Shadow Tag) |
| **ZU** | 677 | Diglett (Arena Trap); Geodude-Alola (Magnet Pull); Golem-Alola (Magnet Pull); Gothita (Shadow Tag); Graveler-Alola (Magnet Pull); Litwick (Shadow Tag); Magnemite (Magnet Pull); Meltan (Magnet Pull, forced); Nosepass (Magnet Pull); Probopass (Magnet Pull); Trapinch (Arena Trap); Wynaut (Shadow Tag) |

**Selectable species 1138, packaged 1273.**

**21 holders carry a ladder tier and are what this audit can move.**
A further **0 holders carry no tier at all** — they are NFE, and
§5 of the project's own rules discards NFE and LC. Verified through the real
validator: they are **refused in every one of the seven tier formats**, so they
are playable only in Anything Goes and Random Battle. They are listed in section
D for completeness and are **out of scope for tier movement**.

---
## B. Verified trapping mechanics

**Discovery was behavioural, not by name.** The list is every ability in the
registry that defines an `onTrapped` hook, so a custom, renamed or future
trapping ability appears automatically:

**Shadow Tag, Arena Trap, Magnet Pull** — and nothing else.

| Ability | Live condition |
| --- | --- |
| **Shadow Tag** | the foe is trapped **unless the foe also has Shadow Tag** |
| **Arena Trap** | the foe is trapped **only while grounded** (`battle.isGrounded`) |
| **Magnet Pull** | the foe is trapped **only if it is a Steel type** |

### The predicate, and why its ORDER matters

`battle.isTrapped(pokemon)` is the single choke point. It is consulted in this
order, and the order is load-bearing:

1. **Shed Shell** — escapes *everything*, checked first (including Fairy Lock and partial trapping).
2. **Fairy Lock** — a move, traps **both** sides, and is checked **above** the Ghost escape, so a Ghost *is* held by Fairy Lock.
3. **Volatile traps** — partial trapping (Wrap/Bind/Fire Spin/Clamp), Mean Look / Block / Spider Web, Ingrain, Octolock.
4. **Ghost typing escapes** — beats all three abilities, read off **live** types (so Terastal, Soak or Protean change the answer).
5. **Guard Dog** (`trapImmune`) on the victim.
6. The trapper's own `onTrapped` hook.

### The measured truth table

Every row was produced by building a real battle and reading `battle.isTrapped`,
then cross-checked against an actual `{type:'switch'}` command. **The predicate
and the command agreed in every case** — so what the UI shows and what the engine
refuses cannot diverge.

| Situation | Trapped? |
| --- | --- |
| ordinary grounded non-Ghost vs Shadow Tag | **YES** |
| Ghost vs Shadow Tag | no |
| Ghost vs Arena Trap | no |
| Ghost vs Magnet Pull | no |
| Flying (Skarmory) vs Shadow Tag | **YES** — Shadow Tag is not a grounding effect |
| Levitate (Rotom-Wash) vs Shadow Tag | **YES** |
| Air Balloon vs Shadow Tag | **YES** |
| Flying vs Arena Trap | no |
| Levitate vs Arena Trap | no |
| Air Balloon vs Arena Trap | no |
| Flying holding an **Iron Ball** vs Arena Trap | **YES** — re-grounded |
| Steel (Skarmory) vs Magnet Pull | **YES** |
| non-Steel vs Magnet Pull | no |
| **Steel/Ghost (Aegislash)** vs Magnet Pull | no — the Ghost branch is checked first |
| victim holding **Shed Shell** | no — against all three |
| victim with **Guard Dog** | no — against all three |
| **Shadow Tag vs Shadow Tag** | no — mutual immunity |
| victim with **Mold Breaker** | **YES** — Mold Breaker does **not** break trapping |
| trapper hit by **Gastro Acid** | no |
| victim has **Neutralizing Gas** | no — it suppresses the trapper |
| trapper's ability swapped away (Skill Swap / Entrainment / Trace) | no |
| **trapper switches out** | no — freed immediately, same turn |
| **trapper faints** | no — freed immediately |

### Two results that change what trapping is worth

- **Every pivot move bypasses trapping.** Verified for all six —
  **U-turn, Volt Switch, Flip Turn, Parting Shot, Baton Pass and Teleport** all
  escape a trap. Trapping blocks **voluntary** switching only. Note this is
  implemented in six separate places in `battle.js` rather than one, so it is
  the current behaviour rather than a single switchable policy.
- **Phazing drags a trapped Pokémon out.** An opposing Whirlwind replaced a
  trapped victim; forced switches never consult `isTrapped` at all. Roar,
  Whirlwind, Dragon Tail and Circle Throw are therefore all answers to a trapper.

### Other supporting mechanics

- **Ability Shield** (Ability Shield) protects an ability from suppression.
- **Doubles do not exist in RedGPT** — this is a singles-only engine, so no
  redirection or ally interaction applies.
- **No divergence from cartridge behaviour was found in the trapping conditions
  themselves.** The one thing worth flagging is that **Shed Shell is checked
  before the volatile traps**, so it escapes partial trapping and Ingrain as well
  as ability trapping. That is stated as measured behaviour, not as a defect.

---
## C. Format legality — proof, not assertion

Read live off every format object in the build:

| Format | `bannedAbilities` | Any trapping ability banned? |
| --- | --- | --- |
| Anything Goes | **[]** | no |
| Random Battle | **[]** | no |
| Ubers | **[]** | no |
| Ubers (Tera) | **[]** | no |
| OverUsed | **[]** | no |
| OverUsed (Tera) | **[]** | no |
| UnderUsed | **[]** | no |
| RarelyUsed | **[]** | no |
| NeverUsed | **[]** | no |
| PU | **[]** | no |
| ZU | **[]** | no |

**All 11 formats carry an empty `bannedAbilities` list.** No
trapping ability is banned anywhere, by `bannedAbilities`, by the validator, by a
species clause, by a tier override or by any other route. **No fix was required —
the policy was already the live state.** A regression test now asserts this, with
a control that bans Shadow Tag in a format and watches the test go red.

The remaining gate on a trapping *holder* is its own tier, exactly as for any
other Pokémon.

---
## D. Complete trapping-holder inventory

### Tiered holders — the audit's actual scope (21)

| Holder | Kind | Current tier | Trapping ability | Forced? | Types | BST (spread) | All abilities | Item |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Gengar-Mega** | forme | **Ubers** | Shadow Tag | **yes** | Ghost/Poison | 600 (60/65/80/170/95/130) | Shadow Tag | **Gengarite forced** |
| **Chandelure** | species | **UU** | Shadow Tag | no | Ghost/Fire | 520 (60/55/90/145/90/80) | Flash Fire, Flame Body, Infiltrator, Shadow Tag | free |
| **Magnezone** | species | **RU** | Magnet Pull | no | Electric/Steel | 535 (70/70/115/130/90/60) | Magnet Pull, Sturdy, Analytic | free |
| **Gothitelle** | species | **NU** | Shadow Tag | no | Psychic | 490 (70/55/95/95/110/65) | Frisk, Competitive, Shadow Tag | free |
| **Magneton** | species | **NU** | Magnet Pull | no | Electric/Steel | 465 (50/60/95/120/70/70) | Magnet Pull, Sturdy, Analytic | free |
| **Dugtrio** | species | **PU** | Arena Trap | no | Ground | 425 (35/100/50/50/70/120) | Sand Veil, Arena Trap, Sand Force | free |
| **Gothorita** | species | **PU** | Shadow Tag | no | Psychic | 390 (60/45/70/75/85/55) | Frisk, Competitive, Shadow Tag | free |
| **Lampent** | species | **PU** | Shadow Tag | no | Ghost/Fire | 370 (60/40/60/95/60/55) | Flash Fire, Flame Body, Infiltrator, Shadow Tag | free |
| **Wobbuffet** | species | **PU** | Shadow Tag | no | Psychic | 405 (190/33/58/33/58/33) | Shadow Tag, Telepathy | free |
| **Diglett** | species | **ZU** | Arena Trap | no | Ground | 265 (10/55/25/35/45/95) | Sand Veil, Arena Trap, Sand Force | free |
| **Geodude-Alola** | species | **ZU** | Magnet Pull | no | Rock/Electric | 300 (40/80/100/30/30/20) | Magnet Pull, Sturdy, Galvanize | free |
| **Golem-Alola** | species | **ZU** | Magnet Pull | no | Rock/Electric | 495 (80/120/130/55/65/45) | Magnet Pull, Sturdy, Galvanize | free |
| **Gothita** | species | **ZU** | Shadow Tag | no | Psychic | 290 (45/30/50/55/65/45) | Frisk, Competitive, Shadow Tag | free |
| **Graveler-Alola** | species | **ZU** | Magnet Pull | no | Rock/Electric | 390 (55/95/115/45/45/35) | Magnet Pull, Sturdy, Galvanize | free |
| **Litwick** | species | **ZU** | Shadow Tag | no | Ghost/Fire | 275 (50/30/55/65/55/20) | Flash Fire, Flame Body, Infiltrator, Shadow Tag | free |
| **Magnemite** | species | **ZU** | Magnet Pull | no | Electric/Steel | 325 (25/35/70/95/55/45) | Magnet Pull, Sturdy, Analytic | free |
| **Meltan** | species | **ZU** | Magnet Pull | **yes** | Steel | 300 (46/65/65/55/35/34) | Magnet Pull | free |
| **Nosepass** | species | **ZU** | Magnet Pull | no | Rock | 375 (30/45/135/45/90/30) | Sturdy, Magnet Pull, Sand Force | free |
| **Probopass** | species | **ZU** | Magnet Pull | no | Rock/Steel | 525 (60/55/145/75/150/40) | Sturdy, Magnet Pull, Sand Force | free |
| **Trapinch** | species | **ZU** | Arena Trap | no | Ground | 290 (45/100/45/45/45/10) | Hyper Cutter, Arena Trap, Sheer Force | free |
| **Wynaut** | species | **ZU** | Shadow Tag | no | Psychic | 260 (95/23/48/23/48/23) | Shadow Tag, Telepathy | free |

### Untiered holders — NFE, out of scope (0)

These carry **no ladder tier** and the validator refuses them in all seven tier
formats. Listed so the inventory is complete, **not** for placement.

| Holder | Trapping ability | Forced? | Types | BST | All abilities |
| --- | --- | --- | --- | --- | --- |


---
## E. Shadow Tag holders

**Live effect:** the foe cannot switch out **unless it also has Shadow Tag**. Ghost, Shed Shell and Guard Dog still escape (section B).

**Tiered holders: 9.**

#### Gengar-Mega

- **Current tier:** Ubers
- **Kind:** forme (transform-only), battleOnly → Gengar, **not selectable** — reached only by transformation
- **Typing:** Ghost/Poison | **BST** 600 (60/65/80/170/95/130)
- **Abilities:** Shadow Tag — trapping ability **Shadow Tag**, **FORCED (its only ability)**
- **Item:** **Gengarite forced and unremovable**
- **Engine offence @252 (neutral/+):** Shadow Tag: Atk 229/251, SpA 439/482, Spe 359/394
- **STAB:** Ghost Shadow Ball 80S · Poison Sludge Wave 95S
- **Physical coverage:** Normal Explosion 250P, Fighting Focus Punch 150P, Dark Foul Play 95P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
- **Special coverage:** Fighting Focus Blast 120S, Electric Thunder 120S, Psychic Dream Eater 100S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S
- **Setup:** Nasty Plot  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** Drain Punch, Dream Eater, Giga Drain, Mega Drain
- **Priority:** Sucker Punch 80P Dark (+1)
- **Hazards:** Toxic Spikes | **Removal:** none | **Pivot:** none | **Phazing:** none
- **Status:** Hypnosis, Thunder Wave, Toxic, Will-O-Wisp
- **Trapping-compatible tactics:** Knock Off, Trick, Encore, Taunt, Substitute, Protect, Perish Song, Disable, Toxic, Will-O-Wisp
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| Ubers | **58 of 63** | Calyrex-Shadow, Flutter Mane, Gengar-Mega, Giratina, Giratina-Origin |
| OU | **84 of 93** | Alakazam-Mega, Annihilape, Ceruledge, Dragapult, Gholdengo, Lunala, Marshadow, Necrozma-Dawn-Wings, Spectrier |

**Damage into the Ubers targets it can trap** — attacker **Gengar-Mega**, timid, {"spa":252,"spe":252,"hp":4}, ability **Shadow Tag**, Gengarite (forced); defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped Ubers target | Shadow Ball | Sludge Wave | Focus Blast |
| --- | --- | --- | --- |
| Arceus (physWall) | 0-0 (0-0%) | 164-193 (36.9-43.5%) | 275-324 (61.9-73%) |
| Baxcalibur-Mega (specWall) | 116-136 (26.7-31.3%) | 137-161 (31.6-37.1%) | 230-271 (53-62.4%) |
| Blaziken-Mega (physWall) | 194-228 (53.3-62.6%) | 230-271 (63.2-74.5%) | 193-227 (53-62.4%) |
| Calyrex-Ice (specWall) | 196-230 (48.5-56.9%) | 115-136 (28.5-33.7%) | 97-114 (24-28.2%) |
| Chi-Yu (physWall) | 69-81 (22-25.8%) | 164-193 (52.2-61.5%) | 275-324 (87.6-103.2%) |
| Chien-Pao (specWall) | 76-89 (20.9-24.5%) | 180-212 (49.5-58.2%) | 606-713 (166.5-195.9%) |
| Darkrai-Mega (physWall) | 64-76 (18.6-22.1%) | 153-180 (44.5-52.3%) | 257-302 (74.7-87.8%) |
| Darmanitan-Galar (physWall) | 260-306 (62.8-73.9%) | 308-362 (74.4-87.4%) | 518-610 (125.1-147.3%) |
| Darmanitan-Galar-Zen (physWall) | 260-306 (62.8-73.9%) | 308-362 (74.4-87.4%) | 518-610 (125.1-147.3%) |
| Deoxys-Attack (physWall) | 994-1170 (327-384.9%) | 590-694 (194.1-228.3%) | 248-292 (81.6-96.1%) |
| Dialga-Origin (physWall) | 138-163 (34.2-40.3%) | 0-0 (0-0%) | 275-324 (68.1-80.2%) |
| Dragonite-Mega (physWall) | 67-78 (17.4-20.2%) | 79-93 (20.5-24.1%) | 33-39 (8.5-10.1%) |

---

#### Chandelure

- **Current tier:** UU
- **Kind:** species
- **Typing:** Ghost/Fire | **BST** 520 (60/55/90/145/90/80)
- **Abilities:** Flash Fire / Flame Body / Infiltrator / Shadow Tag — trapping ability **Shadow Tag**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Flash Fire: Atk 209/229, SpA 389/427, Spe 259/284 — Flame Body: Atk 209/229, SpA 389/427, Spe 259/284 — Infiltrator: Atk 209/229, SpA 389/427, Spe 259/284 — Shadow Tag: Atk 209/229, SpA 389/427, Spe 259/284
- **STAB:** Ghost Shadow Ball 80S · Fire Overheat 140S
- **Physical coverage:** Normal Return 102P, Dark Lash Out 75P, Bug Skitter Smack 70P, Grass Trailblaze 50P
- **Special coverage:** Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S
- **Setup:** Acid Armor, Calm Mind  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** Dream Eater
- **Priority:** none
- **Hazards:** none | **Removal:** none | **Pivot:** none | **Phazing:** none
- **Status:** Toxic, Will-O-Wisp
- **Trapping-compatible tactics:** Trick, Taunt, Substitute, Protect, Toxic, Will-O-Wisp
- **Transformation routes:** Chandelurite → Chandelure-Mega (UU)

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| OU | **84 of 93** | Alakazam-Mega, Annihilape, Ceruledge, Dragapult, Gholdengo, Lunala, Marshadow, Necrozma-Dawn-Wings, Spectrier |
| UU | **81 of 91** | Aegislash, Aegislash-Blade, Blacephalon, Chandelure, Chandelure-Mega, Gengar, Pecharunt, Polteageist, Sableye-Mega, Zoroark-Hisui |
| RU | **119 of 131** | Absol-Mega-Z, Banette-Mega, Froslass-Mega, Golurk-Mega, Marowak-Alola, Meowstic-M-Mega, Mimikyu, Mimikyu-Busted, Oricorio-Sensu, Porygon2, Sinistcha, Skeledirge |

**Damage into the UU targets it can trap** — attacker **Chandelure**, timid, {"spa":252,"spe":252,"hp":4}, ability **Shadow Tag**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped UU target | Shadow Ball | Overheat | Solar Beam |
| --- | --- | --- | --- |
| Aerodactyl-Mega (physWall) | 195-228 (53.6-62.6%) | 169-198 (46.4-54.4%) | 193-227 (53-62.4%) |
| Alakazam (physWall) | 390-458 (124.2-145.9%) | 338-397 (107.6-126.4%) | 193-227 (61.5-72.3%) |
| Altaria-Mega (specWall) | 130-153 (36.7-43.2%) | 113-132 (31.9-37.3%) | 65-75 (18.4-21.2%) |
| Amoonguss (physWall) | 223-263 (51.6-60.9%) | 780-917 (180.6-212.3%) | 54-65 (12.5-15%) |
| Archaludon (specWall) | 175-206 (45.6-53.6%) | 304-358 (79.2-93.2%) | 42-50 (10.9-13%) |
| Azumarill (physWall) | 223-263 (55.2-65.1%) | 97-114 (24-28.2%) | 445-525 (110.1-130%) |
| Bisharp (specWall) | 83-98 (24.9-29.3%) | 585-687 (175.1-205.7%) | 83-97 (24.9-29%) |
| Blissey (physWall) | 0-0 (0-0%) | 250-295 (35-41.3%) | 143-169 (20-23.7%) |
| Buzzwole (specWall) | 195-230 (46.7-55%) | 679-799 (162.4-191.1%) | 96-114 (23-27.3%) |
| Celesteela (specWall) | 133-157 (33.4-39.4%) | 464-546 (116.6-137.2%) | 32-39 (8-9.8%) |
| Chansey (physWall) | 0-0 (0-0%) | 310-365 (44-51.8%) | 178-209 (25.3-29.7%) |
| Clefable (physWall) | 202-239 (51.3-60.7%) | 353-416 (89.6-105.6%) | 202-237 (51.3-60.2%) |

---

#### Gothitelle

- **Current tier:** NU
- **Kind:** species
- **Typing:** Psychic | **BST** 490 (70/55/95/95/110/65)
- **Abilities:** Frisk / Competitive / Shadow Tag — trapping ability **Shadow Tag**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Frisk: Atk 209/229, SpA 289/317, Spe 229/251 — Competitive: Atk 209/229, SpA 289/317, Spe 229/251 — Shadow Tag: Atk 209/229, SpA 289/317, Spe 229/251
- **STAB:** Psychic Future Sight 120S
- **Physical coverage:** Normal Return 102P, Dark Foul Play 95P, Fighting Brick Break 75P, Rock Rock Slide 75P
- **Special coverage:** Fighting Focus Blast 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S
- **Setup:** Calm Mind, Cosmic Power, Nasty Plot  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** Dream Eater
- **Priority:** Fake Out 40P Normal (+3)
- **Hazards:** none | **Removal:** none | **Pivot:** none | **Phazing:** none
- **Status:** Hypnosis, Thunder Wave, Toxic
- **Trapping-compatible tactics:** Trick, Taunt, Substitute, Protect, Toxic
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| RU | **119 of 131** | Absol-Mega-Z, Banette-Mega, Froslass-Mega, Golurk-Mega, Marowak-Alola, Meowstic-M-Mega, Mimikyu, Mimikyu-Busted, Oricorio-Sensu, Porygon2, Sinistcha, Skeledirge |
| NU | **61 of 67** | Basculegion, Brambleghast, Decidueye, Dhelmise, Doublade, Houndstone |
| PU | **99 of 110** | Corsola-Galar, Dusclops, Golurk, Hoopa, Jellicent, Lampent, Mismagius, Palossand, Porygon, Typhlosion-Hisui, Wobbuffet |

**Damage into the NU targets it can trap** — attacker **Gothitelle**, timid, {"spa":252,"spe":252,"hp":4}, ability **Shadow Tag**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped NU target | Future Sight | Focus Blast | Thunderbolt |
| --- | --- | --- | --- |
| Abomasnow-Mega (physWall) | 198-234 (51.6-60.9%) | 265-312 (69-81.3%) | 52-61 (13.5-15.9%) |
| Aerodactyl (physWall) | 262-308 (72-84.6%) | 174-205 (47.8-56.3%) | 278-326 (76.4-89.6%) |
| Aggron (specWall) | 101-119 (29.4-34.6%) | 343-343 (99.7-99.7%) | 107-127 (31.1-36.9%) |
| Altaria (physWall) | 198-234 (55.9-66.1%) | 66-78 (18.6-22%) | 105-123 (29.7-34.7%) |
| Araquanid (physWall) | 163-192 (47.9-56.5%) | 54-63 (15.9-18.5%) | 174-204 (51.2-60%) |
| Arcanine (physWall) | 249-292 (64.8-76%) | 166-195 (43.2-50.8%) | 131-154 (34.1-40.1%) |
| Articuno-Galar (physWall) | 102-122 (26.6-31.8%) | 33-40 (8.6-10.4%) | 219-258 (57-67.2%) |
| Avalugg (specWall) | 232-274 (58.9-69.5%) | 310-365 (78.7-92.6%) | 123-144 (31.2-36.5%) |
| Bellibolt (specWall) | 169-198 (40-46.9%) | 111-132 (26.3-31.3%) | 44-52 (10.4-12.3%) |
| Braviary (physWall) | 262-308 (64.9-76.2%) | 174-205 (43.1-50.7%) | 278-326 (68.8-80.7%) |
| Bronzong (physWall) | 45-53 (13.3-15.7%) | 122-143 (36.1-42.3%) | 96-114 (28.4-33.7%) |
| Cinccino (physWall) | 312-367 (88.1-103.7%) | 416-490 (117.5-138.4%) | 165-193 (46.6-54.5%) |

---

#### Gothorita

- **Current tier:** PU
- **Kind:** species
- **Typing:** Psychic | **BST** 390 (60/45/70/75/85/55)
- **Abilities:** Frisk / Competitive / Shadow Tag — trapping ability **Shadow Tag**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Frisk: Atk 189/207, SpA 249/273, Spe 209/229 — Competitive: Atk 189/207, SpA 249/273, Spe 209/229 — Shadow Tag: Atk 189/207, SpA 249/273, Spe 209/229
- **STAB:** Psychic Future Sight 120S
- **Physical coverage:** Normal Return 102P, Dark Foul Play 95P, Rock Rock Slide 75P
- **Special coverage:** Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
- **Setup:** Calm Mind, Nasty Plot  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** Dream Eater
- **Priority:** Fake Out 40P Normal (+3)
- **Hazards:** none | **Removal:** none | **Pivot:** none | **Phazing:** none
- **Status:** Hypnosis, Thunder Wave, Toxic
- **Trapping-compatible tactics:** Trick, Taunt, Substitute, Protect, Toxic
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| NU | **61 of 67** | Basculegion, Brambleghast, Decidueye, Dhelmise, Doublade, Houndstone |
| PU | **99 of 110** | Corsola-Galar, Dusclops, Golurk, Hoopa, Jellicent, Lampent, Mismagius, Palossand, Porygon, Typhlosion-Hisui, Wobbuffet |
| ZU | **639 of 677** | Banette, Bramblin, Cofagrigus, Cursola, Drakloak, Dreepy, Drifblim, Drifloon, Dusknoir, Duskull, Frillish, Froslass, Gastly, Gimmighoul, _+24 more_ |

**Damage into the PU targets it can trap** — attacker **Gothorita**, timid, {"spa":252,"spe":252,"hp":4}, ability **Shadow Tag**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped PU target | Future Sight | Thunderbolt | Energy Ball |
| --- | --- | --- | --- |
| Absol (physWall) | 0-0 (0-0%) | 141-167 (42.2-50%) | 135-158 (40.4-47.3%) |
| Alcremie (physWall) | 152-179 (45.5-53.6%) | 80-94 (24-28.1%) | 76-89 (22.8-26.6%) |
| Ambipom (physWall) | 250-295 (70.6-83.3%) | 132-156 (37.3-44.1%) | 124-148 (35-41.8%) |
| Archeops (physWall) | 253-297 (71.5-83.9%) | 267-315 (75.4-89%) | 127-149 (35.9-42.1%) |
| Arctovish (specWall) | 139-163 (36.2-42.4%) | 146-172 (38-44.8%) | 139-165 (36.2-43%) |
| Aromatisse (physWall) | 197-231 (48.5-56.9%) | 104-122 (25.6-30%) | 98-115 (24.1-28.3%) |
| Audino (physWall) | 202-239 (49.3-58.3%) | 106-126 (25.9-30.7%) | 101-119 (24.6-29%) |
| Audino-Mega (physWall) | 146-172 (35.6-42%) | 78-91 (19-22.2%) | 74-87 (18-21.2%) |
| Aurorus (physWall) | 192-226 (42.7-50.2%) | 101-119 (22.4-26.4%) | 192-227 (42.7-50.4%) |
| Avalugg-Hisui (specWall) | 223-263 (56.6-66.8%) | 118-139 (29.9-35.3%) | 224-265 (56.9-67.3%) |
| Bellossom (physWall) | 179-210 (50.6-59.3%) | 46-55 (13-15.5%) | 44-52 (12.4-14.7%) |
| Bombirdier (physWall) | 0-0 (0-0%) | 217-254 (63.1-73.8%) | 50-59 (14.5-17.2%) |

---

#### Lampent

- **Current tier:** PU
- **Kind:** species
- **Typing:** Ghost/Fire | **BST** 370 (60/40/60/95/60/55)
- **Abilities:** Flash Fire / Flame Body / Infiltrator / Shadow Tag — trapping ability **Shadow Tag**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Flash Fire: Atk 179/196, SpA 289/317, Spe 209/229 — Flame Body: Atk 179/196, SpA 289/317, Spe 209/229 — Infiltrator: Atk 179/196, SpA 289/317, Spe 209/229 — Shadow Tag: Atk 179/196, SpA 289/317, Spe 209/229
- **STAB:** Ghost Shadow Ball 80S · Fire Overheat 140S
- **Physical coverage:** Normal Return 102P, Dark Lash Out 75P, Bug Skitter Smack 70P
- **Special coverage:** Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S
- **Setup:** Acid Armor, Calm Mind  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** Dream Eater
- **Priority:** none
- **Hazards:** none | **Removal:** none | **Pivot:** none | **Phazing:** none
- **Status:** Toxic, Will-O-Wisp
- **Trapping-compatible tactics:** Trick, Taunt, Substitute, Protect, Toxic, Will-O-Wisp
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| NU | **61 of 67** | Basculegion, Brambleghast, Decidueye, Dhelmise, Doublade, Houndstone |
| PU | **99 of 110** | Corsola-Galar, Dusclops, Golurk, Hoopa, Jellicent, Lampent, Mismagius, Palossand, Porygon, Typhlosion-Hisui, Wobbuffet |
| ZU | **639 of 677** | Banette, Bramblin, Cofagrigus, Cursola, Drakloak, Dreepy, Drifblim, Drifloon, Dusknoir, Duskull, Frillish, Froslass, Gastly, Gimmighoul, _+24 more_ |

**Damage into the PU targets it can trap** — attacker **Lampent**, timid, {"spa":252,"spe":252,"hp":4}, ability **Shadow Tag**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped PU target | Shadow Ball | Overheat | Solar Beam |
| --- | --- | --- | --- |
| Absol (physWall) | 104-122 (31.1-36.5%) | 364-427 (109-127.8%) | 208-244 (62.3-73.1%) |
| Alcremie (physWall) | 118-139 (35.3-41.6%) | 205-241 (61.4-72.2%) | 117-137 (35-41%) |
| Ambipom (physWall) | 0-0 (0-0%) | 338-397 (95.5-112.1%) | 193-227 (54.5-64.1%) |
| Archeops (physWall) | 196-231 (55.4-65.3%) | 170-201 (48-56.8%) | 195-230 (55.1-65%) |
| Arctovish (specWall) | 107-127 (27.9-33.1%) | 187-219 (48.7-57%) | 214-252 (55.7-65.6%) |
| Aromatisse (physWall) | 153-180 (37.7-44.3%) | 266-313 (65.5-77.1%) | 152-179 (37.4-44.1%) |
| Audino (physWall) | 0-0 (0-0%) | 273-322 (66.6-78.5%) | 156-184 (38-44.9%) |
| Audino-Mega (physWall) | 0-0 (0-0%) | 198-234 (48.3-57.1%) | 113-133 (27.6-32.4%) |
| Aurorus (physWall) | 149-175 (33.1-38.9%) | 258-304 (57.3-67.6%) | 296-348 (65.8-77.3%) |
| Avalugg-Hisui (specWall) | 174-204 (44.2-51.8%) | 302-356 (76.6-90.4%) | 345-406 (87.6-103%) |
| Bellossom (physWall) | 139-163 (39.3-46%) | 483-569 (136.4-160.7%) | 68-80 (19.2-22.6%) |
| Bombirdier (physWall) | 79-93 (23-27%) | 275-325 (79.9-94.5%) | 78-92 (22.7-26.7%) |

---

#### Wobbuffet

- **Current tier:** PU
- **Kind:** species
- **Typing:** Psychic | **BST** 405 (190/33/58/33/58/33)
- **Abilities:** Shadow Tag / Telepathy — trapping ability **Shadow Tag**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Shadow Tag: Atk 165/181, SpA 165/181, Spe 165/181 — Telepathy: Atk 165/181, SpA 165/181, Spe 165/181
- **STAB:** Psychic Mirror Coat fixedS
- **Physical coverage:** Fighting Counter fixedP
- **Special coverage:** none
- **Setup:** Amnesia  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** none | **Rest:** no | **Drain:** none
- **Priority:** none
- **Hazards:** none | **Removal:** none | **Pivot:** none | **Phazing:** none
- **Status:** none
- **Trapping-compatible tactics:** Encore
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| NU | **61 of 67** | Basculegion, Brambleghast, Decidueye, Dhelmise, Doublade, Houndstone |
| PU | **99 of 110** | Corsola-Galar, Dusclops, Golurk, Hoopa, Jellicent, Lampent, Mismagius, Palossand, Porygon, Typhlosion-Hisui, Wobbuffet |
| ZU | **639 of 677** | Banette, Bramblin, Cofagrigus, Cursola, Drakloak, Dreepy, Drifblim, Drifloon, Dusknoir, Duskull, Frillish, Froslass, Gastly, Gimmighoul, _+24 more_ |

_No usable offensive set could be resolved for a damage table; see the profile above._

---

#### Gothita

- **Current tier:** ZU
- **Kind:** species
- **Typing:** Psychic | **BST** 290 (45/30/50/55/65/45)
- **Abilities:** Frisk / Competitive / Shadow Tag — trapping ability **Shadow Tag**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Frisk: Atk 159/174, SpA 209/229, Spe 189/207 — Competitive: Atk 159/174, SpA 209/229, Spe 189/207 — Shadow Tag: Atk 159/174, SpA 209/229, Spe 189/207
- **STAB:** Psychic Future Sight 120S
- **Physical coverage:** Normal Return 102P, Dark Foul Play 95P, Rock Rock Slide 75P
- **Special coverage:** Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
- **Setup:** Calm Mind, Nasty Plot  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** Dream Eater
- **Priority:** Fake Out 40P Normal (+3)
- **Hazards:** none | **Removal:** none | **Pivot:** none | **Phazing:** none
- **Status:** Hypnosis, Thunder Wave, Toxic
- **Trapping-compatible tactics:** Trick, Taunt, Substitute, Protect, Toxic
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| PU | **99 of 110** | Corsola-Galar, Dusclops, Golurk, Hoopa, Jellicent, Lampent, Mismagius, Palossand, Porygon, Typhlosion-Hisui, Wobbuffet |
| ZU | **639 of 677** | Banette, Bramblin, Cofagrigus, Cursola, Drakloak, Dreepy, Drifblim, Drifloon, Dusknoir, Duskull, Frillish, Froslass, Gastly, Gimmighoul, _+24 more_ |

**Damage into the ZU targets it can trap** — attacker **Gothita**, timid, {"spa":252,"spe":252,"hp":4}, ability **Shadow Tag**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped ZU target | Future Sight | Thunderbolt | Energy Ball |
| --- | --- | --- | --- |
| Abomasnow (physWall) | 171-202 (44.5-52.6%) | 45-53 (11.7-13.8%) | 42-50 (10.9-13%) |
| Abra (physWall) | 120-141 (47.2-55.5%) | 127-150 (50-59.1%) | 120-143 (47.2-56.3%) |
| Accelgor (physWall) | 226-266 (62.1-73.1%) | 119-140 (32.7-38.5%) | 55-66 (15.1-18.1%) |
| Aipom (physWall) | 241-284 (76.8-90.4%) | 127-150 (40.4-47.8%) | 120-143 (38.2-45.5%) |
| Amaura (physWall) | 218-257 (60.9-71.8%) | 115-135 (32.1-37.7%) | 219-258 (61.2-72.1%) |
| Ampharos (physWall) | 163-193 (42.4-50.3%) | 42-50 (10.9-13%) | 81-97 (21.1-25.3%) |
| Anorith (physWall) | 260-305 (88.4-103.7%) | 136-161 (46.3-54.8%) | 130-153 (44.2-52%) |
| Appletun (physWall) | 180-213 (42.5-50.2%) | 23-27 (5.4-6.4%) | 22-26 (5.2-6.1%) |
| Applin (specWall) | 180-213 (63.4-75%) | 23-27 (8.1-9.5%) | 22-26 (7.7-9.2%) |
| Arbok (physWall) | 366-430 (113-132.7%) | 96-113 (29.6-34.9%) | 45-53 (13.9-16.4%) |
| Arboliva (physWall) | 140-165 (38.9-45.8%) | 36-42 (10-11.7%) | 35-41 (9.7-11.4%) |
| Archen (physWall) | 279-328 (88.9-104.5%) | 296-348 (94.3-110.8%) | 140-165 (44.6-52.5%) |

---

#### Litwick

- **Current tier:** ZU
- **Kind:** species
- **Typing:** Ghost/Fire | **BST** 275 (50/30/55/65/55/20)
- **Abilities:** Flash Fire / Flame Body / Infiltrator / Shadow Tag — trapping ability **Shadow Tag**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Flash Fire: Atk 159/174, SpA 229/251, Spe 139/152 — Flame Body: Atk 159/174, SpA 229/251, Spe 139/152 — Infiltrator: Atk 159/174, SpA 229/251, Spe 139/152 — Shadow Tag: Atk 159/174, SpA 229/251, Spe 139/152
- **STAB:** Ghost Shadow Ball 80S · Fire Overheat 140S
- **Physical coverage:** Normal Return 102P, Bug Skitter Smack 70P, Dark Thief 60P
- **Special coverage:** Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S
- **Setup:** Acid Armor, Calm Mind  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** Dream Eater
- **Priority:** none
- **Hazards:** none | **Removal:** none | **Pivot:** none | **Phazing:** none
- **Status:** Toxic, Will-O-Wisp
- **Trapping-compatible tactics:** Trick, Taunt, Substitute, Protect, Toxic, Will-O-Wisp
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| PU | **99 of 110** | Corsola-Galar, Dusclops, Golurk, Hoopa, Jellicent, Lampent, Mismagius, Palossand, Porygon, Typhlosion-Hisui, Wobbuffet |
| ZU | **639 of 677** | Banette, Bramblin, Cofagrigus, Cursola, Drakloak, Dreepy, Drifblim, Drifloon, Dusknoir, Duskull, Frillish, Froslass, Gastly, Gimmighoul, _+24 more_ |

**Damage into the ZU targets it can trap** — attacker **Litwick**, timid, {"spa":252,"spe":252,"hp":4}, ability **Shadow Tag**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped ZU target | Shadow Ball | Overheat | Solar Beam |
| --- | --- | --- | --- |
| Abomasnow (physWall) | 126-149 (32.8-38.8%) | 878-1034 (228.6-269.3%) | 31-36 (8.1-9.4%) |
| Abra (physWall) | 354-418 (139.4-164.6%) | 308-362 (121.3-142.5%) | 176-208 (69.3-81.9%) |
| Accelgor (physWall) | 166-195 (45.6-53.6%) | 578-679 (158.8-186.5%) | 81-96 (22.3-26.4%) |
| Aipom (physWall) | 0-0 (0-0%) | 308-362 (98.1-115.3%) | 176-208 (56.1-66.2%) |
| Amaura (physWall) | 159-188 (44.4-52.5%) | 278-327 (77.7-91.3%) | 318-374 (88.8-104.5%) |
| Ampharos (physWall) | 120-141 (31.3-36.7%) | 209-247 (54.4-64.3%) | 119-140 (31-36.5%) |
| Anorith (physWall) | 189-223 (64.3-75.9%) | 331-390 (112.6-132.7%) | 188-222 (63.9-75.5%) |
| Appletun (physWall) | 132-156 (31.1-36.8%) | 230-271 (54.2-63.9%) | 32-37 (7.5-8.7%) |
| Applin (specWall) | 132-156 (46.5-54.9%) | 230-271 (81-95.4%) | 32-37 (11.3-13%) |
| Arbok (physWall) | 133-157 (41-48.5%) | 232-274 (71.6-84.6%) | 66-78 (20.4-24.1%) |
| Arboliva (physWall) | 0-0 (0-0%) | 357-421 (99.2-116.9%) | 50-59 (13.9-16.4%) |
| Archen (physWall) | 205-241 (65.3-76.8%) | 178-209 (56.7-66.6%) | 204-240 (65-76.4%) |

---

#### Wynaut

- **Current tier:** ZU
- **Kind:** species
- **Typing:** Psychic | **BST** 260 (95/23/48/23/48/23)
- **Abilities:** Shadow Tag / Telepathy — trapping ability **Shadow Tag**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Shadow Tag: Atk 145/159, SpA 145/159, Spe 145/159 — Telepathy: Atk 145/159, SpA 145/159, Spe 145/159
- **STAB:** Psychic Mirror Coat fixedS
- **Physical coverage:** Fighting Counter fixedP
- **Special coverage:** none
- **Setup:** Amnesia  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** none | **Rest:** no | **Drain:** none
- **Priority:** none
- **Hazards:** none | **Removal:** none | **Pivot:** none | **Phazing:** none
- **Status:** none
- **Trapping-compatible tactics:** Encore
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| PU | **99 of 110** | Corsola-Galar, Dusclops, Golurk, Hoopa, Jellicent, Lampent, Mismagius, Palossand, Porygon, Typhlosion-Hisui, Wobbuffet |
| ZU | **639 of 677** | Banette, Bramblin, Cofagrigus, Cursola, Drakloak, Dreepy, Drifblim, Drifloon, Dusknoir, Duskull, Frillish, Froslass, Gastly, Gimmighoul, _+24 more_ |

_No usable offensive set could be resolved for a damage table; see the profile above._

---
## F. Arena Trap holders

**Live effect:** the foe cannot switch out **while it is grounded**. Flying, Levitate, Air Balloon, Ghost, Shed Shell and Guard Dog escape; an Iron Ball re-grounds a Flyer into the trap.

**Tiered holders: 3.**

#### Dugtrio

- **Current tier:** PU
- **Kind:** species
- **Typing:** Ground | **BST** 425 (35/100/50/50/70/120)
- **Abilities:** Sand Veil / Arena Trap / Sand Force — trapping ability **Arena Trap**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Sand Veil: Atk 299/328, SpA 199/218, Spe 339/372 — Arena Trap: Atk 299/328, SpA 199/218, Spe 339/372 — Sand Force: Atk 299/328, SpA 199/218, Spe 339/372
- **STAB:** Ground Earthquake 100P
- **Physical coverage:** Normal Double-Edge 120P, Rock Stone Edge 100P, Dark Foul Play 95P, Ghost Shadow Claw 70P, Flying Aerial Ace 60P, Fighting Rock Smash 40P
- **Special coverage:** Poison Sludge Wave 95S, Normal Uproar 90S, Rock Ancient Power 60S, Fighting Final Gambit fixedS
- **Setup:** Agility, Hone Claws, Swords Dance, Work Up  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** none
- **Priority:** Sucker Punch 80P Dark (+1)
- **Hazards:** Stealth Rock | **Removal:** none | **Pivot:** none | **Phazing:** none
- **Status:** Toxic
- **Trapping-compatible tactics:** Substitute, Protect, Toxic
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| NU | **48 of 67** | Aerodactyl, Altaria, Articuno-Galar, Basculegion, Brambleghast, Braviary, Bronzong, Decidueye, Dhelmise, Doublade, Flamigo, Flygon, Gligar, Houndstone, _+5 more_ |
| PU | **88 of 110** | Archeops, Bombirdier, Claydol, Corsola-Galar, Cramorant, Dusclops, Golbat, Golurk, Hoopa, Jellicent, Lampent, Mismagius, Ninjask, Oricorio, _+8 more_ |
| ZU | **560 of 677** | Archen, Articuno, Baltoy, Banette, Beautifly, Bramblin, Bronzor, Butterfree, Carnivine, Charizard, Chatot, Chimecho, Chingling, Cofagrigus, _+103 more_ |

**Damage into the PU targets it can trap** — attacker **Dugtrio**, adamant, {"atk":252,"spe":252,"hp":4}, ability **Arena Trap**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped PU target | Earthquake | Double-Edge | Stone Edge |
| --- | --- | --- | --- |
| Absol (physWall) | 192-227 (57.5-68%) | 153-180 (45.8-53.9%) | 128-150 (38.3-44.9%) |
| Alcremie (physWall) | 170-200 (50.9-59.9%) | 135-159 (40.4-47.6%) | 113-132 (33.8-39.5%) |
| Ambipom (physWall) | 182-214 (51.4-60.5%) | 145-171 (41-48.3%) | 120-143 (33.9-40.4%) |
| Arctovish (specWall) | 196-231 (51-60.2%) | 156-184 (40.6-47.9%) | 261-308 (68-80.2%) |
| Aromatisse (physWall) | 174-204 (42.9-50.2%) | 137-162 (33.7-39.9%) | 115-136 (28.3-33.5%) |
| Audino (physWall) | 156-183 (38-44.6%) | 124-145 (30.2-35.4%) | 104-122 (25.4-29.8%) |
| Audino-Mega (physWall) | 120-143 (29.3-34.9%) | 96-113 (23.4-27.6%) | 80-94 (19.5-22.9%) |
| Aurorus (physWall) | 348-409 (77.3-90.9%) | 68-80 (15.1-17.8%) | 231-273 (51.3-60.7%) |
| Avalugg-Hisui (specWall) | 232-273 (58.9-69.3%) | 45-53 (11.4-13.5%) | 154-182 (39.1-46.2%) |
| Bellossom (physWall) | 72-85 (20.3-24%) | 117-137 (33.1-38.7%) | 97-114 (27.4-32.2%) |
| Brute Bonnet (physWall) | 71-83 (16.7-19.5%) | 113-133 (26.5-31.2%) | 94-111 (22.1-26.1%) |
| Bruxish (physWall) | 176-208 (51.8-61.2%) | 140-166 (41.2-48.8%) | 118-139 (34.7-40.9%) |

---

#### Diglett

- **Current tier:** ZU
- **Kind:** species
- **Typing:** Ground | **BST** 265 (10/55/25/35/45/95)
- **Abilities:** Sand Veil / Arena Trap / Sand Force — trapping ability **Arena Trap**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Sand Veil: Atk 209/229, SpA 169/185, Spe 289/317 — Arena Trap: Atk 209/229, SpA 169/185, Spe 289/317 — Sand Force: Atk 209/229, SpA 169/185, Spe 289/317
- **STAB:** Ground Earthquake 100P
- **Physical coverage:** Normal Double-Edge 120P, Rock Stone Edge 100P, Dark Foul Play 95P, Ghost Shadow Claw 70P, Flying Aerial Ace 60P, Fighting Rock Smash 40P
- **Special coverage:** Poison Sludge Bomb 90S, Normal Uproar 90S, Rock Ancient Power 60S, Fighting Final Gambit fixedS
- **Setup:** Agility, Hone Claws, Swords Dance, Work Up  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** none
- **Priority:** Sucker Punch 80P Dark (+1)
- **Hazards:** Stealth Rock | **Removal:** none | **Pivot:** none | **Phazing:** none
- **Status:** Toxic
- **Trapping-compatible tactics:** Substitute, Protect, Toxic
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| PU | **88 of 110** | Archeops, Bombirdier, Claydol, Corsola-Galar, Cramorant, Dusclops, Golbat, Golurk, Hoopa, Jellicent, Lampent, Mismagius, Ninjask, Oricorio, _+8 more_ |
| ZU | **560 of 677** | Archen, Articuno, Baltoy, Banette, Beautifly, Bramblin, Bronzor, Butterfree, Carnivine, Charizard, Chatot, Chimecho, Chingling, Cofagrigus, _+103 more_ |

**Damage into the ZU targets it can trap** — attacker **Diglett**, timid, {"spa":252,"spe":252,"hp":4}, ability **Arena Trap**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped ZU target | Earthquake | Sludge Bomb | Uproar |
| --- | --- | --- | --- |
| Abomasnow (physWall) | 33-40 (8.6-10.4%) | 140-166 (36.5-43.2%) | 70-83 (18.2-21.6%) |
| Abra (physWall) | 132-156 (52-61.4%) | 98-115 (38.6-45.3%) | 98-115 (38.6-45.3%) |
| Accelgor (physWall) | 48-55 (13.2-15.1%) | 92-107 (25.3-29.4%) | 92-107 (25.3-29.4%) |
| Aipom (physWall) | 81-97 (25.8-30.9%) | 98-115 (31.2-36.6%) | 98-115 (31.2-36.6%) |
| Amaura (physWall) | 172-204 (48-57%) | 44-52 (12.3-14.5%) | 44-52 (12.3-14.5%) |
| Ampharos (physWall) | 130-152 (33.9-39.6%) | 66-79 (17.2-20.6%) | 66-79 (17.2-20.6%) |
| Anorith (physWall) | 85-101 (28.9-34.4%) | 52-61 (17.7-20.7%) | 52-61 (17.7-20.7%) |
| Appletun (physWall) | 32-39 (7.5-9.2%) | 148-174 (34.9-41%) | 74-87 (17.5-20.5%) |
| Applin (specWall) | 48-55 (16.9-19.4%) | 148-174 (52.1-61.3%) | 74-87 (26.1-30.6%) |
| Arbok (physWall) | 146-171 (45.1-52.8%) | 36-42 (11.1-13%) | 74-87 (22.8-26.9%) |
| Arboliva (physWall) | 31-36 (8.6-10%) | 114-135 (31.7-37.5%) | 57-67 (15.8-18.6%) |
| Arctibax (specWall) | 111-131 (28.9-34.1%) | 57-67 (14.8-17.4%) | 57-67 (14.8-17.4%) |

---

#### Trapinch

- **Current tier:** ZU
- **Kind:** species
- **Typing:** Ground | **BST** 290 (45/100/45/45/45/10)
- **Abilities:** Hyper Cutter / Arena Trap / Sheer Force — trapping ability **Arena Trap**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Hyper Cutter: Atk 299/328, SpA 189/207, Spe 119/130 — Arena Trap: Atk 299/328, SpA 189/207, Spe 119/130 — Sheer Force: Atk 299/328, SpA 189/207, Spe 119/130
- **STAB:** Ground Earthquake 100P
- **Physical coverage:** Normal Double-Edge 120P, Fighting Superpower 120P, Rock Stone Edge 100P, Bug First Impression 90P, Dark Crunch 80P, Ghost Astonish 30P
- **Special coverage:** Grass Solar Beam 120 (charge)S, Normal Tera Blast 80S, Bug Signal Beam 75S, Flying Gust 40S
- **Setup:** none
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** Giga Drain
- **Priority:** First Impression 90P Bug (+2), Feint 50P Normal (+2), Quick Attack 40P Normal (+1)
- **Hazards:** Stealth Rock | **Removal:** none | **Pivot:** none | **Phazing:** none
- **Status:** Toxic
- **Trapping-compatible tactics:** Substitute, Protect, Toxic
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| PU | **88 of 110** | Archeops, Bombirdier, Claydol, Corsola-Galar, Cramorant, Dusclops, Golbat, Golurk, Hoopa, Jellicent, Lampent, Mismagius, Ninjask, Oricorio, _+8 more_ |
| ZU | **560 of 677** | Archen, Articuno, Baltoy, Banette, Beautifly, Bramblin, Bronzor, Butterfree, Carnivine, Charizard, Chatot, Chimecho, Chingling, Cofagrigus, _+103 more_ |

**Damage into the ZU targets it can trap** — attacker **Trapinch**, adamant, {"atk":252,"spe":252,"hp":4}, ability **Arena Trap**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped ZU target | Earthquake | Double-Edge | Superpower |
| --- | --- | --- | --- |
| Abomasnow (physWall) | 84-100 (21.9-26%) | 135-159 (35.2-41.4%) | 271-319 (70.6-83.1%) |
| Abra (physWall) | 326-384 (128.3-151.2%) | 261-306 (102.8-120.5%) | 130-153 (51.2-60.2%) |
| Accelgor (physWall) | 117-137 (32.1-37.6%) | 188-221 (51.6-60.7%) | 93-110 (25.5-30.2%) |
| Aipom (physWall) | 201-237 (64-75.5%) | 161-189 (51.3-60.2%) | 322-379 (102.5-120.7%) |
| Amaura (physWall) | 425-500 (118.7-139.7%) | 84-98 (23.5-27.4%) | 678-798 (189.4-222.9%) |
| Ampharos (physWall) | 315-371 (82-96.6%) | 124-148 (32.3-38.5%) | 124-148 (32.3-38.5%) |
| Anorith (physWall) | 211-249 (71.8-84.7%) | 84-98 (28.6-33.3%) | 169-198 (57.5-67.3%) |
| Appletun (physWall) | 81-96 (19.1-22.6%) | 130-153 (30.7-36.1%) | 130-153 (30.7-36.1%) |
| Applin (specWall) | 117-137 (41.2-48.2%) | 188-221 (66.2-77.8%) | 188-221 (66.2-77.8%) |
| Arbok (physWall) | 357-419 (110.2-129.3%) | 141-167 (43.5-51.5%) | 70-83 (21.6-25.6%) |
| Arboliva (physWall) | 75-89 (20.8-24.7%) | 120-143 (33.3-39.7%) | 243-286 (67.5-79.4%) |
| Arctibax (specWall) | 274-323 (71.4-84.1%) | 218-257 (56.8-66.9%) | 438-516 (114.1-134.4%) |

---
## G. Magnet Pull holders

**Live effect:** the foe cannot switch out **if it is a Steel type**. Steel/Ghost escapes anyway, because the Ghost branch is checked first.

**Tiered holders: 9.**

#### Magnezone

- **Current tier:** RU
- **Kind:** species
- **Typing:** Electric/Steel | **BST** 535 (70/70/115/130/90/60)
- **Abilities:** Magnet Pull / Sturdy / Analytic — trapping ability **Magnet Pull**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Magnet Pull: Atk 239/262, SpA 359/394, Spe 219/240 — Sturdy: Atk 239/262, SpA 359/394, Spe 219/240 — Analytic: Atk 239/262, SpA 359/394, Spe 219/240
- **STAB:** Electric Thunder 120S · Steel Steel Beam 140S
- **Physical coverage:** Normal Explosion 250P, Fighting Body Press 80P, Rock Rollout 30P
- **Special coverage:** Normal Tera Blast 80S, Bug Signal Beam 75S, Psychic Mirror Coat fixedS
- **Setup:** Barrier, Charge, Iron Defense  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** none
- **Priority:** none
- **Hazards:** none | **Removal:** none | **Pivot:** Teleport, Volt Switch | **Phazing:** none
- **Status:** Thunder Wave, Toxic
- **Trapping-compatible tactics:** Substitute, Protect, Toxic
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| UU | **13 of 91** | Aegislash, Aegislash-Blade, Aerodactyl-Mega, Alakazam, Altaria-Mega, Amoonguss, Azumarill, Blacephalon, Blissey, Buzzwole, Chandelure, Chandelure-Mega, Chansey, Clefable, _+64 more_ |
| RU | **15 of 131** | Absol-Mega, Absol-Mega-Z, Ampharos-Mega, Arcanine-Hisui, Arctozolt, Armarouge, Azelf, Banette-Mega, Barbaracle, Barraskewda, Beedrill-Mega, Bewear, Blastoise, Breloom, _+102 more_ |
| NU | **6 of 67** | Abomasnow-Mega, Aerodactyl, Altaria, Araquanid, Arcanine, Articuno-Galar, Avalugg, Basculegion, Bellibolt, Brambleghast, Braviary, Cinccino, Decidueye, Decidueye-Hisui, _+47 more_ |

**Damage into the RU targets it can trap** — attacker **Magnezone**, timid, {"spa":252,"spe":252,"hp":4}, ability **Magnet Pull**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped RU target | Thunder | Steel Beam | Tera Blast |
| --- | --- | --- | --- |
| Aggron-Mega (specWall) | 214-252 (62.2-73.3%) | 124-145 (36-42.2%) | 46-55 (13.4-16%) |
| Chimecho-Mega (physWall) | 219-258 (61.9-72.9%) | 127-150 (35.9-42.4%) | 48-57 (13.6-16.1%) |
| Cobalion (specWall) | 227-267 (58.8-69.2%) | 132-156 (34.2-40.4%) | 50-59 (13-15.3%) |
| Copperajah (physWall) | 347-408 (77.5-91.1%) | 201-237 (44.9-52.9%) | 76-91 (17-20.3%) |
| Duraludon (specWall) | 139-162 (40.4-47.1%) | 161-189 (46.8-54.9%) | 61-72 (17.7-20.9%) |
| Durant (specWall) | 283-332 (88.4-103.8%) | 165-193 (51.6-60.3%) | 62-74 (19.4-23.1%) |
| Empoleon (physWall) | 509-600 (136.8-161.3%) | 74-87 (19.9-23.4%) | 55-66 (14.8-17.7%) |
| Forretress (specWall) | 252-297 (71.2-83.9%) | 146-172 (41.2-48.6%) | 55-66 (15.5-18.6%) |
| Lucario (physWall) | 343-404 (99.7-117.4%) | 200-235 (58.1-68.3%) | 76-89 (22.1-25.9%) |
| Registeel (physWall) | 180-213 (49.5-58.5%) | 105-123 (28.8-33.8%) | 40-46 (11-12.6%) |
| Revavroom (specWall) | 236-279 (64.8-76.6%) | 137-162 (37.6-44.5%) | 52-62 (14.3-17%) |
| Steelix (specWall) | 0-0 (0-0%) | 140-165 (39.5-46.6%) | 53-63 (15-17.8%) |

---

#### Magneton

- **Current tier:** NU
- **Kind:** species
- **Typing:** Electric/Steel | **BST** 465 (50/60/95/120/70/70)
- **Abilities:** Magnet Pull / Sturdy / Analytic — trapping ability **Magnet Pull**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Magnet Pull: Atk 219/240, SpA 339/372, Spe 239/262 — Sturdy: Atk 219/240, SpA 339/372, Spe 239/262 — Analytic: Atk 219/240, SpA 339/372, Spe 239/262
- **STAB:** Electric Thunder 120S · Steel Steel Beam 140S
- **Physical coverage:** Normal Explosion 250P, Rock Rollout 30P
- **Special coverage:** Normal Tera Blast 80S, Bug Signal Beam 75S
- **Setup:** Charge, Iron Defense  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** none
- **Priority:** none
- **Hazards:** none | **Removal:** none | **Pivot:** Teleport, Volt Switch | **Phazing:** none
- **Status:** Thunder Wave, Toxic
- **Trapping-compatible tactics:** Substitute, Protect, Toxic
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| RU | **15 of 131** | Absol-Mega, Absol-Mega-Z, Ampharos-Mega, Arcanine-Hisui, Arctozolt, Armarouge, Azelf, Banette-Mega, Barbaracle, Barraskewda, Beedrill-Mega, Bewear, Blastoise, Breloom, _+102 more_ |
| NU | **6 of 67** | Abomasnow-Mega, Aerodactyl, Altaria, Araquanid, Arcanine, Articuno-Galar, Avalugg, Basculegion, Bellibolt, Brambleghast, Braviary, Cinccino, Decidueye, Decidueye-Hisui, _+47 more_ |
| PU | **4 of 110** | Absol, Alcremie, Ambipom, Archeops, Arctovish, Aromatisse, Audino, Audino-Mega, Aurorus, Avalugg-Hisui, Bellossom, Bombirdier, Brute Bonnet, Bruxish, _+92 more_ |

**Damage into the NU targets it can trap** — attacker **Magneton**, timid, {"spa":252,"spe":252,"hp":4}, ability **Magnet Pull**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped NU target | Thunder | Steel Beam | Tera Blast |
| --- | --- | --- | --- |
| Aggron (specWall) | 239-280 (69.5-81.4%) | 278-327 (80.8-95.1%) | 26-31 (7.6-9%) |
| Bronzong (physWall) | 214-252 (63.3-74.6%) | 124-146 (36.7-43.2%) | 46-55 (13.6-16.3%) |
| Escavalier (physWall) | 232-274 (67.4-79.7%) | 135-159 (39.2-46.2%) | 52-61 (15.1-17.7%) |
| Klefki (specWall) | 191-224 (60.1-70.4%) | 222-262 (69.8-82.4%) | 42-49 (13.2-15.4%) |
| Stakataka (specWall) | 174-204 (53.4-62.6%) | 202-237 (62-72.7%) | 19-22 (5.8-6.7%) |

---

#### Geodude-Alola

- **Current tier:** ZU
- **Kind:** species
- **Typing:** Rock/Electric | **BST** 300 (40/80/100/30/30/20)
- **Abilities:** Magnet Pull / Sturdy / Galvanize — trapping ability **Magnet Pull**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Magnet Pull: Atk 259/284, SpA 159/174, Spe 139/152 — Sturdy: Atk 259/284, SpA 159/174, Spe 139/152 — Galvanize: Atk 259/284, SpA 159/174, Spe 139/152
- **STAB:** Rock Stone Edge 100P · Electric Supercell Slam 100P
- **Physical coverage:** Normal Explosion 250P, Fighting Focus Punch 150P, Ground Earthquake 100P, Dark Sucker Punch 80P, Fire Fire Punch 75P, Steel Gyro Ball 49P
- **Special coverage:** Fire Fire Blast 120S, Ground Earth Power 90S, Normal Tera Blast 80S
- **Setup:** Autotomize, Charge, Defense Curl, Harden, Iron Defense, Rock Polish  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** none
- **Priority:** Sucker Punch 80P Dark (+1)
- **Hazards:** Stealth Rock | **Removal:** none | **Pivot:** Volt Switch | **Phazing:** none
- **Status:** Thunder Wave, Toxic
- **Trapping-compatible tactics:** Substitute, Protect, Toxic
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| PU | **4 of 110** | Absol, Alcremie, Ambipom, Archeops, Arctovish, Aromatisse, Audino, Audino-Mega, Aurorus, Avalugg-Hisui, Bellossom, Bombirdier, Brute Bonnet, Bruxish, _+92 more_ |
| ZU | **26 of 677** | Abomasnow, Abra, Accelgor, Aipom, Amaura, Ampharos, Anorith, Appletun, Applin, Arbok, Arboliva, Archen, Arctibax, Ariados, _+637 more_ |

**Damage into the ZU targets it can trap** — attacker **Geodude-Alola**, adamant, {"atk":252,"spe":252,"hp":4}, ability **Magnet Pull**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped ZU target | Stone Edge | Supercell Slam | Explosion |
| --- | --- | --- | --- |
| Aron (specWall) | 84-100 (27.6-32.9%) | 170-200 (55.9-65.8%) | 139-163 (45.7-53.6%) |
| Bastiodon (specWall) | 54-63 (16.7-19.4%) | 109-128 (33.6-39.5%) | 88-104 (27.2-32.1%) |
| Beldum (specWall) | 101-119 (35.6-41.9%) | 204-240 (71.8-84.5%) | 336-396 (118.3-139.4%) |
| Bronzor (physWall) | 67-79 (21.1-24.8%) | 135-159 (42.5-50%) | 221-261 (69.5-82.1%) |
| Cufant (physWall) | 92-109 (26.4-31.3%) | 185-218 (53.2-62.6%) | 305-360 (87.6-103.4%) |
| Diglett-Alola (physWall) | 57-67 (25.4-29.9%) | 0-0 (0-0%) | 379-445 (169.2-198.7%) |
| Dugtrio-Alola (physWall) | 41-49 (15-17.9%) | 0-0 (0-0%) | 275-323 (100.4-117.9%) |
| Ferroseed (specWall) | 92-107 (31.5-36.6%) | 92-107 (31.5-36.6%) | 302-356 (103.4-121.9%) |
| Klang (specWall) | 88-104 (27.2-32.1%) | 178-209 (54.9-64.5%) | 292-343 (90.1-105.9%) |
| Klink (specWall) | 113-133 (39.8-46.8%) | 227-267 (79.9-94%) | 374-440 (131.7-154.9%) |
| Klinklang (specWall) | 75-88 (23.1-27.2%) | 150-178 (46.3-54.9%) | 248-292 (76.5-90.1%) |
| Magnemite (specWall) | 113-133 (44.5-52.4%) | 113-133 (44.5-52.4%) | 374-440 (147.2-173.2%) |

---

#### Golem-Alola

- **Current tier:** ZU
- **Kind:** species
- **Typing:** Rock/Electric | **BST** 495 (80/120/130/55/65/45)
- **Abilities:** Magnet Pull / Sturdy / Galvanize — trapping ability **Magnet Pull**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Magnet Pull: Atk 339/372, SpA 209/229, Spe 189/207 — Sturdy: Atk 339/372, SpA 209/229, Spe 189/207 — Galvanize: Atk 339/372, SpA 209/229, Spe 189/207
- **STAB:** Rock Stone Edge 100P · Electric Supercell Slam 100P
- **Physical coverage:** Normal Explosion 250P, Fighting Focus Punch 150P, Steel Heavy Slam 120P, Ground Earthquake 100P, Dark Sucker Punch 80P, Fire Fire Punch 75P
- **Special coverage:** Fire Fire Blast 120S, Fighting Focus Blast 120S, Ground Earth Power 90S, Normal Tera Blast 80S
- **Setup:** Autotomize, Charge, Defense Curl, Harden, Iron Defense, Rock Polish  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** none
- **Priority:** Sucker Punch 80P Dark (+1)
- **Hazards:** Stealth Rock | **Removal:** none | **Pivot:** Volt Switch | **Phazing:** Roar
- **Status:** Thunder Wave, Toxic
- **Trapping-compatible tactics:** Substitute, Protect, Toxic
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| PU | **4 of 110** | Absol, Alcremie, Ambipom, Archeops, Arctovish, Aromatisse, Audino, Audino-Mega, Aurorus, Avalugg-Hisui, Bellossom, Bombirdier, Brute Bonnet, Bruxish, _+92 more_ |
| ZU | **26 of 677** | Abomasnow, Abra, Accelgor, Aipom, Amaura, Ampharos, Anorith, Appletun, Applin, Arbok, Arboliva, Archen, Arctibax, Ariados, _+637 more_ |

**Damage into the ZU targets it can trap** — attacker **Golem-Alola**, adamant, {"atk":252,"spe":252,"hp":4}, ability **Magnet Pull**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped ZU target | Stone Edge | Supercell Slam | Explosion |
| --- | --- | --- | --- |
| Aron (specWall) | 110-130 (36.2-42.8%) | 222-261 (73-85.9%) | 183-215 (60.2-70.7%) |
| Bastiodon (specWall) | 70-83 (21.6-25.6%) | 141-167 (43.5-51.5%) | 115-136 (35.5-42%) |
| Beldum (specWall) | 132-157 (46.5-55.3%) | 266-314 (93.7-110.6%) | 440-518 (154.9-182.4%) |
| Bronzor (physWall) | 88-104 (27.7-32.7%) | 176-208 (55.3-65.4%) | 289-341 (90.9-107.2%) |
| Cufant (physWall) | 120-143 (34.5-41.1%) | 241-286 (69.3-82.2%) | 400-470 (114.9-135.1%) |
| Diglett-Alola (physWall) | 74-88 (33-39.3%) | 0-0 (0-0%) | 496-583 (221.4-260.3%) |
| Dugtrio-Alola (physWall) | 54-63 (19.7-23%) | 0-0 (0-0%) | 360-423 (131.4-154.4%) |
| Ferroseed (specWall) | 119-141 (40.8-48.3%) | 119-141 (40.8-48.3%) | 396-466 (135.6-159.6%) |
| Klang (specWall) | 115-136 (35.5-42%) | 231-273 (71.3-84.3%) | 382-449 (117.9-138.6%) |
| Klink (specWall) | 148-174 (52.1-61.3%) | 296-349 (104.2-122.9%) | 491-577 (172.9-203.2%) |
| Klinklang (specWall) | 98-115 (30.2-35.5%) | 197-232 (60.8-71.6%) | 325-382 (100.3-117.9%) |
| Magnemite (specWall) | 148-174 (58.3-68.5%) | 148-174 (58.3-68.5%) | 491-577 (193.3-227.2%) |

---

#### Graveler-Alola

- **Current tier:** ZU
- **Kind:** species
- **Typing:** Rock/Electric | **BST** 390 (55/95/115/45/45/35)
- **Abilities:** Magnet Pull / Sturdy / Galvanize — trapping ability **Magnet Pull**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Magnet Pull: Atk 289/317, SpA 189/207, Spe 169/185 — Sturdy: Atk 289/317, SpA 189/207, Spe 169/185 — Galvanize: Atk 289/317, SpA 189/207, Spe 169/185
- **STAB:** Rock Stone Edge 100P · Electric Supercell Slam 100P
- **Physical coverage:** Normal Explosion 250P, Fighting Focus Punch 150P, Ground Earthquake 100P, Steel Hard Press 100P, Dark Sucker Punch 80P, Fire Fire Punch 75P
- **Special coverage:** Fire Fire Blast 120S, Fighting Focus Blast 120S, Ground Earth Power 90S, Normal Tera Blast 80S
- **Setup:** Autotomize, Charge, Defense Curl, Harden, Iron Defense, Rock Polish  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** none
- **Priority:** Sucker Punch 80P Dark (+1)
- **Hazards:** Stealth Rock | **Removal:** none | **Pivot:** Volt Switch | **Phazing:** none
- **Status:** Thunder Wave, Toxic
- **Trapping-compatible tactics:** Substitute, Protect, Toxic
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| PU | **4 of 110** | Absol, Alcremie, Ambipom, Archeops, Arctovish, Aromatisse, Audino, Audino-Mega, Aurorus, Avalugg-Hisui, Bellossom, Bombirdier, Brute Bonnet, Bruxish, _+92 more_ |
| ZU | **26 of 677** | Abomasnow, Abra, Accelgor, Aipom, Amaura, Ampharos, Anorith, Appletun, Applin, Arbok, Arboliva, Archen, Arctibax, Ariados, _+637 more_ |

**Damage into the ZU targets it can trap** — attacker **Graveler-Alola**, adamant, {"atk":252,"spe":252,"hp":4}, ability **Magnet Pull**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped ZU target | Stone Edge | Supercell Slam | Explosion |
| --- | --- | --- | --- |
| Aron (specWall) | 94-111 (30.9-36.5%) | 189-223 (62.2-73.4%) | 156-183 (51.3-60.2%) |
| Bastiodon (specWall) | 59-71 (18.2-21.9%) | 120-143 (37-44.1%) | 98-115 (30.2-35.5%) |
| Beldum (specWall) | 113-133 (39.8-46.8%) | 227-267 (79.9-94%) | 375-442 (132-155.6%) |
| Bronzor (physWall) | 75-88 (23.6-27.7%) | 150-178 (47.2-56%) | 247-291 (77.7-91.5%) |
| Cufant (physWall) | 102-120 (29.3-34.5%) | 206-243 (59.2-69.8%) | 340-401 (97.7-115.2%) |
| Diglett-Alola (physWall) | 63-75 (28.1-33.5%) | 0-0 (0-0%) | 423-497 (188.8-221.9%) |
| Dugtrio-Alola (physWall) | 46-54 (16.8-19.7%) | 0-0 (0-0%) | 306-361 (111.7-131.8%) |
| Ferroseed (specWall) | 102-120 (34.9-41.1%) | 102-120 (34.9-41.1%) | 338-397 (115.8-136%) |
| Klang (specWall) | 98-115 (30.2-35.5%) | 197-232 (60.8-71.6%) | 326-383 (100.6-118.2%) |
| Klink (specWall) | 126-148 (44.4-52.1%) | 253-297 (89.1-104.6%) | 418-492 (147.2-173.2%) |
| Klinklang (specWall) | 84-98 (25.9-30.2%) | 169-198 (52.2-61.1%) | 276-326 (85.2-100.6%) |
| Magnemite (specWall) | 126-148 (49.6-58.3%) | 126-148 (49.6-58.3%) | 418-492 (164.6-193.7%) |

---

#### Magnemite

- **Current tier:** ZU
- **Kind:** species
- **Typing:** Electric/Steel | **BST** 325 (25/35/70/95/55/45)
- **Abilities:** Magnet Pull / Sturdy / Analytic — trapping ability **Magnet Pull**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Magnet Pull: Atk 169/185, SpA 289/317, Spe 189/207 — Sturdy: Atk 169/185, SpA 289/317, Spe 189/207 — Analytic: Atk 169/185, SpA 289/317, Spe 189/207
- **STAB:** Electric Thunder 120S · Steel Steel Beam 140S
- **Physical coverage:** Normal Explosion 250P, Rock Rollout 30P
- **Special coverage:** Normal Tera Blast 80S, Bug Signal Beam 75S
- **Setup:** Charge, Iron Defense  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** none
- **Priority:** none
- **Hazards:** none | **Removal:** none | **Pivot:** Teleport, Volt Switch | **Phazing:** none
- **Status:** Thunder Wave, Toxic
- **Trapping-compatible tactics:** Substitute, Protect, Toxic
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| PU | **4 of 110** | Absol, Alcremie, Ambipom, Archeops, Arctovish, Aromatisse, Audino, Audino-Mega, Aurorus, Avalugg-Hisui, Bellossom, Bombirdier, Brute Bonnet, Bruxish, _+92 more_ |
| ZU | **26 of 677** | Abomasnow, Abra, Accelgor, Aipom, Amaura, Ampharos, Anorith, Appletun, Applin, Arbok, Arboliva, Archen, Arctibax, Ariados, _+637 more_ |

**Damage into the ZU targets it can trap** — attacker **Magnemite**, timid, {"spa":252,"spe":252,"hp":4}, ability **Magnet Pull**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped ZU target | Thunder | Steel Beam | Tera Blast |
| --- | --- | --- | --- |
| Aron (specWall) | 249-292 (81.9-96.1%) | 289-303 (95.1-99.7%) | 27-32 (8.9-10.5%) |
| Bastiodon (specWall) | 119-141 (36.7-43.5%) | 139-163 (42.9-50.3%) | 13-15 (4-4.6%) |
| Beldum (specWall) | 204-240 (71.8-84.5%) | 118-139 (41.5-48.9%) | 45-53 (15.8-18.7%) |
| Bronzor (physWall) | 235-276 (73.9-86.8%) | 136-161 (42.8-50.6%) | 52-61 (16.4-19.2%) |
| Cufant (physWall) | 362-427 (104-122.7%) | 210-248 (60.3-71.3%) | 80-94 (23-27%) |
| Diglett-Alola (physWall) | 0-0 (0-0%) | 224-263 (100-117.4%) | 85-101 (37.9-45.1%) |
| Dugtrio-Alola (physWall) | 0-0 (0-0%) | 161-189 (58.8-69%) | 61-72 (22.3-26.3%) |
| Ferroseed (specWall) | 81-96 (27.7-32.9%) | 94-113 (32.2-38.7%) | 36-42 (12.3-14.4%) |
| Klang (specWall) | 166-196 (51.2-60.5%) | 96-113 (29.6-34.9%) | 36-42 (11.1-13%) |
| Klink (specWall) | 204-240 (71.8-84.5%) | 118-139 (41.5-48.9%) | 45-53 (15.8-18.7%) |
| Klinklang (specWall) | 166-196 (51.2-60.5%) | 96-113 (29.6-34.9%) | 36-42 (11.1-13%) |
| Mawile (specWall) | 213-250 (70.1-82.2%) | 248-292 (81.6-96.1%) | 46-55 (15.1-18.1%) |

---

#### Meltan

- **Current tier:** ZU
- **Kind:** species
- **Typing:** Steel | **BST** 300 (46/65/65/55/35/34)
- **Abilities:** Magnet Pull — trapping ability **Magnet Pull**, **FORCED (its only ability)**
- **Item:** free
- **Engine offence @252 (neutral/+):** Magnet Pull: Atk 229/251, SpA 209/229, Spe 167/183
- **STAB:** Steel Steel Beam 140S
- **Physical coverage:** Normal Facade 70P
- **Special coverage:** Electric Thunderbolt 95S, Normal Round 60S
- **Setup:** Acid Armor, Harden, Iron Defense  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** none
- **Priority:** none
- **Hazards:** none | **Removal:** none | **Pivot:** none | **Phazing:** none
- **Status:** Thunder Wave, Toxic
- **Trapping-compatible tactics:** Substitute, Protect, Toxic
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| PU | **4 of 110** | Absol, Alcremie, Ambipom, Archeops, Arctovish, Aromatisse, Audino, Audino-Mega, Aurorus, Avalugg-Hisui, Bellossom, Bombirdier, Brute Bonnet, Bruxish, _+92 more_ |
| ZU | **26 of 677** | Abomasnow, Abra, Accelgor, Aipom, Amaura, Ampharos, Anorith, Appletun, Applin, Arbok, Arboliva, Archen, Arctibax, Ariados, _+637 more_ |

**Damage into the ZU targets it can trap** — attacker **Meltan**, timid, {"spa":252,"spe":252,"hp":4}, ability **Magnet Pull**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped ZU target | Steel Beam | Thunderbolt | Round |
| --- | --- | --- | --- |
| Aron (specWall) | 210-248 (69.1-81.6%) | 96-113 (31.6-37.2%) | 14-16 (4.6-5.3%) |
| Bastiodon (specWall) | 101-119 (31.2-36.7%) | 46-54 (14.2-16.7%) | 6-7 (1.9-2.2%) |
| Beldum (specWall) | 85-101 (29.9-35.6%) | 78-92 (27.5-32.4%) | 24-28 (8.5-9.9%) |
| Bronzor (physWall) | 98-117 (30.8-36.8%) | 89-106 (28-33.3%) | 28-33 (8.8-10.4%) |
| Cufant (physWall) | 153-180 (44-51.7%) | 139-163 (39.9-46.8%) | 44-52 (12.6-14.9%) |
| Diglett-Alola (physWall) | 162-191 (72.3-85.3%) | 0-0 (0-0%) | 46-54 (20.5-24.1%) |
| Dugtrio-Alola (physWall) | 117-137 (42.7-50%) | 0-0 (0-0%) | 33-39 (12-14.2%) |
| Ferroseed (specWall) | 68-81 (23.3-27.7%) | 31-36 (10.6-12.3%) | 19-23 (6.5-7.9%) |
| Klang (specWall) | 70-81 (21.6-25%) | 63-75 (19.4-23.1%) | 20-23 (6.2-7.1%) |
| Klink (specWall) | 85-101 (29.9-35.6%) | 78-92 (27.5-32.4%) | 24-28 (8.5-9.9%) |
| Klinklang (specWall) | 70-81 (21.6-25%) | 63-75 (19.4-23.1%) | 20-23 (6.2-7.1%) |
| Magnemite (specWall) | 44-52 (17.3-20.5%) | 40-48 (15.7-18.9%) | 26-29 (10.2-11.4%) |

---

#### Nosepass

- **Current tier:** ZU
- **Kind:** species
- **Typing:** Rock | **BST** 375 (30/45/135/45/90/30)
- **Abilities:** Sturdy / Magnet Pull / Sand Force — trapping ability **Magnet Pull**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Sturdy: Atk 189/207, SpA 189/207, Spe 159/174 — Magnet Pull: Atk 189/207, SpA 189/207, Spe 159/174 — Sand Force: Atk 189/207, SpA 189/207, Spe 159/174
- **STAB:** Rock Head Smash 150P
- **Physical coverage:** Normal Explosion 250P, Fighting Dynamic Punch 100P, Ground Earthquake 100P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
- **Special coverage:** Steel Steel Beam 140S, Electric Thunder 120S, Ground Earth Power 90S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S
- **Setup:** Defense Curl, Harden, Iron Defense, Rock Polish  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** none
- **Priority:** none
- **Hazards:** Stealth Rock | **Removal:** none | **Pivot:** Volt Switch | **Phazing:** none
- **Status:** Thunder Wave, Toxic
- **Trapping-compatible tactics:** Taunt, Substitute, Protect, Toxic
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| PU | **4 of 110** | Absol, Alcremie, Ambipom, Archeops, Arctovish, Aromatisse, Audino, Audino-Mega, Aurorus, Avalugg-Hisui, Bellossom, Bombirdier, Brute Bonnet, Bruxish, _+92 more_ |
| ZU | **26 of 677** | Abomasnow, Abra, Accelgor, Aipom, Amaura, Ampharos, Anorith, Appletun, Applin, Arbok, Arboliva, Archen, Arctibax, Ariados, _+637 more_ |

**Damage into the ZU targets it can trap** — attacker **Nosepass**, timid, {"spa":252,"spe":252,"hp":4}, ability **Magnet Pull**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped ZU target | Head Smash | Steel Beam | Thunder |
| --- | --- | --- | --- |
| Aron (specWall) | 50-59 (16.4-19.4%) | 127-149 (41.8-49%) | 109-128 (35.9-42.1%) |
| Bastiodon (specWall) | 32-39 (9.9-12%) | 61-71 (18.8-21.9%) | 53-62 (16.4-19.1%) |
| Beldum (specWall) | 61-71 (21.5-25%) | 52-61 (18.3-21.5%) | 89-105 (31.3-37%) |
| Bronzor (physWall) | 40-48 (12.6-15.1%) | 59-70 (18.6-22%) | 102-120 (32.1-37.7%) |
| Cufant (physWall) | 55-65 (15.8-18.7%) | 92-107 (26.4-30.7%) | 158-187 (45.4-53.7%) |
| Diglett-Alola (physWall) | 33-40 (14.7-17.9%) | 97-115 (43.3-51.3%) | 0-0 (0-0%) |
| Dugtrio-Alola (physWall) | 24-28 (8.8-10.2%) | 70-83 (25.5-30.3%) | 0-0 (0-0%) |
| Ferroseed (specWall) | 54-65 (18.5-22.3%) | 41-49 (14-16.8%) | 36-41 (12.3-14%) |
| Klang (specWall) | 53-62 (16.4-19.1%) | 41-49 (12.7-15.1%) | 72-85 (22.2-26.2%) |
| Klink (specWall) | 67-80 (23.6-28.2%) | 52-61 (18.3-21.5%) | 89-105 (31.3-37%) |
| Klinklang (specWall) | 45-53 (13.9-16.4%) | 41-49 (12.7-15.1%) | 72-85 (22.2-26.2%) |
| Magnemite (specWall) | 67-80 (26.4-31.5%) | 27-31 (10.6-12.2%) | 46-54 (18.1-21.3%) |

---

#### Probopass

- **Current tier:** ZU
- **Kind:** species
- **Typing:** Rock/Steel | **BST** 525 (60/55/145/75/150/40)
- **Abilities:** Sturdy / Magnet Pull / Sand Force — trapping ability **Magnet Pull**, optional
- **Item:** free
- **Engine offence @252 (neutral/+):** Sturdy: Atk 209/229, SpA 249/273, Spe 179/196 — Magnet Pull: Atk 209/229, SpA 249/273, Spe 179/196 — Sand Force: Atk 209/229, SpA 249/273, Spe 179/196
- **STAB:** Rock Head Smash 150P · Steel Steel Beam 140S
- **Physical coverage:** Normal Explosion 250P, Fighting Dynamic Punch 100P, Ground Earthquake 100P, Electric Supercell Slam 100P, Fire Fire Punch 75P, Ice Ice Punch 75P
- **Special coverage:** Electric Thunder 120S, Ground Earth Power 90S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S
- **Setup:** Defense Curl, Harden, Iron Defense, Rock Polish  ← **trapping + setup: the trapped target becomes setup fodder**
- **Reliable recovery:** Rest | **Rest:** yes | **Drain:** none
- **Priority:** none
- **Hazards:** Stealth Rock | **Removal:** none | **Pivot:** Volt Switch | **Phazing:** none
- **Status:** Thunder Wave, Toxic
- **Trapping-compatible tactics:** Taunt, Substitute, Protect, Toxic
- **Transformation routes:** none

**Who it can trap, per tier** (every roster entry put through the real engine):

| Tier | Trapped | Escapes |
| --- | --- | --- |
| PU | **4 of 110** | Absol, Alcremie, Ambipom, Archeops, Arctovish, Aromatisse, Audino, Audino-Mega, Aurorus, Avalugg-Hisui, Bellossom, Bombirdier, Brute Bonnet, Bruxish, _+92 more_ |
| ZU | **26 of 677** | Abomasnow, Abra, Accelgor, Aipom, Amaura, Ampharos, Anorith, Appletun, Applin, Arbok, Arboliva, Archen, Arctibax, Ariados, _+637 more_ |

**Damage into the ZU targets it can trap** — attacker **Probopass**, timid, {"spa":252,"spe":252,"hp":4}, ability **Magnet Pull**, Life Orb; defenders are 252 HP / 252 in the matching defence with Leftovers. **Representative test sets.**

| Trapped ZU target | Head Smash | Steel Beam | Thunder |
| --- | --- | --- | --- |
| Aron (specWall) | 58-68 (19.1-22.4%) | 250-295 (82.2-97%) | 143-169 (47-55.6%) |
| Bastiodon (specWall) | 37-44 (11.4-13.6%) | 120-141 (37-43.5%) | 68-80 (21-24.7%) |
| Beldum (specWall) | 70-83 (24.6-29.2%) | 102-120 (35.9-42.3%) | 117-137 (41.2-48.2%) |
| Bronzor (physWall) | 46-55 (14.5-17.3%) | 118-139 (37.1-43.7%) | 135-158 (42.5-49.7%) |
| Cufant (physWall) | 63-75 (18.1-21.6%) | 182-214 (52.3-61.5%) | 208-245 (59.8-70.4%) |
| Diglett-Alola (physWall) | 39-46 (17.4-20.5%) | 193-227 (86.2-101.3%) | 0-0 (0-0%) |
| Dugtrio-Alola (physWall) | 28-33 (10.2-12%) | 139-163 (50.7-59.5%) | 0-0 (0-0%) |
| Ferroseed (specWall) | 63-75 (21.6-25.7%) | 81-97 (27.7-33.2%) | 46-55 (15.8-18.8%) |
| Klang (specWall) | 61-72 (18.8-22.2%) | 83-97 (25.6-29.9%) | 96-113 (29.6-34.9%) |
| Klink (specWall) | 79-92 (27.8-32.4%) | 102-120 (35.9-42.3%) | 117-137 (41.2-48.2%) |
| Klinklang (specWall) | 52-62 (16-19.1%) | 83-97 (25.6-29.9%) | 96-113 (29.6-34.9%) |
| Magnemite (specWall) | 79-92 (31.1-36.2%) | 53-62 (20.9-24.4%) | 61-71 (24-28%) |

---
## H. Other trapping abilities

**None.** The behavioural sweep of the ability registry found exactly
3 abilities defining an `onTrapped` hook, and they are the three
above. There are no custom, legacy, renamed, Mega-exclusive, forme-exclusive or
partial trapping abilities in this build.

Non-ability trapping — which no tier decision here depends on, but which shares
the same predicate — comes from **Fairy Lock**, the partial-trapping moves
(Wrap, Bind, Fire Spin, Clamp — reworked in this project into 2-5 hit attacks
that still trap), **Mean Look / Block / Spider Web**, **Ingrain** and **Octolock**.

---
## I. Tier-by-tier defensive structures

The power band each holder is being judged against. Mechanical summaries — no
usage is implied.

### Ubers — 63 entries

- **Speed ceiling:** Garchomp-Mega-Z 441, Lucario-Mega-Z 441, Calyrex-Shadow 438, Deoxys-Attack 438, Zacian-Crowned 434, Mewtwo-Mega-Y 416
- **Bulkiest (HP/Def/SpD):** Zygarde-Complete (216/121/95), Zygarde-Mega (216/91/85), Giratina (150/120/120), Zamazenta-Crowned (92/145/145), Calyrex-Ice (100/150/130), Arceus (120/120/120), Giratina-Origin (150/100/100), Groudon-Primal (100/160/90)
- **Ghost types (immune to ability trapping):** Calyrex-Shadow, Flutter Mane, Gengar-Mega, Giratina, Giratina-Origin
- **Steel types (Magnet Pull targets):** Dialga-Origin, Genesect, Heatran-Mega, Lucario-Mega-Z, Magearna, Magearna-Mega, Necrozma-Dusk-Mane, Zacian-Crowned, Zamazenta-Crowned
- **Guard Dog / trap-immune:** none
- **Levitate (escapes Arena Trap):** Garchomp-Mega-Z, Giratina-Origin
- **Regenerator pivots:** Ho-Oh
- **Unaware:** none | **Magic Bounce:** none
- **Pivot-move users (escape any trap):** 26 of 63 — Blaziken-Mega, Calyrex-Ice, Calyrex-Shadow, Darmanitan-Galar, Darmanitan-Galar-Zen, Deoxys-Attack, Espathra, Genesect, Iron Bundle, Koraidon, Landorus, Magearna, Magearna-Mega, Mewtwo, Mewtwo-Mega-X, Mewtwo-Mega-Y, Miraidon, Palafin-Hero, Rayquaza, Rayquaza-Mega, _+6 more_

### OU — 93 entries

- **Speed ceiling:** Deoxys-Speed 504, Zeraora-Mega 445, Pheromosa 441, Alakazam-Mega 438, Deoxys 438, Dragapult 421
- **Bulkiest (HP/Def/SpD):** Lugia (106/130/154), Chesnaught-Mega (88/172/115), Ting-Lu (165/130/80), Golisopod-Mega (75/175/120), Tyranitar-Mega (100/150/120), Toxapex (50/152/142), Melmetal (135/143/65), Metagross-Mega (80/150/110)
- **Ghost types (immune to ability trapping):** Annihilape, Ceruledge, Dragapult, Gholdengo, Lunala, Marshadow, Necrozma-Dawn-Wings, Spectrier
- **Steel types (Magnet Pull targets):** Dialga, Excadrill-Mega, Ferrothorn, Gholdengo, Golisopod-Mega, Heatran, Kartana, Kingambit, Lucario-Mega, Mawile-Mega, Melmetal, Metagross-Mega, Scizor-Mega, Solgaleo
- **Guard Dog / trap-immune:** none
- **Levitate (escapes Arena Trap):** Latios, Latios-Mega
- **Regenerator pivots:** Alomomola, Slowking-Galar, Tornadus-Therian, Toxapex
- **Unaware:** Clodsire, Dondozo | **Magic Bounce:** Clefable-Mega, Diancie-Mega
- **Pivot-move users (escape any trap):** 49 of 93 — Alakazam-Mega, Alomomola, Annihilape, Blastoise-Mega, Blaziken, Cinderace, Clefable-Mega, Deoxys, Deoxys-Speed, Diancie-Mega, Dragapult, Feraligatr-Mega, Floette-Mega, Gallade-Mega, Gliscor, Greninja, Greninja-Ash, Greninja-Mega, Hawlucha-Mega, Iron Hands, _+29 more_

### UU — 91 entries

- **Speed ceiling:** Regieleki 548, Aerodactyl-Mega 438, Zeraora 423, Delphox-Mega 403, Raichu-Mega-Y 394, Pyroar-Mega 386
- **Bulkiest (HP/Def/SpD):** Blissey (255/10/135), Aegislash (60/150/150), Chansey (250/5/105), Slowbro-Mega (95/180/80), Latias-Mega (80/120/150), Pecharunt (88/160/88), Scrafty-Mega (65/135/135), Dragalge-Mega (65/105/163)
- **Ghost types (immune to ability trapping):** Aegislash, Aegislash-Blade, Blacephalon, Chandelure, Chandelure-Mega, Gengar, Pecharunt, Polteageist, Sableye-Mega, Zoroark-Hisui
- **Steel types (Magnet Pull targets):** Aegislash, Aegislash-Blade, Archaludon, Bisharp, Celesteela, Corviknight, Excadrill, Goodra-Hisui, Iron Crown, Iron Treads, Jirachi, Metagross, Scizor, Skarmory, Skarmory-Mega
- **Guard Dog / trap-immune:** Okidogi
- **Levitate (escapes Arena Trap):** Delphox-Mega, Gengar, Hydreigon, Latias-Mega, Rotom-Wash
- **Regenerator pivots:** Amoonguss, Dragalge-Mega, Hydrapple, Mienshao, Slowbro, Slowking
- **Unaware:** Clefable | **Magic Bounce:** Hatterene, Sableye-Mega
- **Pivot-move users (escape any trap):** 45 of 91 — Alakazam, Blissey, Chansey, Clefable, Corviknight, Dragalge-Mega, Gardevoir-Mega, Hatterene, Hawlucha, Hydreigon, Iron Crown, Iron Treads, Jirachi, Keldeo, Latias-Mega, Mew, Mienshao, Moltres, Moltres-Galar, Pecharunt, _+25 more_

### RU — 131 entries

- **Speed ceiling:** Absol-Mega-Z 441, Beedrill-Mega 427, Sceptile-Mega 427, Barraskewda 408, Manectric-Mega 405, Crobat 394
- **Bulkiest (HP/Def/SpD):** Steelix-Mega (75/230/95), Aggron-Mega (70/230/80), Registeel (80/150/150), Cresselia (120/120/130), Deoxys-Defense (50/160/160), Diancie (50/150/150), Steelix (75/200/65), Umbreon (95/110/130)
- **Ghost types (immune to ability trapping):** Absol-Mega-Z, Banette-Mega, Froslass-Mega, Golurk-Mega, Marowak-Alola, Mimikyu, Mimikyu-Busted, Oricorio-Sensu, Sinistcha, Skeledirge
- **Steel types (Magnet Pull targets):** Aggron-Mega, Chimecho-Mega, Cobalion, Copperajah, Duraludon, Durant, Empoleon, Forretress, Lucario, Magnezone, Registeel, Revavroom, Steelix, Steelix-Mega, Tinkaton
- **Guard Dog / trap-immune:** none
- **Levitate (escapes Arena Trap):** Azelf, Chimecho-Mega, Cresselia, Eelektross-Mega, Latias, Weezing-Galar
- **Regenerator pivots:** Cyclizar, Reuniclus, Tangrowth
- **Unaware:** Quagsire, Skeledirge | **Magic Bounce:** Absol-Mega
- **Pivot-move users (escape any trap):** 69 of 131 — Absol-Mega, Absol-Mega-Z, Ampharos-Mega, Arcanine-Hisui, Azelf, Barraskewda, Beedrill-Mega, Blastoise, Celebi, Chimecho-Mega, Cloyster, Cobalion, Comfey, Crobat, Cyclizar, Darmanitan, Darmanitan-Zen, Deoxys-Defense, Diancie, Diggersby, _+49 more_

### NU — 67 entries

- **Speed ceiling:** Aerodactyl 394, Kilowattrel 383, Inteleon 372, Cinccino 361, Raikou 361, Starmie 361
- **Bulkiest (HP/Def/SpD):** Stakataka (61/211/101), Uxie (75/130/130), Guzzlord (223/53/53), Scream Tail (115/99/115), Avalugg (95/184/46), Aggron (70/180/60), Goodra (90/70/150), Meloetta (100/77/128)
- **Ghost types (immune to ability trapping):** Basculegion, Brambleghast, Decidueye, Dhelmise, Doublade, Houndstone
- **Steel types (Magnet Pull targets):** Aggron, Bronzong, Doublade, Escavalier, Klefki, Magneton, Stakataka
- **Guard Dog / trap-immune:** none
- **Levitate (escapes Arena Trap):** Bronzong, Flygon, Uxie
- **Regenerator pivots:** none
- **Unaware:** none | **Magic Bounce:** Espeon, Xatu
- **Pivot-move users (escape any trap):** 33 of 67 — Arcanine, Articuno-Galar, Basculegion, Bellibolt, Braviary, Cinccino, Decidueye, Decidueye-Hisui, Dragalge, Dudunsparce, Espeon, Flamigo, Flygon, Gligar, Grafaiai, Heliolisk, Incineroar, Inteleon, Kilowattrel, Magneton, _+13 more_

### PU — 110 entries

- **Speed ceiling:** Ninjask 460, Electrode-Hisui 438, Dugtrio 372, Salazzle 366, Ambipom 361, Floatzel 361
- **Bulkiest (HP/Def/SpD):** Audino-Mega (103/126/126), Glastrier (100/130/110), Snorlax (160/65/110), Coalossal (110/120/90), Wo-Chien (85/100/135), Avalugg-Hisui (95/184/36), Wishiwashi-School (45/130/135), Brute Bonnet (111/99/99)
- **Ghost types (immune to ability trapping):** Corsola-Galar, Dusclops, Golurk, Hoopa, Jellicent, Lampent, Mismagius, Palossand, Typhlosion-Hisui
- **Steel types (Magnet Pull targets):** Lairon, Sandslash-Alola, Sliggoo-Hisui, Togedemaru
- **Guard Dog / trap-immune:** none
- **Levitate (escapes Arena Trap):** Claydol, Mismagius, Rotom-Heat, Rotom-Mow
- **Regenerator pivots:** Audino, Duosion, Eldegoss, Mienfoo, Slowbro-Galar, Slowpoke, Slowpoke-Galar, Tangela
- **Unaware:** Crocalor | **Magic Bounce:** none
- **Pivot-move users (escape any trap):** 54 of 110 — Absol, Ambipom, Archeops, Bellossom, Bombirdier, Bruxish, Claydol, Clefairy, Combusken, Electrode-Hisui, Floatzel, Floette-Eternal, Florges, Frosmoth, Galvantula, Golbat, Gorebyss, Grimmsnarl, Hitmonlee, Kadabra, _+34 more_

### ZU — 677 entries

- **Speed ceiling:** Electrode 438, Accelgor 427, Eiscue-Noice 394, Jolteon 394, Boltund 375, Minior 372
- **Bulkiest (HP/Def/SpD):** Shuckle (20/230/230), Regice (80/100/200), Regirock (80/200/100), Bastiodon (60/168/138), Probopass (60/145/150), Carbink (50/150/150), Regigigas (110/110/110), Articuno (90/100/125)
- **Ghost types (immune to ability trapping):** Banette, Bramblin, Cofagrigus, Cursola, Drakloak, Dreepy, Drifblim, Drifloon, Dusknoir, Duskull, Frillish, Froslass, Gastly, Gimmighoul, Gimmighoul-Roaming, Golett, Gourgeist, Greavard, Haunter, Honedge, Litwick, Misdreavus, Phantump, Poltchageist, Pumpkaboo, Rotom, Runerigus, Sableye, Sandygast, Shedinja, Shuppet, Sinistea, Spiritomb, Trevenant, Yamask, Yamask-Galar, Zorua-Hisui
- **Steel types (Magnet Pull targets):** Aron, Bastiodon, Beldum, Bronzor, Cufant, Diglett-Alola, Dugtrio-Alola, Ferroseed, Honedge, Klang, Klink, Klinklang, Magnemite, Mawile, Meltan, Meowth-Galar, Metang, Orthworm, Pawniard, Perrserker, Probopass, Sandshrew-Alola, Shieldon, Stunfisk-Galar, Tinkatink, Tinkatuff, Varoom
- **Guard Dog / trap-immune:** Mabosstiff
- **Levitate (escapes Arena Trap):** Baltoy, Bronzor, Carnivine, Chimecho, Chingling, Cryogonal, Duskull, Eelektrik, Eelektross, Gastly, Haunter, Koffing, Lunatone, Mesprit, Misdreavus, Rotom, Rotom-Fan, Rotom-Frost, Solrock, Tynamo, Unown, Vibrava, Vikavolt, Weezing
- **Regenerator pivots:** Corsola, Foongus, Gossifleur, Klawf, Mareanie, Solosis
- **Unaware:** Bibarel, Bidoof, Cosmog, Fuecoco, Pyukumuku, Swoobat, Woobat, Wooper, Wooper-Paldea | **Magic Bounce:** Hatenna, Hattrem, Natu
- **Pivot-move users (escape any trap):** 300 of 677 — Abra, Accelgor, Aipom, Ampharos, Archen, Ariados, Arrokuda, Articuno, Basculin, Beautifly, Beedrill, Beheeyem, Blitzle, Boltund, Brionne, Buizel, Buneary, Bunnelby, Butterfree, Calyrex, _+280 more_

**Shed Shell is legal in every tier and available to every non-forme entry**, so
any Pokémon in any tier can buy immunity to trapping for its item slot. That cost
— an item slot on the *victim* — is the honest counterweight to every verdict
below.

---
## J. Trapping matchup matrix — the central question

For each tiered holder: **what can it selectively remove from its own tier?**

The per-tier trapped/escaped censuses and the damage tables are in sections
E, F, G. Read them together —
**trapping a Pokémon is not the same as beating it.**

For every holder/target pair the questions are:

1. Is the target actually trapped? (sections E/F/G)
2. Is the trapper faster? (section M)
3. Does the trapper's damage remove it before it removes the trapper? (damage tables)
4. Can the target recover faster than the trapper can chip it? (holder profiles, "Reliable recovery")
5. Does the target simply have a pivot move and leave anyway? (section I, per tier)
6. Does the target carry Shed Shell, Ghost typing or Guard Dog?

A trapper is tier-warping when the answer is "trapped, faster, kills, and the
target has no pivot" for something the tier structurally needs.

---

## K. Setup-fodder matrix

A trapper that removes a target **and** ends the exchange at +2 is a different
proposition from one that trades one-for-one. Holders with both trapping and
setup, from the live movepools:

| Holder | Tier | Trapping ability | Setup moves | Reliable recovery | Substitute | Protect |
| --- | --- | --- | --- | --- | --- | --- |
| Gengar-Mega | Ubers | Shadow Tag | Nasty Plot | Rest | yes | yes |
| Chandelure | UU | Shadow Tag | Acid Armor, Calm Mind | Rest | yes | yes |
| Magnezone | RU | Magnet Pull | Barrier, Charge, Iron Defense | Rest | yes | yes |
| Gothitelle | NU | Shadow Tag | Calm Mind, Cosmic Power, Nasty Plot | Rest | yes | yes |
| Magneton | NU | Magnet Pull | Charge, Iron Defense | Rest | yes | yes |
| Dugtrio | PU | Arena Trap | Agility, Hone Claws, Swords Dance, Work Up | Rest | yes | yes |
| Gothorita | PU | Shadow Tag | Calm Mind, Nasty Plot | Rest | yes | yes |
| Lampent | PU | Shadow Tag | Acid Armor, Calm Mind | Rest | yes | yes |
| Wobbuffet | PU | Shadow Tag | Amnesia | none | no | no |
| Diglett | ZU | Arena Trap | Agility, Hone Claws, Swords Dance, Work Up | Rest | yes | yes |
| Geodude-Alola | ZU | Magnet Pull | Autotomize, Charge, Defense Curl, Harden, Iron Defense, Rock Polish | Rest | yes | yes |
| Golem-Alola | ZU | Magnet Pull | Autotomize, Charge, Defense Curl, Harden, Iron Defense, Rock Polish | Rest | yes | yes |
| Gothita | ZU | Shadow Tag | Calm Mind, Nasty Plot | Rest | yes | yes |
| Graveler-Alola | ZU | Magnet Pull | Autotomize, Charge, Defense Curl, Harden, Iron Defense, Rock Polish | Rest | yes | yes |
| Litwick | ZU | Shadow Tag | Acid Armor, Calm Mind | Rest | yes | yes |
| Magnemite | ZU | Magnet Pull | Charge, Iron Defense | Rest | yes | yes |
| Meltan | ZU | Magnet Pull | Acid Armor, Harden, Iron Defense | Rest | yes | yes |
| Nosepass | ZU | Magnet Pull | Defense Curl, Harden, Iron Defense, Rock Polish | Rest | yes | yes |
| Probopass | ZU | Magnet Pull | Defense Curl, Harden, Iron Defense, Rock Polish | Rest | yes | yes |
| Trapinch | ZU | Arena Trap | **none** | Rest | yes | yes |
| Wynaut | ZU | Shadow Tag | Amnesia | none | no | no |

Stored Power and Power Trip gain +20 BP per boost stage in this engine, so a
trapper that can boost freely behind a Substitute scales differently from one
that cannot.

---

## L. Trapping counterplay matrix

Every escape route, measured (section B), and who has it:

| Counterplay | Works against | Notes |
| --- | --- | --- |
| **Ghost typing** | all three abilities | read off **live** types; not Fairy Lock |
| **Shed Shell** | everything, including Fairy Lock and partial trapping | costs the victim's item slot; legal in every tier |
| **Guard Dog** | all three abilities | `trapImmune` |
| **Flying / Levitate / Air Balloon** | Arena Trap only | an Iron Ball re-grounds |
| **not being Steel** | Magnet Pull only | |
| **having Shadow Tag yourself** | Shadow Tag only | mutual |
| **U-turn, Volt Switch, Flip Turn, Parting Shot, Baton Pass, Teleport** | **all trapping** | the biggest single escape route |
| **Roar, Whirlwind, Dragon Tail, Circle Throw** | **all trapping** | phazing never consults `isTrapped` |
| **Gastro Acid, Neutralizing Gas, Skill Swap, Entrainment** | ability trapping | suppresses or removes the trapper's ability |
| **KOing or outspeeding the trapper** | all | the trap ends the instant the trapper leaves or faints |
| **Mold Breaker** | **nothing** | does **not** break trapping |

Classify each holder's answers as **HARD COUNTER / RELIABLE COUNTER / CHECK /
REVENGE KILLER / TRAP-RESISTANT ROLE / NOT AN ANSWER**. Something that cannot
switch in safely *and* cannot escape once in is not a counter, whatever its
damage output says.

---

## M. Speed table — all trapping holders

| Holder | Tier | Base Spe | Max neutral | Max +Spe | +1 | +2 | Scarf |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Gengar-Mega | Ubers | 130 | 359 | 394 | 591 | 788 | 591 |
| Chandelure | UU | 80 | 259 | 284 | 426 | 568 | 426 |
| Magnezone | RU | 60 | 219 | 240 | 360 | 480 | 360 |
| Gothitelle | NU | 65 | 229 | 251 | 376 | 502 | 376 |
| Magneton | NU | 70 | 239 | 262 | 393 | 524 | 393 |
| Dugtrio | PU | 120 | 339 | 372 | 558 | 744 | 558 |
| Gothorita | PU | 55 | 209 | 229 | 343 | 458 | 343 |
| Lampent | PU | 55 | 209 | 229 | 343 | 458 | 343 |
| Wobbuffet | PU | 33 | 165 | 181 | 271 | 362 | 271 |
| Diglett | ZU | 95 | 289 | 317 | 475 | 634 | 475 |
| Geodude-Alola | ZU | 20 | 139 | 152 | 228 | 304 | 228 |
| Golem-Alola | ZU | 45 | 189 | 207 | 310 | 414 | 310 |
| Gothita | ZU | 45 | 189 | 207 | 310 | 414 | 310 |
| Graveler-Alola | ZU | 35 | 169 | 185 | 277 | 370 | 277 |
| Litwick | ZU | 20 | 139 | 152 | 228 | 304 | 228 |
| Magnemite | ZU | 45 | 189 | 207 | 310 | 414 | 310 |
| Meltan | ZU | 34 | 167 | 183 | 274 | 366 | 274 |
| Nosepass | ZU | 30 | 159 | 174 | 261 | 348 | 261 |
| Probopass | ZU | 40 | 179 | 196 | 294 | 392 | 294 |
| Trapinch | ZU | 10 | 119 | 130 | 195 | 260 | 195 |
| Wynaut | ZU | 23 | 145 | 159 | 238 | 318 | 238 |

---

## N. Priority table — all trapping holders

| Holder | Tier | Priority moves (engine BP / bracket) | Max offence |
| --- | --- | --- | --- |
| Gengar-Mega | Ubers | Sucker Punch 80P Dark (+1) | Atk 251 / SpA 482 |
| Chandelure | UU | **none** | Atk 229 / SpA 427 |
| Magnezone | RU | **none** | Atk 262 / SpA 394 |
| Gothitelle | NU | Fake Out 40P Normal (+3) | Atk 229 / SpA 317 |
| Magneton | NU | **none** | Atk 240 / SpA 372 |
| Dugtrio | PU | Sucker Punch 80P Dark (+1) | Atk 328 / SpA 218 |
| Gothorita | PU | Fake Out 40P Normal (+3) | Atk 207 / SpA 273 |
| Lampent | PU | **none** | Atk 196 / SpA 317 |
| Wobbuffet | PU | **none** | Atk 181 / SpA 181 |
| Diglett | ZU | Sucker Punch 80P Dark (+1) | Atk 229 / SpA 185 |
| Geodude-Alola | ZU | Sucker Punch 80P Dark (+1) | Atk 284 / SpA 174 |
| Golem-Alola | ZU | Sucker Punch 80P Dark (+1) | Atk 372 / SpA 229 |
| Gothita | ZU | Fake Out 40P Normal (+3) | Atk 174 / SpA 229 |
| Graveler-Alola | ZU | Sucker Punch 80P Dark (+1) | Atk 317 / SpA 207 |
| Litwick | ZU | **none** | Atk 174 / SpA 251 |
| Magnemite | ZU | **none** | Atk 185 / SpA 317 |
| Meltan | ZU | **none** | Atk 251 / SpA 229 |
| Nosepass | ZU | **none** | Atk 207 / SpA 207 |
| Probopass | ZU | **none** | Atk 229 / SpA 273 |
| Trapinch | ZU | First Impression 90P Bug (+2); Feint 50P Normal (+2); Quick Attack 40P Normal (+1) | Atk 328 / SpA 207 |
| Wynaut | ZU | **none** | Atk 159 / SpA 159 |

---

## O. Item-freedom table

| Holder | Item freedom | Consequence |
| --- | --- | --- |
| Gengar-Mega | **No** — Gengarite forced and unremovable | no Choice item, Life Orb, Boots, Leftovers, Ring Target or Orb; and it spends the team's one Mega slot |
| Chandelure | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Magnezone | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Gothitelle | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Magneton | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Dugtrio | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Gothorita | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Lampent | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Wobbuffet | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Diglett | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Geodude-Alola | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Golem-Alola | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Gothita | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Graveler-Alola | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Litwick | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Magnemite | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Meltan | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Nosepass | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Probopass | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Trapinch | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |
| Wynaut | Yes — any item | Choice Band/Specs/Scarf, Life Orb, Leftovers, Heavy-Duty Boots, Assault Vest, Focus Sash, Ring Target and the Orbs all available |

**Trick and Switcheroo on a trapper are worth more than usual**: a trapped target
that has just been handed a Choice item cannot switch to escape the lock.
Holders with either: Gengar-Mega, Chandelure, Gothitelle, Gothorita, Lampent, Gothita, Litwick.

**Ring Target** is redesigned in RedGPT: it lets the **holder's own attacks** hit
for neutral damage through a **type** immunity. It does not beat ability
immunities, it is one per team, it is visible from turn one, and **no Mega can
hold it**.

---

## P. Hazard / status synergy

| Holder | Tier | Hazards | Status | Leech Seed | Perish Song | Taunt | Encore | Disable |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Gengar-Mega | Ubers | Toxic Spikes | Hypnosis, Thunder Wave, Toxic, Will-O-Wisp | — | **yes** | yes | yes | yes |
| Chandelure | UU | — | Toxic, Will-O-Wisp | — | — | yes | — | — |
| Magnezone | RU | — | Thunder Wave, Toxic | — | — | — | — | — |
| Gothitelle | NU | — | Hypnosis, Thunder Wave, Toxic | — | — | yes | — | — |
| Magneton | NU | — | Thunder Wave, Toxic | — | — | — | — | — |
| Dugtrio | PU | Stealth Rock | Toxic | — | — | — | — | — |
| Gothorita | PU | — | Hypnosis, Thunder Wave, Toxic | — | — | yes | — | — |
| Lampent | PU | — | Toxic, Will-O-Wisp | — | — | yes | — | — |
| Wobbuffet | PU | — | — | — | — | — | yes | — |
| Diglett | ZU | Stealth Rock | Toxic | — | — | — | — | — |
| Geodude-Alola | ZU | Stealth Rock | Thunder Wave, Toxic | — | — | — | — | — |
| Golem-Alola | ZU | Stealth Rock | Thunder Wave, Toxic | — | — | — | — | — |
| Gothita | ZU | — | Hypnosis, Thunder Wave, Toxic | — | — | yes | — | — |
| Graveler-Alola | ZU | Stealth Rock | Thunder Wave, Toxic | — | — | — | — | — |
| Litwick | ZU | — | Toxic, Will-O-Wisp | — | — | yes | — | — |
| Magnemite | ZU | — | Thunder Wave, Toxic | — | — | — | — | — |
| Meltan | ZU | — | Thunder Wave, Toxic | — | — | — | — | — |
| Nosepass | ZU | Stealth Rock | Thunder Wave, Toxic | — | — | yes | — | — |
| Probopass | ZU | Stealth Rock | Thunder Wave, Toxic | — | — | yes | — | — |
| Trapinch | ZU | Stealth Rock | Toxic | — | — | — | — | — |
| Wynaut | ZU | — | — | — | — | — | yes | — |

**Perish Song plus trapping is the sharpest combination in this list** — the
victim cannot switch and the timer cannot be waited out, so it beats any amount
of bulk or recovery. Check it explicitly wherever it appears above.

**Toxic Orb and Flame Orb fire on ENTRY** in this project, so a Guts or Quick Feet
trapper is boosted from the turn it arrives.

---

## Q. Transformation / forme legality

| Holder | Route out of its tier | Gated? |
| --- | --- | --- |
| Gengar-Mega | none | — |
| Chandelure | Chandelurite → Chandelure-Mega (UU) | same rung or lower — no issue |
| Magnezone | none | — |
| Gothitelle | none | — |
| Magneton | none | — |
| Dugtrio | none | — |
| Gothorita | none | — |
| Lampent | none | — |
| Wobbuffet | none | — |
| Diglett | none | — |
| Geodude-Alola | none | — |
| Golem-Alola | none | — |
| Gothita | none | — |
| Graveler-Alola | none | — |
| Litwick | none | — |
| Magnemite | none | — |
| Meltan | none | — |
| Nosepass | none | — |
| Probopass | none | — |
| Trapinch | none | — |
| Wynaut | none | — |

**Gengar-Mega is the case to be careful with.** It is a **transform-only forme**
with Shadow Tag as its **only** ability, reached by base Gengar (UU) holding a
Gengarite. So it is tiered as a *forme*: the Gengarite is refused below its tier
while Gengar itself stays legal — the Absol/Absolite rule. Verified through the
real validator: *"Gengarite is banned in OverUsed — it turns Gengar into
Gengar-Mega, which is Ubers. Gengar itself is legal here."* Moving Gengar-Mega
moves **the stone's legality**, not Gengar's.

**Base Gengar does not get Shadow Tag.** Its own abilities are
Cursed Body / Levitate; Shadow Tag arrives only on Mega Evolution, verified live
(pre-Mega the foe is not trapped, post-Mega it is).

---

## R. Multi-tier destination comparisons

For each holder, state the plausible destinations after weighing the evidence —
**not** limited to one rung.

| Holder | Current | Plausible destinations to compare |
| --- | --- | --- |
| **Gengar-Mega** | Ubers | Ubers / OU / UU — and further if the evidence supports it |
| **Chandelure** | UU | Ubers / OU / UU / RU / NU — and further if the evidence supports it |
| **Magnezone** | RU | OU / UU / RU / NU / PU — and further if the evidence supports it |
| **Gothitelle** | NU | UU / RU / NU / PU / ZU — and further if the evidence supports it |
| **Magneton** | NU | UU / RU / NU / PU / ZU — and further if the evidence supports it |
| **Dugtrio** | PU | RU / NU / PU / ZU — and further if the evidence supports it |
| **Gothorita** | PU | RU / NU / PU / ZU — and further if the evidence supports it |
| **Lampent** | PU | RU / NU / PU / ZU — and further if the evidence supports it |
| **Wobbuffet** | PU | RU / NU / PU / ZU — and further if the evidence supports it |
| **Diglett** | ZU | NU / PU / ZU — and further if the evidence supports it |
| **Geodude-Alola** | ZU | NU / PU / ZU — and further if the evidence supports it |
| **Golem-Alola** | ZU | NU / PU / ZU — and further if the evidence supports it |
| **Gothita** | ZU | NU / PU / ZU — and further if the evidence supports it |
| **Graveler-Alola** | ZU | NU / PU / ZU — and further if the evidence supports it |
| **Litwick** | ZU | NU / PU / ZU — and further if the evidence supports it |
| **Magnemite** | ZU | NU / PU / ZU — and further if the evidence supports it |
| **Meltan** | ZU | NU / PU / ZU — and further if the evidence supports it |
| **Nosepass** | ZU | NU / PU / ZU — and further if the evidence supports it |
| **Probopass** | ZU | NU / PU / ZU — and further if the evidence supports it |
| **Trapinch** | ZU | NU / PU / ZU — and further if the evidence supports it |
| **Wynaut** | ZU | NU / PU / ZU — and further if the evidence supports it |

The comparison bars are section I (every tier's defensive structure and speed
ceiling) and the per-ability censuses.

---

## S. Remaining unresolved questions

1. **No usage, ladder, win-rate, tournament or popularity data exists in RedGPT.**
   Every judgement must be mechanical.
2. **No trapping user has ever been played by a human here.** The ladder was
   rebuilt on 2026-08-15 and revised through the Ubers, UU, RU and NU passes on
   2026-08-16.
3. **How often a trapper actually gets in safely is not measurable.** The engine
   can say who is trapped and what the damage is; it cannot say how often the
   position arises. Every verdict is about the value of the position when it
   happens, not its frequency.
4. **The pivot-move escape is large and hard to price.** Section I reports, per
   tier, how many entries carry a pivot move — for most tiers that is a
   substantial fraction of the roster, and every one of them ignores trapping.
5. **Shed Shell is a universal answer at the cost of an item slot**, and how
   often a team would actually spend that slot is a metagame question with no
   data behind it.
6. **Conditional abilities are read unactivated.** Where an ability decides a
   verdict, ask for a per-ability profile.
7. **Chandelure is the flagged case.** Its NU placement was left explicitly
   provisional pending exactly this audit. Its Shadow Tag is **optional** — one of
   four abilities — so the tiering question is whether a Pokémon that *may* select
   Shadow Tag should be tiered as though it always does.
8. **The same question applies in reverse to every optional holder**, which is all
   but 2 of the 21 tiered holders (Gengar-Mega, Meltan have it forced).

**If a number you need is missing, ask for it** rather than estimating. Any
damage, speed, trapping or legality question can be answered against the real
engine.

---

## Requested output

Return, for **every** trapping holder:

- Exact entry name
- Species or forme
- Current tier
- **Final recommended tier**
- Direction and magnitude of movement
- Confidence
- Which trapping ability, and whether it is optional or mandatory
- Main trapping targets in the destination tier
- Important targets it **fails** to trap or beat
- Key calculations you relied on, with the ability and item they assume
- Relevant counterplay
- Why the destination tier is appropriate

Then summarise:

### Promotions
Every holder moving upward.

### Demotions
Every holder moving downward.

### Multi-tier jumps
Anything moving more than one rung.

### Retained placements
Every serious holder investigated and left unchanged.

### Uncertain placements
Anything still needing evidence — name the specific measurement you want.

**Do not implement anything.** This is a decision request; the tier changes will
be applied separately after review.