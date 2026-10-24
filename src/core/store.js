/**
 * Persistent storage.
 *
 * Schema v3 separates the three concerns that used to share one blob:
 *
 *   profile   settings, records, unlocks — shared by both modes
 *   arena     saved teams, battle history, replays
 *   campaign  the active run, completed run history, meta progression
 *
 * Older saves (v1/v2 story saves) are migrated rather than discarded: the
 * trainer name, settings, Pokédex progress and caught Pokémon are carried into
 * the new profile and an "Imported collection" Arena team, and the obsolete
 * story flags are dropped. A rolling backup copy is kept, as in earlier
 * versions, so a corrupted write never leaves the player with nothing.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Dex = RedGPT.Dex;
  const PokemonLib = RedGPT.Pokemon;

  const SAVE_KEY = 'pokemon-redgpt-save-v3';
  const BACKUP_KEY = 'pokemon-redgpt-save-v3-backup';
  const LEGACY_KEYS = ['pokemon-redgpt-save-v1', 'pokemon-redgpt-save-v1-backup'];
  /** How many Campaign runs can be in progress at once. */
  const MAX_RUN_SLOTS = 6;
  const SCHEMA_VERSION = 4;

  const DEFAULT_SETTINGS = {
    animations: true,
    fastBattle: false,
    showDamageNumbers: true,
    confirmMoves: false,
    theme: 'dark',
    defaultFormat: 'tierou',
    defaultDifficulty: 'trainer',
    battleLogSize: 200,
    spectateSpeed: 1,
    // Species cries. Absent from a pre-existing save, so `!== false` is what
    // reads them: an old profile gets sound rather than silence.
    cries: true,
    cryVolume: 0.6,
  };

  function defaultProfile(name = 'Trainer') {
    return {
      name,
      createdAt: new Date().toISOString(),
      settings: {...DEFAULT_SETTINGS},
      records: {
        arena: {battles: 0, wins: 0, losses: 0, draws: 0, byFormat: {}, longestWinStreak: 0, currentWinStreak: 0},
        campaign: {
          runs: 0, wins: 0, losses: 0, currentWinStreak: 0, bestWinStreak: 0,
          bossesDefeated: 0, highestDifficultyCleared: null, highestAscensionCleared: -1,
          fastestWinTurns: null, longestRunNodes: 0, favouriteSpecies: {},
          // Lifetime across every run, won or lost — some unlocks are earned by
          // playing rather than by clearing.
          totalRecruited: 0, longestActsCleared: 0,
        },
        tower: {best: 0, current: 0},
      },
      unlocks: {
        starterPools: ['classic'],
        relics: [],
        events: [],
        bosses: [],
        difficulties: ['normal'],
        ascension: 0,
        cosmetics: [],
      },
    };
  }

  function defaultSave(name) {
    return {
      version: SCHEMA_VERSION,
      savedAt: null,
      profile: defaultProfile(name),
      arena: {
        teams: [],
        activeTeamId: null,
        battleHistory: [],
        replays: [],
      },
      campaign: {
        // Several runs can be in progress at once, each in its own slot.
        // `activeRunId` is the one "Continue" resumes; it is an id, not an
        // index, so deleting a slot cannot silently point at a different run.
        runs: [],
        activeRunId: null,
        history: [],
        meta: {lastSeed: null, lastDifficulty: 'normal'},
      },
    };
  }

  /* --------------------------- storage adapter --------------------------- */

  function storage() {
    try {
      if (typeof localStorage === 'undefined') return null;
      return localStorage;
    } catch (_) {
      return null;
    }
  }

  let cache = null;
  let lastError = null;

  function read(key) {
    const store = storage();
    if (!store) return null;
    try {
      const raw = store.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      lastError = error;
      return null;
    }
  }

  function write(key, value) {
    const store = storage();
    if (!store) { lastError = new Error('Browser storage is unavailable.'); return false; }
    try {
      store.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      lastError = error;
      return false;
    }
  }

  /* ------------------------------ migration ------------------------------ */

  function migrate(raw) {
    if (!raw || typeof raw !== 'object') return defaultSave();
    if (raw.version === SCHEMA_VERSION) return normalize(raw);
    if (raw.version === 1 || raw.version === 2 || raw.playerName) return migrateStorySave(raw);
    return normalize(Object.assign(defaultSave(raw.profile?.name), raw, {version: SCHEMA_VERSION}));
  }

  /**
   * v1/v2 → v3. The linear story world no longer exists, so the badge/flag/
   * location data is intentionally dropped. The trainer identity, settings,
   * Pokédex progress and the actual collection of Pokémon are preserved.
   */
  function migrateStorySave(old) {
    const save = defaultSave(old.playerName || 'Trainer');
    save.profile.settings = Object.assign({...DEFAULT_SETTINGS}, old.settings || {});
    save.profile.records.tower.best = old.towerBest || 0;
    save.profile.records.tower.current = 0;
    save.profile.migratedFrom = `v${old.version || 1}`;
    save.profile.legacy = {
      dexSeen: Object.keys(old.dexSeen || {}).length,
      dexCaught: Object.keys(old.dexCaught || {}).length,
      hallOfFame: (old.hallOfFame || []).length,
      badges: (old.badges || []).length,
      championed: !!old.flags?.champion,
    };

    const collection = [...(old.party || []), ...(old.storage || [])]
      .filter(p => p && Dex.hasSpecies(p.species))
      .map(p => {
        const moves = (p.moves || []).map(m => (typeof m === 'string' ? m : m?.id)).filter(id => Dex.hasMove(id));
        return PokemonLib.normalizeSet({
          species: p.species,
          nickname: p.nickname,
          level: p.level || 50,
          gender: p.gender,
          ability: p.ability,
          item: p.heldItem,
          nature: 'serious',
          moves,
          evs: p.evs,
          ivs: p.ivs,
        });
      });

    for (let i = 0; i < collection.length; i += 6) {
      const chunk = collection.slice(i, i + 6);
      save.arena.teams.push(createTeam({
        name: collection.length > 6 ? `Imported collection ${Math.floor(i / 6) + 1}` : 'Imported collection',
        format: 'anythinggoes',
        sets: chunk,
      }));
    }
    if (save.arena.teams.length) save.arena.activeTeamId = save.arena.teams[0].id;
    return normalize(save);
  }

  function normalize(save) {
    const base = defaultSave(save.profile?.name || 'Trainer');
    const out = {
      version: SCHEMA_VERSION,
      savedAt: save.savedAt || null,
      profile: Object.assign(base.profile, save.profile || {}),
      arena: Object.assign(base.arena, save.arena || {}),
      campaign: Object.assign(base.campaign, save.campaign || {}),
    };
    out.profile.settings = Object.assign({...DEFAULT_SETTINGS}, save.profile?.settings || {});
    out.profile.records = Object.assign(base.profile.records, save.profile?.records || {});
    out.profile.records.arena = Object.assign(defaultProfile().records.arena, out.profile.records.arena || {});
    out.profile.records.campaign = Object.assign(defaultProfile().records.campaign, out.profile.records.campaign || {});
    out.profile.unlocks = Object.assign(defaultProfile().unlocks, save.profile?.unlocks || {});
    out.arena.teams = (out.arena.teams || []).map(team => normalizeTeam(team)).filter(Boolean);
    out.arena.battleHistory = (out.arena.battleHistory || []).slice(0, 100);
    out.arena.replays = (out.arena.replays || []).slice(0, 50);
    out.campaign.history = (out.campaign.history || []).slice(0, 100);

    // Campaign run slots. Saves written before multiple slots existed carry a
    // single `activeRun`; move it into slot one rather than losing it, and keep
    // the key absent afterwards so nothing can read a stale copy.
    out.campaign.runs = (out.campaign.runs || []).filter(Boolean);
    if (save.campaign?.activeRun && !out.campaign.runs.some(r => r.id === save.campaign.activeRun.id)) {
      out.campaign.runs.unshift(save.campaign.activeRun);
      if (!out.campaign.activeRunId) out.campaign.activeRunId = save.campaign.activeRun.id;
    }
    delete out.campaign.activeRun;
    out.campaign.runs = out.campaign.runs.slice(0, MAX_RUN_SLOTS);
    if (out.campaign.activeRunId && !out.campaign.runs.some(r => r.id === out.campaign.activeRunId)) {
      out.campaign.activeRunId = out.campaign.runs[0]?.id || null;
    }

    if (out.arena.activeTeamId && !out.arena.teams.some(t => t.id === out.arena.activeTeamId)) {
      out.arena.activeTeamId = out.arena.teams[0]?.id || null;
    }
    return out;
  }

  let teamCounter = 0;
  function newId(prefix) {
    teamCounter = (teamCounter + 1) % 1e6;
    return `${prefix}-${Date.now().toString(36)}-${teamCounter.toString(36)}`;
  }

  function createTeam({name = 'New team', format = 'tierou', sets = []} = {}) {
    return {
      id: newId('team'),
      name,
      format,
      sets: sets.map(s => PokemonLib.normalizeSet(s)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  function normalizeTeam(team) {
    if (!team || typeof team !== 'object') return null;
    return {
      id: team.id || newId('team'),
      name: String(team.name || 'Team').slice(0, 40),
      format: team.format || 'tierou',
      sets: (team.sets || []).filter(s => s && Dex.hasSpecies(s.species)).map(s => PokemonLib.normalizeSet(s)).slice(0, 6),
      createdAt: team.createdAt || new Date().toISOString(),
      updatedAt: team.updatedAt || new Date().toISOString(),
    };
  }

  /* ------------------------------ public API ------------------------------ */

  function load() {
    if (cache) return cache;
    const raw = read(SAVE_KEY);
    if (raw) {
      cache = migrate(raw);
      return cache;
    }
    const backup = read(BACKUP_KEY);
    if (backup) {
      cache = migrate(backup);
      cache.profile.restoredFromBackup = true;
      return cache;
    }
    for (const key of LEGACY_KEYS) {
      const legacy = read(key);
      if (legacy) {
        cache = migrate(legacy);
        return cache;
      }
    }
    cache = defaultSave();
    return cache;
  }

  function save() {
    if (!cache) return {ok: false, error: 'Nothing to save.'};
    const previous = storage()?.getItem(SAVE_KEY);
    if (previous) write(BACKUP_KEY, JSON.parse(previous));
    cache.savedAt = new Date().toISOString();
    const ok = write(SAVE_KEY, cache);
    return ok ? {ok: true, savedAt: cache.savedAt} : {ok: false, error: lastError?.message || 'Browser storage rejected the write.'};
  }

  /** Mutate the save through a callback and persist immediately. */
  function update(mutator) {
    const data = load();
    mutator(data);
    return save();
  }

  function reset() {
    cache = defaultSave();
    return save();
  }

  function exportJSON() {
    return JSON.stringify(load(), null, 2);
  }

  function importJSON(text) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      return {ok: false, error: 'That file is not valid JSON.'};
    }
    if (!parsed || typeof parsed !== 'object') return {ok: false, error: 'That file does not contain a RedGPT save.'};
    if (!parsed.version && !parsed.playerName && !parsed.profile) {
      return {ok: false, error: 'That file does not look like a RedGPT save (no version field).'};
    }
    try {
      cache = migrate(parsed);
    } catch (error) {
      return {ok: false, error: `The save could not be migrated: ${error.message}`};
    }
    const result = save();
    return result.ok ? {ok: true, data: cache} : result;
  }

  /* ------------------------- record bookkeeping ------------------------- */

  function recordArenaBattle({formatId, won, drew, opponent, turns, replayId, teamName}) {
    return update(data => {
      const records = data.profile.records.arena;
      records.battles++;
      if (drew) records.draws++;
      else if (won) records.wins++;
      else records.losses++;
      if (won) {
        records.currentWinStreak++;
        records.longestWinStreak = Math.max(records.longestWinStreak, records.currentWinStreak);
      } else if (!drew) {
        records.currentWinStreak = 0;
      }
      const byFormat = records.byFormat[formatId] || {battles: 0, wins: 0};
      byFormat.battles++;
      if (won) byFormat.wins++;
      records.byFormat[formatId] = byFormat;

      data.arena.battleHistory.unshift({
        id: newId('battle'),
        at: new Date().toISOString(),
        format: formatId,
        opponent, turns, replayId, teamName,
        result: drew ? 'draw' : won ? 'win' : 'loss',
      });
      data.arena.battleHistory = data.arena.battleHistory.slice(0, 100);
    });
  }

  function saveReplay(replay, meta = {}) {
    const id = newId('replay');
    update(data => {
      data.arena.replays.unshift(Object.assign({
        id,
        at: new Date().toISOString(),
        format: replay.format,
        turns: replay.turns,
        winner: replay.winner,
        players: replay.sides.map(s => s.name),
        data: replay,
      }, meta));
      data.arena.replays = data.arena.replays.slice(0, 50);
    });
    return id;
  }

  function deleteReplay(id) {
    return update(data => {
      data.arena.replays = data.arena.replays.filter(r => r.id !== id);
    });
  }

  global.RedGPT.Store = {
    SAVE_KEY, BACKUP_KEY, SCHEMA_VERSION, MAX_RUN_SLOTS, DEFAULT_SETTINGS,
    load, save, update, reset, migrate, normalize,
    exportJSON, importJSON,
    createTeam, normalizeTeam, newId,
    recordArenaBattle, saveReplay, deleteReplay,
    defaultSave, defaultProfile,
    get lastError() { return lastError; },
    _setCache(value) { cache = value; },
  };
})(typeof window !== 'undefined' ? window : globalThis);
