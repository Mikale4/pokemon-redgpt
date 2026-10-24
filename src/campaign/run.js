/**
 * Campaign run state machine.
 *
 * A run is a plain serialisable object (including its RNG state), so it can be
 * autosaved after every meaningful transition and restored exactly on reload.
 * The UI never mutates a run directly: it calls the functions here, reads
 * `run.phase` and `run.pending`, and renders whatever the current pending
 * prompt describes.
 *
 * Phases:
 *   draft    starter selection
 *   map      choosing the next node
 *   prompt   resolving a pending prompt (reward / shop / rest / event / ...)
 *   battle   a battle configuration is waiting to be played
 *   victory  the final boss has been defeated
 *   defeat   the run ended in a loss
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;
  const Dex = RedGPT.Dex;
  const RNG = RedGPT.RNG;
  const PokemonLib = RedGPT.Pokemon;
  const Formats = RedGPT.Formats;
  const Mechanics = RedGPT.Mechanics;
  const Abilities = RedGPT.Abilities;
  const Items = RedGPT.Items;
  const RandomTeams = RedGPT.RandomTeams;
  const Content = RedGPT.CampaignContent;
  const CampaignMap = RedGPT.CampaignMap;

  const RUN_VERSION = 1;
  const MAX_PARTY = 6;
  const STARTING_LEVEL = 16;

  /** Team level cap by Act; the run levels the whole party together. */
  const ACT_LEVEL_CAP = {1: 32, 2: 48, 3: 68};
  const DEFAULT_ACTS = 3;
  const ACTS_RANGE = {min: 1, max: 8};
  const BEACONS_RANGE = {min: 0, max: 6};

  /** How many Acts this run is set to. Older saves predate the choice. */
  function actCount(run) {
    return clamp(Math.round(run.setup?.acts ?? DEFAULT_ACTS), ACTS_RANGE.min, ACTS_RANGE.max);
  }

  /**
   * Level cap for an Act.
   *
   * The hand-tuned 32/48/68 ramp is kept exactly for a standard three-Act run;
   * other lengths interpolate over the same range so the last Act always tops
   * out in the same place however long the run is.
   */
  function actLevelCap(run, act = run.act) {
    const total = actCount(run);
    if (total === DEFAULT_ACTS) return ACT_LEVEL_CAP[act] || 100;
    if (total <= 1) return ACT_LEVEL_CAP[3];
    const first = ACT_LEVEL_CAP[1];
    const last = ACT_LEVEL_CAP[3];
    return Math.round(first + (last - first) * ((clamp(act, 1, total) - 1) / (total - 1)));
  }

  /**
   * How far through the whole run the player is, 0 at the opening node and 1 at
   * the final Act's boss.
   *
   * Act number alone is not a usable difficulty clock any more: the player picks
   * how many Acts a run has, so "Act 3" means the finale in one run and the
   * midpoint in another. Everything that used to ramp on `run.act` — power
   * bands, reward richness, recruit rarity — reads this instead, so the same
   * curve is stretched over a long run and compressed into a short one.
   */
  function runProgress(run) {
    const total = actCount(run);
    let within = 0;
    try {
      const map = currentActMap(run);
      if (map) within = clamp(run.stats.nodesInAct / Math.max(1, map.rows), 0, 1);
    } catch { /* map not generated yet */ }
    return clamp(((run.act - 1) + within) / Math.max(1, total), 0, 1);
  }

  /**
   * How much harder this run's opposition should be, from the player's own
   * setup choices.
   *
   * Both knobs make a run more survivable — extra Beacons are extra lives, and
   * extra Acts are extra nodes to build a team in — so the opposition scales to
   * pay for them. Growth is deliberately super-linear: each additional step
   * costs more than the last, so the top of the range really is a different
   * game rather than a slightly longer one.
   */
  function challengeLevel(run) {
    const base = Content.difficulty(run.difficulty).beacons ?? 2;
    const beacons = clamp(Math.round(run.setup?.beacons ?? base), BEACONS_RANGE.min, BEACONS_RANGE.max);
    const steps = Math.max(0, beacons - base) + Math.max(0, actCount(run) - DEFAULT_ACTS);
    return steps;
  }

  /** Exponential multiplier derived from `challengeLevel`. 1 at default setup. */
  function challengeFactor(run) {
    return Math.pow(1.4, challengeLevel(run));
  }

  /**
   * How many rebirths deep this run is. 0 for an ordinary run.
   *
   * A number rather than a boolean because a cleared Rebirth run can be reborn
   * again, and "your third rebirth" is worth showing.
   */
  function rebirthDepth(run) {
    return Math.max(0, Math.round(run?.rebirth || 0));
  }
  const isRebirth = run => rebirthDepth(run) > 0;

  /* ================================================================ *
   * Small helpers
   * ================================================================ */

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  function rngOf(run) {
    if (!run._rng) run._rng = RNG.fromState(run.rngState);
    return run._rng;
  }
  function syncRng(run) {
    if (run._rng) run.rngState = run._rng.getState();
  }

  /** Aggregated numeric modifiers from relics, difficulty and ascension. */
  function modifiers(run) {
    const difficulty = Content.difficulty(run.difficulty);
    const out = {
      battleHealPercent: difficulty.battleHealPercent,
      restHealPercent: difficulty.restHealPercent,
      priceMultiplier: difficulty.shopPriceMultiplier,
      rewardOptions: difficulty.rewardOptions,
      shopSlots: 6,
      recruitOptions: 3,
      tmOptions: 3,
      creditsPerNode: 0,
      hardEncounterCredits: 1,
      eliteFullHeal: false,
      revealOpponent: false,
      restTeachesMove: false,
      freeItemEvolution: false,
      bossLevelBonus: 0,
      reviveFirstFaint: false,
      treasureBonusItem: true === false,
      showDamagePreview: false,
      revealNodeRewards: false,
      hazardImmunityFirstTurn: false,
      freeRerollPerAct: 0,
      beaconsPerAct: 0,
      // Raised by each copy of a stackable reroll relic. Read in `advanceAct`
      // (the per-Act refill) and in `grantRelic` (the immediate grant).
      bonusRerolls: 0,
      releaseRefund: 0,
      actSupplies: null,
      eliteAi: null,
      eliteTeamBonus: 0,
      bossTeamBonus: 0,
      extraRows: 0,
      eliteWeight: 1,
      rewardCreditMultiplier: 1,
    };
    /*
     * Rebirth Mode pays better, which is the other half of its bargain: one more
     * choice on every reward screen, richer credit payouts, and a rarity nudge
     * inside `rarityRoll` on every item roll. Applied before ascensions and
     * relics so both still layer on top.
     */
    if (isRebirth(run)) {
      out.rewardOptions += Content.REBIRTH.rewardOptions;
      out.rewardCreditMultiplier = Content.REBIRTH.creditMultiplier;
    }
    for (const ascension of Content.ASCENSIONS) {
      if (ascension.level > run.ascension) continue;
      const e = ascension.effects;
      if (e.eliteAi) out.eliteAi = e.eliteAi;
      if (e.eliteTeamBonus) out.eliteTeamBonus += e.eliteTeamBonus;
      if (e.restPenalty) out.restHealPercent = Math.max(0.25, out.restHealPercent - e.restPenalty);
      if (e.shopSlots) out.shopSlots += e.shopSlots;
      if (e.priceMultiplier) out.priceMultiplier *= e.priceMultiplier;
      if (e.bossTeamBonus) out.bossTeamBonus += e.bossTeamBonus;
      if (e.rerolls != null) out.forcedRerolls = e.rerolls;
      if (e.extraRows) out.extraRows += e.extraRows;
      if (e.healPenalty) out.battleHealPercent *= e.healPenalty;
      if (e.eliteWeight) out.eliteWeight *= e.eliteWeight;
    }
    for (const relicId of run.relics || []) {
      const relic = Content.relic(relicId);
      if (!relic?.modifiers) continue;
      for (const [key, value] of Object.entries(relic.modifiers)) {
        if (typeof value === 'number') {
          if (key === 'priceMultiplier') out[key] *= value;
          else out[key] = (out[key] || 0) + value;
        } else if (key === 'actSupplies') {
          out.actSupplies = Object.assign({}, out.actSupplies || {}, value);
        } else {
          out[key] = value;
        }
      }
    }
    out.battleHealPercent = clamp(out.battleHealPercent + (out.battleHealBonus || 0), 0, 1);
    return out;
  }

  function logEvent(run, text) {
    run.log.push({turn: run.stats.nodes, text});
    if (run.log.length > 400) run.log.shift();
  }

  function pushPrompt(run, prompt) {
    run.promptStack.push(prompt);
    run.phase = 'prompt';
    run.pending = prompt;
    return prompt;
  }

  /**
   * Swap the current prompt for another. Used when a hub prompt (Rest Site,
   * Specialist) hands off to the service the player picked — completing the
   * service then ends the node instead of returning to the hub forever.
   */
  function replacePrompt(run, prompt) {
    if (run.promptStack.length) run.promptStack[run.promptStack.length - 1] = prompt;
    else run.promptStack.push(prompt);
    run.phase = 'prompt';
    run.pending = prompt;
    return prompt;
  }

  function popPrompt(run) {
    run.promptStack.pop();
    if (run.promptStack.length) {
      run.pending = run.promptStack[run.promptStack.length - 1];
      run.phase = 'prompt';
    } else {
      run.pending = null;
      run.phase = run.phase === 'battle' ? 'battle' : 'map';
    }
    return run.pending;
  }

  /* ================================================================ *
   * Party helpers
   * ================================================================ */

  function partyMember(run, uid) {
    return run.party.find(m => m.uid === uid) || null;
  }

  /**
   * Campaign runs on base stats, nature and level — no EVs, for either side.
   *
   * The battle enforces this in `Battle.scaleSet` via the campaign format's
   * `evLimit: 0`, but the party menu computes stats straight from the set, so it
   * has to strip them too or the numbers on the card would not be the numbers in
   * the battle. Stripping on read rather than on write also fixes runs saved
   * before the rule existed.
   */
  function stripEVs(set) {
    return Object.assign({}, set, {evs: PokemonLib.zeroStats()});
  }

  function memberSet(run, member, {level = run.teamLevel} = {}) {
    return stripEVs(PokemonLib.normalizeSet(Object.assign({}, member.set, {level})));
  }

  function memberStats(run, member) {
    return PokemonLib.calcStats(memberSet(run, member));
  }

  function memberMaxHP(run, member) {
    return memberStats(run, member).hp;
  }

  function healMember(run, member, fraction) {
    const max = memberMaxHP(run, member);
    if (member.condition.currentHP <= 0 && fraction < 1) return 0;
    const before = member.condition.currentHP;
    member.condition.currentHP = clamp(Math.round(before + max * fraction), 0, max);
    return member.condition.currentHP - before;
  }

  function fullHealMember(run, member) {
    member.condition = PokemonLib.fullyHealCondition(memberSet(run, member));
  }

  function healTeam(run, fraction) {
    for (const member of run.party) {
      if (fraction >= 1) fullHealMember(run, member);
      else healMember(run, member, fraction);
    }
  }

  /**
   * Recovery between nodes. Survivors regain a slice of HP; Pokémon that
   * fainted come back at a small fraction rather than staying at zero, so a
   * single bad matchup does not permanently shrink the party. Rest Sites,
   * Revives and boss clears are what restore a team properly.
   */
  function postBattleRecovery(run, {full = false} = {}) {
    if (full) {
      healTeam(run, 1);
      restorePP(run, 1);
      return;
    }
    const mods = modifiers(run);
    const revive = Content.difficulty(run.difficulty).faintReviveFraction ?? 0.2;
    for (const member of run.party) {
      const max = memberMaxHP(run, member);
      if (member.condition.currentHP <= 0) {
        member.condition.currentHP = Math.max(1, Math.round(max * revive));
        member.condition.status = null;
      } else {
        healMember(run, member, mods.battleHealPercent);
      }
    }
    restorePP(run, 0.35);
  }

  function restorePP(run, fraction) {
    for (const member of run.party) {
      const full = PokemonLib.fullyHealCondition(memberSet(run, member));
      const pp = member.condition.pp || {};
      for (const [moveId, max] of Object.entries(full.pp)) {
        pp[moveId] = clamp(Math.round((pp[moveId] ?? max) + max * fraction), 0, max);
      }
      member.condition.pp = pp;
    }
  }

  function teamAlive(run) {
    return run.party.some(m => m.condition.currentHP > 0);
  }

  function addPartyMember(run, set, {level = run.teamLevel} = {}) {
    const normalized = stripEVs(PokemonLib.normalizeSet(Object.assign({}, set, {level})));
    const member = {
      uid: PokemonLib.newUid('c'),
      set: normalized,
      condition: PokemonLib.fullyHealCondition(normalized),
      joinedAtNode: run.stats.nodes,
    };
    run.party.push(member);
    run.stats.recruits++;
    run.stats.speciesUsed[normalized.species] = (run.stats.speciesUsed[normalized.species] || 0) + 1;
    return member;
  }

  /** Re-sync a member's condition after its level or moveset changed. */
  function refreshMember(run, member) {
    const set = memberSet(run, member);
    const max = PokemonLib.calcStats(set).hp;
    member.condition.currentHP = clamp(member.condition.currentHP, 0, max);
    const full = PokemonLib.fullyHealCondition(set);
    const pp = {};
    for (const [moveId, maxPP] of Object.entries(full.pp)) {
      pp[moveId] = member.condition.pp?.[moveId] ?? maxPP;
    }
    member.condition.pp = pp;
  }

  function addLevels(run, amount) {
    const cap = actLevelCap(run);
    const before = run.teamLevel;
    run.teamLevel = clamp(run.teamLevel + amount, 1, cap);
    if (run.teamLevel === before) return 0;
    // Max HP grows with the level. Current HP has to grow by the same amount,
    // as it does in the games: otherwise a Pokémon sitting at full HP quietly
    // drops below full every time the team levels, and the damage it is
    // carrying silently increases. Measured against the *old* level, so this
    // runs before the set is updated.
    const previousMax = new Map(run.party.map(m => [m.uid, PokemonLib.calcStats(memberSet(run, m, {level: before})).hp]));
    for (const member of run.party) {
      member.set.level = run.teamLevel;
      refreshMember(run, member);
      // A fainted Pokémon stays fainted — levelling never revives.
      if (member.condition.currentHP <= 0) continue;
      const gained = memberMaxHP(run, member) - (previousMax.get(member.uid) ?? 0);
      if (gained > 0) {
        member.condition.currentHP = clamp(member.condition.currentHP + gained, 1, memberMaxHP(run, member));
      }
    }
    checkEvolutions(run);
    checkLevelUpMoves(run, before, run.teamLevel);
    logEvent(run, `The team reached level ${run.teamLevel}.`);
    return run.teamLevel - before;
  }

  /* ================================================================ *
   * Evolution and move learning
   * ================================================================ */

  /**
   * Level-up evolution targets this member could take right now, deduplicated.
   *
   * More than one means a **branching line** — Wurmple to Silcoon or Cascoon,
   * Tyrogue to any of the three Hitmons, Slowpoke to Slowbro or Slowking, Eevee to
   * Espeon or Umbreon — and the player picks. Every eligible target is offered, not
   * just the lowest-level one, so a level-60 Eevee sees Sylveon alongside the two
   * it qualified for at 25.
   */
  function levelEvolutionTargets(run, member) {
    const rules = Dex.evolutions(Dex.species(member.set.species))
      .filter(r => r.method === 'level' && run.teamLevel >= r.level)
      .sort((a, b) => a.level - b.level);
    return [...new Set(rules.map(r => r.target))].filter(id => !Dex.species(id).missing);
  }

  /**
   * Evolve as far as the line goes *without* asking anything.
   *
   * Stops the moment a branch appears, so the caller can raise the choice. Also
   * used after a choice is made, to carry a chain like Wurmple → Silcoon →
   * Beautifly through its unambiguous second step in one go.
   *
   * @returns {boolean} true if a branch is waiting to be chosen.
   */
  function autoEvolve(run, member) {
    let guard = 0;
    while (guard++ < 4) {
      const targets = levelEvolutionTargets(run, member);
      if (!targets.length) return false;
      if (targets.length > 1) return true;
      evolveMember(run, member, targets[0]);
    }
    return false;
  }

  function checkEvolutions(run) {
    for (const member of run.party) {
      if (!autoEvolve(run, member)) continue;
      // A branch: ask which form. Carries `memberUid`, so `pruneDanglingPrompts`
      // drops it automatically if the Pokémon is released first (§8).
      offerEvolutionChoice(run, member, levelEvolutionTargets(run, member));
    }
  }

  /** Prompt the player to pick between branching evolution targets. */
  function offerEvolutionChoice(run, member, targets, {item = null} = {}) {
    if (targets.length < 2) return null;
    return pushPrompt(run, {
      type: 'evolvechoice',
      title: `${PokemonLib.displayName(member.set)} is evolving!`,
      memberUid: member.uid,
      // Set for an item-triggered branch, so the resolver knows what to spend.
      item,
      options: targets.map(id => {
        const species = Dex.species(id);
        return {target: species.id, name: species.name, types: species.types, bst: species.bst};
      }),
    });
  }

  function evolveMember(run, member, targetId) {
    const from = Dex.species(member.set.species);
    const to = Dex.species(targetId);
    if (to.missing) return false;
    const hpRatio = member.condition.currentHP / Math.max(1, memberMaxHP(run, member));
    member.set.species = to.id;
    if (!member.set.nickname || member.set.nickname === from.name) member.set.nickname = null;
    if (!Dex.hasAbility(to, member.set.ability)) member.set.ability = Dex.abilityList(to)[0] || 'No Ability';
    member.set.moves = member.set.moves.filter(id => Dex.canLearn(to, id));
    if (!member.set.moves.length) member.set.moves = PokemonLib.fillMoves(member.set, {level: run.teamLevel}).moves;
    member.set = PokemonLib.normalizeSet(member.set);
    const max = memberMaxHP(run, member);
    member.condition.currentHP = Math.max(1, Math.round(max * hpRatio));
    refreshMember(run, member);
    run.stats.evolutions++;
    logEvent(run, `${from.name} evolved into ${to.name}!`);
    return true;
  }

  /** Level-up moves gained by crossing levels are offered, never forced. */
  function checkLevelUpMoves(run, fromLevel, toLevel) {
    for (const member of run.party) {
      const species = Dex.species(member.set.species);
      for (let level = fromLevel + 1; level <= toLevel; level++) {
        for (const moveId of Dex.movesLearnedAt(species, level)) {
          if (!Dex.hasMove(moveId) || member.set.moves.includes(moveId)) continue;
          if (member.set.moves.length < 4) {
            member.set.moves.push(moveId);
            refreshMember(run, member);
            logEvent(run, `${PokemonLib.displayName(member.set)} learned ${Dex.move(moveId).name}!`);
          } else {
            pushPrompt(run, {
              type: 'movelearn',
              title: `${PokemonLib.displayName(member.set)} wants to learn ${Dex.move(moveId).name}`,
              memberUid: member.uid,
              moveId,
              current: member.set.moves.slice(),
            });
          }
        }
      }
    }
  }

  /* ================================================================ *
   * Opponent construction
   * ================================================================ */

  function enemyLevel(run, offset = 0) {
    const difficulty = Content.difficulty(run.difficulty);
    // Rebirth pays for its opposition's *quality* with levels, the same way the
    // base game does. See REBIRTH.enemyLevelOffset for the measurement.
    const rebirth = isRebirth(run) ? Content.REBIRTH.enemyLevelOffset : 0;
    return clamp(run.teamLevel + difficulty.enemyLevelOffset + rebirth + offset + rampOffset(run), 2, 100);
  }

  function encounterSize(run, kind) {
    const mods = modifiers(run);
    const actProgress = run.stats.nodesInAct / Math.max(1, currentActMap(run).rows);
    // Acts past the third keep the Act 3 shape.
    const tier = Math.min(run.act, 3);
    let size;
    if (tier === 1) size = actProgress < 0.4 ? 2 : 3;
    else if (tier === 2) size = actProgress < 0.5 ? 3 : 4;
    else size = actProgress < 0.5 ? 4 : 5;
    // A higher self-chosen challenge fields fuller teams, up to a full six.
    size += Math.min(2, Math.floor(challengeLevel(run) * 0.8));
    if (kind === 'elite') size += 1 + mods.eliteTeamBonus;
    if (kind === 'wild') return 1;
    // The player carries damage between nodes while every opponent arrives
    // fresh, so ordinary Trainers field one fewer Pokémon than the party.
    // Elites match the party exactly — that is what makes them a real risk.
    const ceiling = kind === 'elite'
      ? run.party.length + mods.eliteTeamBonus
      : Math.max(1, run.party.length - 1);
    return clamp(Math.min(size, ceiling), 1, 6);
  }

  /**
   * Opponent species power band. Early Act 1 fights use unevolved and
   * low-BST Pokémon so a lone starter is not thrown at a fully evolved team.
   */
  /**
   * Anchor points for the opponent power curve, keyed on `runProgress`.
   *
   * Chosen so a standard three-Act run reproduces the hand-tuned bands it had
   * when Acts were fixed; other run lengths stretch or compress the same shape
   * rather than jumping between three hardcoded tiers.
   */
  const POWER_CURVE = [
    {at: 0.00, min: 190, max: 320},
    {at: 0.12, min: 250, max: 410},
    {at: 0.25, min: 300, max: 470},
    {at: 0.50, min: 400, max: 545},
    {at: 0.78, min: 455, max: 615},
    {at: 1.00, min: 480, max: 700},
  ];

  function powerBand(run, kind) {
    /*
     * A rebirth resets the Act, and this curve is a function of progress — so
     * the opening nodes would draw from the opening band while the party is six
     * fully-evolved carry-overs. The floor moves; the curve still climbs to the
     * same place at the final boss. Note it is applied *here* and not to
     * `runProgress` itself, because the recruitment tier gate and reward rarity
     * read that and must keep meaning "how far into the run are you" — a
     * rebirth should not hand out legendaries on node one.
     */
    const at = isRebirth(run) ? Math.max(runProgress(run), Content.REBIRTH.progressFloor) : runProgress(run);
    let lower = POWER_CURVE[0];
    let upper = POWER_CURVE[POWER_CURVE.length - 1];
    for (let i = 0; i < POWER_CURVE.length - 1; i++) {
      if (at >= POWER_CURVE[i].at && at <= POWER_CURVE[i + 1].at) {
        lower = POWER_CURVE[i];
        upper = POWER_CURVE[i + 1];
        break;
      }
    }
    const span = upper.at - lower.at;
    const t = span > 0 ? (at - lower.at) / span : 0;
    let min = Math.round(lower.min + (upper.min - lower.min) * t);
    let max = Math.round(lower.max + (upper.max - lower.max) * t);
    if (kind === 'elite') { min += 60; max += 70; }
    if (kind === 'wild') { min = Math.max(180, min - 50); max -= 30; }
    // Tougher setups draw from a stronger pool — "complete teams" rather than
    // whatever the band happened to offer.
    let lift = Math.round(challengeLevel(run) * 28);
    // Each rebirth beyond the first is a harder world again.
    lift += Math.max(0, rebirthDepth(run) - 1) * Content.REBIRTH.depthLift;
    if (lift) { min = Math.min(680, min + lift); max = Math.min(780, max + lift); }
    return {min, max};
  }

  /**
   * Extra level handicap applied to the opening encounters of a run.
   *
   * The ramp covers most of Act 1 rather than its first three nodes. Measured
   * cause: on Master (`enemyLevelOffset: 0`) the handicap expired at node four,
   * so from there on a one-or-two-Pokémon party met same-level opponents played
   * by the Ace tier with 28% healing between fights — 147 of 200 probe runs
   * died in Act 1, ending after 11 of ~31 nodes. The player has fewest Pokémon,
   * no held items and no relics for the whole of the first Act, so the handicap
   * is sized to that, not to the first few nodes.
   */
  function rampOffset(run) {
    // Every reason the ramp exists is false in a rebirth: the party is not one
    // Pokémon, it holds items, and it carries the relics of a cleared run.
    if (isRebirth(run)) return 0;
    if (run.act !== 1) return 0;
    if (run.stats.nodesInAct <= 2) return -6;
    if (run.stats.nodesInAct <= 5) return -4;
    if (run.stats.nodesInAct <= 8) return -2;
    return 0;
  }

  function campaignPool(run, {theme = null, kind = 'trainer'} = {}) {
    const format = Formats.get('campaign');
    const band = powerBand(run, kind);
    let pool = Formats.speciesPool(format).filter(s =>
      s.bst >= band.min && s.bst <= band.max && Object.keys(s.learnset).length >= 10);
    if (!pool.length) pool = RandomTeams.viablePool(format);
    if (!theme) return pool;
    const themed = pool.filter(s => s.types.includes(theme));
    return themed.length >= 6 ? themed : pool;
  }

  function themedPool(theme, format) {
    const pool = RandomTeams.viablePool(format);
    if (!theme) return pool;
    const themed = pool.filter(s => s.types.includes(theme));
    return themed.length >= 8 ? themed : pool;
  }

  function buildOpponentTeam(run, {kind, theme, size, level}) {
    const rng = rngOf(run);
    const format = Formats.get('campaign');
    const pool = campaignPool(run, {theme, kind});
    const sets = [];
    const used = new Set();
    const usedItems = new Set();
    const draw = source => {
      const species = rng.pick(source);
      if (!species || used.has(Dex.toID(species.baseSpecies))) return false;
      used.add(Dex.toID(species.baseSpecies));
      sets.push(RandomTeams.randomSet(species, rng, {format, level, usedItems}));
      return true;
    };
    let guard = 0;
    while (sets.length < size && guard++ < size * 40) draw(pool);
    /*
     * Top up from the *unthemed* band when the themed pool runs dry, rather
     * than repeating a species.
     *
     * The old fallback drew from the same pool with no duplicate check, and it
     * really fired: `campaignPool` decides a themed pool is usable when it holds
     * six entries, but it counts **formes, not distinct base species** — Arceus
     * has 18 formes and Silvally 18. The Ice band 600-780 holds exactly six
     * formes and only four base species (Arceus-Ice, Kyurem, Kyurem-Black,
     * Kyurem-White, Calyrex-Ice, Baxcalibur), so a Skier could place four and
     * then clone one. Reported from a real battle: two Arceus-Ice on one team.
     *
     * Losing the theme on the last slot or two is a much smaller cost than a
     * duplicate, and Campaign deliberately runs with `speciesClause: false` for
     * the *player's* sake — a roguelite should let you keep two of something —
     * so nothing downstream was going to catch this.
     */
    if (sets.length < size && theme) {
      const wider = campaignPool(run, {kind});
      guard = 0;
      while (sets.length < size && guard++ < size * 40) draw(wider);
    }
    return sets;
  }

  /* ================================================================ *
   * Rebirth Mode opposition
   * ================================================================ */

  /**
   * Membership lookups for a plan, built once per plan object.
   *
   * This is **not** a second copy of `Advisor.planIndex`, and the difference is
   * the input rather than the rule: the advisor scores a *set* — what a Pokémon
   * actually brings — while the draft has to ask what a *species* could bring,
   * from its learnset and ability list, before any set exists. Scoring built
   * sets instead would mean generating one per candidate across a pool of
   * several hundred, on every battle in the mode.
   */
  const planIndexCache = new WeakMap();
  function planIndex(plan) {
    let index = planIndexCache.get(plan);
    if (!index) {
      index = {
        enablerMoves: [...new Set((plan.enablers?.moves || []).map(Dex.toID))],
        enablerAbilities: new Set((plan.enablers?.abilities || []).map(Dex.toID)),
        payoffMoves: [...new Set((plan.payoff?.moves || []).map(Dex.toID))],
        payoffAbilities: new Set((plan.payoff?.abilities || []).map(Dex.toID)),
      };
      planIndexCache.set(plan, index);
    }
    return index;
  }

  /** Does the plan have a switch to turn on at all? Hyper Offense does not. */
  function planNeedsEnabler(plan) {
    const index = planIndex(plan);
    return index.enablerMoves.length > 0 || index.enablerAbilities.size > 0;
  }

  /** How well a species could serve a plan, before a set is generated for it. */
  function planSpeciesFit(species, plan) {
    const index = planIndex(plan);
    const abilities = Dex.abilityList(species).map(Dex.toID);
    let score = 0;
    // The enabler is the linchpin, exactly as in `Advisor.recruitScore`: a
    // dedicated ability is worth more than a move any number of species can be
    // taught, because it is what the Pokémon is *for*.
    if (abilities.some(id => index.enablerAbilities.has(id))) score += 100;
    else if (index.enablerMoves.some(id => Dex.canLearn(species, id))) score += 55;
    if (abilities.some(id => index.payoffAbilities.has(id))) score += 34;
    const payoff = index.payoffMoves.filter(id => Dex.canLearn(species, id)).length;
    score += Math.min(48, payoff * 12);
    const stats = species.baseStats;
    // Signed, for the reason the advisor records: a base-130 Pokémon is a
    // liability on a Trick Room team, not merely unhelpful.
    if (plan.speed === 'fast') score += (stats.spe - 70) / 2.5;
    else if (plan.speed === 'slow') score += (70 - stats.spe) / 2;
    score += ((stats.hp + stats.def + stats.spd) - 250) / 8 * (plan.bulk ?? 0.5);
    return score;
  }

  /** The plan's most-wanted item, or null. Damp Rock, Light Clay, Smooth Rock… */
  function planSignatureItem(plan, usedItems) {
    const entries = Object.entries(plan.items || {})
      .sort((a, b) => b[1] - a[1])
      .filter(([id]) => Dex.item(id) && !usedItems.has(id));
    return entries.length ? entries[0][0] : null;
  }

  /**
   * Force a set to actually run the plan.
   *
   * `RandomTeams.randomSet` picks an ability by general quality and a moveset by
   * role, neither of which knows about plans — so a Politoed drafted to set rain
   * arrives with Water Absorb and no Rain Dance about half the time. Both are
   * overwritten here rather than by teaching `randomSet` about plans, because
   * every other caller of it wants the quality-first behaviour.
   */
  /** Moves that replace a field state. Keyed to what they set. */
  const WEATHER_MOVES = {sunnyday: 'sun', raindance: 'rain', sandstorm: 'sandstorm',
    snowscape: 'snow', hail: 'hail', chillyreception: 'snow'};
  const TERRAIN_MOVES = {electricterrain: 'electric', grassyterrain: 'grassy',
    mistyterrain: 'misty', psychicterrain: 'psychic'};

  /**
   * Stop a themed team from deleting its own doctrine.
   *
   * Two of the six are filled on general quality, and `RandomTeams` knows
   * nothing about plans — so a Sun team could draft a bulky Politoed and wipe
   * its own sun on the switch-in, or roll a Rain Dance onto a quality-fill
   * member and wipe it on turn two. Observed both ways while building this: a
   * "Sun" opponent whose own Primarina used Rain Dance twice.
   *
   * Abilities are checked through `setsWeather` / `setsTerrain`, declared on the
   * ability definitions, because the weather is a closure argument in the hook
   * and there is otherwise no way to ask. Primal setters are refused against
   * *any* weather doctrine, since primal weather beats an endless one outright.
   */
  function stripDoctrineConflicts(set, plan) {
    const effect = plan?.rebirth?.effect;
    if (!effect) return set;
    const index = planIndex(plan);
    const species = Dex.species(set.species);

    if (effect.weather || effect.terrain) {
      const ability = Abilities.get(set.ability);
      const clashes = ability && (
        (effect.weather && (ability.setsPrimalWeather || (ability.setsWeather && ability.setsWeather !== effect.weather))) ||
        (effect.terrain && ability.setsTerrain && ability.setsTerrain !== effect.terrain));
      if (clashes) {
        const clean = Dex.abilityList(species).find(name => {
          const other = Abilities.get(name);
          if (!other) return true;
          if (effect.weather && (other.setsPrimalWeather || (other.setsWeather && other.setsWeather !== effect.weather))) return false;
          if (effect.terrain && other.setsTerrain && other.setsTerrain !== effect.terrain) return false;
          return true;
        });
        if (clean) set.ability = clean;
      }
    }

    const conflicting = id =>
      (effect.weather && WEATHER_MOVES[id] && WEATHER_MOVES[id] !== effect.weather) ||
      (effect.terrain && TERRAIN_MOVES[id] && TERRAIN_MOVES[id] !== effect.terrain);
    const known = set.moves.map(Dex.toID);
    for (let i = 0; i < known.length; i++) {
      if (!conflicting(known[i])) continue;
      // Prefer something the plan actually wants; fall back to the best attack
      // the species can learn, so the slot is never left doing nothing.
      const wanted = [...index.enablerMoves, ...index.payoffMoves]
        .find(id => !known.includes(id) && Dex.canLearn(species, id));
      const replacement = wanted || Object.keys(species.learnset)
        .filter(id => Dex.hasMove(id) && !known.includes(id) && !conflicting(id) && Dex.move(id).category !== 'Status')
        .sort((a, b) => RandomTeams.movePower(Dex.move(b)) - RandomTeams.movePower(Dex.move(a)))[0];
      if (!replacement) continue;
      set.moves[i] = replacement;
      known[i] = replacement;
    }
    return set;
  }

  /** Could this species carry the plan's enabler at all? */
  function speciesCanEnable(species, plan) {
    const index = planIndex(plan);
    if (Dex.abilityList(species).some(name => index.enablerAbilities.has(Dex.toID(name)))) return true;
    return index.enablerMoves.some(id => Dex.canLearn(species, id));
  }

  /** Does this set already switch the plan on? */
  function setHasEnabler(set, plan) {
    const index = planIndex(plan);
    if (index.enablerAbilities.has(Dex.toID(set.ability))) return true;
    return set.moves.map(Dex.toID).some(id => index.enablerMoves.includes(id));
  }

  /**
   * @param {object} options `{forceEnabler}` — write the plan's enabler onto this
   *   set if it can carry one. Only ever passed for **one** member of a team: a
   *   Rain team wants a Drizzle holder, not six Rain Dances. A first version
   *   forced it on every member that could learn it and produced exactly that —
   *   five of six screens-team members carrying Reflect.
   */
  function applyPlanToSet(set, plan, {forceEnabler = false} = {}) {
    const index = planIndex(plan);
    const species = Dex.species(set.species);
    stripDoctrineConflicts(set, plan);
    if (!forceEnabler || !planNeedsEnabler(plan)) return set;
    if (setHasEnabler(set, plan)) return set;
    const abilities = Dex.abilityList(species);
    const enablerAbility = abilities.find(name => index.enablerAbilities.has(Dex.toID(name)));
    if (enablerAbility) { set.ability = enablerAbility; return set; }
    const moves = set.moves.map(Dex.toID);
    const teachable = index.enablerMoves.find(id => Dex.canLearn(species, id));
    if (!teachable) return set;
    /*
     * Overwrite the least useful slot, never a payoff move — dropping the Swift
     * Swim sweeper's Surf to fit Rain Dance would trade the whole point of the
     * draft for the switch that turns it on.
     */
    let worst = -1;
    let worstPower = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (index.payoffMoves.includes(moves[i])) continue;
      const power = RandomTeams.movePower(Dex.move(moves[i]));
      if (power < worstPower) { worstPower = power; worst = i; }
    }
    if (worst < 0) worst = set.moves.length - 1;
    set.moves[worst] = teachable;
    return set;
  }

  /**
   * A complete six built around one declared plan — Rebirth Mode's opposition.
   *
   * Four of the six are drafted for plan fit and two are filled on general
   * quality (`REBIRTH.themedMembers`). Six fitted members produces near-clones
   * on the narrow plans — every Sand pick is a Rock/Ground wall — and a team
   * with no answer to anything is easier, not harder.
   */
  function buildRebirthTeam(run, plan, level, size = Content.REBIRTH.teamSize) {
    const rng = rngOf(run);
    const format = Formats.get('campaign');
    // The stronger of the two bands: Rebirth opposition is meant to be built,
    // not merely numerous.
    const pool = campaignPool(run, {kind: 'elite'});
    const used = new Set();
    const usedItems = new Set();
    const sets = [];

    const themed = Math.min(size, Content.REBIRTH.themedMembers);
    // Sampled from the top of the fit ranking rather than taken straight off it,
    // so two Rain trainers in one run are not the same six Pokémon.
    const ranked = pool
      .map(species => [species, planSpeciesFit(species, plan)])
      .sort((a, b) => b[1] - a[1])
      .slice(0, Math.max(themed * 6, 24));
    const weights = ranked.map(([species], i) => [species, ranked.length - i]);

    // The enabler is written onto exactly one member — the first that can carry
    // one, which the fit ranking puts at the front.
    let enablerPlaced = !planNeedsEnabler(plan);
    /*
     * The plan's signature item follows the **enabler**, not the draft order —
     * a Damp Rock is worth something on the Pokémon that sets the rain and
     * nothing at all on the sweeper beside it. A plan with no enabler
     * (Hyper Offense, Stall) gives it to whoever is drafted first, since its
     * signature is an ordinary good item anyway (Life Orb, Leftovers).
     */
    let signatureGiven = false;
    const giveSignature = set => {
      if (signatureGiven) return;
      const id = planSignatureItem(plan, usedItems);
      if (!id) { signatureGiven = true; return; }
      set.item = id;
      usedItems.add(id);
      signatureGiven = true;
    };

    const push = species => {
      if (!species) return false;
      const key = Dex.toID(species.baseSpecies);
      if (used.has(key)) return false;
      used.add(key);
      const set = RandomTeams.randomSet(species, rng, {format, level, usedItems});
      if (set.item) usedItems.add(Dex.toID(set.item));
      applyPlanToSet(set, plan, {forceEnabler: !enablerPlaced});
      if (!enablerPlaced && setHasEnabler(set, plan)) {
        enablerPlaced = true;
        giveSignature(set);
      } else if (!planNeedsEnabler(plan)) {
        giveSignature(set);
      }
      sets.push(set);
      return true;
    };

    let guard = 0;
    while (sets.length < themed && guard++ < themed * 30) push(rng.weighted(weights));
    /*
     * The enabler outranks everything, exactly as `Advisor.recruitScore` says:
     * a payoff team with no way to put its own field back up loses the moment
     * the player Defogs or switches a weather setter in. The fit ranking gets
     * there most of the time but not always — measured before this pass, **13
     * of 30** Sticky Web teams shipped without a single Sticky Web, because so
     * few species in the band learn it. A targeted draft closes it.
     */
    if (!enablerPlaced && sets.length < size) {
      const carriers = pool.filter(s => !used.has(Dex.toID(s.baseSpecies)) && speciesCanEnable(s, plan));
      if (carriers.length) {
        const best = carriers
          .map(s => [s, planSpeciesFit(s, plan)])
          .sort((a, b) => b[1] - a[1])
          .slice(0, 16);
        push(rng.weighted(best.map(([s], at) => [s, best.length - at])));
      }
    }
    guard = 0;
    while (sets.length < size && guard++ < size * 40) push(rng.pick(pool));
    /*
     * Never dead-end on a pool that could not fill — a mode whose whole promise
     * is a full six cannot ship a team of four. It widens to the **unthemed
     * band** rather than repeating a species: `push` keeps its `used` check, so
     * this can lose the plan's flavour on a last slot but never clones a
     * Pokémon. (`buildOpponentTeam` had the duplicate-tolerant version of this
     * and it shipped two Arceus-Ice on one team.)
     */
    if (sets.length < size) {
      const wider = campaignPool(run, {kind: 'trainer'});
      guard = 0;
      while (sets.length < size && guard++ < size * 40) push(rng.pick(wider));
    }
    return sets;
  }

  /**
   * The plan this Rebirth opponent is built around.
   *
   * A boss **declares** its own (`boss.teamPlan`), which is what stops a Rain
   * boss opening with a sandstorm. Everything else rolls one from
   * `REBIRTH.trainerPlans`, drawn from the run RNG so a seeded run reproduces
   * it — and never from `run.assist.plan`, which is the player's advisory
   * setting and must not reach anything that decides what is *offered*.
   */
  function rebirthPlanFor(run, boss = null) {
    if (boss) return Content.teamPlan(boss.teamPlan || 'balance');
    return Content.teamPlan(rngOf(run).pick(Content.REBIRTH.trainerPlans));
  }

  /** The opening field state a plan's doctrine puts up, aimed at `side`. */
  function rebirthFieldEffects(plan, side = 1) {
    const effect = plan?.rebirth?.effect;
    if (!effect) return null;
    return Object.assign({side}, effect);
  }

  function buildBossTeam(run, boss, level) {
    const rng = rngOf(run);
    const mods = modifiers(run);
    const format = Formats.get('campaign');
    // The boss brings a full six only when the player can field a full six.
    // Its plan still works at four: setters and win conditions come first.
    //
    // `bossTeamPenalty` is subtracted *after* the per-Act ceiling, not before
    // it. Inside the clamp it was inert for any party of five or more — the
    // ceiling bound first, so `clamp(6+1-1, 3, 5)` and `clamp(6+1-0, 3, 5)`
    // were both 5 — which meant Normal's advertised "bosses field one fewer"
    // silently stopped applying exactly when the player had finished building a
    // team, i.e. at the hardest bosses in the run.
    const penalty = Content.difficulty(run.difficulty).bossTeamPenalty || 0;
    const ceiling = boss.act >= 4 ? 6 : boss.act === 1 ? 4 : 5;
    const cap = Math.max(3, Math.min(run.party.length + (boss.act === 1 ? 0 : 1), ceiling) - penalty);
    // Rebirth bosses field the whole authored team: no per-Act ceiling and no
    // difficulty penalty, because "every opponent is fully realised" is the mode.
    const members = isRebirth(run) ? boss.members.slice(0, 6) : boss.members.slice(0, Math.min(6, Math.max(cap, 3)));
    const sets = members.map(spec => {
      const species = Dex.species(spec.species);
      const moves = spec.moves.filter(id => Dex.hasMove(id) && Dex.canLearn(species, id));
      const set = PokemonLib.normalizeSet({
        species: species.id,
        level,
        ability: Dex.hasAbility(species, spec.ability) ? spec.ability : Dex.abilityList(species)[0],
        item: Dex.item(spec.item) ? spec.item : null,
        nature: spec.nature,
        moves,
        // `spec.evs` is kept in content.js (data-validation reads the spreads)
        // but Campaign runs without EVs, so it is deliberately not applied.
        evs: PokemonLib.zeroStats(),
        teraType: species.types[0],
      });
      return moves.length === 4 ? set : PokemonLib.fillMoves(set, {rng, level});
    });
    // Ascension "Hardened Bosses" adds an extra generated member. It is drafted
    // for the boss's declared `teamPlan` where there is one, so the seventh
    // Pokémon reinforces the strategy instead of diluting it.
    const plan = boss.teamPlan ? Content.teamPlan(boss.teamPlan) : null;
    for (let i = 0; i < mods.bossTeamBonus && sets.length < 6; i++) {
      const pool = RandomTeams.viablePool(format).filter(s => s.bst >= 520);
      if (!pool.length) break;
      const species = plan
        ? rng.weighted(pool
          .map(s => [s, planSpeciesFit(s, plan)])
          .sort((a, b) => b[1] - a[1])
          .slice(0, 20)
          .map(([s], at) => [s, 20 - at]))
        : rng.pick(pool);
      const set = RandomTeams.randomSet(species || rng.pick(pool), rng, {format, level});
      sets.push(plan ? applyPlanToSet(set, plan) : set);
    }
    return sets;
  }

  /** AI tiers in ascending order, for challenge-based promotion. */
  const AI_LADDER = ['casual', 'trainer', 'ace', 'expert'];

  function aiTierFor(run, kind) {
    // Rebirth plays every opponent at Expert whatever the difficulty says. A
    // fully-built themed six played by Casual would be a costume, not a fight.
    if (isRebirth(run)) return Content.REBIRTH.aiTier;
    const difficulty = Content.difficulty(run.difficulty);
    const mods = modifiers(run);
    const base = (kind === 'elite' && mods.eliteAi)
      ? mods.eliteAi
      : (difficulty.aiTier[kind] || difficulty.aiTier.trainer || 'trainer');
    // Every two challenge steps promotes the opposition one tier — this is the
    // "real strategies" half of a higher self-chosen difficulty.
    const promote = Math.floor(challengeLevel(run) / 2);
    if (!promote) return base;
    const at = AI_LADDER.indexOf(base);
    if (at < 0) return base;
    return AI_LADDER[Math.min(AI_LADDER.length - 1, at + promote)];
  }

  /* ================================================================ *
   * Battle configuration
   * ================================================================ */

  /**
   * The battle roster. Each set carries its run `uid`, which `Battle` copies
   * onto the battle Pokémon — that is how post-battle condition is written back
   * to the right party member even after Team Preview reorders the team.
   */
  function playerBattleTeam(run) {
    return run.party
      .filter(m => m.condition.currentHP > 0)
      .map(m => ({set: Object.assign(memberSet(run, m), {uid: m.uid}), condition: m.condition, uid: m.uid}));
  }

  /** Extract post-battle condition keyed by run member uid. */
  function collectSurvivors(battle, sideIndex = 0) {
    return battle.sides[sideIndex].team.map(pokemon => ({
      uid: pokemon.uid,
      condition: PokemonLib.extractCondition(pokemon),
    }));
  }

  function buildBattleConfig(run, {kind, theme, size, levelOffset = 0, opponent = null, boss = null, background, reward = null, title, sets = null}) {
    const rng = rngOf(run);
    const mods = modifiers(run);
    const level = enemyLevel(run, levelOffset);
    const roster = playerBattleTeam(run);
    // `sets` lets a caller supply the opposing team outright — Rare Encounters
    // build one specific Pokémon rather than drawing from the power band.
    /*
     * Rebirth Mode attaches here, and only here.
     *
     * Every opposing team in the game already funnels through this function, so
     * one branch covers Trainers, Elites and bosses at once — a full themed six
     * at Expert with its doctrine on the field.
     *
     * `sets` and `wild` are excluded deliberately: a Rare Encounter and a Wild
     * Encounter are *one* Pokémon by definition, and six of them would be a
     * different node type rather than a harder one.
     */
    const rebirth = (isRebirth(run) && !sets && kind !== 'wild') ? rebirthPlanFor(run, boss) : null;
    const enemySets = sets || (boss
      ? buildBossTeam(run, boss, level)
      : (rebirth
        ? buildRebirthTeam(run, rebirth, level)
        : buildOpponentTeam(run, {kind, theme, size: size ?? encounterSize(run, kind), level})));
    const archetype = boss
      ? {name: boss.name, sprite: boss.sprite}
      : (rebirth
        // Themed opposition reuses TRAINER_ARCHETYPES rather than needing a
        // parallel table: the doctrine names a type, and the type names a
        // trainer. A Rain team is met by a Swimmer.
        ? pickTrainerArchetype(run, kind, rebirth.rebirth?.theme || null)
        : (opponent || pickTrainerArchetype(run, kind, theme)));
    const doctrine = rebirth?.rebirth || null;

    return {
      kind,
      title: title || archetype.name,
      seed: rng.int(0, 0x7fffffff),
      format: 'campaign',
      background: background || 'Meadow.jpg',
      aiDifficulty: aiTierFor(run, boss ? (boss.id === Content.FINAL_BOSS.id ? 'final' : 'boss') : kind),
      revealOpponent: !!mods.revealOpponent,
      teamPreview: kind !== 'wild',
      opponent: {
        name: archetype.name,
        sprite: archetype.sprite || null,
        // A boss keeps its authored prose plan and gains its doctrine beside it.
        plan: doctrine ? `${boss?.plan || rebirth.name} — ${doctrine.name}` : (boss?.plan || null),
        // Announced before the battle, not discovered by losing a Pokémon to
        // it: the doctrine is the opponent's stated special ability, and an
        // opening field effect nobody warned you about is a gotcha.
        intro: doctrine
          ? [boss?.intro, doctrine.blurb].filter(Boolean).join(' ')
          : (boss?.intro || null),
      },
      playerTeam: roster.map(r => r.set),
      playerConditions: roster.map(r => r.condition),
      playerUids: roster.map(r => r.uid),
      enemyTeam: enemySets,
      // Plain JSON, because the config is stored on the run and re-read on load.
      fieldEffects: rebirth ? rebirthFieldEffects(rebirth, 1) : null,
      rebirthPlan: rebirth?.id || null,
      // Every battle payout passes through here, so the mode's credit multiplier
      // needs applying in exactly one place.
      reward: reward && mods.rewardCreditMultiplier !== 1
        ? Object.assign({}, reward, {credits: Math.round((reward.credits || 0) * mods.rewardCreditMultiplier)})
        : reward,
      bossId: boss?.id || null,
    };
  }

  function pickTrainerArchetype(run, kind, theme) {
    const rng = rngOf(run);
    const tier = kind === 'elite' ? 'elite' : 'trainer';
    const candidates = Content.TRAINER_ARCHETYPES.filter(a => a.tier === tier && (!theme || !a.theme || a.theme === theme));
    const pool = candidates.length ? candidates : Content.TRAINER_ARCHETYPES.filter(a => a.tier === tier);
    const picked = rng.pick(pool) || Content.TRAINER_ARCHETYPES[0];
    return {name: picked.name, sprite: picked.sprite, theme: picked.theme};
  }

  /**
   * Instantiate a live Battle from a stored config. The UI calls this; the run
   * itself only ever holds the serialisable config.
   */
  function createBattle(run, config) {
    const format = Formats.get(config.format);
    const rules = Object.assign({}, format.rules, {
      teamPreview: config.teamPreview,
      bringCount: Math.max(config.playerTeam.length, config.enemyTeam.length),
      teamSize: 6,
      hideOpponentDetails: !config.revealOpponent,
      forceLevel: null,
      maxLevel: 100,
    });
    return new RedGPT.Battle({
      format: Object.assign({}, format, {rules}),
      seed: config.seed,
      background: config.background,
      // Rebirth Mode's declared opening field state. Absent on every other
      // battle, so `applyFieldEffects` is a no-op there.
      fieldEffects: config.fieldEffects || null,
      sides: [
        {name: run.trainerName || 'You', team: config.playerTeam, conditions: config.playerConditions, controller: 'human'},
        {name: config.opponent.name, avatar: config.opponent.sprite, team: config.enemyTeam, controller: 'ai', ai: {difficulty: config.aiDifficulty}},
      ],
    });
  }

  /* ================================================================ *
   * Rewards
   * ================================================================ */

  function rarityRoll(run, boost = 0) {
    const rng = rngOf(run);
    const actBonus = runProgress(run) * 0.16;
    // Rebirth's share of "better rewards". Here rather than at each call site so
    // held-item rewards, treasure and shop stock all get it from one place.
    const rebirthBonus = isRebirth(run) ? Content.REBIRTH.rarityBoost * 0.2 : 0;
    const roll = rng.next() + actBonus + boost * 0.2 + rebirthBonus;
    if (roll > 0.86) return 'rare';
    if (roll > 0.52) return 'uncommon';
    return 'common';
  }

  /**
   * A Mega Stone one of the current party members could actually use, or null.
   *
   * Mega Stones are species-specific, so handing out a random one would be dead
   * weight almost every time. Rewards only ever offer a stone that matches
   * somebody on the team.
   */
  /**
   * Every held item the player already has — in the bag *or* equipped on a
   * party member.
   *
   * The bag alone is not ownership: the moment a Mega Stone is given to a
   * Pokémon it leaves the bag, and a bag-only check would then cheerfully offer
   * the same stone again as a reward or shop item.
   */
  function ownedItemIds(run) {
    const owned = new Set();
    for (const [id, count] of Object.entries(run.bag.held || {})) if (count > 0) owned.add(Dex.toID(id));
    for (const member of run.party || []) if (member.set.item) owned.add(Dex.toID(member.set.item));
    return owned;
  }

  /**
   * Every transformation item that would do something for someone in the party.
   *
   * Two sources, because the game data records them differently: Mega Stones
   * carry a `megaStone` mapping in the packaged item data, while the Primal,
   * Crowned and Origin items only record an `itemUser` name, so their pairings
   * are declared in `Mechanics.FORME_CHANGE_ITEMS`. Both use the same
   * `{BaseName: TargetName}` shape, so one matcher serves both.
   *
   * Items already owned — in the bag *or* equipped — are excluded, so the same
   * stone is never offered twice.
   */
  function partyFormeItems(run) {
    const owned = ownedItemIds(run);
    const inParty = new Set((run.party || []).map(m => Dex.toID(m.set.species)));
    const matches = [];
    const consider = (id, mapping) => {
      if (!mapping || owned.has(Dex.toID(id))) return;
      const pairs = typeof mapping === 'string' ? [] : Object.entries(mapping);
      if (pairs.some(([base, target]) => inParty.has(Dex.toID(base)) && Dex.hasSpecies(target))) {
        matches.push(Dex.toID(id));
      }
    };
    for (const item of Object.values(Dex.allItems)) consider(item.id, item.megaStone);
    for (const [id, mapping] of Object.entries(Mechanics.FORME_CHANGE_ITEMS)) {
      if (Dex.item(id)) consider(id, mapping);
    }
    return matches;
  }

  function partyMegaStone(run) {
    const matches = partyFormeItems(run);
    return matches.length ? rngOf(run).pick(matches) : null;
  }

  function randomHeldItem(run, {rarity = null, rarityBoost = 0} = {}) {
    const rng = rngOf(run);
    const tier = rarity || rarityRoll(run, rarityBoost);
    // A rare slot sometimes becomes a Mega Stone for someone on the team.
    if (tier === 'rare' && rng.chance(0.35)) {
      const stone = partyMegaStone(run);
      if (stone) return stone;
    }
    const pool = Content.HELD_ITEM_POOL[tier] || Content.HELD_ITEM_POOL.common;
    const owned = ownedItemIds(run);
    const fresh = pool.filter(id => !owned.has(id));
    return rng.pick(fresh.length ? fresh : pool);
  }

  function randomRelic(run) {
    const rng = rngOf(run);
    // A relic gated behind a meta unlock stays out of the pool until the
    // profile has earned it. `run.unlocks.relics` is the profile's list, passed
    // in at run creation.
    const earned = new Set(run.unlocks?.relics || []);
    // Held relics leave the pool — except a stackable one, which stays until
    // every copy is held so it can actually be offered a second and third time.
    const available = Content.RELICS.filter(r =>
      relicCount(run, r.id) < relicStackLimit(r) && (!r.unlockedBy || earned.has(r.id)));
    if (!available.length) return null;
    const weights = available.map(r => [r.id, r.rarity === 'common' ? 5 : r.rarity === 'uncommon' ? 3 : 1.5]);
    return rng.weighted(weights);
  }

  /** How many copies of a relic the run may hold. One unless it says otherwise. */
  function relicStackLimit(relic) {
    return Math.max(1, relic?.maxStack || 1);
  }

  function relicCount(run, id) {
    return (run.relics || []).filter(r => r === id).length;
  }

  function grantRelic(run, relicId) {
    const id = relicId || randomRelic(run);
    if (!id) return null;
    const relic = Content.relic(id);
    if (!relic) return null;
    // Duplicates are refused unless the relic declares `maxStack`. `modifiers()`
    // already sums by iterating `run.relics`, so a second copy stacks on its own
    // once it is allowed in — nothing else needs to know about stacking.
    if (relicCount(run, id) >= relicStackLimit(relic)) return null;
    run.relics.push(id);
    /*
     * A relic that raises the reroll allowance takes effect now as well as at the
     * next Act. Without this the pickup does nothing until the Act rolls over,
     * which for a relic found on the Act's own boss node means it does nothing at
     * all in the Act you earned it in.
     */
    if (relic.modifiers?.bonusRerolls) run.rerolls += relic.modifiers.bonusRerolls;
    const copies = relicCount(run, id);
    logEvent(run, copies > 1
      ? `Gained another ${relic.name} relic (×${copies}).`
      : `Gained the ${relic.name} relic.`);
    return relic;
  }

  function addConsumable(run, id, count = 1) {
    if (!Content.CONSUMABLES[id]) return false;
    run.bag.consumables[id] = (run.bag.consumables[id] || 0) + count;
    return true;
  }

  function addHeldItem(run, id, count = 1) {
    if (!Dex.item(id)) return false;
    run.bag.held[id] = (run.bag.held[id] || 0) + count;
    return true;
  }

  function addEvolutionItem(run, id, count = 1) {
    if (!Dex.item(id)) return false;
    run.bag.evolution[id] = (run.bag.evolution[id] || 0) + count;
    return true;
  }

  function addCredits(run, amount) {
    run.credits = Math.max(0, run.credits + Math.round(amount));
    if (amount > 0) run.stats.creditsEarned += Math.round(amount);
    return run.credits;
  }

  /** Notable moves the party could actually receive, each with its eligible members. */
  const TM_STATUS_WHITELIST = new Set(['stealthrock', 'spikes', 'toxicspikes', 'thunderwave', 'willowisp', 'toxic',
    'recover', 'roost', 'swordsdance', 'nastyplot', 'calmmind', 'dragondance', 'bulkup', 'irondefense',
    'protect', 'substitute', 'taunt', 'defog', 'lightscreen', 'reflect', 'trickroom', 'raindance', 'sunnyday',
    'leechseed', 'agility', 'quiverdance', 'shellsmash', 'encore', 'yawn', 'haze', 'painsplit', 'wish']);

  function tmOptions(run, count) {
    const rng = rngOf(run);
    const candidates = new Map();
    for (const member of run.party) {
      const species = Dex.species(member.set.species);
      for (const moveId of Object.keys(species.learnset)) {
        if (!Dex.hasMove(moveId) || member.set.moves.includes(moveId)) continue;
        const move = Dex.move(moveId);
        const notable = move.category === 'Status' ? TM_STATUS_WHITELIST.has(move.id) : (move.basePower || 0) >= 60;
        if (!notable) continue;
        if (!candidates.has(moveId)) candidates.set(moveId, []);
        candidates.get(moveId).push(member.uid);
      }
    }
    const list = [...candidates.entries()].map(([id, eligible]) => ({id, eligible}));
    if (!list.length) return [];
    return rng.sample(list, count);
  }

  function buildRewardOptions(run, {kind, credits = 0, guarantee = null}) {
    const mods = modifiers(run);
    const rng = rngOf(run);
    const count = clamp(mods.rewardOptions, 2, 5);
    const options = [];

    // A one-Pokémon party cannot survive the Act; recruitment is guaranteed
    // until the roster is big enough to take a hit.
    if (run.party.length < 3 && kind !== 'treasure') {
      options.push({kind: 'recruit', label: 'Recruitment', detail: 'Choose one Pokémon to join the party.'});
    }
    if (guarantee === 'relic') {
      const relicId = randomRelic(run);
      if (relicId) options.push({kind: 'relic', id: relicId, label: Content.relic(relicId).name, detail: Content.relic(relicId).description});
    }
    if (guarantee === 'item' || kind === 'elite') {
      const itemId = randomHeldItem(run, {rarityBoost: 1});
      options.push({kind: 'held', id: itemId, label: Dex.item(itemId).name, detail: Dex.item(itemId).shortDesc});
    }

    const pools = [
      () => {
        const itemId = randomHeldItem(run);
        return {kind: 'held', id: itemId, label: Dex.item(itemId).name, detail: Dex.item(itemId).shortDesc};
      },
      () => {
        const moves = tmOptions(run, clamp(mods.tmOptions, 2, 5));
        return moves.length ? {kind: 'tm', moves, label: 'TM Reward', detail: `Teach one of ${moves.length} moves to an eligible party Pokémon.`} : null;
      },
      () => ({kind: 'credits', amount: Math.round((120 + rng.int(0, 90)) * (1 + (1 + runProgress(run) * 2) * 0.35) * mods.rewardCreditMultiplier), label: 'Credits', detail: 'Spend at shops on items, healing and recruits.'}),
      () => {
        const id = rng.weighted([['superpotion', 5], ['hyperpotion', 4], ['fullrestore', 2], ['revive', 2], ['maxether', 2], ['teamrations', 1]]);
        return {kind: 'consumable', id, count: id === 'superpotion' ? 2 : 1, label: Content.CONSUMABLES[id].name, detail: Content.CONSUMABLES[id].description};
      },
      /*
       * Supply Drop replaces the old "Field Treatment", which restored 50% max
       * HP to the party — exactly what Team Rations already does, so the two
       * read as the same reward twice. HP is the best-covered resource in the
       * run (potions, Rations, Rest Sites, and automatic post-battle healing);
       * PP is the least, coming back at only 35% a battle and otherwise needing
       * a single-target Ether. Status is likewise only curable one Pokémon at a
       * time. This covers both, party-wide, and overlaps nothing.
       */
      () => ({kind: 'supplies', amount: 0.6, label: 'Supply Drop',
        detail: 'Restore 60% PP to every move and cure status for the whole party.'}),
      () => (shouldOfferRecruit(run)
        ? {kind: 'recruit', label: 'Recruitment',
          detail: run.party.length < MAX_PARTY
            ? 'Choose one Pokémon to join the party.'
            : 'Choose one Pokémon to join — your party is full, so one must be released.'}
        : null),
      () => {
        const relicId = randomRelic(run);
        return relicId ? {kind: 'relic', id: relicId, label: Content.relic(relicId).name, detail: Content.relic(relicId).description} : null;
      },
      () => ({kind: 'levels', amount: 1, label: 'Training Session', detail: 'The team gains one level.'}),
    ];

    const order = rng.shuffle(pools);
    for (const build of order) {
      if (options.length >= count) break;
      const option = build();
      if (!option) continue;
      if (options.some(o => o.kind === option.kind && o.id === option.id)) continue;
      options.push(option);
    }
    if (credits > 0) run.pendingCredits = credits;
    return options;
  }

  function offerReward(run, {title, kind, guarantee = null}) {
    const options = buildRewardOptions(run, {kind, guarantee});
    if (!options.length) return null;
    return pushPrompt(run, {type: 'reward', title: title || 'Choose a reward', options, kind});
  }

  function applyRewardOption(run, option) {
    switch (option.kind) {
      case 'credits':
        addCredits(run, option.amount);
        return `Gained ${option.amount} credits.`;
      case 'held':
        addHeldItem(run, option.id);
        return `${Dex.item(option.id).name} added to the bag.`;
      case 'consumable':
        addConsumable(run, option.id, option.count || 1);
        return `${Content.CONSUMABLES[option.id].name} ×${option.count || 1} added to the bag.`;
      case 'relic': {
        const relic = grantRelic(run, option.id);
        return relic ? `${relic.name} equipped for this run.` : 'No relic was available.';
      }
      case 'heal':
        healTeam(run, option.amount);
        return 'The party was patched up.';
      case 'supplies': {
        restorePP(run, option.amount);
        const cured = run.party.filter(member => member.condition.status).length;
        for (const member of run.party) {
          member.condition.status = null;
          member.condition.toxicCounter = 1;
        }
        return cured
          ? `The team restocked and shook off ${cured === 1 ? 'a status condition' : `${cured} status conditions`}.`
          : 'The team restocked its moves.';
      }
      case 'levels':
        addLevels(run, option.amount);
        return `The team is now level ${run.teamLevel}.`;
      case 'tm':
        pushPrompt(run, {type: 'tm', title: 'Choose a move to teach', moves: option.moves});
        return null;
      case 'recruit': {
        const opened = offerRecruit(run, {count: modifiers(run).recruitOptions, quality: 'normal'});
        return opened ? null : 'No recruits were available.';
      }
      default:
        return 'Nothing happened.';
    }
  }

  /* ================================================================ *
   * Recruitment
   * ================================================================ */

  /**
   * How much more likely a species is to be offered when the player has asked
   * for a theme. 1 for a species the plan cannot use, up to
   * `REBIRTH.recruitThemeWeight` for its ideal.
   *
   * A bias rather than a filter: filtering the pool to a theme can empty it
   * (the band is already narrow late in a long run) and would hand back the
   * bottom-of-the-pool fallback this file has been bitten by before.
   */
  function planRecruitBias(species, plan) {
    const fit = planSpeciesFit(species, plan);
    /*
     * Signed, for the reason `Advisor.recruitScore` records about Speed: a
     * base-160 Pokémon is a *liability* on a Trick Room team, not merely
     * unhelpful, so scoring it 1x leaves it as likely as anything else. Seen on
     * the scratch build — a Trick Room scout returned Ninjask.
     */
    if (fit < 0) return Math.max(0.15, 1 + fit / 60);
    return 1 + Math.min(fit, 180) / 180 * (Content.REBIRTH.recruitThemeWeight - 1);
  }

  function recruitCandidates(run, {count = 3, quality = 'normal', theme = null, plan = null, species = null, set = null} = {}) {
    const rng = rngOf(run);
    const format = Formats.get('campaign');
    /*
     * An exact set, offered as-is. Rare Encounters hand over the Pokémon the
     * player actually fought — its moveset, ability, item, nature and Tera type —
     * rather than rolling a fresh one, because "you beat that thing, now it joins
     * you" is the whole point of the node. Re-levelled to the team level so the
     * preview shows the number the party will actually field.
     */
    if (set) return [PokemonLib.normalizeSet(Object.assign({}, set, {level: run.teamLevel}))];
    if (species) {
      return [RandomTeams.randomSet(Dex.species(species), rng, {format, level: run.teamLevel})];
    }
    // Recruits track the run's power band, with headroom so a growing party can
    // actually keep pace with Act bosses rather than falling behind.
    const band = powerBand(run, 'trainer');
    const bonus = (quality === 'great' ? 120 : quality === 'good' ? 60 : 0) + Math.round(runProgress(run) * 50);
    const tiered = recruitablePool(run, themedPool(theme, format));
    const low = band.min + bonus;
    const high = band.max + bonus + 90;
    const banded = tiered.filter(s => s.bst >= low && s.bst <= high);
    /*
     * Falling back must stay inside the rarity gate — dropping to the whole
     * viable pool is what once offered an Arceus in Act 1 — but it must also not
     * drop to the *bottom* of it, which is the opposite failure and was live.
     *
     * `powerBand` adds a `challengeLevel` lift of 28 per step, and a long run is
     * itself worth challenge steps: an eight-Act run is +5, so +140 BST. Past the
     * middle of such a run the band floor climbs to ~620 while legendaries are
     * still gated until 82% progress, so almost nothing qualifies, `banded` came
     * up short, and the old fallback handed over the entire non-legendary pool —
     * measured as a 472-BST Furfrou offered at 74% of an eight-Act run, right
     * after 600-BST offers. That is the reported "after Act 3 it gives random low
     * tier Pokémon", and it is a run-length bug rather than an Act-number one.
     *
     * So when the band cannot be filled, offer the candidates *closest in power*
     * to it instead of arbitrary ones. Recruits then still track the run, and the
     * tier gate is untouched.
     */
    let usable = banded;
    if (banded.length < count) {
      const target = (low + high) / 2;
      usable = [...tiered]
        .sort((a, b) => Math.abs(a.bst - target) - Math.abs(b.bst - target))
        .slice(0, Math.max(count * 4, 16));
    }
    const owned = new Set(run.party.map(m => Dex.toID(Dex.species(m.set.species).baseSpecies)));
    const fresh = usable.filter(s => !owned.has(Dex.toID(s.baseSpecies)));
    const source = (fresh.length >= count ? fresh : usable).filter(Boolean);
    if (!source.length) return [];
    /*
     * A themed draw. This reads a plan the *player just picked on this prompt*,
     * never `run.assist.plan` — the Assist setting is advisory and is toggleable
     * mid-run, so letting it steer what is offered would desynchronise a seeded
     * run. An explicit choice made inside the prompt is a run action, like a
     * reroll, and is reproducible from the seed plus the command.
     */
    const planned = plan ? Content.teamPlan(plan) : null;
    const weights = source.map(s => [s, recruitWeight(s) * (planned ? planRecruitBias(s, planned) : 1)]);
    const chosen = [];
    const seen = new Set();
    let guard = 0;
    while (chosen.length < count && guard++ < count * 30) {
      const species = rng.weighted(weights);
      if (!species || seen.has(species.id)) continue;
      seen.add(species.id);
      chosen.push(RandomTeams.randomSet(species, rng, {format, level: run.teamLevel}));
    }
    return chosen;
  }

  /**
   * Recruitment rarity tiers.
   *
   * Opponents can field anything the format allows, but a recruit joins the
   * party permanently and can decide a run on its own, so recruits are tiered
   * rather than drawn flat from the format pool:
   *
   *   common     ordinary species
   *   uncommon   BST 500-579
   *   rare       BST 580+ (Dragonite, Garchomp, Tyranitar…)
   *   legendary  the restricted legendaries — final Act only, and rare there
   *   never      mythicals (Arceus, Mew, Celebi) and the Anything-Goes tier
   *
   * A flat draw is what once offered an Arceus, because the BST band's fallback
   * dropped to the whole viable pool and nothing excluded mythicals at all.
   */
  function recruitTier(species) {
    if (species.powerClass === 'unrestricted-only') return 'never';
    if (species.mythical) return 'never';
    if (species.legendary || species.powerClass === 'restricted') return 'legendary';
    if (species.bst >= 580) return 'rare';
    if (species.bst >= 500) return 'uncommon';
    return 'common';
  }

  /**
   * How likely each tier is to be offered, and how far into the run it unlocks.
   *
   * `from` is a `runProgress` threshold rather than an Act number, so the same
   * curve holds whether the player picked one Act or eight: legendaries are a
   * late-run rarity in both, not an Act-3 rule that a six-Act run would hand out
   * halfway through.
   */
  const RECRUIT_TIERS = {
    common: {weight: 30, from: 0},
    uncommon: {weight: 18, from: 0},
    rare: {weight: 7, from: 0.34},
    legendary: {weight: 1, from: 0.82},
    never: {weight: 0, from: Infinity},
  };

  function recruitTierAvailable(run, tier) {
    const rule = RECRUIT_TIERS[tier];
    if (!rule || rule.weight <= 0) return false;
    return runProgress(run) >= rule.from;
  }

  function recruitablePool(run, pool) {
    return pool.filter(species => recruitTierAvailable(run, recruitTier(species)));
  }

  /** Rarity weight for a recruit candidate. */
  function recruitWeight(species) {
    return RECRUIT_TIERS[recruitTier(species)].weight;
  }

  /**
   * Is a recruit offer worth showing right now?
   *
   * A full party used to remove recruitment from rewards, shops, wild
   * encounters and the Specialist entirely, which quietly ended the run's
   * team-building the moment the sixth Pokémon joined. The recruit prompt has
   * always handled a full party — it asks which member to release — so the
   * offer is made either way; it is simply rarer when there is no free slot, so
   * a settled team is not asked on every single node.
   */
  function recruitOfferChance(run) {
    return run.party.length < MAX_PARTY ? 1 : 0.45;
  }

  function shouldOfferRecruit(run) {
    const chance = recruitOfferChance(run);
    return chance >= 1 || rngOf(run).chance(chance);
  }

  function offerRecruit(run, options = {}) {
    const mods = modifiers(run);
    const count = clamp((options.count || mods.recruitOptions) + (options.bonus || 0), 1, 5);
    const candidates = recruitCandidates(run, {...options, count});
    if (!candidates.length) return null;
    return pushPrompt(run, {
      type: 'recruit',
      title: options.reason || 'A Pokémon is willing to join you',
      options: candidates,
      rerollsLeft: run.rerolls,
      // A full party can always walk away. Offering the recruit is fine;
      // *forcing* a release to take it would be strictly worse than the old
      // behaviour of not offering at all.
      allowDecline: options.allowDecline !== false || run.party.length >= MAX_PARTY,
      partyFull: run.party.length >= MAX_PARTY,
      quality: options.quality || 'normal',
      /*
       * Rebirth's theme selection: redraw this offer biased toward one plan.
       *
       * Free, and available **once** per prompt (`themeUsed`). A free unlimited
       * redraw is a slot machine — pick a theme, not the theme you like the
       * look of the result of — and charging a reroll for it would make it the
       * reroll button with extra steps.
       */
      themes: isRebirth(run) && options.themes !== false ? [...Content.REBIRTH.trainerPlans] : null,
      themeUsed: false,
      plan: null,
    });
  }

  /* ================================================================ *
   * Shops
   * ================================================================ */

  function buildShopStock(run) {
    const rng = rngOf(run);
    const mods = modifiers(run);
    const slots = clamp(mods.shopSlots, 3, 9);
    const stock = [];
    const price = base => Math.max(10, Math.round(base * mods.priceMultiplier));

    // Always at least one healing option and one held item.
    const healing = rng.weighted([['superpotion', 4], ['hyperpotion', 4], ['fullrestore', 3], ['revive', 2], ['teamrations', 2]]);
    stock.push({kind: 'consumable', id: healing, price: price(Content.CONSUMABLES[healing].price), name: Content.CONSUMABLES[healing].name, detail: Content.CONSUMABLES[healing].description});

    // Held items biased toward what the party can actually use.
    const roles = run.party.map(m => RandomTeams.classifyRole(Dex.species(m.set.species), rng).id);
    const wantsBulk = roles.filter(r => r === 'wall' || r === 'support' || r === 'bulkyattacker').length >= run.party.length / 2;
    const heldPreference = wantsBulk
      ? ['leftovers', 'rockyhelmet', 'assaultvest', 'heavydutyboots', 'eviolite', 'blacksludge']
      : ['lifeorb', 'choiceband', 'choicespecs', 'choicescarf', 'focussash', 'expertbelt'];
    for (let i = 0; i < 2; i++) {
      const preferred = rng.chance(0.6) ? rng.pick(heldPreference) : randomHeldItem(run);
      const item = Dex.item(preferred);
      if (!item) continue;
      const tier = (item.megaStone || Mechanics.FORME_CHANGE_ITEMS[item.id]) ? 'rare'
        : Object.entries(Content.HELD_ITEM_POOL).find(([, list]) => list.includes(item.id))?.[0] || 'uncommon';
      const basePrice = tier === 'rare' ? 620 : tier === 'uncommon' ? 420 : 240;
      stock.push({kind: 'held', id: item.id, price: price(basePrice), name: item.name, detail: item.shortDesc});
    }

    // Evolution items only when a party member could actually use one.
    const usableEvolutionItems = new Set();
    for (const member of run.party) {
      for (const rule of Dex.evolutions(member.set.species)) {
        if (rule.method === 'item' && Dex.item(rule.item)) usableEvolutionItems.add(Dex.item(rule.item).id);
      }
    }
    if (usableEvolutionItems.size && rng.chance(0.8)) {
      const id = rng.pick([...usableEvolutionItems]);
      stock.push({kind: 'evolution', id, price: price(700), name: Dex.item(id).name, detail: 'Evolves a Pokémon that responds to it.'});
    }

    const extras = [
      () => {
        const id = rng.weighted([['potion', 3], ['superpotion', 4], ['fullheal', 3], ['ether', 3], ['maxether', 2], ['revive', 2], ['maxrevive', 1], ['hyperpotion', 3]]);
        return {kind: 'consumable', id, price: price(Content.CONSUMABLES[id].price), name: Content.CONSUMABLES[id].name, detail: Content.CONSUMABLES[id].description};
      },
      () => {
        const id = randomHeldItem(run, {rarityBoost: 1});
        const item = Dex.item(id);
        return item ? {kind: 'held', id, price: price(560), name: item.name, detail: item.shortDesc} : null;
      },
      () => ({kind: 'beacon', price: price(850), name: 'Rescue Beacon', detail: 'Survive one lost battle: the party is airlifted out at half health.'}),
      () => ({kind: 'heal', price: price(240), name: 'Field Clinic', detail: 'Fully restore HP, status and PP for the whole party.'}),
      () => ({kind: 'tutor', price: price(380), name: 'Move Tutor', detail: 'Teach one party Pokémon any move it can legally learn.'}),
      () => (shouldOfferRecruit(run)
        ? {kind: 'recruit', price: price(750), name: 'Recruitment Contract',
          detail: run.party.length < MAX_PARTY
            ? 'Choose one Pokémon from three candidates.'
            : 'Choose one Pokémon from three candidates. Your party is full, so one must be released.'}
        : null),
      () => {
        const relicId = randomRelic(run);
        return relicId ? {kind: 'relic', id: relicId, price: price(900), name: Content.relic(relicId).name, detail: Content.relic(relicId).description} : null;
      },
    ];
    const order = rng.shuffle(extras);
    for (const build of order) {
      if (stock.length >= slots) break;
      const entry = build();
      if (entry) stock.push(entry);
    }
    return stock.slice(0, slots).map((entry, index) => Object.assign({index, sold: false}, entry));
  }

  /**
   * Items that exist *for* a particular Pokémon, keyed by what asks for them.
   *
   * Generic fit scoring cannot find these: a Damp Rock is a bad item on paper
   * and the right one for the Pokémon that sets the rain, and `itemFit` rates a
   * Warp Prism as junk because it has no idea anything in the party knows Trick
   * Room. This is the "the shop noticed what you are building" tier.
   *
   * Kept as data rather than branches so a new pairing is one line, and pinned
   * by a test that every id resolves — an unresolvable id here is silently
   * inert, which is the `fickelbeam` failure in another table.
   */
  /**
   * Does this item actually *do* something in battle?
   *
   * Deliberately not `Items.isSimulated`, which also passes the inert-by-design
   * group — Z-crystals, mail, flutes — because those are not a coverage *gap*.
   * That is the right answer for the coverage report and the wrong one for a
   * shop: `itemUser` names Pikachu on Pikanium Z exactly as it does on the
   * Light Ball, and this project does not simulate Z-moves, so that shelf slot
   * would be a sale of nothing. Selling an inert item is worse than selling one
   * fewer.
   */
  const itemDoesSomething = id =>
    !!Items.registry[Dex.toID(id)] || Items.isFormeItem(Dex.toID(id));

  const MOVE_SYNERGY_ITEMS = {
    trickroom: 'warpprism',
    tailwind: 'windsock',
    reflect: 'lightclay', lightscreen: 'lightclay', auroraveil: 'lightclay',
    raindance: 'damprock', sunnyday: 'heatrock', sandstorm: 'smoothrock',
    snowscape: 'icyrock', hail: 'icyrock',
    electricterrain: 'terrainextender', psychicterrain: 'terrainextender',
    grassyterrain: 'terrainextender', mistyterrain: 'terrainextender',
    bellydrum: 'sitrusberry',
    shellsmash: 'whiteherb', closecombat: 'whiteherb', overheat: 'whiteherb',
    dracometeor: 'whiteherb', leafstorm: 'whiteherb',
    rest: 'chestoberry',
    facade: 'flameorb',
    psychoshift: 'toxicorb',
    solarbeam: 'powerherb', meteorbeam: 'powerherb', electroshot: 'powerherb',
  };
  const ABILITY_SYNERGY_ITEMS = {
    protosynthesis: 'boosterenergy', quarkdrive: 'boosterenergy',
    guts: 'flameorb', flareboost: 'flameorb', toxicboost: 'toxicorb',
    quickfeet: 'toxicorb', poisonheal: 'toxicorb',
    magicguard: 'lifeorb', harvest: 'sitrusberry', unburden: 'sitrusberry',
    cheekpouch: 'sitrusberry', ripen: 'sitrusberry',
    drizzle: 'damprock', drought: 'heatrock', sandstream: 'smoothrock', snowwarning: 'icyrock',
    electricsurge: 'terrainextender', psychicsurge: 'terrainextender',
    grassysurge: 'terrainextender', mistysurge: 'terrainextender',
    // Arceus and Silvally are a *different* Pokémon without their plate or
    // memory (§8), so one is the most specific item the shop can offer them.
    multitype: null, rkssystem: null,
  };

  /**
   * Held items tied to a specific member of this party, with the reason.
   *
   * Five sources, in descending specificity:
   *   1. Mega Stones and forme-change items the party can actually use.
   *   2. A Plate or Memory for a Multitype / RKS System holder.
   *   3. Items whose packaged `itemUser` names a party species — Light Ball,
   *      Thick Club, Leek, Soul Dew. Read from the data rather than listed.
   *   4. A move somebody knows that an item extends or enables.
   *   5. An ability somebody has that an item turns on.
   *
   * @returns {{id: string, uid: string, reason: string}[]}
   */
  function partySynergyItems(run) {
    const owned = ownedItemIds(run);
    const out = [];
    const listed = new Set();
    const add = (id, member, reason) => {
      const item = Dex.item(id);
      if (!item || listed.has(item.id) || owned.has(item.id)) return;
      if (!itemDoesSomething(item.id)) return;
      listed.add(item.id);
      out.push({id: item.id, uid: member.uid, reason});
    };

    for (const member of run.party) {
      const species = Dex.species(member.set.species);
      const ability = Dex.toID(member.set.ability);
      const moves = (member.set.moves || []).map(Dex.toID);
      const name = PokemonLib.displayName(member.set);

      // 1. Forme items, matched against this member specifically.
      for (const id of partyFormeItems(run)) {
        const item = Dex.item(id);
        const mapping = item?.megaStone || Mechanics.FORME_CHANGE_ITEMS[item?.id];
        const pairs = typeof mapping === 'string' ? [] : Object.entries(mapping || {});
        if (pairs.some(([base]) => Dex.toID(base) === species.id)) {
          add(id, member, `${name} transforms with it`);
        }
      }

      // 2. Arceus / Silvally: a Plate or Memory is the item that decides what
      //    they *are*, so offering one is the most specific thing possible.
      if (ability === 'multitype' || ability === 'rkssystem') {
        const field = ability === 'multitype' ? 'onPlate' : 'onMemory';
        for (const item of Object.values(Dex.allItems)) {
          if (!item[field] || item.zMove) continue;
          add(item.id, member, `${name} becomes ${item[field]}-type holding it`);
          break;                                    // one is the offer, not all 17
        }
      }

      // 3. Species-specific items, read from the packaged `itemUser`.
      for (const item of Object.values(Dex.allItems)) {
        if (!item.itemUser?.length) continue;
        if (item.itemUser.some(user => Dex.toID(user) === species.id)) {
          add(item.id, member, `made for ${species.name}`);
        }
      }

      // 4. A move it knows that an item extends or enables.
      for (const moveId of moves) {
        const id = MOVE_SYNERGY_ITEMS[moveId];
        if (id) add(id, member, `${name} knows ${Dex.move(moveId).name}`);
      }

      // 5. An ability an item turns on.
      const abilityItem = ABILITY_SYNERGY_ITEMS[ability];
      if (abilityItem) add(abilityItem, member, `${name} has ${member.set.ability}`);

      /*
       * 6. A Ring Target for a Pokémon that a single type immunity blanks.
       *
       * This is the clearest case in the game for the "structurally cannot be
       * found by a fit score" rule this tier exists for: nothing about Ring
       * Target's stat line says "somebody here attacks with one type", and a
       * quality score rates it near the bottom of the pool. But a Spectrier's
       * Ghost moves do literally nothing to a Normal type and a Regieleki's
       * Electric moves do literally nothing to a Ground type — for those two the
       * item is not a marginal upgrade, it is the difference between having a
       * game and not.
       *
       * Derived rather than listed: a member qualifies when some single
       * defending type is immune to *every* attacking type it carries. A Ghost
       * and Dark attacker does not qualify, because nothing is immune to both.
       */
      const blankedBy = immuneToEverything(member);
      if (blankedBy) add('ringtarget', member, `${name} is walled outright by ${blankedBy} types`);
    }
    return out;
  }

  /**
   * The defending type that is immune to every attacking move this member has,
   * or null. Read off the packaged move types and the type chart, so a new
   * species or a taught move is covered with no list to maintain.
   */
  function immuneToEverything(member) {
    const attacking = [...new Set((member.set.moves || [])
      .map(id => Dex.move(Dex.toID(id)))
      .filter(move => move.category !== 'Status' && move.basePower > 0)
      .map(move => move.type))];
    // A Pokémon with no attacking moves at all is a wall, not a blanked
    // attacker — without this guard the condition is vacuously true for it.
    if (!attacking.length) return null;
    for (const defending of Object.keys(Dex.typeChart)) {
      if (attacking.every(type => Dex.typeEffectiveness(type, [defending]) === 0)) return defending;
    }
    return null;
  }

  /**
   * Battle Shop stock: held items chosen for the party that is actually here.
   *
   * The Supply Depot sells a bit of everything and biases held items by a rough
   * role count; this is the opposite trade. It stocks **only** held items, picks
   * them by scoring every candidate against every party member, and lets the
   * player buy **one**. A narrow shelf you can afford one thing from is a real
   * decision; a wide one you can afford one thing from is a sorting exercise.
   *
   * Two rules about where the scoring comes from:
   *
   * - It reuses `Advisor.itemFit`, rather than growing a second copy of "what
   *   suits this Pokémon" that would drift from the first. `advisor.js` loads
   *   *after* `run.js` (§4), so it is read at call time and guarded — the shop
   *   degrades to an unsorted pick rather than throwing if it is absent.
   * - **The team plan is deliberately not passed.** `itemFit` accepts one, and
   *   passing it here would let an Assist Mode setting change what the run
   *   *offers* — which is exactly the line §5 draws around plans, because it
   *   would desynchronise a seeded run the moment the player switched plan.
   */
  function buildBattleShopStock(run) {
    const rng = rngOf(run);
    const mods = modifiers(run);
    const price = base => Math.max(10, Math.round(base * mods.priceMultiplier));
    const advisor = RedGPT.Advisor;

    // Candidates: the whole held-item pool, plus anything the party could
    // transform with, minus what the party is already holding.
    const held = new Set(run.party.map(m => Dex.toID(m.set.item)).filter(Boolean));
    const candidates = new Set();
    for (const list of Object.values(Content.HELD_ITEM_POOL)) for (const id of list) candidates.add(id);
    for (const id of partyFormeItems(run)) candidates.add(id);

    const scored = [];
    for (const id of candidates) {
      const item = Dex.item(id);
      if (!item || held.has(item.id) || !itemDoesSomething(item.id)) continue;
      let best = -1;
      let holder = null;
      for (const member of run.party) {
        const fit = advisor ? advisor.itemFit(member, item.id) : 0;
        if (fit > best) { best = fit; holder = member; }
      }
      // `itemFit` returns -1 for an item that is a non-starter on that holder —
      // a Mega Stone for the wrong species, an Eviolite on something fully
      // evolved — so this is the filter that makes the shelf "relevant".
      if (best < 0 || !holder) continue;
      scored.push({id: item.id, fit: best, uid: holder.uid, reason: fitNote(holder, item)});
    }

    /*
     * **Every** slot is tailored, not just a reserved pair. This is a
     * specialist dealer, so a shelf with four generic items on it would be the
     * Supply Depot wearing a different sign.
     *
     * Two tiers, and the order matters. The synergy items go first because they
     * are the ones a fit score structurally cannot find — a Damp Rock is a bad
     * item on paper and the right one for the Pokémon setting the rain, and
     * nothing about a Warp Prism's stat line says "somebody here knows Trick
     * Room". The fit-scored items fill the rest, and each still names the
     * member it is for and why, so no card on the shelf is anonymous.
     */
    const special = rng.shuffle(partySynergyItems(run));
    const specialIds = new Set(special.map(entry => entry.id));
    scored.sort((a, b) => b.fit - a.fit);
    const slots = clamp(mods.shopSlots, 3, 6);
    // Seeded shuffle *within* the strongest fits, so two runs at the same point
    // do not see an identical shelf.
    const filler = rng.shuffle(scored.filter(entry => !specialIds.has(entry.id)).slice(0, 12));

    const tierOf = item => (item.megaStone || Mechanics.FORME_CHANGE_ITEMS[item.id]) ? 'rare'
      : Object.entries(Content.HELD_ITEM_POOL).find(([, list]) => list.includes(item.id))?.[0] || 'uncommon';
    const basePrice = {common: 320, uncommon: 520, rare: 820};
    const entryFor = entry => {
      const item = Dex.item(entry.id);
      const member = partyMember(run, entry.uid);
      return {
        kind: 'held', id: item.id, name: item.name, detail: item.shortDesc,
        // Every card says who it is for and why — the whole point of the node.
        forUid: entry.uid,
        forName: member ? PokemonLib.displayName(member.set) : null,
        note: entry.reason || null,
        price: price(basePrice[tierOf(item)] || 520),
      };
    };
    return [...special, ...filler].slice(0, slots)
      .map(entryFor)
      .map((entry, index) => Object.assign({index, sold: false}, entry));
  }

  /**
   * Why a generically-scored item suits the member it was matched to.
   *
   * Mirrors `Advisor.itemFit`'s own branches rather than re-deriving a fit, so
   * the sentence on the card cannot disagree with the score that put the item
   * there. A second opinion would drift; this is a label for the first one.
   */
  function fitNote(member, item) {
    const species = Dex.species(member.set.species);
    const stats = species.baseStats;
    const name = PokemonLib.displayName(member.set);
    const id = item.id;
    if (item.megaStone || Mechanics.FORME_CHANGE_ITEMS[id]) return `${name} transforms with it`;
    if (id === 'eviolite') return `${name} is not fully evolved`;
    if (id === 'boosterenergy') return `${name} has ${member.set.ability}`;
    if (item.boostType) return `${name} carries ${item.boostType} moves`;
    const physical = stats.atk >= stats.spa;
    const bulk = stats.hp + stats.def + stats.spd;
    if (['choiceband', 'muscleband', 'punchingglove'].includes(id)) return `${name} attacks physically`;
    if (['choicespecs', 'wiseglasses', 'throatspray'].includes(id)) return `${name} attacks specially`;
    if (['choicescarf', 'roomservice'].includes(id)) return `${name} wants the Speed`;
    if (['focussash', 'airballoon'].includes(id)) return `${name} is frail enough to need it`;
    if (['leftovers', 'blacksludge', 'rockyhelmet', 'assaultvest', 'heavydutyboots', 'shellbell'].includes(id)) {
      return `${name} is bulky enough to use it`;
    }
    if (id === 'lifeorb' || id === 'expertbelt') return `${name} is your strongest attacker`;
    return `${name} makes the most of it (${physical ? 'physical' : 'special'}, ${bulk} bulk)`;
  }

  function openBattleShop(run, node) {
    const stock = buildBattleShopStock(run);
    pushPrompt(run, {
      type: 'shop', title: 'Battle Shop', stock, background: node.background,
      // One purchase, then the node ends. Read by `resolveShopPrompt`.
      onePurchase: true,
      blurb: 'A specialist dealer. Everything here suits somebody in your party — but you may buy one item.',
    });
    syncRng(run);
    return {ok: true, phase: run.phase};
  }

  /**
   * Poké Mart stock: held items, Mega Stones the party can actually use, and
   * Tera Shards.
   *
   * This replaced the old "Item Fitter" specialist service, which only let the
   * player rearrange items they already owned — something the party sidebar
   * does at any time, so the node slot was doing nothing.
   */
  function buildMartStock(run) {
    const rng = rngOf(run);
    const mods = modifiers(run);
    const price = base => Math.max(10, Math.round(base * mods.priceMultiplier));
    const stock = [];
    const listed = new Set();

    const addHeld = (id, basePrice) => {
      const item = Dex.item(id);
      if (!item || listed.has(item.id)) return;
      listed.add(item.id);
      stock.push({kind: 'held', id: item.id, price: price(basePrice), name: item.name, detail: item.shortDesc});
    };

    // Every transformation item somebody in the party could use and does not
    // already have, so a Mega or a Primal is a goal the player can shop towards
    // rather than a duplicate of one already equipped. Covers Mega Stones and
    // the Primal/Crowned/Origin items alike.
    for (const id of partyFormeItems(run)) {
      const item = Dex.item(id);
      if (!item || listed.has(item.id)) continue;
      const mega = !!item.megaStone;
      listed.add(item.id);
      stock.push({
        kind: 'held', id: item.id, price: price(1250), name: item.name,
        detail: mega
          ? 'Mega Stone — hold it to Mega Evolve in battle.'
          : 'Transformation item — the holder changes forme the moment it enters battle.',
      });
    }

    // Tera Shards. Offer the party's own types first (a Tera that matches an
    // existing STAB is the common want), then a couple of wildcards.
    const partyTypes = [];
    for (const member of run.party) {
      for (const type of Dex.species(member.set.species).types) {
        if (!partyTypes.includes(type)) partyTypes.push(type);
      }
    }
    const shardTypes = [];
    for (const type of rng.shuffle(partyTypes).slice(0, 2)) shardTypes.push(type);
    for (const type of rng.shuffle(Dex.TYPES.filter(t => !shardTypes.includes(t))).slice(0, 2)) shardTypes.push(type);
    for (const type of shardTypes) {
      stock.push({
        kind: 'terashard', teraType: type, price: price(540), name: `${type} Tera Shard`,
        detail: `Changes one Pokémon's Tera Type to ${type}.`,
      });
    }

    // A spread of ordinary held items so the mart is useful without a Mega.
    for (const tier of ['common', 'uncommon', 'uncommon', 'rare']) {
      const pool = Content.HELD_ITEM_POOL[tier].filter(id => !listed.has(id));
      if (!pool.length) continue;
      addHeld(rng.pick(pool), tier === 'rare' ? 640 : tier === 'uncommon' ? 430 : 250);
    }

    return stock.map((entry, index) => Object.assign({index, sold: false}, entry));
  }

  /* ================================================================ *
   * Node handling
   * ================================================================ */

  function currentActMap(run) {
    return run.map.acts[run.act - 1];
  }

  function nodeById(run, id) {
    return currentActMap(run)?.nodes.find(n => n.id === id) || null;
  }

  function refreshAvailableNodes(run) {
    run.availableNodeIds = CampaignMap.availableFrom(run.map, run.act, run.currentNodeId)
      .filter(id => !run.clearedNodeIds.includes(id));
  }

  /**
   * Enter a node. The node's handler either sets up a battle (`phase: 'battle'`)
   * or pushes a prompt.
   */
  function enterNode(run, nodeId) {
    if (run.phase !== 'map') return {ok: false, error: 'The run is not waiting for a node choice.'};
    if (!run.availableNodeIds.includes(nodeId)) return {ok: false, error: 'That node is not reachable from your position.'};
    const node = nodeById(run, nodeId);
    if (!node) return {ok: false, error: 'Unknown node.'};

    run.previousNodeId = run.currentNodeId;
    run.currentNodeId = nodeId;
    run.activeNodeId = nodeId;
    run.stats.nodes++;
    run.stats.nodesInAct++;
    const mods = modifiers(run);
    if (mods.creditsPerNode) addCredits(run, mods.creditsPerNode);

    logEvent(run, `Entered ${Content.NODE_TYPES[node.type].name}.`);
    syncRng(run);

    switch (node.type) {
      case 'trainer': return startEncounter(run, node, {kind: 'trainer'});
      case 'elite': return startEncounter(run, node, {kind: 'elite'});
      case 'wild': return startEncounter(run, node, {kind: 'wild'});
      case 'rare': return startRareEncounter(run, node);
      case 'boss': return startBoss(run, node);
      case 'shop': return openShop(run, node);
      case 'battleshop': return openBattleShop(run, node);
      case 'rest': return openRest(run, node);
      case 'event': return openEvent(run, node);
      case 'treasure': return openTreasure(run, node);
      case 'specialist': return openSpecialist(run, node);
      default: return {ok: false, error: `Unhandled node type ${node.type}.`};
    }
  }

  /**
   * Which marquee family a species belongs to, or null for an ordinary one.
   *
   * Legendary and mythical come from packaged flags; Ultra Beasts and Paradox
   * Pokémon have no flag and are listed by id in `content.js`; pseudo-legendaries
   * are derived from 600 BST plus a pre-evolution, which is what that term means.
   */
  function marqueeClass(species) {
    if (!species || species.missing) return null;
    if (species.mythical) return 'Mythical';
    if (species.legendary || species.powerClass === 'restricted') return 'Legendary';
    if (Content.RARE_ENCOUNTER.ultraBeasts.includes(species.id)) return 'Ultra Beast';
    if (Content.RARE_ENCOUNTER.paradox.includes(species.id)) return 'Paradox';
    if (species.bst >= 600 && species.prevo) return 'Pseudo-legendary';
    return null;
  }

  /**
   * A Rare Encounter: one exceptional Pokémon, fully trained.
   *
   * Two outcomes. `marqueeChance` of the time it is a legendary, mythical, Ultra
   * Beast, Paradox or pseudo-legendary; otherwise an ordinary species from the
   * run's own power band, but built properly — perfect IVs, a competitive
   * moveset, a held item, an ability, a nature and a Tera type — which already
   * makes it a harder fight than a Wild Encounter.
   *
   * **Beating it earns a one-in-three shot at it, tier gate or not.** This is the
   * one deliberate exception to §5's recruitment rule: the offer can be a
   * legendary or a mythical, which random recruitment refuses outright. The gate
   * is there to stop *offers* handing out an Arceus in Act 1; this is earned, not
   * offered — the node has to be found and the Pokémon beaten, at or above the
   * player's level, with a Beacon on the line — and even then it is a
   * `RARE_ENCOUNTER.recruitChance` roll, not a purchase. Appearance is separately
   * gated: legendary and mythical cannot show up in the first 35% of a run.
   */
  function startRareEncounter(run, node) {
    const rng = rngOf(run);
    const format = Formats.get('campaign');
    const marquee = rng.chance(Content.RARE_ENCOUNTER.marqueeChance);

    let species = null;
    if (marquee) {
      /*
       * Appearance is gated separately from recruitment, and much more loosely.
       *
       * Tying appearance to `recruitTierAvailable` was tried and is wrong twice
       * over: mythicals are tier `never`, so a Mew could not appear *at all*, and
       * legendaries only unlocked at 82% progress, which left the marquee roll
       * failing through to an ordinary species for most of a run (measured 18%
       * against a configured 30%). Facing something is not the same as keeping it.
       *
       * So: anything marquee may appear, with only the biggest two families held
       * back from the opening third of the run so a lone starter is not shown an
       * Arceus. Recruiting still obeys the strict tier gate below.
       */
      const at = runProgress(run);
      const pool = Formats.speciesPool(format).filter(s => {
        const cls = marqueeClass(s);
        if (!cls) return false;
        if ((cls === 'Legendary' || cls === 'Mythical') && at < 0.35) return false;
        return true;
      });
      species = rng.pick(pool);
    }
    if (!species) {
      // The floor: an ordinary species from the band, trained to the hilt.
      const pool = campaignPool(run, {kind: 'trainer'}).filter(s => !marqueeClass(s));
      species = rng.pick(pool.length ? pool : campaignPool(run, {kind: 'trainer'}));
    }
    if (!species) return startEncounter(run, node, {kind: 'wild'});   // pool failure: never dead-end a node

    /*
     * Never below the player's own level. `enemyLevel` applies the difficulty
     * offset *and* `rampOffset`, and the ramp runs nine levels deep through most
     * of Act 1 — which produced a "rare" Pokémon at level 10 against a level-16
     * party. The ramp exists to soften ordinary opening fights; this node is a
     * prize fight and reads as broken if it arrives underlevelled.
     */
    const level = Math.max(enemyLevel(run, 2), Math.min(100, run.teamLevel));
    /*
     * `randomSet` already delivers everything this node promises: a role-derived
     * competitive moveset, an ability, a held item, a nature, a Tera type, and
     * IVs from `maxIVs()`.
     *
     * IVs are deliberately *not* overridden to a flat 31. `pickIVs` drops Attack
     * to 0 on a purely special attacker, which is the competitively correct
     * spread — it cuts confusion damage and Foul Play — so forcing 31 there would
     * make the Pokémon measurably worse while claiming to make it perfect. Maxed
     * everywhere it matters is what "perfect IVs" means for a built set.
     */
    const set = RandomTeams.randomSet(species, rng, {format, level});

    const cls = marqueeClass(species);
    const config = buildBattleConfig(run, {
      kind: 'rare',
      background: node.background,
      opponent: {name: cls ? `Rare ${cls}` : 'Rare Pokémon', sprite: null},
      levelOffset: 2,
      sets: [set],
      title: `Rare Encounter: ${Dex.species(species).name}`,
      reward: {
        credits: Math.round(320 * (1 + (1 + runProgress(run) * 2) * 0.4)),
        rewardKind: 'rare',
        /*
         * Beating it earns it — including a legendary or a mythical, which the
         * ordinary tier gate would refuse outright. This is a deliberate
         * exception to §5's recruitment rule, not a hole in it: that gate exists
         * to stop *random offers* handing out an Arceus in Act 1, and a Rare
         * Encounter is neither random nor free. The player has to find the node,
         * and beat a fully-built Pokémon at or above their own level, with a
         * Beacon on the line if they lose.
         *
         * `recruitSet` carries the exact set that was fought, so the reward is
         * the Pokémon the player just beat rather than a freshly rolled one.
         */
        recruitOnWin: true,
        recruitSet: set,
      },
    });
    run.phase = 'battle';
    run.pending = {type: 'battle', config};
    run.promptStack = [run.pending];
    logEvent(run, `A rare ${Dex.species(species).name} appeared!`);
    syncRng(run);
    return {ok: true, phase: run.phase};
  }

  function startEncounter(run, node, {kind}) {
    const rng = rngOf(run);
    const archetype = pickTrainerArchetype(run, kind, null);
    const theme = kind === 'wild' ? null : archetype.theme;
    const config = buildBattleConfig(run, {
      kind,
      theme,
      background: node.background,
      opponent: kind === 'wild' ? {name: 'Wild Pokémon', sprite: null} : archetype,
      levelOffset: kind === 'elite' ? 1 : 0,
      reward: {
        credits: Math.round((kind === 'elite' ? 260 : kind === 'wild' ? 90 : 150) * (1 + (1 + runProgress(run) * 2) * 0.4) *
          (kind === 'elite' ? modifiers(run).hardEncounterCredits : 1)),
        rewardKind: kind,
        recruitOnWin: kind === 'wild',
      },
    });
    run.phase = 'battle';
    run.pending = {type: 'battle', config};
    run.promptStack = [run.pending];
    void rng;
    syncRng(run);
    return {ok: true, phase: 'battle', config};
  }

  function startBoss(run, node) {
    const rng = rngOf(run);
    const mods = modifiers(run);
    const finalAct = run.act === actCount(run);
    let boss;
    if (finalAct) {
      boss = Content.FINAL_BOSS;
    } else {
      // Bosses are authored for Acts 1-3. A longer run reuses the highest
      // authored tier for the extra Acts rather than running out of bosses.
      const tier = Math.min(run.act, 3);
      const forTier = Content.BOSSES.filter(b => b.act === tier);
      const unbeaten = forTier.filter(b => !run.defeatedBosses.includes(b.id));
      boss = rng.pick(unbeaten.length ? unbeaten : forTier);
    }
    const config = buildBattleConfig(run, {
      kind: 'boss',
      boss,
      background: boss.background || node.background,
      levelOffset: finalAct ? 2 : 0,
      title: boss.name,
      reward: {
        credits: Math.round((finalAct ? 900 : 450) * mods.hardEncounterCredits),
        rewardKind: 'boss',
        bossId: boss.id,
        final: finalAct,
      },
    });
    run.phase = 'battle';
    run.pending = {type: 'battle', config};
    run.promptStack = [run.pending];
    syncRng(run);
    return {ok: true, phase: 'battle', config};
  }

  /**
   * Apply the outcome of a battle the UI has finished playing.
   * @param {object} result `{won, survivors:[{uid, condition}], automated}`
   *   `automated` is true only when Assist Mode played the whole battle; see
   *   the `assistOnly` note below for why absent has to mean manual.
   */
  function resolveBattle(run, result) {
    if (run.phase !== 'battle' || run.pending?.type !== 'battle') {
      return {ok: false, error: 'No battle is in progress.'};
    }
    const config = run.pending.config;
    const mods = modifiers(run);

    // A single manually-played battle disqualifies the run from the
    // cleared-with-Assist unlocks. Absent means manual, so an older caller
    // cannot accidentally award them.
    if (result.automated !== true) run.stats.assistOnly = false;

    // Write back HP/status/PP for every Pokémon that fought.
    for (const survivor of result.survivors || []) {
      const member = partyMember(run, survivor.uid);
      if (!member) continue;
      member.condition = Object.assign({}, member.condition, survivor.condition);
    }

    if (!result.won) {
      // Losing a battle spends a Rescue Beacon: the party is airlifted out at
      // half health and the node stays uncleared, so the loss costs progress
      // and resources rather than instantly ending a twenty-battle run. With no
      // beacons left, the run is over.
      if (run.beacons > 0) {
        run.beacons--;
        run.stats.rescues++;
        healTeam(run, 1);
        restorePP(run, 1);
        run.promptStack = [];
        run.pending = null;
        run.currentNodeId = run.previousNodeId ?? null;
        run.phase = 'map';
        refreshAvailableNodes(run);
        logEvent(run, `Defeated by ${config.opponent.name}. A Rescue Beacon was used — ${run.beacons} remaining.`);
        syncRng(run);
        return {ok: true, phase: 'map', rescued: true, beacons: run.beacons,
          message: `${config.opponent.name} defeated your team. The team was airlifted out and fully treated — ${run.beacons} remaining.`};
      }
      return endRun(run, false, `Defeated by ${config.opponent.name} with no Rescue Beacons remaining.`);
    }

    run.stats.battlesWon++;
    if (config.kind === 'elite') run.stats.elitesBeaten++;
    run.clearedNodeIds.push(run.activeNodeId);
    logEvent(run, `Defeated ${config.opponent.name}.`);

    const reward = config.reward || {};
    if (reward.credits) addCredits(run, reward.credits);

    // Attrition: partial recovery after ordinary battles, full after bosses.
    const fullRecovery = config.kind === 'boss' || (config.kind === 'elite' && mods.eliteFullHeal);
    postBattleRecovery(run, {full: fullRecovery});
    run.usedSecondWind = false;

    run.promptStack = [];
    run.pending = null;
    run.phase = 'map';

    if (config.reward?.bossId) return completeBoss(run, config.reward);

    addLevels(run, config.kind === 'elite' ? 2 : 1);
    /*
     * Beating a Rare Encounter **always** offers the Pokémon that was fought
     * (project decision — see `RARE_ENCOUNTER` in content.js for what still
     * limits it). It used to roll a flat one-in-three, which made an expensive,
     * deliberately-routed-to fight give nothing two times out of three.
     *
     * `shouldOfferRecruit` stays bypassed for this node type. That is not an
     * oversight: it declines 55% of the time once the party is full, which would
     * put a refusal rate straight back in for the players most likely to have
     * earned the fight. A full party gets the release prompt and can decline.
     *
     * No RNG is drawn here any more. It never was for non-rare nodes, and the
     * draw for rare ones sat inside the ternary precisely so it could not shift
     * later rolls in a seeded run.
     */
    const wantsRecruit = reward.recruitOnWin &&
      (config.kind === 'rare' || shouldOfferRecruit(run));
    if (wantsRecruit) {
      const wildSpecies = config.enemyTeam[0]?.species;
      offerRecruit(run, {
        count: 1,
        species: reward.recruitSet ? null : wildSpecies,
        set: reward.recruitSet || null,
        reason: `${Dex.species(wildSpecies).name} is willing to join you`,
        allowDecline: true,
      });
    }
    offerReward(run, {
      title: config.kind === 'elite' ? 'Elite reward'
        : config.kind === 'rare' ? 'Rare Encounter reward'
        : 'Battle reward',
      kind: config.kind,
      // `reward.guaranteeItem` was removed with the recruit tier gate on Rare
      // Encounters: it only ever compensated for a refused recruit, and nothing
      // sets it now that the recruit is always offered.
      guarantee: config.kind === 'elite' ? 'item' : null,
    });
    if (!run.promptStack.length) finishNode(run);
    syncRng(run);
    return {ok: true, phase: run.phase};
  }

  function completeBoss(run, reward) {
    run.defeatedBosses.push(reward.bossId);
    run.stats.bossesBeaten++;
    const mods = modifiers(run);
    addLevels(run, 4 + mods.bossLevelBonus);

    if (reward.final) {
      return endRun(run, true, 'The final boss was defeated.');
    }

    grantRelic(run);
    offerReward(run, {title: 'Act cleared', kind: 'boss', guarantee: 'relic'});
    run.pendingActAdvance = true;
    syncRng(run);
    return {ok: true, phase: run.phase};
  }

  function advanceAct(run) {
    run.pendingActAdvance = false;
    run.act++;
    run.stats.nodesInAct = 0;
    run.currentNodeId = null;
    run.clearedNodeIds = [];
    const mods = modifiers(run);
    if (mods.actSupplies) {
      for (const [id, count] of Object.entries(mods.actSupplies)) addConsumable(run, id, count);
    }
    run.freeRerollUsedThisAct = false;
    if (mods.beaconsPerAct) run.beacons += mods.beaconsPerAct;
    // Base allowance, or whatever an Ascension forces it to, plus every stacked
    // reroll relic. A relic the player earned still pays out under an Ascension
    // that removes the base allowance — it is the only way to get rerolls at all
    // there, which is what makes it worth taking.
    const forced = mods.forcedRerolls;
    const baseRerolls = forced != null ? forced : Content.difficulty(run.difficulty).rerolls;
    run.rerolls = Math.max(0, baseRerolls + mods.bonusRerolls);
    healTeam(run, 1);
    restorePP(run, 1);
    logEvent(run, `Act ${run.act} begins.`);
    refreshAvailableNodes(run);
    run.phase = 'map';
  }

  function finishNode(run) {
    if (run.pendingActAdvance) {
      advanceAct(run);
      return;
    }
    run.promptStack = [];
    run.pending = null;
    if (run.activeNodeId && !run.clearedNodeIds.includes(run.activeNodeId)) {
      run.clearedNodeIds.push(run.activeNodeId);
      // Progression comes from clearing nodes, not from grinding encounters.
      addLevels(run, 1);
    }
    // Levelling can raise a "learn this move?" prompt, which must be answered
    // before the map reopens.
    if (run.promptStack.length) {
      run.phase = 'prompt';
      run.pending = run.promptStack[run.promptStack.length - 1];
      syncRng(run);
      return;
    }
    run.phase = 'map';
    refreshAvailableNodes(run);
    if (!run.availableNodeIds.length && run.phase === 'map') {
      // Only possible if the boss row was somehow skipped; route to the boss.
      const bossId = currentActMap(run).bossId;
      if (bossId && !run.clearedNodeIds.includes(bossId)) run.availableNodeIds = [bossId];
    }
    syncRng(run);
  }

  /* ------------------------- non-battle nodes ------------------------- */

  function openShop(run, node) {
    const stock = buildShopStock(run);
    pushPrompt(run, {type: 'shop', title: 'Supply Depot', stock, background: node.background});
    syncRng(run);
    return {ok: true, phase: run.phase};
  }

  /**
   * What a Rest Site's Forage option yields, by how far through the run it is.
   *
   * Deliberately *stored* items rather than instant healing — "Rest" already
   * heals, so these two options must not be the same choice twice (§5). Revives
   * are the part healing cannot replace.
   */
  const FORAGE_TIERS = [
    {at: 0.00, items: ['potion', 'potion']},
    {at: 0.30, items: ['superpotion', 'fullheal']},
    {at: 0.60, items: ['hyperpotion', 'revive']},
    {at: 0.85, items: ['fullrestore', 'maxrevive']},
  ];

  function forageTier(run) {
    const at = runProgress(run);
    let chosen = FORAGE_TIERS[0];
    for (const tier of FORAGE_TIERS) if (at >= tier.at) chosen = tier;
    return chosen.items;
  }

  function openRest(run, node) {
    const mods = modifiers(run);
    const options = [
      {id: 'heal', label: 'Rest', detail: mods.restHealPercent >= 1 ? 'Fully restore HP, status and PP.' : `Restore ${Math.round(mods.restHealPercent * 100)}% HP, all status and all PP.`},
      {id: 'train', label: 'Train', detail: 'Gain one team level instead of healing.'},
      // Replaced "Reorganise", which opened a held-item table that duplicated the
      // party menu — the player can move items there at any time, so spending a
      // whole node on it was never a real choice. Foraging banks supplies instead:
      // the option you take when the team is already healthy and you would rather
      // carry the healing into the next boss than take a team level.
      {id: 'forage', label: 'Forage', detail: `Gather supplies for the road: ${forageTier(run).map(id => Content.CONSUMABLES[id].name).join(' and ')}.`},
    ];
    if (mods.restTeachesMove) options.push({id: 'tutor', label: 'Study', detail: 'Teach one Pokémon any move it can legally learn.'});
    if (mods.freeItemEvolution) options.push({id: 'evolve', label: 'Resonate', detail: 'Evolve a Pokémon that evolves by item, for free.'});
    pushPrompt(run, {type: 'rest', title: 'Rest Site', options, background: node.background});
    return {ok: true, phase: run.phase};
  }

  function openEvent(run, node) {
    const rng = rngOf(run);
    const unseen = Content.EVENTS.filter(e => !run.seenEvents.includes(e.id));
    const pool = unseen.length ? unseen : Content.EVENTS;
    const event = rng.weighted(pool.map(e => [e, e.weight || 10]));
    run.seenEvents.push(event.id);
    pushPrompt(run, {
      type: 'event',
      eventId: event.id,
      title: event.title,
      text: event.text,
      sprite: event.sprite,
      background: event.background || node.background,
      choices: event.choices.map((choice, index) => ({
        index,
        label: choice.label,
        detail: choice.detail || '',
        enabled: choice.enabled ? !!choice.enabled(run) : true,
      })),
    });
    syncRng(run);
    return {ok: true, phase: run.phase};
  }

  function openTreasure(run, node) {
    const rng = rngOf(run);
    const mods = modifiers(run);
    const credits = Math.round((150 + rng.int(0, 120)) * (1 + (1 + runProgress(run) * 2) * 0.4));
    const itemId = randomHeldItem(run, {rarityBoost: 1});
    const options = [
      {kind: 'credits', amount: credits, label: `${credits} credits`, detail: 'Straight cash.'},
      {kind: 'held', id: itemId, label: Dex.item(itemId).name, detail: Dex.item(itemId).shortDesc},
      {kind: 'consumable', id: 'fullrestore', count: 2, label: 'Full Restore ×2', detail: Content.CONSUMABLES.fullrestore.description},
    ];
    if (mods.treasureBonusItem) {
      const bonus = randomHeldItem(run);
      addHeldItem(run, bonus);
      logEvent(run, `Deep Satchel found an extra ${Dex.item(bonus).name}.`);
    }
    pushPrompt(run, {type: 'reward', title: 'Treasure', options, kind: 'treasure', background: node.background});
    syncRng(run);
    return {ok: true, phase: run.phase};
  }

  function openSpecialist(run, node) {
    const options = [
      {id: 'tutor', label: 'Move Tutor', detail: 'Teach one Pokémon any move it can legally learn.'},
      {id: 'ability', label: 'Ability Analyst', detail: 'Switch one Pokémon to another of its legal abilities.'},
      {id: 'nature', label: 'Nature Coach', detail: 'Change one Pokémon\'s nature.'},
      {id: 'pokemart', label: 'Poké Mart', detail: 'Buy held items, Mega Stones your party can use, and Tera Shards.'},
    ];
    // Always offered: with a full party the recruit prompt asks which member to
    // release, so the Specialist stays useful all run rather than losing a
    // service the moment the sixth slot fills.
    options.push({id: 'recruit', label: 'Scout',
      detail: run.party.length < MAX_PARTY
        ? 'Recruit one Pokémon from three candidates.'
        : 'Recruit one Pokémon from three candidates, releasing one to make room.'});
    options.push({id: 'leave', label: 'Move on', detail: 'Leave without using a service.'});
    pushPrompt(run, {type: 'specialist', title: 'Specialist', options, background: node.background});
    return {ok: true, phase: run.phase};
  }

  /* ================================================================ *
   * Prompt resolution
   * ================================================================ */

  /** The API surface events use to touch the run safely. */
  function eventApi(run) {
    return {
      healTeam: fraction => healTeam(run, fraction),
      damageTeam: fraction => {
        for (const member of run.party) {
          const max = memberMaxHP(run, member);
          member.condition.currentHP = Math.max(1, Math.round(member.condition.currentHP - max * fraction));
        }
      },
      setTeamHpCeiling: fraction => {
        for (const member of run.party) {
          const max = memberMaxHP(run, member);
          member.condition.currentHP = Math.min(member.condition.currentHP, Math.round(max * fraction));
        }
      },
      addCredits: amount => addCredits(run, amount),
      spendCredits: amount => addCredits(run, -amount),
      addLevels: amount => addLevels(run, amount),
      addConsumable: (id, count) => addConsumable(run, id, count),
      grantRandomHeldItem: options => {
        const id = randomHeldItem(run, options || {});
        addHeldItem(run, id);
        return Dex.item(id).name;
      },
      grantRandomConsumable: count => {
        const rng = rngOf(run);
        const id = rng.pick(['superpotion', 'hyperpotion', 'fullrestore', 'revive', 'ether', 'fullheal']);
        addConsumable(run, id, count || 1);
        return `${Content.CONSUMABLES[id].name} ×${count || 1}`;
      },
      grantEvolutionItem: () => {
        const rng = rngOf(run);
        const id = rng.pick(Content.EVOLUTION_ITEMS.filter(x => Dex.item(x)));
        addEvolutionItem(run, id);
        return Dex.item(id).name;
      },
      grantRelic: () => {
        const relic = grantRelic(run);
        return relic ? relic.name : null;
      },
      offerRecruit: options => { offerRecruit(run, options); return options.reason || null; },
      openMoveTutor: () => { pushPrompt(run, {type: 'tutor', title: 'Choose a Pokémon to teach'}); return null; },
      openAbilitySwap: () => { pushPrompt(run, {type: 'ability', title: 'Choose a Pokémon to re-analyse'}); return null; },
      openNatureChange: () => { pushPrompt(run, {type: 'nature', title: 'Choose a Pokémon to retune'}); return null; },
      openItemSale: value => { pushPrompt(run, {type: 'sell', title: 'Choose an item to sell', value}); return null; },
      revealMap: () => { run.mapRevealed = true; return null; },
      queueBattle: spec => {
        const config = buildBattleConfig(run, {
          kind: spec.kind || 'trainer',
          theme: spec.theme || null,
          levelOffset: spec.levelOffset || 0,
          background: run.pending?.background,
          reward: Object.assign({rewardKind: spec.kind || 'trainer'}, spec.reward || {}),
        });
        run.queuedBattle = config;
        return null;
      },
    };
  }

  function resolvePrompt(run, action = {}) {
    const prompt = run.pending;
    if (!prompt) return {ok: false, error: 'There is no prompt to resolve.'};

    switch (prompt.type) {
      case 'reward': return resolveRewardPrompt(run, prompt, action);
      case 'tm': return resolveTmPrompt(run, prompt, action);
      case 'tutor': return resolveTutorPrompt(run, prompt, action);
      case 'movelearn': return resolveMoveLearnPrompt(run, prompt, action);
      case 'recruit': return resolveRecruitPrompt(run, prompt, action);
      case 'shop': return resolveShopPrompt(run, prompt, action);
      case 'rest': return resolveRestPrompt(run, prompt, action);
      case 'event': return resolveEventPrompt(run, prompt, action);
      case 'specialist': return resolveSpecialistPrompt(run, prompt, action);
      case 'ability': return resolveAbilityPrompt(run, prompt, action);
      case 'nature': return resolveNaturePrompt(run, prompt, action);
      case 'terashard': return resolveTeraShardPrompt(run, prompt, action);
      case 'sell': return resolveSellPrompt(run, prompt, action);
      case 'evolve': return resolveEvolvePrompt(run, prompt, action);
      case 'evolvechoice': return resolveEvolveChoicePrompt(run, prompt, action);
      case 'message': popPrompt(run); if (!run.promptStack.length) finishNode(run); return {ok: true};
      default: return {ok: false, error: `Unhandled prompt ${prompt.type}.`};
    }
  }

  function afterPrompt(run, message) {
    popPrompt(run);
    if (run.queuedBattle) {
      const config = run.queuedBattle;
      run.queuedBattle = null;
      run.promptStack = [];
      run.phase = 'battle';
      run.pending = {type: 'battle', config};
      return {ok: true, message, phase: 'battle'};
    }
    if (!run.promptStack.length) finishNode(run);
    syncRng(run);
    return {ok: true, message, phase: run.phase};
  }

  /**
   * A prompt whose resolution opens a follow-up prompt (TM choice, recruitment)
   * must be removed from underneath it, otherwise it would be served again once
   * the follow-up completes. Detected by stack depth, not by return value, so a
   * handler that fails to open anything can never loop.
   */
  function collapseInto(run, prompt, depthBefore, fallbackMessage) {
    if (run.promptStack.length > depthBefore) {
      const nested = run.promptStack.pop();
      const index = run.promptStack.lastIndexOf(prompt);
      if (index >= 0) run.promptStack.splice(index, 1);
      run.promptStack.push(nested);
      run.pending = nested;
      run.phase = 'prompt';
      syncRng(run);
      return {ok: true, phase: run.phase};
    }
    return afterPrompt(run, fallbackMessage);
  }

  function resolveRewardPrompt(run, prompt, action) {
    if (action.skip) return afterPrompt(run, 'Reward declined.');
    const option = prompt.options[action.index];
    if (!option) return {ok: false, error: 'Invalid reward choice.'};
    const depthBefore = run.promptStack.length;
    const message = applyRewardOption(run, option);
    return collapseInto(run, prompt, depthBefore, message || 'Reward taken.');
  }

  function resolveTmPrompt(run, prompt, action) {
    if (action.skip) return afterPrompt(run, 'No move was taught.');
    const entry = prompt.moves[action.moveIndex];
    const moveId = typeof entry === 'string' ? entry : entry?.id;
    const member = partyMember(run, action.memberUid);
    if (!moveId || !member) return {ok: false, error: 'Choose a move and a Pokémon.'};
    if (!Dex.canLearn(member.set.species, moveId)) {
      return {ok: false, error: `${PokemonLib.displayName(member.set)} cannot learn ${Dex.move(moveId).name}.`};
    }
    return teachMove(run, member, moveId, action.replaceIndex);
  }

  function resolveTutorPrompt(run, prompt, action) {
    if (action.skip) return afterPrompt(run, 'No move was taught.');
    const member = partyMember(run, action.memberUid);
    if (!member) return {ok: false, error: 'Choose a Pokémon.'};
    if (!action.moveId) {
      const legalMoves = Dex.legalMoveList(member.set.species).filter(id => !member.set.moves.includes(id));
      run.pending = Object.assign({}, prompt, {memberUid: member.uid, legalMoves});
      run.promptStack[run.promptStack.length - 1] = run.pending;
      return {ok: true, phase: run.phase};
    }
    if (!Dex.canLearn(member.set.species, action.moveId)) {
      return {ok: false, error: `${PokemonLib.displayName(member.set)} cannot learn ${Dex.move(action.moveId).name}.`};
    }
    return teachMove(run, member, action.moveId, action.replaceIndex);
  }

  function teachMove(run, member, moveId, replaceIndex) {
    if (member.set.moves.includes(moveId)) return {ok: false, error: 'It already knows that move.'};
    if (member.set.moves.length >= 4) {
      if (replaceIndex == null) {
        run.pending = {
          type: 'movelearn',
          title: `${PokemonLib.displayName(member.set)} wants to learn ${Dex.move(moveId).name}`,
          memberUid: member.uid,
          moveId,
          current: member.set.moves.slice(),
        };
        run.promptStack[run.promptStack.length - 1] = run.pending;
        return {ok: true, phase: run.phase};
      }
      const forgotten = member.set.moves[replaceIndex];
      member.set.moves[replaceIndex] = moveId;
      refreshMember(run, member);
      return afterPrompt(run, `${PokemonLib.displayName(member.set)} forgot ${Dex.move(forgotten).name} and learned ${Dex.move(moveId).name}.`);
    }
    member.set.moves.push(moveId);
    refreshMember(run, member);
    return afterPrompt(run, `${PokemonLib.displayName(member.set)} learned ${Dex.move(moveId).name}.`);
  }

  function resolveMoveLearnPrompt(run, prompt, action) {
    const member = partyMember(run, prompt.memberUid);
    if (!member) return afterPrompt(run, 'That Pokémon is no longer in the party.');
    if (action.skip) return afterPrompt(run, `${PokemonLib.displayName(member.set)} did not learn ${Dex.move(prompt.moveId).name}.`);
    const index = Number(action.replaceIndex);
    if (!Number.isInteger(index) || index < 0 || index >= member.set.moves.length) {
      return {ok: false, error: 'Choose which move to forget.'};
    }
    const forgotten = member.set.moves[index];
    member.set.moves[index] = prompt.moveId;
    refreshMember(run, member);
    return afterPrompt(run, `${PokemonLib.displayName(member.set)} forgot ${Dex.move(forgotten).name} and learned ${Dex.move(prompt.moveId).name}.`);
  }

  function resolveRecruitPrompt(run, prompt, action) {
    if (action.theme) {
      if (!prompt.themes?.length) return {ok: false, error: 'This offer cannot be themed.'};
      if (prompt.themeUsed) return {ok: false, error: 'You have already chosen a theme for this offer.'};
      if (!prompt.themes.includes(action.theme)) return {ok: false, error: 'Unknown theme.'};
      const options = recruitCandidates(run, {count: prompt.options.length, quality: prompt.quality, plan: action.theme});
      if (!options.length) return {ok: false, error: 'Nothing matching was available.'};
      run.pending = Object.assign({}, prompt, {options, plan: action.theme, themeUsed: true});
      run.promptStack[run.promptStack.length - 1] = run.pending;
      syncRng(run);
      return {ok: true, phase: run.phase};
    }
    if (action.reroll) {
      if (run.rerolls <= 0) return {ok: false, error: 'No rerolls remaining.'};
      const mods = modifiers(run);
      const free = mods.freeRerollPerAct > 0 && !run.freeRerollUsedThisAct;
      if (free) run.freeRerollUsedThisAct = true;
      else run.rerolls--;
      // `prompt.plan` is kept: a reroll after choosing a theme must stay on that
      // theme, or the choice is silently thrown away by the next button press.
      const options = recruitCandidates(run, {count: prompt.options.length, quality: prompt.quality, plan: prompt.plan || null});
      run.pending = Object.assign({}, prompt, {options, rerollsLeft: run.rerolls});
      run.promptStack[run.promptStack.length - 1] = run.pending;
      syncRng(run);
      return {ok: true, phase: run.phase};
    }
    if (action.skip) return afterPrompt(run, 'You continue alone.');
    const set = prompt.options[action.index];
    if (!set) return {ok: false, error: 'Invalid recruit choice.'};
    /* Set only when a party slot had to be freed, so its message can be folded
     * into the join message — the player needs to see the held item come back. */
    let released = null;
    if (run.party.length >= MAX_PARTY) {
      if (action.releaseUid == null) {
        run.pending = Object.assign({}, prompt, {needsRelease: true, chosenIndex: action.index});
        run.promptStack[run.promptStack.length - 1] = run.pending;
        return {ok: true, phase: run.phase};
      }
      if (!run.party.some(m => m.uid === action.releaseUid)) {
        return {ok: false, error: 'Choose a Pokémon to release.'};
      }
      /*
       * Route through `releaseMember` rather than splicing the party here.
       *
       * This used to release inline, and every effect `releaseMember` performs
       * had to be remembered and repeated — which is how it ended up doing only
       * *some* of them. It pruned the released Pokémon's queued prompts (added
       * after one outlived its owner and blanked the run screen) but silently
       * dropped two others: **the held item was never returned to the bag**, so
       * swapping out a Pokémon holding a Choice Scarf destroyed the Scarf, and
       * the Full House `releaseRefund` never paid out on this route either.
       *
       * Reported from real play. The fix is not to add the two missing calls —
       * it is to stop having a second copy of the list, so the next thing added
       * to `releaseMember` cannot go missing here too.
       */
      released = releaseMember(run, action.releaseUid);
      if (!released.ok) return released;
    }
    const member = addPartyMember(run, set);
    logEvent(run, `${PokemonLib.displayName(member.set)} joined the party!`);
    return afterPrompt(run, `${PokemonLib.displayName(member.set)} joined the party.` +
      (released && released.message ? ` ${released.message}` : ''));
  }

  function resolveShopPrompt(run, prompt, action) {
    if (action.leave) return afterPrompt(run, prompt.onePurchase ? 'You leave the Battle Shop.' : 'You leave the depot.');
    const entry = prompt.stock[action.index];
    if (!entry) return {ok: false, error: 'That item is not in stock.'};
    if (entry.sold) return {ok: false, error: 'That item has already been bought.'};
    if (run.credits < entry.price) return {ok: false, error: `Not enough credits (need ${entry.price}, have ${run.credits}).`};

    addCredits(run, -entry.price);
    entry.sold = true;
    run.stats.purchases++;

    switch (entry.kind) {
      case 'consumable': addConsumable(run, entry.id); break;
      case 'held': addHeldItem(run, entry.id); break;
      case 'evolution': addEvolutionItem(run, entry.id); break;
      case 'relic': grantRelic(run, entry.id); break;
      case 'heal': healTeam(run, 1); restorePP(run, 1); break;
      case 'beacon': run.beacons++; break;
      case 'tutor': pushPrompt(run, {type: 'tutor', title: 'Choose a Pokémon to teach'}); return {ok: true, phase: run.phase};
      case 'terashard':
        pushPrompt(run, {
          type: 'terashard', title: `Use the ${entry.teraType} Tera Shard`,
          teraType: entry.teraType,
        });
        return {ok: true, phase: run.phase};
      case 'recruit': offerRecruit(run, {count: modifiers(run).recruitOptions, quality: 'good', reason: 'Contracted recruits'}); return {ok: true, phase: run.phase};
      default: break;
    }
    syncRng(run);
    /*
     * The Battle Shop sells exactly one thing. Ending the node on the purchase
     * rather than leaving the shelf open with everything unaffordable is the
     * difference between "you chose" and "you were shown what you missed".
     */
    if (prompt.onePurchase) return afterPrompt(run, `Bought ${entry.name}. The dealer packs up.`);
    return {ok: true, message: `Bought ${entry.name}.`, phase: run.phase};
  }

  function resolveRestPrompt(run, prompt, action) {
    const mods = modifiers(run);
    switch (action.id) {
      case 'heal':
        if (mods.restHealPercent >= 1) { healTeam(run, 1); restorePP(run, 1); }
        else { healTeam(run, mods.restHealPercent); restorePP(run, 1); for (const m of run.party) m.condition.status = null; }
        return afterPrompt(run, 'The team rests and recovers.');
      case 'train':
        addLevels(run, 1);
        return afterPrompt(run, `Training complete. The team is level ${run.teamLevel}.`);
      case 'forage': {
        const items = forageTier(run);
        for (const id of items) addConsumable(run, id, 1);
        const names = items.map(id => Content.CONSUMABLES[id].name);
        return afterPrompt(run, `Foraged ${names.join(' and ')}.`);
      }
      case 'tutor':
        replacePrompt(run, {type: 'tutor', title: 'Choose a Pokémon to teach'});
        return {ok: true, phase: run.phase};
      case 'evolve':
        replacePrompt(run, {type: 'evolve', title: 'Choose a Pokémon to evolve', free: true});
        return {ok: true, phase: run.phase};
      default:
        return {ok: false, error: 'Unknown rest action.'};
    }
  }

  function resolveSpecialistPrompt(run, prompt, action) {
    switch (action.id) {
      case 'tutor': replacePrompt(run, {type: 'tutor', title: 'Choose a Pokémon to teach'}); return {ok: true, phase: run.phase};
      case 'ability': replacePrompt(run, {type: 'ability', title: 'Choose a Pokémon to re-analyse'}); return {ok: true, phase: run.phase};
      case 'nature': replacePrompt(run, {type: 'nature', title: 'Choose a Pokémon to retune'}); return {ok: true, phase: run.phase};
      case 'pokemart':
        replacePrompt(run, {type: 'shop', title: 'Poké Mart', stock: buildMartStock(run), mart: true});
        return {ok: true, phase: run.phase};
      case 'recruit': {
        const options = recruitCandidates(run, {count: modifiers(run).recruitOptions, quality: 'good'});
        replacePrompt(run, {type: 'recruit', title: 'Scouted candidates', options, rerollsLeft: run.rerolls, allowDecline: true, quality: 'good'});
        return {ok: true, phase: run.phase};
      }
      case 'leave': return afterPrompt(run, 'You move on.');
      default: return {ok: false, error: 'Unknown specialist action.'};
    }
  }

  function resolveEventPrompt(run, prompt, action) {
    const event = Content.event(prompt.eventId);
    const choice = event?.choices[action.index];
    if (!choice) return {ok: false, error: 'Invalid event choice.'};
    if (choice.enabled && !choice.enabled(run)) return {ok: false, error: 'That option is not available.'};
    const depthBefore = run.promptStack.length;
    const message = choice.apply(run, eventApi(run));
    logEvent(run, `${event.title}: ${choice.label}`);
    if (run.promptStack.length > depthBefore) return collapseInto(run, prompt, depthBefore, message);
    if (run.queuedBattle) return afterPrompt(run, message);
    replacePrompt(run, {type: 'message', title: event.title, text: message || 'Nothing happened.', background: prompt.background, sprite: prompt.sprite});
    syncRng(run);
    return {ok: true, phase: run.phase, message};
  }

  function resolveAbilityPrompt(run, prompt, action) {
    if (action.skip) return afterPrompt(run, 'Nothing changed.');
    const member = partyMember(run, action.memberUid);
    if (!member) return {ok: false, error: 'Choose a Pokémon.'};
    if (!action.ability) {
      run.pending = Object.assign({}, prompt, {memberUid: member.uid, abilities: Dex.abilityList(member.set.species)});
      run.promptStack[run.promptStack.length - 1] = run.pending;
      return {ok: true, phase: run.phase};
    }
    if (!Dex.hasAbility(member.set.species, action.ability)) return {ok: false, error: 'That is not a legal ability for this Pokémon.'};
    member.set.ability = Dex.ability(action.ability).name;
    return afterPrompt(run, `${PokemonLib.displayName(member.set)} now has ${member.set.ability}.`);
  }

  function resolveNaturePrompt(run, prompt, action) {
    if (action.skip) return afterPrompt(run, 'Nothing changed.');
    const member = partyMember(run, action.memberUid);
    if (!member) return {ok: false, error: 'Choose a Pokémon.'};
    if (!action.nature) {
      run.pending = Object.assign({}, prompt, {memberUid: member.uid, natures: Object.keys(Dex.allNatures)});
      run.promptStack[run.promptStack.length - 1] = run.pending;
      return {ok: true, phase: run.phase};
    }
    const nature = Dex.nature(action.nature);
    member.set.nature = nature.id;
    refreshMember(run, member);
    return afterPrompt(run, `${PokemonLib.displayName(member.set)} is now ${nature.name}.`);
  }

  /** A bought Tera Shard retypes one party member's Terastallization. */
  function resolveTeraShardPrompt(run, prompt, action) {
    if (action.skip) return afterPrompt(run, 'The shard goes unused.');
    const member = partyMember(run, action.memberUid);
    if (!member) return {ok: false, error: 'Choose a Pokémon.'};
    const type = prompt.teraType;
    if (!Dex.TYPES.includes(type)) return {ok: false, error: 'That is not a valid Tera Type.'};
    member.set.teraType = type;
    refreshMember(run, member);
    logEvent(run, `${PokemonLib.displayName(member.set)}'s Tera Type became ${type}.`);
    return afterPrompt(run, `${PokemonLib.displayName(member.set)} is now Tera ${type}.`);
  }

  function resolveSellPrompt(run, prompt, action) {
    if (action.skip) return afterPrompt(run, 'Nothing was sold.');
    const id = action.itemId;
    if (!run.bag.held[id]) return {ok: false, error: 'You do not have that item.'};
    run.bag.held[id]--;
    if (run.bag.held[id] <= 0) delete run.bag.held[id];
    addCredits(run, prompt.value || 150);
    return afterPrompt(run, `Sold ${Dex.item(id).name} for ${prompt.value || 150} credits.`);
  }

  function resolveEvolvePrompt(run, prompt, action) {
    if (action.skip) return afterPrompt(run, 'Nothing changed.');
    const member = partyMember(run, action.memberUid);
    if (!member) return {ok: false, error: 'Choose a Pokémon.'};
    const rules = Dex.evolutions(member.set.species)
      .filter(r => r.method === 'item' && (prompt.free || run.bag.evolution[Dex.item(r.item)?.id]));
    if (!rules.length) return {ok: false, error: 'That Pokémon cannot evolve here.'};
    /*
     * More than one usable stone is a branch too, and this used to take the first
     * rule in data order — so an Eevee at a free-evolution service became whichever
     * of its five stone forms happened to be listed first, with no say in it. Ask.
     */
    if (rules.length > 1) {
      const targets = [...new Set(rules.map(r => r.target))];
      if (targets.length > 1) {
        // `replacePrompt`, not `pushPrompt`: this *is* the evolve prompt's next
        // stage, so it must not leave the member picker underneath it.
        const species = targets.map(id => Dex.species(id));
        replacePrompt(run, {
          type: 'evolvechoice',
          title: `${PokemonLib.displayName(member.set)} is evolving!`,
          memberUid: member.uid,
          // Which stone each target costs, so the resolver spends the right one.
          itemFor: Object.fromEntries(rules.map(r => [Dex.species(r.target).id, Dex.item(r.item)?.id || null])),
          free: !!prompt.free,
          options: species.map(s => ({target: s.id, name: s.name, types: s.types, bst: s.bst})),
        });
        return {ok: true, phase: run.phase};
      }
    }
    const rule = rules[0];
    if (!prompt.free) {
      const itemId = Dex.item(rule.item).id;
      run.bag.evolution[itemId]--;
      if (run.bag.evolution[itemId] <= 0) delete run.bag.evolution[itemId];
    }
    evolveMember(run, member, rule.target);
    return afterPrompt(run, `${PokemonLib.displayName(member.set)} evolved!`);
  }

  function resolveEvolveChoicePrompt(run, prompt, action) {
    const member = partyMember(run, prompt.memberUid);
    if (!member) return afterPrompt(run, 'That Pokémon is no longer in the party.');
    if (action.skip) {
      return afterPrompt(run, `${PokemonLib.displayName(member.set)} did not evolve.`);
    }
    const option = prompt.options[Number(action.index)];
    if (!option) return {ok: false, error: 'Choose which form to evolve into.'};
    // Item-triggered branch: spend the stone that this particular target needs.
    if (prompt.itemFor && !prompt.free) {
      const itemId = prompt.itemFor[option.target];
      if (itemId) {
        if (!run.bag.evolution[itemId]) return {ok: false, error: 'That evolution item is no longer in the bag.'};
        run.bag.evolution[itemId]--;
        if (run.bag.evolution[itemId] <= 0) delete run.bag.evolution[itemId];
      }
    }
    evolveMember(run, member, option.target);
    // Carry any unambiguous next step of the chain through immediately. A second
    // *branch* deliberately waits for the next level-up rather than stacking
    // another prompt on top of this one mid-resolution.
    autoEvolve(run, member);
    return afterPrompt(run, `${PokemonLib.displayName(member.set)} evolved into ${option.name}!`);
  }

  /* ================================================================ *
   * Direct player actions (bag, items, party) — available on the map
   * ================================================================ */

  function equipHeldItem(run, memberUid, itemId) {
    const member = partyMember(run, memberUid);
    if (!member) return {ok: false, error: 'Unknown party member.'};
    if (itemId && !run.bag.held[itemId]) return {ok: false, error: 'That item is not in the bag.'};
    const previous = member.set.item;
    if (itemId) {
      run.bag.held[itemId]--;
      if (run.bag.held[itemId] <= 0) delete run.bag.held[itemId];
    }
    member.set.item = itemId || null;
    if (previous) run.bag.held[previous] = (run.bag.held[previous] || 0) + 1;
    return {ok: true, message: itemId ? `${PokemonLib.displayName(member.set)} is holding ${Dex.item(itemId).name}.` : 'Held item removed.'};
  }

  function useConsumable(run, itemId, memberUid) {
    const item = Content.CONSUMABLES[itemId];
    if (!item || !run.bag.consumables[itemId]) return {ok: false, error: 'You do not have that item.'};
    const member = memberUid ? partyMember(run, memberUid) : null;
    if (item.effect !== 'teamheal' && !member) return {ok: false, error: 'Choose a Pokémon.'};

    let applied = false;
    switch (item.effect) {
      case 'heal': {
        const max = memberMaxHP(run, member);
        if (member.condition.currentHP <= 0 || member.condition.currentHP >= max) return {ok: false, error: 'It would have no effect.'};
        member.condition.currentHP = Math.min(max, member.condition.currentHP + item.amount);
        applied = true;
        break;
      }
      case 'fullheal': {
        if (member.condition.currentHP <= 0) return {ok: false, error: 'Revive it first.'};
        fullHealMember(run, member);
        applied = true;
        break;
      }
      case 'status': {
        if (!member.condition.status) return {ok: false, error: 'It has no status condition.'};
        member.condition.status = null;
        applied = true;
        break;
      }
      case 'revive': {
        if (member.condition.currentHP > 0) return {ok: false, error: 'It has not fainted.'};
        const max = memberMaxHP(run, member);
        member.condition.currentHP = Math.max(1, Math.round(max * item.amount));
        member.condition.status = null;
        applied = true;
        break;
      }
      case 'pp': {
        const full = PokemonLib.fullyHealCondition(memberSet(run, member));
        let changed = false;
        for (const [moveId, max] of Object.entries(full.pp)) {
          const before = member.condition.pp[moveId] ?? max;
          const after = Math.min(max, before + item.amount);
          if (after !== before) changed = true;
          member.condition.pp[moveId] = after;
        }
        if (!changed) return {ok: false, error: 'PP is already full.'};
        applied = true;
        break;
      }
      case 'teamheal':
        healTeam(run, item.amount);
        applied = true;
        break;
      default: break;
    }
    if (!applied) return {ok: false, error: 'It would have no effect.'};
    run.bag.consumables[itemId]--;
    if (run.bag.consumables[itemId] <= 0) delete run.bag.consumables[itemId];
    return {ok: true, message: `Used ${item.name}.`};
  }

  /**
   * Spend HP items until every injured party member is back to full.
   *
   * Managing this by hand meant opening the bag, picking an item, picking a
   * target, and repeating — six or seven times after a bad fight, for a decision
   * that is almost never interesting. This does the arithmetic instead.
   *
   * Three rules, each chosen so the button cannot spend something the player
   * would have wanted to keep:
   *
   * 1. **HP items only.** Revives are not touched. A fainted Pokémon is the
   *    scarcest thing to fix (a Revive is 400 credits, a Max Revive 800) and
   *    quietly burning one to a button press is exactly the kind of decision a
   *    player should make deliberately. They are counted and reported instead.
   * 2. **Cheapest healing wins**, measured as price per HP the item actually
   *    delivers — `price / min(amount, deficit)`. "Smallest item that covers the
   *    gap" is the obvious rule and it is wrong: a 62 HP dent is covered by one
   *    Hyper Potion (320 credits) but better served by two Potions (180), while a
   *    500 HP hole is the other way round. Pricing the *used* portion picks small
   *    items for dents and big ones for craters without special-casing either.
   * 3. **Full Restore is a last resort**, used only when the finite potions
   *    cannot finish that Pokémon. It is the most valuable HP item and also cures
   *    status and PP, so spending it as an ordinary heal throws two thirds of it
   *    away.
   *
   * Returns `{ok, message, used, healed, fainted, short}` — `used` is a map of
   * item id to count so the caller can say what it spent, and `short` is true
   * when the bag ran out before everyone was full.
   */
  /** Every HP-restoring consumable, cheapest healing first. Revives excluded. */
  const hpItems = () => Object.values(Content.CONSUMABLES)
    .filter(item => item.effect === 'heal' && item.amount > 0)
    .sort((a, b) => a.amount - b.amount);

  /**
   * Would `healAll` do anything? Drives whether the button is offered at all,
   * so it never sits there producing nothing but an error toast.
   */
  function canHealAll(run) {
    if (!run || !run.party) return false;
    const injured = run.party.some(m => m.condition.currentHP > 0 && m.condition.currentHP < memberMaxHP(run, m));
    if (!injured) return false;
    return [...hpItems().map(i => i.id), 'fullrestore'].some(id => (run.bag.consumables[id] || 0) > 0);
  }

  function healAll(run) {
    const injured = run.party
      .filter(m => m.condition.currentHP > 0 && m.condition.currentHP < memberMaxHP(run, m))
      .sort((a, b) => (memberMaxHP(run, b) - b.condition.currentHP) - (memberMaxHP(run, a) - a.condition.currentHP));
    const fainted = run.party.filter(m => m.condition.currentHP <= 0).length;

    if (!injured.length) {
      return {ok: false, error: fainted ? 'Nobody is injured — revive the fainted ones individually.' : 'Everyone is already at full HP.'};
    }

    /* Finite HP potions. Full Restore is handled separately, as a last resort. */
    const potions = hpItems();
    const stock = id => run.bag.consumables[id] || 0;
    const used = {};
    const spend = id => {
      run.bag.consumables[id]--;
      if (run.bag.consumables[id] <= 0) delete run.bag.consumables[id];
      used[id] = (used[id] || 0) + 1;
    };

    let healed = 0;
    let short = false;
    for (const member of injured) {
      const max = memberMaxHP(run, member);
      let guard = 0;
      while (member.condition.currentHP < max && guard++ < 60) {
        const deficit = max - member.condition.currentHP;
        let pick = null;
        let bestRate = Infinity;
        for (const item of potions) {
          if (stock(item.id) <= 0) continue;
          const rate = item.price / Math.min(item.amount, deficit);
          if (rate < bestRate) { bestRate = rate; pick = item; }
        }
        if (!pick) break;
        spend(pick.id);
        member.condition.currentHP = Math.min(max, member.condition.currentHP + pick.amount);
      }
      if (member.condition.currentHP < max && stock('fullrestore') > 0) {
        spend('fullrestore');
        fullHealMember(run, member);
      }
      if (member.condition.currentHP >= max) healed++;
      else short = true;
    }

    if (!Object.keys(used).length) {
      return {ok: false, error: 'No healing items in the bag.'};
    }
    const spent = Object.entries(used)
      .map(([id, n]) => `${Content.CONSUMABLES[id].name}${n > 1 ? ` ×${n}` : ''}`).join(', ');
    let message = `Healed ${healed} Pokémon (${spent}).`;
    if (short) message += ' Ran out of items before everyone was full.';
    if (fainted) message += ` ${fainted} still fainted — use a Revive.`;
    return {ok: true, message, used, healed, fainted, short};
  }

  function useEvolutionItem(run, itemId, memberUid) {
    const member = partyMember(run, memberUid);
    if (!member) return {ok: false, error: 'Unknown party member.'};
    if (!run.bag.evolution[itemId]) return {ok: false, error: 'You do not have that item.'};
    const rule = Dex.evolutions(member.set.species).find(r => r.method === 'item' && Dex.item(r.item)?.id === Dex.toID(itemId));
    if (!rule) return {ok: false, error: `${PokemonLib.displayName(member.set)} does not respond to that item.`};
    run.bag.evolution[itemId]--;
    if (run.bag.evolution[itemId] <= 0) delete run.bag.evolution[itemId];
    evolveMember(run, member, rule.target);
    return {ok: true, message: `${PokemonLib.displayName(member.set)} evolved!`};
  }

  function reorderParty(run, uids) {
    const map = new Map(run.party.map(m => [m.uid, m]));
    const next = uids.map(uid => map.get(uid)).filter(Boolean);
    for (const member of run.party) if (!next.includes(member)) next.push(member);
    run.party = next;
    return {ok: true};
  }

  /**
   * Release a party member. Available at any point in a run — the only rule is
   * that the run cannot be left with an empty party, so the last Pokémon can
   * never be released. Any held item goes back to the bag rather than being
   * destroyed with it.
   */
  /**
   * Drop any queued prompt that points at a Pokémon which is no longer here.
   *
   * Prompts are a stack, and several of them carry a `memberUid` — a move to
   * learn, a tutor, an ability swap, a nature change. Releasing the Pokémon
   * they refer to used to leave the prompt behind holding a dead uid, and the
   * renderer dereferenced the missing member and blanked the screen. That was
   * nearly unreachable while a full party simply was not offered recruits; it
   * became routine the moment it was (see `shouldOfferRecruit`).
   *
   * Also used on load, so a run already stuck on a dangling prompt heals itself.
   */
  function pruneDanglingPrompts(run) {
    const alive = new Set((run.party || []).map(m => m.uid));
    const keep = prompt => !prompt || prompt.memberUid == null || alive.has(prompt.memberUid);
    const before = (run.promptStack || []).length;
    run.promptStack = (run.promptStack || []).filter(keep);
    run.pending = run.promptStack.length ? run.promptStack[run.promptStack.length - 1] : null;
    // A TM offer lists its eligible members; drop any that have left, and drop
    // the whole prompt when nobody is left to teach.
    for (const prompt of run.promptStack) {
      if (prompt.type !== 'tm' || !Array.isArray(prompt.moves)) continue;
      prompt.moves = prompt.moves.map(entry => (Array.isArray(entry.eligible)
        ? Object.assign({}, entry, {eligible: entry.eligible.filter(id => alive.has(id))})
        : entry));
    }
    run.promptStack = run.promptStack.filter(prompt =>
      prompt.type !== 'tm' || !Array.isArray(prompt.moves) || prompt.moves.some(m => !Array.isArray(m.eligible) || m.eligible.length));
    run.pending = run.promptStack.length ? run.promptStack[run.promptStack.length - 1] : null;
    return before - run.promptStack.length;
  }

  function releaseMember(run, uid) {
    const member = partyMember(run, uid);
    if (!member) return {ok: false, error: 'That Pokémon is not in your party.'};
    if (run.party.length <= 1) {
      return {ok: false, error: 'You cannot release your last Pokémon.'};
    }
    if (member.set.item) addHeldItem(run, member.set.item);
    const name = PokemonLib.displayName(member.set);
    run.party = run.party.filter(m => m.uid !== uid);
    // Full House pays out for releasing. Applied here rather than at the call
    // sites so every route — the party menu, a full-party recruit swap — pays.
    const refund = modifiers(run).releaseRefund || 0;
    if (refund > 0) addCredits(run, refund);
    pruneDanglingPrompts(run);
    logEvent(run, `${name} was released.`);
    return {
      ok: true,
      message: `${name} was released.` +
        (member.set.item ? ` Its ${Dex.item(member.set.item).name} went back to the bag.` : '') +
        (refund > 0 ? ` You were refunded ${refund} credits.` : ''),
    };
  }

  /* ================================================================ *
   * Run lifecycle
   * ================================================================ */

  function createRun({seed, difficulty = 'normal', ascension = 0, trainerName = 'Trainer', unlocks = {},
    beacons = null, acts = null} = {}) {
    const parsed = RNG.parse(seed);
    const seedValue = parsed.valid ? parsed.value : RNG.random();
    const rng = new RNG(seedValue);
    const difficultyData = Content.difficulty(difficulty);
    // Player-chosen run shape. Both raise the challenge (see challengeLevel).
    const setup = {
      beacons: clamp(Math.round(beacons ?? difficultyData.beacons ?? 2), BEACONS_RANGE.min, BEACONS_RANGE.max),
      acts: clamp(Math.round(acts ?? DEFAULT_ACTS), ACTS_RANGE.min, ACTS_RANGE.max),
    };

    const run = {
      version: RUN_VERSION,
      id: `run-${Date.now().toString(36)}`,
      seed: seedValue,
      seedLabel: RNG.format(seedValue),
      difficulty: difficultyData.id,
      ascension: clamp(ascension, 0, Content.ASCENSIONS.length),
      trainerName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phase: 'draft',
      act: 1,
      teamLevel: STARTING_LEVEL,
      party: [],
      bag: {consumables: {potion: 2}, held: {}, evolution: {}},
      relics: [],
      credits: difficultyData.startingCredits,
      rerolls: difficultyData.rerolls,
      setup,
      beacons: setup.beacons,
      freeRerollUsedThisAct: false,
      map: null,
      currentNodeId: null,
      activeNodeId: null,
      clearedNodeIds: [],
      availableNodeIds: [],
      defeatedBosses: [],
      seenEvents: [],
      mapRevealed: false,
      usedSecondWind: false,
      pendingActAdvance: false,
      queuedBattle: null,
      promptStack: [],
      pending: null,
      // Assist Mode. Two independent switches, both off by default and
      // toggleable at any point in the run; neither touches run RNG or rules,
      // so turning them on mid-run cannot desynchronise anything.
      assist: {recommend: false, autoBattle: false},
      log: [],
      stats: {
        nodes: 0, nodesInAct: 0, battlesWon: 0, elitesBeaten: 0, bossesBeaten: 0,
        recruits: 0, evolutions: 0, purchases: 0, creditsEarned: 0, rescues: 0, speciesUsed: {},
        // Stays true only while every battle is fought entirely by Assist Mode.
        assistOnly: true,
      },
      unlocks,
      rngState: null,
    };

    const mods = modifiers(run);
    run.map = CampaignMap.generateRunMap(rng, {extraRows: mods.extraRows, eliteWeight: mods.eliteWeight, acts: setup.acts});
    run._rng = rng;
    syncRng(run);

    run.pending = {
      type: 'draft',
      title: 'Choose your first partner',
      options: draftCandidates(run, unlocks),
      rerollsLeft: run.rerolls,
    };
    run.promptStack = [run.pending];
    syncRng(run);
    return run;
  }

  /** Can this run be reborn? Cleared runs only, and only once each. */
  function canRebirth(run) {
    return !!run && run.phase === 'victory' && !run.rebirthUsed && (run.party || []).length > 0;
  }

  /**
   * Start a new run *inside* a cleared one: Rebirth Mode.
   *
   * The party and the relics come with you. The team level, Act, map, credits,
   * Beacons and bag all reset, and every opponent from the first node on is a
   * complete themed six played at Expert (see `buildBattleConfig`).
   *
   * It **wraps** `createRun` rather than forking it, because the reset is the
   * long list and the carry-over is the short one: `teamLevel` already starts at
   * `STARTING_LEVEL`, and `bag`, `credits`, `beacons`, `rerolls` and `map` are
   * already fresh. Only three things are written back over the new run.
   *
   * @param {object} finishedRun the cleared run this is a rebirth of
   * @param {object} [options] `{seed, trainerName, unlocks}`
   * @returns {?object} the new run, or null if `finishedRun` cannot be reborn
   */
  function createRebirthRun(finishedRun, {seed = null, trainerName = null, unlocks = null} = {}) {
    if (!canRebirth(finishedRun)) return null;
    const run = createRun({
      seed,
      difficulty: finishedRun.difficulty,
      ascension: finishedRun.ascension,
      trainerName: trainerName || finishedRun.trainerName,
      unlocks: unlocks || finishedRun.unlocks || {},
      // The run *shape* carries over too: rebirthing a long run should not
      // silently shorten it, and the challenge scaling those choices buy is
      // part of what the player cleared.
      beacons: finishedRun.setup?.beacons,
      acts: finishedRun.setup?.acts,
    });

    run.rebirth = rebirthDepth(finishedRun) + 1;
    run.rebirthFrom = {
      id: finishedRun.id,
      seedLabel: finishedRun.seedLabel,
      nodes: finishedRun.stats?.nodes || 0,
      bosses: [...(finishedRun.defeatedBosses || [])],
    };

    /*
     * The party, re-levelled and fully healed.
     *
     * Built directly rather than through `addPartyMember`, which increments
     * `stats.recruits` — and that counter feeds the lifetime `totalRecruited`
     * unlock track, so routing six carried-over Pokémon through it would award
     * six recruits nobody recruited. `speciesUsed` is still recorded, because
     * they really are the species this run is played with.
     */
    run.party = (finishedRun.party || []).slice(0, MAX_PARTY).map(member => {
      const set = stripEVs(PokemonLib.normalizeSet(Object.assign({}, member.set, {level: STARTING_LEVEL})));
      run.stats.speciesUsed[set.species] = (run.stats.speciesUsed[set.species] || 0) + 1;
      return {
        uid: member.uid,
        set,
        condition: PokemonLib.fullyHealCondition(set),
        joinedAtNode: 0,
      };
    });
    run.relics = [...(finishedRun.relics || [])];
    /*
     * A stackable reroll relic applies its bonus at `grantRelic` time as well as
     * per Act. Copying `relics` wholesale skips that call, so the allowance is
     * topped up here — otherwise Scout's Tally would go quiet for the whole of
     * Act 1 of every rebirth.
     */
    run.rerolls += modifiers(run).bonusRerolls;

    // No draft: the party already exists, so the run opens on the map.
    run.promptStack = [];
    run.pending = null;
    run.phase = 'map';
    refreshAvailableNodes(run);
    logEvent(run, `Rebirth ${run.rebirth}: the team begins again at level ${STARTING_LEVEL}.`);
    syncRng(run);
    // One rebirth per clear. The finished run stays in its slot showing its
    // result, so without this the same victory could be spent over and over for
    // an unlimited supply of fully-built starting teams.
    finishedRun.rebirthUsed = true;
    return run;
  }

  /**
   * Which meta unlocks a finished run earns.
   *
   * Pure: it reads a summary and the profile's lifetime records and returns the
   * rows to award, mutating nothing. That is what lets it be tested — the old
   * version was a stack of `if`s inside a UI file.
   *
   * @param {object} profile  `{unlocks, records}` from the save
   * @param {object} run      the finished run
   * @returns {object[]} the UNLOCKS rows newly earned
   */
  function evaluateUnlocks(profile, run) {
    const unlocks = profile.unlocks || {};
    const campaign = profile.records?.campaign || {};
    const won = run.phase === 'victory' || run.won === true;
    const context = {
      won,
      difficulty: run.difficulty,
      assistOnly: !!run.stats?.assistOnly,
      ascension: run.ascension ?? 0,
      acts: actCount(run),
      // Lifetime totals, including this run — a run that pushes the counter over
      // the line should pay out immediately rather than on the next one.
      recruited: (campaign.totalRecruited || 0) + (run.stats?.recruits || 0),
      clears: (campaign.wins || 0) + (won ? 1 : 0),
    };
    return Content.UNLOCKS.filter(entry => {
      const track = unlocks[entry.grants.track] || [];
      if (track.includes(entry.grants.id)) return false;
      return Content.unlockSatisfied(entry, context);
    });
  }

  /**
   * Is this run still eligible for the cleared-with-Assist unlocks, and is that
   * worth telling the player about?
   *
   * `run.stats.assistOnly` is one-way and invisible: a single hand-played
   * battle forfeits it for the rest of the run, and the player would otherwise
   * only find out on the end screen — after twenty-odd battles. The easiest way
   * to lose it by accident is pressing "Start battle" at Team Preview, which
   * counts as acting, so the state is worth surfacing while it can still be
   * acted on.
   *
   * Rows are read from `Content.UNLOCKS` rather than hardcoding Veteran and
   * Master, so a third assist-only unlock is picked up automatically — the same
   * reason the unlocks became data in the first place.
   *
   * Returns `null` when there is nothing to say: no assist-only unlock applies
   * to this difficulty, or every one that does is already owned. A chip that
   * tracks a reward you cannot earn is worse than no chip.
   *
   * @param {object} run
   * @param {object} profile `{unlocks}` from the save
   * @returns {?{intact: boolean, targets: string[], hint: string}}
   */
  function assistOnlyStatus(run, profile = {}) {
    if (!run || !run.stats) return null;
    const unlocks = profile.unlocks || {};
    const pending = Content.UNLOCKS.filter(entry => {
      if (!entry.requires?.assistOnly) return false;
      // A row with no difficulty requirement applies to every difficulty.
      if (entry.requires.difficulty && entry.requires.difficulty !== run.difficulty) return false;
      return !(unlocks[entry.grants.track] || []).includes(entry.grants.id);
    });
    if (!pending.length) return null;
    return {
      intact: !!run.stats.assistOnly,
      targets: pending.map(entry => entry.name),
      hint: pending[0].hint || '',
    };
  }

  function unlockedStarterPools(unlocks = {}) {
    const owned = new Set(unlocks.starterPools || ['classic']);
    return Object.values(Content.STARTER_POOLS).filter(pool => owned.has(pool.id));
  }

  function draftCandidates(run, unlocks) {
    const rng = rngOf(run);
    const pools = unlockedStarterPools(unlocks);
    const species = pools.flatMap(pool => pool.species).filter(id => Dex.hasSpecies(id));
    const format = Formats.get('campaign');
    const chosen = [];
    const typesSeen = new Set();
    let guard = 0;
    while (chosen.length < 3 && guard++ < 120) {
      const id = rng.pick(species);
      if (!id) break;
      const data = Dex.species(id);
      if (chosen.some(c => c.species === data.id)) continue;
      // Prefer typing diversity across the three offers.
      if (data.types.some(t => typesSeen.has(t)) && rng.chance(0.75)) continue;
      for (const t of data.types) typesSeen.add(t);
      chosen.push(RandomTeams.randomSet(data, rng, {format, level: STARTING_LEVEL}));
    }
    while (chosen.length < 3) {
      const id = rng.pick(species);
      if (!id) break;
      if (chosen.some(c => c.species === Dex.species(id).id)) continue;
      chosen.push(RandomTeams.randomSet(Dex.species(id), rng, {format, level: STARTING_LEVEL}));
    }
    return chosen;
  }

  function chooseStarter(run, action = {}) {
    if (run.phase !== 'draft' && run.pending?.type !== 'draft') return {ok: false, error: 'The draft is already complete.'};
    if (action.reroll) {
      if (run.rerolls <= 0) return {ok: false, error: 'No rerolls remaining.'};
      run.rerolls--;
      run.pending.options = draftCandidates(run, run.unlocks);
      run.pending.rerollsLeft = run.rerolls;
      syncRng(run);
      return {ok: true};
    }
    const set = run.pending.options[action.index];
    if (!set) return {ok: false, error: 'Invalid starter choice.'};
    addPartyMember(run, set, {level: STARTING_LEVEL});
    logEvent(run, `${PokemonLib.displayName(set)} was chosen as the first partner.`);
    run.promptStack = [];
    run.pending = null;
    run.phase = 'map';
    refreshAvailableNodes(run);
    syncRng(run);
    return {ok: true, phase: 'map'};
  }

  function endRun(run, won, reason) {
    run.phase = won ? 'victory' : 'defeat';
    run.endedAt = new Date().toISOString();
    run.result = {won, reason, turns: run.stats.nodes};
    run.pending = null;
    run.promptStack = [];
    logEvent(run, reason);
    syncRng(run);
    return {ok: true, phase: run.phase, won, reason};
  }

  function abandonRun(run) {
    return endRun(run, false, 'The run was abandoned.');
  }

  /** A compact record for the run history page. */
  function summarise(run) {
    return {
      id: run.id,
      seed: run.seed,
      seedLabel: run.seedLabel,
      difficulty: run.difficulty,
      ascension: run.ascension,
      startedAt: run.createdAt,
      endedAt: run.endedAt || null,
      won: !!run.result?.won,
      reason: run.result?.reason || null,
      act: run.act,
      teamLevel: run.teamLevel,
      nodes: run.stats.nodes,
      battlesWon: run.stats.battlesWon,
      elitesBeaten: run.stats.elitesBeaten,
      bossesBeaten: run.stats.bossesBeaten,
      bosses: [...run.defeatedBosses],
      relics: [...run.relics],
      team: run.party.map(m => ({
        species: m.set.species,
        name: PokemonLib.displayName(m.set),
        level: m.set.level,
        item: m.set.item,
        ability: m.set.ability,
        moves: [...m.set.moves],
      })),
    };
  }

  function serialize(run) {
    syncRng(run);
    const copy = {};
    for (const [key, value] of Object.entries(run)) {
      if (key.startsWith('_')) continue;
      copy[key] = value;
    }
    return JSON.parse(JSON.stringify(copy));
  }

  /** Read Assist Mode flags, tolerating runs saved before the feature existed. */
  function assistState(run) {
    if (!run.assist) run.assist = {recommend: false, autoBattle: false, plan: 'balance'};
    // Runs saved before team plans existed have no `plan`; default it on read
    // rather than migrating, since it changes no run state.
    if (!run.assist.plan) run.assist.plan = 'balance';
    return run.assist;
  }

  /**
   * Turn one Assist Mode function on or off, or set the team plan.
   *
   * `plan` is a string rather than a boolean and is validated against
   * `Content.TEAM_PLANS`, so a stale save or a hand-edited one cannot put the
   * advisor into a plan that does not exist.
   *
   * None of these touch run RNG or rules — that is what makes all three safe to
   * flip mid-run without desynchronising a seeded run. **Keep it that way:** the
   * plan may only ever be read by advice, never by generation.
   */
  function setAssist(run, key, value) {
    const state = assistState(run);
    if (key === 'plan') {
      if (Content.TEAM_PLANS.some(plan => plan.id === value)) state.plan = value;
      return state;
    }
    if (key !== 'recommend' && key !== 'autoBattle') return state;
    state[key] = !!value;
    return state;
  }

  function deserialize(data) {
    if (!data || data.version !== RUN_VERSION) return null;
    const run = JSON.parse(JSON.stringify(data));
    run._rng = RNG.fromState(run.rngState);
    assistState(run);
    run.pending = run.promptStack.length ? run.promptStack[run.promptStack.length - 1] : run.pending;
    // Re-clamp every member against its *current* max HP. A run saved before
    // Campaign dropped EVs carries a condition computed from the higher, EV-fed
    // max, which would otherwise display as "199/164" and stay permanently
    // above full. Cheap, idempotent, and it also covers any future change that
    // moves a stat.
    for (const member of run.party || []) refreshMember(run, member);
    // Heal a run already stuck on a prompt whose Pokémon has left. Without this
    // the save stays unopenable, because the prompt renders before anything
    // could clear it.
    if (pruneDanglingPrompts(run) > 0 && !run.pending && run.phase === 'prompt') {
      run.phase = 'map';
      refreshAvailableNodes(run);
    }
    return run;
  }

  global.RedGPT.Campaign = {
    RUN_VERSION, MAX_PARTY, STARTING_LEVEL, ACT_LEVEL_CAP,
    createRun, createRebirthRun, canRebirth, isRebirth, rebirthDepth,
    buildRebirthTeam, rebirthPlanFor, rebirthFieldEffects, planSpeciesFit,
    chooseStarter, enterNode, resolveBattle, resolvePrompt,
    createBattle, buildBattleConfig, endRun, abandonRun, summarise,
    serialize, deserialize, modifiers, refreshAvailableNodes, currentActMap, nodeById,
    equipHeldItem, useConsumable, healAll, canHealAll, useEvolutionItem, reorderParty, collectSurvivors,
    memberSet, memberStats, memberMaxHP, healTeam, restorePP, postBattleRecovery, addLevels, addCredits,
    addConsumable, addHeldItem, addEvolutionItem, grantRelic, teamAlive, partyMember,
    offerRecruit, buildShopStock, buildMartStock, buildBattleShopStock, partySynergyItems,
    MOVE_SYNERGY_ITEMS, ABILITY_SYNERGY_ITEMS, releaseMember, runProgress, actCount, challengeLevel, draftCandidates, unlockedStarterPools, evaluateUnlocks, assistOnlyStatus, evolveMember,
    finishNode, advanceAct, logEvent,
    assistState, setAssist,
  };
})(typeof window !== 'undefined' ? window : globalThis);
