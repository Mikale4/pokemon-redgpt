/**
 * Loads the RedGPT engine modules into a bare Node VM context.
 *
 * UI tests use jsdom against index.html; engine tests use this, which is much
 * faster because it skips the DOM and the asset requests entirely.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');

const ENGINE_FILES = [
  'data/game-data.js',
  'src/core/rng.js',
  'src/core/dex.js',
  'src/core/pokemon.js',
  'src/core/abilities.js',
  'src/core/items.js',
  'src/core/formats.js',
  'src/core/mechanics.js',
  'src/core/ai.js',
  'src/core/battle.js',
  'src/core/validation.js',
  'src/core/teamtext.js',
  'src/core/store.js',
  'src/arena/random-teams.js',
  'src/arena/calculator.js',
  'src/campaign/content.js',
  'src/campaign/map.js',
  'src/campaign/run.js',
  'src/campaign/advisor.js',
];

let cached = null;

/** In-memory localStorage stand-in so store.js works outside the browser. */
function createLocalStorage() {
  const data = new Map();
  return {
    getItem: key => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => { data.set(key, String(value)); },
    removeItem: key => { data.delete(key); },
    clear: () => data.clear(),
    get length() { return data.size; },
    key: index => [...data.keys()][index] ?? null,
  };
}

function loadEngine({fresh = false} = {}) {
  if (cached && !fresh) return cached;
  const sandbox = {
    console,
    Math,
    Date,
    JSON,
    localStorage: createLocalStorage(),
    setTimeout,
    clearTimeout,
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  for (const file of ENGINE_FILES) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) throw new Error(`Engine file missing: ${file}`);
    vm.runInContext(fs.readFileSync(full, 'utf8'), sandbox, {filename: file});
  }
  const engine = sandbox.RedGPT;
  engine.__sandbox = sandbox;
  if (!fresh) cached = engine;
  return engine;
}

module.exports = {loadEngine, ROOT, ENGINE_FILES, createLocalStorage};
