# Paste-ready prompt: verified learnsets and RedGPT-native calculations

Everything below the line is the prompt. Paste it into the same ChatGPT thread
that has already seen the OU roster and the differences documents.

Generated 2026-08-16 from the live packaged data and the real damage engine.

---

This is the mechanical evidence you said was missing for the RedGPT OU → Ubers
tiering pass. Every learnset here is read from the packaged data, and every
damage number comes from RedGPT's own engine — not a Showdown calculator, not
memory. Use it to redo the pass yourself.

**Ground rules, unchanged:** the data below beats your recollection of Smogon or
the main series; there is no cap on how many Pokémon you promote; rank by
confidence; flag speculation as speculation in the sentence where it happens;
say which of a species and its forme you mean; and do not invent usage, ladder
or tournament statistics — I have none and neither do you.

---

## 0. How this was produced, and its limits

- Learnsets are `species.learnset` from the packaged data. **A move is legal
  whether it is learned by level-up or by TM/tutor/egg/prevo** — the stored
  value is a level, and 0 means "legal, not learned by level-up". Everything
  listed is legal.
- **Mega formes do not have their own learnset.** Each carries a byte-identical
  copy of its base species' pool. Verified for all five Megas here (Zeraora,
  Lucario, Lucario-Mega-Z, Greninja, Metagross, Mawile, Medicham). So "what can
  Mega X do" is always "what can X do", with the Mega's stats and ability.
- Damage comes from `Calculator.calculate`, which drives the real engine rather
  than a copy of the formula. **It was validated against actual battles**: seven
  matchups were played out and the logged damage fell inside the calculated
  range every time.
- **Mega Evolution is a declared action, so a Mega set's item slot is spent on
  the stone.** Every Mega row below therefore has *no item* — no Life Orb, no
  Choice item, no Ring Target. That is a real constraint, not a modelling
  shortcut.
- All spreads are **representative test sets, not measured standard sets**.
  RedGPT has no usage data. Treat them as "a sensible build", not "the build".
- Level 100, max IVs unless noted, no weather or terrain unless noted.

---

## A. Verified learnsets

Only tiering-relevant moves are listed. `†` marks a move whose RedGPT
implementation differs from upstream.

### Zeraora / Zeraora-Mega
*Electric. Zeraora 88/112/75/102/80/143. **Mega 88/157/75/147/80/153**, Volt
Absorb. 83 legal moves; the Mega's pool is identical to the base's.*

- **Electric STAB:** Thunder (120, 70%), Plasma Fists (100 P), Thunderbolt (95),
  Wild Charge (90 P), Discharge (80), Thunder Punch (75 P), Rising Voltage (70),
  Volt Switch (70)
- **Coverage:** Close Combat (120 P), Focus Blast (120, 70%), Aura Sphere (90,
  never misses), Superpower (120 P), Outrage (120 P), Grass Knot (weight-based),
  Play Rough (90 P), Iron Tail (100 P, 75%), Throat Chop (80 P), Knock Off
  (65 P), Blaze Kick, Fire Punch, Bounce, Drain Punch, Focus Punch† (150, 70%)
- **Setup:** Bulk Up, Calm Mind, Hone Claws, Work Up, Agility, Charge
- **Priority:** Quick Attack (+1), Fake Out† (+3, keeps its first-turn rule)
- **Speed control:** Agility, Thunder Wave, Electroweb, Scary Face
- **Pivot:** Volt Switch · **Utility:** Taunt, Substitute, Protect, Knock Off
- **Multi-hit†:** Dual Chop (50×2 Dragon), Fury Swipes (25×2-5 Normal)
- **No recovery move at all. No hazards, no hazard removal, no trapping,
  no phazing.**

> **Absences that matter.** Zeraora has **no Ice, Water or Ground coverage** —
> no Ice Punch, no Ice Beam, no Hydro Pump, no Surf, no Bulldoze, no Earthquake.
> Against a Ground-type its entire answer is Fighting (Close Combat / Focus
> Blast / Aura Sphere), Grass Knot, or Outrage.

### Lucario / Lucario-Mega / Lucario-Mega-Z
*Fighting/Steel. Lucario 70/110/70/115/70/90 (RU). **Mega 70/145/88/140/70/112
(OU)**. **Mega-Z 70/100/70/164/70/151 (OU, estimated)**. Both Megas have
Adaptability, so STAB is **2x, not 1.5x**. 121 legal moves; all three share one
pool.*

- **Fighting STAB, special:** Aura Sphere (90, never misses), Focus Blast (120,
  70%), Vacuum Wave (40, +1 priority)
- **Fighting STAB, physical:** Focus Punch† (150, 70%), High Jump Kick (130),
  Close Combat (120), Cross Chop (100, 80%), Sky Uppercut, Brick Break, Drain
  Punch, Force Palm, Low Sweep, Upper Hand† (65, +3), Circle Throw, Revenge
- **Steel STAB:** Steel Beam (140 S, 95%), Meteor Mash (100 P), Iron Tail
  (100 P, 75%), Flash Cannon (80 S), Bullet Punch (40 P, +1)
- **Secondary coverage:** Dark Pulse (80 S), Shadow Ball (80 S), Dragon Pulse
  (90 S), Psychic (90 S), Water Pulse, Earthquake (100 P), Stone Edge (100 P),
  Ice Punch, Thunder Punch, Crunch, Poison Jab, Zen Headbutt, Extreme Speed
  (80 P, +2), **Bone Rush† (25×2-5 Ground, ~125 effective)**
- **Setup:** **Nasty Plot**, Swords Dance, Calm Mind, Bulk Up, Iron Defense,
  Hone Claws, Agility, Work Up
- **Priority:** Extreme Speed (+2), Upper Hand† (+3), Bullet Punch (+1), Vacuum
  Wave (+1), Feint (+2), Quick Attack (+1)
- **Recovery:** Life Dew only (no Roost, no Recover, no Slack Off)
- **Utility:** Substitute, Protect, Detect · **Phazing:** Roar, Circle Throw
- **No hazards, no hazard removal, no pivot move, no trapping.**

> **The Focus Punch question, answered: yes, Lucario learns it** (TM), so all
> three formes do. It is 150 BP at 70% with priority 0 and no condition. But
> Mega-Z is a *special* attacker with 100 base Attack against 164 Special
> Attack, so Focus Punch is close to irrelevant on it. It matters on **Mega
> Lucario** (145 Attack), where it competes with Close Combat's 120 at 100%.

### Magearna / Magearna-Original
*Steel/Fairy, 80/95/115/130/115/65, Soul-Heart. Identical pools and identical
stats — they are the same Pokémon twice. 104 legal moves.*

- **STAB:** Fleur Cannon (130 S, 90%), Steel Beam (140 S, 95%), Flash Cannon
  (80 S), Iron Head (80 P), Dazzling Gleam (80 S), Play Rough (90 P), Draining
  Kiss (50 S, drain), Misty Explosion, Steel Roller
- **Coverage:** Aura Sphere (90, never misses), Focus Blast (120, 70%),
  Thunderbolt (95), Ice Beam (95), Energy Ball (90), Psychic (90), Psyshock
  (80), Shadow Ball (80), Ice Spinner, Tri Attack, Volt Switch, Zap Cannon,
  Explosion (250)
- **Setup:** **Calm Mind**, **Shift Gear**, **Iron Defense**, Agility
- **Stored Power†:** yes, legal (+20 BP per boost stage)
- **Recovery:** **Pain Split and Rest only — no Recover, no Roost, no Giga
  Drain.** Draining Kiss (50 BP) is the only drain move.
- **Speed control:** Shift Gear, Agility, Thunder Wave, **Trick Room**,
  Electroweb
- **Hazards:** Spikes · **Pivot:** Volt Switch, Baton Pass
- **Utility:** Substitute, Protect, Encore, Trick, Heal Bell, Reflect, Light
  Screen, Imprison, Gravity
- **No Body Press.**

### Greninja / Greninja-Mega
*Water/Dark. Greninja 72/95/67/103/71/122. **Mega 72/125/77/133/81/142**,
Protean. 99 legal moves; identical pools.*

- **STAB:** Hydro Pump (120, 80%), Hydro Cannon (150, 90%), Surf (95), Scald
  (80), Liquidation (85 P), Waterfall (80 P), **Water Shuriken† (25×2-5, +1
  priority)**, Dark Pulse (80 S), Night Slash (70 P), Thief† (60 P)
- **Coverage:** Ice Beam (95), Blizzard (120, 70%), Gunk Shot (120 P, 80%),
  Sludge Wave (95), Extrasensory (80), Rock Slide, Ice Punch, U-turn (70),
  Upper Hand† (65, +3), Shadow Sneak (40, +1), Dig, Grass Knot (weight-based),
  Low Kick (weight-based), Icy Wind
- **Setup:** **Swords Dance and Work Up only — no Nasty Plot.**
- **Hazards:** Spikes, Toxic Spikes · **Pivot:** U-turn
- **Utility:** Taunt, Substitute, Protect, Switcheroo
- **No Sucker Punch. No recovery. No hazard removal.**

> **The Protean question is answered in §D — and the answer is that Protean
> gives no STAB in RedGPT at all.** Read that before judging this Pokémon.

### Kingambit
*Dark/Steel, 100/135/120/60/85/50. Defiant / **Supreme Overlord** / Pressure.
92 legal moves.*

- **STAB:** **Sucker Punch† (80 P, +1, unconditional)**, Kowtow Cleave (85 P,
  never misses), Iron Head (80 P), Throat Chop (80 P), Foul Play (95 P), Lash
  Out (75 P), Night Slash (70 P), Knock Off (65 P), Steel Beam, Flash Cannon,
  Dark Pulse
- **Coverage:** Low Kick, Brick Break, Stone Edge, Poison Jab, Zen Headbutt,
  X-Scissor, Dual Chop† (50×2)
- **Setup:** **Swords Dance**, Iron Defense, Hone Claws, Rock Polish
- **Hazards:** Stealth Rock · **Speed control:** Rock Polish, Thunder Wave
- **Utility:** Taunt, Substitute, Protect, Torment, Knock Off
- **Trapping:** Mean Look
- **No recovery. No Focus Punch. No pivot move.**

### Raging Bolt
*Electric/Dragon, 125/73/91/137/89/75, Protosynthesis. Only 55 legal moves —
the smallest pool here by a wide margin.*

- **STAB:** Draco Meteor (140), **Thunderclap† (70, +1, unconditional)**,
  Thunderbolt (95), Thunder (120, 70%), Dragon Pulse (90), Discharge (80),
  Rising Voltage (70), Volt Switch (70), Zap Cannon, Outrage (120 P), Dragon
  Hammer (90 P), Wild Charge (90 P), Supercell Slam (100 P)
- **Setup:** **Calm Mind** (and Charge)
- **Utility:** Taunt, Substitute, Protect · **Pivot:** Volt Switch
- **Phazing:** Dragon Tail, Roar · **Speed control:** Thunder Wave, Electroweb

> **The decisive absence: Raging Bolt has no coverage outside Electric and
> Dragon.** No Earth Power, no Flamethrower, no Aura Sphere, no Focus Blast, no
> Weather Ball payoff without sun. Against a Ground-type its *only* damaging
> option is Dragon, and against a Fairy it has nothing at all.

### Zamazenta (base forme)
*Fighting, 92/130/115/80/115/138 — **pre-nerf spread, +10 Attack over
upstream**. Dauntless Shield, which fires on **every** entry here. 68 legal
moves.*

- **STAB:** Close Combat (120 P), **Body Press (80 P, scales off Defence)**,
  Focus Blast (120 S, 70%), Brick Break, Revenge
- **Coverage:** Crunch (80 P), Psychic Fangs (85 P), Stone Edge, Wild Charge,
  Iron Tail, Ice/Fire/Thunder Fang, Tail Slap† (25×2-5)
- **Setup:** **Iron Defense**, Agility, Work Up, Howl
- **Utility:** Substitute, Protect, Rest, Reflect, Light Screen, Safeguard,
  Imprison · **Phazing:** Roar
- **No Behemoth Bash** (that is Crowned-only, and Zamazenta-Crowned is Ubers).
  **No Swords Dance. No reliable recovery** — Rest only.

### Mega Mawile
*Steel/Fairy, 50/105/125/55/95/50, **Huge Power**. 109 legal moves, identical to
Mawile's.*

- **STAB:** Play Rough (90 P, 90%), Iron Head (80 P), Steel Beam, Flash Cannon,
  Draining Kiss
- **Priority:** **Sucker Punch† (80 P, +1, unconditional)** — and **no Bullet
  Punch**
- **Setup:** **Swords Dance**, Iron Defense
- **Coverage:** Knock Off, Thunder Punch, Ice Punch, Fire Fang, Ice Fang,
  Thunder Fang, Poison Fang, **Focus Punch† (150, 70%)**, Rock Slide, Rock Tomb
- **Hazards:** Stealth Rock · **Utility:** Substitute, Protect, Taunt, Pain
  Split, Torment · **Pivot:** Baton Pass
- **No Superpower. No recovery beyond Pain Split.**

### Mega Medicham
*Fighting/Psychic, 60/100/85/80/85/100, **Pure Power**. 115 legal moves,
identical to Medicham's.*

- **Fighting STAB:** **Focus Punch† (150, 70%)**, High Jump Kick (130, 90%),
  Close Combat (120), Axe Kick (120, 90%), Drain Punch (75), Brick Break,
  Dynamic Punch, Force Palm, Low Sweep, **Upper Hand† (65, +3)**, Vacuum Wave
- **Psychic STAB:** Zen Headbutt (80 P, 90%), Psycho Cut (70 P), Psychic (90 S),
  Psyshock (80 S), Expanding Force, **Dream Eater† (100, now unconditional)**
- **Coverage:** Ice Punch, Thunder Punch, Fire Punch, Poison Jab, Rock Slide,
  Bullet Punch (40, +1), **Fake Out† (40, +3, keeps its first-turn rule)**
- **Setup:** Bulk Up, Calm Mind, Meditate, Work Up
- **Recovery:** **Recover** (and Drain Punch, Dream Eater)
- **Speed control:** Trick Room · **Utility:** Substitute, Protect, Detect,
  Taunt, Trick, Magic Coat, Pain Split, Reflect, Light Screen

### Kyurem-Black
*Dragon/Ice, 125/170/100/120/90/95, Teravolt. 88 legal moves.*

- **Ice STAB:** **Icicle Spear† (25×2-5 physical — ~125 effective BP)**, Freeze
  Shock (140 P, 90%), Blizzard (120 S, 70%), Ice Beam (95 S), Freeze-Dry (70 S),
  Ice Fang, Avalanche, Glaciate, Icy Wind, Sheer Cold
- **Dragon STAB:** Draco Meteor (140 S), Outrage (120 P), **Scale Shot† (25×2-5
  physical)**, Dragon Pulse (90 S), Dragon Claw (80 P), Dragon Tail, Breaking
  Swipe, Dragon Breath
- **Electric:** **Fusion Bolt (100 P)** — its one non-STAB attacking type of
  note; **Dual Wingbeat† (50×2 Flying)**
- **Setup:** **Dragon Dance**, Hone Claws · **Recovery:** **Roost**
- **Utility:** Substitute, Protect · **Speed control:** Dragon Dance, Icy Wind,
  Glaciate
- **No Icicle Crash, no Ice Shard, no Earthquake.** Earth Power is legal but
  special, off a 120 Special Attack.
- **Loaded Dice** is legal and turns Icicle Spear / Scale Shot into a guaranteed
  4-5 hits.

### Mega Metagross
*Steel/Psychic, 80/145/150/105/110/110, **Tough Claws** (1.3x on contact moves).
105 legal moves, identical to Metagross's.*

- **STAB:** Meteor Mash (100 P, contact → 130 effective), Zen Headbutt (80 P,
  contact → 104), Iron Head, Psychic, Flash Cannon, Psyshock
- **Priority:** **Bullet Punch (40 P, +1, contact → 52)**
- **Coverage:** Earthquake (100 P, **not contact, so no Tough Claws**), Hammer
  Arm (100 P, contact → 130), Ice Punch, Thunder Punch, Grass Knot, Knock Off,
  Explosion (250)
- **Setup:** **Agility** · **Hazards:** Stealth Rock
- **Utility:** Trick, Substitute, Protect, Knock Off
- **No recovery at all. No Pain Split.**

### Deoxys (base forme)
*Psychic, 50/150/50/150/50/150. Pressure.*

- **STAB:** **Psycho Boost (140 S)**, Psychic (90 S), Psyshock, Zen Headbutt,
  Psycho Cut, Extrasensory
- **Coverage:** Superpower (120 P), Ice Beam, Thunderbolt, Shadow Ball, Fire
  Punch, Ice Punch, Thunder Punch, Knock Off, Low Kick, **Extreme Speed (80 P,
  +2 priority)**
- **Setup:** **Nasty Plot**, **Calm Mind**, **Agility** — but **no Swords Dance**
- **Recovery:** **Recover** · **Hazards:** **Spikes, Stealth Rock**
- **Utility:** **Taunt**, Substitute, Protect, Magic Coat, Trick
- Deoxys is the one entry here that is a credible *lead / hazard setter* as well
  as a wallbreaker.

### Annihilape
*Fighting/Ghost, 110/115/80/50/90/90. Vital Spirit / Inner Focus / Defiant.*

- **Ghost STAB:** **Rage Fist† (50 BP + 50 per hit taken, cap 350)**, Shadow
  Claw
- **Fighting STAB:** Close Combat (120 P), Drain Punch (75 P, drain), Brick
  Break, Low Kick
- **Coverage:** Earthquake, Stone Edge, Gunk Shot, U-turn, Dual Chop†, Fury
  Swipes†
- **Setup:** **Bulk Up** · **Recovery:** **Rest**, Drain Punch
- **Utility:** **Taunt**, **Encore**, Substitute, Protect · **Pivot:** U-turn
- **No Poltergeist.**

---

## B. Representative sets used in the calculations

All level 100, max IVs, **representative test sets, not measured standards**.

**Defensive benchmarks**
| Pokémon | Spread | Item | Ability |
| --- | --- | --- | --- |
| Great Tusk | 252 HP / 252 Def Impish *(or 252 SpD Careful)* | Leftovers | Protosynthesis (inactive, no sun) |
| Ting-Lu | 252 HP / 252 Def Impish *(or 252 SpD Careful)* | Leftovers | Vessel of Ruin |
| Toxapex | 252 HP / 252 Def Bold *(or 252 SpD Calm)* | Black Sludge | Regenerator |
| Clodsire | 252 HP / 252 SpD Careful *(or 252 Def Impish)* | Leftovers | Unaware |
| Zamazenta | 252 HP / 252 Def Impish | Leftovers | Dauntless Shield, **+1 Def already applied** |
| Kingambit | 252 HP / 252 Def Impish | Leftovers | Supreme Overlord |
| Heatran | 252 HP / 252 SpD Calm | Leftovers | Flash Fire |
| Dondozo | 252 HP / 252 Def Impish | Leftovers | **Unaware** |
| Corviknight | 252 HP / 252 Def Impish | Leftovers | Pressure |
| Gholdengo | 252 HP / 252 SpD Calm | Leftovers | Good as Gold |

**Two engine facts baked into every row.** Dauntless Shield's +1 Defence and
Supreme Overlord's +1 Attack fire *on entry*, so they are applied explicitly
where the Pokémon appears. And **Dondozo and Clodsire have Unaware**, so an
attacker's boosts are ignored against them — which is why some `+2` rows below
are identical to their `+0` rows. That is correct, not a duplication.

---

## C. Matchup calculations

Percentages are of the defender's max HP. "KO" counts residuals (Leftovers,
Black Sludge) between turns.

### Zeraora-Mega — 252 SpA Timid / 252 Atk Jolly, **no item (stone)**
| Move | Great Tusk | Ting-Lu | Clodsire | Toxapex | Dondozo | Heatran |
| --- | --- | --- | --- | --- | --- | --- |
| Thunderbolt | **immune** | **immune** | **immune** | 64.1-75.3% | 96.4-113.5% | 30.8-36.3% |
| Focus Blast | 34.8-41% | 33.7-39.7% | 11.2-13.1% | 13.2-15.8% | 40.5-47.6% | 51.8-60.9% |
| Grass Knot | 69.6-82% | 33.7-39.7% | 22.4-26.3% | 9.2-10.9% | 81.2-95.4% | 6.5-7.5% |
| Close Combat (phys.) | 20.7-24.4% | 34.3-40.3% | 15.9-18.8% | — | 19.6-23.2% | — |
| Knock Off (phys.) | 8.3-9.9% | 6.9-8.1% | 25.9-30.6% | — | 15.9-18.8% | — |

**Revenge into Mega Zeraora (75 Def / 80 SpD, 88 HP):**
Mega Garchomp Earthquake **176-207% — guaranteed OHKO**. Great Tusk Headlong
Rush **205-242% — guaranteed OHKO**. Kingambit +1 Sucker Punch **106-125% —
guaranteed OHKO through +1 priority.**

### Lucario-Mega-Z — 252 SpA Timid, **no item (stone)**, Adaptability
| Move | Clodsire | Toxapex | Great Tusk | Heatran | Ting-Lu | Dondozo | Gholdengo | Zamazenta |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Aura Sphere | 18.3-21.6% | 21.7-25.7% | 56.9-66.8% | 84.7-99.7% | 55.4-65.2% | 66.1-77.8% | **immune** | 39.9-46.9% |
| Flash Cannon | 32.8-38.4% | 19.4-23% | 50.7-59.7% | 9.3-10.9% | 24.7-29% | 29.4-34.5% | 21.2-24.9% | 35.6-41.8% |

After **+2 Nasty Plot**: Aura Sphere vs Toxapex 43.4-51%, vs Clodsire
18.3-21.6% *(unchanged — Clodsire has Unaware)*. Dark Pulse and Shadow Ball
both do 42.6-50% to Gholdengo.

**Revenge into Mega Lucario-Z (70/70/70 defences):** Kingambit +1 Sucker Punch
**63.1-74.5%** (Dark is resisted by Steel — a 2HKO, not a KO). Mega Mawile
Sucker Punch 39-46.1%. Rillaboom Choice Band Grassy Glide **56.7-66.7%**.
Dragonite Choice Band Extreme Speed 34.8-41.1%.

### Magearna — 252 HP / 252 SpA Modest
| | Ting-Lu | Kingambit | Heatran | Great Tusk | Toxapex | Clodsire |
| --- | --- | --- | --- | --- | --- | --- |
| Fleur Cannon +0 | 55.1-64.8% | 66.3-78.2% | 10.4-12.2% | 113-133% | 21.7-25.7% | 18.1-21.3% |
| Fleur Cannon +3 CM | 136-160% | 165-195% | 25.9-30.6% | 282-332% | 53.9-63.5% | 18.1-21.3%* |
| **Stored Power +3 CM, Leftovers** | **immune** | **immune** | 37.3-44% | 202-238% | 154.9-182.2% | 52.4-61.6% |
| **Stored Power +3 CM, RING TARGET** | **48.9-57.5%** | **118.6-139.6%** | 37.3-44% | 202-238% | 154.9-182.2% | 52.4-61.6% |

\* Clodsire has Unaware. **At +6 with a Ring Target, Stored Power is 260 BP and
does 351.7-413.9% to a defensive Kingambit; without the Ring Target it is a flat
immunity.** That is the single largest swing in this whole document.

**Revenge into Magearna:** Kingambit +1 Sucker Punch only 32.4-38.2%; Great Tusk
Headlong Rush **125.8-148.4%, guaranteed OHKO**.

### Greninja-Mega — 252 SpA Timid, **no item (stone)**
**Read §D first — these numbers are with Protean granting no STAB, which is how
the engine currently behaves.**

| Move | Great Tusk | Ting-Lu | Toxapex | Clodsire | Dondozo | Gholdengo |
| --- | --- | --- | --- | --- | --- | --- |
| Hydro Pump | 97.2-114.3% | 47.2-55.4% | 18.4-22% | 62.7-73.7% | 28.2-33.1% | 40.7-47.9% |
| Ice Beam | 51.4-60.4% | 24.9-29.4% | 9.9-11.5% | 33.2-39% | 14.9-17.5% | 10.6-12.7% |
| Dark Pulse | 16.1-19.1% | 7.9-9.2% | 25-29.6% | 20.9-24.8% | 37.7-44.4% | 54.8-64.6% |
| Grass Knot | 64.7-76.3% | 31.5-36.9% | 8.6-10.2% | 20.9-24.6% | 75.4-88.7% | 6.9-7.9% |
| Water Shuriken (+1) | 74-87.1% | — | — | — | — | — |
| Gunk Shot (phys.) | — | — | — | 10.3-12.1% | — | **immune** |

**Revenge:** Kingambit +1 Sucker Punch **57.7-67.8%**.

### Kingambit — 252 HP / 252 Atk Adamant, Black Glasses, **+1 from Supreme Overlord on entry**
| Move | Great Tusk | Zamazenta | Toxapex | Dondozo | Mega Mawile | Corviknight | Ting-Lu |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Sucker Punch (+1 prio) | 18.2-21.4% | 14.9-17.8% | 47-55.3% | 23.2-27.4% | 36.2-42.4% | 46.5-54.8% | 15-17.6% |
| Kowtow Cleave | 19.4-22.8% | 16-18.8% | 50-58.9% | 24.8-29.2% | 38.5-45.1% | 49.5-58.3% | 15.9-18.7% |
| Iron Head | 30.6-36.2% | 25.3-29.9% | 19.4-23% | 9.7-11.5% | 60.5-71.1% | 19.3-22.8% | 25.1-29.6% |

At **+3** (entry +1 plus one Swords Dance) Sucker Punch does 30.4-35.7% to Great
Tusk — still a 4HKO.

**Revenge back into Kingambit (252 HP / 252 Def Impish):**
Great Tusk Close Combat **163.6-192.3%**. Zamazenta Close Combat **125.2-147.3%**.
Iron Valiant Close Combat **162.6-191.3%**. Mega Medicham High Jump Kick
**224-263.6%**. All four are guaranteed OHKOs on a *fully physically defensive*
Kingambit.

### Raging Bolt — 252 HP / 252 SpA Modest, Leftovers
| Move | Ting-Lu | Clodsire | Great Tusk | Dondozo | Heatran | Toxapex |
| --- | --- | --- | --- | --- | --- | --- |
| Thunderclap +0 (+1 prio) | **immune** | **immune** | **immune** | 74.4-87.5% | 23.8-28% | 49.7-58.2% |
| Draco Meteor +0 | 30.7-36.1% | 40.7-48.1% | 63.4-74.7% | 73.8-86.9% | 23.6-27.7% | 48.7-57.2% |
| Draco Meteor +2 CM | 61.2-71.9% | 40.7-48.1%* | 126.3-148.6% | 73.8-86.9%* | 46.9-54.9% | 96.7-113.8% |
| **Thunderclap +2 CM, RING TARGET** | **30.7-36.1%** | **20.7-24.4%** | **63.4-74.7%** | — | — | — |

\* Unaware. Note Draco Meteor drops the user's Special Attack two stages after
use, so the +2 rows are a one-shot, not a sustained state.

### Zamazenta — Dauntless Shield gives +1 Def on **every** entry
| Attack | Target | Damage |
| --- | --- | --- |
| Body Press, +1 Def (entry only) | Ting-Lu | 33.3-39.3% |
| Body Press, +1 Def | Kingambit | **93.3-109.9%** |
| Body Press, +3 Def (one Iron Defense) | Ting-Lu | 55.1-64.8% |
| Body Press, +5 Def (two Iron Defense) | Ting-Lu | 76.8-90.3% |
| Body Press, +5 Def | Dondozo *(Unaware)* | 12.9-15.3% |
| Close Combat, 252 Atk | Toxapex | 17.4-20.4% |
| Psychic Fangs, 252 Atk | Clodsire | 60.8-71.6% |
| Crunch, 252 Atk | Gholdengo | 48.7-57.4% |

**Special attackers into 252 HP / 252 Def Zamazenta (+1 Def):** Mega Diancie
Moonblast 62.1-72.9%. Iron Valiant Moonblast 65.5-77.1%. Mega Alakazam Psychic
62.9-74.2%. Mega Charizard Y Fire Blast in sun 58.2-68.6%. Tornadus-T Hurricane
**77.6-91.2%**. Mega Latios Draco Meteor 45.4-53.4%. **Every one of these is a
2HKO on the fully physically defensive spread** — Zamazenta's 115 Special
Defence is not helped at all by Dauntless Shield.

### Mega Mawile — 252 HP / 252 Atk Adamant, **no item (stone)**, Huge Power
| Move | Great Tusk | Ting-Lu | Dondozo | Toxapex | Corviknight | Zamazenta |
| --- | --- | --- | --- | --- | --- | --- |
| Play Rough +0 | 77-90.6% | 62.9-74.2% | 36.3-42.7% | 24.7-28.9% | 24.3-28.5% | 63.4-74.7% |
| Iron Head +0 | 34.1-40.3% | 27.9-33% | 16.1-19% | 21.7-25.7% | 21.5-25.5% | 28.1-33.2% |
| Play Rough +2 SD | **152.8-179.7%** | **125.1-147.2%** | 36.3-42.7%* | 48.7-57.6% | 48.5-57% | **125.8-147.9%** |

\* Dondozo has Unaware. **Focus Punch vs Heatran: 152.3-179.3%, guaranteed
OHKO.** Sucker Punch +2 vs Mega Alakazam: 371-437%. Great Tusk Headlong Rush
back into Mega Mawile: **140.5-165.5%, guaranteed OHKO**.

### Mega Medicham — 252 Atk Jolly, **no item (stone)**, Pure Power
| Move | Great Tusk | Ting-Lu | Toxapex | Dondozo | Clodsire | Corviknight | Zamazenta | Gholdengo |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| High Jump Kick (130, 90%) | 48.8-57.4% | 80-94.2% | 31.3-36.8% | 46.2-54.4% | 37.5-44.2% | 62-72.8% | 40.2-47.4% | **immune** |
| **Focus Punch† (150, 70%)** | 56.2-66.1% | 92.1-108.4% | 35.9-42.4% | 53.2-62.7% | 43.3-50.9% | 71.3-84% | 46.4-54.4% | **immune** |
| Zen Headbutt | 60.6-71.2% | **immune** | 77.6-91.4% | 28.6-33.5% | 93.1-109.5% | 19-22.5% | 50-58.8% | 30.2-35.4% |

**Quantifying the Focus Punch worry:** it is ~15% more damage than High Jump
Kick, at 70% accuracy against 90%. Expected damage per turn is **150 × 0.70 =
105** against **130 × 0.90 = 117** — so in RedGPT, High Jump Kick is still the
better move on average, and Focus Punch is a high-roll option rather than an
upgrade. Ice Punch OHKOs Mega Garchomp (105.5-124.3%).

### Kyurem-Black — 252 Atk Adamant, Loaded Dice (4-5 hits guaranteed)
| Move | Great Tusk | Ting-Lu | Dondozo | Toxapex | Corviknight | Zamazenta | Clodsire |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Icicle Spear†** | 80.6-94.5% | 65.5-77.7% | 18.8-21.8% | 24.7-29.6% | 50-58.8% | 33.5-39.9% | **120.7-142.2%** |
| **Scale Shot†** | 40.3-47.2% | 32.8-38.4% | 37.7-44.6% | 51-60.9% | 25-28.8% | 33.5-39.9% | 60.3-71.1% |
| Fusion Bolt | **immune** | **immune** | 38.5-45.2% | 52-61.2% | 51.5-60.5% | 16.8-19.6% | — |

At **+1 Dragon Dance**, Icicle Spear does 120.9-141.7% to Great Tusk. Great Tusk
Close Combat back into an offensive Kyurem-Black: see below. Kingambit +1 Sucker
Punch into it: Dark is neutral on Dragon/Ice.

### Mega Metagross — 252 Atk Jolly, **no item (stone)**, Tough Claws
| Move | Great Tusk | Ting-Lu | Dondozo | Toxapex | Corviknight | Zamazenta | Clodsire | Heatran |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Meteor Mash (→130) | 31.8-37.6% | 26.2-30.7% | 15.1-17.7% | 20.4-24% | 20.3-23.8% | 26.3-30.9% | 49.1-57.8% | 14.2-16.6% |
| Zen Headbutt (→104) | 51.4-60.4% | **immune** | 24.2-28.6% | 65.8-77.6% | 16.3-19% | 42.5-50% | 78.9-92.7% | 22.8-26.9% |
| Earthquake (no Tough Claws) | 16.4-19.4% | 13.5-15.7% | 15.5-18.3% | 42.1-49.7% | **immune** | 13.7-16% | 50.4-59.5% | **117.6-138.6%** |

Bullet Punch into Mega Alakazam: 52.8-61.9%. **Heatran Choice Specs Magma Storm
into Mega Metagross: 164.3-193.4%, guaranteed OHKO.** Great Tusk Close Combat:
45.3-53.6%, a 2HKO.

### Deoxys (base) — 252 SpA Timid, Life Orb
| Psycho Boost into | Damage |
| --- | --- |
| Great Tusk | **160.4-188.9% — OHKO** |
| Toxapex | **123.4-145.4% — OHKO** |
| Clodsire | **103.2-121.8% — OHKO** |
| Dondozo | 93.3-109.7% |
| Heatran | 29.5-35% |
| **Ting-Lu / Kingambit** | **immune** (Dark) |

Superpower (252 Atk) into Kingambit: **120.3-141.6%, OHKO**.

**How easily is Deoxys removed?** Every one of these is a guaranteed OHKO on a
4 HP Deoxys: Kingambit +1 Sucker Punch **381-448%**, Mega Mawile Sucker Punch
**236-278%**, Dragonite Choice Band Extreme Speed **105.4-124%**, Rillaboom
Choice Band Grassy Glide **171.1-201.2%**. Mega Metagross Bullet Punch is a
2HKO at 66.5-78.5%.

### Annihilape — 252 HP / 252 Atk Adamant, Leftovers
Rage Fist scales +50 BP per hit taken, capped at 350.

| Rage Fist at | Great Tusk | Ting-Lu | Dondozo | Toxapex | Corviknight | Clodsire | Zamazenta | Gholdengo |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 hits (50 BP) | 11.8-13.8% | 4.7-5.6% | 11.1-13.1% | 15.1-17.8% | 14.8-17.5% | 17.9-20.9% | 9.8-11.6% | 46.6-54.8% |
| 3 hits (200 BP) | 45.4-53.5% | 18.5-21.7% | 42.9-50.6% | 58.2-68.4% | 57.5-67.8% | 69.8-82.3% | 37.4-44.1% | **182-215%** |
| **+3 Bulk Up, 5 hits (300 BP)** | **168.7-198.4%** | 69.1-81.3% | 64.1-75.6% | **215.8-253.9%** | **214.3-252%** | **104.5-123.1%** | **138.7-163.1%** | **679-800%** |
| 6+ hits (capped 350 BP) | — | — | 74.8-88.1% | — | — | — | — | — |

Close Combat into Kingambit: **126-148%, OHKO**. Drain Punch into Ting-Lu:
28.5-33.5%.

---

## D. Important mechanical findings

**1. Protean and Libero grant NO STAB in RedGPT. This is almost certainly a bug
and it is the single most important item here.**

The retype happens — the log reads *"Greninja transformed into the Ice type!"*
before the move, and the live type array becomes `["Ice"]`. But STAB is computed
from the Pokémon's **base** types, which never change. Measured in real battles:

| Mega Greninja, Protean | as shipped | if STAB read the live type |
| --- | --- | --- |
| Ice Beam → Great Tusk | 223-261 | **335-392 (×1.50)** |
| Grass Knot → Dondozo | 380-444 | 504 (×1.33, clipped by max HP) |
| Dark Pulse → Dondozo | 191-223 | 191-223 (×1.00 — Dark is already a base type) |
| Hydro Pump → Great Tusk | 422-434 | 422-434 (×1.00 — Water is already a base type) |

The last two rows are the control: only moves whose type Protean *adds* change.
**So Protean is currently a defensive-typing ability with no offensive value.**
It affects **four OU entries — Greninja, Greninja-Mega, Cinderace (Libero) and
Meowscarada** — and also silences Soak, Conversion, Burn Up, Double Shock,
Reflect Type, Trick-or-Treat and Forest's Curse for STAB purposes.

**Judge Greninja-Mega on the "as shipped" numbers, and note explicitly that a
fix would multiply every off-type attack by 1.5.** If you would promote it only
under the fixed behaviour, say so — that is a useful answer.

**2. Two supposed counters are cleanly beaten, and two supposed threats are not.**
- **Ting-Lu does not check Magearna at all** once a Ring Target is on: Stored
  Power goes from a flat immunity to 48.9-57.5% at +3, and Kingambit from immune
  to a guaranteed OHKO at +3. The Dark immunity *is* the counterplay, and one
  item deletes it.
- **Heatran does not check Mega Mawile** — Focus Punch OHKOs it.
- **Kingambit's Sucker Punch is far weaker than its reputation here**: 18-21%
  into Great Tusk at +1, while Great Tusk OHKOs back with Close Combat. Its
  Steel typing means Sucker Punch is *resisted* by the Steel-types it wants to
  threaten, and its 50 Speed means the +1 priority is doing the work of ordinary
  speed rather than adding to it.
- **Mega Medicham's Focus Punch is worse than High Jump Kick in expectation**
  (105 vs 117 expected damage). The RedGPT redesign does not make it a problem.

**3. Zeraora-Mega is contained by exactly the Pokémon it cannot hit.** It has no
Ice, Water or Ground coverage of any kind, so its only answers to a Ground-type
are Fighting moves and Grass Knot — and Grass Knot is weight-based, so it does
6.5-7.5% to Heatran and 9-11% to Toxapex. Meanwhile everything that walls its
STAB OHKOs it back: Mega Garchomp, Great Tusk and even a +1 Kingambit Sucker
Punch are all guaranteed kills on its 88/75/80 defences. **Its Mega Stone also
locks it out of Ring Target**, the one item that would fix the Ground immunity.

**4. Raging Bolt has no coverage at all outside Electric and Dragon.** Its
answer to a Ground-type is Draco Meteor, which is a one-shot (it drops its own
Special Attack two stages). Ring Target restores Thunderclap against Ground —
30.7-36.1% into Ting-Lu at +2 — but that costs the item slot, is visible at
Team Preview, and is limited to one per team.

**5. The multi-hit standardisation matters more than it looks.** 2-5 hit moves
are a flat 25 BP each here, so Icicle Spear is ~125 effective BP and, with
Loaded Dice guaranteeing 4-5 hits, is Kyurem-Black's best physical Ice STAB by a
wide margin (80.6-94.5% into a fully defensive Great Tusk). Water Shuriken is
25 BP × 2-5 at **+1 priority**. Lucario gets Bone Rush as ~125 BP Ground
coverage. Do not judge any of these by their listed base power.

**6. Unaware is doing a lot of quiet work.** Dondozo and Clodsire ignore the
attacker's boosts entirely, which is why several `+2` and `+3` rows above are
identical to their `+0` rows. Any "it sets up and wins" argument has to survive
those two.

**7. A Mega Stone is a real opportunity cost.** No Mega set in this document has
a Life Orb, a Choice item, Leftovers or a Ring Target. For Zeraora-Mega and
Greninja-Mega in particular, that removes the item that would have patched their
worst matchup.

**8. Reported for completeness — the game disagrees with itself about the tier of
36 unranked Mega formes.** For a Mega Smogon has never ranked, `species.tier`
simply inherits the *base species'* tier, while the tier the game actually
enforces comes from the base's `formeItems` entry, which uses a nearest-neighbour
estimate. They differ for 36 formes, including two of your candidates:
**Zeraora-Mega reads UU as a species but is enforced as OU**, and
**Lucario-Mega-Z reads RU but is enforced as OU**. The enforced value (OU) is the
one that matters for legality and is the one used throughout this document; the
species field is display-only. Do not treat the discrepancy as evidence either
way — it is a reporting inconsistency, not a second opinion.

---

## E. What this data resolves

- **Zeraora-Mega**: coverage is fully enumerated; the Ground-type question is
  answered (Fighting and Grass Knot only); the "is it revenge-killed" question is
  answered (yes, by several OU staples, guaranteed); and the Ring Target
  containment question is answered (it cannot hold one).
- **Lucario-Mega-Z**: special STAB confirmed (Aura Sphere, Flash Cannon, Focus
  Blast), Nasty Plot confirmed, Adaptability doubling confirmed in the numbers,
  Focus Punch confirmed legal but irrelevant to a 100-Attack forme, and the
  priority-revenge question answered — Sucker Punch is a 2HKO, not a kill,
  because Steel resists Dark.
- **Magearna**: the entire setup and recovery package is enumerated (Calm Mind,
  Shift Gear, Iron Defense, Trick Room, Pain Split and Rest but **no Recover**),
  and the Ring Target Stored Power line is quantified against every relevant
  Dark-type.
- **Greninja-Mega**: coverage enumerated, no Nasty Plot, no Sucker Punch, and
  the Protean finding tells you the ability is currently offensively inert.
- **Kingambit**: full priority and coverage package, plus numbers in both
  directions showing it is outsped-and-OHKOed by four common OU Fighting-types.
- **Raging Bolt**: coverage enumerated and the Ground problem quantified.
- **Zamazenta**: Body Press and Iron Defense confirmed, Behemoth Bash and Swords
  Dance confirmed absent, and its special-defensive hole measured against six
  attackers.
- **Mega Mawile / Mega Medicham / Mega Metagross / Kyurem-Black / Deoxys /
  Annihilape**: full packages plus the specific numbers that test each one's
  case.

## F. Remaining unknowns

These cannot be settled from the project data and I have not guessed at them:

1. **No usage or ladder data exists for RedGPT**, so "how often is this actually
   a problem" is unanswerable. Every set above is a plausible build, not a
   measured standard.
2. **No speed tiers are given.** I have listed base Speed but not computed who
   outruns whom across the roster; if a verdict depends on a specific Speed
   race, say so and I can generate it.
3. **Whether the Protean/Libero STAB behaviour is intended or a bug is not yet
   decided.** Treat it as current behaviour, and flag any verdict that would
   flip if it changed.
4. **Hazard chip, switch cycles and multi-turn sequences are not modelled.** All
   numbers are single-attack; the KO columns include only Leftovers-class
   residuals.
5. **Abilities that need a live battle state are inert in these numbers** —
   Protosynthesis and Quark Drive are off (no sun, no Electric Terrain), and
   Soul-Heart starts at zero stacks.
6. **Only the defenders listed in §B were tested.** If a candidate's case rests
   on a wall not in that list, name it and I can add it.
