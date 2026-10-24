/**
 * Stateless battle mechanics: the move-behaviour tables and the pure numeric
 * helpers the engine uses.
 *
 * Nothing here touches battle state. Keeping it separate means the tables can
 * be audited (see tests/move-coverage.js) and the formulas unit-tested without
 * constructing a battle.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Dex = RedGPT.Dex;

  /* ------------------------------------------------------------------ *
   * Labels
   * ------------------------------------------------------------------ */

  const STATUS_NAMES = {brn: 'BRN', psn: 'PSN', tox: 'TOX', par: 'PAR', slp: 'SLP', frz: 'FRZ'};
  const STATUS_LABELS = {
    brn: 'burned', psn: 'poisoned', tox: 'badly poisoned',
    par: 'paralyzed', slp: 'asleep', frz: 'frozen solid',
  };
  const BOOST_KEYS = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'];
  const WEATHER_LABELS = {rain: 'Rain', sun: 'Harsh sunlight', sandstorm: 'Sandstorm', snow: 'Snow', hail: 'Hail'};
  const TERRAIN_LABELS = {
    electric: 'Electric Terrain', grassy: 'Grassy Terrain',
    misty: 'Misty Terrain', psychic: 'Psychic Terrain',
  };

  /* ------------------------------------------------------------------ *
   * Move-behaviour tables
   *
   * Generated move metadata drives most behaviour; these sets cover the moves
   * whose rules the metadata cannot express. Every packaged move must be
   * reachable through this metadata or one of these tables — the coverage audit
   * fails the build otherwise, so a move can never silently do nothing.
   * ------------------------------------------------------------------ */

  /** Two-turn moves: charge on the first turn, strike on the second. */
  const CHARGE_MOVES = new Set(['bounce', 'dig', 'dive', 'fly', 'meteorbeam', 'phantomforce', 'skyattack',
    'solarbeam', 'solarblade', 'electroshot', 'freezeshock', 'iceburn', 'razorwind', 'shadowforce',
    'skydrop', 'geomancy']);

  /** Locks the user in for several turns, then confuses it. */
  const LOCKED_MOVES = new Set(['outrage', 'petaldance', 'thrash', 'ragingfury']);

  /** Requires a recharge turn after use. */
  const RECHARGE_MOVES = new Set(['blastburn', 'frenzyplant', 'gigaimpact', 'hydrocannon', 'hyperbeam',
    'rockwrecker', 'roaroftime', 'prismaticlaser', 'eternabeam', 'meteorassault']);

  /** The user leaves the field after connecting. */
  const SELF_SWITCH_MOVES = new Set(['batonpass', 'flipturn', 'teleport', 'uturn', 'voltswitch',
    'chillyreception', 'shedtail', 'partingshot']);

  /** Drags the target out. */
  const FORCE_SWITCH_MOVES = new Set(['circlethrow', 'dragontail', 'roar', 'whirlwind']);

  const SCREEN_BREAK_MOVES = new Set(['brickbreak', 'psychicfangs', 'ragingbull']);
  const TERRAIN_CLEAR_MOVES = new Set(['icespinner', 'steelroller']);
  const CRASH_MOVES = new Set(['axekick', 'highjumpkick', 'jumpkick', 'supercellslam']);
  const ALWAYS_HIT_MOVES = new Set(['aerialace', 'aurasphere', 'disarmingvoice', 'magicalleaf',
    'shadowpunch', 'shockwave', 'smartstrike', 'swift', 'vitalthrow', 'falsesurrender']);
  const HAZARD_REMOVAL_MOVES = new Set(['defog', 'rapidspin', 'mortalspin', 'tidyup']);

  /**
   * Rooms that *end* when used a second time, as in the games.
   *
   * Gravity is deliberately absent: it is not self-cancelling there either. The
   * engine previously refused any re-use outright, which was harmless while
   * every room ran out on its own — and became the thing standing between an
   * endless Trick Room (Rebirth Mode's doctrine for that plan) and having any
   * counterplay at all. Setting one is how you take one down.
   */
  const SELF_CANCELLING_ROOMS = new Set(['trickroom', 'magicroom', 'wonderroom']);

  /** Status moves whose behaviour is hand-written in `applySpecialStatusMove`. */
  const STATUS_SPECIAL_MOVES = new Set([
    'acupressure', 'afteryou', 'allyswitch', 'batonpass', 'bellydrum', 'block', 'conversion', 'conversion2', 'copycat',
    'electricterrain', 'grassyterrain', 'gravity', 'guardswap', 'hail', 'haze', 'healingwish', 'healpulse', 'lightscreen',
    'lockon', 'magicroom', 'magneticflux', 'meanlook', 'metronome', 'mimic', 'mist', 'mistyterrain', 'moonlight', 'painsplit',
    'perishsong', 'powerswap', 'psychicterrain', 'psychup', 'quickguard', 'raindance', 'recycle', 'reflect', 'reflecttype',
    'roar', 'roleplay', 'safeguard', 'sandstorm', 'skillswap', 'sleeptalk', 'snowscape', 'soak', 'speedswap', 'spikes', 'spite',
    'splash', 'stealthrock', 'sunnyday', 'swallow', 'switcheroo', 'synthesis', 'tailwind', 'teleport', 'toxicspikes', 'transform',
    'trick', 'trickroom', 'venomdrench', 'whirlwind', 'wideguard', 'wonderroom', 'worryseed', 'defog', 'tidyup', 'auroraveil',
    'courtchange', 'shedtail', 'chillyreception', 'partingshot', 'stickyweb', 'toxicthread', 'corrosivegas', 'lunardance',
    'aromatherapy', 'healbell', 'heartswap', 'morningsun', 'shoreup', 'simplebeam', 'entrainment', 'spiderweb',
    'mindreader', 'stuffcheeks', 'wish', 'celebrate', 'refresh', 'purify', 'floralhealing', 'junglehealing',
    'lunarblessing', 'takeheart', 'strengthsap', 'topsyturvy', 'guardsplit', 'powersplit', 'forestscurse',
    'trickortreat', 'camouflage', 'bestow', 'holdhands', 'happyhour', 'rototiller', 'flowershield', 'gearup',
    'magicpowder', 'quash', 'instruct', 'doodle', 'teatime', 'sketch',
  ]);

  /** Moves whose base power is computed at use time. */
  const DYNAMIC_POWER_MOVES = new Set([
    'acrobatics', 'assurance', 'avalanche', 'barbbarrage', 'beatup', 'boltbeak', 'brine', 'collisioncourse', 'crushgrip',
    'dragonenergy', 'electroball', 'electrodrift', 'eruption', 'ficklebeam', 'fishiousrend', 'fling', 'facade', 'flail',
    'furycutter', 'grassknot', 'gyroball', 'hardpress', 'heatcrash', 'heavyslam', 'hex', 'infernalparade', 'lashout',
    'lastrespects', 'lowkick', 'payback', 'powertrip', 'punishment', 'ragefist', 'retaliate', 'revenge', 'reversal',
    'risingvoltage', 'rollout', 'round', 'spitup', 'storedpower', 'stompingtantrum', 'temperflare', 'terrainpulse',
    'trumpcard', 'venoshock', 'waterspout', 'weatherball', 'wringout', 'echoedvoice', 'expandingforce', 'knockoff',
    'mistyexplosion', 'triplekick', 'tripleaxel', 'psyblade', 'hydrosteam', 'steelbeam', 'tarshot',
    'return', 'frustration', 'magnitude', 'present', 'naturalgift',
  ]);

  /**
   * Moves whose power depends on whether the TARGET has already moved this
   * turn — `defender.hasActedThisTurn` in `dynamicBasePower`.
   *
   * They are the awkward case for anything that evaluates a move *before* the
   * turn runs, because the flag is reset at the start of every turn: it reads
   * false for both sides at choice time and only becomes true once the target
   * actually moves. So the honest question is not "has the target acted" but
   * "will it have acted by the time this move lands", which is turn order.
   *
   * `AI.estimateDamage` projects it from `movesFirst`; the damage calculator
   * exposes it as a per-side toggle, because a calculator has no turn to
   * project from and the user has to say which case they mean.
   *
   * Deliberately NOT the `damageTakenThisTurn` family (Assurance, Avalanche,
   * Revenge, Counter, Mirror Coat, Metal Burst, Comeuppance). Those depend on
   * whether the opponent *chose to attack*, which is a prediction this AI
   * explicitly does not make (docs/AI_DESIGN.md §3), while turn order is
   * already computed.
   */
  const TURN_ORDER_POWER_MOVES = new Set(['fishiousrend', 'boltbeak', 'payback']);

  /**
   * Moves whose positive priority the ENGINE applies, against a packaged
   * `priority` of 0.
   *
   * Grassy Glide's +1 is unconditional in this project (§5) and is added in
   * `runTurn`, so the packaged move still reads 0 — which means any tool that
   * filters on `move.priority` silently misses it. `random-teams.js` learned
   * that the hard way (four of the five unconditional priority moves were
   * unreachable in generated sets) and kept a local copy of this set; it reads
   * this one now, so there is a single declared answer for "does this move
   * actually move first".
   */
  const ENGINE_PRIORITY = new Set(['grassyglide']);

  /** Moves that deal a value independent of the damage formula. */
  const FIXED_DAMAGE_MOVES = new Set(['counter', 'endeavor', 'finalgambit', 'fissure', 'guillotine', 'horndrill',
    'mirrorcoat', 'nightshade', 'seismictoss', 'sheercold', 'superfang', 'sonicboom', 'dragonrage', 'psywave',
    'metalburst', 'comeuppance', 'naturesmadness', 'ruination', 'bitterblade']);

  /**
   * Protection moves, including the variants that punish the attacker.
   *
   * Max Guard is deliberately absent: it is a Dynamax move and is not in the
   * packaged dataset, so nothing can ever select it. Every id here must resolve
   * to a real move — `tests/move-coverage.js` fails otherwise.
   */
  const PROTECT_MOVES = new Set(['protect', 'detect', 'endure', 'kingsshield', 'obstruct', 'silktrap',
    'spikyshield', 'banefulbunker', 'burningbulwark']);

  /**
   * Held items that change the holder's forme on entry.
   *
   * Mega Stones are *not* here: they carry their own `megaStone` mapping in the
   * packaged data and are a declared, once-per-side action taken on the move
   * choice (see PROJECT_CONTEXT §5). These are the other kind — Primal
   * Reversion, the Crowned formes and the Origin formes — which the games apply
   * automatically the moment the holder is on the field, with no declaration, no
   * once-per-battle limit, and no interaction with the Mega slot.
   *
   * The packaged item data only records an `itemUser` name, never a mapping, so
   * the pairing has to be declared here. Keyed by item id, then by the *base*
   * species name, exactly like the `megaStone` shape, so one table walker can
   * handle both.
   *
   * Necrozma-Ultra is deliberately absent: Ultra Burst needs a Z-crystal and a
   * fused Necrozma, and this project has no Z-move system. Ultranecrozium Z is
   * therefore inert, not silently half-working.
   */
  const FORME_CHANGE_ITEMS = {
    redorb: {Groudon: 'Groudon-Primal'},
    blueorb: {Kyogre: 'Kyogre-Primal'},
    rustedsword: {Zacian: 'Zacian-Crowned'},
    rustedshield: {Zamazenta: 'Zamazenta-Crowned'},
    griseousorb: {Giratina: 'Giratina-Origin'},
    griseouscore: {Giratina: 'Giratina-Origin'},
    adamantcrystal: {Dialga: 'Dialga-Origin'},
    lustrousglobe: {Palkia: 'Palkia-Origin'},
    // Project-authored (see ITEM_ADDITIONS in tools/generate-data.js). Zero to
    // Hero fired on switching out, which is invisible, un-plannable and
    // impossible to shop towards; the Hero Charm makes Palafin work like every
    // other transformation Pokémon.
    herocharm: {Palafin: 'Palafin-Hero'},
    /*
     * The three Ogerpon Masks (2026-08-16). Same mechanic as the Red Orb: hold
     * one and Ogerpon arrives already wearing it, with that forme's typing and
     * its own first ability (Mold Breaker, Water Absorb, Sturdy).
     *
     * Until this landed the whole line was unplayable outside Anything Goes.
     * The three masked formes carry `requiredItem`, which the validator's
     * battle-only gate refuses in every tier format, and there was no route to
     * them because the Masks were not here — so the Ogerpon-Hearthflame drop to
     * OU had nothing to act on.
     *
     * The Masks also carry a real 1.2x, which `items.js` implements. It has to
     * be implemented alongside this: an entry in this table makes
     * `Items.isFormeItem` true, which counts the item as **implemented** in
     * `Items.coverage()`, and shipping a half-inert item under that label is
     * exactly the bug PROJECT_CONTEXT §8 keeps recording.
     */
    hearthflamemask: {Ogerpon: 'Ogerpon-Hearthflame'},
    wellspringmask: {Ogerpon: 'Ogerpon-Wellspring'},
    cornerstonemask: {Ogerpon: 'Ogerpon-Cornerstone'},
  };

  /**
   * Formes an ability can reach, for display only.
   *
   * The engine drives these from the hooks in `abilities.js`; this table exists
   * so the UI can say *what* a Pokémon can turn into and *when*, without
   * re-deriving it from hook internals. It is display metadata, which is why a
   * test asserts every id resolves and every ability here is implemented — a
   * table nothing checks is how this project's most common bug ships.
   */
  const ABILITY_FORMES = {
    stancechange: [{from: 'aegislash', to: 'aegislashblade', when: 'when it uses an attacking move'}],
    zenmode: [
      {from: 'darmanitan', to: 'darmanitanzen', when: 'at half HP or less'},
      {from: 'darmanitangalar', to: 'darmanitangalarzen', when: 'at half HP or less'},
    ],
    schooling: [{from: 'wishiwashi', to: 'wishiwashischool', when: 'from level 20, above a quarter HP'}],
    powerconstruct: [
      {from: 'zygarde', to: 'zygardecomplete', when: 'at half HP or less'},
      {from: 'zygarde10', to: 'zygardecomplete', when: 'at half HP or less'},
    ],
    forecast: [
      {from: 'castform', to: 'castformsunny', when: 'in harsh sunlight'},
      {from: 'castform', to: 'castformrainy', when: 'in rain'},
      {from: 'castform', to: 'castformsnowy', when: 'in snow or hail'},
    ],
    flowergift: [{from: 'cherrim', to: 'cherrimsunshine', when: 'in harsh sunlight'}],
    hungerswitch: [{from: 'morpeko', to: 'morpekohangry', when: 'at the end of every turn'}],
    terashift: [{from: 'terapagos', to: 'terapagosterastal', when: 'on entering battle'}],
    disguise: [{from: 'mimikyu', to: 'mimikyubusted', when: 'when its disguise is broken'}],
    iceface: [{from: 'eiscue', to: 'eiscuenoice', when: 'when its Ice Face is broken'}],
    // Legacy Battle Bond (PROJECT_CONTEXT §5): any move that scores a knockout
    // turns Greninja into Ash-Greninja for the rest of the battle.
    battlebond: [{from: 'greninja', to: 'greninjaash', when: 'after it knocks a Pokémon out'}],
  };

  /**
   * Formes reached by USING A MOVE — the third route, after items and abilities.
   *
   * `MOVE_FORMES` is to Relic Song what `FORME_CHANGE_ITEMS` is to the Red Orb
   * and `ABILITY_FORMES` is to Zen Mode: the single from → to table, read by the
   * engine, the validator, the Pokédex and the team builder alike so there is
   * never a second copy.
   *
   * **Relic Song toggles**, which is why both directions are listed. Using it
   * again turns Pirouette back into Aria forme, exactly as it does in the games,
   * and the forme also reverts when Meloetta leaves the field — so it is a
   * per-appearance state rather than a permanent upgrade like Battle Bond.
   *
   * **The tier gate that goes with this is the important half.** Meloetta is NU
   * and Meloetta-Pirouette is RU, so without a gate an NU team could field a
   * Pokémon that becomes an RU forme on turn one. `Formats.illegalFormeMoves`
   * refuses the *move* in formats that cannot have the target — ban the route,
   * not the Pokémon.
   */
  const MOVE_FORMES = {
    relicsong: [
      {from: 'meloetta', to: 'meloettapirouette', when: 'when it uses Relic Song'},
      {from: 'meloettapirouette', to: 'meloetta', when: 'when it uses Relic Song again'},
    ],
  };

  /**
   * Every forme this set could actually reach *right now*, with the reason.
   *
   * "Right now" is the point: a Blaziken reaches its Mega only while it is
   * holding the Blazikenite, and Rayquaza only while it knows Dragon Ascent.
   * Returns `[{id, name, when, kind}]`, empty when nothing applies.
   *
   * `kind` says *how* the forme arrives, which callers need because the three
   * are not interchangeable:
   *
   *   'entry'    automatic the moment it switches in — the Red and Blue Orbs,
   *              the Rusted pair, the Griseous items, the Hero Charm, and the
   *              Plate or Memory that decides what an Arceus or Silvally *is*.
   *   'mega'     declared once per battle on a move choice, so it is what the
   *              Pokémon *becomes*, not what it starts as.
   *   'ability'  mid-battle and conditional — Stance Change, Zen Mode, Battle
   *              Bond. It never applies on the turn it arrives.
   *
   * The Pokémon menu shows more than this — see `speciesFormes`, which lists
   * every forme in the family and uses this to mark which are live.
   */
  function reachableFormes(set) {
    if (!set) return [];
    const RedGPTns = global.RedGPT;
    const species = Dex.species(set.species);
    const out = [];
    const push = (id, when, kind) => {
      if (!Dex.hasSpecies(id) || Dex.toID(id) === species.id) return;
      if (out.some(entry => entry.id === Dex.toID(id))) return;
      out.push({id: Dex.toID(id), name: Dex.species(id).name, when, kind});
    };

    // Mega Evolution: the stone, or Dragon Ascent for Rayquaza (no stone at all).
    if (species.id === 'rayquaza' && (set.moves || []).some(m => Dex.toID(m) === 'dragonascent')) {
      push('rayquazamega', 'Mega Evolving (it knows Dragon Ascent)', 'mega');
    }
    const stone = Dex.item(set.item)?.megaStone;
    if (stone) push(typeof stone === 'string' ? stone : stone[species.name], 'Mega Evolving in battle', 'mega');

    // Held transformation items — Red Orb, Rusted Sword, Hero Charm...
    const held = FORME_CHANGE_ITEMS[Dex.toID(set.item)];
    if (held) push(held[species.name], `holding the ${Dex.item(set.item).name}`, 'entry');

    // Arceus and Silvally read their forme off the held plate or memory.
    const typeItem = Dex.item(set.item)?.onPlate || Dex.item(set.item)?.onMemory;
    if (typeItem && (species.baseSpecies === 'Arceus' || species.baseSpecies === 'Silvally')) {
      push(Dex.toID(`${species.baseSpecies}${typeItem}`), `holding the ${Dex.item(set.item).name}`, 'entry');
    }

    // Move-driven formes — Relic Song. Gated on the set actually carrying the
    // move, the same way the Mega route is gated on holding the stone.
    for (const moveId of (set.moves || []).map(Dex.toID)) {
      for (const entry of MOVE_FORMES[moveId] || []) {
        if (Dex.toID(entry.from) === species.id) push(entry.to, entry.when, 'move');
      }
    }

    // Ability-driven formes, only for an ability the engine actually implements.
    const abilityId = Dex.toID(set.ability);
    if (RedGPTns.Abilities?.registry?.[abilityId]) {
      for (const entry of ABILITY_FORMES[abilityId] || []) {
        if (Dex.toID(entry.from) === species.id) push(entry.to, entry.when, 'ability');
      }
    }
    return out;
  }

  /**
   * The forme a set takes on because of **what it is holding** — the one a team
   * builder should draw, since it is decided before the battle starts.
   *
   * Deliberately excludes `kind: 'ability'`. Stance Change, Zen Mode and Battle
   * Bond fire *during* a battle on a condition, so an Aegislash still arrives in
   * Shield forme and drawing it as Blade would be a straight lie about what the
   * player is bringing. Rayquaza is included despite holding nothing, because
   * Dragon Ascent is decided at team-build time exactly as a held stone is.
   *
   * `automatic` separates the two that remain: an entry forme is what the
   * Pokémon *is* from the moment it switches in, while a Mega is what it
   * *becomes* once declared. Both are worth drawing; conflating them would
   * promise a Mega on turn one.
   *
   * @returns {{id, name, when, kind, automatic}|null}
   */
  function heldForme(set) {
    const forme = reachableFormes(set).find(entry => entry.kind === 'entry' || entry.kind === 'mega');
    return forme ? Object.assign({}, forme, {automatic: forme.kind === 'entry'}) : null;
  }

  /**
   * The ability a set actually has once `forme` is in play.
   *
   * Mirrors the engine rather than restating it: `battle.megaEvolve` and
   * `battle.applyHeldFormeChange` both overwrite the holder's ability with
   * `Dex.abilityList(species)[0]`, so that is what is read here. Without it a
   * Charizard holding a Charizardite Y reads "Blaze" beside Drought's stat line.
   */
  function formeAbility(set, forme) {
    if (!set) return null;
    if (!forme || Dex.toID(forme.id ?? forme) === Dex.toID(set.species)) return set.ability;
    return Dex.abilityList(Dex.species(forme.id ?? forme))[0] || set.ability;
  }

  /**
   * How a forme is reached, stated for any species — not only the ones this
   * particular set can reach. Used to explain a forme the player cannot
   * currently activate ("hold the Blazikenite", "needs Battle Bond").
   */
  function formeRoute(baseSpecies, targetId) {
    const target = Dex.toID(targetId);
    for (const [itemId, mapping] of Object.entries(FORME_CHANGE_ITEMS)) {
      for (const [base, to] of Object.entries(mapping)) {
        if (Dex.toID(base) === Dex.toID(baseSpecies) && Dex.toID(to) === target) {
          return `hold the ${Dex.item(itemId)?.name || itemId}`;
        }
      }
    }
    for (const item of Object.values(Dex.allItems)) {
      const stone = item.megaStone;
      if (!stone) continue;
      const pairs = typeof stone === 'string' ? [] : Object.entries(stone);
      if (pairs.some(([base, mega]) => Dex.toID(base) === Dex.toID(baseSpecies) && Dex.toID(mega) === target)) {
        return `hold the ${item.name}`;
      }
    }
    if (target === 'rayquazamega') return 'know Dragon Ascent';
    for (const [moveId, entries] of Object.entries(MOVE_FORMES)) {
      for (const entry of entries) {
        if (Dex.toID(entry.to) === target && Dex.toID(entry.from) === Dex.toID(baseSpecies)) {
          return `${Dex.move(moveId)?.name || moveId} — ${entry.when}`;
        }
      }
    }
    for (const [abilityId, entries] of Object.entries(ABILITY_FORMES)) {
      for (const entry of entries) {
        if (Dex.toID(entry.to) === target) {
          const ability = Dex.ability(abilityId);
          return `${ability ? ability.name : abilityId} — ${entry.when}`;
        }
      }
    }
    const data = Dex.species(target);
    if (data.forme && /Mega/.test(data.forme)) return 'hold the matching Mega Stone';
    return 'a different forme of the same species';
  }

  /**
   * Every forme in this Pokémon's family, whether or not it can be reached now.
   *
   * The Pokémon menu lists all of them so the player can compare spreads before
   * committing to an item or an ability — a Greninja shows Ash-Greninja *and*
   * Greninja-Mega even holding neither. `available` marks the ones this exact
   * set can actually reach, and those sort first.
   */
  function speciesFormes(set) {
    if (!set) return [];
    const species = Dex.species(set.species);
    const base = species.baseSpecies || species.name;
    const live = new Map(reachableFormes(set).map(entry => [entry.id, entry.when]));
    const all = (Dex.packagedSpecies || []).filter(candidate =>
      (candidate.baseSpecies || candidate.name) === base && candidate.id !== species.id);
    return all
      .map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        available: live.has(candidate.id),
        when: live.get(candidate.id) || formeRoute(base, candidate.id),
      }))
      .sort((a, b) => (b.available - a.available) || a.name.localeCompare(b.name));
  }

  /**
   * Move targets that never reach the opposing Pokémon: the move is aimed at
   * the user, at an ally, at the user's own side, or at the field as a whole.
   *
   * The executor passes the foe as `defender` for *every* move, so without this
   * a defender-side reactive effect sees the user's own Swords Dance or Reflect
   * as an incoming move. `foeSide` is deliberately absent — hazards do cross the
   * field, and Magic Bounce must still be offered the chance to reflect them.
   */
  const NON_FOE_TARGETS = new Set(['self', 'allySide', 'allyTeam', 'allies',
    'adjacentAlly', 'adjacentAllyOrSelf', 'all']);

  /* ------------------------------------------------------------------ *
   * Pure numeric helpers
   * ------------------------------------------------------------------ */

  /** Stat multiplier for a boost stage, clamped to ±6. */
  function boostMultiplier(stage) {
    const clamped = Math.max(-6, Math.min(6, stage));
    return clamped >= 0 ? (2 + clamped) / 2 : 2 / (2 - clamped);
  }

  /** Accuracy multiplier for a net accuracy/evasion stage. */
  function accuracyStageMod(stage) {
    const clamped = Math.max(-6, Math.min(6, stage));
    return clamped >= 0 ? (3 + clamped) / 3 : 3 / (3 - clamped);
  }

  /** Grass Knot / Low Kick power from the target's weight in kilograms. */
  function weightPower(weight) {
    if (weight >= 200) return 120;
    if (weight >= 100) return 100;
    if (weight >= 50) return 80;
    if (weight >= 25) return 60;
    if (weight >= 10) return 40;
    return 20;
  }

  /** Heavy Slam / Heat Crash power from the weight ratio. */
  function weightRatioPower(userWeight, targetWeight) {
    const ratio = userWeight / Math.max(0.1, targetWeight);
    if (ratio >= 5) return 120;
    if (ratio >= 4) return 100;
    if (ratio >= 3) return 80;
    if (ratio >= 2) return 60;
    return 40;
  }

  /** Flail / Reversal power from remaining HP. */
  function lowHpPower(currentHP, maxHP) {
    const n = Math.floor(48 * currentHP / Math.max(1, maxHP));
    if (n <= 1) return 200;
    if (n <= 4) return 150;
    if (n <= 9) return 100;
    if (n <= 16) return 80;
    if (n <= 32) return 40;
    return 20;
  }

  /** Normalise the many spellings of a weather condition to one key. */
  function canonicalWeather(value) {
    const v = Dex.toID(value);
    if (v === 'raindance' || v === 'rain' || v === 'primordialsea') return 'rain';
    if (v === 'sunnyday' || v === 'sun' || v === 'desolateland' || v === 'harshsunshine') return 'sun';
    if (v === 'sandstorm') return 'sandstorm';
    if (v === 'snowscape' || v === 'snow') return 'snow';
    if (v === 'hail') return 'hail';
    return v || null;
  }

  /** A fresh set of side conditions. */
  function emptySideConditions() {
    return {
      reflect: 0, lightscreen: 0, auroraveil: 0, safeguard: 0, mist: 0, tailwind: 0,
      quickguard: 0, wideguard: 0, craftyshield: 0, matblock: 0, luckychant: 0,
      spikes: 0, toxicspikes: 0, stealthrock: 0, stickyweb: 0,
      healingwish: false, lunardance: false, futureSight: null, lastFaintTurn: -5,
    };
  }

  global.RedGPT.Mechanics = {
    STATUS_NAMES, STATUS_LABELS, BOOST_KEYS, WEATHER_LABELS, TERRAIN_LABELS,
    CHARGE_MOVES, LOCKED_MOVES, RECHARGE_MOVES, SELF_SWITCH_MOVES, FORCE_SWITCH_MOVES,
    SCREEN_BREAK_MOVES, TERRAIN_CLEAR_MOVES, CRASH_MOVES, ALWAYS_HIT_MOVES,
    HAZARD_REMOVAL_MOVES, SELF_CANCELLING_ROOMS, STATUS_SPECIAL_MOVES, DYNAMIC_POWER_MOVES, TURN_ORDER_POWER_MOVES,
    ENGINE_PRIORITY, FIXED_DAMAGE_MOVES,
    PROTECT_MOVES, NON_FOE_TARGETS, FORME_CHANGE_ITEMS, ABILITY_FORMES, MOVE_FORMES,
    reachableFormes, speciesFormes, formeRoute,
    heldForme, formeAbility,
    boostMultiplier, accuracyStageMod, weightPower, weightRatioPower, lowHpPower,
    canonicalWeather, emptySideConditions,
  };
})(typeof window !== 'undefined' ? window : globalThis);
