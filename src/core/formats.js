/**
 * Arena formats.
 *
 * A format is a plain rule object consumed by the validator, the battle engine
 * and the random team generator. There are no format-specific `if` branches
 * anywhere else in the codebase.
 *
 * `powerClass` in the packaged data is a fixed snapshot generated alongside the
 * roster, and the general-purpose formats below are stable RedGPT rulesets built
 * on top of it.
 *
 * **Tier formats carry Smogon's tiers, imported rather than measured** (project
 * decision, replacing an earlier one that said the opposite). `species.tier` is
 * generated in `tools/generate-data.js` from Smogon's National Dex tiers, and
 * the tier formats below are cumulative-downward like Smogon's own: an OU format
 * admits OU and everything under it.
 *
 * The rule that makes that work for this game is `maxTier` plus per-forme item
 * legality. Mega Evolution needs no Key Stone here (§5), so a Pokemon is only as
 * fair as the forme it can turn into — and the answer is to **ban the forme, not
 * the Pokemon**. Absol is PU and Mega Absol is RU, so Absol plays in PU and
 * simply may not hold Absolite there. `species.formeItems` carries each item
 * with the tier of the forme it produces.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Dex = RedGPT.Dex;

  /**
   * Rule keys:
   *   teamSize        maximum Pokémon brought to the battle
   *   minTeamSize
   *   bringCount      how many of those actually battle (Team Preview subset)
   *   forceLevel      every Pokémon is set to this level
   *   maxLevel        cap without forcing
   *   speciesClause   no duplicate base species
   *   itemClause      no duplicate held items
   *   sleepClause     only one opposing Pokémon may be asleep at a time
   *   evasionClause   Double Team and Minimize are banned
   *   ohkoClause      Fissure, Guillotine, Horn Drill and Sheer Cold are banned
   *   evLimit / evStatLimit / ivMax
   *   allowRestricted allow `powerClass: restricted` species
   *   allowUnrestrictedOnly allow `powerClass: unrestricted-only` species
   *   allowNonstandard allow Past/Future Dex entries (regional forms, Megas...)
   *   allowBattleOnly allow battle-only formes such as Mega Evolutions
   *   tera            Terastallization enabled
   *   mega            Mega Evolution enabled (hold the stone; no Key Stone needed)
   *   teamPreview
   *   maxTurns
   *   bannedSpecies / bannedMoves / bannedItems / bannedAbilities (id arrays)
   */
  /**
   * The format everything falls back to: a new team, a battle built without one,
   * and any saved team whose format id no longer exists.
   *
   * **OverUsed, since 2026-08-14** — it replaced Standard Singles, which was
   * removed. Declared once here rather than written as a literal at each of the
   * seven call sites that used to say `'standard'`, because those drifting apart
   * is exactly how a default becomes two different defaults.
   */
  const DEFAULT_FORMAT = 'tierou';

  /**
   * The two move clauses, expressed as the moves they ban.
   *
   * **`evasionClause` and `ohkoClause` were declared on every tier format and
   * read by nothing** (found 2026-08-16). The behaviour was right — the same six
   * ids were hardcoded into `bannedMoves` a few lines below the flags — but the
   * flags themselves were the §8 declared-but-inert family: a format setting
   * `evasionClause: false` would still have banned Double Team, and anyone
   * reading the rules object would have believed otherwise. `speciesClause` and
   * `sleepClause`, the two clauses beside them, are each read in four or five
   * files.
   *
   * `bannedMoves` is now *derived* from the flags wherever a ruleset is built,
   * so the declaration is the thing that decides. Behaviour is unchanged for
   * every existing format, which all set both flags true.
   */
  const EVASION_MOVES = ['doubleteam', 'minimize'];
  const OHKO_MOVES = ['fissure', 'guillotine', 'horndrill', 'sheercold'];

  /**
   * `bannedMoves` for a ruleset, from its clause flags.
   *
   * Idempotent, and it **preserves bans that are not a clause's** — a format may
   * ban a move outright, and recomputing must not silently drop it. That is why
   * this filters the clause-owned ids out of the existing list rather than
   * replacing the list wholesale.
   */
  /** Apply `clauseBannedMoves` to a rules object in place, and return it. */
  function withClauseBans(rules) {
    rules.bannedMoves = clauseBannedMoves(rules);
    return rules;
  }

  function clauseBannedMoves(rules = {}) {
    const clauseOwned = new Set([...EVASION_MOVES, ...OHKO_MOVES]);
    const explicit = (rules.bannedMoves || []).filter(id => !clauseOwned.has(id));
    return [
      ...(rules.ohkoClause ? OHKO_MOVES : []),
      ...(rules.evasionClause ? EVASION_MOVES : []),
      ...explicit,
    ];
  }

  const FORMATS = [
    {
      id: 'anythinggoes',
      name: 'Anything Goes',
      short: 'AG',
      description: 'No species restrictions. Mega and other battle-only formes are selectable directly as species. Only the EV/IV caps apply.',
      rules: {
        teamSize: 6, minTeamSize: 1, bringCount: 6, forceLevel: 100,
        speciesClause: false, sleepClause: false,
        evLimit: 510, evStatLimit: 252, ivMax: 31,
        allowRestricted: true, allowUnrestrictedOnly: true,
        allowNonstandard: true, allowBattleOnly: true,
        tera: true, mega: true, teamPreview: true, hideOpponentDetails: true, maxTurns: 400,
      },
    },
    {
      id: 'random',
      name: 'Random Battle',
      short: 'Random',
      description: 'Balanced six-Pokémon teams are generated for both sides. No Team Builder required. Terastallization is off.',
      generated: true,
      rules: {
        teamSize: 6, minTeamSize: 6, bringCount: 6, forceLevel: 100,
        speciesClause: true, sleepClause: true,
        evLimit: 510, evStatLimit: 252, ivMax: 31,
        allowRestricted: false, allowUnrestrictedOnly: false,
        allowNonstandard: true, allowBattleOnly: false,
        // Tera off: only Anything Goes and the two Tera tier variants allow it
        // (2026-08-14, by project decision).
        tera: false, mega: true, teamPreview: true, hideOpponentDetails: true, maxTurns: 250,
      },
    },
    {
      id: 'campaign',
      name: 'Campaign Battle',
      short: 'Campaign',
      description: 'Used by Campaign encounters. Team size follows the encounter, levels follow the run, Team Preview is disabled for wild encounters, and nobody trains EVs — both sides run on base stats, nature and level alone.',
      internal: true,
      rules: {
        teamSize: 6, minTeamSize: 1, bringCount: 6,
        speciesClause: false, sleepClause: false,
        // Campaign is a roguelite, not a training sim: there is no EV yield, no
        // vitamins and no way to redistribute, so allowing them would only mean
        // the hand-written boss spreads got a stat edge the player could never
        // match. `evLimit: 0` is enforced in `Battle.scaleSet`, which every
        // battle Pokémon on both sides passes through.
        evLimit: 0, evStatLimit: 0, ivMax: 31,
        allowRestricted: true, allowUnrestrictedOnly: true,
        allowNonstandard: true, allowBattleOnly: false,
        tera: true, mega: true, teamPreview: false, hideOpponentDetails: true, maxTurns: 300,
      },
    },
  ];

  /*
   * Smogon's tier ladder as playable formats, built from one table so a new tier
   * cannot be added to the data and forgotten here. Cumulative-downward: OU
   * admits OU, UU, RU, NU, PU and ZU, exactly as Smogon's own ladders do.
   *
   * `maxTier` filters the species pool. The forme rule is separate and lives in
   * `illegalFormeItems`, because a Pokemon that is fair in its tier can still own
   * a Mega Stone that is not — the item is refused, the Pokemon is not.
   *
   * **Two formats were removed on 2026-08-14, by project decision.** Anything
   * Goes (Tiered) differed from the plain `anythinggoes` above only in reading
   * `maxTier: 'AG'` — two names for one idea, and nothing referenced it. And
   * **Standard Singles is gone**: OverUsed is the default format now. Standard
   * was a hand-built ruleset that gated on `powerClass` (a fixed snapshot in the
   * packaged data) while the tier ladder gates on Smogon's actual tiers, so the
   * two disagreed about the same Pokemon — OU is the one with a source.
   */
  const TIER_FORMATS = [
    ['Ubers', 'Ubers', 'Smogon\'s Ubers and below — the legendaries and Megas too strong for OU.'],
    ['OU', 'OverUsed', 'Smogon\'s OU and below. The standard competitive tier.'],
    ['UU', 'UnderUsed', 'Smogon\'s UU and below. No OU or Ubers Pokémon, and no forme that would be.'],
    ['RU', 'RarelyUsed', 'Smogon\'s RU and below.'],
    ['NU', 'NeverUsed', 'Smogon\'s NU and below.'],
    ['PU', 'PU', 'Smogon\'s PU and below.'],
    ['ZU', 'ZU', 'The bottom tier. Only Pokémon Smogon ranks in ZU.'],
  ];
  /*
   * **Terastallization is off on the tier ladder** (2026-08-14, by project
   * decision). Only three formats allow it: Anything Goes, and the two Tera
   * variants generated below — Ubers (Tera) and OU (Tera). The tier formats are
   * otherwise identical to their plain versions, so they are built from the same
   * table rather than written out twice; a rule added to the ladder reaches the
   * Tera variants automatically, which is the only way the pair stays in step.
   */
  const TERA_TIERS = new Set(['Ubers', 'OU']);
  const tierRules = (tier, tera) => withClauseBans({
    teamSize: 6, minTeamSize: 1, bringCount: 6, forceLevel: 100,
    speciesClause: true, sleepClause: true, evasionClause: true, ohkoClause: true,
    evLimit: 510, evStatLimit: 252, ivMax: 31,
    /*
     * The tier itself decides what is allowed, so the blunt power-class gates
     * stay open — an Ubers format must be able to field restricted legendaries.
     *
     * `allowUnrestrictedOnly` opened with them (2026-08-15): `powerClass` is a
     * fixed snapshot derived from the *old* tier data, so Calyrex-Shadow and
     * Miraidon still carry `unrestricted-only` from when they were AG. With AG
     * emptied by `TIER_OVERRIDES` they are Ubers Pokémon, and leaving the gate
     * shut would have refused them in the tier that now ranks them — a second
     * ceiling contradicting the one the ladder is built on. `maxTier` is the
     * ceiling here; the power classes are not.
     */
    allowRestricted: true, allowUnrestrictedOnly: true,
    allowNonstandard: true, allowBattleOnly: false,
    maxTier: tier,
    tera, mega: true, teamPreview: true, hideOpponentDetails: true, maxTurns: 250,
    // `bannedMoves` is derived from `evasionClause` / `ohkoClause` above by
    // `withClauseBans`, not written out here — that duplicate was what made
    // both flags inert.
    bannedItems: [],
  });

  for (const [tier, name, description] of TIER_FORMATS) {
    FORMATS.push({
      id: `tier${tier.toLowerCase()}`,
      name,
      short: tier,
      description: `${description} Level 100, 6v6 singles with Species Clause and Sleep Clause. Terastallization is off.`,
      rules: tierRules(tier, false),
    });
    // The Tera variant, for the two tiers that have one. Same ruleset, same
    // pool, same bans — the single difference is `tera`, which is why both come
    // out of `tierRules` instead of being a second hand-written entry.
    if (!TERA_TIERS.has(tier)) continue;
    FORMATS.push({
      id: `tier${tier.toLowerCase()}tera`,
      name: `${name} (Tera)`,
      short: `${tier} Tera`,
      description: `${description} Level 100, 6v6 singles with Species Clause and Sleep Clause. Terastallization is enabled.`,
      rules: tierRules(tier, true),
    });
  }


  const byId = new Map(FORMATS.map(f => [f.id, f]));

  function get(id) {
    if (id && typeof id === 'object' && id.rules) return id;
    return byId.get(Dex.toID(id)) || byId.get(DEFAULT_FORMAT);
  }

  function list({includeInternal = false} = {}) {
    return FORMATS.filter(f => includeInternal || !f.internal);
  }

  /**
   * Build a one-off format from Custom Game settings.
   * @param {object} settings
   */
  function custom(settings = {}) {
    const base = get(settings.base || DEFAULT_FORMAT);
    const rules = Object.assign({}, base.rules, {
      teamSize: clampInt(settings.teamSize, 1, 6, base.rules.teamSize),
      minTeamSize: 1,
      bringCount: clampInt(settings.bringCount ?? settings.teamSize, 1, 6, base.rules.bringCount),
      forceLevel: settings.level === 'free' ? null : clampInt(settings.level, 1, 100, 100),
      maxLevel: settings.level === 'free' ? 100 : null,
      speciesClause: !!settings.speciesClause,
      itemClause: !!settings.itemClause,
      sleepClause: !!settings.sleepClause,
      allowRestricted: !!settings.allowRestricted,
      allowUnrestrictedOnly: !!settings.allowRestricted,
      allowBattleOnly: !!settings.allowBattleOnly,
      tera: !!settings.tera,
      mega: settings.mega !== false,
      teamPreview: settings.teamPreview !== false,
      maxTurns: 400,
    });
    if (rules.bringCount > rules.teamSize) rules.bringCount = rules.teamSize;
    /*
     * Recomputed, not inherited. `Object.assign` copies the base format's
     * already-derived `bannedMoves`, so a custom game that ever gains an
     * evasion or OHKO toggle would otherwise keep the base's answer and the
     * flags would be inert again — the exact defect this derivation fixes.
     */
    withClauseBans(rules);
    return {
      id: 'custom',
      name: settings.name || 'Custom Game',
      short: 'Custom',
      description: 'Player-configured ruleset.',
      custom: true,
      rules,
    };
  }

  function clampInt(value, min, max, fallback) {
    const n = Math.round(Number(value));
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  }

  /**
   * Smogon's ladder, strongest first.
   *
   * NFE and LC are deliberately **not** on it and have no format of their own
   * (project decision): unevolved Pokemon are simply absent from tier play here
   * rather than being given a tier they do not have. They carry no tier in the
   * packaged data, and `tierAllowed` refuses anything off this list, so they
   * cannot leak into a tier format from below.
   */
  const TIER_ORDER = ['AG', 'Ubers', 'OU', 'UU', 'RU', 'NU', 'PU', 'ZU'];
  const tierRank = tier => {
    const i = TIER_ORDER.indexOf(tier);
    return i === -1 ? TIER_ORDER.length : i;
  };
  /**
   * Is `tier` allowed in a format capped at `maxTier`? Cumulative-downward.
   *
   * A tier off the ladder entirely — NFE, LC, or nothing at all — is **not**
   * simply "below ZU". Treating an unknown tier as the weakest rung let all 152
   * NFE and 321 LC species into every tier format, including ZU, because their
   * rank compared as lower than ZU's. They are a separate category, and Little
   * Cup is a separate format.
   */
  const tierAllowed = (tier, maxTier) => {
    if (!maxTier) return true;
    if (!TIER_ORDER.includes(tier)) return false;
    return tierRank(tier) >= tierRank(maxTier);
  };

  /**
   * Items this set may not hold in this format, because of the forme they make.
   *
   * Returns `[{item, forme, tier}]`. Empty unless the format caps a tier. This
   * is the "ban the forme, not the Pokemon" rule: the species stays legal and
   * only the transformation is refused.
   */
  function illegalFormeItems(species, format) {
    const rules = get(format).rules;
    if (!rules.maxTier) return [];
    const entry = Dex.species(species);
    return (entry.formeItems || []).filter(f => f.item && !tierAllowed(f.tier, rules.maxTier));
  }

  /**
   * Formes an **ability** turns this species into, each with its own tier.
   *
   * The counterpart to `formeItems`, and the same rule underneath: **ban the
   * route, not the Pokémon.** Zygarde-10% is RU and Power Construct turns it
   * into Zygarde-Complete, which is Ubers — so Zygarde-10% plays in RU and
   * simply may not run Power Construct there. It keeps Aura Break and keeps
   * its tier.
   *
   * **Only for a species that has another ability to fall back on**, which is
   * the whole condition. Banning Stance Change does not restrict Aegislash, it
   * deletes it: that is Aegislash's only ability, and a Pokémon with no legal
   * ability cannot be built. Single-ability transformers — Aegislash,
   * Wishiwashi, Castform, Cherrim, Morpeko, Terapagos, Mimikyu, Eiscue — are
   * therefore excluded here and are tiered as one inseparable unit, which is
   * what their species tier already does.
   *
   * **Computed live rather than packaged**, unlike `formeItems`. A forme item's
   * tier can be an *estimate* the generator has to compute, so it must be baked
   * in; an ability forme is an ordinary packaged species whose tier is already
   * sitting in the data. Deriving it here means no third copy of the
   * from → to table — `Mechanics.ABILITY_FORMES` is the one source, read at call
   * time because `formats.js` loads before `mechanics.js` (§4).
   */
  function formeAbilities(species) {
    const entry = Dex.species(species);
    if (entry.missing) return [];
    const table = global.RedGPT.Mechanics?.ABILITY_FORMES;
    if (!table) return [];
    const own = Dex.abilityList(entry).map(Dex.toID);
    if (own.length < 2) return [];
    const out = [];
    for (const [abilityId, entries] of Object.entries(table)) {
      if (!own.includes(abilityId)) continue;
      for (const forme of entries) {
        if (Dex.toID(forme.from) !== entry.id) continue;
        const target = Dex.species(forme.to);
        if (!target || target.missing || out.some(f => f.id === target.id)) continue;
        out.push({
          ability: abilityId,
          abilityName: Dex.ability(abilityId)?.name || abilityId,
          id: target.id,
          forme: target.name,
          tier: target.tier,
          when: forme.when,
        });
      }
    }
    return out;
  }

  /** The forme-producing abilities this format refuses for this species. */
  function illegalFormeAbilities(species, format) {
    const rules = get(format).rules;
    if (!rules.maxTier) return [];
    return formeAbilities(species).filter(f => f.tier && !tierAllowed(f.tier, rules.maxTier));
  }

  /**
   * Formes this species reaches by USING A MOVE — the third route.
   *
   * Read live from `Mechanics.MOVE_FORMES` for the same reason `formeAbilities`
   * reads `ABILITY_FORMES`: the target is an ordinary packaged species whose
   * tier is already in the data, so deriving it here means no second copy of the
   * from → to table. `formats.js` loads before `mechanics.js` (§4), so the table
   * is fetched inside the function rather than at module scope.
   *
   * **There is no "must have another option" condition here, unlike the ability
   * half.** Refusing an ability can delete a Pokémon outright when it is the
   * only one it has — which is why `formeAbilities` requires two. A Pokémon
   * always has other moves, so refusing one only ever restricts it.
   *
   * **Only upward routes matter.** Relic Song toggles, so the table also carries
   * Pirouette → Meloetta; a route to a *lower* tier is no threat to the format
   * and `illegalFormeMoves` filters on the target's tier, which handles it.
   */
  function formeMoves(species) {
    const entry = Dex.species(species);
    if (entry.missing) return [];
    const table = global.RedGPT.Mechanics?.MOVE_FORMES;
    if (!table) return [];
    const out = [];
    for (const [moveId, entries] of Object.entries(table)) {
      if (!Dex.hasMove(moveId)) continue;
      for (const forme of entries) {
        if (Dex.toID(forme.from) !== entry.id) continue;
        const target = Dex.species(forme.to);
        if (!target || target.missing || out.some(f => f.id === target.id)) continue;
        out.push({
          move: moveId,
          moveName: Dex.move(moveId)?.name || moveId,
          id: target.id,
          forme: target.name,
          tier: target.tier,
          when: forme.when,
        });
      }
    }
    return out;
  }

  /** The forme-producing moves this format refuses for this species. */
  function illegalFormeMoves(species, format) {
    const rules = get(format).rules;
    if (!rules.maxTier) return [];
    return formeMoves(species).filter(f => f.tier && !tierAllowed(f.tier, rules.maxTier));
  }

  /**
   * Everything that *belongs to* one tier — strictly that rung.
   *
   * Deliberately **not** `speciesPool`, which is cumulative-downward because
   * that is what a format plays with: the OU pool contains 583 Pokémon, of which
   * only 60 are actually OU. For "show me what is in this tier" the cumulative
   * answer is the wrong one, and the useful one is the 60.
   *
   * **Megas are listed under their own tier, not their base's.** That is the
   * whole reason this cannot just filter `species.tier`: a Mega is not a species
   * here (§5 makes them `transformOnly`), it is an entry in the base species'
   * `formeItems` carrying the tier of the forme it produces. So Charizard
   * appears in ZU while Charizard-Mega-X and Mega-Y appear in OU, which is
   * exactly how Smogon ranks them.
   *
   * `estimated` is passed through so the UI can mark the 46 formes Smogon has
   * never ranked (§5) rather than presenting a nearest-neighbour guess as
   * imported data.
   *
   * @returns {{id, name, kind: 'species'|'forme', item, base, estimated}[]}
   */
  function tierRoster(tier) {
    const out = [];
    // Keyed by target forme, because two items can produce one: Giratina-Origin
    // comes from both the Griseous Orb and the Griseous Core, and listing it
    // twice would read as two different Pokémon.
    const seen = new Set();
    for (const species of Dex.allSpecies) {
      if (species.tier === tier && !seen.has(species.id)) {
        seen.add(species.id);
        out.push({id: species.id, name: species.name, kind: 'species', item: null, base: null, estimated: false});
      }
      for (const forme of species.formeItems || []) {
        if (forme.tier !== tier) continue;
        const target = Dex.species(forme.forme);
        if (!target || target.missing || seen.has(target.id)) continue;
        seen.add(target.id);
        out.push({
          id: target.id, name: target.name, kind: 'forme',
          item: forme.item || null, base: species.name,
          estimated: forme.tierSource === 'estimated',
        });
      }
      /*
       * Ability-produced formes count too, and until 2026-08-16 they did not.
       * **Ash-Greninja belonged to no tier at all**: it is `transformOnly`, so
       * the species branch above skips it, and no item produces it, so the
       * forme branch missed it as well — it was invisible to every roster,
       * count and tiering pass. Zygarde-Complete had the same hole from the
       * Zygarde-10% route.
       *
       * Listed with the `ability` that reaches it rather than an item, because
       * that is what a format bans to keep it out.
       */
      for (const forme of formeAbilities(species)) {
        if (forme.tier !== tier || seen.has(forme.id)) continue;
        seen.add(forme.id);
        out.push({
          id: forme.id, name: forme.forme, kind: 'forme',
          item: null, ability: forme.ability, base: species.name, estimated: false,
        });
      }
    }
    return out.sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Species pool a format allows, cached per format id. */
  const poolCache = new Map();
  function speciesPool(format) {
    const f = get(format);
    const key = f.custom ? JSON.stringify(f.rules) : f.id;
    if (poolCache.has(key)) return poolCache.get(key);
    const rules = f.rules;
    const banned = new Set((rules.bannedSpecies || []).map(Dex.toID));
    const pool = Dex.allSpecies.filter(s => {
      if (banned.has(s.id)) return false;
      if (!rules.allowNonstandard && s.nonstandard) return false;
      if (!rules.allowBattleOnly && (s.battleOnly || s.requiredItem)) return false;
      if (!rules.allowRestricted && s.powerClass === 'restricted') return false;
      if (!rules.allowUnrestrictedOnly && s.powerClass === 'unrestricted-only') return false;
      /*
       * A tier format admits its own tier and everything below it. `minTier`
       * exists for Little Cup, which is the one format that excludes what is
       * *above* it rather than below.
       */
      if (rules.maxTier && !tierAllowed(s.tier, rules.maxTier)) return false;
      return true;
    });
    poolCache.set(key, pool);
    return pool;
  }

  global.RedGPT.Formats = {
    list, get, custom, speciesPool, FORMATS, DEFAULT_FORMAT,
    TIER_ORDER, tierRank, tierAllowed, illegalFormeItems, tierRoster,
    formeAbilities, illegalFormeAbilities,
    formeMoves, illegalFormeMoves,
    EVASION_MOVES, OHKO_MOVES, clauseBannedMoves,
  };
})(typeof window !== 'undefined' ? window : globalThis);
