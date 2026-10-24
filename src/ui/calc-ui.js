/**
 * Damage calculator tab.
 *
 * A thin form over `RedGPT.Calculator`, which drives the real battle engine —
 * so every number here is the number a battle would produce, including this
 * project's own ability and move rules. Nothing in this file computes damage.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const UI = RedGPT.UI;
  const Dex = RedGPT.Dex;
  const PokemonLib = RedGPT.Pokemon;
  const Calculator = RedGPT.Calculator;
  const {esc, typeChip, typeChips, categoryChip, monSprite} = UI;

  const STATS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
  const BOOSTS = ['atk', 'def', 'spa', 'spd', 'spe'];
  const STATUSES = [
    {id: '', label: 'Healthy'}, {id: 'brn', label: 'Burned'}, {id: 'psn', label: 'Poisoned'},
    {id: 'tox', label: 'Badly poisoned'}, {id: 'par', label: 'Paralyzed'},
    {id: 'slp', label: 'Asleep'}, {id: 'frz', label: 'Frozen'},
  ];
  const WEATHERS = [
    {id: '', label: 'None'}, {id: 'sun', label: 'Sun'}, {id: 'rain', label: 'Rain'},
    {id: 'sandstorm', label: 'Sandstorm'}, {id: 'snow', label: 'Snow'},
  ];
  const TERRAINS = [
    {id: '', label: 'None'}, {id: 'electric', label: 'Electric'}, {id: 'grassy', label: 'Grassy'},
    {id: 'misty', label: 'Misty'}, {id: 'psychic', label: 'Psychic'},
  ];

  /** A fresh side configuration. */
  function blankSide(species, moves) {
    return {
      set: PokemonLib.normalizeSet({
        species, level: 100, moves, nature: 'serious',
        evs: {}, ivs: PokemonLib.maxIVs(),
      }),
      boosts: {atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
      status: '',
      hpPercent: 100,
      tera: false,
      // Turn state. Only the defender's `hasMoved` changes a damage figure (see
      // `applyState`); `damageTakenPercent` matters on both sides. The defaults
      // reproduce the behaviour these fields replaced.
      hasMoved: false,
      damageTakenPercent: 0,
      damageTakenCategory: 'Physical',
      /*
       * Screens belong to a SIDE, not to whoever happens to be defending.
       * They used to be one global set applied to `sides[1]`, which was fine
       * while the calculator only ran one direction — but once it runs both,
       * a single set would follow the *role* and put Pokémon 2's Reflect in
       * front of Pokémon 2's own attack. `Calculator.buildBattle` already
       * scopes screens to the defending side, so each direction is simply
       * handed the defending Pokémon's own set.
       */
      screens: {reflect: false, lightscreen: false, auroraveil: false},
    };
  }

  const state = {
    attacker: null,
    defender: null,
    // Screens moved onto each side's own config (see `blankSide`), because they
    // belong to a side rather than to whichever Pokémon is currently defending.
    field: {weather: '', terrain: '', trickroom: false},
    critical: false,
  };

  function ensureState() {
    if (!state.attacker) {
      state.attacker = blankSide('garchomp', ['earthquake', 'dragonclaw', 'stoneedge', 'swordsdance']);
      state.attacker.set.evs = {atk: 252, spe: 252, hp: 4};
      state.attacker.set.nature = 'jolly';
    }
    if (!state.defender) {
      state.defender = blankSide('blissey', ['seismictoss', 'softboiled', 'toxic', 'protect']);
      state.defender.set.evs = {hp: 252, def: 252, spd: 4};
      state.defender.set.nature = 'bold';
    }
  }

  const CalcUI = {};

  CalcUI.render = function (root, app) {
    ensureState();
    root.innerHTML = `
      <div class="view-pad">
        <div class="row" style="margin-bottom:.6rem">
          <h2 style="margin:0">Damage Calculator</h2>
          <span class="tag">Runs the real battle engine</span>
          <span class="spacer"></span>
          <button id="calcSwap">⇅ Swap sides</button>
          <button id="calcReset">Reset</button>
        </div>
        <div class="calc-grid">
          <div id="calcAttacker" class="panel"></div>
          <div id="calcMiddle" class="panel"></div>
          <div id="calcDefender" class="panel"></div>
        </div>
      </div>`;

    UI.$('#calcSwap', root).onclick = () => {
      const a = state.attacker;
      state.attacker = state.defender;
      state.defender = a;
      CalcUI.render(root, app);
    };
    UI.$('#calcReset', root).onclick = () => {
      state.attacker = null;
      state.defender = null;
      state.field = {weather: '', terrain: '', reflect: false, lightscreen: false, auroraveil: false, trickroom: false};
      state.critical = false;
      CalcUI.render(root, app);
    };

    drawSide(root, app, 'attacker');
    drawSide(root, app, 'defender');
    // `refreshResults` rather than `drawMiddle`, so the first paint gets the
    // up/down marks and tooltips too rather than only later edits.
    refreshResults(root, app);
  };

  /** Re-render only the results, so editing a field does not steal focus. */
  function refreshResults(root, app) {
    drawMiddle(root, app);
    refreshStats(root);
  }

  /**
   * Update the six stat readouts in place, on both sides.
   *
   * **In place rather than by redrawing the side**, for the reason §8 records
   * about the cries checkbox: a full `drawSide` rebuilds the DOM and drops
   * focus off the control the player is currently using — and the battle-state
   * dropdowns are exactly the controls that need this to update. It is called
   * from `refreshResults`, which every input path already goes through, so a
   * new control gets live stats for free.
   */
  function refreshStats(root) {
    let live = null;
    try { live = Calculator.liveStats(state.attacker, state.defender, state.field); } catch { return; }
    for (const which of ['attacker', 'defender']) {
      const node = UI.$(which === 'attacker' ? '#calcAttacker' : '#calcDefender', root);
      if (!node) continue;
      const raw = PokemonLib.calcStats(state[which].set);
      UI.$$('.calc-ev-row', node).forEach((row, index) => {
        const stat = STATS[index];
        const span = UI.$('.calc-stat', row);
        if (!stat || !span || !live[which][stat]) return;
        applyStatReadout(span, live[which][stat].value, raw[stat], live[which][stat].factors);
      });
    }
  }

  /** One stat cell: the live value, its direction, and why. */
  function applyStatReadout(span, value, base, factors) {
    const moved = value !== base;
    span.textContent = value;
    span.classList.toggle('up', moved && value > base);
    span.classList.toggle('down', moved && value < base);
    span.title = moved
      // Rounded for display: `statBreakdown` *measures* each factor as a ratio
      // rather than recomputing the maths (§5), so integer flooring turns a
      // Choice Band into ×1.498607242339833.
      ? `${base} base → ${value}: ${(factors || [])
        .map(f => `${f.label} ×${Math.round(f.factor * 100) / 100}`).join(', ') || 'battle state'}`
      : String(value);
  }

  function drawSide(root, app, which) {
    const config = state[which];
    const node = UI.$(which === 'attacker' ? '#calcAttacker' : '#calcDefender', root);
    const species = Dex.species(config.set.species);
    const abilities = Dex.abilityList(species);
    /*
     * The stats each side is *actually* fighting with, not the raw spread.
     *
     * This used `Pokemon.calcStats`, which knows the species, level, nature,
     * IVs and EVs and nothing else — so a Choice Band holder at +2 with a
     * Choice Scarf showed its base numbers and the readout disagreed with the
     * damage underneath it. `Calculator.liveStats` reads `battle.getStat` off
     * the same battle the damage rolls use, so the two cannot diverge.
     *
     * Guarded, and deliberately: an unusual set (a species the format refuses,
     * a half-typed picker state mid-edit) must degrade to the raw spread rather
     * than blanking the panel the player is typing into.
     */
    let live = null;
    try {
      live = Calculator.liveStats(state.attacker, state.defender, state.field)[which];
    } catch { /* fall back to the raw spread */ }
    const raw = PokemonLib.calcStats(config.set);
    const stats = live
      ? Object.fromEntries(STATS.map(key => [key, live[key].value]))
      : raw;
    const evTotal = STATS.reduce((sum, key) => sum + (config.set.evs[key] || 0), 0);

    node.innerHTML = `
      <div class="panel-head">
        <h3>${which === 'attacker' ? 'Attacker' : 'Defender'}</h3>
        <div class="spacer"></div>
        <span class="tiny mono">BST ${species.bst}</span>
      </div>
      <div class="row" style="align-items:flex-start;gap:.6rem">
        ${monSprite(species, {className: 'sprite-md'})}
        <div style="flex:1;min-width:0">
          <div class="picker"><input type="text" data-species="${which}" value="${esc(species.name)}" autocomplete="off"></div>
          <div class="row-tight" style="margin-top:.2rem">${typeChips(config.tera ? [config.set.teraType] : species.types)}</div>
        </div>
      </div>

      <div class="grid grid-2" style="margin-top:.5rem">
        <label class="field"><span>Level</span>
          <input type="number" min="1" max="100" data-level="${which}" value="${config.set.level}"></label>
        <label class="field"><span>Nature</span>
          <select data-nature="${which}">${Object.values(Dex.allNatures).map(n =>
    `<option value="${n.id}" ${n.id === config.set.nature ? 'selected' : ''}>${esc(UI.natureLabel(n.id))}</option>`).join('')}</select></label>
      </div>
      <label class="field"><span>Ability</span>
        <select data-ability="${which}">${abilities.map(name =>
    `<option value="${esc(name)}" ${Dex.toID(name) === Dex.toID(config.set.ability) ? 'selected' : ''}>${esc(name)}</option>`).join('')}</select></label>
      <div class="picker"><label class="field"><span>Held item</span>
        <input type="text" data-item="${which}" value="${esc(config.set.item ? Dex.item(config.set.item).name : '')}" placeholder="None" autocomplete="off"></label></div>

      <div class="grid grid-2">
        <label class="field"><span>Tera type</span>
          <select data-tera="${which}">${Dex.TYPES.map(t =>
    `<option value="${t}" ${t === config.set.teraType ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
        <label class="field" style="align-self:end">
          <label class="checkbox"><input type="checkbox" data-teraon="${which}" ${config.tera ? 'checked' : ''}> Terastallized</label>
        </label>
      </div>

      <h4 style="margin-top:.5rem">EVs — ${evTotal}/510</h4>
      <div class="calc-evs">
        ${STATS.map(stat => `
          <div class="calc-ev-row">
            <span class="tiny mono">${Dex.STAT_SHORT[stat]}</span>
            <input type="range" min="0" max="252" step="4" data-ev="${which}:${stat}" value="${config.set.evs[stat] || 0}">
            <input type="number" min="0" max="252" class="calc-ev-num" data-evnum="${which}:${stat}" value="${config.set.evs[stat] || 0}">
            <span class="tiny mono calc-stat">${stats[stat]}</span>
          </div>`).join('')}
      </div>

      <h4 style="margin-top:.5rem">Battle state</h4>
      <div class="calc-boosts">
        ${BOOSTS.map(stat => `
          <label class="calc-boost">
            <span class="tiny mono">${Dex.STAT_SHORT[stat]}</span>
            <select data-boost="${which}:${stat}">${[6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6].map(v =>
    `<option value="${v}" ${v === config.boosts[stat] ? 'selected' : ''}>${v > 0 ? '+' + v : v}</option>`).join('')}</select>
          </label>`).join('')}
      </div>
      <div class="grid grid-2" style="margin-top:.4rem">
        <label class="field"><span>Status</span>
          <select data-status="${which}">${STATUSES.map(s =>
    `<option value="${s.id}" ${s.id === config.status ? 'selected' : ''}>${s.label}</option>`).join('')}</select></label>
        <label class="field"><span>HP %</span>
          <input type="number" min="1" max="100" data-hp="${which}" value="${config.hpPercent}"></label>
      </div>
      <div class="grid grid-2" style="margin-top:.4rem">
        <label class="field" title="Arms Assurance, Avalanche, Revenge and the Counter family. Attacker-side and defender-side both matter.">
          <span>Damage taken this turn %</span>
          <input type="number" min="0" max="100" data-tookdmg="${which}" value="${config.damageTakenPercent}"></label>
      </div>
      <div class="row-tight" style="margin-top:.4rem">
        <label class="checkbox" title="Fishious Rend and Bolt Beak double against a target that has not moved yet; Payback and Analytic want the opposite.">
          <input type="checkbox" data-hasmoved="${which}" ${config.hasMoved ? 'checked' : ''}> Has already moved this turn</label>
      </div>
      <div class="stack" style="gap:.2rem;margin-top:.4rem">
        <label class="checkbox"><input type="checkbox" data-screen="${which}:reflect" ${config.screens.reflect ? 'checked' : ''}> Reflect</label>
        <label class="checkbox"><input type="checkbox" data-screen="${which}:lightscreen" ${config.screens.lightscreen ? 'checked' : ''}> Light Screen</label>
        <label class="checkbox"><input type="checkbox" data-screen="${which}:auroraveil" ${config.screens.auroraveil ? 'checked' : ''}> Aurora Veil</label>
      </div>

      <h4 style="margin-top:.5rem">Moves</h4>
      <div class="calc-moves">
        ${[0, 1, 2, 3].map(i => {
    const id = config.set.moves[i];
    const move = id ? Dex.move(id) : null;
    return `<div class="picker"><input type="text" data-move="${which}:${i}" value="${esc(move ? move.name : '')}" placeholder="Move ${i + 1}" autocomplete="off"></div>`;
  }).join('')}
      </div>`;

    wireSide(root, app, which, node, species);
  }

  function wireSide(root, app, which, node, species) {
    const config = state[which];
    const rerender = () => CalcUI.render(root, app);
    const recalc = () => { drawSide(root, app, which); refreshResults(root, app); };

    // Species picker
    const speciesInput = UI.$(`[data-species="${which}"]`, node);
    UI.attachPicker(speciesInput, {
      source: query => UI.searchIndex(Dex.searchIndex, query),
      render: entry => `${monSprite(entry.id, {className: 'sprite-sm'})}<span class="pk-name">${esc(entry.name)}</span>
        ${typeChips(entry.types)}<span class="tiny mono">${entry.bst}</span>`,
      onPick: entry => {
        const next = Dex.species(entry.id);
        config.set.species = next.id;
        if (!Dex.hasAbility(next, config.set.ability)) config.set.ability = Dex.abilityList(next)[0] || 'No Ability';
        config.set.moves = config.set.moves.filter(id => Dex.canLearn(next, id));
        config.set.teraType = next.types[0] || 'Normal';
        config.set = PokemonLib.normalizeSet(config.set);
        rerender();
      },
    });

    // Held item picker
    const itemInput = UI.$(`[data-item="${which}"]`, node);
    UI.attachPicker(itemInput, {
      source: query => UI.searchIndex(Dex.itemSearchIndex, query),
      render: entry => `<span class="pk-name">${esc(entry.name)}</span><span class="tiny">${esc(entry.shortDesc || '')}</span>`,
      onPick: entry => { config.set.item = entry.id; recalc(); },
    });
    itemInput.onchange = () => {
      if (!itemInput.value.trim()) { config.set.item = null; recalc(); }
    };

    UI.$(`[data-level="${which}"]`, node).onchange = event => {
      config.set.level = Math.max(1, Math.min(100, +event.target.value || 100));
      recalc();
    };
    UI.$(`[data-nature="${which}"]`, node).onchange = event => { config.set.nature = event.target.value; recalc(); };
    UI.$(`[data-ability="${which}"]`, node).onchange = event => { config.set.ability = event.target.value; recalc(); };
    UI.$(`[data-tera="${which}"]`, node).onchange = event => { config.set.teraType = event.target.value; recalc(); };
    UI.$(`[data-teraon="${which}"]`, node).onchange = event => { config.tera = event.target.checked; recalc(); };
    UI.$(`[data-status="${which}"]`, node).onchange = event => { config.status = event.target.value; refreshResults(root, app); };
    // Defender-only (see `Calculator.applyState`), so the control may be absent.
    const hasMoved = UI.$(`[data-hasmoved="${which}"]`, node);
    if (hasMoved) hasMoved.onchange = event => { config.hasMoved = event.target.checked; refreshResults(root, app); };
    UI.$(`[data-tookdmg="${which}"]`, node).onchange = event => {
      config.damageTakenPercent = Math.max(0, Math.min(100, +event.target.value || 0));
      refreshResults(root, app);
    };
    UI.$(`[data-hp="${which}"]`, node).onchange = event => {
      config.hpPercent = Math.max(1, Math.min(100, +event.target.value || 100));
      refreshResults(root, app);
    };

    UI.$$('[data-ev]', node).forEach(input => {
      input.oninput = () => {
        const [side, stat] = input.dataset.ev.split(':');
        state[side].set.evs[stat] = Math.max(0, Math.min(252, +input.value || 0));
        const num = UI.$(`[data-evnum="${side}:${stat}"]`, node);
        if (num) num.value = state[side].set.evs[stat];
        refreshResults(root, app);
      };
      input.onchange = () => recalc();
    });
    UI.$$('[data-evnum]', node).forEach(input => {
      input.onchange = () => {
        const [side, stat] = input.dataset.evnum.split(':');
        state[side].set.evs[stat] = Math.max(0, Math.min(252, +input.value || 0));
        recalc();
      };
    });
    UI.$$('[data-boost]', node).forEach(select => {
      select.onchange = () => {
        const [side, stat] = select.dataset.boost.split(':');
        state[side].boosts[stat] = +select.value;
        refreshResults(root, app);
      };
    });

    UI.$$(`[data-screen^="${which}:"]`, node).forEach(box => {
      box.onchange = () => {
        const key = box.dataset.screen.split(':')[1];
        config.screens[key] = box.checked;
        refreshResults(root, app);
      };
    });

    {
      // Both panels carry moves now, so this is no longer attacker-only.
      const legal = new Set(Dex.legalMoveList(species));
      UI.$$(`[data-move^="${which}:"]`, node).forEach(input => {
        const index = +input.dataset.move.split(':')[1];
        UI.attachPicker(input, {
          source: query => UI.searchIndex(Dex.moveSearchIndex, query, {extra: entry => legal.has(entry.id)}),
          render: entry => {
            const move = Dex.move(entry.id);
            const shown = RedGPT.Abilities.displayMoveType(config.set.ability, move);
            const power = RedGPT.Abilities.displayBasePower(config.set.ability, move);
            return `<span class="pk-name">${esc(move.name)}</span>${typeChip(shown)}${categoryChip(move.category)}
              <span class="tiny mono">${power || '—'}</span>`;
          },
          onPick: entry => {
            config.set.moves[index] = entry.id;
            config.set.moves = config.set.moves.filter(Boolean);
            rerender();
          },
        });
        input.onchange = () => {
          if (!input.value.trim()) {
            config.set.moves.splice(index, 1);
            rerender();
          }
        };
      });
    }
  }

  function drawMiddle(root, app) {
    const node = UI.$('#calcMiddle', root);
    const field = state.field;

    /*
     * Both directions at once, the way Showdown's calculator does it: each
     * Pokémon has its own moves and each attacks the other. Before this only
     * the left panel could attack, so answering "and what does it do back?"
     * meant swapping sides and losing the first answer.
     *
     * The screens come from the DEFENDING Pokémon's own side each time, which
     * is what keeps the reverse direction honest.
     */
    const direction = (from, to) => {
      const base = {
        weather: field.weather || null,
        terrain: field.terrain || null,
        trickroom: field.trickroom,
        reflect: state[to].screens.reflect,
        lightscreen: state[to].screens.lightscreen,
        auroraveil: state[to].screens.auroraveil,
      };
      try {
        return {
          results: Calculator.calculateAll({
            attacker: state[from], defender: state[to], field: base, critical: state.critical,
          }),
          error: null,
        };
      } catch (err) {
        return {results: [], error: err.message};
      }
    };

    const forward = direction('attacker', 'defender');
    const reverse = direction('defender', 'attacker');
    const error = forward.error || reverse.error;
    const nameOf = which => Dex.species(state[which].set.species).name;
    node.innerHTML = `
      <div class="panel-head"><h3>Field</h3></div>
      <div class="grid grid-2">
        <label class="field"><span>Weather</span>
          <select id="calcWeather">${WEATHERS.map(w =>
    `<option value="${w.id}" ${w.id === field.weather ? 'selected' : ''}>${w.label}</option>`).join('')}</select></label>
        <label class="field"><span>Terrain</span>
          <select id="calcTerrain">${TERRAINS.map(t =>
    `<option value="${t.id}" ${t.id === field.terrain ? 'selected' : ''}>${t.label}</option>`).join('')}</select></label>
      </div>
      <div class="stack" style="gap:.2rem">
        <label class="checkbox"><input type="checkbox" id="calcCrit" ${state.critical ? 'checked' : ''}> Critical hit</label>
        <span class="tiny dim">Screens are per side — set them on each Pokémon's own panel.</span>
      </div>

      <div class="panel-head" style="margin-top:.8rem"><h3>${esc(nameOf('attacker'))} → ${esc(nameOf('defender'))}</h3></div>
      ${error ? `<div class="small" style="color:var(--accent-soft)">${esc(error)}</div>` : ''}
      <div class="calc-results">
        ${forward.results.length
    ? forward.results.map(result => renderResult(result, Dex.species(state.defender.set.species))).join('')
    : `<div class="small dim">Give ${esc(nameOf('attacker'))} a move.</div>`}
      </div>

      <div class="panel-head" style="margin-top:.8rem"><h3>${esc(nameOf('defender'))} → ${esc(nameOf('attacker'))}</h3></div>
      <div class="calc-results calc-results-reverse">
        ${reverse.results.length
    ? reverse.results.map(result => renderResult(result, Dex.species(state.attacker.set.species))).join('')
    : `<div class="small dim">Give ${esc(nameOf('defender'))} a move.</div>`}
      </div>
      <div class="tiny dim" style="margin-top:.6rem">
        Every figure comes from the battle engine itself, across all 16 damage rolls —
        so it matches what a real battle produces, including this project's own move
        and ability rules.
      </div>`;

    UI.$('#calcWeather', node).onchange = e => { field.weather = e.target.value; refreshResults(root, app); };
    UI.$('#calcTerrain', node).onchange = e => { field.terrain = e.target.value; refreshResults(root, app); };
    UI.$('#calcCrit', node).onchange = e => { state.critical = e.target.checked; refreshResults(root, app); };
  }

  function renderResult(result, defenderSpecies) {
    const move = Dex.move(result.moveId);
    if (result.error) {
      return `<div class="calc-result"><b>${esc(move.name)}</b>
        <div class="small" style="color:var(--accent-soft)">${esc(result.error)}</div></div>`;
    }
    if (result.immune) {
      return `<div class="calc-result">
        <div class="row-tight"><b>${esc(move.name)}</b>${typeChip(result.type)}</div>
        <div class="small dim">${esc(defenderSpecies.name)} is immune.</div></div>`;
    }
    if (result.empty || !result.max) {
      return `<div class="calc-result">
        <div class="row-tight"><b>${esc(move.name)}</b>${typeChip(move.type)}</div>
        <div class="small dim">No damage.</div></div>`;
    }
    const effLabel = result.effectiveness >= 4 ? '×4' : result.effectiveness === 2 ? '×2'
      : result.effectiveness === 0.5 ? '×½' : result.effectiveness <= 0.25 ? '×¼' : '';
    const effClass = result.effectiveness > 1 ? 'se' : result.effectiveness < 1 ? 'nve' : '';
    const percent = Math.min(100, result.maxPercent);
    return `<div class="calc-result">
      <div class="row-tight">
        <b>${esc(move.name)}</b>
        ${typeChip(result.type)} ${categoryChip(result.category)}
        <span class="tiny mono${result.basePower !== result.packagedBasePower ? ' boosted' : ''}"${
  result.basePower !== result.packagedBasePower
    ? ` title="Effective power. ${esc(state.attacker.set.ability)} and held items are already applied; the move's own base power is ${result.packagedBasePower}."`
    : ''}>${result.basePower !== result.packagedBasePower
    ? `<s>${result.packagedBasePower}</s> ${result.basePower}`
    : result.basePower} BP</span>
        ${effLabel ? `<span class="move-eff ${effClass}">${effLabel}</span>` : ''}
        ${result.stab ? '<span class="tag">STAB</span>' : ''}
        ${result.hits > 1 ? `<span class="tag">${result.hits} hits</span>` : ''}
      </div>
      <div class="calc-bar"><i style="width:${percent}%"></i></div>
      <div class="row-tight">
        <span class="mono">${result.min} - ${result.max}</span>
        <span class="mono dim">(${result.minPercent}% - ${result.maxPercent}%)</span>
        <span class="spacer"></span>
        <span class="tiny ${result.koChance >= 100 ? 'calc-ko' : ''}">${
  result.koChance > 0 && result.koChance < 100
    ? `${result.koChance}% to OHKO`
    : esc(result.ko ? result.ko.text : '')}</span>
      </div>
    </div>`;
  }

  /*
   * The panel's live configuration, exposed so `tests/ui-smoke.js` can put a
   * specific move on the attacker.
   *
   * It needs to, because the move field is a picker that only commits through
   * its dropdown — typing into it and firing `change` does nothing — and the
   * default matchup carries no turn-state-dependent move, so a wiring test
   * would otherwise compare two identical numbers and pass while proving
   * nothing. Nothing in `src/` reads this; it is a handle on state the UI
   * already owns, not a second source of truth.
   */
  CalcUI.state = state;

  RedGPT.UI.Calc = CalcUI;
})(typeof window !== 'undefined' ? window : globalThis);
