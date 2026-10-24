/*
 * Engine-resolved competitive profiles, shared by the tiering briefings.
 *
 * THE RULE: ask the engine, never the packaged row. A movepool summary built
 * from `move.type` / `move.basePower` is wrong for every move this project
 * resolves at use time, and that has twice nearly decided a tier.
 *
 * TWO DEFECTS THIS MODULE EXISTS TO FIX, both found on 2026-08-16 while
 * assembling the final UU evidence packet:
 *
 * 1. **The category filter compared BASE Attack to BASE Special Attack**, so a
 *    Huge Power holder had its whole physical movepool hidden. Mega Starmie is
 *    100 Atk / 130 SpA on paper and **656 Atk / 394 SpA** once the ability is
 *    applied — and measured, its physical Waterfall does 60.8-71.6% to a
 *    252/252 Blissey against Hydro Pump's 23.5-27.6%. The profile showed the
 *    special half. It now compares the stats the ENGINE computes with the
 *    ability live, at max investment.
 *
 * 2. **The `-ate` abilities were not applied.** They convert in `onModifyMove`
 *    rather than in `battle.moveType` (PROJECT_CONTEXT §8), so Pixilate's Hyper
 *    Voice read Normal/90 instead of **Fairy/117**. `Abilities.displayMoveType`
 *    and `displayBasePower` are the project's own answer to exactly this and are
 *    what the move buttons use; the profiler asks them now.
 */
'use strict';

function createProfiler(R) {
  const {Dex, Formats, Mechanics, Calculator, Abilities, Pokemon} = R;

  const HAZARD_SIDE_CONDITIONS = new Set(['stealthrock', 'spikes', 'toxicspikes', 'stickyweb']);
  const EXTRA_RECOVERY = new Set(['rest']);
  const PHAZING = new Set(['whirlwind', 'roar', 'dragontail', 'circlethrow']);
  const CLERIC = new Set(['healbell', 'aromatherapy', 'wish', 'lifedew', 'floralhealing', 'junglehealing']);
  const TRAPPING = new Set(['meanlook', 'block', 'spiderweb', 'jawlock', 'anchorshot', 'spiritshackle', 'thousandwaves']);
  const STATUS_MOVES = new Set(['toxic', 'willowisp', 'thunderwave', 'glare', 'nuzzle', 'spore', 'sleeppowder',
    'hypnosis', 'yawn', 'stunspore', 'poisonpowder', 'darkvoid', 'lovelykiss', 'sing', 'grasswhistle', 'toxicthread']);
  const NOTABLE_UTILITY = new Set(['taunt', 'encore', 'disable', 'substitute', 'protect', 'detect', 'reflect',
    'lightscreen', 'auroraveil', 'trickroom', 'tailwind', 'trick', 'switcheroo', 'destinybond', 'haze', 'clearsmog',
    'painsplit', 'leechseed', 'perishsong', 'knockoff', 'memento', 'healingwish', 'partingshot', 'chillyreception',
    'courtchange', 'magiccoat', 'gravity', 'safeguard', 'batonpass', 'defog', 'rapidspin', 'tidyup', 'mortalspin']);
  const WEATHER_TERRAIN = new Set(['raindance', 'sunnyday', 'sandstorm', 'snowscape', 'hail', 'chillyreception',
    'electricterrain', 'grassyterrain', 'mistyterrain', 'psychicterrain']);

  const BANNED = tier => new Set((Formats.get('tier' + String(tier).toLowerCase()).rules.bannedMoves || []).map(Dex.toID));

  /** A battle Pokémon as the entry is actually reached, at a chosen spread. */
  function build(entry, {nature = 'serious', evs = {}} = {}) {
    const species = Dex.species(entry.id);
    const set = {
      species: species.id, level: 100, nature, evs, ivs: Pokemon.maxIVs(),
      ability: abilityOf(entry),
      item: species.requiredItem ? Dex.toID(species.requiredItem) : (entry.kind === 'forme' ? entry.item : null),
      moves: ['tackle'],
    };
    const foe = {species: 'blissey', level: 100, nature: 'serious', evs: {}, ivs: Pokemon.maxIVs(), moves: ['softboiled']};
    return Calculator.buildBattle({set}, {set: foe}, {});
  }

  /** A forme's ability is fixed; a species keeps its whole list. */
  function abilityOf(entry) {
    return entry.ability && Dex.ability(entry.ability)
      ? Dex.ability(entry.ability).name : Dex.abilityList(entry.id)[0];
  }
  function abilitiesOf(entry) {
    return entry.kind === 'forme' ? [Dex.abilityList(entry.id)[0]] : Dex.abilityList(entry.id);
  }

  /**
   * Offensive stats the ENGINE computes with the ability live, at max
   * investment — the number that decides whether a physical movepool matters.
   */
  function offence(entry, ability) {
    const withAbility = (nature, evs, stat) => {
      const species = Dex.species(entry.id);
      const set = {
        species: species.id, level: 100, nature, evs, ivs: Pokemon.maxIVs(), ability,
        item: species.requiredItem ? Dex.toID(species.requiredItem) : (entry.kind === 'forme' ? entry.item : null),
        moves: ['tackle'],
      };
      const {battle, attacker} = Calculator.buildBattle({set},
        {set: {species: 'blissey', level: 100, evs: {}, ivs: Pokemon.maxIVs(), moves: ['softboiled']}}, {});
      return battle.getStat(attacker, stat);
    };
    return {
      atkNeutral: withAbility('serious', {atk: 252}, 'atk'),
      atkPlus: withAbility('adamant', {atk: 252}, 'atk'),
      spaNeutral: withAbility('serious', {spa: 252}, 'spa'),
      spaPlus: withAbility('modest', {spa: 252}, 'spa'),
      speNeutral: withAbility('serious', {spe: 252}, 'spe'),
      spePlus: withAbility('jolly', {spe: 252}, 'spe'),
    };
  }

  /** Every legal move, with the values the engine will actually deliver. */
  function movesOf(entry, {tier = 'UU', ability = null} = {}) {
    const species = Dex.species(entry.id);
    const source = entry.kind === 'forme' && entry.base ? Dex.toID(entry.base) : species.id;
    const banned = BANNED(tier);
    const ab = ability || abilityOf(entry);
    const {battle, attacker, defender} = build(entry);

    return (Dex.legalMoveList(source) || []).filter(id => !banned.has(Dex.toID(id))).map(id => {
      const packaged = Dex.move(id);
      if (!packaged || packaged.missing) return null;
      const copy = Object.assign({}, packaged, {flags: Object.assign({}, packaged.flags)});
      let type = packaged.type, category = packaged.category, power = packaged.basePower;
      try { type = battle.moveType(attacker, defender, copy); } catch { /* keep */ }
      try { category = battle.moveCategory(attacker, copy) || category; } catch { /* keep */ }
      try { power = battle.dynamicBasePower(attacker, defender, copy, {preview: true}); } catch { /* keep */ }
      /*
       * The `-ate` layer, which lives in `onModifyMove` and so is invisible to
       * `moveType`. Only applied when it actually changes something, so a
       * non-`-ate` ability leaves the engine's answer alone.
       */
      try {
        const shown = Abilities.displayMoveType(ab, packaged);
        const shownPower = Abilities.displayBasePower(ab, packaged);
        if (shown && shown !== packaged.type) { type = shown; if (shownPower) power = shownPower; }
        else if (shownPower && shownPower !== packaged.basePower && power === packaged.basePower) power = shownPower;
      } catch { /* keep */ }

      const hits = Array.isArray(packaged.multihit) ? 3.1 : (typeof packaged.multihit === 'number' ? packaged.multihit : 1);
      return {
        id, name: packaged.name, type, category, power, hits,
        accuracy: packaged.accuracy,
        priority: (packaged.priority || 0) + (Mechanics.ENGINE_PRIORITY.has(id) ? 1 : 0),
        multihit: packaged.multihit || null,
        packagedType: packaged.type, packagedPower: packaged.basePower,
        fixed: Mechanics.FIXED_DAMAGE_MOVES.has(id),
        damaging: category !== 'Status',
        setup: category === 'Status' && packaged.boosts && Object.values(packaged.boosts).some(v => v > 0)
          && /^(self|adjacentAllyOrSelf)$/.test(packaged.target || ''),
        recovery: (packaged.heal && packaged.target === 'self') || packaged.drain || EXTRA_RECOVERY.has(id),
        reliableRecovery: (packaged.heal && packaged.target === 'self') || EXTRA_RECOVERY.has(id),
        hazard: HAZARD_SIDE_CONDITIONS.has(String(packaged.sideCondition || '')),
        removal: Mechanics.HAZARD_REMOVAL_MOVES.has(id),
        pivot: Mechanics.SELF_SWITCH_MOVES.has(id),
        phazing: PHAZING.has(id),
        cleric: CLERIC.has(id),
        trapping: TRAPPING.has(id),
        status: STATUS_MOVES.has(id),
        weatherTerrain: WEATHER_TERRAIN.has(id),
        utility: NOTABLE_UTILITY.has(id),
        recharge: Mechanics.RECHARGE_MOVES.has(id),
        charge: Mechanics.CHARGE_MOVES.has(id),
        effectivePower: power * (hits > 1 ? hits : 1),
      };
    }).filter(Boolean);
  }

  function powerLabel(m) {
    const tag = m.charge ? ' (charge)' : '';
    if (m.fixed && !m.power) return 'fixed' + tag;
    if (Array.isArray(m.multihit)) return `${m.power}x${m.multihit[0]}-${m.multihit[1]}${tag}`;
    if (typeof m.multihit === 'number') return `${m.power}x${m.multihit}${tag}`;
    return String(m.power) + tag;
  }
  const shortCat = c => (c === 'Physical' ? 'P' : c === 'Special' ? 'S' : '');
  const names = list => [...new Set(list.map(m => m.name))].sort();

  /** The structured profile. Rendering is the caller's business. */
  function profile(entry, {tier = 'UU'} = {}) {
    const species = Dex.species(entry.id);
    const abilities = abilitiesOf(entry);
    const ability = abilityOf(entry);
    const moves = movesOf(entry, {tier, ability});
    /*
     * Offence is measured for EVERY ability the entry may run, and the category
     * decision uses the best of them. Azumarill's slot 0 is Thick Fat and its
     * defining ability is Huge Power — profiling slot 0 alone hides a doubled
     * Attack stat exactly the way Mega Starmie's was hidden.
     */
    const offByAbility = {};
    for (const a of abilities) offByAbility[a] = offence(entry, a);
    const off = offByAbility[ability];
    const bestAtk = Math.max(...abilities.map(a => Math.max(offByAbility[a].atkNeutral, offByAbility[a].atkPlus)));
    const bestSpa = Math.max(...abilities.map(a => Math.max(offByAbility[a].spaNeutral, offByAbility[a].spaPlus)));
    const ratio = bestAtk / Math.max(1, bestSpa);
    const wantsPhysical = ratio >= 0.75;
    const wantsSpecial = ratio <= 1 / 0.75;
    const usable = m => (m.category === 'Physical' && wantsPhysical) || (m.category === 'Special' && wantsSpecial);

    const damaging = moves.filter(m => m.damaging && (m.power > 0 || m.fixed) && !m.recharge);
    // Charge moves lose ties: Dive and Waterfall are both 80, and quoting Dive
    // as the Water STAB is misleading when Waterfall costs nothing.
    const best = list => list.slice().sort((a, b) =>
      (b.effectivePower - a.effectivePower) || ((a.charge ? 1 : 0) - (b.charge ? 1 : 0)));
    const fmt = m => `${m.type} ${m.name} ${powerLabel(m)}${shortCat(m.category)}`;

    const stab = [];
    for (const type of species.types) {
      const all = best(damaging.filter(m => m.type === type));
      const right = all.filter(usable);
      const pick = right[0] || all[0];
      if (pick) stab.push(fmt(pick) + (right[0] ? '' : ' **(wrong category)**'));
    }
    const coverageOf = category => {
      const byType = new Map();
      for (const m of best(damaging.filter(m => m.category === category && !species.types.includes(m.type)))) {
        if (!byType.has(m.type)) byType.set(m.type, m);
      }
      return [...byType.values()].slice(0, 6).map(fmt);
    };

    return {
      entry, species, abilities, ability, off, offByAbility, moves,
      wantsPhysical, wantsSpecial,
      stab,
      physical: coverageOf('Physical'),
      special: coverageOf('Special'),
      setup: names(moves.filter(m => m.setup)),
      recovery: names(moves.filter(m => m.reliableRecovery)),
      drain: names(moves.filter(m => m.recovery && !m.reliableRecovery)),
      priority: best(moves.filter(m => m.priority > 0 && m.damaging && m.power > 0 && !m.recharge))
        .slice(0, 4).map(m => `${m.name} ${powerLabel(m)}${shortCat(m.category)} ${m.type} (+${m.priority})`),
      hazards: names(moves.filter(m => m.hazard)),
      removal: names(moves.filter(m => m.removal)),
      pivot: names(moves.filter(m => m.pivot)),
      phazing: names(moves.filter(m => m.phazing)),
      status: names(moves.filter(m => m.status)),
      cleric: names(moves.filter(m => m.cleric)),
      trapping: names(moves.filter(m => m.trapping)),
      weatherTerrain: names(moves.filter(m => m.weatherTerrain)),
      utility: names(moves.filter(m => m.utility && !m.removal && !m.pivot)),
      has: id => moves.some(m => m.id === id),
    };
  }

  return {profile, movesOf, offence, abilityOf, abilitiesOf, powerLabel, shortCat, build};
}

module.exports = {createProfiler};
