# RedGPT — Addendum: held items, and why they matter for tiering

**Read this alongside `DIFFERENCES_FROM_SHOWDOWN.md`.** That document listed the
item changes in §6, but its §0 reading list pointed at the ability, stat and
format sections and skipped items entirely. This addendum corrects that: held
items are one of the largest sources of divergence in RedGPT, and at least two of
them change tiering conclusions on their own.

Everything here was verified against the live game data on 2026-08-15.

---

## 1. Ring Target — the most powerful item in the game

Upstream, Ring Target is a *drawback* item: it strips the **holder's own** type
immunities, and nobody equips it on purpose.

**RedGPT reverses it.** The holder's own attacks now **hit for neutral damage
through a target's type immunity**. A Ring Target Snorlax's Body Slam hits
Gengar. A Ring Target Pikachu's Thunderbolt hits Garchomp for neutral.

### Exactly what it pierces — all eight 0x cells in the type chart

| Attacking type | Would be immune | With Ring Target |
| --- | --- | --- |
| Normal | Ghost | 1x |
| Fighting | Ghost | 1x |
| Ghost | Normal | 1x |
| Psychic | Dark | 1x |
| Electric | Ground | 1x |
| Ground | Flying | 1x |
| Dragon | Fairy | 1x |
| **Poison** | **Steel** | **1x** |

Poison → Steel is easy to overlook and is included.

### The boundaries — these are strict

- **Type immunity only.** It does **not** beat an ability immunity: Levitate,
  Flash Fire, Water Absorb, Volt Absorb, Storm Drain, Sap Sipper, Dry Skin,
  Earth Eater, Well-Baked Body, Heatproof, Bulletproof, Soundproof, Wonder Guard
  and Good as Gold all still work. Those are intercepted on a separate path in
  the engine and never reach the type chart as a zero.
- **It is read off the attacker**, so it is an offensive item competing for the
  slot with Choice items, Life Orb and Leftovers. It does nothing on defence.
- **The Ring Target Clause: one per team, in every format.** This is a formal
  named clause in RedGPT, alongside Species Clause, Sleep Clause, Evasion Clause
  and OHKO Clause — treat it as a standing rule of every format, not as an item
  quirk. It applies whether or not Item Clause is on, and it is enforced in two
  places: the team validator refuses a second copy at team building, and the
  battle engine refuses one mid-battle, so a second copy cannot be assembled with
  Trick, Switcheroo, Bestow, Thief, Covet, Magician, Pickpocket or Pickup.
  **Fainted teammates still count** — you cannot spend the holder and then Trick
  a second one in. A swap that would break the clause is refused whole rather
  than half-applied.
- **It is publicly visible** — shown on the Pokémon's card and at Team Preview
  from turn one, like a Mega Stone rather than a Choice Band. The opponent
  always knows.

Both guard rails exist because the item is strong enough to need them: the clause
bounds it to one immunity-break per team, and the visibility means the opponent
can plan around it rather than finding out by losing a Pokémon.

### Why this matters for tiering

It deletes the single hardest defensive read in the game. A type immunity is the
only *absolute* defensive answer — everything else is a matter of degree — and
this item removes one per team for the cost of an item slot.

Concretely: a Ghost-type attacker is no longer walled by Normal types; an
Electric attacker is no longer walled by Ground; a Dragon attacker is no longer
walled by Fairy; a Psychic attacker is no longer walled by Dark. **If your
argument for keeping a Pokémon in Ubers is "OU has hard immunity answers to it",
Ring Target is a direct counter-argument** — though only once per team, and
telegraphed.

Measured in-game: an Espeon at +3 Calm Mind holding one OHKOs a Tyranitar with
Stored Power, because Dark is that move's only hard answer and the item deletes
it.

---

## 2. Toxic Orb and Flame Orb fire on entry, not at end of turn

Officially both activate in the residual phase, costing their holder the whole
turn it switches in. In RedGPT they afflict the holder **the moment it arrives**.

So **Guts, Poison Heal, Quick Feet, Flare Boost, Toxic Boost and Facade are all
live on the turn the holder switches in.** A Guts attacker's first turn is
boosted; a Poison Heal Gliscor heals immediately; a Facade user hits at full
power straight away.

This is a straight buff to every status-orb archetype, and those are common OU
Pokémon.

---

## 3. Mega Stones as items — the whole cost of a Mega

Restating in item terms, because it is the biggest single power shift in the
game: **there is no Key Stone.** Holding the species' own Mega Stone is
sufficient, and `mega` is enabled in every format.

The *only* cost of Mega Evolving is the held-item slot. There is no team-building
tax, no once-per-team restriction beyond one Mega Evolution per side per battle.

**Mega Stones and forme items cannot be removed.** Knock Off, Trick, Switcheroo,
Thief, Covet, Corrosive Gas, Magician, Pickpocket and Fling are all refused
against them. Knock Off is therefore substantially weaker in this metagame than
in Showdown's — it cannot touch a Mega user's item at all.

---

## 4. Project-invented items

| Item | Effect | Why it matters |
| --- | --- | --- |
| **Warp Prism** | Trick Room *the holder sets* lasts **8** turns instead of 5 | Trick Room teams spend far fewer turns re-setting |
| **Wind Sock** | Tailwind *the holder sets* lasts **7** turns instead of 4 | Four turns does not even cover a switch cycle; seven does |
| **Hero Charm** | **Palafin enters battle in Hero Form** | See below — a direct buff to an Ubers Pokémon |

**The Hero Charm is tiering-relevant.** Officially, Palafin must switch out and
back in to reach Hero Form, which is slow, invisible and cannot be planned
around. In RedGPT it simply holds the Hero Charm and **arrives in Hero Form**,
with 160 Attack, from the first turn it is on the field. Palafin is much more
reliable here than in the games, which argues *against* it dropping.

---

## 5. Other item changes worth knowing

- **The thirteen Generation 2 items are fully implemented** and are not aliases
  of their modern replacements. **Mystery Berry restores 5 PP** where Leppa
  restores 10; **Pink Bow and Polkadot Bow give Normal moves 1.1x** where every
  modern type booster gives 1.2x. **Berserk Gene** gives +2 Attack on entry and
  confuses the holder, single use — a real if reckless offensive option.
- **Oran Berry fires at 1/4 max HP**, not 1/2. The Gen 2 Berry (10 HP) and Gold
  Berry (30 HP) do use 1/2, so they are *better* than Oran here.
- **Berries separate their trigger from their effect**, so Bug Bite, Pluck, Stuff
  Cheeks, Tea Time and a flung Berry all genuinely apply the effect.
- **Z-crystals are inert.** Z-Moves are not simulated at all, so a Z-crystal is a
  wasted item slot.
- **250 of 560 items are inert by design** (evolution stones, TMs, Poké Balls,
  mail, Z-crystals). **310 are implemented. None are unimplemented.**

---

## 6. Summary for the tiering question

The items that should change a verdict, in order of impact:

1. **Ring Target** — deletes any one of the eight type immunities. If a Pokémon
   is held in Ubers because OU has an immunity-based hard check, that check is
   purchasable. **Bounded by the Ring Target Clause (one per team) and by being
   publicly visible from Team Preview** — so it is a scalpel, not a blanket: a
   team can break exactly one immunity, and the opponent knows which Pokémon is
   carrying it before the first turn.
2. **Mega Stones with no Key Stone** — the reason RedGPT's OU is far stronger
   than SV OU, and the reason Knock Off is weaker.
3. **Toxic/Flame Orb on entry** — Guts, Poison Heal, Facade and Quick Feet users
   are meaningfully better than their Showdown counterparts.
4. **Hero Charm** — Palafin is more consistent here, not less.
5. **Warp Prism / Wind Sock** — Trick Room and Tailwind archetypes are more
   durable, which affects what Speed tiers mean.
