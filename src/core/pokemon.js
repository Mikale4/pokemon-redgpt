/**
 * Pokémon "sets" and the conversion from a saved set into a battle-ready
 * Pokémon.
 *
 * A **set** is the persisted, editable definition used by the Team Builder,
 * team text import/export and Campaign roster:
 *
 *   {species, nickname, level, gender, ability, item, nature, teraType,
 *    moves: [moveId x4], evs: {...}, ivs: {...}, happiness, shiny}
 *
 * A **battle Pokémon** wraps a set with mutable battle/run state (HP, status,
 * PP, boosts, volatiles). Campaign additionally persists HP/status/PP between
 * nodes, which is why `createBattlePokemon` accepts carried-over condition.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Dex = RedGPT.Dex;
  const {STATS} = Dex;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const zeroStats = () => ({hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0});
  const maxIVs = () => ({hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31});
  const EV_TOTAL_LIMIT = 510;
  const EV_STAT_LIMIT = 252;

  let uidCounter = 0;
  function newUid(prefix = 'p') {
    uidCounter = (uidCounter + 1) % 1e6;
    return `${prefix}${Date.now().toString(36)}${uidCounter.toString(36)}`;
  }

  /* --------------------------- stat maths --------------------------- */

  function natureModifier(natureId, stat) {
    const n = Dex.nature(natureId);
    if (!n || stat === 'hp') return 1;
    if (n.plus === stat && n.minus === stat) return 1;
    if (n.plus === stat) return 1.1;
    if (n.minus === stat) return 0.9;
    return 1;
  }

  function calcStat(stat, base, iv, ev, level, natureMod) {
    const shared = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100);
    if (stat === 'hp') {
      if (base === 1) return 1; // Shedinja
      return shared + level + 10;
    }
    return Math.floor((shared + 5) * natureMod);
  }

  /** Full six-stat spread for a set. */
  function calcStats(set) {
    const s = Dex.species(set.species);
    const level = clamp(set.level || 100, 1, 100);
    const ivs = Object.assign(maxIVs(), set.ivs || {});
    const evs = Object.assign(zeroStats(), set.evs || {});
    const out = {};
    for (const stat of STATS) {
      out[stat] = calcStat(stat, s.baseStats[stat], ivs[stat] ?? 31, evs[stat] ?? 0, level, natureModifier(set.nature, stat));
    }
    return out;
  }

  function evTotal(evs) {
    return STATS.reduce((sum, k) => sum + (evs?.[k] || 0), 0);
  }

  /* --------------------------- sets --------------------------- */

  const DEFAULT_LEVEL = 100;

  /**
   * Normalise a partial set into a complete, self-consistent one.
   * Never silently "fixes" competitive legality — that is the validator's job.
   * It only fills in structural gaps (missing objects, missing nickname).
   */
  function normalizeSet(input = {}) {
    let s = Dex.species(input.species);
    /*
     * A set saved before 2026-08-16 can name a cosmetic forme as its *species*
     * — Magearna-Original and Keldeo-Resolute were selectable then. Rewrite it
     * to the real species and keep the appearance as a skin, so an old team
     * loads as the Pokémon it always was, still looking the way it did.
     * Silent because nothing about the set's behaviour changes: the two were
     * mechanically identical, which is the whole reason they became skins.
     */
    let skin = input.skin;
    if (s.cosmeticOf) { skin = s.id; s = Dex.species(s.cosmeticOf); }
    const level = clamp(Math.round(input.level ?? DEFAULT_LEVEL) || DEFAULT_LEVEL, 1, 100);
    const abilities = Dex.abilityList(s);
    const moves = (input.moves || []).map(m => (typeof m === 'string' ? Dex.toID(m) : Dex.toID(m?.id))).filter(Boolean).slice(0, 4);
    const set = {
      species: s.id,
      nickname: (input.nickname || '').slice(0, 18) || null,
      level,
      gender: input.gender || defaultGender(s),
      ability: input.ability && Dex.ability(input.ability) ? Dex.ability(input.ability).name : (abilities[0] || 'No Ability'),
      item: input.item ? (Dex.item(input.item)?.id || null) : null,
      nature: Dex.nature(input.nature || 'serious').id,
      teraType: input.teraType && Dex.TYPES.includes(input.teraType) ? input.teraType : (s.types[0] || 'Normal'),
      moves,
      evs: Object.assign(zeroStats(), input.evs || {}),
      ivs: Object.assign(maxIVs(), input.ivs || {}),
      happiness: input.happiness ?? 255,
      shiny: !!input.shiny,
      // Appearance only. Dropped rather than kept when it is not a legal skin
      // for this species, so a stale save cannot ask for a missing sprite.
      skin: Dex.isSkinOf(s.id, skin) && Dex.toID(skin) !== s.id ? Dex.toID(skin) : null,
    };
    for (const stat of STATS) {
      set.evs[stat] = clamp(Math.round(set.evs[stat] || 0), 0, 252);
      set.ivs[stat] = clamp(Math.round(set.ivs[stat] ?? 31), 0, 31);
    }
    return set;
  }

  function defaultGender(speciesValue) {
    const s = Dex.species(speciesValue);
    if (!s.genderRatio) return 'N';
    if (s.genderRatio.female >= 1) return 'F';
    if (s.genderRatio.male >= 1) return 'M';
    return 'M';
  }

  function randomGender(speciesValue, rng) {
    const s = Dex.species(speciesValue);
    if (!s.genderRatio) return 'N';
    return rng.next() < s.genderRatio.female ? 'F' : 'M';
  }

  function displayName(set) {
    return set.nickname || Dex.species(set.species).name;
  }

  /** Fills empty move slots with a sane level-up moveset (never illegal moves). */
  function fillMoves(set, {rng = null, level = set.level} = {}) {
    const s = Dex.species(set.species);
    const chosen = [...new Set(set.moves.filter(id => Dex.canLearn(s, id)))];
    if (chosen.length >= 4) return {...set, moves: chosen.slice(0, 4)};
    const pool = Dex.levelUpMoves(s, level).map(m => m.id).filter(id => Dex.hasMove(id));
    // Latest-learned moves first: they are usually the strongest available.
    for (let i = pool.length - 1; i >= 0 && chosen.length < 4; i--) {
      if (!chosen.includes(pool[i])) chosen.push(pool[i]);
    }
    if (chosen.length < 4) {
      const rest = Dex.legalMoveList(s).filter(id => !chosen.includes(id));
      const ordered = rng ? rng.shuffle(rest) : rest;
      for (const id of ordered) {
        if (chosen.length >= 4) break;
        chosen.push(id);
      }
    }
    if (!chosen.length) chosen.push('struggle');
    return {...set, moves: chosen.slice(0, 4)};
  }

  /* --------------------------- battle Pokémon --------------------------- */

  /**
   * @param {object} set persisted set
   * @param {object} [condition] carried-over `{currentHP, status, pp:{moveId:n}, toxicCounter}`
   */
  function createBattlePokemon(set, condition = null) {
    const normalized = normalizeSet(set);
    const s = Dex.species(normalized.species);
    const stats = calcStats(normalized);
    const moves = normalized.moves.map(id => {
      const m = Dex.move(id);
      const maxPP = Math.max(1, Math.floor((m.pp || 5) * 8 / 5));
      const carried = condition?.pp?.[id];
      return {id: m.id, pp: carried === undefined ? maxPP : clamp(carried, 0, maxPP), maxPP};
    });
    if (!moves.length) {
      const struggle = Dex.move('struggle');
      moves.push({id: struggle.id, pp: 1, maxPP: 1});
    }
    const maxHP = stats.hp;
    const pokemon = {
      uid: set.uid || newUid('m'),
      set: normalized,
      species: s.id,
      speciesData: s,
      /*
       * The chosen appearance, carried into battle so the field shows what the
       * player built. Purely a picture: nothing in the engine reads it, and a
       * forme change overwrites `species` without touching it, so a Magearna
       * wearing the Original skin still Mega Evolves into Magearna-Mega and is
       * drawn as Magearna-Mega while it does.
       */
      skin: normalized.skin || null,
      name: displayName(normalized),
      level: normalized.level,
      gender: normalized.gender,
      types: [...s.types],
      baseTypes: [...s.types],
      teraType: normalized.teraType,
      terastallized: false,
      stats,
      maxHP,
      currentHP: clamp(condition?.currentHP ?? maxHP, 0, maxHP),
      status: condition?.status ?? null,
      statusData: {toxicCounter: condition?.toxicCounter ?? 1, sleepTurns: 0},
      ability: normalized.ability,
      baseAbility: normalized.ability,
      abilityState: {},
      item: normalized.item,
      baseItem: normalized.item,
      consumedItem: null,
      moves,
      boosts: {atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0},
      volatiles: {},
      fainted: false,
      faintHandled: false,
      revealed: false,
      protectedThisTurn: false,
      lastMoveId: null,
      lastMoveFailed: false,
      usedMoveIds: [],
      damageTakenThisTurn: 0,
      lastDamageCategory: null,
      lastDamageSourceUid: null,
      timesHit: 0,
      statRaisedThisTurn: false,
      statLoweredThisTurn: false,
      hasActedThisTurn: false,
      activeSinceTurn: 0,
      activeTurns: 0,
      switchedInThisTurn: false,
      side: null,
      position: -1,
      ateBerry: false,
    };
    pokemon.fainted = pokemon.currentHP <= 0;
    return pokemon;
  }

  /** Snapshot of the mutable condition worth persisting between Campaign nodes. */
  function extractCondition(pokemon) {
    return {
      currentHP: pokemon.currentHP,
      status: pokemon.status,
      toxicCounter: pokemon.statusData?.toxicCounter ?? 1,
      pp: Object.fromEntries(pokemon.moves.map(m => [m.id, m.pp])),
    };
  }

  function fullyHealCondition(set) {
    const stats = calcStats(normalizeSet(set));
    return {
      currentHP: stats.hp,
      status: null,
      toxicCounter: 1,
      pp: Object.fromEntries((set.moves || []).map(id => {
        const m = Dex.move(id);
        return [m.id, Math.max(1, Math.floor((m.pp || 5) * 8 / 5))];
      })),
    };
  }

  /* --------------------------- EV helpers --------------------------- */

  const EV_PRESETS = {
    physicalSweeper: {atk: 252, spe: 252, hp: 4},
    specialSweeper: {spa: 252, spe: 252, hp: 4},
    physicalWall: {hp: 252, def: 252, spd: 4},
    specialWall: {hp: 252, spd: 252, def: 4},
    bulkyPhysical: {hp: 252, atk: 252, def: 4},
    bulkySpecial: {hp: 252, spa: 252, spd: 4},
    balanced: {hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84},
  };

  function applyEvPreset(set, presetName) {
    const preset = EV_PRESETS[presetName];
    if (!preset) return set;
    return {...set, evs: Object.assign(zeroStats(), preset)};
  }

  global.RedGPT.Pokemon = {
    EV_TOTAL_LIMIT, EV_STAT_LIMIT, EV_PRESETS,
    newUid, clamp, zeroStats, maxIVs,
    natureModifier, calcStat, calcStats, evTotal,
    normalizeSet, defaultGender, randomGender, displayName, fillMoves,
    createBattlePokemon, extractCondition, fullyHealCondition, applyEvPreset,
  };
})(typeof window !== 'undefined' ? window : globalThis);
