/**
 * Shared UI helpers: DOM utilities, formatting, sprite fallbacks, modals,
 * toasts and the small reusable widgets (type chips, HP bars, search pickers)
 * that every screen uses.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Dex = RedGPT.Dex;
  const PokemonLib = RedGPT.Pokemon;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

  const TYPE_COLORS = {
    Normal: '#8e8e78', Fire: '#e85a34', Water: '#3d82d8', Electric: '#d8ae1f',
    Grass: '#4f9e48', Ice: '#5cb8c4', Fighting: '#b52f2b', Poison: '#9143a0',
    Ground: '#b8913f', Flying: '#7c78d8', Psychic: '#dc4d82', Bug: '#8a9a17',
    Rock: '#9a8434', Ghost: '#65558e', Dragon: '#5a36bd', Dark: '#57453d',
    Steel: '#7f8993', Fairy: '#d16f96', Stellar: '#5f8f8f',
  };

  const STATUS_NAMES = {brn: 'BRN', psn: 'PSN', tox: 'TOX', par: 'PAR', slp: 'SLP', frz: 'FRZ'};

  /* ------------------------------ formatting ------------------------------ */

  function typeChip(type) {
    return `<span class="type" style="background:${TYPE_COLORS[type] || '#555'}">${esc(type)}</span>`;
  }
  function typeChips(types) {
    return `<span class="types">${(types || []).map(typeChip).join('')}</span>`;
  }
  function categoryChip(category) {
    return `<span class="cat ${esc(category)}">${esc(category)}</span>`;
  }
  function statusPill(status) {
    if (!status) return '';
    return `<span class="status-pill status-${esc(status)}">${STATUS_NAMES[status] || status}</span>`;
  }
  function hpBar(percent, {thin = false} = {}) {
    const value = Math.max(0, Math.min(100, Math.round(percent)));
    const level = value < 25 ? 'low' : value < 50 ? 'mid' : '';
    return `<div class="hpbar ${level} ${thin ? 'thin' : ''}"><i style="width:${value}%"></i></div>`;
  }

  /** Item icon, falling back to a lettered chip when the asset library has none. */
  function itemIcon(itemId) {
    const item = Dex.item(itemId);
    if (!item) return '';
    const src = Dex.spriteItem(item.id);
    if (src) return `<img class="item-icon" src="${src}" alt="" title="${esc(item.name)}" loading="lazy">`;
    const initials = item.name.split(/[\s-]+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return `<span class="item-chip" title="${esc(item.name)}">${esc(initials)}</span>`;
  }

  function monSprite(speciesValue, {back = false, className = 'sprite-md', lazy = true} = {}) {
    const species = Dex.species(speciesValue);
    const src = back ? Dex.spriteBack(species) : Dex.spriteFront(species);
    if (!src) return `<span class="item-chip" title="${esc(species.name)}">?</span>`;
    return `<img class="sprite ${className}" src="${src}" alt="${esc(species.name)}"${lazy ? ' loading="lazy"' : ''}>`;
  }

  function trainerSprite(file, className = 'sprite-lg') {
    if (!file) return '';
    return `<img class="sprite ${className}" src="${Dex.spriteTrainer(file)}" alt="" loading="lazy">`;
  }

  function natureLabel(natureId) {
    const nature = Dex.nature(natureId);
    if (!nature) return '';
    if (!nature.plus || nature.plus === nature.minus) return `${nature.name} (neutral)`;
    return `${nature.name} (+${Dex.STAT_SHORT[nature.plus]} −${Dex.STAT_SHORT[nature.minus]})`;
  }

  function plural(count, singular, pluralForm) {
    return `${count} ${count === 1 ? singular : (pluralForm || singular + 's')}`;
  }

  function relativeTime(iso) {
    if (!iso) return 'never';
    const delta = Date.now() - new Date(iso).getTime();
    const minutes = Math.round(delta / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.round(hours / 24)}d ago`;
  }

  /* ------------------------------ set summaries ------------------------------ */

  function setSummaryRow(set, {showStats = false} = {}) {
    const species = Dex.species(set.species);
    const stats = PokemonLib.calcStats(set);
    return `
      <div class="row" style="gap:.5rem">
        ${monSprite(species, {className: 'sprite-sm'})}
        <div style="flex:1;min-width:0">
          <div class="row-tight"><b>${esc(PokemonLib.displayName(set))}</b> <span class="tiny">Lv.${set.level}</span></div>
          <div class="row-tight">${typeChips(species.types)} ${set.item ? itemIcon(set.item) : ''}</div>
        </div>
        ${showStats ? `<div class="tiny mono">${Dex.STATS.map(s => stats[s]).join('/')}</div>` : ''}
      </div>`;
  }

  /* ------------------------------ modal ------------------------------ */

  let modalOnClose = null;
  let modalLocked = false;

  function openModal(html, {onOpen = null, wide = false, locked = false, onClose = null} = {}) {
    const modal = $('#modal');
    const card = $('#modalCard');
    card.classList.toggle('wide', wide);
    $('#modalBody').innerHTML = html;
    modal.classList.remove('hidden');
    modalLocked = locked;
    modalOnClose = onClose;
    $('#modalClose').style.display = locked ? 'none' : '';
    if (onOpen) onOpen($('#modalBody'));
    return $('#modalBody');
  }

  function closeModal(force = false) {
    if (modalLocked && !force) return false;
    $('#modal').classList.add('hidden');
    $('#modalBody').innerHTML = '';
    modalLocked = false;
    const callback = modalOnClose;
    modalOnClose = null;
    if (callback) callback();
    return true;
  }

  function confirmDialog(title, text, onConfirm, {confirmLabel = 'Confirm', danger = false} = {}) {
    openModal(`
      <h2>${esc(title)}</h2>
      <p class="dim">${esc(text)}</p>
      <div class="row" style="justify-content:flex-end;margin-top:1rem">
        <button data-act="cancel">Cancel</button>
        <button data-act="ok" class="${danger ? 'danger' : 'primary'}">${esc(confirmLabel)}</button>
      </div>`, {
      onOpen(body) {
        body.querySelector('[data-act=cancel]').onclick = () => closeModal();
        body.querySelector('[data-act=ok]').onclick = () => { closeModal(true); onConfirm(); };
      },
    });
  }

  function promptDialog(title, label, value, onSubmit) {
    openModal(`
      <h2>${esc(title)}</h2>
      <label class="field"><span>${esc(label)}</span><input id="promptInput" type="text" value="${esc(value || '')}" maxlength="40"></label>
      <div class="row" style="justify-content:flex-end">
        <button data-act="cancel">Cancel</button>
        <button data-act="ok" class="primary">Save</button>
      </div>`, {
      onOpen(body) {
        const input = body.querySelector('#promptInput');
        input.focus();
        input.select();
        const submit = () => { const v = input.value.trim(); closeModal(true); if (v) onSubmit(v); };
        body.querySelector('[data-act=ok]').onclick = submit;
        body.querySelector('[data-act=cancel]').onclick = () => closeModal();
        input.onkeydown = e => { if (e.key === 'Enter') submit(); };
      },
    });
  }

  /* ------------------------------ toast ------------------------------ */

  let toastTimer = null;
  function toast(message, {error = false, duration = 2800} = {}) {
    const node = $('#toast');
    node.textContent = message;
    node.classList.toggle('error', !!error);
    node.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('show'), duration);
  }

  /* ------------------------------ search picker ------------------------------ */

  /**
   * Attach an incremental search dropdown to an input. Only the top `limit`
   * matches are rendered, so the 1200-species list stays responsive.
   *
   * @param {HTMLInputElement} input
   * @param {object} options `{source, render, onPick, limit, openOnFocus}`
   */
  function attachPicker(input, {source, render, onPick, limit = 40, openOnFocus = true}) {
    const wrap = input.closest('.picker') || input.parentElement;
    let results = document.createElement('div');
    results.className = 'picker-results hidden';
    wrap.appendChild(results);
    let items = [];
    let highlight = 0;

    const close = () => { results.classList.add('hidden'); results.innerHTML = ''; };

    const draw = () => {
      const query = input.value.trim().toLowerCase();
      items = source(query).slice(0, limit);
      if (!items.length) { close(); return; }
      results.innerHTML = items.map((item, index) =>
        `<button type="button" data-index="${index}" class="${index === highlight ? 'highlight' : ''}">${render(item)}</button>`).join('');
      results.classList.remove('hidden');
      $$('button', results).forEach(button => {
        button.onmousedown = event => {
          event.preventDefault();
          onPick(items[+button.dataset.index]);
          close();
        };
      });
    };

    input.addEventListener('input', () => { highlight = 0; draw(); });
    if (openOnFocus) input.addEventListener('focus', () => { highlight = 0; draw(); });
    input.addEventListener('blur', () => setTimeout(close, 120));
    input.addEventListener('keydown', event => {
      if (results.classList.contains('hidden')) return;
      if (event.key === 'ArrowDown') { highlight = Math.min(items.length - 1, highlight + 1); draw(); event.preventDefault(); }
      else if (event.key === 'ArrowUp') { highlight = Math.max(0, highlight - 1); draw(); event.preventDefault(); }
      else if (event.key === 'Enter') { if (items[highlight]) { onPick(items[highlight]); close(); } event.preventDefault(); }
      else if (event.key === 'Escape') close();
    });
    return {redraw: draw, close};
  }

  /** Fuzzy-ish ranked search over a prebuilt index. */
  function searchIndex(index, query, {extra = null} = {}) {
    if (!query) return extra ? index.filter(extra) : index;
    const needle = query.toLowerCase();
    const scored = [];
    for (const entry of index) {
      if (extra && !extra(entry)) continue;
      const name = entry.name.toLowerCase();
      let score = -1;
      if (name === needle) score = 0;
      else if (name.startsWith(needle)) score = 1;
      else if (name.includes(needle)) score = 2;
      else if (entry.search.includes(needle)) score = 3;
      if (score >= 0) scored.push({entry, score});
    }
    scored.sort((a, b) => a.score - b.score || a.entry.name.localeCompare(b.entry.name));
    return scored.map(s => s.entry);
  }

  /* ------------------------------ downloads ------------------------------ */

  function downloadText(filename, text, mime = 'text/plain') {
    const blob = new Blob([text], {type: `${mime};charset=utf-8`});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function copyText(text) {
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
    }
    return Promise.resolve(false);
  }

  function pickFile(accept, onLoad) {
    const input = $('#fileInput');
    input.accept = accept;
    input.value = '';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => onLoad(String(reader.result), file);
      reader.onerror = () => toast('That file could not be read.', {error: true});
      reader.readAsText(file);
    };
    input.click();
  }

  /* --------------------------- move tooltips --------------------------- *
   *
   * Choosing which move to forget is the one Campaign decision made with the
   * least information: the prompt had room for a type chip, a base power and a
   * one-line summary, so PP, priority, the full description and the flags that
   * decide whether a move is worth keeping (contact, sound, punch — the things
   * abilities and items key off) were simply absent. Hovering shows the rest.
   *
   * One shared element rather than a card per button: a prompt can list five
   * moves, and five hidden panels is five copies of the same markup competing
   * for the same corner of the screen.
   */
  const MOVE_TIP_ID = 'moveTip';

  /** The card's contents. Mirrors the Pokédex move modal so the two agree. */
  function moveTipHTML(moveId) {
    const move = RedGPT.Dex.move(moveId);
    if (!move) return '';
    const flags = Object.entries(move.flags || {}).filter(([, on]) => on).map(([flag]) => flag);
    const chance = move.secondary?.chance ?? (move.secondaries && move.secondaries[0]?.chance);
    return `
      <div class="move-tip-head"><b>${esc(move.name)}</b></div>
      <div class="row-tight">${typeChip(move.type)} ${categoryChip(move.category)}
        <span class="tag mono">${move.basePower || '—'} BP</span>
        <span class="tag mono">${move.accuracy == null ? 'Never misses' : `${move.accuracy}%`}</span>
        <span class="tag mono">${move.pp} PP</span>
        ${move.priority ? `<span class="tag">Priority ${move.priority > 0 ? '+' : ''}${move.priority}</span>` : ''}
        ${chance ? `<span class="tag">${chance}% effect</span>` : ''}</div>
      <div class="small" style="margin-top:.35rem">${esc(move.desc || move.shortDesc)}</div>
      ${flags.length ? `<div class="row" style="gap:.2rem;margin-top:.35rem">${
        flags.map(flag => `<span class="tag tiny">${esc(flag)}</span>`).join('')}</div>` : ''}`;
  }

  function moveTipElement() {
    let tip = document.getElementById(MOVE_TIP_ID);
    if (!tip) {
      tip = document.createElement('div');
      tip.id = MOVE_TIP_ID;
      tip.className = 'move-tip';
      tip.setAttribute('role', 'tooltip');
      tip.hidden = true;
      document.body.appendChild(tip);
    }
    return tip;
  }

  function hideMoveTip() {
    const tip = document.getElementById(MOVE_TIP_ID);
    if (tip) tip.hidden = true;
  }

  function showMoveTip(anchor, moveId) {
    const html = moveTipHTML(moveId);
    if (!html) return;
    const tip = moveTipElement();
    tip.innerHTML = html;
    tip.hidden = false;
    /*
     * Positioned against the viewport and flipped when it would overflow, so a
     * move near the bottom of a long prompt list does not open a card the player
     * has to scroll to read — which is worse than the summary it replaced.
     */
    const rect = anchor.getBoundingClientRect();
    const box = tip.getBoundingClientRect();
    const margin = 8;
    /*
     * Prefer below the anchor, flip above when that would overflow, then clamp
     * to the viewport on **both** edges. Clamping only the near edge is not
     * enough: an anchor already below the fold pushes the card further down
     * still, and both the preferred and flipped positions end up off-screen —
     * which is precisely the long-move-list case this exists for.
     */
    const clamp = (value, max) => Math.max(margin, Math.min(value, max - margin));
    let top = rect.bottom + 6;
    if (top + box.height + margin > window.innerHeight) top = rect.top - box.height - 6;
    tip.style.left = `${clamp(rect.left, window.innerWidth - box.width)}px`;
    tip.style.top = `${clamp(top, window.innerHeight - box.height)}px`;
  }

  /**
   * Wire every `[data-movetip="<id>"]` inside `root`.
   *
   * Bound on focus as well as hover, so the card is reachable by keyboard and
   * not only by mouse — these are buttons, and they are already tab targets.
   */
  function attachMoveTips(root) {
    $$('[data-movetip]', root || document).forEach(element => {
      const moveId = element.dataset.movetip;
      if (!moveId) return;
      element.addEventListener('mouseenter', () => showMoveTip(element, moveId));
      element.addEventListener('focus', () => showMoveTip(element, moveId));
      element.addEventListener('mouseleave', hideMoveTip);
      element.addEventListener('blur', hideMoveTip);
      element.addEventListener('click', hideMoveTip);
    });
  }

  /* ------------------------------ audio ------------------------------ *
   *
   * Species cries. The only sound in the project, and the only place that
   * touches the audio APIs — `src/core` may not, for the same reason it may not
   * touch the DOM.
   *
   * Playback is **feature-detected, not try/caught**. `canPlayType` answers
   * whether this browser can play Ogg Vorbis at all, which does three jobs at
   * once: Safari (no Ogg) degrades to silence instead of throwing on every
   * switch, jsdom returns '' so `tests/ui-smoke.js` keeps its zero-console-error
   * guarantee rather than logging "Not implemented" a hundred times, and a real
   * browser gets sound. `play()` still returns a promise that rejects when the
   * user has not interacted with the page yet, so that is swallowed too — an
   * autoplay refusal is expected behaviour, not an error worth surfacing.
   */
  let audioSupported = null;
  function canPlayCries() {
    if (audioSupported !== null) return audioSupported;
    audioSupported = false;
    try {
      if (typeof global.Audio === 'function') {
        const probe = new global.Audio();
        audioSupported = !!(probe.canPlayType && probe.canPlayType('audio/ogg; codecs="vorbis"'));
      }
    } catch { audioSupported = false; }
    return audioSupported;
  }

  function criesEnabled() {
    try {
      const settings = global.RedGPT.Store?.load().profile.settings;
      if (settings && settings.cries === false) return false;
    } catch { /* no save yet — cries are on by default */ }
    return true;
  }

  /** One element, reused: a cry interrupts the previous one rather than stacking. */
  let cryAudio = null;
  function playCry(speciesValue, {volume} = {}) {
    if (!speciesValue || !criesEnabled() || !canPlayCries()) return false;
    const src = global.RedGPT.Dex.cry(speciesValue);
    if (!src) return false;
    try {
      if (!cryAudio) cryAudio = new global.Audio();
      let level = volume;
      if (level == null) {
        const settings = global.RedGPT.Store?.load().profile.settings;
        level = settings && typeof settings.cryVolume === 'number' ? settings.cryVolume : 0.6;
      }
      cryAudio.pause();
      cryAudio.src = src;
      cryAudio.volume = Math.max(0, Math.min(1, level));
      const played = cryAudio.play();
      if (played && typeof played.catch === 'function') played.catch(() => {});
      return true;
    } catch {
      return false;
    }
  }

  global.RedGPT.UI = Object.assign(global.RedGPT.UI || {}, {
    $, $$, esc, TYPE_COLORS, STATUS_NAMES,
    typeChip, typeChips, categoryChip, statusPill, hpBar, itemIcon, monSprite, trainerSprite,
    natureLabel, plural, relativeTime, setSummaryRow,
    openModal, closeModal, confirmDialog, promptDialog, toast,
    attachPicker, searchIndex, downloadText, copyText, pickFile,
    playCry, canPlayCries, criesEnabled,
    attachMoveTips, showMoveTip, hideMoveTip, moveTipHTML,
  });
})(typeof window !== 'undefined' ? window : globalThis);
