/**
 * RedGPT battle engine.
 *
 * The engine has no knowledge of the DOM. It consumes commands and produces
 * state plus an event log:
 *
 *     battle state + side commands + seeded RNG
 *         -> Battle.resolve()
 *         -> updated state + battle events
 *
 * Arena battles, Campaign battles, local versus, AI battles and replays all use
 * this same class; only the controller that supplies commands differs. Because
 * every random decision comes from the injected seeded RNG, replaying the same
 * seed and the same command sequence reproduces a battle exactly.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Dex = RedGPT.Dex;
  const PokemonLib = RedGPT.Pokemon;
  const Abilities = RedGPT.Abilities;
  const Items = RedGPT.Items;

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const deepClone = o => JSON.parse(JSON.stringify(o));

  const Mechanics = RedGPT.Mechanics;
  const {
    STATUS_NAMES, STATUS_LABELS, BOOST_KEYS, WEATHER_LABELS, TERRAIN_LABELS,
    CHARGE_MOVES, LOCKED_MOVES, RECHARGE_MOVES, SELF_SWITCH_MOVES, FORCE_SWITCH_MOVES,
    SCREEN_BREAK_MOVES, TERRAIN_CLEAR_MOVES, CRASH_MOVES, ALWAYS_HIT_MOVES,
    HAZARD_REMOVAL_MOVES, SELF_CANCELLING_ROOMS, STATUS_SPECIAL_MOVES, DYNAMIC_POWER_MOVES, FIXED_DAMAGE_MOVES,
    PROTECT_MOVES, NON_FOE_TARGETS, FORME_CHANGE_ITEMS, emptySideConditions,
  } = Mechanics;

  /** Display names for the pseudo-weathers that announce their own ending. */
  const ROOM_NAMES = {
    trickroom: 'Trick Room', magicroom: 'Magic Room', wonderroom: 'Wonder Room', gravity: 'Gravity',
    mudsport: 'Mud Sport', watersport: 'Water Sport', fairylock: 'Fairy Lock', iondeluge: 'Ion Deluge',
  };

  /**
   * The duration of a field effect that has no turn counter.
   *
   * This is the *third* weather-persistence state, and it is deliberately not a
   * reuse of `field.weatherPrimal`. There are three:
   *
   *   ordinary   a finite counter, ticked down by `runResidual`, replaceable
   *   endless    no counter at all, and **still replaceable**
   *   primal     no counter, and nothing ordinary may replace or clear it
   *
   * Rebirth Mode's opposing teams open with an endless field effect, and the
   * requirement is that it stay beatable: an opposing weather setter switching
   * in, or Cloud Nine / Air Lock, must still remove it. Primal weather refuses
   * both (see `setWeather` / `clearWeather`), so it is the wrong mechanism.
   *
   * `Infinity` is what makes this cost nothing elsewhere: every read in the
   * engine asks `> 0`, which stays true, and every tick is `--x <= 0`, which
   * `Infinity` satisfies by never reaching zero. So the effect persists while
   * every *removal* path — `setWeather` from a new setter, `clearWeather`,
   * Defog, Brick Break, a replacement terrain — keeps working unchanged. It is
   * an absent counter rather than a large one; a large one would eventually
   * expire, and this cannot.
   *
   * It must never be written into anything serialised: `JSON.stringify` turns
   * `Infinity` into `null`. Battles are never serialised (only their config is,
   * and a config declares the effect rather than its duration), so this stays
   * inside the live battle object.
   */
  const ENDLESS = Infinity;

  /**
   * The three types Delta Stream's strong winds neutralise against Flying.
   *
   * A module-level Set rather than an array literal inside `effectiveness`,
   * because that function is the hottest in the engine — the damage path, every
   * move the AI scores every turn, `matchupScore`, hazard pricing, the
   * calculator and the move buttons all call it — and a literal allocates on
   * every call.
   */
  const STRONG_WIND_TYPES = new Set(['Electric', 'Ice', 'Rock']);

  /**
   * Moves whose physical/special split is decided by the user at use time
   * rather than by the packaged data — see `Battle#moveCategory`.
   */
  const CATEGORY_BY_STAT_MOVES = new Set(['terablast', 'revelationdance']);

  class Battle {
    /**
     * @param {object} options
     * @param {object} options.format         format rule object from src/core/formats.js
     * @param {number|string} options.seed
     * @param {Array} options.sides           `[{name, avatar, team:[set], conditions:[cond], controller, ai}]`
     * @param {string} [options.background]
     * @param {Array} [options.script]        recorded commands, for replay playback
     * @param {object} [options.fieldEffects] a declared opening field state — see
     *   `applyFieldEffects`. Plain JSON, because a Campaign battle is stored as a
     *   config and rebuilt on load.
     */
    constructor(options) {
      const RNG = RedGPT.RNG;
      this.format = options.format || RedGPT.Formats.get('tierou');
      this.seed = typeof options.seed === 'number' ? options.seed : RNG.parse(options.seed).value ?? RNG.random();
      this.rng = new RNG(this.seed);
      // The AI draws from a separate stream so that replaying a battle from a
      // recorded command list — which skips AI evaluation entirely — leaves the
      // mechanics RNG in exactly the same state.
      this.aiRng = new RNG((this.seed ^ 0x5f3759df) >>> 0);
      this.background = options.background || 'Meadow.jpg';
      this.rules = this.format.rules || {};
      this.turn = 0;
      this.ended = false;
      this.winner = null;
      this.endReason = null;
      this.log = [];
      this.events = [];
      this.commands = [];
      // Replay playback: one queue per side so interleaved commands stay in order.
      this.scriptQueues = options.script
        ? [options.script.filter(c => c.side === 0).map(c => c.choice), options.script.filter(c => c.side === 1).map(c => c.choice)]
        : null;
      this.listeners = [];
      this.actionQueue = [];
      this.actionIndex = 0;
      this.phase = 'init';
      this.requests = [null, null];
      this.choices = [null, null];
      this.pendingSwitchRequests = [];
      this.lastMoveThisTurn = null;
      this.lastMoveId = null;

      // A declared opening field state, applied once the leads are out.
      this.fieldEffects = options.fieldEffects || null;

      this.field = {
        weather: null, weatherTurns: 0, weatherSource: null, weatherPrimal: null,
        terrain: null, terrainTurns: 0,
        pseudoWeather: {gravity: 0, trickroom: 0, magicroom: 0, wonderroom: 0,
          mudsport: 0, watersport: 0, fairylock: 0, iondeluge: 0},
      };

      this.sides = (options.sides || []).map((config, index) => {
        const bring = this.rules.teamSize || 6;
        const team = (config.team || []).slice(0, bring).map((set, position) => {
          const pokemon = PokemonLib.createBattlePokemon(this.scaleSet(set), config.conditions?.[position] || null);
          pokemon.side = index;
          pokemon.position = position;
          return pokemon;
        });
        return {
          index,
          id: index === 0 ? 'p1' : 'p2',
          // Team Preview reorders `team`; replays must start from this order.
          initialTeam: team.map(p => Object.assign({}, p.set)),
          name: config.name || (index === 0 ? 'Player' : 'Opponent'),
          avatar: config.avatar || null,
          controller: config.controller || (index === 0 ? 'human' : 'ai'),
          ai: config.ai || null,
          team,
          activeIndex: 0,
          conditions: emptySideConditions(),
          teamPreviewDone: false,
          switchRequest: null,
          faintedCount: 0,
          terastallized: false,
          megaEvolved: false,
        };
      });

      for (const side of this.sides) {
        if (!side.team.length) throw new Error(`${side.name} has no Pokémon.`);
      }
    }

    /** Applies format level and EV scaling to a persisted set without mutating it. */
    scaleSet(set) {
      const normalized = PokemonLib.normalizeSet(set);
      if (this.rules.forceLevel) normalized.level = this.rules.forceLevel;
      else if (this.rules.maxLevel && normalized.level > this.rules.maxLevel) normalized.level = this.rules.maxLevel;
      // A format may run without EVs at all (Campaign). Zeroing here rather than
      // at each team source means nothing can leak them in: the player's party,
      // generated wild and trainer teams, and the hand-written boss spreads all
      // pass through this one function.
      if (this.rules.evLimit === 0) normalized.evs = PokemonLib.zeroStats();
      normalized.uid = set.uid;
      return normalized;
    }

    /* ================================================================ *
     * Event stream
     * ================================================================ */

    on(listener) { this.listeners.push(listener); return () => { this.listeners = this.listeners.filter(l => l !== listener); }; }

    emit(event) {
      this.events.push(event);
      for (const listener of this.listeners) listener(event);
    }

    /** Append a battle-log line (and record it as a `text` event). */
    add(text) {
      if (!text) return;
      // Labels read "the opposing X" so they compose mid-sentence; the leading
      // character of a finished line is capitalised here instead.
      const line = text.charAt(0).toUpperCase() + text.slice(1);
      this.log.push(line);
      this.emit({type: 'text', text: line, turn: this.turn});
    }

    label(pokemon) {
      if (!pokemon) return 'Pokémon';
      return pokemon.side === 1 ? `the opposing ${pokemon.name}` : pokemon.name;
    }

    /* ================================================================ *
     * Accessors
     * ================================================================ */

    sideOf(pokemon) { return this.sides[pokemon.side]; }
    foeSide(sideOrIndex) {
      const index = typeof sideOrIndex === 'number' ? sideOrIndex : sideOrIndex.index;
      return this.sides[1 - index];
    }
    active(sideIndex) {
      const side = this.sides[sideIndex];
      return side.team[side.activeIndex];
    }
    foeActive(pokemon) { return this.active(1 - pokemon.side); }
    get p1Active() { return this.active(0); }
    get p2Active() { return this.active(1); }

    aliveCount(side) { return side.team.filter(p => !p.fainted).length; }

    /* ================================================================ *
     * Ability / item hook plumbing
     * ================================================================ */

    abilitySuppressed(pokemon) {
      if (pokemon.volatiles.abilitySuppressed) return true;
      for (const side of this.sides) {
        const active = this.active(side.index);
        if (active && !active.fainted && Abilities.get(active.ability)?.suppressAbilities && active !== pokemon) {
          if (Items.get(pokemon.item)?.abilityProtected) return false;
          return true;
        }
      }
      return false;
    }

    abilityOf(pokemon) {
      if (!pokemon || this.abilitySuppressed(pokemon)) return null;
      return Abilities.get(pokemon.ability);
    }

    /**
     * Does this move actually cross the field towards the defender?
     *
     * `defender` is the foe for every move the executor runs, including the
     * user's own Slack Off or Reflect, so defender-side reactive effects have
     * to ask this before treating a move as incoming. Hazards (`foeSide`) count
     * as crossing: they land on the defender's side and Magic Bounce reflects
     * them.
     */
    aimedAtFoe(move) {
      return !NON_FOE_TARGETS.has(move.target);
    }

    /**
     * Does this move target the defending Pokémon itself, rather than its side?
     * Good as Gold refuses status moves aimed at the holder but does not stop
     * hazards, which are set on the side rather than used on the Pokémon.
     */
    aimedAtFoePokemon(move) {
      return this.aimedAtFoe(move) && move.target !== 'foeSide';
    }

    /** The defender's ability, unless the attacker ignores it (Mold Breaker). */
    defenderAbility(defender, attacker) {
      const ability = this.abilityOf(defender);
      if (!ability) return null;
      if (!attacker) return ability;
      if (ability.unignorable) return ability;
      const attackerAbility = this.abilityOf(attacker);
      if (attackerAbility?.breaksMold) return null;
      if (attacker.currentMove?.ignoreAbility) return null;
      return ability;
    }

    itemOf(pokemon) {
      if (!pokemon || !pokemon.item) return null;
      // Klutz — read through abilityOf so a suppressed Klutz stops suppressing.
      if (this.abilityOf(pokemon)?.suppressItem) return null;
      if (this.field.pseudoWeather.magicroom > 0) return null;
      if (pokemon.volatiles.embargo) return null;
      const effect = Items.get(pokemon.item);
      if (effect?.itemUsers && !effect.itemUsers.includes(pokemon.species)) return effect;
      return effect;
    }

    runAbility(hook, pokemon, ...args) {
      const ability = this.abilityOf(pokemon);
      if (!ability || typeof ability[hook] !== 'function') return undefined;
      return ability[hook](this, pokemon, ...args);
    }

    runItem(hook, pokemon, ...args) {
      const item = this.itemOf(pokemon);
      if (!item || typeof item[hook] !== 'function') return undefined;
      return item[hook](this, pokemon, ...args);
    }

    /**
     * Run an ability hook then an item hook, threading a numeric value.
     * Hooks are invoked as `hook(battle, pokemon, ...args, value)`, so callers
     * must pass only the arguments that follow `pokemon` in the hook signature.
     * A hook that returns a non-finite number is ignored rather than poisoning
     * the calculation.
     */
    modifyValue(hook, pokemon, value, ...args) {
      let result = value;
      const apply = source => {
        if (!source || typeof source[hook] !== 'function') return;
        const next = source[hook](this, pokemon, ...args, result);
        if (typeof next === 'number' && Number.isFinite(next)) result = next;
      };
      apply(this.abilityOf(pokemon));
      apply(this.itemOf(pokemon));
      return result;
    }

    /* ================================================================ *
     * Field state
     * ================================================================ */

    /**
     * Weather that is actually in effect.
     *
     * Nothing suppresses weather in this project: Air Lock and Cloud Nine were
     * redesigned to delete it outright on entry (see `clearWeather`), so there
     * is no "suppressed but still there" state to model.
     */
    effectiveWeather() {
      return this.field.weather || null;
    }

    /**
     * Per-Pokémon weather view.
     *
     * Two things override the real weather here, and both are personal rather
     * than field-wide: Utility Umbrella hides sun and rain from its holder, and
     * an ability declaring `personalWeather` (Mega Sol) makes the holder's own
     * moves behave as though that weather were up. This is the single function
     * every attacker-side weather read goes through — Solar Beam's charge,
     * Thunder and Blizzard's accuracy, Weather Ball, Hydro Steam and the damage
     * modifier — which is what lets one line here reach all of them, and reach
     * `AI.estimateDamage` and the calculator with it.
     *
     * **The umbrella is applied last, so it wins.** An item whose whole text is
     * "ignore sun and rain" should shield its holder from the sun it is standing
     * in whatever produced it; the alternative would make the two silently
     * cancel in a way neither description states.
     */
    weatherFor(pokemon) {
      const weather = this.abilityOf(pokemon)?.personalWeather || this.effectiveWeather();
      if (!weather) return null;
      if (['sun', 'rain'].includes(weather) && Items.get(pokemon?.item)?.ignoreWeatherEffects) return null;
      return weather;
    }

    /**
     * Is a Delta Stream holder on the field?
     *
     * Strong winds are a *field* effect, not a personal one — they protect every
     * Flying-type Pokémon on both sides — so this asks about either active
     * Pokémon rather than about the defender. Read by `effectiveness`, which is
     * the one place the type chart is consulted, so the AI, the damage
     * calculator and the move buttons all price it without a second copy.
     */
    strongWindsActive() {
      return this.sides.some(side => {
        const active = this.active(side.index);
        return !!active && !active.fainted && !!this.abilityOf(active)?.strongWinds;
      });
    }

    /**
     * @param {string} weather  canonical weather id
     * @param {object|null} source
     * @param {object} options `{text, primal, endless}` — `primal` is the ability id
     *   ('primordialsea' | 'desolateland') when this is one of the two primal
     *   weathers, which are a different mechanic from ordinary rain and sun.
     *   `endless` is the *third* state (see `ENDLESS` below): no turn counter,
     *   but none of primal weather's replacement lock either.
     */
    setWeather(weather, source = null, {text = null, primal = null, endless = false} = {}) {
      /*
       * Primal weather cannot be replaced by ordinary weather. In the games
       * only another primal weather (or the holder leaving) removes it, which
       * is most of what makes it "primal" rather than "rain with extra steps".
       */
      if (this.field.weatherPrimal && !primal) return false;
      if (this.field.weather === weather && this.field.weatherPrimal === primal) return false;
      this.field.weather = weather;
      const durationItem = source ? this.itemOf(source)?.weatherDuration?.[weather] : null;
      // Primal weather has no duration: it lasts until its setter leaves. A
      // turn counter of 0 is what `runResidual` reads as "does not tick".
      this.field.weatherTurns = primal ? 0 : (endless ? ENDLESS : (durationItem || 5));
      this.field.weatherSource = source ? source.uid : null;
      this.field.weatherPrimal = primal;
      const labels = {
        rain: 'Rain began to fall!', sun: 'The sunlight turned harsh!',
        sandstorm: 'A sandstorm kicked up!', snow: 'It started to snow!', hail: 'Hail began to fall!',
      };
      const primalLabels = {
        primordialsea: 'A heavy rain began to fall!',
        desolateland: 'The sunlight turned extremely harsh!',
      };
      const label = (primal && primalLabels[primal]) || labels[weather] || 'The weather changed!';
      this.add(text ? `${text}: ${label}` : label);
      this.emit({type: 'weather', weather});
      // Forecast and Flower Gift follow the weather, so both sides re-check.
      for (const side of this.sides) this.checkFormeTriggers(this.active(side.index));
      return true;
    }

    /**
     * Remove the active weather entirely — state, duration and source.
     *
     * This is a real removal, not a suppression: once it runs, the weather is
     * gone and does not return when whatever cleared it leaves the field. A
     * later weather setter starts a fresh one through `setWeather` as normal.
     */
    /**
     * @param {object} options `{text, force}` — `force` is required to remove
     *   primal weather. Air Lock and Cloud Nine (which this project redesigned
     *   to *delete* weather rather than suppress it) deliberately cannot: in
     *   the games nothing short of another primal weather or the holder leaving
     *   the field ends it, and letting a Psyduck switch-in wipe Primal Groudon's
     *   sun would make the ability ordinary again.
     */
    clearWeather({text = null, force = false} = {}) {
      if (!this.field.weather) return false;
      if (this.field.weatherPrimal && !force) return false;
      this.field.weather = null;
      this.field.weatherTurns = 0;
      this.field.weatherSource = null;
      this.field.weatherPrimal = null;
      if (text) this.add(text);
      this.emit({type: 'weather', weather: null});
      for (const side of this.sides) this.checkFormeTriggers(this.active(side.index));
      return true;
    }

    /**
     * Apply a declared opening field state for one side.
     *
     * The shape is plain JSON so a Campaign battle config can carry it through
     * a save and rebuild the identical encounter:
     *
     *     {side: 1, label: '…', weather: 'sun', terrain: 'psychic',
     *      pseudoWeather: ['trickroom'],
     *      own: {reflect: true, tailwind: true},   // conditions on `side`
     *      foe: {stealthrock: true, spikes: 2}}    // hazards on the other side
     *
     * Everything set here is `ENDLESS`: no turn counter, still removable.
     *
     * **Called after the leads have arrived**, at the end of `beginBattleProper`,
     * which decides two things deliberately. A lead's own `onStart` weather
     * (Drought, Drizzle) has already fired and is therefore *overridden* by the
     * declared plan, which is what "this team's own field" means — and the
     * player can take it back by re-triggering their setter. And pre-laid
     * hazards do not hit the Pokémon already standing on them; they bite from
     * the first switch, exactly as hazards set during a battle do.
     */
    applyFieldEffects(spec) {
      if (!spec) return false;
      const side = this.sides[spec.side ?? 1];
      if (!side) return false;
      const foe = this.foeSide(side);
      const source = side.team[side.activeIndex] || null;
      if (spec.label) this.add(spec.label);
      let applied = false;
      if (spec.weather) applied = this.setWeather(spec.weather, source, {endless: true}) || applied;
      if (spec.terrain) applied = this.setTerrain(spec.terrain, source, {endless: true}) || applied;
      for (const key of spec.pseudoWeather || []) {
        applied = this.setPseudoWeather(key, source, {endless: true}) || applied;
      }
      // `addSideCondition` already reads a caller-supplied duration for screens
      // and Tailwind, and hazards have never had a counter at all, so both
      // halves need nothing new — a hazard count is applied one layer at a time
      // because that is what the stacking rules are written against.
      const conditions = (target, table) => {
        for (const [key, value] of Object.entries(table || {})) {
          if (!value) continue;
          const layers = value === true ? 1 : Math.max(1, Math.round(value));
          for (let i = 0; i < layers; i++) {
            applied = this.addSideCondition(target, key, {duration: ENDLESS}) || applied;
          }
        }
      };
      conditions(side, spec.own);
      conditions(foe, spec.foe);
      return applied;
    }

    /**
     * Remove the active terrain — state, duration and chip.
     *
     * The counterpart to `clearWeather`, and it emits, which matters: the field
     * chips are rendered from the `terrain` event, so a silent removal would
     * leave the chip on screen until the next authoritative render.
     */
    clearTerrain({text = null} = {}) {
      if (!this.field.terrain) return false;
      this.field.terrain = null;
      this.field.terrainTurns = 0;
      if (text) this.add(text);
      this.emit({type: 'terrain', terrain: null});
      return true;
    }

    setTerrain(terrain, source = null, {text = null, endless = false} = {}) {
      if (this.field.terrain === terrain) return false;
      this.field.terrain = terrain;
      this.field.terrainTurns = endless ? ENDLESS : (this.itemOf(source)?.terrainDuration || 5);
      const labels = {
        electric: 'An electric current ran across the battlefield!',
        grassy: 'Grass grew to cover the battlefield!',
        misty: 'Mist swirled around the battlefield!',
        psychic: 'The battlefield got weird!',
      };
      this.add(text ? `${text}: ${labels[terrain] || 'The terrain changed!'}` : (labels[terrain] || 'The terrain changed!'));
      this.emit({type: 'terrain', terrain});
      return true;
    }

    /**
     * @param {object|null} source the Pokémon setting it, when there is one —
     *   its held item can extend the duration (Warp Prism and Trick Room), the
     *   same way Light Clay extends screens and Terrain Extender extends terrain.
     * @param {object} options `{endless}` — see `ENDLESS`.
     */
    setPseudoWeather(key, source = null, {endless = false} = {}) {
      const id = Dex.toID(key);
      if (!(id in this.field.pseudoWeather)) return false;
      if (this.field.pseudoWeather[id] > 0) {
        /*
         * Using Trick Room, Magic Room or Wonder Room while it is already up
         * *ends* it, as in the games. The engine refused every re-use instead,
         * which was invisible while every room ran out on its own — and is the
         * counterplay an endless room needs, since nothing else in the game
         * removes one. `endless` is excluded so establishing a doctrine cannot
         * cancel itself.
         */
        if (endless || !SELF_CANCELLING_ROOMS.has(id)) return false;
        this.field.pseudoWeather[id] = 0;
        this.add(`${ROOM_NAMES[id]} ended.`);
        this.emit({type: 'pseudoweather', key: id});
        return true;
      }
      // Ion Deluge and Fairy Lock only cover the current/next turn.
      const durations = {iondeluge: 1, fairylock: 2};
      const extended = source ? this.itemOf(source)?.roomDuration?.[id] : null;
      this.field.pseudoWeather[id] = endless ? ENDLESS : (extended || durations[id] || 5);
      const labels = {
        gravity: 'Gravity intensified!', trickroom: 'The dimensions were twisted!',
        magicroom: 'A bizarre area was created!', wonderroom: 'Defense and Sp. Def were swapped!',
        mudsport: "Electricity's power was weakened!", watersport: "Fire's power was weakened!",
        fairylock: 'No one will be able to run away during the next turn!',
        iondeluge: 'A deluge of ions showers the battlefield!',
      };
      this.add(labels[id]);
      this.emit({type: 'pseudoweather', key: id});
      if (id === 'trickroom') {
        for (const side of this.sides) {
          const active = this.active(side.index);
          if (active && !active.fainted) this.runItem('onTrickRoomStart', active);
        }
      }
      return true;
    }

    /** Effective weight in kg, after Heavy/Light Metal and Float Stone. */
    weightOf(pokemon) {
      let weight = pokemon.speciesData?.weightKg || Dex.species(pokemon.species).weightKg || 1;
      const multiplier = this.abilityOf(pokemon)?.weightMultiplier;
      if (multiplier) weight *= multiplier;
      const item = this.itemOf(pokemon);
      if (item && typeof item.onModifyWeight === 'function') {
        const next = item.onModifyWeight(this, pokemon, weight);
        if (Number.isFinite(next)) weight = next;
      }
      return Math.max(0.1, weight);
    }

    /** HP at or below which a pinch berry fires — Gluttony raises it to a half. */
    pinchBerryThreshold(pokemon) {
      return pokemon.maxHP / (this.abilityOf(pokemon)?.earlyBerry ? 2 : 4);
    }

    /** Ripen doubles the numeric payload of a berry. */
    ripen(pokemon, amount) {
      return this.abilityOf(pokemon)?.ripenBerry ? amount * 2 : amount;
    }

    /**
     * Whether `pokemon` can have its item taken by `source`.
     * Sticky Hold blocks it, but Mold Breaker sees through it, hence
     * `defenderAbility` rather than a raw ability lookup.
     */
    canRemoveItem(pokemon, source = null) {
      if (!pokemon?.item) return false;
      // A Mega Stone or forme item cannot be taken from a Pokémon it belongs to
      // — Knock Off, Trick, Switcheroo, Corrosive Gas and Thief all route
      // through here, so one guard covers every route at once.
      if (this.isOwnFormeItem(pokemon)) return false;
      if (pokemon === source) return true;
      return !this.defenderAbility(pokemon, source)?.itemProtected;
    }

    /**
     * May this Pokémon's side take on `itemId`?
     *
     * The **Ring Target Clause**: a side may hold at most one Ring Target. The
     * validator enforces it at team building, and this enforces it *in battle*,
     * so a team cannot assemble a second one with Trick, Switcheroo, Bestow,
     * Thief, Covet, Magician, Pickpocket or Pickup.
     *
     * One predicate rather than a check at each of those seven sites, for the
     * reason §8 records about the duplicated release path: a call site that
     * keeps needing "and also do this" is missing a function call, and the one
     * route somebody forgets is the one that ships.
     *
     * Fainted teammates still count. Otherwise the clause has an obvious hole —
     * spend the holder, then Trick a second copy in — and a battle clause with
     * a known hole is worse than none, because it reads as enforced.
     *
     * @param {object} pokemon  the prospective holder
     * @param {string} itemId
     */
    canReceiveItem(pokemon, itemId) {
      if (!pokemon || !itemId) return true;
      if (!Items.get(itemId)?.uniquePerSide) return true;
      const wanted = Dex.toID(itemId);
      return !this.sides[pokemon.side].team.some(mate =>
        mate !== pokemon && Dex.toID(mate.item) === wanted);
    }

    /** Is the held item this Pokémon's own Mega Stone (before or after evolving)? */
    isOwnMegaStone(pokemon) {
      return this.formeItemMatches(Dex.item(pokemon?.item)?.megaStone, pokemon);
    }

    /**
     * Is the held item this Pokémon's own forme item — a Mega Stone, a Red Orb,
     * a Rusted Sword, a Griseous Orb? True both before and after the change, so
     * the item stays un-stealable once the forme has flipped.
     */
    isOwnFormeItem(pokemon) {
      if (this.isOwnMegaStone(pokemon)) return true;
      return this.formeItemMatches(FORME_CHANGE_ITEMS[Dex.toID(pokemon?.item)], pokemon);
    }

    /** Shared walker for the `{BaseName: TargetName}` shape both tables use. */
    formeItemMatches(mapping, pokemon) {
      if (!mapping) return false;
      if (typeof mapping === 'string') return true;
      const species = Dex.species(pokemon.species);
      return Object.keys(mapping).some(base => Dex.toID(base) === species.id) ||
        Object.values(mapping).some(target => Dex.toID(target) === species.id);
    }

    /**
     * The forme this Pokémon's held item turns it into on entry, or null.
     *
     * Unlike Mega Evolution this is not a declared action and has no
     * once-per-side limit: the games apply it the moment the holder is on the
     * field. Returns null once the change has already happened, so re-entering
     * is a no-op rather than a loop.
     */
    heldFormeFor(pokemon) {
      const mapping = FORME_CHANGE_ITEMS[Dex.toID(pokemon?.item)];
      if (!mapping || !pokemon || pokemon.fainted) return null;
      const target = mapping[Dex.species(pokemon.species).name];
      if (!target || !Dex.hasSpecies(target)) return null;
      const species = Dex.species(target);
      return species.missing || species.id === Dex.toID(pokemon.species) ? null : species;
    }

    /**
     * Apply a held-item forme change on entry.
     *
     * Runs *before* entry hazards, which matters: Groudon is pure Ground and
     * takes 12.5% from Stealth Rock, but Primal Groudon is Fire/Ground and takes
     * 25%. It also runs before `onStart`, so the new forme's ability is the one
     * that fires — Primal Groudon really does set Desolate Land, and
     * Zacian-Crowned enters with Intrepid Sword.
     */
    applyHeldFormeChange(pokemon) {
      const species = this.heldFormeFor(pokemon);
      if (!species) return false;
      this.formeChange(pokemon, species.id,
        {text: `${this.label(pokemon)} transformed into ${species.name}!`});
      const ability = Dex.abilityList(species)[0];
      if (ability && Dex.toID(ability) !== Dex.toID(pokemon.ability)) {
        pokemon.ability = ability;
        pokemon.baseAbility = ability;
        pokemon.abilityState = {};
      }
      return true;
    }

    isGrounded(pokemon) {
      if (this.field.pseudoWeather.gravity > 0) return true;
      if (pokemon.volatiles.smackdown || pokemon.volatiles.ingrain) return true;
      // Iron Ball grounds through Levitate, Magnet Rise and a Flying typing.
      if (this.itemOf(pokemon)?.grounded) return true;
      if (pokemon.volatiles.magnetrise) return false;
      if (this.abilityOf(pokemon)?.ungrounded) return false;
      if (this.itemOf(pokemon)?.ungrounded) return false;
      return !pokemon.types.includes('Flying');
    }

    /* ---- stateless helpers, implemented in src/core/mechanics.js ---- */
    boostMultiplier(stage) { return Mechanics.boostMultiplier(stage); }
    accuracyStageMod(stage) { return Mechanics.accuracyStageMod(stage); }
    weightPower(weight) { return Mechanics.weightPower(weight); }
    weightRatioPower(userWeight, targetWeight) { return Mechanics.weightRatioPower(userWeight, targetWeight); }
    lowHpPower(pokemon) { return Mechanics.lowHpPower(pokemon.currentHP, pokemon.maxHP); }
    canonicalWeather(value) { return Mechanics.canonicalWeather(value); }

    /* ================================================================ *
     * Type effectiveness
     * ================================================================ */

    /**
     * @param {string} type
     * @param {object} target
     * @param {object|null} move
     * @param {object|null} source  the attacker, when the caller knows it.
     *   Needed for Ring Target, which is a property of the *attacker* — see
     *   below. Falls back to `activeMoveUser`, the same escape hatch the
     *   Substitute work uses for functions that were never given the user.
     */
    effectiveness(type, target, move = null, source = null) {
      let mult = Dex.typeEffectiveness(type, target.types);
      if (move?.id === 'freezedry' && target.types.includes('Water')) mult *= 4;
      if (move?.id === 'flyingpress') mult *= Dex.typeEffectiveness('Flying', target.types);
      /*
       * Delta Stream's strong winds: the Flying type loses its weaknesses while
       * a holder is on the field, for every Flying-type Pokémon on both sides.
       *
       * Expressed as "the Flying cell drops from 2x to 1x", which is what the
       * mechanic actually is — not a cap on the total. Halving the product is
       * exact because Flying's cell against Electric, Ice and Rock is always 2,
       * and it keeps the *other* half of a dual typing intact: a Flying/Steel
       * defender still reads 0.5x against Electric rather than being rounded up
       * to neutral, and a Rock/Flying defender goes 4x to 2x rather than to 1x.
       */
      /*
       * The two cheap tests gate the expensive one, and the order is measured
       * rather than stylistic: `strongWindsActive` walks both sides and resolves
       * two abilities, and asking it first made `effectiveness` **2.8x slower**
       * on every call in the game (1.7us -> 4.9us over 400,000 calls). Asking it
       * last confines that to Electric, Ice and Rock aimed at a Flying type,
       * which is a small fraction of calls and almost always answers "no
       * Rayquaza-Mega on the field" immediately.
       */
      if (STRONG_WIND_TYPES.has(type) && target.types.includes('Flying') && this.strongWindsActive()) {
        mult /= 2;
      }
      // Thousand Arrows hits airborne targets regardless; everything else needs
      // the target actually grounded (Gravity, Ingrain, Smack Down, Iron Ball).
      const groundedForThis = move?.id === 'thousandarrows' ||
        (this.isGrounded(target) && !this.defenderAbility(target)?.ungrounded);
      if (type === 'Ground' && mult === 0 && groundedForThis) {
        const nonFlying = target.types.filter(t => t !== 'Flying');
        mult = nonFlying.length ? Dex.typeEffectiveness(type, nonFlying) : 1;
      }
      if (mult === 0 && ['Normal', 'Fighting'].includes(type)) {
        // Scrappy / Mind's Eye are attacker-side; Foresight and Odor Sleuth mark
        // the *defender*, so the volatile is read from the target.
        const attacker = move?.userRef;
        const scrappy = !!(attacker && this.abilityOf(attacker)?.ignoreGhostImmunity) ||
          !!target.volatiles.foresight;
        if (scrappy || move?.ignoreImmunity) {
          const nonGhost = target.types.filter(t => t !== 'Ghost');
          mult = nonGhost.length ? Dex.typeEffectiveness(type, nonGhost) : 1;
        }
      }
      // Miracle Eye is the Psychic-on-Dark counterpart of Foresight.
      if (mult === 0 && type === 'Psychic' && target.volatiles.miracleeye) {
        const nonDark = target.types.filter(t => t !== 'Dark');
        mult = nonDark.length ? Dex.typeEffectiveness(type, nonDark) : 1;
      }
      if (target.volatiles.tarShot && type === 'Fire') mult *= 2;
      /*
       * Ring Target, redesigned (2026-08-14). Upstream is defensive — the
       * *holder* loses its own type immunities — which is a drawback item
       * nobody equips on purpose, and it sat in the pool doing nothing but harm.
       * It is now offensive: the holder's own attacks punch through a type
       * immunity for neutral damage.
       *
       * Read off the attacker, so it needs a source. Callers in the damage
       * path pass one; anything that only asks hypothetically (the AI, the
       * calculator) passes one too, or the estimate would disagree with the
       * hit. `activeMoveUser` is the fallback for the call sites that were
       * never given the user — the same mechanism the Substitute rework added.
       *
       * Deliberately type immunity only. An ability immunity (Levitate, Flash
       * Fire, Water Absorb) is intercepted in `executeMove` through a separate
       * path and is not a zero here, so Ring Target does not quietly beat those
       * too — which would make it far stronger than intended.
       */
      if (mult === 0) {
        const attacker = source || this.activeMoveUser;
        if (attacker && attacker !== target && this.itemOf(attacker)?.piercesImmunities) mult = 1;
      }
      return mult;
    }

    /* ================================================================ *
     * Stats
     * ================================================================ */

    boostMultiplier(stage) {
      return stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage);
    }

    /**
     * @param {object} pokemon
     * @param {string} stat
     * @param {object} [opts] `{ignoreBoosts, ignoreNegative, ignorePositive}`
     */
    getStat(pokemon, stat, opts = {}) {
      let key = stat;
      if (this.field.pseudoWeather.wonderroom > 0) {
        if (stat === 'def') key = 'spd';
        else if (stat === 'spd') key = 'def';
      }
      let value = pokemon.stats[key] ?? pokemon.stats[stat] ?? 1;

      let stage = opts.ignoreBoosts ? 0 : (pokemon.boosts[stat] || 0);
      if (opts.ignoreNegative && stage < 0) stage = 0;
      if (opts.ignorePositive && stage > 0) stage = 0;
      value = Math.floor(value * this.boostMultiplier(stage));

      value = this.modifyValue('onModifyStat', pokemon, value, stat);
      value = Math.floor(value * this.ruinMultiplier(pokemon, stat));

      if (stat === 'spe') {
        const ability = this.abilityOf(pokemon);
        if (pokemon.status === 'par' && !ability?.ignoreParalysisDrop) value = Math.floor(value * 0.5);
        if (this.sideOf(pokemon).conditions.tailwind > 0) value *= 2;
      }
      return Math.max(1, value);
    }

    /**
     * Why is this stat the number it is?
     *
     * Walks the same six layers as `getStat`, in the same order, recording each
     * one that actually moved the value. Every factor is *measured* by running
     * the engine's own hook and taking the ratio, rather than re-deriving the
     * maths — so a new ability or item shows up here automatically, and the
     * breakdown cannot quietly disagree with the real stat. A test asserts the
     * product of the factors reproduces `getStat` exactly.
     *
     * `reveal: false` withholds the sources the viewer is not entitled to see
     * (the opponent's ability and item under `hideOpponentDetails`). Those are
     * still counted in `final`, but `shown` stops at what is public and
     * `partial` says so, so the UI never prints a total it cannot justify.
     *
     * @returns {{stat, base, final, shown, partial, sources: object[]}}
     */
    statBreakdown(pokemon, stat, {reveal = true} = {}) {
      const sources = [];
      const add = (label, factor, {hidden = false, detail = null} = {}) => {
        if (!Number.isFinite(factor) || Math.abs(factor - 1) < 1e-9) return;
        sources.push({label, factor, hidden, detail});
      };

      let key = stat;
      let swapped = null;
      if (this.field.pseudoWeather.wonderroom > 0 && (stat === 'def' || stat === 'spd')) {
        key = stat === 'def' ? 'spd' : 'def';
        swapped = key;
      }
      const base = pokemon.stats[key] ?? pokemon.stats[stat] ?? 1;

      // 1. Boost stages.
      let value = base;
      const stage = pokemon.boosts[stat] || 0;
      if (stage) {
        const after = Math.floor(value * this.boostMultiplier(stage));
        add(`${stage > 0 ? '+' : ''}${stage} stage${Math.abs(stage) === 1 ? '' : 's'}`, after / value, {detail: 'boost'});
        value = after;
      }

      // 2. onModifyStat, ability then item — the order modifyValue uses.
      const ability = this.abilityOf(pokemon);
      if (ability && typeof ability.onModifyStat === 'function') {
        const next = ability.onModifyStat(this, pokemon, stat, value);
        if (typeof next === 'number' && Number.isFinite(next)) {
          add(ability.name, next / value, {hidden: !reveal, detail: 'ability'});
          value = next;
        }
      }
      const item = this.itemOf(pokemon);
      if (item && typeof item.onModifyStat === 'function') {
        const next = item.onModifyStat(this, pokemon, stat, value);
        if (typeof next === 'number' && Number.isFinite(next)) {
          add(item.name, next / value, {hidden: !reveal, detail: 'item'});
          value = next;
        }
      }

      // 3. The Ruin quartet, from whoever is opposite.
      const ruin = this.ruinMultiplier(pokemon, stat);
      if (ruin !== 1) {
        const owner = this.sides
          .map(side => this.active(side.index))
          .find(active => active && !active.fainted && active !== pokemon && this.abilityOf(active)?.ruinStat === stat);
        // The Ruin abilities announce themselves on entry, so they are public.
        add(owner ? this.abilityOf(owner).name : 'Ruin', ruin, {detail: 'ability'});
      }
      value = Math.floor(value * ruin);

      // 4/5. Speed only: paralysis and Tailwind.
      if (stat === 'spe') {
        if (pokemon.status === 'par' && !ability?.ignoreParalysisDrop) {
          add('Paralysis', 0.5, {detail: 'status'});
          value = Math.floor(value * 0.5);
        }
        if (this.sideOf(pokemon).conditions.tailwind > 0) {
          add('Tailwind', 2, {detail: 'field'});
          value *= 2;
        }
      }

      const shown = Math.max(1, sources.reduce((n, s) => (s.hidden ? n : Math.floor(n * s.factor)), base));
      return {
        stat,
        base,
        swapped,
        final: this.getStat(pokemon, stat),
        shown,
        partial: sources.some(s => s.hidden),
        sources,
      };
    }

    /**
     * The Ruin abilities cut one stat of every Pokémon *except* their own
     * holder by 25%. Two copies of the same Ruin ability do not stack, so this
     * returns a single 0.75 regardless of how many are out.
     */
    ruinMultiplier(pokemon, stat) {
      for (const side of this.sides) {
        const active = this.active(side.index);
        if (!active || active.fainted || active === pokemon) continue;
        if (this.abilityOf(active)?.ruinStat === stat) return 0.75;
      }
      return 1;
    }

    /* ================================================================ *
     * Damage / healing / status primitives
     * ================================================================ */

    damage(pokemon, amount, {source = null, category = null, move = null, indirect = false, text = null} = {}) {
      amount = Math.floor(amount);
      if (!Number.isFinite(amount)) amount = 0;
      amount = Math.max(0, amount);
      if (!pokemon || amount <= 0 || pokemon.currentHP <= 0) return 0;
      if (indirect && this.abilityOf(pokemon)?.indirectImmune) return 0;

      if (!indirect && pokemon.volatiles.substituteHP > 0 && !move?.flags?.sound && !move?.infiltrates && source !== pokemon) {
        pokemon.hitSubstituteThisMove = true;
        const dealt = Math.min(amount, pokemon.volatiles.substituteHP);
        pokemon.volatiles.substituteHP -= dealt;
        this.add(`${this.label(pokemon)}'s substitute took the damage!`);
        if (pokemon.volatiles.substituteHP <= 0) {
          delete pokemon.volatiles.substituteHP;
          this.add(`${this.label(pokemon)}'s substitute faded!`);
        }
        return dealt;
      }

      let capped = amount;
      if (!indirect && pokemon.volatiles.endure && amount >= pokemon.currentHP) capped = Math.max(0, pokemon.currentHP - 1);
      if (!indirect && move?.id === 'falseswipe' && amount >= pokemon.currentHP) capped = Math.max(0, pokemon.currentHP - 1);

      const before = pokemon.currentHP;
      pokemon.currentHP = Math.max(0, pokemon.currentHP - capped);
      const dealt = before - pokemon.currentHP;
      if (dealt <= 0) return 0;

      if (!indirect) {
        pokemon.damageTakenThisTurn = (pokemon.damageTakenThisTurn || 0) + dealt;
        pokemon.lastDamageCategory = category;
        pokemon.lastDamageSourceUid = source?.uid || null;
        pokemon.timesHit = (pokemon.timesHit || 0) + 1;
        pokemon.abilityState.lastDamage = dealt;
      }
      if (text) this.add(text);
      this.emit({type: 'damage', target: pokemon.uid, amount: dealt, hp: pokemon.currentHP, maxHP: pokemon.maxHP, indirect});
      if (pokemon.currentHP <= 0) pokemon.fainted = true;
      return dealt;
    }

    healingBlocked(pokemon) { return (pokemon.volatiles.healblock || 0) > 0; }

    heal(pokemon, amount, {text = null, silent = false} = {}) {
      if (!pokemon || pokemon.currentHP <= 0) return 0;
      if (this.healingBlocked(pokemon)) {
        if (!silent) this.add(`${this.label(pokemon)} could not recover health!`);
        return 0;
      }
      const before = pokemon.currentHP;
      pokemon.currentHP = Math.min(pokemon.maxHP, pokemon.currentHP + Math.max(0, Math.floor(amount)));
      const healed = pokemon.currentHP - before;
      if (healed > 0) {
        if (text) this.add(text);
        else if (!silent) this.add(`${this.label(pokemon)} restored ${healed} HP.`);
        this.emit({type: 'heal', target: pokemon.uid, amount: healed, hp: pokemon.currentHP, maxHP: pokemon.maxHP});
      }
      return healed;
    }

    setStatus(pokemon, status, source = null, {text = null, silent = false} = {}) {
      if (!pokemon || pokemon.currentHP <= 0 || pokemon.status) return false;
      // The doll takes it. `addVolatile` has always done this; status and stat
      // drops did not, so a Substitute stopped confusion but not paralysis.
      if (this.blockedBySubstitute(pokemon, source)) return false;
      const sourceSide = source ? source.side : null;
      const targetSide = pokemon.side;
      const types = pokemon.types;

      if (status === 'brn' && types.includes('Fire')) return false;
      const corrosive = source && this.abilityOf(source)?.corrosion;
      if ((status === 'psn' || status === 'tox') && !corrosive && (types.includes('Poison') || types.includes('Steel'))) return false;
      if (status === 'frz' && (types.includes('Ice') || this.effectiveWeather() === 'sun')) return false;
      if (status === 'par' && types.includes('Electric')) return false;
      if (sourceSide != null && sourceSide !== targetSide && this.sides[targetSide].conditions.safeguard > 0) {
        this.add(`${this.label(pokemon)} is protected by Safeguard!`);
        return false;
      }
      if (this.isGrounded(pokemon) && this.field.terrain === 'misty' && sourceSide != null && sourceSide !== targetSide) return false;
      if (status === 'slp') {
        if (this.isGrounded(pokemon) && this.field.terrain === 'electric') return false;
        if (this.sides.some(s => { const a = this.active(s.index); return a && !a.fainted && a.volatiles.uproar; })) return false;
        if (this.rules.sleepClause && this.sides[targetSide].team.some(p => p.status === 'slp' && !p.fainted && p !== pokemon)) {
          this.add('Sleep Clause: only one Pokémon per team can be put to sleep.');
          return false;
        }
      }
      const ability = source ? this.defenderAbility(pokemon, source) : this.abilityOf(pokemon);
      if (ability && typeof ability.onSetStatus === 'function' && ability.onSetStatus(this, pokemon, status, source) === false) {
        if (!silent) this.add(`${this.label(pokemon)}'s ${ability.name} prevents ${STATUS_LABELS[status]}!`);
        return false;
      }
      const itemEffect = this.itemOf(pokemon);
      if (itemEffect && typeof itemEffect.onSetStatus === 'function' && itemEffect.onSetStatus(this, pokemon, status, source) === false) return false;

      pokemon.status = status;
      pokemon.statusData.toxicCounter = 1;
      pokemon.statusData.sleepTurns = status === 'slp' ? this.rng.int(1, 3) : 0;
      this.add(text || `${this.label(pokemon)} was ${STATUS_LABELS[status]}!`);
      this.emit({type: 'status', target: pokemon.uid, status});
      const selfAbility = this.abilityOf(pokemon);
      if (selfAbility && typeof selfAbility.onAfterStatus === 'function') selfAbility.onAfterStatus(this, pokemon, status, source);
      /*
       * The *inflicting* side's ability gets a say too — `onAfterStatus` above
       * is the receiving side (Synchronize), and Poison Puppeteer needed the
       * other one. Hooking it here rather than in the move executor means every
       * route counts: a Toxic, a secondary effect, Toxic Chain, and the
       * holder's own Poison Point punishing a contact attacker.
       */
      const sourceAbility = source && source !== pokemon ? this.abilityOf(source) : null;
      if (sourceAbility && typeof sourceAbility.onAfterInflictStatus === 'function') {
        sourceAbility.onAfterInflictStatus(this, source, pokemon, status);
      }
      this.checkItemTriggers(pokemon);
      this.checkFormeTriggers(pokemon);
      return true;
    }

    cureStatus(pokemon, text) {
      if (!pokemon.status) return false;
      pokemon.status = null;
      pokemon.statusData.toxicCounter = 1;
      pokemon.statusData.sleepTurns = 0;
      if (text) this.add(text);
      this.emit({type: 'status', target: pokemon.uid, status: null});
      return true;
    }

    boost(target, boosts, source = null, {silentFail = false, noReflect = false} = {}) {
      if (!target || target.currentHP <= 0) return false;
      /*
       * Only a *drop* is soaked. A Substitute is protection, not a wall: an
       * opponent handing the holder a boost (Swagger, Flatter, Decorate) still
       * lands, exactly as in the games, and blocking those would have been a
       * silent nerf hiding inside a bug fix.
       */
      if (this.blockedBySubstitute(target, source) &&
          Object.values(boosts || {}).some(stage => stage < 0)) return false;
      const working = {};
      for (const [key, value] of Object.entries(boosts || {})) {
        if (!BOOST_KEYS.includes(key) || !value) continue;
        working[key] = value;
      }
      if (!Object.keys(working).length) return false;

      const ability = this.abilityOf(target);
      if (ability?.invertBoosts && source === target) {
        for (const key of Object.keys(working)) working[key] = -working[key];
      } else if (ability?.invertBoosts) {
        for (const key of Object.keys(working)) working[key] = -working[key];
      }
      if (ability?.boostMultiplier) {
        for (const key of Object.keys(working)) working[key] *= ability.boostMultiplier;
      }

      const hostile = source && source.side !== target.side;
      if (hostile) {
        for (const key of Object.keys(working)) {
          if (working[key] < 0 && this.sides[target.side].conditions.mist > 0) {
            this.add(`${this.label(target)} is protected by Mist!`);
            delete working[key];
          }
        }
        const guard = this.defenderAbility(target, source);
        if (guard && typeof guard.onTryBoost === 'function' && !noReflect) guard.onTryBoost(this, target, working, source);
        const item = this.itemOf(target);
        if (item && typeof item.onTryBoost === 'function') item.onTryBoost(this, target, working, source);
      }

      let changed = false;
      const applied = {};
      for (const [key, value] of Object.entries(working)) {
        const before = target.boosts[key] || 0;
        const after = clamp(before + value, -6, 6);
        if (after === before) {
          if (!silentFail) this.add(`${this.label(target)}'s ${Dex.STAT_NAMES[key] || key} won't go ${value > 0 ? 'higher' : 'lower'}!`);
          continue;
        }
        target.boosts[key] = after;
        applied[key] = after - before;
        changed = true;
        if (value > 0) target.statRaisedThisTurn = true; else target.statLoweredThisTurn = true;
        const magnitude = Math.abs(value);
        const word = value > 0 ? 'rose' : 'fell';
        const qualifier = magnitude >= 3 ? ' drastically' : magnitude === 2 ? ' sharply' : '';
        this.add(`${this.label(target)}'s ${Dex.STAT_NAMES[key] || key}${qualifier} ${word}!`);
      }
      if (!changed) return false;
      this.emit({type: 'boost', target: target.uid, boosts: applied});

      if (hostile) {
        const after = this.abilityOf(target);
        if (after && typeof after.onAfterBoost === 'function') after.onAfterBoost(this, target, applied, source);
        const reactive = this.itemOf(target);
        if (reactive && typeof reactive.onAfterBoostTaken === 'function') reactive.onAfterBoostTaken(this, target, applied, source);
      }
      // Opportunist / Mirror Herb copy the opponent's gains.
      const foe = this.foeActive(target);
      if (foe && !foe.fainted && Object.values(applied).some(v => v > 0)) {
        const foeAbility = this.abilityOf(foe);
        if (foeAbility && typeof foeAbility.onFoeBoost === 'function') foeAbility.onFoeBoost(this, foe, applied, target);
        const foeItem = this.itemOf(foe);
        if (foeItem && typeof foeItem.onFoeBoost === 'function') foeItem.onFoeBoost(this, foe, applied, target);
      }
      return true;
    }

    /* ================================================================ *
     * Items
     * ================================================================ */

    /**
     * Record an item that has **ceased to exist** on the field, for Pickup.
     *
     * Two exclusions, both deliberate:
     *
     * - **Berries are never recorded.** They are eaten, and an eaten berry is gone
     *   — recovering one would hand back a Sitrus the holder had just spent, which
     *   turns Pickup into a second life rather than a scavenging ability. Keyed on
     *   `isBerry` rather than on the call path, so it holds however the berry left
     *   (eaten, knocked off, corroded) and cannot be bypassed by a new caller.
     * - **An item that merely changed hands is not recorded** — Thief, Magician,
     *   Pickpocket, Trick, Switcheroo, Bestow. It still exists on somebody, so
     *   letting Pickup recover it would put two copies of one item in the battle.
     *
     * What is left is what Pickup should plausibly find: a non-berry consumable
     * that was spent (Focus Sash, Air Balloon, the herbs and policies), and an
     * item destroyed outright by Knock Off, Corrosive Gas, or a replacement steal.
     */
    recordItemLoss(itemId) {
      if (!itemId) return;
      if (Dex.item(itemId)?.isBerry) return;
      this.lastRemovedItem = Dex.toID(itemId);
    }

    consumeItem(pokemon, text) {
      if (!pokemon.item) return false;
      pokemon.consumedItem = pokemon.item;
      this.recordItemLoss(pokemon.item);
      pokemon.item = null;
      if (text) this.add(text);
      this.emit({type: 'itemused', target: pokemon.uid, item: pokemon.consumedItem});
      const ability = this.abilityOf(pokemon);
      if (ability && Dex.toID(pokemon.ability) === 'unburden') pokemon.volatiles.unburden = true;
      return true;
    }

    /**
     * Make `eater` eat `itemId` as a Berry on demand, whether or not it is holding
     * it and whether or not the Berry's own condition is met.
     *
     * This is the force-eat path that Bug Bite, Pluck, Stuff Cheeks and a flung
     * Berry all needed and none of them could have before: every Berry fused its
     * trigger to its effect inside `onUpdate`, so there was no way to reach the
     * effect except by satisfying the condition. `items.js` now separates the two
     * and exposes `onForceEat`.
     *
     * **The caller owns removing the Berry from whoever held it** — the eater is
     * usually not the holder (Bug Bite eats the *target's* Berry), so consuming it
     * here would be wrong in most cases.
     *
     * Counts as eating for everything that cares: `ateBerry` (so Belch is enabled
     * for the eater, and only the eater), and the ability `onEatBerry` hook that
     * Cheek Pouch uses. A Berry with no eater-side effect — the type-resist ones —
     * simply does nothing, which is correct.
     *
     * @returns {boolean} whether the item was a Berry at all.
     */
    forceEatBerry(eater, itemId, {text} = {}) {
      const item = Dex.item(itemId);
      if (!item || !item.isBerry || !eater || eater.fainted) return false;
      if (text) this.add(text);
      eater.ateBerry = true;
      const definition = Items.get(item.id);
      if (definition && typeof definition.onForceEat === 'function') {
        definition.onForceEat(this, eater);
      }
      const ability = this.abilityOf(eater);
      if (ability && typeof ability.onEatBerry === 'function') ability.onEatBerry(this, eater);
      return true;
    }

    eatBerry(pokemon, text) {
      const foe = this.foeActive(pokemon);
      if (foe && !foe.fainted && this.abilityOf(foe)?.foeBerryBlock) return false;
      pokemon.ateBerry = true;
      const ability = this.abilityOf(pokemon);
      const eaten = this.consumeItem(pokemon, text);
      if (eaten && ability && typeof ability.onEatBerry === 'function') ability.onEatBerry(this, pokemon);
      return eaten;
    }

    /**
     * Re-evaluate ability-driven forme changes (Zen Mode, Schooling, Forecast,
     * Power Construct, Shields Down).
     *
     * These are conditions, not events: the forme follows current HP or current
     * weather, so it has to be re-checked whenever either moves rather than
     * hooked to one moment. Polled from the same places as `checkItemTriggers`
     * for exactly that reason. `onFormeCheck` must be idempotent — it is called
     * far more often than it fires, and `formeChange` already no-ops when the
     * species is unchanged.
     */
    checkFormeTriggers(pokemon) {
      if (!pokemon || pokemon.fainted || pokemon.currentHP <= 0) return;
      this.runAbility('onFormeCheck', pokemon);
    }

    /** Re-evaluate HP/status-triggered items (berries, Booster Energy). */
    checkItemTriggers(pokemon) {
      if (!pokemon || pokemon.fainted) return;
      for (let i = 0; i < 3; i++) {
        const item = this.itemOf(pokemon);
        if (!item || typeof item.onUpdate !== 'function') return;
        const before = pokemon.item;
        item.onUpdate(this, pokemon);
        if (pokemon.item === before) return;
      }
    }

    /* ================================================================ *
     * Volatiles
     * ================================================================ */

    addVolatile(target, volatile, source = null, move = null) {
      if (!volatile || !target || target.currentHP <= 0) return false;
      target.volatiles = target.volatiles || {};
      const ability = source && source !== target ? this.defenderAbility(target, source) : this.abilityOf(target);
      if (ability && typeof ability.onSetVolatile === 'function' && ability.onSetVolatile(this, target, volatile, source) === false) {
        this.add(`${this.label(target)}'s ${ability.name} prevented it!`);
        return false;
      }
      if (target.volatiles.substituteHP > 0 && source && source !== target && !move?.flags?.sound && !move?.infiltrates) return false;

      switch (volatile) {
        case 'confusion': {
          if (target.volatiles.confusion) return false;
          target.volatiles.confusion = this.rng.int(2, 5);
          this.add(`${this.label(target)} became confused!`);
          this.checkItemTriggers(target);
          this.checkFormeTriggers(target);
          return true;
        }
        case 'flinch': {
          if (target.hasActedThisTurn) return false;
          const dust = this.defenderAbility(target, source);
          if (dust && typeof dust.onFlinch === 'function') dust.onFlinch(this, target);
          target.volatiles.flinch = true;
          return true;
        }
        case 'yawn':
          if (target.status || target.volatiles.yawn) return false;
          target.volatiles.yawn = 2;
          this.add(`${this.label(target)} grew drowsy!`);
          return true;
        case 'partiallytrapped': {
          // Grip Claw extends the bind; Binding Band deepens the chip. Both are
          // captured now because the holder may leave before it expires.
          const sourceItem = source ? this.itemOf(source) : null;
          const turns = sourceItem?.trapDuration || this.rng.int(4, 5);
          const denominator = sourceItem?.bindingMultiplier ? 6 : 8;
          target.volatiles.partiallyTrapped = {turns, denominator, sourceSide: source ? source.side : null};
          this.add(`${this.label(target)} was trapped!`);
          return true;
        }
        case 'aquaring': target.volatiles.aquaring = true; this.add(`${this.label(target)} surrounded itself with a veil of water!`); return true;
        case 'attract': {
          if (!source || source.gender === 'N' || target.gender === 'N' || source.gender === target.gender) return false;
          target.volatiles.attract = source.uid;
          this.add(`${this.label(target)} fell in love!`);
          return true;
        }
        case 'charge': target.volatiles.charge = 2; this.add(`${this.label(target)} began charging power!`); return true;
        case 'defensecurl': target.volatiles.defensecurl = true; return true;
        case 'destinybond': target.volatiles.destinybond = true; this.add(`${this.label(target)} is trying to take its foe down with it!`); return true;
        case 'disable': {
          if (!target.lastMoveId) return false;
          target.volatiles.disable = {moveId: target.lastMoveId, turns: 4};
          this.add(`${this.label(target)}'s ${Dex.move(target.lastMoveId).name} was disabled!`);
          return true;
        }
        case 'encore': {
          if (!target.lastMoveId || !target.moves.some(m => m.id === target.lastMoveId)) return false;
          target.volatiles.encore = {moveId: target.lastMoveId, turns: 3};
          this.add(`${this.label(target)} received an encore!`);
          return true;
        }
        case 'endure': target.volatiles.endure = true; return true;
        case 'focusenergy': target.volatiles.focusenergy = true; this.add(`${this.label(target)} is getting pumped!`); return true;
        case 'foresight': target.volatiles.foresight = true; this.add(`${this.label(target)} was identified!`); return true;
        case 'miracleeye': target.volatiles.miracleeye = true; this.add(`${this.label(target)} was identified!`); return true;
        case 'ingrain': target.volatiles.ingrain = true; this.add(`${this.label(target)} planted its roots!`); return true;
        case 'magnetrise': target.volatiles.magnetrise = 5; this.add(`${this.label(target)} levitated with electromagnetism!`); return true;
        case 'minimize': target.volatiles.minimize = true; return true;
        case 'nightmare': if (target.status !== 'slp') return false; target.volatiles.nightmare = true; return true;
        case 'smackdown': target.volatiles.smackdown = true; this.add(`${this.label(target)} fell straight down!`); return true;
        case 'stockpile': {
          if ((target.volatiles.stockpile || 0) >= 3) return false;
          target.volatiles.stockpile = (target.volatiles.stockpile || 0) + 1;
          this.add(`${this.label(target)} stockpiled ${target.volatiles.stockpile}!`);
          return true;
        }
        case 'substitute': {
          if (target.volatiles.substituteHP || target.currentHP <= Math.floor(target.maxHP / 4)) return false;
          const cost = Math.floor(target.maxHP / 4);
          this.damage(target, cost, {indirect: true});
          target.volatiles.substituteHP = cost;
          this.add(`${this.label(target)} put in a substitute!`);
          return true;
        }
        case 'taunt': target.volatiles.taunt = 3; this.add(`${this.label(target)} fell for the taunt!`); return true;
        case 'torment': target.volatiles.torment = true; this.add(`${this.label(target)} was subjected to torment!`); return true;
        case 'embargo': target.volatiles.embargo = 5; this.add(`${this.label(target)} can't use items!`); return true;
        case 'healblock': target.volatiles.healblock = 5; this.add(`${this.label(target)} was prevented from healing!`); return true;
        case 'gastroacid': target.volatiles.abilitySuppressed = true; this.add(`${this.label(target)}'s Ability was suppressed!`); return true;
        case 'protect': target.protectedThisTurn = true; return true;
        case 'curse': target.volatiles.curse = true; return true;
        case 'saltcure': target.volatiles.saltcure = true; this.add(`${this.label(target)} is being salt cured!`); return true;
        case 'leechseed': return this.applyLeechSeed(source, target);
        case 'octolock': target.volatiles.octolock = true; this.add(`${this.label(target)} can no longer escape!`); return true;
        case 'powder': target.volatiles.powder = true; return true;
        case 'telekinesis': target.volatiles.telekinesis = 3; return true;
        case 'tarshot': target.volatiles.tarShot = true; this.add(`${this.label(target)} became weaker to Fire!`); return true;
        case 'syrupbomb': target.volatiles.syrupbomb = 3; return true;
        default:
          return false;
      }
    }

    applyLeechSeed(source, target) {
      if (!source) return false;
      if (target.types.includes('Grass')) {
        this.add(`It doesn't affect ${this.label(target)}...`);
        return false;
      }
      if (target.volatiles.substituteHP > 0) return false;
      if (target.volatiles.leechSeed != null) {
        this.add(`${this.label(target)} is already seeded.`);
        return false;
      }
      target.volatiles.leechSeed = source.side;
      this.add(`${this.label(target)} was seeded!`);
      return true;
    }

    /* ================================================================ *
     * Side conditions and hazards
     * ================================================================ */

    addSideCondition(side, key, {duration = null, silent = false} = {}) {
      const cond = side.conditions;
      if (key === 'spikes') {
        if (cond.spikes >= 3) return false;
        cond.spikes++;
        if (!silent) this.add(`Spikes were scattered on ${side.name}'s side!`);
        return true;
      }
      if (key === 'toxicspikes') {
        if (cond.toxicspikes >= 2) return false;
        cond.toxicspikes++;
        if (!silent) this.add(`Toxic Spikes were scattered on ${side.name}'s side!`);
        return true;
      }
      if (key === 'stealthrock') {
        if (cond.stealthrock) return false;
        cond.stealthrock = 1;
        if (!silent) this.add(`Pointed stones float in the air around ${side.name}'s side!`);
        return true;
      }
      if (key === 'stickyweb') {
        if (cond.stickyweb) return false;
        cond.stickyweb = 1;
        if (!silent) this.add(`A sticky web spreads out on ${side.name}'s side!`);
        return true;
      }
      const durations = {reflect: 5, lightscreen: 5, auroraveil: 5, safeguard: 5, mist: 5, tailwind: 4,
        quickguard: 1, wideguard: 1, craftyshield: 1, matblock: 1, luckychant: 5};
      if (!(key in durations) || cond[key] > 0) return false;
      cond[key] = duration || durations[key];
      const labels = {
        reflect: `Reflect raised ${side.name}'s Defense!`,
        lightscreen: `Light Screen raised ${side.name}'s Sp. Def!`,
        auroraveil: `Aurora Veil made ${side.name}'s team stronger against attacks!`,
        safeguard: `${side.name}'s team became cloaked in a mystical veil!`,
        mist: `${side.name}'s team became shrouded in mist!`,
        tailwind: `A tailwind blew behind ${side.name}'s team!`,
        quickguard: `Quick Guard protected ${side.name}'s team!`,
        wideguard: `Wide Guard protected ${side.name}'s team!`,
        craftyshield: `Crafty Shield protected ${side.name}'s team!`,
        matblock: `${side.name}'s team was protected by a kicked-up mat!`,
        luckychant: `The Lucky Chant shielded ${side.name}'s team from critical hits!`,
      };
      if (!silent) this.add(labels[key]);
      this.emit({type: 'sidecondition', side: side.index, key, value: cond[key]});
      return true;
    }

    applyEntryHazards(pokemon) {
      const side = this.sideOf(pokemon);
      const cond = side.conditions;
      if (this.itemOf(pokemon)?.ignoreHazards) return;

      if (cond.stealthrock && pokemon.currentHP > 0) {
        const mult = Dex.typeEffectiveness('Rock', pokemon.types);
        this.damage(pokemon, Math.max(1, Math.floor(pokemon.maxHP * mult / 8)), {indirect: true, text: `Pointed stones dug into ${this.label(pokemon)}!`});
      }
      if (cond.spikes > 0 && pokemon.currentHP > 0 && this.isGrounded(pokemon)) {
        const fractions = [0, 1 / 8, 1 / 6, 1 / 4];
        this.damage(pokemon, Math.max(1, Math.floor(pokemon.maxHP * fractions[cond.spikes])), {indirect: true, text: `${this.label(pokemon)} was hurt by the spikes!`});
      }
      if (cond.toxicspikes > 0 && pokemon.currentHP > 0 && this.isGrounded(pokemon)) {
        if (pokemon.types.includes('Poison')) {
          cond.toxicspikes = 0;
          this.add(`${this.label(pokemon)} absorbed the Toxic Spikes!`);
        } else if (!pokemon.types.includes('Steel') && !this.abilityOf(pokemon)?.toxicSpikesImmune) {
          // Magic Guard's restored legacy protection. A Poison type still
          // absorbs the layers first, exactly as it would without the ability.
          this.setStatus(pokemon, cond.toxicspikes >= 2 ? 'tox' : 'psn', null);
        }
      }
      if (cond.stickyweb && pokemon.currentHP > 0 && this.isGrounded(pokemon)) {
        this.add(`${this.label(pokemon)} was caught in a sticky web!`);
        this.boost(pokemon, {spe: -1}, null);
      }
      if (cond.healingwish && pokemon.currentHP > 0) {
        cond.healingwish = false;
        this.cureStatus(pokemon);
        this.heal(pokemon, pokemon.maxHP, {text: `${this.label(pokemon)} became cloaked in a mystical veil!`});
      }
    }

    /* ================================================================ *
     * Switching
     * ================================================================ */

    switchIn(sideIndex, teamIndex, {passBoosts = false, passVolatiles = false, passSubstitute = false, silent = false, text = null} = {}) {
      const side = this.sides[sideIndex];
      const outgoing = side.team[side.activeIndex];
      const incoming = side.team[teamIndex];
      if (!incoming || incoming.fainted) return false;
      if (incoming === outgoing && !outgoing.fainted) return false;

      const boosts = passBoosts && outgoing ? deepClone(outgoing.boosts) : null;
      let volatiles = passVolatiles && outgoing ? deepClone(outgoing.volatiles) : null;
      // Shed Tail hands over the Substitute alone — no stat changes, no other
      // volatiles — so the Pokémon coming in is already behind the doll.
      if (!volatiles && passSubstitute && outgoing?.volatiles.substituteHP > 0) {
        volatiles = {substituteHP: outgoing.volatiles.substituteHP};
      }

      if (outgoing && !outgoing.fainted) {
        this.runAbility('onSwitchOut', outgoing);
        this.clearOnSwitch(outgoing);
      } else if (outgoing) {
        this.clearOnSwitch(outgoing);
      }

      side.activeIndex = teamIndex;
      incoming.boosts = boosts || {atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0};
      incoming.volatiles = volatiles || {};
      for (const key of ['flinch', 'protect', 'endure', 'charging', 'recharge', 'lockedMove', 'disguiseBusted', 'iceFaceBroken']) delete incoming.volatiles[key];
      incoming.types = [...incoming.baseTypes];
      if (incoming.terastallized) incoming.types = [incoming.teraType];
      incoming.ability = incoming.baseAbility;
      incoming.abilityState = {};
      incoming.activeSinceTurn = this.turn;
      incoming.activeTurns = 0;
      incoming.switchedInThisTurn = true;
      incoming.faintHandled = false;
      incoming.statusData.toxicCounter = 1;
      incoming.revealed = true;
      incoming.protectedThisTurn = false;

      if (!silent) {
        this.add(text || (sideIndex === 0 ? `Go! ${incoming.name}!` : `${side.name} sent out ${incoming.name}!`));
      }
      this.emit({type: 'switch', side: sideIndex, uid: incoming.uid, species: incoming.species, skin: incoming.skin || null, name: incoming.name});

      // Before hazards: the Primal/Crowned/Origin typing is what the hazards
      // should be measured against.
      this.applyHeldFormeChange(incoming);
      this.applyEntryHazards(incoming);
      if (incoming.currentHP > 0) {
        this.runAbility('onStart', incoming);
        this.runItem('onStart', incoming);
        this.checkItemTriggers(incoming);
        this.checkFormeTriggers(incoming);
      }
      return true;
    }

    /**
     * Swap a Pokémon to another forme for the rest of the battle.
     *
     * Temporary by construction: battle Pokémon are built fresh from their set
     * each battle and `pokemon.set` is never touched here, so nothing about the
     * change survives into the team, the save or the next battle. Stats are
     * recomputed from the new base stats using the same level/EVs/IVs/nature;
     * current HP is carried over and re-clamped in case max HP moved.
     */
    formeChange(pokemon, speciesId, {text = null} = {}) {
      const species = Dex.species(speciesId);
      if (!species || pokemon.species === species.id) return false;
      const stats = PokemonLib.calcStats(Object.assign({}, pokemon.set, {species: species.id}));
      const hpRatio = pokemon.currentHP / Math.max(1, pokemon.maxHP);
      pokemon.species = species.id;
      pokemon.speciesData = species;
      pokemon.stats = stats;
      pokemon.maxHP = stats.hp;
      pokemon.currentHP = clamp(Math.round(hpRatio * stats.hp) || 1, 1, stats.hp);
      pokemon.baseTypes = [...species.types];
      if (!pokemon.terastallized) pokemon.types = [...species.types];
      if (text) this.add(text);
      this.emit({type: 'forme', side: pokemon.side, uid: pokemon.uid, species: species.id});
      return true;
    }

    clearOnSwitch(pokemon) {
      if (!pokemon) return;
      pokemon.protectedThisTurn = false;
      pokemon.volatiles = {};
      pokemon.boosts = {atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0};
      pokemon.ability = pokemon.baseAbility;
      pokemon.abilityState = {};
      pokemon.statusData.toxicCounter = 1;
      pokemon.choiceLockedMove = null;
      pokemon.lastMoveId = null;
      // Conditional formes end when the holder leaves the field: an Aegislash
      // comes back in Shield forme, a busted Mimikyu comes back disguised. The
      // formes that are meant to last a battle — Mega, Primal, Battle Bond,
      // Power Construct — do not declare `formeReverts`, and Mega additionally
      // overwrites `baseAbility`, so neither is caught here.
      const ability = Abilities.get(pokemon.baseAbility);
      if (ability?.formeReverts) this.formeChange(pokemon, Dex.toID(pokemon.set.species));
      /*
       * A move forme reverts too — Meloetta comes back in Aria forme, as in the
       * games, so Relic Song buys a state for one appearance rather than a
       * permanent upgrade. Derived from `MOVE_FORMES` rather than flagged on the
       * Pokémon, so the revert cannot drift from the table that produced it.
       */
      if (this.isMoveFormeOf(pokemon.species, pokemon.set.species)) {
        this.formeChange(pokemon, Dex.toID(pokemon.set.species));
      }
      // After the forme is settled, not before — baseTypes moves with it.
      pokemon.types = pokemon.terastallized ? [pokemon.teraType] : [...pokemon.baseTypes];
      /*
       * Primal weather ends when the Pokémon that set it leaves the field —
       * that is the whole reason it needs no turn counter. `force` is required
       * because `clearWeather` otherwise refuses to touch primal weather.
       */
      if (this.field.weatherPrimal && this.field.weatherSource === pokemon.uid) {
        const ended = {
          primordialsea: 'The heavy rain has lifted!',
          desolateland: 'The harsh sunlight faded!',
        }[this.field.weatherPrimal];
        this.clearWeather({text: ended, force: true});
      }
    }

    canSwitch(sideIndex) {
      const side = this.sides[sideIndex];
      return side.team.some((p, i) => i !== side.activeIndex && !p.fainted);
    }

    isTrapped(pokemon) {
      if (this.itemOf(pokemon)?.escapesTrapping) return false;
      if (this.field.pseudoWeather.fairylock > 0) return true;
      if (pokemon.volatiles.partiallyTrapped || pokemon.volatiles.trapped || pokemon.volatiles.ingrain || pokemon.volatiles.octolock) return true;
      if (pokemon.types.includes('Ghost')) return false;
      const foe = this.foeActive(pokemon);
      if (!foe || foe.fainted) return false;
      if (this.abilityOf(pokemon)?.trapImmune) return false;
      const foeAbility = this.abilityOf(foe);
      if (foeAbility && typeof foeAbility.onTrapped === 'function') return !!foeAbility.onTrapped(this, foe, pokemon);
      return false;
    }

    /** Queue an immediate mid-turn switch request (U-turn, Eject Button, ...). */
    requestSwitchOut(pokemon, reason) {
      if (!this.canSwitch(pokemon.side)) return false;
      const side = this.sideOf(pokemon);
      side.switchRequest = {reason, passBoosts: false, passVolatiles: false};
      return true;
    }

    /** Roar / Whirlwind / Dragon Tail: the engine picks the replacement. */
    forceSwitch(side) {
      if (!this.canSwitch(side.index)) return false;
      const active = this.active(side.index);
      if (active && (this.abilityOf(active)?.cannotBeForced || active.volatiles.ingrain)) {
        this.add(`${this.label(active)} anchored itself and would not budge!`);
        return false;
      }
      const options = side.team.map((p, i) => ({p, i})).filter(x => x.i !== side.activeIndex && !x.p.fainted);
      if (!options.length) return false;
      const pick = this.rng.pick(options);
      const old = side.team[side.activeIndex];
      this.switchIn(side.index, pick.i, {text: `${this.label(old)} was dragged out!`});
      return true;
    }

    /* ================================================================ *
     * Terastallization
     * ================================================================ */

    canTerastallize(pokemon) {
      if (!this.rules.tera) return false;
      const side = this.sideOf(pokemon);
      return !side.terastallized && !pokemon.terastallized;
    }

    /* ================================================================ *
     * Mega Evolution
     *
     * No Key Stone / Mega Bracelet is required — holding the species' own
     * Mega Stone is enough. Everything else follows the usual rules: once per
     * side per battle, the stone is never consumed and cannot be removed, the
     * Mega forme's ability replaces the current one, and the change lasts for
     * the rest of the battle (including across switches) but never leaves it.
     * ================================================================ */

    /** The Mega forme this Pokémon's held stone would turn it into, or null. */
    megaFormeFor(pokemon) {
      if (!pokemon) return null;
      // Rayquaza is the exception: no stone, it Mega Evolves by knowing Dragon
      // Ascent. Its held item is irrelevant.
      if (Dex.toID(pokemon.species) === 'rayquaza') {
        const knows = (pokemon.moves || []).some(m => m.id === 'dragonascent');
        return knows && Dex.hasSpecies('rayquazamega') ? Dex.species('rayquazamega') : null;
      }
      const stone = Dex.item(pokemon.item)?.megaStone;
      if (!stone) return null;
      // Packaged as {"Base Species Name": "Mega Forme Name"} — one stone can
      // serve several base formes (Meowsticite, Tatsugirinite).
      const target = typeof stone === 'string' ? stone : stone[Dex.species(pokemon.species).name];
      if (!target || !Dex.hasSpecies(target)) return null;
      const species = Dex.species(target);
      return species.missing ? null : species;
    }

    /**
     * The move half of the forme routes — Relic Song (`Mechanics.MOVE_FORMES`).
     *
     * Called from `executeMove` only when the move actually succeeded, so a
     * missed or blocked Relic Song does not transform. **It toggles**, because
     * the table lists both directions: using it again returns Meloetta to Aria
     * forme, as in the games.
     *
     * The typing and stats move with it through `formeChange`, which never
     * touches `pokemon.set` — so nothing leaks into the saved team, and
     * `clearOnSwitch` can send it home by comparing against the set's species.
     *
     * **The ability is deliberately NOT replaced.** Mega Evolution and the held
     * forme items overwrite it because those formes bring their own; both
     * Meloetta formes have Serene Grace, so there is nothing to swap and doing
     * it anyway would be a second code path with no case behind it.
     */
    applyMoveFormeChange(pokemon, move) {
      const table = Mechanics.MOVE_FORMES;
      if (!table || !pokemon || pokemon.fainted) return false;
      const entries = table[Dex.toID(move.id || move)] || [];
      const current = Dex.toID(pokemon.species);
      for (const entry of entries) {
        if (Dex.toID(entry.from) !== current) continue;
        const target = Dex.species(entry.to);
        if (!target || target.missing) return false;
        this.formeChange(pokemon, target.id,
          {text: `${this.label(pokemon)} transformed into ${target.name}!`});
        return true;
      }
      return false;
    }

    /** Is this species a move-forme target of the set's own species? */
    isMoveFormeOf(speciesId, setSpeciesId) {
      const table = Mechanics.MOVE_FORMES;
      if (!table) return false;
      for (const entries of Object.values(table)) {
        for (const entry of entries) {
          if (Dex.toID(entry.from) === Dex.toID(setSpeciesId) && Dex.toID(entry.to) === Dex.toID(speciesId)) return true;
        }
      }
      return false;
    }

    canMegaEvolve(pokemon) {
      if (!this.rules.mega || !pokemon || pokemon.fainted) return false;
      const side = this.sideOf(pokemon);
      if (!side || side.megaEvolved || pokemon.megaEvolved) return false;
      return !!this.megaFormeFor(pokemon);
    }

    megaEvolve(pokemon) {
      if (!this.canMegaEvolve(pokemon)) return false;
      const species = this.megaFormeFor(pokemon);
      this.sideOf(pokemon).megaEvolved = true;
      pokemon.megaEvolved = true;
      this.formeChange(pokemon, species.id,
        {text: `${this.label(pokemon)} Mega Evolved into ${species.name}!`});
      // The Mega forme brings its own ability, which persists across switches.
      const ability = Dex.abilityList(species)[0];
      if (ability && Dex.toID(ability) !== Dex.toID(pokemon.ability)) {
        pokemon.ability = ability;
        pokemon.baseAbility = ability;
        pokemon.abilityState = {};
        this.runAbility('onStart', pokemon);
      }
      return true;
    }

    terastallize(pokemon) {
      if (!this.canTerastallize(pokemon)) return false;
      const side = this.sideOf(pokemon);
      side.terastallized = true;
      pokemon.terastallized = true;
      pokemon.types = [pokemon.teraType];
      this.add(`${this.label(pokemon)} terastallized into the ${pokemon.teraType} type!`);
      this.emit({type: 'tera', target: pokemon.uid, teraType: pokemon.teraType});
      // Teraform Zero flattens the field on Terastallizing. Run after the type
      // change and the event, so the log reads in the order it happens.
      this.runAbility('onTerastallize', pokemon);
      return true;
    }

    /**
     * STAB multiplier accounting for Tera, Adaptability and **live** typing.
     *
     * The two branches read different type arrays on purpose, and getting that
     * backwards is the bug this comment exists to prevent.
     *
     * - **Terastallized:** `original` must be the *base* typing, because Tera
     *   replaces `types` outright. "Did this Pokémon already have the type it
     *   Terastallized into" is a question about what it was, so the 2x / 2.25x
     *   same-type bonus can only come from `baseTypes`.
     * - **Otherwise:** `types` is the live typing, and STAB follows it. It is
     *   `baseTypes` for almost everything, and differs exactly when something
     *   has retyped the Pokémon mid-battle — Protean, Libero, Soak, Conversion,
     *   Conversion 2, Burn Up, Double Shock, Magic Powder, Reflect Type,
     *   Trick-or-Treat, Forest's Curse.
     *
     * **This read `baseTypes` in both branches until 2026-08-16, and Protean
     * was the casualty.** The ability retyped correctly — the log printed
     * "transformed into the Ice type!" and `types` became `['Ice']` — and then
     * STAB was computed from Water/Dark, so the whole offensive point of the
     * ability did nothing. Measured, Mega Greninja into a 252 HP / 252 SpD
     * Great Tusk: Ice Beam 223-261 before, 335-392 after, exactly 1.5x. Hydro
     * Pump and Dark Pulse were unchanged at 1.0x, because Water and Dark are
     * base types already — that pair is the control, and any future change here
     * must leave it alone.
     *
     * It survived because the one type change anybody tested was the one that
     * already worked: Tera has its own branch, written against `baseTypes` for
     * the correct reason above, which made the line below look deliberate.
     */
    stabFor(pokemon, moveType) {
      const ability = this.abilityOf(pokemon);
      const adaptability = ability?.stabOverride === 2;
      const original = pokemon.baseTypes.includes(moveType);
      if (pokemon.terastallized) {
        const isTera = pokemon.teraType === moveType;
        if (isTera && original) return adaptability ? 2.25 : 2;
        if (isTera || original) return adaptability ? 2 : 1.5;
        return 1;
      }
      if (!(pokemon.types || pokemon.baseTypes).includes(moveType)) return 1;
      return adaptability ? 2 : 1.5;
    }

    /* ================================================================ *
     * Turn flow
     * ================================================================ */

    /** Starts the battle; produces the first request. */
    start() {
      this.add(`${this.sides[0].name} vs ${this.sides[1].name} — ${this.format.name}.`);
      this.emit({type: 'start', format: this.format.id, seed: this.seed});
      if (this.rules.teamPreview) {
        this.phase = 'teampreview';
        this.requests = this.sides.map(side => ({
          type: 'teampreview',
          side: side.index,
          bring: Math.min(this.rules.bringCount || side.team.length, side.team.length),
          // A request describes the side being asked, so this is that side's
          // own team: it carries full detail (moves, real item and ability,
          // Tera Type) for the lead-picker hover panel, regardless of the
          // reveal rules that gate what each side sees of the *other* team.
          team: side.team.map(p => Object.assign(this.publicSetSummary(p), {
            item: p.item, ability: p.ability,
            teraType: p.teraType, terastallized: p.terastallized,
            hp: p.currentHP, maxHP: p.maxHP, fainted: p.fainted,
            moves: (p.moves || []).map(m => ({id: m.id, pp: m.pp, maxPP: m.maxPP})),
          })),
        }));
        this.autoResolve();
        return this;
      }
      this.beginBattleProper();
      return this;
    }

    beginBattleProper() {
      for (const side of this.sides) {
        const lead = side.team[side.activeIndex];
        lead.revealed = true;
        this.add(side.index === 0 ? `Go! ${lead.name}!` : `${side.name} sent out ${lead.name}!`);
        this.emit({type: 'switch', side: side.index, uid: lead.uid, species: lead.species, skin: lead.skin || null, name: lead.name});
      }
      for (const side of this.sides) {
        const lead = side.team[side.activeIndex];
        this.applyHeldFormeChange(lead);
        this.applyEntryHazards(lead);
      }
      // Switch-in abilities resolve in Speed order.
      const order = this.sides.map(s => s.team[s.activeIndex]).sort((a, b) => this.getStat(b, 'spe') - this.getStat(a, 'spe'));
      for (const pokemon of order) {
        if (pokemon.currentHP <= 0) continue;
        this.runAbility('onStart', pokemon);
        this.runItem('onStart', pokemon);
        this.checkItemTriggers(pokemon);
        this.checkFormeTriggers(pokemon);
      }
      // Last, so a declared plan's field beats a lead's own entry weather and
      // pre-laid hazards do not hit the Pokémon already standing on them.
      this.applyFieldEffects(this.fieldEffects);
      this.beginTurn();
    }

    beginTurn() {
      if (this.ended) return;
      this.turn++;
      this.lastMoveThisTurn = null;
      this.phase = 'move';
      this.resetTurnFlags();
      this.emit({type: 'turn', turn: this.turn});
      this.requests = this.sides.map(side => this.buildMoveRequest(side));
      this.choices = [null, null];
      this.autoResolve();
    }

    resetTurnFlags() {
      // Count the turns each active Pokémon has been out and able to act.
      // Fake Out and First Impression key off this, so it must tick at the
      // start of the turn — a Pokémon sent in as a faint replacement at the
      // end of the previous turn is on its first *acting* turn now.
      for (const side of this.sides) {
        const active = side.team[side.activeIndex];
        if (active && !active.fainted) active.activeTurns = (active.activeTurns || 0) + 1;
      }
      for (const side of this.sides) {
        for (const pokemon of side.team) {
          pokemon.damageTakenThisTurn = 0;
          pokemon.lastDamageCategory = null;
          pokemon.lastDamageSourceUid = null;
          pokemon.hasActedThisTurn = false;
          pokemon.statRaisedThisTurn = false;
          pokemon.statLoweredThisTurn = false;
          pokemon.switchedInThisTurn = false;
          pokemon.hitSubstituteThisMove = false;
        }
      }
    }

    /**
     * One entry in a request's `switches` list.
     *
     * A request always describes the side being asked, so this is that side's
     * own team and the full detail is safe — the UI shows moves, held item and
     * Tera Type when the player hovers a party member. Never build this list
     * for the opposing side.
     */
    switchEntry(side) {
      return (p, i) => ({
        index: i, uid: p.uid, name: p.name, species: p.species,
        hp: p.currentHP, maxHP: p.maxHP, fainted: p.fainted, active: i === side.activeIndex,
        status: p.status, ability: p.ability, item: p.item,
        teraType: p.teraType, terastallized: p.terastallized,
        moves: (p.moves || []).map(m => ({id: m.id, pp: m.pp, maxPP: m.maxPP})),
      });
    }

    buildMoveRequest(side) {
      const active = side.team[side.activeIndex];
      const foe = this.active(1 - side.index);
      const moves = active.moves.map((slot, index) => {
        const move = Dex.move(slot.id);
        const disabled = this.moveDisabledReason(active, slot, index);
        /*
         * The power it will actually hit for *right now*.
         *
         * Several moves compute their power at use time and the packaged number
         * is simply wrong for them: Last Respects grows by 50 for every fallen
         * ally, Rage Fist by 50 for every hit taken, Fury Cutter and Rollout
         * double with each consecutive use, Stored Power and Power Trip climb
         * with boosts, Acrobatics doubles without an item. Showing the packaged
         * value left the player reading 50 BP off a Last Respects that was
         * hitting for 250.
         *
         * `preview: true` keeps this read-only (PROJECT_CONTEXT §5): the three
         * moves that *roll* for power — Magnitude, Present, Fickle Beam — report
         * their mean instead of drawing from the battle RNG here.
         */
        const livePower = foe && !foe.fainted
          ? this.dynamicBasePower(active, foe, move, {preview: true})
          : move.basePower;
        // The ability-aware display layers on top: an Aerilate holder's Tackle
        // is a Flying move hitting for 65, not a Normal 50.
        const shown = Object.assign({}, move, {basePower: livePower});
        return {
          index, id: move.id, name: move.name, category: move.category,
          type: Abilities.displayMoveType(active.ability, move),
          baseType: move.type,
          basePower: Abilities.displayBasePower(active.ability, shown),
          packagedBasePower: move.basePower,
          // True when the power shown is not the packaged one, so the UI can
          // mark it rather than silently disagreeing with the Pokédex.
          powerIsDynamic: livePower !== move.basePower,
          accuracy: move.accuracy, pp: slot.pp, maxPP: slot.maxPP,
          disabled, target: move.target,
        };
      });
      const forced = this.forcedMoveIndex(active);
      return {
        type: 'move',
        side: side.index,
        activeUid: active.uid,
        moves,
        forcedMoveIndex: forced,
        canSwitch: this.canSwitch(side.index) && !this.isTrapped(active),
        trapped: this.isTrapped(active),
        canTera: this.canTerastallize(active),
        canMega: this.canMegaEvolve(active),
        megaForme: this.canMegaEvolve(active) ? this.megaFormeFor(active).name : null,
        switches: side.team.map(this.switchEntry(side)),
      };
    }

    buildSwitchRequest(side) {
      return {
        type: 'switch',
        side: side.index,
        reason: side.switchRequest?.reason || 'faint',
        switches: side.team.map(this.switchEntry(side)),
      };
    }

    publicSetSummary(pokemon) {
      return {
        uid: pokemon.uid, species: pokemon.species, name: pokemon.name, level: pokemon.level,
        types: [...pokemon.baseTypes], gender: pokemon.gender,
        // Team Preview is exactly where a `publicItem` has to show: it is the
        // one screen where the opponent can still plan around it.
        item: (this.rules.revealItems || Items.get(pokemon.item)?.publicItem) ? pokemon.item : null,
        ability: this.rules.revealAbilities ? pokemon.ability : null, teraType: this.rules.tera ? pokemon.teraType : null,
      };
    }

    moveDisabledReason(pokemon, slot, index) {
      const move = Dex.move(slot.id);
      if (!move || move.missing) return 'Unavailable';
      if (slot.pp <= 0) return 'No PP';
      if (pokemon.volatiles.taunt && move.category === 'Status') return 'Taunted';
      if (pokemon.volatiles.disable?.moveId === move.id) return 'Disabled';
      if (pokemon.volatiles.encore && pokemon.volatiles.encore.moveId !== move.id) return 'Encore';
      if (pokemon.volatiles.torment && pokemon.lastMoveId === move.id) return 'Tormented';
      if (pokemon.volatiles.throatchop && move.flags?.sound) return 'Throat Chop';
      if (pokemon.choiceLockedMove && pokemon.choiceLockedMove !== move.id) return 'Choice-locked';
      if (this.itemOf(pokemon)?.blocksStatusMoves && move.category === 'Status') return 'Assault Vest';
      return null;
    }

    forcedMoveIndex(pokemon) {
      if (pokemon.volatiles.charging) return pokemon.volatiles.charging.index;
      if (pokemon.volatiles.lockedMove) return pokemon.volatiles.lockedMove.index;
      if (pokemon.volatiles.recharge) return pokemon.volatiles.recharge.index ?? null;
      return null;
    }

    availableMoveIndices(pokemon) {
      const forced = this.forcedMoveIndex(pokemon);
      if (forced != null && forced >= 0) return [forced];
      const legal = pokemon.moves.map((slot, i) => (this.moveDisabledReason(pokemon, slot, i) ? -1 : i)).filter(i => i >= 0);
      return legal.length ? legal : [-1];
    }

    /* ================================================================ *
     * Choices
     * ================================================================ */

    needsChoice(sideIndex) {
      return !!this.requests[sideIndex] && !this.choices[sideIndex];
    }

    /**
     * @param {number} sideIndex
     * @param {object} choice `{type:'move', index, tera}` | `{type:'switch', index}` |
     *                        `{type:'team', order}` | `{type:'forfeit'}`
     */
    choose(sideIndex, choice) {
      if (this.ended) return {ok: false, error: 'The battle is already over.'};
      const request = this.requests[sideIndex];
      if (!request) return {ok: false, error: 'No choice is required right now.'};
      const validation = this.validateChoice(sideIndex, request, choice);
      if (!validation.ok) return validation;
      this.choices[sideIndex] = validation.choice;
      this.commands.push({turn: this.turn, phase: request.type, side: sideIndex, choice: validation.choice});
      // Forfeiting does not wait for the opponent's command.
      if (validation.choice.type === 'forfeit') {
        this.add(`${this.sides[sideIndex].name} forfeited.`);
        this.finish(1 - sideIndex, 'forfeit');
        return {ok: true};
      }
      this.autoResolve();
      return {ok: true};
    }

    validateChoice(sideIndex, request, choice) {
      const side = this.sides[sideIndex];
      if (!choice || typeof choice !== 'object') return {ok: false, error: 'Malformed choice.'};
      if (choice.type === 'forfeit') return {ok: true, choice: {type: 'forfeit'}};

      if (request.type === 'teampreview') {
        const size = side.team.length;
        let order = Array.isArray(choice.order) ? choice.order.map(Number).filter(n => Number.isInteger(n) && n >= 0 && n < size) : [];
        order = [...new Set(order)];
        for (let i = 0; i < size; i++) if (!order.includes(i)) order.push(i);
        return {ok: true, choice: {type: 'team', order}};
      }

      if (request.type === 'switch') {
        const index = Number(choice.index);
        if (!Number.isInteger(index) || !side.team[index]) return {ok: false, error: 'That Pokémon is not on the team.'};
        if (side.team[index].fainted) return {ok: false, error: 'That Pokémon has fainted.'};
        if (index === side.activeIndex && !side.team[index].fainted) return {ok: false, error: 'That Pokémon is already active.'};
        return {ok: true, choice: {type: 'switch', index}};
      }

      if (choice.type === 'switch') {
        if (!request.canSwitch) return {ok: false, error: request.trapped ? 'Your Pokémon is trapped and cannot switch.' : 'There is nobody to switch to.'};
        const index = Number(choice.index);
        if (!Number.isInteger(index) || !side.team[index] || side.team[index].fainted || index === side.activeIndex) {
          return {ok: false, error: 'Invalid switch target.'};
        }
        return {ok: true, choice: {type: 'switch', index}};
      }

      const active = side.team[side.activeIndex];
      let index = Number(choice.index);
      const legal = this.availableMoveIndices(active);
      if (!legal.includes(index)) {
        // Only a genuinely forced move (charging, locked, or Struggle) is
        // substituted; a disabled or Choice-locked pick is rejected outright.
        const forced = this.forcedMoveIndex(active);
        if (forced != null && forced >= 0) index = forced;
        else if (legal.length === 1 && legal[0] === -1) index = -1;
        else {
          const reason = active.moves[index] ? this.moveDisabledReason(active, active.moves[index], index) : null;
          return {ok: false, error: reason ? `That move cannot be selected (${reason}).` : 'That move cannot be selected.'};
        }
      }
      const tera = !!choice.tera && this.canTerastallize(active);
      const mega = !!choice.mega && this.canMegaEvolve(active);
      return {ok: true, choice: {type: 'move', index, tera, mega}};
    }

    /** Fills in AI / scripted choices, then resolves when every side has one. */
    autoResolve() {
      if (this.ended) return;
      let guard = 0;
      while (guard++ < 8) {
        for (const side of this.sides) {
          if (!this.needsChoice(side.index)) continue;
          const scripted = this.nextScriptedChoice(side.index);
          if (scripted) {
            this.choices[side.index] = scripted;
            this.commands.push({turn: this.turn, phase: this.requests[side.index].type, side: side.index, choice: scripted});
            continue;
          }
          if (side.controller === 'ai') {
            const choice = RedGPT.AI.chooseAction(this, side.index, this.requests[side.index]);
            const validated = this.validateChoice(side.index, this.requests[side.index], choice);
            const final = validated.ok ? validated.choice : this.fallbackChoice(side.index, this.requests[side.index]);
            this.choices[side.index] = final;
            this.commands.push({turn: this.turn, phase: this.requests[side.index].type, side: side.index, choice: final});
          }
        }
        if (this.sides.some(side => this.needsChoice(side.index))) return;
        this.resolveChoices();
        if (this.ended) return;
        if (!this.sides.some(side => this.needsChoice(side.index))) return;
      }
    }

    nextScriptedChoice(sideIndex) {
      const queue = this.scriptQueues?.[sideIndex];
      if (!queue) return null;
      if (!queue.length) return this.fallbackChoice(sideIndex, this.requests[sideIndex]);
      return queue.shift();
    }

    fallbackChoice(sideIndex, request) {
      const side = this.sides[sideIndex];
      if (request.type === 'teampreview') return {type: 'team', order: side.team.map((_, i) => i)};
      if (request.type === 'switch') {
        const index = side.team.findIndex((p, i) => !p.fainted && i !== side.activeIndex);
        return {type: 'switch', index: index >= 0 ? index : 0};
      }
      return {type: 'move', index: this.availableMoveIndices(side.team[side.activeIndex])[0], tera: false, mega: false};
    }

    resolveChoices() {
      const phase = this.phase;
      const choices = this.choices;
      this.requests = [null, null];
      this.choices = [null, null];

      const forfeit = choices.findIndex(c => c?.type === 'forfeit');
      if (forfeit >= 0) {
        this.add(`${this.sides[forfeit].name} forfeited.`);
        this.finish(1 - forfeit, 'forfeit');
        return;
      }

      if (phase === 'teampreview') {
        for (const side of this.sides) {
          const order = choices[side.index].order;
          side.team = order.map(i => side.team[i]);
          side.team.forEach((p, i) => { p.position = i; });
          const bring = Math.min(this.rules.bringCount || side.team.length, side.team.length);
          if (bring < side.team.length) side.team = side.team.slice(0, bring);
          side.activeIndex = 0;
        }
        this.phase = 'move';
        this.beginBattleProper();
        return;
      }

      if (phase === 'switch') {
        for (const side of this.sides) {
          const choice = choices[side.index];
          if (!choice) continue;
          const request = side.switchRequest;
          side.switchRequest = null;
          this.switchIn(side.index, choice.index, {
            passBoosts: !!request?.passBoosts,
            passVolatiles: !!request?.passVolatiles,
            passSubstitute: !!request?.passSubstitute,
          });
        }
        this.afterSwitchPhase();
        return;
      }

      this.runTurn(choices);
    }

    afterSwitchPhase() {
      if (this.checkWin()) return;
      if (this.resumeAfterSwitch) {
        this.resumeAfterSwitch = false;
        this.continueTurn();
        return;
      }
      this.beginTurn();
    }

    /* ================================================================ *
     * Turn resolution
     * ================================================================ */

    runTurn(choices) {
      // Mega Evolution resolves before anything else in the turn, so the Mega
      // forme's Speed is what orders the actions below.
      for (const side of this.sides) {
        const choice = choices[side.index];
        if (!choice || choice.type !== 'move' || !choice.mega) continue;
        const active = side.team[side.activeIndex];
        if (active && !active.fainted) this.megaEvolve(active);
      }

      const actions = [];
      for (const side of this.sides) {
        const choice = choices[side.index];
        const active = side.team[side.activeIndex];
        if (!choice) continue;
        if (choice.type === 'switch') {
          actions.push({kind: 'switch', side: side.index, index: choice.index, actorUid: active.uid, priority: 7, fractional: 0, speed: this.getStat(active, 'spe')});
        } else {
          const move = this.moveForIndex(active, choice.index);
          let priority = move.priority || 0;
          // Project decision: Grassy Glide keeps +1 priority unconditionally,
          // with no Grassy Terrain requirement — the same treatment given to
          // Sucker Punch, Thunderclap, First Impression and Upper Hand.
          if (move.id === 'grassyglide') priority++;
          priority = this.modifyValue('onModifyPriority', active, priority, move);
          const fractional = (this.abilityOf(active)?.onFractionalPriority?.(this, active, move) || 0) +
            (this.itemOf(active)?.onFractionalPriority?.(this, active, move) || 0);
          actions.push({
            kind: 'move', side: side.index, index: choice.index, tera: choice.tera,
            actorUid: active.uid, move, priority, fractional, speed: this.getStat(active, 'spe'),
          });
        }
      }
      const reverse = this.field.pseudoWeather.trickroom > 0;
      actions.sort((a, b) =>
        b.priority - a.priority ||
        b.fractional - a.fractional ||
        (reverse ? a.speed - b.speed : b.speed - a.speed) ||
        (this.rng.chance(0.5) ? -1 : 1));

      /*
       * Terastallization resolves before **any** move this turn, not when its
       * own Pokémon gets round to acting.
       *
       * It used to be applied inline in `continueTurn`, immediately before the
       * actor's move, which meant a slower Pokémon Terastallized *after* being
       * hit. Reported from a real log: an Arceus Tera'd to Ground, hit Kyogre
       * with Earthquake, and only then did Kyogre Tera to Grass — so it took the
       * Earthquake on its old typing instead of the resistant one it had paid
       * for. That is the wrong answer: this is a pre-turn action in the games,
       * exactly like Mega Evolution.
       *
       * Applied here, after the sort, so the log reads in Speed order the way
       * the games do, and the flag is cleared so `continueTurn` cannot apply it
       * a second time. It stays a **separate pass from Mega Evolution** (§5),
       * because Mega has to land before the actions are *ordered* — its forme's
       * Speed decides the turn — while Tera changes only typing and so can wait
       * until the order is known.
       */
      for (const action of actions) {
        if (action.kind !== 'move' || !action.tera) continue;
        const side = this.sides[action.side];
        const actor = side.team[side.activeIndex];
        if (actor && !actor.fainted && actor.uid === action.actorUid) this.terastallize(actor);
        action.tera = false;
      }

      this.actionQueue = actions;
      this.actionIndex = 0;
      this.turnActions = Object.fromEntries(actions.map(a => [a.side, a]));
      this.continueTurn();
    }

    continueTurn() {
      while (this.actionIndex < this.actionQueue.length) {
        if (this.ended) return;
        const action = this.actionQueue[this.actionIndex];
        this.actionIndex++;
        const side = this.sides[action.side];
        const actor = side.team[side.activeIndex];
        if (!actor || actor.fainted || actor.uid !== action.actorUid) continue;

        if (action.kind === 'switch') {
          const old = actor.name;
          this.switchIn(action.side, action.index, {text: action.side === 0 ? `${old}, come back! Go, ${side.team[action.index].name}!` : `${side.name} withdrew ${old} and sent out ${side.team[action.index].name}!`});
        } else {
          // Tera is not applied here: it resolves for every side before any move
          // runs, in `runTurn`, which is why `action.tera` is already cleared by
          // the time this loop sees it.
          this.performMove(actor, action);
          actor.hasActedThisTurn = true;
        }

        this.checkFaints();
        if (this.ended) return;
        if (this.pendingImmediateSwitch()) {
          this.issueSwitchRequests({resume: true});
          return;
        }
      }
      this.endOfTurn();
    }

    pendingImmediateSwitch() {
      return this.sides.some(side => side.switchRequest && this.canSwitch(side.index));
    }

    issueSwitchRequests({resume = false} = {}) {
      this.phase = 'switch';
      this.resumeAfterSwitch = resume;
      this.requests = this.sides.map(side => {
        const needsReplacement = side.team[side.activeIndex].fainted;
        if (!side.switchRequest && !needsReplacement) return null;
        if (!this.canSwitch(side.index)) { side.switchRequest = null; return null; }
        if (needsReplacement) side.switchRequest = side.switchRequest || {reason: 'faint'};
        return this.buildSwitchRequest(side);
      });
      this.choices = [null, null];
      if (this.requests.every(r => !r)) {
        this.phase = 'move';
        if (resume) { this.resumeAfterSwitch = false; this.continueTurn(); }
        else this.beginTurn();
        return;
      }
      this.autoResolve();
    }

    moveForIndex(pokemon, index) {
      if (index < 0) return Dex.move('struggle');
      const slot = pokemon.moves[index];
      return slot ? Dex.move(slot.id) : Dex.move('struggle');
    }

    performMove(pokemon, action) {
      const target = this.foeActive(pokemon);
      const move = action.move || this.moveForIndex(pokemon, action.index);
      const slot = action.index >= 0 ? pokemon.moves[action.index] : null;
      const fromCharge = pokemon.volatiles.charging?.moveId === move.id;
      const fromLocked = pokemon.volatiles.lockedMove?.moveId === move.id;
      const skipPP = fromCharge || fromLocked || action.index < 0;

      if (!skipPP && slot) {
        if (slot.pp <= 0) {
          this.add(`${this.label(pokemon)} has no PP left for ${move.name}!`);
          return false;
        }
        slot.pp--;
        const foe = this.foeActive(pokemon);
        if (foe && !foe.fainted && this.abilityOf(foe)?.extraPP && move.target !== 'self' && slot.pp > 0) slot.pp--;
      }
      return this.executeMove(pokemon, target, move, {index: action.index, fromCharge, fromLocked, slot});
    }

    /** Used by Magic Bounce and similar reflectors. */
    useMoveDirect(source, target, move, context = {}) {
      return this.executeMove(source, target, move, {index: -2, skipCanAct: true, ...context});
    }

    /* ================================================================ *
     * Move execution
     * ================================================================ */

    executeMove(attacker, defender, baseMove, context = {}) {
      if (!attacker || attacker.fainted) return false;
      const move = Object.assign({}, baseMove, {userRef: attacker});
      /*
       * Resolve a use-time category onto the per-use copy, before anything reads
       * it. Doing it here rather than at the damage step is what makes it
       * consistent: the attacking stat, Reflect versus Light Screen, Assault
       * Vest and every `move.category` branch downstream all see one answer.
       */
      move.category = this.moveCategory(attacker, move);
      /*
       * Remember what is being used, and by whom, for the duration of this move.
       *
       * `setStatus` and `boost` need to know whether the effect they are about
       * to apply is *this move landing on its target*, because a Substitute
       * blocks that and blocks almost nothing else. Threading a `move` argument
       * through every call site would have meant editing dozens of them and
       * silently missing some — the guard would then exist and never fire, which
       * is this project's most common class of bug.
       *
       * Saved and restored rather than assigned, because moves nest: Metronome,
       * Copycat, Sleep Talk and the called-move path all re-enter here.
       */
      const previousMove = this.activeMove;
      const previousUser = this.activeMoveUser;
      this.activeMove = move;
      this.activeMoveUser = attacker;
      try {
        return this.executeMoveInner(attacker, defender, move, context);
      } finally {
        this.activeMove = previousMove;
        this.activeMoveUser = previousUser;
      }
    }

    /**
     * Would a Substitute soak this effect?
     *
     * True only for "the move currently being used is applying this to somebody
     * else, and that somebody is behind a Substitute". Everything else is left
     * alone, and each exclusion is a real case:
     *
     *   no active move      residual damage, Toxic Orb, entry hazards
     *   source === target   Rest, Belly Drum, a Swords Dance behind your own sub
     *   source is not the
     *   move's user         Static or Flame Body punishing the attacker — those
     *                       are ability effects, not a move aimed at the holder,
     *                       and the attacker's own Substitute does not stop them
     *   sound / Infiltrator the two things that go through a Substitute
     *
     * `hitSubstituteThisMove` covers the case where this very hit *broke* the
     * doll: the sub is already gone from `volatiles` by the time a secondary
     * effect is applied, but it still took the hit, so the secondary must not
     * land either.
     */
    blockedBySubstitute(target, source) {
      const move = this.activeMove;
      if (!move || !target || !source || source === target) return false;
      if (source !== this.activeMoveUser) return false;
      if (target === this.activeMoveUser) return false;
      if (!(target.volatiles.substituteHP > 0) && !target.hitSubstituteThisMove) return false;
      if (move.flags?.sound || move.infiltrates) return false;
      return true;
    }

    executeMoveInner(attacker, defender, move, context = {}) {
      const index = context.index ?? -1;
      const fromCharge = !!context.fromCharge;
      const fromLocked = !!context.fromLocked;

      if (!context.skipCanAct && !this.canAct(attacker, move)) {
        this.recordMoveAttempt(attacker, move, false);
        return false;
      }
      attacker.currentMove = move;

      // Ability / item move modification.
      const abilityBefore = this.abilityOf(attacker);
      if (abilityBefore && typeof abilityBefore.onBeforeMove === 'function') {
        if (abilityBefore.onBeforeMove(this, attacker, move, defender) === false) {
          this.recordMoveAttempt(attacker, move, false);
          return false;
        }
      }
      if (this.abilityOf(attacker)?.infiltrates) move.infiltrates = true;
      this.runAbility('onModifyMove', attacker, move, defender);
      this.runItem('onModifyMove', attacker, move, defender);
      if (this.abilityOf(attacker)?.blockSecondary || this.itemOf(attacker)?.blockSecondary) { /* attacker-side no-op */ }

      if (!move.stallingMove && !['protect', 'detect', 'endure', 'kingsshield', 'obstruct', 'silktrap', 'burningbulwark', 'spikyshield', 'banefulbunker'].includes(move.id)) {
        attacker.volatiles.stallCounter = 0;
      }

      this.add(`${this.label(attacker)} used ${move.name}!`);
      this.emit({type: 'move', source: attacker.uid, move: move.id, name: move.name, target: defender?.uid || null});

      // Choice lock.
      if (this.itemOf(attacker)?.choiceLock && index >= 0) attacker.choiceLockedMove = move.id;
      if (Dex.toID(attacker.ability) === 'gorillatactics' && index >= 0) attacker.choiceLockedMove = move.id;

      let success = false;

      /* --- moves that call other moves --- */
      if (['sleeptalk', 'metronome', 'copycat', 'assist', 'mirrormove'].includes(move.id)) {
        const called = this.resolveCalledMove(attacker, defender, move);
        if (!called || (context.depth || 0) > 3) {
          this.add('But it failed!');
          this.recordMoveAttempt(attacker, move, false);
          return false;
        }
        this.add(`${move.name} called ${called.name}!`);
        success = this.executeMove(attacker, defender, called, {index: -2, skipCanAct: true, depth: (context.depth || 0) + 1});
        this.recordMoveAttempt(attacker, move, success);
        return success;
      }

      /* --- charge turn --- */
      const solarSkip = this.weatherFor(attacker) === 'sun' && ['solarbeam', 'solarblade'].includes(move.id);
      const electroSkip = this.weatherFor(attacker) === 'rain' && move.id === 'electroshot';
      if (CHARGE_MOVES.has(move.id) && !fromCharge && !solarSkip && !electroSkip) {
        if (this.itemOf(attacker)?.skipCharge) {
          this.consumeItem(attacker, `${this.label(attacker)} became fully charged with its Power Herb!`);
        } else {
          attacker.volatiles.charging = {moveId: move.id, index};
          const text = {
            bounce: 'sprang up', dig: 'burrowed underground', dive: 'hid underwater', fly: 'flew up high',
            meteorbeam: 'is overflowing with space power', phantomforce: 'vanished instantly',
            skyattack: 'became cloaked in a harsh light', solarbeam: 'absorbed light', solarblade: 'absorbed light',
            electroshot: 'absorbed electricity', freezeshock: 'became cloaked in a freezing light',
            iceburn: 'became cloaked in freezing air', razorwind: 'whipped up a whirlwind',
            shadowforce: 'vanished instantly', skydrop: 'took its target into the sky', geomancy: 'is absorbing power',
          }[move.id] || 'began charging';
          this.add(`${this.label(attacker)} ${text}!`);
          if (move.id === 'meteorbeam' || move.id === 'electroshot') this.boost(attacker, {spa: 1}, attacker);
          if (move.id === 'skyattack') { /* no boost */ }
          this.recordMoveAttempt(attacker, move, true);
          return true;
        }
      }
      if (fromCharge) delete attacker.volatiles.charging;

      if (!defender || defender.fainted) {
        if (move.target !== 'self' && !move.sideCondition && !move.weather && !move.terrain && !move.pseudoWeather) {
          this.add('But there was no target!');
          this.recordMoveAttempt(attacker, move, false);
          return false;
        }
      }

      /* --- protection, immunities, accuracy --- */
      if (defender && !defender.fainted) {
        const semi = this.semiInvulnerable(defender, move);
        if (!semi.canHit) {
          this.add(`${this.label(attacker)}'s attack missed!`);
          this.onMoveMiss(attacker, move);
          this.recordMoveAttempt(attacker, move, false);
          this.finishLockedMove(attacker, move, false, fromLocked);
          return false;
        }
        context.semiMultiplier = semi.multiplier;

        const targetSide = this.sides[defender.side];
        const priority = move.priority || 0;
        if (priority > 0 && targetSide.conditions.quickguard > 0) {
          this.add('Quick Guard protected the team!');
          this.recordMoveAttempt(attacker, move, false);
          return false;
        }
        // Crafty Shield turns away status moves; Mat Block turns away attacks.
        if (move.category === 'Status' && move.target !== 'self' && targetSide.conditions.craftyshield > 0) {
          this.add('Crafty Shield protected the team!');
          this.recordMoveAttempt(attacker, move, false);
          return false;
        }
        if (move.category !== 'Status' && targetSide.conditions.matblock > 0) {
          this.add('The kicked-up mat blocked the attack!');
          this.recordMoveAttempt(attacker, move, false);
          return false;
        }
        if (priority > 0 && this.defenderAbility(defender, attacker)?.blocksPriority && move.target !== 'self') {
          this.add(`${this.label(defender)} is protected by its Ability!`);
          this.recordMoveAttempt(attacker, move, false);
          return false;
        }
        if (this.isGrounded(defender) && this.field.terrain === 'psychic' && priority > 0 && move.target !== 'self') {
          this.add(`${this.label(defender)} is protected by the Psychic Terrain!`);
          this.recordMoveAttempt(attacker, move, false);
          return false;
        }
        if (defender.protectedThisTurn && move.flags?.protect && move.target !== 'self') {
          if (move.breaksProtect) {
            defender.protectedThisTurn = false;
            /*
             * Recorded on the move, not on the attacker, because Piercing Drill
             * charges a quarter-damage price *only* for a hit that actually had
             * to break through. The move object is the per-use copy, so the
             * flag dies with this execution and the same move against a target
             * that did not Protect is completely ordinary.
             */
            move.brokeProtect = true;
            this.add(`${this.label(defender)}'s protection was shattered!`);
          } else {
            this.add(`${this.label(defender)} protected itself!`);
            if (defender.volatiles.protectEffect) this.applyProtectPunish(attacker, defender);
            if (CRASH_MOVES.has(move.id) || move.hasCrashDamage) this.crashDamage(attacker);
            this.recordMoveAttempt(attacker, move, false);
            this.finishLockedMove(attacker, move, false, fromLocked);
            return false;
          }
        }
        /*
         * Primal weather refuses the opposing element outright. This is the
         * effect that separates Primal Kyogre and Primal Groudon from an
         * ordinary Drizzle or Drought — without it they are only rain and sun
         * with a different log line, which is what they were until 2026-08-14.
         *
         * Damaging moves only: a Will-O-Wisp still works under heavy rain, as
         * in the games. The type is read through `moveType`, not off the
         * packaged data, so a Judgment holding a Flame Plate or an -ate'd move
         * is refused on the type it will actually hit as.
         */
        if (this.field.weatherPrimal && move.category !== 'Status') {
          const type = this.moveType(attacker, defender, move);
          const blocked = this.field.weatherPrimal === 'primordialsea' ? 'Fire' : 'Water';
          if (type === blocked) {
            this.add(this.field.weatherPrimal === 'primordialsea'
              ? 'The Fire-type attack fizzled out in the heavy rain!'
              : 'The Water-type attack evaporated in the extremely harsh sunlight!');
            this.recordMoveAttempt(attacker, move, false);
            return false;
          }
        }
        if (move.flags?.powder && (defender.types.includes('Grass') || this.defenderAbility(defender, attacker)?.name === 'Overcoat')) {
          this.add(`It doesn't affect ${this.label(defender)}...`);
          this.recordMoveAttempt(attacker, move, false);
          return false;
        }
        if (move.category === 'Status' && move.target !== 'self' && !move.ignoreImmunity) {
          if (this.effectiveness(move.type, defender, move) === 0) {
            this.add(`It doesn't affect ${this.label(defender)}...`);
            this.recordMoveAttempt(attacker, move, false);
            return false;
          }
        }
        // Dark types ignore Prankster-boosted status moves from an opponent.
        // Self-targeting moves are unaffected even though `defender` is the foe.
        if (move.category === 'Status' && move.target !== 'self' && defender.side !== attacker.side &&
            defender.types.includes('Dark') && this.abilityOf(attacker)?.prankster) {
          this.add(`It doesn't affect ${this.label(defender)}...`);
          this.recordMoveAttempt(attacker, move, false);
          return false;
        }
        // Defensive ability interception (Levitate, Flash Fire, Magic Bounce, ...).
        // Only for moves actually aimed this way: the user's own Swords Dance,
        // Reflect or Trick Room must not be offered to the foe's guards.
        const incoming = this.aimedAtFoe(move) && defender !== attacker;
        const guard = this.defenderAbility(defender, attacker);
        if (guard && typeof guard.onTryHit === 'function' && incoming) {
          const result = guard.onTryHit(this, defender, attacker, move);
          if (result === 'immune' || result === 'absorb') {
            if (result === 'immune') this.add(`It doesn't affect ${this.label(defender)}...`);
            this.recordMoveAttempt(attacker, move, false);
            return false;
          }
        }
        const guardItem = this.itemOf(defender);
        if (guardItem && typeof guardItem.onTryHit === 'function' && incoming) {
          if (guardItem.onTryHit(this, defender, attacker, move) === 'immune') {
            this.add(`It doesn't affect ${this.label(defender)}...`);
            this.recordMoveAttempt(attacker, move, false);
            return false;
          }
        }

        const accuracy = move.id === 'tripleaxel' || move.id === 'triplekick' ? null : this.moveAccuracy(attacker, defender, move);
        if (accuracy != null && this.rng.next() * 100 >= accuracy) {
          this.add(`${this.label(attacker)}'s attack missed!`);
          this.onMoveMiss(attacker, move);
          if (CRASH_MOVES.has(move.id) || move.hasCrashDamage) this.crashDamage(attacker);
          this.recordMoveAttempt(attacker, move, false);
          this.finishLockedMove(attacker, move, false, fromLocked);
          return false;
        }
      }

      if (this.moveSpecialFailure(attacker, defender, move, context)) {
        this.add('But it failed!');
        this.recordMoveAttempt(attacker, move, false);
        this.finishLockedMove(attacker, move, false, fromLocked);
        return false;
      }

      if (move.id === 'futuresight' && !context.futureHit) {
        const targetSide = this.sides[defender.side];
        if (targetSide.conditions.futureSight) {
          this.add('But it failed!');
          this.recordMoveAttempt(attacker, move, false);
          return false;
        }
        targetSide.conditions.futureSight = {turns: 2, attackerUid: attacker.uid, side: attacker.side, moveId: move.id, level: attacker.level, spa: this.getStat(attacker, 'spa')};
        this.add(`${this.label(attacker)} foresaw an attack!`);
        this.recordMoveAttempt(attacker, move, true);
        return true;
      }

      if (move.category === 'Status') {
        success = this.applyStatusMove(attacker, defender, move, context);
      } else {
        success = this.applyDamagingMove(attacker, defender, move, context);
        if (success === 'noeffect') {
          this.recordMoveAttempt(attacker, move, false);
          this.finishLockedMove(attacker, move, false, fromLocked);
          return false;
        }
      }

      if (success && move.id === 'roost') attacker.volatiles.roost = true;
      if (success) this.applyMoveFormeChange(attacker, move);
      this.finishLockedMove(attacker, move, !!success, fromLocked);
      this.recordMoveAttempt(attacker, move, !!success);

      this.runAbility('onAfterMove', attacker, defender, move, success);
      this.runItem('onAfterMove', attacker, defender, move, success);
      attacker.currentMove = null;
      this.checkItemTriggers(attacker);
      this.checkFormeTriggers(attacker);
      if (defender && !defender.fainted) this.checkItemTriggers(defender);
      if (defender && !defender.fainted) this.checkFormeTriggers(defender);
      return !!success;
    }

    onMoveMiss(attacker, move) {
      this.runItem('onMoveMiss', attacker, move);
    }

    applyProtectPunish(attacker, defender) {
      const effect = defender.volatiles.protectEffect;
      if (!effect) return;
      if (effect === 'kingsshield' || effect === 'silktrap') this.boost(attacker, effect === 'kingsshield' ? {atk: -2} : {spe: -1}, defender);
      if (effect === 'banefulbunker') this.setStatus(attacker, 'psn', defender);
      if (effect === 'burningbulwark') this.setStatus(attacker, 'brn', defender);
      if (effect === 'spikyshield') this.damage(attacker, Math.max(1, Math.floor(attacker.maxHP / 8)), {indirect: true, text: `${this.label(attacker)} was hurt!`});
      if (effect === 'obstruct') this.boost(attacker, {def: -2}, defender);
    }

    resolveCalledMove(attacker, defender, move) {
      if (move.id === 'sleeptalk') {
        if (attacker.status !== 'slp') return null;
        const pool = attacker.moves.map(m => Dex.move(m.id)).filter(m => m && m.id !== 'sleeptalk' && !m.callsMove && !CHARGE_MOVES.has(m.id));
        return pool.length ? this.rng.pick(pool) : null;
      }
      if (move.id === 'metronome') return this.randomCallableMove();
      if (move.id === 'mirrormove' || move.id === 'copycat') {
        const last = move.id === 'mirrormove' ? defender?.lastMoveId : this.lastMoveId;
        const called = last ? Dex.move(last) : null;
        return called && !called.callsMove && !called.missing ? called : null;
      }
      if (move.id === 'assist') {
        const side = this.sideOf(attacker);
        const pool = side.team.filter(p => p !== attacker).flatMap(p => p.moves.map(m => Dex.move(m.id))).filter(m => m && !m.callsMove);
        return pool.length ? this.rng.pick(pool) : null;
      }
      return null;
    }

    randomCallableMove() {
      const banned = new Set(['metronome', 'copycat', 'sleeptalk', 'mimic', 'struggle', 'assist', 'mirrormove', 'chatter', 'transform']);
      const pool = Object.values(Dex.allMoves).filter(m => !banned.has(m.id) && !m.callsMove && !m.isNonstandard);
      return this.rng.pick(pool);
    }

    canAct(pokemon, move) {
      if (pokemon.volatiles.recharge) {
        delete pokemon.volatiles.recharge;
        this.add(`${this.label(pokemon)} must recharge!`);
        return false;
      }
      if (pokemon.volatiles.flinch) {
        delete pokemon.volatiles.flinch;
        this.add(`${this.label(pokemon)} flinched and couldn't move!`);
        this.runAbility('onFlinch', pokemon);
        return false;
      }
      if (pokemon.status === 'slp') {
        if (pokemon.statusData.sleepTurns <= 0) {
          this.cureStatus(pokemon, `${this.label(pokemon)} woke up!`);
        } else {
          // Early Bird burns through sleep at double speed.
          pokemon.statusData.sleepTurns -= this.abilityOf(pokemon)?.fastWake ? 2 : 1;
          if (pokemon.statusData.sleepTurns < 0) pokemon.statusData.sleepTurns = 0;
          if (!move?.sleepUsable) {
            this.add(`${this.label(pokemon)} is fast asleep.`);
            return false;
          }
        }
      }
      if (pokemon.status === 'frz') {
        if (move?.flags?.defrost || this.rng.chance(0.2)) {
          this.cureStatus(pokemon, `${this.label(pokemon)} thawed out!`);
        } else {
          this.add(`${this.label(pokemon)} is frozen solid!`);
          return false;
        }
      }
      // Magic Guard's restored legacy protection: never fully paralysed. The
      // Speed drop from paralysis is unaffected, here and everywhere else.
      if (pokemon.status === 'par' && !this.abilityOf(pokemon)?.ignoreFullParalysis && this.rng.chance(0.25)) {
        this.add(`${this.label(pokemon)} is paralyzed! It can't move!`);
        return false;
      }
      if (pokemon.volatiles.attract && this.rng.chance(0.5)) {
        this.add(`${this.label(pokemon)} is immobilized by love!`);
        return false;
      }
      if (pokemon.volatiles.confusion) {
        pokemon.volatiles.confusion--;
        if (pokemon.volatiles.confusion <= 0) {
          delete pokemon.volatiles.confusion;
          this.add(`${this.label(pokemon)} snapped out of its confusion!`);
        } else {
          this.add(`${this.label(pokemon)} is confused!`);
          if (this.rng.ratio(1, 3)) {
            const atk = this.getStat(pokemon, 'atk');
            const def = this.getStat(pokemon, 'def');
            const damage = Math.max(1, Math.floor((((2 * pokemon.level / 5 + 2) * 40 * atk / Math.max(1, def)) / 50 + 2) * (0.85 + this.rng.next() * 0.15)));
            this.damage(pokemon, damage, {indirect: true, text: `${this.label(pokemon)} hurt itself in its confusion!`});
            return false;
          }
        }
      }
      return true;
    }

    recordMoveAttempt(pokemon, move, success) {
      pokemon.lastMoveId = move.id;
      pokemon.lastMoveFailed = !success;
      if (!pokemon.usedMoveIds.includes(move.id)) pokemon.usedMoveIds.push(move.id);
      this.lastMoveId = move.id;
      this.lastMoveThisTurn = move.id;
      if (move.id === 'echoedvoice' && success) pokemon.volatiles.echoedVoice = Math.min(5, (pokemon.volatiles.echoedVoice || 0) + 1);
      else if (move.id !== 'echoedvoice') pokemon.volatiles.echoedVoice = 0;
    }

    finishLockedMove(pokemon, move, success, fromLocked) {
      if (move.id === 'furycutter') pokemon.volatiles.furyCutter = success ? Math.min(2, (pokemon.volatiles.furyCutter || 0) + 1) : 0;
      else if (pokemon.lastMoveId !== 'furycutter') pokemon.volatiles.furyCutter = 0;

      if (!success) {
        /*
         * **A locked move that fails releases the lock.** Only Rollout and Ice
         * Ball did, so a rampage that could never work locked its user in
         * forever: reported from a real battle where a Dragonite threw Outrage
         * into a Weezing-Galar for six consecutive turns — Fairy is immune to
         * Dragon, so every hit failed, `remaining` never decremented, and the
         * lock only ended when Dragonite fainted.
         *
         * The five callers that pass `success = false` are all genuine move
         * failures: a miss, a semi-invulnerable target, Protect, a
         * `moveSpecialFailure`, and type immunity. Every one of them ends a
         * rampage in the games. Being unable to *act* — sleep, full paralysis,
         * flinch — never reaches `executeMove` at all, so those still pause the
         * lock rather than breaking it, which is also correct.
         *
         * No confusion on this path: a rampage broken by failure does not
         * fatigue its user, only one that runs its full course does.
         */
        delete pokemon.volatiles.lockedMove;
        delete pokemon.volatiles.uproar;
        pokemon.volatiles.rolloutStage = 0;
        return;
      }
      const index = pokemon.moves.findIndex(m => m.id === move.id);
      /*
       * The lock can be **gone** by the time the move finishes, and then there
       * is nothing to decrement. Anything that switches the user out during its
       * own move runs `clearOnSwitch`, which wipes every volatile including this
       * one — a Red Card on the target is the reachable case.
       *
       * Found by a Rebirth balance probe crashing on seed 2377, and the shape is
       * why it survived: the Red Card holder has to arrive *after* the rampage
       * has started. A Tauros locked into Outrage knocked out a Nidoking (no
       * card, the holder was gone), the replacement Shuckle came in holding one,
       * the next Outrage triggered it, and `finishLockedMove` then decremented a
       * lock that `clearOnSwitch` had already deleted. A Red Card held by the
       * *first* target fires on the turn the lock is created, when `fromLocked`
       * is still false, so the obvious two-Pokémon reproduction misses it.
       *
       * Returning is the whole fix: being dragged off the field ends a rampage,
       * and it ends it without fatigue confusion — the same rule the failure
       * path above already applies.
       */
      if (fromLocked && !pokemon.volatiles.lockedMove) return;
      if (LOCKED_MOVES.has(move.id)) {
        if (fromLocked) pokemon.volatiles.lockedMove.remaining--;
        else pokemon.volatiles.lockedMove = {moveId: move.id, index, remaining: this.rng.int(1, 2), confuseAfter: true};
      } else if (move.id === 'rollout' || move.id === 'iceball') {
        if (fromLocked) {
          pokemon.volatiles.lockedMove.remaining--;
          pokemon.volatiles.rolloutStage = Math.min(4, (pokemon.volatiles.rolloutStage || 0) + 1);
        } else {
          pokemon.volatiles.rolloutStage = 1;
          pokemon.volatiles.lockedMove = {moveId: move.id, index, remaining: 4};
        }
      } else if (move.id === 'uproar') {
        if (fromLocked) pokemon.volatiles.lockedMove.remaining--;
        else {
          pokemon.volatiles.uproar = true;
          pokemon.volatiles.lockedMove = {moveId: move.id, index, remaining: 2};
        }
      }
      const lock = pokemon.volatiles.lockedMove;
      if (lock && lock.remaining <= 0) {
        const confuse = lock.confuseAfter;
        delete pokemon.volatiles.lockedMove;
        delete pokemon.volatiles.uproar;
        pokemon.volatiles.rolloutStage = 0;
        if (confuse && pokemon.currentHP > 0) {
          this.add(`${this.label(pokemon)} became confused due to fatigue!`);
          this.addVolatile(pokemon, 'confusion', pokemon);
        }
      }
    }

    crashDamage(pokemon) {
      this.damage(pokemon, Math.max(1, Math.floor(pokemon.maxHP / 2)), {indirect: true, text: `${this.label(pokemon)} kept going and crashed!`});
    }

    semiInvulnerable(defender, move) {
      const charging = defender.volatiles.charging?.moveId;
      if (!charging) return {canHit: true, multiplier: 1};
      if (charging === 'dig' && ['earthquake', 'fissure', 'magnitude'].includes(move.id)) return {canHit: true, multiplier: move.id === 'earthquake' ? 2 : 1};
      if (charging === 'dive' && ['surf', 'whirlpool'].includes(move.id)) return {canHit: true, multiplier: 2};
      if (['fly', 'bounce', 'skydrop'].includes(charging) && ['gust', 'twister', 'thunder', 'hurricane', 'smackdown', 'skyuppercut'].includes(move.id)) {
        return {canHit: true, multiplier: ['gust', 'twister'].includes(move.id) ? 2 : 1};
      }
      if (['solarbeam', 'solarblade', 'meteorbeam', 'skyattack', 'razorwind', 'freezeshock', 'iceburn', 'electroshot', 'geomancy'].includes(charging)) {
        return {canHit: true, multiplier: 1};
      }
      return {canHit: false, multiplier: 1};
    }

    accuracyStageMod(stage) {
      stage = clamp(stage, -6, 6);
      return stage >= 0 ? (3 + stage) / 3 : 3 / (3 - stage);
    }

    moveAccuracy(attacker, defender, move) {
      if (move.ohko) {
        if (attacker.level < defender.level) return 0;
        let base = 30 + attacker.level - defender.level;
        if (move.id === 'sheercold' && !attacker.types.includes('Ice')) base = 20 + attacker.level - defender.level;
        return clamp(base, 1, 100);
      }
      if (attacker.volatiles.lockon?.targetUid === defender.uid) return null;
      if (ALWAYS_HIT_MOVES.has(move.id) || move.ignoreAccuracy || move.accuracy == null) return null;
      if (defender.volatiles.minimize && ['bodyslam', 'dragonrush', 'heatcrash', 'heavyslam', 'stomp', 'supercellslam', 'flyingpress', 'maliciousmoonsault'].includes(move.id)) return null;
      if (move.id === 'thunder' || move.id === 'hurricane' || move.id === 'bleakwindstorm' || move.id === 'wildboltstorm' || move.id === 'sandsearstorm') {
        const weather = this.weatherFor(attacker);
        if (weather === 'rain') return null;
        if (weather === 'sun') return 50;
      }
      if (move.id === 'blizzard' && ['snow', 'hail'].includes(this.weatherFor(attacker))) return null;
      if (move.id === 'toxic' && attacker.types.includes('Poison')) return null;

      // Foresight / Odor Sleuth / Miracle Eye also strip the identified target's evasion.
      const ignoreEvasion = move.ignoreEvasion || this.abilityOf(attacker)?.ignoreEvasion ||
        defender.volatiles.foresight || defender.volatiles.miracleeye;
      const stages = (attacker.boosts.accuracy || 0) - (ignoreEvasion ? 0 : (defender.boosts.evasion || 0));
      let value = move.accuracy * this.accuracyStageMod(stages);
      value = this.modifyValue('onModifyAccuracy', attacker, value, defender, move);
      const defenderAbility = this.defenderAbility(defender, attacker);
      if (defenderAbility && typeof defenderAbility.onModifyAccuracy === 'function') {
        const next = defenderAbility.onModifyAccuracy(this, attacker, defender, move, value);
        if (typeof next === 'number' || next === null) value = next;
      }
      const defenderItem = this.itemOf(defender);
      if (defenderItem && typeof defenderItem.onSourceModifyAccuracy === 'function') {
        const next = defenderItem.onSourceModifyAccuracy(this, defender, attacker, move, value);
        if (typeof next === 'number' || next === null) value = next;
      }
      if (value == null) return null;
      if (this.field.pseudoWeather.gravity > 0) value *= 5 / 3;
      return clamp(value, 1, 100);
    }

    moveSpecialFailure(attacker, defender, move, context = {}) {
      // Only on the user's first turn of action since switching in.
      if (move.id === 'fakeout' && (attacker.activeTurns || 0) > 1) return true;
      /*
       * Focus Punch no longer fails when the user is hit first (project
       * decision — see MOVE_OVERRIDES in tools/generate-data.js). It moves at -3
       * priority, so "hit first" was the normal case rather than the exception,
       * and the move was effectively unusable outside a Substitute combo. It now
       * always executes and pays with 70% accuracy, which is data rather than a
       * branch here. Fake Out keeps its first-turn rule and shares this line, so
       * check what you are deleting before touching it.
       */
      /*
       * Dream Eater is unconditional in this project — it does **not** require a
       * sleeping target. Project decision (see PROJECT_CONTEXT §5, the
       * unconditional-moves list): a 100 BP draining move that only works against
       * a status the user usually cannot inflict is unusable in practice, and the
       * sleep clause made it strictly worse than every other Psychic attack.
       * It keeps its drain.
       *
       * Snore below is deliberately left alone — it fails unless the *user* is
       * asleep, which is a self-condition the user's own Rest can satisfy, so it
       * is a real strategy rather than dead weight.
       */
      if (move.id === 'snore' && attacker.status !== 'slp') return true;
      if (move.id === 'belch' && !attacker.ateBerry) return true;
      if (move.id === 'lastresort') {
        const others = attacker.moves.filter(m => m.id !== move.id);
        if (!others.length || others.some(m => !attacker.usedMoveIds.includes(m.id))) return true;
      }
      /*
       * Poltergeist is unconditional in this project too — it does **not** require
       * the target to be holding an item. Same reasoning as Dream Eater above: the
       * condition is set by the *opponent's* set rather than by anything the user
       * can do, so the move was a coin flip on team preview and dead against any
       * itemless lead.
       *
       * Fling below stays conditional: it consumes the **user's own** item and its
       * power comes from it, so without one there is nothing to throw — that is a
       * cost the user controls, not a condition imposed on them.
       *
       * `canRemoveItem(attacker, attacker)` rather than a bare `!attacker.item`,
       * because it also refuses a Mega Stone or forme item (§5: the stone "is never
       * consumed and cannot be removed"). Flinging one was possible before, and
       * would have destroyed it the moment Fling learned to consume anything.
       * Passing the attacker as its own source deliberately bypasses Sticky Hold —
       * an ability that stops *others* taking your item should not stop you using
       * it yourself.
       */
      if (move.id === 'fling' && !this.canRemoveItem(attacker, attacker)) return true;
      // Stuff Cheeks needs a Berry in hand. Declared here as well as in the executor
      // so `AI.willFail` sees it and never selects the move with nothing to eat.
      if (move.id === 'stuffcheeks' && !Dex.item(attacker.item)?.isBerry) return true;
      if (move.id === 'steelroller' && !this.field.terrain) return true;
      if (move.id === 'spitup' && !(attacker.volatiles.stockpile > 0)) return true;
      if (move.id === 'endeavor' && defender && defender.currentHP <= attacker.currentHP) return true;
      if (move.id === 'counter' && !(attacker.damageTakenThisTurn > 0 && attacker.lastDamageCategory === 'Physical' && attacker.lastDamageSourceUid === defender?.uid)) return true;
      if (move.id === 'mirrorcoat' && !(attacker.damageTakenThisTurn > 0 && attacker.lastDamageCategory === 'Special' && attacker.lastDamageSourceUid === defender?.uid)) return true;
      if ((move.id === 'metalburst' || move.id === 'comeuppance') && !(attacker.damageTakenThisTurn > 0 && attacker.lastDamageSourceUid === defender?.uid)) return true;
      if (move.id === 'healingwish' || move.id === 'lunardance') { if (!this.canSwitch(attacker.side)) return true; }
      if (move.id === 'burnup' && !attacker.types.includes('Fire')) return true;
      if (move.id === 'doubleshock' && !attacker.types.includes('Electric')) return true;
      if (move.id === 'aurawheel' && Dex.species(attacker.species).baseSpecies !== 'Morpeko') return true;
      if (move.id === 'darkvoid' && Dex.species(attacker.species).baseSpecies !== 'Darkrai') return true;
      // Modern Destiny Bond: using it twice in a row fails. The engine had the
      // old repeatable version, which this project does not want restored.
      if (move.id === 'destinybond' && attacker.lastMoveId === 'destinybond') return true;
      return false;
    }

    /* ------------------------- damage calculation ------------------------- */

    /**
     * The category a move actually hits with, when the move decides that at use
     * time rather than in the data.
     *
     * Two moves do, and both were flat Special before this: **Tera Blast**,
     * which becomes Physical while Terastallized if the user's Attack beats its
     * Special Attack, and **Revelation Dance**, which this project gives the
     * same rule (upstream it is always Special — the redesign matches its type,
     * which already follows the user).
     *
     * Compared through `getStat`, so boosts, natures, items and abilities all
     * count — a Swords Dance really can flip Tera Blast physical, exactly as in
     * the games. Ties stay Special: the rule is Attack *greater than* Special
     * Attack.
     *
     * Tera Blast is gated on `terastallized` because that is the whole move: an
     * un-Terastallized Tera Blast is an ordinary Normal-type Special attack.
     */
    moveCategory(attacker, move) {
      if (!attacker || !CATEGORY_BY_STAT_MOVES.has(move.id)) return move.category;
      if (move.id === 'terablast' && !attacker.terastallized) return move.category;
      return this.getStat(attacker, 'atk') > this.getStat(attacker, 'spa') ? 'Physical' : 'Special';
    }

    moveType(attacker, defender, move) {
      /*
       * Tera Blast takes the user's Tera type, and had no case here at all —
       * it was a flat Normal-type move however the user Terastallized, which is
       * the one thing the move exists to do. Reported 2026-08-14.
       */
      if (move.id === 'terablast') {
        return attacker?.terastallized ? attacker.teraType : move.type;
      }
      if (move.id === 'weatherball') {
        return {rain: 'Water', sun: 'Fire', sandstorm: 'Rock', snow: 'Ice', hail: 'Ice'}[this.weatherFor(attacker)] || 'Normal';
      }
      if (move.id === 'terrainpulse' && this.field.terrain && this.isGrounded(attacker)) {
        return {electric: 'Electric', grassy: 'Grass', misty: 'Fairy', psychic: 'Psychic'}[this.field.terrain] || move.type;
      }
      /*
       * Revelation Dance is the user's *primary* type. Reading `types[0]`
       * rather than the species' own typing is deliberate: Terastallizing
       * replaces `types`, and a Tera'd Oricorio really does dance in its Tera
       * type — Soak, Conversion and Burn Up come along for free for the same
       * reason.
       */
      if (move.id === 'revelationdance') return attacker.types[0] || move.type;
      /*
       * Judgment, Multi-Attack and Techno Blast follow the held Plate, Memory
       * or Drive. This line used to read `return move.type`, which is what the
       * fallback does anyway — it looked like these were handled and resolved
       * every one of them to Normal.
       *
       * They read the *item*, not the user's typing. Multitype and RKS System
       * shift the forme, so Arceus and Silvally would work either way, but a
       * Genesect stays Bug/Steel whatever Drive it holds — only the item
       * carries the answer. Z-crystals declare `onPlate` too and are excluded
       * on `zMove`, as in the games: a Z-crystal does not retype Judgment, and
       * this project does not simulate Z-moves at all.
       */
      if (move.id === 'judgment' || move.id === 'multiattack' || move.id === 'technoblast') {
        const field = move.id === 'judgment' ? 'onPlate' : move.id === 'multiattack' ? 'onMemory' : 'onDrive';
        const item = Dex.item(attacker.item);
        if (item && !item.zMove && item[field]) return item[field];
        return move.type;
      }
      /*
       * Aura Wheel is Dark in Hangry mode. Both Morpeko formes are
       * Electric/Dark, so the typing cannot carry this and the forme is the
       * only thing that can — the same shape as Raging Bull and Ivy Cudgel
       * below. `moveSpecialFailure` separately keeps the move Morpeko-only.
       */
      if (move.id === 'aurawheel') {
        return Dex.species(attacker.species).forme === 'Hangry' ? 'Dark' : move.type;
      }
      if (move.id === 'naturalgift') {
        const item = Dex.item(attacker.item);
        if (item?.naturalGift?.type) return item.naturalGift.type;
      }
      if (move.id === 'ragingbull') {
        const forme = Dex.species(attacker.species).forme || '';
        return {'Paldea-Combat': 'Fighting', 'Paldea-Blaze': 'Fire', 'Paldea-Aqua': 'Water'}[forme] || move.type;
      }
      if (move.id === 'ivycudgel') {
        const forme = Dex.species(attacker.species).forme || '';
        if (forme.startsWith('Wellspring')) return 'Water';
        if (forme.startsWith('Hearthflame')) return 'Fire';
        if (forme.startsWith('Cornerstone')) return 'Rock';
        return 'Grass';
      }
      // Ion Deluge / Plasma Fists turn Normal moves Electric for the duration.
      if (move.type === 'Normal' && this.field.pseudoWeather.iondeluge > 0) return 'Electric';
      return move.type;
    }

    /**
     * Base power for the moves that compute it at use time.
     *
     * Three moves roll for their power (Magnitude, Present, Fickle Beam) and one
     * of them heals the target. Callers that are only *asking* what a move would
     * do — AI scoring, the damage calculator — must pass `{preview: true}`, which
     * returns the mean power instead: no RNG draw, no log line, no state change.
     * Without it, scoring a move the AI never picks advanced the mechanics RNG
     * (desynchronising replays, which skip AI evaluation), printed "Magnitude 8!"
     * before anything had been chosen, and — for Present — really healed the foe.
     */
    dynamicBasePower(attacker, defender, move, context = {}) {
      const power = move.basePower || 0;
      if (context.preview) {
        // Expected values: Magnitude's weighted roll, Present's four outcomes
        // (a fifth of which heal instead of damaging), Fickle Beam's 30% double.
        if (move.id === 'magnitude') return 71;
        if (move.id === 'present') return 52;
        if (move.id === 'ficklebeam') return Math.floor(move.basePower * 1.3);
      }
      switch (move.id) {
        case 'acrobatics': return attacker.item ? 55 : 110;
        case 'assurance': return defender.damageTakenThisTurn > 0 ? 120 : 60;
        case 'avalanche': case 'revenge':
          return attacker.lastDamageSourceUid === defender.uid && attacker.damageTakenThisTurn > 0 ? 120 : 60;
        case 'barbbarrage': case 'infernalparade': return defender.status ? 120 : 60;
        case 'beatup': return 10;
        case 'boltbeak': case 'fishiousrend': return defender.hasActedThisTurn ? move.basePower : move.basePower * 2;
        case 'brine': return defender.currentHP * 2 <= defender.maxHP ? 130 : 65;
        case 'collisioncourse': case 'electrodrift':
          return this.effectiveness(move.type, defender, move, attacker) > 1 ? Math.floor(move.basePower * 4 / 3) : move.basePower;
        case 'crushgrip': case 'wringout':
          return Math.max(1, Math.floor(120 * defender.currentHP / Math.max(1, defender.maxHP)));
        case 'dragonenergy': case 'eruption': case 'waterspout':
          return Math.max(1, Math.floor(150 * attacker.currentHP / Math.max(1, attacker.maxHP)));
        case 'electroball': {
          const ratio = this.getStat(attacker, 'spe') / Math.max(1, this.getStat(defender, 'spe'));
          return ratio >= 4 ? 150 : ratio >= 3 ? 120 : ratio >= 2 ? 80 : ratio >= 1 ? 60 : 40;
        }
        case 'echoedvoice': return Math.min(200, 40 * ((attacker.volatiles.echoedVoice || 0) + 1));
        case 'expandingforce': return this.field.terrain === 'psychic' && this.isGrounded(attacker) ? 120 : 80;
        case 'risingvoltage': return this.field.terrain === 'electric' && this.isGrounded(defender) ? 140 : 70;
        case 'ficklebeam': {
          // 30% chance to fire at double power. Rolled here rather than as a
          // secondary because it changes the damage, not an added effect.
          if (!this.rng.chance(0.3)) return move.basePower;
          this.add(`${this.label(attacker)} is going all out for this attack!`);
          return move.basePower * 2;
        }
        case 'fling': return Dex.item(attacker.item)?.fling?.basePower || 30;
        case 'facade': return ['brn', 'psn', 'tox', 'par'].includes(attacker.status) ? 140 : 70;
        case 'flail': case 'reversal': return this.lowHpPower(attacker);
        case 'furycutter': return Math.min(160, 40 * (2 ** (attacker.volatiles.furyCutter || 0)));
        case 'grassknot': case 'lowkick': return this.weightPower(this.weightOf(defender));
        case 'gyroball': return Math.min(150, Math.floor(25 * this.getStat(defender, 'spe') / Math.max(1, this.getStat(attacker, 'spe'))) + 1);
        case 'hardpress': return Math.max(1, Math.floor(100 * defender.currentHP / Math.max(1, defender.maxHP)));
        case 'heatcrash': case 'heavyslam': return this.weightRatioPower(this.weightOf(attacker), this.weightOf(defender));
        case 'hex': return defender.status ? 130 : 65;
        case 'hydrosteam': return move.basePower;
        case 'knockoff': return defender.item ? 97 : 65;
        case 'lastrespects': return Math.min(600, 50 * (1 + this.sideOf(attacker).team.filter(p => p.fainted).length));
        case 'mistyexplosion': return this.field.terrain === 'misty' && this.isGrounded(attacker) ? 150 : 100;
        case 'lashout': return attacker.statLoweredThisTurn ? 150 : 75;
        case 'payback': return defender.hasActedThisTurn ? 100 : 50;
        case 'psyblade': return this.field.terrain === 'electric' && this.isGrounded(attacker) ? Math.floor(80 * 1.5) : 80;
        case 'punishment': return Math.min(200, 60 + 20 * Object.values(defender.boosts).filter(v => v > 0).reduce((a, b) => a + b, 0));
        case 'ragefist': return Math.min(350, 50 + 50 * (attacker.timesHit || 0));
        case 'retaliate': return this.sideOf(attacker).conditions.lastFaintTurn === this.turn - 1 ? 140 : 70;
        case 'rollout': case 'iceball': return Math.min(480, 30 * (2 ** (attacker.volatiles.rolloutStage || 0)) * (attacker.volatiles.defensecurl ? 2 : 1));
        case 'round': return this.lastMoveThisTurn === 'round' ? 120 : 60;
        case 'spitup': return 100 * (attacker.volatiles.stockpile || 0);
        case 'powertrip': case 'storedpower':
          return 20 + 20 * Object.values(attacker.boosts).reduce((n, v) => n + Math.max(0, v), 0);
        case 'stompingtantrum': case 'temperflare': return attacker.lastMoveFailed ? 150 : 75;
        case 'terrainpulse': return this.field.terrain && this.isGrounded(attacker) ? 100 : 50;
        case 'trumpcard': {
          const slot = attacker.moves.find(m => m.id === 'trumpcard');
          const pp = slot ? slot.pp : 0;
          return pp === 0 ? 200 : pp === 1 ? 80 : pp === 2 ? 60 : pp === 3 ? 50 : 40;
        }
        case 'venoshock': return ['psn', 'tox'].includes(defender.status) ? 130 : 65;
        case 'weatherball': return this.weatherFor(attacker) ? 100 : 50;
        case 'return': return Math.max(1, Math.floor((attacker.set.happiness ?? 255) / 2.5));
        case 'frustration': return Math.max(1, Math.floor((255 - (attacker.set.happiness ?? 255)) / 2.5));
        case 'magnitude': {
          const roll = this.rng.int(1, 100);
          const power = roll <= 5 ? 10 : roll <= 15 ? 30 : roll <= 35 ? 50 : roll <= 65 ? 70 : roll <= 85 ? 90 : roll <= 95 ? 110 : 150;
          this.add(`Magnitude ${roll <= 5 ? 4 : roll <= 15 ? 5 : roll <= 35 ? 6 : roll <= 65 ? 7 : roll <= 85 ? 8 : roll <= 95 ? 9 : 10}!`);
          return power;
        }
        case 'present': {
          const roll = this.rng.int(1, 100);
          if (roll <= 20) {
            this.heal(defender, Math.floor(defender.maxHP / 4), {text: `${this.label(defender)} received a gift of HP!`});
            return 0;
          }
          return roll <= 60 ? 40 : roll <= 90 ? 80 : 120;
        }
        case 'naturalgift': {
          const item = Dex.item(attacker.item);
          if (!item?.isBerry || !item.naturalGift) return 0;
          return item.naturalGift.basePower || 80;
        }
        default: return power;
      }
    }

    criticalChance(attacker, move) {
      if (move.willCrit) return 1;
      if (this.abilityOf(attacker)?.alwaysCritPoisoned && ['psn', 'tox'].includes(this.foeActive(attacker)?.status)) return 1;
      let ratio = move.critRatio || 1;
      if (attacker.volatiles.focusenergy) ratio += 2;
      if (attacker.volatiles.dragoncheer) ratio += 1;
      ratio += this.abilityOf(attacker)?.critStageBonus || 0;
      ratio += this.itemOf(attacker)?.critStageBonus || 0;
      return [0, 1 / 24, 1 / 8, 1 / 2, 1, 1][clamp(ratio, 1, 5)];
    }

    weatherPowerModifier(attacker, type) {
      const weather = this.weatherFor(attacker);
      if (weather === 'sun') return type === 'Fire' ? 1.5 : type === 'Water' ? 0.5 : 1;
      if (weather === 'rain') return type === 'Water' ? 1.5 : type === 'Fire' ? 0.5 : 1;
      return 1;
    }

    terrainPowerModifier(type, attacker, defender, move) {
      if (!this.field.terrain) return 1;
      const terrain = this.field.terrain;
      if (terrain === 'electric' && type === 'Electric' && this.isGrounded(attacker)) return 1.3;
      if (terrain === 'grassy' && type === 'Grass' && this.isGrounded(attacker)) return 1.3;
      if (terrain === 'psychic' && type === 'Psychic' && this.isGrounded(attacker)) return 1.3;
      if (terrain === 'misty' && type === 'Dragon' && this.isGrounded(defender)) return 0.5;
      if (terrain === 'grassy' && ['earthquake', 'bulldoze', 'magnitude'].includes(move.id) && this.isGrounded(defender)) return 0.5;
      return 1;
    }

    calculateDamage(attacker, defender, move, critical, context = {}) {
      const type = context.type || this.moveType(attacker, defender, move);
      let power = context.power ?? this.dynamicBasePower(attacker, defender, move, context);
      power = this.modifyValue('onBasePower', attacker, power, defender, move);
      const aura = this.auraMultiplier(type, attacker);
      if (aura !== 1) power = Math.floor(power * aura);

      const atkKey = move.id === 'bodypress' ? 'def' : move.category === 'Physical' ? 'atk' : 'spa';
      const defKey = ['psyshock', 'psystrike', 'secretsword'].includes(move.id) ? 'def' : move.category === 'Physical' ? 'def' : 'spd';
      const attackMon = move.id === 'foulplay' ? defender : attacker;

      const attackerIgnoresBoosts = !!this.defenderAbility(defender, attacker)?.ignoreOpponentBoosts;
      const defenderIgnoresBoosts = !!this.abilityOf(attacker)?.ignoreOpponentBoosts;

      const atk = this.getStat(attackMon, atkKey, {ignoreNegative: critical, ignoreBoosts: attackerIgnoresBoosts});
      let def = this.getStat(defender, defKey, {ignorePositive: critical || move.ignoreDefensive, ignoreBoosts: defenderIgnoresBoosts});
      // Explosion and Self-Destruct historically treated the target's Defence as
      // halved. Done on the local value inside the damage step, so nothing is
      // written back, no stat-drop effects fire, and the halving lands before
      // the division rather than doubling the final figure afterwards — the two
      // differ once flooring and later modifiers are applied.
      if (move.id === 'explosion' || move.id === 'selfdestruct') def = Math.max(1, Math.floor(def / 2));

      const stab = this.stabFor(attacker, type);
      const eff = this.effectiveness(type, defender, move, attacker);
      const guts = this.abilityOf(attacker)?.ignoreBurnDrop;
      const burn = move.category === 'Physical' && attacker.status === 'brn' && move.id !== 'facade' && !guts ? 0.5 : 1;
      const critMult = critical ? (this.abilityOf(attacker)?.critMultiplier || 1.5) : 1;
      const random = 0.85 + this.rng.next() * 0.15;

      let modifier = stab * eff * burn * critMult * random *
        this.weatherPowerModifier(attacker, type) * this.terrainPowerModifier(type, attacker, defender, move);
      if (type === 'Electric' && this.field.pseudoWeather.mudsport > 0) modifier /= 3;
      if (type === 'Fire' && this.field.pseudoWeather.watersport > 0) modifier /= 3;

      if (attacker.volatiles.charge && type === 'Electric') { modifier *= 2; delete attacker.volatiles.charge; }
      if (['solarbeam', 'solarblade'].includes(move.id)) {
        const weather = this.weatherFor(attacker);
        if (weather && weather !== 'sun') modifier *= 0.5;
      }
      if (move.id === 'hydrosteam' && this.weatherFor(attacker) === 'sun') modifier *= 3; // cancels the 0.5 sun penalty and adds 1.5x

      const targetSide = this.sides[defender.side];
      if (!critical && !move.ignoreScreens) {
        if (targetSide.conditions.auroraveil > 0) modifier *= 0.5;
        else if (move.category === 'Physical' && targetSide.conditions.reflect > 0) modifier *= 0.5;
        else if (move.category === 'Special' && targetSide.conditions.lightscreen > 0) modifier *= 0.5;
      }
      if (defender.volatiles.minimize && ['bodyslam', 'dragonrush', 'heatcrash', 'heavyslam', 'stomp', 'supercellslam'].includes(move.id)) modifier *= 2;
      modifier *= context.semiMultiplier || 1;

      let damage = Math.max(1, Math.floor((((2 * attacker.level / 5 + 2) * power * atk / Math.max(1, def)) / 50 + 2) * modifier));

      damage = this.modifyValue('onModifyDamage', attacker, damage, defender, move);
      const defenderAbility = this.defenderAbility(defender, attacker);
      if (defenderAbility && typeof defenderAbility.onSourceModifyDamage === 'function') {
        const next = defenderAbility.onSourceModifyDamage(this, defender, attacker, move, damage);
        if (typeof next === 'number') damage = next;
      }
      const defenderItem = this.itemOf(defender);
      if (defenderItem && typeof defenderItem.onSourceModifyDamage === 'function') {
        const next = defenderItem.onSourceModifyDamage(this, defender, attacker, move, damage);
        if (typeof next === 'number') damage = next;
      }
      return Math.max(0, Math.floor(damage));
    }

    /**
     * Dark Aura / Fairy Aura, with the legacy Mold Breaker interaction.
     *
     * Mold Breaker, Turboblaze and Teravolt ignore another Pokémon's Aura when
     * they are the one attacking — the restored pre-nerf scope. Only the Aura
     * abilities are added to the bypass; everything else the Mold Breaker
     * family does or does not ignore is unchanged, and an Aura on the attacker
     * itself would still count (no Pokémon can have both, but the rule is
     * "ignores *other* Pokémon's abilities", so it is written that way).
     */
    auraMultiplier(type, attacker = null) {
      const breaksMold = !!this.abilityOf(attacker)?.breaksMold;
      let hasBreak = false;
      let matched = false;
      for (const side of this.sides) {
        const active = this.active(side.index);
        if (!active || active.fainted) continue;
        const ability = this.abilityOf(active);
        if (!ability) continue;
        if (ability.auraBreak) hasBreak = true;
        if (ability.aura === type && !(breaksMold && active !== attacker)) matched = true;
      }
      if (!matched) return 1;
      return hasBreak ? 0.75 : 1.33;
    }

    fixedDamage(attacker, defender, move) {
      if (move.ohko) return defender.currentHP;
      if (move.damage === 'level' || ['nightshade', 'seismictoss'].includes(move.id)) return attacker.level;
      if (typeof move.damage === 'number') return move.damage;
      if (move.id === 'superfang' || move.id === 'naturesmadness' || move.id === 'ruination') return Math.max(1, Math.floor(defender.currentHP / 2));
      if (move.id === 'endeavor') return Math.max(0, defender.currentHP - attacker.currentHP);
      if (move.id === 'finalgambit') return attacker.currentHP;
      if (move.id === 'counter' || move.id === 'mirrorcoat') return Math.max(1, attacker.damageTakenThisTurn * 2);
      if (move.id === 'metalburst' || move.id === 'comeuppance') return Math.max(1, Math.floor(attacker.damageTakenThisTurn * 1.5));
      if (move.id === 'psywave') return Math.max(1, Math.floor(attacker.level * (this.rng.int(0, 100) + 50) / 100));
      return null;
    }

    multihitCount(move, attacker) {
      if (move.id === 'beatup') return this.sideOf(attacker).team.filter(p => !p.fainted && !p.status).length || 1;
      if (move.id === 'tripleaxel' || move.id === 'triplekick') return 3;
      if (Array.isArray(move.multihit)) {
        if (this.abilityOf(attacker)?.maxMultihit) return move.multihit[1];
        const minimum = this.itemOf(attacker)?.minMultihit;
        if (minimum) return this.rng.int(minimum, move.multihit[1]);
        const roll = this.rng.next();
        return roll < 0.35 ? 2 : roll < 0.70 ? 3 : roll < 0.85 ? 4 : 5;
      }
      if (typeof move.multihit === 'number') return move.multihit;
      // Parental Bond turns a single-strike damaging move into two hits.
      if (this.abilityOf(attacker)?.parentalBond && this.parentalBondApplies(move)) return 2;
      return 1;
    }

    /**
     * Parental Bond only doubles ordinary single-strike attacks: never a move
     * that already hits more than once, a fixed-damage or OHKO move, or a
     * charge move's release.
     */
    parentalBondApplies(move) {
      if (move.category === 'Status' || move.multihit || move.ohko) return false;
      if (move.damage != null || FIXED_DAMAGE_MOVES.has(move.id)) return false;
      return !['fling', 'endeavor', 'finalgambit', 'beatup', 'uproar', 'rollout', 'iceball'].includes(move.id);
    }

    applyDamagingMove(attacker, defender, move, context) {
      const type = this.moveType(attacker, defender, move);
      const eff = this.effectiveness(type, defender, move, attacker);
      if (eff === 0) {
        this.add(`It doesn't affect ${this.label(defender)}...`);
        if (CRASH_MOVES.has(move.id) || move.hasCrashDamage) this.crashDamage(attacker);
        return 'noeffect';
      }
      /*
       * Ring Target announces itself when it actually pierces, so the log says
       * why a Normal move just hit a Ghost. (Visibility is separate and
       * unconditional — the item is `publicItem`, shown from turn one.)
       *
       * "Did the item cause this?" is answered by measuring without it —
       * temporarily clearing and restoring, the same technique the Tera and
       * setup decisions use — rather than by re-deriving which of the several
       * immunity-restoring paths applied. Only reachable here, in the real
       * damage path; `effectiveness` itself stays free of side effects (§5).
       */
      if (this.itemOf(attacker)?.piercesImmunities) {
        const saved = attacker.item;
        attacker.item = null;
        const withoutItem = this.effectiveness(type, defender, move, attacker);
        attacker.item = saved;
        if (withoutItem === 0) {
          this.add(`${this.label(attacker)}'s ${Dex.item(saved).name} let the attack through!`);
        }
      }
      defender.hitSubstituteThisMove = false;
      const fixed = this.fixedDamage(attacker, defender, move);
      const hits = fixed != null ? 1 : this.multihitCount(move, attacker);
      let total = 0;
      let actualHits = 0;
      let anyCritical = false;

      for (let i = 0; i < hits && !defender.fainted; i++) {
        if (move.id === 'tripleaxel' || move.id === 'triplekick') {
          const hitAcc = this.moveAccuracy(attacker, defender, move);
          if (hitAcc != null && this.rng.next() * 100 >= hitAcc) break;
        }
        const critBlocked = this.sides[defender.side].conditions.luckychant > 0 ||
          this.defenderAbility(defender, attacker)?.onCriticalHit?.(this, defender, attacker, move) === false;
        const critical = !critBlocked && (move.willCrit || this.rng.next() < this.criticalChance(attacker, move));
        if (critical) anyCritical = true;
        const power = (move.id === 'tripleaxel' || move.id === 'triplekick')
          ? (move.id === 'tripleaxel' ? 20 : 10) * (i + 1)
          : undefined;
        // Parental Bond's second strike lands at half power (the Gen VI value,
        // not the later quarter). It stays a separate strike: the loop runs
        // twice, so Substitute, Sturdy, Focus Sash, contact effects, on-hit
        // items/abilities and rounding all resolve per hit.
        const bondHit = i > 0 && !move.multihit && this.abilityOf(attacker)?.parentalBond && this.parentalBondApplies(move);
        const semiMultiplier = (context.semiMultiplier || 1) * (bondHit ? 0.5 : 1);
        const requested = fixed != null ? fixed : this.calculateDamage(attacker, defender, move, critical, {power, type, semiMultiplier});
        const dealt = this.damage(defender, requested, {source: attacker, category: move.category, move, indirect: false});
        total += dealt;
        actualHits++;
        if (!defender.hitSubstituteThisMove && dealt > 0) {
          this.emit({type: 'hit', target: defender.uid, damage: dealt, critical, effectiveness: eff});
        }
        if (dealt <= 0 && !defender.hitSubstituteThisMove) break;
      }

      if (actualHits === 0) {
        this.add(`${this.label(attacker)}'s attack missed!`);
        if (CRASH_MOVES.has(move.id) || move.hasCrashDamage) this.crashDamage(attacker);
        return false;
      }
      if (actualHits > 1) this.add(`Hit ${actualHits} time${actualHits === 1 ? '' : 's'}!`);
      if (anyCritical) this.add('A critical hit!');
      if (eff > 1) this.add("It's super effective!");
      else if (eff < 1) this.add("It's not very effective...");
      // Damage soaked by a Substitute is already reported as such — saying the
      // Pokémon lost it too reads as though the hit went through.
      if (total > 0 && !defender.hitSubstituteThisMove) this.add(`${this.label(defender)} lost ${total} HP.`);

      if (total > 0) attacker.lifeOrbHit = true;

      if (move.drain && total > 0) {
        const bonus = this.itemOf(attacker)?.drainMultiplier || 1;
        const amount = Math.max(1, Math.floor(total * move.drain[0] / move.drain[1] * bonus));
        const ooze = this.defenderAbility(defender, attacker);
        if (ooze && typeof ooze.onDrained === 'function') ooze.onDrained(this, defender, attacker, amount);
        else this.heal(attacker, amount, {text: `${this.label(attacker)} had its energy drained!`});
      }
      const recoilAbility = this.abilityOf(attacker);
      if (move.recoil && total > 0 && !recoilAbility?.indirectImmune && !recoilAbility?.ignoreRecoil) {
        const amount = Math.max(1, Math.floor(total * move.recoil[0] / move.recoil[1]));
        this.damage(attacker, amount, {indirect: true, text: `${this.label(attacker)} is damaged by recoil!`});
      }
      if (move.mindBlownRecoil) {
        this.damage(attacker, Math.max(1, Math.floor(attacker.maxHP / 2)), {indirect: true, text: `${this.label(attacker)} was hurt by the explosion!`});
      }

      const blockSecondary = !!(this.defenderAbility(defender, attacker)?.blockSecondary || this.itemOf(defender)?.blockSecondary);

      if (!defender.hitSubstituteThisMove && !defender.fainted) {
        if (move.status) this.setStatus(defender, move.status, attacker);
        if (move.volatileStatus === 'leechseed' || move.id === 'leechseed') this.applyLeechSeed(attacker, defender);
        else if (move.volatileStatus) this.addVolatile(defender, move.volatileStatus, attacker, move);
        if (move.boosts) this.boost(move.target === 'self' ? attacker : defender, move.boosts, attacker);
      }
      this.applySelfMoveEffects(attacker, move);
      if (!blockSecondary) this.applySecondary(attacker, defender, move);
      this.applyAfterHitEffects(attacker, defender, move, total);

      // Defender-side reactive effects.
      //
      // A Substitute that soaked the hit means the holder was never touched, so
      // none of these fire. Protective Pads and Long Reach negate *contact* and
      // nothing else, so rather than skipping the hooks they get a contact-free
      // view of the move: Rocky Helmet and Rough Skin check that flag and bow
      // out, while Red Card and Eject Button — which are not contact effects —
      // still trigger.
      if (total > 0 && !defender.fainted) {
        if (!defender.hitSubstituteThisMove) {
          const contactNegated = move.flags?.contact &&
            (this.abilityOf(attacker)?.noContactAbility || this.itemOf(attacker)?.noContact);
          const reactive = contactNegated
            ? Object.assign({}, move, {flags: Object.assign({}, move.flags, {contact: false})})
            : move;
          const defAbility = this.defenderAbility(defender, attacker);
          if (defAbility && typeof defAbility.onDamagingHit === 'function') defAbility.onDamagingHit(this, defender, attacker, reactive, total, anyCritical);
          const defItem = this.itemOf(defender);
          if (defItem && typeof defItem.onDamagingHit === 'function') defItem.onDamagingHit(this, defender, attacker, reactive, total);
          if (defItem && typeof defItem.onAfterHitTaken === 'function') defItem.onAfterHitTaken(this, defender, attacker, reactive, total);
        }
        this.checkItemTriggers(defender);
        this.checkFormeTriggers(defender);
      }
      if (total > 0) this.runItem('onAfterDamageDealt', attacker, defender, move, total);

      if (move.id === 'spitup') delete attacker.volatiles.stockpile;
      if (move.id === 'finalgambit') this.damage(attacker, attacker.currentHP, {indirect: true});
      if (move.selfdestruct === 'always' || (move.selfdestruct === 'ifHit' && actualHits > 0)) {
        this.damage(attacker, attacker.currentHP, {indirect: true, text: `${this.label(attacker)} exploded!`});
      }
      // Hyper Beam's classic exception: KO the target and the user skips its
      // recharge. Read from the target's HP rather than a flag, so damage soaked
      // by a Substitute — or a target that survived — still costs the turn.
      const hyperBeamKO = move.id === 'hyperbeam' && defender &&
        total > 0 && !defender.hitSubstituteThisMove && defender.currentHP <= 0;
      if (!hyperBeamKO && (RECHARGE_MOVES.has(move.id) || move.self?.volatileStatus === 'mustrecharge')) {
        attacker.volatiles.recharge = {};
      }
      if (move.forceSwitch || FORCE_SWITCH_MOVES.has(move.id)) this.forceSwitch(this.sides[defender.side]);
      if ((move.selfSwitch || SELF_SWITCH_MOVES.has(move.id)) && !attacker.fainted && this.canSwitch(attacker.side)) {
        this.sideOf(attacker).switchRequest = {
          reason: move.name,
          passBoosts: move.selfSwitch === 'copyvolatile' || move.id === 'batonpass',
          passVolatiles: move.selfSwitch === 'copyvolatile' || move.id === 'batonpass',
        };
      }
      return true;
    }

    applySecondary(attacker, defender, move) {
      const effects = move.secondaries?.length ? move.secondaries : (move.secondary ? [move.secondary] : []);
      const multiplier = this.abilityOf(attacker)?.secondaryMultiplier || 1;
      for (const sec of effects) {
        if (!sec) continue;
        const chance = Math.min(100, (sec.chance ?? 100) * multiplier);
        if (this.rng.next() * 100 > chance) continue;
        if (defender && !defender.hitSubstituteThisMove && !defender.fainted) {
          if (sec.status) this.setStatus(defender, sec.status, attacker);
          if (sec.boosts) this.boost(defender, sec.boosts, attacker);
          if (sec.volatileStatus === 'leechseed') this.applyLeechSeed(attacker, defender);
          else if (sec.volatileStatus) this.addVolatile(defender, sec.volatileStatus, attacker, move);
        }
        if (sec.self?.boosts) this.boost(attacker, sec.self.boosts, attacker);
        if (sec.self?.status) this.setStatus(attacker, sec.self.status, attacker);
        if (sec.self?.volatileStatus) this.addVolatile(attacker, sec.self.volatileStatus, attacker, move);
      }
    }

    applySelfMoveEffects(attacker, move) {
      if (move.self?.boosts) this.boost(attacker, move.self.boosts, attacker);
      if (move.self?.status) this.setStatus(attacker, move.self.status, attacker);
      if (move.self?.volatileStatus && !['mustrecharge', 'lockedmove', 'roost', 'uproar'].includes(move.self.volatileStatus)) {
        this.addVolatile(attacker, move.self.volatileStatus, attacker, move);
      }
      if (move.self?.volatileStatus === 'roost') attacker.volatiles.roost = true;
    }

    applyAfterHitEffects(attacker, defender, move, total) {
      const side = this.sideOf(attacker);
      const foeSide = this.sides[defender.side];
      if (HAZARD_REMOVAL_MOVES.has(move.id)) {
        delete attacker.volatiles.leechSeed;
        delete attacker.volatiles.partiallyTrapped;
        let cleared = false;
        for (const key of ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb']) {
          if (side.conditions[key]) { side.conditions[key] = 0; cleared = true; }
        }
        if (move.id === 'defog') {
          for (const key of ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist']) {
            if (foeSide.conditions[key]) { foeSide.conditions[key] = 0; cleared = true; }
          }
          this.boost(defender, {evasion: -1}, attacker, {silentFail: true});
        }
        if (cleared) this.add(`${this.label(attacker)} blew away the hazards!`);
        if (move.id === 'tidyup') this.boost(attacker, {atk: 1, spe: 1}, attacker);
        if (move.id === 'mortalspin') this.setStatus(defender, 'psn', attacker);
      }
      if (SCREEN_BREAK_MOVES.has(move.id)) {
        if (foeSide.conditions.reflect || foeSide.conditions.lightscreen || foeSide.conditions.auroraveil) {
          foeSide.conditions.reflect = 0;
          foeSide.conditions.lightscreen = 0;
          foeSide.conditions.auroraveil = 0;
          this.add('The screens were shattered!');
        }
      }
      if (TERRAIN_CLEAR_MOVES.has(move.id) && this.field.terrain) {
        this.field.terrain = null;
        this.field.terrainTurns = 0;
        this.add('The terrain disappeared!');
      }
      if (move.id === 'clearsmog') {
        defender.boosts = {atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0};
        this.add(`${this.label(defender)}'s stat changes were removed!`);
      }
      if (move.id === 'psychicnoise') { defender.volatiles.healblock = 3; this.add(`${this.label(defender)} was prevented from healing!`); }
      if (move.id === 'throatchop') defender.volatiles.throatchop = 2;
      if (move.id === 'smackdown' || move.id === 'thousandarrows') defender.volatiles.smackdown = true;
      if (move.id === 'alluringvoice' && defender.statRaisedThisTurn) this.addVolatile(defender, 'confusion', attacker, move);
      if (move.id === 'burningjealousy' && defender.statRaisedThisTurn) this.setStatus(defender, 'brn', attacker);
      if (move.id === 'triattack' && this.rng.chance(0.2)) this.setStatus(defender, this.rng.pick(['brn', 'frz', 'par']), attacker);
      // These carry an empty `secondary` in the packaged data because Showdown
      // implements them with an onHit function, which does not survive export.
      if (move.id === 'ceaselessedge') this.addSideCondition(this.sides[defender.side], 'spikes');
      if (move.id === 'stoneaxe') this.addSideCondition(this.sides[defender.side], 'stealthrock');
      if (['anchorshot', 'spiritshackle'].includes(move.id) && !defender.fainted) {
        defender.volatiles.trapped = true;
        this.add(`${this.label(defender)} can no longer escape!`);
      }
      if (move.id === 'diamondstorm' && this.rng.chance(0.5)) this.boost(attacker, {def: 2}, attacker);
      if (move.id === 'direclaw' && this.rng.chance(0.5)) this.setStatus(defender, this.rng.pick(['slp', 'psn', 'par']), attacker);
      if (move.id === 'eeriespell' && defender.lastMoveId) {
        const slot = defender.moves.find(m => m.id === defender.lastMoveId);
        if (slot && slot.pp > 0) {
          const lost = Math.min(3, slot.pp);
          slot.pp -= lost;
          this.add(`${this.label(defender)}'s ${Dex.move(slot.id).name} lost ${lost} PP!`);
        }
      }
      /*
       * Thief steals even when the user is already holding something — the user's
       * item is **replaced** by the stolen one, and the old item is gone (it is not
       * handed to the target; that is Trick and Switcheroo).
       *
       * Project decision: the official "only if you have no item" clause makes the
       * move dead on any set that wants a held item at all, which is nearly all of
       * them, so Thief was effectively unusable outside a bare-handed lead.
       *
       * Covet keeps the official restriction, deliberately — it is left as the
       * conservative twin so the change is one move rather than a family, and it
       * is called out in PROJECT_CONTEXT §5.
       *
       * Two guards are load-bearing:
       *  - `canRemoveItem(defender)` still protects the *target's* Mega Stone and
       *    forme items, as it does for Knock Off and Trick (§5).
       *  - `isOwnFormeItem(attacker)` protects the *user's* own — a Mega Stone or
       *    Rusted Sword must not be destroyed by its holder stealing something,
       *    which is a route the old `!attacker.item` check made unreachable.
       */
      if (move.id === 'thief' && this.canRemoveItem(defender, attacker) && !this.isOwnFormeItem(attacker) &&
          this.canReceiveItem(attacker, defender.item)) {
        const stolen = defender.item;
        const discarded = attacker.item;
        attacker.item = stolen;
        defender.item = null;
        // The *discarded* item is destroyed, so Pickup can find it. The stolen one
        // is not recorded — it still exists, in the thief's hands.
        this.recordItemLoss(discarded);
        if (discarded) {
          this.add(`${this.label(attacker)} stole ${this.label(defender)}'s ${Dex.item(stolen).name}, discarding its ${Dex.item(discarded).name}!`);
        } else {
          this.add(`${this.label(attacker)} stole ${this.label(defender)}'s item!`);
        }
      }
      if (move.id === 'covet' && !attacker.item && this.canRemoveItem(defender, attacker) &&
          this.canReceiveItem(attacker, defender.item)) {
        attacker.item = defender.item;
        defender.item = null;
        this.add(`${this.label(attacker)} stole ${this.label(defender)}'s item!`);
      }
      if (move.id === 'knockoff' && this.canRemoveItem(defender, attacker) && !Items.get(defender.item)?.abilityProtected) {
        this.add(`${this.label(attacker)} knocked off ${this.label(defender)}'s ${Dex.item(defender.item).name}!`);
        this.recordItemLoss(defender.item);
        defender.item = null;
      }
      if (move.id === 'corrosivegas' && this.canRemoveItem(defender, attacker)) {
        this.recordItemLoss(defender.item);
        defender.item = null;
        this.add(`${this.label(defender)}'s item was corroded!`);
      }
      /*
       * Fling throws the user's item away, and some items do something on landing.
       *
       * Both halves were missing entirely: the item was never consumed — so the
       * user threw it and kept it — and `fling.status` / `fling.volatileStatus`
       * were **declared in the packaged data and read by nothing**, which is this
       * project's most common silent bug (§8). Only `fling.basePower` was ever used.
       *
       * Consumption goes through `consumeItem`, which is what makes the rest
       * correct for free: it sets `consumedItem` for Recycle, triggers Unburden,
       * and calls `recordItemLoss` so the new Pickup ability can find the item.
       * A Mega Stone never reaches here — `moveSpecialFailure` fails the move.
       */
      if (move.id === 'fling' && attacker.item) {
        const thrown = Dex.item(attacker.item);
        const effect = thrown?.fling || {};
        this.consumeItem(attacker, `${this.label(attacker)} flung its ${thrown.name}!`);
        if (effect.status) this.setStatus(defender, effect.status, attacker);
        if (effect.volatileStatus === 'flinch') defender.volatiles.flinch = true;
        else if (effect.volatileStatus) this.addVolatile(defender, effect.volatileStatus, attacker, move);
        // A flung Berry is eaten by the *target*, gaining its effect.
        if (thrown?.isBerry) {
          this.forceEatBerry(defender, thrown.id, {text: `${this.label(defender)} ate the flung ${thrown.name}!`});
        }
      }
      /*
       * Bug Bite and Pluck steal the target's Berry and eat it on the spot.
       *
       * The Berry is *eaten by the attacker*, not destroyed, so it is removed from
       * the target and its effect applied to the attacker. `recordItemLoss` is not
       * called — Berries are excluded from Pickup anyway, and this one was eaten
       * rather than lost. `canRemoveItem` keeps Sticky Hold and the forme items
       * honest, exactly as it does for Knock Off.
       */
      if ((move.id === 'bugbite' || move.id === 'pluck') && Dex.item(defender.item)?.isBerry &&
          this.canRemoveItem(defender, attacker)) {
        const berry = Dex.item(defender.item);
        defender.item = null;
        this.forceEatBerry(attacker, berry.id,
          {text: `${this.label(attacker)} stole and ate ${this.label(defender)}'s ${berry.name}!`});
      }
      if (move.thawsTarget && defender.status === 'frz') this.cureStatus(defender, `${this.label(defender)} was thawed out!`);
      if (move.id === 'saltcure') defender.volatiles.saltcure = true;
      if (move.id === 'syrupbomb') defender.volatiles.syrupbomb = 3;
      // A damaging move can also set a field effect (Plasma Fists -> Ion Deluge).
      if (move.pseudoWeather) this.setPseudoWeather(move.pseudoWeather, attacker);
      if (move.id === 'burnup') attacker.types = attacker.types.filter(t => t !== 'Fire');
      if (move.id === 'doubleshock') attacker.types = attacker.types.filter(t => t !== 'Electric');
      if (move.id === 'payday') this.emit({type: 'payday', amount: 5 * attacker.level, side: attacker.side});
    }

    /* ------------------------- status moves ------------------------- */

    applyStatusMove(attacker, defender, move, context = {}) {
      const special = this.applySpecialStatusMove(attacker, defender, move, context);
      if (special !== null) {
        if (!special) this.add('But it failed!');
        return special;
      }
      const target = move.target === 'self' || move.target === 'allies' || move.target === 'allySide' ? attacker : defender;
      let changed = false;

      if (move.heal) {
        const amount = Math.floor(target.maxHP * move.heal[0] / move.heal[1]);
        changed = this.heal(target, amount) > 0 || changed;
      }
      if (move.status) changed = this.setStatus(target, move.status, attacker) || changed;
      if (move.id === 'curse') {
        if (attacker.types.includes('Ghost')) {
          if (defender.volatiles.curse) return false;
          this.damage(attacker, Math.floor(attacker.maxHP / 2), {indirect: true});
          defender.volatiles.curse = true;
          this.add(`${this.label(attacker)} cut its own HP and put a curse on ${this.label(defender)}!`);
          return true;
        }
        return this.boost(attacker, {spe: -1, atk: 1, def: 1}, attacker);
      }
      if (move.volatileStatus === 'leechseed' || move.id === 'leechseed') changed = this.applyLeechSeed(attacker, defender) || changed;
      else if (move.volatileStatus) changed = this.addVolatile(target, move.volatileStatus, attacker, move) || changed;
      if (move.boosts) changed = this.boost(target, move.boosts, attacker) || changed;
      if (move.self?.boosts) changed = this.boost(attacker, move.self.boosts, attacker) || changed;
      if (move.self?.status) changed = this.setStatus(attacker, move.self.status, attacker) || changed;
      if (move.self?.volatileStatus) changed = this.addVolatile(attacker, move.self.volatileStatus, attacker, move) || changed;
      // Memento and friends: the user pays with its life once the effect lands.
      if (changed && (move.selfdestruct === 'always' || move.selfdestruct === 'ifHit')) {
        this.damage(attacker, attacker.currentHP, {indirect: true});
      }
      if (!changed) this.add('But it failed!');
      return changed;
    }

    weatherHealFraction(pokemon) {
      const weather = this.weatherFor(pokemon);
      if (weather === 'sun') return 2 / 3;
      if (weather) return 1 / 4;
      return 1 / 2;
    }

    applySpecialStatusMove(attacker, defender, move, context = {}) {
      const side = this.sideOf(attacker);
      const foeSide = defender ? this.sides[defender.side] : this.foeSide(side);

      // Chilly Reception sets weather *and* pivots, so it has to be caught
      // before the generic weather branch returns.
      if (move.id === 'chillyreception') {
        this.setWeather('snow', attacker);
        if (this.canSwitch(attacker.side)) side.switchRequest = {reason: move.name};
        return true;
      }
      if (move.weather) return this.setWeather(this.canonicalWeather(move.weather), attacker);
      if (move.terrain) return this.setTerrain(Dex.toID(move.terrain).replace(/terrain$/, ''), attacker);
      if (move.pseudoWeather) return this.setPseudoWeather(move.pseudoWeather, attacker);
      if (move.sideCondition) {
        const targetSide = move.target === 'foeSide' ? foeSide : side;
        const conditionId = Dex.toID(move.sideCondition);
        // Light Clay extends the three screens; the Wind Sock extends Tailwind
        // the same way. Both are read off the *setter*, so an extender only
        // works for the side condition its holder actually put up.
        const duration = ['reflect', 'lightscreen', 'auroraveil'].includes(conditionId)
          ? this.itemOf(attacker)?.screenDuration
          : conditionId === 'tailwind' ? this.itemOf(attacker)?.tailwindDuration : null;
        return this.addSideCondition(targetSide, conditionId, {duration});
      }

      if (move.stallingMove || PROTECT_MOVES.has(move.id)) {
        const previous = attacker.volatiles.stallCounter || 0;
        const success = previous === 0 || this.rng.ratio(1, 3 ** previous);
        attacker.volatiles.stallCounter = previous + 1;
        if (!success) return false;
        if (move.id === 'endure') {
          attacker.volatiles.endure = true;
          this.add(`${this.label(attacker)} braced itself!`);
        } else {
          attacker.protectedThisTurn = true;
          attacker.volatiles.protectEffect = move.id;
          this.add(`${this.label(attacker)} protected itself!`);
        }
        return true;
      }

      switch (move.id) {
        case 'acupressure': {
          const stats = BOOST_KEYS.filter(k => (attacker.boosts[k] || 0) < 6);
          return stats.length ? this.boost(attacker, {[this.rng.pick(stats)]: 2}, attacker) : false;
        }
        case 'afteryou': return !defender.hasActedThisTurn;
        case 'allyswitch': case 'followme': case 'helpinghand': case 'coaching': case 'dragoncheer': case 'ragepowder':
        case 'aromatherapy': case 'healbell': {
          if (['aromatherapy', 'healbell'].includes(move.id)) {
            let cured = false;
            for (const p of side.team) if (p.status && !p.fainted) { p.status = null; p.statusData.toxicCounter = 1; cured = true; }
            if (cured) this.add(`${side.name}'s team was cured of status conditions!`);
            return cured;
          }
          if (move.id === 'dragoncheer') { attacker.volatiles.dragoncheer = true; return true; }
          this.add('But it failed in a singles battle!');
          return false;
        }
        case 'batonpass': case 'shedtail': {
          if (!this.canSwitch(attacker.side)) return false;
          if (move.id === 'shedtail') {
            if (attacker.currentHP <= Math.floor(attacker.maxHP / 2)) return false;
            this.damage(attacker, Math.floor(attacker.maxHP / 2), {indirect: true});
            attacker.volatiles.substituteHP = Math.floor(attacker.maxHP / 4);
          }
          side.switchRequest = {
            reason: move.name,
            passBoosts: move.id === 'batonpass',
            passVolatiles: move.id === 'batonpass',
            passSubstitute: move.id === 'shedtail',
          };
          return true;
        }
        case 'teleport': {
          if (!this.canSwitch(attacker.side)) return false;
          side.switchRequest = {reason: move.name};
          return true;
        }
        case 'partingshot': {
          this.boost(defender, {atk: -1, spa: -1}, attacker);
          if (this.canSwitch(attacker.side)) side.switchRequest = {reason: move.name};
          return true;
        }
        case 'bellydrum':
          if (attacker.currentHP <= Math.floor(attacker.maxHP / 2) || (attacker.boosts.atk || 0) >= 6) return false;
          this.damage(attacker, Math.floor(attacker.maxHP / 2), {indirect: true});
          this.add(`${this.label(attacker)} cut its own HP and maximized its Attack!`);
          return this.boost(attacker, {atk: 6 - (attacker.boosts.atk || 0)}, attacker);
        case 'block': case 'meanlook': case 'spiderweb':
          defender.volatiles.trapped = true;
          this.add(`${this.label(defender)} can no longer escape!`);
          return true;
        case 'conversion': {
          const first = Dex.move(attacker.moves[0]?.id);
          if (!first || first.missing) return false;
          attacker.types = [first.type];
          this.add(`${this.label(attacker)} transformed into the ${first.type} type!`);
          return true;
        }
        case 'conversion2': {
          const last = defender.lastMoveId ? Dex.move(defender.lastMoveId) : null;
          if (!last) return false;
          const candidates = Dex.TYPES.filter(t => Dex.typeChart[last.type]?.[t] < 1);
          if (!candidates.length) return false;
          attacker.types = [this.rng.pick(candidates)];
          this.add(`${this.label(attacker)}'s type changed!`);
          return true;
        }
        case 'courtchange': {
          const keys = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'tailwind', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
          for (const key of keys) {
            const temp = side.conditions[key];
            side.conditions[key] = foeSide.conditions[key];
            foeSide.conditions[key] = temp;
          }
          this.add('The battle effects were swapped!');
          return true;
        }
        case 'guardswap': {
          for (const key of ['def', 'spd']) {
            const temp = attacker.boosts[key] || 0;
            attacker.boosts[key] = defender.boosts[key] || 0;
            defender.boosts[key] = temp;
          }
          this.add('The Pokémon swapped defensive stat changes!');
          return true;
        }
        case 'powerswap': {
          for (const key of ['atk', 'spa']) {
            const temp = attacker.boosts[key] || 0;
            attacker.boosts[key] = defender.boosts[key] || 0;
            defender.boosts[key] = temp;
          }
          this.add('The Pokémon swapped offensive stat changes!');
          return true;
        }
        case 'speedswap': {
          const temp = attacker.boosts.spe || 0;
          attacker.boosts.spe = defender.boosts.spe || 0;
          defender.boosts.spe = temp;
          this.add('The Pokémon swapped Speed changes!');
          return true;
        }
        case 'heartswap': {
          const temp = attacker.boosts;
          attacker.boosts = defender.boosts;
          defender.boosts = temp;
          this.add('The Pokémon swapped all stat changes!');
          return true;
        }
        case 'haze':
          for (const p of [attacker, defender]) p.boosts = {atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0};
          this.add('All stat changes were eliminated!');
          return true;
        case 'healingwish': case 'lunardance':
          side.conditions.healingwish = true;
          this.damage(attacker, attacker.currentHP, {indirect: true});
          this.add(`${this.label(attacker)} made a wish!`);
          return true;
        case 'healpulse': return this.heal(defender, Math.floor(defender.maxHP / 2)) > 0;
        case 'lockon': case 'mindreader':
          attacker.volatiles.lockon = {targetUid: defender.uid, turns: 2};
          this.add(`${this.label(attacker)} took aim at ${this.label(defender)}!`);
          return true;
        case 'magneticflux': return this.boost(attacker, {def: 1, spd: 1}, attacker);
        case 'mimic': {
          if (!defender.lastMoveId || context.index == null || context.index < 0) return false;
          const copied = Dex.move(defender.lastMoveId);
          if (copied.missing) return false;
          attacker.moves[context.index] = {id: copied.id, pp: copied.pp, maxPP: copied.pp};
          this.add(`${this.label(attacker)} learned ${copied.name}!`);
          return true;
        }
        case 'moonlight': case 'synthesis': case 'morningsun':
          return this.heal(attacker, Math.floor(attacker.maxHP * this.weatherHealFraction(attacker))) > 0;
        case 'shoreup': {
          const fraction = this.weatherFor(attacker) === 'sandstorm' ? 2 / 3 : 1 / 2;
          return this.heal(attacker, Math.floor(attacker.maxHP * fraction)) > 0;
        }
        case 'painsplit': {
          const average = Math.floor((attacker.currentHP + defender.currentHP) / 2);
          const beforeA = attacker.currentHP;
          const beforeD = defender.currentHP;
          attacker.currentHP = Math.min(attacker.maxHP, average);
          defender.currentHP = Math.min(defender.maxHP, average);
          this.add('The battlers shared their pain!');
          return attacker.currentHP !== beforeA || defender.currentHP !== beforeD;
        }
        case 'perishsong':
          for (const p of [attacker, defender]) if (p.volatiles.perish == null) p.volatiles.perish = 4;
          this.add('All Pokémon that heard the song will faint in three turns!');
          return true;
        case 'psychup':
          attacker.boosts = deepClone(defender.boosts);
          this.add(`${this.label(attacker)} copied the stat changes!`);
          return true;
        case 'recycle':
          if (!attacker.consumedItem || attacker.item) return false;
          attacker.item = attacker.consumedItem;
          attacker.consumedItem = null;
          this.add(`${this.label(attacker)} found one ${Dex.item(attacker.item).name}!`);
          return true;
        case 'reflecttype':
          attacker.types = [...defender.types];
          this.add(`${this.label(attacker)}'s type changed to match ${this.label(defender)}!`);
          return true;
        case 'soak':
          defender.types = ['Water'];
          this.add(`${this.label(defender)} transformed into the Water type!`);
          return true;
        case 'roar': case 'whirlwind': return this.forceSwitch(foeSide);
        case 'roleplay':
          attacker.ability = defender.ability;
          this.add(`${this.label(attacker)} copied ${this.label(defender)}'s ${defender.ability}!`);
          return true;
        case 'skillswap': {
          const temp = attacker.ability;
          attacker.ability = defender.ability;
          defender.ability = temp;
          this.add('The Pokémon swapped Abilities!');
          return true;
        }
        case 'entrainment':
          defender.ability = attacker.ability;
          this.add(`${this.label(defender)} acquired ${attacker.ability}!`);
          return true;
        case 'simplebeam':
          defender.ability = 'Simple';
          this.add(`${this.label(defender)} acquired Simple!`);
          return true;
        case 'worryseed':
          defender.ability = 'Insomnia';
          this.add(`${this.label(defender)} acquired Insomnia!`);
          return true;
        case 'spite': {
          const slot = defender.moves.find(m => m.id === defender.lastMoveId);
          if (!slot) return false;
          const before = slot.pp;
          slot.pp = Math.max(0, slot.pp - 4);
          this.add(`${Dex.move(slot.id).name}'s PP was reduced by ${before - slot.pp}!`);
          return before !== slot.pp;
        }
        case 'splash': this.add('But nothing happened!'); return true;
        case 'celebrate': this.add('Congratulations!'); return true;
        case 'swallow': {
          const count = attacker.volatiles.stockpile || 0;
          if (!count) return false;
          const fraction = count === 1 ? 1 / 4 : count === 2 ? 1 / 2 : 1;
          delete attacker.volatiles.stockpile;
          return this.heal(attacker, Math.floor(attacker.maxHP * fraction)) > 0;
        }
        case 'switcheroo': case 'trick': {
          if (!attacker.item && !defender.item) return false;
          // Sticky Hold refuses the swap outright.
          if (defender.item && !this.canRemoveItem(defender, attacker)) return false;
          // A swap moves an item in *both* directions, so the clause is checked
          // for each receiving side. Refused whole rather than half-applied.
          if (!this.canReceiveItem(defender, attacker.item)) return false;
          if (!this.canReceiveItem(attacker, defender.item)) return false;
          const temp = attacker.item;
          attacker.item = defender.item;
          defender.item = temp;
          this.add('The Pokémon swapped items!');
          return true;
        }
        case 'transform': {
          attacker.types = [...defender.types];
          attacker.boosts = deepClone(defender.boosts);
          attacker.ability = defender.ability;
          attacker.stats = Object.assign({}, defender.stats, {hp: attacker.stats.hp});
          attacker.moves = defender.moves.map(m => ({id: m.id, pp: 5, maxPP: 5}));
          attacker.volatiles.transformed = true;
          this.add(`${this.label(attacker)} transformed into ${Dex.species(defender.species).name}!`);
          return true;
        }
        case 'venomdrench':
          if (!['psn', 'tox'].includes(defender.status)) return false;
          return this.boost(defender, {atk: -1, spa: -1, spe: -1}, attacker);
        case 'rest':
          if (attacker.currentHP >= attacker.maxHP || attacker.status === 'slp') return false;
          if (this.isGrounded(attacker) && ['electric', 'misty'].includes(this.field.terrain)) return false;
          attacker.status = 'slp';
          attacker.statusData.sleepTurns = 2;
          attacker.statusData.toxicCounter = 1;
          this.heal(attacker, attacker.maxHP, {silent: true});
          this.add(`${this.label(attacker)} went to sleep and became healthy!`);
          return true;
        case 'wish':
          side.conditions.wish = {turns: 2, amount: Math.floor(attacker.maxHP / 2)};
          this.add(`${this.label(attacker)} made a wish!`);
          return true;
        case 'toxicthread':
          this.setStatus(defender, 'psn', attacker);
          return this.boost(defender, {spe: -1}, attacker);
        case 'stuffcheeks': case 'teatime': {
          /*
           * Both were eating the Berry for **nothing**: `eatBerry` consumes it and
           * fires the ability hook, but a Berry's actual effect lived inside its own
           * `onUpdate` trigger, which a forced eat never runs. So Stuff Cheeks paid a
           * Sitrus Berry for +2 Defence and threw the healing away, and Tea Time
           * consumed Berries with no effect at all.
           *
           * `forceEatBerry` is the path that applies the effect (`items.js` now
           * separates trigger from effect). Consume first, then apply, so the Berry is
           * really gone whichever way the effect goes.
           *
           * Tea Time is every Pokémon on the field, not just the user — that is the
           * whole move, and it was only ever eating the user's.
           */
          const eaters = move.id === 'teatime'
            ? this.sides.flatMap(side => side.team.filter(p => !p.fainted && side.team[side.activeIndex] === p))
            : [attacker];
          let any = false;
          for (const eater of eaters) {
            const item = Dex.item(eater.item);
            if (!item?.isBerry) continue;
            any = true;
            this.consumeItem(eater, `${this.label(eater)} ate its ${item.name}!`);
            this.forceEatBerry(eater, item.id);
          }
          if (!any) return false;
          return move.id === 'stuffcheeks' ? this.boost(attacker, {def: 2}, attacker) : true;
        }
        case 'refresh': case 'purify': {
          const target = move.id === 'purify' ? defender : attacker;
          if (!target.status) return false;
          this.cureStatus(target, `${this.label(target)}'s status was cured!`);
          if (move.id === 'purify') this.heal(attacker, Math.floor(attacker.maxHP / 2));
          return true;
        }
        case 'floralhealing':
          return this.heal(defender, Math.floor(defender.maxHP * (this.field.terrain === 'grassy' ? 2 / 3 : 1 / 2))) > 0;
        // Life Dew heals the user's side, which in singles is just the user.
        case 'lifedew':
          return this.heal(attacker, Math.floor(attacker.maxHP / 4)) > 0;
        case 'revivalblessing': {
          const fallen = side.team.find(p => p.fainted);
          if (!fallen) return false;
          fallen.fainted = false;
          fallen.currentHP = Math.max(1, Math.floor(fallen.maxHP / 2));
          fallen.status = null;
          fallen.statusData = {toxicCounter: 1, sleepTurns: 0};
          this.add(`${fallen.name} was revived and is ready to fight again!`);
          return true;
        }
        case 'junglehealing': case 'lunarblessing': {
          const healed = this.heal(attacker, Math.floor(attacker.maxHP / 4)) > 0;
          const cured = attacker.status ? this.cureStatus(attacker, `${this.label(attacker)} was cured!`) : false;
          return healed || cured;
        }
        case 'takeheart': {
          const cured = attacker.status ? this.cureStatus(attacker, `${this.label(attacker)} shook off its status!`) : false;
          return this.boost(attacker, {spa: 1, spd: 1}, attacker) || cured;
        }
        case 'strengthsap': {
          const amount = this.getStat(defender, 'atk');
          if ((defender.boosts.atk || 0) <= -6) return false;
          this.heal(attacker, amount, {text: `${this.label(attacker)} drained ${this.label(defender)}'s strength!`});
          return this.boost(defender, {atk: -1}, attacker);
        }
        case 'topsyturvy': {
          const inverted = Object.values(defender.boosts).some(v => v !== 0);
          if (!inverted) return false;
          for (const key of BOOST_KEYS) defender.boosts[key] = -(defender.boosts[key] || 0);
          this.add(`${this.label(defender)}'s stat changes were inverted!`);
          return true;
        }
        case 'guardsplit': case 'powersplit': {
          const keys = move.id === 'guardsplit' ? ['def', 'spd'] : ['atk', 'spa'];
          for (const key of keys) {
            const average = Math.floor((attacker.stats[key] + defender.stats[key]) / 2);
            attacker.stats[key] = average;
            defender.stats[key] = average;
          }
          this.add('The Pokémon shared their power!');
          return true;
        }
        case 'forestscurse': case 'trickortreat': {
          const added = move.id === 'forestscurse' ? 'Grass' : 'Ghost';
          if (defender.types.includes(added)) return false;
          defender.types = [...defender.types, added];
          this.add(`${added} type was added to ${this.label(defender)}!`);
          return true;
        }
        case 'magicpowder': {
          if (defender.types.length === 1 && defender.types[0] === 'Psychic') return false;
          defender.types = ['Psychic'];
          this.add(`${this.label(defender)} became the Psychic type!`);
          return true;
        }
        case 'camouflage': {
          const byTerrain = {electric: 'Electric', grassy: 'Grass', misty: 'Fairy', psychic: 'Psychic'};
          const newType = byTerrain[this.field.terrain] || 'Normal';
          if (attacker.types.length === 1 && attacker.types[0] === newType) return false;
          attacker.types = [newType];
          this.add(`${this.label(attacker)} became the ${newType} type!`);
          return true;
        }
        case 'bestow': {
          if (!attacker.item || defender.item) return false;
          if (!this.canReceiveItem(defender, attacker.item)) return false;
          defender.item = attacker.item;
          attacker.item = null;
          this.add(`${this.label(attacker)} handed its item to ${this.label(defender)}!`);
          return true;
        }
        case 'sketch': {
          if (!defender.lastMoveId || context.index == null || context.index < 0) return false;
          const copied = Dex.move(defender.lastMoveId);
          if (copied.missing || attacker.moves.some(m => m.id === copied.id)) return false;
          attacker.moves[context.index] = {id: copied.id, pp: copied.pp, maxPP: copied.pp};
          this.add(`${this.label(attacker)} sketched ${copied.name}!`);
          return true;
        }
        case 'doodle': {
          if (!defender.ability) return false;
          attacker.ability = defender.ability;
          this.add(`${this.label(attacker)} copied ${this.label(defender)}'s ${defender.ability}!`);
          return true;
        }
        case 'gearup': {
          if (!['Plus', 'Minus'].includes(attacker.ability)) return false;
          return this.boost(attacker, {atk: 1, spa: 1}, attacker);
        }
        case 'rototiller':
          if (!attacker.types.includes('Grass')) return false;
          return this.boost(attacker, {atk: 1, spa: 1}, attacker);
        case 'flowershield':
          if (!attacker.types.includes('Grass')) return false;
          return this.boost(attacker, {def: 1}, attacker);
        case 'quash': case 'instruct': case 'holdhands': case 'happyhour':
          this.add('But it failed in a singles battle!');
          return false;
        default: return null;
      }
    }

    /* ================================================================ *
     * Faints and end of turn
     * ================================================================ */

    checkFaints() {
      for (const side of this.sides) {
        for (const pokemon of side.team) {
          if (pokemon.currentHP > 0 || pokemon.faintHandled) continue;
          pokemon.fainted = true;
          pokemon.faintHandled = true;
          side.conditions.lastFaintTurn = this.turn;
          side.faintedCount++;
          this.add(`${this.label(pokemon)} fainted!`);
          this.emit({type: 'faint', target: pokemon.uid, side: side.index});

          const killerUid = pokemon.lastDamageSourceUid;
          const killer = killerUid ? this.findByUid(killerUid) : null;
          this.runAbility('onFaint', pokemon, killer, pokemon.currentMove);
          if (pokemon.volatiles.destinybond && killer && !killer.fainted) {
            this.damage(killer, killer.currentHP, {indirect: true, text: `${this.label(killer)} was taken down with ${this.label(pokemon)}!`});
          }
          if (killer && !killer.fainted && killer.side !== pokemon.side) {
            const ability = this.abilityOf(killer);
            if (ability && typeof ability.onFoeFaint === 'function') ability.onFoeFaint(this, killer, pokemon);
          }
          if (side.switchRequest) side.switchRequest = null;
        }
      }
      this.checkWin();
    }

    findByUid(uid) {
      for (const side of this.sides) {
        const found = side.team.find(p => p.uid === uid);
        if (found) return found;
      }
      return null;
    }

    checkWin() {
      if (this.ended) return true;
      const alive = this.sides.map(side => this.aliveCount(side));
      if (alive[0] > 0 && alive[1] > 0) return false;
      if (alive[0] === 0 && alive[1] === 0) this.finish(null, 'draw');
      else this.finish(alive[0] > 0 ? 0 : 1, 'knockout');
      return true;
    }

    finish(winnerIndex, reason) {
      if (this.ended) return;
      this.ended = true;
      this.phase = 'ended';
      this.requests = [null, null];
      this.winner = winnerIndex;
      this.endReason = reason;
      if (winnerIndex == null) this.add('The battle ended in a draw.');
      else this.add(`${this.sides[winnerIndex].name} won the battle!`);
      this.emit({type: 'end', winner: winnerIndex, reason, turns: this.turn});
    }

    /**
     * What the residual phase is about to do to this Pokémon's HP, in HP.
     *
     * Positive means it will end the turn healthier than it started; negative
     * means it is bleeding. This is what makes a turn spent behind Protect worth
     * something: the free turn is worth exactly what the residual phase does in
     * it, which is why a Leftovers wall and a Poison Heal Gliscor can afford to
     * stall and a burned attacker cannot.
     *
     * **It is a prediction, and it must stay one** (§5): running the real
     * residual hooks would heal the Pokémon, print to the log and advance
     * `statusData.toxicCounter`, and merely *asking* what a turn would do must
     * never change anything. So the engine-side sources below are mirrored from
     * `endOfTurn` in the same order, and the ability/item halves are read from a
     * declared `residualFraction` rather than by running `onResidual`.
     *
     * Mirroring is the drift risk this project keeps finding, so it is pinned
     * the way `statBreakdown` is: a test plays a real turn across a spread of
     * scenarios and asserts the observed HP delta equals this number. The one
     * hook it *does* call is `onWeatherDamage`, which is a pure predicate in
     * every implementation (it only ever returns a boolean).
     *
     * Deliberately excluded: Perish Song (lethal, and a different decision) and
     * Wish / Future Sight (side conditions with their own timers, not a
     * per-turn rate).
     */
    residualSwing(pokemon) {
      if (!pokemon || pokemon.fainted || pokemon.currentHP <= 0) return 0;
      const max = pokemon.maxHP;
      const ability = this.abilityOf(pokemon);
      const item = this.itemOf(pokemon);
      // `damage()` refuses every indirect source for Magic Guard, so one check
      // covers weather, hazardous volatiles and status chip together.
      const guarded = !!ability?.indirectImmune;
      let swing = 0;
      const hurt = fraction => { if (!guarded) swing -= Math.max(1, Math.floor(max * fraction)); };
      const mend = fraction => { swing += Math.max(1, Math.floor(max * fraction)); };

      const weather = this.effectiveWeather();
      const weatherChip = (types, fraction) => {
        if (types.some(t => pokemon.types.includes(t))) return;
        if (this.runAbility('onWeatherDamage', pokemon, weather) === false) return;
        if (this.runItem('onWeatherDamage', pokemon, weather) === false) return;
        hurt(fraction);
      };
      if (weather === 'sandstorm') weatherChip(['Rock', 'Ground', 'Steel'], 1 / 16);
      if (weather === 'hail') weatherChip(['Ice'], 1 / 16);

      const trap = pokemon.volatiles.partiallyTrapped;
      if (trap) hurt(1 / (trap.denominator || 8));
      if (pokemon.volatiles.leechSeed != null) hurt(1 / 8);
      if (pokemon.volatiles.curse) hurt(1 / 4);
      if (pokemon.volatiles.saltcure) hurt(pokemon.types.some(t => ['Water', 'Steel'].includes(t)) ? 1 / 4 : 1 / 8);
      if (pokemon.volatiles.nightmare && pokemon.status === 'slp') hurt(1 / 4);
      // The engine heals once for either, not once for each.
      if (pokemon.volatiles.aquaring || pokemon.volatiles.ingrain) mend(1 / 16);
      if (this.field.terrain === 'grassy' && this.isGrounded(pokemon)) mend(1 / 16);

      for (const source of [ability, item]) {
        if (typeof source?.residualFraction !== 'function') continue;
        const fraction = source.residualFraction(this, pokemon);
        if (!Number.isFinite(fraction) || fraction === 0) continue;
        if (fraction > 0) mend(fraction);
        else hurt(-fraction);
      }

      if (['brn', 'psn', 'tox'].includes(pokemon.status) &&
        !(ability?.indirectStatusImmune || []).includes(pokemon.status)) {
        if (pokemon.status === 'tox') hurt((pokemon.statusData?.toxicCounter || 1) / 16);
        else hurt(pokemon.status === 'brn' ? 1 / 16 : 1 / 8);
      }

      // Leech Seed pays its drain to whoever seeded it, and Bad Dreams bills the
      // sleeping foe. Both cross the field, so they are read off the opponent.
      const foe = this.foeActive(pokemon);
      if (foe && !foe.fainted) {
        if (foe.volatiles.leechSeed === pokemon.side && !this.abilityOf(foe)?.indirectImmune) {
          swing += Math.min(Math.max(1, Math.floor(foe.maxHP / 8)), foe.currentHP);
        }
        if (Dex.toID(foe.ability) === 'baddreams' && pokemon.status === 'slp') hurt(1 / 8);
      }
      return swing;
    }

    endOfTurn() {
      if (this.ended) return;

      // Future Sight / Doom Desire.
      for (const side of this.sides) {
        const fs = side.conditions.futureSight;
        if (!fs) continue;
        fs.turns--;
        if (fs.turns > 0) continue;
        side.conditions.futureSight = null;
        const target = this.active(side.index);
        if (target && !target.fainted) {
          const move = Dex.move(fs.moveId);
          this.add(`${this.label(target)} took the Future Sight attack!`);
          const damage = Math.max(1, Math.floor((((2 * fs.level / 5 + 2) * move.basePower * fs.spa / Math.max(1, this.getStat(target, 'spd'))) / 50 + 2) *
            this.effectiveness(move.type, target, move)));
          this.damage(target, damage, {indirect: true});
        }
      }

      // Wish.
      for (const side of this.sides) {
        const wish = side.conditions.wish;
        if (!wish) continue;
        wish.turns--;
        if (wish.turns > 0) continue;
        side.conditions.wish = null;
        const target = this.active(side.index);
        if (target && !target.fainted) this.heal(target, wish.amount, {text: `${this.label(target)}'s wish came true!`});
      }

      const order = this.sides
        .map(side => this.active(side.index))
        .filter(p => p && !p.fainted)
        .sort((a, b) => this.getStat(b, 'spe') - this.getStat(a, 'spe'));

      for (const pokemon of order) {
        if (pokemon.fainted) continue;
        pokemon.protectedThisTurn = false;
        delete pokemon.volatiles.protectEffect;
        delete pokemon.volatiles.endure;
        delete pokemon.volatiles.flinch;
        delete pokemon.volatiles.roost;
        delete pokemon.volatiles.destinybond;

        const weather = this.effectiveWeather();
        if (weather === 'sandstorm' && !pokemon.types.some(t => ['Rock', 'Ground', 'Steel'].includes(t))) {
          if (this.runAbility('onWeatherDamage', pokemon, weather) !== false && this.runItem('onWeatherDamage', pokemon, weather) !== false) {
            this.damage(pokemon, Math.max(1, Math.floor(pokemon.maxHP / 16)), {indirect: true, text: `${this.label(pokemon)} is buffeted by the sandstorm!`});
          }
        }
        if (weather === 'hail' && !pokemon.types.includes('Ice')) {
          if (this.runAbility('onWeatherDamage', pokemon, weather) !== false && this.runItem('onWeatherDamage', pokemon, weather) !== false) {
            this.damage(pokemon, Math.max(1, Math.floor(pokemon.maxHP / 16)), {indirect: true, text: `${this.label(pokemon)} is pelted by hail!`});
          }
        }

        if (pokemon.volatiles.yawn) {
          pokemon.volatiles.yawn--;
          if (pokemon.volatiles.yawn <= 0) {
            delete pokemon.volatiles.yawn;
            if (!pokemon.status) this.setStatus(pokemon, 'slp', null);
          }
        }
        const trap = pokemon.volatiles.partiallyTrapped;
        if (trap) {
          this.damage(pokemon, Math.max(1, Math.floor(pokemon.maxHP / (trap.denominator || 8))), {indirect: true, text: `${this.label(pokemon)} is hurt by the trap!`});
          trap.turns--;
          if (trap.turns <= 0) delete pokemon.volatiles.partiallyTrapped;
        }
        if (pokemon.currentHP > 0 && pokemon.volatiles.leechSeed != null) {
          const before = pokemon.currentHP;
          this.damage(pokemon, Math.max(1, Math.floor(pokemon.maxHP / 8)), {indirect: true});
          const drained = before - pokemon.currentHP;
          if (drained > 0) {
            this.add(`${this.label(pokemon)}'s health is sapped by Leech Seed!`);
            const healer = this.active(pokemon.volatiles.leechSeed);
            if (healer && !healer.fainted) this.heal(healer, drained, {silent: true});
          }
        }
        if (pokemon.currentHP > 0 && pokemon.volatiles.curse) {
          this.damage(pokemon, Math.max(1, Math.floor(pokemon.maxHP / 4)), {indirect: true, text: `${this.label(pokemon)} is afflicted by the curse!`});
        }
        if (pokemon.currentHP > 0 && pokemon.volatiles.saltcure) {
          const fraction = pokemon.types.some(t => ['Water', 'Steel'].includes(t)) ? 4 : 8;
          this.damage(pokemon, Math.max(1, Math.floor(pokemon.maxHP / fraction)), {indirect: true, text: `${this.label(pokemon)} is hurt by Salt Cure!`});
        }
        if (pokemon.currentHP > 0 && pokemon.volatiles.nightmare && pokemon.status === 'slp') {
          this.damage(pokemon, Math.max(1, Math.floor(pokemon.maxHP / 4)), {indirect: true, text: `${this.label(pokemon)} is locked in a nightmare!`});
        }
        if (pokemon.currentHP > 0 && (pokemon.volatiles.aquaring || pokemon.volatiles.ingrain)) {
          this.heal(pokemon, Math.max(1, Math.floor(pokemon.maxHP / 16)), {silent: true});
        }
        if (pokemon.currentHP > 0 && this.field.terrain === 'grassy' && this.isGrounded(pokemon)) {
          this.heal(pokemon, Math.max(1, Math.floor(pokemon.maxHP / 16)), {silent: true});
        }

        // Ability and item residuals before status chip, matching modern order.
        if (pokemon.currentHP > 0) this.runAbility('onResidual', pokemon);
        if (pokemon.currentHP > 0) this.runItem('onResidual', pokemon);

        if (pokemon.currentHP > 0 && ['brn', 'psn', 'tox'].includes(pokemon.status)) {
          const ability = this.abilityOf(pokemon);
          const immune = ability?.indirectImmune || (ability?.indirectStatusImmune || []).includes(pokemon.status);
          if (!immune) {
            let damage;
            if (pokemon.status === 'tox') {
              damage = Math.max(1, Math.floor(pokemon.maxHP * (pokemon.statusData.toxicCounter || 1) / 16));
              pokemon.statusData.toxicCounter = Math.min(15, (pokemon.statusData.toxicCounter || 1) + 1);
            } else {
              damage = Math.max(1, Math.floor(pokemon.maxHP * (pokemon.status === 'brn' ? 1 / 16 : 1 / 8)));
            }
            this.damage(pokemon, damage, {indirect: true, text: `${this.label(pokemon)} is hurt by ${pokemon.status === 'brn' ? 'its burn' : 'poison'}!`});
          }
        }
        if (pokemon.volatiles.perish != null) {
          pokemon.volatiles.perish--;
          if (pokemon.volatiles.perish <= 0) {
            this.damage(pokemon, pokemon.currentHP, {indirect: true, text: `${this.label(pokemon)}'s perish count fell to 0!`});
          } else {
            this.add(`${this.label(pokemon)}'s perish count fell to ${pokemon.volatiles.perish}.`);
          }
        }
        for (const key of ['taunt', 'magnetrise', 'healblock', 'throatchop', 'embargo', 'telekinesis', 'syrupbomb']) {
          if (typeof pokemon.volatiles[key] === 'number' && --pokemon.volatiles[key] <= 0) delete pokemon.volatiles[key];
        }
        for (const key of ['disable', 'encore']) {
          if (pokemon.volatiles[key] && --pokemon.volatiles[key].turns <= 0) delete pokemon.volatiles[key];
        }
        if (pokemon.volatiles.lockon && --pokemon.volatiles.lockon.turns <= 0) delete pokemon.volatiles.lockon;
        if (typeof pokemon.volatiles.charge === 'number' && --pokemon.volatiles.charge <= 0) delete pokemon.volatiles.charge;
        if (pokemon.currentHP > 0) this.checkItemTriggers(pokemon);
        if (pokemon.currentHP > 0) this.checkFormeTriggers(pokemon);
      }

      if (this.field.weatherTurns > 0 && --this.field.weatherTurns <= 0) {
        this.add(`The ${WEATHER_LABELS[this.field.weather] || 'weather'} subsided.`);
        this.field.weather = null;
        this.emit({type: 'weather', weather: null});
      }
      if (this.field.terrainTurns > 0 && --this.field.terrainTurns <= 0) {
        this.add(`The ${TERRAIN_LABELS[this.field.terrain] || 'terrain'} disappeared.`);
        this.field.terrain = null;
        this.emit({type: 'terrain', terrain: null});
      }
      for (const key of Object.keys(this.field.pseudoWeather)) {
        if (this.field.pseudoWeather[key] > 0 && --this.field.pseudoWeather[key] <= 0) {
          this.add(`${ROOM_NAMES[key] || key} ended.`);
        }
      }
      for (const side of this.sides) {
        for (const key of ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'tailwind', 'quickguard', 'wideguard']) {
          if (side.conditions[key] > 0) side.conditions[key]--;
        }
      }

      this.checkFaints();
      if (this.ended) return;

      if (this.rules.maxTurns && this.turn >= this.rules.maxTurns) {
        const hp = this.sides.map(side => side.team.reduce((sum, p) => sum + p.currentHP / p.maxHP, 0));
        this.add('The turn limit was reached.');
        this.finish(hp[0] === hp[1] ? null : (hp[0] > hp[1] ? 0 : 1), 'timeout');
        return;
      }

      if (this.sides.some(side => side.team[side.activeIndex].fainted)) {
        this.issueSwitchRequests({resume: false});
        return;
      }
      this.beginTurn();
    }

    /* ================================================================ *
     * Snapshots for the UI
     * ================================================================ */

    pokemonView(pokemon, {reveal = true} = {}) {
      if (!pokemon) return null;
      return {
        uid: pokemon.uid,
        species: pokemon.species,
        speciesName: Dex.species(pokemon.species).name,
        // Appearance only — the view draws `skin || species`.
        skin: pokemon.skin || null,
        name: pokemon.name,
        level: pokemon.level,
        gender: pokemon.gender,
        types: [...pokemon.types],
        baseTypes: [...pokemon.baseTypes],
        terastallized: pokemon.terastallized,
        teraType: pokemon.teraType,
        hp: pokemon.currentHP,
        maxHP: pokemon.maxHP,
        hpPercent: Math.max(0, Math.round(100 * pokemon.currentHP / pokemon.maxHP)),
        status: pokemon.status,
        statusName: pokemon.status ? STATUS_NAMES[pokemon.status] : null,
        fainted: pokemon.fainted,
        boosts: Object.assign({}, pokemon.boosts),
        ability: reveal ? pokemon.ability : null,
        /*
         * Which stat Protosynthesis / Quark Drive is currently boosting, so the
         * card can show it the way it shows an ordinary boost. It is a real
         * stat multiplier with no boost stage behind it, so nothing in
         * `boosts` reflects it and the player could only find out from a log
         * line that had long scrolled away.
         *
         * Gated on the same `reveal` as the ability itself: the activation is
         * announced in the log for both sides, so this is not new information,
         * but showing it while the ability name is still hidden would be an
         * odd half-reveal.
         */
        abilityBoost: reveal ? (pokemon.abilityState?.boostedStat || null) : null,
        // A `publicItem` is visible through `hideOpponentDetails` from turn
        // one. Only Ring Target carries it — see the note on the item.
        item: (reveal || Items.get(pokemon.item)?.publicItem) ? pokemon.item : null,
        revealed: pokemon.revealed,
        volatiles: Object.keys(pokemon.volatiles || {}),
        moves: reveal ? pokemon.moves.map(m => ({id: m.id, name: Dex.move(m.id).name, pp: m.pp, maxPP: m.maxPP})) : null,
        stats: reveal ? Object.assign({}, pokemon.stats) : null,
      };
    }

    view(perspective = 0) {
      return {
        turn: this.turn,
        phase: this.phase,
        ended: this.ended,
        winner: this.winner,
        format: {id: this.format.id, name: this.format.name},
        background: this.background,
        field: {
          weather: this.field.weather,
          weatherTurns: this.field.weatherTurns,
          terrain: this.field.terrain,
          terrainTurns: this.field.terrainTurns,
          pseudoWeather: Object.assign({}, this.field.pseudoWeather),
        },
        sides: this.sides.map(side => {
          const reveal = side.index === perspective || this.ended || !this.rules.hideOpponentDetails;
          return {
            index: side.index,
            name: side.name,
            avatar: side.avatar,
            terastallized: side.terastallized,
            megaEvolved: side.megaEvolved,
            conditions: Object.assign({}, side.conditions),
            active: this.pokemonView(side.team[side.activeIndex], {reveal}),
            team: side.team.map(p => ({
              uid: p.uid,
              species: p.species,
              name: p.name,
              revealed: p.revealed || reveal,
              fainted: p.fainted,
              hpPercent: Math.max(0, Math.round(100 * p.currentHP / p.maxHP)),
              status: p.status,
              active: p === side.team[side.activeIndex],
            })),
          };
        }),
        request: this.requests[perspective],
        log: this.log,
      };
    }

    /** Everything needed to replay this battle exactly. */
    replayData(meta = {}) {
      return Object.assign({
        version: 1,
        seed: this.seed,
        format: this.format.id,
        background: this.background,
        sides: this.sides.map(side => ({
          name: side.name,
          avatar: side.avatar,
          controller: side.controller,
          ai: side.ai,
          team: side.initialTeam.map(set => Object.assign({}, set)),
        })),
        commands: this.commands.map(c => ({turn: c.turn, phase: c.phase, side: c.side, choice: c.choice})),
        winner: this.winner,
        turns: this.turn,
      }, meta);
    }

    static fromReplay(replay) {
      const battle = new Battle({
        format: RedGPT.Formats.get(replay.format),
        seed: replay.seed,
        background: replay.background,
        sides: replay.sides.map(side => ({
          name: side.name, avatar: side.avatar,
          controller: 'script', ai: side.ai, team: side.team,
        })),
        script: replay.commands.map(c => ({...c, choice: {...c.choice}})),
      });
      battle.start();
      return battle;
    }
  }

  global.RedGPT.Battle = Battle;
  global.RedGPT.BattleConstants = {STATUS_NAMES, STATUS_LABELS, BOOST_KEYS, WEATHER_LABELS, TERRAIN_LABELS, DYNAMIC_POWER_MOVES, FIXED_DAMAGE_MOVES, STATUS_SPECIAL_MOVES, CHARGE_MOVES, SELF_SWITCH_MOVES, RECHARGE_MOVES, LOCKED_MOVES, FORCE_SWITCH_MOVES, HAZARD_REMOVAL_MOVES, CRASH_MOVES, ALWAYS_HIT_MOVES, TERRAIN_CLEAR_MOVES, SCREEN_BREAK_MOVES};
})(typeof window !== 'undefined' ? window : globalThis);
