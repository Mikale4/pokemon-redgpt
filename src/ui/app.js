/**
 * Application shell: title screen, global navigation, routing, settings,
 * records and data import/export.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const UI = RedGPT.UI;
  const Dex = RedGPT.Dex;
  const Store = RedGPT.Store;
  const {esc, monSprite} = UI;

  const NAV = [
    {id: 'arena', label: 'Arena'},
    {id: 'campaign', label: 'Campaign'},
    {id: 'teams', label: 'Teams'},
    {id: 'calc', label: 'Calculator'},
    {id: 'dex', label: 'Pokédex'},
    {id: 'records', label: 'Records'},
    {id: 'settings', label: 'Settings'},
  ];

  const App = {
    route: 'arena',
    params: {},
    chrome: true,
    activeView: null,

    boot() {
      Store.load();
      this.applySettings();
      this.renderTitle();
      window.addEventListener('error', event => {
        console.error(event.error || event.message);
      });
    },

    applySettings() {
      const settings = Store.load().profile.settings;
      document.body.classList.toggle('no-animations', settings.animations === false);
      document.documentElement.classList.toggle('theme-light', settings.theme === 'light');
    },

    setChrome(visible) {
      this.chrome = visible;
      UI.$('.topbar').style.display = visible ? '' : 'none';
    },

    setActiveView(view) {
      if (this.activeView?.destroy && this.activeView !== view) this.activeView.destroy();
      this.activeView = view;
    },

    /* ------------------------------ title ------------------------------ */

    renderTitle() {
      const save = Store.load();
      const hasRun = RedGPT.UI.Campaign.hasActiveRun();
      const teams = save.arena.teams.length;
      const node = UI.$('#screen-title');

      node.innerHTML = `
        <div class="title-wrap">
          <div class="title-head">
            <div class="kicker">Competitive battle sandbox</div>
            <h1>POKÉMON <span>REDGPT</span></h1>
            <p class="tagline">${Dex.allSpecies.length} playable species and formes · ${Object.keys(Dex.allMoves).length} moves ·
              ${Object.keys(Dex.allAbilities).length} abilities · seeded, reproducible battles</p>
          </div>

          <div class="mode-grid">
            <div class="mode-card primary">
              <div class="mode-tag">Primary mode</div>
              <h2>ARENA</h2>
              <div class="mode-desc">Build teams. Create matchups. Battle immediately.</div>
              <ul class="mode-points">
                <li>Full competitive Team Builder with EVs, IVs, natures and Tera types</li>
                <li>Text team import and export</li>
                <li>Random Battle in one click — no team required</li>
                <li>Four AI difficulties, local versus and saved replays</li>
              </ul>
              <div class="mode-actions">
                <button id="tEnterArena" class="primary">Enter Arena</button>
                <button id="tRandom">Random Battle</button>
                <button id="tBuilder">Team Builder${teams ? ` (${teams})` : ''}</button>
              </div>
            </div>

            <div class="mode-card">
              <div class="mode-tag">Optional mode</div>
              <h2>CAMPAIGN</h2>
              <div class="mode-desc">Build a team over a procedurally generated roguelite run.</div>
              <ul class="mode-points">
                <li>Draft a starter, then route a branching three-Act map</li>
                <li>Recruit, evolve, teach moves and manage held items</li>
                <li>Elites, shops, events, relics and constructed Act bosses</li>
                <li>Shareable run seeds and persistent run records</li>
              </ul>
              <div class="mode-actions">
                <button id="tNewRun" class="${hasRun ? '' : 'primary'}">New Run</button>
                <button id="tContinueRun" ${hasRun ? 'class="primary"' : 'disabled'}>Continue Run</button>
              </div>
            </div>
          </div>

          <div class="title-secondary">
            <button id="tRecords">Records</button>
            <button id="tDex">Pokédex</button>
            <button id="tSettings">Settings</button>
            <button id="tImport">Import data</button>
            <button id="tExport">Export data</button>
          </div>

          <div class="title-foot small dim">
            Unofficial fan project. Pokémon and related names and artwork belong to their respective owners.
            <div class="tiny" style="margin-top:.3rem">Data build ${esc(Dex.meta.generatedAt?.slice(0, 10) || '—')} · save v${Store.SCHEMA_VERSION}${save.profile.migratedFrom ? ` (migrated from ${esc(save.profile.migratedFrom)})` : ''}</div>
          </div>
        </div>`;

      UI.$('#tEnterArena').onclick = () => this.enterApp('arena');
      UI.$('#tRandom').onclick = () => { this.enterApp('arena'); RedGPT.UI.Arena.startRandomBattle(this); };
      UI.$('#tBuilder').onclick = () => this.enterApp('teams');
      UI.$('#tNewRun').onclick = () => { this.enterApp('campaign'); RedGPT.UI.Campaign.openRunSetup(this); };
      UI.$('#tContinueRun').onclick = () => this.enterApp('campaign.run');
      UI.$('#tRecords').onclick = () => this.enterApp('records');
      UI.$('#tDex').onclick = () => this.enterApp('dex');
      UI.$('#tSettings').onclick = () => this.enterApp('settings');
      UI.$('#tImport').onclick = () => this.importData();
      UI.$('#tExport').onclick = () => this.exportData();

      if (save.profile.restoredFromBackup) {
        UI.toast('The main save was unreadable — the backup copy was restored.', {error: true, duration: 6000});
        delete save.profile.restoredFromBackup;
      }
    },

    enterApp(route) {
      UI.$('#screen-title').classList.remove('active');
      UI.$('#screen-main').classList.add('active');
      this.setChrome(true);
      this.go(route);
    },

    exitToTitle() {
      this.setActiveView(null);
      UI.$('#screen-main').classList.remove('active');
      UI.$('#screen-title').classList.add('active');
      this.renderTitle();
    },

    /* ------------------------------ routing ------------------------------ */

    go(route, params = {}) {
      this.route = route;
      this.params = params;
      this.setActiveView(null);
      this.renderNav();
      const view = UI.$('#view');
      view.innerHTML = '';
      view.scrollTop = 0;

      switch (route) {
        case 'arena': RedGPT.UI.Arena.renderHome(view, this); break;
        case 'arena.builder': this.openBuilder(view, params); break;
        case 'arena.history': RedGPT.UI.Arena.renderHistory(view, this); break;
        case 'arena.replays': RedGPT.UI.Arena.renderReplays(view, this); break;
        case 'arena.replay': RedGPT.UI.Arena.renderReplay(view, this, params); break;
        case 'campaign': RedGPT.UI.Campaign.renderHome(view, this); break;
        case 'campaign.run': RedGPT.UI.Campaign.renderRun(view, this); break;
        case 'teams': this.renderTeams(view); break;
        case 'calc': RedGPT.UI.Calc.render(view, this); break;
        case 'dex': RedGPT.UI.DexBrowser.render(view, {}); break;
        case 'records': this.renderRecords(view); break;
        case 'settings': this.renderSettings(view); break;
        default: RedGPT.UI.Arena.renderHome(view, this);
      }
    },

    refresh() { this.go(this.route, this.params); },

    renderNav() {
      const nav = UI.$('#topnav');
      const active = this.route.split('.')[0];
      nav.innerHTML = NAV.map(entry =>
        `<button data-nav="${entry.id}" class="${entry.id === active ? 'active' : ''}">${esc(entry.label)}</button>`).join('');
      UI.$$('[data-nav]', nav).forEach(button => {
        button.onclick = () => this.go(button.dataset.nav === 'teams' ? 'teams' : button.dataset.nav);
      });

      const save = Store.load();
      UI.$('#topstatus').innerHTML = `
        <span>${esc(save.profile.name)}</span>
        <span title="Last saved">${esc(UI.relativeTime(save.savedAt))}</span>
        <button id="navTitle" class="tiny-btn">Title</button>`;
      UI.$('#navTitle').onclick = () => this.exitToTitle();
    },

    /* ------------------------------ screens ------------------------------ */

    openBuilder(view, params) {
      const builder = new RedGPT.UI.TeamBuilder(view, {
        teamId: params.teamId,
        onExit: () => this.go('teams'),
        onSaved: () => this.renderNav(),
      });
      this.setActiveView(builder);
      builder.mount();
    },

    /**
     * The tier picker behind the Teams screen's **Format** button.
     *
     * Picking a tier lists what belongs to *that rung* — `Formats.tierRoster`,
     * not the format's cumulative pool. "Show me Ubers" means the 108 Ubers
     * entries, not the 653 Pokémon an Ubers team may legally contain.
     */
    openTierPicker() {
      const rows = RedGPT.Formats.TIER_ORDER.map(tier => {
        const roster = RedGPT.Formats.tierRoster(tier);
        const formes = roster.filter(entry => entry.kind === 'forme').length;
        return `<button class="tiny-btn" data-tier="${esc(tier)}" style="justify-content:space-between;width:100%;margin-bottom:.25rem">
          <b>${esc(tier)}</b>
          <span class="tiny dim">${roster.length} entries${formes ? ` · ${formes} forme${formes === 1 ? '' : 's'}` : ''}</span>
        </button>`;
      }).join('');
      UI.openModal(`
        <h2>Browse a tier</h2>
        <p class="small dim">Each tier lists only what Smogon ranks <em>in</em> it. Mega Evolutions are ranked
          separately from the Pokémon they belong to, so Charizard sits in ZU while both its Megas sit in OU.</p>
        ${rows}
        ${this.teamsTier ? '<button id="tierClear" style="width:100%;margin-top:.5rem">Clear</button>' : ''}`, {
        onOpen(body) {
          UI.$$('[data-tier]', body).forEach(button => {
            button.onclick = () => { UI.closeModal(true); RedGPT.App.setTeamsTier(button.dataset.tier); };
          });
          const clear = UI.$('#tierClear', body);
          if (clear) clear.onclick = () => { UI.closeModal(true); RedGPT.App.setTeamsTier(null); };
        },
      });
    },

    setTeamsTier(tier) {
      this.teamsTier = tier;
      this.refresh();
    },

    /** The chosen tier's roster, drawn as sprite thumbnails like a team's own. */
    renderTierPanel(node) {
      if (!node) return;
      if (!this.teamsTier) { node.innerHTML = ''; return; }
      const roster = RedGPT.Formats.tierRoster(this.teamsTier);
      const formes = roster.filter(entry => entry.kind === 'forme');
      node.innerHTML = `
        <div class="panel tight" style="margin-bottom:.7rem">
          <div class="row"><b>${esc(this.teamsTier)}</b>
            <span class="tiny dim">${roster.length} legal in this tier${formes.length ? ` · ${formes.length} of them Mega or alternate formes` : ''}</span>
            <span class="spacer"></span>
            <button class="tiny-btn" id="tierClose">Hide</button>
          </div>
          ${roster.length ? `<div class="row" style="gap:.3rem;flex-wrap:wrap;margin-top:.45rem">
            ${roster.map(entry => `<span class="dex-thumb" title="${esc(entry.name)}${
  entry.kind === 'forme' ? ` — ${entry.base}${entry.item ? ` holding the ${esc(RedGPT.Dex.item(entry.item)?.name || entry.item)}` : ''}` : ''
}${entry.estimated ? ' (tier estimated)' : ''}">
              ${monSprite(entry.id, {className: 'sprite-sm'})}
              <span class="tiny">${esc(entry.name)}</span>
            </span>`).join('')}
          </div>` : '<div class="small dim" style="margin-top:.4rem">Nothing is ranked in this tier.</div>'}
        </div>`;
      const close = UI.$('#tierClose', node);
      if (close) close.onclick = () => this.setTeamsTier(null);
    },

    renderTeams(view) {
      const save = Store.load();
      view.innerHTML = `
        <div class="view-pad">
          <div class="panel-head">
            <h1>Teams</h1><div class="spacer"></div>
            <button id="teamsNew" class="primary">New team</button>
            <button id="teamsFormat">Format${this.teamsTier ? `: ${esc(this.teamsTier)}` : ''}</button>
            <button id="teamsImport">Import from text</button>
            <button id="teamsExportAll">Export all</button>
          </div>
          <p class="small dim">Teams are shared by every Arena format. Validation is per-format, so a team can be legal in one and illegal in another.</p>
          <div id="teamsTierPanel"></div>
          <div id="teamsList"></div>
        </div>`;

      this.renderTierPanel(UI.$('#teamsTierPanel', view));

      const list = UI.$('#teamsList', view);
      if (!save.arena.teams.length) {
        list.innerHTML = `<div class="empty-state">No teams yet. Create one from scratch or import a team in the standard text format.</div>`;
      } else {
        list.innerHTML = `<div class="grid grid-auto">${save.arena.teams.map(team => {
          const validation = RedGPT.Validation.validateTeam(team, team.format);
          return `
            <div class="panel tight">
              <div class="row"><b>${esc(team.name)}</b><span class="spacer"></span>
                <span class="tag">${esc(RedGPT.Formats.get(team.format).short)}</span></div>
              <div class="row" style="gap:.25rem;margin:.4rem 0">
                ${team.sets.map(set => monSprite(set.species, {className: 'sprite-sm'})).join('') || '<span class="small dim">Empty</span>'}
              </div>
              <div class="row-tight">
                <span class="tag ${validation.valid ? 'good' : 'bad'}">${validation.valid ? 'Legal' : `${validation.errors.length} issue${validation.errors.length === 1 ? '' : 's'}`}</span>
                <span class="tiny dim">${UI.relativeTime(team.updatedAt)}</span>
              </div>
              <div class="row" style="margin-top:.4rem">
                <button class="tiny-btn" data-edit="${team.id}">Edit</button>
                <button class="tiny-btn" data-battle="${team.id}">Battle</button>
                <button class="tiny-btn danger" data-del="${team.id}">Delete</button>
              </div>
            </div>`;
        }).join('')}</div>`;
      }

      UI.$('#teamsNew', view).onclick = () => this.go('arena.builder', {teamId: null});
      UI.$('#teamsFormat', view).onclick = () => this.openTierPicker();
      UI.$('#teamsImport', view).onclick = () => RedGPT.UI.Arena.importTeamToNew(this);
      UI.$('#teamsExportAll', view).onclick = () => {
        const text = save.arena.teams.map(team => `=== ${team.name} (${team.format}) ===\n\n${RedGPT.TeamText.exportTeam(team)}`).join('\n');
        UI.downloadText('redgpt-all-teams.txt', text);
      };
      UI.$$('[data-edit]', view).forEach(b => b.onclick = () => this.go('arena.builder', {teamId: b.dataset.edit}));
      UI.$$('[data-battle]', view).forEach(b => b.onclick = () => RedGPT.UI.Arena.openBattleSetup(this, {mode: 'ai', teamId: b.dataset.battle}));
      UI.$$('[data-del]', view).forEach(b => b.onclick = () => {
        const team = save.arena.teams.find(t => t.id === b.dataset.del);
        UI.confirmDialog('Delete team?', `"${team.name}" will be removed permanently.`, () => {
          Store.update(data => { data.arena.teams = data.arena.teams.filter(t => t.id !== b.dataset.del); });
          this.refresh();
        }, {confirmLabel: 'Delete', danger: true});
      });
    },

    renderRecords(view) {
      const save = Store.load();
      const arena = save.profile.records.arena;
      const campaign = save.profile.records.campaign;
      const abilityCoverage = RedGPT.Abilities.coverage();
      const itemCoverage = RedGPT.Items.coverage();

      view.innerHTML = `
        <div class="view-pad">
          <h1>Records</h1>
          <div class="grid grid-2">
            <div class="panel">
              <div class="panel-head"><h2>Arena</h2></div>
              <div class="run-stat-grid">
                <div class="run-stat"><div class="rs-label">Battles</div><div class="rs-value">${arena.battles}</div></div>
                <div class="run-stat"><div class="rs-label">Wins</div><div class="rs-value">${arena.wins}</div></div>
                <div class="run-stat"><div class="rs-label">Losses</div><div class="rs-value">${arena.losses}</div></div>
                <div class="run-stat"><div class="rs-label">Draws</div><div class="rs-value">${arena.draws}</div></div>
                <div class="run-stat"><div class="rs-label">Streak</div><div class="rs-value">${arena.currentWinStreak}</div></div>
                <div class="run-stat"><div class="rs-label">Best</div><div class="rs-value">${arena.longestWinStreak}</div></div>
              </div>
              ${Object.keys(arena.byFormat).length ? `<h4 style="margin-top:.7rem">By format</h4>
                <table class="data"><tbody>${Object.entries(arena.byFormat).map(([id, record]) =>
                  `<tr><td>${esc(RedGPT.Formats.get(id).name)}</td><td class="num">${record.wins}/${record.battles}</td></tr>`).join('')}
                </tbody></table>` : ''}
            </div>

            <div class="panel">
              <div class="panel-head"><h2>Campaign</h2></div>
              <div class="run-stat-grid">
                <div class="run-stat"><div class="rs-label">Runs</div><div class="rs-value">${campaign.runs}</div></div>
                <div class="run-stat"><div class="rs-label">Cleared</div><div class="rs-value">${campaign.wins}</div></div>
                <div class="run-stat"><div class="rs-label">Lost</div><div class="rs-value">${campaign.losses}</div></div>
                <div class="run-stat"><div class="rs-label">Streak</div><div class="rs-value">${campaign.currentWinStreak}</div></div>
                <div class="run-stat"><div class="rs-label">Best streak</div><div class="rs-value">${campaign.bestWinStreak}</div></div>
                <div class="run-stat"><div class="rs-label">Bosses</div><div class="rs-value">${campaign.bossesDefeated}</div></div>
                <div class="run-stat"><div class="rs-label">Longest run</div><div class="rs-value">${campaign.longestRunNodes}</div></div>
                <div class="run-stat"><div class="rs-label">Fastest</div><div class="rs-value">${campaign.fastestWinTurns || '—'}</div></div>
              </div>
              <div class="small" style="margin-top:.5rem">
                Highest difficulty cleared: <b>${campaign.highestDifficultyCleared ? esc(RedGPT.CampaignContent.difficulty(campaign.highestDifficultyCleared).name) : '—'}</b> ·
                Highest ascension: <b>${campaign.highestAscensionCleared >= 0 ? campaign.highestAscensionCleared : '—'}</b>
              </div>
            </div>
          </div>

          <div class="panel" style="margin-top:.8rem">
            <div class="panel-head"><h2>Most used Pokémon</h2></div>
            ${Object.keys(campaign.favouriteSpecies || {}).length
              ? `<div class="row" style="gap:.5rem">${Object.entries(campaign.favouriteSpecies).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([id, count]) =>
                  `<div class="center">${monSprite(id, {className: 'sprite-sm'})}<div class="tiny">${esc(Dex.species(id).name)}</div><div class="tiny mono">×${count}</div></div>`).join('')}</div>`
              : '<div class="small dim">No Campaign Pokémon recorded yet.</div>'}
          </div>

          <div class="panel" style="margin-top:.8rem">
            <div class="panel-head"><h2>Simulation coverage</h2></div>
            <p class="small dim">RedGPT never claims a mechanic it does not run. These counts are generated from the live registries.</p>
            <table class="data">
              <thead><tr><th>System</th><th class="num">Implemented</th><th class="num">No battle effect</th><th class="num">Not simulated</th></tr></thead>
              <tbody>
                <tr><td>Abilities</td><td class="num">${abilityCoverage.implemented.length}</td><td class="num">${abilityCoverage.cosmetic.length}</td><td class="num">${abilityCoverage.missing.length}</td></tr>
                <tr><td>Held items</td><td class="num">${itemCoverage.implemented.length}</td><td class="num">${itemCoverage.cosmetic.length}</td><td class="num">${itemCoverage.missing.length}</td></tr>
                <tr><td>Moves</td><td class="num">${Object.keys(Dex.allMoves).length}</td><td class="num">0</td><td class="num">0</td></tr>
              </tbody>
            </table>
            <div class="row" style="margin-top:.5rem">
              <button id="recCoverage" class="tiny-btn">List unsimulated abilities and items</button>
            </div>
          </div>
        </div>`;

      UI.$('#recCoverage', view).onclick = () => {
        UI.openModal(`
          <h2>Not simulated</h2>
          <p class="small dim">These are flagged in the Team Builder and Pokédex. Everything else either has a battle
            implementation or legitimately has no battle effect.</p>
          <h4>Abilities (${abilityCoverage.missing.length})</h4>
          <div class="small">${abilityCoverage.missing.map(id => esc(Dex.ability(id).name)).join(', ') || 'None'}</div>
          <h4 style="margin-top:.6rem">Items (${itemCoverage.missing.length})</h4>
          <div class="small">${itemCoverage.missing.map(id => esc(Dex.item(id).name)).join(', ') || 'None'}</div>`, {wide: true});
      };
    },

    renderSettings(view) {
      const save = Store.load();
      const settings = save.profile.settings;
      view.innerHTML = `
        <div class="view-pad">
          <h1>Settings</h1>
          <div class="grid grid-2">
            <div class="panel">
              <div class="panel-head"><h2>Interface</h2></div>
              <label class="field"><span>Trainer name</span><input id="setName" type="text" value="${esc(save.profile.name)}" maxlength="20"></label>
              <label class="field"><span>Theme</span>
                <select id="setTheme">
                  <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                  <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
                </select></label>
              <label class="checkbox"><input type="checkbox" id="setAnim" ${settings.animations ? 'checked' : ''}> Interface animations</label>
              <label class="checkbox"><input type="checkbox" id="setCries" ${settings.cries !== false ? 'checked' : ''}> Pokémon cries</label>
              <label class="field${settings.cries === false ? ' is-disabled' : ''}" id="setCryVolField"><span>Cry volume</span>
                <input type="range" id="setCryVol" min="0" max="100" step="5" ${settings.cries === false ? 'disabled' : ''} value="${Math.round((typeof settings.cryVolume === 'number' ? settings.cryVolume : 0.6) * 100)}"></label>
              <label class="checkbox"><input type="checkbox" id="setDamage" ${settings.showDamageNumbers !== false ? 'checked' : ''}> Show expected damage on move buttons</label>
            </div>
            <div class="panel">
              <div class="panel-head"><h2>Defaults</h2></div>
              <label class="field"><span>Default format</span>
                <select id="setFormat">${RedGPT.Formats.list().filter(f => !f.generated).map(f =>
                  `<option value="${f.id}" ${f.id === settings.defaultFormat ? 'selected' : ''}>${esc(f.name)}</option>`).join('')}
                </select></label>
              <label class="field"><span>Default AI difficulty</span>
                <select id="setDifficulty">${Object.values(RedGPT.AI.DIFFICULTIES).map(d =>
                  `<option value="${d.id}" ${d.id === settings.defaultDifficulty ? 'selected' : ''}>${esc(d.name)}</option>`).join('')}
                </select></label>
            </div>
          </div>

          <div class="panel" style="margin-top:.8rem">
            <div class="panel-head"><h2>Data</h2></div>
            <p class="small dim">Everything is stored in this browser. Export regularly if the save matters to you.</p>
            <div class="row">
              <button id="setExport">Export save (JSON)</button>
              <button id="setImport">Import save</button>
              <button id="setReset" class="danger">Erase all data</button>
            </div>
            <div class="tiny" style="margin-top:.5rem">
              Save schema v${Store.SCHEMA_VERSION} · last saved ${esc(UI.relativeTime(save.savedAt))} ·
              ${save.arena.teams.length} teams · ${save.arena.replays.length} replays · ${save.campaign.history.length} recorded runs
            </div>
          </div>
        </div>`;

      const update = mutate => { Store.update(data => mutate(data.profile.settings, data.profile)); this.applySettings(); };
      /** Cry volume is inert while cries are off, so it is disabled and dimmed. */
      const setCryVolumeEnabled = on => {
        const slider = UI.$('#setCryVol', view);
        const field = UI.$('#setCryVolField', view);
        if (slider) slider.disabled = !on;
        if (field) field.classList.toggle('is-disabled', !on);
      };
      UI.$('#setName', view).onchange = event => update((_, profile) => { profile.name = event.target.value.slice(0, 20) || 'Trainer'; });
      UI.$('#setTheme', view).onchange = event => { update(s => { s.theme = event.target.value; }); this.refresh(); };
      UI.$('#setAnim', view).onchange = event => update(s => { s.animations = event.target.checked; });
      UI.$('#setDamage', view).onchange = event => update(s => { s.showDamageNumbers = event.target.checked; });
      UI.$('#setCries', view).onchange = event => {
        update(s => { s.cries = event.target.checked; });
        /*
         * The volume slider does nothing while cries are off — `criesEnabled`
         * gates playback — and its own confirmation cry is silenced too, so
         * left live it is a control that moves and gives no feedback at all.
         * Toggled here rather than by re-rendering, because a re-render would
         * drop focus off the checkbox the player just pressed.
         */
        setCryVolumeEnabled(event.target.checked);
        // Play one back as confirmation, so the toggle proves itself audibly.
        if (event.target.checked) UI.playCry('pikachu');
      };
      UI.$('#setCryVol', view).onchange = event => {
        update(s => { s.cryVolume = Number(event.target.value) / 100; });
        UI.playCry('pikachu');
      };
      UI.$('#setFormat', view).onchange = event => update(s => { s.defaultFormat = event.target.value; });
      UI.$('#setDifficulty', view).onchange = event => update(s => { s.defaultDifficulty = event.target.value; });
      UI.$('#setExport', view).onclick = () => this.exportData();
      UI.$('#setImport', view).onclick = () => this.importData();
      UI.$('#setReset', view).onclick = () => UI.confirmDialog('Erase all RedGPT data?',
        'Teams, replays, records and any Campaign run will be permanently deleted.',
        () => { Store.reset(); this.applySettings(); this.exitToTitle(); UI.toast('All data erased.'); },
        {confirmLabel: 'Erase everything', danger: true});
    },

    exportData() {
      UI.downloadText(`redgpt-save-${new Date().toISOString().slice(0, 10)}.json`, Store.exportJSON(), 'application/json');
      UI.toast('Save exported.');
    },

    importData() {
      UI.pickFile('application/json', text => {
        const result = Store.importJSON(text);
        if (!result.ok) { UI.toast(result.error, {error: true, duration: 5000}); return; }
        this.applySettings();
        UI.toast('Save imported.');
        if (UI.$('#screen-main').classList.contains('active')) this.refresh();
        else this.renderTitle();
      });
    },
  };

  /* ------------------------------ wiring ------------------------------ */

  UI.$('#modalClose').onclick = () => UI.closeModal();
  UI.$('#modal').onclick = event => { if (event.target === UI.$('#modal')) UI.closeModal(); };
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') UI.closeModal();
  });

  global.RedGPT.App = App;
  App.boot();
})(typeof window !== 'undefined' ? window : globalThis);
