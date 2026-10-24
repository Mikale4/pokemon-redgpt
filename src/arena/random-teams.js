/**
 * Random team and random set generation.
 *
 * Sets are built role-first: the species' base stats decide whether it is a
 * physical attacker, special attacker, wall, bulky pivot or setup sweeper, and
 * the moveset, ability, item, nature and EV spread all follow from that role.
 * A physically-biased Pokémon will not be handed four special attacks.
 *
 * Team assembly then applies composition rules — type diversity, one hazard
 * setter, at most one of each redundant role — so a generated team plays like a
 * team rather than six unrelated Pokémon.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Dex = RedGPT.Dex;
  const PokemonLib = RedGPT.Pokemon;
  const Formats = RedGPT.Formats;

  const SETUP_PHYSICAL = ['swordsdance', 'dragondance', 'bulkup', 'honeclaws', 'shiftgear', 'victorydance', 'coil', 'filletaway'];
  const SETUP_SPECIAL = ['nastyplot', 'calmmind', 'quiverdance', 'tailglow', 'workup', 'torchsong'];
  const SETUP_SPEED = ['agility', 'rockpolish', 'autotomize'];
  const RECOVERY = ['recover', 'roost', 'softboiled', 'milkdrink', 'slackoff', 'synthesis', 'moonlight', 'morningsun', 'shoreup', 'strengthsap', 'junglehealing', 'rest'];
  const HAZARDS = ['stealthrock', 'spikes', 'toxicspikes', 'stickyweb'];
  const REMOVAL = ['defog', 'rapidspin', 'mortalspin', 'tidyup'];
  const STATUS_MOVES = ['thunderwave', 'willowisp', 'toxic', 'glare', 'nuzzle', 'spore', 'sleeppowder', 'yawn', 'leechseed', 'taunt', 'encore'];
  const PIVOTS = ['uturn', 'voltswitch', 'flipturn', 'partingshot', 'teleport'];
  const SCREENS = ['reflect', 'lightscreen', 'auroraveil'];
  const PROTECTS = ['protect', 'detect', 'kingsshield', 'silktrap', 'spikyshield', 'banefulbunker'];

  /** Moves that are traps for a generated set. */
  const AVOID = new Set(['struggle', 'splash', 'celebrate', 'holdhands', 'teatime', 'happyhour', 'sketch',
    'metronome', 'assist', 'mirrormove', 'copycat', 'naturepower', 'transform', 'conversion', 'conversion2',
    'bide', 'razorwind', 'skullbash', 'skydrop', 'lastresort', 'belch', 'snore', 'spitup',
    'swallow', 'stockpile', 'refresh', 'purify', 'aromaticmist', 'floralhealing', 'healpulse', 'lifedew',
    'followme', 'ragepowder', 'helpinghand', 'allyswitch', 'coaching', 'decorate', 'aurawheel', 'doubleshock',
    'burnup', 'mimic', 'psywave', 'sonicboom', 'dragonrage', 'guillotine', 'horndrill', 'fissure', 'sheercold',
    'selfdestruct', 'explosion', 'memento', 'healingwish', 'lunardance', 'finalgambit', 'destinybond',
    'perishsong', 'doubleteam', 'minimize', 'flash', 'sandattack', 'smokescreen', 'growl', 'tailwhip',
    'leer', 'harden', 'withdraw', 'defensecurl', 'charm', 'confide', 'captivate', 'attract', 'meanlook',
    'block', 'spiderweb', 'foresight', 'odorsleuth', 'miracleeye', 'gastroacid', 'worryseed', 'entrainment',
    'simplebeam', 'roleplay', 'skillswap', 'powersplit', 'guardsplit', 'painsplit', 'psychup', 'haze',
    'mist', 'safeguard', 'luckychant', 'magiccoat', 'snatch', 'grudge', 'spite', 'curse', 'nightmare',
    'trumpcard', 'wringout', 'crushgrip', 'naturalgift', 'fling', 'recycle', 'bestow', 'camouflage',
    'steelroller', 'counter', 'mirrorcoat', 'metalburst', 'comeuppance', 'endeavor', 'beatup',
    // Poltergeist and Dream Eater were listed here *because* of conditions the
    // project has since removed (see `battle.moveSpecialFailure`): Poltergeist no
    // longer needs the target to hold an item and Dream Eater no longer needs it
    // asleep, so both are now ordinary strong attacks and are generated normally.
    'lastrespects', 'assurance', 'payback', 'avalanche', 'revenge']);

  /** Physical moves that only make sense with specific setups. */
  const NICHE = new Set(['rollout', 'iceball', 'furycutter', 'echoedvoice', 'round', 'presentmove', 'present']);

  /**
   * Moves whose positive priority the **engine** applies rather than the data.
   *
   * Grassy Glide's +1 is added in `runTurn` with no Grassy Terrain check, so the
   * packaged move still reads priority 0 (PROJECT_CONTEXT §5 — "read the engine, not
   * the data"). Anything filtering on `move.priority` alone silently misses it.
   *
   * Declared once in `Mechanics` and read here, rather than kept as a local copy:
   * the tiering profiler needs the same answer, and a second list is how the two
   * drift.
   */
  const ENGINE_PRIORITY = RedGPT.Mechanics.ENGINE_PRIORITY;

  /**
   * Positive-priority moves that are still not *attacking* picks, so they must not
   * take the priority slot from a real one.
   *
   * - **Feint** is a 50 BP Normal move whose only merit is breaking Protect. Left
   *   unfiltered it outranked Bullet Punch on a Technician Scizor purely on base
   *   power, which is the opposite of the intent.
   * - **Fake Out** keeps its first-turn restriction in this project (§5), so it does
   *   not provide the "this resolves whatever the foe does" guarantee that makes the
   *   slot worth spending.
   */
  const PRIORITY_EXCLUDE = new Set(['feint', 'fakeout']);

  function accuracyWeight(move) {
    const accuracy = move.accuracy == null ? 100 : move.accuracy;
    return accuracy / 100;
  }

  /** Effective power for set-building: accuracy, multihit and drawbacks folded in. */
  function movePower(move) {
    let power = move.basePower || 0;
    if (Array.isArray(move.multihit)) power *= 3;
    else if (typeof move.multihit === 'number') power *= move.multihit;
    if (move.id === 'return' || move.id === 'frustration') power = 102;
    if (move.id === 'facade') power = 70;
    if (move.id === 'gyroball' || move.id === 'electroball') power = 70;
    if (move.id === 'flail' || move.id === 'reversal') power = 70;
    if (['eruption', 'waterspout', 'dragonenergy'].includes(move.id)) power = 110;
    if (move.recoil) power *= 0.92;
    if (move.selfdestruct) power *= 0.35;
    if (RedGPT.BattleConstants.CHARGE_MOVES.has(move.id)) power *= 0.5;
    // A recharge turn costs roughly as much as the extra power buys.
    if (RedGPT.BattleConstants.RECHARGE_MOVES.has(move.id)) power *= 0.45;
    /*
     * Delayed damage is not 120 BP of pressure. Future Sight lands two turns later,
     * which the set-builder cannot plan around — and taken at face value it was the
     * *highest-power Psychic move in the game*, so it was chosen as Mewtwo's STAB
     * ahead of Psystrike and Psychic. Discounted like a recharge move.
     */
    if (move.id === 'futuresight' || move.id === 'doomdesire') power *= 0.45;
    if (move.boosts && move.target === 'self' && Object.values(move.boosts).some(v => v < 0)) power *= 0.9;
    return power * accuracyWeight(move);
  }

  function classifyRole(species, rng) {
    const s = species.baseStats;
    const physical = s.atk;
    const special = s.spa;
    const bulk = s.hp + s.def + s.spd;
    const speed = s.spe;
    const offense = Math.max(physical, special);

    const offensiveBias = physical === special ? 'mixed' : (physical > special ? 'physical' : 'special');
    const fast = speed >= 95;
    const bulky = bulk >= 300;
    const frail = bulk < 250;

    if (offense < 70 && bulk >= 290) return {id: 'wall', bias: offensiveBias, fast: false};
    if (bulky && offense >= 90) return {id: rng.chance(0.5) ? 'bulkyattacker' : 'setup', bias: offensiveBias, fast};
    if (fast && offense >= 95) return {id: rng.chance(0.3) ? 'setup' : 'sweeper', bias: offensiveBias, fast: true};
    if (frail && offense >= 95) return {id: 'sweeper', bias: offensiveBias, fast};
    if (offense >= 85) return {id: 'bulkyattacker', bias: offensiveBias, fast};
    // A Pokémon with neither offence nor bulk still has to threaten something;
    // handing it a support kit would leave it with no way to win a 1v1.
    return {id: bulk >= 280 ? 'support' : 'bulkyattacker', bias: offensiveBias, fast};
  }

  function pickAbility(species, rng, format) {
    /*
     * A forme-producing ability the format refuses is dropped from the pool
     * rather than generated and then reported illegal — a generated team has to
     * be legal in the format it was generated for. Zygarde-10% in RU keeps Aura
     * Break and never rolls Power Construct.
     */
    const banned = format
      ? new Set(Formats.illegalFormeAbilities(species, format).map(f => f.ability))
      : new Set();
    const all = Dex.abilityList(species);
    const options = banned.size ? all.filter(name => !banned.has(Dex.toID(name))) : all;
    if (options.length <= 1) return options[0] || all[0] || 'No Ability';
    const scored = options.map(name => {
      const ability = Dex.ability(name);
      let rating = ability?.rating ?? 0;
      if (!RedGPT.Abilities.registry[Dex.toID(name)]) rating -= 2.5; // unimplemented abilities are dead weight
      return {name, rating};
    }).sort((a, b) => b.rating - a.rating);
    // Usually the best ability; occasionally the runner-up for variety.
    if (scored.length > 1 && scored[1].rating >= scored[0].rating - 0.5 && rng.chance(0.35)) return scored[1].name;
    return scored[0].name;
  }

  function chooseMoves(species, role, rng, format) {
    const legal = Dex.legalMoveList(species)
      .map(id => Dex.move(id))
      .filter(m => m && !m.missing && !AVOID.has(m.id) && !NICHE.has(m.id) && m.id !== 'hiddenpower');
    const banned = new Set((format.rules.bannedMoves || []).map(Dex.toID));
    /*
     * A generated team must be legal in the format it was generated for, so the
     * forme-move gate applies here as well as in the validator — the same
     * reason `pickAbility` drops a forme-producing ability. Without it a
     * random NU team could roll Relic Song onto Meloetta and become an RU forme.
     */
    const formeBanned = new Set(
      (global.RedGPT.Formats?.illegalFormeMoves?.(species, format) || []).map(f => f.move));
    const pool = legal.filter(m => !banned.has(m.id) && !formeBanned.has(m.id));
    if (!pool.length) return ['tackle'];

    const attackKey = role.bias === 'special' ? 'Special' : 'Physical';
    const offStat = role.bias === 'special' ? 'spa' : 'atk';
    const mixed = role.bias === 'mixed';

    const damaging = pool.filter(m => m.category !== 'Status' && (m.basePower || 0) > 0);
    // Body Press and Foul Play scale off stats the Pokémon may not invest in,
    // so they are only offered when they actually beat the normal attack stat.
    const bs = species.baseStats;
    const usable = damaging.filter(m => {
      if (m.id === 'bodypress') return bs.def > bs[offStat] + 20;
      if (m.id === 'foulplay') return bs.atk < 70 && bs.spa < 90;
      if (m.id === 'gyroball') return bs.spe <= 45;
      if (m.id === 'electroball') return bs.spe >= 100;
      if (m.id === 'terrainpulse' || m.id === 'weatherball') return true;
      return mixed || m.category === attackKey;
    });

    const chosen = [];
    const chosenTypes = new Set();

    const addMove = id => {
      if (!id) return false;
      const move = Dex.move(id);
      if (!move || move.missing || chosen.includes(move.id)) return false;
      if (chosen.length >= 4) return false;
      chosen.push(move.id);
      if (move.category !== 'Status') chosenTypes.add(move.type);
      return true;
    };

    // 1. Best STAB attack in the preferred category.
    const stabPool = usable.filter(m => species.types.includes(m.type));
    stabPool.sort((a, b) => movePower(b) - movePower(a));
    if (stabPool[0]) addMove(stabPool[0].id);
    // Second STAB from the other type, when the typing offers one.
    const secondStab = stabPool.find(m => !chosenTypes.has(m.type));
    if (secondStab) addMove(secondStab.id);

    // 2. Role-defining utility.
    const has = id => pool.some(m => m.id === id);
    const firstOf = list => list.find(has);

    if (role.id === 'setup') {
      const setupList = role.bias === 'special' ? SETUP_SPECIAL : role.bias === 'physical' ? SETUP_PHYSICAL : [...SETUP_PHYSICAL, ...SETUP_SPECIAL];
      const setup = firstOf(rng.shuffle(setupList)) || firstOf(SETUP_SPEED);
      addMove(setup);
    }
    if (role.id === 'wall' || role.id === 'support') {
      addMove(firstOf(RECOVERY));
      const utility = firstOf(rng.shuffle([...HAZARDS, ...STATUS_MOVES, ...REMOVAL]));
      addMove(utility);
    }
    if (role.id === 'bulkyattacker') {
      if (rng.chance(0.5)) addMove(firstOf(RECOVERY));
      else addMove(firstOf(rng.shuffle([...STATUS_MOVES, ...PIVOTS, ...HAZARDS])));
    }
    if (role.id === 'sweeper' && rng.chance(0.35)) {
      addMove(firstOf(rng.shuffle(PIVOTS)));
    }

    /*
     * 2b. A priority attack is a slot of its own, not a STAB competing on power.
     *
     * Five moves in this project have **unconditional** positive priority (§5:
     * Sucker Punch, Thunderclap, First Impression, Upper Hand, Grassy Glide), which
     * makes them the answer to a faster attacker that would otherwise knock you out
     * before you move — the single most valuable thing a set can carry, and worth
     * far more than raw power suggests. They were unreachable: step 1 takes the
     * highest-`movePower` STAB per type and dedupes by type, so a Kingambit's
     * Kowtow Cleave (85) always beat Sucker Punch (80) and Sucker Punch could then
     * never be the second STAB either. Measured 0 of 40 generated sets for Sucker
     * Punch, Bullet Punch, Grassy Glide and Upper Hand alike; the only priority
     * moves that appeared were the ones that happened to *also* be their type's
     * strongest STAB (Brave Bird, First Impression).
     *
     * Giving it its own slot rather than a power bonus is deliberate: inflating
     * `movePower` would make Sucker Punch *replace* Kowtow Cleave as the main Dark
     * STAB, which is worse than not having it. The set wants both.
     *
     * Walls and support sets are excluded — they win by outlasting, not revenging.
     */
    const wantsPriority = !['wall', 'support'].includes(role.id) && rng.chance(0.7);
    if (wantsPriority) {
      /*
       * Technician turns a 40 BP priority jab into 60, which is the whole reason
       * Bullet Punch is a premium move on Scizor rather than filler. The ability is
       * picked *after* the moves, so this asks whether the species can have it at
       * all — a Scizor that rolls Swarm keeps the move, which is a far smaller error
       * than never generating it. Without this the floor excluded every 40 BP jab,
       * which is right for Quick Attack on a Raichu and wrong for Scizor.
       */
      const technician = Dex.abilityList(species).some(a => Dex.toID(a) === 'technician');
      const power = m => movePower(m) * (technician && (m.basePower || 0) <= 60 ? 1.5 : 1);
      // STAB tiebreak, matching the coverage step: Bullet Punch over Quick Attack.
      const rank = m => power(m) * (species.types.includes(m.type) ? 1.2 : 1);
      const best = usable
        // Grassy Glide's +1 is applied by the engine in `runTurn`; the packaged
        // move still reads priority 0 (§5), so reading the data alone misses it.
        .filter(m => !PRIORITY_EXCLUDE.has(m.id) &&
          ((m.priority || 0) > 0 || ENGINE_PRIORITY.has(m.id)) && power(m) >= 55)
        .sort((a, b) => rank(b) - rank(a))[0];
      // `addMove` bypasses the type dedupe by design here: the whole point is that a
      // same-type priority move is a distinct pick, not a redundant one.
      if (best) addMove(best.id);
    }

    /*
     * 2c. Trick Room, for the Pokémon it was written for.
     *
     * The same shape as the priority slot above, and unreachable for the same
     * reason: `chooseMoves` picks attacks by power and utility by role, and
     * Trick Room is neither. It is a *stat-profile* move — the answer for
     * something enormously slow and enormously strong, exactly as a priority
     * attack is the answer for something fast and frail.
     *
     * Measured before this: **0 of 300** generated Calyrex-Ice sets carried it,
     * despite base 50 Speed and base 165 Attack making it the single best user
     * of the move in the game. Reported from a real battle, where a Calyrex-Ice
     * was outsped and killed by a Volcarona it would have moved first against.
     *
     * Carrying it is low-risk even on a mixed team, because `AI.scoreMove`
     * already refuses to *set* it unless most of the team is slower than the
     * foe — so the decision to use it stays a battle-time judgement and this
     * only decides whether the option exists at all.
     */
    const slowAndStrong = bs.spe <= 60 && Math.max(bs.atk, bs.spa) >= 100;
    if (slowAndStrong && has('trickroom') && rng.chance(0.45)) addMove('trickroom');

    // 3. Coverage: attacks that hit types the current set is walled by.
    const coverage = usable
      .filter(m => !chosenTypes.has(m.type))
      .map(m => {
        // Reward moves that beat types resisting the current STAB coverage.
        let value = movePower(m);
        const resisted = [...chosenTypes].every(t => Dex.typeChart[t]?.[m.type] !== undefined);
        void resisted;
        if (species.types.includes(m.type)) value *= 1.2;
        return {move: m, value};
      })
      .sort((a, b) => b.value - a.value);
    for (const entry of coverage) {
      if (chosen.length >= 4) break;
      if (entry.value < 45) break;
      /*
       * Re-check the type. `coverage` was filtered against `chosenTypes` **once**,
       * before this loop, so every same-type rival is still in the list — adding Fire
       * Blast did not remove Flamethrower from it. That is where Mewtwo's two Fire
       * moves came from, not from the fill step below.
       */
      if (chosenTypes.has(entry.move.type)) continue;
      addMove(entry.move.id);
    }

    /*
     * 4. Fill remaining slots with the strongest legal options, then utility.
     *
     * The type dedupe applies here too. It did not, and that was a real bug: step 1
     * and the coverage step both avoid repeating a type, but this step took the
     * highest-power move regardless — so Mewtwo was generated with *Fire Blast and
     * Flamethrower* and no Psychic STAB at all, and Arceus with Double-Edge next to
     * Extreme Speed. A second move of a type already covered is close to a wasted
     * slot. Found while comparing this game's measured tier list against Smogon's,
     * where those two landed several tiers too low purely because of their sets.
     */
    if (chosen.length < 4) {
      const ranked = usable.slice().sort((a, b) => movePower(b) - movePower(a));
      for (const move of ranked) {
        if (chosen.length >= 4) break;
        if (chosenTypes.has(move.type)) continue;
        addMove(move.id);
      }
      // Only then accept a repeat, rather than leaving a slot empty.
      for (const move of ranked) {
        if (chosen.length >= 4) break;
        addMove(move.id);
      }
    }
    if (chosen.length < 4) {
      const support = pool.filter(m => m.category === 'Status')
        .sort((a, b) => (RECOVERY.includes(b.id) ? 2 : PROTECTS.includes(b.id) ? 1 : 0) - (RECOVERY.includes(a.id) ? 2 : PROTECTS.includes(a.id) ? 1 : 0));
      for (const move of support) {
        if (chosen.length >= 4) break;
        addMove(move.id);
      }
    }
    if (chosen.length < 4) {
      for (const move of pool) {
        if (chosen.length >= 4) break;
        addMove(move.id);
      }
    }

    // Every set must be able to win a game. Enforce a floor of attacking moves
    // by swapping the least useful status move for the best remaining attack.
    const minimumAttacks = role.id === 'wall' ? 1 : role.id === 'support' ? 2 : 3;
    const attackRanking = damaging.slice().sort((a, b) => movePower(b) - movePower(a));
    let guard = 0;
    while (guard++ < 4) {
      const attacks = chosen.filter(id => Dex.move(id).category !== 'Status');
      if (attacks.length >= Math.min(minimumAttacks, damaging.length)) break;
      const replacement = attackRanking.find(m => !chosen.includes(m.id));
      if (!replacement) break;
      const dropIndex = chosen.findIndex(id => {
        const move = Dex.move(id);
        return move.category === 'Status' && !RECOVERY.includes(id) && !SETUP_PHYSICAL.includes(id) && !SETUP_SPECIAL.includes(id);
      });
      const fallbackIndex = chosen.findIndex(id => Dex.move(id).category === 'Status');
      const index = dropIndex >= 0 ? dropIndex : fallbackIndex;
      if (index < 0) break;
      chosen[index] = replacement.id;
    }
    return chosen.slice(0, 4);
  }

  function pickNature(role, moves, species) {
    const usesPhysical = moves.some(id => Dex.move(id).category === 'Physical');
    const usesSpecial = moves.some(id => Dex.move(id).category === 'Special');
    if (role.id === 'wall') return species.baseStats.def <= species.baseStats.spd ? 'bold' : 'calm';
    if (role.bias === 'special' || (!usesPhysical && usesSpecial)) {
      return role.fast || role.id === 'sweeper' ? 'timid' : 'modest';
    }
    if (role.bias === 'physical' || (usesPhysical && !usesSpecial)) {
      return role.fast || role.id === 'sweeper' ? 'jolly' : 'adamant';
    }
    return role.fast ? 'naive' : 'quiet';
  }

  function pickEVs(role, nature) {
    const evs = PokemonLib.zeroStats();
    const offense = ['modest', 'timid', 'calm', 'quiet', 'mild', 'rash'].includes(nature) ? 'spa' : 'atk';
    if (role.id === 'wall') {
      evs.hp = 252;
      evs.def = 252;
      evs.spd = 4;
      if (nature === 'calm') { evs.def = 4; evs.spd = 252; }
      return evs;
    }
    if (role.id === 'support') { evs.hp = 252; evs.def = 128; evs.spd = 128; return evs; }
    if (role.id === 'bulkyattacker') { evs.hp = 252; evs[offense] = 252; evs.spe = 4; return evs; }
    evs[offense] = 252;
    evs.spe = 252;
    evs.hp = 4;
    return evs;
  }

  function pickIVs(nature, moves) {
    const ivs = PokemonLib.maxIVs();
    const usesPhysical = moves.some(id => {
      const move = Dex.move(id);
      return move.category === 'Physical' || move.id === 'foulplay';
    });
    // A purely special attacker minimises Attack to reduce confusion and Foul Play damage.
    if (!usesPhysical) ivs.atk = 0;
    return ivs;
  }

  /**
   * Species id -> the held item that *is* its forme.
   *
   * Arceus and Silvally take their type from a held Plate or Memory: Multitype
   * and RKS System read `onPlate` / `onMemory` off the item and shift the forme
   * on entry, so an Arceus-Water holding Leftovers is not a Water type at all —
   * it reverts to plain Normal Arceus the moment it comes in, keeping a moveset
   * chosen for a typing it no longer has. All 17 Arceus and all 17 Silvally
   * formes were generated that way. Built by reading the item data rather than
   * by hardcoding pairs, for the same reason `abilities.js` reads it.
   */
  const FORME_TYPE_ITEMS = (() => {
    const map = {};
    for (const item of Object.values(Dex.allItems || {})) {
      /* Z-crystals carry `onPlate` too, so they also fix the typing — but a
       * Z-crystal is a Z-move item and Z-moves are not simulated here, which
       * would spend the item slot on nothing. The Plate does the same job and
       * boosts the type 1.2x, so the crystals are skipped by their own flag. */
      if (item.zMove) continue;
      for (const [field, base] of [['onPlate', 'Arceus'], ['onMemory', 'Silvally']]) {
        const type = item[field];
        if (!type) continue;
        const id = Dex.toID(`${base}${type}`);
        if (Dex.hasSpecies(id)) map[id] = item.id;
      }
    }
    return map;
  })();

  /**
   * Base species id -> every Plate or Memory it can hold.
   *
   * The counterpart to `FORME_TYPE_ITEMS` now that the typed formes are not
   * selectable: that table answers "this forme needs this item", which can only
   * fire for a set that already names a forme, and this one answers "this
   * species can be any of these types". Both are read from the item data rather
   * than hardcoded, so a new Plate is picked up on the next rebuild.
   */
  const FORME_TYPE_ITEM_POOL = (() => {
    const map = {};
    for (const item of Object.values(Dex.allItems || {})) {
      if (item.zMove) continue;
      for (const [field, base] of [['onPlate', 'Arceus'], ['onMemory', 'Silvally']]) {
        const type = item[field];
        if (!type) continue;
        const id = Dex.toID(base);
        if (!Dex.hasSpecies(id)) continue;
        (map[id] ||= []).push(item.id);
      }
    }
    return map;
  })();

  function pickItem(species, role, moves, rng, usedItems, format) {
    const banned = new Set((format.rules.bannedItems || []).map(Dex.toID));
    const itemClause = !!format.rules.itemClause;

    /* Not a choice among options — without it the species is a different one.
     * A format that bans the plate falls through rather than generating an
     * illegal set; the forme simply cannot be expressed there. */
    const formeItem = FORME_TYPE_ITEMS[species.id];
    if (formeItem && !banned.has(formeItem)) {
      usedItems.add(formeItem);
      return formeItem;
    }
    /*
     * Base Arceus and Silvally get a *random* Plate or Memory.
     *
     * Since 2026-08-15 the typed formes are not selectable — there is one
     * Arceus and one Silvally, and the item is what makes the forme — so the
     * generator is handed the base species and would otherwise always produce a
     * plain Normal-type Arceus holding Leftovers. Rolling the type back in keeps
     * the variety the forme species used to provide, and keeps this the one
     * place that decides an Arceus's typing.
     */
    const typeItems = FORME_TYPE_ITEM_POOL[species.id];
    if (typeItems?.length) {
      const choices = typeItems.filter(id => !banned.has(id));
      if (choices.length) {
        const picked = rng.pick(choices);
        usedItems.add(picked);
        return picked;
      }
    }

    const candidates = [];
    const add = (id, weight) => {
      const item = Dex.item(id);
      if (!item || banned.has(item.id)) return;
      if (itemClause && usedItems.has(item.id)) return;
      candidates.push([item.id, weight]);
    };

    const hasSetup = moves.some(id => [...SETUP_PHYSICAL, ...SETUP_SPECIAL, ...SETUP_SPEED].includes(id));
    const hasRecovery = moves.some(id => RECOVERY.includes(id));
    const statusMoves = moves.filter(id => Dex.move(id).category === 'Status').length;
    const physical = moves.some(id => Dex.move(id).category === 'Physical');
    const special = moves.some(id => Dex.move(id).category === 'Special');

    if (Dex.evolutions(species).length && species.bst < 450) add('eviolite', 6);

    if (role.id === 'wall' || (role.id === 'support' && hasRecovery)) {
      add('leftovers', 8);
      add('rockyhelmet', 3);
      add('heavydutyboots', 4);
    } else if (role.id === 'setup') {
      add('lifeorb', 4);
      add('leftovers', 3);
      add('focussash', 3);
      add('heavydutyboots', 2);
      if (!statusMoves) add('weaknesspolicy', 1);
    } else if (role.id === 'sweeper') {
      if (!hasSetup && statusMoves === 0) {
        if (physical && !special) add('choiceband', 4);
        if (special && !physical) add('choicespecs', 4);
        add('choicescarf', 3);
      }
      add('lifeorb', 5);
      add('focussash', 4);
      add('heavydutyboots', 3);
      add('expertbelt', 2);
    } else if (role.id === 'bulkyattacker') {
      add('leftovers', 6);
      add('assaultvest', statusMoves === 0 ? 5 : 0);
      add('heavydutyboots', 3);
      add('lifeorb', 2);
      add('rockyhelmet', 2);
    } else {
      add('leftovers', 5);
      add('heavydutyboots', 3);
      add('sitrusberry', 2);
    }

    // Signature items for the Pokémon that actually use them.
    if (species.id === 'pikachu') add('lightball', 12);
    if (species.baseSpecies === 'Marowak' || species.id === 'cubone') add('thickclub', 12);
    if (species.baseSpecies === 'Clamperl') add('deepseatooth', 8);
    if (species.id === 'ditto') add('choicescarf', 10);
    if (Dex.toID(species.abilities[0]) === 'protosynthesis' || Dex.toID(species.abilities[0]) === 'quarkdrive') add('boosterenergy', 6);

    if (!candidates.length) add('leftovers', 1);
    const picked = rng.weighted(candidates) || 'leftovers';
    usedItems.add(picked);
    return picked;
  }

  function pickTeraType(species, moves, rng) {
    const stabTypes = moves.map(id => Dex.move(id)).filter(m => m.category !== 'Status').map(m => m.type);
    const preferred = stabTypes.filter(t => species.types.includes(t));
    const pool = preferred.length ? preferred : (stabTypes.length ? stabTypes : species.types);
    return rng.pick(pool) || species.types[0] || 'Normal';
  }

  /**
   * Build one randomised competitive set for a species.
   * @param {object|string} speciesValue
   * @param {RNG} rng
   * @param {object} [options] `{level, format, usedItems}`
   */
  function randomSet(speciesValue, rng, options = {}) {
    const species = Dex.species(speciesValue);
    const format = Formats.get(options.format || 'random');
    const role = options.role || classifyRole(species, rng);
    const moves = chooseMoves(species, role, rng, format);
    const nature = options.nature || pickNature(role, moves, species);
    const usedItems = options.usedItems || new Set();
    return PokemonLib.normalizeSet({
      species: species.id,
      level: options.level || format.rules.forceLevel || 100,
      gender: PokemonLib.randomGender(species, rng),
      ability: pickAbility(species, rng, format),
      item: options.item !== undefined ? options.item : pickItem(species, role, moves, rng, usedItems, format),
      nature,
      teraType: pickTeraType(species, moves, rng),
      moves,
      // A format may run without EVs at all (Campaign): generate none rather
      // than leaving the validator to reject a set this module just built.
      evs: format.rules.evLimit === 0 ? PokemonLib.zeroStats() : (options.evs || pickEVs(role, nature)),
      ivs: options.ivs || pickIVs(nature, moves),
      role: role.id,
    });
  }

  /** Species considered strong enough to build a random battle around. */
  function viablePool(format) {
    return Formats.speciesPool(format).filter(s => {
      if (s.bst < 430) return false;
      if (Dex.evolutionStagesRemaining(s) > 0 && s.bst < 500) return false;
      if (Object.keys(s.learnset).length < 12) return false;
      return true;
    });
  }

  /**
   * Generate a full team with composition rules applied.
   * @returns {{sets: Array, species: Array}}
   */
  function randomTeam(rng, options = {}) {
    const format = Formats.get(options.format || 'random');
    const size = options.size || format.rules.teamSize || 6;
    const pool = options.pool || viablePool(format);
    if (!pool.length) throw new Error('No species are available for random team generation.');

    const chosen = [];
    const usedBaseSpecies = new Set();
    const typeCount = {};
    const usedItems = new Set();
    let hazardSetters = 0;
    let physicalCount = 0;
    let specialCount = 0;

    let attempts = 0;
    while (chosen.length < size && attempts < size * 60) {
      attempts++;
      const species = rng.pick(pool);
      if (!species) continue;
      const baseKey = Dex.toID(species.baseSpecies);
      if (usedBaseSpecies.has(baseKey)) continue;

      // Type diversity: no more than two Pokémon sharing a type.
      const overloaded = species.types.some(t => (typeCount[t] || 0) >= 2);
      if (overloaded && rng.chance(0.85)) continue;

      const role = classifyRole(species, rng);
      // Keep the offensive split balanced.
      if (role.bias === 'physical' && physicalCount >= 4 && rng.chance(0.8)) continue;
      if (role.bias === 'special' && specialCount >= 4 && rng.chance(0.8)) continue;

      const set = randomSet(species, rng, {format, usedItems, role, level: options.level});
      const setsHazards = set.moves.some(m => HAZARDS.includes(m));
      if (setsHazards) {
        if (hazardSetters >= 1 && rng.chance(0.8)) continue;
        hazardSetters++;
      }
      if (role.bias === 'physical') physicalCount++;
      else if (role.bias === 'special') specialCount++;

      usedBaseSpecies.add(baseKey);
      for (const t of species.types) typeCount[t] = (typeCount[t] || 0) + 1;
      chosen.push(set);
    }

    // Fill any shortfall without the composition constraints.
    while (chosen.length < size) {
      const species = rng.pick(pool.filter(s => !usedBaseSpecies.has(Dex.toID(s.baseSpecies))));
      if (!species) break;
      usedBaseSpecies.add(Dex.toID(species.baseSpecies));
      chosen.push(randomSet(species, rng, {format, usedItems, level: options.level}));
    }

    return {sets: chosen, species: chosen.map(s => s.species)};
  }

  global.RedGPT.RandomTeams = {randomTeam, randomSet, classifyRole, viablePool, movePower, chooseMoves, pickAbility};
})(typeof window !== 'undefined' ? window : globalThis);
