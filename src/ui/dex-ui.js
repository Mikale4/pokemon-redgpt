/**
 * Pokédex / competitive data browser.
 *
 * Shared by Arena and Campaign. The list is filtered and windowed rather than
 * fully rendered — with ~1,270 species and ~830 moves, rebuilding the whole DOM
 * on every keystroke would be unusable.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const UI = RedGPT.UI;
  const Dex = RedGPT.Dex;
  const {esc, typeChips, typeChip, categoryChip, monSprite, itemIcon} = UI;

  const PAGE_SIZE = 60;

  const state = {
    query: '',
    types: new Set(),
    sort: 'num',
    powerClass: 'all',
    minBst: 0,
    selected: null,
    // Which forme of the selected family is being shown, or null for the entry
    // itself. Cleared whenever the selection changes.
    forme: null,
    limit: PAGE_SIZE,
    // Stat display: species base stats, or the raw stats a Pokémon of this
    // species would have at `statLevel` with a neutral nature and max IVs.
    statMode: 'base',
    statLevel: 50,
  };

  function matches(entry) {
    const species = Dex.species(entry.id);
    if (state.types.size && ![...state.types].every(t => species.types.includes(t))) return false;
    if (state.powerClass !== 'all' && species.powerClass !== state.powerClass) return false;
    if (species.bst < state.minBst) return false;
    return true;
  }

  function results() {
    const list = UI.searchIndex(Dex.searchIndex, state.query, {extra: matches});
    const sorted = [...list];
    if (state.sort === 'bst') sorted.sort((a, b) => b.bst - a.bst);
    else if (state.sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (state.sort === 'num') sorted.sort((a, b) => a.num - b.num || a.name.localeCompare(b.name));
    return sorted;
  }

  function render(root, {onExit} = {}) {
    root.innerHTML = `
      <div class="view-pad">
        <div class="panel-head">
          <h1>Pokédex</h1>
          <div class="spacer"></div>
          <span class="tag" id="dexCount"></span>
        </div>
        <div class="dex-layout">
          <div class="panel tight">
            <div class="dex-filters">
              <label class="field"><span>Search</span><input id="dexQuery" type="search" placeholder="Name, type or ability" value="${esc(state.query)}"></label>
              <label class="field"><span>Sort</span>
                <select id="dexSort">
                  <option value="num" ${state.sort === 'num' ? 'selected' : ''}>Dex number</option>
                  <option value="name" ${state.sort === 'name' ? 'selected' : ''}>Name</option>
                  <option value="bst" ${state.sort === 'bst' ? 'selected' : ''}>Base stat total</option>
                </select></label>
              <label class="field"><span>Class</span>
                <select id="dexClass">
                  <option value="all" ${state.powerClass === 'all' ? 'selected' : ''}>All</option>
                  <option value="standard" ${state.powerClass === 'standard' ? 'selected' : ''}>Standard</option>
                  <option value="restricted" ${state.powerClass === 'restricted' ? 'selected' : ''}>Restricted</option>
                  <option value="unrestricted-only" ${state.powerClass === 'unrestricted-only' ? 'selected' : ''}>Anything Goes only</option>
                </select></label>
              <label class="field"><span>Minimum BST</span><input id="dexBst" type="number" min="0" max="800" step="10" value="${state.minBst}"></label>
            </div>
            <div class="type-filter" id="dexTypes">
              ${Dex.TYPES.map(type => `<button data-type="${type}" class="${state.types.has(type) ? 'on' : ''}" style="background:${UI.TYPE_COLORS[type]};color:#fff;border-color:transparent">${type}</button>`).join('')}
            </div>
            <div class="dex-list" id="dexList"></div>
          </div>
          <div id="dexDetail"></div>
        </div>
      </div>`;

    const listNode = UI.$('#dexList', root);
    const detailNode = UI.$('#dexDetail', root);

    const drawList = () => {
      const list = results();
      UI.$('#dexCount', root).textContent = `${list.length} of ${Dex.allSpecies.length} species`;
      const shown = list.slice(0, state.limit);
      listNode.innerHTML = shown.map(entry => {
        const species = Dex.species(entry.id);
        return `<button class="dex-row ${state.selected === entry.id ? 'active' : ''}" data-dex="${entry.id}">
          ${monSprite(species, {className: 'sprite-sm'})}
          <span class="d-name">${esc(species.name)}<br><span class="tiny mono">#${String(species.num).padStart(4, '0')}</span></span>
          <span>${typeChips(species.types)}</span>
          <span class="d-bst">${species.bst}</span>
        </button>`;
      }).join('') || '<div class="empty-state">No species match those filters.</div>';
      if (list.length > state.limit) {
        listNode.insertAdjacentHTML('beforeend', `<button id="dexMore" style="width:100%;border-radius:0">Show ${Math.min(PAGE_SIZE, list.length - state.limit)} more…</button>`);
        UI.$('#dexMore', listNode).onclick = () => { state.limit += PAGE_SIZE; drawList(); };
      }
      UI.$$('[data-dex]', listNode).forEach(button => {
        button.onclick = () => { state.selected = button.dataset.dex; state.forme = null; drawList(); drawDetail(); };
      });
    };

    const drawDetail = () => {
      if (!state.selected) {
        detailNode.innerHTML = `<div class="empty-state">Select a Pokémon to see its competitive profile.</div>`;
        return;
      }
      detailNode.innerHTML = speciesPanel(state.selected, state.forme);
      bindDetail(detailNode);
    };

    UI.$('#dexQuery', root).oninput = event => { state.query = event.target.value; state.limit = PAGE_SIZE; drawList(); };
    UI.$('#dexSort', root).onchange = event => { state.sort = event.target.value; drawList(); };
    UI.$('#dexClass', root).onchange = event => { state.powerClass = event.target.value; state.limit = PAGE_SIZE; drawList(); };
    UI.$('#dexBst', root).onchange = event => { state.minBst = Math.max(0, +event.target.value || 0); state.limit = PAGE_SIZE; drawList(); };
    UI.$$('[data-type]', root).forEach(button => {
      button.onclick = () => {
        const type = button.dataset.type;
        if (state.types.has(type)) state.types.delete(type); else state.types.add(type);
        button.classList.toggle('on');
        state.limit = PAGE_SIZE;
        drawList();
      };
    });

    drawList();
    drawDetail();
    void onExit;
  }

  /**
   * The Pokédex entry, optionally rendered as one of the family's other formes.
   *
   * **The browse list deliberately does not contain Mega formes** — they are
   * `transformOnly`, which PROJECT_CONTEXT §5 records as a decision: the
   * supported route to a Mega is the base forme holding the stone, so listing
   * them as separate entries would contradict the Team Builder and every format
   * pool. That left them unreachable in the Pokédex altogether, which is a
   * different problem and the one this fixes: the *family* view now lists every
   * packaged forme, exactly as the Campaign Pokémon menu does, and each is
   * rendered from its own species data — sprite, typing, base stats, BST,
   * abilities and type matchups.
   *
   * Origin, Primal, Crowned, Hero, Blade, Zen and the Arceus/Silvally types were
   * never missing: those are ordinary selectable species and have their own list
   * entries. Measured before building this — 91 of 1,269 packaged species are
   * hidden from the list, and all 91 are Mega formes plus Greninja-Ash.
   *
   * `speciesFormes` wants a set. There is no set here, so it gets a bare
   * `{species}` and every forme comes back `available: false` with a `when`
   * route from `formeRoute`. That is the right answer for a reference screen:
   * "how is this reached" is a fact about the forme, while "can this Pokémon
   * reach it right now" is a fact about a set the Pokédex does not have — so the
   * route is shown and nothing is greyed out.
   */
  function speciesPanel(speciesId, formeId = null) {
    const species = Dex.species(speciesId);
    const formes = RedGPT.Mechanics.speciesFormes({species: species.id});
    const shown = formeId && formes.some(f => f.id === formeId) ? Dex.species(formeId) : species;
    const viewingForme = shown.id !== species.id;
    const profile = Dex.defensiveProfile(shown.types);
    const weak = Object.entries(profile).filter(([, v]) => v > 1).sort((a, b) => b[1] - a[1]);
    const resist = Object.entries(profile).filter(([, v]) => v < 1 && v > 0).sort((a, b) => a[1] - b[1]);
    const immune = Object.entries(profile).filter(([, v]) => v === 0);
    // Evolution and the learnset stay on the *base* entry: a Mega forme is a
    // transformation rather than a stage, and it shares the base's moves.
    const family = Dex.evolutionFamily(species);
    const levelMoves = Object.entries(species.learnset).filter(([, lv]) => lv > 0).sort((a, b) => a[1] - b[1]);
    const otherMoves = Object.keys(species.learnset).filter(id => species.learnset[id] === 0 && Dex.hasMove(id));

    return `
      <div class="panel">
        <div class="panel-head">
          ${monSprite(shown, {className: 'sprite-lg'})}
          <div>
            <h2 style="margin:0">${esc(shown.name)}</h2>
            <div class="row-tight">${typeChips(shown.types)}</div>
            <div class="tiny mono">#${String(shown.num).padStart(4, '0')} · BST ${shown.bst} · Gen ${shown.gen} · ${esc(shown.powerClass)}${shown.tier ? ` · ${esc(shown.tier)}` : ''}</div>
            ${Dex.cry(species) ? `<button class="btn btn-sm" data-cry="${esc(species.id)}" title="Play cry">▶ Cry</button>` : ''}
          </div>
        </div>

        ${formes.length ? `<div class="row-tight forme-toggle" style="margin:.5rem 0;flex-wrap:wrap">
          <button class="tiny ${viewingForme ? '' : 'active'}" data-forme="">${esc(species.name)}</button>
          ${formes.map(f => `<button class="tiny ${shown.id === f.id ? 'active' : ''}" data-forme="${esc(f.id)}" title="${esc(f.name)} — ${esc(f.when)}">${esc(f.name)}</button>`).join('')}
        </div>
        ${viewingForme ? `<div class="tiny dim" style="margin-bottom:.4rem">How to reach it: ${esc((formes.find(f => f.id === shown.id) || {}).when || 'transforming in battle')}.</div>` : ''}` : ''}

        ${(() => {
    // Same toggle as the Campaign Pokémon menu. The Pokédex has no set to read
    // from, so the raw column is the neutral-nature, max-IV, no-EV baseline —
    // stated in the caption rather than left for the reader to guess.
    const showBase = state.statMode === 'base';
    const raw = RedGPT.Pokemon.calcStats(RedGPT.Pokemon.normalizeSet({
      species: shown.id, level: state.statLevel, nature: 'serious',
      ivs: RedGPT.Pokemon.maxIVs(), moves: [],
    }));
    const value = stat => (showBase ? shown.baseStats[stat] : raw[stat]);
    const scale = showBase ? 255 : 400;
    return `
        <div class="row-tight" style="justify-content:space-between;align-items:baseline">
          <h4 style="margin:0">Stats</h4>
          <span class="row-tight stat-mode">
            <button class="tiny ${showBase ? 'active' : ''}" data-statmode="base">Base</button>
            <button class="tiny ${showBase ? '' : 'active'}" data-statmode="level">At Lv.${state.statLevel}</button>
            ${showBase ? '' : `<button class="tiny" data-statlevel="${state.statLevel === 100 ? 50 : 100}">Lv.${state.statLevel === 100 ? 50 : 100}</button>`}
          </span>
        </div>
        ${Dex.STATS.map(stat => `<div class="stat-line">
          <span class="tiny">${Dex.STAT_SHORT[stat]}</span>
          <span class="bar"><i style="width:${Math.min(100, Math.round(100 * value(stat) / scale))}%"></i></span>
          <span class="value">${value(stat)}</span></div>`).join('')}
        <div class="tiny dim" style="margin-top:.3rem">${showBase
    ? `Species base stats${viewingForme ? ` for ${esc(shown.name)}` : ''} · BST ${shown.bst}`
    : `At level ${state.statLevel} with a neutral nature, 31 IVs and no EVs${viewingForme ? `, as ${esc(shown.name)}` : ''} · BST ${shown.bst}`}</div>`;
  })()}

        <h4 style="margin-top:.7rem">Abilities</h4>
        ${Object.entries(shown.abilities).map(([slot, name]) => {
          const ability = Dex.ability(name);
          return `<div style="margin-bottom:.3rem">
            <button class="tiny-btn" data-ability="${esc(ability?.id || name)}"><b>${esc(name)}</b></button>
            ${slot === 'H' ? '<span class="tag">Hidden</span>' : ''}
            ${RedGPT.Abilities.isSimulated(name) ? '' : '<span class="tag warn">Not simulated</span>'}
            <div class="tiny">${esc(ability?.shortDesc || '')}</div></div>`;
        }).join('')}

        <h4 style="margin-top:.7rem">Type matchups</h4>
        <div class="small">
          ${weak.length ? `<div><span class="dim">Weak:</span> ${weak.map(([t, v]) => `${typeChip(t)}<span class="tiny mono">×${v}</span>`).join(' ')}</div>` : ''}
          ${resist.length ? `<div style="margin-top:.2rem"><span class="dim">Resists:</span> ${resist.map(([t, v]) => `${typeChip(t)}<span class="tiny mono">×${v}</span>`).join(' ')}</div>` : ''}
          ${immune.length ? `<div style="margin-top:.2rem"><span class="dim">Immune:</span> ${immune.map(([t]) => typeChip(t)).join(' ')}</div>` : ''}
        </div>

        <h4 style="margin-top:.7rem">Evolution</h4>
        ${family.length > 1
          ? `<div class="row" style="gap:.4rem">${family.map(entry => {
              const rule = Dex.evolutions(entry.species.prevo ? Dex.species(entry.species.prevo) : entry.species).find(r => r.target === entry.species.id);
              return `<div class="center" style="min-width:74px">
                ${monSprite(entry.species, {className: 'sprite-sm'})}
                <div class="tiny">${esc(entry.species.name)}</div>
                ${rule ? `<div class="tiny dim">${esc(Dex.evolutionLabel(rule))}</div>` : ''}
              </div>`;
            }).join('')}</div>`
          : '<div class="small dim">This Pokémon does not evolve.</div>'}

        <h4 style="margin-top:.7rem">Level-up moves</h4>
        <div class="scroll-y" style="max-height:220px">
          <table class="data"><tbody>
            ${levelMoves.map(([id, level]) => {
              const move = Dex.move(id);
              return `<tr><td class="num">${level}</td><td><button class="tiny-btn" data-move="${id}">${esc(move.name)}</button></td>
                <td>${typeChip(move.type)}</td><td>${categoryChip(move.category)}</td>
                <td class="num">${move.basePower || '—'}</td></tr>`;
            }).join('')}
          </tbody></table>
        </div>

        <h4 style="margin-top:.7rem">Other legal moves (${otherMoves.length})</h4>
        <div class="scroll-y" style="max-height:170px">
          <div class="row" style="gap:.2rem">
            ${otherMoves.sort((a, b) => Dex.move(a).name.localeCompare(Dex.move(b).name)).map(id =>
              `<button class="tiny-btn" data-move="${id}">${esc(Dex.move(id).name)}</button>`).join('')}
          </div>
        </div>
      </div>`;
  }

  function bindDetail(node) {
    // The chosen forme is per-entry, not sticky: `drawDetail` clears it when the
    // selection changes, so opening Charizard after looking at Blastoise-Mega
    // does not land on a forme that has nothing to do with it.
    UI.$$('[data-forme]', node).forEach(button => {
      button.onclick = () => { state.forme = button.dataset.forme || null; redrawDetail(node); };
    });
    UI.$$('[data-move]', node).forEach(button => {
      button.onclick = () => showMove(button.dataset.move);
    });
    UI.$$('[data-ability]', node).forEach(button => {
      button.onclick = () => showAbility(button.dataset.ability);
    });
    // Stat display mode is remembered across entries, so comparing two species
    // at the same level does not mean re-picking the mode each time.
    UI.$$('[data-statmode]', node).forEach(button => {
      button.onclick = () => { state.statMode = button.dataset.statmode; redrawDetail(node); };
    });
    // Cries play on click here rather than automatically on every entry:
    // browsing the Pokédex should not become a wall of noise.
    UI.$$('[data-cry]', node).forEach(button => {
      button.onclick = () => UI.playCry(button.dataset.cry);
    });
    UI.$$('[data-statlevel]', node).forEach(button => {
      button.onclick = () => { state.statLevel = +button.dataset.statlevel; redrawDetail(node); };
    });
  }

  /** Re-render just the detail pane in place, keeping the list scroll position. */
  function redrawDetail(node) {
    if (!state.selected) return;
    node.innerHTML = speciesPanel(state.selected, state.forme);
    bindDetail(node);
  }

  function showMove(moveId) {
    const move = Dex.move(moveId);
    const users = Dex.allSpecies.filter(s => s.learnset[move.id] !== undefined);
    UI.openModal(`
      <h2>${esc(move.name)}</h2>
      <div class="row-tight" style="margin-bottom:.5rem">${typeChip(move.type)} ${categoryChip(move.category)}
        <span class="tag mono">${move.basePower || '—'} BP</span>
        <span class="tag mono">${move.accuracy == null ? 'Never misses' : move.accuracy + '%'}</span>
        <span class="tag mono">${move.pp} PP</span>
        ${move.priority ? `<span class="tag">Priority ${move.priority > 0 ? '+' : ''}${move.priority}</span>` : ''}
      </div>
      <p>${esc(move.desc || move.shortDesc)}</p>
      <div class="row" style="gap:.25rem;margin-bottom:.5rem">
        ${Object.entries(move.flags || {}).filter(([, v]) => v).map(([flag]) => `<span class="tag">${esc(flag)}</span>`).join('')}
      </div>
      <div class="small dim">Learned by ${UI.plural(users.length, 'species')}.</div>`, {});
  }

  function showAbility(abilityId) {
    const ability = Dex.ability(abilityId);
    if (!ability) return;
    /*
     * Counted over `packagedSpecies`, not `allSpecies`. `allSpecies` is the
     * 1,178 *selectable* species and excludes every `transformOnly` Mega forme,
     * so an ability that only exists on one — Delta Stream, and the six Legends:
     * Z-A abilities — reported "0 species can have it" while being perfectly
     * reachable by Mega Evolving. The Mega-only ones are named as such rather
     * than silently folded in, since "which Pokémon has this" and "which
     * Pokémon can I pick" are different questions.
     */
    const users = Dex.packagedSpecies.filter(s => Dex.hasAbility(s, ability.id));
    const transformOnly = users.filter(s => s.transformOnly);
    UI.openModal(`
      <h2>${esc(ability.name)}</h2>
      ${RedGPT.Abilities.isSimulated(ability.id) ? '' : '<p><span class="tag warn">Not simulated in this build</span></p>'}
      <p>${esc(ability.desc)}</p>
      <div class="small dim">${UI.plural(users.length, 'species')} can have it${
  transformOnly.length ? `, ${transformOnly.length === users.length ? 'all' : transformOnly.length} of them only by transforming (${
    transformOnly.map(s => esc(s.name)).join(', ')})` : ''}.</div>`, {});
  }

  global.RedGPT.UI.DexBrowser = {render, speciesPanel, showMove, showAbility, state};
})(typeof window !== 'undefined' ? window : globalThis);
