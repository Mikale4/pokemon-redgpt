/**
 * Plain-text team import/export.
 *
 * The syntax is the familiar competitive team format, so teams can be moved
 * between RedGPT and anything else that reads it:
 *
 *   Gengar @ Focus Sash
 *   Ability: Cursed Body
 *   Level: 100
 *   Tera Type: Ghost
 *   EVs: 4 Def / 252 SpA / 252 Spe
 *   Timid Nature
 *   IVs: 0 Atk
 *   - Shadow Ball
 *   - Sludge Bomb
 *   - Focus Blast
 *   - Destiny Bond
 *
 * Import never throws: it returns the sets it could parse plus a per-set list
 * of errors identifying exactly which block failed and why.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Dex = RedGPT.Dex;
  const PokemonLib = RedGPT.Pokemon;
  const {STATS} = Dex;

  const EV_LABELS = {hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe'};
  const LABEL_TO_STAT = {
    hp: 'hp', atk: 'atk', at: 'atk', def: 'def', df: 'def',
    spa: 'spa', spatk: 'spa', spattack: 'spa', specialattack: 'spa', sa: 'spa',
    spd: 'spd', spdef: 'spd', spdefense: 'spd', specialdefense: 'spd', sd: 'spd',
    spe: 'spe', spd_: 'spd', speed: 'spe', sp: 'spe',
  };

  function statFromLabel(label) {
    return LABEL_TO_STAT[Dex.toID(label)] || null;
  }

  /* ----------------------------- export ----------------------------- */

  function exportSet(rawSet) {
    const set = PokemonLib.normalizeSet(rawSet);
    const species = Dex.species(set.species);
    const lines = [];

    let header = set.nickname && set.nickname !== species.name ? `${set.nickname} (${species.name})` : species.name;
    if (set.gender === 'M' || set.gender === 'F') header += ` (${set.gender})`;
    if (set.item) header += ` @ ${Dex.item(set.item).name}`;
    lines.push(header);

    if (set.ability) lines.push(`Ability: ${set.ability}`);
    if (set.level !== 100) lines.push(`Level: ${set.level}`);
    if (set.shiny) lines.push('Shiny: Yes');
    if (set.teraType) lines.push(`Tera Type: ${set.teraType}`);

    const evParts = STATS.filter(s => set.evs[s] > 0).map(s => `${set.evs[s]} ${EV_LABELS[s]}`);
    if (evParts.length) lines.push(`EVs: ${evParts.join(' / ')}`);

    const nature = Dex.nature(set.nature);
    if (nature) lines.push(`${nature.name} Nature`);

    const ivParts = STATS.filter(s => set.ivs[s] !== 31).map(s => `${set.ivs[s]} ${EV_LABELS[s]}`);
    if (ivParts.length) lines.push(`IVs: ${ivParts.join(' / ')}`);

    for (const moveId of set.moves) {
      const move = Dex.move(moveId);
      lines.push(`- ${move.missing ? moveId : move.name}`);
    }
    return lines.join('\n');
  }

  function exportTeam(team) {
    const sets = Array.isArray(team?.sets) ? team.sets : team;
    return sets.map(exportSet).join('\n\n') + '\n';
  }

  /* ----------------------------- import ----------------------------- */

  /** Split raw text into per-Pokémon blocks on blank lines. */
  function splitBlocks(text) {
    const blocks = [];
    let current = [];
    for (const rawLine of String(text || '').replace(/\r/g, '').split('\n')) {
      const line = rawLine.trim();
      if (!line) {
        if (current.length) { blocks.push(current); current = []; }
        continue;
      }
      current.push(line);
    }
    if (current.length) blocks.push(current);
    return blocks;
  }

  function parseHeader(line, errors, label) {
    const result = {nickname: null, species: null, gender: null, item: null};
    let rest = line;

    const atIndex = rest.lastIndexOf('@');
    if (atIndex > 0) {
      const itemName = rest.slice(atIndex + 1).trim();
      rest = rest.slice(0, atIndex).trim();
      const item = Dex.item(itemName);
      if (!item) errors.push(`${label}: unknown held item "${itemName}".`);
      else result.item = item.id;
    }

    const genderMatch = /\((M|F|N)\)\s*$/i.exec(rest);
    if (genderMatch) {
      result.gender = genderMatch[1].toUpperCase();
      rest = rest.slice(0, genderMatch.index).trim();
    }

    const parenMatch = /^(.*)\(([^()]+)\)\s*$/.exec(rest);
    if (parenMatch) {
      result.nickname = parenMatch[1].trim();
      result.species = parenMatch[2].trim();
    } else {
      result.species = rest.trim();
    }
    return result;
  }

  function parseStatLine(value, errors, label, kind) {
    const out = {};
    for (const part of String(value).split('/')) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const match = /^(\d+)\s+(.+)$/.exec(trimmed) || /^(.+?)\s+(\d+)$/.exec(trimmed);
      if (!match) {
        errors.push(`${label}: could not read ${kind} entry "${trimmed}".`);
        continue;
      }
      const number = /^\d+$/.test(match[1]) ? Number(match[1]) : Number(match[2]);
      const statLabel = /^\d+$/.test(match[1]) ? match[2] : match[1];
      const stat = statFromLabel(statLabel);
      if (!stat) {
        errors.push(`${label}: "${statLabel}" is not a stat name.`);
        continue;
      }
      out[stat] = number;
    }
    return out;
  }

  /**
   * @returns {{sets: Array, errors: Array<string>, blocks: number}}
   */
  function importTeam(text) {
    const blocks = splitBlocks(text);
    const sets = [];
    const errors = [];

    if (!blocks.length) return {sets, errors: ['No Pokémon were found in the pasted text.'], blocks: 0};

    blocks.forEach((lines, blockIndex) => {
      const label = `Set ${blockIndex + 1}`;
      const blockErrors = [];
      const header = parseHeader(lines[0], blockErrors, label);
      const species = Dex.species(header.species);
      if (!Dex.hasSpecies(header.species)) {
        errors.push(`${label}: "${header.species}" is not a Pokémon in the packaged dataset.`);
        errors.push(...blockErrors);
        return;
      }

      const set = {
        species: species.id,
        nickname: header.nickname && header.nickname !== species.name ? header.nickname : null,
        gender: header.gender || PokemonLib.defaultGender(species),
        item: header.item,
        level: 100,
        ability: null,
        nature: 'serious',
        teraType: null,
        shiny: false,
        moves: [],
        evs: PokemonLib.zeroStats(),
        ivs: PokemonLib.maxIVs(),
      };

      for (const line of lines.slice(1)) {
        if (line.startsWith('-') || line.startsWith('~')) {
          let moveName = line.slice(1).trim();
          // Hidden Power / Return style suffixes are kept out of the lookup.
          moveName = moveName.replace(/\s*\[[^\]]*\]\s*$/, '');
          const move = Dex.move(moveName);
          if (!Dex.hasMove(moveName)) {
            errors.push(`${label}: "${moveName}" is not a move in the packaged database.`);
            continue;
          }
          if (set.moves.length >= 4) {
            errors.push(`${label}: more than four moves listed; "${move.name}" was ignored.`);
            continue;
          }
          set.moves.push(move.id);
          continue;
        }

        const natureMatch = /^(.+?)\s+Nature\b/i.exec(line);
        if (natureMatch) {
          const nature = Dex.nature(natureMatch[1]);
          if (!nature || Dex.toID(nature.name) !== Dex.toID(natureMatch[1])) {
            errors.push(`${label}: "${natureMatch[1]}" is not a nature.`);
          } else {
            set.nature = nature.id;
          }
          continue;
        }

        const colon = line.indexOf(':');
        if (colon < 0) {
          errors.push(`${label}: could not interpret the line "${line}".`);
          continue;
        }
        const key = Dex.toID(line.slice(0, colon));
        const value = line.slice(colon + 1).trim();

        switch (key) {
          case 'ability': {
            const ability = Dex.ability(value);
            if (!ability) errors.push(`${label}: "${value}" is not an ability.`);
            else set.ability = ability.name;
            break;
          }
          case 'level': {
            const level = Number(value);
            if (!Number.isFinite(level) || level < 1 || level > 100) errors.push(`${label}: level "${value}" must be 1-100.`);
            else set.level = Math.round(level);
            break;
          }
          case 'shiny': set.shiny = /^(yes|true)$/i.test(value); break;
          case 'teratype': {
            const type = Dex.TYPES.find(t => Dex.toID(t) === Dex.toID(value));
            if (!type) errors.push(`${label}: "${value}" is not a Tera Type.`);
            else set.teraType = type;
            break;
          }
          case 'evs': Object.assign(set.evs, parseStatLine(value, errors, label, 'EV')); break;
          case 'ivs': Object.assign(set.ivs, parseStatLine(value, errors, label, 'IV')); break;
          case 'happiness': set.happiness = Number(value) || 255; break;
          case 'gender': set.gender = value.toUpperCase().slice(0, 1); break;
          case 'nickname': set.nickname = value; break;
          case 'dynamaxlevel': case 'gigantamax': case 'shinyleaf': case 'pokeball': case 'hiddenpowertype':
            break; // Recognised but not used by RedGPT.
          default:
            errors.push(`${label}: unrecognised field "${line.slice(0, colon)}".`);
        }
      }

      if (!set.ability) set.ability = Dex.abilityList(species)[0] || 'No Ability';
      if (!set.teraType) set.teraType = species.types[0] || 'Normal';
      if (!set.moves.length) errors.push(`${label}: no moves were listed.`);
      errors.push(...blockErrors);
      sets.push(PokemonLib.normalizeSet(set));
    });

    return {sets, errors, blocks: blocks.length};
  }

  global.RedGPT.TeamText = {exportSet, exportTeam, importTeam, splitBlocks};
})(typeof window !== 'undefined' ? window : globalThis);
