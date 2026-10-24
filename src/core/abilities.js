/**
 * Ability effect registry.
 *
 * Abilities are declared as data with named hooks rather than as branches
 * inside the move executor. The battle engine calls `Abilities.run(...)` at
 * fixed points; anything absent from this registry has no battle effect and is
 * reported as "not simulated" by the coverage audit and in the UI.
 *
 * Hook reference (all receive the Battle as first argument):
 *   onStart(battle, pokemon)                                  switch-in / battle start
 *   onSwitchOut(battle, pokemon)
 *   onBeforeMove(battle, pokemon, move, target) -> false      cancel the move
 *   onModifyMove(battle, pokemon, move, target)               mutate the move copy
 *   onModifyStat(battle, pokemon, stat, value) -> number
 *   onBasePower(battle, source, target, move, power) -> number
 *   onModifyDamage(battle, source, target, move, damage) -> number     attacker side
 *   onSourceModifyDamage(battle, target, source, move, damage) -> number  defender side
 *   onModifyAccuracy(battle, source, target, move, accuracy) -> number|null
 *   onTryHit(battle, target, source, move) -> 'immune'|'absorb'|false
 *   onDamagingHit(battle, target, source, move, damage)
 *   onAfterMove(battle, source, target, move, result)
 *   onSetStatus(battle, pokemon, status, source) -> false     block the status
 *   onTryBoost(battle, pokemon, boosts, source)               mutate/delete entries
 *   onAfterBoost(battle, pokemon, boosts, source)
 *   onResidual(battle, pokemon)                               end of turn
 *   residualFraction(battle, pokemon) -> signed fraction of maxHP
 *       What `onResidual` will do to this Pokémon's HP, as a *prediction*:
 *       positive heals, negative damages, 0 for a residual that touches no HP.
 *       Read by `battle.residualSwing`, which the AI uses to know that stalling
 *       behind Protect is worth something to a Leftovers or Poison Heal holder.
 *       It has to be declared rather than measured because running the hook
 *       would really heal the Pokémon, and asking what a turn *would* do must
 *       never change anything. A test runs a real residual turn for every
 *       definition that declares one and fails if the two disagree, so the
 *       prediction cannot drift away from the hook.
 *   onWeatherDamage(battle, pokemon, weather) -> false        immune to chip
 *   onFaint(battle, pokemon, source, move)
 *   onFoeFaint(battle, pokemon, fainted)
 *   onImmunity(battle, pokemon, type) -> true                 grants immunity
 *   onCriticalHit(battle, target, source, move) -> false      blocks crits
 *   onTrapped(battle, pokemon, foe) -> true                   foe cannot switch
 *   onFractionalPriority(battle, pokemon, move) -> number
 *   onModifyPriority(battle, pokemon, move, priority) -> number
 *   onAnyWeatherStart / onTerrainStart
 *
 * Flags:
 *   breaksMold      ignores the target's defensive abilities (Mold Breaker
 *                   family), including Dark Aura and Fairy Aura
 *   unignorable     survives Mold Breaker
 *
 * There is no weather-suppression flag: Air Lock and Cloud Nine delete the
 * weather on entry instead (battle.clearWeather).
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Dex = RedGPT.Dex;

  const WEATHER_SPEED = {sun: 'Chlorophyll', rain: 'Swift Swim', sandstorm: 'Sand Rush', snow: 'Slush Rush', hail: 'Slush Rush'};

  /** Ability id -> effect object. */
  const Abilities = {};

  function define(name, effect) {
    const id = Dex.toID(name);
    Abilities[id] = Object.assign({id, name}, effect);
    return Abilities[id];
  }

  /* ---------------------------------------------------------------- *
   * Switch-in / field setting
   * ---------------------------------------------------------------- */

  define('Intimidate', {
    onStart(battle, pokemon) {
      const foe = battle.foeActive(pokemon);
      if (!foe || foe.fainted) return;
      battle.add(`${battle.label(pokemon)}'s Intimidate cut ${battle.label(foe)}'s Attack!`);
      battle.boost(foe, {atk: -1}, pokemon, {silentFail: true});
    },
  });

  /*
   * `setsWeather` / `setsTerrain` are declarative copies of what the hook does,
   * and they are **read**, by `Campaign.buildRebirthTeam`: a Rebirth Sun team
   * that drafted a Drizzle holder for its bulk would wipe its own doctrine on
   * the switch-in. The weather is a closure argument here, so there is no way
   * to ask an ability what it sets without declaring it.
   *
   * §8's rule — a declared flag nothing reads is this project's most common
   * silent bug — is why these are named for the question they answer rather
   * than sitting unread beside the hook. If the hook's weather changes, change
   * these with it.
   */
  const weatherSetter = (weather, text) => ({
    setsWeather: weather,
    onStart(battle, pokemon) {
      if (battle.field.weather === weather) return;
      battle.setWeather(weather, pokemon, {source: 'ability', text});
    },
  });
  define('Drizzle', weatherSetter('rain', 'Drizzle'));
  define('Drought', weatherSetter('sun', 'Drought'));
  define('Sand Stream', weatherSetter('sandstorm', 'Sand Stream'));
  define('Snow Warning', weatherSetter('snow', 'Snow Warning'));
  /**
   * The primal weathers are not "rain and sun with a different message", which
   * is exactly what they were until now — both were plain `weatherSetter`
   * calls, so Primal Kyogre made ordinary rain and Primal Groudon ordinary sun.
   *
   * What actually makes them primal, all three implemented here and in
   * `battle.setWeather` / `clearWeather` / `executeMove`:
   *
   * - the opposing element **fails outright** (Fire under heavy rain, Water
   *   under extremely harsh sunlight) rather than merely being halved;
   * - no ordinary weather can replace them, and Air Lock cannot delete them;
   * - they have no turn count — they last until their setter leaves the field,
   *   which `clearOnSwitch` handles.
   *
   * They still read as `rain` / `sun` for everything else on purpose: Swift
   * Swim, Chlorophyll, Thunder's accuracy, Solar Beam and the STAB modifiers
   * are all correct under primal weather, and a separate weather id would have
   * meant auditing every one of them.
   */
  const primalWeatherSetter = (weather, ability, text) => ({
    setsWeather: weather,
    // Primal weather beats an endless one outright, so a Rebirth draft has to
    // refuse these on *any* weather doctrine, not only a conflicting one.
    setsPrimalWeather: true,
    onStart(battle, pokemon) {
      battle.setWeather(weather, pokemon, {source: 'ability', text, primal: ability});
    },
  });
  define('Desolate Land', primalWeatherSetter('sun', 'desolateland', 'Desolate Land'));
  define('Primordial Sea', primalWeatherSetter('rain', 'primordialsea', 'Primordial Sea'));
  define('Orichalcum Pulse', {
    setsWeather: 'sun',
    onStart(battle, pokemon) { battle.setWeather('sun', pokemon, {source: 'ability', text: 'Orichalcum Pulse'}); },
    onModifyStat(battle, pokemon, stat, value) {
      return stat === 'atk' && battle.effectiveWeather() === 'sun' ? Math.floor(value * 1.3333) : value;
    },
  });
  define('Hadron Engine', {
    setsTerrain: 'electric',
    onStart(battle, pokemon) { battle.setTerrain('electric', pokemon, {text: 'Hadron Engine'}); },
    onModifyStat(battle, pokemon, stat, value) {
      return stat === 'spa' && battle.field.terrain === 'electric' ? Math.floor(value * 1.3333) : value;
    },
  });

  const terrainSetter = (terrain, label) => ({
    setsTerrain: terrain,
    onStart(battle, pokemon) { battle.setTerrain(terrain, pokemon, {text: label}); },
  });
  define('Electric Surge', terrainSetter('electric', 'Electric Surge'));
  define('Grassy Surge', terrainSetter('grassy', 'Grassy Surge'));
  define('Misty Surge', terrainSetter('misty', 'Misty Surge'));
  define('Psychic Surge', terrainSetter('psychic', 'Psychic Surge'));

  /**
   * Project redesign: Air Lock and Cloud Nine do not suppress weather, they
   * delete it on entry. The weather is gone for good — it does not come back
   * when the holder leaves — but a later Drizzle or Rain Dance starts a fresh
   * one normally. Both share one implementation so they cannot drift apart.
   */
  const weatherWipe = name => ({
    onStart(battle, pokemon) {
      if (!battle.field.weather) return;
      battle.clearWeather({text: `${battle.label(pokemon)}'s ${name} blew the weather away!`});
    },
  });
  define('Air Lock', weatherWipe('Air Lock'));
  define('Cloud Nine', weatherWipe('Cloud Nine'));

  /**
   * Delta Stream — strong winds, **plus this project's own weather wipe**.
   *
   * Two separate effects, and only the first is upstream:
   *
   * - **Strong winds.** While a Delta Stream holder is on the field, the Flying
   *   type loses its weaknesses: Electric, Ice and Rock read 1x against the
   *   Flying half of any Flying-type Pokémon, on **both** sides. It is a field
   *   effect, not a personal one, exactly as in the games. Implemented in
   *   `battle.effectiveness` via `battle.strongWindsActive()`, which is the one
   *   function every damage estimate, the AI and the calculator already read —
   *   so nothing needed a second copy of the rule.
   * - **It deletes the active weather outright**, by project decision, the way
   *   this project redesigned Cloud Nine and Air Lock. Upstream Delta Stream is
   *   itself a weather that *replaces* the current one; here there is no
   *   fourth weather id, so "replaces" becomes "removes", which is the same
   *   thing from every other reader's point of view.
   *
   * **It beats primal weather, and Cloud Nine and Air Lock still do not.**
   * That asymmetry is the decision, not an oversight. The §5 reason those two
   * are refused is that a Psyduck switching in for free must not undo Primal
   * Groudon; Delta Stream is the *third member of the primal trio*, and in the
   * games the three mutually override each other — whichever arrives last owns
   * the field. Refusing it would make Rayquaza-Mega the one primal ability that
   * loses to the other two, which inverts the mechanic it exists for.
   *
   * The wipe fires on entry only, like Cloud Nine and Air Lock, so a Primal
   * Groudon switching in afterwards sets its sun again normally — which is how
   * "last one in wins" reproduces itself with no extra state. The strong winds
   * are independent of the weather slot and persist regardless, because making
   * them fight over it would need a fourth weather id and a re-audit of every
   * weather read — the exact cost §5 records for keeping primal weather reading
   * as `rain` / `sun`.
   */
  define('Delta Stream', {
    strongWinds: true,
    onStart(battle, pokemon) {
      battle.add(`${battle.label(pokemon)}'s Delta Stream whipped up a mysterious air current!`);
      if (!battle.field.weather) return;
      battle.clearWeather({force: true, text: 'The mysterious air current blew the weather away!'});
    },
  });

  /**
   * Mega Sol — the holder's own moves behave as though Sunny Day were up.
   *
   * Declared rather than hooked, because the engine already has exactly one
   * place that answers "what weather does *this* Pokémon's move see":
   * `battle.weatherFor(pokemon)`, built for Utility Umbrella. Every attacker-side
   * weather read goes through it — Solar Beam's charge, Thunder and Blizzard's
   * accuracy, Weather Ball's type and power, Hydro Steam, and the damage
   * modifier — so one line there gives Mega Sol all of them, including in
   * `AI.estimateDamage` and the damage calculator.
   *
   * It does **not** set the weather: nothing else on the field sees sun, the
   * holder's teammates get nothing, and Chlorophyll does not switch on. It also
   * does not beat primal weather's element block, which is a refusal in
   * `executeMove` rather than a weather reading — a Water move under Desolate
   * Land still fizzles.
   */
  define('Mega Sol', {
    personalWeather: 'sun',
    onStart(battle, pokemon) { battle.add(`${battle.label(pokemon)} is bathed in its own sunlight!`); },
  });

  /**
   * Project redesign: Download no longer reads the opponent's defences. It
   * always raises both offensive stats, through the normal boost path so the
   * ±6 cap and every stat-change interaction keep working.
   */
  define('Download', {
    onStart(battle, pokemon) {
      battle.add(`${battle.label(pokemon)} downloaded the opposing data!`);
      battle.boost(pokemon, {atk: 1, spa: 1}, pokemon);
    },
  });
  /**
   * Abilities Trace cannot copy — the current main-series list.
   *
   * Mostly form-defining or identity abilities: copying them onto another
   * species either means nothing or would imply a forme the copier does not
   * have. The list has to be an explicit set of ids because most of these have
   * no registry entry (they are inert by design), so a per-definition flag
   * alone would silently miss them — which is exactly what used to happen:
   * `uncopyable` was read here but never set anywhere, leaving Trace able to
   * copy everything.
   */
  const UNCOPYABLE = new Set([
    'asone', 'asoneglastrier', 'asonespectrier', 'battlebond', 'comatose', 'commander',
    'disguise', 'flowergift', 'forecast', 'gulpmissile', 'hadronengine', 'hungerswitch',
    'iceface', 'illusion', 'imposter', 'multitype', 'neutralizinggas', 'orichalcumpulse',
    'poisonpuppeteer', 'powerconstruct', 'powerofalchemy', 'protosynthesis', 'quarkdrive',
    'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'terashell',
    'terashift', 'teraformzero', 'trace', 'zenmode', 'zerotohero',
  ]);

  define('Trace', {
    onStart(battle, pokemon) {
      const foe = battle.foeActive(pokemon);
      if (!foe || foe.fainted || !foe.ability) return;
      if (UNCOPYABLE.has(Dex.toID(foe.ability))) return;
      pokemon.ability = foe.ability;
      battle.add(`${battle.label(pokemon)} traced ${battle.label(foe)}'s ${foe.ability}!`);
      battle.runAbility('onStart', pokemon);
    },
  });
  // Legacy behaviour: these fire on every entry, not once per battle. The
  // engine already clears `abilityState` on switch, so the old `used` guard
  // never actually did anything — it is gone so nothing reintroduces the limit.
  define('Intrepid Sword', {
    onStart(battle, pokemon) { battle.boost(pokemon, {atk: 1}, pokemon); },
  });
  define('Dauntless Shield', {
    onStart(battle, pokemon) { battle.boost(pokemon, {def: 1}, pokemon); },
  });
  define('Screen Cleaner', {
    onStart(battle, pokemon) {
      let cleared = false;
      for (const side of battle.sides) {
        for (const key of ['reflect', 'lightscreen', 'auroraveil']) {
          if (side.conditions[key] > 0) { side.conditions[key] = 0; cleared = true; }
        }
      }
      if (cleared) battle.add('All screens were cleared!');
    },
  });
  define('Unnerve', {
    onStart(battle, pokemon) { battle.add(`${battle.label(pokemon)} makes the opposing team too nervous to eat Berries!`); },
    foeBerryBlock: true,
  });
  define('Pressure', {
    onStart(battle, pokemon) { battle.add(`${battle.label(pokemon)} is exerting pressure!`); },
    extraPP: true,
  });
  /**
   * Project redesign: Supreme Overlord no longer counts fallen allies. It is an
   * entry booster with the same shape as Intrepid Sword — a real Attack stage,
   * every valid entry, no hidden damage multiplier.
   */
  define('Supreme Overlord', {
    onStart(battle, pokemon) { battle.boost(pokemon, {atk: 1}, pokemon); },
  });

  /**
   * Project redesign — Curious Medicine reaches the foe, because in singles it
   * has no ally to reach.
   *
   * Officially it resets its *allies'* stat stages on entry, which is a doubles
   * mechanic: with no ally on the field it does nothing at all, the same shape
   * as Pickup and Zero to Hero before they were redesigned (§5). Pointed at the
   * only other Pokémon on the field, it is an entry Haze — a real answer to a
   * Pokémon that has spent turns setting up.
   *
   * **Deliberately every stage, not only the positive ones**, because "reset to
   * 0" is what the ability does and the drawback is the honest half of it:
   * switching Slowking-Galar in behind an Intimidate throws that away too. It
   * writes `boosts` directly, exactly as Haze and Clear Smog do, so Clear Body
   * and Mirror Armor have nothing to say about it — a reset is not a stat drop.
   */
  define('Curious Medicine', {
    onStart(battle, pokemon) {
      const foe = battle.foeActive(pokemon);
      if (!foe || foe.fainted) return;
      if (!Object.values(foe.boosts).some(value => value !== 0)) return;
      foe.boosts = {atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0};
      battle.add(`${battle.label(pokemon)}'s Curious Medicine reset ${battle.label(foe)}'s stat changes!`);
    },
  });

  /**
   * Project redesign — Hospitality serves the bench.
   *
   * Officially it restores 1/4 of an *ally's* max HP on entry, another
   * doubles-only ability that is inert in singles. The teammates a singles
   * battle actually has are on the bench, so that is who Sinistcha pours for:
   * on entry it restores a quarter of the **most injured benched teammate's**
   * max HP.
   *
   * Most injured rather than random, so the effect is predictable enough to
   * play around — the whole point of the redesign is that a doubles ability
   * becomes a reason to bring the Pokémon. It writes `currentHP` directly the
   * way Regenerator does, because `battle.heal` emits a `heal` event and the
   * view has no card for a Pokémon that is not on the field.
   */
  define('Hospitality', {
    onStart(battle, pokemon) {
      const side = battle.sides[pokemon.side];
      const bench = side.team.filter(mate =>
        mate !== pokemon && !mate.fainted && mate.currentHP > 0 && mate.currentHP < mate.maxHP);
      if (!bench.length) return;
      const target = bench.reduce((best, mate) =>
        (mate.maxHP - mate.currentHP > best.maxHP - best.currentHP ? mate : best));
      const before = target.currentHP;
      target.currentHP = Math.min(target.maxHP, target.currentHP + Math.max(1, Math.floor(target.maxHP / 4)));
      battle.add(`${battle.label(pokemon)}'s Hospitality restored ${target.currentHP - before} HP to ${target.name}!`);
    },
  });

  /**
   * Supersweet Syrup — on entry, the foe's evasiveness falls a stage.
   *
   * Upstream limits it to once per battle. **Every entry here**, deliberately
   * and for the reason recorded above Intrepid Sword: `abilityState` is wiped
   * on every switch, so a per-battle guard would have to be stored somewhere
   * that survives one — and this project already chose the repeating version
   * for Intrepid Sword and Dauntless Shield, which are far stronger entry
   * effects than one stage of evasion.
   */
  define('Supersweet Syrup', {
    onStart(battle, pokemon) {
      const foe = battle.foeActive(pokemon);
      if (!foe || foe.fainted) return;
      battle.add(`${battle.label(pokemon)} spread a sweet, sticky syrup!`);
      battle.boost(foe, {evasion: -1}, pokemon, {silentFail: true});
    },
  });

  const proto = (statPicker, condition, label) => ({
    onStart(battle, pokemon) {
      const active = condition(battle, pokemon);
      if (!active) return;
      pokemon.abilityState.boostedStat = statPicker(battle, pokemon);
      battle.add(`${battle.label(pokemon)}'s ${label} boosted its ${Dex.STAT_NAMES[pokemon.abilityState.boostedStat]}!`);
    },
    onResidual(battle, pokemon) {
      const active = condition(battle, pokemon);
      if (active && !pokemon.abilityState.boostedStat) {
        pokemon.abilityState.boostedStat = statPicker(battle, pokemon);
        battle.add(`${battle.label(pokemon)}'s ${label} boosted its ${Dex.STAT_NAMES[pokemon.abilityState.boostedStat]}!`);
      } else if (!active && pokemon.abilityState.boostedStat) {
        pokemon.abilityState.boostedStat = null;
      }
    },
    onModifyStat(battle, pokemon, stat, value) {
      if (pokemon.abilityState.boostedStat !== stat) return value;
      return Math.floor(value * (stat === 'spe' ? 1.5 : 1.3));
    },
  });
  const highestStat = (battle, pokemon) => {
    let best = 'atk';
    for (const stat of ['atk', 'def', 'spa', 'spd', 'spe']) {
      if (battle.getStat(pokemon, stat) > battle.getStat(pokemon, best)) best = stat;
    }
    return best;
  };
  /** +1 to the highest stat on a knockout — Beast Boost, and Eelevate's second half. */
  const highestStatOnKO = {
    onFoeFaint(battle, pokemon) { battle.boost(pokemon, {[highestStat(battle, pokemon)]: 1}, pokemon); },
  };
  define('Protosynthesis', proto(highestStat, (battle, p) => battle.effectiveWeather() === 'sun' || p.item === 'boosterenergy', 'Protosynthesis'));
  define('Quark Drive', proto(highestStat, (battle, p) => battle.field.terrain === 'electric' || p.item === 'boosterenergy', 'Quark Drive'));

  /* ---------------------------------------------------------------- *
   * Type immunities and absorptions
   * ---------------------------------------------------------------- */

  const absorb = (type, effect) => ({
    onTryHit(battle, target, source, move) {
      if (move.type !== type || move.category === 'Status' || target === source) return;
      effect(battle, target);
      return 'absorb';
    },
  });
  define('Volt Absorb', absorb('Electric', (battle, target) => {
    if (!battle.heal(target, Math.floor(target.maxHP / 4))) battle.add(`${battle.label(target)}'s Volt Absorb had no effect.`);
    else battle.add(`${battle.label(target)} absorbed the electricity!`);
  }));
  define('Water Absorb', absorb('Water', (battle, target) => {
    battle.heal(target, Math.floor(target.maxHP / 4));
    battle.add(`${battle.label(target)} absorbed the water!`);
  }));
  define('Dry Skin', {
    onTryHit(battle, target, source, move) {
      if (move.type === 'Water' && move.category !== 'Status') {
        battle.heal(target, Math.floor(target.maxHP / 4));
        battle.add(`${battle.label(target)} absorbed the water!`);
        return 'absorb';
      }
    },
    onSourceModifyDamage(battle, target, source, move, damage) {
      return move.type === 'Fire' ? Math.floor(damage * 1.25) : damage;
    },
    residualFraction(battle) {
      const weather = battle.effectiveWeather();
      return weather === 'rain' ? 1 / 8 : (weather === 'sun' ? -1 / 8 : 0);
    },
    onResidual(battle, pokemon) {
      const weather = battle.effectiveWeather();
      if (weather === 'rain') battle.heal(pokemon, Math.floor(pokemon.maxHP / 8), {text: `${battle.label(pokemon)}'s Dry Skin drew in moisture.`});
      else if (weather === 'sun') battle.damage(pokemon, Math.floor(pokemon.maxHP / 8), {indirect: true, text: `${battle.label(pokemon)} was hurt by the sunlight!`});
    },
  });
  define('Earth Eater', absorb('Ground', (battle, target) => {
    battle.heal(target, Math.floor(target.maxHP / 4));
    battle.add(`${battle.label(target)} ate the ground!`);
  }));
  define('Well-Baked Body', {
    onTryHit(battle, target, source, move) {
      if (move.type !== 'Fire' || move.category === 'Status') return;
      battle.boost(target, {def: 2}, target);
      return 'absorb';
    },
  });
  define('Flash Fire', {
    onTryHit(battle, target, source, move) {
      if (move.type !== 'Fire' || move.category === 'Status') return;
      if (!target.volatiles.flashfire) {
        target.volatiles.flashfire = true;
        battle.add(`${battle.label(target)}'s Fire moves were powered up!`);
      }
      return 'absorb';
    },
    onBasePower(battle, source, target, move, power) {
      return source.volatiles.flashfire && move.type === 'Fire' ? Math.floor(power * 1.5) : power;
    },
  });
  const drawIn = (type, boost) => ({
    onTryHit(battle, target, source, move) {
      if (move.type !== type || move.category === 'Status' || target === source) return;
      battle.boost(target, boost, target);
      return 'absorb';
    },
  });
  define('Lightning Rod', drawIn('Electric', {spa: 1}));
  define('Storm Drain', drawIn('Water', {spa: 1}));
  define('Motor Drive', drawIn('Electric', {spe: 1}));
  define('Sap Sipper', drawIn('Grass', {atk: 1}));
  define('Wind Rider', {
    onTryHit(battle, target, source, move) {
      if (!move.flags?.wind) return;
      battle.boost(target, {atk: 1}, target);
      return 'absorb';
    },
  });
  /**
   * The Ground immunity, shared so Levitate and Eelevate cannot drift apart.
   *
   * Both halves are load-bearing and §8 records why: `ungrounded` only makes
   * `isGrounded` false (hazards, terrain, the Flying row of the type chart) and
   * does **not** stop a Ground move landing — the hook is what refuses it. Air
   * Balloon shipped with only the flag and ate full Earthquakes for a while.
   */
  const groundImmune = {
    ungrounded: true,
    onTryHit(battle, target, source, move) {
      if (move.type === 'Ground' && move.category !== 'Status' && !move.ignoreImmunity && move.id !== 'thousandarrows') return 'immune';
    },
  };
  define('Levitate', groundImmune);
  /**
   * Eelevate (Mega Eelektross) is **not** an `-ate` ability, despite the name —
   * it is Levitate and Beast Boost in one, which is what the packaged data
   * says. Guessing from the name would have produced a Normal-to-Electric
   * converter, which is a completely different ability.
   */
  define('Eelevate', Object.assign({}, groundImmune, highestStatOnKO));
  define('Wonder Guard', {
    onTryHit(battle, target, source, move) {
      if (move.category === 'Status') return;
      if (battle.effectiveness(move.type, target, move) <= 1) return 'immune';
    },
  });
  define('Bulletproof', {
    onTryHit(battle, target, source, move) { if (move.flags?.bullet) return 'immune'; },
  });
  define('Soundproof', {
    onTryHit(battle, target, source, move) { if (move.flags?.sound) return 'immune'; },
  });
  define('Overcoat', {
    onTryHit(battle, target, source, move) { if (move.flags?.powder) return 'immune'; },
    onWeatherDamage() { return false; },
  });
  define('Good as Gold', {
    // Refuses status moves aimed at the holder. Hazards are set on the side
    // rather than used on the Pokémon, so they still go up; moves the holder's
    // opponent aims at itself or its own side never reach this hook at all.
    onTryHit(battle, target, source, move) {
      if (move.category === 'Status' && target !== source && battle.aimedAtFoePokemon(move)) return 'immune';
    },
  });
  define('Magic Bounce', {
    onTryHit(battle, target, source, move) {
      if (move.category !== 'Status' || target === source || !move.flags?.reflectable) return;
      battle.add(`${battle.label(target)} bounced the ${move.name} back!`);
      battle.useMoveDirect(target, source, move, {bounced: true});
      return 'immune';
    },
  });
  define('Purifying Salt', {
    onSetStatus() { return false; },
    onSourceModifyDamage(battle, target, source, move, damage) {
      return move.type === 'Ghost' ? Math.floor(damage * 0.5) : damage;
    },
  });

  /* ---------------------------------------------------------------- *
   * Damage modification
   * ---------------------------------------------------------------- */

  define('Adaptability', {stabOverride: 2});
  define('Technician', {
    onBasePower(battle, source, target, move, power) { return power <= 60 ? Math.floor(power * 1.5) : power; },
  });
  define('Sheer Force', {
    onModifyMove(battle, pokemon, move) {
      if (!move.secondary && !move.secondaries?.length) return;
      move.secondary = null;
      move.secondaries = null;
      move.sheerForceBoosted = true;
    },
    onBasePower(battle, source, target, move, power) { return move.sheerForceBoosted ? Math.floor(power * 1.3) : power; },
  });
  const flagBoost = (flag, mult, extra) => ({
    onBasePower(battle, source, target, move, power) {
      return move.flags?.[flag] ? Math.floor(power * mult) : power;
    },
    ...extra,
  });
  define('Tough Claws', flagBoost('contact', 1.3));
  define('Strong Jaw', flagBoost('bite', 1.5));
  define('Mega Launcher', flagBoost('pulse', 1.5));
  define('Iron Fist', flagBoost('punch', 1.2));
  define('Sharpness', flagBoost('slicing', 1.5));
  define('Punk Rock', {
    onBasePower(battle, source, target, move, power) { return move.flags?.sound ? Math.floor(power * 1.3) : power; },
    onSourceModifyDamage(battle, target, source, move, damage) { return move.flags?.sound ? Math.floor(damage * 0.5) : damage; },
  });
  define('Reckless', {
    onBasePower(battle, source, target, move, power) { return move.recoil || move.hasCrashDamage ? Math.floor(power * 1.2) : power; },
  });
  define('Rivalry', {
    onBasePower(battle, source, target, move, power) {
      if (source.gender === 'N' || target.gender === 'N') return power;
      return source.gender === target.gender ? Math.floor(power * 1.25) : Math.floor(power * 0.75);
    },
  });
  /*
   * `readsTargetActed` is declared so `AI.estimateDamage` can tell that this
   * ability's value depends on turn order and project it, rather than matching
   * on the name — the §10 rule about matching a declared flag wherever one can
   * be added. It is read by `ai.js`, so it is not the §8 declared-but-inert
   * family; a test asserts something consumes it.
   */
  define('Analytic', {
    readsTargetActed: true,
    onBasePower(battle, source, target, move, power) { return target.hasActedThisTurn ? Math.floor(power * 1.3) : power; },
  });
  define('Tinted Lens', {
    onModifyDamage(battle, source, target, move, damage) {
      return battle.effectiveness(move.type, target, move) < 1 ? damage * 2 : damage;
    },
  });
  define('Neuroforce', {
    onModifyDamage(battle, source, target, move, damage) {
      return battle.effectiveness(move.type, target, move) > 1 ? Math.floor(damage * 1.25) : damage;
    },
  });
  define('Stakeout', {
    onBasePower(battle, source, target, move, power) { return target.switchedInThisTurn ? power * 2 : power; },
  });
  define('Solar Power', {
    onModifyStat(battle, pokemon, stat, value) {
      return stat === 'spa' && battle.effectiveWeather() === 'sun' ? Math.floor(value * 1.5) : value;
    },
    residualFraction(battle) { return battle.effectiveWeather() === 'sun' ? -1 / 8 : 0; },
    onResidual(battle, pokemon) {
      if (battle.effectiveWeather() === 'sun') battle.damage(pokemon, Math.floor(pokemon.maxHP / 8), {indirect: true, text: `${battle.label(pokemon)} was hurt by the sunlight!`});
    },
  });
  const pinch = (type, name) => ({
    onBasePower(battle, source, target, move, power) {
      return move.type === type && source.currentHP * 3 <= source.maxHP ? Math.floor(power * 1.5) : power;
    },
  });
  define('Overgrow', pinch('Grass'));
  define('Blaze', pinch('Fire'));
  define('Torrent', pinch('Water'));
  define('Swarm', pinch('Bug'));
  const typeSpecialist = (type, mult) => ({
    onBasePower(battle, source, target, move, power) { return move.type === type ? Math.floor(power * mult) : power; },
  });
  define('Transistor', typeSpecialist('Electric', 1.5));   // legacy value, not the 1.3x nerf
  define("Dragon's Maw", typeSpecialist('Dragon', 1.5));
  define('Steelworker', typeSpecialist('Steel', 1.5));
  define('Steely Spirit', typeSpecialist('Steel', 1.5));
  define('Rocky Payload', typeSpecialist('Rock', 1.5));
  /*
   * Fire Mane (Mega Pyroar) multiplies the holder's *offensive stat* by 1.5
   * while it uses a Fire attack. That is the same number in the same place as
   * the four type specialists above — attack and base power are both linear in
   * the damage formula and neither is floored before they meet — so it is
   * implemented as one of them rather than as an `onModifyStat` that would have
   * to be told which move is being used. It therefore reaches `estimateDamage`
   * and the calculator with nothing added.
   */
  define('Fire Mane', typeSpecialist('Fire', 1.5));
  define('Water Bubble', {
    onBasePower(battle, source, target, move, power) { return move.type === 'Water' ? power * 2 : power; },
    onSourceModifyDamage(battle, target, source, move, damage) { return move.type === 'Fire' ? Math.floor(damage * 0.5) : damage; },
    onSetStatus(battle, pokemon, status) { return status !== 'brn'; },
  });
  // Aerilate, Pixilate and Refrigerate are restored to their original 1.3x.
  // Galvanize was introduced after the nerf and never had 1.3x, so it keeps 1.2x.
  define('Aerilate', typeChanger('Flying', 1.3));
  define('Pixilate', typeChanger('Fairy', 1.3));
  define('Refrigerate', typeChanger('Ice', 1.3));
  define('Galvanize', typeChanger('Electric', 1.2));
  /*
   * Dragonize (Mega Feraligatr) is a Legends: Z-A ability and keeps the 1.2x it
   * shipped with, for exactly Galvanize's reason: the 1.3x restorations above
   * are *rollbacks of a nerf*, and an ability introduced after the nerf never
   * had 1.3x to roll back to. §5's standing exclusion of Legends-series values
   * points the same way.
   */
  define('Dragonize', typeChanger('Dragon', 1.2));
  const normalizeApplies = move => !(move.category === 'Status' && move.type === 'Normal');
  define('Normalize', {
    typeChange: {to: 'Normal', applies: normalizeApplies, power: 1.2},
    onModifyMove(battle, pokemon, move) {
      if (!normalizeApplies(move)) return;
      move.type = 'Normal';
      move.typeChangeBoosted = true;
    },
    onBasePower(battle, source, target, move, power) { return move.typeChangeBoosted ? Math.floor(power * 1.2) : power; },
  });

  /**
   * The `-ate` family: Normal attacks become `type` and hit harder.
   *
   * The conversion rule is declared as `typeChange` *and* used by the hook, so
   * the UI can show a move's real type without a second copy of the rule that
   * could drift out of step — see `Abilities.displayMoveType`.
   */
  function typeChanger(type, mult) {
    const applies = move => move.type === 'Normal' && move.category !== 'Status' && !move.callsMove;
    return {
      // `power` is a damage-time multiplier, not a change to the move's base
      // power stat — Pixilate leaves Hyper Beam at 150 BP and multiplies the
      // result by 1.3. Declared here so the UI can show the effective figure.
      typeChange: {to: type, applies, power: mult},
      onModifyMove(battle, pokemon, move) {
        if (!applies(move)) return;
        move.type = type;
        move.typeChangeBoosted = true;
      },
      onBasePower(battle, source, target, move, power) { return move.typeChangeBoosted ? Math.floor(power * mult) : power; },
    };
  }
  // Legacy behaviour: Protean and Libero re-trigger before every qualifying
  // move, not once per switch-in. There is deliberately no per-entry flag.
  const protean = name => ({
    onBeforeMove(battle, pokemon, move) {
      if (move.id === 'struggle' || move.callsMove) return;
      if (pokemon.types.length === 1 && pokemon.types[0] === move.type) return;
      pokemon.types = [move.type];
      battle.add(`${battle.label(pokemon)} transformed into the ${move.type} type!`);
    },
  });
  define('Protean', protean('Protean'));
  define('Libero', protean('Libero'));

  define('Huge Power', {
    onModifyStat(battle, pokemon, stat, value) { return stat === 'atk' ? value * 2 : value; },
  });
  define('Pure Power', {
    onModifyStat(battle, pokemon, stat, value) { return stat === 'atk' ? value * 2 : value; },
  });
  define('Hustle', {
    onModifyStat(battle, pokemon, stat, value) { return stat === 'atk' ? Math.floor(value * 1.5) : value; },
    onModifyAccuracy(battle, source, target, move, accuracy) {
      return move.category === 'Physical' && accuracy != null ? accuracy * 0.8 : accuracy;
    },
  });
  define('Guts', {
    onModifyStat(battle, pokemon, stat, value) { return stat === 'atk' && pokemon.status ? Math.floor(value * 1.5) : value; },
    ignoreBurnDrop: true,
  });
  define('Quick Feet', {
    onModifyStat(battle, pokemon, stat, value) { return stat === 'spe' && pokemon.status ? Math.floor(value * 1.5) : value; },
    ignoreParalysisDrop: true,
  });
  define('Marvel Scale', {
    onModifyStat(battle, pokemon, stat, value) { return stat === 'def' && pokemon.status ? Math.floor(value * 1.5) : value; },
  });
  define('Toxic Boost', {
    onModifyStat(battle, pokemon, stat, value) {
      return stat === 'atk' && ['psn', 'tox'].includes(pokemon.status) ? Math.floor(value * 1.5) : value;
    },
  });
  define('Flare Boost', {
    onModifyStat(battle, pokemon, stat, value) { return stat === 'spa' && pokemon.status === 'brn' ? Math.floor(value * 1.5) : value; },
  });
  define('Defeatist', {
    onModifyStat(battle, pokemon, stat, value) {
      return (stat === 'atk' || stat === 'spa') && pokemon.currentHP * 2 <= pokemon.maxHP ? Math.floor(value * 0.5) : value;
    },
  });
  define('Slow Start', {
    onStart(battle, pokemon) { pokemon.abilityState.slowStart = 5; battle.add(`${battle.label(pokemon)} can't get it going!`); },
    onResidual(battle, pokemon) {
      if (pokemon.abilityState.slowStart > 0 && --pokemon.abilityState.slowStart === 0) battle.add(`${battle.label(pokemon)} finally got its act together!`);
    },
    onModifyStat(battle, pokemon, stat, value) {
      return (stat === 'atk' || stat === 'spe') && pokemon.abilityState.slowStart > 0 ? Math.floor(value * 0.5) : value;
    },
  });
  define('Truant', {
    onBeforeMove(battle, pokemon) {
      pokemon.abilityState.loafing = !pokemon.abilityState.loafing;
      if (!pokemon.abilityState.loafing) {
        battle.add(`${battle.label(pokemon)} is loafing around!`);
        return false;
      }
    },
  });

  const weatherSpeed = weather => ({
    onModifyStat(battle, pokemon, stat, value) {
      return stat === 'spe' && battle.effectiveWeather() === weather ? value * 2 : value;
    },
  });
  define('Chlorophyll', weatherSpeed('sun'));
  define('Swift Swim', weatherSpeed('rain'));
  define('Sand Rush', {
    onModifyStat(battle, pokemon, stat, value) { return stat === 'spe' && battle.effectiveWeather() === 'sandstorm' ? value * 2 : value; },
    onWeatherDamage(battle, pokemon, weather) { return weather !== 'sandstorm'; },
  });
  define('Slush Rush', {
    onModifyStat(battle, pokemon, stat, value) { return stat === 'spe' && ['snow', 'hail'].includes(battle.effectiveWeather()) ? value * 2 : value; },
  });
  define('Sand Force', {
    onBasePower(battle, source, target, move, power) {
      return battle.effectiveWeather() === 'sandstorm' && ['Rock', 'Ground', 'Steel'].includes(move.type) ? Math.floor(power * 1.3) : power;
    },
    onWeatherDamage(battle, pokemon, weather) { return weather !== 'sandstorm'; },
  });
  define('Sand Veil', {
    onModifyAccuracy(battle, source, target, move, accuracy) {
      return battle.effectiveWeather() === 'sandstorm' && accuracy != null ? accuracy * 0.8 : accuracy;
    },
    onWeatherDamage(battle, pokemon, weather) { return weather !== 'sandstorm'; },
  });
  define('Snow Cloak', {
    onModifyAccuracy(battle, source, target, move, accuracy) {
      return ['snow', 'hail'].includes(battle.effectiveWeather()) && accuracy != null ? accuracy * 0.8 : accuracy;
    },
    onWeatherDamage(battle, pokemon, weather) { return !['snow', 'hail'].includes(weather); },
  });
  define('Ice Body', {
    residualFraction(battle) { return ['snow', 'hail'].includes(battle.effectiveWeather()) ? 1 / 16 : 0; },
    onResidual(battle, pokemon) {
      if (['snow', 'hail'].includes(battle.effectiveWeather())) battle.heal(pokemon, Math.floor(pokemon.maxHP / 16), {text: `${battle.label(pokemon)}'s Ice Body restored HP.`});
    },
    onWeatherDamage(battle, pokemon, weather) { return !['snow', 'hail'].includes(weather); },
  });
  define('Rain Dish', {
    residualFraction(battle) { return battle.effectiveWeather() === 'rain' ? 1 / 16 : 0; },
    onResidual(battle, pokemon) {
      if (battle.effectiveWeather() === 'rain') battle.heal(pokemon, Math.floor(pokemon.maxHP / 16), {text: `${battle.label(pokemon)}'s Rain Dish restored HP.`});
    },
  });
  // Legacy protections restored alongside the modern indirect-damage immunity:
  // Toxic Spikes cannot poison the holder, and it is never fully paralysed.
  // The paralysis Speed drop is untouched, and neither flag affects anything
  // that does not have Magic Guard.
  define('Magic Guard', {
    indirectImmune: true,
    toxicSpikesImmune: true,
    ignoreFullParalysis: true,
  });

  /* ---------------------------------------------------------------- *
   * Defensive reduction
   * ---------------------------------------------------------------- */

  const reduceSuperEffective = mult => ({
    onSourceModifyDamage(battle, target, source, move, damage) {
      return battle.effectiveness(move.type, target, move) > 1 ? Math.floor(damage * mult) : damage;
    },
  });
  define('Filter', reduceSuperEffective(0.75));
  define('Solid Rock', reduceSuperEffective(0.75));
  define('Prism Armor', Object.assign(reduceSuperEffective(0.75), {unignorable: true}));
  define('Multiscale', {
    onSourceModifyDamage(battle, target, source, move, damage) {
      return target.currentHP === target.maxHP ? Math.floor(damage * 0.5) : damage;
    },
  });
  define('Shadow Shield', Object.assign({
    onSourceModifyDamage(battle, target, source, move, damage) {
      return target.currentHP === target.maxHP ? Math.floor(damage * 0.5) : damage;
    },
  }, {unignorable: true}));
  define('Thick Fat', {
    onSourceModifyDamage(battle, target, source, move, damage) {
      return ['Fire', 'Ice'].includes(move.type) ? Math.floor(damage * 0.5) : damage;
    },
  });
  /*
   * Aura Guard — Lucario-Mega-Z's real Legends: Z-A ability, replacing the
   * Adaptability placeholder (see SPECIES_ABILITY_OVERRIDES in the generator).
   *
   * Flat halving of contact damage, unconditionally: no HP gate, unlike
   * Multiscale. That distinction is load-bearing for the AI — `estimateDamage`
   * runs the engine's own damage pipeline, so this is priced automatically and
   * must **NOT** be added to `AI.setupValue`'s `guarded` list beside Multiscale
   * and Shadow Shield. Those two are there because a full-HP halving buys a
   * *guaranteed turn*, the same thing a Focus Sash buys; Aura Guard buys no
   * such guarantee, and listing it would be the double-count AI_DESIGN §5
   * records for Multiscale's `effectiveHP` entry.
   *
   * It reads `move.flags.contact` rather than a move list, so any new contact
   * move is covered with nothing to maintain.
   *
   * **Long Reach bypasses this; Protective Pads does not — measured, and the
   * asymmetry is correct rather than an oversight.** Long Reach strips contact
   * in `onModifyMove`, so the damage pipeline never sees a contact move
   * (Rowlet's Tackle: 24-28 into an Aura Guard holder either way). Protective
   * Pads only hand a *contact-free copy* to the defender's **reactive** hooks
   * (§8 — so Rocky Helmet and Rough Skin opt out while Red Card still fires);
   * they never touch damage calculation, so a Pads Kingambit's Sucker Punch is
   * still halved, 49-58 against a control's 99-117. That reads correctly too:
   * the Pads protect their own holder from being punished for contact, which is
   * a different claim from "this move no longer makes contact".
   *
   * Worth knowing what this blunts in THIS project specifically: of the priority
   * moves §5 makes unconditional, Sucker Punch, Bullet Punch, Mach Punch,
   * Extreme Speed, Grassy Glide, First Impression, Upper Hand and Aqua Jet are
   * all contact. Ice Shard is the only common non-contact one.
   */
  define('Aura Guard', {
    onSourceModifyDamage(battle, target, source, move, damage) {
      return move.flags?.contact ? Math.floor(damage * 0.5) : damage;
    },
  });
  /*
   * Project redesign: Heatproof is a full Fire **immunity**, not a halving.
   * Shaped like the other absorbing abilities (`onTryHit` returning 'absorb')
   * rather than as a 0x damage modifier, so it refuses the move the way Flash
   * Fire and Water Absorb do — which is also the path `estimateDamage` and
   * `AI.cannotAffect` already know how to read.
   *
   * Status moves still land: this stops Fire *attacks*, like every other
   * type-absorbing ability here, so a Will-O-Wisp is unaffected.
   */
  define('Heatproof', {
    onTryHit(battle, target, source, move) {
      if (move.type !== 'Fire' || move.category === 'Status') return;
      battle.add(`${battle.label(target)} is unaffected by Fire!`);
      return 'absorb';
    },
  });
  define('Fluffy', {
    onSourceModifyDamage(battle, target, source, move, damage) {
      let value = damage;
      if (move.flags?.contact) value = Math.floor(value * 0.5);
      if (move.type === 'Fire') value = value * 2;
      return value;
    },
  });
  define('Ice Scales', {
    onSourceModifyDamage(battle, target, source, move, damage) { return move.category === 'Special' ? Math.floor(damage * 0.5) : damage; },
  });
  define('Sturdy', {
    onSourceModifyDamage(battle, target, source, move, damage) {
      if (target.currentHP === target.maxHP && damage >= target.currentHP) {
        target.volatiles.sturdyTriggered = true;
        return target.currentHP - 1;
      }
      return damage;
    },
    onTryHit(battle, target, source, move) { if (move.ohko) return 'immune'; },
  });
  define('Battle Armor', {onCriticalHit() { return false; }});
  define('Shell Armor', {onCriticalHit() { return false; }});
  define('Unaware', {ignoreOpponentBoosts: true});
  define('Simple', {boostMultiplier: 2});
  define('Contrary', {invertBoosts: true});
  define('Shield Dust', {blockSecondary: true});

  /* ---------------------------------------------------------------- *
   * Contact / retaliation
   * ---------------------------------------------------------------- */

  const contactStatus = (status, chance, label) => ({
    onDamagingHit(battle, target, source, move) {
      if (!move.flags?.contact || source.fainted) return;
      if (!battle.rng.chance(chance)) return;
      battle.setStatus(source, status, target, {text: `${battle.label(target)}'s ${label} took effect!`});
    },
  });
  define('Static', contactStatus('par', 0.3, 'Static'));
  define('Flame Body', contactStatus('brn', 0.3, 'Flame Body'));
  define('Poison Point', contactStatus('psn', 0.3, 'Poison Point'));
  /*
   * Spicy Spray (Mega Scovillain) is Flame Body without either of its two
   * conditions: **any** damaging hit, not only a contact one, and no roll. That
   * is what the packaged data says, and it is the whole ability — narrowing it
   * to contact or to a 30% chance would just be a second Flame Body.
   *
   * `contactStatus` is deliberately not reused: it is the shape of the three
   * abilities above, and sharing it would mean giving it two optional
   * parameters that only one caller ever sets.
   */
  define('Spicy Spray', {
    onDamagingHit(battle, target, source) {
      if (!source || source.fainted) return;
      battle.setStatus(source, 'brn', target, {text: `${battle.label(target)}'s Spicy Spray scalded ${battle.label(source)}!`});
    },
  });
  define('Effect Spore', {
    onDamagingHit(battle, target, source, move) {
      if (!move.flags?.contact || source.fainted || !battle.rng.chance(0.3)) return;
      battle.setStatus(source, battle.rng.pick(['par', 'psn', 'slp']), target, {text: `${battle.label(target)}'s Effect Spore took effect!`});
    },
  });
  define('Cute Charm', {
    onDamagingHit(battle, target, source, move) {
      if (!move.flags?.contact || !battle.rng.chance(0.3)) return;
      battle.addVolatile(source, 'attract', target);
    },
  });
  const contactRecoil = (fraction, label) => ({
    onDamagingHit(battle, target, source, move) {
      if (!move.flags?.contact || source.fainted) return;
      battle.damage(source, Math.max(1, Math.floor(source.maxHP * fraction)), {indirect: true, text: `${battle.label(source)} was hurt by ${label}!`});
    },
  });
  define('Rough Skin', contactRecoil(1 / 8, 'Rough Skin'));
  define('Iron Barbs', contactRecoil(1 / 8, 'Iron Barbs'));
  define('Aftermath', {
    onFaint(battle, pokemon, source, move) {
      if (!move?.flags?.contact || !source || source.fainted) return;
      battle.damage(source, Math.max(1, Math.floor(source.maxHP / 4)), {indirect: true, text: `${battle.label(source)} was hurt by Aftermath!`});
    },
  });
  define('Innards Out', {
    onFaint(battle, pokemon, source) {
      if (!source || source.fainted) return;
      const damage = pokemon.abilityState.lastDamage || 0;
      if (damage > 0) battle.damage(source, damage, {indirect: true, text: `${battle.label(source)} was hurt by Innards Out!`});
    },
  });
  define('Gooey', {
    onDamagingHit(battle, target, source, move) {
      if (move.flags?.contact) battle.boost(source, {spe: -1}, target);
    },
  });
  define('Tangling Hair', {
    onDamagingHit(battle, target, source, move) {
      if (move.flags?.contact) battle.boost(source, {spe: -1}, target);
    },
  });
  define('Cotton Down', {
    onDamagingHit(battle, target, source) { battle.boost(source, {spe: -1}, target); },
  });
  define('Sand Spit', {
    onDamagingHit(battle, target) { battle.setWeather('sandstorm', target, {source: 'ability', text: 'Sand Spit'}); },
  });
  define('Seed Sower', {
    onDamagingHit(battle, target) { battle.setTerrain('grassy', target, {text: 'Seed Sower'}); },
  });
  define('Steam Engine', {
    onDamagingHit(battle, target, source, move) {
      if (['Fire', 'Water'].includes(move.type)) battle.boost(target, {spe: 6}, target);
    },
  });
  define('Water Compaction', {
    onDamagingHit(battle, target, source, move) { if (move.type === 'Water') battle.boost(target, {def: 2}, target); },
  });
  define('Stamina', {
    onDamagingHit(battle, target) { battle.boost(target, {def: 1}, target); },
  });
  define('Justified', {
    onDamagingHit(battle, target, source, move) { if (move.type === 'Dark') battle.boost(target, {atk: 1}, target); },
  });
  define('Rattled', {
    onDamagingHit(battle, target, source, move) {
      if (['Dark', 'Bug', 'Ghost'].includes(move.type)) battle.boost(target, {spe: 1}, target);
    },
  });
  define('Weak Armor', {
    onDamagingHit(battle, target, source, move) {
      if (move.category === 'Physical') battle.boost(target, {def: -1, spe: 2}, target);
    },
  });
  define('Anger Shell', {
    onDamagingHit(battle, target, source, move, damage) {
      const before = target.currentHP + damage;
      if (before > target.maxHP / 2 && target.currentHP <= target.maxHP / 2 && target.currentHP > 0) {
        battle.boost(target, {atk: 1, spa: 1, spe: 1, def: -1, spd: -1}, target);
      }
    },
  });
  define('Toxic Debris', {
    onDamagingHit(battle, target, source, move) {
      if (move.category !== 'Physical') return;
      battle.addSideCondition(battle.sideOf(source), 'toxicspikes');
    },
  });
  define('Perish Body', {
    onDamagingHit(battle, target, source, move) {
      if (!move.flags?.contact || source.volatiles.perish != null) return;
      source.volatiles.perish = 4;
      target.volatiles.perish = 4;
      battle.add('Both Pokémon will faint in three turns!');
    },
  });
  /**
   * Mummy and Lingering Aroma are one mechanic under two names: contact
   * overwrites the attacker's Ability with the holder's. Shared so they cannot
   * drift, and because they have to know about each other — neither replaces
   * the other in the games, so the family is excluded as a pair.
   *
   * **This gives Mummy the exclusion list it never had.** It previously
   * overwrote *everything*, including the identity abilities that define a
   * forme — a Mummy'd Aegislash would have stopped changing stance and a
   * Mummy'd Arceus would have kept a typing its plate no longer justified.
   * `UNCOPYABLE` is already this project's single source of truth for that set
   * (it has to be an id set, because most of those abilities are inert by
   * design and carry no registry object), so it is reused rather than copied.
   */
  const ABILITY_SPREADERS = new Set(['mummy', 'lingeringaroma']);
  const abilitySpreader = name => ({
    onDamagingHit(battle, target, source, move) {
      if (!move.flags?.contact || !source || source.fainted) return;
      const current = Dex.toID(source.ability);
      if (ABILITY_SPREADERS.has(current) || UNCOPYABLE.has(current)) return;
      source.ability = name;
      battle.add(`${battle.label(source)}'s Ability became ${name}!`);
    },
  });
  define('Mummy', abilitySpreader('Mummy'));
  define('Lingering Aroma', abilitySpreader('Lingering Aroma'));
  define('Wandering Spirit', {
    onDamagingHit(battle, target, source, move) {
      if (!move.flags?.contact) return;
      const temp = source.ability;
      source.ability = target.ability;
      target.ability = temp;
      battle.add('The Pokémon swapped Abilities!');
    },
  });
  /**
   * Take `victim`'s held item and give it to `thief`, replacing whatever the thief
   * was already holding. The replaced item is destroyed, not swapped back.
   *
   * Shared by Magician and Pickpocket, which match Thief's redesign in this
   * project: stealing no longer requires empty hands (see PROJECT_CONTEXT §5).
   * Both guards matter and neither ability had them before:
   *  - `canRemoveItem(victim, thief)` protects the victim's Mega Stone, forme
   *    items and Sticky Hold. Both abilities previously assigned items directly,
   *    so **Pickpocket could steal a Mega Stone** — a real violation of §5's
   *    "cannot be removed" rule that the empty-hands check merely made rare.
   *  - `isOwnFormeItem(thief)` stops the thief destroying its *own* Mega Stone or
   *    Rusted Sword, a route that only became reachable once a thief could already
   *    be holding something.
   *
   * @returns {string|null} the stolen item id, or null if nothing was taken.
   */
  function stealHeldItem(battle, thief, victim) {
    if (!thief || !victim?.item) return null;
    if (!battle.canRemoveItem(victim, thief)) return null;
    if (battle.isOwnFormeItem(thief)) return null;
    // Ring Target Clause — one per side, enforced on every acquisition route.
    if (!battle.canReceiveItem(thief, victim.item)) return null;
    const stolen = victim.item;
    // The thief's old item is destroyed, so Pickup may find it later. The stolen
    // one is not recorded — it still exists, now in the thief's hands.
    battle.recordItemLoss(thief.item);
    thief.item = stolen;
    victim.item = null;
    return stolen;
  }

  define('Pickup', {
    /*
     * Redesigned: on entry, the holder picks up the **last item destroyed in this
     * battle**, replacing whatever it was holding.
     *
     * The official ability recovers an item an ally used that turn, which is a
     * doubles mechanic and did nothing here — Pickup sat in the `COSMETIC` set as
     * inert. This version scavenges the battle instead: something knocked off,
     * corroded, spent, or discarded to make room for a steal. Berries are excluded
     * (see `recordItemLoss`), so it cannot hand back a Sitrus somebody just ate.
     *
     * The record is cleared on pickup, so one Pokémon takes it rather than every
     * Pickup holder collecting the same item. `isOwnFormeItem` stops the holder
     * destroying its own Mega Stone or Rusted Sword to make room.
     */
    onStart(battle, pokemon) {
      const found = battle.lastRemovedItem;
      if (!found || !Dex.item(found)) return;
      if (battle.isOwnFormeItem(pokemon)) return;
      // Ring Target Clause — scavenging is an acquisition route like any other.
      if (!battle.canReceiveItem(pokemon, found)) return;
      const had = pokemon.item;
      pokemon.item = found;
      battle.lastRemovedItem = null;
      battle.add(had
        ? `${battle.label(pokemon)} picked up the ${Dex.item(found).name}, dropping its ${Dex.item(had).name}!`
        : `${battle.label(pokemon)} picked up the ${Dex.item(found).name}!`);
    },
  });

  define('Pickpocket', {
    onDamagingHit(battle, target, source, move) {
      if (!move.flags?.contact) return;
      const had = target.item;
      const stolen = stealHeldItem(battle, target, source);
      if (!stolen) return;
      battle.add(had
        ? `${battle.label(target)} pickpocketed ${battle.label(source)}'s ${Dex.item(stolen).name}, dropping its ${Dex.item(had).name}!`
        : `${battle.label(target)} pickpocketed ${battle.label(source)}'s item!`);
    },
  });
  define('Magician', {
    onAfterMove(battle, source, target, move, result) {
      if (!result || move.category === 'Status') return;
      const had = source.item;
      const stolen = stealHeldItem(battle, source, target);
      if (!stolen) return;
      battle.add(had
        ? `${battle.label(source)} stole ${battle.label(target)}'s ${Dex.item(stolen).name}, discarding its ${Dex.item(had).name}!`
        : `${battle.label(source)} stole ${battle.label(target)}'s item!`);
    },
  });
  define('Mirror Armor', {
    onTryBoost(battle, pokemon, boosts, source) {
      if (!source || source === pokemon) return;
      const reflected = {};
      for (const [key, value] of Object.entries(boosts)) {
        if (value < 0) { reflected[key] = value; delete boosts[key]; }
      }
      if (Object.keys(reflected).length) {
        battle.add(`${battle.label(pokemon)}'s Mirror Armor reflected the stat drop!`);
        battle.boost(source, reflected, pokemon, {noReflect: true});
      }
    },
  });

  /* ---------------------------------------------------------------- *
   * Stat-change protection
   * ---------------------------------------------------------------- */

  const protectStats = (keys, label) => ({
    onTryBoost(battle, pokemon, boosts, source) {
      if (!source || source === pokemon) return;
      let blocked = false;
      for (const key of keys) {
        if (boosts[key] < 0) { delete boosts[key]; blocked = true; }
      }
      if (blocked) battle.add(`${battle.label(pokemon)}'s ${label} prevents stat loss!`);
    },
  });
  const ALL_BOOST_KEYS = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'];
  define('Clear Body', protectStats(ALL_BOOST_KEYS, 'Clear Body'));
  define('White Smoke', protectStats(ALL_BOOST_KEYS, 'White Smoke'));
  define('Full Metal Body', Object.assign(protectStats(ALL_BOOST_KEYS, 'Full Metal Body'), {unignorable: true}));
  define('Hyper Cutter', protectStats(['atk'], 'Hyper Cutter'));
  define('Big Pecks', protectStats(['def'], 'Big Pecks'));
  define('Keen Eye', protectStats(['accuracy'], 'Keen Eye'));
  define('Illuminate', protectStats(['accuracy'], 'Illuminate'));
  define('Defiant', {
    onAfterBoost(battle, pokemon, boosts, source) {
      if (!source || source === pokemon) return;
      const drops = Object.values(boosts).filter(v => v < 0).length;
      if (drops) battle.boost(pokemon, {atk: 2 * drops}, pokemon);
    },
  });
  define('Competitive', {
    onAfterBoost(battle, pokemon, boosts, source) {
      if (!source || source === pokemon) return;
      const drops = Object.values(boosts).filter(v => v < 0).length;
      if (drops) battle.boost(pokemon, {spa: 2 * drops}, pokemon);
    },
  });
  define('Anger Point', {
    onDamagingHit(battle, target, source, move, damage, wasCritical) {
      if (wasCritical) battle.boost(target, {atk: 12}, target);
    },
  });

  /* ---------------------------------------------------------------- *
   * Status protection / healing
   * ---------------------------------------------------------------- */

  const statusImmune = (blocked, label) => ({
    onSetStatus(battle, pokemon, status) {
      if (blocked.includes(status)) return false;
    },
    onStart(battle, pokemon) {
      if (pokemon.status && blocked.includes(pokemon.status)) {
        pokemon.status = null;
        battle.add(`${battle.label(pokemon)}'s ${label} cured its status!`);
      }
    },
  });
  define('Immunity', statusImmune(['psn', 'tox'], 'Immunity'));
  define('Limber', statusImmune(['par'], 'Limber'));
  define('Insomnia', statusImmune(['slp'], 'Insomnia'));
  define('Vital Spirit', statusImmune(['slp'], 'Vital Spirit'));
  define('Water Veil', statusImmune(['brn'], 'Water Veil'));
  define('Magma Armor', statusImmune(['frz'], 'Magma Armor'));
  define('Thermal Exchange', {
    onSetStatus(battle, pokemon, status) { if (status === 'brn') return false; },
    onDamagingHit(battle, target, source, move) { if (move.type === 'Fire') battle.boost(target, {atk: 1}, target); },
  });
  define('Comatose', {
    onSetStatus() { return false; },
  });
  define('Sweet Veil', statusImmune(['slp'], 'Sweet Veil'));
  define('Leaf Guard', {
    onSetStatus(battle, pokemon) { if (battle.effectiveWeather() === 'sun') return false; },
  });
  define('Flower Veil', {
    onSetStatus(battle, pokemon) { if (pokemon.types.includes('Grass')) return false; },
  });
  define('Shields Down', {
    onSetStatus(battle, pokemon) { if (pokemon.currentHP * 2 > pokemon.maxHP) return false; },
  });
  define('Own Tempo', {
    onSetVolatile(battle, pokemon, volatile) { if (volatile === 'confusion') return false; },
  });
  define('Oblivious', {
    onSetVolatile(battle, pokemon, volatile) { if (['attract', 'taunt'].includes(volatile)) return false; },
    onTryBoost(battle, pokemon, boosts, source) {
      if (source && source !== pokemon && boosts.atk < 0 && source.ability === 'Intimidate') delete boosts.atk;
    },
  });
  define('Inner Focus', {
    onSetVolatile(battle, pokemon, volatile) { if (volatile === 'flinch') return false; },
    onTryBoost(battle, pokemon, boosts, source) {
      if (source && source !== pokemon && boosts.atk < 0 && source.ability === 'Intimidate') delete boosts.atk;
    },
  });
  define('Scrappy', {
    ignoreGhostImmunity: true,
    onTryBoost(battle, pokemon, boosts, source) {
      if (source && source !== pokemon && boosts.atk < 0 && source.ability === 'Intimidate') delete boosts.atk;
    },
  });
  define("Mind's Eye", {ignoreGhostImmunity: true, ignoreEvasion: true});
  define('Guard Dog', {
    onTryBoost(battle, pokemon, boosts, source) {
      if (source && source !== pokemon && boosts.atk < 0 && source.ability === 'Intimidate') {
        delete boosts.atk;
        battle.boost(pokemon, {atk: 1}, pokemon);
      }
    },
    trapImmune: true,
  });
  define('Steadfast', {
    onFlinch(battle, pokemon) { battle.boost(pokemon, {spe: 1}, pokemon); },
  });
  define('Natural Cure', {
    onSwitchOut(battle, pokemon) {
      if (pokemon.status) {
        pokemon.status = null;
        pokemon.statusData.toxicCounter = 1;
      }
    },
  });
  define('Regenerator', {
    onSwitchOut(battle, pokemon) {
      if (pokemon.currentHP > 0) pokemon.currentHP = Math.min(pokemon.maxHP, pokemon.currentHP + Math.floor(pokemon.maxHP / 3));
    },
  });
  define('Poison Heal', {
    indirectStatusImmune: ['psn', 'tox'],
    residualFraction(battle, pokemon) { return ['psn', 'tox'].includes(pokemon.status) ? 1 / 8 : 0; },
    onResidual(battle, pokemon) {
      if (['psn', 'tox'].includes(pokemon.status)) {
        battle.heal(pokemon, Math.floor(pokemon.maxHP / 8), {text: `${battle.label(pokemon)} restored HP with Poison Heal.`});
      }
    },
  });
  define('Healer', {});
  define('Hydration', {
    onResidual(battle, pokemon) {
      if (pokemon.status && battle.effectiveWeather() === 'rain') {
        pokemon.status = null;
        battle.add(`${battle.label(pokemon)}'s Hydration cured its status!`);
      }
    },
  });
  define('Shed Skin', {
    onResidual(battle, pokemon) {
      if (pokemon.status && battle.rng.chance(1 / 3)) {
        pokemon.status = null;
        battle.add(`${battle.label(pokemon)} shed its skin!`);
      }
    },
  });
  define('Speed Boost', {
    onResidual(battle, pokemon) {
      if (pokemon.activeSinceTurn < battle.turn) battle.boost(pokemon, {spe: 1}, pokemon);
    },
  });
  define('Moody', {
    onResidual(battle, pokemon) {
      const keys = ALL_BOOST_KEYS.filter(k => (pokemon.boosts[k] || 0) < 6);
      const drops = ALL_BOOST_KEYS.filter(k => (pokemon.boosts[k] || 0) > -6);
      const up = battle.rng.pick(keys);
      const down = battle.rng.pick(drops.filter(k => k !== up));
      const boosts = {};
      if (up) boosts[up] = 2;
      if (down) boosts[down] = -1;
      battle.boost(pokemon, boosts, pokemon);
    },
  });

  /* ---------------------------------------------------------------- *
   * KO rewards / priority / misc
   * ---------------------------------------------------------------- */

  const koBoost = (boost, label) => ({
    onFoeFaint(battle, pokemon) { battle.boost(pokemon, boost, pokemon); },
  });
  define('Moxie', koBoost({atk: 1}));
  define('Chilling Neigh', koBoost({atk: 1}));
  define('Grim Neigh', koBoost({spa: 1}));
  define('As One (Glastrier)', koBoost({atk: 1}));
  define('As One (Spectrier)', koBoost({spa: 1}));
  define('Beast Boost', highestStatOnKO);
  define('Soul-Heart', {
    onFoeFaint(battle, pokemon) { battle.boost(pokemon, {spa: 1}, pokemon); },
  });

  define('Prankster', {
    onModifyPriority(battle, pokemon, move, priority) { return move.category === 'Status' ? priority + 1 : priority; },
    prankster: true,
  });
  // Legacy behaviour: no full-HP requirement.
  define('Gale Wings', {
    onModifyPriority(battle, pokemon, move, priority) {
      return move.type === 'Flying' ? priority + 1 : priority;
    },
  });
  define('Triage', {
    onModifyPriority(battle, pokemon, move, priority) { return move.heal || move.drain ? priority + 3 : priority; },
  });
  define('Quick Draw', {
    onFractionalPriority(battle, pokemon, move) { return move.category !== 'Status' && battle.rng.chance(0.3) ? 0.1 : 0; },
  });
  define('Stall', {
    onFractionalPriority() { return -0.1; },
  });
  define('Dazzling', {blocksPriority: true});
  define('Queenly Majesty', {blocksPriority: true});
  define('Armor Tail', {blocksPriority: true});

  define('Serene Grace', {secondaryMultiplier: 2});
  define('Skill Link', {maxMultihit: true});
  define('Compound Eyes', {
    onModifyAccuracy(battle, source, target, move, accuracy) { return accuracy == null ? accuracy : accuracy * 1.3; },
  });
  define('Victory Star', {
    onModifyAccuracy(battle, source, target, move, accuracy) { return accuracy == null ? accuracy : accuracy * 1.1; },
  });
  define('No Guard', {
    onModifyAccuracy() { return null; },
  });
  define('Tangled Feet', {
    onModifyAccuracy(battle, source, target, move, accuracy) {
      return target.volatiles.confusion && accuracy != null ? accuracy * 0.5 : accuracy;
    },
  });
  define('Super Luck', {critStageBonus: 1});
  define('Sniper', {critMultiplier: 2.25});
  define('Merciless', {alwaysCritPoisoned: true});
  define('Unburden', {
    onResidual(battle, pokemon) {
      if (!pokemon.item && pokemon.consumedItem) pokemon.volatiles.unburden = true;
    },
    onModifyStat(battle, pokemon, stat, value) { return stat === 'spe' && pokemon.volatiles.unburden ? value * 2 : value; },
  });
  define('Shadow Tag', {
    onTrapped(battle, pokemon, foe) { return Dex.toID(foe.ability) !== 'shadowtag'; },
  });
  define('Arena Trap', {
    onTrapped(battle, pokemon, foe) { return battle.isGrounded(foe); },
  });
  define('Magnet Pull', {
    onTrapped(battle, pokemon, foe) { return foe.types.includes('Steel'); },
  });
  define('Mold Breaker', {breaksMold: true});
  define('Teravolt', {breaksMold: true});
  define('Turboblaze', {breaksMold: true});
  define('Neutralizing Gas', {
    onStart(battle, pokemon) { battle.add('Neutralizing gas filled the area!'); },
    suppressAbilities: true,
  });
  // Legacy behaviour: breaking the disguise costs no HP.
  // Both of these already blocked the hit; the forme change is what was
  // missing, so the busted sprites were never shown. `formeReverts` keeps the
  // forme tied to the volatile, which `clearOnSwitch` already wipes.
  define('Disguise', {
    formeReverts: true,
    onSourceModifyDamage(battle, target, source, move, damage) {
      if (target.volatiles.disguiseBusted || move.category === 'Status') return damage;
      target.volatiles.disguiseBusted = true;
      battle.add(`${battle.label(target)}'s disguise was busted!`);
      if (Dex.species(target.species).baseSpecies === 'Mimikyu') {
        battle.formeChange(target, 'mimikyubusted');
      }
      return 0;
    },
  });
  define('Ice Face', {
    formeReverts: true,
    onSourceModifyDamage(battle, target, source, move, damage) {
      if (target.volatiles.iceFaceBroken || move.category !== 'Physical') return damage;
      target.volatiles.iceFaceBroken = true;
      battle.add(`${battle.label(target)}'s Ice Face was broken!`);
      if (Dex.species(target.species).baseSpecies === 'Eiscue') battle.formeChange(target, 'eiscuenoice');
      return 0;
    },
  });
  define('Opportunist', {
    onFoeBoost(battle, pokemon, boosts) {
      const copy = {};
      for (const [k, v] of Object.entries(boosts)) if (v > 0) copy[k] = v;
      if (Object.keys(copy).length) {
        battle.add(`${battle.label(pokemon)} copied the stat boost!`);
        battle.boost(pokemon, copy, pokemon);
      }
    },
  });
  define('Toxic Chain', {
    onAfterMove(battle, source, target, move, result) {
      if (!result || move.category === 'Status' || !target || target.fainted) return;
      if (battle.rng.chance(0.3)) battle.setStatus(target, 'tox', source, {text: `${battle.label(source)}'s Toxic Chain took effect!`});
    },
  });
  /**
   * Poison Puppeteer — anything this Pokémon poisons is also confused.
   *
   * It needs a hook nothing had: `setStatus` already offers the *target's*
   * ability an `onAfterStatus` (that is Synchronize), but this is the
   * **inflicting** side, so `onAfterInflictStatus(battle, pokemon, target,
   * status)` was added beside it. Routing through `setStatus` rather than
   * through the move means every source counts — Toxic, a secondary effect,
   * Toxic Chain, and the holder's own Poison Point punishing a contact move.
   *
   * **The "if this Pokemon is a Pecharunt" clause is deliberately dropped.**
   * Pecharunt is the only species the data gives it to, so the gate changes
   * nothing in an ordinary battle — and in the one case where it *could* apply,
   * an ability moved by Skill Swap, Role Play or Entrainment, it would make the
   * copy silently do nothing, which is §8's most-repeated bug shape. Trace
   * already cannot take it: it is in `UNCOPYABLE`.
   */
  define('Poison Puppeteer', {
    onAfterInflictStatus(battle, pokemon, target, status) {
      if (status !== 'psn' && status !== 'tox') return;
      if (!target || target.fainted) return;
      battle.addVolatile(target, 'confusion', pokemon);
    },
  });
  define('Poison Touch', {
    onAfterMove(battle, source, target, move, result) {
      if (!result || !move.flags?.contact || !target || target.fainted) return;
      if (battle.rng.chance(0.3)) battle.setStatus(target, 'psn', source);
    },
  });
  define('Corrosion', {corrosion: true});
  define('Aura Break', {auraBreak: true});
  define('Fairy Aura', {aura: 'Fairy'});
  define('Dark Aura', {aura: 'Dark'});
  define('Grass Pelt', {
    onModifyStat(battle, pokemon, stat, value) {
      return stat === 'def' && battle.field.terrain === 'grassy' ? Math.floor(value * 1.5) : value;
    },
  });
  define('Surge Surfer', {
    onModifyStat(battle, pokemon, stat, value) {
      return stat === 'spe' && battle.field.terrain === 'electric' ? value * 2 : value;
    },
  });
  define('Costar', {});
  define('Cud Chew', {});
  define('Forewarn', {
    onStart(battle, pokemon) {
      const foe = battle.foeActive(pokemon);
      if (!foe) return;
      const strongest = [...foe.moves].map(m => Dex.move(m.id)).sort((a, b) => (b.basePower || 0) - (a.basePower || 0))[0];
      if (strongest) battle.add(`${battle.label(pokemon)}'s Forewarn sensed ${strongest.name}!`);
    },
  });
  define('Frisk', {
    onStart(battle, pokemon) {
      const foe = battle.foeActive(pokemon);
      if (foe?.item) battle.add(`${battle.label(pokemon)} frisked ${battle.label(foe)} and found its ${Dex.item(foe.item).name}!`);
    },
  });
  define('Anticipation', {
    onStart(battle, pokemon) {
      const foe = battle.foeActive(pokemon);
      if (!foe) return;
      const shudders = foe.moves.some(m => {
        const move = Dex.move(m.id);
        return move.category !== 'Status' && battle.effectiveness(move.type, pokemon, move) > 1;
      });
      if (shudders) battle.add(`${battle.label(pokemon)} shuddered with anticipation!`);
    },
  });
  define('Emergency Exit', {
    onDamagingHit(battle, target, source, move, damage) {
      const before = target.currentHP + damage;
      if (before > target.maxHP / 2 && target.currentHP <= target.maxHP / 2 && target.currentHP > 0) {
        battle.requestSwitchOut(target, 'Emergency Exit');
      }
    },
  });
  define('Wimp Out', Abilities[Dex.toID('Emergency Exit')]);

  /* ---------------------------------------------------------------- *
   * Forme-changing abilities
   *
   * These were all inert by design until now: the formes were packaged and
   * sprited, but nothing ever reached them, so an Aegislash never left Shield
   * forme and a Castform never changed with the weather.
   *
   * Two shapes:
   *   onFormeCheck   the forme is a *condition* (HP, weather, held plate), so
   *                  the engine polls it whenever those move
   *   onBeforeMove / onDamagingHit / onSwitchOut  the forme is an *event*
   *
   * `formeReverts: true` puts the holder back to its set's species when it
   * leaves the field. Battle-length changes (Mega, Primal, Battle Bond, Power
   * Construct) deliberately omit it.
   * ---------------------------------------------------------------- */

  /** Change forme only when the target is real and different. */
  const shiftForme = (battle, pokemon, targetId, text) => {
    if (!Dex.hasSpecies(targetId) || Dex.toID(pokemon.species) === Dex.toID(targetId)) return false;
    return battle.formeChange(pokemon, Dex.toID(targetId), {text});
  };

  /** The base species id of whatever forme the holder is currently in. */
  const baseOf = pokemon => Dex.toID(pokemon.set?.species || pokemon.species);

  define('Stance Change', {
    formeReverts: true,
    onBeforeMove(battle, pokemon, move) {
      if (Dex.species(pokemon.species).baseSpecies !== 'Aegislash' || !move) return;
      if (move.id === 'kingsshield') {
        shiftForme(battle, pokemon, 'aegislash', `${battle.label(pokemon)} returned to Shield Forme!`);
      } else if (move.category !== 'Status') {
        shiftForme(battle, pokemon, 'aegislashblade', `${battle.label(pokemon)} shifted to Blade Forme!`);
      }
    },
  });

  define('Zen Mode', {
    formeReverts: true,
    onFormeCheck(battle, pokemon) {
      if (Dex.species(pokemon.species).baseSpecies !== 'Darmanitan') return;
      // Galarian Darmanitan has its own Zen forme; `forme` still reads "Galar-Zen"
      // after the change, so this stays correct in both directions.
      const galar = (Dex.species(pokemon.species).forme || '').startsWith('Galar');
      const zen = galar ? 'darmanitangalarzen' : 'darmanitanzen';
      const calm = galar ? 'darmanitangalar' : 'darmanitan';
      if (pokemon.currentHP * 2 <= pokemon.maxHP) {
        shiftForme(battle, pokemon, zen, `${battle.label(pokemon)} triggered Zen Mode!`);
      } else {
        shiftForme(battle, pokemon, calm, `${battle.label(pokemon)} snapped out of Zen Mode!`);
      }
    },
  });

  define('Schooling', {
    formeReverts: true,
    onFormeCheck(battle, pokemon) {
      if (Dex.species(pokemon.species).baseSpecies !== 'Wishiwashi') return;
      // Too young to school, and it breaks apart below a quarter health.
      const schools = pokemon.level >= 20 && pokemon.currentHP * 4 > pokemon.maxHP;
      if (schools) shiftForme(battle, pokemon, 'wishiwashischool', `${battle.label(pokemon)} formed a school!`);
      else shiftForme(battle, pokemon, 'wishiwashi', `${battle.label(pokemon)}'s school scattered!`);
    },
  });

  /** Zygarde's Complete forme lasts the battle — no `formeReverts`. */
  define('Power Construct', {
    onFormeCheck(battle, pokemon) {
      if (Dex.species(pokemon.species).baseSpecies !== 'Zygarde') return;
      if (pokemon.currentHP * 2 > pokemon.maxHP) return;
      shiftForme(battle, pokemon, 'zygardecomplete', `${battle.label(pokemon)} called its cells to assemble!`);
    },
  });

  const CASTFORM_FORMES = {sun: 'castformsunny', rain: 'castformrainy', snow: 'castformsnowy', hail: 'castformsnowy'};
  define('Forecast', {
    formeReverts: true,
    onFormeCheck(battle, pokemon) {
      if (Dex.species(pokemon.species).baseSpecies !== 'Castform') return;
      const target = CASTFORM_FORMES[battle.effectiveWeather()] || 'castform';
      shiftForme(battle, pokemon, target, `${battle.label(pokemon)} transformed with the weather!`);
    },
  });

  define('Flower Gift', {
    formeReverts: true,
    onFormeCheck(battle, pokemon) {
      if (Dex.species(pokemon.species).baseSpecies !== 'Cherrim') return;
      const sunny = battle.effectiveWeather() === 'sun';
      shiftForme(battle, pokemon, sunny ? 'cherrimsunshine' : 'cherrim',
        sunny ? `${battle.label(pokemon)} bloomed in the sunlight!` : `${battle.label(pokemon)} folded back up!`);
    },
    // Sunshine Cherrim hits harder and takes special hits better.
    onModifyStat(battle, pokemon, stat, value) {
      if (battle.effectiveWeather() !== 'sun') return value;
      return (stat === 'atk' || stat === 'spd') ? Math.floor(value * 1.5) : value;
    },
  });

  define('Hunger Switch', {
    formeReverts: true,
    onResidual(battle, pokemon) {
      if (Dex.species(pokemon.species).baseSpecies !== 'Morpeko') return;
      const hangry = Dex.toID(pokemon.species) === 'morpekohangry';
      shiftForme(battle, pokemon, hangry ? 'morpeko' : 'morpekohangry',
        hangry ? `${battle.label(pokemon)} calmed down.` : `${battle.label(pokemon)} got hangry!`);
    },
  });

  define('Terashift', {
    onStart(battle, pokemon) {
      if (Dex.species(pokemon.species).baseSpecies !== 'Terapagos') return;
      shiftForme(battle, pokemon, 'terapagosterastal', `${battle.label(pokemon)} shifted into its Terastal Form!`);
    },
  });

  /**
   * Teraform Zero — Terastallizing wipes the weather and the terrain.
   *
   * `battle.terastallize` calls `onTerastallize`, a hook added for this; putting
   * the effect here rather than as a flag read in `battle.js` keeps it where
   * every other ability's behaviour lives.
   *
   * **It removes primal weather, which Cloud Nine and Air Lock cannot**, and the
   * rule separating the two is the price. §5 refuses those because a Psyduck
   * switching in is free, repeatable and incidental — it would make Primal
   * Groudon ordinary. Terastallizing is once per battle per side and spends the
   * single most valuable option Terapagos has; a cost that large buys the
   * effect. Delta Stream above gets there by the other route, membership of the
   * primal trio.
   *
   * Upstream's "once per battle" needs no guard: a side may Terastallize once,
   * so the hook can only fire once by construction.
   */
  define('Teraform Zero', {
    onTerastallize(battle, pokemon) {
      // Both, never short-circuited: a field with terrain but no weather still
      // has to be flattened.
      const weatherGone = battle.clearWeather({force: true});
      const terrainGone = battle.clearTerrain();
      if (weatherGone || terrainGone) battle.add(`${battle.label(pokemon)}'s Teraform Zero flattened the battlefield!`);
    },
  });

  /**
   * Project redesign: Zero to Hero is driven by a held item, not by switching.
   *
   * The official trigger — transform on switching *out* — is invisible while it
   * happens, cannot be planned around, and in a roguelite cannot be shopped
   * towards. Palafin now works like every other transformation Pokémon: hold the
   * Hero Charm (an item this project adds) and it enters battle in Hero Form.
   * The change is applied by `battle.applyHeldFormeChange` through
   * `Mechanics.FORME_CHANGE_ITEMS`, so the ability itself has no hook.
   */
  define('Zero to Hero', {formeItem: 'herocharm'});

  /**
   * Arceus and Silvally take their type — and their forme — from the held plate
   * or memory. The packaged item data records the type as `onPlate` / `onMemory`,
   * so the pairing is read rather than hardcoded.
   */
  const typeItemForme = (baseSpecies, field) => ({
    onFormeCheck(battle, pokemon) {
      if (Dex.species(pokemon.species).baseSpecies !== baseSpecies) return;
      const type = Dex.item(pokemon.item)?.[field];
      const target = type && type !== 'Normal' ? Dex.toID(`${baseSpecies}${type}`) : Dex.toID(baseSpecies);
      shiftForme(battle, pokemon, target, null);
    },
  });
  define('Multitype', typeItemForme('Arceus', 'onPlate'));
  define('RKS System', typeItemForme('Silvally', 'onMemory'));

  void baseOf;
  define('Embody Aspect (Teal)', {
    onStart(battle, pokemon) { battle.boost(pokemon, {spe: 1}, pokemon); },
  });
  define('Embody Aspect (Wellspring)', {
    onStart(battle, pokemon) { battle.boost(pokemon, {spd: 1}, pokemon); },
  });
  define('Embody Aspect (Hearthflame)', {
    onStart(battle, pokemon) { battle.boost(pokemon, {atk: 1}, pokemon); },
  });
  define('Embody Aspect (Cornerstone)', {
    onStart(battle, pokemon) { battle.boost(pokemon, {def: 1}, pokemon); },
  });
  define('Tera Shell', {
    onSourceModifyDamage(battle, target, source, move, damage) {
      if (target.currentHP < target.maxHP || move.category === 'Status') return damage;
      return Math.floor(damage * 0.5);
    },
  });

  /* ---------------------------------------------------------------- *
   * Remaining competitive abilities
   * ---------------------------------------------------------------- */

  define('Fur Coat', {
    onModifyStat(battle, pokemon, stat, value) { return stat === 'def' ? value * 2 : value; },
  });
  define('Rock Head', {ignoreRecoil: true});
  define('Infiltrator', {infiltrates: true});
  define('Cursed Body', {
    onDamagingHit(battle, target, source, move) {
      if (source.volatiles.disable || !source.lastMoveId || !battle.rng.chance(0.3)) return;
      source.volatiles.disable = {moveId: source.lastMoveId, turns: 4};
      battle.add(`${battle.label(source)}'s ${Dex.move(source.lastMoveId).name} was disabled by Cursed Body!`);
    },
  });
  define('Sticky Hold', {itemProtected: true});
  define('Suction Cups', {cannotBeForced: true});
  define('Long Reach', {
    onModifyMove(battle, pokemon, move) { if (move.flags?.contact) move.flags = Object.assign({}, move.flags, {contact: 0}); },
  });
  define('Unseen Fist', {
    onModifyMove(battle, pokemon, move) { if (move.flags?.contact) move.breaksProtect = true; },
  });
  /**
   * Piercing Drill (Mega Excadrill) is Unseen Fist with a price: contact moves
   * go through Protect, but a move that *had* to go through only lands for a
   * quarter of its damage — the same bargain a Z-Move strikes against a
   * protecting target.
   *
   * The reduction is charged on `move.brokeProtect`, which `executeMove` sets
   * when it actually shatters a protection, rather than on "the holder has this
   * ability". That distinction is the whole implementation: against a target
   * that did not Protect the move is completely ordinary, which is what makes
   * this a trade rather than a permanent 75% damage penalty. Unseen Fist is
   * unaffected — it declares no reduction, so the flag simply goes unread by it.
   */
  define('Piercing Drill', {
    onModifyMove(battle, pokemon, move) { if (move.flags?.contact) move.breaksProtect = true; },
    onModifyDamage(battle, source, target, move, damage) {
      return move.brokeProtect ? Math.max(1, Math.floor(damage * 0.25)) : damage;
    },
  });
  define('Early Bird', {fastWake: true});
  define('Damp', {
    onTryHit(battle, target, source, move) {
      if (move.id === 'selfdestruct' || move.id === 'explosion' || move.id === 'mistyexplosion') {
        battle.add(`${battle.label(target)}'s Damp prevents the explosion!`);
        return 'immune';
      }
    },
  });
  define('Liquid Ooze', {
    onDrained(battle, target, source, amount) {
      battle.damage(source, amount, {indirect: true, text: `${battle.label(source)} sucked up the liquid ooze!`});
      return true;
    },
  });
  const liquidVoiceApplies = move => !!move.flags?.sound && move.category !== 'Status';
  define('Liquid Voice', {
    typeChange: {to: 'Water', applies: liquidVoiceApplies},
    onModifyMove(battle, pokemon, move) { if (liquidVoiceApplies(move)) move.type = 'Water'; },
  });
  define('Synchronize', {
    onAfterStatus(battle, pokemon, status, source) {
      if (!source || source === pokemon || status === 'slp' || status === 'frz') return;
      battle.setStatus(source, status, pokemon, {text: `${battle.label(pokemon)}'s Synchronize passed on the condition!`});
    },
  });
  define('Berserk', {
    onDamagingHit(battle, target, source, move, damage) {
      const before = target.currentHP + damage;
      if (before > target.maxHP / 2 && target.currentHP <= target.maxHP / 2 && target.currentHP > 0) {
        battle.boost(target, {spa: 1}, target);
      }
    },
  });
  define('Gluttony', {earlyBerry: true});
  define('Ripen', {ripenBerry: true});
  define('Cheek Pouch', {
    onEatBerry(battle, pokemon) { battle.heal(pokemon, Math.floor(pokemon.maxHP / 3), {text: `${battle.label(pokemon)} restored HP with Cheek Pouch!`}); },
  });
  define('Harvest', {
    onResidual(battle, pokemon) {
      if (pokemon.item || !pokemon.consumedItem || !Dex.item(pokemon.consumedItem)?.isBerry) return;
      if (battle.effectiveWeather() !== 'sun' && !battle.rng.chance(0.5)) return;
      pokemon.item = pokemon.consumedItem;
      pokemon.consumedItem = null;
      battle.add(`${battle.label(pokemon)} harvested one ${Dex.item(pokemon.item).name}!`);
    },
  });
  define('Bad Dreams', {
    onResidual(battle, pokemon) {
      const foe = battle.foeActive(pokemon);
      if (foe && !foe.fainted && foe.status === 'slp') {
        battle.damage(foe, Math.max(1, Math.floor(foe.maxHP / 8)), {indirect: true, text: `${battle.label(foe)} is tormented by Bad Dreams!`});
      }
    },
  });
  /*
   * Project redesign. Both were weight-only, which reaches exactly three moves
   * (Low Kick, Grass Knot, Heat Crash) and nothing else — an ability slot spent
   * on a coin flip about the opponent's moveset. They now state a trade in
   * stat stages on entry, in the shape the weight already implied:
   *
   *   Light Metal — lighter, so faster: +1 Speed.
   *   Heavy Metal — heavier, so slower and sturdier: -2 Speed, +1 Defence,
   *                 +1 Attack.
   *
   * The weight multipliers are kept, so the three weight moves still read the
   * ability the way they always did.
   */
  define('Heavy Metal', {
    weightMultiplier: 2,
    onStart(battle, pokemon) { battle.boost(pokemon, {spe: -2, def: 1, atk: 1}, pokemon); },
  });
  define('Light Metal', {
    weightMultiplier: 0.5,
    onStart(battle, pokemon) { battle.boost(pokemon, {spe: 1}, pokemon); },
  });
  define('Klutz', {suppressItem: true});
  define('Color Change', {
    onDamagingHit(battle, target, source, move) {
      if (move.category === 'Status' || target.types.length === 1 && target.types[0] === move.type) return;
      target.types = [move.type];
      battle.add(`${battle.label(target)} became the ${move.type} type!`);
    },
  });
  // Propeller Tail and Stalwart ignore move redirection, which only exists in
  // doubles. They are listed as inert by design below rather than defined here,
  // so coverage() does not count them as implemented.
  define('Mycelium Might', {
    onFractionalPriority(battle, pokemon, move) { return move.category === 'Status' ? -0.15 : 0; },
    onModifyMove(battle, pokemon, move) { if (move.category === 'Status') move.ignoreAbility = true; },
  });
  define('Wind Power', {
    onDamagingHit(battle, target, source, move) { if (move.flags?.wind) target.volatiles.charge = 2; },
  });
  define('Electromorphosis', {
    onDamagingHit(battle, target) { target.volatiles.charge = 2; },
  });
  define('Wonder Skin', {
    onModifyAccuracy(battle, source, target, move, accuracy) {
      return move.category === 'Status' && accuracy != null && accuracy > 50 ? 50 : accuracy;
    },
  });
  define('Aroma Veil', {
    onSetVolatile(battle, pokemon, volatile) {
      if (['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'].includes(volatile)) return false;
    },
  });
  define('Pastel Veil', {
    onSetStatus(battle, pokemon, status) { if (status === 'psn' || status === 'tox') return false; },
  });
  define('Parental Bond', {parentalBond: true});

  /**
   * Legacy Battle Bond: KOing a Pokémon turns Greninja into Ash-Greninja,
   * rather than the Generation IX one-off +1 Atk/SpA/Spe.
   *
   * Any move that scores the KO triggers it. The transformation uses the
   * engine's `formeChange`, so it lasts for the battle and nothing leaks into
   * the saved team. Water Shuriken is deliberately not special-cased — it is an
   * ordinary 25 BP, 2-5 hit move for both formes.
   */
  define('Battle Bond', {
    onFoeFaint(battle, pokemon, fainted) {
      if (Dex.toID(pokemon.species) !== 'greninja' || pokemon.fainted) return;
      battle.formeChange(pokemon, 'greninjaash',
        {text: `${battle.label(pokemon)} became Ash-Greninja!`});
    },
  });

  /** The Ruin quartet each lower one opposing stat while active. */
  const ruin = (stat, label) => ({
    onStart(battle, pokemon) { battle.add(`${battle.label(pokemon)}'s ${label} weakened the ${Dex.STAT_NAMES[stat]} of all around!`); },
    ruinStat: stat,
  });
  define('Sword of Ruin', ruin('def', 'Sword of Ruin'));
  define('Beads of Ruin', ruin('spd', 'Beads of Ruin'));
  define('Tablets of Ruin', ruin('atk', 'Tablets of Ruin'));
  define('Vessel of Ruin', ruin('spa', 'Vessel of Ruin'));

  /** Abilities that deliberately have no battle effect outside the overworld. */
  // Battle Bond is implemented above (legacy Ash-Greninja transformation), so
  // it is no longer inert-by-design.
  const COSMETIC = new Set(['honeygather', 'runaway', 'stench', 'ballfetch', 'symbiosis',
    'telepathy', 'friendguard', 'battery', 'powerspot', 'plus', 'minus', 'receiver', 'powerofalchemy',
    'noability', 'imposter', 'illusion',
    // Gulp Missile's Gulping and Gorging formes are not in the packaged dataset,
    // so there is nothing to change into. Shields Down keeps its status immunity
    // (defined above) but Minior-Meteor is likewise unpackaged, so its forme
    // half cannot be simulated and is not pretended to be.
    'gulpmissile',
    'commander', 'gorillatactics', 'dancer', 'mimicry', 'transistorold',
    'terraform', 'rebound', 'thermalexchangeold',
    // Redirection-related: nothing to redirect in a singles-only battle.
    'propellertail', 'stalwart']);

  function get(pokemonOrName) {
    const id = Dex.toID(typeof pokemonOrName === 'string' ? pokemonOrName : pokemonOrName?.ability);
    return Abilities[id] || null;
  }

  /**
   * The type a move will actually have when a holder of `abilityValue` uses it.
   *
   * Type-changing abilities (the `-ate` family, Normalize, Liquid Voice) rewrite
   * the move at use time, so a Pokémon with Aerilate is really throwing a Flying
   * Tackle. Showing the packaged Normal type everywhere the move appears makes
   * the UI lie about what will happen; this is what every surface renders from.
   *
   * Reads the same `typeChange` declaration the engine hook uses, so the two can
   * never disagree. Returns the move's own type when nothing applies.
   */
  function displayMoveType(abilityValue, move) {
    if (!move) return null;
    const change = get(abilityValue)?.typeChange;
    if (!change) return move.type;
    try {
      return change.applies(move) ? change.to : move.type;
    } catch {
      return move.type;
    }
  }

  /**
   * The base power a move effectively hits with for a holder of `abilityValue`.
   *
   * The `-ate` family and Normalize are damage-time *multipliers*, so the
   * packaged base power stays put — Pixilate leaves Hyper Beam at 150 BP and
   * multiplies the damage by 1.3. Showing 150 is technically true and
   * practically misleading, so the UI shows what it effectively hits for.
   *
   * Only the unconditional multipliers declared alongside `typeChange` are
   * applied. Conditional boosts (Technician, Analytic, Sheer Force) depend on
   * the target or the turn, and a single number on a menu would misreport them.
   */
  function displayBasePower(abilityValue, move) {
    if (!move || !move.basePower) return move ? move.basePower : 0;
    const change = get(abilityValue)?.typeChange;
    if (!change?.power) return move.basePower;
    try {
      return change.applies(move) ? Math.floor(move.basePower * change.power) : move.basePower;
    } catch {
      return move.basePower;
    }
  }

  function isSimulated(name) {
    const id = Dex.toID(name);
    return !!Abilities[id] || COSMETIC.has(id);
  }

  function coverage() {
    const all = Object.keys(Dex.allAbilities);
    const implemented = all.filter(id => Abilities[id]);
    const cosmetic = all.filter(id => !Abilities[id] && COSMETIC.has(id));
    const missing = all.filter(id => !Abilities[id] && !COSMETIC.has(id));
    return {total: all.length, implemented, cosmetic, missing};
  }

  global.RedGPT.Abilities = {registry: Abilities, define, get, isSimulated, coverage, displayMoveType, displayBasePower, COSMETIC, UNCOPYABLE, WEATHER_SPEED};
})(typeof window !== 'undefined' ? window : globalThis);
