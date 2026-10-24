/**
 * Team validation.
 *
 * The validator reports problems; it never silently repairs a team. An explicit
 * `autoFix` entry point exists for the Team Builder's "Fix legality" button, and
 * it is only ever called when the player asks for it.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Dex = RedGPT.Dex;
  const PokemonLib = RedGPT.Pokemon;
  const Formats = RedGPT.Formats;
  const Abilities = RedGPT.Abilities;
  const Items = RedGPT.Items;

  const {STATS} = Dex;

  function setLabel(set, index) {
    const name = set?.nickname || Dex.species(set?.species).name;
    return `Set ${index + 1} (${name})`;
  }

  /**
   * @returns {{valid: boolean, errors: Array<{setIndex, field, message}>, warnings: Array}}
   */
  function validateTeam(team, formatValue) {
    const format = Formats.get(formatValue);
    const rules = format.rules;
    const errors = [];
    const warnings = [];
    const sets = Array.isArray(team?.sets) ? team.sets : Array.isArray(team) ? team : [];

    const push = (setIndex, field, message) => errors.push({setIndex, field, message});
    const warn = (setIndex, field, message) => warnings.push({setIndex, field, message});

    if (!sets.length) {
      push(null, 'team', 'The team is empty. Add at least one Pokémon.');
      return {valid: false, errors, warnings, format};
    }
    if (sets.length > (rules.teamSize || 6)) {
      push(null, 'team', `${format.name} allows at most ${rules.teamSize} Pokémon; this team has ${sets.length}.`);
    }
    if (rules.minTeamSize && sets.length < rules.minTeamSize) {
      push(null, 'team', `${format.name} requires at least ${rules.minTeamSize} Pokémon; this team has ${sets.length}.`);
    }

    const seenSpecies = new Map();
    const seenItems = new Map();
    // Items limited to one per team regardless of Item Clause — see below.
    const seenUnique = new Map();
    let restrictedCount = 0;
    const bannedSpecies = new Set((rules.bannedSpecies || []).map(Dex.toID));
    const bannedMoves = new Set((rules.bannedMoves || []).map(Dex.toID));
    const bannedItems = new Set((rules.bannedItems || []).map(Dex.toID));
    const bannedAbilities = new Set((rules.bannedAbilities || []).map(Dex.toID));

    sets.forEach((raw, index) => {
      const set = PokemonLib.normalizeSet(raw);
      const species = Dex.species(set.species);
      const label = setLabel(raw, index);

      if (!Dex.hasSpecies(raw.species) || species.missing) {
        push(index, 'species', `${label}: "${raw.species}" is not a Pokémon in the packaged dataset.`);
        return;
      }
      if (bannedSpecies.has(species.id)) {
        push(index, 'species', `${label}: ${species.name} is banned in ${format.name}.`);
      }
      if (!rules.allowNonstandard && species.nonstandard) {
        push(index, 'species', `${label}: ${species.name} is a ${species.nonstandard}-generation forme and is not legal in ${format.name}.`);
      }
      // Transform-only formes exist purely as the result of an in-battle
      // change (Greninja-Ash). They are never selectable, in any format.
      if (species.transformOnly) {
        push(index, 'species', `${label}: ${species.name} only exists as an in-battle transformation and cannot be added to a team. Use ${species.changesFrom || species.baseSpecies} instead.`);
      }
      if (!rules.allowBattleOnly && (species.battleOnly || species.requiredItem)) {
        push(index, 'species', `${label}: ${species.name} is a battle-only forme. ${format.name} does not allow it; use ${species.battleOnly || species.changesFrom || 'the base forme'} instead, or switch to Anything Goes.`);
      }
      if (species.powerClass === 'restricted') {
        restrictedCount++;
        if (!rules.allowRestricted) {
          push(index, 'species', `${label}: ${species.name} is a restricted Pokémon and is not legal in ${format.name}.`);
        }
      }
      if (species.powerClass === 'unrestricted-only' && !rules.allowUnrestrictedOnly) {
        push(index, 'species', `${label}: ${species.name} is only legal in Anything Goes.`);
      }
      /*
       * The tier ceiling. `Formats.speciesPool` has always filtered on this, but
       * the pool is what the *pickers* offer — the validator is what a built or
       * imported team is actually checked against, and it never asked. So a
       * Mewtwo (Ubers) validated cleanly in OU, UU and even ZU.
       *
       * It went unnoticed while Standard Singles was the default: that format
       * had no `maxTier` and blocked Mewtwo through `allowRestricted: false`
       * instead. Removing Standard and defaulting to OU (2026-08-14) put the
       * tier ladder on the main path, where the gap is the whole ruleset.
       *
       * Deliberately `Formats.tierAllowed`, the same predicate `speciesPool`
       * uses, rather than a second copy of the comparison — and untiered
       * Pokémon (NFE and LC, which this project does not tier, §5) are refused
       * by it, exactly as the pool refuses them.
       */
      if (rules.maxTier && !Formats.tierAllowed(species.tier, rules.maxTier)) {
        push(index, 'species', species.tier
          ? `${label}: ${species.name} is ${species.tier} tier and is not legal in ${format.name}.`
          : `${label}: ${species.name} is not ranked in any tier, so it cannot be used in ${format.name}.`);
      }

      // Species Clause compares base species so different formes still clash.
      const speciesKey = Dex.toID(species.baseSpecies || species.name);
      if (rules.speciesClause) {
        if (seenSpecies.has(speciesKey)) {
          push(index, 'species', `${label}: Species Clause — ${species.baseSpecies} already appears as set ${seenSpecies.get(speciesKey) + 1}.`);
        } else {
          seenSpecies.set(speciesKey, index);
        }
      }

      // Level
      if (set.level < 1 || set.level > 100) {
        push(index, 'level', `${label}: level must be between 1 and 100.`);
      }
      if (rules.forceLevel && raw.level && raw.level !== rules.forceLevel) {
        warn(index, 'level', `${label}: ${format.name} sets every Pokémon to level ${rules.forceLevel}; the stored level ${raw.level} will be overridden.`);
      }
      if (rules.maxLevel && set.level > rules.maxLevel) {
        push(index, 'level', `${label}: level ${set.level} exceeds the ${rules.maxLevel} cap for ${format.name}.`);
      }

      // Ability
      const legalAbilities = Dex.abilityList(species);
      if (!legalAbilities.some(a => Dex.toID(a) === Dex.toID(set.ability))) {
        push(index, 'ability', `${label}: ${species.name} cannot have ${set.ability}. Legal abilities: ${legalAbilities.join(', ')}.`);
      }
      if (bannedAbilities.has(Dex.toID(set.ability))) {
        push(index, 'ability', `${label}: ${set.ability} is banned in ${format.name}.`);
      }
      /*
       * Ban the route, not the Pokémon — the ability half of the Absol/Absolite
       * rule. Zygarde-10% is RU and Power Construct turns it into
       * Zygarde-Complete, which is Ubers, so it plays in RU without that
       * ability and keeps Aura Break.
       *
       * This is also the gate §10 records as the prerequisite for dropping a
       * species whose forme outranks it: before it existed, `maxTier` was
       * checked when validating a team and *never* in battle, so a lower-tier
       * base transformed into a higher-tier forme for free.
       */
      for (const forme of Formats.illegalFormeAbilities(species, format)) {
        if (forme.ability !== Dex.toID(set.ability)) continue;
        push(index, 'ability', `${label}: ${forme.abilityName} is banned in ${format.name} — ` +
          `it turns ${species.name} into ${forme.forme}, which is ${forme.tier}. ` +
          `${species.name} itself is legal here with another ability.`);
      }
      if (!Abilities.isSimulated(set.ability)) {
        warn(index, 'ability', `${label}: ${set.ability} has no battle implementation in this build and will do nothing.`);
      }

      // Item
      if (set.item) {
        const item = Dex.item(set.item);
        if (!item) {
          push(index, 'item', `${label}: "${raw.item}" is not a known held item.`);
        } else {
          if (bannedItems.has(item.id)) push(index, 'item', `${label}: ${item.name} is banned in ${format.name}.`);
          /*
           * Ban the forme, not the Pokémon.
           *
           * A tier format admits a species on its own tier, but an item that
           * turns it into something the tier could not handle is refused —
           * Absol plays in PU and Absolite does not. The species stays legal,
           * which is the whole point: losing Absol from PU because Mega Absol is
           * RU would be the wrong correction.
           *
           * (This replaces a warning that claimed Mega Evolution was not
           * simulated. It has been a real in-battle mechanic since §5, so the
           * message was telling players the opposite of the truth.)
           */
          for (const forme of Formats.illegalFormeItems(species, format)) {
            if (Dex.toID(forme.item) !== item.id) continue;
            push(index, 'item', `${label}: ${item.name} is banned in ${format.name} — ` +
              `it turns ${species.name} into ${forme.forme}, which is ${forme.tier}. ${species.name} itself is legal here.`);
          }
          if (rules.itemClause) {
            if (seenItems.has(item.id)) {
              push(index, 'item', `${label}: Item Clause — ${item.name} is already held by set ${seenItems.get(item.id) + 1}.`);
            } else {
              seenItems.set(item.id, index);
            }
          }
          /*
           * Ring Target Clause: one per team, in **every** format, whether or
           * not Item Clause is on. The item turns a type immunity into neutral
           * damage, which is the hardest read in the game, and a team stacking
           * several has no counterplay left to find. `battle.canReceiveItem`
           * enforces the same limit in battle, so it cannot be assembled with
           * Trick, Bestow or a steal either.
           */
          if (Items.get(item.id)?.uniquePerSide) {
            if (seenUnique.has(item.id)) {
              push(index, 'item', `${label}: ${item.name} Clause — only one ${item.name} per team, ` +
                `and set ${seenUnique.get(item.id) + 1} already holds one.`);
            } else {
              seenUnique.set(item.id, index);
            }
          }
          if (!Items.isSimulated(item.id)) {
            warn(index, 'item', `${label}: ${item.name} has no battle implementation in this build and will do nothing.`);
          }
          /*
           * "This item only does something for X" — unless the item's whole job
           * is to *turn this Pokémon into* X.
           *
           * `itemUser` names the forme the item is for, and for eight of the
           * twelve forme-item pairs that is the **target**, not the holder: the
           * Rusted Sword says Zacian-Crowned, the Adamant Crystal says
           * Dialga-Origin, each Ogerpon Mask says its own masked forme. So a
           * Zacian holding a Rusted Sword — the only supported route to
           * Zacian-Crowned — was told the item does nothing for it, directly
           * under a card reading "Enters battle as Zacian-Crowned". The note and
           * the card cannot both be right.
           *
           * Predates the Masks (five species had it) and is fixed once here
           * rather than per item: `heldForme` already answers "does this set's
           * item produce a forme", and it is the same function the Team Builder
           * card draws from, so the two can no longer disagree.
           */
          const producesForme = !!RedGPT.Mechanics?.heldForme?.(set);
          if (!producesForme && item.itemUser && item.itemUser.length &&
              !item.itemUser.some(n => Dex.toID(n) === species.id)) {
            warn(index, 'item', `${label}: ${item.name} only does something for ${item.itemUser.join(', ')}.`);
          }
        }
      }

      // Nature
      if (!Dex.allNatures[Dex.toID(set.nature)]) {
        push(index, 'nature', `${label}: "${raw.nature}" is not a nature.`);
      }

      // Tera
      if (rules.tera && set.teraType && !Dex.TYPES.includes(set.teraType)) {
        push(index, 'tera', `${label}: "${set.teraType}" is not a valid Tera Type.`);
      }

      // Moves
      if (!set.moves.length) {
        push(index, 'moves', `${label}: at least one move is required.`);
      }
      if (set.moves.length > 4) {
        push(index, 'moves', `${label}: a Pokémon can know at most four moves.`);
      }
      const seenMoves = new Set();
      set.moves.forEach((moveId, slot) => {
        const move = Dex.move(moveId);
        if (!Dex.hasMove(moveId)) {
          push(index, `move${slot}`, `${label}: move ${slot + 1} "${moveId}" is not in the packaged move database.`);
          return;
        }
        if (seenMoves.has(move.id)) {
          push(index, `move${slot}`, `${label}: ${move.name} is listed twice.`);
        }
        seenMoves.add(move.id);
        if (!Dex.canLearn(species, move.id)) {
          push(index, `move${slot}`, `${label}: ${species.name} cannot learn ${move.name}.`);
        }
        if (bannedMoves.has(move.id)) {
          push(index, `move${slot}`, `${label}: ${move.name} is banned in ${format.name}.`);
        }
        /*
         * Ban the route, not the Pokémon — the MOVE half, and the third of the
         * three. Meloetta is NU and Relic Song turns it into
         * Meloetta-Pirouette, which is RU, so Meloetta plays in NU without the
         * move. The item half is `illegalFormeItems` and the ability half is
         * `illegalFormeAbilities`; this closes the gap §10 recorded as a
         * blocker, and it is the prerequisite for Relic Song existing at all.
         */
        for (const forme of Formats.illegalFormeMoves(species, format)) {
          if (forme.move !== move.id) continue;
          push(index, `move${slot}`, `${label}: ${forme.moveName} is banned in ${format.name} — ` +
            `it turns ${species.name} into ${forme.forme}, which is ${forme.tier}. ` +
            `${species.name} itself is legal here without it.`);
        }
      });

      // EVs and IVs. The raw values are checked as well as the normalised ones:
      // normalisation clamps out-of-range input, and silently accepting an
      // impossible spread would be exactly the sort of quiet repair the
      // validator exists to prevent.
      const evStatLimit = rules.evStatLimit ?? 252;
      const ivMax = rules.ivMax ?? 31;
      const evTotal = PokemonLib.evTotal(set.evs);
      const evLimit = rules.evLimit ?? 510;
      const rawEvTotal = STATS.reduce((sum, stat) => sum + (Number(raw.evs?.[stat]) || 0), 0);
      if (Math.max(evTotal, rawEvTotal) > evLimit) {
        push(index, 'evs', `${label}: ${Math.max(evTotal, rawEvTotal)} EVs used, but the limit is ${evLimit}.`);
      }
      for (const stat of STATS) {
        const value = raw.evs?.[stat] === undefined ? set.evs[stat] : Number(raw.evs[stat]);
        if (!Number.isInteger(value) || value < 0 || value > evStatLimit) {
          push(index, 'evs', `${label}: ${Dex.STAT_NAMES[stat]} EVs must be a whole number between 0 and ${evStatLimit}.`);
        }
        const iv = raw.ivs?.[stat] === undefined ? set.ivs[stat] : Number(raw.ivs[stat]);
        if (!Number.isInteger(iv) || iv < 0 || iv > ivMax) {
          push(index, 'ivs', `${label}: ${Dex.STAT_NAMES[stat]} IVs must be a whole number between 0 and ${ivMax}.`);
        }
      }
    });

    if (rules.allowRestricted && rules.restrictedLimit != null && restrictedCount > rules.restrictedLimit) {
      push(null, 'team', `${format.name} allows at most ${rules.restrictedLimit} restricted Pokémon; this team has ${restrictedCount}.`);
    }

    return {valid: errors.length === 0, errors, warnings, format};
  }

  /**
   * Repair a team so it passes `validateTeam`. Only invoked from an explicit
   * player action; returns the fixed team plus a list of what changed.
   */
  function autoFix(team, formatValue) {
    const format = Formats.get(formatValue);
    const rules = format.rules;
    const sets = (Array.isArray(team?.sets) ? team.sets : team).map(s => PokemonLib.normalizeSet(s));
    const changes = [];
    const pool = Formats.speciesPool(format);
    const poolIds = new Set(pool.map(s => s.id));
    const seenSpecies = new Set();
    const seenItems = new Set();
    const bannedMoves = new Set((rules.bannedMoves || []).map(Dex.toID));

    const fixed = [];
    for (const set of sets.slice(0, rules.teamSize || 6)) {
      const original = Dex.species(set.species);
      let species = original;
      if (!poolIds.has(species.id)) {
        const replacement = pool.find(s => Dex.toID(s.baseSpecies) === Dex.toID(species.baseSpecies)) || null;
        if (replacement) {
          changes.push(`${species.name} → ${replacement.name} (not legal in ${format.name})`);
          species = replacement;
        } else {
          changes.push(`Removed ${species.name} (not legal in ${format.name})`);
          continue;
        }
      }
      const key = Dex.toID(species.baseSpecies);
      if (rules.speciesClause && seenSpecies.has(key)) {
        changes.push(`Removed duplicate ${species.name} (Species Clause)`);
        continue;
      }
      seenSpecies.add(key);
      set.species = species.id;

      const legalAbilities = Dex.abilityList(species);
      if (!legalAbilities.some(a => Dex.toID(a) === Dex.toID(set.ability))) {
        changes.push(`${species.name}: ability ${set.ability} → ${legalAbilities[0]}`);
        set.ability = legalAbilities[0];
      }
      /*
       * A forme-producing ability the format refuses is swapped for one it
       * allows, rather than the Pokémon being removed — which is the entire
       * point of banning the ability instead of the species. `formeAbilities`
       * only ever reports a species that has an alternative, so there is always
       * something to fall back to.
       */
      const bannedFormeAbilities = new Set(Formats.illegalFormeAbilities(species, format).map(f => f.ability));
      if (bannedFormeAbilities.has(Dex.toID(set.ability))) {
        const replacement = legalAbilities.find(a => !bannedFormeAbilities.has(Dex.toID(a)));
        if (replacement) {
          changes.push(`${species.name}: ability ${set.ability} → ${replacement} (its forme is banned in ${format.name})`);
          set.ability = replacement;
        }
      }
      if (set.item) {
        const item = Dex.item(set.item);
        if (!item || (rules.itemClause && seenItems.has(item.id))) {
          changes.push(`${species.name}: removed held item`);
          set.item = null;
        } else {
          seenItems.add(item.id);
        }
      }
      // The forme-move gate has to reach autoFix too, or the button repairs a
      // team into one the validator still refuses.
      const formeMoveBans = new Set(Formats.illegalFormeMoves(species, format).map(f => f.move));
      const legalMoves = set.moves.filter(id =>
        Dex.canLearn(species, id) && !bannedMoves.has(Dex.toID(id)) && !formeMoveBans.has(Dex.toID(id)));
      if (legalMoves.length !== set.moves.length) {
        changes.push(`${species.name}: removed ${set.moves.length - legalMoves.length} illegal move(s)`);
      }
      set.moves = legalMoves;
      if (set.moves.length < 1) {
        const filled = PokemonLib.fillMoves(set);
        set.moves = filled.moves;
        changes.push(`${species.name}: filled empty moveset with level-up moves`);
      }
      let total = PokemonLib.evTotal(set.evs);
      const evLimit = rules.evLimit ?? 510;
      for (const stat of STATS) {
        set.evs[stat] = Math.max(0, Math.min(rules.evStatLimit ?? 252, set.evs[stat]));
        set.ivs[stat] = Math.max(0, Math.min(rules.ivMax ?? 31, set.ivs[stat]));
      }
      total = PokemonLib.evTotal(set.evs);
      if (total > evLimit) {
        for (const stat of [...STATS].reverse()) {
          if (total <= evLimit) break;
          const reduce = Math.min(set.evs[stat], total - evLimit);
          set.evs[stat] -= reduce;
          total -= reduce;
        }
        changes.push(`${species.name}: trimmed EVs to ${evLimit}`);
      }
      if (rules.forceLevel) set.level = rules.forceLevel;
      fixed.push(set);
    }
    return {sets: fixed, changes};
  }

  global.RedGPT.Validation = {validateTeam, autoFix};
})(typeof window !== 'undefined' ? window : globalThis);
