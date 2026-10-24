/**
 * Held item effect registry.
 *
 * Same hook contract as src/core/abilities.js. Items additionally declare
 * `consumable`, so the engine knows to move them to `consumedItem` when used.
 *
 * Extra item-only hooks:
 *   onUpdate(battle, pokemon)      checked after damage/status changes (berries)
 *   onTryEscape / onAfterMove      as for abilities
 *
 * An `onEatBerry` item hook was listed here as "invoked by Bug Bite / Pluck /
 * Stuff Cheeks". It was fiction: none of those moves is implemented, no item
 * defines the hook, and nothing in the engine invokes it — only the *ability*
 * hook of the same name is called, from `battle.eatBerry` (Cheek Pouch, Ripen).
 * Removed rather than left as documentation of a mechanism that does not exist.
 * The same missing force-eat path is why a flung Berry is not eaten by its target
 * (PROJECT_CONTEXT §9).
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Dex = RedGPT.Dex;

  const Items = {};

  function define(name, effect) {
    const id = Dex.toID(name);
    Items[id] = Object.assign({id, name}, effect);
    return Items[id];
  }

  /* ---------------------------------------------------------------- *
   * Passive residual items
   * ---------------------------------------------------------------- */

  /*
   * `residualFraction` predicts what `onResidual` will do to the holder's HP,
   * as a signed fraction of max HP. It is read by `battle.residualSwing`, which
   * is how the AI knows that stalling behind Protect actually banks something.
   * It has to be declared rather than measured: running the hook would really
   * heal the Pokémon, and asking what a turn *would* do must never change
   * anything. A test runs a real residual turn against every declaration.
   */
  define('Leftovers', {
    residualFraction() { return 1 / 16; },
    onResidual(battle, pokemon) {
      battle.heal(pokemon, Math.max(1, Math.floor(pokemon.maxHP / 16)), {text: `${battle.label(pokemon)} restored a little HP using its Leftovers!`});
    },
  });
  define('Black Sludge', {
    residualFraction(battle, pokemon) { return pokemon.types.includes('Poison') ? 1 / 16 : -1 / 8; },
    onResidual(battle, pokemon) {
      if (pokemon.types.includes('Poison')) {
        battle.heal(pokemon, Math.max(1, Math.floor(pokemon.maxHP / 16)), {text: `${battle.label(pokemon)} restored HP using its Black Sludge!`});
      } else {
        battle.damage(pokemon, Math.max(1, Math.floor(pokemon.maxHP / 8)), {indirect: true, text: `${battle.label(pokemon)} was hurt by its Black Sludge!`});
      }
    },
  });
  define('Shell Bell', {
    onAfterDamageDealt(battle, source, target, move, damage) {
      if (damage > 0) battle.heal(source, Math.max(1, Math.floor(damage / 8)), {text: `${battle.label(source)} restored HP using its Shell Bell!`});
    },
  });
  define('Big Root', {drainMultiplier: 1.3});
  /**
   * The status Orbs fire **on entry**, not at the end of the turn.
   *
   * Officially they activate in the residual phase, which costs their holder the
   * whole turn it switches in: a Guts attacker spends its first turn unboosted,
   * a Poison Heal Gliscor its first turn not healing, and a Facade user its
   * first turn at half power. That delay is a cost the holder pays for a
   * drawback it *wants*, on the one turn it is least able to afford it — the
   * same shape as the conditions §5 removed from Dream Eater and Poltergeist,
   * except self-inflicted.
   *
   * `onResidual` is kept as well, and is not redundant: it covers an Orb that
   * arrives mid-battle by Trick, Switcheroo or Bestow, and a holder whose status
   * is cured (a Lum Berry, Natural Cure on a switch, Heal Bell) and should be
   * re-afflicted. Both hooks run the same function so they cannot drift.
   */
  const statusOrb = (status, name) => {
    const apply = (battle, pokemon) => {
      if (pokemon.status) return;
      battle.setStatus(pokemon, status, pokemon, {
        text: `${battle.label(pokemon)} was ${status === 'tox' ? 'badly poisoned' : 'burned'} by its ${name}!`,
      });
    };
    return {onStart: apply, onResidual: apply};
  };
  define('Toxic Orb', statusOrb('tox', 'Toxic Orb'));
  define('Flame Orb', statusOrb('brn', 'Flame Orb'));
  /**
   * Berserk Gene — the Generation 2 item the status Orbs are descended from:
   * +2 Attack the moment its holder arrives, and confusion as the price.
   *
   * It sits beside them because it is the same bargain fired at the same moment,
   * and it needs no `onResidual` twin: the Orbs keep one because a *cured*
   * holder should be re-afflicted, whereas a spent Gene is gone.
   *
   * The confusion is applied with the holder as its own source, which is what
   * routes it past a Substitute (self-inflicted) and correctly *into* Own
   * Tempo's refusal — a Pokémon that cannot be confused takes the Attack for
   * free, exactly as in Generation 2.
   */
  define('Berserk Gene', {
    consumable: true,
    onStart(battle, pokemon) {
      battle.consumeItem(pokemon, `${battle.label(pokemon)} was mutated by its Berserk Gene!`);
      battle.boost(pokemon, {atk: 2}, pokemon);
      battle.addVolatile(pokemon, 'confusion', pokemon);
    },
  });
  define('Sticky Barb', {
    residualFraction() { return -1 / 8; },
    onResidual(battle, pokemon) {
      battle.damage(pokemon, Math.max(1, Math.floor(pokemon.maxHP / 8)), {indirect: true, text: `${battle.label(pokemon)} was hurt by its Sticky Barb!`});
    },
  });
  define('Life Orb', {
    onModifyDamage(battle, source, target, move, damage) { return Math.floor(damage * 1.3); },
    onAfterMove(battle, source, target, move, result) {
      if (!result || move.category === 'Status' || !source.lifeOrbHit) return;
      source.lifeOrbHit = false;
      battle.damage(source, Math.max(1, Math.floor(source.maxHP / 10)), {indirect: true, text: `${battle.label(source)} was hurt by its Life Orb!`});
    },
  });
  define('Expert Belt', {
    onModifyDamage(battle, source, target, move, damage) {
      return battle.effectiveness(move.type, target, move) > 1 ? Math.floor(damage * 1.2) : damage;
    },
  });
  define('Muscle Band', {
    onBasePower(battle, source, target, move, power) { return move.category === 'Physical' ? Math.floor(power * 1.1) : power; },
  });
  define('Wise Glasses', {
    onBasePower(battle, source, target, move, power) { return move.category === 'Special' ? Math.floor(power * 1.1) : power; },
  });
  define('Punching Glove', {
    onBasePower(battle, source, target, move, power) { return move.flags?.punch ? Math.floor(power * 1.1) : power; },
    onModifyMove(battle, pokemon, move) { if (move.flags?.punch) move.flags = Object.assign({}, move.flags, {contact: 0}); },
  });
  define('Metronome', {
    onBasePower(battle, source, target, move, power) {
      const streak = Math.min(5, source.volatiles.metronomeStreak || 0);
      return Math.floor(power * (1 + 0.2 * streak));
    },
    onAfterMove(battle, source, target, move) {
      source.volatiles.metronomeStreak = source.lastMoveId === move.id ? Math.min(5, (source.volatiles.metronomeStreak || 0) + 1) : 0;
    },
  });
  define('Loaded Dice', {minMultihit: 4});
  define('Light Clay', {screenDuration: 8});
  define('Damp Rock', {weatherDuration: {rain: 8}});
  define('Heat Rock', {weatherDuration: {sun: 8}});
  define('Smooth Rock', {weatherDuration: {sandstorm: 8}});
  define('Icy Rock', {weatherDuration: {snow: 8, hail: 8}});
  define('Terrain Extender', {terrainDuration: 8});
  // Project-authored (see ITEM_ADDITIONS in tools/generate-data.js). The
  // counterpart to Light Clay and Terrain Extender, which Trick Room lacked.
  define('Warp Prism', {roomDuration: {trickroom: 8}});
  /*
   * The Tailwind counterpart to Light Clay. Read by `executeMove`'s side
   * condition branch, alongside `screenDuration` — declaring it here and
   * nowhere else would make it exactly the dead flag §8 keeps finding.
   */
  define('Wind Sock', {tailwindDuration: 7});
  define('Grip Claw', {trapDuration: 7});

  /* ---------------------------------------------------------------- *
   * Defensive / utility
   * ---------------------------------------------------------------- */

  define('Focus Sash', {
    consumable: true,
    onSourceModifyDamage(battle, target, source, move, damage) {
      if (target.currentHP === target.maxHP && damage >= target.currentHP) {
        battle.consumeItem(target, `${battle.label(target)} hung on using its Focus Sash!`);
        return target.currentHP - 1;
      }
      return damage;
    },
  });
  define('Focus Band', {
    onSourceModifyDamage(battle, target, source, move, damage) {
      if (damage >= target.currentHP && battle.rng.chance(0.1)) {
        battle.add(`${battle.label(target)} hung on using its Focus Band!`);
        return target.currentHP - 1;
      }
      return damage;
    },
  });
  define('Assault Vest', {
    onModifyStat(battle, pokemon, stat, value) { return stat === 'spd' ? Math.floor(value * 1.5) : value; },
    blocksStatusMoves: true,
  });
  define('Eviolite', {
    onModifyStat(battle, pokemon, stat, value) {
      if (stat !== 'def' && stat !== 'spd') return value;
      return Dex.evolutions(pokemon.speciesData).length ? Math.floor(value * 1.5) : value;
    },
  });
  define('Rocky Helmet', {
    onDamagingHit(battle, target, source, move) {
      if (!move.flags?.contact || source.fainted) return;
      battle.damage(source, Math.max(1, Math.floor(source.maxHP / 6)), {indirect: true, text: `${battle.label(source)} was hurt by the Rocky Helmet!`});
    },
  });
  define('Air Balloon', {
    ungrounded: true,
    onStart(battle, pokemon) { battle.add(`${battle.label(pokemon)} floats in the air with its Air Balloon!`); },
    // Same immunity Levitate grants. Blocked here rather than in the damage
    // step, so a Ground move that never lands does not pop the balloon.
    onTryHit(battle, target, source, move) {
      if (move.type === 'Ground' && move.category !== 'Status' && !move.ignoreImmunity && move.id !== 'thousandarrows') return 'immune';
    },
    onDamagingHit(battle, target) { battle.consumeItem(target, `${battle.label(target)}'s Air Balloon popped!`); },
  });
  define('Heavy-Duty Boots', {ignoreHazards: true});
  define('Safety Goggles', {
    onTryHit(battle, target, source, move) { if (move.flags?.powder) return 'immune'; },
    onWeatherDamage() { return false; },
  });
  define('Protective Pads', {noContact: true});
  define('Covert Cloak', {blockSecondary: true});
  define('Clear Amulet', {
    onTryBoost(battle, pokemon, boosts, source) {
      if (!source || source === pokemon) return;
      let blocked = false;
      for (const key of Object.keys(boosts)) if (boosts[key] < 0) { delete boosts[key]; blocked = true; }
      if (blocked) battle.add(`${battle.label(pokemon)}'s Clear Amulet prevents stat loss!`);
    },
  });
  define('Ability Shield', {abilityProtected: true});
  define('Utility Umbrella', {ignoreWeatherEffects: true});
  define('Bright Powder', {
    onSourceModifyAccuracy(battle, target, source, move, accuracy) { return accuracy == null ? accuracy : accuracy * 0.9; },
  });
  define('Lax Incense', {
    onSourceModifyAccuracy(battle, target, source, move, accuracy) { return accuracy == null ? accuracy : accuracy * 0.9; },
  });
  define('Wide Lens', {
    onModifyAccuracy(battle, source, target, move, accuracy) { return accuracy == null ? accuracy : accuracy * 1.1; },
  });
  define('Zoom Lens', {
    onModifyAccuracy(battle, source, target, move, accuracy) {
      return accuracy != null && target.hasActedThisTurn ? accuracy * 1.2 : accuracy;
    },
  });
  define('Scope Lens', {critStageBonus: 1});
  define('Razor Claw', {critStageBonus: 1});
  define('Leek', {critStageBonus: 2, itemUsers: ['farfetchd', 'farfetchdgalar', 'sirfetchd']});
  define('Lucky Punch', {critStageBonus: 2, itemUsers: ['chansey']});
  define("King's Rock", {
    onAfterMove(battle, source, target, move, result) {
      if (!result || move.category === 'Status' || !target || target.fainted) return;
      if (battle.rng.chance(0.1)) battle.addVolatile(target, 'flinch', source);
    },
  });
  define('Razor Fang', {
    onAfterMove(battle, source, target, move, result) {
      if (!result || move.category === 'Status' || !target || target.fainted) return;
      if (battle.rng.chance(0.1)) battle.addVolatile(target, 'flinch', source);
    },
  });
  define('Quick Claw', {
    onFractionalPriority(battle, pokemon) { return battle.rng.chance(0.2) ? 0.1 : 0; },
  });
  define('Custap Berry', {
    consumable: true, isBerry: true,
    onFractionalPriority(battle, pokemon) {
      if (pokemon.currentHP * 4 <= pokemon.maxHP) {
        battle.consumeItem(pokemon, `${battle.label(pokemon)} used its Custap Berry to move first!`);
        return 0.2;
      }
      return 0;
    },
  });
  define('Berry Juice', {
    consumable: true,
    onUpdate(battle, pokemon) {
      if (pokemon.currentHP * 2 <= pokemon.maxHP && pokemon.currentHP > 0) {
        battle.heal(pokemon, 20, {text: `${battle.label(pokemon)} drank its Berry Juice!`});
        battle.consumeItem(pokemon);
      }
    },
  });

  /* ---------------------------------------------------------------- *
   * Choice items
   * ---------------------------------------------------------------- */

  const choiceItem = (stat, mult) => ({
    choiceLock: true,
    onModifyStat(battle, pokemon, s, value) { return s === stat ? Math.floor(value * mult) : value; },
  });
  define('Choice Band', choiceItem('atk', 1.5));
  define('Choice Specs', choiceItem('spa', 1.5));
  define('Choice Scarf', choiceItem('spe', 1.5));

  /* ---------------------------------------------------------------- *
   * Stat-triggered items
   * ---------------------------------------------------------------- */

  define('Weakness Policy', {
    consumable: true,
    onAfterHitTaken(battle, target, source, move) {
      if (move.category === 'Status' || battle.effectiveness(move.type, target, move) <= 1) return;
      battle.consumeItem(target, `${battle.label(target)}'s Weakness Policy activated!`);
      battle.boost(target, {atk: 2, spa: 2}, target);
    },
  });
  define('Throat Spray', {
    consumable: true,
    onAfterMove(battle, source, target, move, result) {
      if (!result || !move.flags?.sound) return;
      battle.consumeItem(source, `${battle.label(source)}'s Throat Spray activated!`);
      battle.boost(source, {spa: 1}, source);
    },
  });
  define('Blunder Policy', {
    consumable: true,
    onMoveMiss(battle, source) {
      battle.consumeItem(source, `${battle.label(source)}'s Blunder Policy activated!`);
      battle.boost(source, {spe: 2}, source);
    },
  });
  define('Room Service', {
    consumable: true,
    onTrickRoomStart(battle, pokemon) {
      battle.consumeItem(pokemon, `${battle.label(pokemon)}'s Room Service activated!`);
      battle.boost(pokemon, {spe: -1}, pokemon);
    },
  });
  define('Booster Energy', {
    consumable: true,
    onUpdate(battle, pokemon) {
      const abilityId = Dex.toID(pokemon.ability);
      if (abilityId !== 'protosynthesis' && abilityId !== 'quarkdrive') return;
      if (pokemon.abilityState.boostedStat) return;
      const natural = abilityId === 'protosynthesis' ? battle.effectiveWeather() === 'sun' : battle.field.terrain === 'electric';
      if (natural) return;
      battle.consumeItem(pokemon, `${battle.label(pokemon)} used its Booster Energy!`);
      battle.runAbility('onStart', pokemon);
    },
  });
  define('Mirror Herb', {
    consumable: true,
    onFoeBoost(battle, pokemon, boosts) {
      const copy = {};
      for (const [k, v] of Object.entries(boosts)) if (v > 0) copy[k] = v;
      if (!Object.keys(copy).length) return;
      battle.consumeItem(pokemon, `${battle.label(pokemon)} used its Mirror Herb!`);
      battle.boost(pokemon, copy, pokemon);
    },
  });
  define('White Herb', {
    consumable: true,
    onUpdate(battle, pokemon) {
      const lowered = Object.entries(pokemon.boosts).filter(([, v]) => v < 0);
      if (!lowered.length) return;
      for (const [key] of lowered) pokemon.boosts[key] = 0;
      battle.consumeItem(pokemon, `${battle.label(pokemon)} restored its stats using its White Herb!`);
    },
  });
  define('Power Herb', {
    consumable: true,
    skipCharge: true,
  });
  define('Eject Button', {
    consumable: true,
    onDamagingHit(battle, target) {
      // Nothing to switch to means the button never gets pressed, so it is not spent.
      if (!battle.canSwitch(target.side)) return;
      battle.consumeItem(target, `${battle.label(target)} is switched out by the Eject Button!`);
      battle.requestSwitchOut(target, 'Eject Button');
    },
  });
  define('Red Card', {
    consumable: true,
    onDamagingHit(battle, target, source) {
      // Only spent when there is actually someone to drag in.
      if (!source || source.fainted || !battle.canSwitch(source.side)) return;
      battle.consumeItem(target, `${battle.label(target)} held up its Red Card!`);
      battle.forceSwitch(battle.sideOf(source));
    },
  });

  /* ---------------------------------------------------------------- *
   * Berries
   * ---------------------------------------------------------------- */

  /**
   * Define a Berry whose effect can also be applied **on demand**.
   *
   * `trigger` decides whether the Berry fires by itself; `effect` is what it does.
   * Splitting them is what makes a force-eat possible at all: previously every
   * Berry fused the two inside `onUpdate`, so `healBerry` returned early above its
   * HP threshold and there was no way to reach the heal. That single fact blocked
   * Bug Bite, Pluck, Stuff Cheeks and the "target eats a flung Berry" half of
   * Fling (all four now work — see `battle.forceEatBerry`).
   *
   * `onForceEat(battle, pokemon)` applies `effect` with **no trigger check and no
   * consumption** — the caller owns removing the Berry from whoever held it, because
   * the eater is often not the holder.
   *
   * Berries with no eater-side effect (the type-resist berries below) deliberately
   * have no `onForceEat`: eating one does nothing, which is correct.
   */
  function eatableBerry(name, {trigger, effect, extra}) {
    define(name, Object.assign({
      consumable: true, isBerry: true,
      onUpdate(battle, pokemon) {
        if (pokemon.currentHP <= 0) return;
        if (!trigger(battle, pokemon)) return;
        battle.eatBerry(pokemon);
        effect(battle, pokemon);
      },
      onForceEat: effect,
    }, extra || {}));
  }

  /** Below the pinch threshold — the condition most Berries share. */
  const inPinch = (battle, pokemon) => pokemon.currentHP <= battle.pinchBerryThreshold(pokemon);

  /**
   * @param {number} threshold  fraction of max HP at or below which it fires.
   *   Passed explicitly rather than inferred from the id: the previous version
   *   asked `pokemon.item === 'sitrusberry'`, which reads the *holder's* item —
   *   wrong for a force-eaten Berry, since the eater is usually not the holder.
   *   Gluttony still lifts every threshold through `pinchBerryThreshold`, so a
   *   berry that already fires at a half is unaffected by it and one that fires
   *   at a quarter is doubled, which is the ability's whole job.
   */
  function healBerry(name, fraction, flat, threshold = 1 / 4) {
    eatableBerry(name, {
      trigger(battle, pokemon) {
        return pokemon.currentHP <= Math.max(pokemon.maxHP * threshold, battle.pinchBerryThreshold(pokemon));
      },
      effect(battle, pokemon) {
        const amount = battle.ripen(pokemon, flat ? flat : Math.floor(pokemon.maxHP * fraction));
        battle.heal(pokemon, Math.max(1, amount), {text: `${battle.label(pokemon)} restored HP using its ${name}!`});
      },
    });
  }
  healBerry('Sitrus Berry', 0.25, 0, 1 / 2);
  healBerry('Oran Berry', 0, 10);
  /*
   * The two Generation 2 healing Berries, at the half-HP threshold their own
   * packaged descriptions state. That makes Berry a strictly better Oran Berry,
   * which is historically exactly right — Oran is Generation 3's rename of it,
   * and the two are identical in the real games. This project's Oran fires at a
   * quarter instead (see `healBerry`'s default), so the pair diverge here; that
   * is Oran's existing behaviour, deliberately left alone rather than retuned
   * inside a task about adding items.
   */
  healBerry('Berry', 0, 10, 1 / 2);
  healBerry('Gold Berry', 0, 30, 1 / 2);

  const ppBerry = (name, amount) => eatableBerry(name, {
    trigger: (battle, pokemon) => pokemon.moves.some(m => m.pp === 0),
    effect(battle, pokemon) {
      // Prefers an empty move, but a force-eat can top up a partly spent one.
      const slot = pokemon.moves.find(m => m.pp === 0) || pokemon.moves.find(m => m.pp < m.maxPP);
      if (!slot) return;
      slot.pp = Math.min(slot.maxPP, slot.pp + amount);
      battle.add(`${battle.label(pokemon)} restored PP using its ${name}!`);
    },
  });
  ppBerry('Leppa Berry', 10);
  ppBerry('Mystery Berry', 5);      // the Generation 2 original, at 5 PP

  // Confusion berries: heal 1/3 and confuse if the flavour is disliked.
  const CONFUSE_BERRIES = {'Figy Berry': 'atk', 'Wiki Berry': 'spa', 'Mago Berry': 'spe', 'Aguav Berry': 'spd', 'Iapapa Berry': 'def'};
  for (const [name, stat] of Object.entries(CONFUSE_BERRIES)) {
    eatableBerry(name, {
      trigger: inPinch,
      effect(battle, pokemon) {
        battle.heal(pokemon, Math.max(1, battle.ripen(pokemon, Math.floor(pokemon.maxHP / 3))), {text: `${battle.label(pokemon)} restored HP using its ${name}!`});
        const nature = Dex.nature(pokemon.set.nature);
        if (nature.minus === stat) battle.addVolatile(pokemon, 'confusion', pokemon);
      },
    });
  }

  /*
   * The five modern status Berries and the five Generation 2 originals they
   * replaced. Separate entries rather than aliases, because they are separate
   * items in the packaged data and a team can hold both — sharing the table is
   * what stops the two halves drifting.
   */
  const STATUS_BERRIES = {
    'Cheri Berry': 'par', 'Chesto Berry': 'slp', 'Pecha Berry': 'psn',
    'Rawst Berry': 'brn', 'Aspear Berry': 'frz',
    'PRZ Cure Berry': 'par', 'Mint Berry': 'slp', 'PSN Cure Berry': 'psn',
    'Ice Berry': 'brn', 'Burnt Berry': 'frz',
  };
  for (const [name, status] of Object.entries(STATUS_BERRIES)) {
    const cures = pokemon => (status === 'psn' ? ['psn', 'tox'].includes(pokemon.status) : pokemon.status === status);
    eatableBerry(name, {
      trigger: (battle, pokemon) => cures(pokemon),
      effect(battle, pokemon) {
        // Guarded, because a force-eat can happen with no status to cure.
        if (!cures(pokemon)) return;
        pokemon.status = null;
        pokemon.statusData.toxicCounter = 1;
        battle.add(`${battle.label(pokemon)} cured its status using its ${name}!`);
      },
    });
  }

  /** Cures every status *and* confusion — Lum Berry and its Gen 2 original. */
  const cureAllBerry = name => eatableBerry(name, {
    trigger: (battle, pokemon) => !!pokemon.status || !!pokemon.volatiles.confusion,
    effect(battle, pokemon) {
      if (!pokemon.status && !pokemon.volatiles.confusion) return;
      pokemon.status = null;
      pokemon.statusData.toxicCounter = 1;
      delete pokemon.volatiles.confusion;
      battle.add(`${battle.label(pokemon)} cured its status using its ${name}!`);
    },
  });
  cureAllBerry('Lum Berry');
  cureAllBerry('Miracle Berry');

  /** Confusion only — Persim Berry and its Gen 2 original. */
  const confusionBerry = name => eatableBerry(name, {
    trigger: (battle, pokemon) => !!pokemon.volatiles.confusion,
    effect(battle, pokemon) {
      if (!pokemon.volatiles.confusion) return;
      delete pokemon.volatiles.confusion;
      battle.add(`${battle.label(pokemon)} snapped out of confusion using its ${name}!`);
    },
  });
  confusionBerry('Persim Berry');
  confusionBerry('Bitter Berry');

  const PINCH_BERRIES = {'Liechi Berry': 'atk', 'Ganlon Berry': 'def', 'Petaya Berry': 'spa', 'Apicot Berry': 'spd', 'Salac Berry': 'spe'};
  for (const [name, stat] of Object.entries(PINCH_BERRIES)) {
    eatableBerry(name, {
      trigger: inPinch,
      effect(battle, pokemon) {
        battle.add(`${battle.label(pokemon)} used its ${name}!`);
        battle.boost(pokemon, {[stat]: battle.ripen(pokemon, 1)}, pokemon);
      },
    });
  }

  eatableBerry('Starf Berry', {
    trigger: inPinch,
    effect(battle, pokemon) {
      const stat = battle.rng.pick(['atk', 'def', 'spa', 'spd', 'spe']);
      battle.add(`${battle.label(pokemon)} used its Starf Berry!`);
      battle.boost(pokemon, {[stat]: battle.ripen(pokemon, 2)}, pokemon);
    },
  });

  /** Type-resist berries halve one super-effective hit, then are consumed. */
  const RESIST_BERRIES = {
    'Occa Berry': 'Fire', 'Passho Berry': 'Water', 'Wacan Berry': 'Electric', 'Rindo Berry': 'Grass',
    'Yache Berry': 'Ice', 'Chople Berry': 'Fighting', 'Kebia Berry': 'Poison', 'Shuca Berry': 'Ground',
    'Coba Berry': 'Flying', 'Payapa Berry': 'Psychic', 'Tanga Berry': 'Bug', 'Charti Berry': 'Rock',
    'Kasib Berry': 'Ghost', 'Haban Berry': 'Dragon', 'Colbur Berry': 'Dark', 'Babiri Berry': 'Steel',
    'Roseli Berry': 'Fairy',
  };
  for (const [name, type] of Object.entries(RESIST_BERRIES)) {
    define(name, {
      consumable: true, isBerry: true, resistType: type,
      onSourceModifyDamage(battle, target, source, move, damage) {
        if (move.type !== type || move.category === 'Status') return damage;
        if (battle.effectiveness(move.type, target, move) <= 1) return damage;
        battle.eatBerry(target, `${battle.label(target)}'s ${name} weakened the attack!`);
        // Ripen doubles the reduction: a half becomes a quarter.
        return Math.floor(damage * (battle.abilityOf(target)?.ripenBerry ? 0.25 : 0.5));
      },
    });
  }
  define('Chilan Berry', {
    consumable: true, isBerry: true, resistType: 'Normal',
    onSourceModifyDamage(battle, target, source, move, damage) {
      if (move.type !== 'Normal' || move.category === 'Status') return damage;
      battle.eatBerry(target, `${battle.label(target)}'s Chilan Berry weakened the attack!`);
      return Math.floor(damage * (battle.abilityOf(target)?.ripenBerry ? 0.25 : 0.5));
    },
  });

  /* ---------------------------------------------------------------- *
   * Type-boosting items, plates, incenses and signature items
   * ---------------------------------------------------------------- */

  const TYPE_BOOSTERS = {
    'Silk Scarf': 'Normal', 'Charcoal': 'Fire', 'Mystic Water': 'Water', 'Magnet': 'Electric',
    'Miracle Seed': 'Grass', 'Never-Melt Ice': 'Ice', 'Black Belt': 'Fighting', 'Poison Barb': 'Poison',
    'Soft Sand': 'Ground', 'Sharp Beak': 'Flying', 'Twisted Spoon': 'Psychic', 'Silver Powder': 'Bug',
    'Hard Stone': 'Rock', 'Spell Tag': 'Ghost', 'Dragon Fang': 'Dragon', 'Black Glasses': 'Dark',
    'Metal Coat': 'Steel', 'Fairy Feather': 'Fairy',
    'Flame Plate': 'Fire', 'Splash Plate': 'Water', 'Zap Plate': 'Electric', 'Meadow Plate': 'Grass',
    'Icicle Plate': 'Ice', 'Fist Plate': 'Fighting', 'Toxic Plate': 'Poison', 'Earth Plate': 'Ground',
    'Sky Plate': 'Flying', 'Mind Plate': 'Psychic', 'Insect Plate': 'Bug', 'Stone Plate': 'Rock',
    'Spooky Plate': 'Ghost', 'Draco Plate': 'Dragon', 'Dread Plate': 'Dark', 'Iron Plate': 'Steel',
    'Pixie Plate': 'Fairy',
    'Odd Incense': 'Psychic', 'Rock Incense': 'Rock', 'Rose Incense': 'Grass', 'Sea Incense': 'Water',
    'Wave Incense': 'Water',
  };
  for (const [name, type] of Object.entries(TYPE_BOOSTERS)) {
    define(name, {
      boostType: type,
      onBasePower(battle, source, target, move, power) { return move.type === type ? Math.floor(power * 1.2) : power; },
    });
  }

  /*
   * The two Generation 2 Normal-type boosters. **1.1x, not the 1.2x** every
   * item in `TYPE_BOOSTERS` above gives — that is what their own data says, and
   * it is the reason Silk Scarf replaced them. Defined separately rather than
   * added to that table, which hardcodes 1.2x for all 38 of its entries.
   *
   * Pink Bow and Polkadot Bow are genuinely two items with one effect in the
   * packaged data (both are item number 251), so they share an implementation.
   */
  const normalBow = name => define(name, {
    onBasePower(battle, source, target, move, power) {
      return move.type === 'Normal' ? Math.floor(power * 1.1) : power;
    },
  });
  normalBow('Pink Bow');
  normalBow('Polkadot Bow');

  define('Light Ball', {
    itemUsers: ['pikachu'],
    onModifyStat(battle, pokemon, stat, value) {
      if (Dex.species(pokemon.species).baseSpecies !== 'Pikachu') return value;
      return stat === 'atk' || stat === 'spa' ? value * 2 : value;
    },
  });
  define('Thick Club', {
    itemUsers: ['cubone', 'marowak', 'marowakalola'],
    onModifyStat(battle, pokemon, stat, value) {
      const base = Dex.species(pokemon.species).baseSpecies;
      if (base !== 'Cubone' && base !== 'Marowak') return value;
      return stat === 'atk' ? value * 2 : value;
    },
  });
  define('Metal Powder', {
    itemUsers: ['ditto'],
    onModifyStat(battle, pokemon, stat, value) {
      return pokemon.species === 'ditto' && stat === 'def' ? value * 2 : value;
    },
  });
  define('Quick Powder', {
    itemUsers: ['ditto'],
    onModifyStat(battle, pokemon, stat, value) {
      return pokemon.species === 'ditto' && stat === 'spe' ? value * 2 : value;
    },
  });
  define('Deep Sea Tooth', {
    itemUsers: ['clamperl'],
    onModifyStat(battle, pokemon, stat, value) { return pokemon.species === 'clamperl' && stat === 'spa' ? value * 2 : value; },
  });
  define('Deep Sea Scale', {
    itemUsers: ['clamperl'],
    onModifyStat(battle, pokemon, stat, value) { return pokemon.species === 'clamperl' && stat === 'spd' ? value * 2 : value; },
  });
  define('Soul Dew', {
    onBasePower(battle, source, target, move, power) {
      const base = Dex.species(source.species).baseSpecies;
      if (base !== 'Latios' && base !== 'Latias') return power;
      return ['Psychic', 'Dragon'].includes(move.type) ? Math.floor(power * 1.2) : power;
    },
  });
  const orb = (users, types) => ({
    onBasePower(battle, source, target, move, power) {
      if (!users.includes(Dex.species(source.species).baseSpecies)) return power;
      return types.includes(move.type) ? Math.floor(power * 1.2) : power;
    },
  });
  define('Adamant Orb', orb(['Dialga'], ['Steel', 'Dragon']));
  define('Lustrous Orb', orb(['Palkia'], ['Water', 'Dragon']));
  define('Griseous Orb', orb(['Giratina'], ['Ghost', 'Dragon']));
  define('Adamant Crystal', orb(['Dialga'], ['Steel', 'Dragon']));
  define('Lustrous Globe', orb(['Palkia'], ['Water', 'Dragon']));
  define('Griseous Core', orb(['Giratina'], ['Ghost', 'Dragon']));

  /*
   * The three Ogerpon Masks — one item with two effects, and two owners.
   *
   * The **engine** owns the forme change: each Mask is in
   * `Mechanics.FORME_CHANGE_ITEMS`, so a base Ogerpon holding one arrives as
   * the masked forme (PROJECT_CONTEXT §5). This is the other half, and it has
   * to exist. A forme item counts as *implemented* in `Items.coverage()`
   * precisely because the engine implements it — so wiring the forme change
   * while leaving the 1.2x unwritten would relabel three items from "inert by
   * design" to "implemented" and ship half of each one's own description doing
   * nothing. That is §8's most-repeated bug, and the coverage label is what
   * makes it invisible.
   *
   * **Gated on the holder's packaged `requiredItem`, not on a forme name.**
   * That field is the data's own statement of "this forme is the one this Mask
   * makes", so it covers all three masked formes and their Tera formes with no
   * list to maintain, and it cannot drift the way a hardcoded name can. It also
   * refuses to pay a bare Teal Ogerpon that somehow holds a Mask without having
   * transformed, which a `baseSpecies === 'Ogerpon'` test would not.
   *
   * Unlike every entry in `TYPE_BOOSTERS` this is type-agnostic: it is 1.2x on
   * everything the holder throws, which is what the item's own text says.
   */
  const ogerponMask = name => define(name, {
    onBasePower(battle, source, target, move, power) {
      const required = Dex.species(source.species).requiredItem;
      return Dex.toID(required) === Dex.toID(name) ? Math.floor(power * 1.2) : power;
    },
  });
  ogerponMask('Hearthflame Mask');
  ogerponMask('Wellspring Mask');
  ogerponMask('Cornerstone Mask');

  /* ---------------------------------------------------------------- *
   * Reactive stat items and terrain seeds
   * ---------------------------------------------------------------- */

  const reactiveBoost = (type, boosts) => ({
    consumable: true,
    onDamagingHit(battle, target, source, move) {
      if (move.type !== type || move.category === 'Status') return;
      battle.consumeItem(target, `${battle.label(target)}'s ${Dex.item(target.consumedItem || '')?.name || 'item'} activated!`);
      battle.boost(target, boosts, target);
    },
  });
  define('Absorb Bulb', reactiveBoost('Water', {spa: 1}));
  define('Cell Battery', reactiveBoost('Electric', {atk: 1}));
  define('Snowball', reactiveBoost('Ice', {atk: 1}));
  define('Luminous Moss', reactiveBoost('Water', {spd: 1}));

  const terrainSeed = (terrain, boosts) => ({
    consumable: true,
    onUpdate(battle, pokemon) {
      if (battle.field.terrain !== terrain || !battle.isGrounded(pokemon)) return;
      battle.consumeItem(pokemon, `${battle.label(pokemon)} used its Seed!`);
      battle.boost(pokemon, boosts, pokemon);
    },
  });
  define('Electric Seed', terrainSeed('electric', {def: 1}));
  define('Grassy Seed', terrainSeed('grassy', {def: 1}));
  define('Misty Seed', terrainSeed('misty', {spd: 1}));
  define('Psychic Seed', terrainSeed('psychic', {spd: 1}));

  define('Eject Pack', {
    consumable: true,
    onAfterBoostTaken(battle, pokemon, boosts) {
      if (!Object.values(boosts).some(v => v < 0)) return;
      battle.consumeItem(pokemon, `${battle.label(pokemon)} is switched out by the Eject Pack!`);
      battle.requestSwitchOut(pokemon, 'Eject Pack');
    },
  });
  define('Mental Herb', {
    consumable: true,
    onUpdate(battle, pokemon) {
      const blocked = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'].filter(key => pokemon.volatiles[key]);
      if (!blocked.length) return;
      for (const key of blocked) delete pokemon.volatiles[key];
      battle.consumeItem(pokemon, `${battle.label(pokemon)} used its Mental Herb!`);
    },
  });
  define('Adrenaline Orb', {
    consumable: true,
    onAfterBoostTaken(battle, pokemon, boosts, source) {
      if (!source || Dex.toID(source.ability) !== 'intimidate') return;
      battle.consumeItem(pokemon, `${battle.label(pokemon)} used its Adrenaline Orb!`);
      battle.boost(pokemon, {spe: 1}, pokemon);
    },
  });

  define('Binding Band', {bindingMultiplier: 2});
  define('Shed Shell', {escapesTrapping: true});
  /*
   * Project redesign: offensive, not defensive. Upstream Ring Target strips the
   * *holder's* own immunities — a pure drawback nobody equips. It now lets the
   * holder's attacks land for neutral damage on a target that would be immune
   * by type. Read in `battle.effectiveness`; the description override lives in
   * `ITEM_OVERRIDES`, because upstream's text states the old mechanic.
   */
  /*
   * `publicItem` is a deliberate hole in `hideOpponentDetails`, and Ring Target
   * is the only thing that carries it. The item decides whole matchups — it
   * turns a type immunity, the hardest read in the game, into neutral damage —
   * so an opponent who cannot see it cannot plan around it, and finds out by
   * losing a Pokémon. It is announced at Team Preview and on the mon card from
   * turn one, like a Mega Stone rather than like a Choice Band.
   */
  define('Ring Target', {piercesImmunities: true, publicItem: true, uniquePerSide: true});
  define('Stick', {critStageBonus: 2, itemUsers: ['farfetchd', 'farfetchdgalar', 'sirfetchd']});
  define('Iron Ball', {
    grounded: true,
    onModifyStat(battle, pokemon, stat, value) { return stat === 'spe' ? Math.floor(value * 0.5) : value; },
  });
  define('Float Stone', {
    onModifyWeight(battle, pokemon, weight) { return weight / 2; },
  });
  define('Lagging Tail', {onFractionalPriority() { return -0.2; }});
  define('Full Incense', {onFractionalPriority() { return -0.2; }});
  define('Macho Brace', {
    onModifyStat(battle, pokemon, stat, value) { return stat === 'spe' ? Math.floor(value * 0.5) : value; },
  });
  define('Destiny Knot', {
    onDamagingHit(battle, target, source, move) {
      if (target.volatiles.attract && !source.volatiles.attract) battle.addVolatile(source, 'attract', target);
    },
  });

  /** Type gems: one-shot 1.3x boost for the matching type. */
  for (const type of Dex.TYPES) {
    const name = `${type} Gem`;
    if (!Dex.item(name)) continue;
    define(name, {
      consumable: true,
      onBasePower(battle, source, target, move, power) {
        if (move.type !== type || move.category === 'Status') return power;
        battle.consumeItem(source, `${battle.label(source)}'s ${name} strengthened its attack!`);
        return Math.floor(power * 1.3);
      },
    });
  }

  /** Retaliation berries: chip the attacker after a matching hit. */
  const retaliationBerry = (name, category) => define(name, {
    consumable: true, isBerry: true,
    onDamagingHit(battle, target, source, move) {
      if (move.category !== category || source.fainted) return;
      battle.eatBerry(target, `${battle.label(target)}'s ${name} hurt ${battle.label(source)}!`);
      battle.damage(source, Math.max(1, battle.ripen(target, Math.floor(source.maxHP / 8))), {indirect: true});
    },
  });
  retaliationBerry('Jaboca Berry', 'Physical');
  retaliationBerry('Rowap Berry', 'Special');

  const defensiveBerry = (name, category, stat) => define(name, {
    consumable: true, isBerry: true,
    onDamagingHit(battle, target, source, move, damage, critical) {
      if (!critical || move.category !== category) return;
      battle.eatBerry(target, `${battle.label(target)} used its ${name}!`);
      battle.boost(target, {[stat]: battle.ripen(target, 1)}, target);
    },
  });
  defensiveBerry('Kee Berry', 'Physical', 'def');
  defensiveBerry('Maranga Berry', 'Special', 'spd');

  define('Micle Berry', {
    consumable: true, isBerry: true,
    onUpdate(battle, pokemon) {
      if (pokemon.currentHP > battle.pinchBerryThreshold(pokemon) || pokemon.currentHP <= 0) return;
      battle.eatBerry(pokemon, `${battle.label(pokemon)} used its Micle Berry!`);
      pokemon.volatiles.micle = true;
    },
    onModifyAccuracy(battle, source, target, move, accuracy) {
      if (!source.volatiles.micle || accuracy == null) return accuracy;
      delete source.volatiles.micle;
      return accuracy * 1.2;
    },
  });
  define('Lansat Berry', {
    consumable: true, isBerry: true,
    onUpdate(battle, pokemon) {
      if (pokemon.currentHP > battle.pinchBerryThreshold(pokemon) || pokemon.currentHP <= 0) return;
      battle.eatBerry(pokemon, `${battle.label(pokemon)} used its Lansat Berry!`);
      pokemon.volatiles.focusenergy = true;
    },
  });
  define('Enigma Berry', {
    consumable: true, isBerry: true,
    onDamagingHit(battle, target, source, move) {
      if (battle.effectiveness(move.type, target, move) <= 1) return;
      battle.eatBerry(target, `${battle.label(target)} restored HP using its Enigma Berry!`);
      battle.heal(target, battle.ripen(target, Math.floor(target.maxHP / 4)), {silent: true});
    },
  });

  /* ---------------------------------------------------------------- *
   * Registry surface
   * ---------------------------------------------------------------- */

  /**
   * Items that are legitimately inert in battle (evolution stones, key items,
   * TMs, Mega Stones — Mega Evolution is not a supported battle mechanic and
   * Mega formes are instead selectable species in Mega-enabled formats).
   */
  const INERT_PATTERNS = [
    /no competitive use/i, /has no effect/i, /cannot be eaten by the holder/i,
    /can be revived into/i, /used for hyper training/i, /^a .*that gives off/i,
    /used to (teach|make|create)/i, /sold/i, /^used in/i, /raises .* friendship/i,
    /increases .* ev/i, /^a .*(mail|letter)/i, /lowers a .*ev/i,
    /triggers its primal reversion/i, /mega evolution/i,
  ];

  /**
   * Items whose only role is out-of-battle: teaching, reviving, EV training.
   *
   * `.* Mask$` used to be here and was **deleted** (2026-08-16), not left
   * behind. It matched exactly the three Ogerpon Masks and nothing else in the
   * 560-item set, so it was a blanket ruling that those three are inert by
   * design — while each one's own packaged description states a 1.2x power
   * boost. They are implemented now, both halves, so the clause would be
   * unreachable: `isCosmetic` returns false for a forme item on the line above
   * this table's only use. An unreachable guard that states a decision the code
   * no longer makes is the shape §8 keeps recording, so it goes rather than
   * sitting here looking authoritative.
   */
  const INERT_NAMES = /^(TR\d+|TM\d+|Fossilized |Mail$|Power (Anklet|Band|Belt|Bracer|Lens|Weight)$)/;

  /**
   * Items the *engine* implements rather than this registry: Mega Stones and the
   * entry-transformation items (Red Orb, Rusted Sword, Griseous Orb, Hero
   * Charm). They have no hooks here because the forme change is engine
   * behaviour, but they are fully simulated and must be reported as such —
   * counting them as "inert by design" understates coverage, and counting them
   * as "not simulated" is simply false.
   */
  function isFormeItem(itemId) {
    const item = Dex.item(itemId);
    if (!item) return false;
    return !!item.megaStone || !!RedGPT.Mechanics?.FORME_CHANGE_ITEMS?.[item.id];
  }

  function isCosmetic(itemId) {
    const item = Dex.item(itemId);
    if (!item) return false;
    if (isFormeItem(itemId)) return false;
    if (INERT_NAMES.test(item.name)) return true;
    if (item.zMove) return true;
    if (item.isPokeball) return true;
    if (item.onPlate || item.onMemory || item.onDrive) return true;
    const desc = item.shortDesc || '';
    if (!desc) return true;
    if (INERT_PATTERNS.some(pattern => pattern.test(desc))) return true;
    if (/evolv|evolution/i.test(desc)) return true;
    return false;
  }

  function get(value) {
    const id = Dex.toID(typeof value === 'string' ? value : value?.item);
    return Items[id] || null;
  }

  function isSimulated(itemId) {
    const id = Dex.toID(itemId);
    return !!Items[id] || isFormeItem(id) || isCosmetic(id);
  }

  function coverage() {
    const all = Object.keys(Dex.allItems);
    const works = id => !!Items[id] || isFormeItem(id);
    const implemented = all.filter(works);
    const cosmetic = all.filter(id => !works(id) && isCosmetic(id));
    const missing = all.filter(id => !works(id) && !isCosmetic(id));
    return {total: all.length, implemented, cosmetic, missing};
  }

  /** Items worth surfacing in Team Builder shortcuts and Campaign rewards. */
  const COMPETITIVE_ITEMS = Object.keys(Items).filter(id => Dex.item(id));

  global.RedGPT.Items = {registry: Items, define, get, isSimulated, isCosmetic, isFormeItem, coverage, COMPETITIVE_ITEMS, TYPE_BOOSTERS, RESIST_BERRIES};
})(typeof window !== 'undefined' ? window : globalThis);
