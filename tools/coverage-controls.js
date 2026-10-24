/**
 * Controls for the 26 abilities and items implemented on 2026-08-14.
 *
 * A test nobody has watched fail proves nothing (PROJECT_CONTEXT §11). This
 * breaks each implementation on purpose, one at a time, and asserts the test
 * that is supposed to cover it goes red. A control that leaves the suite green
 * is reported `VACUOUS` and the run exits non-zero.
 *
 *     node tools/coverage-controls.js            # every control
 *     node tools/coverage-controls.js eelevate   # only matching names
 *
 * Two traps this file exists to avoid, both of which have cost time before:
 *
 * - **A scripted patch that matches nothing silently leaves the file alone**,
 *   and a control that removes nothing leaves the test passing — which reads as
 *   "the test cannot detect this bug" when it really means "the control never
 *   ran". Every entry therefore declares how many times its anchor must match,
 *   and a mismatch is reported as `SKIPPED — anchor matched Nx` rather than
 *   being counted as a pass.
 * - **Line endings are per-file** (§8), so every anchor here is a *single* line.
 *   A two-line anchor written with the wrong endings matches zero times.
 *
 * Never run `npm test` while this is running: it mutates `src/**` in place and
 * restores afterwards, so a concurrent suite would report failures of its own
 * making.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SUITES = {
  engine: path.join(ROOT, 'tests', 'engine-battle.js'),
  data: path.join(ROOT, 'tests', 'data-validation.js'),
  teams: path.join(ROOT, 'tests', 'teams.js'),
  arena: path.join(ROOT, 'tests', 'arena.js'),
  /*
   * The jsdom suite. It is the only place UI *wiring* can be controlled — an
   * engine test cannot see whether a control on the page reaches the module
   * behind it. Note it does not honour `REDGPT_TEST_FILTER`, so a control
   * naming this suite runs the whole thing (~30s) rather than one step; its
   * `FAIL <label>: <message>` lines parse the same way as the others.
   */
  smoke: path.join(ROOT, 'tests', 'ui-smoke.js'),
};
const DEFAULT_SUITE = 'engine';

const ABILITIES = 'src/core/abilities.js';
const ITEMS = 'src/core/items.js';
const BATTLE = 'src/core/battle.js';
const AI = 'src/core/ai.js';
const MECHANICS = 'src/core/mechanics.js';
const GENERATOR = 'tools/generate-data.js';

/**
 * @typedef {object} Control
 * @property {string} name     what is being broken
 * @property {string} file     repo-relative path to patch
 * @property {string} find     single-line anchor, expected exactly `count` times
 * @property {string} replace  what to put there instead
 * @property {number} [count]  required match count (default 1)
 * @property {string} expect   substring of the test label that must now FAIL
 * @property {string} [suite]  which suite holds that test — a key of `SUITES`,
 *                             default `engine`
 * @property {string} [regenerate] repo-relative path to a doc generator to run
 *                             after patching and again after restoring. For a
 *                             control whose output is a *document* rather than
 *                             `data/**` — without it the patched generator
 *                             changes nothing any suite reads.
 * @property {boolean} [rebuild] patch `tools/generate-data.js` and regenerate
 *                             `data/**` before running, then regenerate again
 *                             on the way out. Costs ~1.5s each way. Required
 *                             for anything whose fix lives in the generator,
 *                             because the suites read the *packaged* data and a
 *                             patched generator alone changes nothing.
 */
const CONTROLS = [
  {
    name: 'coverage: an item left undefined is reported as missing',
    file: ITEMS,
    find: "  normalBow('Pink Bow');",
    replace: '  void normalBow;',
    expect: 'every packaged ability and item is simulated',
  },
  {
    name: "Delta Stream: strong winds do not reach the type chart",
    file: BATTLE,
    find: "      if (STRONG_WIND_TYPES.has(type) && target.types.includes('Flying') && this.strongWindsActive()) {",
    replace: "      if (false && target.types.includes('Flying') && this.strongWindsActive()) {",
    expect: "Delta Stream's strong winds",
  },
  {
    name: 'Delta Stream: the weather wipe is removed',
    file: ABILITIES,
    find: "      battle.clearWeather({force: true, text: 'The mysterious air current blew the weather away!'});",
    replace: '      void battle;',
    expect: 'Delta Stream deletes the weather',
  },
  {
    name: 'Delta Stream: the wipe no longer forces past primal weather',
    file: ABILITIES,
    find: "      battle.clearWeather({force: true, text: 'The mysterious air current blew the weather away!'});",
    replace: "      battle.clearWeather({text: 'The mysterious air current blew the weather away!'});",
    expect: 'Delta Stream deletes the weather',
  },
  {
    name: 'Mega Sol: the personal weather is not read',
    file: BATTLE,
    find: '      const weather = this.abilityOf(pokemon)?.personalWeather || this.effectiveWeather();',
    replace: '      const weather = this.effectiveWeather();',
    expect: 'Mega Sol gives only its own holder sun',
  },
  {
    name: 'Piercing Drill: the engine stops recording a shattered protection',
    file: BATTLE,
    find: '            move.brokeProtect = true;',
    replace: '            void move;',
    expect: 'Piercing Drill breaks Protect',
  },
  {
    name: 'Piercing Drill: the quarter-damage price is removed',
    file: ABILITIES,
    find: '      return move.brokeProtect ? Math.max(1, Math.floor(damage * 0.25)) : damage;',
    replace: '      return damage;',
    expect: 'Piercing Drill breaks Protect',
  },
  {
    name: 'Poison Puppeteer: the inflicting-side hook is never dispatched',
    file: BATTLE,
    find: '        sourceAbility.onAfterInflictStatus(this, source, pokemon, status);',
    replace: '        void sourceAbility;',
    expect: 'Poison Puppeteer confuses what it poisons',
  },
  {
    name: 'Spicy Spray: narrowed back to a 30% roll',
    file: ABILITIES,
    find: "      battle.setStatus(source, 'brn', target, {text: `${battle.label(target)}'s Spicy Spray scalded ${battle.label(source)}!`});",
    replace: "      if (battle.rng.chance(0.3)) battle.setStatus(source, 'brn', target);",
    expect: 'Spicy Spray burns any attacker',
  },
  {
    name: 'Curious Medicine: the reset is removed',
    file: ABILITIES,
    find: '      foe.boosts = {atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0};',
    replace: '      void foe;',
    expect: 'Curious Medicine resets the foe',
  },
  {
    name: 'Hospitality: the heal is removed',
    file: ABILITIES,
    find: '      target.currentHP = Math.min(target.maxHP, target.currentHP + Math.max(1, Math.floor(target.maxHP / 4)));',
    replace: '      void target;',
    expect: 'Hospitality heals the most injured teammate',
  },
  {
    name: 'Hospitality: serves the least injured teammate instead of the most',
    file: ABILITIES,
    find: '        (mate.maxHP - mate.currentHP > best.maxHP - best.currentHP ? mate : best));',
    replace: '        (mate.maxHP - mate.currentHP < best.maxHP - best.currentHP ? mate : best));',
    expect: 'Hospitality heals the most injured teammate',
  },
  {
    name: 'Supersweet Syrup: the evasion drop is removed',
    file: ABILITIES,
    find: '      battle.boost(foe, {evasion: -1}, pokemon, {silentFail: true});',
    replace: '      void foe;',
    expect: 'Supersweet Syrup lowers the foe evasiveness',
  },
  {
    name: 'Teraform Zero: the Terastallization hook is never dispatched',
    file: BATTLE,
    find: "      this.runAbility('onTerastallize', pokemon);",
    replace: '      void pokemon;',
    expect: 'Teraform Zero flattens weather and terrain',
  },
  {
    name: 'Teraform Zero: no longer forces past primal weather',
    file: ABILITIES,
    find: '      const weatherGone = battle.clearWeather({force: true});',
    replace: '      const weatherGone = battle.clearWeather();',
    expect: 'Teraform Zero flattens weather and terrain',
  },
  {
    name: 'Lingering Aroma: the identity-ability guard is removed',
    file: ABILITIES,
    find: '      if (ABILITY_SPREADERS.has(current) || UNCOPYABLE.has(current)) return;',
    replace: '      if (ABILITY_SPREADERS.has(current)) return;',
    expect: 'Lingering Aroma and Mummy spread on contact',
  },
  {
    name: 'Lingering Aroma: defined with no hooks at all',
    file: ABILITIES,
    find: "  define('Lingering Aroma', abilitySpreader('Lingering Aroma'));",
    replace: "  define('Lingering Aroma', {});",
    expect: 'Lingering Aroma and Mummy spread on contact',
  },
  {
    name: 'Eelevate: loses the Ground immunity',
    file: ABILITIES,
    find: "  define('Eelevate', Object.assign({}, groundImmune, highestStatOnKO));",
    replace: "  define('Eelevate', Object.assign({}, highestStatOnKO));",
    expect: 'Eelevate is Levitate and Beast Boost',
  },
  {
    name: 'Eelevate: loses the knockout boost',
    file: ABILITIES,
    find: "  define('Eelevate', Object.assign({}, groundImmune, highestStatOnKO));",
    replace: "  define('Eelevate', Object.assign({}, groundImmune));",
    expect: 'Eelevate is Levitate and Beast Boost',
  },
  {
    name: 'Eelevate: the AI is told about Levitate only, by name',
    file: AI,
    find: "      if (guard.ungrounded && type === 'Ground' && !move.ignoreImmunity && move.id !== 'thousandarrows') return 0;",
    replace: "      if (guard.name === 'Levitate' && type === 'Ground') return 0;",
    expect: 'Eelevate is Levitate and Beast Boost',
  },
  {
    name: 'Dragonize: drifted up to the restored 1.3x',
    file: ABILITIES,
    find: "  define('Dragonize', typeChanger('Dragon', 1.2));",
    replace: "  define('Dragonize', typeChanger('Dragon', 1.3));",
    expect: 'Dragonize turns Normal moves Dragon',
  },
  {
    name: 'Fire Mane: the multiplier is removed',
    file: ABILITIES,
    find: "  define('Fire Mane', typeSpecialist('Fire', 1.5));",
    replace: "  define('Fire Mane', typeSpecialist('Fire', 1));",
    expect: 'Fire Mane multiplies Fire attacks',
  },
  {
    name: 'Berry: falls back to the quarter-HP threshold',
    file: ITEMS,
    find: "  healBerry('Berry', 0, 10, 1 / 2);",
    replace: "  healBerry('Berry', 0, 10);",
    expect: 'the Generation 2 healing Berries fire at half HP',
  },
  {
    name: 'PRZ Cure Berry: wired to the wrong status',
    file: ITEMS,
    find: "    'PRZ Cure Berry': 'par', 'Mint Berry': 'slp', 'PSN Cure Berry': 'psn',",
    replace: "    'PRZ Cure Berry': 'brn', 'Mint Berry': 'slp', 'PSN Cure Berry': 'psn',",
    expect: 'the Generation 2 status Berries cure their own status',
  },
  {
    name: 'Mystery Berry: restores Leppa Berry amounts',
    file: ITEMS,
    find: "  ppBerry('Mystery Berry', 5);      // the Generation 2 original, at 5 PP",
    replace: "  ppBerry('Mystery Berry', 10);",
    expect: 'Bitter Berry, Miracle Berry and Mystery Berry',
  },
  {
    name: 'Bitter Berry: cures every status, not only confusion',
    file: ITEMS,
    find: "  confusionBerry('Bitter Berry');",
    replace: "  cureAllBerry('Bitter Berry');",
    expect: 'Bitter Berry, Miracle Berry and Mystery Berry',
  },
  {
    name: 'Berserk Gene: the Attack boost is removed',
    file: ITEMS,
    find: '      battle.boost(pokemon, {atk: 2}, pokemon);',
    replace: '      void pokemon;',
    expect: 'Berserk Gene trades +2 Attack',
  },
  {
    name: 'Pink Bow: drifted up to the modern 1.2x',
    file: ITEMS,
    find: "      return move.type === 'Normal' ? Math.floor(power * 1.1) : power;",
    replace: "      return move.type === 'Normal' ? Math.floor(power * 1.2) : power;",
    expect: 'Pink Bow and Polkadot Bow boost Normal moves',
  },
  {
    name: 'Tera Blast: the Tera type is not read',
    file: BATTLE,
    find: "        return attacker?.terastallized ? attacker.teraType : move.type;",
    replace: '        return move.type;',
    expect: 'Tera Blast takes the Tera type',
  },
  {
    name: 'Tera Blast / Revelation Dance: the use-time category is never resolved',
    file: BATTLE,
    find: '      move.category = this.moveCategory(attacker, move);',
    replace: '      void move;',
    expect: 'Tera Blast takes the Tera type',
  },
  {
    name: 'the use-time category comparison is removed',
    file: BATTLE,
    find: "      return this.getStat(attacker, 'atk') > this.getStat(attacker, 'spa') ? 'Physical' : 'Special';",
    replace: '      return move.category;',
    expect: 'Revelation Dance follows the user',
  },
  {
    name: 'Revelation Dance is dropped from the use-time category list',
    file: BATTLE,
    find: "  const CATEGORY_BY_STAT_MOVES = new Set(['terablast', 'revelationdance']);",
    replace: "  const CATEGORY_BY_STAT_MOVES = new Set(['terablast']);",
    expect: 'Revelation Dance follows the user',
  },
  {
    name: 'the vanished-lock guard is removed (the Red Card crash returns)',
    file: BATTLE,
    find: '      if (fromLocked && !pokemon.volatiles.lockedMove) return;',
    replace: '      if (false) return;',
    expect: 'a rampage dragged off the field by a Red Card',
  },
  {
    name: 'the force-eat path is disconnected for every Berry',
    file: ITEMS,
    find: '      onForceEat: effect,',
    replace: '      onForceEat: null,',
    expect: 'every new Berry works through the force-eat path',
  },

  /* ---------------------------------------------------------------- *
   * The Ogerpon line (2026-08-16).
   *
   * The first four patch `tools/generate-data.js`, so they carry `rebuild` —
   * without it the generator is broken and the packaged data the suites read
   * is untouched, which is a control that runs and proves nothing.
   * ---------------------------------------------------------------- */
  {
    name: 'Ogerpon: the base-forme sprite alias is removed',
    file: GENERATOR,
    find: "  Ogerpon: 'OGERPON TEAL MASKED',",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'base Ogerpon is packaged',
  },
  {
    name: 'Ogerpon: the alias is applied as a BASE_SPRITE_ALIASES entry instead',
    file: GENERATOR,
    /*
     * The whole reason `BASE_FORME_SPRITE_ALIASES` is a separate table. This
     * makes the alias substitute the base half of *every* Ogerpon forme's
     * sprite key, so the three masked formes start asking for
     * `OGERPON TEAL MASKED WELLSPRING MASKED` and vanish — recovering one
     * species by dropping three. If this control ever stops failing, the two
     * tables can be merged; while it fails, they cannot.
     */
    find: '  const base = BASE_SPRITE_ALIASES[species.baseSpecies] || compactKey(species.baseSpecies);',
    replace: '  const base = BASE_FORME_SPRITE_ALIASES[species.baseSpecies] || compactKey(species.baseSpecies);',
    rebuild: true,
    suite: 'data',
    expect: 'base Ogerpon is packaged',
  },
  {
    name: 'Ogerpon: the Tera formes are no longer transform-only',
    file: GENERATOR,
    find: "  'ogerpontealtera',",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'every Ogerpon Tera forme is transform-only',
  },
  {
    name: 'Ogerpon: the Tera gate over-reaches and swallows Terapagos-Terastal',
    file: GENERATOR,
    // The opposite failure, and the reason that test carries a control clause:
    // a fix that swept every Terastal-sounding forme out of the Team Builder
    // would take an ordinary entry forme with it.
    find: "  'terapagosstellar',",
    replace: "  'terapagosstellar',\n  'terapagosterastal',",
    rebuild: true,
    suite: 'data',
    expect: 'every Ogerpon Tera forme is transform-only',
  },
  {
    name: 'Ogerpon: the Masks are dropped from the generator, so the base loses formeItems',
    file: GENERATOR,
    find: "  hearthflamemask: {Ogerpon: 'Ogerpon-Hearthflame'},",
    replace: '',
    rebuild: true,
    suite: 'data',
    // With no `formeItems` entry there is no forme to price the item against,
    // so the Mask stops being refused below OU. This is what proves the tier
    // gate is driven by the generated table rather than by a species tier.
    expect: 'an Ogerpon Mask is refused below OU',
  },
  {
    name: 'Ogerpon: the Masks are removed from Mechanics.FORME_CHANGE_ITEMS',
    file: MECHANICS,
    find: "    hearthflamemask: {Ogerpon: 'Ogerpon-Hearthflame'},",
    replace: '',
    expect: 'held transformation items change forme on entry',
  },
  {
    name: "Ogerpon: a Mask changes the forme but not the forme's ability",
    file: BATTLE,
    /*
     * `pokemon.ability = ability;` appears twice — `applyHeldFormeChange` and
     * `megaEvolve` overwrite it identically — so the bare line is ambiguous and
     * the harness reported `anchor matched 2x`, which is exactly what that
     * check is for. Anchored on the entry path's own `heldFormeFor` guard
     * instead: returning early there skips the whole forme change.
     */
    find: '      const species = this.heldFormeFor(pokemon);',
    replace: '      const species = null;',
    expect: 'each Ogerpon Mask brings its own typing and its own ability',
  },
  {
    name: 'Ogerpon: the Mask 1.2x is removed',
    file: ITEMS,
    find: '      return Dex.toID(required) === Dex.toID(name) ? Math.floor(power * 1.2) : power;',
    replace: '      return power;',
    expect: 'an Ogerpon Mask is worth 1.2x',
  },
  {
    name: 'Ogerpon: the Mask 1.2x is paid to any Ogerpon rather than to the matching forme',
    file: ITEMS,
    find: '      const required = Dex.species(source.species).requiredItem;',
    replace: "      const required = Dex.species(source.species).baseSpecies === 'Ogerpon' ? name : null;",
    // The 1.2x still lands on the right Pokémon, so the size test stays green;
    // what breaks is the *scope* test, which is the point of separating them.
    expect: 'an Ogerpon Mask pays only the forme that requires it',
  },
  {
    name: 'Protean: STAB goes back to reading baseTypes, so the ability is inert again',
    file: BATTLE,
    find: '      if (!(pokemon.types || pokemon.baseTypes).includes(moveType)) return 1;',
    replace: '      if (!original) return 1;',
    expect: 'Protean grants STAB on the type it adds',
  },
  {
    name: 'Protean: STAB is handed out unconditionally instead of by type',
    file: BATTLE,
    // The over-fix. The size test still passes — everything got bigger — and
    // the base-type control inside it is what fails, which is why that control
    // is in the same test rather than a separate one.
    find: '      if (!(pokemon.types || pokemon.baseTypes).includes(moveType)) return 1;',
    replace: '      if (false) return 1;',
    expect: 'Protean grants STAB on the type it adds',
  },
  {
    name: 'Protean: the Tera branch is switched to live typing too',
    file: BATTLE,
    // Tera replaces `types`, so reading it there makes "did it already have
    // this type" always true and every Tera 1.5x becomes 2x.
    find: '      const original = pokemon.baseTypes.includes(moveType);',
    replace: '      const original = (pokemon.types || pokemon.baseTypes).includes(moveType);',
    expect: 'STAB reads live typing without breaking Terastallization',
  },
  {
    name: 'Forme abilities: the validator stops refusing a banned route',
    file: 'src/core/validation.js',
    find: '      for (const forme of Formats.illegalFormeAbilities(species, format)) {',
    replace: '      for (const forme of []) {',
    suite: 'data',
    expect: 'a forme-producing ability is banned',
  },
  {
    name: 'Forme abilities: the single-ability guard is dropped, so Aegislash loses Stance Change',
    file: 'src/core/formats.js',
    // The asymmetry the whole design rests on. Without it, banning the ability
    // deletes the Pokémon instead of restricting it.
    find: '    if (own.length < 2) return [];',
    replace: '    if (own.length < 0) return [];',
    suite: 'data',
    expect: 'a forme-producing ability is banned',
  },
  {
    name: 'Forme abilities: ability formes are no longer counted in a roster',
    file: 'src/core/formats.js',
    // Ash-Greninja goes back to belonging to no tier at all.
    find: '      for (const forme of formeAbilities(species)) {',
    replace: '      for (const forme of []) {',
    suite: 'data',
    expect: 'a forme-producing ability is banned',
  },
  {
    name: 'Forme abilities: autoFix removes the Pokemon instead of swapping its ability',
    file: 'src/core/validation.js',
    find: '      const bannedFormeAbilities = new Set(Formats.illegalFormeAbilities(species, format).map(f => f.ability));',
    replace: '      const bannedFormeAbilities = new Set();',
    suite: 'data',
    expect: 'a forme-producing ability is banned',
  },
  {
    name: 'Palafin: the tier drop is reverted, so the ban sits on the Pokemon again',
    file: GENERATOR,
    find: "  palafin: 'ZU',",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'Palafin is tiered as itself',
  },
  {
    name: 'Skins: the derivation is removed, so cosmetic formes stay species',
    file: GENERATOR,
    find: '  const skinOf = findCosmeticSkins(pokemon);',
    replace: '  const skinOf = new Map();',
    rebuild: true,
    suite: 'data',
    expect: 'cosmetic skins are derived',
  },
  {
    name: 'Skins: the battle-forme guard is dropped, so real formes become skins',
    file: GENERATOR,
    /*
     * This is the guard that actually separates a skin from a battle forme.
     * Without it Cherrim-Sunshine, Mimikyu-Busted and Morpeko-Hangry qualify as
     * "mechanically identical to their base" and get swept up, deleting three
     * real forme changes.
     *
     * An earlier control here broke a *second*, redundant transformation check
     * instead and came back VACUOUS — which is how that check was found to
     * exclude nothing and removed. The harness earning its keep.
     */
    find: '      if (entry.transformOnly || entry.battleOnly || entry.requiredItem) continue;',
    replace: '      if (entry.transformOnly || entry.requiredItem) continue;',
    rebuild: true,
    suite: 'data',
    expect: 'cosmetic skins are derived',
  },
  {
    name: 'Skins: a skin is no longer excluded from the selectable roster',
    file: 'src/core/dex.js',
    find: '  const selectableSpecies = DATA.pokemon.filter(s => !s.transformOnly && !s.cosmeticOf);',
    replace: '  const selectableSpecies = DATA.pokemon.filter(s => !s.transformOnly);',
    suite: 'data',
    expect: 'cosmetic skins are derived',
  },
  {
    name: 'Skins: normalizeSet stops migrating a legacy cosmetic-forme species',
    file: 'src/core/pokemon.js',
    find: '    if (s.cosmeticOf) { skin = s.id; s = Dex.species(s.cosmeticOf); }',
    replace: '    if (false) { skin = s.id; s = Dex.species(s.cosmeticOf); }',
    suite: 'data',
    expect: 'cosmetic skins are derived',
  },
  {
    name: 'Skins: an illegal skin is kept instead of dropped',
    file: 'src/core/pokemon.js',
    find: '      skin: Dex.isSkinOf(s.id, skin) && Dex.toID(skin) !== s.id ? Dex.toID(skin) : null,',
    replace: '      skin: Dex.toID(skin) || null,',
    suite: 'data',
    expect: 'cosmetic skins are derived',
  },
  {
    name: 'Tiering: the Lucario-Mega-Z promotion is removed',
    file: GENERATOR,
    find: "  lucariomegaz: 'Ubers',",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the 2026-08-16 OU to Ubers promotions landed',
  },
  {
    name: 'Tiering: promoting Lucario-Mega-Z drags base Lucario up with it',
    file: GENERATOR,
    // The over-fix the forme/species split exists to prevent. If a promotion
    // ever starts moving the holder, base Lucario stops being RU and the
    // "base Lucario stays legal in OU" assertions break.
    find: "  lucariomegaz: 'Ubers',",
    replace: "  lucariomegaz: 'Ubers',\n  lucario: 'Ubers',",
    rebuild: true,
    suite: 'data',
    expect: 'the 2026-08-16 OU to Ubers promotions landed',
  },

  /* ---------------------------------------------------------------- *
   * Turn-order-dependent power (Fishious Rend, Bolt Beak, Payback, Analytic).
   * The engine was always right; the AI's input and the calculator's state
   * were not.
   * ---------------------------------------------------------------- */
  {
    name: 'Turn order: the AI stops projecting and reads the flag as it is now',
    file: AI,
    find: '    if (projects) defender.hasActedThisTurn = defenderWillHaveActed(battle, attacker, defender, move);',
    replace: '    void projects; void defenderWillHaveActed;',
    expect: 'the AI prices Fishious Rend and Bolt Beak',
  },
  {
    name: 'Turn order: the projection is inverted, so it doubles exactly when it should not',
    file: AI,
    // The obvious sign error. It must fail, or the test is only checking that
    // the two branches differ rather than which way round they go.
    find: '      return !movesFirst(battle, attacker, defender, move);',
    replace: '      return movesFirst(battle, attacker, defender, move);',
    expect: 'the AI prices Fishious Rend and Bolt Beak',
  },
  {
    name: 'Turn order: Analytic loses its declared flag, so the AI cannot see it depends on turn order',
    file: ABILITIES,
    find: '    readsTargetActed: true,',
    replace: '',
    expect: 'the AI prices Fishious Rend and Bolt Beak',
  },
  {
    name: 'Turn order: the calculator ignores the has-moved state again',
    file: 'src/arena/calculator.js',
    find: '    pokemon.hasActedThisTurn = !!config.hasMoved;',
    replace: '    pokemon.hasActedThisTurn = false;',
    expect: 'the damage calculator can say whether the target has already moved',
  },
  {
    name: 'Turn order: the calculator ignores the damage-taken state again',
    file: 'src/arena/calculator.js',
    find: '    pokemon.damageTakenThisTurn = dmgPercent > 0 ? Math.max(1, Math.round(pokemon.maxHP * dmgPercent / 100)) : 0;',
    replace: '    pokemon.damageTakenThisTurn = 0;',
    expect: 'the damage calculator can say whether the target has already moved',
  },
  {
    name: 'Calculator: the reverse direction is dropped, so it is one-way again',
    file: 'src/ui/calc-ui.js',
    find: "    const reverse = direction('defender', 'attacker');",
    replace: "    const reverse = {results: [], error: null};",
    suite: 'smoke',
    expect: 'the calculator shows damage in both directions',
  },
  {
    name: 'Calculator: screens go global again, so they follow the role instead of the side',
    file: 'src/ui/calc-ui.js',
    // The subtle half. With both directions live, a screen read off the
    // ATTACKING side puts Pokémon 2's Reflect in front of Pokémon 2's own hit.
    find: '        reflect: state[to].screens.reflect,',
    replace: '        reflect: state[from].screens.reflect,',
    suite: 'smoke',
    expect: 'the calculator shows damage in both directions',
  },
  {
    name: 'Turn order: the has-moved checkbox is not wired to the readout',
    file: 'src/ui/calc-ui.js',
    // UI wiring, which only the jsdom suite can see: the engine tests pass with
    // the handler deleted, because the module underneath still works.
    find: '    if (hasMoved) hasMoved.onchange = event => { config.hasMoved = event.target.checked; refreshResults(root, app); };',
    replace: '    void hasMoved;',
    suite: 'smoke',
    expect: 'the calculator turn-state controls are wired to the readout',
  },
  {
    name: 'Turn order: the damage-taken field is not wired to the readout',
    file: 'src/ui/calc-ui.js',
    find: '      config.damageTakenPercent = Math.max(0, Math.min(100, +event.target.value || 0));',
    replace: '      config.damageTakenPercent = 0;',
    suite: 'smoke',
    expect: 'the calculator turn-state controls are wired to the readout',
  },
  {
    name: 'Turn order: nothing tells Avalanche who hit it, so the counter is armed but unaimed',
    file: 'src/arena/calculator.js',
    // Avalanche and Revenge need `lastDamageSourceUid === defender.uid`, not
    // merely "I was hit". Without this line the damage-taken field looks wired
    // and leaves both moves on their base power.
    find: '    if (attacker.damageTakenThisTurn > 0) attacker.lastDamageSourceUid = defender.uid;',
    replace: '',
    expect: 'the damage calculator can say whether the target has already moved',
  },

  /* ---------------------------------------------------------------- *
   * The OU -> UU pass, 2026-08-16. Fifteen entries dropped.
   *
   * Deliberately NOT controlled by deleting `hawluchamega: 'OU'`. That was
   * measured: with the row gone, `estimateFormeTier` lands Hawlucha-Mega on OU
   * by itself, so the control would leave the suite green and report VACUOUS.
   * The pin is kept as an explicit decision rather than a model's guess, and
   * the control below sets it to the *wrong* tier instead, which proves the
   * test would catch the Mega following its base down.
   * ---------------------------------------------------------------- */
  {
    name: 'OU->UU: a dropped species stays in OU',
    file: GENERATOR,
    find: "  slowbro: 'UU',              // Mega Slowbro (already UU) and Slowking both there",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the OU → UU pass moved exactly fifteen entries',
  },
  {
    name: 'OU->UU: a dropped Mega forme stays in OU',
    file: GENERATOR,
    find: "  scolipedemega: 'UU',        // base Scolipede is UU and *better*: one Speed Boost",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the OU → UU pass moved exactly fifteen entries',
  },
  {
    name: 'OU->UU: dropping a base drags its higher-tier Mega down with it',
    file: GENERATOR,
    // The exact failure the pin exists to make impossible. If Mega Hawlucha
    // ever follows base Hawlucha to UU, the Hawluchanite silently becomes legal
    // in UU and the Absol/Absolite rule is broken.
    find: "  hawluchamega: 'OU',",
    replace: "  hawluchamega: 'UU',",
    rebuild: true,
    suite: 'data',
    expect: 'the OU → UU pass moved exactly fifteen entries',
  },
  /* ---------------------------------------------------------------- *
   * The evasion and OHKO clauses, made live (2026-08-16). The behaviour was
   * already right; the flags were the thing nothing read.
   * ---------------------------------------------------------------- */
  {
    name: 'Clauses: the ladder stops deriving its bans from its own flags',
    file: 'src/core/formats.js',
    /*
     * Breaks the link between the declaration and the ban list, which is the
     * whole fix. Deliberately NOT "put the hardcoded list back": every shipped
     * format sets both flags true, so a hardcoded list and a derived one are
     * byte-identical and that control reported VACUOUS — correctly. Removing
     * the assignment leaves the tier formats banning nothing, which the suite
     * can see.
     */
    find: '    rules.bannedMoves = clauseBannedMoves(rules);',
    replace: '',
    suite: 'arena',
    expect: 'the evasion and OHKO clauses are read, not merely declared',
  },
  {
    name: 'Clauses: the derivation ignores the flags and always bans everything',
    file: 'src/core/formats.js',
    find: '      ...(rules.ohkoClause ? OHKO_MOVES : []),',
    replace: '      ...OHKO_MOVES,',
    suite: 'arena',
    expect: 'the evasion and OHKO clauses are read, not merely declared',
  },
  {
    name: 'Clauses: recomputing drops a ban that is not a clause\'s',
    file: 'src/core/formats.js',
    // The quiet way to break this: a format that bans a move outright loses it
    // the moment the rules are rebuilt.
    find: '    const explicit = (rules.bannedMoves || []).filter(id => !clauseOwned.has(id));',
    replace: '    const explicit = [];',
    suite: 'arena',
    expect: 'the evasion and OHKO clauses are read, not merely declared',
  },
  {
    name: 'RU->UU: a promoted forme drags its base up with it',
    file: GENERATOR,
    find: "  raichumegay: 'UU',          // 60/100/55/160/80/130, **No Guard** — SpA 460, Spe 394,",
    replace: "  raichumegay: 'UU',\n  raichu: 'UU',",
    rebuild: true,
    suite: 'data',
    expect: 'the RU → UU pass moved exactly four entries',
  },
  {
    name: 'RU->UU: the estimator pins are removed, so four unreviewed Megas ride along',
    file: GENERATOR,
    /*
     * The ripple this pass had to measure. Making two unranked Megas ranked
     * feeds them into `estimateFormeTier`'s model; without the pins it promotes
     * Eelektross-Mega, Raichu-Mega-X, Scovillain-Mega and Victreebel-Mega too,
     * and UU lands on 94 instead of 90.
     */
    find: "  eelektrossmega: 'RU',",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the RU → UU pass moved exactly four entries',
  },
  {
    name: 'RU packet: a tier move leaves the RU evidence packet stale',
    file: GENERATOR,
    find: "  irontreads: 'UU',           // Excadrill: stronger, and faster still under sand",
    replace: '',
    rebuild: true,
    /*
     * Deliberately NO `regenerate`. The point of this control is that a tier
     * move leaves the committed packet **stale**; regenerating it would rebuild
     * the document to match the moved roster and the control would report
     * VACUOUS, which is exactly what happened on the first attempt.
     */
    suite: 'data',
    expect: 'the RU evidence packet lists exactly the live RU, NU and UU rosters',
  },
  {
    name: 'RU packet: the forme-tier gate stops refusing an above-RU stone',
    file: 'src/core/validation.js',
    /*
     * The legality half. If `illegalFormeItems` stops biting, an RU Gardevoir
     * could hold a Gardevoirite and become a UU forme mid-battle — the exact
     * hole section R exists to prove is closed. The test asserts through the
     * validator, so it sees this.
     */
    find: '    const bannedItems = new Set((rules.bannedItems || []).map(Dex.toID));',
    replace: '    const bannedItems = new Set();\n    if (rules) return report();',
    count: 1,
    suite: 'data',
    expect: 'the RU evidence packet lists exactly the live RU, NU and UU rosters',
  },
  {
    name: 'UU audit: a tier move leaves the audit briefing stale',
    file: GENERATOR,
    // The doc pin, in the direction that matters: the audit's three rosters are
    // generated, so any tier change must fail this until it is regenerated.
    find: "  corviknight: 'UU',          // Skarmory and Celesteela already there",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the UU format audit lists exactly the live UU, OU and RU rosters',
  },
  {
    name: 'UU audit: the profiler stops filtering moves the format bans',
    file: 'tools/lib/profiler.js',
    /*
     * Not a `rebuild` control: the doc is generated by its own tool, so this
     * one has to regenerate the document rather than `data/**`. It is asserted
     * against the committed document instead — break the filter, regenerate,
     * and Double Team reappears under Setup.
     *
     * The anchor lives in the SHARED profiler now. `uu-audit-doc.js` carried
     * its own copy until 2026-08-16, and that copy had four defects (base-stat
     * category filtering, missing `-ate` conversion, charge moves winning ties,
     * banned moves advertised) — so both briefings read one implementation.
     */
    find: '    return (Dex.legalMoveList(source) || []).filter(id => !banned.has(Dex.toID(id))).map(id => {',
    replace: '    return (Dex.legalMoveList(source) || []).map(id => {',
    regenerate: 'tools/uu-audit-doc.js',
    suite: 'data',
    expect: 'the UU format audit lists exactly the live UU, OU and RU rosters',
  },
  {
    name: 'UU audit: the profiler filters coverage on BASE stats, hiding Huge Power',
    file: 'tools/lib/profiler.js',
    /*
     * The defect that hid Mega Starmie's whole physical movepool. Reverting to
     * base stats makes a 656-Attack Huge Power holder report as special-only,
     * and Azumarill lose its physical STAB.
     */
    find: '    const bestAtk = Math.max(...abilities.map(a => Math.max(offByAbility[a].atkNeutral, offByAbility[a].atkPlus)));',
    replace: '    const bestAtk = species.baseStats.atk;',
    regenerate: 'tools/uu-audit-doc.js',
    suite: 'data',
    expect: 'the UU format audit lists exactly the live UU, OU and RU rosters',
  },
  {
    name: 'OU->UU: the UU briefing stops matching the live roster',
    file: GENERATOR,
    // The doc pin. A tiering brief its reader cannot check is worse than none,
    // so a tier that moves without the doc being regenerated must fail.
    find: "  moltres: 'UU',              // an excellent UU pivot/breaker, not an unhealthy one",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the UU briefing lists exactly the live UU roster',
  },
  {
    name: 'OU->UU: the OU briefing stops matching the live roster',
    file: GENERATOR,
    find: "  pecharunt: 'UU',            // modest offensive ceiling; **monitoring candidate**",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the OU briefing lists exactly the live OU roster',
  },
  {
    name: 'Tiering: Magearna is dropped back to OU',
    file: GENERATOR,
    find: "  metagrossmega: 'OU',",
    replace: "  magearna: 'OU',\n  metagrossmega: 'OU',",
    rebuild: true,
    suite: 'data',
    expect: 'the 2026-08-16 OU to Ubers promotions landed',
  },
  {
    name: 'Tiering: Zeraora-Mega is promoted, which the pass explicitly refused',
    file: GENERATOR,
    find: "  lucariomegaz: 'Ubers',",
    replace: "  lucariomegaz: 'Ubers',\n  zeraoramega: 'Ubers',",
    rebuild: true,
    suite: 'data',
    expect: 'the 2026-08-16 OU to Ubers promotions landed',
  },
  {
    name: 'UU briefing: a tier change is not reflected in the document',
    file: GENERATOR,
    // Move a UU entry up and the doc must stop matching the live roster.
    find: "  lucariomegaz: 'Ubers',",
    replace: "  lucariomegaz: 'Ubers',\n  tyranitar: 'OU',",
    rebuild: true,
    suite: 'data',
    expect: 'the UU briefing lists exactly the live UU roster',
  },
  {
    name: 'OU briefing: a tier change is not reflected in the document',
    file: GENERATOR,
    // Move one OU entry to Ubers and the doc must stop matching. Proves the
    // check reads the *live* roster rather than agreeing with itself.
    find: '  dragapult: \'OU\',',
    replace: '  dragapult: \'Ubers\',',
    rebuild: true,
    suite: 'data',
    expect: 'the OU briefing lists exactly the live OU roster',
  },
  {
    name: 'Ogerpon: a supported forme route is called useless again',
    file: 'src/core/validation.js',
    find: '          const producesForme = !!RedGPT.Mechanics?.heldForme?.(set);',
    replace: '          const producesForme = false;',
    suite: 'teams',
    expect: 'a forme item is not reported as useless',
  },
  {
    name: 'Ogerpon: the useless-item warning is suppressed for everything',
    file: 'src/core/validation.js',
    // The over-fix, and why that test carries four controls: deleting the
    // warning outright also "fixes" the eight forme routes.
    find: '          const producesForme = !!RedGPT.Mechanics?.heldForme?.(set);',
    replace: '          const producesForme = true;',
    suite: 'teams',
    expect: 'a forme item is not reported as useless',
  },

  /* ---------------------------------------------------------------- *
   * The NU pass (2026-08-16), and the trapping-ability audit with it.
   * ---------------------------------------------------------------- */
  {
    name: 'NU->RU: a promoted species falls back to NU',
    file: GENERATOR,
    find: "  duraludon: 'RU',            // 70/95/115/120/50/85 with **Light Metal**, which this",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the NU pass moved exactly seven entries',
  },
  {
    name: 'NU->PU: the Audino-Mega demotion is reverted, so the Audinite stays banned in PU',
    file: GENERATOR,
    /*
     * Set it back to NU rather than deleting the row. Deleting would also land
     * on NU (that is where the import puts it), so the two are equivalent here
     * — but writing the tier explicitly keeps the control readable as "the
     * forme did not drop" instead of "a row went missing".
     */
    find: "  audinomega: 'PU',",
    replace: "  audinomega: 'NU',",
    rebuild: true,
    suite: 'data',
    expect: 'the NU pass moved exactly seven entries',
  },
  {
    name: 'NU pass: base Audino follows its Mega down to ZU',
    file: GENERATOR,
    // The Absol/Absolite rule is what this pass leans on: the *forme* moved and
    // the base must not. Without that assertion the pass could silently drop a
    // perfectly fair PU Pokemon out of PU.
    find: "  audinomega: 'PU',",
    replace: "  audinomega: 'PU',\n  audino: 'ZU',",
    rebuild: true,
    suite: 'data',
    expect: 'the NU pass moved exactly seven entries',
  },
  {
    name: 'trapping: the onTrapped hook is removed from Shadow Tag',
    file: ABILITIES,
    find: "    onTrapped(battle, pokemon, foe) { return Dex.toID(foe.ability) !== 'shadowtag'; },",
    replace: '',
    expect: 'trapping is discovered by hook',
  },
  {
    name: 'trapping: Shadow Tag stops sparing another Shadow Tag user',
    file: ABILITIES,
    find: "    onTrapped(battle, pokemon, foe) { return Dex.toID(foe.ability) !== 'shadowtag'; },",
    replace: '    onTrapped(battle, pokemon, foe) { return true; },',
    expect: 'Shadow Tag traps everything except Ghost',
  },
  {
    name: 'trapping: the Ghost escape is deleted from isTrapped',
    file: BATTLE,
    /*
     * The branch ORDER matters as much as the branch. Deleting this line makes
     * Ghost trappable by all three abilities *and* makes Steel/Ghost Aegislash
     * fall to Magnet Pull, so it should redden two different tests.
     */
    find: "      if (pokemon.types.includes('Ghost')) return false;",
    replace: '',
    expect: 'Shadow Tag traps everything except Ghost',
  },
  {
    name: 'trapping: Arena Trap stops caring whether the victim is grounded',
    file: ABILITIES,
    find: '    onTrapped(battle, pokemon, foe) { return battle.isGrounded(foe); },',
    replace: '    onTrapped(battle, pokemon, foe) { return true; },',
    expect: 'Arena Trap is grounding',
  },
  {
    name: 'trapping: Magnet Pull stops checking for Steel',
    file: ABILITIES,
    find: "    onTrapped(battle, pokemon, foe) { return foe.types.includes('Steel'); },",
    replace: '    onTrapped(battle, pokemon, foe) { return true; },',
    expect: 'Arena Trap is grounding',
  },
  {
    name: 'trapping: Shed Shell stops escaping',
    file: BATTLE,
    find: '      if (this.itemOf(pokemon)?.escapesTrapping) return false;',
    replace: '',
    expect: 'Shadow Tag traps everything except Ghost',
  },
  {
    name: 'trapping: Guard Dog loses its trap immunity',
    file: ABILITIES,
    find: '    trapImmune: true,',
    replace: '',
    expect: 'trapping is discovered by hook',
  },
  {
    name: 'trapping: the switch command stops honouring the predicate',
    file: BATTLE,
    /*
     * Breaks the agreement between `isTrapped` (what the UI reads) and `choose`
     * (what actually refuses). A build where these diverge shows an enabled
     * Switch button that errors on click, which an outcome-only test misses.
     */
    find: '        canSwitch: this.canSwitch(side.index) && !this.isTrapped(active),',
    replace: '        canSwitch: this.canSwitch(side.index),',
    expect: 'the trapping predicate and the switch command never disagree',
  },
  {
    name: 'trapping: a format bans Shadow Tag, reversing the legality policy',
    file: 'src/core/formats.js',
    // The policy assertion. Trapping abilities stay legal in every competitive
    // format and balance is handled by tiering their users, so a format that
    // reaches for `bannedAbilities` must fail loudly rather than quietly ship.
    find: '    bannedItems: [],',
    replace: "    bannedItems: [],\n    bannedAbilities: ['shadowtag'],",
    expect: 'every trapping ability is legal in every competitive format',
  },
  {
    name: 'PU->NU: a promoted species falls back to PU',
    file: GENERATOR,
    find: "  aggron: 'NU',               // 70/110/180/60/60/50 with **Heavy Metal**, redesigned",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the PU and trapping passes moved exactly nine entries',
  },
  {
    name: 'trapping pass: Chandelure-Mega follows its base up (the pin is deleted)',
    file: GENERATOR,
    /*
     * Deleting IS the right control here, unlike `hawluchamega` where deletion
     * is vacuous. Measured: with the row removed and the data rebuilt,
     * `estimateFormeTier` lands Chandelure-Mega on **OU** rather than UU,
     * because its base moved to UU. So the pin genuinely stops a two-rung jump.
     */
    find: "  chandeluremega: 'UU',",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the PU and trapping passes moved exactly nine entries',
  },
  {
    name: 'trapping pass: a holder that was reviewed and left is moved anyway',
    file: GENERATOR,
    // Magnezone was deliberately retained at RU. The absence of an override is
    // a decision, so the test has to notice an override appearing.
    find: "  chandeluremega: 'UU',",
    replace: "  chandeluremega: 'UU',\n  magnezone: 'UU',",
    rebuild: true,
    suite: 'data',
    expect: 'the PU and trapping passes moved exactly nine entries',
  },
  {
    name: 'trapping pass: Meloetta-Pirouette is retiered although it was excluded',
    file: GENERATOR,
    // Explicitly out of scope until Relic Song implements a real forme route.
    find: "  meloettapirouette: 'RU',    // 100/128/90/77/77/128 Normal/Fighting, 150 BP Focus",
    replace: "  meloettapirouette: 'UU',    // 100/128/90/77/77/128 Normal/Fighting, 150 BP Focus",
    rebuild: true,
    suite: 'data',
    expect: 'the PU and trapping passes moved exactly nine entries',
  },
  {
    name: 'Relic Song: the forme change is removed from executeMove',
    file: BATTLE,
    find: '      if (success) this.applyMoveFormeChange(attacker, move);',
    replace: '',
    expect: 'Relic Song transforms Meloetta',
  },
  /*
   * There is deliberately NO control for "a Relic Song that does not resolve
   * does not transform", and the reason is measured rather than assumed.
   *
   * The obvious control removes the `if (success)` guard — and it comes back
   * VACUOUS. Every Relic Song failure path (Soundproof, Normal-into-Ghost
   * immunity, Protect) returns from `executeMove` *before* reaching the call
   * site, so with and without the guard all four cases behave identically:
   *   guard on  -> {soundproof: meloetta, ghost: meloetta, protect: meloetta, normal: pirouette}
   *   guard off -> {soundproof: meloetta, ghost: meloetta, protect: meloetta, normal: pirouette}
   *
   * So that test is pinned by the engine's early-return structure, not by the
   * guard. The guard is kept because it is the correct semantic and matches the
   * `roost` line immediately above it — but it is belt-and-braces today, and
   * writing a control that cannot fail would be worse than admitting that.
   */

  {
    name: 'Relic Song: the forme stops reverting on switch-out',
    file: BATTLE,
    find: '      if (this.isMoveFormeOf(pokemon.species, pokemon.set.species)) {',
    replace: '      if (false) {',
    expect: 'Relic Song transforms Meloetta',
  },
  {
    name: 'forme-move gate: the validator stops refusing an above-tier forme move',
    file: 'src/core/validation.js',
    /*
     * The gate itself — the third half of "ban the route, not the Pokémon".
     * Without it an NU Meloetta becomes an RU Meloetta-Pirouette on turn one,
     * which is the `maxTier` hole that blocked two tier drops before the
     * ability gate existed.
     */
    find: '        for (const forme of Formats.illegalFormeMoves(species, format)) {',
    replace: '        for (const forme of []) {',
    suite: 'engine',
    expect: 'the forme-move gate refuses Relic Song below RU',
  },
  {
    name: 'forme-move gate: it refuses the move everywhere, not just below the forme',
    file: 'src/core/formats.js',
    // The over-fix in the other direction: banning Relic Song in RU and above
    // too would make the gate a blanket ban rather than a tier gate, and the
    // test's RU/OU controls catch it.
    find: '    return formeMoves(species).filter(f => f.tier && !tierAllowed(f.tier, rules.maxTier));',
    replace: '    return formeMoves(species).filter(f => f.tier);',
    suite: 'engine',
    expect: 'the forme-move gate refuses Relic Song below RU',
  },
  {
    name: 'ZU packet: a tier move leaves the ZU evidence packet stale',
    file: GENERATOR,
    /*
     * No `regenerate`, for the reason this shape has now been got wrong twice:
     * rebuilding the document to match the moved roster leaves the suite green
     * and the control reports VACUOUS. Moving a ZU entry up must leave the
     * committed packet stale.
     */
    find: "  dugtrio: 'PU',              // Arena Trap is the narrowest of the three here — Flying,",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the ZU evidence packet lists exactly the live ZU and PU rosters',
  },
  {
    name: 'untiered: the ZU floor is removed, so 430 species go tierless again',
    file: GENERATOR,
    /*
     * The policy reversal itself. Restoring the old "discard NFE/LC" behaviour
     * must redden the zero-untiered invariant — which is the whole point of
     * stating it as an invariant rather than as a list of 473 names.
     */
    find: "      : {tier: 'ZU', source: {from: 'redgpt-zu-floor', raw: resolved ? resolved.raw : null}};",
    replace: '      : {tier: null, source: {from: null, raw: resolved ? resolved.raw : null}};',
    rebuild: true,
    suite: 'data',
    expect: 'every packaged tier is on the ladder',
  },
  {
    name: 'untiered: the floor swallows the explicit higher placements',
    file: GENERATOR,
    /*
     * The over-fix in the other direction: a floor applied BEFORE the overrides
     * would flatten all 43 exceptions to ZU and still satisfy "nothing is
     * untiered". Simulated by dropping the one RU placement.
     */
    find: "  porygon2: 'RU',             // Eviolite reaches ~459 Def / ~339 SpD, and **RedGPT",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the untiered audit placed exactly 473 species',
  },
  {
    name: 'untiered: an entry reviewed and left on the floor is promoted anyway',
    file: GENERATOR,
    // Silvally, Cosmoem, Haunter and the trapping NFEs were deliberately left in
    // ZU. The absence of an override is a decision the test must notice.
    find: "  porygon2: 'RU',",
    replace: "  porygon2: 'RU',\n  silvally: 'PU',",
    rebuild: true,
    suite: 'data',
    expect: 'the untiered audit placed exactly 473 species',
  },
  {
    name: 'untiered: the three reviewed Megas fall back to estimates',
    file: GENERATOR,
    // Un-pinning them returns them to `estimated`, which is what let
    // Delphox-Mega drift a rung in the first place.
    find: "  floettemega: 'OU',          // BST 651, 155 SpA / 148 SpD / 102 Spe with **Fairy Aura**",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the three reviewed Megas are pinned against estimator ripple',
  },
  {
    name: 'untiered: the Delphox-Mega ripple pin is removed',
    file: GENERATOR,
    /*
     * The measured ripple. Without this row the pass moves Delphox-Mega UU → OU
     * as a side effect of Floette-Mega becoming a resolved datapoint.
     */
    find: "  delphoxmega: 'UU',",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the three reviewed Megas are pinned against estimator ripple',
  },
  {
    name: 'sprite keys: a Mega named after its holder is dropped again',
    file: GENERATOR,
    /*
     * Breaks the holder-key lookup, which should drop Floette-Mega,
     * Meowstic-M-Mega and Tatsugiri-Curly-Mega back out of the dataset — and
     * with them three roster entries, so the count pins move too.
     */
    find: '  if (/(^|-)Mega(-|$)/.test(species.forme || \'\')) {',
    replace: '  if (false) {',
    rebuild: true,
    suite: 'data',
    expect: 'a Mega whose artwork is named after its holder is packaged',
  },
  {
    name: 'sprite keys: the holder lookup returns the base rather than the holder',
    file: GENERATOR,
    // The near-miss fix: keying off `baseSpecies` instead of `changesFrom` is
    // what produced FLOETTE MEGA in the first place, and it still recovers the
    // other two — so it looks like it works.
    find: '  const holderName = species.changesFrom || species.baseSpecies;',
    replace: '  const holderName = species.baseSpecies;',
    rebuild: true,
    suite: 'data',
    expect: 'a Mega whose artwork is named after its holder is packaged',
  },
  {
    name: 'ZU->PU: a promoted species falls back to ZU',
    file: GENERATOR,
    find: "  medicham: 'PU',             // **Pure Power**, so its 410 BST badly understates it:",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the ZU pass promoted exactly four species',
  },
  {
    name: 'ZU pass: Medicham-Mega is dragged down with its base',
    file: GENERATOR,
    /*
     * Medicham-Mega needs no pin because it is Nat Dex ranked — but the test
     * has to be able to SEE a Mega following its base, or that claim is
     * untested. This forces the forme down and the assertion must catch it.
     */
    find: "  medicham: 'PU',",
    replace: "  medicham: 'PU',\n  medichammega: 'PU',",
    rebuild: true,
    suite: 'data',
    expect: 'the ZU pass promoted exactly four species',
  },
  {
    name: 'ZU pass: an entry reviewed and deliberately left is moved anyway',
    file: GENERATOR,
    // Regigigas was held on the argument that Slow Start is implemented. The
    // absence of an override is a decision, so the test must notice one appearing.
    find: "  medicham: 'PU',",
    replace: "  medicham: 'PU',\n  regigigas: 'PU',",
    rebuild: true,
    suite: 'data',
    expect: 'the ZU pass promoted exactly four species',
  },
  {
    name: 'ZU packet: the Slow Start caveat is dropped, so Regigigas is understated by half',
    file: 'tools/zu-final-evidence.js',
    /*
     * `P.offence` measures with the ability live, which halves Regigigas's
     * Attack and Speed and makes the physical/special chooser build a SPECIAL
     * set for a 160-Attack Pokemon. Removing the correction must be visible.
     */
    find: 'const TEMPORARY_SELF_DEBUFF = new Set([\'slowstart\']);',
    replace: 'const TEMPORARY_SELF_DEBUFF = new Set([]);',
    regenerate: 'tools/zu-final-evidence.js',
    suite: 'data',
    expect: 'the ZU evidence packet lists exactly the live ZU and PU rosters',
  },
  {
    name: 'PU packet: a tier move leaves the PU evidence packet stale',
    file: GENERATOR,
    /*
     * Deliberately NO `regenerate`. The point is that a tier move leaves the
     * committed packet stale; regenerating would rebuild the document to match
     * the moved roster and the control would report VACUOUS — the shape that
     * has now been got wrong twice on this programme.
     */
    find: "  audinomega: 'PU',",
    replace: "  audinomega: 'NU',",
    rebuild: true,
    suite: 'data',
    expect: 'the PU evidence packet lists exactly the live PU, ZU and NU rosters',
  },
  {
    name: 'Aura Guard: the contact gate is dropped, so it halves everything',
    file: 'src/core/abilities.js',
    /*
     * The gate IS the ability. Without it Aura Guard halves Earthquake and
     * Flamethrower too, which the test's non-contact control catches — that
     * control exists precisely so a blanket halving cannot pass as a working
     * contact reduction.
     */
    find: '      return move.flags?.contact ? Math.floor(damage * 0.5) : damage;',
    replace: '      return Math.floor(damage * 0.5);',
    expect: 'Aura Guard halves contact damage only',
  },
  {
    name: 'Aura Guard: the ability is not packaged, so Lucario-Mega-Z ships a dead string',
    file: GENERATOR,
    /*
     * `ABILITY_ADDITIONS` is the only thing putting Aura Guard in the data —
     * upstream has never heard of it. Emptying the table must leave the forme
     * holding an ability name nothing can resolve.
     */
    find: "    id: 'auraguard', name: 'Aura Guard', num: -1,",
    replace: "    id: 'auraguardXX', name: 'Aura Guard XX', num: -1,",
    rebuild: true,
    expect: 'Aura Guard halves contact damage only',
  },
  {
    name: 'Z-A abilities: a forme falls back to its placeholder',
    file: GENERATOR,
    /*
     * The placeholder was an exact copy of the ordinary Mega's ability, which
     * is why the test asserts the two must DIFFER rather than just pinning the
     * new name. Removing the override restores Sand Force from upstream and
     * makes Garchomp-Mega-Z a copy of Garchomp-Mega again.
     */
    find: "  garchompmegaz: ['Levitate'],      // was Sand Force (a copy of Garchomp-Mega's).",
    replace: '',
    rebuild: true,
    expect: 'the datamined Z-A Mega abilities replaced their placeholders',
  },
  /*
   * DELIBERATELY NO CONTROL for the clear-loop in `SPECIES_ABILITY_OVERRIDES`
   * (`for (const key of Object.keys(abilities)) delete abilities[key];`).
   *
   * One was written, run, and came back **VACUOUS**. Measuring said why: all
   * three overridden formes have exactly ONE upstream ability slot —
   * `{"0": "Sand Force"}`, `{"0": "Adaptability"}`, `{"0": "Magic Bounce"}` —
   * and the override writes to `abilities['0']`, so it overwrites that single
   * key whether or not the object was cleared first. Merge and replace are
   * byte-identical for everything this project actually ships.
   *
   * The loop is kept because it is the correct semantic and guards a real
   * future case: a species with two upstream slots, or a non-Mega carrying
   * legacy `L*` abilities, would otherwise keep the entries the override is
   * meant to replace. But §10 records the rule — *a fix that only changes
   * behaviour under configurations nothing ships cannot be controlled by
   * output* — and shipping a control that cannot fail is worse than admitting
   * the gap, so this says so instead.
   */
  {
    name: 'UU->OU pass: a reviewed forme pin is deleted, so the estimator owns it again',
    file: GENERATOR,
    /*
     * **This delete-control is NOT vacuous, and the contrast with `hawluchamega`
     * is the point.** There, deleting the row left the estimator producing the
     * same OU and nothing observable changed. Here the estimator also produces
     * UU — so the TIER does not move — but `tierSource` reverts from
     * `redgpt-override` to `estimated`, and the test asserts provenance as well
     * as tier. Reviewing a forme and recording that you reviewed it are two
     * different facts, and only the second one is lost by a delete.
     */
    find: "  starmiemega: 'UU',          // BST 620, Water/Psychic, **Huge Power** — Atk **656**, the",
    replace: '',
    rebuild: true,
    suite: 'data',
    expect: 'the UU-OU pass promoted nothing and pinned seven reviewed formes',
  },
  {
    name: 'UU->OU pass: a reviewed forme pin is moved off UU',
    file: GENERATOR,
    /*
     * The other direction, because a provenance-only control cannot prove the
     * test would catch a real tier change. Moving one pin to RU must redden the
     * enforced-tier assertion AND the UU count of 91 at the same time.
     */
    find: "  staraptormega: 'UU',        // BST 585, Fighting/Flying, **Contrary** — Close Combat",
    replace: "  staraptormega: 'RU',        // BST 585, Fighting/Flying, **Contrary** — Close Combat",
    rebuild: true,
    suite: 'data',
    expect: 'the UU-OU pass promoted nothing and pinned seven reviewed formes',
  },
  {
    name: 'Meloetta: Pirouette is lowered to NU, unlocking Relic Song for an NU Meloetta',
    file: GENERATOR,
    /*
     * The reviewed verdict, controlled in the direction that actually matters.
     * The existing trapping-pass control moves Pirouette UP to UU; this moves it
     * DOWN, which is the dangerous direction — Pirouette's tier is the rung from
     * which Relic Song is legal, so putting it in NU hands an NU Meloetta a
     * turn-one transformation into a forme the format does not admit. The gate
     * test must catch it.
     */
    find: "  meloettapirouette: 'RU',    // 100/128/90/77/77/128 Normal/Fighting, 150 BP Focus",
    replace: "  meloettapirouette: 'NU',    // 100/128/90/77/77/128 Normal/Fighting, 150 BP Focus",
    rebuild: true,
    expect: 'the forme-move gate refuses Relic Song below RU while Meloetta stays legal',
  },
  {
    name: 'UU->OU packet: a tier move leaves the packet stale',
    file: GENERATOR,
    /*
     * Deliberately NO `regenerate`. The point is that a tier move leaves the
     * COMMITTED packet stale; regenerating would rewrite the document to match
     * the moved roster and the control would report VACUOUS — the shape this
     * programme has now got wrong three times.
     */
    find: "  chandelure: 'UU',           // Shadow Tag is optional here (one of four), but 145 SpA",
    replace: "  chandelure: 'NU',           // Shadow Tag is optional here (one of four), but 145 SpA",
    rebuild: true,
    suite: 'data',
    expect: 'the UU-OU + Meloetta packet lists exactly the live UU and OU rosters',
  },
  {
    name: 'UU->OU packet: the conditional annotation is dropped, so Last Resort reads free',
    file: 'tools/uu-ou-evidence.js',
    /*
     * The one thing this packet does that its five siblings do not. Last Resort
     * is 140 BP, is quoted by the shared profiler as Meloetta-Pirouette's
     * Normal STAB, and FAILS until every other move in the set has been used —
     * measured at 0 damage when led with. Removing the annotation must be
     * visible in the document, so `regenerate` is required here (the opposite
     * of the staleness control above).
     */
    find: "  lastresort: {why: 'fails until **every other move in the set** has been used', when: () => true},",
    replace: '',
    regenerate: 'tools/uu-ou-evidence.js',
    suite: 'data',
    expect: 'the UU-OU + Meloetta packet lists exactly the live UU and OU rosters',
  },
  {
    name: 'UU->OU packet: the AVOID reconciliation stops covering everything',
    file: 'tools/uu-ou-evidence.js',
    /*
     * The reconciliation is what stops the annotation table being a hand-written
     * list that silently goes stale: `RandomTeams.AVOID` is the project's own
     * declaration of which moves are traps, and section T lists every damaging
     * entry this packet quotes and fails to annotate. Dropping one row must
     * flip that sentence from "carries an annotation" to naming the gap.
     */
    find: "  assurance: 'doubles to 120 if the target has already taken damage this turn',",
    replace: '',
    regenerate: 'tools/uu-ou-evidence.js',
    suite: 'data',
    expect: 'the UU-OU + Meloetta packet lists exactly the live UU and OU rosters',
  },
  {
    name: 'trapping: pivot moves start respecting the trap',
    file: BATTLE,
    /*
     * The counterplay axis: a trapped Pokemon still escapes with U-turn, so
     * trapping blocks voluntary switching only.
     *
     * **Patch the self-switch branch, not `requestSwitchOut`.** The first
     * version of this control patched the latter and came back VACUOUS,
     * because no pivot move calls it — it belongs to Eject Button. Pivots set
     * `side.switchRequest` directly, in six separate places, which is worth
     * knowing before anyone tries to change this policy in one edit.
     */
    find: '      if ((move.selfSwitch || SELF_SWITCH_MOVES.has(move.id)) && !attacker.fainted && this.canSwitch(attacker.side)) {',
    replace: '      if ((move.selfSwitch || SELF_SWITCH_MOVES.has(move.id)) && !attacker.fainted && this.canSwitch(attacker.side) && !this.isTrapped(attacker)) {',
    expect: 'trapping ends the moment the trapper leaves',
  },
];

/**
 * Run the engine suite, narrowed to the tests whose label contains `filter`,
 * and return the labels that failed.
 *
 * Narrowing matters: unfiltered the suite takes about two minutes, almost all of
 * it in soak tests no control here touches, which put a full run near an hour.
 * `REDGPT_TEST_FILTER` **exits non-zero when it matches nothing**, so a filter
 * typo surfaces as a failure rather than as a green suite that ran no tests —
 * without that, every control would silently become vacuous.
 *
 * @returns {{failures: string[], ranNothing: boolean}}
 */
function runSuite(filter, suite = DEFAULT_SUITE) {
  const env = Object.assign({}, process.env);
  if (filter) env.REDGPT_TEST_FILTER = filter;
  else delete env.REDGPT_TEST_FILTER;
  try {
    execFileSync(process.execPath, [SUITES[suite]], {cwd: ROOT, encoding: 'utf8', stdio: 'pipe', env});
    return {failures: [], ranNothing: false};
  } catch (error) {
    const output = `${error.stdout || ''}${error.stderr || ''}`;
    return {
      failures: output.split('\n')
        .filter(line => line.trim().startsWith('FAIL'))
        .map(line => line.replace(/^\s*FAIL\s+/, '').trim()),
      ranNothing: /no test label contains/.test(output),
    };
  }
}

/**
 * Run a doc generator as it stands right now.
 *
 * The counterpart of `rebuildData` for anything whose output is a *document*
 * rather than `data/**`. A control that patches a doc generator changes nothing
 * a suite can see until the document is rewritten — the same "control runs and
 * proves nothing" shape `rebuild` exists to close.
 */
function runTool(relativePath) {
  execFileSync(process.execPath, [path.join(ROOT, relativePath)],
    {cwd: ROOT, encoding: 'utf8', stdio: 'pipe'});
}

/** Regenerate `data/**` from the generator as it stands right now. */
function rebuildData() {
  execFileSync(process.execPath, [path.join(ROOT, 'tools', 'generate-data.js')],
    {cwd: ROOT, encoding: 'utf8', stdio: 'pipe'});
}

/**
 * Are all the sources unpatched?
 *
 * `--verify` exists because killing this tool mid-control leaves one file
 * patched: the restore is in a `finally`, which a hard kill skips. It happened
 * once, to `battle.js`, and the repair is deterministic — every anchor must be
 * present at its declared count, so a missing one names the file and the
 * control, and the fix is to put the `find` text back where the `replace` text
 * is. Run this after any interrupted run, before trusting `npm test`.
 */
function verify() {
  let dirty = 0;
  for (const control of CONTROLS) {
    const text = fs.readFileSync(path.join(ROOT, control.file), 'utf8');
    const found = text.split(control.find).length - 1;
    const wanted = control.count ?? 1;
    if (found === wanted) continue;
    dirty++;
    console.error(`DIRTY  ${control.file} — "${control.name}"`);
    console.error(`       anchor found ${found}x, expected ${wanted}x`);
    console.error(`       expected: ${control.find.trim()}`);
    console.error(`       probably left as: ${control.replace.trim()}`);
  }
  if (dirty) {
    console.error(`\n${dirty} file(s) left patched by an interrupted run. Restore the lines above before running the suite.`);
    process.exit(1);
  }
  console.log(`CLEAN — all ${CONTROLS.length} anchors present at their expected counts; no file is left patched.`);

  /*
   * The source anchors are only half of it once controls can patch the
   * generator. A `rebuild` control writes `data/**` from a *broken* generator,
   * and there is a window where a hard kill leaves the generator restored and
   * the packaged data still wrong — which no anchor check can see, because
   * every source file is clean.
   *
   * Regenerating unconditionally closes it. The build is reproducible (proved:
   * byte-identical apart from its timestamp) and takes ~1.5s, so this is
   * cheaper than any check that would detect the problem.
   */
  if (CONTROLS.some(control => control.rebuild)) {
    rebuildData();
    console.log('Regenerated data/** from the restored generator, so the packaged data cannot be stale.');
  }
}

function main() {
  if (process.argv.includes('--verify')) return verify();
  const filter = process.argv.slice(2).map(term => term.toLowerCase());
  const selected = filter.length
    ? CONTROLS.filter(control => filter.some(term =>
      control.name.toLowerCase().includes(term) || control.expect.toLowerCase().includes(term)))
    : CONTROLS;

  if (!selected.length) {
    console.error('No controls matched.');
    process.exit(1);
  }

  const suitesUsed = [...new Set(selected.map(control => control.suite || DEFAULT_SUITE))];
  console.log(`Running ${selected.length} control${selected.length === 1 ? '' : 's'} against ${
    suitesUsed.map(key => path.basename(SUITES[key])).join(' and ')}.\n`);

  /*
   * Baseline: every suite a control targets must be green before anything is
   * broken, or "the test failed" below would be meaningless. Run unfiltered
   * exactly once per suite — that is the only run whose job is to prove nothing
   * else is already broken.
   */
  for (const key of suitesUsed) {
    const baseline = runSuite(null, key);
    if (baseline.failures.length) {
      console.error(`${path.basename(SUITES[key])} is not green to begin with, so no control can mean anything:`);
      for (const label of baseline.failures) console.error(`  ${label}`);
      process.exit(1);
    }
    console.log(`baseline: ${path.basename(SUITES[key])} is green (full suite).`);
  }
  console.log();

  const results = [];
  for (const control of selected) {
    const full = path.join(ROOT, control.file);
    const original = fs.readFileSync(full, 'utf8');
    const wanted = control.count ?? 1;
    const matches = original.split(control.find).length - 1;

    if (matches !== wanted) {
      results.push({control, status: 'SKIPPED', detail: `anchor matched ${matches}x, expected ${wanted}x`});
      console.log(`  SKIPPED  ${control.name} — anchor matched ${matches}x, expected ${wanted}x`);
      continue;
    }

    let result = {failures: [], ranNothing: false};
    try {
      fs.writeFileSync(full, original.split(control.find).join(control.replace));
      // A generator patch changes nothing until the data is rebuilt: every
      // suite reads `data/**`, not `tools/`.
      if (control.rebuild) rebuildData();
      if (control.regenerate) runTool(control.regenerate);
      result = runSuite(control.expect, control.suite || DEFAULT_SUITE);
    } finally {
      fs.writeFileSync(full, original);
      if (control.rebuild) rebuildData();
      if (control.regenerate) runTool(control.regenerate);
    }

    if (result.ranNothing) {
      results.push({control, status: 'SKIPPED', detail: `no test label contains "${control.expect}"`});
      console.log(`  SKIPPED  ${control.name} — no test label contains "${control.expect}"`);
      continue;
    }

    const {failures} = result;
    const caught = failures.some(label => label.includes(control.expect));
    if (caught) {
      results.push({control, status: 'ok'});
      console.log(`  ok       ${control.name}`);
    } else {
      results.push({control, status: 'VACUOUS', detail: failures.length ? `other tests failed: ${failures.join('; ')}` : 'the suite stayed green'});
      console.log(`  VACUOUS  ${control.name}`);
      console.log(`           expected a failure containing "${control.expect}"`);
      console.log(`           ${failures.length ? `saw: ${failures.join('; ')}` : 'the suite stayed green'}`);
    }
  }

  const bad = results.filter(r => r.status !== 'ok');
  console.log(`\n=== ${results.length - bad.length} of ${results.length} controls flagged their own test ===`);
  if (bad.length) {
    for (const {control, status, detail} of bad) console.log(`  ${status}  ${control.name} — ${detail}`);
    console.log('\nA control that does not fail its test means the test is not proving what it claims.');
    process.exit(1);
  }
  console.log('Every control broke its implementation and the matching test went red.');
}

module.exports = {CONTROLS};

// Exported as well as runnable, so the anchor table can be checked from
// elsewhere — `node -e` verification that no file was left patched, for
// instance, after the run is interrupted.
if (require.main === module) main();
