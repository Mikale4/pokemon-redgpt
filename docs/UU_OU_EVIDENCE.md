# RedGPT UU → OU and Meloetta — Verified Evidence Packet

**Generated from the live RedGPT project** by `tools/uu-ou-evidence.js`.
Every stat, movepool value, damage figure, speed number and legality result comes
from the running engine, the packaged data, the validator or the real damage
calculator.

**RedGPT has no usage, ladder, win-rate, tournament or popularity data**, so none
is quoted. Section T and section MEL10 list what genuinely cannot be determined.

---

## RESOLVED — both audits are decided and implemented

**Part I, UU → OU: no promotions.** All **91** UU entries were reviewed against
the OU bar and every one was retained. OU stays **93**, UU stays **91**, and the
ranked total is conserved at **1232**.

The one implementation action was provenance: the seven UU formes that were
sitting on `estimateFormeTier`'s guess were reviewed explicitly and **pinned at
the tier they already had**. **UU now contains 0 entries on an estimated tier.**

**Part II, Meloetta: no movement.** **Meloetta stays NU** and
**Meloetta-Pirouette stays RU** — but RU is now an explicitly reviewed
competitive verdict (`redgpt-override`) rather than the roster bookkeeping the NU
pass assigned when nothing could reach the forme. Relic Song remains refused in
NU because it reaches an RU battle-only forme.

**Everything below is the evidence those decisions were made from, regenerated
against the live data.** Section F records the seven pins; the task framing is
kept so the reasoning can be re-read against what it produced.

---

## Your task — two separate audits in one document

Answer them **separately**. They share a document because they were commissioned
together, not because they interact.

### Part I — the UU → OU pass (sections A–T)

> **Which current UU entries are too strong for UU and should move UP to OU?**

**This pass is upward only.** UU does have a tier beneath it, so unlike the ZU
packet this is a *scoping* decision rather than a structural fact — and the
reason is recorded in PROJECT_CONTEXT §10: *a downward pass and an upward pass on
the same rung at the same time cannot be attributed to either*. The downward half
(UU → RU) was asked separately in `UU_FINAL_EVIDENCE.md` and came back **move
nothing**. **Do not propose demotions here.**

The bar is section D: the current **OU** roster of 93.

**Most entries should stay put.** A promotion needs a reason OU cannot already
answer: an ability the imported tier could not have priced, a RedGPT redesign, a
role OU lacks, or an offensive or defensive ceiling the OU bar does not contain.
**A high BST alone does not promote** — UU's largest BST (700) equals OU's.

**There is no cap on how many entries may move — including zero.**

### Part II — Meloetta and Meloetta-Pirouette (sections MEL1–MEL10)

> **Is RU the right rung for Meloetta-Pirouette, and NU the right rung for
> Meloetta?**

This is **not** a rung audit. It is one Pokémon, two formes and one move. Until
this session Relic Song was an ordinary 75 BP sound move and Pirouette was
packaged-but-dead — nothing reached it, so **its tier was bookkeeping**. It is now
reachable, and the tier does one job and only one: **it decides the rung from
which Relic Song is legal.** Section M9 shows that gate working.

Both directions are open here, because neither forme sits on the floor.

---

## What each answer must contain

For each entry you move: exact name, species or forme, direction, confidence
(high / medium / low), two or three sentences naming the specific Pokémon it
matches or beats in the destination tier, and the numbers you relied on **with the
ability and item they assume**. Then list separately what you **considered and
deliberately left**.

**This packet contains no recommendations.** Every flag in sections G and S is a
mechanical reason to look, not a verdict.

---

## Context: what has already been asked, and what has not

| Pass | Result | Packet |
| --- | --- | --- |
| OU → Ubers | 3 promoted | `OU_ROSTER_FOR_TIERING.md` |
| OU → UU | 15 dropped | `UU_ROSTER_FOR_TIERING.md`, `UU_FORMAT_AUDIT.md` |
| UU (both ways) | **nothing moved** | `UU_FINAL_EVIDENCE.md` |
| RU (both ways) | 4 promoted, 0 dropped | `RU_FINAL_EVIDENCE.md` |
| NU (both ways) | 6 promoted, 1 dropped | `NU_FINAL_EVIDENCE.md` |
| PU (both ways) | 5 promoted, 0 dropped | `PU_FINAL_EVIDENCE.md` |
| trapping holders (whole ladder) | 4 moved, 5 left | `TRAPPING_ABILITY_TIER_AUDIT_PROMPT.md` |
| ZU (upward only — it is the floor) | 4 promoted | `ZU_FINAL_EVIDENCE.md` |
| untiered sweep | 473 placed; **ZU is the floor** | `UNTIERED_EVIDENCE.md` (resolved) |

**The upward UU question has been asked once before, and this is the honest
statement of it.** `UU_FINAL_EVIDENCE.md` asked both directions and returned
*move nothing*. **It did so when UU held 86 entries.** Five entries have joined UU
since that verdict, every one of them by promotion *from below* — so each was
judged too strong for the rung under it, and none has been examined against OU:

| Entry | Arrived from | In which pass | Why it moved |
| --- | --- | --- | --- |
| Regieleki | RU | the RU pass | Transistor, and RedGPT's own Speed ceiling |
| Metagross | RU | the RU pass | RedGPT's Light Metal redesign — **+1 Speed on every entry** |
| Raichu-Mega-Y | RU | the RU pass | an `estimated` forme, pinned on review |
| Pyroar-Mega | RU | the RU pass | an `estimated` forme, pinned on review |
| Chandelure | NU | the global trapping pass | Shadow Tag reaching 118 of 128 RU entries |

Their profiles are in section C with everything else, and they are not privileged
in the scan — this table is history, not a shortlist.

**Three watch-list entries from that verdict are also worth not re-litigating
blind:** Starmie-Mega, Porygon-Z and Delphox-Mega were examined and stayed.
**Delphox-Mega has since been pinned back to UU** after the ZU-floor change
drifted it to OU through the forme estimator, which is a provenance change rather
than a judgement.

**Four entries were surfaced during the OU → UU pass as *wrong-direction*
candidates and explicitly deferred**: **Mega Latias, Mega Gardevoir, Aegislash,
Mega Aerodactyl**. They were subsequently covered by the UU final audit's upward
half and did not move. They are in scope here.

---
# Part I — the UU → OU pass

## A. Current tier / rules snapshot

| Tier | Entries | of which formes | on an estimated tier |
| --- | --- | --- | --- |
| AG | 0 | 0 | 0 |
| Ubers | 63 | 25 | 4 |
| OU | 93 | 32 | 9 |
| UU | 91 | 23 | 0 |
| RU | 131 | 25 | 7 |
| NU | 67 | 2 | 0 |
| PU | 110 | 1 | 0 |
| ZU | 677 | 0 | 0 |

**Selectable species: 1138** (packaged 1273). Ranked entries: **1232**.

**UU format rules, read live and compared against OU rather than assumed:**

| Rule | UU | OU |
| --- | --- | --- |
| `maxTier` | **UU** | OU |
| `tera` | false | false |
| `mega` | true | true |
| `speciesClause` | true | true |
| `sleepClause` | true | true |
| `itemClause` | false | false |
| `evasionClause` | true | true |
| `ohkoClause` | true | true |
| `bannedMoves` | Fissure, Guillotine, Horn Drill, Sheer Cold, Double Team, Minimize | Fissure, Guillotine, Horn Drill, Sheer Cold, Double Team, Minimize |
| `bannedItems` / `bannedSpecies` | none / none | none / none |
| `bannedAbilities` | **none** | **none** |
| level / team | 100 / 6v6 | 100 / 6v6 |
| EV limit / per stat / IV max | 510-252 / 31 | 510-252 / 31 |

**UU is byte-identical to OU on every rule except `maxTier`.** There are no
UU-specific bans of any kind, and **neither format allows Terastallization** —
the Tera variants are separate formats (`OU (Tera)`, `Ubers (Tera)`), so nothing
in this audit should be priced with Tera in mind.

**Trapping abilities are legal in every competitive format** — verified live
across all 11, every one carrying `bannedAbilities: []`. The complete
list, discovered by `onTrapped` hook rather than by name:
**Shadow Tag, Arena Trap, Magnet Pull**.
**UU trapping holders: Chandelure.**

---
## B. RedGPT mechanics that decide tiering here

**Three facts separate UU from the rung this audit last examined in depth. Read
these before anything else.**

### 1. UU is Mega-heavy, and item freedom is NOT universal

**23 of UU's 91 entries are formes** — 25% of the rung, against ZU's 0%
and PU's 1. That changes how a candidate must be read, in **both** directions:

- **A forme entry's item slot is spent and cannot be recovered.** The stone is
  never consumed and `canRemoveItem` refuses every route to removing it — Knock
  Off, Trick, Switcheroo, Thief, Corrosive Gas. So a Mega has **no Heavy-Duty
  Boots, no Leftovers, no Choice item, no Life Orb, no Assault Vest and no Focus
  Sash**, and it costs its team the one Mega slot a side gets.
- **A species entry in UU may be barred from its own Mega.** By the
  Absol/Absolite rule the *item* is refused when the forme it produces outranks
  the format. Section R lists all 12 such routes, every one exercised through the
  real validator.

**Both halves matter to an upward judgement.** A Mega that looks OU-shaped is
already paying the largest opportunity cost in the game, and a species whose
Mega is banned in UU is being judged on strictly less than it can do elsewhere.

### 2. Seven UU entries sit on a tier nobody chose

**0 UU entries carry `tierSource: estimated`** — a nearest-neighbour guess from
`estimateFormeTier`, never reviewed by a person:



That is the softest evidence in the tier and section F inspects each one
directly. **The estimator has moved on its own three times on this programme** —
pinning a previously-unranked forme, moving a base that has an estimated forme,
and the ZU floor changing the fallback rule all shifted it — so an estimated tier
is a model output, not a decision.

### 3. Conditional attacks are quoted at full power, and that is a defect

**A profile line may quote a move that cannot fire when it matters.** The shared
profiler ranks a movepool by the power the engine will deliver and knows nothing
about `moveSpecialFailure`, the use-time gate.

**Every such line in this packet is annotated** — `**[conditional — …]**` — which
the sibling packets do **not** do. Section T states the measured scope.

The sharpest case, measured: **Last Resort is 140 BP and fails until every other
move in the set has been used.** Led with, it deals **0** damage
(`But it failed! — The opposing Blissey used Soft-Boiled! — But it failed!`). It is quoted as the Normal STAB of **Meloetta-Pirouette**, which is
half of this packet's subject.

**Do not treat an annotated move as worthless** — Last Resort genuinely fires on
turn four, and Fake Out is a real lead move. Treat it as a move with a cost the
raw number does not show.

**The annotation is reconciled against the project's own list rather than
hand-written.** `RandomTeams.AVOID` in `src/arena/random-teams.js` declares
**117 moves** as *"traps for a generated set"*, of which **39 are damaging** —
and it is maintained, its own comment recording that Poltergeist and Dream Eater
were **removed** from it when this project removed their conditions. The shared
profiler does not consult it. Every damaging entry that this packet quotes and
does **not** annotate is listed in section T rather than passed over.

**Some divergences run the other way, and are annotated `[RedGPT: …]`.** The
sharpest is **Skull Bash**: the games make it a two-turn move, and here it is
**absent from `Mechanics.CHARGE_MOVES`** with no other case in the engine, so it
is an ordinary **single-turn 130 BP** physical attack — measured at **409 damage** to
a Blissey on the turn it is used. It is quoted as the top physical coverage of
several UU entries. Dream Eater and Poltergeist are annotated for the same
reason in the opposite direction: a reader who knows the games will discount
them, and here they have no condition at all.

### Priority (all unconditional in this project)

| Move | Type | Cat | BP | Priority | Acc |
| --- | --- | --- | --- | --- | --- |
| Sucker Punch | Dark | Physical | **80** | **+1** | 100% |
| Thunderclap | Electric | Special | **70** | **+1** | 100% |
| First Impression | Bug | Physical | **90** | **+2** | 100% |
| Upper Hand | Fighting | Physical | **65** | **+3** | 100% |
| Grassy Glide | Grass | Physical | **70** | **+1** | 100% |

Grassy Glide's packaged priority is **0** — the +1 is added by the engine, so
reading the move data alone misses it.

**Restored base powers (live):** Overheat 140, Leaf Storm 140, Draco Meteor 140, Blizzard 120, Hydro Pump 120, Fire Blast 120, Thunder 120, Hurricane 120, Head Smash 150, Close Combat 120.

**Focus Punch is 150 BP at 70% accuracy and priority 0** — no Substitute
condition and no negative priority, so its expected power is 105.

**Multi-hit:** 2-5 hit moves are **25 BP per hit**, exactly-2-hit moves **50 BP
per hit**; Triple Axel is deliberately excluded. Skill Link forces the maximum
and the calculator honours it.

**Ring Target** lets the holder's attacks hit for **neutral** damage through a
**type** immunity — not an ability immunity. One per team, visible from turn one.
**A forme entry cannot hold it**, which is the item-freedom point applied to the
sharpest item in the game.

**Toxic Orb and Flame Orb fire on ENTRY**, so Guts / Poison Heal / Quick Feet
holders are boosted from the turn they arrive.

**Ability redesigns that reach UU holders**, verified live:

| Ability | UU holders | Live packaged description |
| --- | --- | --- |
| **Light Metal** | Metagross, Scizor | _Halves this Pokemon's weight; +1 Speed on entry._ |
| **Download** | Porygon-Z | _Raises the Pokemon's Attack and Sp. Atk when it enters battle._ |
| **Contrary** | Enamorus, Serperior, Staraptor-Mega | _If this Pokemon has a stat stage raised it is lowered instead, and vice versa._ |
| **Unaware** | Clefable | _This Pokemon ignores other Pokemon's stat stages when taking or doing damage._ |
| **Magic Bounce** | Hatterene, Sableye-Mega | _This Pokemon blocks certain Status moves and bounces them back to the user._ |
| **Transistor** | Regieleki | _This Pokemon's Electric-type moves have their power multiplied by 1.5._ |
| **Pixilate** | Altaria-Mega, Gardevoir-Mega | _This Pokemon's Normal-type moves become Fairy type and have 1.3x power._ |
| **Mold Breaker** | Emboar-Mega, Excadrill, Hawlucha, Haxorus | _This Pokemon's moves ignore the target's Ability, including Dark and Fairy Aura._ |
| **Magic Guard** | Alakazam, Clefable | _Only takes damage from attacks. Immune to Toxic Spikes and full paralysis._ |

**Two of the last three passes turned on exactly this** — Light Metal on
Duraludon and Heavy Metal on Copperajah both moved NU → RU because RedGPT
redesigned them into entry boosts rather than weight modifiers, and Metagross
reached UU the same way. **It is the first thing to look for.**

---
## C. Full UU competitive profiles

All **91** current UU entries, engine-resolved. This is the tier
under review. Conditional attacks are annotated; trapping holders are marked in
bold on their own line; every entry states whether its item slot is free.

**Aegislash** — species, **UU**, source: imported (natdex)
  Steel/Ghost | BST 520 (60/50/150/50/150/60) | Abilities: Stance Change
  Engine stats @252 (neutral/positive): Stance Change: Atk 199/218, SpA 199/218, Spe 219/240
  Item: **free**
  STAB: Steel Steel Beam 140S · Ghost Shadow Ball 80S
  Physical coverage: Rock Head Smash 150P, Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Return 102P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Flying Air Slash 75S, Normal Hidden Power 60S, Electric Shock Wave 60S
  Setup: Autotomize, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Priority: Shadow Sneak 40P Ghost (+1)
  Status: Toxic
  Trapping moves: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Destiny Bond, Protect, Reflect, Substitute
  Notable: Substitute

**Aegislash-Blade** — species, **UU**, source: imported (natdex)
  Steel/Ghost | BST 520 (60/150/50/150/50/60) | Abilities: Stance Change
  Engine stats @252 (neutral/positive): Stance Change: Atk 399/438, SpA 399/438, Spe 219/240
  Item: **free**
  STAB: Steel Steel Beam 140S · Ghost Shadow Ball 80S
  Physical coverage: Rock Head Smash 150P, Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Return 102P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Flying Air Slash 75S, Normal Hidden Power 60S, Electric Shock Wave 60S
  Setup: Autotomize, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Priority: Shadow Sneak 40P Ghost (+1)
  Status: Toxic
  Trapping moves: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Destiny Bond, Protect, Reflect, Substitute
  Notable: Substitute

**Aerodactyl-Mega** — forme, **UU**, source: imported (natdex)
  Rock/Flying | BST 615 (80/135/85/70/95/150) | Abilities: Tough Claws
  Engine stats @252 (neutral/positive): Tough Claws: Atk 369/405, SpA 239/262, Spe 399/438
  Item: **forced — Aerodactylite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Fire Fire Blast 120S, Dragon Dragon Pulse 90S, Ground Earth Power 90S, Normal Razor Wind 80 (charge)S **[power — two-turn — it charges first (the profiler tags it `(charge)`)]**, Ghost Ominous Wind 60S
  Setup: Agility, Dragon Dance, Hone Claws, Rock Polish
  Reliable recovery: Rest, Roost
  Hazards: Stealth Rock
  Removal: Defog
  Phazing: Roar, Whirlwind
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Protect, Reflect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Alakazam** — species, **UU**, source: imported (natdex)
  Psychic | BST 500 (55/50/45/135/95/120) | Abilities: Synchronize / Inner Focus / Magic Guard
  Engine stats @252 (neutral/positive): Synchronize: Atk 199/218, SpA 369/405, Spe 339/372 — Inner Focus: Atk 199/218, SpA 369/405, Spe 339/372 — Magic Guard: Atk 199/218, SpA 369/405, Spe 339/372
  Item: **free** — but its own Alakazite is **refused in UU** (it would make Alakazam-Mega, OU)
  STAB: Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Zap Cannon 120S, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Normal Tri Attack 80S
  Setup: Barrier, Calm Mind, Nasty Plot
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Drain Punch, Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Disable, Encore, Gravity, Knock Off, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room, Focus Punch

**Altaria-Mega** — forme, **UU**, source: imported (natdex)
  Dragon/Fairy | BST 590 (75/110/110/110/105/80) | Abilities: Pixilate
  Engine stats @252 (neutral/positive): Pixilate: Atk 319/350, SpA 319/350, Spe 259/284
  Item: **forced — Altarianite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Dragon Draco Meteor 140S · Fairy Double-Edge 156P
  Physical coverage: Flying Sky Attack 140 (charge)P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Thief 60P, Grass Trailblaze 50P, Fighting Rock Smash 40P
  Special coverage: Fire Fire Blast 120S, Flying Hurricane 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Ice Ice Beam 95S, Ghost Ominous Wind 60S
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

**Amoonguss** — species, **UU**, source: imported (natdex)
  Grass/Poison | BST 464 (114/85/70/85/80/30) | Abilities: Effect Spore / Regenerator
  Engine stats @252 (neutral/positive): Effect Spore: Atk 269/295, SpA 269/295, Spe 159/174 — Regenerator: Atk 269/295, SpA 269/295, Spe 159/174
  Item: **free**
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Return 102P, Dark Foul Play 95P, Ground Stomping Tantrum 75P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Bug Pollen Puff 90S, Normal Tera Blast 80S, Ghost Hex 65S
  Setup: Defense Curl, Growth
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Giga Drain, Mega Drain
  Status: Poison Powder, Spore, Stun Spore, Toxic
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Clear Smog, Protect, Substitute
  Notable: Substitute

**Archaludon** — species, **UU**, source: imported (natdex)
  Steel/Dragon | BST 600 (90/105/130/125/65/85) | Abilities: Stamina / Sturdy / Stalwart
  Engine stats @252 (neutral/positive): Stamina: Atk 309/339, SpA 349/383, Spe 269/295 — Sturdy: Atk 309/339, SpA 349/383, Spe 269/295 — Stalwart: Atk 309/339, SpA 349/383, Spe 269/295
  Item: **free**
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

**Azumarill** — species, **UU**, source: imported (natdex)
  Water/Fairy | BST 420 (100/50/80/60/80/50) | Abilities: Thick Fat / Huge Power / Sap Sipper
  Engine stats @252 (neutral/positive): Thick Fat: Atk 199/218, SpA 219/240, Spe 199/218 — Huge Power: Atk 398/436, SpA 219/240, Spe 199/218 — Sap Sipper: Atk 199/218, SpA 219/240, Spe 199/218
  Item: **free**
  STAB: Water Aqua Tail 90P · Fairy Play Rough 90P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Steel Steel Roller 130P **[conditional — fails with no terrain up]**, Normal Double-Edge 120P, Ground Dig 100 (charge)P, Flying Bounce 85 (charge)P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Psychic Future Sight 120S, Normal Hyper Voice 90S, Grass Grass Knot 60S, Ground Mud Shot 55S
  Setup: Amnesia, Defense Curl, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Priority: Aqua Jet 40P Water (+1)
  Status: Sing, Toxic
  Weather/terrain: Hail, Misty Terrain, Rain Dance, Snowscape
  Utility: Encore, Knock Off, Light Screen, Perish Song, Protect, Substitute
  Notable: Knock Off, Encore, Substitute, Focus Punch

**Bisharp** — species, **UU**, source: imported (natdex)
  Dark/Steel | BST 490 (65/125/100/60/70/70) | Abilities: Defiant / Inner Focus / Pressure
  Engine stats @252 (neutral/positive): Defiant: Atk 349/383, SpA 219/240, Spe 239/262 — Inner Focus: Atk 349/383, SpA 219/240, Spe 239/262 — Pressure: Atk 349/383, SpA 219/240, Spe 239/262
  Item: **free**
  STAB: Dark Foul Play 95P · Steel Iron Head 80P
  Physical coverage: Normal Return 102P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Flying Air Slash 75S, Grass Grass Knot 60S
  Setup: Hone Claws, Iron Defense, Rock Polish, Swords Dance
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1)
  Hazards: Stealth Rock
  Status: Thunder Wave, Toxic
  Trapping moves: Mean Look
  Weather/terrain: Rain Dance, Sandstorm
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Blacephalon** — species, **UU**, source: imported (natdex)
  Fire/Ghost | BST 570 (53/127/53/151/79/107) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 353/388, SpA 401/441, Spe 313/344
  Item: **free**
  STAB: Fire Mind Blown 150S · Ghost Shadow Ball 80S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Rock Rock Blast 25x2-5P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S
  Setup: Calm Mind
  Reliable recovery: Rest
  Status: Hypnosis, Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Encore, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Substitute, Taunt, Trick
  Notable: Knock Off, Trick, Encore, Taunt, Substitute

**Blissey** — species, **UU**, source: imported (natdex)
  Normal | BST 540 (255/10/10/75/135/55) | Abilities: Natural Cure / Serene Grace / Healer
  Engine stats @252 (neutral/positive): Natural Cure: Atk 119/130, SpA 249/273, Spe 209/229 — Serene Grace: Atk 119/130, SpA 249/273, Spe 209/229 — Healer: Atk 119/130, SpA 249/273, Spe 209/229
  Item: **free**
  STAB: Normal Hyper Voice 90S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Ground Earthquake 100P, Steel Iron Tail 100P, Electric Wild Charge 90P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**
  Setup: Calm Mind, Defense Curl, Work Up
  Reliable recovery: Rest, Soft-Boiled
  Drain/Rest-only: Drain Punch, Dream Eater
  Hazards: Stealth Rock
  Pivot: Teleport
  Status: Sing, Thunder Wave, Toxic
  Cleric: Aromatherapy, Heal Bell, Life Dew, Wish
  Trapping moves: Block
  Weather/terrain: Electric Terrain, Hail, Rain Dance, Sandstorm, Snowscape, Sunny Day
  Utility: Gravity, Healing Wish, Light Screen, Protect, Reflect, Safeguard, Substitute, Trick
  Notable: Trick, Substitute, Focus Punch

**Buzzwole** — species, **UU**, source: imported (natdex)
  Bug/Fighting | BST 570 (107/139/139/53/53/79) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 377/414, SpA 205/225, Spe 257/282
  Item: **free**
  STAB: Bug Leech Life 80P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Dragon Outrage 120P, Normal Return 102P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P
  Special coverage: Normal Hidden Power 60S
  Setup: Bulk Up, Harden, Work Up
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Drain Punch, Leech Life
  Status: Toxic
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute, Focus Punch

**Celesteela** — species, **UU**, source: imported (natdex)
  Steel/Flying | BST 570 (97/101/103/107/101/61) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 301/331, SpA 313/344, Spe 221/243
  Item: **free**
  STAB: Steel Steel Beam 140S · Flying Acrobatics 110P
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Bug Megahorn 120P, Fighting Superpower 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Grass Seed Bomb 80P
  Special coverage: Fire Fire Blast 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Normal Hidden Power 60S, Electric Shock Wave 60S
  Setup: Autotomize, Harden, Iron Defense
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Giga Drain, Mega Drain
  Status: Toxic
  Trapping moves: Block
  Utility: Gravity, Leech Seed, Protect, Substitute
  Notable: Substitute

**Chandelure** — species, **UU**, source: override
  Ghost/Fire | BST 520 (60/55/90/145/90/80) | Abilities: Flash Fire / Flame Body / Infiltrator / Shadow Tag
  Engine stats @252 (neutral/positive): Flash Fire: Atk 209/229, SpA 389/427, Spe 259/284 — Flame Body: Atk 209/229, SpA 389/427, Spe 259/284 — Infiltrator: Atk 209/229, SpA 389/427, Spe 259/284 — Shadow Tag: Atk 209/229, SpA 389/427, Spe 259/284
  **TRAPPING ABILITY: Shadow Tag** (optional — one of 4)
  Item: **free**
  STAB: Ghost Shadow Ball 80S · Fire Overheat 140S
  Physical coverage: Normal Return 102P, Dark Lash Out 75P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S
  Setup: Acid Armor, Calm Mind
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Clear Smog, Haze, Memento, Pain Split, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

**Chandelure-Mega** — forme, **UU**, source: override
  Ghost/Fire | BST 620 (60/75/110/175/110/90) | Abilities: Infiltrator
  Engine stats @252 (neutral/positive): Infiltrator: Atk 249/273, SpA 449/493, Spe 279/306
  Item: **forced — Chandelurite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Ghost Shadow Ball 80S · Fire Overheat 140S
  Physical coverage: Normal Return 102P, Dark Lash Out 75P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S
  Setup: Acid Armor, Calm Mind
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Clear Smog, Haze, Memento, Pain Split, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

**Chansey** — species, **UU**, source: imported (natdex)
  Normal | BST 450 (250/5/5/35/105/50) | Abilities: Natural Cure / Serene Grace / Healer
  Engine stats @252 (neutral/positive): Natural Cure: Atk 109/119, SpA 169/185, Spe 199/218 — Serene Grace: Atk 109/119, SpA 169/185, Spe 199/218 — Healer: Atk 109/119, SpA 169/185, Spe 199/218
  Item: **free**
  STAB: Normal Hyper Voice 90S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Ground Earthquake 100P, Steel Iron Tail 100P, Electric Wild Charge 90P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**
  Setup: Calm Mind, Defense Curl, Work Up
  Reliable recovery: Rest, Soft-Boiled
  Drain/Rest-only: Drain Punch, Dream Eater
  Hazards: Stealth Rock
  Pivot: Teleport
  Status: Sing, Thunder Wave, Toxic
  Cleric: Aromatherapy, Heal Bell, Life Dew, Wish
  Weather/terrain: Electric Terrain, Hail, Rain Dance, Sandstorm, Snowscape, Sunny Day
  Utility: Gravity, Healing Wish, Light Screen, Protect, Reflect, Safeguard, Substitute
  Notable: Substitute, Focus Punch

**Clefable** — species, **UU**, source: imported (natdex)
  Fairy | BST 483 (95/70/73/95/90/60) | Abilities: Cute Charm / Magic Guard / Unaware
  Engine stats @252 (neutral/positive): Cute Charm: Atk 239/262, SpA 289/317, Spe 219/240 — Magic Guard: Atk 239/262, SpA 289/317, Spe 219/240 — Unaware: Atk 239/262, SpA 289/317, Spe 219/240
  Item: **free** — but its own Clefablite is **refused in UU** (it would make Clefable-Mega, OU)
  STAB: Fairy Misty Explosion 100S **[power — the user **faints**]**
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Flying Dual Wingbeat 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S
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

**Conkeldurr** — species, **UU**, source: imported (natdex)
  Fighting | BST 505 (105/140/95/55/65/45) | Abilities: Guts / Sheer Force / Iron Fist
  Engine stats @252 (neutral/positive): Guts: Atk 379/416, SpA 209/229, Spe 189/207 — Sheer Force: Atk 379/416, SpA 209/229, Spe 189/207 — Iron Fist: Atk 379/416, SpA 209/229, Spe 189/207
  Item: **free**
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Hard Press 100P, Rock Stone Edge 100P, Poison Poison Jab 80P, Fire Fire Punch 75P
  Special coverage: Normal Tera Blast 80S, Grass Grass Knot 60S
  Setup: Bulk Up, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Mach Punch 40P Fighting (+1)
  Removal: Defog
  Status: Toxic
  Trapping moves: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Focus Punch

**Corviknight** — species, **UU**, source: override
  Flying/Steel | BST 495 (98/87/105/53/85/67) | Abilities: Pressure / Unnerve / Mirror Armor
  Engine stats @252 (neutral/positive): Pressure: Atk 273/300, SpA 205/225, Spe 233/256 — Unnerve: Atk 273/300, SpA 205/225, Spe 233/256 — Mirror Armor: Atk 273/300, SpA 205/225, Spe 233/256
  Item: **free**
  STAB: Flying Sky Attack 140 (charge)P · Steel Steel Beam 140S
  Physical coverage: Normal Double-Edge 120P, Fighting Body Press 80P, Bug U-turn 70P, Dark Assurance 60P **[power — doubles to 120 if the target has already taken damage this turn]**
  Special coverage: Normal Tera Blast 80S
  Setup: Agility, Bulk Up, Hone Claws, Iron Defense, Nasty Plot, Work Up
  Reliable recovery: Rest, Roost
  Removal: Defog
  Pivot: U-turn
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Light Screen, Protect, Reflect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Delphox-Mega** — forme, **UU**, source: override
  Fire/Psychic | BST 634 (75/69/72/159/125/134) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 237/260, SpA 417/458, Spe 367/403
  Item: **forced — Delphoxite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
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

**Dragalge-Mega** — forme, **UU**, source: override
  Poison/Dragon | BST 594 (65/85/105/132/163/44) | Abilities: Regenerator
  Engine stats @252 (neutral/positive): Regenerator: Atk 269/295, SpA 363/399, Spe 187/205
  Item: **forced — Dragalgite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
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

**Drampa-Mega** — forme, **UU**, source: override
  Normal/Dragon | BST 585 (78/85/110/160/116/36) | Abilities: Berserk
  Engine stats @252 (neutral/positive): Berserk: Atk 269/295, SpA 419/460, Spe 171/188
  Item: **forced — Drampanite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Normal Hyper Voice 90S · Dragon Draco Meteor 140S
  Physical coverage: Fighting Superpower 120P, Ground Earthquake 100P, Fairy Play Rough 90P, Flying Fly 90 (charge)P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**, Rock Rock Slide 75P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Flying Hurricane 120S, Water Hydro Pump 120S, Electric Thunder 120S
  Setup: Amnesia, Calm Mind, Dragon Dance, Work Up
  Reliable recovery: Rest, Roost
  Removal: Defog
  Phazing: Dragon Tail, Roar
  Status: Glare, Thunder Wave, Toxic
  Trapping moves: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Light Screen, Protect, Safeguard, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Emboar-Mega** — forme, **UU**, source: override
  Fire/Fighting | BST 628 (110/148/75/110/110/75) | Abilities: Mold Breaker
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 395/434, SpA 319/350, Spe 249/273
  Item: **forced — Emboarite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Hard Press 100P, Electric Wild Charge 90P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**
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

**Enamorus** — species, **UU**, source: imported (natdex)
  Fairy/Flying | BST 580 (74/115/70/135/80/106) | Abilities: Cute Charm / Contrary
  Engine stats @252 (neutral/positive): Cute Charm: Atk 329/361, SpA 369/405, Spe 311/342 — Contrary: Atk 329/361, SpA 369/405, Spe 311/342
  Item: **free**
  STAB: Fairy Misty Explosion 100S **[power — the user **faints**]** · Flying Fly 90 (charge)P
  Physical coverage: Dragon Outrage 120P, Fighting Superpower 120P, Normal Take Down 90P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Ghost Astonish 30P
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Fire Mystical Fire 75S
  Setup: Agility, Calm Mind, Iron Defense
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Weather/terrain: Grassy Terrain, Misty Terrain, Rain Dance, Sunny Day
  Utility: Healing Wish, Protect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

**Excadrill** — species, **UU**, source: imported (natdex)
  Ground/Steel | BST 508 (110/135/60/50/65/88) | Abilities: Sand Rush / Sand Force / Mold Breaker
  Engine stats @252 (neutral/positive): Sand Rush: Atk 369/405, SpA 199/218, Spe 275/302 — Sand Force: Atk 369/405, SpA 199/218, Spe 275/302 — Mold Breaker: Atk 369/405, SpA 199/218, Spe 275/302
  Item: **free** — but its own Excadrite is **refused in UU** (it would make Excadrill-Mega, OU)
  STAB: Ground Earthquake 100P · Steel Iron Head 80P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Poison Poison Jab 80P, Fighting Submission 80P, Dark Throat Chop 80P, Bug X-Scissor 80P, Rock Rock Blast 25x2-5P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Bomb 90S, Normal Tera Blast 80S
  Setup: Hone Claws, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Removal: Rapid Spin
  Status: Toxic
  Weather/terrain: Sandstorm, Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute

**Gardevoir-Mega** — forme, **UU**, source: imported (natdex)
  Psychic/Fairy | BST 618 (68/85/65/165/135/100) | Abilities: Pixilate
  Engine stats @252 (neutral/positive): Pixilate: Atk 269/295, SpA 429/471, Spe 299/328
  Item: **forced — Gardevoirite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Psychic Future Sight 120S · Fairy Hyper Voice 117S
  Physical coverage: Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Ghost Shadow Sneak 40P
  Special coverage: Fighting Focus Blast 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S, Bug Signal Beam 75S
  Setup: Calm Mind, Defense Curl
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss, Dream Eater
  Priority: Shadow Sneak 40P Ghost (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Teleport
  Status: Hypnosis, Sing, Thunder Wave, Toxic, Will-O-Wisp
  Cleric: Heal Bell, Life Dew, Wish
  Trapping moves: Mean Look
  Weather/terrain: Misty Terrain, Psychic Terrain, Rain Dance, Sunny Day
  Utility: Destiny Bond, Disable, Encore, Gravity, Healing Wish, Knock Off, Light Screen, Magic Coat, Memento, Pain Split, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room

**Gengar** — species, **UU**, source: imported (natdex)
  Ghost/Poison | BST 500 (60/65/60/130/75/110) | Abilities: Cursed Body / Levitate
  Engine stats @252 (neutral/positive): Cursed Body: Atk 229/251, SpA 359/394, Spe 319/350 — Levitate: Atk 229/251, SpA 359/394, Spe 319/350
  Item: **free** — but its own Gengarite is **refused in UU** (it would make Gengar-Mega, Ubers)
  STAB: Ghost Shadow Ball 80S · Poison Sludge Wave 95S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Dark Foul Play 95P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S
  Setup: Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Dream Eater, Giga Drain, Mega Drain
  Priority: Sucker Punch 80P Dark (+1)
  Hazards: Toxic Spikes
  Status: Hypnosis, Thunder Wave, Toxic, Will-O-Wisp
  Trapping moves: Mean Look
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Clear Smog, Destiny Bond, Disable, Encore, Haze, Knock Off, Pain Split, Perish Song, Protect, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room, Focus Punch

**Glimmora** — species, **UU**, source: imported (natdex)
  Rock/Poison | BST 525 (83/55/90/130/81/86) | Abilities: Toxic Debris / Corrosion
  Engine stats @252 (neutral/positive): Toxic Debris: Atk 209/229, SpA 359/394, Spe 271/298 — Corrosion: Atk 209/229, SpA 359/394, Spe 271/298
  Item: **free** — but its own Glimmoranite is **refused in UU** (it would make Glimmora-Mega, OU)
  STAB: Rock Meteor Beam 120 (charge)S · Poison Sludge Wave 95S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Ground Sand Tomb 35P
  Special coverage: Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Normal Tera Blast 80S
  Setup: Acid Armor, Harden, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Hazards: Spikes, Stealth Rock, Toxic Spikes
  Removal: Mortal Spin
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Light Screen, Memento, Protect, Reflect, Substitute
  Notable: Substitute

**Goodra-Hisui** — species, **UU**, source: imported (natdex)
  Steel/Dragon | BST 600 (80/100/100/110/150/60) | Abilities: Sap Sipper / Shell Armor / Gooey
  Engine stats @252 (neutral/positive): Sap Sipper: Atk 299/328, SpA 319/350, Spe 219/240 — Shell Armor: Atk 299/328, SpA 319/350, Spe 219/240 — Gooey: Atk 299/328, SpA 319/350, Spe 219/240
  Item: **free**
  STAB: Steel Steel Beam 140S · Dragon Draco Meteor 140S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Mega Kick 120P, Grass Power Whip 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Poison Sludge Wave 95S
  Setup: Acid Armor, Shelter
  Reliable recovery: Rest
  Drain/Rest-only: Absorb
  Priority: Feint 50P Normal (+2)
  Phazing: Dragon Tail
  Status: Toxic
  Cleric: Life Dew
  Weather/terrain: Hail, Rain Dance, Sandstorm, Sunny Day
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute, Focus Punch

**Gyarados** — species, **UU**, source: override
  Water/Flying | BST 540 (95/125/79/60/100/81) | Abilities: Intimidate / Moxie
  Engine stats @252 (neutral/positive): Intimidate: Atk 349/383, SpA 219/240, Spe 261/287 — Moxie: Atk 349/383, SpA 219/240, Spe 261/287
  Item: **free** — but its own Gyaradosite is **refused in UU** (it would make Gyarados-Mega, OU)
  STAB: Water Aqua Tail 90P · Flying Bounce 85 (charge)P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Dragon Outrage 120P, Grass Power Whip 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S, Normal Uproar 90S, Dark Dark Pulse 80S
  Setup: Dragon Dance
  Reliable recovery: Rest
  Phazing: Dragon Tail, Roar
  Status: Thunder Wave, Toxic
  Weather/terrain: Hail, Rain Dance, Sandstorm, Sunny Day
  Utility: Protect, Reflect, Substitute, Taunt
  Notable: Taunt, Substitute

**Hatterene** — species, **UU**, source: override
  Psychic/Fairy | BST 510 (57/90/95/136/103/29) | Abilities: Healer / Anticipation / Magic Bounce
  Engine stats @252 (neutral/positive): Healer: Atk 279/306, SpA 371/408, Spe 157/172 — Anticipation: Atk 279/306, SpA 371/408, Spe 157/172 — Magic Bounce: Atk 279/306, SpA 371/408, Spe 157/172
  Item: **free**
  STAB: Psychic Future Sight 120S · Fairy Misty Explosion 100S **[power — the user **faints**]**
  Physical coverage: Grass Power Whip 120P, Normal Facade 70P, Ghost Shadow Claw 70P, Dark Brutal Swing 60P, Electric Nuzzle 20P
  Special coverage: Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Fire Mystical Fire 75S
  Setup: Agility, Calm Mind, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss, Giga Drain
  Pivot: Baton Pass
  Status: Nuzzle, Thunder Wave
  Cleric: Aromatherapy, Life Dew
  Weather/terrain: Misty Terrain, Psychic Terrain
  Utility: Gravity, Healing Wish, Light Screen, Pain Split, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Baton Pass, Trick Room

**Hawlucha** — species, **UU**, source: override
  Fighting/Flying | BST 500 (78/92/75/74/63/118) | Abilities: Limber / Unburden / Mold Breaker
  Engine stats @252 (neutral/positive): Limber: Atk 283/311, SpA 247/271, Spe 335/368 — Unburden: Atk 283/311, SpA 247/271, Spe 335/368 — Mold Breaker: Atk 283/311, SpA 247/271, Spe 335/368
  Item: **free** — but its own Hawluchanite is **refused in UU** (it would make Hawlucha-Mega, OU)
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Steel Iron Head 80P, Bug Lunge 80P
  Special coverage: Normal Uproar 90S, Grass Grass Knot 60S
  Setup: Agility, Bulk Up, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2)
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Trapping moves: Mean Look
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Encore, Protect, Substitute, Tailwind, Taunt
  Notable: Encore, Taunt, Substitute, Baton Pass, Tailwind, Focus Punch

**Haxorus** — species, **UU**, source: imported (natdex)
  Dragon | BST 540 (76/147/90/60/70/97) | Abilities: Rivalry / Mold Breaker / Unnerve
  Engine stats @252 (neutral/positive): Rivalry: Atk 393/432, SpA 219/240, Spe 293/322 — Mold Breaker: Atk 393/432, SpA 219/240, Spe 293/322 — Unnerve: Atk 393/432, SpA 219/240, Spe 293/322
  Item: **free**
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

**Heracross-Mega** — forme, **UU**, source: imported (natdex)
  Bug/Fighting | BST 600 (80/185/115/40/105/75) | Abilities: Skill Link
  Engine stats @252 (neutral/positive): Skill Link: Atk 469/515, SpA 179/196, Spe 249/273
  Item: **forced — Heracronite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Bug Megahorn 120P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**, Grass Bullet Seed 25x2-5P, Ghost Shadow Claw 70P
  Special coverage: Normal Tera Blast 80S, Poison Venoshock 65S
  Setup: Bulk Up, Harden, Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Vacuum Wave 40S Fighting (+1)
  Hazards: Spikes
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute, Focus Punch

**Hippowdon** — species, **UU**, source: imported (natdex)
  Ground | BST 525 (108/112/118/68/72/47) | Abilities: Sand Stream / Sand Force
  Engine stats @252 (neutral/positive): Sand Stream: Atk 323/355, SpA 235/258, Spe 193/212 — Sand Force: Atk 323/355, SpA 235/258, Spe 193/212
  Item: **free**
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

**Hydrapple** — species, **UU**, source: imported (natdex)
  Grass/Dragon | BST 540 (106/80/110/120/80/44) | Abilities: Supersweet Syrup / Regenerator / Sticky Hold
  Engine stats @252 (neutral/positive): Supersweet Syrup: Atk 259/284, SpA 339/372, Spe 187/205 — Regenerator: Atk 259/284, SpA 339/372, Spe 187/205 — Sticky Hold: Atk 259/284, SpA 339/372, Spe 187/205
  Item: **free**
  STAB: Grass Leaf Storm 140S · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Fighting Body Press 80P, Dark Sucker Punch 80P, Bug Bug Bite 60P, Steel Heavy Slam 40P
  Special coverage: Water Hydro Pump 120S, Ground Earth Power 90S, Bug Pollen Puff 90S, Normal Uproar 90S
  Setup: Defense Curl, Growth, Nasty Plot, Withdraw
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Giga Drain
  Priority: Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]**
  Phazing: Dragon Tail
  Status: Yawn
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Protect, Reflect, Substitute
  Notable: Substitute

**Hydreigon** — species, **UU**, source: imported (natdex)
  Dark/Dragon | BST 600 (92/105/90/125/90/98) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 309/339, SpA 349/383, Spe 295/324
  Item: **free**
  STAB: Dark Crunch 80P · Dragon Draco Meteor 140S
  Physical coverage: Rock Head Smash 150P, Fighting Superpower 120P, Flying Acrobatics 110P, Normal Return 102P, Ground Earthquake 100P, Steel Iron Tail 100P
  Special coverage: Poison Belch 120S **[conditional — fails until the user has eaten a Berry]**, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Ground Earth Power 90S, Normal Hyper Voice 90S
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

**Iron Boulder** — species, **UU**, source: imported (natdex)
  Rock/Psychic | BST 590 (90/120/80/68/108/124) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 339/372, SpA 235/258, Spe 347/381
  Item: **free**
  STAB: Rock Stone Edge 100P · Psychic Zen Headbutt 80P
  Physical coverage: Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Ground Earthquake 100P, Electric Wild Charge 90P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S
  Setup: Agility, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Priority: Quick Attack 40P Normal (+1)
  Weather/terrain: Electric Terrain, Sandstorm
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Iron Crown** — species, **UU**, source: override
  Steel/Psychic | BST 590 (90/72/100/122/108/98) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 243/267, SpA 343/377, Spe 295/324
  Item: **free**
  STAB: Steel Steel Beam 140S · Psychic Future Sight 120S
  Physical coverage: Grass Solar Blade 125 (charge)P, Normal Double-Edge 120P, Electric Supercell Slam 100P, Fighting Sacred Sword 90P, Bug X-Scissor 80P, Ground Bulldoze 60P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Flying Air Slash 75S, Electric Volt Switch 70S
  Setup: Agility, Calm Mind, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Pivot: Volt Switch
  Weather/terrain: Electric Terrain
  Utility: Gravity, Protect, Substitute
  Notable: Substitute

**Iron Leaves** — species, **UU**, source: imported (natdex)
  Grass/Psychic | BST 590 (90/130/88/70/108/104) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 359/394, SpA 239/262, Spe 307/337
  Item: **free**
  STAB: Grass Solar Blade 125 (charge)P · Psychic Psyblade 80P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Electric Wild Charge 90P, Dark Throat Chop 80P, Steel Smart Strike 70P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Flying Air Slash 75S
  Setup: Agility, Calm Mind, Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain
  Priority: Quick Attack 40P Normal (+1)
  Weather/terrain: Electric Terrain, Grassy Terrain, Psychic Terrain
  Utility: Gravity, Protect, Substitute, Taunt
  Notable: Taunt, Substitute

**Iron Treads** — species, **UU**, source: override
  Ground/Steel | BST 570 (90/112/120/72/70/106) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 323/355, SpA 243/267, Spe 311/342
  Item: **free**
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

**Jirachi** — species, **UU**, source: imported (natdex)
  Steel/Psychic | BST 600 (100/100/100/100/100/100) | Abilities: Serene Grace
  Engine stats @252 (neutral/positive): Serene Grace: Atk 299/328, SpA 299/328, Spe 299/328
  Item: **free**
  STAB: Steel Doom Desire 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Fighting Dynamic Punch 100P, Fairy Play Rough 90P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Dragon Draco Meteor 140S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Fairy Moonblast 95S, Fighting Aura Sphere 90S, Grass Energy Ball 90S
  Setup: Amnesia, Calm Mind, Cosmic Power, Defense Curl, Iron Defense
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Dream Eater
  Hazards: Stealth Rock
  Pivot: Baton Pass, U-turn
  Status: Thunder Wave, Toxic
  Cleric: Life Dew, Wish
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Encore, Gravity, Healing Wish, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Encore, Substitute, Baton Pass, Trick Room

**Keldeo** — species, **UU**, source: imported (natdex)
  Water/Fighting | BST 580 (91/72/90/129/90/108) | Abilities: Justified
  Engine stats @252 (neutral/positive): Justified: Atk 243/267, SpA 357/392, Spe 315/346
  Item: **free**
  STAB: Water Hydro Pump 120S · Fighting Focus Blast 120S
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Bug Megahorn 120P, Rock Stone Edge 100P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P, Steel Smart Strike 70P
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

**Latias-Mega** — forme, **UU**, source: imported (natdex)
  Dragon/Psychic | BST 700 (80/100/120/140/150/110) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 299/328, SpA 379/416, Spe 319/350
  Item: **forced — Latiasite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Dragon Draco Meteor 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Water Liquidation 85P, Dark Sucker Punch 80P, Ghost Shadow Claw 70P
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

**Lilligant-Hisui** — species, **UU**, source: imported (natdex)
  Grass/Fighting | BST 480 (70/105/75/50/75/105) | Abilities: Chlorophyll / Hustle / Leaf Guard
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 309/339, SpA 199/218, Spe 309/339 — Hustle: Atk 463/508, SpA 199/218, Spe 309/339 — Leaf Guard: Atk 309/339, SpA 199/218, Spe 309/339
  Item: **free**
  STAB: Grass Solar Blade 125 (charge)P · Fighting Axe Kick 120P
  Physical coverage: Normal Mega Kick 120P, Flying Acrobatics 110P, Ice Ice Spinner 80P, Poison Poison Jab 80P
  Special coverage: Flying Hurricane 120S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Bug Pollen Puff 90S, Fairy Alluring Voice 80S, Normal Tera Blast 80S
  Setup: Growth, Quiver Dance, Swords Dance, Victory Dance
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Dream Eater, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]**, Upper Hand 65P Fighting (+3), Vacuum Wave 40S Fighting (+1)
  Removal: Defog
  Status: Grass Whistle, Sleep Powder, Stun Spore, Toxic
  Cleric: Aromatherapy, Heal Bell
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Encore, Healing Wish, Leech Seed, Light Screen, Protect, Safeguard, Substitute
  Notable: Encore, Substitute

**Mamoswine** — species, **UU**, source: imported (natdex)
  Ice/Ground | BST 530 (110/130/80/70/60/80) | Abilities: Oblivious / Snow Cloak / Thick Fat
  Engine stats @252 (neutral/positive): Oblivious: Atk 359/394, SpA 239/262, Spe 259/284 — Snow Cloak: Atk 359/394, SpA 239/262, Spe 259/284 — Thick Fat: Atk 359/394, SpA 239/262, Spe 259/284
  Item: **free**
  STAB: Ice Icicle Crash 85P · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Fighting Superpower 120P, Rock Stone Edge 100P, Dark Throat Chop 80P, Grass Trailblaze 50P
  Special coverage: Normal Tera Blast 80S, Rock Ancient Power 60S
  Setup: Amnesia, Defense Curl
  Reliable recovery: Rest
  Priority: Ice Shard 40P Ice (+1)
  Hazards: Stealth Rock
  Phazing: Roar
  Status: Toxic
  Trapping moves: Block
  Weather/terrain: Hail, Rain Dance, Sandstorm, Snowscape
  Utility: Detect, Haze, Knock Off, Light Screen, Protect, Reflect, Substitute
  Notable: Knock Off, Substitute

**Meganium-Mega** — forme, **UU**, source: override
  Grass/Fairy | BST 625 (80/92/115/143/115/80) | Abilities: Mega Sol
  Engine stats @252 (neutral/positive): Mega Sol: Atk 283/311, SpA 385/423, Spe 259/284
  Item: **forced — Meganiumite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fighting Body Press 80P, Psychic Zen Headbutt 80P
  Special coverage: Normal Wring Out 120S **[power — scales with the target’s **current** HP; quoted against a full-HP target]**, Fire Weather Ball 100S, Rock Ancient Power 60S, Ground Mud-Slap 20S
  Setup: Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain
  Priority: Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]**
  Phazing: Dragon Tail
  Status: Grass Whistle, Poison Powder, Toxic
  Cleric: Aromatherapy
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Detect, Encore, Knock Off, Leech Seed, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute
  Notable: Knock Off, Encore, Substitute

**Metagross** — species, **UU**, source: override
  Steel/Psychic | BST 600 (80/135/130/95/90/70) | Abilities: Clear Body / Light Metal
  Engine stats @252 (neutral/positive): Clear Body: Atk 369/405, SpA 289/317, Spe 239/262 — Light Metal: Atk 369/405, SpA 289/317, Spe 239/262
  Item: **free** — but its own Metagrossite is **refused in UU** (it would make Metagross-Mega, OU)
  STAB: Steel Steel Beam 140S · Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Ground Earthquake 100P, Rock Stone Edge 100P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Rock Meteor Beam 120 (charge)S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Grass Grass Knot 60S
  Setup: Agility, Cosmic Power, Defense Curl, Hone Claws, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Priority: Bullet Punch 40P Steel (+1)
  Hazards: Stealth Rock
  Status: Toxic
  Trapping moves: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Gravity, Knock Off, Light Screen, Protect, Reflect, Substitute, Trick
  Notable: Knock Off, Trick, Substitute, Focus Punch

**Mew** — species, **UU**, source: imported (natdex)
  Psychic | BST 600 (100/100/100/100/100/100) | Abilities: Synchronize
  Engine stats @252 (neutral/positive): Synchronize: Atk 299/328, SpA 299/328, Spe 299/328
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Flying Sky Attack 140 (charge)P, Steel Steel Roller 130P **[conditional — fails with no terrain up]**, Grass Solar Blade 125 (charge)P, Fire Flare Blitz 120P
  Special coverage: Dragon Draco Meteor 140S, Grass Leaf Storm 140S, Fire Overheat 140S, Steel Steel Beam 140S, Ice Blizzard 120S, Fighting Focus Blast 120S
  Setup: Agility, Amnesia, Barrier, Bulk Up, Calm Mind, Charge, Cosmic Power, Defense Curl, Dragon Dance, Hone Claws, Iron Defense, Nasty Plot, Rock Polish, Swords Dance, Work Up
  Reliable recovery: Rest, Roost, Soft-Boiled
  Drain/Rest-only: Drain Punch, Draining Kiss, Dream Eater, Giga Drain, Leech Life, Mega Drain
  Priority: Sucker Punch 80P Dark (+1), Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]**, Upper Hand 65P Fighting (+3), Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**
  Hazards: Spikes, Stealth Rock, Toxic Spikes
  Removal: Defog
  Pivot: Baton Pass, Flip Turn, Teleport, U-turn, Volt Switch
  Phazing: Dragon Tail, Roar, Whirlwind
  Status: Hypnosis, Thunder Wave, Toxic, Will-O-Wisp
  Cleric: Heal Bell, Life Dew
  Trapping moves: Block
  Weather/terrain: Electric Terrain, Grassy Terrain, Hail, Misty Terrain, Psychic Terrain, Rain Dance, Sandstorm, Snowscape, Sunny Day
  Utility: Aurora Veil, Detect, Encore, Gravity, Haze, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Safeguard, Substitute, Tailwind, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Baton Pass, Trick Room, Tailwind, Focus Punch

**Mienshao** — species, **UU**, source: imported (natdex)
  Fighting | BST 510 (65/125/60/95/60/105) | Abilities: Inner Focus / Regenerator / Reckless
  Engine stats @252 (neutral/positive): Inner Focus: Atk 349/383, SpA 289/317, Spe 309/339 — Regenerator: Atk 349/383, SpA 289/317, Spe 309/339 — Reckless: Atk 349/383, SpA 289/317, Spe 309/339
  Item: **free**
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Normal Double-Edge 120P, Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Fire Blaze Kick 85P
  Special coverage: Normal Tera Blast 80S, Grass Grass Knot 60S
  Setup: Agility, Bulk Up, Calm Mind, Hone Claws, Meditate, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**, Vacuum Wave 40S Fighting (+1)
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Reflect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass, Focus Punch

**Moltres** — species, **UU**, source: override
  Fire/Flying | BST 580 (90/100/90/125/85/90) | Abilities: Pressure / Flame Body
  Engine stats @252 (neutral/positive): Pressure: Atk 299/328, SpA 349/383, Spe 279/306 — Flame Body: Atk 299/328, SpA 349/383, Spe 279/306
  Item: **free**
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

**Moltres-Galar** — species, **UU**, source: imported (natdex)
  Dark/Flying | BST 580 (90/85/90/100/125/90) | Abilities: Berserk
  Engine stats @252 (neutral/positive): Berserk: Atk 269/295, SpA 299/328, Spe 279/306
  Item: **free**
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

**Okidogi** — species, **UU**, source: override
  Poison/Fighting | BST 555 (88/128/115/58/86/80) | Abilities: Toxic Chain / Guard Dog
  Engine stats @252 (neutral/positive): Toxic Chain: Atk 355/390, SpA 215/236, Spe 259/284 — Guard Dog: Atk 355/390, SpA 215/236, Spe 259/284
  Item: **free**
  STAB: Poison Gunk Shot 120P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Steel Hard Press 100P, Ground Dig 100 (charge)P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Normal Uproar 90S, Dark Snarl 55S
  Setup: Bulk Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Upper Hand 65P Fighting (+3)
  Phazing: Roar
  Status: Toxic
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Focus Punch

**Pecharunt** — species, **UU**, source: override
  Poison/Ghost | BST 600 (88/88/160/88/88/88) | Abilities: Poison Puppeteer
  Engine stats @252 (neutral/positive): Poison Puppeteer: Atk 275/302, SpA 275/302, Spe 275/302
  Item: **free**
  STAB: Poison Gunk Shot 120P · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**
  Physical coverage: Dark Foul Play 95P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S
  Setup: Defense Curl, Nasty Plot, Withdraw
  Reliable recovery: Recover, Rest
  Pivot: Parting Shot
  Status: Toxic
  Trapping moves: Mean Look
  Utility: Destiny Bond, Memento, Protect, Substitute
  Notable: Substitute

**Polteageist** — species, **UU**, source: imported (natdex)
  Ghost | BST 508 (60/65/65/134/114/70) | Abilities: Weak Armor / Cursed Body
  Engine stats @252 (neutral/positive): Weak Armor: Atk 229/251, SpA 367/403, Spe 239/262 — Cursed Body: Atk 229/251, SpA 367/403, Spe 239/262
  Item: **free**
  STAB: Ghost Shadow Ball 80S
  Physical coverage: Normal Self-Destruct 200P **[power — the user **faints**]**, Dark Foul Play 95P
  Special coverage: Psychic Psychic 90S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Giga Drain 75S
  Setup: Calm Mind, Nasty Plot, Shell Smash, Withdraw
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain, Mega Drain
  Priority: Sucker Punch 80P Dark (+1)
  Pivot: Baton Pass
  Status: Will-O-Wisp
  Cleric: Aromatherapy
  Utility: Light Screen, Memento, Pain Split, Protect, Reflect, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Baton Pass, Trick Room

**Porygon-Z** — species, **UU**, source: imported (natdex)
  Normal | BST 535 (85/80/70/135/75/90) | Abilities: Adaptability / Download / Analytic
  Engine stats @252 (neutral/positive): Adaptability: Atk 259/284, SpA 369/405, Spe 279/306 — Download: Atk 259/284, SpA 369/405, Spe 279/306 — Analytic: Atk 259/284, SpA 369/405, Spe 279/306
  Item: **free**
  STAB: Normal Uproar 90S
  Physical coverage: Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Flying Aerial Ace 60P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Dark Dark Pulse 80S, Ghost Shadow Ball 80S
  Setup: Agility, Barrier, Charge, Defense Curl, Nasty Plot, Sharpen
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Gravity, Magic Coat, Pain Split, Protect, Reflect, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room

**Primarina** — species, **UU**, source: imported (natdex)
  Water/Fairy | BST 530 (80/74/74/126/116/60) | Abilities: Torrent / Liquid Voice
  Engine stats @252 (neutral/positive): Torrent: Atk 247/271, SpA 351/386, Spe 219/240 — Liquid Voice: Atk 247/271, SpA 351/386, Spe 219/240
  Item: **free**
  STAB: Water Hydro Pump 120S · Fairy Misty Explosion 100S **[power — the user **faints**]**
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Steel Iron Tail 100P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Psychic Psychic 90S, Ghost Shadow Ball 80S
  Setup: Amnesia, Calm Mind, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Priority: Aqua Jet 40P Water (+1)
  Pivot: Flip Turn
  Status: Sing, Toxic
  Cleric: Life Dew
  Weather/terrain: Hail, Misty Terrain, Rain Dance, Snowscape
  Utility: Encore, Haze, Light Screen, Magic Coat, Perish Song, Protect, Reflect, Substitute
  Notable: Encore, Substitute

**Pyroar-Mega** — forme, **UU**, source: override
  Fire/Normal | BST 607 (86/88/92/129/86/126) | Abilities: Fire Mane
  Engine stats @252 (neutral/positive): Fire Mane: Atk 275/302, SpA 357/392, Spe 351/386
  Item: **forced — Pyroarite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
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

**Quaquaval** — species, **UU**, source: imported (natdex)
  Water/Fighting | BST 530 (85/120/80/85/75/85) | Abilities: Torrent / Moxie
  Engine stats @252 (neutral/positive): Torrent: Atk 339/372, SpA 269/295, Spe 269/295 — Moxie: Atk 339/372, SpA 269/295, Spe 269/295
  Item: **free**
  STAB: Water Hydro Pump 120S · Fighting Close Combat 120P
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Flying Brave Bird 120P, Ice Ice Spinner 80P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Flying Hurricane 120S, Normal Tera Blast 80S, Ice Icy Wind 55S, Fairy Disarming Voice 40S
  Setup: Agility, Bulk Up, Swords Dance, Work Up
  Reliable recovery: Rest, Roost
  Priority: Upper Hand 65P Fighting (+3), Aqua Jet 40P Water (+1)
  Removal: Rapid Spin
  Pivot: Baton Pass, Flip Turn, U-turn
  Weather/terrain: Misty Terrain, Rain Dance
  Utility: Detect, Encore, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Encore, Taunt, Substitute, Baton Pass

**Raichu-Mega-Y** — forme, **UU**, source: override
  Electric | BST 585 (60/100/55/160/80/130) | Abilities: No Guard
  Engine stats @252 (neutral/positive): No Guard: Atk 299/328, SpA 419/460, Spe 359/394
  Item: **forced — Raichunite Y** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Grass Grass Knot 60S
  Setup: Agility, Calm Mind, Charge, Defense Curl, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Priority: Extreme Speed 80P Normal (+2), Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**
  Pivot: Volt Switch
  Status: Nuzzle, Sing, Thunder Wave, Toxic, Yawn
  Cleric: Wish
  Weather/terrain: Electric Terrain, Rain Dance
  Utility: Detect, Encore, Knock Off, Light Screen, Protect, Reflect, Safeguard, Substitute
  Notable: Knock Off, Encore, Substitute, Focus Punch

**Regieleki** — species, **UU**, source: override
  Electric | BST 580 (80/100/50/100/50/200) | Abilities: Transistor
  Engine stats @252 (neutral/positive): Transistor: Atk 299/328, SpA 299/328, Spe 499/548
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Flying Acrobatics 110P, Dark Assurance 60P **[power — doubles to 120 if the target has already taken damage this turn]**
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

**Rotom-Wash** — species, **UU**, source: imported (natdex)
  Electric/Water | BST 520 (50/65/107/105/107/86) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 229/251, SpA 309/339, Spe 271/298
  Item: **free**
  STAB: Electric Thunder 120S · Water Hydro Pump 120S
  Physical coverage: Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**, Normal Return 102P, Dark Foul Play 95P
  Special coverage: Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Normal Hyper Voice 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Fairy Disarming Voice 40S
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

**Sableye-Mega** — forme, **UU**, source: imported (natdex)
  Dark/Ghost | BST 480 (50/85/125/85/115/20) | Abilities: Magic Bounce
  Engine stats @252 (neutral/positive): Magic Bounce: Atk 269/295, SpA 269/295, Spe 139/152
  Item: **forced — Sablenite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Dark Foul Play 95P · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P, Psychic Zen Headbutt 80P
  Special coverage: Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Rock Power Gem 80S, Normal Tera Blast 80S, Bug Signal Beam 75S
  Setup: Bulk Up, Calm Mind, Hone Claws, Nasty Plot
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Drain Punch, Dream Eater, Giga Drain
  Priority: Sucker Punch 80P Dark (+1), Feint 50P Normal (+2), Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**, Shadow Sneak 40P Ghost (+1)
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Trapping moves: Mean Look
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Disable, Encore, Gravity, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Reflect, Substitute, Taunt, Trick
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Focus Punch

**Salamence** — species, **UU**, source: imported (natdex)
  Dragon/Flying | BST 600 (95/135/80/110/80/100) | Abilities: Intimidate / Moxie
  Engine stats @252 (neutral/positive): Intimidate: Atk 369/405, SpA 319/350, Spe 299/328 — Moxie: Atk 369/405, SpA 319/350, Spe 299/328
  Item: **free** — but its own Salamencite is **refused in UU** (it would make Salamence-Mega, Ubers)
  STAB: Dragon Draco Meteor 140S · Flying Hurricane 120S
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P
  Special coverage: Fire Fire Blast 120S, Water Hydro Pump 120S, Normal Hyper Voice 90S, Ghost Ominous Wind 60S, Ground Mud-Slap 20S
  Setup: Defense Curl, Dragon Dance, Hone Claws, Iron Defense
  Reliable recovery: Rest, Roost
  Removal: Defog
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Cleric: Wish
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Tailwind
  Notable: Substitute, Tailwind

**Scizor** — species, **UU**, source: imported (natdex)
  Bug/Steel | BST 500 (70/130/100/55/80/65) | Abilities: Swarm / Technician / Light Metal
  Engine stats @252 (neutral/positive): Swarm: Atk 359/394, SpA 209/229, Spe 229/251 — Technician: Atk 359/394, SpA 209/229, Spe 229/251 — Light Metal: Atk 359/394, SpA 209/229, Spe 229/251
  Item: **free** — but its own Scizorite is **refused in UU** (it would make Scizor-Mega, OU)
  STAB: Bug Lunge 80P · Steel Hard Press 100P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Fighting Close Combat 120P, Flying Acrobatics 110P, Poison Cross Poison 70P, Dark Night Slash 70P, Psychic Psycho Cut 70P
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

**Scolipede** — species, **UU**, source: imported (natdex)
  Bug/Poison | BST 485 (60/100/89/55/69/112) | Abilities: Poison Point / Swarm / Speed Boost / Quick Feet
  Engine stats @252 (neutral/positive): Poison Point: Atk 299/328, SpA 209/229, Spe 323/355 — Swarm: Atk 299/328, SpA 209/229, Spe 323/355 — Speed Boost: Atk 299/328, SpA 209/229, Spe 323/355 — Quick Feet: Atk 299/328, SpA 209/229, Spe 323/355
  Item: **free**
  STAB: Bug Megahorn 120P · Poison Poison Jab 80P
  Physical coverage: Steel Steel Roller 130P **[conditional — fails with no terrain up]**, Normal Double-Edge 120P, Fighting Superpower 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Dark Throat Chop 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Ghost Hex 65S, Normal Hidden Power 60S
  Setup: Agility, Defense Curl, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Hazards: Spikes, Toxic Spikes
  Pivot: Baton Pass
  Status: Toxic
  Weather/terrain: Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute, Baton Pass

**Scolipede-Mega** — forme, **UU**, source: override
  Bug/Poison | BST 585 (60/140/149/75/99/62) | Abilities: Shell Armor
  Engine stats @252 (neutral/positive): Shell Armor: Atk 379/416, SpA 249/273, Spe 223/245
  Item: **forced — Scolipite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Bug Megahorn 120P · Poison Poison Jab 80P
  Physical coverage: Steel Steel Roller 130P **[conditional — fails with no terrain up]**, Normal Double-Edge 120P, Fighting Superpower 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Dark Throat Chop 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Ghost Hex 65S, Normal Hidden Power 60S
  Setup: Agility, Defense Curl, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Hazards: Spikes, Toxic Spikes
  Pivot: Baton Pass
  Status: Toxic
  Weather/terrain: Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute, Baton Pass

**Scrafty-Mega** — forme, **UU**, source: override
  Dark/Fighting | BST 588 (65/130/135/55/135/68) | Abilities: Intimidate
  Engine stats @252 (neutral/positive): Intimidate: Atk 359/394, SpA 209/229, Spe 235/258
  Item: **forced — Scraftinite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Dark Foul Play 95P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P
  Special coverage: Dragon Dragon Pulse 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Grass Grass Knot 60S, Fire Incinerate 60S
  Setup: Amnesia, Bulk Up, Dragon Dance, Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**
  Phazing: Dragon Tail, Roar
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Encore, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Encore, Taunt, Substitute, Focus Punch

**Serperior** — species, **UU**, source: imported (natdex)
  Grass | BST 528 (75/75/95/75/95/113) | Abilities: Overgrow / Contrary
  Engine stats @252 (neutral/positive): Overgrow: Atk 249/273, SpA 249/273, Spe 325/357 — Contrary: Atk 249/273, SpA 249/273, Spe 325/357
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Water Aqua Tail 90P, Dark Knock Off 65P, Flying Aerial Ace 60P
  Special coverage: Normal Wring Out 120S **[power — scales with the target’s **current** HP; quoted against a full-HP target]**, Dragon Dragon Pulse 90S, Psychic Mirror Coat fixedS **[conditional — needs a **special** hit taken from that target this turn]**
  Setup: Calm Mind, Coil, Growth, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]**
  Removal: Defog
  Phazing: Dragon Tail
  Status: Glare, Toxic
  Cleric: Aromatherapy
  Trapping moves: Mean Look
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Knock Off, Leech Seed, Light Screen, Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

**Sharpedo-Mega** — forme, **UU**, source: imported (natdex)
  Water/Dark | BST 560 (70/140/70/110/65/105) | Abilities: Strong Jaw
  Engine stats @252 (neutral/positive): Strong Jaw: Atk 379/416, SpA 319/350, Spe 309/339
  Item: **forced — Sharpedonite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Water Hydro Pump 120S · Dark Crunch 80P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Fighting Close Combat 120P, Ground Earthquake 100P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P
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

**Skarmory** — species, **UU**, source: imported (natdex)
  Steel/Flying | BST 465 (65/80/140/40/70/70) | Abilities: Keen Eye / Sturdy / Weak Armor
  Engine stats @252 (neutral/positive): Keen Eye: Atk 259/284, SpA 179/196, Spe 239/262 — Sturdy: Atk 259/284, SpA 179/196, Spe 239/262 — Weak Armor: Atk 259/284, SpA 179/196, Spe 239/262
  Item: **free**
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

**Skarmory-Mega** — forme, **UU**, source: override
  Steel/Flying | BST 565 (65/140/110/40/100/110) | Abilities: Stalwart
  Engine stats @252 (neutral/positive): Stalwart: Atk 379/416, SpA 179/196, Spe 319/350
  Item: **forced — Skarmorite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
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

**Slowbro** — species, **UU**, source: override
  Water/Psychic | BST 490 (95/75/110/100/80/30) | Abilities: Oblivious / Own Tempo / Regenerator
  Engine stats @252 (neutral/positive): Oblivious: Atk 249/273, SpA 299/328, Spe 159/174 — Own Tempo: Atk 249/273, SpA 299/328, Spe 159/174 — Regenerator: Atk 249/273, SpA 299/328, Spe 159/174
  Item: **free**
  STAB: Water Hydro Pump 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Ice Ice Punch 75P
  Special coverage: Poison Belch 120S **[conditional — fails until the user has eaten a Berry]**, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Zap Cannon 120S, Ghost Shadow Ball 80S
  Setup: Amnesia, Calm Mind, Iron Defense, Nasty Plot, Withdraw
  Reliable recovery: Rest, Slack Off
  Drain/Rest-only: Drain Punch, Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic, Yawn
  Trapping moves: Block
  Weather/terrain: Hail, Psychic Terrain, Rain Dance, Snowscape, Sunny Day
  Utility: Disable, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room, Focus Punch

**Slowbro-Mega** — forme, **UU**, source: imported (natdex)
  Water/Psychic | BST 590 (95/75/180/130/80/30) | Abilities: Shell Armor
  Engine stats @252 (neutral/positive): Shell Armor: Atk 249/273, SpA 359/394, Spe 159/174
  Item: **forced — Slowbronite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Water Hydro Pump 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Ice Ice Punch 75P
  Special coverage: Poison Belch 120S **[conditional — fails until the user has eaten a Berry]**, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Zap Cannon 120S, Ghost Shadow Ball 80S
  Setup: Amnesia, Calm Mind, Iron Defense, Nasty Plot, Withdraw
  Reliable recovery: Rest, Slack Off
  Drain/Rest-only: Drain Punch, Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic, Yawn
  Trapping moves: Block
  Weather/terrain: Hail, Psychic Terrain, Rain Dance, Snowscape, Sunny Day
  Utility: Disable, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room, Focus Punch

**Slowking** — species, **UU**, source: imported (natdex)
  Water/Psychic | BST 490 (95/75/80/100/110/30) | Abilities: Oblivious / Own Tempo / Regenerator
  Engine stats @252 (neutral/positive): Oblivious: Atk 249/273, SpA 299/328, Spe 159/174 — Own Tempo: Atk 249/273, SpA 299/328, Spe 159/174 — Regenerator: Atk 249/273, SpA 299/328, Spe 159/174
  Item: **free**
  STAB: Water Hydro Pump 120S · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Fire Fire Punch 75P
  Special coverage: Normal Trump Card 200S **[power — power rises as its PP falls; quoted at full PP]**, Poison Belch 120S **[conditional — fails until the user has eaten a Berry]**, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Zap Cannon 120S
  Setup: Amnesia, Calm Mind, Iron Defense, Nasty Plot
  Reliable recovery: Rest, Slack Off
  Drain/Rest-only: Drain Punch, Dream Eater
  Pivot: Chilly Reception, Teleport
  Phazing: Dragon Tail
  Status: Thunder Wave, Toxic, Yawn
  Trapping moves: Block
  Weather/terrain: Chilly Reception, Hail, Psychic Terrain, Rain Dance, Snowscape, Sunny Day
  Utility: Disable, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Trick, Trick Room
  Notable: Trick, Substitute, Trick Room, Focus Punch

**Staraptor-Mega** — forme, **UU**, source: override
  Fighting/Flying | BST 585 (85/140/100/60/90/110) | Abilities: Contrary
  Engine stats @252 (neutral/positive): Contrary: Atk 379/416, SpA 219/240, Spe 319/350
  Item: **forced — Staraptite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Fighting Close Combat 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Thief 60P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Normal Uproar 90S, Ghost Ominous Wind 60S, Bug Struggle Bug 50S **[power — only reachable when no other move can be selected]**, Dragon Twister 40S, Ground Mud-Slap 20S
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

**Starmie-Mega** — forme, **UU**, source: override
  Water/Psychic | BST 620 (60/100/105/130/105/120) | Abilities: Huge Power
  Engine stats @252 (neutral/positive): Huge Power: Atk 598/656, SpA 359/394, Spe 339/372
  Item: **forced — Starminite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Water Waterfall 80P · Psychic Psycho Cut 70P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Ice Avalanche 60P **[power — doubles to 120 if the user was hit first this turn]**, Rock Rollout 30P, Steel Gyro Ball 14P
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

**Swampert** — species, **UU**, source: imported (natdex)
  Water/Ground | BST 535 (100/110/90/85/90/60) | Abilities: Torrent / Damp
  Engine stats @252 (neutral/positive): Torrent: Atk 319/350, SpA 269/295, Spe 219/240 — Damp: Atk 319/350, SpA 269/295, Spe 219/240
  Item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Hard Press 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Uproar 90S, Rock Ancient Power 60S, Psychic Mirror Coat fixedS **[conditional — needs a **special** hit taken from that target this turn]**
  Setup: Amnesia, Barrier, Bulk Up, Defense Curl, Work Up
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Pivot: Flip Turn
  Phazing: Roar
  Status: Toxic, Yawn
  Weather/terrain: Hail, Rain Dance
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute, Focus Punch

**Swampert-Mega** — forme, **UU**, source: imported (natdex)
  Water/Ground | BST 635 (100/150/110/95/110/70) | Abilities: Swift Swim
  Engine stats @252 (neutral/positive): Swift Swim: Atk 399/438, SpA 289/317, Spe 239/262
  Item: **forced — Swampertite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Water Aqua Tail 90P · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Hard Press 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Uproar 90S, Rock Ancient Power 60S, Psychic Mirror Coat fixedS **[conditional — needs a **special** hit taken from that target this turn]**
  Setup: Amnesia, Barrier, Bulk Up, Defense Curl, Work Up
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Pivot: Flip Turn
  Phazing: Roar
  Status: Toxic, Yawn
  Weather/terrain: Hail, Rain Dance
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute, Focus Punch

**Tapu Fini** — species, **UU**, source: imported (natdex)
  Water/Fairy | BST 570 (70/75/115/95/130/85) | Abilities: Misty Surge / Telepathy
  Engine stats @252 (neutral/positive): Misty Surge: Atk 249/273, SpA 289/317, Spe 269/295 — Telepathy: Atk 249/273, SpA 289/317, Spe 269/295
  Item: **free**
  STAB: Water Hydro Pump 120S · Fairy Moonblast 95S
  Physical coverage: Normal Return 102P, Ice Ice Punch 75P, Steel Smart Strike 70P, Dark Knock Off 65P
  Special coverage: Ice Blizzard 120S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Normal Hidden Power 60S, Psychic Stored Power 20S
  Setup: Calm Mind, Iron Defense, Withdraw
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Removal: Defog
  Status: Toxic
  Trapping moves: Mean Look
  Weather/terrain: Misty Terrain, Rain Dance
  Utility: Gravity, Haze, Knock Off, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Taunt, Trick
  Notable: Knock Off, Trick, Taunt, Substitute

**Terrakion** — species, **UU**, source: imported (natdex)
  Rock/Fighting | BST 580 (91/129/90/72/90/108) | Abilities: Justified
  Engine stats @252 (neutral/positive): Justified: Atk 357/392, SpA 243/267, Spe 315/346
  Item: **free**
  STAB: Rock Stone Edge 100P · Fighting Close Combat 120P
  Physical coverage: Normal Double-Edge 120P, Bug Megahorn 120P, Ground Earthquake 100P, Steel Iron Head 80P, Poison Poison Jab 80P, Psychic Zen Headbutt 80P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S, Flying Air Slash 75S
  Setup: Calm Mind, Rock Polish, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Upper Hand 65P Fighting (+3), Quick Attack 40P Normal (+1)
  Hazards: Stealth Rock
  Phazing: Roar
  Status: Toxic
  Trapping moves: Block
  Weather/terrain: Sandstorm
  Utility: Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Taunt, Substitute

**Thundurus** — species, **UU**, source: imported (natdex)
  Electric/Flying | BST 580 (79/115/70/125/80/111) | Abilities: Prankster / Defiant
  Engine stats @252 (neutral/positive): Prankster: Atk 329/361, SpA 349/383, Spe 321/353 — Defiant: Atk 329/361, SpA 349/383, Spe 321/353
  Item: **free**
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

**Thundurus-Therian** — species, **UU**, source: override
  Electric/Flying | BST 580 (79/105/70/145/80/101) | Abilities: Volt Absorb
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 309/339, SpA 389/427, Spe 301/331
  Item: **free**
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

**Tyranitar** — species, **UU**, source: imported (natdex)
  Rock/Dark | BST 600 (100/134/110/95/100/61) | Abilities: Sand Stream / Unnerve
  Engine stats @252 (neutral/positive): Sand Stream: Atk 367/403, SpA 289/317, Spe 221/243 — Unnerve: Atk 367/403, SpA 289/317, Spe 221/243
  Item: **free** — but its own Tyranitarite is **refused in UU** (it would make Tyranitar-Mega, OU)
  STAB: Rock Stone Edge 100P · Dark Foul Play 95P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Hard Press 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S
  Setup: Dragon Dance, Hone Claws, Iron Defense, Rock Polish
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Phazing: Dragon Tail, Roar
  Status: Thunder Wave, Toxic
  Trapping moves: Block
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Focus Punch

**Ursaluna** — species, **UU**, source: imported (natdex)
  Ground/Normal | BST 550 (130/140/105/45/80/50) | Abilities: Guts / Bulletproof / Unnerve
  Engine stats @252 (neutral/positive): Guts: Atk 379/416, SpA 189/207, Spe 199/218 — Bulletproof: Atk 379/416, SpA 189/207, Spe 199/218 — Unnerve: Atk 379/416, SpA 189/207, Spe 199/218
  Item: **free**
  STAB: Ground Headlong Rush 120P · Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Poison Gunk Shot 120P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Electric Supercell Slam 100P, Fairy Play Rough 90P
  Special coverage: Fighting Focus Blast 120S, Electric Zap Cannon 120S
  Setup: Bulk Up, Defense Curl, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Phazing: Roar
  Status: Toxic, Yawn
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute, Focus Punch

**Venusaur-Mega** — forme, **UU**, source: imported (natdex)
  Grass/Poison | BST 625 (80/100/123/122/120/80) | Abilities: Thick Fat
  Engine stats @252 (neutral/positive): Thick Fat: Atk 299/328, SpA 343/377, Spe 259/284
  Item: **forced — Venusaurite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Grass Leaf Storm 140S · Poison Sludge Bomb 90S
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Dragon Outrage 120P, Ground Earthquake 100P, Dark Knock Off 65P, Bug Fury Cutter 40P, Fighting Rock Smash 40P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S
  Setup: Amnesia, Defense Curl, Growth, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]**
  Phazing: Roar
  Status: Grass Whistle, Poison Powder, Sleep Powder, Toxic
  Trapping moves: Block
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Knock Off, Leech Seed, Light Screen, Protect, Reflect, Safeguard, Substitute
  Notable: Knock Off, Substitute

**Victini** — species, **UU**, source: imported (natdex)
  Psychic/Fire | BST 600 (100/100/100/100/100/100) | Abilities: Victory Star
  Engine stats @252 (neutral/positive): Victory Star: Atk 299/328, SpA 299/328, Spe 299/328
  Item: **free**
  STAB: Psychic Future Sight 120S · Fire V-create 180P
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Electric Bolt Strike 130P, Flying Bounce 85 (charge)P, Fighting Brick Break 75P, Bug U-turn 70P, Dark Fling 30P **[conditional — fails with no removable item, and consumes it]**
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S
  Setup: Work Up
  Reliable recovery: Rest
  Priority: Quick Attack 40P Normal (+1)
  Pivot: Baton Pass, U-turn
  Status: Thunder Wave, Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Encore, Light Screen, Magic Coat, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Encore, Taunt, Substitute, Baton Pass, Trick Room

**Weavile** — species, **UU**, source: override
  Dark/Ice | BST 510 (70/120/65/45/85/125) | Abilities: Pressure / Pickpocket
  Engine stats @252 (neutral/positive): Pressure: Atk 339/372, SpA 189/207, Spe 349/383 — Pickpocket: Atk 339/372, SpA 189/207, Spe 349/383
  Item: **free**
  STAB: Dark Foul Play 95P · Ice Icicle Crash 85P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Water Surf 95S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Mud-Slap 20S
  Setup: Agility, Calm Mind, Defense Curl, Hone Claws, Nasty Plot, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**, Ice Shard 40P Ice (+1)
  Pivot: Baton Pass
  Status: Toxic
  Weather/terrain: Hail, Rain Dance, Snowscape, Sunny Day
  Utility: Detect, Knock Off, Protect, Reflect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass, Focus Punch

**Zapdos-Galar** — species, **UU**, source: override
  Fighting/Flying | BST 580 (90/125/90/85/90/100) | Abilities: Defiant
  Engine stats @252 (neutral/positive): Defiant: Atk 349/383, SpA 269/295, Spe 299/328
  Item: **free**
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

**Zeraora** — species, **UU**, source: imported (natdex)
  Electric | BST 600 (88/112/75/102/80/143) | Abilities: Volt Absorb
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 323/355, SpA 303/333, Spe 385/423
  Item: **free** — but its own Zeraorite is **refused in UU** (it would make Zeraora-Mega, OU)
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Mega Kick 120P, Dragon Outrage 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Fairy Play Rough 90P
  Special coverage: Fighting Focus Blast 120S, Grass Grass Knot 60S, Normal Hidden Power 60S, Dark Snarl 55S
  Setup: Agility, Bulk Up, Calm Mind, Charge, Hone Claws, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**, Quick Attack 40P Normal (+1)
  Pivot: Volt Switch
  Status: Thunder Wave, Toxic
  Weather/terrain: Electric Terrain
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Focus Punch

**Zoroark-Hisui** — species, **UU**, source: imported (natdex)
  Normal/Ghost | BST 510 (55/100/60/125/60/110) | Abilities: Illusion
  Engine stats @252 (neutral/positive): Illusion: Atk 299/328, SpA 349/383, Spe 319/350
  Item: **free**
  STAB: Normal Mega Kick 120P · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Ground Dig 100 (charge)P, Dark Foul Play 95P, Flying Bounce 85 (charge)P, Bug Skitter Smack 70P
  Special coverage: Fighting Focus Blast 120S, Fire Flamethrower 95S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Dark Night Daze 85S, Grass Grass Knot 60S
  Setup: Agility, Calm Mind, Hone Claws, Nasty Plot, Swords Dance
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1), Shadow Sneak 40P Ghost (+1)
  Pivot: U-turn
  Phazing: Roar
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Rain Dance, Snowscape, Sunny Day
  Utility: Detect, Encore, Knock Off, Memento, Pain Split, Protect, Substitute, Taunt, Trick
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Focus Punch
---

## D. The OU comparison bar

All **93** OU entries, as they stand after the OU → Ubers pass (3
promoted out), the OU → UU pass (15 dropped in), and the three Megas the
2026-08-17 sprite-key fix packaged. **This is the destination a promotion joins**
and the only comparison Part I has.

**Alakazam-Mega** — forme, **OU**, source: override
  Psychic | BST 600 (55/50/65/175/105/150) | Abilities: Trace
  Engine stats @252 (neutral/positive): Trace: Atk 199/218, SpA 449/493, Spe 399/438
  Item: **forced — Alakazite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Zap Cannon 120S, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Normal Tri Attack 80S

**Alomomola** — species, **OU**, source: imported (natdex)
  Water | BST 470 (165/75/80/40/45/65) | Abilities: Healer / Hydration / Regenerator
  Engine stats @252 (neutral/positive): Healer: Atk 249/273, SpA 179/196, Spe 229/251 — Hydration: Atk 249/273, SpA 179/196, Spe 229/251 — Regenerator: Atk 249/273, SpA 179/196, Spe 229/251
  Item: **free**
  STAB: Water Liquidation 85P
  Physical coverage: Flying Acrobatics 110P, Normal Return 102P, Fairy Play Rough 90P, Psychic Zen Headbutt 80P, Dragon Scale Shot 25x2-5P, Fighting Wake-Up Slap 70P
  Special coverage: Ice Blizzard 120S, Psychic Psychic 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S

**Annihilape** — species, **OU**, source: override
  Fighting/Ghost | BST 535 (110/115/80/50/90/90) | Abilities: Vital Spirit / Inner Focus / Defiant
  Engine stats @252 (neutral/positive): Vital Spirit: Atk 329/361, SpA 199/218, Spe 279/306 — Inner Focus: Atk 329/361, SpA 199/218, Spe 279/306 — Defiant: Atk 329/361, SpA 199/218, Spe 279/306
  Item: **free**
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Ghost Phantom Force 90 (charge)P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Poison Gunk Shot 120P, Dragon Outrage 120P, Flying Acrobatics 110P, Ground Earthquake 100P, Steel Iron Tail 100P
  Special coverage: Fire Overheat 140S, Electric Thunder 120S, Normal Uproar 90S, Ground Mud-Slap 20S

**Barbaracle-Mega** — forme, **OU**, source: **estimated** _(its own `species.tier` reads RU; the enforced tier is the one shown)_
  Rock/Fighting | BST 600 (72/140/130/64/106/88) | Abilities: Tough Claws
  Engine stats @252 (neutral/positive): Tough Claws: Atk 379/416, SpA 227/249, Spe 275/302
  Item: **forced — Barbaracite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Rock Stone Edge 100P · Fighting Superpower 120P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Water Liquidation 85P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**, Poison Poison Jab 80P
  Special coverage: Ice Blizzard 120S, Water Muddy Water 95S, Poison Sludge Wave 95S, Ground Earth Power 90S, Normal Uproar 90S, Grass Grass Knot 60S

**Baxcalibur** — species, **OU**, source: override
  Dragon/Ice | BST 600 (115/145/92/75/86/87) | Abilities: Thermal Exchange / Ice Body
  Engine stats @252 (neutral/positive): Thermal Exchange: Atk 389/427, SpA 249/273, Spe 273/300 — Ice Body: Atk 389/427, SpA 249/273, Spe 273/300
  Item: **free** — but its own Baxcalibrite is **refused in OU** (it would make Baxcalibur-Mega, Ubers)
  STAB: Dragon Glaive Rush 120P · Ice Icicle Crash 85P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Fighting Body Press 80P, Dark Crunch 80P, Steel Iron Head 80P
  Special coverage: Normal Tera Blast 80S

**Blastoise-Mega** — forme, **OU**, source: override
  Water | BST 630 (79/103/120/135/115/78) | Abilities: Mega Launcher
  Engine stats @252 (neutral/positive): Mega Launcher: Atk 305/335, SpA 369/405, Spe 255/280
  Item: **forced — Blastoisinite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Water Water Spout 150S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S, Normal Tera Blast 80S

**Blaziken** — species, **OU**, source: imported (natdex)
  Fire/Fighting | BST 530 (80/120/70/110/70/80) | Abilities: Blaze / Speed Boost
  Engine stats @252 (neutral/positive): Blaze: Atk 339/372, SpA 319/350, Spe 259/284 — Speed Boost: Atk 339/372, SpA 319/350, Spe 259/284
  Item: **free** — but its own Blazikenite is **refused in OU** (it would make Blaziken-Mega, Ubers)
  STAB: Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Flying Brave Bird 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Poison Poison Jab 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Ground Scorching Sands 70S

**Ceruledge** — species, **OU**, source: imported (natdex)
  Fire/Ghost | BST 525 (75/125/80/60/100/85) | Abilities: Flash Fire / Weak Armor
  Engine stats @252 (neutral/positive): Flash Fire: Atk 349/383, SpA 219/240, Spe 269/295 — Weak Armor: Atk 349/383, SpA 219/240, Spe 269/295
  Item: **free**
  STAB: Fire Flare Blitz 120P · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**
  Physical coverage: Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Take Down 90P, Dragon Dragon Claw 80P, Steel Iron Head 80P, Poison Poison Jab 80P
  Special coverage: Normal Tera Blast 80S, Poison Clear Smog 50S, Fighting Vacuum Wave 40S, Psychic Stored Power 20S

**Charizard-Mega-X** — forme, **OU**, source: imported (natdex)
  Fire/Dragon | BST 634 (78/130/111/130/85/100) | Abilities: Tough Claws
  Engine stats @252 (neutral/positive): Tough Claws: Atk 359/394, SpA 359/394, Spe 299/328
  Item: **forced — Charizardite X** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Fire Overheat 140S · Dragon Outrage 120P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P
  Special coverage: Fighting Focus Blast 120S, Flying Hurricane 120S, Grass Solar Beam 120 (charge)S, Normal Tera Blast 80S, Ground Scorching Sands 70S, Rock Ancient Power 60S

**Charizard-Mega-Y** — forme, **OU**, source: imported (natdex)
  Fire/Flying | BST 634 (78/104/78/159/115/100) | Abilities: Drought
  Engine stats @252 (neutral/positive): Drought: Atk 307/337, SpA 417/458, Spe 299/328
  Item: **forced — Charizardite Y** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Fire Overheat 140S · Flying Hurricane 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Dragon Dragon Pulse 90S, Normal Tera Blast 80S, Ground Scorching Sands 70S, Rock Ancient Power 60S

**Chesnaught-Mega** — forme, **OU**, source: **estimated** _(its own `species.tier` reads RU; the enforced tier is the one shown)_
  Grass/Fighting | BST 630 (88/137/172/74/115/44) | Abilities: Bulletproof
  Engine stats @252 (neutral/positive): Bulletproof: Atk 373/410, SpA 247/271, Spe 187/205
  Item: **forced — Chesnaughtite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Grass Wood Hammer 120P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Normal Double-Edge 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Dark Crunch 80P
  Special coverage: Poison Sludge Bomb 90S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Cinderace** — species, **OU**, source: imported (natdex)
  Fire | BST 530 (80/116/75/65/75/119) | Abilities: Blaze / Libero
  Engine stats @252 (neutral/positive): Blaze: Atk 331/364, SpA 229/251, Spe 337/370 — Libero: Atk 331/364, SpA 229/251, Spe 337/370
  Item: **free**
  STAB: Fire Flare Blitz 120P
  Physical coverage: Fighting High Jump Kick 130P, Normal Double-Edge 120P, Poison Gunk Shot 120P, Flying Acrobatics 110P, Steel Iron Head 80P, Dark Sucker Punch 80P
  Special coverage: Fighting Focus Blast 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Scorching Sands 70S, Electric Electro Ball 60S, Dark Snarl 55S

**Clefable-Mega** — forme, **OU**, source: **estimated** _(its own `species.tier` reads UU; the enforced tier is the one shown)_
  Fairy/Flying | BST 583 (95/80/93/135/110/70) | Abilities: Magic Bounce
  Engine stats @252 (neutral/positive): Magic Bounce: Atk 259/284, SpA 369/405, Spe 239/262
  Item: **forced — Clefablite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Fairy Misty Explosion 100S **[power — the user **faints**]** · Flying Dual Wingbeat 50x2P **(wrong category)**
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**, Psychic Zen Headbutt 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S

**Clodsire** — species, **OU**, source: imported (natdex)
  Poison/Ground | BST 430 (130/75/60/45/100/20) | Abilities: Poison Point / Water Absorb / Unaware
  Engine stats @252 (neutral/positive): Poison Point: Atk 249/273, SpA 189/207, Spe 139/152 — Water Absorb: Atk 249/273, SpA 189/207, Spe 139/152 — Unaware: Atk 249/273, SpA 189/207, Spe 139/152
  Item: **free**
  STAB: Poison Gunk Shot 120P · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Bug Megahorn 120P, Fighting Double Kick 50x2P, Steel Heavy Slam 100P, Rock Stone Edge 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Water Hydro Pump 120S, Normal Tera Blast 80S, Rock Ancient Power 60S, Bug Infestation 20S

**Darkrai** — species, **OU**, source: override
  Dark | BST 600 (70/90/90/135/90/125) | Abilities: Bad Dreams
  Engine stats @252 (neutral/positive): Bad Dreams: Atk 279/306, SpA 369/405, Spe 349/383
  Item: **free** — but its own Darkranite is **refused in OU** (it would make Darkrai-Mega, Ubers)
  STAB: Dark Foul Play 95P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Ghost Phantom Force 90 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P, Rock Rock Slide 75P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Dragon Spacial Rend 100S, Poison Sludge Bomb 90S

**Deoxys** — species, **OU**, source: override
  Psychic | BST 600 (50/150/50/150/50/150) | Abilities: Pressure
  Engine stats @252 (neutral/positive): Pressure: Atk 399/438, SpA 399/438, Spe 399/438
  Item: **free**
  STAB: Psychic Psycho Boost 140S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Steel Meteor Mash 100P, Poison Poison Jab 80P, Dark Throat Chop 80P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Dark Dark Pulse 80S

**Deoxys-Speed** — species, **OU**, source: override
  Psychic | BST 600 (50/95/90/95/90/180) | Abilities: Pressure
  Engine stats @252 (neutral/positive): Pressure: Atk 289/317, SpA 289/317, Spe 459/504
  Item: **free**
  STAB: Psychic Psycho Boost 140S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Steel Meteor Mash 100P, Poison Poison Jab 80P, Dark Throat Chop 80P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Dark Dark Pulse 80S

**Dialga** — species, **OU**, source: override
  Steel/Dragon | BST 680 (100/120/120/150/100/90) | Abilities: Pressure / Telepathy
  Engine stats @252 (neutral/positive): Pressure: Atk 339/372, SpA 399/438, Spe 279/306 — Telepathy: Atk 339/372, SpA 399/438, Spe 279/306
  Item: **free** — but its own Adamant Crystal is **refused in OU** (it would make Dialga-Origin, Ubers)
  STAB: Steel Steel Beam 140S · Dragon Draco Meteor 140S
  Physical coverage: Normal Return 102P, Ground Earthquake 100P, Rock Stone Edge 100P, Fighting Body Press 80P, Ghost Shadow Claw 70P, Flying Aerial Ace 60P
  Special coverage: Fire Overheat 140S, Ice Blizzard 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Ground Earth Power 90S, Normal Hyper Voice 90S

**Diancie-Mega** — forme, **OU**, source: imported (natdex)
  Rock/Fairy | BST 700 (50/160/110/160/110/110) | Abilities: Magic Bounce
  Engine stats @252 (neutral/positive): Magic Bounce: Atk 419/460, SpA 419/460, Spe 319/350
  Item: **forced — Diancite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Rock Meteor Beam 120 (charge)S · Fairy Misty Explosion 100S **[power — the user **faints**]**
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Fighting Body Press 80P, Ground Bulldoze 60P, Steel Gyro Ball 15P
  Special coverage: Ground Earth Power 90S, Psychic Psychic 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Fire Mystical Fire 75S

**Dondozo** — species, **OU**, source: imported (natdex)
  Water | BST 530 (150/100/115/65/65/35) | Abilities: Unaware / Oblivious / Water Veil
  Engine stats @252 (neutral/positive): Unaware: Atk 299/328, SpA 229/251, Spe 169/185 — Oblivious: Atk 299/328, SpA 229/251, Spe 169/185 — Water Veil: Atk 299/328, SpA 229/251, Spe 169/185
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Heavy Slam 100P, Fighting Body Press 80P, Dark Crunch 80P
  Special coverage: Normal Tera Blast 80S

**Dracovish** — species, **OU**, source: override
  Water/Dragon | BST 505 (90/90/100/70/80/75) | Abilities: Water Absorb / Strong Jaw / Sand Rush
  Engine stats @252 (neutral/positive): Water Absorb: Atk 279/306, SpA 239/262, Spe 249/273 — Strong Jaw: Atk 279/306, SpA 239/262, Spe 249/273 — Sand Rush: Atk 279/306, SpA 239/262, Spe 249/273
  Item: **free**
  STAB: Water Fishious Rend 170P · Dragon Draco Meteor 140S
  Physical coverage: Normal Mega Kick 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Steel Iron Head 80P
  Special coverage: Rock Meteor Beam 120 (charge)S, Ground Earth Power 90S, Normal Round 60S

**Dragapult** — species, **OU**, source: override
  Dragon/Ghost | BST 600 (88/120/75/100/75/142) | Abilities: Clear Body / Infiltrator / Cursed Body
  Engine stats @252 (neutral/positive): Clear Body: Atk 339/372, SpA 299/328, Spe 383/421 — Infiltrator: Atk 339/372, SpA 299/328, Spe 383/421 — Cursed Body: Atk 339/372, SpA 299/328, Spe 383/421
  Item: **free**
  STAB: Dragon Draco Meteor 140S · Ghost Phantom Force 90 (charge)P
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Flying Acrobatics 110P, Psychic Psychic Fangs 85P, Dark Sucker Punch 80P, Water Dive 80 (charge)P, Steel Steel Wing 70P
  Special coverage: Fire Fire Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Normal Tera Blast 80S, Bug Infestation 20S

**Dragonite** — species, **OU**, source: imported (natdex)
  Dragon/Flying | BST 600 (91/134/95/100/100/80) | Abilities: Inner Focus / Multiscale
  Engine stats @252 (neutral/positive): Inner Focus: Atk 367/403, SpA 299/328, Spe 259/284 — Multiscale: Atk 367/403, SpA 299/328, Spe 259/284
  Item: **free** — but its own Dragoninite is **refused in OU** (it would make Dragonite-Mega, Ubers)
  STAB: Dragon Draco Meteor 140S · Flying Hurricane 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Normal Tera Blast 80S

**Excadrill-Mega** — forme, **OU**, source: **estimated** _(its own `species.tier` reads UU; the enforced tier is the one shown)_
  Ground/Steel | BST 608 (110/165/100/65/65/103) | Abilities: Piercing Drill
  Engine stats @252 (neutral/positive): Piercing Drill: Atk 429/471, SpA 229/251, Spe 305/335
  Item: **forced — Excadrite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Ground Earthquake 100P · Steel Iron Head 80P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**, Poison Poison Jab 80P, Fighting Submission 80P, Bug X-Scissor 80P, Rock Rock Blast 25x2-5P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Bomb 90S, Normal Tera Blast 80S

**Feraligatr-Mega** — forme, **OU**, source: **estimated** _(its own `species.tier` reads RU; the enforced tier is the one shown)_
  Water/Dragon | BST 630 (85/160/125/89/93/78) | Abilities: Dragonize
  Engine stats @252 (neutral/positive): Dragonize: Atk 419/460, SpA 277/304, Spe 255/280
  Item: **forced — Feraligite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Water Aqua Tail 90P · Dragon Double-Edge 144P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Ground Earthquake 100P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Ice Ice Punch 75P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Rock Ancient Power 60S, Dark Snarl 55S, Ground Mud-Slap 20S

**Ferrothorn** — species, **OU**, source: imported (natdex)
  Grass/Steel | BST 489 (74/94/131/54/116/20) | Abilities: Iron Barbs / Anticipation
  Engine stats @252 (neutral/positive): Iron Barbs: Atk 287/315, SpA 207/227, Spe 139/152 — Anticipation: Atk 287/315, SpA 207/227, Spe 139/152
  Item: **free**
  STAB: Grass Power Whip 120P · Steel Steel Roller 130P **[conditional — fails with no terrain up]**
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Fighting Body Press 80P, Poison Poison Jab 80P, Bug Pin Missile 25x2-5P, Ghost Shadow Claw 70P, Dark Knock Off 65P
  Special coverage: Electric Thunder 120S, Normal Hidden Power 60S, Poison Acid Spray 40S

**Floette-Mega** — forme, **OU**, source: override
  Fairy | BST 651 (74/85/87/155/148/102) | Abilities: Fairy Aura
  Engine stats @252 (neutral/positive): Fairy Aura: Atk 269/295, SpA 409/449, Spe 303/333
  Item: **forced — Floettite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Fairy Light of Ruin 140S
  Physical coverage: Normal Return 102P, Grass Petal Blizzard 90P
  Special coverage: Grass Petal Dance 120S, Bug Pollen Puff 90S, Psychic Psychic 90S, Normal Tera Blast 80S, Water Chilling Water 50S

**Gallade-Mega** — forme, **OU**, source: imported (natdex)
  Psychic/Fighting | BST 618 (68/165/95/65/115/110) | Abilities: Inner Focus
  Engine stats @252 (neutral/positive): Inner Focus: Atk 429/471, SpA 229/251, Spe 319/350
  Item: **forced — Galladite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Psychic Zen Headbutt 80P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Grass Solar Blade 125 (charge)P, Normal Double-Edge 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**
  Special coverage: Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Flying Air Slash 75S

**Garchomp** — species, **OU**, source: imported (natdex)
  Dragon/Ground | BST 600 (108/130/95/80/85/102) | Abilities: Sand Veil / Rough Skin
  Engine stats @252 (neutral/positive): Sand Veil: Atk 359/394, SpA 259/284, Spe 303/333 — Rough Skin: Atk 359/394, SpA 259/284, Spe 303/333
  Item: **free** — but its own Garchompite Z is **refused in OU** (it would make Garchomp-Mega-Z, Ubers)
  STAB: Dragon Outrage 120P · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P, Dark Crunch 80P, Poison Poison Jab 80P
  Special coverage: Fire Fire Blast 120S, Water Surf 95S, Rock Power Gem 80S, Normal Tera Blast 80S

**Garchomp-Mega** — forme, **OU**, source: imported (natdex)
  Dragon/Ground | BST 700 (108/170/115/120/95/92) | Abilities: Sand Force
  Engine stats @252 (neutral/positive): Sand Force: Atk 439/482, SpA 339/372, Spe 283/311
  Item: **forced — Garchompite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Dragon Draco Meteor 140S · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P, Dark Crunch 80P, Poison Poison Jab 80P
  Special coverage: Fire Fire Blast 120S, Water Surf 95S, Rock Power Gem 80S, Normal Tera Blast 80S

**Gholdengo** — species, **OU**, source: imported (natdex)
  Steel/Ghost | BST 550 (87/60/95/133/91/84) | Abilities: Good as Gold
  Engine stats @252 (neutral/positive): Good as Gold: Atk 219/240, SpA 365/401, Spe 267/293
  Item: **free**
  STAB: Steel Steel Beam 140S · Ghost Shadow Ball 80S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Take Down 90P, Electric Thunder Punch 75P, Dark Thief 60P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Psychic Psychic 90S, Fairy Dazzling Gleam 80S, Rock Power Gem 80S, Normal Tera Blast 80S

**Glimmora-Mega** — forme, **OU**, source: **estimated** _(its own `species.tier` reads UU; the enforced tier is the one shown)_
  Rock/Poison | BST 625 (83/90/105/150/96/101) | Abilities: Adaptability
  Engine stats @252 (neutral/positive): Adaptability: Atk 279/306, SpA 399/438, Spe 301/331
  Item: **forced — Glimmoranite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Rock Meteor Beam 120 (charge)S · Poison Sludge Wave 95S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Ground Sand Tomb 35P
  Special coverage: Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Normal Tera Blast 80S

**Gliscor** — species, **OU**, source: imported (natdex)
  Ground/Flying | BST 510 (75/95/125/45/75/95) | Abilities: Hyper Cutter / Sand Veil / Poison Heal
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 289/317, SpA 189/207, Spe 289/317 — Sand Veil: Atk 289/317, SpA 189/207, Spe 289/317 — Poison Heal: Atk 289/317, SpA 189/207, Spe 289/317
  Item: **free**
  STAB: Ground Earthquake 100P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Water Crabhammer 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Psychic Psychic Fangs 85P
  Special coverage: Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Poison Sludge Bomb 90S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Bug Struggle Bug 50S **[power — only reachable when no other move can be selected]**

**Golisopod-Mega** — forme, **OU**, source: **estimated** _(its own `species.tier` reads RU; the enforced tier is the one shown)_
  Bug/Steel | BST 630 (75/150/175/70/120/40) | Abilities: Emergency Exit
  Engine stats @252 (neutral/positive): Emergency Exit: Atk 399/438, SpA 239/262, Spe 179/196
  Item: **forced — Golisopite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Bug First Impression 90P · Steel Iron Head 80P
  Physical coverage: Fighting Close Combat 120P, Normal Return 102P, Dragon Dual Chop 50x2P, Water Liquidation 85P, Ground Drill Run 80P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Water Muddy Water 95S, Poison Sludge Wave 95S, Dark Dark Pulse 80S, Normal Hidden Power 60S

**Great Tusk** — species, **OU**, source: imported (natdex)
  Ground/Fighting | BST 570 (115/131/131/53/53/87) | Abilities: Protosynthesis
  Engine stats @252 (neutral/positive): Protosynthesis: Atk 361/397, SpA 205/225, Spe 273/300
  Item: **free**
  STAB: Ground Headlong Rush 120P · Fighting Close Combat 120P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Steel Heavy Slam 120P, Bug Megahorn 120P, Electric Supercell Slam 100P, Fairy Play Rough 90P
  Special coverage: Steel Flash Cannon 80S, Psychic Psyshock 80S, Normal Tera Blast 80S

**Greninja** — species, **OU**, source: imported (natdex)
  Water/Dark | BST 530 (72/95/67/103/71/122) | Abilities: Torrent / Protean / Battle Bond
  Engine stats @252 (neutral/positive): Torrent: Atk 289/317, SpA 305/335, Spe 343/377 — Protean: Atk 289/317, SpA 305/335, Spe 343/377 — Battle Bond: Atk 289/317, SpA 305/335, Spe 343/377
  Item: **free**
  STAB: Water Hydro Pump 120S · Dark Dark Pulse 80S
  Physical coverage: Poison Gunk Shot 120P, Flying Acrobatics 110P, Normal Return 102P, Ground Dig 100 (charge)P, Fighting Brick Break 75P, Ice Ice Punch 75P
  Special coverage: Ice Blizzard 120S, Poison Sludge Wave 95S, Psychic Extrasensory 80S, Normal Tera Blast 80S, Grass Grass Knot 60S, Ground Mud Shot 55S

**Greninja-Ash** — forme, **OU**, source: imported (gen7)
  Water/Dark | BST 640 (72/145/67/153/71/132) | Abilities: Battle Bond
  Engine stats @252 (neutral/positive): Battle Bond: Atk 389/427, SpA 405/445, Spe 363/399
  Item: **forced — —** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Water Hydro Pump 120S · Dark Dark Pulse 80S
  Physical coverage: Poison Gunk Shot 120P, Flying Acrobatics 110P, Normal Return 102P, Ground Dig 100 (charge)P, Fighting Brick Break 75P, Ice Ice Punch 75P
  Special coverage: Ice Blizzard 120S, Poison Sludge Wave 95S, Psychic Extrasensory 80S, Normal Tera Blast 80S, Grass Grass Knot 60S, Ground Mud Shot 55S

**Greninja-Mega** — forme, **OU**, source: **estimated**
  Water/Dark | BST 630 (72/125/77/133/81/142) | Abilities: Protean
  Engine stats @252 (neutral/positive): Protean: Atk 349/383, SpA 365/401, Spe 383/421
  Item: **forced — Greninjite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Water Hydro Pump 120S · Dark Dark Pulse 80S
  Physical coverage: Poison Gunk Shot 120P, Normal Return 102P, Ground Dig 100 (charge)P, Flying Bounce 85 (charge)P, Fighting Brick Break 75P, Ice Ice Punch 75P
  Special coverage: Ice Blizzard 120S, Poison Sludge Wave 95S, Psychic Extrasensory 80S, Normal Tera Blast 80S, Grass Grass Knot 60S, Ground Mud Shot 55S

**Gyarados-Mega** — forme, **OU**, source: imported (natdex)
  Water/Dark | BST 640 (95/155/109/70/130/81) | Abilities: Mold Breaker
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 409/449, SpA 239/262, Spe 261/287
  Item: **forced — Gyaradosite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Water Aqua Tail 90P · Dark Crunch 80P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Dragon Outrage 120P, Grass Power Whip 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Flying Hurricane 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S, Normal Uproar 90S

**Hawlucha-Mega** — forme, **OU**, source: override
  Fighting/Flying | BST 600 (78/137/100/74/93/118) | Abilities: No Guard
  Engine stats @252 (neutral/positive): No Guard: Atk 373/410, SpA 247/271, Spe 335/368
  Item: **forced — Hawluchanite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**, Steel Iron Head 80P
  Special coverage: Normal Uproar 90S, Grass Grass Knot 60S

**Heatran** — species, **OU**, source: imported (natdex)
  Fire/Steel | BST 600 (91/90/106/130/106/77) | Abilities: Flash Fire / Flame Body
  Engine stats @252 (neutral/positive): Flash Fire: Atk 279/306, SpA 359/394, Spe 253/278 — Flame Body: Atk 279/306, SpA 359/394, Spe 253/278
  Item: **free** — but its own Heatranite is **refused in OU** (it would make Heatran-Mega, Ubers)
  STAB: Fire Eruption 150S · Steel Steel Beam 140S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Ground Earthquake 100P, Rock Stone Edge 100P, Fighting Body Press 80P, Dark Crunch 80P, Bug Lunge 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Dragon Dragon Pulse 90S, Ground Earth Power 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Rock Power Gem 80S

**Hoopa-Unbound** — species, **OU**, source: imported (natdex)
  Psychic/Dark | BST 680 (80/160/60/170/130/80) | Abilities: Magician
  Engine stats @252 (neutral/positive): Magician: Atk 419/460, SpA 439/482, Spe 259/284
  Item: **free**
  STAB: Psychic Future Sight 120S · Dark Hyperspace Fury 100P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Poison Gunk Shot 120P, Dragon Dual Chop 50x2P, Ghost Phantom Force 90 (charge)P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Uproar 90S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Iron Hands** — species, **OU**, source: imported (natdex)
  Fighting/Electric | BST 570 (154/140/108/50/68/50) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 379/416, SpA 199/218, Spe 199/218
  Item: **free**
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Electric Supercell Slam 100P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Ground Earthquake 100P, Fairy Play Rough 90P, Fire Fire Punch 75P, Ice Ice Punch 75P
  Special coverage: Normal Tera Blast 80S

**Iron Moth** — species, **OU**, source: imported (natdex)
  Fire/Poison | BST 570 (80/70/60/140/110/110) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 239/262, SpA 379/416, Spe 319/350
  Item: **free**
  STAB: Fire Overheat 140S · Poison Sludge Wave 95S
  Physical coverage: Flying Acrobatics 110P, Normal Take Down 90P, Bug Lunge 80P
  Special coverage: Flying Hurricane 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Bug Bug Buzz 90S, Psychic Psychic 90S, Fairy Dazzling Gleam 80S

**Iron Valiant** — species, **OU**, source: imported (natdex)
  Fairy/Fighting | BST 590 (74/130/90/120/60/116) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 359/394, SpA 339/372, Spe 331/364
  Item: **free**
  STAB: Fairy Moonblast 95S · Fighting Close Combat 120P
  Physical coverage: Grass Leaf Blade 90P, Water Liquidation 85P, Poison Poison Jab 80P, Dark Throat Chop 80P, Bug X-Scissor 80P, Psychic Zen Headbutt 80P
  Special coverage: Psychic Future Sight 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Ghost Shadow Ball 80S, Ice Icy Wind 55S

**Kartana** — species, **OU**, source: imported (natdex)
  Grass/Steel | BST 570 (59/181/131/59/31/109) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 461/507, SpA 217/238, Spe 317/348
  Item: **free**
  STAB: Grass Solar Blade 125 (charge)P · Steel Smart Strike 70P
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Fighting Sacred Sword 90P, Bug X-Scissor 80P, Dark Night Slash 70P, Psychic Psycho Cut 70P, Flying Aerial Ace 60P
  Special coverage: Flying Air Slash 75S, Normal Hidden Power 60S, Fighting Vacuum Wave 40S

**Kingambit** — species, **OU**, source: imported (natdex)
  Dark/Steel | BST 550 (100/135/120/60/85/50) | Abilities: Defiant / Supreme Overlord / Pressure
  Engine stats @252 (neutral/positive): Defiant: Atk 369/405, SpA 219/240, Spe 199/218 — Supreme Overlord: Atk 369/405, SpA 219/240, Spe 199/218 — Pressure: Atk 369/405, SpA 219/240, Spe 199/218
  Item: **free**
  STAB: Dark Foul Play 95P · Steel Iron Head 80P
  Physical coverage: Normal Return 102P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Flying Air Slash 75S, Grass Grass Knot 60S

**Kommo-o** — species, **OU**, source: imported (natdex)
  Dragon/Fighting | BST 600 (75/110/125/100/105/85) | Abilities: Bulletproof / Soundproof / Overcoat
  Engine stats @252 (neutral/positive): Bulletproof: Atk 319/350, SpA 299/328, Spe 269/295 — Soundproof: Atk 319/350, SpA 299/328, Spe 269/295 — Overcoat: Atk 319/350, SpA 299/328, Spe 269/295
  Item: **free**
  STAB: Dragon Draco Meteor 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Poison Poison Jab 80P, Dark Throat Chop 80P
  Special coverage: Normal Boomburst 140S, Fire Flamethrower 95S, Steel Flash Cannon 80S, Electric Shock Wave 60S, Water Water Pulse 60S

**Kyurem** — species, **OU**, source: imported (natdex)
  Dragon/Ice | BST 660 (125/130/90/130/90/95) | Abilities: Pressure
  Engine stats @252 (neutral/positive): Pressure: Atk 359/394, SpA 359/394, Spe 289/317
  Item: **free**
  STAB: Dragon Draco Meteor 140S · Ice Blizzard 120S
  Physical coverage: Normal Return 102P, Flying Dual Wingbeat 50x2P, Rock Stone Edge 100P, Fighting Body Press 80P, Steel Iron Head 80P, Psychic Zen Headbutt 80P
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Normal Hyper Voice 90S, Psychic Psychic 90S, Steel Flash Cannon 80S, Ghost Shadow Ball 80S

**Kyurem-Black** — species, **OU**, source: override
  Dragon/Ice | BST 700 (125/170/100/120/90/95) | Abilities: Teravolt
  Engine stats @252 (neutral/positive): Teravolt: Atk 439/482, SpA 339/372, Spe 289/317
  Item: **free**
  STAB: Dragon Draco Meteor 140S · Ice Freeze Shock 140 (charge)P
  Physical coverage: Normal Return 102P, Flying Dual Wingbeat 50x2P, Electric Fusion Bolt 100P, Rock Stone Edge 100P, Fighting Body Press 80P, Steel Iron Head 80P
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Normal Hyper Voice 90S, Psychic Psychic 90S, Steel Flash Cannon 80S, Ghost Shadow Ball 80S

**Landorus-Therian** — species, **OU**, source: imported (natdex)
  Ground/Flying | BST 600 (89/145/90/105/80/91) | Abilities: Intimidate
  Engine stats @252 (neutral/positive): Intimidate: Atk 389/427, SpA 309/339, Spe 281/309
  Item: **free**
  STAB: Ground Earthquake 100P · Flying Fly 90 (charge)P
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Dragon Outrage 120P, Fighting Superpower 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Dark Crunch 80P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Wave 95S, Psychic Psychic 90S, Normal Tera Blast 80S, Grass Grass Knot 60S

**Latios** — species, **OU**, source: imported (natdex)
  Dragon/Psychic | BST 600 (80/90/80/130/110/110) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 279/306, SpA 359/394, Spe 319/350
  Item: **free**
  STAB: Dragon Draco Meteor 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Water Liquidation 85P, Ghost Shadow Claw 70P, Steel Steel Wing 70P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Water Surf 95S, Fighting Aura Sphere 90S, Ghost Shadow Ball 80S

**Latios-Mega** — forme, **OU**, source: imported (natdex)
  Dragon/Psychic | BST 700 (80/130/100/160/120/110) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 359/394, SpA 419/460, Spe 319/350
  Item: **forced — Latiosite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Dragon Draco Meteor 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Water Liquidation 85P, Ghost Shadow Claw 70P, Steel Steel Wing 70P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Water Surf 95S, Fighting Aura Sphere 90S, Ghost Shadow Ball 80S

**Lopunny-Mega** — forme, **OU**, source: imported (natdex)
  Normal/Fighting | BST 580 (65/136/94/54/96/135) | Abilities: Scrappy
  Engine stats @252 (neutral/positive): Scrappy: Atk 371/408, SpA 207/227, Spe 369/405
  Item: **forced — Lopunnite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]** · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Flying Bounce 85 (charge)P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**, Fire Fire Punch 75P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S, Water Water Pulse 60S, Ground Mud-Slap 20S

**Lucario-Mega** — forme, **OU**, source: override
  Fighting/Steel | BST 625 (70/145/88/140/70/112) | Abilities: Adaptability
  Engine stats @252 (neutral/positive): Adaptability: Atk 389/427, SpA 379/416, Spe 323/355
  Item: **forced — Lucarionite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Steel Steel Beam 140S
  Physical coverage: Normal Mega Kick 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Fire Blaze Kick 85P, Dark Crunch 80P
  Special coverage: Dragon Dragon Pulse 90S, Psychic Psychic 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Water Water Pulse 60S

**Lugia** — species, **OU**, source: override
  Psychic/Flying | BST 680 (106/90/130/90/154/110) | Abilities: Pressure / Multiscale
  Engine stats @252 (neutral/positive): Pressure: Atk 279/306, SpA 279/306, Spe 319/350 — Multiscale: Atk 279/306, SpA 279/306, Spe 319/350
  Item: **free**
  STAB: Psychic Psycho Boost 140S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Dragon Dragon Rush 100P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Ice Avalanche 60P **[power — doubles to 120 if the user was hit first this turn]**
  Special coverage: Ice Blizzard 120S, Water Hydro Pump 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S, Ground Earth Power 90S, Normal Hyper Voice 90S

**Lunala** — species, **OU**, source: override
  Psychic/Ghost | BST 680 (137/113/89/137/107/97) | Abilities: Shadow Shield
  Engine stats @252 (neutral/positive): Shadow Shield: Atk 325/357, SpA 373/410, Spe 293/322
  Item: **free**
  STAB: Psychic Future Sight 120S · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**
  Physical coverage: Flying Sky Attack 140 (charge)P, Normal Return 102P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Fire Heat Wave 100S

**Manaphy** — species, **OU**, source: imported (natdex)
  Water | BST 600 (100/100/100/100/100/100) | Abilities: Hydration
  Engine stats @252 (neutral/positive): Hydration: Atk 299/328, SpA 299/328, Spe 299/328
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Flying Bounce 85 (charge)P, Psychic Zen Headbutt 80P, Bug U-turn 70P, Dark Knock Off 65P
  Special coverage: Ice Blizzard 120S, Grass Energy Ball 90S, Psychic Psychic 90S, Normal Uproar 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S

**Marshadow** — species, **OU**, source: override
  Fighting/Ghost | BST 600 (90/125/80/90/90/125) | Abilities: Technician
  Engine stats @252 (neutral/positive): Technician: Atk 349/383, SpA 279/306, Spe 349/383
  Item: **free**
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Dragon Outrage 120P, Flying Acrobatics 110P, Rock Stone Edge 100P, Dark Foul Play 95P, Fire Blaze Kick 85P
  Special coverage: Grass Grass Knot 60S, Normal Hidden Power 60S

**Mawile-Mega** — forme, **OU**, source: imported (natdex)
  Steel/Fairy | BST 480 (50/105/125/55/95/50) | Abilities: Huge Power
  Engine stats @252 (neutral/positive): Huge Power: Atk 618/678, SpA 209/229, Spe 199/218
  Item: **forced — Mawilite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Steel Iron Head 80P · Fairy Play Rough 90P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Rock Stone Edge 100P, Dark Foul Play 95P, Psychic Psychic Fangs 85P, Ice Ice Punch 75P
  Special coverage: Fire Fire Blast 120S, Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Poison Sludge Bomb 90S, Dark Dark Pulse 80S

**Medicham-Mega** — forme, **OU**, source: imported (natdex)
  Fighting/Psychic | BST 510 (60/100/85/80/85/100) | Abilities: Pure Power
  Engine stats @252 (neutral/positive): Pure Power: Atk 598/656, SpA 259/284, Spe 299/328
  Item: **forced — Medichamite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Psychic Zen Headbutt 80P
  Physical coverage: Normal Double-Edge 120P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**, Poison Poison Jab 80P, Fire Fire Punch 75P, Ice Ice Punch 75P, Rock Rock Slide 75P
  Special coverage: Grass Energy Ball 90S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Ground Mud-Slap 20S

**Melmetal** — species, **OU**, source: imported (natdex)
  Steel | BST 600 (135/143/143/80/65/34) | Abilities: Iron Fist
  Engine stats @252 (neutral/positive): Iron Fist: Atk 385/423, SpA 259/284, Spe 167/183
  Item: **free**
  STAB: Steel Steel Roller 130P **[conditional — fails with no terrain up]**
  Physical coverage: Normal Self-Destruct 200P **[power — the user **faints**]**, Fighting Superpower 120P, Ground Earthquake 100P, Dark Darkest Lariat 85P, Ice Ice Punch 75P, Rock Rock Slide 75P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Normal Round 60S

**Meowscarada** — species, **OU**, source: imported (natdex)
  Grass/Dark | BST 530 (76/110/70/81/70/123) | Abilities: Overgrow / Protean
  Engine stats @252 (neutral/positive): Overgrow: Atk 319/350, SpA 261/287, Spe 345/379 — Protean: Atk 319/350, SpA 261/287, Spe 345/379
  Item: **free**
  STAB: Grass Leaf Storm 140S · Dark Foul Play 95P
  Physical coverage: Flying Acrobatics 110P, Fairy Play Rough 90P, Normal Take Down 90P, Fighting Brick Break 75P, Electric Thunder Punch 75P, Ghost Shadow Claw 70P
  Special coverage: Fighting Aura Sphere 90S, Bug Pollen Puff 90S, Rock Power Gem 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Water Chilling Water 50S

**Metagross-Mega** — forme, **OU**, source: override
  Steel/Psychic | BST 700 (80/145/150/105/110/110) | Abilities: Tough Claws
  Engine stats @252 (neutral/positive): Tough Claws: Atk 389/427, SpA 309/339, Spe 319/350
  Item: **forced — Metagrossite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Steel Steel Beam 140S · Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Ground Earthquake 100P, Rock Stone Edge 100P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Rock Meteor Beam 120 (charge)S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Grass Grass Knot 60S

**Naganadel** — species, **OU**, source: override
  Poison/Dragon | BST 540 (73/73/73/127/73/121) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 245/269, SpA 353/388, Spe 341/375
  Item: **free**
  STAB: Poison Sludge Wave 95S · Dragon Draco Meteor 140S
  Physical coverage: Flying Sky Attack 140 (charge)P, Normal Return 102P, Steel Iron Tail 100P, Bug Leech Life 80P, Dark Throat Chop 80P, Ghost Shadow Claw 70P
  Special coverage: Fire Fire Blast 120S, Electric Thunderbolt 95S, Normal Uproar 90S, Dark Dark Pulse 80S, Flying Air Slash 75S, Bug Signal Beam 75S

**Necrozma-Dawn-Wings** — species, **OU**, source: override
  Psychic/Ghost | BST 680 (97/113/109/157/127/77) | Abilities: Prism Armor
  Engine stats @252 (neutral/positive): Prism Armor: Atk 325/357, SpA 413/454, Spe 253/278
  Item: **free**
  STAB: Psychic Future Sight 120S · Ghost Moongeist Beam 100S
  Physical coverage: Dragon Outrage 120P, Normal Return 102P, Ground Earthquake 100P, Rock Stone Edge 100P, Steel Iron Head 80P, Bug X-Scissor 80P
  Special coverage: Normal Wring Out 120S **[power — scales with the target’s **current** HP; quoted against a full-HP target]**, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Fire Heat Wave 100S, Dragon Dragon Pulse 90S, Ground Earth Power 90S

**Ogerpon-Cornerstone** — forme, **OU**, source: imported (natdex)
  Grass/Rock | BST 550 (80/120/84/60/96/110) | Abilities: Sturdy
  Engine stats @252 (neutral/positive): Sturdy: Atk 339/372, SpA 219/240, Spe 319/350
  Item: **forced — Cornerstone Mask** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Grass Solar Blade 125 (charge)P · Rock Ivy Cudgel 100P
  Physical coverage: Fighting Superpower 120P, Fairy Play Rough 90P, Normal Take Down 90P, Dark Throat Chop 80P, Psychic Zen Headbutt 80P, Ground Stomping Tantrum 75P
  Special coverage: Normal Tera Blast 80S

**Ogerpon-Hearthflame** — forme, **OU**, source: override
  Grass/Fire | BST 550 (80/120/84/60/96/110) | Abilities: Mold Breaker
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 339/372, SpA 219/240, Spe 319/350
  Item: **forced — Hearthflame Mask** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Grass Solar Blade 125 (charge)P · Fire Ivy Cudgel 100P
  Physical coverage: Fighting Superpower 120P, Fairy Play Rough 90P, Normal Take Down 90P, Dark Throat Chop 80P, Psychic Zen Headbutt 80P, Ground Stomping Tantrum 75P
  Special coverage: Normal Tera Blast 80S

**Ogerpon-Wellspring** — forme, **OU**, source: imported (natdex)
  Grass/Water | BST 550 (80/120/84/60/96/110) | Abilities: Water Absorb
  Engine stats @252 (neutral/positive): Water Absorb: Atk 339/372, SpA 219/240, Spe 319/350
  Item: **forced — Wellspring Mask** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Grass Solar Blade 125 (charge)P · Water Ivy Cudgel 100P
  Physical coverage: Fighting Superpower 120P, Fairy Play Rough 90P, Normal Take Down 90P, Dark Throat Chop 80P, Psychic Zen Headbutt 80P, Ground Stomping Tantrum 75P
  Special coverage: Normal Tera Blast 80S

**Pheromosa** — species, **OU**, source: override
  Bug/Fighting | BST 570 (71/137/37/137/37/151) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 373/410, SpA 373/410, Spe 401/441
  Item: **free**
  STAB: Bug Bug Buzz 90S · Fighting High Jump Kick 130P
  Physical coverage: Dragon Outrage 120P, Normal Return 102P, Dark Foul Play 95P, Flying Bounce 85 (charge)P, Ground Drill Run 80P, Poison Poison Jab 80P
  Special coverage: Ice Blizzard 120S, Normal Hidden Power 60S, Electric Shock Wave 60S

**Pinsir-Mega** — forme, **OU**, source: imported (natdex)
  Bug/Flying | BST 600 (65/155/120/65/90/105) | Abilities: Aerilate
  Engine stats @252 (neutral/positive): Aerilate: Atk 409/449, SpA 229/251, Spe 309/339
  Item: **forced — Pinsirite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Bug X-Scissor 80P · Flying Double-Edge 156P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Dragon Outrage 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**
  Special coverage: Fighting Focus Blast 120S

**Raging Bolt** — species, **OU**, source: imported (natdex)
  Electric/Dragon | BST 590 (125/73/91/137/89/75) | Abilities: Protosynthesis
  Engine stats @252 (neutral/positive): Protosynthesis: Atk 245/269, SpA 373/410, Spe 249/273
  Item: **free**
  STAB: Electric Thunder 120S · Dragon Draco Meteor 140S
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Ground Earthquake 100P, Fighting Body Press 80P, Dark Crunch 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Normal Hyper Voice 90S, Rock Ancient Power 60S, Dark Snarl 55S

**Rillaboom** — species, **OU**, source: imported (natdex)
  Grass | BST 530 (100/125/90/60/70/85) | Abilities: Overgrow / Grassy Surge
  Engine stats @252 (neutral/positive): Overgrow: Atk 349/383, SpA 219/240, Spe 269/295 — Grassy Surge: Atk 349/383, SpA 219/240, Spe 269/295
  Item: **free**
  STAB: Grass Solar Blade 125 (charge)P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Flying Acrobatics 110P, Ground Earthquake 100P, Dark Darkest Lariat 85P, Bug U-turn 70P
  Special coverage: Normal Boomburst 140S, Fighting Focus Blast 120S, Ground Earth Power 90S, Dark Snarl 55S

**Roaring Moon** — species, **OU**, source: override
  Dragon/Dark | BST 590 (105/139/71/55/101/119) | Abilities: Protosynthesis
  Engine stats @252 (neutral/positive): Protosynthesis: Atk 377/414, SpA 209/229, Spe 337/370
  Item: **free**
  STAB: Dragon Outrage 120P · Dark Crunch 80P
  Physical coverage: Normal Double-Edge 120P, Flying Acrobatics 110P, Ground Earthquake 100P, Rock Stone Edge 100P, Fighting Body Press 80P, Steel Iron Head 80P
  Special coverage: Fire Fire Blast 120S, Flying Hurricane 120S, Water Hydro Pump 120S, Normal Hyper Voice 90S

**Samurott-Hisui** — species, **OU**, source: imported (natdex)
  Water/Dark | BST 528 (90/108/80/100/65/85) | Abilities: Torrent / Sharpness
  Engine stats @252 (neutral/positive): Torrent: Atk 315/346, SpA 299/328, Spe 269/295 — Sharpness: Atk 315/346, SpA 299/328, Spe 269/295
  Item: **free**
  STAB: Water Hydro Pump 120S · Dark Dark Pulse 80S
  Physical coverage: Bug Megahorn 120P, Fighting Superpower 120P, Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Flying Aerial Ace 60P
  Special coverage: Normal Trump Card 200S **[power — power rises as its PP falls; quoted at full PP]**, Ice Blizzard 120S, Flying Air Slash 75S, Grass Grass Knot 60S, Fighting Vacuum Wave 40S

**Scizor-Mega** — forme, **OU**, source: imported (natdex)
  Bug/Steel | BST 600 (70/150/140/65/100/75) | Abilities: Technician
  Engine stats @252 (neutral/positive): Technician: Atk 399/438, SpA 229/251, Spe 249/273
  Item: **forced — Scizorite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Bug Lunge 80P · Steel Hard Press 100P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Fighting Close Combat 120P, Flying Dual Wingbeat 50x2P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**, Poison Cross Poison 70P, Psychic Psycho Cut 70P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Poison Venoshock 65S, Ghost Ominous Wind 60S, Fighting Vacuum Wave 40S

**Slowking-Galar** — species, **OU**, source: imported (natdex)
  Poison/Psychic | BST 490 (95/65/80/110/110/30) | Abilities: Curious Medicine / Own Tempo / Regenerator
  Engine stats @252 (neutral/positive): Curious Medicine: Atk 229/251, SpA 319/350, Spe 159/174 — Own Tempo: Atk 229/251, SpA 319/350, Spe 159/174 — Regenerator: Atk 229/251, SpA 319/350, Spe 159/174
  Item: **free**
  STAB: Poison Belch 120S **[conditional — fails until the user has eaten a Berry]** · Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Foul Play 95P, Water Aqua Tail 90P
  Special coverage: Normal Trump Card 200S **[power — power rises as its PP falls; quoted at full PP]**, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Zap Cannon 120S

**Solgaleo** — species, **OU**, source: override
  Psychic/Steel | BST 680 (137/137/107/113/89/97) | Abilities: Full Metal Body
  Engine stats @252 (neutral/positive): Full Metal Body: Atk 373/410, SpA 325/357, Spe 293/322
  Item: **free**
  STAB: Psychic Future Sight 120S · Steel Steel Beam 140S
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Fighting Close Combat 120P, Fire Flare Blitz 120P, Dragon Outrage 120P, Ground Earthquake 100P, Rock Stone Edge 100P
  Special coverage: Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Normal Hyper Voice 90S

**Spectrier** — species, **OU**, source: override
  Ghost | BST 580 (100/65/60/145/80/130) | Abilities: Grim Neigh
  Engine stats @252 (neutral/positive): Grim Neigh: Atk 229/251, SpA 389/427, Spe 359/394
  Item: **free**
  STAB: Ghost Shadow Ball 80S
  Physical coverage: Normal Double-Edge 120P, Fighting Double Kick 50x2P, Dark Foul Play 95P, Ground Stomping Tantrum 75P, Psychic Psycho Cut 70P
  Special coverage: Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S, Ground Mud Shot 55S, Fairy Draining Kiss 50S

**Tapu Koko** — species, **OU**, source: imported (natdex)
  Electric/Fairy | BST 570 (70/115/85/95/75/130) | Abilities: Electric Surge / Telepathy
  Engine stats @252 (neutral/positive): Electric Surge: Atk 329/361, SpA 289/317, Spe 359/394 — Telepathy: Atk 329/361, SpA 289/317, Spe 359/394
  Item: **free**
  STAB: Electric Thunder 120S · Fairy Dazzling Gleam 80S
  Physical coverage: Flying Sky Attack 140 (charge)P, Normal Return 102P, Steel Iron Head 80P, Bug U-turn 70P, Dark Assurance 60P **[power — doubles to 120 if the target has already taken damage this turn]**
  Special coverage: Normal Hyper Voice 90S, Grass Grass Knot 60S, Psychic Stored Power 20S

**Tapu Lele** — species, **OU**, source: imported (natdex)
  Psychic/Fairy | BST 570 (70/85/75/130/115/95) | Abilities: Psychic Surge / Telepathy
  Engine stats @252 (neutral/positive): Psychic Surge: Atk 269/295, SpA 359/394, Spe 289/317 — Telepathy: Atk 269/295, SpA 359/394, Spe 289/317
  Item: **free**
  STAB: Psychic Future Sight 120S · Fairy Moonblast 95S
  Physical coverage: Normal Return 102P, Dark Thief 60P, Ghost Astonish 30P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Energy Ball 90S, Ghost Shadow Ball 80S, Normal Hidden Power 60S

**Terapagos** — species, **OU**, source: imported (natdex)
  Normal | BST 450 (90/65/85/65/85/60) | Abilities: Tera Shift
  Engine stats @252 (neutral/positive): Tera Shift: Atk 289/317, SpA 309/339, Spe 269/295
  Item: **free**
  STAB: Normal Double-Edge 120P
  Physical coverage: Fire Flare Blitz 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Electric Supercell Slam 100P, Fighting Body Press 80P, Dark Crunch 80P
  Special coverage: Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Fire Flamethrower 95S, Ice Ice Beam 95S, Water Surf 95S

**Terapagos-Terastal** — species, **OU**, source: imported (natdex)
  Normal | BST 600 (95/95/110/105/110/85) | Abilities: Tera Shell
  Engine stats @252 (neutral/positive): Tera Shell: Atk 289/317, SpA 309/339, Spe 269/295
  Item: **free**
  STAB: Normal Double-Edge 120P
  Physical coverage: Fire Flare Blitz 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Electric Supercell Slam 100P, Fighting Body Press 80P, Dark Crunch 80P
  Special coverage: Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Fire Flamethrower 95S, Ice Ice Beam 95S, Water Surf 95S

**Ting-Lu** — species, **OU**, source: imported (natdex)
  Dark/Ground | BST 580 (165/110/130/50/80/45) | Abilities: Vessel of Ruin
  Engine stats @252 (neutral/positive): Vessel of Ruin: Atk 319/350, SpA 199/218, Spe 189/207
  Item: **free**
  STAB: Dark Throat Chop 80P · Ground Earthquake 100P
  Physical coverage: Normal Double-Edge 120P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Fighting Body Press 80P, Psychic Zen Headbutt 80P
  Special coverage: Normal Tera Blast 80S, Ghost Hex 65S

**Tornadus-Therian** — species, **OU**, source: imported (natdex)
  Flying | BST 580 (79/100/80/110/90/121) | Abilities: Regenerator
  Engine stats @252 (neutral/positive): Regenerator: Atk 299/328, SpA 319/350, Spe 341/375
  Item: **free**
  STAB: Flying Hurricane 120S
  Physical coverage: Fighting Superpower 120P, Normal Thrash 120P, Steel Iron Tail 100P, Dark Foul Play 95P, Bug U-turn 70P, Rock Smack Down 50P
  Special coverage: Fighting Focus Blast 120S, Fire Heat Wave 100S, Poison Sludge Wave 95S, Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S

**Toxapex** — species, **OU**, source: imported (natdex)
  Poison/Water | BST 495 (50/63/152/53/142/35) | Abilities: Merciless / Limber / Regenerator
  Engine stats @252 (neutral/positive): Merciless: Atk 225/247, SpA 205/225, Spe 169/185 — Limber: Atk 225/247, SpA 205/225, Spe 169/185 — Regenerator: Atk 225/247, SpA 205/225, Spe 169/185
  Item: **free**
  STAB: Poison Gunk Shot 120P · Water Hydro Pump 120S
  Physical coverage: Normal Return 102P, Ice Ice Spinner 80P, Bug Lunge 80P, Dark Knock Off 65P, Rock Smack Down 50P, Flying Peck 35P
  Special coverage: Ice Blizzard 120S, Normal Tera Blast 80S, Ghost Hex 65S, Ground Mud Shot 55S, Bug Infestation 20S

**Tyranitar-Mega** — forme, **OU**, source: imported (natdex)
  Rock/Dark | BST 700 (100/164/150/95/120/71) | Abilities: Sand Stream
  Engine stats @252 (neutral/positive): Sand Stream: Atk 427/469, SpA 289/317, Spe 241/265
  Item: **forced — Tyranitarite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Rock Stone Edge 100P · Dark Foul Play 95P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Steel Heavy Slam 120P, Dragon Outrage 120P, Ground Earthquake 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S

**Urshifu-Rapid-Strike** — species, **OU**, source: imported (natdex)
  Fighting/Water | BST 550 (100/130/100/63/60/97) | Abilities: Unseen Fist
  Engine stats @252 (neutral/positive): Unseen Fist: Atk 359/394, SpA 225/247, Spe 293/322
  Item: **free**
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Water Liquidation 85P
  Physical coverage: Normal Double-Edge 120P, Flying Acrobatics 110P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Ice Ice Spinner 80P
  Special coverage: Dark Dark Pulse 80S, Normal Tera Blast 80S

**Volcarona** — species, **OU**, source: imported (natdex)
  Bug/Fire | BST 550 (85/60/65/135/105/100) | Abilities: Flame Body / Swarm
  Engine stats @252 (neutral/positive): Flame Body: Atk 219/240, SpA 369/405, Spe 299/328 — Swarm: Atk 219/240, SpA 369/405, Spe 299/328
  Item: **free**
  STAB: Bug Bug Buzz 90S · Fire Overheat 140S
  Physical coverage: Normal Double-Edge 120P, Flying Acrobatics 110P, Electric Wild Charge 90P, Poison Poison Jab 80P, Psychic Zen Headbutt 80P, Grass Trailblaze 50P
  Special coverage: Flying Hurricane 120S, Grass Solar Beam 120 (charge)S, Psychic Psychic 90S, Normal Tera Blast 80S

**Xurkitree** — species, **OU**, source: imported (natdex)
  Electric | BST 570 (83/89/71/173/71/83) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 277/304, SpA 445/489, Spe 265/291
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Grass Power Whip 120P, Normal Return 102P, Dark Brutal Swing 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Bug Signal Beam 75S, Normal Hidden Power 60S

**Zamazenta** — species, **OU**, source: imported (natdex)
  Fighting | BST 670 (92/130/115/80/115/138) | Abilities: Dauntless Shield
  Engine stats @252 (neutral/positive): Dauntless Shield: Atk 359/394, SpA 259/284, Spe 375/412
  Item: **free** — but its own Rusted Shield is **refused in OU** (it would make Zamazenta-Crowned, Ubers)
  STAB: Fighting Close Combat 120P
  Physical coverage: Steel Heavy Slam 100P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Normal Take Down 90P, Electric Wild Charge 90P
  Special coverage: Steel Steel Beam 140S, Grass Solar Beam 120 (charge)S, Fairy Moonblast 95S, Normal Hyper Voice 90S, Dark Snarl 55S

**Zapdos** — species, **OU**, source: imported (natdex)
  Electric/Flying | BST 580 (90/90/85/125/90/100) | Abilities: Pressure / Static / Lightning Rod
  Engine stats @252 (neutral/positive): Pressure: Atk 279/306, SpA 349/383, Spe 299/328 — Static: Atk 279/306, SpA 349/383, Spe 299/328 — Lightning Rod: Atk 279/306, SpA 349/383, Spe 299/328
  Item: **free**
  STAB: Electric Thunder 120S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Fighting Rock Smash 40P
  Special coverage: Fire Heat Wave 100S, Psychic Extrasensory 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Rock Ancient Power 60S, Ghost Ominous Wind 60S

**Zeraora-Mega** — forme, **OU**, source: **estimated** _(its own `species.tier` reads UU; the enforced tier is the one shown)_
  Electric | BST 700 (88/157/75/147/80/153) | Abilities: Volt Absorb
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 413/454, SpA 393/432, Spe 405/445
  Item: **forced — Zeraorite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Mega Kick 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Fairy Play Rough 90P, Fire Blaze Kick 85P
  Special coverage: Fighting Focus Blast 120S, Grass Grass Knot 60S, Normal Hidden Power 60S, Dark Snarl 55S
---

## E. There is no downward bar in this pass

**This is a scoping decision, and it differs from the ZU packet's.** ZU had no
downward bar because it is the floor. UU has RU beneath it — the downward
question is simply **not the one being asked**, because PROJECT_CONTEXT §10
records that a downward and an upward pass on the same rung at the same time
cannot be attributed to either.

- **Do not propose demotions.** A UU entry that looks weak is out of scope here.
- **"Outclassed within UU" is not a finding in this pass.**
- The downward half was asked in `UU_FINAL_EVIDENCE.md`, with the full RU
  roster as its bar, and returned **move nothing**.

If reading Part I persuades you that a specific UU entry belongs in RU, **say so
separately and label it out of scope** rather than folding it into the answer.

---
## F. Estimated-forme audit — RESOLVED

**Nothing in UU sits on an estimate any more, and that is this pass's one
implementation action.** Seven formes were on `estimateFormeTier`'s
nearest-neighbour guess when this packet was first generated. All seven were
reviewed and **pinned at the tier they already had** — a provenance change, not a
tier change.

| Forme | Enforced | `species.tier` | Provenance | Base | Base's tier | BST | Types | Ability |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dragalge-Mega | **UU** | UU | `redgpt-override` | Dragalge | NU | 594 | Poison/Dragon | Regenerator |
| Drampa-Mega | **UU** | UU | `redgpt-override` | Drampa | NU | 585 | Normal/Dragon | Berserk |
| Emboar-Mega | **UU** | UU | `redgpt-override` | Emboar | PU | 628 | Fire/Fighting | Mold Breaker |
| Meganium-Mega | **UU** | UU | `redgpt-override` | Meganium | ZU | 625 | Grass/Fairy | Mega Sol |
| Scrafty-Mega | **UU** | UU | `redgpt-override` | Scrafty | NU | 588 | Dark/Fighting | Intimidate |
| Staraptor-Mega | **UU** | UU | `redgpt-override` | Staraptor | NU | 585 | Fighting/Flying | Contrary |
| Starmie-Mega | **UU** | UU | `redgpt-override` | Starmie | NU | 620 | Water/Psychic | Huge Power |

**Two things that pin buys, neither of them a tier move.** The model can no
longer drag a reviewed verdict when it shifts — which has happened three times on
this programme, most recently taking Delphox-Mega UU → OU off the ZU floor. And
`species.tier` now agrees with the enforced tier for all seven, so the §10
disagreement set drops by seven; the *enforced* tier never moved.

**The bases were deliberately not touched**, and they span four rungs, which is
where a pin that leaked onto a base would show:
Dragalge NU, Drampa NU, Emboar PU, Meganium ZU, Scrafty NU, Staraptor NU, Starmie NU.

**Tier provenance across the whole UU roster:**

| Source | Entries |
| --- | --- |
| imported (natdex) | 62 |
| override | 29 |

For contrast, estimated entries by rung: Ubers 4, OU 9, UU 0, RU 7, NU 0, PU 0, ZU 0.

**A pin converts `estimated` to `redgpt-override` and stops the model moving a
reviewed verdict** — that is what happened to Floette-Mega, Meowstic-M-Mega and
Tatsugiri-Curly-Mega on 2026-08-17, and to Delphox-Mega when the ZU floor drifted
it. So *"leave it where it is, explicitly"* is a real and useful verdict for any
of the seven above, distinct from *"leave it alone"*.

---
## G. Serious UU → OU candidate evidence

**36 of 91 UU entries tripped three or more mechanical flags in
the scan.** The thresholds are **measured against the live OU distribution**
rather than guessed — OU's own median and 75th percentile of engine-resolved
Attack, Special Attack, Speed and BST:

| Bar | median | 75th percentile |
| --- | --- | --- |
| Attack (max +nature, 252 EVs) | 372 | 416 |
| Special Attack | 328 | 401 |
| Speed | 322 | 350 |
| BST | 600 | 630 |

**No cap.** All **36** flagged entries with a resolvable offensive set get
**two** damage matrices: against a **UU** defensive core, which asks *can UU
already answer this*, and against an **OU** defensive core, which asks *would it
be an ordinary OU Pokémon or a problem there*. Both run the same moves so the
columns compare directly.

**Flags are reasons to look, not verdicts.**

### Latias-Mega

_Flagged for: Special Attack **416** — in OU's top quarter (≥401); Speed **350** — in OU's top quarter (≥350); **BST 700** — in OU's top quarter (≥630); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Levitate; reliable recovery on a bulky frame._

**Latias-Mega** — forme, **UU**, source: imported (natdex)
  Dragon/Psychic | BST 700 (80/100/120/140/150/110) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 299/328, SpA 379/416, Spe 319/350
  Item: **forced — Latiasite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Dragon Draco Meteor 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Water Liquidation 85P, Dark Sucker Punch 80P, Ghost Shadow Claw 70P
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

Attacker: **Latias-Mega**, timid {"spa":252,"spe":252,"hp":4}, **Latiasite (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Draco Meteor | Future Sight | Thunder | Solar Beam |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 142-168 (19.9-23.5%) | 122-144 (17.1-20.2%) | 81-96 (11.3-13.4%) | 81-96 (11.3-13.4%) |
| Chansey (specWall, Eviolite) | 114-134 (16.2-19%) | 98-115 (13.9-16.3%) | 65-77 (9.2-10.9%) | 65-77 (9.2-10.9%) |
| Clefable (specWall, Leftovers) | 0-0 (0-0%) | 161-190 (40.9-48.2%) | 107-126 (27.2-32%) | 107-126 (27.2-32%) |
| Slowbro (physWall, Leftovers) | 292-344 (74.1-87.3%) | 125-147 (31.7-37.3%) | 334-393 (84.8-99.7%) | 334-393 (84.8-99.7%) |
| Slowbro-Mega (physWall, no item) | 292-344 (74.1-87.3%) | 125-147 (31.7-37.3%) | 334-393 (84.8-99.7%) | 334-393 (84.8-99.7%) |
| Slowking (specWall, Leftovers) | 164-194 (41.6-49.2%) | 70-83 (17.8-21.1%) | 188-222 (47.7-56.3%) | 188-222 (47.7-56.3%) |
| Skarmory (physWall, Leftovers) | 162-191 (48.5-57.2%) | 139-164 (41.6-49.1%) | 372-438 (111.4-131.1%) | 46-54 (13.8-16.2%) |
| Skarmory-Mega (physWall, no item) | 121-143 (36.2-42.8%) | 104-122 (31.1-36.5%) | 278-327 (83.2-97.9%) | 34-40 (10.2-12%) |
| Celesteela (physWall, Leftovers) | 120-141 (30.2-35.4%) | 103-121 (25.9-30.4%) | 276-325 (69.3-81.7%) | 34-40 (8.5-10.1%) |
| Hippowdon (physWall, Leftovers) | 318-374 (75.7-89%) | 273-321 (65-76.4%) | 0-0 (0-0%) | 182-214 (43.3-51%) |
| Amoonguss (specWall, Black Sludge) | 202-238 (46.8-55.1%) | 348-409 (80.6-94.7%) | 58-68 (13.4-15.7%) | 29-34 (6.7-7.9%) |
| Goodra-Hisui (specWall, Leftovers) | 132-155 (36.3-42.6%) | 56-66 (15.4-18.1%) | 37-44 (10.2-12.1%) | 18-22 (4.9-6%) |
| Rotom-Wash (physWall, Leftovers) | 229-270 (75.3-88.8%) | 197-232 (64.8-76.3%) | 131-154 (43.1-50.7%) | 263-309 (86.5-101.6%) |
| Swampert (physWall, Leftovers) | 265-312 (65.6-77.2%) | 228-268 (56.4-66.3%) | 0-0 (0-0%) | 608-715 (150.5-177%) |
| Tyranitar (specWall, Leftovers) | 175-206 (43.3-51%) | 0-0 (0-0%) | 100-118 (24.8-29.2%) | 100-118 (24.8-29.2%) |
| Scizor (physWall, Leftovers) | 146-172 (42.4-50%) | 125-147 (36.3-42.7%) | 167-196 (48.5-57%) | 41-49 (11.9-14.2%) |
| Buzzwole (physWall, Leftovers) | 402-473 (96.2-113.2%) | 691-813 (165.3-194.5%) | 230-271 (55-64.8%) | 115-135 (27.5-32.3%) |
| Aegislash (physWall, Leftovers) | 85-100 (26.2-30.9%) | 73-86 (22.5-26.5%) | 98-115 (30.2-35.5%) | 49-57 (15.1-17.6%) |
| Tapu Fini (specWall, Leftovers) | 0-0 (0-0%) | 126-148 (36.6-43%) | 168-197 (48.8-57.3%) | 168-197 (48.8-57.3%) |
| Corviknight (physWall, Leftovers) | 139-163 (34.8-40.8%) | 119-140 (29.8-35%) | 318-374 (79.5-93.5%) | 39-46 (9.8-11.5%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Draco Meteor | Future Sight | Thunder | Solar Beam |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 107-126 (30.4-35.8%) | 92-108 (26.1-30.7%) | 61-72 (17.3-20.5%) | 30-36 (8.5-10.2%) |
| Toxapex (physWall, Black Sludge) | 180-211 (59.2-69.4%) | 309-364 (101.6-119.7%) | 206-242 (67.8-79.6%) | 103-121 (33.9-39.8%) |
| Clodsire (specWall, Leftovers) | 175-206 (37.7-44.4%) | 302-355 (65.1-76.5%) | 0-0 (0-0%) | 100-118 (21.6-25.4%) |
| Dondozo (physWall, Leftovers) | 344-405 (68.3-80.4%) | 295-348 (58.5-69%) | 394-464 (78.2-92.1%) | 394-464 (78.2-92.1%) |
| Gliscor (physWall, Toxic Orb) | 308-362 (87-102.3%) | 264-311 (74.6-87.9%) | 0-0 (0-0%) | 176-207 (49.7-58.5%) |
| Ting-Lu (physWall, Leftovers) | 219-258 (41-48.3%) | 0-0 (0-0%) | 0-0 (0-0%) | 251-296 (47-55.4%) |
| Great Tusk (physWall, Leftovers) | 402-473 (92.6-109%) | 691-813 (159.2-187.3%) | 0-0 (0-0%) | 460-542 (106-124.9%) |
| Alomomola (physWall, Leftovers) | 453-533 (84.8-99.8%) | 389-457 (72.8-85.6%) | 518-610 (97-114.2%) | 518-610 (97-114.2%) |
| Slowking-Galar (specWall, Leftovers) | 164-194 (41.6-49.2%) | 141-166 (35.8-42.1%) | 94-111 (23.9-28.2%) | 47-55 (11.9-14%) |
| Heatran (specWall, Leftovers) | 84-99 (21.8-25.6%) | 72-85 (18.7-22%) | 96-113 (24.9-29.3%) | 24-28 (6.2-7.3%) |
| Zamazenta (physWall, Leftovers) | 216-254 (55.7-65.5%) | 371-436 (95.6-112.4%) | 123-145 (31.7-37.4%) | 123-145 (31.7-37.4%) |
| Dragonite (physWall, Leftovers) | 486-572 (125.9-148.2%) | 208-245 (53.9-63.5%) | 139-163 (36-42.2%) | 34-40 (8.8-10.4%) |
| Melmetal (physWall, Leftovers) | 172-202 (36.3-42.6%) | 147-174 (31-36.7%) | 197-232 (41.6-48.9%) | 98-116 (20.7-24.5%) |
| Gholdengo (specWall, Leftovers) | 93-109 (24.6-28.8%) | 80-94 (21.2-24.9%) | 106-125 (28-33.1%) | 53-62 (14-16.4%) |
| Landorus-Therian (physWall, Leftovers) | 292-344 (76.4-90.1%) | 251-295 (65.7-77.2%) | 0-0 (0-0%) | 167-196 (43.7-51.3%) |
| Garchomp (physWall, Leftovers) | 556-655 (132.4-156%) | 239-281 (56.9-66.9%) | 0-0 (0-0%) | 159-187 (37.9-44.5%) |
| Tyranitar-Mega (specWall, no item) | 155-182 (38.4-45%) | 0-0 (0-0%) | 88-104 (21.8-25.7%) | 88-104 (21.8-25.7%) |
| Chesnaught-Mega (physWall, no item) | 216-254 (56.8-66.8%) | 371-436 (97.6-114.7%) | 61-72 (16.1-18.9%) | 61-72 (16.1-18.9%) |
| Kingambit (physWall, Leftovers) | 139-163 (34.4-40.3%) | 0-0 (0-0%) | 159-187 (39.4-46.3%) | 79-93 (19.6-23%) |
| Toxapex (specWall, Leftovers) | 137-161 (45.1-53%) | 236-278 (77.6-91.4%) | 157-185 (51.6-60.9%) | 78-92 (25.7-30.3%) |

---

### Delphox-Mega

_Flagged for: Special Attack **458** — in OU's top quarter (≥401); Speed **403** — in OU's top quarter (≥350); **BST 634** — in OU's top quarter (≥630); strong setup on a frame fast enough to use it; ability: Levitate._

**Delphox-Mega** — forme, **UU**, source: override
  Fire/Psychic | BST 634 (75/69/72/159/125/134) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 237/260, SpA 417/458, Spe 367/403
  Item: **forced — Delphoxite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
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

Attacker: **Delphox-Mega**, timid {"spa":252,"spe":252,"hp":4}, **Delphoxite (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Overheat | Future Sight | Focus Blast | Solar Beam |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 156-184 (21.8-25.8%) | 134-158 (18.8-22.1%) | 179-211 (25.1-29.6%) | 89-105 (12.5-14.7%) |
| Chansey (specWall, Eviolite) | 125-147 (17.8-20.9%) | 108-127 (15.3-18%) | 144-169 (20.5-24%) | 72-84 (10.2-11.9%) |
| Clefable (specWall, Leftovers) | 206-243 (52.3-61.7%) | 177-209 (44.9-53%) | 59-69 (15-17.5%) | 118-139 (29.9-35.3%) |
| Slowbro (physWall, Leftovers) | 160-189 (40.6-48%) | 137-162 (34.8-41.1%) | 91-108 (23.1-27.4%) | 367-432 (93.1-109.6%) |
| Slowbro-Mega (physWall, no item) | 160-189 (40.6-48%) | 137-162 (34.8-41.1%) | 91-108 (23.1-27.4%) | 367-432 (93.1-109.6%) |
| Slowking (specWall, Leftovers) | 90-106 (22.8-26.9%) | 77-91 (19.5-23.1%) | 51-61 (12.9-15.5%) | 207-244 (52.5-61.9%) |
| Skarmory (physWall, Leftovers) | 715-841 (214.1-251.8%) | 153-180 (45.8-53.9%) | 204-240 (61.1-71.9%) | 51-60 (15.3-18%) |
| Skarmory-Mega (physWall, no item) | 534-629 (159.9-188.3%) | 114-135 (34.1-40.4%) | 153-180 (45.8-53.9%) | 38-45 (11.4-13.5%) |
| Celesteela (physWall, Leftovers) | 530-624 (133.2-156.8%) | 113-133 (28.4-33.4%) | 151-178 (37.9-44.7%) | 37-44 (9.3-11.1%) |
| Hippowdon (physWall, Leftovers) | 349-411 (83.1-97.9%) | 300-353 (71.4-84%) | 200-235 (47.6-56%) | 200-235 (47.6-56%) |
| Amoonguss (specWall, Black Sludge) | 445-524 (103-121.3%) | 382-450 (88.4-104.2%) | 63-75 (14.6-17.4%) | 31-37 (7.2-8.6%) |
| Goodra-Hisui (specWall, Leftovers) | 145-170 (39.8-46.7%) | 62-73 (17-20.1%) | 166-195 (45.6-53.6%) | 20-24 (5.5-6.6%) |
| Rotom-Wash (physWall, Leftovers) | 126-148 (41.4-48.7%) | 216-255 (71.1-83.9%) | 144-170 (47.4-55.9%) | 289-340 (95.1-111.8%) |
| Swampert (physWall, Leftovers) | 146-171 (36.1-42.3%) | 250-294 (61.9-72.8%) | 167-196 (41.3-48.5%) | 668-786 (165.3-194.6%) |
| Tyranitar (specWall, Leftovers) | 96-113 (23.8-28%) | 0-0 (0-0%) | 442-520 (109.4-128.7%) | 110-130 (27.2-32.2%) |
| Scizor (physWall, Leftovers) | 1286-1513 (373.8-439.8%) | 137-162 (39.8-47.1%) | 183-216 (53.2-62.8%) | 45-54 (13.1-15.7%) |
| Buzzwole (physWall, Leftovers) | 885-1042 (211.7-249.3%) | 759-894 (181.6-213.9%) | 126-149 (30.1-35.6%) | 126-149 (30.1-35.6%) |
| Aegislash (physWall, Leftovers) | 377-443 (116.4-136.7%) | 81-95 (25-29.3%) | 0-0 (0-0%) | 54-63 (16.7-19.4%) |
| Tapu Fini (specWall, Leftovers) | 80-94 (23.3-27.3%) | 138-163 (40.1-47.4%) | 46-54 (13.4-15.7%) | 184-217 (53.5-63.1%) |
| Corviknight (physWall, Leftovers) | 612-720 (153-180%) | 131-154 (32.8-38.5%) | 175-206 (43.8-51.5%) | 43-51 (10.8-12.8%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Overheat | Future Sight | Focus Blast | Solar Beam |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 943-1109 (267.9-315.1%) | 101-119 (28.7-33.8%) | 270-317 (76.7-90.1%) | 33-39 (9.4-11.1%) |
| Toxapex (physWall, Black Sludge) | 98-116 (32.2-38.2%) | 340-400 (111.8-131.6%) | 56-66 (18.4-21.7%) | 113-133 (37.2-43.8%) |
| Clodsire (specWall, Leftovers) | 193-227 (41.6-48.9%) | 331-390 (71.3-84.1%) | 55-65 (11.9-14%) | 110-130 (23.7-28%) |
| Dondozo (physWall, Leftovers) | 189-223 (37.5-44.2%) | 325-382 (64.5-75.8%) | 216-255 (42.9-50.6%) | 433-510 (85.9-101.2%) |
| Gliscor (physWall, Toxic Orb) | 338-398 (95.5-112.4%) | 290-341 (81.9-96.3%) | 96-113 (27.1-31.9%) | 193-227 (54.5-64.1%) |
| Ting-Lu (physWall, Leftovers) | 241-283 (45.1-53%) | 0-0 (0-0%) | 276-324 (51.7-60.7%) | 276-324 (51.7-60.7%) |
| Great Tusk (physWall, Leftovers) | 442-521 (101.8-120%) | 759-894 (174.9-206%) | 253-298 (58.3-68.7%) | 506-596 (116.6-137.3%) |
| Alomomola (physWall, Leftovers) | 249-293 (46.6-54.9%) | 427-503 (80-94.2%) | 285-335 (53.4-62.7%) | 570-671 (106.7-125.7%) |
| Slowking-Galar (specWall, Leftovers) | 181-213 (45.9-54.1%) | 155-183 (39.3-46.4%) | 25-30 (6.3-7.6%) | 51-61 (12.9-15.5%) |
| Heatran (specWall, Leftovers) | 185-218 (47.9-56.5%) | 79-93 (20.5-24.1%) | 212-249 (54.9-64.5%) | 26-31 (6.7-8%) |
| Zamazenta (physWall, Leftovers) | 237-279 (61.1-71.9%) | 408-480 (105.2-123.7%) | 136-160 (35.1-41.2%) | 136-160 (35.1-41.2%) |
| Dragonite (physWall, Leftovers) | 133-157 (34.5-40.7%) | 229-270 (59.3-69.9%) | 76-90 (19.7-23.3%) | 38-45 (9.8-11.7%) |
| Melmetal (physWall, Leftovers) | 758-892 (159.9-188.2%) | 162-191 (34.2-40.3%) | 433-510 (91.4-107.6%) | 108-127 (22.8-26.8%) |
| Gholdengo (specWall, Leftovers) | 409-482 (108.2-127.5%) | 87-103 (23-27.2%) | 0-0 (0-0%) | 58-69 (15.3-18.3%) |
| Landorus-Therian (physWall, Leftovers) | 321-378 (84-99%) | 275-324 (72-84.8%) | 91-108 (23.8-28.3%) | 183-216 (47.9-56.5%) |
| Garchomp (physWall, Leftovers) | 153-180 (36.4-42.9%) | 262-309 (62.4-73.6%) | 175-206 (41.7-49%) | 175-206 (41.7-49%) |
| Tyranitar-Mega (specWall, no item) | 85-100 (21-24.8%) | 0-0 (0-0%) | 390-459 (96.5-113.6%) | 97-114 (24-28.2%) |
| Chesnaught-Mega (physWall, no item) | 475-559 (125-147.1%) | 408-480 (107.4-126.3%) | 136-160 (35.8-42.1%) | 68-80 (17.9-21.1%) |
| Kingambit (physWall, Leftovers) | 612-720 (151.5-178.2%) | 0-0 (0-0%) | 700-824 (173.3-204%) | 87-103 (21.5-25.5%) |
| Toxapex (specWall, Leftovers) | 75-88 (24.7-28.9%) | 259-305 (85.2-100.3%) | 43-50 (14.1-16.4%) | 86-101 (28.3-33.2%) |

---

### Starmie-Mega

_Flagged for: Attack **656** — in OU's top quarter (≥416); Speed **372** — in OU's top quarter (≥350); Special Attack 394 — above OU's median (328); BST 620 — above OU's median (600); Attack reaches 656 off base 100 — an ability is doing the work; ability: Huge Power; reliable recovery on a bulky frame._

**Starmie-Mega** — forme, **UU**, source: override
  Water/Psychic | BST 620 (60/100/105/130/105/120) | Abilities: Huge Power
  Engine stats @252 (neutral/positive): Huge Power: Atk 598/656, SpA 359/394, Spe 339/372
  Item: **forced — Starminite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Water Waterfall 80P · Psychic Psycho Cut 70P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Ice Avalanche 60P **[power — doubles to 120 if the user was hit first this turn]**, Rock Rollout 30P, Steel Gyro Ball 14P
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

Attacker: **Starmie-Mega**, jolly {"atk":252,"spe":252,"hp":4}, **Starminite (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Waterfall | Psycho Cut | Skull Bash | Avalanche |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 917-1079 (128.4-151.1%) | 803-944 (112.5-132.2%) | 992-1168 (138.9-163.6%) | 459-540 (64.3-75.6%) |
| Chansey (specWall, Eviolite) | 745-876 (105.8-124.4%) | 652-767 (92.6-108.9%) | 806-948 (114.5-134.7%) | 372-438 (52.8-62.2%) |
| Clefable (specWall, Leftovers) | 284-334 (72.1-84.8%) | 248-292 (62.9-74.1%) | 306-360 (77.7-91.4%) | 142-167 (36-42.4%) |
| Slowbro (physWall, Leftovers) | 74-87 (18.8-22.1%) | 65-76 (16.5-19.3%) | 160-188 (40.6-47.7%) | 37-44 (9.4-11.2%) |
| Slowbro-Mega (physWall, no item) | 52-61 (13.2-15.5%) | 45-53 (11.4-13.5%) | 111-131 (28.2-33.2%) | 26-30 (6.6-7.6%) |
| Slowking (specWall, Leftovers) | 131-155 (33.2-39.3%) | 115-136 (29.2-34.5%) | 284-335 (72.1-85%) | 66-77 (16.8-19.5%) |
| Skarmory (physWall, Leftovers) | 125-147 (37.4-44%) | 55-64 (16.5-19.2%) | 67-79 (20.1-23.7%) | 63-74 (18.9-22.2%) |
| Skarmory-Mega (physWall, no item) | 148-175 (44.3-52.4%) | 65-76 (19.5-22.8%) | 80-94 (24-28.1%) | 74-88 (22.2-26.3%) |
| Celesteela (physWall, Leftovers) | 155-182 (38.9-45.7%) | 68-80 (17.1-20.1%) | 83-98 (20.9-24.6%) | 78-91 (19.6-22.9%) |
| Hippowdon (physWall, Leftovers) | 283-333 (67.4-79.3%) | 124-146 (29.5-34.8%) | 152-179 (36.2-42.6%) | 142-167 (33.8-39.8%) |
| Amoonguss (specWall, Black Sludge) | 146-172 (33.8-39.8%) | 514-605 (119-140%) | 317-373 (73.4-86.3%) | 294-346 (68.1-80.1%) |
| Goodra-Hisui (specWall, Leftovers) | 109-129 (29.9-35.4%) | 96-113 (26.4-31%) | 118-139 (32.4-38.2%) | 110-129 (30.2-35.4%) |
| Rotom-Wash (physWall, Leftovers) | 75-89 (24.7-29.3%) | 132-156 (43.4-51.3%) | 163-191 (53.6-62.8%) | 38-44 (12.5-14.5%) |
| Swampert (physWall, Leftovers) | 169-199 (41.8-49.3%) | 149-175 (36.9-43.3%) | 183-215 (45.3-53.2%) | 85-100 (21-24.8%) |
| Tyranitar (specWall, Leftovers) | 405-476 (100.2-117.8%) | 0-0 (0-0%) | 109-128 (27-31.7%) | 101-119 (25-29.5%) |
| Scizor (physWall, Leftovers) | 158-186 (45.9-54.1%) | 69-81 (20.1-23.5%) | 85-100 (24.7-29.1%) | 39-46 (11.3-13.4%) |
| Buzzwole (physWall, Leftovers) | 126-148 (30.1-35.4%) | 221-260 (52.9-62.2%) | 135-159 (32.3-38%) | 63-74 (15.1-17.7%) |
| Aegislash (physWall, Leftovers) | 119-140 (36.7-43.2%) | 52-61 (16-18.8%) | 0-0 (0-0%) | 30-35 (9.3-10.8%) |
| Tapu Fini (specWall, Leftovers) | 97-114 (28.2-33.1%) | 171-201 (49.7-58.4%) | 210-247 (61-71.8%) | 49-57 (14.2-16.6%) |
| Corviknight (physWall, Leftovers) | 153-180 (38.3-45%) | 67-79 (16.8-19.8%) | 82-97 (20.5-24.3%) | 77-90 (19.3-22.5%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Waterfall | Psycho Cut | Skull Bash | Avalanche |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 65-77 (18.5-21.9%) | 57-67 (16.2-19%) | 70-83 (19.9-23.6%) | 66-77 (18.8-21.9%) |
| Toxapex (physWall, Black Sludge) | 59-69 (19.4-22.7%) | 207-244 (68.1-80.3%) | 126-149 (41.4-49%) | 29-35 (9.5-11.5%) |
| Clodsire (specWall, Leftovers) | 661-778 (142.5-167.7%) | 579-682 (124.8-147%) | 357-420 (76.9-90.5%) | 331-390 (71.3-84.1%) |
| Dondozo (physWall, Leftovers) | 72-84 (14.3-16.7%) | 126-149 (25-29.6%) | 155-182 (30.8-36.1%) | 36-42 (7.1-8.3%) |
| Gliscor (physWall, Toxic Orb) | 272-320 (76.8-90.4%) | 119-140 (33.6-39.5%) | 146-172 (41.2-48.6%) | 274-322 (77.4-91%) |
| Ting-Lu (physWall, Leftovers) | 265-311 (49.6-58.2%) | 0-0 (0-0%) | 142-167 (26.6-31.3%) | 133-156 (24.9-29.2%) |
| Great Tusk (physWall, Leftovers) | 263-309 (60.6-71.2%) | 230-271 (53-62.4%) | 141-166 (32.5-38.2%) | 132-155 (30.4-35.7%) |
| Alomomola (physWall, Leftovers) | 91-107 (17-20%) | 160-188 (30-35.2%) | 197-231 (36.9-43.3%) | 45-54 (8.4-10.1%) |
| Slowking-Galar (specWall, Leftovers) | 263-310 (66.8-78.7%) | 231-272 (58.6-69%) | 284-335 (72.1-85%) | 132-155 (33.5-39.3%) |
| Heatran (specWall, Leftovers) | 418-492 (108.3-127.5%) | 91-107 (23.6-27.7%) | 112-132 (29-34.2%) | 26-30 (6.7-7.8%) |
| Zamazenta (physWall, Leftovers) | 144-169 (37.1-43.6%) | 253-298 (65.2-76.8%) | 155-182 (39.9-46.9%) | 72-85 (18.6-21.9%) |
| Dragonite (physWall, Leftovers) | 82-96 (21.2-24.9%) | 143-169 (37-43.8%) | 176-207 (45.6-53.6%) | 330-388 (85.5-100.5%) |
| Melmetal (physWall, Leftovers) | 123-145 (25.9-30.6%) | 54-63 (11.4-13.3%) | 66-78 (13.9-16.5%) | 31-36 (6.5-7.6%) |
| Gholdengo (specWall, Leftovers) | 229-269 (60.6-71.2%) | 100-118 (26.5-31.2%) | 0-0 (0-0%) | 57-67 (15.1-17.7%) |
| Landorus-Therian (physWall, Leftovers) | 339-399 (88.7-104.5%) | 149-175 (39-45.8%) | 183-215 (47.9-56.3%) | 341-401 (89.3-105%) |
| Garchomp (physWall, Leftovers) | 164-193 (39-46%) | 143-169 (34-40.2%) | 176-207 (41.9-49.3%) | 330-388 (78.6-92.4%) |
| Tyranitar-Mega (specWall, no item) | 310-364 (76.7-90.1%) | 0-0 (0-0%) | 83-98 (20.5-24.3%) | 77-91 (19.1-22.5%) |
| Chesnaught-Mega (physWall, no item) | 53-63 (13.9-16.6%) | 189-222 (49.7-58.4%) | 115-136 (30.3-35.8%) | 108-127 (28.4-33.4%) |
| Kingambit (physWall, Leftovers) | 140-165 (34.7-40.8%) | 0-0 (0-0%) | 75-88 (18.6-21.8%) | 35-41 (8.7-10.1%) |
| Toxapex (specWall, Leftovers) | 76-90 (25-29.6%) | 268-316 (88.2-103.9%) | 164-194 (53.9-63.8%) | 38-45 (12.5-14.8%) |

---

### Skarmory-Mega

_Flagged for: Attack **416** — in OU's top quarter (≥416); Speed **350** — in OU's top quarter (≥350); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; hazards + real offence; reliable recovery on a bulky frame._

**Skarmory-Mega** — forme, **UU**, source: override
  Steel/Flying | BST 565 (65/140/110/40/100/110) | Abilities: Stalwart
  Engine stats @252 (neutral/positive): Stalwart: Atk 379/416, SpA 179/196, Spe 319/350
  Item: **forced — Skarmorite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
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

Attacker: **Skarmory-Mega**, jolly {"atk":252,"spe":252,"hp":4}, **Skarmorite (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Iron Head | Sky Attack | Double-Edge | Body Press |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 582-685 (81.5-95.9%) | 1017-1196 (142.4-167.5%) | 581-684 (81.4-95.8%) | 525-618 (73.5-86.6%) |
| Chansey (specWall, Eviolite) | 473-556 (67.2-79%) | 826-971 (117.3-137.9%) | 472-555 (67-78.8%) | 427-502 (60.7-71.3%) |
| Clefable (specWall, Leftovers) | 361-425 (91.6-107.9%) | 314-370 (79.7-93.9%) | 180-211 (45.7-53.6%) | 41-48 (10.4-12.2%) |
| Slowbro (physWall, Leftovers) | 47-56 (11.9-14.2%) | 164-194 (41.6-49.2%) | 94-111 (23.9-28.2%) | 21-25 (5.3-6.3%) |
| Slowbro-Mega (physWall, no item) | 33-39 (8.4-9.9%) | 115-135 (29.2-34.3%) | 66-77 (16.8-19.5%) | 15-18 (3.8-4.6%) |
| Slowking (specWall, Leftovers) | 84-98 (21.3-24.9%) | 292-344 (74.1-87.3%) | 167-196 (42.4-49.7%) | 38-44 (9.6-11.2%) |
| Skarmory (physWall, Leftovers) | 40-47 (12-14.1%) | 69-81 (20.7-24.3%) | 39-46 (11.7-13.8%) | 36-43 (10.8-12.9%) |
| Skarmory-Mega (physWall, no item) | 47-56 (14.1-16.8%) | 82-97 (24.6-29%) | 47-55 (14.1-16.5%) | 43-51 (12.9-15.3%) |
| Celesteela (physWall, Leftovers) | 49-58 (12.3-14.6%) | 86-101 (21.6-25.4%) | 49-58 (12.3-14.6%) | 45-53 (11.3-13.3%) |
| Hippowdon (physWall, Leftovers) | 90-106 (21.4-25.2%) | 156-184 (37.1-43.8%) | 89-105 (21.2-25%) | 41-48 (9.8-11.4%) |
| Amoonguss (specWall, Black Sludge) | 187-220 (43.3-50.9%) | 650-765 (150.5-177.1%) | 186-219 (43.1-50.7%) | 42-49 (9.7-11.3%) |
| Goodra-Hisui (specWall, Leftovers) | 70-82 (19.2-22.5%) | 121-143 (33.2-39.3%) | 69-81 (19-22.3%) | 127-149 (34.9-40.9%) |
| Rotom-Wash (physWall, Leftovers) | 24-28 (7.9-9.2%) | 83-98 (27.3-32.2%) | 96-113 (31.6-37.2%) | 44-52 (14.5-17.1%) |
| Swampert (physWall, Leftovers) | 54-63 (13.4-15.6%) | 188-221 (46.5-54.7%) | 107-126 (26.5-31.2%) | 49-58 (12.1-14.4%) |
| Tyranitar (specWall, Leftovers) | 258-304 (63.9-75.2%) | 112-132 (27.7-32.7%) | 64-75 (15.8-18.6%) | 235-276 (58.2-68.3%) |
| Scizor (physWall, Leftovers) | 50-59 (14.5-17.2%) | 175-206 (50.9-59.9%) | 50-59 (14.5-17.2%) | 46-54 (13.4-15.7%) |
| Buzzwole (physWall, Leftovers) | 80-95 (19.1-22.7%) | 559-657 (133.7-157.2%) | 80-94 (19.1-22.5%) | 18-21 (4.3-5%) |
| Aegislash (physWall, Leftovers) | 38-45 (11.7-13.9%) | 66-77 (20.4-23.8%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Tapu Fini (specWall, Leftovers) | 124-146 (36-42.4%) | 216-254 (62.8-73.8%) | 123-145 (35.8-42.2%) | 28-33 (8.1-9.6%) |
| Corviknight (physWall, Leftovers) | 49-57 (12.3-14.3%) | 85-100 (21.3-25%) | 48-57 (12-14.3%) | 44-52 (11-13%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Iron Head | Sky Attack | Double-Edge | Body Press |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 42-49 (11.9-13.9%) | 145-171 (41.2-48.6%) | 41-49 (11.6-13.9%) | 77-90 (21.9-25.6%) |
| Toxapex (physWall, Black Sludge) | 37-44 (12.2-14.5%) | 130-153 (42.8-50.3%) | 75-88 (24.7-28.9%) | 17-20 (5.6-6.6%) |
| Clodsire (specWall, Leftovers) | 210-247 (45.3-53.2%) | 366-431 (78.9-92.9%) | 209-246 (45-53%) | 47-56 (10.1-12.1%) |
| Dondozo (physWall, Leftovers) | 46-54 (9.1-10.7%) | 159-188 (31.5-37.3%) | 91-107 (18.1-21.2%) | 42-49 (8.3-9.7%) |
| Gliscor (physWall, Toxic Orb) | 87-102 (24.6-28.8%) | 150-177 (42.4-50%) | 86-101 (24.3-28.5%) | 19-23 (5.4-6.5%) |
| Ting-Lu (physWall, Leftovers) | 84-99 (15.7-18.5%) | 146-172 (27.3-32.2%) | 84-98 (15.7-18.4%) | 77-91 (14.4-17%) |
| Great Tusk (physWall, Leftovers) | 84-99 (19.4-22.8%) | 291-342 (67.1-78.8%) | 83-98 (19.1-22.6%) | 38-45 (8.8-10.4%) |
| Alomomola (physWall, Leftovers) | 58-68 (10.9-12.7%) | 202-238 (37.8-44.6%) | 116-136 (21.7-25.5%) | 53-62 (9.9-11.6%) |
| Slowking-Galar (specWall, Leftovers) | 168-197 (42.6-50%) | 292-344 (74.1-87.3%) | 167-196 (42.4-49.7%) | 19-22 (4.8-5.6%) |
| Heatran (specWall, Leftovers) | 33-39 (8.5-10.1%) | 115-136 (29.8-35.2%) | 66-78 (17.1-20.2%) | 121-142 (31.3-36.8%) |
| Zamazenta (physWall, Leftovers) | 92-108 (23.7-27.8%) | 319-376 (82.2-96.9%) | 91-107 (23.5-27.6%) | 42-49 (10.8-12.6%) |
| Dragonite (physWall, Leftovers) | 104-123 (26.9-31.9%) | 181-213 (46.9-55.2%) | 104-122 (26.9-31.6%) | 23-28 (6-7.3%) |
| Melmetal (physWall, Leftovers) | 39-46 (8.2-9.7%) | 68-80 (14.3-16.9%) | 39-46 (8.2-9.7%) | 72-85 (15.2-17.9%) |
| Gholdengo (specWall, Leftovers) | 73-86 (19.3-22.8%) | 126-149 (33.3-39.4%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Landorus-Therian (physWall, Leftovers) | 108-127 (28.3-33.2%) | 188-221 (49.2-57.9%) | 107-126 (28-33%) | 24-29 (6.3-7.6%) |
| Garchomp (physWall, Leftovers) | 104-123 (24.8-29.3%) | 181-213 (43.1-50.7%) | 104-122 (24.8-29%) | 47-56 (11.2-13.3%) |
| Tyranitar-Mega (specWall, no item) | 198-233 (49-57.7%) | 85-100 (21-24.8%) | 49-57 (12.1-14.1%) | 180-212 (44.6-52.5%) |
| Chesnaught-Mega (physWall, no item) | 69-81 (18.2-21.3%) | 476-561 (125.3-147.6%) | 68-80 (17.9-21.1%) | 31-37 (8.2-9.7%) |
| Kingambit (physWall, Leftovers) | 44-52 (10.9-12.9%) | 77-91 (19.1-22.5%) | 44-52 (10.9-12.9%) | 164-192 (40.6-47.5%) |
| Toxapex (specWall, Leftovers) | 49-57 (16.1-18.8%) | 169-199 (55.6-65.5%) | 97-114 (31.9-37.5%) | 22-26 (7.2-8.6%) |

---

### Raichu-Mega-Y

_Flagged for: Special Attack **460** — in OU's top quarter (≥401); Speed **394** — in OU's top quarter (≥350); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: No Guard._

**Raichu-Mega-Y** — forme, **UU**, source: override
  Electric | BST 585 (60/100/55/160/80/130) | Abilities: No Guard
  Engine stats @252 (neutral/positive): No Guard: Atk 299/328, SpA 419/460, Spe 359/394
  Item: **forced — Raichunite Y** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Grass Grass Knot 60S
  Setup: Agility, Calm Mind, Charge, Defense Curl, Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Priority: Extreme Speed 80P Normal (+2), Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**
  Pivot: Volt Switch
  Status: Nuzzle, Sing, Thunder Wave, Toxic, Yawn
  Cleric: Wish
  Weather/terrain: Electric Terrain, Rain Dance
  Utility: Detect, Encore, Knock Off, Light Screen, Protect, Reflect, Safeguard, Substitute
  Notable: Knock Off, Encore, Substitute, Focus Punch

Attacker: **Raichu-Mega-Y**, timid {"spa":252,"spe":252,"hp":4}, **Raichunite Y (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Thunder | Focus Blast | Surf | Uproar |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 135-159 (18.9-22.3%) | 180-212 (25.2-29.7%) | 71-84 (9.9-11.8%) | 68-80 (9.5-11.2%) |
| Chansey (specWall, Eviolite) | 108-127 (15.3-18%) | 144-170 (20.5-24.1%) | 57-67 (8.1-9.5%) | 54-64 (7.7-9.1%) |
| Clefable (specWall, Leftovers) | 178-210 (45.2-53.3%) | 59-70 (15-17.8%) | 94-111 (23.9-28.2%) | 89-105 (22.6-26.6%) |
| Slowbro (physWall, Leftovers) | 554-652 (140.6-165.5%) | 92-108 (23.4-27.4%) | 73-86 (18.5-21.8%) | 139-163 (35.3-41.4%) |
| Slowbro-Mega (physWall, no item) | 554-652 (140.6-165.5%) | 92-108 (23.4-27.4%) | 73-86 (18.5-21.8%) | 139-163 (35.3-41.4%) |
| Slowking (specWall, Leftovers) | 312-368 (79.2-93.4%) | 52-61 (13.2-15.5%) | 41-48 (10.4-12.2%) | 78-92 (19.8-23.4%) |
| Skarmory (physWall, Leftovers) | 617-725 (184.7-217.1%) | 205-241 (61.4-72.2%) | 163-191 (48.8-57.2%) | 77-90 (23.1-26.9%) |
| Skarmory-Mega (physWall, no item) | 461-542 (138-162.3%) | 153-180 (45.8-53.9%) | 122-143 (36.5-42.8%) | 57-68 (17.1-20.4%) |
| Celesteela (physWall, Leftovers) | 457-538 (114.8-135.2%) | 152-179 (38.2-45%) | 121-142 (30.4-35.7%) | 57-67 (14.3-16.8%) |
| Hippowdon (physWall, Leftovers) | 0-0 (0-0%) | 201-236 (47.9-56.2%) | 319-375 (76-89.3%) | 151-177 (36-42.1%) |
| Amoonguss (specWall, Black Sludge) | 96-113 (22.2-26.2%) | 64-75 (14.8-17.4%) | 50-59 (11.6-13.7%) | 96-113 (22.2-26.2%) |
| Goodra-Hisui (specWall, Leftovers) | 62-73 (17-20.1%) | 167-196 (45.9-53.8%) | 33-39 (9.1-10.7%) | 31-37 (8.5-10.2%) |
| Rotom-Wash (physWall, Leftovers) | 217-256 (71.4-84.2%) | 145-170 (47.7-55.9%) | 57-67 (18.8-22%) | 109-128 (35.9-42.1%) |
| Swampert (physWall, Leftovers) | 0-0 (0-0%) | 167-197 (41.3-48.8%) | 133-156 (32.9-38.6%) | 126-148 (31.2-36.6%) |
| Tyranitar (specWall, Leftovers) | 166-196 (41.1-48.5%) | 444-523 (109.9-129.5%) | 176-207 (43.6-51.2%) | 41-49 (10.1-12.1%) |
| Scizor (physWall, Leftovers) | 277-326 (80.5-94.8%) | 184-217 (53.5-63.1%) | 146-172 (42.4-50%) | 69-81 (20.1-23.5%) |
| Buzzwole (physWall, Leftovers) | 381-449 (91.1-107.4%) | 127-149 (30.4-35.6%) | 201-237 (48.1-56.7%) | 191-225 (45.7-53.8%) |
| Aegislash (physWall, Leftovers) | 162-191 (50-59%) | 0-0 (0-0%) | 86-101 (26.5-31.2%) | 0-0 (0-0%) |
| Tapu Fini (specWall, Leftovers) | 278-327 (80.8-95.1%) | 46-54 (13.4-15.7%) | 36-43 (10.5-12.5%) | 70-82 (20.3-23.8%) |
| Corviknight (physWall, Leftovers) | 527-621 (131.8-155.3%) | 175-207 (43.8-51.8%) | 139-164 (34.8-41%) | 66-77 (16.5-19.3%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Thunder | Focus Blast | Surf | Uproar |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 101-119 (28.7-33.8%) | 271-319 (77-90.6%) | 53-63 (15.1-17.9%) | 51-60 (14.5-17%) |
| Toxapex (physWall, Black Sludge) | 341-401 (112.2-131.9%) | 56-66 (18.4-21.7%) | 45-53 (14.8-17.4%) | 85-100 (28-32.9%) |
| Clodsire (specWall, Leftovers) | 0-0 (0-0%) | 55-65 (11.9-14%) | 176-207 (37.9-44.6%) | 83-98 (17.9-21.1%) |
| Dondozo (physWall, Leftovers) | 653-769 (129.6-152.6%) | 217-256 (43.1-50.8%) | 86-101 (17.1-20%) | 163-192 (32.3-38.1%) |
| Gliscor (physWall, Toxic Orb) | 0-0 (0-0%) | 97-114 (27.4-32.2%) | 308-363 (87-102.5%) | 146-172 (41.2-48.6%) |
| Ting-Lu (physWall, Leftovers) | 0-0 (0-0%) | 277-326 (51.9-61%) | 220-259 (41.2-48.5%) | 104-123 (19.5-23%) |
| Great Tusk (physWall, Leftovers) | 0-0 (0-0%) | 254-299 (58.5-68.9%) | 403-474 (92.9-109.2%) | 191-225 (44-51.8%) |
| Alomomola (physWall, Leftovers) | 859-1011 (160.9-189.3%) | 286-337 (53.6-63.1%) | 113-133 (21.2-24.9%) | 215-253 (40.3-47.4%) |
| Slowking-Galar (specWall, Leftovers) | 156-184 (39.6-46.7%) | 26-30 (6.6-7.6%) | 82-97 (20.8-24.6%) | 78-92 (19.8-23.4%) |
| Heatran (specWall, Leftovers) | 160-188 (41.5-48.7%) | 213-250 (55.2-64.8%) | 169-199 (43.8-51.6%) | 40-47 (10.4-12.2%) |
| Zamazenta (physWall, Leftovers) | 204-241 (52.6-62.1%) | 136-160 (35.1-41.2%) | 108-127 (27.8-32.7%) | 102-121 (26.3-31.2%) |
| Dragonite (physWall, Leftovers) | 230-271 (59.6-70.2%) | 76-90 (19.7-23.3%) | 61-71 (15.8-18.4%) | 115-136 (29.8-35.2%) |
| Melmetal (physWall, Leftovers) | 326-384 (68.8-81%) | 435-512 (91.8-108%) | 172-203 (36.3-42.8%) | 81-96 (17.1-20.3%) |
| Gholdengo (specWall, Leftovers) | 176-208 (46.6-55%) | 0-0 (0-0%) | 93-110 (24.6-29.1%) | 0-0 (0-0%) |
| Landorus-Therian (physWall, Leftovers) | 0-0 (0-0%) | 92-108 (24.1-28.3%) | 293-345 (76.7-90.3%) | 139-163 (36.4-42.7%) |
| Garchomp (physWall, Leftovers) | 0-0 (0-0%) | 175-207 (41.7-49.3%) | 139-164 (33.1-39%) | 132-155 (31.4-36.9%) |
| Tyranitar-Mega (specWall, no item) | 147-173 (36.4-42.8%) | 392-462 (97-114.4%) | 156-183 (38.6-45.3%) | 37-43 (9.2-10.6%) |
| Chesnaught-Mega (physWall, no item) | 102-120 (26.8-31.6%) | 136-160 (35.8-42.1%) | 54-63 (14.2-16.6%) | 102-121 (26.8-31.8%) |
| Kingambit (physWall, Leftovers) | 263-310 (65.1-76.7%) | 703-828 (174-205%) | 139-164 (34.4-40.6%) | 66-77 (16.3-19.1%) |
| Toxapex (specWall, Leftovers) | 260-306 (85.5-100.7%) | 43-51 (14.1-16.8%) | 34-40 (11.2-13.2%) | 65-77 (21.4-25.3%) |

---

### Aegislash-Blade

_Flagged for: Attack **438** — in OU's top quarter (≥416); Special Attack **438** — in OU's top quarter (≥401); setup + priority + reliable recovery; ability: Stance Change._

**Aegislash-Blade** — species, **UU**, source: imported (natdex)
  Steel/Ghost | BST 520 (60/150/50/150/50/60) | Abilities: Stance Change
  Engine stats @252 (neutral/positive): Stance Change: Atk 399/438, SpA 399/438, Spe 219/240
  Item: **free**
  STAB: Steel Steel Beam 140S · Ghost Shadow Ball 80S
  Physical coverage: Rock Head Smash 150P, Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Return 102P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Flying Air Slash 75S, Normal Hidden Power 60S, Electric Shock Wave 60S
  Setup: Autotomize, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Priority: Shadow Sneak 40P Ghost (+1)
  Status: Toxic
  Trapping moves: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Destiny Bond, Protect, Reflect, Substitute
  Notable: Substitute

Attacker: **Aegislash-Blade**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Steel Beam | Shadow Ball | Head Smash | Solar Blade |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 148-174 (20.7-24.4%) | 0-0 (0-0%) | 1090-1283 (152.7-179.7%) | 908-1069 (127.2-149.7%) |
| Chansey (specWall, Eviolite) | 118-139 (16.8-19.7%) | 0-0 (0-0%) | 885-1041 (125.7-147.9%) | 738-868 (104.8-123.3%) |
| Clefable (specWall, Leftovers) | 391-460 (99.2-116.8%) | 113-132 (28.7-33.5%) | 336-396 (85.3-100.5%) | 280-330 (71.1-83.8%) |
| Slowbro (physWall, Leftovers) | 150-178 (38.1-45.2%) | 349-410 (88.6-104.1%) | 175-206 (44.4-52.3%) | 293-345 (74.4-87.6%) |
| Slowbro-Mega (physWall, no item) | 150-178 (38.1-45.2%) | 349-410 (88.6-104.1%) | 122-144 (31-36.5%) | 205-241 (52-61.2%) |
| Slowking (specWall, Leftovers) | 84-100 (21.3-25.4%) | 197-232 (50-58.9%) | 313-367 (79.4-93.1%) | 522-614 (132.5-155.8%) |
| Skarmory (physWall, Leftovers) | 167-197 (50-59%) | 193-227 (57.8-68%) | 148-174 (44.3-52.1%) | 29-36 (8.7-10.8%) |
| Skarmory-Mega (physWall, no item) | 126-148 (37.7-44.3%) | 145-170 (43.4-50.9%) | 175-206 (52.4-61.7%) | 36-42 (10.8-12.6%) |
| Celesteela (physWall, Leftovers) | 124-146 (31.2-36.7%) | 144-169 (36.2-42.5%) | 183-215 (46-54%) | 37-44 (9.3-11.1%) |
| Hippowdon (physWall, Leftovers) | 330-387 (78.6-92.1%) | 189-223 (45-53.1%) | 83-97 (19.8-23.1%) | 139-163 (33.1-38.8%) |
| Amoonguss (specWall, Black Sludge) | 209-247 (48.4-57.2%) | 120-143 (27.8-33.1%) | 348-409 (80.6-94.7%) | 71-84 (16.4-19.4%) |
| Goodra-Hisui (specWall, Leftovers) | 67-80 (18.4-22%) | 79-93 (21.7-25.5%) | 130-152 (35.7-41.8%) | 53-63 (14.6-17.3%) |
| Rotom-Wash (physWall, Leftovers) | 58-70 (19.1-23%) | 137-161 (45.1-53%) | 179-210 (58.9-69.1%) | 299-352 (98.4-115.8%) |
| Swampert (physWall, Leftovers) | 137-161 (33.9-39.9%) | 158-185 (39.1-45.8%) | 100-118 (24.8-29.2%) | 672-791 (166.3-195.8%) |
| Tyranitar (specWall, Leftovers) | 365-429 (90.3-106.2%) | 52-61 (12.9-15.1%) | 239-282 (59.2-69.8%) | 200-235 (49.5-58.2%) |
| Scizor (physWall, Leftovers) | 150-178 (43.6-51.7%) | 174-205 (50.6-59.6%) | 187-221 (54.4-64.2%) | 39-45 (11.3-13.1%) |
| Buzzwole (physWall, Leftovers) | 417-491 (99.8-117.5%) | 239-282 (57.2-67.5%) | 149-175 (35.6-41.9%) | 62-72 (14.8-17.2%) |
| Aegislash (physWall, Leftovers) | 88-104 (27.2-32.1%) | 206-243 (63.6-75%) | 70-83 (21.6-25.6%) | 58-68 (17.9-21%) |
| Tapu Fini (specWall, Leftovers) | 152-179 (44.2-52%) | 88-104 (25.6-30.2%) | 231-271 (67.2-78.8%) | 386-453 (112.2-131.7%) |
| Corviknight (physWall, Leftovers) | 144-169 (36-42.3%) | 166-195 (41.5-48.8%) | 182-213 (45.5-53.3%) | 37-44 (9.3-11%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Steel Beam | Shadow Ball | Head Smash | Solar Blade |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 110-130 (31.3-36.9%) | 128-150 (36.4-42.6%) | 76-91 (21.6-25.9%) | 32-37 (9.1-10.5%) |
| Toxapex (physWall, Black Sludge) | 93-109 (30.6-35.9%) | 107-127 (35.2-41.8%) | 139-163 (45.7-53.6%) | 115-136 (37.8-44.7%) |
| Clodsire (specWall, Leftovers) | 182-214 (39.2-46.1%) | 105-123 (22.6-26.5%) | 196-230 (42.2-49.6%) | 327-384 (70.5-82.8%) |
| Dondozo (physWall, Leftovers) | 178-209 (35.3-41.5%) | 205-241 (40.7-47.8%) | 170-200 (33.7-39.7%) | 284-335 (56.3-66.5%) |
| Gliscor (physWall, Toxic Orb) | 319-375 (90.1-105.9%) | 183-215 (51.7-60.7%) | 161-189 (45.5-53.4%) | 133-158 (37.6-44.6%) |
| Ting-Lu (physWall, Leftovers) | 227-267 (42.5-50%) | 65-76 (12.2-14.2%) | 78-92 (14.6-17.2%) | 261-308 (48.9-57.7%) |
| Great Tusk (physWall, Leftovers) | 417-491 (96.1-113.1%) | 239-282 (55.1-65%) | 37-45 (8.5-10.4%) | 260-305 (59.9-70.3%) |
| Alomomola (physWall, Leftovers) | 234-275 (43.8-51.5%) | 269-317 (50.4-59.4%) | 215-254 (40.3-47.6%) | 361-425 (67.6-79.6%) |
| Slowking-Galar (specWall, Leftovers) | 170-201 (43.1-51%) | 197-232 (50-58.9%) | 313-367 (79.4-93.1%) | 130-153 (33-38.8%) |
| Heatran (specWall, Leftovers) | 42-50 (10.9-13%) | 101-119 (26.2-30.8%) | 247-291 (64-75.4%) | 50-59 (13-15.3%) |
| Zamazenta (physWall, Leftovers) | 223-263 (57.5-67.8%) | 128-152 (33-39.2%) | 84-100 (21.6-25.8%) | 141-167 (36.3-43%) |
| Dragonite (physWall, Leftovers) | 252-296 (65.3-76.7%) | 145-170 (37.6-44%) | 388-457 (100.5-118.4%) | 40-46 (10.4-11.9%) |
| Melmetal (physWall, Leftovers) | 178-209 (37.6-44.1%) | 205-241 (43.2-50.8%) | 72-85 (15.2-17.9%) | 61-71 (12.9-15%) |
| Gholdengo (specWall, Leftovers) | 96-113 (25.4-29.9%) | 223-263 (59-69.6%) | 135-159 (35.7-42.1%) | 113-132 (29.9-34.9%) |
| Landorus-Therian (physWall, Leftovers) | 302-356 (79.1-93.2%) | 174-205 (45.5-53.7%) | 201-236 (52.6-61.8%) | 167-197 (43.7-51.6%) |
| Garchomp (physWall, Leftovers) | 288-339 (68.6-80.7%) | 166-195 (39.5-46.4%) | 96-114 (22.9-27.1%) | 162-191 (38.6-45.5%) |
| Tyranitar-Mega (specWall, no item) | 322-379 (79.7-93.8%) | 46-54 (11.4-13.4%) | 183-215 (45.3-53.2%) | 153-179 (37.9-44.3%) |
| Chesnaught-Mega (physWall, no item) | 223-263 (58.7-69.2%) | 128-152 (33.7-40%) | 63-74 (16.6-19.5%) | 52-62 (13.7-16.3%) |
| Kingambit (physWall, Leftovers) | 144-169 (35.6-41.8%) | 83-97 (20.5-24%) | 81-97 (20-24%) | 68-80 (16.8-19.8%) |
| Toxapex (specWall, Leftovers) | 71-83 (23.4-27.3%) | 83-97 (27.3-31.9%) | 180-213 (59.2-70.1%) | 150-178 (49.3-58.6%) |

---

### Staraptor-Mega

_Flagged for: Attack **416** — in OU's top quarter (≥416); Speed **350** — in OU's top quarter (≥350); setup + priority + reliable recovery; ability: Contrary._

**Staraptor-Mega** — forme, **UU**, source: override
  Fighting/Flying | BST 585 (85/140/100/60/90/110) | Abilities: Contrary
  Engine stats @252 (neutral/positive): Contrary: Atk 379/416, SpA 219/240, Spe 319/350
  Item: **forced — Staraptite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Fighting Close Combat 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Thief 60P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Normal Uproar 90S, Ghost Ominous Wind 60S, Bug Struggle Bug 50S **[power — only reachable when no other move can be selected]**, Dragon Twister 40S, Ground Mud-Slap 20S
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

Attacker: **Staraptor-Mega**, jolly {"atk":252,"spe":252,"hp":4}, **Staraptite (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Close Combat | Sky Attack | Double-Edge | Steel Wing |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 1744-2052 (244.3-287.4%) | 1017-1196 (142.4-167.5%) | 581-684 (81.4-95.8%) | 339-399 (47.5-55.9%) |
| Chansey (specWall, Eviolite) | 1416-1667 (201.1-236.8%) | 826-971 (117.3-137.9%) | 472-555 (67-78.8%) | 276-324 (39.2-46%) |
| Clefable (specWall, Leftovers) | 135-158 (34.3-40.1%) | 314-370 (79.7-93.9%) | 180-211 (45.7-53.6%) | 211-248 (53.6-62.9%) |
| Slowbro (physWall, Leftovers) | 70-83 (17.8-21.1%) | 164-194 (41.6-49.2%) | 94-111 (23.9-28.2%) | 27-32 (6.9-8.1%) |
| Slowbro-Mega (physWall, no item) | 49-58 (12.4-14.7%) | 115-135 (29.2-34.3%) | 66-77 (16.8-19.5%) | 19-23 (4.8-5.8%) |
| Slowking (specWall, Leftovers) | 125-147 (31.7-37.3%) | 292-344 (74.1-87.3%) | 167-196 (42.4-49.7%) | 49-57 (12.4-14.5%) |
| Skarmory (physWall, Leftovers) | 119-140 (35.6-41.9%) | 69-81 (20.7-24.3%) | 39-46 (11.7-13.8%) | 23-27 (6.9-8.1%) |
| Skarmory-Mega (physWall, no item) | 141-166 (42.2-49.7%) | 82-97 (24.6-29%) | 47-55 (14.1-16.5%) | 27-32 (8.1-9.6%) |
| Celesteela (physWall, Leftovers) | 147-174 (36.9-43.7%) | 86-101 (21.6-25.4%) | 49-58 (12.3-14.6%) | 29-34 (7.3-8.5%) |
| Hippowdon (physWall, Leftovers) | 134-158 (31.9-37.6%) | 156-184 (37.1-43.8%) | 89-105 (21.2-25%) | 53-62 (12.6-14.8%) |
| Amoonguss (specWall, Black Sludge) | 139-164 (32.2-38%) | 650-765 (150.5-177.1%) | 186-219 (43.1-50.7%) | 109-128 (25.2-29.6%) |
| Goodra-Hisui (specWall, Leftovers) | 417-491 (114.6-134.9%) | 121-143 (33.2-39.3%) | 69-81 (19-22.3%) | 40-48 (11-13.2%) |
| Rotom-Wash (physWall, Leftovers) | 144-169 (47.4-55.6%) | 83-98 (27.3-32.2%) | 96-113 (31.6-37.2%) | 14-16 (4.6-5.3%) |
| Swampert (physWall, Leftovers) | 161-190 (39.9-47%) | 188-221 (46.5-54.7%) | 107-126 (26.5-31.2%) | 31-37 (7.7-9.2%) |
| Tyranitar (specWall, Leftovers) | 771-907 (190.8-224.5%) | 112-132 (27.7-32.7%) | 64-75 (15.8-18.6%) | 151-178 (37.4-44.1%) |
| Scizor (physWall, Leftovers) | 151-177 (43.9-51.5%) | 175-206 (50.9-59.9%) | 50-59 (14.5-17.2%) | 29-34 (8.4-9.9%) |
| Buzzwole (physWall, Leftovers) | 60-70 (14.4-16.7%) | 559-657 (133.7-157.2%) | 80-94 (19.1-22.5%) | 47-55 (11.2-13.2%) |
| Aegislash (physWall, Leftovers) | 0-0 (0-0%) | 66-77 (20.4-23.8%) | 0-0 (0-0%) | 22-26 (6.8-8%) |
| Tapu Fini (specWall, Leftovers) | 92-109 (26.7-31.7%) | 216-254 (62.8-73.8%) | 123-145 (35.8-42.2%) | 72-85 (20.9-24.7%) |
| Corviknight (physWall, Leftovers) | 146-172 (36.5-43%) | 85-100 (21.3-25%) | 48-57 (12-14.3%) | 28-33 (7-8.3%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Close Combat | Sky Attack | Double-Edge | Steel Wing |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 250-294 (71-83.5%) | 145-171 (41.2-48.6%) | 41-49 (11.6-13.9%) | 24-29 (6.8-8.2%) |
| Toxapex (physWall, Black Sludge) | 56-66 (18.4-21.7%) | 130-153 (42.8-50.3%) | 75-88 (24.7-28.9%) | 22-26 (7.2-8.6%) |
| Clodsire (specWall, Leftovers) | 157-185 (33.8-39.9%) | 366-431 (78.9-92.9%) | 209-246 (45-53%) | 123-144 (26.5-31%) |
| Dondozo (physWall, Leftovers) | 137-161 (27.2-31.9%) | 159-188 (31.5-37.3%) | 91-107 (18.1-21.2%) | 27-31 (5.4-6.2%) |
| Gliscor (physWall, Toxic Orb) | 64-76 (18.1-21.5%) | 150-177 (42.4-50%) | 86-101 (24.3-28.5%) | 51-60 (14.4-16.9%) |
| Ting-Lu (physWall, Leftovers) | 252-296 (47.2-55.4%) | 146-172 (27.3-32.2%) | 84-98 (15.7-18.4%) | 49-58 (9.2-10.9%) |
| Great Tusk (physWall, Leftovers) | 125-147 (28.8-33.9%) | 291-342 (67.1-78.8%) | 83-98 (19.1-22.6%) | 49-58 (11.3-13.4%) |
| Alomomola (physWall, Leftovers) | 174-204 (32.6-38.2%) | 202-238 (37.8-44.6%) | 116-136 (21.7-25.5%) | 34-40 (6.4-7.5%) |
| Slowking-Galar (specWall, Leftovers) | 62-73 (15.7-18.5%) | 292-344 (74.1-87.3%) | 167-196 (42.4-49.7%) | 98-115 (24.9-29.2%) |
| Heatran (specWall, Leftovers) | 397-468 (102.8-121.2%) | 115-136 (29.8-35.2%) | 66-78 (17.1-20.2%) | 19-22 (4.9-5.7%) |
| Zamazenta (physWall, Leftovers) | 137-161 (35.3-41.5%) | 319-376 (82.2-96.9%) | 91-107 (23.5-27.6%) | 54-63 (13.9-16.2%) |
| Dragonite (physWall, Leftovers) | 78-91 (20.2-23.6%) | 181-213 (46.9-55.2%) | 104-122 (26.9-31.6%) | 61-72 (15.8-18.7%) |
| Melmetal (physWall, Leftovers) | 235-276 (49.6-58.2%) | 68-80 (14.3-16.9%) | 39-46 (8.2-9.7%) | 23-27 (4.9-5.7%) |
| Gholdengo (specWall, Leftovers) | 0-0 (0-0%) | 126-149 (33.3-39.4%) | 0-0 (0-0%) | 42-50 (11.1-13.2%) |
| Landorus-Therian (physWall, Leftovers) | 80-95 (20.9-24.9%) | 188-221 (49.2-57.9%) | 107-126 (28-33%) | 63-74 (16.5-19.4%) |
| Garchomp (physWall, Leftovers) | 156-183 (37.1-43.6%) | 181-213 (43.1-50.7%) | 104-122 (24.8-29%) | 61-72 (14.5-17.1%) |
| Tyranitar-Mega (specWall, no item) | 590-694 (146-171.8%) | 85-100 (21-24.8%) | 49-57 (12.1-14.1%) | 116-136 (28.7-33.7%) |
| Chesnaught-Mega (physWall, no item) | 102-120 (26.8-31.6%) | 476-561 (125.3-147.6%) | 68-80 (17.9-21.1%) | 40-47 (10.5-12.4%) |
| Kingambit (physWall, Leftovers) | 533-628 (131.9-155.4%) | 77-91 (19.1-22.5%) | 44-52 (10.9-12.9%) | 26-30 (6.4-7.4%) |
| Toxapex (specWall, Leftovers) | 72-85 (23.7-28%) | 169-199 (55.6-65.5%) | 97-114 (31.9-37.5%) | 28-33 (9.2-10.9%) |

---

### Swampert-Mega

_Flagged for: Attack **438** — in OU's top quarter (≥416); **BST 635** — in OU's top quarter (≥630); hazards + real offence; reliable recovery on a bulky frame._

**Swampert-Mega** — forme, **UU**, source: imported (natdex)
  Water/Ground | BST 635 (100/150/110/95/110/70) | Abilities: Swift Swim
  Engine stats @252 (neutral/positive): Swift Swim: Atk 399/438, SpA 289/317, Spe 239/262
  Item: **forced — Swampertite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Water Aqua Tail 90P · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Hard Press 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Uproar 90S, Rock Ancient Power 60S, Psychic Mirror Coat fixedS **[conditional — needs a **special** hit taken from that target this turn]**
  Setup: Amnesia, Barrier, Bulk Up, Defense Curl, Work Up
  Reliable recovery: Rest
  Hazards: Stealth Rock
  Pivot: Flip Turn
  Phazing: Roar
  Status: Toxic, Yawn
  Weather/terrain: Hail, Rain Dance
  Utility: Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute, Focus Punch

Attacker: **Swampert-Mega**, adamant {"atk":252,"spe":252,"hp":4}, **Swampertite (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Aqua Tail | Earthquake | Focus Punch | Double-Edge |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 756-889 (105.9-124.5%) | 840-988 (117.6-138.4%) | 1678-1975 (235-276.6%) | 671-790 (94-110.6%) |
| Chansey (specWall, Eviolite) | 614-722 (87.2-102.6%) | 682-802 (96.9-113.9%) | 1363-1603 (193.6-227.7%) | 545-641 (77.4-91.1%) |
| Clefable (specWall, Leftovers) | 234-275 (59.4-69.8%) | 260-306 (66-77.7%) | 129-152 (32.7-38.6%) | 207-244 (52.5-61.9%) |
| Slowbro (physWall, Leftovers) | 61-72 (15.5-18.3%) | 136-160 (34.5-40.6%) | 67-79 (17-20.1%) | 108-128 (27.4-32.5%) |
| Slowbro-Mega (physWall, no item) | 43-50 (10.9-12.7%) | 95-112 (24.1-28.4%) | 47-55 (11.9-14%) | 76-89 (19.3-22.6%) |
| Slowking (specWall, Leftovers) | 108-128 (27.4-32.5%) | 241-284 (61.2-72.1%) | 120-141 (30.5-35.8%) | 193-227 (49-57.6%) |
| Skarmory (physWall, Leftovers) | 104-122 (31.1-36.5%) | 0-0 (0-0%) | 114-134 (34.1-40.1%) | 45-54 (13.5-16.2%) |
| Skarmory-Mega (physWall, no item) | 123-144 (36.8-43.1%) | 0-0 (0-0%) | 135-159 (40.4-47.6%) | 54-64 (16.2-19.2%) |
| Celesteela (physWall, Leftovers) | 128-151 (32.2-37.9%) | 0-0 (0-0%) | 141-166 (35.4-41.7%) | 56-66 (14.1-16.6%) |
| Hippowdon (physWall, Leftovers) | 234-275 (55.7-65.5%) | 130-152 (31-36.2%) | 129-151 (30.7-36%) | 103-121 (24.5-28.8%) |
| Amoonguss (specWall, Black Sludge) | 121-142 (28-32.9%) | 269-316 (62.3-73.1%) | 134-157 (31-36.3%) | 214-252 (49.5-58.3%) |
| Goodra-Hisui (specWall, Leftovers) | 90-106 (24.7-29.1%) | 402-473 (110.4-129.9%) | 400-471 (109.9-129.4%) | 80-94 (22-25.8%) |
| Rotom-Wash (physWall, Leftovers) | 62-73 (20.4-24%) | 277-326 (91.1-107.2%) | 138-162 (45.4-53.3%) | 110-130 (36.2-42.8%) |
| Swampert (physWall, Leftovers) | 140-165 (34.7-40.8%) | 155-183 (38.4-45.3%) | 155-182 (38.4-45%) | 124-146 (30.7-36.1%) |
| Tyranitar (specWall, Leftovers) | 334-394 (82.7-97.5%) | 371-437 (91.8-108.2%) | 739-870 (182.9-215.3%) | 74-87 (18.3-21.5%) |
| Scizor (physWall, Leftovers) | 131-154 (38.1-44.8%) | 145-171 (42.2-49.7%) | 144-170 (41.9-49.4%) | 58-68 (16.9-19.8%) |
| Buzzwole (physWall, Leftovers) | 104-122 (24.9-29.2%) | 57-68 (13.6-16.3%) | 57-67 (13.6-16%) | 92-108 (22-25.8%) |
| Aegislash (physWall, Leftovers) | 98-116 (30.2-35.8%) | 219-258 (67.6-79.6%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Tapu Fini (specWall, Leftovers) | 80-94 (23.3-27.3%) | 178-210 (51.7-61%) | 89-104 (25.9-30.2%) | 142-167 (41.3-48.5%) |
| Corviknight (physWall, Leftovers) | 127-149 (31.8-37.3%) | 0-0 (0-0%) | 140-164 (35-41%) | 56-66 (14-16.5%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Aqua Tail | Earthquake | Focus Punch | Double-Edge |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 54-64 (15.3-18.2%) | 120-142 (34.1-40.3%) | 239-282 (67.9-80.1%) | 48-56 (13.6-15.9%) |
| Toxapex (physWall, Black Sludge) | 48-57 (15.8-18.8%) | 216-255 (71.1-83.9%) | 53-63 (17.4-20.7%) | 86-101 (28.3-33.2%) |
| Clodsire (specWall, Leftovers) | 546-642 (117.7-138.4%) | 606-713 (130.6-153.7%) | 151-177 (32.5-38.1%) | 242-285 (52.2-61.4%) |
| Dondozo (physWall, Leftovers) | 59-70 (11.7-13.9%) | 132-155 (26.2-30.8%) | 131-154 (26-30.6%) | 105-124 (20.8-24.6%) |
| Gliscor (physWall, Toxic Orb) | 225-265 (63.6-74.9%) | 0-0 (0-0%) | 62-73 (17.5-20.6%) | 99-117 (28-33.1%) |
| Ting-Lu (physWall, Leftovers) | 219-258 (41-48.3%) | 121-143 (22.7-26.8%) | 241-284 (45.1-53.2%) | 96-114 (18-21.3%) |
| Great Tusk (physWall, Leftovers) | 217-256 (50-59%) | 120-142 (27.6-32.7%) | 119-141 (27.4-32.5%) | 96-113 (22.1-26%) |
| Alomomola (physWall, Leftovers) | 75-88 (14-16.5%) | 167-197 (31.3-36.9%) | 166-196 (31.1-36.7%) | 133-157 (24.9-29.4%) |
| Slowking-Galar (specWall, Leftovers) | 217-256 (55.1-65%) | 483-569 (122.6-144.4%) | 60-70 (15.2-17.8%) | 193-227 (49-57.6%) |
| Heatran (specWall, Leftovers) | 345-406 (89.4-105.2%) | 766-902 (198.4-233.7%) | 381-449 (98.7-116.3%) | 76-90 (19.7-23.3%) |
| Zamazenta (physWall, Leftovers) | 119-140 (30.7-36.1%) | 132-155 (34-39.9%) | 131-154 (33.8-39.7%) | 105-124 (27.1-32%) |
| Dragonite (physWall, Leftovers) | 67-79 (17.4-20.5%) | 0-0 (0-0%) | 74-88 (19.2-22.8%) | 120-141 (31.1-36.5%) |
| Melmetal (physWall, Leftovers) | 102-120 (21.5-25.3%) | 226-266 (47.7-56.1%) | 225-264 (47.5-55.7%) | 45-53 (9.5-11.2%) |
| Gholdengo (specWall, Leftovers) | 189-222 (50-58.7%) | 420-494 (111.1-130.7%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Landorus-Therian (physWall, Leftovers) | 281-330 (73.6-86.4%) | 0-0 (0-0%) | 77-91 (20.2-23.8%) | 124-146 (32.5-38.2%) |
| Garchomp (physWall, Leftovers) | 135-159 (32.1-37.9%) | 150-177 (35.7-42.1%) | 149-176 (35.5-41.9%) | 120-141 (28.6-33.6%) |
| Tyranitar-Mega (specWall, no item) | 256-301 (63.4-74.5%) | 284-334 (70.3-82.7%) | 565-665 (139.9-164.6%) | 56-66 (13.9-16.3%) |
| Chesnaught-Mega (physWall, no item) | 44-52 (11.6-13.7%) | 49-58 (12.9-15.3%) | 98-115 (25.8-30.3%) | 78-92 (20.5-24.2%) |
| Kingambit (physWall, Leftovers) | 116-136 (28.7-33.7%) | 257-302 (63.6-74.8%) | 511-601 (126.5-148.8%) | 51-60 (12.6-14.9%) |
| Toxapex (specWall, Leftovers) | 63-74 (20.7-24.3%) | 281-330 (92.4-108.6%) | 69-82 (22.7-27%) | 112-131 (36.8-43.1%) |

---

### Alakazam

_Flagged for: Special Attack **405** — in OU's top quarter (≥401); Speed **372** — in OU's top quarter (≥350); strong setup on a frame fast enough to use it._

**Alakazam** — species, **UU**, source: imported (natdex)
  Psychic | BST 500 (55/50/45/135/95/120) | Abilities: Synchronize / Inner Focus / Magic Guard
  Engine stats @252 (neutral/positive): Synchronize: Atk 199/218, SpA 369/405, Spe 339/372 — Inner Focus: Atk 199/218, SpA 369/405, Spe 339/372 — Magic Guard: Atk 199/218, SpA 369/405, Spe 339/372
  Item: **free** — but its own Alakazite is **refused in UU** (it would make Alakazam-Mega, OU)
  STAB: Psychic Future Sight 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Foul Play 95P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Zap Cannon 120S, Grass Energy Ball 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Normal Tri Attack 80S
  Setup: Barrier, Calm Mind, Nasty Plot
  Reliable recovery: Recover, Rest
  Drain/Rest-only: Drain Punch, Dream Eater
  Pivot: Teleport
  Status: Thunder Wave, Toxic
  Weather/terrain: Psychic Terrain, Rain Dance, Sunny Day
  Utility: Disable, Encore, Gravity, Knock Off, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room, Focus Punch

Attacker: **Alakazam**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Future Sight | Focus Blast | Zap Cannon | Energy Ball |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 154-182 (21.6-25.5%) | 206-243 (28.9-34%) | 102-120 (14.3-16.8%) | 78-91 (10.9-12.7%) |
| Chansey (specWall, Eviolite) | 123-145 (17.5-20.6%) | 165-195 (23.4-27.7%) | 81-97 (11.5-13.8%) | 62-72 (8.8-10.2%) |
| Clefable (specWall, Leftovers) | 204-240 (51.8-60.9%) | 67-79 (17-20.1%) | 136-159 (34.5-40.4%) | 102-120 (25.9-30.5%) |
| Slowbro (physWall, Leftovers) | 158-185 (40.1-47%) | 105-123 (26.6-31.2%) | 423-497 (107.4-126.1%) | 318-374 (80.7-94.9%) |
| Slowbro-Mega (physWall, no item) | 158-185 (40.1-47%) | 105-123 (26.6-31.2%) | 423-497 (107.4-126.1%) | 318-374 (80.7-94.9%) |
| Slowking (specWall, Leftovers) | 89-105 (22.6-26.6%) | 59-70 (15-17.8%) | 239-280 (60.7-71.1%) | 179-211 (45.4-53.6%) |
| Skarmory (physWall, Leftovers) | 176-208 (52.7-62.3%) | 235-276 (70.4-82.6%) | 470-553 (140.7-165.6%) | 44-52 (13.2-15.6%) |
| Skarmory-Mega (physWall, no item) | 131-154 (39.2-46.1%) | 175-206 (52.4-61.7%) | 352-414 (105.4-124%) | 32-39 (9.6-11.7%) |
| Celesteela (physWall, Leftovers) | 130-153 (32.7-38.4%) | 174-205 (43.7-51.5%) | 349-410 (87.7-103%) | 32-37 (8-9.3%) |
| Hippowdon (physWall, Leftovers) | 345-405 (82.1-96.4%) | 230-270 (54.8-64.3%) | 0-0 (0-0%) | 345-406 (82.1-96.7%) |
| Amoonguss (specWall, Black Sludge) | 440-517 (101.9-119.7%) | 72-85 (16.7-19.7%) | 72-85 (16.7-19.7%) | 27-32 (6.3-7.4%) |
| Goodra-Hisui (specWall, Leftovers) | 71-84 (19.5-23.1%) | 191-224 (52.5-61.5%) | 46-55 (12.6-15.1%) | 16-20 (4.4-5.5%) |
| Rotom-Wash (physWall, Leftovers) | 249-293 (81.9-96.4%) | 166-195 (54.6-64.1%) | 166-195 (54.6-64.1%) | 250-295 (82.2-97%) |
| Swampert (physWall, Leftovers) | 288-339 (71.3-83.9%) | 192-226 (47.5-55.9%) | 0-0 (0-0%) | 578-681 (143.1-168.6%) |
| Tyranitar (specWall, Leftovers) | 0-0 (0-0%) | 509-599 (126-148.3%) | 127-149 (31.4-36.9%) | 191-226 (47.3-55.9%) |
| Scizor (physWall, Leftovers) | 158-185 (45.9-53.8%) | 211-248 (61.3-72.1%) | 211-248 (61.3-72.1%) | 39-46 (11.3-13.4%) |
| Buzzwole (physWall, Leftovers) | 874-1028 (209.1-245.9%) | 145-170 (34.7-40.7%) | 291-341 (69.6-81.6%) | 109-128 (26.1-30.6%) |
| Aegislash (physWall, Leftovers) | 92-109 (28.4-33.6%) | 0-0 (0-0%) | 123-145 (38-44.8%) | 46-54 (14.2-16.7%) |
| Tapu Fini (specWall, Leftovers) | 158-187 (45.9-54.4%) | 52-62 (15.1-18%) | 211-249 (61.3-72.4%) | 159-188 (46.2-54.7%) |
| Corviknight (physWall, Leftovers) | 150-176 (37.5-44%) | 201-236 (50.3-59%) | 403-474 (100.8-118.5%) | 37-44 (9.3-11%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Future Sight | Focus Blast | Zap Cannon | Energy Ball |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 115-136 (32.7-38.6%) | 310-365 (88.1-103.7%) | 76-91 (21.6-25.9%) | 28-33 (8-9.4%) |
| Toxapex (physWall, Black Sludge) | 391-460 (128.6-151.3%) | 65-76 (21.4-25%) | 260-306 (85.5-100.7%) | 97-115 (31.9-37.8%) |
| Clodsire (specWall, Leftovers) | 382-449 (82.3-96.8%) | 63-74 (13.6-15.9%) | 0-0 (0-0%) | 94-113 (20.3-24.4%) |
| Dondozo (physWall, Leftovers) | 374-440 (74.2-87.3%) | 249-293 (49.4-58.1%) | 499-587 (99-116.5%) | 375-442 (74.4-87.7%) |
| Gliscor (physWall, Toxic Orb) | 334-392 (94.4-110.7%) | 110-130 (31.1-36.7%) | 0-0 (0-0%) | 167-196 (47.2-55.4%) |
| Ting-Lu (physWall, Leftovers) | 0-0 (0-0%) | 317-373 (59.4-69.9%) | 0-0 (0-0%) | 239-280 (44.8-52.4%) |
| Great Tusk (physWall, Leftovers) | 874-1028 (201.4-236.9%) | 291-341 (67.1-78.6%) | 0-0 (0-0%) | 438-514 (100.9-118.4%) |
| Alomomola (physWall, Leftovers) | 491-578 (91.9-108.2%) | 327-386 (61.2-72.3%) | 656-772 (122.8-144.6%) | 492-579 (92.1-108.4%) |
| Slowking-Galar (specWall, Leftovers) | 179-210 (45.4-53.3%) | 29-35 (7.4-8.9%) | 119-140 (30.2-35.5%) | 44-52 (11.2-13.2%) |
| Heatran (specWall, Leftovers) | 91-107 (23.6-27.7%) | 244-287 (63.2-74.4%) | 122-143 (31.6-37%) | 22-26 (5.7-6.7%) |
| Zamazenta (physWall, Leftovers) | 469-552 (120.9-142.3%) | 156-183 (40.2-47.2%) | 156-183 (40.2-47.2%) | 117-137 (30.2-35.3%) |
| Dragonite (physWall, Leftovers) | 263-310 (68.1-80.3%) | 87-102 (22.5-26.4%) | 175-206 (45.3-53.4%) | 32-39 (8.3-10.1%) |
| Melmetal (physWall, Leftovers) | 187-219 (39.5-46.2%) | 499-587 (105.3-123.8%) | 249-293 (52.5-61.8%) | 93-110 (19.6-23.2%) |
| Gholdengo (specWall, Leftovers) | 101-118 (26.7-31.2%) | 0-0 (0-0%) | 135-158 (35.7-41.8%) | 50-59 (13.2-15.6%) |
| Landorus-Therian (physWall, Leftovers) | 317-373 (83-97.6%) | 105-123 (27.5-32.2%) | 0-0 (0-0%) | 158-187 (41.4-49%) |
| Garchomp (physWall, Leftovers) | 301-354 (71.7-84.3%) | 201-236 (47.9-56.2%) | 0-0 (0-0%) | 150-178 (35.7-42.4%) |
| Tyranitar-Mega (specWall, no item) | 0-0 (0-0%) | 449-529 (111.1-130.9%) | 111-131 (27.5-32.4%) | 169-198 (41.8-49%) |
| Chesnaught-Mega (physWall, no item) | 469-552 (123.4-145.3%) | 156-183 (41.1-48.2%) | 78-91 (20.5-23.9%) | 58-68 (15.3-17.9%) |
| Kingambit (physWall, Leftovers) | 0-0 (0-0%) | 806-949 (199.5-234.9%) | 201-236 (49.8-58.4%) | 75-88 (18.6-21.8%) |
| Toxapex (specWall, Leftovers) | 299-352 (98.4-115.8%) | 49-58 (16.1-19.1%) | 198-234 (65.1-77%) | 75-88 (24.7-28.9%) |

---

### Chandelure

_Flagged for: Special Attack **427** — in OU's top quarter (≥401); **trapping ability: Shadow Tag**; ability: Flash Fire._

**Chandelure** — species, **UU**, source: override
  Ghost/Fire | BST 520 (60/55/90/145/90/80) | Abilities: Flash Fire / Flame Body / Infiltrator / Shadow Tag
  Engine stats @252 (neutral/positive): Flash Fire: Atk 209/229, SpA 389/427, Spe 259/284 — Flame Body: Atk 209/229, SpA 389/427, Spe 259/284 — Infiltrator: Atk 209/229, SpA 389/427, Spe 259/284 — Shadow Tag: Atk 209/229, SpA 389/427, Spe 259/284
  **TRAPPING ABILITY: Shadow Tag** (optional — one of 4)
  Item: **free**
  STAB: Ghost Shadow Ball 80S · Fire Overheat 140S
  Physical coverage: Normal Return 102P, Dark Lash Out 75P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S
  Setup: Acid Armor, Calm Mind
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Clear Smog, Haze, Memento, Pain Split, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

Attacker: **Chandelure**, modest {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Shadow Ball | Overheat | Solar Beam | Dream Eater |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 0-0 (0-0%) | 208-244 (29.1-34.2%) | 119-140 (16.7-19.6%) | 98-117 (13.7-16.4%) |
| Chansey (specWall, Eviolite) | 0-0 (0-0%) | 166-196 (23.6-27.8%) | 94-111 (13.4-15.8%) | 79-93 (11.2-13.2%) |
| Clefable (specWall, Leftovers) | 158-185 (40.1-47%) | 274-323 (69.5-82%) | 157-184 (39.8-46.7%) | 131-154 (33.2-39.1%) |
| Slowbro (physWall, Leftovers) | 491-578 (124.6-146.7%) | 213-250 (54.1-63.5%) | 488-575 (123.9-145.9%) | 101-119 (25.6-30.2%) |
| Slowbro-Mega (physWall, no item) | 491-578 (124.6-146.7%) | 213-250 (54.1-63.5%) | 488-575 (123.9-145.9%) | 101-119 (25.6-30.2%) |
| Slowking (specWall, Leftovers) | 278-326 (70.6-82.7%) | 119-141 (30.2-35.8%) | 275-323 (69.8-82%) | 57-67 (14.5-17%) |
| Skarmory (physWall, Leftovers) | 273-321 (81.7-96.1%) | 951-1119 (284.7-335%) | 67-79 (20.1-23.7%) | 113-132 (33.8-39.5%) |
| Skarmory-Mega (physWall, no item) | 204-240 (61.1-71.9%) | 711-837 (212.9-250.6%) | 50-59 (15-17.7%) | 84-98 (25.1-29.3%) |
| Celesteela (physWall, Leftovers) | 202-237 (50.8-59.5%) | 705-829 (177.1-208.3%) | 49-58 (12.3-14.6%) | 83-98 (20.9-24.6%) |
| Hippowdon (physWall, Leftovers) | 266-314 (63.3-74.8%) | 465-547 (110.7-130.2%) | 265-313 (63.1-74.5%) | 222-261 (52.9-62.1%) |
| Amoonguss (specWall, Black Sludge) | 170-200 (39.4-46.3%) | 591-696 (136.8-161.1%) | 41-49 (9.5-11.3%) | 283-332 (65.5-76.9%) |
| Goodra-Hisui (specWall, Leftovers) | 111-131 (30.5-36%) | 192-226 (52.7-62.1%) | 27-32 (7.4-8.8%) | 45-53 (12.4-14.6%) |
| Rotom-Wash (physWall, Leftovers) | 192-227 (63.2-74.7%) | 167-197 (54.9-64.8%) | 384-452 (126.3-148.7%) | 159-188 (52.3-61.8%) |
| Swampert (physWall, Leftovers) | 222-262 (55-64.9%) | 193-227 (47.8-56.2%) | 889-1046 (220-258.9%) | 184-218 (45.5-54%) |
| Tyranitar (specWall, Leftovers) | 74-87 (18.3-21.5%) | 127-150 (31.4-37.1%) | 146-172 (36.1-42.6%) | 0-0 (0-0%) |
| Scizor (physWall, Leftovers) | 245-288 (71.2-83.7%) | 1710-2013 (497.1-585.2%) | 61-71 (17.7-20.6%) | 101-119 (29.4-34.6%) |
| Buzzwole (physWall, Leftovers) | 338-397 (80.9-95%) | 1177-1385 (281.6-331.3%) | 167-197 (40-47.1%) | 561-661 (134.2-158.1%) |
| Aegislash (physWall, Leftovers) | 288-340 (88.9-104.9%) | 501-590 (154.6-182.1%) | 71-84 (21.9-25.9%) | 59-70 (18.2-21.6%) |
| Tapu Fini (specWall, Leftovers) | 123-145 (35.8-42.2%) | 106-126 (30.8-36.6%) | 245-288 (71.2-83.7%) | 102-120 (29.7-34.9%) |
| Corviknight (physWall, Leftovers) | 234-274 (58.5-68.5%) | 813-958 (203.3-239.5%) | 57-67 (14.3-16.8%) | 96-114 (24-28.5%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Shadow Ball | Overheat | Solar Beam | Dream Eater |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 180-211 (51.1-59.9%) | 1254-1476 (356.3-419.3%) | 44-52 (12.5-14.8%) | 74-87 (21-24.7%) |
| Toxapex (physWall, Black Sludge) | 150-178 (49.3-58.6%) | 131-154 (43.1-50.7%) | 150-176 (49.3-57.9%) | 250-296 (82.2-97.4%) |
| Clodsire (specWall, Leftovers) | 148-174 (31.9-37.5%) | 256-301 (55.2-64.9%) | 146-172 (31.5-37.1%) | 245-288 (52.8-62.1%) |
| Dondozo (physWall, Leftovers) | 288-340 (57.1-67.5%) | 252-296 (50-58.7%) | 577-678 (114.5-134.5%) | 240-283 (47.6-56.2%) |
| Gliscor (physWall, Toxic Orb) | 258-304 (72.9-85.9%) | 449-529 (126.8-149.4%) | 257-302 (72.6-85.3%) | 214-252 (60.5-71.2%) |
| Ting-Lu (physWall, Leftovers) | 92-107 (17.2-20%) | 321-378 (60.1-70.8%) | 367-432 (68.7-80.9%) | 0-0 (0-0%) |
| Great Tusk (physWall, Leftovers) | 338-397 (77.9-91.5%) | 588-692 (135.5-159.4%) | 673-793 (155.1-182.7%) | 561-661 (129.3-152.3%) |
| Alomomola (physWall, Leftovers) | 379-447 (71-83.7%) | 331-390 (62-73%) | 759-893 (142.1-167.2%) | 315-371 (59-69.5%) |
| Slowking-Galar (specWall, Leftovers) | 278-326 (70.6-82.7%) | 240-283 (60.9-71.8%) | 68-80 (17.3-20.3%) | 114-135 (28.9-34.3%) |
| Heatran (specWall, Leftovers) | 141-166 (36.5-43%) | 245-289 (63.5-74.9%) | 35-40 (9.1-10.4%) | 58-68 (15-17.6%) |
| Zamazenta (physWall, Leftovers) | 182-213 (46.9-54.9%) | 315-371 (81.2-95.6%) | 180-211 (46.4-54.4%) | 301-354 (77.6-91.2%) |
| Dragonite (physWall, Leftovers) | 204-240 (52.8-62.2%) | 176-209 (45.6-54.1%) | 50-59 (13-15.3%) | 169-198 (43.8-51.3%) |
| Melmetal (physWall, Leftovers) | 288-340 (60.8-71.7%) | 1008-1186 (212.7-250.2%) | 144-169 (30.4-35.7%) | 119-141 (25.1-29.7%) |
| Gholdengo (specWall, Leftovers) | 313-369 (82.8-97.6%) | 544-640 (143.9-169.3%) | 78-91 (20.6-24.1%) | 65-76 (17.2-20.1%) |
| Landorus-Therian (physWall, Leftovers) | 245-288 (64.1-75.4%) | 427-503 (111.8-131.7%) | 244-287 (63.9-75.1%) | 204-240 (53.4-62.8%) |
| Garchomp (physWall, Leftovers) | 234-274 (55.7-65.2%) | 202-239 (48.1-56.9%) | 232-273 (55.2-65%) | 193-228 (46-54.3%) |
| Tyranitar-Mega (specWall, no item) | 65-76 (16.1-18.8%) | 113-132 (28-32.7%) | 130-152 (32.2-37.6%) | 0-0 (0-0%) |
| Chesnaught-Mega (physWall, no item) | 182-213 (47.9-56.1%) | 631-743 (166.1-195.5%) | 89-105 (23.4-27.6%) | 301-354 (79.2-93.2%) |
| Kingambit (physWall, Leftovers) | 117-136 (29-33.7%) | 813-958 (201.2-237.1%) | 115-136 (28.5-33.7%) | 0-0 (0-0%) |
| Toxapex (specWall, Leftovers) | 115-136 (37.8-44.7%) | 100-117 (32.9-38.5%) | 114-135 (37.5-44.4%) | 192-226 (63.2-74.3%) |

---

### Gardevoir-Mega

_Flagged for: Special Attack **471** — in OU's top quarter (≥401); Speed 328 — above OU's median (322); BST 618 — above OU's median (600); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Pixilate; reliable recovery on a bulky frame._

**Gardevoir-Mega** — forme, **UU**, source: imported (natdex)
  Psychic/Fairy | BST 618 (68/85/65/165/135/100) | Abilities: Pixilate
  Engine stats @252 (neutral/positive): Pixilate: Atk 269/295, SpA 429/471, Spe 299/328
  Item: **forced — Gardevoirite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Psychic Future Sight 120S · Fairy Hyper Voice 117S
  Physical coverage: Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Ghost Shadow Sneak 40P
  Special coverage: Fighting Focus Blast 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S, Bug Signal Beam 75S
  Setup: Calm Mind, Defense Curl
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss, Dream Eater
  Priority: Shadow Sneak 40P Ghost (+1), Vacuum Wave 40S Fighting (+1)
  Pivot: Teleport
  Status: Hypnosis, Sing, Thunder Wave, Toxic, Will-O-Wisp
  Cleric: Heal Bell, Life Dew, Wish
  Trapping moves: Mean Look
  Weather/terrain: Misty Terrain, Psychic Terrain, Rain Dance, Sunny Day
  Utility: Destiny Bond, Disable, Encore, Gravity, Healing Wish, Knock Off, Light Screen, Magic Coat, Memento, Pain Split, Protect, Reflect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room

Attacker: **Gardevoir-Mega**, timid {"spa":252,"spe":252,"hp":4}, **Gardevoirite (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Future Sight | Hyper Voice | Focus Blast | Thunderbolt |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 138-163 (19.3-22.8%) | 135-159 (18.9-22.3%) | 184-217 (25.8-30.4%) | 73-86 (10.2-12%) |
| Chansey (specWall, Eviolite) | 111-130 (15.8-18.5%) | 108-127 (15.3-18%) | 148-174 (21-24.7%) | 58-69 (8.2-9.8%) |
| Clefable (specWall, Leftovers) | 182-214 (46.2-54.3%) | 178-209 (45.2-53%) | 60-71 (15.2-18%) | 96-113 (24.4-28.7%) |
| Slowbro (physWall, Leftovers) | 141-166 (35.8-42.1%) | 276-325 (70.1-82.5%) | 94-111 (23.9-28.2%) | 300-353 (76.1-89.6%) |
| Slowbro-Mega (physWall, no item) | 141-166 (35.8-42.1%) | 276-325 (70.1-82.5%) | 94-111 (23.9-28.2%) | 300-353 (76.1-89.6%) |
| Slowking (specWall, Leftovers) | 80-94 (20.3-23.9%) | 156-183 (39.6-46.4%) | 53-62 (13.5-15.7%) | 169-199 (42.9-50.5%) |
| Skarmory (physWall, Leftovers) | 157-185 (47-55.4%) | 153-181 (45.8-54.2%) | 210-247 (62.9-74%) | 334-393 (100-117.7%) |
| Skarmory-Mega (physWall, no item) | 118-138 (35.3-41.3%) | 115-135 (34.4-40.4%) | 157-185 (47-55.4%) | 250-294 (74.9-88%) |
| Celesteela (physWall, Leftovers) | 117-137 (29.4-34.4%) | 114-134 (28.6-33.7%) | 156-183 (39.2-46%) | 247-291 (62.1-73.1%) |
| Hippowdon (physWall, Leftovers) | 308-363 (73.3-86.4%) | 301-354 (71.7-84.3%) | 205-242 (48.8-57.6%) | 0-0 (0-0%) |
| Amoonguss (specWall, Black Sludge) | 393-462 (91-106.9%) | 95-112 (22-25.9%) | 65-77 (15-17.8%) | 52-61 (12-14.1%) |
| Goodra-Hisui (specWall, Leftovers) | 64-75 (17.6-20.6%) | 125-147 (34.3-40.4%) | 171-201 (47-55.2%) | 34-40 (9.3-11%) |
| Rotom-Wash (physWall, Leftovers) | 223-262 (73.4-86.2%) | 217-255 (71.4-83.9%) | 148-174 (48.7-57.2%) | 118-138 (38.8-45.4%) |
| Swampert (physWall, Leftovers) | 257-303 (63.6-75%) | 251-295 (62.1-73%) | 171-202 (42.3-50%) | 0-0 (0-0%) |
| Tyranitar (specWall, Leftovers) | 0-0 (0-0%) | 332-391 (82.2-96.8%) | 455-535 (112.6-132.4%) | 90-106 (22.3-26.2%) |
| Scizor (physWall, Leftovers) | 141-166 (41-48.3%) | 138-162 (40.1-47.1%) | 189-222 (54.9-64.5%) | 150-176 (43.6-51.2%) |
| Buzzwole (physWall, Leftovers) | 781-919 (186.8-219.9%) | 762-896 (182.3-214.4%) | 130-153 (31.1-36.6%) | 206-243 (49.3-58.1%) |
| Aegislash (physWall, Leftovers) | 83-98 (25.6-30.2%) | 81-95 (25-29.3%) | 0-0 (0-0%) | 88-103 (27.2-31.8%) |
| Tapu Fini (specWall, Leftovers) | 142-167 (41.3-48.5%) | 138-163 (40.1-47.4%) | 47-55 (13.7-16%) | 151-177 (43.9-51.5%) |
| Corviknight (physWall, Leftovers) | 135-158 (33.8-39.5%) | 131-155 (32.8-38.8%) | 180-211 (45-52.8%) | 285-336 (71.3-84%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Future Sight | Hyper Voice | Focus Blast | Thunderbolt |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 104-122 (29.5-34.7%) | 101-119 (28.7-33.8%) | 277-326 (78.7-92.6%) | 55-64 (15.6-18.2%) |
| Toxapex (physWall, Black Sludge) | 349-411 (114.8-135.2%) | 85-100 (28-32.9%) | 58-68 (19.1-22.4%) | 185-217 (60.9-71.4%) |
| Clodsire (specWall, Leftovers) | 341-401 (73.5-86.4%) | 83-97 (17.9-20.9%) | 56-66 (12.1-14.2%) | 0-0 (0-0%) |
| Dondozo (physWall, Leftovers) | 334-393 (66.3-78%) | 326-383 (64.7-76%) | 223-262 (44.2-52%) | 353-416 (70-82.5%) |
| Gliscor (physWall, Toxic Orb) | 298-351 (84.2-99.2%) | 291-343 (82.2-96.9%) | 99-117 (28-33.1%) | 0-0 (0-0%) |
| Ting-Lu (physWall, Leftovers) | 0-0 (0-0%) | 415-488 (77.7-91.4%) | 284-334 (53.2-62.5%) | 0-0 (0-0%) |
| Great Tusk (physWall, Leftovers) | 781-919 (180-211.8%) | 762-896 (175.6-206.5%) | 260-306 (59.9-70.5%) | 0-0 (0-0%) |
| Alomomola (physWall, Leftovers) | 440-517 (82.4-96.8%) | 429-504 (80.3-94.4%) | 293-345 (54.9-64.6%) | 465-547 (87.1-102.4%) |
| Slowking-Galar (specWall, Leftovers) | 160-188 (40.6-47.7%) | 78-91 (19.8-23.1%) | 26-31 (6.6-7.9%) | 84-99 (21.3-25.1%) |
| Heatran (specWall, Leftovers) | 81-96 (21-24.9%) | 39-46 (10.1-11.9%) | 218-256 (56.5-66.3%) | 86-102 (22.3-26.4%) |
| Zamazenta (physWall, Leftovers) | 419-493 (108-127.1%) | 409-481 (105.4-124%) | 139-164 (35.8-42.3%) | 111-130 (28.6-33.5%) |
| Dragonite (physWall, Leftovers) | 236-277 (61.1-71.8%) | 460-541 (119.2-140.2%) | 78-92 (20.2-23.8%) | 125-147 (32.4-38.1%) |
| Melmetal (physWall, Leftovers) | 167-196 (35.2-41.4%) | 163-191 (34.4-40.3%) | 446-525 (94.1-110.8%) | 176-208 (37.1-43.9%) |
| Gholdengo (specWall, Leftovers) | 90-106 (23.8-28%) | 88-103 (23.3-27.2%) | 0-0 (0-0%) | 95-112 (25.1-29.6%) |
| Landorus-Therian (physWall, Leftovers) | 283-333 (74.1-87.2%) | 276-325 (72.3-85.1%) | 94-111 (24.6-29.1%) | 0-0 (0-0%) |
| Garchomp (physWall, Leftovers) | 270-317 (64.3-75.5%) | 527-620 (125.5-147.6%) | 180-211 (42.9-50.2%) | 0-0 (0-0%) |
| Tyranitar-Mega (specWall, no item) | 0-0 (0-0%) | 294-346 (72.8-85.6%) | 402-472 (99.5-116.8%) | 79-94 (19.6-23.3%) |
| Chesnaught-Mega (physWall, no item) | 419-493 (110.3-129.7%) | 409-481 (107.6-126.6%) | 139-164 (36.6-43.2%) | 55-65 (14.5-17.1%) |
| Kingambit (physWall, Leftovers) | 0-0 (0-0%) | 263-310 (65.1-76.7%) | 720-847 (178.2-209.7%) | 142-168 (35.1-41.6%) |
| Toxapex (specWall, Leftovers) | 267-314 (87.8-103.3%) | 65-76 (21.4-25%) | 44-52 (14.5-17.1%) | 141-166 (46.4-54.6%) |

---

### Zeraora

_Flagged for: Speed **423** — in OU's top quarter (≥350); Special Attack 333 — above OU's median (328); BST 600 — above OU's median (600); Special Attack reaches 333 off base 102 — an ability is doing the work; setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Volt Absorb._

**Zeraora** — species, **UU**, source: imported (natdex)
  Electric | BST 600 (88/112/75/102/80/143) | Abilities: Volt Absorb
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 323/355, SpA 303/333, Spe 385/423
  Item: **free** — but its own Zeraorite is **refused in UU** (it would make Zeraora-Mega, OU)
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Mega Kick 120P, Dragon Outrage 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Fairy Play Rough 90P
  Special coverage: Fighting Focus Blast 120S, Grass Grass Knot 60S, Normal Hidden Power 60S, Dark Snarl 55S
  Setup: Agility, Bulk Up, Calm Mind, Charge, Hone Claws, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**, Quick Attack 40P Normal (+1)
  Pivot: Volt Switch
  Status: Thunder Wave, Toxic
  Weather/terrain: Electric Terrain
  Utility: Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Focus Punch

Attacker: **Zeraora**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Thunder | Focus Punch | Mega Kick | Outrage |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 92-107 (12.9-15%) | 1609-1894 (225.4-265.3%) | 643-757 (90.1-106%) | 643-757 (90.1-106%) |
| Chansey (specWall, Eviolite) | 74-87 (10.5-12.4%) | 1307-1537 (185.7-218.3%) | 522-614 (74.1-87.2%) | 522-614 (74.1-87.2%) |
| Clefable (specWall, Leftovers) | 120-141 (30.5-35.8%) | 123-145 (31.2-36.8%) | 198-234 (50.3-59.4%) | 0-0 (0-0%) |
| Slowbro (physWall, Leftovers) | 374-440 (94.9-111.7%) | 65-76 (16.5-19.3%) | 104-123 (26.4-31.2%) | 104-123 (26.4-31.2%) |
| Slowbro-Mega (physWall, no item) | 374-440 (94.9-111.7%) | 45-53 (11.4-13.5%) | 72-85 (18.3-21.6%) | 72-85 (18.3-21.6%) |
| Slowking (specWall, Leftovers) | 211-249 (53.6-63.2%) | 115-135 (29.2-34.3%) | 184-218 (46.7-55.3%) | 184-218 (46.7-55.3%) |
| Skarmory (physWall, Leftovers) | 416-490 (124.6-146.7%) | 109-128 (32.6-38.3%) | 44-52 (13.2-15.6%) | 44-52 (13.2-15.6%) |
| Skarmory-Mega (physWall, no item) | 312-366 (93.4-109.6%) | 130-153 (38.9-45.8%) | 52-61 (15.6-18.3%) | 52-61 (15.6-18.3%) |
| Celesteela (physWall, Leftovers) | 309-364 (77.6-91.5%) | 135-159 (33.9-39.9%) | 54-63 (13.6-15.8%) | 54-63 (13.6-15.8%) |
| Hippowdon (physWall, Leftovers) | 0-0 (0-0%) | 123-145 (29.3-34.5%) | 98-117 (23.3-27.9%) | 98-117 (23.3-27.9%) |
| Amoonguss (specWall, Black Sludge) | 65-75 (15-17.4%) | 128-150 (29.6-34.7%) | 205-241 (47.5-55.8%) | 205-241 (47.5-55.8%) |
| Goodra-Hisui (specWall, Leftovers) | 41-49 (11.3-13.5%) | 384-452 (105.5-124.2%) | 76-89 (20.9-24.5%) | 153-180 (42-49.5%) |
| Rotom-Wash (physWall, Leftovers) | 146-172 (48-56.6%) | 132-156 (43.4-51.3%) | 106-124 (34.9-40.8%) | 106-124 (34.9-40.8%) |
| Swampert (physWall, Leftovers) | 0-0 (0-0%) | 148-175 (36.6-43.3%) | 119-140 (29.5-34.7%) | 119-140 (29.5-34.7%) |
| Tyranitar (specWall, Leftovers) | 113-132 (28-32.7%) | 711-835 (176-206.7%) | 70-83 (17.3-20.5%) | 141-167 (34.9-41.3%) |
| Scizor (physWall, Leftovers) | 187-219 (54.4-63.7%) | 139-163 (40.4-47.4%) | 55-65 (16-18.9%) | 55-65 (16-18.9%) |
| Buzzwole (physWall, Leftovers) | 257-301 (61.5-72%) | 54-65 (12.9-15.6%) | 88-104 (21.1-24.9%) | 88-104 (21.1-24.9%) |
| Aegislash (physWall, Leftovers) | 110-130 (34-40.1%) | 0-0 (0-0%) | 0-0 (0-0%) | 41-49 (12.7-15.1%) |
| Tapu Fini (specWall, Leftovers) | 189-222 (54.9-64.5%) | 84-100 (24.4-29.1%) | 136-161 (39.5-46.8%) | 0-0 (0-0%) |
| Corviknight (physWall, Leftovers) | 356-419 (89-104.8%) | 133-158 (33.3-39.5%) | 53-63 (13.3-15.8%) | 53-63 (13.3-15.8%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Thunder | Focus Punch | Mega Kick | Outrage |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 68-80 (19.3-22.7%) | 230-271 (65.3-77%) | 45-54 (12.8-15.3%) | 45-54 (12.8-15.3%) |
| Toxapex (physWall, Black Sludge) | 231-273 (76-89.8%) | 50-59 (16.4-19.4%) | 83-97 (27.3-31.9%) | 83-97 (27.3-31.9%) |
| Clodsire (specWall, Leftovers) | 0-0 (0-0%) | 144-170 (31-36.6%) | 232-273 (50-58.8%) | 232-273 (50-58.8%) |
| Dondozo (physWall, Leftovers) | 440-518 (87.3-102.8%) | 126-148 (25-29.4%) | 101-119 (20-23.6%) | 101-119 (20-23.6%) |
| Gliscor (physWall, Toxic Orb) | 0-0 (0-0%) | 59-70 (16.7-19.8%) | 94-113 (26.6-31.9%) | 94-113 (26.6-31.9%) |
| Ting-Lu (physWall, Leftovers) | 0-0 (0-0%) | 232-273 (43.4-51.1%) | 92-109 (17.2-20.4%) | 92-109 (17.2-20.4%) |
| Great Tusk (physWall, Leftovers) | 0-0 (0-0%) | 114-135 (26.3-31.1%) | 92-109 (21.2-25.1%) | 92-109 (21.2-25.1%) |
| Alomomola (physWall, Leftovers) | 578-681 (108.2-127.5%) | 159-188 (29.8-35.2%) | 128-150 (24-28.1%) | 128-150 (24-28.1%) |
| Slowking-Galar (specWall, Leftovers) | 105-124 (26.6-31.5%) | 57-67 (14.5-17%) | 184-218 (46.7-55.3%) | 184-218 (46.7-55.3%) |
| Heatran (specWall, Leftovers) | 107-127 (27.7-32.9%) | 366-431 (94.8-111.7%) | 72-85 (18.7-22%) | 72-85 (18.7-22%) |
| Zamazenta (physWall, Leftovers) | 137-162 (35.3-41.8%) | 126-148 (32.5-38.1%) | 101-119 (26-30.7%) | 101-119 (26-30.7%) |
| Dragonite (physWall, Leftovers) | 156-183 (40.4-47.4%) | 71-84 (18.4-21.8%) | 115-135 (29.8-35%) | 231-271 (59.8-70.2%) |
| Melmetal (physWall, Leftovers) | 219-258 (46.2-54.4%) | 215-254 (45.4-53.6%) | 42-50 (8.9-10.5%) | 42-50 (8.9-10.5%) |
| Gholdengo (specWall, Leftovers) | 119-140 (31.5-37%) | 0-0 (0-0%) | 0-0 (0-0%) | 80-94 (21.2-24.9%) |
| Landorus-Therian (physWall, Leftovers) | 0-0 (0-0%) | 74-87 (19.4-22.8%) | 119-140 (31.2-36.6%) | 119-140 (31.2-36.6%) |
| Garchomp (physWall, Leftovers) | 0-0 (0-0%) | 143-169 (34-40.2%) | 115-135 (27.4-32.1%) | 231-271 (55-64.5%) |
| Tyranitar-Mega (specWall, no item) | 100-117 (24.8-29%) | 543-639 (134.4-158.2%) | 54-63 (13.4-15.6%) | 109-127 (27-31.4%) |
| Chesnaught-Mega (physWall, no item) | 68-80 (17.9-21.1%) | 93-110 (24.5-28.9%) | 75-88 (19.7-23.2%) | 75-88 (19.7-23.2%) |
| Kingambit (physWall, Leftovers) | 178-209 (44.1-51.7%) | 491-578 (121.5-143.1%) | 49-57 (12.1-14.1%) | 49-57 (12.1-14.1%) |
| Toxapex (specWall, Leftovers) | 176-209 (57.9-68.8%) | 66-78 (21.7-25.7%) | 107-126 (35.2-41.4%) | 107-126 (35.2-41.4%) |

---

### Aerodactyl-Mega

_Flagged for: Speed **438** — in OU's top quarter (≥350); Attack 405 — above OU's median (372); BST 615 — above OU's median (600); strong setup on a frame fast enough to use it; ability: Tough Claws; hazards + real offence._

**Aerodactyl-Mega** — forme, **UU**, source: imported (natdex)
  Rock/Flying | BST 615 (80/135/85/70/95/150) | Abilities: Tough Claws
  Engine stats @252 (neutral/positive): Tough Claws: Atk 369/405, SpA 239/262, Spe 399/438
  Item: **forced — Aerodactylite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Fire Fire Blast 120S, Dragon Dragon Pulse 90S, Ground Earth Power 90S, Normal Razor Wind 80 (charge)S **[power — two-turn — it charges first (the profiler tags it `(charge)`)]**, Ghost Ominous Wind 60S
  Setup: Agility, Dragon Dance, Hone Claws, Rock Polish
  Reliable recovery: Rest, Roost
  Hazards: Stealth Rock
  Removal: Defog
  Phazing: Roar, Whirlwind
  Status: Toxic
  Weather/terrain: Rain Dance, Sandstorm, Sunny Day
  Utility: Detect, Protect, Reflect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

Attacker: **Aerodactyl-Mega**, jolly {"atk":252,"spe":252,"hp":4}, **Aerodactylite (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Stone Edge | Sky Attack | Double-Edge | Earthquake |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 708-833 (99.2-116.7%) | 990-1165 (138.7-163.2%) | 735-865 (102.9-121.1%) | 472-555 (66.1-77.7%) |
| Chansey (specWall, Eviolite) | 575-676 (81.7-96%) | 804-946 (114.2-134.4%) | 597-702 (84.8-99.7%) | 383-451 (54.4-64.1%) |
| Clefable (specWall, Leftovers) | 219-258 (55.6-65.5%) | 306-360 (77.7-91.4%) | 227-267 (57.6-67.8%) | 146-172 (37.1-43.7%) |
| Slowbro (physWall, Leftovers) | 115-135 (29.2-34.3%) | 160-188 (40.6-47.7%) | 119-140 (30.2-35.5%) | 76-90 (19.3-22.8%) |
| Slowbro-Mega (physWall, no item) | 80-95 (20.3-24.1%) | 112-132 (28.4-33.5%) | 83-97 (21.1-24.6%) | 53-63 (13.5-16%) |
| Slowking (specWall, Leftovers) | 204-240 (51.8-60.9%) | 284-335 (72.1-85%) | 211-248 (53.6-62.9%) | 136-160 (34.5-40.6%) |
| Skarmory (physWall, Leftovers) | 97-114 (29-34.1%) | 67-79 (20.1-23.7%) | 50-59 (15-17.7%) | 0-0 (0-0%) |
| Skarmory-Mega (physWall, no item) | 115-135 (34.4-40.4%) | 80-94 (24-28.1%) | 59-70 (17.7-21%) | 0-0 (0-0%) |
| Celesteela (physWall, Leftovers) | 120-141 (30.2-35.4%) | 83-98 (20.9-24.6%) | 62-73 (15.6-18.3%) | 0-0 (0-0%) |
| Hippowdon (physWall, Leftovers) | 54-64 (12.9-15.2%) | 152-179 (36.2-42.6%) | 113-133 (26.9-31.7%) | 73-86 (17.4-20.5%) |
| Amoonguss (specWall, Black Sludge) | 227-267 (52.5-61.8%) | 633-745 (146.5-172.5%) | 235-276 (54.4-63.9%) | 151-178 (35-41.2%) |
| Goodra-Hisui (specWall, Leftovers) | 85-100 (23.4-27.5%) | 118-139 (32.4-38.2%) | 87-103 (23.9-28.3%) | 226-266 (62.1-73.1%) |
| Rotom-Wash (physWall, Leftovers) | 117-138 (38.5-45.4%) | 81-96 (26.6-31.6%) | 121-142 (39.8-46.7%) | 156-184 (51.3-60.5%) |
| Swampert (physWall, Leftovers) | 65-77 (16.1-19.1%) | 183-215 (45.3-53.2%) | 136-160 (33.7-39.6%) | 87-103 (21.5-25.5%) |
| Tyranitar (specWall, Leftovers) | 156-184 (38.6-45.5%) | 109-128 (27-31.7%) | 81-95 (20-23.5%) | 209-246 (51.7-60.9%) |
| Scizor (physWall, Leftovers) | 123-144 (35.8-41.9%) | 171-201 (49.7-58.4%) | 63-74 (18.3-21.5%) | 82-96 (23.8-27.9%) |
| Buzzwole (physWall, Leftovers) | 98-115 (23.4-27.5%) | 544-640 (130.1-153.1%) | 100-118 (23.9-28.2%) | 32-38 (7.7-9.1%) |
| Aegislash (physWall, Leftovers) | 46-54 (14.2-16.7%) | 64-75 (19.8-23.1%) | 0-0 (0-0%) | 123-145 (38-44.8%) |
| Tapu Fini (specWall, Leftovers) | 151-177 (43.9-51.5%) | 210-247 (61-71.8%) | 156-183 (45.3-53.2%) | 100-118 (29.1-34.3%) |
| Corviknight (physWall, Leftovers) | 119-140 (29.8-35%) | 82-97 (20.5-24.3%) | 61-72 (15.3-18%) | 0-0 (0-0%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Stone Edge | Sky Attack | Double-Edge | Earthquake |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 51-60 (14.5-17%) | 141-166 (40.1-47.2%) | 52-61 (14.8-17.3%) | 68-80 (19.3-22.7%) |
| Toxapex (physWall, Black Sludge) | 91-107 (29.9-35.2%) | 127-149 (41.8-49%) | 94-111 (30.9-36.5%) | 122-143 (40.1-47%) |
| Clodsire (specWall, Leftovers) | 127-150 (27.4-32.3%) | 357-420 (76.9-90.5%) | 265-311 (57.1-67%) | 341-401 (73.5-86.4%) |
| Dondozo (physWall, Leftovers) | 112-131 (22.2-26%) | 155-183 (30.8-36.3%) | 115-135 (22.8-26.8%) | 74-87 (14.7-17.3%) |
| Gliscor (physWall, Toxic Orb) | 105-124 (29.7-35%) | 147-172 (41.5-48.6%) | 109-128 (30.8-36.2%) | 0-0 (0-0%) |
| Ting-Lu (physWall, Leftovers) | 51-60 (9.6-11.2%) | 142-168 (26.6-31.5%) | 106-124 (19.9-23.2%) | 68-80 (12.7-15%) |
| Great Tusk (physWall, Leftovers) | 25-30 (5.8-6.9%) | 283-333 (65.2-76.7%) | 105-123 (24.2-28.3%) | 68-80 (15.7-18.4%) |
| Alomomola (physWall, Leftovers) | 141-166 (26.4-31.1%) | 197-232 (36.9-43.4%) | 146-172 (27.3-32.2%) | 94-111 (17.6-20.8%) |
| Slowking-Galar (specWall, Leftovers) | 204-240 (51.8-60.9%) | 284-335 (72.1-85%) | 211-248 (53.6-62.9%) | 272-320 (69-81.2%) |
| Heatran (specWall, Leftovers) | 161-190 (41.7-49.2%) | 112-132 (29-34.2%) | 83-98 (21.5-25.4%) | 431-507 (111.7-131.3%) |
| Zamazenta (physWall, Leftovers) | 56-65 (14.4-16.8%) | 311-366 (80.2-94.3%) | 115-135 (29.6-34.8%) | 74-87 (19.1-22.4%) |
| Dragonite (physWall, Leftovers) | 254-299 (65.8-77.5%) | 177-208 (45.9-53.9%) | 131-154 (33.9-39.9%) | 0-0 (0-0%) |
| Melmetal (physWall, Leftovers) | 47-56 (9.9-11.8%) | 66-78 (13.9-16.5%) | 49-58 (10.3-12.2%) | 127-150 (26.8-31.6%) |
| Gholdengo (specWall, Leftovers) | 88-104 (23.3-27.5%) | 123-145 (32.5-38.4%) | 0-0 (0-0%) | 236-278 (62.4-73.5%) |
| Landorus-Therian (physWall, Leftovers) | 131-154 (34.3-40.3%) | 183-215 (47.9-56.3%) | 136-160 (35.6-41.9%) | 0-0 (0-0%) |
| Garchomp (physWall, Leftovers) | 63-74 (15-17.6%) | 177-208 (42.1-49.5%) | 131-154 (31.2-36.7%) | 84-99 (20-23.6%) |
| Tyranitar-Mega (specWall, no item) | 120-141 (29.7-34.9%) | 83-98 (20.5-24.3%) | 62-72 (15.3-17.8%) | 160-188 (39.6-46.5%) |
| Chesnaught-Mega (physWall, no item) | 41-49 (10.8-12.9%) | 464-546 (122.1-143.7%) | 86-101 (22.6-26.6%) | 27-32 (7.1-8.4%) |
| Kingambit (physWall, Leftovers) | 54-63 (13.4-15.6%) | 75-88 (18.6-21.8%) | 56-65 (13.9-16.1%) | 145-170 (35.9-42.1%) |
| Toxapex (specWall, Leftovers) | 118-139 (38.8-45.7%) | 165-194 (54.3-63.8%) | 122-144 (40.1-47.4%) | 158-186 (52-61.2%) |

---

### Heracross-Mega

_Flagged for: Attack **515** — in OU's top quarter (≥416); BST 600 — above OU's median (600); setup + priority + reliable recovery; ability: Skill Link; hazards + real offence; reliable recovery on a bulky frame._

**Heracross-Mega** — forme, **UU**, source: imported (natdex)
  Bug/Fighting | BST 600 (80/185/115/40/105/75) | Abilities: Skill Link
  Engine stats @252 (neutral/positive): Skill Link: Atk 469/515, SpA 179/196, Spe 249/273
  Item: **forced — Heracronite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Bug Megahorn 120P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**, Grass Bullet Seed 25x2-5P, Ghost Shadow Claw 70P
  Special coverage: Normal Tera Blast 80S, Poison Venoshock 65S
  Setup: Bulk Up, Harden, Iron Defense, Swords Dance, Work Up
  Reliable recovery: Rest
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Vacuum Wave 40S Fighting (+1)
  Hazards: Spikes
  Status: Toxic
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute
  Notable: Knock Off, Substitute, Focus Punch

Attacker: **Heracross-Mega**, adamant {"atk":252,"spe":252,"hp":4}, **Heracronite (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Megahorn | Focus Punch | Double-Edge | Earthquake |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 1184-1393 (165.8-195.1%) | 2959-3482 (414.4-487.7%) | 789-929 (110.5-130.1%) | 658-774 (92.2-108.4%) |
| Chansey (specWall, Eviolite) | 961-1131 (136.5-160.7%) | 2403-2827 (341.3-401.6%) | 641-754 (91.1-107.1%) | 534-628 (75.9-89.2%) |
| Clefable (specWall, Leftovers) | 183-215 (46.4-54.6%) | 228-268 (57.9-68%) | 244-287 (61.9-72.8%) | 203-239 (51.5-60.7%) |
| Slowbro (physWall, Leftovers) | 383-450 (97.2-114.2%) | 119-140 (30.2-35.5%) | 127-150 (32.2-38.1%) | 106-125 (26.9-31.7%) |
| Slowbro-Mega (physWall, no item) | 267-315 (67.8-79.9%) | 83-98 (21.1-24.9%) | 89-105 (22.6-26.6%) | 74-87 (18.8-22.1%) |
| Slowking (specWall, Leftovers) | 680-800 (172.6-203%) | 212-249 (53.8-63.2%) | 226-266 (57.4-67.5%) | 189-222 (48-56.3%) |
| Skarmory (physWall, Leftovers) | 40-47 (12-14.1%) | 201-236 (60.2-70.7%) | 53-63 (15.9-18.9%) | 0-0 (0-0%) |
| Skarmory-Mega (physWall, no item) | 47-56 (14.1-16.8%) | 238-281 (71.3-84.1%) | 63-75 (18.9-22.5%) | 0-0 (0-0%) |
| Celesteela (physWall, Leftovers) | 50-58 (12.6-14.6%) | 249-293 (62.6-73.6%) | 66-78 (16.6-19.6%) | 0-0 (0-0%) |
| Hippowdon (physWall, Leftovers) | 182-214 (43.3-51%) | 227-267 (54-63.6%) | 121-143 (28.8-34%) | 101-119 (24-28.3%) |
| Amoonguss (specWall, Black Sludge) | 378-445 (87.5-103%) | 236-278 (54.6-64.4%) | 252-296 (58.3-68.5%) | 210-247 (48.6-57.2%) |
| Goodra-Hisui (specWall, Leftovers) | 141-166 (38.7-45.6%) | 706-830 (194-228%) | 94-110 (25.8-30.2%) | 315-370 (86.5-101.6%) |
| Rotom-Wash (physWall, Leftovers) | 194-229 (63.8-75.3%) | 243-285 (79.9-93.8%) | 129-152 (42.4-50%) | 217-255 (71.4-83.9%) |
| Swampert (physWall, Leftovers) | 218-257 (54-63.6%) | 272-321 (67.3-79.5%) | 145-171 (35.9-42.3%) | 121-143 (30-35.4%) |
| Tyranitar (specWall, Leftovers) | 522-614 (129.2-152%) | 1302-1532 (322.3-379.2%) | 87-102 (21.5-25.2%) | 290-341 (71.8-84.4%) |
| Scizor (physWall, Leftovers) | 102-120 (29.7-34.9%) | 254-299 (73.8-86.9%) | 68-80 (19.8-23.3%) | 113-133 (32.8-38.7%) |
| Buzzwole (physWall, Leftovers) | 81-95 (19.4-22.7%) | 101-119 (24.2-28.5%) | 108-127 (25.8-30.4%) | 45-53 (10.8-12.7%) |
| Aegislash (physWall, Leftovers) | 38-45 (11.7-13.9%) | 0-0 (0-0%) | 0-0 (0-0%) | 171-201 (52.8-62%) |
| Tapu Fini (specWall, Leftovers) | 125-147 (36.3-42.7%) | 156-184 (45.3-53.5%) | 167-197 (48.5-57.3%) | 139-164 (40.4-47.7%) |
| Corviknight (physWall, Leftovers) | 49-58 (12.3-14.5%) | 246-290 (61.5-72.5%) | 65-77 (16.3-19.3%) | 0-0 (0-0%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Megahorn | Focus Punch | Double-Edge | Earthquake |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 169-199 (48-56.5%) | 421-496 (119.6-140.9%) | 56-66 (15.9-18.8%) | 94-110 (26.7-31.3%) |
| Toxapex (physWall, Black Sludge) | 75-89 (24.7-29.3%) | 94-111 (30.9-36.5%) | 101-119 (33.2-39.1%) | 169-199 (55.6-65.5%) |
| Clodsire (specWall, Leftovers) | 213-251 (45.9-54.1%) | 266-313 (57.3-67.5%) | 284-334 (61.2-72%) | 474-558 (102.2-120.3%) |
| Dondozo (physWall, Leftovers) | 185-218 (36.7-43.3%) | 231-272 (45.8-54%) | 123-145 (24.4-28.8%) | 103-121 (20.4-24%) |
| Gliscor (physWall, Toxic Orb) | 87-103 (24.6-29.1%) | 109-128 (30.8-36.2%) | 116-137 (32.8-38.7%) | 0-0 (0-0%) |
| Ting-Lu (physWall, Leftovers) | 341-401 (63.9-75.1%) | 425-500 (79.6-93.6%) | 113-133 (21.2-24.9%) | 95-111 (17.8-20.8%) |
| Great Tusk (physWall, Leftovers) | 84-99 (19.4-22.8%) | 210-248 (48.4-57.1%) | 112-132 (25.8-30.4%) | 94-110 (21.7-25.3%) |
| Alomomola (physWall, Leftovers) | 235-277 (44-51.9%) | 293-345 (54.9-64.6%) | 157-184 (29.4-34.5%) | 131-154 (24.5-28.8%) |
| Slowking-Galar (specWall, Leftovers) | 340-400 (86.3-101.5%) | 106-124 (26.9-31.5%) | 226-266 (57.4-67.5%) | 378-445 (95.9-112.9%) |
| Heatran (specWall, Leftovers) | 67-79 (17.4-20.5%) | 672-790 (174.1-204.7%) | 89-105 (23.1-27.2%) | 599-705 (155.2-182.6%) |
| Zamazenta (physWall, Leftovers) | 92-109 (23.7-28.1%) | 231-272 (59.5-70.1%) | 123-145 (31.7-37.4%) | 103-121 (26.5-31.2%) |
| Dragonite (physWall, Leftovers) | 105-124 (27.2-32.1%) | 131-155 (33.9-40.2%) | 140-165 (36.3-42.7%) | 0-0 (0-0%) |
| Melmetal (physWall, Leftovers) | 79-93 (16.7-19.6%) | 396-466 (83.5-98.3%) | 53-62 (11.2-13.1%) | 177-208 (37.3-43.9%) |
| Gholdengo (specWall, Leftovers) | 73-86 (19.3-22.8%) | 0-0 (0-0%) | 0-0 (0-0%) | 328-386 (86.8-102.1%) |
| Landorus-Therian (physWall, Leftovers) | 109-128 (28.5-33.5%) | 136-160 (35.6-41.9%) | 145-171 (38-44.8%) | 0-0 (0-0%) |
| Garchomp (physWall, Leftovers) | 211-248 (50.2-59%) | 263-310 (62.6-73.8%) | 140-165 (33.3-39.3%) | 117-138 (27.9-32.9%) |
| Tyranitar-Mega (specWall, no item) | 399-469 (98.8-116.1%) | 995-1170 (246.3-289.6%) | 66-78 (16.3-19.3%) | 222-261 (55-64.6%) |
| Chesnaught-Mega (physWall, no item) | 138-162 (36.3-42.6%) | 172-202 (45.3-53.2%) | 92-108 (24.2-28.4%) | 38-45 (10-11.8%) |
| Kingambit (physWall, Leftovers) | 180-212 (44.6-52.5%) | 899-1058 (222.5-261.9%) | 60-70 (14.9-17.3%) | 201-236 (49.8-58.4%) |
| Toxapex (specWall, Leftovers) | 98-116 (32.2-38.2%) | 122-144 (40.1-47.4%) | 131-154 (43.1-50.7%) | 219-258 (72-84.9%) |

---

### Blacephalon

_Flagged for: Special Attack **441** — in OU's top quarter (≥401); Attack 388 — above OU's median (372); Speed 344 — above OU's median (322); strong setup on a frame fast enough to use it; ability: Beast Boost._

**Blacephalon** — species, **UU**, source: imported (natdex)
  Fire/Ghost | BST 570 (53/127/53/151/79/107) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 353/388, SpA 401/441, Spe 313/344
  Item: **free**
  STAB: Fire Mind Blown 150S · Ghost Shadow Ball 80S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Rock Rock Blast 25x2-5P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Psychic 90S, Normal Uproar 90S, Dark Dark Pulse 80S
  Setup: Calm Mind
  Reliable recovery: Rest
  Status: Hypnosis, Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Encore, Knock Off, Light Screen, Magic Coat, Pain Split, Protect, Substitute, Taunt, Trick
  Notable: Knock Off, Trick, Encore, Taunt, Substitute

Attacker: **Blacephalon**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Mind Blown | Shadow Ball | Solar Beam | Psychic |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 209-247 (29.3-34.6%) | 0-0 (0-0%) | 111-131 (15.5-18.3%) | 84-98 (11.8-13.7%) |
| Chansey (specWall, Eviolite) | 167-197 (23.7-28%) | 0-0 (0-0%) | 89-105 (12.6-14.9%) | 67-79 (9.5-11.2%) |
| Clefable (specWall, Leftovers) | 276-325 (70.1-82.5%) | 148-175 (37.6-44.4%) | 146-174 (37.1-44.2%) | 110-131 (27.9-33.2%) |
| Slowbro (physWall, Leftovers) | 214-252 (54.3-64%) | 461-543 (117-137.8%) | 458-540 (116.2-137.1%) | 85-101 (21.6-25.6%) |
| Slowbro-Mega (physWall, no item) | 214-252 (54.3-64%) | 461-543 (117-137.8%) | 458-540 (116.2-137.1%) | 85-101 (21.6-25.6%) |
| Slowking (specWall, Leftovers) | 120-141 (30.5-35.8%) | 261-306 (66.2-77.7%) | 258-304 (65.5-77.2%) | 48-57 (12.2-14.5%) |
| Skarmory (physWall, Leftovers) | 958-1127 (286.8-337.4%) | 256-301 (76.6-90.1%) | 63-74 (18.9-22.2%) | 96-113 (28.7-33.8%) |
| Skarmory-Mega (physWall, no item) | 716-842 (214.4-252.1%) | 192-226 (57.5-67.7%) | 46-55 (13.8-16.5%) | 71-84 (21.3-25.1%) |
| Celesteela (physWall, Leftovers) | 709-834 (178.1-209.5%) | 189-223 (47.5-56%) | 46-54 (11.6-13.6%) | 70-83 (17.6-20.9%) |
| Hippowdon (physWall, Leftovers) | 468-551 (111.4-131.2%) | 250-295 (59.5-70.2%) | 249-293 (59.3-69.8%) | 187-221 (44.5-52.6%) |
| Amoonguss (specWall, Black Sludge) | 595-700 (137.7-162%) | 159-188 (36.8-43.5%) | 39-46 (9-10.6%) | 239-282 (55.3-65.3%) |
| Goodra-Hisui (specWall, Leftovers) | 193-228 (53-62.6%) | 104-123 (28.6-33.8%) | 26-29 (7.1-8%) | 39-45 (10.7-12.4%) |
| Rotom-Wash (physWall, Leftovers) | 169-198 (55.6-65.1%) | 180-213 (59.2-70.1%) | 361-425 (118.8-139.8%) | 135-159 (44.4-52.3%) |
| Swampert (physWall, Leftovers) | 195-228 (48.3-56.4%) | 209-247 (51.7-61.1%) | 835-982 (206.7-243.1%) | 156-184 (38.6-45.5%) |
| Tyranitar (specWall, Leftovers) | 128-152 (31.7-37.6%) | 68-81 (16.8-20%) | 137-162 (33.9-40.1%) | 0-0 (0-0%) |
| Scizor (physWall, Leftovers) | 1721-2025 (500.3-588.7%) | 230-271 (66.9-78.8%) | 57-67 (16.6-19.5%) | 85-101 (24.7-29.4%) |
| Buzzwole (physWall, Leftovers) | 1185-1394 (283.5-333.5%) | 317-373 (75.8-89.2%) | 157-185 (37.6-44.3%) | 475-559 (113.6-133.7%) |
| Aegislash (physWall, Leftovers) | 504-594 (155.6-183.3%) | 271-319 (83.6-98.5%) | 66-79 (20.4-24.4%) | 50-59 (15.4-18.2%) |
| Tapu Fini (specWall, Leftovers) | 107-126 (31.1-36.6%) | 115-136 (33.4-39.5%) | 230-271 (66.9-78.8%) | 87-101 (25.3-29.4%) |
| Corviknight (physWall, Leftovers) | 819-963 (204.8-240.8%) | 219-258 (54.8-64.5%) | 54-63 (13.5-15.8%) | 81-96 (20.3-24%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Mind Blown | Shadow Ball | Solar Beam | Psychic |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 1262-1485 (358.5-421.9%) | 169-198 (48-56.3%) | 41-49 (11.6-13.9%) | 62-74 (17.6-21%) |
| Toxapex (physWall, Black Sludge) | 131-154 (43.1-50.7%) | 141-167 (46.4-54.9%) | 141-166 (46.4-54.6%) | 213-250 (70.1-82.2%) |
| Clodsire (specWall, Leftovers) | 257-304 (55.4-65.5%) | 139-163 (30-35.1%) | 137-162 (29.5-34.9%) | 208-244 (44.8-52.6%) |
| Dondozo (physWall, Leftovers) | 253-297 (50.2-58.9%) | 271-319 (53.8-63.3%) | 542-637 (107.5-126.4%) | 202-239 (40.1-47.4%) |
| Gliscor (physWall, Toxic Orb) | 452-533 (127.7-150.6%) | 243-286 (68.6-80.8%) | 241-284 (68.1-80.2%) | 182-213 (51.4-60.2%) |
| Ting-Lu (physWall, Leftovers) | 322-379 (60.3-71%) | 85-101 (15.9-18.9%) | 344-405 (64.4-75.8%) | 0-0 (0-0%) |
| Great Tusk (physWall, Leftovers) | 592-696 (136.4-160.4%) | 317-373 (73-85.9%) | 633-744 (145.9-171.4%) | 475-559 (109.4-128.8%) |
| Alomomola (physWall, Leftovers) | 332-392 (62.2-73.4%) | 357-419 (66.9-78.5%) | 712-838 (133.3-156.9%) | 267-314 (50-58.8%) |
| Slowking-Galar (specWall, Leftovers) | 241-284 (61.2-72.1%) | 261-306 (66.2-77.7%) | 63-75 (16-19%) | 97-114 (24.6-28.9%) |
| Heatran (specWall, Leftovers) | 247-291 (64-75.4%) | 133-157 (34.5-40.7%) | 32-39 (8.3-10.1%) | 49-58 (12.7-15%) |
| Zamazenta (physWall, Leftovers) | 317-373 (81.7-96.1%) | 170-200 (43.8-51.5%) | 169-198 (43.6-51%) | 256-300 (66-77.3%) |
| Dragonite (physWall, Leftovers) | 178-210 (46.1-54.4%) | 192-226 (49.7-58.5%) | 46-55 (11.9-14.2%) | 143-169 (37-43.8%) |
| Melmetal (physWall, Leftovers) | 1015-1194 (214.1-251.9%) | 271-319 (57.2-67.3%) | 135-158 (28.5-33.3%) | 101-119 (21.3-25.1%) |
| Gholdengo (specWall, Leftovers) | 548-644 (145-170.4%) | 295-347 (78-91.8%) | 72-85 (19-22.5%) | 54-65 (14.3-17.2%) |
| Landorus-Therian (physWall, Leftovers) | 430-505 (112.6-132.2%) | 230-271 (60.2-70.9%) | 228-270 (59.7-70.7%) | 172-202 (45-52.9%) |
| Garchomp (physWall, Leftovers) | 204-240 (48.6-57.1%) | 219-258 (52.1-61.4%) | 218-257 (51.9-61.2%) | 163-193 (38.8-46%) |
| Tyranitar-Mega (specWall, no item) | 113-133 (28-32.9%) | 61-71 (15.1-17.6%) | 122-143 (30.2-35.4%) | 0-0 (0-0%) |
| Chesnaught-Mega (physWall, no item) | 635-747 (167.1-196.6%) | 170-200 (44.7-52.6%) | 84-98 (22.1-25.8%) | 256-300 (67.4-78.9%) |
| Kingambit (physWall, Leftovers) | 819-963 (202.7-238.4%) | 109-128 (27-31.7%) | 109-128 (27-31.7%) | 0-0 (0-0%) |
| Toxapex (specWall, Leftovers) | 100-118 (32.9-38.8%) | 109-128 (35.9-42.1%) | 107-127 (35.2-41.8%) | 162-192 (53.3-63.2%) |

---

### Gengar

_Flagged for: Speed **350** — in OU's top quarter (≥350); Special Attack 394 — above OU's median (328); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Levitate._

**Gengar** — species, **UU**, source: imported (natdex)
  Ghost/Poison | BST 500 (60/65/60/130/75/110) | Abilities: Cursed Body / Levitate
  Engine stats @252 (neutral/positive): Cursed Body: Atk 229/251, SpA 359/394, Spe 319/350 — Levitate: Atk 229/251, SpA 359/394, Spe 319/350
  Item: **free** — but its own Gengarite is **refused in UU** (it would make Gengar-Mega, Ubers)
  STAB: Ghost Shadow Ball 80S · Poison Sludge Wave 95S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Dark Foul Play 95P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Grass Energy Ball 90S, Normal Uproar 90S, Dark Dark Pulse 80S
  Setup: Nasty Plot
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch, Dream Eater, Giga Drain, Mega Drain
  Priority: Sucker Punch 80P Dark (+1)
  Hazards: Toxic Spikes
  Status: Hypnosis, Thunder Wave, Toxic, Will-O-Wisp
  Trapping moves: Mean Look
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Clear Smog, Destiny Bond, Disable, Encore, Haze, Knock Off, Pain Split, Perish Song, Protect, Substitute, Taunt, Trick, Trick Room
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Trick Room, Focus Punch

Attacker: **Gengar**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Shadow Ball | Sludge Wave | Focus Blast | Thunder |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 0-0 (0-0%) | 119-141 (16.7-19.7%) | 201-236 (28.2-33.1%) | 100-118 (14-16.5%) |
| Chansey (specWall, Eviolite) | 0-0 (0-0%) | 96-113 (13.6-16.1%) | 161-189 (22.9-26.8%) | 80-94 (11.4-13.4%) |
| Clefable (specWall, Leftovers) | 133-157 (33.8-39.8%) | 315-371 (79.9-94.2%) | 66-78 (16.8-19.8%) | 132-156 (33.5-39.6%) |
| Slowbro (physWall, Leftovers) | 413-487 (104.8-123.6%) | 244-288 (61.9-73.1%) | 102-120 (25.9-30.5%) | 412-484 (104.6-122.8%) |
| Slowbro-Mega (physWall, no item) | 413-487 (104.8-123.6%) | 244-288 (61.9-73.1%) | 102-120 (25.9-30.5%) | 412-484 (104.6-122.8%) |
| Slowking (specWall, Leftovers) | 234-275 (59.4-69.8%) | 137-162 (34.8-41.1%) | 57-67 (14.5-17%) | 232-273 (58.9-69.3%) |
| Skarmory (physWall, Leftovers) | 230-270 (68.9-80.8%) | 0-0 (0-0%) | 228-269 (68.3-80.5%) | 457-539 (136.8-161.4%) |
| Skarmory-Mega (physWall, no item) | 171-202 (51.2-60.5%) | 0-0 (0-0%) | 171-201 (51.2-60.2%) | 343-403 (102.7-120.7%) |
| Celesteela (physWall, Leftovers) | 170-201 (42.7-50.5%) | 0-0 (0-0%) | 169-200 (42.5-50.3%) | 339-400 (85.2-100.5%) |
| Hippowdon (physWall, Leftovers) | 224-265 (53.3-63.1%) | 132-156 (31.4-37.1%) | 223-263 (53.1-62.6%) | 0-0 (0-0%) |
| Amoonguss (specWall, Black Sludge) | 143-169 (33.1-39.1%) | 170-200 (39.4-46.3%) | 71-83 (16.4-19.2%) | 71-83 (16.4-19.2%) |
| Goodra-Hisui (specWall, Leftovers) | 93-110 (25.5-30.2%) | 0-0 (0-0%) | 185-219 (50.8-60.2%) | 45-54 (12.4-14.8%) |
| Rotom-Wash (physWall, Leftovers) | 162-191 (53.3-62.8%) | 192-226 (63.2-74.3%) | 161-189 (53-62.2%) | 161-189 (53-62.2%) |
| Swampert (physWall, Leftovers) | 187-221 (46.3-54.7%) | 110-130 (27.2-32.2%) | 187-219 (46.3-54.2%) | 0-0 (0-0%) |
| Tyranitar (specWall, Leftovers) | 62-72 (15.3-17.8%) | 72-87 (17.8-21.5%) | 495-583 (122.5-144.3%) | 123-145 (30.4-35.9%) |
| Scizor (physWall, Leftovers) | 206-243 (59.9-70.6%) | 0-0 (0-0%) | 205-241 (59.6-70.1%) | 205-241 (59.6-70.1%) |
| Buzzwole (physWall, Leftovers) | 284-334 (67.9-79.9%) | 336-396 (80.4-94.7%) | 141-166 (33.7-39.7%) | 283-332 (67.7-79.4%) |
| Aegislash (physWall, Leftovers) | 244-287 (75.3-88.6%) | 0-0 (0-0%) | 0-0 (0-0%) | 120-141 (37-43.5%) |
| Tapu Fini (specWall, Leftovers) | 104-122 (30.2-35.5%) | 247-291 (71.8-84.6%) | 50-59 (14.5-17.2%) | 206-243 (59.9-70.6%) |
| Corviknight (physWall, Leftovers) | 196-231 (49-57.8%) | 0-0 (0-0%) | 196-230 (49-57.5%) | 392-461 (98-115.3%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Shadow Ball | Sludge Wave | Focus Blast | Thunder |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 152-179 (43.2-50.9%) | 0-0 (0-0%) | 301-356 (85.5-101.1%) | 75-88 (21.3-25%) |
| Toxapex (physWall, Black Sludge) | 127-150 (41.8-49.3%) | 75-88 (24.7-28.9%) | 62-74 (20.4-24.3%) | 253-299 (83.2-98.4%) |
| Clodsire (specWall, Leftovers) | 124-146 (26.7-31.5%) | 36-42 (7.8-9.1%) | 61-72 (13.1-15.5%) | 0-0 (0-0%) |
| Dondozo (physWall, Leftovers) | 243-286 (48.2-56.7%) | 288-339 (57.1-67.3%) | 241-284 (47.8-56.3%) | 484-570 (96-113.1%) |
| Gliscor (physWall, Toxic Orb) | 217-256 (61.3-72.3%) | 128-152 (36.2-42.9%) | 107-127 (30.2-35.9%) | 0-0 (0-0%) |
| Ting-Lu (physWall, Leftovers) | 78-91 (14.6-17%) | 92-107 (17.2-20%) | 309-364 (57.9-68.2%) | 0-0 (0-0%) |
| Great Tusk (physWall, Leftovers) | 284-334 (65.4-77%) | 167-197 (38.5-45.4%) | 283-332 (65.2-76.5%) | 0-0 (0-0%) |
| Alomomola (physWall, Leftovers) | 319-377 (59.7-70.6%) | 379-447 (71-83.7%) | 318-375 (59.6-70.2%) | 638-751 (119.5-140.6%) |
| Slowking-Galar (specWall, Leftovers) | 234-275 (59.4-69.8%) | 68-80 (17.3-20.3%) | 28-33 (7.1-8.4%) | 115-136 (29.2-34.5%) |
| Heatran (specWall, Leftovers) | 119-140 (30.8-36.3%) | 0-0 (0-0%) | 237-279 (61.4-72.3%) | 118-139 (30.6-36%) |
| Zamazenta (physWall, Leftovers) | 153-180 (39.4-46.4%) | 180-213 (46.4-54.9%) | 152-179 (39.2-46.1%) | 152-179 (39.2-46.1%) |
| Dragonite (physWall, Leftovers) | 171-202 (44.3-52.3%) | 204-240 (52.8-62.2%) | 85-100 (22-25.9%) | 171-201 (44.3-52.1%) |
| Melmetal (physWall, Leftovers) | 243-286 (51.3-60.3%) | 0-0 (0-0%) | 484-570 (102.1-120.3%) | 241-284 (50.8-59.9%) |
| Gholdengo (specWall, Leftovers) | 265-312 (70.1-82.5%) | 0-0 (0-0%) | 0-0 (0-0%) | 131-154 (34.7-40.7%) |
| Landorus-Therian (physWall, Leftovers) | 206-243 (53.9-63.6%) | 122-144 (31.9-37.7%) | 102-120 (26.7-31.4%) | 0-0 (0-0%) |
| Garchomp (physWall, Leftovers) | 196-231 (46.7-55%) | 115-136 (27.4-32.4%) | 196-230 (46.7-54.8%) | 0-0 (0-0%) |
| Tyranitar-Mega (specWall, no item) | 54-65 (13.4-16.1%) | 65-76 (16.1-18.8%) | 438-516 (108.4-127.7%) | 109-128 (27-31.7%) |
| Chesnaught-Mega (physWall, no item) | 153-180 (40.3-47.4%) | 362-427 (95.3-112.4%) | 152-179 (40-47.1%) | 75-89 (19.7-23.4%) |
| Kingambit (physWall, Leftovers) | 97-115 (24-28.5%) | 0-0 (0-0%) | 785-923 (194.3-228.5%) | 196-230 (48.5-56.9%) |
| Toxapex (specWall, Leftovers) | 97-114 (31.9-37.5%) | 57-67 (18.8-22%) | 48-55 (15.8-18.1%) | 193-227 (63.5-74.7%) |

---

### Iron Boulder

_Flagged for: Speed **381** — in OU's top quarter (≥350); Attack 372 — above OU's median (372); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Quark Drive._

**Iron Boulder** — species, **UU**, source: imported (natdex)
  Rock/Psychic | BST 590 (90/120/80/68/108/124) | Abilities: Quark Drive
  Engine stats @252 (neutral/positive): Quark Drive: Atk 339/372, SpA 235/258, Spe 347/381
  Item: **free**
  STAB: Rock Stone Edge 100P · Psychic Zen Headbutt 80P
  Physical coverage: Grass Solar Blade 125 (charge)P, Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Ground Earthquake 100P, Electric Wild Charge 90P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S
  Setup: Agility, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Priority: Quick Attack 40P Normal (+1)
  Weather/terrain: Electric Terrain, Sandstorm
  Utility: Protect, Substitute, Taunt
  Notable: Taunt, Substitute

Attacker: **Iron Boulder**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Stone Edge | Zen Headbutt | Solar Blade | Close Combat |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 845-994 (118.3-139.2%) | 677-796 (94.8-111.5%) | 703-828 (98.5-116%) | 1352-1591 (189.4-222.8%) |
| Chansey (specWall, Eviolite) | 686-808 (97.4-114.8%) | 549-647 (78-91.9%) | 572-672 (81.3-95.5%) | 1098-1292 (156-183.5%) |
| Clefable (specWall, Leftovers) | 262-308 (66.5-78.2%) | 210-247 (53.3-62.7%) | 217-256 (55.1-65%) | 104-122 (26.4-31%) |
| Slowbro (physWall, Leftovers) | 137-162 (34.8-41.1%) | 54-65 (13.7-16.5%) | 228-269 (57.9-68.3%) | 54-63 (13.7-16%) |
| Slowbro-Mega (physWall, no item) | 96-113 (24.4-28.7%) | 39-45 (9.9-11.4%) | 159-188 (40.4-47.7%) | 37-44 (9.4-11.2%) |
| Slowking (specWall, Leftovers) | 243-286 (61.7-72.6%) | 97-114 (24.6-28.9%) | 405-477 (102.8-121.1%) | 96-114 (24.4-28.9%) |
| Skarmory (physWall, Leftovers) | 115-136 (34.4-40.7%) | 46-54 (13.8-16.2%) | 23-27 (6.9-8.1%) | 92-109 (27.5-32.6%) |
| Skarmory-Mega (physWall, no item) | 137-162 (41-48.5%) | 54-65 (16.2-19.5%) | 28-32 (8.4-9.6%) | 109-128 (32.6-38.3%) |
| Celesteela (physWall, Leftovers) | 143-169 (35.9-42.5%) | 57-67 (14.3-16.8%) | 29-35 (7.3-8.8%) | 114-135 (28.6-33.9%) |
| Hippowdon (physWall, Leftovers) | 65-76 (15.5-18.1%) | 105-123 (25-29.3%) | 107-127 (25.5-30.2%) | 104-122 (24.8-29%) |
| Amoonguss (specWall, Black Sludge) | 270-318 (62.5-73.6%) | 435-512 (100.7-118.5%) | 55-66 (12.7-15.3%) | 107-127 (24.8-29.4%) |
| Goodra-Hisui (specWall, Leftovers) | 101-118 (27.7-32.4%) | 80-94 (22-25.8%) | 41-49 (11.3-13.5%) | 323-380 (88.7-104.4%) |
| Rotom-Wash (physWall, Leftovers) | 140-165 (46.1-54.3%) | 111-132 (36.5-43.4%) | 232-273 (76.3-89.8%) | 111-131 (36.5-43.1%) |
| Swampert (physWall, Leftovers) | 78-92 (19.3-22.8%) | 126-148 (31.2-36.6%) | 522-614 (129.2-152%) | 124-146 (30.7-36.1%) |
| Tyranitar (specWall, Leftovers) | 187-219 (46.3-54.2%) | 0-0 (0-0%) | 154-183 (38.1-45.3%) | 598-703 (148-174%) |
| Scizor (physWall, Leftovers) | 146-172 (42.4-50%) | 58-68 (16.9-19.8%) | 29-35 (8.4-10.2%) | 117-137 (34-39.8%) |
| Buzzwole (physWall, Leftovers) | 117-137 (28-32.8%) | 188-222 (45-53.1%) | 48-55 (11.5-13.2%) | 45-54 (10.8-12.9%) |
| Aegislash (physWall, Leftovers) | 54-65 (16.7-20.1%) | 44-52 (13.6-16%) | 45-53 (13.9-16.4%) | 0-0 (0-0%) |
| Tapu Fini (specWall, Leftovers) | 180-211 (52.3-61.3%) | 144-170 (41.9-49.4%) | 299-352 (86.9-102.3%) | 71-84 (20.6-24.4%) |
| Corviknight (physWall, Leftovers) | 141-167 (35.3-41.8%) | 57-66 (14.3-16.5%) | 28-33 (7-8.3%) | 113-132 (28.3-33%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Stone Edge | Zen Headbutt | Solar Blade | Close Combat |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 61-71 (17.3-20.2%) | 48-57 (13.6-16.2%) | 24-28 (6.8-8%) | 193-228 (54.8-64.8%) |
| Toxapex (physWall, Black Sludge) | 109-128 (35.9-42.1%) | 176-208 (57.9-68.4%) | 89-106 (29.3-34.9%) | 42-50 (13.8-16.4%) |
| Clodsire (specWall, Leftovers) | 152-179 (32.8-38.6%) | 490-577 (105.6-124.4%) | 253-299 (54.5-64.4%) | 120-143 (25.9-30.8%) |
| Dondozo (physWall, Leftovers) | 133-157 (26.4-31.2%) | 107-126 (21.2-25%) | 222-261 (44-51.8%) | 106-124 (21-24.6%) |
| Gliscor (physWall, Toxic Orb) | 126-148 (35.6-41.8%) | 101-119 (28.5-33.6%) | 104-122 (29.4-34.5%) | 49-58 (13.8-16.4%) |
| Ting-Lu (physWall, Leftovers) | 61-71 (11.4-13.3%) | 0-0 (0-0%) | 202-239 (37.8-44.8%) | 195-230 (36.5-43.1%) |
| Great Tusk (physWall, Leftovers) | 29-35 (6.7-8.1%) | 196-231 (45.2-53.2%) | 201-237 (46.3-54.6%) | 96-114 (22.1-26.3%) |
| Alomomola (physWall, Leftovers) | 169-198 (31.6-37.1%) | 135-159 (25.3-29.8%) | 280-330 (52.4-61.8%) | 133-158 (24.9-29.6%) |
| Slowking-Galar (specWall, Leftovers) | 243-286 (61.7-72.6%) | 195-230 (49.5-58.4%) | 101-118 (25.6-29.9%) | 48-57 (12.2-14.5%) |
| Heatran (specWall, Leftovers) | 192-227 (49.7-58.8%) | 76-91 (19.7-23.6%) | 39-46 (10.1-11.9%) | 308-362 (79.8-93.8%) |
| Zamazenta (physWall, Leftovers) | 66-78 (17-20.1%) | 215-253 (55.4-65.2%) | 110-130 (28.4-33.5%) | 106-124 (27.3-32%) |
| Dragonite (physWall, Leftovers) | 304-357 (78.8-92.5%) | 122-143 (31.6-37%) | 31-36 (8-9.3%) | 59-70 (15.3-18.1%) |
| Melmetal (physWall, Leftovers) | 57-66 (12-13.9%) | 45-53 (9.5-11.2%) | 46-55 (9.7-11.6%) | 182-214 (38.4-45.1%) |
| Gholdengo (specWall, Leftovers) | 105-124 (27.8-32.8%) | 84-100 (22.2-26.5%) | 87-102 (23-27%) | 0-0 (0-0%) |
| Landorus-Therian (physWall, Leftovers) | 157-184 (41.1-48.2%) | 126-148 (33-38.7%) | 130-153 (34-40.1%) | 62-72 (16.2-18.8%) |
| Garchomp (physWall, Leftovers) | 75-88 (17.9-21%) | 122-143 (29-34%) | 126-148 (30-35.2%) | 120-141 (28.6-33.6%) |
| Tyranitar-Mega (specWall, no item) | 143-169 (35.4-41.8%) | 0-0 (0-0%) | 118-139 (29.2-34.4%) | 457-538 (113.1-133.2%) |
| Chesnaught-Mega (physWall, no item) | 49-58 (12.9-15.3%) | 161-189 (42.4-49.7%) | 40-48 (10.5-12.6%) | 79-93 (20.8-24.5%) |
| Kingambit (physWall, Leftovers) | 65-75 (16.1-18.6%) | 0-0 (0-0%) | 53-62 (13.1-15.3%) | 414-487 (102.5-120.5%) |
| Toxapex (specWall, Leftovers) | 141-166 (46.4-54.6%) | 227-269 (74.7-88.5%) | 117-137 (38.5-45.1%) | 55-66 (18.1-21.7%) |

---

### Lilligant-Hisui

_Flagged for: Attack **508** — in OU's top quarter (≥416); Speed 339 — above OU's median (322); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Hustle._

**Lilligant-Hisui** — species, **UU**, source: imported (natdex)
  Grass/Fighting | BST 480 (70/105/75/50/75/105) | Abilities: Chlorophyll / Hustle / Leaf Guard
  Engine stats @252 (neutral/positive): Chlorophyll: Atk 309/339, SpA 199/218, Spe 309/339 — Hustle: Atk 463/508, SpA 199/218, Spe 309/339 — Leaf Guard: Atk 309/339, SpA 199/218, Spe 309/339
  Item: **free**
  STAB: Grass Solar Blade 125 (charge)P · Fighting Axe Kick 120P
  Physical coverage: Normal Mega Kick 120P, Flying Acrobatics 110P, Ice Ice Spinner 80P, Poison Poison Jab 80P
  Special coverage: Flying Hurricane 120S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Bug Pollen Puff 90S, Fairy Alluring Voice 80S, Normal Tera Blast 80S
  Setup: Growth, Quiver Dance, Swords Dance, Victory Dance
  Reliable recovery: Rest
  Drain/Rest-only: Absorb, Dream Eater, Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]**, Upper Hand 65P Fighting (+3), Vacuum Wave 40S Fighting (+1)
  Removal: Defog
  Status: Grass Whistle, Sleep Powder, Stun Spore, Toxic
  Cleric: Aromatherapy, Heal Bell
  Weather/terrain: Grassy Terrain, Rain Dance, Sunny Day
  Utility: Encore, Healing Wish, Leech Seed, Light Screen, Protect, Safeguard, Substitute
  Notable: Encore, Substitute

Attacker: **Lilligant-Hisui**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Solar Blade | Axe Kick | Mega Kick | Acrobatics |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 963-1133 (134.9-158.7%) | 1849-2176 (259-304.8%) | 616-725 (86.3-101.5%) | 283-332 (39.6-46.5%) |
| Chansey (specWall, Eviolite) | 782-920 (111.1-130.7%) | 1502-1768 (213.4-251.1%) | 500-588 (71-83.5%) | 230-270 (32.7-38.4%) |
| Clefable (specWall, Leftovers) | 297-351 (75.4-89.1%) | 143-167 (36.3-42.4%) | 191-224 (48.5-56.9%) | 88-104 (22.3-26.4%) |
| Slowbro (physWall, Leftovers) | 313-369 (79.4-93.7%) | 75-88 (19-22.3%) | 100-117 (25.4-29.7%) | 46-54 (11.7-13.7%) |
| Slowbro-Mega (physWall, no item) | 219-258 (55.6-65.5%) | 52-61 (13.2-15.5%) | 70-81 (17.8-20.6%) | 32-39 (8.1-9.9%) |
| Slowking (specWall, Leftovers) | 555-652 (140.9-165.5%) | 132-156 (33.5-39.6%) | 176-208 (44.7-52.8%) | 81-96 (20.6-24.4%) |
| Skarmory (physWall, Leftovers) | 32-37 (9.6-11.1%) | 127-149 (38-44.6%) | 41-49 (12.3-14.7%) | 19-23 (5.7-6.9%) |
| Skarmory-Mega (physWall, no item) | 39-45 (11.7-13.5%) | 150-176 (44.9-52.7%) | 49-58 (14.7-17.4%) | 23-27 (6.9-8.1%) |
| Celesteela (physWall, Leftovers) | 40-48 (10.1-12.1%) | 157-184 (39.4-46.2%) | 52-61 (13.1-15.3%) | 23-28 (5.8-7%) |
| Hippowdon (physWall, Leftovers) | 148-175 (35.2-41.7%) | 143-167 (34-39.8%) | 94-111 (22.4-26.4%) | 44-52 (10.5-12.4%) |
| Amoonguss (specWall, Black Sludge) | 76-89 (17.6-20.6%) | 148-174 (34.3-40.3%) | 197-231 (45.6-53.5%) | 183-215 (42.4-49.8%) |
| Goodra-Hisui (specWall, Leftovers) | 57-67 (15.7-18.4%) | 443-521 (121.7-143.1%) | 72-85 (19.8-23.4%) | 33-40 (9.1-11%) |
| Rotom-Wash (physWall, Leftovers) | 318-374 (104.6-123%) | 152-179 (50-58.9%) | 101-119 (33.2-39.1%) | 23-27 (7.6-8.9%) |
| Swampert (physWall, Leftovers) | 715-842 (177-208.4%) | 171-201 (42.3-49.8%) | 114-133 (28.2-32.9%) | 53-62 (13.1-15.3%) |
| Tyranitar (specWall, Leftovers) | 213-250 (52.7-61.9%) | 819-964 (202.7-238.6%) | 67-79 (16.6-19.6%) | 31-36 (7.7-8.9%) |
| Scizor (physWall, Leftovers) | 41-48 (11.9-14%) | 159-188 (46.2-54.7%) | 53-62 (15.4-18%) | 49-58 (14.2-16.9%) |
| Buzzwole (physWall, Leftovers) | 66-78 (15.8-18.7%) | 63-74 (15.1-17.7%) | 84-100 (20.1-23.9%) | 161-188 (38.5-45%) |
| Aegislash (physWall, Leftovers) | 62-74 (19.1-22.8%) | 0-0 (0-0%) | 0-0 (0-0%) | 18-22 (5.6-6.8%) |
| Tapu Fini (specWall, Leftovers) | 410-482 (119.2-140.1%) | 97-115 (28.2-33.4%) | 131-154 (38.1-44.8%) | 61-71 (17.7-20.6%) |
| Corviknight (physWall, Leftovers) | 40-46 (10-11.5%) | 154-182 (38.5-45.5%) | 50-59 (12.5-14.8%) | 23-28 (5.8-7%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Solar Blade | Axe Kick | Mega Kick | Acrobatics |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 33-40 (9.4-11.4%) | 266-313 (75.6-88.9%) | 44-52 (12.5-14.8%) | 41-48 (11.6-13.6%) |
| Toxapex (physWall, Black Sludge) | 123-145 (40.5-47.7%) | 59-70 (19.4-23%) | 79-93 (26-30.6%) | 37-44 (12.2-14.5%) |
| Clodsire (specWall, Leftovers) | 347-408 (74.8-87.9%) | 166-196 (35.8-42.2%) | 222-261 (47.8-56.3%) | 102-120 (22-25.9%) |
| Dondozo (physWall, Leftovers) | 304-357 (60.3-70.8%) | 145-171 (28.8-33.9%) | 97-114 (19.2-22.6%) | 45-53 (8.9-10.5%) |
| Gliscor (physWall, Toxic Orb) | 143-169 (40.4-47.7%) | 68-80 (19.2-22.6%) | 91-107 (25.7-30.2%) | 42-50 (11.9-14.1%) |
| Ting-Lu (physWall, Leftovers) | 279-328 (52.2-61.4%) | 267-315 (50-59%) | 88-105 (16.5-19.7%) | 41-49 (7.7-9.2%) |
| Great Tusk (physWall, Leftovers) | 276-326 (63.6-75.1%) | 132-156 (30.4-35.9%) | 88-104 (20.3-24%) | 83-97 (19.1-22.4%) |
| Alomomola (physWall, Leftovers) | 384-452 (71.9-84.6%) | 184-217 (34.5-40.6%) | 122-144 (22.8-27%) | 57-67 (10.7-12.5%) |
| Slowking-Galar (specWall, Leftovers) | 137-162 (34.8-41.1%) | 66-78 (16.8-19.8%) | 176-208 (44.7-52.8%) | 81-96 (20.6-24.4%) |
| Heatran (specWall, Leftovers) | 54-63 (14-16.3%) | 422-496 (109.3-128.5%) | 70-81 (18.1-21%) | 32-37 (8.3-9.6%) |
| Zamazenta (physWall, Leftovers) | 152-178 (39.2-45.9%) | 145-171 (37.4-44.1%) | 97-114 (25-29.4%) | 91-107 (23.5-27.6%) |
| Dragonite (physWall, Leftovers) | 42-50 (10.9-13%) | 81-97 (21-25.1%) | 110-130 (28.5-33.7%) | 50-61 (13-15.8%) |
| Melmetal (physWall, Leftovers) | 65-76 (13.7-16%) | 249-293 (52.5-61.8%) | 41-48 (8.6-10.1%) | 19-22 (4-4.6%) |
| Gholdengo (specWall, Leftovers) | 119-141 (31.5-37.3%) | 0-0 (0-0%) | 0-0 (0-0%) | 35-41 (9.3-10.8%) |
| Landorus-Therian (physWall, Leftovers) | 178-210 (46.6-55%) | 85-100 (22.3-26.2%) | 114-133 (29.8-34.8%) | 53-62 (13.9-16.2%) |
| Garchomp (physWall, Leftovers) | 172-202 (41-48.1%) | 165-195 (39.3-46.4%) | 110-130 (26.2-31%) | 50-61 (11.9-14.5%) |
| Tyranitar-Mega (specWall, no item) | 162-191 (40.1-47.3%) | 626-738 (155-182.7%) | 52-61 (12.9-15.1%) | 23-28 (5.7-6.9%) |
| Chesnaught-Mega (physWall, no item) | 55-66 (14.5-17.4%) | 109-127 (28.7-33.4%) | 72-84 (18.9-22.1%) | 137-162 (36.1-42.6%) |
| Kingambit (physWall, Leftovers) | 72-85 (17.8-21%) | 568-668 (140.6-165.3%) | 46-54 (11.4-13.4%) | 22-26 (5.4-6.4%) |
| Toxapex (specWall, Leftovers) | 161-189 (53-62.2%) | 76-91 (25-29.9%) | 102-120 (33.6-39.5%) | 48-55 (15.8-18.1%) |

---

### Sharpedo-Mega

_Flagged for: Attack **416** — in OU's top quarter (≥416); Special Attack 350 — above OU's median (328); Speed 339 — above OU's median (322); setup + priority + reliable recovery; ability: Strong Jaw._

**Sharpedo-Mega** — forme, **UU**, source: imported (natdex)
  Water/Dark | BST 560 (70/140/70/110/65/105) | Abilities: Strong Jaw
  Engine stats @252 (neutral/positive): Strong Jaw: Atk 379/416, SpA 319/350, Spe 309/339
  Item: **forced — Sharpedonite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Water Hydro Pump 120S · Dark Crunch 80P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Fighting Close Combat 120P, Ground Earthquake 100P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P
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

Attacker: **Sharpedo-Mega**, jolly {"atk":252,"spe":252,"hp":4}, **Sharpedonite (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Hydro Pump | Crunch | Skull Bash | Close Combat |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 75-88 (10.5-12.3%) | 872-1026 (122.1-143.7%) | 629-741 (88.1-103.8%) | 1163-1368 (162.9-191.6%) |
| Chansey (specWall, Eviolite) | 60-71 (8.5-10.1%) | 708-833 (100.6-118.3%) | 511-601 (72.6-85.4%) | 944-1111 (134.1-157.8%) |
| Clefable (specWall, Leftovers) | 99-116 (25.1-29.4%) | 135-158 (34.3-40.1%) | 194-229 (49.2-58.1%) | 90-105 (22.8-26.6%) |
| Slowbro (physWall, Leftovers) | 76-90 (19.3-22.8%) | 283-333 (71.8-84.5%) | 102-120 (25.9-30.5%) | 47-55 (11.9-14%) |
| Slowbro-Mega (physWall, no item) | 76-90 (19.3-22.8%) | 198-233 (50.3-59.1%) | 71-84 (18-21.3%) | 33-38 (8.4-9.6%) |
| Slowking (specWall, Leftovers) | 43-51 (10.9-12.9%) | 502-590 (127.4-149.7%) | 181-213 (45.9-54.1%) | 83-98 (21.1-24.9%) |
| Skarmory (physWall, Leftovers) | 170-200 (50.9-59.9%) | 119-140 (35.6-41.9%) | 43-50 (12.9-15%) | 79-93 (23.7-27.8%) |
| Skarmory-Mega (physWall, no item) | 127-150 (38-44.9%) | 141-166 (42.2-49.7%) | 51-60 (15.3-18%) | 94-111 (28.1-33.2%) |
| Celesteela (physWall, Leftovers) | 126-149 (31.7-37.4%) | 147-174 (36.9-43.7%) | 53-62 (13.3-15.6%) | 98-116 (24.6-29.1%) |
| Hippowdon (physWall, Leftovers) | 333-392 (79.3-93.3%) | 134-158 (31.9-37.6%) | 97-114 (23.1-27.1%) | 89-105 (21.2-25%) |
| Amoonguss (specWall, Black Sludge) | 53-62 (12.3-14.4%) | 279-328 (64.6-75.9%) | 201-237 (46.5-54.9%) | 93-109 (21.5-25.2%) |
| Goodra-Hisui (specWall, Leftovers) | 35-41 (9.6-11.3%) | 208-245 (57.1-67.3%) | 75-88 (20.6-24.2%) | 278-327 (76.4-89.8%) |
| Rotom-Wash (physWall, Leftovers) | 60-71 (19.7-23.4%) | 144-169 (47.4-55.6%) | 103-122 (33.9-40.1%) | 96-113 (31.6-37.2%) |
| Swampert (physWall, Leftovers) | 139-164 (34.4-40.6%) | 161-190 (39.9-47%) | 116-137 (28.7-33.9%) | 107-126 (26.5-31.2%) |
| Tyranitar (specWall, Leftovers) | 185-218 (45.8-54%) | 96-113 (23.8-28%) | 69-81 (17.1-20%) | 514-604 (127.2-149.5%) |
| Scizor (physWall, Leftovers) | 153-180 (44.5-52.3%) | 151-177 (43.9-51.5%) | 54-64 (15.7-18.6%) | 100-118 (29.1-34.3%) |
| Buzzwole (physWall, Leftovers) | 210-247 (50.2-59.1%) | 60-70 (14.4-16.7%) | 86-101 (20.6-24.2%) | 40-47 (9.6-11.2%) |
| Aegislash (physWall, Leftovers) | 90-106 (27.8-32.7%) | 227-267 (70.1-82.4%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Tapu Fini (specWall, Leftovers) | 38-45 (11-13.1%) | 92-109 (26.7-31.7%) | 133-157 (38.7-45.6%) | 61-72 (17.7-20.9%) |
| Corviknight (physWall, Leftovers) | 146-171 (36.5-42.8%) | 146-172 (36.5-43%) | 52-62 (13-15.5%) | 97-114 (24.3-28.5%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Hydro Pump | Crunch | Skull Bash | Close Combat |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 56-66 (15.9-18.8%) | 125-147 (35.5-41.8%) | 45-53 (12.8-15.1%) | 166-196 (47.2-55.7%) |
| Toxapex (physWall, Black Sludge) | 47-55 (15.5-18.1%) | 112-132 (36.8-43.4%) | 81-95 (26.6-31.3%) | 37-44 (12.2-14.5%) |
| Clodsire (specWall, Leftovers) | 185-218 (39.9-47%) | 314-370 (67.7-79.7%) | 227-267 (48.9-57.5%) | 104-123 (22.4-26.5%) |
| Dondozo (physWall, Leftovers) | 90-106 (17.9-21%) | 137-161 (27.2-31.9%) | 99-116 (19.6-23%) | 91-107 (18.1-21.2%) |
| Gliscor (physWall, Toxic Orb) | 322-379 (91-107.1%) | 129-152 (36.4-42.9%) | 93-110 (26.3-31.1%) | 43-50 (12.1-14.1%) |
| Ting-Lu (physWall, Leftovers) | 230-271 (43.1-50.7%) | 63-74 (11.8-13.9%) | 90-107 (16.9-20%) | 168-197 (31.5-36.9%) |
| Great Tusk (physWall, Leftovers) | 421-495 (97-114.1%) | 62-73 (14.3-16.8%) | 90-106 (20.7-24.4%) | 83-98 (19.1-22.6%) |
| Alomomola (physWall, Leftovers) | 118-139 (22.1-26%) | 174-204 (32.6-38.2%) | 125-147 (23.4-27.5%) | 116-136 (21.7-25.5%) |
| Slowking-Galar (specWall, Leftovers) | 87-102 (22.1-25.9%) | 502-590 (127.4-149.7%) | 181-213 (45.9-54.1%) | 41-49 (10.4-12.4%) |
| Heatran (specWall, Leftovers) | 177-209 (45.9-54.1%) | 198-234 (51.3-60.6%) | 71-84 (18.4-21.8%) | 265-312 (68.7-80.8%) |
| Zamazenta (physWall, Leftovers) | 113-133 (29.1-34.3%) | 68-80 (17.5-20.6%) | 99-116 (25.5-29.9%) | 91-107 (23.5-27.6%) |
| Dragonite (physWall, Leftovers) | 63-75 (16.3-19.4%) | 156-183 (40.4-47.4%) | 112-132 (29-34.2%) | 52-61 (13.5-15.8%) |
| Melmetal (physWall, Leftovers) | 180-212 (38-44.7%) | 117-138 (24.7-29.1%) | 42-49 (8.9-10.3%) | 156-184 (32.9-38.8%) |
| Gholdengo (specWall, Leftovers) | 98-115 (25.9-30.4%) | 436-513 (115.3-135.7%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Landorus-Therian (physWall, Leftovers) | 306-360 (80.1-94.2%) | 161-190 (42.1-49.7%) | 116-137 (30.4-35.9%) | 53-63 (13.9-16.5%) |
| Garchomp (physWall, Leftovers) | 146-171 (34.8-40.7%) | 156-183 (37.1-43.6%) | 112-132 (26.7-31.4%) | 104-122 (24.8-29%) |
| Tyranitar-Mega (specWall, no item) | 164-192 (40.6-47.5%) | 73-86 (18.1-21.3%) | 53-62 (13.1-15.3%) | 393-462 (97.3-114.4%) |
| Chesnaught-Mega (physWall, no item) | 56-66 (14.7-17.4%) | 51-60 (13.4-15.8%) | 73-86 (19.2-22.6%) | 68-80 (17.9-21.1%) |
| Kingambit (physWall, Leftovers) | 146-171 (36.1-42.3%) | 66-78 (16.3-19.3%) | 48-56 (11.9-13.9%) | 355-418 (87.9-103.5%) |
| Toxapex (specWall, Leftovers) | 36-42 (11.8-13.8%) | 145-171 (47.7-56.3%) | 105-123 (34.5-40.5%) | 48-57 (15.8-18.8%) |

---

### Azumarill

_Flagged for: Attack **436** — in OU's top quarter (≥416); Attack reaches 436 off base 50 — an ability is doing the work; setup + priority + reliable recovery; ability: Huge Power/Sap Sipper._

**Azumarill** — species, **UU**, source: imported (natdex)
  Water/Fairy | BST 420 (100/50/80/60/80/50) | Abilities: Thick Fat / Huge Power / Sap Sipper
  Engine stats @252 (neutral/positive): Thick Fat: Atk 199/218, SpA 219/240, Spe 199/218 — Huge Power: Atk 398/436, SpA 219/240, Spe 199/218 — Sap Sipper: Atk 199/218, SpA 219/240, Spe 199/218
  Item: **free**
  STAB: Water Aqua Tail 90P · Fairy Play Rough 90P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Steel Steel Roller 130P **[conditional — fails with no terrain up]**, Normal Double-Edge 120P, Ground Dig 100 (charge)P, Flying Bounce 85 (charge)P, Ice Ice Spinner 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Psychic Future Sight 120S, Normal Hyper Voice 90S, Grass Grass Knot 60S, Ground Mud Shot 55S
  Setup: Amnesia, Defense Curl, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Priority: Aqua Jet 40P Water (+1)
  Status: Sing, Toxic
  Weather/terrain: Hail, Misty Terrain, Rain Dance, Snowscape
  Utility: Encore, Knock Off, Light Screen, Perish Song, Protect, Substitute
  Notable: Knock Off, Encore, Substitute, Focus Punch

Attacker: **Azumarill**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Aqua Tail | Play Rough | Focus Punch | Double-Edge |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 490-577 (68.6-80.8%) | 490-577 (68.6-80.8%) | 1088-1280 (152.4-179.3%) | 435-512 (60.9-71.7%) |
| Chansey (specWall, Eviolite) | 399-469 (56.7-66.6%) | 399-469 (56.7-66.6%) | 884-1040 (125.6-147.7%) | 353-416 (50.1-59.1%) |
| Clefable (specWall, Leftovers) | 153-179 (38.8-45.4%) | 153-179 (38.8-45.4%) | 83-98 (21.1-24.9%) | 135-158 (34.3-40.1%) |
| Slowbro (physWall, Leftovers) | 40-46 (10.2-11.7%) | 80-94 (20.3-23.9%) | 44-52 (11.2-13.2%) | 71-83 (18-21.1%) |
| Slowbro-Mega (physWall, no item) | 28-33 (7.1-8.4%) | 57-67 (14.5-17%) | 31-36 (7.9-9.1%) | 49-58 (12.4-14.7%) |
| Slowking (specWall, Leftovers) | 70-83 (17.8-21.1%) | 141-167 (35.8-42.4%) | 78-92 (19.8-23.4%) | 124-148 (31.5-37.6%) |
| Skarmory (physWall, Leftovers) | 68-80 (20.4-24%) | 33-40 (9.9-12%) | 74-88 (22.2-26.3%) | 29-35 (8.7-10.5%) |
| Skarmory-Mega (physWall, no item) | 80-94 (24-28.1%) | 40-46 (12-13.8%) | 88-104 (26.3-31.1%) | 35-41 (10.5-12.3%) |
| Celesteela (physWall, Leftovers) | 84-98 (21.1-24.6%) | 41-49 (10.3-12.3%) | 92-107 (23.1-26.9%) | 36-42 (9-10.6%) |
| Hippowdon (physWall, Leftovers) | 154-182 (36.7-43.3%) | 76-91 (18.1-21.7%) | 84-98 (20-23.3%) | 67-79 (16-18.8%) |
| Amoonguss (specWall, Black Sludge) | 78-92 (18.1-21.3%) | 78-92 (18.1-21.3%) | 87-102 (20.1-23.6%) | 139-163 (32.2-37.7%) |
| Goodra-Hisui (specWall, Leftovers) | 58-68 (15.9-18.7%) | 118-139 (32.4-38.2%) | 261-306 (71.7-84.1%) | 52-61 (14.3-16.8%) |
| Rotom-Wash (physWall, Leftovers) | 40-48 (13.2-15.8%) | 81-96 (26.6-31.6%) | 89-105 (29.3-34.5%) | 71-84 (23.4-27.6%) |
| Swampert (physWall, Leftovers) | 92-107 (22.8-26.5%) | 92-107 (22.8-26.5%) | 101-118 (25-29.2%) | 80-94 (19.8-23.3%) |
| Tyranitar (specWall, Leftovers) | 219-258 (54.2-63.9%) | 219-258 (54.2-63.9%) | 482-568 (119.3-140.6%) | 48-55 (11.9-13.6%) |
| Scizor (physWall, Leftovers) | 85-101 (24.7-29.4%) | 42-50 (12.2-14.5%) | 93-110 (27-32%) | 37-44 (10.8-12.8%) |
| Buzzwole (physWall, Leftovers) | 68-80 (16.3-19.1%) | 137-162 (32.8-38.8%) | 37-44 (8.9-10.5%) | 59-71 (14.1-17%) |
| Aegislash (physWall, Leftovers) | 65-76 (20.1-23.5%) | 32-37 (9.9-11.4%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Tapu Fini (specWall, Leftovers) | 52-61 (15.1-17.7%) | 105-123 (30.5-35.8%) | 57-67 (16.6-19.5%) | 92-109 (26.7-31.7%) |
| Corviknight (physWall, Leftovers) | 83-97 (20.8-24.3%) | 41-48 (10.3-12%) | 91-107 (22.8-26.8%) | 36-42 (9-10.5%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Aqua Tail | Play Rough | Focus Punch | Double-Edge |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 35-41 (9.9-11.6%) | 35-41 (9.9-11.6%) | 157-184 (44.6-52.3%) | 31-36 (8.8-10.2%) |
| Toxapex (physWall, Black Sludge) | 31-37 (10.2-12.2%) | 31-37 (10.2-12.2%) | 35-41 (11.5-13.5%) | 55-66 (18.1-21.7%) |
| Clodsire (specWall, Leftovers) | 356-418 (76.7-90.1%) | 88-104 (19-22.4%) | 97-115 (20.9-24.8%) | 157-184 (33.8-39.7%) |
| Dondozo (physWall, Leftovers) | 39-45 (7.7-8.9%) | 78-92 (15.5-18.3%) | 85-101 (16.9-20%) | 68-80 (13.5-15.9%) |
| Gliscor (physWall, Toxic Orb) | 148-175 (41.8-49.4%) | 74-87 (20.9-24.6%) | 40-46 (11.3-13%) | 65-76 (18.4-21.5%) |
| Ting-Lu (physWall, Leftovers) | 144-170 (27-31.8%) | 144-170 (27-31.8%) | 157-185 (29.4-34.6%) | 63-74 (11.8-13.9%) |
| Great Tusk (physWall, Leftovers) | 143-169 (32.9-38.9%) | 143-169 (32.9-38.9%) | 78-92 (18-21.2%) | 62-74 (14.3-17.1%) |
| Alomomola (physWall, Leftovers) | 49-58 (9.2-10.9%) | 98-117 (18.4-21.9%) | 107-127 (20-23.8%) | 87-102 (16.3-19.1%) |
| Slowking-Galar (specWall, Leftovers) | 141-167 (35.8-42.4%) | 70-83 (17.8-21.1%) | 39-45 (9.9-11.4%) | 124-148 (31.5-37.6%) |
| Heatran (specWall, Leftovers) | 226-266 (58.5-68.9%) | 27-32 (7-8.3%) | 248-292 (64.2-75.6%) | 49-58 (12.7-15%) |
| Zamazenta (physWall, Leftovers) | 78-92 (20.1-23.7%) | 157-184 (40.5-47.4%) | 85-101 (21.9-26%) | 68-80 (17.5-20.6%) |
| Dragonite (physWall, Leftovers) | 44-52 (11.4-13.5%) | 178-209 (46.1-54.1%) | 48-57 (12.4-14.8%) | 78-92 (20.2-23.8%) |
| Melmetal (physWall, Leftovers) | 67-79 (14.1-16.7%) | 33-39 (7-8.2%) | 146-172 (30.8-36.3%) | 28-33 (5.9-7%) |
| Gholdengo (specWall, Leftovers) | 123-145 (32.5-38.4%) | 61-72 (16.1-19%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Landorus-Therian (physWall, Leftovers) | 184-217 (48.2-56.8%) | 92-107 (24.1-28%) | 50-58 (13.1-15.2%) | 80-94 (20.9-24.6%) |
| Garchomp (physWall, Leftovers) | 88-104 (21-24.8%) | 178-209 (42.4-49.8%) | 97-114 (23.1-27.1%) | 78-92 (18.6-21.9%) |
| Tyranitar-Mega (specWall, no item) | 169-198 (41.8-49%) | 169-198 (41.8-49%) | 369-435 (91.3-107.7%) | 36-42 (8.9-10.4%) |
| Chesnaught-Mega (physWall, no item) | 28-33 (7.4-8.7%) | 118-139 (31.1-36.6%) | 63-75 (16.6-19.7%) | 52-61 (13.7-16.1%) |
| Kingambit (physWall, Leftovers) | 76-89 (18.8-22%) | 76-89 (18.8-22%) | 334-393 (82.7-97.3%) | 32-39 (7.9-9.7%) |
| Toxapex (specWall, Leftovers) | 41-48 (13.5-15.8%) | 41-48 (13.5-15.8%) | 45-53 (14.8-17.4%) | 72-85 (23.7-28%) |

---

### Emboar-Mega

_Flagged for: Attack **434** — in OU's top quarter (≥416); Special Attack 350 — above OU's median (328); BST 628 — above OU's median (600); setup + priority + reliable recovery._

**Emboar-Mega** — forme, **UU**, source: override
  Fire/Fighting | BST 628 (110/148/75/110/110/75) | Abilities: Mold Breaker
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 395/434, SpA 319/350, Spe 249/273
  Item: **forced — Emboarite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Hard Press 100P, Electric Wild Charge 90P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**
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

Attacker: **Emboar-Mega**, adamant {"atk":252,"spe":252,"hp":4}, **Emboarite (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Overheat | Focus Punch | Head Smash | Double-Edge |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 87-103 (12.2-14.4%) | 2495-2935 (349.4-411.1%) | 831-978 (116.4-137%) | 665-783 (93.1-109.7%) |
| Chansey (specWall, Eviolite) | 70-82 (9.9-11.6%) | 2026-2383 (287.8-338.5%) | 675-794 (95.9-112.8%) | 540-636 (76.7-90.3%) |
| Clefable (specWall, Leftovers) | 115-135 (29.2-34.3%) | 192-226 (48.7-57.4%) | 257-302 (65.2-76.6%) | 206-242 (52.3-61.4%) |
| Slowbro (physWall, Leftovers) | 89-105 (22.6-26.6%) | 100-118 (25.4-29.9%) | 134-158 (34-40.1%) | 107-126 (27.2-32%) |
| Slowbro-Mega (physWall, no item) | 89-105 (22.6-26.6%) | 70-82 (17.8-20.8%) | 93-110 (23.6-27.9%) | 75-88 (19-22.3%) |
| Slowking (specWall, Leftovers) | 50-59 (12.7-15%) | 179-210 (45.4-53.3%) | 238-281 (60.4-71.3%) | 191-225 (48.5-57.1%) |
| Skarmory (physWall, Leftovers) | 396-467 (118.6-139.8%) | 170-200 (50.9-59.9%) | 113-133 (33.8-39.8%) | 45-53 (13.5-15.9%) |
| Skarmory-Mega (physWall, no item) | 297-349 (88.9-104.5%) | 201-237 (60.2-71%) | 134-158 (40.1-47.3%) | 53-63 (15.9-18.9%) |
| Celesteela (physWall, Leftovers) | 294-346 (73.9-86.9%) | 210-247 (52.8-62.1%) | 140-165 (35.2-41.5%) | 56-66 (14.1-16.6%) |
| Hippowdon (physWall, Leftovers) | 194-228 (46.2-54.3%) | 192-225 (45.7-53.6%) | 64-75 (15.2-17.9%) | 102-120 (24.3-28.6%) |
| Amoonguss (specWall, Black Sludge) | 247-291 (57.2-67.4%) | 199-234 (46.1-54.2%) | 265-312 (61.3-72.2%) | 212-250 (49.1-57.9%) |
| Goodra-Hisui (specWall, Leftovers) | 81-95 (22.3-26.1%) | 595-701 (163.5-192.6%) | 99-116 (27.2-31.9%) | 79-93 (21.7-25.5%) |
| Rotom-Wash (physWall, Leftovers) | 70-82 (23-27%) | 205-241 (67.4-79.3%) | 136-160 (44.7-52.6%) | 109-129 (35.9-42.4%) |
| Swampert (physWall, Leftovers) | 81-95 (20-23.5%) | 230-271 (56.9-67.1%) | 76-90 (18.8-22.3%) | 123-144 (30.4-35.6%) |
| Tyranitar (specWall, Leftovers) | 53-63 (13.1-15.6%) | 1099-1293 (272-320%) | 183-215 (45.3-53.2%) | 73-86 (18.1-21.3%) |
| Scizor (physWall, Leftovers) | 714-840 (207.6-244.2%) | 215-253 (62.5-73.5%) | 143-168 (41.6-48.8%) | 57-67 (16.6-19.5%) |
| Buzzwole (physWall, Leftovers) | 490-577 (117.2-138%) | 85-100 (20.3-23.9%) | 113-134 (27-32.1%) | 91-107 (21.8-25.6%) |
| Aegislash (physWall, Leftovers) | 210-247 (64.8-76.2%) | 0-0 (0-0%) | 53-63 (16.4-19.4%) | 0-0 (0-0%) |
| Tapu Fini (specWall, Leftovers) | 45-52 (13.1-15.1%) | 132-155 (38.4-45.1%) | 176-207 (51.2-60.2%) | 141-166 (41-48.3%) |
| Corviknight (physWall, Leftovers) | 339-399 (84.8-99.8%) | 208-244 (52-61%) | 138-163 (34.5-40.8%) | 55-65 (13.8-16.3%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Overheat | Focus Punch | Head Smash | Double-Edge |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 524-617 (148.9-175.3%) | 356-419 (101.1-119%) | 59-69 (16.8-19.6%) | 47-56 (13.4-15.9%) |
| Toxapex (physWall, Black Sludge) | 55-64 (18.1-21.1%) | 79-94 (26-30.9%) | 106-125 (34.9-41.1%) | 85-100 (28-32.9%) |
| Clodsire (specWall, Leftovers) | 107-126 (23.1-27.2%) | 224-264 (48.3-56.9%) | 149-176 (32.1-37.9%) | 240-282 (51.7-60.8%) |
| Dondozo (physWall, Leftovers) | 105-123 (20.8-24.4%) | 195-230 (38.7-45.6%) | 130-153 (25.8-30.4%) | 104-123 (20.6-24.4%) |
| Gliscor (physWall, Toxic Orb) | 187-221 (52.8-62.4%) | 92-108 (26-30.5%) | 123-144 (34.7-40.7%) | 98-116 (27.7-32.8%) |
| Ting-Lu (physWall, Leftovers) | 134-157 (25.1-29.4%) | 359-422 (67.2-79%) | 59-70 (11-13.1%) | 96-113 (18-21.2%) |
| Great Tusk (physWall, Leftovers) | 245-288 (56.5-66.4%) | 178-209 (41-48.2%) | 29-34 (6.7-7.8%) | 95-112 (21.9-25.8%) |
| Alomomola (physWall, Leftovers) | 138-162 (25.8-30.3%) | 248-291 (46.4-54.5%) | 165-194 (30.9-36.3%) | 132-156 (24.7-29.2%) |
| Slowking-Galar (specWall, Leftovers) | 101-118 (25.6-29.9%) | 89-105 (22.6-26.6%) | 238-281 (60.4-71.3%) | 191-225 (48.5-57.1%) |
| Heatran (specWall, Leftovers) | 103-121 (26.7-31.3%) | 567-667 (146.9-172.8%) | 189-222 (49-57.5%) | 75-89 (19.4-23.1%) |
| Zamazenta (physWall, Leftovers) | 132-155 (34-39.9%) | 195-230 (50.3-59.3%) | 65-76 (16.8-19.6%) | 104-123 (26.8-31.7%) |
| Dragonite (physWall, Leftovers) | 74-87 (19.2-22.5%) | 111-130 (28.8-33.7%) | 296-349 (76.7-90.4%) | 119-140 (30.8-36.3%) |
| Melmetal (physWall, Leftovers) | 420-494 (88.6-104.2%) | 334-393 (70.5-82.9%) | 55-65 (11.6-13.7%) | 44-52 (9.3-11%) |
| Gholdengo (specWall, Leftovers) | 228-268 (60.3-70.9%) | 0-0 (0-0%) | 103-121 (27.2-32%) | 0-0 (0-0%) |
| Landorus-Therian (physWall, Leftovers) | 178-210 (46.6-55%) | 115-135 (30.1-35.3%) | 153-180 (40.1-47.1%) | 123-144 (32.2-37.7%) |
| Garchomp (physWall, Leftovers) | 84-99 (20-23.6%) | 222-261 (52.9-62.1%) | 74-87 (17.6-20.7%) | 119-140 (28.3-33.3%) |
| Tyranitar-Mega (specWall, no item) | 47-56 (11.6-13.9%) | 840-988 (207.9-244.6%) | 140-164 (34.7-40.6%) | 56-66 (13.9-16.3%) |
| Chesnaught-Mega (physWall, no item) | 264-311 (69.5-81.8%) | 145-171 (38.2-45%) | 48-57 (12.6-15%) | 78-91 (20.5-23.9%) |
| Kingambit (physWall, Leftovers) | 339-399 (83.9-98.8%) | 759-894 (187.9-221.3%) | 63-74 (15.6-18.3%) | 50-59 (12.4-14.6%) |
| Toxapex (specWall, Leftovers) | 42-49 (13.8-16.1%) | 103-122 (33.9-40.1%) | 138-162 (45.4-53.3%) | 111-130 (36.5-42.8%) |

---

### Enamorus

_Flagged for: Special Attack **405** — in OU's top quarter (≥401); Speed 342 — above OU's median (322); strong setup on a frame fast enough to use it; ability: Contrary._

**Enamorus** — species, **UU**, source: imported (natdex)
  Fairy/Flying | BST 580 (74/115/70/135/80/106) | Abilities: Cute Charm / Contrary
  Engine stats @252 (neutral/positive): Cute Charm: Atk 329/361, SpA 369/405, Spe 311/342 — Contrary: Atk 329/361, SpA 369/405, Spe 311/342
  Item: **free**
  STAB: Fairy Misty Explosion 100S **[power — the user **faints**]** · Flying Fly 90 (charge)P
  Physical coverage: Dragon Outrage 120P, Fighting Superpower 120P, Normal Take Down 90P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Ghost Astonish 30P
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Fire Mystical Fire 75S
  Setup: Agility, Calm Mind, Iron Defense
  Reliable recovery: Rest
  Drain/Rest-only: Draining Kiss
  Weather/terrain: Grassy Terrain, Misty Terrain, Rain Dance, Sunny Day
  Utility: Healing Wish, Protect, Substitute, Tailwind, Taunt
  Notable: Taunt, Substitute, Tailwind

Attacker: **Enamorus**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Fly | Focus Blast | Earth Power | Psychic |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 536-631 (75.1-88.4%) | 206-243 (28.9-34%) | 78-91 (10.9-12.7%) | 78-91 (10.9-12.7%) |
| Chansey (specWall, Eviolite) | 436-513 (61.9-72.9%) | 165-195 (23.4-27.7%) | 62-72 (8.8-10.2%) | 62-72 (8.8-10.2%) |
| Clefable (specWall, Leftovers) | 167-196 (42.4-49.7%) | 67-79 (17-20.1%) | 102-120 (25.9-30.5%) | 102-120 (25.9-30.5%) |
| Slowbro (physWall, Leftovers) | 88-104 (22.3-26.4%) | 105-123 (26.6-31.2%) | 158-187 (40.1-47.5%) | 79-93 (20.1-23.6%) |
| Slowbro-Mega (physWall, no item) | 62-72 (15.7-18.3%) | 105-123 (26.6-31.2%) | 158-187 (40.1-47.5%) | 79-93 (20.1-23.6%) |
| Slowking (specWall, Leftovers) | 156-183 (39.6-46.4%) | 59-70 (15-17.8%) | 89-105 (22.6-26.6%) | 44-52 (11.2-13.2%) |
| Skarmory (physWall, Leftovers) | 36-44 (10.8-13.2%) | 235-276 (70.4-82.6%) | 0-0 (0-0%) | 88-104 (26.3-31.1%) |
| Skarmory-Mega (physWall, no item) | 44-52 (13.2-15.6%) | 175-206 (52.4-61.7%) | 0-0 (0-0%) | 66-78 (19.8-23.4%) |
| Celesteela (physWall, Leftovers) | 45-53 (11.3-13.3%) | 174-205 (43.7-51.5%) | 0-0 (0-0%) | 65-76 (16.3-19.1%) |
| Hippowdon (physWall, Leftovers) | 84-98 (20-23.3%) | 230-270 (54.8-64.3%) | 172-202 (41-48.1%) | 172-202 (41-48.1%) |
| Amoonguss (specWall, Black Sludge) | 345-406 (79.9-94%) | 72-85 (16.7-19.7%) | 110-130 (25.5-30.1%) | 221-260 (51.2-60.2%) |
| Goodra-Hisui (specWall, Leftovers) | 65-75 (17.9-20.6%) | 191-224 (52.5-61.5%) | 144-170 (39.6-46.7%) | 35-41 (9.6-11.3%) |
| Rotom-Wash (physWall, Leftovers) | 44-52 (14.5-17.1%) | 166-195 (54.6-64.1%) | 250-295 (82.2-97%) | 124-146 (40.8-48%) |
| Swampert (physWall, Leftovers) | 100-118 (24.8-29.2%) | 192-226 (47.5-55.9%) | 144-170 (35.6-42.1%) | 144-170 (35.6-42.1%) |
| Tyranitar (specWall, Leftovers) | 59-70 (14.6-17.3%) | 509-599 (126-148.3%) | 191-226 (47.3-55.9%) | 0-0 (0-0%) |
| Scizor (physWall, Leftovers) | 93-110 (27-32%) | 211-248 (61.3-72.1%) | 158-187 (45.9-54.4%) | 79-93 (23-27%) |
| Buzzwole (physWall, Leftovers) | 301-354 (72-84.7%) | 145-170 (34.7-40.7%) | 109-128 (26.1-30.6%) | 438-514 (104.8-123%) |
| Aegislash (physWall, Leftovers) | 35-41 (10.8-12.7%) | 0-0 (0-0%) | 187-221 (57.7-68.2%) | 46-54 (14.2-16.7%) |
| Tapu Fini (specWall, Leftovers) | 115-135 (33.4-39.2%) | 52-62 (15.1-18%) | 79-93 (23-27%) | 79-93 (23-27%) |
| Corviknight (physWall, Leftovers) | 45-53 (11.3-13.3%) | 201-236 (50.3-59%) | 0-0 (0-0%) | 75-88 (18.8-22%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Fly | Focus Blast | Earth Power | Psychic |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 78-92 (22.2-26.1%) | 310-365 (88.1-103.7%) | 117-137 (33.2-38.9%) | 58-68 (16.5-19.3%) |
| Toxapex (physWall, Black Sludge) | 70-83 (23-27.3%) | 65-76 (21.4-25%) | 196-231 (64.5-76%) | 196-231 (64.5-76%) |
| Clodsire (specWall, Leftovers) | 195-228 (42-49.1%) | 63-74 (13.6-15.9%) | 191-226 (41.2-48.7%) | 191-226 (41.2-48.7%) |
| Dondozo (physWall, Leftovers) | 85-101 (16.9-20%) | 249-293 (49.4-58.1%) | 187-221 (37.1-43.8%) | 187-221 (37.1-43.8%) |
| Gliscor (physWall, Toxic Orb) | 80-94 (22.6-26.6%) | 110-130 (31.1-36.7%) | 0-0 (0-0%) | 167-196 (47.2-55.4%) |
| Ting-Lu (physWall, Leftovers) | 79-92 (14.8-17.2%) | 317-373 (59.4-69.9%) | 119-140 (22.3-26.2%) | 0-0 (0-0%) |
| Great Tusk (physWall, Leftovers) | 157-184 (36.2-42.4%) | 291-341 (67.1-78.6%) | 218-257 (50.2-59.2%) | 438-514 (100.9-118.4%) |
| Alomomola (physWall, Leftovers) | 107-127 (20-23.8%) | 327-386 (61.2-72.3%) | 245-289 (45.9-54.1%) | 245-289 (45.9-54.1%) |
| Slowking-Galar (specWall, Leftovers) | 156-183 (39.6-46.4%) | 29-35 (7.4-8.9%) | 179-211 (45.4-53.6%) | 89-105 (22.6-26.6%) |
| Heatran (specWall, Leftovers) | 61-72 (15.8-18.7%) | 244-287 (63.2-74.4%) | 369-434 (95.6-112.4%) | 45-53 (11.7-13.7%) |
| Zamazenta (physWall, Leftovers) | 171-202 (44.1-52.1%) | 156-183 (40.2-47.2%) | 117-137 (30.2-35.3%) | 235-276 (60.6-71.1%) |
| Dragonite (physWall, Leftovers) | 97-114 (25.1-29.5%) | 87-102 (22.5-26.4%) | 0-0 (0-0%) | 132-156 (34.2-40.4%) |
| Melmetal (physWall, Leftovers) | 36-42 (7.6-8.9%) | 499-587 (105.3-123.8%) | 375-442 (79.1-93.2%) | 93-110 (19.6-23.2%) |
| Gholdengo (specWall, Leftovers) | 67-79 (17.7-20.9%) | 0-0 (0-0%) | 202-239 (53.4-63.2%) | 50-59 (13.2-15.6%) |
| Landorus-Therian (physWall, Leftovers) | 100-118 (26.2-30.9%) | 105-123 (27.5-32.2%) | 0-0 (0-0%) | 158-187 (41.4-49%) |
| Garchomp (physWall, Leftovers) | 97-114 (23.1-27.1%) | 201-236 (47.9-56.2%) | 150-178 (35.7-42.4%) | 150-178 (35.7-42.4%) |
| Tyranitar-Mega (specWall, no item) | 45-53 (11.1-13.1%) | 449-529 (111.1-130.9%) | 169-198 (41.8-49%) | 0-0 (0-0%) |
| Chesnaught-Mega (physWall, no item) | 258-304 (67.9-80%) | 156-183 (41.1-48.2%) | 58-68 (15.3-17.9%) | 235-276 (61.8-72.6%) |
| Kingambit (physWall, Leftovers) | 41-48 (10.1-11.9%) | 806-949 (199.5-234.9%) | 302-356 (74.8-88.1%) | 0-0 (0-0%) |
| Toxapex (specWall, Leftovers) | 91-106 (29.9-34.9%) | 49-58 (16.1-19.1%) | 150-176 (49.3-57.9%) | 150-176 (49.3-57.9%) |

---

### Hawlucha

_Flagged for: Speed **368** — in OU's top quarter (≥350); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Unburden._

**Hawlucha** — species, **UU**, source: override
  Fighting/Flying | BST 500 (78/92/75/74/63/118) | Abilities: Limber / Unburden / Mold Breaker
  Engine stats @252 (neutral/positive): Limber: Atk 283/311, SpA 247/271, Spe 335/368 — Unburden: Atk 283/311, SpA 247/271, Spe 335/368 — Mold Breaker: Atk 283/311, SpA 247/271, Spe 335/368
  Item: **free** — but its own Hawluchanite is **refused in UU** (it would make Hawlucha-Mega, OU)
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Steel Iron Head 80P, Bug Lunge 80P
  Special coverage: Normal Uproar 90S, Grass Grass Knot 60S
  Setup: Agility, Bulk Up, Hone Claws, Swords Dance, Work Up
  Reliable recovery: Rest, Roost
  Drain/Rest-only: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2)
  Removal: Defog
  Pivot: Baton Pass, U-turn
  Status: Toxic
  Trapping moves: Mean Look
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Encore, Protect, Substitute, Tailwind, Taunt
  Notable: Encore, Taunt, Substitute, Baton Pass, Tailwind, Focus Punch

Attacker: **Hawlucha**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Focus Punch | Sky Attack | Dual Chop | Stone Edge |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 2116-2490 (296.4-348.7%) | 988-1162 (138.4-162.7%) | 472-556 (66.1-77.9%) | 470-553 (65.8-77.5%) |
| Chansey (specWall, Eviolite) | 1718-2022 (244-287.2%) | 802-943 (113.9-133.9%) | 384-452 (54.5-64.2%) | 382-449 (54.3-63.8%) |
| Clefable (specWall, Leftovers) | 163-192 (41.4-48.7%) | 305-360 (77.4-91.4%) | 0-0 (0-0%) | 145-171 (36.8-43.4%) |
| Slowbro (physWall, Leftovers) | 85-100 (21.6-25.4%) | 159-188 (40.4-47.7%) | 78-90 (19.8-22.8%) | 76-89 (19.3-22.6%) |
| Slowbro-Mega (physWall, no item) | 59-70 (15-17.8%) | 111-132 (28.2-33.5%) | 54-64 (13.7-16.2%) | 53-63 (13.5-16%) |
| Slowking (specWall, Leftovers) | 152-178 (38.6-45.2%) | 284-334 (72.1-84.8%) | 136-160 (34.5-40.6%) | 135-159 (34.3-40.4%) |
| Skarmory (physWall, Leftovers) | 144-170 (43.1-50.9%) | 67-79 (20.1-23.7%) | 30-38 (9-11.4%) | 65-76 (19.5-22.8%) |
| Skarmory-Mega (physWall, no item) | 171-201 (51.2-60.2%) | 79-93 (23.7-27.8%) | 38-44 (11.4-13.2%) | 76-89 (22.8-26.6%) |
| Celesteela (physWall, Leftovers) | 179-210 (45-52.8%) | 83-98 (20.9-24.6%) | 38-46 (9.5-11.6%) | 80-93 (20.1-23.4%) |
| Hippowdon (physWall, Leftovers) | 163-192 (38.8-45.7%) | 152-179 (36.2-42.6%) | 74-88 (17.6-21%) | 36-42 (8.6-10%) |
| Amoonguss (specWall, Black Sludge) | 169-198 (39.1-45.8%) | 633-744 (146.5-172.2%) | 152-178 (35.2-41.2%) | 150-178 (34.7-41.2%) |
| Goodra-Hisui (specWall, Leftovers) | 507-596 (139.3-163.7%) | 118-139 (32.4-38.2%) | 114-134 (31.3-36.8%) | 55-66 (15.1-18.1%) |
| Rotom-Wash (physWall, Leftovers) | 174-205 (57.2-67.4%) | 80-96 (26.3-31.6%) | 80-92 (26.3-30.3%) | 78-92 (25.7-30.3%) |
| Swampert (physWall, Leftovers) | 196-230 (48.5-56.9%) | 183-215 (45.3-53.2%) | 88-104 (21.8-25.7%) | 42-50 (10.4-12.4%) |
| Tyranitar (specWall, Leftovers) | 936-1101 (231.7-272.5%) | 109-128 (27-31.7%) | 106-124 (26.2-30.7%) | 104-122 (25.7-30.2%) |
| Scizor (physWall, Leftovers) | 183-215 (53.2-62.5%) | 170-201 (49.4-58.4%) | 40-48 (11.6-14%) | 81-96 (23.5-27.9%) |
| Buzzwole (physWall, Leftovers) | 72-85 (17.2-20.3%) | 546-642 (130.6-153.6%) | 66-78 (15.8-18.7%) | 65-76 (15.6-18.2%) |
| Aegislash (physWall, Leftovers) | 0-0 (0-0%) | 63-75 (19.4-23.1%) | 30-36 (9.3-11.1%) | 29-36 (9-11.1%) |
| Tapu Fini (specWall, Leftovers) | 111-132 (32.3-38.4%) | 210-247 (61-71.8%) | 0-0 (0-0%) | 100-118 (29.1-34.3%) |
| Corviknight (physWall, Leftovers) | 176-208 (44-52%) | 81-97 (20.3-24.3%) | 38-46 (9.5-11.5%) | 79-93 (19.8-23.3%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Focus Punch | Sky Attack | Dual Chop | Stone Edge |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 304-357 (86.4-101.4%) | 141-166 (40.1-47.2%) | 32-38 (9.1-10.8%) | 33-39 (9.4-11.1%) |
| Toxapex (physWall, Black Sludge) | 67-79 (22-26%) | 127-149 (41.8-49%) | 62-72 (20.4-23.7%) | 61-71 (20.1-23.4%) |
| Clodsire (specWall, Leftovers) | 189-223 (40.7-48.1%) | 356-419 (76.7-90.3%) | 170-202 (36.6-43.5%) | 84-100 (18.1-21.6%) |
| Dondozo (physWall, Leftovers) | 166-196 (32.9-38.9%) | 156-183 (31-36.3%) | 74-88 (14.7-17.5%) | 74-87 (14.7-17.3%) |
| Gliscor (physWall, Toxic Orb) | 78-92 (22-26%) | 146-172 (41.2-48.6%) | 72-84 (20.3-23.7%) | 70-83 (19.8-23.4%) |
| Ting-Lu (physWall, Leftovers) | 305-360 (57.1-67.4%) | 143-167 (26.8-31.3%) | 70-82 (13.1-15.4%) | 33-40 (6.2-7.5%) |
| Great Tusk (physWall, Leftovers) | 152-178 (35-41%) | 283-334 (65.2-77%) | 70-80 (16.1-18.4%) | 16-19 (3.7-4.4%) |
| Alomomola (physWall, Leftovers) | 210-248 (39.3-46.4%) | 196-231 (36.7-43.3%) | 96-110 (18-20.6%) | 93-110 (17.4-20.6%) |
| Slowking-Galar (specWall, Leftovers) | 75-88 (19-22.3%) | 284-334 (72.1-84.8%) | 136-160 (34.5-40.6%) | 135-159 (34.3-40.4%) |
| Heatran (specWall, Leftovers) | 482-568 (124.9-147.2%) | 111-132 (28.8-34.2%) | 54-62 (14-16.1%) | 107-126 (27.7-32.6%) |
| Zamazenta (physWall, Leftovers) | 166-196 (42.8-50.5%) | 312-366 (80.4-94.3%) | 74-88 (19.1-22.7%) | 36-42 (9.3-10.8%) |
| Dragonite (physWall, Leftovers) | 93-110 (24.1-28.5%) | 176-208 (45.6-53.9%) | 174-202 (45.1-52.3%) | 169-198 (43.8-51.3%) |
| Melmetal (physWall, Leftovers) | 286-335 (60.3-70.7%) | 66-78 (13.9-16.5%) | 30-38 (6.3-8%) | 31-37 (6.5-7.8%) |
| Gholdengo (specWall, Leftovers) | 0-0 (0-0%) | 123-144 (32.5-38.1%) | 58-70 (15.3-18.5%) | 58-68 (15.3-18%) |
| Landorus-Therian (physWall, Leftovers) | 97-114 (25.4-29.8%) | 183-215 (47.9-56.3%) | 88-104 (23-27.2%) | 87-102 (22.8-26.7%) |
| Garchomp (physWall, Leftovers) | 188-222 (44.8-52.9%) | 176-208 (41.9-49.5%) | 174-202 (41.4-48.1%) | 41-49 (9.8-11.7%) |
| Tyranitar-Mega (specWall, no item) | 716-842 (177.2-208.4%) | 83-97 (20.5-24%) | 80-96 (19.8-23.8%) | 79-93 (19.6-23%) |
| Chesnaught-Mega (physWall, no item) | 123-145 (32.4-38.2%) | 465-548 (122.4-144.2%) | 56-66 (14.7-17.4%) | 27-32 (7.1-8.4%) |
| Kingambit (physWall, Leftovers) | 648-763 (160.4-188.9%) | 75-88 (18.6-21.8%) | 36-40 (8.9-9.9%) | 36-41 (8.9-10.1%) |
| Toxapex (specWall, Leftovers) | 88-104 (28.9-34.2%) | 165-193 (54.3-63.5%) | 80-92 (26.3-30.3%) | 79-92 (26-30.3%) |

---

### Haxorus

_Flagged for: Attack **432** — in OU's top quarter (≥416); Speed 322 — above OU's median (322); setup + priority + reliable recovery; strong setup on a frame fast enough to use it._

**Haxorus** — species, **UU**, source: imported (natdex)
  Dragon | BST 540 (76/147/90/60/70/97) | Abilities: Rivalry / Mold Breaker / Unnerve
  Engine stats @252 (neutral/positive): Rivalry: Atk 393/432, SpA 219/240, Spe 293/322 — Mold Breaker: Atk 393/432, SpA 219/240, Spe 293/322 — Unnerve: Atk 393/432, SpA 219/240, Spe 293/322
  Item: **free**
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

Attacker: **Haxorus**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Outrage | Close Combat | Double-Edge | Earthquake |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 882-1037 (123.5-145.2%) | 1176-1384 (164.7-193.8%) | 587-691 (82.2-96.8%) | 490-577 (68.6-80.8%) |
| Chansey (specWall, Eviolite) | 716-842 (101.7-119.6%) | 955-1124 (135.7-159.7%) | 477-561 (67.8-79.7%) | 397-468 (56.4-66.5%) |
| Clefable (specWall, Leftovers) | 0-0 (0-0%) | 150-178 (38.1-45.2%) | 301-356 (76.4-90.4%) | 252-296 (64-75.1%) |
| Slowbro (physWall, Leftovers) | 236-279 (59.9-70.8%) | 78-92 (19.8-23.4%) | 157-185 (39.8-47%) | 131-154 (33.2-39.1%) |
| Slowbro-Mega (physWall, no item) | 165-195 (41.9-49.5%) | 54-65 (13.7-16.5%) | 110-130 (27.9-33%) | 92-107 (23.4-27.2%) |
| Slowking (specWall, Leftovers) | 421-495 (106.9-125.6%) | 140-165 (35.5-41.9%) | 280-330 (71.1-83.8%) | 234-275 (59.4-69.8%) |
| Skarmory (physWall, Leftovers) | 100-117 (29.9-35%) | 132-157 (39.5-47%) | 66-78 (19.8-23.4%) | 0-0 (0-0%) |
| Skarmory-Mega (physWall, no item) | 118-139 (35.3-41.6%) | 157-185 (47-55.4%) | 78-92 (23.4-27.5%) | 0-0 (0-0%) |
| Celesteela (physWall, Leftovers) | 98-117 (24.6-29.4%) | 132-156 (33.2-39.2%) | 66-78 (16.6-19.6%) | 0-0 (0-0%) |
| Hippowdon (physWall, Leftovers) | 226-265 (53.8-63.1%) | 150-176 (35.7-41.9%) | 150-176 (35.7-41.9%) | 126-148 (30-35.2%) |
| Amoonguss (specWall, Black Sludge) | 469-552 (108.6-127.8%) | 156-183 (36.1-42.4%) | 312-367 (72.2-85%) | 260-306 (60.2-70.8%) |
| Goodra-Hisui (specWall, Leftovers) | 351-412 (96.4-113.2%) | 468-549 (128.6-150.8%) | 117-136 (32.1-37.4%) | 390-458 (107.1-125.8%) |
| Rotom-Wash (physWall, Leftovers) | 193-227 (63.5-74.7%) | 128-152 (42.1-50%) | 128-152 (42.1-50%) | 215-253 (70.7-83.2%) |
| Swampert (physWall, Leftovers) | 270-318 (66.8-78.7%) | 180-211 (44.6-52.2%) | 180-211 (44.6-52.2%) | 150-176 (37.1-43.6%) |
| Tyranitar (specWall, Leftovers) | 323-380 (80-94.1%) | 863-1015 (213.6-251.2%) | 107-126 (26.5-31.2%) | 360-423 (89.1-104.7%) |
| Scizor (physWall, Leftovers) | 126-148 (36.6-43%) | 169-197 (49.1-57.3%) | 84-98 (24.4-28.5%) | 140-165 (40.7-48%) |
| Buzzwole (physWall, Leftovers) | 161-189 (38.5-45.2%) | 53-62 (12.7-14.8%) | 107-126 (25.6-30.1%) | 44-52 (10.5-12.4%) |
| Aegislash (physWall, Leftovers) | 94-111 (29-34.3%) | 0-0 (0-0%) | 0-0 (0-0%) | 211-249 (65.1-76.9%) |
| Tapu Fini (specWall, Leftovers) | 0-0 (0-0%) | 83-97 (24.1-28.2%) | 166-195 (48.3-56.7%) | 139-163 (40.4-47.4%) |
| Corviknight (physWall, Leftovers) | 122-144 (30.5-36%) | 162-192 (40.5-48%) | 80-96 (20-24%) | 0-0 (0-0%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Outrage | Close Combat | Double-Edge | Earthquake |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 104-123 (29.5-34.9%) | 279-328 (79.3-93.2%) | 68-81 (19.3-23%) | 117-136 (33.2-38.6%) |
| Toxapex (physWall, Black Sludge) | 188-221 (61.8-72.7%) | 62-72 (20.4-23.7%) | 124-146 (40.8-48%) | 209-247 (68.8-81.3%) |
| Clodsire (specWall, Leftovers) | 529-622 (114-134.1%) | 175-206 (37.7-44.4%) | 352-414 (75.9-89.2%) | 588-692 (126.7-149.1%) |
| Dondozo (physWall, Leftovers) | 230-270 (45.6-53.6%) | 153-180 (30.4-35.7%) | 153-180 (30.4-35.7%) | 127-150 (25.2-29.8%) |
| Gliscor (physWall, Toxic Orb) | 217-254 (61.3-71.8%) | 71-84 (20.1-23.7%) | 144-170 (40.7-48%) | 0-0 (0-0%) |
| Ting-Lu (physWall, Leftovers) | 169-198 (31.6-37.1%) | 226-266 (42.3-49.8%) | 113-132 (21.2-24.7%) | 93-110 (17.4-20.6%) |
| Great Tusk (physWall, Leftovers) | 167-197 (38.5-45.4%) | 111-131 (25.6-30.2%) | 111-131 (25.6-30.2%) | 93-110 (21.4-25.3%) |
| Alomomola (physWall, Leftovers) | 291-343 (54.5-64.2%) | 193-228 (36.1-42.7%) | 193-228 (36.1-42.7%) | 162-191 (30.3-35.8%) |
| Slowking-Galar (specWall, Leftovers) | 421-495 (106.9-125.6%) | 70-81 (17.8-20.6%) | 280-330 (71.1-83.8%) | 469-552 (119-140.1%) |
| Heatran (specWall, Leftovers) | 166-196 (43-50.8%) | 444-523 (115-135.5%) | 110-130 (28.5-33.7%) | 743-874 (192.5-226.4%) |
| Zamazenta (physWall, Leftovers) | 184-217 (47.4-55.9%) | 122-144 (31.4-37.1%) | 122-144 (31.4-37.1%) | 102-120 (26.3-30.9%) |
| Dragonite (physWall, Leftovers) | 523-616 (135.5-159.6%) | 87-102 (22.5-26.4%) | 174-205 (45.1-53.1%) | 0-0 (0-0%) |
| Melmetal (physWall, Leftovers) | 78-92 (16.5-19.4%) | 210-248 (44.3-52.3%) | 52-61 (11-12.9%) | 176-208 (37.1-43.9%) |
| Gholdengo (specWall, Leftovers) | 146-171 (38.6-45.2%) | 0-0 (0-0%) | 0-0 (0-0%) | 326-384 (86.2-101.6%) |
| Landorus-Therian (physWall, Leftovers) | 270-318 (70.7-83.2%) | 89-105 (23.3-27.5%) | 180-211 (47.1-55.2%) | 0-0 (0-0%) |
| Garchomp (physWall, Leftovers) | 523-616 (124.5-146.7%) | 174-205 (41.4-48.8%) | 174-205 (41.4-48.8%) | 145-171 (34.5-40.7%) |
| Tyranitar-Mega (specWall, no item) | 247-291 (61.1-72%) | 659-776 (163.1-192.1%) | 81-96 (20-23.8%) | 275-323 (68.1-80%) |
| Chesnaught-Mega (physWall, no item) | 171-201 (45-52.9%) | 114-133 (30-35%) | 114-133 (30-35%) | 46-55 (12.1-14.5%) |
| Kingambit (physWall, Leftovers) | 111-131 (27.5-32.4%) | 596-702 (147.5-173.8%) | 74-87 (18.3-21.5%) | 248-292 (61.4-72.3%) |
| Toxapex (specWall, Leftovers) | 244-287 (80.3-94.4%) | 80-94 (26.3-30.9%) | 162-191 (53.3-62.8%) | 271-319 (89.1-104.9%) |

---

### Meganium-Mega

_Flagged for: Special Attack **423** — in OU's top quarter (≥401); BST 625 — above OU's median (600); setup + priority + reliable recovery; reliable recovery on a bulky frame._

**Meganium-Mega** — forme, **UU**, source: override
  Grass/Fairy | BST 625 (80/92/115/143/115/80) | Abilities: Mega Sol
  Engine stats @252 (neutral/positive): Mega Sol: Atk 283/311, SpA 385/423, Spe 259/284
  Item: **forced — Meganiumite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fighting Body Press 80P, Psychic Zen Headbutt 80P
  Special coverage: Normal Wring Out 120S **[power — scales with the target’s **current** HP; quoted against a full-HP target]**, Fire Weather Ball 100S, Rock Ancient Power 60S, Ground Mud-Slap 20S
  Setup: Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain
  Priority: Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]**
  Phazing: Dragon Tail
  Status: Grass Whistle, Poison Powder, Toxic
  Cleric: Aromatherapy
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Detect, Encore, Knock Off, Leech Seed, Light Screen, Magic Coat, Protect, Reflect, Safeguard, Substitute
  Notable: Knock Off, Encore, Substitute

Attacker: **Meganium-Mega**, modest {"spa":252,"spe":252,"hp":4}, **Meganiumite (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Leaf Storm | Wring Out | Weather Ball | Ancient Power |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 159-187 (22.3-26.2%) | 91-107 (12.7-15%) | 114-134 (16-18.8%) | 46-54 (6.4-7.6%) |
| Chansey (specWall, Eviolite) | 127-149 (18-21.2%) | 73-85 (10.4-12.1%) | 91-107 (12.9-15.2%) | 37-43 (5.3-6.1%) |
| Clefable (specWall, Leftovers) | 209-246 (53-62.4%) | 120-141 (30.5-35.8%) | 150-177 (38.1-44.9%) | 60-71 (15.2-18%) |
| Slowbro (physWall, Leftovers) | 652-767 (165.5-194.7%) | 186-219 (47.2-55.6%) | 116-137 (29.4-34.8%) | 94-110 (23.9-27.9%) |
| Slowbro-Mega (physWall, no item) | 652-767 (165.5-194.7%) | 186-219 (47.2-55.6%) | 116-137 (29.4-34.8%) | 94-110 (23.9-27.9%) |
| Slowking (specWall, Leftovers) | 367-432 (93.1-109.6%) | 105-123 (26.6-31.2%) | 65-77 (16.5-19.5%) | 53-62 (13.5-15.7%) |
| Skarmory (physWall, Leftovers) | 90-106 (26.9-31.7%) | 103-122 (30.8-36.5%) | 519-611 (155.4-182.9%) | 104-123 (31.1-36.8%) |
| Skarmory-Mega (physWall, no item) | 67-79 (20.1-23.7%) | 77-91 (23.1-27.2%) | 389-457 (116.5-136.8%) | 78-92 (23.4-27.5%) |
| Celesteela (physWall, Leftovers) | 67-79 (16.8-19.8%) | 76-90 (19.1-22.6%) | 385-453 (96.7-113.8%) | 77-91 (19.3-22.9%) |
| Hippowdon (physWall, Leftovers) | 709-835 (168.8-198.8%) | 203-238 (48.3-56.7%) | 254-299 (60.5-71.2%) | 51-60 (12.1-14.3%) |
| Amoonguss (specWall, Black Sludge) | 56-66 (13-15.3%) | 129-152 (29.9-35.2%) | 324-381 (75-88.2%) | 65-77 (15-17.8%) |
| Goodra-Hisui (specWall, Leftovers) | 36-43 (9.9-11.8%) | 42-49 (11.5-13.5%) | 105-124 (28.8-34.1%) | 21-25 (5.8-6.9%) |
| Rotom-Wash (physWall, Leftovers) | 512-602 (168.4-198%) | 146-172 (48-56.6%) | 91-108 (29.9-35.5%) | 74-87 (24.3-28.6%) |
| Swampert (physWall, Leftovers) | 1184-1393 (293.1-344.8%) | 169-199 (41.8-49.3%) | 106-124 (26.2-30.7%) | 42-50 (10.4-12.4%) |
| Tyranitar (specWall, Leftovers) | 391-460 (96.8-113.9%) | 56-65 (13.9-16.1%) | 70-82 (17.3-20.3%) | 56-66 (13.9-16.3%) |
| Scizor (physWall, Leftovers) | 81-95 (23.5-27.6%) | 93-109 (27-31.7%) | 934-1099 (271.5-319.5%) | 94-110 (27.3-32%) |
| Buzzwole (physWall, Leftovers) | 224-264 (53.6-63.2%) | 256-302 (61.2-72.2%) | 643-756 (153.8-180.9%) | 129-152 (30.9-36.4%) |
| Aegislash (physWall, Leftovers) | 95-112 (29.3-34.6%) | 0-0 (0-0%) | 274-323 (84.6-99.7%) | 27-32 (8.3-9.9%) |
| Tapu Fini (specWall, Leftovers) | 327-384 (95.1-111.6%) | 93-110 (27-32%) | 58-69 (16.9-20.1%) | 47-56 (13.7-16.3%) |
| Corviknight (physWall, Leftovers) | 77-91 (19.3-22.8%) | 88-104 (22-26%) | 444-523 (111-130.8%) | 89-105 (22.3-26.3%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Leaf Storm | Wring Out | Weather Ball | Ancient Power |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 59-70 (16.8-19.9%) | 68-80 (19.3-22.7%) | 686-807 (194.9-229.3%) | 34-40 (9.7-11.4%) |
| Toxapex (physWall, Black Sludge) | 200-236 (65.8-77.6%) | 114-135 (37.5-44.4%) | 72-84 (23.7-27.6%) | 58-68 (19.1-22.4%) |
| Clodsire (specWall, Leftovers) | 195-230 (42-49.6%) | 112-131 (24.1-28.2%) | 140-165 (30.2-35.6%) | 28-33 (6-7.1%) |
| Dondozo (physWall, Leftovers) | 769-905 (152.6-179.6%) | 220-258 (43.7-51.2%) | 137-162 (27.2-32.1%) | 110-130 (21.8-25.8%) |
| Gliscor (physWall, Toxic Orb) | 343-404 (96.9-114.1%) | 196-231 (55.4-65.3%) | 246-289 (69.5-81.6%) | 99-116 (28-32.8%) |
| Ting-Lu (physWall, Leftovers) | 490-576 (91.8-107.9%) | 140-165 (26.2-30.9%) | 175-206 (32.8-38.6%) | 35-41 (6.6-7.7%) |
| Great Tusk (physWall, Leftovers) | 898-1056 (206.9-243.3%) | 256-302 (59-69.6%) | 321-378 (74-87.1%) | 32-38 (7.4-8.8%) |
| Alomomola (physWall, Leftovers) | 1011-1190 (189.3-222.8%) | 289-340 (54.1-63.7%) | 181-213 (33.9-39.9%) | 145-171 (27.2-32%) |
| Slowking-Galar (specWall, Leftovers) | 91-108 (23.1-27.4%) | 105-123 (26.6-31.2%) | 131-155 (33.2-39.3%) | 53-62 (13.5-15.7%) |
| Heatran (specWall, Leftovers) | 47-55 (12.2-14.2%) | 53-63 (13.7-16.3%) | 135-158 (35-40.9%) | 54-64 (14-16.6%) |
| Zamazenta (physWall, Leftovers) | 240-283 (61.9-72.9%) | 137-162 (35.3-41.8%) | 172-203 (44.3-52.3%) | 34-41 (8.8-10.6%) |
| Dragonite (physWall, Leftovers) | 67-79 (17.4-20.5%) | 155-182 (40.2-47.2%) | 97-114 (25.1-29.5%) | 156-184 (40.4-47.7%) |
| Melmetal (physWall, Leftovers) | 192-226 (40.5-47.7%) | 110-129 (23.2-27.2%) | 550-648 (116-136.7%) | 55-65 (11.6-13.7%) |
| Gholdengo (specWall, Leftovers) | 103-122 (27.2-32.3%) | 0-0 (0-0%) | 298-350 (78.8-92.6%) | 30-35 (7.9-9.3%) |
| Landorus-Therian (physWall, Leftovers) | 326-383 (85.3-100.3%) | 186-219 (48.7-57.3%) | 233-274 (61-71.7%) | 94-110 (24.6-28.8%) |
| Garchomp (physWall, Leftovers) | 310-365 (73.8-86.9%) | 177-208 (42.1-49.5%) | 111-130 (26.4-31%) | 44-52 (10.5-12.4%) |
| Tyranitar-Mega (specWall, no item) | 346-407 (85.6-100.7%) | 49-58 (12.1-14.4%) | 62-73 (15.3-18.1%) | 50-59 (12.4-14.6%) |
| Chesnaught-Mega (physWall, no item) | 120-141 (31.6-37.1%) | 137-162 (36.1-42.6%) | 345-406 (90.8-106.8%) | 34-41 (8.9-10.8%) |
| Kingambit (physWall, Leftovers) | 155-182 (38.4-45%) | 88-104 (21.8-25.7%) | 444-523 (109.9-129.5%) | 44-52 (10.9-12.9%) |
| Toxapex (specWall, Leftovers) | 153-180 (50.3-59.2%) | 87-103 (28.6-33.9%) | 55-64 (18.1-21.1%) | 44-52 (14.5-17.1%) |

---

### Regieleki

_Flagged for: Speed **548** — in OU's top quarter (≥350); Special Attack 328 — above OU's median (328); setup + priority + reliable recovery; ability: Transistor._

**Regieleki** — species, **UU**, source: override
  Electric | BST 580 (80/100/50/100/50/200) | Abilities: Transistor
  Engine stats @252 (neutral/positive): Transistor: Atk 299/328, SpA 299/328, Spe 499/548
  Item: **free**
  STAB: Electric Thunder 120S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Flying Acrobatics 110P, Dark Assurance 60P **[power — doubles to 120 if the target has already taken damage this turn]**
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

Attacker: **Regieleki**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Thunder | Acrobatics | Assurance |
| --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 133-157 (18.6-22%) | 274-322 (38.4-45.1%) | 299-352 (41.9-49.3%) |
| Chansey (specWall, Eviolite) | 107-126 (15.2-17.9%) | 222-262 (31.5-37.2%) | 243-286 (34.5-40.6%) |
| Clefable (specWall, Leftovers) | 176-208 (44.7-52.8%) | 85-100 (21.6-25.4%) | 46-54 (11.7-13.7%) |
| Slowbro (physWall, Leftovers) | 548-644 (139.1-163.5%) | 45-53 (11.4-13.5%) | 98-117 (24.9-29.7%) |
| Slowbro-Mega (physWall, no item) | 548-644 (139.1-163.5%) | 31-37 (7.9-9.4%) | 70-81 (17.8-20.6%) |
| Slowking (specWall, Leftovers) | 309-364 (78.4-92.4%) | 79-93 (20.1-23.6%) | 174-204 (44.2-51.8%) |
| Skarmory (physWall, Leftovers) | 609-717 (182.3-214.7%) | 18-22 (5.4-6.6%) | 41-49 (12.3-14.7%) |
| Skarmory-Mega (physWall, no item) | 456-536 (136.5-160.5%) | 22-26 (6.6-7.8%) | 49-58 (14.7-17.4%) |
| Celesteela (physWall, Leftovers) | 452-533 (113.6-133.9%) | 23-27 (5.8-6.8%) | 50-59 (12.6-14.8%) |
| Hippowdon (physWall, Leftovers) | 0-0 (0-0%) | 42-50 (10-11.9%) | 46-54 (11-12.9%) |
| Amoonguss (specWall, Black Sludge) | 94-111 (21.8-25.7%) | 176-208 (40.7-48.1%) | 96-113 (22.2-26.2%) |
| Goodra-Hisui (specWall, Leftovers) | 61-72 (16.8-19.8%) | 32-39 (8.8-10.7%) | 71-84 (19.5-23.1%) |
| Rotom-Wash (physWall, Leftovers) | 215-253 (70.7-83.2%) | 22-27 (7.2-8.9%) | 49-58 (16.1-19.1%) |
| Swampert (physWall, Leftovers) | 0-0 (0-0%) | 52-61 (12.9-15.1%) | 55-66 (13.6-16.3%) |
| Tyranitar (specWall, Leftovers) | 165-193 (40.8-47.8%) | 29-35 (7.2-8.7%) | 32-39 (7.9-9.7%) |
| Scizor (physWall, Leftovers) | 274-322 (79.7-93.6%) | 48-57 (14-16.6%) | 52-61 (15.1-17.7%) |
| Buzzwole (physWall, Leftovers) | 377-443 (90.2-106%) | 156-183 (37.3-43.8%) | 20-24 (4.8-5.7%) |
| Aegislash (physWall, Leftovers) | 161-189 (49.7-58.3%) | 18-20 (5.6-6.2%) | 79-93 (24.4-28.7%) |
| Tapu Fini (specWall, Leftovers) | 275-325 (79.9-94.5%) | 58-68 (16.9-19.8%) | 31-37 (9-10.8%) |
| Corviknight (physWall, Leftovers) | 521-613 (130.3-153.3%) | 23-27 (5.8-6.8%) | 50-59 (12.5-14.8%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Thunder | Acrobatics | Assurance |
| --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 100-118 (28.4-33.5%) | 40-46 (11.4-13.1%) | 42-50 (11.9-14.2%) |
| Toxapex (physWall, Black Sludge) | 338-397 (111.2-130.6%) | 36-42 (11.8-13.8%) | 39-46 (12.8-15.1%) |
| Clodsire (specWall, Leftovers) | 0-0 (0-0%) | 98-117 (21.1-25.2%) | 107-127 (23.1-27.4%) |
| Dondozo (physWall, Leftovers) | 646-760 (128.2-150.8%) | 44-52 (8.7-10.3%) | 48-55 (9.5-10.9%) |
| Gliscor (physWall, Toxic Orb) | 0-0 (0-0%) | 41-49 (11.6-13.8%) | 45-53 (12.7-15%) |
| Ting-Lu (physWall, Leftovers) | 0-0 (0-0%) | 40-48 (7.5-9%) | 22-26 (4.1-4.9%) |
| Great Tusk (physWall, Leftovers) | 0-0 (0-0%) | 80-94 (18.4-21.7%) | 20-24 (4.6-5.5%) |
| Alomomola (physWall, Leftovers) | 848-999 (158.8-187.1%) | 55-65 (10.3-12.2%) | 59-71 (11-13.3%) |
| Slowking-Galar (specWall, Leftovers) | 154-182 (39.1-46.2%) | 79-93 (20.1-23.6%) | 174-204 (44.2-51.8%) |
| Heatran (specWall, Leftovers) | 158-185 (40.9-47.9%) | 31-36 (8-9.3%) | 68-80 (17.6-20.7%) |
| Zamazenta (physWall, Leftovers) | 202-237 (52.1-61.1%) | 88-104 (22.7-26.8%) | 23-27 (5.9-7%) |
| Dragonite (physWall, Leftovers) | 227-267 (58.8-69.2%) | 49-58 (12.7-15%) | 54-63 (14-16.3%) |
| Melmetal (physWall, Leftovers) | 322-379 (67.9-80%) | 18-22 (3.8-4.6%) | 40-48 (8.4-10.1%) |
| Gholdengo (specWall, Leftovers) | 174-205 (46-54.2%) | 33-40 (8.7-10.6%) | 150-178 (39.7-47.1%) |
| Landorus-Therian (physWall, Leftovers) | 0-0 (0-0%) | 52-61 (13.6-16%) | 55-66 (14.4-17.3%) |
| Garchomp (physWall, Leftovers) | 0-0 (0-0%) | 49-58 (11.7-13.8%) | 54-63 (12.9-15%) |
| Tyranitar-Mega (specWall, no item) | 145-171 (35.9-42.3%) | 23-27 (5.7-6.7%) | 24-29 (5.9-7.2%) |
| Chesnaught-Mega (physWall, no item) | 101-118 (26.6-31.1%) | 133-157 (35-41.3%) | 18-20 (4.7-5.3%) |
| Kingambit (physWall, Leftovers) | 260-306 (64.4-75.7%) | 20-24 (5-5.9%) | 23-27 (5.7-6.7%) |
| Toxapex (specWall, Leftovers) | 258-304 (84.9-100%) | 46-54 (15.1-17.8%) | 50-59 (16.4-19.4%) |

---

### Serperior

_Flagged for: Speed **357** — in OU's top quarter (≥350); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Contrary._

**Serperior** — species, **UU**, source: imported (natdex)
  Grass | BST 528 (75/75/95/75/95/113) | Abilities: Overgrow / Contrary
  Engine stats @252 (neutral/positive): Overgrow: Atk 249/273, SpA 249/273, Spe 325/357 — Contrary: Atk 249/273, SpA 249/273, Spe 325/357
  Item: **free**
  STAB: Grass Leaf Storm 140S
  Physical coverage: Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Water Aqua Tail 90P, Dark Knock Off 65P, Flying Aerial Ace 60P
  Special coverage: Normal Wring Out 120S **[power — scales with the target’s **current** HP; quoted against a full-HP target]**, Dragon Dragon Pulse 90S, Psychic Mirror Coat fixedS **[conditional — needs a **special** hit taken from that target this turn]**
  Setup: Calm Mind, Coil, Growth, Swords Dance, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Giga Drain, Mega Drain
  Priority: Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]**
  Removal: Defog
  Phazing: Dragon Tail
  Status: Glare, Toxic
  Cleric: Aromatherapy
  Trapping moves: Mean Look
  Weather/terrain: Grassy Terrain, Sunny Day
  Utility: Knock Off, Leech Seed, Light Screen, Protect, Reflect, Safeguard, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute

Attacker: **Serperior**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Leaf Storm | Double-Edge | Outrage | Iron Tail |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 83-97 (11.6-13.6%) | 496-585 (69.5-81.9%) | 496-585 (69.5-81.9%) | 414-487 (58-68.2%) |
| Chansey (specWall, Eviolite) | 66-78 (9.4-11.1%) | 403-474 (57.2-67.3%) | 403-474 (57.2-67.3%) | 336-396 (47.7-56.3%) |
| Clefable (specWall, Leftovers) | 109-128 (27.7-32.5%) | 153-180 (38.8-45.7%) | 0-0 (0-0%) | 257-302 (65.2-76.6%) |
| Slowbro (physWall, Leftovers) | 338-397 (85.8-100.8%) | 80-94 (20.3-23.9%) | 80-94 (20.3-23.9%) | 33-39 (8.4-9.9%) |
| Slowbro-Mega (physWall, no item) | 338-397 (85.8-100.8%) | 57-66 (14.5-16.8%) | 57-66 (14.5-16.8%) | 23-27 (5.8-6.9%) |
| Slowking (specWall, Leftovers) | 192-226 (48.7-57.4%) | 143-169 (36.3-42.9%) | 143-169 (36.3-42.9%) | 59-70 (15-17.8%) |
| Skarmory (physWall, Leftovers) | 46-54 (13.8-16.2%) | 33-40 (9.9-12%) | 33-40 (9.9-12%) | 28-33 (8.4-9.9%) |
| Skarmory-Mega (physWall, no item) | 35-40 (10.5-12%) | 40-46 (12-13.8%) | 40-46 (12-13.8%) | 33-39 (9.9-11.7%) |
| Celesteela (physWall, Leftovers) | 33-40 (8.3-10.1%) | 41-49 (10.3-12.3%) | 41-49 (10.3-12.3%) | 35-41 (8.8-10.3%) |
| Hippowdon (physWall, Leftovers) | 367-432 (87.4-102.9%) | 76-91 (18.1-21.7%) | 76-91 (18.1-21.7%) | 65-75 (15.5-17.9%) |
| Amoonguss (specWall, Black Sludge) | 28-33 (6.5-7.6%) | 158-187 (36.6-43.3%) | 158-187 (36.6-43.3%) | 132-156 (30.6-36.1%) |
| Goodra-Hisui (specWall, Leftovers) | 18-22 (4.9-6%) | 59-70 (16.2-19.2%) | 119-140 (32.7-38.5%) | 49-58 (13.5-15.9%) |
| Rotom-Wash (physWall, Leftovers) | 266-313 (87.5-103%) | 81-96 (26.6-31.6%) | 81-96 (26.6-31.6%) | 16-19 (5.3-6.3%) |
| Swampert (physWall, Leftovers) | 614-724 (152-179.2%) | 92-109 (22.8-27%) | 92-109 (22.8-27%) | 37-45 (9.2-11.1%) |
| Tyranitar (specWall, Leftovers) | 204-240 (50.5-59.4%) | 54-65 (13.4-16.1%) | 110-130 (27.2-32.2%) | 184-217 (45.5-53.7%) |
| Scizor (physWall, Leftovers) | 41-49 (11.9-14.2%) | 42-50 (12.2-14.5%) | 42-50 (12.2-14.5%) | 35-41 (10.2-11.9%) |
| Buzzwole (physWall, Leftovers) | 115-136 (27.5-32.5%) | 68-80 (16.3-19.1%) | 68-80 (16.3-19.1%) | 57-67 (13.6-16%) |
| Aegislash (physWall, Leftovers) | 49-58 (15.1-17.9%) | 0-0 (0-0%) | 32-37 (9.9-11.4%) | 27-31 (8.3-9.6%) |
| Tapu Fini (specWall, Leftovers) | 171-201 (49.7-58.4%) | 105-124 (30.5-36%) | 0-0 (0-0%) | 88-104 (25.6-30.2%) |
| Corviknight (physWall, Leftovers) | 40-46 (10-11.5%) | 41-49 (10.3-12.3%) | 41-49 (10.3-12.3%) | 35-40 (8.8-10%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Leaf Storm | Double-Edge | Outrage | Iron Tail |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 29-36 (8.2-10.2%) | 35-41 (9.9-11.6%) | 35-41 (9.9-11.6%) | 29-35 (8.2-9.9%) |
| Toxapex (physWall, Black Sludge) | 104-123 (34.2-40.5%) | 63-75 (20.7-24.7%) | 63-75 (20.7-24.7%) | 26-31 (8.6-10.2%) |
| Clodsire (specWall, Leftovers) | 101-119 (21.8-25.6%) | 179-210 (38.6-45.3%) | 179-210 (38.6-45.3%) | 149-176 (32.1-37.9%) |
| Dondozo (physWall, Leftovers) | 397-468 (78.8-92.9%) | 78-92 (15.5-18.3%) | 78-92 (15.5-18.3%) | 32-37 (6.3-7.3%) |
| Gliscor (physWall, Toxic Orb) | 178-209 (50.3-59%) | 74-87 (20.9-24.6%) | 74-87 (20.9-24.6%) | 62-72 (17.5-20.3%) |
| Ting-Lu (physWall, Leftovers) | 254-300 (47.6-56.2%) | 71-84 (13.3-15.7%) | 71-84 (13.3-15.7%) | 59-71 (11-13.3%) |
| Great Tusk (physWall, Leftovers) | 464-546 (106.9-125.8%) | 71-84 (16.4-19.4%) | 71-84 (16.4-19.4%) | 59-70 (13.6-16.1%) |
| Alomomola (physWall, Leftovers) | 522-614 (97.8-115%) | 98-117 (18.4-21.9%) | 98-117 (18.4-21.9%) | 41-48 (7.7-9%) |
| Slowking-Galar (specWall, Leftovers) | 48-55 (12.2-14%) | 143-169 (36.3-42.9%) | 143-169 (36.3-42.9%) | 119-140 (30.2-35.5%) |
| Heatran (specWall, Leftovers) | 23-28 (6-7.3%) | 55-66 (14.2-17.1%) | 55-66 (14.2-17.1%) | 23-27 (6-7%) |
| Zamazenta (physWall, Leftovers) | 124-146 (32-37.6%) | 78-92 (20.1-23.7%) | 78-92 (20.1-23.7%) | 65-76 (16.8-19.6%) |
| Dragonite (physWall, Leftovers) | 35-40 (9.1-10.4%) | 89-105 (23.1-27.2%) | 179-210 (46.4-54.4%) | 74-87 (19.2-22.5%) |
| Melmetal (physWall, Leftovers) | 98-117 (20.7-24.7%) | 33-39 (7-8.2%) | 33-39 (7-8.2%) | 27-32 (5.7-6.8%) |
| Gholdengo (specWall, Leftovers) | 53-63 (14-16.7%) | 0-0 (0-0%) | 62-72 (16.4-19%) | 52-61 (13.8-16.1%) |
| Landorus-Therian (physWall, Leftovers) | 169-198 (44.2-51.8%) | 92-109 (24.1-28.5%) | 92-109 (24.1-28.5%) | 76-91 (19.9-23.8%) |
| Garchomp (physWall, Leftovers) | 161-189 (38.3-45%) | 89-105 (21.2-25%) | 179-210 (42.6-50%) | 74-87 (17.6-20.7%) |
| Tyranitar-Mega (specWall, no item) | 180-213 (44.6-52.7%) | 41-49 (10.1-12.1%) | 84-98 (20.8-24.3%) | 141-166 (34.9-41.1%) |
| Chesnaught-Mega (physWall, no item) | 62-72 (16.3-18.9%) | 58-68 (15.3-17.9%) | 58-68 (15.3-17.9%) | 49-57 (12.9-15%) |
| Kingambit (physWall, Leftovers) | 80-94 (19.8-23.3%) | 37-44 (9.2-10.9%) | 37-44 (9.2-10.9%) | 31-37 (7.7-9.2%) |
| Toxapex (specWall, Leftovers) | 80-93 (26.3-30.6%) | 83-97 (27.3-31.9%) | 83-97 (27.3-31.9%) | 33-40 (10.9-13.2%) |

---

### Thundurus

_Flagged for: Speed **353** — in OU's top quarter (≥350); Special Attack 383 — above OU's median (328); strong setup on a frame fast enough to use it; ability: Prankster/Defiant._

**Thundurus** — species, **UU**, source: imported (natdex)
  Electric/Flying | BST 580 (79/115/70/125/80/111) | Abilities: Prankster / Defiant
  Engine stats @252 (neutral/positive): Prankster: Atk 329/361, SpA 349/383, Spe 321/353 — Defiant: Atk 329/361, SpA 349/383, Spe 321/353
  Item: **free**
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

Attacker: **Thundurus**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Thunder | Acrobatics | Focus Blast | Sludge Wave |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 146-172 (20.4-24.1%) | 328-387 (45.9-54.2%) | 196-230 (27.5-32.2%) | 78-91 (10.9-12.7%) |
| Chansey (specWall, Eviolite) | 117-137 (16.6-19.5%) | 267-315 (37.9-44.7%) | 157-184 (22.3-26.1%) | 62-72 (8.8-10.2%) |
| Clefable (specWall, Leftovers) | 193-227 (49-57.6%) | 102-122 (25.9-31%) | 63-75 (16-19%) | 205-241 (52-61.2%) |
| Slowbro (physWall, Leftovers) | 600-707 (152.3-179.4%) | 54-65 (13.7-16.5%) | 100-117 (25.4-29.7%) | 158-187 (40.1-47.5%) |
| Slowbro-Mega (physWall, no item) | 600-707 (152.3-179.4%) | 39-45 (9.9-11.4%) | 100-117 (25.4-29.7%) | 158-187 (40.1-47.5%) |
| Slowking (specWall, Leftovers) | 339-399 (86-101.3%) | 96-113 (24.4-28.7%) | 55-66 (14-16.8%) | 89-105 (22.6-26.6%) |
| Skarmory (physWall, Leftovers) | 668-786 (200-235.3%) | 23-27 (6.9-8.1%) | 222-261 (66.5-78.1%) | 0-0 (0-0%) |
| Skarmory-Mega (physWall, no item) | 500-588 (149.7-176%) | 27-32 (8.1-9.6%) | 166-196 (49.7-58.7%) | 0-0 (0-0%) |
| Celesteela (physWall, Leftovers) | 496-583 (124.6-146.5%) | 28-33 (7-8.3%) | 165-193 (41.5-48.5%) | 0-0 (0-0%) |
| Hippowdon (physWall, Leftovers) | 0-0 (0-0%) | 52-62 (12.4-14.8%) | 217-256 (51.7-61%) | 85-101 (20.2-24%) |
| Amoonguss (specWall, Black Sludge) | 104-122 (24.1-28.2%) | 214-252 (49.5-58.3%) | 68-80 (15.7-18.5%) | 110-130 (25.5-30.1%) |
| Goodra-Hisui (specWall, Leftovers) | 67-79 (18.4-21.7%) | 40-46 (11-12.6%) | 180-213 (49.5-58.5%) | 0-0 (0-0%) |
| Rotom-Wash (physWall, Leftovers) | 235-278 (77.3-91.4%) | 27-32 (8.9-10.5%) | 157-184 (51.6-60.5%) | 124-146 (40.8-48%) |
| Swampert (physWall, Leftovers) | 0-0 (0-0%) | 62-74 (15.3-18.3%) | 182-213 (45-52.7%) | 71-84 (17.6-20.8%) |
| Tyranitar (specWall, Leftovers) | 180-211 (44.6-52.2%) | 36-42 (8.9-10.4%) | 482-568 (119.3-140.6%) | 46-55 (11.4-13.6%) |
| Scizor (physWall, Leftovers) | 300-353 (87.2-102.6%) | 58-68 (16.9-19.8%) | 200-235 (58.1-68.3%) | 0-0 (0-0%) |
| Buzzwole (physWall, Leftovers) | 413-486 (98.8-116.3%) | 189-223 (45.2-53.3%) | 137-161 (32.8-38.5%) | 218-257 (52.2-61.5%) |
| Aegislash (physWall, Leftovers) | 176-208 (54.3-64.2%) | 22-26 (6.8-8%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Tapu Fini (specWall, Leftovers) | 301-354 (87.5-102.9%) | 71-84 (20.6-24.4%) | 49-58 (14.2-16.9%) | 159-188 (46.2-54.7%) |
| Corviknight (physWall, Leftovers) | 572-673 (143-168.3%) | 28-32 (7-8%) | 189-223 (47.3-55.8%) | 0-0 (0-0%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Thunder | Acrobatics | Focus Blast | Sludge Wave |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 109-128 (31-36.4%) | 49-57 (13.9-16.2%) | 293-345 (83.2-98%) | 0-0 (0-0%) |
| Toxapex (physWall, Black Sludge) | 370-435 (121.7-143.1%) | 44-52 (14.5-17.1%) | 61-71 (20.1-23.4%) | 48-57 (15.8-18.8%) |
| Clodsire (specWall, Leftovers) | 0-0 (0-0%) | 119-141 (25.6-30.4%) | 59-70 (12.7-15.1%) | 23-27 (5-5.8%) |
| Dondozo (physWall, Leftovers) | 708-833 (140.5-165.3%) | 53-62 (10.5-12.3%) | 235-276 (46.6-54.8%) | 187-219 (37.1-43.5%) |
| Gliscor (physWall, Toxic Orb) | 0-0 (0-0%) | 50-59 (14.1-16.7%) | 105-123 (29.7-34.7%) | 83-97 (23.4-27.4%) |
| Ting-Lu (physWall, Leftovers) | 0-0 (0-0%) | 49-58 (9.2-10.9%) | 300-353 (56.2-66.1%) | 59-70 (11-13.1%) |
| Great Tusk (physWall, Leftovers) | 0-0 (0-0%) | 98-115 (22.6-26.5%) | 275-323 (63.4-74.4%) | 109-128 (25.1-29.5%) |
| Alomomola (physWall, Leftovers) | 932-1095 (174.5-205.1%) | 67-79 (12.5-14.8%) | 310-365 (58.1-68.4%) | 245-289 (45.9-54.1%) |
| Slowking-Galar (specWall, Leftovers) | 169-198 (42.9-50.3%) | 96-113 (24.4-28.7%) | 27-32 (6.9-8.1%) | 44-52 (11.2-13.2%) |
| Heatran (specWall, Leftovers) | 172-204 (44.6-52.8%) | 37-44 (9.6-11.4%) | 231-271 (59.8-70.2%) | 0-0 (0-0%) |
| Zamazenta (physWall, Leftovers) | 222-261 (57.2-67.3%) | 107-126 (27.6-32.5%) | 148-174 (38.1-44.8%) | 117-137 (30.2-35.3%) |
| Dragonite (physWall, Leftovers) | 249-293 (64.5-75.9%) | 59-71 (15.3-18.4%) | 83-97 (21.5-25.1%) | 132-156 (34.2-40.4%) |
| Melmetal (physWall, Leftovers) | 353-416 (74.5-87.8%) | 22-27 (4.6-5.7%) | 471-555 (99.4-117.1%) | 0-0 (0-0%) |
| Gholdengo (specWall, Leftovers) | 191-224 (50.5-59.3%) | 41-49 (10.8-13%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Landorus-Therian (physWall, Leftovers) | 0-0 (0-0%) | 62-74 (16.2-19.4%) | 100-117 (26.2-30.6%) | 79-93 (20.7-24.3%) |
| Garchomp (physWall, Leftovers) | 0-0 (0-0%) | 59-71 (14-16.9%) | 189-223 (45-53.1%) | 75-88 (17.9-21%) |
| Tyranitar-Mega (specWall, no item) | 159-187 (39.4-46.3%) | 28-33 (6.9-8.2%) | 426-501 (105.4-124%) | 41-49 (10.1-12.1%) |
| Chesnaught-Mega (physWall, no item) | 110-130 (28.9-34.2%) | 162-192 (42.6-50.5%) | 148-174 (38.9-45.8%) | 235-276 (61.8-72.6%) |
| Kingambit (physWall, Leftovers) | 286-336 (70.8-83.2%) | 26-29 (6.4-7.2%) | 763-898 (188.9-222.3%) | 0-0 (0-0%) |
| Toxapex (specWall, Leftovers) | 283-332 (93.1-109.2%) | 55-66 (18.1-21.7%) | 46-54 (15.1-17.8%) | 36-44 (11.8-14.5%) |

---

### Thundurus-Therian

_Flagged for: Special Attack **427** — in OU's top quarter (≥401); Speed 331 — above OU's median (322); strong setup on a frame fast enough to use it; ability: Volt Absorb._

**Thundurus-Therian** — species, **UU**, source: override
  Electric/Flying | BST 580 (79/105/70/145/80/101) | Abilities: Volt Absorb
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 309/339, SpA 389/427, Spe 301/331
  Item: **free**
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

Attacker: **Thundurus-Therian**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Thunder | Acrobatics | Focus Blast | Sludge Wave |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 162-192 (22.7-26.9%) | 305-358 (42.7-50.1%) | 217-256 (30.4-35.9%) | 85-101 (11.9-14.1%) |
| Chansey (specWall, Eviolite) | 130-153 (18.5-21.7%) | 248-291 (35.2-41.3%) | 174-205 (24.7-29.1%) | 68-81 (9.7-11.5%) |
| Clefable (specWall, Leftovers) | 214-253 (54.3-64.2%) | 96-113 (24.4-28.7%) | 71-84 (18-21.3%) | 227-267 (57.6-67.8%) |
| Slowbro (physWall, Leftovers) | 669-787 (169.8-199.7%) | 50-59 (12.7-15%) | 110-131 (27.9-33.2%) | 176-208 (44.7-52.8%) |
| Slowbro-Mega (physWall, no item) | 669-787 (169.8-199.7%) | 36-42 (9.1-10.7%) | 110-131 (27.9-33.2%) | 176-208 (44.7-52.8%) |
| Slowking (specWall, Leftovers) | 377-444 (95.7-112.7%) | 88-105 (22.3-26.6%) | 62-74 (15.7-18.8%) | 100-117 (25.4-29.7%) |
| Skarmory (physWall, Leftovers) | 744-876 (222.8-262.3%) | 20-24 (6-7.2%) | 248-291 (74.3-87.1%) | 0-0 (0-0%) |
| Skarmory-Mega (physWall, no item) | 556-655 (166.5-196.1%) | 24-29 (7.2-8.7%) | 184-218 (55.1-65.3%) | 0-0 (0-0%) |
| Celesteela (physWall, Leftovers) | 552-650 (138.7-163.3%) | 26-31 (6.5-7.8%) | 183-215 (46-54%) | 0-0 (0-0%) |
| Hippowdon (physWall, Leftovers) | 0-0 (0-0%) | 48-57 (11.4-13.6%) | 241-284 (57.4-67.6%) | 96-113 (22.9-26.9%) |
| Amoonguss (specWall, Black Sludge) | 115-136 (26.6-31.5%) | 198-234 (45.8-54.2%) | 76-91 (17.6-21.1%) | 122-144 (28.2-33.3%) |
| Goodra-Hisui (specWall, Leftovers) | 75-88 (20.6-24.2%) | 36-42 (9.9-11.5%) | 201-237 (55.2-65.1%) | 0-0 (0-0%) |
| Rotom-Wash (physWall, Leftovers) | 262-309 (86.2-101.6%) | 26-29 (8.6-9.5%) | 175-205 (57.6-67.4%) | 139-163 (45.7-53.6%) |
| Swampert (physWall, Leftovers) | 0-0 (0-0%) | 58-68 (14.4-16.8%) | 202-237 (50-58.7%) | 79-93 (19.6-23%) |
| Tyranitar (specWall, Leftovers) | 200-236 (49.5-58.4%) | 33-40 (8.2-9.9%) | 536-631 (132.7-156.2%) | 53-62 (13.1-15.3%) |
| Scizor (physWall, Leftovers) | 334-393 (97.1-114.2%) | 54-63 (15.7-18.3%) | 222-262 (64.5-76.2%) | 0-0 (0-0%) |
| Buzzwole (physWall, Leftovers) | 460-542 (110-129.7%) | 175-206 (41.9-49.3%) | 153-180 (36.6-43.1%) | 243-286 (58.1-68.4%) |
| Aegislash (physWall, Leftovers) | 196-231 (60.5-71.3%) | 20-23 (6.2-7.1%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Tapu Fini (specWall, Leftovers) | 335-395 (97.4-114.8%) | 66-78 (19.2-22.7%) | 55-65 (16-18.9%) | 178-209 (51.7-60.8%) |
| Corviknight (physWall, Leftovers) | 637-750 (159.3-187.5%) | 26-31 (6.5-7.8%) | 211-249 (52.8-62.3%) | 0-0 (0-0%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Thunder | Acrobatics | Focus Blast | Sludge Wave |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 122-144 (34.7-40.9%) | 45-53 (12.8-15.1%) | 327-384 (92.9-109.1%) | 0-0 (0-0%) |
| Toxapex (physWall, Black Sludge) | 412-484 (135.5-159.2%) | 40-48 (13.2-15.8%) | 67-80 (22-26.3%) | 54-63 (17.8-20.7%) |
| Clodsire (specWall, Leftovers) | 0-0 (0-0%) | 110-131 (23.7-28.2%) | 66-78 (14.2-16.8%) | 26-31 (5.6-6.7%) |
| Dondozo (physWall, Leftovers) | 789-928 (156.5-184.1%) | 49-58 (9.7-11.5%) | 262-309 (52-61.3%) | 208-245 (41.3-48.6%) |
| Gliscor (physWall, Toxic Orb) | 0-0 (0-0%) | 46-54 (13-15.3%) | 117-137 (33.1-38.7%) | 92-109 (26-30.8%) |
| Ting-Lu (physWall, Leftovers) | 0-0 (0-0%) | 45-53 (8.4-9.9%) | 334-393 (62.5-73.6%) | 66-78 (12.4-14.6%) |
| Great Tusk (physWall, Leftovers) | 0-0 (0-0%) | 91-107 (21-24.7%) | 306-361 (70.5-83.2%) | 120-143 (27.6-32.9%) |
| Alomomola (physWall, Leftovers) | 1037-1220 (194.2-228.5%) | 62-72 (11.6-13.5%) | 345-406 (64.6-76%) | 274-322 (51.3-60.3%) |
| Slowking-Galar (specWall, Leftovers) | 188-222 (47.7-56.3%) | 88-105 (22.3-26.6%) | 31-36 (7.9-9.1%) | 49-58 (12.4-14.7%) |
| Heatran (specWall, Leftovers) | 192-226 (49.7-58.5%) | 35-41 (9.1-10.6%) | 257-302 (66.6-78.2%) | 0-0 (0-0%) |
| Zamazenta (physWall, Leftovers) | 247-291 (63.7-75%) | 100-117 (25.8-30.2%) | 163-193 (42-49.7%) | 130-153 (33.5-39.4%) |
| Dragonite (physWall, Leftovers) | 278-327 (72-84.7%) | 55-66 (14.2-17.1%) | 92-109 (23.8-28.2%) | 146-172 (37.8-44.6%) |
| Melmetal (physWall, Leftovers) | 393-464 (82.9-97.9%) | 20-24 (4.2-5.1%) | 525-618 (110.8-130.4%) | 0-0 (0-0%) |
| Gholdengo (specWall, Leftovers) | 213-250 (56.3-66.1%) | 39-45 (10.3-11.9%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Landorus-Therian (physWall, Leftovers) | 0-0 (0-0%) | 58-68 (15.2-17.8%) | 110-131 (28.8-34.3%) | 88-104 (23-27.2%) |
| Garchomp (physWall, Leftovers) | 0-0 (0-0%) | 55-66 (13.1-15.7%) | 211-249 (50.2-59.3%) | 83-98 (19.8-23.3%) |
| Tyranitar-Mega (specWall, no item) | 176-209 (43.6-51.7%) | 26-31 (6.4-7.7%) | 474-557 (117.3-137.9%) | 46-54 (11.4-13.4%) |
| Chesnaught-Mega (physWall, no item) | 123-145 (32.4-38.2%) | 152-178 (40-46.8%) | 163-193 (42.9-50.8%) | 261-308 (68.7-81.1%) |
| Kingambit (physWall, Leftovers) | 318-374 (78.7-92.6%) | 23-28 (5.7-6.9%) | 848-999 (209.9-247.3%) | 0-0 (0-0%) |
| Toxapex (specWall, Leftovers) | 314-370 (103.3-121.7%) | 52-62 (17.1-20.4%) | 52-61 (17.1-20.1%) | 41-48 (13.5-15.8%) |

---

### Weavile

_Flagged for: Speed **383** — in OU's top quarter (≥350); Attack 372 — above OU's median (372); setup + priority + reliable recovery; strong setup on a frame fast enough to use it._

**Weavile** — species, **UU**, source: override
  Dark/Ice | BST 510 (70/120/65/45/85/125) | Abilities: Pressure / Pickpocket
  Engine stats @252 (neutral/positive): Pressure: Atk 339/372, SpA 189/207, Spe 349/383 — Pickpocket: Atk 339/372, SpA 189/207, Spe 349/383
  Item: **free**
  STAB: Dark Foul Play 95P · Ice Icicle Crash 85P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Water Surf 95S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Mud-Slap 20S
  Setup: Agility, Calm Mind, Defense Curl, Hone Claws, Nasty Plot, Swords Dance
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**, Ice Shard 40P Ice (+1)
  Pivot: Baton Pass
  Status: Toxic
  Weather/terrain: Hail, Rain Dance, Snowscape, Sunny Day
  Utility: Detect, Knock Off, Protect, Reflect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Baton Pass, Focus Punch

Attacker: **Weavile**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Foul Play | Icicle Crash | Focus Punch | Double-Edge |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 120-141 (16.8-19.7%) | 718-846 (100.6-118.5%) | 1690-1987 (236.7-278.3%) | 676-795 (94.7-111.3%) |
| Chansey (specWall, Eviolite) | 81-96 (11.5-13.6%) | 583-687 (82.8-97.6%) | 1371-1614 (194.7-229.3%) | 548-646 (77.8-91.8%) |
| Clefable (specWall, Leftovers) | 58-68 (14.7-17.3%) | 223-262 (56.6-66.5%) | 130-153 (33-38.8%) | 209-245 (53-62.2%) |
| Slowbro (physWall, Leftovers) | 146-172 (37.1-43.7%) | 58-68 (14.7-17.3%) | 67-80 (17-20.3%) | 109-128 (27.7-32.5%) |
| Slowbro-Mega (physWall, no item) | 104-122 (26.4-31%) | 40-48 (10.2-12.2%) | 46-55 (11.7-14%) | 76-89 (19.3-22.6%) |
| Slowking (specWall, Leftovers) | 231-271 (58.6-68.8%) | 104-122 (26.4-31%) | 120-141 (30.5-35.8%) | 193-228 (49-57.9%) |
| Skarmory (physWall, Leftovers) | 65-76 (19.5-22.8%) | 98-117 (29.3-35%) | 114-135 (34.1-40.4%) | 45-54 (13.5-16.2%) |
| Skarmory-Mega (physWall, no item) | 122-144 (36.5-43.1%) | 117-137 (35-41%) | 136-161 (40.7-48.2%) | 54-63 (16.2-18.9%) |
| Celesteela (physWall, Leftovers) | 96-114 (24.1-28.6%) | 122-144 (30.7-36.2%) | 143-167 (35.9-42%) | 57-67 (14.3-16.8%) |
| Hippowdon (physWall, Leftovers) | 96-113 (22.9-26.9%) | 223-263 (53.1-62.6%) | 130-153 (31-36.4%) | 104-122 (24.8-29%) |
| Amoonguss (specWall, Black Sludge) | 141-166 (32.6-38.4%) | 461-543 (106.7-125.7%) | 133-158 (30.8-36.6%) | 215-254 (49.8-58.8%) |
| Goodra-Hisui (specWall, Leftovers) | 120-143 (33-39.3%) | 172-202 (47.3-55.5%) | 404-474 (111-130.2%) | 80-94 (22-25.8%) |
| Rotom-Wash (physWall, Leftovers) | 66-78 (21.7-25.7%) | 59-70 (19.4-23%) | 139-163 (45.7-53.6%) | 111-131 (36.5-43.1%) |
| Swampert (physWall, Leftovers) | 113-133 (28-32.9%) | 133-157 (32.9-38.9%) | 156-183 (38.6-45.3%) | 124-146 (30.7-36.1%) |
| Tyranitar (specWall, Leftovers) | 71-84 (17.6-20.8%) | 159-187 (39.4-46.3%) | 746-877 (184.7-217.1%) | 74-87 (18.3-21.5%) |
| Scizor (physWall, Leftovers) | 122-144 (35.5-41.9%) | 62-72 (18-20.9%) | 145-171 (42.2-49.7%) | 58-68 (16.9-19.8%) |
| Buzzwole (physWall, Leftovers) | 50-59 (12-14.1%) | 100-117 (23.9-28%) | 57-67 (13.6-16%) | 92-109 (22-26.1%) |
| Aegislash (physWall, Leftovers) | 88-104 (27.2-32.1%) | 46-54 (14.2-16.7%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Tapu Fini (specWall, Leftovers) | 42-50 (12.2-14.5%) | 76-89 (22.1-25.9%) | 89-105 (25.9-30.5%) | 143-169 (41.6-49.1%) |
| Corviknight (physWall, Leftovers) | 84-100 (21-25%) | 120-143 (30-35.8%) | 140-166 (35-41.5%) | 55-66 (13.8-16.5%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Foul Play | Icicle Crash | Focus Punch | Double-Edge |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 76-91 (21.6-25.9%) | 104-122 (29.5-34.7%) | 241-284 (68.5-80.7%) | 48-57 (13.6-16.2%) |
| Toxapex (physWall, Black Sludge) | 50-59 (16.4-19.4%) | 46-54 (15.1-17.8%) | 53-63 (17.4-20.7%) | 87-102 (28.6-33.6%) |
| Clodsire (specWall, Leftovers) | 144-170 (31-36.6%) | 520-612 (112.1-131.9%) | 152-178 (32.8-38.4%) | 243-287 (52.4-61.9%) |
| Dondozo (physWall, Leftovers) | 89-105 (17.7-20.8%) | 57-66 (11.3-13.1%) | 132-156 (26.2-31%) | 106-124 (21-24.6%) |
| Gliscor (physWall, Toxic Orb) | 80-94 (22.6-26.6%) | 431-508 (121.8-143.5%) | 62-72 (17.5-20.3%) | 100-118 (28.2-33.3%) |
| Ting-Lu (physWall, Leftovers) | 44-52 (8.2-9.7%) | 209-247 (39.1-46.3%) | 243-286 (45.5-53.6%) | 97-114 (18.2-21.3%) |
| Great Tusk (physWall, Leftovers) | 50-59 (11.5-13.6%) | 208-244 (47.9-56.2%) | 120-141 (27.6-32.5%) | 96-114 (22.1-26.3%) |
| Alomomola (physWall, Leftovers) | 89-105 (16.7-19.7%) | 71-84 (13.3-15.7%) | 167-197 (31.3-36.9%) | 133-158 (24.9-29.6%) |
| Slowking-Galar (specWall, Leftovers) | 206-243 (52.3-61.7%) | 208-244 (52.8-61.9%) | 59-70 (15-17.8%) | 193-228 (49-57.9%) |
| Heatran (specWall, Leftovers) | 106-124 (27.5-32.1%) | 40-48 (10.4-12.4%) | 384-452 (99.5-117.1%) | 76-89 (19.7-23.1%) |
| Zamazenta (physWall, Leftovers) | 54-65 (13.9-16.8%) | 114-133 (29.4-34.3%) | 132-156 (34-40.2%) | 106-124 (27.3-32%) |
| Dragonite (physWall, Leftovers) | 130-152 (33.7-39.4%) | 518-611 (134.2-158.3%) | 75-88 (19.4-22.8%) | 120-141 (31.1-36.5%) |
| Melmetal (physWall, Leftovers) | 104-122 (21.9-25.7%) | 48-57 (10.1-12%) | 227-266 (47.9-56.1%) | 45-53 (9.5-11.2%) |
| Gholdengo (specWall, Leftovers) | 170-200 (45-52.9%) | 89-105 (23.5-27.8%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Landorus-Therian (physWall, Leftovers) | 143-169 (37.4-44.2%) | 536-631 (140.3-165.2%) | 78-91 (20.4-23.8%) | 124-146 (32.5-38.2%) |
| Garchomp (physWall, Leftovers) | 126-148 (30-35.2%) | 518-611 (123.3-145.5%) | 150-176 (35.7-41.9%) | 120-141 (28.6-33.6%) |
| Tyranitar-Mega (specWall, no item) | 65-76 (16.1-18.8%) | 122-144 (30.2-35.6%) | 570-670 (141.1-165.8%) | 57-66 (14.1-16.3%) |
| Chesnaught-Mega (physWall, no item) | 42-50 (11.1-13.2%) | 170-201 (44.7-52.9%) | 98-115 (25.8-30.3%) | 79-93 (20.8-24.5%) |
| Kingambit (physWall, Leftovers) | 55-65 (13.6-16.1%) | 54-65 (13.4-16.1%) | 516-607 (127.7-150.2%) | 50-59 (12.4-14.6%) |
| Toxapex (specWall, Leftovers) | 58-70 (19.1-23%) | 59-70 (19.4-23%) | 70-81 (23-26.6%) | 113-132 (37.2-43.4%) |

---

### Zoroark-Hisui

_Flagged for: Speed **350** — in OU's top quarter (≥350); Special Attack 383 — above OU's median (328); setup + priority + reliable recovery; strong setup on a frame fast enough to use it._

**Zoroark-Hisui** — species, **UU**, source: imported (natdex)
  Normal/Ghost | BST 510 (55/100/60/125/60/110) | Abilities: Illusion
  Engine stats @252 (neutral/positive): Illusion: Atk 299/328, SpA 349/383, Spe 319/350
  Item: **free**
  STAB: Normal Mega Kick 120P · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Ground Dig 100 (charge)P, Dark Foul Play 95P, Flying Bounce 85 (charge)P, Bug Skitter Smack 70P
  Special coverage: Fighting Focus Blast 120S, Fire Flamethrower 95S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Dark Night Daze 85S, Grass Grass Knot 60S
  Setup: Agility, Calm Mind, Hone Claws, Nasty Plot, Swords Dance
  Reliable recovery: Rest
  Priority: Sucker Punch 80P Dark (+1), Shadow Sneak 40P Ghost (+1)
  Pivot: U-turn
  Phazing: Roar
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Rain Dance, Snowscape, Sunny Day
  Utility: Detect, Encore, Knock Off, Memento, Pain Split, Protect, Substitute, Taunt, Trick
  Notable: Knock Off, Trick, Encore, Taunt, Substitute, Focus Punch

Attacker: **Zoroark-Hisui**, timid {"spa":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Mega Kick | Poltergeist | Focus Blast | Flamethrower |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 635-747 (88.9-104.6%) | 0-0 (0-0%) | 196-230 (27.5-32.2%) | 78-91 (10.9-12.7%) |
| Chansey (specWall, Eviolite) | 516-607 (73.3-86.2%) | 0-0 (0-0%) | 157-184 (22.3-26.1%) | 62-72 (8.8-10.2%) |
| Clefable (specWall, Leftovers) | 197-232 (50-58.9%) | 180-213 (45.7-54.1%) | 63-75 (16-19%) | 102-120 (25.9-30.5%) |
| Slowbro (physWall, Leftovers) | 104-122 (26.4-31%) | 191-224 (48.5-56.9%) | 100-117 (25.4-29.7%) | 79-93 (20.1-23.6%) |
| Slowbro-Mega (physWall, no item) | 72-85 (18.3-21.6%) | 135-158 (34.3-40.1%) | 100-117 (25.4-29.7%) | 79-93 (20.1-23.6%) |
| Slowking (specWall, Leftovers) | 183-215 (46.4-54.6%) | 336-396 (85.3-100.5%) | 55-66 (14-16.8%) | 44-52 (11.2-13.2%) |
| Skarmory (physWall, Leftovers) | 44-52 (13.2-15.6%) | 80-94 (24-28.1%) | 222-261 (66.5-78.1%) | 353-416 (105.7-124.6%) |
| Skarmory-Mega (physWall, no item) | 52-61 (15.6-18.3%) | 94-111 (28.1-33.2%) | 166-196 (49.7-58.7%) | 265-312 (79.3-93.4%) |
| Celesteela (physWall, Leftovers) | 53-63 (13.3-15.8%) | 100-117 (25.1-29.4%) | 165-193 (41.5-48.5%) | 262-309 (65.8-77.6%) |
| Hippowdon (physWall, Leftovers) | 98-117 (23.3-27.9%) | 91-106 (21.7-25.2%) | 217-256 (51.7-61%) | 172-202 (41-48.1%) |
| Amoonguss (specWall, Black Sludge) | 204-240 (47.2-55.6%) | 187-219 (43.3-50.7%) | 68-80 (15.7-18.5%) | 221-260 (51.2-60.2%) |
| Goodra-Hisui (specWall, Leftovers) | 76-89 (20.9-24.5%) | 140-165 (38.5-45.3%) | 180-213 (49.5-58.5%) | 71-84 (19.5-23.1%) |
| Rotom-Wash (physWall, Leftovers) | 105-124 (34.5-40.8%) | 97-114 (31.9-37.5%) | 157-184 (51.6-60.5%) | 62-72 (20.4-23.7%) |
| Swampert (physWall, Leftovers) | 118-139 (29.2-34.4%) | 109-128 (27-31.7%) | 182-213 (45-52.7%) | 71-84 (17.6-20.8%) |
| Tyranitar (specWall, Leftovers) | 70-83 (17.3-20.5%) | 65-75 (16.1-18.6%) | 482-568 (119.3-140.6%) | 46-55 (11.4-13.6%) |
| Scizor (physWall, Leftovers) | 54-65 (15.7-18.9%) | 101-119 (29.4-34.6%) | 200-235 (58.1-68.3%) | 635-748 (184.6-217.4%) |
| Buzzwole (physWall, Leftovers) | 88-104 (21.1-24.9%) | 80-94 (19.1-22.5%) | 137-161 (32.8-38.5%) | 436-514 (104.3-123%) |
| Aegislash (physWall, Leftovers) | 0-0 (0-0%) | 154-182 (47.5-56.2%) | 0-0 (0-0%) | 187-219 (57.7-67.6%) |
| Tapu Fini (specWall, Leftovers) | 135-159 (39.2-46.2%) | 124-146 (36-42.4%) | 49-58 (14.2-16.9%) | 39-46 (11.3-13.4%) |
| Corviknight (physWall, Leftovers) | 53-62 (13.3-15.5%) | 98-115 (24.5-28.8%) | 189-223 (47.3-55.8%) | 302-356 (75.5-89%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Mega Kick | Poltergeist | Focus Blast | Flamethrower |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 45-53 (12.8-15.1%) | 84-100 (23.9-28.4%) | 293-345 (83.2-98%) | 468-549 (133-156%) |
| Toxapex (physWall, Black Sludge) | 83-97 (27.3-31.9%) | 75-89 (24.7-29.3%) | 61-71 (20.1-23.4%) | 48-57 (15.8-18.8%) |
| Clodsire (specWall, Leftovers) | 230-270 (49.6-58.2%) | 210-248 (45.3-53.4%) | 59-70 (12.7-15.1%) | 94-111 (20.3-23.9%) |
| Dondozo (physWall, Leftovers) | 101-118 (20-23.4%) | 92-109 (18.3-21.6%) | 235-276 (46.6-54.8%) | 93-109 (18.5-21.6%) |
| Gliscor (physWall, Toxic Orb) | 94-111 (26.6-31.4%) | 87-102 (24.6-28.8%) | 105-123 (29.7-34.7%) | 166-196 (46.9-55.4%) |
| Ting-Lu (physWall, Leftovers) | 92-109 (17.2-20.4%) | 41-49 (7.7-9.2%) | 300-353 (56.2-66.1%) | 119-140 (22.3-26.2%) |
| Great Tusk (physWall, Leftovers) | 92-107 (21.2-24.7%) | 84-100 (19.4-23%) | 275-323 (63.4-74.4%) | 218-257 (50.2-59.2%) |
| Alomomola (physWall, Leftovers) | 127-149 (23.8-27.9%) | 117-137 (21.9-25.7%) | 310-365 (58.1-68.4%) | 122-144 (22.8-27%) |
| Slowking-Galar (specWall, Leftovers) | 183-215 (46.4-54.6%) | 336-396 (85.3-100.5%) | 27-32 (6.9-8.1%) | 89-105 (22.6-26.6%) |
| Heatran (specWall, Leftovers) | 72-85 (18.7-22%) | 133-157 (34.5-40.7%) | 231-271 (59.8-70.2%) | 91-107 (23.6-27.7%) |
| Zamazenta (physWall, Leftovers) | 101-118 (26-30.4%) | 92-109 (23.7-28.1%) | 148-174 (38.1-44.8%) | 117-137 (30.2-35.3%) |
| Dragonite (physWall, Leftovers) | 114-135 (29.5-35%) | 105-123 (27.2-31.9%) | 83-97 (21.5-25.1%) | 66-78 (17.1-20.2%) |
| Melmetal (physWall, Leftovers) | 42-50 (8.9-10.5%) | 79-93 (16.7-19.6%) | 471-555 (99.4-117.1%) | 374-440 (78.9-92.8%) |
| Gholdengo (specWall, Leftovers) | 0-0 (0-0%) | 293-345 (77.5-91.3%) | 0-0 (0-0%) | 202-239 (53.4-63.2%) |
| Landorus-Therian (physWall, Leftovers) | 118-139 (30.9-36.4%) | 109-128 (28.5-33.5%) | 100-117 (26.2-30.6%) | 158-187 (41.4-49%) |
| Garchomp (physWall, Leftovers) | 114-135 (27.1-32.1%) | 105-123 (25-29.3%) | 189-223 (45-53.1%) | 75-88 (17.9-21%) |
| Tyranitar-Mega (specWall, no item) | 53-63 (13.1-15.6%) | 49-58 (12.1-14.4%) | 426-501 (105.4-124%) | 41-49 (10.1-12.1%) |
| Chesnaught-Mega (physWall, no item) | 75-88 (19.7-23.2%) | 68-81 (17.9-21.3%) | 148-174 (38.9-45.8%) | 235-276 (61.8-72.6%) |
| Kingambit (physWall, Leftovers) | 48-57 (11.9-14.1%) | 44-52 (10.9-12.9%) | 763-898 (188.9-222.3%) | 302-356 (74.8-88.1%) |
| Toxapex (specWall, Leftovers) | 106-126 (34.9-41.4%) | 98-115 (32.2-37.8%) | 46-54 (15.1-17.8%) | 36-44 (11.8-14.5%) |

---

### Chandelure-Mega

_Flagged for: Special Attack **493** — in OU's top quarter (≥401); BST 620 — above OU's median (600); reliable recovery on a bulky frame._

**Chandelure-Mega** — forme, **UU**, source: override
  Ghost/Fire | BST 620 (60/75/110/175/110/90) | Abilities: Infiltrator
  Engine stats @252 (neutral/positive): Infiltrator: Atk 249/273, SpA 449/493, Spe 279/306
  Item: **forced — Chandelurite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Ghost Shadow Ball 80S · Fire Overheat 140S
  Physical coverage: Normal Return 102P, Dark Lash Out 75P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Dark Dark Pulse 80S, Normal Tera Blast 80S, Electric Shock Wave 60S, Poison Clear Smog 50S
  Setup: Acid Armor, Calm Mind
  Reliable recovery: Rest
  Drain/Rest-only: Dream Eater
  Status: Toxic, Will-O-Wisp
  Weather/terrain: Sunny Day
  Utility: Clear Smog, Haze, Memento, Pain Split, Protect, Safeguard, Substitute, Taunt, Trick, Trick Room
  Notable: Trick, Taunt, Substitute, Trick Room

Attacker: **Chandelure-Mega**, modest {"spa":252,"spe":252,"hp":4}, **Chandelurite (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Shadow Ball | Overheat | Solar Beam | Dream Eater |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 0-0 (0-0%) | 185-217 (25.9-30.4%) | 105-124 (14.7-17.4%) | 88-104 (12.3-14.6%) |
| Chansey (specWall, Eviolite) | 0-0 (0-0%) | 148-174 (21-24.7%) | 84-99 (11.9-14.1%) | 70-83 (9.9-11.8%) |
| Clefable (specWall, Leftovers) | 140-165 (35.5-41.9%) | 244-287 (61.9-72.8%) | 139-164 (35.3-41.6%) | 116-137 (29.4-34.8%) |
| Slowbro (physWall, Leftovers) | 436-513 (110.7-130.2%) | 189-223 (48-56.6%) | 434-511 (110.2-129.7%) | 90-106 (22.8-26.9%) |
| Slowbro-Mega (physWall, no item) | 436-513 (110.7-130.2%) | 189-223 (48-56.6%) | 434-511 (110.2-129.7%) | 90-106 (22.8-26.9%) |
| Slowking (specWall, Leftovers) | 246-289 (62.4-73.4%) | 106-125 (26.9-31.7%) | 244-287 (61.9-72.8%) | 51-60 (12.9-15.2%) |
| Skarmory (physWall, Leftovers) | 242-285 (72.5-85.3%) | 845-994 (253-297.6%) | 60-71 (18-21.3%) | 100-118 (29.9-35.3%) |
| Skarmory-Mega (physWall, no item) | 181-213 (54.2-63.8%) | 631-742 (188.9-222.2%) | 45-53 (13.5-15.9%) | 75-88 (22.5-26.3%) |
| Celesteela (physWall, Leftovers) | 180-211 (45.2-53%) | 626-736 (157.3-184.9%) | 44-52 (11.1-13.1%) | 74-88 (18.6-22.1%) |
| Hippowdon (physWall, Leftovers) | 237-279 (56.4-66.4%) | 413-486 (98.3-115.7%) | 236-278 (56.2-66.2%) | 197-232 (46.9-55.2%) |
| Amoonguss (specWall, Black Sludge) | 151-177 (35-41%) | 525-618 (121.5-143.1%) | 37-44 (8.6-10.2%) | 251-295 (58.1-68.3%) |
| Goodra-Hisui (specWall, Leftovers) | 98-116 (26.9-31.9%) | 171-201 (47-55.2%) | 24-28 (6.6-7.7%) | 41-48 (11.3-13.2%) |
| Rotom-Wash (physWall, Leftovers) | 171-201 (56.3-66.1%) | 149-175 (49-57.6%) | 341-401 (112.2-131.9%) | 142-167 (46.7-54.9%) |
| Swampert (physWall, Leftovers) | 198-233 (49-57.7%) | 172-202 (42.6-50%) | 789-928 (195.3-229.7%) | 164-193 (40.6-47.8%) |
| Tyranitar (specWall, Leftovers) | 65-77 (16.1-19.1%) | 113-134 (28-33.2%) | 130-153 (32.2-37.9%) | 0-0 (0-0%) |
| Scizor (physWall, Leftovers) | 218-256 (63.4-74.4%) | 1518-1786 (441.3-519.2%) | 54-63 (15.7-18.3%) | 90-106 (26.2-30.8%) |
| Buzzwole (physWall, Leftovers) | 300-352 (71.8-84.2%) | 1046-1230 (250.2-294.3%) | 149-175 (35.6-41.9%) | 499-587 (119.4-140.4%) |
| Aegislash (physWall, Leftovers) | 256-301 (79-92.9%) | 445-523 (137.3-161.4%) | 63-74 (19.4-22.8%) | 53-62 (16.4-19.1%) |
| Tapu Fini (specWall, Leftovers) | 109-129 (31.7-37.5%) | 95-111 (27.6-32.3%) | 217-256 (63.1-74.4%) | 91-107 (26.5-31.1%) |
| Corviknight (physWall, Leftovers) | 207-244 (51.8-61%) | 722-850 (180.5-212.5%) | 51-60 (12.8-15%) | 86-101 (21.5-25.3%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Shadow Ball | Overheat | Solar Beam | Dream Eater |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 160-188 (45.5-53.4%) | 1113-1309 (316.2-371.9%) | 39-46 (11.1-13.1%) | 66-78 (18.8-22.2%) |
| Toxapex (physWall, Black Sludge) | 134-158 (44.1-52%) | 116-137 (38.2-45.1%) | 133-157 (43.8-51.6%) | 223-262 (73.4-86.2%) |
| Clodsire (specWall, Leftovers) | 131-154 (28.2-33.2%) | 227-268 (48.9-57.8%) | 130-153 (28-33%) | 218-256 (47-55.2%) |
| Dondozo (physWall, Leftovers) | 257-302 (51-59.9%) | 223-263 (44.2-52.2%) | 512-602 (101.6-119.4%) | 213-251 (42.3-49.8%) |
| Gliscor (physWall, Toxic Orb) | 229-270 (64.7-76.3%) | 399-470 (112.7-132.8%) | 228-269 (64.4-76%) | 190-224 (53.7-63.3%) |
| Ting-Lu (physWall, Leftovers) | 81-96 (15.2-18%) | 284-335 (53.2-62.7%) | 326-383 (61-71.7%) | 0-0 (0-0%) |
| Great Tusk (physWall, Leftovers) | 300-352 (69.1-81.1%) | 523-615 (120.5-141.7%) | 598-703 (137.8-162%) | 499-587 (115-135.3%) |
| Alomomola (physWall, Leftovers) | 337-397 (63.1-74.3%) | 294-346 (55.1-64.8%) | 673-792 (126-148.3%) | 281-330 (52.6-61.8%) |
| Slowking-Galar (specWall, Leftovers) | 246-289 (62.4-73.4%) | 213-251 (54.1-63.7%) | 61-71 (15.5-18%) | 102-120 (25.9-30.5%) |
| Heatran (specWall, Leftovers) | 126-148 (32.6-38.3%) | 218-257 (56.5-66.6%) | 31-36 (8-9.3%) | 52-61 (13.5-15.8%) |
| Zamazenta (physWall, Leftovers) | 161-189 (41.5-48.7%) | 280-329 (72.2-84.8%) | 160-188 (41.2-48.5%) | 268-315 (69.1-81.2%) |
| Dragonite (physWall, Leftovers) | 181-213 (46.9-55.2%) | 157-185 (40.7-47.9%) | 45-53 (11.7-13.7%) | 150-177 (38.9-45.9%) |
| Melmetal (physWall, Leftovers) | 257-302 (54.2-63.7%) | 895-1053 (188.8-222.2%) | 128-150 (27-31.6%) | 106-125 (22.4-26.4%) |
| Gholdengo (specWall, Leftovers) | 278-327 (73.5-86.5%) | 483-568 (127.8-150.3%) | 69-81 (18.3-21.4%) | 57-68 (15.1-18%) |
| Landorus-Therian (physWall, Leftovers) | 218-256 (57.1-67%) | 379-446 (99.2-116.8%) | 217-255 (56.8-66.8%) | 181-213 (47.4-55.8%) |
| Garchomp (physWall, Leftovers) | 207-244 (49.3-58.1%) | 180-212 (42.9-50.5%) | 206-243 (49-57.9%) | 172-203 (41-48.3%) |
| Tyranitar-Mega (specWall, no item) | 58-68 (14.4-16.8%) | 100-118 (24.8-29.2%) | 115-135 (28.5-33.4%) | 0-0 (0-0%) |
| Chesnaught-Mega (physWall, no item) | 161-189 (42.4-49.7%) | 560-659 (147.4-173.4%) | 80-94 (21.1-24.7%) | 268-315 (70.5-82.9%) |
| Kingambit (physWall, Leftovers) | 103-122 (25.5-30.2%) | 722-850 (178.7-210.4%) | 103-121 (25.5-30%) | 0-0 (0-0%) |
| Toxapex (specWall, Leftovers) | 102-121 (33.6-39.8%) | 89-104 (29.3-34.2%) | 102-120 (33.6-39.5%) | 170-200 (55.9-65.8%) |

---

### Conkeldurr

_Flagged for: Attack **416** — in OU's top quarter (≥416); setup + priority + reliable recovery; ability: Guts/Sheer Force._

**Conkeldurr** — species, **UU**, source: imported (natdex)
  Fighting | BST 505 (105/140/95/55/65/45) | Abilities: Guts / Sheer Force / Iron Fist
  Engine stats @252 (neutral/positive): Guts: Atk 379/416, SpA 209/229, Spe 189/207 — Sheer Force: Atk 379/416, SpA 209/229, Spe 189/207 — Iron Fist: Atk 379/416, SpA 209/229, Spe 189/207
  Item: **free**
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Hard Press 100P, Rock Stone Edge 100P, Poison Poison Jab 80P, Fire Fire Punch 75P
  Special coverage: Normal Tera Blast 80S, Grass Grass Knot 60S
  Setup: Bulk Up, Work Up
  Reliable recovery: Rest
  Drain/Rest-only: Drain Punch
  Priority: Upper Hand 65P Fighting (+3), Mach Punch 40P Fighting (+1)
  Removal: Defog
  Status: Toxic
  Trapping moves: Block
  Weather/terrain: Rain Dance, Sunny Day
  Utility: Detect, Knock Off, Protect, Substitute, Taunt
  Notable: Knock Off, Taunt, Substitute, Focus Punch

Attacker: **Conkeldurr**, adamant {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Focus Punch | Double-Edge | Earthquake | Hard Press |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 3108-3658 (435.3-512.3%) | 829-975 (116.1-136.6%) | 691-813 (96.8-113.9%) | 691-813 (96.8-113.9%) |
| Chansey (specWall, Eviolite) | 2524-2969 (358.5-421.7%) | 673-791 (95.6-112.4%) | 561-660 (79.7-93.8%) | 561-660 (79.7-93.8%) |
| Clefable (specWall, Leftovers) | 239-282 (60.7-71.6%) | 256-301 (65-76.4%) | 213-252 (54.1-64%) | 427-504 (108.4-127.9%) |
| Slowbro (physWall, Leftovers) | 124-146 (31.5-37.1%) | 133-157 (33.8-39.8%) | 111-131 (28.2-33.2%) | 55-65 (14-16.5%) |
| Slowbro-Mega (physWall, no item) | 87-102 (22.1-25.9%) | 93-110 (23.6-27.9%) | 78-92 (19.8-23.4%) | 39-45 (9.9-11.4%) |
| Slowking (specWall, Leftovers) | 222-262 (56.3-66.5%) | 237-279 (60.2-70.8%) | 198-234 (50.3-59.4%) | 98-117 (24.9-29.7%) |
| Skarmory (physWall, Leftovers) | 211-249 (63.2-74.6%) | 55-66 (16.5-19.8%) | 0-0 (0-0%) | 46-55 (13.8-16.5%) |
| Skarmory-Mega (physWall, no item) | 250-295 (74.9-88.3%) | 66-78 (19.8-23.4%) | 0-0 (0-0%) | 55-65 (16.5-19.5%) |
| Celesteela (physWall, Leftovers) | 262-308 (65.8-77.4%) | 70-81 (17.6-20.4%) | 0-0 (0-0%) | 58-68 (14.6-17.1%) |
| Hippowdon (physWall, Leftovers) | 239-280 (56.9-66.7%) | 127-149 (30.2-35.5%) | 106-124 (25.2-29.5%) | 106-124 (25.2-29.5%) |
| Amoonguss (specWall, Black Sludge) | 248-291 (57.4-67.4%) | 265-312 (61.3-72.2%) | 221-260 (51.2-60.2%) | 221-260 (51.2-60.2%) |
| Goodra-Hisui (specWall, Leftovers) | 742-873 (203.8-239.8%) | 98-115 (26.9-31.6%) | 331-390 (90.9-107.1%) | 81-97 (22.3-26.6%) |
| Rotom-Wash (physWall, Leftovers) | 254-300 (83.6-98.7%) | 136-159 (44.7-52.3%) | 228-269 (75-88.5%) | 28-32 (9.2-10.5%) |
| Swampert (physWall, Leftovers) | 286-336 (70.8-83.2%) | 153-180 (37.9-44.6%) | 127-150 (31.4-37.1%) | 63-75 (15.6-18.6%) |
| Tyranitar (specWall, Leftovers) | 1370-1612 (339.1-399%) | 91-106 (22.5-26.2%) | 305-360 (75.5-89.1%) | 305-360 (75.5-89.1%) |
| Scizor (physWall, Leftovers) | 267-314 (77.6-91.3%) | 71-83 (20.6-24.1%) | 119-140 (34.6-40.7%) | 59-70 (17.2-20.3%) |
| Buzzwole (physWall, Leftovers) | 105-124 (25.1-29.7%) | 113-133 (27-31.8%) | 46-55 (11-13.2%) | 94-111 (22.5-26.6%) |
| Aegislash (physWall, Leftovers) | 0-0 (0-0%) | 0-0 (0-0%) | 180-211 (55.6-65.1%) | 44-52 (13.6-16%) |
| Tapu Fini (specWall, Leftovers) | 163-193 (47.4-56.1%) | 175-206 (50.9-59.9%) | 146-172 (42.4-50%) | 146-172 (42.4-50%) |
| Corviknight (physWall, Leftovers) | 258-304 (64.5-76%) | 68-80 (17-20%) | 0-0 (0-0%) | 57-67 (14.3-16.8%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Focus Punch | Double-Edge | Earthquake | Hard Press |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 443-522 (125.9-148.3%) | 58-68 (16.5-19.3%) | 98-117 (27.8-33.2%) | 49-58 (13.9-16.5%) |
| Toxapex (physWall, Black Sludge) | 98-117 (32.2-38.5%) | 106-124 (34.9-40.8%) | 178-209 (58.6-68.8%) | 44-52 (14.5-17.1%) |
| Clodsire (specWall, Leftovers) | 279-328 (60.1-70.7%) | 299-351 (64.4-75.6%) | 499-587 (107.5-126.5%) | 249-293 (53.7-63.1%) |
| Dondozo (physWall, Leftovers) | 243-286 (48.2-56.7%) | 130-153 (25.8-30.4%) | 107-127 (21.2-25.2%) | 53-63 (10.5-12.5%) |
| Gliscor (physWall, Toxic Orb) | 114-135 (32.2-38.1%) | 122-144 (34.5-40.7%) | 0-0 (0-0%) | 102-120 (28.8-33.9%) |
| Ting-Lu (physWall, Leftovers) | 447-526 (83.7-98.5%) | 119-140 (22.3-26.2%) | 100-117 (18.7-21.9%) | 100-117 (18.7-21.9%) |
| Great Tusk (physWall, Leftovers) | 221-261 (50.9-60.1%) | 118-139 (27.2-32%) | 98-117 (22.6-27%) | 98-117 (22.6-27%) |
| Alomomola (physWall, Leftovers) | 308-362 (57.7-67.8%) | 165-193 (30.9-36.1%) | 137-162 (25.7-30.3%) | 68-80 (12.7-15%) |
| Slowking-Galar (specWall, Leftovers) | 110-131 (27.9-33.2%) | 237-279 (60.2-70.8%) | 397-468 (100.8-118.8%) | 198-234 (50.3-59.4%) |
| Heatran (specWall, Leftovers) | 707-832 (183.2-215.5%) | 93-110 (24.1-28.5%) | 630-742 (163.2-192.2%) | 39-45 (10.1-11.7%) |
| Zamazenta (physWall, Leftovers) | 243-286 (62.6-73.7%) | 130-153 (33.5-39.4%) | 107-127 (27.6-32.7%) | 107-127 (27.6-32.7%) |
| Dragonite (physWall, Leftovers) | 137-162 (35.5-42%) | 148-174 (38.3-45.1%) | 0-0 (0-0%) | 123-145 (31.9-37.6%) |
| Melmetal (physWall, Leftovers) | 417-490 (88-103.4%) | 54-65 (11.4-13.7%) | 185-219 (39-46.2%) | 45-54 (9.5-11.4%) |
| Gholdengo (specWall, Leftovers) | 0-0 (0-0%) | 0-0 (0-0%) | 345-406 (91.3-107.4%) | 85-101 (22.5-26.7%) |
| Landorus-Therian (physWall, Leftovers) | 143-167 (37.4-43.7%) | 153-180 (40.1-47.1%) | 0-0 (0-0%) | 127-150 (33.2-39.3%) |
| Garchomp (physWall, Leftovers) | 276-326 (65.7-77.6%) | 148-174 (35.2-41.4%) | 123-145 (29.3-34.5%) | 123-145 (29.3-34.5%) |
| Tyranitar-Mega (specWall, no item) | 1046-1232 (258.9-305%) | 68-81 (16.8-20%) | 234-275 (57.9-68.1%) | 234-275 (57.9-68.1%) |
| Chesnaught-Mega (physWall, no item) | 180-213 (47.4-56.1%) | 96-114 (25.3-30%) | 40-46 (10.5-12.1%) | 80-94 (21.1-24.7%) |
| Kingambit (physWall, Leftovers) | 946-1114 (234.2-275.7%) | 62-74 (15.3-18.3%) | 211-248 (52.2-61.4%) | 52-61 (12.9-15.1%) |
| Toxapex (specWall, Leftovers) | 128-152 (42.1-50%) | 137-162 (45.1-53.3%) | 231-271 (76-89.1%) | 57-67 (18.8-22%) |

---

### Pyroar-Mega

_Flagged for: Speed **386** — in OU's top quarter (≥350); Special Attack 392 — above OU's median (328); BST 607 — above OU's median (600)._

**Pyroar-Mega** — forme, **UU**, source: override
  Fire/Normal | BST 607 (86/88/92/129/86/126) | Abilities: Fire Mane
  Engine stats @252 (neutral/positive): Fire Mane: Atk 275/302, SpA 357/392, Spe 351/386
  Item: **forced — Pyroarite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
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

Attacker: **Pyroar-Mega**, timid {"spa":252,"spe":252,"hp":4}, **Pyroarite (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Overheat | Double-Edge | Solar Beam | Dark Pulse |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 200-236 (28-33.1%) | 438-516 (61.3-72.3%) | 77-90 (10.8-12.6%) | 52-61 (7.3-8.5%) |
| Chansey (specWall, Eviolite) | 160-188 (22.7-26.7%) | 356-419 (50.6-59.5%) | 61-72 (8.7-10.2%) | 41-49 (5.8-7%) |
| Clefable (specWall, Leftovers) | 264-311 (67-78.9%) | 136-160 (34.5-40.6%) | 101-119 (25.6-30.2%) | 34-40 (8.6-10.2%) |
| Slowbro (physWall, Leftovers) | 206-242 (52.3-61.4%) | 72-85 (18.3-21.6%) | 315-371 (79.9-94.2%) | 211-248 (53.6-62.9%) |
| Slowbro-Mega (physWall, no item) | 206-242 (52.3-61.4%) | 51-60 (12.9-15.2%) | 315-371 (79.9-94.2%) | 211-248 (53.6-62.9%) |
| Slowking (specWall, Leftovers) | 115-136 (29.2-34.5%) | 127-149 (32.2-37.8%) | 178-209 (45.2-53%) | 119-141 (30.2-35.8%) |
| Skarmory (physWall, Leftovers) | 917-1079 (274.6-323.1%) | 30-36 (9-10.8%) | 43-51 (12.9-15.3%) | 117-138 (35-41.3%) |
| Skarmory-Mega (physWall, no item) | 685-806 (205.1-241.3%) | 36-42 (10.8-12.6%) | 32-38 (9.6-11.4%) | 88-103 (26.3-30.8%) |
| Celesteela (physWall, Leftovers) | 679-799 (170.6-200.8%) | 37-44 (9.3-11.1%) | 32-38 (8-9.5%) | 87-102 (21.9-25.6%) |
| Hippowdon (physWall, Leftovers) | 448-527 (106.7-125.5%) | 68-81 (16.2-19.3%) | 171-201 (40.7-47.9%) | 114-135 (27.1-32.1%) |
| Amoonguss (specWall, Black Sludge) | 570-671 (131.9-155.3%) | 141-166 (32.6-38.4%) | 27-32 (6.3-7.4%) | 73-86 (16.9-19.9%) |
| Goodra-Hisui (specWall, Leftovers) | 185-218 (50.8-59.9%) | 53-62 (14.6-17%) | 17-21 (4.7-5.8%) | 48-56 (13.2-15.4%) |
| Rotom-Wash (physWall, Leftovers) | 161-190 (53-62.5%) | 73-86 (24-28.3%) | 248-291 (81.6-95.7%) | 83-97 (27.3-31.9%) |
| Swampert (physWall, Leftovers) | 187-220 (46.3-54.5%) | 82-96 (20.3-23.8%) | 573-674 (141.8-166.8%) | 96-113 (23.8-28%) |
| Tyranitar (specWall, Leftovers) | 123-145 (30.4-35.9%) | 48-57 (11.9-14.1%) | 94-111 (23.3-27.5%) | 31-37 (7.7-9.2%) |
| Scizor (physWall, Leftovers) | 1648-1939 (479.1-563.7%) | 38-45 (11-13.1%) | 39-46 (11.3-13.4%) | 105-124 (30.5-36%) |
| Buzzwole (physWall, Leftovers) | 1135-1336 (271.5-319.6%) | 61-72 (14.6-17.2%) | 108-127 (25.8-30.4%) | 72-85 (17.2-20.3%) |
| Aegislash (physWall, Leftovers) | 483-568 (149.1-175.3%) | 0-0 (0-0%) | 46-54 (14.2-16.7%) | 124-146 (38.3-45.1%) |
| Tapu Fini (specWall, Leftovers) | 103-121 (29.9-35.2%) | 94-111 (27.3-32.3%) | 158-186 (45.9-54.1%) | 26-31 (7.6-9%) |
| Corviknight (physWall, Leftovers) | 784-923 (196-230.8%) | 37-43 (9.3-10.8%) | 37-44 (9.3-11%) | 100-118 (25-29.5%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Overheat | Double-Edge | Solar Beam | Dark Pulse |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 1208-1421 (343.2-403.7%) | 32-37 (9.1-10.5%) | 28-34 (8-9.7%) | 77-91 (21.9-25.9%) |
| Toxapex (physWall, Black Sludge) | 126-149 (41.4-49%) | 57-67 (18.8-22%) | 97-114 (31.9-37.5%) | 65-76 (21.4-25%) |
| Clodsire (specWall, Leftovers) | 247-290 (53.2-62.5%) | 159-187 (34.3-40.3%) | 94-111 (20.3-23.9%) | 63-75 (13.6-16.2%) |
| Dondozo (physWall, Leftovers) | 243-286 (48.2-56.7%) | 70-82 (13.9-16.3%) | 371-437 (73.6-86.7%) | 124-146 (24.6-29%) |
| Gliscor (physWall, Toxic Orb) | 434-510 (122.6-144.1%) | 66-78 (18.6-22%) | 166-195 (46.9-55.1%) | 111-130 (31.4-36.7%) |
| Ting-Lu (physWall, Leftovers) | 308-363 (57.7-68%) | 64-75 (12-14%) | 236-278 (44.2-52.1%) | 39-46 (7.3-8.6%) |
| Great Tusk (physWall, Leftovers) | 567-668 (130.6-153.9%) | 64-75 (14.7-17.3%) | 434-510 (100-117.5%) | 72-85 (16.6-19.6%) |
| Alomomola (physWall, Leftovers) | 319-376 (59.7-70.4%) | 88-104 (16.5-19.5%) | 488-575 (91.4-107.7%) | 163-192 (30.5-36%) |
| Slowking-Galar (specWall, Leftovers) | 231-272 (58.6-69%) | 127-149 (32.2-37.8%) | 44-52 (11.2-13.2%) | 119-141 (30.2-35.8%) |
| Heatran (specWall, Leftovers) | 237-279 (61.4-72.3%) | 50-59 (13-15.3%) | 22-26 (5.7-6.7%) | 61-72 (15.8-18.7%) |
| Zamazenta (physWall, Leftovers) | 304-358 (78.4-92.3%) | 70-82 (18-21.1%) | 116-137 (29.9-35.3%) | 39-46 (10.1-11.9%) |
| Dragonite (physWall, Leftovers) | 171-201 (44.3-52.1%) | 79-93 (20.5-24.1%) | 32-38 (8.3-9.8%) | 88-103 (22.8-26.7%) |
| Melmetal (physWall, Leftovers) | 972-1144 (205.1-241.4%) | 30-35 (6.3-7.4%) | 92-109 (19.4-23%) | 124-146 (26.2-30.8%) |
| Gholdengo (specWall, Leftovers) | 524-617 (138.6-163.2%) | 0-0 (0-0%) | 50-59 (13.2-15.6%) | 135-159 (35.7-42.1%) |
| Landorus-Therian (physWall, Leftovers) | 412-484 (107.9-126.7%) | 82-96 (21.5-25.1%) | 157-185 (41.1-48.4%) | 105-124 (27.5-32.5%) |
| Garchomp (physWall, Leftovers) | 196-230 (46.7-54.8%) | 79-93 (18.8-22.1%) | 150-176 (35.7-41.9%) | 100-118 (23.8-28.1%) |
| Tyranitar-Mega (specWall, no item) | 109-128 (27-31.7%) | 37-44 (9.2-10.9%) | 83-98 (20.5-24.3%) | 28-33 (6.9-8.2%) |
| Chesnaught-Mega (physWall, no item) | 608-716 (160-188.4%) | 52-61 (13.7-16.1%) | 58-68 (15.3-17.9%) | 39-46 (10.3-12.1%) |
| Kingambit (physWall, Leftovers) | 784-923 (194.1-228.5%) | 34-40 (8.4-9.9%) | 75-88 (18.6-21.8%) | 50-59 (12.4-14.6%) |
| Toxapex (specWall, Leftovers) | 96-113 (31.6-37.2%) | 74-87 (24.3-28.6%) | 74-87 (24.3-28.6%) | 50-58 (16.4-19.1%) |

---

### Scolipede

_Flagged for: Speed **355** — in OU's top quarter (≥350); strong setup on a frame fast enough to use it; ability: Speed Boost/Quick Feet._

**Scolipede** — species, **UU**, source: imported (natdex)
  Bug/Poison | BST 485 (60/100/89/55/69/112) | Abilities: Poison Point / Swarm / Speed Boost / Quick Feet
  Engine stats @252 (neutral/positive): Poison Point: Atk 299/328, SpA 209/229, Spe 323/355 — Swarm: Atk 299/328, SpA 209/229, Spe 323/355 — Speed Boost: Atk 299/328, SpA 209/229, Spe 323/355 — Quick Feet: Atk 299/328, SpA 209/229, Spe 323/355
  Item: **free**
  STAB: Bug Megahorn 120P · Poison Poison Jab 80P
  Physical coverage: Steel Steel Roller 130P **[conditional — fails with no terrain up]**, Normal Double-Edge 120P, Fighting Superpower 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Dark Throat Chop 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Ghost Hex 65S, Normal Hidden Power 60S
  Setup: Agility, Defense Curl, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Hazards: Spikes, Toxic Spikes
  Pivot: Baton Pass
  Status: Toxic
  Weather/terrain: Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute, Baton Pass

Attacker: **Scolipede**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Megahorn | Poison Jab | Double-Edge | Superpower |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 894-1053 (125.2-147.5%) | 598-703 (83.8-98.5%) | 596-702 (83.5-98.3%) | 1193-1404 (167.1-196.6%) |
| Chansey (specWall, Eviolite) | 726-855 (103.1-121.4%) | 484-570 (68.8-81%) | 483-569 (68.6-80.8%) | 968-1140 (137.5-161.9%) |
| Clefable (specWall, Leftovers) | 137-162 (34.8-41.1%) | 371-438 (94.2-111.2%) | 184-217 (46.7-55.1%) | 92-107 (23.4-27.2%) |
| Slowbro (physWall, Leftovers) | 291-343 (73.9-87.1%) | 97-115 (24.6-29.2%) | 96-114 (24.4-28.9%) | 48-57 (12.2-14.5%) |
| Slowbro-Mega (physWall, no item) | 204-240 (51.8-60.9%) | 68-80 (17.3-20.3%) | 67-79 (17-20.1%) | 33-39 (8.4-9.9%) |
| Slowking (specWall, Leftovers) | 516-607 (131-154.1%) | 172-202 (43.7-51.3%) | 171-201 (43.4-51%) | 85-100 (21.6-25.4%) |
| Skarmory (physWall, Leftovers) | 29-35 (8.7-10.5%) | 0-0 (0-0%) | 40-48 (12-14.4%) | 81-96 (24.3-28.7%) |
| Skarmory-Mega (physWall, no item) | 36-42 (10.8-12.6%) | 0-0 (0-0%) | 48-57 (14.4-17.1%) | 96-114 (28.7-34.1%) |
| Celesteela (physWall, Leftovers) | 37-44 (9.3-11.1%) | 0-0 (0-0%) | 50-58 (12.6-14.6%) | 101-118 (25.4-29.6%) |
| Hippowdon (physWall, Leftovers) | 137-162 (32.6-38.6%) | 46-54 (11-12.9%) | 92-107 (21.9-25.5%) | 92-107 (21.9-25.5%) |
| Amoonguss (specWall, Black Sludge) | 286-336 (66.2-77.8%) | 192-226 (44.4-52.3%) | 191-224 (44.2-51.9%) | 94-111 (21.8-25.7%) |
| Goodra-Hisui (specWall, Leftovers) | 106-126 (29.1-34.6%) | 0-0 (0-0%) | 71-83 (19.5-22.8%) | 286-336 (78.6-92.3%) |
| Rotom-Wash (physWall, Leftovers) | 148-174 (48.7-57.2%) | 100-117 (32.9-38.5%) | 98-115 (32.2-37.8%) | 98-115 (32.2-37.8%) |
| Swampert (physWall, Leftovers) | 166-195 (41.1-48.3%) | 55-65 (13.6-16.1%) | 110-130 (27.2-32.2%) | 110-130 (27.2-32.2%) |
| Tyranitar (specWall, Leftovers) | 396-466 (98-115.3%) | 66-78 (16.3-19.3%) | 65-76 (16.1-18.8%) | 529-621 (130.9-153.7%) |
| Scizor (physWall, Leftovers) | 76-91 (22.1-26.5%) | 0-0 (0-0%) | 50-59 (14.5-17.2%) | 102-120 (29.7-34.9%) |
| Buzzwole (physWall, Leftovers) | 61-72 (14.6-17.2%) | 83-97 (19.9-23.2%) | 81-96 (19.4-23%) | 40-48 (9.6-11.5%) |
| Aegislash (physWall, Leftovers) | 28-33 (8.6-10.2%) | 0-0 (0-0%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Tapu Fini (specWall, Leftovers) | 94-111 (27.3-32.3%) | 256-301 (74.4-87.5%) | 127-149 (36.9-43.3%) | 63-74 (18.3-21.5%) |
| Corviknight (physWall, Leftovers) | 36-44 (9-11%) | 0-0 (0-0%) | 49-58 (12.3-14.5%) | 100-117 (25-29.3%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Megahorn | Poison Jab | Double-Edge | Superpower |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 128-150 (36.4-42.6%) | 0-0 (0-0%) | 42-49 (11.9-13.9%) | 171-201 (48.6-57.1%) |
| Toxapex (physWall, Black Sludge) | 57-67 (18.8-22%) | 39-45 (12.8-14.8%) | 76-91 (25-29.9%) | 37-45 (12.2-14.8%) |
| Clodsire (specWall, Leftovers) | 161-189 (34.7-40.7%) | 53-63 (11.4-13.6%) | 214-253 (46.1-54.5%) | 106-126 (22.8-27.2%) |
| Dondozo (physWall, Leftovers) | 140-166 (27.8-32.9%) | 94-111 (18.7-22%) | 93-110 (18.5-21.8%) | 93-110 (18.5-21.8%) |
| Gliscor (physWall, Toxic Orb) | 66-78 (18.6-22%) | 44-52 (12.4-14.7%) | 88-104 (24.9-29.4%) | 44-52 (12.4-14.7%) |
| Ting-Lu (physWall, Leftovers) | 260-305 (48.7-57.1%) | 42-50 (7.9-9.4%) | 85-101 (15.9-18.9%) | 172-202 (32.2-37.8%) |
| Great Tusk (physWall, Leftovers) | 63-75 (14.5-17.3%) | 42-50 (9.7-11.5%) | 85-100 (19.6-23%) | 85-100 (19.6-23%) |
| Alomomola (physWall, Leftovers) | 178-210 (33.3-39.3%) | 119-141 (22.3-26.4%) | 118-140 (22.1-26.2%) | 118-140 (22.1-26.2%) |
| Slowking-Galar (specWall, Leftovers) | 257-302 (65.2-76.6%) | 85-101 (21.6-25.6%) | 171-201 (43.4-51%) | 42-49 (10.7-12.4%) |
| Heatran (specWall, Leftovers) | 50-59 (13-15.3%) | 0-0 (0-0%) | 67-79 (17.4-20.5%) | 271-321 (70.2-83.2%) |
| Zamazenta (physWall, Leftovers) | 70-83 (18-21.4%) | 94-111 (24.2-28.6%) | 93-110 (24-28.4%) | 93-110 (24-28.4%) |
| Dragonite (physWall, Leftovers) | 79-93 (20.5-24.1%) | 107-127 (27.7-32.9%) | 106-126 (27.5-32.6%) | 53-62 (13.7-16.1%) |
| Melmetal (physWall, Leftovers) | 59-70 (12.4-14.8%) | 0-0 (0-0%) | 40-46 (8.4-9.7%) | 161-189 (34-39.9%) |
| Gholdengo (specWall, Leftovers) | 55-65 (14.6-17.2%) | 0-0 (0-0%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Landorus-Therian (physWall, Leftovers) | 83-97 (21.7-25.4%) | 55-65 (14.4-17%) | 110-130 (28.8-34%) | 54-65 (14.1-17%) |
| Garchomp (physWall, Leftovers) | 159-188 (37.9-44.8%) | 53-63 (12.6-15%) | 106-126 (25.2-30%) | 106-126 (25.2-30%) |
| Tyranitar-Mega (specWall, no item) | 302-357 (74.8-88.4%) | 50-59 (12.4-14.6%) | 49-58 (12.1-14.4%) | 404-475 (100-117.6%) |
| Chesnaught-Mega (physWall, no item) | 105-123 (27.6-32.4%) | 143-167 (37.6-43.9%) | 70-81 (18.4-21.3%) | 70-81 (18.4-21.3%) |
| Kingambit (physWall, Leftovers) | 136-161 (33.7-39.9%) | 0-0 (0-0%) | 45-53 (11.1-13.1%) | 366-431 (90.6-106.7%) |
| Toxapex (specWall, Leftovers) | 74-87 (24.3-28.6%) | 49-58 (16.1-19.1%) | 100-117 (32.9-38.5%) | 49-58 (16.1-19.1%) |

---

### Scolipede-Mega

_Flagged for: Attack **416** — in OU's top quarter (≥416); hazards + real offence; reliable recovery on a bulky frame._

**Scolipede-Mega** — forme, **UU**, source: override
  Bug/Poison | BST 585 (60/140/149/75/99/62) | Abilities: Shell Armor
  Engine stats @252 (neutral/positive): Shell Armor: Atk 379/416, SpA 249/273, Spe 223/245
  Item: **forced — Scolipite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Bug Megahorn 120P · Poison Poison Jab 80P
  Physical coverage: Steel Steel Roller 130P **[conditional — fails with no terrain up]**, Normal Double-Edge 120P, Fighting Superpower 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Dark Throat Chop 80P
  Special coverage: Grass Solar Beam 120 (charge)S, Ghost Hex 65S, Normal Hidden Power 60S
  Setup: Agility, Defense Curl, Iron Defense, Swords Dance
  Reliable recovery: Rest
  Hazards: Spikes, Toxic Spikes
  Pivot: Baton Pass
  Status: Toxic
  Weather/terrain: Sunny Day
  Utility: Protect, Substitute
  Notable: Substitute, Baton Pass

Attacker: **Scolipede-Mega**, adamant {"atk":252,"spe":252,"hp":4}, **Scolipite (forced — this entry IS the forme)** — a **representative test set**, not a usage set.

**Against the UU defensive core** — can UU answer it?

| UU defender (representative test set) | Megahorn | Poison Jab | Double-Edge | Superpower |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 957-1126 (134-157.7%) | 639-751 (89.5-105.2%) | 638-750 (89.4-105%) | 1276-1501 (178.7-210.2%) |
| Chansey (specWall, Eviolite) | 777-914 (110.4-129.8%) | 519-610 (73.7-86.6%) | 518-609 (73.6-86.5%) | 1036-1219 (147.2-173.2%) |
| Clefable (specWall, Leftovers) | 148-174 (37.6-44.2%) | 396-466 (100.5-118.3%) | 197-232 (50-58.9%) | 98-116 (24.9-29.4%) |
| Slowbro (physWall, Leftovers) | 310-365 (78.7-92.6%) | 104-122 (26.4-31%) | 103-121 (26.1-30.7%) | 51-60 (12.9-15.2%) |
| Slowbro-Mega (physWall, no item) | 217-255 (55.1-64.7%) | 73-86 (18.5-21.8%) | 72-85 (18.3-21.6%) | 36-42 (9.1-10.7%) |
| Slowking (specWall, Leftovers) | 550-647 (139.6-164.2%) | 184-216 (46.7-54.8%) | 183-215 (46.4-54.6%) | 91-107 (23.1-27.2%) |
| Skarmory (physWall, Leftovers) | 32-38 (9.6-11.4%) | 0-0 (0-0%) | 43-51 (12.9-15.3%) | 87-102 (26-30.5%) |
| Skarmory-Mega (physWall, no item) | 38-45 (11.4-13.5%) | 0-0 (0-0%) | 51-60 (15.3-18%) | 103-121 (30.8-36.2%) |
| Celesteela (physWall, Leftovers) | 40-47 (10.1-11.8%) | 0-0 (0-0%) | 54-63 (13.6-15.8%) | 108-127 (27.1-31.9%) |
| Hippowdon (physWall, Leftovers) | 147-173 (35-41.2%) | 49-58 (11.7-13.8%) | 98-115 (23.3-27.4%) | 98-115 (23.3-27.4%) |
| Amoonguss (specWall, Black Sludge) | 306-360 (70.8-83.3%) | 205-241 (47.5-55.8%) | 204-240 (47.2-55.6%) | 102-120 (23.6-27.8%) |
| Goodra-Hisui (specWall, Leftovers) | 114-134 (31.3-36.8%) | 0-0 (0-0%) | 76-89 (20.9-24.5%) | 305-359 (83.8-98.6%) |
| Rotom-Wash (physWall, Leftovers) | 157-185 (51.6-60.9%) | 106-124 (34.9-40.8%) | 105-123 (34.5-40.5%) | 105-123 (34.5-40.5%) |
| Swampert (physWall, Leftovers) | 177-208 (43.8-51.5%) | 59-70 (14.6-17.3%) | 118-139 (29.2-34.4%) | 118-139 (29.2-34.4%) |
| Tyranitar (specWall, Leftovers) | 422-497 (104.5-123%) | 70-83 (17.3-20.5%) | 70-82 (17.3-20.3%) | 563-663 (139.4-164.1%) |
| Scizor (physWall, Leftovers) | 82-97 (23.8-28.2%) | 0-0 (0-0%) | 55-64 (16-18.6%) | 110-129 (32-37.5%) |
| Buzzwole (physWall, Leftovers) | 65-77 (15.6-18.4%) | 88-104 (21.1-24.9%) | 87-103 (20.8-24.6%) | 43-51 (10.3-12.2%) |
| Aegislash (physWall, Leftovers) | 31-36 (9.6-11.1%) | 0-0 (0-0%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Tapu Fini (specWall, Leftovers) | 101-119 (29.4-34.6%) | 273-321 (79.4-93.3%) | 135-159 (39.2-46.2%) | 67-79 (19.5-23%) |
| Corviknight (physWall, Leftovers) | 40-47 (10-11.8%) | 0-0 (0-0%) | 53-62 (13.3-15.5%) | 106-125 (26.5-31.3%) |

**Against the OU defensive core** — would it be ordinary there?

| OU defender (representative test set) | Megahorn | Poison Jab | Double-Edge | Superpower |
| --- | --- | --- | --- | --- |
| Ferrothorn (physWall, Leftovers) | 137-161 (38.9-45.7%) | 0-0 (0-0%) | 45-53 (12.8-15.1%) | 182-215 (51.7-61.1%) |
| Toxapex (physWall, Black Sludge) | 61-72 (20.1-23.7%) | 41-48 (13.5-15.8%) | 82-96 (27-31.6%) | 41-48 (13.5-15.8%) |
| Clodsire (specWall, Leftovers) | 172-203 (37.1-43.8%) | 57-67 (12.3-14.4%) | 230-270 (49.6-58.2%) | 115-135 (24.8-29.1%) |
| Dondozo (physWall, Leftovers) | 150-177 (29.8-35.1%) | 101-119 (20-23.6%) | 100-118 (19.8-23.4%) | 100-118 (19.8-23.4%) |
| Gliscor (physWall, Toxic Orb) | 71-83 (20.1-23.4%) | 47-56 (13.3-15.8%) | 94-111 (26.6-31.4%) | 47-55 (13.3-15.5%) |
| Ting-Lu (physWall, Leftovers) | 276-325 (51.7-60.9%) | 46-54 (8.6-10.1%) | 92-108 (17.2-20.2%) | 184-216 (34.5-40.4%) |
| Great Tusk (physWall, Leftovers) | 68-80 (15.7-18.4%) | 46-54 (10.6-12.4%) | 91-107 (21-24.7%) | 91-107 (21-24.7%) |
| Alomomola (physWall, Leftovers) | 190-224 (35.6-41.9%) | 128-150 (24-28.1%) | 127-149 (23.8-27.9%) | 127-149 (23.8-27.9%) |
| Slowking-Galar (specWall, Leftovers) | 275-323 (69.8-82%) | 92-108 (23.4-27.4%) | 183-215 (46.4-54.6%) | 45-53 (11.4-13.5%) |
| Heatran (specWall, Leftovers) | 54-64 (14-16.6%) | 0-0 (0-0%) | 72-85 (18.7-22%) | 290-342 (75.1-88.6%) |
| Zamazenta (physWall, Leftovers) | 75-88 (19.3-22.7%) | 101-119 (26-30.7%) | 100-118 (25.8-30.4%) | 100-118 (25.8-30.4%) |
| Dragonite (physWall, Leftovers) | 85-100 (22-25.9%) | 114-135 (29.5-35%) | 114-134 (29.5-34.7%) | 57-67 (14.8-17.4%) |
| Melmetal (physWall, Leftovers) | 64-75 (13.5-15.8%) | 0-0 (0-0%) | 42-50 (8.9-10.5%) | 171-202 (36.1-42.6%) |
| Gholdengo (specWall, Leftovers) | 59-70 (15.6-18.5%) | 0-0 (0-0%) | 0-0 (0-0%) | 0-0 (0-0%) |
| Landorus-Therian (physWall, Leftovers) | 88-104 (23-27.2%) | 59-70 (15.4-18.3%) | 118-139 (30.9-36.4%) | 59-69 (15.4-18.1%) |
| Garchomp (physWall, Leftovers) | 171-201 (40.7-47.9%) | 57-67 (13.6-16%) | 114-134 (27.1-31.9%) | 114-134 (27.1-31.9%) |
| Tyranitar-Mega (specWall, no item) | 323-380 (80-94.1%) | 54-63 (13.4-15.6%) | 53-63 (13.1-15.6%) | 431-507 (106.7-125.5%) |
| Chesnaught-Mega (physWall, no item) | 112-132 (29.5-34.7%) | 151-178 (39.7-46.8%) | 74-88 (19.5-23.2%) | 74-88 (19.5-23.2%) |
| Kingambit (physWall, Leftovers) | 146-172 (36.1-42.6%) | 0-0 (0-0%) | 48-57 (11.9-14.1%) | 390-458 (96.5-113.4%) |
| Toxapex (specWall, Leftovers) | 79-93 (26-30.6%) | 53-63 (17.4-20.7%) | 106-125 (34.9-41.1%) | 53-62 (17.4-20.4%) |
---

## H. Role comparison against OU

For each flagged candidate, the OU entries it would actually be competing with if
promoted — selected by shared role keys, shared typing and BST proximity. A
**mechanical shortlist, not a judgement**; their full profiles are in section D.

The questions to answer for each:

1. What does the UU candidate do that its OU counterparts cannot?
2. What do they do better?
3. Would it be an ordinary OU Pokémon, or a problem there?
4. Is there a role OU currently lacks that it fills?

### Latias-Mega

**Latias-Mega** — Dragon/Psychic, BST 700 (80/100/120/140/150/110), Levitate, item **forced (Latiasite)**
Roles: removal, recovery, pivot, setup, priority, phazing, cleric, status | STAB: Dragon Draco Meteor 140S · Psychic Future Sight 120S | Recovery: Recover, Rest, Roost | Priority: Sucker Punch 80P Dark (+1)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Latios-Mega | Dragon/Psychic | 700 (80/130/100/160/120/110) | Levitate | removal, recovery, pivot, setup, phazing, status | Recover, Rest, Roost | Dragon Draco Meteor 140S · Psychic Future Sight 120S |
| Blastoise-Mega | Water | 630 (79/103/120/135/115/78) | Mega Launcher | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest | Water Water Spout 150S |
| Dragonite | Dragon/Flying | 600 (91/134/95/100/100/80) | Inner Focus, Multiscale | removal, recovery, setup, priority, phazing, cleric, status | Rest, Roost | Dragon Draco Meteor 140S · Flying Hurricane 120S |
| Latios | Dragon/Psychic | 600 (80/90/80/130/110/110) | Levitate | removal, recovery, pivot, setup, phazing, status | Recover, Rest, Roost | Dragon Draco Meteor 140S · Psychic Future Sight 120S |
| Charizard-Mega-X | Fire/Dragon | 634 (78/130/111/130/85/100) | Tough Claws | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Dragon Outrage 120P |

---

### Delphox-Mega

**Delphox-Mega** — Fire/Psychic, BST 634 (75/69/72/159/125/134), Levitate, item **forced (Delphoxite)**
Roles: recovery, setup, cleric, status | STAB: Fire Overheat 140S · Psychic Future Sight 120S | Recovery: Rest | Priority: none

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Gallade-Mega | Psychic/Fighting | 618 (68/165/95/65/115/110) | Inner Focus | recovery, pivot, setup, priority, cleric, status | Rest | Psychic Zen Headbutt 80P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Tapu Lele | Psychic/Fairy | 570 (70/85/75/130/115/95) | Psychic Surge, Telepathy | recovery, setup, cleric, status | Rest | Psychic Future Sight 120S · Fairy Moonblast 95S |
| Alakazam-Mega | Psychic | 600 (55/50/65/175/105/150) | Trace | recovery, pivot, setup, status | Recover, Rest | Psychic Future Sight 120S |
| Blastoise-Mega | Water | 630 (79/103/120/135/115/78) | Mega Launcher | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest | Water Water Spout 150S |
| Charizard-Mega-X | Fire/Dragon | 634 (78/130/111/130/85/100) | Tough Claws | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Dragon Outrage 120P |

---

### Starmie-Mega

**Starmie-Mega** — Water/Psychic, BST 620 (60/100/105/130/105/120), Huge Power, item **forced (Starminite)**
Roles: removal, recovery, pivot, setup, status | STAB: Water Waterfall 80P · Psychic Psycho Cut 70P | Recovery: Recover, Rest | Priority: none

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Blastoise-Mega | Water | 630 (79/103/120/135/115/78) | Mega Launcher | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest | Water Water Spout 150S |
| Latios | Dragon/Psychic | 600 (80/90/80/130/110/110) | Levitate | removal, recovery, pivot, setup, phazing, status | Recover, Rest, Roost | Dragon Draco Meteor 140S · Psychic Future Sight 120S |
| Lunala | Psychic/Ghost | 680 (137/113/89/137/107/97) | Shadow Shield | removal, recovery, pivot, setup, phazing, status | Rest, Roost | Psychic Future Sight 120S · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]** |
| Latios-Mega | Dragon/Psychic | 700 (80/130/100/160/120/110) | Levitate | removal, recovery, pivot, setup, phazing, status | Recover, Rest, Roost | Dragon Draco Meteor 140S · Psychic Future Sight 120S |
| Alakazam-Mega | Psychic | 600 (55/50/65/175/105/150) | Trace | recovery, pivot, setup, status | Recover, Rest | Psychic Future Sight 120S |

---

### Skarmory-Mega

**Skarmory-Mega** — Steel/Flying, BST 565 (65/140/110/40/100/110), Stalwart, item **forced (Skarmorite)**
Roles: hazards, removal, recovery, setup, priority, phazing, status | STAB: Steel Iron Head 80P · Flying Sky Attack 140 (charge)P | Recovery: Rest, Roost | Priority: Feint 50P Normal (+2)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Charizard-Mega-Y | Fire/Flying | 634 (78/104/78/159/115/100) | Drought | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Flying Hurricane 120S |
| Dragonite | Dragon/Flying | 600 (91/134/95/100/100/80) | Inner Focus, Multiscale | removal, recovery, setup, priority, phazing, cleric, status | Rest, Roost | Dragon Draco Meteor 140S · Flying Hurricane 120S |
| Gliscor | Ground/Flying | 510 (75/95/125/45/75/95) | Hyper Cutter, Sand Veil, Poison Heal | hazards, removal, recovery, pivot, setup, priority, status | Rest, Roost | Ground Earthquake 100P · Flying Sky Attack 140 (charge)P |
| Blastoise-Mega | Water | 630 (79/103/120/135/115/78) | Mega Launcher | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest | Water Water Spout 150S |
| Blaziken | Fire/Fighting | 530 (80/120/70/110/70/80) | Blaze, Speed Boost | removal, recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |

---

### Raichu-Mega-Y

**Raichu-Mega-Y** — Electric, BST 585 (60/100/55/160/80/130), No Guard, item **forced (Raichunite Y)**
Roles: recovery, pivot, setup, priority, cleric, status | STAB: Electric Thunder 120S | Recovery: Rest | Priority: Extreme Speed 80P Normal (+2), Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Blastoise-Mega | Water | 630 (79/103/120/135/115/78) | Mega Launcher | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest | Water Water Spout 150S |
| Gallade-Mega | Psychic/Fighting | 618 (68/165/95/65/115/110) | Inner Focus | recovery, pivot, setup, priority, cleric, status | Rest | Psychic Zen Headbutt 80P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Lopunny-Mega | Normal/Fighting | 580 (65/136/94/54/96/135) | Scrappy | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]** · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Raging Bolt | Electric/Dragon | 590 (125/73/91/137/89/75) | Protosynthesis | recovery, pivot, setup, priority, phazing, status | Rest | Electric Thunder 120S · Dragon Draco Meteor 140S |
| Tapu Koko | Electric/Fairy | 570 (70/115/85/95/75/130) | Electric Surge, Telepathy | removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Electric Thunder 120S · Fairy Dazzling Gleam 80S |

---

### Aegislash-Blade

**Aegislash-Blade** — Steel/Ghost, BST 520 (60/150/50/150/50/60), Stance Change, item free
Roles: recovery, setup, priority, status | STAB: Steel Steel Beam 140S · Ghost Shadow Ball 80S | Recovery: Rest | Priority: Shadow Sneak 40P Ghost (+1)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Annihilape | Fighting/Ghost | 535 (110/115/80/50/90/90) | Vital Spirit, Inner Focus, Defiant | hazards, recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Ghost Phantom Force 90 (charge)P |
| Ceruledge | Fire/Ghost | 525 (75/125/80/60/100/85) | Flash Fire, Weak Armor | recovery, setup, priority, status | Rest | Fire Flare Blitz 120P · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]** |
| Gholdengo | Steel/Ghost | 550 (87/60/95/133/91/84) | Good as Gold | recovery, setup, status | Recover, Rest | Steel Steel Beam 140S · Ghost Shadow Ball 80S |
| Kartana | Grass/Steel | 570 (59/181/131/59/31/109) | Beast Boost | removal, recovery, setup, priority, status | Rest | Grass Solar Blade 125 (charge)P · Steel Smart Strike 70P |
| Kingambit | Dark/Steel | 550 (100/135/120/60/85/50) | Defiant, Supreme Overlord, Pressure | hazards, recovery, setup, priority, status | Rest | Dark Foul Play 95P · Steel Iron Head 80P |

---

### Staraptor-Mega

**Staraptor-Mega** — Fighting/Flying, BST 585 (85/140/100/60/90/110), Contrary, item **forced (Staraptite)**
Roles: removal, recovery, pivot, setup, priority, phazing, status | STAB: Fighting Close Combat 120P · Flying Sky Attack 140 (charge)P | Recovery: Rest, Roost | Priority: Quick Attack 40P Normal (+1)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Blaziken | Fire/Fighting | 530 (80/120/70/110/70/80) | Blaze, Speed Boost | removal, recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Hawlucha-Mega | Fighting/Flying | 600 (78/137/100/74/93/118) | No Guard | removal, recovery, pivot, setup, priority, status | Rest, Roost | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Flying Sky Attack 140 (charge)P |
| Blastoise-Mega | Water | 630 (79/103/120/135/115/78) | Mega Launcher | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest | Water Water Spout 150S |
| Charizard-Mega-Y | Fire/Flying | 634 (78/104/78/159/115/100) | Drought | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Flying Hurricane 120S |
| Dragonite | Dragon/Flying | 600 (91/134/95/100/100/80) | Inner Focus, Multiscale | removal, recovery, setup, priority, phazing, cleric, status | Rest, Roost | Dragon Draco Meteor 140S · Flying Hurricane 120S |

---

### Swampert-Mega

**Swampert-Mega** — Water/Ground, BST 635 (100/150/110/95/110/70), Swift Swim, item **forced (Swampertite)**
Roles: hazards, recovery, pivot, setup, phazing, status | STAB: Water Aqua Tail 90P · Ground Earthquake 100P | Recovery: Rest | Priority: none

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Blastoise-Mega | Water | 630 (79/103/120/135/115/78) | Mega Launcher | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest | Water Water Spout 150S |
| Feraligatr-Mega | Water/Dragon | 630 (85/160/125/89/93/78) | Dragonize | recovery, pivot, setup, priority, phazing, status | Rest | Water Aqua Tail 90P · Dragon Double-Edge 144P |
| Garchomp | Dragon/Ground | 600 (108/130/95/80/85/102) | Sand Veil, Rough Skin | hazards, recovery, setup, phazing, status | Rest | Dragon Outrage 120P · Ground Earthquake 100P |
| Garchomp-Mega | Dragon/Ground | 700 (108/170/115/120/95/92) | Sand Force | hazards, recovery, setup, phazing, status | Rest | Dragon Draco Meteor 140S · Ground Earthquake 100P |
| Greninja-Ash | Water/Dark | 640 (72/145/67/153/71/132) | Battle Bond | hazards, recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Dark Dark Pulse 80S |

---

### Alakazam

**Alakazam** — Psychic, BST 500 (55/50/45/135/95/120), Synchronize / Inner Focus / Magic Guard, item free
Roles: recovery, pivot, setup, status | STAB: Psychic Future Sight 120S | Recovery: Recover, Rest | Priority: none

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Medicham-Mega | Fighting/Psychic | 510 (60/100/85/80/85/100) | Pure Power | recovery, pivot, setup, priority, status | Recover, Rest | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Psychic Zen Headbutt 80P |
| Slowking-Galar | Poison/Psychic | 490 (95/65/80/110/110/30) | Curious Medicine, Own Tempo, Regenerator | hazards, recovery, pivot, setup, phazing, status | Rest, Slack Off | Poison Belch 120S **[conditional — fails until the user has eaten a Berry]** · Psychic Future Sight 120S |
| Alakazam-Mega | Psychic | 600 (55/50/65/175/105/150) | Trace | recovery, pivot, setup, status | Recover, Rest | Psychic Future Sight 120S |
| Deoxys | Psychic | 600 (50/150/50/150/50/150) | Pressure | hazards, recovery, pivot, setup, priority, status | Recover, Rest | Psychic Psycho Boost 140S |
| Deoxys-Speed | Psychic | 600 (50/95/90/95/90/180) | Pressure | hazards, recovery, pivot, setup, priority, status | Recover, Rest | Psychic Psycho Boost 140S |

---

### Chandelure

**Chandelure** — Ghost/Fire, BST 520 (60/55/90/145/90/80), Flash Fire / Flame Body / Infiltrator / Shadow Tag, item free
Roles: recovery, setup, status | STAB: Ghost Shadow Ball 80S · Fire Overheat 140S | Recovery: Rest | Priority: none

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Ceruledge | Fire/Ghost | 525 (75/125/80/60/100/85) | Flash Fire, Weak Armor | recovery, setup, priority, status | Rest | Fire Flare Blitz 120P · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]** |
| Annihilape | Fighting/Ghost | 535 (110/115/80/50/90/90) | Vital Spirit, Inner Focus, Defiant | hazards, recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Ghost Phantom Force 90 (charge)P |
| Blaziken | Fire/Fighting | 530 (80/120/70/110/70/80) | Blaze, Speed Boost | removal, recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Cinderace | Fire | 530 (80/116/75/65/75/119) | Blaze, Libero | recovery, pivot, setup, priority, status | Rest | Fire Flare Blitz 120P |
| Gholdengo | Steel/Ghost | 550 (87/60/95/133/91/84) | Good as Gold | recovery, setup, status | Recover, Rest | Steel Steel Beam 140S · Ghost Shadow Ball 80S |

---

### Gardevoir-Mega

**Gardevoir-Mega** — Psychic/Fairy, BST 618 (68/85/65/165/135/100), Pixilate, item **forced (Gardevoirite)**
Roles: recovery, pivot, setup, priority, cleric, status | STAB: Psychic Future Sight 120S · Fairy Hyper Voice 117S | Recovery: Rest | Priority: Shadow Sneak 40P Ghost (+1), Vacuum Wave 40S Fighting (+1)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Gallade-Mega | Psychic/Fighting | 618 (68/165/95/65/115/110) | Inner Focus | recovery, pivot, setup, priority, cleric, status | Rest | Psychic Zen Headbutt 80P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Blastoise-Mega | Water | 630 (79/103/120/135/115/78) | Mega Launcher | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest | Water Water Spout 150S |
| Clefable-Mega | Fairy/Flying | 583 (95/80/93/135/110/70) | Magic Bounce | hazards, recovery, pivot, setup, cleric, status | Rest, Soft-Boiled | Fairy Misty Explosion 100S **[power — the user **faints**]** · Flying Dual Wingbeat 50x2P **(wrong category)** |
| Deoxys | Psychic | 600 (50/150/50/150/50/150) | Pressure | hazards, recovery, pivot, setup, priority, status | Recover, Rest | Psychic Psycho Boost 140S |
| Deoxys-Speed | Psychic | 600 (50/95/90/95/90/180) | Pressure | hazards, recovery, pivot, setup, priority, status | Recover, Rest | Psychic Psycho Boost 140S |

---

### Zeraora

**Zeraora** — Electric, BST 600 (88/112/75/102/80/143), Volt Absorb, item free
Roles: recovery, pivot, setup, priority, status | STAB: Electric Thunder 120S | Recovery: Rest | Priority: Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**, Quick Attack 40P Normal (+1)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Raging Bolt | Electric/Dragon | 590 (125/73/91/137/89/75) | Protosynthesis | recovery, pivot, setup, priority, phazing, status | Rest | Electric Thunder 120S · Dragon Draco Meteor 140S |
| Tapu Koko | Electric/Fairy | 570 (70/115/85/95/75/130) | Electric Surge, Telepathy | removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Electric Thunder 120S · Fairy Dazzling Gleam 80S |
| Zeraora-Mega | Electric | 700 (88/157/75/147/80/153) | Volt Absorb | recovery, pivot, setup, priority, status | Rest | Electric Thunder 120S |
| Annihilape | Fighting/Ghost | 535 (110/115/80/50/90/90) | Vital Spirit, Inner Focus, Defiant | hazards, recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Ghost Phantom Force 90 (charge)P |
| Blastoise-Mega | Water | 630 (79/103/120/135/115/78) | Mega Launcher | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest | Water Water Spout 150S |

---

### Aerodactyl-Mega

**Aerodactyl-Mega** — Rock/Flying, BST 615 (80/135/85/70/95/150), Tough Claws, item **forced (Aerodactylite)**
Roles: hazards, removal, recovery, setup, phazing, status | STAB: Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P | Recovery: Rest, Roost | Priority: none

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Charizard-Mega-Y | Fire/Flying | 634 (78/104/78/159/115/100) | Drought | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Flying Hurricane 120S |
| Dragonite | Dragon/Flying | 600 (91/134/95/100/100/80) | Inner Focus, Multiscale | removal, recovery, setup, priority, phazing, cleric, status | Rest, Roost | Dragon Draco Meteor 140S · Flying Hurricane 120S |
| Glimmora-Mega | Rock/Poison | 625 (83/90/105/150/96/101) | Adaptability | hazards, removal, recovery, setup, status | Rest | Rock Meteor Beam 120 (charge)S · Poison Sludge Wave 95S |
| Landorus-Therian | Ground/Flying | 600 (89/145/90/105/80/91) | Intimidate | hazards, removal, recovery, pivot, setup, status | Rest | Ground Earthquake 100P · Flying Fly 90 (charge)P |
| Lugia | Psychic/Flying | 680 (106/90/130/90/154/110) | Pressure, Multiscale | removal, recovery, setup, phazing, status | Recover, Rest, Roost | Psychic Psycho Boost 140S · Flying Sky Attack 140 (charge)P |

---

### Heracross-Mega

**Heracross-Mega** — Bug/Fighting, BST 600 (80/185/115/40/105/75), Skill Link, item **forced (Heracronite)**
Roles: hazards, recovery, setup, priority, status | STAB: Bug Megahorn 120P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** | Recovery: Rest | Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Vacuum Wave 40S Fighting (+1)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Annihilape | Fighting/Ghost | 535 (110/115/80/50/90/90) | Vital Spirit, Inner Focus, Defiant | hazards, recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Ghost Phantom Force 90 (charge)P |
| Chesnaught-Mega | Grass/Fighting | 630 (88/137/172/74/115/44) | Bulletproof | hazards, recovery, setup, priority, phazing, status | Rest | Grass Wood Hammer 120P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Golisopod-Mega | Bug/Steel | 630 (75/150/175/70/120/40) | Emergency Exit | hazards, recovery, setup, priority, status | Rest | Bug First Impression 90P · Steel Iron Head 80P |
| Kommo-o | Dragon/Fighting | 600 (75/110/125/100/105/85) | Bulletproof, Soundproof, Overcoat | hazards, recovery, setup, priority, phazing, status | Rest | Dragon Draco Meteor 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Pheromosa | Bug/Fighting | 570 (71/137/37/137/37/151) | Beast Boost | removal, recovery, pivot, setup, priority, status | Rest, Roost | Bug Bug Buzz 90S · Fighting High Jump Kick 130P |

---

### Blacephalon

**Blacephalon** — Fire/Ghost, BST 570 (53/127/53/151/79/107), Beast Boost, item free
Roles: recovery, setup, status | STAB: Fire Mind Blown 150S · Ghost Shadow Ball 80S | Recovery: Rest | Priority: none

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Ceruledge | Fire/Ghost | 525 (75/125/80/60/100/85) | Flash Fire, Weak Armor | recovery, setup, priority, status | Rest | Fire Flare Blitz 120P · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]** |
| Annihilape | Fighting/Ghost | 535 (110/115/80/50/90/90) | Vital Spirit, Inner Focus, Defiant | hazards, recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Ghost Phantom Force 90 (charge)P |
| Blaziken | Fire/Fighting | 530 (80/120/70/110/70/80) | Blaze, Speed Boost | removal, recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Charizard-Mega-X | Fire/Dragon | 634 (78/130/111/130/85/100) | Tough Claws | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Dragon Outrage 120P |
| Charizard-Mega-Y | Fire/Flying | 634 (78/104/78/159/115/100) | Drought | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Flying Hurricane 120S |

---

### Gengar

**Gengar** — Ghost/Poison, BST 500 (60/65/60/130/75/110), Cursed Body / Levitate, item free
Roles: hazards, recovery, setup, priority, status | STAB: Ghost Shadow Ball 80S · Poison Sludge Wave 95S | Recovery: Rest | Priority: Sucker Punch 80P Dark (+1)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Annihilape | Fighting/Ghost | 535 (110/115/80/50/90/90) | Vital Spirit, Inner Focus, Defiant | hazards, recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Ghost Phantom Force 90 (charge)P |
| Ceruledge | Fire/Ghost | 525 (75/125/80/60/100/85) | Flash Fire, Weak Armor | recovery, setup, priority, status | Rest | Fire Flare Blitz 120P · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]** |
| Gliscor | Ground/Flying | 510 (75/95/125/45/75/95) | Hyper Cutter, Sand Veil, Poison Heal | hazards, removal, recovery, pivot, setup, priority, status | Rest, Roost | Ground Earthquake 100P · Flying Sky Attack 140 (charge)P |
| Greninja | Water/Dark | 530 (72/95/67/103/71/122) | Torrent, Protean, Battle Bond | hazards, recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Dark Dark Pulse 80S |
| Kingambit | Dark/Steel | 550 (100/135/120/60/85/50) | Defiant, Supreme Overlord, Pressure | hazards, recovery, setup, priority, status | Rest | Dark Foul Play 95P · Steel Iron Head 80P |

---

### Iron Boulder

**Iron Boulder** — Rock/Psychic, BST 590 (90/120/80/68/108/124), Quark Drive, item free
Roles: recovery, setup, priority | STAB: Rock Stone Edge 100P · Psychic Zen Headbutt 80P | Recovery: Rest | Priority: Quick Attack 40P Normal (+1)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Deoxys | Psychic | 600 (50/150/50/150/50/150) | Pressure | hazards, recovery, pivot, setup, priority, status | Recover, Rest | Psychic Psycho Boost 140S |
| Deoxys-Speed | Psychic | 600 (50/95/90/95/90/180) | Pressure | hazards, recovery, pivot, setup, priority, status | Recover, Rest | Psychic Psycho Boost 140S |
| Gallade-Mega | Psychic/Fighting | 618 (68/165/95/65/115/110) | Inner Focus | recovery, pivot, setup, priority, cleric, status | Rest | Psychic Zen Headbutt 80P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Ogerpon-Cornerstone | Grass/Rock | 550 (80/120/84/60/96/110) | Sturdy | hazards, recovery, pivot, setup, priority | Rest | Grass Solar Blade 125 (charge)P · Rock Ivy Cudgel 100P |
| Medicham-Mega | Fighting/Psychic | 510 (60/100/85/80/85/100) | Pure Power | recovery, pivot, setup, priority, status | Recover, Rest | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Psychic Zen Headbutt 80P |

---

### Lilligant-Hisui

**Lilligant-Hisui** — Grass/Fighting, BST 480 (70/105/75/50/75/105), Chlorophyll / Hustle / Leaf Guard, item free
Roles: removal, recovery, setup, priority, cleric, status | STAB: Grass Solar Blade 125 (charge)P · Fighting Axe Kick 120P | Recovery: Rest | Priority: Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]**, Upper Hand 65P Fighting (+3), Vacuum Wave 40S Fighting (+1)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Blaziken | Fire/Fighting | 530 (80/120/70/110/70/80) | Blaze, Speed Boost | removal, recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Blastoise-Mega | Water | 630 (79/103/120/135/115/78) | Mega Launcher | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest | Water Water Spout 150S |
| Chesnaught-Mega | Grass/Fighting | 630 (88/137/172/74/115/44) | Bulletproof | hazards, recovery, setup, priority, phazing, status | Rest | Grass Wood Hammer 120P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Dragonite | Dragon/Flying | 600 (91/134/95/100/100/80) | Inner Focus, Multiscale | removal, recovery, setup, priority, phazing, cleric, status | Rest, Roost | Dragon Draco Meteor 140S · Flying Hurricane 120S |
| Gallade-Mega | Psychic/Fighting | 618 (68/165/95/65/115/110) | Inner Focus | recovery, pivot, setup, priority, cleric, status | Rest | Psychic Zen Headbutt 80P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |

---

### Sharpedo-Mega

**Sharpedo-Mega** — Water/Dark, BST 560 (70/140/70/110/65/105), Strong Jaw, item **forced (Sharpedonite)**
Roles: recovery, pivot, setup, priority, phazing, status | STAB: Water Hydro Pump 120S · Dark Crunch 80P | Recovery: Rest | Priority: Feint 50P Normal (+2), Aqua Jet 40P Water (+1)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Samurott-Hisui | Water/Dark | 528 (90/108/80/100/65/85) | Torrent, Sharpness | recovery, pivot, setup, priority, phazing, status | Rest | Water Hydro Pump 120S · Dark Dark Pulse 80S |
| Greninja | Water/Dark | 530 (72/95/67/103/71/122) | Torrent, Protean, Battle Bond | hazards, recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Dark Dark Pulse 80S |
| Blastoise-Mega | Water | 630 (79/103/120/135/115/78) | Mega Launcher | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest | Water Water Spout 150S |
| Feraligatr-Mega | Water/Dragon | 630 (85/160/125/89/93/78) | Dragonize | recovery, pivot, setup, priority, phazing, status | Rest | Water Aqua Tail 90P · Dragon Double-Edge 144P |
| Greninja-Ash | Water/Dark | 640 (72/145/67/153/71/132) | Battle Bond | hazards, recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Dark Dark Pulse 80S |

---

### Azumarill

**Azumarill** — Water/Fairy, BST 420 (100/50/80/60/80/50), Thick Fat / Huge Power / Sap Sipper, item free
Roles: recovery, setup, priority, status | STAB: Water Aqua Tail 90P · Fairy Play Rough 90P | Recovery: Rest | Priority: Aqua Jet 40P Water (+1)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Alomomola | Water | 470 (165/75/80/40/45/65) | Healer, Hydration, Regenerator | recovery, pivot, setup, priority, cleric, status | Rest | Water Liquidation 85P |
| Mawile-Mega | Steel/Fairy | 480 (50/105/125/55/95/50) | Huge Power | hazards, recovery, pivot, setup, priority, status | Rest | Steel Iron Head 80P · Fairy Play Rough 90P |
| Blastoise-Mega | Water | 630 (79/103/120/135/115/78) | Mega Launcher | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest | Water Water Spout 150S |
| Feraligatr-Mega | Water/Dragon | 630 (85/160/125/89/93/78) | Dragonize | recovery, pivot, setup, priority, phazing, status | Rest | Water Aqua Tail 90P · Dragon Double-Edge 144P |
| Greninja | Water/Dark | 530 (72/95/67/103/71/122) | Torrent, Protean, Battle Bond | hazards, recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Dark Dark Pulse 80S |

---

### Emboar-Mega

**Emboar-Mega** — Fire/Fighting, BST 628 (110/148/75/110/110/75), Mold Breaker, item **forced (Emboarite)**
Roles: recovery, setup, priority, phazing, status | STAB: Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** | Recovery: Rest | Priority: Sucker Punch 80P Dark (+1)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Blaziken | Fire/Fighting | 530 (80/120/70/110/70/80) | Blaze, Speed Boost | removal, recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Charizard-Mega-X | Fire/Dragon | 634 (78/130/111/130/85/100) | Tough Claws | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Dragon Outrage 120P |
| Charizard-Mega-Y | Fire/Flying | 634 (78/104/78/159/115/100) | Drought | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Flying Hurricane 120S |
| Chesnaught-Mega | Grass/Fighting | 630 (88/137/172/74/115/44) | Bulletproof | hazards, recovery, setup, priority, phazing, status | Rest | Grass Wood Hammer 120P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Kommo-o | Dragon/Fighting | 600 (75/110/125/100/105/85) | Bulletproof, Soundproof, Overcoat | hazards, recovery, setup, priority, phazing, status | Rest | Dragon Draco Meteor 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |

---

### Enamorus

**Enamorus** — Fairy/Flying, BST 580 (74/115/70/135/80/106), Cute Charm / Contrary, item free
Roles: recovery, setup | STAB: Fairy Misty Explosion 100S **[power — the user **faints**]** · Flying Fly 90 (charge)P | Recovery: Rest | Priority: none

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Clefable-Mega | Fairy/Flying | 583 (95/80/93/135/110/70) | Magic Bounce | hazards, recovery, pivot, setup, cleric, status | Rest, Soft-Boiled | Fairy Misty Explosion 100S **[power — the user **faints**]** · Flying Dual Wingbeat 50x2P **(wrong category)** |
| Charizard-Mega-Y | Fire/Flying | 634 (78/104/78/159/115/100) | Drought | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Flying Hurricane 120S |
| Dragonite | Dragon/Flying | 600 (91/134/95/100/100/80) | Inner Focus, Multiscale | removal, recovery, setup, priority, phazing, cleric, status | Rest, Roost | Dragon Draco Meteor 140S · Flying Hurricane 120S |
| Hawlucha-Mega | Fighting/Flying | 600 (78/137/100/74/93/118) | No Guard | removal, recovery, pivot, setup, priority, status | Rest, Roost | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Flying Sky Attack 140 (charge)P |
| Iron Valiant | Fairy/Fighting | 590 (74/130/90/120/60/116) | Quark Drive | recovery, setup, priority, status | Rest | Fairy Moonblast 95S · Fighting Close Combat 120P |

---

### Hawlucha

**Hawlucha** — Fighting/Flying, BST 500 (78/92/75/74/63/118), Limber / Unburden / Mold Breaker, item free
Roles: removal, recovery, pivot, setup, priority, status | STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Flying Sky Attack 140 (charge)P | Recovery: Rest, Roost | Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Hawlucha-Mega | Fighting/Flying | 600 (78/137/100/74/93/118) | No Guard | removal, recovery, pivot, setup, priority, status | Rest, Roost | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Flying Sky Attack 140 (charge)P |
| Blaziken | Fire/Fighting | 530 (80/120/70/110/70/80) | Blaze, Speed Boost | removal, recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Gliscor | Ground/Flying | 510 (75/95/125/45/75/95) | Hyper Cutter, Sand Veil, Poison Heal | hazards, removal, recovery, pivot, setup, priority, status | Rest, Roost | Ground Earthquake 100P · Flying Sky Attack 140 (charge)P |
| Pheromosa | Bug/Fighting | 570 (71/137/37/137/37/151) | Beast Boost | removal, recovery, pivot, setup, priority, status | Rest, Roost | Bug Bug Buzz 90S · Fighting High Jump Kick 130P |
| Annihilape | Fighting/Ghost | 535 (110/115/80/50/90/90) | Vital Spirit, Inner Focus, Defiant | hazards, recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Ghost Phantom Force 90 (charge)P |

---

### Haxorus

**Haxorus** — Dragon, BST 540 (76/147/90/60/70/97), Rivalry / Mold Breaker / Unnerve, item free
Roles: recovery, setup, priority, phazing, status | STAB: Dragon Outrage 120P | Recovery: Rest | Priority: First Impression 90P Bug (+2)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Dragapult | Dragon/Ghost | 600 (88/120/75/100/75/142) | Clear Body, Infiltrator, Cursed Body | recovery, pivot, setup, priority, phazing, status | Rest | Dragon Draco Meteor 140S · Ghost Phantom Force 90 (charge)P |
| Dragonite | Dragon/Flying | 600 (91/134/95/100/100/80) | Inner Focus, Multiscale | removal, recovery, setup, priority, phazing, cleric, status | Rest, Roost | Dragon Draco Meteor 140S · Flying Hurricane 120S |
| Kommo-o | Dragon/Fighting | 600 (75/110/125/100/105/85) | Bulletproof, Soundproof, Overcoat | hazards, recovery, setup, priority, phazing, status | Rest | Dragon Draco Meteor 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Raging Bolt | Electric/Dragon | 590 (125/73/91/137/89/75) | Protosynthesis | recovery, pivot, setup, priority, phazing, status | Rest | Electric Thunder 120S · Dragon Draco Meteor 140S |
| Charizard-Mega-X | Fire/Dragon | 634 (78/130/111/130/85/100) | Tough Claws | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Dragon Outrage 120P |

---

### Meganium-Mega

**Meganium-Mega** — Grass/Fairy, BST 625 (80/92/115/143/115/80), Mega Sol, item **forced (Meganiumite)**
Roles: recovery, setup, priority, phazing, cleric, status | STAB: Grass Leaf Storm 140S | Recovery: Rest | Priority: Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]**

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Blastoise-Mega | Water | 630 (79/103/120/135/115/78) | Mega Launcher | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest | Water Water Spout 150S |
| Chesnaught-Mega | Grass/Fighting | 630 (88/137/172/74/115/44) | Bulletproof | hazards, recovery, setup, priority, phazing, status | Rest | Grass Wood Hammer 120P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Dragonite | Dragon/Flying | 600 (91/134/95/100/100/80) | Inner Focus, Multiscale | removal, recovery, setup, priority, phazing, cleric, status | Rest, Roost | Dragon Draco Meteor 140S · Flying Hurricane 120S |
| Lopunny-Mega | Normal/Fighting | 580 (65/136/94/54/96/135) | Scrappy | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]** · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Lucario-Mega | Fighting/Steel | 625 (70/145/88/140/70/112) | Adaptability | recovery, setup, priority, phazing, cleric, status | Rest | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Steel Steel Beam 140S |

---

### Regieleki

**Regieleki** — Electric, BST 580 (80/100/50/100/50/200), Transistor, item free
Roles: removal, recovery, pivot, setup, priority, status | STAB: Electric Thunder 120S | Recovery: Rest | Priority: Extreme Speed 80P Normal (+2)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Tapu Koko | Electric/Fairy | 570 (70/115/85/95/75/130) | Electric Surge, Telepathy | removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Electric Thunder 120S · Fairy Dazzling Gleam 80S |
| Blastoise-Mega | Water | 630 (79/103/120/135/115/78) | Mega Launcher | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest | Water Water Spout 150S |
| Blaziken | Fire/Fighting | 530 (80/120/70/110/70/80) | Blaze, Speed Boost | removal, recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Hawlucha-Mega | Fighting/Flying | 600 (78/137/100/74/93/118) | No Guard | removal, recovery, pivot, setup, priority, status | Rest, Roost | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Flying Sky Attack 140 (charge)P |
| Pheromosa | Bug/Fighting | 570 (71/137/37/137/37/151) | Beast Boost | removal, recovery, pivot, setup, priority, status | Rest, Roost | Bug Bug Buzz 90S · Fighting High Jump Kick 130P |

---

### Serperior

**Serperior** — Grass, BST 528 (75/75/95/75/95/113), Overgrow / Contrary, item free
Roles: removal, recovery, setup, priority, phazing, cleric, status | STAB: Grass Leaf Storm 140S | Recovery: Rest | Priority: Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]**

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Blastoise-Mega | Water | 630 (79/103/120/135/115/78) | Mega Launcher | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest | Water Water Spout 150S |
| Dragonite | Dragon/Flying | 600 (91/134/95/100/100/80) | Inner Focus, Multiscale | removal, recovery, setup, priority, phazing, cleric, status | Rest, Roost | Dragon Draco Meteor 140S · Flying Hurricane 120S |
| Blaziken | Fire/Fighting | 530 (80/120/70/110/70/80) | Blaze, Speed Boost | removal, recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Kartana | Grass/Steel | 570 (59/181/131/59/31/109) | Beast Boost | removal, recovery, setup, priority, status | Rest | Grass Solar Blade 125 (charge)P · Steel Smart Strike 70P |
| Lopunny-Mega | Normal/Fighting | 580 (65/136/94/54/96/135) | Scrappy | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]** · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |

---

### Thundurus

**Thundurus** — Electric/Flying, BST 580 (79/115/70/125/80/111), Prankster / Defiant, item free
Roles: removal, recovery, pivot, setup, status | STAB: Electric Thunder 120S · Flying Acrobatics 110P | Recovery: Rest | Priority: none

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Zapdos | Electric/Flying | 580 (90/90/85/125/90/100) | Pressure, Static, Lightning Rod | removal, recovery, pivot, setup, phazing, status | Rest, Roost | Electric Thunder 120S · Flying Sky Attack 140 (charge)P |
| Hawlucha-Mega | Fighting/Flying | 600 (78/137/100/74/93/118) | No Guard | removal, recovery, pivot, setup, priority, status | Rest, Roost | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Flying Sky Attack 140 (charge)P |
| Landorus-Therian | Ground/Flying | 600 (89/145/90/105/80/91) | Intimidate | hazards, removal, recovery, pivot, setup, status | Rest | Ground Earthquake 100P · Flying Fly 90 (charge)P |
| Tapu Koko | Electric/Fairy | 570 (70/115/85/95/75/130) | Electric Surge, Telepathy | removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Electric Thunder 120S · Fairy Dazzling Gleam 80S |
| Tornadus-Therian | Flying | 580 (79/100/80/110/90/121) | Regenerator | removal, recovery, pivot, setup, status | Rest | Flying Hurricane 120S |

---

### Thundurus-Therian

**Thundurus-Therian** — Electric/Flying, BST 580 (79/105/70/145/80/101), Volt Absorb, item free
Roles: removal, recovery, pivot, setup, status | STAB: Electric Thunder 120S · Flying Acrobatics 110P | Recovery: Rest | Priority: none

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Zapdos | Electric/Flying | 580 (90/90/85/125/90/100) | Pressure, Static, Lightning Rod | removal, recovery, pivot, setup, phazing, status | Rest, Roost | Electric Thunder 120S · Flying Sky Attack 140 (charge)P |
| Hawlucha-Mega | Fighting/Flying | 600 (78/137/100/74/93/118) | No Guard | removal, recovery, pivot, setup, priority, status | Rest, Roost | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Flying Sky Attack 140 (charge)P |
| Landorus-Therian | Ground/Flying | 600 (89/145/90/105/80/91) | Intimidate | hazards, removal, recovery, pivot, setup, status | Rest | Ground Earthquake 100P · Flying Fly 90 (charge)P |
| Tapu Koko | Electric/Fairy | 570 (70/115/85/95/75/130) | Electric Surge, Telepathy | removal, recovery, pivot, setup, priority, phazing, status | Rest, Roost | Electric Thunder 120S · Fairy Dazzling Gleam 80S |
| Tornadus-Therian | Flying | 580 (79/100/80/110/90/121) | Regenerator | removal, recovery, pivot, setup, status | Rest | Flying Hurricane 120S |

---

### Weavile

**Weavile** — Dark/Ice, BST 510 (70/120/65/45/85/125), Pressure / Pickpocket, item free
Roles: recovery, pivot, setup, priority, status | STAB: Dark Foul Play 95P · Ice Icicle Crash 85P | Recovery: Rest | Priority: Upper Hand 65P Fighting (+3), Feint 50P Normal (+2), Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**, Ice Shard 40P Ice (+1)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Greninja | Water/Dark | 530 (72/95/67/103/71/122) | Torrent, Protean, Battle Bond | hazards, recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Dark Dark Pulse 80S |
| Samurott-Hisui | Water/Dark | 528 (90/108/80/100/65/85) | Torrent, Sharpness | recovery, pivot, setup, priority, phazing, status | Rest | Water Hydro Pump 120S · Dark Dark Pulse 80S |
| Greninja-Ash | Water/Dark | 640 (72/145/67/153/71/132) | Battle Bond | hazards, recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Dark Dark Pulse 80S |
| Greninja-Mega | Water/Dark | 630 (72/125/77/133/81/142) | Protean | hazards, recovery, pivot, setup, priority, status | Rest | Water Hydro Pump 120S · Dark Dark Pulse 80S |
| Alomomola | Water | 470 (165/75/80/40/45/65) | Healer, Hydration, Regenerator | recovery, pivot, setup, priority, cleric, status | Rest | Water Liquidation 85P |

---

### Zoroark-Hisui

**Zoroark-Hisui** — Normal/Ghost, BST 510 (55/100/60/125/60/110), Illusion, item free
Roles: recovery, pivot, setup, priority, phazing, status | STAB: Normal Mega Kick 120P · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]** | Recovery: Rest | Priority: Sucker Punch 80P Dark (+1), Shadow Sneak 40P Ghost (+1)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Dragapult | Dragon/Ghost | 600 (88/120/75/100/75/142) | Clear Body, Infiltrator, Cursed Body | recovery, pivot, setup, priority, phazing, status | Rest | Dragon Draco Meteor 140S · Ghost Phantom Force 90 (charge)P |
| Lopunny-Mega | Normal/Fighting | 580 (65/136/94/54/96/135) | Scrappy | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]** · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Annihilape | Fighting/Ghost | 535 (110/115/80/50/90/90) | Vital Spirit, Inner Focus, Defiant | hazards, recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Ghost Phantom Force 90 (charge)P |
| Blaziken | Fire/Fighting | 530 (80/120/70/110/70/80) | Blaze, Speed Boost | removal, recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Samurott-Hisui | Water/Dark | 528 (90/108/80/100/65/85) | Torrent, Sharpness | recovery, pivot, setup, priority, phazing, status | Rest | Water Hydro Pump 120S · Dark Dark Pulse 80S |

---

### Chandelure-Mega

**Chandelure-Mega** — Ghost/Fire, BST 620 (60/75/110/175/110/90), Infiltrator, item **forced (Chandelurite)**
Roles: recovery, setup, status | STAB: Ghost Shadow Ball 80S · Fire Overheat 140S | Recovery: Rest | Priority: none

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Ceruledge | Fire/Ghost | 525 (75/125/80/60/100/85) | Flash Fire, Weak Armor | recovery, setup, priority, status | Rest | Fire Flare Blitz 120P · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]** |
| Charizard-Mega-X | Fire/Dragon | 634 (78/130/111/130/85/100) | Tough Claws | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Dragon Outrage 120P |
| Charizard-Mega-Y | Fire/Flying | 634 (78/104/78/159/115/100) | Drought | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Flying Hurricane 120S |
| Dragapult | Dragon/Ghost | 600 (88/120/75/100/75/142) | Clear Body, Infiltrator, Cursed Body | recovery, pivot, setup, priority, phazing, status | Rest | Dragon Draco Meteor 140S · Ghost Phantom Force 90 (charge)P |
| Heatran | Fire/Steel | 600 (91/90/106/130/106/77) | Flash Fire, Flame Body | hazards, recovery, setup, phazing, status | Rest | Fire Eruption 150S · Steel Steel Beam 140S |

---

### Conkeldurr

**Conkeldurr** — Fighting, BST 505 (105/140/95/55/65/45), Guts / Sheer Force / Iron Fist, item free
Roles: removal, recovery, setup, priority, status | STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** | Recovery: Rest | Priority: Upper Hand 65P Fighting (+3), Mach Punch 40P Fighting (+1)

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Blaziken | Fire/Fighting | 530 (80/120/70/110/70/80) | Blaze, Speed Boost | removal, recovery, pivot, setup, priority, phazing, status | Rest | Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Pheromosa | Bug/Fighting | 570 (71/137/37/137/37/151) | Beast Boost | removal, recovery, pivot, setup, priority, status | Rest, Roost | Bug Bug Buzz 90S · Fighting High Jump Kick 130P |
| Hawlucha-Mega | Fighting/Flying | 600 (78/137/100/74/93/118) | No Guard | removal, recovery, pivot, setup, priority, status | Rest, Roost | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Flying Sky Attack 140 (charge)P |
| Annihilape | Fighting/Ghost | 535 (110/115/80/50/90/90) | Vital Spirit, Inner Focus, Defiant | hazards, recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Ghost Phantom Force 90 (charge)P |
| Gliscor | Ground/Flying | 510 (75/95/125/45/75/95) | Hyper Cutter, Sand Veil, Poison Heal | hazards, removal, recovery, pivot, setup, priority, status | Rest, Roost | Ground Earthquake 100P · Flying Sky Attack 140 (charge)P |

---

### Pyroar-Mega

**Pyroar-Mega** — Fire/Normal, BST 607 (86/88/92/129/86/126), Fire Mane, item **forced (Pyroarite)**
Roles: recovery, setup, phazing, status | STAB: Fire Overheat 140S · Normal Double-Edge 120P | Recovery: Rest | Priority: none

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Charizard-Mega-X | Fire/Dragon | 634 (78/130/111/130/85/100) | Tough Claws | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Dragon Outrage 120P |
| Charizard-Mega-Y | Fire/Flying | 634 (78/104/78/159/115/100) | Drought | removal, recovery, setup, priority, phazing, status | Rest, Roost | Fire Overheat 140S · Flying Hurricane 120S |
| Heatran | Fire/Steel | 600 (91/90/106/130/106/77) | Flash Fire, Flame Body | hazards, recovery, setup, phazing, status | Rest | Fire Eruption 150S · Steel Steel Beam 140S |
| Iron Moth | Fire/Poison | 570 (80/70/60/140/110/110) | Quark Drive | hazards, recovery, pivot, setup, phazing, status | Rest | Fire Overheat 140S · Poison Sludge Wave 95S |
| Lopunny-Mega | Normal/Fighting | 580 (65/136/94/54/96/135) | Scrappy | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]** · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |

---

### Scolipede

**Scolipede** — Bug/Poison, BST 485 (60/100/89/55/69/112), Poison Point / Swarm / Speed Boost / Quick Feet, item free
Roles: hazards, recovery, pivot, setup, status | STAB: Bug Megahorn 120P · Poison Poison Jab 80P | Recovery: Rest | Priority: none

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Naganadel | Poison/Dragon | 540 (73/73/73/127/73/121) | Beast Boost | hazards, recovery, pivot, setup, phazing, status | Rest | Poison Sludge Wave 95S · Dragon Draco Meteor 140S |
| Slowking-Galar | Poison/Psychic | 490 (95/65/80/110/110/30) | Curious Medicine, Own Tempo, Regenerator | hazards, recovery, pivot, setup, phazing, status | Rest, Slack Off | Poison Belch 120S **[conditional — fails until the user has eaten a Berry]** · Psychic Future Sight 120S |
| Iron Moth | Fire/Poison | 570 (80/70/60/140/110/110) | Quark Drive | hazards, recovery, pivot, setup, phazing, status | Rest | Fire Overheat 140S · Poison Sludge Wave 95S |
| Annihilape | Fighting/Ghost | 535 (110/115/80/50/90/90) | Vital Spirit, Inner Focus, Defiant | hazards, recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Ghost Phantom Force 90 (charge)P |
| Clodsire | Poison/Ground | 430 (130/75/60/45/100/20) | Poison Point, Water Absorb, Unaware | hazards, recovery, setup, status | Recover, Rest | Poison Gunk Shot 120P · Ground Earthquake 100P |

---

### Scolipede-Mega

**Scolipede-Mega** — Bug/Poison, BST 585 (60/140/149/75/99/62), Shell Armor, item **forced (Scolipite)**
Roles: hazards, recovery, pivot, setup, status | STAB: Bug Megahorn 120P · Poison Poison Jab 80P | Recovery: Rest | Priority: none

Closest **OU** entries by shared role, typing and BST band — what it would be competing with:

| OU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Iron Moth | Fire/Poison | 570 (80/70/60/140/110/110) | Quark Drive | hazards, recovery, pivot, setup, phazing, status | Rest | Fire Overheat 140S · Poison Sludge Wave 95S |
| Naganadel | Poison/Dragon | 540 (73/73/73/127/73/121) | Beast Boost | hazards, recovery, pivot, setup, phazing, status | Rest | Poison Sludge Wave 95S · Dragon Draco Meteor 140S |
| Slowking-Galar | Poison/Psychic | 490 (95/65/80/110/110/30) | Curious Medicine, Own Tempo, Regenerator | hazards, recovery, pivot, setup, phazing, status | Rest, Slack Off | Poison Belch 120S **[conditional — fails until the user has eaten a Berry]** · Psychic Future Sight 120S |
| Annihilape | Fighting/Ghost | 535 (110/115/80/50/90/90) | Vital Spirit, Inner Focus, Defiant | hazards, recovery, pivot, setup, priority, status | Rest | Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Ghost Phantom Force 90 (charge)P |
| Clefable-Mega | Fairy/Flying | 583 (95/80/93/135/110/70) | Magic Bounce | hazards, recovery, pivot, setup, cleric, status | Rest, Soft-Boiled | Fairy Misty Explosion 100S **[power — the user **faints**]** · Flying Dual Wingbeat 50x2P **(wrong category)** |
---

## I. What the two cores are

**The UU core (20 entries):** Blissey (specWall), Chansey (specWall), Clefable (specWall), Slowbro (physWall), Slowbro-Mega (physWall), Slowking (specWall), Skarmory (physWall), Skarmory-Mega (physWall), Celesteela (physWall), Hippowdon (physWall), Amoonguss (specWall), Goodra-Hisui (specWall), Rotom-Wash (physWall), Swampert (physWall), Tyranitar (specWall), Scizor (physWall), Buzzwole (physWall), Aegislash (physWall), Tapu Fini (specWall), Corviknight (physWall).

**The OU core (20 entries):** Ferrothorn (physWall), Toxapex (physWall), Clodsire (specWall), Dondozo (physWall), Gliscor (physWall), Ting-Lu (physWall), Great Tusk (physWall), Alomomola (physWall), Slowking-Galar (specWall), Heatran (specWall), Zamazenta (physWall), Dragonite (physWall), Melmetal (physWall), Gholdengo (specWall), Landorus-Therian (physWall), Garchomp (physWall), Tyranitar-Mega (specWall), Chesnaught-Mega (physWall), Kingambit (physWall), Toxapex (specWall).

Every cell states attacker, nature, EVs and item; defenders carry the spread and
item named in the row. These are **representative test sets**, not usage sets —
RedGPT has no usage data.

**Read the two together.** A candidate that breaks the UU core and also breaks
the OU core is a Pokémon the ladder has nowhere to put; one that breaks the UU
core and is walled by the OU core is exactly what a promotion is *for*; one that
breaks neither is not a promotion candidate whatever its stat line says.

Classification — hard counter, reliable counter, soft counter, check,
revenge-only, not an answer — is yours. The engine supplies damage; recovery,
speed, priority and hazard chip are in sections C, L, M, O and P.

---

## J. UU revenge / check matrix

UU's own counterplay into each upward candidate. Attackers are **representative
test sets**; the target sits on its own offensive spread from section G.

| Candidate | Bisharp Sucker Punch | Scizor Bullet Punch | Conkeldurr Mach Punch | Terrakion Close Combat | Weavile Ice Shard | Zeraora Plasma Fists | Aerodactyl-Mega Stone Edge | Azumarill Aqua Jet | Excadrill Earthquake | Keldeo Secret Sword |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Latias-Mega | 314-370 (104-122.5%) | 94-110 (31.1-36.4%) | 49-58 (16.2-19.2%) | 84-99 (27.8-32.8%) | 143-167 (47.4-55.3%) | 81-97 (26.8-32.1%) | 145-171 (48-56.6%) | 26-31 (8.6-10.3%) | 145-171 (48-56.6%) | 60-70 (19.9-23.2%) |
| Delphox-Mega | 479-564 (164-193.2%) | 71-84 (24.3-28.8%) | 75-88 (25.7-30.1%) | 128-151 (43.8-51.7%) | 53-62 (18.2-21.2%) | 252-297 (86.3-101.7%) | 444-522 (152.1-178.8%) | 160-189 (54.8-64.7%) | 444-522 (152.1-178.8%) | 91-107 (31.2-36.6%) |
| Starmie-Mega | 352-414 (134.4-158%) | 52-62 (19.8-23.7%) | 55-65 (21-24.8%) | 94-111 (35.9-42.4%) | 39-46 (14.9-17.6%) | 371-436 (141.6-166.4%) | 163-192 (62.2-73.3%) | 29-34 (11.1-13%) | 163-192 (62.2-73.3%) | 67-79 (25.6-30.2%) |
| Skarmory-Mega | 169-198 (62.1-72.8%) | 50-59 (18.4-21.7%) | 106-125 (39-46%) | 181-213 (66.5-78.3%) | 76-89 (27.9-32.7%) | 357-419 (131.3-154%) | 156-184 (57.4-67.6%) | 57-67 (21-24.6%) | 0-0 (0-0%) | 129-152 (47.4-55.9%) |
| Raichu-Mega-Y | 295-347 (112.6-132.4%) | 87-103 (33.2-39.3%) | 185-218 (70.6-83.2%) | 316-372 (120.6-142%) | 132-156 (50.4-59.5%) | 154-182 (58.8-69.5%) | 273-321 (104.2-122.5%) | 98-115 (37.4-43.9%) | 546-642 (208.4-245%) | 225-264 (85.9-100.8%) |
| Aegislash-Blade | 633-744 (241.6-284%) | 94-111 (35.9-42.4%) | 0-0 (0-0%) | 0-0 (0-0%) | 70-83 (26.7-31.7%) | 332-392 (126.7-149.6%) | 146-172 (55.7-65.6%) | 105-124 (40.1-47.3%) | 586-689 (223.7-263%) | 0-0 (0-0%) |
| Staraptor-Mega | 91-107 (29.2-34.3%) | 109-129 (34.9-41.3%) | 57-68 (18.3-21.8%) | 98-115 (31.4-36.9%) | 166-195 (53.2-62.5%) | 387-455 (124-145.8%) | 170-200 (54.5-64.1%) | 61-72 (19.6-23.1%) | 0-0 (0-0%) | 70-82 (22.4-26.3%) |
| Swampert-Mega | 169-198 (49.4-57.9%) | 50-59 (14.6-17.3%) | 106-125 (31-36.5%) | 181-213 (52.9-62.3%) | 76-89 (22.2-26%) | 0-0 (0-0%) | 78-92 (22.8-26.9%) | 57-67 (16.7-19.6%) | 156-184 (45.6-53.8%) | 129-152 (37.7-44.4%) |
| Alakazam | 682-803 (270.6-318.7%) | 203-239 (80.6-94.8%) | 107-126 (42.5-50%) | 183-215 (72.6-85.3%) | 152-179 (60.3-71%) | 360-423 (142.9-167.9%) | 316-372 (125.4-147.6%) | 113-133 (44.8-52.8%) | 316-372 (125.4-147.6%) | 130-153 (51.6-60.7%) |
| Chandelure | 400-471 (152.7-179.8%) | 59-70 (22.5-26.7%) | 0-0 (0-0%) | 0-0 (0-0%) | 44-53 (16.8-20.2%) | 210-248 (80.2-94.7%) | 371-436 (141.6-166.4%) | 134-158 (51.1-60.3%) | 371-436 (141.6-166.4%) | 0-0 (0-0%) |
| Gardevoir-Mega | 260-305 (93.5-109.7%) | 310-364 (111.5-130.9%) | 40-48 (14.4-17.3%) | 69-82 (24.8-29.5%) | 117-136 (42.1-48.9%) | 273-322 (98.2-115.8%) | 240-283 (86.3-101.8%) | 86-102 (30.9-36.7%) | 240-283 (86.3-101.8%) | 49-58 (17.6-20.9%) |
| Zeraora | 231-273 (72.6-85.8%) | 69-81 (21.7-25.5%) | 146-172 (45.9-54.1%) | 249-293 (78.3-92.1%) | 104-122 (32.7-38.4%) | 122-143 (38.4-45%) | 215-252 (67.6-79.2%) | 77-91 (24.2-28.6%) | 430-505 (135.2-158.8%) | 177-208 (55.7-65.4%) |
| Aerodactyl-Mega | 209-247 (69.2-81.8%) | 250-295 (82.8-97.7%) | 132-155 (43.7-51.3%) | 225-265 (74.5-87.7%) | 189-222 (62.6-73.5%) | 442-521 (146.4-172.5%) | 388-457 (128.5-151.3%) | 141-166 (46.7-55%) | 0-0 (0-0%) | 160-188 (53-62.3%) |
| Heracross-Mega | 80-96 (26.5-31.8%) | 97-114 (32.1-37.7%) | 51-60 (16.9-19.9%) | 87-102 (28.8-33.8%) | 74-87 (24.5-28.8%) | 171-202 (56.6-66.9%) | 151-177 (50-58.6%) | 55-64 (18.2-21.2%) | 75-88 (24.8-29.1%) | 62-73 (20.5-24.2%) |
| Blacephalon | 607-713 (244.8-287.5%) | 90-106 (36.3-42.7%) | 0-0 (0-0%) | 0-0 (0-0%) | 67-79 (27-31.9%) | 319-375 (128.6-151.2%) | 561-660 (226.2-266.1%) | 202-238 (81.5-96%) | 561-660 (226.2-266.1%) | 0-0 (0-0%) |
| Gengar | 552-650 (210.7-248.1%) | 164-193 (62.6-73.7%) | 0-0 (0-0%) | 0-0 (0-0%) | 123-145 (46.9-55.3%) | 291-341 (111.1-130.2%) | 255-301 (97.3-114.9%) | 92-108 (35.1-41.2%) | 511-602 (195-229.8%) | 0-0 (0-0%) |
| Iron Boulder | 440-518 (136.6-160.9%) | 263-309 (81.7-96%) | 138-163 (42.9-50.6%) | 236-278 (73.3-86.3%) | 98-117 (30.4-36.3%) | 232-273 (72-84.8%) | 204-240 (63.4-74.5%) | 148-174 (46-54%) | 408-480 (126.7-149.1%) | 168-198 (52.2-61.5%) |
| Lilligant-Hisui | 115-136 (40.8-48.2%) | 138-163 (48.9-57.8%) | 146-172 (51.8-61%) | 249-293 (88.3-103.9%) | 209-245 (74.1-86.9%) | 122-143 (43.3-50.7%) | 107-126 (37.9-44.7%) | 38-45 (13.5-16%) | 107-126 (37.9-44.7%) | 177-208 (62.8-73.8%) |
| Sharpedo-Mega | 122-144 (43.3-51.1%) | 73-86 (25.9-30.5%) | 308-363 (109.2-128.7%) | 526-619 (186.5-219.5%) | 54-65 (19.1-23%) | 517-608 (183.3-215.6%) | 227-267 (80.5-94.7%) | 41-48 (14.5-17%) | 227-267 (80.5-94.7%) | 374-440 (132.6-156%) |
| Azumarill | 109-128 (31.9-37.4%) | 131-154 (38.3-45%) | 69-81 (20.2-23.7%) | 118-139 (34.5-40.6%) | 24-29 (7-8.5%) | 465-547 (136-159.9%) | 204-240 (59.6-70.2%) | 37-43 (10.8-12.6%) | 204-240 (59.6-70.2%) | 84-99 (24.6-28.9%) |
| Emboar-Mega | 115-136 (31.8-37.6%) | 69-81 (19.1-22.4%) | 146-172 (40.3-47.5%) | 249-293 (68.8-80.9%) | 52-61 (14.4-16.9%) | 244-287 (67.4-79.3%) | 215-252 (59.4-69.6%) | 155-183 (42.8-50.6%) | 430-505 (118.8-139.5%) | 177-208 (48.9-57.5%) |
| Enamorus | 122-144 (42.1-49.7%) | 292-344 (100.7-118.6%) | 38-45 (13.1-15.5%) | 65-77 (22.4-26.6%) | 221-260 (76.2-89.7%) | 517-608 (178.3-209.7%) | 454-534 (156.6-184.1%) | 82-96 (28.3-33.1%) | 0-0 (0-0%) | 46-55 (15.9-19%) |
| Hawlucha | 115-136 (38.6-45.6%) | 138-163 (46.3-54.7%) | 73-86 (24.5-28.9%) | 124-146 (41.6-49%) | 209-245 (70.1-82.2%) | 490-575 (164.4-193%) | 215-252 (72.1-84.6%) | 77-91 (25.8-30.5%) | 0-0 (0-0%) | 88-104 (29.5-34.9%) |
| Haxorus | 200-235 (68-79.9%) | 119-140 (40.5-47.6%) | 126-148 (42.9-50.3%) | 214-252 (72.8-85.7%) | 180-213 (61.2-72.4%) | 105-123 (35.7-41.8%) | 185-218 (62.9-74.1%) | 33-39 (11.2-13.3%) | 185-218 (62.9-74.1%) | 153-180 (52-61.2%) |
| Meganium-Mega | 80-96 (26.5-31.8%) | 195-229 (64.6-75.8%) | 51-60 (16.9-19.9%) | 87-102 (28.8-33.8%) | 148-174 (49-57.6%) | 85-101 (28.1-33.4%) | 151-177 (50-58.6%) | 27-32 (8.9-10.6%) | 75-88 (24.8-29.1%) | 62-73 (20.5-24.2%) |
| Regieleki | 315-371 (104.3-122.8%) | 94-111 (31.1-36.8%) | 199-234 (65.9-77.5%) | 339-399 (112.3-132.1%) | 141-166 (46.7-55%) | 166-196 (55-64.9%) | 293-344 (97-113.9%) | 105-124 (34.8-41.1%) | 586-689 (194-228.1%) | 241-284 (79.8-94%) |
| Serperior | 191-224 (65.4-76.7%) | 114-134 (39-45.9%) | 120-142 (41.1-48.6%) | 205-241 (70.2-82.5%) | 172-204 (58.9-69.9%) | 100-118 (34.2-40.4%) | 177-208 (60.6-71.2%) | 32-37 (11-12.7%) | 88-104 (30.1-35.6%) | 146-172 (50-58.9%) |
| Thundurus | 245-288 (81.7-96%) | 73-86 (24.3-28.7%) | 77-90 (25.7-30%) | 131-154 (43.7-51.3%) | 221-260 (73.7-86.7%) | 258-304 (86-101.3%) | 454-534 (151.3-178%) | 82-96 (27.3-32%) | 0-0 (0-0%) | 93-110 (31-36.7%) |
| Thundurus-Therian | 245-288 (81.7-96%) | 73-86 (24.3-28.7%) | 77-90 (25.7-30%) | 131-154 (43.7-51.3%) | 221-260 (73.7-86.7%) | 258-304 (86-101.3%) | 454-534 (151.3-178%) | 82-96 (27.3-32%) | 0-0 (0-0%) | 93-110 (31-36.7%) |
| Weavile | 130-152 (46.1-53.9%) | 310-364 (109.9-129.1%) | 654-769 (231.9-272.7%) | 1115-1312 (395.4-465.2%) | 58-67 (20.6-23.8%) | 273-322 (96.8-114.2%) | 481-566 (170.6-200.7%) | 86-102 (30.5-36.2%) | 240-283 (85.1-100.4%) | 793-933 (281.2-330.9%) |
| Zoroark-Hisui | 552-650 (219-257.9%) | 164-193 (65.1-76.6%) | 0-0 (0-0%) | 0-0 (0-0%) | 123-145 (48.8-57.5%) | 291-341 (115.5-135.3%) | 255-301 (101.2-119.4%) | 92-108 (36.5-42.9%) | 255-301 (101.2-119.4%) | 0-0 (0-0%) |
| Chandelure-Mega | 339-399 (129.4-152.3%) | 50-59 (19.1-22.5%) | 0-0 (0-0%) | 0-0 (0-0%) | 37-44 (14.1-16.8%) | 178-209 (67.9-79.8%) | 313-369 (119.5-140.8%) | 114-134 (43.5-51.1%) | 313-369 (119.5-140.8%) | 0-0 (0-0%) |
| Conkeldurr | 94-111 (26.7-31.5%) | 114-134 (32.4-38.1%) | 120-142 (34.1-40.3%) | 205-241 (58.2-68.5%) | 85-101 (24.1-28.7%) | 201-237 (57.1-67.3%) | 88-104 (25-29.5%) | 64-75 (18.2-21.3%) | 177-208 (50.3-59.1%) | 146-172 (41.5-48.9%) |
| Pyroar-Mega | 196-231 (62.4-73.6%) | 58-69 (18.5-22%) | 248-291 (79-92.7%) | 422-496 (134.4-158%) | 44-52 (14-16.6%) | 206-243 (65.6-77.4%) | 364-428 (115.9-136.3%) | 132-155 (42-49.4%) | 364-428 (115.9-136.3%) | 300-353 (95.5-112.4%) |
| Scolipede | 201-237 (76.7-90.5%) | 120-142 (45.8-54.2%) | 31-37 (11.8-14.1%) | 54-63 (20.6-24%) | 91-106 (34.7-40.5%) | 213-250 (81.3-95.4%) | 374-440 (142.7-167.9%) | 68-80 (26-30.5%) | 187-220 (71.4-84%) | 38-45 (14.5-17.2%) |
| Scolipede-Mega | 130-153 (49.6-58.4%) | 78-92 (29.8-35.1%) | 20-24 (7.6-9.2%) | 34-41 (13-15.6%) | 59-70 (22.5-26.7%) | 137-161 (52.3-61.5%) | 241-284 (92-108.4%) | 44-52 (16.8-19.8%) | 120-142 (45.8-54.2%) | 24-29 (9.2-11.1%) |

**If UU already answers a candidate cleanly, that is an argument for it staying**
— the promotion case needs UU's counterplay to be insufficient, not merely
inconvenient.

---

## K. There is no downward role comparison

Section K compares each demotion candidate against the tier below in the RU, NU
and PU packets. **This pass proposes no demotions** (section E), so the
comparison does not exist here.

The lettering is kept aligned with the sibling packets deliberately, so that
"section L is the speed table" means the same thing in all six. This section is
empty on purpose rather than missing by accident.

The upward role comparison, which is the one that exists here, is **section H**.

---
## L. UU speed-tier table

Every UU entry at base Speed 80+. **Priority is not Speed** — that is section M.

| Pokémon | Base | Max neutral | Max +Spe | +1 | +2 | Scarf (from max +Spe) |
| --- | --- | --- | --- | --- | --- | --- |
| Regieleki | 200 | 499 | 548 | 822 | 1096 | 822 |
| Aerodactyl-Mega | 150 | 399 | 438 | 657 | 876 | 657 |
| Zeraora | 143 | 385 | 423 | 634 | 846 | 634 |
| Delphox-Mega | 134 | 367 | 403 | 604 | 806 | 604 |
| Raichu-Mega-Y | 130 | 359 | 394 | 591 | 788 | 591 |
| Pyroar-Mega | 126 | 351 | 386 | 579 | 772 | 579 |
| Weavile | 125 | 349 | 383 | 574 | 766 | 574 |
| Iron Boulder | 124 | 347 | 381 | 571 | 762 | 571 |
| Alakazam | 120 | 339 | 372 | 558 | 744 | 558 |
| Starmie-Mega | 120 | 339 | 372 | 558 | 744 | 558 |
| Hawlucha | 118 | 335 | 368 | 552 | 736 | 552 |
| Serperior | 113 | 325 | 357 | 535 | 714 | 535 |
| Scolipede | 112 | 323 | 355 | 532 | 710 | 532 |
| Thundurus | 111 | 321 | 353 | 529 | 706 | 529 |
| Gengar | 110 | 319 | 350 | 525 | 700 | 525 |
| Latias-Mega | 110 | 319 | 350 | 525 | 700 | 525 |
| Skarmory-Mega | 110 | 319 | 350 | 525 | 700 | 525 |
| Staraptor-Mega | 110 | 319 | 350 | 525 | 700 | 525 |
| Zoroark-Hisui | 110 | 319 | 350 | 525 | 700 | 525 |
| Keldeo | 108 | 315 | 346 | 519 | 692 | 519 |
| Terrakion | 108 | 315 | 346 | 519 | 692 | 519 |
| Blacephalon | 107 | 313 | 344 | 516 | 688 | 516 |
| Enamorus | 106 | 311 | 342 | 513 | 684 | 513 |
| Iron Treads | 106 | 311 | 342 | 513 | 684 | 513 |
| Lilligant-Hisui | 105 | 309 | 339 | 508 | 678 | 508 |
| Mienshao | 105 | 309 | 339 | 508 | 678 | 508 |
| Sharpedo-Mega | 105 | 309 | 339 | 508 | 678 | 508 |
| Iron Leaves | 104 | 307 | 337 | 505 | 674 | 505 |
| Thundurus-Therian | 101 | 301 | 331 | 496 | 662 | 496 |
| Gardevoir-Mega | 100 | 299 | 328 | 492 | 656 | 492 |
| Jirachi | 100 | 299 | 328 | 492 | 656 | 492 |
| Mew | 100 | 299 | 328 | 492 | 656 | 492 |
| Salamence | 100 | 299 | 328 | 492 | 656 | 492 |
| Victini | 100 | 299 | 328 | 492 | 656 | 492 |
| Zapdos-Galar | 100 | 299 | 328 | 492 | 656 | 492 |
| Hydreigon | 98 | 295 | 324 | 486 | 648 | 486 |
| Iron Crown | 98 | 295 | 324 | 486 | 648 | 486 |
| Haxorus | 97 | 293 | 322 | 483 | 644 | 483 |
| Chandelure-Mega | 90 | 279 | 306 | 459 | 612 | 459 |
| Moltres | 90 | 279 | 306 | 459 | 612 | 459 |
| Moltres-Galar | 90 | 279 | 306 | 459 | 612 | 459 |
| Porygon-Z | 90 | 279 | 306 | 459 | 612 | 459 |
| Excadrill | 88 | 275 | 302 | 453 | 604 | 453 |
| Pecharunt | 88 | 275 | 302 | 453 | 604 | 453 |
| Glimmora | 86 | 271 | 298 | 447 | 596 | 447 |
| Rotom-Wash | 86 | 271 | 298 | 447 | 596 | 447 |
| Archaludon | 85 | 269 | 295 | 442 | 590 | 442 |
| Quaquaval | 85 | 269 | 295 | 442 | 590 | 442 |
| Tapu Fini | 85 | 269 | 295 | 442 | 590 | 442 |
| Gyarados | 81 | 261 | 287 | 430 | 574 | 430 |
| Altaria-Mega | 80 | 259 | 284 | 426 | 568 | 426 |
| Chandelure | 80 | 259 | 284 | 426 | 568 | 426 |
| Mamoswine | 80 | 259 | 284 | 426 | 568 | 426 |
| Meganium-Mega | 80 | 259 | 284 | 426 | 568 | 426 |
| Okidogi | 80 | 259 | 284 | 426 | 568 | 426 |
| Venusaur-Mega | 80 | 259 | 284 | 426 | 568 | 426 |

**The same table for OU**, so the two ladders can be read against each other:

| Pokémon | Base | Max neutral | Max +Spe | +1 | +2 | Scarf (from max +Spe) |
| --- | --- | --- | --- | --- | --- | --- |
| Deoxys-Speed | 180 | 459 | 504 | 756 | 1008 | 756 |
| Zeraora-Mega | 153 | 405 | 445 | 667 | 890 | 667 |
| Pheromosa | 151 | 401 | 441 | 661 | 882 | 661 |
| Alakazam-Mega | 150 | 399 | 438 | 657 | 876 | 657 |
| Deoxys | 150 | 399 | 438 | 657 | 876 | 657 |
| Dragapult | 142 | 383 | 421 | 631 | 842 | 631 |
| Greninja-Mega | 142 | 383 | 421 | 631 | 842 | 631 |
| Zamazenta | 138 | 375 | 412 | 618 | 824 | 618 |
| Lopunny-Mega | 135 | 369 | 405 | 607 | 810 | 607 |
| Greninja-Ash | 132 | 363 | 399 | 598 | 798 | 598 |
| Spectrier | 130 | 359 | 394 | 591 | 788 | 591 |
| Tapu Koko | 130 | 359 | 394 | 591 | 788 | 591 |
| Darkrai | 125 | 349 | 383 | 574 | 766 | 574 |
| Marshadow | 125 | 349 | 383 | 574 | 766 | 574 |
| Meowscarada | 123 | 345 | 379 | 568 | 758 | 568 |
| Greninja | 122 | 343 | 377 | 565 | 754 | 565 |
| Naganadel | 121 | 341 | 375 | 562 | 750 | 562 |
| Tornadus-Therian | 121 | 341 | 375 | 562 | 750 | 562 |
| Cinderace | 119 | 337 | 370 | 555 | 740 | 555 |
| Roaring Moon | 119 | 337 | 370 | 555 | 740 | 555 |
| Hawlucha-Mega | 118 | 335 | 368 | 552 | 736 | 552 |
| Iron Valiant | 116 | 331 | 364 | 546 | 728 | 546 |
| Lucario-Mega | 112 | 323 | 355 | 532 | 710 | 532 |
| Diancie-Mega | 110 | 319 | 350 | 525 | 700 | 525 |
| Gallade-Mega | 110 | 319 | 350 | 525 | 700 | 525 |
| Iron Moth | 110 | 319 | 350 | 525 | 700 | 525 |
| Latios | 110 | 319 | 350 | 525 | 700 | 525 |
| Latios-Mega | 110 | 319 | 350 | 525 | 700 | 525 |
| Lugia | 110 | 319 | 350 | 525 | 700 | 525 |
| Metagross-Mega | 110 | 319 | 350 | 525 | 700 | 525 |
| Ogerpon-Cornerstone | 110 | 319 | 350 | 525 | 700 | 525 |
| Ogerpon-Hearthflame | 110 | 319 | 350 | 525 | 700 | 525 |
| Ogerpon-Wellspring | 110 | 319 | 350 | 525 | 700 | 525 |
| Kartana | 109 | 317 | 348 | 522 | 696 | 522 |
| Pinsir-Mega | 105 | 309 | 339 | 508 | 678 | 508 |
| Excadrill-Mega | 103 | 305 | 335 | 502 | 670 | 502 |
| Floette-Mega | 102 | 303 | 333 | 499 | 666 | 499 |
| Garchomp | 102 | 303 | 333 | 499 | 666 | 499 |
| Glimmora-Mega | 101 | 301 | 331 | 496 | 662 | 496 |
| Charizard-Mega-X | 100 | 299 | 328 | 492 | 656 | 492 |
| Charizard-Mega-Y | 100 | 299 | 328 | 492 | 656 | 492 |
| Manaphy | 100 | 299 | 328 | 492 | 656 | 492 |
| Medicham-Mega | 100 | 299 | 328 | 492 | 656 | 492 |
| Volcarona | 100 | 299 | 328 | 492 | 656 | 492 |
| Zapdos | 100 | 299 | 328 | 492 | 656 | 492 |

**Conditional speed abilities in UU** — none is active by default, and the table
above does **not** assume any of them:

- **Swift Swim — needs rain**: Swampert-Mega
- **Chlorophyll — needs sun**: Lilligant-Hisui
- **Sand Rush — needs sandstorm**: Excadrill
- **Slush Rush — needs snow**: _nobody in UU_
- **Unburden — needs its item consumed, so **no forme entry can use it****: Hawlucha
- **Speed Boost — +1 at the end of each turn**: Scolipede
- **Quick Feet — needs a status; the Orbs fire ON ENTRY, so this is live from turn one**: Scolipede
- **Light Metal — **+1 Speed on EVERY entry**, resets on switch-out (RedGPT redesign)**: Metagross, Scizor
- **Motor Drive — +1 Speed on absorbing an Electric move**: _nobody in UU_
- **Quark Drive — needs Electric Terrain or Booster Energy**: Iron Boulder, Iron Crown, Iron Leaves, Iron Treads
- **Protosynthesis — needs sun or Booster Energy**: _nobody in UU_
- **Weak Armor — +2 Speed when hit by a physical move**: Polteageist, Skarmory

---

## M. UU priority table

Engine priority for every UU entry that has any, including Grassy Glide's
engine-side +1. Conditional entries are annotated.

| Pokémon | Priority moves (engine BP / bracket) | Max offence | Abilities |
| --- | --- | --- | --- |
| Aegislash | Shadow Sneak 40P Ghost (+1) | Atk 218 / SpA 218 | Stance Change |
| Aegislash-Blade | Shadow Sneak 40P Ghost (+1) | Atk 438 / SpA 438 | Stance Change |
| Azumarill | Aqua Jet 40P Water (+1) | Atk 218 / SpA 240 | Thick Fat/Huge Power/Sap Sipper |
| Bisharp | Sucker Punch 80P Dark (+1) | Atk 383 / SpA 240 | Defiant/Inner Focus/Pressure |
| Conkeldurr | Upper Hand 65P Fighting (+3); Mach Punch 40P Fighting (+1) | Atk 416 / SpA 229 | Guts/Sheer Force/Iron Fist |
| Emboar-Mega | Sucker Punch 80P Dark (+1) | Atk 434 / SpA 350 | Mold Breaker |
| Gardevoir-Mega | Shadow Sneak 40P Ghost (+1); Vacuum Wave 40S Fighting (+1) | Atk 295 / SpA 471 | Pixilate |
| Gengar | Sucker Punch 80P Dark (+1) | Atk 251 / SpA 394 | Cursed Body/Levitate |
| Goodra-Hisui | Feint 50P Normal (+2) | Atk 328 / SpA 350 | Sap Sipper/Shell Armor/Gooey |
| Hawlucha | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2) | Atk 311 / SpA 271 | Limber/Unburden/Mold Breaker |
| Haxorus | First Impression 90P Bug (+2) | Atk 432 / SpA 240 | Rivalry/Mold Breaker/Unnerve |
| Heracross-Mega | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Vacuum Wave 40S Fighting (+1) | Atk 515 / SpA 196 | Skill Link |
| Hydrapple | Sucker Punch 80P Dark (+1); Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]** | Atk 284 / SpA 372 | Supersweet Syrup/Regenerator/Sticky Hold |
| Iron Boulder | Quick Attack 40P Normal (+1) | Atk 372 / SpA 258 | Quark Drive |
| Iron Leaves | Quick Attack 40P Normal (+1) | Atk 394 / SpA 262 | Quark Drive |
| Keldeo | Upper Hand 65P Fighting (+3); Aqua Jet 40P Water (+1); Vacuum Wave 40S Fighting (+1) | Atk 267 / SpA 392 | Justified |
| Latias-Mega | Sucker Punch 80P Dark (+1) | Atk 328 / SpA 416 | Levitate |
| Lilligant-Hisui | Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]**; Upper Hand 65P Fighting (+3); Vacuum Wave 40S Fighting (+1) | Atk 339 / SpA 218 | Chlorophyll/Hustle/Leaf Guard |
| Mamoswine | Ice Shard 40P Ice (+1) | Atk 394 / SpA 262 | Oblivious/Snow Cloak/Thick Fat |
| Meganium-Mega | Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]** | Atk 311 / SpA 423 | Mega Sol |
| Metagross | Bullet Punch 40P Steel (+1) | Atk 405 / SpA 317 | Clear Body/Light Metal |
| Mew | Sucker Punch 80P Dark (+1); Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]**; Upper Hand 65P Fighting (+3); Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]** | Atk 328 / SpA 328 | Synchronize |
| Mienshao | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**; Vacuum Wave 40S Fighting (+1) | Atk 383 / SpA 317 | Inner Focus/Regenerator/Reckless |
| Moltres-Galar | Sucker Punch 80P Dark (+1) | Atk 295 / SpA 328 | Berserk |
| Okidogi | Upper Hand 65P Fighting (+3) | Atk 390 / SpA 236 | Toxic Chain/Guard Dog |
| Polteageist | Sucker Punch 80P Dark (+1) | Atk 251 / SpA 403 | Weak Armor/Cursed Body |
| Primarina | Aqua Jet 40P Water (+1) | Atk 271 / SpA 386 | Torrent/Liquid Voice |
| Quaquaval | Upper Hand 65P Fighting (+3); Aqua Jet 40P Water (+1) | Atk 372 / SpA 295 | Torrent/Moxie |
| Raichu-Mega-Y | Extreme Speed 80P Normal (+2); Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]** | Atk 328 / SpA 460 | No Guard |
| Regieleki | Extreme Speed 80P Normal (+2) | Atk 328 / SpA 328 | Transistor |
| Rotom-Wash | Sucker Punch 80P Dark (+1) | Atk 251 / SpA 339 | Levitate |
| Sableye-Mega | Sucker Punch 80P Dark (+1); Feint 50P Normal (+2); Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**; Shadow Sneak 40P Ghost (+1) | Atk 295 / SpA 295 | Magic Bounce |
| Scizor | Feint 50P Normal (+2); Bullet Punch 40P Steel (+1); Quick Attack 40P Normal (+1); Vacuum Wave 40S Fighting (+1) | Atk 394 / SpA 229 | Swarm/Technician/Light Metal |
| Scrafty-Mega | Upper Hand 65P Fighting (+3); Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]** | Atk 394 / SpA 229 | Intimidate |
| Serperior | Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]** | Atk 273 / SpA 273 | Overgrow/Contrary |
| Sharpedo-Mega | Feint 50P Normal (+2); Aqua Jet 40P Water (+1) | Atk 416 / SpA 350 | Strong Jaw |
| Skarmory | Feint 50P Normal (+2) | Atk 284 / SpA 196 | Keen Eye/Sturdy/Weak Armor |
| Skarmory-Mega | Feint 50P Normal (+2) | Atk 416 / SpA 196 | Stalwart |
| Staraptor-Mega | Quick Attack 40P Normal (+1) | Atk 416 / SpA 240 | Contrary |
| Terrakion | Upper Hand 65P Fighting (+3); Quick Attack 40P Normal (+1) | Atk 392 / SpA 267 | Justified |
| Venusaur-Mega | Grassy Glide 70P Grass (+1) **[RedGPT: the engine adds **+1 priority**; the packaged move reads 0]** | Atk 328 / SpA 377 | Thick Fat |
| Victini | Quick Attack 40P Normal (+1) | Atk 328 / SpA 328 | Victory Star |
| Weavile | Upper Hand 65P Fighting (+3); Feint 50P Normal (+2); Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**; Ice Shard 40P Ice (+1) | Atk 372 / SpA 207 | Pressure/Pickpocket |
| Zeraora | Fake Out 40P Normal (+3) **[conditional — only on the user’s first acting turn after switching in]**; Quick Attack 40P Normal (+1) | Atk 355 / SpA 333 | Volt Absorb |
| Zoroark-Hisui | Sucker Punch 80P Dark (+1); Shadow Sneak 40P Ghost (+1) | Atk 328 / SpA 383 | Illusion |

---
## N. Weather / terrain / Trick Room / Tailwind environment

**Weather by ability (automatic):** Hippowdon, Tyranitar.

**Weather abusers by ability:** Excadrill, Hippowdon, Lilligant-Hisui, Swampert-Mega.

**Terrain by ability:** Tapu Fini.

**Trick Room setters:** Alakazam, Chandelure, Chandelure-Mega, Delphox-Mega, Gardevoir-Mega, Gengar, Hatterene, Jirachi, Mew, Polteageist, Porygon-Z, Slowbro, Slowbro-Mega, Slowking, Starmie-Mega, Victini. The **Warp Prism** makes Trick Room *the holder sets* last **8** turns instead of 5 — **but a forme entry cannot hold one.**

**Slow breakers that want it** (base Speed ≤ 60 with real offence): Aegislash-Blade, Azumarill, Conkeldurr, Dragalge-Mega, Drampa-Mega, Hatterene, Hydrapple, Primarina, Slowbro-Mega, Ursaluna.

**Tailwind setters:** Aerodactyl-Mega, Altaria-Mega, Corviknight, Drampa-Mega, Enamorus, Hawlucha, Hydreigon, Latias-Mega, Mew, Moltres, Moltres-Galar, Salamence, Scizor, Skarmory, Skarmory-Mega, Staraptor-Mega, Zapdos-Galar. The **Wind Sock** makes Tailwind *the holder sets* last **7** turns instead of 4.

---

## O. UU hazard environment

**Stealth Rock:** Aerodactyl-Mega, Archaludon, Bisharp, Blissey, Chansey, Clefable, Excadrill, Glimmora, Hippowdon, Hydreigon, Iron Treads, Jirachi, Mamoswine, Metagross, Mew, Skarmory, Skarmory-Mega, Swampert, Swampert-Mega, Terrakion, Tyranitar

**Spikes:** Glimmora, Heracross-Mega, Mew, Scolipede, Scolipede-Mega, Skarmory, Skarmory-Mega

**Toxic Spikes:** Dragalge-Mega, Gengar, Glimmora, Mew, Scolipede, Scolipede-Mega

**Sticky Web:** none

**Rapid Spin:** Excadrill, Iron Treads, Quaquaval, Regieleki, Starmie-Mega

**Defog:** Aerodactyl-Mega, Altaria-Mega, Conkeldurr, Corviknight, Drampa-Mega, Hawlucha, Hydreigon, Latias-Mega, Lilligant-Hisui, Mew, Moltres, Moltres-Galar, Rotom-Wash, Salamence, Scizor, Serperior, Skarmory, Skarmory-Mega, Staraptor-Mega, Tapu Fini, Thundurus, Thundurus-Therian, Zapdos-Galar

**Mortal Spin / Tidy Up / Court Change:** Glimmora

**Magic Bounce:** Hatterene, Sableye-Mega

**Ghost types (block Rapid Spin):** Aegislash, Aegislash-Blade, Blacephalon, Chandelure, Chandelure-Mega, Gengar, Pecharunt, Polteageist, Sableye-Mega, Zoroark-Hisui

**Heavy-Duty Boots are unavailable to all 23 forme entries**, because the stone occupies
the slot. The Rock-weak ones pay the most: Aerodactyl-Mega (×2), Chandelure-Mega (×2), Delphox-Mega (×2), Pyroar-Mega (×2), Scolipede-Mega (×2).

---

## P. Recovery / longevity

These four categories are **not** interchangeable and are deliberately kept apart.

**TRUE IMMEDIATE RECOVERY** — Recover, Roost, Slack Off, Shore Up, Soft-Boiled, Milk Drink, Morning Sun, Synthesis, Moonlight (91 entries):

Aegislash (Rest); Aegislash-Blade (Rest); Aerodactyl-Mega (Rest, Roost); Alakazam (Recover, Rest); Altaria-Mega (Rest, Roost); Amoonguss (Rest); Archaludon (Rest); Azumarill (Rest); Bisharp (Rest); Blacephalon (Rest); Blissey (Rest, Soft-Boiled); Buzzwole (Rest, Roost); Celesteela (Rest); Chandelure (Rest); Chandelure-Mega (Rest); Chansey (Rest, Soft-Boiled); Clefable (Rest, Soft-Boiled); Conkeldurr (Rest); Corviknight (Rest, Roost); Delphox-Mega (Rest); Dragalge-Mega (Rest); Drampa-Mega (Rest, Roost); Emboar-Mega (Rest); Enamorus (Rest); Excadrill (Rest); Gardevoir-Mega (Rest); Gengar (Rest); Glimmora (Rest); Goodra-Hisui (Rest); Gyarados (Rest); Hatterene (Rest); Hawlucha (Rest, Roost); Haxorus (Rest); Heracross-Mega (Rest); Hippowdon (Rest, Slack Off); Hydrapple (Recover, Rest); Hydreigon (Rest, Roost); Iron Boulder (Rest); Iron Crown (Rest); Iron Leaves (Rest); Iron Treads (Rest); Jirachi (Rest); Keldeo (Rest); Latias-Mega (Recover, Rest, Roost); Lilligant-Hisui (Rest); Mamoswine (Rest); Meganium-Mega (Rest); Metagross (Rest); Mew (Rest, Roost, Soft-Boiled); Mienshao (Rest); Moltres (Rest, Roost); Moltres-Galar (Rest, Roost); Okidogi (Rest); Pecharunt (Recover, Rest); Polteageist (Rest); Porygon-Z (Recover, Rest); Primarina (Rest); Pyroar-Mega (Rest); Quaquaval (Rest, Roost); Raichu-Mega-Y (Rest), _+31 more_

**REST** — two helpless turns unless Early Bird, Sleep Talk or Snore is in the set. **Not** equivalent to the above (91 entries):

Aegislash; Aegislash-Blade; Aerodactyl-Mega; Alakazam; Altaria-Mega; Amoonguss; Archaludon; Azumarill; Bisharp; Blacephalon; Blissey; Buzzwole; Celesteela; Chandelure; Chandelure-Mega; Chansey; Clefable; Conkeldurr; Corviknight; Delphox-Mega; Dragalge-Mega; Drampa-Mega; Emboar-Mega; Enamorus; Excadrill; Gardevoir-Mega; Gengar; Glimmora; Goodra-Hisui; Gyarados; Hatterene; Hawlucha; Haxorus; Heracross-Mega; Hippowdon; Hydrapple; Hydreigon; Iron Boulder; Iron Crown; Iron Leaves; Iron Treads; Jirachi; Keldeo; Latias-Mega; Lilligant-Hisui; Mamoswine; Meganium-Mega; Metagross; Mew; Mienshao; Moltres; Moltres-Galar; Okidogi; Pecharunt; Polteageist; Porygon-Z; Primarina; Pyroar-Mega; Quaquaval; Raichu-Mega-Y, _+31 more_

**DRAINING** — proportional to damage dealt, so it fails against a resist and against a wall (46 entries):

Alakazam (Drain Punch, Dream Eater); Altaria-Mega (Dream Eater); Amoonguss (Absorb, Giga Drain, Mega Drain); Azumarill (Draining Kiss); Blissey (Drain Punch, Dream Eater); Buzzwole (Drain Punch, Leech Life); Celesteela (Absorb, Giga Drain, Mega Drain); Chandelure (Dream Eater); Chandelure-Mega (Dream Eater); Chansey (Drain Punch, Dream Eater); Clefable (Drain Punch, Draining Kiss, Dream Eater); Conkeldurr (Drain Punch); Delphox-Mega (Dream Eater); Emboar-Mega (Drain Punch); Enamorus (Draining Kiss); Gardevoir-Mega (Draining Kiss, Dream Eater); Gengar (Drain Punch, Dream Eater, Giga Drain, Mega Drain); Goodra-Hisui (Absorb); Hatterene (Draining Kiss, Giga Drain); Hawlucha (Drain Punch); Hydrapple (Giga Drain); Iron Leaves (Giga Drain); Jirachi (Drain Punch, Dream Eater); Latias-Mega (Draining Kiss, Dream Eater); Lilligant-Hisui (Absorb, Dream Eater, Giga Drain, Mega Drain); Meganium-Mega (Giga Drain); Mew (Drain Punch, Draining Kiss, Dream Eater, Giga Drain, Leech Life, Mega Drain); Mienshao (Drain Punch); Okidogi (Drain Punch); Polteageist (Giga Drain, Mega Drain); Porygon-Z (Dream Eater); Primarina (Draining Kiss); Raichu-Mega-Y (Draining Kiss); Rotom-Wash (Dream Eater); Sableye-Mega (Drain Punch, Dream Eater, Giga Drain); Scrafty-Mega (Drain Punch); Serperior (Giga Drain, Mega Drain); Slowbro (Drain Punch, Dream Eater); Slowbro-Mega (Drain Punch, Dream Eater); Slowking (Drain Punch, Dream Eater); Starmie-Mega (Dream Eater); Tapu Fini (Draining Kiss); Ursaluna (Drain Punch); Venusaur-Mega (Giga Drain, Mega Drain); Weavile (Dream Eater); Zeraora (Drain Punch)

**PASSIVE / absorbs** (11 entries; **Leftovers is unavailable to every forme entry**):

Amoonguss (Regenerator); Azumarill (Sap Sipper); Chandelure (Flash Fire); Dragalge-Mega (Regenerator); Goodra-Hisui (Sap Sipper); Hydrapple (Regenerator); Mienshao (Regenerator); Slowbro (Regenerator); Slowking (Regenerator); Thundurus-Therian (Volt Absorb); Zeraora (Volt Absorb)

---
## Q. Item and ability edge cases — the Mega opportunity cost

**This is the section with no counterpart in the ZU packet**, where item freedom
was universal. In UU it is the central asymmetry of the rung.

**Forme entries whose item slot is spent (23):**

| Forme | Forced item | Base | Base's own tier | Ability |
| --- | --- | --- | --- | --- |
| Aerodactyl-Mega | Aerodactylite | Aerodactyl | NU | Tough Claws |
| Altaria-Mega | Altarianite | Altaria | NU | Pixilate |
| Chandelure-Mega | Chandelurite | Chandelure | UU | Infiltrator |
| Delphox-Mega | Delphoxite | Delphox | PU | Levitate |
| Dragalge-Mega | Dragalgite | Dragalge | NU | Regenerator |
| Drampa-Mega | Drampanite | Drampa | NU | Berserk |
| Emboar-Mega | Emboarite | Emboar | PU | Mold Breaker |
| Gardevoir-Mega | Gardevoirite | Gardevoir | RU | Pixilate |
| Heracross-Mega | Heracronite | Heracross | NU | Skill Link |
| Latias-Mega | Latiasite | Latias | RU | Levitate |
| Meganium-Mega | Meganiumite | Meganium | ZU | Mega Sol |
| Pyroar-Mega | Pyroarite | Pyroar | ZU | Fire Mane |
| Raichu-Mega-Y | Raichunite Y | Raichu | ZU | No Guard |
| Sableye-Mega | Sablenite | Sableye | ZU | Magic Bounce |
| Scolipede-Mega | Scolipite | Scolipede | UU | Shell Armor |
| Scrafty-Mega | Scraftinite | Scrafty | NU | Intimidate |
| Sharpedo-Mega | Sharpedonite | Sharpedo | RU | Strong Jaw |
| Skarmory-Mega | Skarmorite | Skarmory | UU | Stalwart |
| Slowbro-Mega | Slowbronite | Slowbro | UU | Shell Armor |
| Staraptor-Mega | Staraptite | Staraptor | NU | Contrary |
| Starmie-Mega | Starminite | Starmie | NU | Huge Power |
| Swampert-Mega | Swampertite | Swampert | UU | Swift Swim |
| Venusaur-Mega | Venusaurite | Venusaur | ZU | Thick Fat |

**UU species barred from their own Mega (12):** see section R — every one
refused by the real validator, with the species itself staying legal.

### Trapping in UU

**UU trapping-ability holders: Chandelure.**

For context, across the whole ladder:

| Tier | Trapping-ability holders |
| --- | --- |
| Ubers | Gengar-Mega |
| OU | none |
| UU | Chandelure |
| RU | Magnezone |
| NU | Gothitelle, Magneton |
| PU | Dugtrio, Gothorita, Lampent, Wobbuffet |
| ZU | Diglett, Geodude-Alola, Golem-Alola, Gothita, Graveler-Alola, Litwick, Magnemite, Meltan, Nosepass, Probopass, Trapinch, Wynaut |

**The counterplay measured in the global trapping audit applies unchanged:**
Ghost typing, Shed Shell, Guard Dog, all six pivot moves (U-turn, Volt Switch,
Flip Turn, Parting Shot, Baton Pass, Teleport) and phazing all escape a trap, and
the trap ends the moment the trapper leaves or faints. Mold Breaker does **not**
break trapping.

---

## R. Transformation / forme legality

Every UU entry was checked for a route to a higher-tier forme in battle.

**17 item-driven routes exist from a UU species; 5 are legal in UU and
12 target a forme above UU, of which **0 are legal**.** Each was put through
`Validation.validateTeam` in the UU format rather than read off the data:

| UU species | Item | Forme it would make | That forme's tier | Direction | Validator |
| --- | --- | --- | --- | --- | --- |
| Alakazam | Alakazite | Alakazam-Mega | **OU** | above UU | refused |
| Chandelure | Chandelurite | Chandelure-Mega | **UU** | same rung or below | **LEGAL — HOLE** |
| Clefable | Clefablite | Clefable-Mega | **OU** | above UU | refused |
| Excadrill | Excadrite | Excadrill-Mega | **OU** | above UU | refused |
| Gengar | Gengarite | Gengar-Mega | **Ubers** | above UU | refused |
| Glimmora | Glimmoranite | Glimmora-Mega | **OU** | above UU | refused |
| Gyarados | Gyaradosite | Gyarados-Mega | **OU** | above UU | refused |
| Hawlucha | Hawluchanite | Hawlucha-Mega | **OU** | above UU | refused |
| Metagross | Metagrossite | Metagross-Mega | **OU** | above UU | refused |
| Salamence | Salamencite | Salamence-Mega | **Ubers** | above UU | refused |
| Scizor | Scizorite | Scizor-Mega | **OU** | above UU | refused |
| Scolipede | Scolipite | Scolipede-Mega | **UU** | same rung or below | **LEGAL — HOLE** |
| Skarmory | Skarmorite | Skarmory-Mega | **UU** | same rung or below | **LEGAL — HOLE** |
| Slowbro | Slowbronite | Slowbro-Mega | **UU** | same rung or below | **LEGAL — HOLE** |
| Swampert | Swampertite | Swampert-Mega | **UU** | same rung or below | **LEGAL — HOLE** |
| Tyranitar | Tyranitarite | Tyranitar-Mega | **OU** | above UU | refused |
| Zeraora | Zeraorite | Zeraora-Mega | **OU** | above UU | refused |

**Ability-driven routes from UU:**

_None. No UU entry reaches another forme through an ability._

**Move-driven routes from UU:**

_None. The only move-driven forme routes on the entire ladder belong to Meloetta — see Part II, section MEL9._

**Aegislash is the one entry whose forme changes without any route to gate**, and
it is worth stating explicitly: **both Aegislash and Aegislash-Blade are UU**, and
Stance Change is Aegislash's **only** ability, so it is tiered as one unit — which
is what the "inseparable" half of the ability-forme rule means. Their profiles in
section C differ enormously (Shield Atk 218 / Blade Atk 438) and they are the same Pokémon in one battle.

---
## S. Mechanical outliers surfaced by the broad scan

**Mechanical flags only — reasons to look, NOT recommendations.** 36 of
91 UU entries tripped three or more. No arbitrary cap was applied.

- **Latias-Mega** (Dragon/Psychic, BST 700, Levitate, item forced: Latiasite) — Special Attack **416** — in OU's top quarter (≥401); Speed **350** — in OU's top quarter (≥350); **BST 700** — in OU's top quarter (≥630); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Levitate; reliable recovery on a bulky frame.
- **Delphox-Mega** (Fire/Psychic, BST 634, Levitate, item forced: Delphoxite) — Special Attack **458** — in OU's top quarter (≥401); Speed **403** — in OU's top quarter (≥350); **BST 634** — in OU's top quarter (≥630); strong setup on a frame fast enough to use it; ability: Levitate.
- **Starmie-Mega** (Water/Psychic, BST 620, Huge Power, item forced: Starminite) — Attack **656** — in OU's top quarter (≥416); Speed **372** — in OU's top quarter (≥350); Special Attack 394 — above OU's median (328); BST 620 — above OU's median (600); Attack reaches 656 off base 100 — an ability is doing the work; ability: Huge Power; reliable recovery on a bulky frame.
- **Skarmory-Mega** (Steel/Flying, BST 565, Stalwart, item forced: Skarmorite) — Attack **416** — in OU's top quarter (≥416); Speed **350** — in OU's top quarter (≥350); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; hazards + real offence; reliable recovery on a bulky frame.
- **Raichu-Mega-Y** (Electric, BST 585, No Guard, item forced: Raichunite Y) — Special Attack **460** — in OU's top quarter (≥401); Speed **394** — in OU's top quarter (≥350); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: No Guard.
- **Aegislash-Blade** (Steel/Ghost, BST 520, Stance Change) — Attack **438** — in OU's top quarter (≥416); Special Attack **438** — in OU's top quarter (≥401); setup + priority + reliable recovery; ability: Stance Change.
- **Staraptor-Mega** (Fighting/Flying, BST 585, Contrary, item forced: Staraptite) — Attack **416** — in OU's top quarter (≥416); Speed **350** — in OU's top quarter (≥350); setup + priority + reliable recovery; ability: Contrary.
- **Swampert-Mega** (Water/Ground, BST 635, Swift Swim, item forced: Swampertite) — Attack **438** — in OU's top quarter (≥416); **BST 635** — in OU's top quarter (≥630); hazards + real offence; reliable recovery on a bulky frame.
- **Alakazam** (Psychic, BST 500, Synchronize/Inner Focus/Magic Guard) — Special Attack **405** — in OU's top quarter (≥401); Speed **372** — in OU's top quarter (≥350); strong setup on a frame fast enough to use it.
- **Chandelure** (Ghost/Fire, BST 520, Flash Fire/Flame Body/Infiltrator/Shadow Tag) — Special Attack **427** — in OU's top quarter (≥401); **trapping ability: Shadow Tag**; ability: Flash Fire.
- **Gardevoir-Mega** (Psychic/Fairy, BST 618, Pixilate, item forced: Gardevoirite) — Special Attack **471** — in OU's top quarter (≥401); Speed 328 — above OU's median (322); BST 618 — above OU's median (600); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Pixilate; reliable recovery on a bulky frame.
- **Zeraora** (Electric, BST 600, Volt Absorb) — Speed **423** — in OU's top quarter (≥350); Special Attack 333 — above OU's median (328); BST 600 — above OU's median (600); Special Attack reaches 333 off base 102 — an ability is doing the work; setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Volt Absorb.
- **Aerodactyl-Mega** (Rock/Flying, BST 615, Tough Claws, item forced: Aerodactylite) — Speed **438** — in OU's top quarter (≥350); Attack 405 — above OU's median (372); BST 615 — above OU's median (600); strong setup on a frame fast enough to use it; ability: Tough Claws; hazards + real offence.
- **Heracross-Mega** (Bug/Fighting, BST 600, Skill Link, item forced: Heracronite) — Attack **515** — in OU's top quarter (≥416); BST 600 — above OU's median (600); setup + priority + reliable recovery; ability: Skill Link; hazards + real offence; reliable recovery on a bulky frame.
- **Blacephalon** (Fire/Ghost, BST 570, Beast Boost) — Special Attack **441** — in OU's top quarter (≥401); Attack 388 — above OU's median (372); Speed 344 — above OU's median (322); strong setup on a frame fast enough to use it; ability: Beast Boost.
- **Gengar** (Ghost/Poison, BST 500, Cursed Body/Levitate) — Speed **350** — in OU's top quarter (≥350); Special Attack 394 — above OU's median (328); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Levitate.
- **Iron Boulder** (Rock/Psychic, BST 590, Quark Drive) — Speed **381** — in OU's top quarter (≥350); Attack 372 — above OU's median (372); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Quark Drive.
- **Lilligant-Hisui** (Grass/Fighting, BST 480, Chlorophyll/Hustle/Leaf Guard) — Attack **508** — in OU's top quarter (≥416); Speed 339 — above OU's median (322); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Hustle.
- **Sharpedo-Mega** (Water/Dark, BST 560, Strong Jaw, item forced: Sharpedonite) — Attack **416** — in OU's top quarter (≥416); Special Attack 350 — above OU's median (328); Speed 339 — above OU's median (322); setup + priority + reliable recovery; ability: Strong Jaw.
- **Azumarill** (Water/Fairy, BST 420, Thick Fat/Huge Power/Sap Sipper) — Attack **436** — in OU's top quarter (≥416); Attack reaches 436 off base 50 — an ability is doing the work; setup + priority + reliable recovery; ability: Huge Power/Sap Sipper.
- **Emboar-Mega** (Fire/Fighting, BST 628, Mold Breaker, item forced: Emboarite) — Attack **434** — in OU's top quarter (≥416); Special Attack 350 — above OU's median (328); BST 628 — above OU's median (600); setup + priority + reliable recovery.
- **Enamorus** (Fairy/Flying, BST 580, Cute Charm/Contrary) — Special Attack **405** — in OU's top quarter (≥401); Speed 342 — above OU's median (322); strong setup on a frame fast enough to use it; ability: Contrary.
- **Hawlucha** (Fighting/Flying, BST 500, Limber/Unburden/Mold Breaker) — Speed **368** — in OU's top quarter (≥350); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Unburden.
- **Haxorus** (Dragon, BST 540, Rivalry/Mold Breaker/Unnerve) — Attack **432** — in OU's top quarter (≥416); Speed 322 — above OU's median (322); setup + priority + reliable recovery; strong setup on a frame fast enough to use it.
- **Meganium-Mega** (Grass/Fairy, BST 625, Mega Sol, item forced: Meganiumite) — Special Attack **423** — in OU's top quarter (≥401); BST 625 — above OU's median (600); setup + priority + reliable recovery; reliable recovery on a bulky frame.
- **Regieleki** (Electric, BST 580, Transistor) — Speed **548** — in OU's top quarter (≥350); Special Attack 328 — above OU's median (328); setup + priority + reliable recovery; ability: Transistor.
- **Serperior** (Grass, BST 528, Overgrow/Contrary) — Speed **357** — in OU's top quarter (≥350); setup + priority + reliable recovery; strong setup on a frame fast enough to use it; ability: Contrary.
- **Thundurus** (Electric/Flying, BST 580, Prankster/Defiant) — Speed **353** — in OU's top quarter (≥350); Special Attack 383 — above OU's median (328); strong setup on a frame fast enough to use it; ability: Prankster/Defiant.
- **Thundurus-Therian** (Electric/Flying, BST 580, Volt Absorb) — Special Attack **427** — in OU's top quarter (≥401); Speed 331 — above OU's median (322); strong setup on a frame fast enough to use it; ability: Volt Absorb.
- **Weavile** (Dark/Ice, BST 510, Pressure/Pickpocket) — Speed **383** — in OU's top quarter (≥350); Attack 372 — above OU's median (372); setup + priority + reliable recovery; strong setup on a frame fast enough to use it.
- **Zoroark-Hisui** (Normal/Ghost, BST 510, Illusion) — Speed **350** — in OU's top quarter (≥350); Special Attack 383 — above OU's median (328); setup + priority + reliable recovery; strong setup on a frame fast enough to use it.
- **Chandelure-Mega** (Ghost/Fire, BST 620, Infiltrator, item forced: Chandelurite) — Special Attack **493** — in OU's top quarter (≥401); BST 620 — above OU's median (600); reliable recovery on a bulky frame.
- **Conkeldurr** (Fighting, BST 505, Guts/Sheer Force/Iron Fist) — Attack **416** — in OU's top quarter (≥416); setup + priority + reliable recovery; ability: Guts/Sheer Force.
- **Pyroar-Mega** (Fire/Normal, BST 607, Fire Mane, item forced: Pyroarite) — Speed **386** — in OU's top quarter (≥350); Special Attack 392 — above OU's median (328); BST 607 — above OU's median (600).
- **Scolipede** (Bug/Poison, BST 485, Poison Point/Swarm/Speed Boost/Quick Feet) — Speed **355** — in OU's top quarter (≥350); strong setup on a frame fast enough to use it; ability: Speed Boost/Quick Feet.
- **Scolipede-Mega** (Bug/Poison, BST 585, Shell Armor, item forced: Scolipite) — Attack **416** — in OU's top quarter (≥416); hazards + real offence; reliable recovery on a bulky frame.

### The offensive ceilings, stated separately because they are the obvious first question

**Highest engine-resolved Attack in UU**, against OU's maximum of 678:

| Entry | Atk (+nature, 252) | Base Atk | Ability doing the work |
| --- | --- | --- | --- |
| Starmie-Mega | **656** | 100 | Huge Power |
| Heracross-Mega | **515** | 185 | Skill Link |
| Lilligant-Hisui | **508** | 105 | Chlorophyll/Hustle/Leaf Guard |
| Aegislash-Blade | **438** | 150 | Stance Change |
| Swampert-Mega | **438** | 150 | Swift Swim |
| Azumarill | **436** | 50 | Thick Fat/Huge Power/Sap Sipper |
| Emboar-Mega | **434** | 148 | Mold Breaker |
| Haxorus | **432** | 147 | Rivalry/Mold Breaker/Unnerve |
| Conkeldurr | **416** | 140 | Guts/Sheer Force/Iron Fist |
| Scolipede-Mega | **416** | 140 | Shell Armor |

**Highest engine-resolved Special Attack in UU**, against OU's maximum of 493:

| Entry | SpA (+nature, 252) | Base SpA | Ability |
| --- | --- | --- | --- |
| Chandelure-Mega | **493** | 175 | Infiltrator |
| Gardevoir-Mega | **471** | 165 | Pixilate |
| Drampa-Mega | **460** | 160 | Berserk |
| Raichu-Mega-Y | **460** | 160 | No Guard |
| Delphox-Mega | **458** | 159 | Levitate |
| Blacephalon | **441** | 151 | Beast Boost |
| Aegislash-Blade | **438** | 150 | Stance Change |
| Chandelure | **427** | 145 | Flash Fire/Flame Body/Infiltrator/Shadow Tag |
| Thundurus-Therian | **427** | 145 | Volt Absorb |
| Meganium-Mega | **423** | 143 | Mega Sol |

**Highest engine-resolved Speed in UU**, against OU's maximum of 504:

| Entry | Spe (+nature, 252) | Base Spe | Ability |
| --- | --- | --- | --- |
| Regieleki | **548** | 200 | Transistor |
| Aerodactyl-Mega | **438** | 150 | Tough Claws |
| Zeraora | **423** | 143 | Volt Absorb |
| Delphox-Mega | **403** | 134 | Levitate |
| Raichu-Mega-Y | **394** | 130 | No Guard |
| Pyroar-Mega | **386** | 126 | Fire Mane |
| Weavile | **383** | 125 | Pressure/Pickpocket |
| Iron Boulder | **381** | 124 | Quark Drive |
| Alakazam | **372** | 120 | Synchronize/Inner Focus/Magic Guard |
| Starmie-Mega | **372** | 120 | Huge Power |

### Multi-hit users in UU

The 25-BP-per-hit rewrite changes what these moves are worth, and Skill Link
forces the maximum:

| Move | Type | BP × hits | UU users |
| --- | --- | --- | --- |
| Rock Blast | Rock | 25 × [2,5] | Aerodactyl-Mega, Blacephalon, Conkeldurr, Excadrill, Glimmora, Heracross-Mega, Iron Boulder, Mamoswine, Mew, Terrakion, Tyranitar |
| Bullet Seed | Grass | 25 × [2,5] | Amoonguss, Heracross-Mega, Hydrapple, Lilligant-Hisui, Meganium-Mega, Mew, Serperior, Venusaur-Mega |
| Icicle Spear | Ice | 25 × [2,5] | Mamoswine, Mew, Weavile |
| Pin Missile | Bug | 25 × [2,5] | Heracross-Mega, Mew, Scolipede, Scolipede-Mega |
| Tail Slap | Normal | 25 × [2,5] | Mew |
| Arm Thrust | Fighting | 25 × [2,5] | Emboar-Mega, Heracross-Mega |
| Fury Attack | Normal | 25 × [2,5] | Altaria-Mega, Corviknight, Heracross-Mega, Mamoswine, Skarmory, Skarmory-Mega, Staraptor-Mega |
| Fury Swipes | Normal | 25 × [2,5] | Excadrill, Mienshao, Sableye-Mega, Ursaluna, Weavile, Zeraora, Zoroark-Hisui |
| Double Hit | Normal | 50 × 2 | Hydrapple, Hydreigon, Mamoswine, Quaquaval, Scizor, Weavile |
| Dual Chop | Dragon | 50 × 2 | Bisharp, Buzzwole, Hawlucha, Haxorus, Mew, Mienshao, Scrafty-Mega, Zeraora |
| Dual Wingbeat | Flying | 50 × 2 | Aerodactyl-Mega, Altaria-Mega, Buzzwole, Clefable, Corviknight, Hawlucha, Hydreigon, Latias-Mega, Mew, Moltres, Moltres-Galar, Salamence, Scizor, Skarmory, Skarmory-Mega, Staraptor-Mega, Zapdos-Galar |
| Twineedle | Bug | 50 × 2 | Scolipede, Scolipede-Mega |
| Triple Axel | Ice | 20 × 3 | Gardevoir-Mega, Lilligant-Hisui, Mew, Mienshao, Primarina, Quaquaval, Weavile |
| Scale Shot | Dragon | 25 × [2,5] | Dragalge-Mega, Drampa-Mega, Gyarados, Haxorus, Hydreigon, Latias-Mega, Mew, Serperior, Sharpedo-Mega |

**Skill Link holders in UU: Heracross-Mega.**

---

## T. Remaining genuinely unresolved questions (Part I)

1. **No usage, ladder, win-rate, tournament or popularity data exists in RedGPT.**
   There is no metagame history for any tier. Every judgement must be mechanical.
2. **Nothing in UU has been played by a human.** The ladder was rebuilt on
   2026-08-15 and revised through eight passes since.
3. **The shared profiler quotes conditional attacks at full power, and the scope
   is the whole ladder.** `tools/lib/profiler.js` ranks a movepool by delivered
   power and never consults `moveSpecialFailure`. Measured across every rung:
   **457 quoted lines across 387 entries** — Last Resort 154, Fake Out 97,
   Belch 63, Steel Roller 46, Mirror Coat 40, Fling 37, Counter 14, Snore 5,
   Endeavor 1.
   **This packet annotates every one of them.** The five sibling packets
   (`UU_FINAL_EVIDENCE`, `RU_`, `NU_`, `PU_`, `ZU_FINAL_EVIDENCE`) do **not** —
   they were generated before this was found, so a Last Resort, Fake Out, Belch,
   Steel Roller, Mirror Coat or Fling line quoted from any of them is missing its
   condition. Fixing the shared profiler would rewrite the evidence behind five
   completed audits, which is a project decision rather than a side effect of
   this generator; it is reported, not taken.
   **The project already declares the answer and the profiler does not read
   it** — `RandomTeams.AVOID` (117 ids, 39 damaging) exists for exactly this
   question and is kept current.
   **Every damaging `AVOID` entry quoted anywhere in this packet carries an
   annotation**, checked live across both rosters rather than asserted.
4. **Conditional abilities are read at their unactivated value.** Guts, Quick
   Feet, Protosynthesis, Quark Drive, Unburden, Swift Swim, Harvest, Weak Armor
   and the rest are reported unboosted. The Orbs fire **on entry**, so for a Guts
   or Quick Feet holder the activated number is the one that matters — ask and it
   can be measured.
5. **A species may run any of its abilities.** Offence is reported per ability,
   but the movepool sections assume the first.
6. **Aegislash is profiled as two entries and plays as one.** Stance Change is
   its only ability, so the two profiles in section C are two halves of one
   Pokémon, and neither alone is what an opponent faces.
7. **The damage matrices assume no hazards and no residual chip.** The
   calculator does not model entry hazards; sections O and P carry the material
   for that separately.
8. **The 0-2 HP rounding difference from Showdown's calculator** is known and
   documented; it never changes a tier.

**If a number you need is missing, ask for it** rather than estimating. Any
damage, speed, trapping or legality question can be answered against the real
engine.

---
# Part II — Meloetta and Meloetta-Pirouette

## MEL1. The question, and what the Pirouette tier actually decides

**Meloetta is NU. Meloetta-Pirouette is RU.** One rung apart.

**Meloetta-Pirouette carries `battleOnly: "Meloetta"`, so it can never be picked.**
Verified through the real validator: selecting it directly is refused in **every**
tier format, with *"Meloetta-Pirouette is a battle-only forme. … use Meloetta
instead"*. It exists only as the result of Relic Song.

So its tier does exactly one job:

> **It decides the rung from which Relic Song is legal**, through
> `Formats.illegalFormeMoves` — the *move* half of "ban the route, not the
> Pokémon", which was built for this and has no other user on the ladder.

That makes the two questions concrete:

1. **Is RU right for Pirouette?** Move it up and Relic Song is refused in RU too,
   so an RU Meloetta plays as a special attacker with no transform. Move it down
   to NU and an NU Meloetta gets the forme.
2. **Is NU right for Meloetta itself?** Its tier decides where the *Pokémon*
   plays at all, and below RU it plays without the move.

**They are not the same question and can be answered independently.** Meloetta
could be NU with Pirouette in UU; it could be RU with Pirouette in RU.

**Why this has never been audited before:** until this session Relic Song was an
ordinary 75 BP sound move with no forme code behind it, and PROJECT_CONTEXT
recorded Pirouette as *packaged-but-dead* — *"there is no route into it"*. The
NU pass gave it RU as **roster bookkeeping** and a control was added to stop
anybody retiering it on that basis. That control has served its purpose; this is
the first time the forme can actually be reached.

---

## MEL2. The route, walked in a real battle

Not read off the data — played. Level 100, no EVs, max IVs, neutral nature, so the
numbers are directly comparable row to row.

| Point in the battle | Forme | Typing | HP | Atk | Def | SpA | SpD | Spe |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| on entry | Meloetta | Normal/Psychic | 341 | 190 | 190 | 292 | 292 | 216 |
| after Relic Song #1 | Meloetta-Pirouette | Normal/Fighting | 341 | 292 | 216 | 190 | 190 | 292 |
| after Relic Song #2 | Meloetta | Normal/Psychic | 341 | 190 | 190 | 292 | 292 | 216 |
| after Relic Song #3 | Meloetta-Pirouette | Normal/Fighting | 341 | 292 | 216 | 190 | 190 | 292 |
| after switching out and back in | Meloetta | Normal/Psychic | 341 | 190 | 190 | 292 | 292 | 216 |

**Four properties, each measured rather than assumed:**

- **It transforms on use.** Normal/Psychic → **Normal/Fighting**, and the stat
  line does **not** simply mirror. Attack and Special Attack **swap**
  (190 ↔ 292). The other three **rotate**: Defence takes Speed's old
  value (190 → 216), Speed takes Special Defence's (216 → 292),
  and Special Defence takes Defence's (292 → 190). Reading it as a
  Defence/Special-Defence swap gets Pirouette's bulk wrong in both directions.
- **It toggles.** A second Relic Song returns it to Aria forme; a third
  transforms it again.
- **It reverts on switch-out.** The bench slot read **Meloetta** the moment it
  left the field, and it came back in Aria forme. **This is a per-appearance
  state, not a Battle-Bond-style permanent upgrade** — every time it switches in
  it must spend a turn again.
- **HP does not change.** 341 in both formes, so the two are equally
  easy to bring into range.

**The base stat lines:**

| | Types | HP | Atk | Def | SpA | SpD | Spe | BST |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Meloetta | Normal/Psychic | 100 | 77 | 77 | 128 | 128 | 90 | 600 |
| Meloetta-Pirouette | Normal/Fighting | 100 | 128 | 90 | 77 | 77 | 128 | 600 |

**BST is identical at 600.** This is a redistribution, not an upgrade — which is
why the tiering question is genuinely open rather than obvious.

---

## MEL3. Relic Song itself

| Property | Value |
| --- | --- |
| Type / category | Normal / Special |
| Base power | **75** |
| Accuracy | 100% |
| PP (battle maximum, PP-Upped) | 16 (base 10) |
| Secondary | 10% **sleep** |
| Flags | protect, mirror, sound, bypasssub |

**Two consequences of those flags, both measured.**

### Serene Grace is Meloetta's only ability, and it doubles the sleep chance

300 single-turn battles on fixed seeds, Relic Song into a Blissey:

| Meloetta's ability | Target asleep after one Relic Song |
| --- | --- |
| **Serene Grace** (its real and only ability) | **54 / 300** (18.0%) |
| Pressure (control — no secondary-rate hook) | 28 / 300 (9.3%) |

The packaged secondary is **10%**, so the control row is the packaged rate and
the Serene Grace row is double it. **The move that performs the transformation is
also a 20% sleep chance**, and Sleep Clause is on in every tier format —
so it is one sleeper per battle, not a lock.

### It is a sound move, so it goes through a Substitute

Blissey establishes a Substitute on turn one; Meloetta attacks on turn two.

| Move | Sound? | Substitute up when it landed | HP the **Pokémon** lost | Substitute afterwards |
| --- | --- | --- | --- | --- |
| Relic Song | yes | yes | **86** | 162 HP, still standing |
| Hyper Voice | yes | yes | **102** | 162 HP, still standing |
| Psychic | **no** | yes | **0** | 60 HP, still standing |

**Psychic is the control** and it is the row that proves the others. The
Substitute is worth 162 HP when it goes up. Relic Song and Hyper Voice leave it
at **162 — untouched** and take 86 and 102 off the Pokémon behind it;
Psychic, which is not a sound move, deals **0** to the Pokémon and knocks the
doll from 162 to 60 instead. Relic Song **also still transforms** while
doing it, so the forme change is not conditional on the target being hit.

---

## MEL4. Both formes profiled in full

Conditional attacks are annotated. **Note that both profiles are drawn from the
same 106-move legal pool** — Pirouette is a battle-only forme with no
learnset of its own, so the two differ in *stats and typing only*.

### Meloetta (Aria) — NU

**Meloetta** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Normal/Psychic | BST 600 (100/77/77/128/128/90) | Abilities: Serene Grace
  Engine stats @252 (neutral/positive): Serene Grace: Atk 253/278, SpA 355/390, Spe 279/306
  Item: **free**
  STAB: Normal Hyper Voice 90S · Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Fairy Play Rough 90P, Fire Fire Punch 75P
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

### Meloetta-Pirouette — RU

**Meloetta-Pirouette** — species, **RU**, source: override
  Normal/Fighting | BST 600 (100/128/90/77/77/128) | Abilities: Serene Grace
  Engine stats @252 (neutral/positive): Serene Grace: Atk 355/390, SpA 253/278, Spe 355/390
  Item: **free**
  STAB: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]** · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Fairy Play Rough 90P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Grass Energy Ball 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S
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

**The single most important line above**: Pirouette's Normal STAB is quoted as
**Last Resort 140**, and Last Resort **fails until every other move in the set has
been used**. Measured: leading with it deals **0** damage. Its real Normal
STAB options are what remain after that — see the coverage rows.

---

## MEL5. What the route costs

A Pirouette set is not a Meloetta set with better stats. Four costs, all
structural:

1. **A permanent move slot.** Relic Song is the only route, so it occupies one of
   four slots for the whole battle. A Pirouette effectively runs **three**
   attacking or utility moves.
2. **A turn, on every appearance.** It reverts on switch-out (section MEL2), so
   every entry costs a turn to re-transform. Relic Song does deal its 75 BP
   while doing so, which is not nothing — but off the **wrong stat**.
3. **The transform runs off the stat it is giving up.** Relic Song is
   **Special**, and the moment it resolves Special Attack drops from 292 to
   190. So the move is cast at Aria's SpA and everything after it at
   Pirouette's Attack.
4. **Special Defence collapses.** 292 → 190, a fall of
   102 points, in exchange for 26 points of Defence and
   76 of Speed. **Pirouette is markedly easier to kill specially.**

**Against that, what it buys:** Attack 190 → 292
(+102), Speed 216 → 292
(+76), and a Fighting STAB on a Pokémon that otherwise
attacks off Normal and Psychic.

**Item freedom is total for both formes** — neither is a forme *item* holder, so
Choice Band, Choice Scarf, Life Orb, Leftovers, Assault Vest, Heavy-Duty Boots and
a Ring Target are all available. Note a **Choice item locks it out of the
transform** once it has attacked, and a **Choice Scarf on the Aria forme reaches
324 Speed against Pirouette's un-Scarfed 292**, which is a real
alternative to transforming at all.

---

## MEL6. Damage matrices

**Pirouette**, jolly {"atk":252,"spe":252,"hp":4}, Life Orb — a **representative test set** built
from unconditional moves only.

### Against an RU defensive core — the rung Pirouette's tier names

| RU defender (representative test set) | Close Combat | Knock Off | Zen Headbutt | Play Rough |
| --- | --- | --- | --- | --- |
| Porygon2 (specWall, Eviolite) | 371-438 (99.2-117.1%) | 100-118 (26.7-31.6%) | 83-97 (22.2-25.9%) | 93-109 (24.9-29.1%) |
| Gastrodon (specWall, Leftovers) | 347-409 (81.5-96%) | 187-221 (43.9-51.9%) | 154-182 (36.2-42.7%) | 174-205 (40.8-48.1%) |
| Registeel (physWall, Leftovers) | 276-326 (75.8-89.6%) | 74-88 (20.3-24.2%) | 29-36 (8-9.9%) | 33-40 (9.1-11%) |
| Umbreon (specWall, Leftovers) | 469-552 (119-140.1%) | 62-74 (15.7-18.8%) | 0-0 (0-0%) | 235-276 (59.6-70.1%) |
| Duraludon (physWall, Leftovers) | 334-393 (97.1-114.2%) | 89-106 (25.9-30.8%) | 36-44 (10.5-12.8%) | 83-98 (24.1-28.5%) |
| Reuniclus (specWall, Leftovers) | 159-188 (37.5-44.3%) | 347-409 (81.8-96.5%) | 71-84 (16.7-19.8%) | 161-189 (38-44.6%) |
| Magnezone (specWall, Leftovers) | 452-531 (131.4-154.4%) | 122-143 (35.5-41.6%) | 49-58 (14.2-16.9%) | 55-66 (16-19.2%) |
| Steelix-Mega (physWall, no item) | 198-234 (55.9-66.1%) | 53-63 (15-17.8%) | 22-26 (6.2-7.3%) | 24-28 (6.8-7.9%) |
| Weezing-Galar (physWall, Leftovers) | 40-46 (12-13.8%) | 42-50 (12.6-15%) | 145-171 (43.4-51.2%) | 40-48 (12-14.4%) |
| Cobalion (physWall, Leftovers) | 308-362 (79.8-93.8%) | 41-48 (10.6-12.4%) | 68-80 (17.6-20.7%) | 76-91 (19.7-23.6%) |
| Aggron-Mega (physWall, no item) | 148-175 (43-50.9%) | 53-63 (15.4-18.3%) | 22-26 (6.4-7.6%) | 24-28 (7-8.1%) |
| Celebi (specWall, Leftovers) | 126-149 (31.2-36.9%) | 274-323 (67.8-80%) | 55-66 (13.6-16.3%) | 127-149 (31.4-36.9%) |

### Against an NU defensive core — the rung the gate currently protects

| NU defender (representative test set) | Close Combat | Knock Off | Zen Headbutt | Play Rough |
| --- | --- | --- | --- | --- |
| Vaporeon (specWall, Leftovers) | 383-451 (82.5-97.2%) | 206-243 (44.4-52.4%) | 170-200 (36.6-43.1%) | 191-226 (41.2-48.7%) |
| Avalugg (physWall, Leftovers) | 236-279 (59.9-70.8%) | 63-75 (16-19%) | 53-62 (13.5-15.7%) | 59-70 (15-17.8%) |
| Aggron (physWall, Leftovers) | 343-343 (99.7-99.7%) | 65-76 (18.9-22.1%) | 26-31 (7.6-9%) | 29-35 (8.4-10.2%) |
| Sylveon (specWall, Leftovers) | 179-211 (45.4-53.6%) | 96-114 (24.4-28.9%) | 159-188 (40.4-47.7%) | 180-211 (45.7-53.6%) |
| Stakataka (physWall, Leftovers) | 426-501 (130.7-153.7%) | 57-67 (17.5-20.6%) | 23-27 (7.1-8.3%) | 26-31 (8-9.5%) |
| Guzzlord (specWall, Leftovers) | 841-990 (129.4-152.3%) | 113-132 (17.4-20.3%) | 0-0 (0-0%) | 843-993 (129.7-152.8%) |
| Incineroar (physWall, Leftovers) | 393-462 (99.7-117.3%) | 53-62 (13.5-15.7%) | 0-0 (0-0%) | 98-115 (24.9-29.2%) |
| Araquanid (specWall, Leftovers) | 135-159 (39.7-46.8%) | 146-172 (42.9-50.6%) | 120-143 (35.3-42.1%) | 136-159 (40-46.8%) |
| Hariyama (specWall, Leftovers) | 383-451 (77.8-91.7%) | 102-120 (20.7-24.4%) | 341-401 (69.3-81.5%) | 383-452 (77.8-91.9%) |
| Espeon (specWall, Leftovers) | 191-224 (57.2-67.1%) | 413-486 (123.7-145.5%) | 84-100 (25.1-29.9%) | 191-226 (57.2-67.7%) |

### Against a UU defensive core — the rung above

| UU defender (representative test set) | Close Combat | Knock Off | Zen Headbutt | Play Rough |
| --- | --- | --- | --- | --- |
| Blissey (specWall, Leftovers) | 2124-2499 (297.5-350%) | 572-673 (80.1-94.3%) | 471-556 (66-77.9%) | 531-625 (74.4-87.5%) |
| Chansey (specWall, Eviolite) | 1725-2029 (245-288.2%) | 465-547 (66.1-77.7%) | 383-451 (54.4-64.1%) | 431-507 (61.2-72%) |
| Clefable (specWall, Leftovers) | 163-192 (41.4-48.7%) | 88-104 (22.3-26.4%) | 146-172 (37.1-43.7%) | 165-193 (41.9-49%) |
| Slowbro (physWall, Leftovers) | 85-101 (21.6-25.6%) | 185-219 (47-55.6%) | 37-45 (9.4-11.4%) | 85-101 (21.6-25.6%) |
| Slowbro-Mega (physWall, no item) | 59-70 (15-17.8%) | 130-153 (33-38.8%) | 26-31 (6.6-7.9%) | 59-71 (15-18%) |
| Slowking (specWall, Leftovers) | 152-179 (38.6-45.4%) | 330-388 (83.8-98.5%) | 67-79 (17-20.1%) | 153-179 (38.8-45.4%) |
| Skarmory (physWall, Leftovers) | 145-171 (43.4-51.2%) | 78-92 (23.4-27.5%) | 32-37 (9.6-11.1%) | 36-42 (10.8-12.6%) |
| Skarmory-Mega (physWall, no item) | 171-202 (51.2-60.5%) | 92-109 (27.5-32.6%) | 37-45 (11.1-13.5%) | 42-50 (12.6-15%) |
| Celesteela (physWall, Leftovers) | 179-211 (45-53%) | 97-114 (24.4-28.6%) | 40-46 (10.1-11.6%) | 44-53 (11.1-13.3%) |
| Hippowdon (physWall, Leftovers) | 163-192 (38.8-45.7%) | 88-104 (21-24.8%) | 72-85 (17.1-20.2%) | 81-96 (19.3-22.9%) |
| Amoonguss (specWall, Black Sludge) | 169-198 (39.1-45.8%) | 183-215 (42.4-49.8%) | 302-357 (69.9-82.6%) | 84-100 (19.4-23.1%) |
| Goodra-Hisui (specWall, Leftovers) | 508-598 (139.6-164.3%) | 136-161 (37.4-44.2%) | 55-66 (15.1-18.1%) | 127-149 (34.9-40.9%) |

### And Meloetta (Aria) for comparison, timid {"spa":252,"spe":252,"hp":4}, Life Orb

**Against RU:**

| RU defender (representative test set) | Hyper Voice | Psychic | Focus Blast | Shadow Ball |
| --- | --- | --- | --- | --- |
| Porygon2 (specWall, Eviolite) | 96-113 (25.7-30.2%) | 96-113 (25.7-30.2%) | 170-200 (45.5-53.5%) | 0-0 (0-0%) |
| Gastrodon (specWall, Leftovers) | 156-184 (36.6-43.2%) | 156-184 (36.6-43.2%) | 137-162 (32.2-38%) | 92-109 (21.6-25.6%) |
| Registeel (physWall, Leftovers) | 67-79 (18.4-21.7%) | 67-79 (18.4-21.7%) | 239-282 (65.7-77.5%) | 80-94 (22-25.8%) |
| Umbreon (specWall, Leftovers) | 115-136 (29.2-34.5%) | 0-0 (0-0%) | 204-240 (51.8-60.9%) | 33-40 (8.4-10.2%) |
| Duraludon (physWall, Leftovers) | 165-193 (48-56.1%) | 165-193 (48-56.1%) | 585-689 (170.1-200.3%) | 195-230 (56.7-66.9%) |
| Reuniclus (specWall, Leftovers) | 153-180 (36.1-42.5%) | 76-89 (17.9-21%) | 67-79 (15.8-18.6%) | 182-214 (42.9-50.5%) |
| Magnezone (specWall, Leftovers) | 74-87 (21.5-25.3%) | 74-87 (21.5-25.3%) | 262-308 (76.2-89.5%) | 87-102 (25.3-29.7%) |
| Steelix-Mega (physWall, no item) | 98-117 (27.7-33.1%) | 98-117 (27.7-33.1%) | 353-416 (99.7-117.5%) | 118-139 (33.3-39.3%) |
| Weezing-Galar (physWall, Leftovers) | 254-300 (76-89.8%) | 510-601 (152.7-179.9%) | 55-66 (16.5-19.8%) | 150-178 (44.9-53.3%) |
| Cobalion (physWall, Leftovers) | 124-146 (32.1-37.8%) | 249-293 (64.5-75.9%) | 443-521 (114.8-135%) | 148-174 (38.3-45.1%) |
| Aggron-Mega (physWall, no item) | 114-135 (33.1-39.2%) | 114-135 (33.1-39.2%) | 304-359 (88.4-104.4%) | 136-159 (39.5-46.2%) |
| Celebi (specWall, Leftovers) | 137-162 (33.9-40.1%) | 68-80 (16.8-19.8%) | 61-71 (15.1-17.6%) | 165-193 (40.8-47.8%) |

**Against NU** — this is what an NU Meloetta actually does, since Relic Song is
refused there:

| NU defender (representative test set) | Hyper Voice | Psychic | Focus Blast | Shadow Ball |
| --- | --- | --- | --- | --- |
| Vaporeon (specWall, Leftovers) | 143-167 (30.8-36%) | 143-167 (30.8-36%) | 126-148 (27.2-31.9%) | 84-100 (18.1-21.6%) |
| Avalugg (physWall, Leftovers) | 349-412 (88.6-104.6%) | 349-412 (88.6-104.6%) | 621-731 (157.6-185.5%) | 208-244 (52.8-61.9%) |
| Aggron (physWall, Leftovers) | 71-84 (20.6-24.4%) | 143-169 (41.6-49.1%) | 343-343 (99.7-99.7%) | 170-200 (49.4-58.1%) |
| Sylveon (specWall, Leftovers) | 115-136 (29.2-34.5%) | 115-136 (29.2-34.5%) | 50-59 (12.7-15%) | 68-80 (17.3-20.3%) |
| Stakataka (physWall, Leftovers) | 46-55 (14.1-16.9%) | 94-111 (28.8-34%) | 673-791 (206.4-242.6%) | 111-132 (34-40.5%) |
| Guzzlord (specWall, Leftovers) | 200-235 (30.8-36.2%) | 0-0 (0-0%) | 354-418 (54.5-64.3%) | 58-70 (8.9-10.8%) |
| Incineroar (physWall, Leftovers) | 208-245 (52.8-62.2%) | 0-0 (0-0%) | 370-435 (93.9-110.4%) | 61-72 (15.5-18.3%) |
| Araquanid (specWall, Leftovers) | 114-133 (33.5-39.1%) | 114-133 (33.5-39.1%) | 49-58 (14.4-17.1%) | 67-79 (19.7-23.2%) |
| Hariyama (specWall, Leftovers) | 188-221 (38.2-44.9%) | 377-443 (76.6-90%) | 166-196 (33.7-39.8%) | 111-131 (22.6-26.6%) |
| Espeon (specWall, Leftovers) | 143-167 (42.8-50%) | 71-83 (21.3-24.9%) | 62-74 (18.6-22.2%) | 170-200 (50.9-59.9%) |

**The comparison that matters** is not Aria against Pirouette in the abstract —
it is *"does the team that spent a slot and a turn on Relic Song get more than
the team that spent neither"*, which the two sets of rows above answer column by
column.

---

## MEL7. Speed placement

Pirouette's engine-resolved Speed at max investment is
**390**; Aria's is **306**.

| Rung | Entries at base Speed 80+ | Median max +Spe | Fastest | Pirouette would rank |
| --- | --- | --- | --- | --- |
| UU | 56 | 298 | 548 | **6 of 91** |
| RU | 70 | 284 | 441 | **7 of 131** |
| NU | 31 | 273 | 394 | **2 of 67** |

**The RU speed tier, base 80+:**

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

**The NU speed tier, base 80+:**

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

---

## MEL8. The comparison bars

**Carried in full, not pointed at.** The rung Pirouette's tier names is **RU**,
the rung the gate protects is **NU**, and the rung above is **UU** — whose 91
entries are already profiled in **Part I section C** and are not repeated here.
RU and NU are below, in the same compact form Part I section D uses for OU.

### The RU roster — 131 entries, the rung Meloetta-Pirouette is tiered into

**Absol-Mega** — forme, **RU**, source: imported (natdex)
  Dark | BST 565 (65/150/60/115/60/115) | Abilities: Magic Bounce
  Engine stats @252 (neutral/positive): Magic Bounce: Atk 399/438, SpA 329/361, Spe 329/361
  Item: **forced — Absolite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Dark Foul Play 95P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Fairy Play Rough 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Normal Razor Wind 80 (charge)S **[power — two-turn — it charges first (the profiler tags it `(charge)`)]**

**Absol-Mega-Z** — forme, **RU**, source: **estimated** _(its own `species.tier` reads PU; the enforced tier is the one shown)_
  Dark/Ghost | BST 565 (65/154/60/75/60/151) | Abilities: Sharpness
  Engine stats @252 (neutral/positive): Sharpness: Atk 407/447, SpA 249/273, Spe 401/441
  Item: **forced — Absolite Z** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Dark Foul Play 95P · Ghost Shadow Claw 70P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Bug Megahorn 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Fairy Play Rough 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Psychic Future Sight 120S, Electric Thunder 120S, Normal Razor Wind 80 (charge)S **[power — two-turn — it charges first (the profiler tags it `(charge)`)]**, Flying Air Slash 75S

**Aggron-Mega** — forme, **RU**, source: imported (natdex)
  Steel | BST 630 (70/140/230/60/80/50) | Abilities: Filter
  Engine stats @252 (neutral/positive): Filter: Atk 379/416, SpA 219/240, Spe 199/218
  Item: **forced — Aggronite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Steel Steel Roller 130P **[conditional — fails with no terrain up]**
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Rock Head Smash 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S

**Ampharos-Mega** — forme, **RU**, source: imported (natdex)
  Electric/Dragon | BST 610 (90/95/105/165/110/45) | Abilities: Mold Breaker
  Engine stats @252 (neutral/positive): Mold Breaker: Atk 289/317, SpA 429/471, Spe 189/207
  Item: **forced — Ampharosite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Electric Thunder 120S · Dragon Dragon Pulse 90S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Rock Meteor Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Bug Signal Beam 75S

**Arcanine-Hisui** — species, **RU**, source: imported (natdex)
  Fire/Rock | BST 555 (95/115/80/95/80/90) | Abilities: Intimidate / Flash Fire / Rock Head
  Engine stats @252 (neutral/positive): Intimidate: Atk 329/361, SpA 289/317, Spe 279/306 — Flash Fire: Atk 329/361, SpA 289/317, Spe 279/306 — Rock Head: Atk 329/361, SpA 289/317, Spe 279/306
  Item: **free**
  STAB: Fire Overheat 140S · Rock Head Smash 150P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Fighting Close Combat 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P
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
  Physical coverage: Normal Take Down 90P, Ghost Astonish 30P, Dark Fling 30P **[conditional — fails with no removable item, and consumes it]**
  Special coverage: Fighting Focus Blast 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S

**Azelf** — species, **RU**, source: imported (natdex)
  Psychic | BST 580 (75/125/70/125/70/115) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 349/383, SpA 349/383, Spe 329/361
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Flying Acrobatics 110P, Steel Iron Tail 100P, Fairy Play Rough 90P, Fighting Drain Punch 75P, Fire Fire Punch 75P
  Special coverage: Fire Fire Blast 120S, Electric Thunder 120S, Grass Energy Ball 90S, Normal Uproar 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S

**Banette-Mega** — forme, **RU**, source: imported (natdex)
  Ghost | BST 555 (64/165/75/93/83/75) | Abilities: Prankster
  Engine stats @252 (neutral/positive): Prankster: Atk 429/471, SpA 285/313, Spe 249/273
  Item: **forced — Banettite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Dark Foul Play 95P, Bug Skitter Smack 70P, Grass Trailblaze 50P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Dark Dark Pulse 80S, Fairy Dazzling Gleam 80S, Normal Tera Blast 80S, Fire Burning Jealousy 70S

**Barbaracle** — species, **RU**, source: imported (natdex)
  Rock/Water | BST 500 (72/105/115/54/86/68) | Abilities: Tough Claws / Sniper / Pickpocket
  Engine stats @252 (neutral/positive): Tough Claws: Atk 309/339, SpA 207/227, Spe 235/258 — Sniper: Atk 309/339, SpA 207/227, Spe 235/258 — Pickpocket: Atk 309/339, SpA 207/227, Spe 235/258
  Item: **free** — but its own Barbaracite is **refused in RU** (it would make Barbaracle-Mega, OU)
  STAB: Rock Stone Edge 100P · Water Liquidation 85P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Fighting Superpower 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Poison Poison Jab 80P, Bug X-Scissor 80P
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
  Item: **forced — Beedrillite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Bug Twineedle 50x2P · Poison Poison Jab 80P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Dragon Outrage 120P, Ground Drill Run 80P, Dark Throat Chop 80P, Fighting Brick Break 75P, Flying Aerial Ace 60P
  Special coverage: Grass Solar Beam 120 (charge)S, Flying Air Cutter 60S, Normal Hidden Power 60S, Ghost Ominous Wind 60S, Electric Electroweb 55S

**Bewear** — species, **RU**, source: imported (natdex)
  Normal/Fighting | BST 500 (120/125/80/55/60/60) | Abilities: Fluffy / Klutz / Unnerve
  Engine stats @252 (neutral/positive): Fluffy: Atk 349/383, SpA 209/229, Spe 219/240 — Klutz: Atk 349/383, SpA 209/229, Spe 219/240 — Unnerve: Atk 349/383, SpA 209/229, Spe 219/240
  Item: **free**
  STAB: Normal Double-Edge 120P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Dragon Dual Chop 50x2P, Ground Earthquake 100P, Dark Darkest Lariat 85P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Ice Ice Punch 75P
  Special coverage: **none**

**Blastoise** — species, **RU**, source: imported (natdex)
  Water | BST 530 (79/83/100/85/105/78) | Abilities: Torrent / Rain Dish
  Engine stats @252 (neutral/positive): Torrent: Atk 265/291, SpA 269/295, Spe 255/280 — Rain Dish: Atk 265/291, SpA 269/295, Spe 255/280
  Item: **free** — but its own Blastoisinite is **refused in RU** (it would make Blastoise-Mega, OU)
  STAB: Water Water Spout 150S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Steel Flash Cannon 80S, Normal Tera Blast 80S

**Breloom** — species, **RU**, source: imported (natdex)
  Grass/Fighting | BST 460 (60/130/80/60/60/70) | Abilities: Effect Spore / Poison Heal / Technician
  Engine stats @252 (neutral/positive): Effect Spore: Atk 359/394, SpA 219/240, Spe 239/262 — Poison Heal: Atk 359/394, SpA 219/240, Spe 239/262 — Technician: Atk 359/394, SpA 219/240, Spe 239/262
  Item: **free**
  STAB: Grass Seed Bomb 80P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Psychic Zen Headbutt 80P
  Special coverage: Poison Sludge Bomb 90S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Camerupt-Mega** — forme, **RU**, source: imported (natdex)
  Fire/Ground | BST 560 (70/120/100/145/105/20) | Abilities: Sheer Force
  Engine stats @252 (neutral/positive): Sheer Force: Atk 339/372, SpA 389/427, Spe 139/152
  Item: **forced — Cameruptite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Fire Eruption 150S · Ground Earthquake 100P
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Steel Heavy Slam 120P, Rock Stone Edge 100P, Fighting Body Press 80P, Psychic Zen Headbutt 80P, Dark Lash Out 75P
  Special coverage: Grass Solar Beam 120 (charge)S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Rock Ancient Power 60S

**Celebi** — species, **RU**, source: imported (natdex)
  Psychic/Grass | BST 600 (100/100/100/100/100/100) | Abilities: Natural Cure
  Engine stats @252 (neutral/positive): Natural Cure: Atk 299/328, SpA 299/328, Spe 299/328
  Item: **free**
  STAB: Psychic Future Sight 120S · Grass Leaf Storm 140S
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Flying Dual Wingbeat 50x2P, Dark Sucker Punch 80P, Bug U-turn 70P
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
  Item: **free** — but its own Chesnaughtite is **refused in RU** (it would make Chesnaught-Mega, OU)
  STAB: Grass Leaf Storm 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Normal Double-Edge 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Dark Crunch 80P
  Special coverage: Poison Sludge Bomb 90S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Chimecho-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU; the enforced tier is the one shown)_
  Psychic/Steel | BST 555 (75/50/110/135/120/65) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 199/218, SpA 369/405, Spe 229/251
  Item: **forced — Chimechite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Dark Knock Off 65P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Grass Energy Ball 90S, Normal Hyper Voice 90S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Electric Shock Wave 60S

**Cloyster** — species, **RU**, source: imported (natdex)
  Water/Ice | BST 525 (50/95/180/85/45/70) | Abilities: Shell Armor / Skill Link / Overcoat
  Engine stats @252 (neutral/positive): Shell Armor: Atk 289/317, SpA 269/295, Spe 239/262 — Skill Link: Atk 289/317, SpA 269/295, Spe 239/262 — Overcoat: Atk 289/317, SpA 269/295, Spe 239/262
  Item: **free**
  STAB: Water Hydro Pump 120S · Ice Blizzard 120S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Steel Steel Roller 130P **[conditional — fails with no terrain up]**, Bug Twineedle 50x2P, Ground Drill Run 80P, Poison Poison Jab 80P, Rock Rock Blast 25x2-5P
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
  STAB: Steel Steel Roller 130P **[conditional — fails with no terrain up]**
  Physical coverage: Normal Double-Edge 120P, Fire Heat Crash 120P, Dragon Outrage 120P, Grass Power Whip 120P, Fighting Superpower 120P, Ground Earthquake 100P
  Special coverage: Poison Belch 120S **[conditional — fails until the user has eaten a Berry]**, Ground Earth Power 90S, Normal Tera Blast 80S, Dark Snarl 55S

**Crabominable-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU; the enforced tier is the one shown)_
  Fighting/Ice | BST 578 (97/157/122/62/107/33) | Abilities: Iron Fist
  Engine stats @252 (neutral/positive): Iron Fist: Atk 413/454, SpA 223/245, Spe 165/181
  Item: **forced — Crabominite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Ice Ice Hammer 100P
  Physical coverage: Poison Gunk Shot 120P, Normal Return 102P, Water Crabhammer 100P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Steel Hard Press 100P
  Special coverage: Water Scald 80S, Normal Tera Blast 80S, Ground Mud Shot 55S

**Crawdaunt** — species, **RU**, source: imported (natdex)
  Water/Dark | BST 468 (63/120/85/90/55/55) | Abilities: Hyper Cutter / Shell Armor / Adaptability
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 339/372, SpA 279/306, Spe 209/229 — Shell Armor: Atk 339/372, SpA 279/306, Spe 209/229 — Adaptability: Atk 339/372, SpA 279/306, Spe 209/229
  Item: **free**
  STAB: Water Hydro Pump 120S · Dark Crunch 80P
  Physical coverage: Fighting Close Combat 120P, Normal Double-Edge 120P, Steel Hard Press 100P, Ground Dig 100 (charge)P, Bug X-Scissor 80P, Rock Rock Slide 75P
  Special coverage: Normal Trump Card 200S **[power — power rises as its PP falls; quoted at full PP]**, Ice Blizzard 120S, Poison Sludge Wave 95S, Rock Ancient Power 60S, Ground Mud Shot 55S

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
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Mega Kick 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Steel Iron Head 80P, Psychic Zen Headbutt 80P
  Special coverage: Fighting Focus Blast 120S, Psychic Future Sight 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S

**Darmanitan-Zen** — forme, **RU**, source: imported (natdex)
  Fire/Psychic | BST 540 (105/30/105/140/105/55) | Abilities: Zen Mode
  Engine stats @252 (neutral/positive): Zen Mode: Atk 379/416, SpA 159/174, Spe 289/317
  Item: **forced — —** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Fire Flare Blitz 120P · Psychic Zen Headbutt 80P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Mega Kick 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Steel Iron Head 80P, Dark Lash Out 75P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S

**Deoxys-Defense** — species, **RU**, source: imported (natdex)
  Psychic | BST 600 (50/70/160/70/160/90) | Abilities: Pressure
  Engine stats @252 (neutral/positive): Pressure: Atk 239/262, SpA 239/262, Spe 279/306
  Item: **free**
  STAB: Psychic Psycho Boost 140S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Steel Meteor Mash 100P, Poison Poison Jab 80P, Dark Throat Chop 80P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Dark Dark Pulse 80S

**Diancie** — species, **RU**, source: imported (natdex)
  Rock/Fairy | BST 600 (50/100/150/100/150/50) | Abilities: Clear Body
  Engine stats @252 (neutral/positive): Clear Body: Atk 299/328, SpA 299/328, Spe 199/218
  Item: **free** — but its own Diancite is **refused in RU** (it would make Diancie-Mega, OU)
  STAB: Rock Meteor Beam 120 (charge)S · Fairy Misty Explosion 100S **[power — the user **faints**]**
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Fighting Body Press 80P, Ground Bulldoze 60P, Steel Gyro Ball 27P
  Special coverage: Ground Earth Power 90S, Psychic Psychic 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Fire Mystical Fire 75S

**Diggersby** — species, **RU**, source: imported (natdex)
  Normal/Ground | BST 423 (85/56/77/50/77/78) | Abilities: Pickup / Cheek Pouch / Huge Power
  Engine stats @252 (neutral/positive): Pickup: Atk 211/232, SpA 199/218, Spe 255/280 — Cheek Pouch: Atk 211/232, SpA 199/218, Spe 255/280 — Huge Power: Atk 422/464, SpA 199/218, Spe 255/280
  Item: **free**
  STAB: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]** · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Poison Gunk Shot 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Dark Foul Play 95P, Electric Wild Charge 90P
  Special coverage: Water Surf 95S, Poison Sludge Bomb 90S, Grass Grass Knot 60S

**Donphan** — species, **RU**, source: imported (natdex)
  Ground | BST 500 (90/120/120/60/60/50) | Abilities: Sturdy / Sand Veil
  Engine stats @252 (neutral/positive): Sturdy: Atk 339/372, SpA 219/240, Spe 199/218 — Sand Veil: Atk 339/372, SpA 219/240, Spe 199/218
  Item: **free**
  STAB: Ground Earthquake 100P
  Physical coverage: Rock Head Smash 150P, Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Poison Gunk Shot 120P, Fighting Superpower 120P, Steel Iron Tail 100P, Fairy Play Rough 90P
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
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Psychic Mirror Coat fixedS **[conditional — needs a **special** hit taken from that target this turn]**

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
  Item: **forced — Eelektrossite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Electric Thunder 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Dragon Outrage 120P, Normal Thrash 120P, Steel Iron Tail 100P, Water Aqua Tail 90P, Flying Bounce 85 (charge)P
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
  STAB: Fairy Misty Explosion 100S **[power — the user **faints**]** · Flying Fly 90 (charge)P
  Physical coverage: Dragon Outrage 120P, Fighting Superpower 120P, Normal Take Down 90P, Steel Iron Head 80P, Psychic Zen Headbutt 80P, Ghost Astonish 30P
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Psychic Psychic 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Fire Mystical Fire 75S

**Entei** — species, **RU**, source: imported (natdex)
  Fire | BST 580 (115/115/85/90/75/100) | Abilities: Pressure / Inner Focus / Flash Fire
  Engine stats @252 (neutral/positive): Pressure: Atk 329/361, SpA 279/306, Spe 299/328 — Inner Focus: Atk 329/361, SpA 279/306, Spe 299/328 — Flash Fire: Atk 329/361, SpA 279/306, Spe 299/328
  Item: **free**
  STAB: Fire Eruption 150S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Dark Crunch 80P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Extrasensory 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ground Scorching Sands 70S, Dark Snarl 55S

**Falinks-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU; the enforced tier is the one shown)_
  Fighting | BST 570 (65/135/135/70/65/100) | Abilities: Defiant
  Engine stats @252 (neutral/positive): Defiant: Atk 369/405, SpA 239/262, Spe 299/328
  Item: **forced — Falinksite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Fighting Close Combat 120P
  Physical coverage: Bug Megahorn 120P, Ground High Horsepower 95P, Normal Take Down 90P, Steel Iron Head 80P, Poison Poison Jab 80P, Dark Throat Chop 80P
  Special coverage: Normal Uproar 90S

**Feraligatr** — species, **RU**, source: imported (natdex)
  Water | BST 530 (85/105/100/79/83/78) | Abilities: Torrent / Sheer Force
  Engine stats @252 (neutral/positive): Torrent: Atk 309/339, SpA 257/282, Spe 255/280 — Sheer Force: Atk 309/339, SpA 257/282, Spe 255/280
  Item: **free** — but its own Feraligite is **refused in RU** (it would make Feraligatr-Mega, OU)
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P
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
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Ground Earthquake 100P, Rock Stone Edge 100P, Fighting Body Press 80P, Ice Ice Spinner 80P, Poison Poison Jab 80P
  Special coverage: Electric Zap Cannon 120S, Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Normal Tera Blast 80S, Poison Venoshock 65S

**Froslass-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU; the enforced tier is the one shown)_
  Ice/Ghost | BST 580 (70/80/70/140/100/120) | Abilities: Snow Warning
  Engine stats @252 (neutral/positive): Snow Warning: Atk 259/284, SpA 379/416, Spe 339/372
  Item: **forced — Froslassite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Ice Blizzard 120S · Ghost Shadow Ball 80S
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Fighting Wake-Up Slap 70P, Grass Trailblaze 50P, Rock Rollout 30P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Normal Tera Blast 80S, Bug Signal Beam 75S, Water Water Pulse 60S, Fairy Draining Kiss 50S

**Gallade** — species, **RU**, source: imported (natdex)
  Psychic/Fighting | BST 518 (68/125/65/65/115/80) | Abilities: Steadfast / Sharpness / Justified
  Engine stats @252 (neutral/positive): Steadfast: Atk 349/383, SpA 229/251, Spe 259/284 — Sharpness: Atk 349/383, SpA 229/251, Spe 259/284 — Justified: Atk 349/383, SpA 229/251, Spe 259/284
  Item: **free** — but its own Galladite is **refused in RU** (it would make Gallade-Mega, OU)
  STAB: Psychic Zen Headbutt 80P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Grass Solar Blade 125 (charge)P, Normal Double-Edge 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Poison Poison Jab 80P
  Special coverage: Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Flying Air Slash 75S

**Gardevoir** — species, **RU**, source: imported (natdex)
  Psychic/Fairy | BST 518 (68/65/65/125/115/80) | Abilities: Synchronize / Trace / Telepathy
  Engine stats @252 (neutral/positive): Synchronize: Atk 229/251, SpA 349/383, Spe 259/284 — Trace: Atk 229/251, SpA 349/383, Spe 259/284 — Telepathy: Atk 229/251, SpA 349/383, Spe 259/284
  Item: **free** — but its own Gardevoirite is **refused in RU** (it would make Gardevoir-Mega, UU)
  STAB: Psychic Future Sight 120S · Fairy Misty Explosion 100S **[power — the user **faints**]**
  Physical coverage: Normal Double-Edge 120P, Fire Fire Punch 75P, Ice Ice Punch 75P, Electric Thunder Punch 75P, Dark Knock Off 65P, Ghost Shadow Sneak 40P
  Special coverage: Fighting Focus Blast 120S, Electric Thunderbolt 95S, Grass Energy Ball 90S, Normal Hyper Voice 90S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S

**Garganacl** — species, **RU**, source: imported (natdex)
  Rock | BST 500 (100/100/130/45/90/35) | Abilities: Purifying Salt / Sturdy / Clear Body
  Engine stats @252 (neutral/positive): Purifying Salt: Atk 299/328, SpA 189/207, Spe 169/185 — Sturdy: Atk 299/328, SpA 189/207, Spe 169/185 — Clear Body: Atk 299/328, SpA 189/207, Spe 169/185
  Item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Steel Heavy Slam 120P, Ground Earthquake 100P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Ground Earth Power 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S

**Gastrodon** — species, **RU**, source: imported (natdex)
  Water/Ground | BST 475 (111/83/68/92/82/39) | Abilities: Sticky Hold / Storm Drain / Sand Force
  Engine stats @252 (neutral/positive): Sticky Hold: Atk 265/291, SpA 283/311, Spe 177/194 — Storm Drain: Atk 265/291, SpA 283/311, Spe 177/194 — Sand Force: Atk 265/291, SpA 283/311, Spe 177/194
  Item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Normal Return 102P, Rock Stone Edge 100P, Bug Skitter Smack 70P, Fighting Rock Smash 40P
  Special coverage: Normal Trump Card 200S **[power — power rises as its PP falls; quoted at full PP]**, Ice Blizzard 120S, Poison Sludge Wave 95S, Rock Ancient Power 60S, Bug Infestation 20S, Psychic Mirror Coat fixedS **[conditional — needs a **special** hit taken from that target this turn]**

**Golisopod** — species, **RU**, source: imported (natdex)
  Bug/Water | BST 530 (75/125/140/60/90/40) | Abilities: Emergency Exit
  Engine stats @252 (neutral/positive): Emergency Exit: Atk 349/383, SpA 219/240, Spe 179/196
  Item: **free** — but its own Golisopite is **refused in RU** (it would make Golisopod-Mega, OU)
  STAB: Bug First Impression 90P · Water Liquidation 85P
  Physical coverage: Fighting Close Combat 120P, Normal Return 102P, Dragon Dual Chop 50x2P, Ground Drill Run 80P, Steel Iron Head 80P, Poison Poison Jab 80P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Dark Dark Pulse 80S, Normal Hidden Power 60S, Ground Mud Shot 55S

**Golurk-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads PU; the enforced tier is the one shown)_
  Ground/Ghost | BST 583 (89/159/105/70/105/55) | Abilities: Unseen Fist
  Engine stats @252 (neutral/positive): Unseen Fist: Atk 417/458, SpA 239/262, Spe 209/229
  Item: **forced — Golurkite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Ground Earthquake 100P · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**
  Physical coverage: Normal Self-Destruct 200P **[power — the user **faints**]**, Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Fire Heat Crash 120P, Steel Heavy Slam 120P, Rock Stone Edge 100P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Electric Thunderbolt 95S, Psychic Psychic 90S, Steel Flash Cannon 80S

**Houndoom-Mega** — forme, **RU**, source: imported (natdex)
  Dark/Fire | BST 600 (75/90/90/140/90/115) | Abilities: Solar Power
  Engine stats @252 (neutral/positive): Solar Power: Atk 279/306, SpA 379/416, Spe 329/361
  Item: **forced — Houndoominite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Dark Dark Pulse 80S · Fire Overheat 140S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P, Electric Thunder Fang 65P, Grass Trailblaze 50P, Fighting Rock Smash 40P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Normal Hyper Voice 90S, Poison Sludge Bomb 90S, Ghost Shadow Ball 80S, Ground Mud Shot 55S

**Infernape** — species, **RU**, source: override
  Fire/Fighting | BST 534 (76/104/71/104/71/108) | Abilities: Blaze / Iron Fist
  Engine stats @252 (neutral/positive): Blaze: Atk 307/337, SpA 307/337, Spe 315/346 — Iron Fist: Atk 307/337, SpA 307/337, Spe 315/346
  Item: **free**
  STAB: Fire Overheat 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
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
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Fighting Close Combat 120P, Flying Acrobatics 110P, Poison Cross Poison 70P, Dark Night Slash 70P, Psychic Psycho Cut 70P
  Special coverage: Normal Tera Blast 80S, Flying Air Slash 75S, Ghost Ominous Wind 60S, Fighting Vacuum Wave 40S

**Krookodile** — species, **RU**, source: imported (natdex)
  Ground/Dark | BST 519 (95/117/80/65/70/92) | Abilities: Intimidate / Moxie / Anger Point
  Engine stats @252 (neutral/positive): Intimidate: Atk 333/366, SpA 229/251, Spe 283/311 — Moxie: Atk 333/366, SpA 229/251, Spe 283/311 — Anger Point: Atk 333/366, SpA 229/251, Spe 283/311
  Item: **free**
  STAB: Ground Earthquake 100P · Dark Foul Play 95P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Poison Gunk Shot 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Fighting Focus Blast 120S, Dragon Dragon Pulse 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Grass Grass Knot 60S, Fire Incinerate 60S

**Latias** — species, **RU**, source: imported (natdex)
  Dragon/Psychic | BST 600 (80/80/90/110/130/110) | Abilities: Levitate
  Engine stats @252 (neutral/positive): Levitate: Atk 259/284, SpA 319/350, Spe 319/350
  Item: **free** — but its own Latiasite is **refused in RU** (it would make Latias-Mega, UU)
  STAB: Dragon Draco Meteor 140S · Psychic Future Sight 120S
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Water Liquidation 85P, Dark Sucker Punch 80P, Ghost Shadow Claw 70P
  Special coverage: Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Ice Ice Beam 95S, Water Surf 95S, Fighting Aura Sphere 90S, Fairy Alluring Voice 80S

**Linoone** — species, **RU**, source: imported (natdex)
  Normal | BST 420 (78/70/61/50/61/100) | Abilities: Pickup / Gluttony / Quick Feet
  Engine stats @252 (neutral/positive): Pickup: Atk 239/262, SpA 199/218, Spe 299/328 — Gluttony: Atk 239/262, SpA 199/218, Spe 299/328 — Quick Feet: Atk 239/262, SpA 199/218, Spe 299/328
  Item: **free**
  STAB: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**
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
  Item: **free** — but its own Lucarionite / Lucarionite Z is **refused in RU** (it would make Lucario-Mega, OU; Lucario-Mega-Z, Ubers)
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Steel Steel Beam 140S
  Physical coverage: Normal Mega Kick 120P, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Fire Blaze Kick 85P, Dark Crunch 80P
  Special coverage: Dragon Dragon Pulse 90S, Psychic Psychic 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Water Water Pulse 60S

**Lycanroc-Dusk** — species, **RU**, source: imported (natdex)
  Rock | BST 487 (75/117/65/55/65/110) | Abilities: Tough Claws
  Engine stats @252 (neutral/positive): Tough Claws: Atk 333/366, SpA 209/229, Spe 319/350
  Item: **free**
  STAB: Rock Stone Edge 100P
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Fighting Close Combat 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P
  Special coverage: Ground Earth Power 90S, Normal Hyper Voice 90S, Dark Snarl 55S

**Machamp** — species, **RU**, source: imported (natdex)
  Fighting | BST 505 (90/130/80/65/85/55) | Abilities: Guts / No Guard / Steadfast
  Engine stats @252 (neutral/positive): Guts: Atk 359/394, SpA 229/251, Spe 209/229 — No Guard: Atk 359/394, SpA 229/251, Spe 209/229 — Steadfast: Atk 359/394, SpA 229/251, Spe 209/229
  Item: **free**
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Dragon Dual Chop 50x2P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Darkest Lariat 85P, Poison Poison Jab 80P
  Special coverage: Fire Fire Blast 120S, Normal Hidden Power 60S, Ground Mud-Slap 20S

**Magnezone** — species, **RU**, source: imported (natdex)
  Electric/Steel | BST 535 (70/70/115/130/90/60) | Abilities: Magnet Pull / Sturdy / Analytic
  Engine stats @252 (neutral/positive): Magnet Pull: Atk 239/262, SpA 359/394, Spe 219/240 — Sturdy: Atk 239/262, SpA 359/394, Spe 219/240 — Analytic: Atk 239/262, SpA 359/394, Spe 219/240
  **TRAPPING ABILITY: Magnet Pull** (optional — one of 3)
  Item: **free**
  STAB: Electric Thunder 120S · Steel Steel Beam 140S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Fighting Body Press 80P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S, Bug Signal Beam 75S, Psychic Mirror Coat fixedS **[conditional — needs a **special** hit taken from that target this turn]**

**Malamar-Mega** — forme, **RU**, source: **estimated** _(its own `species.tier` reads ZU; the enforced tier is the one shown)_
  Dark/Psychic | BST 582 (86/102/88/98/120/88) | Abilities: Contrary
  Engine stats @252 (neutral/positive): Contrary: Atk 303/333, SpA 295/324, Spe 275/302
  Item: **forced — Malamarite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
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
  Item: **forced — Manectite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Electric Thunder 120S
  Physical coverage: Normal Double-Edge 120P, Steel Iron Tail 100P, Psychic Psychic Fangs 85P, Dark Crunch 80P, Fire Fire Fang 65P, Ice Ice Fang 65P
  Special coverage: Fire Overheat 140S, Normal Hyper Voice 90S, Bug Signal Beam 75S, Dark Snarl 55S, Ground Mud-Slap 20S

**Marowak-Alola** — species, **RU**, source: imported (natdex)
  Fire/Ghost | BST 425 (60/80/110/50/80/45) | Abilities: Cursed Body / Lightning Rod / Rock Head
  Engine stats @252 (neutral/positive): Cursed Body: Atk 259/284, SpA 199/218, Spe 189/207 — Lightning Rod: Atk 259/284, SpA 199/218, Spe 189/207 — Rock Head: Atk 259/284, SpA 199/218, Spe 189/207
  Item: **free**
  STAB: Fire Fire Blast 120S · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Dragon Outrage 120P, Ground Bonemerang 50x2P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Ground Earth Power 90S, Normal Uproar 90S

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
  STAB: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]** · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Fairy Play Rough 90P, Psychic Zen Headbutt 80P, Fire Fire Punch 75P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Grass Energy Ball 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Meowstic-M-Mega** — forme, **RU**, source: override
  Psychic | BST 566 (74/48/76/143/101/124) | Abilities: Trace
  Engine stats @252 (neutral/positive): Trace: Atk 195/214, SpA 385/423, Spe 347/381
  Item: **forced — Meowsticite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Dark Sucker Punch 80P, Grass Trailblaze 50P
  Special coverage: Electric Thunderbolt 95S, Grass Energy Ball 90S, Fairy Alluring Voice 80S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S

**Mimikyu** — species, **RU**, source: imported (natdex)
  Ghost/Fairy | BST 476 (55/90/80/50/105/96) | Abilities: Disguise
  Engine stats @252 (neutral/positive): Disguise: Atk 279/306, SpA 199/218, Spe 291/320
  Item: **free**
  STAB: Ghost Phantom Force 90 (charge)P · Fairy Play Rough 90P
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Grass Wood Hammer 120P, Bug Leech Life 80P, Fighting Drain Punch 75P, Dark Feint Attack 60P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Fire Burning Jealousy 70S

**Mimikyu-Busted** — species, **RU**, source: imported (natdex)
  Ghost/Fairy | BST 476 (55/90/80/50/105/96) | Abilities: Disguise
  Engine stats @252 (neutral/positive): Disguise: Atk 279/306, SpA 199/218, Spe 291/320
  Item: **free**
  STAB: Ghost Phantom Force 90 (charge)P · Fairy Play Rough 90P
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Grass Wood Hammer 120P, Bug Leech Life 80P, Fighting Drain Punch 75P, Dark Feint Attack 60P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Dark Dark Pulse 80S, Normal Tera Blast 80S, Grass Giga Drain 75S, Fire Burning Jealousy 70S

**Muk-Alola** — species, **RU**, source: imported (natdex)
  Poison/Dark | BST 500 (105/105/75/65/100/50) | Abilities: Poison Touch / Gluttony / Power of Alchemy
  Engine stats @252 (neutral/positive): Poison Touch: Atk 309/339, SpA 229/251, Spe 199/218 — Gluttony: Atk 309/339, SpA 229/251, Spe 199/218 — Power of Alchemy: Atk 309/339, SpA 229/251, Spe 199/218
  Item: **free**
  STAB: Poison Gunk Shot 120P · Dark Foul Play 95P
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Rock Stone Edge 100P, Ground Dig 100 (charge)P, Bug Lunge 80P, Psychic Zen Headbutt 80P
  Special coverage: Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Fairy Moonblast 95S, Ghost Shadow Ball 80S, Normal Tera Blast 80S

**Munkidori** — species, **RU**, source: override
  Poison/Psychic | BST 555 (88/75/66/130/90/106) | Abilities: Toxic Chain / Frisk
  Engine stats @252 (neutral/positive): Toxic Chain: Atk 249/273, SpA 359/394, Spe 311/342 — Frisk: Atk 249/273, SpA 359/394, Spe 311/342
  Item: **free**
  STAB: Poison Sludge Wave 95S · Psychic Future Sight 120S
  Physical coverage: Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**, Dark Lash Out 75P, Normal Facade 70P, Bug U-turn 70P, Grass Trailblaze 50P
  Special coverage: Fighting Focus Blast 120S, Normal Uproar 90S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Ground Mud-Slap 20S

**Necrozma** — species, **RU**, source: imported (natdex)
  Psychic | BST 600 (97/107/101/127/89/79) | Abilities: Prism Armor
  Engine stats @252 (neutral/positive): Prism Armor: Atk 313/344, SpA 353/388, Spe 257/282
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Dragon Outrage 120P, Normal Return 102P, Ground Earthquake 100P, Rock Stone Edge 100P, Steel Iron Head 80P, Bug X-Scissor 80P
  Special coverage: Normal Wring Out 120S **[power — scales with the target’s **current** HP; quoted against a full-HP target]**, Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Fire Heat Wave 100S, Dragon Dragon Pulse 90S, Ground Earth Power 90S

**Nidoking** — species, **RU**, source: imported (natdex)
  Poison/Ground | BST 505 (81/102/77/85/75/85) | Abilities: Poison Point / Rivalry / Sheer Force
  Engine stats @252 (neutral/positive): Poison Point: Atk 303/333, SpA 269/295, Spe 269/295 — Rivalry: Atk 303/333, SpA 269/295, Spe 269/295 — Sheer Force: Atk 303/333, SpA 269/295, Spe 269/295
  Item: **free**
  STAB: Poison Sludge Wave 95S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Rock Head Smash 150P, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Bug Megahorn 120P, Dragon Outrage 120P, Steel Iron Tail 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Water Surf 95S, Dragon Dragon Pulse 90S

**Nidoqueen** — species, **RU**, source: imported (natdex)
  Poison/Ground | BST 505 (90/92/87/75/85/76) | Abilities: Poison Point / Rivalry / Sheer Force
  Engine stats @252 (neutral/positive): Poison Point: Atk 283/311, SpA 249/273, Spe 251/276 — Rivalry: Atk 283/311, SpA 249/273, Spe 251/276 — Sheer Force: Atk 283/311, SpA 249/273, Spe 251/276
  Item: **free**
  STAB: Poison Sludge Wave 95S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Dragon Outrage 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P
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
  Special coverage: Normal Boomburst 140S, Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Fire Heat Wave 100S, Dark Dark Pulse 80S

**Obstagoon** — species, **RU**, source: imported (natdex)
  Dark/Normal | BST 520 (93/90/101/60/81/95) | Abilities: Reckless / Guts / Defiant
  Engine stats @252 (neutral/positive): Reckless: Atk 279/306, SpA 219/240, Spe 289/317 — Guts: Atk 279/306, SpA 219/240, Spe 289/317 — Defiant: Atk 279/306, SpA 219/240, Spe 289/317
  Item: **free**
  STAB: Dark Throat Chop 80P · Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**
  Physical coverage: Fighting Close Combat 120P, Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Grass Seed Bomb 80P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Water Surf 95S, Ghost Shadow Ball 80S, Grass Grass Knot 60S, Ground Mud Shot 55S

**Ogerpon** — species, **RU**, source: imported (natdex)
  Grass | BST 550 (80/120/84/60/96/110) | Abilities: Defiant
  Engine stats @252 (neutral/positive): Defiant: Atk 339/372, SpA 219/240, Spe 319/350
  Item: **free** — but its own Hearthflame Mask / Wellspring Mask / Cornerstone Mask is **refused in RU** (it would make Ogerpon-Hearthflame, OU; Ogerpon-Wellspring, OU; Ogerpon-Cornerstone, OU)
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
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** · Dark Foul Play 95P
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
  Item: **forced — Pidgeotite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Normal Uproar 90S · Flying Hurricane 120S
  Physical coverage: Steel Steel Wing 70P, Bug U-turn 70P, Dark Feint Attack 60P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Politoed** — species, **RU**, source: imported (natdex)
  Water | BST 500 (90/75/75/90/100/70) | Abilities: Water Absorb / Damp / Drizzle
  Engine stats @252 (neutral/positive): Water Absorb: Atk 249/273, SpA 279/306, Spe 239/262 — Damp: Atk 249/273, SpA 279/306, Spe 239/262 — Drizzle: Atk 249/273, SpA 279/306, Spe 239/262
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Ground Earthquake 100P, Flying Bounce 85 (charge)P, Ice Ice Punch 75P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Ground Earth Power 90S, Normal Hyper Voice 90S, Psychic Psychic 90S

**Porygon2** — species, **RU**, source: override
  Normal | BST 515 (85/80/90/105/95/60) | Abilities: Trace / Download / Analytic
  Engine stats @252 (neutral/positive): Trace: Atk 259/284, SpA 309/339, Spe 219/240 — Download: Atk 259/284, SpA 309/339, Spe 219/240 — Analytic: Atk 259/284, SpA 309/339, Spe 219/240
  Item: **free**
  STAB: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**
  Physical coverage: Steel Iron Tail 100P, Dark Foul Play 95P, Psychic Zen Headbutt 80P, Flying Aerial Ace 60P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Quagsire** — species, **RU**, source: imported (natdex)
  Water/Ground | BST 430 (95/85/85/65/65/35) | Abilities: Damp / Water Absorb / Unaware
  Engine stats @252 (neutral/positive): Damp: Atk 269/295, SpA 229/251, Spe 169/185 — Water Absorb: Atk 269/295, SpA 229/251, Spe 169/185 — Unaware: Atk 269/295, SpA 229/251, Spe 169/185
  Item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Steel Iron Tail 100P, Rock Stone Edge 100P, Ice Ice Punch 75P, Dark Thief 60P
  Special coverage: Ice Blizzard 120S, Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Tera Blast 80S, Rock Ancient Power 60S, Bug Infestation 20S

**Raichu-Mega-X** — forme, **RU**, source: override
  Electric | BST 585 (60/135/95/90/95/110) | Abilities: Electric Surge
  Engine stats @252 (neutral/positive): Electric Surge: Atk 369/405, SpA 279/306, Spe 319/350
  Item: **forced — Raichunite X** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Electric Rising Voltage 140S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Flying Fly 90 (charge)P
  Special coverage: Fighting Focus Blast 120S, Water Surf 95S, Normal Uproar 90S, Fairy Alluring Voice 80S, Bug Signal Beam 75S, Grass Grass Knot 60S

**Regidrago** — species, **RU**, source: imported (natdex)
  Dragon | BST 580 (200/100/50/100/50/80) | Abilities: Dragon's Maw
  Engine stats @252 (neutral/positive): Dragon's Maw: Atk 299/328, SpA 299/328, Spe 259/284
  Item: **free**
  STAB: Dragon Dragon Energy 150S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Ground Earthquake 100P, Fighting Hammer Arm 100P, Dark Crunch 80P, Fire Fire Fang 65P, Ice Ice Fang 65P
  Special coverage: Ground Earth Power 90S, Normal Tera Blast 80S, Rock Ancient Power 60S

**Registeel** — species, **RU**, source: imported (natdex)
  Steel | BST 580 (80/75/150/75/150/50) | Abilities: Clear Body / Light Metal
  Engine stats @252 (neutral/positive): Clear Body: Atk 249/273, SpA 249/273, Spe 199/218 — Light Metal: Atk 249/273, SpA 249/273, Spe 199/218
  Item: **free**
  STAB: Steel Steel Beam 140S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Ground Earthquake 100P, Ice Ice Spinner 80P, Rock Rock Slide 75P, Electric Thunder Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Normal Tera Blast 80S, Ground Mud-Slap 20S

**Reuniclus** — species, **RU**, source: imported (natdex)
  Psychic | BST 490 (110/65/75/125/85/30) | Abilities: Overcoat / Magic Guard / Regenerator
  Engine stats @252 (neutral/positive): Overcoat: Atk 229/251, SpA 349/383, Spe 159/174 — Magic Guard: Atk 229/251, SpA 349/383, Spe 159/174 — Regenerator: Atk 229/251, SpA 349/383, Spe 159/174
  Item: **free**
  STAB: Psychic Future Sight 120S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Steel Steel Roller 130P **[conditional — fails with no terrain up]**, Fire Fire Punch 75P, Ice Ice Punch 75P, Rock Rock Slide 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Energy Ball 90S, Steel Flash Cannon 80S, Ghost Shadow Ball 80S, Normal Tera Blast 80S

**Revavroom** — species, **RU**, source: imported (natdex)
  Steel/Poison | BST 500 (80/119/90/54/67/90) | Abilities: Overcoat / Filter
  Engine stats @252 (neutral/positive): Overcoat: Atk 337/370, SpA 207/227, Spe 279/306 — Filter: Atk 337/370, SpA 207/227, Spe 279/306
  Item: **free**
  STAB: Steel Hard Press 100P · Poison Gunk Shot 120P
  Physical coverage: Normal Self-Destruct 200P **[power — the user **faints**]**, Ground High Horsepower 95P, Psychic Zen Headbutt 80P, Dark Lash Out 75P, Fire Temper Flare 75P, Ghost Lick 30P
  Special coverage: Fire Overheat 140S, Normal Uproar 90S

**Ribombee** — species, **RU**, source: imported (natdex)
  Bug/Fairy | BST 464 (60/55/60/95/70/124) | Abilities: Honey Gather / Shield Dust / Sweet Veil
  Engine stats @252 (neutral/positive): Honey Gather: Atk 209/229, SpA 289/317, Spe 347/381 — Shield Dust: Atk 209/229, SpA 289/317, Spe 347/381 — Sweet Veil: Atk 209/229, SpA 289/317, Spe 347/381
  Item: **free**
  STAB: Bug Bug Buzz 90S · Fairy Moonblast 95S
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Flying Acrobatics 110P, Dark Thief 60P, Grass Trailblaze 50P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Normal Tera Blast 80S

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
  Special coverage: Steel Flash Cannon 80S, Rock Power Gem 80S, Normal Tera Blast 80S, Psychic Mirror Coat fixedS **[conditional — needs a **special** hit taken from that target this turn]**

**Sceptile-Mega** — forme, **RU**, source: imported (natdex)
  Grass/Dragon | BST 630 (70/110/75/145/85/145) | Abilities: Lightning Rod
  Engine stats @252 (neutral/positive): Lightning Rod: Atk 319/350, SpA 389/427, Spe 389/427
  Item: **forced — Sceptilite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Grass Leaf Storm 140S · Dragon Outrage 120P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P, Bug X-Scissor 80P
  Special coverage: Fighting Focus Blast 120S, Normal Tera Blast 80S, Ground Mud-Slap 20S

**Scovillain-Mega** — forme, **RU**, source: override
  Grass/Fire | BST 586 (65/138/85/138/85/75) | Abilities: Spicy Spray
  Engine stats @252 (neutral/positive): Spicy Spray: Atk 375/412, SpA 375/412, Spe 249/273
  Item: **forced — Scovillainite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Grass Leaf Storm 140S · Fire Overheat 140S
  Physical coverage: Normal Take Down 90P, Dark Crunch 80P, Psychic Zen Headbutt 80P, Ground Stomping Tantrum 75P, Rock Rollout 30P
  Special coverage: Normal Tera Blast 80S

**Seismitoad** — species, **RU**, source: imported (natdex)
  Water/Ground | BST 509 (105/95/75/85/75/74) | Abilities: Swift Swim / Poison Touch / Water Absorb
  Engine stats @252 (neutral/positive): Swift Swim: Atk 289/317, SpA 269/295, Spe 247/271 — Poison Touch: Atk 289/317, SpA 269/295, Spe 247/271 — Water Absorb: Atk 289/317, SpA 269/295, Spe 247/271
  Item: **free**
  STAB: Water Hydro Pump 120S · Ground Earthquake 100P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Mega Kick 120P, Grass Power Whip 120P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P, Ice Ice Punch 75P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Hyper Voice 90S, Grass Grass Knot 60S, Ice Icy Wind 55S, Bug Infestation 20S

**Sharpedo** — species, **RU**, source: imported (natdex)
  Water/Dark | BST 460 (70/120/40/95/40/95) | Abilities: Rough Skin / Speed Boost
  Engine stats @252 (neutral/positive): Rough Skin: Atk 339/372, SpA 289/317, Spe 289/317 — Speed Boost: Atk 339/372, SpA 289/317, Spe 289/317
  Item: **free** — but its own Sharpedonite is **refused in RU** (it would make Sharpedo-Mega, UU)
  STAB: Water Hydro Pump 120S · Dark Crunch 80P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Fighting Close Combat 120P, Ground Earthquake 100P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P, Poison Poison Jab 80P
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
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Flying Sky Attack 140 (charge)P, Grass Solar Blade 125 (charge)P, Steel Iron Tail 100P, Bug First Impression 90P, Poison Poison Jab 80P
  Special coverage: Normal Trump Card 200S **[power — power rises as its PP falls; quoted at full PP]**, Fire Heat Wave 100S, Flying Air Slash 75S, Ghost Ominous Wind 60S, Dragon Twister 40S, Ground Mud-Slap 20S

**Skeledirge** — species, **RU**, source: imported (natdex)
  Fire/Ghost | BST 530 (104/75/100/110/75/66) | Abilities: Blaze / Unaware
  Engine stats @252 (neutral/positive): Blaze: Atk 249/273, SpA 319/350, Spe 231/254 — Unaware: Atk 249/273, SpA 319/350, Spe 231/254
  Item: **free**
  STAB: Fire Overheat 140S · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**
  Physical coverage: Dragon Outrage 120P, Ground Earthquake 100P, Normal Take Down 90P, Dark Crunch 80P, Grass Seed Bomb 80P, Psychic Zen Headbutt 80P
  Special coverage: Poison Belch 120S **[conditional — fails until the user has eaten a Berry]**, Grass Solar Beam 120 (charge)S, Ground Earth Power 90S, Normal Hyper Voice 90S, Fairy Alluring Voice 80S, Dark Snarl 55S

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
  STAB: Fairy Misty Explosion 100S **[power — the user **faints**]**
  Physical coverage: Normal Return 102P, Fighting Drain Punch 75P, Dark Thief 60P
  Special coverage: Electric Thunder 120S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Fire Flamethrower 95S, Water Surf 95S, Grass Energy Ball 90S, Normal Hidden Power 60S

**Steelix** — species, **RU**, source: imported (natdex)
  Steel/Ground | BST 510 (75/85/200/55/65/30) | Abilities: Rock Head / Sturdy / Sheer Force
  Engine stats @252 (neutral/positive): Rock Head: Atk 269/295, SpA 209/229, Spe 159/174 — Sturdy: Atk 269/295, SpA 209/229, Spe 159/174 — Sheer Force: Atk 269/295, SpA 209/229, Spe 159/174
  Item: **free**
  STAB: Steel Steel Beam 140S · Ground Earthquake 100P
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Rock Head Smash 150P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Fighting Body Press 80P, Dark Crunch 80P
  Special coverage: Rock Meteor Beam 120 (charge)S, Dragon Dragon Pulse 90S, Dark Dark Pulse 80S, Normal Hidden Power 60S

**Steelix-Mega** — forme, **RU**, source: imported (natdex)
  Steel/Ground | BST 610 (75/125/230/55/95/30) | Abilities: Sand Force
  Engine stats @252 (neutral/positive): Sand Force: Atk 349/383, SpA 209/229, Spe 159/174
  Item: **forced — Steelixite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Steel Steel Roller 130P **[conditional — fails with no terrain up]** · Ground Earthquake 100P
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Rock Head Smash 150P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Fighting Body Press 80P, Dark Crunch 80P
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
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Ground Earthquake 100P, Poison Poison Jab 80P, Fighting Brick Break 75P, Rock Rock Slide 75P, Dark Knock Off 65P
  Special coverage: Fighting Focus Blast 120S, Normal Wring Out 120S **[power — scales with the target’s **current** HP; quoted against a full-HP target]**, Poison Sludge Bomb 90S, Rock Ancient Power 60S, Electric Shock Wave 60S, Psychic Confusion 50S

**Tapu Bulu** — species, **RU**, source: imported (natdex)
  Grass/Fairy | BST 570 (70/130/115/85/95/75) | Abilities: Grassy Surge / Telepathy
  Engine stats @252 (neutral/positive): Grassy Surge: Atk 359/394, SpA 269/295, Spe 249/273 — Telepathy: Atk 359/394, SpA 269/295, Spe 249/273
  Item: **free**
  STAB: Grass Wood Hammer 120P · Fairy Dazzling Gleam 80S **(wrong category)**
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Bug Megahorn 120P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Ground High Horsepower 95P
  Special coverage: Fighting Focus Blast 120S, Normal Hidden Power 60S, Dark Snarl 55S, Psychic Stored Power 20S

**Tatsugiri-Curly-Mega** — forme, **RU**, source: override
  Dragon/Water | BST 575 (68/65/90/135/125/92) | Abilities: Commander
  Engine stats @252 (neutral/positive): Commander: Atk 229/251, SpA 369/405, Spe 283/311
  Item: **forced — Tatsugirinite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Dragon Draco Meteor 140S · Water Hydro Pump 120S
  Physical coverage: Normal Take Down 90P, Bug Lunge 80P, Fighting Counter fixedP **[conditional — needs a **physical** hit taken from that target this turn]**
  Special coverage: Normal Tera Blast 80S, Ice Icy Wind 55S, Psychic Mirror Coat fixedS **[conditional — needs a **special** hit taken from that target this turn]**

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
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Psychic Zen Headbutt 80P, Steel Smart Strike 70P, Dark Fling 30P **[conditional — fails with no removable item, and consumes it]**, Rock Rollout 30P
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
  STAB: Electric Thunder 120S · Poison Belch 120S **[conditional — fails until the user has eaten a Berry]**
  Physical coverage: Normal Mega Kick 120P, Dark Throat Chop 80P, Fighting Brick Break 75P, Fire Fire Punch 75P, Grass Trailblaze 50P
  Special coverage: Normal Boomburst 140S, Psychic Psychic Noise 75S, Ghost Hex 65S, Dark Snarl 55S

**Toxtricity-Low-Key** — species, **RU**, source: imported (natdex)
  Electric/Poison | BST 502 (75/98/70/114/70/75) | Abilities: Punk Rock / Minus / Technician
  Engine stats @252 (neutral/positive): Punk Rock: Atk 295/324, SpA 327/359, Spe 249/273 — Minus: Atk 295/324, SpA 327/359, Spe 249/273 — Technician: Atk 295/324, SpA 327/359, Spe 249/273
  Item: **free**
  STAB: Electric Thunder 120S · Poison Belch 120S **[conditional — fails until the user has eaten a Berry]**
  Physical coverage: Normal Mega Kick 120P, Dark Throat Chop 80P, Fighting Brick Break 75P, Fire Fire Punch 75P, Grass Trailblaze 50P
  Special coverage: Normal Boomburst 140S, Psychic Psychic Noise 75S, Ghost Hex 65S, Dark Snarl 55S

**Umbreon** — species, **RU**, source: imported (natdex)
  Dark | BST 525 (95/65/110/60/130/65) | Abilities: Synchronize / Inner Focus
  Engine stats @252 (neutral/positive): Synchronize: Atk 229/251, SpA 219/240, Spe 229/251 — Inner Focus: Atk 229/251, SpA 219/240, Spe 229/251
  Item: **free**
  STAB: Dark Foul Play 95P
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Grass Trailblaze 50P
  Special coverage: Normal Trump Card 200S **[power — power rises as its PP falls; quoted at full PP]**, Psychic Synchronoise 120S, Electric Zap Cannon 120S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Ground Mud-Slap 20S

**Victreebel-Mega** — forme, **RU**, source: override
  Grass/Poison | BST 590 (80/125/85/135/95/70) | Abilities: Innards Out
  Engine stats @252 (neutral/positive): Innards Out: Atk 349/383, SpA 369/405, Spe 239/262
  Item: **forced — Victreebelite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Grass Leaf Storm 140S · Poison Belch 120S **[conditional — fails until the user has eaten a Berry]**
  Physical coverage: Normal Double-Edge 120P, Bug Leech Life 80P, Dark Sucker Punch 80P
  Special coverage: Normal Wring Out 120S **[power — scales with the target’s **current** HP; quoted against a full-HP target]**, Bug Infestation 20S

**Volcanion** — species, **RU**, source: imported (natdex)
  Fire/Water | BST 600 (80/110/120/130/90/70) | Abilities: Water Absorb
  Engine stats @252 (neutral/positive): Water Absorb: Atk 319/350, SpA 359/394, Spe 239/262
  Item: **free**
  STAB: Fire Overheat 140S · Water Hydro Pump 120S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Fighting Superpower 120P, Ground Earthquake 100P, Steel Heavy Slam 100P, Rock Stone Edge 100P, Electric Wild Charge 90P
  Special coverage: Fighting Focus Blast 120S, Grass Solar Beam 120 (charge)S, Poison Sludge Wave 95S, Ground Earth Power 90S, Steel Flash Cannon 80S, Normal Tera Blast 80S

**Weezing-Galar** — species, **RU**, source: imported (natdex)
  Poison/Fairy | BST 490 (65/90/120/85/70/60) | Abilities: Levitate / Neutralizing Gas / Misty Surge
  Engine stats @252 (neutral/positive): Levitate: Atk 279/306, SpA 269/295, Spe 219/240 — Neutralizing Gas: Atk 279/306, SpA 269/295, Spe 219/240 — Misty Surge: Atk 279/306, SpA 269/295, Spe 219/240
  Item: **free**
  STAB: Poison Belch 120S **[conditional — fails until the user has eaten a Berry]** · Fairy Misty Explosion 100S **[power — the user **faints**]**
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Dark Assurance 60P **[power — doubles to 120 if the target has already taken damage this turn]**, Rock Rollout 30P, Steel Gyro Ball 24P
  Special coverage: Fire Overheat 140S, Electric Thunder 120S, Normal Uproar 90S, Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Psychic Psybeam 65S

**Yanmega** — species, **RU**, source: imported (natdex)
  Bug/Flying | BST 515 (86/76/86/116/56/95) | Abilities: Speed Boost / Tinted Lens / Frisk
  Engine stats @252 (neutral/positive): Speed Boost: Atk 251/276, SpA 331/364, Spe 289/317 — Tinted Lens: Atk 251/276, SpA 331/364, Spe 289/317 — Frisk: Atk 251/276, SpA 331/364, Spe 289/317
  Item: **free**
  STAB: Bug Bug Buzz 90S · Flying Dual Wingbeat 50x2P
  Physical coverage: Normal Double-Edge 120P, Dark Crunch 80P, Steel Steel Wing 70P, Fighting Reversal 20P
  Special coverage: Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Normal Uproar 90S, Ghost Shadow Ball 80S, Rock Ancient Power 60S, Ground Mud-Slap 20S

**Zarude** — species, **RU**, source: imported (natdex)
  Dark/Grass | BST 600 (105/120/105/70/95/105) | Abilities: Leaf Guard
  Engine stats @252 (neutral/positive): Leaf Guard: Atk 339/372, SpA 239/262, Spe 309/339
  Item: **free**
  STAB: Dark Darkest Lariat 85P · Grass Solar Blade 125 (charge)P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Flying Acrobatics 110P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Rock Rock Slide 75P
  Special coverage: Normal Hyper Voice 90S, Ground Mud Shot 55S

**Zygarde-10%** — species, **RU**, source: imported (natdex)
  Dragon/Ground | BST 486 (54/100/71/61/85/115) | Abilities: Aura Break / Power Construct
  Engine stats @252 (neutral/positive): Aura Break: Atk 299/328, SpA 221/243, Spe 329/361 — Power Construct: Atk 299/328, SpA 221/243, Spe 329/361
  Item: **free**
  STAB: Dragon Outrage 120P · Ground Earthquake 100P
  Physical coverage: Fighting Superpower 120P, Normal Return 102P, Steel Iron Tail 100P, Rock Stone Edge 100P, Dark Crunch 80P, Psychic Zen Headbutt 80P
  Special coverage: Fighting Focus Blast 120S, Poison Sludge Wave 95S, Normal Hyper Voice 90S, Grass Grass Knot 60S, Electric Shock Wave 60S

### The NU roster — 67 entries, where Meloetta itself sits and what the gate protects

**Abomasnow-Mega** — forme, **NU**, source: imported (natdex-RU refined by gen7)
  Grass/Ice | BST 594 (90/132/105/132/105/30) | Abilities: Snow Warning
  Engine stats @252 (neutral/positive): Snow Warning: Atk 363/399, SpA 363/399, Spe 159/174
  Item: **forced — Abomasite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Grass Leaf Storm 140S · Ice Blizzard 120S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Dragon Outrage 120P, Ground Earthquake 100P, Steel Hard Press 100P, Dark Fling 80P **[conditional — fails with no removable item, and consumes it]**
  Special coverage: Fighting Focus Blast 120S, Ground Earth Power 90S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Water Water Pulse 60S

**Aerodactyl** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Rock/Flying | BST 515 (80/105/65/60/75/130) | Abilities: Rock Head / Pressure / Unnerve
  Engine stats @252 (neutral/positive): Rock Head: Atk 309/339, SpA 219/240, Spe 359/394 — Pressure: Atk 309/339, SpA 219/240, Spe 359/394 — Unnerve: Atk 309/339, SpA 219/240, Spe 359/394
  Item: **free** — but its own Aerodactylite is **refused in NU** (it would make Aerodactyl-Mega, UU)
  STAB: Rock Stone Edge 100P · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P, Psychic Psychic Fangs 85P, Dark Crunch 80P
  Special coverage: Fire Fire Blast 120S, Dragon Dragon Pulse 90S, Ground Earth Power 90S, Normal Razor Wind 80 (charge)S **[power — two-turn — it charges first (the profiler tags it `(charge)`)]**, Ghost Ominous Wind 60S

**Aggron** — species, **NU**, source: override
  Steel/Rock | BST 530 (70/110/180/60/60/50) | Abilities: Sturdy / Rock Head / Heavy Metal
  Engine stats @252 (neutral/positive): Sturdy: Atk 319/350, SpA 219/240, Spe 199/218 — Rock Head: Atk 319/350, SpA 219/240, Spe 199/218 — Heavy Metal: Atk 319/350, SpA 219/240, Spe 199/218
  Item: **free** — but its own Aggronite is **refused in NU** (it would make Aggron-Mega, RU)
  STAB: Steel Steel Roller 130P **[conditional — fails with no terrain up]** · Rock Head Smash 150P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Dragon Outrage 120P, Ground Earthquake 100P, Water Aqua Tail 90P, Dark Crunch 80P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S

**Altaria** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Dragon/Flying | BST 490 (75/70/90/70/105/80) | Abilities: Natural Cure / Cloud Nine
  Engine stats @252 (neutral/positive): Natural Cure: Atk 239/262, SpA 239/262, Spe 259/284 — Cloud Nine: Atk 239/262, SpA 239/262, Spe 259/284
  Item: **free** — but its own Altarianite is **refused in NU** (it would make Altaria-Mega, UU)
  STAB: Dragon Draco Meteor 140S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Fairy Play Rough 90P, Dark Thief 60P, Grass Trailblaze 50P
  Special coverage: Fire Fire Blast 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Ice Ice Beam 95S, Fairy Moonblast 95S, Normal Hyper Voice 90S

**Araquanid** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water/Bug | BST 454 (68/70/92/50/132/42) | Abilities: Water Bubble / Water Absorb
  Engine stats @252 (neutral/positive): Water Bubble: Atk 239/262, SpA 199/218, Spe 183/201 — Water Absorb: Atk 239/262, SpA 199/218, Spe 183/201
  Item: **free**
  STAB: Water Hydro Pump 120S · Bug Bug Buzz 90S
  Physical coverage: Normal Return 102P, Dark Crunch 80P, Poison Poison Jab 80P, Grass Trailblaze 50P
  Special coverage: Ice Blizzard 120S, Normal Tera Blast 80S, Grass Giga Drain 75S, Psychic Mirror Coat fixedS **[conditional — needs a **special** hit taken from that target this turn]**

**Arcanine** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Fire | BST 555 (90/110/80/100/80/95) | Abilities: Intimidate / Flash Fire / Justified
  Engine stats @252 (neutral/positive): Intimidate: Atk 319/350, SpA 299/328, Spe 289/317 — Flash Fire: Atk 319/350, SpA 299/328, Spe 289/317 — Justified: Atk 319/350, SpA 299/328, Spe 289/317
  Item: **free**
  STAB: Fire Overheat 140S
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Fighting Close Combat 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Fairy Play Rough 90P
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
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Steel Heavy Slam 120P, Fighting Superpower 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Crunch 80P
  Special coverage: Water Hydro Pump 120S, Steel Flash Cannon 80S, Normal Tera Blast 80S, Psychic Mirror Coat fixedS **[conditional — needs a **special** hit taken from that target this turn]**

**Basculegion** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water/Ghost | BST 530 (120/112/65/80/75/78) | Abilities: Swift Swim / Adaptability / Mold Breaker
  Engine stats @252 (neutral/positive): Swift Swim: Atk 323/355, SpA 259/284, Spe 255/280 — Adaptability: Atk 323/355, SpA 259/284, Spe 255/280 — Mold Breaker: Atk 323/355, SpA 259/284, Spe 255/280
  Item: **free**
  STAB: Water Hydro Pump 120S · Ghost Phantom Force 90 (charge)P
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Fighting Superpower 120P, Psychic Psychic Fangs 85P, Flying Bounce 85 (charge)P
  Special coverage: Ice Blizzard 120S, Normal Uproar 90S, Ground Mud Shot 55S, Fighting Final Gambit fixedS **[power — deals the user’s current HP and the user **faints**]**

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
  STAB: Grass Leaf Storm 140S · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**
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
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Ground Earthquake 100P, Fighting Body Press 80P, Ice Ice Spinner 80P, Rock Rock Blast 25x2-5P, Dark Feint Attack 60P
  Special coverage: Rock Meteor Beam 120 (charge)S, Grass Solar Beam 120 (charge)S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Electric Charge Beam 50S

**Cinccino** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 470 (75/95/60/65/60/115) | Abilities: Cute Charm / Technician / Skill Link
  Engine stats @252 (neutral/positive): Cute Charm: Atk 289/317, SpA 229/251, Spe 329/361 — Technician: Atk 289/317, SpA 229/251, Spe 329/361 — Skill Link: Atk 289/317, SpA 229/251, Spe 329/361
  Item: **free**
  STAB: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**
  Physical coverage: Poison Gunk Shot 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Water Aqua Tail 90P, Fairy Play Rough 90P, Ice Ice Spinner 80P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Fairy Alluring Voice 80S, Grass Grass Knot 60S, Water Chilling Water 50S, Ground Mud-Slap 20S

**Decidueye** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Grass/Ghost | BST 530 (78/107/75/100/100/70) | Abilities: Overgrow / Long Reach
  Engine stats @252 (neutral/positive): Overgrow: Atk 313/344, SpA 299/328, Spe 239/262 — Long Reach: Atk 313/344, SpA 299/328, Spe 239/262
  Item: **free**
  STAB: Grass Leaf Storm 140S · Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**
  Physical coverage: Flying Sky Attack 140 (charge)P, Normal Return 102P, Dark Sucker Punch 80P, Psychic Psycho Cut 70P, Bug Skitter Smack 70P, Steel Steel Wing 70P
  Special coverage: Flying Hurricane 120S, Normal Tera Blast 80S

**Decidueye-Hisui** — species, **NU**, source: override
  Grass/Fighting | BST 530 (88/112/80/95/95/60) | Abilities: Overgrow / Scrappy
  Engine stats @252 (neutral/positive): Overgrow: Atk 323/355, SpA 289/317, Spe 219/240 — Scrappy: Atk 323/355, SpA 289/317, Spe 219/240
  Item: **free**
  STAB: Grass Leaf Storm 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Flying Sky Attack 140 (charge)P, Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**, Normal Return 102P, Dark Sucker Punch 80P, Psychic Psycho Cut 70P, Bug Skitter Smack 70P
  Special coverage: Flying Hurricane 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S

**Dhelmise** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Ghost/Grass | BST 517 (70/131/100/86/90/40) | Abilities: Steelworker
  Engine stats @252 (neutral/positive): Steelworker: Atk 361/397, SpA 271/298, Spe 179/196
  Item: **free**
  STAB: Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]** · Grass Solar Blade 125 (charge)P
  Physical coverage: Steel Steel Roller 130P **[conditional — fails with no terrain up]**, Normal Return 102P, Ground Earthquake 100P, Water Liquidation 85P, Fighting Body Press 80P, Rock Rock Slide 75P
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
  Item: **free** — but its own Dragalgite is **refused in NU** (it would make Dragalge-Mega, UU)
  STAB: Poison Gunk Shot 120P · Dragon Draco Meteor 140S
  Physical coverage: Normal Return 102P, Steel Iron Tail 100P, Water Aqua Tail 90P, Fairy Play Rough 90P, Flying Bounce 85 (charge)P, Dark Feint Attack 60P
  Special coverage: Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Ice Icy Wind 55S

**Drampa** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Normal/Dragon | BST 485 (78/60/85/135/91/36) | Abilities: Berserk / Sap Sipper / Cloud Nine
  Engine stats @252 (neutral/positive): Berserk: Atk 219/240, SpA 369/405, Spe 171/188 — Sap Sipper: Atk 219/240, SpA 369/405, Spe 171/188 — Cloud Nine: Atk 219/240, SpA 369/405, Spe 171/188
  Item: **free** — but its own Drampanite is **refused in NU** (it would make Drampa-Mega, UU)
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
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Bug Megahorn 120P, Fighting Superpower 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Dark Crunch 80P
  Special coverage: Ice Blizzard 120S, Ground Earth Power 90S, Normal Tera Blast 80S

**Dudunsparce** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Normal | BST 520 (125/100/80/85/75/55) | Abilities: Serene Grace / Run Away / Rattled
  Engine stats @252 (neutral/positive): Serene Grace: Atk 299/328, SpA 269/295, Spe 209/229 — Run Away: Atk 299/328, SpA 269/295, Spe 209/229 — Rattled: Atk 299/328, SpA 269/295, Spe 209/229
  Item: **free**
  STAB: Normal Trump Card 200S **[power — power rises as its PP falls; quoted at full PP]**
  Physical coverage: Dragon Outrage 120P, Flying Dual Wingbeat 50x2P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Water Aqua Tail 90P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Flying Hurricane 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**

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
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Bite 60P, Grass Trailblaze 50P
  Special coverage: Normal Trump Card 200S **[power — power rises as its PP falls; quoted at full PP]**, Electric Zap Cannon 120S, Fairy Alluring Voice 80S, Rock Power Gem 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

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
  Item: **forced — Glalitite** (this entry IS the forme; the stone occupies the slot and cannot be removed or knocked off)
  STAB: Ice Explosion 325P **[power — the user **faints**]**
  Physical coverage: Steel Steel Roller 130P **[conditional — fails with no terrain up]**, Ground Earthquake 100P, Dark Foul Play 95P, Grass Trailblaze 50P, Ghost Astonish 30P, Rock Rollout 30P
  Special coverage: Dark Dark Pulse 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Water Water Pulse 60S

**Gligar** — species, **NU**, source: override
  Ground/Flying | BST 430 (65/75/105/35/65/85) | Abilities: Hyper Cutter / Sand Veil / Immunity
  Engine stats @252 (neutral/positive): Hyper Cutter: Atk 249/273, SpA 169/185, Spe 269/295 — Sand Veil: Atk 249/273, SpA 169/185, Spe 269/295 — Immunity: Atk 249/273, SpA 169/185, Spe 269/295
  Item: **free**
  STAB: Ground Earthquake 100P · Flying Acrobatics 110P
  Physical coverage: Normal Double-Edge 120P, Poison Gunk Shot 120P, Water Crabhammer 100P, Steel Iron Tail 100P, Rock Stone Edge 100P, Psychic Psychic Fangs 85P
  Special coverage: Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**, Poison Sludge Bomb 90S, Dark Dark Pulse 80S, Normal Tera Blast 80S, Bug Struggle Bug 50S **[power — only reachable when no other move can be selected]**

**Goodra** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Dragon | BST 600 (90/100/70/110/150/80) | Abilities: Sap Sipper / Hydration / Gooey
  Engine stats @252 (neutral/positive): Sap Sipper: Atk 299/328, SpA 319/350, Spe 259/284 — Hydration: Atk 299/328, SpA 319/350, Spe 259/284 — Gooey: Atk 299/328, SpA 319/350, Spe 259/284
  Item: **free**
  STAB: Dragon Draco Meteor 140S
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Mega Kick 120P, Grass Power Whip 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Water Aqua Tail 90P
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
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Steel Steel Roller 130P **[conditional — fails with no terrain up]**, Fire Heat Crash 120P, Ground Earthquake 100P, Fighting Hammer Arm 100P, Rock Stone Edge 100P
  Special coverage: Poison Belch 120S **[conditional — fails until the user has eaten a Berry]**, Fire Fire Blast 120S, Normal Wring Out 120S **[power — scales with the target’s **current** HP; quoted against a full-HP target]**, Electric Shock Wave 60S

**Hariyama** — species, **NU**, source: override
  Fighting | BST 474 (144/120/60/40/60/50) | Abilities: Thick Fat / Guts / Sheer Force
  Engine stats @252 (neutral/positive): Thick Fat: Atk 339/372, SpA 179/196, Spe 199/218 — Guts: Atk 339/372, SpA 179/196, Spe 199/218 — Sheer Force: Atk 339/372, SpA 179/196, Spe 199/218
  Item: **free**
  STAB: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
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
  Item: **free** — but its own Heracronite is **refused in NU** (it would make Heracross-Mega, UU)
  STAB: Bug Megahorn 120P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Normal Double-Edge 120P, Ground Earthquake 100P, Rock Stone Edge 100P, Dark Throat Chop 80P, Grass Bullet Seed 25x2-5P, Ghost Shadow Claw 70P
  Special coverage: Normal Tera Blast 80S, Poison Venoshock 65S

**Houndstone** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Ghost | BST 488 (72/101/100/50/97/68) | Abilities: Sand Rush / Fluffy
  Engine stats @252 (neutral/positive): Sand Rush: Atk 301/331, SpA 199/218, Spe 235/258 — Fluffy: Atk 301/331, SpA 199/218, Spe 235/258
  Item: **free**
  STAB: Ghost Poltergeist 110P **[RedGPT: no held-item condition in RedGPT]**
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Fairy Play Rough 90P, Psychic Psychic Fangs 85P, Fighting Body Press 80P, Dark Crunch 80P
  Special coverage: Normal Uproar 90S, Ground Mud Shot 55S, Dark Snarl 55S

**Incineroar** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Fire/Dark | BST 530 (95/115/90/80/90/60) | Abilities: Blaze / Intimidate
  Engine stats @252 (neutral/positive): Blaze: Atk 329/361, SpA 259/284, Spe 219/240 — Intimidate: Atk 329/361, SpA 259/284, Spe 219/240
  Item: **free**
  STAB: Fire Overheat 140S · Dark Darkest Lariat 85P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Double-Edge 120P, Dragon Outrage 120P, Flying Acrobatics 110P, Ground Earthquake 100P, Steel Iron Head 80P
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
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Dark Foul Play 95P, Bug Skitter Smack 70P, Ghost Astonish 30P
  Special coverage: Psychic Psychic 90S, Normal Tera Blast 80S

**Magneton** — species, **NU**, source: override
  Electric/Steel | BST 465 (50/60/95/120/70/70) | Abilities: Magnet Pull / Sturdy / Analytic
  Engine stats @252 (neutral/positive): Magnet Pull: Atk 219/240, SpA 339/372, Spe 239/262 — Sturdy: Atk 219/240, SpA 339/372, Spe 239/262 — Analytic: Atk 219/240, SpA 339/372, Spe 239/262
  **TRAPPING ABILITY: Magnet Pull** (optional — one of 3)
  Item: **free**
  STAB: Electric Thunder 120S · Steel Steel Beam 140S
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Rock Rollout 30P
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
  STAB: Normal Hyper Voice 90S · Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Flying Acrobatics 110P, Dragon Dual Chop 50x2P, Rock Stone Edge 100P, Fairy Play Rough 90P, Fire Fire Punch 75P
  Special coverage: Fighting Focus Blast 120S, Electric Thunder 120S, Grass Energy Ball 90S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Omastar** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Rock/Water | BST 495 (70/60/125/115/70/55) | Abilities: Swift Swim / Shell Armor / Weak Armor
  Engine stats @252 (neutral/positive): Swift Swim: Atk 219/240, SpA 329/361, Spe 209/229 — Shell Armor: Atk 219/240, SpA 329/361, Spe 209/229 — Weak Armor: Atk 219/240, SpA 329/361, Spe 209/229
  Item: **free**
  STAB: Rock Meteor Beam 120 (charge)S · Water Hydro Pump 120S
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Dark Crunch 80P, Fighting Submission 80P, Bug Pin Missile 25x2-5P, Steel Gyro Ball 26P
  Special coverage: Ice Blizzard 120S, Normal Wring Out 120S **[power — scales with the target’s **current** HP; quoted against a full-HP target]**, Ground Earth Power 90S

**Overqwil** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Dark/Poison | BST 510 (85/115/95/65/65/85) | Abilities: Poison Point / Swift Swim / Intimidate
  Engine stats @252 (neutral/positive): Poison Point: Atk 329/361, SpA 229/251, Spe 269/295 — Swift Swim: Atk 329/361, SpA 229/251, Spe 269/295 — Intimidate: Atk 329/361, SpA 229/251, Spe 269/295
  Item: **free**
  STAB: Dark Crunch 80P · Poison Gunk Shot 120P
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Steel Steel Roller 130P **[conditional — fails with no terrain up]**, Water Aqua Tail 90P, Flying Bounce 85 (charge)P, Bug Pin Missile 25x2-5P, Dragon Scale Shot 25x2-5P
  Special coverage: Ice Blizzard 120S, Water Hydro Pump 120S, Ghost Shadow Ball 80S, Normal Tera Blast 80S, Bug Signal Beam 75S, Electric Shock Wave 60S

**Pawmot** — species, **NU**, source: override
  Electric/Fighting | BST 490 (70/115/70/70/60/105) | Abilities: Volt Absorb / Natural Cure / Iron Fist
  Engine stats @252 (neutral/positive): Volt Absorb: Atk 329/361, SpA 239/262, Spe 309/339 — Natural Cure: Atk 329/361, SpA 239/262, Spe 309/339 — Iron Fist: Atk 329/361, SpA 239/262, Spe 309/339
  Item: **free**
  STAB: Electric Double Shock 120P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
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
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Bug Megahorn 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Electric Supercell Slam 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S

**Rhyperior** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Ground/Rock | BST 535 (115/140/130/55/55/40) | Abilities: Lightning Rod / Solid Rock / Reckless
  Engine stats @252 (neutral/positive): Lightning Rod: Atk 379/416, SpA 209/229, Spe 179/196 — Solid Rock: Atk 379/416, SpA 209/229, Spe 179/196 — Reckless: Atk 379/416, SpA 209/229, Spe 179/196
  Item: **free**
  STAB: Ground Earthquake 100P · Rock Stone Edge 100P
  Physical coverage: Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**, Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Fire Heat Crash 120P, Steel Heavy Slam 120P, Bug Megahorn 120P, Dragon Outrage 120P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Water Hydro Pump 120S, Electric Thunder 120S, Dragon Dragon Pulse 90S

**Scrafty** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Dark/Fighting | BST 488 (65/90/115/45/115/58) | Abilities: Shed Skin / Moxie / Intimidate
  Engine stats @252 (neutral/positive): Shed Skin: Atk 279/306, SpA 189/207, Spe 215/236 — Moxie: Atk 279/306, SpA 189/207, Spe 215/236 — Intimidate: Atk 279/306, SpA 189/207, Spe 215/236
  Item: **free** — but its own Scraftinite is **refused in NU** (it would make Scrafty-Mega, UU)
  STAB: Dark Foul Play 95P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]**
  Physical coverage: Rock Head Smash 150P, Normal Double-Edge 120P, Dragon Outrage 120P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Poison Poison Jab 80P
  Special coverage: Dragon Dragon Pulse 90S, Poison Sludge Bomb 90S, Normal Uproar 90S, Grass Grass Knot 60S, Fire Incinerate 60S

**Scream Tail** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Fairy/Psychic | BST 570 (115/65/99/65/115/111) | Abilities: Protosynthesis
  Engine stats @252 (neutral/positive): Protosynthesis: Atk 229/251, SpA 229/251, Spe 321/353
  Item: **free**
  STAB: Fairy Misty Explosion 100S **[power — the user **faints**]** · Psychic Psychic 90S
  Physical coverage: Normal Double-Edge 120P, Ground Dig 100 (charge)P, Dark Crunch 80P, Fighting Drain Punch 75P, Fire Fire Punch 75P, Ice Ice Punch 75P
  Special coverage: Normal Boomburst 140S, Ice Blizzard 120S, Fire Fire Blast 120S, Fighting Focus Blast 120S, Electric Thunder 120S, Grass Grass Knot 60S

**Stakataka** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Rock/Steel | BST 570 (61/131/211/53/101/13) | Abilities: Beast Boost
  Engine stats @252 (neutral/positive): Beast Boost: Atk 361/397, SpA 205/225, Spe 125/137
  Item: **free**
  STAB: Rock Stone Edge 100P · Steel Steel Roller 130P **[conditional — fails with no terrain up]**
  Physical coverage: Normal Double-Edge 120P, Fire Heat Crash 120P, Fighting Superpower 120P, Ground Earthquake 100P, Psychic Zen Headbutt 80P, Dark Brutal Swing 60P
  Special coverage: Normal Hidden Power 60S, Bug Infestation 20S

**Staraptor** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Normal/Flying | BST 485 (85/120/70/50/60/100) | Abilities: Intimidate / Reckless
  Engine stats @252 (neutral/positive): Intimidate: Atk 339/372, SpA 199/218, Spe 299/328 — Reckless: Atk 339/372, SpA 199/218, Spe 299/328
  Item: **free** — but its own Staraptite is **refused in NU** (it would make Staraptor-Mega, UU)
  STAB: Normal Double-Edge 120P · Flying Sky Attack 140 (charge)P
  Physical coverage: Fighting Close Combat 120P, Steel Steel Wing 70P, Bug U-turn 70P, Dark Thief 60P, Ghost Astonish 30P
  Special coverage: Fire Heat Wave 100S, Ghost Ominous Wind 60S, Bug Struggle Bug 50S **[power — only reachable when no other move can be selected]**, Dragon Twister 40S, Ground Mud-Slap 20S, Fighting Final Gambit fixedS **[power — deals the user’s current HP and the user **faints**]**

**Starmie** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Water/Psychic | BST 520 (60/75/85/100/85/115) | Abilities: Illuminate / Natural Cure / Analytic
  Engine stats @252 (neutral/positive): Illuminate: Atk 249/273, SpA 299/328, Spe 329/361 — Natural Cure: Atk 249/273, SpA 299/328, Spe 329/361 — Analytic: Atk 249/273, SpA 299/328, Spe 329/361
  Item: **free** — but its own Starminite is **refused in NU** (it would make Starmie-Mega, UU)
  STAB: Water Hydro Pump 120S · Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]**
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Ice Avalanche 60P **[power — doubles to 120 if the user was hit first this turn]**, Rock Rollout 30P, Steel Gyro Ball 14P
  Special coverage: Ice Blizzard 120S, Electric Thunder 120S, Rock Meteor Beam 120 (charge)S, Fairy Dazzling Gleam 80S, Steel Flash Cannon 80S, Normal Tri Attack 80S

**Sylveon** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Fairy | BST 525 (95/65/65/110/130/60) | Abilities: Cute Charm / Pixilate
  Engine stats @252 (neutral/positive): Cute Charm: Atk 229/251, SpA 319/350, Spe 219/240 — Pixilate: Atk 229/251, SpA 319/350, Spe 219/240
  Item: **free**
  STAB: Fairy Misty Explosion 100S **[power — the user **faints**]**
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Bite 60P, Grass Trailblaze 50P
  Special coverage: Normal Trump Card 200S **[power — power rises as its PP falls; quoted at full PP]**, Psychic Synchronoise 120S, Ghost Shadow Ball 80S, Fire Mystical Fire 75S, Grass Magical Leaf 60S, Ground Mud-Slap 20S

**Tauros-Paldea-Aqua** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Fighting/Water | BST 490 (75/110/105/30/70/100) | Abilities: Intimidate / Anger Point / Cud Chew
  Engine stats @252 (neutral/positive): Intimidate: Atk 319/350, SpA 159/174, Spe 299/328 — Anger Point: Atk 319/350, SpA 159/174, Spe 299/328 — Cud Chew: Atk 319/350, SpA 159/174, Spe 299/328
  Item: **free**
  STAB: Fighting Close Combat 120P · Water Wave Crash 120P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Bug Megahorn 120P, Dragon Outrage 120P, Ground Earthquake 100P, Steel Iron Tail 100P, Rock Stone Edge 100P
  Special coverage: Ice Blizzard 120S, Fire Fire Blast 120S, Electric Thunder 120S, Grass Solar Beam 120 (charge)S, Normal Uproar 90S, Ghost Shadow Ball 80S

**Tentacruel** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water/Poison | BST 515 (80/70/65/80/120/100) | Abilities: Clear Body / Liquid Ooze / Rain Dish
  Engine stats @252 (neutral/positive): Clear Body: Atk 239/262, SpA 259/284, Spe 299/328 — Liquid Ooze: Atk 239/262, SpA 259/284, Spe 299/328 — Rain Dish: Atk 239/262, SpA 259/284, Spe 299/328
  Item: **free**
  STAB: Water Hydro Pump 120S · Poison Gunk Shot 120P
  Physical coverage: Normal Skull Bash 130P **[RedGPT: single-turn here — it is **absent from `Mechanics.CHARGE_MOVES`**, so it does not charge]**, Dark Throat Chop 80P, Bug Skitter Smack 70P
  Special coverage: Ice Blizzard 120S, Normal Wring Out 120S **[power — scales with the target’s **current** HP; quoted against a full-HP target]**, Fairy Dazzling Gleam 80S, Grass Giga Drain 75S, Ghost Hex 65S, Ground Mud Shot 55S

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
  Physical coverage: Normal Explosion 250P **[power — the user **faints**]**, Ghost Astonish 30P, Dark Beat Up 10P **[power — one hit per healthy team member, off each of their Attack stats]**
  Special coverage: Normal Hyper Voice 90S, Steel Flash Cannon 80S, Bug Signal Beam 75S, Water Water Pulse 60S, Psychic Mirror Coat fixedS **[conditional — needs a **special** hit taken from that target this turn]**

**Vaporeon** — species, **NU**, source: imported (natdex-RU refined by gen9)
  Water | BST 525 (130/65/60/110/95/65) | Abilities: Water Absorb / Hydration
  Engine stats @252 (neutral/positive): Water Absorb: Atk 229/251, SpA 319/350, Spe 229/251 — Hydration: Atk 229/251, SpA 319/350, Spe 229/251
  Item: **free**
  STAB: Water Hydro Pump 120S
  Physical coverage: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]**, Fighting Double Kick 50x2P, Steel Iron Tail 100P, Ground Dig 100 (charge)P, Dark Bite 60P, Grass Trailblaze 50P
  Special coverage: Normal Trump Card 200S **[power — power rises as its PP falls; quoted at full PP]**, Ice Blizzard 120S, Psychic Synchronoise 120S, Fairy Alluring Voice 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S

**Xatu** — species, **NU**, source: imported (natdex-RU refined by gen8)
  Psychic/Flying | BST 470 (65/75/70/95/70/95) | Abilities: Synchronize / Early Bird / Magic Bounce
  Engine stats @252 (neutral/positive): Synchronize: Atk 249/273, SpA 289/317, Spe 289/317 — Early Bird: Atk 249/273, SpA 289/317, Spe 289/317 — Magic Bounce: Atk 249/273, SpA 289/317, Spe 289/317
  Item: **free**
  STAB: Psychic Future Sight 120S · Flying Sky Attack 140 (charge)P
  Physical coverage: Normal Double-Edge 120P, Dark Foul Play 95P, Steel Steel Wing 70P, Bug U-turn 70P
  Special coverage: Grass Solar Beam 120 (charge)S, Fire Heat Wave 100S, Fairy Dazzling Gleam 80S, Ghost Shadow Ball 80S, Bug Signal Beam 75S, Normal Hidden Power 60S

### Closest RU entries by role, typing and BST — Pirouette

**Meloetta-Pirouette** — Normal/Fighting, BST 600 (100/128/90/77/77/128), Serene Grace, item free
Roles: recovery, pivot, setup, priority, cleric, status | STAB: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]** · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** | Recovery: Rest | Priority: Quick Attack 40P Normal (+1)

Closest **RU** entries by shared role, typing and BST band — what it would be competing with:

| RU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Meloetta-Pirouette | Normal/Fighting | 600 (100/128/90/77/77/128) | Serene Grace | recovery, pivot, setup, priority, cleric, status | Rest | Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]** · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Gallade | Psychic/Fighting | 518 (68/125/65/65/115/80) | Steadfast, Sharpness, Justified | recovery, pivot, setup, priority, cleric, status | Rest | Psychic Zen Headbutt 80P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Sirfetch’d | Fighting | 507 (62/135/95/68/82/65) | Steadfast, Scrappy | removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest, Roost | Fighting Close Combat 120P |
| Absol-Mega | Dark | 565 (65/150/60/115/60/115) | Magic Bounce | recovery, pivot, setup, priority, cleric, status | Rest | Dark Foul Play 95P |
| Absol-Mega-Z | Dark/Ghost | 565 (65/154/60/75/60/151) | Sharpness | recovery, pivot, setup, priority, cleric, status | Rest | Dark Foul Play 95P · Ghost Shadow Claw 70P |

### Closest NU entries — Pirouette, if the gate moved down

**Meloetta-Pirouette** — Normal/Fighting, BST 600 (100/128/90/77/77/128), Serene Grace, item free
Roles: recovery, pivot, setup, priority, cleric, status | STAB: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]** · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** | Recovery: Rest | Priority: Quick Attack 40P Normal (+1)

Closest **NU** entries by shared role, typing and BST band — what it would be competing with:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Meloetta | Normal/Psychic | 600 (100/77/77/128/128/90) | Serene Grace | recovery, pivot, setup, priority, cleric, status | Rest | Normal Hyper Voice 90S · Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]** |
| Pawmot | Electric/Fighting | 490 (70/115/70/70/60/105) | Volt Absorb, Natural Cure, Iron Fist | recovery, pivot, setup, priority, cleric, status | Rest | Electric Double Shock 120P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Articuno-Galar | Psychic/Flying | 580 (90/85/85/125/100/95) | Competitive | removal, recovery, pivot, setup, priority, phazing, cleric, status | Recover, Rest, Roost | Psychic Future Sight 120S · Flying Sky Attack 140 (charge)P |
| Decidueye-Hisui | Grass/Fighting | 530 (88/112/80/95/95/60) | Overgrow, Scrappy | removal, recovery, pivot, setup, priority, status | Rest, Roost | Grass Leaf Storm 140S · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Espeon | Psychic | 525 (65/65/60/130/95/110) | Synchronize, Magic Bounce | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Psychic Future Sight 120S |

### Closest UU entries — Pirouette, if the gate moved up

**Meloetta-Pirouette** — Normal/Fighting, BST 600 (100/128/90/77/77/128), Serene Grace, item free
Roles: recovery, pivot, setup, priority, cleric, status | STAB: Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]** · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** | Recovery: Rest | Priority: Quick Attack 40P Normal (+1)

Closest **UU** entries by shared role, typing and BST band — what it would be competing with:

| UU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Blissey | Normal | 540 (255/10/10/75/135/55) | Natural Cure, Serene Grace, Healer | hazards, recovery, pivot, setup, cleric, status | Rest, Soft-Boiled | Normal Hyper Voice 90S |
| Gardevoir-Mega | Psychic/Fairy | 618 (68/85/65/165/135/100) | Pixilate | recovery, pivot, setup, priority, cleric, status | Rest | Psychic Future Sight 120S · Fairy Hyper Voice 117S |
| Keldeo | Water/Fighting | 580 (91/72/90/129/90/108) | Justified | recovery, pivot, setup, priority, phazing, status | Rest | Water Hydro Pump 120S · Fighting Focus Blast 120S |
| Mew | Psychic | 600 (100/100/100/100/100/100) | Synchronize | hazards, removal, recovery, pivot, setup, priority, phazing, cleric, status | Rest, Roost, Soft-Boiled | Psychic Future Sight 120S |
| Raichu-Mega-Y | Electric | 585 (60/100/55/160/80/130) | No Guard | recovery, pivot, setup, priority, cleric, status | Rest | Electric Thunder 120S |

### Closest NU entries — Meloetta itself, where it sits today

**Meloetta** — Normal/Psychic, BST 600 (100/77/77/128/128/90), Serene Grace, item free
Roles: recovery, pivot, setup, priority, cleric, status | STAB: Normal Hyper Voice 90S · Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]** | Recovery: Rest | Priority: Quick Attack 40P Normal (+1)

Closest **NU** entries by shared role, typing and BST band — what it would be competing with:

| NU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Meloetta | Normal/Psychic | 600 (100/77/77/128/128/90) | Serene Grace | recovery, pivot, setup, priority, cleric, status | Rest | Normal Hyper Voice 90S · Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]** |
| Articuno-Galar | Psychic/Flying | 580 (90/85/85/125/100/95) | Competitive | removal, recovery, pivot, setup, priority, phazing, cleric, status | Recover, Rest, Roost | Psychic Future Sight 120S · Flying Sky Attack 140 (charge)P |
| Espeon | Psychic | 525 (65/65/60/130/95/110) | Synchronize, Magic Bounce | recovery, pivot, setup, priority, phazing, cleric, status | Rest | Psychic Future Sight 120S |
| Xatu | Psychic/Flying | 470 (65/75/70/95/70/95) | Synchronize, Early Bird, Magic Bounce | removal, recovery, pivot, setup, priority, cleric, status | Rest, Roost | Psychic Future Sight 120S · Flying Sky Attack 140 (charge)P |
| Scream Tail | Fairy/Psychic | 570 (115/65/99/65/115/111) | Protosynthesis | hazards, recovery, pivot, setup, phazing, cleric, status | Rest | Fairy Misty Explosion 100S **[power — the user **faints**]** · Psychic Psychic 90S |

### Closest RU entries — Meloetta, if it moved up with its forme

**Meloetta** — Normal/Psychic, BST 600 (100/77/77/128/128/90), Serene Grace, item free
Roles: recovery, pivot, setup, priority, cleric, status | STAB: Normal Hyper Voice 90S · Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]** | Recovery: Rest | Priority: Quick Attack 40P Normal (+1)

Closest **RU** entries by shared role, typing and BST band — what it would be competing with:

| RU entry | Types | BST (spread) | Abilities | Roles | Recovery | STAB |
| --- | --- | --- | --- | --- | --- | --- |
| Celebi | Psychic/Grass | 600 (100/100/100/100/100/100) | Natural Cure | hazards, recovery, pivot, setup, priority, cleric, status | Recover, Rest | Psychic Future Sight 120S · Grass Leaf Storm 140S |
| Latias | Dragon/Psychic | 600 (80/80/90/110/130/110) | Levitate | removal, recovery, pivot, setup, priority, phazing, cleric, status | Recover, Rest, Roost | Dragon Draco Meteor 140S · Psychic Future Sight 120S |
| Meloetta-Pirouette | Normal/Fighting | 600 (100/128/90/77/77/128) | Serene Grace | recovery, pivot, setup, priority, cleric, status | Rest | Normal Last Resort 140P **[conditional — fails until **every other move in the set** has been used]** · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |
| Meowstic-M-Mega | Psychic | 566 (74/48/76/143/101/124) | Trace | recovery, pivot, setup, priority, cleric, status | Rest | Psychic Dream Eater 100S **[RedGPT: no sleep condition in RedGPT — it is an ordinary 100 BP draining move]** |
| Gallade | Psychic/Fighting | 518 (68/125/65/65/115/80) | Steadfast, Sharpness, Justified | recovery, pivot, setup, priority, cleric, status | Rest | Psychic Zen Headbutt 80P · Fighting Focus Punch 150P **[RedGPT: no Substitute condition and **priority 0** in RedGPT; it pays with 70% accuracy]** |

---

## MEL9. The gate, exercised through the real validator

Meloetta with Relic Song, and the same set without it, put through
`Validation.validateTeam` in **every** format:

| Format | Meloetta **with** Relic Song | Meloetta **without** it |
| --- | --- | --- |
| Anything Goes | **legal** | **legal** |
| Random Battle | Random Battle requires at least 6 Pokémon; this team has 1. Set 1 (Meloetta): Meloetta is a restricted Pokémon and is not legal in Random Battle. | Random Battle requires at least 6 Pokémon; this team has 1. Set 1 (Meloetta): Meloetta is a restricted Pokémon and is not legal in Random Battle. |
| Ubers | **legal** | **legal** |
| Ubers (Tera) | **legal** | **legal** |
| OverUsed | **legal** | **legal** |
| OverUsed (Tera) | **legal** | **legal** |
| UnderUsed | **legal** | **legal** |
| RarelyUsed | **legal** | **legal** |
| NeverUsed | Set 1 (Meloetta): Relic Song is banned in NeverUsed — it turns Meloetta into Meloetta-Pirouette, which is RU. Meloetta itself is legal here without it. | **legal** |
| PU | Set 1 (Meloetta): Meloetta is NU tier and is not legal in PU. Set 1 (Meloetta): Relic Song is banned in PU — it turns Meloetta into Meloetta-Pirouette, which is RU. Meloetta itself is legal here without it. | Set 1 (Meloetta): Meloetta is NU tier and is not legal in PU. |
| ZU | Set 1 (Meloetta): Meloetta is NU tier and is not legal in ZU. Set 1 (Meloetta): Relic Song is banned in ZU — it turns Meloetta into Meloetta-Pirouette, which is RU. Meloetta itself is legal here without it. | Set 1 (Meloetta): Meloetta is NU tier and is not legal in ZU. |

**Read the two columns together.** The gate refuses the *move* and keeps the
*Pokémon*, which is the whole design — in NU, Meloetta is legal and Relic Song is
not. In PU and ZU both fail, but for different reasons: the species is out of
tier **and** the move is refused.

**Every move-driven forme route on the entire ladder:**

| Rung | From | Move | To | Target tier |
| --- | --- | --- | --- | --- |
| RU | Meloetta-Pirouette | Relic Song | Meloetta | NU |
| NU | Meloetta | Relic Song | Meloetta-Pirouette | RU |

**2 routes, and both of them are Meloetta's** — the second is the toggle back,
which `illegalFormeMoves` filters out because a route to a *lower* tier is no
threat to a format. So the move half of the forme gate exists for exactly one
Pokémon, and this audit is the whole of its subject matter.

**One asymmetry with the ability half, deliberate and worth knowing:**
`formeAbilities` requires the base to have **two** abilities, because refusing
the only one would delete the Pokémon. **A move ban never can**, so `formeMoves`
has no such guard — which is why Relic Song can be refused even though Serene
Grace, Meloetta's only ability, cannot be.

---

## MEL10. Remaining genuinely unresolved questions (Part II)

1. **Neither forme has ever been played, by anybody.** Relic Song was implemented
   this session. There is no usage, ladder or win-rate data in RedGPT for any
   tier, so every judgement here is mechanical.
2. **Pirouette's RU tier was never a judgement.** It was assigned during the NU
   pass as roster bookkeeping, when nothing could reach the forme, and the pass
   said so explicitly. Treat it as an **unreviewed default**, not as a prior.
3. **The AI has never been taught about the transform.** Whether `ai.js` values
   Relic Song as a forme change rather than as a 75 BP sound move is not measured
   here and does not bear on legality, but it does bear on how the forme performs
   against a computer opponent.
4. **Last Resort's condition is annotated but its practical value is not
   measured.** It is 140 BP Normal STAB that arrives on turn four at the earliest.
   Whether a four-slot set can afford to enable it — alongside Relic Song, which
   already takes a slot — is a set-building question the packet does not answer.
5. **The matrices assume the transform has already happened.** They do not charge
   the turn, the moveslot or the Special Attack loss that section MEL5 itemises.
   Those are stated separately so they can be weighed rather than buried in a
   damage number.
6. **Sleep Clause interacts with the 20% secondary and is not modelled here.**
   One sleeper per battle is the rule in every tier format; whether that makes
   the secondary a tempo tool or a win condition is a judgement.
7. **A Choice Scarf Aria may simply be the better set**, and this packet does not
   settle it. The numbers to compare are in MEL5 and MEL6.

**If a number you need is missing, ask for it** rather than estimating. Any
damage, speed, forme, legality or probability question can be answered against
the real engine.