/**
 * Arena screens: dashboard, battle setup, saved teams, history and replays.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const UI = RedGPT.UI;
  const Dex = RedGPT.Dex;
  const Store = RedGPT.Store;
  const Formats = RedGPT.Formats;
  const Validation = RedGPT.Validation;
  const PokemonLib = RedGPT.Pokemon;
  const {esc, typeChips, monSprite, itemIcon} = UI;

  const Arena = {};

  /* ------------------------------------------------------------------ *
   * Dashboard
   * ------------------------------------------------------------------ */

  Arena.renderHome = function (root, app) {
    const save = Store.load();
    const records = save.profile.records.arena;
    const teams = save.arena.teams;
    const history = save.arena.battleHistory.slice(0, 6);

    root.innerHTML = `
      <div class="view-pad">
        <div class="arena-hero">
          <div>
            <div class="panel-head"><h1>Arena</h1><div class="spacer"></div>
              <span class="tag">${Dex.allSpecies.length} species</span>
              <span class="tag">${Object.keys(Dex.allMoves).length} moves</span>
            </div>
            <p class="small dim">Build teams, set up matchups and battle immediately. Every format is a fixed RedGPT ruleset.</p>
            <div class="play-grid">
              <button class="play-card feature" data-go="random">
                <span class="play-title">Random Battle</span>
                <span class="play-desc">Balanced six-Pokémon teams generated for both sides. Fastest way to play — no team required.</span>
              </button>
              <button class="play-card" data-go="ai">
                <span class="play-title">Battle vs AI</span>
                <span class="play-desc">Bring one of your teams. Choose format and opponent difficulty.</span>
              </button>
              <button class="play-card" data-go="custom">
                <span class="play-title">Custom Battle</span>
                <span class="play-desc">Configure level, team size, clauses, restricted species and Tera.</span>
              </button>
              <button class="play-card" data-go="versus">
                <span class="play-title">Local Versus</span>
                <span class="play-desc">Two players, one device. Choices stay hidden until both sides commit.</span>
              </button>
              <button class="play-card" data-go="spectate">
                <span class="play-title">Spectate Mode</span>
                <span class="play-desc">Sit back and watch. Pick each side's team and difficulty, then let them play it out.</span>
              </button>
            </div>
          </div>
          <div class="panel tight">
            <div class="panel-head"><h3>Record</h3></div>
            <div class="run-stat-grid">
              <div class="run-stat"><div class="rs-label">Battles</div><div class="rs-value">${records.battles}</div></div>
              <div class="run-stat"><div class="rs-label">Wins</div><div class="rs-value">${records.wins}</div></div>
              <div class="run-stat"><div class="rs-label">Losses</div><div class="rs-value">${records.losses}</div></div>
              <div class="run-stat"><div class="rs-label">Streak</div><div class="rs-value">${records.currentWinStreak}</div></div>
              <div class="run-stat"><div class="rs-label">Best</div><div class="rs-value">${records.longestWinStreak}</div></div>
              <div class="run-stat"><div class="rs-label">Replays</div><div class="rs-value">${save.arena.replays.length}</div></div>
            </div>
            <div class="row" style="margin-top:.6rem">
              <button data-go="history" class="tiny-btn">Battle history</button>
              <button data-go="replays" class="tiny-btn">Replays</button>
            </div>
          </div>
        </div>

        <div class="grid grid-side">
          <div class="panel">
            <div class="panel-head"><h2>Teams</h2><div class="spacer"></div>
              <button data-go="newteam" class="primary">New team</button>
              <button data-go="importteam">Import</button>
            </div>
            <div id="teamList"></div>
          </div>
          <div class="panel tight">
            <div class="panel-head"><h3>Recent battles</h3></div>
            ${history.length ? `<table class="data"><tbody>${history.map(entry => `
              <tr><td>${esc(entry.opponent)}</td>
                  <td><span class="tag ${entry.result === 'win' ? 'good' : entry.result === 'loss' ? 'bad' : ''}">${entry.result}</span></td>
                  <td class="num tiny">${UI.relativeTime(entry.at)}</td></tr>`).join('')}</tbody></table>`
              : '<div class="small dim">No battles yet.</div>'}
          </div>
        </div>
      </div>`;

    renderTeamList(UI.$('#teamList', root), app);

    UI.$$('[data-go]', root).forEach(button => {
      button.onclick = () => {
        const target = button.dataset.go;
        if (target === 'random') Arena.startRandomBattle(app);
        else if (target === 'ai') Arena.openBattleSetup(app, {mode: 'ai'});
        else if (target === 'custom') Arena.openBattleSetup(app, {mode: 'custom'});
        else if (target === 'versus') Arena.openBattleSetup(app, {mode: 'versus'});
        else if (target === 'spectate') Arena.openBattleSetup(app, {mode: 'spectate'});
        else if (target === 'newteam') app.go('arena.builder', {teamId: null});
        else if (target === 'importteam') Arena.importTeamToNew(app);
        else if (target === 'history') app.go('arena.history');
        else if (target === 'replays') app.go('arena.replays');
      };
    });
  };

  function renderTeamList(node, app) {
    const save = Store.load();
    const teams = save.arena.teams;
    if (!teams.length) {
      node.innerHTML = `<div class="empty-state">No saved teams yet. Create one, import a team, or jump straight into a Random Battle.</div>`;
      return;
    }
    node.innerHTML = teams.map(team => {
      const validation = Validation.validateTeam(team, team.format);
      return `
        <div class="panel tight" style="margin-bottom:.4rem">
          <div class="row">
            <b>${esc(team.name)}</b>
            <span class="tag">${esc(Formats.get(team.format).short)}</span>
            <span class="tag ${validation.valid ? 'good' : 'bad'}">${validation.valid ? 'Legal' : `${validation.errors.length} issue${validation.errors.length === 1 ? '' : 's'}`}</span>
            <span class="spacer"></span>
            <button class="tiny-btn" data-edit="${team.id}">Edit</button>
            <button class="tiny-btn" data-battle="${team.id}">Battle</button>
            <button class="tiny-btn" data-copy="${team.id}">Export</button>
            <button class="tiny-btn danger" data-delete="${team.id}">Delete</button>
          </div>
          <div class="row" style="gap:.3rem;margin-top:.35rem">
            ${team.sets.length ? team.sets.map(set => `<span title="${esc(PokemonLib.displayName(set))}">${monSprite(set.species, {className: 'sprite-sm'})}</span>`).join('')
              : '<span class="small dim">Empty team</span>'}
          </div>
        </div>`;
    }).join('');

    UI.$$('[data-edit]', node).forEach(b => b.onclick = () => app.go('arena.builder', {teamId: b.dataset.edit}));
    UI.$$('[data-battle]', node).forEach(b => b.onclick = () => Arena.openBattleSetup(app, {mode: 'ai', teamId: b.dataset.battle}));
    UI.$$('[data-copy]', node).forEach(b => b.onclick = () => {
      const team = Store.load().arena.teams.find(t => t.id === b.dataset.copy);
      const text = RedGPT.TeamText.exportTeam(team);
      UI.openModal(`<h2>${esc(team.name)}</h2><textarea rows="18" readonly>${esc(text)}</textarea>
        <div class="row" style="justify-content:flex-end;margin-top:.5rem">
          <button id="cp">Copy</button><button id="dl">Download</button><button id="ok" class="primary">Close</button></div>`, {
        wide: true,
        onOpen(body) {
          body.querySelector('#cp').onclick = () => UI.copyText(text).then(ok => UI.toast(ok ? 'Copied.' : 'Clipboard unavailable.', {error: !ok}));
          body.querySelector('#dl').onclick = () => UI.downloadText(`${team.name.replace(/[^\w-]+/g, '-')}.txt`, text);
          body.querySelector('#ok').onclick = () => UI.closeModal(true);
        },
      });
    });
    UI.$$('[data-delete]', node).forEach(b => b.onclick = () => {
      const team = Store.load().arena.teams.find(t => t.id === b.dataset.delete);
      UI.confirmDialog('Delete team?', `"${team.name}" will be removed permanently.`, () => {
        Store.update(data => { data.arena.teams = data.arena.teams.filter(t => t.id !== b.dataset.delete); });
        app.refresh();
      }, {confirmLabel: 'Delete', danger: true});
    });
  }

  Arena.importTeamToNew = function (app) {
    UI.openModal(`
      <h2>Import a team</h2>
      <p class="small dim">Paste a team in the standard text format.</p>
      <textarea id="impText" rows="16"></textarea>
      <div id="impReport" class="validation"></div>
      <div class="row" style="justify-content:flex-end;margin-top:.5rem">
        <button id="impFile">Load file…</button>
        <button id="impOk" class="primary">Create team</button>
      </div>`, {
      wide: true,
      onOpen(body) {
        const textarea = body.querySelector('#impText');
        body.querySelector('#impFile').onclick = () => UI.pickFile('.txt,text/plain', text => { textarea.value = text; });
        body.querySelector('#impOk').onclick = () => {
          const result = RedGPT.TeamText.importTeam(textarea.value);
          if (!result.sets.length) {
            body.querySelector('#impReport').innerHTML = `<div class="err"><ul>${(result.errors.length ? result.errors : ['Nothing importable was found.']).map(e => `<li>${esc(e)}</li>`).join('')}</ul></div>`;
            return;
          }
          const team = Store.createTeam({name: 'Imported team', format: Store.load().profile.settings.defaultFormat, sets: result.sets.slice(0, 6)});
          Store.update(data => { data.arena.teams.push(team); data.arena.activeTeamId = team.id; });
          UI.closeModal(true);
          if (result.errors.length) UI.toast(`Imported with ${UI.plural(result.errors.length, 'warning')}.`);
          else UI.toast('Team imported.');
          app.go('arena.builder', {teamId: team.id});
        };
      },
    });
  };

  /* ------------------------------------------------------------------ *
   * Battle setup
   * ------------------------------------------------------------------ */

  Arena.openBattleSetup = function (app, {mode, teamId = null}) {
    const save = Store.load();
    const teams = save.arena.teams;
    const settings = save.profile.settings;
    const custom = {
      teamSize: 6, bringCount: 6, level: 100,
      speciesClause: true, itemClause: false, sleepClause: true,
      allowRestricted: false, allowBattleOnly: false, tera: true, teamPreview: true,
    };

    const formatOptions = Formats.list().filter(f => !f.generated);

    UI.openModal(`
      <h2>${mode === 'versus' ? 'Local Versus' : mode === 'custom' ? 'Custom Battle' : mode === 'spectate' ? 'Spectate Mode' : 'Battle vs AI'}</h2>
      <div class="grid grid-2">
        <div>
          ${mode === 'spectate' ? `
          <div class="tiny dim" style="margin-bottom:.4rem">Both sides are played by the AI. Pick what each one brings and how well it plays.</div>
          ${[['A', 'sp1'], ['B', 'sp2']].map(([label, id]) => `
            <h4>Side ${label}</h4>
            <label class="field"><span>Team</span>
              <select id="${id}Team">
                <option value="__random">Random generated team</option>
                ${teams.map(t => `<option value="${t.id}">Your team: ${esc(t.name)} (${t.sets.length})</option>`).join('')}
              </select></label>
            <label class="field"><span>Difficulty</span>
              <select id="${id}Difficulty">${Object.values(RedGPT.AI.DIFFICULTIES).map(d =>
                `<option value="${d.id}" ${d.id === settings.defaultDifficulty ? 'selected' : ''}>${esc(d.name)} — ${esc(d.description)}</option>`).join('')}
              </select></label>`).join('')}
          ` : `
          <label class="field"><span>${mode === 'versus' ? 'Player 1 team' : 'Your team'}</span>
            <select id="bsTeam">${teams.map(t => `<option value="${t.id}" ${t.id === (teamId || save.arena.activeTeamId) ? 'selected' : ''}>${esc(t.name)} (${t.sets.length})</option>`).join('')}
            </select></label>
          ${mode === 'versus' ? `<label class="field"><span>Player 2 team</span>
            <select id="bsTeam2">${teams.map(t => `<option value="${t.id}">${esc(t.name)} (${t.sets.length})</option>`).join('')}
              <option value="__random">Random generated team</option>
            </select></label>` : `
          <label class="field"><span>Opponent</span>
            <select id="bsOpponent">
              <option value="__random">Random generated team</option>
              ${teams.map(t => `<option value="${t.id}">Your team: ${esc(t.name)}</option>`).join('')}
            </select></label>
          <label class="field"><span>AI difficulty</span>
            <select id="bsDifficulty">${Object.values(RedGPT.AI.DIFFICULTIES).map(d =>
              `<option value="${d.id}" ${d.id === settings.defaultDifficulty ? 'selected' : ''}>${esc(d.name)} — ${esc(d.description)}</option>`).join('')}
            </select></label>`}`}
        </div>
        <div>
          <label class="field"><span>Format</span>
            <select id="bsFormat">${formatOptions.map(f => `<option value="${f.id}" ${f.id === settings.defaultFormat ? 'selected' : ''}>${esc(f.name)}</option>`).join('')}
            </select></label>
          <div class="tiny" id="bsFormatDesc" style="min-height:3em"></div>
          <label class="field"><span>Battle seed (optional)</span>
            <input id="bsSeed" type="text" placeholder="Leave blank for random" autocomplete="off"></label>
        </div>
      </div>
      ${mode === 'custom' ? `
      <h4>Custom rules</h4>
      <div class="grid grid-3">
        <label class="field"><span>Level</span><input id="cgLevel" type="number" min="1" max="100" value="100"></label>
        <label class="field"><span>Team size</span><input id="cgTeamSize" type="number" min="1" max="6" value="6"></label>
        <label class="field"><span>Bring to battle</span><input id="cgBring" type="number" min="1" max="6" value="6"></label>
      </div>
      <div class="row">
        <label class="checkbox"><input type="checkbox" id="cgSpecies" checked> Species Clause</label>
        <label class="checkbox"><input type="checkbox" id="cgItem"> Item Clause</label>
        <label class="checkbox"><input type="checkbox" id="cgSleep" checked> Sleep Clause</label>
        <label class="checkbox"><input type="checkbox" id="cgRestricted"> Allow restricted species</label>
        <label class="checkbox"><input type="checkbox" id="cgBattleOnly"> Allow battle-only formes</label>
        <label class="checkbox"><input type="checkbox" id="cgTera" checked> Terastallization</label>
        <label class="checkbox"><input type="checkbox" id="cgPreview" checked> Team Preview</label>
      </div>` : ''}
      <div id="bsValidation" class="validation"></div>
      <div class="row" style="justify-content:flex-end;margin-top:.7rem">
        <button id="bsCancel">Cancel</button>
        <button id="bsStart" class="primary">${mode === 'spectate' ? 'Watch battle' : 'Start battle'}</button>
      </div>`, {
      wide: true,
      onOpen(body) {
        const formatSelect = body.querySelector('#bsFormat');
        const describe = () => {
          const format = Formats.get(formatSelect.value);
          body.querySelector('#bsFormatDesc').textContent = format.description;
          validate();
        };
        const validate = () => {
          if (mode === 'spectate') {
            const format = Formats.get(formatSelect.value);
            const describeSide = id => {
              const choice = body.querySelector(`#${id}Team`).value;
              if (choice === '__random') return 'a freshly generated random team';
              const team = teams.find(t => t.id === choice);
              if (!team) return 'a random team';
              const result = Validation.validateTeam(team, format);
              return result.valid ? `"${esc(team.name)}"` : `"${esc(team.name)}" <span style="color:var(--yellow)">(illegal here — a random team will be used)</span>`;
            };
            body.querySelector('#bsValidation').innerHTML =
              `<div class="small dim">Side A brings ${describeSide('sp1')}. Side B brings ${describeSide('sp2')}.</div>`;
            return;
          }
          const teamSelect = body.querySelector('#bsTeam');
          if (!teamSelect) return;
          const team = teams.find(t => t.id === teamSelect.value);
          const node = body.querySelector('#bsValidation');
          if (!team) { node.innerHTML = '<div class="small dim">No team selected.</div>'; return; }
          const format = mode === 'custom' ? Formats.custom(readCustom(body)) : Formats.get(formatSelect.value);
          const result = Validation.validateTeam(team, format);
          node.innerHTML = result.valid
            ? `<div class="small" style="color:var(--green)">"${esc(team.name)}" is legal for ${esc(format.name)}.</div>`
            : `<div class="err"><ul>${result.errors.slice(0, 6).map(e => `<li>${esc(e.message)}</li>`).join('')}</ul></div>`;
        };
        formatSelect.onchange = describe;
        body.querySelector('#bsTeam')?.addEventListener('change', validate);
        UI.$$('input,select', body).forEach(input => input.addEventListener('change', validate));
        describe();

        body.querySelector('#bsCancel').onclick = () => UI.closeModal();
        body.querySelector('#bsStart').onclick = () => {
          if (mode === 'spectate') {
            const format = Formats.get(formatSelect.value);
            const seedInput = body.querySelector('#bsSeed').value.trim();
            const seed = seedInput ? RedGPT.RNG.parse(seedInput).value : RedGPT.RNG.random();
            const rng = new RedGPT.RNG(seed);
            // An illegal saved team silently falls back to a generated one
            // rather than blocking a battle nobody is playing.
            const pickTeam = id => {
              const choice = body.querySelector(`#${id}Team`).value;
              const team = teams.find(t => t.id === choice);
              if (team && Validation.validateTeam(team, format).valid) return {sets: team.sets, name: team.name};
              return {sets: RedGPT.RandomTeams.randomTeam(rng, {format}).sets, name: 'Random team'};
            };
            const a = pickTeam('sp1');
            const b = pickTeam('sp2');
            const diffA = body.querySelector('#sp1Difficulty').value;
            const diffB = body.querySelector('#sp2Difficulty').value;
            const label = id => esc(RedGPT.AI.difficulty(id).name);
            UI.closeModal(true);
            Arena.startBattle(app, {
              format, seed, spectate: true, controlSides: [],
              playerName: `Side A (${label(diffA)})`,
              playerTeam: a.sets, teamName: a.name,
              playerAi: {difficulty: diffA},
              opponentName: `Side B (${label(diffB)})`,
              opponentTeam: b.sets,
              ai: {difficulty: diffB},
            });
            return;
          }
          const teamSelect = body.querySelector('#bsTeam');
          const team = teams.find(t => t.id === teamSelect.value);
          if (!team) { UI.toast('Create a team first.', {error: true}); return; }
          const format = mode === 'custom' ? Formats.custom(readCustom(body)) : Formats.get(formatSelect.value);
          const validation = Validation.validateTeam(team, format);
          if (!validation.valid) {
            UI.toast('That team is not legal for the selected format.', {error: true});
            return;
          }
          const seedInput = body.querySelector('#bsSeed').value.trim();
          const seed = seedInput ? RedGPT.RNG.parse(seedInput).value : RedGPT.RNG.random();
          const rng = new RedGPT.RNG(seed);

          let opponentTeam;
          let opponentName;
          let controlSides = [0];
          let ai = null;

          if (mode === 'versus') {
            const choice = body.querySelector('#bsTeam2').value;
            if (choice === '__random') {
              opponentTeam = RedGPT.RandomTeams.randomTeam(rng, {format}).sets;
              opponentName = 'Player 2 (random)';
            } else {
              const t2 = teams.find(t => t.id === choice);
              const v2 = Validation.validateTeam(t2, format);
              if (!v2.valid) { UI.toast('Player 2\'s team is not legal for this format.', {error: true}); return; }
              opponentTeam = t2.sets;
              opponentName = `Player 2 — ${t2.name}`;
            }
            controlSides = [0, 1];
          } else {
            const choice = body.querySelector('#bsOpponent').value;
            if (choice === '__random') {
              opponentTeam = RedGPT.RandomTeams.randomTeam(rng, {format}).sets;
              opponentName = 'AI Challenger';
            } else {
              const t2 = teams.find(t => t.id === choice);
              opponentTeam = t2.sets;
              opponentName = `AI — ${t2.name}`;
            }
            ai = {difficulty: body.querySelector('#bsDifficulty').value};
          }

          UI.closeModal(true);
          Arena.startBattle(app, {
            format, seed,
            playerName: Store.load().profile.name || 'You',
            playerTeam: team.sets,
            teamName: team.name,
            opponentName, opponentTeam, ai, controlSides,
          });
        };
      },
    });

    function readCustom(body) {
      if (mode !== 'custom') return custom;
      return {
        base: UI.$('#bsFormat', body).value,
        level: +UI.$('#cgLevel', body).value,
        teamSize: +UI.$('#cgTeamSize', body).value,
        bringCount: +UI.$('#cgBring', body).value,
        speciesClause: UI.$('#cgSpecies', body).checked,
        itemClause: UI.$('#cgItem', body).checked,
        sleepClause: UI.$('#cgSleep', body).checked,
        allowRestricted: UI.$('#cgRestricted', body).checked,
        allowBattleOnly: UI.$('#cgBattleOnly', body).checked,
        tera: UI.$('#cgTera', body).checked,
        teamPreview: UI.$('#cgPreview', body).checked,
      };
    }
  };

  Arena.startRandomBattle = function (app) {
    const save = Store.load();
    const seed = RedGPT.RNG.random();
    const rng = new RedGPT.RNG(seed);
    const format = Formats.get('random');
    const playerTeam = RedGPT.RandomTeams.randomTeam(rng, {format}).sets;
    const opponentTeam = RedGPT.RandomTeams.randomTeam(rng, {format}).sets;
    Arena.startBattle(app, {
      format, seed,
      playerName: save.profile.name || 'You',
      playerTeam, teamName: 'Random team',
      opponentName: 'Random Challenger',
      opponentTeam,
      ai: {difficulty: save.profile.settings.defaultDifficulty || 'trainer'},
      controlSides: [0],
    });
  };

  /* ------------------------------------------------------------------ *
   * Battle runner
   * ------------------------------------------------------------------ */

  Arena.startBattle = function (app, config) {
    const backgrounds = ['Meadow.jpg', 'City.jpg', 'Beach.jpg', 'Forest.jpg', 'Desert.jpg', 'Sea.png', 'Ice Cave.jpg', 'Dark City.jpg', 'Elite Four.png'];
    const rng = new RedGPT.RNG(config.seed);
    const battle = new RedGPT.Battle({
      format: config.format,
      seed: config.seed,
      background: config.background || rng.pick(backgrounds),
      sides: [
        {
          name: config.playerName,
          team: config.playerTeam,
          // In spectate both sides stay 'human' so the engine does not resolve
          // the whole battle up front — BattleView asks each AI turn by turn.
          controller: 'human',
          ai: config.playerAi || null,
        },
        {
          name: config.opponentName,
          team: config.opponentTeam,
          avatar: config.opponentAvatar || null,
          controller: config.spectate || config.controlSides.includes(1) ? 'human' : 'ai',
          ai: config.ai,
        },
      ],
    });

    app.setChrome(false);
    const view = new RedGPT.UI.BattleView(UI.$('#view'), {
      battle,
      controlSides: config.controlSides,
      spectate: !!config.spectate,
      showDamage: Store.load().profile.settings.showDamageNumbers !== false,
      onFinish: ({winner}) => {
        const drew = winner == null;
        const won = winner === 0;
        const replay = battle.replayData({label: `${config.playerName} vs ${config.opponentName}`});
        let replayId = null;
        return [
          {
            label: 'Save replay', onClick: () => {
              if (replayId) { UI.toast('Replay already saved.'); return; }
              replayId = Store.saveReplay(replay, {label: replay.label});
              if (!config.spectate) {
                Store.recordArenaBattle({
                  formatId: config.format.id, won, drew, turns: battle.turn,
                  opponent: config.opponentName, replayId, teamName: config.teamName,
                });
              }
              UI.toast('Replay saved.');
            },
          },
          {
            label: 'Rematch', onClick: () => {
              app.setChrome(true);
              Arena.startBattle(app, Object.assign({}, config, {seed: RedGPT.RNG.random()}));
            },
          },
          {
            label: 'Return to Arena', primary: true, onClick: () => {
              if (!replayId && !config.spectate) {
                Store.recordArenaBattle({
                  formatId: config.format.id, won, drew, turns: battle.turn,
                  opponent: config.opponentName, replayId: null, teamName: config.teamName,
                });
              }
              app.setChrome(true);
              app.go('arena');
            },
          },
        ];
      },
    });
    app.setActiveView(view);
    battle.start();
    view.render();
    if (config.spectate) view.beginSpectate();
  };

  /* ------------------------------------------------------------------ *
   * History and replays
   * ------------------------------------------------------------------ */

  Arena.renderHistory = function (root, app) {
    const save = Store.load();
    const history = save.arena.battleHistory;
    root.innerHTML = `
      <div class="view-pad">
        <div class="panel-head"><button id="back">← Arena</button><h1 style="margin-left:.5rem">Battle history</h1></div>
        <div class="panel">
          ${history.length ? `<table class="data">
            <thead><tr><th>When</th><th>Format</th><th>Team</th><th>Opponent</th><th>Result</th><th class="num">Turns</th><th></th></tr></thead>
            <tbody>${history.map(entry => `
              <tr>
                <td class="tiny">${UI.relativeTime(entry.at)}</td>
                <td>${esc(Formats.get(entry.format).short)}</td>
                <td>${esc(entry.teamName || '—')}</td>
                <td>${esc(entry.opponent)}</td>
                <td><span class="tag ${entry.result === 'win' ? 'good' : entry.result === 'loss' ? 'bad' : ''}">${entry.result}</span></td>
                <td class="num">${entry.turns}</td>
                <td>${entry.replayId ? `<button class="tiny-btn" data-replay="${entry.replayId}">Watch</button>` : ''}</td>
              </tr>`).join('')}</tbody></table>`
            : '<div class="empty-state">No battles recorded yet.</div>'}
        </div>
      </div>`;
    UI.$('#back', root).onclick = () => app.go('arena');
    UI.$$('[data-replay]', root).forEach(b => b.onclick = () => app.go('arena.replay', {replayId: b.dataset.replay}));
  };

  Arena.renderReplays = function (root, app) {
    const save = Store.load();
    const replays = save.arena.replays;
    root.innerHTML = `
      <div class="view-pad">
        <div class="panel-head"><button id="back">← Arena</button><h1 style="margin-left:.5rem">Replays</h1>
          <div class="spacer"></div><span class="tag">${replays.length}/50 stored</span></div>
        <p class="small dim">Replays store only the seed, the teams and the command list — the battle is recomputed exactly on playback.</p>
        <div class="grid grid-auto">
          ${replays.length ? replays.map(entry => `
            <div class="panel tight">
              <div class="row"><b>${esc(entry.players[0])}</b><span class="dim">vs</span><b>${esc(entry.players[1])}</b></div>
              <div class="row-tight tiny dim" style="margin:.2rem 0">
                ${esc(Formats.get(entry.format).short)} · ${entry.turns} turns · ${UI.relativeTime(entry.at)}
              </div>
              <div class="row" style="gap:.2rem;margin-bottom:.35rem">
                ${entry.data.sides[0].team.slice(0, 6).map(set => monSprite(set.species, {className: 'sprite-sm'})).join('')}
              </div>
              <div class="row">
                <span class="tag mono">${esc(RedGPT.RNG.format(entry.data.seed))}</span>
                <span class="spacer"></span>
                <button class="tiny-btn" data-watch="${entry.id}">Watch</button>
                <button class="tiny-btn" data-export="${entry.id}">Export</button>
                <button class="tiny-btn danger" data-del="${entry.id}">Delete</button>
              </div>
            </div>`).join('')
            : '<div class="empty-state">No replays saved yet. Finish an Arena battle and choose "Save replay".</div>'}
        </div>
      </div>`;
    UI.$('#back', root).onclick = () => app.go('arena');
    UI.$$('[data-watch]', root).forEach(b => b.onclick = () => app.go('arena.replay', {replayId: b.dataset.watch}));
    UI.$$('[data-export]', root).forEach(b => b.onclick = () => {
      const entry = Store.load().arena.replays.find(r => r.id === b.dataset.export);
      UI.downloadText(`redgpt-replay-${entry.id}.json`, JSON.stringify(entry.data, null, 2), 'application/json');
    });
    UI.$$('[data-del]', root).forEach(b => b.onclick = () => {
      Store.deleteReplay(b.dataset.del);
      app.refresh();
    });
  };

  Arena.renderReplay = function (root, app, params) {
    const entry = Store.load().arena.replays.find(r => r.id === params.replayId);
    if (!entry) { app.go('arena.replays'); return; }
    RedGPT.UI.renderReplay(root, entry.data, {onExit: () => app.go('arena.replays')});
  };

  global.RedGPT.UI.Arena = Arena;
})(typeof window !== 'undefined' ? window : globalThis);
