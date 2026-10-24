/**
 * Pokémon RedGPT data generator.
 *
 * Produces the packaged battle dataset from @pkmn/dex + @pkmn/data and the
 * bundled sprite library. A species is only enabled for play when every one of
 * the following is true:
 *
 *   1. @pkmn/dex has valid species data for it (types, six base stats, abilities)
 *   2. a front sprite exists in Assets/Sprites/Pokemon Sprites/Front
 *   3. a back sprite exists in Assets/Sprites/Pokemon Sprites/Back
 *   4. a resolvable learnset with at least one damaging move exists
 *
 * Sprites are matched by an explicit key derived from the Dex base species and
 * forme; never by falling back to a different forme's artwork. Everything that
 * fails to match is written to docs/DATA_REPORT.md.
 *
 * Run with:  npm run build:data
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {Dex} = require('@pkmn/dex');
const {Generations} = require('@pkmn/data');

const ROOT = path.resolve(__dirname, '..');
const dex = Dex.forGen(9);
const gens = new Generations(Dex);
const gen = gens.get(9);

const STATS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const STAT_NAMES = {hp: 'HP', atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed'};
const SPRITE_DIR = path.join(ROOT, 'Assets', 'Sprites', 'Pokemon Sprites');
const ITEM_SPRITE_DIR = path.join(ROOT, 'Assets', 'Sprites', 'Items');
const CRY_DIR = path.join(ROOT, 'Assets', 'Audio', 'Cries');

/* ------------------------------------------------------------------ *
 * Sprite indexing
 * ------------------------------------------------------------------ */

const stripAccents = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
/** Filename/lookup key: uppercase, accent-free, punctuation collapsed, `%` kept. */
const spriteKey = s => stripAccents(s).toUpperCase().replace(/[^A-Z0-9%]+/g, ' ').trim();
/** Base species key: all punctuation removed entirely (HO-OH -> HOOH). */
const compactKey = s => stripAccents(s).toUpperCase().replace(/[^A-Z0-9%]+/g, '');

function indexSprites(dir) {
  const map = new Map();
  for (const file of fs.readdirSync(dir)) {
    if (!/\.(png|jpg|jpeg|webp)$/i.test(file)) continue;
    map.set(spriteKey(path.parse(file).name), file);
  }
  return map;
}

const frontSprites = indexSprites(path.join(SPRITE_DIR, 'Front'));
const backSprites = indexSprites(path.join(SPRITE_DIR, 'Back'));

/** Base species whose sprite filename does not follow the compact rule. */
const BASE_SPRITE_ALIASES = {
  'Nidoran-F': 'NIDORAN FEMALE',
  'Nidoran-M': 'NIDORAN MALE',
};

/**
 * Base formes whose *own* artwork is filed under a forme name.
 *
 * Ogerpon is the case this exists for. The dex calls its base forme plain
 * "Ogerpon" with an empty `forme`, so `spriteCandidates` asked for `OGERPON`
 * while the artwork indexes as `OGERPON TEAL MASKED` — and the species was
 * dropped for "no sprite pair" with both files sitting on disk. That is the
 * Oricorio-Pa'u shape (§9) one level up: the datum is fine and the key is
 * wrong. It mattered because base Ogerpon is the *holder* of all three Masks,
 * so without it the whole line has no supported route into a tier format.
 *
 * **Deliberately a separate table from `BASE_SPRITE_ALIASES`**, which
 * substitutes the base half of *every* forme's key. Putting Ogerpon there would
 * ask for `OGERPON TEAL MASKED WELLSPRING MASKED` and drop the three masked
 * formes that currently work — a fix that breaks three species to recover one.
 * Keyed on the species name, and tried *before* the plain compact key so the
 * ordinary rule still wins wherever it already matches.
 */
const BASE_FORME_SPRITE_ALIASES = {
  Ogerpon: 'OGERPON TEAL MASKED',
};

/**
 * Forme suffixes whose sprite filename spells the forme differently from the
 * Dex forme name. Keys are the Dex forme string.
 */
const FORME_SPRITE_ALIASES = {
  'Pom-Pom': 'POMPOM',
  'Bond': 'ASH',
  'Wellspring': 'WELLSPRING MASKED',
  'Hearthflame': 'HEARTHFLAME MASKED',
  'Cornerstone': 'CORNERSTONE MASKED',
  'Teal-Tera': 'TEAL MASKED TERA',
  'Wellspring-Tera': 'WELLSPRING MASKED TERA',
  'Hearthflame-Tera': 'HEARTHFLAME MASKED TERA',
  'Cornerstone-Tera': 'CORNERSTONE MASKED TERA',
};

function spriteCandidates(species) {
  const base = BASE_SPRITE_ALIASES[species.baseSpecies] || compactKey(species.baseSpecies);
  const forme = species.forme || '';
  if (!forme) return [...new Set([base, BASE_FORME_SPRITE_ALIASES[species.name]].filter(Boolean))];
  const aliased = FORME_SPRITE_ALIASES[forme];
  const variants = new Set();
  if (aliased) variants.add(`${base} ${aliased}`);
  variants.add(`${base} ${spriteKey(forme)}`);
  /*
   * The base half has always used `compactKey`, which deletes punctuation, but
   * the forme half used `spriteKey`, which turns it into a *space* — so
   * `Pa'u` asked for `ORICORIO PA U` while the file indexes as `ORICORIO PAU`,
   * and Oricorio-Pa'u was dropped for "no sprite pair" with both sprites
   * sitting on disk. `Pom-Pom` hit the same wall and was patched by hand in
   * FORME_SPRITE_ALIASES above; this covers the shape generally.
   *
   * Added last, so the aliases and the exact spaced spelling still win first.
   * Measured across all 1,416 upstream species: it recovers exactly one
   * (Oricorio-Pa'u), collides with nothing, and leaves the other 146
   * unmatched formes unmatched — those are genuinely missing artwork (Gmax,
   * Totem, the Pikachu costumes).
   */
  variants.add(`${base} ${compactKey(forme)}`);
  return [...variants];
}

/**
 * A Mega's artwork is named after ITS HOLDER's artwork, plus " MEGA".
 *
 * `spriteCandidates` builds `<baseSpecies> <forme>`, which is right for
 * Charizard-Mega-X and wrong whenever the holder is not the plain base forme —
 * and three Megas were being dropped for "no sprite pair" with complete
 * front+back pairs sitting on disk:
 *
 *   Floette-Mega          asked FLOETTE MEGA            disk FLOETTE ETERNAL MEGA
 *   Meowstic-M-Mega       asked MEOWSTIC M MEGA         disk MEOWSTIC MEGA
 *   Tatsugiri-Curly-Mega  asked TATSUGIRI CURLY MEGA    disk TATSUGIRI MEGA
 *
 * The three look like three different problems and are one: the file is named
 * after the holder. Floette-Eternal's own sprite is `FLOETTE ETERNAL`, and
 * Meowstic-M's and Tatsugiri-Curly's are the plain `MEOWSTIC` and `TATSUGIRI`
 * because those are each species' default forme. Resolve the holder's key first,
 * append " MEGA", and all three land.
 *
 * §9's rule applied: a *second* hand-written alias for one shape means the rule
 * is wrong rather than the datum, and this was the third.
 *
 * Tried last, so every existing candidate still wins first.
 */
function megaHolderSpriteKey(species) {
  const holderName = species.changesFrom || species.baseSpecies;
  if (!holderName || holderName === species.name) return null;
  let holder = null;
  try { holder = dex.species.get(holderName); } catch { return null; }
  if (!holder || !holder.exists) return null;
  for (const key of spriteCandidates(holder)) {
    if (frontSprites.get(key) && backSprites.get(key)) return key;
  }
  return null;
}

function findSprites(species) {
  const keys = [...spriteCandidates(species)];
  if (/(^|-)Mega(-|$)/.test(species.forme || '')) {
    const holderKey = megaHolderSpriteKey(species);
    if (holderKey) {
      const suffix = spriteKey((species.forme || '').replace(/^.*?(Mega(?:-[XYZ])?)$/, '$1'));
      keys.push(`${holderKey} ${suffix}`);
    }
  }
  for (const key of keys) {
    const front = frontSprites.get(key);
    const back = backSprites.get(key);
    if (front && back) return {front, back, key};
  }
  return null;
}

/* ------------------------------------------------------------------ *
 * PokéAPI CSV snapshots (height/weight/catch rate/gender/EV yield)
 * ------------------------------------------------------------------ */

function readCsv(file) {
  const lines = fs.readFileSync(path.join(__dirname, file), 'utf8').trim().split(/\r?\n/);
  const head = lines.shift().split(',');
  return lines.map(line => {
    const vals = line.split(',');
    return Object.fromEntries(head.map((h, i) => [h, vals[i] ?? '']));
  });
}

const apiPokemon = new Map(readCsv('pokeapi-pokemon.csv').filter(r => r.is_default === '1').map(r => [+r.species_id, r]));
const apiSpecies = new Map(readCsv('pokeapi-species.csv').map(r => [+r.id, r]));
const apiGrowth = new Map(readCsv('pokeapi-growth-rates.csv').map(r => [+r.id, r.identifier]));
const apiStats = new Map();
for (const row of readCsv('pokeapi-stats.csv')) {
  const pid = +row.pokemon_id;
  if (!apiStats.has(pid)) apiStats.set(pid, []);
  apiStats.get(pid).push(row);
}
const API_STAT_IDS = {1: 'hp', 2: 'atk', 3: 'def', 4: 'spa', 5: 'spd', 6: 'spe'};

/* ------------------------------------------------------------------ *
 * Learnsets
 * ------------------------------------------------------------------ */

const learnsetCache = new Map();

async function rawLearnset(id) {
  if (learnsetCache.has(id)) return learnsetCache.get(id);
  let data = null;
  try {
    const entry = await gen.learnsets.get(id);
    data = entry?.learnset || null;
  } catch (_) {
    data = null;
  }
  learnsetCache.set(id, data);
  return data;
}

/**
 * Resolve a full legal move pool. Formes without their own learnset inherit
 * from `changesFrom`/`baseSpecies`; every Pokémon also inherits its
 * pre-evolution pools, matching normal transfer legality.
 *
 * Returns `{moveId: level}` where a level of 0 means "legal but not learned by
 * level-up" (TM/tutor/egg/prevo).
 */
async function resolveLearnset(species) {
  const out = new Map();
  const seen = new Set();
  const queue = [{id: species.id, inherited: false}];

  while (queue.length) {
    const {id: currentId, inherited} = queue.shift();
    if (seen.has(currentId)) continue;
    seen.add(currentId);
    const current = dex.species.get(currentId);
    if (!current?.exists) continue;

    const learnset = await rawLearnset(currentId);
    if (learnset) {
      for (const [move, codes] of Object.entries(learnset)) {
        // Take the level-up requirement from the most recent generation that
        // teaches the move by level; anything else is legal at level 0.
        let bestGen = -1;
        let level = 0;
        let legal = false;
        for (const code of codes) {
          const g = Number(code[0]);
          if (!Number.isFinite(g) || g < 1 || g > 9) continue;
          legal = true;
          const match = /^\d+L(\d+)$/.exec(code);
          if (match && !inherited && g > bestGen) {
            bestGen = g;
            level = Math.max(1, +match[1]);
          }
        }
        if (!legal) continue;
        const previous = out.get(move);
        if (previous === undefined) out.set(move, level);
        else if (level > 0 && (previous === 0 || level < previous)) out.set(move, level);
      }
    }

    // Alternate formes share their base forme's level-up progression in game,
    // so the base species contributes level timing rather than TM-only legality.
    const changesFrom = current.changesFrom && current.changesFrom !== current.name ? dex.species.get(current.changesFrom) : null;
    if (changesFrom?.exists) queue.push({id: changesFrom.id, inherited});
    if (current.baseSpecies && current.baseSpecies !== current.name) {
      const base = dex.species.get(current.baseSpecies);
      if (base?.exists) queue.push({id: base.id, inherited});
    }
    // Pre-evolutions are legal to relearn but never at the evolved level.
    if (current.prevo) {
      const prevo = dex.species.get(current.prevo);
      if (prevo?.exists) queue.push({id: prevo.id, inherited: true});
    }
  }
  return out;
}

/**
 * Items this project adds that do not exist upstream.
 *
 * Palafin is the odd one out among the transformation Pokémon: every other
 * forme in that family is reached by holding something (Red Orb, Rusted Sword,
 * Griseous Orb), but Zero to Hero fires on switching out, which is invisible,
 * un-plannable and impossible to shop towards in a roguelite. This project
 * redesigns it into a held item so Palafin works like the rest of them.
 *
 * Shaped exactly like a generated item so nothing downstream can tell the
 * difference, and kept in the generator for the same reason LEGACY_BASE_STATS
 * is — `npm run build:data` would otherwise drop it on the next run.
 */
/**
 * Item description overrides — the item counterpart of `ABILITY_OVERRIDES`.
 *
 * Same rule and same reason: the behaviour lives in the engine, only the text
 * lives here, and it sits in the generator so `npm run build:data` cannot
 * quietly restore upstream wording that contradicts the code.
 */
const ITEM_OVERRIDES = {
  /*
   * Project redesign. Upstream Ring Target is defensive — the *holder* loses
   * its own type immunities, which is a drawback item nobody equips on purpose.
   * It is now offensive: the holder's own attacks ignore the target's type
   * immunity and land for neutral damage instead.
   */
  ringtarget: {
    shortDesc: "Holder's attacks hit for neutral damage instead of being blocked by a type immunity.",
    desc: "If held by a Pokemon, its attacking moves that a target would be completely immune to by type deal neutral (1x) damage instead. It does not affect immunities from abilities such as Levitate or Flash Fire, and does not change any other type matchup.",
  },
  /*
   * Project redesign. Both Orbs officially activate in the residual phase, which
   * costs their holder the whole turn it switches in — a Guts attacker's first
   * turn is unboosted, a Poison Heal holder's first turn does not heal. Here
   * they fire on entry instead. The upstream text says "at the end of every
   * turn", which is exactly the kind of Pokédex entry this table exists to stop
   * shipping.
   */
  toxicorb: {
    shortDesc: 'Badly poisons the holder the moment it enters battle.',
    desc: 'If held by a Pokemon, it badly poisons the holder as soon as it enters the battle, rather than at the end of the turn. If the holder is cured of its status later, the Orb badly poisons it again at the end of that turn.',
  },
  flameorb: {
    shortDesc: 'Burns the holder the moment it enters battle.',
    desc: 'If held by a Pokemon, it burns the holder as soon as it enters the battle, rather than at the end of the turn. If the holder is cured of its status later, the Orb burns it again at the end of that turn.',
  },
  /*
   * Found in passing while adding the Generation 2 Berries (2026-08-14), not
   * caused by them: this project's `healBerry` fires Oran at a *quarter* of max
   * HP, while upstream's text says a half. The behaviour is left alone — it is
   * shipped balance and retuning it does not belong in a task about adding
   * items — but the text is corrected, because a Pokédex entry that misstates
   * the mechanic is exactly what this table exists to prevent. The Generation 2
   * Berry and Gold Berry really do use the half their own descriptions state,
   * so they need no override.
   */
  oranberry: {
    shortDesc: 'Restores 10 HP when at 1/4 max HP or less. Single use.',
    desc: 'If held by a Pokemon, it restores 10 HP when the holder is at 1/4 of its maximum HP or less. Gluttony raises the threshold to 1/2. Single use.',
  },
};

/*
 * Abilities this project packages that upstream does not have yet — the ability
 * counterpart of `ITEM_ADDITIONS`, and it exists for the same reason: a rebuild
 * filters upstream data and would otherwise drop anything not declared here.
 *
 * **Added 2026-09-03 from Pokemon Champions datamine, ahead of the official
 * update.** `@pkmn` does not carry Aura Guard, so without this row the ability
 * is a dead string on Lucario-Mega-Z and the forme ships with no ability at all.
 *
 * **This table is meant to be RETIRED.** When upstream ships the real values,
 * delete the row and rebuild — §5's rule that an absent row is the honest
 * representation once the project no longer disagrees. A control asserts the
 * ability is reachable, so removing it prematurely goes red rather than silent.
 *
 * Shaped exactly like a generated ability so nothing downstream can tell the
 * difference, and flagged `Future` to sit consistently beside the six other
 * Z-A abilities, which upstream marks the same way.
 */
const ABILITY_ADDITIONS = {
  auraguard: {
    id: 'auraguard', name: 'Aura Guard', num: -1,
    shortDesc: 'This Pokemon receives half damage from contact moves.',
    desc: 'Damage this Pokemon takes from moves that make contact is halved, with no HP condition. The reduction follows the move\'s contact flag as the damage pipeline resolves it: Long Reach removes contact outright and so bypasses the halving, while Protective Pads does not — the Pads only shield their own holder from the defender\'s contact-triggered effects, which is a different thing from making the move non-contact. Both measured.',
    rating: 0,
    isNonstandard: 'Future',
  },
};

/*
 * Species whose ability list this project sets outright, replacing whatever
 * upstream carries.
 *
 * **Added 2026-09-03, and every row is a datamined Legends: Z-A / Champions
 * value.** All three of the `-Mega-Z` formes shipped with abilities that were
 * byte-identical to each Pokemon's *ordinary* Mega — Absol-Mega-Z had Magic
 * Bounce like Absol-Mega, Garchomp-Mega-Z Sand Force, Lucario-Mega-Z
 * Adaptability. §5 already recorded that as "what a provisional placeholder
 * looks like" and warned the assignments were not settled. They were not.
 *
 * **Like `ABILITY_ADDITIONS` above, this is meant to be retired**: when
 * upstream ships the real values these rows become redundant and should be
 * deleted rather than left to disagree silently.
 *
 * **Tier consequences are NOT handled here and must not be.** Lucario-Mega-Z's
 * Ubers pin was justified in §10 on Adaptability by name; Absol-Mega-Z and
 * Garchomp-Mega-Z sit on `estimated` tiers. All three need a fresh audit, which
 * is a separate decision from getting the data right.
 */
const SPECIES_ABILITY_OVERRIDES = {
  garchompmegaz: ['Levitate'],      // was Sand Force (a copy of Garchomp-Mega's).
                                    // Pure Dragon, so Levitate is a clean Ground
                                    // immunity plus immunity to Spikes, Toxic
                                    // Spikes, Sticky Web and Arena Trap — and it
                                    // is unconditional where Sand Force needed a
                                    // sand setter on the team.
  lucariomegaz: ['Aura Guard'],     // was Adaptability (a copy of Lucario-Mega's).
                                    // Defensive, not offensive: its 164 SpA loses
                                    // the 2x STAB the Ubers case was argued on,
                                    // while contact priority — Sucker Punch,
                                    // Bullet Punch, Mach Punch, Extreme Speed,
                                    // Grassy Glide, First Impression, Upper Hand
                                    // and Aqua Jet are ALL contact — is halved.
  absolmegaz: ['Sharpness'],        // was Magic Bounce (a copy of Absol-Mega's).
                                    // Utility becomes offence: 1.5x on Night
                                    // Slash, Psycho Cut, X-Scissor, Air Slash,
                                    // Slash and Aerial Ace off base 154 Attack.
};

const ITEM_ADDITIONS = {
  herocharm: {
    id: 'herocharm', name: 'Hero Charm', num: -1, gen: 9,
    sprite: null,
    shortDesc: 'If held by a Palafin, it enters battle in its Hero Form.',
    desc: 'If held by a Palafin, it transforms into Hero Form the moment it enters battle. The charm cannot be removed, and Palafin keeps the form for the rest of the battle.',
    isBerry: false, isChoice: false, isGem: false, isPokeball: false,
    megaStone: null, megaEvolves: null,
    itemUser: ['Palafin'],
    naturalGift: null, fling: {basePower: 60},
    zMove: false, onPlate: null, onMemory: null, onDrive: null,
    boostType: null, isNonstandard: null,
  },
  // Trick Room had no duration extender, while screens (Light Clay), weather
  // (the four rocks) and terrain (Terrain Extender) all did. Five turns is
  // short enough that a Trick Room team spends most of its turns re-setting it.
  warpprism: {
    id: 'warpprism', name: 'Warp Prism', num: -2, gen: 9,
    sprite: null,
    shortDesc: 'Trick Room set by the holder lasts 8 turns instead of 5.',
    desc: 'If held by a Pokemon, Trick Room that this Pokemon sets lasts 8 turns instead of 5. It has no effect on Trick Room set by anything else, and none on Magic Room or Wonder Room.',
    isBerry: false, isChoice: false, isGem: false, isPokeball: false,
    megaStone: null, megaEvolves: null,
    itemUser: null,
    naturalGift: null, fling: {basePower: 60},
    zMove: false, onPlate: null, onMemory: null, onDrive: null,
    boostType: null, isNonstandard: null,
  },
  // Tailwind was the last duration effect with no extender, for the same reason
  // Trick Room was: screens have Light Clay, weather the four rocks, terrain the
  // Terrain Extender, and Trick Room now has the Warp Prism above. Four turns is
  // short enough that a Tailwind team spends most of its turns re-setting it,
  // and unlike the others it does not even cover a full switch cycle.
  windsock: {
    id: 'windsock', name: 'Wind Sock', num: -3, gen: 9,
    sprite: null,
    shortDesc: 'Tailwind set by the holder lasts 7 turns instead of 4.',
    desc: 'If held by a Pokemon, Tailwind that this Pokemon sets lasts 7 turns instead of 4. It has no effect on Tailwind set by anything else.',
    isBerry: false, isChoice: false, isGem: false, isPokeball: false,
    megaStone: null, megaEvolves: null,
    itemUser: null,
    naturalGift: null, fling: {basePower: 60},
    zMove: false, onPlate: null, onMemory: null, onDrive: null,
    boostType: null, isNonstandard: null,
  },
};

/**
 * Ability description overrides.
 *
 * The engine implements a set of ability restorations and redesigns (see
 * src/core/abilities.js). Upstream @pkmn text still describes the official
 * modern behaviour, which would then be wrong in the Pokédex and every
 * tooltip — and a description that misstates the mechanic is exactly the kind
 * of thing this project refuses to ship.
 *
 * Only the text changes here. The behaviour lives in the engine, and this
 * table sits in the generator so `npm run build:data` cannot quietly restore
 * upstream's wording.
 */
const ABILITY_OVERRIDES = {
  /*
   * Project redesigns. Heatproof is a full Fire immunity rather than a halving;
   * the two Metals state a stat trade on entry instead of being weight-only,
   * which reached three moves in the whole game.
   */
  heatproof: {
    shortDesc: 'This Pokemon is immune to Fire-type attacks.',
    desc: 'This Pokemon cannot be hit by Fire-type attacking moves; they are absorbed with no effect. Fire-type status moves such as Will-O-Wisp are unaffected. It also halves Fire-type damage taken from burns.',
  },
  lightmetal: {
    shortDesc: "Halves this Pokemon's weight; +1 Speed on entry.",
    desc: "This Pokemon's weight is halved, and it gains one stage of Speed when it enters the field.",
  },
  heavymetal: {
    shortDesc: "Doubles this Pokemon's weight; on entry -2 Speed, +1 Defense, +1 Attack.",
    desc: "This Pokemon's weight is doubled. When it enters the field it loses two stages of Speed and gains one stage each of Defense and Attack.",
  },
  // Both match Thief's redesign: stealing no longer needs empty hands, and the
  // holder's existing item is discarded to make room. Upstream text states the
  // "if this Pokemon has no item" clause, which is no longer true.
  magician: {
    shortDesc: 'Steals the item off a Pokemon it hits, replacing its own.',
    desc: 'After hitting with a damaging move, this Pokemon takes the target\'s held item even if it is already holding one; its own item is discarded rather than swapped. It cannot take, or lose, a Mega Stone or forme-change item.',
  },
  pickpocket: {
    shortDesc: 'Steals the item of any attacker that makes contact, replacing its own.',
    desc: 'When hit by a contact move, this Pokemon takes the attacker\'s held item even if it is already holding one; its own item is discarded rather than swapped. It cannot take, or lose, a Mega Stone or forme-change item.',
  },
  // Redesigned from the doubles-only ally recovery, which did nothing in singles.
  pickup: {
    shortDesc: 'On entry, picks up the last item destroyed this battle.',
    desc: 'When this Pokemon enters battle it takes the last item that was destroyed during the battle — knocked off, corroded, spent, or discarded to make room for a steal — replacing its own held item. Berries are not recovered, and it cannot lose a Mega Stone or forme-change item to make room.',
  },
  magicguard: {
    shortDesc: 'Only takes damage from attacks. Immune to Toxic Spikes and full paralysis.',
    desc: 'This Pokemon can only be damaged by direct attacks. It cannot be poisoned by Toxic Spikes, and paralysis never stops it from moving (the Speed drop still applies).',
  },
  parentalbond: {
    shortDesc: 'This Pokemon\'s damaging moves hit twice. The second hit has 50% power.',
    desc: 'This Pokemon\'s damaging moves strike twice. The second strike is a separate hit at 50% power, so effects that trigger per hit trigger twice.',
  },
  galewings: {
    shortDesc: 'This Pokemon\'s Flying-type moves have their priority increased by 1.',
    desc: 'This Pokemon\'s Flying-type moves have their priority increased by 1, at any HP.',
  },
  aerilate: {
    shortDesc: 'This Pokemon\'s Normal-type moves become Flying type and have 1.3x power.',
    desc: 'This Pokemon\'s Normal-type moves become Flying-type moves and have their power multiplied by 1.3.',
  },
  pixilate: {
    shortDesc: 'This Pokemon\'s Normal-type moves become Fairy type and have 1.3x power.',
    desc: 'This Pokemon\'s Normal-type moves become Fairy-type moves and have their power multiplied by 1.3.',
  },
  refrigerate: {
    shortDesc: 'This Pokemon\'s Normal-type moves become Ice type and have 1.3x power.',
    desc: 'This Pokemon\'s Normal-type moves become Ice-type moves and have their power multiplied by 1.3.',
  },
  transistor: {
    shortDesc: 'This Pokemon\'s Electric-type moves have their power multiplied by 1.5.',
    desc: 'This Pokemon\'s Electric-type moves have their power multiplied by 1.5.',
  },
  disguise: {
    shortDesc: 'If Mimikyu, the first hit it takes deals 0 damage. Costs no HP.',
    desc: 'If this Pokemon is a Mimikyu, the first hit it takes in battle deals 0 damage and busts its disguise. Busting the disguise costs it no HP.',
  },
  protean: {
    shortDesc: 'Before using a move, this Pokemon changes to that move\'s type.',
    desc: 'Before this Pokemon uses a move, it changes to that move\'s type. This happens every time it uses a qualifying move.',
  },
  libero: {
    shortDesc: 'Before using a move, this Pokemon changes to that move\'s type.',
    desc: 'Before this Pokemon uses a move, it changes to that move\'s type. This happens every time it uses a qualifying move.',
  },
  intrepidsword: {
    shortDesc: 'Raises the Pokemon\'s Attack when it enters battle.',
    desc: 'This Pokemon\'s Attack is raised by 1 stage every time it enters battle.',
  },
  dauntlessshield: {
    shortDesc: 'Raises the Pokemon\'s Defense when it enters battle.',
    desc: 'This Pokemon\'s Defense is raised by 1 stage every time it enters battle.',
  },
  supremeoverlord: {
    shortDesc: 'Raises the Pokemon\'s Attack when it enters battle.',
    desc: 'This Pokemon\'s Attack is raised by 1 stage every time it enters battle.',
  },
  download: {
    shortDesc: 'Raises the Pokemon\'s Attack and Sp. Atk when it enters battle.',
    desc: 'On switch-in, this Pokemon\'s Attack and Special Attack are each raised by 1 stage.',
  },
  cloudnine: {
    shortDesc: 'Removes the current weather when the Pokemon enters battle.',
    desc: 'When this Pokemon enters battle, the active weather ends completely. It does not return when this Pokemon leaves, and new weather can be set normally.',
  },
  airlock: {
    shortDesc: 'Removes the current weather when the Pokemon enters battle.',
    desc: 'When this Pokemon enters battle, the active weather ends completely. It does not return when this Pokemon leaves, and new weather can be set normally.',
  },
  battlebond: {
    shortDesc: 'If Greninja, KOing a Pokemon with any move transforms it into Ash-Greninja.',
    desc: 'If this Pokemon is a Greninja, it transforms into Ash-Greninja after knocking out a Pokemon with any move, gaining that forme\'s higher Attack, Sp. Atk and Speed for the rest of the battle.',
  },
  moldbreaker: {
    shortDesc: 'This Pokemon\'s moves ignore the target\'s Ability, including Dark and Fairy Aura.',
    desc: 'This Pokemon\'s moves ignore Abilities that would modify how they are received, including Dark Aura and Fairy Aura.',
  },
  turboblaze: {
    shortDesc: 'This Pokemon\'s moves ignore the target\'s Ability, including Dark and Fairy Aura.',
    desc: 'This Pokemon\'s moves ignore Abilities that would modify how they are received, including Dark Aura and Fairy Aura.',
  },
  teravolt: {
    shortDesc: 'This Pokemon\'s moves ignore the target\'s Ability, including Dark and Fairy Aura.',
    desc: 'This Pokemon\'s moves ignore Abilities that would modify how they are received, including Dark Aura and Fairy Aura.',
  },
  unseenfist: {
    shortDesc: 'This Pokemon\'s contact moves hit through protection at full damage.',
    desc: 'If this Pokemon uses a contact move, it bypasses the target\'s protection and deals full damage.',
  },
  /*
   * The 2026-08-14 batch, from PROJECT_CONTEXT §10 item 4c.
   *
   * Only the ones whose upstream text no longer matches the engine are here.
   * Dragonize, Eelevate, Fire Mane, Mega Sol, Spicy Spray and Lingering Aroma
   * are implemented exactly as their packaged descriptions state and are
   * deliberately absent — an override that restates the datum is a second copy
   * that can drift.
   */
  // Redesigned: both are doubles-only abilities that did nothing at all in
  // singles, the same shape as Pickup and Zero to Hero before them.
  curiousmedicine: {
    shortDesc: "On switch-in, resets the opposing Pokemon's stat stages to 0.",
    desc: "When this Pokemon enters battle, the opposing Pokemon's stat stages are all reset to 0. Raised and lowered stages alike are cleared, so switching in behind a stat drop gives that up as well.",
  },
  hospitality: {
    shortDesc: "On switch-in, restores 1/4 max HP to the most injured teammate on the bench.",
    desc: "When this Pokemon enters battle it restores a quarter of the maximum HP of whichever teammate on the bench is missing the most HP. It heals nothing itself, and does nothing if no benched teammate is injured.",
  },
  // Gains this project's weather wipe, and is the one entry ability that beats
  // primal weather — Cloud Nine and Air Lock still cannot.
  deltastream: {
    shortDesc: 'Removes the weather on entry; Flying types lose their weaknesses while it is out.',
    desc: "When this Pokemon enters battle the active weather ends completely, including Desolate Land and Primordial Sea, which no other entry ability can remove. While this Pokemon is on the field, Electric-, Ice- and Rock-type attacks are no longer super effective against the Flying half of any Flying-type Pokemon on either side.",
  },
  // Fires on every entry rather than once per battle, matching the choice this
  // project already made for Intrepid Sword and Dauntless Shield.
  supersweetsyrup: {
    shortDesc: "On switch-in, lowers the opposing Pokemon's evasiveness by 1 stage.",
    desc: "Every time this Pokemon enters battle, the opposing Pokemon's evasiveness is lowered by 1 stage.",
  },
  // The species clauses are dropped: they would make a Skill-Swapped or
  // Role-Played copy silently inert, which is the failure this project keeps
  // finding. Both remain uncopyable by Trace.
  poisonpuppeteer: {
    shortDesc: 'A target this Pokemon poisons also becomes confused.',
    desc: 'Whenever this Pokemon poisons or badly poisons a target — with a move, a secondary effect or an Ability — that target also becomes confused.',
  },
  teraformzero: {
    shortDesc: 'Terastallizing ends the effects of weather and terrain.',
    desc: 'When this Pokemon Terastallizes, the active weather and terrain both end. This includes Desolate Land and Primordial Sea, which ordinary weather removal cannot touch; spending the one Terastallization a side gets is what pays for it.',
  },
  // Upstream's wording reads as though the quarter applied to every contact
  // move. It applies only to a hit that actually had to break a protection.
  piercingdrill: {
    shortDesc: "This Pokemon's contact moves break protection, landing for 1/4 damage when they do.",
    desc: "This Pokemon's contact moves are not stopped by Protect, Detect and the rest of the protection family. A hit that breaks through in this way deals a quarter of its usual damage; against a target that did not protect itself the move is completely unaffected.",
  },
};

/* ------------------------------------------------------------------ *
 * Move cleaning
 * ------------------------------------------------------------------ */

function cleanSecondary(secondary) {
  if (!secondary || typeof secondary !== 'object') return null;
  return {
    chance: secondary.chance ?? 100,
    status: secondary.status || null,
    volatileStatus: secondary.volatileStatus || null,
    boosts: secondary.boosts || null,
    self: secondary.self || null,
  };
}

/**
 * Move restorations and redesigns, applied by project decision.
 *
 * Two kinds of change live here:
 *   1. Genuine main-series nerfs rolled back to their earlier values.
 *   2. Deliberate redesigns this project wants (multi-hit standardisation,
 *      unconditional priority moves, trapping moves as 2-5 hit attacks).
 *
 * Applied in the generator rather than the packaged data, because
 * `npm run build:data` would otherwise silently reinstate every nerf.
 *
 * Scope: Legends-series values (Arceus, Z-A) are deliberately NOT used. Those
 * games run a different battle system and change power, accuracy, timing and
 * effects to suit it; they are not nerfs to reverse. Alternate-title values
 * (e.g. Champions) are likewise ignored.
 *
 * Only the listed fields are overridden. Type, category, target, flags,
 * learnset availability and everything else always come from upstream.
 */

/** Moves whose normal pattern is exactly two hits -> 50 BP per hit. */
const TWO_HIT_BP = 50;
/** Moves whose normal pattern is two to five hits -> 25 BP per hit. */
const TWO_TO_FIVE_BP = 25;

const MOVE_OVERRIDES = {
  /*
   * Revelation Dance takes its **category** from the user as well as its type
   * (2026-08-14, by project decision — upstream it is always Special). Same rule
   * as Tera Blast, whose own packaged text already states it, so only this one
   * needs correcting.
   */
  revelationdance: {
    shortDesc: "Type and category both follow the user: its primary type, and physical if Atk > SpA.",
    desc: "This move's type is the user's primary type, so it changes with Terastallization, Soak, Conversion and Burn Up. Its category follows the user too: physical if the user's Attack is greater than its Special Attack, special otherwise.",
  },
  /* --- base power restorations --- */
  dig: {basePower: 100},
  feint: {basePower: 50},
  aurasphere: {basePower: 90},
  dracometeor: {basePower: 140},
  dragonpulse: {basePower: 90},
  flamethrower: {basePower: 95},
  heatwave: {basePower: 100},
  hurricane: {basePower: 120},
  hydropump: {basePower: 120},
  icebeam: {basePower: 95},
  leafstorm: {basePower: 140},
  magmastorm: {basePower: 120},
  meteormash: {basePower: 100},
  muddywater: {basePower: 95},
  overheat: {basePower: 140},
  surf: {basePower: 95},
  thunder: {basePower: 120},
  thunderbolt: {basePower: 95},
  tackle: {basePower: 50},
  glaciallance: {basePower: 130},
  grassyglide: {
    basePower: 70,
    shortDesc: 'Usually goes first.',
    desc: 'Usually goes first. Does not need Grassy Terrain.',
  },
  wickedblow: {basePower: 80},

  /* --- base power only; accuracy and secondary rates stay official --- */
  blizzard: {basePower: 120},
  fireblast: {basePower: 120},

  // Razor Wind already carries the engine's high-crit ratio; pinned so a
  // rebuild cannot drop it.
  razorwind: {critRatio: 2},

  /* --- unconditional priority redesigns --- */
  // The activation conditions are removed in battle.js; priority is kept.
  suckerpunch: {
    basePower: 80,
    shortDesc: 'Usually goes first.',
    desc: 'Usually goes first. Works whatever the target is doing.',
  },
  thunderclap: {
    shortDesc: 'Usually goes first.',
    desc: 'Usually goes first. Works whatever the target is doing.',
  },
  firstimpression: {
    shortDesc: 'Nearly always goes first.',
    desc: 'Nearly always goes first. Usable on any turn the user is on the field.',
  },
  // Upper Hand keeps +3 priority but loses both its condition and its flinch.
  upperhand: {
    secondary: null,
    secondaries: null,
    shortDesc: 'Nearly always goes first.',
    desc: 'Nearly always goes first. Works whatever the target is doing, and does not flinch.',
  },

  /*
   * Focus Punch: the flinch condition is gone, and accuracy pays for it instead.
   *
   * Officially it is a 150 BP attack that simply fails if the user takes any
   * damage first — and since it also moves at -3 priority, "the opponent
   * attacks" is the default case, not the exception. That made it the one move
   * on this project's conditional list whose condition the *user* could not
   * really satisfy: §5 kept it because Substitute exists, but a move that needs
   * a second move set up first, every time, is a combo rather than an option.
   * The AI agreed with that reading and scored it −800 unless behind a
   * Substitute, i.e. it almost never picked it.
   *
   * Now it always executes and lands 70% of the time. 150 BP at 70% is 105
   * expected power before the -3 priority is counted, which is the cost that
   * keeps it honest.
   *
   * **This is the one accuracy override in the table, and it is deliberate.**
   * The standing rule is that MOVE_OVERRIDES touches base power and redesigns
   * only, never accuracy — that rule exists to stop main-series accuracy nerfs
   * being quietly rolled back, and `tests/data-validation.js` enforces it by
   * grepping this table. A named redesign is exempted there the same way
   * `upperhand`'s secondary is, so the guard still catches anything unnamed.
   */
  focuspunch: {
    accuracy: 70,
    /*
     * The -3 priority is gone too (2026-08-14, by project decision). The
     * condition and the priority were two drawbacks paying for one move, and
     * the accuracy already replaced the condition: at 150 BP and 70% it is 105
     * expected power, which is what the move now costs. Moving last on top of
     * that made it a combo piece rather than a trade-off — the same objection
     * that removed the condition in the first place.
     *
     * `priority` is a redesign, which this table is for; the guard in
     * tests/data-validation.js forbids accuracy, PP and secondary rates, and
     * Focus Punch's accuracy is a named exemption there.
     */
    priority: 0,
    shortDesc: 'Hits at 70% accuracy. No longer fails when hit, and no longer moves last.',
    desc: 'A 150 BP punch with none of its original drawbacks except accuracy: it no longer needs the user to avoid damage first, and it no longer moves last. It is accurate 70% of the time.',
  },

  /* --- unconditional attack redesigns --- */
  /*
   * Conditions removed in `battle.moveSpecialFailure`. These two differ from the
   * priority group above: what gated them was set by the *opponent*, not by
   * anything the user could arrange, so the move was dead weight against most
   * teams rather than a trade-off. Descriptions are overridden here because the
   * upstream text states the condition, and a Pokédex entry that misstates the
   * mechanic is exactly what these overrides exist to prevent.
   */
  dreameater: {
    shortDesc: 'User recovers 50% of the damage dealt.',
    desc: 'The user recovers half the HP inflicted. The target does not need to be asleep.',
  },
  poltergeist: {
    shortDesc: 'Hits the target regardless of its held item.',
    desc: 'Attacks the target. Unlike the official move, it does not require the target to be holding an item.',
  },
  // Thief steals even when the user is holding something; Covet keeps the
  // official restriction. Both descriptions have to say which, or the Pokedex
  // makes them look identical when they are not.
  thief: {
    shortDesc: "Takes the target's item, replacing the user's own.",
    desc: "The user steals the target's held item even if it is already holding one — its own item is discarded, not swapped. It cannot take a Mega Stone or a forme-change item, and cannot lose its own.",
  },
  covet: {
    shortDesc: "Takes the target's item if the user has none.",
    desc: "The user steals the target's held item, but only while the user is not holding one. Thief has no such restriction in this project.",
  },
};

/**
 * Trapping moves rebuilt as 2-5 hit attacks that still trap.
 *
 * The engine applies a damaging move's volatile once, after the hit loop, so
 * the partial-trap lands a single time no matter how many hits connect — and
 * not at all if none do. The target can still act; Generation I's action
 * lockout is deliberately not restored.
 */
const TRAPPING_MULTIHIT = ['wrap', 'bind', 'firespin', 'clamp'];
for (const id of TRAPPING_MULTIHIT) {
  MOVE_OVERRIDES[id] = Object.assign({}, MOVE_OVERRIDES[id], {
    multihit: [2, 5],
    basePower: TWO_TO_FIVE_BP,
    shortDesc: 'Hits 2-5 times. Traps and damages the target for 4-5 turns.',
  });
}

function cleanMove(m) {
  const secondaries = Array.isArray(m.secondaries) ? m.secondaries.map(cleanSecondary).filter(Boolean) : null;
  const cleaned = {
    id: m.id, num: m.num, name: m.name, type: m.type, category: m.category,
    basePower: m.basePower || 0,
    accuracy: m.accuracy === true ? null : m.accuracy,
    pp: m.pp, priority: m.priority || 0, target: m.target,
    status: m.status || null, volatileStatus: m.volatileStatus || null,
    boosts: m.boosts || null, self: m.self || null,
    secondary: cleanSecondary(m.secondary), secondaries,
    drain: m.drain || null, recoil: m.recoil || null, heal: m.heal || null,
    multihit: m.multihit || null, critRatio: m.critRatio || 1,
    damage: m.damage || null, ohko: m.ohko || null,
    selfdestruct: m.selfdestruct || null, selfSwitch: m.selfSwitch || null,
    forceSwitch: m.forceSwitch || false, sideCondition: m.sideCondition || null,
    slotCondition: m.slotCondition || null,
    weather: m.weather || null, terrain: m.terrain || null, pseudoWeather: m.pseudoWeather || null,
    stallingMove: !!m.stallingMove, willCrit: !!m.willCrit, breaksProtect: !!m.breaksProtect,
    thawsTarget: !!m.thawsTarget, ignoreImmunity: !!m.ignoreImmunity,
    ignoreDefensive: !!m.ignoreDefensive, ignoreEvasion: !!m.ignoreEvasion,
    ignoreAccuracy: !!m.ignoreAccuracy, ignoreAbility: !!m.ignoreAbility,
    sleepUsable: !!m.sleepUsable, callsMove: !!m.callsMove,
    hasCrashDamage: !!m.hasCrashDamage, mindBlownRecoil: !!m.mindBlownRecoil,
    flags: m.flags || {},
    desc: m.desc || m.shortDesc || '', shortDesc: m.shortDesc || m.desc || '',
    isNonstandard: m.isNonstandard || null,
    isZ: !!m.isZ, isMax: !!m.isMax,
  };
  return applyMoveOverrides(cleaned);
}

/**
 * Applies the explicit table above, then the two global multi-hit rules.
 *
 * Order matters: the table can turn a move into a 2-5 hit attack (the trapping
 * redesign), and the global pass must then see that new hit pattern. Hit
 * patterns other than "exactly 2" and "2-5" — three-hit moves, Population
 * Bomb's ten, and anything bespoke — are deliberately left alone.
 */
function applyMoveOverrides(move) {
  const override = MOVE_OVERRIDES[move.id];
  if (override) {
    for (const [key, value] of Object.entries(override)) {
      move[key] = value && typeof value === 'object' && !Array.isArray(value)
        ? Object.assign({}, move[key], value)
        : value;
    }
    // A rewritten `secondary` is the whole effect, so keep `secondaries` in step.
    if (Object.prototype.hasOwnProperty.call(override, 'secondary')) {
      move.secondaries = override.secondary ? [move.secondary] : null;
    }
  }
  if (move.basePower > 0 && Array.isArray(move.multihit)) {
    const [min, max] = move.multihit;
    if (min === 2 && max === 5) move.basePower = TWO_TO_FIVE_BP;
  } else if (move.basePower > 0 && move.multihit === 2) {
    move.basePower = TWO_HIT_BP;
  }
  return move;
}

/* ------------------------------------------------------------------ *
 * Items
 * ------------------------------------------------------------------ */

const itemSpriteIndex = (() => {
  const map = new Map();
  for (const file of fs.readdirSync(ITEM_SPRITE_DIR)) {
    if (!/\.(png|jpg|jpeg|webp)$/i.test(file)) continue;
    map.set(compactKey(path.parse(file).name), file);
  }
  return map;
})();

const ITEM_SPRITE_ALIASES = {
  parlyzheal: 'parlyz-heal.png',
  thunderstone: 'thunderstone.png',
};

function itemSprite(item) {
  if (ITEM_SPRITE_ALIASES[item.id]) return ITEM_SPRITE_ALIASES[item.id];
  const direct = itemSpriteIndex.get(compactKey(item.id));
  if (direct) return direct;
  const byName = itemSpriteIndex.get(compactKey(item.name));
  return byName || null;
}

/* ------------------------------------------------------------------ *
 * Classification helpers
 * ------------------------------------------------------------------ */

/** Formes we deliberately never enable, even when sprites happen to exist. */
const EXCLUDED_FORME_PATTERNS = [/-Gmax$/i, /-Totem$/i, /-Eternamax$/i];
const EXCLUDED_SPECIES = new Set([
  'missingno', 'pokestarsmeargle',
  // Project decision: there is exactly one selectable Greninja — the base
  // forme, which carries Torrent, Protean and Battle Bond. Greninja-Bond is a
  // redundant duplicate of it (identical stats, Battle Bond only). Greninja-Ash
  // and Greninja-Mega are both kept, as transform-only results of Battle Bond
  // and Mega Evolution respectively.
  'greninjabond',
]);

/**
 * Species that exist purely as the result of an in-battle transformation.
 *
 * They stay in the packaged data — the engine has to be able to look them up —
 * but they are not selectable: excluded from `Dex.allSpecies`, from every
 * format pool, from the Pokédex listing and from team validation.
 *
 * Every Mega forme is added to this set at generation time, read straight from
 * the Mega Stone item data, because Mega Evolution is a real in-battle
 * mechanic here: you reach a Mega forme by holding its stone and evolving, not
 * by picking it in the Team Builder.
 */
const TRANSFORM_ONLY_SPECIES = new Set([
  'greninjaash',
  // Rayquaza-Mega has no Mega Stone — it Mega Evolves by knowing Dragon
  // Ascent — so registerMegaFormes cannot find it from item data.
  'rayquazamega',
  /*
   * The Terastal-gated formes (2026-08-15, by project decision; completed
   * 2026-08-16).
   *
   * All of these exist *only* as the result of Terastallizing, which this
   * project disables in eight of its eleven formats — so offering them in the
   * Team Builder let a player pick, in a no-Tera format, a forme that format's
   * rules say is unreachable.
   *
   * **The first pass named two of five and that was the bug.** It listed
   * Terapagos-Stellar and Ogerpon-Hearthflame-Tera — the two whose *tier* made
   * them conspicuous — and left Ogerpon-Teal-Tera (RU), Ogerpon-Wellspring-Tera
   * (OU) and Ogerpon-Cornerstone-Tera (OU) directly selectable. The argument
   * never had anything to do with the tier: it is that the forme is reached by
   * Terastallizing and nothing else. Teal-Tera was the sharpest hole, because it
   * requires no Mask at all and so was the only Ogerpon-line entry a player
   * could pick in RU — arriving with Embody Aspect (Teal) for a free +1 Speed
   * on entry, in a format with no Terastallization in it.
   *
   * **Worth knowing: this makes them unreachable everywhere, not only in
   * no-Tera formats.** The engine has never implemented any of these
   * transformations — `ABILITY_FORMES` takes Terapagos to Terastal on entry via
   * Terashift and stops there, and nothing produces an Ogerpon Tera forme at
   * all. So they are packaged-but-dead rather than packaged-and-reachable. That
   * is the honest state; making them genuinely reachable means implementing a
   * Terastal-to-Stellar step and an Ogerpon Tera step, which is separate work.
   *
   * Terapagos-Terastal is deliberately **not** here: Terashift really does
   * produce it on entry, so it is an ordinary entry forme like Groudon-Primal.
   */
  'terapagosstellar',
  'ogerpontealtera',
  'ogerponwellspringtera',
  'ogerponhearthflametera',
  'ogerponcornerstonetera',
]);

/** Add every Mega forme named by a Mega Stone to the transform-only set. */
function registerMegaFormes(dex) {
  for (const item of dex.items.all()) {
    if (!item.exists || !item.megaStone) continue;
    const targets = typeof item.megaStone === 'string'
      ? [item.megaStone]
      : Object.values(item.megaStone);
    for (const name of targets) {
      TRANSFORM_ONLY_SPECIES.add(String(name).toLowerCase().replace(/[^a-z0-9]+/g, ''));
    }
  }
}

/**
 * **There is one Arceus and one Silvally** (2026-08-15, by project decision).
 *
 * Their typed formes are a *held item*, not a species choice: Multitype reads
 * the Plate and RKS System reads the Memory, and the engine shifts the forme on
 * entry. Shipping 17 of each as separately selectable species said the opposite
 * — that Arceus-Water is a Pokémon you pick — and then made the item decide
 * anyway, which is how the §8 bug happened where a generated Arceus-Water held
 * Leftovers and walked in as plain Normal Arceus with a Water moveset.
 *
 * So they join the Megas: packaged and reachable, never selectable. The route
 * is base Arceus holding a Splash Plate, exactly as the route to a Mega is the
 * base forme holding its stone. `Mechanics.speciesFormes` still lists all 18 in
 * the Pokédex family view, and the Team Builder previews whichever the held
 * item produces.
 *
 * Read from the item data (`onPlate` / `onMemory`) rather than from a list of
 * 34 names, for the same reason `registerMegaFormes` reads the stones: a new
 * Plate cannot be added upstream and forgotten here.
 */
function registerTypeItemFormes(dex) {
  for (const item of dex.items.all()) {
    if (!item.exists) continue;
    // Z-crystals carry `onPlate` too and are not forme items (§8).
    if (item.zMove) continue;
    for (const [field, base] of [['onPlate', 'Arceus'], ['onMemory', 'Silvally']]) {
      const type = item[field];
      if (!type || type === 'Normal') continue;
      TRANSFORM_ONLY_SPECIES.add(`${base}${type}`.toLowerCase().replace(/[^a-z0-9]+/g, ''));
    }
  }
}

/**
 * Cosmetic skins: formes that are a *different picture of the same Pokémon*.
 *
 * A forme qualifies when it is mechanically indistinguishable from its base —
 * same typing, same base stats, same ability list, same legal move pool — **and
 * nothing in the game can turn anything into it.** Both halves are required.
 * Cherrim-Sunshine, Mimikyu-Busted and Morpeko-Hangry all pass the first test
 * and are emphatically not skins, because Flower Gift, Disguise and Hunger
 * Switch produce them mid-battle.
 *
 * **What separates them is `battleOnly`** (with `transformOnly` and
 * `requiredItem` covering the Mega and forme-item routes). A first version also
 * walked `ABILITY_FORMES`, the Mega Stones and `FORME_CHANGE_ITEMS` to build a
 * set of "anything a transformation can produce" and checked against that too —
 * and a control proved it **excluded nothing those three flags had not already
 * excluded**, 0 cases across the whole packaged set. It was deleted rather than
 * kept as belt-and-braces: an unreachable guard reads as load-bearing and is
 * the shape §8 keeps recording. The invariant it was guarding is asserted in
 * `tests/data-validation.js` instead, where a failure is visible.
 *
 * **Derived, never listed.** Same reason the Ring Target shop rule is derived
 * from the type chart: a new upstream forme is classified with nothing to
 * maintain, and a forme that gains a real difference stops being a skin on its
 * own. Measured across the packaged set, exactly two qualify — Keldeo-Resolute
 * and Magearna-Original.
 *
 * **Magearna-Original is the case this was built for, and it was not merely
 * redundant, it was a trap.** Its `formeItems` pointed at
 * Magearna-Original-Mega, which this project does not package (no sprite pair),
 * so holding a Magearnite banned it below Ubers and then **failed to Mega
 * Evolve at all** — `megaEvolve` returned false and the Team Builder showed no
 * forme. Picking it over plain Magearna was strictly worse for no stated
 * reason. Folding it into Magearna as a skin deletes that whole class of
 * mistake rather than patching it.
 *
 * The skin keeps its packaged entry — it has to, or its artwork is unreachable
 * — but is marked `cosmeticOf` and drops out of `Dex.allSpecies`, exactly as a
 * `transformOnly` forme does. The base carries a `skins` list so a picker can
 * offer them.
 */
function findCosmeticSkins(entries) {
  const signature = s => JSON.stringify({
    types: [...s.types].sort(),
    stats: s.baseStats,
    abilities: Object.values(s.abilities).slice().sort(),
    learnset: Object.keys(s.learnset || {}).sort(),
  });

  const byBase = new Map();
  for (const entry of entries) {
    const key = toID(entry.baseSpecies || entry.name);
    if (!byBase.has(key)) byBase.set(key, []);
    byBase.get(key).push(entry);
  }

  const skinOf = new Map();
  for (const [baseId, list] of byBase) {
    const base = list.find(e => e.id === baseId);
    if (!base) continue;
    const baseSignature = signature(base);
    for (const entry of list) {
      if (entry.id === baseId) continue;
      if (entry.transformOnly || entry.battleOnly || entry.requiredItem) continue;
      if (signature(entry) !== baseSignature) continue;
      skinOf.set(entry.id, baseId);
    }
  }
  return skinOf;
}

/*
 * An `ABILITY_FORME_TARGETS` table lived here for about an hour on 2026-08-16,
 * mirroring `Mechanics.ABILITY_FORMES` so `findCosmeticSkins` could exclude
 * ability-driven formes. It went with the redundant check it fed — and it is
 * worth noting it was also a **third** copy of a table already declared twice
 * (the engine's and the generator's forme-item pair), which is the drift this
 * project keeps getting caught by. The skin rule reads upstream's own
 * `battleOnly` instead, so there is nothing to keep in sync.
 */

/**
 * Normalise a forme cross-reference (`battleOnly`, `changesFrom`) to something
 * this project actually packages, falling back to the base species.
 */
function resolveForme(value, baseSpecies) {
  const name = Array.isArray(value) ? value[0] : value;
  if (!name) return null;
  const id = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '');
  return EXCLUDED_SPECIES.has(id) ? (baseSpecies || null) : name;
}

function excludedReason(species) {
  if (EXCLUDED_SPECIES.has(species.id)) return 'excluded species';
  for (const pattern of EXCLUDED_FORME_PATTERNS) {
    if (pattern.test(species.name)) return 'unsupported forme category';
  }
  if (species.isNonstandard === 'CAP') return 'fan-made (CAP)';
  if (species.isNonstandard === 'Custom') return 'custom Dex entry';
  if (species.isNonstandard === 'LGPE') return 'Let\'s Go exclusive';
  return null;
}

/* ------------------------------------------------------------------ *
 * Cries
 * ------------------------------------------------------------------ */

/**
 * Species cries, resolved at build time exactly as item artwork is.
 *
 * **A missing cry never gates a species.** Sprites do — a Pokemon with no
 * front/back pair is dropped from the roster — but audio is decoration, and
 * gating on it would silently delete three playable species. This follows the
 * item-artwork contract instead: package it, record the miss, carry on.
 *
 * One file per distinct cry rather than one per species: a forme with no cry of
 * its own falls back to its base species, so all 17 Arceus formes share
 * `arceus.ogg` instead of shipping 17 copies of it.
 */
const cryIndex = (() => {
  const map = new Map();
  if (!fs.existsSync(CRY_DIR)) return map;
  for (const file of fs.readdirSync(CRY_DIR)) {
    if (!/\.(ogg|mp3|wav)$/i.test(file)) continue;
    map.set(compactKey(path.parse(file).name), file);
  }
  return map;
})();

function cryFile(species) {
  const direct = cryIndex.get(compactKey(species.id));
  if (direct) return direct;
  const base = species.baseSpecies ? cryIndex.get(compactKey(species.baseSpecies)) : null;
  return base || null;
}

/* ------------------------------------------------------------------ *
 * Smogon tiers
 * ------------------------------------------------------------------ */

/**
 * Smogon's own tiers, imported rather than measured.
 *
 * This project previously ranked its roster by playing tens of thousands of
 * battles and cutting the result into tiers. That was removed by project
 * decision in favour of carrying Smogon's tiers across directly, so the tiers
 * players already know are the tiers they get. Nothing here is invented.
 *
 * Three things make a faithful import more than a field copy:
 *
 * 1. BANLIST TIERS ROLL UPWARD. `UUBL` means *banned from UU*, so it plays in
 *    OU. Treating it as its own rung, or as UU, would misplace 67 species.
 * 2. A SPECIES SV NEVER GOT STILL HAS A TIER — an older one. 336 of our roster
 *    are `Illegal` in Gen 9 simply because they are absent from that game, so
 *    the lookup walks back through the generations and takes the most recent
 *    real tier. That is still Smogon's judgement, just not this year's.
 * 3. MEGA EVOLUTION IS OURS AND NOT SV'S. Holding the stone needs no Key Stone
 *    here (§5), so a species that can Mega is only as fair as its *Mega* forme —
 *    Kangaskhan is RU but Mega Kangaskhan was Uber, and a UU format that let
 *    Kangaskhan in would really be letting an Uber in. The species therefore
 *    takes the stronger of its own tier and its best Mega forme's, with both
 *    recorded so the uplift is visible rather than mysterious.
 */
const toID = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '');

/**
 * Base species id -> the Mega formes it can turn into.
 *
 * Built from Mega Stone item data, the same source `registerMegaFormes` uses,
 * plus Rayquaza, which Mega Evolves off Dragon Ascent and so is named by no
 * item at all. Two-Mega species (Charizard, Mewtwo) yield both.
 */
/**
 * Held items that change forme on entry, mirroring `FORME_CHANGE_ITEMS` in
 * `src/core/mechanics.js`.
 *
 * Deliberately a second copy rather than an import: `mechanics.js` is a runtime
 * browser module and the generator must not load the engine. A declared-twice
 * table is exactly the drift this project keeps getting bitten by, so
 * `tests/data-validation.js` asserts the two agree entry for entry — the same
 * guard `BattleConstants` gets against `Mechanics`.
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
  herocharm: {Palafin: 'Palafin-Hero'},
  hearthflamemask: {Ogerpon: 'Ogerpon-Hearthflame'},
  wellspringmask: {Ogerpon: 'Ogerpon-Wellspring'},
  cornerstonemask: {Ogerpon: 'Ogerpon-Cornerstone'},
};

/** Holder species id -> every `{item, forme}` it can be turned into by an item. */
const ITEM_FORME_INDEX = (() => {
  const map = new Map();
  const add = (holder, item, forme) => {
    const key = toID(holder);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push({item, forme});
  };
  for (const item of dex.items.all()) {
    if (!item.exists || !item.megaStone) continue;
    if (typeof item.megaStone === 'string') {
      const target = dex.species.get(item.megaStone);
      if (target && target.exists) add(target.changesFrom || target.baseSpecies || target.name, item.id, target.name);
      continue;
    }
    for (const [holder, forme] of Object.entries(item.megaStone)) add(holder, item.id, forme);
  }
  for (const [item, mapping] of Object.entries(FORME_CHANGE_ITEMS)) {
    for (const [holder, forme] of Object.entries(mapping)) add(holder, item, forme);
  }
  // Rayquaza Mega Evolves off Dragon Ascent and holds no stone at all, so it is
  // named by no item. Recorded with a null item: the forme still has a tier, and
  // a tier format has to be able to refuse the *forme* even though there is no
  // item to ban. `formats.js` reads this as "requires Dragon Ascent".
  add('Rayquaza', null, 'Rayquaza-Mega');
  return map;
})();



const TIER_GENS = [9, 8, 7, 6, 5, 4, 3, 2, 1];
/** Banlist tier -> the tier it actually plays in. */
const TIER_ROLLUP = {
  AG: 'AG',
  Uber: 'Ubers', '(Uber)': 'Ubers',
  UUBL: 'OU', OU: 'OU', '(OU)': 'OU',
  RUBL: 'UU', UU: 'UU',
  NUBL: 'RU', RU: 'RU',
  PUBL: 'NU', NU: 'NU',
  ZUBL: 'PU', PU: 'PU', '(PU)': 'PU',
  ZU: 'ZU',
};
/**
 * Strongest first. **National Dex only tiers down to RU** — it has no official
 * NU, PU or ZU — so the lower three exist here purely to hold species that Nat
 * Dex does not rank and that only an older generation's tier can place.
 */
const TIER_ORDER = ['AG', 'Ubers', 'OU', 'UU', 'RU', 'NU', 'PU', 'ZU'];
const tierRank = t => { const i = TIER_ORDER.indexOf(t); return i === -1 ? TIER_ORDER.length : i; };

let TIER_DEXES = null;
/**
 * The tier Smogon gives this id, preferring **National Dex**.
 *
 * Nat Dex is the right ladder for this project because it is the format that
 * still has Mega Evolution, and because it ranks far more of the roster: 751 of
 * our species carry a Nat Dex tier against 509 with an SV one. Its cost is
 * granularity — Nat Dex stops at RU, so a little over five hundred species share
 * that one rung rather than spreading across NU/PU/ZU.
 *
 * Order of preference:
 *   1. `natDexTier` on the Gen 9 dex — current National Dex.
 *   2. the SV tier, for anything Nat Dex leaves blank.
 *   3. the most recent older generation that ranked it at all.
 * Returns `{tier, source, raw}`, an NFE/LC category, or null.
 */
/**
 * Tier moves this project makes on top of Smogon's, by project decision.
 *
 * Smogon ranks for a metagame **with Terastallization**. This project does not:
 * of eleven formats only Anything Goes and the two Tera variants allow it, so
 * regular Ubers and regular OU are otherwise being tiered by a rule they do not
 * play under. Where that gap changes the answer, it is corrected here.
 *
 * It lives in the generator for the same reason `LEGACY_BASE_STATS` and
 * `MOVE_OVERRIDES` do: `npm run build:data` would otherwise restore the
 * upstream tier on the next run.
 *
 * Applied inside `smogonTier`, which is the single choke point every tier read
 * goes through — species tiers *and* the per-forme tiers in `formeItemsFor` —
 * so a Mega listed here moves with its base rather than being missed.
 *
 * **The AG rung is emptied deliberately.** Without Tera the six that sat there
 * are an Ubers problem rather than an unplayable one, and an Anything Goes
 * ladder that duplicated the plain `anythinggoes` format was already removed
 * (§5). `AG` stays in `TIER_ORDER` because `tierRank` needs a top rung to
 * compare against.
 */
const TIER_OVERRIDES = {
  // The six that were AG. Regular Ubers has no Tera, so the ceiling they were
  // breaking is not the ceiling they now play under.
  xerneas: 'Ubers',
  calyrexshadow: 'Ubers',
  koraidon: 'Ubers',
  miraidon: 'Ubers',
  gengarmega: 'Ubers',
  rayquazamega: 'Ubers',

  /* ---------------------------------------------------------------- *
   * Ubers -> OU, 2026-08-15.
   *
   * Two separate arguments, deliberately kept apart because they are not the
   * same claim:
   *
   *   (a) Generation 9 entries whose Ubers case leaned on Terastallization.
   *       Regular OU and regular Ubers have Tera off, so the mechanic that
   *       carried them is simply absent.
   *   (b) Legacy "automatic Ubers" reassessed against RedGPT's own OU, which
   *       is far stronger than the historical formats that banned them — free
   *       Mega Evolution with no Key Stone, ~27 Megas already legal in OU,
   *       restored abilities and stats, and unconditional priority.
   *
   * Every entry here is a *tier* change only. Nothing about stats, moves,
   * abilities, items or forme mechanics moves with it.
   * ---------------------------------------------------------------- */

  // (a) Gen 9, Tera-dependent.
  ogerponhearthflame: 'OU',   // cannot reach its Tera forme or the Embody Aspect boost
  roaringmoon: 'OU',          // no Tera Flying Acrobatics, no defensive flip; still 4x Fairy
  baxcalibur: 'OU',           // loses defensive Tera; Mega stays Ubers, pinned below
  annihilape: 'OU',           // Rage Fist is the residual risk — first to revisit

  // (b) Legacy, reassessed against RedGPT's OU ceiling.
  dragapult: 'OU',
  darkrai: 'OU',
  deoxysspeed: 'OU',          // 180 Speed but only 95/95 offences
  /*
   * `magearna` and `magearnaoriginal` were here and were **removed on
   * 2026-08-16**, which puts both back at Nat Dex's own Uber. They are not
   * pinned to 'Ubers' explicitly: this table means "where this project
   * disagrees with Smogon", and on Magearna it no longer does, so the honest
   * representation is an absent row rather than an override that happens to
   * agree.
   *
   * Reversed on measured evidence rather than on reflection. Ring Target makes
   * Psychic hit Dark neutrally, and Magearna is the one OU Pokémon positioned
   * to pay for it: at +3 Calm Mind, Stored Power goes from a flat **immunity**
   * against Ting-Lu and Kingambit to 48.9-57.5% and 118.6-139.6%; at +6 it is
   * 260 BP for 351.7-413.9% into a fully defensive Kingambit. The Dark immunity
   * *was* the counterplay to a Stored Power sweep, and one item deletes it.
   */
  metagrossmega: 'OU',
  pheromosa: 'OU',
  dracovish: 'OU',
  blastoisemega: 'OU',
  naganadel: 'OU',
  spectrier: 'OU',
  kyuremblack: 'OU',
  solgaleo: 'OU',
  alakazammega: 'OU',
  necrozmadawnwings: 'OU',
  lunala: 'OU',
  marshadow: 'OU',
  deoxys: 'OU',               // NOT Deoxys-Attack, which stays Ubers
  lucariomega: 'OU',
  lugia: 'OU',
  dialga: 'OU',               // NOT Dialga-Origin, pinned below

  /*
   * Ubers pins — formes that must NOT follow their base species down.
   *
   * These are load-bearing rather than decorative. `formeItemsFor` estimates an
   * unranked forme's tier from its *base* species' tier, and it reads that
   * through this same function — so dropping Baxcalibur or Darkrai would have
   * quietly dragged their unranked Megas from Ubers to around OU with no line
   * anywhere saying so. Pinning them makes the intent explicit and immune to
   * the estimator.
   *
   * The Magearna pin is **no longer load-bearing** as of 2026-08-16, now that
   * the base is back at Ubers — the estimator would land near Ubers on its own.
   * It is kept because an explicit pin is cheaper to trust than a model, and
   * because it costs nothing.
   *
   * `magearnaoriginalmega` was pinned here and is **gone as of 2026-08-16**.
   * Magearna-Original became a cosmetic skin rather than a species, so it
   * carries no `formeItems` and nothing resolves that forme's tier any more —
   * the row was unreachable, which is the shape §8 keeps recording. Its old
   * job, incidentally, was to describe a Mega this project does not package at
   * all: the entry banned an item that could never have done anything.
   */
  baxcaliburmega: 'Ubers',
  darkraimega: 'Ubers',
  magearnamega: 'Ubers',
  dialgaorigin: 'Ubers',

  /*
   * Lucario-Mega-Z -> Ubers (2026-08-16, from the verified evidence pass).
   *
   * **This pins a forme Smogon has never ranked, so without this row it is
   * whatever `estimateFormeTier` guesses — which was OU.** That is precisely
   * the "softest evidence on the list" case the roster document warns about,
   * and it is now a decision instead of a guess.
   *
   * 70/100/70/164/70/151 with **Adaptability**, so STAB is 2x, on a pool that
   * includes Aura Sphere, Flash Cannon, Focus Blast, Dark Pulse, Shadow Ball,
   * Psychic, Dragon Pulse and **Nasty Plot**. Measured: Aura Sphere is
   * 56.9-66.8% into a fully defensive Great Tusk, 84.7-99.7% into Heatran,
   * 55.4-65.2% into Ting-Lu.
   *
   * The deciding argument is that RedGPT's unconditional priority — the thing
   * that normally contains a fast, frail special attacker here — does not
   * answer it, because Fighting/Steel *resists* the common priority types:
   * +1 Kingambit Sucker Punch 63.1-74.5% (a 2HKO, not a kill), Mega Mawile
   * Sucker Punch 39-46.1%, Choice Band Dragonite Extreme Speed 34.8-41.1%.
   *
   * **Only the forme moves.** Base Lucario stays RU and ordinary Lucario-Mega
   * stays OU; the effect is that Lucarionite Z becomes illegal in OU while
   * Lucarionite does not. That is the Absol/Absolite rule, and it is the whole
   * reason a forme can be tiered separately from its base.
   */
  lucariomegaz: 'Ubers',

  /*
   * Palafin -> ZU (2026-08-16, by project decision). **Its tier was measuring a
   * Pokémon you only get by holding an item.**
   *
   * Nat Dex ranks "Palafin" Uber, and it means Palafin-Hero: 650 BST with 160
   * Attack. Base Palafin is 457 BST, pure Water, 100/70/72/53/62/100 — and
   * because this project moved the transformation onto the **Hero Charm**
   * (§5, Zero to Hero is a hookless entry), a Palafin holding anything else has
   * a blank ability slot as well. It was sitting in Ubers as a 457 BST Pokémon
   * with no ability at all, which is not a tiering opinion anybody formed.
   *
   * ZU rather than PU because of that blank slot: its BST neighbours there
   * (Seaking 450, Jumpluff 460, Masquerain 454) all have working abilities.
   *
   * **The ban stays, it just moves to the right object.** Palafin-Hero is
   * untouched at Ubers, and `formeItemsFor` reads the *target's* tier, so the
   * Hero Charm is refused everywhere below Ubers — exactly the Absol/Absolite
   * rule. Palafin plays in ZU; the Hero Charm plays in Ubers and Anything Goes.
   */
  palafin: 'ZU',

  /* ---------------------------------------------------------------- *
   * OU -> UU, 2026-08-16 (the OU -> UU pass, carried out).
   *
   * Decided from a verified-evidence packet the same way the Ubers pass was:
   * packaged learnsets read from the data and damage from the real engine.
   * Every entry here is a *tier* change only — nothing about stats, moves,
   * abilities, items or forme mechanics moves with it.
   *
   * The recurring argument across the list is **role competition inside UU**:
   * in almost every case UU already contains a Pokemon doing the same job at
   * least as well, so the OU entry is a variant rather than a ceiling. Where
   * that is the whole reasoning the comparison is named on the line.
   * ---------------------------------------------------------------- */

  // Two Megas that lose to their own base forme. Both were sitting on
  // `estimateFormeTier`'s guess (see the pins below for why that matters).
  scolipedemega: 'UU',        // base Scolipede is UU and *better*: one Speed Boost
                              // is 532 against the Mega's 490 after a whole turn
                              // of Agility, and the Mega gives up Speed Boost and
                              // item freedom for Shell Armor.
  skarmorymega: 'UU',         // Stalwart is inert in singles (redirection, §9), so
                              // the Mega trades 30 Def and item freedom for an
                              // effectively blank ability.

  // Bases whose UU counterpart already covers the role.
  slowbro: 'UU',              // Mega Slowbro (already UU) and Slowking both there
  irontreads: 'UU',           // Excadrill: stronger, and faster still under sand
  weavile: 'UU',              // UU revenge pressure OHKOs it back many ways over
  gyarados: 'UU',             // Salamence is faster, stronger and 600 BST; the
                              // 4x Electric weakness is permanent with no Tera
  thundurustherian: 'UU',     // a sidegrade of Thundurus, which is already UU
  okidogi: 'UU',              // Buzzwole and Conkeldurr already there
  corviknight: 'UU',          // Skarmory and Celesteela already there
  hatterene: 'UU',            // Mega Gardevoir and Mega Sableye already there,
                              // and it is 29 Speed with limited recovery
  hawlucha: 'UU',             // Unburden is real but must spend an item first
  zapdosgalar: 'UU',          // Terrakion and Mienshao already there
  moltres: 'UU',              // an excellent UU pivot/breaker, not an unhealthy one
  ironcrown: 'UU',            // Jirachi is the more flexible Steel/Psychic
  pecharunt: 'UU',            // modest offensive ceiling; **monitoring candidate**
                              // if Poison Puppeteer proves too disruptive in play

  /*
   * OU pin — a forme that must not follow its base species down.
   *
   * Hawlucha-Mega is **unranked**, so `formeItemsFor` estimates it from base
   * Hawlucha's tier, and dropping Hawlucha to UU could have taken the
   * Hawluchanite with it. The Absol/Absolite rule is the point: Hawlucha plays
   * in UU and simply may not hold the stone there.
   *
   * **Measured, and it is NOT load-bearing today** — the same shape the
   * Magearna pin above records. With this row deleted and the data rebuilt,
   * `estimateFormeTier` lands Hawlucha-Mega on OU by itself, so the tier does
   * not actually move. It is kept for the two reasons that pin is kept: an
   * explicit decision is cheaper to trust than a model, and it costs nothing.
   *
   * It does buy one real thing. The `tierSource` becomes `redgpt-override`
   * instead of `estimated`, so the Pokédex stops labelling this forme's tier a
   * guess and `species.tier` and the enforced `formeItems` tier now agree —
   * which is one fewer entry in the §10 "unranked Megas disagree" set.
   *
   * **Do not write a control that deletes this row**: it would leave the suite
   * green and report VACUOUS. The control that exists instead sets it to `UU`,
   * which proves the *test* would catch the Mega following its base down.
   *
   * Slowbro-Mega and Gyarados-Mega need no pin and deliberately do not get one:
   * both are ranked by Nat Dex (UU and OU respectively), so the estimator is
   * never consulted for them and an override would only restate Smogon. This
   * table means "where this project disagrees with Smogon" — the Magearna rows
   * were removed on exactly that argument.
   */
  hawluchamega: 'OU',

  /* ---------------------------------------------------------------- *
   * RU -> UU, 2026-08-16 (the RU pass, carried out).
   *
   * Four entries, and **three of the four are cases the tier import could not
   * have got right**: two are `estimated` formes, which the nearest-neighbour
   * model places from BST and base tier with no notion of movepool or ability,
   * and one is a species whose imported tier predates this project's redesign
   * of the ability that defines it.
   *
   * No RU -> NU drops. The downward review found nothing NU could do as well.
   * ---------------------------------------------------------------- */

  // Estimated formes the model misplaced. Both keep their base where it is.
  raichumegay: 'UU',          // 60/100/55/160/80/130, **No Guard** — SpA 460, Spe 394,
                              // and No Guard makes Sing a *guaranteed* sleep on a
                              // Nasty Plot attacker. Thunder and Focus Blast also
                              // stop missing: Thunder into Crobat 148.1-174.3%,
                              // Focus Blast into Steelix 122.9-144.6%.
  pyroarmega: 'UU',           // 86/88/92/129/86/126, **Fire Mane** (1.5x the
                              // offensive stat on Fire moves), so 392 SpA badly
                              // understates it: restored 140 BP Overheat is
                              // 274.6-323.2% into Steelix and 293.3-345.3% into
                              // Tangrowth, at 386 Speed.

  // Species whose RU placement predates a RedGPT mechanic.
  regieleki: 'UU',            // 200 base Speed — **548** at max +Spe against RU's
                              // next fastest at 441 — with Transistor, restored
                              // 120 BP Thunder, and **Ring Target legal** (it is
                              // not a Mega), which removes the Ground immunity
                              // that normally balances a mono-Electric attacker.
  metagross: 'UU',            // 80/135/130/95/90/70 with **Light Metal**, which
                              // this project redesigned into +1 Speed on EVERY
                              // entry: ~262 Spe becomes ~393 with no setup turn,
                              // on a 600 BST physical wall-breaker that keeps full
                              // item freedom. The imported tier cannot know that.

  /*
   * RU pins — the estimator's ripple, and it is NOT decorative this time.
   *
   * `estimateFormeTier` builds its model from every Mega whose tier resolves,
   * and an override makes a previously-unranked forme resolve. So promoting
   * Raichu-Mega-Y and Pyroar-Mega turned them into datapoints — two ZU-based
   * Megas now sitting in UU — and the model promptly dragged **four other
   * ZU-based estimated Megas up with them**. Measured: without these pins the
   * pass moved 8 entries instead of 4, and UU came out at 94 rather than 90.
   *
   * Eelektross-Mega, Raichu-Mega-X, Scovillain-Mega and Victreebel-Mega were
   * never reviewed and are pinned back to the tier they were already in. This
   * is the §5 rule about the estimator stated in the other direction: **any
   * tier change that makes an unranked forme ranked needs a re-diff, because
   * the model moves under it.**
   */
  eelektrossmega: 'RU',
  raichumegax: 'RU',
  scovillainmega: 'RU',
  victreebelmega: 'RU',

  /* ---------------------------------------------------------------- *
   * NU -> RU and NU -> PU, 2026-08-16 (the NU pass, carried out).
   *
   * Six promotions and one demotion, decided from `docs/NU_FINAL_EVIDENCE.md`.
   * Every entry here is a *tier* change only — nothing about stats, moves,
   * abilities, items or forme mechanics moves with it.
   *
   * **Two of the six promotions turn on a RedGPT ability redesign the imported
   * tier could not have known about**, which is the same shape that moved
   * Metagross RU -> UU: Light Metal and Heavy Metal are entry boosts here, not
   * weight modifiers. Those two are named on their lines.
   * ---------------------------------------------------------------- */

  // Redesigned-ability cases. The imported tier predates the redesign.
  duraludon: 'RU',            // 70/95/115/120/50/85 with **Light Metal**, which this
                              // project redesigned into +1 Speed on EVERY entry:
                              // ~295 Spe becomes ~442 with no setup turn, no item
                              // and no weather, above every listed NU Speed tier
                              // (Aerodactyl 394, Kilowattrel 383, Raikou 361), while
                              // keeping 120 SpA, 115 Def, item freedom and both
                              // restored 140 BP STABs. 50 SpD keeps it out of UU.
  copperajah: 'RU',           // 122/130/69/80/69/30 with **Heavy Metal**, redesigned
                              // here into +1 Atk / +1 Def / -2 Spe on entry: ~394 Atk
                              // becomes ~591 before the item, with full item freedom.
                              // The -2 Spe costs a base-30 attacker almost nothing and
                              // is an asset under Trick Room. Poor special bulk keeps
                              // it manageable at RU.

  // Versatility and offensive-ceiling cases against the NU defensive pool.
  infernape: 'RU',            // 76/104/71/104/71/108, mixed by construction: restored
                              // 140 BP Overheat *and* redesigned 150 BP Focus Punch,
                              // plus Nasty Plot, Swords Dance, Slack Off, U-turn,
                              // Stealth Rock, Knock Off, Encore, Taunt and an
                              // unconditional +3 Upper Hand. One NU answer cannot
                              // cover both attacking sides at once.
  tornadus: 'RU',             // 79/115/70/125/80/111, restored 120 BP Hurricane with
                              // Nasty Plot, Prankster/Defiant, U-turn, Knock Off,
                              // Taunt, Defog and Tailwind. NU's special walls exist
                              // but 111 Speed makes forcing them in unreliable.
  munkidori: 'RU',            // 88/75/66/130/90/106 with Nasty Plot, Toxic Chain,
                              // Future Sight, Parting Shot and item freedom; its
                              // damage table is already awkward for NU *before* the
                              // boost, and it keeps momentum on the way out.
  meloettapirouette: 'RU',    // 100/128/90/77/77/128 Normal/Fighting, 150 BP Focus
                              // Punch off 128 Atk at 128 Speed with item freedom.
                              // **Only the Pirouette entry moves; base Meloetta
                              // stays NU.** Note this is a roster classification
                              // change and nothing more: Meloetta-Pirouette carries
                              // `battleOnly: 'Meloetta'`, so the validator refuses it
                              // in every tier format at every tier, and no route into
                              // it exists (Relic Song is not implemented as a forme
                              // change). See the NU pass notes in §10.

  /*
   * Audino-Mega -> PU. **The forme drops and the base does not** — the
   * Absol/Absolite rule, pointed the same way the OU -> UU Megas were.
   *
   * Mega Audino is 103/60/126/80/126/50 Normal/Fairy with Healer, and it pays
   * for that bulk with the Audinite: no Leftovers, no Boots, no item at all, and
   * the team's single Mega slot spent on a passive support piece. **Base Audino
   * is already PU and keeps Regenerator plus full item freedom**, which is the
   * comparison that decides it; PU also holds Alcremie with real Recover.
   *
   * Base Audino is untouched and stays PU. The effect is that the Audinite
   * becomes legal in PU, where it was previously refused.
   */
  audinomega: 'PU',

  /* ---------------------------------------------------------------- *
   * The PU pass and the global trapping-ability pass, 2026-08-16.
   *
   * Two audits implemented together because they overlap on one rung: the PU
   * pass promotes five entries and drops none, while the trapping pass moves
   * four holders across three rungs. Every entry here is a *tier* change only —
   * no mechanic, ability, item, move or stat moves with it, and in particular
   * **no trapping ability is banned anywhere**. The policy is to tier the
   * holder, never to ban the ability.
   * ---------------------------------------------------------------- */

  // -- PU -> NU. Five promotions, no demotions. --
  aggron: 'NU',               // 70/110/180/60/60/50 with **Heavy Metal**, redesigned
                              // here into +1 Atk / +1 Def / -2 Spe on entry. Base 50
                              // Speed makes the drawback nearly free, and it keeps
                              // full item freedom behind Steel Roller 130, Head Smash
                              // 150 and Focus Punch 150.
  heracross: 'NU',            // 125 Atk with **Guts** and an Orb that fires ON ENTRY,
                              // so Guts is live from the turn it arrives — a state the
                              // generic profile does not show. Megahorn 120, Focus
                              // Punch 150, Swords Dance, and unconditional Upper Hand
                              // (+3) covering base 85 Speed.
  hariyama: 'NU',             // 144 HP / 120 Atk, same entry-Guts interaction, with an
                              // unusually deep priority set for the tier (Upper Hand
                              // +3, Fake Out +3, Feint +2, Bullet Punch +1). Poor
                              // Speed is what keeps it at NU rather than higher.
  decidueyehisui: 'NU',       // role compression rather than raw power: physical and
                              // special breaker, setup, Roost, Defog, U-turn, Knock
                              // Off, Haze, Taunt, Tailwind — plus three unconditional
                              // priority moves (Sucker Punch, Grassy Glide, Upper Hand).
  pawmot: 'NU',               // 115 Atk / 105 Spe with item freedom, Double Shock 120
                              // and Focus Punch 150, and priority on top of real Speed
                              // rather than as compensation for the lack of it.

  /*
   * -- The global trapping-ability pass. --
   *
   * Measured first, then tiered. `battle.isTrapped`'s predicate was run against
   * every roster entry for each holder, and the censuses below are engine
   * output rather than estimates. **Trapping a Pokemon is not beating it** —
   * Ghost, Shed Shell, Guard Dog, all six pivot moves and phazing all escape —
   * which is why three of the seven ZU holders did not move at all.
   */
  chandelure: 'UU',           // Shadow Tag is optional here (one of four), but 145 SpA
                              // with item freedom, Calm Mind, Trick, Taunt, Substitute
                              // and Will-O-Wisp behind it is not an NU package: the
                              // predicate catches 52 of 58 NU and 118 of 128 RU, so RU
                              // is still too permissive. **Base only** — see the pin.
  gothitelle: 'NU',           // ZU -> NU, two rungs. Its 95 SpA / 65 Spe line understates
                              // it: the value is selecting a passive target, trapping it
                              // and setting up. Predicate catches 240 of 254 ZU and 65 of
                              // 71 PU, so PU is still too permissive; NU's offensive
                              // ceiling is what limits it.
  dugtrio: 'PU',              // Arena Trap is the narrowest of the three here — Flying,
                              // Levitate, Air Balloon, Ghost, Shed Shell and Guard Dog
                              // all escape — but it still catches 203 of 254 ZU with 120
                              // Speed and unconditional Sucker Punch. 35/50 bulk and only
                              // 100 Attack keep it out of NU.
  wobbuffet: 'PU',            // 190 HP with Counter / Mirror Coat / Encore, and the
                              // predicate catches 240 of 254 ZU. Historical Ubers
                              // assumptions do not transfer: it has no offensive
                              // movepool, no recovery and no pivot, and RedGPT lets six
                              // pivot moves and phazing walk out of the trap.

  /*
   * Trapping holders reviewed and deliberately LEFT, recorded so the absence of
   * a row is a decision rather than an oversight:
   *
   * - **Gengar-Mega stays Ubers** (forced Shadow Tag, 170 SpA / 130 Spe, Perish
   *   Song). Base Gengar is untouched at UU; the Gengarite carries the ban.
   * - **Magnezone stays RU** — Magnet Pull reaches only 15 of 128 RU entries.
   * - **Golem-Alola, Probopass and Meltan stay ZU** — Magnet Pull reaches 9 of
   *   254 ZU entries, which is a niche rather than a tier problem.
   */

  /*
   * PU pin — Chandelure-Mega must NOT follow its base up.
   *
   * This one **is** load-bearing, unlike the Hawlucha and Magearna pins.
   * Chandelure-Mega is an `estimated` forme, so `formeItemsFor` derives its tier
   * from base Chandelure's — and moving the base NU -> UU drags the Mega with it
   * unless it is pinned. The verdict was explicit that only base Chandelure
   * moves, so the Mega is held at the UU the estimator already gave it.
   */
  chandeluremega: 'UU',

  /* ---------------------------------------------------------------- *
   * ZU -> PU, 2026-08-17 (the ZU pass, carried out). **The last rung.**
   *
   * ZU is the floor, so this pass is one-directional by construction: there is
   * no tier below it and "too weak for ZU" has nowhere to go. Four promotions,
   * no demotions, and every entry here is a *tier* change only.
   *
   * The two 670 BSTs were reviewed and deliberately LEFT: Slow Start and Truant
   * are both fully implemented and are each species' only ability, so Regigigas
   * and Slaking really do pay their drawbacks. A promotion argument from BST
   * alone does not survive that.
   * ---------------------------------------------------------------- */
  medicham: 'PU',             // **Pure Power**, so its 410 BST badly understates it:
                              // ~480 effective Attack with item freedom, Recover,
                              // 150 BP Focus Punch, Psychic STAB, Trick, Taunt and
                              // an unconditional +3 Upper Hand. Focus Punch is
                              // 101.9-120.3% into Regirock — ZU's base-200-Defence
                              // benchmark. 80 Speed and 60/75/75 bulk keep it at PU.
                              // **Only the base moves**: Medicham-Mega is Nat-Dex
                              // ranked at OU, so it is untouched and the Medichamite
                              // stays refused below OU — the Absol/Absolite rule.
  rampardos: 'PU',            // 97/165/60/65/50/58 — ~471 Attack with item freedom,
                              // Mold Breaker / Sheer Force, 150 BP Head Smash and
                              // 150 BP Focus Punch. A high-ceiling, exploitable
                              // wallbreaker; 58 Speed and 60/50 bulk are the price.
                              // Archeops is the PU comparator that keeps it here.
  virizion: 'PU',             // 91/90/72/90/129/108 at ~346 Speed, mixed by
                              // construction (140 BP Leaf Storm and 120 BP Close
                              // Combat), with 129 SpD and the RedGPT priority package
                              // — Grassy Glide, Upper Hand, Quick Attack, Vacuum
                              // Wave. Promoted on the offence/bulk combination, NOT
                              // on the 580 BST.
  /* ---------------------------------------------------------------- *
   * The untiered-roster audit, 2026-08-17. **The NFE/LC discard is over.**
   *
   * 473 selectable species carried no tier and were refused in all seven tier
   * formats. They are all placed now: ZU is the floor (applied in the species
   * loop, not here — 430 entries), and the 43 below are the explicit exceptions
   * that go higher.
   *
   * **Eviolite is the mechanic the whole pass turns on** — implemented here and
   * gated on `Dex.evolutions(...).length`, so every NFE gets 1.5x Def and SpD.
   * A raw stat line understates all of them. Several entries below are instead
   * decided by a RedGPT-specific redesign, and those are named on their lines.
   * ---------------------------------------------------------------- */

  // -- Untiered -> RU. Exactly one. --
  porygon2: 'RU',             // Eviolite reaches ~459 Def / ~339 SpD, and **RedGPT
                              // Download gives +1 Atk AND +1 SpA on EVERY entry** —
                              // so it is bulky, has Recover, pivots with Teleport,
                              // spreads status, and re-boosts every time it comes
                              // back in. 60 Speed and the spent item slot keep it
                              // below UU.

  // -- Untiered -> NU. Exactly four. --
  gligar: 'NU',               // Eviolite Def ~508 with Ground AND Electric immunity,
                              // Roost, Spikes, Toxic Spikes, Stealth Rock, Defog,
                              // U-turn. Promoted on role compression, not power.
  magneton: 'NU',             // 120 SpA (~372) with restored 120 BP Thunder and 140 BP
                              // Steel Beam, Volt Switch, Teleport, and a real choice
                              // between Eviolite and an offensive item. Magnet Pull is
                              // legal but escapable (Ghost, Shed Shell, Guard Dog,
                              // pivots, phazing), so it does not follow Magnezone to RU.
  rhydon: 'NU',               // 130 Atk (~394) / 105 HP / 120 Def, Eviolite Def ~558,
                              // Ground/Rock STAB and Stealth Rock. It must pick between
                              // Eviolite and an offensive item, which is the counterplay.
  doublade: 'NU',             // Eviolite Def ~657 on Steel/Ghost, and **not passive**:
                              // ~350 Atk before Swords Dance, plus Shadow Sneak. Poor
                              // SpD and no real recovery stop it going higher.

  // -- Untiered -> PU. Exactly thirty-eight. --
  floetteeternal: 'PU',       // the ONLY fully-evolved entry of the 473, so **Eviolite
                              // does not apply to it**. BST 551, 125 SpA / 128 SpD / 92
                              // Spe with 140 BP Light of Ruin, Calm Mind, Wish and
                              // cleric support. Florges is BST 552 and PU — one point
                              // apart, same typing, same abilities. 67 Def is the limit.
  typenull: 'PU',             // 95 across the board, Eviolite ~475/~339, but 59 Speed,
                              // Rest-only recovery and 95 offence.
  scyther: 'PU',              // 110 Atk / 105 Spe with Technician, Swords Dance, Roost,
                              // Defog, U-turn — and it cannot hold Eviolite, Boots and
                              // an offensive item at once. That choice is the ceiling.
  ursaring: 'PU',             // 130 Atk with **Guts and an Orb that fires ON ENTRY**, so
                              // it arrives boosted; 55 Speed and no priority answer it.
  dipplin: 'PU',              // **Supersweet Syrup fires on EVERY entry here**, on top of
                              // Eviolite, Recover and dual 140 BP STAB (Leaf Storm,
                              // Draco Meteor). 40 Speed keeps it in PU.
  tangela: 'PU',              // 115 Def with **Regenerator** and Eviolite, 140 BP Leaf
                              // Storm, Sleep Powder. Base 40 SpD is the hole.
  dusclops: 'PU',             // Eviolite ~591 Def / ~444 SpD — the bulkiest of the 473 —
                              // but low HP, near-zero offence and Rest-only longevity.
  corsolagalar: 'PU',         // Eviolite ~492/~354 on Ghost typing **with real Recover**,
                              // which is what separates it from the passive walls.
  sliggoohisui: 'PU',         // Steel/Dragon with 113 SpD and Eviolite behind 140 BP
                              // Draco Meteor and Steel Beam; no recovery, very slow.
  piloswine: 'PU',            // 100 HP / 100 Atk, Eviolite, Ground/Ice STAB, Ice Shard,
                              // Stealth Rock.
  crocalor: 'PU',             // **Unaware** plus Eviolite plus Slack Off — reliable
                              // recovery behind a boost-ignoring wall. Mono-Fire and slow.
  lairon: 'PU',               // **Heavy Metal is +1 Atk / +1 Def / -2 Spe on entry here**,
                              // stacked on Eviolite. The 4x weaknesses and poor SpD are
                              // what hold it at PU.
  gurdurr: 'PU',              // 105 Atk with Guts and 150 BP Focus Punch — and it cannot
                              // hold Eviolite and an Orb at once, which is the limit.
  machoke: 'PU',              // 100 Atk, Guts / No Guard, 150 BP Focus Punch, same
                              // item tension as Gurdurr.
  meditite: 'PU',             // the sharpest low-BST false signal: **Pure Power** takes it
                              // to ~392 Attack, with Recover and an unconditional +3
                              // Upper Hand. Tiny raw stats keep it here.
  primeape: 'PU',             // 105 Atk / 95 Spe, Defiant, 150 BP Focus Punch, U-turn —
                              // an NFE only because Annihilape exists.
  sneaselhisui: 'PU',         // 95 Atk / 115 Spe Fighting/Poison with 150 BP Focus Punch,
                              // 120 BP Gunk Shot and +3 Upper Hand. Frail.
  fraxure: 'PU',              // 117 Atk with Dragon Dance, Swords Dance, 120 BP Outrage
                              // and +2 First Impression.
  zweilous: 'PU',             // **Hustle** takes it to ~442 Attack behind 120 BP Outrage;
                              // dreadful Speed and the Fairy weakness answer it.
  servine: 'PU',              // **Contrary + restored 140 BP Leaf Storm**, so every Leaf
                              // Storm is full STAB damage AND +2 SpA. That scaling is the
                              // whole placement.
  combusken: 'PU',            // **Speed Boost** on a mixed attacker with 140 BP Overheat
                              // and 150 BP Focus Punch — far more than its BST implies.
  raboot: 'PU',               // **Libero re-triggers on EVERY move here**, not once per
                              // switch-in, behind Swords Dance, U-turn and Sucker Punch.
  thwackey: 'PU',             // **Grassy Surge plus RedGPT's unconditional 70 BP +1 Grassy
                              // Glide** — automatic terrain and priority STAB together.
  qwilfishhisui: 'PU',        // Intimidate, Eviolite, Spikes, Toxic Spikes, Flip Turn on
                              // Dark/Poison — defensive utility plus pivoting.
  duosion: 'PU',              // 125 SpA with Eviolite, Recover and **Magic Guard or
                              // Regenerator**; its Speed is what keeps it out of NU.
  kadabra: 'PU',              // 120 SpA / 105 Spe with Magic Guard and Recover; its
                              // physical bulk is the reason PU rather than NU.
  roselia: 'PU',              // 100 SpA and Eviolite behind 140 BP Leaf Storm, Spikes,
                              // Toxic Spikes, Sleep Powder and cleric support.
  gothorita: 'PU',            // **optional Shadow Tag** with Eviolite, Calm Mind and Nasty
                              // Plot. Much weaker than NU Gothitelle, so it does not
                              // inherit that placement — but trapping plus setup is not ZU.
  lampent: 'PU',              // optional Shadow Tag with 95 SpA and 140 BP Overheat; slow,
                              // frail without Eviolite, Rest-dependent.
  slowpoke: 'PU',             // **Regenerator + Eviolite + Slack Off + Teleport** — an
                              // extremely durable pivot for its stat line.
  slowpokegalar: 'PU',        // the same package on a different defensive typing.
  naclstack: 'PU',            // 100 Def with Eviolite, **real Recover** and Purifying
                              // Salt's status immunity, plus Stealth Rock.
  togetic: 'PU',              // Eviolite ~442 Def / ~369 SpD on Fairy/Flying with Roost,
                              // Soft-Boiled, Defog, Baton Pass and cleric support.
  porygon: 'PU',              // the same redesigned **Download** as Porygon2 (+1 Atk and
                              // +1 SpA every entry) with Eviolite and Recover, on much
                              // worse stats — hence PU rather than RU.
  vullaby: 'PU',              // Dark/Flying with Eviolite, Roost, Defog, U-turn and a
                              // useful immunity set.
  clefairy: 'PU',             // **Magic Guard + Eviolite + Soft-Boiled**, plus Stealth
                              // Rock, Teleport and Baton Pass.
  golbat: 'PU',               // Eviolite, Roost, 90 Speed, Defog, U-turn on Poison/Flying.
  mienfoo: 'PU',              // **Regenerator + Eviolite + U-turn** with 150 BP Focus
                              // Punch and +3 Upper Hand — staying power plus tempo.

  /*
   * The three Megas the sprite-key fix packaged on 2026-08-17, now REVIEWED and
   * pinned rather than left on the estimator's guess.
   *
   * This is the point of pinning them: `estimateFormeTier` builds its model from
   * every Mega whose tier resolves, and the Chandelure case one pass earlier
   * proved a base moving can drag an `estimated` forme two rungs. These three
   * carry reviewed verdicts now, so they must not move when the model shifts.
   * `tierSource` also becomes `redgpt-override`, so the Pokedex stops calling
   * these tiers a guess.
   *
   * Floette-Mega is a retention, NOT a new OU entry — it was already counted in
   * OU before this pass, having entered on the estimate this row now replaces.
   */
  floettemega: 'OU',          // BST 651, 155 SpA / 148 SpD / 102 Spe with **Fairy Aura**
                              // (1.33x Fairy — measured, and it boosts Fairy moves aimed
                              // AT it too). Costs the Mega slot and the item slot, and
                              // only Floette-Eternal can produce it.
  meowsticmmega: 'RU',        // 143 SpA / 124 Spe, but mono-Psychic with ordinary bulk and
                              // Trace, which is no guaranteed offensive multiplier.
  tatsugiricurlymega: 'RU',   // 135 SpA / 125 SpD, Storm Drain meaningful and **Commander
                              // near-worthless in singles**; 92 Speed and the forced stone.

  /*
   * Untiered-pass pin — the estimator ripple, and it fired exactly as recorded.
   *
   * **Delphox-Mega drifted UU -> OU** and was never reviewed. Two things in this
   * pass moved `estimateFormeTier`'s model underneath it: pinning Floette-Mega
   * made a previously *unresolved* forme resolve, adding a BST-651 / base-PU /
   * rank-OU datapoint; and the ZU floor changed the `baseRank` of every Mega
   * whose base used to fall through to RU by default.
   *
   * Delphox-Mega is base-PU and BST-adjacent to that new datapoint, so the
   * nearest-neighbour median moved a rung. Measured, not guessed: the pass
   * produced OU for it and this row puts it back at the UU the estimator gave it
   * before. **An unreviewed Pokemon must not move as a side effect.**
   */
  delphoxmega: 'UU',

  /*
   * The UU -> OU pass, 2026-08-17: **no promotions.** All 91 UU entries were
   * reviewed against the OU bar and every one stays, so this block contains no
   * tier movement at all.
   *
   * What it does contain is the seven UU formes that were sitting on
   * `estimateFormeTier`'s nearest-neighbour guess. They have now been reviewed
   * explicitly and are **retentions of the tier they already had** — the enforced
   * tier does not move for any of them. Pinning converts `tierSource` from
   * `estimated` to `redgpt-override`, which buys two things: the Pokedex stops
   * calling a reviewed verdict a guess, and the model can no longer drag a
   * reviewed forme when it shifts underneath.
   *
   * **Delete-controls on these rows are NOT vacuous, and that is the difference
   * from `hawluchamega`.** There the estimator already produced the pinned tier,
   * so deleting the row changed nothing observable. Here deleting a row restores
   * `estimated` provenance, which the pinning test asserts against directly — so
   * the delete fails properly, and a separate control moves one row to RU to
   * prove the test can also see a real tier change.
   *
   * Tier/pin the FORME, never the base: all seven base species keep their own
   * tiers untouched (Dragalge, Drampa, Emboar, Meganium, Scrafty, Staraptor and
   * Starmie are unaffected by these rows).
   */
  dragalgemega: 'UU',         // BST 594, Poison/Dragon, **Regenerator** — SpA 399 on a
                              // 123/97 defensive back half, but base 44 Speed and the
                              // forced Dragalgite; no Boots against its Ground weakness.
  drampamega: 'UU',           // BST 585, Normal/Dragon, **Berserk** — the highest SpA of
                              // the seven at 460, and the slowest attacking frame here
                              // (Speed 188). Berserk needs it to be hit under half first.
  emboarmega: 'UU',           // BST 628, Fire/Fighting, **Mold Breaker** — Atk 434 with
                              // real coverage, held down by Speed 273 and a Rock weakness
                              // the forced Emboarite denies it Heavy-Duty Boots against.
  meganiummega: 'UU',         // BST 625, Grass/Fairy, **Mega Sol** — a *personal* weather
                              // no teammate sees (measured), so its 1.5x Fire boost is a
                              // solo effect. SpA 423 off base 110 Speed's worth of frame.
  scraftymega: 'UU',          // BST 588, Dark/Fighting, **Intimidate** — Atk 394 on
                              // 65/135/135 bulk, but Speed 258 and a 4x Fairy weakness.
  staraptormega: 'UU',        // BST 585, Fighting/Flying, **Contrary** — Close Combat
                              // BUILDS defence here rather than shedding it (measured to
                              // +5/+5), which is the strongest single argument of the
                              // seven; Atk 416 / Spe 350 and no item to spare against it.
  starmiemega: 'UU',          // BST 620, Water/Psychic, **Huge Power** — Atk **656**, the
                              // highest in UU and above OU's own maximum. The physical
                              // STAB it is spent on is Waterfall 80 and Psycho Cut 70,
                              // and Skull Bash's single-turn 130 is neutral Normal, not
                              // STAB. Forced Starminite, and it costs the Mega slot.

  brutebonnet: 'PU',          // 111/127/99/79/99/55 — 127 Attack on a naturally bulky
                              // frame with **unconditional 80 BP STAB Sucker Punch**,
                              // Spore, Close Combat and full item freedom, which is
                              // what answers its 55 Speed. 4x Bug weakness and no
                              // recovery beyond Rest keep it manageable in PU.
};

function smogonTier(id) {
  if (TIER_OVERRIDES[id]) return {tier: TIER_OVERRIDES[id], source: 'redgpt-override', raw: TIER_OVERRIDES[id]};
  if (!TIER_DEXES) TIER_DEXES = TIER_GENS.map(g => ({gen: g, dex: Dex.forGen(g)}));

  /** The most recent generation ladder that ranked this id, and where. */
  const byGeneration = () => {
    for (const {gen, dex: genDex} of TIER_DEXES) {
      let hit = null;
      try { hit = genDex.species.get(id); } catch { hit = null; }
      if (!hit || !hit.exists) continue;
      const raw = String(hit.tier || '');
      if (TIER_ROLLUP[raw]) return {tier: TIER_ROLLUP[raw], source: `gen${gen}`, raw};
      if (raw === 'NFE' || raw === 'LC') return {tier: raw, source: `gen${gen}`, raw};
    }
    return null;
  };

  let entry = null;
  try { entry = dex.species.get(id); } catch { entry = null; }
  const natDex = entry && entry.exists ? String(entry.natDexTier || '') : '';

  if (natDex === 'NFE' || natDex === 'LC') return {tier: natDex, source: 'natdex', raw: natDex};

  if (TIER_ROLLUP[natDex]) {
    const tier = TIER_ROLLUP[natDex];
    /*
     * EXTENDING THE LADDER BELOW RU.
     *
     * National Dex has no NU, PU or ZU: everything Smogon does not rank in Uber,
     * OU, UU or RU is swept into RU, which puts a little over five hundred of our
     * species — Caterpie next to Rotom — on one rung. That is not a tier, it is
     * the absence of one.
     *
     * The four tiers above RU are left exactly as Nat Dex states them. The RU
     * bucket is then split using the *same kind of evidence Nat Dex itself is
     * built from*: Smogon's usage-derived tiers from the ladders that do rank
     * that deep — SV first, then the most recent older generation. A Pokemon
     * those ladders put in NU, PU or ZU takes that rung; one they rank at RU or
     * above stays in RU, because Nat Dex has already said it is no better than
     * RU there.
     *
     * Nothing is invented and nothing overrides Nat Dex where Nat Dex has an
     * opinion — this only resolves the rung Nat Dex declines to split.
     */
    if (tier !== 'RU') return {tier, source: 'natdex', raw: natDex};
    const deeper = byGeneration();
    if (deeper && ['NU', 'PU', 'ZU'].includes(deeper.tier)) {
      return {tier: deeper.tier, source: `natdex-RU refined by ${deeper.source}`, raw: `${natDex}/${deeper.raw}`};
    }
    return {tier: 'RU', source: 'natdex', raw: natDex};
  }

  return byGeneration();
}

/**
 * Every held item that turns this species into a different, separately tiered
 * Pokemon — Mega Stones, and the orbs and relics in `FORME_CHANGE_ITEMS`.
 *
 * **The forme is banned from a tier, not the Pokemon.** Absol is RU and Mega
 * Absol would flatten RU, so Absol stays in RU and loses the right to hold
 * Absolite there. Uplifting Absol to the Mega's tier instead — which an earlier
 * pass did — is the wrong shape twice over: it removes a perfectly fair RU
 * Pokemon from RU, and it lets the Mega into whatever tier the base was pushed
 * to. Recorded per item so a format can allow the species and refuse the stone.
 */
/**
 * Tier an alternate forme Smogon has never ranked.
 *
 * This project packages 46 Mega formes that do not exist in any Smogon format —
 * Absol-Mega-Z, Garchomp-Mega-Z, Dragonite-Mega and the rest. They still need a
 * tier, because the forme-ban rule is what keeps them out of RU.
 *
 * Rather than invent a scale, this reads the one Smogon already drew: the 48
 * Megas Nat Dex *does* rank. Each is a datapoint of "a Mega of a base in tier T,
 * with this BST, belongs in tier U". An unranked forme takes the median tier of
 * its nearest neighbours in that space, distance being BST difference plus a
 * weighted penalty for a different base tier — because a Mega of an Ubers
 * Pokemon is a very different proposition from a Mega of a ZU one at the same
 * BST.
 *
 * Always recorded with `estimated` provenance. A guess that cannot be
 * distinguished from imported data is the thing this project keeps refusing to
 * ship.
 */
let MEGA_MODEL = null;
function estimateFormeTier(target, baseTier) {
  if (!MEGA_MODEL) {
    MEGA_MODEL = [];
    for (const candidate of dex.species.all()) {
      if (!candidate.exists || !/-(Mega|Primal|Origin|Crowned)/.test(candidate.name)) continue;
      const own = smogonTier(candidate.id);
      if (!own || !TIER_ORDER.includes(own.tier)) continue;
      const holder = candidate.changesFrom || candidate.baseSpecies;
      const holderTier = holder ? smogonTier(toID(holder)) : null;
      MEGA_MODEL.push({
        bst: candidate.bst,
        baseRank: holderTier && TIER_ORDER.includes(holderTier.tier) ? tierRank(holderTier.tier) : tierRank('RU'),
        rank: tierRank(own.tier),
      });
    }
  }
  if (!MEGA_MODEL.length) return null;
  const baseRank = baseTier && TIER_ORDER.includes(baseTier) ? tierRank(baseTier) : tierRank('RU');
  const scored = MEGA_MODEL
    .map(m => ({rank: m.rank, d: Math.abs(m.bst - target.bst) + Math.abs(m.baseRank - baseRank) * 40}))
    .sort((a, b) => a.d - b.d)
    .slice(0, 5)
    .map(m => m.rank)
    .sort((a, b) => a - b);
  const median = scored[Math.floor(scored.length / 2)];
  return TIER_ORDER[Math.min(median, TIER_ORDER.length - 1)];
}

function formeItemsFor(species, itemFormeIndex) {
  const out = [];
  const seen = new Set();
  for (const {item, forme} of itemFormeIndex.get(toID(species.name)) || []) {
    if (seen.has(item)) continue;
    seen.add(item);
    const target = dex.species.get(forme);
    if (!target || !target.exists) continue;
    const hit = smogonTier(target.id);
    const ranked = hit && TIER_ORDER.includes(hit.tier) ? hit.tier : null;
    const ownTier = smogonTier(species.id);
    const estimated = ranked ? null : estimateFormeTier(target, ownTier ? ownTier.tier : null);
    out.push({
      item,
      forme: target.name,
      tier: ranked || estimated,
      tierSource: ranked ? hit.source : (estimated ? 'estimated' : null),
    });
  }
  return out;
}

/**
 * Stable RedGPT power class used by formats and Campaign pools. Derived from
 * the packaged Smogon tier snapshot plus legendary flags — it is a fixed
 * snapshot, not a live tier feed.
 */
function powerClass(species, apiS) {
  const tier = String(species.tier || '');
  const legendary = apiS ? apiS.is_legendary === '1' : false;
  const mythical = apiS ? apiS.is_mythical === '1' : false;
  if (tier === 'AG') return 'unrestricted-only';
  if (tier === 'Uber' || tier === '(Uber)') return 'restricted';
  if (species.battleOnly || species.requiredItem) return 'restricted';
  if (legendary || mythical) return 'restricted';
  return 'standard';
}

/* ------------------------------------------------------------------ *
 * Generation
 * ------------------------------------------------------------------ */

(async () => {
  const report = {
    generatedAt: new Date().toISOString(),
    enabled: 0,
    skipped: [],
    unusedFrontSprites: [],
    unusedBackSprites: [],
    unmatchedItems: [],
    speciesWithoutCry: [],
    abilitiesWithoutDescription: [],
    legacyAbilities: [],
    abilityOverrides: [],
  };

/**
 * Pre-nerf base stats, restored by project decision.
 *
 * Game Freak reduced these species in later generations/patches. RedGPT keeps
 * the earlier, stronger spreads, so the override is applied here rather than in
 * the packaged data — otherwise `npm run build:data` would quietly undo it.
 *
 * Scope: only genuine historical nerfs. Legends-series values (Arceus, Z-A) are
 * deliberately NOT used — those adjust stats to compensate for abilities the
 * battle system omits (Huge Power, Pure Power, Flower Gift and friends), which
 * is a different kind of change and not a nerf to reverse.
 *
 * `bst` is always recomputed from these six values; it is never hardcoded.
 */
const LEGACY_BASE_STATS = {
  // Gen VI/VII Aegislash, before the Gen VIII 150 -> 140 reduction. Both formes
  // are listed because the dataset stores each forme separately.
  aegislash:        {hp: 60, atk: 50, def: 150, spa: 50, spd: 150, spe: 60},   // 500 -> 520
  aegislashblade:   {hp: 60, atk: 150, def: 50, spa: 150, spd: 50, spe: 60},   // 500 -> 520
  // Pre-Gen IX Cresselia, before Def 120 -> 110 and SpD 130 -> 120.
  cresselia:        {hp: 120, atk: 70, def: 120, spa: 75, spd: 130, spe: 85},  // 580 -> 600
  // Sword/Shield-era box legendaries, before the Scarlet/Violet reductions.
  zacian:           {hp: 92, atk: 130, def: 115, spa: 80, spd: 115, spe: 138}, // 660 -> 670
  zaciancrowned:    {hp: 92, atk: 170, def: 115, spa: 80, spd: 115, spe: 148}, // 700 -> 720
  zamazenta:        {hp: 92, atk: 130, def: 115, spa: 80, spd: 115, spe: 138}, // 660 -> 670
  zamazentacrowned: {hp: 92, atk: 130, def: 145, spa: 80, spd: 145, spe: 128}, // 700 -> 720
  // Treasures of Ruin as shipped before the Scarlet/Violet v1.0.1 patch. The
  // whole spread is restored, so Ting-Lu's SpA drops 55 -> 50 as it originally was.
  wochien:          {hp: 85, atk: 90, def: 100, spa: 100, spd: 135, spe: 70},  // 570 -> 580
  chienpao:         {hp: 80, atk: 130, def: 80, spa: 90, spd: 65, spe: 135},   // 570 -> 580
  tinglu:           {hp: 165, atk: 110, def: 130, spa: 50, spd: 80, spe: 45},  // 570 -> 580
  chiyu:            {hp: 55, atk: 80, def: 80, spa: 145, spd: 120, spe: 100},  // 570 -> 580
};

  registerMegaFormes(dex);
  registerTypeItemFormes(dex);

  const allSpecies = dex.species.all()
    .filter(s => s.exists && s.num > 0)
    .sort((a, b) => a.num - b.num || a.name.localeCompare(b.name));

  const pokemon = [];
  const usedMoves = new Set(['struggle']);
  const usedAbilities = new Set();
  const usedFrontFiles = new Set();
  const usedBackFiles = new Set();
  const usedCryFiles = new Set();

  for (const s of allSpecies) {
    const skip = excludedReason(s);
    if (skip) {
      report.skipped.push({name: s.name, reason: skip});
      continue;
    }
    const sprites = findSprites(s);
    if (!sprites) {
      report.skipped.push({name: s.name, reason: 'no matching front+back sprite pair'});
      continue;
    }
    // Typing, learnset, abilities and evolutions are always upstream's; only the
    // six base stats are overridden, and only for the species listed above.
    const baseStats = LEGACY_BASE_STATS[s.id]
      ? Object.assign({}, s.baseStats, LEGACY_BASE_STATS[s.id])
      : s.baseStats;
    const bst = STATS.reduce((sum, k) => sum + (baseStats[k] || 0), 0);
    if (!s.types?.length || bst <= 0) {
      report.skipped.push({name: s.name, reason: 'incomplete species data'});
      continue;
    }

    const learnMap = await resolveLearnset(s);
    const learnset = {};
    for (const [move, level] of [...learnMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      const m = dex.moves.get(move);
      if (!m?.exists || m.isZ || m.isMax || m.isNonstandard === 'CAP') continue;
      learnset[move] = level;
      usedMoves.add(move);
    }
    if (!Object.keys(learnset).length) {
      report.skipped.push({name: s.name, reason: 'no resolvable learnset'});
      continue;
    }

    const abilities = {};
    for (const [slot, name] of Object.entries(s.abilities || {})) {
      const ability = dex.abilities.get(name);
      if (!ability?.exists) continue;
      abilities[slot] = ability.name;
      usedAbilities.add(ability.id);
    }
    /*
     * Legacy abilities: every ability the species has held in any generation
     * from 3 (when abilities were introduced) onward, including Dream World
     * hidden abilities that were later replaced. Gengar keeps Levitate,
     * Chandelure keeps Shadow Tag.
     *
     * **Appended, never inserted.** `Dex.abilityList` reads
     * `Object.values(abilities)`, and integer-like keys ('0', '1') always
     * enumerate first, so the `L*` keys land after '0', '1' and 'H'. That
     * ordering is load-bearing: a Mega forme takes `abilityList(species)[0]`
     * as its ability, so pushing a legacy entry to the front would silently
     * re-ability every Mega in the game.
     */
    let legacySlot = 0;
    const held = new Set(Object.values(abilities).map(name => dex.abilities.get(name)?.id));
    /*
     * **Only species that predate Generation 8.**
     *
     * The eleven species introduced in Gen 8 by Legends: Arceus — the Hisuian
     * formes, Kleavor, Basculegion, Enamorus — carry different abilities in the
     * Gen 8 dataset than in Gen 9, and those earlier values were never usable
     * by anyone: Legends: Arceus has no abilities in its battle system at all,
     * and the species were not legal in Sword/Shield. Scarlet/Violet shipped
     * the values that actually function.
     *
     * They are *not* Smogon inventions — Showdown flags its own creations
     * `isNonstandard: 'CAP'`, and these are flagged `'Future'`, meaning
     * official data for a species newer than the dex being queried. But an
     * ability no released battle system ever read is not an ability that was
     * *removed*, which is what this restoration is for. Gengar's Levitate ran
     * for six generations; Hisuian Growlithe's Justified ran for none.
     *
     * `s.gen` separates the two groups exactly: all eleven are Gen 8, all
     * fifteen genuine cases are Gen 1-7. No case-by-case list to maintain.
     */
    for (let g = 3; s.gen < 8 && g <= 8; g++) {
      const past = Dex.forGen(g).species.get(s.name);
      if (!past?.exists) continue;
      for (const name of Object.values(past.abilities || {})) {
        if (!name) continue;
        const ability = dex.abilities.get(name);
        // Skip anything gen 9 does not know about: the engine cannot implement
        // an ability that is not packaged, and it would ship as a dead string.
        if (!ability?.exists || held.has(ability.id)) continue;
        held.add(ability.id);
        abilities[`L${legacySlot++}`] = ability.name;
        usedAbilities.add(ability.id);
        report.legacyAbilities.push(`${s.name}: ${ability.name}`);
      }
    }
    if (!Object.keys(abilities).length) {
      abilities['0'] = 'No Ability';
      usedAbilities.add('noability');
    }

    /*
     * Project ability assignment, applied LAST so it replaces the whole list
     * rather than merging with it — including the legacy `L*` slots and the
     * `No Ability` fallback above. "This species' abilities are exactly these"
     * is the intended semantic, and a merge would leave the placeholder it is
     * meant to replace sitting in slot 0, where every Mega reads its ability.
     *
     * Ids are added to `usedAbilities` by hand because an addition from
     * `ABILITY_ADDITIONS` does not resolve through `dex.abilities.get` — that
     * is the whole reason it needed adding.
     */
    const abilityOverride = SPECIES_ABILITY_OVERRIDES[toID(s.name)];
    if (abilityOverride) {
      for (const key of Object.keys(abilities)) delete abilities[key];
      abilityOverride.forEach((name, i) => {
        abilities[String(i)] = name;
        usedAbilities.add(toID(name));
      });
      report.abilityOverrides.push(`${s.name}: ${abilityOverride.join(' / ')}`);
    }

    const apiP = apiPokemon.get(s.num);
    const apiS = apiSpecies.get(s.num);
    const statRows = apiStats.get(s.num) || [];
    const genderRate = apiS ? +apiS.gender_rate : null;
    let genderRatio = genderRate == null || genderRate < 0 ? null : {female: genderRate / 8, male: 1 - genderRate / 8};
    if (s.gender === 'N') genderRatio = null;
    else if (s.gender === 'M') genderRatio = {female: 0, male: 1};
    else if (s.gender === 'F') genderRatio = {female: 1, male: 0};
    else if (s.genderRatio) genderRatio = {female: s.genderRatio.F, male: s.genderRatio.M};

    usedFrontFiles.add(sprites.front);
    usedBackFiles.add(sprites.back);
    const cry = cryFile(s);
    if (cry) usedCryFiles.add(cry);
    else report.speciesWithoutCry.push(s.name);

    /*
     * Resolve the playable tier: Smogon's own, walked back through the
     * generations when SV has no entry, then lifted to the strongest Mega forme
     * this species can turn into, because holding the stone needs nothing here.
     */
    let resolved = smogonTier(s.id);
    if (!resolved && s.baseSpecies && toID(s.baseSpecies) !== s.id) resolved = smogonTier(toID(s.baseSpecies));
    /*
     * The species keeps its own tier. A forme it can turn into is recorded
     * separately with its own tier, so a format can admit the Pokemon and refuse
     * the item — Absol plays in RU, Absolite does not.
     */
    const formeItems = formeItemsFor(s, ITEM_FORME_INDEX);
    /*
     * EVERY SELECTABLE SPECIES GETS A LADDER TIER. ZU is the floor.
     *
     * **This reverses the original "NFE and LC are discarded" decision**
     * (2026-08-17, by project decision). That rule gave unevolved Pokemon no
     * tier at all, which read as tidy and had one consequence nobody wanted:
     * a tier format admits nothing off the ladder, so **473 selectable species
     * could not be put on a legal team anywhere** — reported from real play.
     *
     * The replacement is a floor rather than a category. Anything whose tier
     * does not resolve to a rung lands in **ZU**, which is what the bottom of a
     * ladder is for. The provenance stays honest: `from` records
     * `redgpt-zu-floor` and `raw` keeps the upstream category (`NFE`, `LC`,
     * `Illegal`), so a floored tier is never mistaken for an imported one.
     *
     * Explicit `TIER_OVERRIDES` still win — `smogonTier` checks them first — so
     * the 43 entries the untiered audit placed above ZU are unaffected by this.
     *
     * NOTE this is deliberately NOT "every unevolved Pokemon is ZU": Smogon
     * ranks a few unevolved Pokemon on the main ladder and those imports are
     * authoritative, which is why Chansey stays UU and Pikachu stays ZU by
     * import rather than by floor.
     */
    const onLadder = resolved && TIER_ORDER.includes(resolved.tier);
    const tierInfo = onLadder
      ? {tier: resolved.tier, source: {from: resolved.source, raw: resolved.raw}}
      : {tier: 'ZU', source: {from: 'redgpt-zu-floor', raw: resolved ? resolved.raw : null}};

    pokemon.push({
      id: s.id,
      num: s.num,
      name: s.name,
      baseSpecies: s.baseSpecies,
      forme: s.forme || null,
      types: [...s.types],
      baseStats: Object.fromEntries(STATS.map(k => [k, baseStats[k]])),
      bst,
      abilities,
      gen: s.gen || 1,
      tier: tierInfo.tier,
      tierRaw: s.tier || null,
      powerClass: powerClass(s, apiS),
      nonstandard: s.isNonstandard || null,
      // Upstream points Greninja-Ash at Greninja-Bond, which this project does
      // not package; retarget any such reference to the base forme so error
      // messages and forme links never name a species that does not exist.
      battleOnly: resolveForme(s.battleOnly, s.baseSpecies),
      requiredItem: s.requiredItem || null,
      changesFrom: resolveForme(s.changesFrom, s.baseSpecies),
      transformOnly: TRANSFORM_ONLY_SPECIES.has(s.id) || undefined,
      weightKg: s.weightkg ?? (apiP ? +apiP.weight / 10 : 10),
      heightM: apiP ? +apiP.height / 10 : (s.heightm ?? 1),
      catchRate: apiS ? +apiS.capture_rate : 45,
      baseExperience: apiP && apiP.base_experience ? +apiP.base_experience : Math.round(bst / 2),
      growthRate: apiS ? apiGrowth.get(+apiS.growth_rate_id) || 'medium' : 'medium',
      genderRatio,
      eggGroups: s.eggGroups || [],
      evYield: Object.fromEntries(statRows.filter(r => +r.effort > 0).map(r => [API_STAT_IDS[+r.stat_id], +r.effort])),
      prevo: s.prevo ? dex.species.get(s.prevo).id : null,
      evos: (s.evos || []).map(name => dex.species.get(name).id),
      evoType: s.evoType || null,
      evoLevel: s.evoLevel || null,
      evoItem: s.evoItem || null,
      evoCondition: s.evoCondition || null,
      evoMove: s.evoMove || null,
      legendary: apiS ? apiS.is_legendary === '1' : false,
      mythical: apiS ? apiS.is_mythical === '1' : false,
      learnset,
      front: sprites.front,
      back: sprites.back,
      cry,
      tierSource: tierInfo.source,
      formeItems: formeItems.length ? formeItems : null,
    });
  }

  /* ---------------- Cosmetic skins ---------------- */

  /*
   * Run after the species loop, because it compares finished entries — the
   * learnsets and the legacy ability union have to be resolved before two
   * formes can be called identical.
   */
  const skinOf = findCosmeticSkins(pokemon);
  const byIdForSkins = new Map(pokemon.map(p => [p.id, p]));
  for (const [skinId, baseId] of skinOf) {
    const skin = byIdForSkins.get(skinId);
    const base = byIdForSkins.get(baseId);
    if (!skin || !base) continue;
    skin.cosmeticOf = baseId;
    /*
     * The skin's own `formeItems` goes, and Magearna-Original is why: it named
     * a Mega this project does not package, so the entry banned an item that
     * could never do anything. The base's list is the real one, and the base is
     * what a set now records.
     */
    skin.formeItems = null;
    (base.skins ||= [{id: base.id, name: base.name, front: base.front, back: base.back}]);
    base.skins.push({id: skin.id, name: skin.name, front: skin.front, back: skin.back});
  }
  report.cosmeticSkins = [...skinOf].map(([skin, base]) => `${skin} -> ${base}`);

  /* ---------------- Evolution rules (source-centric) ---------------- */

  const byId = new Map(pokemon.map(p => [p.id, p]));
  /**
   * Solo-play adaptations. Trade, friendship, location and other multiplayer or
   * world-state evolution methods have no meaning in Arena or a roguelite run,
   * so each is converted into a level or item requirement here, in data.
   */
  const SOLO_TRADE_LEVELS = {
    kadabra: 36, machoke: 40, graveler: 40, haunter: 36, gravelleralola: 40,
    grimer: 38, poliwhirl: 37, slowpoke: 37, seadra: 45, scyther: 40, onix: 40,
    rhydon: 48, porygon: 30, porygon2: 45, feebas: 30, clamperl: 35, dusclops: 48,
    electabuzz: 40, magmar: 40, boldore: 38, gurdurr: 40, karrablast: 38, shelmet: 38,
    spritzee: 38, swirlix: 38, phantump: 38, pumpkaboo: 38, sliggoo: 50, sliggoohisui: 50,
    ursaring: 45, primeape: 45, stantler: 45, bisharp: 52, dipplin: 50, rhyhorn: 42,
  };
  const CONDITION_LEVELS = {
    friendship: 22, happiness: 22, day: 25, night: 25, dusk: 25,
  };

  for (const source of pokemon) {
    const rules = [];
    for (const targetId of source.evos) {
      const target = byId.get(targetId);
      if (!target) continue;
      const type = target.evoType || null;
      if (type === 'useItem' && target.evoItem) {
        rules.push({target: target.id, method: 'item', item: compactKey(target.evoItem).toLowerCase(), itemName: target.evoItem});
        continue;
      }
      if (type === 'levelExtra' || type === 'levelMove' || type === 'levelHold' || type === 'other' || type === 'trade' ||
          type === 'levelFriendship' || type === 'useMove' || type === null) {
        let level = target.evoLevel;
        if (!level && type === 'trade') level = SOLO_TRADE_LEVELS[source.id] || 40;
        if (!level && target.evoCondition) {
          const key = Object.keys(CONDITION_LEVELS).find(k => String(target.evoCondition).toLowerCase().includes(k));
          if (key) level = CONDITION_LEVELS[key];
        }
        if (!level && type === 'levelFriendship') level = 22;
        if (!level && (type === 'other' || type === 'levelMove' || type === 'useMove' || type === 'levelExtra')) level = Math.max(20, Math.min(55, Math.round((target.bst - source.bst) / 6) + 30));
        if (!level && type === 'levelHold') level = 40;
        if (!level && type === null) level = target.evoLevel || 0;
        if (level) rules.push({target: target.id, method: 'level', level, adapted: type !== null && type !== 'levelExtra' ? type : null});
        continue;
      }
      if (target.evoLevel) rules.push({target: target.id, method: 'level', level: target.evoLevel});
    }
    // Deduplicate identical targets and sort by requirement.
    const seen = new Set();
    source.evolutions = rules.filter(r => {
      if (seen.has(r.target)) return false;
      seen.add(r.target);
      return true;
    }).sort((a, b) => (a.level || 99) - (b.level || 99));
  }

  /* ---------------- Moves ---------------- */

  // Universal fallbacks plus everything the engine references directly.
  const ENGINE_MOVES = ['struggle', 'tackle', 'scratch', 'pound', 'protect', 'recover', 'rest', 'sleeptalk',
    'toxic', 'thunderwave', 'stealthrock', 'spikes', 'toxicspikes', 'defog', 'rapidspin', 'uturn', 'voltswitch',
    'knockoff', 'earthquake', 'closecombat', 'flamethrower', 'surf', 'thunderbolt', 'icebeam', 'shadowball',
    'psychic', 'energyball', 'dazzlinggleam', 'darkpulse', 'dragonpulse', 'moonblast', 'swordsdance',
    'nastyplot', 'calmmind', 'dragondance', 'irondefense', 'roost', 'synthesis', 'moonlight', 'willowisp',
    'lightscreen', 'reflect', 'auroraveil', 'raindance', 'sunnyday', 'sandstorm', 'snowscape', 'trickroom'];
  for (const id of ENGINE_MOVES) usedMoves.add(id);

  const moves = {};
  for (const id of [...usedMoves].sort()) {
    const m = dex.moves.get(id);
    if (m?.exists && !m.isZ && !m.isMax) moves[id] = cleanMove(m);
  }

  /* ---------------- Abilities ---------------- */

  const abilities = {};
  for (const id of [...usedAbilities].sort()) {
    const a = dex.abilities.get(id);
    if (!a?.exists) continue;
    abilities[id] = Object.assign({
      id: a.id, name: a.name, num: a.num ?? 0,
      shortDesc: a.shortDesc || a.desc || '',
      desc: a.desc || a.shortDesc || '',
      rating: a.rating ?? 0,
      isNonstandard: a.isNonstandard || null,
    }, ABILITY_OVERRIDES[id] || {});
    if (!abilities[id].shortDesc) report.abilitiesWithoutDescription.push(a.name);
  }
  /*
   * Project-authored abilities (see ABILITY_ADDITIONS). Added after the upstream
   * sweep for the same reason ITEM_ADDITIONS is: an id collision then means an
   * upstream ability is being overwritten deliberately rather than silently
   * dropped. The loop above skips these entirely — `dex.abilities.get` does not
   * know them, so `a?.exists` is false.
   */
  for (const [id, ability] of Object.entries(ABILITY_ADDITIONS)) {
    if (!usedAbilities.has(id)) continue;   // only package what something holds
    abilities[id] = Object.assign({}, ability);
  }

  /* ---------------- Items ---------------- */

  const items = {};
  for (const item of dex.items.all()) {
    if (!item.exists) continue;
    if (item.isNonstandard === 'CAP' || item.isNonstandard === 'Custom') continue;
    if (item.isPokeball && item.id !== 'pokeball' && item.id !== 'greatball' && item.id !== 'ultraball' && item.id !== 'masterball') continue;
    // Unlike species, an item without artwork is still packaged: item data is
    // battle data, and the UI falls back to a lettered chip. Only Pokémon are
    // gated on having sprites.
    const sprite = itemSprite(item);
    if (!sprite) report.unmatchedItems.push(item.name);
    items[item.id] = Object.assign({
      id: item.id, name: item.name, num: item.num ?? 0, gen: item.gen || 1,
      sprite,
      shortDesc: item.shortDesc || item.desc || '',
      desc: item.desc || item.shortDesc || '',
      isBerry: !!item.isBerry,
      isChoice: !!item.isChoice,
      isGem: !!item.isGem,
      isPokeball: !!item.isPokeball,
      megaStone: item.megaStone || null,
      megaEvolves: item.megaEvolves || null,
      itemUser: item.itemUser || null,
      naturalGift: item.naturalGift || null,
      fling: item.fling || null,
      zMove: item.zMove ? true : false,
      onPlate: item.onPlate || null,
      onMemory: item.onMemory || null,
      onDrive: item.onDrive || null,
      boostType: item.onBasePower && item.type ? item.type : null,
      isNonstandard: item.isNonstandard || null,
    }, ITEM_OVERRIDES[item.id] || {});
  }
  // Project-authored items (see ITEM_ADDITIONS). Added after the upstream sweep
  // so an id collision would be an upstream item being overwritten deliberately
  // rather than silently ignored.
  for (const [id, item] of Object.entries(ITEM_ADDITIONS)) items[id] = Object.assign({}, item);

  /* ---------------- Natures ---------------- */

  const natures = {};
  for (const n of dex.natures.all()) {
    if (!n.exists) continue;
    natures[n.id] = {id: n.id, name: n.name, plus: n.plus || null, minus: n.minus || null};
  }

  /* ---------------- Type chart ---------------- */

  const typeNames = [...gen.types].filter(t => t.exists && !t.isNonstandard).map(t => t.name).filter(n => n !== 'Stellar').sort();
  const typeChart = {};
  for (const attack of typeNames) {
    typeChart[attack] = {};
    for (const defend of typeNames) {
      const code = gen.types.get(defend).damageTaken[attack];
      typeChart[attack][defend] = code === 1 ? 2 : code === 2 ? 0.5 : code === 3 ? 0 : 1;
    }
  }

  /* ---------------- Report the unused half of the asset library ---------------- */

  for (const [key, file] of frontSprites) {
    if (!usedFrontFiles.has(file)) report.unusedFrontSprites.push(key);
  }
  for (const [key, file] of backSprites) {
    if (!usedBackFiles.has(file)) report.unusedBackSprites.push(key);
  }
  report.enabled = pokemon.length;

  /* ---------------- Write ---------------- */

  const data = {
    meta: {
      title: 'Pokémon RedGPT',
      id: 'pokemon-redgpt',
      battleData: 'Generation 9 / @pkmn dex snapshot',
      generatedAt: report.generatedAt,
      speciesCount: pokemon.length,
      moveCount: Object.keys(moves).length,
      abilityCount: Object.keys(abilities).length,
      itemCount: Object.keys(items).length,
    },
    statNames: STAT_NAMES,
    stats: STATS,
    pokemon, moves, abilities, items, natures, typeChart,
  };

  fs.writeFileSync(path.join(ROOT, 'data', 'pokemon.json'), JSON.stringify(pokemon));
  fs.writeFileSync(path.join(ROOT, 'data', 'moves.json'), JSON.stringify(moves));
  fs.writeFileSync(path.join(ROOT, 'data', 'abilities.json'), JSON.stringify(abilities));
  fs.writeFileSync(path.join(ROOT, 'data', 'items.json'), JSON.stringify(items));
  fs.writeFileSync(path.join(ROOT, 'data', 'natures.json'), JSON.stringify(natures));
  fs.writeFileSync(path.join(ROOT, 'data', 'type-chart.json'), JSON.stringify(typeChart, null, 2));
  fs.writeFileSync(path.join(ROOT, 'data', 'game-data.js'), `window.REDGPT_DATA=${JSON.stringify(data)};\n`);

  const skipReasons = report.skipped.reduce((acc, s) => {
    acc[s.reason] = (acc[s.reason] || 0) + 1;
    return acc;
  }, {});

  const lines = [
    '# RedGPT data generation report',
    '',
    `Generated ${report.generatedAt} by \`npm run build:data\`.`,
    '',
    '## Enabled content',
    '',
    `| Dataset | Count |`,
    `| --- | --- |`,
    `| Playable species/formes | ${pokemon.length} |`,
    `| Moves | ${Object.keys(moves).length} |`,
    `| Abilities | ${Object.keys(abilities).length} |`,
    `| Items | ${Object.keys(items).length} |`,
    `| Natures | ${Object.keys(natures).length} |`,
    `| Types | ${typeNames.length} |`,
    '',
    'Every enabled species has a validated front sprite, back sprite, six base stats,',
    'a type list, at least one ability and a resolvable learnset with a damaging move.',
    '',
    '## Species skipped',
    '',
    '| Reason | Count |',
    '| --- | --- |',
    ...Object.entries(skipReasons).sort((a, b) => b[1] - a[1]).map(([reason, count]) => `| ${reason} | ${count} |`),
    '',
    '<details><summary>Full skip list</summary>',
    '',
    ...report.skipped.map(s => `- ${s.name} — ${s.reason}`),
    '',
    '</details>',
    '',
    '## Sprite assets with no enabled species',
    '',
    `${report.unusedFrontSprites.length} front and ${report.unusedBackSprites.length} back sprites are present in the`,
    'asset library but are not referenced by any enabled species. They are usually',
    'unofficial "what-if" artwork (for example non-canonical Mega designs) or formes',
    'the Dex does not define.',
    '',
    '<details><summary>Unused front sprites</summary>',
    '',
    ...report.unusedFrontSprites.map(k => `- ${k}`),
    '',
    '</details>',
    '',
    '## Items without artwork',
    '',
    report.unmatchedItems.length
      ? `${report.unmatchedItems.length} of ${Object.keys(items).length} packaged items have no sprite in the asset library ` +
        '(the library predates most Generation 6+ items). They are still packaged, because item data is battle data — ' +
        'the interface renders a lettered chip in place of the missing icon.'
      : 'Every packaged item has artwork.',
    '',
    '<details><summary>Items rendered as chips</summary>',
    '',
    ...report.unmatchedItems.map(n => `- ${n}`),
    '',
    '</details>',
    '',
    /*
     * Rendered rather than merely collected. A report field nothing reads is
     * §8's most-repeated bug shape, and this one has a job: it is the list to
     * check when upstream catches up, so the overrides can be retired instead
     * of quietly disagreeing with real data forever.
     */
    '## Project ability assignments',
    '',
    report.abilityOverrides.length
      ? `${report.abilityOverrides.length} species have their ability list set by ` +
        '`SPECIES_ABILITY_OVERRIDES` rather than taken from upstream. Every row is a ' +
        'deliberate divergence and is **meant to be retired** — when upstream ships the ' +
        'same values, delete the row and rebuild.'
      : 'No species ability list is overridden; every one comes from upstream.',
    '',
    ...report.abilityOverrides.map(n => `- ${n}`),
    '',
    ...(Object.keys(ABILITY_ADDITIONS).length
      ? ['Project-authored abilities upstream does not carry:', '',
        ...Object.keys(ABILITY_ADDITIONS).map(id => `- ${ABILITY_ADDITIONS[id].name} — ${ABILITY_ADDITIONS[id].shortDesc}`), '']
      : []),
  ];
  fs.writeFileSync(path.join(ROOT, 'docs', 'DATA_REPORT.md'), lines.join('\n'));

  console.log(`Generated ${pokemon.length} species, ${Object.keys(moves).length} moves, ` +
    `${Object.keys(abilities).length} abilities, ${Object.keys(items).length} items, ` +
    `${Object.keys(natures).length} natures, ${typeNames.length} types.`);
  console.log(`Skipped ${report.skipped.length} Dex entries. See docs/DATA_REPORT.md.`);
})();
