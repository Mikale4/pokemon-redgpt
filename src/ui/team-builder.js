/**
 * Competitive Team Builder.
 *
 * Editing operates on a working copy of the team; nothing is written to storage
 * until Save. Validation runs live and reports problems without ever silently
 * repairing the team — "Fix legality" is an explicit button.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const UI = RedGPT.UI;
  const Dex = RedGPT.Dex;
  const PokemonLib = RedGPT.Pokemon;
  const Store = RedGPT.Store;
  const Validation = RedGPT.Validation;
  const TeamText = RedGPT.TeamText;
  const {esc, typeChips, typeChip, categoryChip, monSprite, itemIcon} = UI;

  const STATS = Dex.STATS;

  const EV_SHORTCUTS = [
    {label: 'Max Atk', evs: {atk: 252, spe: 252, hp: 4}},
    {label: 'Max SpA', evs: {spa: 252, spe: 252, hp: 4}},
    {label: 'Max Spe', evs: {spe: 252, atk: 252, hp: 4}},
    {label: 'Phys wall', evs: {hp: 252, def: 252, spd: 4}},
    {label: 'Spec wall', evs: {hp: 252, spd: 252, def: 4}},
    {label: 'Reset EVs', evs: {}},
  ];

  class TeamBuilder {
    constructor(root, {teamId, onExit, onSaved}) {
      this.root = root;
      this.onExit = onExit;
      this.onSaved = onSaved;
      const save = Store.load();
      const existing = save.arena.teams.find(t => t.id === teamId);
      this.original = existing || Store.createTeam({name: 'New team', format: save.profile.settings.defaultFormat || 'tierou'});
      this.team = JSON.parse(JSON.stringify(this.original));
      this.isNew = !existing;
      this.selected = this.team.sets.length ? 0 : -1;
      this.dirty = false;
    }

    mount() { this.render(); }

    markDirty() { this.dirty = true; }

    /* ------------------------------ render ------------------------------ */

    render() {
      const validation = Validation.validateTeam(this.team, this.team.format);
      this.root.innerHTML = `
        <div class="view-pad">
          <div class="row" style="margin-bottom:.7rem">
            <button id="tbBack">← Teams</button>
            <input id="tbName" type="text" value="${esc(this.team.name)}" style="max-width:260px" maxlength="40" aria-label="Team name">
            <select id="tbFormat" style="max-width:210px" aria-label="Format">
              ${RedGPT.Formats.list().filter(f => !f.generated).map(f =>
                `<option value="${f.id}" ${f.id === this.team.format ? 'selected' : ''}>${esc(f.name)}</option>`).join('')}
            </select>
            <span class="tag ${validation.valid ? 'good' : 'bad'}">${validation.valid ? 'Legal' : `${validation.errors.length} problem${validation.errors.length === 1 ? '' : 's'}`}</span>
            <span class="spacer"></span>
            <button id="tbImport">Import</button>
            <button id="tbExport">Export</button>
            <button id="tbSave" class="primary">Save team</button>
          </div>

          <div class="builder">
            <div>
              <div class="panel tight">
                <div class="panel-head"><h3>Roster</h3><div class="spacer"></div><span class="tiny mono">${this.team.sets.length}/6</span></div>
                <div class="builder-list" id="tbSlots"></div>
                <button id="tbAdd" style="width:100%;margin-top:.4rem" ${this.team.sets.length >= 6 ? 'disabled' : ''}>+ Add Pokémon</button>
              </div>
              <div class="panel tight validation" style="margin-top:.6rem" id="tbValidation"></div>
            </div>
            <div id="tbEditor"></div>
          </div>
        </div>`;

      UI.$('#tbBack', this.root).onclick = () => this.exit();
      UI.$('#tbName', this.root).oninput = event => { this.team.name = event.target.value; this.markDirty(); };
      UI.$('#tbFormat', this.root).onchange = event => { this.team.format = event.target.value; this.markDirty(); this.render(); };
      UI.$('#tbSave', this.root).onclick = () => this.save();
      UI.$('#tbImport', this.root).onclick = () => this.openImport();
      UI.$('#tbExport', this.root).onclick = () => this.openExport();
      UI.$('#tbAdd', this.root).onclick = () => this.addSet();

      this.renderSlots();
      this.renderValidation(validation);
      this.renderEditor();
    }

    renderSlots() {
      const node = UI.$('#tbSlots', this.root);
      node.innerHTML = this.team.sets.map((set, index) => {
        // The roster shows what the held item turns it into: a Charizard with a
        // Charizardite Y is drawn as Mega Charizard Y, typing and all.
        const species = Dex.species(set.species);
        const forme = RedGPT.Mechanics.heldForme(set);
        // ...and a chosen skin shows here too, when no forme item overrides it.
        const shown = forme ? Dex.species(forme.id) : Dex.species(Dex.skinnedSpecies(set));
        return `
          <button class="slot-btn ${index === this.selected ? 'active' : ''}" data-slot="${index}">
            ${monSprite(shown, {className: 'sprite-sm'})}
            <span style="flex:1;min-width:0;text-align:left">
              <span class="slot-name">${esc(PokemonLib.displayName(set))}</span><br>
              ${typeChips(shown.types)}
            </span>
            ${set.item ? itemIcon(set.item) : ''}
          </button>`;
      }).join('') || '<div class="small dim" style="padding:.4rem">No Pokémon yet.</div>';

      UI.$$('[data-slot]', node).forEach(button => {
        button.onclick = () => { this.selected = +button.dataset.slot; this.render(); };
      });
    }

    renderValidation(validation) {
      const node = UI.$('#tbValidation', this.root);
      const errors = validation.errors;
      const warnings = validation.warnings;
      if (!errors.length && !warnings.length) {
        node.innerHTML = `<div class="small" style="color:var(--green)">This team is legal for ${esc(validation.format.name)}.</div>`;
        return;
      }
      node.innerHTML = `
        ${errors.length ? `<div class="err"><h4 style="color:#ff9a90">Illegal</h4><ul>${errors.map(e => `<li>${esc(e.message)}</li>`).join('')}</ul></div>` : ''}
        ${warnings.length ? `<div class="warn" style="margin-top:.4rem"><h4 style="color:var(--yellow)">Notes</h4><ul>${warnings.map(w => `<li>${esc(w.message)}</li>`).join('')}</ul></div>` : ''}
        ${errors.length ? `<button id="tbAutoFix" style="margin-top:.5rem;width:100%">Fix legality automatically</button>` : ''}`;
      const fix = UI.$('#tbAutoFix', node);
      if (fix) {
        fix.onclick = () => UI.confirmDialog('Auto-fix this team?',
          'Illegal species, abilities, moves and EV spreads will be replaced or removed. This cannot be undone.',
          () => {
            const result = Validation.autoFix(this.team, this.team.format);
            this.team.sets = result.sets;
            this.selected = Math.min(this.selected, this.team.sets.length - 1);
            this.markDirty();
            this.render();
            UI.toast(result.changes.length ? `Applied ${result.changes.length} change(s).` : 'Nothing needed changing.');
          }, {confirmLabel: 'Auto-fix'});
      }
    }

    renderEditor() {
      const node = UI.$('#tbEditor', this.root);
      const set = this.team.sets[this.selected];
      if (!set) {
        node.innerHTML = `<div class="empty-state">Select a Pokémon on the left, or add one to begin building.</div>`;
        return;
      }
      const species = Dex.species(set.species);
      /*
       * What the held item makes it. The card draws this forme's sprite,
       * typing, BST and stats, because that is what the player is actually
       * bringing — a Groudon holding a Red Orb is Primal Groudon from the moment
       * it switches in, and an Arceus holding a Splash Plate is a Water type
       * rather than the Normal one the species list says (§8's Arceus bug).
       *
       * Everything the *set* owns stays on the base species: the species field,
       * the ability list, the legal move pool and the EV editor. A Mega forme is
       * not selectable (§5), so the base forme is what is being edited — the
       * forme is a preview of the result, never an input.
       */
      const forme = RedGPT.Mechanics.heldForme(set);
      /*
       * A held forme wins over a chosen skin, and it has to: a Charizardite Y
       * Charizard is drawn as Mega Charizard Y, and the Mega has its own art.
       * The skin is what the *base* looks like, so it only shows when no forme
       * item is overriding the picture.
       */
      const shown = forme ? Dex.species(forme.id) : Dex.species(Dex.skinnedSpecies(set));
      const skins = Dex.skinsFor(set.species);
      const stats = PokemonLib.calcStats(forme ? Object.assign({}, set, {species: shown.id}) : set);
      const evTotal = PokemonLib.evTotal(set.evs);
      const format = RedGPT.Formats.get(this.team.format);
      const abilities = Dex.abilityList(species);
      const ability = Dex.ability(set.ability);
      // The forme's ability replaces the holder's in battle, so say so rather
      // than leaving the dropdown quietly contradicting the stat line.
      const liveAbility = RedGPT.Mechanics.formeAbility(set, forme);
      const abilityChanges = forme && Dex.toID(liveAbility) !== Dex.toID(set.ability);
      const item = set.item ? Dex.item(set.item) : null;

      node.innerHTML = `
        <div class="panel">
          <div class="panel-head">
            ${monSprite(shown, {className: 'sprite-md'})}
            <div>
              <h2 style="margin:0">${esc(species.name)}${forme ? ` <span class="tiny dim">as ${esc(shown.name)}</span>` : ''}</h2>
              <div class="row-tight">${typeChips(shown.types)}
                <span class="tiny mono">#${String(shown.num).padStart(3, '0')} · BST ${shown.bst}</span>
                ${shown.nonstandard ? `<span class="tag warn">${esc(shown.nonstandard)}-gen forme</span>` : ''}
                ${shown.powerClass === 'restricted' ? '<span class="tag warn">Restricted</span>' : ''}
              </div>
              ${forme ? `<div class="tiny dim">${forme.automatic
    ? `Enters battle as ${esc(shown.name)} — ${esc(forme.when)}.`
    : `Mega Evolves into ${esc(shown.name)} in battle, once per side.`}</div>` : ''}
            </div>
            <div class="spacer"></div>
            <button id="tbMoveUp" ${this.selected === 0 ? 'disabled' : ''} title="Move up">↑</button>
            <button id="tbMoveDown" ${this.selected >= this.team.sets.length - 1 ? 'disabled' : ''} title="Move down">↓</button>
            <button id="tbDuplicate" ${this.team.sets.length >= 6 ? 'disabled' : ''}>Duplicate</button>
            <button id="tbRemove" class="danger">Remove</button>
          </div>

          <div class="set-editor">
            <div>
              <h4>Identity</h4>
              <div class="picker"><label class="field"><span>Species / forme</span>
                <input id="fSpecies" type="text" value="${esc(species.name)}" autocomplete="off"></label></div>
              <label class="field"><span>Nickname</span>
                <input id="fNickname" type="text" value="${esc(set.nickname || '')}" placeholder="${esc(species.name)}" maxlength="18"></label>
              <div class="row">
                <label class="field" style="flex:1"><span>Level</span>
                  <input id="fLevel" type="number" min="1" max="100" value="${set.level}"></label>
                <label class="field" style="flex:1"><span>Gender</span>
                  <select id="fGender" ${species.genderRatio ? '' : 'disabled'}>
                    ${['M', 'F', 'N'].map(g => `<option value="${g}" ${set.gender === g ? 'selected' : ''}>${g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Genderless'}</option>`).join('')}
                  </select></label>
              </div>
              ${skins.length > 1 ? `<label class="field"><span>Appearance</span>
                <select id="fSkin">${skins.map(skin =>
    `<option value="${esc(skin.id)}" ${skin.id === Dex.skinnedSpecies(set) ? 'selected' : ''}>${esc(skin.name)}</option>`).join('')}
                </select></label>
              <div class="tiny dim">Looks only — every appearance battles identically.</div>` : ''}
              ${format.rules.forceLevel ? `<div class="tiny">${esc(format.name)} sets every Pokémon to level ${format.rules.forceLevel} in battle.</div>` : ''}
            </div>

            <div>
              <h4>Build</h4>
              <label class="field"><span>Ability</span>
                <select id="fAbility">${abilities.map(name =>
                  `<option value="${esc(name)}" ${Dex.toID(name) === Dex.toID(set.ability) ? 'selected' : ''}>${esc(name)}${RedGPT.Abilities.isSimulated(name) ? '' : ' — not simulated'}</option>`).join('')}
                </select></label>
              <div class="tiny" style="min-height:2.2em">${abilityChanges
    ? `<b>In battle: ${esc(liveAbility)}</b> — ${esc(shown.name)}'s Ability replaces this one. ${esc(Dex.ability(liveAbility)?.shortDesc || '')}`
    : esc(ability?.shortDesc || '')}</div>

              <div class="picker"><label class="field"><span>Held item</span>
                <input id="fItem" type="text" value="${esc(item?.name || '')}" placeholder="None" autocomplete="off"></label></div>
              <div class="tiny" style="min-height:2.2em">
                ${item ? esc(item.shortDesc) : 'No held item.'}
                ${item && !RedGPT.Items.isSimulated(item.id) ? '<span class="tag warn">No battle effect in this build</span>' : ''}
              </div>

              <label class="field"><span>Nature</span>
                <select id="fNature">${Object.values(Dex.allNatures).sort((a, b) => a.name.localeCompare(b.name)).map(nature =>
                  `<option value="${nature.id}" ${nature.id === set.nature ? 'selected' : ''}>${esc(UI.natureLabel(nature.id))}</option>`).join('')}
                </select></label>

              ${format.rules.tera ? `<label class="field"><span>Tera Type</span>
                <select id="fTera">${Dex.TYPES.map(type =>
                  `<option value="${type}" ${type === set.teraType ? 'selected' : ''}>${type}</option>`).join('')}
                </select></label>` : '<div class="tiny">Terastallization is disabled in this format.</div>'}
            </div>

            <div>
              <h4>Moves</h4>
              <div id="moveSlots"></div>
              <div class="tiny">${Dex.legalMoveList(species).length} legal moves available.</div>
            </div>

            <div>
              <h4>EVs — ${evTotal}/${PokemonLib.EV_TOTAL_LIMIT}</h4>
              <div id="evEditor"></div>
              <div class="row" style="margin-top:.35rem">
                ${EV_SHORTCUTS.map((s, i) => `<button class="tiny-btn" data-evpreset="${i}">${esc(s.label)}</button>`).join('')}
              </div>
              <h4 style="margin-top:.8rem">IVs</h4>
              <div id="ivEditor"></div>
              <div class="row" style="margin-top:.35rem">
                <button class="tiny-btn" data-ivpreset="max">31 all</button>
                <button class="tiny-btn" data-ivpreset="zeroatk">0 Atk</button>
                <button class="tiny-btn" data-ivpreset="zerospe">0 Spe</button>
                <button class="tiny-btn" data-ivpreset="zeroboth">0 Atk &amp; Spe</button>
              </div>
            </div>

            <div>
              <h4>Calculated stats — Lv.${set.level}${forme ? ` as ${esc(shown.name)}` : ''}</h4>
              ${STATS.map(stat => {
                const nature = Dex.nature(set.nature);
                const cls = nature.plus === stat && nature.minus !== stat ? 'plus' : nature.minus === stat && nature.plus !== stat ? 'minus' : '';
                const width = Math.min(100, Math.round(100 * stats[stat] / 600));
                return `<div class="stat-line ${cls}">
                  <span class="tiny">${Dex.STAT_SHORT[stat]}</span>
                  <span class="bar"><i style="width:${width}%"></i></span>
                  <span class="value">${stats[stat]}</span>
                </div>`;
              }).join('')}
              <div class="tiny" style="margin-top:.3rem">Base stats: ${STATS.map(s => `${Dex.STAT_SHORT[s]} ${shown.baseStats[s]}`).join(' · ')}</div>
              ${forme ? `<div class="tiny dim">${esc(species.name)} without the ${esc(item?.name || 'item')}: ${STATS.map(s => `${Dex.STAT_SHORT[s]} ${species.baseStats[s]}`).join(' · ')}</div>` : ''}
            </div>
          </div>
        </div>`;

      this.bindEditor(set, species);
      this.renderMoveSlots(set, species);
      this.renderEvEditor(set, species);
    }

    bindEditor(set, species) {
      const root = this.root;
      const rerender = () => { this.markDirty(); this.render(); };

      UI.$('#tbRemove', root).onclick = () => {
        this.team.sets.splice(this.selected, 1);
        this.selected = Math.min(this.selected, this.team.sets.length - 1);
        rerender();
      };
      UI.$('#tbDuplicate', root).onclick = () => {
        this.team.sets.splice(this.selected + 1, 0, JSON.parse(JSON.stringify(set)));
        this.selected++;
        rerender();
      };
      UI.$('#tbMoveUp', root).onclick = () => {
        const [item] = this.team.sets.splice(this.selected, 1);
        this.team.sets.splice(this.selected - 1, 0, item);
        this.selected--;
        rerender();
      };
      UI.$('#tbMoveDown', root).onclick = () => {
        const [item] = this.team.sets.splice(this.selected, 1);
        this.team.sets.splice(this.selected + 1, 0, item);
        this.selected++;
        rerender();
      };

      const speciesInput = UI.$('#fSpecies', root);
      UI.attachPicker(speciesInput, {
        source: query => UI.searchIndex(Dex.searchIndex, query),
        render: entry => `${monSprite(entry.id, {className: 'sprite-sm'})}<span class="pk-name">${esc(entry.name)}</span>
          ${typeChips(entry.types)}<span class="tiny mono">${entry.bst}</span>`,
        onPick: entry => {
          const next = Dex.species(entry.id);
          set.species = next.id;
          if (!Dex.hasAbility(next, set.ability)) set.ability = Dex.abilityList(next)[0] || 'No Ability';
          set.moves = set.moves.filter(id => Dex.canLearn(next, id));
          if (!set.moves.length) set.moves = PokemonLib.fillMoves(set).moves;
          set.teraType = next.types[0];
          set.gender = PokemonLib.defaultGender(next);
          rerender();
        },
      });

      UI.$('#fNickname', root).oninput = event => { set.nickname = event.target.value.slice(0, 18) || null; this.markDirty(); this.renderSlots(); };
      UI.$('#fLevel', root).onchange = event => {
        set.level = Math.max(1, Math.min(100, Math.round(+event.target.value) || 100));
        rerender();
      };
      const gender = UI.$('#fGender', root);
      if (gender) gender.onchange = event => { set.gender = event.target.value; this.markDirty(); };
      const skin = UI.$('#fSkin', root);
      // Stored as null for the default appearance rather than as the species'
      // own id, so a set that never touched the picker stays byte-identical to
      // one saved before skins existed.
      if (skin) skin.onchange = event => {
        set.skin = event.target.value === Dex.toID(set.species) ? null : event.target.value;
        rerender();
      };
      UI.$('#fAbility', root).onchange = event => { set.ability = event.target.value; rerender(); };
      UI.$('#fNature', root).onchange = event => { set.nature = event.target.value; rerender(); };
      const tera = UI.$('#fTera', root);
      if (tera) tera.onchange = event => { set.teraType = event.target.value; this.markDirty(); };

      const itemInput = UI.$('#fItem', root);
      UI.attachPicker(itemInput, {
        source: query => {
          const list = UI.searchIndex(Dex.itemSearchIndex, query);
          return query ? list : [{id: '', name: 'None', search: ''}, ...list];
        },
        render: entry => entry.id
          ? `${itemIcon(entry.id)}<span class="pk-name">${esc(entry.name)}</span><span class="tiny">${esc(Dex.item(entry.id).shortDesc.slice(0, 60))}</span>`
          : `<span class="pk-name">None</span>`,
        onPick: entry => { set.item = entry.id || null; rerender(); },
      });
      itemInput.onblur = () => {
        setTimeout(() => {
          const value = itemInput.value.trim();
          if (!value) { if (set.item) { set.item = null; rerender(); } }
        }, 150);
      };
    }

    renderMoveSlots(set, species) {
      const node = UI.$('#moveSlots', this.root);
      const slots = [0, 1, 2, 3];
      node.innerHTML = slots.map(index => {
        const moveId = set.moves[index];
        const move = moveId ? Dex.move(moveId) : null;
        // The set's ability decides the move's real type — an Aerilate holder's
        // Tackle is a Flying move. Move slots re-render when the ability
        // changes, so switching ability updates these chips immediately.
        const shown = move ? RedGPT.Abilities.displayMoveType(set.ability, move) : null;
        // Pixilate and friends multiply damage rather than editing the move's
        // base power, so show both: what the move is, and what it hits for.
        const power = move ? RedGPT.Abilities.displayBasePower(set.ability, move) : 0;
        const boosted = move && power !== move.basePower;
        return `
          <div class="picker" style="margin-bottom:.3rem">
            <input type="text" data-moveinput="${index}" value="${esc(move ? move.name : '')}" placeholder="Move ${index + 1}" autocomplete="off">
            ${move ? `<div class="move-meta" style="padding:.1rem .2rem">
              ${typeChip(shown)} ${categoryChip(move.category)}
              <span class="mono${boosted ? ' boosted' : ''}"${
  boosted ? ` title="${esc(set.ability)} multiplies this move's damage by ${(power / move.basePower).toFixed(2)}x. Its base power is still ${move.basePower}."` : ''}>${
  boosted ? `<s>${move.basePower}</s> ${power}` : (move.basePower || '—')} BP</span>
              <span class="mono">${move.accuracy == null ? '∞' : move.accuracy + '%'}</span>
              <span class="mono">${move.pp} PP</span>
              <span class="spacer"></span>
              <button class="tiny-btn" data-clearmove="${index}">×</button>
            </div>
            <div class="tiny" style="padding:0 .2rem .2rem">${esc(move.shortDesc)}</div>` : ''}
          </div>`;
      }).join('');

      const legal = Dex.legalMoveList(species);
      const legalSet = new Set(legal);
      slots.forEach(index => {
        const input = UI.$(`[data-moveinput="${index}"]`, node);
        UI.attachPicker(input, {
          source: query => UI.searchIndex(Dex.moveSearchIndex, query, {extra: entry => legalSet.has(entry.id)}),
          render: entry => {
            const move = Dex.move(entry.id);
            const shownType = RedGPT.Abilities.displayMoveType(set.ability, move);
            return `<span class="pk-name">${esc(move.name)}</span>${typeChip(shownType)}${categoryChip(move.category)}
              <span class="tiny mono">${move.basePower || '—'}/${move.accuracy == null ? '∞' : move.accuracy}</span>`;
          },
          onPick: entry => {
            set.moves[index] = entry.id;
            set.moves = set.moves.filter(Boolean);
            this.markDirty();
            this.render();
          },
        });
      });
      UI.$$('[data-clearmove]', node).forEach(button => {
        button.onclick = () => {
          set.moves.splice(+button.dataset.clearmove, 1);
          this.markDirty();
          this.render();
        };
      });
    }

    renderEvEditor(set, species) {
      const evNode = UI.$('#evEditor', this.root);
      const ivNode = UI.$('#ivEditor', this.root);
      const total = PokemonLib.evTotal(set.evs);
      const remaining = PokemonLib.EV_TOTAL_LIMIT - total;

      evNode.innerHTML = STATS.map(stat => `
        <div class="ev-row">
          <span class="ev-label">${Dex.STAT_SHORT[stat]}</span>
          <input type="range" min="0" max="252" step="4" value="${set.evs[stat]}" data-ev="${stat}">
          <span class="ev-total">${PokemonLib.calcStats(set)[stat]}</span>
          <input type="number" min="0" max="252" value="${set.evs[stat]}" data-evnum="${stat}">
        </div>`).join('') +
        `<div class="tiny ${remaining < 0 ? '' : ''}" style="color:${remaining < 0 ? '#ff9a90' : 'var(--text-dim)'}">
          ${remaining >= 0 ? `${remaining} EVs remaining` : `${-remaining} EVs over the limit`}</div>`;

      ivNode.innerHTML = STATS.map(stat => `
        <div class="ev-row">
          <span class="ev-label">${Dex.STAT_SHORT[stat]}</span>
          <input type="range" min="0" max="31" value="${set.ivs[stat]}" data-iv="${stat}">
          <span class="ev-total">${set.ivs[stat]}</span>
          <input type="number" min="0" max="31" value="${set.ivs[stat]}" data-ivnum="${stat}">
        </div>`).join('');

      const update = () => { this.markDirty(); this.renderEditor(); };
      UI.$$('[data-ev]', evNode).forEach(input => {
        input.oninput = () => { set.evs[input.dataset.ev] = Math.max(0, Math.min(252, +input.value)); update(); };
      });
      UI.$$('[data-evnum]', evNode).forEach(input => {
        input.onchange = () => { set.evs[input.dataset.evnum] = Math.max(0, Math.min(252, Math.round(+input.value) || 0)); update(); };
      });
      UI.$$('[data-iv]', ivNode).forEach(input => {
        input.oninput = () => { set.ivs[input.dataset.iv] = Math.max(0, Math.min(31, +input.value)); update(); };
      });
      UI.$$('[data-ivnum]', ivNode).forEach(input => {
        input.onchange = () => { set.ivs[input.dataset.ivnum] = Math.max(0, Math.min(31, Math.round(+input.value) || 0)); update(); };
      });

      UI.$$('[data-evpreset]', this.root).forEach(button => {
        button.onclick = () => {
          const preset = EV_SHORTCUTS[+button.dataset.evpreset];
          set.evs = Object.assign(PokemonLib.zeroStats(), preset.evs);
          update();
        };
      });
      UI.$$('[data-ivpreset]', this.root).forEach(button => {
        button.onclick = () => {
          const mode = button.dataset.ivpreset;
          set.ivs = PokemonLib.maxIVs();
          if (mode === 'zeroatk' || mode === 'zeroboth') set.ivs.atk = 0;
          if (mode === 'zerospe' || mode === 'zeroboth') set.ivs.spe = 0;
          update();
        };
      });
      void species;
    }

    /* ------------------------------ actions ------------------------------ */

    addSet() {
      if (this.team.sets.length >= 6) return;
      const pool = RedGPT.Formats.speciesPool(this.team.format);
      const species = pool.find(s => s.id === 'pikachu') || pool[0];
      const base = PokemonLib.normalizeSet({species: species.id, level: RedGPT.Formats.get(this.team.format).rules.forceLevel || 100});
      this.team.sets.push(PokemonLib.fillMoves(base));
      this.selected = this.team.sets.length - 1;
      this.markDirty();
      this.render();
    }

    save() {
      this.team.updatedAt = new Date().toISOString();
      const result = Store.update(data => {
        const index = data.arena.teams.findIndex(t => t.id === this.team.id);
        if (index >= 0) data.arena.teams[index] = Store.normalizeTeam(this.team);
        else data.arena.teams.push(Store.normalizeTeam(this.team));
        data.arena.activeTeamId = this.team.id;
      });
      if (!result.ok) { UI.toast(`Save failed: ${result.error}`, {error: true}); return; }
      this.dirty = false;
      this.isNew = false;
      UI.toast(`Saved "${this.team.name}".`);
      if (this.onSaved) this.onSaved(this.team);
    }

    exit() {
      if (!this.dirty) { this.onExit(); return; }
      UI.confirmDialog('Discard unsaved changes?', 'This team has unsaved edits.', () => this.onExit(), {confirmLabel: 'Discard', danger: true});
    }

    openExport() {
      const text = TeamText.exportTeam(this.team);
      UI.openModal(`
        <h2>Export "${esc(this.team.name)}"</h2>
        <p class="small dim">Plain-text team format. Copy it anywhere, or download it as a file.</p>
        <textarea id="exportText" rows="18" readonly>${esc(text)}</textarea>
        <div class="row" style="margin-top:.6rem;justify-content:flex-end">
          <button id="expCopy">Copy to clipboard</button>
          <button id="expDownload">Download .txt</button>
          <button id="expJson">Download JSON</button>
          <button id="expClose" class="primary">Done</button>
        </div>`, {
        wide: true,
        onOpen: body => {
          body.querySelector('#exportText').select();
          body.querySelector('#expCopy').onclick = () => UI.copyText(text).then(ok => UI.toast(ok ? 'Team copied.' : 'Clipboard unavailable — select the text manually.', {error: !ok}));
          body.querySelector('#expDownload').onclick = () => UI.downloadText('redgpt-team.txt', text);
          body.querySelector('#expJson').onclick = () => UI.downloadText('redgpt-team.json', JSON.stringify(this.team, null, 2), 'application/json');
          body.querySelector('#expClose').onclick = () => UI.closeModal(true);
        },
      });
    }

    openImport() {
      UI.openModal(`
        <h2>Import team</h2>
        <p class="small dim">Paste a team in the standard text format. Each Pokémon is separated by a blank line.</p>
        <textarea id="importText" rows="16" placeholder="Gengar @ Focus Sash&#10;Ability: Cursed Body&#10;Tera Type: Ghost&#10;EVs: 4 Def / 252 SpA / 252 Spe&#10;Timid Nature&#10;IVs: 0 Atk&#10;- Shadow Ball&#10;- Sludge Bomb&#10;- Focus Blast&#10;- Destiny Bond"></textarea>
        <div id="importReport" class="validation"></div>
        <div class="row" style="margin-top:.6rem;justify-content:flex-end">
          <button id="impFile">Load from file…</button>
          <button id="impCheck">Check</button>
          <button id="impReplace" class="primary">Replace team</button>
          <button id="impAppend">Append</button>
        </div>`, {
        wide: true,
        onOpen: body => {
          const textarea = body.querySelector('#importText');
          const report = body.querySelector('#importReport');
          const run = () => TeamText.importTeam(textarea.value);
          const show = result => {
            report.innerHTML = `
              <div class="small">Parsed ${UI.plural(result.sets.length, 'set')} from ${UI.plural(result.blocks, 'block')}.</div>
              ${result.errors.length ? `<div class="err"><ul>${result.errors.map(e => `<li>${esc(e)}</li>`).join('')}</ul></div>` : '<div class="small" style="color:var(--green)">No parse errors.</div>'}`;
            return result;
          };
          body.querySelector('#impCheck').onclick = () => show(run());
          body.querySelector('#impFile').onclick = () => UI.pickFile('.txt,text/plain', text => { textarea.value = text; show(run()); });
          body.querySelector('#impReplace').onclick = () => {
            const result = show(run());
            if (!result.sets.length) { UI.toast('Nothing importable was found.', {error: true}); return; }
            this.team.sets = result.sets.slice(0, 6);
            this.selected = 0;
            this.markDirty();
            UI.closeModal(true);
            this.render();
            UI.toast(`Imported ${UI.plural(result.sets.length, 'Pokémon')}.`);
          };
          body.querySelector('#impAppend').onclick = () => {
            const result = show(run());
            if (!result.sets.length) { UI.toast('Nothing importable was found.', {error: true}); return; }
            const space = 6 - this.team.sets.length;
            this.team.sets.push(...result.sets.slice(0, space));
            this.markDirty();
            UI.closeModal(true);
            this.render();
            UI.toast(`Appended ${UI.plural(Math.min(space, result.sets.length), 'Pokémon')}.`);
          };
        },
      });
    }
  }

  global.RedGPT.UI.TeamBuilder = TeamBuilder;
})(typeof window !== 'undefined' ? window : globalThis);
