# Pokémon RedGPT — how it differs from Pokémon Showdown

**Purpose of this file.** It is a briefing for an AI assistant (ChatGPT or
similar) that needs to reason about this game correctly. RedGPT is built on the
same upstream data Showdown uses (the `@pkmn` packages), but it deliberately
changes a lot of it. If you answer a RedGPT question from general Pokémon or
Showdown knowledge, you will be wrong in specific, predictable ways.

**The single most important rule:** when RedGPT and the main series disagree,
RedGPT is right *for this game*. Every difference below is a deliberate project
decision with reasoning behind it, not a bug or an incomplete implementation.

Figures in this document were generated from the live data on 2026-08-15 and are
accurate as of that build.

---

## 0. If you are deciding which Ubers Pokémon could drop to OU

This is the immediate task this file was written for. **Read this section
first, then §2, §3, §5 and §7 — they are the ones that change the answer.**

The premise is that **Terastallization does not exist**. In RedGPT that is not a
hypothetical: regular Ubers and regular OverUsed genuinely have Tera off, and
only Anything Goes and the two "(Tera)" variants allow it. So Ubers is currently
ranked by a mechanic its own format does not have.

**Five RedGPT-specific facts that change tiering judgement, and that a
Showdown-trained intuition will get wrong:**

1. **Mega Evolution needs no Key Stone and is on in every format.** Any Pokémon
   holding its own stone is a Mega threat, at no cost. This raises the effective
   power of the *whole* metagame and is the single biggest reason RedGPT's OU is
   not Showdown's SV OU.
2. **Megas are tiered separately from their base species.** "Should Blastoise
   drop to OU" and "should Mega Blastoise drop to OU" are two different
   questions with two different answers — Blastoise-Mega is Ubers while
   Blastoise itself is not.
3. **Several abilities are stronger than Showdown's**, which raises the floor a
   dropped Pokémon has to compete against: Parental Bond's second hit is 50%,
   Transistor is 1.5x, the `-ate` abilities are 1.3x, Gale Wings works at any
   HP, Protean/Libero re-trigger every move, Magic Guard also ignores Toxic
   Spikes and full paralysis.
4. **Eleven species keep pre-nerf base stats** (§8) — Aegislash at 150/150
   defences, Zacian at 138 Speed, the Treasures of Ruin. And **every species
   keeps every ability it has ever had**, so Gengar has Levitate and the Litwick
   line has Shadow Tag.
5. **Five priority moves are unconditional** — Sucker Punch, Thunderclap, First
   Impression, Upper Hand and Grassy Glide all work with no condition. Revenge
   killing is far more reliable here, which suppresses frail setup sweepers.

**A caution on the roster below.** Some entries are Ubers for reasons Tera never
touched (Kyogre, Groudon, Rayquaza, Arceus, Zacian, Mewtwo, the Necrozmas — all
of them predate Tera by generations). Others are recent additions whose case
leans on Tera much more heavily.

**Splitting Ubers by generation is the fastest first cut, because Tera is a
Generation 9 mechanic.** Of the 63 Ubers species, **46 predate Generation 9** and
were Ubers-worthy long before Tera existed — removing Tera cannot be the argument
for dropping any of them.

The **17 Generation 9 Ubers species** are where the real question lives:

> Annihilape, Baxcalibur, Chi-Yu, Chien-Pao, Espathra, Flutter Mane, Gouging
> Fire, Iron Bundle, Koraidon, Miraidon, Ogerpon-Hearthflame,
> Ogerpon-Hearthflame-Tera, Palafin, Roaring Moon, Terapagos-Stellar,
> Ursaluna-Bloodmoon, Walking Wake

Even within that list, several are Ubers on raw merit rather than on Tera —
Koraidon and Miraidon (box legendaries), Flutter Mane, Chi-Yu and Chien-Pao (the
Ruin abilities), Iron Bundle, Palafin (Hero forme's 160 Attack), and
Terapagos-Stellar. **Ogerpon-Hearthflame-Tera is a special case: that forme only
exists through Terastallizing, so in a no-Tera format it is unreachable rather
than merely weaker.**

### The current Ubers roster — 88 entries

**Species (63):** Annihilape, Arceus, Baxcalibur, Calyrex-Ice, Calyrex-Shadow,
Chi-Yu, Chien-Pao, Darkrai, Darmanitan-Galar, Darmanitan-Galar-Zen, Deoxys,
Deoxys-Attack, Deoxys-Speed, Dialga, Dracovish, Dragapult, Espathra, Eternatus,
Flutter Mane, Genesect, Giratina, Gouging Fire, Groudon, Ho-Oh, Iron Bundle,
Koraidon, Kyogre, Kyurem-Black, Kyurem-White, Landorus, Lugia, Lunala, Magearna,
Magearna-Original, Marshadow, Mewtwo, Miraidon, Naganadel, Necrozma-Dawn-Wings,
Necrozma-Dusk-Mane, Necrozma-Ultra, Ogerpon-Hearthflame,
Ogerpon-Hearthflame-Tera, Palafin, Palkia, Pheromosa, Rayquaza, Reshiram,
Roaring Moon, Shaymin-Sky, Sneasler, Solgaleo, Spectrier, Terapagos-Stellar,
Ursaluna-Bloodmoon, Urshifu, Walking Wake, Xerneas, Yveltal, Zacian, Zekrom,
Zygarde, Zygarde-Complete

**Mega / Primal / Origin formes (25):** Alakazam-Mega, Baxcalibur-Mega\*,
Blastoise-Mega, Blaziken-Mega, Darkrai-Mega\*, Dialga-Origin, Gengar-Mega,
Giratina-Origin, Glimmora-Mega\*, Groudon-Primal, Hawlucha-Mega\*,
Kangaskhan-Mega, Kyogre-Primal, Lucario-Mega, Magearna-Mega\*, Metagross-Mega,
Mewtwo-Mega-X, Mewtwo-Mega-Y, Palafin-Hero, Palkia-Origin, Rayquaza-Mega,
Salamence-Mega, Zacian-Crowned, Zamazenta-Crowned, Zygarde-Mega\*

`*` marks a forme Smogon has never ranked; its tier is a nearest-neighbour
estimate by this project, so it is the softest evidence on the list and the
easiest to move.

**Six of these were Anything Goes until 2026-08-15** and were moved down to Ubers
on exactly the reasoning in question — without Tera, the ceiling they were
breaking is not the ceiling they now play under: Xerneas, Calyrex-Shadow,
Koraidon, Miraidon, Gengar-Mega, Rayquaza-Mega. The AG tier is now empty.

### The current OU roster — 87 entries, for calibration

**Species (60):** Alomomola, Blaziken, Ceruledge, Cinderace, Clodsire,
Corviknight, Dondozo, Dragonite, Ferrothorn, Garchomp, Gholdengo, Gliscor, Great
Tusk, Greninja, Gyarados, Hatterene, Hawlucha, Heatran, Hoopa-Unbound, Iron
Crown, Iron Hands, Iron Moth, Iron Treads, Iron Valiant, Kartana, Kingambit,
Kommo-o, Kyurem, Landorus-Therian, Latios, Manaphy, Melmetal, Meowscarada,
Moltres, Ogerpon-Cornerstone, Ogerpon-Cornerstone-Tera, Ogerpon-Wellspring,
Ogerpon-Wellspring-Tera, Okidogi, Pecharunt, Raging Bolt, Rillaboom,
Samurott-Hisui, Slowbro, Slowking-Galar, Tapu Koko, Tapu Lele, Terapagos,
Terapagos-Terastal, Thundurus-Therian, Ting-Lu, Tornadus-Therian, Toxapex,
Urshifu-Rapid-Strike, Volcarona, Weavile, Xurkitree, Zamazenta, Zapdos,
Zapdos-Galar

**Formes (27):** Barbaracle-Mega\*, Charizard-Mega-X, Charizard-Mega-Y,
Chesnaught-Mega\*, Clefable-Mega\*, Diancie-Mega, Dragonite-Mega\*,
Excadrill-Mega\*, Feraligatr-Mega\*, Gallade-Mega, Garchomp-Mega,
Garchomp-Mega-Z\*, Golisopod-Mega\*, Greninja-Mega\*, Gyarados-Mega,
Heatran-Mega\*, Latios-Mega, Lopunny-Mega, Lucario-Mega-Z\*, Mawile-Mega,
Medicham-Mega, Pinsir-Mega, Scizor-Mega, Scolipede-Mega\*, Skarmory-Mega\*,
Tyranitar-Mega, Zeraora-Mega\*

Note that **OU already contains Mega Charizard X/Y, Mega Garchomp, Mega Lucario-Z
and Mega Medicham** — so "OU" here is a considerably higher-powered format than
SV OU, and a Pokémon dropping into it faces that.

### Entries where Tera is *not* the reason they are Ubers

These are poor candidates for a drop, whatever happens to Tera. They are Ubers
for raw stats, a signature ability, or a signature move: Kyogre, Groudon,
Rayquaza, Arceus, Mewtwo, Lugia, Ho-Oh, Dialga, Palkia, Giratina, Zacian,
Eternatus, the three Necrozmas, Lunala, Solgaleo, Xerneas, Yveltal, Zygarde and
Zygarde-Complete, Koraidon, Miraidon, Deoxys and its formes, Calyrex-Ice and
Calyrex-Shadow, Flutter Mane, Chi-Yu and Chien-Pao (the Ruin abilities, not
Tera), Iron Bundle, Terapagos-Stellar, and every Primal or Origin forme.

That leaves a much smaller set of genuine candidates to argue about — mostly
Generation 9 entries whose sets lean on Tera to break their own checks. Judge
those against the OU roster above, remembering that OU here already hosts a
dozen Mega Evolutions available for free.

---

## 1. At a glance

| Thing | Value |
| --- | --- |
| Selectable species and formes | 1,144 (1,269 packaged — the rest are transformation-only) |
| Moves | 827 |
| Abilities | 316 — 294 implemented, 22 inert by design, **0 unimplemented** |
| Held items | 560 — 310 implemented, 250 inert by design, **0 unimplemented** |
| Formats | 11 |
| Battle format | **Singles only.** No doubles, triples, VGC, or multi-battles |

Two game modes share one engine:

- **Arena** — a competitive simulator: Team Builder, text import/export, formats,
  four AI difficulties, local versus, seeded battles, reproducible replays.
- **Campaign** — a seeded roguelite: starter draft, branching three-Act map,
  recruitment, evolution, shops, relics, bosses, and a Rebirth mode.

Everything is offline and deterministic. Battles run from a seed; replays are a
seed plus a command list and are re-simulated rather than played back.

---

## 2. Formats and tiering — large divergence

RedGPT does **not** have Showdown's format list. There is no OU/Ubers "ladder"
in the Showdown sense, no VGC, no Little Cup, no Monotype, no randoms beyond one
Random Battle preset.

The eleven formats are:

| Format | Notes |
| --- | --- |
| **OverUsed** | **The default format.** OU and below |
| Ubers, UnderUsed, RarelyUsed, NeverUsed, PU, ZU | The rest of the ladder |
| **Ubers (Tera)**, **OverUsed (Tera)** | Identical rulesets with Terastallization on |
| Anything Goes | No species restrictions at all |
| Random Battle | Generated teams for both sides |

**There is no "Standard Singles"**, and no format gates on a hand-built
power-class list. Tiering is Smogon's **National Dex** tiers, imported from the
packaged data — never measured or invented by this project. Nat Dex is used
because it is the format that still has Mega Evolution.

Key tiering rules that differ from a naive reading:

- **Ladders are cumulative-downward.** OU admits OU, UU, RU, NU, PU and ZU.
- **Banlists roll upward.** `UUBL` means "banned from UU", so it plays in OU.
- **NFE and LC are discarded.** Unevolved Pokémon carry no tier and are illegal
  in every tier format. They remain fully playable in Anything Goes. Note this is
  not "every unevolved Pokémon is untiered" — Smogon ranks a few on the main
  ladder (Chansey UU, Bisharp UU, Duraludon NU, Pikachu ZU) and those keep their
  tier.
- **Mega Evolutions are tiered individually, separately from their base
  species.** Charizard is ZU; Charizard-Mega-X and Mega-Y are both OU. Absol is
  PU; Mega Absol is RU. Enforcement bans **the item, not the Pokémon** — Absol
  plays in PU and simply may not hold Absolite there.
- **The AG tier is empty.** Its six members (Xerneas, Calyrex-Shadow, Koraidon,
  Miraidon, Mega Gengar, Mega Rayquaza) were moved to Ubers by project decision,
  because RedGPT's regular Ubers has no Terastallization and the ceiling they
  were breaking is not the ceiling they now play under.

**Terastallization is legal in only three formats**: Anything Goes, Ubers (Tera)
and OverUsed (Tera). Every other format, including Random Battle, has it off.
Campaign has it on. This is the largest single balance divergence from Showdown,
where Tera is standard in SV formats.

Current tier sizes (entries belonging to that exact tier, Megas included):
AG 0 · Ubers 88 · OU 87 · UU 72 · RU 126 · NU 65 · PU 70 · ZU 253.

---

## 3. Mega Evolution — large divergence

**Mega Evolution is a real in-battle mechanic, and it needs no Key Stone.**
Holding the species' own Mega Stone is sufficient. Rayquaza is the exception the
games also make: it Mega Evolves by knowing Dragon Ascent, with no item at all.

- Enabled by `rules.mega`, which is **on in every format**, including Campaign.
- Declared once per side per battle on the move choice, exactly like Tera.
- It resolves **before actions are ordered**, so the Mega forme's Speed decides
  who moves first that turn.
- The stone is never consumed and **cannot be removed** — Knock Off, Trick,
  Switcheroo, Thief, Covet, Corrosive Gas, Magician, Pickpocket and Fling are all
  refused.
- The Mega forme's ability replaces the holder's and its `onStart` fires, so Mega
  Charizard Y really does set sun on Mega Evolving.
- The forme persists across switches for the rest of the battle.

**Mega formes are not selectable species.** They do not appear in the Team
Builder, the Pokédex species list, or any format pool. The only route is the base
forme holding the stone.

---

## 4. Formes — significant divergence

### There is one Arceus and one Silvally

Their typed formes are **a held item, not a species choice**. Base Arceus holding
a Splash Plate *is* Arceus-Water; Multitype reads the Plate and RKS System reads
the Memory, and the engine changes the forme on entry. The 17 typed formes of
each are packaged and reachable but not selectable, exactly like Mega formes.

### Held items that change forme on entry

`Red Orb`, `Blue Orb`, `Rusted Sword`, `Rusted Shield`, `Griseous Orb`,
`Griseous Core`, `Adamant Crystal`, `Lustrous Globe` and the project's own
`Hero Charm`. These:

- apply the moment the holder is on the field — no declaration, no once-per-side
  limit, no interaction with the Mega slot;
- run **before entry hazards**, because the new typing is what hazards measure
  against (Groudon takes 12.5% from Stealth Rock, Primal Groudon 25%);
- cannot be removed;
- unlike Megas, these formes **stay selectable species**.

### Ability-driven formes

Stance Change, Zen Mode, Schooling, Power Construct, Forecast, Flower Gift,
Hunger Switch, Terashift, Multitype, RKS System, Disguise and Ice Face are all
implemented. Disguise and Ice Face show the busted sprite.

### Zero to Hero is redesigned as an item

Transforming on switching *out* is invisible and cannot be planned around, so
Palafin now holds the **Hero Charm** and enters battle in Hero Form. The ability
itself has no effect.

---

## 5. Abilities — many deliberate changes

RedGPT restores several abilities to earlier, stronger behaviour, and redesigns
others outright. In-game descriptions always reflect RedGPT behaviour, not the
official text.

### Restored to pre-nerf behaviour

| Ability | RedGPT behaviour |
| --- | --- |
| Magic Guard | Also immune to Toxic Spikes poisoning and to full paralysis |
| Parental Bond | Second hit at **50%** power, not 25%, still a separate hit |
| Gale Wings | Flying-move priority at **any HP** |
| Aerilate / Pixilate / Refrigerate | **1.3x** on converted moves, not 1.2x |
| Transistor | **1.5x** on Electric moves, not 1.3x |
| Disguise | Breaking the disguise costs **no HP** |
| Protean / Libero | Re-trigger before **every** qualifying move |
| Intrepid Sword / Dauntless Shield | Boost on **every** entry, not once per battle |
| Battle Bond | Legacy Ash-Greninja transformation on a KO |
| Mold Breaker / Turboblaze / Teravolt | Also ignore Dark Aura and Fairy Aura |

### Redesigned outright

| Ability | RedGPT behaviour |
| --- | --- |
| **Cloud Nine / Air Lock** | **Delete** the active weather on entry rather than suppressing it |
| **Supreme Overlord** | +1 Attack on entry; no fallen-ally scaling |
| **Download** | Always +1 Attack **and** +1 Sp. Atk; never a comparison |
| **Heatproof** | A full **Fire immunity**, not a halving |
| **Light Metal** | +1 Speed on entry (keeps the weight halving) |
| **Heavy Metal** | −2 Speed, +1 Defence, +1 Attack on entry (keeps the doubling) |
| **Pickup** | On entry, takes the last item **destroyed** this battle. Berries excluded |
| **Magician / Pickpocket** | Steal into an occupied slot; the holder's own item is discarded |
| **Delta Stream** | Strong winds **and** deletes the active weather on entry |
| **Curious Medicine** | Resets the **opposing** Pokémon's stat stages (it has no ally in singles) |
| **Hospitality** | Restores 1/4 max HP to the most injured teammate **on the bench** |
| **Supersweet Syrup** | Lowers the foe's evasiveness on **every** entry, not once per battle |
| **Poison Puppeteer / Teraform Zero** | Their "only if Pecharunt / Terapagos" clauses are dropped |
| **Revelation Dance's category rule** | See §7 |

### Deliberately *not* restored

Drought, Drizzle, Sand Stream and Snow Warning keep their **finite** duration.
Shadow Tag, Arena Trap, Magnet Pull, Effect Spore, Prankster, Moody, Intimidate
and Trace all keep their modern rules. Galvanize keeps 1.2x, because it was
introduced *after* the `-ate` nerf and never had 1.3x to roll back to.

### Legends: Z-A abilities

Six are implemented and reached through Mega formes: **Dragonize**
(Mega Feraligatr), **Eelevate** (Mega Eelektross), **Fire Mane** (Mega Pyroar),
**Mega Sol** (Mega Meganium), **Piercing Drill** (Mega Excadrill) and **Spicy
Spray** (Mega Scovillain).

- **Dragonize keeps 1.2x**, for Galvanize's reason.
- **Eelevate is not an `-ate` ability** despite the name — it is Levitate plus
  Beast Boost.
- **Mega Sol** gives only its holder's own moves a "sun" reading; it does not set
  weather and nothing else on the field sees it.
- **Piercing Drill** breaks Protect but a hit that had to break through deals
  **a quarter** damage.

### Inert by design (22)

Ball Fetch, Battery, Commander, Dancer, Friend Guard, Gorilla Tactics, Gulp
Missile, Honey Gather, Illusion, Imposter, Mimicry, Minus, Plus, Power of
Alchemy, Power Spot, Propeller Tail, Receiver, Run Away, Stalwart, Stench,
Symbiosis, Telepathy. Mostly doubles-only redirection or out-of-battle effects
with no singles analogue.

---

## 6. Items — redesigns and inventions

### Redesigned

| Item | RedGPT behaviour |
| --- | --- |
| **Ring Target** | Reversed. The **holder's attacks** hit for neutral damage through a target's *type* immunity, instead of stripping the holder's own immunities. Type immunity only — it does not beat Levitate or Flash Fire. **One per team in every format**, and **visible to the opponent from turn one** |
| **Toxic Orb / Flame Orb** | Afflict the holder **on entry**, not at end of turn — so Guts, Poison Heal, Facade and Quick Feet are live on the turn the holder arrives |

### Invented by this project (three)

| Item | Effect |
| --- | --- |
| **Hero Charm** | Palafin enters battle in Hero Form |
| **Warp Prism** | Trick Room *the holder sets* lasts 8 turns instead of 5 |
| **Wind Sock** | Tailwind *the holder sets* lasts 7 turns instead of 4 |

### Generation 2 items are fully implemented

Berry, Gold Berry, PRZ Cure Berry, PSN Cure Berry, Ice Berry, Burnt Berry, Mint
Berry, Bitter Berry, Miracle Berry, Mystery Berry, Berserk Gene, Pink Bow and
Polkadot Bow all work. They are **not** aliases of their modern replacements:
Mystery Berry restores **5** PP where Leppa restores 10, and the two Bows give
Normal moves **1.1x** where every modern type booster gives 1.2x.

### Other item notes

- **Oran Berry fires at 1/4 max HP**, not 1/2 (a long-standing project value).
  The Gen 2 Berry and Gold Berry do use 1/2.
- Z-Moves and Dynamax/Gigantamax are **not simulated at all**. Z-crystals are
  inert.

---

## 7. Moves

### Multi-hit moves are standardised

- Every 2–5 hit move is a flat **25 BP per hit**.
- Every exactly-2-hit move is **50 BP per hit**.
- **Wrap, Bind, Fire Spin and Clamp are 2–5 hit attacks that also still trap.**
- Three-hit moves and Population Bomb are deliberately untouched.

### Base-power restorations

Roll-backs of main-series nerfs, e.g. Dig 100, Draco Meteor 140, Hydro Pump 120,
Thunder/Blizzard/Fire Blast restored, Surf, Flamethrower 95, Ice Beam 95,
Thunderbolt 95, Hurricane 120, Leaf Storm 140, Overheat, Meteor Mash, Sucker
Punch 80, Grassy Glide 70, Glacial Lance, Wicked Blow. **Accuracy, PP and
secondary-effect rates always track upstream** — with one named exception below.

### Conditions removed from moves the *opponent* controlled

The test applied: can the user do anything to satisfy the condition? If not, it
is a coin flip on team preview rather than a trade-off.

- **Dream Eater** no longer needs a sleeping target (keeps its drain).
- **Poltergeist** no longer needs the target to hold an item.
- **Thief** steals even with a full item slot; the user's old item is destroyed.
  **Covet deliberately keeps** the restriction, as the conservative twin.
- **Five priority moves are unconditional**: Sucker Punch, Thunderclap, First
  Impression, Upper Hand (which also loses its flinch) and **Grassy Glide**,
  whose +1 applies with no Grassy Terrain check.
- **Fake Out keeps** its first-turn rule. **Snore** and **Fling** keep theirs,
  because the *user* controls them.

**Focus Punch** is the big one: it lost its "must not be hit" condition **and**
its −3 priority, and costs **70% accuracy** instead. This is the only accuracy
entry in the override table.

### Moves that take their type from the user at use time

Revelation Dance, Judgment, Multi-Attack, Techno Blast, Aura Wheel, Weather Ball,
Terrain Pulse, Ivy Cudgel, Raging Bull — and **Tera Blast**.

- **Tera Blast** takes the user's Tera type when Terastallized, and becomes
  **Physical if the user's Attack exceeds its Special Attack**. Boosts count.
- **Revelation Dance** takes the user's *primary* type — so it follows
  Terastallization, Soak, Conversion and Burn Up — and by project decision it
  **also switches category by the same Attack-vs-Special-Attack rule** (upstream
  it is always Special).

### Other move rules

- **Trick Room, Magic Room and Wonder Room end when used a second time.** Nothing
  else in the game removes one, and this is the counterplay. **Gravity is
  deliberately not self-cancelling.**
- **Dark Void is Darkrai-only**, checked at use time, so copied and called
  versions are blocked too.
- **Destiny Bond** uses the modern consecutive-use failure rule.
- A **rampage that fails releases its lock** (Outrage, Thrash, Petal Dance,
  Rollout, Ice Ball). Being unable to *act* — sleep, paralysis, flinch — pauses
  it instead. A rampage broken early does not confuse its user.

---

## 8. Base stats — eleven species keep pre-nerf spreads

Aegislash (both formes), Cresselia, Zacian and Zamazenta (both formes each), and
all four Treasures of Ruin use their **earlier, stronger** spreads:

- Aegislash 60/50/150/50/150/60 (BST 520)
- Cresselia 120/70/120/75/130/85 (BST 600)
- Zacian 92/130/115/80/115/138 (BST 670)
- Chien-Pao 80/130/80/90/65/135 (BST 580)

Only the six base stats are overridden; typing, learnset, abilities and
evolutions always come from upstream, and BST is recomputed.

**Legends-series stat values are deliberately excluded** (Arceus, Z-A): those
compensate for abilities those games omit, which is not a nerf to reverse.

---

## 9. Move pools, abilities per species, and learnsets

- **Every species keeps every ability it has ever had.** Ability slots are
  unioned across generations 3–8 on top of the current set, so Dream World
  abilities that were later replaced come back: **Gengar keeps Levitate**, the
  Litwick line keeps **Shadow Tag**, Zapdos keeps Lightning Rod, the legendary
  beasts keep their absorbs. 26 species gain one. Only species predating
  Generation 8 qualify.
- Legacy abilities are **appended**, never inserted, because a Mega forme takes
  ability slot 0.
- **Learnsets are upstream** and are not modified.
- **Evolution methods that need another player are converted to solo-friendly
  requirements in the data** (trade evolutions and similar), so every line is
  completable in Campaign.
- **Branching evolutions are a player choice**, not decided by data order — a
  Wurmple is not always a Silcoon, an Eevee not always the first stone form.

---

## 10. Battle mechanics that differ

- **Weather is never "suppressed", only set or cleared.** There is no suppression
  layer; Cloud Nine and Air Lock delete the weather outright.
- **Primal weather is a distinct mechanic.** Desolate Land and Primordial Sea
  make the opposing element **fail outright** (Fire under heavy rain, Water under
  harsh sun) rather than being halved — damaging moves only, so Will-O-Wisp still
  works. Nothing ordinary can replace it, and **Cloud Nine and Air Lock cannot
  remove it**. It has no turn counter and ends when its setter leaves.
  - **Delta Stream and Teraform Zero *can* remove it.** The rule: primal weather
    yields only to a member of the primal trio, or to something that costs its
    user a once-per-battle resource.
- **A Substitute soaks status and stat drops**, not just volatiles. Sound moves
  and Infiltrator still go through, self-targeting is unaffected, contact-punish
  abilities (Static, Flame Body) still fire, and only stat *drops* are soaked —
  Swagger and Flatter still land.
- **Terastallization resolves before any move that turn**, for every side that
  declared it.
- **Berries separate their trigger from their effect**, which makes force-feeding
  possible: Bug Bite, Pluck, Stuff Cheeks, Tea Time and a flung Berry all work.
- **Damage is 0–2 HP below Showdown's calculator** (≤0.5%). This is a known
  rounding-chain difference in `battle.calculateDamage`, not an input error —
  stats match Showdown exactly. It is documented and deliberately unfixed.

---

## 11. What is *not* in the game

No doubles, triples, VGC or multi-battles. No Z-Moves. No Dynamax or
Gigantamax. No breeding, trading or network play. No abilities or items are left
unimplemented — everything is either simulated or inert by explicit design.

---

## 12. Answering questions about this game

- **Do not assume Showdown behaviour.** Check this document first; where it is
  silent, upstream behaviour is the default.
- **Do not assume a Pokémon's Showdown tier.** Tiers here are National Dex, Megas
  are tiered separately, and the AG rung is empty.
- **Do not assume Tera is available.** It is legal in only three of eleven
  formats.
- **Do not suggest picking a Mega forme, Arceus-Water or Silvally-Steel in the
  Team Builder.** The route is the base species holding the stone, Plate or
  Memory.
- Remember that **Mega Evolution needs no Key Stone**, so any Pokémon holding its
  own stone is a Mega threat.
