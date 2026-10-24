const {JSDOM, VirtualConsole} = require('jsdom');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const MIME = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.json': 'application/json'};

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(ROOT, pathname === '/' ? 'index.html' : pathname);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end(); }
    res.setHeader('Content-Type', MIME[path.extname(file).toLowerCase()] || 'application/octet-stream');
    res.end(buf);
  });
});

const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e));
  vc.on('error', (...a) => errors.push(new Error(a.join(' '))));
  if (process.env.REDGPT_VERBOSE) {
    vc.on('jsdomError', e => console.log('JSDOM ERROR:', String(e.stack || e.message).split('\n').slice(0, 6).join(' | ')));
  }
  const dom = await JSDOM.fromURL(`http://127.0.0.1:${server.address().port}/index.html`, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
  });
  await new Promise(r => dom.window.addEventListener('load', () => setTimeout(r, 400)));
  const d = dom.window.document;
  const w = dom.window;
  const q = s => d.querySelector(s);

  const step = (name, fn) => {
    try { fn(); console.log('  ok  ' + name); }
    catch (e) { console.log('  FAIL ' + name + ': ' + e.message); errors.push(e); }
  };

  // Turn playback paces a turn over ~1-2s, which this click-through loop has no
  // reason to sit through. The animation path itself is covered separately.
  w.RedGPT.Store.update(data => { data.profile.settings.animations = false; });

  console.log('title screen');
  step('title screen active', () => { if (!q('#screen-title.active')) throw new Error('missing'); });
  step('enter arena button', () => { if (!q('#tEnterArena')) throw new Error('missing'); });

  q('#tEnterArena').click();
  await wait(150);
  console.log('arena');
  step('arena home rendered', () => { if (!d.body.textContent.includes('Random Battle')) throw new Error('no arena'); });
  step('nav rendered', () => { if (!q('[data-nav="campaign"]')) throw new Error('no nav'); });

  // Team builder
  q('[data-nav="teams"]').click();
  await wait(120);
  step('teams screen', () => { if (!q('#teamsNew')) throw new Error('missing'); });
  q('#teamsNew').click();
  await wait(200);
  step('builder opened', () => { if (!q('#tbAdd')) throw new Error('missing builder'); });
  q('#tbAdd').click();
  await wait(200);
  step('set editor', () => { if (!q('#fSpecies')) throw new Error('no editor'); });
  step('ev editor', () => { if (!q('[data-ev="atk"]')) throw new Error('no EV editor'); });
  q('[data-evpreset="0"]').click();
  await wait(150);
  step('ev preset applied', () => {
    const v = q('[data-evnum="atk"]').value;
    if (+v !== 252) throw new Error('atk EV = ' + v);
  });
  q('#tbSave').click();
  await wait(200);
  step('team saved', () => {
    const save = JSON.parse(w.localStorage.getItem('pokemon-redgpt-save-v3'));
    if (!save.arena.teams.length) throw new Error('no team stored');
  });
  q('#tbExport').click();
  await wait(150);
  step('export modal', () => { if (!q('#exportText')) throw new Error('no export'); });
  const exported = q('#exportText').value;
  q('#expClose').click();
  await wait(100);

  // Import round trip
  q('#tbImport').click();
  await wait(120);
  q('#importText').value = exported;
  q('#impCheck').click();
  await wait(120);
  step('import round-trip parses', () => {
    const text = q('#importReport').textContent;
    if (!/No parse errors/.test(text)) throw new Error(text.slice(0, 200));
  });
  q('#impReplace').click();
  await wait(200);
  q('#tbBack').click();
  await wait(200);

  // Random battle
  q('[data-nav="arena"]').click();
  await wait(150);
  q('[data-go="random"]').click();
  await wait(500);
  step('team preview or battle', () => {
    if (!d.body.textContent.includes('Team Preview') && !q('.battle-field')) throw new Error('battle did not start');
  });
  if (q('#btnStart')) { q('#btnStart').click(); await wait(400); }
  step('battle field rendered', () => { if (!q('.battle-field')) throw new Error('no field'); });
  step('move buttons', () => { if (!q('[data-move]')) throw new Error('no moves'); });

  // The in-battle stat breakdown: every modifier acting on a stat, not just
  // boost stages. The panel is collapsed by default and survives a card refresh.
  step('the stat panel opens and lists every stat', () => {
    // The foe's card renders first, so target the ally's toggle explicitly.
    const toggle = [...d.querySelectorAll('[data-statpanel]')].find(t => t.closest('.ally-info'));
    if (!toggle) throw new Error('no stat panel toggle on the ally mon card');
    if (q('.stat-panel')) throw new Error('the panel should start collapsed');
    toggle.click();
    const panel = [...d.querySelectorAll('.stat-panel')].find(p => p.closest('.ally-info'));
    if (!panel) throw new Error('the panel did not open');
    if (panel.querySelectorAll('.stat-row').length !== 5) {
      throw new Error(`expected five stat rows, saw ${panel.querySelectorAll('.stat-row').length}`);
    }
  });
  step('the stat panel survives a card refresh', () => {
    // refreshCard replaces the card innerHTML on every switch/faint/boost, so a
    // non-delegated handler or unremembered state would lose the panel here.
    // Each click replaces the card's innerHTML, so the button must be re-queried
    // exactly as a user re-clicks whatever is on screen. This exercises the
    // delegated handler and the remembered open state together: a handler bound
    // to the button itself would be gone after the first toggle.
    const allyToggle = () => [...d.querySelectorAll('[data-statpanel]')].find(t => t.closest('.ally-info'));
    const allyPanel = () => [...d.querySelectorAll('.stat-panel')].find(p => p.closest('.ally-info'));
    if (!allyPanel()) throw new Error('the panel was not open to begin with');
    allyToggle().click();
    if (allyPanel()) throw new Error('the panel did not close');
    allyToggle().click();
    if (!allyPanel()) throw new Error('the panel did not reopen after a re-render');
  });
  step('the opposing panel withholds a hidden ability or item', () => {
    const toggles = [...d.querySelectorAll('[data-statpanel]')];
    const foeToggle = toggles.find(t => !t.closest('.ally-info'));
    if (!foeToggle) throw new Error('no opposing stat panel');
    foeToggle.click();
    const foePanel = [...d.querySelectorAll('.stat-panel')].find(p => !p.closest('.ally-info'));
    if (!foePanel) throw new Error('the opposing panel did not open');
    if (!/only what is public|Current stat/.test(foePanel.textContent)) {
      throw new Error('no disclosure note on the opposing panel');
    }
  });

  // Turn playback: events emitted during choose() must be captured and replayed
  // onto the sprites. The click-through loop above runs with animations off, so
  // this exercises the path directly.
  await (async () => {
    const name = 'turn playback animates the sprites';
    let host = null;
    try {
      const R = w.RedGPT;
      const mk = (species, moves) => R.Pokemon.normalizeSet(
        {species, level: 50, moves, nature: 'serious', ivs: R.Pokemon.maxIVs()});
      const rules = Object.assign({}, R.Formats.get('anythinggoes').rules, {teamPreview: false});
      const battle = new R.Battle({
        format: Object.assign({}, R.Formats.get('anythinggoes'), {rules}), seed: 4242,
        sides: [
          {name: 'A', team: [mk('garchomp', ['earthquake']), mk('snorlax', ['tackle'])], controller: 'human'},
          {name: 'B', team: [mk('blissey', ['growl']), mk('snorlax', ['tackle'])], controller: 'human'},
        ],
      });
      battle.start();

      // Detached from the app's tree so its controls can never be found by the
      // click-through loops elsewhere in this file.
      host = d.createElement('div');
      host.id = 'playbackHost';
      d.body.appendChild(host);
      const view = new R.UI.BattleView(host, {battle, controlSides: [0, 1]});
      view.animationsOn = () => true;             // force the animated path
      view.render();

      const before = battle.events.length;
      view.animQueue = [];
      view.capturing = true;
      battle.choose(0, {type: 'move', index: 0});
      battle.choose(1, {type: 'move', index: 0});
      view.capturing = false;
      if (!view.animQueue.length) throw new Error('no events captured for playback');
      if (battle.events.length <= before) throw new Error('the turn produced no events');

      const kinds = new Set(view.animQueue.map(q => q.event.type));
      if (!kinds.has('move')) throw new Error('no move event captured');

      // Playback should reveal the log progressively and end with a full render.
      const playing = view.playTurn();
      if (!view.animating) throw new Error('playback did not start');
      const controls = host.querySelector('.battle-controls');
      if (!controls) throw new Error('no controls rendered in the playback host');
      if (!controls.classList.contains('is-busy')) throw new Error('controls were not disabled during playback');
      await playing;
      if (view.animating) throw new Error('playback never finished');
      if (view.logLimit !== null) throw new Error('log limit was not cleared');
      if (view.animQueue.length) throw new Error('queue was not drained');

      // Sprites must carry the hooks playback relies on.
      const sprite = host.querySelector('.mon-sprite');
      if (!sprite || !sprite.dataset.uid || sprite.dataset.side === undefined) {
        throw new Error('sprites are missing data-uid/data-side');
      }
      console.log('  ok  ' + name);
    } catch (e) {
      console.log('  FAIL ' + name + ': ' + e.message);
      errors.push(e);
    } finally {
      if (host) host.remove();
    }
  })();

  // A battle that ends mid-playback must not re-show its end screen after the
  // player has acted on it — that used to wipe the campaign reward screen and
  // ask for the reward again.
  await (async () => {
    const name = 'end screen does not return after an end action';
    let host = null;
    try {
      const R = w.RedGPT;
      const mk = (species, moves, level) => R.Pokemon.normalizeSet(
        {species, level, moves, nature: 'serious', ivs: R.Pokemon.maxIVs()});
      const rules = Object.assign({}, R.Formats.get('anythinggoes').rules,
        {teamPreview: false, forceLevel: null, maxLevel: 100});
      const battle = new R.Battle({
        format: Object.assign({}, R.Formats.get('anythinggoes'), {rules}), seed: 11,
        sides: [
          {name: 'T', team: [mk('mewtwo', ['psystrike'], 100)], controller: 'human'},
          {name: 'F', team: [mk('magikarp', ['splash'], 5)], controller: 'human'},
        ],
      });
      battle.start();
      host = d.createElement('div');
      d.body.appendChild(host);
      const view = new R.UI.BattleView(host, {battle, controlSides: [0, 1]});
      view.animationsOn = () => true;          // force the playback path
      let claims = 0;
      view.onFinish = () => [{
        label: 'Claim rewards', primary: true,
        onClick: () => { claims++; host.innerHTML = '<div id="rewardStandIn"></div>'; },
      }];
      view.render();
      view.submit(0, {type: 'move', index: 0});
      battle.choose(1, {type: 'move', index: 0});

      let clicked = false;
      for (let i = 0; i < 25; i++) {
        await wait(120);
        const button = host.querySelector('[data-end]');
        if (button && !clicked) { button.click(); clicked = true; }
      }
      if (!clicked) throw new Error('the end screen never appeared');
      if (claims !== 1) throw new Error(`the end action fired ${claims} times`);
      if (host.querySelector('[data-end]')) throw new Error('the end screen came back after being dismissed');
      if (!host.querySelector('#rewardStandIn')) throw new Error('the follow-on screen was overwritten');
      if (!view.detached) throw new Error('the view did not release the root');
      console.log('  ok  ' + name);
    } catch (e) {
      console.log('  FAIL ' + name + ': ' + e.message);
      errors.push(e);
    } finally {
      if (host) host.remove();
    }
  })();

  /*
   * `UI.$` returns ONE element; `UI.$$` returns a list. Mixing them up is
   * invisible until someone clicks the thing whose handler never got bound —
   * `UI.$(sel).forEach is not a function` throws inside a render, the screen
   * silently fails to update, and the button "does nothing". That shipped twice
   * in one session (both times a scripted edit ate a `$`), and the second one
   * was only found because a player reported that a move could not be clicked.
   *
   * A static scan is the right shape here: the failure is per-code-path, so
   * exercising it would need every screen driven, while the mistake is trivially
   * visible in the source.
   */
  step('no single-element UI.$ is treated as a list', () => {
    const offenders = [];
    const uiDir = path.join(ROOT, 'src/ui');
    for (const file of fs.readdirSync(uiDir).filter(f => f.endsWith('.js'))) {
      const source = fs.readFileSync(path.join(uiDir, file), 'utf8');
      source.split(/\r?\n/).forEach((line, index) => {
        /*
         * A `$(...)` followed by a list method. The lookbehind is load-bearing:
         * without it the pattern matches the *second* dollar of `$$(...)`, so it
         * flagged every correct call in the codebase and failed on clean source.
         */
        if (/(?<!\$)\$\([^)]*\)\s*\.\s*(forEach|map|filter|some|every|reduce)\b/.test(line)) {
          offenders.push(`${file}:${index + 1}  ${line.trim().slice(0, 90)}`);
        }
      });
    }
    if (offenders.length) {
      throw new Error(`UI.$ returns one element — use UI.$$ for a list:\n  ${offenders.join('\n  ')}`);
    }
  });

  /*
   * Hovering a move in a learn/TM/tutor prompt shows the stats the inline
   * summary has no room for — PP, priority, the full description and the flags
   * abilities and items key off. Choosing which move to forget was the Campaign
   * decision made with the least information.
   *
   * jsdom reports every rectangle as zero, so the *placement* logic cannot be
   * checked here (that was verified against a real viewport at five extremes).
   * What is checked is the part that would silently rot: that the wiring exists,
   * that hover and focus both open it, that it closes again, and that the card
   * carries the fields the inline summary lacks.
   */
  step('hovering a move shows a card with the stats the summary omits', () => {
    const R = w.RedGPT;
    const host = d.createElement('div');
    /*
     * Sucker Punch, not Focus Punch. The card only renders a Priority row for a
     * move that *has* priority, and Focus Punch's -3 was removed on 2026-08-14 —
     * so the fixture stopped exercising the row it exists to check. Sucker Punch
     * keeps +1 and is unconditional here, so it cannot lose it quietly.
     */
    host.innerHTML = '<button data-movetip="suckerpunch">Sucker Punch</button>';
    d.body.appendChild(host);
    R.UI.attachMoveTips(host);
    const button = host.querySelector('[data-movetip]');

    button.dispatchEvent(new w.MouseEvent('mouseenter'));
    const tip = d.getElementById('moveTip');
    if (!tip) throw new Error('no tooltip element was created');
    if (tip.hidden) throw new Error('hovering did not show the card');
    const text = tip.textContent.replace(/\s+/g, ' ');
    for (const want of ['Sucker Punch', 'PP', 'Priority']) {
      if (!text.includes(want)) throw new Error(`card is missing ${want}: ${text.slice(0, 120)}`);
    }
    // The full description, not the one-liner the button already showed.
    if (text.length < 80) throw new Error(`card looks like a summary, not a description: ${text}`);

    button.dispatchEvent(new w.MouseEvent('mouseleave'));
    if (!tip.hidden) throw new Error('leaving did not hide the card');

    // Keyboard users get it too — these are buttons and already tab targets.
    button.dispatchEvent(new w.FocusEvent('focus'));
    if (tip.hidden) throw new Error('focusing did not show the card');
    button.dispatchEvent(new w.FocusEvent('blur'));
    if (!tip.hidden) throw new Error('blurring did not hide the card');
    host.remove();
  });

  /*
   * The opening leads must be announced, not just later switch-ins.
   *
   * `battle.start()` emits its switch events before the view exists, and
   * playback only ever replays what a `choose()` produced — so the leads shipped
   * silent while every subsequent switch cried. Reported from real play.
   *
   * Asserted through `lastCriedUid` rather than through audio, because jsdom
   * cannot play anything: `canPlayCries()` is false there, which is exactly the
   * feature detection that keeps this suite's zero-console-error guarantee. The
   * bookkeeping still runs, and it is what proves the hook fired.
   */
  step('both leads are announced when the field first appears', () => {
    const R = w.RedGPT;
    const set = species => R.Pokemon.normalizeSet({species, level: 50, moves: ['tackle'], nature: 'serious'});
    const rules = Object.assign({}, R.Formats.get('anythinggoes').rules, {teamPreview: false});
    const battle = new R.Battle({
      format: Object.assign({}, R.Formats.get('anythinggoes'), {rules}), seed: 21,
      sides: [
        {name: 'A', team: [set('snorlax'), set('pikachu')], controller: 'human'},
        {name: 'B', team: [set('garchomp'), set('gengar')], controller: 'human'},
      ],
    });
    battle.start();
    const host = d.createElement('div');
    d.body.appendChild(host);
    const view = new R.UI.BattleView(host, {battle, controlSides: [0]});

    if (typeof view.cryForArrivals !== 'function') throw new Error('cryForArrivals is missing');
    if (view.lastCriedUid[0] !== null || view.lastCriedUid[1] !== null) {
      throw new Error('nothing should be announced before the first render');
    }
    view.render();
    const announced = view.lastCriedUid.slice();
    if (announced[0] == null || announced[1] == null) {
      throw new Error(`both leads should be announced, got ${JSON.stringify(announced)}`);
    }
    if (announced[0] !== battle.active(0).uid || announced[1] !== battle.active(1).uid) {
      throw new Error('announced the wrong Pokémon');
    }
    // A plain re-render is not a new arrival and must stay quiet.
    view.render();
    if (view.lastCriedUid[0] !== announced[0] || view.lastCriedUid[1] !== announced[1]) {
      throw new Error('a re-render re-announced the same Pokémon');
    }
    host.remove();
  });

  // Every field effect and hazard the engine can produce must render a chip
  // with a glyph — a new effect without an icon has to fail here.
  step('every field effect and hazard renders a glyph', () => {
    const R = w.RedGPT;
    const C = R.BattleConstants;
    const mk = () => {
      const s = R.Pokemon.normalizeSet({species: 'snorlax', level: 50, moves: ['tackle'], nature: 'serious', ivs: R.Pokemon.maxIVs()});
      const rules = Object.assign({}, R.Formats.get('anythinggoes').rules, {teamPreview: false});
      const b = new R.Battle({
        format: Object.assign({}, R.Formats.get('anythinggoes'), {rules}), seed: 5,
        sides: [{name: 'A', team: [s], controller: 'human'}, {name: 'B', team: [s], controller: 'human'}],
      });
      b.start();
      return b;
    };
    const host = d.createElement('div');
    d.body.appendChild(host);
    const missing = [];
    const check = (label, mutate) => {
      const battle = mk();
      mutate(battle);
      const bv = new R.UI.BattleView(host, {battle, controlSides: [0]});
      const view = battle.view(0);
      host.innerHTML = bv.renderFieldConditions(view, view.sides[0], view.sides[1]);
      const chip = host.querySelector('.cond-chip');
      if (!chip) return missing.push(`${label}: no chip rendered`);
      const svg = chip.querySelector('svg.cond-icon');
      if (!svg || !svg.querySelectorAll('path, circle').length) missing.push(`${label}: chip has no glyph`);
    };
    for (const key of Object.keys(C.WEATHER_LABELS)) check(`weather ${key}`, b => { b.field.weather = key; b.field.weatherTurns = 5; });
    for (const key of Object.keys(C.TERRAIN_LABELS)) check(`terrain ${key}`, b => { b.field.terrain = key; b.field.terrainTurns = 5; });
    for (const key of Object.keys(mk().field.pseudoWeather)) check(`pseudo ${key}`, b => { b.field.pseudoWeather[key] = 5; });
    const sideValues = {
      stealthrock: 1, spikes: 1, toxicspikes: 1, stickyweb: 1, reflect: 5, lightscreen: 5,
      auroraveil: 5, safeguard: 5, mist: 5, tailwind: 4, healingwish: true, lunardance: true,
      futureSight: {turns: 2, attackerUid: 'x', side: 0, moveId: 'futuresight', level: 50, spa: 100},
    };
    for (const [key, value] of Object.entries(sideValues)) check(`side ${key}`, b => { b.sides[0].conditions[key] = value; });
    host.remove();
    if (missing.length) throw new Error(missing.join('; '));
  });

  // Play out the battle
  let turns = 0;
  while (!q('#endActions') && turns++ < 500) {
    const move = d.querySelector('[data-move]:not([disabled])');
    const sw = d.querySelector('[data-switch]:not([disabled])');
    if (move) move.click();
    else if (sw) sw.click();
    else break;
    await wait(3);
  }
  step('battle finished', () => { if (!q('#endActions')) throw new Error('battle did not finish after ' + turns + ' actions'); });
  step('end actions present', () => { if (d.querySelectorAll('[data-end]').length < 3) throw new Error('missing end buttons'); });
  d.querySelectorAll('[data-end]')[0].click(); // save replay
  await wait(150);
  step('replay stored', () => {
    const save = JSON.parse(w.localStorage.getItem('pokemon-redgpt-save-v3'));
    if (!save.arena.replays.length) throw new Error('no replay');
  });
  d.querySelectorAll('[data-end]')[2].click(); // return
  await wait(200);

  // Replays page
  q('[data-go="replays"]').click();
  await wait(200);
  step('replay list', () => { if (!q('[data-watch]')) throw new Error('no replay entry'); });
  q('[data-watch]').click();
  await wait(400);
  step('replay plays', () => { if (!q('#replayLog')) throw new Error('no replay log'); });
  q('#rwBack').click();
  await wait(150);

  // Pokedex
  // Damage calculator
  q('[data-nav="calc"]').click();
  await wait(400);
  step('calculator renders both sides and the field', () => {
    if (!q('.calc-grid')) throw new Error('no calculator layout');
    if (!q('#calcAttacker') || !q('#calcDefender')) throw new Error('missing a side');
    if (!q('#calcWeather') || !q('#calcTerrain')) throw new Error('no field controls');
  });
  step('calculator produces damage for the default matchup', () => {
    const rows = d.querySelectorAll('.calc-result');
    if (!rows.length) throw new Error('no results');
    const text = [...rows].map(r => r.textContent).join(' ');
    if (!/%/.test(text)) throw new Error('no damage percentages: ' + text.slice(0, 120));
  });
  step('calculator reacts to a field change', () => {
    const before = d.querySelector('.calc-result').textContent.replace(/\s+/g, ' ');
    // Screens are per side now that the calculator runs both directions, so
    // this is the defending Pokémon's own Reflect rather than a global one.
    const reflect = q('[data-screen="defender:reflect"]');
    reflect.checked = true;
    reflect.dispatchEvent(new w.Event('change'));
    const after = d.querySelector('.calc-result').textContent.replace(/\s+/g, ' ');
    if (before === after) throw new Error('Reflect did not change the damage readout');
    reflect.checked = false;
    reflect.dispatchEvent(new w.Event('change'));
  });
  step('the calculator shows damage in both directions', () => {
    /*
     * Both Pokémon carry their own moves and each attacks the other, the way
     * Showdown's calculator does it. Before this only the left panel could
     * attack, so "and what does it do back?" meant swapping sides and losing
     * the first answer.
     */
    const forward = d.querySelector('.calc-results:not(.calc-results-reverse)');
    const reverse = d.querySelector('.calc-results-reverse');
    if (!forward) throw new Error('no forward damage block');
    if (!reverse) throw new Error('no reverse damage block — the calculator is still one-way');
    if (!/%/.test(reverse.textContent)) {
      throw new Error('the reverse direction produced no damage: ' + reverse.textContent.slice(0, 120));
    }
    // Both panels must offer moves, or the reverse block has nothing to compute.
    for (const side of ['attacker', 'defender']) {
      if (!d.querySelector(`[data-move^="${side}:"]`)) throw new Error(`no move slots on the ${side} panel`);
    }
    /*
     * Screens are per side. Pokémon 2's Reflect must blunt what Pokémon 1
     * throws at it and leave Pokémon 2's own attack alone — a single global
     * set would follow the role and do the opposite.
     */
    const fire = (el, ev) => el.dispatchEvent(new w.Event(ev, {bubbles: true}));
    const read = sel => d.querySelector(sel).textContent.replace(/\s+/g, ' ');
    const fwdBefore = read('.calc-results:not(.calc-results-reverse)');
    const revBefore = read('.calc-results-reverse');
    const box = q('[data-screen="defender:reflect"]');
    box.checked = true; fire(box, 'change');
    if (read('.calc-results:not(.calc-results-reverse)') === fwdBefore) {
      throw new Error("the defender's Reflect did not blunt the attacker's damage");
    }
    if (read('.calc-results-reverse') !== revBefore) {
      throw new Error("the defender's own Reflect must not change what the defender deals");
    }
    box.checked = false; fire(box, 'change');
  });
  step('the calculator turn-state controls are wired to the readout', () => {
    /*
     * The engine half is pinned in `engine-battle.js`; this is the wiring the
     * engine tests structurally cannot see — that the two controls reach
     * `Calculator` at all. Both were added after the damage calculator was
     * found unable to express turn order, which made a tiering evidence packet
     * print identical numbers for "moving first" and "moving second".
     *
     * The move is set through the calculator's own state rather than through
     * the move picker, which only commits on a dropdown selection. The default
     * matchup carries no turn-state-dependent move, so without this the check
     * would compare two identical numbers and pass while proving nothing.
     */
    const RedGPT = w.RedGPT;
    const calcState = RedGPT.UI.Calc.state;
    if (!calcState || !calcState.attacker) throw new Error('CalcUI.state is not reachable');

    calcState.attacker.set = RedGPT.Pokemon.normalizeSet({
      species: 'Tyranitar', level: 100, nature: 'adamant', ability: 'Sand Stream',
      evs: {atk: 252}, ivs: RedGPT.Pokemon.maxIVs(), moves: ['payback', 'assurance'],
    });
    // Re-render through the nav rather than calling `render` directly, which
    // needs the App instance the test does not hold. The handler is synchronous.
    q('[data-nav="calc"]').click();

    const readout = () => [...d.querySelectorAll('.calc-result')].map(r => r.textContent.replace(/\s+/g, ' ')).join(' | ');
    const fire = (el, ev) => el.dispatchEvent(new w.Event(ev, {bubbles: true}));

    // Payback: doubles against a target that HAS already moved.
    const hasMoved = q('[data-hasmoved="defender"]');
    if (!hasMoved) throw new Error('no has-moved control on the defender panel');
    // Both panels carry it now that both Pokémon attack: when Pokémon 2 is the
    // one attacking, it is Pokémon 1's flag that Fishious Rend reads.
    if (!q('[data-hasmoved="attacker"]')) throw new Error('the has-moved control belongs on both panels');
    const beforeMoved = readout();
    hasMoved.checked = true; fire(hasMoved, 'change');
    const afterMoved = readout();
    if (beforeMoved === afterMoved) throw new Error('the has-moved control did not change the readout');
    hasMoved.checked = false; fire(hasMoved, 'change');

    // Assurance: doubles against a target that has already been damaged.
    const tookDmg = q('[data-tookdmg="defender"]');
    if (!tookDmg) throw new Error('no damage-taken control on the defender panel');
    if (!q('[data-tookdmg="attacker"]')) throw new Error('the damage-taken control belongs on both panels');
    const beforeDmg = readout();
    tookDmg.value = '40'; fire(tookDmg, 'change');
    const afterDmg = readout();
    if (beforeDmg === afterDmg) throw new Error('the damage-taken control did not change the readout');
    tookDmg.value = '0'; fire(tookDmg, 'change');
    if (readout() !== beforeDmg) throw new Error('setting the damage back to 0 did not restore the readout');
  });

  q('[data-nav="dex"]').click();
  await wait(300);
  step('dex list', () => { if (!q('[data-dex]')) throw new Error('no dex rows'); });
  q('#dexQuery').value = 'garchomp';
  q('#dexQuery').dispatchEvent(new w.Event('input'));
  await wait(200);
  step('dex search', () => {
    const first = q('[data-dex]');
    if (!first || !/Garchomp/i.test(first.textContent)) throw new Error('search failed: ' + (first ? first.textContent.slice(0, 40) : 'none'));
  });
  q('[data-dex]').click();
  await wait(200);
  step('dex detail', () => {
    if (d.querySelectorAll('.stat-line').length < 6) throw new Error('no stat block in the dex detail');
    if (!/Species base stats/.test(d.body.textContent)) throw new Error('no base-stat caption');
  });
  step('the dex stat toggle switches to raw stats at a level', () => {
    const before = [...d.querySelectorAll('.stat-line')].map(l => l.textContent.trim());
    const toggle = d.querySelector('[data-statmode="level"]');
    if (!toggle) throw new Error('no level toggle in the dex');
    toggle.click();
    const after = [...d.querySelectorAll('.stat-line')].map(l => l.textContent.trim());
    if (before.join('|') === after.join('|')) throw new Error('the numbers did not change');
    if (!/At level \d+/.test(d.body.textContent)) throw new Error('no level caption');
    // ...and back, so the rest of this walkthrough sees the default.
    d.querySelector('[data-statmode="base"]').click();
  });
  step('dex ability and move details open', () => {
    const ability = q('[data-ability]');
    if (!ability) throw new Error('abilities are not clickable');
    ability.click();
    if (!q('#modalBody').textContent.trim()) throw new Error('ability modal empty');
    q('#modalClose').click();
    const move = q('[data-move]');
    if (!move) throw new Error('moves are not clickable');
    move.click();
    if (!/BP/.test(q('#modalBody').textContent)) throw new Error('move modal missing data');
    q('#modalClose').click();
  });
  await wait(120);

  // Local versus: verify the hidden-choice handoff actually works.
  q('[data-nav="arena"]').click();
  await wait(200);
  q('[data-go="versus"]').click();
  await wait(250);
  q('#bsTeam2').value = '__random';
  q('#bsStart').click();
  await wait(600);
  step('local versus starts and hides the second choice', () => {
    if (!d.body.textContent.includes('Team Preview')) throw new Error('versus did not start');
  });
  if (q('#btnStart')) { q('#btnStart').click(); await wait(250); }
  step('local versus hands off between players', () => {
    if (!/Pass the device|Team Preview/.test(d.body.textContent)) {
      throw new Error('no handoff gate: ' + d.body.textContent.slice(0, 120));
    }
  });
  let versusGuard = 0;
  while (!q('#endActions') && versusGuard++ < 900) {
    if (q('#btnReady')) { q('#btnReady').click(); await wait(5); continue; }
    if (q('#btnStart')) { q('#btnStart').click(); await wait(30); continue; }
    const move = d.querySelector('[data-move]:not([disabled])');
    const sw = d.querySelector('[data-switch]:not([disabled])');
    if (move) move.click(); else if (sw) sw.click(); else break;
    await wait(3);
  }
  step('local versus plays to a result', () => {
    if (!q('#endActions')) throw new Error('versus battle did not finish after ' + versusGuard + ' actions: ' + d.body.textContent.slice(0, 200));
  });
  const versusEnd = d.querySelectorAll('[data-end]');
  if (versusEnd.length) versusEnd[versusEnd.length - 1].click();
  await wait(250);

  // Records
  q('[data-nav="records"]').click();
  await wait(200);
  step('records screen', () => {
    if (!/Simulation coverage/.test(d.body.textContent)) throw new Error('no coverage panel');
    if (!q('#recCoverage')) throw new Error('no coverage detail button');
  });
  q('#recCoverage').click();
  await wait(150);
  step('coverage detail lists what is not simulated', () => {
    if (!/Not simulated/.test(d.body.textContent)) throw new Error('no unsimulated list');
    q('#modalClose').click();
  });
  await wait(100);

  // Battle setup screens
  q('[data-nav="arena"]').click();
  await wait(200);
  q('[data-go="ai"]').click();
  await wait(200);
  step('vs AI setup offers formats and difficulties', () => {
    if (!q('#bsFormat') || !q('#bsDifficulty') || !q('#bsSeed')) throw new Error('setup incomplete');
    if (!q('#bsValidation').textContent.trim()) throw new Error('no live validation');
    q('#bsCancel').click();
  });
  await wait(100);
  q('[data-go="custom"]').click();
  await wait(200);
  step('custom battle exposes the rule switches', () => {
    for (const id of ['#cgLevel', '#cgTeamSize', '#cgBring', '#cgSpecies', '#cgItem', '#cgSleep', '#cgRestricted', '#cgBattleOnly', '#cgTera', '#cgPreview']) {
      if (!q(id)) throw new Error('missing ' + id);
    }
    q('#bsCancel').click();
  });
  await wait(100);
  q('[data-go="versus"]').click();
  await wait(200);
  step('local versus asks for two teams', () => {
    if (!q('#bsTeam') || !q('#bsTeam2')) throw new Error('missing team pickers');
    q('#bsCancel').click();
  });
  await wait(100);

  // Campaign
  q('[data-nav="campaign"]').click();
  await wait(200);
  step('campaign home', () => { if (!q('#btnNewRun')) throw new Error('no new run'); });
  q('#btnNewRun').click();
  await wait(200);
  step('run setup modal', () => { if (!q('#runStart')) throw new Error('no setup'); });
  q('#runSeed').value = 'REDGPT-A1B2C3';
  q('#runStart').click();
  await wait(400);
  step('draft shown', () => { if (!q('[data-draft]')) throw new Error('no draft'); });
  q('[data-draft="0"]').click();
  await wait(300);
  step('map shown', () => { if (!q('[data-node]')) throw new Error('no map'); });
  step('run autosaved', () => {
    const save = JSON.parse(w.localStorage.getItem('pokemon-redgpt-save-v3'));
    const slot = (save.campaign.runs || [])[0];
    if (!slot) throw new Error('run not saved');
    if (slot.party.length !== 1) throw new Error('party not saved');
  });
  // Assist Mode: turn recommendations on for the whole click-through, so every
  // prompt type below renders its badge path at least once. Auto-battle is left
  // off here because this loop drives the battles itself; its controls are
  // asserted separately.
  step('Assist Mode toggles are offered', () => {
    if (!q('#assistRecommend') || !q('#assistAuto')) throw new Error('no Assist Mode panel');
  });
  q('#assistRecommend').checked = true;
  q('#assistRecommend').dispatchEvent(new w.Event('change'));
  await wait(200);
  step('recommendations stay on once enabled', () => {
    const save = JSON.parse(w.localStorage.getItem('pokemon-redgpt-save-v3'));
    if (!(save.campaign.runs || [])[0].assist.recommend) throw new Error('assist flag not persisted');
  });

  // The Pokémon menu: nature, current stats *and* species base stats, plus a
  // toggle for any forme this Pokémon could actually reach as equipped.
  {
    const runNow = JSON.parse(w.localStorage.getItem('pokemon-redgpt-save-v3')).campaign.runs[0];
    const member = runNow.party[0];
    q(`[data-member="${member.uid}"]`)?.click();
    await wait(200);
    step('the Pokemon menu shows raw stats, and the nature exactly once', () => {
      const lines = d.querySelectorAll('.stat-line');
      if (lines.length < 6) throw new Error(`expected six stat lines, saw ${lines.length}`);
      const shown = [...lines].map(l => l.textContent.replace(/\s+/g, ' '));
      const live = w.RedGPT.Campaign.memberStats(
        w.RedGPT.Campaign.deserialize(JSON.parse(w.localStorage.getItem('pokemon-redgpt-save-v3')).campaign.runs[0]),
        member);
      for (const stat of w.RedGPT.Dex.STATS) {
        if (!shown.some(line => line.includes(String(live[stat])))) throw new Error(`current ${stat} (${live[stat]}) not shown`);
      }
      // The nature belongs beside the name, not repeated by the stat block. It
      // is still readable per-stat from the raised/lowered markers.
      const natureMentions = (d.body.textContent.match(/\(\+[A-Za-z]{2,3} −[A-Za-z]{2,3}\)|\(neutral\)/g) || []).length;
      if (natureMentions !== 1) throw new Error(`nature shown ${natureMentions} times, expected once`);
    });
    const baseButton = d.querySelector('[data-statmode="base"]');
    step('the stat block offers a base-stat toggle', () => {
      if (!baseButton) throw new Error('no base-stat toggle');
    });
    baseButton.click();
    await wait(250);
    step('the toggle switches the column to species base stats', () => {
      const species = w.RedGPT.Dex.species(member.set.species);
      const shown = [...d.querySelectorAll('.stat-line')].map(l => l.textContent.replace(/\s+/g, ' '));
      if (shown.length < 6) throw new Error('stat lines vanished after toggling');
      for (const stat of w.RedGPT.Dex.STATS) {
        const want = String(species.baseStats[stat]);
        if (!shown.some(line => line.trim().endsWith(want))) throw new Error(`base ${stat} (${want}) not shown after toggle`);
      }
    });
    step('the forme toggle lists every forme in the family', () => {
      // All formes are browsable, reachable or not — the unreachable ones are
      // marked rather than hidden, so a player can compare spreads before
      // committing to an item or an ability.
      const all = w.RedGPT.Mechanics.speciesFormes(member.set);
      const buttons = d.querySelectorAll('.forme-toggle [data-forme]');
      if (all.length && buttons.length !== all.length + 1) {
        throw new Error(`${all.length} formes in the family but ${buttons.length} buttons`);
      }
      if (!all.length && buttons.length) throw new Error('forme toggle shown with nothing to toggle to');
      const marked = d.querySelectorAll('.forme-toggle [data-forme].unavailable').length;
      const expected = all.filter(f => !f.available).length;
      if (marked !== expected) throw new Error(`${expected} unreachable formes but ${marked} marked`);
    });
    q('#mdClose')?.click();
    await wait(150);
  }

  const selectable = d.querySelector('.map-node.selectable');
  step('selectable node', () => { if (!selectable) throw new Error('no selectable node'); });
  selectable.click();
  await wait(400);
  step('node entered', () => {
    if (!q('.battle-field') && !q('.prompt-card') && !d.body.textContent.includes('Team Preview')) {
      throw new Error('node did not open: ' + d.body.textContent.slice(0, 120));
    }
  });

  // Play the Campaign forward through several nodes, resolving whatever the
  // run asks for: battles, rewards, recruitment, shops, rest sites and events.
  const seen = new Set();
  let nodesEntered = 0;
  let campaignGuard = 0;

  /*
   * Assist Mode unlock coverage — the Tacticians and Paragons unlocks both
   * require `run.stats.assistOnly`, which `resolveBattle` clears unless the
   * caller reports `automated: true`. That field was written by nothing, so the
   * flag died on the first battle of every run and neither unlock was
   * reachable. It can only be tested from here: the flag is decided at the
   * `Campaign.resolveBattle` call in `campaign-ui.js`, reading the view's
   * `playerActedManually`, so an engine-level test of `resolveBattle` would
   * pass with the bug fully present.
   *
   * The first battle is therefore played with *nothing* touched by hand — the
   * AI picks the lead too, since confirming the lead yourself counts as acting
   * — and the rest of the loop plays by hand as before. Both directions are
   * asserted, so hardcoding `automated: true` fails just as the bug did.
   */
  const assistOnlyFlag = () => {
    const save = JSON.parse(w.localStorage.getItem('pokemon-redgpt-save-v3'));
    const run = (save.campaign.runs || [])[0];
    return run ? !!run.stats.assistOnly : null;
  };
  let autoPhase = true;              // play the first battle entirely on Assist
  let lastBattleWasAuto = null;
  let assistOnlyAfterAuto = null;
  let assistOnlyAfterManual = null;

  while (campaignGuard++ < 900) {
    if (q('#introGo')) { seen.add('boss-intro'); q('#introGo').click(); await wait(120); continue; }
    if (q('#btnStart')) {
      seen.add('team-preview');
      if (q('#btnPreviewAuto')) seen.add('assist-preview-button');
      // Confirming the lead by hand is a manual action, so the auto-only
      // battle has to hand over from Team Preview rather than press Start.
      if (autoPhase && q('#btnPreviewAuto')) {
        seen.add('assist-preview-handover');
        // Marked here, not in the `.battle-field` branch: with animations off
        // the auto-battler plays the whole battle inside the wait below, so the
        // loop's next look is already at the end screen.
        lastBattleWasAuto = true;
        q('#btnPreviewAuto').click(); await wait(120); continue;
      }
      q('#btnStart').click(); await wait(120); continue;
    }
    if (q('#endActions')) {
      seen.add('battle-result');
      d.querySelector('[data-end]').click();
      await wait(200);
      // `resolveBattle` has run and the run is persisted, so this is the only
      // moment the flag can be read for the battle that just ended.
      if (lastBattleWasAuto === true && assistOnlyAfterAuto === null) assistOnlyAfterAuto = assistOnlyFlag();
      if (lastBattleWasAuto === false && assistOnlyAfterManual === null) assistOnlyAfterManual = assistOnlyFlag();
      lastBattleWasAuto = null;
      autoPhase = false;
      continue;
    }
    if (q('.battle-field')) {
      seen.add('battle');
      if (q('#btnAutoBattle')) seen.add('assist-battle-button');
      /*
       * The battle log reads newest-turn-first and starts collapsed, so the
       * player never scrolls to follow the fight. Recorded here rather than in a
       * separate test because this is the only place a live battle panel exists,
       * and the layout is otherwise unverifiable — the preview pane cannot be
       * screenshotted (§8), so the DOM is the only check there is.
       */
      const logNode = q('#battleLog');
      const logToggle = q('#btnLogToggle');
      if (logNode && logToggle) {
        seen.add('battle-log-toggle');
        if (logNode.classList.contains('compact')) seen.add('battle-log-collapsed-by-default');
        const before = logNode.querySelectorAll('.ln, .turn-sep').length;
        logToggle.click();
        const after = logNode.querySelectorAll('.ln, .turn-sep').length;
        if (after > before) seen.add('battle-log-expands');
        // Turn separators must descend: newest first.
        const turns = [...logNode.querySelectorAll('.turn-sep')]
          .map(e => Number(e.textContent.replace(/\D+/g, '')));
        if (turns.length > 1) {
          seen.add('battle-log-multiturn');
          if (turns.every((n, i) => i === 0 || turns[i - 1] > n)) seen.add('battle-log-newest-first');
        }
        logToggle.click();          // back to collapsed, so the loop is unaffected
      }
      if (autoPhase) {
        // Arm Assist once, then let it drive: it re-arms itself after each
        // choice, so the loop only has to wait for the end screen.
        const auto = q('#btnAutoBattle');
        if (auto && !auto.classList.contains('primary')) { seen.add('assist-battle-handover'); auto.click(); }
        lastBattleWasAuto = true;
        await wait(40);
        continue;
      }
      const move = d.querySelector('[data-move]:not([disabled])');
      const sw = d.querySelector('[data-switch]:not([disabled])');
      if (move) move.click(); else if (sw) sw.click(); else break;
      lastBattleWasAuto = false;
      await wait(3);
      continue;
    }
    if (q('[data-reward]')) {
      seen.add('reward');
      if (q('.choice-btn.suggested') && q('.assist-badge')) seen.add('assist-recommendation');
      q('[data-reward]').click(); await wait(120); continue;
    }
    if (q('[data-rec]')) { seen.add('recruit'); q('[data-rec]').click(); await wait(120); continue; }
    if (q('#shopLeave')) {
      seen.add('shop');
      const buy = d.querySelector('[data-buy]:not([disabled])');
      if (buy) { seen.add('shop-purchase'); buy.click(); await wait(100); continue; }
      q('#shopLeave').click(); await wait(120); continue;
    }
    if (q('[data-opt]')) { seen.add('service'); q('[data-opt]').click(); await wait(120); continue; }
    if (q('[data-choice]:not([disabled])')) { seen.add('event'); d.querySelector('[data-choice]:not([disabled])').click(); await wait(120); continue; }
    if (q('#msgOk')) { q('#msgOk').click(); await wait(100); continue; }
    if (q('[data-forget]')) { seen.add('movelearn'); q('[data-forget]').click(); await wait(100); continue; }
    if (q('#tmSkip')) { seen.add('tm'); q('#tmSkip').click(); await wait(100); continue; }
    if (q('#tuSkip')) { q('#tuSkip').click(); await wait(100); continue; }
    if (q('#itemsDone')) { seen.add('items'); q('#itemsDone').click(); await wait(100); continue; }
    if (q('#resNew') || q('#resHome')) { seen.add('run-result'); break; }
    if (q('.map-node.selectable')) {
      seen.add('map');
      nodesEntered++;
      // Stop once the loop has demonstrated the whole cycle a few times over.
      // `battle` is required as well as `battle-result`: the Assist-played
      // first battle resolves without the loop ever seeing the battle panel,
      // so stopping on `battle-result` alone would skip every check that reads
      // live battle DOM.
      if (nodesEntered > 5 && seen.has('battle') && seen.has('battle-result') && seen.has('reward')) break;
      d.querySelector('.map-node.selectable').click();
      await wait(180);
      continue;
    }
    if (q('[data-pick]')) { d.querySelector('[data-pick]').click(); await wait(100); continue; }
    break;
  }
  step('campaign battle played through the shared engine', () => {
    if (!seen.has('battle')) throw new Error('never reached a Campaign battle');
    if (!seen.has('battle-result')) throw new Error('battle never resolved');
  });
  step('campaign rewards applied', () => {
    if (!seen.has('reward') && !seen.has('recruit')) throw new Error('no reward step reached');
  });
  step('the battle log is collapsed, newest-first, and expandable', () => {
    if (!seen.has('battle-log-toggle')) throw new Error('no battle-log expand/collapse button');
    if (!seen.has('battle-log-collapsed-by-default')) throw new Error('battle log did not start collapsed');
    if (!seen.has('battle-log-expands')) throw new Error('the toggle did not reveal more log lines');
    // Only assertable once a battle has run past turn 1; a single-turn battle has
    // nothing to order, so this is skipped rather than failed in that case.
    if (seen.has('battle-log-multiturn') && !seen.has('battle-log-newest-first')) {
      throw new Error('turn separators were not newest-first');
    }
  });
  step('Assist Mode surfaces its controls in Campaign', () => {
    if (!seen.has('assist-battle-button')) throw new Error('no "Let the AI battle" button during a battle');
    if (seen.has('team-preview') && !seen.has('assist-preview-button')) {
      throw new Error('no "Let the AI battle" button on Team Preview');
    }
    if (seen.has('reward') && !seen.has('assist-recommendation')) {
      throw new Error('recommendations were on but no reward was badged');
    }
  });
  step('a battle played entirely by Assist Mode keeps the run assist-only', () => {
    if (!seen.has('assist-battle-handover') && !seen.has('assist-preview-handover')) {
      throw new Error('never handed a battle over to Assist Mode');
    }
    if (assistOnlyAfterAuto === null) throw new Error('no Assist-played battle resolved');
    if (assistOnlyAfterAuto !== true) {
      throw new Error('assistOnly was cleared by a battle the player never touched — '
        + 'the Tacticians and Paragons unlocks are unreachable');
    }
  });
  step('a battle played by hand clears the assist-only flag', () => {
    // The other half of the pair: without this, passing `automated: true`
    // unconditionally would satisfy the test above while breaking the unlock.
    if (assistOnlyAfterManual === null) return;   // no manual battle finished
    if (assistOnlyAfterManual !== false) throw new Error('a hand-played battle left assistOnly set');
  });
  step('campaign progressed past the first node', () => {
    const save = JSON.parse(w.localStorage.getItem('pokemon-redgpt-save-v3'));
    const run = (save.campaign.runs || [])[0];
    if (!run) return; // the run may have finished, which is also progress
    if (run.stats.nodes < 2) throw new Error('only ' + run.stats.nodes + ' node(s) cleared');
  });

  // Reload the page and confirm the run and the saved team both survive.
  const savedBefore = JSON.parse(w.localStorage.getItem('pokemon-redgpt-save-v3'));
  const storedRun = (savedBefore.campaign.runs || [])[0];
  dom.window.close();

  const dom2 = await JSDOM.fromURL(`http://127.0.0.1:${server.address().port}/index.html`, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(win) {
      win.localStorage.setItem('pokemon-redgpt-save-v3', JSON.stringify(savedBefore));
    },
  });
  await new Promise(r => dom2.window.addEventListener('load', () => setTimeout(r, 400)));
  const d2 = dom2.window.document;
  const q2 = s => d2.querySelector(s);

  step('saved teams survive a reload', () => {
    if (!/Team Builder/.test(d2.body.textContent)) throw new Error('title screen missing');
    const save = JSON.parse(dom2.window.localStorage.getItem('pokemon-redgpt-save-v3'));
    if (!save.arena.teams.length) throw new Error('teams lost on reload');
    if (!save.arena.replays.length) throw new Error('replays lost on reload');
  });
  if (storedRun) {
    step('an active Campaign run survives a reload', () => {
      const btn = q2('#tContinueRun');
      if (!btn || btn.disabled) throw new Error('Continue Run is not offered after reload');
    });
    q2('#tContinueRun').click();
    await wait(400);
    step('the restored run resumes where it left off', () => {
      const resumed = /Act \d/.test(d2.body.textContent) || q2('.map-node') || q2('.prompt-card') || q2('.battle-field');
      if (!resumed) throw new Error('run did not resume: ' + d2.body.textContent.slice(0, 140));
    });
  }

  // Settings on the reloaded document.
  if (q2('[data-nav="settings"]')) {
    q2('[data-nav="settings"]').click();
    await wait(200);
    step('settings screen', () => { if (!q2('#setExport')) throw new Error('no settings'); });
  }

  /*
   * The Pokédex forme browser. Mega formes are `transformOnly` and therefore
   * absent from the browse list by design (PROJECT_CONTEXT §5) — the family
   * toggle is how they are reachable, and every forme must render from **its
   * own** species data rather than the base entry's.
   *
   * Driven through `speciesPanel` directly rather than by clicking: it is a
   * pure function of (species, forme) and the assertions are about what it
   * renders, so navigation timing would add nothing but flakiness.
   */
  {
    const Dex2 = dom2.window.RedGPT.Dex;
    const panel = dom2.window.RedGPT.UI.DexBrowser.speciesPanel;
    const base = panel('charizard', null);
    const mega = panel('charizard', 'charizardmegax');
    const megaSpecies = Dex2.species('charizardmegax');

    step('the Pokedex offers every forme in the family, including Megas', () => {
      const buttons = [...base.matchAll(/data-forme="([^"]*)"/g)].map(m => m[1]);
      const formes = dom2.window.RedGPT.Mechanics.speciesFormes({species: 'charizard'});
      if (!formes.length) throw new Error('Charizard should have Mega formes packaged');
      // One button per forme, plus one for the base entry itself.
      if (buttons.length !== formes.length + 1) {
        throw new Error(`${formes.length} formes but ${buttons.length} buttons`);
      }
      for (const forme of formes) {
        if (!buttons.includes(forme.id)) throw new Error(`no button for ${forme.name}`);
      }
      // The list itself must NOT gain them: transformOnly is a deliberate split.
      if (Dex2.allSpecies.some(s => s.id === 'charizardmegax')) {
        throw new Error('Mega formes must stay out of the browse list');
      }
    });

    step('a Pokedex forme renders its own typing, stats, ability and BST', () => {
      if (!mega.includes('Charizard-Mega-X')) throw new Error('the forme name is not shown');
      if (!mega.includes(`BST ${megaSpecies.bst}`)) throw new Error(`Mega BST ${megaSpecies.bst} not shown`);
      if (base.includes(`BST ${megaSpecies.bst}`)) throw new Error('the base entry should not show the Mega BST');
      /*
       * Fire/Dragon, not the base's Fire/Flying — asserted against the panel
       * *header* only. The first version searched the whole panel and failed on
       * its own breadth: Flying legitimately appears further down in the type
       * matchups, so "the Mega must not mention Flying" was never true.
       */
      const header = (mega.match(/<div class="panel-head">[\s\S]*?<\/div>\s*<\/div>/) || [''])[0];
      if (!header) throw new Error('could not isolate the panel header');
      for (const type of megaSpecies.types) {
        if (!header.includes(`>${type}<`)) throw new Error(`Mega typing ${type} not in the header`);
      }
      if (header.includes('>Flying<')) throw new Error('the header should not show the base forme typing');
      // Its own ability (Tough Claws), not the base's Blaze / Solar Power.
      const abilities = [...mega.matchAll(/data-ability="([^"]+)"/g)].map(m => m[1]);
      const want = Object.values(megaSpecies.abilities).map(Dex2.toID);
      if (abilities.join(',') !== want.join(',')) {
        throw new Error(`Mega abilities ${abilities.join(',')} should be ${want.join(',')}`);
      }
      // Its own base stats.
      for (const stat of Dex2.STATS) {
        if (!mega.includes(`>${megaSpecies.baseStats[stat]}</span>`)) {
          throw new Error(`Mega base ${stat} (${megaSpecies.baseStats[stat]}) not shown`);
        }
      }
      // And how it is reached, since it cannot be selected directly.
      if (!/How to reach it:/.test(mega)) throw new Error('the forme route is not explained');
    });
  }

  /*
   * The Team Builder draws what the held item produces. Verified through the
   * real view: a set is imported, the editor opened, and the rendered DOM
   * checked — the sprite, typing, BST and the "in battle" ability line all have
   * to follow the item, and revert when it is taken away.
   */
  {
    const w2 = dom2.window;
    const d2 = w2.document;
    const Dex2 = w2.RedGPT.Dex;
    const nav = [...d2.querySelectorAll('button')].find(b => b.textContent.trim() === 'Teams');
    nav?.click();
    await wait(200);
    const importBtn = [...d2.querySelectorAll('button')].find(b => /Import from text/i.test(b.textContent));
    importBtn?.click();
    await wait(200);
    const modal = d2.querySelector('.modal, dialog, [class*=modal]');
    const ta = modal?.querySelector('textarea');
    if (ta) {
      ta.value = 'Charizard @ Charizardite Y\nAbility: Blaze\nLevel: 100\n- Flamethrower';
      ta.dispatchEvent(new w2.Event('input', {bubbles: true}));
      [...modal.querySelectorAll('button')].find(b => /Create team/i.test(b.textContent))?.click();
      await wait(400);
    }

    step('the Team Builder draws the forme its held item produces', () => {
      // Scoped to the editor: several views can be mounted at once and
      // `.panel-head` is not unique, which is §8's "scope by class, not id"
      // trap in reverse — the first match was a different panel entirely.
      const head = d2.querySelector('#tbEditor .panel-head');
      if (!head) throw new Error('no editor card — the import did not open the builder');
      const mega = Dex2.species('charizardmegay');
      const sprite = head.querySelector('img')?.getAttribute('src') || '';
      if (!/MEGA/i.test(decodeURIComponent(sprite))) throw new Error(`card sprite is still the base forme (${sprite})`);
      const headText = head.textContent.replace(/\s+/g, ' ');
      if (!headText.includes('as Charizard-Mega-Y')) throw new Error('the card does not name the forme');
      if (!headText.includes(`BST ${mega.bst}`)) throw new Error(`card shows the wrong BST (want ${mega.bst})`);
      // The roster row follows too, not just the open card.
      const rowSprite = d2.querySelector('[data-slot="0"] img')?.getAttribute('src') || '';
      if (!/MEGA/i.test(decodeURIComponent(rowSprite))) throw new Error('the roster row still shows the base sprite');
      // The ability the Mega actually fights with, since the dropdown cannot
      // show it — selecting Blaze is still correct, it is just replaced.
      const editor = d2.querySelector('.set-editor')?.textContent.replace(/\s+/g, ' ') || '';
      if (!/In battle: Drought/.test(editor)) throw new Error('the replaced ability is not stated');
      // Its stats, not the base forme's.
      const statText = editor.match(/Base stats: ([^C]*)/)?.[1] || '';
      if (!statText.includes(String(mega.baseStats.spa))) {
        throw new Error(`base stats are not the Mega's (want SpA ${mega.baseStats.spa})`);
      }
    });

    step('removing the forme item puts the Team Builder card back', () => {
      const input = d2.querySelector('#fItem');
      if (!input) throw new Error('no held item field');
      input.value = '';
      input.dispatchEvent(new w2.Event('input', {bubbles: true}));
      input.dispatchEvent(new w2.Event('blur', {bubbles: true}));
      return new Promise((resolve, reject) => setTimeout(() => {
        const headText = d2.querySelector("#tbEditor .panel-head")?.textContent.replace(/\s+/g, ' ') || '';
        const sprite = d2.querySelector("#tbEditor .panel-head img")?.getAttribute('src') || '';
        if (headText.includes('as Charizard-Mega-Y')) return reject(new Error('the forme name survived the item being removed'));
        if (/MEGA/i.test(decodeURIComponent(sprite))) return reject(new Error('the Mega sprite survived the item being removed'));
        resolve();
      }, 300));
    });
  }

  dom2.window.close();

  console.log('\nconsole/jsdom errors: ' + errors.length);
  errors.slice(0, 6).forEach(e => console.log('  ' + (e.stack || e.message || e).toString().split('\n').slice(0, 4).join('\n    ')));
  server.close();
  process.exit(errors.length ? 1 : 0);
})().catch(e => { console.error(e); server.close(); process.exit(1); });
