/**
 * Campaign screens: run setup, starter draft, branching map, prompts (rewards,
 * shops, rest, events, recruitment, tutors), battles and the results page.
 *
 * The run is autosaved after every transition, so a reload resumes exactly
 * where the player left off — including a pending battle, which is rebuilt from
 * its stored configuration and seed.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const UI = RedGPT.UI;
  const Dex = RedGPT.Dex;
  const Store = RedGPT.Store;
  const Campaign = RedGPT.Campaign;
  const Content = RedGPT.CampaignContent;
  const CampaignMap = RedGPT.CampaignMap;
  const PokemonLib = RedGPT.Pokemon;
  const {esc, typeChips, monSprite, itemIcon, hpBar, statusPill, trainerSprite} = UI;

  const CampaignUI = {};
  let activeRun = null;

  /** A run still in progress, as opposed to one sitting on its end screen. */
  const inProgress = run => !!run && !['victory', 'defeat'].includes(run.phase);

  /**
   * Relic chips, with stacked copies collapsed into one `×N` chip.
   *
   * `run.relics` is a flat list that may hold the same id more than once (only a
   * relic declaring `maxStack` can repeat). Rendering it directly printed the
   * same chip two or three times, which reads as a display bug rather than as a
   * stack. Used by every relic strip so they cannot disagree.
   */
  function relicChips(ids) {
    const counts = new Map();
    for (const id of ids || []) counts.set(id, (counts.get(id) || 0) + 1);
    return [...counts].map(([id, count]) => {
      const relic = Content.relic(id);
      const name = relic?.name || id;
      const rare = relic?.rarity === 'rare' ? ' rare' : '';
      const title = relic?.description ? ` title="${esc(relic.description)}"` : '';
      return `<span class="relic-chip${rare}"${title}>${esc(name)}${count > 1 ? ` ×${count}` : ''}</span>`;
    }).join('');
  }

  /** Every saved run slot, newest activity first. */
  function runSlots(save = Store.load()) {
    return (save.campaign.runs || []).filter(Boolean);
  }

  function persist() {
    if (!activeRun) return;
    activeRun.updatedAt = new Date().toISOString();
    Store.update(data => {
      const serialised = Campaign.serialize(activeRun);
      const runs = data.campaign.runs || (data.campaign.runs = []);
      const at = runs.findIndex(r => r && r.id === serialised.id);
      if (at >= 0) runs[at] = serialised;
      else runs.unshift(serialised);
      data.campaign.runs = runs.slice(0, Store.MAX_RUN_SLOTS);
      data.campaign.activeRunId = serialised.id;
    });
  }

  /** Load a specific slot, or whichever one is currently selected. */
  function loadActive(runId = null) {
    const save = Store.load();
    const id = runId || save.campaign.activeRunId;
    const stored = runSlots(save).find(r => r.id === id) || (runId ? null : runSlots(save)[0]);
    if (!stored) return null;
    try {
      return Campaign.deserialize(stored);
    } catch (error) {
      console.error('Corrupt campaign run', error);
      return null;
    }
  }

  CampaignUI.hasActiveRun = function () {
    return runSlots().some(inProgress);
  };

  /* ------------------------------------------------------------------ *
   * Campaign hub
   * ------------------------------------------------------------------ */

  CampaignUI.renderHome = function (root, app) {
    const save = Store.load();
    const records = save.profile.records.campaign;
    const history = save.campaign.history.slice(0, 8);
    const slots = runSlots(save);
    const running = slots.some(inProgress);
    const atSlotCap = slots.length >= Store.MAX_RUN_SLOTS;

    root.innerHTML = `
      <div class="view-pad">
        <div class="panel-head"><h1>Campaign</h1><div class="spacer"></div>
          <span class="tag">Ascension ${save.profile.unlocks.ascension}</span></div>
        <p class="small dim">A run-based roguelite: draft a starter, route through a branching map, build a team, and beat three Act bosses and the Champion.</p>

        <div class="grid grid-side">
          <div>
            ${slots.length ? `
              <div class="panel">
                <div class="panel-head"><h2>Your runs</h2><div class="spacer"></div>
                  <span class="tag">${slots.length} / ${Store.MAX_RUN_SLOTS} slots</span></div>
                ${slots.map(run => {
                  const live = inProgress(run);
                  const selected = run.id === save.campaign.activeRunId;
                  return `<div class="panel tight run-slot${selected ? ' selected' : ''}" style="margin-bottom:.5rem">
                    <div class="panel-head" style="margin-bottom:.35rem">
                      <h3 style="margin:0">${esc(Content.difficulty(run.difficulty).name)}${run.ascension ? ` · A${run.ascension}` : ''}</h3>
                      <div class="spacer"></div>
                      <span class="tag mono">${esc(run.seedLabel)}</span>
                      ${run.rebirth ? `<span class="tag warn">Rebirth ${run.rebirth}</span>` : ''}
                      <span class="tag ${live ? 'good' : ''}">${live ? `Act ${run.act}/${run.setup?.acts ?? 3}` : (run.phase === 'victory' ? 'Cleared' : 'Lost')}</span>
                    </div>
                    <div class="row" style="gap:.4rem;margin-bottom:.4rem">
                      ${run.party.map(m => monSprite(m.set.species, {className: 'sprite-sm'})).join('') || '<span class="tiny dim">No party yet</span>'}
                    </div>
                    <div class="run-stat-grid" style="margin-bottom:.5rem">
                      <div class="run-stat"><div class="rs-label">Level</div><div class="rs-value">${run.teamLevel}</div></div>
                      <div class="run-stat"><div class="rs-label">Nodes</div><div class="rs-value">${run.stats.nodes}</div></div>
                      <div class="run-stat"><div class="rs-label">Credits</div><div class="rs-value">${run.credits}</div></div>
                      <div class="run-stat"><div class="rs-label">Beacons</div><div class="rs-value">${run.beacons}</div></div>
                      <div class="run-stat"><div class="rs-label">Relics</div><div class="rs-value">${run.relics.length}</div></div>
                    </div>
                    <div class="row">
                      ${live
    ? `<button class="primary" data-continue="${run.id}">Continue</button>`
    : `<button data-continue="${run.id}">View result</button>`}
                      ${Campaign.canRebirth(run) && !atSlotCap
    ? `<button class="primary" data-rebirth="${run.id}" title="Start a new run with this team and its relics, at level ${Campaign.STARTING_LEVEL}, against fully-built themed teams.">Rebirth</button>`
    : ''}
                      <button class="danger" data-delete="${run.id}">${live ? 'Abandon' : 'Delete'}</button>
                      <button data-export="${run.id}">Export</button>
                    </div>
                  </div>`;
                }).join('')}
                <button id="btnNewRun" class="${running ? '' : 'primary'}" ${atSlotCap ? 'disabled title="All run slots are full — finish or delete one first"' : ''}>New run</button>
              </div>` : `
              <div class="panel">
                <div class="panel-head"><h2>Start a new run</h2></div>
                <p class="small dim">No runs yet. You can keep up to ${Store.MAX_RUN_SLOTS} going at once.</p>
                <button id="btnNewRun" class="primary">New run</button>
              </div>`}

            <div class="panel" style="margin-top:.7rem">
              <div class="panel-head"><h2>Run history</h2><div class="spacer"></div>
                <button id="btnNewRun2" class="${running ? '' : 'primary'}">New run</button></div>
              ${history.length ? `<table class="data">
                <thead><tr><th>Seed</th><th>Difficulty</th><th>Result</th><th class="num">Act</th><th class="num">Nodes</th><th>Team</th><th></th></tr></thead>
                <tbody>${history.map((entry, index) => `
                  <tr>
                    <td class="mono tiny">${esc(entry.seedLabel)}</td>
                    <td>${esc(Content.difficulty(entry.difficulty).name)}${entry.ascension ? ` A${entry.ascension}` : ''}</td>
                    <td><span class="tag ${entry.won ? 'good' : 'bad'}">${entry.won ? 'Cleared' : 'Lost'}</span></td>
                    <td class="num">${entry.act}</td>
                    <td class="num">${entry.nodes}</td>
                    <td>${entry.team.slice(0, 6).map(m => monSprite(m.species, {className: 'sprite-sm'})).join('')}</td>
                    <td><button class="tiny-btn" data-runinfo="${index}">Details</button></td>
                  </tr>`).join('')}</tbody></table>`
                : '<div class="empty-state">No completed runs yet.</div>'}
            </div>
          </div>

          <div>
            <div class="panel tight">
              <div class="panel-head"><h3>Records</h3></div>
              <div class="run-stat-grid">
                <div class="run-stat"><div class="rs-label">Runs</div><div class="rs-value">${records.runs}</div></div>
                <div class="run-stat"><div class="rs-label">Wins</div><div class="rs-value">${records.wins}</div></div>
                <div class="run-stat"><div class="rs-label">Streak</div><div class="rs-value">${records.currentWinStreak}</div></div>
                <div class="run-stat"><div class="rs-label">Best streak</div><div class="rs-value">${records.bestWinStreak}</div></div>
                <div class="run-stat"><div class="rs-label">Bosses</div><div class="rs-value">${records.bossesDefeated}</div></div>
                <div class="run-stat"><div class="rs-label">Longest</div><div class="rs-value">${records.longestRunNodes}</div></div>
              </div>
              <div class="small" style="margin-top:.5rem">
                <div>Highest cleared: <b>${records.highestDifficultyCleared ? esc(Content.difficulty(records.highestDifficultyCleared).name) : '—'}</b></div>
                <div>Fastest clear: <b>${records.fastestWinTurns ? `${records.fastestWinTurns} nodes` : '—'}</b></div>
                <div>Most used: <b>${esc(favouriteSpecies(records) || '—')}</b></div>
              </div>
            </div>

            <div class="panel tight" style="margin-top:.7rem">
              <div class="panel-head"><h3>Unlocks</h3></div>
              <div class="small">
                ${Content.UNLOCKS.map(entry => {
                  const track = save.profile.unlocks[entry.grants.track] || [];
                  const owned = track.includes(entry.grants.id);
                  const detail = entry.grants.track === 'starterPools'
                    ? Content.STARTER_POOLS[entry.grants.id]?.description
                    : Content.relic(entry.grants.id)?.description;
                  return `<div style="margin-bottom:.3rem">
                    <span class="tag ${owned ? 'good' : ''}">${owned ? 'Unlocked' : 'Locked'}</span>
                    <b>${esc(entry.name)}</b>
                    <span class="tiny dim">${entry.grants.track === 'relics' ? 'relic' : 'starter pool'}</span>
                    <div class="tiny">${esc(owned ? (detail || '') : entry.hint)}</div></div>`;
                }).join('')}
                <div style="margin-top:.4rem" class="tiny">
                  Lifetime: ${save.profile.records.campaign.totalRecruited || 0} Pokémon recruited ·
                  longest clear ${save.profile.records.campaign.longestActsCleared || 0} Acts ·
                  highest Ascension cleared ${Math.max(0, save.profile.records.campaign.highestAscensionCleared ?? -1)}.
                  Unlocks add variety — they never grant stat advantages.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    // Starting a new run no longer ends the one in progress — they coexist in
    // their own slots, up to Store.MAX_RUN_SLOTS.
    const newRun = () => CampaignUI.openRunSetup(app);
    UI.$('#btnNewRun', root)?.addEventListener('click', newRun);
    UI.$('#btnNewRun2', root)?.addEventListener('click', newRun);
    UI.$$('[data-continue]', root).forEach(b => b.onclick = () => {
      activeRun = loadActive(b.dataset.continue);
      if (!activeRun) { UI.toast('That run could not be loaded.', {error: true}); return; }
      Store.update(data => { data.campaign.activeRunId = b.dataset.continue; });
      app.go('campaign.run');
    });
    UI.$$('[data-delete]', root).forEach(b => b.onclick = () => {
      const stored = runSlots().find(r => r.id === b.dataset.delete);
      const live = inProgress(stored);
      UI.confirmDialog(live ? 'Abandon this run?' : 'Delete this run?',
        live ? 'It will be recorded in your run history as a loss.' : 'It is removed from your slots. The history entry stays.',
        () => {
          if (live) {
            const run = loadActive(b.dataset.delete);
            if (run) { activeRun = run; abandonActive(); }
          }
          dropRunSlot(b.dataset.delete);
          activeRun = null;
          app.refresh();
        }, {confirmLabel: live ? 'Abandon' : 'Delete', danger: true});
    });
    UI.$$('[data-rebirth]', root).forEach(b => b.onclick = () => startRebirth(app, b.dataset.rebirth));
    UI.$$('[data-export]', root).forEach(b => b.onclick = () => {
      const stored = runSlots().find(r => r.id === b.dataset.export);
      if (stored) UI.downloadText(`redgpt-campaign-${stored.seedLabel || 'run'}.json`, JSON.stringify(stored, null, 2), 'application/json');
    });
    UI.$$('[data-runinfo]', root).forEach(b => b.onclick = () => showRunDetails(history[+b.dataset.runinfo]));
  };

  function favouriteSpecies(records) {
    const entries = Object.entries(records.favouriteSpecies || {});
    if (!entries.length) return null;
    const [id] = entries.sort((a, b) => b[1] - a[1])[0];
    return Dex.species(id).name;
  }

  function abandonActive() {
    const run = activeRun || loadActive();
    if (!run) return;
    Campaign.abandonRun(run);
    finaliseRun(run);
  }

  /**
   * Spend a cleared run on a Rebirth: a new run inside it.
   *
   * Two runs are written, and both writes matter. The new one goes into a fresh
   * slot; the finished one is written back because `createRebirthRun` marks it
   * `rebirthUsed`, and without persisting that the same clear could be spent
   * again on every visit to this screen.
   */
  function startRebirth(app, runId) {
    const finished = loadActive(runId);
    if (!Campaign.canRebirth(finished)) { UI.toast('That run cannot be reborn.', {error: true}); return; }
    const relics = finished.relics.length;
    const depth = (finished.rebirth || 0) + 1;
    UI.openModal(`
      <h2>Rebirth ${depth}</h2>
      <div class="row" style="gap:.3rem;margin:.4rem 0">
        ${finished.party.map(m => monSprite(m.set.species, {className: 'sprite-md'})).join('')}
      </div>
      <p class="dim">${esc(finished.party.map(m => PokemonLib.displayName(m.set)).join(', '))}
        come with you, re-levelled to ${Campaign.STARTING_LEVEL}${relics
    ? `, and so do your ${relics} relic${relics === 1 ? '' : 's'}` : ''}.
        Act, map, credits, Beacons and bag all reset.</p>
      <p class="small dim">Every Trainer, Elite and boss fields a complete six built around a declared
        strategy, plays at <b>Expert</b> whatever the difficulty, and opens with a field effect that has
        no turn counter — you can still remove it, but it will not run out. Rewards are richer to match.</p>
      <p class="small dim">A clear can only be spent on one Rebirth.</p>
      <div class="row" style="justify-content:flex-end;margin-top:1rem">
        <button data-act="cancel">Cancel</button>
        <button data-act="ok" class="primary">Begin again</button>
      </div>`, {
      onOpen(body) {
        body.querySelector('[data-act=cancel]').onclick = () => UI.closeModal();
        body.querySelector('[data-act=ok]').onclick = () => {
          UI.closeModal(true);
          const reborn = Campaign.createRebirthRun(finished);
          if (!reborn) { UI.toast('That run cannot be reborn.', {error: true}); return; }
          Store.update(data => {
            const runs = data.campaign.runs || (data.campaign.runs = []);
            const at = runs.findIndex(r => r && r.id === finished.id);
            if (at >= 0) runs[at] = Campaign.serialize(finished);
            runs.unshift(Campaign.serialize(reborn));
            data.campaign.runs = runs.slice(0, Store.MAX_RUN_SLOTS);
            data.campaign.activeRunId = reborn.id;
          });
          activeRun = reborn;
          app.go('campaign.run');
        };
      },
    });
  }

  /** Remove one run from the slots, leaving its history entry alone. */
  function dropRunSlot(runId) {
    Store.update(data => {
      data.campaign.runs = (data.campaign.runs || []).filter(r => r && r.id !== runId);
      if (data.campaign.activeRunId === runId) {
        data.campaign.activeRunId = data.campaign.runs[0]?.id || null;
      }
    });
  }

  function showRunDetails(entry) {
    UI.openModal(`
      <h2>${entry.won ? 'Run cleared' : 'Run ended'} — ${esc(entry.seedLabel)}</h2>
      <div class="row-tight" style="margin-bottom:.5rem">
        <span class="tag">${esc(Content.difficulty(entry.difficulty).name)}</span>
        ${entry.ascension ? `<span class="tag">Ascension ${entry.ascension}</span>` : ''}
        <span class="tag">Act ${entry.act}</span>
        <span class="tag">${entry.nodes} nodes</span>
        <span class="tag">${entry.battlesWon} wins</span>
      </div>
      <p class="small dim">${esc(entry.reason || '')}</p>
      <h4>Final team</h4>
      ${entry.team.map(m => `
        <div class="row" style="gap:.5rem;margin-bottom:.3rem">
          ${monSprite(m.species, {className: 'sprite-sm'})}
          <div style="flex:1">
            <b>${esc(m.name)}</b> <span class="tiny">Lv.${m.level}</span>
            ${m.item ? itemIcon(m.item) : ''}
            <div class="tiny">${esc(m.ability)} · ${m.moves.map(id => Dex.move(id).name).join(', ')}</div>
          </div>
        </div>`).join('')}
      ${entry.relics.length ? `<h4>Relics</h4><div class="relic-strip">${relicChips(entry.relics)}</div>` : ''}`, {wide: true});
  }

  /* ------------------------------------------------------------------ *
   * Run setup
   * ------------------------------------------------------------------ */

  CampaignUI.openRunSetup = function (app) {
    const save = Store.load();
    const unlocks = save.profile.unlocks;
    const maxAscension = Math.min(Content.ASCENSIONS.length, unlocks.ascension);

    UI.openModal(`
      <h2>New run</h2>
      <div class="grid grid-2">
        <div>
          <h4>Difficulty</h4>
          <div class="choice-list" id="diffList">
            ${Content.DIFFICULTIES.map(d => {
              const locked = d.unlockedBy && !unlocks.difficulties.includes(d.id);
              return `<button class="choice-btn" data-diff="${d.id}" ${locked ? 'disabled' : ''}>
                <span class="c-label">${esc(d.name)} ${locked ? '<span class="tag">Locked</span>' : ''}</span>
                <span class="c-detail">${esc(d.description)}</span>
                <span class="tiny mono">${d.beacons} beacons · ${d.startingCredits} credits · ${Math.round(d.battleHealPercent * 100)}% post-battle healing</span>
              </button>`;
            }).join('')}
          </div>
        </div>
        <div>
          <h4>Options</h4>
          <label class="field"><span>Run seed (optional)</span>
            <input id="runSeed" type="text" placeholder="e.g. REDGPT-8F32A1" autocomplete="off"></label>
          <div class="tiny">The same seed on the same version produces the same map, shops and reward sequence.</div>
          <label class="field" style="margin-top:.6rem"><span>Ascension (0–${maxAscension})</span>
            <input id="runAsc" type="number" min="0" max="${maxAscension}" value="0" ${maxAscension ? '' : 'disabled'}></label>
          <div class="tiny" id="ascDesc">${maxAscension ? '' : 'Clear a run to unlock Ascension modifiers.'}</div>
          <h4 style="margin-top:.7rem">Run shape</h4>
          <div class="grid grid-2" style="gap:.5rem">
            <label class="field"><span>Acts</span>
              <input id="runActs" type="number" min="1" max="8" value="3"></label>
            <label class="field"><span>Rescue Beacons</span>
              <input id="runBeacons" type="number" min="0" max="6" value="${Content.difficulty('normal').beacons ?? 3}"></label>
          </div>
          <div class="tiny" id="shapeDesc"></div>
          <h4 style="margin-top:.7rem">Starter pools</h4>
          <div class="tiny dim" style="margin-bottom:.3rem">The draft picks from every pool that is on. At least one must stay on.</div>
          <div class="row" id="runPools" style="gap:.3rem;flex-wrap:wrap">${unlocks.starterPools.map(id => {
    const pool = Content.STARTER_POOLS[id];
    const names = (pool?.species || []).map(s => Dex.species(s).name).join(', ');
    return `<button class="tiny-btn active" data-pool="${esc(id)}" title="${esc(names)}">${esc(pool?.name || id)}</button>`;
  }).join('')}</div>
        </div>
      </div>
      <div class="row" style="justify-content:flex-end;margin-top:.8rem">
        <button id="runCancel">Cancel</button>
        <button id="runStart" class="primary">Begin run</button>
      </div>`, {
      wide: true,
      onOpen(body) {
        let difficulty = 'normal';
        const actsInput = body.querySelector('#runActs');
        const beaconsInput = body.querySelector('#runBeacons');

        /*
         * Starter pools are chosen per run, not just displayed. Every unlocked
         * pool starts on, so the default is what it always was; turning some off
         * is how a player asks for a themed draft.
         *
         * The last one on cannot be turned off — an empty selection would leave
         * `draftCandidates` with no species to pick from and hand back an empty
         * draft, which is a soft-locked run rather than an error. Refusing the
         * click is better than validating it later.
         */
        const poolButtons = [...body.querySelectorAll('[data-pool]')];
        const selectedPools = () => poolButtons.filter(b => b.classList.contains('active')).map(b => b.dataset.pool);
        for (const button of poolButtons) {
          button.onclick = () => {
            const on = button.classList.contains('active');
            if (on && selectedPools().length === 1) {
              UI.toast('At least one starter pool has to stay on.', {error: true});
              return;
            }
            button.classList.toggle('active', !on);
          };
        }

        // Both knobs make a run more survivable, so the opposition scales to pay
        // for them. Spell that out here rather than letting it surprise anyone.
        const describeShape = () => {
          const base = Content.difficulty(difficulty).beacons ?? 2;
          const acts = Math.max(1, Math.min(8, +actsInput.value || 3));
          const beacons = Math.max(0, Math.min(6, +beaconsInput.value || 0));
          const steps = Math.max(0, beacons - base) + Math.max(0, acts - 3);
          const pct = Math.round((Math.pow(1.4, steps) - 1) * 100);
          body.querySelector('#shapeDesc').innerHTML = steps
            ? `<b>Challenge +${steps}</b> — opponents field fuller teams, draw from a stronger pool and play at a higher AI tier (about ${pct}% harder overall). ${esc(Content.difficulty(difficulty).name)} normally gives ${base} beacons.`
            : `Standard shape for ${esc(Content.difficulty(difficulty).name)}. Adding Acts or Beacons above ${base} raises the challenge sharply.`;
        };

        const buttons = UI.$$('[data-diff]', body);
        const mark = () => buttons.forEach(b => b.classList.toggle('active', b.dataset.diff === difficulty));
        buttons.forEach(b => b.onclick = () => {
          difficulty = b.dataset.diff;
          beaconsInput.value = Content.difficulty(difficulty).beacons ?? 2;
          mark();
          describeShape();
        });
        mark();
        actsInput.oninput = describeShape;
        beaconsInput.oninput = describeShape;
        beaconsInput.value = Content.difficulty(difficulty).beacons ?? 2;
        describeShape();

        const asc = body.querySelector('#runAsc');
        const describe = () => {
          const level = +asc.value || 0;
          const applied = Content.ASCENSIONS.filter(a => a.level <= level);
          body.querySelector('#ascDesc').innerHTML = applied.length
            ? applied.map(a => `<div>A${a.level}: ${esc(a.description)}</div>`).join('')
            : 'No modifiers.';
        };
        asc.oninput = describe;
        describe();

        body.querySelector('#runCancel').onclick = () => UI.closeModal();
        body.querySelector('#runStart').onclick = () => {
          const seedText = body.querySelector('#runSeed').value.trim();
          const parsed = RedGPT.RNG.parse(seedText);
          const run = Campaign.createRun({
            seed: parsed.valid ? parsed.value : RedGPT.RNG.random(),
            difficulty,
            ascension: +asc.value || 0,
            trainerName: Store.load().profile.name || 'Trainer',
            unlocks: {
              // What the player left switched on, not everything they own.
              starterPools: selectedPools(),
              // Unlockable relics stay out of the reward pool until earned.
              relics: Store.load().profile.unlocks.relics || [],
            },
            acts: +actsInput.value || 3,
            beacons: +beaconsInput.value,
          });
          activeRun = run;
          persist();
          UI.closeModal(true);
          app.go('campaign.run');
        };
      },
    });
  };

  /* ------------------------------------------------------------------ *
   * Run view
   * ------------------------------------------------------------------ */

  CampaignUI.renderRun = function (root, app) {
    if (!activeRun) activeRun = loadActive();
    if (!activeRun) { app.go('campaign'); return; }
    const run = activeRun;

    if (run.phase === 'victory' || run.phase === 'defeat') { renderResults(root, app, run); return; }
    if (run.phase === 'battle') { startCampaignBattle(root, app, run); return; }

    root.innerHTML = `
      <div class="view-pad">
        <div class="row" style="margin-bottom:.6rem">
          <button id="cRunBack">← Campaign</button>
          <span class="tag">Act ${run.act} of ${Campaign.actCount(run)} — ${esc(actName(run))}</span>
          <span class="tag">${esc(Content.difficulty(run.difficulty).name)}${run.ascension ? ` A${run.ascension}` : ''}</span>
          ${run.rebirth ? `<span class="tag warn" title="Every Trainer, Elite and boss fields a complete six with a declared strategy, plays at Expert, and opens with a field effect that does not expire.">Rebirth ${run.rebirth}</span>` : ''}
          <span class="tag mono">${esc(run.seedLabel)}</span>
          <span class="spacer"></span>
          <span class="tag">Lv ${run.teamLevel}</span>
          <span class="tag">₡ ${run.credits}</span>
          <span class="tag ${run.beacons ? 'good' : 'bad'}">${run.beacons} beacon${run.beacons === 1 ? '' : 's'}</span>
        </div>
        <div class="campaign-layout">
          <div id="cMain"></div>
          <div id="cSide"></div>
        </div>
      </div>`;

    UI.$('#cRunBack', root).onclick = () => app.go('campaign');
    renderSidebar(UI.$('#cSide', root), app, run);

    const main = UI.$('#cMain', root);
    if (run.phase === 'draft') renderDraft(main, app, run);
    else if (run.phase === 'prompt') renderPrompt(main, app, run);
    else renderMap(main, app, run);
  };

  function refresh(app) {
    persist();
    app.go('campaign.run');
  }

  /* ------------------------------ sidebar ------------------------------ */

  function renderSidebar(node, app, run) {
    const assist = Campaign.assistState(run);
    /*
     * `run.stats.assistOnly` is one-way and was previously invisible: a single
     * hand-played battle forfeits the Tacticians/Paragons unlock for the whole
     * run, and the player only found out on the end screen. Surfaced here while
     * it can still be acted on. Null when no assist-only unlock applies to this
     * difficulty or all of them are already owned, so it never tracks a reward
     * that cannot be earned.
     */
    const assistOnly = Campaign.assistOnlyStatus(run, Store.load().profile);
    const consumables = Object.entries(run.bag.consumables).filter(([, n]) => n > 0);
    const held = Object.entries(run.bag.held).filter(([, n]) => n > 0);
    const evolution = Object.entries(run.bag.evolution).filter(([, n]) => n > 0);

    node.innerHTML = `
      <div class="panel tight">
        <div class="panel-head"><h3>Party</h3><div class="spacer"></div><span class="tiny mono">${run.party.length}/6</span></div>
        <div class="run-party" id="cParty"></div>
      </div>
      <div class="panel tight" style="margin-top:.6rem">
        <div class="panel-head"><h3>Relics</h3></div>
        ${run.relics.length ? `<div class="relic-strip">${relicChips(run.relics)}</div>` : '<div class="small dim">No relics yet.</div>'}
      </div>
      <div class="panel tight" style="margin-top:.6rem">
        <div class="panel-head"><h3>Bag</h3><div class="spacer"></div>${
          Campaign.canHealAll(run) ? '<button class="tiny-btn" id="cHealAll" title="Spend HP items to bring every injured Pokémon to full. Revives are never used automatically.">Heal All</button>' : ''
        }</div>
        ${consumables.length ? `<div class="row" style="gap:.3rem">${consumables.map(([id, n]) =>
          `<button class="tiny-btn" data-use="${id}" title="${esc(Content.CONSUMABLES[id].description)}">${esc(Content.CONSUMABLES[id].name)} ×${n}</button>`).join('')}</div>`
          : '<div class="small dim">No consumables.</div>'}
        ${held.length ? `<div style="margin-top:.4rem"><h4>Held items</h4><div class="row" style="gap:.3rem">${held.map(([id, n]) =>
          `<button class="tiny-btn" data-equip="${id}">${itemIcon(id)} ${esc(Dex.item(id).name)} ×${n}</button>`).join('')}</div></div>` : ''}
        ${evolution.length ? `<div style="margin-top:.4rem"><h4>Evolution items</h4><div class="row" style="gap:.3rem">${evolution.map(([id, n]) =>
          `<button class="tiny-btn" data-evoitem="${id}">${esc(Dex.item(id).name)} ×${n}</button>`).join('')}</div></div>` : ''}
      </div>
      <div class="panel tight" style="margin-top:.6rem">
        <div class="panel-head"><h3>Assist Mode</h3></div>
        <label class="checkbox assist-toggle">
          <input type="checkbox" id="assistRecommend" ${assist.recommend ? 'checked' : ''}>
          Recommendations</label>
        <div class="tiny dim" style="margin:0 0 .4rem 1.4rem">Marks a suggested reward, move and item holder.</div>
        <label class="checkbox assist-toggle">
          <input type="checkbox" id="assistAuto" ${assist.autoBattle ? 'checked' : ''}>
          AI battling</label>
        <div class="tiny dim" style="margin-left:1.4rem">The AI picks your lead and plays. You can take over at any point.</div>
        ${assist.recommend ? `
          <div class="plan-picker" style="margin:.5rem 0 0 1.4rem">
            <div class="tiny dim" style="margin-bottom:.25rem">Team plan — what recommendations should aim at:</div>
            <div class="row" style="gap:.25rem;flex-wrap:wrap">${Content.TEAM_PLANS.map(plan => `
              <button class="tiny-btn ${plan.id === assist.plan ? 'active' : ''}" data-plan="${plan.id}"
                title="${esc(plan.blurb)}">${esc(plan.name)}</button>`).join('')}</div>
            <div class="tiny dim" style="margin-top:.25rem">${esc(Content.teamPlan(assist.plan).blurb)}</div>
          </div>` : ''}
        ${assistOnly ? `
          <div class="assist-only-chip ${assistOnly.intact ? 'intact' : 'forfeited'}" id="cAssistOnly"
            title="${esc(assistOnly.hint)}">
            <span class="tag">${assistOnly.intact ? 'Assist-only: intact' : 'Assist-only: forfeited'}</span>
            <span class="tiny dim">${assistOnly.intact
    ? `${esc(assistOnly.targets.join(' / '))} still reachable — let the AI play every battle, including the lead at Team Preview.`
    : `${esc(assistOnly.targets.join(' / '))} is out for this run: a battle was played by hand.`}</span>
          </div>` : ''}
      </div>
      <div class="panel tight" style="margin-top:.6rem">
        <div class="panel-head"><h3>Run log</h3></div>
        <div class="battle-log" style="max-height:180px">${run.log.slice(-40).reverse().map(e => `<div class="ln">${esc(e.text)}</div>`).join('')}</div>
      </div>`;

    const partyNode = UI.$('#cParty', node);
    partyNode.innerHTML = run.party.map(member => {
      const max = Campaign.memberMaxHP(run, member);
      const percent = Math.round(100 * Math.max(0, member.condition.currentHP) / max);
      const species = Dex.species(member.set.species);
      return `
        <button class="party-row ${member.condition.currentHP <= 0 ? 'fainted' : ''}" data-member="${member.uid}">
          ${monSprite(species, {className: 'sprite-sm'})}
          <span style="min-width:0">
            <span class="p-name">${esc(PokemonLib.displayName(member.set))}</span>
            ${member.condition.status ? statusPill(member.condition.status) : ''}
            <span class="row-tight">${typeChips(species.types)} ${member.set.item ? itemIcon(member.set.item) : ''}</span>
            ${hpBar(percent, {thin: true})}
          </span>
          <span class="tiny mono right">${Math.max(0, member.condition.currentHP)}/${max}</span>
        </button>`;
    }).join('');

    UI.$$('[data-member]', partyNode).forEach(b => b.onclick = () => showMemberDetail(app, run, b.dataset.member));
    const healAllButton = UI.$('#cHealAll', node);
    if (healAllButton) {
      healAllButton.onclick = () => {
        const result = Campaign.healAll(run);
        UI.toast(result.ok ? result.message : result.error, {error: !result.ok});
        refresh(app);
      };
    }
    UI.$$('[data-use]', node).forEach(b => b.onclick = () => openConsumableTarget(app, run, b.dataset.use));
    UI.$$('[data-equip]', node).forEach(b => b.onclick = () => openEquipTarget(app, run, b.dataset.equip));
    UI.$$('[data-evoitem]', node).forEach(b => b.onclick = () => openEvolutionTarget(app, run, b.dataset.evoitem));

    const recommendToggle = UI.$('#assistRecommend', node);
    if (recommendToggle) {
      recommendToggle.onchange = () => {
        Campaign.setAssist(run, 'recommend', recommendToggle.checked);
        persist();
        refresh(app);
      };
    }
    const autoToggle = UI.$('#assistAuto', node);
    if (autoToggle) {
      autoToggle.onchange = () => {
        Campaign.setAssist(run, 'autoBattle', autoToggle.checked);
        persist();
      };
    }
    /*
     * The plan changes advice only, never what is offered, so it is safe to
     * switch mid-run — the same property that lets the other two Assist
     * switches be toggled at any point without desynchronising a seeded run.
     * A full refresh so every badge on screen re-derives against the new plan.
     */
    UI.$$('[data-plan]', node).forEach(button => {
      button.onclick = () => {
        Campaign.setAssist(run, 'plan', button.dataset.plan);
        persist();
        refresh(app);
      };
    });
  }

  /* --------------------------- Assist Mode ---------------------------- *
   * Recommendations are advisory only: they add a badge and a reason, and
   * never pre-select, reorder or disable anything. The player still makes
   * every choice, which is what keeps a suggestion from silently becoming a
   * decision when the heuristic is wrong.
   * -------------------------------------------------------------------- */

  /**
   * Display name for the Act the run is currently in.
   *
   * Runs can be longer than the three hand-authored Acts, so never index
   * `ACT_LAYOUT` directly — `ACT_LAYOUT[3]` is undefined and reading `.name`
   * off it threw, blanking the whole Campaign screen the moment an 8-Act run
   * reached Act 4. The generated map carries its own name; `layoutFor` is the
   * fallback and extends past the table by design.
   */
  function actName(run) {
    const map = Campaign.currentActMap(run);
    return map?.name || CampaignMap.layoutFor(run.act).name || `Act ${run.act}`;
  }

  /** Is the recommendations switch on for this run? */
  function advising(run) {
    return !!Campaign.assistState(run).recommend;
  }

  /** Badge markup for a recommended option. */
  function assistBadge(why) {
    return `<span class="assist-badge" title="${esc(why || '')}">Suggested</span>`;
  }

  /**
   * A visible one-line reason above a prompt's options.
   *
   * The badge alone puts the argument in a `title` tooltip, which is fine for a
   * one-word "this move is stronger" and not for a recruit — the choice that
   * shapes the rest of the run. §5's rule is that a recommendation the player
   * cannot interrogate is worse than none, so the reasoning is on the page.
   */
  function assistReason(why) {
    if (!why) return '';
    return `<div class="assist-reason"><span class="assist-badge">Assist</span> ${esc(why)}</div>`;
  }

  /**
   * The ability a set would actually have as `forme`.
   *
   * Mirrors the engine rather than restating it: both routes that reach a
   * different forme's ability — `battle.megaEvolve` and
   * `battle.applyHeldFormeChange` — overwrite it with `Dex.abilityList(species)[0]`,
   * so that is what is read here. Without this the forme toggle showed the
   * *set's* ability against another forme's stats, which is wrong exactly where
   * it matters most: a Charizard viewing Mega-Y read "Blaze" beside Drought's
   * stat line.
   *
   * The ability-driven formes (Stance Change, Zen Mode, Battle Bond) keep their
   * set's ability in the engine, and their forme's slot-0 ability is that same
   * ability, so one rule covers both cases.
   */
  function formeAbility(set, forme) {
    if (!forme || Dex.toID(forme.id) === Dex.toID(set.species)) return set.ability;
    return Dex.abilityList(forme)[0] || set.ability;
  }

  /**
   * @param {string|null} formeId  which forme's numbers to show
   * @param {'current'|'base'} statMode  raw stats at this level, or species base
   */
  function showMemberDetail(app, run, uid, formeId = null, statMode = 'current') {
    const member = Campaign.partyMember(run, uid);
    if (!member) return;
    const species = Dex.species(member.set.species);
    // Every forme in this Pokémon's family, so the player can compare spreads
    // before committing to an item or an ability. `available` marks the ones
    // this exact set can reach right now; the rest are shown greyed with what
    // they would need.
    const formes = RedGPT.Mechanics.speciesFormes(member.set);
    const shown = formeId ? Dex.species(formeId) : species;
    const showingForme = shown.id !== species.id;
    // Raw stats for whichever forme is selected: the same level, nature, IVs and
    // EVs run through the other forme's base stats. That answers the question
    // the toggle is actually for — "what would it be as this?" — instead of
    // blanking the column out because it is not in that forme right now.
    const stats = showingForme
      ? PokemonLib.calcStats(Object.assign({}, Campaign.memberSet(run, member), {species: shown.id}))
      : Campaign.memberStats(run, member);
    const showBase = statMode === 'base';
    const value = stat => (showBase ? shown.baseStats[stat] : stats[stat]);
    // Bars are scaled to the range each mode actually occupies.
    const scale = showBase ? 255 : 400;
    const nature = Dex.nature(member.set.nature);
    const natureFor = stat => (nature.plus === stat ? ' up' : nature.minus === stat ? ' down' : '');
    UI.openModal(`
      <div class="row" style="align-items:flex-start;gap:1rem">
        ${monSprite(shown, {className: 'sprite-lg'})}
        <div style="flex:1">
          <h2 style="margin:0">${esc(PokemonLib.displayName(member.set))}${showingForme ? ` <span class="tiny dim">as ${esc(shown.name)}</span>` : ''}</h2>
          <div class="row-tight">${typeChips(shown.types)}<span class="tiny mono">Lv.${member.set.level} · BST ${shown.bst}</span></div>
          <div class="small">${esc(formeAbility(member.set, shown))} · ${esc(UI.natureLabel(member.set.nature))}</div>
          <div class="row-tight"><span class="tiny dim">Tera</span> ${UI.typeChip(member.set.teraType)}</div>
          <div class="row-tight">${member.set.item ? `${itemIcon(member.set.item)} ${esc(Dex.item(member.set.item).name)}` : '<span class="dim">No held item</span>'}</div>
        </div>
      </div>
      <div class="grid grid-2" style="margin-top:.7rem">
        <div>
          <div class="row-tight" style="justify-content:space-between;align-items:baseline">
            <h4 style="margin:0">Stats</h4>
            <span class="row-tight stat-mode">
              <button class="tiny ${showBase ? '' : 'active'}" data-statmode="current">At Lv.${member.set.level}</button>
              <button class="tiny ${showBase ? 'active' : ''}" data-statmode="base">Base</button>
            </span>
          </div>
          ${formes.length ? `<div class="row-tight forme-toggle" style="margin:.35rem 0;flex-wrap:wrap">
            <button class="tiny ${showingForme ? '' : 'active'}" data-forme="">${esc(species.name)}</button>
            ${formes.map(f => `<button class="tiny ${shown.id === f.id ? 'active' : ''}${f.available ? '' : ' unavailable'}" data-forme="${f.id}" title="${esc(f.name)} — ${esc(f.when)}">${esc(f.name)}</button>`).join('')}
          </div>` : ''}
          ${showingForme ? `<div class="tiny dim" style="margin-bottom:.35rem">${(() => {
    const entry = formes.find(f => f.id === shown.id) || {};
    return entry.available
      ? `As ${esc(shown.name)} — reachable now, ${esc(entry.when || '')}.`
      : `As ${esc(shown.name)}. Not reachable as equipped: ${esc(entry.when || '')}.`;
  })()}</div>` : ''}
          ${Dex.STATS.map(stat => `<div class="stat-line">
            <span class="tiny${natureFor(stat)}">${Dex.STAT_SHORT[stat]}</span>
            <span class="bar"><i style="width:${Math.min(100, Math.round(100 * value(stat) / scale))}%"></i></span>
            <span class="value">${value(stat)}</span></div>`).join('')}
          <div class="tiny dim" style="margin-top:.3rem">
            ${showBase
    ? `Species base stats${showingForme ? ` for ${esc(shown.name)}` : ''}`
    : `Stats at level ${member.set.level}${showingForme ? ` as ${esc(shown.name)}` : ''}`} · BST ${shown.bst}
          </div>
        </div>
        <div>
          <h4>Moves</h4>
          ${member.set.moves.map(id => {
            const move = Dex.move(id);
            const pp = member.condition.pp?.[id];
            // An Aerilate holder's Tackle is a Flying move — show what it is,
            // and read it off **the forme being viewed**: a Pinsir looking at
            // Mega Pinsir should see its Normal moves as Flying, because that is
            // what they become. `formeAbility` mirrors the engine's own rule.
            // Named `moveType` rather than `shown`, which is the forme species
            // in the enclosing scope and was being shadowed here.
            const abilityHere = formeAbility(member.set, shown);
            const moveType = RedGPT.Abilities.displayMoveType(abilityHere, move);
            const power = RedGPT.Abilities.displayBasePower(abilityHere, move);
            const boosted = power !== move.basePower;
            return `<div class="move-slot"><div>
              <b>${esc(move.name)}</b><br>
              <span class="move-meta">${UI.typeChip(moveType)} ${UI.categoryChip(move.category)}
              <span class="mono${boosted ? ' boosted' : ''}">${
  boosted ? `<s>${move.basePower}</s> ${power}` : (move.basePower || '—')} BP</span></span>
            </div><span class="tiny mono">${pp ?? '—'} PP</span></div>`;
          }).join('')}
        </div>
      </div>
      ${Dex.evolutions(species).length ? `<div class="small" style="margin-top:.5rem">Evolves: ${Dex.evolutions(species).map(r =>
        `${esc(Dex.species(r.target).name)} (${esc(Dex.evolutionLabel(r))})`).join(', ')}</div>` : ''}
      <div class="row" style="margin-top:.7rem;justify-content:flex-end">
        <button id="mdRelease" class="danger" ${run.party.length <= 1 ? 'disabled title="You cannot release your last Pokémon"' : ''}>Release</button>
        <span class="spacer"></span>
        <button id="mdItem">Change held item</button>
        <button id="mdClose" class="primary">Close</button>
      </div>`, {
      wide: true,
      onOpen(body) {
        body.querySelector('#mdClose').onclick = () => UI.closeModal(true);
        body.querySelector('#mdItem').onclick = () => { UI.closeModal(true); openItemManager(app, run); };
        // Re-open the same modal on the chosen forme / stat mode. Cheaper than
        // patching the sprite, typing, bars and BST in place. Each toggle
        // carries the other's current value through, so switching forme does
        // not silently reset you to raw stats and vice versa.
        UI.$$('[data-forme]', body).forEach(button => {
          button.onclick = () => { UI.closeModal(true); showMemberDetail(app, run, uid, button.dataset.forme || null, statMode); };
        });
        UI.$$('[data-statmode]', body).forEach(button => {
          button.onclick = () => { UI.closeModal(true); showMemberDetail(app, run, uid, formeId, button.dataset.statmode); };
        });
        const release = body.querySelector('#mdRelease');
        if (release && !release.disabled) {
          release.onclick = () => {
            // Releasing is permanent and cannot be undone mid-run, so confirm.
            UI.openModal(`<h2>Release ${esc(PokemonLib.displayName(member.set))}?</h2>
              <p class="dim">It leaves the party for good. ${member.set.item
    ? `Its ${esc(Dex.item(member.set.item).name)} goes back to the bag.` : ''}</p>
              <div class="row" style="justify-content:flex-end">
                <button id="relNo">Keep it</button>
                <button id="relYes" class="danger">Release</button>
              </div>`, {
              onOpen(confirmBody) {
                confirmBody.querySelector('#relNo').onclick = () => { UI.closeModal(true); showMemberDetail(app, run, uid); };
                confirmBody.querySelector('#relYes').onclick = () => {
                  const result = Campaign.releaseMember(run, uid);
                  UI.closeModal(true);
                  if (!result.ok) { UI.toast(result.error, {error: true}); return; }
                  UI.toast(result.message);
                  persist();
                  refresh(app);
                };
              },
            });
          };
        }
      },
    });
  }

  function openConsumableTarget(app, run, itemId) {
    const item = Content.CONSUMABLES[itemId];
    if (item.effect === 'teamheal') {
      const result = Campaign.useConsumable(run, itemId, null);
      UI.toast(result.ok ? result.message : result.error, {error: !result.ok});
      refresh(app);
      return;
    }
    UI.openModal(`<h2>Use ${esc(item.name)}</h2><p class="small dim">${esc(item.description)}</p>
      <div class="run-party">${run.party.map(m => partyPickRow(run, m)).join('')}</div>`, {
      onOpen(body) {
        UI.$$('[data-pick]', body).forEach(b => b.onclick = () => {
          const result = Campaign.useConsumable(run, itemId, b.dataset.pick);
          if (!result.ok) { UI.toast(result.error, {error: true}); return; }
          UI.closeModal(true);
          UI.toast(result.message);
          refresh(app);
        });
      },
    });
  }

  function openEquipTarget(app, run, itemId) {
    const holder = advising(run) ? RedGPT.Advisor.recommendHeldItemTarget(run, itemId) : null;
    UI.openModal(`<h2>Give ${esc(Dex.item(itemId).name)}</h2>
      <p class="small dim">${esc(Dex.item(itemId).shortDesc)}</p>
      ${holder ? `<p class="assist-note">${esc(holder.why)}</p>` : ''}
      <div class="run-party">${run.party.map(m => partyPickRow(run, m, holder)).join('')}</div>`, {
      onOpen(body) {
        UI.$$('[data-pick]', body).forEach(b => b.onclick = () => {
          const result = Campaign.equipHeldItem(run, b.dataset.pick, itemId);
          if (!result.ok) { UI.toast(result.error, {error: true}); return; }
          UI.closeModal(true);
          UI.toast(result.message);
          refresh(app);
        });
      },
    });
  }

  function openEvolutionTarget(app, run, itemId) {
    UI.openModal(`<h2>Use ${esc(Dex.item(itemId).name)}</h2>
      <div class="run-party">${run.party.map(m => partyPickRow(run, m)).join('')}</div>`, {
      onOpen(body) {
        UI.$$('[data-pick]', body).forEach(b => b.onclick = () => {
          const result = Campaign.useEvolutionItem(run, itemId, b.dataset.pick);
          if (!result.ok) { UI.toast(result.error, {error: true}); return; }
          UI.closeModal(true);
          UI.toast(result.message);
          refresh(app);
        });
      },
    });
  }

  function openItemManager(app, run) {
    const held = Object.entries(run.bag.held).filter(([, n]) => n > 0);
    UI.openModal(`
      <h2>Held items</h2>
      <p class="small dim">Move held items between party Pokémon. Items removed here go back to the bag.</p>
      <table class="data"><thead><tr><th>Pokémon</th><th>Holding</th><th>Give</th></tr></thead><tbody>
        ${run.party.map(member => `
          <tr>
            <td>${monSprite(member.set.species, {className: 'sprite-sm'})} ${esc(PokemonLib.displayName(member.set))}</td>
            <td>${member.set.item ? `${itemIcon(member.set.item)} ${esc(Dex.item(member.set.item).name)}
              <button class="tiny-btn" data-unequip="${member.uid}">Remove</button>` : '<span class="dim">—</span>'}</td>
            <td><select data-give="${member.uid}">
              <option value="">— choose —</option>
              ${held.map(([id, n]) => `<option value="${id}">${esc(Dex.item(id).name)} ×${n}</option>`).join('')}
            </select></td>
          </tr>`).join('')}
      </tbody></table>
      <div class="row" style="justify-content:flex-end;margin-top:.6rem"><button id="imDone" class="primary">Done</button></div>`, {
      wide: true,
      onOpen(body) {
        UI.$$('[data-unequip]', body).forEach(b => b.onclick = () => {
          Campaign.equipHeldItem(run, b.dataset.unequip, null);
          UI.closeModal(true);
          openItemManager(app, run);
          persist();
        });
        UI.$$('[data-give]', body).forEach(select => select.onchange = () => {
          if (!select.value) return;
          const result = Campaign.equipHeldItem(run, select.dataset.give, select.value);
          if (!result.ok) { UI.toast(result.error, {error: true}); return; }
          UI.closeModal(true);
          openItemManager(app, run);
          persist();
        });
        body.querySelector('#imDone').onclick = () => { UI.closeModal(true); refresh(app); };
      },
    });
  }

  /**
   * One selectable party member.
   * @param {object} suggestion optional `{uid, why}` from the advisor; the
   *   matching row is badged, nothing is pre-selected.
   */
  function partyPickRow(run, member, suggestion = null) {
    const max = Campaign.memberMaxHP(run, member);
    const percent = Math.round(100 * Math.max(0, member.condition.currentHP) / max);
    const pick = suggestion && suggestion.uid === member.uid;
    return `<button class="party-row ${pick ? 'suggested' : ''}" data-pick="${member.uid}">
      ${monSprite(member.set.species, {className: 'sprite-sm'})}
      <span style="min-width:0"><span class="p-name">${esc(PokemonLib.displayName(member.set))}</span>
        ${member.condition.status ? statusPill(member.condition.status) : ''}
        ${pick ? assistBadge(suggestion.why) : ''}
        ${hpBar(percent, {thin: true})}</span>
      <span class="tiny mono right">${Math.max(0, member.condition.currentHP)}/${max}</span>
    </button>`;
  }

  /* ------------------------------ draft ------------------------------ */

  function renderDraft(node, app, run) {
    const prompt = run.pending;
    node.innerHTML = `
      <div class="panel">
        <div class="panel-head"><h2>${esc(prompt.title)}</h2><div class="spacer"></div>
          <span class="tag">${prompt.rerollsLeft} reroll${prompt.rerollsLeft === 1 ? '' : 's'} left</span></div>
        <p class="small dim">Choose one. All three start at level ${Campaign.STARTING_LEVEL} with a generated competitive set.</p>
        <div class="grid grid-3">
          ${prompt.options.map((set, index) => {
            const species = Dex.species(set.species);
            return `
              <button class="panel tight" data-draft="${index}" style="text-align:left">
                <div class="center">${monSprite(species, {className: 'sprite-lg'})}</div>
                <h3 style="text-align:center">${esc(species.name)}</h3>
                <div class="center">${typeChips(species.types)}</div>
                <div class="tiny center mono">BST ${species.bst} · ${Dex.evolutionStagesRemaining(species)} evolution${Dex.evolutionStagesRemaining(species) === 1 ? '' : 's'} ahead</div>
                <div class="small" style="margin-top:.4rem"><b>${esc(set.ability)}</b>
                  <div class="tiny">${esc(Dex.ability(set.ability)?.shortDesc || '')}</div></div>
                <div class="small" style="margin-top:.3rem">${set.moves.map(id =>
                  `<div class="row-tight">${UI.typeChip(Dex.move(id).type)} ${esc(Dex.move(id).name)}</div>`).join('')}</div>
                <div class="tiny mono" style="margin-top:.35rem">${Dex.STATS.map(s => `${Dex.STAT_SHORT[s]} ${species.baseStats[s]}`).join(' · ')}</div>
                ${set.item ? `<div class="row-tight tiny" style="margin-top:.3rem">${itemIcon(set.item)} ${esc(Dex.item(set.item).name)}</div>` : ''}
              </button>`;
          }).join('')}
        </div>
        <div class="row" style="margin-top:.7rem">
          <button id="draftReroll" ${prompt.rerollsLeft > 0 ? '' : 'disabled'}>Reroll candidates</button>
        </div>
      </div>`;

    UI.$$('[data-draft]', node).forEach(b => b.onclick = () => {
      const result = Campaign.chooseStarter(run, {index: +b.dataset.draft});
      if (!result.ok) { UI.toast(result.error, {error: true}); return; }
      refresh(app);
    });
    UI.$('#draftReroll', node).onclick = () => {
      const result = Campaign.chooseStarter(run, {reroll: true});
      if (!result.ok) { UI.toast(result.error, {error: true}); return; }
      refresh(app);
    };
  }

  /* ------------------------------ map ------------------------------ */

  function renderMap(node, app, run) {
    const actMap = Campaign.currentActMap(run);
    const mods = Campaign.modifiers(run);
    const revealed = run.mapRevealed || mods.revealNodeRewards;
    const rows = [];
    for (let row = 0; row < actMap.rows; row++) {
      rows.push(actMap.nodes.filter(n => n.row === row));
    }

    node.innerHTML = `
      <div class="panel">
        <div class="panel-head">
          <h2>Act ${run.act} map</h2>
          <div class="spacer"></div>
          <span class="small dim">${run.availableNodeIds.length ? 'Choose your next node' : 'Advancing…'}</span>
        </div>
        <div class="run-map" id="mapBox">
          <svg class="map-edges" id="mapEdges" aria-hidden="true"></svg>
          <div class="map-rows" id="mapRows">
            ${rows.map((nodes, rowIndex) => `
              <div class="map-row" data-row="${rowIndex}">
                ${[0, 1, 2, 3, 4].map(col => {
                  const nodeAt = nodes.find(n => n.col === col);
                  if (!nodeAt) return '<div></div>';
                  const type = Content.NODE_TYPES[nodeAt.type];
                  const selectable = run.availableNodeIds.includes(nodeAt.id);
                  const cleared = run.clearedNodeIds.includes(nodeAt.id);
                  const current = run.currentNodeId === nodeAt.id;
                  return `<div style="position:relative">
                    <button class="map-node ${nodeAt.type === 'boss' ? 'boss' : ''} ${selectable ? 'selectable' : ''} ${cleared ? 'cleared' : ''} ${current ? 'current' : ''}"
                            data-node="${nodeAt.id}" ${selectable ? '' : 'disabled'}
                            title="${esc(type.name)} — ${esc(type.description)}">
                      ${esc(type.icon)}
                      <span class="node-label">${esc(type.short || type.name.split(' ')[0])}</span>
                    </button>
                  </div>`;
                }).join('')}
              </div>`).join('')}
          </div>
        </div>
        <div class="row" style="margin-top:.6rem;gap:.6rem;flex-wrap:wrap">
          ${Object.values(Content.NODE_TYPES).map(t => `<span class="tiny"><b>${esc(t.icon)}</b> ${esc(t.name)}</span>`).join('')}
        </div>
        ${revealed ? '<div class="tiny" style="margin-top:.3rem">Trail Map: node types for the whole Act are visible.</div>' : ''}
      </div>`;

    UI.$$('[data-node]', node).forEach(button => {
      button.onclick = () => {
        const result = Campaign.enterNode(run, button.dataset.node);
        if (!result.ok) { UI.toast(result.error, {error: true}); return; }
        refresh(app);
      };
    });

    drawMapEdges(node, run, actMap);
  }

  /**
   * Draw the connections between nodes. Without them the map is just a grid of
   * icons and the player cannot see which branch leads where, so this is drawn
   * from the real node graph after layout, measuring the rendered buttons.
   */
  function drawMapEdges(root, run, actMap) {
    const box = UI.$('#mapBox', root);
    const svg = UI.$('#mapEdges', root);
    if (!box || !svg) return;

    const draw = () => {
      const boxRect = box.getBoundingClientRect();
      const width = box.scrollWidth;
      const height = box.scrollHeight;
      if (!width || !height) return;
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
      svg.style.width = `${width}px`;
      svg.style.height = `${height}px`;

      const centre = id => {
        const button = box.querySelector(`[data-node="${id}"]`);
        if (!button) return null;
        const rect = button.getBoundingClientRect();
        return {
          x: rect.left - boxRect.left + box.scrollLeft + rect.width / 2,
          y: rect.top - boxRect.top + box.scrollTop + rect.height / 2,
        };
      };

      const lines = [];
      for (const mapNode of actMap.nodes) {
        const from = centre(mapNode.id);
        if (!from) continue;
        const fromCleared = run.clearedNodeIds.includes(mapNode.id);
        for (const nextId of mapNode.next) {
          const to = centre(nextId);
          if (!to) continue;
          // Highlight the edges leading out of where the player is standing.
          const live = run.currentNodeId === mapNode.id && run.availableNodeIds.includes(nextId);
          const walked = fromCleared && run.clearedNodeIds.includes(nextId);
          const cls = live ? 'live' : walked ? 'walked' : '';
          lines.push(`<line x1="${from.x.toFixed(1)}" y1="${from.y.toFixed(1)}" x2="${to.x.toFixed(1)}" y2="${to.y.toFixed(1)}" class="${cls}"></line>`);
        }
      }
      // Entry stubs so the opening row visibly starts the route.
      if (!run.currentNodeId) {
        for (const entryId of actMap.entries) {
          const point = centre(entryId);
          if (!point) continue;
          lines.push(`<line x1="${point.x.toFixed(1)}" y1="${(point.y + 34).toFixed(1)}" x2="${point.x.toFixed(1)}" y2="${point.y.toFixed(1)}" class="${run.availableNodeIds.includes(entryId) ? 'live' : ''}"></line>`);
        }
      }
      svg.innerHTML = lines.join('');
    };

    draw();
    // Re-measure once fonts and sprites have settled, and on resize.
    requestAnimationFrame(draw);
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    box.addEventListener('scroll', draw, {passive: true});
    // The next route change replaces #mapBox entirely, so the listener goes with it.
    const observer = new MutationObserver(() => {
      if (!document.body.contains(box)) {
        window.removeEventListener('resize', onResize);
        observer.disconnect();
      }
    });
    observer.observe(document.getElementById('view'), {childList: true, subtree: false});
  }

  /* ------------------------------ prompts ------------------------------ */

  function renderPrompt(node, app, run) {
    const prompt = run.pending;
    if (!prompt) { Campaign.finishNode(run); refresh(app); return; }
    const handlers = {
      reward: renderRewardPrompt,
      shop: renderShopPrompt,
      rest: renderChoicePrompt,
      specialist: renderChoicePrompt,
      event: renderEventPrompt,
      message: renderMessagePrompt,
      recruit: renderRecruitPrompt,
      tm: renderTmPrompt,
      tutor: renderTutorPrompt,
      movelearn: renderMoveLearnPrompt,
      ability: renderPickerPrompt,
      nature: renderPickerPrompt,
      sell: renderSellPrompt,
      evolve: renderEvolvePrompt,
      evolvechoice: renderEvolveChoicePrompt,
      terashard: renderTeraShardPrompt,
    };
    const handler = handlers[prompt.type];
    if (!handler) {
      node.innerHTML = `<div class="panel"><h2>${esc(prompt.title || 'Continue')}</h2>
        <button id="pContinue" class="primary">Continue</button></div>`;
      UI.$('#pContinue', node).onclick = () => { Campaign.resolvePrompt(run, {skip: true}); refresh(app); };
      return;
    }
    handler(node, app, run, prompt);
  }

  function promptShell(prompt, inner) {
    return `
      <div class="prompt-card">
        ${prompt.sprite || prompt.background ? `<div class="prompt-hero">
          ${prompt.sprite ? trainerSprite(prompt.sprite) : ''}
          <div><h2>${esc(prompt.title)}</h2>${prompt.text ? `<p class="dim">${esc(prompt.text)}</p>` : ''}</div>
        </div>` : `<h2>${esc(prompt.title)}</h2>`}
        ${inner}
      </div>`;
  }

  function act(app, run, action) {
    const result = Campaign.resolvePrompt(run, action);
    if (!result.ok) { UI.toast(result.error, {error: true}); return false; }
    if (result.message) UI.toast(result.message);
    refresh(app);
    return true;
  }

  function renderRewardPrompt(node, app, run, prompt) {
    const suggestion = advising(run) ? RedGPT.Advisor.recommendReward(run, prompt) : null;
    node.innerHTML = promptShell(prompt, `
      <div class="choice-list">
        ${prompt.options.map((option, index) => `
          <button class="choice-btn ${suggestion && suggestion.index === index ? 'suggested' : ''}" data-reward="${index}">
            <span class="c-label">${esc(option.label)}${option.kind === 'held' ? ` ${itemIcon(option.id)}` : ''}${
  suggestion && suggestion.index === index ? assistBadge(suggestion.why) : ''}</span>
            <span class="c-detail">${esc(option.detail || '')}${
  suggestion && suggestion.index === index ? `<br><span class="assist-why">${esc(suggestion.why)}</span>` : ''}</span>
          </button>`).join('')}
      </div>
      <div class="row" style="margin-top:.6rem"><button id="rewardSkip">Take nothing</button></div>`);
    UI.$$('[data-reward]', node).forEach(b => b.onclick = () => act(app, run, {index: +b.dataset.reward}));
    UI.$('#rewardSkip', node).onclick = () => act(app, run, {skip: true});
  }

  function renderShopPrompt(node, app, run, prompt) {
    node.innerHTML = promptShell(prompt, `
      <div class="row" style="margin-bottom:.5rem"><span class="tag">₡ ${run.credits}</span>
        ${prompt.onePurchase ? '<span class="tag good">One purchase</span>' : ''}
        <span class="small dim">${esc(prompt.blurb
    || 'Stock is generated from your Act, your roster and the run seed.')}</span></div>
      <div class="shop-grid">
        ${prompt.stock.map(entry => `
          <button class="shop-item panel tight ${entry.sold ? 'sold' : ''}" data-buy="${entry.index}"
                  ${entry.sold || run.credits < entry.price ? 'disabled' : ''}>
            ${entry.kind === 'held' || entry.kind === 'evolution' ? itemIcon(entry.id) : ''}
            <span style="flex:1">
              <b>${esc(entry.name)}</b><br>
              <span class="tiny">${esc(entry.detail || '')}</span>
              ${entry.note ? `<br><span class="tiny shop-note">${esc(entry.note)}</span>` : ''}
            </span>
            <span class="mono tiny">${entry.sold ? 'SOLD' : `₡${entry.price}`}</span>
          </button>`).join('')}
      </div>
      <div class="row" style="margin-top:.7rem"><button id="shopLeave" class="primary">${
  prompt.onePurchase ? 'Leave without buying' : 'Leave shop'}</button></div>`);
    UI.$$('[data-buy]', node).forEach(b => b.onclick = () => act(app, run, {index: +b.dataset.buy}));
    UI.$('#shopLeave', node).onclick = () => act(app, run, {leave: true});
  }

  function renderChoicePrompt(node, app, run, prompt) {
    node.innerHTML = promptShell(prompt, `
      <div class="choice-list">
        ${prompt.options.map(option => `
          <button class="choice-btn" data-opt="${esc(option.id)}">
            <span class="c-label">${esc(option.label)}</span>
            <span class="c-detail">${esc(option.detail || '')}</span>
          </button>`).join('')}
      </div>`);
    UI.$$('[data-opt]', node).forEach(b => b.onclick = () => act(app, run, {id: b.dataset.opt}));
  }

  function renderEventPrompt(node, app, run, prompt) {
    node.innerHTML = promptShell(prompt, `
      <div class="choice-list">
        ${prompt.choices.map(choice => `
          <button class="choice-btn" data-choice="${choice.index}" ${choice.enabled ? '' : 'disabled'}>
            <span class="c-label">${esc(choice.label)}</span>
            <span class="c-detail">${esc(choice.detail || '')}</span>
            ${choice.enabled ? '' : '<span class="c-cost">Unavailable</span>'}
          </button>`).join('')}
      </div>`);
    UI.$$('[data-choice]', node).forEach(b => b.onclick = () => act(app, run, {index: +b.dataset.choice}));
  }

  function renderMessagePrompt(node, app, run, prompt) {
    node.innerHTML = promptShell(prompt, `
      <p>${esc(prompt.text)}</p>
      <div class="row" style="margin-top:.6rem"><button id="msgOk" class="primary">Continue</button></div>`);
    UI.$('#msgOk', node).onclick = () => act(app, run, {});
  }

  function renderRecruitPrompt(node, app, run, prompt) {
    if (prompt.needsRelease) {
      // Which member the party misses least, judged against the team plan —
      // never the sole enabler of an active plan.
      const releasePick = advising(run)
        ? RedGPT.Advisor.recommendRelease(run, prompt.options?.[prompt.chosenIndex] || null)
        : null;
      node.innerHTML = promptShell(prompt, `
        <p class="dim">Your party is full. Choose a Pokémon to release.</p>
        ${assistReason(releasePick?.why)}
        <div class="run-party">${run.party.map(m => partyPickRow(run, m, releasePick)).join('')}</div>
        <div class="row" style="margin-top:.6rem"><button id="recDecline">Decline the recruit</button></div>`);
      UI.$$('[data-pick]', node).forEach(b => b.onclick = () => act(app, run, {index: prompt.chosenIndex, releaseUid: b.dataset.pick}));
      UI.$('#recDecline', node).onclick = () => act(app, run, {skip: true});
      return;
    }
    const pick = advising(run) ? RedGPT.Advisor.recommendRecruit(run, prompt.options) : null;
    node.innerHTML = promptShell(prompt, `
      ${assistReason(pick?.why)}
      <div class="grid grid-3">
        ${prompt.options.map((set, index) => {
          const species = Dex.species(set.species);
          const suggested = pick && pick.index === index;
          return `<button class="panel tight${suggested ? ' suggested' : ''}" data-rec="${index}" style="text-align:left">
            ${suggested ? assistBadge(pick.why) : ''}
            <div class="center">${monSprite(species, {className: 'sprite-md'})}</div>
            <h3 style="text-align:center;margin:.2rem 0">${esc(species.name)}</h3>
            <div class="center">${typeChips(species.types)}</div>
            <div class="tiny center mono">BST ${species.bst}</div>
            <div class="small" style="margin-top:.3rem"><b>${esc(set.ability)}</b></div>
            <div class="tiny">${set.moves.map(id => Dex.move(id).name).join(', ')}</div>
            ${set.item ? `<div class="row-tight tiny" style="margin-top:.2rem">${itemIcon(set.item)} ${esc(Dex.item(set.item).name)}</div>` : ''}
          </button>`;
        }).join('')}
      </div>
      ${prompt.partyFull ? '<p class="tiny dim" style="margin:.5rem 0 0">Your party is full — taking one of these means releasing a member.</p>' : ''}
      ${prompt.themes?.length ? `
        <div class="plan-picker" style="margin-top:.6rem">
          <div class="tiny dim" style="margin-bottom:.25rem">${prompt.themeUsed
    ? `Scouting for <b>${esc(Content.teamPlan(prompt.plan).name)}</b> — ${esc(Content.teamPlan(prompt.plan).blurb)}`
    : 'Scout for a theme instead — redraws this offer toward one plan. One choice, and it costs no reroll.'}</div>
          ${prompt.themeUsed ? '' : `<div class="row" style="gap:.25rem;flex-wrap:wrap">${prompt.themes.map(id => {
    const plan = Content.teamPlan(id);
    return `<button class="tiny-btn" data-theme="${esc(id)}" title="${esc(plan.blurb)}">${esc(plan.name)}</button>`;
  }).join('')}</div>`}
        </div>` : ''}
      <div class="row" style="margin-top:.6rem">
        <button id="recReroll" ${run.rerolls > 0 ? '' : 'disabled'}>Reroll (${run.rerolls} left)</button>
        ${prompt.allowDecline ? '<button id="recSkip">Decline</button>' : ''}
      </div>`);
    UI.$$('[data-rec]', node).forEach(b => b.onclick = () => act(app, run, {index: +b.dataset.rec}));
    UI.$$('[data-theme]', node).forEach(b => b.onclick = () => act(app, run, {theme: b.dataset.theme}));
    UI.$('#recReroll', node).onclick = () => act(app, run, {reroll: true});
    UI.$('#recSkip', node)?.addEventListener('click', () => act(app, run, {skip: true}));
  }

  function renderTmPrompt(node, app, run, prompt) {
    const tmPick = advising(run) ? RedGPT.Advisor.recommendTm(run, prompt) : null;
    let chosenMove = tmPick ? tmPick.moveIndex : 0;
    const draw = () => {
      const entry = prompt.moves[chosenMove];
      const moveId = typeof entry === 'string' ? entry : entry.id;
      const eligible = typeof entry === 'string' ? run.party.map(m => m.uid) : entry.eligible;
      const move = Dex.move(moveId);
      node.innerHTML = promptShell(prompt, `
        <div class="row" style="gap:.4rem;margin-bottom:.6rem">
          ${prompt.moves.map((m, index) => {
            const id = typeof m === 'string' ? m : m.id;
            const flagged = tmPick && tmPick.moveIndex === index ? ' ★' : '';
            return `<button data-move="${index}" data-movetip="${esc(id)}" class="${index === chosenMove ? 'active' : ''}${flagged ? ' suggested' : ''}"
              ${flagged ? `title="${esc(tmPick.why)}"` : ''}>${esc(Dex.move(id).name)}${flagged}</button>`;
          }).join('')}
        </div>
        <div class="panel tight" style="margin-bottom:.6rem">
          <div class="row-tight">${UI.typeChip(move.type)} ${UI.categoryChip(move.category)}
            <span class="tag mono">${move.basePower || '—'} BP</span>
            <span class="tag mono">${move.accuracy == null ? '∞' : move.accuracy + '%'}</span>
            <span class="tag mono">${move.pp} PP</span></div>
          <div class="small" style="margin-top:.3rem">${esc(move.desc)}</div>
        </div>
        <h4>Teach to</h4>
        <div class="run-party">${run.party.filter(m => eligible.includes(m.uid))
    .map(m => partyPickRow(run, m, tmPick && tmPick.moveIndex === chosenMove
      ? {uid: tmPick.memberUid, why: tmPick.why} : null)).join('')
          || '<div class="small dim">No party Pokémon can learn this move.</div>'}</div>
        <div class="row" style="margin-top:.6rem"><button id="tmSkip">Skip</button></div>`);
      UI.$$('[data-move]', node).forEach(b => b.onclick = () => { chosenMove = +b.dataset.move; draw(); });
      UI.$$('[data-pick]', node).forEach(b => b.onclick = () => act(app, run, {moveIndex: chosenMove, memberUid: b.dataset.pick}));
      UI.$('#tmSkip', node).onclick = () => act(app, run, {skip: true});
      UI.attachMoveTips(node);
    };
    draw();
  }

  function renderTutorPrompt(node, app, run, prompt) {
    if (!prompt.memberUid) {
      node.innerHTML = promptShell(prompt, `
        <div class="run-party">${run.party.map(m => partyPickRow(run, m)).join('')}</div>
        <div class="row" style="margin-top:.6rem"><button id="tuSkip">Skip</button></div>`);
      UI.$$('[data-pick]', node).forEach(b => b.onclick = () => act(app, run, {memberUid: b.dataset.pick}));
      UI.$('#tuSkip', node).onclick = () => act(app, run, {skip: true});
      return;
    }
    const member = Campaign.partyMember(run, prompt.memberUid);
    if (!member) return renderOrphanedPrompt(node, app, run);
    node.innerHTML = promptShell(prompt, `
      <p class="dim">Choose any move ${esc(PokemonLib.displayName(member.set))} can legally learn.</p>
      <div class="picker"><input id="tutorSearch" type="search" placeholder="Search legal moves…" autocomplete="off"></div>
      <div class="row tutor-controls" style="gap:.5rem;margin-top:.45rem;flex-wrap:wrap">
        <span class="tiny dim">Show</span>
        <div class="row" style="gap:.2rem">
          ${[['all', 'All'], ['Physical', 'Physical'], ['Special', 'Special'], ['Status', 'Status']]
    .map(([id, label]) => `<button class="tiny-btn" data-cat="${id}">${label}</button>`).join('')}
        </div>
        <button class="tiny-btn" data-stab="1" title="Only moves that match ${esc(PokemonLib.displayName(member.set))}'s own typing">STAB</button>
        <span class="spacer"></span>
        <span class="tiny dim">Sort</span>
        <div class="row" style="gap:.2rem">
          ${[['power', 'Power'], ['accuracy', 'Accuracy'], ['name', 'Name'], ['type', 'Type']]
    .map(([id, label]) => `<button class="tiny-btn" data-sort="${id}">${label}</button>`).join('')}
        </div>
      </div>
      <div id="tutorCount" class="tiny dim" style="margin-top:.35rem"></div>
      <div id="tutorList" class="scroll-y" style="max-height:330px;margin-top:.25rem"></div>
      <div class="row" style="margin-top:.6rem"><button id="tuSkip">Skip</button></div>`);

    const listNode = UI.$('#tutorList', node);
    const countNode = UI.$('#tutorCount', node);
    const legal = prompt.legalMoves || Dex.legalMoveList(member.set.species);
    const tutorPick = advising(run) ? RedGPT.Advisor.recommendTutorMove(member.set, legal) : null;
    const ownTypes = Dex.species(member.set.species).types;

    /*
     * A tutor offers up to eighty legal moves. Sorted by power alone that buries
     * every status move under the attacks, and there was no way to ask for
     * "Water moves" or "the accurate ones" — the search box matched names only,
     * which is no help when you do not already know what you are looking for.
     */
    const LIMIT = 80;
    const view = {query: '', category: 'all', stab: false, sort: 'power', dir: -1};
    /** Never-misses sorts as better than 100%, not as missing. */
    const accuracyOf = move => (move.accuracy == null ? 101 : move.accuracy);
    const SORTS = {
      power: (a, b) => ((a.basePower || 0) - (b.basePower || 0)),
      accuracy: (a, b) => (accuracyOf(a) - accuracyOf(b)),
      name: (a, b) => a.name.localeCompare(b.name),
      type: (a, b) => a.type.localeCompare(b.type),
    };

    const draw = () => {
      const query = view.query.trim().toLowerCase();
      const matching = legal
        .map(id => Dex.move(id))
        .filter(move => !query || move.name.toLowerCase().includes(query))
        .filter(move => view.category === 'all' || move.category === view.category)
        .filter(move => !view.stab || ownTypes.includes(move.type));
      matching.sort((a, b) => SORTS[view.sort](a, b) * view.dir || a.name.localeCompare(b.name));
      const shown = matching.slice(0, LIMIT);

      // Say what was cut. A silently truncated list reads as "that is all of them".
      countNode.textContent = matching.length > shown.length
        ? `Showing ${shown.length} of ${matching.length} — narrow the search or filter to see the rest.`
        : `${matching.length} move${matching.length === 1 ? '' : 's'}`;

      for (const button of UI.$$('[data-cat]', node)) {
        button.classList.toggle('active', button.dataset.cat === view.category);
      }
      UI.$('[data-stab]', node).classList.toggle('active', view.stab);
      for (const button of UI.$$('[data-sort]', node)) {
        const on = button.dataset.sort === view.sort;
        button.classList.toggle('active', on);
        const label = button.dataset.label || (button.dataset.label = button.textContent);
        button.textContent = on ? `${label} ${view.dir < 0 ? '▼' : '▲'}` : label;
      }

      listNode.innerHTML = shown.length ? `<table class="data"><tbody>${shown.map(move => `
        <tr class="${tutorPick && tutorPick.moveId === move.id ? 'suggested' : ''}">
          <td><button class="tiny-btn" data-teach="${move.id}" data-movetip="${move.id}"
            ${tutorPick && tutorPick.moveId === move.id ? `title="${esc(tutorPick.why)}"` : ''}>${esc(move.name)}${
  tutorPick && tutorPick.moveId === move.id ? ' ★' : ''}</button></td>
          <td>${UI.typeChip(move.type)}</td><td>${UI.categoryChip(move.category)}</td>
          <td class="num">${move.basePower || '—'}</td><td class="num">${move.accuracy == null ? '∞' : move.accuracy}</td></tr>`).join('')}
      </tbody></table>` : '<div class="small dim" style="padding:.5rem">No moves match those filters.</div>';
      UI.$$('[data-teach]', listNode).forEach(b => b.onclick = () => act(app, run, {memberUid: prompt.memberUid, moveId: b.dataset.teach}));
      UI.attachMoveTips(listNode);
    };

    UI.$('#tutorSearch', node).oninput = event => { view.query = event.target.value; draw(); };
    UI.$$('[data-cat]', node).forEach(b => b.onclick = () => { view.category = b.dataset.cat; draw(); });
    UI.$('[data-stab]', node).onclick = () => { view.stab = !view.stab; draw(); };
    UI.$$('[data-sort]', node).forEach(b => b.onclick = () => {
      // Clicking the active column flips it; a new column starts descending,
      // except Name and Type, where A-Z is the useful default.
      if (view.sort === b.dataset.sort) view.dir = -view.dir;
      else { view.sort = b.dataset.sort; view.dir = ['name', 'type'].includes(view.sort) ? 1 : -1; }
      draw();
    });
    UI.$('#tuSkip', node).onclick = () => act(app, run, {skip: true});
    draw();
  }

  /**
   * A prompt whose Pokémon is no longer in the party.
   *
   * The engine prunes these when a member is released and again on load, so
   * this should never be reached — but a prompt renderer that dereferences a
   * missing member throws and leaves the whole run screen blank, with no way
   * out except editing the save. Failing to a dismissible card instead means a
   * future prompt that carries a member reference cannot brick a run.
   */
  function renderOrphanedPrompt(node, app, run) {
    node.innerHTML = promptShell({title: 'That Pokémon has left'}, `
      <p class="dim">This offer was for a Pokémon that is no longer in your party.</p>
      <div class="row" style="margin-top:.6rem"><button id="orphanOk" class="primary">Continue</button></div>`);
    UI.$('#orphanOk', node).onclick = () => act(app, run, {skip: true});
  }

  function renderMoveLearnPrompt(node, app, run, prompt) {
    const member = Campaign.partyMember(run, prompt.memberUid);
    if (!member) return renderOrphanedPrompt(node, app, run);
    const incoming = Dex.move(prompt.moveId);
    const suggestion = advising(run)
      ? RedGPT.Advisor.recommendMoveReplacement(member.set, prompt.moveId)
      : undefined;
    node.innerHTML = promptShell(prompt, `
      <div class="panel tight" style="margin-bottom:.6rem" data-movetip="${esc(incoming.id)}" tabindex="0">
        <b>${esc(incoming.name)}</b>
        <div class="row-tight">${UI.typeChip(incoming.type)} ${UI.categoryChip(incoming.category)}
          <span class="tag mono">${incoming.basePower || '—'} BP</span>
          <span class="tag mono">${incoming.accuracy == null ? '∞' : incoming.accuracy + '%'}</span></div>
        <div class="small">${esc(incoming.shortDesc)}</div>
      </div>
      <p class="dim">${esc(PokemonLib.displayName(member.set))} already knows four moves. Choose one to forget.</p>
      ${suggestion === null && advising(run)
    ? `<div class="assist-note">Assist Mode suggests keeping the current four — ${esc(incoming.name)} does not look like an upgrade here.</div>`
    : ''}
      <div class="choice-list">
        ${member.set.moves.map((id, index) => {
          const move = Dex.move(id);
          const pick = suggestion && suggestion.index === index;
          return `<button class="choice-btn ${pick ? 'suggested' : ''}" data-forget="${index}" data-movetip="${esc(move.id)}">
            <span class="c-label">Forget ${esc(move.name)}${pick ? assistBadge(suggestion.why) : ''}</span>
            <span class="c-detail">${UI.typeChip(move.type)} ${UI.categoryChip(move.category)} ${move.basePower || '—'} BP · ${esc(move.shortDesc)}${
  pick ? `<br><span class="assist-why">${esc(suggestion.why)}</span>` : ''}</span>
          </button>`;
        }).join('')}
      </div>
      <div class="row" style="margin-top:.6rem"><button id="mlSkip">Don't learn ${esc(incoming.name)}</button></div>`);
    UI.$$('[data-forget]', node).forEach(b => b.onclick = () => act(app, run, {replaceIndex: +b.dataset.forget}));
    UI.$('#mlSkip', node).onclick = () => act(app, run, {skip: true});
    UI.attachMoveTips(node);
  }

  /** Choose which party member a bought Tera Shard retypes. */
  function renderTeraShardPrompt(node, app, run, prompt) {
    node.innerHTML = promptShell(prompt, `
      <p class="dim">Choose a Pokémon to become <b>Tera ${esc(prompt.teraType)}</b>.</p>
      <div class="run-party">${run.party.map(member => {
    const current = member.set.teraType;
    return `<button class="party-row" data-pick="${member.uid}">
          ${monSprite(member.set.species, {className: 'sprite-sm'})}
          <span style="min-width:0">
            <span class="p-name">${esc(PokemonLib.displayName(member.set))}</span>
            <span class="row-tight">${UI.typeChip(current)} <span class="tiny dim">→</span> ${UI.typeChip(prompt.teraType)}</span>
          </span>
        </button>`;
  }).join('')}</div>
      <div class="row" style="margin-top:.6rem"><button id="tsSkip">Save it for later</button></div>`);
    UI.$$('[data-pick]', node).forEach(b => b.onclick = () => act(app, run, {memberUid: b.dataset.pick}));
    UI.$('#tsSkip', node).onclick = () => act(app, run, {skip: true});
  }

  function renderPickerPrompt(node, app, run, prompt) {
    if (!prompt.memberUid) {
      node.innerHTML = promptShell(prompt, `
        <div class="run-party">${run.party.map(m => partyPickRow(run, m)).join('')}</div>
        <div class="row" style="margin-top:.6rem"><button id="pkSkip">Skip</button></div>`);
      UI.$$('[data-pick]', node).forEach(b => b.onclick = () => act(app, run, {memberUid: b.dataset.pick}));
      UI.$('#pkSkip', node).onclick = () => act(app, run, {skip: true});
      return;
    }
    const member = Campaign.partyMember(run, prompt.memberUid);
    if (!member) return renderOrphanedPrompt(node, app, run);
    if (prompt.type === 'ability') {
      const abilityPick = advising(run)
        ? RedGPT.Advisor.recommendAbility(run, member, prompt.abilities) : null;
      node.innerHTML = promptShell(prompt, `
        <p class="dim">Choose a new ability for ${esc(PokemonLib.displayName(member.set))}.</p>
        ${assistReason(abilityPick?.why)}
        <div class="choice-list">${prompt.abilities.map(name => `
          <button class="choice-btn${abilityPick && abilityPick.ability === name ? ' suggested' : ''}" data-ability="${esc(name)}">
            <span class="c-label">${esc(name)} ${name === member.set.ability ? '<span class="tag">Current</span>' : ''}${
  abilityPick && abilityPick.ability === name ? assistBadge(abilityPick.why) : ''}</span>
            <span class="c-detail">${esc(Dex.ability(name)?.shortDesc || '')}</span>
          </button>`).join('')}</div>`);
      UI.$$('[data-ability]', node).forEach(b => b.onclick = () => act(app, run, {memberUid: prompt.memberUid, ability: b.dataset.ability}));
      return;
    }
    node.innerHTML = promptShell(prompt, `
      <p class="dim">Choose a new nature for ${esc(PokemonLib.displayName(member.set))}.</p>
      <div class="grid grid-3">${Object.values(Dex.allNatures).sort((a, b) => a.name.localeCompare(b.name)).map(nature => `
        <button data-nature="${nature.id}" class="${nature.id === member.set.nature ? 'active' : ''}">${esc(UI.natureLabel(nature.id))}</button>`).join('')}</div>`);
    UI.$$('[data-nature]', node).forEach(b => b.onclick = () => act(app, run, {memberUid: prompt.memberUid, nature: b.dataset.nature}));
  }

  function renderSellPrompt(node, app, run, prompt) {
    const held = Object.entries(run.bag.held).filter(([, n]) => n > 0);
    node.innerHTML = promptShell(prompt, `
      <div class="choice-list">${held.map(([id, n]) => `
        <button class="choice-btn" data-sell="${id}">
          <span class="c-label">${esc(Dex.item(id).name)} ×${n}</span>
          <span class="c-cost">+₡${prompt.value}</span>
        </button>`).join('') || '<div class="small dim">No spare held items.</div>'}</div>
      <div class="row" style="margin-top:.6rem"><button id="sellSkip">Never mind</button></div>`);
    UI.$$('[data-sell]', node).forEach(b => b.onclick = () => act(app, run, {itemId: b.dataset.sell}));
    UI.$('#sellSkip', node).onclick = () => act(app, run, {skip: true});
  }

  function renderEvolvePrompt(node, app, run, prompt) {
    const eligible = run.party.filter(m => Dex.evolutions(m.set.species).some(r => r.method === 'item'));
    node.innerHTML = promptShell(prompt, `
      <div class="run-party">${eligible.map(m => partyPickRow(run, m)).join('') || '<div class="small dim">Nobody in the party evolves by item.</div>'}</div>
      <div class="row" style="margin-top:.6rem"><button id="evSkip">Skip</button></div>`);
    UI.$$('[data-pick]', node).forEach(b => b.onclick = () => act(app, run, {memberUid: b.dataset.pick}));
    UI.$('#evSkip', node).onclick = () => act(app, run, {skip: true});
  }

  /**
   * Branching evolution: pick which form.
   *
   * Raised when a Pokémon has more than one evolution it qualifies for right now —
   * Wurmple to Silcoon or Cascoon, Tyrogue to any of the three Hitmons, Eevee to
   * Espeon or Umbreon, or a Pokémon standing in front of two usable stones. Shows
   * the sprite, typing and BST of each option, because those are what the choice is
   * actually about, and fails to a dismissible card rather than throwing if the
   * Pokémon has left the party (§8 — a member-scoped prompt outliving its Pokémon
   * used to blank the whole run screen).
   */
  function renderEvolveChoicePrompt(node, app, run, prompt) {
    const member = Campaign.partyMember(run, prompt.memberUid);
    if (!member) {
      node.innerHTML = promptShell(prompt, `
        <div class="small dim">That Pokémon is no longer in the party.</div>
        <div class="row" style="margin-top:.6rem"><button id="evcSkip" class="primary">Continue</button></div>`);
      UI.$('#evcSkip', node).onclick = () => act(app, run, {skip: true});
      return;
    }
    const from = Dex.species(member.set.species);
    node.innerHTML = promptShell(prompt, `
      <div class="small dim" style="margin-bottom:.5rem">
        ${monSprite(from.id, {className: 'sprite-sm'})} ${esc(from.name)} can evolve more than one way. Choose which.
      </div>
      <div class="row" style="gap:.5rem;flex-wrap:wrap">
        ${prompt.options.map((option, index) => `
          <button class="choice-btn" data-evo="${index}" style="flex:1 1 8rem;text-align:center">
            ${monSprite(option.target, {className: 'sprite-sm'})}
            <div><b>${esc(option.name)}</b></div>
            <div class="tiny">${typeChips(option.types)}</div>
            <div class="tiny dim">BST ${option.bst}</div>
          </button>`).join('')}
      </div>
      <div class="row" style="margin-top:.6rem"><button id="evcSkip">Don't evolve</button></div>`);
    UI.$$('[data-evo]', node).forEach(b => b.onclick = () => act(app, run, {index: Number(b.dataset.evo)}));
    UI.$('#evcSkip', node).onclick = () => act(app, run, {skip: true});
  }

  /*
   * `renderItemsPrompt` was deleted along with the `items` prompt type it drew.
   * The Rest Site's "Reorganise" option was its only entry point, and that option
   * duplicated the party menu — held items can be moved there at any time — so
   * the prompt became unreachable when Rest gained "Forage" instead. Held-item
   * management lives in the party menu; there is deliberately no second screen
   * for it.
   */

  /* ------------------------------ battle ------------------------------ */

  function startCampaignBattle(root, app, run) {
    const config = run.pending.config;
    const battle = Campaign.createBattle(run, config);
    app.setChrome(false);

    const assist = Campaign.assistState(run);
    const view = new RedGPT.UI.BattleView(root, {
      battle,
      controlSides: [0],
      // Assist Mode: offering the button at all is what enables the feature in
      // the view, so the callback is passed whenever Campaign owns the battle.
      autoBattle: assist.autoBattle,
      onAutoBattleChange: on => { Campaign.setAssist(run, 'autoBattle', on); persist(); },
      showDamage: Store.load().profile.settings.showDamageNumbers !== false || Campaign.modifiers(run).showDamagePreview,
      onFinish: ({winner}) => {
        const won = winner === 0;
        return [{
          label: won ? 'Claim rewards' : (run.beacons > 0 ? 'Use a Rescue Beacon' : 'End the run'),
          primary: true,
          onClick: () => {
            /*
             * `automated` decides the two cleared-with-Assist unlocks
             * (Tacticians, Paragons). It has to be reported here because the
             * view is the only thing that knows: `playerActedManually` is set
             * by any choice the player makes themselves, including picking the
             * lead at Team Preview. Omitting it — which this call did — reads
             * as manual and cleared the flag on the first battle of every run,
             * so neither unlock could ever be earned.
             */
            const result = Campaign.resolveBattle(run, {
              won,
              survivors: Campaign.collectSurvivors(battle, 0),
              automated: !view.playerActedManually,
            });
            if (!result.ok) { UI.toast(result.error, {error: true}); return; }
            if (result.message) UI.toast(result.message);
            persist();
            app.setChrome(true);
            app.go('campaign.run');
          },
        }];
      },
    });
    app.setActiveView(view);

    if (config.opponent.intro) {
      UI.openModal(`
        <div class="prompt-hero">
          ${config.opponent.sprite ? trainerSprite(config.opponent.sprite) : ''}
          <div><h2>${esc(config.opponent.name)}</h2>
            ${config.opponent.plan ? `<div class="tag">${esc(config.opponent.plan)}</div>` : ''}
            <p class="dim" style="margin-top:.4rem">${esc(config.opponent.intro)}</p></div>
        </div>
        <div class="row" style="justify-content:flex-end"><button id="introGo" class="primary">Battle</button></div>`, {
        locked: true,
        onOpen(body) {
          body.querySelector('#introGo').onclick = () => {
            UI.closeModal(true);
            battle.start();
            view.render();
            if (view.autoBattle) view.autoBattleStep();
          };
        },
      });
    } else {
      battle.start();
      view.render();
      if (view.autoBattle) view.autoBattleStep();
    }
  }

  /* ------------------------------ results ------------------------------ */

  function renderResults(root, app, run) {
    const won = run.phase === 'victory';
    const summary = Campaign.summarise(run);
    root.innerHTML = `
      <div class="view-pad">
        <div class="panel">
          <div class="panel-head">
            <h1 style="color:${won ? 'var(--green)' : 'var(--accent-soft)'}">${won ? 'Run cleared' : 'Run ended'}</h1>
            <div class="spacer"></div>
            <span class="tag mono">${esc(run.seedLabel)}</span>
            <span class="tag">${esc(Content.difficulty(run.difficulty).name)}${run.ascension ? ` A${run.ascension}` : ''}</span>
          </div>
          <p class="dim">${esc(run.result?.reason || '')}</p>
          <div class="run-stat-grid" style="margin:.6rem 0">
            <div class="run-stat"><div class="rs-label">Act</div><div class="rs-value">${run.act}</div></div>
            <div class="run-stat"><div class="rs-label">Nodes</div><div class="rs-value">${run.stats.nodes}</div></div>
            <div class="run-stat"><div class="rs-label">Battles won</div><div class="rs-value">${run.stats.battlesWon}</div></div>
            <div class="run-stat"><div class="rs-label">Elites</div><div class="rs-value">${run.stats.elitesBeaten}</div></div>
            <div class="run-stat"><div class="rs-label">Bosses</div><div class="rs-value">${run.stats.bossesBeaten}</div></div>
            <div class="run-stat"><div class="rs-label">Recruits</div><div class="rs-value">${run.stats.recruits}</div></div>
            <div class="run-stat"><div class="rs-label">Evolutions</div><div class="rs-value">${run.stats.evolutions}</div></div>
            <div class="run-stat"><div class="rs-label">Rescues</div><div class="rs-value">${run.stats.rescues}</div></div>
          </div>
          <h3>${won ? 'Hall of Fame team' : 'Final team'}</h3>
          <div class="grid grid-3">
            ${summary.team.map(member => `
              <div class="panel tight">
                <div class="row">${monSprite(member.species, {className: 'sprite-md'})}
                  <div><b>${esc(member.name)}</b><div class="tiny">Lv.${member.level} · ${esc(member.ability)}</div>
                  ${member.item ? `<div class="row-tight tiny">${itemIcon(member.item)} ${esc(Dex.item(member.item).name)}</div>` : ''}</div>
                </div>
                <div class="tiny" style="margin-top:.3rem">${member.moves.map(id => Dex.move(id).name).join(', ')}</div>
              </div>`).join('')}
          </div>
          ${run.relics.length ? `<h3 style="margin-top:.7rem">Relics</h3><div class="relic-strip">${relicChips(run.relics)}</div>` : ''}
          <div class="row" style="margin-top:1rem">
            ${won ? '<button id="resRebirth" class="primary" title="Start a new run with this team and its relics, against fully-built themed teams at Expert.">Rebirth</button>' : ''}
            <button id="resNew" class="${won ? '' : 'primary'}">Start another run</button>
            <button id="resHome">Campaign home</button>
          </div>
        </div>
      </div>`;

    // Recorded first: the Rebirth button below reads the *stored* copy, and it
    // is `finaliseRun` that writes the finished run into its slot.
    finaliseRun(run);
    UI.$('#resNew', root).onclick = () => { activeRun = null; CampaignUI.openRunSetup(app); };
    UI.$('#resHome', root).onclick = () => { activeRun = null; app.go('campaign'); };
    const rebirthBtn = UI.$('#resRebirth', root);
    if (rebirthBtn) {
      if (!Campaign.canRebirth(run)) rebirthBtn.remove();
      else rebirthBtn.onclick = () => startRebirth(app, run.id);
    }
  }

  /** Record the finished run and apply meta unlocks exactly once. */
  function finaliseRun(run) {
    if (run.recorded) return;
    run.recorded = true;
    const summary = Campaign.summarise(run);
    Store.update(data => {
      const records = data.profile.records.campaign;
      records.runs++;
      if (summary.won) {
        records.wins++;
        records.currentWinStreak++;
        records.bestWinStreak = Math.max(records.bestWinStreak, records.currentWinStreak);
        const order = ['normal', 'veteran', 'master'];
        if (order.indexOf(run.difficulty) > order.indexOf(records.highestDifficultyCleared || '')) {
          records.highestDifficultyCleared = run.difficulty;
        }
        if (!records.fastestWinTurns || summary.nodes < records.fastestWinTurns) records.fastestWinTurns = summary.nodes;
        records.highestAscensionCleared = Math.max(records.highestAscensionCleared ?? -1, run.ascension);

        const unlocks = data.profile.unlocks;
        if (!unlocks.difficulties.includes('veteran')) unlocks.difficulties.push('veteran');
        if (run.difficulty !== 'normal' && !unlocks.difficulties.includes('master')) unlocks.difficulties.push('master');
        unlocks.ascension = Math.min(RedGPT.CampaignContent.ASCENSIONS.length, Math.max(unlocks.ascension, run.ascension + 1));
        records.longestActsCleared = Math.max(records.longestActsCleared || 0, Campaign.actCount(run));
      } else {
        records.losses++;
        records.currentWinStreak = 0;
      }
      // Lifetime recruiting counts whether or not the run was cleared.
      records.totalRecruited = (records.totalRecruited || 0) + (run.stats.recruits || 0);
      // Everything else is declared in CampaignContent.UNLOCKS and awarded by
      // the engine, so a new unlock is a data row rather than another branch here.
      const earned = Campaign.evaluateUnlocks(data.profile, run);
      for (const entry of earned) {
        const track = data.profile.unlocks[entry.grants.track] || (data.profile.unlocks[entry.grants.track] = []);
        if (!track.includes(entry.grants.id)) track.push(entry.grants.id);
      }
      run.unlocked = earned.map(entry => ({name: entry.name, hint: entry.hint}));
      records.bossesDefeated += run.stats.bossesBeaten;
      records.longestRunNodes = Math.max(records.longestRunNodes, summary.nodes);
      for (const [species, count] of Object.entries(run.stats.speciesUsed || {})) {
        records.favouriteSpecies[species] = (records.favouriteSpecies[species] || 0) + count;
      }
      data.campaign.history.unshift(summary);
      data.campaign.history = data.campaign.history.slice(0, 100);
      data.campaign.meta.lastSeed = run.seedLabel;
      data.campaign.meta.lastDifficulty = run.difficulty;
      // The finished run stays in its slot showing its result, so the player
      // can read the end screen and export it; deleting it is their call.
      const runs = data.campaign.runs || (data.campaign.runs = []);
      const at = runs.findIndex(r => r && r.id === run.id);
      const finished = Campaign.serialize(run);
      if (at >= 0) runs[at] = finished;
      else runs.unshift(finished);
      data.campaign.runs = runs.slice(0, Store.MAX_RUN_SLOTS);
    });
  }

  global.RedGPT.UI.Campaign = CampaignUI;
})(typeof window !== 'undefined' ? window : globalThis);
