/**
 * Damage calculator.
 *
 * This does **not** reimplement the damage formula. It builds a real `Battle`,
 * puts it into the requested state, and calls the engine's own
 * `calculateDamage` once per damage roll. Everything the engine does — this
 * project's ability restorations and redesigns, the move override table, items,
 * weather, terrain, screens, Tera, Mega Evolution — is therefore reflected for
 * free, and a calculator result can never quietly disagree with what a battle
 * actually does.
 *
 * A hand-written second copy of the formula is exactly the kind of duplicate
 * that drifts: it would have to be updated every time an ability multiplier
 * changes, and nothing would fail when it wasn't.
 *
 * DOM-free, and it never mutates the sets it is given.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Dex = RedGPT.Dex;
  const PokemonLib = RedGPT.Pokemon;

  /** The 16 damage rolls, as the games use: 85% to 100%. */
  const ROLLS = 16;

  const BOOST_KEYS = ['atk', 'def', 'spa', 'spd', 'spe'];

  /** A permissive format: the calculator must never refuse a matchup. */
  function calcFormat() {
    const base = RedGPT.Formats.get('anythinggoes');
    return Object.assign({}, base, {
      rules: Object.assign({}, base.rules, {
        teamPreview: false, forceLevel: null, maxLevel: 100,
        speciesClause: false, itemClause: false, sleepClause: false,
        allowRestricted: true, allowUnrestrictedOnly: true, allowBattleOnly: true,
      }),
    });
  }

  /**
   * Build a battle holding exactly these two Pokémon, in the requested state.
   * @param {object} attackerConfig `{set, boosts, status, hpPercent, tera}`
   * @param {object} defenderConfig same shape
   * @param {object} field `{weather, terrain, reflect, lightscreen, auroraveil, ...}`
   */
  function buildBattle(attackerConfig, defenderConfig, field = {}) {
    const battle = new RedGPT.Battle({
      format: calcFormat(),
      seed: 1,
      sides: [
        {name: 'Attacker', controller: 'human', team: [PokemonLib.normalizeSet(attackerConfig.set)]},
        {name: 'Defender', controller: 'human', team: [PokemonLib.normalizeSet(defenderConfig.set)]},
      ],
    });
    /*
     * The field goes up **before** `start()`, and the order is load-bearing.
     *
     * Protosynthesis and Quark Drive latch which stat they boost in `onStart`,
     * by reading the weather or terrain at that moment — so setting the field
     * afterwards meant they never triggered and the calculator quietly ignored
     * a 1.3x (or 1.5x on Speed) that a real battle applies. Everything else
     * that reads the field does so at use time and does not care either way.
     */
    if (field.weather) {
      battle.field.weather = field.weather;
      battle.field.weatherTurns = 5;
    }
    if (field.terrain) {
      battle.field.terrain = field.terrain;
      battle.field.terrainTurns = 5;
    }
    if (field.trickroom) battle.field.pseudoWeather.trickroom = 5;

    battle.start();

    const attacker = battle.sides[0].team[0];
    const defender = battle.sides[1].team[0];
    applyState(battle, attacker, attackerConfig);
    applyState(battle, defender, defenderConfig);

    // Screens are a side condition rather than a field state and nothing reads
    // them on entry, so they can go up afterwards.
    for (const key of ['reflect', 'lightscreen', 'auroraveil']) {
      if (field[key]) battle.sides[1].conditions[key] = 5;
    }

    /*
     * Who dealt that damage. Avalanche and Revenge do not merely need "I was
     * hit this turn", they need `lastDamageSourceUid === defender.uid` — being
     * hit by somebody else does not arm them. `applyState` cannot set this
     * because it only sees one Pokémon, so it is wired across here, once both
     * exist. Without it the damage-taken control would look connected and leave
     * those two moves on their base power, which is the §8 shape exactly.
     */
    if (attacker.damageTakenThisTurn > 0) attacker.lastDamageSourceUid = defender.uid;
    if (defender.damageTakenThisTurn > 0) defender.lastDamageSourceUid = attacker.uid;

    return {battle, attacker, defender};
  }

  function applyState(battle, pokemon, config = {}) {
    for (const key of BOOST_KEYS) {
      const value = Number(config.boosts?.[key] || 0);
      pokemon.boosts[key] = Math.max(-6, Math.min(6, Math.round(value)));
    }
    if (config.status) pokemon.status = config.status;
    const percent = config.hpPercent == null ? 100 : Math.max(1, Math.min(100, Number(config.hpPercent)));
    pokemon.currentHP = Math.max(1, Math.round(pokemon.maxHP * percent / 100));
    if (config.tera) {
      pokemon.terastallized = true;
      pokemon.types = [pokemon.teraType];
    }
    /*
     * Has this Pokémon already taken its turn?
     *
     * Both Pokémon are built fresh, so `hasActedThisTurn` was always false and
     * the calculator could not express the other half of
     * `Mechanics.TURN_ORDER_POWER_MOVES` at all. That default is not neutral:
     * it silently reported Fishious Rend and Bolt Beak at their **doubled** 170
     * BP and Payback and Analytic at their **weakest** branch, with no way to
     * ask for the other one. A tiering evidence packet was generated against it
     * and printed identical numbers for "moving first" and "moving second",
     * which is what surfaced this.
     *
     * Every reader is `defender.hasActedThisTurn`, so for a single calculation
     * only the *defending* Pokémon's flag matters. It is set on both sides
     * because `calc-ui.js` now runs the calculation in both directions — when
     * Pokémon 2 is the attacker it is Pokémon 1's flag that Fishious Rend
     * reads, so a defender-only control would be right half the time.
     */
    pokemon.hasActedThisTurn = !!config.hasMoved;

    /*
     * ...and the other half of the same blind spot: `damageTakenThisTurn`.
     *
     * Seven more moves read it and were all stuck on their weakest branch with
     * no way to ask otherwise — Assurance (60 instead of 120) and Avalanche and
     * Revenge (ditto) off the *defender's* and the *attacker's* counter
     * respectively, plus Counter, Mirror Coat, Metal Burst and Comeuppance,
     * which return a multiple of it and so simply failed.
     *
     * Expressed as a percentage of max HP rather than a raw number because
     * every other field on this panel is relative, and because the counter
     * moves want "it hit me for half" far more often than a specific figure.
     *
     * `damageTakenCategory` is honoured here but **deliberately not rendered as
     * a control**, and the reason is worth keeping. It only matters to Counter
     * and Mirror Coat, whose category gate lives in `moveSpecialFailure` — and
     * the calculator computes damage directly and never asks whether a move
     * would fail at all (it prices Sucker Punch the same way). So the select
     * was measured to change nothing on screen: Counter read 204 off both a
     * Physical and a Special hit. Shipping it would have been a live control
     * with no effect, which §10 already records as a defect once. It stays as a
     * config field because anything driving `Calculator` directly can set it,
     * and the default arms Counter rather than Mirror Coat.
     *
     * The honest limitation to know: the calculator reports Counter and Mirror
     * Coat damage without checking that the move could legally fire.
     */
    const dmgPercent = Math.max(0, Math.min(100, Number(config.damageTakenPercent) || 0));
    pokemon.damageTakenThisTurn = dmgPercent > 0 ? Math.max(1, Math.round(pokemon.maxHP * dmgPercent / 100)) : 0;
    pokemon.lastDamageCategory = config.damageTakenCategory === 'Special' ? 'Special' : 'Physical';
  }

  /**
   * The move as it will actually be used: ability and item `onModifyMove` hooks
   * applied, exactly as `executeMove` does before it calculates damage.
   */
  function prepareMove(battle, attacker, defender, moveId) {
    const packaged = Dex.move(moveId);
    if (!packaged || packaged.missing) return null;
    const move = Object.assign({}, packaged, {flags: Object.assign({}, packaged.flags)});
    if (battle.abilityOf(attacker)?.infiltrates) move.infiltrates = true;
    battle.runAbility('onModifyMove', attacker, move, defender);
    battle.runItem('onModifyMove', attacker, move, defender);
    return move;
  }

  /** How many times this move hits, and the per-hit power multipliers. */
  function hitPlan(battle, attacker, move) {
    // multihitCount can consume RNG for 2-5 moves; pin it so the plan is stable.
    const saved = battle.rng.next;
    battle.rng.next = () => 0.5;
    let hits = 1;
    try {
      hits = battle.multihitCount(move, attacker) || 1;
    } finally {
      battle.rng.next = saved;
    }
    const parentalBond = !move.multihit &&
      !!battle.abilityOf(attacker)?.parentalBond && battle.parentalBondApplies(move);
    // Parental Bond's second strike lands at half power.
    const multipliers = [];
    for (let i = 0; i < hits; i++) multipliers.push(parentalBond && i > 0 ? 0.5 : 1);
    return {hits, multipliers, parentalBond};
  }

  /**
   * Damage for one attacker/defender/move combination.
   * @returns {object|null} null when the move deals no damage at all
   */
  function calculate({attacker: attackerConfig, defender: defenderConfig, move: moveId, field = {}, critical = false}) {
    const {battle, attacker, defender} = buildBattle(attackerConfig, defenderConfig, field);
    const move = prepareMove(battle, attacker, defender, moveId);
    if (!move) return null;

    const type = battle.moveType(attacker, defender, move);
    const effectiveness = battle.effectiveness(type, defender, move, attacker);
    const stab = battle.stabFor(attacker, type);
    const fixed = battle.fixedDamage(attacker, defender, move);
    const plan = hitPlan(battle, attacker, move);

    const totals = [];
    if (move.category === 'Status') return null;
    // An immune target takes nothing. `calculateDamage` does not check this —
    // `executeMove` refuses the move earlier — so the calculator must.
    if (effectiveness === 0) {
      return {
        moveId: move.id, moveName: Dex.move(moveId).name, type, category: move.category,
        effectiveness: 0, immune: true, min: 0, max: 0, rolls: [],
        maxHP: defender.maxHP, minPercent: 0, maxPercent: 0, koChance: 0,
        defenderHP: defender.currentHP, hits: 0,
      };
    }

    for (let roll = 0; roll < ROLLS; roll++) {
      // calculateDamage reads `0.85 + rng.next() * 0.15`; step it across the range.
      const fraction = roll / (ROLLS - 1);
      let total = 0;
      for (const multiplier of plan.multipliers) {
        battle.rng.next = () => fraction;
        const amount = fixed != null
          ? fixed
          : battle.calculateDamage(attacker, defender, move, critical, {semiMultiplier: multiplier});
        total += Math.max(0, amount);
      }
      totals.push(total);
    }

    const min = Math.min(...totals);
    const max = Math.max(...totals);
    if (max <= 0) return null;

    const maxHP = defender.maxHP;
    return {
      moveId: move.id,
      moveName: Dex.move(moveId).name,
      type,
      category: move.category,
      // The power the damage was actually built from: dynamic base power with
      // every onBasePower modifier applied (the -ate multipliers, Technician,
      // type-boost items...). Reporting the packaged number would not explain
      // the damage beside it.
      basePower: battle.modifyValue(
        'onBasePower', attacker, battle.dynamicBasePower(attacker, defender, move, {preview: true}), defender, move),
      packagedBasePower: Dex.move(moveId).basePower,
      effectiveness,
      stab: stab > 1,
      hits: plan.hits,
      parentalBond: plan.parentalBond,
      critical,
      min, max, rolls: totals,
      maxHP,
      minPercent: +(100 * min / maxHP).toFixed(1),
      maxPercent: +(100 * max / maxHP).toFixed(1),
      koChance: koChance(totals, defender.currentHP),
      defenderHP: defender.currentHP,
      // Turns to KO with everything that happens *between* turns included.
      ko: koSummary(
        {attacker: attackerConfig, defender: defenderConfig, move: moveId, field, critical},
        min, max, defender.currentHP),
    };
  }

  /** Chance the move knocks the target out this turn, over the roll spread. */
  function koChance(totals, currentHP) {
    if (!totals.length) return 0;
    const kos = totals.filter(total => total >= currentHP).length;
    return Math.round(100 * kos / totals.length);
  }

  /** Turns to simulate before calling a matchup unwinnable. */
  const MAX_TURNS = 20;

  /**
   * How many turns this move needs to knock the target out, *including*
   * everything that happens between turns.
   *
   * Rather than adding residual maths to the calculator, this replays real
   * turns: attack, then call the engine's own `endOfTurn`. Sandstorm chip,
   * burn and poison ticks (with the Toxic counter ramping), Leech Seed,
   * Leftovers, Black Sludge, Poison Heal, Grassy Terrain, Aqua Ring and
   * anything else the engine does at end of turn are therefore all accounted
   * for, and stay accounted for if that phase ever changes.
   *
   * A fresh battle per simulation, because the turns mutate state.
   */
  function simulateKO(config, roll) {
    const {battle, attacker, defender} = buildBattle(config.attacker, config.defender, config.field || {});
    const move = prepareMove(battle, attacker, defender, config.move);
    if (!move) return null;
    const fixed = battle.fixedDamage(attacker, defender, move);
    const plan = hitPlan(battle, attacker, move);
    const contributors = new Set();
    // Describe the residuals from the *starting* state. Weather and terrain
    // tick down during the simulation, so reading them afterwards silently
    // dropped anything that expired before the KO landed.
    const residuals = describeResiduals(battle, defender, contributors);

    let turns = 0;
    let stalled = false;
    while (defender.currentHP > 0 && turns < MAX_TURNS) {
      turns++;
      const hpBeforeAttack = defender.currentHP;
      for (const multiplier of plan.multipliers) {
        if (defender.currentHP <= 0) break;
        battle.rng.next = () => roll;
        const requested = fixed != null
          ? fixed
          : battle.calculateDamage(attacker, defender, move, config.critical, {semiMultiplier: multiplier});
        // Route through the engine so on-damage effects (Focus Sash, Sturdy,
        // Sitrus, Rocky Helmet) behave as they would in a battle.
        battle.damage(defender, requested, {source: attacker, category: move.category, move, indirect: false});
      }
      if (defender.currentHP <= 0) break;

      const hpBeforeResiduals = defender.currentHP;
      battle.rng.next = () => 0.5;              // residuals must not eat the damage roll
      battle.rng.chance = () => false;
      try {
        battle.endOfTurn();
      } catch {
        break;                                   // never let the calculator throw
      }
      const drift = defender.currentHP - hpBeforeResiduals;
      if (drift < 0) contributors.add('damage');
      else if (drift > 0) contributors.add('recovery');

      // Net gain across a whole turn means the attack cannot get there.
      if (defender.currentHP >= hpBeforeAttack) { stalled = true; break; }
    }

    return {
      turns: defender.currentHP <= 0 ? turns : null,
      stalled: stalled || defender.currentHP > 0,
      residuals,
    };
  }

  /**
   * Name the between-turn effects acting on the defender, for the summary line.
   * Read off the state rather than the damage numbers so the label says *what*
   * is happening, not merely that something is.
   */
  /** Types the sand/hail chip does not touch. Display-only: naming a source
   *  that cancels out is far better than silently omitting it, so this errs
   *  toward listing. The engine remains the authority on the actual damage. */
  const WEATHER_SAFE = {sandstorm: ['Rock', 'Ground', 'Steel'], hail: ['Ice']};

  function describeResiduals(battle, defender, contributors) {
    const names = [];
    const weather = battle.effectiveWeather();
    const itemId = Dex.toID(defender.item || '');
    // Named from state, not from the net HP drift: sand plus Leftovers cancel
    // out exactly, and reporting neither would be the least useful answer.
    if (WEATHER_SAFE[weather] && !defender.types.some(t => WEATHER_SAFE[weather].includes(t)) &&
        !battle.abilityOf(defender)?.indirectImmune) {
      names.push(`${weather === 'hail' ? 'hail' : 'sandstorm'} damage`);
    }
    if (defender.status === 'brn') names.push('burn damage');
    else if (defender.status === 'psn') names.push('poison damage');
    else if (defender.status === 'tox') names.push('poison damage');
    if (defender.volatiles?.leechSeed != null) names.push('Leech Seed damage');
    if (itemId === 'leftovers') names.push('Leftovers recovery');
    else if (itemId === 'blacksludge') {
      // Black Sludge only heals a Poison type; it hurts everything else.
      names.push(defender.types.includes('Poison') ? 'Black Sludge recovery' : 'Black Sludge damage');
    }
    if (battle.field.terrain === 'grassy' && battle.isGrounded(defender)) names.push('Grassy Terrain recovery');
    if (defender.volatiles?.aquaring || defender.volatiles?.ingrain) names.push('passive recovery');
    if (Dex.toID(defender.ability || '') === 'poisonheal') names.push('Poison Heal recovery');
    return names;
  }

  /** "guaranteed 3HKO after Leftovers recovery" */
  function koSummary(config, min, max, currentHP) {
    const worst = simulateKO(config, 0);          // lowest roll every turn
    const best = simulateKO(config, 0.999999);    // highest roll every turn
    const suffix = worst && worst.residuals.length ? ` after ${joinList(worst.residuals)}` : '';

    if (!worst || worst.stalled) {
      // The target out-heals or survives the attack indefinitely.
      if (best && best.turns) return {text: `possible ${best.turns}HKO${suffix}`, guaranteed: null, best: best.turns};
      return {text: `not a KO${suffix}`, guaranteed: null, best: null};
    }
    if (max >= currentHP && min >= currentHP) return {text: `guaranteed OHKO${suffix}`, guaranteed: 1, best: 1};
    if (best && best.turns && best.turns !== worst.turns) {
      return {text: `${best.turns}HKO – ${worst.turns}HKO${suffix}`, guaranteed: worst.turns, best: best.turns};
    }
    return {text: `guaranteed ${worst.turns}HKO${suffix}`, guaranteed: worst.turns, best: worst.turns};
  }

  function joinList(items) {
    if (items.length <= 1) return items[0] || '';
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
  }

  /** Calculate every move on the attacking set at once. */
  function calculateAll(config) {
    const moves = (config.attacker?.set?.moves || []).filter(Boolean);
    return moves.map(moveId => {
      try {
        return Object.assign({moveId}, calculate(Object.assign({}, config, {move: moveId})) || {empty: true});
      } catch (error) {
        return {moveId, error: error.message};
      }
    });
  }

  /** "12.4% - 14.6%", or "0%" when nothing lands. */
  function formatRange(result) {
    if (!result || result.empty) return '—';
    return `${result.minPercent}% - ${result.maxPercent}%`;
  }

  /** A one-line summary in the familiar calculator style. */
  function describe(result) {
    if (!result || result.empty) return 'No damage.';
    const parts = [`${result.min} - ${result.max} (${formatRange(result)})`];
    if (result.hits > 1) parts.push(`${result.hits} hits`);
    if (result.koChance > 0 && result.koChance < 100) parts.push(`${result.koChance}% chance to OHKO`);
    else if (result.ko) parts.push(result.ko.text);
    return parts.join(' — ');
  }

  /**
   * The six stats each side is *actually* fighting with, and why.
   *
   * The calculator's stat readout used `Pokemon.calcStats`, which knows about
   * the species, level, nature, IVs and EVs and nothing else — so a Choice Band
   * Zacian at +2 with a burn showed its base 394 Attack, and the number beside
   * the slider disagreed with the damage underneath it.
   *
   * Read from `battle.getStat` on the same battle the damage rolls use, so the
   * two can never diverge, and paired with `battle.statBreakdown` (§5) for the
   * explanation rather than re-deriving one. HP is taken from `maxHP`, because
   * it is not a stat anything modifies in play.
   *
   * @returns {{attacker: object, defender: object}} each `{stat: {value, base, factors}}`
   */
  function liveStats(attackerConfig, defenderConfig, field = {}) {
    const {battle, attacker, defender} = buildBattle(attackerConfig, defenderConfig, field);
    const read = pokemon => {
      const out = {hp: {value: pokemon.maxHP, base: pokemon.maxHP, factors: []}};
      for (const stat of BOOST_KEYS) {
        // `sources`, not `factors` — the field name matters, and reading the
        // wrong one silently produced an empty explanation rather than an error.
        let sources = [];
        try { sources = battle.statBreakdown(pokemon, stat, {reveal: true}).sources || []; } catch { /* explanation is optional */ }
        out[stat] = {
          value: battle.getStat(pokemon, stat),
          base: pokemon.stats[stat],
          factors: sources.filter(f => f && f.factor !== 1),
        };
      }
      return out;
    };
    return {attacker: read(attacker), defender: read(defender)};
  }

  global.RedGPT.Calculator = {
    calculate, calculateAll, describe, formatRange, buildBattle, prepareMove, simulateKO, liveStats, ROLLS, MAX_TURNS,
  };
})(typeof window !== 'undefined' ? window : globalThis);
