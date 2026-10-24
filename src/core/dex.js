/**
 * Read-only access layer over the packaged dataset in data/game-data.js.
 *
 * Everything downstream (battle engine, team builder, campaign, UI) resolves
 * species/moves/abilities/items through this module, so there is exactly one
 * place that knows the shape of the generated data and how sprites are named.
 */
(function (global) {
  'use strict';

  const DATA = global.REDGPT_DATA;
  if (!DATA) throw new Error('REDGPT_DATA is missing. data/game-data.js must load before src/core/dex.js.');

  const STATS = DATA.stats || ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
  const STAT_NAMES = DATA.statNames;
  const STAT_SHORT = {hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe'};

  const toID = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '');

  /**
   * Two species lists, deliberately.
   *
   * `packagedSpecies` is everything in the dataset and backs every lookup, so
   * the engine can always resolve a forme it transforms into.
   * `allSpecies` is what a player can pick: it drops `transformOnly` formes
   * (currently Greninja-Ash, which exists only as Battle Bond's result). Every
   * listing, count and format pool reads `allSpecies`, so a transform-only
   * forme cannot leak into the Pokédex, the Team Builder or a random team.
   */
  const packagedSpecies = DATA.pokemon;
  /*
   * `cosmeticOf` joins `transformOnly` here (2026-08-16). A cosmetic skin is a
   * different *picture* of a species that is mechanically identical to it and
   * that nothing can transform into — Magearna-Original and Keldeo-Resolute.
   * Listing it as its own species said there was a choice to make, and for
   * Magearna-Original there was: picking it silently gave up Mega Evolution,
   * because its Mega forme is not packaged. It is a `skin` on the set now.
   */
  const selectableSpecies = DATA.pokemon.filter(s => !s.transformOnly && !s.cosmeticOf);

  const speciesById = new Map();
  const speciesByName = new Map();
  for (const s of packagedSpecies) {
    speciesById.set(s.id, s);
    speciesByName.set(toID(s.name), s);
  }

  const moves = DATA.moves;
  const abilities = DATA.abilities;
  const items = DATA.items;
  const natures = DATA.natures;
  const typeChart = DATA.typeChart;
  const TYPES = Object.keys(typeChart).sort();

  const abilityByName = new Map(Object.values(abilities).map(a => [toID(a.name), a]));
  const itemByName = new Map(Object.values(items).map(i => [toID(i.name), i]));
  const moveByName = new Map(Object.values(moves).map(m => [toID(m.name), m]));
  const natureByName = new Map(Object.values(natures).map(n => [toID(n.name), n]));

  const UNKNOWN_SPECIES = Object.freeze({
    id: 'unknown', num: 0, name: 'Unknown', baseSpecies: 'Unknown', forme: null,
    types: ['Normal'], baseStats: {hp: 50, atk: 50, def: 50, spa: 50, spd: 50, spe: 50}, bst: 300,
    abilities: {0: 'No Ability'}, learnset: {tackle: 1}, front: null, back: null,
    powerClass: 'standard', evolutions: [], evos: [], prevo: null, genderRatio: null,
    weightKg: 10, heightM: 1, catchRate: 45, eggGroups: [], evYield: {}, missing: true,
  });

  const UNKNOWN_MOVE = Object.freeze({
    id: 'unknown', name: 'Unknown Move', type: 'Normal', category: 'Status', basePower: 0,
    accuracy: null, pp: 1, priority: 0, target: 'normal', flags: {}, desc: 'This move is not present in the packaged dataset.',
    shortDesc: 'Unavailable move.', missing: true,
  });

  function species(value) {
    if (!value) return UNKNOWN_SPECIES;
    if (typeof value === 'object' && value.baseStats) return value;
    const key = toID(value);
    return speciesById.get(key) || speciesByName.get(key) || UNKNOWN_SPECIES;
  }
  function hasSpecies(value) {
    const key = toID(value);
    return speciesById.has(key) || speciesByName.has(key);
  }
  function move(value) {
    if (!value) return UNKNOWN_MOVE;
    if (typeof value === 'object' && value.category) return value;
    const key = toID(value);
    return moves[key] || moveByName.get(key) || UNKNOWN_MOVE;
  }
  function hasMove(value) {
    const key = toID(value);
    return !!(moves[key] || moveByName.get(key));
  }
  function ability(value) {
    const key = toID(value);
    return abilities[key] || abilityByName.get(key) || null;
  }
  function item(value) {
    if (!value) return null;
    const key = toID(value);
    return items[key] || itemByName.get(key) || null;
  }
  function nature(value) {
    const key = toID(value || 'serious');
    return natures[key] || natureByName.get(key) || natures.serious;
  }

  /* ------------------------- cosmetic skins ------------------------- */

  /**
   * Every appearance this species can be drawn as, the default first.
   *
   * Returns at least one entry for any real species, so a caller can render the
   * picker off `skinsFor(x).length > 1` without a second lookup. A skin is a
   * packaged species id, which is what makes this cheap: every sprite accessor
   * already takes one, so nothing downstream needs a new code path.
   */
  function skinsFor(value) {
    const base = species(value);
    if (base.missing) return [];
    if (base.skins) return base.skins;
    return [{id: base.id, name: base.name, front: base.front, back: base.back}];
  }

  /** Is `skinId` a legal appearance for this species? The base always is. */
  function isSkinOf(speciesValue, skinId) {
    const id = toID(skinId);
    if (!id) return false;
    return skinsFor(speciesValue).some(skin => skin.id === id);
  }

  /**
   * The species id whose artwork a set should be drawn with.
   *
   * The single place that answers "which picture", so the Team Builder, the
   * party menu, the Pokédex and the battle field cannot disagree. Falls back to
   * the species whenever the skin is absent or no longer legal, which is what
   * makes an old save safe: a set carrying a skin that stopped existing draws
   * as its base rather than as a broken image.
   */
  function skinnedSpecies(set) {
    if (!set) return '';
    const speciesId = toID(set.species);
    return isSkinOf(speciesId, set.skin) ? toID(set.skin) : speciesId;
  }

  /* ------------------------- sprites ------------------------- */

  const encodePath = p => (p ? encodeURI(p) : '');
  const spriteFront = s => (species(s).front ? encodePath(`Assets/Sprites/Pokemon Sprites/Front/${species(s).front}`) : '');
  const spriteBack = s => (species(s).back ? encodePath(`Assets/Sprites/Pokemon Sprites/Back/${species(s).back}`) : '');
  const spriteItem = i => {
    const it = item(i);
    return it?.sprite ? encodePath(`Assets/Sprites/Items/${it.sprite}`) : '';
  };
  const spriteTrainer = file => (file ? encodePath(`Assets/Sprites/Trainer Sprites/${file}`) : '');
  const spriteBackground = file => (file ? encodePath(`Assets/Battle Backgrounds/${file}`) : '');
  const spriteType = type => (type ? encodePath(`Assets/Sprites/Types/${type}.png`) : '');
  /**
   * The species' cry, or '' when it has none.
   *
   * A path only — playing it is a UI concern, because nothing below `src/ui`
   * may touch the DOM or a browser API. Formes share their base species' cry by
   * build-time resolution rather than by a runtime fallback here, so this stays
   * a plain lookup like every sprite accessor beside it.
   */
  const cry = s => (species(s).cry ? encodePath(`Assets/Audio/Cries/${species(s).cry}`) : '');
  const spriteCategory = category => (category ? encodePath(`Assets/Sprites/Categories/${category}.png`) : '');

  /* ------------------------- type maths ------------------------- */

  function typeEffectiveness(attackType, defenderTypes) {
    const row = typeChart[attackType];
    if (!row) return 1;
    return (defenderTypes || []).reduce((total, t) => total * (row[t] ?? 1), 1);
  }

  /** Defensive profile of a type combination: `{Fire: 2, Water: 0.5, ...}`. */
  function defensiveProfile(defenderTypes) {
    const out = {};
    for (const attack of TYPES) out[attack] = typeEffectiveness(attack, defenderTypes);
    return out;
  }

  /* ------------------------- learnsets ------------------------- */

  function learnset(speciesValue) {
    return species(speciesValue).learnset || {};
  }
  function canLearn(speciesValue, moveValue) {
    const ls = learnset(speciesValue);
    const id = toID(move(moveValue).id || moveValue);
    return Object.prototype.hasOwnProperty.call(ls, id);
  }
  /** Moves learned by level-up at or below `level`, most recent first. */
  function levelUpMoves(speciesValue, level) {
    return Object.entries(learnset(speciesValue))
      .filter(([, lv]) => lv > 0 && lv <= level)
      .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
      .map(([id, lv]) => ({id, level: lv}));
  }
  function movesLearnedAt(speciesValue, level) {
    return Object.entries(learnset(speciesValue))
      .filter(([, lv]) => lv === level)
      .map(([id]) => id);
  }
  function legalMoveList(speciesValue) {
    return Object.keys(learnset(speciesValue)).filter(hasMove).sort((a, b) => move(a).name.localeCompare(move(b).name));
  }

  function abilityList(speciesValue) {
    const s = species(speciesValue);
    return [...new Set(Object.values(s.abilities || {}))].filter(Boolean);
  }
  function hasAbility(speciesValue, abilityValue) {
    return abilityList(speciesValue).some(a => toID(a) === toID(abilityValue));
  }

  /* ------------------------- evolution ------------------------- */

  function evolutions(speciesValue) {
    return species(speciesValue).evolutions || [];
  }
  function evolutionRoot(speciesValue) {
    let current = species(speciesValue);
    const seen = new Set();
    while (current.prevo && !seen.has(current.id)) {
      seen.add(current.id);
      const prev = species(current.prevo);
      if (!prev || prev.missing) break;
      current = prev;
    }
    return current;
  }
  function evolutionFamily(speciesValue) {
    const root = evolutionRoot(speciesValue);
    const out = [];
    const walk = (node, depth, seen) => {
      out.push({species: node, depth});
      for (const rule of evolutions(node)) {
        if (seen.has(rule.target)) continue;
        const next = species(rule.target);
        if (next.missing) continue;
        walk(next, depth + 1, new Set([...seen, rule.target]));
      }
    };
    walk(root, 0, new Set([root.id]));
    return out;
  }
  /** How many evolutions remain ahead of this species. */
  function evolutionStagesRemaining(speciesValue) {
    let best = 0;
    const walk = (node, depth, seen) => {
      best = Math.max(best, depth);
      for (const rule of evolutions(node)) {
        if (seen.has(rule.target)) continue;
        walk(species(rule.target), depth + 1, new Set([...seen, rule.target]));
      }
    };
    walk(species(speciesValue), 0, new Set([species(speciesValue).id]));
    return best;
  }
  function evolutionLabel(rule) {
    if (!rule) return '';
    if (rule.method === 'level') return `Level ${rule.level}${rule.adapted ? ' (adapted)' : ''}`;
    if (rule.method === 'item') return `Use ${rule.itemName || item(rule.item)?.name || rule.item}`;
    return 'Special';
  }

  /* ------------------------- search indexes ------------------------- */

  const searchIndex = selectableSpecies.map(s => ({
    id: s.id,
    name: s.name,
    search: `${s.name} ${s.baseSpecies} ${s.types.join(' ')} ${abilityList(s).join(' ')}`.toLowerCase(),
    types: s.types,
    bst: s.bst,
    num: s.num,
    gen: s.gen,
    powerClass: s.powerClass,
  }));

  const moveSearchIndex = Object.values(moves).map(m => ({
    id: m.id,
    name: m.name,
    search: `${m.name} ${m.type} ${m.category}`.toLowerCase(),
    type: m.type,
    category: m.category,
    basePower: m.basePower,
  }));

  const itemSearchIndex = Object.values(items).map(i => ({
    id: i.id,
    name: i.name,
    search: `${i.name} ${i.shortDesc}`.toLowerCase(),
  }));

  const abilitySearchIndex = Object.values(abilities).map(a => ({
    id: a.id,
    name: a.name,
    search: `${a.name} ${a.shortDesc}`.toLowerCase(),
  }));

  const speciesByType = {};
  for (const t of TYPES) speciesByType[t] = selectableSpecies.filter(s => s.types.includes(t)).map(s => s.id);

  global.RedGPT = global.RedGPT || {};
  global.RedGPT.Dex = {
    raw: DATA,
    meta: DATA.meta,
    STATS, STAT_NAMES, STAT_SHORT, TYPES,
    toID,
    species, hasSpecies, allSpecies: selectableSpecies, packagedSpecies,
    skinsFor, isSkinOf, skinnedSpecies,
    move, hasMove, allMoves: moves,
    ability, allAbilities: abilities,
    item, allItems: items,
    nature, allNatures: natures,
    typeChart, typeEffectiveness, defensiveProfile,
    learnset, canLearn, levelUpMoves, movesLearnedAt, legalMoveList,
    abilityList, hasAbility,
    evolutions, evolutionRoot, evolutionFamily, evolutionStagesRemaining, evolutionLabel,
    spriteFront, spriteBack, spriteItem, spriteTrainer, spriteBackground, spriteType, spriteCategory, cry,
    searchIndex, moveSearchIndex, itemSearchIndex, abilitySearchIndex, speciesByType,
  };
})(typeof window !== 'undefined' ? window : globalThis);
