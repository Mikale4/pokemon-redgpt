/**
 * Battle presentation.
 *
 * The UI is a pure renderer over `Battle`: it reads `battle.view(side)` and the
 * event stream, and sends commands back through `battle.choose`. It never
 * reaches into battle internals to mutate state, which is what lets the same
 * component drive AI battles, local versus and replay playback.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const UI = RedGPT.UI;
  const Dex = RedGPT.Dex;
  const {esc, typeChips, typeChip, statusPill, hpBar, monSprite, trainerSprite, itemIcon, categoryChip} = UI;

  const BOOST_LABELS = {atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe', accuracy: 'Acc', evasion: 'Eva'};

  /**
   * Field-effect and hazard glyphs.
   *
   * Drawn inline rather than shipped as files: there is no hazard artwork in
   * Assets/, and these inherit the chip's colour through `currentColor`, so they
   * stay legible in both themes and stay colour-coded with the chip they sit in.
   * Paths assume the 16x16 viewBox and the stroke defaults set in styles.css.
   */
  const SHIELD = 'M8 1.8 13.2 4v4.2c0 3-2.2 5.1-5.2 6-3-.9-5.2-3-5.2-6V4Z';
  const CLOUD = 'M4.5 9.1a2.5 2.5 0 0 1 .4-4.97 3.4 3.4 0 0 1 6.45.87A2.25 2.25 0 0 1 11 9.1Z';
  const BOX = 'M2.5 3.5h11v9h-11z';
  const GROUND = 'M1.5 13.2h13';

  const FIELD_ICONS = {
    // Weather
    sun: '<circle cx="8" cy="8" r="3"/><path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3.05 3.05l1.13 1.13M11.82 11.82l1.13 1.13M12.95 3.05l-1.13 1.13M4.18 11.82l-1.13 1.13"/>',
    rain: `<path d="${CLOUD}"/><path d="M5.4 11.3 4.6 13.7M8 11.3l-.8 2.4M10.6 11.3l-.8 2.4"/>`,
    sandstorm: '<path d="M2 5.2c2-1.2 4 1.2 6 0s3.4-1 5 0M2 8.5c2-1.2 4 1.2 6 0s3.4-1 5 0M2 11.8c2-1.2 4 1.2 6 0s3.4-1 5 0"/><circle class="solid" cx="13.6" cy="3.6" r=".9"/><circle class="solid" cx="13.6" cy="13.4" r=".9"/>',
    snow: '<path d="M8 1.5v13M2.4 4.75l11.2 6.5M13.6 4.75 2.4 11.25"/>',
    hail: `<path d="${CLOUD}"/><circle class="solid" cx="5.5" cy="12.4" r="1"/><circle class="solid" cx="8" cy="13.4" r="1"/><circle class="solid" cx="10.5" cy="12.4" r="1"/>`,
    // Terrain
    electric: '<path class="solid" d="M9.2 1.5 4 8.6h3.3L6.8 14.5 12 7.4H8.7Z"/>',
    grassy: `<path d="${GROUND}"/><path d="M3.4 13.2c0-3.4 1.5-5.5 3.2-6.8M7.9 13.2c0-4.3 2-6.9 4.5-8.2M5.7 13.2c0-2.3.7-4.1 1.9-5.4"/>`,
    misty: '<path d="M3 5.4h10M2 8.2h12M4 11h8"/>',
    psychic: '<path d="M11.6 8a3.6 3.6 0 1 1-3.6-3.6 2.5 2.5 0 0 0 0 5 1.4 1.4 0 0 0 0-2.8"/>',
    // Pseudo-weather
    gravity: '<path d="M8 2v8.4M5.2 7.7 8 10.5l2.8-2.8"/><path d="M3 13.6h10"/>',
    trickroom: `<path d="${BOX}"/><path d="M4.9 8h6.2M4.9 8l1.5-1.4M4.9 8l1.5 1.4M11.1 8 9.6 6.6M11.1 8l-1.5 1.4"/>`,
    magicroom: `<path d="${BOX}"/><path class="solid" d="M8 5.4 8.95 7.45 11 8.4 8.95 9.35 8 11.4 7.05 9.35 5 8.4l2.05-.95Z"/>`,
    wonderroom: `<path d="${BOX}"/><path d="M6.5 6v4.2M6.5 10.2 5.4 9M6.5 10.2 7.6 9M9.5 10V5.8M9.5 5.8 8.4 7M9.5 5.8 10.6 7"/>`,
    mudsport: `<path d="${GROUND}"/><path class="solid" d="M9.2 2.2 5 7.6h2.7l-.4 4.6 4.2-5.6H8.9Z"/><path d="M2.4 10.6c1.4-.9 2.8.9 4.2 0"/>`,
    watersport: '<path class="solid" d="M8 2.2c2.2 2.9 3.6 5 3.6 6.6a3.6 3.6 0 0 1-7.2 0c0-1.6 1.4-3.7 3.6-6.6Z"/><path d="M2.2 13.6c1.5-1 3-1 4.5 0s3 1 4.5 0"/>',
    fairylock: '<path d="M4.4 7.2V5.4a3.6 3.6 0 0 1 7.2 0v1.8"/><path d="M3.2 7.2h9.6v6.2H3.2z"/><circle class="solid" cx="8" cy="10.3" r="1.1"/>',
    iondeluge: '<path class="solid" d="M9 1.6 4.6 7.4h2.6l-.6 4.4 4.6-6H8.4Z"/><path d="M2.2 12.8c1.4-.9 2.8.9 4.2 0M9.6 12.8c1.4-.9 2.8.9 4.2 0"/>',
    // Entry hazards
    stealthrock: '<path class="solid" d="M8 2.6 11.6 8.6H4.4Z"/><path class="solid" d="M3 13.4 4.8 10.3 6.6 13.4Z"/><path class="solid" d="M9.4 13.4 11.2 10.3 13 13.4Z"/>',
    spikes: `<path d="${GROUND}"/><path class="solid" d="M3.4 13.2 5.2 7.4 7 13.2Z"/><path class="solid" d="M9 13.2 10.8 7.4l1.8 5.8Z"/>`,
    toxicspikes: `<path d="${GROUND}"/><path class="solid" d="M2.6 13.2 4.3 8.2 6 13.2Z"/><path class="solid" d="M7.6 13.2 9.3 8.2l1.7 5Z"/><circle cx="12.2" cy="4.4" r="2.3"/><circle class="solid" cx="12.2" cy="4.4" r=".9"/>`,
    stickyweb: '<path d="M1.8 1.8 13.6 13.6M1.8 1.8 13.4 6.2M1.8 1.8 6.2 13.4"/><path d="M1.8 6.4A4.6 4.6 0 0 1 6.4 1.8M1.8 10.6A8.8 8.8 0 0 1 10.6 1.8"/>',
    // Screens and side buffs
    reflect: `<path d="${SHIELD}"/>`,
    lightscreen: `<path d="${SHIELD}"/><circle class="solid" cx="8" cy="7.2" r="1.7"/>`,
    auroraveil: `<path d="${SHIELD}"/><path d="M5.2 6.3c1.9-1.2 3.7 1.2 5.6 0M5.2 9c1.9-1.2 3.7 1.2 5.6 0"/>`,
    safeguard: `<path d="${SHIELD}"/><path d="M5.7 7.7 7.4 9.4l3.1-3.3"/>`,
    luckychant: `<path d="${SHIELD}"/><path class="solid" d="M8 5.2 8.8 7l1.9.2-1.4 1.3.4 1.9L8 9.5l-1.7.9.4-1.9L5.3 7.2 7.2 7Z"/>`,
    craftyshield: `<path d="${SHIELD}"/><path d="M8 5.4v4.4M5.9 7.6h4.2"/>`,
    matblock: '<path d="M2.2 5.4h11.6v7.2H2.2z"/><path d="M2.2 8.2h11.6M2.2 10.4h11.6M6 5.4v7.2M10 5.4v7.2"/>',
    mist: '<path d="M2.6 5.4c1.6-1 3.2 1 4.8 0s3.2 1 4.8 0M2.6 8.4c1.6-1 3.2 1 4.8 0s3.2 1 4.8 0M2.6 11.4c1.6-1 3.2 1 4.8 0s3.2 1 4.8 0"/>',
    tailwind: '<path d="M2 5.4h7.2a2 2 0 1 0-2-2M2 8.8h9.3a2.2 2.2 0 1 1-2.2 2.2M2 12.1h4.6"/>',
    // Pending slot effects
    futuresight: '<circle cx="8" cy="8" r="5.8"/><path d="M8 4.6V8l2.4 1.6"/>',
    healingwish: '<path d="M8 13.4S2.5 10 2.5 6.3A3.1 3.1 0 0 1 8 4.5a3.1 3.1 0 0 1 5.5 1.8c0 3.7-5.5 7.1-5.5 7.1Z"/>',
    lunardance: '<path d="M10.7 2.2a6 6 0 1 0 3.1 8.6A6.4 6.4 0 0 1 10.7 2.2Z"/>',
  };

  /** Inline glyph for a field effect; empty string when there is no icon for it. */
  function fieldIcon(key) {
    const paths = FIELD_ICONS[key];
    return paths ? `<svg class="cond-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">${paths}</svg>` : '';
  }

  /**
   * Turn playback timings, in milliseconds.
   *
   * The engine resolves a whole turn synchronously, so without this everything
   * — the lunge, the damage, the faint — lands in one frame. Each event gets a
   * beat so the turn reads as a sequence of actions rather than a diff.
   */
  const BEATS = {
    move: 300, hit: 240, damage: 160, heal: 200, faint: 520,
    switch: 360, boost: 300, status: 240, text: 90, other: 60,
  };
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  /** Playback speeds offered in Spectate Mode. Higher factor = slower. */
  const SPEEDS = [
    {factor: 8, label: '0.12×', title: 'Crawl'},
    {factor: 4, label: '0.25×', title: 'Very slow'},
    {factor: 2, label: '0.5×', title: 'Slow'},
    {factor: 1, label: '1×', title: 'Normal'},
    {factor: 0.5, label: '2×', title: 'Fast'},
    {factor: 0.25, label: '4×', title: 'Very fast'},
  ];

  class BattleView {
    /**
     * @param {HTMLElement} root
     * @param {object} options `{battle, controlSides, onFinish, onExit, showDamage, replay}`
     */
    constructor(root, options) {
      this.root = root;
      this.battle = options.battle;
      this.controlSides = options.controlSides || [0];
      this.onFinish = options.onFinish || null;
      this.onExit = options.onExit || null;
      this.showDamage = options.showDamage !== false;
      this.replay = !!options.replay;
      // Spectate: nobody is controlled, so the view drives both AIs itself.
      this.spectate = !!options.spectate;
      this.paused = false;
      this.spectateRunning = false;
      this.pendingFlip = false;
      let saved = 1;
      try { saved = RedGPT.Store.load().profile.settings.spectateSpeed ?? 1; } catch { /* no save yet */ }
      this.speedFactor = Number(saved) || 1;
      this.localVersus = this.controlSides.length > 1;
      this.perspective = this.controlSides[0] ?? 0;
      this.mode = 'main';
      this.teraArmed = false;
      this.megaArmed = false;
      // Assist Mode auto-battle: off unless the caller turns it on.
      this.autoBattle = !!options.autoBattle;
      // Assist plays at the strongest tier — the player asked the AI to take
      // over, so it should play as well as the AI can.
      this.autoBattleTier = options.autoBattleTier || 'expert';
      this.autoBattlePending = false;
      this.onAutoBattleChange = options.onAutoBattleChange || null;
      // True once the player makes any choice themselves. Campaign reads it to
      // award the "cleared with Assist" unlocks honestly.
      this.playerActedManually = false;
      this.handoffPending = false;
      this.logCursor = 0;
      /*
       * The last Pokémon each side was heard to send out.
       *
       * Per side rather than a set of everything already cried, because a
       * Pokémon that switches out and comes back should cry again — it is being
       * sent out again. Comparing against the *current* occupant is what makes
       * an ordinary re-render silent while a genuine arrival is not.
       */
      this.lastCriedUid = [null, null];
      // The log is collapsed to the latest turns by default and reversed so the
      // newest is on top; the player can open the full history. Held on the view,
      // not in the DOM, because the panel is rebuilt every turn.
      this.logExpanded = false;
      this.finished = false;
      this.previewOrder = null;
      this.replayStep = 0;

      // Turn playback: events emitted during choose() are queued, then replayed
      // on a timer so the field animates instead of snapping to the end state.
      this.animQueue = [];
      this.capturing = false;
      this.animating = false;
      this.endPending = false;
      // Set once an end-screen action fires: the caller navigates away and the
      // root belongs to another screen, so nothing here may render again.
      this.detached = false;
      this.logLimit = null;

      this.unsubscribe = this.battle.on(event => this.handleEvent(event));
    }

    /** Battle animations follow the interface-animation setting and the OS. */
    animationsOn() {
      if (this.replay) return false;
      try {
        if (RedGPT.Store?.load().profile.settings.animations === false) return false;
      } catch { /* no save yet — fall through to the OS preference */ }
      const media = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)');
      return !(media && media.matches);
    }

    destroy() {
      this.detached = true;
      if (this.unsubscribe) this.unsubscribe();
      this.root.innerHTML = '';
    }

    handleEvent(event) {
      // `battle.events` already holds this event, so its length doubles as the
      // log cursor for progressive reveal during playback.
      if (this.capturing) this.animQueue.push({event, upTo: this.battle.events.length});
      if (event.type === 'end' && !this.finished) {
        this.finished = true;
        // Let the turn finish playing before the end screen replaces it. The
        // 'end' event arrives inside choose(), while the queue is still being
        // captured and before playTurn() runs, so `capturing` matters as much
        // as `animating` — otherwise the end screen lands mid-playback and the
        // final render then re-shows it over whatever came next.
        if (this.capturing || this.animating) this.endPending = true;
        else setTimeout(() => { if (!this.detached) this.renderEnd(); }, 30);
      }
    }

    /* ---------------------------- turn playback ---------------------------- */

    /**
     * Animations are applied to the wrapper, not the <img>, so the status mask
     * layered on top moves with it.
     */
    spriteFor(uid) {
      return UI.$(`.mon-wrap[data-uid="${uid}"]`, this.root);
    }

    spriteForSide(sideIndex) {
      return UI.$(`.mon-wrap[data-side="${sideIndex}"]`, this.root);
    }

    /** Scale a beat by the chosen playback speed. */
    pace(ms) {
      return Math.max(0, Math.round(ms * (this.speedFactor || 1)));
    }

    /** Play one CSS animation class and resolve when the beat is up. */
    async beat(element, className, ms) {
      if (element && className) {
        element.classList.remove(className);
        void element.offsetWidth;          // restart the animation
        element.classList.add(className);
      }
      await wait(ms);
      if (element && className) element.classList.remove(className);
    }

    /** Which side a Pokémon uid belongs to. */
    sideOfUid(uid) {
      for (const side of this.battle.sides) {
        if (side.team.some(p => p.uid === uid)) return side.index;
      }
      return null;
    }

    /**
     * Rebuild one side's info card mid-playback.
     *
     * Structural changes — a switch, a faint, a status, a stat change — alter
     * the card's contents, and waiting for the end-of-turn render left it
     * describing the Pokemon that had already left the field.
     */
    refreshCard(sideIndex) {
      if (sideIndex == null) return;
      const view = this.battle.view(this.perspective);
      const isSelf = sideIndex === this.perspective;
      const slot = UI.$(`.field-slot.${isSelf ? 'ally-info' : 'foe-info'}`, this.root);
      if (slot) slot.innerHTML = this.renderMonCard(view.sides[sideIndex], view, isSelf);
    }

    /**
     * Refresh the weather/terrain layers and the condition chips mid-playback,
     * so hazards and weather appear on the turn they are set.
     */
    refreshFieldEffects() {
      const field = UI.$('.battle-field', this.root);
      if (!field) return;
      const view = this.battle.view(this.perspective);
      const me = view.sides[this.perspective];
      const foe = view.sides[1 - this.perspective];

      const setLayer = (selector, cls, active) => {
        let node = UI.$(selector, this.root);
        if (!active) { if (node) node.remove(); return; }
        if (!node) {
          node = document.createElement('div');
          field.insertAdjacentElement('afterbegin', node);
        }
        node.className = cls;
      };
      setLayer('.terrain-layer', `terrain-layer tr-${view.field.terrain}`, !!view.field.terrain);
      setLayer('.weather-layer', `weather-layer wx-${view.field.weather}`, !!view.field.weather);

      const html = this.renderFieldConditions(view, me, foe);
      const chips = UI.$('.field-conditions', this.root);
      if (chips && html) chips.outerHTML = html;
      else if (chips) chips.remove();
      else if (html) field.insertAdjacentHTML('beforeend', html);
    }

    /** Update one side's HP bar in place, without rebuilding the field. */
    updateHP(uid, hp, maxHP) {
      const sprite = this.spriteFor(uid);
      if (!sprite) return;
      const side = sprite.dataset.side;
      const card = UI.$(`.mon-card[data-side="${side}"]`, this.root);
      if (!card) return;
      const percent = Math.max(0, Math.min(100, Math.round(hp / maxHP * 100)));
      const fill = UI.$('.hpbar i', card);
      if (fill) fill.style.width = `${percent}%`;
      const bar = UI.$('.hpbar', card);
      if (bar) {
        bar.classList.toggle('low', percent < 25);
        bar.classList.toggle('mid', percent >= 25 && percent < 50);
      }
      const readout = UI.$('.hp-readout', card);
      if (readout) readout.textContent = `${percent}%`;
    }

    /**
     * Replay the queued events with a beat between each, animating the sprites.
     * The DOM still shows the pre-turn field, so this animates forward from it
     * and does a single authoritative re-render at the end.
     */
    async playTurn() {
      this.animating = true;
      // Locking the controls stops double-input, but there is nothing to
      // protect when the AI is choosing — and locking them would put the
      // "take over" button out of reach for as long as playback runs, which is
      // the same trap that made the fastest Spectate speed unrecoverable.
      const controls = (this.spectate || this.autoBattle) ? null : UI.$('.battle-controls', this.root);
      if (controls) controls.classList.add('is-busy');

      for (const {event, upTo} of this.animQueue) {
        this.logLimit = upTo;
        this.renderLog();
        await this.animateEvent(event);
      }

      this.animating = false;
      this.logLimit = null;
      this.animQueue = [];
      if (this.pendingFlip) { this.pendingFlip = false; this.perspective = 1 - this.perspective; }
      if (this.detached) return;
      if (this.endPending) { this.endPending = false; this.renderEnd(); return; }
      this.render();
      // Assist auto-battle waits for playback rather than racing it.
      if (this.autoBattle) this.autoBattleStep();
    }

    /**
     * Drive an AI-vs-AI battle one turn at a time.
     *
     * Both sides are built as `human` controllers so the engine does not
     * auto-resolve the whole battle on start; the view asks the AI for each
     * side's choice instead, which keeps the normal turn flow — and therefore
     * the animation playback — completely unchanged.
     */
    async spectateStep() {
      if (!this.spectate || this.detached || this.battle.ended || this.animating) return;
      if (this.paused) { this.spectateRunning = false; return; }
      this.spectateRunning = true;

      const animate = this.animationsOn();
      this.animQueue = [];
      this.capturing = animate;
      let acted = false;
      for (const side of [0, 1]) {
        if (!this.battle.needsChoice(side)) continue;
        const request = this.battle.requests[side];
        const choice = RedGPT.AI.chooseAction(this.battle, side, request);
        let result = this.battle.choose(side, choice);
        if (!result.ok) result = this.battle.choose(side, this.battle.fallbackChoice(side, request));
        acted = acted || result.ok;
      }
      this.capturing = false;

      if (!acted) { this.spectateRunning = false; return; }
      if (animate && this.animQueue.length) await this.playTurn();
      else { this.animQueue = []; if (!this.battle.ended) this.render(); }

      if (this.battle.ended || this.paused) { this.spectateRunning = false; return; }
      setTimeout(() => this.spectateStep(), this.pace(260));
    }

    /** Kick the spectate loop off once; it re-schedules itself from then on. */
    beginSpectate() {
      if (!this.spectate || this.spectateRunning) return;
      setTimeout(() => this.spectateStep(), this.pace(350));
    }

    /* ------------------------- Assist auto-battle -------------------------
     * Campaign's Assist Mode can hand the player's own side to the AI. Unlike
     * Spectate this drives only the controlled sides — the opponent is already
     * an AI controller and resolves itself — and it goes through the same
     * `submit()` path a click would, so playback, replays and the command log
     * are identical to a human playing the same moves.
     *
     * It is a view-level mode with no engine involvement, which is what lets
     * the player take back control at any point, mid-battle, with no state to
     * unwind.
     * ---------------------------------------------------------------------- */

    setAutoBattle(on) {
      this.autoBattle = !!on;
      if (this.onAutoBattleChange) this.onAutoBattleChange(this.autoBattle);
      if (this.autoBattle) this.autoBattleStep();
      else this.render();
    }

    /** Play one queued decision for a controlled side, then re-arm. */
    autoBattleStep() {
      if (!this.autoBattle || this.detached || this.battle.ended) return;
      if (this.animating || this.autoBattlePending) return;
      const side = this.controlSides.find(s => this.battle.needsChoice(s));
      if (side == null) return;
      this.autoBattlePending = true;
      setTimeout(() => {
        this.autoBattlePending = false;
        if (!this.autoBattle || this.detached || this.battle.ended) return;
        if (!this.battle.needsChoice(side)) { this.autoBattleStep(); return; }
        const request = this.battle.requests[side];
        if (request?.type === 'teampreview') {
          // Assist also picks the lead: order the brought Pokémon by matchup.
          const order = this.autoTeamOrder(request);
          const result = this.battle.choose(side, {type: 'team', order});
          if (!result.ok) this.battle.choose(side, {type: 'team', order: request.team.map((_, i) => i)});
          this.render();
          this.autoBattleStep();
          return;
        }
        // `AI.chooseAction` reads the tier off `side.ai`, which a human-
        // controlled side does not have — without this it silently played at
        // the default (Trainer) tier rather than the best available one.
        // `side` is an index, so the old `side.ai` was always undefined and the
        // restore below always fell to the delete branch. Harmless today (a
        // controlled side is human and has no `ai`) but the finally did not do
        // what it says.
        const previousAi = this.battle.sides[side].ai;
        this.battle.sides[side].ai = {difficulty: this.autoBattleTier};
        let choice;
        try {
          choice = RedGPT.AI.chooseAction(this.battle, side, request);
        } finally {
          if (previousAi === undefined) delete this.battle.sides[side].ai;
          else this.battle.sides[side].ai = previousAi;
        }
        if (!choice) choice = this.battle.fallbackChoice(side, request);
        this.submit(side, choice, {auto: true});
        if (!this.animating) this.autoBattleStep();
      }, this.pace(this.animationsOn() ? 320 : 0));
    }

    /** Team Preview order chosen by the advisor, best lead first. */
    autoTeamOrder(request) {
      const order = request.team.map((_, index) => index);
      const advisor = RedGPT.Advisor;
      if (advisor && typeof advisor.recommendLead === 'function') {
        const mySets = request.team.map(entry => entry.set || entry);
        const foeSets = (this.battle.sides[1 - request.side].team || []).map(p => p.set);
        const lead = advisor.recommendLead(mySets, foeSets);
        if (lead > 0 && lead < order.length) {
          order.splice(order.indexOf(lead), 1);
          order.unshift(lead);
        }
      }
      return order;
    }

    async animateEvent(event) {
      switch (event.type) {
        case 'move': {
          const sprite = this.spriteFor(event.source);
          const dir = sprite?.dataset.side === String(this.perspective) ? 'anim-lunge-ally' : 'anim-lunge-foe';
          await this.beat(sprite, dir, this.pace(BEATS.move));
          return;
        }
        case 'hit': {
          const sprite = this.spriteFor(event.target);
          await this.beat(sprite, event.critical ? 'anim-hit-crit' : 'anim-hit', this.pace(BEATS.hit));
          return;
        }
        case 'damage':
          this.updateHP(event.target, event.hp, event.maxHP);
          await wait(this.pace(BEATS.damage));
          return;
        case 'heal':
          this.updateHP(event.target, event.hp, event.maxHP);
          await this.beat(this.spriteFor(event.target), 'anim-heal', this.pace(BEATS.heal));
          return;
        case 'boost': {
          const up = Object.values(event.boosts || {}).some(v => v > 0);
          const sprite = this.spriteFor(event.target);
          this.floatIndicator(sprite, up);
          this.refreshCard(this.sideOfUid(event.target));
          await this.beat(sprite, up ? 'anim-boost' : 'anim-drop', this.pace(BEATS.boost));
          return;
        }
        case 'status':
          // No sprite effect — the status pill on the card carries this.
          this.refreshCard(this.sideOfUid(event.target));
          await wait(this.pace(BEATS.status));
          return;
        /*
         * Terastallizing and spending an item change what the card *says* without
         * moving the sprite, and neither had a case here — so both fell through to
         * the default beat and the card kept describing the old state until the
         * authoritative end-of-turn `render()`. On a long turn that is seconds of
         * the card disagreeing with the field: a Tera'd Pokemon still showing its
         * base typing, a Focus Sash or an eaten Berry still listed as held.
         *
         * The card reads type, Tera state, ability and item, so any event that
         * changes one of those needs a `refreshCard` — that is the rule to apply
         * when adding a new event type.
         */
        case 'tera':
          this.refreshCard(this.sideOfUid(event.target));
          await this.beat(this.spriteFor(event.target), 'anim-boost', this.pace(BEATS.other));
          return;
        case 'itemused':
          this.refreshCard(this.sideOfUid(event.target));
          await wait(this.pace(BEATS.other));
          return;
        case 'faint': {
          const wrap = this.spriteForSide(event.side);
          await this.beat(wrap, 'anim-faint', this.pace(BEATS.faint));
          if (wrap) wrap.querySelector('.mon-sprite')?.classList.add('fainted');
          this.refreshCard(event.side);
          return;
        }
        case 'switch': {
          // The outgoing sprite is still on screen; slide it out, swap, slide in.
          const wrap = this.spriteForSide(event.side);
          if (wrap) {
            const mine = event.side === this.perspective;
            await this.beat(wrap, mine ? 'anim-switch-out-ally' : 'anim-switch-out-foe', this.pace(BEATS.switch / 2));
            const img = wrap.querySelector('.mon-sprite');
            const art = event.skin || event.species;
            const src = mine ? Dex.spriteBack(art) : Dex.spriteFront(art);
            wrap.dataset.uid = event.uid;
            if (img) { img.classList.remove('fainted'); img.src = src; img.dataset.uid = event.uid; }
            // The cry belongs to the arrival, so it fires with the sprite swap
            // rather than with the slide-out that precedes it. Recording the uid
            // stops the authoritative end-of-turn render crying for it a second
            // time — `cryForArrivals` compares against exactly this.
            this.lastCriedUid[event.side] = event.uid;
            UI.playCry(event.species);
            // Swap the card at the same moment as the sprite, or it keeps
            // describing the Pokemon that just left.
            this.refreshCard(event.side);
            await this.beat(wrap, mine ? 'anim-switch-in-ally' : 'anim-switch-in-foe', this.pace(BEATS.switch / 2));
          }
          return;
        }
        case 'forme': {
          // A mid-battle forme change (legacy Battle Bond). The Pokemon stays
          // on the field, so swap the artwork in place rather than running the
          // switch slide, and refresh the card for the new stats.
          const wrap = this.spriteForSide(event.side);
          if (wrap) {
            const mine = event.side === this.perspective;
            const img = wrap.querySelector('.mon-sprite');
            if (img) { const art = event.skin || event.species; img.src = mine ? Dex.spriteBack(art) : Dex.spriteFront(art); }
            this.refreshCard(event.side);
            await this.beat(wrap, 'anim-boost', this.pace(BEATS.other));
          }
          return;
        }
        case 'sidecondition':
        case 'weather':
        case 'terrain':
        case 'pseudoweather':
          this.refreshFieldEffects();
          await wait(this.pace(BEATS.other));
          return;
        case 'text':
          await wait(this.pace(BEATS.text));
          return;
        default:
          await wait(this.pace(BEATS.other));
      }
    }

    /** A brief ▲/▼ over the sprite so a stat change is readable at a glance. */
    floatIndicator(sprite, up) {
      if (!sprite || !sprite.parentElement) return;
      const mark = document.createElement('span');
      mark.className = `stat-float ${up ? 'up' : 'down'}`;
      mark.textContent = up ? '▲' : '▼';
      sprite.parentElement.appendChild(mark);
      setTimeout(() => mark.remove(), BEATS.boost + 260);
    }

    /* ---------------------------- rendering ---------------------------- */

    render() {
      if (this.detached) return;
      if (this.battle.ended && this.finished) { this.renderEnd(); return; }
      const request = this.battle.requests[this.activeSide()];
      if (request?.type === 'teampreview') { this.renderTeamPreview(request); return; }
      this.renderBattle();
    }

    /**
     * Which side is currently being asked to choose. A request stays populated
     * until the turn resolves, so this checks whether the side still *owes* a
     * command — otherwise local versus would re-serve player one's prompt
     * forever instead of handing over to player two.
     */
    activeSide() {
      for (const side of this.controlSides) {
        if (this.battle.needsChoice(side)) return side;
      }
      for (const side of this.controlSides) {
        if (this.battle.requests[side]) return side;
      }
      return this.perspective;
    }

    /**
     * Cry for anything standing on the field that has not been heard yet.
     *
     * The opening leads never produce a played-back `switch` event: `start()`
     * emits theirs before the view exists, and playback only ever replays what a
     * `choose()` produced. So the leads were silent while every later switch-in
     * cried, which is exactly backwards — the send-out at the top of a battle is
     * the one everybody expects to hear.
     *
     * Driven off the render rather than off `start()` so it also covers the
     * battles that begin at Team Preview, where nothing is on the field until
     * the player has picked an order.
     *
     * Foe first, then yours, staggered — `UI.playCry` reuses a single audio
     * element, so two cries fired together would leave only the second audible.
     */
    cryForArrivals() {
      if (this.detached) return;
      const fresh = [];
      for (const side of [1 - this.perspective, this.perspective]) {
        const active = this.battle.active(side);
        if (!active || active.fainted) continue;
        if (this.lastCriedUid[side] === active.uid) continue;
        this.lastCriedUid[side] = active.uid;
        fresh.push(active.species);
      }
      fresh.forEach((species, index) => {
        if (!index) { UI.playCry(species); return; }
        setTimeout(() => { if (!this.detached) UI.playCry(species); }, this.pace(BEATS.switch));
      });
    }

    renderBattle() {
      const side = this.activeSide();
      this.perspective = side;
      const view = this.battle.view(side);
      const me = view.sides[side];
      const foe = view.sides[1 - side];

      this.root.innerHTML = `
        <div class="battle-screen">
          <div class="battle-main">
            ${this.renderField(view, me, foe)}
            <div class="battle-controls" id="battleControls"></div>
          </div>
          <aside class="battle-side">
            <div class="panel tight">
              <div class="panel-head">
                <h3>Battle log</h3><div class="spacer"></div>
                <span class="tiny mono">Turn ${view.turn}</span>
                <button id="btnLogToggle" class="tiny-btn" aria-expanded="false">Full log</button>
              </div>
              <div class="battle-log compact" id="battleLog"></div>
            </div>
            <div class="panel tight" id="battleMeta"></div>
          </aside>
        </div>`;

      this.bindStatPanels();
      this.bindLogToggle();
      this.renderLog();
      this.renderMeta(view);
      this.renderControls();
      this.cryForArrivals();
    }

    renderField(view, me, foe) {
      const background = Dex.spriteBackground(view.background);
      // Weather and terrain get their own drawn layers: weather falls over the
      // whole field, terrain washes the ground the Pokemon stand on.
      const weather = view.field.weather ? `<div class="weather-layer wx-${esc(view.field.weather)}"></div>` : '';
      const terrain = view.field.terrain ? `<div class="terrain-layer tr-${esc(view.field.terrain)}"></div>` : '';
      return `
        <div class="battle-field" style="background-image:url('${background}')">
          ${terrain}${weather}
          ${this.renderFieldConditions(view, me, foe)}
          <div class="field-slot foe-info">${this.renderMonCard(foe, view, false)}</div>
          <div class="field-slot foe-mon">
            ${foe.avatar ? `<div style="position:absolute;top:.4rem;right:.6rem;opacity:.9">${trainerSprite(foe.avatar, 'sprite-md')}</div>` : ''}
            ${foe.active ? this.renderMonSprite(foe.active, 'foe', 1 - this.perspective) : ''}
          </div>
          <div class="field-slot ally-mon">
            ${me.active ? this.renderMonSprite(me.active, 'ally', this.perspective) : ''}
          </div>
          <div class="field-slot ally-info">${this.renderMonCard(me, view, true)}</div>
        </div>`;
    }

    /**
     * The sprite plus its status overlay.
     *
     * The overlay is a sibling masked with the same image, so it is a coloured
     * silhouette of the Pokemon rather than a rectangle. Movement animations go
     * on the wrapper so the mask travels with the sprite.
     */
    renderMonSprite(mon, kind, sideIndex) {
      // A cosmetic skin only ever replaces the picture; every other read here
      // stays on `mon.species`, which is what a forme change moves.
      const art = mon.skin || mon.species;
      const src = kind === 'ally' ? Dex.spriteBack(art) : Dex.spriteFront(art);
      return `
        <span class="mon-wrap ${kind}" data-uid="${mon.uid}" data-side="${sideIndex}">
          <img class="sprite mon-sprite ${kind} ${mon.fainted ? 'fainted' : ''}"
               data-uid="${mon.uid}" data-side="${sideIndex}"
               src="${src}" alt="${esc(mon.name)}">
        </span>`;
    }

    /**
     * One delegated listener for the stat panels, bound once per screen.
     *
     * `refreshCard` replaces the card's innerHTML on every switch, faint,
     * status and boost, so a handler attached to the button itself would be
     * thrown away mid-battle. Delegation on the root survives all of it, and
     * the open/closed state lives on the view so a re-render restores it.
     */
    bindStatPanels() {
      if (this.statPanelsBound === this.root) return;
      this.statPanelsBound = this.root;
      this.statPanelOpen = this.statPanelOpen || {};
      this.root.addEventListener('click', event => {
        const toggle = event.target.closest?.('[data-statpanel]');
        if (!toggle || !this.root.contains(toggle)) return;
        const side = +toggle.dataset.statpanel;
        this.statPanelOpen[side] = !this.statPanelOpen[side];
        this.refreshCard(side);
      });
    }

    /**
     * Everything currently acting on this Pokémon's stats, and by how much.
     *
     * Reads `battle.statBreakdown`, which walks the same layers as `getStat`,
     * so this can never claim a modifier the engine is not applying. For the
     * opponent under `hideOpponentDetails` the hidden sources are withheld and
     * the total is labelled as partial rather than printed as fact.
     */
    renderStatPanel(mon, sideIndex, isSelf) {
      const pokemon = this.battle.sides[sideIndex]?.team.find(p => p.uid === mon.uid);
      if (!pokemon) return '';
      const reveal = isSelf || this.battle.ended || !this.battle.rules.hideOpponentDetails;
      const rows = ['atk', 'def', 'spa', 'spd', 'spe'].map(stat => {
        const info = this.battle.statBreakdown(pokemon, stat, {reveal});
        const visible = info.sources.filter(source => !source.hidden);
        const total = reveal ? info.final : info.shown;
        const moved = total !== info.base;
        return `<div class="stat-row">
          <span class="stat-key">${BOOST_LABELS[stat]}</span>
          <span class="stat-total ${moved ? (total > info.base ? 'up' : 'down') : ''}">${total}</span>
          <span class="stat-from">${info.base}</span>
          <span class="stat-sources">${visible.length
    ? visible.map(source => `<span class="src-chip ${source.factor > 1 ? 'up' : 'down'}" title="${esc(source.label)} ×${source.factor.toFixed(2)}">${esc(source.label)} ×${source.factor.toFixed(2)}</span>`).join('')
    : '<span class="tiny dim">—</span>'}${info.partial ? '<span class="src-chip hidden" title="This Pokémon\'s ability or item is not revealed in this format">+ unrevealed</span>' : ''}</span>
        </div>`;
      }).join('');
      return `<div class="stat-panel">
        ${rows}
        <div class="tiny dim">${this.battle.field.pseudoWeather.wonderroom > 0 ? 'Wonder Room is swapping Defense and Sp. Def. ' : ''}${
  reveal ? 'Current stat, then the unmodified one.' : 'Ability and item are hidden in this format, so totals show only what is public.'}</div>
      </div>`;
    }

    renderMonCard(sideView, view, isSelf) {
      const mon = sideView.active;
      if (!mon) return '';
      const sideIndex = isSelf ? this.perspective : 1 - this.perspective;
      this.statPanelOpen = this.statPanelOpen || {};
      const panelOpen = !!this.statPanelOpen[sideIndex];
      /*
       * Protosynthesis and Quark Drive raise a stat with no boost *stage*
       * behind it — the multiplier lives in `onModifyStat` — so nothing in
       * `mon.boosts` reflects them and the only trace was a log line that
       * scrolls away. It reads as an ordinary boost to the player, so it is
       * shown as one, in the same green chip.
       */
      const abilityBoost = mon.abilityBoost && mon.ability
        ? `<span class="boost-chip up">${esc(mon.ability)}: +${BOOST_LABELS[mon.abilityBoost] || mon.abilityBoost}</span>`
        : '';
      const boosts = abilityBoost + Object.entries(mon.boosts || {})
        .filter(([, value]) => value)
        .map(([key, value]) => `<span class="boost-chip ${value > 0 ? 'up' : 'down'}">${BOOST_LABELS[key]} ${value > 0 ? '+' : ''}${value}</span>`)
        .join('');
      return `
        <div class="mon-card" data-side="${isSelf ? this.perspective : 1 - this.perspective}">
          <div class="mon-top">
            <span class="mon-name">${esc(mon.name)}</span>
            <span class="mon-lv">Lv${mon.level}</span>
            ${mon.gender && mon.gender !== 'N' ? `<span class="tiny">${mon.gender === 'M' ? '♂' : '♀'}</span>` : ''}
            <span class="spacer"></span>
            ${statusPill(mon.status)}
            ${mon.terastallized ? `<span class="tag good">Tera ${esc(mon.teraType)}</span>` : ''}
          </div>
          <div class="row-tight" style="margin:.15rem 0">${typeChips(mon.types)}</div>
          ${hpBar(mon.hpPercent)}
          <div class="row-tight" style="margin-top:.15rem">
            <span class="mon-hp-text">${isSelf ? `${mon.hp}/${mon.maxHP}` : ''} <span class="hp-readout">${mon.hpPercent}%</span></span>
            <span class="spacer"></span>
            ${mon.ability ? `<span class="tiny">${esc(mon.ability)}</span>` : ''}
            ${mon.item ? itemIcon(mon.item) : ''}
          </div>
          ${boosts ? `<div class="boosts">${boosts}</div>` : ''}
          <button class="stat-toggle tiny" data-statpanel="${sideIndex}"
                  aria-expanded="${panelOpen}">${panelOpen ? '▾' : '▸'} Stats</button>
          ${panelOpen ? this.renderStatPanel(mon, sideIndex, isSelf) : ''}
          <div class="team-bar">${this.renderTeamPips(sideView)}</div>
          <div class="tiny" style="margin-top:.1rem">${esc(sideView.name)}</div>
        </div>`;
    }

    renderTeamPips(sideView) {
      return sideView.team.map(member => {
        if (!member.revealed) return `<span class="team-pip unknown" title="Not yet revealed">?</span>`;
        return `<span class="team-pip ${member.fainted ? 'fainted' : ''} ${member.active ? 'active' : ''}" title="${esc(member.name)} — ${member.fainted ? 'fainted' : member.hpPercent + '%'}">
          <img src="${Dex.spriteFront(member.species)}" alt=""></span>`;
      }).join('');
    }

    renderFieldConditions(view, me, foe) {
      const chips = [];
      const chip = (cls, iconKey, label, suffix = '') =>
        `<span class="cond-chip ${cls}" title="${esc(label)}">${fieldIcon(iconKey)}${esc(label)}${suffix}</span>`;
      // A field effect with no turn counter is `Infinity` (see `ENDLESS` in
      // battle.js). Printing that raw reads as a bug; "∞" is the whole point.
      const turns = n => (Number.isFinite(n) ? String(n) : '∞');

      if (view.field.weather) {
        const label = RedGPT.BattleConstants.WEATHER_LABELS[view.field.weather] || view.field.weather;
        chips.push(chip('weather', view.field.weather, label, ` · ${turns(view.field.weatherTurns)}`));
      }
      if (view.field.terrain) {
        const label = RedGPT.BattleConstants.TERRAIN_LABELS[view.field.terrain] || view.field.terrain;
        chips.push(chip('terrain', view.field.terrain, label, ` · ${turns(view.field.terrainTurns)}`));
      }
      const PSEUDO_LABELS = {
        trickroom: 'Trick Room', magicroom: 'Magic Room', wonderroom: 'Wonder Room', gravity: 'Gravity',
        mudsport: 'Mud Sport', watersport: 'Water Sport', fairylock: 'Fairy Lock', iondeluge: 'Ion Deluge',
      };
      for (const [key, value] of Object.entries(view.field.pseudoWeather)) {
        // Fall back to the key rather than mislabelling an unknown effect.
        if (value > 0) chips.push(chip('pseudo', key, PSEUDO_LABELS[key] || key, ` · ${turns(value)}`));
      }

      const sideChips = (sideView, self) => {
        const c = sideView.conditions;
        const out = [];
        const cls = self ? 'hazard-ally' : 'hazard-foe';
        const who = self ? 'Your' : 'Foe';
        const add = (iconKey, label, suffix = '') => out.push(chip(cls, iconKey, `${who} ${label}`, suffix));
        if (c.stealthrock) add('stealthrock', 'Stealth Rock');
        if (c.spikes) add('spikes', 'Spikes', ` ×${c.spikes}`);
        if (c.toxicspikes) add('toxicspikes', 'T-Spikes', ` ×${c.toxicspikes}`);
        if (c.stickyweb) add('stickyweb', 'Sticky Web');
        if (c.reflect) add('reflect', 'Reflect', ` ${turns(c.reflect)}`);
        if (c.lightscreen) add('lightscreen', 'Light Screen', ` ${turns(c.lightscreen)}`);
        if (c.auroraveil) add('auroraveil', 'Aurora Veil', ` ${turns(c.auroraveil)}`);
        if (c.safeguard) add('safeguard', 'Safeguard', ` ${turns(c.safeguard)}`);
        if (c.luckychant) add('luckychant', 'Lucky Chant', ` ${turns(c.luckychant)}`);
        if (c.craftyshield) add('craftyshield', 'Crafty Shield');
        if (c.matblock) add('matblock', 'Mat Block');
        if (c.mist) add('mist', 'Mist', ` ${turns(c.mist)}`);
        if (c.tailwind) add('tailwind', 'Tailwind', ` ${turns(c.tailwind)}`);
        if (c.futureSight) add('futuresight', Dex.move(c.futureSight.moveId).name, ` · ${c.futureSight.turns}`);
        if (c.healingwish) add('healingwish', 'Healing Wish');
        if (c.lunardance) add('lunardance', 'Lunar Dance');
        return out;
      };
      chips.push(...sideChips(me, true), ...sideChips(foe, false));
      if (!chips.length) return '';
      return `<div class="field-conditions">${chips.join('')}</div>`;
    }

    /**
     * The battle log, newest turn first.
     *
     * Two deliberate choices:
     *
     * 1. **Turn blocks are reversed, the lines inside them are not.** The newest
     *    turn sits at the top so the player never scrolls to follow the battle,
     *    but a turn still reads forwards — reversing individual lines would print
     *    "Pikachu fainted!" above the move that caused it, which is nonsense.
     * 2. **Collapsed by default.** The panel shows the latest turn or two in a
     *    short box; the toggle opens the whole history. A battle can run 40 turns
     *    and the log is beside the field, so the default has to be the part that
     *    is currently happening.
     *
     * Because the newest content is at the top, there is no scroll-to-bottom —
     * `scrollTop` is reset to 0 instead, or the panel would open part-way down a
     * long history.
     */
    renderLog() {
      const node = UI.$('#battleLog', this.root);
      if (!node) return;
      const source = this.logLimit == null ? this.battle.events : this.battle.events.slice(0, this.logLimit);
      const events = source.filter(e => e.type === 'text' || e.type === 'turn');

      // Group into turn blocks in chronological order first.
      const blocks = [];
      let current = {turn: null, lines: []};
      for (const event of events) {
        if (event.type === 'turn') {
          if (current.lines.length || current.turn !== null) blocks.push(current);
          current = {turn: event.turn, lines: []};
          continue;
        }
        current.lines.push(event.text);
      }
      if (current.lines.length || current.turn !== null) blocks.push(current);

      const expanded = !!this.logExpanded;
      // Collapsed shows the newest two blocks, which is "this turn and the one
      // before it" — enough to see what just happened without the history.
      const shown = expanded ? blocks.slice().reverse() : blocks.slice(-2).reverse();

      let html = '';
      for (const block of shown) {
        if (block.turn !== null) html += `<div class="turn-sep">Turn ${block.turn}</div>`;
        for (const text of block.lines) {
          let cls = 'ln';
          if (/fainted!/.test(text)) cls += ' faint';
          else if (/critical hit/i.test(text)) cls += ' crit';
          else if (/super effective/i.test(text)) cls += ' se';
          else if (/^(It doesn|But it failed|.*missed)/.test(text)) cls += ' info';
          html += `<div class="${cls}">${esc(text)}</div>`;
        }
      }
      const hidden = blocks.length - shown.length;
      if (!expanded && hidden > 0) {
        html += `<div class="log-more">${hidden} earlier turn${hidden === 1 ? '' : 's'} hidden</div>`;
      }
      node.innerHTML = html;
      node.classList.toggle('compact', !expanded);
      // Newest is at the top, so start at the top.
      node.scrollTop = 0;
      this.updateLogToggle();
    }

    /**
     * Wire the log's expand/collapse button.
     *
     * The panel is rebuilt every render, so this rebinds each time — and
     * `this.logExpanded` lives on the view rather than in the DOM, so the choice
     * survives the rebuild instead of snapping shut every turn.
     */
    bindLogToggle() {
      const button = UI.$('#btnLogToggle', this.root);
      if (!button) return;
      button.onclick = () => {
        this.logExpanded = !this.logExpanded;
        this.renderLog();
      };
      this.updateLogToggle();
    }

    /** Keep the expand/collapse button's label in step with the log state. */
    updateLogToggle() {
      const button = UI.$('#btnLogToggle', this.root);
      if (!button) return;
      const expanded = !!this.logExpanded;
      button.textContent = expanded ? 'Collapse' : 'Full log';
      button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }

    renderMeta(view) {
      const node = UI.$('#battleMeta', this.root);
      if (!node) return;
      const side = this.perspective;
      const me = view.sides[side];
      const foe = view.sides[1 - side];
      node.innerHTML = `
        <div class="panel-head"><h3>Match</h3><div class="spacer"></div><span class="tag">${esc(view.format.name)}</span></div>
        <table class="data">
          <tbody>
            <tr><td>${esc(me.name)}</td><td class="num">${me.team.filter(m => !m.fainted).length}/${me.team.length}</td></tr>
            <tr><td>${esc(foe.name)}</td><td class="num">${foe.team.filter(m => !m.fainted).length}/${foe.team.length}</td></tr>
          </tbody>
        </table>
        <div class="row" style="margin-top:.5rem">
          <button id="btnForfeit" class="danger tiny-btn">Forfeit</button>
          ${this.replay ? '' : `<button id="btnQuickLog" class="tiny-btn">Copy log</button>`}
        </div>`;
      const forfeit = UI.$('#btnForfeit', node);
      if (forfeit) {
        forfeit.onclick = () => UI.confirmDialog('Forfeit the battle?', 'Your opponent will be awarded the win.',
          () => this.battle.choose(this.perspective, {type: 'forfeit'}), {confirmLabel: 'Forfeit', danger: true});
      }
      const copy = UI.$('#btnQuickLog', node);
      if (copy) copy.onclick = () => UI.copyText(this.battle.log.join('\n')).then(ok => UI.toast(ok ? 'Battle log copied.' : 'Clipboard is unavailable.'));
    }

    /* ---------------------------- controls ---------------------------- */

    renderControls() {
      const container = UI.$('#battleControls', this.root);
      if (!container) return;
      const side = this.activeSide();
      const request = this.battle.requests[side];

      if (this.battle.ended) { container.innerHTML = ''; return; }
      if (this.spectate) {
        // Each side's own perspective reveals its moves, so read both.
        const views = [this.battle.view(0), this.battle.view(1)];
        const names = this.battle.sides.map(s2 => esc(s2.name));
        const panel = index => {
          const mon = views[index].sides[index].active;
          if (!mon) return `<div class="spect-side"><h4>${names[index]}</h4><div class="small dim">—</div></div>`;
          const moves = (mon.moves || []).map(m => {
            const data = Dex.move(m.id);
            return `<div class="spect-move">
              <span class="sm-name">${esc(data.name)}</span>
              ${typeChip(data.type)}${categoryChip(data.category)}
              <span class="spacer"></span>
              <span class="tiny mono">${m.pp}/${m.maxPP}</span>
            </div>`;
          }).join('') || '<div class="small dim">Moves not revealed.</div>';
          return `
            <div class="spect-side ${index === this.perspective ? 'viewing' : ''}">
              <h4>${names[index]}</h4>
              <div class="small" style="margin-bottom:.2rem">${esc(mon.name)} <span class="dim">Lv${mon.level} · ${mon.hpPercent}%</span></div>
              <div class="spect-moves">${moves}</div>
            </div>`;
        };
        container.innerHTML = `
          <div class="row" style="margin-bottom:.45rem">
            <span class="small dim" id="spectState">${this.paused ? 'Paused' : 'Watching…'}</span>
            <span class="spacer"></span>
            <span class="small dim">Speed</span>
            <span class="seg" id="spectSpeed">
              ${SPEEDS.map(sp => `<button data-speed="${sp.factor}" title="${sp.title}"
                class="${sp.factor === this.speedFactor ? 'active' : ''}">${sp.label}</button>`).join('')}
            </span>
            <button id="btnSpectFlip" title="Show the battle from the other side">⇅ View: ${names[this.perspective]}</button>
            <button id="btnSpectPause">${this.paused ? '▶ Resume' : '⏸ Pause'}</button>
          </div>
          <div class="spect-grid">${panel(0)}${panel(1)}</div>`;

        UI.$$('#spectSpeed [data-speed]', container).forEach(btn => {
          btn.onclick = () => {
            this.speedFactor = Number(btn.dataset.speed) || 1;
            UI.$$('#spectSpeed [data-speed]', container).forEach(b => b.classList.toggle('active', b === btn));
            try { RedGPT.Store.update(data => { data.profile.settings.spectateSpeed = this.speedFactor; }); }
            catch { /* speed still applies for this battle */ }
          };
        });
        const flip = UI.$('#btnSpectFlip', container);
        if (flip) {
          flip.onclick = () => {
            // Swapping mid-turn would desync the sprites, so a click during
            // playback is remembered and applied on the next render instead.
            if (this.animating) { this.pendingFlip = !this.pendingFlip; return; }
            this.perspective = 1 - this.perspective;
            this.render();
          };
        }
        const button = UI.$('#btnSpectPause', container);
        if (button) {
          button.onclick = () => {
            this.paused = !this.paused;
            this.renderControls();
            if (!this.paused) this.beginSpectate();
          };
        }
        return;
      }
      if (!request || !this.battle.needsChoice(side)) {
        container.innerHTML = '<div class="small dim">Waiting for the opponent…</div>';
        return;
      }
      if (this.localVersus && this.handoffPending) {
        container.innerHTML = `
          <div class="center" style="padding:1rem">
            <h3>Pass the device to ${esc(this.battle.sides[side].name)}</h3>
            <p class="small dim">Their choice is hidden until both players have committed.</p>
            <button class="primary" id="btnReady">${esc(this.battle.sides[side].name)} is ready</button>
          </div>`;
        UI.$('#btnReady', container).onclick = () => { this.handoffPending = false; this.render(); };
        return;
      }

      if (request.type === 'switch') { this.renderSwitchControls(container, request, true); return; }
      if (this.mode === 'switch') { this.renderSwitchControls(container, request, false); return; }
      this.renderMoveControls(container, request);
    }

    renderMoveControls(container, request) {
      const side = request.side;
      const battle = this.battle;
      const me = battle.sides[side].team[battle.sides[side].activeIndex];
      const foe = battle.foeActive(me);
      const forced = request.forcedMoveIndex;

      const cards = request.moves.map((move, index) => {
        const disabled = move.disabled || (forced != null && forced !== index);
        const packaged = Dex.move(move.id);
        /*
         * `request.moves[].type` is the type the ability will actually give the
         * move. `battle.moveType` does not apply that conversion (it happens in
         * onModifyMove at use time), so the effectiveness and damage readouts
         * have to be computed from a converted copy — otherwise an Aerilate
         * Tackle reads "Immune" against a Ghost while really hitting it for
         * neutral damage. `typeChangeBoosted` is set so the estimate also picks
         * up the -ate power bonus.
         */
        const moveData = move.type === packaged.type
          ? packaged
          : Object.assign({}, packaged, {type: move.type, typeChangeBoosted: true});
        let effHtml = '';
        let killHtml = '';
        if (foe && !foe.fainted && moveData.category !== 'Status') {
          const type = battle.moveType(me, foe, moveData);
          const eff = battle.effectiveness(type, foe, moveData, me);
          const label = eff === 0 ? 'Immune' : eff >= 4 ? '×4' : eff === 2 ? '×2' : eff === 0.5 ? '×½' : eff <= 0.25 ? '×¼' : '';
          const cls = eff === 0 ? 'imm' : eff > 1 ? 'se' : eff < 1 ? 'nve' : '';
          if (label) effHtml = `<span class="move-eff ${cls}">${label}</span>`;
          if (this.showDamage) {
            const damage = RedGPT.AI.estimateDamage(battle, me, foe, moveData);
            const percent = Math.min(100, Math.round(100 * damage / Math.max(1, foe.maxHP)));
            if (damage > 0) killHtml = damage >= foe.currentHP
              ? `<span class="move-kill">KO</span>`
              : `<span class="tiny mono">~${percent}%</span>`;
          }
        }
        return `
          <button class="move-btn" data-move="${index}" ${disabled ? 'disabled' : ''}
                  style="border-left-color:${UI.TYPE_COLORS[move.type] || 'var(--line)'}"
                  title="${esc(moveData.shortDesc || '')}">
            <span class="move-name">${esc(move.name)}</span>
            <span class="move-line">${typeChip(move.type)} ${categoryChip(move.category)} ${effHtml} ${killHtml}
              <span class="move-pp">${move.pp}/${move.maxPP}</span></span>
            <span class="move-line">
              ${move.basePower
    ? (move.powerIsDynamic && move.packagedBasePower
      // Last Respects, Rage Fist, Fury Cutter, Rollout and the rest compute
      // their power at use time. Show what it hits for now, with the packaged
      // number struck through so the change is legible rather than confusing.
      ? `<span class="mono boosted" title="Base power right now (normally ${move.packagedBasePower})"><s>${move.packagedBasePower}</s> ${move.basePower} BP</span>`
      : `${move.basePower} BP`)
    : '—'} · ${move.accuracy == null ? '∞' : move.accuracy + '%'}
              ${move.disabled ? `<span class="tag bad">${esc(move.disabled)}</span>` : ''}
            </span>
          </button>`;
      }).join('');

      const struggle = request.moves.every(m => m.disabled)
        ? `<button class="move-btn danger" data-move="-1"><span class="move-name">Struggle</span>
             <span class="move-line">${typeChip('Normal')} ${categoryChip('Physical')}</span>
             <span class="move-line">No usable moves remain</span></button>`
        : '';

      container.innerHTML = `
        <div class="row" style="margin-bottom:.4rem">
          <span class="small dim">${esc(this.battle.sides[side].name)} — choose an action</span>
          <span class="spacer"></span>
          ${this.onAutoBattleChange ? `<button id="btnAutoBattle" class="${this.autoBattle ? 'primary' : ''}" title="Assist Mode: let the AI choose your actions">
            ${this.autoBattle ? 'AI is battling — take over' : 'Let the AI battle'}</button>` : ''}
          ${request.canMega ? `<label class="checkbox mega-toggle ${this.megaArmed ? 'armed' : ''}">
            <input type="checkbox" id="megaToggle" ${this.megaArmed ? 'checked' : ''}> Mega Evolve (${esc(request.megaForme || 'Mega')})</label>` : ''}
          ${request.canTera ? `<label class="checkbox tera-toggle ${this.teraArmed ? 'armed' : ''}">
            <input type="checkbox" id="teraToggle" ${this.teraArmed ? 'checked' : ''}> Terastallize (${esc(me.teraType)})</label>` : ''}
          <button id="btnAiInspect" class="${this.showAiInspector ? 'primary' : ''}"
            title="Show the battle AI's own scoring for your position">AI view</button>
          <button id="btnSwitchMenu" ${request.canSwitch ? '' : 'disabled'} title="${request.trapped ? 'Trapped — cannot switch' : ''}">Switch</button>
        </div>
        <div class="move-grid">${cards}${struggle}</div>
        ${this.showAiInspector ? this.renderAiInspector(side) : ''}`;

      const tera = UI.$('#teraToggle', container);
      if (tera) tera.onchange = () => { this.teraArmed = tera.checked; };
      const mega = UI.$('#megaToggle', container);
      if (mega) mega.onchange = () => { this.megaArmed = mega.checked; };
      const auto = UI.$('#btnAutoBattle', container);
      if (auto) auto.onclick = () => this.setAutoBattle(!this.autoBattle);
      const switchBtn = UI.$('#btnSwitchMenu', container);
      if (switchBtn) switchBtn.onclick = () => { this.mode = 'switch'; this.renderControls(); };
      const inspect = UI.$('#btnAiInspect', container);
      if (inspect) inspect.onclick = () => { this.showAiInspector = !this.showAiInspector; this.renderControls(); };

      UI.$$('[data-move]', container).forEach(button => {
        button.onclick = () => this.submit(side, {type: 'move', index: +button.dataset.move, tera: this.teraArmed, mega: this.megaArmed});
      });
    }

    /**
     * The battle AI's own working for the position in front of the player.
     *
     * `AI.explainChoice` is read-only and never touches either RNG stream, so
     * opening this cannot change a battle or desynchronise a replay — see the
     * note on the function itself.
     *
     * **Only ever the controlled side.** The AI is full-information (it reads
     * the opposing moveset, item and ability), so pointing this at the opponent
     * would hand the player everything `hideOpponentDetails` withholds and
     * everything two Campaign relics are sold on revealing. What it shows is
     * the reasoning for *your own* Pokémon — the same thing Assist Mode acts on
     * when it plays for you, which is exactly what makes it checkable.
     */
    renderAiInspector(side) {
      let view = null;
      try {
        view = RedGPT.AI.explainChoice(this.battle, side, this.autoBattleTier);
      } catch { view = null; }
      if (!view) return '';
      const sign = n => (n > 0 ? `+${n}` : `${n}`);
      const effLabel = eff => (eff == null ? '—' : eff === 0 ? '×0' : eff === 1 ? '×1'
        : eff > 1 ? `×${eff}` : `×${eff}`);
      const rows = view.moves.slice().sort((a, b) => b.score - a.score).map(m => `
        <tr class="${m.index === view.best ? 'suggested' : ''}${m.willFail ? ' ai-fails' : ''}">
          <td>${esc(m.name)}${m.index === view.best ? ' ★' : ''}</td>
          <td class="num mono">${sign(Math.round(m.score))}</td>
          <td class="num mono">${m.category === 'Status' ? '—' : Math.round(m.damage)}</td>
          <td class="num mono">${m.category === 'Status' ? '—' : `${m.percentOfFoe}%`}</td>
          <td class="num mono">${effLabel(m.effectiveness)}</td>
          <td class="num mono">${m.accuracy}%</td>
          <td class="tiny">${m.willFail ? 'cannot work' : m.kos ? 'KOs' : m.setup != null ? `setup ${sign(m.setup)}` : ''}</td>
        </tr>`).join('');
      const bench = view.switches.length
        ? view.switches.map(s => `<span class="tag tiny" title="Matchup score against the current foe">${
  esc(s.species)} ${sign(s.matchup)}${s.survivesSwitchIn ? '' : ' ⚠'}</span>`).join(' ')
        : '<span class="tiny dim">nothing on the bench</span>';

      return `
        <div class="ai-inspector">
          <div class="tiny dim">
            ${esc(view.tier)} tier${view.predicts ? '' : ' (no prediction — the weak tiers skip most judgement)'} ·
            ${view.outspeeds ? 'you move first' : 'the foe moves first'} ·
            incoming ${view.incoming.damage}${view.incoming.move ? ` (${esc(view.incoming.move)})` : ''}
            against ${view.self.effectiveHP} effective HP${view.dying ? ' — <b>this Pokémon is dying</b>' : ''}
          </div>
          <table class="data ai-scores">
            <thead><tr><th>Move</th><th class="num">Score</th><th class="num">Dmg</th><th class="num">%</th>
              <th class="num">Eff</th><th class="num">Acc</th><th></th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="row-tight tiny" style="margin-top:.35rem"><span class="dim">Bench matchup:</span> ${bench}</div>
        </div>`;
    }

    /**
     * Detail panel shown when the player hovers a party member in the switch
     * menu: its moves with PP, held item and Tera Type.
     *
     * Only ever built from a request's own `switches` list, which is always the
     * asking side's team — this must never be able to describe the opponent.
     */
    switchTooltip(entry, species) {
      const moves = (entry.moves || []).map(slot => {
        const move = Dex.move(slot.id);
        const out = slot.pp <= 0 ? ' out' : '';
        // Show the type this Pokémon's ability will actually give the move.
        const shown = RedGPT.Abilities.displayMoveType(entry.ability, move);
        return `<span class="sw-move${out}">
          ${typeChip(shown)}
          <span class="sw-move-name">${esc(move.name)}</span>
          <span class="tiny mono">${RedGPT.Abilities.displayBasePower(entry.ability, move) || '—'} BP</span>
          <span class="tiny mono dim">${slot.pp}/${slot.maxPP}</span>
        </span>`;
      }).join('');
      return `<span class="switch-tip">
        <span class="sw-tip-head">
          <b>${esc(entry.name)}</b>
          <span class="row-tight">${typeChips(species.types)}</span>
        </span>
        <span class="sw-tip-row">
          <span class="tiny dim">Ability</span><span class="tiny">${esc(entry.ability || '—')}</span>
        </span>
        <span class="sw-tip-row">
          <span class="tiny dim">Item</span>
          <span class="tiny">${entry.item
    ? `${itemIcon(entry.item)} ${esc(Dex.item(entry.item)?.name || entry.item)}`
    : '<span class="dim">None</span>'}</span>
        </span>
        <span class="sw-tip-row">
          <span class="tiny dim">Tera</span>
          <span class="tiny">${typeChip(entry.teraType)}${entry.terastallized ? ' <span class="tag good">active</span>' : ''}</span>
        </span>
        <span class="sw-moves">${moves || '<span class="tiny dim">No moves</span>'}</span>
      </span>`;
    }

    renderSwitchControls(container, request, forced) {
      const side = request.side;
      const options = request.switches.map(entry => {
        const disabled = entry.fainted || entry.active;
        const species = Dex.species(entry.species);
        return `
          <button class="switch-btn" data-switch="${entry.index}" ${disabled ? 'disabled' : ''}>
            <img src="${Dex.spriteFront(species)}" alt="">
            <span class="sw-info">
              <span class="sw-name">${esc(entry.name)}</span>
              ${hpBar(entry.fainted ? 0 : Math.round(100 * entry.hp / entry.maxHP), {thin: true})}
              <span class="tiny mono">${entry.fainted ? 'Fainted' : `${entry.hp}/${entry.maxHP}`}</span>
            </span>
            ${this.switchTooltip(entry, species)}
          </button>`;
      }).join('');

      container.innerHTML = `
        <div class="row" style="margin-bottom:.4rem">
          <span class="small dim">${forced ? `${esc(this.battle.sides[side].name)} — send out the next Pokémon` : 'Choose a Pokémon to switch in'}</span>
          <span class="spacer"></span>
          ${forced ? '' : '<button id="btnBackToMoves">Back</button>'}
        </div>
        <div class="switch-grid">${options}</div>`;

      const back = UI.$('#btnBackToMoves', container);
      if (back) back.onclick = () => { this.mode = 'main'; this.renderControls(); };
      UI.$$('[data-switch]', container).forEach(button => {
        button.onclick = () => { this.mode = 'main'; this.submit(side, {type: 'switch', index: +button.dataset.switch}); };
      });
    }

    /**
     * Submit a choice.
     * @param {object} options `{auto}` — set by the Assist auto-battler so the
     *   view can tell "the AI played this whole battle" from "the player did".
     */
    submit(side, choice, {auto = false} = {}) {
      if (this.animating) return;                 // ignore clicks mid-playback
      if (!auto) this.playerActedManually = true;
      const animate = this.animationsOn();
      this.animQueue = [];
      this.capturing = animate;
      const result = this.battle.choose(side, choice);
      this.capturing = false;
      if (!result.ok) { UI.toast(result.error, {error: true}); this.animQueue = []; return; }
      this.teraArmed = false;
      this.megaArmed = false;
      if (this.localVersus && this.battle.needsChoice(1 - side)) this.handoffPending = true;
      if (animate && this.animQueue.length) { this.playTurn(); return; }
      this.animQueue = [];
      if (!this.battle.ended) this.render();
    }

    /* ---------------------------- team preview ---------------------------- */

    renderTeamPreview(request) {
      const side = request.side;
      const foeSide = this.battle.sides[1 - side];
      const bring = request.bring;
      if (!this.previewOrder) this.previewOrder = [];

      const mine = request.team.map((mon, index) => {
        const order = this.previewOrder.indexOf(index);
        const species = Dex.species(mon.species);
        const stats = Dex.species(mon.species).baseStats;
        return `
          <button class="preview-mon ${order >= 0 ? 'selected' : ''}" data-pick="${index}">
            ${order >= 0 ? `<span class="order-badge">${order + 1}</span>` : ''}
            ${monSprite(species, {className: 'sprite-sm'})}
            <span style="flex:1;min-width:0;text-align:left">
              <b>${esc(mon.name)}</b> <span class="tiny">Lv${mon.level}</span><br>
              ${typeChips(species.types)}
              <span class="tiny mono"> ${Dex.STATS.map(s => stats[s]).join('/')}</span>
            </span>
            ${this.switchTooltip(mon, species)}
          </button>`;
      }).join('');

      const theirs = foeSide.team.map(mon => {
        const species = Dex.species(mon.species);
        const reveal = !this.battle.rules.hideOpponentDetails;
        return `
          <div class="preview-mon">
            ${monSprite(species, {className: 'sprite-sm'})}
            <span style="flex:1;min-width:0">
              <b>${esc(species.name)}</b> <span class="tiny">Lv${mon.level}</span><br>
              ${typeChips(species.baseStats ? species.types : [])}
              ${reveal && mon.item ? itemIcon(mon.item) : ''}
              ${reveal && mon.ability ? `<span class="tiny">${esc(mon.ability)}</span>` : ''}
            </span>
          </div>`;
      }).join('');

      this.root.innerHTML = `
        <div class="view-pad">
          <div class="panel">
            <div class="panel-head">
              <h2>Team Preview</h2>
              <div class="spacer"></div>
              <span class="tag">${esc(this.battle.format.name)}</span>
            </div>
            <p class="small dim">${bring < request.team.length
              ? `Choose ${bring} Pokémon in the order you want to use them. The first is your lead.`
              : 'Choose your lead. Click a Pokémon to set the order, or start immediately with the current order.'}</p>
            <div class="preview-teams">
              <div>
                <h4>${esc(this.battle.sides[side].name)}</h4>
                ${mine}
              </div>
              <div>
                <h4>${esc(foeSide.name)}</h4>
                ${theirs}
              </div>
            </div>
            <div class="row" style="margin-top:.8rem">
              <button id="btnClearOrder">Reset order</button>
              ${this.onAutoBattleChange ? `<button id="btnPreviewAuto" title="Assist Mode: the AI picks your lead and plays the battle">Let the AI battle</button>` : ''}
              <span class="spacer"></span>
              <span class="small dim">${this.previewOrder.length}/${bring} selected</span>
              <button id="btnStart" class="primary">Start battle</button>
            </div>
          </div>
        </div>`;

      UI.$$('[data-pick]', this.root).forEach(button => {
        button.onclick = () => {
          const index = +button.dataset.pick;
          const at = this.previewOrder.indexOf(index);
          if (at >= 0) this.previewOrder.splice(at, 1);
          else if (this.previewOrder.length < bring) this.previewOrder.push(index);
          this.renderTeamPreview(request);
        };
      });
      UI.$('#btnClearOrder', this.root).onclick = () => { this.previewOrder = []; this.renderTeamPreview(request); };
      const previewAuto = UI.$('#btnPreviewAuto', this.root);
      if (previewAuto) {
        previewAuto.onclick = () => {
          // Hand over from here: the AI picks the lead as well as the moves.
          this.previewOrder = null;
          this.setAutoBattle(true);
        };
      }
      UI.$('#btnStart', this.root).onclick = () => {
        const order = [...this.previewOrder];
        for (let i = 0; i < request.team.length; i++) if (!order.includes(i)) order.push(i);
        if (this.previewOrder.length && this.previewOrder.length < bring) {
          UI.toast(`Select ${bring} Pokémon, or reset the order to use the default.`, {error: true});
          return;
        }
        this.previewOrder = null;
        this.playerActedManually = true;      // choosing the lead is a real decision
        const result = this.battle.choose(side, {type: 'team', order});
        if (!result.ok) { UI.toast(result.error, {error: true}); return; }
        if (this.localVersus && this.battle.needsChoice(1 - side)) this.handoffPending = true;
        this.render();
      };
    }

    /* ---------------------------- end screen ---------------------------- */

    renderEnd() {
      if (this.detached) return;
      const battle = this.battle;
      const view = battle.view(this.perspective);
      const winner = battle.winner;
      const outcome = winner == null ? 'Draw' : (this.controlSides.includes(winner) ? 'Victory' : 'Defeat');
      const me = view.sides[this.perspective];
      const foe = view.sides[1 - this.perspective];

      this.root.innerHTML = `
        <div class="view-pad">
          <div class="grid grid-side">
            <div class="panel">
              <div class="panel-head">
                <h1 style="color:${outcome === 'Victory' ? 'var(--green)' : outcome === 'Defeat' ? 'var(--accent-soft)' : 'var(--text)'}">${outcome}</h1>
                <div class="spacer"></div>
                <span class="tag">${esc(view.format.name)}</span>
                <span class="tag">${battle.turn} turns</span>
              </div>
              <p class="small dim">${winner == null ? 'Neither side had a Pokémon standing.' : `${esc(battle.sides[winner].name)} won by ${esc(battle.endReason)}.`}</p>
              <div class="grid grid-2" style="margin-top:.6rem">
                ${[me, foe].map(sv => `
                  <div>
                    <h4>${esc(sv.name)}</h4>
                    ${sv.team.map(m => `<div class="row-tight" style="gap:.4rem;margin-bottom:.15rem">
                      ${monSprite(m.species, {className: 'sprite-sm'})}
                      <span style="flex:1">${esc(m.name)}</span>
                      <span class="tiny mono">${m.fainted ? 'FNT' : m.hpPercent + '%'}</span>
                    </div>`).join('')}
                  </div>`).join('')}
              </div>
              <div class="row" style="margin-top:1rem" id="endActions"></div>
            </div>
            <div class="panel tight">
              <div class="panel-head"><h3>Battle log</h3></div>
              <div class="battle-log" id="battleLog" style="max-height:60vh"></div>
            </div>
          </div>
        </div>`;

      // The battle is over, so show the whole history rather than the in-battle
      // collapsed view — there is no toggle on this screen to open it with, and
      // the end screen is exactly where a player reads the log back. Still newest
      // turn first, for consistency with the in-battle panel.
      this.logExpanded = true;
      this.renderLog();
      const actions = UI.$('#endActions', this.root);
      const buttons = this.onFinish ? this.onFinish({battle, winner, outcome}) : [];
      actions.innerHTML = buttons.map((b, i) => `<button data-end="${i}" class="${b.primary ? 'primary' : ''}">${esc(b.label)}</button>`).join('');
      UI.$$('[data-end]', actions).forEach(button => {
        button.onclick = () => {
          // The handler navigates away, so stop owning the root first.
          this.detached = true;
          buttons[+button.dataset.end].onClick();
        };
      });
    }
  }

  /* ------------------------------------------------------------------ *
   * Replay playback
   * ------------------------------------------------------------------ */

  /**
   * Re-runs a stored replay and steps through its log. The battle is fully
   * recomputed from the seed and command list, so no per-turn snapshots are
   * stored anywhere.
   */
  function renderReplay(root, replay, {onExit} = {}) {
    let battle;
    try {
      battle = RedGPT.Battle.fromReplay(replay);
    } catch (error) {
      root.innerHTML = `<div class="view-pad"><div class="panel"><h2>Replay could not be played</h2>
        <p class="small dim">${esc(error.message)}</p><button id="back">Back</button></div></div>`;
      UI.$('#back', root).onclick = onExit;
      return;
    }

    const lines = battle.events.filter(e => e.type === 'text' || e.type === 'turn');
    let cursor = lines.length;
    let timer = null;

    const draw = () => {
      const shown = lines.slice(0, cursor);
      root.innerHTML = `
        <div class="view-pad">
          <div class="panel">
            <div class="panel-head">
              <h2>Replay — ${esc(replay.sides[0].name)} vs ${esc(replay.sides[1].name)}</h2>
              <div class="spacer"></div>
              <span class="tag">${esc(RedGPT.Formats.get(replay.format).name)}</span>
              <span class="tag">${replay.turns} turns</span>
              <span class="tag">${esc(RedGPT.RNG.format(replay.seed))}</span>
            </div>
            <div class="grid grid-2" style="margin-bottom:.6rem">
              ${replay.sides.map(side => `<div><h4>${esc(side.name)}</h4>
                <div class="row" style="gap:.25rem">${side.team.map(set => monSprite(set.species, {className: 'sprite-sm'})).join('')}</div>
              </div>`).join('')}
            </div>
            <div class="row" style="margin-bottom:.5rem">
              <button id="rwStart">⏮ Start</button>
              <button id="rwStep">◀ Step</button>
              <button id="rwPlay" class="primary">▶ Play</button>
              <button id="rwFwd">Step ▶</button>
              <button id="rwEnd">End ⏭</button>
              <span class="spacer"></span>
              <span class="small dim">${cursor}/${lines.length} events</span>
              <button id="rwBack">Close</button>
            </div>
            <div class="battle-log" id="replayLog" style="max-height:60vh"></div>
          </div>
        </div>`;

      const log = UI.$('#replayLog', root);
      log.innerHTML = shown.map(event => event.type === 'turn'
        ? `<div class="turn-sep">Turn ${event.turn}</div>`
        : `<div class="ln">${esc(event.text)}</div>`).join('');
      log.scrollTop = log.scrollHeight;

      UI.$('#rwStart', root).onclick = () => { stop(); cursor = 0; draw(); };
      UI.$('#rwEnd', root).onclick = () => { stop(); cursor = lines.length; draw(); };
      UI.$('#rwStep', root).onclick = () => { stop(); cursor = Math.max(0, cursor - 1); draw(); };
      UI.$('#rwFwd', root).onclick = () => { stop(); cursor = Math.min(lines.length, cursor + 1); draw(); };
      UI.$('#rwPlay', root).onclick = () => { if (timer) stop(); else play(); };
      UI.$('#rwBack', root).onclick = () => { stop(); if (onExit) onExit(); };
    };

    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const play = () => {
      if (cursor >= lines.length) cursor = 0;
      timer = setInterval(() => {
        cursor++;
        if (cursor >= lines.length) { cursor = lines.length; stop(); }
        draw();
      }, 320);
    };

    draw();
  }

  global.RedGPT.UI.BattleView = BattleView;
  global.RedGPT.UI.renderReplay = renderReplay;
})(typeof window !== 'undefined' ? window : globalThis);
